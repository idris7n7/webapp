"""
Level One App — Unified Telegram Bot + Mini App Web Server
==========================================================
Runs BOTH:
1. The Web Server hosting the Telegram Mini App (`static/index.html`) and REST API
   (`/api/auth/*`, `/api/state`, `/api/submit`, `/api/exercises`, `/api/students`,
   `/api/user_status`)
2. The Telegram Bot (`python-telegram-bot` v20+) with WebApp Menu Button, Channel
   deep-link posting, registration approvals and Teacher Reports (`/teacher`).

Security model
--------------
* Every data endpoint requires a session token (`Authorization: Bearer <token>`).
  Tokens are issued by `/api/auth/login`, `/api/auth/register` or
  `/api/auth/telegram` (which verifies Telegram's signed `initData`).
* Roles (`student` / `teacher` / `admin`) are always read from the database,
  never from the client. Teachers need admin approval after registering.
* Passwords are stored with PBKDF2-HMAC-SHA256 and a per-user salt.
* No credentials are hardcoded: secrets come from environment variables / `.env`.

Quick Start on Server:
----------------------
1. pip install -r requirements.txt
2. export BOT_TOKEN="your_botfather_token"
   export WEBAPP_URL="https://your-domain-or-server.com"
   export TEACHER_IDS="123456789"        # numeric Telegram ids of admins
   export CHANNEL_ID="@your_channel_username"
   export DB_PATH="/data/level_one.db"   # optional: put the database on a persistent disk
3. python server.py
"""

import asyncio
import contextlib
import gzip
import csv
import hashlib
import ipaddress
import hmac
import io
import json
import logging
import math
import mimetypes
import os
import random
import re
import secrets
import sqlite3
import sys
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from urllib.parse import parse_qsl

from aiohttp import WSMsgType, web, web_fileresponse
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    Update,
    WebAppInfo,
)
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
)

import green_city
import race_engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _env_file_candidates():
    return [
        os.path.join(BASE_DIR, ".env"),
        os.path.join(os.path.dirname(BASE_DIR), ".env"),
        os.path.join(os.getcwd(), ".env"),
    ]


def _parse_env_file(path):
    values = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    values[k.strip()] = v.strip().strip("'\"")
    except OSError:
        pass
    return values


def _load_env_file():
    for env_path in _env_file_candidates():
        if os.path.isfile(env_path):
            for k, v in _parse_env_file(env_path).items():
                if k not in os.environ:
                    os.environ[k] = v


def _read_env_file_value(key):
    """Current value of `key` in the first existing .env file (None if absent)."""
    for env_path in _env_file_candidates():
        if os.path.isfile(env_path):
            return _parse_env_file(env_path).get(key)
    return None


_load_env_file()

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-server-domain.com")
# No default admin: an unset TEACHER_IDS must never promote a random Telegram user.
RAW_TEACHER_IDS = os.getenv("TEACHER_IDS", "")
TEACHER_IDS = {
    int(x.strip()) for x in RAW_TEACHER_IDS.split(",") if x.strip().isdigit()
}
CHANNEL_ID = os.getenv("CHANNEL_ID", "@your_channel_username")
PORT = int(os.getenv("PORT", "8080"))

DB_PATH = os.getenv("DB_PATH") or os.path.join(BASE_DIR, "level_one.db")
EXERCISES_JSON_PATH = os.path.join(BASE_DIR, "exercises_data.json")
# The grammar lessons in teaching order, each with the workbook exercises that become its daily homework.
HOMEWORK_UNITS_PATH = os.path.join(BASE_DIR, "homework_units.json")
HOMEWORK_PREFIX = "hw_"
HOMEWORK_DEADLINE = 4102444800  # 2100-01-01: daily homework never expires
# Windows' registry has no entry for .webp (the book pages and photos), and aiohttp keeps its own MimeTypes table.
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("application/manifest+json", ".webmanifest")
web_fileresponse.CONTENT_TYPES.add_type("image/webp", ".webp")
web_fileresponse.CONTENT_TYPES.add_type("application/manifest+json", ".webmanifest")
STATIC_DIR = os.path.join(BASE_DIR, "static")
STATIC_INDEX_PATH = os.path.join(STATIC_DIR, "index.html")

SESSION_TTL_SECONDS = 30 * 24 * 3600
TELEGRAM_AUTH_MAX_AGE = 24 * 3600
PBKDF2_ITERATIONS = 200_000
MAX_BODY_BYTES = 2 * 1024 * 1024
LEVELS = ["A1", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1-C2"]

# Points for one question by the try it was solved on: 1st try 25, 2nd 15, 3rd or 4th 5.
POINTS_BY_TRY = (25, 15, 5, 5)
MAX_TRIES = len(POINTS_BY_TRY)
HINT_AFTER_TRIES = 2
# Answers given after the deadline still count, for half the points.
LATE_POINTS_DIVISOR = 2
# Games are for practice; this cap keeps the homework the main source of rating points.
GAME_DAILY_POINTS_CAP = int(os.getenv("GAME_DAILY_POINTS_CAP", "50"))
# Pomodoro focus: one finished 25-minute block earns one tree, which the student plants on the Yashil shahar map.
FOCUS_SECONDS = int(os.getenv("FOCUS_SECONDS", "1500"))
FOCUS_GRACE_SECONDS = 3  # clock jitter between the phone and the server
FOCUS_CLAIM_SECONDS = 12 * 3600  # a finished block can still be claimed for half a day (app closed meanwhile)
FOCUS_PAUSE_SECONDS = 600  # a pause stops the clock, but all pauses of one block together may last this long
FOCUS_DAILY_TREES = 12  # 6 hours of focus per day
FOCUS_REWARDED_TREES = 6  # trees per day that also earn points
FOCUS_POINTS_PER_TREE = 10
GREEN_ZONES = green_city.Zones()
GREEN_MAX_ZONE_POINTS = 60  # a teacher-drawn area may have this many corners
# Shared vocabulary memory (spaced repetition): a word moves up a Leitner box on every right answer and falls back on a
# mistake. WORD_BOX_DAYS[box] is how long it rests before it is due again; from MASTERED_BOX on it counts as learned.
WORD_BOX_DAYS = (0.25, 1, 3, 7, 14, 30)
WORD_MASTERED_BOX = 4
WORD_RETRY_SECONDS = 600  # a missed word comes back soon
WORD_MAX_REPORT = 80
WORD_MAX_PER_WORD = 3  # one report counts a word at most this many times
# Games report one round at a time (the dragon chase can run longer than the 6-10 question rounds); a second report
# for the same game needs GAME_MIN_SECONDS to pass.
GAME_MAX_QUESTIONS = 60
GAME_MIN_SECONDS = 15
# Self-registration is closed by default: students sign in through Telegram or take over a roster entry a teacher
# created. Set ALLOW_SELF_REGISTRATION=1 to let anyone create an account with the register API.
ALLOW_SELF_REGISTRATION = os.getenv("ALLOW_SELF_REGISTRATION", "").strip().lower() in ("1", "true", "yes")
# Students come in with a name, an avatar and a level, no password (POST /api/auth/join). Set OPEN_JOIN=0 to close that door.
OPEN_JOIN = os.getenv("OPEN_JOIN", "1").strip().lower() not in ("0", "false", "no", "off")
# Extra proxy addresses (comma separated) whose CF-Connecting-IP / X-Forwarded-For headers are believed.
TRUSTED_PROXIES = {x.strip() for x in os.getenv("TRUSTED_PROXIES", "").split(",") if x.strip()}
# Weeks (Monday 00:00) and deadlines are shown in this zone. Uzbekistan is UTC+5.
TZ_OFFSET_HOURS = int(os.getenv("TZ_OFFSET_HOURS", "5"))
LOCAL_TZ = timezone(timedelta(hours=TZ_OFFSET_HOURS))
AVATAR_MAX_AGE = 3 * 24 * 3600

# Passwords that used to be hardcoded in earlier versions of this file. They are
# public knowledge now, so any account still protected by one of them is locked.
_LEAKED_PASSWORD_HASHES = (
    "cf4b0cf0c2704d7959258f2c5f5f28bbb05c2424661bd49e79376fae7bf50dbe",
    "7da5458305e85d8c103fd3a615a28bfc6c927271a652ce8b620cda531594cbef",
    "7e82877edad7b299c2a693216a547235eb50ea9851da41a1c9fbd44b48dcf260",
)
_LEGACY_SALT = "level_up_salt_2026"

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)
# httpx logs every request URL at INFO level, and Telegram API URLs contain the bot token.
for _noisy_logger in ("httpx", "httpcore"):
    logging.getLogger(_noisy_logger).setLevel(logging.WARNING)

# Global reference to Telegram Application for sending notifications
TG_APP = None
_BACKGROUND_TASKS = set()


def bot_token_configured() -> bool:
    return bool(BOT_TOKEN) and BOT_TOKEN != "YOUR_BOT_TOKEN_HERE"


def spawn(coro):
    """create_task that keeps a strong reference until the task finishes."""
    task = asyncio.create_task(coro)
    _BACKGROUND_TASKS.add(task)
    task.add_done_callback(_BACKGROUND_TASKS.discard)
    return task


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------
class ApiError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.message = message
        self.status = status


def now_str() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


_TAG_RE = re.compile(r"</?[A-Za-z!][^>]*>")


def clean_text(value, max_len: int) -> str:
    """str(value) without control characters or HTML tags, trimmed and length-limited."""
    text = "" if value is None else str(value)
    text = "".join(ch for ch in text if ch == "\n" or ch >= " " and ch != "\x7f")
    # Stored text may later be shown on a page: tags never get in (a second line of defence after escaping on the page).
    text = _TAG_RE.sub("", text)
    return text.strip()[:max_len]


def name_key(name: str) -> str:
    return " ".join(str(name).split()).casefold()


_NAME_PUNCT = set(" '’ʻʼ‘`-.")


def is_valid_person_name(value: str) -> bool:
    """Registration names: letters plus a few separators (blocks markup like <b>)."""
    return (
        1 < len(value) <= 40
        and any(ch.isalpha() for ch in value)
        and all(ch.isalpha() or ch in _NAME_PUNCT for ch in value)
    )


def sanitize_display_name(value, fallback: str) -> str:
    """Telegram profile names may hold emoji/symbols; only strip markup-significant chars."""
    text = clean_text(value, 80)
    text = re.sub(r"[<>&\"\\]", "", text)
    text = " ".join(text.split())
    return text or fallback


def _is_trusted_proxy(remote: str) -> bool:
    """Proxy headers are only believed from a proxy on this machine / private network (the tunnel, Render, Docker)."""
    if not remote:
        return False
    if remote in TRUSTED_PROXIES:
        return True
    try:
        ip = ipaddress.ip_address(remote)
    except ValueError:
        return False
    return ip.is_loopback or ip.is_private


def client_ip(request: web.Request) -> str:
    """The caller's address. A client that reaches the server directly cannot choose it with a forged header."""
    remote = request.remote or ""
    if _is_trusted_proxy(remote):
        forwarded = request.headers.get("CF-Connecting-IP") or request.headers.get("X-Forwarded-For", "").split(",")[0]
        try:
            return str(ipaddress.ip_address((forwarded or "").strip()))
        except ValueError:
            pass
    return remote or "unknown"


# ---------------------------------------------------------------------------
# Rate limiting (in-memory, per process)
# ---------------------------------------------------------------------------
class RateLimiter:
    def __init__(self):
        self._hits = defaultdict(deque)

    def hit(self, key: str, limit: int, window: int) -> bool:
        """Records an attempt; returns False when `key` exceeded `limit` per `window` s."""
        now = time.monotonic()
        q = self._hits[key]
        while q and now - q[0] > window:
            q.popleft()
        if len(q) >= limit:
            return False
        q.append(now)
        if len(self._hits) > 20000:
            self._prune(now, window)
        return True

    def _prune(self, now, window):
        for k in [k for k, q in self._hits.items() if not q or now - q[-1] > window]:
            self._hits.pop(k, None)

    def reset(self):
        self._hits.clear()


RATE_LIMITER = RateLimiter()


def enforce_rate_limit(key: str, limit: int, window: int):
    if not RATE_LIMITER.hit(key, limit, window):
        raise ApiError("Juda ko'p urinish. Birozdan so'ng qaytadan urinib ko'ring.", 429)


# ---------------------------------------------------------------------------
# SQLite Database Setup
# ---------------------------------------------------------------------------
@contextlib.contextmanager
def get_db():
    """Connection that commits on success, rolls back on error and is always closed."""
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), PBKDF2_ITERATIONS
    )
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${digest.hex()}"


def _legacy_hash(password: str) -> str:
    return hashlib.sha256((_LEGACY_SALT + password).encode("utf-8")).hexdigest()


def verify_password(password: str, stored) -> bool:
    if not stored:
        return False
    if stored.startswith("pbkdf2_sha256$"):
        try:
            _, iterations, salt, expected = stored.split("$")
            digest = hashlib.pbkdf2_hmac(
                "sha256", password.encode("utf-8"), bytes.fromhex(salt), int(iterations)
            )
        except (ValueError, TypeError):
            return False
        return hmac.compare_digest(digest.hex(), expected)
    return hmac.compare_digest(_legacy_hash(password), stored)


def needs_rehash(stored) -> bool:
    return bool(stored) and not stored.startswith("pbkdf2_sha256$")


async def run_blocking(func, *args):
    """PBKDF2 is CPU heavy: keep it off the event loop."""
    return await asyncio.get_running_loop().run_in_executor(None, func, *args)


def homework_units() -> list:
    try:
        with open(HOMEWORK_UNITS_PATH, encoding="utf-8") as fh:
            return [u for u in json.load(fh) if u.get("id") and u.get("exerciseIds")]
    except (OSError, ValueError):
        return []


def ensure_homework(conn: sqlite3.Connection) -> None:
    """One permanent, server-graded homework per lesson (id hw_<lesson id>); students meet them in lesson order."""
    for unit in homework_units():
        asg_id = HOMEWORK_PREFIX + unit["id"]
        fields = (
            f"{unit['number']}-dars: {unit['title']}", f"{unit.get('week', '')} · {unit['number']}-dars",
            json.dumps(unit["exerciseIds"]),
        )
        if conn.execute("SELECT 1 FROM assignments WHERE id = ?", (asg_id,)).fetchone():
            conn.execute(
                "UPDATE assignments SET title = ?, week_label = ?, exercise_ids_json = ? WHERE id = ?", (*fields, asg_id)
            )
        else:
            # announced / reminded / summarized = 1: the bot never sends messages for these
            conn.execute(
                "INSERT INTO assignments (id, title, week_label, note, exercise_ids_json, starts_at, deadline, created_by, "
                "created_at, announced, reminded, summarized) VALUES (?, ?, ?, '', ?, 0, ?, 'system', ?, 1, 1, 1)",
                (asg_id, fields[0], fields[1], fields[2], HOMEWORK_DEADLINE, int(time.time())),
            )


def previous_homework_open(conn: sqlite3.Connection, student_id: str, asg_id: str) -> bool:
    """True when the homework before this one (in lesson order) is not finished yet."""
    order = [HOMEWORK_PREFIX + u["id"] for u in homework_units()]
    if asg_id not in order or order.index(asg_id) == 0:
        return False
    prev = get_assignment(conn, order[order.index(asg_id) - 1])
    if prev is None:
        return False
    exercises = assignment_exercises(prev, exercises_by_id(conn))
    rows = conn.execute(
        "SELECT * FROM answer_log WHERE student_id = ? AND assignment_id = ?", (student_id, prev["id"])
    ).fetchall()
    return not progress_for(rows, exercises, prev["deadline"])["done"]


