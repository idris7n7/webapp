// Level Up app shell: blue app bar, bottom navigation and the Home / Tasks / Rating pages.
// Loaded after the main inline script, so it can wrap updateAuthView / updateStudentViews / L1_Nav.
(function (window, document) {
  "use strict";
  const { Theme, Back, Haptic, Sound, Idris, avatar, api, countdown, fmtDate, ICONS, html } = window.L1;
  const TABS = ["home", "tasks", "learn", "games", "rating"];
  const LEGACY = ["learnContainer", "practiceContainer", "gamesContainer", "dictionaryView", "myProgressView", "exerciseRunnerView"];
  const $ = (id) => document.getElementById(id);

  const Shell = {
    tab: "home",
    data: { assignments: null, board: { week: null, all: null }, me: null, now: Date.now() / 1000 },
    ratingPeriod: "week",
    lastRefresh: 0,
    backToHome: null,
  };
  try { const t = localStorage.getItem("l1_tab_v1"); if (TABS.includes(t)) Shell.tab = t; } catch (e) {}

  const user = () => (typeof state !== "undefined" ? state.authStudent : null);
  const isStudentMode = () => !!user() && state.mode !== "teacher";
  const shk = (size, pose) => (window.L1_Shakespeare ? window.L1_Shakespeare.portrait(size, pose) : "");
  const shkQuote = (mode) => (window.L1_Shakespeare ? window.L1_Shakespeare.quote(mode) : "");
  const firstName = (u) => (u && (u.firstName || String(u.name || "").split(" ")[0])) || "do'stim";

  // ------------------------------------------------------------------ on-screen Back button
  // Goes back one step: close an overlay, leave a lesson / exercise, or return to Asosiy from a tab.
  const shown = (id) => { const el = $(id); return !!el && !el.classList.contains("hidden") && el.offsetParent !== null; };
  const press = (id) => () => { const b = $(id); if (b) b.click(); };
  function backAction() {
    syncGameBack();
    if (Back.stack.some((h) => h !== Shell.backToHome)) return () => Back.pop();
    if (shown("practiceSuiteRunnerArea") && window.L1_PracticeSuite) return () => window.L1_PracticeSuite.backToMenu();
    if (shown("exerciseRunnerView")) return press("btnBackToExercises");
    if (shown("lessonReaderView")) return press("btnBackToLearnUnits");
    if (shown("unitExercisesListContainer")) return press("btnBackToPracticeUnits");
    if (shown("dictionaryView") || shown("myProgressView")) return () => { if (window.L1_Nav && window.L1_Nav.setLearnSub) window.L1_Nav.setLearnSub("grammar"); };
    if (Shell.backToHome) return () => Back.pop();
    return null;
  }
  // A game that is being played is the top-most layer: Back quits it and lands on that game's start screen.
  const GAMES = { millionaire: "L1_Millionaire", dragon: "L1_DragonGame", race: "L1_WordRace", listen: "L1_Listen" };
  function playingGame(anyTab) {
    if ((!anyTab && Shell.tab !== "games") || !window.L1_Nav) return null;
    const g = window[GAMES[window.L1_Nav.currentGameSub]];
    return g && g.active ? g : null;
  }
  function syncGameBack() {
    const playing = !!playingGame();
    if (playing && !Shell.gameBack) {
      Shell.gameBack = Back.push(() => { Shell.gameBack = null; quitGame(); });
    } else if (!playing && Shell.gameBack) {
      Back.remove(Shell.gameBack);
      Shell.gameBack = null;
    }
  }
  function quitGame() {
    if (playingGame(true)) window.L1_Nav.setGameSub(window.L1_Nav.currentGameSub);
    syncBackButton();
  }
  function syncBackButton() {
    syncGameBack();
    const b = $("l1BarBack");
    if (b) b.classList.toggle("hidden", !(isStudentMode() && backAction()));
  }

  // ------------------------------------------------------------------ DOM scaffolding
  function build() {
    const legacyHeader = document.querySelector("body > header");
    if (legacyHeader) legacyHeader.id = "l1LegacyHeader";

    const bar = document.createElement("div");
    bar.id = "l1AppBar";
    bar.className = "hidden";
    bar.innerHTML = `<div class="l1-bar">
      <button type="button" id="l1BarBack" class="l1-icon-btn hidden" aria-label="Orqaga" title="Orqaga"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button type="button" id="l1BarAvatar" aria-label="Profil"></button>
      <div class="l1-hello"><small id="l1BarGreeting">Xush kelibsiz</small><b id="l1BarName">Level Up</b></div>
      <button type="button" id="l1BarStaff" class="l1-pill hidden">Panel</button>
      ${Theme.buttonHtml("", "l1BarTheme")}
      <span id="l1BarStreak" class="l1-pill hidden"></span>
      <button type="button" id="l1BarPoints" class="l1-pill"><span class="l1-coin">★</span><span id="l1BarPointsNum">0</span></button>
    </div>`;
    document.body.insertBefore(bar, document.body.firstChild);
    // Sign-in screen has no app bar: float the day / night switch in the corner instead.
    const authTheme = document.createElement("div");
    authTheme.id = "l1AuthTheme";
    authTheme.innerHTML = Theme.buttonHtml("l1-theme-toggle-plain");
    bar.after(authTheme);
    Theme.bind(authTheme);
    Theme.bind(bar);
    $("l1BarAvatar").addEventListener("click", openProfile);
    $("l1BarBack").addEventListener("click", () => { Haptic.tap(); const go = backAction(); if (go) go(); setTimeout(syncBackButton, 120); });
    setInterval(syncBackButton, 400);
    $("l1BarPoints").addEventListener("click", () => Shell.go("rating"));
    $("l1BarStaff").addEventListener("click", () => { const b = $("btnModeToggle"); if (b) b.click(); });

    const nav = document.createElement("nav");
    nav.id = "l1BottomNav";
    nav.className = "hidden";
    const labels = { home: "Asosiy", tasks: "Vazifalar", learn: "O'rganish", games: "O'yinlar", rating: "Reyting" };
    nav.innerHTML = `<div class="l1-nav">${TABS.map((t) =>
      `<button type="button" data-tab="${t}" aria-label="${labels[t]}">${ICONS[t]}<span>${labels[t]}</span>${t === "tasks" ? '<i class="l1-badge-dot hidden" id="l1TasksDot"></i>' : ""}</button>`).join("")}</div>`;
    document.body.appendChild(nav);
    nav.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { Haptic.tap(); Shell.go(b.dataset.tab); }));

    const host = $("studentMainSections");
    if (host) {
      const switcher = host.querySelector(":scope > div");
      if (switcher) switcher.id = "mainModeSwitcher";
      const pages = document.createElement("div");
      pages.innerHTML = `<section id="l1Home" class="hidden space-y-4"></section>
        <section id="l1Tasks" class="hidden space-y-4"></section>
        <section id="l1Rating" class="hidden space-y-4"></section>`;
      while (pages.firstChild) host.insertBefore(pages.firstChild, host.firstChild);
    }
  }

  // ------------------------------------------------------------------ navigation
  function setPageVisibility() {
    const tab = Shell.tab;
    ["home", "tasks", "rating"].forEach((t) => {
      const el = $("l1" + t[0].toUpperCase() + t.slice(1));
      if (el) el.classList.toggle("hidden", t !== tab);
    });
    const switcher = $("mainModeSwitcher");
    if (switcher) switcher.classList.toggle("hidden", tab !== "learn");
    if (tab !== "learn" && tab !== "games") LEGACY.forEach((id) => { const el = $(id); if (el) el.classList.add("hidden"); });
    document.querySelectorAll("#l1BottomNav button").forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));
  }

  Shell.go = function (tab, opts) {
    if (!TABS.includes(tab)) tab = "home";
    const prev = Shell.tab;
    Shell.tab = tab;
    try { localStorage.setItem("l1_tab_v1", tab); } catch (e) {}
    if (prev === "games" && tab !== "games") {
      quitGame(); // a game must not keep running behind another tab
      if (window.L1_Games) window.L1_Games.pauseAll();
    }
    if (tab === "learn") origSetMode(state.mainSection === "practice" ? "practice" : "learn");
    else if (tab === "games") origSetMode("games");
    setPageVisibility();

    if (tab !== "home" && !Shell.backToHome) Shell.backToHome = Back.push(() => { Shell.backToHome = null; Shell.go("home"); });
    if (tab === "home" && Shell.backToHome) { Back.remove(Shell.backToHome); Shell.backToHome = null; }

    if (tab === "home") renderHome();
    if (tab === "tasks") renderTasks();
    if (tab === "rating") renderRating();
    if (!(opts && opts.keepScroll)) window.scrollTo(0, 0);
    if (["home", "tasks", "rating"].includes(tab) && Date.now() - Shell.lastRefresh > 20000) Shell.refresh();
  };

  // ------------------------------------------------------------------ wrapping the legacy app
  let origSetMode = () => {};
  function wrapLegacy() {
    if (window.L1_Nav) {
      const setMode = window.L1_Nav.setMode.bind(window.L1_Nav);
      origSetMode = setMode;
      window.L1_Nav.setMode = function (mode) {
        // updateStudentViews() re-applies the Learn mode on every refresh; only honour it inside the Learn tab.
        if (Shell.suppressNav && Shell.tab !== "learn") return;
        Shell.tab = mode === "games" ? "games" : "learn";
        setMode(mode);
        setPageVisibility();
      };
    }
    const origUpdateStudentViews = window.updateStudentViews;
    if (typeof origUpdateStudentViews === "function") {
      window.updateStudentViews = function () {
        Shell.suppressNav = true;
        try { return origUpdateStudentViews.apply(this, arguments); }
        finally { Shell.suppressNav = false; if (Shell.tab !== "learn") setPageVisibility(); }
      };
    }
    const origUpdateAuthView = window.updateAuthView;
    if (typeof origUpdateAuthView === "function") {
      window.updateAuthView = function () {
        const r = origUpdateAuthView.apply(this, arguments);
        Shell.sync();
        return r;
      };
    }
    // The workbook runner lives in the Learn tab.
    const origOpenRunner = window.openExerciseRunner;
    if (typeof origOpenRunner === "function") {
      window.openExerciseRunner = function () {
        if (Shell.tab !== "learn") { Shell.tab = "learn"; setPageVisibility(); }
        return origOpenRunner.apply(this, arguments);
      };
    }
  }

  // Called after every auth/mode change.
  Shell.sync = function () {
    const u = user();
    const bar = $("l1AppBar");
    const nav = $("l1BottomNav");
    if (!u) {
      bar.classList.add("hidden");
      nav.classList.add("hidden");
      document.body.classList.remove("l1-has-nav");
      return;
    }
    bar.classList.remove("hidden");
    const staff = typeof isStaffRole === "function" && isStaffRole(u.role);
    $("l1BarStaff").classList.toggle("hidden", !staff);
    $("l1BarStaff").textContent = state.mode === "teacher" ? "🎓 Talaba" : "🛠 Panel";
    renderBar();
    if (isStudentMode()) {
      nav.classList.remove("hidden");
      document.body.classList.add("l1-has-nav");
      Shell.go(Shell.tab, { keepScroll: true });
    } else {
      nav.classList.add("hidden");
      document.body.classList.remove("l1-has-nav");
      if (window.L1_Tasks) window.L1_Tasks.renderTeacher();
    }
    if (Date.now() - Shell.lastRefresh > 5000) Shell.refresh();
    if (isStudentMode()) ensureLevelChosen(); else closeLevelGate();
  };

  // ------------------------------------------------------------------ CEFR level gate (before entering the platform)
  const CEFR = [
    ["A1", "Beginner"], ["A2", "Elementary"], ["A2+", "Elementary+"],
    ["B1", "Intermediate"], ["B1+", "Intermediate+"], ["B2", "Upper-Int."],
    ["B2+", "Upper-Int.+"], ["C1", "Advanced"], ["C2", "Proficiency"],
  ];
  const levelKey = (u) => `l1_cefr_level_${u.id || u.name}`;
  function storedLevel(u) { try { return localStorage.getItem(levelKey(u)) || ""; } catch (e) { return ""; } }
  function closeLevelGate() { const g = $("l1LevelGate"); if (g) g.remove(); document.body.style.overflow = ""; }
  function ensureLevelChosen() {
    const u = user();
    if (!u) return;
    const saved = storedLevel(u);
    if (saved) { if (u.level !== saved) u.level = saved; closeLevelGate(); return; }
    if ($("l1LevelGate")) return;
    if (!$("l1LevelGateCss")) {
      const st = document.createElement("style");
      st.id = "l1LevelGateCss";
      st.textContent = `#l1LevelGate{position:fixed;inset:0;z-index:100000;background:var(--l1-bg,#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:auto}
#l1LevelGate h2{font-size:24px;font-weight:800;color:var(--l1-ink,#111);text-align:center}
#l1LevelGate p{margin:6px 0 20px;color:var(--l1-muted,#667);text-align:center;font-size:14px}
#l1LevelGate .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:380px}
#l1LevelGate button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px 4px;border-radius:16px;border:1.5px solid var(--l1-line,#dde);background:var(--l1-card,#fff);color:var(--l1-ink,#111);cursor:pointer}
#l1LevelGate button b{font-size:26px;font-weight:800;color:var(--l1-primary,#2f5bea)}
#l1LevelGate button span{font-size:12px;color:var(--l1-muted,#667)}
#l1LevelGate button:active{transform:scale(.97);border-color:var(--l1-primary,#2f5bea)}`;
      document.head.appendChild(st);
    }
    const g = document.createElement("div");
    g.id = "l1LevelGate";
    g.innerHTML = `<h2>Darajangizni tanlang</h2><p>Ingliz tili CEFR darajangiz (A1 – C2)</p>
      <div class="grid">${CEFR.map(([k, en]) => `<button type="button" data-lvl="${k}"><b>${k}</b><span>${en}</span></button>`).join("")}</div>`;
    g.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-lvl]");
      if (!b) return;
      const lvl = b.dataset.lvl;
      try { localStorage.setItem(levelKey(u), lvl); } catch (err) { /* private mode: asked again next time */ }
      u.level = lvl;
      try { Haptic.tap(); } catch (err) { /* optional */ }
      closeLevelGate();
    });
    document.body.appendChild(g);
    document.body.style.overflow = "hidden";
  }

  // ------------------------------------------------------------------ data
  Shell.refresh = async function () {
    if (!user() || !window.l1GetToken()) return;
    Shell.lastRefresh = Date.now();
    try {
      const [asg, board] = await Promise.all([api("/api/assignments"), api("/api/leaderboard?period=week")]);
      Shell.data.assignments = asg.assignments;
      Shell.data.now = asg.now;
      Shell.data.board.week = board;
      Shell.data.me = board.me;
      Shell.data.fetchedAt = Date.now() / 1000;
    } catch (e) {
      if (e.status === 401 || e.status === 403) return;
    }
    renderBar();
    if (Shell.tab === "home") renderHome();
    if (Shell.tab === "tasks") renderTasks();
    if (Shell.tab === "rating") renderRating();
    const dot = $("l1TasksDot");
    if (dot) dot.classList.toggle("hidden", !activeTasks().some((a) => !a.my.done));
  };
  const nowTs = () => Shell.data.now + (Date.now() / 1000 - (Shell.data.fetchedAt || Date.now() / 1000));
  const activeTasks = () => (Shell.data.assignments || []).filter((a) => a.deadline > nowTs());

  // ------------------------------------------------------------------ header
  function renderBar() {
    const u = user();
    if (!u) return;
    $("l1BarAvatar").innerHTML = avatar(u, 40);
    $("l1BarName").textContent = u.name || "Foydalanuvchi";
    const h = new Date().getHours();
    $("l1BarGreeting").textContent = h < 11 ? "Xayrli tong," : h < 18 ? "Xayrli kun," : "Xayrli kech,";
    const me = Shell.data.me;
    $("l1BarPointsNum").textContent = me ? me.weekPoints : "0";
    const streak = $("l1BarStreak");
    if (me && me.streak > 0 && isStudentMode()) {
      streak.classList.remove("hidden");
      streak.textContent = `🔥 ${me.streak}`;
      streak.title = `${me.streak} kun ketma-ket`;
    } else streak.classList.add("hidden");
    $("l1BarPoints").classList.toggle("hidden", !isStudentMode());
  }

  // ------------------------------------------------------------------ task cards (Home + Tasks)
  function taskStatus(a) {
    const now = nowTs();
    if (a.my.done) return a.my.late ? ["l1-chip-amber", "Kechikib bajarildi"] : ["l1-chip-green", "✓ Bajarildi"];
    if (a.deadline <= now) return ["l1-chip-red", "Muddat o'tgan"];
    if (a.my.started) return ["l1-chip-blue", "Jarayonda"];
    return ["l1-chip-grey", "Boshlanmagan"];
  }

  function taskCard(a, big) {
    const now = nowTs();
    const pct = a.my.total ? Math.round((a.my.resolved / a.my.total) * 100) : 0;
    const [chipCls, chipText] = taskStatus(a);
    const open = a.deadline > now;
    const btn = a.my.done ? "Natijani ko'rish" : a.my.started ? "Davom etish" : "Boshlash";
    if (big) {
      return `<div class="l1-card-blue p-5">
        <div class="relative z-[1] space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="l1-chip l1-chip-white">${html(a.weekLabel || "Haftalik vazifa")}</span>
            <span class="l1-chip ${a.my.done ? "l1-chip-green" : "l1-chip-white"}">${html(chipText)}</span>
          </div>
          <div>
            <div class="text-[20px] font-extrabold leading-tight">${html(a.title)}</div>
            <div class="text-[12.5px] font-semibold opacity-90 mt-1">${a.exercises.length} ta mashq · ${a.questionCount} ta savol</div>
          </div>
          <div class="flex items-center justify-between text-[12.5px] font-bold">
            <span>⏰ ${open ? html(countdown(a.deadline, now)) + " qoldi" : "Muddat tugagan"}</span>
            <span class="opacity-90">${html(fmtDate(a.deadline))}</span>
          </div>
          <div class="l1-progress"><i style="width:${pct}%"></i></div>
          <div class="flex items-center justify-between gap-3">
            <div class="text-[13px] font-bold">${a.my.resolved}/${a.my.total} savol · <span class="l1-coin" style="display:inline-grid;vertical-align:-3px">★</span> ${a.my.points} ball</div>
            <button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-open-task="${html(a.id)}">${btn} →</button>
          </div>
        </div>
      </div>`;
    }
    return `<div class="l1-card p-4 space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-1.5 mb-1">
            ${a.weekLabel ? `<span class="l1-chip l1-chip-blue">${html(a.weekLabel)}</span>` : ""}
            <span class="l1-chip ${chipCls}">${html(chipText)}</span>
          </div>
          <div class="text-[16px] font-extrabold leading-snug">${html(a.title)}</div>
          ${a.note ? `<div class="l1-sub mt-0.5">${html(a.note)}</div>` : ""}
        </div>
        <div class="text-right flex-none">
          <div class="text-[18px] font-extrabold text-[color:var(--l1-primary)]">${a.my.points}</div>
          <div class="l1-sub" style="font-size:11px">ball</div>
        </div>
      </div>
      <div class="flex items-center justify-between text-[12px] font-bold text-[color:var(--l1-muted)]">
        <span>${open ? "⏰ " + html(countdown(a.deadline, now)) + " qoldi" : "Muddat: tugagan"}</span>
        <span>${html(fmtDate(a.deadline))}</span>
      </div>
      <div class="l1-progress"><i style="width:${pct}%"></i></div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-[12.5px] font-bold text-[color:var(--l1-muted)]">${a.my.resolved}/${a.my.total} savol${a.my.firstTry ? ` · ${a.my.firstTry} tasi 1-urinishda` : ""}</span>
        <button type="button" class="l1-btn ${a.my.done ? "l1-btn-soft" : "l1-btn-primary"} l1-btn-sm" data-open-task="${html(a.id)}">${btn}</button>
      </div>
      <details class="group">
        <summary class="cursor-pointer list-none text-[12.5px] font-extrabold text-[color:var(--l1-primary)]">Mashqlar ro'yxati va ballsiz mashq ▾</summary>
        <div class="mt-2 space-y-1.5">${a.exercises.map((ex) => `
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl l1-subrow">
            <span class="text-[13px] font-bold min-w-0 truncate">${html(ex.title)} <span class="l1-sub">(${ex.questionCount})</span></span>
            <button type="button" class="l1-btn l1-btn-ghost l1-btn-sm" data-practice-ex="${html(ex.id)}">Ballsiz ↗</button>
          </div>`).join("")}
        </div>
      </details>
    </div>`;
  }

  function wireTaskButtons(root) {
    root.querySelectorAll("[data-open-task]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      if (window.L1_Tasks) window.L1_Tasks.open(b.dataset.openTask);
    }));
    root.querySelectorAll("[data-practice-ex]").forEach((b) => b.addEventListener("click", () => {
      Shell.go("learn");
      if (typeof openExerciseRunner === "function") window.openExerciseRunner(b.dataset.practiceEx);
    }));
    root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { Haptic.tap(); Shell.go(b.dataset.go); }));
  }

  // ------------------------------------------------------------------ Pomodoro (on Asosiy)
  // The tomato opens the full-screen focus mode (static/focus.js): 25 min lesson → 5 min rest → 25 min lesson, and every
  // finished lesson plants a tree at a real place in Asaka. This card only starts it and shows how the shared forest is doing.
  const Pomo = (() => {
    const PLAN = [{ kind: "focus", min: 25 }, { kind: "rest", min: 5 }, { kind: "focus", min: 25 }];
    const R = 52, CIRC = 2 * Math.PI * R;
    const stats = () => (window.L1_Focus ? window.L1_Focus.summary() : { total: 0, today: 0, daily: 12 });
    function html() {
      const f = stats();
      return `<div class="l1-card l1-pomo-card p-4 flex items-center gap-4" id="l1Pomo" data-kind="idle">
        <button type="button" class="l1-pomo" data-pomo="start" aria-label="Pomidor taymer: boshlash">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="${R}" class="l1-pomo-track"/>
            <circle cx="60" cy="60" r="${R}" class="l1-pomo-ring" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}" transform="rotate(-90 60 60)"/>
            <g class="l1-pomo-fruit"><g transform="translate(60 63) scale(1.34) translate(-60 -63)">
              <path d="M60 36c-17 0-30 11-30 27s13 27 30 27 30-11 30-27-13-27-30-27Z" class="l1-pomo-body"/>
              <ellipse cx="47" cy="52" rx="7" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-30 47 52)"/>
              <path d="M60 41c-3-4-9-6-14-4 4 1 7 3 9 6-5 0-9 2-11 6 5-2 10-2 14 0-1 4 0 8 2 10 1-3 3-6 6-8 3 2 5 5 6 8 2-2 3-6 2-10 4-2 9-2 14 0-2-4-6-6-11-6 2-3 5-5 9-6-5-2-11 0-14 4Z" fill="#3aa655"/>
              <path d="M60 41c0-4 1-7 4-9" stroke="#2c7a3f" stroke-width="3" fill="none" stroke-linecap="round"/>
            </g></g>
          </svg>
          <span class="l1-pomo-time" id="l1PomoTime">25:00</span>
        </button>
        <div class="min-w-0 flex-1">
          <div class="text-[10px] font-black uppercase tracking-wider" style="color:var(--l1-muted)">Pomidor usuli</div>
          <div class="l1-h2 mt-0.5" id="l1PomoTitle">Bir soatlik dars rejasi</div>
          <div class="l1-sub mt-0.5" style="font-size:12.5px" id="l1PomoHint">25 daqiqa dars, 5 daqiqa dam, yana 25 daqiqa dars. Har bir dars uchun Asakaga bitta daraxt ekasiz. Boshlash uchun pomidorni bosing.</div>
          <div class="l1-pomo-steps mt-2">${PLAN.map((p) => `<span class="">${p.kind === "rest" ? "☕" : "🍅"} ${p.min}</span>`).join("")}</div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button type="button" class="l1-pomo-btn" data-pomo="map">🌳 Asaka bog'i: ${f.total} ta daraxt</button>
            ${f.today ? `<span class="l1-pomo-btn is-quiet" style="pointer-events:none">Bugun ${f.today}/${f.daily}</span>` : ""}
          </div>
        </div>
      </div>`;
    }
    function paint() { const card = $("l1Pomo"); if (card) card.outerHTML = html(); }
    document.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-pomo]");
      if (!b || !window.L1_Focus) return;
      Haptic.tap();
      if (b.dataset.pomo === "start") window.L1_Focus.open();
      else if (b.dataset.pomo === "map") window.L1_Focus.openMap();
    });
    window.addEventListener("l1:focus-summary", paint);
    return { html };
  })();

  // ------------------------------------------------------------------ Home
  function renderHome() {
    const el = $("l1Home");
    if (!el || Shell.tab !== "home") return;
    const u = user() || {};
    const me = Shell.data.me;
    const week = Shell.data.board.week;
    const top3 = week ? week.entries.slice(0, 3) : [];
    const homeMood = Idris.forScore(me ? me.weekPoints : 0, me && me.weekRank, week ? week.entries.length : 0);

    el.innerHTML = `<div class="l1-page space-y-4">
      <div class="l1-card l1-hero-card p-4 pr-2 flex items-end gap-2 overflow-visible">
        <div class="flex-1 min-w-0 pb-2 space-y-2">
          <div class="l1-h1">Assalomu alaykum, jigar!</div>
          <div class="l1-sub" style="font-size:13.5px">Keling, bir soatgina dars qilaylik. Quyidagi pomidorning ustiga bosing.</div>
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span class="l1-chip l1-chip-amber">★ ${me ? me.weekPoints : 0} ball</span>
            ${me && me.weekPoints ? `<span class="l1-chip l1-chip-blue">🏅 ${me.weekRank}-o'rin</span>` : ""}
            ${me && me.streak ? `<span class="l1-chip l1-chip-red">🔥 ${me.streak} kun</span>` : ""}
          </div>
        </div>
        ${Idris.html("greet", 118, "")}
      </div>

      ${Pomo.html()}

      <div class="grid grid-cols-2 gap-3">
        ${[["learn", "book", "Darslar", "Grammatika va lug'at", "linear-gradient(145deg,#6B63F5 0%,#4F46E5 100%)", "#fff", "79,70,229"], ["tasks", "task", "Vazifalar", "Haftalik mashqlar", "linear-gradient(145deg,#4D86FF 0%,#2F6BFF 100%)", "#fff", "47,107,255"], ["games", "game", "O'yinlar", "Kuniga 50 ballgacha", "linear-gradient(145deg,#1AA0DD 0%,#0284C7 100%)", "#fff", "2,132,199"], ["rating", "trophy", "Reyting", "Hafta va umumiy", "linear-gradient(145deg,#FFCB2E 0%,#F5B700 100%)", "#422006", "245,183,0"]]
          .map(([t, i, a, b, bg, fg, rgb]) => { return `<button type="button" data-go="${t}" class="l1-card-blue l1-tile p-4 text-left active:scale-[.98] transition" style="background:${bg};color:${fg};box-shadow:0 20px 40px -18px rgba(${rgb},.75)">
            <div class="relative z-[1] flex flex-col gap-3" style="min-height:104px">
              <div class="flex items-center justify-between">
                <span class="l1-3d-wrap">${window.Icons3D ? Icons3D.html(i, 50) : ""}</span>
                <span class="font-black opacity-80">↗</span>
              </div>
              <div><div class="font-extrabold text-[16px] leading-tight">${a}</div><div class="text-[11.5px] font-semibold opacity-85 mt-0.5">${b}</div></div>
            </div></button>`; }).join("")}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="l1-stat l1-card-blue"><div class="relative z-[1]"><b>${me ? me.weekPoints : 0}</b><span style="color:#dfe7ff">Haftalik ball</span></div></div>
        <div class="l1-stat l1-card"><b style="color:var(--l1-primary)">${me ? me.allPoints : 0}</b><span>Umumiy ball</span></div>
      </div>

      <div class="l1-card p-4 space-y-2">
        <div class="flex items-center justify-between"><div class="l1-h2">Hafta yetakchilari</div>
          <button type="button" class="text-[12.5px] font-extrabold text-[color:var(--l1-primary)]" data-go="rating">Hammasi →</button></div>
        ${top3.length && top3[0].points > 0 ? top3.map((e) => `
          <div class="l1-row ${me && e.id === me.id ? "is-me" : ""}" style="padding:7px 4px">
            <span class="l1-rank">${["🥇", "🥈", "🥉"][e.rank - 1] || e.rank}</span>${avatar(e, 36)}
            <span class="flex-1 min-w-0 font-bold text-[14px] truncate">${html(e.name)}</span>
            <span class="font-extrabold text-[14px] text-[color:var(--l1-primary)]">${e.points}</span>
          </div>`).join("") : `<div class="l1-sub py-2">Bu hafta hali hech kim ball to'plamadi — birinchi bo'ling!</div>`}
      </div>

    </div>`;
    wireTaskButtons(el);
  }

  // ------------------------------------------------------------------ Tasks
  function renderTasks() {
    const el = $("l1Tasks");
    if (!el || Shell.tab !== "tasks") return;
    const tasks = Shell.data.assignments;
    const now = nowTs();
    const active = (tasks || []).filter((a) => a.deadline > now).sort((a, b) => a.deadline - b.deadline);
    const past = (tasks || []).filter((a) => a.deadline <= now);
    el.innerHTML = `<div class="l1-page space-y-4">
      <div class="flex items-end justify-between gap-3 px-1">
        <div><div class="l1-h1">Haftalik vazifalar</div><div class="l1-sub">O'qituvchingiz bergan mashqlar va muddatlar</div></div>
      </div>
      <div class="l1-card l1-note-card p-3 flex items-center gap-3">
        ${Idris.html("book", 78)}
        <div class="min-w-0 flex-1">
          <div class="text-[10px] font-black uppercase tracking-wider" style="color:var(--l1-muted)">Shekspir aytadi</div>
          <div class="text-[13.5px] font-bold leading-snug mt-0.5" id="l1ShkHw">${html(shkQuote("homework"))}</div>
          <button type="button" id="l1ShkHwNext" class="mt-1 text-[11.5px] font-extrabold text-[color:var(--l1-primary)]">😄 Yana bir ibora</button>
        </div>
      </div>
      <div class="l1-card p-4 flex items-center gap-3">
        <div class="flex-1 text-[13px] font-bold leading-relaxed">
          <div class="l1-h2 mb-1">Ball qanday beriladi?</div>
          1-urinishda to'g'ri — <b class="text-[color:var(--l1-success)]">25 ball</b><br>
          2-urinishda — <b>15 ball</b> · 3–4-urinishda — <b>5 ball</b><br>
          <span class="l1-sub">2 ta xatodan keyin maslahat chiqadi. Muddatdan keyin ball 2 baravar kam.</span>
        </div>
      </div>
      ${tasks === null ? `<div class="l1-skeleton" style="height:160px"></div><div class="l1-skeleton" style="height:160px"></div>` : ""}
      ${tasks && !tasks.length ? `<div class="l1-card l1-empty">${Idris.html("wave", 120)}
        <div class="l1-h2 mt-2">Hozircha vazifa yo'q</div><div class="l1-sub mt-1">Yangi vazifa chiqqanda Telegram bot xabar beradi.</div></div>` : ""}
      ${active.length ? `<div class="l1-h2 px-1">Faol</div>${active.map((a) => taskCard(a)).join("")}` : ""}
      ${past.length ? `<div class="l1-h2 px-1 pt-2">O'tgan haftalar</div>${past.map((a) => taskCard(a)).join("")}` : ""}
    </div>`;
    wireTaskButtons(el);
    const hwBtn = $("l1ShkHwNext");
    if (hwBtn) hwBtn.addEventListener("click", () => {
      Haptic.tap();
      $("l1ShkHw").textContent = shkQuote("homework");
    });
  }

  // ------------------------------------------------------------------ Rating
  async function loadBoard(period) {
    const data = await api("/api/leaderboard?period=" + period);
    Shell.data.board[period] = data;
    Shell.data.me = data.me;
    return data;
  }
  Shell.loadBoard = loadBoard;

  // Renders a leaderboard into `el`: countdown, podium and a Rank / Player / Coins table.
  // Used by the student Rating tab and the teacher panel.
  const CLOCK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2.5h6"/></svg>';
  function fmtLeft(sec) {
    sec = Math.max(0, Math.floor(sec));
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const p2 = (n) => String(n).padStart(2, "0");
    return `${d}d : ${p2(h)}h : ${p2(m)}m : ${p2(s)}s`;
  }
  function tickCountdowns() {
    document.querySelectorAll(".lb-count[data-end]").forEach((n) => { n.textContent = fmtLeft(Number(n.dataset.end) - nowTs()); });
  }
  setInterval(tickCountdowns, 1000);

  Shell.renderBoard = function (el, period, onPeriod) {
    const data = Shell.data.board[period];
    const meId = user() && user().id;
    const entries = data ? data.entries : [];
    const [e1, e2, e3] = entries;
    const step = (e, r) => e ? `<div class="lb-step r${r}">
        <div class="lb-av">${r === 1 ? '<span class="lb-crown">👑</span>' : ""}<span class="lb-pos">${r}</span>${avatar(e, r === 1 ? 68 : 56)}</div>
        <div class="lb-name">${html(e.name)}</div>
        <div class="lb-pts"><i class="lb-coin"></i>${e.points}</div>
        <div class="lb-block">${r}</div></div>` : `<div class="lb-step r${r} is-empty"><div class="lb-block">${r}</div></div>`;
    const mine = entries.find((e) => e.id === meId);
    const row = (e) => `<div class="lb-row ${e.id === meId ? "is-me" : ""}">
        <span class="lb-rank">${e.rank}</span>
        <span class="lb-who">${avatar(e, 30)}<span>${html(e.name)}${e.id === meId ? '<em class="lb-you" style="font-style:normal">SIZ</em>' : ""}</span></span>
        <span class="lb-coins"><i class="lb-coin"></i>${e.points}</span></div>`;
    const timer = data && period === "week" && data.weekEnd ? `<div class="lb-timer">
        <span class="lb-clock">${CLOCK_ICON}</span>
        <div><small>Reyting tugashiga qoldi</small><b class="lb-count" data-end="${data.weekEnd}">${fmtLeft(data.weekEnd - nowTs())}</b></div></div>` : "";
    el.innerHTML = `<div class="lb space-y-4">
      <div class="l1-seg"><button type="button" data-period="week" class="${period === "week" ? "is-active" : ""}">Bu hafta</button>
        <button type="button" data-period="all" class="${period === "all" ? "is-active" : ""}">Umumiy</button></div>
      ${!data ? `<div class="l1-skeleton" style="height:220px"></div>` : `
      ${timer}
      <div class="lb-card">
        <div class="lb-podium">${step(e2, 2)}${step(e1, 1)}${step(e3, 3)}</div>
        <div class="lb-head"><span>O'rin</span><span>O'yinchi</span><span>Ball</span></div>
        ${entries.length > 3 ? entries.slice(3).map(row).join("") : `<div class="lb-empty">${entries.length ? "Qolgan ishtirokchilar shu yerda ko'rinadi." : "Hali talabalar yo'q."}</div>`}
      </div>
      ${mine && user() && state.mode !== "teacher" ? `<div class="lb-me-bar">
        <span class="lb-me-rank">#${mine.rank}</span>${avatar(mine, 38)}
        <div class="lb-me-info"><b>${html(mine.name)}</b><span>${mine.points} ball · ${period === "week" ? "bu hafta" : "umumiy"}</span></div>
        <button type="button" class="lb-me-go" data-go="games">O'ynash</button></div>` : ""}
      <div class="l1-sub px-2 text-center" style="font-size:11.5px">Ball: vazifadagi har bir savol 25 / 15 / 5 · o'yinlardan kuniga ko'pi bilan 50 ball</div>`}
    </div>`;
    el.querySelectorAll("[data-period]").forEach((b) => b.addEventListener("click", () => onPeriod(b.dataset.period)));
    el.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { Haptic.tap(); Shell.go(b.dataset.go); }));
  };

  function renderRating() {
    const el = $("l1Rating");
    if (!el || Shell.tab !== "rating") return;
    el.innerHTML = `<div class="l1-page space-y-4"><div class="px-1"><div class="l1-h1">Reyting</div>
      <div class="l1-sub" id="l1RatingMe">Eng faol talabalar</div></div>
      <div id="l1RatingReact"></div><div id="l1RatingBox"></div></div>`;
    const box = $("l1RatingBox");
    // The mascot reacts to the student's own score: surprised at the top, comforting near the bottom.
    const react = () => {
      const m = Shell.data.me;
      const slot = $("l1RatingReact");
      if (!slot || !m) return;
      const p = Shell.ratingPeriod;
      const board = Shell.data.board[p];
      const r = Idris.forScore(p === "week" ? m.weekPoints : m.allPoints, p === "week" ? m.weekRank : m.allRank, board ? board.entries.length : 0);
      slot.innerHTML = `<div class="l1-react-card">${Idris.html("trophy", 84)}
        <div class="min-w-0"><span class="l1-react-tag">${r.mood === "comfort" ? "Xafa bo'lmang" : r.mood === "surprised" ? "Voy!" : "Barakalla"}</span>
        <div class="l1-react-text">${html(r.text)}</div></div></div>`;
    };
    const header = () => {
      const m = Shell.data.me;
      const p = Shell.ratingPeriod;
      if (m) $("l1RatingMe").textContent = p === "week"
        ? `Siz: ${m.weekRank || "—"}-o'rin · ${m.weekPoints} ball (bu hafta)`
        : `Siz: ${m.allRank || "—"}-o'rin · ${m.allPoints} ball (umumiy)`;
      renderBar();
      react();
    };
    const show = (p) => {
      Shell.ratingPeriod = p;
      Shell.renderBoard(box, p, show);
      header();
      const cached = Shell.data.board[p];
      if (!cached || Date.now() - (cached._at || 0) > 15000) {
        loadBoard(p).then((d) => {
          d._at = Date.now();
          if (Shell.tab === "rating" && Shell.ratingPeriod === p) { Shell.renderBoard(box, p, show); header(); }
        }).catch(() => {});
      }
    };
    show(Shell.ratingPeriod);
  }
  // ------------------------------------------------------------------ Profile sheet
  function openProfile() {
    const u = user();
    if (!u) return;
    Haptic.tap();
    const me = Shell.data.me || {};
    const staff = typeof isStaffRole === "function" && isStaffRole(u.role);
    const back = document.createElement("div");
    back.className = "l1-sheet-backdrop";
    const sheet = document.createElement("div");
    sheet.className = "l1-sheet l1-sheet-center";
    sheet.innerHTML = `<div class="l1-grip"></div>
      <div class="flex items-center gap-3">${avatar(u, 60)}
        <div class="min-w-0"><div class="text-[18px] font-extrabold truncate">${html(u.name)}</div>
        <div class="l1-sub">${staff ? "O'qituvchi" : "Talaba"} · ${html(u.level || u.className || "A1")}</div></div></div>
      ${staff && state.mode === "teacher" ? "" : `<div class="grid grid-cols-3 gap-2 mt-4 text-center">
        <div class="l1-card p-3"><b class="text-[18px]">${me.weekPoints || 0}</b><div class="l1-sub" style="font-size:11px">Haftalik</div></div>
        <div class="l1-card p-3"><b class="text-[18px]">${me.allPoints || 0}</b><div class="l1-sub" style="font-size:11px">Umumiy</div></div>
        <div class="l1-card p-3"><b class="text-[18px]">🔥 ${me.streak || 0}</b><div class="l1-sub" style="font-size:11px">Kun ketma-ket</div></div>
      </div>`}
      <div class="mt-4 space-y-2">
        ${isStudentMode() ? `<button type="button" data-act="progress" class="l1-btn l1-btn-soft w-full">📊 Natijalarim va xatolarim</button>` : ""}
        <button type="button" data-act="sound" class="l1-btn l1-btn-soft w-full">${Sound.muted ? "🔇 Ovoz o'chirilgan — yoqish" : "🔊 Ovoz yoqilgan — o'chirish"}</button>
        ${staff ? `<button type="button" data-act="mode" class="l1-btn l1-btn-soft w-full">${state.mode === "teacher" ? "🎓 Talaba ko'rinishi" : "🛠 Boshqaruv paneli"}</button>` : ""}
        <button type="button" data-act="logout" class="l1-btn l1-btn-danger w-full">Chiqish</button>
      </div>`;
    const close = () => { back.remove(); sheet.remove(); Back.remove(handler); };
    const handler = Back.push(close);
    back.addEventListener("click", close);
    sheet.addEventListener("click", (ev) => {
      const act = ev.target.closest("[data-act]");
      if (!act) return;
      const a = act.dataset.act;
      if (a === "progress") { close(); Shell.go("learn"); const b = $("tabBtnMyProgress"); if (b) b.click(); }
      if (a === "sound") { Sound.muted = !Sound.muted; act.textContent = Sound.muted ? "🔇 Ovoz o'chirilgan — yoqish" : "🔊 Ovoz yoqilgan — o'chirish"; }
      if (a === "mode") { close(); const b = $("btnModeToggle"); if (b) b.click(); }
      if (a === "logout" && confirm("Haqiqatan ham tizimdan chiqmoqchimisiz?")) {
        close();
        window.L1_LOGOUT();
        updateAuthView();
        if (typeof showToast === "function") showToast("Tizimdan chiqdingiz.");
      }
    });
    document.body.appendChild(back);
    document.body.appendChild(sheet);
  }

  // Refresh when the user comes back to the Mini App.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && user() && Date.now() - Shell.lastRefresh > 30000) Shell.refresh();
    if (document.hidden && window.L1_Games) window.L1_Games.pauseAll();
  });
  // Keep the countdowns fresh.
  setInterval(() => { if (Shell.tab === "home") renderHome(); if (Shell.tab === "tasks") renderTasks(); }, 60000);

  build();
  wrapLegacy();
  Shell.pomo = Pomo;
  window.L1_Shell = Shell;
})(window, document);