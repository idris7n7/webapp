# Level One App — Telegram Mini App & Bot Server

One Python process (`server.py`) hosts the Mini App (`/`), the REST API (`/api/*`), the SQLite
database and the Telegram bot. It runs on a VPS, Render, Railway, DigitalOcean, Heroku or Docker.

## Folder structure
- `server.py` — web server + REST API + Telegram bot.
- `manage.py` — admin helper: list users, set a password, approve/decline, sign a user out.
- `static/index.html` + `static/*.js` — the Mini App frontend (units, flashcards, practice suites, teacher dashboard).
- `race_engine.py` — the server-side rules of **Word Race** (track, speeds, bots, answer checking).
- `exercises_data.json` — the workbook exercises (teachers can add more from the dashboard; those are stored in the database). Students find them under **Mashq qilish → Mavzu Mashqlari**: per unit once its lesson is learned, plus **Qo'shimcha mashqlar** (vocabulary, final tests, teacher-made) which are always open.
- `green_city.py` — the planting rules of **Yashil shahar** (where a tree may stand, the 2 m distance).
- `static/*_data.js`, `static/green_zones.json` — generated content (units, flashcards, Millioner questions, Listen and Survive missions, the green ground of the map). Do not edit by hand; change the script in `tools/` and run it again.
- `tools/` — the scripts that generate that content (`python tools/<name>.py`, from the app folder). `extract_books.py` needs the teacher's PDF books and `pip install pymupdf pillow`.
- `tests/` — automated tests (`python -m unittest discover -s tests -v`).
- `Dockerfile`, `.dockerignore`, `Procfile`, `render.yaml`, `.env.example` — deployment.

## Games
**Dragon chase** (answer to run away from the dragon), **Millioner** (a TV-studio quiz; its music and sounds are generated in the browser, nothing is recorded or copied), **Word Race** (against bots or up to 4 friends, over a WebSocket; invites go through the Telegram bot) and **Listen and Survive** (5 listening missions, the browser reads the English with its own speech voice). All games share one vocabulary memory (Leitner boxes) and earn at most 50 points a day.

## Pomodoro and Yashil shahar
A small tomato floats over every screen. One finished 25-minute Pomodoro earns **one tree**, which the student plants on the shared map **Yashil shahar**:
- A pause stops the clock; all pauses of one Pomodoro together may last 10 minutes.
- Trees may stand only on green ground (parks, school yards, grass, woods from OpenStreetMap, and areas an administrator draws on the map), never inside a building or on a road, and **never closer than 2 m to another tree**. The server decides (`green_city.py`); two requests for the same spot cannot both pass.
- Giving a Pomodoro up wilts the student's own latest planted tree (nothing wilts when none is planted). A wilted tree comes back for one earned tree.
- After 10, 25 and 50 finished Pomodoros a student unlocks a rare tree kind (only the picture differs).
- Build the green ground with `python tools/build_green_zones.py` (needs internet).

