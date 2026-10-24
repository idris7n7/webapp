// Learning hub: the O'rganish and Mashq qilish pages of the student app.
//   O'rganish:   Grammatika (weeks -> lessons, each opens once the one before is learned), Lug'at kartalar (weeks -> units -> cards,
//                plus a weekly word practice) and Rasmli lug'at (weeks -> units -> pictures).
//   Mashq qilish: Grammatika and Lug'at (weeks -> units -> three kinds of questions).
// The lesson reader, the flashcard deck and the exercise runner of the old screens are reused: their markup is moved in here.
// Also owns the lesson order that decides which daily homework is open (see plan()).
(function (window, document) {
  "use strict";
  const L1 = window.L1;
  if (!L1) return;
  const { Back, Haptic, html } = L1;
  const $ = (id) => document.getElementById(id);
  const toast = (m) => { if (typeof showToast === "function") showToast(m); };
  const user = () => (typeof state !== "undefined" ? state.authStudent : null);
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const strip = (q) => String(q || "").replace(/^\s*\d+\.\s*/, "");
  const first = (a) => String(a).split("|")[0];
  const same = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  const PASS = 60; // % a practice needs before it counts

  // ------------------------------------------------------------------ the curriculum
  let lessonCache = null;
  function lessons() {
    if (lessonCache) return lessonCache;
    if (typeof FOUR_SECTIONS_DATA === "undefined") return [];
    lessonCache = [];
    FOUR_SECTIONS_DATA.forEach((sec) => sec.topics.forEach((t) => {
      lessonCache.push({ id: t.id, n: lessonCache.length + 1, week: parseInt(t.week, 10) || 1, title: t.title, desc: t.desc || "", topic: t, sec });
    }));
    return lessonCache;
  }
  const learned = (id) => typeof isUnitLearned === "function" && isUnitLearned(id);
  const weekNumbers = (list) => [...new Set(list.map((x) => x.week))].sort((a, b) => a - b);

  // Flashcard words grouped by unit (1a, 1b ... 2g)
  function vocabUnits(week) {
    const cards = typeof FLASHCARDS_DATA !== "undefined" ? FLASHCARDS_DATA : [];
    const map = new Map();
    cards.filter((c) => c.week === week).forEach((c) => {
      if (!map.has(c.unit)) map.set(c.unit, { unit: c.unit, title: c.category, week, cards: [] });
      map.get(c.unit).cards.push(c);
    });
    return [...map.values()];
  }
  const vocabWeeks = () => weekNumbers((typeof FLASHCARDS_DATA !== "undefined" ? FLASHCARDS_DATA : []).map((c) => ({ week: c.week })));
  const weekCards = (week) => (typeof FLASHCARDS_DATA !== "undefined" ? FLASHCARDS_DATA : []).filter((c) => c.week === week);

  // ------------------------------------------------------------------ progress
  // Which of the three grammar practices a student finished, per lesson (on this device, per student).
  const KINDS = ["mcq", "fill", "mistake"];
  const pKey = () => "l1_practice_done_v2_" + ((user() && (user().id || user().name)) || "guest");
  function pRead() { try { return JSON.parse(localStorage.getItem(pKey()) || "{}") || {}; } catch (e) { return {}; } }
  const practiceKinds = (id) => pRead()[id] || {};
  const practiceDone = (id) => KINDS.every((k) => practiceKinds(id)[k]);

  // The whole path, lesson by lesson: lesson -> its practice -> its homework (hw_<lesson id> on the server).
  function plan() {
    const asgs = (window.L1_Shell && window.L1_Shell.data && window.L1_Shell.data.assignments) || [];
    const byId = {};
    asgs.forEach((a) => { byId[a.id] = a; });
    const L = lessons();
    let prevDone = true;
    return L.map((l, i) => {
      const isLearned = learned(l.id);
      const asg = byId["hw_" + l.id] || null;
      const hwDone = !!(asg && asg.my && asg.my.done);
      const need = [];
      if (!isLearned) need.push("lesson");
      else if (!practiceDone(l.id)) need.push("practice");
      if (!prevDone) need.push("prev");
      if (!asg) need.push("loading");
      prevDone = hwDone;
      return {
        i, lesson: l, learned: isLearned, lessonOpen: i === 0 || learned(L[i - 1].id),
        practice: practiceKinds(l.id), practiceDone: practiceDone(l.id), asg, hwDone, need, hwOpen: need.length === 0,
      };
    });
  }
  const nextLesson = () => plan().find((p) => !p.learned) || null;
  const nextHomework = () => plan().find((p) => !p.hwDone) || null;

  // ------------------------------------------------------------------ practice questions
  const shortInstr = (ex) => { const s = String(ex.instruction_uz || ex.instruction_en || ""); return s.length > 70 ? s.slice(0, 67) + "…" : s; };

  // A wrong sentence made from a multiple-choice question: the student finds the mistake and writes it correctly.
  function synthMistake(text, options, a) {
    const wrong = options.filter((o) => !same(o, a) && /[a-z]/i.test(o));
    if (!wrong.length) return null;
    const w = wrong[Math.floor(Math.random() * wrong.length)];
    if (text.includes("___")) return { q: text.replace("___", w), a: text.replace("___", first(a)) };
    if (/which (sentence|question) is correct/i.test(text)) return { q: w, a: first(a) };
    if (/→\s*$/.test(text)) return { q: text.replace(/→\s*$/, "→ " + w), a: first(a) };
    return null;
  }

  function grammarPools(topicId) {
    const l = lessons().find((x) => x.id === topicId);
    const all = (typeof state !== "undefined" && state.exercises) || [];
    const exs = ((l && l.topic.exerciseIds) || []).map((id) => all.find((e) => e.id === id)).filter(Boolean);
    const mcq = [], fill = [], mistake = [], blanks = [], synth = [];
    exs.forEach((ex) => {
      const isMistake = /mistake/i.test(ex.title || "");
      const hint = shortInstr(ex);
      (ex.questions || []).forEach((q) => {
        const text = strip(q.q);
        if (isMistake) mistake.push({ q: text, a: q.a });
        else if (q.options && q.options.length > 1) {
          mcq.push({ q: text, options: q.options, a: q.a });
          const s = synthMistake(text, q.options, q.a);
          if (s) synth.push(s);
          if (text.includes("___")) blanks.push({ q: text, a: q.a, hint });
        } else fill.push({ q: text, a: q.a, hint });
      });
    });
    if (fill.length < 6) fill.push(...shuffle(blanks).slice(0, 8 - fill.length));
    if (mistake.length < 6) mistake.push(...shuffle(synth).slice(0, 8 - mistake.length));
    return { mcq, fill, mistake };
  }

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function vocabQuestions(kind, cards, pool) {
    const altsOf = (c) => String(c.word).split(" / ").map((s) => s.trim()).filter(Boolean);
    if (kind === "match") {
      return shuffle(cards).slice(0, 10).map((c) => {
        const others = shuffle(pool.filter((x) => x.id !== c.id && x.meaning_uz !== c.meaning_uz)).slice(0, 3).map((x) => x.meaning_uz);
        return { q: `"${c.word}" — o'zbekcha ma'nosi qaysi?`, options: shuffle([c.meaning_uz, ...others]), a: c.meaning_uz };
      });
    }
    if (kind === "type") {
      return shuffle(cards).slice(0, 10).map((c) => {
        const alts = altsOf(c);
        const w = alts[0];
        return { q: c.meaning_uz, a: alts.join("|"), hint: `${w[0]}${w.slice(1).replace(/[^ ]/g, "•")} (${w.replace(/ /g, "").length} harf)` };
      });
    }
    const out = [];
    shuffle(cards).forEach((c) => {
      if (out.length >= 10 || !c.example_en) return;
      const m = c.example_en.match(new RegExp("\\b" + escRe(altsOf(c)[0]) + "\\b", "i"));
      if (!m) return;
      const others = shuffle(pool.filter((x) => x.id !== c.id && x.word.toLowerCase() !== m[0].toLowerCase())).slice(0, 3).map((x) => altsOf(x)[0]);
      out.push({ q: c.example_en.replace(m[0], "_____") + (c.example_uz ? `  (${c.example_uz})` : ""), options: shuffle([m[0], ...others]), a: m[0] });
    });
    return out;
  }

  const KIND_INFO = {
    grammar: [
      { k: "mcq", n: "Multiple Choice Questions", d: "Qavs ichidagi yoki gapdagi to'g'ri variantni tanlang.", type: "mcq", en: "Choose the correct answer.", uz: "To'g'ri javobni belgilang." },
      { k: "fill", n: "Fill in the Blanks", d: "Bo'sh joyni to'ldiring yoki so'ralgan shaklni yozing.", type: "fill", en: "Write the answer.", uz: "Javobni o'zingiz yozing." },
      { k: "mistake", n: "Correct the Mistake", d: "Gapdagi xatoni toping va to'g'ri shaklini yozing.", type: "correct_mistake", en: "Find the mistake and write the correct form.", uz: "Xatoni toping va to'g'ri yozing." },
    ],
    vocab: [
      { k: "match", n: "Match the Meaning (Uzbek)", d: "Inglizcha so'zning o'zbekcha ma'nosini toping.", type: "mcq", en: "Choose the Uzbek meaning.", uz: "To'g'ri tarjimani tanlang." },
      { k: "type", n: "Type the Word", d: "O'zbekcha ma'noga qarab inglizcha so'zni yozing.", type: "type_word", en: "Write the English word.", uz: "Inglizcha so'zni yozing." },
      { k: "complete", n: "Complete the Sentence", d: "Gapdagi tushib qolgan so'zni tanlang.", type: "mcq", en: "Choose the missing word.", uz: "Yetishmayotgan so'zni tanlang." },
    ],
  };

  // The questions for one practice menu: { grammar|vocab, scope: topic|unit|week }
  function questionsFor(p, kind) {
    if (p.cat === "grammar") return grammarPools(p.id)[kind] || [];
    const cards = p.scope === "week" ? weekCards(p.week) : (vocabUnits(p.week).find((u) => u.unit === p.unit) || { cards: [] }).cards;
    return vocabQuestions(kind, cards, weekCards(p.week));
  }
  function menuTitle(p) {
    if (p.cat === "grammar") { const l = lessons().find((x) => x.id === p.id); return l ? `${l.n}-dars · ${l.title}` : "Mashq"; }
    if (p.scope === "week") return `${p.week}-hafta · barcha so'zlar`;
    const u = vocabUnits(p.week).find((x) => x.unit === p.unit);
    return u ? `${p.unit.toUpperCase()} · ${u.title}` : "Mashq";
  }

  // ------------------------------------------------------------------ navigation state
  const H = { mode: "learn", sub: { learn: "grammar", practice: "grammar" }, stack: [], moved: false };
  try { const s = JSON.parse(localStorage.getItem("l1_hub_v1") || "{}"); if (s.mode) H.mode = s.mode; if (s.sub) H.sub = { ...H.sub, ...s.sub }; } catch (e) { /* first visit */ }
  const save = () => { try { localStorage.setItem("l1_hub_v1", JSON.stringify({ mode: H.mode, sub: H.sub })); } catch (e) { /* private mode */ } };
  const cur = () => H.stack[H.stack.length - 1] || null;

  function go(view, p) {
    const entry = { view, p: p || {} };
    entry.handle = Back.push(() => up(entry));
    H.stack.push(entry);
    render();
    window.scrollTo(0, 0);
  }
  function leave(entry) {
    const PS = window.L1_PracticeSuite;
    if (entry.view === "lesson") { if (typeof state !== "undefined") state.activeLearnUnitId = null; }
    if (entry.view === "runner" && PS) { PS.activeExerciseId = null; PS.exerciseData = null; PS.userAnswers = {}; }
    if (entry.view === "progress") { const v = $("myProgressView"); if (v) v.classList.add("hidden"); if (typeof state !== "undefined") state.subCategory = "grammar"; }
  }
  function up(entry) {
    const top = entry || cur();
    if (!top) return;
    const i = H.stack.lastIndexOf(top);
    if (i < 0) return;
    H.stack.splice(i).forEach((e) => { Back.remove(e.handle); leave(e); });
    render();
  }
  function reset() { if (H.stack.length) { H.stack.splice(0).reverse().forEach((e) => { Back.remove(e.handle); leave(e); }); render(); } }
  // a view that replaces the current one (lesson -> its practice)
  function replace(view, p) { const e = cur(); if (e) { H.stack.pop(); Back.remove(e.handle); leave(e); } go(view, p); }

  // ------------------------------------------------------------------ pieces of markup
  const shk = (scene, mode, size) => (window.L1_Shakespeare && window.L1_Shakespeare.banner ? window.L1_Shakespeare.banner(scene, mode, size) : "");
  const backRow = (title, sub) => `<div class="flex items-center gap-3">
      <button type="button" class="l1-btn l1-btn-soft l1-btn-sm" data-act="back" aria-label="Orqaga">← Orqaga</button>
      <div class="min-w-0"><div class="hub-title truncate">${html(title)}</div>${sub ? `<div class="l1-sub">${html(sub)}</div>` : ""}</div></div>`;
  function row(o) {
    const d = Object.entries(o.data || {}).map(([k, v]) => ` data-${k}="${html(v)}"`).join("");
    return `<button type="button" class="${o.cls || "hub-unit"}${o.state ? " " + o.state : ""}" data-act="${o.act}"${d}>
      <span class="hub-num ${o.numCls || ""}">${o.num}</span>
      <span class="hub-body"><span class="hub-name">${html(o.name)}</span><span class="hub-desc" style="display:block">${html(o.desc || "")}</span>${o.bar != null ? `<span class="l1-progress" style="display:block"><i style="width:${o.bar}%"></i></span>` : ""}</span>
      <span class="hub-side">${o.side || "›"}</span></button>`;
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  // ------------------------------------------------------------------ views
  function viewRoot() {
    const learnMode = H.mode === "learn";
    const sub = H.sub[H.mode];
    const tabs = learnMode
      ? [["grammar", "📘 Grammatika"], ["vocab", "📗 Lug'at kartalar"], ["pics", "🖼️ Rasmli lug'at"]]
      : [["grammar", "📘 Grammatika"], ["vocab", "📗 Lug'at"]];
    const kind = (learnMode ? "learn-" : "practice-") + sub;
    let weeks = "";
    if (sub === "grammar") {
      const L = lessons();
      weeks = weekNumbers(L).map((w) => {
        const ls = L.filter((l) => l.week === w);
        const done = ls.filter((l) => (learnMode ? learned(l.id) : practiceDone(l.id))).length;
        const open = ls.some((l) => !learned(l.id)) ? "" : "is-done";
        return row({ cls: "hub-week", act: "week", data: { kind, week: w }, num: w, numCls: done === ls.length ? "is-done" : "", name: `${w}-Hafta`,
          desc: learnMode ? `${ls.length} ta dars · ${done} tasi o'zlashtirildi` : `${ls.length} ta mavzu · ${done} tasi mashq qilingan`, bar: pct(done, ls.length), state: open });
      }).join("");
    } else {
      const words = (w) => weekCards(w).length;
      weeks = vocabWeeks().map((w) => {
        const us = vocabUnits(w);
        return row({ cls: "hub-week", act: "week", data: { kind, week: w }, num: w, name: `${w}-Hafta`, desc: `${us.length} ta unit · ${words(w)} ta so'z` });
      }).join("");
      if (learnMode && sub === "vocab") {
        weeks += `<div class="hub-section-label">🎯 Haftalik so'zlarni mashq qilish</div>` + vocabWeeks().map((w) =>
          row({ cls: "hub-week hub-week-practice", act: "wpractice", data: { week: w }, num: "🎯", name: `${w}-hafta so'zlari`, desc: `${weekCards(w).length} ta so'z bo'yicha 3 xil mashq` })).join("");
      }
    }
    return `${shk(learnMode ? "glasses" : "desk", learnMode ? "learn" : "practice", 112)}
      <div class="hub-modes"><button type="button" data-act="mode" data-v="learn" class="${learnMode ? "is-active" : ""}">📖 O'rganish</button>
        <button type="button" data-act="mode" data-v="practice" class="${learnMode ? "" : "is-active"}">✍️ Mashq qilish</button></div>
      <div class="hub-tabs">${tabs.map(([k, n]) => `<button type="button" data-act="sub" data-v="${k}" class="${k === sub ? "is-active" : ""}">${n}</button>`).join("")}</div>
      <div class="hub-weeks">${weeks}</div>`;
  }

  function viewWeek(p) {
    const w = Number(p.week);
    const learnMode = p.kind.startsWith("learn");
    const sub = p.kind.split("-")[1];
    let body = "";
    if (sub === "grammar") {
      const L = lessons().filter((l) => l.week === w);
      const all = lessons();
      const current = nextLesson();
      body = L.map((l) => {
        const idx = all.findIndex((x) => x.id === l.id);
        const open = idx === 0 || learned(all[idx - 1].id);
        const isLearned = learned(l.id);
        if (learnMode) {
          const isCur = current && current.lesson.id === l.id;
          return row({ act: open ? "lesson" : "locked", data: { id: l.id }, num: l.n, numCls: isLearned ? "is-done" : open ? "" : "is-locked", name: l.title, desc: l.desc,
            side: isLearned ? "✅" : open ? "▶" : "🔒", state: (open ? "" : "is-locked") + (isCur ? " is-current" : "") });
        }
        const k = practiceKinds(l.id);
        const n = KINDS.filter((x) => k[x]).length;
        return row({ act: isLearned ? "pmenu" : "plocked", data: { id: l.id, scope: "topic", cat: "grammar" }, num: l.n, numCls: n === 3 ? "is-done" : isLearned ? "" : "is-locked", name: l.title,
          desc: isLearned ? `Mashqlar: ${n}/3 tugallangan` : "Avval darsni o'zlashtiring", side: n === 3 ? "✅" : isLearned ? "›" : "🔒", state: isLearned ? "" : "is-locked" });
      }).join("");
    } else {
      const F = window.L1_Flashcards;
      body = vocabUnits(w).map((u) => {
        const act = learnMode ? (sub === "pics" ? "pics" : "cards") : "pmenu";
        const known = F ? u.cards.filter((c) => F.ratingOf(c.id) === "mastered").length : 0;
        return row({ act, data: { unit: u.unit, week: w, scope: "unit", cat: "vocab" }, num: u.unit.toUpperCase(), name: u.title,
          desc: sub === "pics" || !learnMode ? `${u.cards.length} ta so'z` : `${u.cards.length} ta so'z · ${known} tasi yodlangan`, bar: sub === "vocab" && learnMode ? pct(known, u.cards.length) : null });
      }).join("");
    }
    const sec = { grammar: learnMode ? "Darslar" : "Mavzular", vocab: "Unitlar", pics: "Unitlar" }[sub];
    return `${backRow(`${w}-Hafta`, sec)}<div class="hub-weeks">${body}</div>`;
  }

  function viewPics(p) {
    const u = vocabUnits(Number(p.week)).find((x) => x.unit === p.unit);
    if (!u) return backRow("Rasmli lug'at");
    return `${backRow(`${u.unit.toUpperCase()} · ${u.title}`, `${u.cards.length} ta so'z · rasmni bossangiz, so'z o'qiladi`)}
      <div class="hub-pics">${u.cards.map((c) => `<button type="button" class="hub-pic" data-act="speak" data-w="${html(c.word)}">
        ${c.image ? `<img src="${html(c.image)}" alt="${html(c.word)}" loading="lazy" decoding="async">` : `<div class="big">${html(c.bigText || c.word)}</div>`}
        <b>${html(c.word)}</b><span>${html(c.meaning_uz)}</span></button>`).join("")}</div>`;
  }

  function viewMenu(p) {
    const done = p.cat === "grammar" ? practiceKinds(p.id) : {};
    const cards = KIND_INFO[p.cat].map((ki, i) => {
      const n = questionsFor(p, ki.k).length;
      const ok = !!done[ki.k];
      return `<button type="button" class="hub-unit hub-kind k${i + 1}${ok ? " is-done" : ""}${n ? "" : " is-locked"}" data-act="${n ? "start" : "none"}" data-k="${ki.k}">
        <span class="hub-num">${ok ? "✓" : i + 1}</span>
        <span class="hub-body"><span class="hub-name">${ki.n}</span><span class="hub-desc" style="display:block">${n ? `${ki.d} · ${Math.min(n, 10)} ta savol` : "Bu bo'limda savollar yo'q."}</span></span>
        <span class="hub-side">${ok ? "✅" : "›"}</span></button>`;
    }).join("");
    const sub = p.cat === "grammar" ? "Uchala mashqni ≥60% bilan tugatsangiz, shu mavzuning kunlik vazifasi ochiladi." : "Savollar har safar aralashtiriladi.";
    return `${backRow(menuTitle(p), sub)}<div class="hub-kinds">${cards}</div>`;
  }

  function viewDeckHead(p) {
    const u = vocabUnits(Number(p.week)).find((x) => x.unit === p.unit);
    return backRow(u ? `${u.unit.toUpperCase()} · ${u.title}` : "Lug'at", u ? `${u.cards.length} ta so'z · kartani bosing, aylanadi` : "");
  }

  // ------------------------------------------------------------------ render
  function slots(reader, deck, runner) {
    $("hubSlotReader").classList.toggle("hidden", !reader);
    $("hubSlotDeck").classList.toggle("hidden", !deck);
    $("hubSlotRunner").classList.toggle("hidden", !runner);
  }
  function render() {
    const page = $("hubPage");
    if (!page) return;
    const e = cur();
    const v = e ? e.view : "root";
    let out = "";
    let r = false, d = false, x = false;
    if (v === "root") out = viewRoot();
    else if (v === "week") out = viewWeek(e.p);
    else if (v === "pics") out = viewPics(e.p);
    else if (v === "pmenu") out = viewMenu(e.p);
    else if (v === "cards") { out = viewDeckHead(e.p); d = true; }
    else if (v === "lesson") { out = backRow("Dars"); r = true; }
    else if (v === "runner") x = true;
    page.innerHTML = out;
    slots(r, d, x);
  }

  function startPractice(p, kind) {
    const PS = window.L1_PracticeSuite;
    if (!PS || !PS.startData) return;
    const info = KIND_INFO[p.cat].find((k) => k.k === kind);
    const qs = shuffle(questionsFor(p, kind)).slice(0, 10);
    if (!qs.length) { toast("Bu bo'limda savollar topilmadi."); return; }
    const ex = {
      id: `hubp_${p.cat}_${p.id || p.unit || "w" + p.week}_${kind}`, category: p.cat === "grammar" ? "grammar" : "vocabulary", type: info.type,
      title: info.n, desc: menuTitle(p), instruction_en: info.en, instruction_uz: info.uz, questions: qs,
      meta: p.cat === "grammar" ? { topic: p.id, kind } : null,
    };
    go("runner", {});
    PS.startData(ex);
  }

  // ------------------------------------------------------------------ opening things
  function openLesson(id) {
    Haptic.tap();
    const l = lessons().find((x) => x.id === id);
    if (!l) return;
    H.mode = "learn"; H.sub.learn = "grammar"; save();
    if (!cur() || cur().view !== "lesson") go("lesson", { id });
    if (typeof window.openLessonReader === "function") window.openLessonReader(id);
  }
  function openCards(p) {
    const F = window.L1_Flashcards;
    go("cards", p);
    if (F) { F.activeWeek = p.unit; F.init(); }
  }
  function openNextLesson() {
    const n = nextLesson();
    if (window.L1_Shell) window.L1_Shell.go("learn");
    reset();
    if (n) openLesson(n.lesson.id);
  }
  function openPractice(topicId) {
    H.mode = "practice"; H.sub.practice = "grammar"; save();
    if (cur() && cur().view === "lesson") replace("pmenu", { scope: "topic", id: topicId, cat: "grammar" });
    else go("pmenu", { scope: "topic", id: topicId, cat: "grammar" });
  }
  function openProgress() {
    if (window.L1_Shell) window.L1_Shell.go("learn");
    reset();
    const e = { view: "progress", p: {} };
    e.handle = Back.push(() => up(e));
    H.stack.push(e);
    if (typeof state !== "undefined") state.subCategory = "my_progress";
    const v = $("myProgressView");
    if (v) v.classList.remove("hidden");
    if (typeof renderMyProgress === "function") renderMyProgress();
    render();
  }

  // ------------------------------------------------------------------ events
  function onClick(ev) {
    const b = ev.target.closest("[data-act]");
    if (!b) return;
    const a = b.dataset.act;
    const e = cur();
    if (a === "back") { Haptic.tap(); up(); return; }
    if (a === "mode") { H.mode = b.dataset.v; save(); render(); return; }
    if (a === "sub") { H.sub[H.mode] = b.dataset.v; save(); render(); return; }
    if (a === "week") { Haptic.tap(); go("week", { kind: b.dataset.kind, week: b.dataset.week }); return; }
    if (a === "lesson") { openLesson(b.dataset.id); return; }
    if (a === "locked") {
      const all = lessons();
      const i = all.findIndex((l) => l.id === (b.dataset.id || ""));
      toast(`🔒 Avval oldingi darsni o'zlashtiring${i > 0 ? `: ${all[i - 1].title}` : ""}.`);
      return;
    }
    if (a === "plocked") { toast("🔒 Mashqlar ochilishi uchun avval darsni o'zlashtiring."); return; }
    if (a === "cards") { Haptic.tap(); openCards({ unit: b.dataset.unit, week: b.dataset.week }); return; }
    if (a === "pics") { Haptic.tap(); go("pics", { unit: b.dataset.unit, week: b.dataset.week }); return; }
    if (a === "pmenu") { Haptic.tap(); go("pmenu", { scope: b.dataset.scope, cat: b.dataset.cat, id: b.dataset.id, unit: b.dataset.unit, week: Number(b.dataset.week) }); return; }
    if (a === "wpractice") { Haptic.tap(); go("pmenu", { scope: "week", cat: "vocab", week: Number(b.dataset.week) }); return; }
    if (a === "start" && e) { Haptic.tap(); startPractice(e.p, b.dataset.k); return; }
    if (a === "speak") {
      try { if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(b.dataset.w); u.lang = "en-US"; u.rate = 0.9; speechSynthesis.speak(u); } } catch (err) { /* no speech */ }
    }
  }

  // every finished practice feeds the level graph on the streak page (right answers up, mistakes down)
  window.addEventListener("l1:practice-submitted", (ev) => {
    const d = ev.detail || {};
    const total = Math.round(+d.total || 0), right = Math.round(+d.score || 0);
    if (total < 1 || right < 0 || right > total || !window.l1Fetch) return;
    window.l1Fetch("/api/progress/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ correct: right, wrong: total - right }) }).catch(() => {});
  });
  window.addEventListener("l1:practice-submitted", (ev) => {
    const d = ev.detail || {};
    const m = d.meta;
    if (!m || !m.topic) return;
    if (d.pct < PASS) { toast(`Mashq hisobga olinishi uchun kamida ${PASS}% kerak. Qayta urinib ko'ring.`); return; }
    const all = pRead();
    const was = practiceDone(m.topic);
    all[m.topic] = { ...(all[m.topic] || {}), [m.kind]: 1 };
    try { localStorage.setItem(pKey(), JSON.stringify(all)); } catch (err) { /* private mode */ }
    if (!was && practiceDone(m.topic)) toast("🎉 Mavzu mashqlari tugadi! Endi bu darsning kunlik vazifasi ochiladi.");
    window.dispatchEvent(new CustomEvent("l1:progress-changed"));
  });
  window.addEventListener("l1:lesson-learned", () => { window.dispatchEvent(new CustomEvent("l1:progress-changed")); if (!cur() || cur().view !== "lesson") render(); });

  // ------------------------------------------------------------------ games banner
  function paintGamesBanner() {
    const host = $("gamesBanner");
    if (host) host.innerHTML = shk("ball", "games", 121);
  }

  // ------------------------------------------------------------------ start
  function init() {
    const host = $("studentMainSections");
    if (!host || $("l1Hub")) return;
    const root = document.createElement("section");
    root.id = "l1Hub";
    root.className = "hidden space-y-4";
    root.innerHTML = `<div id="hubPage" class="l1-page hub-page"></div>
      <div id="hubSlotReader" class="hub-slot hidden"></div><div id="hubSlotDeck" class="hub-slot hidden"></div><div id="hubSlotRunner" class="hub-slot hidden"></div>`;
    host.insertBefore(root, host.firstChild);
    root.addEventListener("click", onClick);

    const reader = $("lessonReaderView");
    if (reader) $("hubSlotReader").appendChild(reader);
    const deck = document.querySelector("#learnVocabArea > .max-w-xl");
    if (deck) $("hubSlotDeck").appendChild(deck);
    const runner = $("practiceSuiteRunnerArea");
    if (runner) $("hubSlotRunner").appendChild(runner);

    const games = $("gamesContainer");
    if (games && !$("gamesBanner")) {
      const g = document.createElement("div");
      g.id = "gamesBanner";
      games.insertBefore(g, games.firstChild);
      paintGamesBanner();
    }

    // The lessons open one after the other: a lesson whose predecessor is not learned yet stays shut.
    const origOpen = window.openLessonReader;
    if (typeof origOpen === "function") {
      window.openLessonReader = function (id) {
        const all = lessons();
        const i = all.findIndex((l) => l.id === id);
        if (i > 0 && !learned(id) && !learned(all[i - 1].id)) { toast(`🔒 Avval oldingi darsni o'zlashtiring: ${all[i - 1].title}`); return; }
        return origOpen.apply(this, arguments);
      };
    }
    window.switchToPracticeMode = (id) => { if (id) openPractice(id); };
    window.switchToLearnMode = (id) => { if (id) openLesson(id); };

    // The runner's own "back to the list" buttons step back one page in the hub.
    const PS = window.L1_PracticeSuite;
    if (PS && !PS.hubHooked) {
      PS.hubHooked = true;
      PS.onBack = () => { const e = cur(); if (e && e.view === "runner") up(e); };
    }
    document.body.classList.add("l1-hub");
    render();
  }

  // called by the app shell when the student changes tab
  function onTab(tab) {
    if (tab !== "learn") reset();
    if (tab === "learn") render();
    if (tab === "games") paintGamesBanner();
  }

  window.L1_Hub = { lessons, plan, nextLesson, nextHomework, practiceDone, openLesson, openNextLesson, openPractice, openProgress, reset, onTab, render, shk };
  init();
})(window, document);
