/* "Millioner" — Who wants to be a millionaire, in English, as a TV studio.
 *
 * 15 questions that get harder, a prize ladder in game coins (not real money), safe levels after question 5 and 10, and
 * three lifelines: 50:50, "Idris ustoz" (phone a friend) and "Zal" (ask the audience). Idris hosts. An answer is chosen,
 * then locked with "Final javob?". The words come from the student's own vocabulary memory (static/words.js): words they
 * miss or have not seen are asked first, learned words only now and then, and every answer is reported back. The grammar
 * questions are in static/millionaire_data.js. The music and the sounds are made in static/millionaire_music.js.
 */
(function () {
  "use strict";

  const kit = () => window.L1_GameKit;
  const L1 = () => window.L1 || null;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rand = (a, b) => a + Math.random() * (b - a);
  const shuffle = (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const LADDER = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
  const SAFE = [4, 9]; // after question 5 (1 000) and question 10 (32 000) the money is safe
  const tierOf = (i) => (i < 5 ? 1 : i < 10 ? 2 : 3);
  const LETTERS = ["A", "B", "C", "D"];
  const BEST_KEY = "l1_millionaire_best";
  const safeAmount = (i) => (i >= SAFE[1] + 1 ? LADDER[SAFE[1]] : i >= SAFE[0] + 1 ? LADDER[SAFE[0]] : 0); // money kept after missing question i (0-based)

  // ------------------------------------------------------------------ sounds (see millionaire_music.js)
  const M = () => window.L1_MillionaireMusic || null;
  const sfx = {
    start() { const m = M(); if (m) m.start_sting(); },
    select() { const m = M(); if (m) m.select(); },
    lock() { const m = M(); if (m) { m.stop(); m.lock(); } },
    right() { const m = M(); if (m) { m.right(); m.applause(2.2); } },
    wrong() { const m = M(); if (m) { m.wrong(); m.oh(); } },
    help() { const m = M(); if (m) m.help(); },
    win() { const m = M(); if (m) { m.win(); m.applause(4.5); } },
    cash() { const m = M(); if (m) { m.right(); m.applause(2); } },
    play(tier) { const m = M(); if (m) m.start(tier); },
    stop() { const m = M(); if (m) m.stop(); },
  };
  const haptic = (k) => { const h = kit(); if (h) h.haptic(k); };

  // ------------------------------------------------------------------ pictures
  // our own emblem: a gold ring around a blue gem
  const LOGO = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="mlGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#f6c453"/><stop offset="1" stop-color="#b9791a"/></linearGradient></defs>
    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#mlGold)" stroke-width="5"/><circle cx="50" cy="50" r="37" fill="#0d1459" stroke="#f6c453" stroke-width="1.5"/>
    <path d="M50 22 71 42 50 79 29 42Z" fill="#4262ff"/><path d="M50 22 61 42 50 79Z" fill="#7d96ff"/><path d="M50 22 39 42 50 79Z" fill="#2f45cf"/><path d="M29 42H71" stroke="#cfe0ff" stroke-width="1.4"/>
    <path d="M78 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#fff3c4"/><path d="M20 70l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4Z" fill="#fff3c4"/></svg>`;
  const logoHtml = (small) => `<div class="ml-logo${small ? " is-small" : ""}">${LOGO}<small>KIM</small><b>MILLIONER</b><i>BO'LISHNI XOHLAYDI?</i></div>`;
  // the hall: dark silhouettes of the audience (they cheer and gasp)
  const hallHtml = () => `<div class="ml-crowd" id="mlHall" aria-hidden="true">${Array.from({ length: 14 }, (_, i) =>
    `<svg class="ml-fig" viewBox="0 0 40 50" style="--d:${((i * 0.137) % 0.5).toFixed(2)}s;--r:${i % 2 ? 4 : -4}deg"><circle cx="20" cy="13" r="9"/><path d="M1 50Q3 27 20 25Q37 27 39 50Z"/></svg>`).join("")}</div>`;
  const crowdMood = (cls, ms) => { const h = $("mlHall"); if (!h) return; h.classList.remove("is-cheer", "is-oh"); h.classList.add(cls); setTimeout(() => h.classList.remove(cls), ms); };

  // ------------------------------------------------------------------ questions
  // The vocabulary question makers are shared with Word Race (static/questions.js).
  const Q = () => window.L1_Questions;
  const cards = () => Q().cards();
  const vocabQuestion = (card, tier, all) => Q().vocabQuestion(card, tier, all);

  function buildGame() {
    const all = cards();
    const words = window.L1_Words ? window.L1_Words.pick(all, Math.min(all.length, 70)) : shuffle(all);
    const grammar = { 1: [], 2: [], 3: [] };
    Q().grammarBank().forEach((g) => grammar[g.t].push(g));
    const plan = { 1: 3, 2: 3, 3: 2 }; // vocabulary slots per tier; the other slots of the tier are grammar
    const qs = [];
    let wi = 0;
    for (let tier = 1; tier <= 3; tier++) {
      const slots = shuffle([...Array(plan[tier]).fill("vocab"), ...Array(5 - plan[tier]).fill("grammar")]);
      const gram = shuffle(grammar[tier]);
      for (const kind of slots) {
        let q = null;
        if (kind === "grammar" && gram.length) {
          const g = gram.pop();
          q = { q: g.q, o: shuffle(g.o), a: g.a, tier, kind: "grammar", cat: "Grammatika", why: g.why };
        }
        while (!q && wi < words.length) q = vocabQuestion(words[wi++], tier, all);
        if (!q && gram.length) { const g = gram.pop(); q = { q: g.q, o: shuffle(g.o), a: g.a, tier, kind: "grammar", cat: "Grammatika", why: g.why }; }
        if (q) qs.push(q);
      }
    }
    return qs;
  }

  // ------------------------------------------------------------------ the game
  let G = null; // the running game
  const game = {
    active: false,

    // Start screen (also what "leave the game" lands on).
    showIntro() {
      flushWords();
      sfx.stop();
      this.active = false; G = null;
      const area = $("gameMillionaireArea");
      if (!area) return;
      const c = window.L1_Words ? window.L1_Words.counts() : { mastered: 0, review: 0, learning: 0, new: 0 };
      const best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
      area.innerHTML = `<div class="ml-stage ml-intro">
        ${logoHtml(false)}
        <div class="ml-hostbar"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble">Qani, millioner bo'lamizmi? 😄</div></div>
        <div class="ml-memory">
          <span class="is-ok">⭐ ${c.mastered || 0} o'zlashtirilgan</span>
          <span class="is-warn">🔁 ${c.review || 0} takrorlash kerak</span>
          <span>📘 ${c.learning || 0} o'rganilmoqda</span>
          <span>🆕 ${c.new || 0} yangi</span>
        </div>
        ${best ? `<div class="ml-best">Eng yaxshi natijangiz: 🪙 ${fmt(best)}</div>` : ""}
        <button type="button" class="ml-start" id="mlStart">▶ Boshlash</button>
        ${hallHtml()}
      </div>`;
      if (kit()) { kit().mountIdris("mlIdrisHost", "wave", 84); }
      $("mlStart").addEventListener("click", () => this.init());
      if (window.L1_Words) window.L1_Words.load().then(() => { if (!this.active && $("mlStart")) this.refreshIntroMemory(); });
    },

    refreshIntroMemory() {
      if (this.active || !$("mlStart")) return;
      const c = window.L1_Words.counts();
      const m = document.querySelector(".ml-memory");
      if (!m) return;
      const spans = m.querySelectorAll("span");
      if (spans.length === 4) {
        spans[0].textContent = `⭐ ${c.mastered || 0} o'zlashtirilgan`;
        spans[1].textContent = `🔁 ${c.review || 0} takrorlash kerak`;
        spans[2].textContent = `📘 ${c.learning || 0} o'rganilmoqda`;
        spans[3].textContent = `🆕 ${c.new || 0} yangi`;
      }
    },

    async init() {
      if (window.L1_Words) await window.L1_Words.load();
      const qs = buildGame();
      if (qs.length < 5) { if (typeof showToast === "function") showToast("Savollar yetarli emas. Keyinroq urinib ko'ring."); return; }
      G = { qs, i: 0, locked: false, used: { fifty: false, phone: false, crowd: false }, helped: false, results: [], correct: 0, over: false, picked: -1 };
      this.active = true;
      buildStage();
      sfx.start(); haptic("ok");
      renderQuestion();
      const area = $("gameMillionaireArea");
      if (kit() && area) kit().focusGame("gameMillionaireArea");
    },

    pause() { sfx.stop(); /* nothing else ticks; answers are reported when the game ends or is left */ },
  };

  // The stage is built once per game; renderQuestion() only swaps what changes.
  function buildStage() {
    const area = $("gameMillionaireArea");
    area.innerHTML = `<div class="ml-stage" id="mlStage">
      <div class="ml-hud">
        <button type="button" class="ml-chip" data-ml="ladder" id="mlQno" aria-label="Pul zinasi"></button>
        <button type="button" class="ml-cash" data-ml="cash" id="mlCash">💰 Pulni olish</button>
      </div>
      <div class="ml-lifelines">
        <button type="button" class="ml-life" data-ml="fifty" id="mlFifty" aria-label="50:50">50:50</button>
        <button type="button" class="ml-life" data-ml="phone" id="mlPhone" aria-label="Idris ustozga qo'ng'iroq">📞</button>
        <button type="button" class="ml-life" data-ml="crowd" id="mlCrowd" aria-label="Zaldan so'rash">👥</button>
      </div>
      <div class="ml-hostbar"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble"></div></div>
      <div class="ml-qwrap"><div class="ml-qcard" id="mlQcard"><div class="ml-cat" id="mlCat"></div><div class="ml-qtext" id="mlQtext"></div></div></div>
      <div class="ml-opts" id="mlOpts"></div>
      <div class="ml-confirm" id="mlConfirm" hidden></div>
      <div class="ml-feedback" id="mlFeedback" hidden></div>
      ${hallHtml()}
      <div class="ml-ladderpanel" id="mlLadderPanel" data-ml="ladder-close" hidden></div>
    </div>`;
    if (kit()) kit().mountIdris("mlIdrisHost", "pointing", 84);
    area.querySelector("#mlStage").addEventListener("click", onClick);
  }

  function say(text, kind) { if (kit()) kit().say("mlBubble", text, kind); }
  function react(pose, mood) { if (kit()) kit().idrisReact("mlIdrisHost", pose, mood); }
  const options = () => [...document.querySelectorAll("#mlOpts .ml-opt")];

  function renderLadder() {
    const p = $("mlLadderPanel");
    if (!p) return;
    p.innerHTML = `<div class="ml-ladderbox"><button type="button" class="ml-ladderx" data-ml="ladder-close" aria-label="Yopish">✕</button>${LADDER.map((v, i) =>
      `<div class="ml-step${SAFE.includes(i) ? " is-safe" : ""}${G && i < G.i ? " is-done" : ""}${G && i === G.i ? " is-now" : ""}"><em>${i + 1}</em><b>🪙 ${fmt(v)}</b></div>`).join("")}</div>`;
  }

  function renderQuestion() {
    const q = G.qs[G.i];
    G.locked = false; G.helped = false; G.picked = -1;
    $("mlQno").textContent = `${G.i + 1}/${G.qs.length} · 🪙 ${fmt(LADDER[G.i])} ▾`;
    $("mlCash").hidden = G.i === 0;
    $("mlCash").disabled = false;
    $("mlCat").textContent = `${q.cat} · ${tierOf(G.i) === 1 ? "oson" : tierOf(G.i) === 2 ? "o'rta" : "qiyin"}`;
    const t = $("mlQtext");
    t.textContent = q.q;
    if (kit()) kit().setQuestionImage(t, q.img);
    const opt = (o, i) => `<button type="button" class="ml-opt" data-ml="opt" data-i="${i}"><span class="ml-letter">${LETTERS[i]}:</span><span class="ml-text">${esc(o)}</span><span class="ml-pct"></span><span class="ml-bar"></span></button>`;
    const rows = [];
    for (let i = 0; i < q.o.length; i += 2) rows.push(`<div class="ml-row">${[i, i + 1].filter((k) => k < q.o.length).map((k) => opt(q.o[k], k)).join("")}</div>`);
    $("mlOpts").innerHTML = rows.join("");
    ["fifty", "phone", "crowd"].forEach((k) => { const b = $("ml" + k[0].toUpperCase() + k.slice(1)); if (b) { b.disabled = G.used[k]; b.classList.toggle("is-used", G.used[k]); } });
    const c = $("mlConfirm"); c.hidden = true; c.innerHTML = "";
    const f = $("mlFeedback"); f.hidden = true; f.innerHTML = "";
    renderLadder();
    react("pointing", null);
    say(G.i === 0 ? "Xush kelibsiz! Birinchi savol. Shoshmang." : G.i === 5 ? "Tabriklayman! 1 000 tanga endi xavfsiz ◆" : G.i === 10 ? "32 000 tanga xavfsiz ◆ Endi qiyinroqlari!" : "Javobni o'ylab tanlang.");
    sfx.play(tierOf(G.i));
  }

  function onClick(ev) {
    const b = ev.target.closest("[data-ml]");
    if (!b || !G || G.over) return;
    const act = b.dataset.ml;
    if (act === "ladder-close") { if (b === ev.target || b.classList.contains("ml-ladderx")) $("mlLadderPanel").hidden = true; return; }
    if (act === "ladder") { renderLadder(); $("mlLadderPanel").hidden = false; return; }
    if (act === "opt") return select(+b.dataset.i);
    if (act === "yes") return lockAnswer();
    if (act === "no") return unselect();
    if (act === "next") return next();
    if (act === "end") return finish(G.endKind, G.endPrize);
    if (act === "fifty" || act === "phone" || act === "crowd") return useHelp(act);
    if (act === "cash") return askCash();
    if (act === "cash-yes") return finish("cash", G.i ? LADDER[G.i - 1] : 0);
    if (act === "cash-no") { const m = document.querySelector(".ml-modal"); if (m) m.remove(); }
  }

  function askCash() {
    if (G.locked || G.i === 0) return;
    const m = document.createElement("div");
    m.className = "ml-modal";
    m.innerHTML = `<div class="ml-modalbox"><b>Pulni olib o'yinni tugatasizmi?</b><p>Siz 🪙 ${fmt(LADDER[G.i - 1])} yutib olasiz.</p>
      <div class="ml-modalbtns"><button type="button" data-ml="cash-yes">💰 Ha, olaman</button><button type="button" data-ml="cash-no" class="is-quiet">Yo'q, davom etaman</button></div></div>`;
    $("mlStage").appendChild(m);
  }

  // An answer is picked first and locked after "Final javob?"; tapping the picked answer again also locks it.
  function select(i) {
    const q = G.qs[G.i];
    if (G.locked || q.o[i] === undefined) return;
    const list = options(), btn = list[i];
    if (!btn || btn.classList.contains("is-out")) return;
    if (G.picked === i) return lockAnswer();
    list.forEach((o) => o.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    G.picked = i;
    sfx.select(); haptic("tap");
    const c = $("mlConfirm");
    c.hidden = false;
    c.innerHTML = `<b>Final javob?</b><button type="button" class="ml-yes" data-ml="yes">🔒 Ha, qulflash</button><button type="button" class="ml-no" data-ml="no">Yo'q</button>`;
    say(`${LETTERS[i]} javobmi? Ishonchingiz komilmi?`);
  }
  function unselect() {
    if (G.locked) return;
    options().forEach((o) => o.classList.remove("is-selected"));
    G.picked = -1;
    const c = $("mlConfirm"); c.hidden = true; c.innerHTML = "";
    say("Javobni o'ylab tanlang.");
  }

  function lockAnswer() {
    if (G.locked || G.picked < 0) return;
    const i = G.picked;
    G.locked = true;
    const list = options();
    list[i].classList.remove("is-selected");
    list[i].classList.add("is-locked");
    list.forEach((o) => (o.disabled = true));
    ["mlFifty", "mlPhone", "mlCrowd", "mlCash"].forEach((id) => { const e = $(id); if (e) e.disabled = true; });
    const c = $("mlConfirm"); c.hidden = true; c.innerHTML = "";
    react("pointing", null);
    say("Javobingiz qulflandi… hayajonli lahza! 🔒");
    sfx.lock(); haptic("ok");
    setTimeout(() => reveal(i), 2000);
  }

  function reveal(i) {
    if (!G || G.over) return;
    const q = G.qs[G.i];
    const right = q.o.indexOf(q.a);
    const opts = options();
    opts[right].classList.remove("is-locked");
    opts[right].classList.add("is-right");
    const ok = i === right;
    if (!ok) { opts[i].classList.remove("is-locked"); opts[i].classList.add("is-wrong"); }
    // a word is only judged when the student answered it without a help
    if (q.wordId && (!G.helped || !ok)) G.results.push({ id: q.wordId, ok });
    const fb = $("mlFeedback");
    const why = q.why ? `<div class="ml-why">💡 ${esc(q.why)}</div>` : "";
    if (ok) {
      G.correct++;
      const last = G.i === G.qs.length - 1;
      if (last) sfx.win(); else sfx.right();
      haptic("ok");
      crowdMood("is-cheer", last ? 4500 : 2200);
      react("thumbsup", "happy");
      if (L1()) L1().Fx.confetti(opts[right], 14);
      say(last ? "BARAKALLA! Siz millionersiz! 🎉" : `To'g'ri! 🪙 ${fmt(LADDER[G.i])} sizniki${SAFE.includes(G.i) ? " — endi xavfsiz ◆" : ""}`, "good");
      $("mlQno").textContent = `${G.i + 1}/${G.qs.length} · 🪙 ${fmt(LADDER[G.i])}`;
      fb.innerHTML = `${why}<button type="button" class="ml-next" data-ml="${last ? "end" : "next"}">${last ? "🏆 Natijani ko'rish" : "Keyingi savol ▶"}</button>`;
      if (last) { G.endKind = "win"; G.endPrize = LADDER[LADDER.length - 1]; }
    } else {
      sfx.wrong(); haptic("err");
      crowdMood("is-oh", 900);
      react("pointing", "no");
      const keep = safeAmount(G.i);
      say(`Afsus, to'g'ri javob: ${q.a}${keep ? ` — Siz 🪙 ${fmt(keep)} olib qolasiz.` : ""}`, "bad");
      G.endKind = "miss"; G.endPrize = keep;
      fb.innerHTML = `${why}<button type="button" class="ml-next" data-ml="end">Natijani ko'rish</button>`;
    }
    fb.hidden = false;
    fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function next() {
    if (!G || G.over) return;
    G.i++;
    renderQuestion();
  }

  // ---- the three lifelines
  function useHelp(kind) {
    if (G.locked || G.used[kind]) return;
    const q = G.qs[G.i];
    const right = q.o.indexOf(q.a);
    const opts = options();
    const live = opts.map((_, i) => i).filter((i) => !opts[i].classList.contains("is-out"));
    G.used[kind] = true; G.helped = true;
    const btn = $("ml" + kind[0].toUpperCase() + kind.slice(1));
    if (btn) { btn.disabled = true; btn.classList.add("is-used"); }
    sfx.help();
    const tier = tierOf(G.i);
    if (kind === "fifty") {
      const wrong = shuffle(live.filter((i) => i !== right)).slice(0, 2);
      wrong.forEach((i) => { opts[i].classList.add("is-out"); opts[i].disabled = true; });
      if (wrong.includes(G.picked)) unselect();
      say("Ikkita noto'g'ri javob olib tashlandi.");
    } else if (kind === "phone") {
      const sure = Math.random() < (tier === 1 ? 0.92 : tier === 2 ? 0.74 : 0.52);
      const pickWrong = shuffle(live.filter((i) => i !== right))[0];
      const say1 = sure ? right : pickWrong;
      const word = sure
        ? (tier === 3 ? `Menimcha ${LETTERS[say1]}, lekin 100% ishonchim komil emas.` : `Men ishonaman: javob ${LETTERS[say1]}!`)
        : `Hmm… ${LETTERS[say1]} bo'lsa kerak? Aniq bilmayman.`;
      react("wave", "happy");
      say("📞 Idris ustoz: " + word, "good");
    } else {
      const lead = tier === 1 ? rand(62, 85) : tier === 2 ? rand(45, 70) : rand(30, 55);
      const wrongCrowd = Math.random() < (tier === 3 ? 0.2 : 0.08);
      const winner = wrongCrowd ? shuffle(live.filter((i) => i !== right))[0] : right;
      const rest = live.filter((i) => i !== winner);
      const pct = {}; pct[winner] = Math.round(lead);
      // the rest of the votes are split randomly; the last option takes whatever is left so the total is 100
      const weights = rest.map(() => rand(0.3, 1)), total = weights.reduce((a, b) => a + b, 0);
      let left = 100 - pct[winner];
      rest.forEach((i, k) => {
        const v = k === rest.length - 1 ? left : Math.min(left, Math.round(((100 - pct[winner]) * weights[k]) / total));
        pct[i] = Math.max(0, v); left -= pct[i];
      });
      live.forEach((i) => {
        const bar = opts[i].querySelector(".ml-bar");
        opts[i].querySelector(".ml-pct").textContent = pct[i] + "%";
        bar.style.setProperty("--w", pct[i] + "%");
        opts[i].classList.add("has-bar");
      });
      say("👥 Zal ovoz berdi. Foizlarga qarang.");
    }
  }

  // ---- the end
  function flushWords() {
    if (!G || !G.results.length || !window.L1_Words) return Promise.resolve();
    const list = G.results.splice(0);
    return window.L1_Words.report(list, "millionaire");
  }

  async function finish(kind, prize) {
    if (!G || G.over) return;
    G.over = true; game.active = false;
    sfx.stop();
    const q = G.qs, correct = G.correct, results = G.results.slice();
    const wordIds = [...new Set(results.map((r) => r.id))];
    const best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
    if (prize > best) { try { localStorage.setItem(BEST_KEY, String(prize)); } catch (e) {} }
    const word = (id) => cards().find((c) => c.id === id);
    await flushWords(); // so the word list below shows the new status of each word
    const title = kind === "win" ? "Siz millionersiz!" : kind === "cash" ? "Siz pulni oldingiz" : prize ? "Xavfsiz yutuq sizniki" : "Bu safar omad kelmadi";
    const mood = kind === "win" ? "celebrate" : "thumbsup";
    const area = $("gameMillionaireArea");
    area.innerHTML = `<div class="ml-stage ml-result">
      ${logoHtml(true)}
      <div class="ml-hostbar"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble">${title}. ${kind === "win" ? "Ajoyib! Hammasini topdingiz!" : correct >= 10 ? "Juda yaxshi natija!" : correct >= 5 ? "Yomon emas! Yana urinib ko'ring." : "Hechqisi yo'q, mashq qilsangiz bo'ladi."}</div></div>
      <div class="ml-won"><small>Yutug'ingiz</small><b>🪙 ${fmt(prize)}</b><span>${correct}/${q.length} ta to'g'ri javob</span></div>
      ${wordIds.length ? `<div class="ml-words"><b>Bu o'yindagi so'zlar</b>${wordIds.slice(0, 10).map((id) => {
        const w = word(id), st = window.L1_Words ? window.L1_Words.statusOf(id) : "new";
        const ok = results.filter((r) => r.id === id).every((r) => r.ok);
        return `<div class="ml-word ${ok ? "is-ok" : "is-bad"}"><span>${ok ? "✅" : "❌"} ${esc(w ? w.word : id)}</span><em>${esc(w ? w.meaning_uz : "")}</em><i>${esc(window.L1_Words ? window.L1_Words.LABEL[st] : "")}</i></div>`;
      }).join("")}</div>` : ""}
      <div class="ml-reward" id="mlReward">Natija saqlanmoqda…</div>
      <button type="button" class="ml-start" id="mlAgain">Qaytadan o'ynash 🔄</button>
      ${hallHtml()}
    </div>`;
    if (kit()) { kit().mountIdris("mlIdrisHost", mood === "celebrate" ? "celebrate" : "thumbsup", 84); }
    if (kind === "win") { if (L1()) L1().Fx.confetti($("mlIdrisHost"), 40); crowdMood("is-cheer", 4500); }
    else if (kind === "cash") { sfx.cash(); crowdMood("is-cheer", 2200); }
    $("mlAgain").addEventListener("click", () => game.init());
    const tries = Array(correct).fill(1);
    const r = tries.length && kit() ? await kit().reportGame("millionaire", tries) : null;
    const el = $("mlReward");
    if (el) el.textContent = tries.length ? (r ? kit().rewardText(r) : "Natija faqat shu qurilmada saqlandi.") : "Keyingi safar ball to'plang!";
  }

  window.L1_Millionaire = game;
})();