def init_db() -> None:
    parent = os.path.dirname(os.path.abspath(DB_PATH))
    os.makedirs(parent, exist_ok=True)
    with get_db() as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                role TEXT DEFAULT 'student',
                level TEXT DEFAULT 'A1',
                status TEXT DEFAULT 'pending',
                class_name TEXT NOT NULL DEFAULT 'Level 1',
                created_at TEXT NOT NULL,
                password_hash TEXT
            );

            CREATE TABLE IF NOT EXISTS attempts (
                attempt_id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                student_name TEXT NOT NULL,
                exercise_id TEXT NOT NULL,
                exercise_title TEXT NOT NULL,
                category TEXT NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                mistakes_json TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS custom_exercises (
                id TEXT PRIMARY KEY,
                exercise_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL
            );

            -- Weekly homework published by a teacher. Times are unix seconds.
            CREATE TABLE IF NOT EXISTS assignments (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                week_label TEXT NOT NULL DEFAULT '',
                note TEXT NOT NULL DEFAULT '',
                exercise_ids_json TEXT NOT NULL,
                starts_at INTEGER NOT NULL,
                deadline INTEGER NOT NULL,
                created_by TEXT,
                created_at INTEGER NOT NULL,
                announced INTEGER NOT NULL DEFAULT 0,
                reminded INTEGER NOT NULL DEFAULT 0,
                summarized INTEGER NOT NULL DEFAULT 0
            );

            -- One row per student per assignment question: the server grades every try.
            CREATE TABLE IF NOT EXISTS answer_log (
                student_id TEXT NOT NULL,
                assignment_id TEXT NOT NULL,
                exercise_id TEXT NOT NULL,
                q_index INTEGER NOT NULL,
                tries INTEGER NOT NULL DEFAULT 0,
                solved INTEGER NOT NULL DEFAULT 0,
                points INTEGER NOT NULL DEFAULT 0,
                last_wrong TEXT NOT NULL DEFAULT '',
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (student_id, assignment_id, exercise_id, q_index)
            );

            -- Every point a student earns (assignments and games); ratings are sums over it.
            CREATE TABLE IF NOT EXISTS points_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                source TEXT NOT NULL,
                ref TEXT NOT NULL DEFAULT '',
                points INTEGER NOT NULL,
                created_at INTEGER NOT NULL
            );

            -- Every practice and homework answer (right or wrong), for the level graph on the streak page.
            CREATE TABLE IF NOT EXISTS answer_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                source TEXT NOT NULL,
                ok INTEGER NOT NULL,
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_answer_events_student ON answer_events (student_id, id);

            -- Pomodoro focus blocks. The server keeps the clock, so a tree can only be planted after the full time.
            CREATE TABLE IF NOT EXISTS focus_sessions (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                started_at INTEGER NOT NULL,
                seconds INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',   -- active | done | cancelled
                finished_at INTEGER
            );

            -- One row per student and word: the shared vocabulary memory every game and the flashcards read and write.
            CREATE TABLE IF NOT EXISTS word_progress (
                student_id TEXT NOT NULL,
                word_id TEXT NOT NULL,
                box INTEGER NOT NULL DEFAULT 0,          -- Leitner box 0..5
                correct INTEGER NOT NULL DEFAULT 0,
                wrong INTEGER NOT NULL DEFAULT 0,
                streak INTEGER NOT NULL DEFAULT 0,
                last_ok INTEGER NOT NULL DEFAULT 0,
                last_seen INTEGER NOT NULL,
                next_review INTEGER NOT NULL,
                last_source TEXT NOT NULL DEFAULT '',
                PRIMARY KEY (student_id, word_id)
            );

            -- Listen and Survive: the best result per student and mission.
            CREATE TABLE IF NOT EXISTS listen_progress (
                student_id TEXT NOT NULL,
                mission TEXT NOT NULL,
                stars INTEGER NOT NULL DEFAULT 0,
                best_correct INTEGER NOT NULL DEFAULT 0,
                plays INTEGER NOT NULL DEFAULT 0,
                last_played INTEGER NOT NULL,
                PRIMARY KEY (student_id, mission)
            );

            -- Yashil shahar: a finished focus block earns one tree ('unplanted'); the student plants it on the map
            -- ('planted'). A failed block wilts the student's latest planted tree ('wilted'); restoring it spends one
            -- earned tree ('spent' is the one that was used).
            CREATE TABLE IF NOT EXISTS green_trees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                session_id TEXT NOT NULL UNIQUE,
                state TEXT NOT NULL DEFAULT 'unplanted',   -- unplanted | planted | wilted | spent
                kind TEXT,
                lat REAL,
                lon REAL,
                earned_at INTEGER NOT NULL,
                planted_at INTEGER,
                wilted_at INTEGER,
                restored_at INTEGER,
                updated_at INTEGER NOT NULL
            );

            -- Extra planting areas drawn on the map by an administrator (a polygon as JSON [[lat, lon], ...]).
            CREATE TABLE IF NOT EXISTS green_zones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                polygon TEXT NOT NULL,
                created_by TEXT NOT NULL,
                created_at INTEGER NOT NULL
            );
            """
        )
        # Ensure new columns exist on databases created by older versions
        for col, col_def in [
            ("first_name", "TEXT"),
            ("last_name", "TEXT"),
            ("role", "TEXT DEFAULT 'student'"),
            ("level", "TEXT DEFAULT 'A1'"),
            ("status", "TEXT DEFAULT 'pending'"),
            ("password_hash", "TEXT"),
            ("name_key", "TEXT"),
            ("photo_url", "TEXT"),
            ("avatar_version", "INTEGER"),
            ("character", "TEXT"),
        ]:
            try:
                conn.execute(f"ALTER TABLE students ADD COLUMN {col} {col_def}")
            except sqlite3.OperationalError:
                pass

        # verified = 1 when the server graded the answers itself (0: older rows, or an exercise the server does not know)
        try:
            conn.execute("ALTER TABLE attempts ADD COLUMN verified INTEGER NOT NULL DEFAULT 0")
        except sqlite3.OperationalError:
            pass

        conn.executescript(
            """
            CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id);
            CREATE INDEX IF NOT EXISTS idx_students_name_key ON students(name_key);
            CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(student_id);
            CREATE INDEX IF NOT EXISTS idx_points_student_time ON points_log(student_id, created_at);
            CREATE INDEX IF NOT EXISTS idx_points_time ON points_log(created_at);
            CREATE INDEX IF NOT EXISTS idx_answer_assignment ON answer_log(assignment_id);
            CREATE INDEX IF NOT EXISTS idx_focus_student ON focus_sessions(student_id, status);
            CREATE INDEX IF NOT EXISTS idx_green_student ON green_trees(student_id, state);
            CREATE INDEX IF NOT EXISTS idx_green_pos ON green_trees(lat, lon);
            CREATE INDEX IF NOT EXISTS idx_green_updated ON green_trees(updated_at);
            """
        )

        # The pause columns of a focus block, and the old Asaka forest table (trees were placed by the server then;
        # there is no way to carry them over, so it goes away once it is empty).
        for col, col_def in (("paused_at", "INTEGER"), ("paused_total", "INTEGER NOT NULL DEFAULT 0")):
            try:
                conn.execute(f"ALTER TABLE focus_sessions ADD COLUMN {col} {col_def}")
            except sqlite3.OperationalError:
                pass
        if conn.execute("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'trees'").fetchone():
            if conn.execute("SELECT COUNT(*) FROM trees").fetchone()[0] == 0:
                conn.execute("DROP TABLE trees")

        for row in conn.execute("SELECT id, name FROM students WHERE name_key IS NULL").fetchall():
            conn.execute(
                "UPDATE students SET name_key = ? WHERE id = ?", (name_key(row["name"]), row["id"])
            )

        # Lock accounts that are still protected by a password that used to be hardcoded.
        leaked_hashes = set(_LEAKED_PASSWORD_HASHES)
        for row in conn.execute(
            "SELECT id, name, password_hash FROM students WHERE password_hash IS NOT NULL"
        ).fetchall():
            if row["password_hash"] in leaked_hashes:
                conn.execute("UPDATE students SET password_hash = NULL WHERE id = ?", (row["id"],))
                conn.execute("DELETE FROM sessions WHERE student_id = ?", (row["id"],))
                logger.warning(
                    "Account %r used a previously hardcoded password: password cleared. "
                    "Set a new one with: python manage.py set-password \"%s\"",
                    row["id"],
                    row["name"],
                )

        # Telegram accounts only keep admin rights while their id is listed in TEACHER_IDS
        configured_admin_ids = {f"tg_{tid}" for tid in TEACHER_IDS}
        for row in conn.execute(
            "SELECT id FROM students WHERE role = 'admin' AND id LIKE 'tg!_%' ESCAPE '!'"
        ).fetchall():
            if row["id"] not in configured_admin_ids:
                conn.execute("UPDATE students SET role = 'student' WHERE id = ?", (row["id"],))
                conn.execute("DELETE FROM sessions WHERE student_id = ?", (row["id"],))
                logger.warning("Admin rights removed from %s (not listed in TEACHER_IDS).", row["id"])

        # Ensure every configured admin exists with admin rights
        for tid in TEACHER_IDS:
            conn.execute(
                """
                INSERT OR IGNORE INTO students (id, name, first_name, last_name, role, level, status, class_name, created_at, name_key)
                VALUES (?, 'Admin', 'Admin', '', 'admin', 'C1-C2', 'approved', 'Admin', ?, 'admin')
                """,
                (f"tg_{tid}", now_str()),
            )
            conn.execute(
                "UPDATE students SET role = 'admin', status = 'approved' WHERE id = ?", (f"tg_{tid}",)
            )

        conn.execute("DELETE FROM sessions WHERE expires_at < ?", (int(time.time()),))
        ensure_homework(conn)


# ---------------------------------------------------------------------------
# Sessions & authentication helpers
# ---------------------------------------------------------------------------
def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(conn: sqlite3.Connection, student_id: str) -> str:
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    conn.execute(
        "INSERT INTO sessions (token_hash, student_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (_token_hash(token), student_id, now, now + SESSION_TTL_SECONDS),
    )
    return token


def bearer_token(request: web.Request) -> str:
    header = request.headers.get("Authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return ""


def avatar_dir() -> str:
    return os.path.join(os.path.dirname(os.path.abspath(DB_PATH)), "avatars")


def avatar_url(row) -> str:
    """Cached Telegram profile photo, else the photo_url Telegram sent, else '' (initials)."""
    keys = row.keys()
    if "avatar_version" in keys and row["avatar_version"]:
        return f"/avatars/{row['id']}.jpg?v={row['avatar_version']}"
    if "photo_url" in keys and row["photo_url"]:
        return row["photo_url"]
    return ""


def character_of(row) -> str:
    """The cartoon character a student picked at first login ('' until they choose one)."""
    return (row["character"] or "") if "character" in row.keys() else ""


def student_public(row: sqlite3.Row) -> dict:
    return {
        "photoUrl": avatar_url(row),
        "character": character_of(row),
        "id": row["id"],
        "name": row["name"],
        "firstName": row["first_name"] or "",
        "lastName": row["last_name"] or "",
        "role": row["role"] or "student",
        "level": row["level"] or "A1",
        "status": row["status"] or "pending",
        "className": row["class_name"] or row["level"] or "Level 1",
    }


def current_user(conn: sqlite3.Connection, request: web.Request):
    token = bearer_token(request)
    if not token:
        return None
    return conn.execute(
        """
        SELECT s.* FROM sessions x JOIN students s ON s.id = x.student_id
        WHERE x.token_hash = ? AND x.expires_at > ?
        """,
        (_token_hash(token), int(time.time())),
    ).fetchone()


def require_user(conn: sqlite3.Connection, request: web.Request, roles=None, approved=True):
    user = current_user(conn, request)
    if user is None:
        raise ApiError("Tizimga kiring.", 401)
    if user["status"] == "declined":
        raise ApiError("Hisobingiz rad etilgan.", 403)
    if approved and user["status"] != "approved":
        raise ApiError("Hisobingiz hali tasdiqlanmagan.", 403)
    if roles and user["role"] not in roles:
        raise ApiError("Sizda ushbu amalni bajarish huquqi yo'q.", 403)
    return user


def user_role_for(telegram_id: int, existing_role=None) -> str:
    if telegram_id in TEACHER_IDS:
        return "admin"
    return existing_role if existing_role in ("student", "teacher") else "student"


def upsert_telegram_user(conn: sqlite3.Connection, tg_user: dict) -> sqlite3.Row:
    """Create/refresh the `tg_<id>` account without touching role, level or password."""
    tg_id = int(tg_user["id"])
    sid = f"tg_{tg_id}"
    first = sanitize_display_name(tg_user.get("first_name"), "")
    last = sanitize_display_name(tg_user.get("last_name"), "")
    full = f"{first} {last}".strip() or ("Admin" if tg_id in TEACHER_IDS else "Foydalanuvchi")
    photo = str(tg_user.get("photo_url") or "").strip()
    photo = photo if photo.startswith("https://") and len(photo) <= 500 and '"' not in photo else None
    existing = conn.execute("SELECT * FROM students WHERE id = ?", (sid,)).fetchone()
    if existing is None:
        conn.execute(
            """
            INSERT INTO students (id, name, first_name, last_name, role, level, status, class_name, created_at, name_key)
            VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?)
            """,
            (
                sid,
                full,
                first,
                last,
                user_role_for(tg_id),
                "C1-C2" if tg_id in TEACHER_IDS else "A1",
                "Admin" if tg_id in TEACHER_IDS else "Level 1",
                now_str(),
                name_key(full),
            ),
        )
    else:
        conn.execute(
            "UPDATE students SET name = ?, first_name = ?, last_name = ?, name_key = ?, role = ? WHERE id = ?",
            (full, first, last, name_key(full), user_role_for(tg_id, existing["role"]), sid),
        )
        if tg_id in TEACHER_IDS:
            conn.execute("UPDATE students SET status = 'approved' WHERE id = ?", (sid,))
    if photo:
        conn.execute("UPDATE students SET photo_url = ? WHERE id = ?", (photo, sid))
    return conn.execute("SELECT * FROM students WHERE id = ?", (sid,)).fetchone()


def verify_telegram_init_data(init_data: str, max_age: int = TELEGRAM_AUTH_MAX_AGE):
    """Validates Telegram Mini App `initData` (HMAC) and returns the user dict, or None."""
    if not init_data or not bot_token_configured():
        return None
    try:
        pairs = dict(parse_qsl(init_data, keep_blank_values=True, strict_parsing=True))
    except ValueError:
        return None
    received_hash = pairs.pop("hash", None)
    if not received_hash:
        return None
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode("utf-8"), hashlib.sha256).digest()
    expected = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received_hash):
        return None
    try:
        if time.time() - int(pairs.get("auth_date", "0")) > max_age:
            return None
        user = json.loads(pairs.get("user", ""))
        int(user["id"])
    except (ValueError, KeyError, TypeError):
        return None
    return user if isinstance(user, dict) else None


async def read_json(request: web.Request) -> dict:
    try:
        data = await request.json()
    except Exception:
        raise ApiError("Noto'g'ri so'rov formati.", 400)
    if not isinstance(data, dict):
        raise ApiError("Noto'g'ri so'rov formati.", 400)
    return data


def load_exercises_file():
    with open(EXERCISES_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f).get("exercises", [])


_BASE_EXERCISES_CACHE = {"mtime": None, "data": []}


def load_base_exercises():
    try:
        mtime = os.path.getmtime(EXERCISES_JSON_PATH)
    except OSError:
        return []
    if _BASE_EXERCISES_CACHE["mtime"] != mtime:
        _BASE_EXERCISES_CACHE["data"] = load_exercises_file()
        _BASE_EXERCISES_CACHE["mtime"] = mtime
    return _BASE_EXERCISES_CACHE["data"]


_SUITE_CACHE = {"mtime": None, "data": {}}


def load_practice_suite() -> dict:
    """The "Mavzu mashqlari" practice suite (static/practicing_suite.js) as {exercise id: exercise}.

    The file is `const PRACTICING_SUITE_DATA = {...};` with a JSON body, so the server can grade it too.
    """
    path = os.path.join(STATIC_DIR, "practicing_suite.js")
    try:
        mtime = os.path.getmtime(path)
    except OSError:
        return {}
    if _SUITE_CACHE["mtime"] != mtime:
        data = {}
        try:
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            body = json.loads(text[text.index("{"): text.rindex("}") + 1])
            data = {k: v for k, v in body.items() if isinstance(v, dict) and isinstance(v.get("questions"), list)}
        except (OSError, ValueError):
            logger.warning("Could not read the practice suite for grading", exc_info=True)
        _SUITE_CACHE.update(mtime=mtime, data=data)
    return _SUITE_CACHE["data"]


def find_exercise(conn: sqlite3.Connection, exercise_id: str):
    """The exercise with this id (workbook, teacher-made or practice suite), or None."""
    for ex in load_all_exercises(conn):
        if ex.get("id") == exercise_id:
            return ex
    suite = load_practice_suite().get(exercise_id)
    return dict(suite, id=exercise_id) if suite else None


def load_all_exercises(conn: sqlite3.Connection):
    exercises = list(load_base_exercises())
    rows = conn.execute("SELECT exercise_json FROM custom_exercises ORDER BY created_at ASC").fetchall()
    for r in rows:
        try:
            exercises.append(json.loads(r["exercise_json"]))
        except (ValueError, TypeError):
            pass
    return exercises


async def notify_teachers_new_registration(
    user_id: str, first_name: str, last_name: str, role: str, level: str, timestamp: str, needs_approval: bool = False
):
    if not TG_APP or not TG_APP.bot:
        logger.warning("Telegram Bot application not active yet for notifications.")
        return
    full_name = f"{first_name} {last_name}".strip()
    role_label = "O'qituvchi" if role == "teacher" else "Talaba"
    text = (
        f"🔔 <b>Yangi foydalanuvchi ro'yxatdan o'tdi! (Level Up)</b>\n\n"
        f"👤 <b>Ism:</b> {_html_escape(full_name)}\n"
        f"🎓 <b>Roli:</b> {role_label}\n"
        f"📊 <b>Tanlagan darajasi:</b> <code>{_html_escape(level)}</code>\n"
        f"🕒 <b>Vaqt:</b> {timestamp}\n\n"
    )
    markup = None
    if needs_approval:
        text += "⏳ <b>Holati:</b> Tasdiqlashni kutmoqda"
        markup = InlineKeyboardMarkup(
            [
                [
                    InlineKeyboardButton("✅ Tasdiqlash", callback_data=f"appr_{user_id}"),
                    InlineKeyboardButton("❌ Rad etish", callback_data=f"decl_{user_id}"),
                ]
            ]
        )
    else:
        text += "✅ <b>Holati:</b> Tasdiqlangan (platformaga kirdi)"
    for teacher_id in TEACHER_IDS:
        try:
            await TG_APP.bot.send_message(
                chat_id=teacher_id, text=text, parse_mode="HTML", reply_markup=markup
            )
            logger.info("Sent registration notification to teacher %s", teacher_id)
        except Exception as e:
            if "chat not found" in str(e).lower():
                logger.warning(
                    "Teacher %s has not clicked /start in bot yet. Telegram prevents bots from messaging users first.",
                    teacher_id,
                )
            else:
                logger.warning("Could not notify teacher %s: %s", teacher_id, e)


def _html_escape(value) -> str:
    return (
        str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )


# ---------------------------------------------------------------------------
# Input validation for exercises / attempts
# ---------------------------------------------------------------------------
_ID_RE = re.compile(r"^[A-Za-z0-9_.:-]{1,80}$")


def sanitize_image_ref(value) -> str:
    img = str(value or "").strip()
    if img.startswith(("data:image/", "/static/", "https://")) and len(img) <= 1_500_000:
        return img
    return ""


def sanitize_exercise(raw: dict, existing_ids: set) -> dict:
    category = clean_text(raw.get("category"), 20).lower()
    if category not in ("vocabulary", "grammar"):
        raise ApiError("Mashq turi 'vocabulary' yoki 'grammar' bo'lishi kerak.")
    title = clean_text(raw.get("title"), 200)
    if not title:
        raise ApiError("Mashq nomini kiriting.")
    raw_questions = raw.get("questions")
    if not isinstance(raw_questions, list) or not 1 <= len(raw_questions) <= 500:
        raise ApiError("Mashqda kamida 1 ta (ko'pi bilan 500 ta) savol bo'lishi kerak.")

    questions = []
    for rq in raw_questions:
        if not isinstance(rq, dict):
            raise ApiError("Savol formati noto'g'ri.")
        q = clean_text(rq.get("q"), 1000)
        a = clean_text(rq.get("a"), 500)
        if not q or not a:
            raise ApiError("Har bir savol va javob to'ldirilgan bo'lishi kerak.")
        item = {"q": q, "a": a}
        options = rq.get("options")
        if isinstance(options, list) and options:
            item["options"] = [clean_text(o, 200) for o in options[:20] if clean_text(o, 200)]
        img = sanitize_image_ref(rq.get("img"))
        if img:
            item["img"] = img
        questions.append(item)

    ex_id = str(raw.get("id") or "")
    if not _ID_RE.match(ex_id) or ex_id in existing_ids:
        ex_id = f"{category}_custom_{secrets.token_hex(6)}"

    exercise = {
        "id": ex_id,
        "category": category,
        "week": clean_text(raw.get("week"), 60),
        "part": clean_text(raw.get("part"), 60),
        "title": title,
        "instruction_en": clean_text(raw.get("instruction_en"), 1000),
        "instruction_uz": clean_text(raw.get("instruction_uz"), 1000),
        "questions": questions,
    }
    number = raw.get("number")
    if isinstance(number, int) and not isinstance(number, bool) and 0 < number < 100000:
        exercise["number"] = number
    return exercise


def sanitize_mistakes(raw) -> list:
    if not isinstance(raw, list):
        return []
    mistakes = []
    for m in raw[:500]:
        if isinstance(m, dict):
            mistakes.append(
                {
                    "q": clean_text(m.get("q"), 500),
                    "studentAnswer": clean_text(m.get("studentAnswer"), 500),
                    "correctAnswer": clean_text(m.get("correctAnswer"), 500),
                }
            )
    return mistakes


def as_int(value, field: str) -> int:
    if isinstance(value, bool):
        raise ApiError(f"'{field}' noto'g'ri.")
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ApiError(f"'{field}' noto'g'ri.")


def csv_safe(value):
    """Neutralise spreadsheet formula injection in exported cells."""
    text = "" if value is None else str(value)
    return "'" + text if text and text[0] in "=+-@\t\r" else text


# ---------------------------------------------------------------------------
# Web Server & REST API Handlers (aiohttp)
# ---------------------------------------------------------------------------
async def handle_index(request: web.Request) -> web.StreamResponse:
    return web.FileResponse(STATIC_INDEX_PATH, headers={"Cache-Control": "no-cache"})


async def handle_healthz(request: web.Request) -> web.Response:
    with get_db() as conn:
        conn.execute("SELECT 1").fetchone()
    return web.json_response({"status": "ok"})


async def handle_get_state(request: web.Request) -> web.Response:
    with get_db() as conn:
        user = require_user(conn, request)
        is_staff = user["role"] in ("admin", "teacher")
        if is_staff:
            stu_rows = conn.execute(
                "SELECT id, name, first_name, last_name, role, level, status, class_name, photo_url, avatar_version "
                "FROM students ORDER BY created_at DESC"
            ).fetchall()
            att_rows = conn.execute("SELECT * FROM attempts ORDER BY timestamp ASC").fetchall()
        else:
            stu_rows = [user]
            att_rows = conn.execute(
                "SELECT * FROM attempts WHERE student_id = ? ORDER BY timestamp ASC", (user["id"],)
            ).fetchall()
        exercises = load_all_exercises(conn)

    attempts = [
        {
            "attemptId": r["attempt_id"],
            "studentId": r["student_id"],
            "studentName": r["student_name"],
            "exerciseId": r["exercise_id"],
            "exerciseTitle": r["exercise_title"],
            "category": r["category"],
            "score": r["score"],
            "total": r["total"],
            "timestamp": r["timestamp"],
            "mistakes": json.loads(r["mistakes_json"] or "[]"),
            "verified": bool(r["verified"]),
        }
        for r in att_rows
    ]
    return web.json_response(
        {
            "students": [student_public(r) for r in stu_rows],
            "attempts": attempts,
            "exercises": exercises,
        }
    )


async def handle_post_submit(request: web.Request) -> web.Response:
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"submit:{user['id']}", 120, 3600)
        payload = await read_json(request)
        exercise_id = clean_text(payload.get("exerciseId"), 120)
        if not exercise_id:
            raise ApiError("exerciseId kerak.")
        known = find_exercise(conn, exercise_id)
        if known:
            # The server grades the answers itself; the score the browser computed is never trusted.
            score, total, mistakes = grade_attempt(known, payload.get("answers"))
            category = clean_text(known.get("category"), 32) or "vocabulary"
            title = clean_text(known.get("title"), 200)
            verified = 1
        else:
            # An exercise the server has no answer key for (e.g. a deleted one): kept, but marked as unverified.
            total = as_int(payload.get("total"), "total")
            score = as_int(payload.get("score"), "score")
            if not 1 <= total <= 1000 or not 0 <= score <= total:
                raise ApiError("Ball noto'g'ri.")
            category = clean_text(payload.get("category"), 32) or "vocabulary"
            mistakes = sanitize_mistakes(payload.get("mistakes"))
            title = clean_text(payload.get("exerciseTitle"), 200)
            verified = 0
        title = title or exercise_id
        client_id = clean_text(payload.get("attemptId") or payload.get("id"), 64)
        client_id = client_id if _ID_RE.match(client_id) else secrets.token_hex(8)
        # Namespaced by student so nobody can overwrite another student's attempt.
        attempt_id = f"{user['id']}:{client_id}"
        conn.execute(
            """
            INSERT OR IGNORE INTO attempts
            (attempt_id, student_id, student_name, exercise_id, exercise_title, category, score, total, timestamp, mistakes_json, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                attempt_id,
                user["id"],
                user["name"],
                exercise_id,
                title,
                category,
                score,
                total,
                now_str(),
                json.dumps(mistakes, ensure_ascii=False),
                verified,
            ),
        )
    return web.json_response(
        {"status": "ok", "attemptId": attempt_id, "score": score, "total": total, "verified": bool(verified)}
    )


