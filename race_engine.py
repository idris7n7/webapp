"""Word Race: the rules of a race room, with no network or database in it.

A room holds up to 4 cars (people and bots). Every player answers their own stream of questions; a right answer boosts
the car, a wrong one or a timeout slows it, and the car keeps rolling at its current speed, so the first car over the
line wins. The server (server.py) feeds this module the clock, the answers and the connections, and sends whatever
events it returns. All times are passed in (seconds), so the whole thing is deterministic under test.
"""
import math
import random
import re
import secrets

TRACK = 1200.0            # distance to the finish line
BASE_SPEED = 7.0          # a car never rolls slower than this
MAX_SPEED = 75.0
DECAY = 0.45              # per second: speed falls back towards BASE_SPEED
CAPACITY = 4              # cars in a room, people and bots together
COUNTDOWN = 3.5           # seconds between "start" and "go"
Q_SECONDS = {"mc": 10.0, "typed": 16.0}   # time for one question before it counts as missed
MIN_ANSWER_SECONDS = 0.25  # nobody reads and answers faster than this
END_GRACE = 12.0          # after the first car finishes the others get this long
MAX_RACE_SECONDS = 150.0
MIN_QUESTIONS = 20
MAX_QUESTIONS = 60
MODES = ("sprint", "grammar", "recall", "mixed")
LEVELS = {"easy": (0.62, 4.6), "normal": (0.76, 3.6), "hard": (0.88, 2.8)}   # bot: (accuracy, seconds per answer)
BOTS = [("Turbo", "jack"), ("Chaqmoq", "kenji"), ("Burgut", "omar"), ("Shamol", "carlos")]
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

_APOS = re.compile(r"[ʻ’‘`]")


def norm(text) -> str:
    t = _APOS.sub("'", str(text or "").strip().lower())
    t = re.sub(r"[.!?]+$", "", t)
    return " ".join(t.split())


def new_code(existing) -> str:
    for _ in range(50):
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(4))
        if code not in existing:
            return code
    raise RuntimeError("no free room code")


# --------------------------------------------------------------------------- question checking
def verify_question(item, cards: dict, bank: list):
    """A clean copy of a question the client built, or None when it does not match the real data.

    The client builds questions from the flashcards and the grammar bank; the server re-checks every one against the same
    data, so a modified client cannot invent easy questions or wrong "right" answers.
    """
    if not isinstance(item, dict):
        return None
    k, q, a, o, w = item.get("k"), item.get("q"), item.get("a"), item.get("o"), item.get("w")
    if not isinstance(q, str) or not isinstance(a, str) or not q or not a or len(q) > 300 or len(a) > 80:
        return None
    if o is not None:
        if (not isinstance(o, list) or len(o) != 4 or len(set(o)) != 4
                or any(not isinstance(s, str) or not s or len(s) > 120 for s in o) or a not in o):
            return None
    if k == "gram":
        hit = any(g.get("q") == q and g.get("a") == a and o is not None and sorted(g.get("o", [])) == sorted(o) for g in bank)
        return {"k": "gram", "q": q, "o": o, "a": a, "w": None, "img": None, "typed": False} if hit else None
    card = cards.get(w) if isinstance(w, str) else None
    if not card:
        return None
    word, meaning = card.get("word", ""), card.get("meaning_uz", "")
    image = item.get("img") if isinstance(item.get("img"), str) else None
    if k == "en2uz":
        ok = o is not None and a == meaning and word in q
    elif k == "uz2en":
        ok = o is not None and a == word and meaning in q
    elif k == "pic":
        ok = o is not None and a == word and bool(card.get("image")) and image == card["image"]
    elif k == "def":
        ok = o is not None and a == word and bool(card.get("definition")) and card["definition"] in q
    elif k == "cloze":
        ex = card.get("example_en") or ""
        ok = o is not None and a == word and "_____" in q and norm(q.replace("_____", word)) == norm(ex)
    elif k == "recall":
        ok = o is None and a == word and ((bool(card.get("image")) and image == card["image"]) or meaning in q)
    else:
        ok = False
    if not ok:
        return None
    return {"k": k, "q": q, "o": o, "a": a, "w": w, "img": image if k in ("pic", "recall") else None, "typed": o is None}


