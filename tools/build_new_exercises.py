"""Builds the Week 1-2 exercise bank from the grammar books and the flashcards.

Grammar exercises are written by hand (topic by topic: harder topics get more exercises); vocabulary
exercises are generated from static/flashcards_data.js. Output:
  - exercises_data.json   (server-side grading)
  - the INITIAL_WORKBOOK_DATA constant inside static/index.html (offline fallback)
Run:  python build_new_exercises.py
"""
import json
import os
import random
import re

BASE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(BASE)
STATIC = os.path.join(APP, "static")
rng = random.Random(20261022)


# ----------------------------------------------------------------------------- helpers
def num(items):
    return [dict(q=f"{i}. {q}", **rest) for i, (q, rest) in enumerate(items, 1)]


def mcq(q, options, a):
    assert a in options, (q, options, a)
    assert len(set(options)) == len(options), (q, options)
    return (q, {"options": options, "a": a})


def typed(q, a):
    return (q, {"a": a})


def shuffled(options):
    options = list(options)
    rng.shuffle(options)
    return options


def ex(ex_id, category, week, part, number, title, inst_en, inst_uz, items):
    return {
        "id": ex_id, "category": category, "week": week, "part": part, "number": number,
        "title": f"Ex {number}: {title}", "instruction_en": inst_en, "instruction_uz": inst_uz,
        "questions": num(items),
    }


GRAMMAR = []


def add(topic_id, week, part, title, inst_en, inst_uz, items, category="grammar"):
    n = sum(1 for e in GRAMMAR if e["part"] == part) + 1
    GRAMMAR.append(ex(f"{topic_id}_{n}", category, week, part, n, title, inst_en, inst_uz, items))


def ch(*opts):
    return list(opts)


W1, W2 = "Week 1", "Week 2"

# ============================================================================ WEEK 1
# ---- 1. Plural (harder topic: 5 exercises)
P = "Part 1 · Birlik va koʻplik (Plural nouns)"
add("g1_plural", W1, P, "Write the plural (-s)", "Write the plural form.", "Koʻplik shaklini yozing (oddiy -s).",
    [typed(f"{w} →", p) for w, p in [("pen", "pens"), ("book", "books"), ("car", "cars"), ("cat", "cats"),
     ("phone", "phones"), ("bag", "bags"), ("key", "keys"), ("student", "students"), ("apple", "apples"), ("bottle", "bottles")]])
add("g1_plural", W1, P, "Write the plural (-es)", "Add -es. Write the plural form.", "Soʻzlar -s, -x, -ch, -sh bilan tugasa, -es qoʻshiladi. Koʻplik shaklini yozing.",
    [typed(f"{w} →", p) for w, p in [("watch", "watches"), ("glass", "glasses"), ("dish", "dishes"), ("box", "boxes"),
     ("bus", "buses"), ("class", "classes"), ("sandwich", "sandwiches"), ("brush", "brushes")]])
add("g1_plural", W1, P, "Consonant + y → -ies", "Choose the correct plural.", "Toʻgʻri koʻplik shaklini tanlang (undoshdan keyin y turgan soʻzlar -ies boʻladi).",
    [mcq(f"{w} →", shuffled(opts), a) for w, opts, a in [
        ("country", ["countrys", "countries", "countryes"], "countries"),
        ("baby", ["babys", "babies", "babyes"], "babies"),
        ("city", ["citys", "cities", "cityes"], "cities"),
        ("family", ["familys", "families", "familyes"], "families"),
        ("story", ["storys", "stories", "storyes"], "stories"),
        ("lady", ["ladys", "ladies", "ladyes"], "ladies"),
        ("party", ["partys", "parties", "partyes"], "parties"),
        ("body", ["bodys", "bodies", "bodyes"], "bodies")]])
add("g1_plural", W1, P, "-s, -es or -ies?", "Which ending do we add?", "Qaysi qoʻshimcha qoʻshiladi: -s, -es yoki -ies?",
    [mcq(f"{w} + ?", ["-s", "-es", "-ies"], a) for w, a in [
        ("book", "-s"), ("watch", "-es"), ("country", "-ies"), ("dish", "-es"), ("baby", "-ies"),
        ("glass", "-es"), ("pen", "-s"), ("city", "-ies"), ("box", "-es"), ("phone", "-s")]])
add("g1_plural", W1, P, "Irregular plurals", "Write the plural form. Some nouns are irregular.", "Koʻplik shaklini yozing. Ba'zi otlar qoidaga boʻysunmaydi: man, woman, child, person.",
    [typed(q, a) for q, a in [
        ("man →", "men"), ("woman →", "women"), ("child →", "children"), ("person →", "people"),
        ("one child, two ___", "children"), ("one woman, three ___", "women"), ("one man, four ___", "men"),
        ("one person, many ___", "people"), ("baby →", "babies"), ("watch →", "watches")]])

# ---- 2. A / An (easier: 3 exercises)
P = "Part 2 · Noaniq artikl (A and An)"
add("g1_artA", W1, P, "A or an?", "Choose a or an.", "A yoki an ni tanlang.",
    [mcq(f"___ {w}", ["a", "an"], a) for w, a in [
        ("dog", "a"), ("apple", "an"), ("egg", "an"), ("cat", "a"), ("orange", "an"),
        ("waiter", "a"), ("engineer", "an"), ("book", "a"), ("umbrella", "an"), ("teacher", "a")]])
add("g1_artA", W1, P, "Sounds, not letters", "Choose a or an. Listen to the first sound.", "Birinchi harf emas, birinchi tovushga qarang: a university, an hour.",
    [mcq(f"___ {w}", ["a", "an"], a) for w, a in [
        ("university", "a"), ("hour", "an"), ("uniform", "a"), ("honest man", "an"),
        ("actor", "an"), ("banana", "a"), ("artist", "an"), ("office worker", "an")]])
add("g1_artA", W1, P, "Complete the sentence", "Write a or an.", "Boʻsh joyga a yoki an ni yozing.",
    [typed(q, a) for q, a in [
        ("She is ___ nurse.", "a"), ("He is ___ actor.", "an"), ("It is ___ egg.", "an"), ("I have ___ phone.", "a"),
        ("He is ___ engineer.", "an"), ("This is ___ umbrella.", "an"), ("She is ___ police officer.", "a"), ("It is ___ orange.", "an")]])

