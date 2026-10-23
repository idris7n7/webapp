"""Cuts the head, beard and white collar of Shakespeare out of static/shakespeare/game_run.webp.

The runner of the dragon game is a puppet (static/shakespeare_puppet.js): its body, arms and legs are drawn in code, and this
picture is the head that sits on top. Everything below the collar (the black doublet and the shoulders) is removed, so the head
can turn and nod without carrying a piece of the old body along.   Run:  python tools/make_runner_head.py   (needs pillow)
Writes static/shakespeare/run_head.webp (275 x 335 px; the neck joint is at x 142, y 285).
"""
import os

from PIL import Image, ImageFilter

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(APP, "static", "shakespeare", "game_run.webp")
OUT = os.path.join(APP, "static", "shakespeare", "run_head.webp")
BOX = (135, 0, 410, 335)  # left, top, right, bottom in game_run.webp
HEAD_BOTTOM = 252  # everything above this row is head or hair; below it only the collar and the neck are kept

im = Image.open(SRC).convert("RGBA").crop(BOX)
px = im.load()
w, h = im.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0 or y < HEAD_BOTTOM:
            continue
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        spread = max(r, g, b) - min(r, g, b)
        skin = r > 150 and r > g > b and r - b > 35
        if skin:
            continue
        if spread < 55 and lum > 120:  # linen: white and grey, soft towards the dark cloth
            px[x, y] = (r, g, b, int(a * min(1.0, (lum - 120) / 80)))
        else:
            px[x, y] = (r, g, b, 0)
# the waving hand of the picture reaches into the left edge of the crop: skin-coloured pixels out there are not the face
for y in range(160, h):
    for x in range(0, 26):
        r, g, b, a = px[x, y]
        if a and r > 170 and g > 120 and r - b > 50:
            px[x, y] = (r, g, b, 0)
# a one-pixel clean-up of stray specks, then trim to what is left
alpha = im.getchannel("A").filter(ImageFilter.MedianFilter(3))
im.putalpha(alpha)
im.save(OUT, "WEBP", quality=90, method=6)
print("wrote", OUT, im.size, "bbox", im.getchannel("A").getbbox())
