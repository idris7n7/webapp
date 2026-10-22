"""
Run with:  python -m unittest discover -s tests -v   (from the "Level One app" folder)
"""
import hashlib
import hmac
import json
import os
import sys
import tempfile
import time
import unittest
from urllib.parse import urlencode

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from aiohttp.test_utils import TestClient, TestServer  # noqa: E402

import server  # noqa: E402

TEST_BOT_TOKEN = "123456:TEST_TOKEN_FOR_UNIT_TESTS"
ADMIN_TG_ID = 111


def sign_init_data(user: dict, token: str = TEST_BOT_TOKEN, auth_date=None, tamper=False) -> str:
    fields = {
        "auth_date": str(int(time.time()) if auth_date is None else auth_date),
        "query_id": "AAHtest",
        "user": json.dumps(user, separators=(",", ":")),
    }
    check = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
    if tamper:
        fields["user"] = fields["user"].replace(str(user["id"]), "999")
    return urlencode(fields)


class ServerTestCase(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self._tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        self._saved = (server.DB_PATH, server.BOT_TOKEN, server.TEACHER_IDS, server.ALLOW_SELF_REGISTRATION)
        server.ALLOW_SELF_REGISTRATION = True
        self._saved_gap, server.GAME_MIN_SECONDS = server.GAME_MIN_SECONDS, 0
        server.DB_PATH = os.path.join(self._tmp.name, "test.db")
        server.BOT_TOKEN = TEST_BOT_TOKEN
        server.TEACHER_IDS = {ADMIN_TG_ID}
        server.RATE_LIMITER.reset()
        server.init_db()
        self.client = TestClient(TestServer(server.build_web_app()))
        await self.client.start_server()

    async def asyncTearDown(self):
        await self.client.close()
        server.DB_PATH, server.BOT_TOKEN, server.TEACHER_IDS, server.ALLOW_SELF_REGISTRATION = self._saved
        server.GAME_MIN_SECONDS = self._saved_gap
        self._tmp.cleanup()

    # -- helpers ---------------------------------------------------------
    async def call(self, method, path, token=None, body=None):
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        resp = await self.client.request(method, path, json=body, headers=headers)
        try:
            data = await resp.json()
        except Exception:
            data = None
        return resp.status, data

    async def register(self, first, last, password="secret1", **extra):
        body = {"firstName": first, "lastName": last, "password": password, **extra}
        return await self.call("POST", "/api/auth/register", body=body)

    async def student_token(self, first="Ali", last="Valiyev"):
        status, data = await self.register(first, last)
        self.assertEqual(status, 200, data)
        return data["token"], data["student"]

    async def admin_token(self):
        init = sign_init_data({"id": ADMIN_TG_ID, "first_name": "Boss", "last_name": "Admin"})
        status, data = await self.call("POST", "/api/auth/telegram", body={"initData": init})
        self.assertEqual(status, 200, data)
        self.assertEqual(data["student"]["role"], "admin")
        return data["token"]

    def attempt(self, **over):
        base = {"attemptId": "att_1", "exerciseId": "ex1", "exerciseTitle": "T", "category": "grammar", "score": 3, "total": 5,
                "mistakes": [{"q": "Q", "studentAnswer": "a", "correctAnswer": "b"}]}
        base.update(over)
        return base

    # -- authentication required everywhere ------------------------------
    async def test_endpoints_require_login(self):
        for method, path in [
            ("GET", "/api/state"),
            ("POST", "/api/submit"),
            ("POST", "/api/exercises"),
            ("POST", "/api/user_status"),
            ("POST", "/api/students"),
            ("POST", "/api/students/delete"),
            ("GET", "/api/auth/check_status"),
        ]:
            status, _ = await self.call(method, path, body={} if method == "POST" else None)
            self.assertEqual(status, 401, f"{method} {path}")

    async def test_garbage_token_rejected(self):
        status, _ = await self.call("GET", "/api/state", token="not-a-real-token")
        self.assertEqual(status, 401)

    # -- registration / login --------------------------------------------
    async def test_register_returns_token_and_student_role(self):
        token, student = await self.student_token()
        self.assertEqual(student["role"], "student")
        self.assertEqual(student["status"], "approved")
        self.assertTrue(token)

    async def test_cannot_self_register_as_admin_and_teacher_needs_approval(self):
        status, data = await self.register("Eva", "Teacher", role="teacher")
        self.assertEqual(status, 200)
        self.assertEqual(data["student"]["role"], "teacher")
        self.assertEqual(data["student"]["status"], "pending")
        status, data2 = await self.register("Mal", "Admini", role="admin")
        self.assertEqual(data2["student"]["role"], "student")

    async def test_pending_teacher_blocked_until_admin_approves(self):
        _, data = await self.register("Eva", "Teacher", role="teacher")
        token, teacher_id = data["token"], data["student"]["id"]
        status, _ = await self.call("GET", "/api/state", token=token)
        self.assertEqual(status, 403)
        status, me = await self.call("GET", "/api/auth/check_status", token=token)
        self.assertEqual((status, me["user_status"]), (200, "pending"))

        admin = await self.admin_token()
        status, _ = await self.call("POST", "/api/user_status", admin, {"userId": teacher_id, "status": "approved"})
        self.assertEqual(status, 200)
        status, state = await self.call("GET", "/api/state", token=token)
        self.assertEqual(status, 200)
        self.assertGreaterEqual(len(state["students"]), 2)

    async def test_markup_in_names_is_rejected(self):
        status, data = await self.register("<img src=x onerror=alert(1)>", "Valiyev")
        self.assertEqual(status, 400, data)
        status, data = await self.register("Ali", "<script>x</script>")
        self.assertEqual(status, 400, data)

    async def test_uzbek_names_accepted(self):
        status, data = await self.register("Oʻktam", "G‘ofurov")
        self.assertEqual(status, 200, data)

    async def test_short_password_rejected(self):
        status, _ = await self.register("Ali", "Valiyev", password="123")
        self.assertEqual(status, 400)

    async def test_duplicate_name_rejected_case_insensitive(self):
        await self.student_token("Ali", "Valiyev")
        status, _ = await self.register("ALI", "valiyev")
        self.assertEqual(status, 400)

    async def test_login_ok_wrong_password_and_unknown(self):
        await self.student_token("Ali", "Valiyev")
        ok, data = await self.call("POST", "/api/auth/login", body={"name": "ali valiyev", "password": "secret1"})
        self.assertEqual(ok, 200)
        self.assertTrue(data["token"])
        bad, _ = await self.call("POST", "/api/auth/login", body={"name": "Ali Valiyev", "password": "wrong"})
        self.assertEqual(bad, 401)
        unknown, _ = await self.call("POST", "/api/auth/login", body={"name": "Nobody Here", "password": "secret1"})
        self.assertEqual(unknown, 401)

    async def test_nobody_is_seeded_with_an_old_hardcoded_password(self):
        with server.get_db() as conn:
            rows = conn.execute("SELECT password_hash FROM students WHERE password_hash IS NOT NULL").fetchall()
        self.assertFalse({r[0] for r in rows} & set(server._LEAKED_PASSWORD_HASHES))

    async def test_login_by_first_name_only_no_longer_matches(self):
        await self.student_token("Ali", "Valiyev")
        status, _ = await self.call("POST", "/api/auth/login", body={"name": "Ali", "password": "secret1"})
        self.assertEqual(status, 401)

    async def test_account_without_password_cannot_be_claimed_by_login(self):
        with server.get_db() as conn:
            conn.execute(
                "INSERT INTO students (id,name,first_name,last_name,role,level,status,class_name,created_at,name_key) "
                "VALUES ('stu_legacy','Old Student','Old','Student','student','A1','approved','Level 1','x','old student')"
            )
        status, _ = await self.call("POST", "/api/auth/login", body={"name": "Old Student", "password": "anything"})
        self.assertEqual(status, 401)

    async def test_login_rate_limited(self):
        await self.student_token("Ali", "Valiyev")
        statuses = []
        for _ in range(10):
            s, _ = await self.call("POST", "/api/auth/login", body={"name": "Ali Valiyev", "password": "nope"})
            statuses.append(s)
        self.assertIn(429, statuses)
        # even the right password is refused while locked out
        s, _ = await self.call("POST", "/api/auth/login", body={"name": "Ali Valiyev", "password": "secret1"})
        self.assertEqual(s, 429)

    async def test_legacy_sha256_hash_is_upgraded_on_login(self):
        with server.get_db() as conn:
            conn.execute(
                "INSERT INTO students (id,name,first_name,last_name,role,level,status,class_name,created_at,password_hash,name_key) "
                "VALUES ('stu_old','Vali Aliyev','Vali','Aliyev','student','A1','approved','Level 1','x',?,'vali aliyev')",
                (server._legacy_hash("mypassword"),),
            )
        status, _ = await self.call("POST", "/api/auth/login", body={"name": "Vali Aliyev", "password": "mypassword"})
        self.assertEqual(status, 200)
        with server.get_db() as conn:
            stored = conn.execute("SELECT password_hash FROM students WHERE id='stu_old'").fetchone()[0]
        self.assertTrue(stored.startswith("pbkdf2_sha256$"))

    async def test_init_db_locks_accounts_using_leaked_passwords(self):
        with server.get_db() as conn:
            conn.execute(
                "INSERT INTO students (id,name,first_name,last_name,role,level,status,class_name,created_at,password_hash,name_key) "
                "VALUES ('admin_old','Administrator','Admin','','admin','C1-C2','approved','Admin','x',?,'administrator')",
                (server._LEAKED_PASSWORD_HASHES[0],),
            )
        server.init_db()
        with server.get_db() as conn:
            stored = conn.execute("SELECT password_hash FROM students WHERE id='admin_old'").fetchone()[0]
        self.assertIsNone(stored)

    # -- Telegram --------------------------------------------------------
    async def test_telegram_valid_signature_logs_in_and_admin_role_from_server(self):
        init = sign_init_data({"id": 222, "first_name": "Zed", "last_name": "User"})
        status, data = await self.call("POST", "/api/auth/telegram", body={"initData": init})
        self.assertEqual(status, 200, data)
        self.assertEqual(data["student"]["id"], "tg_222")
        self.assertEqual(data["student"]["role"], "student")
        await self.admin_token()  # id 111 is in TEACHER_IDS -> admin

    async def test_telegram_forged_expired_or_wrong_bot_rejected(self):
        user = {"id": ADMIN_TG_ID, "first_name": "Evil"}
        for init in (
            sign_init_data(user, tamper=True),
            sign_init_data(user, auth_date=int(time.time()) - 3 * 24 * 3600),
            sign_init_data(user, token="999:OTHER_BOT"),
            "hash=deadbeef&user=%7B%22id%22%3A111%7D&auth_date=1",
            "",
        ):
            status, _ = await self.call("POST", "/api/auth/telegram", body={"initData": init})
            self.assertEqual(status, 401, init[:40])

    async def test_telegram_names_are_sanitised(self):
        init = sign_init_data({"id": 333, "first_name": "<img src=x onerror=alert(1)>", "last_name": "A&B"})
        status, data = await self.call("POST", "/api/auth/telegram", body={"initData": init})
        self.assertEqual(status, 200)
        for ch in "<>&\"":
            self.assertNotIn(ch, data["student"]["name"])

    async def test_telegram_emoji_names_preserved(self):
        init = sign_init_data({"id": 444, "first_name": "🎧"})
        status, data = await self.call("POST", "/api/auth/telegram", body={"initData": init})
        self.assertEqual((status, data["student"]["name"]), (200, "🎧"))

    # -- authorization on data -------------------------------------------
    async def test_student_sees_only_own_data(self):
        t1, s1 = await self.student_token("Ali", "Valiyev")
        t2, s2 = await self.student_token("Vali", "Aliyev")
        await self.call("POST", "/api/submit", t1, self.attempt())
        await self.call("POST", "/api/submit", t2, self.attempt(attemptId="att_9", score=5))

        status, state = await self.call("GET", "/api/state", t1)
        self.assertEqual(status, 200)
        self.assertEqual([s["id"] for s in state["students"]], [s1["id"]])
        self.assertEqual({a["studentId"] for a in state["attempts"]}, {s1["id"]})
        self.assertTrue(state["exercises"])

    async def test_staff_sees_everything(self):
        t1, _ = await self.student_token("Ali", "Valiyev")
        await self.call("POST", "/api/submit", t1, self.attempt())
        admin = await self.admin_token()
        status, state = await self.call("GET", "/api/state", admin)
        self.assertEqual(status, 200)
        self.assertEqual(len(state["attempts"]), 1)
        self.assertGreaterEqual(len(state["students"]), 2)

    async def test_submit_uses_session_identity_not_payload(self):
        t1, s1 = await self.student_token("Ali", "Valiyev")
        _, s2 = await self.student_token("Vali", "Aliyev")
        status, _ = await self.call("POST", "/api/submit", t1, self.attempt(studentId=s2["id"], studentName="Hacker"))
        self.assertEqual(status, 200)
        admin = await self.admin_token()
        _, state = await self.call("GET", "/api/state", admin)
        att = state["attempts"][0]
        self.assertEqual((att["studentId"], att["studentName"]), (s1["id"], s1["name"]))

    async def test_attempt_ids_do_not_collide_between_students(self):
        t1, _ = await self.student_token("Ali", "Valiyev")
        t2, _ = await self.student_token("Vali", "Aliyev")
        await self.call("POST", "/api/submit", t1, self.attempt(attemptId="same", score=1))
        await self.call("POST", "/api/submit", t2, self.attempt(attemptId="same", score=5))
        admin = await self.admin_token()
        _, state = await self.call("GET", "/api/state", admin)
        self.assertEqual(sorted(a["score"] for a in state["attempts"]), [1, 5])

    async def test_submit_is_idempotent_for_same_student(self):
        t1, _ = await self.student_token("Ali", "Valiyev")
        for _ in range(3):
            await self.call("POST", "/api/submit", t1, self.attempt())
        _, state = await self.call("GET", "/api/state", t1)
        self.assertEqual(len(state["attempts"]), 1)

    async def test_submit_validates_scores(self):
        t1, _ = await self.student_token()
        for bad in (dict(score=9, total=5), dict(score=-1), dict(total=0, score=0), dict(score="x"), dict(exerciseId="")):
            status, _ = await self.call("POST", "/api/submit", t1, self.attempt(**bad))
            self.assertEqual(status, 400, bad)

    async def test_mistakes_are_length_limited(self):
        t1, _ = await self.student_token()
        big = [{"q": "q" * 5000, "studentAnswer": "a" * 5000, "correctAnswer": "c"}] * 3
        await self.call("POST", "/api/submit", t1, self.attempt(mistakes=big))
        _, state = await self.call("GET", "/api/state", t1)
        self.assertLessEqual(len(state["attempts"][0]["mistakes"][0]["q"]), 500)

    async def test_student_cannot_publish_exercises_or_change_status(self):
        t1, s1 = await self.student_token()
        ex = {"category": "grammar", "title": "Hack", "questions": [{"q": "1+1", "a": "2"}]}
        status, _ = await self.call("POST", "/api/exercises", t1, ex)
        self.assertEqual(status, 403)
        status, _ = await self.call("POST", "/api/user_status", t1, {"userId": s1["id"], "status": "approved"})
        self.assertEqual(status, 403)
        status, _ = await self.call("POST", "/api/students", t1, {"name": "Some Body"})
        self.assertEqual(status, 403)
        status, _ = await self.call("POST", "/api/students/delete", t1, {"id": s1["id"]})
        self.assertEqual(status, 403)

    async def test_staff_can_publish_validated_exercise(self):
        admin = await self.admin_token()
        ex = {"id": "grammar_custom_1", "category": "grammar", "title": "New", "questions": [
            {"q": "Q1", "a": "A1", "options": ["A1", "B"], "img": "javascript:alert(1)"}]}
        status, data = await self.call("POST", "/api/exercises", admin, ex)
        self.assertEqual(status, 200, data)
        _, state = await self.call("GET", "/api/state", admin)
        stored = [e for e in state["exercises"] if e["id"] == data["id"]][0]
        self.assertNotIn("img", stored["questions"][0])  # unsafe image reference dropped

    async def test_exercise_cannot_overwrite_builtin_id(self):
        admin = await self.admin_token()
        _, state = await self.call("GET", "/api/state", admin)
        builtin_id = state["exercises"][0]["id"]
        ex = {"id": builtin_id, "category": "grammar", "title": "X", "questions": [{"q": "Q", "a": "A"}]}
        status, data = await self.call("POST", "/api/exercises", admin, ex)
        self.assertEqual(status, 200)
        self.assertNotEqual(data["id"], builtin_id)

    async def test_exercise_validation(self):
        admin = await self.admin_token()
        for bad in (
            {"category": "math", "title": "T", "questions": [{"q": "q", "a": "a"}]},
            {"category": "grammar", "title": "", "questions": [{"q": "q", "a": "a"}]},
            {"category": "grammar", "title": "T", "questions": []},
            {"category": "grammar", "title": "T", "questions": [{"q": "", "a": "a"}]},
        ):
            status, _ = await self.call("POST", "/api/exercises", admin, bad)
            self.assertEqual(status, 400, bad)

    async def test_admin_cannot_modify_or_delete_admins(self):
        admin = await self.admin_token()
        status, _ = await self.call("POST", "/api/user_status", admin, {"userId": f"tg_{ADMIN_TG_ID}", "status": "declined"})
        self.assertEqual(status, 403)
        status, _ = await self.call("POST", "/api/students/delete", admin, {"id": f"tg_{ADMIN_TG_ID}"})
        self.assertEqual(status, 403)

    async def test_declined_user_loses_access(self):
        t1, s1 = await self.student_token()
        admin = await self.admin_token()
        await self.call("POST", "/api/user_status", admin, {"userId": s1["id"], "status": "declined"})
        status, _ = await self.call("GET", "/api/state", t1)
        self.assertEqual(status, 401)  # sessions revoked
        status, _ = await self.call("POST", "/api/auth/login", body={"name": "Ali Valiyev", "password": "secret1"})
        self.assertEqual(status, 403)

    async def test_logout_revokes_token(self):
        t1, _ = await self.student_token()
        await self.call("POST", "/api/auth/logout", t1)
        status, _ = await self.call("GET", "/api/state", t1)
        self.assertEqual(status, 401)

    async def test_expired_session_rejected(self):
        t1, _ = await self.student_token()
        with server.get_db() as conn:
            conn.execute("UPDATE sessions SET expires_at = 1")
        status, _ = await self.call("GET", "/api/state", t1)
        self.assertEqual(status, 401)

    async def test_roster_add_claim_and_delete(self):
        admin = await self.admin_token()
        status, data = await self.call("POST", "/api/students", admin, {"name": "Sardor Karimov", "className": "Group A"})
        self.assertEqual(status, 200, data)
        roster_id = data["student"]["id"]
        status, _ = await self.call("POST", "/api/students", admin, {"name": "Sardor Karimov"})
        self.assertEqual(status, 400)  # duplicate
        # the real student registers and takes over the roster entry
        status, reg = await self.register("Sardor", "Karimov")
        self.assertEqual((status, reg["student"]["id"]), (200, roster_id))
        status, _ = await self.register("Sardor", "Karimov")
        self.assertEqual(status, 400)  # now it is a real account
        status, _ = await self.call("POST", "/api/students/delete", admin, {"id": roster_id})
        self.assertEqual(status, 200)
        status, _ = await self.call("GET", "/api/state", reg["token"])
        self.assertEqual(status, 401)

    async def test_healthz(self):
        resp = await self.client.get("/healthz")
        self.assertEqual(resp.status, 200)
        self.assertEqual((await resp.json())["status"], "ok")

    async def test_bad_json_and_oversized_body(self):
        resp = await self.client.post("/api/auth/login", data="not json", headers={"Content-Type": "application/json"})
        self.assertEqual(resp.status, 400)
        resp = await self.client.post("/api/auth/login", json=["list"])
        self.assertEqual(resp.status, 400)

    async def test_errors_do_not_leak_internals(self):
        with server.get_db() as conn:
            conn.execute("DROP TABLE sessions")
        status, data = await self.call("POST", "/api/auth/register", body={"firstName": "Ali", "lastName": "Valiyev", "password": "secret1"})
        self.assertEqual(status, 500)
        self.assertNotIn("sessions", json.dumps(data))

    async def test_index_and_static_served_without_login_but_no_backups(self):
        resp = await self.client.get("/")
        self.assertEqual(resp.status, 200)
        self.assertEqual(resp.headers.get("X-Content-Type-Options"), "nosniff")
        for leaked in ("/static/index.html.bak", "/static/index.html.before_plain_patch", "/static/index.html.bak_garbled",
                       "/static/app_shell.js.bak_before_modern", "/level_one.db", "/.env", "/server.py"):
            r = await self.client.get(leaked)
            self.assertEqual(r.status, 404, leaked)

    async def test_self_registration_is_closed_by_default(self):
        server.ALLOW_SELF_REGISTRATION = False
        status, data = await self.register("Eve", "Stranger")
        self.assertEqual(status, 403, data)
        # a roster entry made by a teacher can still be claimed by that student
        admin = await self.admin_token()
        status, _ = await self.call("POST", "/api/students", admin, {"name": "Sardor Karimov"})
        self.assertEqual(status, 200)
        status, reg = await self.register("Sardor", "Karimov")
        self.assertEqual(status, 200, reg)

    async def test_forged_proxy_headers_are_ignored_from_public_addresses(self):
        class Req:
            def __init__(self, remote, headers):
                self.remote, self.headers = remote, headers
        forged = {"X-Forwarded-For": "1.2.3.4", "CF-Connecting-IP": "5.6.7.8"}
        self.assertEqual(server.client_ip(Req("8.8.4.4", forged)), "8.8.4.4")  # direct caller: headers ignored
        self.assertEqual(server.client_ip(Req("127.0.0.1", forged)), "5.6.7.8")  # our own tunnel: believed
        self.assertEqual(server.client_ip(Req("127.0.0.1", {"X-Forwarded-For": "not-an-ip"})), "127.0.0.1")

    # -- weekly assignments ------------------------------------------------
    async def make_assignment(self, admin, deadline_in=3600, **over):
        ex = {"category": "grammar", "title": "To be", "questions": [
            {"q": "I ___ a student.", "options": ["am", "is", "are", "be"], "a": "am"},
            {"q": "Write: she / nurse", "a": "She is a nurse.|she's a nurse"},
        ]}
        status, data = await self.call("POST", "/api/exercises", admin, ex)
        self.assertEqual(status, 200, data)
        body = {"title": "1-hafta", "weekLabel": "Week 1", "exerciseIds": [data["id"]],
                "deadline": (int(time.time()) + deadline_in) * 1000, **over}
        status, created = await self.call("POST", "/api/assignments", admin, body)
        self.assertEqual(status, 200, created)
        return created["id"], data["id"]

    async def answer(self, token, asg_id, ex_id, q_index, answer):
        return await self.call("POST", "/api/assignments/answer", token,
                               {"assignmentId": asg_id, "exerciseId": ex_id, "qIndex": q_index, "answer": answer})

    async def test_only_staff_manage_assignments(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)
        for path, body in [
            ("/api/assignments", {"title": "x", "exerciseIds": [ex_id], "deadline": int(time.time()) + 99}),
            ("/api/assignments/update", {"id": asg_id, "title": "hacked"}),
            ("/api/assignments/delete", {"id": asg_id}),
        ]:
            status, _ = await self.call("POST", path, token, body)
            self.assertEqual(status, 403, path)

    async def test_assignment_validation(self):
        admin = await self.admin_token()
        asg_id, ex_id = await self.make_assignment(admin)
        for body in [
            {"title": "", "exerciseIds": [ex_id], "deadline": int(time.time()) + 99},
            {"title": "x", "exerciseIds": [], "deadline": int(time.time()) + 99},
            {"title": "x", "exerciseIds": ["no_such_exercise"], "deadline": int(time.time()) + 99},
            {"title": "x", "exerciseIds": [ex_id], "deadline": int(time.time()) - 10},
            {"title": "x", "exerciseIds": [ex_id], "deadline": "soon"},
        ]:
            status, _ = await self.call("POST", "/api/assignments", admin, body)
            self.assertEqual(status, 400, body)

    async def test_points_by_try_25_15_5_5_then_answer_revealed(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)

        status, r = await self.answer(token, asg_id, ex_id, 0, "am")
        self.assertEqual((status, r["correct"], r["points"], r["tries"]), (200, True, 25, 1))
        status, r = await self.answer(token, asg_id, ex_id, 0, "is")  # already solved: nothing changes
        self.assertTrue(r["locked"])
        self.assertEqual(r["points"], 0)

        _, r = await self.answer(token, asg_id, ex_id, 1, "She are nurse")
        self.assertEqual((r["correct"], r["triesLeft"], r["nextPoints"]), (False, 3, 15))
        self.assertNotIn("correctAnswer", r)
        _, r = await self.answer(token, asg_id, ex_id, 1, "nope")
        self.assertEqual(r["hint"], {"mask": "S•• i• a n•••••"})
        _, r = await self.answer(token, asg_id, ex_id, 1, "nope")
        _, r = await self.answer(token, asg_id, ex_id, 1, "nope")
        self.assertEqual((r["resolved"], r["correct"], r["correctAnswer"]), (True, False, "She is a nurse."))
        self.assertTrue(r["my"]["done"])
        self.assertEqual(r["my"]["points"], 25)

        # the finished exercise shows up in the normal teacher report, with the mistake
        _, state = await self.call("GET", "/api/state", admin)
        att = [a for a in state["attempts"] if a["exerciseId"] == ex_id]
        self.assertEqual((len(att), att[0]["score"], att[0]["total"]), (1, 1, 2))
        self.assertEqual(att[0]["mistakes"][0]["studentAnswer"], "nope")

    async def test_second_and_fourth_try_points_and_mcq_hint(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)
        await self.answer(token, asg_id, ex_id, 0, "is")
        _, r = await self.answer(token, asg_id, ex_id, 0, "are")
        self.assertEqual(len(r["hint"]["remove"]), 2)
        self.assertNotIn("am", r["hint"]["remove"])
        _, r = await self.answer(token, asg_id, ex_id, 0, "am")
        self.assertEqual(r["points"], 5)
        _, r = await self.answer(token, asg_id, ex_id, 1, "x")
        _, r = await self.answer(token, asg_id, ex_id, 1, "she’s a nurse!")
        self.assertEqual((r["correct"], r["points"]), (True, 15))

    async def test_late_answers_get_half_points(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)
        with server.get_db() as conn:
            conn.execute("UPDATE assignments SET deadline = ? WHERE id = ?", (int(time.time()) - 5, asg_id))
        _, r = await self.answer(token, asg_id, ex_id, 0, "am")
        self.assertEqual((r["points"], r["late"]), (13, True))

    async def test_future_assignment_hidden_from_students(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(
            admin, deadline_in=7200, startsAt=(int(time.time()) + 3600) * 1000)
        _, data = await self.call("GET", "/api/assignments", token)
        self.assertEqual(data["assignments"], [])
        status, _ = await self.call("GET", f"/api/assignments/{asg_id}", token)
        self.assertEqual(status, 404)
        status, _ = await self.answer(token, asg_id, ex_id, 0, "am")
        self.assertEqual(status, 404)
        _, data = await self.call("GET", "/api/assignments", admin)
        self.assertEqual(len(data["assignments"]), 1)

    async def test_assignment_detail_hides_answers_until_resolved(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)
        await self.answer(token, asg_id, ex_id, 0, "am")
        status, data = await self.call("GET", f"/api/assignments/{asg_id}", token)
        self.assertEqual(status, 200, data)
        q0, q1 = data["exercises"][0]["questions"]
        self.assertNotIn("a", q0)
        self.assertNotIn("a", q1)
        self.assertEqual((q0["solved"], q0["correctAnswer"]), (True, "am"))
        self.assertNotIn("correctAnswer", q1)
        self.assertEqual(data["pointsByTry"], [25, 15, 5, 5])

    async def test_teacher_sees_who_did_and_who_did_not(self):
        admin = await self.admin_token()
        ali, _ = await self.student_token("Ali", "Valiyev")
        await self.student_token("Vali", "Aliyev")
        asg_id, ex_id = await self.make_assignment(admin)
        await self.answer(ali, asg_id, ex_id, 0, "am")
        await self.answer(ali, asg_id, ex_id, 1, "She is a nurse")
        _, data = await self.call("GET", "/api/assignments", admin)
        asg = data["assignments"][0]
        self.assertEqual((asg["doneCount"], asg["studentCount"]), (1, 2))
        by_name = {s["name"]: s for s in asg["students"]}
        self.assertTrue(by_name["Ali Valiyev"]["done"])
        self.assertEqual(by_name["Ali Valiyev"]["points"], 50)
        self.assertFalse(by_name["Vali Aliyev"]["done"])
        self.assertFalse(by_name["Vali Aliyev"]["started"])
        # students do not get the class list
        _, mine = await self.call("GET", "/api/assignments", ali)
        self.assertNotIn("students", mine["assignments"][0])
        self.assertTrue(mine["assignments"][0]["my"]["done"])

    async def test_leaderboard_week_and_all_time(self):
        admin = await self.admin_token()
        ali, ali_s = await self.student_token("Ali", "Valiyev")
        vali, _ = await self.student_token("Vali", "Aliyev")
        asg_id, ex_id = await self.make_assignment(admin)
        await self.answer(ali, asg_id, ex_id, 0, "am")             # 25
        await self.answer(vali, asg_id, ex_id, 0, "is")
        await self.answer(vali, asg_id, ex_id, 0, "am")            # 15
        with server.get_db() as conn:  # an old point from a previous week
            conn.execute("INSERT INTO points_log (student_id, source, ref, points, created_at) VALUES (?, 'assignment', 'old', 100, ?)",
                         (ali_s["id"], server.week_start_ts() - 3600))
        _, week = await self.call("GET", "/api/leaderboard?period=week", vali)
        self.assertEqual([(e["name"], e["points"], e["rank"]) for e in week["entries"]],
                         [("Ali Valiyev", 25, 1), ("Vali Aliyev", 15, 2)])
        self.assertEqual((week["me"]["weekRank"], week["me"]["weekPoints"], week["me"]["streak"]), (2, 15, 1))
        _, all_time = await self.call("GET", "/api/leaderboard?period=all", vali)
        self.assertEqual(all_time["entries"][0]["points"], 125)
        self.assertNotIn("Boss Admin", [e["name"] for e in all_time["entries"]])  # staff are not ranked

    async def test_game_points_follow_try_rules_and_daily_cap(self):
        token, _ = await self.student_token()
        status, r = await self.call("POST", "/api/game/finish", token, {"game": "quiz", "tries": [1, 2, 0, 9, True]})
        self.assertEqual((status, r["earned"], r["awarded"]), (200, 40, 40))
        _, r = await self.call("POST", "/api/game/finish", token, {"game": "quiz", "tries": [1, 1]})
        self.assertEqual(r["awarded"], server.GAME_DAILY_POINTS_CAP - 40)
        _, r = await self.call("POST", "/api/game/finish", token, {"game": "quiz", "tries": [1]})
        self.assertEqual((r["awarded"], r["remainingToday"]), (0, 0))
        status, _ = await self.call("POST", "/api/game/finish", token, {"game": "<x>", "tries": [1]})
        self.assertEqual(status, 400)

    async def test_games_cannot_report_faster_than_a_round_takes(self):
        server.GAME_MIN_SECONDS = 15
        token, _ = await self.student_token()
        status, _ = await self.call("POST", "/api/game/finish", token, {"game": "quiz", "tries": [1]})
        self.assertEqual(status, 200)
        status, _ = await self.call("POST", "/api/game/finish", token, {"game": "quiz", "tries": [1]})
        self.assertEqual(status, 429)
        status, _ = await self.call("POST", "/api/game/finish", token, {"game": "match", "tries": [1]})
        self.assertEqual(status, 200)  # another game has its own clock

    # -- Listen and Survive ---------------------------------------------------
    async def test_mission_results_give_stars_points_and_unlocks(self):
        token, _ = await self.student_token()
        body = {"mission": "escape", "difficulty": "normal", "steps": 5, "correct": 5, "hearts": 3, "seconds": 90}
        status, r = await self.call("POST", "/api/listen/finish", token, body)
        self.assertEqual((status, r["stars"], r["earned"], r["awarded"]), (200, 3, 25, 25))
        # a worse replay never lowers the best stars
        status, r = await self.call("POST", "/api/listen/finish", token, dict(body, correct=3, hearts=1, seconds=60))
        self.assertEqual((r["stars"], r["progress"]["escape"]), (1, {"stars": 3, "plays": 2, "best": 5}))
        status, r = await self.call("POST", "/api/listen/finish", token, dict(body, mission="camp", hearts=0, correct=4))
        self.assertEqual(r["stars"], 0)                      # all hearts lost: the mission is failed
        _, p = await self.call("GET", "/api/listen/progress", token)
        self.assertEqual(sorted(p["missions"]), ["camp", "escape"])

    async def test_mission_results_reject_nonsense_and_instant_runs(self):
        token, _ = await self.student_token()
        good = {"mission": "airport", "difficulty": "easy", "steps": 5, "correct": 4, "hearts": 2, "seconds": 70}
        for bad in (dict(good, mission="nope"), dict(good, difficulty="ultra"), dict(good, correct=9), dict(good, hearts=4),
                    dict(good, steps=1), dict(good, correct="5"), dict(good, seconds="fast"), dict(good, hearts=True)):
            status, _ = await self.call("POST", "/api/listen/finish", token, bad)
            self.assertEqual(status, 400, bad)
        status, r = await self.call("POST", "/api/listen/finish", token, dict(good, seconds=3))
        self.assertEqual((status, r["earned"], r["awarded"]), (200, 0, 0))      # nobody finishes 5 steps in 3 seconds
        status, _ = await self.call("POST", "/api/listen/finish", None, good)
        self.assertEqual(status, 401)

    async def test_mission_words_join_the_shared_memory_without_inflating_the_course_counts(self):
        token, _ = await self.student_token()
        status, r = await self.call("POST", "/api/words/report", token, {"source": "listen", "results": [
            {"id": "ls_straight", "ok": False}, {"id": "ls_gate", "ok": True}, {"id": "w1_a01", "ok": True}, {"id": "ls_nope", "ok": True}]})
        self.assertEqual((status, r["applied"]), (200, 3))
        self.assertEqual((r["words"]["ls_straight"]["s"], r["words"]["ls_gate"]["s"]), ("review", "learning"))
        self.assertEqual((r["glossary"]["seen"], r["glossary"]["review"], r["glossary"]["learning"]), (2, 1, 1))
        self.assertEqual((r["counts"]["learning"], r["counts"]["total"]), (1, 146))   # the course counts only know the flashcards

    # -- Word Race ----------------------------------------------------------
    async def race_setup(self):
        import race_engine as RE
        self._race_saved = (RE.TRACK, RE.COUNTDOWN, RE.MIN_ANSWER_SECONDS, server.RACE_TICK)
        RE.TRACK, RE.COUNTDOWN, RE.MIN_ANSWER_SECONDS, server.RACE_TICK = 90.0, 0.3, 0.02, 0.05
        server.RACE_ROOMS.clear()
        self.addCleanup(self.race_teardown)

    def race_teardown(self):
        import race_engine as RE
        RE.TRACK, RE.COUNTDOWN, RE.MIN_ANSWER_SECONDS, server.RACE_TICK = self._race_saved
        for e in server.RACE_ROOMS.values():
            if e.task and not e.task.done():
                e.task.cancel()
        server.RACE_ROOMS.clear()

    async def race_join(self, token, code):
        ws = await self.client.ws_connect(f"/ws/race?code={code}")
        await ws.send_json({"t": "auth", "token": token})
        first = await ws.receive_json(timeout=3)
        return ws, first

    async def race_wait(self, ws, kind, timeout=5):
        """Next message of this kind (the others are skipped)."""
        import asyncio
        end = time.time() + timeout
        while True:
            msg = await ws.receive_json(timeout=max(0.1, end - time.time()))
            if msg["t"] == kind:
                return msg
            if time.time() > end:
                self.fail(f"no {kind} message")

    async def race_room(self, token, mode="sprint"):
        status, r = await self.call("POST", "/api/race/create", token, {"mode": mode})
        self.assertEqual(status, 200, r)
        return r["code"]

    async def test_solo_race_against_bots_pays_points_and_feeds_the_word_memory(self):
        import asyncio
        from test_race_engine import questions
        await self.race_setup()
        token, _ = await self.student_token()
        code = await self.race_room(token)
        ws, joined = await self.race_join(token, code)
        self.assertEqual(joined["t"], "joined")
        pid = joined["you"]
        qs = questions(30)
        await ws.send_json({"t": "bots", "n": 2, "level": "easy"})
        await ws.send_json({"t": "questions", "items": qs})
        ack = await self.race_wait(ws, "ack")
        self.assertEqual((ack["accepted"], ack["ready"]), (30, True))
        lobby = await self.race_wait(ws, "lobby")
        self.assertEqual((len(lobby["players"]), lobby["canStart"]), (3, True))
        await ws.send_json({"t": "start"})
        await self.race_wait(ws, "countdown")
        await self.race_wait(ws, "go")
        end = None
        while end is None:   # answer every question right, quickly
            msg = await ws.receive_json(timeout=15)
            if msg["t"] == "q":
                await asyncio.sleep(0.05)
                await ws.send_json({"t": "answer", "i": msg["i"], "a": qs[msg["i"] % len(qs)]["a"]})
            elif msg["t"] == "end":
                end = msg
        me = next(r for r in end["results"] if r["id"] == pid)
        self.assertTrue(me["finished"])
        self.assertEqual(me["rank"], 1)   # perfect, quick answers beat easy bots
        self.assertNotIn("student_id", me)
        self.assertGreater(end["awards"][pid]["awarded"], 0)
        _, lb = await self.call("GET", "/api/leaderboard?period=all", token)
        self.assertEqual(lb["me"]["allPoints"], end["awards"][pid]["awarded"])
        _, mem = await self.call("GET", "/api/words", token)
        self.assertGreater(len(mem["words"]), 0)
        await ws.close()

    async def test_race_questions_may_use_the_words_from_the_listening_missions(self):
        await self.race_setup()
        token, _ = await self.student_token()
        ws, _ = await self.race_join(token, await self.race_room(token))
        glossary = server.load_glossary()
        words = [g for g in glossary.values()][:24]
        items = []
        for i, g in enumerate(words):
            others = [x["meaning_uz"] for x in words if x["id"] != g["id"]][i % 5:][:3]
            items.append({"k": "en2uz", "q": f"“{g['word']}” — o'zbekcha qanday?", "o": [g["meaning_uz"], *others], "a": g["meaning_uz"], "w": g["id"]})
        await ws.send_json({"t": "questions", "items": items})
        ack = await self.race_wait(ws, "ack")
        self.assertEqual((ack["accepted"], ack["ready"]), (24, True))
        await ws.close()

    async def test_race_rejects_bad_tokens_unknown_rooms_and_fake_questions(self):
        await self.race_setup()
        token, _ = await self.student_token()
        code = await self.race_room(token)
        ws, first = await self.race_join("garbage", code)
        self.assertEqual((first["t"], first.get("fatal")), ("error", True))
        ws, first = await self.race_join(token, "ZZZZ")
        self.assertEqual((first["t"], first.get("fatal")), ("error", True))
        ws, joined = await self.race_join(token, code)
        from test_race_engine import questions
        fake = [dict(q, a="hacked") for q in questions(30)]
        await ws.send_json({"t": "questions", "items": fake})
        ack = await self.race_wait(ws, "ack")
        self.assertEqual((ack["accepted"], ack["ready"]), (0, False))
        await ws.send_json({"t": "start"})
        err = await self.race_wait(ws, "error")
        self.assertIn("tayyor", err["message"])
        status, _ = await self.call("POST", "/api/race/create", None, {})
        self.assertEqual(status, 401)
        await ws.close()

    async def test_friends_share_a_room_and_only_the_host_runs_it(self):
        from test_race_engine import questions
        await self.race_setup()
        ali, _ = await self.student_token("Ali", "Valiyev")
        vali, _ = await self.student_token("Vali", "Aliyev")
        code = await self.race_room(ali)
        a, ja = await self.race_join(ali, code)
        b, jb = await self.race_join(vali, code)
        lobby = await self.race_wait(a, "lobby")
        while len(lobby["players"]) < 2:
            lobby = await self.race_wait(a, "lobby")
        self.assertEqual((lobby["host"], sorted(p["name"] for p in lobby["players"])), (ja["you"], ["Ali Valiyev", "Vali Aliyev"]))
        for ws in (a, b):
            await ws.send_json({"t": "questions", "items": questions(30)})
        await b.send_json({"t": "start"})   # not the host
        await self.race_wait(b, "error")
        await a.send_json({"t": "bots", "n": 3})
        lobby = None
        for _ in range(8):
            lobby = await self.race_wait(a, "lobby")
            if len(lobby["players"]) == 4:
                break
        self.assertEqual((len(lobby["players"]), lobby["canStart"]), (4, True))   # two people, and only two bots fit
        carol, _ = await self.student_token("Carol", "Third")
        late, err = await self.race_join(carol, code)
        self.assertEqual((err["t"], err.get("fatal")), ("error", True))   # the room is full
        # the host leaves: the other person becomes the host
        await a.close()
        for _ in range(10):
            lobby = await self.race_wait(b, "lobby")
            if lobby["host"] == jb["you"]:
                break
        self.assertEqual(lobby["host"], jb["you"])
        await b.close()

    async def test_classmates_and_telegram_invites(self):
        await self.race_setup()
        ali, _ = await self.student_token("Ali", "Valiyev")
        await self.student_token("Vali", "Aliyev")
        status, mates = await self.call("GET", "/api/race/mates", ali)
        self.assertEqual((status, [m["name"] for m in mates["mates"]]), (200, ["Vali Aliyev"]))
        code = await self.race_room(ali)
        ws, _ = await self.race_join(ali, code)
        status, r = await self.call("POST", "/api/race/invite", ali, {"code": code, "ids": ["stu_x", "tg_123"]})
        self.assertEqual((status, r["sent"]), (200, 0))   # no Telegram bot in the test: nothing sent, nothing breaks
        stranger, _ = await self.student_token("Eve", "Stranger")
        status, _ = await self.call("POST", "/api/race/invite", stranger, {"code": code, "ids": []})
        self.assertEqual(status, 404)                      # only people in the room can invite
        await ws.close()

    # -- shared vocabulary memory -------------------------------------------
    async def test_word_memory_moves_words_between_boxes(self):
        token, _ = await self.student_token()
        status, mem = await self.call("GET", "/api/words", token)
        self.assertEqual((status, mem["counts"]["new"], mem["counts"]["total"]), (200, mem["counts"]["total"], 146))
        a, b = "w1_a01", "w1_a02"
        status, r = await self.call("POST", "/api/words/report", token, {"source": "millionaire", "results": [{"id": a, "ok": True}, {"id": b, "ok": False}]})
        self.assertEqual((status, r["applied"]), (200, 2))
        self.assertEqual((r["words"][a]["s"], r["words"][a]["b"]), ("learning", 1))  # right once: rests a day
        self.assertEqual((r["words"][b]["s"], r["words"][b]["b"]), ("review", 0))  # missed: comes back soon
        for _ in range(3):  # right again and again: climbs to the "learned" box
            _, r = await self.call("POST", "/api/words/report", token, {"source": "wordrace", "results": [{"id": a, "ok": True}]})
        self.assertEqual((r["words"][a]["s"], r["words"][a]["b"]), ("mastered", 4))
        _, r = await self.call("POST", "/api/words/report", token, {"source": "wordrace", "results": [{"id": a, "ok": False}]})
        self.assertEqual((r["words"][a]["s"], r["words"][a]["b"]), ("review", 2))  # a learned word that is missed falls two boxes
        self.assertEqual(r["counts"]["review"], 2)

    async def test_word_reports_ignore_unknown_words_and_stuffing(self):
        token, _ = await self.student_token()
        results = [{"id": "w1_a01", "ok": True}] * 10 + [{"id": "nope", "ok": True}, {"id": "w1_a02", "ok": "yes"}, "junk"]
        status, r = await self.call("POST", "/api/words/report", token, {"source": "wordrace", "results": results})
        self.assertEqual((status, r["applied"], r["words"]["w1_a01"]["c"]), (200, server.WORD_MAX_PER_WORD, server.WORD_MAX_PER_WORD))
        self.assertEqual(list(r["words"]), ["w1_a01"])
        for bad in ({"source": "<x>", "results": []}, {"source": "quiz", "results": "all"}, {"source": "quiz", "results": [{"id": "w1_a01", "ok": True}] * 81}):
            status, _ = await self.call("POST", "/api/words/report", token, bad)
            self.assertEqual(status, 400, bad)
        status, _ = await self.call("POST", "/api/words/report", None, {"source": "quiz", "results": []})
        self.assertEqual(status, 401)

    async def test_word_memory_is_per_student(self):
        ali, _ = await self.student_token("Ali", "Valiyev")
        vali, _ = await self.student_token("Vali", "Aliyev")
        await self.call("POST", "/api/words/report", ali, {"source": "quiz", "results": [{"id": "w1_a01", "ok": True}]})
        _, mine = await self.call("GET", "/api/words", vali)
        self.assertEqual(mine["words"], {})

    # -- pomodoro focus blocks and the Asaka forest ------------------------
    def backdate_focus(self, session_id, seconds):
        import sqlite3
        conn = sqlite3.connect(server.DB_PATH)
        conn.execute("UPDATE focus_sessions SET started_at = started_at - ? WHERE id = ?", (seconds, session_id))
        conn.commit()
        conn.close()

    async def plant(self, token, expect=200):
        status, s = await self.call("POST", "/api/focus/start", token, {})
        if status != 200:
            return status, s
        self.backdate_focus(s["id"], server.FOCUS_SECONDS + 5)
        status, r = await self.call("POST", "/api/focus/finish", token, {"id": s["id"]})
        self.assertEqual(status, expect, r)
        return status, r

    async def test_a_tree_needs_the_full_focus_time_on_the_servers_clock(self):
        token, _ = await self.student_token()
        status, s = await self.call("POST", "/api/focus/start", token, {})
        self.assertEqual((status, s["seconds"]), (200, server.FOCUS_SECONDS))
        status, r = await self.call("POST", "/api/focus/finish", token, {"id": s["id"]})
        self.assertEqual(status, 409)  # the phone's clock does not count
        self.backdate_focus(s["id"], server.FOCUS_SECONDS)
        status, r = await self.call("POST", "/api/focus/finish", token, {"id": s["id"]})
        self.assertEqual(status, 200, r)
        tree = r["tree"]
        self.assertEqual((r["awarded"], r["already"], r["todayTrees"]), (server.FOCUS_POINTS_PER_TREE, False, 1))
        self.assertTrue(40.55 < tree["lat"] < 40.76 and 72.09 < tree["lon"] < 72.37, tree)  # inside Asaka district
        self.assertTrue(tree["spot"])
        status, again = await self.call("POST", "/api/focus/finish", token, {"id": s["id"]})
        self.assertEqual((status, again["already"], again["awarded"], again["tree"]["id"]), (200, True, 0, tree["id"]))
        _, lb = await self.call("GET", "/api/leaderboard?period=all", token)
        self.assertEqual(lb["me"]["allPoints"], server.FOCUS_POINTS_PER_TREE)

    async def test_leaving_early_or_starting_over_plants_nothing(self):
        token, _ = await self.student_token()
        _, a = await self.call("POST", "/api/focus/start", token, {})
        await self.call("POST", "/api/focus/cancel", token, {"id": a["id"]})
        self.backdate_focus(a["id"], server.FOCUS_SECONDS + 5)
        status, _ = await self.call("POST", "/api/focus/finish", token, {"id": a["id"]})
        self.assertEqual(status, 409)
        _, b = await self.call("POST", "/api/focus/start", token, {})
        _, c = await self.call("POST", "/api/focus/start", token, {})  # a new block cancels the one before
        self.backdate_focus(b["id"], server.FOCUS_SECONDS + 5)
        status, _ = await self.call("POST", "/api/focus/finish", token, {"id": b["id"]})
        self.assertEqual(status, 409)
        _, state = await self.call("GET", "/api/focus/state", token)
        self.assertEqual((state["active"]["id"], state["todayTrees"]), (c["id"], 0))

    async def test_nobody_can_plant_with_someone_elses_block(self):
        ali, _ = await self.student_token("Ali", "Valiyev")
        vali, _ = await self.student_token("Vali", "Aliyev")
        _, s = await self.call("POST", "/api/focus/start", ali, {})
        self.backdate_focus(s["id"], server.FOCUS_SECONDS + 5)
        status, _ = await self.call("POST", "/api/focus/finish", vali, {"id": s["id"]})
        self.assertEqual(status, 404)

    async def test_daily_tree_and_point_limits(self):
        saved = server.FOCUS_DAILY_TREES, server.FOCUS_REWARDED_TREES
        server.FOCUS_DAILY_TREES, server.FOCUS_REWARDED_TREES = 3, 2
        try:
            token, _ = await self.student_token()
            awards = [(await self.plant(token))[1]["awarded"] for _ in range(3)]
            self.assertEqual(awards, [server.FOCUS_POINTS_PER_TREE, server.FOCUS_POINTS_PER_TREE, 0])
            status, _ = await self.call("POST", "/api/focus/start", token, {})
            self.assertEqual(status, 409)  # 3 trees = the day's limit
        finally:
            server.FOCUS_DAILY_TREES, server.FOCUS_REWARDED_TREES = saved

    async def test_forest_is_shared_and_spreads_over_many_places(self):
        ali, _ = await self.student_token("Ali", "Valiyev")
        vali, _ = await self.student_token("Vali", "Aliyev")
        for token in (ali, ali, vali):
            await self.plant(token)
        status, f = await self.call("GET", "/api/focus/forest", vali)
        self.assertEqual((status, f["total"], f["mine"], len(f["trees"])), (200, 3, 1, 3))
        self.assertEqual(len({t["spot"] for t in f["trees"]}), 3)  # three different real places, not one pile
        self.assertEqual(len({(t["lat"], t["lon"]) for t in f["trees"]}), 3)
        self.assertEqual([(e["name"], e["trees"]) for e in f["week"]], [("Ali Valiyev", 2), ("Vali Aliyev", 1)])
        _, newer = await self.call("GET", f"/api/focus/forest?after={f['trees'][1]['id']}", ali)
        self.assertEqual([t["id"] for t in newer["trees"]], [f["trees"][2]["id"]])
        status, _ = await self.call("GET", "/api/focus/forest")
        self.assertEqual(status, 401)

    async def test_submit_is_graded_by_the_server_not_trusted(self):
        token, _ = await self.student_token()
        # practice-suite exercise: the key is in static/practicing_suite.js, which the server reads too
        ex = server.load_practice_suite()["gram_fill_blank"]
        right = [server.primary_answer(q["a"]) for q in ex["questions"]]
        wrong = ["zzz"] * len(right)
        status, r = await self.call("POST", "/api/submit", token, {
            "exerciseId": "gram_fill_blank", "attemptId": "a1", "answers": wrong, "score": len(right), "total": len(right)})
        self.assertEqual((status, r["score"], r["verified"]), (200, 0, True))  # the claimed full score is ignored
        status, r = await self.call("POST", "/api/submit", token, {"exerciseId": "gram_fill_blank", "attemptId": "a2", "answers": right})
        self.assertEqual((status, r["score"], r["total"]), (200, len(right), len(right)))
        # answers missing or the wrong length for a known exercise: refused
        status, _ = await self.call("POST", "/api/submit", token, {"exerciseId": "gram_fill_blank", "attemptId": "a3", "score": 20, "total": 20})
        self.assertEqual(status, 400)
        status, _ = await self.call("POST", "/api/submit", token, {"exerciseId": "gram_fill_blank", "attemptId": "a4", "answers": ["is"]})
        self.assertEqual(status, 400)
        # an unknown exercise is stored but flagged unverified
        status, r = await self.call("POST", "/api/submit", token, {"exerciseId": "gone_1", "attemptId": "a5", "score": 1, "total": 2})
        self.assertEqual((status, r["verified"]), (200, False))
        _, state = await self.call("GET", "/api/state", token)
        by_id = {a["attemptId"].split(":")[1]: a for a in state["attempts"]}
        self.assertEqual((by_id["a1"]["score"], by_id["a1"]["verified"]), (0, True))
        self.assertFalse(by_id["a5"]["verified"])

    async def test_update_and_delete_assignment_removes_its_points(self):
        admin = await self.admin_token()
        token, _ = await self.student_token()
        asg_id, ex_id = await self.make_assignment(admin)
        new_deadline = int(time.time()) + 10 * 24 * 3600
        status, _ = await self.call("POST", "/api/assignments/update", admin, {"id": asg_id, "deadline": new_deadline})
        self.assertEqual(status, 200)
        _, data = await self.call("GET", "/api/assignments", token)
        self.assertEqual(data["assignments"][0]["deadline"], new_deadline)
        await self.answer(token, asg_id, ex_id, 0, "am")
        await self.answer(token, asg_id, ex_id, 1, "She is a nurse")
        status, _ = await self.call("POST", "/api/assignments/delete", admin, {"id": asg_id})
        self.assertEqual(status, 200)
        _, lb = await self.call("GET", "/api/leaderboard?period=all", token)
        self.assertEqual(lb["me"]["allPoints"], 0)
        _, state = await self.call("GET", "/api/state", admin)
        self.assertEqual(state["attempts"], [])

    async def test_telegram_photo_url_kept_and_avatar_route_safe(self):
        init = sign_init_data({"id": 222, "first_name": "Ann", "photo_url": "https://t.me/i/userpic/320/abc.jpg"})
        status, data = await self.call("POST", "/api/auth/telegram", body={"initData": init})
        self.assertEqual(status, 200, data)
        self.assertEqual(data["student"]["photoUrl"], "https://t.me/i/userpic/320/abc.jpg")
        for path in ("/avatars/tg_222.jpg", "/avatars/..%2Flevel_one.jpg", "/avatars/stu_1.jpg"):
            r = await self.client.get(path)
            self.assertEqual(r.status, 404, path)
        os.makedirs(server.avatar_dir(), exist_ok=True)
        with open(os.path.join(server.avatar_dir(), "tg_222.jpg"), "wb") as f:
            f.write(b"\xff\xd8jpeg")
        with server.get_db() as conn:
            conn.execute("UPDATE students SET avatar_version = 7 WHERE id = 'tg_222'")
        r = await self.client.get("/avatars/tg_222.jpg")
        self.assertEqual(r.status, 200)
        _, lb = await self.call("GET", "/api/leaderboard", data["token"])
        self.assertEqual(lb["entries"][0]["photoUrl"], "/avatars/tg_222.jpg?v=7")

    async def test_notifications_go_out_once(self):
        sent = []

        class FakeBot:
            async def send_message(self, chat_id, text, **kw):
                sent.append((chat_id, text))

        class FakeApp:
            bot = FakeBot()

        admin = await self.admin_token()
        init = sign_init_data({"id": 333, "first_name": "Tg", "last_name": "Student"})
        await self.call("POST", "/api/auth/telegram", body={"initData": init})
        saved = server.TG_APP
        server.TG_APP = FakeApp()
        try:
            await self.make_assignment(admin, deadline_in=3600)  # due within 24h: announce + remind
            await server.run_assignment_notifications()
            await server.run_assignment_notifications()
        finally:
            server.TG_APP = saved
        to_student = [t for c, t in sent if c == 333]
        self.assertEqual(len(to_student), 2, to_student)
        self.assertIn("Yangi haftalik vazifa", to_student[0])
        self.assertIn("Eslatma", to_student[1])

    def test_answer_normalisation_matches_frontend(self):
        self.assertTrue(server.is_answer_correct("  SHE’S a  Nurse!! ", "she's a nurse"))
        self.assertTrue(server.is_answer_correct("g", "g) hamshira|g|hamshira"))
        self.assertFalse(server.is_answer_correct("", "am"))
        self.assertEqual(server.points_for(1, False), 25)
        self.assertEqual(server.points_for(3, True), 3)


class ManageCliTests(unittest.TestCase):
    """manage.py talks to the database named by DB_PATH (never the real one in these tests)."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        self.db = os.path.join(self._tmp.name, "cli.db")
        self.env = dict(os.environ, DB_PATH=self.db, BOT_TOKEN="YOUR_BOT_TOKEN_HERE", TEACHER_IDS="111",
                        PYTHONIOENCODING="utf-8", PYTHONDONTWRITEBYTECODE="1")
        self.app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def tearDown(self):
        self._tmp.cleanup()

    def run_cli(self, *args):
        import subprocess
        return subprocess.run([sys.executable, "-B", "manage.py", *args], cwd=self.app_dir, env=self.env,
                              capture_output=True, text=True, encoding="utf-8")

    def test_set_password_then_login_hash_verifies(self):
        saved = server.DB_PATH
        server.DB_PATH = self.db
        try:
            server.init_db()
            with server.get_db() as conn:
                conn.execute(
                    "INSERT INTO students (id,name,role,status,class_name,created_at,name_key) "
                    "VALUES ('stu_a','Old Student','student','approved','Level 1','x','old student')")
            r = self.run_cli("set-password", "Old Student", "--password", "newpass1")
            self.assertEqual(r.returncode, 0, r.stderr)
            with server.get_db() as conn:
                stored = conn.execute("SELECT password_hash FROM students WHERE id='stu_a'").fetchone()[0]
            self.assertTrue(server.verify_password("newpass1", stored))
            r = self.run_cli("set-password", "Old Student", "--password", "123")
            self.assertNotEqual(r.returncode, 0)
            r = self.run_cli("list-users")
            self.assertIn("Old Student", r.stdout)
            self.assertNotIn(stored, r.stdout)  # hashes are never printed
            r = self.run_cli("decline", "Old Student")
            self.assertEqual(r.returncode, 0, r.stderr)
            r = self.run_cli("decline", f"tg_111")
            self.assertNotEqual(r.returncode, 0)  # admins cannot be declined
        finally:
            server.DB_PATH = saved


class DataIntegrityTests(unittest.TestCase):
    """The workbook content shipped with the app must be self-consistent."""

    APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def exercises(self):
        with open(os.path.join(self.APP_DIR, "exercises_data.json"), encoding="utf-8") as f:
            return json.load(f)["exercises"]

    def test_exercise_pictures_point_to_files_that_exist(self):
        for ex in self.exercises():
            for q in ex["questions"]:
                img = q.get("img")
                if not img:
                    continue
                self.assertTrue(img.startswith("/static/"), f"{ex['id']}: {img[:40]}")
                self.assertTrue(os.path.isfile(os.path.join(self.APP_DIR, img.lstrip("/"))), f"{ex['id']}: missing {img}")

    def test_every_unit_exercise_exists(self):
        ids = {e["id"] for e in self.exercises()}
        with open(os.path.join(self.APP_DIR, "static", "units_data.js"), encoding="utf-8") as f:
            js = f.read()
        sections, _ = json.JSONDecoder().raw_decode(js[js.index("[", js.index("const FOUR_SECTIONS_DATA")):])
        referenced = {i for s in sections for t in s["topics"] for i in t["exerciseIds"]}
        self.assertTrue(referenced)
        self.assertEqual(referenced - ids, set())
        for s in sections:
            for t in s["topics"]:
                for page in t["bookPages"]:
                    self.assertTrue(os.path.isfile(os.path.join(self.APP_DIR, page.lstrip("/"))), f"{t['id']}: missing {page}")

    def test_exercise_ids_are_unique(self):
        ids = [e["id"] for e in self.exercises()]
        self.assertEqual(len(ids), len(set(ids)))


class HelperTests(unittest.TestCase):
    def test_csv_safe_neutralises_formulas(self):
        self.assertEqual(server.csv_safe("=HYPERLINK(\"x\")"), "'=HYPERLINK(\"x\")")
        self.assertEqual(server.csv_safe("@SUM(A1)"), "'@SUM(A1)")
        self.assertEqual(server.csv_safe("hello"), "hello")
        self.assertEqual(server.csv_safe(None), "")

    def test_password_hash_roundtrip(self):
        h = server.hash_password("pw12345")
        self.assertTrue(server.verify_password("pw12345", h))
        self.assertFalse(server.verify_password("other", h))
        self.assertNotEqual(h, server.hash_password("pw12345"))  # per-user salt

    def test_http_client_logs_cannot_leak_the_bot_token(self):
        import logging
        # python-telegram-bot's httpx client puts the token in every request URL it logs at INFO
        self.assertGreaterEqual(logging.getLogger("httpx").getEffectiveLevel(), logging.WARNING)

    def test_unconfigured_teacher_ids_means_no_admin(self):
        self.assertEqual(server.user_role_for(123456789), "student")


if __name__ == "__main__":
    unittest.main()
