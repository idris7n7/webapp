// Level Up core helpers shared by the app shell, weekly tasks and games:
// Telegram Mini App integration, haptics, sounds, Teacher Idris (3D cut-out), avatars and effects.
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

  // ---------------------------------------------------------------- Teacher Idris
  const POSES = {
    wave: "/static/idris/idris_wave.webp",
    pointing: "/static/idris/idris_pointing.webp",
    thumbsup: "/static/idris/idris_thumbsup.webp",
    celebrate: "/static/idris/idris_celebrate.webp",
  };
  // Moods used by the score reactions map onto the poses.
  const MOOD_POSE = { surprised: "celebrate", praise: "thumbsup", comfort: "wave" };
  Object.values(POSES).forEach((src) => { const i = new Image(); i.src = src; });


  // ---------------------------------------------------------------- Teacher Idris rig (canvas)
  // Every Idris is the same picture drawn on a canvas every frame, so he is never a still photo:
  //   1. life      - he breathes and sways a little (the whole picture, turned about its floor, so no seams)
  //   2. blinking  - a skin-coloured lid sliding over each eye (colour sampled from the picture itself)
  //   3. the part  - the hand / arm / ball that belongs to the situation, cut out along a polygon and turned about its
  //                  joint; the strip it uncovers is filled from the jacket / paper next to it (patches)
  //   4. reactions - a hop (happy / party) or a head shake (no) for a moment, and a cross-fade between poses
  // Coordinates are each picture's own pixels. `eyes` = [x, y, rx, ry, tilt] of the lid ellipse over each eye.
  //   greet = Asosiy (hand waves at the wrist)       book = Vazifalar (lifts and turns the page)
  //   glasses = O'rganish (strokes his jaw)          desk = Mashq qilish (writes)
  //   ball = O'yinlar (the ball spins on his finger)  trophy = Reyting (both arms pump with joy)
  //   wave / pointing / thumbsup / celebrate = the poses used by the task runner and the games
  const wave = (t, f) => Math.sin(t * f);
  const PHOTO_SCENES = {
    greet: {
      w: 0.85, src: "scene_greet_body", hand: "scene_greet_hand", eyes: [[326, 208, 27, 17, 0.06], [431, 200, 27, 17, 0.06]],
      parts: [{ layer: "hand", pivot: [88, 405], move: (t, k) => ({ rot: (0.05 + 0.22 * wave(t, 7)) * k }) }],
    },
    book: {
      w: 0.89, src: "scene_book", eyes: [[333, 208, 27, 17, 0.05], [428, 200, 27, 17, 0.05]],
      parts: [{ // the hand and the page it holds, turned about the wrist
        poly: [[205, 706], [250, 615], [330, 575], [390, 550], [470, 572], [542, 598], [566, 640], [560, 702], [500, 716], [420, 714], [330, 716]],
        pivot: [554, 664],
        move: (t, k) => { const u = (t / 3.2) % 1; return { rot: 0.075 * Math.sin(Math.PI * Math.min(1, u / 0.7)) ** 2 * k }; },
        patches: [{ poly: [[200, 660], [600, 660], [600, 740], [200, 740]], dx: 0, dy: 26 }],
      }],
    },
    glasses: {
      w: 0.76, src: "scene_glasses", // no lids: the glasses frames sit over the eyes
      parts: [{ // hand on the chin + forearm, turned about the elbow so the fingers run along the jaw
        poly: [[246, 346], [302, 336], [352, 358], [376, 390], [372, 432], [352, 468], [322, 528], [282, 570], [214, 646], [160, 724], [138, 796], [52, 806], [42, 740], [112, 636], [166, 540], [178, 468], [184, 400], [214, 358]],
        pivot: [95, 780],
        move: (t, k) => ({ rot: -0.055 * (0.5 - 0.5 * Math.cos(t * 3.1)) * k }),
        patches: [
          { poly: [[290, 330], [390, 330], [390, 396], [290, 396]], dx: 52, dy: 0 }, // jaw skin beside the fingertips
          { poly: [[140, 396], [390, 396], [390, 810], [140, 810]], dx: 0, dy: 150 }, // turtleneck (same black, further down)
        ],
      }],
    },
    desk: {
      w: 1.33, src: "scene_desk", eyes: [[407, 189, 27, 16, 0.05], [495, 184, 27, 16, 0.05]],
      parts: [{ // writing hand with the pen, turned about the wrist
        poly: [[256, 640], [262, 598], [300, 578], [332, 572], [358, 590], [402, 640], [436, 700], [428, 714], [330, 714], [272, 707], [254, 690]],
        pivot: [262, 672],
        move: (t, k) => ({ rot: (0.03 * wave(t, 9) + 0.012 * wave(t, 23)) * k, dx: 5 * wave(t, 1.5) * k }),
        patches: [
          { poly: [[240, 560], [450, 560], [450, 690], [240, 690]], dx: 120, dy: -60 }, // jacket (clear of the chair and the pen)
          { poly: [[240, 690], [330, 690], [330, 730], [240, 730]], dx: -150, dy: 0 }, // desk wood
          { poly: [[330, 690], [450, 690], [450, 730], [330, 730]], dx: 0, dy: 14 }, // paper
        ],
      }],
    },
    ball: {
      w: 1.0, src: "scene_ball", eyes: [[409, 215, 28, 18, 0], [508, 213, 28, 18, 0]],
      parts: [{ circle: [150, 171, 128], pivot: [150, 171], move: (t, k) => ({ rot: t * 9 * (0.6 + 0.4 * k) }) }],
    },
    trophy: {
      w: 1.12, src: "scene_cheer", eyes: [[406, 213, 28, 18, 0], [502, 210, 28, 18, 0]],
      // each arm: piece = what moves (reaches a little into the jacket so the shoulder seam stays covered);
      // hole = what is taken out of the body (the arm itself, over the transparent background)
      parts: [
        {
          poly: [[-20, -20], [245, -20], [245, 330], [302, 388], [268, 470], [252, 555], [-20, 625]],
          hole: [[-20, -20], [245, -20], [245, 330], [278, 380], [245, 470], [228, 560], [-20, 625]],
          pivot: [262, 470],
          move: (t, k) => ({ rot: -0.11 * (0.5 + 0.5 * wave(t, 6.2)) * k }),
        },
        {
          poly: [[600, -20], [920, -20], [920, 720], [690, 692], [672, 570], [645, 440], [600, 330]],
          hole: [[624, -20], [920, -20], [920, 720], [712, 692], [696, 570], [668, 440], [624, 330]],
          pivot: [650, 520],
          move: (t, k) => ({ rot: 0.11 * (0.5 - 0.5 * wave(t, 6.2)) * k }),
        },
      ],
      life: { bounce: 5 },
    },
    // ---- poses (the old stills) ----
    wave: {
      w: 1, src: "idris_wave", eyes: [[240, 160, 26, 17, 0.1], [317, 155, 26, 17, 0.1]],
      parts: [{ // the raised hand, waving about the wrist (its sleeve cuff overlaps the still jacket)
        poly: [[0, 165], [178, 165], [178, 312], [140, 352], [114, 392], [96, 400], [34, 400], [0, 384]],
        hole: [[0, 165], [178, 165], [178, 312], [140, 352], [114, 386], [96, 388], [34, 388], [0, 380]],
        pivot: [66, 390],
        move: (t, k) => ({ rot: (0.06 + 0.14 * wave(t, 6.5)) * k }),
      }],
    },
    pointing: {
      w: 1, src: "idris_pointing", eyes: [[243, 188, 26, 17, 0.04], [335, 184, 26, 17, 0.04]],
      parts: [{ // the raised finger wags about its knuckle
        poly: [[72, 206], [118, 206], [122, 270], [128, 338], [70, 340], [78, 280]],
        hole: [[72, 206], [118, 206], [122, 270], [124, 305], [76, 305], [78, 280]],
        pivot: [98, 322],
        move: (t, k) => ({ rot: (0.02 + 0.09 * Math.sin(t * 5) * (0.5 + 0.5 * Math.sin(t * 1.1))) * k }),
      }],
    },
    thumbsup: { w: 1, src: "idris_thumbsup", eyes: [[243, 188, 26, 17, 0.04], [335, 184, 26, 17, 0.04]], parts: [], life: { bounce: 1.5 } },
    celebrate: { w: 1, src: "idris_celebrate", eyes: [[262, 190, 27, 18, 0.05], [350, 185, 27, 18, 0.05]], parts: [], life: { bounce: 5 } },
  };
  const PIMG = {}, PFAIL = {};
  const preload = (n) => {
    if (PIMG[n]) return;
    PIMG[n] = new Image();
    PIMG[n].onerror = () => { PFAIL[n] = true; };
    PIMG[n].src = `/static/idris/${n}.webp`;
  };
  Object.values(PHOTO_SCENES).forEach((s) => [s.src, s.hand].filter(Boolean).forEach(preload));
  const pReady = (s) => [s.src, s.hand].filter(Boolean).every((n) => PIMG[n].complete && PIMG[n].naturalWidth);
  const pFailed = (s) => [s.src, s.hand].filter(Boolean).some((n) => PFAIL[n]);

  // 0 = open, 1 = shut. A quick blink every few seconds (two uneven rhythms so it never looks mechanical).
  const blinkAt = (t) => {
    const one = (x, P, d) => { const u = ((x % P) + P) % P; return u < d ? Math.sin((u / d) * Math.PI) : 0; };
    return Math.max(one(t, 3.9, 0.17), one(t + 1.7, 5.3, 0.17));
  };
  // The lid is real skin: the cheek just under the eye is copied up over it (soft-edged), so tone and shading match.
  function lids(ctx, s, closure) {
    if (!s.eyes || closure < 0.04) return;
    const img = PIMG[s.src];
    s.eyes.forEach(([x, y, rx, ry, tilt]) => {
      const edge = -ry - 2 + (ry * 2 + 4) * Math.min(1, closure * 1.25); // where the lid has got to, in the eye's frame
      [[1.16, 0.3], [1.07, 0.55], [1, 1]].forEach(([grow, alpha]) => {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(tilt || 0);
        ctx.beginPath(); ctx.ellipse(0, 0, (rx + 1) * grow, (ry + 1) * grow, 0, 0, Math.PI * 2); ctx.clip();
        ctx.beginPath(); ctx.rect(-rx * 2, -ry * 2, rx * 4, edge + ry * 2 + (grow > 1 ? 1 : 0)); ctx.clip();
        ctx.rotate(-(tilt || 0)); ctx.translate(-x, -y); // back to the picture's pixels
        ctx.globalAlpha *= alpha;
        ctx.drawImage(img, 0, -ry * 2.2);
        ctx.restore();
      });
      if (closure > 0.5) { // the lash line along the closed lid
        ctx.save();
        ctx.translate(x, y); ctx.rotate(tilt || 0);
        ctx.globalAlpha *= Math.min(1, (closure - 0.5) * 3);
        ctx.strokeStyle = "rgba(52, 26, 18, .85)"; ctx.lineWidth = Math.max(2.4, ry * 0.2); ctx.lineCap = "round";
        const ly = Math.min(edge, ry * 0.25) - ry * 0.1;
        ctx.beginPath(); ctx.moveTo(-rx * 0.85, ly - ry * 0.1); ctx.quadraticCurveTo(0, ly + ry * 0.55, rx * 0.85, ly - ry * 0.1); ctx.stroke();
        ctx.restore();
      }
    });
  }  function clipShape(ctx, p) {
    ctx.beginPath();
    if (p.circle) ctx.arc(p.circle[0], p.circle[1], p.circle[2], 0, Math.PI * 2);
    else (p.hole || p.poly).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  }
  // Draws one picture, in its own pixels, into the current transform.
  function drawPicture(ctx, s, tt, k, still) {
    const img = PIMG[s.src], iw = img.naturalWidth, ih = img.naturalHeight;
    // 1. the still body, without the moving parts' holes
    ctx.save();
    ctx.beginPath(); ctx.rect(-50, -50, iw + 100, ih + 100);
    s.parts.forEach((p) => { if (p.hole) { p.hole.slice().reverse().forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); } });
    ctx.clip("evenodd");
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    s.parts.forEach((p) => {
      // 2. cover what the part leaves behind with the material next to it
      (p.patches || []).forEach((pt) => {
        ctx.save(); clipShape(ctx, p); ctx.clip();
        ctx.beginPath(); pt.poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
        ctx.drawImage(img, -pt.dx, -pt.dy);
        ctx.restore();
      });
      // 3. the moving part, turned about its joint
      const m = still ? {} : p.move(tt, k);
      ctx.save();
      ctx.translate(p.pivot[0] + (m.dx || 0), p.pivot[1] + (m.dy || 0)); ctx.rotate(m.rot || 0); ctx.translate(-p.pivot[0], -p.pivot[1]);
      if (p.layer) ctx.drawImage(PIMG[s.hand], 0, 0);
      else {
        ctx.beginPath();
        if (p.circle) ctx.arc(p.circle[0], p.circle[1], p.circle[2], 0, Math.PI * 2);
        else p.poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath(); ctx.clip();
        ctx.drawImage(img, 0, 0);
      }
      ctx.restore();
    });
    // 4. eyes
    if (!still) lids(ctx, s, blinkAt(tt));
  }
  // One scene into the canvas box: contain, bottom-centred (the picture sits on the card's floor), with the life motion
  // and the reaction applied to the whole picture about its floor.
  function drawScene(ctx, W, H, dpr, s, tt, k, mood, alpha, still) {
    const img = PIMG[s.src], iw = img.naturalWidth, ih = img.naturalHeight;
    const sc = Math.min(W / iw, H / ih);
    let rot = 0, sx = 1, sy = 1, hop = 0;
    if (!still) {
      const life = s.life || {};
      rot = Math.sin(tt * 1.3) * 0.006;
      sy = 1 + Math.sin(tt * 1.9) * 0.006; sx = 1 - Math.sin(tt * 1.9) * 0.002;
      if (life.bounce) { const b = Math.abs(Math.sin(tt * 3.2)); hop = b * life.bounce; sy += (1 - b) * 0.004; }
      if (mood && mood.age < 1.2) {
        const a = mood.age;
        if (mood.kind === "no") rot += Math.sin(a * 24) * 0.06 * Math.max(0, 1 - a / 0.8);
        else if (mood.kind === "party") { hop += Math.abs(Math.sin(a * Math.PI * 2.2)) * 16 * (1 - a / 1.2); sy += Math.sin(a * 14) * 0.012 * (1 - a / 1.2); }
        else if (a < 0.7) { hop += Math.sin((a / 0.7) * Math.PI) * 12; sy += Math.sin((a / 0.7) * Math.PI) * 0.015; rot += Math.sin(a * 16) * 0.012; }
      }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(W / 2, H); ctx.translate(0, -hop * (H / 160)); ctx.rotate(rot); ctx.scale(sx, sy); ctx.translate(-W / 2, -H);
    ctx.translate((W - iw * sc) / 2, H - ih * sc); ctx.scale(sc, sc);
    const k2 = mood && mood.kind !== "no" && mood.age < 1.2 ? k : 1;
    drawPicture(ctx, s, tt, k2, still);
    ctx.restore();
  }
  function paintPhoto(c, t, now) {
    const box = c.parentNode, W = box.clientWidth, H = box.clientHeight;
    const s = PHOTO_SCENES[box.dataset.photoScene];
    if (!s || !W || !H) return;
    if (pFailed(s)) { fallbackImg(box, s); return; }
    if (!pReady(s)) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const ctx = c.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    if (box.classList.contains("is-party") && !box.dataset.moodAt) { box.dataset.moodAt = String(now); box.dataset.mood = "party"; }
    const at = +box.dataset.moodAt || 0, age = at ? (now - at) / 1000 : 9;
    const mood = at ? { kind: box.dataset.mood || "happy", age } : null;
    const k = 1 + (age < 1.2 ? 0.8 * (1 - age / 1.2) : 0);
    const tt = reduceMotion ? 0 : t + (+box.dataset.t0 || 0);
    const prev = PHOTO_SCENES[box.dataset.prevScene], fade = Math.min(1, (now - (+box.dataset.fadeAt || 0)) / 240);
    drawScene(ctx, W, H, dpr, s, tt, k, mood, 1, reduceMotion);
    if (prev && fade < 1 && pReady(prev)) drawScene(ctx, W, H, dpr, prev, tt, 1, null, 1 - fade, reduceMotion); // the old pose fades out on top
    else if (prev && fade >= 1) delete box.dataset.prevScene;
  }
  // The picture could not load: show a plain image so he never vanishes.
  function fallbackImg(box, s) {
    if (box.dataset.fallback) return;
    box.dataset.fallback = "1";
    const src = POSES[box.dataset.photoScene] || POSES.wave;
    box.innerHTML = `<img src="${src}" alt="Teacher Idris" draggable="false" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom center">`;
  }
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  // One loop for every Idris on the page: only the ones in view are painted, nothing runs in a hidden tab.
  const inView = (c) => {
    if (!c.offsetParent) return false;
    const r = c.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || 800) && r.right > 0 && r.left < (window.innerWidth || 600);
  };
  function photoLoop(now) {
    if (!document.hidden) {
      const t = now / 1000;
      document.querySelectorAll(".idris-photo canvas").forEach((c) => { if (inView(c)) paintPhoto(c, t, now); });
    }
    if (reduceMotion) setTimeout(() => requestAnimationFrame(photoLoop), 400);
    else requestAnimationFrame(photoLoop);
  }
  requestAnimationFrame(photoLoop);
  const photoSceneHtml = (name, size, extraClass) => `<div class="idris idris-photo ${extraClass || ""}" data-photo-scene="${name}" data-t0="${(Math.random() * 6).toFixed(2)}" style="--idris-size:${size || 150}px;--sc-w:${PHOTO_SCENES[name].w}">
        <canvas role="img" aria-label="Teacher Idris"></canvas></div>`;
  const Idris = {
    POSES,
    // Markup for a Teacher Idris figure; `pose` is a pose name, a scene name or a mood; size in px.
    html(pose, size, extraClass) {
      const name = PHOTO_SCENES[pose] ? pose : MOOD_POSE[pose] || "wave";
      return photoSceneHtml(name, size, extraClass);
    },
    // Changes pose (a cross-fade) and plays a reaction: "happy" | "no" | "party" | null.
    react(el, pose, mood) {
      if (!el || !el.dataset.photoScene) return;
      const now = performance.now();
      if (pose && POSES[pose] && POSES[el.dataset.photoScene] && PHOTO_SCENES[pose] && el.dataset.photoScene !== pose) {
        el.dataset.prevScene = el.dataset.photoScene; // only the poses swap; the situation scenes keep their activity
        el.dataset.photoScene = pose;
        el.dataset.fadeAt = String(now);
        el.style.setProperty("--sc-w", PHOTO_SCENES[pose].w);
      }
      if (mood) { el.dataset.mood = mood; el.dataset.moodAt = String(now); }
    },    // Which mood and what to say for a score: `rank` and `points` of the student, `total` students on the board.
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
