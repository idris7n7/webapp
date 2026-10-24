/* The full-page screens around a Pomodoro (the timer itself lives in focus.js):
 *
 *   intro     Shakespeare with the sapling: "25 daqiqani tamomlab..." and Boshlash, which starts the 25 minutes
 *   done      the 25 minutes are over: Shakespeare planting, "Daraxt ekish" opens the map (static/green_map.js)
 *   rest      after the tree is planted: 5 minute break with Shakespeare's invitation to stretch
 *   exercise  five stretches, 45 s of work and 15 s of rest each (5 minutes), Shakespeare shows every one
 *
 * When the break is over the intro comes back, so the next 25 minutes start in the same way.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L1 = () => window.L1 || null;
  const pad2 = (n) => String(n).padStart(2, "0");
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; };
  const IMG = (n) => `/static/shakespeare/pomo/${n}.webp?v=1`;
  const KEY = "l1_pl_flow";
  const REST_MS = 5 * 60000, WORK_S = 45, BREAK_S = 15, STEP_S = WORK_S + BREAK_S;

  const NOTE = "Har bir mashqni 45 soniya bajaring, so‘ng 15 soniya dam oling. Harakatlarni sekin, zo‘riqmasdan bajaring. Og‘riq yoki bosh aylanishi bo‘lsa, to‘xtang.";
  const STEPS = [
    { img: "march", name: "Joyida yurish", text: "Tik turing. Oyoqlaringizni navbat bilan yerdan ko‘tarib, joyingizda yuring. Tizzalarni juda baland ko‘tarmang. Qo‘llaringizni yurishga mos ravishda yengil silkiting." },
    { img: "shoulders", name: "Yelkalarni aylantirish", text: "Tik turing va qo‘llaringizni yoningizga tushiring. Yelkalaringizni sekin 5 marta orqaga, so‘ng 5 marta oldinga aylantiring. Yelkalarni bo‘shashtirib, takrorlang." },
    { img: "side", name: "Yon tomonga egilish", text: "Oyoqlaringizni son kengligida ochib turing. O‘ng qo‘lingizni o‘ng oyog‘ingiz bo‘ylab pastga sirg‘antirib, gavdangizni sekin o‘ngga eging. Tik holatga qayting va chap tomonda takrorlang. Oldinga egilmang." },
    { img: "twist", name: "O‘tirgan holda gavdani burish", text: "Stulda tik o‘tiring, ikkala oyoq kaftingizni yerga qo‘ying. Qo‘llaringizni ko‘krak ustida chalishtirib, kaftlaringizni qarama-qarshi yelkalarga qo‘ying. Gavdangizning yuqori qismini sekin chapga burib, 5 soniya ushlang. Markazga qayting va o‘ng tomonda takrorlang. Son va tizzalaringiz oldinga qarab tursin." },
    { img: "wrists", name: "Barmoqlar va bilaklarni harakatlantirish", text: "Qo‘llaringizni oldinga uzating, tirsaklaringizni biroz buking. Barmoqlaringizni yengil musht qiling, so‘ng ochib, yoying. Keyin bilaklaringizni sekin yuqoriga va pastga buking. Harakatlar orasida qo‘llaringizni bo‘shashtiring." },
  ];

  const F = { phase: "", restEnd: 0, exStart: 0, lastBeep: "", tick: 0, awarded: 0, fromPlant: false };
  let root = null;

  const snd = () => (L1() && L1().Sound) || null;
  const haptic = (k) => { const l = L1(); if (l && l.Haptic && l.Haptic[k]) l.Haptic[k](); };
  const beep = (hi) => { const s = snd(); if (s) s.tone(hi ? 880 : 520, "sine", 0.18, 0, 0.12); };
  function bell() { // the "your 25 minutes are over" sound: three rising bells, twice
    const s = snd(); if (!s) return;
    [0, 1.1].forEach((d) => [784, 988, 1175, 1568].forEach((f, i) => s.tone(f, "sine", 0.5, d + i * 0.2, 0.15)));
  }
  const save = () => { try { if (F.phase === "rest" || F.phase === "exercise") localStorage.setItem(KEY, JSON.stringify({ phase: F.phase, restEnd: F.restEnd, exStart: F.exStart })); else localStorage.removeItem(KEY); } catch (e) {} };

  function ensureRoot() {
    if (root) return root;
    root = document.createElement("div");
    root.id = "plFlow";
    root.className = "pl-root";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.addEventListener("click", onClick);
    document.body.appendChild(root);
    return root;
  }

  function show(phase) {
    ensureRoot();
    F.phase = phase; save();
    root.hidden = false; root.dataset.phase = phase;
    document.body.classList.add("pl-open");
    paint();
    if (!F.tick) F.tick = setInterval(tick, 250);
  }
  function hide() {
    F.phase = ""; save();
    if (root) { root.hidden = true; root.innerHTML = ""; }
    document.body.classList.remove("pl-open");
    clearInterval(F.tick); F.tick = 0;
  }

  const bubble = (html) => `<div class="pl-bubble"><span class="pl-who">Shakespeare</span>${html}</div>`;
  const ring = (id, frac) => {
    const R = 54, C = 2 * Math.PI * R;
    return `<svg class="pl-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${R}" class="pl-ring-track"/>
      <circle cx="60" cy="60" r="${R}" class="pl-ring-bar" id="${id}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - frac)).toFixed(1)}" transform="rotate(-90 60 60)"/></svg>`;
  };

  function stepAt(elapsedS) { // which stretch we are in, and whether it is work or rest
    const total = STEPS.length * STEP_S;
    const e = Math.min(total, Math.max(0, elapsedS));
    const i = Math.min(STEPS.length - 1, Math.floor(e / STEP_S));
    const into = e - i * STEP_S;
    return { i, work: into < WORK_S, left: into < WORK_S ? WORK_S - into : STEP_S - into, done: e >= total };
  }

  function paint() {
    if (!root || root.hidden) return;
    let h = "";
    if (F.phase === "intro") {
      h = `<button type="button" class="pl-x" data-pl="close" aria-label="Yopish">✕</button>
        <div class="pl-card"><img class="pl-hero" src="${IMG("prepare")}" alt="Shakespeare ko'chat bilan">
          ${bubble(`<h2>25 daqiqani tamomlab, ko'chatni shahringiz bo'ylab eking.</h2>`)}
          <button type="button" class="pl-btn" data-pl="begin">🍅 Boshlash</button></div>`;
    } else if (F.phase === "done") {
      h = `<div class="pl-card is-done"><img class="pl-hero" src="${IMG("plant")}" alt="Shakespeare daraxt ekmoqda"><span class="pl-spark s1">✦</span><span class="pl-spark s2">✦</span><span class="pl-spark s3">✦</span>
          ${bubble(`<h2>Ajoyib! Siz 25 daqiqani tugatdingiz.</h2><p>Endi daraxtingizni o'z shahringizda ekishingiz mumkin.${F.awarded ? ` <b class="pl-pts">+${F.awarded} ball</b>` : ""}</p>`)}
          <button type="button" class="pl-btn is-green" data-pl="plant">🌱 Daraxt ekish</button>
          <button type="button" class="pl-link" data-pl="later">Keyinroq</button></div>`;
    } else if (F.phase === "rest") {
      h = `<div class="pl-card"><img class="pl-hero" src="${IMG("wrists")}" alt="Shakespeare">
          <div class="pl-clock"><span class="pl-clock-label">Dam olish</span><b id="plRest">${mmss(F.restEnd - Date.now())}</b></div>
          ${bubble(`<h2>Qoyil! Yorvordingiz!</h2><p>Endi bir turingchi, cho'zilish mashqlarini qilib qo'yaylik. Tanamiz zanglab ketmasin.</p>`)}
          <p class="pl-note">${esc(NOTE)}</p>
          <button type="button" class="pl-btn is-green" data-pl="exercise">🤸 Mashqni boshlash</button>
          <button type="button" class="pl-link" data-pl="skip">Mashqsiz davom etish</button></div>`;
    } else if (F.phase === "exercise") {
      const st = stepAt((Date.now() - F.exStart) / 1000), s = STEPS[st.i], nxt = STEPS[st.i + 1];
      h = `<div class="pl-card is-ex">
          <div class="pl-ex-top"><span class="pl-ex-count">${st.i + 1} / ${STEPS.length}</span><span class="pl-ex-total">Jami: <b id="plExTotal">${mmss(F.exStart + REST_MS - Date.now())}</b></span></div>
          <div class="pl-ex-stage ${st.work ? "is-work" : "is-break"}" id="plExStage">
            <img class="pl-ex-img" id="plExImg" src="${IMG(st.work || !nxt ? s.img : nxt.img)}" alt="${esc(s.name)}">
            <div class="pl-ex-ring">${ring("plExRing", 0)}<span class="pl-ex-sec" id="plExSec">${st.left}</span></div></div>
          <div class="pl-ex-state" id="plExState">${st.work ? "Bajaring" : nxt ? "Dam oling. Keyingisi: " + esc(nxt.name) : "Dam oling"}</div>
          <h2 class="pl-ex-name" id="plExName">${esc(st.work || !nxt ? s.name : nxt.name)}</h2>
          <p class="pl-ex-text" id="plExText">${esc(st.work || !nxt ? s.text : nxt.text)}</p>
          <div class="pl-ex-actions"><button type="button" class="pl-btn is-quiet" data-pl="next">Keyingisi ›</button>
            <button type="button" class="pl-link" data-pl="stop">To'xtatish</button></div></div>`;
      F.lastBeep = `${st.i}:${st.work ? "w" : "b"}`;
    }
    root.innerHTML = h;
  }

  function tick() {
    if (F.phase === "rest") {
      const left = F.restEnd - Date.now();
      const el = $("plRest"); if (el) el.textContent = mmss(left);
      if (left <= 0) { bell(); finishBreak(); }
    } else if (F.phase === "exercise") {
      const elapsed = (Date.now() - F.exStart) / 1000;
      const st = stepAt(elapsed);
      if (st.done) { bell(); haptic("ok"); return finishBreak(); }
      const key = `${st.i}:${st.work ? "w" : "b"}`;
      if (key !== F.lastBeep) { F.lastBeep = key; beep(st.work); haptic("tap"); return paint(); }
      const into = elapsed - st.i * STEP_S;
      const frac = st.work ? into / WORK_S : (into - WORK_S) / BREAK_S;
      const sec = $("plExSec"); if (sec) sec.textContent = Math.max(0, Math.ceil(st.left));
      const bar = $("plExRing"); if (bar) bar.setAttribute("stroke-dashoffset", (2 * Math.PI * 54 * (1 - Math.min(1, Math.max(0, frac)))).toFixed(1));
      const tot = $("plExTotal"); if (tot) tot.textContent = mmss(F.exStart + REST_MS - Date.now());
    }
  }

  function finishBreak() { hide(); intro(); }

  async function begin() {
    if (!window.L1_Focus || !window.L1_Focus.begin) return;
    const ok = await window.L1_Focus.begin();
    if (ok) hide();
  }

  function onClick(ev) {
    const b = ev.target.closest("[data-pl]");
    if (!b) return;
    const act = b.dataset.pl;
    if (act !== "close") haptic("tap");
    if (act === "close" || act === "later") return hide();
    if (act === "begin") return begin();
    if (act === "plant") { hide(); if (window.L1_Green) window.L1_Green.open({ plant: true, flow: true }); return; }
    if (act === "exercise") { F.exStart = Date.now(); F.restEnd = F.exStart + REST_MS; beep(true); return show("exercise"); }
    if (act === "skip") return finishBreak();
    if (act === "stop") return finishBreak();
    if (act === "next") { const st = stepAt((Date.now() - F.exStart) / 1000); F.exStart = Date.now() - (st.i + 1) * STEP_S * 1000; save(); return tick(); }
  }

  // ------------------------------------------------------------------ public
  function intro() {
    if (window.L1_Focus && window.L1_Focus.summary().status !== "idle") return window.L1_Focus.sheet();
    show("intro");
  }
  function done(info) { F.awarded = (info && info.awarded) || 0; bell(); show("done"); }
  function rest() { F.restEnd = Date.now() + REST_MS; show("rest"); }

  window.L1_Flow = { intro, done, rest, active: () => !!F.phase };

  // a break that was running when the page was closed or reloaded
  setTimeout(() => {
    let v = null;
    try { v = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (!v || !(window.l1GetToken && window.l1GetToken())) return;
    if (v.phase === "rest" && v.restEnd > Date.now()) { F.restEnd = v.restEnd; show("rest"); }
    else if (v.phase === "exercise" && v.exStart + REST_MS > Date.now()) { F.exStart = v.exStart; F.restEnd = v.exStart + REST_MS; show("exercise"); }
    else try { localStorage.removeItem(KEY); } catch (e) {}
  }, 2500);
})();
