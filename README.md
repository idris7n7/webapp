# Level One App — Telegram Mini App & Bot Server

One Python process (`server.py`) hosts the Mini App (`/`), the REST API (`/api/*`), the SQLite
database and the Telegram bot. It runs on a VPS, Render, Railway, DigitalOcean, Heroku or Docker.

## Folder structure
- `server.py` — web server + REST API + Telegram bot.
- `manage.py` — admin helper: list users, set a password, approve/decline, sign a user out.
- `static/index.html` + `static/*.js` — the Mini App frontend (units, flashcards, practice suites, teacher dashboard).
- `static/arcade_data.js` — the arcade games' content: grammar questions (A1, A2, B1+) with Uzbek explanations, the picture vocabulary (IPA, example, living or not) and the River Crossing errands. Strict JSON after `window.ARCADE_DATA =`: the server reads it to grade answers.
- `exercises_data.json` — the workbook exercises (teachers can add more from the dashboard; those are stored in the database). Students find them under **Mashq qilish → Mavzu Mashqlari**: per unit once its lesson is learned, plus **Qo'shimcha mashqlar** (vocabulary, final tests, teacher-made) which are always open.
- `green_city.py` — the planting rules of **Yashil shahar** (where a tree may stand, the 2 m distance).
- `static/*_data.js`, `static/green_zones.json` — generated content (units, flashcards, the green ground of the map). Do not edit by hand; change the script in `tools/` and run it again.
- `tools/` — the scripts that generate that content (`python tools/<name>.py`, from the app folder). `extract_books.py` needs the teacher's PDF books and `pip install pymupdf pillow`.
- `tests/` — automated tests (`python -m unittest discover -s tests -v`).
- `Dockerfile`, `.dockerignore`, `Procfile`, `render.yaml`, `.env.example` — deployment.

