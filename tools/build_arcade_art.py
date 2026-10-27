"""Cuts the three art packs (Word Run, Penalty Kicks, Word Ninja) into the game pictures in static/arcade/.

Each pose sheet is split by its alpha shapes (a shape belongs to the grid cell it overlaps most), re-packed into one WebP
atlas, and the frame rectangles are written to static/arcade/sprites.js. Backgrounds and props are trimmed and resized;
the Games page card pictures are crops of the scene references. Every picture must stay under 400 KB (tests check it).

Usage (from the app folder, after unzipping the packs into one folder, each zip into a folder named after it without
"_Complete_Art_Pack.zip": Word_Ninja/, Penalty_Kicks/, Shakespeares_Word_Run/):
    pip install pillow numpy scipy
    python tools/build_arcade_art.py <folder with the unzipped packs> static
Bump ASSET_V in static/arcade_core.js (and the ?v= of arcade/sprites.js in student_features.js) after running it.
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

PACKS, STATIC = sys.argv[1], sys.argv[2]
OUT = os.path.join(STATIC, "arcade")
WR = os.path.join(PACKS, "Shakespeares_Word_Run", "Word_Run_Complete_Art_Pack")
PK = os.path.join(PACKS, "Penalty_Kicks", "Penalty_Kicks_Complete_Art_Pack")
WN = os.path.join(PACKS, "Word_Ninja", "Word_Ninja_Complete_Art_Pack")
META = {}
REPORT = []


def save(im, rel, q=82):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)
    kb = os.path.getsize(path) // 1024
    REPORT.append(f"{rel} {im.size[0]}x{im.size[1]} {kb} KB")
    if kb >= 390:
        raise SystemExit(f"too big: {rel} {kb} KB")
    return path


def background(src, rel, max_side, q=78):
    im = Image.open(src).convert("RGB")
    r = min(1, max_side / max(im.size))
    if r < 1:
        im = im.resize((round(im.size[0] * r), round(im.size[1] * r)), Image.LANCZOS)
    save(im, rel, q)
    META[rel] = {"w": im.size[0], "h": im.size[1]}


def trim(src, rel, max_side, q=84):
    im = Image.open(src).convert("RGBA")
    a = np.array(im)[:, :, 3]
    ys, xs = np.nonzero(a > 8)
    pad = 4
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.size[0], xs.max() + pad + 1), min(im.size[1], ys.max() + pad + 1))
    im = im.crop(box)
    r = min(1, max_side / max(im.size))
    if r < 1:
        im = im.resize((round(im.size[0] * r), round(im.size[1] * r)), Image.LANCZOS)
    save(im, rel, q)
    META[rel] = {"w": im.size[0], "h": im.size[1]}


def sheet(src, rel, cols, rows, names, max_h, q=84, min_area=40):
    """Splits a pose sheet: every alpha component goes to the nominal cell it overlaps most; a cell's sprite is the
    union of its components (soft edges kept by a small dilation), cropped and scaled to max_h."""
    im = Image.open(src).convert("RGBA")
    arr = np.array(im)
    alpha = arr[:, :, 3]
    H, W = alpha.shape
    cw, ch = W / cols, H / rows
    lab, n = ndimage.label(alpha > 24, structure=np.ones((3, 3)))
    objs = ndimage.find_objects(lab)
    owner = {}
    for i, sl in enumerate(objs, 1):
        comp = lab[sl] == i
        area = int(comp.sum())
        if area < min_area:
            continue
        ys, xs = np.nonzero(comp)
        ys = ys + sl[0].start
        xs = xs + sl[1].start
        cells = np.minimum(rows - 1, (ys / ch).astype(int)) * cols + np.minimum(cols - 1, (xs / cw).astype(int))
        owner[i] = int(np.bincount(cells, minlength=cols * rows).argmax())
    sprites = []
    for c in range(cols * rows):
        ids = [i for i, o in owner.items() if o == c]
        mask = np.isin(lab, ids)
        mask = ndimage.binary_dilation(mask, iterations=3)
        ys, xs = np.nonzero(mask)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        part = arr[y0:y1, x0:x1].copy()
        part[:, :, 3] = np.where(mask[y0:y1, x0:x1], part[:, :, 3], 0)
        sprites.append(Image.fromarray(part))
    tallest = max(s.size[1] for s in sprites)
    r = min(1, max_h / tallest)
    sprites = [s.resize((max(1, round(s.size[0] * r)), max(1, round(s.size[1] * r))), Image.LANCZOS) for s in sprites]
    # one row, or two when one row would be wider than 2048 px
    per_row = len(sprites) if sum(s.size[0] for s in sprites) + 4 * len(sprites) <= 2048 else (len(sprites) + 1) // 2
    frames, x, y, row_h, aw = {}, 0, 0, 0, 0
    for k, s in enumerate(sprites):
        if k and k % per_row == 0:
            y += row_h + 4
            x = 0
            row_h = 0
        frames[names[k]] = [x, y, s.size[0], s.size[1]]
        x += s.size[0] + 4
        row_h = max(row_h, s.size[1])
        aw = max(aw, x)
    atlas = Image.new("RGBA", (aw, y + row_h), (0, 0, 0, 0))
    for k, s in enumerate(sprites):
        fx, fy, _, _ = frames[names[k]]
        atlas.paste(s, (fx, fy))
    save(atlas, rel, q)
    META[rel] = {"w": atlas.size[0], "h": atlas.size[1], "frames": frames}


# ---- shared Shakespeare (the same file is in the Word Run and Word Ninja packs)
sheet(f"{WR}/characters/shakespeare_feedback_front_4.png", "common/shakespeare_front.webp", 2, 2,
      ["thumbs_up", "celebrate", "encourage", "teach"], 480)
trim(f"{WR}/props/house_open.png", "common/house_open.webp", 620)
trim(f"{WR}/props/house_closed.png", "common/house_closed.webp", 620)

# ---- Word Run
background(f"{WR}/backgrounds/running_street_clean.png", "wordrun/street.webp", 1100)
background(f"{WR}/backgrounds/crossing_clean.png", "wordrun/crossing.webp", 1100)
background(f"{WR}/backgrounds/home_arrival_clean.png", "wordrun/home.webp", 1100)
sheet(f"{WR}/characters/shakespeare_run_rear_6.png", "wordrun/run.webp", 3, 2,
      ["contact_l", "down_l", "pass_l", "contact_r", "down_r", "pass_r"], 440)
sheet(f"{WR}/characters/shakespeare_game_states_rear_8.png", "wordrun/states.webp", 4, 2,
      ["idle", "think", "cross", "lean_l", "lean_r", "stumble", "flying", "enter"], 440)
sheet(f"{WR}/effects/game_effects_6.png", "wordrun/effects.webp", 3, 2,
      ["coin_sparkle", "speed", "gold_sparkle", "impact", "stars", "dust"], 300, min_area=8)
trim(f"{WR}/props/car_blue_side.png", "wordrun/car_blue.webp", 640)
trim(f"{WR}/props/car_red_side.png", "wordrun/car_red.webp", 640)
trim(f"{WR}/props/coin_blank_gold.png", "wordrun/coin.webp", 300)
trim(f"{WR}/props/traffic_light_red.png", "wordrun/light_red.webp", 720)
trim(f"{WR}/props/traffic_light_green.png", "wordrun/light_green.webp", 720)

# ---- Penalty Kicks
background(f"{PK}/backgrounds/stadium_blurred.png", "penalty/stadium_blur.webp", 1400, 70)
background(f"{PK}/backgrounds/stadium_clean.png", "penalty/stadium.webp", 1536, 78)
KICK = ["ready", "run_up", "backswing", "follow", "celebrate", "sad"]
for i in range(1, 8):
    sheet(f"{PK}/characters/kickers/player_0{i}_kick_poses.png", f"penalty/kicker{i}.webp", 3, 2, KICK, 420)
sheet(f"{PK}/characters/kickers/seven_kickers_front_lineup.png", "penalty/lineup.webp", 7, 1,
      [f"p{i}" for i in range(1, 8)], 420)
KEEP = ["ready", "dive_l", "dive_r", "catch_l", "catch_r", "sad"]
for i, name in enumerate(["keeper_01_shakespeare_poses", "keeper_02_poses", "keeper_03_poses", "keeper_04_poses"], 1):
    sheet(f"{PK}/characters/goalkeepers/{name}.png", f"penalty/keeper{i}.webp", 3, 2, KEEP, 380)
trim(f"{PK}/props/football.png", "penalty/ball.webp", 200)
trim(f"{PK}/props/goal_and_net.png", "penalty/goal.webp", 1024, 78)
trim(f"{PK}/props/referee_whistle.png", "penalty/whistle.webp", 260)
sheet(f"{PK}/effects/football_effects_6.png", "penalty/effects.webp", 3, 2,
      ["trail", "sparkle", "puff", "grass", "waves", "ripple"], 300, min_area=8)

# ---- Word Ninja
background(f"{WN}/backgrounds/arena_landscape.png", "ninja/arena_wide.webp", 1400, 74)
background(f"{WN}/backgrounds/arena_portrait.png", "ninja/arena_tall.webp", 1100, 74)
for f in sorted(os.listdir(f"{WN}/targets")):
    if f.endswith(".png") and not f.startswith("fruit_halves"):
        trim(f"{WN}/targets/{f}", f"ninja/t_{f[:-4]}.webp", 360)
sheet(f"{WN}/targets/fruit_halves_a.png", "ninja/halves_a.webp", 3, 2,
      ["apple_l", "watermelon_l", "orange_l", "apple_r", "watermelon_r", "orange_r"], 300)
sheet(f"{WN}/targets/fruit_halves_b.png", "ninja/halves_b.webp", 3, 2,
      ["banana_l", "strawberry_l", "lemon_l", "banana_r", "strawberry_r", "lemon_r"], 300)
sheet(f"{WN}/effects/feedback_effects_6.png", "ninja/effects.webp", 3, 2,
      ["swipe", "reward", "ripple", "celebration", "tap_puff", "juice"], 300, min_area=8)
sheet(f"{WN}/effects/gentle_glove_poses_3.png", "ninja/glove.webp", 3, 1, ["approach", "tap", "retract"], 300)

js = "/* Generated by the art build script from the three art packs: picture sizes and atlas frames [x, y, w, h]. */\n"
js += "window.ARCADE_SPRITES = " + json.dumps(META, separators=(",", ":")) + ";\n"
with open(os.path.join(OUT, "sprites.js"), "w", encoding="utf-8") as f:
    f.write(js)
print("\n".join(REPORT))
print("total KB", sum(os.path.getsize(os.path.join(dp, fn)) for dp, _, fns in os.walk(OUT) for fn in fns) // 1024)

# ---- Games page card pictures: crops of the scene references (their baked-in labels cut away)
def card(src, rel, box):
    im = Image.open(src).convert("RGB").crop(box).resize((480, 320), Image.LANCZOS)
    save(im, rel, 80)

card(f"{WR}/scenes/01_running_collecting.png", "cards/wordrun.webp", (0, 600, 1024, 1283))
card(f"{PK}/scenes/06_correct_goal.png", "cards/penalty.webp", (130, 174, 1406, 1024))
card(f"{WN}/scenes/03_correct_nonliving_slice.png", "cards/ninja.webp", (120, 150, 1416, 1014))
print("\n".join(REPORT[-3:]))