_LOOSE_PUNCT_RE = re.compile(r"[.,/#!$%^&*;:{}=\-_`~()]")


def answer_matches(answer, spec) -> bool:
    """The workbook rules (normalize_answer) plus the practice suite's: punctuation is ignored."""
    if is_answer_correct(answer, spec):
        return True

    def loose(value):
        return " ".join(_LOOSE_PUNCT_RE.sub("", normalize_answer(value)).split())

    given = loose(answer)
    return bool(given) and given in {loose(v) for v in str(spec).split("|") if loose(v)}


def grade_attempt(exercise: dict, answers):
    """(score, total, mistakes) for the raw answers a student gave to every question of `exercise`."""
    questions = exercise.get("questions") or []
    if not isinstance(answers, list) or len(answers) != len(questions):
        raise ApiError("Javoblar to'liq emas.")
    score, mistakes = 0, []
    for q, given in zip(questions, answers):
        text = clean_text(given, 500) if isinstance(given, str) else ""
        if answer_matches(text, q["a"]):
            score += 1
        else:
            mistakes.append({
                "q": clean_text(q.get("q"), 500),
                "studentAnswer": text or "(bo'sh)",
                "correctAnswer": clean_text(primary_answer(q["a"]), 500),
            })
    return score, len(questions), mistakes


async def handle_post_exercise(request: web.Request) -> web.Response:
    with get_db() as conn:
        require_user(conn, request, roles=("admin", "teacher"))
        raw = await read_json(request)
        existing_ids = {ex.get("id") for ex in load_all_exercises(conn)}
        exercise = sanitize_exercise(raw, existing_ids)
        conn.execute(
            "INSERT INTO custom_exercises (id, exercise_json, created_at) VALUES (?, ?, ?)",
            (exercise["id"], json.dumps(exercise, ensure_ascii=False), now_str()),
        )
    return web.json_response({"status": "ok", "id": exercise["id"]})


# ---------------------------------------------------------------------------
# Weekly assignments, server-side grading and ratings
# ---------------------------------------------------------------------------
_APOSTROPHES_RE = re.compile(r"[ʻ’‘`]")


def normalize_answer(value) -> str:
    """Same rules as normalizeAns() in index.html."""
    text = _APOSTROPHES_RE.sub("'", str(value or "").strip().lower())
    text = re.sub(r"[.!?]+$", "", text)
    return " ".join(text.split())


def is_answer_correct(answer, spec) -> bool:
    given = normalize_answer(answer)
    if not given:
        return False
    return given in {normalize_answer(v) for v in str(spec).split("|") if normalize_answer(v)}


def primary_answer(spec) -> str:
    return str(spec).split("|")[0]


def answer_hint(question: dict) -> dict:
    """Help shown after the 2nd wrong try: half of the wrong options go, or the answer's shape."""
    options = question.get("options") or []
    if options:
        wrong = [o for o in options if not is_answer_correct(o, question["a"])]
        return {"remove": wrong[: max(1, len(options) - 2)]}
    words = primary_answer(question["a"]).split()
    return {"mask": " ".join(w[0] + "•" * (len(w) - 1) for w in words)}