# ---- 3. To be (medium: 4 exercises)
P = "Part 3 · To be: am, is, are"
add("g1_tobe", W1, P, "Am, is or are?", "Choose am, is or are.", "Am, is yoki are ni tanlang.",
    [mcq(q, ["am", "is", "are"], a) for q, a in [
        ("I ___ a student.", "am"), ("He ___ a teacher.", "is"), ("She ___ a nurse.", "is"), ("It ___ a cat.", "is"),
        ("We ___ friends.", "are"), ("You ___ a waiter.", "are"), ("They ___ students.", "are"), ("I ___ an engineer.", "am"),
        ("She ___ a driver.", "is"), ("We ___ teachers.", "are")]])
add("g1_tobe", W1, P, "Write am, is or are", "Write am, is or are.", "Boʻsh joyga am, is yoki are ni yozing.",
    [typed(q, a) for q, a in [
        ("I ___ a doctor.", "am"), ("They ___ police officers.", "are"), ("He ___ an actor.", "is"), ("We ___ students.", "are"),
        ("It ___ a dog.", "is"), ("You ___ an artist.", "are"), ("She ___ a manager.", "is"), ("I ___ a baker.", "am"),
        ("They ___ footballers.", "are"), ("It ___ an egg.", "is")]])
add("g1_tobe", W1, P, "Translate into English", "Translate the sentence into English.", "Gapni inglizchaga tarjima qiling.",
    [typed(q, a) for q, a in [
        ("Men oʻquvchiman.", "I am a student|I'm a student"), ("U (erkak) oʻqituvchi.", "He is a teacher|He's a teacher"),
        ("U (ayol) hamshira.", "She is a nurse|She's a nurse"), ("Biz doʻstmiz.", "We are friends|We're friends"),
        ("Ular talabalar.", "They are students|They're students"), ("Siz haydovchisiz. (bitta odamga)", "You are a driver|You're a driver"),
        ("Bu mushuk.", "It is a cat|It's a cat"), ("Men muhandisman.", "I am an engineer|I'm an engineer")]])
add("g1_tobe", W1, P, "Correct the mistake", "Correct the mistake. Write the correct sentence.", "Xatoni toping va toʻgʻri gapni yozing.",
    [typed(q, a) for q, a in [
        ("He are a teacher.", "He is a teacher"), ("I is a student.", "I am a student"), ("They is nurses.", "They are nurses"),
        ("We am friends.", "We are friends"), ("She are a doctor.", "She is a doctor"), ("It are a cat.", "It is a cat"),
        ("You is a waiter.", "You are a waiter"), ("I are an actor.", "I am an actor")]])

# ---- 4. Am/is/are + noun (medium: 3 exercises)
P = "Part 4 · Am, is, are + ot (noun)"
add("g1_noun", W1, P, "Choose the correct sentence", "Choose the correct sentence.", "Toʻgʻri gapni tanlang.",
    [mcq("Which sentence is correct?", shuffled(o), a) for o, a in [
        (["I am a teacher.", "I is a teacher.", "I are a teacher."], "I am a teacher."),
        (["She is an engineer.", "She is a engineer.", "She are an engineer."], "She is an engineer."),
        (["We are student.", "We are students.", "We is students."], "We are students."),
        (["He is a actor.", "He is an actor.", "He am an actor."], "He is an actor."),
        (["They are police officers.", "They is police officers.", "They are a police officer."], "They are police officers."),
        (["You are waiters.", "You is waiters.", "You am waiters."], "You are waiters."),
        (["It is a cat.", "It is an cat.", "It are a cat."], "It is a cat."),
        (["I am an artist.", "I am a artist.", "I are an artist."], "I am an artist.")]])
add("g1_noun", W1, P, "A, an or plural?", "Choose the correct word.", "Toʻgʻri variantni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("I am ___ engineer.", ["a", "an", "—"], "an"), ("We are ___.", ["student", "a student", "students"], "students"),
        ("He is ___ driver.", ["a", "an", "—"], "a"), ("They are ___.", ["a nurse", "nurses", "an nurse"], "nurses"),
        ("She is ___ actor.", ["a", "an", "—"], "an"), ("You are ___. (many people)", ["a waiter", "waiters", "an waiter"], "waiters"),
        ("It is ___ egg.", ["a", "an", "—"], "an"), ("We are ___.", ["teacher", "an teacher", "teachers"], "teachers"),
        ("I am ___ baker.", ["a", "an", "—"], "a"), ("They are ___.", ["businessmen", "a businessman", "an businessman"], "businessmen")]])
add("g1_noun", W1, P, "Make a sentence", "Make a sentence with am, is or are.", "Berilgan soʻzlardan gap tuzing (am, is yoki are qoʻshing).",
    [typed(q, a) for q, a in [
        ("I / artist", "I am an artist|I'm an artist"), ("She / nurse", "She is a nurse|She's a nurse"),
        ("They / police officers", "They are police officers|They're police officers"), ("He / bus driver", "He is a bus driver|He's a bus driver"),
        ("We / students", "We are students|We're students"), ("It / dog", "It is a dog|It's a dog"),
        ("You / waiters", "You are waiters|You're waiters"), ("He / engineer", "He is an engineer|He's an engineer")]])

# ---- 5. Am/is/are + adjective (hard: 5 exercises)
P = "Part 5 · Am, is, are + sifat (adjective)"
add("g1_adj", W1, P, "Am, is or are + adjective", "Choose am, is or are.", "Am, is yoki are ni tanlang.",
    [mcq(q, ["am", "is", "are"], a) for q, a in [
        ("I ___ cold.", "am"), ("He ___ sad.", "is"), ("She ___ happy.", "is"), ("It ___ hungry.", "is"), ("We ___ young.", "are"),
        ("You ___ old.", "are"), ("They ___ tired.", "are"), ("I ___ hungry.", "am"), ("She ___ cold.", "is"), ("We ___ happy.", "are")]])
