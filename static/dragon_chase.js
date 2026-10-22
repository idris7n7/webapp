// "Idris va Ajdarho" — 60+ FPS side-view 3D Pixar chase game on a 2D canvas.
// Teacher Idris runs to the Level Up school across a side-scrolling world while a hungry dragon
// with a checkered bib — a fork in one hand, a knife in the other — flies after him.
// Both characters use continuous 60+ FPS skeletal articulation of their 3D Pixar sprite parts.
// Scoring and quiz integration use L1_GameKit from games_engine.js.
(function (window) {
  "use strict";
  const Kit = () => window.L1_GameKit;
  const L1 = () => window.L1 || null;

  const WIN_STEPS = 6;
  const MAX_MISTAKES = 4;
  // Normalized horizontal gap (fraction of stage width) between Dragon center and Idris center by mistakes
  const GAP_FRAC = [0.40, 0.31, 0.22, 0.14, 0.04];
  const RIGHT_LEAD = 0.04; // extra gap the dragon falls back for each right answer (it never leaves the screen)
  const BASE_SPEED = 330; // logical px per second at reference height
  const ANSWER_SECONDS = 7; // time allowed for each question (picture questions need a little reading time)
  const SCREAMS = ["YORDAM!", "VOYDOD!", "YORDAM BERING!", "VOYDOD, YORDAM!"];

  const IDRIS_SHEET_SRC = "/static/idris/idris_chase_sheet.webp?v=4";
  const DRAGON_SHEET_SRC = "/static/idris/dragon_chase_sheet.webp?v=4";
  const IDRIS_WAVE_SRC = "/static/idris/idris_wave.webp";
  const IDRIS_POINT_SRC = "/static/idris/idris_pointing.webp";
  const SHOUT_FONT = '"Luckiest Guy", "Fredoka", system-ui, sans-serif';
  const SPEECH_FONT = '"Plus Jakarta Sans", "Fredoka", system-ui, sans-serif';

  // 3D Pixar articulated parts in idris_chase_sheet.webp?v=4 (reference cell = 360px)
  const CELL = 360;
  const IDRIS_PARTS = {
    torso:          { x: 10,  y: 10,  w: 160, h: 160, px: 75,   py: 133 },
    pelvis:         { x: 180, y: 10,  w: 68,  h: 58,  px: 34,   py: 32 },
    thigh:          { x: 260, y: 10,  w: 100, h: 130, px: 50,   py: 28 },
    shin:           { x: 370, y: 10,  w: 100, h: 140, px: 50,   py: 26 },
    shoe:           { x: 480, y: 10,  w: 110, h: 70,  px: 32,   py: 22 },
    uarm:           { x: 600, y: 10,  w: 90,  h: 110, px: 45,   py: 25 },
    farm_fist:      { x: 700, y: 10,  w: 90,  h: 125, px: 45,   py: 25 },
    farm_open:      { x: 800, y: 10,  w: 95,  h: 130, px: 45,   py: 25 },
    thigh_dark:     { x: 260, y: 160, w: 100, h: 130, px: 50,   py: 28 },
    shin_dark:      { x: 370, y: 160, w: 100, h: 140, px: 50,   py: 26 },
    shoe_dark:      { x: 480, y: 160, w: 110, h: 70,  px: 32,   py: 22 },
    uarm_dark:      { x: 600, y: 160, w: 90,  h: 110, px: 45,   py: 25 },
    farm_dark:      { x: 700, y: 160, w: 90,  h: 125, px: 45,   py: 25 },
    farm_open_dark: { x: 800, y: 160, w: 95,  h: 130, px: 45,   py: 25 },
    happy:          { x: 10,  y: 320, w: 79,  h: 88,  px: 52.8, py: 86.0 },
    worried:        { x: 105, y: 320, w: 77,  h: 87,  px: 48.5, py: 85.0 },
    scared:         { x: 200, y: 320, w: 76,  h: 88,  px: 45.4, py: 86.0 },
    crying:         { x: 295, y: 320, w: 78,  h: 88,  px: 37.9, py: 86.0 },
    pained:         { x: 390, y: 320, w: 81,  h: 88,  px: 37.9, py: 86.0 },
    glance:         { x: 490, y: 320, w: 74,  h: 89,  px: 29.8, py: 87.0 },
  };

  // 3D Pixar articulated parts in dragon_chase_sheet.webp?v=4 (reference cell = 512px)
  const D_CELL = 512;
  const DRAGON_PARTS = {
    body_grin:      { x: 0,   y: 0,   w: 512, h: 512, px: 256, py: 256 },
    body_roar:      { x: 0,   y: 512, w: 512, h: 512, px: 256, py: 256 },
    front_wing:     { x: 516, y: 4,   w: 238, h: 224, px: 222, py: 210, ax: 264, ay: 242 },
    back_wing:      { x: 764, y: 4,   w: 92,  h: 196, px: 62,  py: 182, ax: 284, ay: 232 },
    tongue:         { x: 870, y: 4,   w: 44,  h: 48,  px: 0,   py: 0,   ax: 342, ay: 168 },
    tail:           { x: 516, y: 236, w: 176, h: 164, px: 145, py: 124, ax: 165, ay: 308 },
    front_leg:      { x: 700, y: 236, w: 128, h: 160, px: 78,  py: 40,  ax: 174, ay: 340 },
    back_leg:       { x: 840, y: 236, w: 90,  h: 116, px: 48,  py: 28,  ax: 218, ay: 388 },
    knife_arm:      { x: 516, y: 402, w: 130, h: 108, px: 18,  py: 52,  ax: 346, ay: 312 },
    dragon_ko:      { x: 518, y: 516, w: 500, h: 204, px: 250, py: 182 },
    dragon_stuffed: { x: 520, y: 732, w: 270, h: 280, px: 135, py: 140 },
  };

  // Face by lives lost: 0 happy, 1 worried, 2 scared, 3 crying
  const MOODS = ["happy", "worried", "scared", "crying"];
  const LOOK_TIME = 0.78; // one glance over the shoulder, seconds

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const mod = (a, n) => ((a % n) + n) % n;

  // ------------------------------------------------------------------ sounds
  const tone = (f, type, d, delay, g) => {
    const l = L1();
    if (l && l.Sound) l.Sound.tone(f, type, d, delay, g);
  };
  const noise = (dur, delay, gain, kind, f0, f1) => {
    const l = L1();
    if (l && l.Sound) l.Sound.noise(dur, delay, gain, kind, f0, f1);
  };
  const slide = (f0, f1, type, dur, delay, gain) => {
    const l = L1();
    if (l && l.Sound) l.Sound.slide(f0, f1, type, dur, delay, gain);
  };
  const Sfx = {
    // Wind rushing past when Idris sprints
    whoosh() {
      noise(0.36, 0, 0.16, "bandpass", 500, 2600);
    },
    // One running footstep (soft, alternates a little in pitch)
    step() {
      noise(0.06, 0, 0.09, "lowpass", 380 + Math.random() * 160, 120);
    },
    // A wrong answer: the sad "womp, womp, wooomp" of a failing trombone
    oops() {
      slide(330, 294, "sawtooth", 0.26, 0, 0.1);
      slide(294, 262, "sawtooth", 0.26, 0.28, 0.1);
      slide(262, 175, "sawtooth", 0.6, 0.56, 0.11);
      noise(0.9, 0, 0.03, "lowpass", 500, 200);
    },
    // The dragon closes in: three heavy footsteps with a low growl over them
    stomp() {
      [0, 0.2, 0.36].forEach((d) => {
        noise(0.14, d, 0.26, "lowpass", 220, 60);
        slide(78, 36, "sine", 0.2, d, 0.24);
      });
      slide(110, 58, "sawtooth", 0.8, 0.05, 0.07);
      noise(0.7, 0.05, 0.09, "bandpass", 320, 140);
    },
    // Idris stumbles over the rock
    stumble() {
      noise(0.07, 0, 0.14, "highpass", 1600);
      slide(360, 150, "triangle", 0.2, 0.04, 0.12);
    },
    // The dragon's final leap at Idris
    lunge() {
      slide(120, 460, "sawtooth", 0.28, 0, 0.1);
      noise(0.34, 0, 0.16, "bandpass", 500, 1800);
      noise(0.18, 0.3, 0.26, "lowpass", 240, 70);
    },
    // Two big bites and a gulp: the dragon eats Idris
    bite() {
      [0, 0.22].forEach((d) => {
        noise(0.07, d, 0.24, "bandpass", 1500, 700);
        slide(260, 90, "square", 0.09, d, 0.1);
        noise(0.06, d + 0.03, 0.1, "highpass", 3000);
      });
      slide(230, 75, "sine", 0.3, 0.52, 0.2);
      slide(170, 60, "sine", 0.26, 0.74, 0.16);
    },
    // Full dragon, happy rumble after the meal
    rumble() {
      slide(80, 52, "triangle", 0.6, 0, 0.1);
      noise(0.5, 0, 0.05, "lowpass", 200, 80);
    },
    // Heavy landing (the dragon flops down, the eating shakes the ground)
    thump() {
      noise(0.1, 0, 0.2, "lowpass", 260, 90);
      slide(110, 50, "sine", 0.14, 0, 0.16);
    },
    // The dragon hits the school wall: a crash and a cartoon "boing"
    crash() {
      noise(0.35, 0, 0.25, "lowpass", 600, 80);
      slide(220, 45, "sine", 0.4, 0, 0.22);
      slide(520, 260, "triangle", 0.28, 0.12, 0.1);
    },
    // Classroom door slamming shut
    door() {
      noise(0.14, 0, 0.22, "lowpass", 700, 150);
      slide(150, 55, "triangle", 0.16, 0, 0.16);
    },
    // Wing beat
    flap() {
      noise(0.14, 0, 0.07, "lowpass", 700, 220);
    },
    tick() {
      tone(900, "triangle", 0.05, 0, 0.08);
    },
  };

  // Idris screams for help in Uzbek (speech synthesis; falls back to a close voice if no Uzbek one is installed)
  let screamVoice;
  function pickScreamVoice() {
    if (screamVoice !== undefined) return screamVoice;
    const voices = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    if (!voices.length) return null;
    const by = (p) => voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(p));
    screamVoice = by("uz") || by("tr") || by("kk") || by("ru") || null;
    return screamVoice;
  }
  // Off: no Uzbek voice is installed on most phones, so the stand-in voice spoke Uzbek with an English/Turkish
  // accent. The shout still appears on screen; only the recorded Uzbek clips are heard.
  const SPEAK_SCREAMS = false;
  function speakScream(text) {
    if (!SPEAK_SCREAMS) return;
    try {
      const l = L1();
      if (l && l.Sound && l.Sound.muted) return;
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text.replace(/!/g, "").toLowerCase());
      const v = pickScreamVoice();
      u.lang = v ? v.lang : "uz-UZ";
      if (v) u.voice = v;
      u.pitch = 1.6;
      u.rate = 1.2;
      u.volume = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  if (window.speechSynthesis) {
    speechSynthesis.addEventListener &&
      speechSynthesis.addEventListener("voiceschanged", () => {
        screamVoice = undefined;
      });
  }

  // Idris's recorded reactions, one per mistake (escalating from panic to scolding).
  // `start` skips the English lead-in that clips 3 and 4 open with, so only the Uzbek line is heard.
  const ERROR_LINES = [
    { src: "/static/sfx/idris_err1.mp3?v=2", shout: "QOCH BOLLAR! YORDAM!" },
    { src: "/static/sfx/idris_err2.mp3?v=1", shout: "JAVOBDA ADASHMANG!" },
    { src: "/static/sfx/idris_err3.mp3?v=1", shout: "KALLANG BORMI?", start: 3.05 },
    { src: "/static/sfx/idris_err4.mp3?v=1", shout: "SEN ODAM BO'LMAYSAN!", start: 5.0 },
  ];
  const errorClips = [];
  let errorClipPlaying = null;
  // Off: sound effects only, no recorded voice. The shout still shows as text above Idris.
  const PLAY_VOICE_LINES = false;
  function playErrorLine(n) {
    if (!PLAY_VOICE_LINES) return false;
    try {
      const l = L1();
      if (l && l.Sound && l.Sound.muted) return false;
      const line = ERROR_LINES[clamp(n, 1, ERROR_LINES.length) - 1];
      if (errorClipPlaying) errorClipPlaying.pause();
      if (window.speechSynthesis) speechSynthesis.cancel();
      const a = errorClips[n] || (errorClips[n] = new Audio(line.src));
      const start = line.start || 0;
      a.pause();
      if (a.readyState >= 1) a.currentTime = start;
      else { a.addEventListener("loadedmetadata", () => { a.currentTime = start; }, { once: true }); a.load(); }
      errorClipPlaying = a;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      return true;
    } catch (e) {
      return false;
    }
  }
  function errorClipBusy() {
    return !!(errorClipPlaying && !errorClipPlaying.paused && !errorClipPlaying.ended);
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    });
  }

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }

  function drawStar(ctx, cx, cy, r, fill, stroke) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 ? r * 0.44 : r;
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1.5, r * 0.14);
      ctx.stroke();
    }
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  // Draw an articulated part from an atlas around its pivot (p.px, p.py) placed at (dx, dy) in local space
  function drawAtlasPart(ctx, img, p, dx, dy, k, rotRad, sx, sy) {
    ctx.save();
    ctx.translate(dx * k, dy * k);
    if (rotRad) ctx.rotate(rotRad);
    if ((sx !== undefined && sx !== 1) || (sy !== undefined && sy !== 1)) {
      ctx.scale(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy);
    }
    ctx.drawImage(
      img,
      p.x, p.y, p.w, p.h,
      -p.px * k, -p.py * k, p.w * k, p.h * k
    );
    ctx.restore();
  }

  // =========================================================================
  // Side-view scene renderer (60+ FPS continuous skeletal animation)
  // =========================================================================
  const Chase = {
    stage: null,
    canvas: null,
    ctx: null,
    ready: false,
    running: false,
    failed: false,
    last: 0,
    dpr: 1,
    maxDpr: 2,
    w: 800,
    h: 280,
    lay: null,
    inView: true,
    shown: true,
    checkT: 0,
    frameAvg: 16.7,
    slowFrames: 0,
    vigState: null,

    mount() {
      const stage = document.getElementById("dragonStage");
      if (!stage) return Promise.resolve(false);
      this.stage = stage;
      this.canvas = stage.querySelector("canvas");
      this.vigEl = document.getElementById("dragonVignette");
      if (this.ready) {
        this.resize();
        return Promise.resolve(true);
      }
      if (this.loading) return this.loading;
      const note = document.getElementById("dragonLoading");
      if (note) {
        note.textContent = "Sahna yuklanmoqda…";
        note.classList.remove("hidden");
      }
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "Luckiest Guy"').catch(() => {});
      }
      this.loading = (async () => {
        try {
          const [idrisImg, dragonImg, waveImg, pointImg] = await Promise.all([
            loadImage(IDRIS_SHEET_SRC),
            loadImage(DRAGON_SHEET_SRC),
            loadImage(IDRIS_WAVE_SRC).catch(() => null),
            loadImage(IDRIS_POINT_SRC).catch(() => null),
          ]);
          this.idrisSheet = idrisImg;
          this.dragonSheet = dragonImg;
          this.waveImg = waveImg;
          this.pointImg = pointImg || waveImg;
          this.ctx = this.canvas.getContext("2d", { alpha: false });
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = "high";
          this.initWorld();
          this.ready = true;
          if (note) note.classList.add("hidden");
          this.resize();
          if (window.ResizeObserver) {
            new ResizeObserver(() => this.resize()).observe(stage);
          } else {
            window.addEventListener("resize", () => this.resize());
          }
          if (window.IntersectionObserver) {
            new IntersectionObserver((entries) => {
              this.inView = entries[entries.length - 1].isIntersecting;
            }).observe(stage);
          }
          if (!this.running) {
            this.running = true;
            this.last = performance.now();
            requestAnimationFrame((ts) => this.frame(ts));
          }
          return true;
        } catch (e) {
          this.failed = true;
          if (note) {
            note.textContent =
              "Sahnani yuklab bo'lmadi — savollarga javob berishda davom eting.";
          }
          return false;
        } finally {
          this.loading = null;
        }
      })();
      return this.loading;
    },

    initWorld() {
      // Deterministic parallax sky clouds, pebbles, and wildflowers
      this.clouds = [
        { x: 0.08, y: 0.16, s: 1.05, spd: 0.08 },
        { x: 0.34, y: 0.11, s: 0.82, spd: 0.06 },
        { x: 0.62, y: 0.18, s: 1.18, spd: 0.09 },
        { x: 0.88, y: 0.13, s: 0.9, spd: 0.07 },
      ];
      this.pebbles = Array.from({ length: 28 }, (_, i) => ({
        x: i * 48 + ((i * 17) % 29),
        yOff: 14 + ((i * 23) % 28),
        rx: 4 + (i % 5) * 1.6,
        ry: 2.6 + (i % 4) * 1.1,
        shade: i % 3 === 0 ? "#a46a44" : i % 3 === 1 ? "#713f22" : "#b87b52",
      }));
      this.flowers = Array.from({ length: 18 }, (_, i) => ({
        x: i * (1344 / 18) + ((i * 31) % 40),
        color: ["#ff7aa2", "#ffd34d", "#ffffff", "#a78bfa"][i % 4],
        size: 3.5 + (i % 3) * 1.1,
      }));
      this.parts = [];
      this.rocks = [];
      this.cutlery = [];
      this.scroll = 0;
      this.mood = "happy";
      this.lookT = -1;
      this.headX = 0;
      this.headY = 0;
    },

    resize(force) {
      if (!this.ready || !this.stage || !this.canvas) return;
      const r = this.stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(this.maxDpr, window.devicePixelRatio || 1);
      if (!force && this.sky && r.width === this.w && r.height === this.h && dpr === this.dpr) return;
      this.dpr = dpr;
      this.w = r.width;
      this.h = r.height;
      this.lay = null;
      this.canvas.width = Math.round(r.width * dpr);
      this.canvas.height = Math.round(r.height * dpr);
      if (this.ctx) {
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
      }
      this.buildScenery();
      this.render();
    },

    frame(ts) {
      requestAnimationFrame((next) => this.frame(next));
      const ms = ts - this.last;
      this.last = ts;
      const dt = Math.min(0.05, Math.max(0.001, ms / 1000));
      if (!this.ready || !this.stage) return;
      this.checkT -= Math.max(dt, 0.016);
      if (this.checkT <= 0) {
        this.checkT = 0.4;
        this.shown = this.stage.offsetParent !== null;
      }
      if (!this.shown) return;
      if (!this.idle) this.update(dt);
      if (this.inView) {
        this.render();
        this.watchSpeed(ms);
      }
    },

    watchSpeed(ms) {
      if (!(ms > 0) || ms > 250) return;
      this.frameAvg += (ms - this.frameAvg) * 0.05;
      if (this.frameAvg > 28 && this.dpr > 1.35) {
        if (++this.slowFrames > 120) {
          this.maxDpr = Math.max(1.25, this.dpr - 0.5);
          this.slowFrames = 0;
          this.frameAvg = 16.7;
          this.resize(true);
        }
      } else {
        this.slowFrames = 0;
      }
    },

    // -------------------------------------------------------------- events from the quiz
    banner(text, kind) {
      const el = document.getElementById("dragonBanner");
      if (!el) return;
      el.textContent = text;
      el.className = "dc-banner";
      void el.offsetWidth;
      el.className = "dc-banner is-show is-" + kind;
    },

    reset() {
      Object.assign(this, {
        t: 0,
        speed: BASE_SPEED,
        phase: 0,
        dragonPhase: 0,
        mistakes: 0,
        correctSteps: 0,
        gapFrac: null,
        boostT: -1,
        tripT: -1,
        tripPending: false,
        caughtT: -1,
        winT: -1,
        arriveT: -1,
        bonkT: -1,
        onDone: null,
        done: false,
        shake: 0,
        lickT: -1,
        nextLick: 2.2,
        sharpT: -1,
        nextSharp: 4.0,
        lookT: -1,
        nextLook: 2.8,
        shiftX: 0,
        mood: "happy",
        footT: 0,
        fxT: 0,
        burped: false,
        ateBanner: false,
        slammed: false,
        _gulped: false,
        schoolX: 0,
        idrisVisible: true,
        dragonVisible: true,
        checkT: 0,
      });
      this.setVignette("");
      this.parts = [];
      this.rocks = [];
      this.cutlery = [];
      if (errorClipPlaying) errorClipPlaying.pause();
    },

    start() {
      this.idle = false;
      this.reset();
      this.banner("QOCH, IDRIS!", "good");
    },

    right() {
      this.correctSteps = (this.correctSteps || 0) + 1;
      this.boostT = 0;
      this.tripT = -1;
      this.tripPending = false;
      Sfx.whoosh();
      this.banner("TEZROQ!", "good");
      const { groundY, scale } = this.layout();
      const idrisX = this.runnerX();
      for (let i = 0; i < 12; i++) {
        this.spawn("puff", idrisX - 18 * scale, groundY - 6, {
          vx: rnd(-190, -65),
          vy: rnd(-75, -20),
          s0: 8 * scale,
          s1: 24 * scale,
          max: 0.55,
          color: "#f3e3c3",
          world: true,
        });
      }
    },

    wrong(m) {
      this.mistakes = m;
      this.boostT = -1;
      this.lungeUntil = this.t + 1.1; // close in fast, right now
      // Spawn rock slightly ahead on the path; Idris trips at the exact moment his foot reaches it!
      const { groundY, scale } = this.layout();
      const idrisX = this.runnerX();
      this.rocks.push({
        x: idrisX + 64 * scale,
        y: groundY,
        r: 16,
        triggerTrip: true,
      });
      this.tripPending = true;
      this.nextLook = this.t + 1.8;
      this.banner(m >= MAX_MISTAKES ? "USHLADI!" : "VOY, QOQILDI!", "bad");
      this.lickT = 0.001;
      Sfx.stomp();
      // Escalating recorded line for this mistake; falls back to the old synthesized scream if it can't play
      const line = ERROR_LINES[clamp(m, 1, ERROR_LINES.length) - 1];
      const played = playErrorLine(m);
      this.scream(line.shout, played);
    },

    // Idris cries out for help in Uzbek: shouted text above his head plus a spoken voice
    scream(text, silent) {
      const { groundY, scale } = this.layout();
      const msg = text || pick(SCREAMS);
      // Keep the shout below the HUD bar (progress + hearts) at the top of the stage
      this.spawn("word", clamp(this.runnerX(), 150, this.layout().w - 150), Math.max(groundY - 138 * scale, 86), {
        text: msg,
        s0: 16 * scale,
        s1: (msg.length > 16 ? 22 : 30) * scale,
        max: msg.length > 16 ? 1.8 : 1.1,
        vy: -22,
      });
      if (!silent && !errorClipBusy()) speakScream(msg);
    },

    triggerTripImpact(impactX) {
      const { groundY, scale } = this.layout();
      this.tripPending = false;
      this.tripT = 0;
      this.shake = 10;
      Sfx.stumble();
      for (let i = 0; i < 12; i++) {
        this.spawn("puff", impactX + rnd(-8, 28) * scale, groundY - 4, {
          vx: rnd(-60, 85),
          vy: rnd(-95, -25),
          s0: 10 * scale,
          s1: 28 * scale,
          max: 0.75,
          color: "#ead7ad",
          world: true,
        });
      }
      for (let i = 0; i < 6; i++) {
        this.spawn("star", impactX + 18 * scale, groundY - 56 * scale, {
          vx: rnd(-95, 95),
          vy: rnd(-175, -90),
          g: 380,
          s0: 12 * scale,
          s1: 9 * scale,
          spin: rnd(-7, 7),
          max: 0.85,
        });
      }
    },

    caught(onDone) {
      this.onDone = onDone;
      this.caughtT = 0;
      this.tripT = -1;
      this.tripPending = false;
      this.boostT = -1;
      this.nextScream = 0.55;
      this._chomped = false;
      Sfx.lunge();
      this.scream("VOYDOD!");
    },

    win(onDone) {
      this.onDone = onDone;
      this.winT = 0;
      this.boostT = 0;
      const { w } = this.layout();
      this.schoolX = this.runnerX() + Math.max(420, w * 0.72);
    },

    runnerX() {
      return this.layout().idrisX + (this.shiftX || 0);
    },

    layout() {
      if (this.lay) return this.lay;
      const w = this.w || 800;
      const h = this.h || 280;
      const groundH = clamp(Math.round(h * 0.21), 42, 66);
      const groundY = h - groundH;
      const scale = clamp(Math.min(h / 280, w / 470), 0.5, 1.2);
      const idrisX = Math.round(w * (w < 520 ? 0.68 : 0.62));
      this.lay = { w, h, groundH, groundY, scale, idrisX };
      return this.lay;
    },

    setVignette(state) {
      if (state === this.vigState) return;
      this.vigState = state;
      const el = this.vigEl || document.getElementById("dragonVignette");
      if (el) el.className = "dc-vignette" + (state ? " " + state : "");
    },

    spawn(kind, x, y, o) {
      if (this.parts.length > 220) return;
      this.parts.push(
        Object.assign(
          {
            kind,
            x,
            y,
            vx: 0,
            vy: 0,
            g: 0,
            life: 0,
            max: 0.75,
            s0: 10,
            s1: 20,
            rot: 0,
            spin: 0,
            color: "#ffffff",
            text: "",
            world: false,
          },
          o || {}
        )
      );
    },

    // -------------------------------------------------------------- simulation
    update(dt) {
      this.t += dt;
      const t = this.t;
      const { w, groundY, scale } = this.layout();
      // Pull camera slightly left on victory so the entire school + classroom window + speech bubble fit nicely
      const room =
        this.winT >= 0
          ? Math.min(0, w - 12 - 205 * scale - this.layout().idrisX)
          : 0;
      this.shiftX = lerp(this.shiftX || 0, room, Math.min(1, dt * 3.2));
      const idrisX = this.runnerX();

      // Speed control
      let target = BASE_SPEED * scale;
      if (this.boostT >= 0) {
        this.boostT += dt;
        const boostWave =
          Math.min(1, this.boostT / 0.18) *
          (1 - clamp((this.boostT - 1.0) / 1.2, 0, 1));
        target += 340 * scale * boostWave;
        if (this.boostT > 2.2 && this.winT < 0) this.boostT = -1;
      }
      if (this.tripT >= 0) {
        this.tripT += dt;
        target =
          this.tripT < 0.78
            ? 45 * scale
            : lerp(
                45 * scale,
                BASE_SPEED * scale,
                clamp((this.tripT - 0.78) / 0.45, 0, 1)
              );
        if (this.tripT > 1.25) this.tripT = -1;
      }
      if (this.caughtT >= 0) {
        this.caughtT += dt;
        target = lerp(
          BASE_SPEED * scale,
          0,
          clamp(this.caughtT / 0.48, 0, 1)
        );
      }
      if (this.winT >= 0) {
        this.winT += dt;
        target = 440 * scale;
      }
      this.speed = lerp(this.speed, target, Math.min(1, dt * 8.5));
      if (this.caughtT > 0.48 || this.arriveT >= 0) this.speed = 0;

      const move = this.speed * dt;
      this.scroll += move;

      // Advance continuous 60+ FPS skeletal animation phases (radians)
      const normSpd =
        this.arriveT >= 0 && this.arriveT < 0.62
          ? 1.35
          : this.speed / Math.max(0.5, scale * BASE_SPEED);
      const runFreq =
        this.tripT >= 0 && this.tripT < 0.75
          ? 4.2
          : 7.5 + clamp(normSpd, 0, 2.2) * 4.8;
      this.phase += dt * runFreq;

      const flapFreq =
        this.boostT >= 0 || (this.winT >= 0 && this.bonkT < 0) ? 20 : 14;
      const prevFlap = Math.floor(this.dragonPhase / TAU);
      this.dragonPhase += dt * flapFreq;
      if (this.bonkT < 0 && this.caughtT < 0.48 && Math.floor(this.dragonPhase / TAU) !== prevFlap) {
        Sfx.flap();
      }

      this.shake = Math.max(0, this.shake - dt * 26);

      // Face mood based on mistakes / stumble / sprint
      this.mood =
        this.caughtT >= 0
          ? "scared"
          : this.winT >= 0
          ? "happy"
          : this.tripT >= 0 && this.tripT < 0.95
          ? "pained"
          : MOODS[Math.min(this.mistakes, MOODS.length - 1)];

      // Occasional quick glance over the shoulder when dragon is close
      const calm =
        this.tripT < 0 &&
        !this.tripPending &&
        this.boostT < 0 &&
        this.caughtT < 0 &&
        this.winT < 0;
      if (this.lookT >= 0) {
        if (!calm) this.lookT = Math.max(this.lookT, LOOK_TIME - 0.11);
        this.lookT += dt;
        if (this.lookT >= LOOK_TIME) this.lookT = -1;
      } else if (calm && this.mistakes >= 1 && t > this.nextLook) {
        this.lookT = 0;
        this.nextLook = t + LOOK_TIME + rnd(3.2, 5.2) - this.mistakes * 0.5;
      }

      // Scroll rocks & trigger stumble impact at the exact frame Idris's foot hits the rock
      this.rocks = this.rocks.filter((r) => {
        r.x -= move;
        if (r.triggerTrip && r.x <= idrisX + 12 * scale) {
          r.triggerTrip = false;
          this.triggerTripImpact(r.x);
        }
        return r.x > -80;
      });

      // School arrival on win
      if (this.winT >= 0) {
        this.schoolX -= move;
        if (this.arriveT < 0 && this.schoolX <= idrisX + 26 * scale) {
          this.schoolX = idrisX + 26 * scale;
          this.arriveT = 0;
          this.speed = 0;
          this.boostT = -1;
          this.banner("QUTULDI!", "good");
          if (window.L1_Sound) window.L1_Sound.victory();
        }
      }
      if (this.arriveT >= 0) {
        this.arriveT += dt;
        // Idris runs right into the open doorway (0..0.56s), then door slams shut at 0.58s
        if (this.arriveT >= 0.56) this.idrisVisible = false;
        if (this.arriveT >= 0.58 && !this.slammed) {
          this.slammed = true;
          Sfx.door();
        }
      } else {
        this.idrisVisible = !(this.caughtT >= 0.48);
      }

      // Dragon gap & position: every mistake lets the dragon close in, every right answer opens a lead again
      let targetGap = GAP_FRAC[Math.min(this.mistakes, MAX_MISTAKES)];
      if (this.mistakes < MAX_MISTAKES) targetGap += RIGHT_LEAD * Math.min(this.correctSteps || 0, WIN_STEPS);
      // the whole dragon stays on screen: never farther back than its left edge allows
      targetGap = Math.min(targetGap, (idrisX - 110 * scale) / Math.max(300, w * 0.92));
      if (this.caughtT >= 0) targetGap = GAP_FRAC[MAX_MISTAKES];
      if (this.gapFrac == null) this.gapFrac = targetGap + 0.32;
      this.gapFrac +=
        (targetGap - this.gapFrac) *
        Math.min(1, dt * (this.caughtT >= 0 ? 9 : this.t < (this.lungeUntil || 0) ? 16 : 6));

      const minDragonX = 110 * scale;
      let dX = Math.max(
        minDragonX,
        idrisX - this.gapFrac * Math.max(300, w * 0.92)
      );
      if (this.caughtT >= 0) {
        dX = lerp(dX, idrisX - 18 * scale, clamp(this.caughtT / 0.48, 0, 1));
      }
      let dY =
        groundY -
        104 * scale +
        Math.sin(this.dragonPhase * 0.5) * (9 * scale);
      if (this.tripT >= 0) {
        dY += 16 * scale * Math.sin(Math.PI * Math.min(1, this.tripT / 1.25));
      }
      if (this.caughtT >= 0) {
        dY = lerp(dY, groundY - 68 * scale, clamp(this.caughtT / 0.48, 0, 1));
      }
      const eaten = this.caughtT >= 2.4;
      if (eaten) {
        dX = idrisX - 14 * scale;
        dY = groundY - 72 * scale;
      }

      // Dragon crashing into the school wall on victory -> billowing dust cloud (changib) -> knocked out with tongue out
      if (this.arriveT >= 0) {
        const bx = this.schoolX - 24 * scale;
        const wallImpactX = bx - 22 * scale; // Dragon snout hits right against the school wall/door!
        const koGroundX = bx - 52 * scale;   // Where the KO dragon lies flat on the ground in front of the school
        if (this.bonkT < 0) {
          // Keep the chase distance while Idris slips through the door, then lunge at the closing door
          if (this.arriveT < 0.5) {
            this.lungeFromX = dX;
            this.lungeFromY = dY;
          } else {
            const lk = ease((this.arriveT - 0.5) / 0.22);
            dX = lerp(this.lungeFromX == null ? dX : this.lungeFromX, wallImpactX, lk);
            dY = lerp(this.lungeFromY == null ? dY : this.lungeFromY, groundY - 82 * scale, lk);
          }
          if (this.arriveT >= 0.72) {
            this.bonkT = 0;
            this.shake = 15;
            Sfx.crash();
            this.spawn("word", bx + 6 * scale, groundY - 122 * scale, {
              text: "QARS!",
              s0: 15 * scale,
              s1: 32 * scale,
              max: 1.35,
              vy: -26,
            });
            // Big billowing cartoon dust cloud burst ("changib")
            const dustColors = ["#f5ebd6", "#e2d2b5", "#fffbeb", "#cbd5e1", "#fde68a"];
            for (let i = 0; i < 28; i++) {
              const ang = rnd(-Math.PI * 0.92, Math.PI * 0.25);
              const spd = rnd(45, 220) * scale;
              this.spawn(
                "puff",
                bx - rnd(0, 36) * scale,
                groundY - rnd(12, 88) * scale,
                {
                  vx: Math.cos(ang) * spd - 25 * scale,
                  vy: Math.sin(ang) * spd - 20 * scale,
                  s0: rnd(16, 28) * scale,
                  s1: rnd(38, 64) * scale,
                  max: rnd(0.65, 1.15),
                  color: dustColors[i % dustColors.length],
                }
              );
            }
            // Fork and knife fly out of the dragon's hands on impact
            this.cutlery.push(
              {
                kind: "fork",
                x: bx - 10 * scale,
                y: groundY - 72 * scale,
                vx: -215 * scale,
                vy: -190 * scale,
                rot: 0.4,
                spin: -9,
              },
              {
                kind: "knife",
                x: bx + 4 * scale,
                y: groundY - 64 * scale,
                vx: -170 * scale,
                vy: -165 * scale,
                rot: -0.3,
                spin: 8,
              }
            );
            for (let i = 0; i < 8; i++) {
              this.spawn("star", bx - 8 * scale, groundY - 84 * scale, {
                vx: rnd(-130, 90),
                vy: rnd(-180, -65),
                g: 340,
                s0: 13 * scale,
                s1: 9 * scale,
                spin: rnd(-7, 7),
                max: 1.2,
              });
            }
          }
        } else {
          this.bonkT += dt;
          // Settle down onto the ground in front of the school wall
          const settle = ease(clamp(this.bonkT / 0.35, 0, 1));
          dX = lerp(wallImpactX, koGroundX, settle);
          dY = lerp(groundY - 82 * scale, groundY, settle);
          // Spawn a few secondary dust puffs when his belly hits the ground at bonkT ~ 0.22s
          if (this.bonkT >= 0.22 && this.bonkT - dt < 0.22) {
            Sfx.thump();
            for (let i = 0; i < 10; i++) {
              this.spawn(
                "puff",
                koGroundX + rnd(-55, 55) * scale,
                groundY - 4 * scale,
                {
                  vx: rnd(-90, 90) * scale,
                  vy: rnd(-45, -10) * scale,
                  s0: 12 * scale,
                  s1: 28 * scale,
                  max: 0.65,
                  color: "#e2d2b5",
                }
              );
            }
          }
        }
      }

      this.dX = dX;
      this.dY = dY;
      this.dragonVisible = !(this.caughtT >= 0.48 && this.caughtT < 2.4);

      // Dragon idle lip-licking & cutlery sparkles
      if (this.lickT >= 0) {
        this.lickT += dt / 0.85;
        if (this.lickT > 1) this.lickT = -1;
      } else if (t > this.nextLick && this.bonkT < 0 && !eaten) {
        this.lickT = 0;
        this.nextLick = t + 2.4 + Math.random() * 2.4;
      }

      if (this.sharpT >= 0) {
        this.sharpT += dt / 1.0;
        if (Math.random() < dt * 22 && this.bonkT < 0) {
          this.spawn("star", dX + 56 * scale, dY + 8 * scale, {
            vx: rnd(-50, 50),
            vy: rnd(-80, -20),
            g: 180,
            s0: 8 * scale,
            s1: 3 * scale,
            max: 0.4,
          });
        }
        if (this.sharpT > 1) this.sharpT = -1;
      } else if (
        t > this.nextSharp &&
        this.mistakes >= 1 &&
        this.caughtT < 0 &&
        this.winT < 0
      ) {
        this.sharpT = 0;
        this.nextSharp = t + 3.8 + Math.random() * 3 - this.mistakes * 0.5;
      }

      // Sweat (2+ lives lost) and tears streaming back (3 lost) from Idris's head
      const normal = this.caughtT < 0 && this.arriveT < 0 && this.idrisVisible;
      const facing = normal && this.tripT < 0 && this.lookT < 0;
      if (normal && this.mistakes >= 2 && Math.random() < dt * 3.5) {
        this.spawn("drop", this.headX - 10 * scale, this.headY - 18 * scale, {
          vx: rnd(-90, -40),
          vy: rnd(-60, -20),
          g: 320,
          s0: 7 * scale,
          s1: 5 * scale,
          max: 0.55,
        });
      }
      if (facing && this.mood === "crying" && Math.random() < dt * 9) {
        this.spawn("drop", this.headX + 6 * scale, this.headY - 6 * scale, {
          vx: rnd(-150, -90),
          vy: rnd(-40, -5),
          g: 260,
          s0: 4.5 * scale,
          s1: 3 * scale,
          max: 0.5,
          color: "#93dbff",
        });
      }
      // Dragon nostril steam trails BACKWARD in the wind (vx < 0)
      if (this.boostT >= 0.2 && this.winT < 0 && Math.random() < dt * 10) {
        this.spawn("puff", dX + 52 * scale, dY - 26 * scale, {
          vx: rnd(-110, -40) * scale,
          vy: rnd(-65, -25) * scale,
          s0: 7 * scale,
          s1: 22 * scale,
          max: 0.65,
          color: "#cbd5e1",
        });
      }

      // Footstep dust puffs & high-speed wind streaks
      if (
        this.idrisVisible &&
        this.caughtT < 0.48 &&
        !(this.tripT >= 0 && this.tripT < 0.78) &&
        this.arriveT < 0.52
      ) {
        this.footT += dt;
        const stepInterval =
          (0.13 * BASE_SPEED * scale) / Math.max(90, this.speed || BASE_SPEED * scale);
        if (this.footT > stepInterval) {
          this.footT = 0;
          Sfx.step();
          this.spawn("puff", idrisX - 14 * scale, groundY - 4, {
            vx: rnd(-90, -30),
            vy: rnd(-45, -12),
            s0: 7 * scale,
            s1: (18 + (this.boostT >= 0 ? 10 : 0)) * scale,
            max: 0.48,
            color: "#ebd9b4",
            world: true,
          });
        }
      }
      if ((this.boostT >= 0 || this.winT >= 0) && this.arriveT < 0.3) {
        this.fxT += dt;
        if (this.fxT > 0.035) {
          this.fxT = 0;
          this.spawn("streak", w + 40, rnd(28, groundY - 24), {
            vx: -rnd(780, 1100) * scale,
            s0: rnd(45, 95) * scale,
            s1: rnd(45, 95) * scale,
            max: 0.45,
          });
        }
      }

      // Caught dust-cloud brawl & stuffed dragon burp
      if (this.caughtT >= 0.48 && this.caughtT < 2.8) {
        if (this.caughtT < 0.6 && !this._gulped) {
          this._gulped = true;
          Sfx.bite();
        }
        if (this.caughtT >= this.nextScream && this.caughtT < 1.9) {
          this.nextScream = this.caughtT + 0.7;
          this.scream();
        }
        this.fxT += dt;
        if (this.fxT > 0.17 && this.caughtT < 2.3) {
          this.fxT = 0;
          this.shake = 8;
          Sfx.thump();
          this.spawn(
            "word",
            idrisX + rnd(-55, 45) * scale,
            groundY - rnd(95, 145) * scale,
            {
              text: pick(["POW!", "BAM!", "TARS!", "QARS!", "BUM!"]),
              s0: 12 * scale,
              s1: 26 * scale,
              max: 0.6,
              vy: -30,
            }
          );
          this.spawn(
            "star",
            idrisX + rnd(-45, 45) * scale,
            groundY - rnd(45, 110) * scale,
            {
              vx: rnd(-140, 140),
              vy: rnd(-180, -70),
              g: 380,
              s0: 12 * scale,
              s1: 9 * scale,
              spin: rnd(-7, 7),
              max: 0.75,
            }
          );
        }
      } else {
        this._gulped = false;
      }

      if (eaten) {
        if (!this.ateBanner && this.caughtT > 2.55) {
          this.ateBanner = true;
          this.banner("YEB QO'YDI!", "bad");
        }
        if (!this.burped && this.caughtT > 3.05) {
          this.burped = true;
          Sfx.rumble();
          for (let i = 0; i < 7; i++) {
            this.spawn("puff", dX + 42 * scale, dY - 28 * scale, {
              vx: rnd(25, 75),
              vy: rnd(-75, -20),
              s0: 8 * scale,
              s1: 26 * scale,
              max: 1.05,
              color: "#bbf7d0",
            });
          }
        }
      }

      // Dropped cutlery physics
      this.cutlery.forEach((c) => {
        c.vy += 480 * scale * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.spin * dt;
        if (c.y > groundY - 4) {
          c.y = groundY - 4;
          c.vx = 0;
          c.vy = 0;
          c.spin = 0;
          c.rot = Math.PI / 2;
        }
      });

      // Update particles in place
      const parts = this.parts;
      let n = 0;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max) continue;
        if (p.world) p.x -= move;
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        parts[n++] = p;
      }
      parts.length = n;

      // Danger vignette
      this.setVignette(
        this.caughtT >= 0
          ? "is-caught"
          : this.mistakes >= MAX_MISTAKES - 1
          ? "is-danger"
          : this.mistakes === 2
          ? "is-warn"
          : ""
      );

      // Trigger end-of-game callback (hold 5.0s on arrival so player sees KO dragon + Teacher Idris speaking in window)
      if (
        !this.done &&
        this.onDone &&
        (this.caughtT > 4.5 || this.arriveT > 5.0)
      ) {
        this.done = true;
        const cb = this.onDone;
        this.onDone = null;
        cb();
      }
    },

    // -------------------------------------------------------------- pre-rendered scenery
    buildScenery() {
      const { w, h, groundH, groundY, scale } = this.layout();
      const dpr = this.dpr;
      const tile = (periodCss, top, height, paint) => {
        const pw = Math.max(1, Math.round(periodCss * dpr));
        const P = pw / dpr;
        const c = makeCanvas(pw, height * dpr + 2);
        const g = c.getContext("2d");
        g.scale(dpr, dpr);
        g.translate(0, -top);
        for (let k = -1; k <= 1; k++) {
          g.save();
          g.translate(k * P, 0);
          paint(g, P);
          g.restore();
        }
        return { c, top };
      };

      // Sky and sun
      const sky = makeCanvas(this.canvas.width, this.canvas.height);
      const s = sky.getContext("2d");
      s.scale(dpr, dpr);
      const skyGrad = s.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, "#7dd3fc");
      skyGrad.addColorStop(0.52, "#bae6fd");
      skyGrad.addColorStop(1, "#fef9c3");
      s.fillStyle = skyGrad;
      s.fillRect(0, 0, w, h);
      const sunX = w * 0.84;
      const sunY = h * 0.18;
      const sunGlow = s.createRadialGradient(
        sunX, sunY, 4 * scale,
        sunX, sunY, 68 * scale
      );
      sunGlow.addColorStop(0, "#fffbeb");
      sunGlow.addColorStop(0.35, "rgba(254, 240, 138, 0.85)");
      sunGlow.addColorStop(1, "rgba(254, 240, 138, 0)");
      s.fillStyle = sunGlow;
      s.beginPath();
      s.arc(sunX, sunY, 68 * scale, 0, TAU);
      s.fill();
      this.sky = sky;

      // Fluffy cloud sprite
      const cs = 1.2 * scale;
      const cloud = makeCanvas(84 * cs * dpr, 58 * cs * dpr);
      const cg = cloud.getContext("2d");
      cg.scale(dpr, dpr);
      cg.translate(21 * cs, 31 * cs);
      cg.fillStyle = "rgba(255, 255, 255, 0.88)";
      cg.beginPath();
      cg.arc(0, 0, 20 * cs, 0, TAU);
      cg.arc(18 * cs, -6 * cs, 25 * cs, 0, TAU);
      cg.arc(38 * cs, 0, 19 * cs, 0, TAU);
      cg.arc(18 * cs, 6 * cs, 18 * cs, 0, TAU);
      cg.fill();
      this.cloudImg = {
        c: cloud,
        ox: -21 * cs,
        oy: -31 * cs,
        w: 84 * cs,
        h: 58 * cs,
        s: 1.2,
      };

      // Distant mountains
      const mh = 136 * scale;
      this.tMount = tile(520 * scale, groundY - mh, mh + 1, (g, P) => {
        const k = P / 520;
        g.fillStyle = "#99cdd8";
        g.beginPath();
        g.moveTo(0, groundY);
        g.lineTo(130 * k, groundY - 115 * scale);
        g.lineTo(270 * k, groundY);
        g.moveTo(210 * k, groundY);
        g.lineTo(370 * k, groundY - 135 * scale);
        g.lineTo(530 * k, groundY);
        g.closePath();
        g.fill();
      });

      // Pine forest silhouettes
      const pines = (baseY, ps, color) => {
        const top = baseY - 70 * ps - 2;
        return tile(28 * 44 * ps, top, baseY + 16 - top, (g, P) => {
          const st = P / 28;
          g.fillStyle = color;
          g.beginPath();
          g.moveTo(0, baseY + 16);
          for (let i = 0; i < 28; i++) {
            const x = i * st;
            const th = (42 + ((i * 19) % 28)) * ps;
            g.lineTo(x, baseY - th * 0.25);
            g.lineTo(x + st * 0.5, baseY - th);
            g.lineTo(x + st, baseY - th * 0.25);
          }
          g.lineTo(P, baseY + 16);
          g.closePath();
          g.fill();
        });
      };
      this.tPine1 = pines(groundY - 12 * scale, scale * 0.82, "#7ab8a0");
      this.tPine2 = pines(groundY - 4 * scale, scale, "#559e83");

      // Rolling hills
      this.tHill = tile(
        380 * scale,
        groundY - 70 * scale,
        70 * scale + 10,
        (g, P) => {
          const grad = g.createLinearGradient(0, groundY - 65 * scale, 0, groundY);
          grad.addColorStop(0, "#4ade80");
          grad.addColorStop(1, "#22c55e");
          g.fillStyle = grad;
          g.beginPath();
          g.moveTo(0, groundY + 10);
          g.lineTo(0, groundY - 14 * scale);
          g.quadraticCurveTo(
            P * 0.25, groundY - 54 * scale,
            P * 0.5, groundY - 18 * scale
          );
          g.quadraticCurveTo(
            P * 0.78, groundY - 68 * scale,
            P, groundY - 14 * scale
          );
          g.lineTo(P, groundY + 10);
          g.closePath();
          g.fill();
        }
      );

      // Wooden fence
      this.tFence = tile(
        78 * scale,
        groundY - 34 * scale,
        34 * scale,
        (g, P) => {
          g.fillStyle = "#d99b52";
          g.fillRect(0, groundY - 26 * scale, P, 4 * scale);
          g.fillRect(0, groundY - 13 * scale, P, 4 * scale);
          g.fillStyle = "#b87936";
          roundedRect(g, 0, groundY - 34 * scale, 8 * scale, 34 * scale, 3 * scale);
          g.fill();
        }
      );

      // Foreground ground cross-section
      const gTop = groundY - 14 * scale;
      this.tGround = tile(1344 * scale, gTop, h - gTop, (g, P) => {
        const k = P / 1344;
        const earth = g.createLinearGradient(0, groundY, 0, h);
        earth.addColorStop(0, "#9c5a30");
        earth.addColorStop(0.35, "#854925");
        earth.addColorStop(1, "#5c3016");
        g.fillStyle = earth;
        g.fillRect(0, groundY, P, groundH);
        this.pebbles.forEach((p) => {
          g.fillStyle = p.shade;
          g.beginPath();
          g.ellipse(
            p.x * k,
            Math.min(h - 6, groundY + p.yOff * scale),
            p.rx * scale,
            p.ry * scale,
            0, 0, TAU
          );
          g.fill();
        });
        const road = g.createLinearGradient(
          0, groundY - 7 * scale,
          0, groundY + 7 * scale
        );
        road.addColorStop(0, "#86efac");
        road.addColorStop(0.45, "#22c55e");
        road.addColorStop(1, "#15803d");
        g.fillStyle = road;
        g.fillRect(0, groundY - 5 * scale, P, 12 * scale);
        const waves = 61;
        const ws = P / waves;
        g.fillStyle = "#16a34a";
        g.beginPath();
        for (let i = 0; i < waves; i++) {
          const cx = i * ws + ws * 0.5;
          g.moveTo(cx + ws * 0.48, groundY + 6 * scale);
          g.arc(cx, groundY + 6 * scale, ws * 0.48, 0, Math.PI);
        }
        g.fill();
        const fy = groundY - 6 * scale;
        this.flowers.forEach((fl) => {
          const fx = fl.x * k;
          g.fillStyle = "#15803d";
          g.fillRect(fx - 1, fy, 2, 6 * scale);
          g.fillStyle = fl.color;
          g.beginPath();
          g.arc(fx, fy, fl.size * scale, 0, TAU);
          g.fill();
        });
      });

      // Speed streak
      const streak = makeCanvas(64, 4);
      const sg = streak.getContext("2d");
      const sgr = sg.createLinearGradient(0, 0, 64, 0);
      sgr.addColorStop(0, "rgba(255,255,255,0)");
      sgr.addColorStop(1, "rgba(255,255,255,0.85)");
      sg.fillStyle = sgr;
      sg.fillRect(0, 0, 64, 4);
      this.streakImg = streak;
    },

    drawTiled(ctx, tl, offset) {
      const pw = tl.c.width;
      const W = this.canvas.width;
      const y = Math.round(tl.top * this.dpr);
      for (let x = -Math.round(mod(offset * this.dpr, pw)); x < W; x += pw) {
        ctx.drawImage(tl.c, x, y);
      }
    },

    // -------------------------------------------------------------- rendering
    render() {
      const ctx = this.ctx;
      if (!ctx || !this.sky) return;
      const { w, groundY, scale } = this.layout();
      const idrisX = this.runnerX();
      const t = this.t || 0;
      const dpr = this.dpr;
      let sx = 0;
      let sy = 0;
      if (this.shake > 0.2) {
        sx = Math.round((Math.random() - 0.5) * this.shake * dpr);
        sy = Math.round((Math.random() - 0.5) * this.shake * dpr);
      }
      const device = () => ctx.setTransform(1, 0, 0, 1, sx, sy);
      const css = () => ctx.setTransform(dpr, 0, 0, dpr, sx, sy);

      // 1. Sky and sun
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(this.sky, 0, 0);

      // 2. Clouds
      css();
      const ci = this.cloudImg;
      this.clouds.forEach((c) => {
        const span = w + 220;
        const cx = mod(c.x * span - this.scroll * c.spd, span) - 110;
        const cy = c.y * groundY;
        const k = c.s / ci.s;
        ctx.drawImage(ci.c, cx + ci.ox * k, cy + ci.oy * k, ci.w * k, ci.h * k);
      });

      // 3-4. Mountains, pines, hills, fence
      device();
      this.drawTiled(ctx, this.tMount, this.scroll * 0.08);
      this.drawTiled(ctx, this.tPine1, this.scroll * 0.16);
      this.drawTiled(ctx, this.tPine2, this.scroll * 0.28);
      this.drawTiled(ctx, this.tHill, this.scroll * 0.42);
      this.drawTiled(ctx, this.tFence, this.scroll * 0.75);

      // 5. Foreground ground
      this.drawTiled(ctx, this.tGround, this.scroll);

      // 6. Rocks, School, Teacher Idris, Dragon, Crash Dust, Cutlery, Particles
      css();
      this.rocks.forEach((rk) => this.drawRock(ctx, rk.x, rk.y - 2, rk.r * scale));
      if (this.winT >= 0) {
        this.drawSchool(ctx, this.schoolX, groundY, scale, t, idrisX);
      } else if (this.idrisVisible) {
        this.drawIdris(ctx, idrisX, groundY, scale);
      }
      if (this.dragonVisible) {
        this.drawDragon(ctx, this.dX, this.dY, groundY, scale, t);
      }
      // Billowing wall-crash dust cloud ("changib") right when dragon hits the school wall
      if (this.bonkT >= 0 && this.bonkT < 0.72) {
        const bx = this.schoolX - 24 * scale;
        this.drawCrashDust(ctx, bx - 18 * scale, groundY - 42 * scale, scale, t, this.bonkT);
      }
      if (this.caughtT >= 0.48 && this.caughtT < 2.45) {
        this.drawBrawl(ctx, idrisX - 8 * scale, groundY - 58 * scale, scale, t);
      }
      this.cutlery.forEach((c) => this.drawCutleryItem(ctx, c, scale));
      this.drawParticles(ctx);
      ctx.globalAlpha = 1;
    },

    drawRock(ctx, x, y, r) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
      ctx.beginPath();
      ctx.ellipse(0, 2, r * 1.15, r * 0.35, 0, 0, TAU);
      ctx.fill();

      const g = ctx.createLinearGradient(-r, -r, r, r * 0.2);
      g.addColorStop(0, "#cbd5e1");
      g.addColorStop(0.55, "#64748b");
      g.addColorStop(1, "#334155");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(-r * 0.75, -r * 0.85);
      ctx.lineTo(r * 0.1, -r * 1.05);
      ctx.lineTo(r * 0.85, -r * 0.65);
      ctx.lineTo(r, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },

    // -------------------------------------------------------------- Teacher Idris (60+ FPS 3D Pixar Skeletal Puppet)
    lookAmount() {
      if (this.lookT < 0) return 0;
      return clamp(
        Math.min(this.lookT / 0.09, (LOOK_TIME - this.lookT) / 0.11),
        0,
        1
      );
    },

    drawIdris(ctx, idrisX, groundY, scale) {
      const img = this.idrisSheet;
      if (!img) return;

      const P = IDRIS_PARTS;
      const ph = this.phase;
      const sprinting = this.boostT >= 0 || (this.winT >= 0 && this.arriveT < 0);
      const stumbling = this.tripT >= 0 && this.tripT < 1.15;

      // Smooth 60 FPS torso lean & vertical bounce
      let torsoLean = sprinting ? 0.18 : 0.05;
      torsoLean += Math.sin(ph * 2) * 0.022;
      let bob = -Math.abs(Math.sin(ph)) * (sprinting ? 4.4 : 3.4) * scale;
      let stumbleAmt = 0;

      if (stumbling) {
        const u = this.tripT / 1.15;
        stumbleAmt =
          u < 0.24
            ? ease(u / 0.24)
            : u < 0.68
            ? 1 + Math.sin((u - 0.24) * 18) * 0.12
            : 1 - ease((u - 0.68) / 0.32);
        torsoLean = 0.06 + stumbleAmt * 0.38;
        bob = stumbleAmt * 11 * scale;
      }

      const size = Math.round(172 * scale);
      const k = size / CELL;

      // Ground contact shadow
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(15, 23, 42, 0.26)";
      ctx.beginPath();
      ctx.ellipse(
        idrisX,
        groundY + 1,
        (stumbling ? 36 : 28 + Math.cos(ph * 2) * 3) * scale,
        7.5 * scale,
        0, 0, TAU
      );
      ctx.fill();

      // Biomechanical 60 FPS joint kinematics in 360x360 design units
      const legStride = sprinting ? 1.04 : 0.92;
      const legAngles = (s, isNear) => {
        let hipA = Math.sin(s) * legStride - 0.18 + 0.12 * Math.cos(2 * s);
        let kneeBend = 0.85 + 0.72 * Math.sin(s - 0.55) + 0.18 * Math.cos(2 * s);
        if (stumbling) {
          if (isNear) {
            hipA = lerp(hipA, 0.52 + Math.sin(this.tripT * 14) * 0.18, stumbleAmt);
            kneeBend = lerp(kneeBend, 1.35, stumbleAmt);
          } else {
            hipA = lerp(hipA, -0.68, stumbleAmt);
            kneeBend = lerp(kneeBend, 0.38, stumbleAmt);
          }
        }
        const kneeA = hipA + Math.max(0.12, kneeBend);
        const ankleA = kneeA * 0.55 - 0.35 * Math.cos(s);
        return [hipA, kneeA, ankleA];
      };

      const armSwing = sprinting ? 0.92 : 0.78;
      const armAngles = (s, isNear) => {
        let shA = Math.sin(s) * armSwing + 0.08;
        // Elbow bend stays moderate so the fist swings up to chest height, not into his face
        let bend = 0.95 + 0.26 * -Math.sin(s);
        if (stumbling) {
          // Reach both arms forward/upward with open hands to catch balance!
          shA = lerp(
            shA,
            (isNear ? -0.95 : -0.72) + Math.sin(this.tripT * 18 + (isNear ? 0 : 1.5)) * 0.22,
            stumbleAmt
          );
          bend = lerp(bend, 0.45, stumbleAmt);
        }
        return [shA, shA - bend];
      };

      const baseY = groundY + 14 * scale + bob;
      ctx.save();
      ctx.translate(idrisX, baseY);

      // Origin in 360x360 space is shifted so hip center (170, 208) is the pivot of torso tilt
      const ox = -180 * k;
      const oy = -360 * k;
      ctx.translate(ox, oy);

      // Helper to rotate upper body around hip (170, 208)
      const cosT = Math.cos(torsoLean);
      const sinT = Math.sin(torsoLean);
      const hipPivotX = 170;
      const hipPivotY = 208;
      const bodyPt = (lx, ly) => {
        const dx = lx - hipPivotX;
        const dy = ly - hipPivotY;
        return [
          hipPivotX + dx * cosT - dy * sinT,
          hipPivotY + dx * sinT + dy * cosT,
        ];
      };

      // 1. Far arm (behind torso)
      const [fShA, fElA] = armAngles(ph, false);
      const shFar = bodyPt(224, 118);
      const fShWorld = fShA + torsoLean;
      const fElWorld = fElA + torsoLean;
      const elFarX = shFar[0] - Math.sin(fShWorld) * 46;
      const elFarY = shFar[1] + Math.cos(fShWorld) * 46;
      drawAtlasPart(ctx, img, P.uarm_dark, shFar[0], shFar[1], k, fShWorld);
      drawAtlasPart(
        ctx,
        img,
        stumbling ? P.farm_open_dark : P.farm_dark,
        elFarX,
        elFarY,
        k,
        fElWorld
      );

      // 2. Pelvis bridge & Far leg (behind near leg)
      drawAtlasPart(ctx, img, P.pelvis, 170, 208, k, torsoLean * 0.5);
      const [fhA, fkA, faA] = legAngles(ph + Math.PI, false);
      const hipFarX = 180;
      const hipFarY = 206;
      const kneeFarX = hipFarX - Math.sin(fhA) * 58;
      const kneeFarY = hipFarY + Math.cos(fhA) * 58;
      const ankleFarX = kneeFarX - Math.sin(fkA) * 80;
      const ankleFarY = kneeFarY + Math.cos(fkA) * 80;
      drawAtlasPart(ctx, img, P.thigh_dark, hipFarX, hipFarY, k, fhA);
      drawAtlasPart(ctx, img, P.shoe_dark, ankleFarX, ankleFarY, k, faA);
      drawAtlasPart(ctx, img, P.shin_dark, kneeFarX, kneeFarY, k, fkA);

      // 3. Near leg
      const [nhA, nkA, naA] = legAngles(ph, true);
      const hipNearX = 170;
      const hipNearY = 208;
      const kneeNearX = hipNearX - Math.sin(nhA) * 58;
      const kneeNearY = hipNearY + Math.cos(nhA) * 58;
      const ankleNearX = kneeNearX - Math.sin(nkA) * 80;
      const ankleNearY = kneeNearY + Math.cos(nkA) * 80;
      drawAtlasPart(ctx, img, P.thigh, hipNearX, hipNearY, k, nhA);
      drawAtlasPart(ctx, img, P.shoe, ankleNearX, ankleNearY, k, naA);
      drawAtlasPart(ctx, img, P.shin, kneeNearX, kneeNearY, k, nkA);

      // 4. Torso (pivoted at hip 170, 208)
      drawAtlasPart(ctx, img, P.torso, hipPivotX, hipPivotY, k, torsoLean);

      // 5. 3D Pixar Head (single opaque head, zero double-ghost overlap!)
      const look = stumbling ? 0 : this.lookAmount();
      const useGlance = look > 0.35;
      const headKey = useGlance ? "glance" : this.mood;
      const hd = P[headKey] || P.happy;
      const neckPt = bodyPt(
        226.8 + (useGlance ? -4 : 0),
        100 + (useGlance ? 4 : 0)
      );
      const headNod =
        torsoLean * 0.65 +
        Math.sin(ph * 2) * 0.032 +
        (useGlance ? -0.06 : 0);
      // Slight horizontal turn compression right as the head turns to glance back
      const turnSquash =
        look > 0 && look < 0.65
          ? 1 - 0.14 * Math.sin((look / 0.65) * Math.PI)
          : 1;
      // (the head is painted after the near arm so a swinging fist can never cover the face)
      const paintHead = () =>
        drawAtlasPart(ctx, img, hd, neckPt[0], neckPt[1], k, headNod, turnSquash, 1);

      // 6. Near arm (in front of torso)
      const [nShA, nElA] = armAngles(ph + Math.PI, true);
      const shNear = bodyPt(164, 110);
      const nShWorld = nShA + torsoLean;
      const nElWorld = nElA + torsoLean;
      const elNearX = shNear[0] - Math.sin(nShWorld) * 46;
      const elNearY = shNear[1] + Math.cos(nShWorld) * 46;
      drawAtlasPart(ctx, img, P.uarm, shNear[0], shNear[1], k, nShWorld);
      drawAtlasPart(
        ctx,
        img,
        stumbling ? P.farm_open : P.farm_fist,
        elNearX,
        elNearY,
        k,
        nElWorld
      );
      paintHead();

      ctx.restore();

      // Track head position in world space for sweat & tear droplets
      this.headX = idrisX + ox + neckPt[0] * k;
      this.headY = baseY + oy + (neckPt[1] - 48) * k;
    },

    // -------------------------------------------------------------- Hungry Dragon (60+ FPS 3D Pixar Skeletal Puppet + Knocked-Out State)
    drawDragon(ctx, dX, dY, groundY, scale, t) {
      const img = this.dragonSheet;
      if (!img) return;
      const D = DRAGON_PARTS;

      const eaten = this.caughtT >= 2.4;
      const knockedOut = this.bonkT >= 0.14;

      // 1. Knocked-out dragon lying flat on the ground with its pink tongue hanging out ("tilini chiqarib yerda yotgan")
      if (knockedOut) {
        const ko = D.dragon_ko;
        const koW = 228 * scale;
        const koH = koW * (ko.h / ko.w);
        const dropBounce =
          this.bonkT < 0.42
            ? Math.sin(((this.bonkT - 0.14) / 0.28) * Math.PI) * 0.08
            : 0;
        const breathe = Math.sin(t * 4.2) * 0.025 + dropBounce;

        // Ground shadow beneath the lying dragon
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
        ctx.beginPath();
        ctx.ellipse(
          dX - 6 * scale,
          groundY + 2 * scale,
          koW * 0.47,
          8.5 * scale,
          0, 0, TAU
        );
        ctx.fill();

        ctx.save();
        ctx.translate(dX, groundY + 4 * scale);
        ctx.scale(1 + breathe * 0.6, 1 - breathe);
        ctx.drawImage(
          img,
          ko.x, ko.y, ko.w, ko.h,
          -koW * 0.52, -koH * 0.92, koW, koH
        );
        ctx.restore();

        // 60 FPS orbiting dizzy stars above the knocked-out dragon's head
        const headCenterX = dX + koW * 0.31;
        const headCenterY = groundY - koH * 0.78;
        for (let i = 0; i < 3; i++) {
          const a = t * 5.2 + (i * TAU) / 3;
          const sx = headCenterX + Math.cos(a) * 24 * scale;
          const sy = headCenterY + Math.sin(a) * 7.5 * scale;
          const sr = (6.5 + Math.sin(a) * 1.5) * scale;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(t * 4 + i);
          drawStar(ctx, 0, 0, sr, "#ffd34d", "#d97706");
          ctx.restore();
        }
        return;
      }

      // 2. Stuffed sitting dragon after eating Idris (3 mistakes)
      if (eaten) {
        const st = D.dragon_stuffed;
        const drawW = 176 * scale;
        const drawH = drawW * (st.h / st.w);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(15, 23, 42, 0.26)";
        ctx.beginPath();
        ctx.ellipse(dX, groundY + 2, 48 * scale, 9 * scale, 0, 0, TAU);
        ctx.fill();

        ctx.save();
        ctx.translate(dX, groundY + 4 * scale);
        const breathe = 1 + Math.sin(t * 5.5) * 0.032;
        ctx.scale(breathe, 2 - breathe);
        ctx.drawImage(
          img,
          st.x, st.y, st.w, st.h,
          -drawW * 0.5, -drawH * 0.95, drawW, drawH
        );
        ctx.restore();
        return;
      }

      // 3. 60+ FPS Flying Articulated 3D Pixar Dragon
      const ph = this.dragonPhase;
      const drawSize = Math.round(188 * scale);
      const k = drawSize / D_CELL;

      const heightFactor = clamp(1 - (groundY - dY) / (210 * scale), 0.42, 1);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(15, 23, 42, 0.24)";
      ctx.beginPath();
      ctx.ellipse(
        dX,
        groundY + 2,
        46 * scale * heightFactor,
        9 * scale * heightFactor,
        0, 0, TAU
      );
      ctx.fill();

      const roaring =
        (this.tripT >= 0 && this.tripT < 1.1) ||
        this.tripPending ||
        this.caughtT >= 0 ||
        (this.arriveT >= 0 && this.bonkT < 0.14) ||
        (this.mistakes >= MAX_MISTAKES - 1 && Math.sin(t * 5) > 0.15);

      ctx.save();
      ctx.translate(dX, dY);
      if (this.bonkT >= 0) {
        // Moment of impact squash against the wall (0 .. 0.14s)
        const q = clamp(1 - this.bonkT * 3.5, 0.5, 1);
        ctx.scale(1 - 0.28 * q, 1 + 0.18 * q);
        ctx.rotate(-0.16 * q);
      } else {
        const pitch =
          Math.sin(ph * 0.5) * 0.04 +
          (roaring ? 0.08 : 0.02);
        ctx.rotate(pitch);
      }

      // Shift origin to top-left of 512x512 dragon design box
      const ox = -drawSize * 0.52;
      const oy = -drawSize * 0.48;
      ctx.translate(ox, oy);

      const flap = Math.sin(ph);
      const flapBack = Math.sin(ph - 0.38);

      // Layer 1: Far wing (behind body)
      const bwRot = -0.22 + 0.44 * flapBack;
      const bwSy = 0.28 + 0.75 * (flapBack * 0.5 + 0.5);
      drawAtlasPart(
        ctx, img, D.back_wing,
        D.back_wing.ax, D.back_wing.ay,
        k, bwRot, 1, bwSy
      );

      // Layer 2: Serpentine tail wave
      const tailRot = Math.sin(ph + 0.85) * 0.21;
      drawAtlasPart(
        ctx, img, D.tail,
        D.tail.ax, D.tail.ay,
        k, tailRot
      );

      // Layer 3: Far hind leg pedaling
      const backLegRot = Math.sin(ph * 0.85) * 0.25;
      drawAtlasPart(
        ctx, img, D.back_leg,
        D.back_leg.ax, D.back_leg.ay,
        k, backLegRot
      );

      // Layer 4: Knife arm chopping / sharpening (hidden once cutlery is dropped!)
      if (this.bonkT < 0) {
        const chopFreq = this.sharpT >= 0 ? ph * 2.4 : ph * 1.1;
        const knifeRot =
          Math.sin(chopFreq) * (this.sharpT >= 0 ? 0.28 : 0.17);
        drawAtlasPart(
          ctx, img, D.knife_arm,
          D.knife_arm.ax, D.knife_arm.ay,
          k, knifeRot
        );
      }

      // Layer 5: Dragon Core Body (grin or wide-open roar)
      const bodyPart = roaring ? D.body_roar : D.body_grin;
      ctx.drawImage(
        img,
        bodyPart.x, bodyPart.y, bodyPart.w, bodyPart.h,
        0, 0, D_CELL * k, D_CELL * k
      );

      // Layer 6: Smooth lip-licking tongue overlay
      if (!roaring && this.lickT >= 0 && this.lickT <= 1) {
        const lickWave = Math.sin(this.lickT * Math.PI);
        drawAtlasPart(
          ctx, img, D.tongue,
          D.tongue.ax - 16 + lickWave * 4,
          D.tongue.ay - 34,
          k,
          (this.lickT - 0.5) * 0.25,
          0.7 + 0.35 * lickWave,
          0.7 + 0.35 * lickWave
        );
      }

      // Layer 7: Near hind leg pedaling (opposite phase to back leg)
      const frontLegRot = -Math.sin(ph * 0.85) * 0.23;
      drawAtlasPart(
        ctx, img, D.front_leg,
        D.front_leg.ax, D.front_leg.ay,
        k, frontLegRot
      );

      // Layer 8: Near wing flapping in 3D
      const fwRot = -0.12 + 0.52 * (1 - (flap * 0.5 + 0.5));
      const fwSy = 0.22 + 0.82 * (flap * 0.5 + 0.5);
      drawAtlasPart(
        ctx, img, D.front_wing,
        D.front_wing.ax, D.front_wing.ay,
        k, fwRot, 1, fwSy
      );

      ctx.restore();
    },

    // Billowing cartoon dust cloud ("changib") when the dragon slams into the school wall
    drawCrashDust(ctx, cx, cy, scale, t, bonkT) {
      const p = clamp(bonkT / 0.72, 0, 1);
      const alpha = p < 0.35 ? clamp(p / 0.08, 0, 1) : 1 - (p - 0.35) / 0.65;
      const expand = 0.65 + ease(p) * 0.75;
      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + t * 3.2;
        const rad = (24 + (i % 3) * 12) * scale * expand;
        const px = cx + Math.cos(a) * rad * 1.25;
        const py = cy + Math.sin(a) * rad * 0.82;
        const pr = (22 + Math.sin(t * 14 + i) * 5) * scale * (1 - p * 0.35);
        ctx.fillStyle =
          i % 3 === 0 ? "#fffbeb" : i % 3 === 1 ? "#f5ebd6" : "#e2d2b5";
        ctx.beginPath();
        ctx.arc(px, py, Math.max(2, pr), 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    },

    // -------------------------------------------------------------- Level Up school + Classroom Window Teacher Scene
    drawSchool(ctx, schoolX, groundY, scale, t, idrisX) {
      const bw = 204 * scale;
      const bh = 148 * scale;
      const bx = schoolX - 24 * scale;
      const by = groundY - bh;

      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
      ctx.beginPath();
      ctx.ellipse(bx + bw * 0.5, groundY + 2, bw * 0.55, 9 * scale, 0, 0, TAU);
      ctx.fill();

      // Flagpole & waving green flag on roof
      const poleX = bx + bw * 0.52;
      const poleTop = by - 58 * scale;
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 3.5 * scale;
      ctx.beginPath();
      ctx.moveTo(poleX, by - 24 * scale);
      ctx.lineTo(poleX, poleTop);
      ctx.stroke();

      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(poleX, poleTop);
      ctx.quadraticCurveTo(
        poleX + 16 * scale,
        poleTop + Math.sin(t * 7) * 5 * scale,
        poleX + 32 * scale,
        poleTop + 6 * scale
      );
      ctx.lineTo(poleX + 32 * scale, poleTop + 20 * scale);
      ctx.quadraticCurveTo(
        poleX + 16 * scale,
        poleTop + 14 * scale + Math.sin(t * 7) * 5 * scale,
        poleX,
        poleTop + 18 * scale
      );
      ctx.closePath();
      ctx.fill();

      // Warm cream wall
      const wallGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      wallGrad.addColorStop(0, "#fffbeb");
      wallGrad.addColorStop(1, "#fde68a");
      ctx.fillStyle = wallGrad;
      roundedRect(ctx, bx, by, bw, bh, 8 * scale);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      // Pitched crimson roof
      const roofGrad = ctx.createLinearGradient(
        bx, by - 38 * scale,
        bx, by + 4 * scale
      );
      roofGrad.addColorStop(0, "#ef4444");
      roofGrad.addColorStop(1, "#b91c1c");
      ctx.fillStyle = roofGrad;
      ctx.beginPath();
      ctx.moveTo(bx - 14 * scale, by + 4 * scale);
      ctx.lineTo(bx + bw * 0.5, by - 38 * scale);
      ctx.lineTo(bx + bw + 14 * scale, by + 4 * scale);
      ctx.closePath();
      ctx.fill();

      // "LEVEL UP" signboard sits in the roof gable, so the classroom speech bubble never covers it
      const sw = 96 * scale;
      const sh = 20 * scale;
      const sx = bx + (bw - sw) * 0.5;
      const sy = by - 15 * scale;
      ctx.fillStyle = "#1d4ed8";
      roundedRect(ctx, sx, sy, sw, sh, 6 * scale);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = `${Math.round(13 * scale)}px ${SHOUT_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("LEVEL UP", sx + sw * 0.5, sy + sh * 0.56);

      // Doorway facing the runner (tall enough for Teacher Idris to run straight through)
      const dw = 56 * scale;
      const dh = 128 * scale;
      const dx = bx + 14 * scale;
      const dy = groundY - dh;
      ctx.fillStyle = "#1e1b4b";
      roundedRect(ctx, dx, dy, dw, dh, 6 * scale);
      ctx.fill();

      // Teacher Idris runs into the open doorway: visible left of the door and inside the door opening only
      if (this.idrisVisible) {
        const entryProgress =
          this.arriveT >= 0 ? clamp(this.arriveT / 0.54, 0, 1) : 0;
        const runnerDrawX = lerp(idrisX, dx + dw * 0.7, entryProgress);
        ctx.save();
        if (this.arriveT >= 0) {
          ctx.beginPath();
          ctx.rect(-50, -50, dx + 50, groundY + 80 * scale);
          roundedRect(ctx, dx, dy, dw, dh + 30 * scale, 6 * scale);
          ctx.clip();
        }
        this.drawIdris(ctx, runnerDrawX, groundY, scale);
        ctx.restore();
      }

      // Wooden door leaf: open while Idris runs in, then slams shut in front of the doorway
      const openRatio =
        this.arriveT < 0.5
          ? 0.16
          : lerp(0.16, 1, ease((this.arriveT - 0.5) / 0.12));
      ctx.fillStyle = "#9a3412";
      roundedRect(ctx, dx, dy, dw * openRatio, dh, 4 * scale);
      ctx.fill();
      if (openRatio > 0.65) {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(
          dx + dw * openRatio - 7 * scale,
          dy + dh * 0.52,
          3.2 * scale,
          0, TAU
        );
        ctx.fill();
      }

      // Illuminated Classroom Window where Teacher Idris starts the lesson with the children
      const wx = bx + 78 * scale;
      const wy = by + 44 * scale;
      const ww = 108 * scale;
      const wh = 68 * scale;
      const inClass = this.arriveT > 0.68;

      // Warm lit classroom background when Idris is inside
      const winGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
      if (inClass) {
        winGrad.addColorStop(0, "#fef3c7");
        winGrad.addColorStop(1, "#fde68a");
      } else {
        winGrad.addColorStop(0, "#bae6fd");
        winGrad.addColorStop(1, "#7dd3fc");
      }
      ctx.fillStyle = winGrad;
      roundedRect(ctx, wx, wy, ww, wh, 6 * scale);
      ctx.fill();

      if (inClass) {
        ctx.save();
        roundedRect(ctx, wx + 2 * scale, wy + 2 * scale, ww - 4 * scale, wh - 4 * scale, 5 * scale);
        ctx.clip();

        // Classroom chalkboard on the left side of the window
        const cbX = wx + 7 * scale;
        const cbY = wy + 9 * scale;
        const cbW = 42 * scale;
        const cbH = 28 * scale;
        ctx.fillStyle = "#14532d";
        roundedRect(ctx, cbX, cbY, cbW, cbH, 3 * scale);
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Chalk writing on the board ("ABC" / "2+2=4")
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.font = `700 ${Math.max(7, Math.round(8.5 * scale))}px ${SPEECH_FONT}`;
        ctx.textAlign = "left";
        ctx.fillText("ABC", cbX + 5 * scale, cbY + 10 * scale);
        ctx.fillText("2+2=4", cbX + 5 * scale, cbY + 21 * scale);

        // 3D Pixar Teacher Idris inside the classroom addressing the children (60 FPS talking & pointing motion)
        const teacherSprite =
          Math.sin(t * 4.5) > -0.2 && this.pointImg
            ? this.pointImg
            : this.waveImg || this.pointImg;
        if (teacherSprite) {
          const talkBob = Math.abs(Math.sin(t * 11)) * 2.4 * scale;
          const talkTilt = Math.sin(t * 7.5) * 0.04;
          const tw = 56 * scale;
          const th = tw * 1.18;
          const tx = wx + ww * 0.67;
          const ty = wy + wh + 6 * scale - talkBob;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(talkTilt);
          ctx.drawImage(teacherSprite, -tw * 0.5, -th, tw, th);
          ctx.restore();
        }

        // Cute classroom children silhouettes (heads & shoulders at the bottom of the window listening to Teacher Idris)
        const kids = [
          { x: wx + 18 * scale, r: 7.5 * scale, hair: "#1e293b", shirt: "#3b82f6", phase: 0 },
          { x: wx + 38 * scale, r: 7.0 * scale, hair: "#451a03", shirt: "#ec4899", phase: 1.7 },
          { x: wx + 56 * scale, r: 6.8 * scale, hair: "#0f172a", shirt: "#10b981", phase: 3.1 },
        ];
        kids.forEach((kd) => {
          const nod = Math.sin(t * 6.5 + kd.phase) * 1.2 * scale;
          const ky = wy + wh - 5 * scale + nod;
          // Shoulders
          ctx.fillStyle = kd.shirt;
          ctx.beginPath();
          ctx.ellipse(kd.x, ky + 7 * scale, kd.r * 1.35, kd.r * 0.95, 0, Math.PI, TAU);
          ctx.fill();
          // Head
          ctx.fillStyle = kd.hair;
          ctx.beginPath();
          ctx.arc(kd.x, ky - 2 * scale, kd.r, 0, TAU);
          ctx.fill();
        });

        ctx.restore();
      } else {
        // Window muntin bars before Idris arrives
        ctx.strokeStyle = "#9a3412";
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(wx + ww * 0.5, wy);
        ctx.lineTo(wx + ww * 0.5, wy + wh);
        ctx.moveTo(wx, wy + wh * 0.5);
        ctx.lineTo(wx + ww, wy + wh * 0.5);
        ctx.stroke();
      }

      // Window frame
      ctx.strokeStyle = "#9a3412";
      ctx.lineWidth = 3.5 * scale;
      roundedRect(ctx, wx, wy, ww, wh, 6 * scale);
      ctx.stroke();

      // Speech bubble from Teacher Idris in the window: "Bolalar, darsni boshlaymiz!"
      if (this.arriveT > 0.85) {
        const pop = ease(clamp((this.arriveT - 0.85) / 0.28, 0, 1));
        const floatY = Math.sin(t * 5) * 1.8 * scale;
        const msg = "Bolalar, darsni boshlaymiz!";
        ctx.save();
        const fontPx = Math.max(10, Math.round(12.5 * scale));
        ctx.font = `800 ${fontPx}px ${SPEECH_FONT}`;
        const textW = ctx.measureText(msg).width;
        const padX = 11 * scale;
        const bubW = textW + padX * 2;
        const bubH = 26 * scale;
        // Position speech bubble right above the classroom window, clamped inside canvas width
        const anchorX = wx + ww * 0.66;
        const anchorY = wy + 6 * scale + floatY;
        const bubX = clamp(
          anchorX - bubW * 0.58,
          8 * scale,
          this.w - bubW - 8 * scale
        );
        const bubY = wy - bubH - 10 * scale + floatY;

        ctx.translate(anchorX, anchorY);
        ctx.scale(pop, pop);
        ctx.translate(-anchorX, -anchorY);

        // Drop shadow
        ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
        roundedRect(ctx, bubX + 2 * scale, bubY + 3 * scale, bubW, bubH, 10 * scale);
        ctx.fill();

        // Bubble body
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2.2 * scale;
        roundedRect(ctx, bubX, bubY, bubW, bubH, 10 * scale);
        ctx.fill();
        ctx.stroke();

        // Pointer tail pointing to Teacher Idris inside the window
        const tailX = clamp(anchorX, bubX + 14 * scale, bubX + bubW - 14 * scale);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(tailX - 6 * scale, bubY + bubH - 1.5 * scale);
        ctx.lineTo(anchorX, anchorY + 2 * scale);
        ctx.lineTo(tailX + 6 * scale, bubY + bubH - 1.5 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(tailX - 6 * scale, bubY + bubH - 1 * scale);
        ctx.lineTo(anchorX, anchorY + 2 * scale);
        ctx.lineTo(tailX + 6 * scale, bubY + bubH - 1 * scale);
        ctx.stroke();

        // Speech text
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(msg, bubX + bubW * 0.5, bubY + bubH * 0.52);
        ctx.restore();
      }

      ctx.restore();
    },

    drawBrawl(ctx, bx, by, scale, t) {
      ctx.globalAlpha =
        this.caughtT < 2.15 ? 1 : clamp(1 - (this.caughtT - 2.15) / 0.3, 0, 1);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU + t * 2.5;
        const rad = (28 + Math.sin(t * 14 + i * 2) * 9) * scale;
        const px = bx + Math.cos(a) * rad * 1.25;
        const py = by + Math.sin(a) * rad * 0.85;
        const pr = (26 + Math.sin(t * 16 + i) * 6) * scale;
        ctx.fillStyle = i % 2 ? "#f5ebd6" : "#e2d2b5";
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },

    drawCutleryItem(ctx, c, scale) {
      const s = scale;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = "#e2e8f0";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = Math.max(1, 1.2 * s);
      roundedRect(ctx, -2.2 * s, 1 * s, 4.4 * s, 15 * s, 2.2 * s);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      if (c.kind === "knife") {
        ctx.moveTo(-2.3 * s, 1.5 * s);
        ctx.lineTo(-2.3 * s, -13 * s);
        ctx.quadraticCurveTo(-1.6 * s, -17 * s, 2.6 * s, -17 * s);
        ctx.lineTo(2.3 * s, 1.5 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.moveTo(-1.2 * s, 1.5 * s);
        ctx.lineTo(-3.6 * s, -6 * s);
        ctx.lineTo(3.6 * s, -6 * s);
        ctx.lineTo(1.2 * s, 1.5 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(-3.6 * s + i * 2.25 * s, -16 * s, 1.2 * s, 10.5 * s);
        }
      }
      ctx.restore();
    },

    drawParticles(ctx) {
      const parts = this.parts;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const k = clamp(p.life / p.max, 0, 1);
        const s = lerp(p.s0, p.s1, p.kind === "word" ? ease(k * 3.5) : k);
        const alpha =
          p.kind === "word" ? (k < 0.72 ? 1 : 1 - (k - 0.72) / 0.28) : 1 - k;
        ctx.globalAlpha = clamp(alpha, 0, 1);

        if (p.kind === "puff") {
          // soft dust: a faint wide halo with a denser core, instead of one hard pale disc
          ctx.fillStyle = p.color || "#ffffff";
          ctx.globalAlpha = clamp(alpha, 0, 1) * 0.28;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = clamp(alpha, 0, 1) * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s * 0.6, 0, TAU);
          ctx.fill();
        } else if (p.kind === "drop") {
          ctx.fillStyle =
            p.color && p.color !== "#ffffff" ? p.color : "#60a5fa";
          ctx.beginPath();
          ctx.arc(p.x, p.y, s * 0.65, 0, TAU);
          ctx.fill();
        } else if (p.kind === "streak") {
          ctx.drawImage(this.streakImg, p.x, p.y, s, 3);
        } else if (p.kind === "star") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          drawStar(ctx, 0, 0, s, "#ffd34d", "#f59e0b");
          ctx.restore();
        } else if (p.kind === "word") {
          ctx.font = `${Math.round(s)}px ${SHOUT_FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#b91c1c";
          ctx.lineWidth = Math.max(3, s * 0.24);
          ctx.strokeText(p.text, p.x, p.y);
          ctx.fillStyle = "#ffd34d";
          ctx.fillText(p.text, p.x, p.y);
        }
      }
      ctx.globalAlpha = 1;
    },
  };

  function typeset(text) {
    return String(text == null ? "" : text)
      .replace(/"([^"]*)"/g, "“$1”")
      .replace(/([A-Za-zÀ-ɏ])'(?=[A-Za-zÀ-ɏ])/g, "$1’");
  }

  const HEART_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.2s-7.6-4.7-10.1-9.6C.3 8.2 2.3 3.8 6.4 3.8c2.3 0 3.9 1.3 5.6 3.4 1.7-2.1 3.3-3.4 5.6-3.4 4.1 0 6.1 4.4 4.5 7.8-2.5 4.9-10.1 9.6-10.1 9.6z"/></svg>';

  // =========================================================================
  // The quiz that drives the chase
  // =========================================================================
  const DragonGame = {
    active: false,
    locked: false,
    mistakes: 0,
    correctCount: 0,
    questions: [],
    currentQIndex: 0,
    tries: [],
    curTries: 0,
    gen: 0,
    timerId: null,
    timeLeft: ANSWER_SECONDS,
    curQ: null,

    // ---- 5-second answer timer
    stopTimer() {
      clearInterval(this.timerId);
      this.timerId = null;
    },

    updateTimer() {
      const bar = document.getElementById("dragonTimerFill");
      const num = document.getElementById("dragonTimerNum");
      const left = Math.max(0, this.timeLeft);
      if (bar) {
        bar.style.width = (left / ANSWER_SECONDS) * 100 + "%";
        bar.style.background = left <= 2 ? "#ef4444" : "#6366f1";
      }
      if (num) num.textContent = Math.ceil(left);
    },

    startTimer(fresh) {
      this.stopTimer();
      if (fresh) this.timeLeft = ANSWER_SECONDS;
      this.updateTimer();
      const gen = this.gen;
      let last = performance.now();
      this.timerId = setInterval(() => {
        if (gen !== this.gen || !this.active || this.locked) return this.stopTimer();
        const now = performance.now();
        const before = Math.ceil(this.timeLeft);
        this.timeLeft -= (now - last) / 1000;
        last = now;
        if (Math.ceil(this.timeLeft) !== before && this.timeLeft > 0 && this.timeLeft <= 3) Sfx.tick();
        this.updateTimer();
        if (this.timeLeft <= 0) this.handleTimeOut();
      }, 100);
    },

    ensureTimerUi() {
      if (document.getElementById("dragonTimerFill")) return;
      const q = document.getElementById("dragonQText");
      if (!q || !q.parentNode) return;
      const wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;align-items:center;gap:8px";
      wrap.innerHTML =
        '<div style="flex:1;height:8px;border-radius:99px;background:#e2e8f0;overflow:hidden"><div id="dragonTimerFill" style="height:100%;width:100%;border-radius:99px;background:#6366f1"></div></div>' +
        '<span id="dragonTimerNum" style="min-width:16px;text-align:right;font-weight:800;font-size:13px;color:var(--l1-muted,#475569)">' + ANSWER_SECONDS + "</span>";
      q.parentNode.insertBefore(wrap, q);
    },

    handleTimeOut() {
      this.stopTimer();
      if (!this.active || this.locked) return;
      const gen = this.gen;
      const K = Kit();
      const q = this.curQ;
      this.lockOptions();
      if (q) {
        document
          .querySelectorAll("#dragonOptionsContainer .l1-opt")
          .forEach((b) => {
            if (K.correct(b.dataset.val, q.a)) b.classList.add("is-right");
          });
      }
      Sfx.oops();
      K.haptic("err");
      this.tries.push(0);
      this.hideQuestion();
      this.registerMistake(gen);
      if (this.active) this.nextAfterMistake(gen, 1000);
    },

    registerMistake(gen) {
      this.mistakes++;
      if (Chase.ready) Chase.wrong(this.mistakes);
      this.renderHud(this.mistakes - 1);
      if (this.mistakes >= MAX_MISTAKES) {
        this.active = false;
        this.stopTimer();
        this.lockOptions();
        setTimeout(() => {
          if (gen !== this.gen) return;
          if (Chase.ready) {
            Chase.caught(() => {
              if (gen === this.gen) this.showResult(false);
            });
          } else {
            this.showResult(false);
          }
        }, 450);
      }
    },

    // Start screen, also where a quit game lands: nothing runs until the student taps "Boshlash".
    showIntro() {
      this.stopTimer();
      this.gen++;
      this.active = false;
      this.locked = false;
      const modal = document.getElementById("dragonResultModal");
      if (modal) modal.classList.add("hidden");
      Chase.reset();
      Chase.idle = true;
      Chase.mount();
      this.mistakes = 0;
      this.correctCount = 0;
      this.renderHud(-1);
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set("dragonQCategory", "Idris va Ajdarho");
      set("dragonQNumber", "");
      set("dragonQText", "Ajdarho Idris ustozni quvmoqda! To'g'ri javob bering — ustoz maktabga yetib boradi.");
      const box = document.getElementById("dragonOptionsContainer");
      if (box) {
        box.innerHTML = '<button type="button" class="l1-btn l1-btn-primary w-full col-span-2" id="dragonStart">▶ Boshlash</button>';
        document.getElementById("dragonStart").addEventListener("click", () => this.init());
      }
    },

    init() {
      const K = Kit();
      this.stopTimer();
      const gen = ++this.gen;
      this.questions = K ? K.getGameQuestions() : [];
      this.mistakes = 0;
      this.correctCount = 0;
      this.currentQIndex = 0;
      this.tries = [];
      this.active = true;
      this.locked = false;
      const modal = document.getElementById("dragonResultModal");
      if (modal) modal.classList.add("hidden");
      Chase.reset();
      Chase.mount().then((ok) => {
        if (ok && gen === this.gen) Chase.start();
      });
      this.renderHud(-1);
      this.renderQuestion();
      const stage = document.getElementById("dragonStage");
      if (stage && stage.offsetParent !== null) {
        stage.scrollIntoView({ block: "start" });
      }
    },

    pause() {
      this.stopTimer();
    },
    resume() {
      if (this.active && !this.locked) this.startTimer(false);
    },

    renderHud(lostIndex) {
      const lives = document.getElementById("dragonLives");
      if (lives) {
        lives.innerHTML = Array.from(
          { length: MAX_MISTAKES },
          (_, i) =>
            `<span class="${i < this.mistakes ? "is-lost" : ""}${
              i === lostIndex ? " is-pop" : ""
            }">${HEART_SVG}</span>`
        ).join("");
      }
      const pct = Math.round((this.correctCount / WIN_STEPS) * 100);
      const fill = document.getElementById("dragonProgressFill");
      const face = document.getElementById("dragonProgressIdris");
      if (fill) fill.style.width = pct + "%";
      if (face) face.style.left = pct + "%";
    },

    renderQuestion() {
      if (!this.active) return;
      const K = Kit();
      if (this.currentQIndex >= this.questions.length) {
        this.questions = K.getGameQuestions();
        this.currentQIndex = 0;
      }
      const q = this.questions[this.currentQIndex];
      this.curQ = q;
      const qc = document.getElementById("dragonQuestionCard");
      if (qc) qc.classList.remove("is-gone");
      this.curTries = 0;
      this.ensureTimerUi();
      const t = document.getElementById("dragonQText");
      const c = document.getElementById("dragonQCategory");
      const n = document.getElementById("dragonQNumber");
      if (t) t.textContent = typeset(q.q);
      K.setQuestionImage(t, q.img);
      if (c) c.textContent = ({ Grammar: "Grammatika", Vocabulary: "Lug'at" })[q.category] || q.category; // Uzbek labels
      if (n) n.textContent = `${this.correctCount + 1} / ${WIN_STEPS}`;
      const box = document.getElementById("dragonOptionsContainer");
      if (box) {
        box.innerHTML = "";
        K.shuffle(q.options || []).forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "l1-opt w-full";
          btn.textContent = typeset(opt);
          btn.dataset.val = opt;
          btn.addEventListener("click", () =>
            this.handleAnswer(opt, q.a, btn)
          );
          box.appendChild(btn);
        });
      }
      this.startTimer(true);
    },

    lockOptions() {
      document
        .querySelectorAll("#dragonOptionsContainer .l1-opt")
        .forEach((b) => (b.disabled = true));
    },

    handleAnswer(selected, spec, btn) {
      if (!this.active || this.locked || btn.disabled) return;
      const K = Kit();
      const gen = this.gen;
      this.curTries++;
      if (K.correct(selected, spec)) {
        this.tries.push(this.curTries);
        this.correctCount++;
        if (window.L1_Sound) window.L1_Sound.correct();
        K.haptic("ok");
        this.stopTimer();
        btn.classList.add("is-right");
        this.lockOptions();
        if (L1())
          L1().Fx.points(btn, "+" + K.POINTS[Math.min(this.curTries, 4) - 1]);
        this.renderHud(-1);
        if (this.correctCount >= WIN_STEPS) {
          this.active = false;
          if (Chase.ready) {
            Chase.win(() => {
              if (gen === this.gen) this.showResult(true);
            });
          } else {
            this.showResult(true);
          }
          return;
        }
        if (Chase.ready) Chase.right();
        this.locked = true;
        setTimeout(() => {
          if (gen !== this.gen) return;
          this.locked = false;
          this.currentQIndex++;
          this.renderQuestion();
        }, 1100);
        return;
      }
      // Wrong: the question is gone at once, the dragon closes in at once, and the next question follows.
      K.haptic("err");
      this.stopTimer();
      this.tries.push(0);
      this.lockOptions();
      this.hideQuestion();
      this.registerMistake(gen);
      if (this.active) this.nextAfterMistake(gen, 1000);
    },

    // The question card vanishes the moment the answer was wrong.
    hideQuestion() {
      const card = document.getElementById("dragonQuestionCard");
      if (card) card.classList.add("is-gone");
    },

    nextAfterMistake(gen, ms) {
      this.locked = true;
      setTimeout(() => {
        if (gen !== this.gen || !this.active) return;
        this.locked = false;
        this.currentQIndex++;
        this.renderQuestion();
      }, ms);
    },

    async showResult(won) {
      this.active = false;
      this.stopTimer();
      const K = Kit();
      const modal = document.getElementById("dragonResultModal");
      const title = document.getElementById("dragonResultTitle");
      const body = document.getElementById("dragonResultBody");
      const btn = document.getElementById("dragonResultBtn");
      const l = L1();
      const pts = this.tries.reduce(
        (s, t) => s + (t ? K.POINTS[Math.min(t, 4) - 1] : 0),
        0
      );
      if (title) {
        title.textContent = won
          ? "G’alaba! Idris ustoz darsni boshladi!"
          : "Ajdarho Idris ustozni yeb qo’ydi!";
      }
      if (body) {
        body.innerHTML = `<div class="space-y-3 text-center">
          <div class="flex justify-center">${
            l
              ? l.Idris.html(
                  won ? "celebrate" : "pointing",
                  150,
                  won ? "is-party" : "is-no"
                )
              : ""
          }</div>
          <p class="text-sm text-slate-700 font-semibold">${
            won
              ? "Ajdarho maktab devoriga urilib, chang ichida tilini chiqarib yiqildi — Idris ustoz esa sinfda: “Bolalar, darsni boshlaymiz!” deb darsni boshladi!"
              : "Xatolarni takrorlab, yana urinib ko’ring — ustozni qutqaring!"
          }</p>
          <div class="rounded-2xl p-3 bg-indigo-50 text-indigo-900 font-bold text-sm">${pts} ball · ${
          this.tries.filter((t) => t === 1).length
        } tasi birinchi urinishda</div>
          <div class="text-xs font-semibold text-slate-500" id="dragonReward">Natija saqlanmoqda…</div>
        </div>`;
      }
      const leave = () => {
        if (modal) modal.classList.add("hidden");
        this.showIntro();
      };
      const closeX = document.getElementById("dragonResultClose");
      if (closeX) closeX.onclick = leave;
      const leaveBtn = document.getElementById("dragonResultLeave");
      if (leaveBtn) leaveBtn.onclick = leave;
      if (btn) {
        btn.textContent = won ? "Yana o’ynash" : "Qaytadan urinish";
        btn.className = "l1-btn l1-btn-primary w-full";
        btn.onclick = () => {
          modal.classList.add("hidden");
          this.init();
        };
      }
      if (modal) modal.classList.remove("hidden");
      if (won && l) setTimeout(() => l.Fx.confetti(body, 36), 300);
      const r = await K.reportGame("dragon", this.tries);
      const el = document.getElementById("dragonReward");
      if (el) {
        el.textContent = r
          ? K.rewardText(r)
          : "Natija faqat shu qurilmada saqlandi.";
      }
    },
  };

  DragonGame.scene = Chase;
  window.L1_DragonGame = DragonGame;
})(window);