def points_for(tries: int, late: bool) -> int:
    points = POINTS_BY_TRY[tries - 1]
    return -(-points // LATE_POINTS_DIVISOR) if late else points


def local_dt(ts: int) -> datetime:
    return datetime.fromtimestamp(ts, LOCAL_TZ)


def fmt_local(ts: int) -> str:
    return local_dt(ts).strftime("%d.%m.%Y %H:%M")


def week_start_ts(now=None) -> int:
    local = local_dt(int(now if now is not None else time.time()))
    monday = (local - timedelta(days=local.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    return int(monday.timestamp())


def month_start_ts(now=None) -> int:
    local = local_dt(int(now if now is not None else time.time()))
    return int(local.replace(day=1, hour=0, minute=0, second=0, microsecond=0).timestamp())


def day_start_ts(now=None) -> int:
    local = local_dt(int(now if now is not None else time.time()))
    return int(local.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())


def exercises_by_id(conn) -> dict:
    return {ex.get("id"): ex for ex in load_all_exercises(conn)}


def assignment_exercises(asg, ex_map: dict) -> list:
    """The assignment's exercises that still exist, in the teacher's order."""
    return [ex_map[i] for i in json.loads(asg["exercise_ids_json"] or "[]") if i in ex_map]


def public_question(q: dict) -> dict:
    item = {"q": q.get("q", "")}
    for key in ("options", "img"):
        if q.get(key):
            item[key] = q[key]
    return item


def assignment_public(asg, exercises: list) -> dict:
    return {
        "id": asg["id"],
        "title": asg["title"],
        "weekLabel": asg["week_label"],
        "note": asg["note"],
        "startsAt": asg["starts_at"],
        "deadline": asg["deadline"],
        "deadlineText": fmt_local(asg["deadline"]),
        "exercises": [
            {"id": ex["id"], "title": ex.get("title", ""), "category": ex.get("category", ""),
             "questionCount": len(ex.get("questions") or [])}
            for ex in exercises
        ],
        "questionCount": sum(len(ex.get("questions") or []) for ex in exercises),
    }


def progress_for(rows, exercises: list, deadline: int) -> dict:
    """Summary of one student's answer_log rows for one assignment."""
    total = sum(len(ex.get("questions") or []) for ex in exercises)
    valid = {(ex["id"], i) for ex in exercises for i in range(len(ex.get("questions") or []))}
    done_rows = [r for r in rows if (r["exercise_id"], r["q_index"]) in valid
                 and (r["solved"] or r["tries"] >= MAX_TRIES)]
    resolved = len(done_rows)
    finished = total > 0 and resolved >= total
    finished_at = max((r["updated_at"] for r in done_rows), default=None) if finished else None
    return {
        "total": total,
        "resolved": resolved,
        "solved": sum(1 for r in done_rows if r["solved"]),
        "firstTry": sum(1 for r in done_rows if r["solved"] and r["tries"] == 1),
        "points": sum(r["points"] for r in rows),
        "done": finished,
        "finishedAt": finished_at,
        "late": bool(finished_at and finished_at > deadline),
        "started": bool(rows),
        "lastActivity": max((r["updated_at"] for r in rows), default=None),
    }


def get_assignment(conn, assignment_id: str):
    return conn.execute("SELECT * FROM assignments WHERE id = ?", (assignment_id,)).fetchone()


def rating_students(conn):
    return conn.execute(
        "SELECT * FROM students WHERE role = 'student' AND status = 'approved'"
    ).fetchall()


def record_finished_exercise(conn, user, asg, ex: dict) -> None:
    """When every question of an exercise is resolved, store it as a normal attempt for the teacher reports."""
    questions = ex.get("questions") or []
    rows = {
        r["q_index"]: r
        for r in conn.execute(
            "SELECT * FROM answer_log WHERE student_id = ? AND assignment_id = ? AND exercise_id = ?",
            (user["id"], asg["id"], ex["id"]),
        ).fetchall()
    }
    if any(i not in rows or not (rows[i]["solved"] or rows[i]["tries"] >= MAX_TRIES) for i in range(len(questions))):
        return
    mistakes = [
        {
            "q": clean_text(q.get("q"), 500),
            "studentAnswer": clean_text(rows[i]["last_wrong"], 500),
            "correctAnswer": clean_text(primary_answer(q["a"]), 500),
        }
        for i, q in enumerate(questions)
        if not rows[i]["solved"] or rows[i]["tries"] > 1
    ]
    conn.execute(
        """
        INSERT OR REPLACE INTO attempts
        (attempt_id, student_id, student_name, exercise_id, exercise_title, category, score, total, timestamp, mistakes_json, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """,
        (
            f"{user['id']}:asg_{asg['id']}_{ex['id']}",
            user["id"],
            user["name"],
            ex["id"],
            clean_text(ex.get("title"), 200) or ex["id"],
            clean_text(ex.get("category"), 32) or "vocabulary",
            sum(1 for r in rows.values() if r["solved"]),
            len(questions),
            now_str(),
            json.dumps(mistakes, ensure_ascii=False),
        ),
    )


def parse_epoch(value, field: str) -> int:
    """Accepts unix seconds or milliseconds (JavaScript Date.getTime())."""
    number = as_int(value, field)
    if number > 10_000_000_000:
        number //= 1000
    return number


def sanitize_assignment(raw: dict, ex_map: dict, now: int, existing=None) -> dict:
    title = clean_text(raw.get("title"), 120) if "title" in raw or existing is None else existing["title"]
    if not title:
        raise ApiError("Vazifa nomini kiriting.")
    if "exerciseIds" in raw or existing is None:
        ids = raw.get("exerciseIds")
        if not isinstance(ids, list) or not 1 <= len(ids) <= 40:
            raise ApiError("Kamida 1 ta (ko'pi bilan 40 ta) mashq tanlang.")
        ids = list(dict.fromkeys(str(i) for i in ids))
        missing = [i for i in ids if i not in ex_map]
        if missing:
            raise ApiError(f"Mashq topilmadi: {missing[0]}")
    else:
        ids = json.loads(existing["exercise_ids_json"])
    if raw.get("startsAt"):
        starts_at = parse_epoch(raw["startsAt"], "startsAt")
    else:
        starts_at = existing["starts_at"] if existing else now
    if "deadline" in raw or existing is None:
        deadline = parse_epoch(raw.get("deadline"), "deadline")
    else:
        deadline = existing["deadline"]
    if deadline <= starts_at or (existing is None and deadline <= now) or deadline - starts_at > 366 * 24 * 3600:
        raise ApiError("Deadline vazifa boshlanishidan keyin va kelajakda bo'lishi kerak.")

    def text_field(key, column, limit):
        if key in raw:
            return clean_text(raw.get(key), limit)
        return existing[column] if existing else ""

    return {
        "title": title,
        "week_label": text_field("weekLabel", "week_label", 60),
        "note": text_field("note", "note", 1000),
        "exercise_ids_json": json.dumps(ids),
        "starts_at": starts_at,
        "deadline": deadline,
    }


def answer_rows_by_student(conn, assignment_id: str) -> dict:
    by_student = defaultdict(list)
    for r in conn.execute("SELECT * FROM answer_log WHERE assignment_id = ?", (assignment_id,)).fetchall():
        by_student[r["student_id"]].append(r)
    return by_student


async def handle_list_assignments(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        is_staff = user["role"] in ("admin", "teacher")
        ex_map = exercises_by_id(conn)
        if is_staff:
            asg_rows = conn.execute("SELECT * FROM assignments ORDER BY deadline DESC").fetchall()
            students = rating_students(conn)
        else:
            asg_rows = conn.execute(
                "SELECT * FROM assignments WHERE starts_at <= ? ORDER BY deadline DESC", (now,)
            ).fetchall()
        result = []
        for asg in asg_rows:
            exercises = assignment_exercises(asg, ex_map)
            item = assignment_public(asg, exercises)
            by_student = answer_rows_by_student(conn, asg["id"])
            if is_staff:
                item["exerciseIds"] = json.loads(asg["exercise_ids_json"])
                item["students"] = sorted(
                    (
                        {"id": s["id"], "name": s["name"], "photoUrl": avatar_url(s),
                         **progress_for(by_student.get(s["id"], []), exercises, asg["deadline"])}
                        for s in students
                    ),
                    key=lambda p: (not p["done"], -p["resolved"], -p["points"], p["name"].casefold()),
                )
                item["doneCount"] = sum(1 for p in item["students"] if p["done"])
                item["studentCount"] = len(students)
            item["my"] = progress_for(by_student.get(user["id"], []), exercises, asg["deadline"])
            result.append(item)
    return web.json_response({"now": now, "assignments": result})


async def handle_get_assignment(request: web.Request) -> web.Response:
    """Questions (without answers) plus this student's state for every question."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        asg = get_assignment(conn, request.match_info["assignment_id"])
        is_staff = user["role"] in ("admin", "teacher")
        if asg is None or (asg["starts_at"] > now and not is_staff):
            raise ApiError("Vazifa topilmadi.", 404)
        exercises = assignment_exercises(asg, exercises_by_id(conn))
        rows = conn.execute(
            "SELECT * FROM answer_log WHERE student_id = ? AND assignment_id = ?", (user["id"], asg["id"])
        ).fetchall()
    state = {(r["exercise_id"], r["q_index"]): r for r in rows}
    out_exercises = []
    for ex in exercises:
        questions = []
        for i, q in enumerate(ex.get("questions") or []):
            item = public_question(q)
            r = state.get((ex["id"], i))
            if r:
                item.update(tries=r["tries"], solved=bool(r["solved"]), points=r["points"])
                if r["solved"] or r["tries"] >= MAX_TRIES:
                    item["correctAnswer"] = primary_answer(q["a"])
                elif r["tries"] >= HINT_AFTER_TRIES:
                    item["hint"] = answer_hint(q)
            questions.append(item)
        out_exercises.append({
            "id": ex["id"],
            "title": ex.get("title", ""),
            "category": ex.get("category", ""),
            "instructionEn": ex.get("instruction_en", ""),
            "instructionUz": ex.get("instruction_uz", ""),
            "wordBank": ex.get("word_bank") or [],
            "questions": questions,
        })
    data = assignment_public(asg, exercises)
    data["exercises"] = out_exercises
    data["my"] = progress_for(rows, exercises, asg["deadline"])
    data["pointsByTry"] = list(POINTS_BY_TRY)
    data["now"] = now
    return web.json_response(data)


async def handle_assignment_answer(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"answer:{user['id']}", 900, 3600)
        data = await read_json(request)
        asg = get_assignment(conn, clean_text(data.get("assignmentId"), 80))
        if asg is None or asg["starts_at"] > now:
            raise ApiError("Vazifa topilmadi.", 404)
        exercise_id = clean_text(data.get("exerciseId"), 120)
        if exercise_id not in json.loads(asg["exercise_ids_json"]):
            raise ApiError("Bu mashq vazifada yo'q.", 404)
        if asg["id"].startswith(HOMEWORK_PREFIX) and previous_homework_open(conn, user["id"], asg["id"]):
            raise ApiError("Avval oldingi vazifani tugating.", 403)
        ex_map = exercises_by_id(conn)
        ex = ex_map.get(exercise_id)
        questions = (ex or {}).get("questions") or []
        q_index = as_int(data.get("qIndex"), "qIndex")
        if not 0 <= q_index < len(questions):
            raise ApiError("Savol topilmadi.", 404)
        question = questions[q_index]
        answer = clean_text(data.get("answer"), 500)
        if not answer:
            raise ApiError("Javobni kiriting.")
        late = now > asg["deadline"]

        conn.execute("BEGIN IMMEDIATE")
        key = (user["id"], asg["id"], exercise_id, q_index)
        row = conn.execute(
            "SELECT * FROM answer_log WHERE student_id = ? AND assignment_id = ? AND exercise_id = ? AND q_index = ?",
            key,
        ).fetchone()
        locked = bool(row and (row["solved"] or row["tries"] >= MAX_TRIES))
        if locked:
            correct, tries, points = bool(row["solved"]), row["tries"], 0
        else:
            tries = (row["tries"] if row else 0) + 1
            correct = is_answer_correct(answer, question["a"])
            points = points_for(tries, late) if correct else 0
            conn.execute(
                """
                INSERT INTO answer_log (student_id, assignment_id, exercise_id, q_index, tries, solved, points, last_wrong, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT (student_id, assignment_id, exercise_id, q_index) DO UPDATE SET
                    tries = excluded.tries, solved = excluded.solved, points = excluded.points,
                    last_wrong = CASE WHEN excluded.solved = 1 THEN answer_log.last_wrong ELSE excluded.last_wrong END,
                    updated_at = excluded.updated_at
                """,
                (*key, tries, int(correct), points, "" if correct else answer, now),
            )
            conn.execute(
                "INSERT INTO answer_events (student_id, source, ok, created_at) VALUES (?, 'homework', ?, ?)",
                (user["id"], int(correct), now),
            )
            if points:
                conn.execute(
                    "INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'assignment', ?, ?, ?)",
                    (user["id"], f"{asg['id']}:{exercise_id}:{q_index}", points, now),
                )
            if correct or tries >= MAX_TRIES:
                record_finished_exercise(conn, user, asg, ex)
        resolved = correct or tries >= MAX_TRIES
        rows = conn.execute(
            "SELECT * FROM answer_log WHERE student_id = ? AND assignment_id = ?", (user["id"], asg["id"])
        ).fetchall()
        result = {
            "correct": correct,
            "tries": tries,
            "triesLeft": 0 if resolved else MAX_TRIES - tries,
            "points": points,
            "resolved": resolved,
            "locked": locked,
            "late": late,
            "nextPoints": 0 if resolved else points_for(tries + 1, late),
            "my": progress_for(rows, assignment_exercises(asg, ex_map), asg["deadline"]),
        }
        if resolved:
            result["correctAnswer"] = primary_answer(question["a"])
        elif tries >= HINT_AFTER_TRIES:
            result["hint"] = answer_hint(question)
    return web.json_response(result)


async def handle_create_assignment(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        teacher = require_user(conn, request, roles=("admin", "teacher"))
        raw = await read_json(request)
        fields = sanitize_assignment(raw, exercises_by_id(conn), now)
        asg_id = f"asg_{secrets.token_hex(5)}"
        conn.execute(
            """
            INSERT INTO assignments (id, title, week_label, note, exercise_ids_json, starts_at, deadline, created_by, created_at)
            VALUES (:id, :title, :week_label, :note, :exercise_ids_json, :starts_at, :deadline, :created_by, :created_at)
            """,
            {**fields, "id": asg_id, "created_by": teacher["id"], "created_at": now},
        )
    if TG_APP is not None:
        spawn(run_assignment_notifications())
    return web.json_response({"status": "ok", "id": asg_id})


async def handle_update_assignment(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        require_user(conn, request, roles=("admin", "teacher"))
        raw = await read_json(request)
        asg = get_assignment(conn, clean_text(raw.get("id"), 80))
        if asg is None:
            raise ApiError("Vazifa topilmadi.", 404)
        fields = sanitize_assignment(raw, exercises_by_id(conn), now, existing=asg)
        conn.execute(
            """
            UPDATE assignments SET title = :title, week_label = :week_label, note = :note,
                   exercise_ids_json = :exercise_ids_json, starts_at = :starts_at, deadline = :deadline
            WHERE id = :id
            """,
            {**fields, "id": asg["id"]},
        )
        if fields["deadline"] > asg["deadline"] and fields["deadline"] > now:
            # A moved deadline gets its own reminder and summary.
            conn.execute("UPDATE assignments SET reminded = 0, summarized = 0 WHERE id = ?", (asg["id"],))
    return web.json_response({"status": "ok", "id": asg["id"]})


async def handle_delete_assignment(request: web.Request) -> web.Response:
    with get_db() as conn:
        require_user(conn, request, roles=("admin", "teacher"))
        raw = await read_json(request)
        asg = get_assignment(conn, clean_text(raw.get("id"), 80))
        if asg is None:
            raise ApiError("Vazifa topilmadi.", 404)
        like_id = asg["id"].replace("!", "!!").replace("_", "!_").replace("%", "!%")
        conn.execute("DELETE FROM answer_log WHERE assignment_id = ?", (asg["id"],))
        conn.execute(
            "DELETE FROM points_log WHERE source = 'assignment' AND ref LIKE ? ESCAPE '!'", (like_id + ":%",)
        )
        conn.execute("DELETE FROM attempts WHERE attempt_id LIKE ? ESCAPE '!'", ("%:asg!_" + like_id + "!_%",))
        conn.execute("DELETE FROM assignments WHERE id = ?", (asg["id"],))
    return web.json_response({"status": "ok", "id": asg["id"]})


def points_since(conn, since: int) -> dict:
    return {
        r["student_id"]: r["pts"]
        for r in conn.execute(
            "SELECT student_id, SUM(points) AS pts FROM points_log WHERE created_at >= ? GROUP BY student_id",
            (since,),
        ).fetchall()
    }


def activity_streak(conn, student_id: str, now: int) -> int:
    """Consecutive local days with points, ending today (or yesterday if nothing yet today)."""
    days = {
        local_dt(r["created_at"]).date()
        for r in conn.execute(
            "SELECT created_at FROM points_log WHERE student_id = ? AND created_at >= ?",
            (student_id, now - 400 * 24 * 3600),
        ).fetchall()
    }
    day = local_dt(now).date()
    if day not in days:
        day -= timedelta(days=1)
    streak = 0
    while day in days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def ranked(students, points: dict) -> list:
    entries = sorted(
        ({"id": s["id"], "name": s["name"], "photoUrl": avatar_url(s), "character": character_of(s),
          "points": points.get(s["id"], 0)}
         for s in students),
        key=lambda e: (-e["points"], e["name"].casefold()),
    )
    rank, last = 0, None
    for i, e in enumerate(entries, 1):
        if e["points"] != last:
            rank, last = i, e["points"]
        e["rank"] = rank
    return entries


async def handle_progress_history(request: web.Request) -> web.Response:
    """Points per day for the last N days (oldest first), for the student's progress graph."""
    try:
        days = max(1, min(60, int(request.query.get("days", "7"))))
    except ValueError:
        days = 7
    now = int(time.time())
    today = day_start_ts(now)
    with get_db() as conn:
        user = require_user(conn, request)
        points = []
        for i in range(days - 1, -1, -1):
            start = today - i * 86400
            row = conn.execute(
                "SELECT COALESCE(SUM(points), 0) FROM points_log WHERE student_id = ? AND created_at >= ? AND created_at < ?",
                (user["id"], start, start + 86400),
            ).fetchone()
            points.append(int(row[0]))
    return web.json_response({"points": points, "days": days})


async def handle_progress_events(request: web.Request) -> web.Response:
    """The practice runner tells the server how many answers of a finished practice were right and wrong."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"events:{user['id']}", 60, 3600)
        data = await read_json(request)
        correct, wrong = as_int(data.get("correct"), "correct"), as_int(data.get("wrong"), "wrong")
        if not (0 <= correct <= 60 and 0 <= wrong <= 60):
            raise ApiError("Natija noto'g'ri.")
        # wrong answers first, so a finished practice ends on the student's best foot
        rows = [(user["id"], "practice", 0, now)] * wrong + [(user["id"], "practice", 1, now)] * correct
        conn.executemany("INSERT INTO answer_events (student_id, source, ok, created_at) VALUES (?, ?, ?, ?)", rows)
    return web.json_response({"saved": len(rows)})


async def handle_progress_level(request: web.Request) -> web.Response:
    """Running level: +1 for a right practice/homework answer, -1 for a wrong one (never below 0). Last N answers."""
    try:
        limit = max(10, min(200, int(request.query.get("n", "50"))))
    except ValueError:
        limit = 50
    with get_db() as conn:
        user = require_user(conn, request)
        rows = conn.execute(
            "SELECT ok, created_at FROM answer_events WHERE student_id = ? ORDER BY id", (user["id"],)
        ).fetchall()
    level, path = 0, []
    for r in rows:
        level = level + 1 if r["ok"] else max(0, level - 1)
        path.append({"ok": bool(r["ok"]), "level": level, "t": r["created_at"]})
    recent = path[-limit:]
    before = path[-limit - 1]["level"] if len(path) > limit else 0
    right = sum(1 for p in path if p["ok"])
    return web.json_response({"start": before, "events": recent, "level": level, "right": right, "wrong": len(path) - right})


async def handle_progress_calendar(request: web.Request) -> web.Response:
    """Days the student earned points (studied), the day they started, and the streak: for the streak calendar."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        rows = conn.execute("SELECT created_at FROM points_log WHERE student_id = ?", (user["id"],)).fetchall()
        days = sorted({local_dt(r["created_at"]).date().isoformat() for r in rows})
        start = days[0] if days else local_dt(now).date().isoformat()
        joined = str(user["created_at"] or "")[:10]
        try:
            datetime.strptime(joined, "%Y-%m-%d")
            start = min(start, joined)
        except ValueError:
            pass
        streak = activity_streak(conn, user["id"], now)
    return web.json_response({"start": start, "today": local_dt(now).date().isoformat(), "days": days, "streak": streak})


async def handle_leaderboard(request: web.Request) -> web.Response:
    now = int(time.time())
    period = request.query.get("period", "week")
    if period not in ("week", "all"):
        period = "week"
    week_start = week_start_ts(now)
    with get_db() as conn:
        user = require_user(conn, request)
        students = rating_students(conn)
        week_points = points_since(conn, week_start)
        all_points = points_since(conn, 0)
        streak = activity_streak(conn, user["id"], now)
        # what the games gave this student: today (against the daily cap) and this week, per game, for the home screen
        game_today = conn.execute(
            "SELECT COALESCE(SUM(points), 0) FROM points_log WHERE student_id = ? AND source = 'game' AND created_at >= ?",
            (user["id"], day_start_ts(now)),
        ).fetchone()[0]
        game_week = {
            r["ref"]: r["p"]
            for r in conn.execute(
                "SELECT ref, SUM(points) AS p FROM points_log WHERE student_id = ? AND source = 'game' AND created_at >= ? GROUP BY ref",
                (user["id"], week_start),
            )
        }
    with get_db() as conn:
        month_points = points_since(conn, month_start_ts(now))
    month_rank = ranked(students, month_points)
    me_month = next((e for e in month_rank if e["id"] == user["id"]), None)
    week_rank = ranked(students, week_points)
    all_rank = ranked(students, all_points)
    me_week = next((e for e in week_rank if e["id"] == user["id"]), None)
    me_all = next((e for e in all_rank if e["id"] == user["id"]), None)
    return web.json_response({
        "period": period,
        "weekStart": week_start,
        "weekEnd": week_start + 7 * 24 * 3600,
        "entries": (week_rank if period == "week" else all_rank)[:100],
        "me": {
            "id": user["id"],
            "weekPoints": week_points.get(user["id"], 0),
            "allPoints": all_points.get(user["id"], 0),
            "weekRank": me_week["rank"] if me_week else None,
            "monthPoints": month_points.get(user["id"], 0),
            "monthRank": me_month["rank"] if me_month else None,
            "allRank": me_all["rank"] if me_all else None,
            "streak": streak,
            "students": len(students),
            "gameToday": game_today,
            "gameCap": GAME_DAILY_POINTS_CAP,
            "gameWeek": game_week,
        },
    })


async def handle_set_character(request: web.Request) -> web.Response:
    """Saves the cartoon character the student picked (an id from static/characters.js)."""
    with get_db() as conn:
        user = require_user(conn, request)
        data = await read_json(request)
        character = str(data.get("character") or "")
        if not re.fullmatch(r"[a-z0-9_]{2,32}", character):
            raise ApiError("Personaj noto'g'ri.")
        if user["password_hash"] is None and (user["id"].startswith("kid_") or user["id"].startswith("ros_")):
            # name + avatar is how this student gets back in: two students cannot hold the same pair
            clash = conn.execute(
                "SELECT 1 FROM students WHERE name_key = ? AND character = ? AND id != ? AND password_hash IS NULL "
                "AND (id LIKE 'kid\\_%' ESCAPE '\\' OR id LIKE 'ros\\_%' ESCAPE '\\')",
                (user["name_key"], character, user["id"]),
            ).fetchone()
            if clash:
                raise ApiError("Bu ism bilan bu avatar band. Boshqa avatar tanlang.", 409)
        conn.execute("UPDATE students SET character = ? WHERE id = ?", (character, user["id"]))
        row = conn.execute("SELECT * FROM students WHERE id = ?", (user["id"],)).fetchone()
    return web.json_response({"status": "ok", "student": student_public(row)})


async def handle_game_finish(request: web.Request) -> web.Response:
    """Games report how many tries each question took; points follow the homework rules, capped per day."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"game:{user['id']}", 60, 3600)
        data = await read_json(request)
        game = str(data.get("game") or "")
        if not re.fullmatch(r"[a-z_]{2,24}", game):
            raise ApiError("O'yin nomi noto'g'ri.")
        tries = data.get("tries")
        if not isinstance(tries, list) or len(tries) > GAME_MAX_QUESTIONS:
            raise ApiError("Natija noto'g'ri.")
        # A real round takes a while; results arriving faster than that are scripted.
        if GAME_MIN_SECONDS:
            enforce_rate_limit(f"gamegap:{user['id']}:{game}", 1, GAME_MIN_SECONDS)
        earned = sum(
            POINTS_BY_TRY[t - 1]
            for t in tries
            if isinstance(t, int) and not isinstance(t, bool) and 1 <= t <= MAX_TRIES
        )
        today = conn.execute(
            "SELECT COALESCE(SUM(points), 0) FROM points_log WHERE student_id = ? AND source = 'game' AND created_at >= ?",
            (user["id"], day_start_ts(now)),
        ).fetchone()[0]
        awarded = max(0, min(earned, GAME_DAILY_POINTS_CAP - today))
        if awarded:
            conn.execute(
                "INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'game', ?, ?, ?)",
                (user["id"], game, awarded, now),
            )
    return web.json_response({
        "earned": earned,
        "awarded": awarded,
        "dailyCap": GAME_DAILY_POINTS_CAP,
        "remainingToday": max(0, GAME_DAILY_POINTS_CAP - today - awarded),
    })


# ---------------------------------------------------------------------------
# Shared vocabulary memory
# ---------------------------------------------------------------------------
_WORDS_CACHE = {"mtime": None, "ids": frozenset()}
_GLOSSARY_CACHE = {"mtime": None, "words": {}}


def load_glossary() -> dict:
    """The words the Listen and Survive missions teach (static/listen_data.js), by id (they start with 'ls_')."""
    path = os.path.join(STATIC_DIR, "listen_data.js")
    try:
        mtime = os.path.getmtime(path)
    except OSError:
        return {}
    if _GLOSSARY_CACHE["mtime"] != mtime:
        words = {}
        try:
            with open(path, encoding="utf-8") as f:
                text = f.read()
            items, _ = json.JSONDecoder().raw_decode(text[text.index("[", text.index("LISTEN_GLOSSARY")):])
            words = {w["id"]: w for w in items if isinstance(w, dict) and isinstance(w.get("id"), str)}
        except (OSError, ValueError, KeyError):
            logger.warning("Could not read the Listen and Survive glossary", exc_info=True)
        _GLOSSARY_CACHE.update(mtime=mtime, words=words)
    return _GLOSSARY_CACHE["words"]


def load_word_ids() -> frozenset:
    """Ids of the flashcard words (static/flashcards_data.js), the only words the memory tracks."""
    path = os.path.join(STATIC_DIR, "flashcards_data.js")
    try:
        mtime = os.path.getmtime(path)
    except OSError:
        return frozenset()
    if _WORDS_CACHE["mtime"] != mtime:
        ids = frozenset()
        try:
            with open(path, encoding="utf-8") as f:
                text = f.read()
            cards, _ = json.JSONDecoder().raw_decode(text[text.index("["):])
            ids = frozenset(c["id"] for c in cards if isinstance(c, dict) and isinstance(c.get("id"), str))
        except (OSError, ValueError, KeyError):
            logger.warning("Could not read the flashcard ids", exc_info=True)
        _WORDS_CACHE.update(mtime=mtime, ids=ids)
    return _WORDS_CACHE["ids"]


def word_status(box: int, last_ok: int, next_review: int, now: int) -> str:
    """mastered | review (missed last time, or due again) | learning."""
    if box >= WORD_MASTERED_BOX and last_ok:
        return "mastered"
    if not last_ok or now >= next_review:
        return "review"
    return "learning"


def record_word_result(conn, student_id: str, word_id: str, ok: bool, source: str, now: int) -> None:
    row = conn.execute("SELECT * FROM word_progress WHERE student_id = ? AND word_id = ?", (student_id, word_id)).fetchone()
    box = row["box"] if row else 0
    correct, wrong, streak = (row["correct"], row["wrong"], row["streak"]) if row else (0, 0, 0)
    if ok:
        box = min(len(WORD_BOX_DAYS) - 1, box + 1)
        correct, streak = correct + 1, streak + 1
        next_review = now + int(WORD_BOX_DAYS[box] * 86400)
    else:
        box = max(0, box - 2) if box >= WORD_MASTERED_BOX else 0
        wrong, streak = wrong + 1, 0
        next_review = now + WORD_RETRY_SECONDS
    conn.execute(
        "INSERT INTO word_progress (student_id, word_id, box, correct, wrong, streak, last_ok, last_seen, next_review, last_source) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
        "ON CONFLICT(student_id, word_id) DO UPDATE SET box = excluded.box, correct = excluded.correct, wrong = excluded.wrong, "
        "streak = excluded.streak, last_ok = excluded.last_ok, last_seen = excluded.last_seen, next_review = excluded.next_review, "
        "last_source = excluded.last_source",
        (student_id, word_id, box, correct, wrong, streak, 1 if ok else 0, now, next_review, source),
    )


def word_memory(conn, student_id: str, now: int) -> dict:
    """Every word's state. The counts are for the flashcard words (the course); the mission glossary has its own counts."""
    ids, gids = load_word_ids(), set(load_glossary())
    words, counts, gcounts = {}, {"mastered": 0, "review": 0, "learning": 0}, {"mastered": 0, "review": 0, "learning": 0}
    for r in conn.execute("SELECT * FROM word_progress WHERE student_id = ?", (student_id,)).fetchall():
        wid = r["word_id"]
        if wid not in ids and wid not in gids:
            continue
        st = word_status(r["box"], r["last_ok"], r["next_review"], now)
        (counts if wid in ids else gcounts)[st] += 1
        words[wid] = {"s": st, "b": r["box"], "c": r["correct"], "w": r["wrong"], "n": r["next_review"]}
    counts["new"] = max(0, len(ids) - sum(counts.values()))
    counts["total"] = len(ids)
    gcounts["seen"] = sum(gcounts.values())
    gcounts["total"] = len(gids)
    return {"words": words, "counts": counts, "glossary": gcounts, "now": now}


async def handle_words_report(request: web.Request) -> web.Response:
    """Games and flashcards tell the server which words the student got right or wrong."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"words:{user['id']}", 120, 3600)
        data = await read_json(request)
        source = clean_text(data.get("source"), 24)
        if not re.fullmatch(r"[a-z_]{2,24}", source):
            raise ApiError("Manba noto'g'ri.")
        results = data.get("results")
        if not isinstance(results, list) or len(results) > WORD_MAX_REPORT:
            raise ApiError("Natija noto'g'ri.")
        valid, seen, applied = load_word_ids() | set(load_glossary()), {}, 0
        for item in results:
            if not isinstance(item, dict) or item.get("id") not in valid or not isinstance(item.get("ok"), bool):
                continue
            if seen.get(item["id"], 0) >= WORD_MAX_PER_WORD:
                continue
            seen[item["id"]] = seen.get(item["id"], 0) + 1
            record_word_result(conn, user["id"], item["id"], item["ok"], source, now)
            applied += 1
        memory = word_memory(conn, user["id"], now)
    return web.json_response({"applied": applied, "counts": memory["counts"], "glossary": memory["glossary"], "words": memory["words"], "now": now})


async def handle_words_get(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        return web.json_response(word_memory(conn, user["id"], now))


# ---------------------------------------------------------------------------
# Pomodoro focus blocks and Yashil shahar (the shared tree map)
# ---------------------------------------------------------------------------
def refuse(message: str, status: int = 409, **extra) -> web.Response:
    """An error answer that carries extra fields (ApiError only has a message)."""
    return web.json_response(dict(extra, message=message), status=status)


def focus_pause_used(row, now: int) -> int:
    """Seconds of pause that count: the earlier pauses plus a running one, never more than the budget."""
    used = (row["paused_total"] or 0) + (max(0, now - row["paused_at"]) if row["paused_at"] else 0)
    return min(FOCUS_PAUSE_SECONDS, used)


def focus_is_paused(row, now: int) -> bool:
    return bool(row["paused_at"]) and focus_pause_used(row, now) < FOCUS_PAUSE_SECONDS


def focus_active_seconds(row, now: int) -> int:
    """How long the block has really run: the clock stands still while paused."""
    if focus_is_paused(row, now):
        return max(0, row["paused_at"] - row["started_at"] - (row["paused_total"] or 0))
    return max(0, now - row["started_at"] - focus_pause_used(row, now))


def focus_session_view(row, now: int) -> dict:
    used = focus_pause_used(row, now)
    return {
        "id": row["id"], "startedAt": row["started_at"], "seconds": row["seconds"], "now": now,
        "remaining": max(0, row["seconds"] - focus_active_seconds(row, now)),
        "paused": focus_is_paused(row, now), "pauseLeft": FOCUS_PAUSE_SECONDS - used,
    }


def focus_expired(row, now: int) -> bool:
    """A block nobody came back to claim for half a day after it should have ended."""
    return now > row["started_at"] + row["seconds"] + FOCUS_PAUSE_SECONDS + FOCUS_CLAIM_SECONDS


def focus_done_today(conn, student_id: str, now: int) -> int:
    return conn.execute(
        "SELECT COUNT(*) FROM focus_sessions WHERE student_id = ? AND status = 'done' AND finished_at >= ?",
        (student_id, day_start_ts(now)),
    ).fetchone()[0]


def focus_finished_total(conn, student_id: str) -> int:
    return conn.execute("SELECT COUNT(*) FROM focus_sessions WHERE student_id = ? AND status = 'done'", (student_id,)).fetchone()[0]


def green_counts(conn, student_id: str) -> dict:
    out = {"unplanted": 0, "planted": 0, "wilted": 0}
    for r in conn.execute("SELECT state, COUNT(*) AS n FROM green_trees WHERE student_id = ? GROUP BY state", (student_id,)):
        if r["state"] in out:
            out[r["state"]] = r["n"]
    out["finished"] = focus_finished_total(conn, student_id)
    out["kinds"] = green_city.unlocked_kinds(out["finished"])
    return out


def active_focus_row(conn, student_id: str):
    return conn.execute(
        "SELECT * FROM focus_sessions WHERE student_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1",
        (student_id,),
    ).fetchone()


def tree_view(r, name: str = "") -> dict:
    return {
        "id": r["id"], "lat": r["lat"], "lon": r["lon"], "kind": r["kind"], "state": r["state"],
        "at": r["planted_at"], "wiltedAt": r["wilted_at"], "ownerId": r["student_id"], "by": name,
    }


def wilt_latest_tree(conn, student_id: str, now: int):
    """A failed block wilts the student's own latest planted tree (and never invents one if there is none)."""
    r = conn.execute(
        "SELECT * FROM green_trees WHERE student_id = ? AND state = 'planted' "
        "ORDER BY COALESCE(restored_at, planted_at) DESC, id DESC LIMIT 1",
        (student_id,),
    ).fetchone()
    if r is None:
        return None
    conn.execute("UPDATE green_trees SET state = 'wilted', wilted_at = ?, updated_at = ? WHERE id = ?", (now, now, r["id"]))
    return conn.execute("SELECT * FROM green_trees WHERE id = ?", (r["id"],)).fetchone()


async def handle_focus_start(request: web.Request) -> web.Response:
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"focus:{user['id']}", 40, 3600)
        conn.execute("BEGIN IMMEDIATE")
        row = active_focus_row(conn, user["id"])
        if row is not None:
            if focus_expired(row, now):
                conn.execute("UPDATE focus_sessions SET status = 'cancelled' WHERE id = ?", (row["id"],))
            else:  # the app was closed meanwhile: hand the running block back instead of starting a second one
                return refuse("Sizda tugallanmagan pomidor bor.", 409, active=focus_session_view(row, now))
        today = focus_done_today(conn, user["id"], now)
        if today >= FOCUS_DAILY_TREES:
            raise ApiError("Bugun 6 soat dars qildingiz. Ertaga yana davom eting!", 409)
        sid = secrets.token_hex(8)
        conn.execute(
            "INSERT INTO focus_sessions (id, student_id, started_at, seconds, status) VALUES (?, ?, ?, ?, 'active')",
            (sid, user["id"], now, FOCUS_SECONDS),
        )
        row = conn.execute("SELECT * FROM focus_sessions WHERE id = ?", (sid,)).fetchone()
        counts = green_counts(conn, user["id"])
    return web.json_response(dict(focus_session_view(row, now), todayTrees=today, dailyTrees=FOCUS_DAILY_TREES, unplanted=counts["unplanted"]))


def _own_active_block(conn, request, data):
    user = require_user(conn, request)
    row = conn.execute(
        "SELECT * FROM focus_sessions WHERE id = ? AND student_id = ?", (clean_text(data.get("id"), 32), user["id"])
    ).fetchone()
    if row is None:
        raise ApiError("Seans topilmadi.", 404)
    return user, row


async def handle_focus_pause(request: web.Request) -> web.Response:
    now = int(time.time())
    data = await read_json(request)
    with get_db() as conn:
        user, row = _own_active_block(conn, request, data)
        if row["status"] != "active":
            raise ApiError("Bu seans tugagan.", 409)
        if not focus_is_paused(row, now):
            if focus_pause_used(row, now) >= FOCUS_PAUSE_SECONDS:
                raise ApiError("Pauza vaqti tugagan. Pomidorni davom ettiring.", 409)
            if focus_active_seconds(row, now) >= row["seconds"]:
                raise ApiError("Vaqt tugadi, pauza kerak emas.", 409)
            conn.execute("UPDATE focus_sessions SET paused_at = ? WHERE id = ?", (now, row["id"]))
            row = conn.execute("SELECT * FROM focus_sessions WHERE id = ?", (row["id"],)).fetchone()
    return web.json_response(focus_session_view(row, now))


async def handle_focus_resume(request: web.Request) -> web.Response:
    now = int(time.time())
    data = await read_json(request)
    with get_db() as conn:
        user, row = _own_active_block(conn, request, data)
        if row["status"] != "active":
            raise ApiError("Bu seans tugagan.", 409)
        if row["paused_at"]:
            conn.execute(
                "UPDATE focus_sessions SET paused_total = ?, paused_at = NULL WHERE id = ?",
                (focus_pause_used(row, now), row["id"]),
            )
            row = conn.execute("SELECT * FROM focus_sessions WHERE id = ?", (row["id"],)).fetchone()
    return web.json_response(focus_session_view(row, now))


async def handle_focus_finish(request: web.Request) -> web.Response:
    """Earns the tree once the whole block has run on the server's clock (idempotent per block)."""
    now = int(time.time())
    data = await read_json(request)
    with get_db() as conn:
        user, row = _own_active_block(conn, request, data)
        enforce_rate_limit(f"focusfin:{user['id']}", 60, 3600)
        conn.execute("BEGIN IMMEDIATE")
        if row["status"] == "done":
            return web.json_response({"already": True, "awarded": 0, "todayTrees": focus_done_today(conn, user["id"], now),
                                      "dailyTrees": FOCUS_DAILY_TREES, **green_counts(conn, user["id"])})
        if row["status"] != "active":
            raise ApiError("Bu seans bekor qilingan.", 409)
        left = row["seconds"] - focus_active_seconds(row, now)
        if left > FOCUS_GRACE_SECONDS:
            raise ApiError(f"Hali vaqt tugamadi. Yana {left} soniya.", 409)
        if focus_expired(row, now):
            conn.execute("UPDATE focus_sessions SET status = 'cancelled' WHERE id = ?", (row["id"],))
            conn.commit()
            raise ApiError("Seans muddati o'tib ketdi. Qaytadan boshlang.", 409)
        today = focus_done_today(conn, user["id"], now)
        if today >= FOCUS_DAILY_TREES:
            raise ApiError("Bugun 6 soat dars qildingiz. Ertaga yana davom eting!", 409)
        conn.execute("UPDATE focus_sessions SET status = 'done', finished_at = ?, paused_at = NULL WHERE id = ?", (now, row["id"]))
        conn.execute(
            "INSERT INTO green_trees (student_id, session_id, state, earned_at, updated_at) VALUES (?, ?, 'unplanted', ?, ?)",
            (user["id"], row["id"], now, now),
        )
        rewarded = conn.execute(
            "SELECT COUNT(*) FROM points_log WHERE student_id = ? AND source = 'focus' AND created_at >= ?",
            (user["id"], day_start_ts(now)),
        ).fetchone()[0]
        awarded = FOCUS_POINTS_PER_TREE if rewarded < FOCUS_REWARDED_TREES else 0
        if awarded:
            conn.execute(
                "INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'focus', ?, ?, ?)",
                (user["id"], row["id"], awarded, now),
            )
        counts = green_counts(conn, user["id"])
    return web.json_response({"already": False, "awarded": awarded, "todayTrees": today + 1, "dailyTrees": FOCUS_DAILY_TREES, **counts})


async def handle_focus_cancel(request: web.Request) -> web.Response:
    """Giving up a block wilts the student's latest planted tree. A pause never does."""
    now = int(time.time())
    data = await read_json(request)
    with get_db() as conn:
        user, row = _own_active_block(conn, request, data)
        conn.execute("BEGIN IMMEDIATE")
        wilted = None
        if row["status"] == "active":
            if row["seconds"] - focus_active_seconds(row, now) <= FOCUS_GRACE_SECONDS:
                raise ApiError("Vaqt tugadi, daraxtni oling.", 409)
            conn.execute("UPDATE focus_sessions SET status = 'cancelled', paused_at = NULL WHERE id = ?", (row["id"],))
            r = wilt_latest_tree(conn, user["id"], now)
            wilted = tree_view(r, user["name"]) if r else None
        counts = green_counts(conn, user["id"])
    return web.json_response({"status": "ok", "wiltedTree": wilted, **counts})


async def handle_focus_state(request: web.Request) -> web.Response:
    """The block that is running (or finished but not yet claimed), so a reload or a closed app resumes it."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        row = active_focus_row(conn, user["id"])
        active = focus_session_view(row, now) if row and not focus_expired(row, now) else None
        today = focus_done_today(conn, user["id"], now)
        counts = green_counts(conn, user["id"])
        latest = conn.execute(
            "SELECT * FROM green_trees WHERE student_id = ? AND state = 'planted' "
            "ORDER BY COALESCE(restored_at, planted_at) DESC, id DESC LIMIT 1", (user["id"],)).fetchone()
        city = conn.execute("SELECT COUNT(*) FROM green_trees WHERE state = 'planted'").fetchone()[0]
    return web.json_response({"active": active, "todayTrees": today, "dailyTrees": FOCUS_DAILY_TREES, "now": now, "cityTrees": city,
                              "pauseSeconds": FOCUS_PAUSE_SECONDS, "latestTree": tree_view(latest, user["name"]) if latest else None, **counts})


def custom_green_rings(conn) -> list:
    rings = []
    for r in conn.execute("SELECT polygon FROM green_zones"):
        try:
            ring = json.loads(r["polygon"])
        except ValueError:
            continue
        if isinstance(ring, list) and len(ring) >= 3:
            rings.append(ring)
    return rings


def read_coordinates(data: dict) -> tuple:
    try:
        lat, lon = float(data.get("lat")), float(data.get("lon"))
    except (TypeError, ValueError):
        raise ApiError("Joy noto'g'ri berilgan.", 400)
    if not (math.isfinite(lat) and math.isfinite(lon) and -90 <= lat <= 90 and -180 <= lon <= 180):
        raise ApiError("Joy noto'g'ri berilgan.", 400)
    return round(lat, 7), round(lon, 7)


def judge_green_spot(conn, lat: float, lon: float, exclude_id=None) -> dict:
    """May a tree stand here? Checks the ground first, then the 2 m rule against every planted or wilted tree."""
    rings = custom_green_rings(conn)
    if not GREEN_ZONES.available() and not rings:
        raise ApiError("Yashil hududlar ma'lumoti topilmadi.", 503)
    dlat, dlon = green_city.degree_box(lat, green_city.NEAR_WINDOW_M)
    near = conn.execute(
        "SELECT g.*, s.name AS owner FROM green_trees g LEFT JOIN students s ON s.id = g.student_id "
        "WHERE g.state IN ('planted', 'wilted') AND g.lat BETWEEN ? AND ? AND g.lon BETWEEN ? AND ?",
        (lat - dlat, lat + dlat, lon - dlon, lon + dlon),
    ).fetchall()
    near = [r for r in near if r["id"] != exclude_id]
    distance, hit = green_city.nearest_tree(lat, lon, near)
    verdict = GREEN_ZONES.judge(lat, lon, rings)
    out = {"ok": False, "code": verdict, "distance": None if distance is None else round(distance, 2),
           "nearest": None if hit is None else {"by": hit["owner"] or "", "kind": hit["kind"], "state": hit["state"]}}
    if verdict != "ok":
        out["message"] = green_city.REASONS[verdict]
    elif distance is not None and distance < green_city.MIN_DISTANCE_M:
        out["code"] = "close"
        out["message"] = green_city.too_close_message(distance)
    else:
        out["ok"], out["code"], out["message"] = True, "ok", ""
    return out


async def handle_green_check(request: web.Request) -> web.Response:
    """The preview before planting: nothing is stored."""
    data = await read_json(request)
    lat, lon = read_coordinates(data)
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"greencheck:{user['id']}", 1200, 3600)
        verdict = judge_green_spot(conn, lat, lon)
    return web.json_response(verdict)


async def handle_green_plant(request: web.Request) -> web.Response:
    now = int(time.time())
    data = await read_json(request)
    lat, lon = read_coordinates(data)
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"greenplant:{user['id']}", 300, 3600)
        # one writer at a time, so two requests for the same spot can never both pass the 2 m check
        conn.execute("BEGIN IMMEDIATE")
        credit = conn.execute(
            "SELECT * FROM green_trees WHERE student_id = ? AND state = 'unplanted' ORDER BY earned_at, id LIMIT 1", (user["id"],)
        ).fetchone()
        if credit is None:
            raise ApiError("Ekadigan daraxtingiz yo'q. Avval pomidorni tugating.", 409)
        counts = green_counts(conn, user["id"])
        kind = clean_text(data.get("kind"), 20) or random.choice(green_city.COMMON_KINDS)
        if kind not in counts["kinds"]:
            raise ApiError("Bu daraxt turi hali ochilmagan.", 400)
        verdict = judge_green_spot(conn, lat, lon)
        if not verdict["ok"]:
            return refuse(verdict["message"], 409, code=verdict["code"], distance=verdict["distance"])
        conn.execute(
            "UPDATE green_trees SET state = 'planted', kind = ?, lat = ?, lon = ?, planted_at = ?, updated_at = ? WHERE id = ?",
            (kind, lat, lon, now, now, credit["id"]),
        )
        tree = conn.execute("SELECT * FROM green_trees WHERE id = ?", (credit["id"],)).fetchone()
        counts = green_counts(conn, user["id"])
    return web.json_response({"tree": tree_view(tree, user["name"]), "now": now, **counts})


async def handle_green_restore(request: web.Request) -> web.Response:
    """A wilted tree comes back to life for one earned tree (one finished Pomodoro)."""
    now = int(time.time())
    data = await read_json(request)
    try:
        tree_id = int(data.get("id"))
    except (TypeError, ValueError):
        raise ApiError("Daraxt topilmadi.", 404)
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"greenrestore:{user['id']}", 120, 3600)
        conn.execute("BEGIN IMMEDIATE")
        tree = conn.execute(
            "SELECT * FROM green_trees WHERE id = ? AND student_id = ? AND state = 'wilted'", (tree_id, user["id"])
        ).fetchone()
        if tree is None:
            raise ApiError("So'lgan daraxt topilmadi.", 404)
        credit = conn.execute(
            "SELECT id FROM green_trees WHERE student_id = ? AND state = 'unplanted' ORDER BY earned_at, id LIMIT 1", (user["id"],)
        ).fetchone()
        if credit is None:
            raise ApiError("Tiklash uchun 1 ta pomidor (ekilmagan daraxt) kerak. Avval pomidorni tugating.", 409)
        conn.execute("UPDATE green_trees SET state = 'spent', updated_at = ? WHERE id = ?", (now, credit["id"]))
        conn.execute(
            "UPDATE green_trees SET state = 'planted', restored_at = ?, wilted_at = NULL, updated_at = ? WHERE id = ?",
            (now, now, tree["id"]),
        )
        tree = conn.execute("SELECT * FROM green_trees WHERE id = ?", (tree["id"],)).fetchone()
        counts = green_counts(conn, user["id"])
    return web.json_response({"tree": tree_view(tree, user["name"]), "now": now, **counts})


async def handle_green_city(request: web.Request) -> web.Response:
    """Everybody's planted and wilted trees (only the ones changed since `since`), the planters and the user's totals."""
    now = int(time.time())
    try:
        since = max(0, int(request.query.get("since", "0")))
    except ValueError:
        since = 0
    with get_db() as conn:
        user = require_user(conn, request)
        rows = conn.execute(
            "SELECT g.*, s.name FROM green_trees g LEFT JOIN students s ON s.id = g.student_id "
            "WHERE g.state IN ('planted', 'wilted') AND g.updated_at >= ? ORDER BY g.id LIMIT 6000",
            (since,),
        ).fetchall()
        planted = conn.execute("SELECT COUNT(*) FROM green_trees WHERE state = 'planted'").fetchone()[0]
        wilted = conn.execute("SELECT COUNT(*) FROM green_trees WHERE state = 'wilted'").fetchone()[0]

        def board(since_ts):
            out = []
            for r in conn.execute(
                "SELECT s.*, SUM(g.state = 'planted') AS n, SUM(g.state = 'wilted') AS w FROM green_trees g "
                "JOIN students s ON s.id = g.student_id WHERE g.state IN ('planted', 'wilted') AND g.planted_at >= ? "
                "GROUP BY s.id HAVING n > 0 OR w > 0 ORDER BY n DESC, MIN(g.planted_at) LIMIT 15",
                (since_ts,),
            ).fetchall():
                out.append({"id": r["id"], "name": r["name"], "photoUrl": avatar_url(r), "character": character_of(r),
                            "trees": r["n"] or 0, "wilted": r["w"] or 0})
            return out

        zones = [{"id": z["id"], "name": z["name"], "polygon": json.loads(z["polygon"])}
                 for z in conn.execute("SELECT * FROM green_zones ORDER BY id")]
        counts = green_counts(conn, user["id"])
        today = focus_done_today(conn, user["id"], now)
        payload = {
            "trees": [tree_view(r, r["name"] or "") for r in rows],
            "cityTrees": planted, "cityWilted": wilted, "todayTrees": today, "dailyTrees": FOCUS_DAILY_TREES,
            "week": board(week_start_ts(now)), "all": board(0), "zones": zones, "now": now, "meId": user["id"],
            "minDistance": green_city.MIN_DISTANCE_M, "rare": [{"kind": k, "need": n} for k, n in green_city.RARE_KINDS],
            "isAdmin": user["role"] == "admin", **counts,
        }
    return web.json_response(payload)


def read_zone_polygon(data: dict) -> list:
    pts = data.get("polygon")
    if not isinstance(pts, list) or not 3 <= len(pts) <= GREEN_MAX_ZONE_POINTS:
        raise ApiError("Hudud kamida 3 ta nuqtadan iborat bo'lishi kerak.", 400)
    ring = []
    for p in pts:
        if not isinstance(p, (list, tuple)) or len(p) != 2:
            raise ApiError("Hudud nuqtalari noto'g'ri.", 400)
        lat, lon = read_coordinates({"lat": p[0], "lon": p[1]})
        if not (40.4 <= lat <= 40.9 and 71.9 <= lon <= 72.6):
            raise ApiError("Hudud Asaka tumanidan tashqarida.", 400)
        ring.append([lat, lon])
    lats, lons = [p[0] for p in ring], [p[1] for p in ring]
    if max(lats) - min(lats) > 0.03 or max(lons) - min(lons) > 0.04:
        raise ApiError("Hudud juda katta (3 km dan oshmasin).", 400)
    return ring


async def handle_green_zone_add(request: web.Request) -> web.Response:
    data = await read_json(request)
    ring = read_zone_polygon(data)
    name = clean_text(data.get("name"), 60) or "Yangi hudud"
    with get_db() as conn:
        user = require_user(conn, request, roles=("admin",))
        cur = conn.execute(
            "INSERT INTO green_zones (name, polygon, created_by, created_at) VALUES (?, ?, ?, ?)",
            (name, json.dumps(ring), user["id"], int(time.time())),
        )
    return web.json_response({"zone": {"id": cur.lastrowid, "name": name, "polygon": ring}})


async def handle_green_zone_delete(request: web.Request) -> web.Response:
    data = await read_json(request)
    with get_db() as conn:
        require_user(conn, request, roles=("admin",))
        conn.execute("DELETE FROM green_zones WHERE id = ?", (clean_text(data.get("id"), 12),))
    return web.json_response({"status": "ok"})


# ---------------------------------------------------------------------------
# Listen and Survive: mission results
# ---------------------------------------------------------------------------
LISTEN_MISSIONS = ("escape", "camp", "airport", "detective", "timed")
LISTEN_DIFFICULTIES = ("easy", "normal", "hard")
LISTEN_MIN_SECONDS_PER_STEP = 4
LISTEN_POINTS_PER_CORRECT, LISTEN_MAX_CORRECT_POINTS, LISTEN_POINTS_PER_STAR = 2, 10, 5


def listen_stars(correct: int, steps: int, hearts: int) -> int:
    """3 stars for a perfect mission, 2 for at least 80%, 1 for at least 60%; none when all the hearts were lost."""
    if hearts <= 0:
        return 0
    if correct >= steps:
        return 3
    ratio = correct / steps
    return 2 if ratio >= 0.8 else 1 if ratio >= 0.6 else 0


def listen_progress(conn, student_id: str) -> dict:
    return {
        r["mission"]: {"stars": r["stars"], "plays": r["plays"], "best": r["best_correct"]}
        for r in conn.execute("SELECT * FROM listen_progress WHERE student_id = ?", (student_id,)).fetchall()
    }


async def handle_listen_finish(request: web.Request) -> web.Response:
    """A mission ended: remember the best result and pay points (capped per day with the other games)."""
    now = int(time.time())
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"listen:{user['id']}", 60, 3600)
        data = await read_json(request)
        mission, diff = str(data.get("mission") or ""), str(data.get("difficulty") or "")
        nums = [data.get(k) for k in ("steps", "correct", "hearts")]
        seconds = data.get("seconds")
        if mission not in LISTEN_MISSIONS or diff not in LISTEN_DIFFICULTIES \
                or any(not isinstance(n, int) or isinstance(n, bool) for n in nums) \
                or not isinstance(seconds, (int, float)) or isinstance(seconds, bool):
            raise ApiError("Natija noto'g'ri.")
        steps, correct, hearts = nums
        if not (3 <= steps <= 12 and 0 <= correct <= steps and 0 <= hearts <= 3):
            raise ApiError("Natija noto'g'ri.")
        stars = listen_stars(correct, steps, hearts)
        earned = 0
        if seconds >= steps * LISTEN_MIN_SECONDS_PER_STEP and correct >= 2:   # a real run takes time
            earned = min(LISTEN_MAX_CORRECT_POINTS, LISTEN_POINTS_PER_CORRECT * correct) + LISTEN_POINTS_PER_STAR * stars
        today = conn.execute(
            "SELECT COALESCE(SUM(points), 0) FROM points_log WHERE student_id = ? AND source = 'game' AND created_at >= ?",
            (user["id"], day_start_ts(now)),
        ).fetchone()[0]
        awarded = max(0, min(earned, GAME_DAILY_POINTS_CAP - today))
        if awarded:
            conn.execute(
                "INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'game', 'listen', ?, ?)",
                (user["id"], awarded, now),
            )
        conn.execute(
            "INSERT INTO listen_progress (student_id, mission, stars, best_correct, plays, last_played) VALUES (?, ?, ?, ?, 1, ?) "
            "ON CONFLICT(student_id, mission) DO UPDATE SET stars = MAX(stars, excluded.stars), "
            "best_correct = MAX(best_correct, excluded.best_correct), plays = plays + 1, last_played = excluded.last_played",
            (user["id"], mission, stars, correct, now),
        )
        progress = listen_progress(conn, user["id"])
    return web.json_response({
        "stars": stars, "earned": earned, "awarded": awarded,
        "remainingToday": max(0, GAME_DAILY_POINTS_CAP - today - awarded), "progress": progress,
    })


async def handle_listen_progress(request: web.Request) -> web.Response:
    with get_db() as conn:
        user = require_user(conn, request)
        return web.json_response({"missions": listen_progress(conn, user["id"])})


# ---------------------------------------------------------------------------
# Word Race: rooms, the WebSocket and the rewards (the rules live in race_engine.py)
# ---------------------------------------------------------------------------
RACE_MAX_ROOMS = 60
RACE_TICK = 0.2
RACE_LINGER_SECONDS = 300   # a finished room stays this long (results, rematch)
RACE_EMPTY_SECONDS = 120    # a room nobody has joined, or everybody left
RACE_PLACE_POINTS = {1: 15, 2: 8, 3: 4}
RACE_FINISH_POINTS = 10
RACE_MAX_CORRECT_POINTS = 20
RACE_MIN_CORRECT = 3        # fewer right answers than this earn nothing (no points for just sitting there)
RACE_ROOMS: dict = {}
_RACE_DATA = {"mtimes": None, "cards": {}, "bank": []}


def race_data():
    """(flashcards by id, grammar bank), re-read when the files change. Questions are checked against these."""
    paths = [os.path.join(STATIC_DIR, n) for n in ("flashcards_data.js", "millionaire_data.js")]
    try:
        mtimes = tuple(os.path.getmtime(p) for p in paths)
    except OSError:
        return {}, []
    if _RACE_DATA["mtimes"] != mtimes:
        loaded = []
        for p in paths:
            with open(p, encoding="utf-8") as f:
                text = f.read()
            loaded.append(json.JSONDecoder().raw_decode(text[text.index("["):])[0])
        _RACE_DATA.update(mtimes=mtimes, cards={c["id"]: c for c in loaded[0]}, bank=loaded[1])
    # words met in the Listen and Survive missions can be asked in a race too
    return {**load_glossary(), **_RACE_DATA["cards"]}, _RACE_DATA["bank"]


class RaceRoom:
    def __init__(self, room, creator_id):
        self.room, self.creator = room, creator_id
        self.socks = {}          # player id -> WebSocketResponse
        self.task = None
        self.touched = time.time()
        self.ended_at = None


def race_purge(now=None):
    now = now or time.time()
    for code, e in list(RACE_ROOMS.items()):
        idle = now - e.touched
        if (e.room.state == "ended" and now - (e.ended_at or e.touched) > RACE_LINGER_SECONDS) \
                or (not e.socks and idle > RACE_EMPTY_SECONDS) or idle > 3600:
            if e.task and not e.task.done():
                e.task.cancel()
            del RACE_ROOMS[code]


async def race_send(entry, pid, msg):
    ws = entry.socks.get(pid)
    if ws is not None and not ws.closed:
        try:
            await ws.send_json(msg)
        except Exception:  # the connection is going away; the read loop cleans up
            pass


async def race_broadcast(entry, msg):
    await asyncio.gather(*(race_send(entry, pid, msg) for pid in list(entry.socks)))


async def race_dispatch(entry, events):
    for e in events:
        if e["to"] is None:
            await race_broadcast(entry, e["msg"])
        else:
            await race_send(entry, e["to"], e["msg"])


def race_flush_words(entry):
    """What the players got right or wrong goes into the shared vocabulary memory."""
    events, entry.room.word_events = entry.room.word_events, []
    if not events:
        return
    now = int(time.time())
    with get_db() as conn:
        for student_id, word_id, ok in events:
            record_word_result(conn, student_id, word_id, ok, "wordrace", now)


def race_points(result) -> int:
    if result["correct"] < RACE_MIN_CORRECT:
        return 0
    earned = min(RACE_MAX_CORRECT_POINTS, result["correct"])
    if result["finished"]:
        earned += RACE_FINISH_POINTS + RACE_PLACE_POINTS.get(result["rank"], 0)
    return earned


async def race_finish(entry, now):
    room = entry.room
    entry.ended_at = now
    results = room.results()
    awards = {}
    with get_db() as conn:
        for r in results:
            if r["bot"] or not r["student_id"]:
                continue
            earned = race_points(r)
            today = conn.execute(
                "SELECT COALESCE(SUM(points), 0) FROM points_log WHERE student_id = ? AND source = 'game' AND created_at >= ?",
                (r["student_id"], day_start_ts(int(now))),
            ).fetchone()[0]
            awarded = max(0, min(earned, GAME_DAILY_POINTS_CAP - today))
            if awarded:
                conn.execute(
                    "INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'game', 'wordrace', ?, ?)",
                    (r["student_id"], awarded, int(now)),
                )
            awards[r["id"]] = {"earned": earned, "awarded": awarded, "remainingToday": max(0, GAME_DAILY_POINTS_CAP - today - awarded)}
    race_flush_words(entry)
    public = [{k: v for k, v in r.items() if k != "student_id"} for r in results]
    await race_broadcast(entry, {"t": "end", "results": public, "awards": awards})


async def run_race(entry):
    """Ticks a started race until it ends, then pays out."""
    room = entry.room
    try:
        while room.state in ("countdown", "running"):
            await asyncio.sleep(RACE_TICK)
            now = time.time()
            events = room.tick(now)
            await race_dispatch(entry, events)
            race_flush_words(entry)
            if room.state == "ended":
                await race_finish(entry, now)
            else:
                await race_broadcast(entry, room.snapshot(now))
    except asyncio.CancelledError:
        raise
    except Exception:
        logger.exception("Race %s crashed", room.code)
        room.state, entry.ended_at = "ended", time.time()
        await race_broadcast(entry, {"t": "error", "message": "Poyga kutilmaganda to'xtadi."})


async def handle_race_create(request: web.Request) -> web.Response:
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"racecreate:{user['id']}", 20, 3600)
        data = await read_json(request)
    race_purge()
    if len(RACE_ROOMS) >= RACE_MAX_ROOMS:
        raise ApiError("Hozir juda ko'p poyga bor. Birozdan so'ng urinib ko'ring.", 429)
    code = race_engine.new_code(RACE_ROOMS.keys())
    room = race_engine.Room(code, clean_text(data.get("mode"), 12), clean_text(data.get("level"), 8), now=time.time())
    RACE_ROOMS[code] = RaceRoom(room, user["id"])
    return web.json_response({"code": code, "capacity": race_engine.CAPACITY})


async def handle_race_mates(request: web.Request) -> web.Response:
    """Classmates the student can invite; those who use Telegram get the invitation as a bot message."""
    with get_db() as conn:
        user = require_user(conn, request)
        rows = [r for r in rating_students(conn) if r["id"] != user["id"]]
    rows.sort(key=lambda r: r["name"].casefold())
    return web.json_response({"mates": [
        {"id": r["id"], "name": r["name"], "photoUrl": avatar_url(r), "character": character_of(r), "telegram": _tg_chat_id(r["id"]) is not None}
        for r in rows[:150]
    ]})


async def handle_race_invite(request: web.Request) -> web.Response:
    with get_db() as conn:
        user = require_user(conn, request)
        enforce_rate_limit(f"raceinvite:{user['id']}", 30, 3600)
        data = await read_json(request)
    code = clean_text(data.get("code"), 8).upper()
    entry = RACE_ROOMS.get(code)
    ids = [i for i in (data.get("ids") or []) if isinstance(i, str)][:10]
    if entry is None or not any(p.student_id == user["id"] for p in entry.room.humans()):
        raise ApiError("Xona topilmadi.", 404)
    sent = 0
    for sid in ids:
        chat_id = _tg_chat_id(sid)
        if chat_id is None or TG_APP is None or sid == user["id"]:
            continue
        markup = None
        if WEBAPP_URL.startswith("https://"):
            markup = InlineKeyboardMarkup([[InlineKeyboardButton("🏎️ Poygaga qo'shilish", web_app=WebAppInfo(url=f"{WEBAPP_URL.rstrip('/')}/?race={code}"))]])
        try:
            await TG_APP.bot.send_message(
                chat_id=chat_id, reply_markup=markup,
                text=f"🏎️ {user['name']} sizni Word Race poygasiga chaqiryapti!\nXona kodi: {code}",
            )
            sent += 1
        except Exception as e:
            logger.info("Could not invite %s: %s", chat_id, e)
        await asyncio.sleep(0.05)
    return web.json_response({"sent": sent, "skipped": len(ids) - sent})


async def handle_race_ws(request: web.Request) -> web.WebSocketResponse:
    ws = web.WebSocketResponse(heartbeat=25, max_msg_size=256 * 1024)
    await ws.prepare(request)
    code = request.query.get("code", "").upper()[:8]
    entry, pid, user = RACE_ROOMS.get(code), None, None
    try:
        # the first message is the sign-in: browsers cannot send headers on a WebSocket
        first = await asyncio.wait_for(ws.receive(), 10)
        data = json.loads(first.data) if first.type == WSMsgType.TEXT else {}
        token = str(data.get("token") or "")
        with get_db() as conn:
            row = conn.execute(
                "SELECT s.* FROM sessions x JOIN students s ON s.id = x.student_id WHERE x.token_hash = ? AND x.expires_at > ?",
                (_token_hash(token), int(time.time())),
            ).fetchone() if token else None
            if row is None or row["status"] != "approved":
                await ws.send_json({"t": "error", "message": "Tizimga kiring.", "fatal": True})
                return ws
            user = dict(row)
            enforce_rate_limit(f"racews:{user['id']}", 60, 3600)
        if entry is None:
            await ws.send_json({"t": "error", "message": "Xona topilmadi. Kodni tekshiring.", "fatal": True})
            return ws
        room = entry.room
        pid = room.add_human(user["id"], user["name"], character_of(user), avatar_url(user))
        if pid is None:
            await ws.send_json({"t": "error", "message": "Xona to'lgan yoki poyga allaqachon boshlangan.", "fatal": True})
            return ws
        old = entry.socks.get(pid)
        entry.socks[pid] = ws
        entry.touched = time.time()
        if old is not None and old is not ws and not old.closed:
            await old.close()
        await ws.send_json({"t": "joined", "you": pid, "code": code, "now": time.time()})
        await race_broadcast(entry, room.lobby())
        if room.state == "running":  # came back during the race: continue with the current question
            q = room.players[pid]
            if q.questions:
                await race_send(entry, pid, room._qmsg(q))
        stamps = []
        async for msg in ws:
            if msg.type != WSMsgType.TEXT:
                continue
            nowt = time.time()
            stamps = [s for s in stamps if nowt - s < 5] + [nowt]
            if len(stamps) > 40:   # more than 8 messages a second is not a person
                continue
            try:
                data = json.loads(msg.data)
            except ValueError:
                continue
            if not isinstance(data, dict):
                continue
            entry.touched = nowt
            await race_message(entry, pid, data, nowt)
    except asyncio.TimeoutError:
        pass
    except ApiError as e:
        await ws.send_json({"t": "error", "message": e.message if hasattr(e, "message") else str(e), "fatal": True})
    except Exception:
        logger.exception("Race socket failed")
    finally:
        if entry is not None and pid is not None and entry.socks.get(pid) is ws:
            del entry.socks[pid]
            gone = entry.room.remove(pid)
            if entry.room.state == "lobby":
                if gone and not entry.socks:
                    RACE_ROOMS.pop(code, None)
                else:
                    await race_broadcast(entry, entry.room.lobby())
        if not ws.closed:
            await ws.close()
    return ws


async def race_message(entry, pid, data, now):
    room, t = entry.room, data.get("t")
    host = room.host == pid
    if t in ("bots", "mode", "start", "rematch") and not host:
        await race_send(entry, pid, {"t": "error", "message": "Buni faqat xona egasi qila oladi."})
        return
    if t == "questions":
        cards, bank = race_data()
        n = room.set_questions(pid, data.get("items"), cards, bank)
        await race_send(entry, pid, {"t": "ack", "accepted": n, "ready": room.players[pid].ready})
        await race_broadcast(entry, room.lobby())
    elif t == "bots" and host:
        room.set_bots(data.get("n") if isinstance(data.get("n"), int) else 0, clean_text(data.get("level"), 8) or None)
        await race_broadcast(entry, room.lobby())
    elif t == "mode" and host:
        room.set_mode(clean_text(data.get("mode"), 12))
        await race_broadcast(entry, room.lobby())
    elif t == "start" and host:
        if room.start(now):
            await race_broadcast(entry, {"t": "countdown", "startAt": room.start_at, "now": now})
            entry.task = asyncio.create_task(run_race(entry))
        else:
            await race_send(entry, pid, {"t": "error", "message": "Hamma o'yinchi hali tayyor emas."})
    elif t == "answer":
        if not isinstance(data.get("i"), int):
            return
        events = room.answer(pid, data["i"], str(data.get("a", ""))[:100], now)
        await race_dispatch(entry, events)
    elif t == "rematch" and host:
        if room.reset_lobby():
            await race_broadcast(entry, room.lobby())
    elif t == "leave":
        sock = entry.socks.get(pid)
        if sock is not None:
            await sock.close()


async def handle_avatar(request: web.Request) -> web.StreamResponse:
    sid = request.match_info["student_id"]
    if not re.fullmatch(r"tg_\d{1,20}", sid):
        raise web.HTTPNotFound()
    path = os.path.join(avatar_dir(), f"{sid}.jpg")
    if not os.path.isfile(path):
        raise web.HTTPNotFound()
    return web.FileResponse(path, headers={"Cache-Control": "public, max-age=86400"})


async def refresh_telegram_avatar(tg_id: int) -> None:
    """Downloads the user's Telegram profile photo now and then and serves it from /avatars/.
    Telegram file URLs contain the bot token, so they are never given to the browser."""
    if TG_APP is None:
        return
    sid = f"tg_{tg_id}"
    path = os.path.join(avatar_dir(), f"{sid}.jpg")
    try:
        if os.path.isfile(path) and time.time() - os.path.getmtime(path) < AVATAR_MAX_AGE:
            return
        photos = await TG_APP.bot.get_user_profile_photos(tg_id, limit=1)
        if not photos.total_count or not photos.photos:
            return
        sizes = photos.photos[0]
        best = next((p for p in sizes if p.width >= 160), sizes[-1])
        tg_file = await TG_APP.bot.get_file(best.file_id)
        data = bytes(await tg_file.download_as_bytearray())
        os.makedirs(avatar_dir(), exist_ok=True)
        tmp = path + ".tmp"
        with open(tmp, "wb") as f:
            f.write(data)
        os.replace(tmp, path)
        with get_db() as conn:
            conn.execute("UPDATE students SET avatar_version = ? WHERE id = ?", (int(time.time()), sid))
    except Exception as e:
        logger.info("Could not fetch Telegram avatar for %s: %s", sid, e)


# ---------------------------------------------------------------------------
# Bot messages about assignments: new homework, 24h reminder, deadline summary
# ---------------------------------------------------------------------------
async def _send(chat_id: int, text: str, with_app_button: bool = True) -> bool:
    markup = None
    if with_app_button and WEBAPP_URL.startswith("https://"):
        markup = InlineKeyboardMarkup(
            [[InlineKeyboardButton("📝 Vazifani ochish", web_app=WebAppInfo(url=WEBAPP_URL))]]
        )
    try:
        await TG_APP.bot.send_message(chat_id=chat_id, text=text, parse_mode="HTML", reply_markup=markup)
        return True
    except Exception as e:
        logger.info("Could not message %s: %s", chat_id, e)
        return False
    finally:
        await asyncio.sleep(0.05)  # stay well below Telegram's 30 messages/second


def _tg_chat_id(student_id: str):
    return int(student_id[3:]) if re.fullmatch(r"tg_\d{1,20}", student_id) else None


_NOTIFY_LOCK = asyncio.Lock()


def _collect_due_notifications(now: int):
    """Picks the assignments that need a message and marks them, so each message goes out once."""
    with get_db() as conn:
        conn.execute("BEGIN IMMEDIATE")
        ex_map = exercises_by_id(conn)
        students = rating_students(conn)
        announce = conn.execute(
            "SELECT * FROM assignments WHERE announced = 0 AND starts_at <= ? AND deadline > ?", (now, now)
        ).fetchall()
        remind = conn.execute(
            "SELECT * FROM assignments WHERE reminded = 0 AND starts_at <= ? AND deadline > ? AND deadline - ? <= 86400",
            (now, now, now),
        ).fetchall()
        summary = conn.execute("SELECT * FROM assignments WHERE summarized = 0 AND deadline <= ?", (now,)).fetchall()
        progress = {}
        for asg in list(remind) + list(summary):
            exercises = assignment_exercises(asg, ex_map)
            by_student = answer_rows_by_student(conn, asg["id"])
            progress[asg["id"]] = {
                s["id"]: progress_for(by_student.get(s["id"], []), exercises, asg["deadline"]) for s in students
            }
        for flag, rows in (("announced", announce), ("reminded", remind), ("summarized", summary)):
            for asg in rows:
                conn.execute(f"UPDATE assignments SET {flag} = 1 WHERE id = ?", (asg["id"],))
    return students, announce, remind, summary, progress


async def run_assignment_notifications() -> None:
    if TG_APP is None:
        return
    async with _NOTIFY_LOCK:
        students, announce, remind, summary, progress = _collect_due_notifications(int(time.time()))

        for asg in announce:
            text = (
                f"📚 <b>Yangi haftalik vazifa!</b>\n\n<b>{_html_escape(asg['title'])}</b>"
                + (f" · {_html_escape(asg['week_label'])}" if asg["week_label"] else "")
                + (f"\n{_html_escape(asg['note'])}" if asg["note"] else "")
                + f"\n\n⏰ <b>Muddat:</b> {fmt_local(asg['deadline'])}\n"
                "🎯 1-urinishda topilgan javob — 25 ball, 2-urinishda — 15, 3–4-urinishda — 5."
            )
            for s in students:
                chat = _tg_chat_id(s["id"])
                if chat:
                    await _send(chat, text)

        for asg in remind:
            for s in students:
                chat = _tg_chat_id(s["id"])
                p = progress[asg["id"]][s["id"]]
                if chat and not p["done"]:
                    await _send(
                        chat,
                        f"⏳ <b>Eslatma:</b> «{_html_escape(asg['title'])}» vazifasining muddati "
                        f"<b>{fmt_local(asg['deadline'])}</b> da tugaydi.\n"
                        f"Bajarildi: {p['resolved']}/{p['total']} savol.",
                    )

        for asg in summary:
            per = progress[asg["id"]]
            on_time = [s for s in students if per[s["id"]]["done"] and not per[s["id"]]["late"]]
            missing = [s for s in students if not per[s["id"]]["done"]]
            lines = [
                f"📊 <b>Muddat tugadi:</b> {_html_escape(asg['title'])}",
                f"✅ Vaqtida bajardi: {len(on_time)}/{len(students)}",
            ]
            if missing:
                lines.append("❌ Bajarmaganlar:")
                lines += [
                    f"• {_html_escape(s['name'])} — {per[s['id']]['resolved']}/{per[s['id']]['total']}"
                    for s in missing[:40]
                ]
            for teacher_id in TEACHER_IDS:
                await _send(teacher_id, "\n".join(lines), with_app_button=False)


async def assignment_notifier_loop() -> None:
    while True:
        try:
            await run_assignment_notifications()
        except Exception:
            logger.exception("Assignment notifications failed")
        await asyncio.sleep(60)


async def handle_auth_register(request: web.Request) -> web.Response:
    data = await read_json(request)
    first_name = " ".join(clean_text(data.get("firstName"), 60).split())
    last_name = " ".join(clean_text(data.get("lastName"), 60).split())
    legacy_name = clean_text(data.get("name"), 120)
    if not first_name and legacy_name:
        parts = legacy_name.split(" ", 1)
        first_name = parts[0]
        last_name = parts[1].strip() if len(parts) > 1 else ""

    password = str(data.get("password", ""))
    role = str(data.get("role", "student")).strip().lower()
    if role not in ("student", "teacher"):
        role = "student"
    level = str(data.get("level", "A1")).strip().upper()
    if level not in LEVELS:
        level = "A1"
    class_name = clean_text(data.get("className"), 40) or level

    if not is_valid_person_name(first_name):
        raise ApiError("Iltimos, ismingizni kiriting (kamida 2 ta harf, faqat harflar).")
    if not is_valid_person_name(last_name):
        raise ApiError("Iltimos, familiyangizni kiriting (kamida 2 ta harf, faqat harflar).")
    if len(password) < 6:
        raise ApiError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.")
    if len(password) > 128:
        raise ApiError("Parol juda uzun.")

    name = f"{first_name} {last_name}"
    key = name_key(name)
    enforce_rate_limit(f"register:ip:{client_ip(request)}", 10, 3600)
    p_hash = await run_blocking(hash_password, password)
    now = now_str()
    # Teachers can read every student's data, so an admin has to approve them first.
    status = "pending" if role == "teacher" else "approved"

    with get_db() as conn:
        conn.execute("BEGIN IMMEDIATE")
        # Telegram auto-created accounts never block a name: those users sign in via Telegram.
        existing = [
            r
            for r in conn.execute("SELECT * FROM students WHERE name_key = ?", (key,)).fetchall()
            if not r["id"].startswith("tg_")
        ]
        claimable = [r for r in existing if r["id"].startswith("ros_") and not r["password_hash"]]
        if existing and not claimable:
            raise ApiError(f"'{name}' nomli hisob allaqachon mavjud. Iltimos, Kirish bo'limidan kiring.")
        if not claimable and not ALLOW_SELF_REGISTRATION:
            raise ApiError("Ro'yxatdan o'tish yopiq. O'qituvchingizga murojaat qiling yoki Telegram orqali kiring.", 403)

        if claimable:
            # A teacher added this person to the roster: attach the password to that record.
            student_id = claimable[0]["id"]
            conn.execute(
                """
                UPDATE students SET first_name = ?, last_name = ?, name = ?, level = ?, class_name = ?,
                       role = ?, status = ?, password_hash = ?, name_key = ? WHERE id = ?
                """,
                (first_name, last_name, name, level, class_name, role, status, p_hash, key, student_id),
            )
        else:
            student_id = f"stu_{int(time.time() * 1000)}_{secrets.token_hex(3)}"
            conn.execute(
                """
                INSERT INTO students (id, name, first_name, last_name, role, level, status, class_name, created_at, password_hash, name_key)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (student_id, name, first_name, last_name, role, level, status, class_name, now, p_hash, key),
            )
        token = create_session(conn, student_id)
        row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
        student = student_public(row)

    spawn(
        notify_teachers_new_registration(
            student_id, first_name, last_name, role, level, now, needs_approval=(status == "pending")
        )
    )
    message = (
        "So'rovingiz yuborildi. Administrator tasdiqlaganidan so'ng platformaga kira olasiz."
        if status == "pending"
        else "Ro'yxatdan muvaffaqiyatli o'tdingiz!"
    )
    return web.json_response({"status": "ok", "message": message, "student": student, "token": token})


_CHARACTER_IDS = {"mtime": None, "ids": frozenset()}


def load_character_ids() -> frozenset:
    """The avatar ids a student may pick (the list in static/characters.js)."""
    path = os.path.join(STATIC_DIR, "characters.js")
    try:
        mtime = os.path.getmtime(path)
    except OSError:
        return frozenset()
    if _CHARACTER_IDS["mtime"] != mtime:
        try:
            with open(path, encoding="utf-8") as f:
                ids = frozenset(re.findall(r'\{\s*id:\s*"([a-z0-9_]+)"\s*,\s*name:', f.read()))
        except OSError:
            ids = frozenset()
        _CHARACTER_IDS.update(mtime=mtime, ids=ids)
    return _CHARACTER_IDS["ids"]


def join_level(value):
    """The level a student picks on the entry screen (A1 ... C2) as the platform stores it, or None."""
    v = str(value or "").strip().upper()
    if v in ("C1", "C2"):
        v = "C1-C2"
    return v if v in LEVELS else None


async def handle_auth_join(request: web.Request) -> web.Response:
    """A student comes in with a name, an avatar and a level - no password.

    Name + avatar identify the account: the same pair on another phone (or after "Chiqish") is the same student, the same
    name with another avatar is another student. A teacher's name, and the name of an account that has a password,
    cannot be taken this way.
    """
    if not OPEN_JOIN:
        raise ApiError("Parolsiz kirish yopilgan. O'qituvchingizga murojaat qiling yoki Telegram orqali kiring.", 403)
    data = await read_json(request)
    name = " ".join(clean_text(data.get("name"), 60).split())
    character = str(data.get("character") or "")
    level = join_level(data.get("level"))
    if not is_valid_person_name(name):
        raise ApiError("Ismingizni yozing (kamida 2 ta harf, faqat harflar).")
    if character not in load_character_ids():
        raise ApiError("Avatarni tanlang.")
    if level is None:
        raise ApiError("Darajangizni tanlang.")

    key = name_key(name)
    ip = client_ip(request)
    enforce_rate_limit(f"join:ip:{ip}", 60, 300)
    enforce_rate_limit(f"join:name:{key}", 12, 300)
    now = now_str()
    created = False
    with get_db() as conn:
        conn.execute("BEGIN IMMEDIATE")
        everyone = conn.execute("SELECT * FROM students WHERE name_key = ?", (key,)).fetchall()
        if any((r["role"] or "student") in ("teacher", "admin") for r in everyone):  # Telegram accounts too: that is how teachers come in
            raise ApiError(f"'{name}' nomi band. Boshqa ism yozing.", 409)
        rows = [r for r in everyone if not r["id"].startswith("tg_")]  # a Telegram student never blocks a name
        passwordless = [r for r in rows if r["password_hash"] is None and (r["id"].startswith("kid_") or r["id"].startswith("ros_"))]
        same = [r for r in passwordless if (r["character"] or "") == character]
        unclaimed = [r for r in passwordless if r["id"].startswith("ros_") and not (r["character"] or "")]
        if same:
            row = same[0]
        elif unclaimed:  # a teacher put this name on the class list: the first student to arrive takes it
            row = unclaimed[0]
            conn.execute("UPDATE students SET character = ? WHERE id = ?", (character, row["id"]))
        elif any(r["password_hash"] is not None for r in rows):
            raise ApiError(f"'{name}' nomli hisob parol bilan himoyalangan. Parol bilan kiring yoki boshqa ism yozing.", 409)
        else:
            enforce_rate_limit(f"join:new:{ip}", 15, 3600)
            sid = f"kid_{int(time.time() * 1000)}_{secrets.token_hex(3)}"
            conn.execute(
                """
                INSERT INTO students (id, name, first_name, last_name, role, level, status, class_name, created_at, name_key, character)
                VALUES (?, ?, ?, '', 'student', ?, 'approved', ?, ?, ?, ?)
                """,
                (sid, name, name, level, level, now, key, character),
            )
            created = True
            row = conn.execute("SELECT * FROM students WHERE id = ?", (sid,)).fetchone()
        if row["status"] == "declined":
            raise ApiError("Sizning hisobingiz administrator tomonidan rad etilgan.", 403)
        if not created and (row["level"] or "") != level:
            conn.execute("UPDATE students SET level = ? WHERE id = ?", (level, row["id"]))
        token = create_session(conn, row["id"])
        row = conn.execute("SELECT * FROM students WHERE id = ?", (row["id"],)).fetchone()
        student = student_public(row)
    return web.json_response({"status": "ok", "created": created, "student": student, "token": token})


async def handle_auth_login(request: web.Request) -> web.Response:
    data = await read_json(request)
    first_name = " ".join(clean_text(data.get("firstName"), 60).split())
    last_name = " ".join(clean_text(data.get("lastName"), 60).split())
    name = " ".join(clean_text(data.get("name"), 120).split())
    if not name and first_name:
        name = f"{first_name} {last_name}".strip()
    password = str(data.get("password", ""))

    if not name:
        raise ApiError("Iltimos, ismingizni kiriting.")
    if not password:
        raise ApiError("Iltimos, parolingizni kiriting.")
    if len(password) > 128:
        raise ApiError("Ism yoki parol noto'g'ri.", 401)

    key = name_key(name)
    enforce_rate_limit(f"login:ip:{client_ip(request)}", 30, 300)
    enforce_rate_limit(f"login:name:{key}", 8, 300)

    with get_db() as conn:
        candidates = conn.execute(
            "SELECT * FROM students WHERE name_key = ? AND password_hash IS NOT NULL", (key,)
        ).fetchall()

    matched = None
    for row in candidates:
        if await run_blocking(verify_password, password, row["password_hash"]):
            matched = row
            break
    if matched is None:
        raise ApiError("Ism yoki parol noto'g'ri.", 401)
    if matched["status"] == "declined":
        raise ApiError("Sizning hisobingiz administrator tomonidan rad etilgan.", 403)

    new_hash = await run_blocking(hash_password, password) if needs_rehash(matched["password_hash"]) else None
    with get_db() as conn:
        if new_hash:
            conn.execute("UPDATE students SET password_hash = ? WHERE id = ?", (new_hash, matched["id"]))
        token = create_session(conn, matched["id"])
        row = conn.execute("SELECT * FROM students WHERE id = ?", (matched["id"],)).fetchone()
    return web.json_response({"status": "ok", "student": student_public(row), "token": token})


async def handle_auth_telegram(request: web.Request) -> web.Response:
    data = await read_json(request)
    if not bot_token_configured():
        raise ApiError("Telegram orqali kirish sozlanmagan.", 503)
    enforce_rate_limit(f"tglogin:ip:{client_ip(request)}", 60, 300)
    tg_user = verify_telegram_init_data(str(data.get("initData", "")))
    if tg_user is None:
        raise ApiError("Telegram ma'lumotlari tasdiqlanmadi. Mini App'ni Telegram ichidan qayta oching.", 401)
    with get_db() as conn:
        row = upsert_telegram_user(conn, tg_user)
        if row["status"] == "declined":
            raise ApiError("Sizning hisobingiz administrator tomonidan rad etilgan.", 403)
        token = create_session(conn, row["id"])
    spawn(refresh_telegram_avatar(int(tg_user["id"])))
    return web.json_response({"status": "ok", "student": student_public(row), "token": token})


async def handle_auth_logout(request: web.Request) -> web.Response:
    token = bearer_token(request)
    if token:
        with get_db() as conn:
            conn.execute("DELETE FROM sessions WHERE token_hash = ?", (_token_hash(token),))
    return web.json_response({"status": "ok"})


async def handle_auth_check_status(request: web.Request) -> web.Response:
    """Status/profile of the *signed-in* user (pending users may call this)."""
    with get_db() as conn:
        user = require_user(conn, request, approved=False)
        student = student_public(user)
    return web.json_response({"status": "ok", "user_status": student["status"], "student": student})


async def handle_update_user_status(request: web.Request) -> web.Response:
    with get_db() as conn:
        admin = require_user(conn, request, roles=("admin",))
        data = await read_json(request)
        user_id = clean_text(data.get("userId"), 120)
        new_status = str(data.get("status", "")).strip().lower()
        if new_status not in ("approved", "declined", "pending"):
            raise ApiError("Invalid status")
        target = conn.execute("SELECT * FROM students WHERE id = ?", (user_id,)).fetchone()
        if target is None:
            raise ApiError("Foydalanuvchi topilmadi.", 404)
        if target["id"] == admin["id"] or target["role"] == "admin":
            raise ApiError("Administrator holatini o'zgartirib bo'lmaydi.", 403)
        conn.execute("UPDATE students SET status = ? WHERE id = ?", (new_status, user_id))
        if new_status != "approved":
            conn.execute("DELETE FROM sessions WHERE student_id = ?", (user_id,))
    return web.json_response({"status": "ok", "userId": user_id, "newStatus": new_status})


async def handle_add_student(request: web.Request) -> web.Response:
    """Teacher adds a roster entry (no login yet; the student claims it by registering)."""
    with get_db() as conn:
        require_user(conn, request, roles=("admin", "teacher"))
        data = await read_json(request)
        name = " ".join(clean_text(data.get("name"), 80).split())
        class_name = clean_text(data.get("className"), 40) or "Level 1"
        if not is_valid_person_name(name):
            raise ApiError("Talaba ismi noto'g'ri (faqat harflar, kamida 2 ta belgi).")
        parts = name.split(" ", 1)
        key = name_key(name)
        if any(
            not r["id"].startswith("tg_")
            for r in conn.execute("SELECT id FROM students WHERE name_key = ?", (key,)).fetchall()
        ):
            raise ApiError(f"'{name}' nomli talaba allaqachon mavjud.")
        student_id = f"ros_{int(time.time() * 1000)}_{secrets.token_hex(3)}"
        conn.execute(
            """
            INSERT INTO students (id, name, first_name, last_name, role, level, status, class_name, created_at, name_key)
            VALUES (?, ?, ?, ?, 'student', 'A1', 'approved', ?, ?, ?)
            """,
            (student_id, name, parts[0], parts[1] if len(parts) > 1 else "", class_name, now_str(), key),
        )
        row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    return web.json_response({"status": "ok", "student": student_public(row)})


async def handle_delete_student(request: web.Request) -> web.Response:
    with get_db() as conn:
        admin = require_user(conn, request, roles=("admin",))
        data = await read_json(request)
        user_id = clean_text(data.get("id"), 120)
        target = conn.execute("SELECT * FROM students WHERE id = ?", (user_id,)).fetchone()
        if target is None:
            raise ApiError("Foydalanuvchi topilmadi.", 404)
        if target["id"] == admin["id"] or target["role"] == "admin":
            raise ApiError("Administratorni o'chirib bo'lmaydi.", 403)
        conn.execute("DELETE FROM attempts WHERE student_id = ?", (user_id,))
        conn.execute("DELETE FROM answer_log WHERE student_id = ?", (user_id,))
        conn.execute("DELETE FROM points_log WHERE student_id = ?", (user_id,))
        conn.execute("DELETE FROM sessions WHERE student_id = ?", (user_id,))
        conn.execute("DELETE FROM students WHERE id = ?", (user_id,))
    return web.json_response({"status": "ok", "id": user_id})


GZIP_TYPES = {".js", ".css", ".html", ".json", ".svg", ".webmanifest"}
_GZIP_CACHE: dict = {}  # path -> (mtime_ns, size, gzipped bytes)


def _gzipped(path: str, st: os.stat_result) -> bytes:
    hit = _GZIP_CACHE.get(path)
    if hit and hit[0] == st.st_mtime_ns and hit[1] == st.st_size:
        return hit[2]
    with open(path, "rb") as f:
        data = gzip.compress(f.read(), 6, mtime=0)
    _GZIP_CACHE[path] = (st.st_mtime_ns, st.st_size, data)
    return data


async def handle_static(request: web.Request) -> web.StreamResponse:
    """Serves /static/ files; text files go out gzipped (kept in memory) and every file has an ETag, so a repeat visit is a 304."""
    rel = request.match_info["tail"]
    path = os.path.realpath(os.path.join(STATIC_DIR, rel))
    if os.path.commonpath([path, os.path.realpath(STATIC_DIR)]) != os.path.realpath(STATIC_DIR) or not os.path.isfile(path):
        raise web.HTTPNotFound()
    st = os.stat(path)
    ext = os.path.splitext(path)[1].lower()
    etag = f'"{st.st_mtime_ns:x}-{st.st_size:x}"'
    if request.headers.get("If-None-Match") == etag:
        return web.Response(status=304, headers={"ETag": etag})
    if ext in GZIP_TYPES and st.st_size > 1024 and "gzip" in request.headers.get("Accept-Encoding", ""):
        ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
        if ext == ".webmanifest":
            ctype = "application/manifest+json"
        body = await run_blocking(_gzipped, path, st)
        resp = web.Response(body=body, content_type=ctype.split(";")[0], charset="utf-8" if ctype.startswith(("text/", "application/javascript", "application/json")) else None)
        resp.headers["Content-Encoding"] = "gzip"
        resp.headers["Vary"] = "Accept-Encoding"
        resp.headers["ETag"] = etag
        return resp
    resp = web.FileResponse(path)
    resp.headers["ETag"] = etag
    return resp


async def handle_service_worker(request: web.Request) -> web.StreamResponse:
    return web.FileResponse(
        os.path.join(STATIC_DIR, "sw.js"),
        headers={"Content-Type": "application/javascript", "Cache-Control": "no-cache", "Service-Worker-Allowed": "/"},
    )


BACKUP_KEEP = 14
BACKUP_EVERY_SECONDS = 6 * 3600


def backup_dir() -> str:
    return os.getenv("BACKUP_DIR") or os.path.join(os.path.dirname(os.path.abspath(DB_PATH)), "backups")


def make_backup() -> str:
    """Copies the live database with SQLite's online backup API (safe while the server is writing) and keeps the newest copies."""
    os.makedirs(backup_dir(), exist_ok=True)
    dest = os.path.join(backup_dir(), time.strftime("level_one_%Y%m%d_%H%M%S.db"))
    src = sqlite3.connect(DB_PATH, timeout=30)
    try:
        dst = sqlite3.connect(dest)
        try:
            src.backup(dst)
        finally:
            dst.close()
    finally:
        src.close()
    old = sorted(f for f in os.listdir(backup_dir()) if f.startswith("level_one_") and f.endswith(".db"))
    for name in old[:-BACKUP_KEEP]:
        try:
            os.remove(os.path.join(backup_dir(), name))
        except OSError:
            pass
    return dest


async def backup_loop() -> None:
    while True:
        try:
            await run_blocking(make_backup)
        except Exception:
            logger.exception("Database backup failed")
        await asyncio.sleep(BACKUP_EVERY_SECONDS)


STATIC_EXTENSIONS = {".js", ".css", ".html", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".mp3", ".mp4", ".woff", ".woff2", ".json", ".webmanifest"}


# Telegram shows the Mini App inside its own pages, so those may frame it. The page's own inline scripts stay allowed,
# but nothing may be loaded from or sent to a host that is not listed here.
CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://telegram.org",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss: ws:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org https://telegram.org",
])


@web.middleware
async def error_middleware(request: web.Request, handler):
    # Only real site files are served from /static/, never editor backups such as index.html.bak_old.
    if request.path.startswith("/static/") and os.path.splitext(request.path)[1].lower() not in STATIC_EXTENSIONS:
        return web.json_response({"status": "error", "message": "Not Found"}, status=404)
    try:
        response = await handler(request)
    except ApiError as e:
        return web.json_response({"status": "error", "message": e.message}, status=e.status)
    except web.HTTPException as e:
        if request.path.startswith("/api/"):
            return web.json_response({"status": "error", "message": e.reason}, status=e.status)
        raise
    except Exception:
        logger.exception("Unhandled error on %s %s", request.method, request.path)
        return web.json_response(
            {"status": "error", "message": "Serverda xatolik yuz berdi."}, status=500
        )
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "same-origin")
    if not request.path.startswith("/api/"):
        response.headers.setdefault("Content-Security-Policy", CSP)
        response.headers.setdefault("Permissions-Policy", "camera=(), geolocation=(), payment=()")
    if request.headers.get("X-Forwarded-Proto") == "https" or request.secure:
        response.headers.setdefault("Strict-Transport-Security", "max-age=15552000")
    if request.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    elif request.path.startswith("/static/") and request.path.endswith((".js", ".css", ".html")):
        # Telegram's webview caches hard; make it revalidate code on every start (a cheap 304).
        response.headers["Cache-Control"] = "no-cache"
    elif request.path.startswith("/static/"):
        response.headers.setdefault("Cache-Control", "public, max-age=86400")
    return response


