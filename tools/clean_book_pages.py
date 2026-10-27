"""Makes the grammar book pages look like app pages: static/img/grammar/*.webp -> static/img/grammar_app/*.webp.

A lesson shows the teacher's grammar book page by page (bookPages in static/units_data.js). The pages still carry the
signs of a printed book: the running header at the top ("BIRINCHI HAFTA . NOANIQ ARTIKLI"), the page number at the
bottom and the coloured thumb tab on the outer edge. This cuts those three away and leaves the lesson itself as it is:

  top     below the thin running header (a week's first page has its big week banner there instead, which stays)
  bottom  above the page number
  sides   a narrow strip on both edges, where the thumb tab sits

The bands are found on each page (rows that hold ink), so a page with a slightly different layout is cut correctly too.
The lesson reader (static/app_main.js) shows the cleaned copy and falls back to the original when it is missing.

    python tools/clean_book_pages.py
"""
import glob
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "static", "img", "grammar")
OUT = os.path.join(HERE, "..", "static", "img", "grammar_app")
SIDE = 0.035  # the thumb tab lies within the outer 3 % of the width
GAP = 0.012  # air left between a cut and the nearest ink


def ink_bands(img: Image.Image) -> list:
    """(start, end) row fractions of the runs of rows that hold ink, between the side strips."""
    a = np.asarray(img.convert("L")).astype(int)
    h, w = a.shape
    body = a[:, int(w * 0.05):int(w * 0.95)]
    bg = int(np.median(a[:, w // 2]))
    rows = (np.abs(body - bg) > 40).mean(axis=1) > 0.002
    bands, start = [], None
    for y, on in enumerate(rows):
        if on and start is None:
            start = y
        elif not on and start is not None:
            bands.append((start / h, y / h))
            start = None
    if start is not None:
        bands.append((start / h, 1.0))
    return bands


def crop_box(img: Image.Image) -> tuple:
    w, h = img.size
    bands = ink_bands(img)
    top, bottom = 0.0, 1.0
    # running header: a thin line of small capitals in the top 8 %
    if len(bands) > 1 and bands[0][0] > 0.02 and bands[0][1] < 0.08 and bands[0][1] - bands[0][0] < 0.015:
        top = min(bands[0][1] + GAP, bands[1][0] - GAP)
    # page number: a small round badge in the bottom 9 %
    if len(bands) > 1 and bands[-1][0] > 0.91 and bands[-1][1] - bands[-1][0] < 0.05:
        bottom = max(bands[-1][0] - GAP, bands[-2][1] + GAP)
    return (round(w * SIDE), round(h * top), round(w * (1 - SIDE)), round(h * bottom))


def main():
    os.makedirs(OUT, exist_ok=True)
    pages = sorted(glob.glob(os.path.join(SRC, "*.webp")))
    for path in pages:
        img = Image.open(path).convert("RGB")
        box = crop_box(img)
        img.crop(box).save(os.path.join(OUT, os.path.basename(path)), "WEBP", quality=90, method=6)
        print(os.path.basename(path), img.size, "->", box)
    print(f"{len(pages)} pages written to {os.path.relpath(OUT)}")


if __name__ == "__main__":
    main()
