"""Appends dark-theme overrides for the Tailwind colour utilities that app_theme.css does not cover yet.

Pale backgrounds (-50/-100, with or without /opacity) become soft tints of the colour, dark text shades (-600..-900)
become light tints, pale borders become translucent. Only classes without an existing dark rule are generated, and the
block is replaced (not duplicated) when the script runs again.
"""
import os
import re

STATIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
PATH = os.path.join(STATIC, "app_theme.css")
BEGIN, END = "/* >>> generated dark overrides (gen_dark_overrides.py) */", "/* <<< generated dark overrides */"

# family: (light text tint, "r,g,b" of the 500 shade)
FAMILIES = {
    "orange": ("#fdba74", "249,115,22"), "yellow": ("#fde047", "234,179,8"), "lime": ("#bef264", "132,204,22"),
    "green": ("#86efac", "34,197,94"), "teal": ("#5eead4", "20,184,166"), "cyan": ("#67e8f9", "6,182,212"),
    "sky": ("#7dd3fc", "14,165,233"), "blue": ("#93c5fd", "59,130,246"), "violet": ("#c4b5fd", "139,92,246"),
    "purple": ("#d8b4fe", "168,85,247"), "fuchsia": ("#f0abfc", "217,70,239"), "pink": ("#f9a8d4", "236,72,153"),
    "red": ("#fca5a5", "239,68,68"), "rose": ("#fda4b4", "244,63,94"), "amber": ("#ffc46b", "255,159,28"),
    "emerald": ("#6ee7a1", "34,197,94"), "indigo": ("#9dbcff", "95,147,255"),
}
ALPHAS = ["", "/20", "/30", "/40", "/50", "/60", "/70", "/80", "/90"]


def esc(token):
    return token.replace(":", r"\:").replace("/", r"\/")


css = open(PATH, encoding="utf-8").read()
css = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?", "", css, flags=re.S)
existing = "\n".join(l for l in css.splitlines() if 'data-theme="dark"' in l)


SOURCES = "\n".join(
    open(os.path.join(STATIC, n), encoding="utf-8").read()
    for n in os.listdir(STATIC)
    if (n.endswith(".js") or n == "index.html") and ".bak" not in n and "_data" not in n
)


def covered(token):
    """True when a dark rule exists already, or when the app never uses the class (keeps the stylesheet small)."""
    bare = token.split(":")[-1]
    return esc(token) in existing or token in existing or bare not in SOURCES


rules = []


def add(selectors, decl):
    sel = [s for s in selectors if not covered(s[1])]
    if sel:
        rules.append(", ".join(f'html[data-theme="dark"] {s[0]}' for s in sel) + f" {{ {decl} }}")


for fam, (tint, rgb) in FAMILIES.items():
    for shade in ("50", "100"):
        for a in ALPHAS:
            tok = f"bg-{fam}-{shade}{a}"
            add([(f".{esc(tok)}", tok), (f".{esc('hover:' + tok)}:hover", "hover:" + tok)],
                f"background-color: rgba({rgb}, .{'14' if shade == '50' else '2'}) !important;")
    for shade in ("500", "600", "700", "800", "900", "950"):
        for a in ("", "/80"):
            tok = f"text-{fam}-{shade}{a}"
            add([(f".{esc(tok)}", tok), (f".{esc('hover:' + tok)}:hover", "hover:" + tok)], f"color: {tint} !important;")
    for shade in ("100", "200", "300"):
        for a in ("", "/80"):
            tok = f"border-{fam}-{shade}{a}"
            add([(f".{esc(tok)}", tok)], f"border-color: rgba({rgb}, .38) !important;")
    # gradients: pale stops become dark tints
    for pre in ("from", "via", "to"):
        for shade in ("50", "100"):
            for a in ALPHAS:
                tok = f"{pre}-{fam}-{shade}{a}"
                if covered(tok):
                    continue
                tint16 = f"rgba({rgb}, .16)"
                if pre == "via":  # Tailwind v3 builds the stop list inside the via utility itself
                    body = f"--tw-gradient-stops: var(--tw-gradient-from), {tint16} var(--tw-gradient-via-position), var(--tw-gradient-to, rgba(22,34,57,0)) !important;"
                elif pre == "from":
                    body = (f"--tw-gradient-from: {tint16} var(--tw-gradient-from-position) !important; "
                            "--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(22,34,57,0)) !important;")
                else:
                    body = f"--tw-gradient-to: {tint16} var(--tw-gradient-to-position) !important;"
                rules.append(f'html[data-theme="dark"] .{esc(tok)} {{ {body} }}')

block = BEGIN + "\n" + "\n".join(rules) + "\n" + END + "\n"
open(PATH, "w", encoding="utf-8", newline="").write(css.rstrip("\n") + "\n\n" + block)
print("generated rules:", len(rules))