add("g1_adj", W1, P, "No article before an adjective", "Choose the correct sentence.", "Sifatdan oldin a/an qoʻyilmaydi. Toʻgʻri gapni tanlang.",
    [mcq("Which sentence is correct?", shuffled(o), a) for o, a in [
        (["I am cold.", "I am a cold."], "I am cold."), (["She is a happy.", "She is happy."], "She is happy."),
        (["We are a tired.", "We are tired."], "We are tired."), (["He is sad.", "He is a sad."], "He is sad."),
        (["It is a hungry.", "It is hungry."], "It is hungry."), (["They are young.", "They are a young."], "They are young."),
        (["You are an old.", "You are old."], "You are old."), (["I am an hungry.", "I am hungry."], "I am hungry.")]])
add("g1_adj", W1, P, "Adjective + noun: a or an?", "Choose a or an. Look at the first sound of the adjective.", "A yoki an ni tanlang. Sifatning birinchi tovushiga qarang.",
    [mcq(q, ["a", "an"], a) for q, a in [
        ("I am ___ beautiful girl.", "a"), ("He is ___ handsome boy.", "a"), ("He is ___ honest man.", "an"),
        ("She is ___ friendly person.", "a"), ("It is ___ old car.", "an"), ("It is ___ expensive phone.", "an"),
        ("She is ___ intelligent girl.", "an"), ("He is ___ kind man.", "a"), ("It is ___ big dog.", "a"), ("She is ___ happy girl.", "a")]])
add("g1_adj", W1, P, "Person or people?", "Choose the correct word.", "Toʻgʻri soʻzni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("They are friendly ___.", ["person", "persons", "people"], "people"),
        ("She is a friendly ___.", ["person", "persons", "people"], "person"),
        ("We are good ___.", ["man", "men", "mans"], "men"),
        ("He is a good ___.", ["man", "men", "mans"], "man"),
        ("They are beautiful ___.", ["woman", "women", "womans"], "women"),
        ("She is a beautiful ___.", ["woman", "women", "womans"], "woman"),
        ("They are happy ___.", ["child", "children", "childs"], "children"),
        ("He is a happy ___.", ["child", "children", "childs"], "child")]])
add("g1_adj", W1, P, "Correct the mistake", "Correct the mistake. Write the correct sentence.", "Xatoni toping va toʻgʻri gapni yozing.",
    [typed(q, a) for q, a in [
        ("I am a happy.", "I am happy"), ("She is a beautiful.", "She is beautiful"), ("They are friendly persons.", "They are friendly people"),
        ("He is a honest man.", "He is an honest man"), ("We are a tired.", "We are tired"), ("It is a old car.", "It is an old car"),
        ("She is hungry girl.", "She is a hungry girl"), ("They are happy childs.", "They are happy children")]])

# ---- 6. Have / has (easier: 3 exercises)
P = "Part 6 · Have va has"
add("g1_have", W1, P, "Have or has?", "Choose have or has.", "Have yoki has ni tanlang.",
    [mcq(q, ["have", "has"], a) for q, a in [
        ("I ___ a new phone.", "have"), ("He ___ a new laptop.", "has"), ("She ___ five dogs.", "has"), ("We ___ five apples.", "have"),
        ("They ___ nice cars.", "have"), ("It ___ a long tail.", "has"), ("You ___ a nice watch.", "have"), ("I ___ two pencils.", "have"),
        ("He ___ two brothers.", "has"), ("They ___ a big house.", "have")]])
add("g1_have", W1, P, "Write have or has", "Write have or has.", "Boʻsh joyga have yoki has ni yozing.",
    [typed(q, a) for q, a in [
        ("She ___ a bag.", "has"), ("We ___ two keys.", "have"), ("It ___ a small nose.", "has"), ("They ___ three laptops.", "have"),
        ("He ___ a blue umbrella.", "has"), ("I ___ a sandwich.", "have"), ("You ___ a beautiful car.", "have"), ("My friend ___ a dog.", "has")]])
add("g1_have", W1, P, "Translate into English", "Translate the sentence into English.", "Gapni inglizchaga tarjima qiling.",
    [typed(q, a) for q, a in [
        ("Menda ikkita qalam bor.", "I have two pencils"), ("Uning (erkak) ikkita akasi bor.", "He has two brothers"),
        ("Bizda beshta olma bor.", "We have five apples"), ("Uning (ayol) beshta iti bor.", "She has five dogs"),
        ("Ularda chiroyli mashinalar bor.", "They have nice cars"), ("Uning (hayvon) uzun dumi bor.", "It has a long tail")]])

# ============================================================================ WEEK 2
# ---- 1. Questions (hard: 5 exercises)
P = "Part 1 · Soʻroq shakli (Questions)"
add("g2_quest", W2, P, "Choose the correct question", "Choose the correct question.", "Toʻgʻri soʻroq gapni tanlang.",
    [mcq("Which question is correct?", shuffled(o), a) for o, a in [
        (["Am I a student?", "I am a student?", "Is I a student?"], "Am I a student?"),
        (["Is he happy?", "He is happy?", "Are he happy?"], "Is he happy?"),
        (["Are you a teacher?", "You are a teacher?", "Is you a teacher?"], "Are you a teacher?"),
        (["Is she a kind person?", "Are she a kind person?", "She is a kind person?"], "Is she a kind person?"),
        (["Is it hungry?", "It is hungry?", "Are it hungry?"], "Is it hungry?"),
        (["Are we young?", "We are young?", "Is we young?"], "Are we young?"),
        (["Are they tired?", "They are tired?", "Is they tired?"], "Are they tired?"),
        (["Are you an office worker?", "Is you an office worker?", "You are an office worker?"], "Are you an office worker?")]])
add("g2_quest", W2, P, "Make a question", "Make a question.", "Gapni soʻroq gapga aylantiring.",
    [typed(q, a) for q, a in [
        ("You are a student.", "Are you a student"), ("He is happy.", "Is he happy"), ("They are tired.", "Are they tired"),
        ("She is a kind person.", "Is she a kind person"), ("It is hungry.", "Is it hungry"), ("We are young.", "Are we young"),
        ("I am a student.", "Am I a student"), ("You are teachers.", "Are you teachers")]])
