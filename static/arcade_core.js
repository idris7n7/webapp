/* Arcade core (window.L1_Arcade): the Games page, the full-screen game layer, pictures, sounds, the result outbox and the
 * shared Word Coin Dictionary with its spaced-repetition review.
 *
 * Games (game_wordrun.js, game_penalty.js, game_ninja.js, game_river.js) register themselves with L1_Arcade.register().
 * Their content is arcade_data.js, their pictures static/arcade/ (frames in arcade/sprites.js).
 *
 * Results are never lost or paid twice: a session id is made here, every server write goes through an outbox kept in
 * localStorage and sent in order (start -> finish -> saves), retried with the same ids until the server answers. The
 * server grades the answers and pays; a repeated report or save returns the first receipt.
 */
(function (window, document) {
  "use strict";
  const esc = (v) => (window.esc ? window.esc(v) : String(v == null ? "" : v));
  const L1 = () => window.L1 || null;
  const DATA = () => window.ARCADE_DATA || { vocab: [], grammar: [], river: [] };
  const ASSET_V = 1; // bump when a picture in static/arcade/ changes (pictures are cached for a long time)
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ------------------------------------------------------------------ student, keys, level
  const student = () => (typeof state !== "undefined" && state.authStudent) || null;
  const key = (name) => `l1_arcade_${name}_${(student() && student().id) || "guest"}`;
  const store = {
    get(name, fallback) { try { const v = localStorage.getItem(key(name)); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(name, value) { try { localStorage.setItem(key(name), JSON.stringify(value)); } catch (e) { /* private mode */ } },
    del(name) { try { localStorage.removeItem(key(name)); } catch (e) { /* private mode */ } },
  };
  const LEVELS = [{ id: "A1", name: "A1" }, { id: "A2", name: "A2" }, { id: "B1", name: "B1+" }];
  function studentLevel() {
    const l = String((student() && student().level) || "A1").toUpperCase();
    return l.startsWith("A1") ? "A1" : l.startsWith("A2") ? "A2" : "B1";
  }
  const level = () => { const l = store.get("level", null); return LEVELS.some((x) => x.id === l) ? l : studentLevel(); };
  const levelName = (id) => (LEVELS.find((x) => x.id === id) || LEVELS[0]).name;

  // ------------------------------------------------------------------ content
  let index = null;
  function idx() {
    if (!index || index.src !== DATA()) {
      const d = DATA();
      index = { src: d, vocab: {}, grammar: {} };
      d.vocab.forEach((w) => { index.vocab[w.id] = w; });
      d.grammar.forEach((g) => { index.grammar[g.id] = g; });
    }
    return index;
  }
  const word = (id) => idx().vocab[id] || null;
  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const LOWER = { A1: ["A1"], A2: ["A1", "A2"], B1: ["A2", "B1"] };
  // Words for a level: its own words, or (wide) the level below too, which gives Word Run more coins to show.
  const vocabFor = (lvl, wide) => DATA().vocab.filter((w) => (wide ? LOWER[lvl] : [lvl]).includes(w.lvl));
  // Grammar questions for a level, the ones asked lately last, so a student meets every question before repeats.
  function grammarFor(lvl, n) {
    const recent = store.get("recent_q", []);
    const pool = shuffle(DATA().grammar.filter((g) => g.lvl === lvl));
    pool.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
    return pool.slice(0, n);
  }
  function askedQuestion(id) {
    const recent = store.get("recent_q", []).filter((x) => x !== id);
    recent.push(id);
    store.set("recent_q", recent.slice(-60));
  }
  // "She ___ a teacher." + "is" -> the full sentence, with the answer marked for the explanation cards.
  const filled = (g, mark) => esc(g.q).replace("___", mark ? `<b>${esc(g.o[g.a])}</b>` : esc(g.o[g.a]));

  // ------------------------------------------------------------------ pictures
  const asset = (path) => `/static/arcade/${path}?v=${ASSET_V}`;
  const images = {};
  function loadImage(path) {
    if (images[path] && images[path].ok) return Promise.resolve(images[path].img);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      const timer = setTimeout(() => reject(new Error(path)), 25000);
      img.onload = () => { clearTimeout(timer); images[path] = { img, ok: true }; resolve(img); };
      img.onerror = () => { clearTimeout(timer); reject(new Error(path)); };
      img.src = asset(path);
    });
  }
  // All the pictures a game needs; onProgress(0..1). Rejects when one cannot be loaded (the game then offers "retry").
  function load(paths, onProgress) {
    let done = 0;
    return Promise.all(paths.map((p) => loadImage(p).then((img) => { done++; if (onProgress) onProgress(done / paths.length); return img; })));
  }
  const img = (path) => (images[path] && images[path].img) || null;
  // three.js and the shared 3D code (arcade3d.js), loaded the first time a 3D game opens (about 190 KB gzipped)
  let three = null;
  function need3D() {
    if (window.THREE && window.L1_3D) return Promise.resolve();
    if (!three) {
      three = ["vendor/three-0.186.1.min.js?v=1", "arcade3d.js?v=2"].reduce((chain, f) => chain.then(() => new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.src = "/static/" + f;
        el.onload = resolve;
        el.onerror = () => { three = null; reject(new Error(f)); };
        document.head.appendChild(el);
      })), Promise.resolve());
    }
    return three;
  }
  const frames = (path) => ((window.ARCADE_SPRITES || {})[path] || {}).frames || {};
  /* Draws one atlas frame (or a whole picture when name is null) with its bottom centre at (x, y), h pixels tall.
     o: { anchor: "bottom" | "center", flip, alpha, rot (radians), w (width instead of height) } */
  function draw(ctx, path, name, x, y, h, o) {
    const im = img(path);
    if (!im) return null;
    o = o || {};
    const f = name ? frames(path)[name] : [0, 0, im.naturalWidth, im.naturalHeight];
    if (!f) return null;
    const scale = o.w ? o.w / f[2] : h / f[3];
    const w = f[2] * scale, hh = f[3] * scale;
    ctx.save();
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot);
    if (o.flip) ctx.scale(-1, 1);
    const top = o.anchor === "center" ? -hh / 2 : -hh;
    ctx.drawImage(im, f[0], f[1], f[2], f[3], -w / 2, top, w, hh);
    ctx.restore();
    return { w, h: hh };
  }
  // A frame cut out into its own canvas (for selection cards and DOM pictures).
  function frameCanvas(path, name, cssH) {
    const im = img(path), f = frames(path)[name];
    const c = document.createElement("canvas");
    if (!im || !f) return c;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const s = (cssH * dpr) / f[3];
    c.width = Math.round(f[2] * s);
    c.height = Math.round(f[3] * s);
    c.style.height = cssH + "px";
    c.style.width = Math.round(f[2] * s / dpr) + "px";
    c.getContext("2d").drawImage(im, f[0], f[1], f[2], f[3], 0, 0, c.width, c.height);
    return c;
  }
  const picPath = (w) => (w && w.pic && w.pic.startsWith("t:") ? `ninja/t_${w.pic.slice(2)}.webp` : null);
  const picHtml = (w, cls) => {
    const p = picPath(w);
    return p ? `<img class="${cls || "ac-pic"}" src="${asset(p)}" alt="" draggable="false" decoding="async">`
      : `<span class="${cls || "ac-pic"} ac-emo" aria-hidden="true">${esc(w ? w.pic : "")}</span>`;
  };
  // Emoji pictures drawn by the device become stickers (white outline, soft shadow) so they sit well next to the
  // 3D pictures of the art packs. Cached per emoji and size.
  const stickers = {};
  function sticker(ch, px) {
    const k = ch + "@" + px;
    if (stickers[k]) return stickers[k];
    const pad = Math.round(px * 0.12), size = px + pad * 2;
    const glyph = document.createElement("canvas");
    glyph.width = glyph.height = size;
    const g = glyph.getContext("2d");
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `${Math.round(px * 0.82)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif`;
    g.fillText(ch, size / 2, size / 2 + px * 0.04);
    const white = document.createElement("canvas");
    white.width = white.height = size;
    const w = white.getContext("2d");
    w.drawImage(glyph, 0, 0);
    w.globalCompositeOperation = "source-in";
    w.fillStyle = "#fff";
    w.fillRect(0, 0, size, size);
    const out = document.createElement("canvas");
    out.width = out.height = size;
    const o = out.getContext("2d");
    o.shadowColor = "rgba(60,30,0,.35)";
    o.shadowBlur = px * 0.06;
    o.shadowOffsetY = px * 0.03;
    const r = Math.max(2, Math.round(px * 0.035));
    for (let a = 0; a < 8; a++) o.drawImage(white, Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r);
    o.shadowColor = "transparent";
    o.drawImage(glyph, 0, 0);
    stickers[k] = out;
    return out;
  }
  // Something drawable for a word's picture: the art-pack image (loaded first by the game) or an emoji sticker.
  const picDrawable = (w, px) => (picPath(w) ? img(picPath(w)) : sticker(w.pic, px));

  // ------------------------------------------------------------------ sound and speech
  const S = () => (L1() ? L1().Sound : null);
  const sfx = {
    coin() { const s = S(); if (s) { s.tone(988, "square", 0.06, 0, 0.035); s.tone(1319, "square", 0.12, 0.05, 0.035); } },
    right() { const s = S(); if (s) s.right(); },
    wrong() { const s = S(); if (s) s.wrong(); },
    finish() { const s = S(); if (s) s.finish(); },
    tap() { const s = S(); if (s) s.tone(620, "sine", 0.05, 0, 0.05); },
    crash() { const s = S(); if (s) { s.noise(0.35, 0, 0.28, "lowpass", 1400, 180); s.slide(320, 90, "sawtooth", 0.28, 0, 0.06); s.slide(500, 1400, "sine", 0.6, 0.25, 0.08); } },
    honk() { const s = S(); if (s) { s.tone(392, "square", 0.16, 0, 0.04); s.tone(392, "square", 0.22, 0.2, 0.04); } },
    kick() { const s = S(); if (s) s.noise(0.09, 0, 0.3, "lowpass", 700, 160); },
    net() { const s = S(); if (s) { s.noise(0.35, 0, 0.14, "bandpass", 1600, 500); s.noise(1.3, 0.15, 0.08, "bandpass", 700, 1500); } },
    save() { const s = S(); if (s) { s.noise(0.12, 0, 0.22, "lowpass", 900, 300); s.tone(196, "triangle", 0.25, 0.05, 0.08); } },
    slice() { const s = S(); if (s) s.noise(0.14, 0, 0.16, "highpass", 2500, 9000); },
    slap() { const s = S(); if (s) { s.noise(0.06, 0, 0.22, "bandpass", 1100, 700); s.slide(300, 760, "sine", 0.25, 0.04, 0.08); } },
    splash() { const s = S(); if (s) s.noise(0.45, 0, 0.1, "bandpass", 500, 1600); },
    jump() { const s = S(); if (s) s.slide(260, 620, "sine", 0.18, 0, 0.07); },
    whoosh() { const s = S(); if (s) s.noise(0.25, 0, 0.09, "bandpass", 600, 2400); },
    bump() { const s = S(); if (s) { s.noise(0.18, 0, 0.25, "lowpass", 600, 120); s.tone(140, "triangle", 0.2, 0, 0.1); } },
    power() { const s = S(); if (s) [523, 784, 1046, 1318].forEach((f, i) => s.tone(f, "triangle", 0.12, i * 0.06, 0.06)); },
    // Referee whistle: a pea whistle is a high tone with a fast trill; two blasts, a short and a long one.
    whistle() {
      const s = S();
      const ctx = s && s.ctx();
      if (!ctx) return;
      [[0, 0.16], [0.24, 0.55]].forEach(([at, dur]) => {
        const t = ctx.currentTime + at;
        const osc = ctx.createOscillator(), lfo = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(2850, t);
        lfo.frequency.setValueAtTime(28, t);
        depth.gain.setValueAtTime(260, t);
        lfo.connect(depth).connect(osc.frequency);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
        g.gain.setValueAtTime(0.16, t + dur - 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(t); lfo.start(t);
        osc.stop(t + dur + 0.02); lfo.stop(t + dur + 0.02);
      });
      s.noise(0.7, 0, 0.03, "highpass", 3000, 5000);
    },
  };
  function speak(text) {
    try {
      if (!("speechSynthesis" in window) || (S() && S().muted)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB";
      u.rate = 0.9;
      const v = window.speechSynthesis.getVoices().find((x) => /^en(-|_)GB/i.test(x.lang)) || window.speechSynthesis.getVoices().find((x) => /^en/i.test(x.lang));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { /* no speech here */ }
  }
  const haptic = (kind) => { const l = L1(); if (l) l.Haptic[kind](); };

  // ------------------------------------------------------------------ outbox: server writes that survive a lost connection or a reload
  const Outbox = {
    items: null,
    waiters: {},
    busy: false,
    tries: 0,
    timer: 0,
    list() { if (!this.items) this.items = store.get("outbox", []); return this.items; },
    save() { store.set("outbox", this.list()); },
    pending(k) { return this.list().some((i) => i.k === k); },
    // k: a key that names the write for ever (the same write added twice is sent once)
    add(k, path, body) {
      if (!this.pending(k)) { this.list().push({ k, path, body }); this.save(); }
      const p = new Promise((resolve, reject) => { (this.waiters[k] = this.waiters[k] || []).push({ resolve, reject }); });
      this.run();
      return p;
    },
    settle(k, err, data) {
      (this.waiters[k] || []).forEach((w) => (err ? w.reject(err) : w.resolve(data)));
      delete this.waiters[k];
    },
    later() {
      clearTimeout(this.timer);
      this.tries = Math.min(6, this.tries + 1);
      this.timer = setTimeout(() => this.run(), 1000 * Math.pow(2, this.tries));
    },
    async run() {
      if (this.busy) return;
      this.busy = true;
      try {
        while (this.list().length && window.l1GetToken && window.l1GetToken()) {
          const it = this.list()[0];
          let resp = null, data = {};
          try {
            resp = await window.l1Fetch(it.path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(it.body) });
            data = await resp.json().catch(() => ({}));
          } catch (e) { resp = null; }
          // no connection, a busy or broken server, or signed out for a moment: try the same write again later
          if (!resp || resp.status >= 500 || resp.status === 429 || resp.status === 401) { this.later(); break; }
          this.tries = 0;
          this.list().shift();
          this.save();
          if (resp.ok) this.settle(it.k, null, data);
          else { const err = new Error(data.message || "Saqlanmadi."); err.status = resp.status; this.settle(it.k, err); }
        }
      } finally { this.busy = false; }
    },
  };
  window.addEventListener("online", () => Outbox.run());

  // ------------------------------------------------------------------ sessions
  function newId(prefix) {
    let r = "";
    try { r = crypto.randomUUID().replace(/-/g, ""); } catch (e) { r = Math.random().toString(36).slice(2) + Date.now().toString(36); }
    return (prefix + "_" + r).slice(0, 34);
  }
  function hashId(text) { // stable short id (FNV-1a, two rounds) for a save request, so a retry is recognised
    let a = 0x811c9dc5, b = 0x01000193;
    for (let i = 0; i < text.length; i++) { a = Math.imul(a ^ text.charCodeAt(i), 16777619) >>> 0; b = Math.imul(b ^ text.charCodeAt(i), 2654435761) >>> 0; }
    return "q" + a.toString(36) + b.toString(36);
  }
  function startSession(game, lvl, id) {
    const s = { id: id || newId(game.slice(0, 3)), game, level: lvl, want: new Set(), receipt: null, report: null };
    Outbox.add("start_" + s.id, "/api/arcade/start", { id: s.id, game, level: lvl }).catch(() => {});
    return s;
  }
  // One report per session: later calls get the same promise. Sessions where nothing happened are not reported.
  function finishSession(s, payload, empty) {
    if (s.report) return s.report;
    if (empty) { s.report = Promise.resolve(null); return s.report; }
    s.report = Outbox.add("finish_" + s.id, "/api/arcade/finish", Object.assign({ id: s.id }, payload)).then((r) => {
      s.receipt = r;
      if (window.L1_Shell && window.L1_Shell.refresh) window.L1_Shell.refresh();
      hubDirty = true;
      return r;
    });
    // words marked during the game ("save" on a word card) are saved once the server has the session
    s.want.forEach((w) => saveWord(s, w).catch(() => {}));
    return s.report;
  }
  const saves = {};
  function saveWord(s, wordId) {
    const req = hashId(s.id + ":" + wordId);
    if (!saves[req]) {
      saves[req] = Outbox.add("save_" + req, "/api/dictionary/save", { word: wordId, session: s.id, req })
        .then((r) => { hubDirty = true; return r; }, (e) => { delete saves[req]; throw e; });
    }
    return saves[req];
  }

  // A game's progress after each answered question, so a reload can continue where it stopped (24 hours).
  const Ckpt = {
    get(game) { const c = store.get("ckpt_" + game, null); return c && Date.now() - c.at < 86400000 ? c : null; },
    set(game, data) { store.set("ckpt_" + game, Object.assign({ at: Date.now() }, data)); },
    clear(game) { store.del("ckpt_" + game); },
  };

  // ------------------------------------------------------------------ UI pieces shared by the games
  const ICON = {
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.3"/><rect x="13.5" y="5" width="4" height="14" rx="1.3"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M17.8 6.6a7.5 7.5 0 0 1 0 10.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11m0-11-11 11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="#f5b81c"/><circle cx="12" cy="12" r="6.8" fill="#ffd34d" stroke="#e09c0c" stroke-width="1.2"/></svg>',
  };
  const btn = (label, attrs, kind) => `<button type="button" class="ac-btn ${kind || ""}" ${attrs || ""}>${label}</button>`;
  // Small toolbar every game shows: mute and pause.
  function hudButtons() {
    const muted = S() && S().muted;
    return `<button type="button" class="ac-round" data-ac="mute" aria-label="${muted ? "Ovozni yoqish" : "Ovozni o'chirish"}">${muted ? ICON.mute : ICON.sound}</button>
      <button type="button" class="ac-round" data-ac="pause" aria-label="Tanaffus">${ICON.pause}</button>`;
  }
  function toggleMute(button) {
    const s = S();
    if (!s) return;
    s.muted = !s.muted;
    if (s.muted && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (button) { button.innerHTML = s.muted ? ICON.mute : ICON.sound; button.setAttribute("aria-label", s.muted ? "Ovozni yoqish" : "Ovozni o'chirish"); }
  }
  // An overlay card inside a game. Returns the overlay element; close with el.remove().
  function overlay(root, inner, cls) {
    const el = document.createElement("div");
    el.className = "ac-overlay " + (cls || "");
    el.innerHTML = `<div class="ac-card" role="dialog" aria-modal="true">${inner}</div>`;
    root.appendChild(el);
    // the main action takes the focus (a hero chip in front of it looked chosen twice)
    const first = el.querySelector("button.is-primary:not([disabled])") || el.querySelector("button:not([disabled])");
    if (first) setTimeout(() => { try { first.focus({ preventScroll: true }); } catch (e) { /* old browser */ } }, 30);
    return el;
  }
  // ------------------------------------------------------------------ the hero
  /* The child the student plays in every game: three boys and three girls, all made up (their 3D looks are
     L1_3D.HEROES). The choice is kept per student; until there is one, a girl's avatar starts with a girl. */
  const HEROES = [
    { id: "aziz", name: "Aziz" }, { id: "malika", name: "Malika" }, { id: "timur", name: "Timur" },
    { id: "laylo", name: "Laylo" }, { id: "sardor", name: "Sardor" }, { id: "nilufar", name: "Nilufar" },
  ];
  function heroId() {
    const h = store.get("hero", null);
    if (HEROES.some((x) => x.id === h)) return h;
    const me = student(), avatars = (window.L1_Characters && window.L1_Characters.list) || [];
    const av = me && avatars.find((c) => c.id === me.character);
    return av && av.g === "f" ? "malika" : "aziz";
  }
  const heroName = (id) => (HEROES.find((x) => x.id === (id || heroId())) || HEROES[0]).name;
  const setHero = (id) => { if (HEROES.some((x) => x.id === id)) store.set("hero", id); };
  // The hero's picture on the 2D pages (start, pause, results): <span data-shk="pose"> placeholders drawn by
  // L1_3D.portrait once three.js is there. again: redraw the ones already drawn (the hero changed).
  const SHK_POSE = { encourage: "wave", celebrate: "cheer", teach: "wave", thumbs_up: "wave" };
  const shk = (pose, h) => `<span class="ac-shk" data-shk="${pose}" style="--h:${h}px" aria-hidden="true"></span>`;
  function paintShk(root, again) {
    const spots = [...root.querySelectorAll("[data-shk]")].filter((el) => again || !el.firstChild);
    if (!spots.length) return;
    need3D().then(() => {
      const id = heroId();
      spots.forEach((el) => {
        if (!el.isConnected) return;
        const p = window.L1_3D.portrait(id, SHK_POSE[el.dataset.shk] || "idle", parseFloat(el.style.getPropertyValue("--h")) || 160);
        el.innerHTML = `<img src="${p.url}" alt="" draggable="false" style="height:${Math.round(p.h)}px;width:${Math.round(p.w)}px">`;
      });
    }, () => { /* no 3D: the page reads fine without the picture */ });
  }
  // The hero picker of a game's start page; bindHeroPicker draws the faces (one per frame) and handles taps.
  const heroPicker = () => `<div class="ac-heroes" role="radiogroup" aria-label="Qahramoningiz">${HEROES.map((h) => {
    const on = h.id === heroId();
    return `<button type="button" role="radio" class="ac-hero${on ? " is-on" : ""}" aria-checked="${on}" data-hero="${h.id}"><span class="ac-hero-pic" data-hero-pic="${h.id}"></span><b>${h.name}</b></button>`;
  }).join("")}</div>`;
  function bindHeroPicker(root, onPick) {
    need3D().then(() => {
      const todo = [...root.querySelectorAll("[data-hero-pic]")].filter((el) => !el.firstChild);
      const next = () => {
        const el = todo.shift();
        if (!el) return;
        if (el.isConnected) { const p = window.L1_3D.portrait(el.dataset.heroPic, "idle", 52, true); el.innerHTML = `<img src="${p.url}" alt="" draggable="false">`; }
        setTimeout(next, 0);
      };
      next();
    }, () => {});
    root.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-hero]");
      if (!b) return;
      setHero(b.dataset.hero);
      haptic("tap");
      root.querySelectorAll("[data-hero]").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
      paintShk(root, true);
      if (onPick) onPick(b.dataset.hero);
    });
  }
  function loadingHtml(title) {
    return `<div class="ac-loading"><div class="ac-spinner" aria-hidden="true"></div><b>${esc(title)}</b><span>Yuklanmoqda… <i data-ac="pct">0%</i></span></div>`;
  }
  // Loads a game's pictures with a progress line and a retry button when the connection fails.
  function loadWithUi(root, title, paths) {
    return new Promise((resolve) => {
      const go = () => {
        const el = overlay(root, loadingHtml(title), "is-loading");
        const pct = el.querySelector('[data-ac="pct"]');
        load(paths, (p) => { if (pct) pct.textContent = Math.round(p * 100) + "%"; }).then(() => { el.remove(); resolve(); }, () => {
          el.remove();
          const err = overlay(root, `<h3>Rasmlar yuklanmadi</h3><p>Internet aloqasini tekshirib, qayta urinib ko'ring.</p>
            <div class="ac-actions">${btn("Qayta urinish", 'data-ac="retry"', "is-primary")}${btn("Chiqish", 'data-ac="exit"')}</div>`);
          err.addEventListener("click", (ev) => {
            const b = ev.target.closest("[data-ac]");
            if (!b) return;
            err.remove();
            if (b.dataset.ac === "retry") go(); else Layer.close();
          });
        });
      };
      go();
    });
  }
  /* The pause menu. h: { resume(), restart(), exit() }. Restart and exit end the current game; what was earned so far is
     reported and kept, which the confirmation says. */
  function pauseMenu(root, h) {
    const el = overlay(root, `${shk("encourage", 150)}<h3>Tanaffus</h3><p>O'yin to'xtatildi.</p>
      <div class="ac-actions is-col">${btn("Davom etish", 'data-ac="resume"', "is-primary")}${btn("Qayta boshlash", 'data-ac="restart"')}${btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div>`, "is-pause");
    paintShk(el);
    el.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-ac]");
      if (!b) return;
      if (b.dataset.ac === "resume") { el.remove(); h.resume(); return; }
      const what = b.dataset.ac;
      const card = el.querySelector(".ac-card");
      card.innerHTML = `<h3>${what === "restart" ? "Qayta boshlaysizmi?" : "O'yindan chiqasizmi?"}</h3>
        <p>Bu o'yin shu yerda tugaydi. Hozirgacha yig'ilgan ballar va so'zlar saqlanadi.</p>
        <div class="ac-actions">${btn(what === "restart" ? "Ha, qayta boshlash" : "Ha, chiqish", 'data-ac="yes"', "is-primary")}${btn("Yo'q, davom etish", 'data-ac="no"')}</div>`;
      card.addEventListener("click", (e2) => {
        const c = e2.target.closest("[data-ac]");
        if (!c) return;
        el.remove();
        if (c.dataset.ac === "no") h.resume(); else if (what === "restart") h.restart(); else h.exit();
      });
    }, { once: false });
    return el;
  }

  const STATUS = { new: "Yangi", learning: "O'rganilmoqda", review: "Takrorlash kerak", mastered: "O'zlashtirilgan" };
  // One collected word in a results list, with its save button.
  function wordRow(w, n) {
    return `<li class="ac-word" data-word="${esc(w.id)}">${picHtml(w, "ac-word-pic")}
      <span class="ac-word-txt"><b>${esc(w.en)}${n > 1 ? ` <em>×${n}</em>` : ""}</b><small>${esc(w.ipa)} · ${esc(w.uz)}</small></span>
      <button type="button" class="ac-save" data-save="${esc(w.id)}">Saqlash <i>+20</i></button></li>`;
  }
  function setSaveState(button, st, text) {
    button.dataset.state = st;
    button.disabled = st === "busy" || st === "new" || st === "old";
    button.innerHTML = text;
  }
  /* A list of collected words with "save" buttons. ids: word ids in the order met (repeats allowed). The session's receipt
     marks words that are already in the dictionary. */
  function wordList(host, s, ids) {
    const counts = {};
    ids.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    const uniq = Object.keys(counts).map(word).filter(Boolean);
    if (!uniq.length) { host.innerHTML = '<p class="ac-muted">Bu safar so\'z yig\'ilmadi.</p>'; return; }
    host.innerHTML = `<div class="ac-words-head"><b>Yig'ilgan so'zlar (${uniq.length})</b>${btn("Hammasini saqlash", 'data-ac="saveall"', "is-small")}</div>
      <ul class="ac-words">${uniq.map((w) => wordRow(w, counts[w.id])).join("")}</ul>
      <p class="ac-note">Har bir yangi so'z lug'atga birinchi marta saqlanganda +20 ball. So'z takrorlash ro'yxatiga qo'shiladi.</p>`;
    const mark = (id, st, text) => { const b = host.querySelector(`[data-save="${id.replace(/[^\w-]/g, "")}"]`); if (b) setSaveState(b, st, text); };
    const save = (id) => {
      mark(id, "busy", "Saqlanmoqda…");
      saveWord(s, id).then((r) => {
        if (r.new && r.bonus) mark(id, "new", `✓ Saqlandi <i>+${r.bonus}</i>`);
        else mark(id, "old", "Avval saqlangan");
        updateBonusLine(host);
      }, (e) => mark(id, "err", e && e.status === 409 ? "Saqlab bo'lmadi" : "Qayta urinish"));
    };
    const fromReceipt = (r) => { (r && r.saved || []).forEach((id) => mark(id, "old", "Avval saqlangan")); };
    if (s.receipt) fromReceipt(s.receipt); else if (s.report) s.report.then(fromReceipt, () => {});
    s.want.forEach((id) => save(id));
    host.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-save]");
      if (b && !b.disabled) { haptic("tap"); save(b.dataset.save); return; }
      if (ev.target.closest('[data-ac="saveall"]')) {
        host.querySelectorAll("[data-save]").forEach((x) => { if (!x.disabled && x.dataset.state !== "err") save(x.dataset.save); });
      }
    });
  }
  function updateBonusLine(host) {
    const root = host.closest(".ac-results");
    const line = root && root.querySelector('[data-ac="bonus"]');
    if (!line) return;
    const n = host.querySelectorAll('[data-state="new"]').length;
    line.textContent = n ? `+${n * 20}` : "0";
  }
  // The receipt line: what reached the rating (or why nothing did), filled in when the server answers.
  function receiptLine(el, s) {
    if (!el) return;
    el.textContent = "Natija saqlanmoqda…";
    (s.report || Promise.resolve(null)).then((r) => {
      if (!r) { el.textContent = ""; return; }
      el.textContent = r.awarded > 0 ? `Reytingga +${r.awarded} ball qo'shildi.${r.remainingToday === 0 ? " Bugungi o'yin limiti to'ldi." : ""}`
        : `Bugungi o'yin balli limiti (${r.dailyCap}) to'lgan, reytingga ertaga yana qo'shiladi.`;
    }, (e) => { el.textContent = e && e.status === 409 ? (e.message || "Natija saqlanmadi.") : "Natija saqlanmadi: " + ((e && e.message) || "xatolik"); });
  }
  // The card shown after a word is answered (Word Ninja, River Crossing): picture, word, pronunciation, example.
  function wordCardHtml(w, opts) {
    opts = opts || {};
    return `<div class="ac-wordcard">${picHtml(w, "ac-wordcard-pic")}
      <div class="ac-wordcard-body"><b class="ac-wordcard-en">${esc(w.en)}</b>
      <span class="ac-wordcard-ipa">${esc(w.ipa)} <button type="button" class="ac-round is-small" data-speak="${esc(w.en)}" aria-label="Talaffuzni eshitish">${ICON.speak}</button></span>
      <span class="ac-wordcard-uz">${esc(w.uz)}</span>
      <span class="ac-wordcard-ex">${esc(w.ex)}</span></div></div>
      ${opts.save ? `<button type="button" class="ac-save is-wide" data-want="${esc(w.id)}">${opts.marked ? "✓ O'yin oxirida saqlanadi" : "Lug'atga saqlash <i>+20</i>"}</button>` : ""}`;
  }
  // Word-card buttons: pronounce and "save at the end".
  function bindWordCard(el, s) {
    el.addEventListener("click", (ev) => {
      const sp = ev.target.closest("[data-speak]");
      if (sp) { speak(sp.dataset.speak); return; }
      const want = ev.target.closest("[data-want]");
      if (want && s && !s.want.has(want.dataset.want)) {
        s.want.add(want.dataset.want);
        want.innerHTML = "✓ O'yin oxirida saqlanadi";
        want.disabled = true;
        haptic("tap");
      }
    });
  }
  const accuracy = (correct, attempts) => (attempts ? Math.round((correct / attempts) * 100) + "%" : "—");

  // ------------------------------------------------------------------ the full-screen game layer
  const games = {};
  let hubDirty = true;
  const Layer = {
    el: null,
    root: null,
    current: null,
    back: null,
    open(id, opts) {
      const g = games[id];
      if (!g) return;
      this.close(true);
      const el = document.createElement("div");
      el.id = "acLayer";
      el.className = "ac-layer ac-g-" + id;
      el.setAttribute("data-keep-emoji", ""); // game buttons keep their exact labels (no automatic icons)
      el.innerHTML = '<div class="ac-root"></div>';
      document.body.appendChild(el);
      document.body.classList.add("ac-open");
      this.el = el;
      this.root = el.firstChild;
      this.current = g;
      this.pushBack();
      try { g.open(this.root, opts || {}); } catch (e) { console.error(e); this.close(); }
    },
    // Back (Telegram or the bar) pauses a running game; on a menu or results page it leaves.
    pushBack() {
      const l = L1();
      if (!l || !l.Back) return;
      this.back = l.Back.push(() => {
        this.back = null;
        const g = this.current;
        if (g && g.onBack && g.onBack()) { this.pushBack(); return; }
        this.close();
      });
    },
    close(silent) {
      if (!this.el) return;
      const g = this.current;
      try { if (g && g.destroy) g.destroy(); } catch (e) { console.error(e); }
      this.el.remove();
      this.el = this.root = this.current = null;
      document.body.classList.remove("ac-open");
      const l = L1();
      if (this.back && l && l.Back) l.Back.remove(this.back);
      this.back = null;
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* none */ }
      if (!silent && hubHost && document.body.contains(hubHost)) renderHub(hubHost);
    },
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden && Layer.current && Layer.current.pause) Layer.current.pause(); });

  // ------------------------------------------------------------------ the Games page
  const CARDS = [
    { id: "wordrun", name: "Word Run", tag: "Yugur, tanga yig', qizil chiroqda savolga javob ber", pic: "cards/wordrun_kids.webp" },
    { id: "penalty", name: "Penalti", tag: "To'g'ri javob — gol! 10 ta zarba", pic: "cards/penalty_kids.webp" },
    { id: "ninja", name: "Word Ninja", tag: "O'zbekcha so'z — to'g'ri rasmni kes", pic: "cards/ninja_fruit.webp" },
    { id: "river", name: "Daryodan o'tish — Jigar!", tag: "Keraklilarini qayiqda uyga olib bor", pic: null },
  ];
  const RIVER_CARD = '<svg class="ac-card-svg" viewBox="0 0 300 200" aria-hidden="true"><defs><linearGradient id="acrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#e8f6ff"/></linearGradient><linearGradient id="acrw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa7e0"/><stop offset="1" stop-color="#1f78c1"/></linearGradient></defs><rect width="300" height="200" fill="url(#acrsk)"/><circle cx="250" cy="38" r="18" fill="#ffd34d"/><path d="M0 120 Q40 96 92 104 L104 200 H0Z" fill="#7cc35b"/><path d="M300 120 Q262 98 208 106 L196 200 H300Z" fill="#7cc35b"/><rect x="88" y="118" width="124" height="82" fill="url(#acrw)"/><path d="M92 140q10-6 20 0t20 0 20 0 20 0 20 0 20 0" stroke="#bfe6ff" stroke-width="3" fill="none" opacity=".7"/><path d="M110 150 h80 l-10 18 h-60z" fill="#a0602a"/><rect x="146" y="118" width="4" height="34" fill="#6b3f1a"/><circle cx="132" cy="140" r="7" fill="#ff8a3d"/><circle cx="168" cy="141" r="7" fill="#7ac943"/><path d="M226 88 l28-22 28 22v34h-56z" fill="#f4e2c0"/><path d="M220 90 l34-28 34 28" fill="none" stroke="#c4552b" stroke-width="8" stroke-linejoin="round"/><rect x="247" y="102" width="14" height="20" fill="#2d6fa8"/><path d="M20 112 h52 v-22 h-52z" fill="#fff6e6"/><path d="M16 92 h60 l-6-12 h-48z" fill="#ff8a3d"/></svg>';
  let hubHost = null;
  let summary = null;
  function cardStat(id) {
    const g = summary && summary.games && summary.games[id];
    if (!g) return "Yangi o'yin";
    return `Eng yaxshi: ${g.best} ball · ${g.plays} marta`;
  }
  function renderHub(host) {
    hubHost = host;
    const lvl = level();
    const dict = (summary && summary.dictionary) || null;
    host.innerHTML = `<section class="ac-hub" aria-label="O'yinlar">
      <div class="ac-hub-head"><h2>O'yinlar</h2>
        <div class="ac-levels" role="radiogroup" aria-label="Daraja">${LEVELS.map((l) => `<button type="button" role="radio" aria-checked="${l.id === lvl}" class="ac-level${l.id === lvl ? " is-on" : ""}" data-level="${l.id}">${l.name}</button>`).join("")}</div></div>
      <div class="ac-cards">${CARDS.map((c) => `<button type="button" class="ac-gcard" data-open="${c.id}">
        <span class="ac-gcard-pic">${c.pic ? `<img src="${asset(c.pic)}" alt="" decoding="async">` : RIVER_CARD}</span>
        <span class="ac-gcard-txt"><b>${esc(c.name)}</b><small>${esc(c.tag)}</small><em data-stat="${c.id}">${esc(cardStat(c.id))}</em></span></button>`).join("")}</div>
      <button type="button" class="ac-dictcard" data-open="dictionary"><span class="ac-dictcard-coin">${ICON.coin}</span>
        <span class="ac-dictcard-txt"><b>So'z tangalari lug'ati</b><small data-stat="dict">${dict ? `${dict.total} ta so'z · ${dict.due} ta takrorlash kutmoqda` : "O'yinlarda yig'ilgan so'zlaringiz shu yerda"}</small></span>
        <span class="ac-dictcard-go">Ochish</span></button>
    </section>`;
    if (!host.dataset.wired) {
      host.dataset.wired = "1";
      host.addEventListener("click", (ev) => {
        const lv = ev.target.closest("[data-level]");
        if (lv) { store.set("level", lv.dataset.level); haptic("tap"); renderHub(host); return; }
        const o = ev.target.closest("[data-open]");
        if (!o) return;
        haptic("tap");
        if (o.dataset.open === "dictionary") Dictionary.open(); else Layer.open(o.dataset.open);
      });
    }
    if (hubDirty && window.l1GetToken && window.l1GetToken()) {
      hubDirty = false;
      L1().api("/api/arcade/summary").then((d) => { summary = d; if (hubHost === host && !Layer.el) refreshHubStats(host); }).catch(() => { hubDirty = true; });
    }
  }
  function refreshHubStats(host) {
    CARDS.forEach((c) => { const el = host.querySelector(`[data-stat="${c.id}"]`); if (el) el.textContent = cardStat(c.id); });
    const d = host.querySelector('[data-stat="dict"]');
    if (d && summary && summary.dictionary) d.textContent = `${summary.dictionary.total} ta so'z · ${summary.dictionary.due} ta takrorlash kutmoqda`;
  }

  // ------------------------------------------------------------------ the Word Coin Dictionary and its review
  const GAME_NAMES = { wordrun: "Word Run", penalty: "Penalti", ninja: "Word Ninja", river: "Daryodan o'tish" };
  const Dictionary = {
    data: null,
    open() { Layer.open("dictionary"); },
    onBack() { if (this.mode === "review") { this.mode = "list"; this.render(); return true; } return false; },
    open_(root) { this.root = root; this.mode = "list"; this.tab = "all"; this.render(); this.fetch(); },
    destroy() { this.root = null; },
    fetch() {
      L1().api("/api/dictionary").then((d) => { this.data = d; if (this.root && this.mode === "list") this.render(); }).catch(() => {
        this.data = this.data || { words: [], total: 0, due: 0, error: true };
        if (this.root && this.mode === "list") this.render();
      });
    },
    words() {
      return ((this.data && this.data.words) || []).map((r) => Object.assign({}, r, { w: word(r.id) })).filter((r) => r.w);
    },
    render() {
      if (!this.root) return;
      if (this.mode === "review") { this.renderReview(); return; }
      const list = this.words();
      const due = list.filter((r) => r.s === "review");
      const shown = this.tab === "due" ? due : list;
      this.root.innerHTML = `<div class="ac-dict">
        <header class="ac-dict-head">
          <button type="button" class="ac-round" data-ac="close" aria-label="Yopish">${ICON.close}</button>
          <div><h2>So'z tangalari lug'ati</h2><small>${this.data ? `${list.length} ta so'z` : "Yuklanmoqda…"}</small></div>
          ${shk("teach", 74)}
        </header>
        <div class="ac-tabs" role="tablist">
          <button type="button" role="tab" aria-selected="${this.tab === "all"}" class="${this.tab === "all" ? "is-on" : ""}" data-tab="all">Barcha so'zlar</button>
          <button type="button" role="tab" aria-selected="${this.tab === "due"}" class="${this.tab === "due" ? "is-on" : ""}" data-tab="due">Takrorlash (${due.length})</button>
        </div>
        ${due.length ? `<button type="button" class="ac-btn is-primary is-wide" data-ac="review">Takrorlashni boshlash · ${due.length} ta so'z</button>` : ""}
        ${this.data && this.data.error ? '<p class="ac-muted">Lug\'at yuklanmadi. Internetni tekshirib, qayta oching.</p>' : ""}
        ${this.data && !list.length && !this.data.error ? '<p class="ac-empty">Hali so\'z saqlanmagan. O\'yinlardan keyin natijalar sahifasida «Saqlash» tugmasini bosing — har bir yangi so\'z uchun +20 ball.</p>' : ""}
        <ul class="ac-words is-dict">${shown.map((r) => `<li class="ac-word">${picHtml(r.w, "ac-word-pic")}
          <span class="ac-word-txt"><b>${esc(r.w.en)}</b><small>${esc(r.w.ipa)} · ${esc(r.w.uz)}</small><small class="ac-word-ex">${esc(r.w.ex)}</small></span>
          <span class="ac-word-side"><span class="ac-chip is-${r.s}">${STATUS[r.s] || ""}</span><small>${esc(GAME_NAMES[r.game] || "")}</small>
          <button type="button" class="ac-round is-small" data-speak="${esc(r.w.en)}" aria-label="Talaffuzni eshitish">${ICON.speak}</button></span></li>`).join("")}</ul>
      </div>`;
      paintShk(this.root);
    },
    startReview() {
      this.queue = shuffle(this.words().filter((r) => r.s === "review"));
      this.done = 0;
      this.mode = "review";
      this.reveal = false;
      this.render();
    },
    renderReview() {
      const r = this.queue[0];
      if (!r) {
        this.root.innerHTML = `<div class="ac-dict is-review"><div class="ac-review-done">${shk("celebrate", 190)}
          <h2>Barakalla!</h2><p>${this.done} ta so'z takrorlandi. Keyingi takrorlash vaqti kelganda so'zlar yana shu yerda bo'ladi.</p>
          ${btn("Lug'atga qaytish", 'data-ac="list"', "is-primary")}</div></div>`;
        paintShk(this.root);
        return;
      }
      this.root.innerHTML = `<div class="ac-dict is-review">
        <header class="ac-dict-head"><button type="button" class="ac-round" data-ac="list" aria-label="Orqaga">${ICON.close}</button>
          <div><h2>Takrorlash</h2><small>${this.done + 1} / ${this.done + this.queue.length}</small></div></header>
        <div class="ac-flash">${picHtml(r.w, "ac-flash-pic")}<b class="ac-flash-en">${esc(r.w.en)}</b>
          <span class="ac-flash-ipa">${esc(r.w.ipa)} <button type="button" class="ac-round is-small" data-speak="${esc(r.w.en)}" aria-label="Talaffuzni eshitish">${ICON.speak}</button></span>
          ${this.reveal ? `<span class="ac-flash-uz">${esc(r.w.uz)}</span><span class="ac-flash-ex">${esc(r.w.ex)}</span>` : '<span class="ac-flash-hint">Ma\'nosini eslang, keyin tekshiring.</span>'}
        </div>
        <div class="ac-actions">${this.reveal
          ? `${btn("Qiyin", 'data-grade="hard"', "is-hard")}${btn("Yaxshi", 'data-grade="good"', "is-good")}${btn("Oson", 'data-grade="easy"', "is-easy")}`
          : btn("Javobni ko'rish", 'data-ac="reveal"', "is-primary is-wide")}</div>
      </div>`;
      if (!this.reveal) speak(r.w.en);
    },
    grade(g) {
      const r = this.queue.shift();
      if (!r) return;
      this.done++;
      this.reveal = false;
      // the shared memory takes right/wrong; "easy" counts as right twice, so the word rests longer
      const results = g === "hard" ? [{ id: r.id, ok: false }] : g === "good" ? [{ id: r.id, ok: true }] : [{ id: r.id, ok: true }, { id: r.id, ok: true }];
      if (window.L1_Words) window.L1_Words.report(results, "dictionary").then(() => this.fetch());
      haptic(g === "hard" ? "warn" : "ok");
      this.render();
    },
    click(ev) {
      const sp = ev.target.closest("[data-speak]");
      if (sp) { speak(sp.dataset.speak); return; }
      const t = ev.target.closest("[data-tab]");
      if (t) { this.tab = t.dataset.tab; this.render(); return; }
      const g = ev.target.closest("[data-grade]");
      if (g) { this.grade(g.dataset.grade); return; }
      const a = ev.target.closest("[data-ac]");
      if (!a) return;
      const act = a.dataset.ac;
      if (act === "close") Layer.close();
      else if (act === "review") this.startReview();
      else if (act === "reveal") { this.reveal = true; this.render(); }
      else if (act === "list") { this.mode = "list"; this.render(); this.fetch(); }
    },
  };
  games.dictionary = {
    open(root) {
      Dictionary.open_(root);
      root.addEventListener("click", (ev) => Dictionary.click(ev));
    },
    onBack: () => Dictionary.onBack(),
    destroy: () => Dictionary.destroy(),
  };

  // ------------------------------------------------------------------ public API
  window.L1_Arcade = {
    // the games
    register(id, game) { games[id] = game; },
    open: (id, opts) => Layer.open(id, opts),
    close: () => Layer.close(),
    get active() { return !!Layer.el; },
    get current() { return Layer.current; }, // the open game (tests step its update() by hand)
    pause() { if (Layer.current && Layer.current.pause) Layer.current.pause(); },
    renderHub,
    openDictionary: () => Dictionary.open(),
    // content
    level, levelName, LEVELS, word, vocabFor, grammarFor, askedQuestion, filled, shuffle,
    // pictures
    asset, load, loadImage, img, frames, draw, frameCanvas, picPath, picHtml, picDrawable, sticker, reducedMotion, need3D,
    // sound
    sfx, speak, haptic,
    // results
    startSession, finishSession, saveWord, Ckpt, Outbox,
    // UI
    ICON, btn, esc, hudButtons, toggleMute, overlay, shk, paintShk, loadWithUi,
    // the hero
    HEROES, heroId, heroName, setHero, heroPicker, bindHeroPicker,
    pauseMenu, wordList, receiptLine, wordCardHtml, bindWordCard, accuracy,
  };
  // the app pauses games when the student leaves the Games tab or the app (app_shell.js calls this)
  window.L1_Games = { pauseAll: () => window.L1_Arcade.pause() };
  Outbox.run();
})(window, document);
