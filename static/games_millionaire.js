/* "Millioner" — Who wants to be a millionaire, in English.
 *
 * 15 questions that get harder, a prize ladder in game coins (not real money), safe levels after question 5 and 10, and
 * three helps: 50:50, "Idris ustoz" (phone a friend) and "Zal" (ask the audience). The words come from the student's own
 * vocabulary memory (static/words.js): words they miss or have not seen are asked first, learned words only now and then,
 * and every answer is reported back. The grammar questions are in static/millionaire_data.js.
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

  // ------------------------------------------------------------------ sounds
  const snd = () => (L1() && L1().Sound) || null;
  const sfx = {
    start() { const s = snd(); if (s) [392, 523, 659, 784].forEach((f, i) => s.tone(f, "triangle", 0.28, i * 0.12, 0.13)); },
    lock() { const s = snd(); if (s) { s.tone(70, "sine", 0.22, 0, 0.3); s.tone(70, "sine", 0.22, 0.5, 0.3); s.tone(70, "sine", 0.22, 1.0, 0.3); } },
    right() { const s = snd(); if (s) { s.tone(523, "sine", 0.18, 0, 0.14); s.tone(659, "sine", 0.18, 0.12, 0.14); s.tone(784, "sine", 0.4, 0.24, 0.15); } },
    wrong() { const s = snd(); if (s) { s.slide(220, 70, "sawtooth", 0.7, 0, 0.14); s.noise(0.3, 0, 0.08, "lowpass", 400, 100); } },
    help() { const s = snd(); if (s) { s.tone(880, "sine", 0.12, 0, 0.1); s.tone(1175, "sine", 0.2, 0.1, 0.1); } },
    win() { const s = snd(); if (s) [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => s.tone(f, "triangle", 0.3, i * 0.14, 0.14)); },
  };
  const haptic = (k) => { const h = kit(); if (h) h.haptic(k); };

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
      this.active = false; G = null;
      const area = $("gameMillionaireArea");
      if (!area) return;
      const c = window.L1_Words ? window.L1_Words.counts() : { mastered: 0, review: 0, learning: 0, new: 0 };
      const best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
      area.innerHTML = `<div class="ml-stage ml-intro">
        <div class="ml-logo"><span>💎</span>Kim millioner bo'lishni xohlaydi?</div>
        <div class="ml-host"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble">15 ta savol, 3 ta yordam. Qani, millioner bo'lamizmi? 😄</div></div>
        <ul class="ml-rules">
          <li>🪙 Har bir to'g'ri javob o'yin tangalarini oshiradi (haqiqiy pul emas).</li>
          <li>◆ 5- va 10-savoldan keyin tangalar xavfsiz: xato qilsangiz ham olib qolasiz.</li>
          <li>🆘 Yordamlar: 50:50, Idris ustoz va Zal. Har biri bir marta.</li>
          <li>💰 Istalgan paytda "Pulni olish" bilan to'xtab, yutganingizni olishingiz mumkin.</li>
        </ul>
        <div class="ml-memory">
          <b>Sizning lug'atingiz</b>
          <span class="is-ok">⭐ ${c.mastered || 0} o'zlashtirilgan</span>
          <span class="is-warn">🔁 ${c.review || 0} takrorlash kerak</span>
          <span>📘 ${c.learning || 0} o'rganilmoqda</span>
          <span>🆕 ${c.new || 0} yangi</span>
          <small>O'yin avval siz xato qilgan va hali ko'rmagan so'zlarni so'raydi.</small>
        </div>
        ${best ? `<div class="ml-best">Eng yaxshi natijangiz: 🪙 ${fmt(best)}</div>` : ""}
        <button type="button" class="ml-start" id="mlStart">▶ O'yinni boshlash</button>
      </div>`;
      if (kit()) { kit().mountIdris("mlIdrisHost", "wave", 64); }
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
      G = { qs, i: 0, locked: false, used: { fifty: false, phone: false, crowd: false }, helped: false, results: [], correct: 0, over: false };
      this.active = true;
      buildStage();
      sfx.start(); haptic("ok");
      renderQuestion();
      const area = $("gameMillionaireArea");
      if (kit() && area) kit().focusGame("gameMillionaireArea");
    },

    pause() { /* nothing ticks in this game; answers are reported when it ends or is left */ },
  };

  // The stage is built once per game; renderQuestion() only swaps what changes.
  function buildStage() {
    const area = $("gameMillionaireArea");
    area.innerHTML = `<div class="ml-stage" id="mlStage">
      <div class="ml-top">
        <div class="ml-prize"><small>Hozirgi yutuq</small><b id="mlPrize">🪙 0</b></div>
        <div class="ml-qno" id="mlQno">Savol 1/15</div>
        <button type="button" class="ml-cash" data-ml="cash" id="mlCash">💰 Pulni olish</button>
      </div>
      <div class="ml-ladder" id="mlLadder">${LADDER.map((v, i) => `<i data-i="${i}" class="${SAFE.includes(i) ? "is-safe" : ""}" title="${i + 1}-savol: ${fmt(v)}"></i>`).join("")}</div>
      <div class="ml-host"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble"></div></div>
      <div class="ml-help">
        <button type="button" data-ml="fifty" id="mlFifty"><b>50:50</b><span>Ikkitasini olib tashlash</span></button>
        <button type="button" data-ml="phone" id="mlPhone"><b>📞</b><span>Idris ustoz</span></button>
        <button type="button" data-ml="crowd" id="mlCrowd"><b>👥</b><span>Zal</span></button>
      </div>
      <div class="ml-qcard" id="mlQcard"><div class="ml-cat" id="mlCat"></div><div class="ml-qtext" id="mlQtext"></div></div>
      <div class="ml-opts" id="mlOpts"></div>
      <div class="ml-feedback" id="mlFeedback" hidden></div>
    </div>`;
    if (kit()) kit().mountIdris("mlIdrisHost", "pointing", 64);
    area.querySelector("#mlStage").addEventListener("click", onClick);
  }

  function say(text, kind) { if (kit()) kit().say("mlBubble", text, kind); }
  function react(pose, mood) { if (kit()) kit().idrisReact("mlIdrisHost", pose, mood); }

  function renderQuestion() {
    const q = G.qs[G.i];
    G.locked = false; G.helped = false; G.picked = -1;
    $("mlPrize").textContent = "🪙 " + fmt(G.i ? LADDER[G.i - 1] : 0);
    $("mlQno").textContent = `Savol ${G.i + 1}/${G.qs.length}  ·  🪙 ${fmt(LADDER[G.i])}`;
    $("mlCash").hidden = G.i === 0;
    $("mlCash").disabled = false;
    $("mlLadder").querySelectorAll("i").forEach((el) => {
      const n = +el.dataset.i;
      el.className = (SAFE.includes(n) ? "is-safe " : "") + (n < G.i ? "is-done" : n === G.i ? "is-now" : "");
    });
    $("mlCat").textContent = `${q.cat} · ${tierOf(G.i) === 1 ? "oson" : tierOf(G.i) === 2 ? "o'rta" : "qiyin"}`;
    const t = $("mlQtext");
    t.textContent = q.q;
    if (kit()) kit().setQuestionImage(t, q.img);
    $("mlOpts").innerHTML = q.o.map((o, i) => `<button type="button" class="ml-opt" data-ml="opt" data-i="${i}"><span class="ml-letter">${LETTERS[i]}</span><span class="ml-text">${esc(o)}</span><span class="ml-bar"></span></button>`).join("");
    ["fifty", "phone", "crowd"].forEach((k) => { const b = $("ml" + k[0].toUpperCase() + k.slice(1)); if (b) b.disabled = G.used[k]; });
    const f = $("mlFeedback"); f.hidden = true; f.innerHTML = "";
    react("pointing", null);
    say(G.i === 0 ? "Birinchi savol! Tinch, shoshmang." : G.i === 5 ? "Tabriklayman! 1 000 tanga endi xavfsiz ◆" : G.i === 10 ? "32 000 tanga xavfsiz ◆ Endi qiyinroqlari!" : "Javobni o'ylab tanlang.");
  }

  function onClick(ev) {
    const b = ev.target.closest("[data-ml]");
    if (!b || !G || G.over) return;
    const act = b.dataset.ml;
    if (act === "opt") return choose(+b.dataset.i);
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

  function choose(i) {
    const q = G.qs[G.i];
    if (G.locked || q.o[i] === undefined) return;
    const btn = $("mlOpts").children[i];
    if (!btn || btn.classList.contains("is-out")) return;
    G.locked = true; G.picked = i;
    btn.classList.add("is-locked");
    $("mlOpts").querySelectorAll(".ml-opt").forEach((o) => (o.disabled = true));
    ["mlFifty", "mlPhone", "mlCrowd", "mlCash"].forEach((id) => { const e = $(id); if (e) e.disabled = true; });
    react("pointing", null);
    say("Javobingiz qulflandi… 🔒");
    sfx.lock();
    setTimeout(() => reveal(i), 1700);
  }

  function reveal(i) {
    if (!G || G.over) return;
    const q = G.qs[G.i];
    const right = q.o.indexOf(q.a);
    const opts = $("mlOpts").children;
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
      sfx.right(); haptic("ok");
      react("thumbsup", "happy");
      if (L1()) L1().Fx.confetti(opts[right], 14);
      const last = G.i === G.qs.length - 1;
      say(last ? "BARAKALLA! Siz millionersiz! 🎉" : `To'g'ri! 🪙 ${fmt(LADDER[G.i])} sizniki${SAFE.includes(G.i) ? " — endi xavfsiz ◆" : ""}`, "good");
      $("mlPrize").textContent = "🪙 " + fmt(LADDER[G.i]);
      fb.innerHTML = `${why}<button type="button" class="ml-next" data-ml="${last ? "end" : "next"}">${last ? "🏆 Natijani ko'rish" : "Keyingi savol ▶"}</button>`;
      if (last) { G.endKind = "win"; G.endPrize = LADDER[LADDER.length - 1]; sfx.win(); }
    } else {
      sfx.wrong(); haptic("err");
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

  // ---- the three helps
  function useHelp(kind) {
    if (G.locked || G.used[kind]) return;
    const q = G.qs[G.i];
    const right = q.o.indexOf(q.a);
    const opts = [...$("mlOpts").children];
    const live = opts.map((_, i) => i).filter((i) => !opts[i].classList.contains("is-out"));
    G.used[kind] = true; G.helped = true;
    const btn = $("ml" + kind[0].toUpperCase() + kind.slice(1));
    if (btn) btn.disabled = true;
    sfx.help();
    const tier = tierOf(G.i);
    if (kind === "fifty") {
      const wrong = shuffle(live.filter((i) => i !== right)).slice(0, 2);
      wrong.forEach((i) => { opts[i].classList.add("is-out"); opts[i].disabled = true; });
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
        bar.textContent = pct[i] + "%";
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
    const q = G.qs, correct = G.correct, results = G.results.slice();
    const wordIds = [...new Set(results.map((r) => r.id))];
    const best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
    if (prize > best) { try { localStorage.setItem(BEST_KEY, String(prize)); } catch (e) {} }
    const word = (id) => cards().find((c) => c.id === id);
    await flushWords(); // so the word list below shows the new status of each word
    const title = kind === "win" ? "🎉 Siz millionersiz!" : kind === "cash" ? "💰 Siz pulni oldingiz" : prize ? "Xavfsiz yutuq sizniki" : "Bu safar omad kelmadi";
    const mood = kind === "win" ? "celebrate" : "thumbsup";
    const area = $("gameMillionaireArea");
    area.innerHTML = `<div class="ml-stage ml-result">
      <div class="ml-logo"><span>💎</span>${title}</div>
      <div class="ml-host"><div id="mlIdrisHost"></div><div id="mlBubble" class="idris-bubble">${kind === "win" ? "Ajoyib! Hammasini topdingiz!" : correct >= 10 ? "Juda yaxshi natija!" : correct >= 5 ? "Yomon emas! Yana urinib ko'ring." : "Hechqisi yo'q, mashq qilsangiz bo'ladi."}</div></div>
      <div class="ml-won"><small>Yutug'ingiz</small><b>🪙 ${fmt(prize)}</b><span>${correct}/${q.length} ta to'g'ri javob</span></div>
      ${wordIds.length ? `<div class="ml-words"><b>Bu o'yindagi so'zlar</b>${wordIds.slice(0, 10).map((id) => {
        const w = word(id), st = window.L1_Words ? window.L1_Words.statusOf(id) : "new";
        const ok = results.filter((r) => r.id === id).every((r) => r.ok);
        return `<div class="ml-word ${ok ? "is-ok" : "is-bad"}"><span>${ok ? "✅" : "❌"} ${esc(w ? w.word : id)}</span><em>${esc(w ? w.meaning_uz : "")}</em><i>${esc(window.L1_Words ? window.L1_Words.LABEL[st] : "")}</i></div>`;
      }).join("")}</div>` : ""}
      <div class="ml-reward" id="mlReward">Natija saqlanmoqda…</div>
      <button type="button" class="ml-start" id="mlAgain">Qaytadan o'ynash 🔄</button>
    </div>`;
    if (kit()) { kit().mountIdris("mlIdrisHost", mood === "celebrate" ? "celebrate" : "thumbsup", 64); }
    if (kind === "win") { sfx.win(); if (L1()) L1().Fx.confetti($("mlIdrisHost"), 40); }
    $("mlAgain").addEventListener("click", () => game.init());
    const tries = Array(correct).fill(1);
    const r = tries.length && kit() ? await kit().reportGame("millionaire", tries) : null;
    const el = $("mlReward");
    if (el) el.textContent = tries.length ? (r ? kit().rewardText(r) : "Natija faqat shu qurilmada saqlandi.") : "Keyingi safar ball to'plang!";
  }

  window.L1_Millionaire = game;
})();