add("g2_quest", W2, P, "Order the words", "Put the words in the correct order to make a question.", "Soʻzlarni toʻgʻri tartibda joylashtirib, soʻroq gap tuzing.",
    [typed(q, a) for q, a in [
        ("he / is / a teacher / ?", "Is he a teacher"), ("you / are / tired / ?", "Are you tired"), ("am / a good student / I / ?", "Am I a good student"),
        ("they / new students / are / ?", "Are they new students"), ("she / is / hungry / ?", "Is she hungry"), ("it / a big dog / is / ?", "Is it a big dog"),
        ("we / are / late / ?", "Are we late"), ("happy / is / he / ?", "Is he happy")]])
add("g2_quest", W2, P, "Short answers", "Choose the correct short answer.", "Toʻgʻri qisqa javobni tanlang.",
    [mcq(q, shuffled(o), a) for q, o, a in [
        ("Are you an office worker? — No, ___.", ["I am not", "I do not", "I are not"], "I am not"),
        ("Are they new students? — Yes, ___.", ["they are", "they is", "they do"], "they are"),
        ("Is he a teacher? — Yes, ___.", ["he is", "he are", "he does"], "he is"),
        ("Is she hungry? — No, ___.", ["she isn't", "she aren't", "she doesn't"], "she isn't"),
        ("Are you a driver? — Yes, ___.", ["I am", "I are", "I is"], "I am"),
        ("Is it a cat? — No, ___.", ["it isn't", "it aren't", "it amn't"], "it isn't"),
        ("Are we late? — Yes, ___.", ["we are", "we is", "we am"], "we are"),
        ("Are they tired? — No, ___.", ["they aren't", "they isn't", "they am not"], "they aren't")]])
add("g2_quest", W2, P, "Answer the question", "Write a short answer using the information in brackets.", "Qavs ichidagi maʼlumotga qarab, qisqa javob yozing.",
    [typed(q, a) for q, a in [
        ("Is she a nurse? (yes)", "Yes, she is"), ("Is he a driver? (no)", "No, he is not|No, he isn't"),
        ("Are you a student? (yes, I am a student)", "Yes, I am"), ("Are they happy? (no)", "No, they are not|No, they aren't"),
        ("Is it a big dog? (yes)", "Yes, it is"), ("Are we late? (no)", "No, we are not|No, we aren't"),
        ("Is he a good person? (yes)", "Yes, he is"), ("Are you tired? (no, I am not tired)", "No, I am not|No, I'm not")]])

# ---- 2. Negatives (easier: 3 exercises)
P = "Part 2 · Inkor shakli (Negatives)"
add("g2_neg", W2, P, "Choose the negative sentence", "Choose the correct negative sentence.", "Toʻgʻri inkor gapni tanlang.",
    [mcq("Which sentence is correct?", shuffled(o), a) for o, a in [
        (["I am not hungry.", "I not am hungry.", "I am no hungry."], "I am not hungry."),
        (["He is not a good person.", "He not is a good person.", "He does not a good person."], "He is not a good person."),
        (["She is not cold.", "She not is cold.", "She no is cold."], "She is not cold."),
        (["It is not a big animal.", "It is no a big animal.", "It not a big animal."], "It is not a big animal."),
        (["We are not students.", "We not are students.", "We are no students."], "We are not students."),
        (["You are not a digital designer.", "You not are a digital designer.", "You is not a digital designer."], "You are not a digital designer."),
        (["They are not happy.", "They not are happy.", "They is not happy."], "They are not happy."),
        (["I am not a teacher.", "I amn't a teacher.", "I not a teacher."], "I am not a teacher.")]])
add("g2_neg", W2, P, "Make it negative", "Make the sentence negative.", "Gapni inkor shaklga oʻtkazing.",
    [typed(q, a) for q, a in [
        ("I am hungry.", "I am not hungry|I'm not hungry"), ("He is a teacher.", "He is not a teacher|He isn't a teacher"),
        ("She is cold.", "She is not cold|She isn't cold"), ("We are students.", "We are not students|We aren't students"),
        ("They are happy.", "They are not happy|They aren't happy"), ("It is a big animal.", "It is not a big animal|It isn't a big animal"),
        ("You are a designer.", "You are not a designer|You aren't a designer"), ("He is a good person.", "He is not a good person|He isn't a good person")]])
add("g2_neg", W2, P, "Correct the mistake", "Correct the mistake. Write the correct sentence.", "Xatoni toping va toʻgʻri gapni yozing.",
    [typed(q, a) for q, a in [
        ("I not am tired.", "I am not tired"), ("She no is happy.", "She is not happy"), ("They not are students.", "They are not students"),
        ("He is no a driver.", "He is not a driver"), ("We are no young.", "We are not young"), ("It not is a cat.", "It is not a cat")]])

# ---- 3. Subject pronouns (hard: 5 exercises)
P = "Part 3 · Kishilik olmoshlari (Subject pronouns)"
add("g2_pron", W2, P, "Which pronoun?", "Choose the pronoun that can replace the word(s).", "Qaysi olmosh bu soʻz(lar) oʻrniga ishlatiladi?",
    [mcq(f"{w} = ?", ["he", "she", "it", "we", "they"], a) for w, a in [
        ("Abror", "he"), ("Laylo", "she"), ("a dog", "it"), ("My friend and I", "we"), ("Kate and Susan", "they"),
        ("a laptop", "it"), ("doctors", "they"), ("a brother", "he"), ("a nurse (woman)", "she"), ("a desk", "it")]])
add("g2_pron", W2, P, "Fill in the pronoun", "Write the correct pronoun: he, she, it, we or they.", "Boʻsh joyga mos olmoshni yozing: he, she, it, we yoki they.",
    [typed(q, a) for q, a in [
        ("Laylo is a nurse. ___ is kind.", "she"), ("Abror is a student. ___ is handsome.", "he"), ("A dog is clever. ___ is big.", "it"),
        ("Kate and Susan are teachers. ___ are kind.", "they"), ("Michael and I are friends. ___ are happy.", "we"),
        ("I have a brother. ___ is 25 years old.", "he"), ("My laptop is new. ___ is fast.", "it"), ("Doctors are kind. ___ are clever.", "they")]])
add("g2_pron", W2, P, "Pronoun and verb", "Choose is or are.", "Is yoki are ni tanlang.",
    [mcq(q, ["is", "are"], a) for q, a in [
        ("Laylo ___ beautiful.", "is"), ("Abror ___ handsome.", "is"), ("A dog ___ clever.", "is"), ("Michael and I ___ friends.", "are"),
        ("You and your children ___ in New York.", "are"), ("Doctors ___ kind.", "are"), ("My father ___ a driver.", "is"), ("Kate and Susan ___ teachers.", "are")]])