## Games
Four arcade games on the O'yinlar tab (`static/arcade_core.js` + `game_wordrun.js`, `game_penalty.js`, `game_ninja.js`, `game_river.js`, pictures from the art packs in `static/arcade/`):
- **Word Run** — swipe between lanes to collect English word coins (10 points each). After every 10 coins an **answer gate** crosses the street: the grammar question is on a card at the top and the three answers are boards over three coloured lanes; the lane he runs through is his answer (swipe, or tap the coloured chip). A right answer lights its board green and he runs on; a wrong answer costs a heart, he stops for the explanation and runs on again; the third wrong answer ends the run. Ten gates bring him home to Kungil Koʻchasi 17-uy (win = home with fewer than three wrong; the server keeps the same rule, `WORDRUN_MAX_WRONG`).
- **Penalti** — pick a kicker (the six kids) and a keeper (made-up). Each round the question sits in a bar over the live stadium, the referee whistles, the three answers appear on the goal and one swipe of the ball is the only decision: right = goal, wrong = save (the old draft pick is gone; the server ignores a missing `d`). 10 rounds; goals, saves and accuracy are kept apart; three goals in a row heat up the crowd.
- **Word Ninja** — an Uzbek word, pictures fall from the top, swipe the right one (+10, wrong −5). Living things are never cut: a cartoon glove taps them. 20 words.
- **Daryodan o'tish — Jigar!** — an Uzbek errand, pick the needed things at the market and row them home (3 per trip). 20 things.
All four games share one animated-movie look (`static/arcade_cinema.js`, `L1_3D.cinema`): a painted sky with a big sun, silhouette hills with acacias, warm key and rim light, drifting dust, birds, cel-shaded materials and ink outlines on the characters. The time of day follows the progress (afternoon to sunset in Word Run and Penalti, morning to sunset on the river, sunset to dusk on the ninja deck). The server grades every session (`/api/arcade/start`, `/api/arcade/finish`, one report per session id, retried by the page's outbox until it arrives) and pays the game points into the rating within the daily cap of **50** (`GAME_DAILY_POINTS_CAP`). Collected words can be saved to the shared **Word Coin Dictionary** (`/api/dictionary/save`): +20 points the first time a student saves a word, from any game, and the word joins the spaced-repetition memory (`word_progress`), reviewed on the dictionary page. Question accuracy is stored apart from the points. The art packs' original prompts and rules are kept outside the app; the build script that cuts their sheets writes `static/arcade/sprites.js`.

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
`static/l1_tasks.js` (task runner and teacher panel), `static/arcade_core.js` (games), `static/idris/`
(Teacher Idris cut-outs).

## Accounts and roles
| Role | How you get it | What you can do |
|------|----------------|-----------------|
| `student` | write a name, pick an avatar and a level (no password), or open the Mini App from Telegram | solve exercises, see **your own** results |
| `teacher` | register as teacher, then an **admin approves** (bot button or Roster tab) | see all students' results, add exercises and roster entries |
| `admin` | your Telegram id is listed in `TEACHER_IDS` | everything above + approve/decline/delete users |

The server decides the role from the database; the browser is never trusted. Inside Telegram the
app signs in through `/api/auth/telegram`, which verifies Telegram's signature (`initData`).
Outside Telegram a **student** comes in with a name, an avatar and a level, without a password (`POST /api/auth/join`): the pair name + avatar is the account, so the same pair on another phone is the same student, and the same name with another avatar is another student. A teacher's name and the name of an account that has a password cannot be taken this way. **Teachers and older accounts** sign in with name + password (minimum 6 characters) from the link under the entry form.

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
`POST /api/assignments|/update|/delete` (staff), `GET /api/leaderboard?period=week|all`, `POST /api/game/finish`, `POST /api/arcade/start|finish`, `GET /api/arcade/summary`, `GET /api/dictionary`, `POST /api/dictionary/save`, `POST /api/lesson_progress` (learned lessons and finished practices: the page sends what it has, the server keeps the union, so every device of a student shows the same progress; `/api/state` carries it as `lessonProgress`).

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
- **Anyone who has the link can create a student account** (name, avatar, level): a student account holds no secret, so this is meant for a class that trusts each other. It is limited by address (15 new accounts an hour) and by name (12 tries in 5 minutes). Set `OPEN_JOIN=0` to close that door; students then come in through Telegram or a teacher's class list (a name a teacher added is taken by the first student who arrives with it).
- **Registration with a password is closed by default.** Set `ALLOW_SELF_REGISTRATION=1` to let anyone create an account; otherwise only roster entries made by a teacher can be claimed, and Telegram sign-in works as before.
- **Client IP for rate limits** is taken from `CF-Connecting-IP` / `X-Forwarded-For` only when the request comes from this machine or a private network (tunnel, Render, Docker); direct callers cannot forge it. Add other proxies in `TRUSTED_PROXIES`.
- **/static/** serves only real site file types; backup files are refused. Old backups now live in `_old_backups` outside the app folder.


## Speed, offline use and backups
- **CSS and fonts are built or bundled, never loaded from a CDN.** After adding Tailwind classes to `index.html` or a script, run `npm install` once and then `npm run build` in `tools/tailwind/` (it writes `static/tailwind.css`; bump its `?v=` in `index.html`). Fonts are in `static/fonts/` (`fonts.css`).
- **The games load on first use.** `static/student_features.js` (`L1_Lazy`) runs the arcade games' scripts when the Games tab opens (when the browser is idle they are only downloaded). A new game script goes into that list, not into `index.html`.
- **The server gzips text files** (kept in memory) and sends ETags, so a returning visitor gets `304`s. Pages carry a Content-Security-Policy that only allows this server and `telegram.org`.
- **`/sw.js` is a service worker** that keeps versioned files, fonts and pictures for offline use. Bump `CACHE` in `static/sw.js` if you ever change its rules. It works only over https or on localhost.
- **Database backups:** every 6 hours the server copies the database to `backups/` next to it (`BACKUP_DIR` to change, newest 14 kept). Copy that folder off the computer now and then.
- **Hosting:** the tunnel only works while this computer is on. For an always-on server use `render.yaml` / `Dockerfile` (set `BOT_TOKEN`, `WEBAPP_URL`, `TEACHER_IDS` and a persistent disk for `DB_PATH`).