def build_web_app() -> web.Application:
    web_app = web.Application(client_max_size=MAX_BODY_BYTES, middlewares=[error_middleware])
    web_app.router.add_get("/", handle_index)
    web_app.router.add_get("/healthz", handle_healthz)
    web_app.router.add_get("/static/{tail:.*}", handle_static)
    web_app.router.add_get("/sw.js", handle_service_worker)
    web_app.router.add_get("/api/state", handle_get_state)
    web_app.router.add_post("/api/submit", handle_post_submit)
    web_app.router.add_post("/api/exercises", handle_post_exercise)
    web_app.router.add_post("/api/auth/register", handle_auth_register)
    web_app.router.add_post("/api/auth/login", handle_auth_login)
    web_app.router.add_post("/api/auth/telegram", handle_auth_telegram)
    web_app.router.add_post("/api/auth/logout", handle_auth_logout)
    web_app.router.add_get("/api/auth/check_status", handle_auth_check_status)
    web_app.router.add_post("/api/user_status", handle_update_user_status)
    web_app.router.add_post("/api/students", handle_add_student)
    web_app.router.add_post("/api/students/delete", handle_delete_student)
    web_app.router.add_get("/api/assignments", handle_list_assignments)
    web_app.router.add_get("/api/assignments/{assignment_id}", handle_get_assignment)
    web_app.router.add_post("/api/assignments", handle_create_assignment)
    web_app.router.add_post("/api/assignments/answer", handle_assignment_answer)
    web_app.router.add_post("/api/assignments/update", handle_update_assignment)
    web_app.router.add_post("/api/assignments/delete", handle_delete_assignment)
    web_app.router.add_get("/api/leaderboard", handle_leaderboard)
    web_app.router.add_get("/api/progress/history", handle_progress_history)
    web_app.router.add_get("/api/progress/calendar", handle_progress_calendar)
    web_app.router.add_get("/api/progress/level", handle_progress_level)
    web_app.router.add_post("/api/progress/events", handle_progress_events)
    web_app.router.add_post("/api/game/finish", handle_game_finish)
    web_app.router.add_post("/api/listen/finish", handle_listen_finish)
    web_app.router.add_get("/api/listen/progress", handle_listen_progress)
    web_app.router.add_post("/api/race/create", handle_race_create)
    web_app.router.add_get("/api/race/mates", handle_race_mates)
    web_app.router.add_post("/api/race/invite", handle_race_invite)
    web_app.router.add_get("/ws/race", handle_race_ws)
    web_app.router.add_post("/api/words/report", handle_words_report)
    web_app.router.add_get("/api/words", handle_words_get)
    web_app.router.add_post("/api/focus/start", handle_focus_start)
    web_app.router.add_post("/api/focus/pause", handle_focus_pause)
    web_app.router.add_post("/api/focus/resume", handle_focus_resume)
    web_app.router.add_post("/api/focus/finish", handle_focus_finish)
    web_app.router.add_post("/api/focus/cancel", handle_focus_cancel)
    web_app.router.add_get("/api/focus/state", handle_focus_state)
    web_app.router.add_get("/api/green", handle_green_city)
    web_app.router.add_post("/api/green/check", handle_green_check)
    web_app.router.add_post("/api/green/plant", handle_green_plant)
    web_app.router.add_post("/api/green/restore", handle_green_restore)
    web_app.router.add_post("/api/green/zones", handle_green_zone_add)
    web_app.router.add_post("/api/green/zones/delete", handle_green_zone_delete)
    web_app.router.add_post("/api/auth/join", handle_auth_join)
    web_app.router.add_post("/api/character", handle_set_character)
    web_app.router.add_get("/avatars/{student_id}.jpg", handle_avatar)
    return web_app


