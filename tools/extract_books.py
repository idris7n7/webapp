"""Extracts the grammar book pages and the vocabulary photos from the teacher's four PDFs.

The PDFs are not in the repository (copyrighted teaching material). Put them in ../books/ as
  WEEK 1 - Grammar.pdf, WEEK 1 - Vocabulary.pdf, WEEK 2 - Grammar.pdf, WEEK 2 - Vocabulary.pdf
and run:  python tools/extract_books.py        (needs: pip install pymupdf pillow)
It writes static/img/grammar/*.webp (the book pages, unchanged), static/img/vocab/*.webp (one photo per flashcard)
and static/img/books_manifest.json. Run tools/add_card_images.py afterwards to attach the photos to the flashcards.
"""
import io
import json
import os
import re

import pymupdf
from PIL import Image

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKS = os.path.join(os.path.dirname(APP), "books") + os.sep if not os.path.isdir(os.path.join(APP, "books")) else os.path.join(APP, "books") + os.sep
STATIC = os.path.join(APP, "static") + os.sep
os.makedirs(STATIC + "img" + os.sep + "vocab", exist_ok=True)
os.makedirs(STATIC + "img" + os.sep + "grammar", exist_ok=True)

js = open(STATIC + "flashcards_data.js", encoding="utf-8").read()
cards = json.JSONDecoder().raw_decode(js[js.index("["):])[0]
by_word = {}
for c in cards:
    by_word.setdefault(c["word"].strip().lower(), []).append(c)


def norm(t):
    return re.sub(r"\s+", " ", re.sub(r"^(a|an|the)\s+", "", t.strip().lower()))


norm_words = {}
for k, v in by_word.items():
    norm_words.setdefault(norm(k), []).extend(v)


def lookup(title):
    t = norm(title)
    return norm_words.get(t) or norm_words.get(t.replace(" \u2014 ", " - "))


def to_image(d, xref):
    pm = pymupdf.Pixmap(d, xref)
    if pm.n - pm.alpha >= 4:
        pm = pymupdf.Pixmap(pymupdf.csRGB, pm)
    if pm.alpha:
        return Image.open(io.BytesIO(pm.tobytes("png"))).convert("RGB")
    return Image.frombytes("RGB", (pm.width, pm.height), pm.samples)


manifest = {}
for wk in (1, 2):
    d = pymupdf.open(BOOKS + f"WEEK {wk} - Grammar.pdf")
    files = []
    for i, p in enumerate(d):
        pix = p.get_pixmap(dpi=130)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        name = f"img/grammar/w{wk}_p{i+1:02d}.webp"
        im.save(STATIC + name.replace("/", os.sep), "WEBP", quality=82, method=6)
        files.append(name)
    manifest[f"week{wk}"] = files

mapped = {}
for wk in (1, 2):
    d = pymupdf.open(BOOKS + f"WEEK {wk} - Vocabulary.pdf")
    for pno, p in enumerate(d):
        if pno == 0:
            continue
        infos = [i for i in p.get_image_info(xrefs=True) if (i["bbox"][2] - i["bbox"][0]) >= 40 and (i["bbox"][3] - i["bbox"][1]) >= 60]
        titles = []
        for b in p.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                t = "".join(s["text"] for s in l["spans"]).strip()
                sz = max(s["size"] for s in l["spans"])
                if t and 11 <= sz <= 16 and not t.startswith("/"):
                    titles.append((l["bbox"], t, sz))
        groups = {}
        for info in infos:
            x0, y0, x1, y1 = info["bbox"]
            cx = (x0 + x1) / 2
            cand = [(bb, t) for bb, t, sz in titles if -25 <= bb[1] - y1 <= 40 and bb[0] - 14 <= cx <= bb[0] + 175]
            if cand:
                bb, t = min(cand, key=lambda r: r[0][1])
                groups.setdefault((bb, t), []).append(info)
        for (bb, t), items in groups.items():
            c = lookup(t)
            if not c:
                continue
            c = next((x for x in c if x["week"] == wk), c[0])
            items.sort(key=lambda i: i["bbox"][0])
            ims = [to_image(d, i["xref"]) for i in items]
            if len(ims) > 1:  # two photos on one card (big - small): side by side
                h = min(im.height for im in ims)
                ims = [im.resize((int(im.width * h / im.height), h)) for im in ims]
                canvas = Image.new("RGB", (sum(im.width for im in ims), h))
                x = 0
                for im in ims:
                    canvas.paste(im, (x, 0))
                    x += im.width
                im = canvas
            else:
                im = ims[0]
            im.thumbnail((640, 480))
            rel = f"img/vocab/{c['id']}.webp"
            im.save(STATIC + rel.replace("/", os.sep), "WEBP", quality=74, method=6)
            mapped[c["id"]] = rel

with open(STATIC + "img" + os.sep + "books_manifest.json", "w", encoding="utf-8") as f:
    json.dump({"grammar": manifest, "vocab": mapped}, f, ensure_ascii=False, indent=1)
print(f"grammar pages: {sum(len(v) for v in manifest.values())} | vocabulary photos: {len(mapped)} of {len(cards)} words")
