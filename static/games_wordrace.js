/* Word Race — English questions drive a race car.
 *
 * Play alone against bots, or with up to 3 friends in a room (a 4-letter code, a link, or a Telegram invitation).
 * Right answers boost the car (quick ones boost more), wrong answers and timeouts slow it, and the first car over the
 * line wins. The race itself runs on the server (race_engine.py, WebSocket /ws/race): it keeps the clock, checks the
 * answers and moves the cars; this file draws the lobby, the track and the results. Questions are built here from the
 * student's own vocabulary memory (words.js / questions.js), so weak words come up more, and the server re-checks them.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const kit = () => window.L1_GameKit;
  const L1 = () => window.L1 || null;
  const Q = () => window.L1_Questions;
  const W = () => window.L1_Words;
  const COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e"];
  const MAX_SPEED = 75;
  const MODES = [
    { id: "sprint", icon: "🏁", name: "Lug'at sprint", desc: "So'zning ma'nosini toping" },
    { id: "grammar", icon: "🧩", name: "Grammatika", desc: "To'g'ri javobni tanlang" },
    { id: "recall", icon: "⌨️", name: "So'zni yozing", desc: "Variantsiz, o'zingiz yozasiz" },
    { id: "mixed", icon: "🎲", name: "Aralash", desc: "Hammasidan bittadan" },
  ];
  const LEVELS = [["easy", "Oson"], ["normal", "O'rta"], ["hard", "Qiyin"]];
  const medals = ["🥇", "🥈", "🥉", "4"];

  const S = {
    view: "menu",          // menu | connecting | lobby | countdown | race | end
    mode: "sprint", level: "normal", solo: false,
    ws: null, code: "", you: "", lobby: null, offset: 0, closing: false, retries: 0,
    mine: [], uploadedFor: "", startSent: false,
    q: null, answers: [], snap: null, disp: {}, startAt: 0, track: 1200, results: null, awards: null,
    raf: 0, lastFrame: 0, roadX: 0, qTimer: 0, mates: null,
  };

  const toast = (m) => { if (typeof window.showToast === "function") window.showToast(m); };
  const area = () => $("gameRaceArea");
  const serverNow = () => (Date.now() + S.offset) / 1000;
  const sync = (now) => { if (now) S.offset = now * 1000 - Date.now(); };
  const meta = (id) => (S.lobby ? S.lobby.players.find((p) => p.id === id) : null);

  // ------------------------------------------------------------------ sounds
  const snd = () => (L1() && L1().Sound) || null;
  const sfx = {
    beep(high) { const s = snd(); if (s) s.tone(high ? 880 : 520, "square", high ? 0.5 : 0.18, 0, 0.1); },
    right() { const s = snd(); if (s) { s.tone(660, "sine", 0.1, 0, 0.12); s.tone(990, "sine", 0.16, 0.07, 0.12); } },
    wrong() { const s = snd(); if (s) { s.slide(240, 90, "sawtooth", 0.3, 0, 0.12); } },
    win() { const s = snd(); if (s) [523, 659, 784, 1046, 1318].forEach((f, i) => s.tone(f, "triangle", 0.28, i * 0.12, 0.14)); },
    lose() { const s = snd(); if (s) [392, 330, 262].forEach((f, i) => s.tone(f, "triangle", 0.3, i * 0.16, 0.12)); },
  };
  const Engine = { ctx: null, osc: null, gain: null, filt: null,
    start() {
      const s = snd(); if (s && s.muted) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        this.ctx = this.ctx || new AC();
        if (this.ctx.state === "suspended") this.ctx.resume();
        this.stop();
        this.osc = this.ctx.createOscillator(); this.gain = this.ctx.createGain(); this.filt = this.ctx.createBiquadFilter();
        this.osc.type = "sawtooth"; this.osc.frequency.value = 62; this.filt.type = "lowpass"; this.filt.frequency.value = 380;
        this.gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.gain.gain.exponentialRampToValueAtTime(0.03, this.ctx.currentTime + 0.4);
        this.osc.connect(this.filt).connect(this.gain).connect(this.ctx.destination);
        this.osc.start();
      } catch (e) { /* sound is optional */ }
    },
    set(v) { if (!this.osc) return; const t = this.ctx.currentTime; this.osc.frequency.setTargetAtTime(58 + v * 2.6, t, 0.1); this.filt.frequency.setTargetAtTime(320 + v * 16, t, 0.1); },
    stop() { try { if (this.osc) { this.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1); const o = this.osc; setTimeout(() => { try { o.stop(); } catch (e) {} }, 400); } } catch (e) {} this.osc = null; },
  };

  // ------------------------------------------------------------------ questions for this race
  function buildQuestions(mode) {
    const all = Q().cards();
    const words = W() ? W().pick(all, Math.min(all.length, 90)) : Q().shuffle(all);
    const kindsMC = ["en2uz", "uz2en", "pic", "def", "cloze"];
    let wi = 0;
    const vocab = (kinds) => {
      while (wi < words.length) {
        const c = words[wi++];
        for (const k of Q().shuffle(kinds)) { const q = Q().make(c, k, all); if (q) return q; }
      }
      return null;
    };
    const gram = Q().shuffle(Q().grammarBank()).map((g) => ({ k: "gram", q: g.q, o: Q().shuffle(g.o), a: g.a, w: null, cat: "Grammatika", why: g.why }));
    const out = [];
    const want = 40;
    for (let i = 0; i < want * 2 && out.length < want; i++) {
      let q = null;
      if (mode === "grammar") q = gram.pop() || vocab(kindsMC);
      else if (mode === "recall") q = vocab(["recall"]) || vocab(kindsMC);
      else if (mode === "mixed") q = i % 4 === 3 ? vocab(["recall"]) : i % 4 === 1 && gram.length ? gram.pop() : vocab(kindsMC);
      else q = vocab(kindsMC);
      if (q) out.push(q);
      if (!q && wi >= words.length && !gram.length) break;
    }
    return out;
  }

  // ------------------------------------------------------------------ connection
  async function http(path, method, body) {
    const opts = { method: method || "GET" };
    if (body) { opts.headers = { "Content-Type": "application/json" }; opts.body = JSON.stringify(body); }
    try {
      const r = await window.l1Fetch(path, opts);
      return { ok: r.ok, data: await r.json().catch(() => null) };
    } catch (e) { return { ok: false, data: null }; }
  }

  function send(msg) { if (S.ws && S.ws.readyState === 1) S.ws.send(JSON.stringify(msg)); }

  function connect(code) {
    teardown(false);
    S.code = code; S.view = "connecting"; S.closing = false; S.startSent = false; S.uploadedFor = "";
    render();
    const url = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/race?code=${encodeURIComponent(code)}`;
    const ws = new WebSocket(url);
    S.ws = ws;
    ws.onopen = () => ws.send(JSON.stringify({ t: "auth", token: window.l1GetToken ? window.l1GetToken() : "" }));
    ws.onmessage = (ev) => { if (S.ws === ws) { try { onMessage(JSON.parse(ev.data)); } catch (e) { console.error(e); } } };
    ws.onclose = () => { if (S.ws === ws) onClose(); };
  }

  function onClose() {
    S.ws = null;
    if (S.closing) return;
    if ((S.view === "race" || S.view === "countdown") && S.retries < 3) { // try to get back into a running race
      S.retries++;
      setTimeout(() => { if (!S.closing && !S.ws && S.code) { S.reconnecting = true; connect(S.code); } }, 1000);
      return;
    }
    if (S.view !== "menu") { toast("Aloqa uzildi."); toMenu(); }
  }

  function teardown(clearCode) {
    S.closing = true;
    if (S.ws) { try { send({ t: "leave" }); S.ws.close(); } catch (e) {} }
    S.ws = null;
    cancelAnimationFrame(S.raf); S.raf = 0;
    clearInterval(S.qTimer);
    Engine.stop();
    if (clearCode) S.code = "";
  }

  function toMenu() {
    teardown(true);
    S.view = "menu"; S.lobby = null; S.snap = null; S.q = null; S.results = null; S.solo = false; S.retries = 0;
    game.active = false;
    render();
  }

  // ------------------------------------------------------------------ messages
  function onMessage(m) {
    switch (m.t) {
      case "joined":
        S.you = m.you; sync(m.now); S.retries = 0; game.active = true;
        if (S.reconnecting) { S.reconnecting = false; S.view = "race"; renderRace(); startLoop(); }   // back in a running race
        break;
      case "lobby":
        S.lobby = m; S.mode = m.mode;
        if (m.state === "lobby" && S.view !== "lobby") { S.view = "lobby"; S.results = null; S.startSent = false; S.answers = []; S.uploadedFor = ""; S.ackFails = 0; }
        if (m.state === "lobby") lobbyUpdated(m);
        if (S.view === "lobby") render();
        break;
      case "ack":
        if (!m.ready && (S.ackFails = (S.ackFails || 0) + 1) <= 2) { S.uploadedFor = ""; if (S.lobby) lobbyUpdated(S.lobby); }   // too few good questions: build them again
        break;
      case "countdown":
        sync(m.now); S.startAt = m.startAt; S.view = "countdown"; S.answers = []; S.snap = null; S.disp = {}; S.q = null;
        renderRace(); startLoop();
        break;
      case "go": S.view = "race"; Engine.start(); sfx.beep(true); break;
      case "q": S.q = m; if (S.view === "countdown" || S.view === "race") renderQuestion(); break;
      case "res": onResult(m); break;
      case "state": S.snap = m; S.track = m.track || S.track; sync(m.now); if (S.view === "countdown" && m.st === "running") S.view = "race"; break;
      case "end": onEnd(m); break;
      case "error":
        toast(m.message || "Xatolik");
        if (m.fatal) toMenu();
        break;
    }
  }

  // The lobby changed: make sure our questions are uploaded, and in a solo game start as soon as everything is ready.
  function lobbyUpdated(m) {
    const me = meta(S.you);
    if (me && (!me.ready) && S.uploadedFor !== m.mode + ":" + (S.uploadCount || 0)) {
      S.uploadCount = (S.uploadCount || 0) + 1;
      S.uploadedFor = m.mode + ":" + S.uploadCount;
      S.mine = buildQuestions(m.mode);
      send({ t: "questions", items: S.mine });
    }
    if (S.solo && m.host === S.you && m.canStart && !S.startSent) {
      S.startSent = true;
      setTimeout(() => send({ t: "start" }), 500);
    }
  }

  const myQuestion = (i) => (S.mine.length ? S.mine[i % S.mine.length] : null);

  function onResult(m) {
    const q = myQuestion(m.i);
    S.answers.push({ w: q && q.w, ok: m.ok, a: m.a, q: q && q.q });
    const lane = document.querySelector(`.wr-lane[data-id="${S.you}"]`);
    const feed = $("wrFeed");
    if (m.ok) {
      sfx.right();
      if (feed) { feed.className = "wr-feed is-good"; feed.textContent = `✓ To'g'ri!${m.streak >= 3 ? ` 🔥 ${m.streak} ta ketma-ket` : ""}`; }
    } else {
      sfx.wrong();
      if (feed) { feed.className = "wr-feed is-bad"; feed.textContent = `${m.timeout ? "⏱ Vaqt tugadi" : "✗ Xato"} — to'g'ri javob: ${m.a}`; }
    }
    if (lane) { lane.classList.remove("is-good", "is-bad"); void lane.offsetWidth; lane.classList.add(m.ok ? "is-good" : "is-bad"); }
    clearTimeout(S.feedT);
    S.feedT = setTimeout(() => { const f = $("wrFeed"); if (f) { f.className = "wr-feed"; f.textContent = "Tezroq javob bersangiz, mashina tezroq ketadi!"; } }, 2200);
  }

  async function onEnd(m) {
    Engine.stop();
    S.results = m.results; S.awards = m.awards; S.view = "end";
    cancelAnimationFrame(S.raf); S.raf = 0;
    const me = m.results.find((r) => r.id === S.you);
    if (me && me.finished && me.rank === 1) sfx.win(); else sfx.lose();
    if (W()) await W().load(true);
    render();
  }

  // ------------------------------------------------------------------ screens
  const game = {
    active: false,
    showIntro() { if (S.view !== "menu") toMenu(); else render(); },
    init() { this.showIntro(); },
    pause() {},
  };

  function render() {
    const a = area();
    if (!a) return;
    ({ menu: renderMenu, connecting: renderConnecting, lobby: renderLobby, end: renderEnd }[S.view] || (() => {}))();
  }

  function stage(html) { area().innerHTML = `<div class="wr-stage">${html}</div>`; return area().firstChild; }

  function renderMenu() {
    const c = W() ? W().counts() : { mastered: 0, review: 0, learning: 0, new: 0 };
    stage(`
      <div class="wr-title"><span style="font-size:30px">🏎️</span><div>Word Race<small>Inglizcha so'zlar poygasi</small></div></div>
      <div><div class="wr-h" style="margin-bottom:6px">1. Poyga turi</div>
        <div class="wr-modes">${MODES.map((m) => `<button type="button" class="wr-chip ${S.mode === m.id ? "is-on" : ""}" data-wr="mode" data-v="${m.id}">${m.icon} ${m.name}<small>${m.desc}</small></button>`).join("")}</div></div>
      <div><div class="wr-h" style="margin-bottom:6px">2. Botlar qanchalik kuchli?</div>
        <div class="wr-row">${LEVELS.map(([id, n]) => `<button type="button" class="wr-chip ${S.level === id ? "is-on" : ""}" data-wr="level" data-v="${id}">${n}</button>`).join("")}</div></div>
      <div class="wr-row" style="flex-direction:column">
        <button type="button" class="wr-btn is-hot" data-wr="solo">🤖 Botlar bilan o'ynash</button>
        <button type="button" class="wr-btn" data-wr="friends">👥 Do'stlar bilan o'ynash</button></div>
      <div class="wr-card"><div class="wr-h" style="margin-bottom:6px">Kod bilan qo'shilish</div>
        <div class="wr-join"><input id="wrCode" maxlength="4" placeholder="Xona kodi" autocomplete="off" inputmode="text"><button type="button" class="wr-btn is-quiet" data-wr="join">Qo'shilish</button></div></div>
      <div class="wr-note">📘 Lug'atingiz: ⭐ ${c.mastered || 0} o'zlashtirilgan · 🔁 ${c.review || 0} takrorlash kerak · 🆕 ${c.new || 0} yangi. Poyga avval xato qilgan so'zlaringizni so'raydi.</div>`);
    const input = $("wrCode");
    if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") joinFromInput(); });
  }

  function renderConnecting() { stage(`<div class="wr-title">🏎️ Ulanmoqda…</div><div class="wr-note">Xona: ${esc(S.code)}</div>`); }

  function slotHtml(p, i) {
    if (!p) return `<div class="wr-slot is-empty">Bo'sh joy</div>`;
    const initials = esc((p.name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
    const av = p.photo ? `<img src="${esc(p.photo)}" alt="">` : p.bot ? "🤖" : initials;
    return `<div class="wr-slot" style="--c:${COLORS[p.slot]}"><span class="wr-av">${av}</span><div style="min-width:0"><b>${esc(p.name)}${p.id === S.lobby.host ? " 👑" : ""}${p.id === S.you ? " (siz)" : ""}</b>
      <small class="${p.ready ? "is-ok" : ""}">${p.bot ? "Bot" : p.ready ? "Tayyor ✓" : "Tayyorlanmoqda…"}</small></div></div>`;
  }

  function renderLobby() {
    const L = S.lobby;
    if (!L) return renderConnecting();
    if (S.solo) return void stage(`<div class="wr-title">🏎️ Poyga tayyorlanmoqda…</div><div class="wr-note">Savollar tuzilmoqda va botlar yo'lga chiqmoqda.</div>`);
    const host = L.host === S.you;
    const bots = L.players.filter((p) => p.bot).length;
    const humans = L.players.length - bots;
    const slots = Array.from({ length: L.cap }, (_, i) => L.players.find((p) => p.slot === i));
    const link = `${location.origin}/?race=${L.code}`;
    stage(`
      <div class="wr-bar"><button type="button" class="wr-x" data-wr="leave" aria-label="Chiqish">✕</button><div class="wr-h">Do'stlar bilan poyga</div><span style="width:36px"></span></div>
      <div class="wr-card wr-code"><div class="wr-h">Xona kodi</div><b>${esc(L.code)}</b>
        <div class="wr-row" style="justify-content:center;margin-top:8px">
          <button type="button" class="wr-btn is-quiet" data-wr="copy" data-v="${esc(link)}" style="min-height:38px;font-size:13px">📋 Havolani nusxalash</button>
          <button type="button" class="wr-btn is-quiet" data-wr="share" data-v="${esc(link)}" style="min-height:38px;font-size:13px">✈️ Telegram</button></div></div>
      <div class="wr-slots">${slots.map(slotHtml).join("")}</div>
      ${host ? `
      <div class="wr-card" style="display:flex;flex-direction:column;gap:10px">
        <div><div class="wr-h" style="margin-bottom:6px">Poyga turi</div>
          <div class="wr-modes">${MODES.map((m) => `<button type="button" class="wr-chip ${L.mode === m.id ? "is-on" : ""}" data-wr="lobbymode" data-v="${m.id}">${m.icon} ${m.name}</button>`).join("")}</div></div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div class="wr-h">Botlar</div><div class="wr-note">Bo'sh joylarni botlar to'ldiradi</div></div>
          <span class="wr-stepper"><button type="button" data-wr="bots-" ${bots <= 0 ? "disabled" : ""}>−</button><b>${bots}</b><button type="button" data-wr="bots+" ${humans + bots >= L.cap ? "disabled" : ""}>+</button></span></div>
        ${bots ? `<div class="wr-row">${LEVELS.map(([id, n]) => `<button type="button" class="wr-chip ${L.level === id ? "is-on" : ""}" data-wr="lobbylevel" data-v="${id}">${n}</button>`).join("")}</div>` : ""}
      </div>` : `<div class="wr-note" style="text-align:center">Poyga turi: <b>${(MODES.find((m) => m.id === L.mode) || {}).name}</b>. Xona egasi boshlashini kuting.</div>`}
      <div class="wr-card"><div class="wr-h" style="margin-bottom:6px">Sinfdoshlarni chaqirish</div>
        <div id="wrMates"><button type="button" class="wr-btn is-quiet" data-wr="mates" style="min-height:40px;font-size:13px">Ro'yxatni ochish</button></div></div>
      ${host ? `<button type="button" class="wr-btn is-hot" data-wr="start" ${L.canStart ? "" : "disabled"}>${L.canStart ? "🏁 Poygani boshlash" : "Hamma tayyor bo'lishini kutamiz…"}</button>` : ""}`);
    if (S.mates) fillMates();
  }

  async function loadMates() {
    const box = $("wrMates"); if (!box) return;
    box.innerHTML = `<div class="wr-note">Yuklanmoqda…</div>`;
    const r = await http("/api/race/mates");
    S.mates = r.ok ? r.data.mates : [];
    fillMates();
  }
  function fillMates() {
    const box = $("wrMates"); if (!box) return;
    if (!S.mates.length) { box.innerHTML = `<div class="wr-note">Hozircha boshqa o'quvchilar yo'q.</div>`; return; }
    box.innerHTML = `<div class="wr-note" style="margin-bottom:4px">Telegram'dan kirganlarga bot xabar yuboradi. Boshqalarga kodni o'zingiz yuboring.</div>` + S.mates.map((m) => {
      const initials = esc(m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
      return `<div class="wr-mate"><span class="wr-av" style="--c:#475569">${m.photoUrl ? `<img src="${esc(m.photoUrl)}" alt="">` : initials}</span><span class="n">${esc(m.name)}</span>
        <button type="button" data-wr="invite" data-v="${esc(m.id)}" ${m.telegram ? "" : "disabled"}>${m.telegram ? "Chaqirish" : "Kod yuboring"}</button></div>`;
    }).join("");
  }

  // ---- the race screen
  const carSvg = (color) => `<svg viewBox="0 0 100 44" aria-hidden="true" style="--c:${color}">
    <ellipse cx="50" cy="41" rx="42" ry="3" fill="rgba(0,0,0,.35)"/>
    <path d="M5 31 L9 22 Q11 19 16 19 L33 17 L43 8 Q45 6 50 6 L68 6 Q72 6 75 10 L82 18 L93 21 Q97 22 97 26 L97 32 Q97 34 95 34 L7 34 Q5 34 5 31Z" fill="var(--c)"/>
    <path d="M46 9.5 L52 9.5 L52 17 L38 17Z M55 9.5 L67 9.5 L77 17 L55 17Z" fill="#d6ecff" opacity=".95"/>
    <path d="M9 27 L93 27" stroke="rgba(255,255,255,.55)" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="91" y="23" width="6" height="4" rx="2" fill="#fef08a"/><rect x="4" y="24" width="4" height="4" rx="2" fill="#fca5a5"/>
    <g class="wr-wheel"><circle cx="28" cy="34" r="8" fill="#111827"/><circle cx="28" cy="34" r="3.4" fill="#cbd5e1"/><path d="M28 28.5v11M22.5 34h11" stroke="#6b7280" stroke-width="1.4"/></g>
    <g class="wr-wheel"><circle cx="76" cy="34" r="8" fill="#111827"/><circle cx="76" cy="34" r="3.4" fill="#cbd5e1"/><path d="M76 28.5v11M70.5 34h11" stroke="#6b7280" stroke-width="1.4"/></g></svg>`;

  function renderRace() {
    const L = S.lobby;
    if (!L) return;
    const players = [...L.players].sort((a, b) => a.slot - b.slot);
    stage(`
      <div class="wr-bar"><button type="button" class="wr-x" data-wr="leave" aria-label="Chiqish">✕</button>
        <div class="wr-h">${(MODES.find((m) => m.id === L.mode) || {}).icon || ""} ${(MODES.find((m) => m.id === L.mode) || {}).name || "Poyga"}</div><span style="width:36px"></span></div>
      <div class="wr-track" id="wrTrack">${players.map((p) => `
        <div class="wr-lane ${p.id === S.you ? "is-me" : ""}" data-id="${esc(p.id)}" style="--c:${COLORS[p.slot]}">
          <span class="wr-name">${esc(p.name)}${p.id === S.you ? " (siz)" : ""}${p.bot ? " 🤖" : ""}</span><span class="wr-flag"></span>
          <div class="wr-car" style="--p:0">${carSvg(COLORS[p.slot])}<span class="wr-fire"></span></div></div>`).join("")}</div>
      <div class="wr-hud">
        <div class="wr-gauge"><svg viewBox="0 0 92 56"><path d="M6 50 A40 40 0 0 1 86 50" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="8" stroke-linecap="round"/>
          <path d="M6 50 A40 40 0 0 1 86 50" fill="none" stroke="url(#wrg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="126" stroke-dashoffset="126" id="wrArc"/>
          <defs><linearGradient id="wrg" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#fb923c"/></linearGradient></defs></svg>
          <div class="wr-kmh"><span id="wrKmh">0</span><small>KM/H</small></div></div>
        <div class="wr-feed" id="wrFeed">Tezroq javob bersangiz, mashina tezroq ketadi!</div>
        <div class="wr-stat"><b id="wrScore">0/0</b>to'g'ri</div></div>
      <div class="wr-qtime"><i id="wrQtime"></i></div>
      <div id="wrQarea"></div>
      <div class="wr-count" id="wrCount" hidden></div>`);
    if (S.q) renderQuestion();
  }

  function renderQuestion() {
    const host = $("wrQarea"); if (!host || !S.q) return;
    const q = S.q;
    const mine = myQuestion(q.i);
    host.innerHTML = `<div class="wr-q"><div class="wr-qtext" id="wrQtext"></div></div>` + (q.o
      ? `<div class="wr-opts" style="margin-top:10px">${q.o.map((o, i) => `<button type="button" class="wr-opt" data-wr="opt" data-i="${i}"><span class="k">${"ABCD"[i]}</span><span class="t">${esc(o)}</span></button>`).join("")}</div>`
      : `<div class="wr-typed" style="margin-top:10px"><input id="wrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Inglizcha yozing…"><button type="button" class="wr-btn" data-wr="submit">OK</button></div>`);
    const t = $("wrQtext");
    t.textContent = q.q;
    if (kit()) kit().setQuestionImage(t, q.img);
    const bar = $("wrQtime");
    if (bar) { bar.style.transition = "none"; bar.style.width = "100%"; void bar.offsetWidth; bar.style.transition = `width ${q.tl}s linear`; bar.style.width = "0%"; }
    const input = $("wrInput");
    if (input) { input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTyped(); }); setTimeout(() => input.focus(), 50); }
    S.answered = false;
  }

  function answer(text) {
    if (S.answered || !S.q || S.view !== "race") return;
    S.answered = true;
    document.querySelectorAll(".wr-opt").forEach((o) => { o.disabled = true; if (o.querySelector(".t").textContent === text) o.classList.add("is-picked"); });
    send({ t: "answer", i: S.q.i, a: text });
  }
  function submitTyped() { const i = $("wrInput"); if (i && i.value.trim()) { answer(i.value.trim()); i.disabled = true; } }

  // ---- animation: cars glide towards where the server says they are
  function startLoop() { cancelAnimationFrame(S.raf); S.lastFrame = performance.now(); S.raf = requestAnimationFrame(frame); }

  function frame(ts) {
    S.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (ts - S.lastFrame) / 1000); S.lastFrame = ts;
    const now = serverNow();
    const count = $("wrCount");
    if (S.view === "countdown" && count) {
      const left = S.startAt - now;
      count.hidden = false;
      const n = Math.ceil(left);
      const label = left > 0 ? String(n) : "GO!";
      if (count.textContent !== label) { count.textContent = label; count.classList.toggle("is-go", left <= 0); if (left > 0) sfx.beep(false); }
    } else if (count && !count.hidden) count.hidden = true;
    const snap = S.snap;
    if (!snap) return;
    const ahead = Math.min(0.4, Math.max(0, now - snap.now));
    let myV = 0, myOk = 0, myBad = 0;
    for (const p of snap.players) {
      const lane = document.querySelector(`.wr-lane[data-id="${p.id}"]`); if (!lane) continue;
      const target = Math.min(S.track, p.pos + (p.done ? 0 : p.v * ahead));
      const cur = S.disp[p.id] == null ? target : S.disp[p.id];
      S.disp[p.id] = cur + (target - cur) * Math.min(1, dt * 9);
      const car = lane.querySelector(".wr-car");
      car.style.setProperty("--p", (S.disp[p.id] / S.track).toFixed(4));
      car.style.setProperty("--spin", Math.max(0.15, p.v / 18).toFixed(2));
      car.classList.toggle("is-boost", p.v > 38 && !p.done);
      car.classList.toggle("is-done", p.done);
      lane.style.backgroundPositionX = `${-(S.roadX * (0.4 + p.v / 40)) % 40}px`;
      if (p.id === S.you) { myV = p.v; myOk = p.ok; myBad = p.bad; }
    }
    S.roadX += dt * 60;
    const arc = $("wrArc"), kmh = $("wrKmh"), sc = $("wrScore");
    if (arc) arc.setAttribute("stroke-dashoffset", (126 * (1 - Math.min(1, myV / MAX_SPEED))).toFixed(1));
    if (kmh) kmh.textContent = Math.round(myV * 3);
    if (sc) sc.textContent = `${myOk}/${myOk + myBad}`;
    Engine.set(myV);
  }

  // ---- the results
  function renderEnd() {
    const res = S.results || [];
    const me = res.find((r) => r.id === S.you);
    const award = (S.awards || {})[S.you];
    const host = S.lobby && S.lobby.host === S.you;
    const seen = new Map();
    S.answers.forEach((a) => { if (a.w) seen.set(a.w, a.ok && (seen.get(a.w) !== false)); });
    const cards = Q().cards();
    const words = [...seen.entries()].sort((a, b) => Number(a[1]) - Number(b[1])).slice(0, 8);
    const title = !me ? "Poyga tugadi" : me.finished && me.rank === 1 ? "🏆 Siz g'olibsiz!" : me.finished ? `${me.rank}-o'rin` : "Finishga yetib kelolmadingiz";
    stage(`
      <div class="wr-title"><span style="font-size:30px">${me && me.rank === 1 && me.finished ? "🏆" : "🏁"}</span><div>${title}<small>Natijalar</small></div></div>
      <div class="wr-podium">${res.map((r) => {
        const rk = medals[r.rank - 1] || r.rank;
        const initials = esc((r.name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
        return `<div class="wr-res ${r.id === S.you ? "is-me" : ""}"><span class="rk">${rk}</span><div><b>${esc(r.name)}${r.bot ? " 🤖" : ""}</b><small>✓ ${r.correct} · ✗ ${r.wrong} · aniqlik ${r.accuracy}% · eng tez ${Math.round(r.top * 3)} km/h</small></div>
          <span class="tm">${r.finished ? r.time + " s" : Math.round((r.pos / S.track) * 100) + "%"}</span></div>`;
      }).join("")}</div>
      ${award ? `<div class="wr-prize">${award.awarded ? `<b>+${award.awarded} ball</b>Reytingga qo'shildi` : award.earned ? `Bugungi o'yin balli limiti to'lgan` : `Ball olish uchun kamida 3 ta to'g'ri javob bering`}</div>` : ""}
      ${words.length ? `<div class="wr-card"><div class="wr-h" style="margin-bottom:4px">Bu poygadagi so'zlar</div>${words.map(([id, ok]) => {
        const c = cards.find((x) => x.id === id), st = W() ? W().statusOf(id) : "new";
        return `<div class="wr-word ${ok ? "" : "is-bad"}"><span>${ok ? "✅" : "❌"} <b>${esc(c ? c.word : id)}</b></span><em>${esc(c ? c.meaning_uz : "")}</em><i>${esc(W() ? W().LABEL[st] : "")}</i></div>`;
      }).join("")}</div>` : ""}
      <div class="wr-row" style="flex-direction:column">
        ${host ? `<button type="button" class="wr-btn is-hot" data-wr="rematch">🔄 Yana poyga</button>` : `<div class="wr-note" style="text-align:center">Xona egasi yangi poyga boshlashi mumkin.</div>`}
        <button type="button" class="wr-btn is-quiet" data-wr="leave">Chiqish</button></div>`);
  }

  // ------------------------------------------------------------------ actions
  async function start(solo) {
    if (!window.l1GetToken || !window.l1GetToken()) { toast("Avval tizimga kiring."); return; }
    if (W()) W().load();
    S.solo = solo; S.view = "connecting"; S.retries = 0; render();
    const r = await http("/api/race/create", "POST", { mode: S.mode, level: S.level });
    if (!r.ok) { toast((r.data && r.data.message) || "Xona ochilmadi."); S.view = "menu"; render(); return; }
    connect(r.data.code);
    const timer = setInterval(() => { // once connected: ask for the bots
      if (S.you) { clearInterval(timer); if (solo) send({ t: "bots", n: 3, level: S.level }); }
      else if (!S.ws && S.view === "menu") clearInterval(timer);
    }, 120);
  }

  function joinFromInput() {
    const v = ($("wrCode") ? $("wrCode").value : "").trim().toUpperCase();
    if (v.length !== 4) { toast("Kod 4 ta belgidan iborat."); return; }
    joinCode(v);
  }
  function joinCode(code) { S.solo = false; if (W()) W().load(); connect(code); }

  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-wr]");
    const a = area();
    if (!b || !a || !a.contains(b)) return;
    const act = b.dataset.wr, v = b.dataset.v;
    const l = L1(); if (l && l.Haptic) l.Haptic.tap();
    if (act === "mode") { S.mode = v; return render(); }
    if (act === "level") { S.level = v; return render(); }
    if (act === "solo") return start(true);
    if (act === "friends") return start(false);
    if (act === "join") return joinFromInput();
    if (act === "leave") return toMenu();
    if (act === "lobbymode") return send({ t: "mode", mode: v });
    if (act === "lobbylevel") return send({ t: "bots", n: S.lobby.players.filter((p) => p.bot).length, level: v });
    if (act === "bots+" || act === "bots-") { const n = S.lobby.players.filter((p) => p.bot).length + (act === "bots+" ? 1 : -1); return send({ t: "bots", n: Math.max(0, n), level: S.lobby.level }); }
    if (act === "start") return send({ t: "start" });
    if (act === "rematch") return send({ t: "rematch" });
    if (act === "opt") return answer(S.q && S.q.o ? S.q.o[+b.dataset.i] : "");
    if (act === "submit") return submitTyped();
    if (act === "mates") return loadMates();
    if (act === "copy") { try { navigator.clipboard.writeText(v); toast("Havola nusxalandi."); } catch (e) { toast(v); } return; }
    if (act === "share") {
      const text = `Word Race poygasiga qo'shiling! Xona kodi: ${S.code}`;
      if (navigator.share) navigator.share({ title: "Word Race", text, url: v }).catch(() => {});
      else window.open(`https://t.me/share/url?url=${encodeURIComponent(v)}&text=${encodeURIComponent(text)}`, "_blank");
      return;
    }
    if (act === "invite") {
      b.disabled = true;
      return void http("/api/race/invite", "POST", { code: S.code, ids: [v] }).then((r) => { b.textContent = r.ok && r.data.sent ? "Yuborildi ✓" : "Yuborilmadi"; });
    }
  });

  // keyboard: A-D / 1-4 pick an option
  document.addEventListener("keydown", (e) => {
    if (S.view !== "race" || !S.q || !S.q.o || e.target.tagName === "INPUT") return;
    const i = "abcd".indexOf(e.key.toLowerCase()), j = "1234".indexOf(e.key);
    const k = i >= 0 ? i : j;
    if (k >= 0 && S.q.o[k] !== undefined) answer(S.q.o[k]);
  });

  // An invitation link (?race=CODE), or a Telegram invitation button, takes the student straight into the room.
  let boot = 0;
  const bootTimer = setInterval(() => {
    if (++boot > 80) return clearInterval(bootTimer);
    if (!window.l1GetToken || !window.l1GetToken() || !window.L1_Nav || !area()) return;
    clearInterval(bootTimer);
    let code = "";
    try { code = (new URLSearchParams(location.search).get("race") || "").toUpperCase(); } catch (e) {}
    if (/^[A-Z0-9]{4}$/.test(code)) {
      try { history.replaceState(null, "", location.pathname); } catch (e) {}
      window.L1_Nav.setMode("games");
      window.L1_Nav.setGameSub("race");
      joinCode(code);
    }
  }, 700);

  window.L1_WordRace = game;
})();
