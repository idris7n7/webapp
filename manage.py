"""
Level One App — administration helper (run on the machine that hosts the database).

    python manage.py list-users
    python manage.py set-password "Ali Valiyev"       # asks for the new password
    python manage.py approve "Ali Valiyev"            # or: decline
    python manage.py revoke-sessions "Ali Valiyev"    # sign the user out everywhere

Use `set-password` for accounts whose password was cleared (for example the old
accounts that were protected by the passwords that used to be hardcoded).
"""
import argparse
import getpass
import sys

import server


def find_user(conn, text):
    rows = conn.execute(
        "SELECT * FROM students WHERE id = ? OR name_key = ?", (text, server.name_key(text))
    ).fetchall()
    if not rows:
        sys.exit(f"No user found for {text!r}. Try: python manage.py list-users")
    if len(rows) > 1:
        print("Several users match, use the id instead:")
        for r in rows:
            print(f"  {r['id']}  {r['name']}")
        sys.exit(1)
    return rows[0]


def cmd_list(args):
    server.init_db()
    with server.get_db() as conn:
        rows = conn.execute("SELECT * FROM students ORDER BY created_at").fetchall()
    print(f"{'id':32} {'role':8} {'status':9} {'password':8} name")
    for r in rows:
        has_pw = "set" if r["password_hash"] else "-"
        print(f"{r['id']:32} {r['role'] or '':8} {r['status'] or '':9} {has_pw:8} {r['name']}")


def cmd_set_password(args):
    server.init_db()
    password = args.password or getpass.getpass("New password (min 6 characters): ")
    if len(password) < 6:
        sys.exit("Password must be at least 6 characters.")
    with server.get_db() as conn:
        user = find_user(conn, args.user)
        conn.execute(
            "UPDATE students SET password_hash = ? WHERE id = ?",
            (server.hash_password(password), user["id"]),
        )
        conn.execute("DELETE FROM sessions WHERE student_id = ?", (user["id"],))
    print(f"Password updated for {user['name']} ({user['id']}). Existing sessions were signed out.")


def cmd_status(status):
    def run(args):
        server.init_db()
        with server.get_db() as conn:
            user = find_user(conn, args.user)
            if user["role"] == "admin":
                sys.exit("Admin status is managed through TEACHER_IDS.")
            conn.execute("UPDATE students SET status = ? WHERE id = ?", (status, user["id"]))
            if status != "approved":
                conn.execute("DELETE FROM sessions WHERE student_id = ?", (user["id"],))
        print(f"{user['name']} ({user['id']}) is now {status}.")

    return run


def cmd_revoke(args):
    server.init_db()
    with server.get_db() as conn:
        user = find_user(conn, args.user)
        conn.execute("DELETE FROM sessions WHERE student_id = ?", (user["id"],))
    print(f"Signed {user['name']} out everywhere.")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list-users").set_defaults(func=cmd_list)

    p = sub.add_parser("set-password")
    p.add_argument("user", help="name (e.g. \"Ali Valiyev\") or id")
    p.add_argument("--password", help="avoid: it ends up in your shell history; omit to be asked")
    p.set_defaults(func=cmd_set_password)

    for name, status in (("approve", "approved"), ("decline", "declined")):
        p = sub.add_parser(name)
        p.add_argument("user")
        p.set_defaults(func=cmd_status(status))

    p = sub.add_parser("revoke-sessions")
    p.add_argument("user")
    p.set_defaults(func=cmd_revoke)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