# ---------------------------------------------------------------------------
# Telegram Bot Handlers
# ---------------------------------------------------------------------------
async def start_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    full_name = " ".join(filter(None, [user.first_name, user.last_name])) or "Foydalanuvchi"
    is_admin = user.id in TEACHER_IDS

    with get_db() as conn:
        upsert_telegram_user(
            conn, {"id": user.id, "first_name": user.first_name, "last_name": user.last_name}
        )
    spawn(refresh_telegram_avatar(user.id))

    buttons = [
        [
            InlineKeyboardButton(
                "🚀 Open Level Up Platform",
                web_app=WebAppInfo(url=WEBAPP_URL),
            )
        ]
    ]
    if is_admin:
        buttons.append(
            [InlineKeyboardButton("👩‍🏫 Admin Panel & Hisobotlar", callback_data="t_menu")]
        )

    await update.message.reply_text(
        f"Assalomu alaykum, <b>{_html_escape(full_name)}</b>!\n\n"
        "Platformaga kirish uchun quyidagi tugmani bosing:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(buttons),
    )


async def teacher_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.effective_user.id not in TEACHER_IDS:
        await update.message.reply_text("⛔ Faqat administratorlar uchun.")
        return

    await update.message.reply_text(
        "👩‍🏫 *Level Up — Teacher & Admin Panel*\n"
        "Talabalar natijalari, xatolar va yangi so'rovlarni boshqarishingiz mumkin:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(
            [
                [
                    InlineKeyboardButton(
                        "🚀 Open Level Up (Admin View)",
                        web_app=WebAppInfo(url=WEBAPP_URL),
                    )
                ],
                [
                    InlineKeyboardButton(
                        "📥 Export Student Mistakes CSV", callback_data="t_csv"
                    )
                ],
                [
                    InlineKeyboardButton(
                        "📢 Post Mini App Button to Channel", callback_data="t_channel"
                    )
                ],
            ]
        ),
    )


