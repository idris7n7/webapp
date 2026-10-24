/* Listen and Survive — five missions you play by listening.
 *
 * Each step speaks an instruction in English (the browser's text-to-speech; there are no recorded audio files), and the
 * student has to DO what was said: walk a route on a map, take the right things from a camp, write a gate number or a
 * spelled name, find the thief from what witnesses say, or carry out a chain of commands against the clock.
 *
 * Words: the missions use the course words the student knows (weak ones come first, from the shared vocabulary memory in
 * words.js) and a small glossary of new words (listen_data.js). Every step reports its words back, and the words the
 * student marks "Tushunmadim" return in Word Race. Results and stars are kept on the server (/api/listen/*).
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L1 = () => window.L1 || null;
  const W = () => window.L1_Words;
  const rnd = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const toast = (m) => { if (typeof window.showToast === "function") window.showToast(m); };

  const MISSIONS = typeof LISTEN_MISSIONS !== "undefined" ? LISTEN_MISSIONS : [];
  const GLOSS = typeof LISTEN_GLOSSARY !== "undefined" ? LISTEN_GLOSSARY : [];
  const cards = () => (typeof FLASHCARDS_DATA !== "undefined" ? FLASHCARDS_DATA : []);
  const entry = (word) => cards().find((c) => c.word === word) || GLOSS.find((g) => g.word === word) || null;
  const wid = (word) => { const e = entry(word); return e ? e.id : null; };
  const widList = (...words) => [...new Set(words.map(wid).filter(Boolean))];
  const meaning = (word) => { const e = entry(word); return e ? e.meaning_uz : word; };
  const byId = (id) => cards().find((c) => c.id === id) || GLOSS.find((g) => g.id === id) || null;

  const DIFFS = {
    easy: { name: "Oson", rate: 0.8, replays: Infinity, hint: "Sekin ovoz, cheksiz takrorlash", labels: true, time: 1.4 },
    normal: { name: "O'rta", rate: 0.95, replays: 3, hint: "Oddiy tezlik, 3 marta takrorlash", labels: true, time: 1 },
    hard: { name: "Qiyin", rate: 1.08, replays: 1, hint: "Tez nutq, turli aksent, 1 marta takrorlash, rasmlarda yozuv yo'q", labels: false, time: 0.75 },
  };

  // ------------------------------------------------------------------ text to speech (British voice first)
  const TTS = {
    voices: [], british: null,
    supported: () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined",
    load() {
      if (!this.supported()) return;
      this.voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
      this.british = this.voices.find((v) => /en[-_]GB/i.test(v.lang)) || null;
    },
    voiceFor(variant) {
      if (!this.voices.length) return null;
      if (S.diff === "easy" || !variant) return this.british || this.voices[0];
      return this.voices[variant % this.voices.length]; // harder levels: other accents when the device has them
    },
    note() {
      this.load();
      if (!this.supported()) return "⚠️ Bu qurilmada ovoz (TTS) yo'q. Ko'rsatmalar matn bilan ko'rsatiladi.";
      if (!this.voices.length) return "⚠️ Inglizcha ovoz topilmadi. Telefon sozlamalarida \"Text-to-speech\" ga ingliz tilini qo'shing. Hozircha matn ham ko'rsatiladi.";
      if (this.british) return `🔊 Britaniya ovozi ishlatilmoqda (${esc(this.british.name)}).`;
      return `🔊 Bu qurilmada Britaniya ovozi yo'q; ${esc(this.voices[0].lang)} ovozi ishlatilmoqda. (Boshqa ovozlar: ${this.voices.length} ta)`;
    },
    cancel() { try { if (this.supported()) speechSynthesis.cancel(); } catch (e) {} },
    speak(text, rate, voice) {
      return new Promise((resolve) => {
        if (!this.supported()) return resolve(false);
        const u = new SpeechSynthesisUtterance(text);
        u.lang = voice ? voice.lang : "en-GB";
        if (voice) u.voice = voice;
        u.rate = rate || 0.9;
        let done = false;
        const fin = () => { if (done) return; done = true; clearTimeout(t); resolve(true); };
        const t = setTimeout(fin, 1800 + (text.length * 110) / (rate || 0.9)); // some phones never fire "end"
        u.onend = fin; u.onerror = fin;
        try { speechSynthesis.speak(u); } catch (e) { fin(); }
      });
    },
  };
  if (TTS.supported()) { TTS.load(); speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", () => TTS.load()); }

  // ------------------------------------------------------------------ state
  const S = {
    view: "hub", diff: "normal", progress: {}, mission: null, steps: [], i: 0, hearts: 3, replays: 0, results: [], flagged: new Set(),
    startedAt: 0, token: 0, speaking: false, locked: false, sel: [], captions: false, move: null, timer: 0, timerEnd: 0, sound: true, scene3d: null,
  };
  const D = () => DIFFS[S.diff];
  const area = () => $("gameListenArea");
  const sfx = {
    right() { const s = L1() && L1().Sound; if (s) { s.tone(660, "sine", 0.1, 0, 0.12); s.tone(990, "sine", 0.16, 0.08, 0.12); } },
    wrong() { const s = L1() && L1().Sound; if (s) s.slide(240, 90, "sawtooth", 0.3, 0, 0.12); },
    win() { const s = L1() && L1().Sound; if (s) [523, 659, 784, 1046].forEach((f, i) => s.tone(f, "triangle", 0.25, i * 0.12, 0.14)); },
    tap() { const s = L1() && L1().Sound; if (s) s.tone(520, "triangle", 0.05, 0, 0.07); },
  };

  async function http(path, method, body) {
    const opts = { method: method || "GET" };
    if (body) { opts.headers = { "Content-Type": "application/json" }; opts.body = JSON.stringify(body); }
    try { const r = await window.l1Fetch(path, opts); return { ok: r.ok, data: await r.json().catch(() => null) }; } catch (e) { return { ok: false, data: null }; }
  }

  // ------------------------------------------------------------------ small helpers for the missions
  // Weighted sample without replacement: items whose word the student misses are drawn first (shared vocabulary memory).
  function wpick(list, n, weightOf) {
    const pool = list.map((it) => ({ it, w: Math.max(0.1, weightOf(it)) * (0.6 + Math.random() * 0.8) }));
    const out = [];
    while (out.length < n && pool.length) {
      let r = Math.random() * pool.reduce((s, p) => s + p.w, 0), i = 0;
      for (; i < pool.length - 1; i++) { r -= pool[i].w; if (r <= 0) break; }
      out.push(pool.splice(i, 1)[0].it);
    }
    return out;
  }
  const wOf = (word) => { const id = wid(word); return W() && id ? W().weight(id) : 2; };
  const numberWord = (n) => { const c = cards().find((x) => x.bigText === String(n)); return c ? c.word : String(n); };
  const spoken = (arr) => arr.join(", ");

  // ================================================================== MISSION 1: Escape the Building
  const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const ARROWS = ["⬆️", "➡️", "⬇️", "⬅️"];
  const GRID = 5;

  function simulate(start, cmds) {
    let { x, y, h } = start;
    const path = [{ x, y }];
    for (const c of cmds) {
      if (c.t === "L") h = (h + 3) % 4;
      else if (c.t === "R") h = (h + 1) % 4;
      else for (let k = 0; k < c.n; k++) {
        x += DIRS[h][0]; y += DIRS[h][1];
        if (x < 0 || y < 0 || x >= GRID || y >= GRID) return null;
        path.push({ x, y });
      }
    }
    return { x, y, h, path };
  }
  const cmdLine = (c) => c.t === "F"
    ? { en: `Go straight ${c.n === 1 ? "one step" : "two steps"}.`, uz: `${c.n === 1 ? "Bir" : "Ikki"} qadam toʻgʻri yuring.`, words: ["straight", "step", c.n === 1 ? "one" : "two"] }
    : c.t === "L" ? { en: "Turn left.", uz: "Chapga buriling.", words: ["turn", "left"] } : { en: "Turn right.", uz: "Oʻngga buriling.", words: ["turn", "right"] };

  function genEscape() {
    const steps = [];
    for (const k of [2, 3, 3, 4, 4]) {
      for (let tries = 0; tries < 800; tries++) {
        const start = { x: 1 + rnd(3), y: 2 + rnd(3), h: 0 };
        const cmds = [];
        let turnNext = k > 2 && Math.random() < 0.3;
        for (let j = 0; j < k; j++) { cmds.push(turnNext ? { t: Math.random() < 0.5 ? "L" : "R" } : { t: "F", n: 1 + rnd(2) }); turnNext = !turnNext; }
        const end = simulate(start, cmds);
        if (!end || (end.x === start.x && end.y === start.y)) continue;
        const lines = cmds.map(cmdLine).concat([{ en: "Stop. This is the exit.", uz: "Toʻxtang. Mana chiqish joyi.", words: ["stop", "exit"] }]);
        steps.push({
          type: "move", prompt: "Ko'rsatmalarni tinglang va yo'ldan yuring. Tugagach «Tayyor» ni bosing.", lines,
          start, expected: { x: end.x, y: end.y, h: end.h }, path: end.path, words: widList(...lines.flatMap((l) => l.words)),
        });
        break;
      }
    }
    return steps;
  }

  // ================================================================== MISSION 2: Survival Camp
  const CAMP_ITEMS = [
    ["bag", "🎒"], ["banana", "🍌"], ["bottle of water", "💧"], ["mobile phone", "📱"], ["umbrella", "☂️"], ["sandwich", "🥪"], ["notebook", "📓"], ["key", "🔑"],
    ["tent", "⛺"], ["fire", "🔥"], ["map", "🗺️"], ["rope", "🪢"], ["torch", "🔦"], ["jacket", "🧥"],
  ].map(([w, e]) => ({ id: w, e, w, label: w, uz: meaning(w) }));
  const NEEDS = [
    { en: "I am cold.", uz: "Men sovuq qotdim.", ok: ["jacket", "fire"], words: ["hot — cold"] },
    { en: "I am hot.", uz: "Men qizib ketdim.", ok: ["bottle of water"], words: ["hot — cold"] },
    { en: "I am thirsty.", uz: "Men chanqadim.", ok: ["bottle of water"], words: ["thirsty"] },
    { en: "I am hungry.", uz: "Men ochman.", ok: ["sandwich", "banana"], words: ["hungry"] },
    { en: "It is raining.", uz: "Yomgʻir yogʻyapti.", ok: ["umbrella", "jacket"], words: ["rain"] },
    { en: "It is dark.", uz: "Qorongʻi.", ok: ["torch", "fire"], words: ["dark"] },
    { en: "I am lost.", uz: "Men adashdim.", ok: ["map", "mobile phone"], words: ["lost"] },
    { en: "I am tired.", uz: "Men charchadim.", ok: ["tent"], words: ["tired"] },
  ];
  const itemWeight = (it) => wOf(it.w);

  function genCamp() {
    const steps = [];
    const needs = shuffle(NEEDS);
    const plan = ["need", "seq2", "need", "seq2", "seq3"];
    for (const kind of plan) {
      if (kind === "need") {
        const nd = needs.pop();
        const okItems = CAMP_ITEMS.filter((it) => nd.ok.includes(it.w));
        const others = shuffle(CAMP_ITEMS.filter((it) => !nd.ok.includes(it.w))).slice(0, 5);
        const correct = okItems[rnd(okItems.length)];
        const tiles = shuffle([correct, ...others]);
        steps.push({
          type: "pick", prompt: "Nimani olasiz?", tiles, answer: nd.ok,
          lines: [{ en: `${nd.en} What do you take?`, uz: `${nd.uz} Nimani olasiz?`, say: `${nd.en} What do you take?` }],
          words: widList(...nd.words, ...nd.ok), detail: `To'g'ri javob: ${nd.ok.map((w) => meaning(w)).join(" yoki ")}`,
        });
      } else {
        const n = kind === "seq2" ? 2 : 3;
        const targets = wpick(CAMP_ITEMS, n, itemWeight);
        const others = shuffle(CAMP_ITEMS.filter((it) => !targets.includes(it))).slice(0, 6 - n);
        const tiles = shuffle([...targets, ...others]);
        const nm = (it) => `the ${it.w}`;
        const en = n === 2 ? `Take ${nm(targets[0])}, then take ${nm(targets[1])}.`
          : `First, take ${nm(targets[0])}. Then, take ${nm(targets[1])}. Last, take ${nm(targets[2])}.`;
        const uz = n === 2 ? `Oling: ${targets[0].uz}, keyin ${targets[1].uz}.` : `Avval: ${targets[0].uz}. Keyin: ${targets[1].uz}. Oxirida: ${targets[2].uz}.`;
        steps.push({
          type: "order", prompt: `Ko'rsatilgan tartibda ${n} ta narsani bosing.`, tiles, answer: targets.map((t) => t.id),
          lines: [{ en, uz }], words: widList(...targets.map((t) => t.w)), detail: `To'g'ri tartib: ${targets.map((t) => `${t.e} ${t.w}`).join(" → ")}`,
        });
      }
    }
    return steps;
  }

  // ================================================================== MISSION 3: The Airport
  const FLAGS = { Argentina: "🇦🇷", Australia: "🇦🇺", Brazil: "🇧🇷", Colombia: "🇨🇴", India: "🇮🇳", Italy: "🇮🇹", Mexico: "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", Poland: "🇵🇱", Spain: "🇪🇸", Turkey: "🇹🇷", China: "🇨🇳", Vietnam: "🇻🇳", Japan: "🇯🇵", France: "🇫🇷", Germany: "🇩🇪", Switzerland: "🇨🇭" };
  const SURNAMES = ["Brown", "Smith", "Green", "White", "Jones", "Clark", "Adams", "Moore"];
  const pad2 = (n) => String(n).padStart(2, "0");

  function timeSay(h, m) { return m === 0 ? `${numberWord(h)} o'clock` : `${numberWord(h)} ${numberWord(m)}`; }
  const timeUz = (h, m) => `${pad2(h)}:${pad2(m)}`;

  function genAirport() {
    const countries = wpick(cards().filter((c) => c.unit === "1b" && FLAGS[c.word]), 6, (c) => (W() ? W().weight(c.id) : 2));
    const [c1, c2] = countries;
    const gate = 2 + rnd(19);
    const gateWord = numberWord(gate);
    const steps = [];
    // 1. the gate number (typed)
    steps.push({
      type: "type", kind: "number", prompt: "Qaysi darvoza (gate)? Raqamni yozing.", answer: [String(gate), gateWord.toLowerCase()],
      lines: [{ en: `Attention, please. The flight to ${c1.word} is now boarding at gate ${gateWord}.`, uz: `Diqqat! ${c1.meaning_uz}ga reys ${gate}-darvozada samolyotga chiqish boshlandi.` }],
      words: widList(c1.word, gateWord, "boarding", "gate", "flight"), detail: `To'g'ri javob: ${gate}`,
    });
    // 2. the country (pick)
    const dest = countries[2], dests = shuffle([dest, ...countries.slice(3, 6)]);
    steps.push({
      type: "pick", prompt: "Qaysi davlatga reys?", tiles: dests.map((c) => ({ id: c.word, e: FLAGS[c.word], label: c.word, uz: c.meaning_uz, text: true })), answer: [dest.word],
      lines: [{ en: `Final call for passengers to ${dest.word}. Please go to the gate now.`, uz: `${dest.meaning_uz}ga yoʻlovchilar uchun oxirgi chaqiruv. Iltimos, hozir darvozaga boring.` }],
      words: widList(dest.word, "flight", "gate"), detail: `To'g'ri javob: ${dest.word} — ${dest.meaning_uz}`,
    });
    // 3. the time (pick)
    const h = 3 + rnd(8), m = [0, 15, 30][rnd(3)];
    const opts = new Map([[timeUz(h, m), [h, m]]]);
    while (opts.size < 4) { const hh = 3 + rnd(8), mm = [0, 15, 30][rnd(3)]; opts.set(timeUz(hh, mm), [hh, mm]); }
    steps.push({
      type: "pick", prompt: "Reys soat nechada uchadi?", answer: [timeUz(h, m)],
      tiles: shuffle([...opts.keys()]).map((t) => ({ id: t, e: "🕒", label: t, uz: t, text: true, big: true })),
      lines: [{ en: `Your flight to ${c2.word} leaves at ${timeSay(h, m)}.`, say: `Your flight to ${c2.word} leaves at ${m === 0 ? numberWord(h) + " o'clock" : numberWord(h) + ", " + numberWord(m)}.`, uz: `${c2.meaning_uz}ga reysingiz soat ${timeUz(h, m)} da uchadi.` }],
      words: widList(c2.word, numberWord(h), m ? numberWord(m) : "o'clock", "flight", "leave"), detail: `To'g'ri javob: ${timeUz(h, m)}`,
    });
    // 4. spell the surname (typed)
    const name = SURNAMES[rnd(SURNAMES.length)];
    steps.push({
      type: "type", kind: "text", prompt: "Familiyani yozing (harflab aytiladi).", answer: [name.toLowerCase()],
      lines: [{ en: `My surname is ${name}.`, uz: `Mening familiyam ${name}.` },
        { en: name.toUpperCase().split("").join("-"), say: name.toUpperCase().split("").join(", "), uz: `Harflab: ${name.toUpperCase().split("").join("-")}`, pause: 300 }],
      words: widList("surname", "spell", "name"), detail: `To'g'ri javob: ${name}`,
    });
    // 5. the phone number (typed digits)
    const digits = Array.from({ length: 6 }, () => 1 + rnd(9));
    steps.push({
      type: "type", kind: "digits", prompt: "Telefon raqamini yozing (6 ta raqam).", answer: [digits.join("")],
      lines: [{ en: `My phone number is ${digits.map(numberWord).join(" ")}.`, say: `My phone number is ${digits.map(numberWord).join(", ")}.`, uz: `Mening telefon raqamim ${digits.join(" ")}.` }],
      words: widList("phone number", ...digits.map(numberWord)), detail: `To'g'ri javob: ${digits.join("")}`,
    });
    return steps;
  }

  // ================================================================== MISSION 4: The Detective
  const WHO = { man: { w: "man — men", pron: "He", young: "👨", old: "👴" }, woman: { w: "woman — women", pron: "She", young: "👩", old: "👵" }, boy: { w: "boy", pron: "He", any: "👦" }, girl: { w: "girl", pron: "She", any: "👧" } };
  const MOODS = { happy: { e: "😊", w: "happy — sad" }, sad: { e: "😢", w: "happy — sad" }, tired: { e: "😴", w: "tired" } };
  const THINGS = { umbrella: { e: "☂️", art: "an", uz: "soyabon" }, bag: { e: "🎒", art: "a", uz: "sumka" }, laptop: { e: "💻", art: "a", uz: "noutbuk" }, "mobile phone": { e: "📱", art: "a", uz: "mobil telefon" }, notebook: { e: "📓", art: "a", uz: "daftar" }, book: { e: "📕", art: "a", uz: "kitob" } };
  const MOOD_UZ = { happy: "xursand", sad: "xafa", tired: "charchagan" };
  const AGE_UZ = { young: "yosh", old: "qari" };
  const WHO_UZ = { man: "erkak", woman: "ayol", boy: "oʻgʻil bola", girl: "qiz bola" };

  const keyOf = (s) => `${s.who}|${s.age || ""}|${s.mood}|${s.thing}`;
  function makeSuspect() {
    const who = Object.keys(WHO)[rnd(4)];
    const s = { who, mood: Object.keys(MOODS)[rnd(3)], thing: Object.keys(THINGS)[rnd(6)] };
    if (WHO[who].young) s.age = Math.random() < 0.5 ? "young" : "old";
    s.e = WHO[who].any || WHO[who][s.age];
    return s;
  }
  const clueA = (s) => ({ en: s.age ? `The thief is ${s.age === "old" ? "an old" : "a young"} ${s.who}.` : `The thief is a ${s.who}.`,
    uz: s.age ? `Oʻgʻri — ${AGE_UZ[s.age]} ${WHO_UZ[s.who]}.` : `Oʻgʻri — ${WHO_UZ[s.who]}.`, test: (x) => x.who === s.who && x.age === s.age });
  const clueB = (s) => ({ en: `${WHO[s.who].pron} is ${s.mood}.`, uz: `${WHO[s.who].pron === "He" ? "U" : "U"} ${MOOD_UZ[s.mood]}.`, test: (x) => x.mood === s.mood });
  const clueC = (s) => ({ en: `${WHO[s.who].pron} has ${THINGS[s.thing].art} ${s.thing}.`, uz: `Unda ${THINGS[s.thing].uz} bor.`, test: (x) => x.thing === s.thing });

  function genDetective() {
    const steps = [];
    for (const wanted of [2, 2, 3, 3]) {
      for (let tries = 0; tries < 500; tries++) {
        const seen = new Map();
        while (seen.size < 5) { const s = makeSuspect(); seen.set(keyOf(s), s); }
        const list = [...seen.values()];
        const thief = list[rnd(5)];
        const clues = shuffle([clueA(thief), clueB(thief), clueC(thief)]);
        const used = [];
        for (const c of clues) {
          used.push(c);
          if (used.length >= wanted && list.filter((x) => used.every((u) => u.test(x))).length === 1) break;
        }
        if (list.filter((x) => used.every((u) => u.test(x))).length !== 1) continue;
        const lines = used.map((c, k) => ({ en: `Witness ${["one", "two", "three"][k]}: ${c.en}`, say: `Witness ${["one", "two", "three"][k]}. ${c.en}`, uz: `${k + 1}-guvoh: ${c.uz}`, voice: k + 1 }));
        steps.push({
          type: "suspect", prompt: "Guvohlarning gaplariga mos gumondorni toping.", lines, answer: keyOf(thief),
          cards: shuffle(list).map((s) => ({ id: keyOf(s), e: s.e, extra: `${MOODS[s.mood].e} ${THINGS[s.thing].e}` })),
          words: widList("thief", WHO[thief.who].w, ...(thief.age ? ["young — old"] : []), MOODS[thief.mood].w, thief.thing),
          detail: `O'g'ri: ${thief.age ? AGE_UZ[thief.age] + " " : ""}${WHO_UZ[thief.who]}, ${MOOD_UZ[thief.mood]}, ${THINGS[thief.thing].uz}ni ushlab turibdi.`,
        });
        break;
      }
    }
    return steps;
  }

  // ================================================================== MISSION 5: The Timed Mission
  const ACTIONS = [
    { id: "door", e: "🚪", en: "Open the door.", label: "open the door", uz: "Eshikni oching.", words: ["open", "door"] },
    { id: "window", e: "🪟", en: "Close the window.", label: "close the window", uz: "Derazani yoping.", words: ["close", "window"] },
    { id: "key", e: "🔑", en: "Take the key.", label: "take the key", uz: "Kalitni oling.", words: ["take", "key"] },
    { id: "light", e: "💡", en: "Switch on the light.", label: "switch on the light", uz: "Chiroqni yoqing.", words: ["switch on", "light"] },
    { id: "police", e: "📞", en: "Call the police.", label: "call the police", uz: "Politsiyaga qoʻngʻiroq qiling.", words: ["call", "police"] },
    { id: "bag", e: "🎒", en: "Give me the bag.", label: "give me the bag", uz: "Menga sumkani bering.", words: ["give", "bag"] },
    { id: "sit", e: "🪑", en: "Sit down.", label: "sit down", uz: "Oʻtiring.", words: ["sit down"] },
    { id: "stand", e: "🧍", en: "Stand up.", label: "stand up", uz: "Turing.", words: ["stand up"] },
    { id: "run", e: "🏃", en: "Run!", label: "run", uz: "Yuguring!", words: ["run"] },
    { id: "umbrella", e: "☂️", en: "Take the umbrella.", label: "take the umbrella", uz: "Soyabonni oling.", words: ["take", "umbrella"] },
    { id: "water", e: "💧", en: "Give me the bottle of water.", label: "give me the water", uz: "Menga suvni bering.", words: ["give", "bottle of water"] },
    { id: "sandwich", e: "🥪", en: "Take the sandwich.", label: "take the sandwich", uz: "Sendvichni oling.", words: ["take", "sandwich"] },
  ].map((a) => ({ ...a, uzLabel: a.uz }));

  function genTimed() {
    const steps = [];
    for (const n of [3, 3, 4, 4, 5]) {
      const chain = shuffle(ACTIONS).slice(0, n);
      const others = shuffle(ACTIONS.filter((a) => !chain.includes(a))).slice(0, 8 - n);
      const limit = Math.round((D().time * (6 + 4 * n)));
      steps.push({
        type: "order", timed: true, limit, prompt: `Vaqt cheklangan! ${n} ta ko'rsatmani eshitilgan tartibda bosing.`, tiles: shuffle([...chain, ...others]).map((a) => ({ id: a.id, e: a.e, label: a.label, uz: a.uz })),
        answer: chain.map((a) => a.id), lines: chain.map((a) => ({ en: a.en, uz: a.uz, pause: 350 })), words: widList(...chain.flatMap((a) => a.words)),
        detail: `To'g'ri tartib: ${chain.map((a) => `${a.e} ${a.label}`).join(" → ")}`,
      });
    }
    return steps;
  }

  const GEN = { escape: genEscape, camp: genCamp, airport: genAirport, detective: genDetective, timed: genTimed };

  // ------------------------------------------------------------------ rendering
  // ---- the 3D mission scenes (static/l1_3d.js, built from tools/3d_src). Without WebGL the old emoji tiles are used.
  const has3d = () => !!(window.L1_3D && window.L1_3D.available());
  function kill3d() { if (S.scene3d) { try { S.scene3d.destroy(); } catch (e) {} S.scene3d = null; } }
  function stage(html) { kill3d(); area().innerHTML = `<div class="ls-stage">${html}</div>`; }
  const starsHtml = (n) => `<span class="ls-stars" aria-label="${n} yulduz">${"★".repeat(n)}<s>${"★".repeat(3 - n)}</s></span>`;
  const heartsHtml = () => `<span class="ls-hearts" id="lsHearts">${"❤️".repeat(S.hearts)}<s>${"🖤".repeat(3 - S.hearts)}</s></span>`;

  function renderHub() {
    S.view = "hub";
    const g = W() ? W().glossary() : { seen: 0, total: GLOSS.length };
    stage(`
      <div class="ls-title"><span style="font-size:32px">🎧</span><div>Listen and Survive<small>Tinglang va omon qoling</small></div></div>
      <div><div class="ls-h" style="margin-bottom:6px">Qiyinlik</div>
        <div class="ls-row">${Object.entries(DIFFS).map(([id, d]) => `<button type="button" class="ls-chip ${S.diff === id ? "is-on" : ""}" data-ls="diff" data-v="${id}">${d.name}<small>${d.hint}</small></button>`).join("")}</div></div>
      <div style="display:flex;flex-direction:column;gap:8px">${MISSIONS.map((m, idx) => {
        const p = S.progress[m.id] || { stars: 0 };
        const open = idx === 0 || ((S.progress[MISSIONS[idx - 1].id] || {}).stars || 0) >= 1;
        return `<button type="button" class="ls-mission" data-ls="open" data-v="${m.id}" ${open ? "" : "disabled"}><span class="n">${open ? m.n : "🔒"}</span><span class="ic">${m.icon}</span>
          <span class="tx"><b>${esc(m.title)}</b><span>${esc(m.uz)}</span><i>${esc(m.skills)}</i></span>${open ? starsHtml(p.stars) : ""}</button>`;
      }).join("")}</div>
      <div class="ls-note">Keyingi missiya ochilishi uchun oldingisini kamida 1 yulduz bilan tugating.</div>
      <div class="ls-card ls-note">${TTS.note()}<br>📚 Missiya lug'ati: ${g.seen || 0}/${g.total || GLOSS.length} ta so'z uchragan. Tushunmagan so'zlaringiz Word Race'da so'raladi.</div>`);
  }

  function renderBrief(m) {
    S.view = "brief"; S.mission = m;
    const words = GLOSS.filter((w) => m.words.includes(w.id));
    stage(`
      <div class="ls-bar"><button type="button" class="ls-x" data-ls="hub" aria-label="Orqaga">‹</button><div class="ls-h">${m.n}-missiya</div><span style="width:36px"></span></div>
      <div class="ls-title"><span style="font-size:32px">${m.icon}</span><div>${esc(m.title)}<small>${esc(m.uz)}</small></div></div>
      <div class="ls-story">${esc(m.story)}</div>
      <div class="ls-card"><div class="ls-h" style="margin-bottom:6px">Qiyinlik: ${D().name}</div><div class="ls-note">❤️ 3 jon · ${D().replays === Infinity ? "cheksiz takrorlash" : D().replays + " marta takrorlash"} · ovoz tezligi ${D().rate}×</div></div>
      <div class="ls-card"><div class="ls-h" style="margin-bottom:6px">Yangi so'zlar (bosib eshiting)</div><div class="ls-words">${words.map((w) => `<button type="button" class="ls-wordbtn" data-ls="say" data-v="${esc(w.word)}"><span class="sp">🔊</span><span>${esc(w.word)}<small>${esc(w.meaning_uz)}</small></span></button>`).join("")}</div></div>
      <button type="button" class="ls-btn is-amber" data-ls="start">▶ Missiyani boshlash</button>
      <div class="ls-note">${TTS.note()}</div>`);
  }

  function startMission(m) {
    S.mission = m; S.steps = GEN[m.id](); S.i = 0; S.hearts = 3; S.results = []; S.flagged = new Set(); S.startedAt = Date.now(); S.view = "play";
    game.active = true;
    TTS.load();
    renderPlay();
    showStep();
  }

  function renderPlay() {
    const m = S.mission;
    stage(`
      <div class="ls-bar"><button type="button" class="ls-x" data-ls="leave" aria-label="Chiqish">✕</button><div class="ls-h">${m.icon} ${esc(m.title)}</div>${heartsHtml()}</div>
      <div class="ls-prog"><i id="lsProg" style="width:0%"></i></div>
      <div class="ls-audio" id="lsAudio"><button type="button" class="ls-play" data-ls="replay" id="lsReplay" aria-label="Tinglash">🔊</button>
        <div class="info"><b id="lsAudioTitle">Tinglang…</b><small id="lsAudioSub"></small></div><div class="ls-wave"><i></i><i></i><i></i><i></i><i></i></div></div>
      <div class="ls-row" style="justify-content:flex-end"><button type="button" class="ls-chip" data-ls="captions" id="lsCapBtn" style="padding:6px 10px">📝 Matn</button></div>
      <div class="ls-cap" id="lsCap" hidden></div>
      <div class="ls-prompt" id="lsPrompt"></div>
      <div class="ls-time" id="lsTimeBox" hidden><i id="lsTime"></i></div>
      ${has3d() ? `<div class="ls-3d" id="ls3d" data-m="${esc(m.id)}"></div>` : ""}
      <div id="lsScene"></div>
      <div class="ls-fb" id="lsFb" hidden></div>`);
    const box = $("ls3d");
    if (box) {
      S.scene3d = window.L1_3D.listen(box, m.id, { labels: D().labels, onPick: (id) => tapTile(id) });
      if (!S.scene3d) box.remove();
    }
  }

  const tileHtml = (t, st) => `<button type="button" class="ls-tile" data-ls="tile" data-id="${esc(t.id)}">
    <span class="e">${t.e || ""}</span>${t.text ? `<span class="${t.big ? "t" : "l"}">${esc(t.label)}</span>` : D().labels ? `<span class="l">${esc(t.label)}</span>` : ""}</button>`;

  function sceneHtml(st) {
    if (st.type === "move") {
      const cells = [];
      if (!S.scene3d) for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) cells.push(`<div class="ls-cell" data-x="${x}" data-y="${y}"></div>`);
      return `${S.scene3d ? "" : `<div class="ls-grid" id="lsGrid">${cells.join("")}</div>`}
        <div class="ls-moves" style="margin-top:10px"><button type="button" data-ls="mv" data-v="L">↶ Chapga</button><button type="button" data-ls="mv" data-v="F">⬆ Oldinga</button><button type="button" data-ls="mv" data-v="R">↷ O'ngga</button></div>
        <div class="ls-actions" style="margin-top:8px"><button type="button" class="ls-btn is-quiet" data-ls="mvreset">↺ Boshidan</button><button type="button" class="ls-btn" data-ls="mvdone">✓ Tayyor</button></div>`;
    }
    if (st.type === "type") {
      return `<div class="ls-typed"><input id="lsInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${st.kind === "text" ? "text" : "numeric"}" placeholder="…"><button type="button" class="ls-btn" data-ls="submit">OK</button></div>`;
    }
    if (S.scene3d && (st.type === "suspect" || st.type === "pick")) return "";   // the objects are in the 3D scene
    if (st.type === "suspect") {
      return `<div class="ls-tiles">${st.cards.map((c) => `<button type="button" class="ls-tile ls-suspect" data-ls="tile" data-id="${esc(c.id)}"><span class="e">${c.e}</span><span class="extra">${c.extra}</span></button>`).join("")}</div>`;
    }
    const cols = st.tiles.length === 4 ? "is-two" : "";
    return `${S.scene3d ? "" : `<div class="ls-tiles ${cols}">${st.tiles.map((t) => tileHtml(t, st)).join("")}</div>`}
      ${st.type === "order" ? `<div class="ls-actions" style="margin-top:8px"><button type="button" class="ls-btn is-quiet" data-ls="undo">↩ Bekor</button><button type="button" class="ls-btn" data-ls="submit" id="lsGo" disabled>✓ Tayyor</button></div>` : ""}`;
  }

  // ------------------------------------------------------------------ the step loop
  function setSpeaking(on) { if (S.scene3d) S.scene3d.setSpeaking(on); const a = $("lsAudio"); if (a) a.classList.toggle("is-speaking", on); const t = $("lsAudioTitle"); if (t) t.textContent = on ? "Eshiting…" : "Tinglang"; }
  function updateAudioSub() {
    const sub = $("lsAudioSub"); if (!sub) return;
    sub.textContent = D().replays === Infinity ? "Takrorlash: cheksiz" : `Takrorlash: ${S.replays} ta qoldi`;
  }

  function showStep() {
    const st = S.steps[S.i];
    S.locked = false; S.sel = []; S.replays = D().replays; S.move = st.type === "move" ? { ...st.start, cmds: [], trail: [{ x: st.start.x, y: st.start.y }] } : null;
    clearInterval(S.timer); S.timer = 0;
    $("lsScene").innerHTML = sceneHtml(st);
    if (S.scene3d) { S.scene3d.setStep(st); S.scene3d.setTimer(1, st.limit || 0); }
    $("lsPrompt").textContent = st.prompt;
    $("lsProg").style.width = `${(S.i / S.steps.length) * 100}%`;
    $("lsFb").hidden = true;
    $("lsTimeBox").hidden = !st.timed;
    const cap = $("lsCap");
    cap.hidden = true; $("lsCapBtn").classList.remove("is-on");
    if (!TTS.supported() || !TTS.voices.length) { cap.hidden = false; cap.textContent = st.lines.map((l) => l.en).join(" "); }
    updateAudioSub();
    if (st.type === "move") drawMove();
    const input = $("lsInput"); if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    play(st);
  }

  async function play(st) {
    const my = ++S.token;
    TTS.cancel();
    setSpeaking(true);
    const replayBtn = $("lsReplay"); if (replayBtn) replayBtn.disabled = true;
    for (const ln of st.lines) {
      if (S.token !== my) return;
      await TTS.speak(ln.say || ln.en, D().rate, TTS.voiceFor(ln.voice));
      if (S.token !== my) return;
      await sleep(ln.pause != null ? ln.pause : 500);
    }
    if (S.token !== my) return;
    setSpeaking(false);
    if (replayBtn) replayBtn.disabled = false;
    if (st.timed && !S.timer && !S.locked) startTimer(st);
    const input = $("lsInput"); if (input && st.type === "type") input.focus();
  }

  function replay() {
    if (S.locked || S.view !== "play") return;
    if (S.replays <= 0) { toast("Takrorlash tugadi."); return; }
    if (S.replays !== Infinity) S.replays--;
    updateAudioSub();
    play(S.steps[S.i]);
  }

  function startTimer(st) {
    S.timerEnd = Date.now() + st.limit * 1000;
    const bar = $("lsTime");
    if (bar) { bar.style.transition = "none"; bar.style.width = "100%"; void bar.offsetWidth; bar.style.transition = `width ${st.limit}s linear`; bar.style.width = "0%"; }
    S.timer = setInterval(() => { if (S.scene3d) { const left = Math.max(0, S.timerEnd - Date.now()) / 1000; S.scene3d.setTimer(left / st.limit, left); } if (Date.now() >= S.timerEnd) { clearInterval(S.timer); S.timer = 0; if (!S.locked) resolveStep(false, "Vaqt tugadi!"); } }, 150);
  }

  // ---- answers
  const norm = (s) => String(s).toLowerCase().replace(/[\s,.\-]/g, "");
  function check(st) {
    switch (st.type) {
      case "move": { const m = S.move; return m.x === st.expected.x && m.y === st.expected.y && m.h === st.expected.h; }
      case "type": { const v = ($("lsInput") ? $("lsInput").value : ""); return st.answer.some((a) => norm(a) === norm(v)); }
      case "order": return S.sel.join("|") === st.answer.join("|");
      case "suspect": return S.sel[0] === st.answer;
      default: return st.answer.includes(S.sel[0]);
    }
  }

  function submit() {
    if (S.locked) return;
    const st = S.steps[S.i];
    if (st.type === "type" && !$("lsInput").value.trim()) return;
    if (st.type === "order" && !S.sel.length) return;
    resolveStep(check(st));
  }

  function resolveStep(ok, note) {
    if (S.locked) return;
    S.locked = true;
    S.token++; TTS.cancel(); setSpeaking(false);
    clearInterval(S.timer); S.timer = 0;
    const st = S.steps[S.i];
    if (!ok) S.hearts--;
    S.results.push({ ok, words: st.words });
    ok ? sfx.right() : sfx.wrong();
    const h = $("lsHearts"); if (h) h.outerHTML = heartsHtml();
    document.querySelectorAll("#lsScene button, #lsScene input").forEach((b) => (b.disabled = true));
    // colour the answer
    if (S.scene3d) {
      S.scene3d.flash(ok ? "good" : "bad");
      if (st.type === "pick" || st.type === "suspect" || st.type === "order") {
        const right = st.type === "suspect" ? [st.answer] : st.answer;
        S.scene3d.mark(right, S.sel.filter((id) => !right.includes(id)));
      }
    }
    if (st.type === "pick" || st.type === "suspect") {
      const right = st.type === "suspect" ? [st.answer] : st.answer;
      document.querySelectorAll("#lsScene .ls-tile").forEach((t) => { if (right.includes(t.dataset.id)) t.classList.add("is-right"); else if (t.classList.contains("is-sel")) t.classList.add("is-wrong"); });
    } else if (st.type === "order") {
      document.querySelectorAll("#lsScene .ls-tile").forEach((t) => { if (st.answer.includes(t.dataset.id)) t.classList.add("is-right"); });
    } else if (st.type === "move") {
      drawMove(true);
    }
    const last = S.i === S.steps.length - 1, dead = S.hearts <= 0;
    const flags = st.words.map((id) => { const e = byId(id); return e ? `<button type="button" class="ls-flag" data-ls="flag" data-v="${esc(id)}">🤔 ${esc(e.word)}</button>` : ""; }).join("");
    const fb = $("lsFb");
    fb.className = `ls-fb ${ok ? "is-good" : "is-bad"}`;
    fb.innerHTML = `<h4>${ok ? "✓ To'g'ri!" : `✗ ${esc(note || "Noto'g'ri")}`}</h4>
      ${ok ? "" : `<div class="ls-says">${esc(st.detail || "")}</div>`}
      <div class="ls-says">${st.lines.map((l) => `${esc(l.en)}<em>${esc(l.uz)}</em>`).join("<br>")}</div>
      ${flags ? `<div><div class="ls-note" style="margin-bottom:4px">Tushunmagan so'zlaringizni belgilang — ular Word Race'da so'raladi:</div><div class="ls-flags">${flags}</div></div>` : ""}
      <button type="button" class="ls-btn ${dead ? "" : "is-amber"}" data-ls="next">${dead ? "Natijani ko'rish" : last ? "🏁 Missiyani tugatish" : "Keyingi ▶"}</button>`;
    fb.hidden = false;
    fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function next() {
    const dead = S.hearts <= 0, last = S.i === S.steps.length - 1;
    if (dead || last) return finishMission(dead);
    S.i++;
    showStep();
  }

  // ---- the map (Escape the Building)
  function drawMove(reveal, instant) {
    const st = S.steps[S.i], m = S.move;
    if (S.scene3d) {
      S.scene3d.setMove({ x: m.x, y: m.y, h: m.h, trail: m.trail }, instant);
      if (reveal) S.scene3d.reveal(st.path, st.expected);
      return;
    }
    document.querySelectorAll("#lsGrid .ls-cell").forEach((c) => {
      const x = +c.dataset.x, y = +c.dataset.y;
      c.className = "ls-cell";
      c.textContent = "";
      if (m.trail.some((t) => t.x === x && t.y === y)) c.classList.add("is-trail");
      if (reveal && st.path.some((t) => t.x === x && t.y === y)) c.classList.add("is-route");
      if (reveal && st.expected.x === x && st.expected.y === y) { c.classList.add("is-exit"); c.textContent = "🚪"; }
      if (m.x === x && m.y === y && !(reveal && st.expected.x === x && st.expected.y === y)) c.innerHTML = `<span class="ls-token" style="display:inline-block;transform:rotate(${m.h * 90}deg)">⬆️</span>`;
    });
  }
  function move(c) {
    if (S.locked) return;
    const m = S.move;
    if (m.cmds.length >= 14) return;
    if (c === "L") m.h = (m.h + 3) % 4;
    else if (c === "R") m.h = (m.h + 1) % 4;
    else {
      const x = m.x + DIRS[m.h][0], y = m.y + DIRS[m.h][1];
      if (x < 0 || y < 0 || x >= GRID || y >= GRID) { toast("Bu yerda devor!"); return; }
      m.x = x; m.y = y; m.trail.push({ x, y });
    }
    m.cmds.push(c);
    sfx.tap();
    drawMove();
  }
  function moveReset() { if (S.locked) return; const st = S.steps[S.i]; S.move = { ...st.start, cmds: [], trail: [{ x: st.start.x, y: st.start.y }] }; drawMove(false, true); }

  // ---- tiles
  function tapTile(id) {
    if (S.locked) return;
    const st = S.steps[S.i];
    sfx.tap();
    if (!["order", "pick", "suspect"].includes(st.type)) return;   // clicks on the 3D scene only matter for choosing things
    if (st.type === "order") {
      const at = S.sel.indexOf(id);
      if (at >= 0) S.sel.splice(at, 1); else S.sel.push(id);
      if (S.scene3d) S.scene3d.setSelected(S.sel, true);
      document.querySelectorAll("#lsScene .ls-tile").forEach((t) => {
        const k = S.sel.indexOf(t.dataset.id);
        t.classList.toggle("is-sel", k >= 0);
        const old = t.querySelector(".no"); if (old) old.remove();
        if (k >= 0) t.insertAdjacentHTML("beforeend", `<span class="no">${k + 1}</span>`);
      });
      const go = $("lsGo"); if (go) go.disabled = !S.sel.length;
      return;
    }
    S.sel = [id];
    if (S.scene3d) S.scene3d.setSelected(S.sel, false);
    document.querySelectorAll("#lsScene .ls-tile").forEach((t) => t.classList.toggle("is-sel", t.dataset.id === id));
    resolveStep(check(st));
  }
  function undo() { if (S.locked || !S.sel.length) return; tapTile(S.sel[S.sel.length - 1]); }

  // ------------------------------------------------------------------ finishing
  function wordReport() {
    const m = new Map();
    S.results.forEach((r) => r.words.forEach((id) => { const ok = r.ok && !S.flagged.has(id); m.set(id, m.has(id) ? m.get(id) && ok : ok); }));
    S.flagged.forEach((id) => m.set(id, false));
    return [...m.entries()].map(([id, ok]) => ({ id, ok }));
  }

  async function finishMission(failed) {
    game.active = false;
    S.view = "result";
    const steps = S.steps.length, correct = S.results.filter((r) => r.ok).length;
    const seconds = Math.round((Date.now() - S.startedAt) / 1000);
    const report = wordReport();
    stage(`<div class="ls-title">⏳ Natija saqlanmoqda…</div>`);
    if (W()) await W().report(report, "listen");
    const r = await http("/api/listen/finish", "POST", { mission: S.mission.id, difficulty: S.diff, steps, correct, hearts: Math.max(0, S.hearts), seconds });
    const stars = r.ok ? r.data.stars : 0;
    if (r.ok) S.progress = r.data.progress;
    if (failed) sfx.wrong(); else sfx.win();
    const ids = [...new Set(S.results.flatMap((x) => x.words))];
    const idx = MISSIONS.findIndex((m) => m.id === S.mission.id);
    const unlocked = !failed && stars >= 1 && MISSIONS[idx + 1] && !(S.progress[MISSIONS[idx + 1].id] || {}).stars;
    stage(`
      <div class="ls-title"><span style="font-size:32px">${failed ? "💔" : stars === 3 ? "🏆" : "🎉"}</span><div>${failed ? "Missiya muvaffaqiyatsiz" : stars ? "Missiya bajarildi!" : "Yana urinib ko'ring"}<small>${esc(S.mission.title)} · ${D().name}</small></div></div>
      <div class="ls-result"><div class="big">${"★".repeat(stars)}<s>${"★".repeat(3 - stars)}</s></div><b>${correct}/${steps} ta to'g'ri · ${seconds} soniya</b>
        <div class="ls-note" style="margin-top:6px">${r.ok ? (r.data.awarded ? `+${r.data.awarded} ball reytingga qo'shildi` : r.data.earned ? "Bugungi o'yin balli limiti to'lgan" : "Ball olish uchun missiyani sekinroq va diqqat bilan o'ynang") : "Natija faqat shu qurilmada ko'rsatildi (internet yo'q)."}</div>
        ${unlocked ? `<div class="ls-note" style="color:#fcd34d;margin-top:4px">🔓 Keyingi missiya ochildi: ${esc(MISSIONS[idx + 1].title)}</div>` : ""}</div>
      <div class="ls-card"><div class="ls-h" style="margin-bottom:4px">Bu missiyadagi so'zlar</div>${ids.map((id) => {
        const e = byId(id); if (!e) return "";
        const st = W() ? W().statusOf(id) : "new", flagged = S.flagged.has(id);
        return `<div class="ls-glos"><span><b>${esc(e.word)}</b></span><button type="button" data-ls="say" data-v="${esc(e.word)}" aria-label="Eshitish">🔊</button><em>${esc(e.meaning_uz)} ${W() ? `<i>· ${esc(W().LABEL[st])}${flagged ? " · 🤔" : ""}</i>` : ""}</em></div>`;
      }).join("")}</div>
      <div class="ls-row" style="flex-direction:column"><button type="button" class="ls-btn is-amber" data-ls="again">🔄 Qayta o'ynash</button>
        ${unlocked ? `<button type="button" class="ls-btn" data-ls="open" data-v="${MISSIONS[idx + 1].id}">▶ Keyingi missiya</button>` : ""}
        <button type="button" class="ls-btn is-quiet" data-ls="hub">Missiyalar</button></div>`);
  }

  async function leave() {
    S.token++; TTS.cancel(); clearInterval(S.timer); S.timer = 0;
    game.active = false;
    if (S.view === "play" && S.results.length && W()) W().report(wordReport(), "listen");   // what was answered so far still counts for the words
    await goHub();
  }

  async function goHub() {
    renderHub();
    const r = await http("/api/listen/progress");
    if (r.ok) { S.progress = r.data.missions || {}; if (S.view === "hub") renderHub(); }
  }

  const game = {
    active: false,
    showIntro() { S.token++; TTS.cancel(); clearInterval(S.timer); S.timer = 0; if (W()) W().load(); if (S.view === "play") return void leave(); goHub(); },
    init() { this.showIntro(); },
    pause() { TTS.cancel(); },
  };

  // ------------------------------------------------------------------ events
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-ls]");
    const a = area();
    if (!b || !a || !a.contains(b)) return;
    const act = b.dataset.ls, v = b.dataset.v;
    const l = L1(); if (l && l.Haptic) l.Haptic.tap();
    if (act === "diff") { S.diff = v; return renderHub(); }
    if (act === "open") { const m = MISSIONS.find((x) => x.id === v); if (m) renderBrief(m); return; }
    if (act === "hub") return goHub();
    if (act === "start") return startMission(S.mission);
    if (act === "again") return startMission(S.mission);
    if (act === "leave") return leave();
    if (act === "say") { TTS.cancel(); TTS.speak(v, 0.85, TTS.voiceFor(0)); return; }
    if (act === "replay") return replay();
    if (act === "captions") {
      const cap = $("lsCap"); const st = S.steps[S.i];
      cap.hidden = !cap.hidden; b.classList.toggle("is-on", !cap.hidden);
      if (!cap.hidden) cap.textContent = st.lines.map((x) => x.en).join(" ");
      return;
    }
    if (act === "tile") return tapTile(b.dataset.id);
    if (act === "undo") return undo();
    if (act === "submit") return submit();
    if (act === "mv") return move(v);
    if (act === "mvreset") return moveReset();
    if (act === "mvdone") return resolveStep(check(S.steps[S.i]));
    if (act === "flag") { if (S.flagged.has(v)) S.flagged.delete(v); else S.flagged.add(v); b.classList.toggle("is-on", S.flagged.has(v)); return; }
    if (act === "next") return next();
  });

  window.L1_Listen = game;
})();