add("g2_pron", W2, P, "It, you and they", "Choose the correct answer.", "Toʻgʻri javobni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("'What is 12+12?' — '___ is 24.'", ["He", "It", "They"], "It"),
        ("___ is hot today. (Havo issiq.)", ["It", "He", "We"], "It"),
        ("'You are a clever person.' Here 'you' means:", ["siz (bitta odam)", "sizlar (koʻp odam)"], "siz (bitta odam)"),
        ("'You are talented musicians.' Here 'you' means:", ["siz (bitta odam)", "sizlar (koʻp odam)"], "sizlar (koʻp odam)"),
        ("We are close friends. 'We' is:", ["bir kishi", "koʻpchilik"], "koʻpchilik"),
        ("___ is an ocean.", ["It", "They", "He"], "It"),
        ("___ are wonderful neighbours.", ["They", "It", "He"], "They"),
        ("I have a sister. ___ is a nurse.", ["She", "He", "It"], "She")]])
add("g2_pron", W2, P, "Replace the words", "Write the sentence with a pronoun instead of the underlined words (the first word).", "Gapni qayta yozing: birinchi soʻz(lar) oʻrniga olmosh qoʻying.",
    [typed(q, a) for q, a in [
        ("Abror is handsome.", "He is handsome"), ("Laylo is beautiful.", "She is beautiful"), ("A dog is clever.", "It is clever"),
        ("Doctors are kind.", "They are kind"), ("Michael and I are friends.", "We are friends"), ("Kate and Susan are teachers.", "They are teachers"),
        ("My father is a driver.", "He is a driver"), ("The laptop is new.", "It is new")]])

# ---- 4. Possessives (medium: 4 exercises)
P = "Part 4 · Egalik olmoshlari (Possessive adjectives)"
add("g2_poss", W2, P, "Pronoun → possessive", "Choose the possessive adjective.", "Egalik olmoshini tanlang.",
    [mcq(f"{w} →", shuffled(o), a) for w, o, a in [
        ("I", ["my", "me", "mine"], "my"), ("he", ["his", "he", "him"], "his"), ("she", ["her", "she", "hers"], "her"),
        ("it", ["its", "it's", "it"], "its"), ("we", ["our", "us", "we"], "our"), ("you", ["your", "you", "yours"], "your"),
        ("they", ["their", "they", "them"], "their")]])
add("g2_poss", W2, P, "Complete the sentence", "Write the possessive adjective for the pronoun in brackets.", "Qavs ichidagi olmoshga mos egalik olmoshini yozing.",
    [typed(q, a) for q, a in [
        ("___ name is Alex. (I)", "My"), ("___ car is new. (he)", "His"), ("___ clothes are beautiful. (she)", "Her"), ("___ tail is short. (it)", "Its"),
        ("___ students are smart. (we)", "Our"), ("___ watch is wrong. (you)", "Your"), ("___ eyes are tired. (they)", "Their"),
        ("___ phone is new. (I)", "My"), ("___ sister is a nurse. (he)", "His"), ("___ brother is a driver. (she)", "Her")]])
add("g2_poss", W2, P, "I or my?", "Choose the correct word.", "Toʻgʻri soʻzni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("___ am Abror.", ["I", "My"], "I"), ("___ name is Abror.", ["I", "My"], "My"), ("___ is happy. (he)", ["He", "His"], "He"),
        ("___ car is new. (he)", ["He", "His"], "His"), ("___ are students. (we)", ["We", "Our"], "We"), ("___ teacher is kind. (we)", ["We", "Our"], "Our"),
        ("___ are tired. (they)", ["They", "Their"], "They"), ("___ eyes are tired. (they)", ["They", "Their"], "Their")]])
add("g2_poss", W2, P, "Which word fits?", "Complete the second sentence with a possessive adjective.", "Ikkinchi gapni egalik olmoshi bilan toʻldiring.",
    [typed(q, a) for q, a in [
        ("Abror has a car. ___ car is new.", "His"), ("Laylo has a bag. ___ bag is beautiful.", "Her"), ("We have a teacher. ___ teacher is kind.", "Our"),
        ("They have a dog. ___ dog is big.", "Their"), ("I have a brother. ___ brother is 25 years old.", "My"), ("You have a watch. ___ watch is wrong.", "Your"),
        ("It has a tail. ___ tail is short.", "Its"), ("Kate has a phone. ___ phone is old.", "Her")]])

# ---- 5. Question words (hard: 5 exercises)
P = "Part 5 · Soʻroq soʻzlar (Question words)"
add("g2_wh", W2, P, "Choose the question word", "Choose the correct question word.", "Toʻgʻri soʻroq soʻzni tanlang.",
    [mcq(q, ["Who", "What", "Where", "When", "How"], a) for q, a in [
        ("___ are you? — I am Aziz.", "Who"), ("___ is your name? — My name is Laylo.", "What"), ("___ is he? — He is in London.", "Where"),
        ("___ is your class? — At nine o'clock.", "When"), ("___ are you? — I am fine.", "How"), ("___ is she? — She is my sister.", "Who"),
        ("___ is your phone number?", "What"), ("___ are they? — They are at school.", "Where")]])
add("g2_wh", W2, P, "Order the words", "Put the words in the correct order.", "Soʻzlarni toʻgʻri tartibda joylashtiring.",
    [typed(q, a) for q, a in [
        ("your / is / what / name / ?", "What is your name"), ("are / who / you / ?", "Who are you"), ("is / where / he / ?", "Where is he"),
        ("class / is / when / your / ?", "When is your class"), ("you / how / are / ?", "How are you"), ("she / is / who / ?", "Who is she"),
        ("they / where / are / ?", "Where are they"), ("what / is / his / name / ?", "What is his name")]])