async def approval_callbacks(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    if query.from_user.id not in TEACHER_IDS:
        await query.answer("⛔ Sizda ushbu amalni bajarish huquqi yo'q.", show_alert=True)
        return
    await query.answer()

    data = query.data
    approve = data.startswith("appr_")
    user_id = data[5:]
    with get_db() as conn:
        user = conn.execute("SELECT * FROM students WHERE id = ?", (user_id,)).fetchone()
        if not user:
            await query.edit_message_text("⚠️ Foydalanuvchi topilmadi.")
            return
        if user["role"] == "admin":
            await query.edit_message_text("⚠️ Administrator holatini o'zgartirib bo'lmaydi.")
            return
        conn.execute(
            "UPDATE students SET status = ? WHERE id = ?", ("approved" if approve else "declined", user_id)
        )
        if not approve:
            conn.execute("DELETE FROM sessions WHERE student_id = ?", (user_id,))

    full_name = f"{user['first_name'] or ''} {user['last_name'] or ''}".strip() or user["name"]
    level = user["level"] or "A1"
    if approve:
        text = (
            f"✅ <b>TASDIQLANDI (Approved)!</b>\n\n"
            f"👤 <b>Foydalanuvchi:</b> {_html_escape(full_name)}\n"
            f"📊 <b>Tanlagan darajasi:</b> <code>{_html_escape(level)}</code>\n\n"
            f"✨ Endi <b>Level Up</b> platformasiga erkin kirishi mumkin!"
        )
    else:
        text = (
            f"❌ <b>RAD ETILDI (Declined)!</b>\n\n"
            f"👤 <b>Foydalanuvchi:</b> {_html_escape(full_name)}\n"
            f"📊 <b>Tanlagan darajasi:</b> <code>{_html_escape(level)}</code>\n\n"
            f"Platformaga kirish so'rovi rad etildi."
        )
    await query.edit_message_text(text, parse_mode="HTML")


async def teacher_callbacks(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    if query.from_user.id not in TEACHER_IDS:
        return

    if query.data == "t_menu":
        await query.message.reply_text("Admin panel uchun /teacher buyrug'ini yuboring.")

    elif query.data == "t_csv":
        with get_db() as conn:
            att_rows = conn.execute("SELECT * FROM attempts ORDER BY timestamp DESC").fetchall()
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["Student Name", "Category", "Exercise", "Score", "Total", "Timestamp", "Question", "Wrong Answer", "Correct Answer"]
        )
        for r in att_rows:
            mistakes = json.loads(r["mistakes_json"] or "[]")
            base = [
                csv_safe(r["student_name"]),
                csv_safe(r["category"]),
                csv_safe(r["exercise_title"]),
                r["score"],
                r["total"],
                r["timestamp"],
            ]
            if not mistakes:
                writer.writerow(base + ["(Perfect)", "", ""])
            else:
                for m in mistakes:
                    writer.writerow(
                        base
                        + [
                            csv_safe(m.get("q", "")),
                            csv_safe(m.get("studentAnswer", "")),
                            csv_safe(m.get("correctAnswer", "")),
                        ]
                    )
        csv_bytes = io.BytesIO(output.getvalue().encode("utf-8-sig"))
        csv_bytes.name = "level_up_report.csv"
        await query.message.reply_document(document=csv_bytes, caption="📥 Full student completion & mistakes report.")

    elif query.data == "t_channel":
        bot_me = await context.bot.get_me()
        deep_link = f"https://t.me/{bot_me.username}?start=levelup"
        try:
            await context.bot.send_message(
                chat_id=CHANNEL_ID,
                text=(
                    "📚 *Level Up — Vocabulary & Grammar Platform*\n\n"
                    "✨ *Xush kelibsiz! Yengni shimaring, jigar. Bir mazza qilib vazifa qilaylik.*\n\n"
                    "O'quvchilar va o'qituvchilar uchun maxsus platforma. Telegram Mini App orqali mashqlarni bajaring!"
                ),
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(
                    [[InlineKeyboardButton("🚀 Open Level Up", url=deep_link)]]
                ),
            )
            await query.message.reply_text(f"✅ Posted Mini App link to `{CHANNEL_ID}`!", parse_mode="Markdown")
        except Exception as e:
            await query.message.reply_text(
                f"⚠️ Could not post automatically ({e}). Share this link in your channel:\n{deep_link}"
            )


async def watch_webapp_url(tg_app) -> None:
    """Quick tunnels get a new URL on every restart; the tunnel daemon rewrites `.env`.
    Pick the change up without restarting the server and refresh the bot's menu button."""
    global WEBAPP_URL
    last_seen = _read_env_file_value("WEBAPP_URL")
    while True:
        await asyncio.sleep(30)
        try:
            current = _read_env_file_value("WEBAPP_URL")
            if current and current != last_seen and current.startswith("https://"):
                last_seen = current
                WEBAPP_URL = current
                await tg_app.bot.set_chat_menu_button(
                    menu_button=MenuButtonWebApp(text="Level Up", web_app=WebAppInfo(url=WEBAPP_URL))
                )
                logger.info("WEBAPP_URL changed -> %s (menu button updated)", WEBAPP_URL)
        except Exception as e:
            logger.warning("Could not refresh WEBAPP_URL: %s", e)


async def run_all() -> None:
    global TG_APP
    init_db()
    spawn(backup_loop())

    # 1. Start aiohttp Web Server for the Mini App
    runner = web.AppRunner(build_web_app())
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    try:
        await site.start()
    except OSError as e:
        logger.error(
            "Port %s is already in use (%s). Another copy of the server is probably running — "
            "close it first, or set a different PORT.",
            PORT,
            e,
        )
        sys.exit(1)
    logger.info(f"Level Up Web Server listening on port {PORT}")

    if not TEACHER_IDS:
        logger.warning("TEACHER_IDS is empty: nobody will have admin rights.")

    # 2. Start Telegram Bot if BOT_TOKEN is configured
    if bot_token_configured():
        tg_app = Application.builder().token(BOT_TOKEN).build()
        tg_app.add_handler(CommandHandler("start", start_cmd))
        tg_app.add_handler(CommandHandler("teacher", teacher_cmd))
        tg_app.add_handler(CallbackQueryHandler(approval_callbacks, pattern=r"^(appr_|decl_)"))
        tg_app.add_handler(CallbackQueryHandler(teacher_callbacks, pattern=r"^t_"))

        await tg_app.initialize()
        await tg_app.start()
        TG_APP = tg_app
        try:
            await tg_app.bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(
                    text="Level Up", web_app=WebAppInfo(url=WEBAPP_URL)
                )
            )
        except Exception as e:
            logger.warning(f"Could not set WebApp menu button yet: {e}")

        await tg_app.updater.start_polling()
        logger.info("Telegram Bot polling started.")
        spawn(watch_webapp_url(tg_app))
        spawn(assignment_notifier_loop())
        await asyncio.Event().wait()
    else:
        logger.warning("BOT_TOKEN not set yet; running Web Server in standalone mode.")
        await asyncio.Event().wait()


if __name__ == "__main__":
    try:
        asyncio.run(run_all())
    except KeyboardInterrupt:
        pass
