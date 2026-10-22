"""Word Race rules (race_engine.py). Run: python -m unittest discover -s tests   (from the "Level One app" folder)."""
import json
import os
import random
import sys
import unittest

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

import race_engine as R  # noqa: E402


def load_js_array(name):
    with open(os.path.join(APP, "static", name), encoding="utf-8") as f:
        text = f.read()
    data, _ = json.JSONDecoder().raw_decode(text[text.index("["):])
    return data


CARDS = {c["id"]: c for c in load_js_array("flashcards_data.js")}
BANK = load_js_array("millionaire_data.js")


def en2uz(card, others):
    return {"k": "en2uz", "q": f"“{card['word']}” — o'zbekcha qanday?", "o": [card["meaning_uz"]] + [c["meaning_uz"] for c in others],
            "a": card["meaning_uz"], "w": card["id"]}


def questions(n=25):
    cs = [c for c in CARDS.values() if c["unit"] == "1d" or c["unit"] == "1a"]
    out = []
    for i in range(n):
        c = cs[i % len(cs)]
        others = [x for x in cs if x["id"] != c["id"] and x["meaning_uz"] != c["meaning_uz"]][:3]
        out.append(en2uz(c, others))
    return out


def ready_room(humans=1, bots=0, seed=1, level="normal"):
    room = R.Room("ABCD", rng=random.Random(seed))
    pids = []
    for i in range(humans):
        pid = room.add_human(f"stu_{i}", f"Player {i}")
        pids.append(pid)
        assert room.set_questions(pid, questions(), CARDS, BANK) >= R.MIN_QUESTIONS
    room.set_bots(bots, level)
    return room, pids


def run_to_go(room, t0=100.0):
    assert room.start(t0)
    room.tick(t0 + R.COUNTDOWN + 0.01)
    return t0 + R.COUNTDOWN


class VerifyQuestionTests(unittest.TestCase):
    def test_genuine_questions_pass_and_tampered_ones_fail(self):
        card = CARDS["w1_a01"]
        good = questions(1)[0]
        good = en2uz(card, [CARDS["w1_a02"], CARDS["w1_a03"], CARDS["w1_a04"]])
        self.assertIsNotNone(R.verify_question(good, CARDS, BANK))
        self.assertIsNone(R.verify_question(dict(good, a=good["o"][1]), CARDS, BANK))          # wrong "right" answer
        self.assertIsNone(R.verify_question(dict(good, q="Choose the first one."), CARDS, BANK))  # question made trivial
        self.assertIsNone(R.verify_question(dict(good, w="nope"), CARDS, BANK))
        self.assertIsNone(R.verify_question(dict(good, o=good["o"][:3]), CARDS, BANK))          # not four options
        self.assertIsNone(R.verify_question(dict(good, o=[good["a"]] * 4), CARDS, BANK))
        self.assertIsNone(R.verify_question("junk", CARDS, BANK))

    def test_every_kind_the_browser_builds_is_accepted(self):
        pic = CARDS["w1_a01"]
        self.assertTrue(pic.get("image"))
        items = [
            {"k": "pic", "q": "What is this?", "img": pic["image"], "o": [pic["word"], "actor", "artist", "nurse"], "a": pic["word"], "w": pic["id"]},
            {"k": "uz2en", "q": f"“{pic['meaning_uz']}” — inglizcha qanday?", "o": [pic["word"], "actor", "artist", "nurse"], "a": pic["word"], "w": pic["id"]},
            {"k": "def", "q": f"Which word means: “{pic['definition']}”", "o": [pic["word"], "actor", "artist", "nurse"], "a": pic["word"], "w": pic["id"]},
            {"k": "recall", "q": "Write the word for this picture.", "img": pic["image"], "o": None, "a": "actor", "w": "w1_a02"},
        ]
        items[3]["img"] = CARDS["w1_a02"]["image"]
        for it in items:
            self.assertIsNotNone(R.verify_question(it, CARDS, BANK), it["k"])
        g = BANK[0]
        self.assertIsNotNone(R.verify_question({"k": "gram", "q": g["q"], "o": g["o"], "a": g["a"]}, CARDS, BANK))
        self.assertIsNone(R.verify_question({"k": "gram", "q": g["q"], "o": g["o"], "a": g["o"][0] if g["o"][0] != g["a"] else g["o"][1]}, CARDS, BANK))
        cloze_card = next(c for c in CARDS.values() if c["word"].lower() in c["example_en"].lower() and " " not in c["word"] and "—" not in c["word"])
        blank = R.re.sub(R.re.escape(cloze_card["word"]), "_____", cloze_card["example_en"], count=1, flags=R.re.I)
        self.assertIsNotNone(R.verify_question({"k": "cloze", "q": blank, "o": [cloze_card["word"], "x1", "x2", "x3"], "a": cloze_card["word"], "w": cloze_card["id"]}, CARDS, BANK))


