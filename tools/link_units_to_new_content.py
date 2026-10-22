"""Points the "O'rganish" topics (static/units_data.js) at the new exercise ids and the grammar book page images.

Run after build_new_exercises.py and the book extraction (static/img/grammar/*.webp).
"""
import json
import os

STATIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
PATH = os.path.join(STATIC, "units_data.js")


def pages(week, first, last):
    return [f"/static/img/grammar/w{week}_p{n:02d}.webp" for n in range(first, last + 1)]


TOPICS = {
    "sec1_top1": ([f"g1_plural_{i}" for i in range(1, 6)], pages(1, 1, 1)),
    "sec1_top2": ([f"g1_artA_{i}" for i in range(1, 4)], pages(1, 2, 4)),
    "sec2_top3": ([f"g1_tobe_{i}" for i in range(1, 5)], pages(1, 5, 6)),
    "sec2_top4": ([f"g1_noun_{i}" for i in range(1, 4)], pages(1, 7, 8)),
    "sec2_top5": ([f"g1_adj_{i}" for i in range(1, 6)], pages(1, 9, 11)),
    "sec2_top6": ([f"g1_have_{i}" for i in range(1, 4)], pages(1, 12, 13)),
    "sec3_top1": ([f"g2_quest_{i}" for i in range(1, 6)], pages(2, 1, 3)),
    "sec3_top2": ([f"g2_neg_{i}" for i in range(1, 4)], pages(2, 4, 5)),
    "sec4_top3": ([f"g2_pron_{i}" for i in range(1, 6)], pages(2, 6, 11)),
    "sec4_top4": ([f"g2_poss_{i}" for i in range(1, 5)], pages(2, 12, 13)),
    "sec4_top5": ([f"g2_wh_{i}" for i in range(1, 6)], pages(2, 14, 16)),
}

text = open(PATH, encoding="utf-8").read()
dec = json.JSONDecoder()


def split_const(src, name):
    head_end = src.index("[", src.index(name))
    data, length = dec.raw_decode(src[head_end:])
    return src[:head_end], data, head_end + length


head1, sections, end1 = split_const(text, "const FOUR_SECTIONS_DATA")
mid = text[end1:]
head2, units, end2 = split_const(mid, "const UNITS_DATA")
tail = mid[end2:]

touched = 0
for sec in sections:
    for t in sec["topics"]:
        ids, book = TOPICS[t["id"]]
        t["exerciseIds"] = ids
        t["bookPages"] = book
        touched += 1
for u in units:
    if u["id"] in TOPICS:
        u["exerciseIds"] = TOPICS[u["id"]][0]
        u["bookPages"] = TOPICS[u["id"]][1]

assert touched == len(TOPICS) == 11, touched
dump = lambda d: json.dumps(d, ensure_ascii=False, indent=2)
out = head1 + dump(sections) + head2 + dump(units) + tail
open(PATH, "w", encoding="utf-8", newline="").write(out)
print("topics linked:", touched, "| units entries:", sum(1 for u in units if u["id"] in TOPICS))