add("g2_wh", W2, P, "How + adjective", "Choose the correct answer.", "Toʻgʻri javobni tanlang. (How old = yoshi nechida)",
    [mcq(q, o, a) for q, o, a in [
        ("How old is he?", ["He is 25.", "He is in London.", "He is a driver."], "He is 25."),
        ("How fast is your car?", ["It is super fast.", "It is red.", "It is in the garage."], "It is super fast."),
        ("How tired are you?", ["A little bit.", "At nine.", "In London."], "A little bit."),
        ("How beautiful is she?", ["She is very beautiful.", "She is a nurse.", "She is in Paris."], "She is very beautiful."),
        ("How old are they?", ["They are 10 and 12.", "They are in class.", "They are doctors."], "They are 10 and 12."),
        ("How big is your dog?", ["It is very big.", "It is Tuesday.", "It is my friend."], "It is very big.")]])
add("g2_wh", W2, P, "Am, is or are?", "Write am, is or are.", "Boʻsh joyga am, is yoki are ni yozing.",
    [typed(q, a) for q, a in [
        ("Where ___ he?", "is"), ("Who ___ you?", "are"), ("What ___ your name?", "is"), ("How ___ you?", "are"), ("When ___ your class?", "is"),
        ("Where ___ they?", "are"), ("How old ___ she?", "is"), ("Who ___ I?", "am"), ("How tired ___ they?", "are"), ("What ___ his phone number?", "is")]])
add("g2_wh", W2, P, "Correct the mistake", "Correct the mistake. Write the correct question.", "Xatoni toping va toʻgʻri soʻroq gapni yozing.",
    [typed(q, a) for q, a in [
        ("Where he is?", "Where is he"), ("What your name is?", "What is your name"), ("How you are?", "How are you"),
        ("Who you are?", "Who are you"), ("When your class is?", "When is your class"), ("How old he is?", "How old is he"),
        ("Where they are?", "Where are they"), ("What is name your?", "What is your name")]])

# ---- Review tests (mix of all topics)
P = "Part 7 · Review test"
add("g1_review", W1, P, "Week 1 review test", "Choose the correct answer.", "1-hafta takrorlash testi. Toʻgʻri javobni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("book → (plural)", ["books", "bookes", "bookies"], "books"), ("watch → (plural)", ["watchs", "watches", "watchies"], "watches"),
        ("country → (plural)", ["countrys", "countries", "countryes"], "countries"), ("child → (plural)", ["childs", "childes", "children"], "children"),
        ("___ egg", ["a", "an"], "an"), ("___ university", ["a", "an"], "a"), ("I ___ a teacher.", ["am", "is", "are"], "am"),
        ("They ___ students.", ["am", "is", "are"], "are"), ("She ___ happy.", ["am", "is", "are"], "is"),
        ("He is ___ honest man.", ["a", "an"], "an"), ("She is ___ beautiful girl.", ["a", "an"], "a"), ("We are ___.", ["tired", "a tired", "an tired"], "tired"),
        ("They are friendly ___.", ["person", "persons", "people"], "people"), ("I ___ a new phone.", ["have", "has"], "have"),
        ("She ___ five dogs.", ["have", "has"], "has"), ("It ___ a long tail.", ["have", "has"], "has"),
        ("Which sentence is correct?", ["He are a driver.", "He is a driver.", "He am a driver."], "He is a driver."),
        ("Which sentence is correct?", ["I am a engineer.", "I am an engineer.", "I is an engineer."], "I am an engineer."),
        ("man → (plural)", ["mans", "men", "manes"], "men"), ("baby → (plural)", ["babys", "babies", "babyes"], "babies")]])
add("g2_review", W2, "Part 6 · Review test", "Week 2 review test", "Choose the correct answer.", "2-hafta takrorlash testi. Toʻgʻri javobni tanlang.",
    [mcq(q, o, a) for q, o, a in [
        ("Which question is correct?", ["Is he happy?", "He is happy?", "Are he happy?"], "Is he happy?"),
        ("Which question is correct?", ["You are a student?", "Are you a student?", "Is you a student?"], "Are you a student?"),
        ("Are they new students? — Yes, ___.", ["they are", "they is", "they do"], "they are"),
        ("Is she a nurse? — No, ___.", ["she isn't", "she aren't", "she doesn't"], "she isn't"),
        ("Which sentence is correct?", ["I not am hungry.", "I am not hungry.", "I am no hungry."], "I am not hungry."),
        ("Which sentence is correct?", ["We are not students.", "We not are students.", "We is not students."], "We are not students."),
        ("Abror = ?", ["he", "she", "it", "they"], "he"), ("Kate and Susan = ?", ["he", "she", "it", "they"], "they"), ("a laptop = ?", ["he", "she", "it", "they"], "it"),
        ("Michael and I ___ friends.", ["is", "are"], "are"), ("A dog ___ clever.", ["is", "are"], "is"),
        ("I → ?", ["my", "me", "mine"], "my"), ("she → ?", ["his", "her", "their"], "her"), ("they → ?", ["their", "our", "its"], "their"),
        ("___ car is new. (he)", ["His", "Her", "Its"], "His"), ("___ is your name?", ["Who", "What", "Where"], "What"),
        ("___ is he? — He is in London.", ["How", "When", "Where"], "Where"), ("___ are you? — I am fine.", ["How", "Who", "When"], "How"),
        ("Which question is correct?", ["Where is he?", "Where he is?", "Where are he?"], "Where is he?"),
        ("How old is he?", ["He is 25.", "He is in London.", "He is a driver."], "He is 25.")]])

# ============================================================================ VOCABULARY (generated)
js = open(os.path.join(STATIC, "flashcards_data.js"), encoding="utf-8").read()
CARDS = json.loads(js[js.index("["): js.rindex("]") + 1])
try:
    PHOTOS = json.load(open(os.path.join(STATIC, "img", "books_manifest.json"), encoding="utf-8"))["vocab"]
except OSError:
    PHOTOS = {}
UNIT = {}
for c in CARDS:
    UNIT.setdefault(c["unit"], []).append(c)


def base_meaning(c):
    return re.sub(r"\s*\(.*?\)", "", c["meaning_uz"]).strip().lower()


def unique_meaning(c, pool):
    return sum(1 for o in pool if base_meaning(o) == base_meaning(c)) == 1


def distract(c, pool, key, n=3):
    """n wrong options from the same unit; never a card that means the same as `c` (hi / hello / hey)."""
    others = [o for o in pool if o["id"] != c["id"] and key(o).lower() != key(c).lower()
              and base_meaning(o) != base_meaning(c)]
    rng.shuffle(others)
    return [key(o) for o in others[:n]]


