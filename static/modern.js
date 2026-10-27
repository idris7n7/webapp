// Level Up — modern layer (pairs with modern.css). Adds the "surprise": confetti, count-up numbers, springy page transitions,
// card tilt, XP ring + level-up screen, streak badge, badges and a mascot reaction bubble.
// It only reads app state (L1_Shell.data.me, L1.Fx, L1.Sound) and wraps a few helpers; if any piece is missing it quietly does nothing.
(function () {
  "use strict";
  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const me = () => (window.L1_Shell && window.L1_Shell.data && window.L1_Shell.data.me) || null;
  // Page watchers run their check at most once a frame, however many changes the page had in it (a game changes it a lot).
  const onceAFrame = (fn) => { let queued = false; return () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fn(); }); }; };
  const uid = () => { try { const u = state.authStudent; return u ? (u.id || u.name) : "anon"; } catch (e) { return "anon"; } };

  // ------------------------------------------------------------------ confetti (canvas, gravity, spin)
  const COLORS = ["#5558ee", "#8b5cf6", "#ec4899", "#fbbf24", "#34d399", "#38bdf8", "#ffffff"];
  function confetti(opts) {
    if (reduce()) return;
    const o = Object.assign({ x: innerWidth / 2, y: innerHeight * 0.35, count: 90, spread: 1, power: 1 }, opts || {});
    const cv = document.createElement("canvas");
    cv.className = "mod-confetti";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    document.body.appendChild(cv);
    const g = cv.getContext("2d");
    g.scale(dpr, dpr);
    const ps = [];
    for (let i = 0; i < o.count; i++) {
      const a = (Math.random() * 2 - 1) * Math.PI * o.spread - Math.PI / 2;
      const v = (5 + Math.random() * 9) * o.power;
      ps.push({ x: o.x, y: o.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 6 + Math.random() * 7, h: 8 + Math.random() * 8, r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4, c: COLORS[i % COLORS.length], round: Math.random() < 0.3, life: 0 });
    }
    let last = performance.now();
    (function frame(now) {
      const dt = Math.min(2, (now - last) / 16.7); last = now;
      g.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const p of ps) {
        p.life += dt; p.vy += 0.32 * dt; p.vx *= 0.992; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        const fade = Math.max(0, 1 - Math.max(0, p.life - 70) / 40);
        if (fade <= 0 || p.y > innerHeight + 30) continue;
        alive++;
        g.save(); g.globalAlpha = fade; g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c;
        if (p.round) { g.beginPath(); g.arc(0, 0, p.w / 2, 0, 6.28); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        g.restore();
      }
      if (alive) requestAnimationFrame(frame); else cv.remove();
    })(last);
  }

  // ------------------------------------------------------------------ mascot bubble (Shakespeare reacts)
  let bubbleAt = 0;
  const CHEER = ["Barakalla!", "Ofarin!", "Zo'r ketyapsiz!", "Mana bu — bilim!", "Davom eting!"];
  const OOPS = ["Hechqisi yo'q!", "Yana bir urinib ko'ring!", "Xato — bu o'rganish!"];
  function bubble(kind) {
    const now = Date.now();
    if (now - bubbleAt < 7000 || reduce()) return;
    bubbleAt = now;
    const list = kind === "right" ? CHEER : OOPS;
    const el = document.createElement("div");
    el.className = "mod-bubble";
    el.innerHTML = `<span>${list[Math.floor(Math.random() * list.length)]}</span><img alt="" src="/static/shakespeare/shakespeare-${kind === "right" ? "celebrate" : "thinking"}.webp">`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  // ------------------------------------------------------------------ wrap the existing feedback helpers
  function wrapFx() {
    const L1 = window.L1;
    if (!L1 || !L1.Fx || L1.Fx.__mod) return;
    L1.Fx.__mod = true;
    const flash = L1.Fx.flash;
    L1.Fx.flash = function (kind) {
      flash.apply(this, arguments);
      if (kind === "right") { confetti({ count: 46, power: 0.8, spread: 0.55, y: innerHeight * 0.55 }); bubble("right"); }
      else { document.body.classList.remove("mod-quake"); void document.body.offsetWidth; document.body.classList.add("mod-quake"); setTimeout(() => document.body.classList.remove("mod-quake"), 450); bubble("wrong"); }
    };
    L1.Fx.confetti = function (fromEl) {
      const r = fromEl ? fromEl.getBoundingClientRect() : null;
      confetti(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, count: 70 } : { count: 110 });
    };
    L1.Fx.bigConfetti = () => { confetti({ x: innerWidth * 0.2, y: innerHeight * 0.7, count: 80, spread: 0.45 }); confetti({ x: innerWidth * 0.8, y: innerHeight * 0.7, count: 80, spread: 0.45 }); confetti({ count: 120 }); };
  }

  // ------------------------------------------------------------------ card tilt (pointer) — hero, city, game tiles
  function initTilt() {
    const SEL = ".hm-game, .hm-city, .hm-hero";
    let cur = null;
    document.addEventListener("pointermove", (e) => {
      if (reduce() || e.pointerType === "touch") return;
      const el = e.target.closest && e.target.closest(SEL);
      if (cur && cur !== el) { cur.classList.remove("is-tilting"); cur.style.setProperty("--rx", "0deg"); cur.style.setProperty("--ry", "0deg"); }
      cur = el;
      if (!el) return;
      el.classList.add("mod-tilt", "is-tilting");
      const r = el.getBoundingClientRect();
      el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 12 + "deg");
      el.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 12 + "deg");
    }, { passive: true });
    document.addEventListener("pointerleave", () => { if (cur) { cur.style.setProperty("--rx", "0deg"); cur.style.setProperty("--ry", "0deg"); cur = null; } }, true);
  }

  // ------------------------------------------------------------------ staggered entrance
  // Only the first time a tab is opened in this visit. No View Transition: it froze the whole screen into a picture and
  // faded it, so every tab switch looked like the page was reloading (and it was slow on phones).
  const seenTabs = new Set();
  function wrapShell() {
    const S = window.L1_Shell;
    if (!S || S.__mod) return !!S;
    S.__mod = true;
    seenTabs.add(S.tab);
    const go = S.go;
    S.go = function (tab) {
      const first = tab !== S.tab && !seenTabs.has(tab);
      const r = go.apply(this, arguments);
      seenTabs.add(S.tab);
      if (first) enter();
      return r;
    };
    return true;
  }
  let enterTimer = 0;
  function enter() {
    document.body.classList.add("mod-enter");
    clearTimeout(enterTimer);
    enterTimer = setTimeout(() => document.body.classList.remove("mod-enter"), 700);
  }

  // ------------------------------------------------------------------ count-up numbers
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  function countTo(el, to, from, ms) {
    if (reduce() || !isFinite(to)) { el.textContent = to; return; }
    const t0 = performance.now();
    el.__counting = true;
    (function step(now) {
      const k = Math.min(1, (now - t0) / (ms || 800));
      el.textContent = Math.round(from + (to - from) * ease(k));
      if (k < 1) requestAnimationFrame(step); else { el.textContent = to; el.__counting = false; }
    })(t0);
  }
  function watchNumbers() {
    // keyed by the number's place, not by the element: a page that is drawn again shows the same numbers without
    // counting them up from 0 again; only a number that really grew counts up
    const seen = new Map();
    const check = (el, i) => {
      if (el.__counting) return;
      const txt = el.textContent.trim();
      if (!/^\d{1,6}$/.test(txt)) return;
      const key = el.id || "sc-big:" + i;
      const to = +txt, prev = seen.get(key);
      seen.set(key, to);
      if (prev === to) return;
      if (prev === undefined && el.id !== "l1BarPointsNum" && to > 0) { countTo(el, to, 0, 900); return; }
      if (prev !== undefined && to > prev) {
        countTo(el, to, prev, 700);
        const pill = el.closest("#l1BarPoints");
        if (pill) { pill.classList.remove("mod-bump"); void pill.offsetWidth; pill.classList.add("mod-bump"); }
      }
    };
    const scan = () => document.querySelectorAll("#l1BarPointsNum, .sc-big").forEach(check);
    new MutationObserver(onceAFrame(scan)).observe(document.body, { childList: true, subtree: true, characterData: true });
    scan();
  }

  // ------------------------------------------------------------------ XP ring, level
  const levelOf = (pts) => Math.floor(Math.sqrt(Math.max(0, pts) / 40)) + 1;
  const levelStart = (l) => 40 * (l - 1) * (l - 1);
  function paintXp() {
    const m = me(), av = $("#l1BarAvatar");
    if (!m || !av) return;
    const pts = m.allPoints || 0, lv = levelOf(pts);
    const frac = (pts - levelStart(lv)) / Math.max(1, levelStart(lv + 1) - levelStart(lv));
    let ring = $(".mod-xp", av);
    if (!ring) {
      av.insertAdjacentHTML("beforeend", `<svg class="mod-xp" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="modXpGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color: rgb(var(--pal-400))"/><stop offset="1" style="stop-color: rgb(var(--pal-600))"/></linearGradient></defs>
        <circle class="t" cx="24" cy="24" r="22"/><circle class="p" cx="24" cy="24" r="22" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg><span class="mod-level"></span>`);
      ring = $(".mod-xp", av);
    }
    // runs every 2 s: only a real change is written, so the page watchers are not woken for nothing
    const chip = $(".mod-level", av), arc = $(".p", ring), off = String(Math.round(1000 - Math.max(20, Math.min(1000, frac * 1000))) / 10);
    if (chip.textContent !== String(lv)) chip.textContent = lv;
    if (arc.style.strokeDashoffset !== off) requestAnimationFrame(() => { arc.style.strokeDashoffset = off; });
    // level-up: first sighting only stores the level, later increases celebrate
    const key = "mod_lvl_" + uid(), saved = parseInt(store.get(key) || "0", 10);
    if (!saved) store.set(key, String(lv));
    else if (lv > saved) { store.set(key, String(lv)); levelUp(lv); }
    // the streak flame in the top bar shows no day count: the number is in the calendar it opens
  }
  function levelUp(lv) {
    if ($(".mod-lvlup")) return;
    let name = "";
    try { name = state.authStudent.firstName || String(state.authStudent.name || "").split(" ")[0]; } catch (e) { /* no name */ }
    const el = document.createElement("div");
    el.className = "mod-lvlup";
    el.setAttribute("role", "dialog");
    el.innerHTML = `<div><div class="mod-lvlup-kicker">Yangi daraja</div><div class="mod-lvlup-num">${lv}</div>
      <div class="mod-lvlup-title">Barakalla${name ? ", " + name.replace(/[<>&]/g, "") : ""}!</div><p>Siz yana bir pog'ona ko'tarildingiz.</p><button type="button">Davom etish</button></div>`;
    document.body.appendChild(el);
    try { window.L1.Sound.finish(); window.L1.Haptic.ok(); } catch (e) { /* no sound */ }
    if (window.L1 && L1.Fx.bigConfetti) L1.Fx.bigConfetti();
    el.querySelector("button").addEventListener("click", () => el.remove());
  }

  // ------------------------------------------------------------------ badges (home) with rarity
  const BADGES = [
    { id: "first", ico: "🌱", name: "Birinchi qadam", r: "bronze", ok: (m) => m.allPoints >= 1 },
    { id: "p100", ico: "⭐", name: "100 ball", r: "silver", ok: (m) => m.allPoints >= 100 },
    { id: "p500", ico: "🏆", name: "500 ball", r: "gold", ok: (m) => m.allPoints >= 500 },
    { id: "p1500", ico: "💎", name: "1500 ball", r: "holo", ok: (m) => m.allPoints >= 1500 },
    { id: "s3", ico: "🔥", name: "3 kun ketma-ket", r: "bronze", ok: (m) => (m.streak || 0) >= 3 },
    { id: "s7", ico: "⚡", name: "7 kun ketma-ket", r: "silver", ok: (m) => (m.streak || 0) >= 7 },
    { id: "s30", ico: "👑", name: "30 kun ketma-ket", r: "gold", ok: (m) => (m.streak || 0) >= 30 },
    { id: "top3", ico: "🚀", name: "Haftaning top-3", r: "holo", ok: (m) => m.weekPoints > 0 && !!m.weekRank && m.weekRank <= 3 },
  ];
  function paintBadges() {
    const m = me(), page = $("#l1Home .l1-page");
    if (!m || !page || $(".mod-badges", page)) return;
    const key = "mod_badges_" + uid();
    let had = []; try { had = JSON.parse(store.get(key) || "null") || null; } catch (e) { had = null; }
    const earned = BADGES.filter((b) => b.ok(m)).map((b) => b.id);
    const fresh = had ? earned.filter((id) => !had.includes(id)) : [];
    store.set(key, JSON.stringify(earned));
    const sec = document.createElement("section");
    sec.className = "hm-card mod-badges";
    sec.innerHTML = `<div class="hm-card-head"><h2>Yutuqlar</h2><span class="hm-count">${earned.length}/${BADGES.length}</span></div>
      <div class="mod-badge-row">${BADGES.map((b) => { const on = earned.includes(b.id);
        return `<div class="mod-badge${on ? "" : " is-locked"}${fresh.includes(b.id) ? " is-new" : ""}" data-rarity="${b.r}"><span class="mod-badge-ico">${on ? b.ico : "🔒"}</span><span class="mod-badge-name">${b.name}</span></div>`; }).join("")}</div>`;
    page.appendChild(sec);
    if (fresh.length) { setTimeout(() => confetti({ count: 80 }), 400); try { window.L1.Sound.finish(); } catch (e) { /* no sound */ } }
  }

  // ------------------------------------------------------------------ boot
  let tries = 0;
  function tick() {
    wrapFx(); wrapShell(); paintXp();
    if (window.L1_Shell && window.L1_Shell.tab === "home") paintBadges();
  }
  function boot() {
    initTilt(); watchNumbers();
    const iv = setInterval(() => { tick(); if (++tries > 8) clearInterval(iv); }, 400);
    setInterval(tick, 2000);
    new MutationObserver(onceAFrame(() => { if (window.L1_Shell && window.L1_Shell.tab === "home") paintBadges(); }))
      .observe(document.body, { childList: true, subtree: true });
    enter();
  }
  window.L1_Modern = { confetti, levelUp, bubble, paintXp };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