## What is not in this repository
Kept out on purpose (see `.gitignore`): `.env` (bot token), the SQLite database and the Telegram avatars (students' data),
logs and tunnel files, the recorded voice clips, and everything cut from the teacher's PDF books
(`static/img/grammar`, `static/img/vocab`, `books_manifest.json`). The app still starts without the book pictures, but the
grammar page viewer and the flashcard photos / "What is this?" picture questions need them: put the PDFs in `books/`
and run `python tools/extract_books.py` then `python tools/add_card_images.py`.

## Credits
- Map: [Leaflet](https://leafletjs.com) 1.9.4 (BSD-2-Clause, in `static/vendor/leaflet`) with © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors tiles; `static/green_zones.json` is derived from OpenStreetMap data (ODbL).

## Weekly assignments, points and rating
- **Teacher panel → "📅 Haftalik vazifalar"**: pick exercises, set a start time and a **deadline**, publish.
  The table under each assignment shows who finished, who is in progress and who has not started
  (with points, first-try answers and last activity). "📋 Bajarmaganlar" copies the list of students
  who have not finished, ready to paste into the group chat. The deadline can be moved later.
- **Students** answer one question at a time. The **server** checks every try and gives points:
  1st try **25**, 2nd try **15**, 3rd or 4th try **5**. After the 2nd wrong try a hint appears
  (wrong options are removed, or the first letters are shown); after the 4th the right answer is shown.
  Answers given after the deadline count for half the points.
- **Rating**: this week (Monday 00:00, UTC+5 — `TZ_OFFSET_HOURS`) and all time. Games use the same
  25/15/5 rules but add at most **50 points a day** (`GAME_DAILY_POINTS_CAP`), so homework stays the main source.
- **Bot messages** (when `BOT_TOKEN` is set): a new assignment is announced to students, a reminder goes
  to those who have not finished 24 hours before the deadline, and the teachers (`TEACHER_IDS`) get a
  "who did / who didn't" summary when the deadline passes.
- **Avatars**: the bot downloads each Telegram user's profile photo (when their privacy settings allow it)
  into `avatars/` next to the database and serves it from `/avatars/tg_<id>.jpg`; otherwise initials are shown.

Frontend files: `static/app_theme.css` (design), `static/l1_core.js` (Telegram Mini App integration,
haptics, sounds, Teacher Idris: a canvas rig that breathes, blinks and moves the hand/arm of each scene), `static/app_shell.js` (header, bottom navigation, Home/Tasks/Rating),
`static/l1_tasks.js` (task runner and teacher panel), `static/games_engine.js` (games), `static/idris/`
(Teacher Idris cut-outs).

## Accounts and roles
| Role | How you get it | What you can do |
|------|----------------|-----------------|
| `student` | register in the app, or open the Mini App from Telegram | solve exercises, see **your own** results |
| `teacher` | register as teacher, then an **admin approves** (bot button or Roster tab) | see all students' results, add exercises and roster entries |
| `admin` | your Telegram id is listed in `TEACHER_IDS` | everything above + approve/decline/delete users |

The server decides the role from the database; the browser is never trusted. Inside Telegram the
app signs in through `/api/auth/telegram`, which verifies Telegram's signature (`initData`).
Outside Telegram, users sign in with name + password (minimum 6 characters).

## Setup
1. `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` and fill it in (or export the variables):
   ```bash
   BOT_TOKEN="your_botfather_token"
   WEBAPP_URL="https://your-server-domain.com"
   TEACHER_IDS="your_telegram_numeric_id"   # comma separated; empty = nobody is admin
   CHANNEL_ID="@your_channel_username"
   DB_PATH="/data/level_one.db"             # optional, see "Data persistence"
   ```
3. `python server.py` — the bot's Mini App menu button is configured automatically.
   If `WEBAPP_URL` changes in `.env` (for example a new tunnel URL), the running server notices within
   ~30 seconds and updates the bot's menu button.

Never commit or share `.env`. If it has ever been uploaded or shared, create a new token with
@BotFather (`/revoke`) and put the new one in `.env`.

## Administration
```bash
python manage.py list-users
python manage.py set-password "Ali Valiyev"      # asks for the password; signs the user out everywhere
python manage.py approve "Dilnoza Ustozova"
```
Accounts that used to be protected by the passwords that were once hardcoded in `server.py` are
locked automatically at startup. Give them a new password with `set-password`.

## API (all JSON; everything except `/`, `/healthz` and the auth endpoints needs `Authorization: Bearer <token>`)
`POST /api/auth/register|login|telegram|logout`, `GET /api/auth/check_status`, `GET /api/state`,
`POST /api/submit`, `POST /api/exercises` (staff), `POST /api/students` (staff),
`POST /api/students/delete` (admin), `POST /api/user_status` (admin), `GET /healthz`,
`GET /api/assignments`, `GET /api/assignments/{id}`, `POST /api/assignments/answer`,
`POST /api/assignments|/update|/delete` (staff), `GET /api/leaderboard?period=week|all`, `POST /api/game/finish`.

## Data persistence
The database is one SQLite file (`level_one.db`, or `DB_PATH`). Containers and free cloud tiers
(Render, Heroku) have throw-away disks: **attach a persistent disk/volume and point `DB_PATH` at it**,
otherwise the data disappears on every redeploy. The Dockerfile expects a volume at `/data`.

## Good to know
- Answers are checked in the browser, so a determined student could submit a fake score. Server-side
  grading would need the answer keys to stay on the server.
- Quick Cloudflare tunnels (`*.trycloudflare.com`) get a new URL on every restart. For a stable
  address use a named tunnel or a real domain.
- Login attempts are rate limited per IP and per name (in memory, per process).

## Security notes
- **Registration is closed by default.** Set `ALLOW_SELF_REGISTRATION=1` to let anyone create an account; otherwise only roster entries made by a teacher can be claimed, and Telegram sign-in works as before.
- **Client IP for rate limits** is taken from `CF-Connecting-IP` / `X-Forwarded-For` only when the request comes from this machine or a private network (tunnel, Render, Docker); direct callers cannot forge it. Add other proxies in `TRUSTED_PROXIES`.
- **/static/** serves only real site file types; backup files are refused. Old backups now live in `_old_backups` outside the app folder.


## 3D graphics (Word Race and Listen and Survive)
Both games draw real 3D scenes with Three.js. The code is in `tools/3d_src/` and is bundled into `static/l1_3d.js` (loaded by `index.html`).
- `race3d.ts` — Word Race: a race track with kerbs, grandstand, billboards, start lights, chase camera, speed lines and boost effects. `games_wordrace.js` feeds it the cars' positions and speeds from the server.
- `listen3d.ts`, `models.ts`, `chars.ts` — Listen and Survive: one 3D scene per mission (burning office, night camp, airport, police line-up, timed workshop). The missions, questions, hearts and stars are unchanged; the player now taps 3D objects instead of emoji tiles.
- If a device has no WebGL, both games fall back to the old 2D lanes and emoji tiles automatically.
- Rebuild after changing the sources: `cd tools/3d_src && npm install && npm run build`.