VOCAB = []


def vadd(topic_id, week, part, title, inst_en, inst_uz, items):
    n = sum(1 for e in VOCAB if e["part"] == part) + 1
    VOCAB.append(ex(f"{topic_id}_{n}", "vocabulary", week, part, n, title, inst_en, inst_uz, items))


def picture_items(cards, pool, n=None, prompt="What is this?"):
    cards = [c for c in cards if c["id"] in PHOTOS]
    rng.shuffle(cards)
    cards = cards[:n] if n else cards
    items = []
    for c in cards:
        opts = shuffled([c["word"]] + distract(c, pool, lambda o: o["word"]))
        items.append(mcq(prompt, opts, c["word"]))
        items[-1][1]["img"] = "/static/" + PHOTOS[c["id"]]
    return items


def en_uz_items(cards, pool, n=None):
    cards = list(cards)
    rng.shuffle(cards)
    cards = cards[:n] if n else cards
    return [mcq(c["word"], shuffled([c["meaning_uz"]] + distract(c, pool, lambda o: o["meaning_uz"])), c["meaning_uz"])
            for c in cards]


def uz_en_items(cards, pool, n=None):
    cards = [c for c in cards if unique_meaning(c, pool)]
    rng.shuffle(cards)
    cards = cards[:n] if n else cards
    return [mcq(c["meaning_uz"], shuffled([c["word"]] + distract(c, pool, lambda o: o["word"])), c["word"]) for c in cards]


def type_items(cards, pool, n=None, with_photo=False):
    if with_photo:
        cards = [c for c in cards if c["id"] in PHOTOS and " — " not in c["word"]]
    else:
        cards = [c for c in cards if unique_meaning(c, pool)]
    rng.shuffle(cards)
    cards = cards[:n] if n else cards
    items = []
    for c in cards:
        if with_photo:
            items.append(typed("Write the word for this picture.", c["word"]))
            items[-1][1]["img"] = "/static/" + PHOTOS[c["id"]]
        else:
            items.append(typed(f"{c['meaning_uz']} →", c["word"]))
    return items


def split(cards):
    cards = list(cards)
    rng.shuffle(cards)
    h = len(cards) // 2
    return cards[:h], cards[h:]


WEEK1_VOCAB = [("1a", "Part A · Kasblar (Jobs)"), ("1b", "Part B · Davlatlar (Countries)"),
               ("1c", "Part C · Millatlar (Nationalities)"), ("1d", "Part D · Kundalik buyumlar (Objects)")]
for u, part in WEEK1_VOCAB:
    cs = UNIT[u]
    if u == "1c":  # country → nationality (exact mapping by order in the two units)
        cty = UNIT["1b"]
        nat_of = {c["word"]: n["word"] for c, n in zip(cty, cs)}
        pairs = [(a, b) for a, b in nat_of.items() if a not in ("the US / the USA", "the UK")]
        rng.shuffle(pairs)
        first, second = pairs[:10], pairs[10:]
        pool = [b for _, b in nat_of.items()]
        for k, chunk in enumerate((first, second), 1):
            vadd("v1_" + u, W1, part, f"Country → nationality ({k})", "Choose the nationality.", "Davlatga mos millatni tanlang.",
                 [mcq(f"{a} →", shuffled([b] + rng.sample([x for x in pool if x != b], 3)), b) for a, b in chunk])
        vadd("v1_" + u, W1, part, "Uzbek → English", "Choose the English word.", "Oʻzbekcha maʼnoga mos inglizcha soʻzni tanlang.", uz_en_items(cs, cs, 10))
        vadd("v1_" + u, W1, part, "Write the nationality", "Write the nationality.", "Davlatga mos millatni yozing.",
             [typed(f"{a} →", b) for a, b in pairs[::-1][:10]])
        continue
    if u == "1b":
        a, b = split(cs)
        vadd("v1_" + u, W1, part, "Picture quiz", "Look at the picture. Choose the country.", "Rasmga qarang va davlat nomini tanlang.",
             picture_items(cs, cs, 10, "Which country is this?"))
        vadd("v1_" + u, W1, part, "English → Uzbek (1)", "Choose the Uzbek meaning.", "Oʻzbekcha maʼnoni tanlang.", en_uz_items(a, cs))
        vadd("v1_" + u, W1, part, "English → Uzbek (2)", "Choose the Uzbek meaning.", "Oʻzbekcha maʼnoni tanlang.", en_uz_items(b, cs))
        vadd("v1_" + u, W1, part, "Uzbek → English", "Choose the English word.", "Oʻzbekcha maʼnoga mos inglizcha soʻzni tanlang.", uz_en_items(cs, cs, 10))
        vadd("v1_" + u, W1, part, "Write the word", "Write the country for the picture.", "Rasmga mos davlat nomini yozing.", type_items(cs, cs, 10, with_photo=True))
        continue
    vadd("v1_" + u, W1, part, "Picture quiz", "Look at the picture. Choose the word.", "Rasmga qarang va toʻgʻri soʻzni tanlang.",
         picture_items(cs, cs, None, "What is this person's job?" if u == "1a" else "What is this?"))
    vadd("v1_" + u, W1, part, "English → Uzbek", "Choose the Uzbek meaning.", "Oʻzbekcha maʼnoni tanlang.", en_uz_items(cs, cs))
    vadd("v1_" + u, W1, part, "Uzbek → English", "Choose the English word.", "Oʻzbekcha maʼnoga mos inglizcha soʻzni tanlang.", uz_en_items(cs, cs))
    if u in ("1a", "1d"):
        vadd("v1_" + u, W1, part, "Write the word", "Write the word for the picture.", "Rasmga mos soʻzni yozing.", type_items(cs, cs, None, with_photo=True))

WEEK2_VOCAB = [("2a", "Part A · Salomlashish (Greetings)"), ("2d", "Part D · Kasblar va boshqa soʻzlar (Jobs & Other)"),
               ("2e", "Part E · Odamlar (People)"), ("2f", "Part F · Sifatlar (Adjectives)")]
