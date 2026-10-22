"""Writes static/millionaire_data.js: the hand-written grammar questions for the "Millioner" game.

Each question has exactly four options, one right answer and a one-line Uzbek explanation that is shown after the
answer. Tier 1 = easy (questions 1-5), 2 = medium (6-10), 3 = harder (11-15). Everything comes from the Week 1-2
grammar books (plural, a/an, to be, adjectives, have/has, questions, negatives, pronouns, possessives, wh-questions).
Vocabulary questions are generated in the browser from the flashcards, so they follow each student's word memory.
Run:  python build_millionaire_bank.py
"""
import json
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "millionaire_data.js")

BANK = []


def q(tier, text, options, answer, why):
    BANK.append({"t": tier, "q": text, "o": options, "a": answer, "why": why})


# ----------------------------------------------------------------- tier 1
q(1, "I ___ a student.", ["am", "is", "are", "be"], "am", "I olmoshi bilan AM ishlatiladi: I am.")
q(1, "She ___ a nurse.", ["am", "is", "are", "be"], "is", "He, she, it bilan IS ishlatiladi.")
q(1, "They ___ teachers.", ["is", "am", "are", "be"], "are", "We, you, they bilan ARE ishlatiladi.")
q(1, "I have ___ apple.", ["a", "an", "two", "many"], "an", "Apple unli tovush bilan boshlanadi, shuning uchun AN.")
q(1, "What is the plural of 'book'?", ["books", "bookes", "bookies", "bookis"], "books", "Oddiy otga -s qo'shiladi: book - books.")
q(1, "What is the plural of 'watch'?", ["watchs", "watches", "watchies", "watchis"], "watches", "-ch bilan tugagan otga -es qo'shiladi.")
q(1, "He ___ a new phone.", ["have", "has", "haves", "having"], "has", "He, she, it bilan HAS ishlatiladi.")
q(1, "We ___ five apples.", ["has", "have", "are", "is"], "have", "I, we, you, they bilan HAVE ishlatiladi.")
q(1, "___ you a student?", ["Are", "Is", "Am", "Do"], "Are", "Savolda ARE gap boshiga o'tadi: Are you a student?")
q(1, "I am ___.", ["happy", "a happy", "an happy", "the happy"], "happy", "Sifatdan oldin a/an qo'yilmaydi: I am happy.")
q(1, "He is ___ engineer.", ["a", "an", "are", "is"], "an", "Engineer unli tovush bilan boshlanadi, shuning uchun AN.")
q(1, "It ___ a cat.", ["am", "is", "are", "be"], "is", "It bilan IS ishlatiladi.")
q(1, "My name ___ Alex.", ["am", "is", "are", "be"], "is", "My name - bitta narsa, shuning uchun IS: My name is Alex.")
q(1, "What is the plural of 'child'?", ["childs", "children", "childes", "childrens"], "children", "Child - children: bu qoidaga bo'ysunmaydigan ko'plik.")
q(1, "What is the plural of 'baby'?", ["babys", "babyes", "babies", "babyies"], "babies", "Undoshdan keyin turgan Y -ies ga aylanadi: baby - babies.")
q(1, "We ___ friends.", ["is", "am", "are", "be"], "are", "We bilan ARE ishlatiladi.")

# ----------------------------------------------------------------- tier 2
q(2, "___ he a teacher?", ["Is", "Are", "Am", "Does"], "Is", "He bilan savolda IS gap boshiga o'tadi.")
q(2, "Is she happy? - Yes, she ___.", ["is", "are", "am", "does"], "is", "Qisqa javobda ham IS ishlatiladi: Yes, she is.")
q(2, "Are they students? - No, they ___.", ["aren't", "isn't", "amn't", "don't"], "aren't", "They bilan: No, they aren't (are not).")
q(2, "She ___ not hungry.", ["am", "is", "are", "do"], "is", "Inkorda NOT am/is/are dan keyin turadi: She is not hungry.")
q(2, "I ___ not tired.", ["am", "is", "are", "be"], "am", "I bilan AM: I am not tired.")
q(2, "He is ___ honest man.", ["a", "an", "the", "two"], "an", "Honest 'onist' deb o'qiladi, unli tovush bilan boshlanadi: AN.")
q(2, "She is ___ beautiful girl.", ["a", "an", "are", "is"], "a", "Beautiful undosh tovush bilan boshlanadi: A.")
q(2, "They are friendly ___.", ["people", "persons", "person", "peoples"], "people", "Person ko'pligi - people.")
q(2, "Laylo is a nurse. ___ is kind.", ["He", "She", "It", "They"], "She", "Laylo - ayol, shuning uchun SHE.")
q(2, "A dog is clever. ___ is big.", ["He", "She", "It", "We"], "It", "Hayvon va narsalar uchun IT ishlatiladi.")
q(2, "Kate and Susan are teachers. ___ are kind.", ["He", "She", "It", "They"], "They", "Ikki kishi (ko'plik) - THEY.")
q(2, "___ name is Alex. (I)", ["My", "Me", "I", "Mine"], "My", "I ning egalik shakli - MY.")
q(2, "This is Abror. ___ car is new. (he)", ["His", "He", "Her", "Him"], "His", "He ning egalik shakli - HIS.")
q(2, "How ___ you? - I am fine.", ["is", "am", "are", "be"], "are", "How are you? - You bilan ARE.")
q(2, "What ___ your name?", ["am", "is", "are", "be"], "is", "What is your name? - Name bitta, shuning uchun IS.")
q(2, "Choose the correct sentence.", ["I not am happy.", "I am not happy.", "I no am happy.", "I am no happy."], "I am not happy.", "NOT am/is/are dan keyin turadi.")
q(2, "What is the plural of 'city'?", ["citys", "cities", "cityes", "citees"], "cities", "Undoshdan keyin Y - ies: city - cities.")
q(2, "I have two ___.", ["watch", "watchs", "watches", "watchies"], "watches", "Ikkita - ko'plik: watch - watches.")

