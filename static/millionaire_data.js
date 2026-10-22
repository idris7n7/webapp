// Hand-written grammar questions for the Millioner game (build_millionaire_bank.py). t = tier, o = options, a = answer.
const MILLIONAIRE_GRAMMAR = [
 {
  "t": 1,
  "q": "I ___ a student.",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "am",
  "why": "I olmoshi bilan AM ishlatiladi: I am."
 },
 {
  "t": 1,
  "q": "She ___ a nurse.",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "is",
  "why": "He, she, it bilan IS ishlatiladi."
 },
 {
  "t": 1,
  "q": "They ___ teachers.",
  "o": [
   "is",
   "am",
   "are",
   "be"
  ],
  "a": "are",
  "why": "We, you, they bilan ARE ishlatiladi."
 },
 {
  "t": 1,
  "q": "I have ___ apple.",
  "o": [
   "a",
   "an",
   "two",
   "many"
  ],
  "a": "an",
  "why": "Apple unli tovush bilan boshlanadi, shuning uchun AN."
 },
 {
  "t": 1,
  "q": "What is the plural of 'book'?",
  "o": [
   "books",
   "bookes",
   "bookies",
   "bookis"
  ],
  "a": "books",
  "why": "Oddiy otga -s qo'shiladi: book - books."
 },
 {
  "t": 1,
  "q": "What is the plural of 'watch'?",
  "o": [
   "watchs",
   "watches",
   "watchies",
   "watchis"
  ],
  "a": "watches",
  "why": "-ch bilan tugagan otga -es qo'shiladi."
 },
 {
  "t": 1,
  "q": "He ___ a new phone.",
  "o": [
   "have",
   "has",
   "haves",
   "having"
  ],
  "a": "has",
  "why": "He, she, it bilan HAS ishlatiladi."
 },
 {
  "t": 1,
  "q": "We ___ five apples.",
  "o": [
   "has",
   "have",
   "are",
   "is"
  ],
  "a": "have",
  "why": "I, we, you, they bilan HAVE ishlatiladi."
 },
 {
  "t": 1,
  "q": "___ you a student?",
  "o": [
   "Are",
   "Is",
   "Am",
   "Do"
  ],
  "a": "Are",
  "why": "Savolda ARE gap boshiga o'tadi: Are you a student?"
 },
 {
  "t": 1,
  "q": "I am ___.",
  "o": [
   "happy",
   "a happy",
   "an happy",
   "the happy"
  ],
  "a": "happy",
  "why": "Sifatdan oldin a/an qo'yilmaydi: I am happy."
 },
 {
  "t": 1,
  "q": "He is ___ engineer.",
  "o": [
   "a",
   "an",
   "are",
   "is"
  ],
  "a": "an",
  "why": "Engineer unli tovush bilan boshlanadi, shuning uchun AN."
 },
 {
  "t": 1,
  "q": "It ___ a cat.",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "is",
  "why": "It bilan IS ishlatiladi."
 },
 {
  "t": 1,
  "q": "My name ___ Alex.",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "is",
  "why": "My name - bitta narsa, shuning uchun IS: My name is Alex."
 },
 {
  "t": 1,
  "q": "What is the plural of 'child'?",
  "o": [
   "childs",
   "children",
   "childes",
   "childrens"
  ],
  "a": "children",
  "why": "Child - children: bu qoidaga bo'ysunmaydigan ko'plik."
 },
 {
  "t": 1,
  "q": "What is the plural of 'baby'?",
  "o": [
   "babys",
   "babyes",
   "babies",
   "babyies"
  ],
  "a": "babies",
  "why": "Undoshdan keyin turgan Y -ies ga aylanadi: baby - babies."
 },
 {
  "t": 1,
  "q": "We ___ friends.",
  "o": [
   "is",
   "am",
   "are",
   "be"
  ],
  "a": "are",
  "why": "We bilan ARE ishlatiladi."
 },
 {
  "t": 2,
  "q": "___ he a teacher?",
  "o": [
   "Is",
   "Are",
   "Am",
   "Does"
  ],
  "a": "Is",
  "why": "He bilan savolda IS gap boshiga o'tadi."
 },
 {
  "t": 2,
  "q": "Is she happy? - Yes, she ___.",
  "o": [
   "is",
   "are",
   "am",
   "does"
  ],
  "a": "is",
  "why": "Qisqa javobda ham IS ishlatiladi: Yes, she is."
 },
 {
  "t": 2,
  "q": "Are they students? - No, they ___.",
  "o": [
   "aren't",
   "isn't",
   "amn't",
   "don't"
  ],
  "a": "aren't",
  "why": "They bilan: No, they aren't (are not)."
 },
 {
  "t": 2,
  "q": "She ___ not hungry.",
  "o": [
   "am",
   "is",
   "are",
   "do"
  ],
  "a": "is",
  "why": "Inkorda NOT am/is/are dan keyin turadi: She is not hungry."
 },
 {
  "t": 2,
  "q": "I ___ not tired.",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "am",
  "why": "I bilan AM: I am not tired."
 },
 {
  "t": 2,
  "q": "He is ___ honest man.",
  "o": [
   "a",
   "an",
   "the",
   "two"
  ],
  "a": "an",
  "why": "Honest 'onist' deb o'qiladi, unli tovush bilan boshlanadi: AN."
 },
 {
  "t": 2,
  "q": "She is ___ beautiful girl.",
  "o": [
   "a",
   "an",
   "are",
   "is"
  ],
  "a": "a",
  "why": "Beautiful undosh tovush bilan boshlanadi: A."
 },
 {
  "t": 2,
  "q": "They are friendly ___.",
  "o": [
   "people",
   "persons",
   "person",
   "peoples"
  ],
  "a": "people",
  "why": "Person ko'pligi - people."
 },
 {
  "t": 2,
  "q": "Laylo is a nurse. ___ is kind.",
  "o": [
   "He",
   "She",
   "It",
   "They"
  ],
  "a": "She",
  "why": "Laylo - ayol, shuning uchun SHE."
 },
 {
  "t": 2,
  "q": "A dog is clever. ___ is big.",
  "o": [
   "He",
   "She",
   "It",
   "We"
  ],
  "a": "It",
  "why": "Hayvon va narsalar uchun IT ishlatiladi."
 },
 {
  "t": 2,
  "q": "Kate and Susan are teachers. ___ are kind.",
  "o": [
   "He",
   "She",
   "It",
   "They"
  ],
  "a": "They",
  "why": "Ikki kishi (ko'plik) - THEY."
 },
 {
  "t": 2,
  "q": "___ name is Alex. (I)",
  "o": [
   "My",
   "Me",
   "I",
   "Mine"
  ],
  "a": "My",
  "why": "I ning egalik shakli - MY."
 },
 {
  "t": 2,
  "q": "This is Abror. ___ car is new. (he)",
  "o": [
   "His",
   "He",
   "Her",
   "Him"
  ],
  "a": "His",
  "why": "He ning egalik shakli - HIS."
 },
 {
  "t": 2,
  "q": "How ___ you? - I am fine.",
  "o": [
   "is",
   "am",
   "are",
   "be"
  ],
  "a": "are",
  "why": "How are you? - You bilan ARE."
 },
 {
  "t": 2,
  "q": "What ___ your name?",
  "o": [
   "am",
   "is",
   "are",
   "be"
  ],
  "a": "is",
  "why": "What is your name? - Name bitta, shuning uchun IS."
 },
 {
  "t": 2,
  "q": "Choose the correct sentence.",
  "o": [
   "I not am happy.",
   "I am not happy.",
   "I no am happy.",
   "I am no happy."
  ],
  "a": "I am not happy.",
  "why": "NOT am/is/are dan keyin turadi."
 },
 {
  "t": 2,
  "q": "What is the plural of 'city'?",
  "o": [
   "citys",
   "cities",
   "cityes",
   "citees"
  ],
  "a": "cities",
  "why": "Undoshdan keyin Y - ies: city - cities."
 },
 {
  "t": 2,
  "q": "I have two ___.",
  "o": [
   "watch",
   "watchs",
   "watches",
   "watchies"
  ],
  "a": "watches",
  "why": "Ikkita - ko'plik: watch - watches."
 },
 {
  "t": 3,
  "q": "Which question is correct?",
  "o": [
   "Where he is?",
   "Where is he?",
   "Where are he?",
   "Is where he?"
  ],
  "a": "Where is he?",
  "why": "So'roq so'z gap boshiga, IS esa undan keyin: Where is he?"
 },
 {
  "t": 3,
  "q": "Which question is correct?",
  "o": [
   "How old he is?",
   "How old is he?",
   "How is old he?",
   "How he old is?"
  ],
  "a": "How old is he?",
  "why": "How old + is + he: so'roq so'z, keyin IS, keyin ega."
 },
 {
  "t": 3,
  "q": "Michael and I ___ friends.",
  "o": [
   "is",
   "am",
   "are",
   "be"
  ],
  "a": "are",
  "why": "Michael and I = we, shuning uchun ARE."
 },
 {
  "t": 3,
  "q": "You and your children ___ in New York.",
  "o": [
   "is",
   "am",
   "are",
   "be"
  ],
  "a": "are",
  "why": "You and your children = you (ko'plik) - ARE."
 },
 {
  "t": 3,
  "q": "Doctors ___ kind.",
  "o": [
   "is",
   "are",
   "am",
   "be"
  ],
  "a": "are",
  "why": "Doctors ko'plik (= they), shuning uchun ARE."
 },
 {
  "t": 3,
  "q": "Which pronoun replaces 'My friend and I'?",
  "o": [
   "we",
   "they",
   "you",
   "he"
  ],
  "a": "we",
  "why": "Men va do'stim = biz = WE."
 },
 {
  "t": 3,
  "q": "Which pronoun replaces 'a laptop'?",
  "o": [
   "he",
   "she",
   "it",
   "they"
  ],
  "a": "it",
  "why": "Narsa uchun IT ishlatiladi."
 },
 {
  "t": 3,
  "q": "Which pronoun replaces 'You and your friends'?",
  "o": [
   "we",
   "you",
   "they",
   "she"
  ],
  "a": "you",
  "why": "You and your friends = sizlar = YOU."
 },
 {
  "t": 3,
  "q": "___ car is new. (they)",
  "o": [
   "Their",
   "They",
   "Them",
   "There"
  ],
  "a": "Their",
  "why": "They ning egalik shakli - THEIR."
 },
 {
  "t": 3,
  "q": "Which possessive adjective is for 'it'?",
  "o": [
   "its",
   "it's",
   "his",
   "her"
  ],
  "a": "its",
  "why": "It ning egalik shakli - ITS (it's = it is)."
 },
 {
  "t": 3,
  "q": "Which sentence is correct?",
  "o": [
   "They are a friendly people.",
   "They are friendly people.",
   "They are friendly persons.",
   "They is friendly people."
  ],
  "a": "They are friendly people.",
  "why": "Ko'plikda A/AN yo'q va person - people."
 },
 {
  "t": 3,
  "q": "Which sentence is correct?",
  "o": [
   "He is a honest man.",
   "He is an honest man.",
   "He is honest a man.",
   "He an is honest man."
  ],
  "a": "He is an honest man.",
  "why": "Honest unli tovush bilan boshlanadi - AN honest."
 },
 {
  "t": 3,
  "q": "Which question is correct?",
  "o": [
   "Is you an office worker?",
   "Are you an office worker?",
   "You are an office worker?",
   "Do you an office worker?"
  ],
  "a": "Are you an office worker?",
  "why": "You bilan ARE gap boshiga o'tadi."
 },
 {
  "t": 3,
  "q": "Are you a driver? - No, ___.",
  "o": [
   "I am not",
   "I not am",
   "I amn't",
   "I don't"
  ],
  "a": "I am not",
  "why": "I am not (yoki I'm not) - amn't deyilmaydi."
 },
 {
  "t": 3,
  "q": "One woman, two ___.",
  "o": [
   "womans",
   "womens",
   "women",
   "womanes"
  ],
  "a": "women",
  "why": "Woman - women: qoidaga bo'ysunmaydigan ko'plik."
 },
 {
  "t": 3,
  "q": "How ___ is your car? - It is super fast.",
  "o": [
   "fast",
   "faster",
   "fastly",
   "speed"
  ],
  "a": "fast",
  "why": "How + sifat: How fast is your car?"
 },
 {
  "t": 3,
  "q": "Which sentence is correct?",
  "o": [
   "She have a dog.",
   "She has a dog.",
   "She haves a dog.",
   "She is have a dog."
  ],
  "a": "She has a dog.",
  "why": "She bilan HAS ishlatiladi."
 },
 {
  "t": 3,
  "q": "What is 12 + 12? - ___ is 24.",
  "o": [
   "He",
   "She",
   "It",
   "They"
  ],
  "a": "It",
  "why": "Javob (raqam, narsa) uchun IT ishlatiladi."
 }
];