for u, part in WEEK2_VOCAB:
    cs = UNIT[u]
    if u != "2a":  # the hi / hello / hey photos can't be told apart
        prompt = {"2d": "What is this?", "2e": "Who is this?", "2f": "Which word fits the picture?"}[u]
        vadd("v2_" + u, W2, part, "Picture quiz", "Look at the picture. Choose the word.", "Rasmga qarang va toʻgʻri soʻzni tanlang.",
             picture_items(cs, cs, None, prompt))
    vadd("v2_" + u, W2, part, "English → Uzbek", "Choose the Uzbek meaning.", "Oʻzbekcha maʼnoni tanlang.", en_uz_items(cs, cs))
    vadd("v2_" + u, W2, part, "Uzbek → English", "Choose the English word.", "Oʻzbekcha maʼnoga mos inglizcha soʻzni tanlang.", uz_en_items(cs, cs))

# expressions + personal information (small units, one pool)
bc = UNIT["2b"] + UNIT["2c"]
part = "Part B-C · Iboralar va shaxsiy maʼlumot"
vadd("v2_bc", W2, part, "English → Uzbek", "Choose the Uzbek meaning.", "Oʻzbekcha maʼnoni tanlang.", en_uz_items(bc, bc))
vadd("v2_bc", W2, part, "Uzbek → English", "Choose the English word.", "Oʻzbekcha maʼnoga mos inglizcha soʻzni tanlang.", uz_en_items(bc, bc))
vadd("v2_bc", W2, part, "Which phrase?", "Choose the correct phrase.", "Vaziyatga mos iborani tanlang.",
     [mcq(q, o, a) for q, o, a in [
         ("Ertalab odamlarga salom berasiz:", ["Good morning!", "Good night!", "Goodbye!"], "Good morning!"),
         ("Kechqurun uxlashdan oldin:", ["Good night!", "Good morning!", "Hello!"], "Good night!"),
         ("Kimdir sizdan ahvolingizni soʻraydi. U nima deydi?", ["How are you?", "What is your name?", "See you!"], "How are you?"),
         ("Ahvolingiz juda yaxshi. Siz aytasiz:", ["Very well, thank you.", "Good night.", "Goodbye."], "Very well, thank you."),
         ("Ismingizni soʻrashadi. Siz soʻzni qanday aytasiz?", ["My name is Aziz.", "My phone number is Aziz.", "My surname is Aziz."], "My name is Aziz."),
         ("Soʻzni harflab aytishni soʻrasangiz:", ["Spell it, please.", "Repeat it, please.", "Goodbye, please."], "Spell it, please.")]])

# numbers
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
    t, o = word.split("-")
    return TENS[t] + ONES[o]


nums = [(c["word"], to_int(c["word"])) for c in UNIT["2g"]]
assert len(nums) == 37 and all(n > 0 for _, n in nums)
part = "Part G · Sonlar (Numbers)"
low = [(w, n) for w, n in nums if n <= 20]
high = [(w, n) for w, n in nums if n > 20]


def num_choice(pairs, k):
    rng.shuffle(pairs)
    out = []
    for w, n in pairs[:k]:
        others = [m for _, m in nums if m != n]
        rng.shuffle(others)
        out.append(mcq(f"{w} =", shuffled([str(n)] + [str(x) for x in others[:3]]), str(n)))
    return out


vadd("v2_g", W2, part, "Words → digits (1-20)", "Choose the number.", "Soʻzga mos raqamni tanlang.", num_choice(list(low), 10))
vadd("v2_g", W2, part, "Words → digits (20-100)", "Choose the number.", "Soʻzga mos raqamni tanlang.", num_choice(list(high), 10))
rng.shuffle(low)
vadd("v2_g", W2, part, "Write the number in words", "Write the number in words.", "Raqamni inglizcha yozing.", [typed(f"{n} →", w) for w, n in low[:10]])
rng.shuffle(high)
vadd("v2_g", W2, part, "Write the number in words (20-100)", "Write the number in words.", "Raqamni inglizcha yozing.", [typed(f"{n} →", w) for w, n in high[:10]])

# ============================================================================ output
ALL = [e for e in GRAMMAR if e["week"] == W1] + [e for e in VOCAB if e["week"] == W1] + \
      [e for e in GRAMMAR if e["week"] == W2] + [e for e in VOCAB if e["week"] == W2]
def validate():
    ids = set()
    for e in ALL:
        assert e["id"] not in ids, e["id"]
        ids.add(e["id"])
        assert 5 <= len(e["questions"]) <= 20, (e["id"], len(e["questions"]))
        for q in e["questions"]:
            opts = q.get("options")
            if opts:
                assert len(set(opts)) == len(opts), (e["id"], q)
                assert q["a"] in opts, (e["id"], q)
            assert q["a"].strip(), (e["id"], q)
            assert "\n" not in q["q"]


validate()

word_index = {}
for u, title in [("1a", "Jobs and occupations (Kasblar)"), ("1b", "Countries (Davlatlar)"), ("1c", "Nationalities (Millatlar)"), ("1d", "Objects (Buyumlar)")]:
    word_index[title] = [{"en": c["word"], "uz": c["meaning_uz"]} for c in UNIT[u]]

out = {"app_title": "Level One App — Week 1-2", "word_index": word_index, "exercises": ALL}
with open(os.path.join(APP, "exercises_data.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

# keep the offline fallback inside index.html in step with the server file
idx_path = os.path.join(STATIC, "index.html")
html = open(idx_path, encoding="utf-8").read()
m = re.search(r"const INITIAL_WORKBOOK_DATA = \{.*?\n", html)
assert m, "INITIAL_WORKBOOK_DATA not found"
html = html[:m.start()] + "const INITIAL_WORKBOOK_DATA = " + json.dumps(out, ensure_ascii=False) + ";\n" + html[m.end():]
html = html.replace("l1_exercises_v1", "l1_exercises_v2")
open(idx_path, "w", encoding="utf-8", newline="").write(html)

g = sum(len(e["questions"]) for e in ALL if e["category"] == "grammar")
v = sum(len(e["questions"]) for e in ALL if e["category"] == "vocabulary")
print(f"exercises: {len(ALL)} (grammar {sum(1 for e in ALL if e['category']=='grammar')}, vocabulary {sum(1 for e in ALL if e['category']=='vocabulary')})")
print(f"questions: grammar {g}, vocabulary {v}")
