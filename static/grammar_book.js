// The grammar lessons of O'rganish as a textbook in the style of the classic "units with lettered sections" grammar
// books: a unit header with a big number, sections A, B, C ..., tinted example boxes with small coloured drawings,
// speech bubbles for the teacher's remarks, and a page of Mashqlar (exercises) at the end of every unit, taken from
// the lesson's practice questions. Every sentence of the lesson text is word for word the teacher's; the page only
// adds design that helps to see what the text says (one colour per grammar idea, word blocks that jump into place,
// pictures for the examples, tap to hear the English sentences).
// app_main.js openLessonReader() asks L1_GrammarBook.has(id) / pages(id) and wire(card) after building the pager.
(function () {
  "use strict";
  const F = window.L1_FlatArt;
  if (!F) return;
  const C = F.C;

  // ---------- inline marks ----------
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const TOK = /\[([a-z0-9-]+):([^\]]+)\]/g;
  const CLS = {
    am: "gb-v gb-am", is: "gb-v gb-is", are: "gb-v gb-are", have: "gb-v gb-am", has: "gb-v gb-are",
    not: "gb-v gb-not", q: "gb-v gb-qw", a: "gb-ar gb-a", an: "gb-ar gb-an",
    n: "gb-n", j: "gb-j", s1: "gb-sfx gb-s1", s2: "gb-sfx gb-s2", s3: "gb-sfx gb-s3", lar: "gb-sfx gb-lar",
    pr: "gb-chip gb-c-n", poss: "gb-v gb-poss", x: "gb-x", ok: "gb-ok", ring: "gb-ring", v: "gb-vow",
    f1: "gb-f1", f2: "gb-f2", mute: "gb-mute", irr: "gb-sfx gb-s3",
    "c-n": "gb-chip gb-c-n", "c-t": "gb-chip gb-c-t", "c-r": "gb-chip gb-c-r", "c-y": "gb-chip gb-c-y", "c-l": "gb-chip gb-c-l",
  };
  function ink(s) {
    const h = esc(s).replace(TOK, (m, k, t) => (CLS[k] ? `<span class="${CLS[k]}">${t}</span>` : t));
    return h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/==(.+?)==/g, '<mark class="gb-hl">$1</mark>');
  }
  const plain = (s) => String(s).replace(TOK, "$2").replace(/\*\*|==/g, "");

  // ---------- pictures ----------
  const sc = (w, h, layers, label) => F.scene(w, h, layers, label);
  const who = (o) => () => sc(100, 100, [[o, 0, 0, 100]]);
  const one = (name, o, s) => () => sc(100, 100, [[name, (100 - (s || 84)) / 2, (100 - (s || 84)) / 2, s || 84, o]]);
  const crowd = (list, step) => () => { const c = F.crowd(list, step || 48); return sc(c.w, 100, [[c, 0, 0, c.w]]); };
  const withThing = (po, thing, o, tx, ty, ts, anim) => () => sc(tx + ts + 6, 100, [[po, 0, 0, 100], [thing, tx, ty, ts, o, anim]]);
  // singular -> plural strip
  const PL = (single, group) => () => sc(200, 100, [...single, ["arrow", 84, 34, 32, C.red], ...group]);
  const PLP = (one1, trio) => () => { const c = F.crowd(trio, 40); return sc(264, 100, [[one1, 0, 0, 100], ["arrow", 104, 34, 32, C.red], [c, 140, 14, 120]]); };
  const bubbleQ = (x, y, s) => ["q", x, y, s || 46];

  const TEACHER = { acc: ["glasses", "book"], shirt: "purple" };
  const MAN = { hair: "neat", hc: "brown", acc: ["tie"], shirt: "green" };
  const GIRL = { hair: "long", hc: "brown", shirt: "pink" };
  const KID = (o) => Object.assign({ curl: 1, hc: "brown" }, o);
  const GRAD = (o) => Object.assign({ hat: "grad" }, o);
  const ART = {
    // plural
    plBook: PL([["book", 6, 8, 78, C.red]], [["book", 106, 14, 64, C.yellow], ["book", 126, 10, 64, C.teal], ["book", 146, 6, 64, C.purple]]),
    plWatch: PL([["watch", 6, 8, 80]], [["watch", 100, 10, 60, C.yellow], ["watch", 122, 10, 60, C.teal], ["watch", 144, 10, 60, C.red]]),
    plGlass: PL([["glasses", 4, 20, 84]], [["glasses", 104, -14, 78, C.yellow], ["glasses", 108, 10, 78, C.teal], ["glasses", 112, 34, 78, C.pink]]),
    plDish: PL([["bowl", 4, 8, 82, C.red]], [["bowl", 106, 2, 76, C.purple], ["bowl", 106, -12, 76, C.teal], ["bowl", 106, -26, 76, C.yellow]]),
    plFlag: PL([["flag", 8, 6, 84, C.red]], [["flag", 108, 8, 64, C.red], ["flag", 130, 8, 64, C.teal], ["flag", 152, 8, 64, C.yellow]]),
    plBaby: PL([["baby", 6, 10, 80]], [["baby", 106, 24, 56], ["baby", 128, 14, 60], ["baby", 150, 24, 56]]),
    person: PLP({ shirt: "yellow" }, [{ hair: "long", hc: "brown", shirt: "red" }, { shirt: "yellow" }, { shirt: "teal" }]),
    man: PLP({ shirt: "purple" }, [{ hc: "brown", shirt: "yellow" }, { shirt: "purple" }, { hc: "brown", shirt: "green" }]),
    woman: PLP({ hair: "long", hc: "brown", shirt: "red" }, [{ hair: "bun", shirt: "purple" }, { hair: "long", hc: "brown", shirt: "red" }, { hair: "bun", shirt: "yellow" }]),
    child: PLP(KID({ shirt: "green" }), [KID({ shirt: "red" }), KID({ shirt: "green" }), KID({ hc: "dark", shirt: "yellow" })]),
    // articles
    anyBook: () => sc(150, 100, [["book", 6, 14, 70, C.yellow], ["book", 46, 14, 70, C.teal], ["book", 86, 14, 70, C.purple], bubbleQ(-2, -4, 36), bubbleQ(104, -2, 34)]),
    oneBook: () => sc(124, 100, [["bookOpen", 10, 12, 104], ["spark", -2, 4, 26, C.gold], ["spark", 98, 0, 24, C.red], ["spark", 96, 66, 20, C.teal]]),
    teachers: () => { const c = F.crowd([{ acc: ["glasses"], shirt: "yellow" }, { hair: "bun", hc: "brown", shirt: "red" }, { hair: "neat", hc: "brown", acc: ["tie"], shirt: "green" }, { hair: "long", shirt: "purple", acc: ["book"] }], 42); return sc(c.w, 100, [[c, 0, 8, c.w], bubbleQ(10, -4, 34), bubbleQ(88, -4, 34)]); },
    dog: one("dog"), cat: one("cat"), apple: one("apple"), orange: one("orange"), egg: one("egg", null, 88), university: one("university"), hour: one("clock", null, 86), crown: one("crown"), pencil: one("pencil", null, 92),
    waiter: withThing({ acc: ["bowtie"], shirt: "green" }, "cloche", null, 74, 28, 56),
    // to be
    punch: () => sc(112, 100, [["bag", 62, 0, 50], ["glove", 0, 22, 68, null, "punch"]], "urmoq"),
    run: () => sc(110, 100, [["arrow", 0, 20, 24, C.grey], ["arrow", 0, 52, 24, C.grey], ["runner", 14, 0, 100, null, "run"]], "yugurmoq"),
    pull: () => sc(100, 100, [["mound", 0, 6, 100], ["carrot", 20, 0, 64, null, "pull"]], "sugʻurmoq"),
    turn: () => sc(110, 100, [["loop", 6, 6, 98], [{ shirt: "purple" }, 22, 20, 66, null, "turn"]], "oʻgirmoq"),
    room: () => sc(300, 132, [["window", 6, 8, 72], ["lamp", 242, 14, 72], ["sofa", 60, 52, 170], ["mug", 10, 92, 40], ["zz", 214, 4, 44]]),
    me: who(GRAD({ face: "grin", shirt: "yellow" })), stepGirl: who({ hair: "long", bow: true, shirt: "pink" }),
    lazy: crowd([{ face: "tired", shirt: "purple" }, { face: "sad", hc: "brown", shirt: "yellow" }], 56),
    youLot: crowd([{ hc: "brown", face: "wow", shirt: "green" }, { hair: "spiky", face: "cheeky", shirt: "red" }], 56),
    plov: () => sc(168, 100, [["plov", 0, 12, 104], ["qatiq", 100, 28, 62], ["heart", 66, -8, 34]]),
    dogApple: () => sc(160, 100, [["dog", 0, 6, 92], ["apple", 96, 24, 62]]),
    // am is are + noun
    teacher: who(TEACHER), engineer: who({ hat: "helmet", shirt: "green" }), driver: who({ hat: "cap", face: "grin", shirt: "pink", acc: ["wheel"] }),
    nurse: who({ hat: "nurse", hair: "long", hc: "brown", shirt: "teal", acc: ["steth"] }), catBig: one("cat"),
    students: crowd([GRAD({ shirt: "green" }), GRAD({ face: "grin", shirt: "yellow" }), GRAD({ hair: "bun", shirt: "red" })], 50),
    police: crowd([{ hat: "police", shirt: "navy" }, { hat: "police", shirt: "navy" }], 58),
    waiters: crowd([{ hair: "bun", hc: "brown", acc: ["bowtie"], shirt: "red" }, { acc: ["bowtie"], shirt: "green" }], 56),
    waiter1: withThing({ acc: ["bowtie"], shirt: "green" }, "cloche", null, 74, 28, 56), cloche: one("cloche"),
    // am is are + adjective
    cold: () => sc(168, 100, [[{ face: "cold", hair: "bun", acc: ["scarf"], shirt: "purple" }, 0, 0, 100], ["therm", 96, 14, 62, C.blue], ["snow", 98, 0, 20], ["snow", 142, 52, 18]]),
    sad: () => sc(150, 100, [[{ face: "sad", hc: "brown", shirt: "green" }, 0, 0, 100], ["cloudRain", 70, -4, 70]]),
    happy: () => sc(150, 100, [[{ hair: "long", face: "grin", shirt: "yellow" }, 0, 0, 100], ["sun", 84, 0, 58]]),
    hungry: () => sc(168, 100, [["cat", 0, 8, 92], ["fishBubble", 66, -8, 82]]),
    young: crowd([KID({ shirt: "green" }), KID({ face: "grin", shirt: "red" })], 52),
    old: () => sc(150, 100, [[{ hair: "bald", acc: ["glasses"], shirt: "purple" }, 0, 0, 100], ["cane", 62, 14, 66]]),
    tired: () => { const c = F.crowd([{ face: "tired", hair: "bun", hc: "brown", shirt: "pink" }, { face: "tired", shirt: "purple" }], 52); return sc(c.w + 20, 100, [[c, 0, 0, c.w], ["moon", c.w - 8, -2, 30]]); },
    beautyGirl: () => sc(140, 100, [[{ hair: "long", shirt: "red" }, 20, 0, 100], ["spark", 0, 6, 26, C.gold], ["spark", 112, 2, 24, C.red], ["spark", 112, 60, 20, C.gold]]),
    handsome: () => sc(140, 100, [[{ hair: "neat", hc: "brown", acc: ["bowtie"], shirt: "navy" }, 20, 0, 100], ["spark", 0, 6, 26, C.gold], ["spark", 112, 2, 24, C.red], ["spark", 112, 60, 20, C.gold]]),
    honest: who({ hc: "brown", shirt: "green", acc: ["heart"] }),
    friendly: withThing({ hair: "bun", hc: "brown", face: "grin", shirt: "yellow" }, "hand", null, 74, 28, 56),
    friendlies: () => { const c = F.crowd([{ hair: "bun", shirt: "red" }, { hair: "bun", hc: "brown", face: "grin", shirt: "yellow" }, { hc: "brown", shirt: "purple" }], 46); return sc(c.w + 54, 100, [[c, 0, 0, c.w], ["hand", c.w - 6, 26, 56]]); },
    spoons: () => sc(160, 100, [["ladle", 0, 8, 86], ["spoon", 92, 6, 66], ["ban", 4, 2, 74]]),
    // have / has
    pencils: () => sc(110, 100, [["pencil", 4, -8, 100, C.yellow], ["pencil", 4, 24, 100, C.teal]]),
    brothers: crowd([{ face: "grin", hc: "brown", shirt: "yellow" }, { shirt: "red" }], 56), cook: one("pot"), beach: one("umbrella"), phone: one("phone"),
    apples: () => sc(150, 100, [["apple", 0, 6, 64], ["apple", 52, 0, 64, C.yellow], ["apple", 38, 38, 64]]),
    watch: one("watch"), laptop: one("laptop"),
    cars: () => sc(150, 100, [["car", 0, 0, 100], ["car", 50, 36, 100, C.teal]]),
    dogs: () => sc(150, 100, [["dog", 0, 10, 80, C.orange], ["dog", 66, 10, 80, C.brown]]),
    tail: () => sc(168, 100, [["tail", 52, 24, 112], ["cat", 0, 0, 100]]),
    // questions
    qStudent: withThing(GRAD({ face: "grin", shirt: "yellow" }), "q", null, 76, 0, 50), qHappy: withThing({ face: "grin", shirt: "green" }, "q", null, 76, 0, 50),
    qKind: withThing({ hair: "long", hc: "brown", face: "smile", shirt: "red" }, "q", null, 76, 0, 50),
    qHungry: () => sc(170, 100, [["dog", 0, 8, 92], ["bowl", 70, 44, 44], ["q", 106, -2, 48]]),
    qYoung: () => { const c = F.crowd([KID({ shirt: "green" }), KID({ face: "grin", shirt: "red" })], 52); return sc(c.w + 40, 100, [[c, 0, 0, c.w], bubbleQ(c.w - 10, -2, 46)]); },
    qTeachers: () => { const c = F.crowd([{ hair: "bun", hc: "brown", acc: ["glasses", "book"], shirt: "pink" }, { acc: ["glasses", "book"], shirt: "purple" }], 52); return sc(c.w + 40, 100, [[c, 0, 0, c.w], bubbleQ(c.w - 10, -2, 46)]); },
    qTired: () => { const c = F.crowd([{ face: "tired", hair: "bun", hc: "brown", shirt: "pink" }, { face: "tired", shirt: "purple" }], 52); return sc(c.w + 40, 100, [[c, 0, 0, c.w], bubbleQ(c.w - 10, -2, 46)]); },
    yes: withThing({ acc: ["glasses", "book"], face: "grin", shirt: "purple" }, "check", null, 74, 0, 40),
    no: withThing({ acc: ["glasses"], face: "neutral", shirt: "pink" }, "cross", null, 74, 0, 40),
    office: () => sc(170, 100, [[{ hat: "helmet", shirt: "green" }, 0, 0, 100], ["laptop", 76, 36, 66], ["ban", 86, 22, 52]]),
    newStudents: crowd([GRAD({ shirt: "green" }), GRAD({ face: "grin", shirt: "yellow" }), GRAD({ shirt: "red" })], 50),
    askDriver: () => sc(300, 100, [[{ hat: "cap", face: "grin", shirt: "pink", acc: ["wheel"] }, 10, 0, 100], bubbleQ(96, -4, 44), ["arrow", 142, 34, 44, C.red], ["dots", 196, 4, 80], ["pencil", 232, 40, 66]]),
    // not
    mahalla: () => sc(300, 132, [
      [{ w: 300, g: `<rect x="0" y="100" width="300" height="32" fill="#f1dfae"/><rect x="128" y="100" width="44" height="32" fill="#7cc6ec"/><path d="M128 108 q11 -6 22 0 t22 0 M128 120 q11 -6 22 0 t22 0" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>` }, 0, 0, 300],
      ["cloud", 24, 4, 56], ["cloud", 190, 10, 46], ["sun", 252, 0, 42], ["ban", 120, 0, 60],
      ["house", 0, 44, 70, C.red], [{ acc: ["glasses"], shirt: "purple" }, 56, 34, 70], ["hand", 104, 66, 30],
      ["house", 234, 44, 70, C.teal], [{ hair: "spiky", face: "cheeky", shirt: "red" }, 170, 34, 70], ["slingshot", 164, 74, 26],
    ]),
    notHungry: () => sc(170, 100, [[{ hc: "brown", face: "grin", shirt: "green" }, 0, 0, 100], ["bowl", 76, 44, 54, C.purple], ["apple", 90, 14, 32], ["ban", 80, 2, 54]]),
    thief: withThing({ hat: "beanie", acc: ["mask"], stripes: true, shirt: "white", face: "grin" }, "gift", null, 80, 36, 56),
    shades: withThing({ hair: "long", acc: ["shades"], shirt: "yellow" }, "sun", null, 80, 0, 50),
    small: () => sc(180, 100, [["elephant", 0, 0, 100], ["ban", 6, 4, 70], ["mouse", 98, 30, 70]]),
    notStudents: () => { const c = F.crowd([{ hc: "brown", shirt: "red" }, { hair: "bun", shirt: "yellow" }], 52); return sc(c.w + 20, 100, [[c, 0, 0, c.w], ["ban", c.w - 52, 0, 64]]); },
    notDesigner: () => sc(170, 100, [[{ shirt: "green" }, 0, 0, 100], ["laptop", 70, 32, 70], ["ban", 80, 18, 56]]),
    unhappy: () => { const c = F.crowd([{ face: "sad", shirt: "green" }, { face: "angry", hc: "brown", shirt: "purple" }], 52); return sc(c.w + 30, 100, [[c, 0, 12, c.w], ["cloudRain", c.w - 30, -8, 56]]); },
    // pronouns
    diamond: one("diamond", null, 78), heMan: who({ hair: "neat", hc: "brown", acc: ["tie"], shirt: "green" }), sheWoman: who({ hair: "long", hc: "brown", shirt: "pink" }), itDog: one("dog"),
    ocean: () => sc(150, 100, [["sun", 98, 0, 46], ["waves", 0, 20, 150], ["boat", 16, 4, 78]]),
    hot: () => sc(150, 100, [["sun", 0, 8, 84], ["therm", 92, 4, 70]]),
    calc: one("calc"), clever: withThing({ acc: ["glasses"], shirt: "yellow" }, "bulb", null, 78, 6, 50),
    musicians: () => { const c = F.crowd([{ face: "grin", shirt: "green" }, { face: "grin", hair: "long", hc: "brown", shirt: "red" }, { face: "grin", hair: "bun", hc: "brown", shirt: "yellow" }], 46); return sc(c.w + 30, 100, [[c, 0, 8, c.w], ["note", c.w - 6, 0, 34]]); },
    friends: () => { const c = F.crowd([{ hc: "brown", shirt: "red" }, { hair: "bun", shirt: "yellow" }], 58); return sc(c.w + 6, 100, [[c, 0, 12, c.w], ["heart", c.w - 40, 0, 32]]); },
    neighbours: () => sc(300, 100, [["house", 0, 6, 92, C.red], ["house", 208, 6, 92, C.teal], [{ shirt: "green" }, 78, 8, 80], [{ hair: "bun", shirt: "red" }, 134, 8, 80], ["fence", 86, 56, 126]]),
    brother: () => { const c = F.crowd([{ face: "wow", shirt: "yellow" }, MAN], 58); return sc(c.w + 6, 100, [[c, 0, 12, c.w], ["heart", 38, 0, 32]]); },
    years: withThing(MAN, "cake", null, 82, 30, 70), london: withThing(MAN, "bigben", null, 88, 0, 66), hasDog: withThing(MAN, "dog", null, 84, 28, 76),
    teacherFace: who(Object.assign({ face: "grin" }, TEACHER)),
    mBrother: who(MAN), mAbror: who({ acc: ["bowtie"], shirt: "navy" }), mFather: who({ hair: "neat", hc: "grey", shirt: "purple", face: "neutral" }), mAlex: who({ hair: "spiky", face: "grin", shirt: "red" }),
    mLaylo: who({ hair: "bun", shirt: "purple" }), mNurse: who({ hat: "nurse", hair: "long", hc: "brown", shirt: "teal", acc: ["steth"] }), mGirl: who({ hair: "long", bow: true, shirt: "pink" }), mBiz: who({ hair: "bun", hc: "brown", shirt: "navy", acc: ["book"] }),
    mDog: one("dog"), mDesk: one("desk"), mLaptop: one("laptop"), mAnimal: one("cat"),
    mWe1: crowd([MAN, { face: "wow", shirt: "yellow" }], 56), mWe2: crowd([{ hair: "bun", shirt: "red" }, { face: "wow", shirt: "yellow" }], 56),
    mYou1: crowd([TEACHER, { hair: "bun", face: "grin", shirt: "yellow" }], 56), mYou2: crowd([{ shirt: "green" }, KID({ face: "grin", shirt: "red" })], 56),
    mThey1: crowd([{ hair: "bun", shirt: "purple" }, { hair: "long", hc: "brown", shirt: "yellow" }], 56), mThey2: crowd([{ hair: "bun", acc: ["glasses", "book"], shirt: "pink" }, { acc: ["glasses", "book"], shirt: "purple" }], 56),
    mThey3: crowd([{ hair: "long", hc: "brown", shirt: "white", acc: ["steth"] }, { shirt: "white", acc: ["steth"] }], 56),
    laylo: who({ hair: "long", shirt: "red" }), abror: who({ acc: ["bowtie"], shirt: "navy" }),
    cleverDog: () => sc(150, 100, [["dog", 0, 8, 90], ["bulb", 88, 4, 52]]),
    weFriends: () => { const c = F.crowd([MAN, { face: "wow", shirt: "yellow" }], 58); return sc(c.w + 6, 100, [[c, 0, 12, c.w], ["heart", 38, 0, 32]]); },
    newYork: () => sc(200, 100, [["city", 0, 6, 94], [{ shirt: "green" }, 78, 10, 82], [KID({ face: "grin", shirt: "red" }), 136, 38, 62]]),
    doctors: () => { const c = F.crowd([{ hair: "long", hc: "brown", shirt: "white", acc: ["steth"] }, { shirt: "white", acc: ["steth"] }], 58); return sc(c.w + 6, 100, [[c, 0, 12, c.w], ["heart", 38, 0, 28], ["heart", c.w - 30, 4, 28]]); },
    // possessive
    abrorBadge: withThing({ acc: ["bowtie"], shirt: "navy" }, "badge", null, 76, 30, 60),
    selfPoint: () => sc(150, 100, [[{ face: "wow", shirt: "yellow" }, 0, 0, 100], ["arrow", 90, 34, 46, C.red]]),
    ownBadge: withThing({ face: "wow", shirt: "yellow" }, "badge", null, 76, 30, 60),
    pI: who({ face: "wow", shirt: "yellow" }), pHe: who(MAN), pShe: who({ hair: "long", hc: "brown", shirt: "pink" }), pIt: one("cat"),
    pWe: crowd([{ hc: "brown", shirt: "red" }, { face: "wow", shirt: "yellow" }], 56), pYou: who({ shirt: "green" }),
    pThey: crowd([{ hair: "bun", shirt: "purple" }, { shirt: "red" }, KID({ face: "grin", shirt: "red" })], 44), gift: one("gift"),
    alex: withThing({ hair: "spiky", face: "grin", shirt: "red" }, "badge", null, 76, 30, 60),
    hisCar: one("car", null, 92), clothes: () => sc(150, 100, [["dress", 0, 6, 80], ["tshirt", 70, 12, 76]]), itsTail: one("cat"),
    smart: () => { const c = F.crowd([GRAD({ shirt: "green" }), GRAD({ face: "grin", shirt: "yellow" }), GRAD({ shirt: "red" })], 46); return sc(c.w + 20, 100, [[c, 0, 8, c.w], ["bulb", c.w - 20, 0, 42]]); },
    wrong: () => sc(150, 100, [["watch", 8, 4, 90], ["cross", 78, 0, 46]]),
    eyes: () => sc(150, 100, [["eyes", 0, 10, 110], ["zz", 100, -6, 52]]),
    // question words
    player: withThing({ face: "grin", stripes: true, shirt: "red" }, "ball", null, 70, 38, 56), playerQ: () => sc(170, 100, [[{ face: "grin", stripes: true, shirt: "red" }, 0, 0, 100], ["ball", 70, 38, 56], ["q", 110, -4, 48]]),
    crowns: () => sc(300, 90, [["crown", 8, 14, 90, null], ["crown", 100, 0, 100], ["crown", 202, 14, 90]]),
    donkey: one("donkey"), who: withThing({ shirt: "yellow" }, "q", null, 76, 0, 50), what: () => sc(150, 100, [["badge", 6, 14, 80], ["q", 84, -4, 50]]),
    where: withThing(MAN, "pin", null, 84, 14, 54), when: () => sc(170, 100, [["calendar", 0, 8, 84], [TEACHER, 70, 0, 100]]),
    how: withThing({ hair: "bun", hc: "brown", face: "grin", shirt: "yellow" }, "hand", null, 74, 28, 56),
    howOld: () => sc(200, 100, [[{ hair: "bald", acc: ["glasses"], shirt: "purple" }, 0, 0, 100], ["ruler", 74, 56, 70], ["q", 136, -2, 48]]),
    fast: () => sc(190, 100, [["arrow", 0, 30, 30, C.grey], ["arrow", 0, 54, 30, C.grey], ["car", 26, 20, 100, null, "zoom"], ["speedcam", 132, 2, 62]]),
    lowBattery: () => sc(170, 100, [[{ face: "tired", shirt: "purple" }, 0, 0, 100], ["battery", 76, 28, 66]]),
    starry: () => sc(170, 100, [[{ hair: "long", shirt: "red" }, 0, 0, 100], ["star", 70, 0, 36], ["star", 104, 24, 30], ["star", 76, 46, 32]]),
  };
  // pictures are made when a page is opened: lessons nobody opens cost nothing
  const arCache = {};
  function art(name, label, cls) {
    const f = ART[name];
    if (!f) return "";
    const svg = f();
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const ar = m ? (m[1] / m[2]).toFixed(3) : "1";
    arCache[name] = ar;
    return `<div class="gb-pic${cls ? " " + cls : ""}" style="--ar:${ar}"${label ? ` aria-label="${esc(label)}"` : ""}>${svg}</div>`;
  }

  // ---------- blocks ----------
  const SPK = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>`;
  const en = (s, cls) => `<button type="button" class="gb-en${cls ? " " + cls : ""}" data-say="${esc(plain(s).replace(/^[-\s]+/, ""))}"><span class="gb-en-t">${ink(s)}</span><i class="gb-spk">${SPK}</i></button>`;
  const uz = (s) => (s ? `<p class="gb-uz">${ink(s)}</p>` : "");
  const gloss = (s) => (s ? `<p class="gb-gloss">${ink(s)}</p>` : "");
  const RAIL = { am: "gb-rail-am", is: "gb-rail-is", are: "gb-rail-are" };
  const TONE = (t) => `gb-tone-${t || "tint"}`;

  // a wide picture goes above the sentence instead of squeezing it
  function row(it, tone) {
    const pic = it.art ? art(it.art, plain(it.en || "")) : "";
    const stack = it.art && +arCache[it.art] > 1.7;
    return `<div class="gb-row ${TONE(it.tone || tone)}${stack ? " is-stack" : ""}">${pic}<div class="gb-row-txt">${it.en ? en(it.en) : ""}${uz(it.uz)}${gloss(it.note)}</div></div>`;
  }

  const B = {
    title: (b) => `<h2 class="gb-h2">${ink(b.text)}</h2>`,
    p: (b) => `<p class="gb-p">${ink(b.text)}</p>`,
    lead: (b) => `<p class="gb-p gb-lead">${ink(b.text)}</p>`,
    key: (b) => `<div class="gb-key"><span class="gb-key-ico" aria-hidden="true">${F.scene(48, 48, [["star", 4, 4, 40]])}</span><p>${ink(b.text)}</p></div>`,
    warn: (b) => `<div class="gb-warn"><span class="gb-warn-x" aria-hidden="true">${F.scene(48, 48, [["cross", 2, 2, 44]])}</span><p>${ink(b.text)}</p></div>`,
    box: (b) => `<div class="gb-box ${TONE(b.tone)}${b.art ? " has-art" : ""}"><p>${ink(b.text)}</p>${b.art ? art(b.art) : ""}</div>`,
    oops: (b) => `<div class="gb-oops${b.art ? " has-art" : ""}"><p>${ink(b.text)}</p>${b.art ? art(b.art) : ""}</div>`,
    note: (b) => `<div class="gb-note"><span class="gb-avatar is-teacher">${art("teacherFace")}</span><div class="gb-bubble"><p>${ink(b.text)}</p>${b.art ? art(b.art, "", "gb-bubble-art") : ""}</div></div>`,
    say: (b) => `<div class="gb-say is-${b.who || "teacher"}"><span class="gb-avatar ${b.who === "student" ? "is-student" : "is-teacher"}">${b.who === "student" ? art("me") : art("teacherFace")}</span><div class="gb-bubble">${b.en ? en(b.text, "is-in") : `<p>${ink(b.text)}</p>`}</div></div>`,
    formula: (b) => `<div class="gb-formula">${ink(b.text)}</div>`,
    foot: (b) => `<p class="gb-foot is-${b.dir || "r"}"><span>${ink(b.text)}</span><i class="gb-foot-arrow" aria-hidden="true">${b.dir === "l" ? "←" : "→"}</i></p>`,
    art: (b) => `<div class="gb-hero ${TONE(b.tone)}">${art(b.art, "", "gb-hero-art")}</div>`,
    tag: (b) => `<div class="gb-tag-row"><span class="gb-chip gb-c-${b.tone || "n"}">${ink(b.text)}</span></div>`,
    cards: (b) => `<div class="gb-list ${b.rail ? RAIL[b.rail] : ""}">${b.items.map((it) => row(it, b.tone)).join("")}</div>`,
    plural: (b) => `<div class="gb-list gb-plural">${b.items.map((it) => `<div class="gb-row gb-tone-white">${art(it.art, "", "is-wide")}<div class="gb-row-txt">${en(it.en)}${uz(it.uz)}</div></div>`).join("")}</div>`,
    ex: (b) => `<div class="gb-list one ${b.rail ? RAIL[b.rail] : ""}">${row(b, b.tone)}</div>`,
    qa: (b) => `<div class="gb-qa">${art(b.art, "", "gb-qa-art")}<div class="gb-qa-txt"><div class="gb-ques">${en(b.q, "is-in")}${uz(b.qNote)}</div><div class="gb-ans">${en(b.a, "is-in")}${b.aNote ? `<p class="gb-uz">${ink(b.aNote)}</p>` : ""}</div></div></div>`,
    cols: (b) => `<div class="gb-cols${b.or ? " has-or" : ""}">${b.cols.map((c, i) => `${i && b.or ? `<span class="gb-or">${esc(b.or)}</span>` : ""}<div class="gb-col ${TONE(c.tone)}">${c.blocks.map(block).join("")}</div>`).join("")}</div>`,
    tiles: (b) => `<div class="gb-tiles">${b.items.map((it) => `<div class="gb-tile">${art(it.art)}</div>`).join("")}</div>`,
    room: (b) => `<div class="gb-room">${art("room", "", "gb-room-art")}${b.pillows.map((p) => `<span class="gb-pillow gb-pl-${p[1]}" style="left:${p[2]}%;top:${p[3]}%;--rot:${p[4]}deg">${esc(p[0])}</span>`).join("")}</div>`,
    table: (b) => `<div class="gb-table-wrap"><div class="gb-table">${b.rows.map((r) => `<div class="gb-tr"><span class="gb-td">${ink(r[0])}</span><span class="gb-dots" aria-hidden="true"></span><span class="gb-v gb-${r[1]} gb-big">${r[1]}</span></div>`).join("")}</div>${b.art ? art(b.art, "", "gb-table-art") : ""}</div>`,
    map: (b) => `<div class="gb-map">${b.rows.map((r) => `<div class="gb-map-row ${TONE(r.tone)}"><div class="gb-map-items">${r.items.map((it) => `<figure class="gb-map-it">${art(it[0])}<figcaption>${esc(it[1])}</figcaption></figure>`).join("")}</div><span class="gb-map-eq" aria-hidden="true">=</span>${en(r.eq, "gb-map-pr gb-pr-" + r.eq)}</div>`).join("")}</div>`,
    move: (b) => `<div class="gb-move" data-move>${b.rows.map((r, i) => `<div class="gb-move-row${i ? " is-to" : " is-from"}">${r.map((t) => `<span class="gb-blk gb-blk-${t[2]}" data-k="${t[0]}">${esc(t[1])}</span>`).join("")}</div>${i < b.rows.length - 1 ? `<div class="gb-move-arrow" aria-hidden="true">↓</div>` : ""}`).join("")}<button type="button" class="gb-replay" aria-label="Qayta koʻrsatish">↻</button></div>`,
    pron: (b) => `<div class="gb-pron">${b.items.map((it) => `<figure class="gb-pron-it ${TONE(it[3])}">${art(it[0])}<figcaption>${en(it[1] + " - [poss:" + it[2] + "]", "is-in")}</figcaption></figure>`).join("")}<figure class="gb-pron-it gb-tone-gift">${art("gift")}</figure></div>`,
    end: () => `<div class="gb-end" aria-hidden="true">${F.scene(120, 30, [["star", 4, 0, 28], ["spark", 46, 6, 20, C.gold], ["star", 88, 0, 28]])}</div>`,
  };
  function block(b) { return (B[b.t] || (() => ""))(b); }

  // ---------- the lessons (text exactly as in the lesson books) ----------
  const L = {};
  L.sec1_top1 = [[
    { t: "p", text: "Ot soʻz turkumidagi soʻzlarga ==-s, -es yoki -ies== qoʻshimchalarini qoʻshish orqali ularning koʻplikdagi shakllarini yasaymiz." },
    { t: "formula", text: "[s1:-s] , [s2:-es] , [s3:ies] = [lar:-lar]" },
    { t: "plural", items: [
      { art: "plBook", en: "Book - book[s1:s]", uz: "= kitob - kitob[lar:lar]" },
      { art: "plWatch", en: "Watch - watch[s2:es]", uz: "= soat - soat[lar:lar]" },
      { art: "plGlass", en: "Glass - glass[s2:es]", uz: "= koʻzoynak - koʻzoynak[lar:lar]" },
      { art: "plDish", en: "Dish - dish[s2:es]", uz: "= idish - idish[lar:lar]" },
      { art: "plFlag", en: "Country - countr[s3:ies]", uz: "= davlat - davlat[lar:lar]" },
      { art: "plBaby", en: "Baby - bab[s3:ies]", uz: "= chaqaloq - chaqaloq[lar:lar]" },
    ] },
    { t: "note", text: "Inglizlar, huddi bizlardek hamma otlardan keyin **-lar** qoʻshimchasini qoʻshib qoʻyavermaysizlarmi, ishni koʻpaytirmay?! -s, -es, ies. Ehhey...." },
  ]];

  L.sec1_top2 = [[
    { t: "lead", text: "Oʻzbeklar uchun noaniq artikli **oʻz nomi bilan noaniq**, chunki bu narsa bizning tilimizda uchramaydi." },
    { t: "box", tone: "lav", text: "**Loʻnda qilib aytganda** artikllar otlardan oldin qoʻyiladigan ==kichik bir soʻzlardir==. Ular gapirilayotgan otning ==aniq yoki noaniqligini== bildirish uchun ishlatiladi:" },
    { t: "cols", cols: [
      { tone: "cream", blocks: [{ t: "tag", text: "NOANIQ", tone: "y" }, { t: "art", art: "anyBook", tone: "clear" }, { t: "say", who: "student", text: "Menga bir kitob olib kel." }, { t: "p", text: "(Qaysi kitobni? Hajmi qanday boʻlsin? Rangichi? - demak qaysi kitobligi aniq emas, har qanday kitob nazarda tutilyapti)." }] },
      { tone: "mint", blocks: [{ t: "tag", text: "ANIQ", tone: "t" }, { t: "art", art: "oneBook", tone: "clear" }, { t: "say", who: "teacher", text: "Olib kelgan kitobingning 67-betini nima qilding? Yeb qoʻydingmi?" }, { t: "p", text: "(Endi bir aniq kitob haqida gap ketyapti - olib kelingan kitob)." }] },
    ] },
    { t: "p", text: "Shu farqlarni koʻrsatish uchun inglizlar noaniq yoki aniq artikllardan foydalanishadi. Lekin koʻrib turganingizdek bizda bunga ehtiyoj yoʻq." },
    { t: "foot", text: "Keling, xozircha noaniq artikl haqida gaplashib turaylik. Uyogʻi bir gap boʻlar." },
  ], [
    { t: "title", text: "[a:A] va [an:An]" },
    { t: "lead", text: "Bu ikki soʻz oʻzbek tiliga [c-r:BIR] deb, tarjima qilinsa maqsadga muvofiq boʻladi." },
    { t: "ex", art: "anyBook", tone: "lav", en: "I have [a:a] book", uz: "- Menda bitta kitob bor", note: "(Noaniq bir kitob - nomi nima, eskimi, yangimi, qimmatmi, arzonmi. Xullas, noaniq-da)." },
    { t: "ex", art: "teachers", tone: "cream", en: "He is [a:a] teacher", uz: "- U oʻqituvchi", note: "(Qaysi oʻqituvchi? Bu yerda oʻqituvchilar koʻp-ku! Qaysi fandan kiradigani? Umuman kirmaydigani ham bor. Oʻshami? Xullas, bir noaniq oʻqituvchi-da)." },
    { t: "box", tone: "white", text: "[a:A] ni tushundik. Lekin [an:AN] ga pishirib qoʻyibdimi, deysizmi? Unday demang, jigar. U ham kerak. U [v:a], [v:e], [v:i], [v:o], [v:u] harflari bilan boshlanadigan soʻzlardan oldin qoʻyiladi. Qolgan harflar bilan boshlanuvchi soʻzlardan oldin esa [a:A] ishlatiladi:" },
    { t: "cols", cols: [
      { tone: "mint", blocks: [{ t: "cards", items: [
        { art: "dog", tone: "white", en: "[a:A] [f1:d]og." },
        { art: "cat", tone: "white", en: "[a:A] [f1:c]at." },
        { art: "waiter", tone: "white", en: "[a:A] [f1:w]aiter." }] }] },
      { tone: "peach", blocks: [{ t: "cards", items: [
        { art: "apple", tone: "white", en: "[an:An] [f2:a]pple." },
        { art: "orange", tone: "white", en: "[an:An] [f2:o]range." },
        { art: "egg", tone: "white", en: "[an:An] [f2:e]gg." }] }] },
    ] },
  ], [
    { t: "oops", art: "pencil", text: "**Uzr jigar, bir narsada xato qilibman.** [an:AN] [v:a], [v:e], [v:i], [v:o], [v:u] [ring:tovushlari] bilan boshlanadigan soʻzlardan oldin ishlatilardi; [a:A] ham shu - yuqoridagi ==beshta tovushdan tashqari== qolgan barcha tovushlar bilan boshlanuvchi soʻzlardan oldin ishlatiladi:" },
    { t: "cols", cols: [
      { tone: "mint", blocks: [{ t: "cards", items: [{ art: "university", tone: "white", en: "[a:A] [f1:u]niversity", note: "([ok:yuniversiti], deb oʻqiladi, [x:universiti] deb emas)." }] }] },
      { tone: "peach", blocks: [{ t: "cards", items: [{ art: "hour", tone: "white", en: "[an:An] [mute:h][f2:ou]r", note: "([ok:aur], deb oʻqiladi, [x:haur] deb emas)." }] }] },
    ] },
    { t: "key", text: "Loʻnda qilib aytganda [c-t:A undosh], [c-r:AN unli] tovush bilan boshlanuvchi soʻzlardan oldin ishlatiladi." },
    { t: "note", art: "crown", text: "Agar Qirol Charles menga qarab, \"Oʻgʻlim, ingliz tiliga oʻzgartirish kirit\", desa, men hech ikkilanmay shu kasofat noaniq artikllarni ingliz tilidan chiqarib tashlardim. Lekin aniq artikli [c-r:THE] ni qoldirardim. Chunki bizga aniq narsa muhim-da. Toʻgʻrimi, jigar?" },
  ]];

  const VERB_PILLOWS = [["AM,", "t", 29, 56, -10], ["IS,", "y", 47, 63, 6], ["ARE", "r", 66, 57, 14]];
  L.sec2_top3 = [[
    { t: "p", text: "Bilasizmi fe'l nima? Fe'l ish harakatni ifodalovchi soʻz hisoblanadi: [c-y:urmoq], [c-y:yugurmoq], [c-y:sugʻurmoq], [c-y:oʻgirmoq]. Bularning barchasi sizdan tana harakatini talab qiladi." },
    { t: "tiles", items: [{ art: "punch" }, { art: "run" }, { art: "pull" }, { art: "turn" }] },
    { t: "lead", text: "Lekin ingliz tilida uchta fe'l bor. Men ularni **DARMAYET FE'LLAR** deb atayman, chunki bu uchala darmayetlar ==harakatni emas, holatni== ifoda etishadi." },
    { t: "room", pillows: VERB_PILLOWS },
  ], [
    { t: "cards", items: [
      { art: "me", tone: "cream", uz: "Men oʻquvchiman." },
      { art: "stepGirl", tone: "peach", uz: "U qiz xolamning oʻgay qizi." },
      { art: "lazy", tone: "lav", uz: "Ular ishyoqmas, tekinxoʻrlar." },
      { art: "youLot", tone: "mint", uz: "Senlar odam-podammassanlar." },
    ] },
    { t: "box", tone: "lav", text: "Oʻzbek tilida ham yuqoridagi olmoshdan keyin keladigan qism **FE'L KESIM** deb ataladi: **Men** [ring:oʻquvchiman]." },
    { t: "say", who: "student", text: "- Demak, oʻzbek tilida ham tekinxoʻr fe'llar bor ekanda." },
    { t: "say", who: "teacher", text: "- Ha va yoʻq. Ma'noviy jihatdan bor, lekin alohida bir soʻz sifatida yoʻq." },
    { t: "p", text: "Ingliz tilida ular uchta: [am:AM], [is:IS], [are:ARE]. Bu uchalasi olmoshlar bilan ==osh-qatiq==:" },
    { t: "table", art: "plov", rows: [["**I** (men) -", "am"], ["**He, she, it** (U) -", "is"], ["**We** (Biz), **you** (Siz), **they** (Ular) -", "are"]] },
    { t: "foot", text: "Shu uchala fe'ldan keyin holatni ifodalovchi har qanday ot yoki sifat kelishi mumkin:" },
  ]];

  L.sec2_top4 = [[
    { t: "box", tone: "white", art: "dogApple", text: "Aytgancha, otlardan oldin nima qoʻyishi kerakligi esingizdami? [a:A] yoki [an:AN]." },
    { t: "cards", rail: "am", items: [
      { art: "teacher", tone: "lav", en: "I [am:am] [a:a] [n:teacher]." },
      { art: "engineer", tone: "mint", en: "I [am:am] [an:an] [n:engineer]." },
    ] },
    { t: "cards", rail: "is", items: [
      { art: "driver", tone: "peach", en: "He [is:is] [a:a] [n:driver]." },
      { art: "nurse", tone: "mint", en: "She [is:is] [a:a] [n:nurse]." },
      { art: "catBig", tone: "lav", en: "It [is:is] [a:a] [n:cat]." },
    ] },
    { t: "ex", art: "students", tone: "cream", rail: "are", en: "We [are:are] [n:student][s1:s]", note: "(Koʻplik qoʻshimchalari esingizdami? WE biz degani, demak koʻpchilik haqida gap ketyapti. -lar qoʻshimchasini esdan chiqarib, butun mahallaga sharmanda boʻlmang, jigar)." },
  ], [
    { t: "ex", art: "police", tone: "lav", rail: "are", en: "They [are:are] [n:police officer][s1:s]." },
    { t: "cards", rail: "are", items: [
      { art: "waiters", tone: "cream", en: "You [are:are] [n:waiter][s1:s]", uz: "- Siz[lar:lar] girgittonsiz[lar:lar]." },
      { art: "waiter1", tone: "peach", en: "You [are:are] [a:a] [n:waiter]", uz: "- Siz girgittonsiz." },
    ] },
    { t: "note", art: "cloche", text: "Yana restoranga kirib, ofitsiant deyishni oʻrniga [c-r:GIRGITTON] deb oʻtirmang. Xozir ofitsiant soʻzi kengroq tarqalgan. Uni ustiga [c-r:GIRGITTON] soʻzining erkalash ma'nosi ham bor." },
  ]];

  L.sec2_top5 = [[
    { t: "ex", art: "cold", tone: "lav", rail: "am", en: "I [am:am] [j:cold]." },
    { t: "cards", rail: "is", items: [
      { art: "sad", tone: "mint", en: "He [is:is] [j:sad]." },
      { art: "happy", tone: "cream", en: "She [is:is] [j:happy]." },
      { art: "hungry", tone: "peach", en: "It [is:is] [j:hungry]." },
    ] },
    { t: "cards", rail: "are", items: [
      { art: "young", tone: "cream", en: "We [are:are] [j:young]." },
      { art: "old", tone: "lav", en: "You [are:are] [j:old]." },
      { art: "tired", tone: "mint", en: "They [are:are] [j:tired]." },
    ] },
    { t: "warn", text: "Yana [x:**I AM A BEAUTIFUL**], deb oʻtirmang. Sifatlardan oldin A, AN artikllari ishlatilmaydi." },
  ], [
    { t: "say", who: "teacher", text: "Lekin sifatdan oldin ham A va AN artikllarini ishlatgingiz kelyapti-ya? Siz uchun ilojini topamiz, jigar." },
    { t: "key", text: "Shunchaki [c-t:sifatdan keyin] [c-r:ot soʻz turkumiga] mansub bir soʻz kelishi kerak:" },
    { t: "cards", items: [
      { art: "beautyGirl", tone: "peach", en: "I [am:am] [a:a] [j:beautiful] [n:girl]." },
      { art: "handsome", tone: "lav", en: "I [am:am] [a:a] [j:handsome] [n:boy]." },
    ] },
    { t: "box", tone: "navy", text: "Shoshmang, shoshmang, jigar, siz **\"I am a beautiful boy\"**, deyapsizmi? Beautiful sifati koʻpincha ayollarga nisbatan ishlatiladi. Siz erkaksiz - [c-y:HANDSOME], degan soʻzni ishlating." },
    { t: "ex", art: "honest", tone: "mint", rail: "is", en: "He [is:is] [an:an] [j:honest] [n:man]", note: "(honest - [ok:onist] deb oʻqiladi. A unli tovush bilan boshlangani uchun AN artiklini qoʻydik. Sifatning oʻzi bilan artikl ishlatilmaydi. Lekin sifatdan keyin yuqoridagi kabi ot boʻlsa, artikl albatta ishlatiladi. A yoki AN ning qoʻllanishi sifatning dastlabki tovushining unli yoki undosh ekanligiga bogʻliq)." },
    { t: "ex", art: "friendly", tone: "cream", rail: "is", en: "She [is:is] [a:a] [j:friendly] [n:person]." },
  ], [
    { t: "ex", art: "friendlies", tone: "mint", rail: "are", en: "They [are:are] [j:friendly] [n:people]", note: "(Ular olmoshi koʻplikni bildiradi. A va AN artikllari birlikdagi otlar bilan ishlatiladi. Demak, koʻplik ma'nosi bormi, A va AN artikllariga dam beramiz. Ularni oq qilamiz!" },
    { t: "oops", art: "spoons", text: "**Jigar, bir choʻmich, yoʻgʻe, bir qoshiq qonimdan keching.** Men kazzob sizga yolgʻon gapirgan edim. Birlikdagi otni koʻplikka aylantirish uchun -s, -es, -ies qoʻshimchasini qoʻshish kerak degandim. Lekin ba'zi otlar qaysar, muttaham ekan. Yuqoridagi qoʻshimchalar bilan urishib qolishganmi deyman, ularning koʻplik shakldagi -s tegmagan koʻrinishlari bormish:" },
    { t: "plural", items: [
      { art: "person", en: "Person - [irr:people]" },
      { art: "man", en: "Man - m[irr:e]n" },
      { art: "woman", en: "Woman - wom[irr:e]n" },
      { art: "child", en: "Child - child[irr:ren]" },
    ] },
    { t: "p", text: "Shuning uchun [ok:\"They are friendly people\"], dedim-da, [x:\"They are friendly persons\"], emas)." },
  ]];

  L.sec2_top6 = [[
    { t: "p", text: "**Hamma insonning kamchiligi boʻladi.** Mening kamchiligim goh-gohida yolgʻon gapirib turaman. Tepada darmayet fe'llar faqat uchta degandim. Ular koʻpchilik ekan - [have:HAVE] bilan [has:HAS] ni ham darmayetlar safiga qoʻshib qoʻyavering, jigar." },
    { t: "room", pillows: [["AM", "t", 22, 58, -10], ["IS", "y", 35, 64, 4], ["ARE", "r", 49, 58, 10], ["HAVE", "t", 63, 63, -6], ["HAS", "r", 78, 56, 12]] },
    { t: "cols", cols: [
      { tone: "mint", blocks: [
        { t: "p", text: "Lekin ular ==ellikka ellik== darmayet ekan, chunki ikkita ma'nosi bor ekan-da. Birinchi ma'nosi **BOR** - bunda ular aniq darmayet, chunki ma'noviy jihatdan hech qanday harakatni ifodalamaydi:" },
        { t: "cards", items: [
          { art: "pencils", tone: "white", en: "I [have:have] two [n:pencils]", uz: "- Menda ikkita qalam bor." },
          { art: "brothers", tone: "white", en: "He [has:has] two [n:brothers]", uz: "- Uning ikkita akasi bor." }] }] },
      { tone: "grey", blocks: [
        { t: "p", text: "Ikkinchi ma'nosida ular toʻlaqonli fe'l - **QILMOQ, OʻTKAZMOQ**:" },
        { t: "cards", items: [
          { art: "cook", tone: "white", uz: "Men kechki ovqat qilyapman." },
          { art: "beach", tone: "white", uz: "Ular ta'tilni yaxshi oʻtkazyapti." }] }] },
    ] },
    { t: "foot", dir: "l", text: "Bizga xozircha birinchi darmayetlik ma'nosi kerak." },
  ], [
    { t: "cols", cols: [
      { tone: "mint", blocks: [
        { t: "p", text: "[c-t:I, we, you, they] olmoshlari bilan [have:HAVE] fe'lini ishlatamiz:" },
        { t: "cards", items: [
          { art: "phone", tone: "white", en: "I [have:have] [a:a] new [n:phone]." },
          { art: "apples", tone: "white", en: "We [have:have] five [n:apple][s1:s]." },
          { art: "watch", tone: "white", en: "You [have:have] [a:a] nice [n:watch]." },
          { art: "cars", tone: "white", en: "They [have:have] nice [n:car][s1:s]." }] }] },
      { tone: "peach", blocks: [
        { t: "p", text: "[c-r:He, she, it] olmoshlari bilan esa [has:HAS] fe'lini ishlatamiz:" },
        { t: "cards", items: [
          { art: "laptop", tone: "white", en: "He [has:has] [a:a] new [n:laptop]." },
          { art: "dogs", tone: "white", en: "She [has:has] five [n:dog][s1:s]." },
          { art: "tail", tone: "white", en: "It [has:has] [a:a] long [n:tail]." }] }] },
    ] },
  ]];

  L.sec3_top1 = [[
    { t: "p", text: "Shu desangiz, **You are a student**, gapini soʻroqqa aylantirmoqchi boʻlsangiz, darmayet [am:AM], [is:IS], [are:ARE] fe'llarini koʻngliga qarashga majbursiz. ==Chunki soʻroq gap yasalishi uchun darmayetlar gap boshiga oʻtishi kerak==:" },
    { t: "move", rows: [[["you", "You", "pr"], ["are", "are", "are"], ["st", "a student", "n"]], [["are", "Are", "are"], ["you", "you", "pr"], ["st", "a student?", "n"]]] },
    { t: "ex", art: "qStudent", tone: "mint", rail: "am", en: "[am:AM] I [a:a] [n:student]?" },
    { t: "cards", rail: "is", items: [
      { art: "qHappy", tone: "cream", en: "[is:IS] he [j:happy]?" },
      { art: "qKind", tone: "peach", en: "[is:IS] she [a:a] [j:kind] [n:person]?" },
      { art: "qHungry", tone: "lav", en: "[is:IS] it [j:hungry]?" },
    ] },
  ], [
    { t: "cards", rail: "are", items: [
      { art: "qYoung", tone: "cream", en: "[are:ARE] we [j:young]?" },
      { art: "qTeachers", tone: "lav", en: "[are:ARE] you [n:teachers]?" },
      { art: "qTired", tone: "mint", en: "[are:ARE] they [j:tired]?" },
    ] },
    { t: "lead", text: "Savol boʻlgandan keyin unga javob ham boʻlishi kerak-da, jigar." },
    { t: "warn", text: "Lekin oddiy qilib, [c-r:YES] yoki [c-r:NO] deb qoʻyish ham yaramaydi." },
    { t: "say", who: "teacher", text: "Sizga kimdir, [is:IS] **HE A TEACHER?**, deb savol bersa, javobingiz quyidagicha boʻlishi mumkin:" },
    { t: "cols", or: "OR", cols: [
      { tone: "mint", blocks: [{ t: "cards", items: [{ art: "yes", tone: "white", en: "Yes, he [is:is]." }] }] },
      { tone: "peach", blocks: [{ t: "cards", items: [{ art: "no", tone: "white", en: "No, he [is:is] [not:not]." }] }] },
    ] },
    { t: "box", tone: "lav", text: "(Inkor ma'nosidagi javobda [is:IS NOT], [are:ARE NOT] => **isn't, aren't** boʻlib oʻzgarib ketishi ham mumkin)." },
  ], [
    { t: "qa", art: "office", q: "- [are:Are] you [an:an] [n:office worker]?", a: "- No, I [am:am] [not:not]", aNote: "(YOKI => NO, I'm not)." },
    { t: "qa", art: "newStudents", q: "- [are:Are] they [j:new] [n:students]?", a: "- Yes, they [are:are]", aNote: "(No, they aren't YOKI => No, they are not)." },
    { t: "p", text: "Xullas, kimdir sizdan **Are you a driver?**, deb soʻrasa -" },
    { t: "art", art: "askDriver", tone: "tint" },
  ]];

  L.sec3_top2 = [[
    { t: "p", text: "Xayriyat, inkor shaklini yasashda darmayetlarga ishimiz tushmaydigan boʻldi. Lekin narigi mahalladan bitta [c-y:tirranchani] yalinib olib kelishga majburmiz. U bizga juda kerak. Usiz inkor shakl yasab boʻlmaydi. Uni doʻstlari [not:NOT] deb chaqirishar ekan." },
    { t: "art", art: "mahalla", tone: "tint" },
    { t: "lead", text: "Shunchaki uni darmayet [am:AM], [is:IS], [are:ARE] fe'llaridan soʻng qoʻying. Shu bilan inkor shakl ==burningizning tagida turibdi-da==:" },
    { t: "move", rows: [[["i", "I", "pr"], ["am", "am", "am"], ["h", "hungry.", "j"]], [["i", "I", "pr"], ["am", "am", "am"], ["not", "NOT", "not"], ["h", "hungry.", "j"]]] },
    { t: "ex", art: "notHungry", tone: "cream", rail: "am", en: "I [am:am] [not:NOT] [j:hungry]." },
  ], [
    { t: "cards", items: [
      { art: "thief", tone: "peach", en: "He [is:is] [not:NOT] [a:a] [j:good] [n:person]." },
      { art: "shades", tone: "cream", en: "She [is:is] [not:NOT] [j:cold]." },
      { art: "small", tone: "lav", en: "It [is:is] [not:NOT] [a:a] [j:big] [n:animal]." },
      { art: "notStudents", tone: "mint", en: "We [are:are] [not:NOT] [n:students]." },
      { art: "notDesigner", tone: "cream", en: "You [are:are] [not:NOT] [a:a] [j:digital] [n:designer]." },
      { art: "unhappy", tone: "lav", en: "They [are:are] [not:NOT] [j:happy]." },
    ] },
  ]];

  L.sec4_top3 = [[
    { t: "box", tone: "white", art: "diamond", text: "Olmosh degan soʻz ==olmos degan soʻzga oʻxshab ketadi==. Chunki oʻzbek tili uchun olmoshlar olmosdek qimmatli va zarur. Ular gaplarimizning ajralmas bir boʻlagidir. Ingliz tilida ham olmoshlarning ahamiyati juda katta. Biz yuqorida kishilik olmoshlari bilan tanishdik ([am:I], [is:he], [is:she], [is:it], [are:we], [are:you], [are:they])." },
    { t: "lead", text: "[pr:HE] olmoshi **U** degan ma'noni anglatib, erkak jinsiga nisbatan ishlatiladi:" },
    { t: "ex", art: "heMan", tone: "mint", rail: "is", en: "He [is:is] [a:a] [j:handsome] [n:man]." },
    { t: "lead", text: "[c-r:SHE] esa buning ziddi - ayol jinsiga nisbatan ishlatiladi:" },
    { t: "ex", art: "sheWoman", tone: "peach", rail: "is", en: "She [is:is] [a:a] [j:beautiful] [n:woman]." },
  ], [
    { t: "lead", text: "[c-y:IT] soʻzi ham **U** yoki **BU** deb tarjima qilinib, hayvonlar va jonsiz narsalar uchun ishlatiladi:" },
    { t: "cards", rail: "is", items: [
      { art: "itDog", tone: "cream", en: "It [is:is] [a:a] [n:dog]." },
      { art: "ocean", tone: "mint", en: "It [is:is] [an:an] [n:ocean]." },
    ] },
    { t: "lead", text: "Ba'zida gapning ma'nosiga qarab, umuman boshqa ma'noni ham anglatishi mumkin:" },
    { t: "ex", art: "hot", tone: "peach", rail: "is", en: "It [is:is] [j:hot]", uz: "- Xavo issiq." },
    { t: "say", who: "student", en: true, text: "- What [is:is] 12+12?" },
    { t: "say", who: "teacher", en: true, text: "- It [is:is] 24 (Javob 24)." },
  ], [
    { t: "lead", text: "[c-t:YOU] ning ikki ma'nosi bor: **siz** va **sizlar** (birlik va koʻplik)." },
    { t: "cols", cols: [
      { tone: "mint", blocks: [{ t: "p", text: "[c-t:SIZ] ma'nosida birlikni," }, { t: "cards", items: [{ art: "clever", tone: "white", en: "You [are:are] [a:a] [j:clever] [n:person]." }] }] },
      { tone: "peach", blocks: [{ t: "p", text: "[c-t:SIZLAR] ma'nosida esa koʻplikni bildiradi:" }, { t: "cards", items: [{ art: "musicians", tone: "white", en: "You [are:are] [j:talented] [n:musicians]." }] }] },
    ] },
    { t: "lead", text: "[pr:WE] va [c-r:THEY] olmoshlari koʻplikdagi olmoshlar hisoblanib, ulardan keyin koʻplikdagi otlar keladi:" },
    { t: "cards", rail: "are", items: [
      { art: "friends", tone: "mint", en: "We [are:are] [j:close] [n:friends]." },
      { art: "neighbours", tone: "peach", en: "They [are:are] [j:wonderful] [n:neighbours]." },
    ] },
  ], [
    { t: "p", text: "Yana bir muhim nuqta bor. Olmoshlar gapda qaysidir ==ot soʻz turkumidagi soʻzga== ishora qilish uchun ishlatiladi:" },
    { t: "cards", items: [
      { art: "brother", tone: "cream", en: "I [have:have] [a:a] [ring:brother]." },
      { art: "years", tone: "peach", en: "[ring:He] [is:is] 25 years old." },
      { art: "london", tone: "mint", en: "[ring:He] [is:is] in London." },
      { art: "hasDog", tone: "lav", en: "[ring:He] [has:has] [a:a] [n:dog]." },
    ] },
    { t: "say", who: "teacher", text: "Yuqoridagi birinchi gapda soʻzlovchi akasi borligini aytdi va kelgusi gaplarda [c-y:\"aka\"] soʻzini ishlatib oʻtirmay oʻrniga unga ishora qiladigan [c-y:\"he\"] olmoshini ishlatib qoʻyaverdi." },
    { t: "key", text: "Demak, olmoshning oʻrniga unga ma'no jihatdan mos keladigan har qanday [c-t:ot soʻz turkumidagi soʻz] ishlatilishi mumkin:" },
  ], [
    { t: "map", rows: [
      { tone: "lav", eq: "he", items: [["mBrother", "A brother,"], ["mAbror", "Abror,"], ["mFather", "father,"], ["mAlex", "Alex"]] },
      { tone: "peach", eq: "she", items: [["mLaylo", "Laylo,"], ["mNurse", "a nurse,"], ["mGirl", "a girl,"], ["mBiz", "a businesswoman"]] },
      { tone: "cream", eq: "it", items: [["mDog", "A dog,"], ["mDesk", "a desk,"], ["mLaptop", "a laptop,"], ["mAnimal", "an animal"]] },
      { tone: "mint", eq: "we", items: [["mWe1", "Michael and I,"], ["mWe2", "My friend and I"]] },
      { tone: "lav", eq: "you", items: [["mYou1", "You and your friends,"], ["mYou2", "you and your children"]] },
      { tone: "peach", eq: "they", items: [["mThey1", "Kate and Susan,"], ["mThey2", "teachers,"], ["mThey3", "doctors"]] },
    ] },
  ], [
    { t: "p", text: "Soʻngra yuqoridagi otlardan soʻng ular anglatayotgan olmoshga qarab [am:AM], [is:IS], [are:ARE] fe'llaridan birini qoʻyamiz:" },
    { t: "cards", items: [
      { art: "laylo", tone: "peach", en: "Laylo [is:is] [j:beautiful]." },
      { art: "abror", tone: "lav", en: "Abror [is:is] [j:handsome]." },
      { art: "cleverDog", tone: "cream", en: "[a:A] dog [is:is] [j:clever]." },
      { art: "weFriends", tone: "mint", en: "Michael and I [are:are] [n:friends]." },
      { art: "newYork", tone: "cream", en: "You and your children [are:are] in New York." },
      { art: "doctors", tone: "peach", en: "[n:Doctors] [are:are] [j:kind]." },
    ] },
  ]];

  L.sec4_top4 = [[
    { t: "ex", art: "abrorBadge", tone: "cream", uz: "[c-t:Men] Abrorman.", note: "[c-y:Mening] ismim Abror." },
    { t: "p", text: "Yuqoridagi gaplarning ikkalasida ham olmoshlar ishtirok etgan. Lekin ular ma'nosi va turiga koʻra har xil:" },
    { t: "cols", cols: [
      { tone: "mint", blocks: [{ t: "art", art: "selfPoint", tone: "clear" }, { t: "p", text: "Birinchi gapdagi [c-t:MEN] olmoshi oʻtgan darsda aytganimizdek **kishilik olmoshi** hisoblanadi." }] },
      { tone: "peach", blocks: [{ t: "art", art: "ownBadge", tone: "clear" }, { t: "p", text: "Ikkinchi gapdagi [c-y:MENING] olmoshida **egalik qilish** ma'nosi borligi uchun uni **egalik olmoshi** deb atashadi." }] },
    ] },
    { t: "pron", items: [["pI", "I", "my", "mint"], ["pHe", "He", "his", "tint"], ["pShe", "She", "her", "tint"], ["pIt", "It", "its", "tint"], ["pWe", "We", "our", "peach"], ["pYou", "You", "your", "peach"], ["pThey", "They", "their", "peach"]] },
  ], [
    { t: "ex", art: "alex", tone: "cream", rail: "is", en: "[poss:My] [n:name] [is:is] Alex." },
    { t: "cards", items: [
      { art: "hisCar", tone: "peach", en: "[poss:His] [n:car] [is:is] [j:new]." },
      { art: "clothes", tone: "cream", en: "[poss:Her] [n:clothes] [are:are] [j:beautiful]." },
      { art: "itsTail", tone: "lav", en: "[poss:Its] [n:tail] [is:is] [j:short]." },
      { art: "smart", tone: "mint", en: "[poss:Our] [n:students] [are:are] [j:smart]." },
      { art: "wrong", tone: "cream", en: "[poss:Your] [n:watch] [is:is] [j:wrong]." },
      { art: "eyes", tone: "peach", en: "[poss:Their] [n:eyes] [are:are] [j:tired]." },
    ] },
  ]];

  L.sec4_top5 = [[
    { t: "p", text: "Yuqorida [am:AM], [is:IS], [are:ARE] fe'llarining gapdagi soʻroq shakllarini yasayotganimizda ularni shunchaki ==egadan oldinga== oʻtkazib qoʻygandik:" },
    { t: "cards", items: [
      { art: "player", tone: "lav", en: "You [are:are] [a:a] [n:football player]" },
      { art: "playerQ", tone: "cream", en: "[are:Are] you [a:a] [n:football player]?" },
    ] },
    { t: "move", rows: [[["you", "You", "pr"], ["are", "are", "are"], ["fp", "a football player", "n"]], [["are", "Are", "are"], ["you", "you", "pr"], ["fp", "a football player?", "n"]]] },
    { t: "box", tone: "cream", art: "crowns", text: "Bizda endi yana shunaqangi [c-r:\"akalar\"] borki, hatto [am:AM], [is:IS], [are:ARE] dan ham obroʻsi katta. Ularni gapning eng boshiga olib chiqmasak, oriyatlari kelib ketib qolishmasin." },
    { t: "box", tone: "lav", art: "donkey", text: "Lekin [am:AM], [is:IS], [are:ARE] ham qaysar-da. Birinchi boʻlmasam ham hech boʻlmasa joyimda qolaman deb oyoq tirab turib oldi:" },
    { t: "move", rows: [[["are", "are", "are"], ["you", "you?", "pr"]], [["w", "Who", "qw"], ["are", "are", "are"], ["you", "you?", "pr"]]] },
  ], [
    { t: "cards", items: [
      { art: "who", tone: "lav", en: "[q:Who] [are:are] you?" },
      { art: "what", tone: "cream", en: "[q:What] [is:is] your name?" },
      { art: "where", tone: "peach", en: "[q:Where] [is:is] he?" },
      { art: "when", tone: "mint", en: "[q:When] [is:is] your class?" },
      { art: "how", tone: "cream", en: "[q:How] [are:are] you?" },
    ] },
    { t: "formula", text: "[c-l:How] + [c-l:sifat] = [c-r:qanchalik]" },
    { t: "ex", art: "howOld", tone: "lav", en: "[q:How] [j:old] [is:is] he?", uz: "= U qanchalik qari?" },
    { t: "lead", text: "Toʻgʻridan-toʻgʻri tarjima qilsak, ma'nosi juda qoʻpol chiqarkan. Keling, uni [ok:\"Uning yoshi nechida?\"], deb tarjima qilamiz." },
  ], [
    { t: "qa", art: "fast", q: "- [q:How] [j:fast] [is:is] your car?", qNote: "- Moshinangiz qanchalik tez?", a: "- It [is:is] [j:super fast]", aNote: "- U juda tez, daxshat tez, shtraf olishga yetadigan darajada tez." },
    { t: "qa", art: "lowBattery", q: "- [q:How] [j:tired] [are:are] you?", a: "- A little bit." },
    { t: "qa", art: "starry", q: "- [q:How] [j:beautiful] [is:is] she?", a: "- She [is:is] very [j:beautiful]." },
    { t: "end" },
  ]];

  // ---------- unit colours ----------
  const UNIT = ["#2f6fd6", "#8a4fd0", "#0e9a86", "#e0702b", "#d6457a", "#2f9a4f", "#1f8fc8", "#c9402f", "#5a5acd", "#b07a0a", "#0b8a8f"];
  const ORDER = Object.keys(L);
  function mix(hex, w, to) {
    const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = n(hex), b = n(to);
    return "#" + a.map((v, i) => Math.round(v * (1 - w) + b[i] * w).toString(16).padStart(2, "0")).join("");
  }
  function unitVars(id) {
    const c = UNIT[ORDER.indexOf(id) % UNIT.length];
    return `--u:${c};--ut:${mix(c, 0.88, "#ffffff")};--utd:${mix(c, 0.8, "#161b38")};--ud:${mix(c, 0.35, "#10142e")}`;
  }

  // ---------- exercises (Mashqlar), from the lesson's practice questions ----------
  const strip = (q) => String(q || "").replace(/^\s*\d+\.\s*/, "");
  const normA = (s) => String(s).toLowerCase().replace(/[‘’ʼʻ`´]/g, "'").replace(/\s+/g, " ").replace(/\s*([,.?!;:])/g, "$1").replace(/[.?!,;:]+$/, "").trim();
  function exercisesOf(id) {
    let topic = null;
    try { for (const s of FOUR_SECTIONS_DATA) { const t = s.topics.find((x) => x.id === id); if (t) { topic = t; break; } } } catch (e) { /* data not loaded */ }
    let all = [];
    try { all = (typeof state !== "undefined" && state.exercises) || []; } catch (e) { /* no state */ }
    return ((topic && topic.exerciseIds) || []).map((x) => all.find((e) => e.id === x)).filter(Boolean);
  }
  const EXKEY = "l1_gb_ex_v1";
  function exBest() { try { return JSON.parse(localStorage.getItem(EXKEY) || "{}"); } catch (e) { return {}; } }
  function exSave(id, score) { try { const b = exBest(); b[id] = Math.max(b[id] || 0, score); localStorage.setItem(EXKEY, JSON.stringify(b)); } catch (e) { /* private mode */ } }

  function example(q) {
    const a = String(q.a).split("|")[0], t = strip(q.q);
    if (t.includes("___")) return esc(t).replace("___", `<b class="gb-eg-a">${esc(a)}</b>`);
    if (/→\s*$/.test(t)) return `${esc(t)} <b class="gb-eg-a">${esc(a)}</b>`;
    return `${esc(t)} → <b class="gb-eg-a">${esc(a)}</b>`;
  }
  function itemHtml(q, n, ei, qi) {
    const t = strip(q.q), parts = t.split("___");
    const answers = String(q.a).split("|");
    const longest = answers.reduce((m, x) => Math.max(m, x.length), 3);
    let body = "";
    if (q.options && q.options.length > 1) {
      body = (parts.length > 1 ? `${esc(parts[0])}<span class="gb-blank" data-blank></span>${esc(parts.slice(1).join("___"))}` : esc(t)) +
        `<span class="gb-opts">${q.options.map((o) => `<button type="button" class="gb-opt" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</span>`;
    } else {
      const inp = (w) => `<input class="gb-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" style="${w}" aria-label="Javob">`;
      if (parts.length > 1) body = `${esc(parts[0])}${inp(`width:${Math.min(Math.max(longest + 2, 5), 18)}ch`)}${esc(parts.slice(1).join("___"))}`;
      else if (/→\s*$/.test(t)) body = `${esc(t)} ${inp(`width:${Math.min(Math.max(longest + 2, 8), 18)}ch`)}`;
      else body = `<span class="gb-q">${esc(t)}</span>${inp("width:100%")}`;
    }
    return `<li class="gb-item" data-e="${ei}" data-q="${qi}"><span class="gb-n">${n}</span><div class="gb-item-b">${body}</div></li>`;
  }
  const EXSTORE = {}; // exercise objects of the open lesson, by index in the page
  // one page per exercise, so the pager stays quick and every exercise starts at the top of a screen
  function exercisePages(id, unitNo) {
    const exs = exercisesOf(id);
    if (!exs.length) return [];
    EXSTORE[id] = exs;
    const best = exBest();
    return exs.map((ex, ei) => {
      const qs = ex.questions || [];
      const items = qs.slice(1).map((q, k) => itemHtml(q, k + 2, ei, k + 1)).join("");
      return `<div class="gb-exhead"><span class="gb-extab">Mashqlar</span><span class="gb-exunit">${unitNo}-dars · ${ei + 1} / ${exs.length}</span></div>
      <section class="gb-ex" data-lesson="${id}" data-e="${ei}">
        <header class="gb-ex-h"><span class="gb-exnum">${unitNo}.${ei + 1}</span>
          <div><b class="gb-ex-en">${esc(ex.instruction_en || "")}</b>${ex.instruction_uz ? `<p class="gb-ex-uz">${esc(ex.instruction_uz)}</p>` : ""}</div>
          <span class="gb-ex-done${best[ex.id] ? " is-on" : ""}" title="Eng yaxshi natija">${best[ex.id] ? "✓ " + best[ex.id] + "/" + (qs.length - 1) : ""}</span></header>
        ${qs.length ? `<p class="gb-eg"><span class="gb-eg-l">Misol</span><span class="gb-eg-t">${example(qs[0])}</span></p>` : ""}
        <ol class="gb-items">${items}</ol>
        <footer class="gb-ex-f"><button type="button" class="gb-check">Tekshirish</button><span class="gb-score" aria-live="polite"></span></footer>
      </section>${ei === exs.length - 1 ? B.end() : ""}`;
    });
  }

  function grade(sec) {
    const ex = EXSTORE[sec.dataset.lesson][+sec.dataset.e];
    let ok = 0, total = 0;
    sec.querySelectorAll(".gb-item").forEach((li) => {
      const q = ex.questions[+li.dataset.q];
      const answers = String(q.a).split("|").map(normA);
      const inp = li.querySelector(".gb-in");
      const val = inp ? inp.value : (li.dataset.v || "");
      const good = !!val && answers.indexOf(normA(val)) > -1;
      li.classList.remove("is-ok", "is-bad");
      li.classList.add(good ? "is-ok" : "is-bad");
      const old = li.querySelector(".gb-fix"); if (old) old.remove();
      if (!good) li.querySelector(".gb-item-b").insertAdjacentHTML("beforeend", `<span class="gb-fix">${esc(String(q.a).split("|")[0])}</span>`);
      if (inp) inp.readOnly = true;
      total++; if (good) ok++;
    });
    sec.classList.add("is-checked");
    sec.querySelector(".gb-score").textContent = `${ok} / ${total}`;
    sec.querySelector(".gb-score").className = "gb-score " + (ok === total ? "is-perfect" : ok >= total * 0.6 ? "is-fine" : "is-low");
    sec.querySelector(".gb-check").textContent = "Qayta urinish";
    const mark = sec.querySelector(".gb-ex-done"); if (mark) { exSave(ex.id, ok); const b = exBest()[ex.id]; mark.textContent = "✓ " + b + "/" + total; mark.classList.add("is-on"); }
  }
  function reset(sec) {
    sec.classList.remove("is-checked");
    sec.querySelectorAll(".gb-item").forEach((li) => {
      li.classList.remove("is-ok", "is-bad"); delete li.dataset.v;
      const f = li.querySelector(".gb-fix"); if (f) f.remove();
      const i = li.querySelector(".gb-in"); if (i) { i.value = ""; i.readOnly = false; }
      li.querySelectorAll(".gb-opt").forEach((o) => o.classList.remove("is-on"));
      const bl = li.querySelector("[data-blank]"); if (bl) bl.textContent = "";
    });
    sec.querySelector(".gb-score").textContent = "";
    sec.querySelector(".gb-check").textContent = "Tekshirish";
  }

  // ---------- pages + pager ----------
  const LETTERS = "ABCDEFGH";
  function unitNumber(id) {
    try { const l = window.L1_Hub && window.L1_Hub.lessons().find((x) => x.id === id); if (l) return l.n; } catch (e) { /* hub not ready */ }
    return ORDER.indexOf(id) + 1;
  }
  function pages(id) {
    const list = L[id] || [];
    const n = unitNumber(id), vars = unitVars(id);
    const out = list.map((pg, i) => {
      const head = i === 0
        ? `<div class="gb-unit"><span class="gb-unit-no">${n}</span><span class="gb-unit-t">${esc(unitTitle(id))}</span></div>`
        : "";
      const letter = list.length > 1 ? `<div class="gb-sec"><span class="gb-sec-k">${LETTERS[i]}</span><i></i></div>` : "";
      return `<section class="lr-page gb-page" style="${vars}" aria-label="${i + 1}-sahifa"><div class="gb-sheet">${head}${letter}${pg.map(block).join("")}<div class="gb-folio"><span>${n}-dars</span><span>${i + 1}</span></div></div></section>`;
    });
    exercisePages(id, n).forEach((html, k) => {
      out.push(`<section class="lr-page gb-page gb-page-ex" style="${vars}" aria-label="Mashq ${k + 1}"><div class="gb-sheet">${html}<div class="gb-folio"><span>${n}-dars</span><span>${list.length + k + 1}</span></div></div></section>`);
    });
    return out;
  }
  function unitTitle(id) {
    try { for (const s of FOUR_SECTIONS_DATA) { const t = s.topics.find((x) => x.id === id); if (t) return t.title; } } catch (e) { /* no data */ }
    return "";
  }

  function say(t) {
    if (typeof window.speakWord === "function") return window.speakWord(t);
    try { const u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* no voice */ }
  }

  // The block in the lower row starts where the same word stands in the upper row and jumps into its place.
  function playMove(box) {
    if (!box || !box.isConnected || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = {};
    box.querySelectorAll(".is-from .gb-blk").forEach((el) => { from[el.dataset.k] = el.getBoundingClientRect(); });
    box.querySelectorAll(".is-to .gb-blk").forEach((el, i) => {
      const r = el.getBoundingClientRect(), f = from[el.dataset.k];
      const dx = f ? f.left - r.left : 0, dy = f ? f.top - r.top : -40;
      const jump = f && Math.abs(dx) > 4;
      el.animate(f ? [
        { transform: `translate(${dx}px,${dy}px)`, opacity: 0.4 },
        { transform: `translate(${dx * 0.5}px,${dy * 0.5 - (jump ? 26 : 0)}px)`, opacity: 1, offset: 0.5 },
        { transform: "none", opacity: 1 },
      ] : [{ transform: `translateY(${dy}px)`, opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: jump || !f ? 900 : 600, delay: 250 + i * 120, easing: "ease-in-out", fill: "backwards" });
    });
  }

  function wire(card) {
    const track = card.querySelector(".lr-track");
    if (!track || !track.querySelector(".gb-page")) return;
    card.classList.add("gb-on");
    const pagesEl = [...track.children];
    let at = -1;
    const fit = () => { const p = pagesEl[Math.max(0, at)]; if (p) track.style.height = p.firstElementChild.offsetHeight + "px"; };
    const show = (i) => {
      if (i === at) return;
      const first = at === -1;
      at = i; fit();
      if (!first) {
        // a new page starts at its top, wherever the student had scrolled the previous one to
        const pager = card.querySelector(".lr-pager");
        if (pager.getBoundingClientRect().top < 0) pager.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      pagesEl[i].querySelectorAll("[data-move]").forEach((m) => setTimeout(() => playMove(m), first ? 400 : 350));
    };
    show(0);
    track.addEventListener("scroll", () => { const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); if (i !== at && i >= 0 && i < pagesEl.length) show(i); }, { passive: true });
    if (window.ResizeObserver) { const ro = new ResizeObserver(fit); pagesEl.forEach((p) => ro.observe(p.firstElementChild)); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (card.dataset.gbWired) return;  // the card element is reused for every lesson: one listener is enough
    card.dataset.gbWired = "1";
    card.addEventListener("click", (e) => {
      const b = e.target.closest(".gb-en");
      if (b) { b.classList.remove("is-say"); void b.offsetWidth; b.classList.add("is-say"); say(b.dataset.say); return; }
      const r = e.target.closest(".gb-replay");
      if (r) { playMove(r.closest("[data-move]")); return; }
      const o = e.target.closest(".gb-opt");
      if (o) {
        const li = o.closest(".gb-item");
        if (li.closest(".gb-ex").classList.contains("is-checked")) return;
        li.querySelectorAll(".gb-opt").forEach((x) => x.classList.toggle("is-on", x === o));
        li.dataset.v = o.dataset.v;
        const bl = li.querySelector("[data-blank]"); if (bl) bl.textContent = o.dataset.v;
        return;
      }
      const c = e.target.closest(".gb-check");
      if (c) { const sec = c.closest(".gb-ex"); if (sec.classList.contains("is-checked")) reset(sec); else grade(sec); }
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("gb-in")) {
        e.preventDefault();
        const ins = [...e.target.closest(".gb-ex").querySelectorAll(".gb-in")], i = ins.indexOf(e.target);
        if (ins[i + 1]) ins[i + 1].focus(); else e.target.blur();
      }
    });
  }

  window.L1_GrammarBook = {
    has: (id) => !!L[id],
    pages, wire, ink, plain,
    _lessons: L, _art: ART, _exercisesOf: exercisesOf,
  };
})();