class RoomTests(unittest.TestCase):
    def test_lobby_rules(self):
        room = R.Room("ABCD")
        a = room.add_human("s1", "Ali")
        self.assertEqual(room.host, a)
        self.assertEqual(room.add_human("s1", "Ali"), a)  # joining twice is the same player
        room.set_bots(9)
        self.assertEqual(len(room.players), R.CAPACITY)  # bots only fill the free cars
        self.assertIsNone(room.add_human("s2", "Vali"))   # the room is full
        room.set_bots(1)
        b = room.add_human("s2", "Vali")
        self.assertIsNotNone(b)
        self.assertFalse(room.can_start())                # nobody has their questions yet
        room.set_questions(a, questions(), R.__dict__ and CARDS, BANK)
        self.assertFalse(room.can_start())                # one player is still not ready
        room.set_questions(b, questions(), CARDS, BANK)
        self.assertTrue(room.can_start())
        room.set_mode("recall")
        self.assertFalse(room.can_start())                # a new mode needs new questions
        room.remove(a)
        self.assertEqual(room.host, b)                    # the host left: the next person leads

    def test_questions_must_be_enough_and_real(self):
        room = R.Room("ABCD")
        a = room.add_human("s1", "Ali")
        self.assertEqual(room.set_questions(a, questions(5), CARDS, BANK), 5)
        self.assertFalse(room.players[a].ready)
        fake = [dict(q, a="hacked") for q in questions(30)]
        self.assertEqual(room.set_questions(a, fake, CARDS, BANK), 0)

    def test_right_answers_speed_the_car_up_and_wrong_ones_slow_it(self):
        room, (p,) = ready_room()
        t = run_to_go(room)
        car = room.players[p]
        first = car.questions[0]
        events = room.answer(p, 0, first["a"], t + 1.0)
        self.assertTrue(events[0]["msg"]["ok"])
        self.assertEqual(events[1]["msg"]["t"], "q")
        self.assertEqual(events[1]["msg"]["i"], 1)
        fast = car.speed
        self.assertGreater(fast, R.BASE_SPEED + 20)       # base boost + quick-answer bonus
        room.answer(p, 1, "definitely wrong", t + 2.0)
        self.assertLess(car.speed, fast * 0.6)
        self.assertEqual((car.correct, car.wrong, car.streak), (1, 1, 0))
        # a quicker answer is worth more than a slow one
        a, b = R.Room("X"), R.Room("Y")
        pa, pb = a.add_human("s", "A"), b.add_human("s", "B")
        for r_, pid in ((a, pa), (b, pb)):
            r_.set_questions(pid, questions(), CARDS, BANK)
            r_.start(0.0); r_.tick(R.COUNTDOWN + 0.01)
        a.answer(pa, 0, a.players[pa].questions[0]["a"], R.COUNTDOWN + 1.0)
        b.answer(pb, 0, b.players[pb].questions[0]["a"], R.COUNTDOWN + 8.0)
        self.assertGreater(a.players[pa].speed, b.players[pb].speed)

    def test_cheating_answers_are_ignored(self):
        room, (p,) = ready_room()
        t = run_to_go(room)
        self.assertEqual(room.answer(p, 0, room.players[p].questions[0]["a"], t + 0.05), [])   # nobody answers in 50 ms
        self.assertEqual(room.answer(p, 7, "x", t + 3), [])                                   # not the current question
        self.assertEqual(room.answer("nobody", 0, "x", t + 3), [])
        room.answer(p, 0, room.players[p].questions[0]["a"], t + 3)
        self.assertEqual(room.answer(p, 0, room.players[p].questions[0]["a"], t + 4), [])     # the same question twice

    def test_a_missed_question_times_out_and_feeds_the_word_memory(self):
        room, (p,) = ready_room()
        t = run_to_go(room)
        events = room.tick(t + R.Q_SECONDS["mc"] + 0.1)
        res = [e["msg"] for e in events if e["msg"]["t"] == "res"]
        self.assertEqual((len(res), res[0]["ok"], res[0]["timeout"]), (1, False, True))
        self.assertEqual(room.word_events, [("stu_0", room.players[p].questions[0]["w"], False)])

    def test_first_car_over_the_line_wins_and_the_race_ends(self):
        room, pids = ready_room(humans=2)
        t = run_to_go(room)
        a, b = pids
        now = t
        while room.state == "running" and now < t + 140:
            now += 0.5
            for pid, gap in ((a, 1.2), (b, 5.0)):
                car = room.players[pid]
                if car.finished_at is None and now - car.q_started >= gap:
                    room.answer(pid, car.qi, car.questions[car.qi % len(car.questions)]["a"], now)
            room.tick(now)
        res = room.results()
        self.assertEqual([r["id"] for r in res], [a, b])
        self.assertTrue(res[0]["finished"] and res[0]["time"] < res[1]["time"] if res[1]["finished"] else res[0]["finished"])
        self.assertEqual(room.state, "ended")
        self.assertEqual(res[0]["accuracy"], 100)

    def test_the_race_ends_when_everyone_has_left_or_time_runs_out(self):
        room, (p,) = ready_room()
        t = run_to_go(room)
        room.remove(p)
        room.tick(t + 1)
        self.assertEqual(room.state, "ended")
        room, (p,) = ready_room()
        t = run_to_go(room)
        now = t
        while room.state == "running":
            now += 1
            room.tick(now)
            if now > t + 400:
                self.fail("race never ended")
        self.assertLessEqual(now - t, R.MAX_RACE_SECONDS + 2)

    def test_bots_race_on_their_own_and_hard_bots_beat_easy_ones(self):
        wins = {"easy": 0, "hard": 0}
        for seed in range(8):
            room, (p,) = ready_room(bots=2, seed=seed)       # one person who just watches, two bots
            easy, hard = [b for b in room.players.values() if b.bot]
            easy.acc, easy.mean = R.LEVELS["easy"]
            hard.acc, hard.mean = R.LEVELS["hard"]
            t = run_to_go(room)
            now = t
            while room.state == "running" and now < t + 200:
                now += 0.2
                room.tick(now)
            self.assertEqual(room.state, "ended")
            rank = {r["id"]: r["rank"] for r in room.results()}
            wins["hard" if rank[hard.pid] < rank[easy.pid] else "easy"] += 1
        self.assertGreater(wins["hard"], wins["easy"])

    def test_snapshot_and_lobby_are_plain_data(self):
        room, (p,) = ready_room(bots=2)
        lobby = room.lobby()
        self.assertEqual((lobby["code"], len(lobby["players"]), lobby["canStart"]), ("ABCD", 3, True))
        t = run_to_go(room)
        snap = room.snapshot(t + 1)
        self.assertEqual(snap["st"], "running")
        json.dumps(snap), json.dumps(lobby), json.dumps(room.results())


if __name__ == "__main__":
    unittest.main()