# --------------------------------------------------------------------------- players and room
class Player:
    def __init__(self, pid, slot, name, character="", photo="", student_id=None, bot=False):
        self.pid, self.slot, self.name, self.character, self.photo = pid, slot, name, character, photo
        self.student_id, self.bot = student_id, bot
        self.connected = not bot
        self.ready = bot
        self.questions, self.qi, self.q_started = [], 0, 0.0
        self.pos = self.speed = 0.0
        self.streak = self.correct = self.wrong = 0
        self.top_speed = 0.0
        self.finished_at = None
        self.answers = []          # (word id or None, ok)
        # bots only
        self.acc, self.mean, self.next_at, self.last_answer_at = 0.7, 3.6, 0.0, 0.0

    @property
    def human(self):
        return not self.bot


class Room:
    def __init__(self, code, mode="sprint", level="normal", rng=None, now=0.0):
        self.code, self.mode, self.level = code, mode if mode in MODES else "sprint", level if level in LEVELS else "normal"
        self.rng = rng or random.Random()
        self.players = {}
        self.host = None
        self.state = "lobby"      # lobby | countdown | running | ended
        self.created_at = now
        self.start_at = self.started_at = self.last_tick = 0.0
        self.first_finish_at = None
        self.finish_order = []
        self.ended_at = None
        self.word_events = []      # (student id, word id, ok) for the vocabulary memory; the server drains it
        self._next_pid = 1

    # ---- people
    def _slot(self):
        used = {p.slot for p in self.players.values()}
        return next(i for i in range(CAPACITY) if i not in used)

    def full(self):
        return len(self.players) >= CAPACITY

    def humans(self):
        return [p for p in self.players.values() if p.human]

    def add_human(self, student_id, name, character="", photo=""):
        """The new player's id, or None when the room is full or the race has started. Joining twice returns the same player."""
        for p in self.humans():
            if p.student_id == student_id:
                p.connected = True
                return p.pid
        if self.state != "lobby" or self.full():
            return None
        pid = f"p{self._next_pid}"
        self._next_pid += 1
        self.players[pid] = Player(pid, self._slot(), name, character, photo, student_id=student_id)
        if self.host is None:
            self.host = pid
        return pid

    def remove(self, pid):
        """A player leaves. Returns True when the room is now empty of people."""
        p = self.players.get(pid)
        if p is None:
            return not self.humans()
        if self.state == "lobby":
            del self.players[pid]
            if self.host == pid:
                nxt = next(iter(self.humans()), None)
                self.host = nxt.pid if nxt else None
        else:
            p.connected = False
        return not any(h.connected for h in self.humans())

    def set_bots(self, n, level=None):
        if self.state != "lobby":
            return
        if level in LEVELS:
            self.level = level
        for p in [p for p in self.players.values() if p.bot]:
            del self.players[p.pid]
        n = max(0, min(int(n), CAPACITY - len(self.players)))
        for i in range(n):
            name, char = BOTS[i % len(BOTS)]
            pid = f"b{self._next_pid}"
            self._next_pid += 1
            bot = Player(pid, self._slot(), name, char, bot=True)
            bot.acc, bot.mean = LEVELS[self.level]
            bot.acc += self.rng.uniform(-0.06, 0.06)
            bot.mean *= self.rng.uniform(0.85, 1.2)
            self.players[pid] = bot

    def set_mode(self, mode):
        if self.state == "lobby" and mode in MODES and mode != self.mode:
            self.mode = mode
            for p in self.humans():
                p.ready, p.questions = False, []

    def set_questions(self, pid, items, cards, bank):
        """Stores the player's verified questions. Returns how many were accepted."""
        p = self.players.get(pid)
        if p is None or p.bot or self.state != "lobby" or not isinstance(items, list):
            return 0
        good = []
        for item in items[: MAX_QUESTIONS * 2]:
            v = verify_question(item, cards, bank)
            if v:
                good.append(v)
            if len(good) >= MAX_QUESTIONS:
                break
        p.questions = good
        p.ready = len(good) >= MIN_QUESTIONS
        return len(good)

    def reset_lobby(self):
        """After a finished race: the same people back in the lobby for another one (people who left are dropped)."""
        if self.state != "ended":
            return False
        for pid in [p.pid for p in self.humans() if not p.connected]:
            del self.players[pid]
        if self.host not in self.players:
            nxt = next(iter(self.humans()), None)
            self.host = nxt.pid if nxt else None
        for p in self.players.values():
            p.qi, p.q_started, p.pos, p.speed, p.streak, p.correct, p.wrong, p.top_speed = 0, 0.0, 0.0, 0.0, 0, 0, 0, 0.0
            p.finished_at, p.answers = None, []
            if p.human:
                p.ready, p.questions = False, []
        self.state, self.first_finish_at, self.finish_order, self.ended_at = "lobby", None, [], None
        self.word_events = []
        return True

    # ---- the race
    def can_start(self):
        hs = self.humans()
        return self.state == "lobby" and bool(hs) and all(h.ready for h in hs)

    def start(self, now):
        if not self.can_start():
            return False
        self.state, self.start_at = "countdown", now + COUNTDOWN
        return True

    def _first_question(self, p):
        p.qi, p.q_started = 0, self.started_at
        return {"to": p.pid, "msg": self._qmsg(p)}

    def _qmsg(self, p):
        q = p.questions[p.qi % len(p.questions)]
        return {"t": "q", "i": p.qi, "q": q["q"], "o": q["o"], "img": q["img"], "k": q["k"],
                "tl": Q_SECONDS["typed" if q["typed"] else "mc"]}

    def _boost(self, p, took, typed):
        base = 18.0 if typed else 13.0
        s = 2.0 if typed else 1.0   # typing takes longer, so its time bands are wider
        fast = 12.0 if took <= 1.5 * s else 8.0 if took <= 3 * s else 4.0 if took <= 5 * s else 0.0
        p.streak += 1
        streak = min(6.0, (p.streak - 1) * 1.5) if p.streak >= 3 else 0.0
        p.speed = min(MAX_SPEED, p.speed + base + fast + streak)
        p.top_speed = max(p.top_speed, p.speed)

    def _slow(self, p):
        p.streak = 0
        p.speed = max(BASE_SPEED, p.speed * 0.55)

    def _finish(self, p, now):
        p.pos, p.finished_at = TRACK, now
        self.finish_order.append(p.pid)
        if self.first_finish_at is None:
            self.first_finish_at = now

    def answer(self, pid, qi, text, now):
        """A human answers question `qi`. Returns the events to send."""
        p = self.players.get(pid)
        if self.state != "running" or p is None or p.bot or p.finished_at is not None or not p.questions:
            return []
        if qi != p.qi:
            return []
        took = now - p.q_started
        if took < MIN_ANSWER_SECONDS:
            return []
        q = p.questions[p.qi % len(p.questions)]
        ok = norm(text) == norm(q["a"])
        return self._resolve(p, q, ok, took, now, timeout=False)

    def _resolve(self, p, q, ok, took, now, timeout):
        if ok:
            p.correct += 1
            self._boost(p, took, q["typed"])
        else:
            p.wrong += 1
            self._slow(p)
        p.answers.append((q["w"], ok))
        if q["w"] and p.student_id:
            self.word_events.append((p.student_id, q["w"], ok))
        events = [{"to": p.pid, "msg": {"t": "res", "i": p.qi, "ok": ok, "a": q["a"], "timeout": timeout, "v": round(p.speed, 1), "streak": p.streak}}]
        p.qi += 1
        p.q_started = now
        if p.finished_at is None:
            events.append({"to": p.pid, "msg": self._qmsg(p)})
        return events

    def tick(self, now):
        """Moves the race on to `now`. Returns the events to send (the caller also checks .state for the end)."""
        events = []
        if self.state == "countdown" and now >= self.start_at:
            self.state, self.started_at, self.last_tick = "running", self.start_at, self.start_at
            events.append({"to": None, "msg": {"t": "go", "at": self.start_at}})
            for p in self.players.values():
                p.speed = BASE_SPEED
                if p.bot:
                    p.last_answer_at = self.started_at
                    p.next_at = self.started_at + self.rng.uniform(0.6, 1.4) * p.mean
                elif p.questions:
                    events.append(self._first_question(p))
            return events
        if self.state != "running":
            return events
        dt = max(0.0, now - self.last_tick)
        self.last_tick = now
        for p in self.players.values():
            if p.finished_at is not None:
                continue
            p.speed = BASE_SPEED + max(0.0, p.speed - BASE_SPEED) * math.exp(-DECAY * dt)
            p.pos += p.speed * dt
            if p.pos >= TRACK:
                self._finish(p, now)
                continue
            if p.bot:
                while p.finished_at is None and p.next_at <= now:
                    ok = self.rng.random() < p.acc
                    took = max(0.5, p.next_at - p.last_answer_at)
                    if ok:
                        p.correct += 1
                        self._boost(p, took, False)
                    else:
                        p.wrong += 1
                        self._slow(p)
                    p.last_answer_at = p.next_at
                    p.next_at += min(10.0, max(1.2, self.rng.gauss(p.mean, p.mean * 0.35)))
            elif p.connected and p.questions:
                q = p.questions[p.qi % len(p.questions)]
                limit = Q_SECONDS["typed" if q["typed"] else "mc"]
                if now - p.q_started >= limit:
                    events += self._resolve(p, q, False, limit, now, timeout=True)
        self._maybe_end(now)
        return events

    def _maybe_end(self, now):
        humans = [h for h in self.humans() if h.connected]
        if (not humans
                or all(h.finished_at is not None for h in humans)
                or (self.first_finish_at is not None and now - self.first_finish_at >= END_GRACE)
                or now - self.started_at >= MAX_RACE_SECONDS):
            self.state, self.ended_at = "ended", now

    # ---- what clients see
    def lobby(self):
        return {"t": "lobby", "code": self.code, "mode": self.mode, "level": self.level, "host": self.host, "cap": CAPACITY,
                "state": self.state, "canStart": self.can_start(),
                "players": [{"id": p.pid, "slot": p.slot, "name": p.name, "character": p.character, "photo": p.photo,
                             "bot": p.bot, "ready": p.ready, "online": p.connected} for p in sorted(self.players.values(), key=lambda x: x.slot)]}

    def snapshot(self, now):
        return {"t": "state", "now": now, "st": self.state, "track": TRACK,
                "players": [{"id": p.pid, "slot": p.slot, "pos": round(p.pos, 1), "v": round(p.speed, 1),
                             "done": p.finished_at is not None, "ok": p.correct, "bad": p.wrong} for p in self.players.values()]}

    def results(self):
        """Final order: cars that crossed the line by finishing time, then the rest by distance."""
        done = [self.players[i] for i in self.finish_order]
        rest = sorted((p for p in self.players.values() if p.finished_at is None), key=lambda p: -p.pos)
        out = []
        for rank, p in enumerate(done + rest, 1):
            asked = p.correct + p.wrong
            out.append({"id": p.pid, "slot": p.slot, "name": p.name, "character": p.character, "photo": p.photo, "bot": p.bot,
                        "rank": rank, "finished": p.finished_at is not None,
                        "time": round(p.finished_at - self.started_at, 1) if p.finished_at is not None else None,
                        "pos": round(p.pos, 1), "correct": p.correct, "wrong": p.wrong,
                        "accuracy": round(100 * p.correct / asked) if asked else 0, "top": round(p.top_speed, 1),
                        "student_id": p.student_id})
        return out
