"""Adds the book photo (`image`) to each flashcard in static/flashcards_data.js, and a big digit (`bigText`) to the number cards.

Run after the book extraction (static/img/books_manifest.json). Safe to run again.
"""
import json
import os

STATIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
PATH = os.path.join(STATIC, "flashcards_data.js")
manifest = json.load(open(os.path.join(STATIC, "img", "books_manifest.json"), encoding="utf-8"))["vocab"]

ONES = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11,
        "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19}
TENS = {"twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}


def to_int(word):
    if word == "one hundred":
        return 100
    if word in ONES:
        return ONES[word]
    if word in TENS:
        return TENS[word]
    tens, ones = word.split("-")
    return TENS[tens] + ONES[ones]


text = open(PATH, encoding="utf-8").read()
start = text.index("[")
cards, length = json.JSONDecoder().raw_decode(text[start:])
photos = digits = 0
for c in cards:
    c.pop("image", None)
    c.pop("bigText", None)
    if c["id"] in manifest:
        c["image"] = "/static/" + manifest[c["id"]]
        photos += 1
    elif c["unit"] == "2g":
        c["bigText"] = str(to_int(c["word"]))
        digits += 1
out = text[:start] + json.dumps(cards, ensure_ascii=False, indent=2) + text[start + length:]
open(PATH, "w", encoding="utf-8", newline="").write(out)
print(f"cards: {len(cards)} | with photo: {photos} | with big digit: {digits} | text only: {len(cards) - photos - digits}")
