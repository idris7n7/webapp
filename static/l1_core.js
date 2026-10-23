// Level Up core helpers shared by the app shell, weekly tasks and games:
// Telegram Mini App integration, haptics, sounds, Shakespeare mascot, avatars and effects.
(function (window) {
  "use strict";
  const tg = window.Telegram && window.Telegram.WebApp;
  const html = (v) => (window.esc ? window.esc(v) : String(v == null ? "" : v));

  function versionAtLeast(v) {
    try { return !!(tg && tg.isVersionAtLeast && tg.isVersionAtLeast(v)); } catch (e) { return false; }
  }

  // ---------------------------------------------------------------- Theme (day / night)
  // The saved choice wins; otherwise follow the device. The <html data-theme> attribute drives app_theme.css.
  const THEME_COLORS = { light: { bar: "#f7f8fe", bg: "#f7f8fe" }, dark: { bar: "#0f1226", bg: "#0f1226" } };
  const Theme = {
    get() {
      let t = null;
      try { t = localStorage.getItem("l1_theme_v1"); } catch (e) {}
      if (t === "light" || t === "dark") return t;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    apply(t) {
      document.documentElement.setAttribute("data-theme", t);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", THEME_COLORS[t].bar);
      document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
        b.setAttribute("aria-label", t === "dark" ? "Kunduzgi rejim" : "Tungi rejim");
        b.title = t === "dark" ? "Kunduzgi rejimni yoqish" : "Tungi rejimni yoqish";
      });
      try {
        if (tg && versionAtLeast("6.1")) {
          tg.setHeaderColor && tg.setHeaderColor(THEME_COLORS[t].bar);
          tg.setBackgroundColor && tg.setBackgroundColor(THEME_COLORS[t].bg);
        }
        if (tg && versionAtLeast("7.10") && tg.setBottomBarColor) tg.setBottomBarColor(THEME_COLORS[t].bg);
      } catch (e) {}
    },
    set(t) {
      try { localStorage.setItem("l1_theme_v1", t); } catch (e) {}
      this.apply(t);
    },
    toggle() { this.set(this.get() === "dark" ? "light" : "dark"); },
    // Markup of the sun / moon switch; wire it with Theme.bind(root).
    buttonHtml(cls, id) {
      return `<button type="button" ${id ? `id="${id}"` : ""} class="l1-theme-toggle ${cls || ""}" data-theme-toggle>
        <svg class="l1-ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>
        <svg class="l1-ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>
      </button>`;
    },
    bind(root) {
      (root || document).querySelectorAll("[data-theme-toggle]").forEach((b) => {
        if (b.dataset.bound) return;
        b.dataset.bound = "1";
        b.addEventListener("click", () => { Theme.toggle(); });
      });
      this.apply(this.get());
    },
  };
  Theme.apply(Theme.get());

  // ---------------------------------------------------------------- Telegram
  const TG = {
    inside: !!(tg && tg.initData),
    init() {
      if (!tg) return;
      try {
        tg.ready();
        tg.expand && tg.expand();
        // Full-screen mode (Bot API 8.0+): the whole screen belongs to the app. The safe-area insets Telegram reports are
        // padded in tf_design.css so its own buttons never sit on top of ours.
        if (versionAtLeast("8.0") && tg.requestFullscreen && !tg.isFullscreen) tg.requestFullscreen();
        // Swiping down inside games/lists must not close the Mini App.
        if (versionAtLeast("7.7") && tg.disableVerticalSwipes) tg.disableVerticalSwipes();
        Theme.apply(Theme.get());
        if (tg.BackButton && versionAtLeast("6.1")) tg.BackButton.onClick(() => Back.pop());
        if (tg.onEvent) tg.onEvent("viewportChanged", () => document.documentElement.style.setProperty("--l1-vh", (tg.viewportStableHeight || window.innerHeight) + "px"));
      } catch (e) {}
    },
  };

  // Back navigation: the Telegram Back button (and Android back) closes the top-most layer.
  const Back = {
    stack: [],
    push(handler) {
      this.stack.push(handler);
      this.sync();
      return handler;
    },
    remove(handler) {
      this.stack = this.stack.filter((h) => h !== handler);
      this.sync();
    },
    pop() {
      const handler = this.stack.pop();
      this.sync();
      if (handler) handler();
    },
    sync() {
      if (!tg || !tg.BackButton || !versionAtLeast("6.1")) return;
      try { this.stack.length ? tg.BackButton.show() : tg.BackButton.hide(); } catch (e) {}
    },
  };

  // ---------------------------------------------------------------- Haptics & sound
  const haptics = () => (versionAtLeast("6.1") && tg.HapticFeedback) || null;
  const Haptic = {
    ok() { try { const h = haptics(); h && h.notificationOccurred("success"); } catch (e) {} },
    err() { try { const h = haptics(); h && h.notificationOccurred("error"); } catch (e) {} },
    warn() { try { const h = haptics(); h && h.notificationOccurred("warning"); } catch (e) {} },
    tap() { try { const h = haptics(); h && h.impactOccurred("light"); } catch (e) {} },
  };

  let audioCtx = null;
  const Sound = {
    get muted() { try { return localStorage.getItem("l1_sound_off") === "1"; } catch (e) { return false; } },
    set muted(v) { try { localStorage.setItem("l1_sound_off", v ? "1" : "0"); } catch (e) {} },
    tone(freq, type, dur, delay, gain) {
      if (this.muted) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const t = audioCtx.currentTime + (delay || 0);
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(gain || 0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur);
      } catch (e) {}
    },
    // Filtered noise burst (footsteps, wind, doors, wing beats). kind: lowpass | bandpass | highpass; f0 -> f1 sweeps the filter.
    noise(dur, delay, gain, kind, f0, f1) {
      if (this.muted) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const t = audioCtx.currentTime + (delay || 0);
        const len = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
        const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = kind || "lowpass";
        filter.Q.value = kind === "bandpass" ? 1.1 : 0.7;
        filter.frequency.setValueAtTime(f0 || 800, t);
        if (f1) filter.frequency.exponentialRampToValueAtTime(f1, t + dur);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain || 0.1, t + Math.min(0.025, dur / 4));
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        src.connect(filter).connect(g).connect(audioCtx.destination);
        src.start(t);
        src.stop(t + dur);
      } catch (e) {}
    },
    // Oscillator gliding from f0 to f1 (growls, drops, swoops).
    slide(f0, f1, type, dur, delay, gain) {
      if (this.muted) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const t = audioCtx.currentTime + (delay || 0);
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f0, t);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain || 0.12, t + Math.min(0.03, dur / 4));
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      } catch (e) {}
    },
    // The shared audio context (created on first use, resumed after a tap), for games that build their own sounds. null when muted.
    ctx() {
      if (this.muted) return null;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
        return audioCtx;
      } catch (e) { return null; }
    },
    right() { this.tone(660, "sine", 0.12, 0, 0.12); this.tone(880, "sine", 0.18, 0.09, 0.12); },
    wrong() { this.tone(220, "triangle", 0.16, 0, 0.16); this.tone(165, "triangle", 0.22, 0.12, 0.14); },
    finish() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, "sine", 0.22, i * 0.11, 0.12)); },
  };

  // ---------------------------------------------------------------- Shakespeare (the mascot; the old name `Idris` stays as the code API)
  // Six still pictures (static/shakespeare/*.png, white background); each app section / mood picks the one that fits.
  const ALT = {
    "shakespeare-greeting": "Shakespeare smiling and waving hello", "shakespeare-celebrate": "Shakespeare celebrating with both fists raised",
    "shakespeare-writing": "Shakespeare writing with a quill at a desk beside a lamp", "shakespeare-reading": "Shakespeare holding an open book and turning a page",
    "shakespeare-thinking": "Shakespeare wearing glasses with his hand on his chin", "shakespeare-football": "Shakespeare smiling and holding a black and white football in both hands",
  };
  const SHK = (n) => ({ w: 1, src: "shakespeare-" + n, url: "/static/shakespeare/shakespeare-" + n + ".webp", alt: ALT["shakespeare-" + n] });
  const POSES = {
    wave: "/static/shakespeare/shakespeare-greeting.webp",
    pointing: "/static/shakespeare/shakespeare-thinking.webp",
    thumbsup: "/static/shakespeare/shakespeare-celebrate.webp",
    celebrate: "/static/shakespeare/shakespeare-celebrate.webp",
  };
  // Moods used by the score reactions map onto the poses.
  const MOOD_POSE = { surprised: "celebrate", praise: "thumbsup", comfort: "wave" };
  //   greet = Asosiy (hello)  book = Vazifalar (reading)  glasses = O'rganish (thinking)  desk = Mashq qilish (writing)
  //   ball = O'yinlar (football)  trophy = Reyting (celebrating)  wave / pointing / thumbsup / celebrate = task runner and games
  const PHOTO_SCENES = {
    greet: SHK("greeting"), book: SHK("reading"), glasses: SHK("thinking"), desk: SHK("writing"), ball: SHK("football"), trophy: SHK("celebrate"),
    wave: SHK("greeting"), pointing: SHK("thinking"), thumbsup: SHK("celebrate"), celebrate: SHK("celebrate"),
  };
  Object.values(POSES).forEach((src) => { const i = new Image(); i.src = src; });

  const photoSceneHtml = (name, size, extraClass) => `<div class="idris idris-photo ${extraClass || ""}" data-photo-scene="${name}" style="--idris-size:${size || 150}px"><img src="${PHOTO_SCENES[name].url}" alt="${PHOTO_SCENES[name].alt}" width="${size || 150}" height="${size || 150}" draggable="false"></div>`;
  const Idris = {
    POSES,
    // Markup for a Shakespeare figure; `pose` is a pose name, a scene name or a mood; size in px.
    html(pose, size, extraClass) {
      const name = PHOTO_SCENES[pose] ? pose : MOOD_POSE[pose] || "wave";
      return photoSceneHtml(name, size, extraClass);
    },
    // Changes pose (a cross-fade) and plays a reaction: "happy" | "no" | "party" | null.
    react(el, pose) { // changes the picture only; no animation
      if (!el || !el.dataset.photoScene) return;
      if (pose && POSES[pose] && POSES[el.dataset.photoScene] && PHOTO_SCENES[pose] && el.dataset.photoScene !== pose) {
        el.dataset.photoScene = pose;
        const img = el.querySelector("img");
        if (img) { img.src = PHOTO_SCENES[pose].url; img.alt = PHOTO_SCENES[pose].alt; }
      }
    },   // Which mood and what to say for a score: `rank` and `points` of the student, `total` students on the board.
    forScore(points, rank, total) {
      if (!points) return { mood: "comfort", text: "Hali ball yo'q — hechqisi yo'q! Bitta mashq bilan boshlang, men yoningizdaman." };
      if (rank === 1) return { mood: "surprised", text: "Voy! Siz birinchi o'rindasiz! Ishonmayapman!" };
      if (rank && rank <= 3) return { mood: "surprised", text: `Voy, ${rank}-o'rin! Podiumdasiz!` };
      if (rank && total && rank > total / 2) return { mood: "comfort", text: "Hali kech emas. Bugun bir nechta mashq — va reytingda ko'tarilasiz!" };
      return { mood: "praise", text: "Barakalla! Yaxshi ketyapsiz, shunday davom eting." };
    },
  };

  const LINES = {
    right: ["Zo'r! Aynan shunday.", "Barakalla, to'g'ri!", "Ajoyib — birinchi urinishda!", "To'ppa-to'g'ri!", "Mana bu natija!"],
    rightLater: ["To'g'ri! Xatodan o'rgandingiz.", "Ana endi bo'ldi!", "Yaxshi, topdingiz!"],
    wrong: ["Hmm, bu emas. Yana bir bor o'ylab ko'ring.", "Deyarli! Savolni diqqat bilan o'qing.", "Shoshilmang — qoidani eslang.", "Bu safar emas. Siz uddalaysiz!", "Hechqisi yo'q, xato qilish — o'rganishning bir qismi. Yana urinib ko'ring!"],
    hintOptions: ["Noto'g'ri variantlarni olib tashladim. Endi tanlang!", "Maslahat: qolgan variantlardan birini tanlang."],
    hintMask: ["Maslahat qo'shdim: har bir so'zning birinchi harfi ko'rsatildi.", "Pastdagi maslahatga qarang — harflar soni ham bor."],
    reveal: ["Bu safar chiqmadi. To'g'ri javobni eslab qoling.", "Hechqisi yo'q — to'g'ri javob quyida. Keyingisida topasiz!"],
    start: ["Qani, boshladik! Birinchi urinishdagi javob — 25 ball.", "Diqqat bilan o'qing — har bir to'g'ri javob ball keltiradi."],
  };
  Idris.line = (kind) => { const l = LINES[kind] || LINES.start; return l[Math.floor(Math.random() * l.length)]; };

  // ---------------------------------------------------------------- Effects
  const Fx = {
    flash(kind) {
      const d = document.createElement("div");
      d.className = kind === "right" ? "l1-flash-right" : "l1-flash-wrong";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 650);
    },
    shake(el) {
      if (!el) return;
      el.classList.remove("l1-shake");
      void el.offsetWidth;
      el.classList.add("l1-shake");
      setTimeout(() => el.classList.remove("l1-shake"), 500);
    },
    points(fromEl, text) {
      const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
      const d = document.createElement("div");
      d.className = "l1-float-points";
      d.textContent = text;
      d.style.left = r.left + r.width / 2 + "px";
      d.style.top = r.top - 8 + "px";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 1150);
    },
    confetti(fromEl, count) {
      const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
      const colors = ["#2f5bea", "#22c55e", "#f5b700", "#ff5a7a", "#7aa2ff"];
      for (let i = 0; i < (count || 18); i++) {
        const c = document.createElement("i");
        c.className = "l1-confetti";
        c.style.left = r.left + r.width / 2 + "px";
        c.style.top = r.top + r.height / 2 + "px";
        c.style.background = colors[i % colors.length];
        const a = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 120;
        c.style.setProperty("--dx", Math.cos(a) * dist + "px");
        c.style.setProperty("--dy", Math.sin(a) * dist - 40 + "px");
        c.style.setProperty("--rot", Math.random() * 720 - 360 + "deg");
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1200);
      }
    },
  };

  // ---------------------------------------------------------------- Avatars
  const AVATAR_COLORS = ["#2f5bea", "#7c3aed", "#0ea5e9", "#16a34a", "#f97316", "#e11d48", "#0f766e", "#9333ea"];
  function initials(name) {
    return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
  }
  function colorFor(key) {
    let h = 0;
    for (const ch of String(key || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }
  function avatar(person, size) {
    const p = person || {};
    const s = size || 40;
    if (p.character && window.L1_Characters) {
      const art = window.L1_Characters.svg(p.character);
      if (art) return `<span class="l1-avatar" style="width:${s}px;height:${s}px;background:#fff">${art}</span>`;
    }
    const ini = html(initials(p.name || `${p.firstName || ""} ${p.lastName || ""}`));
    const img = p.photoUrl
      ? `<img src="${html(p.photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
      : "";
    return `<span class="l1-avatar" style="width:${s}px;height:${s}px;font-size:${Math.round(s * 0.38)}px;background:${colorFor(p.id || p.name)}">${ini}${img ? `<span style="position:absolute;inset:0">${img}</span>` : ""}</span>`;
  }

  // ---------------------------------------------------------------- API
  async function api(path, body) {
    const opts = body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
    const resp = await window.l1Fetch(path, opts);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const err = new Error(data.message || "Server bilan bog'lanishda xatolik.");
      err.status = resp.status;
      throw err;
    }
    return data;
  }

  // ---------------------------------------------------------------- Time
  function countdown(deadline, now) {
    let s = Math.max(0, deadline - (now || Date.now() / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60);
    if (d > 0) return `${d} kun ${h} soat`;
    if (h > 0) return `${h} soat ${m} daqiqa`;
    return `${Math.max(1, m)} daqiqa`;
  }
  function fmtDate(ts) {
    const d = new Date(ts * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
    return `${days[d.getDay()]}, ${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="18" rx="3"/><path d="M9 3.5V6h6V3.5"/><path d="m8.5 13 2.2 2.2L15.5 10.5"/></svg>',
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 5.5c3-1.2 6.2-1 9.5 1 3.3-2 6.5-2.2 9.5-1V19c-3-1.2-6.2-1-9.5 1-3.3-2-6.5-2.2-9.5-1z"/><path d="M12 6.5V20"/></svg>',
    games: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h10a5 5 0 0 1 4.9 6l-.6 3a2.5 2.5 0 0 1-4.3 1.2L15 16H9l-2 2.2A2.5 2.5 0 0 1 2.7 17l-.6-3A5 5 0 0 1 7 8z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="15.5" cy="11.5" r=".6" fill="currentColor"/><circle cx="17.5" cy="13.5" r=".6" fill="currentColor"/></svg>',
    rating: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>',
    fire: '🔥',
  };

  // ---------------------------------------------------------------- Full screen in a normal browser
  // Browsers only allow it after a tap, so the first touch on a phone switches it on (an installed app from the home
  // screen is already full screen, see manifest.webmanifest). If the person leaves full screen themselves it stays off.
  const Fullscreen = {
    wanted: true,
    available() {
      const el = document.documentElement;
      return !TG.inside && !!(el.requestFullscreen || el.webkitRequestFullscreen) && !window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches;
    },
    active() { return !!(document.fullscreenElement || document.webkitFullscreenElement); },
    enter() {
      const el = document.documentElement;
      try {
        const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: "hide" });
        if (p && p.catch) p.catch(() => {});
      } catch (e) { /* not allowed here */ }
    },
    exit() { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} },
    toggle() { this.active() ? this.exit() : this.enter(); },
    init() {
      if (!this.available() || !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) return;
      const first = () => { document.removeEventListener("pointerup", first, true); if (this.wanted && !this.active()) this.enter(); };
      document.addEventListener("pointerup", first, true);
      document.addEventListener("fullscreenchange", () => { if (!this.active()) this.wanted = false; });
    },
  };

  window.L1 = { Theme, TG, Back, Haptic, Sound, Idris, Fx, avatar, initials, api, countdown, fmtDate, ICONS, html, Fullscreen };
  TG.init();
  Fullscreen.init();
})(window);
