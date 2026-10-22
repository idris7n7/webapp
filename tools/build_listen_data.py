"""Writes static/listen_data.js for "Listen and Survive": the missions and the glossary of words they teach.

The glossary words are the few new words the missions need (directions, camp, airport, detective, commands). They live in
the same shared vocabulary memory as the flashcard words (ids start with "ls_"), so a word missed in a mission shows up
in Word Race, and the flashcard words that were missed in Word Race are used inside the missions.
Run:  python build_listen_data.py
"""
import json
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "listen_data.js")

# word, meaning (uz), example (en), example (uz)
GLOSSARY = {
    "escape": [
        ("straight", "toʻgʻri, oldinga", "Go straight.", "Toʻgʻri yuring."),
        ("step", "qadam", "Take two steps.", "Ikki qadam tashlang."),
        ("turn", "burilmoq", "Turn left.", "Chapga buriling."),
        ("left", "chap", "Turn left at the door.", "Eshikda chapga buriling."),
        ("right", "oʻng", "Turn right.", "Oʻngga buriling."),
        ("stop", "toʻxtamoq", "Stop here!", "Shu yerda toʻxtang!"),
        ("exit", "chiqish joyi", "This is the exit.", "Mana chiqish joyi."),
    ],
    "camp": [
        ("tent", "chodir", "I sleep in a tent.", "Men chodirda uxlayman."),
        ("fire", "olov", "Make a fire.", "Olov yoqing."),
        ("map", "xarita", "Take the map.", "Xaritani oling."),
        ("rope", "arqon", "I have a rope.", "Menda arqon bor."),
        ("torch", "fonar", "Take the torch.", "Fonarni oling."),
        ("jacket", "kurtka", "I am cold. I take my jacket.", "Men sovuq qotdim. Kurtkamni olaman."),
        ("hungry", "och", "I am hungry.", "Men ochman."),
        ("thirsty", "chanqagan", "I am thirsty.", "Men chanqadim."),
        ("lost", "adashgan", "I am lost.", "Men adashdim."),
        ("rain", "yomgʻir", "The rain is cold.", "Yomgʻir sovuq."),
        ("dark", "qorongʻi", "It is dark.", "Qorongʻi."),
    ],
    "airport": [
        ("gate", "chiqish darvozasi (aeroportda)", "Go to gate twelve.", "Oʻn ikkinchi darvozaga boring."),
        ("flight", "reys", "My flight is at nine.", "Mening reysim soat toʻqqizda."),
        ("ticket", "chipta", "Here is my ticket.", "Mana mening chiptam."),
        ("passport", "pasport", "I have my passport.", "Menda pasportim bor."),
        ("boarding", "samolyotga chiqish", "Boarding is now open.", "Samolyotga chiqish boshlandi."),
        ("o'clock", "soat (aniq vaqt)", "It is six o'clock.", "Soat roppa-rosa olti."),
        ("leave", "jo'namoq, ketmoq", "The plane leaves at four.", "Samolyot toʻrtda uchadi."),
    ],
    "detective": [
        ("thief", "oʻgʻri", "The thief is a young man.", "Oʻgʻri yosh erkak."),
        ("witness", "guvoh", "The witness is a woman.", "Guvoh — ayol."),
        ("clue", "dalil, ishora", "This is a clue.", "Bu — dalil."),
        ("police", "politsiya", "Call the police.", "Politsiyaga qoʻngʻiroq qiling."),
    ],
    "timed": [
        ("open", "ochmoq", "Open the door.", "Eshikni oching."),
        ("close", "yopmoq", "Close the window.", "Derazani yoping."),
        ("door", "eshik", "Open the door.", "Eshikni oching."),
        ("window", "deraza", "Close the window.", "Derazani yoping."),
        ("light", "chiroq, yorugʻlik", "Switch on the light.", "Chiroqni yoqing."),
        ("switch on", "yoqmoq", "Switch on the light.", "Chiroqni yoqing."),
        ("take", "olmoq", "Take the key.", "Kalitni oling."),
        ("give", "bermoq", "Give me the bag.", "Menga sumkani bering."),
        ("sit down", "oʻtirmoq", "Sit down, please.", "Iltimos, oʻtiring."),
        ("stand up", "turmoq", "Stand up.", "Oʻrningizdan turing."),
        ("run", "yugurmoq", "Run!", "Yuguring!"),
        ("call", "qoʻngʻiroq qilmoq", "Call me.", "Menga qoʻngʻiroq qiling."),
    ],
}

MISSIONS = [
    {"id": "escape", "n": 1, "icon": "🏢", "title": "Escape the Building", "uz": "Binodan chiqing",
     "story": "Binoda yong'in signali yangradi! Ovozli ko'rsatmalarni tinglang va to'g'ri yo'ldan yurib, chiqish joyiga yeting.",
     "skills": "yo'nalishlar · sonlar · burilishlar", "steps": 5},
    {"id": "camp", "n": 2, "icon": "⛺", "title": "Survival Camp", "uz": "Omon qolish lageri",
     "story": "Siz o'rmonda lagerdasiz. Ehtiyojingizga qarab to'g'ri narsalarni oling: suv, ovqat, boshpana va xavfsizlik.",
     "skills": "buyumlar · ehtiyojlar · ketma-ketlik", "steps": 5},
    {"id": "airport", "n": 3, "icon": "✈️", "title": "The Airport", "uz": "Aeroport",
     "story": "Reysingizni o'tkazib yubormang! E'lonlarni tinglang: darvoza raqami, mamlakat, vaqt, ism va telefon raqami.",
     "skills": "sonlar · davlatlar · vaqt · harflab aytish", "steps": 5},
    {"id": "detective", "n": 4, "icon": "🕵️", "title": "The Detective", "uz": "Detektiv",
     "story": "O'g'ri qochib ketdi! Guvohlarning gaplarini tinglang va gumondorlar orasidan o'g'rini toping.",
     "skills": "tavsif · His / has · kayfiyat", "steps": 4},
    {"id": "timed", "n": 5, "icon": "⏱️", "title": "The Timed Mission", "uz": "Vaqtli missiya",
     "story": "Vaqt tugayapti! Ketma-ket berilgan ko'rsatmalarni eshiting va ularni to'g'ri tartibda bajaring.",
     "skills": "buyruqlar · tezlik · xotira", "steps": 5},
]


def build():
    glossary, seen = [], set()
    for mission, rows in GLOSSARY.items():
        for word, uz, ex, ex_uz in rows:
            wid = "ls_" + word.replace("'", "").replace(" ", "_")
            assert wid not in seen, wid
            seen.add(wid)
            glossary.append({"id": wid, "word": word, "meaning_uz": uz, "example_en": ex, "example_uz": ex_uz,
                             "unit": "LS", "week": 3, "category": "Listen and Survive", "mission": mission})
    return glossary


glossary = build()
for m in MISSIONS:
    m["words"] = [g["id"] for g in glossary if g["mission"] == m["id"]]
text = ("// Listen and Survive: the missions and the glossary of new words (build_listen_data.py).\n"
        "const LISTEN_GLOSSARY = " + json.dumps(glossary, ensure_ascii=False, indent=1) + ";\n\n"
        "const LISTEN_MISSIONS = " + json.dumps(MISSIONS, ensure_ascii=False, indent=1) + ";\n")
with open(OUT, "w", encoding="utf-8", newline="") as f:
    f.write(text)
print("glossary words:", len(glossary), "| missions:", len(MISSIONS))