# ----------------------------------------------------------------- tier 3
q(3, "Which question is correct?", ["Where he is?", "Where is he?", "Where are he?", "Is where he?"], "Where is he?", "So'roq so'z gap boshiga, IS esa undan keyin: Where is he?")
q(3, "Which question is correct?", ["How old he is?", "How old is he?", "How is old he?", "How he old is?"], "How old is he?", "How old + is + he: so'roq so'z, keyin IS, keyin ega.")
q(3, "Michael and I ___ friends.", ["is", "am", "are", "be"], "are", "Michael and I = we, shuning uchun ARE.")
q(3, "You and your children ___ in New York.", ["is", "am", "are", "be"], "are", "You and your children = you (ko'plik) - ARE.")
q(3, "Doctors ___ kind.", ["is", "are", "am", "be"], "are", "Doctors ko'plik (= they), shuning uchun ARE.")
q(3, "Which pronoun replaces 'My friend and I'?", ["we", "they", "you", "he"], "we", "Men va do'stim = biz = WE.")
q(3, "Which pronoun replaces 'a laptop'?", ["he", "she", "it", "they"], "it", "Narsa uchun IT ishlatiladi.")
q(3, "Which pronoun replaces 'You and your friends'?", ["we", "you", "they", "she"], "you", "You and your friends = sizlar = YOU.")
q(3, "___ car is new. (they)", ["Their", "They", "Them", "There"], "Their", "They ning egalik shakli - THEIR.")
q(3, "Which possessive adjective is for 'it'?", ["its", "it's", "his", "her"], "its", "It ning egalik shakli - ITS (it's = it is).")
q(3, "Which sentence is correct?", ["They are a friendly people.", "They are friendly people.", "They are friendly persons.", "They is friendly people."], "They are friendly people.", "Ko'plikda A/AN yo'q va person - people.")
q(3, "Which sentence is correct?", ["He is a honest man.", "He is an honest man.", "He is honest a man.", "He an is honest man."], "He is an honest man.", "Honest unli tovush bilan boshlanadi - AN honest.")
q(3, "Which question is correct?", ["Is you an office worker?", "Are you an office worker?", "You are an office worker?", "Do you an office worker?"], "Are you an office worker?", "You bilan ARE gap boshiga o'tadi.")
q(3, "Are you a driver? - No, ___.", ["I am not", "I not am", "I amn't", "I don't"], "I am not", "I am not (yoki I'm not) - amn't deyilmaydi.")
q(3, "One woman, two ___.", ["womans", "womens", "women", "womanes"], "women", "Woman - women: qoidaga bo'ysunmaydigan ko'plik.")
q(3, "How ___ is your car? - It is super fast.", ["fast", "faster", "fastly", "speed"], "fast", "How + sifat: How fast is your car?")
q(3, "Which sentence is correct?", ["She have a dog.", "She has a dog.", "She haves a dog.", "She is have a dog."], "She has a dog.", "She bilan HAS ishlatiladi.")
q(3, "What is 12 + 12? - ___ is 24.", ["He", "She", "It", "They"], "It", "Javob (raqam, narsa) uchun IT ishlatiladi.")


def validate():
    for i, b in enumerate(BANK):
        assert len(b["o"]) == 4 and len(set(b["o"])) == 4, (i, b)
        assert b["a"] in b["o"], (i, b)
        assert b["t"] in (1, 2, 3) and b["why"].strip(), (i, b)
    assert len({b["q"] + "|" + b["a"] for b in BANK}) == len(BANK), "duplicate question"


validate()
tiers = {t: sum(1 for b in BANK if b["t"] == t) for t in (1, 2, 3)}
text = ("// Hand-written grammar questions for the Millioner game (build_millionaire_bank.py). t = tier, o = options, a = answer.\n"
        "const MILLIONAIRE_GRAMMAR = " + json.dumps(BANK, ensure_ascii=False, indent=1) + ";\n")
with open(OUT, "w", encoding="utf-8", newline="") as f:
    f.write(text)
print("questions:", len(BANK), tiers)
