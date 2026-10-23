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
  const firstName = (u) => (u && (u.firstName || String(u.name || "").split(" ")[0])) || "do'stim";

  // ------------------------------------------------------------------ on-screen Back button
  // Goes back one step: close an overlay, leave a lesson / exercise, or return to Asosiy from a tab.
  const shown = (id) => { const el = $(id); return !!el && !el.classList.contains("hidden") && el.offsetParent !== null; };
  const press = (id) => () => { const b = $(id); if (b) b.click(); };
  // True while the student is inside a lesson, exercise, game or sheet: the floating Pomidor then steps aside.
  function deepView() {
    return Back.stack.some((h) => h !== Shell.backToHome) || shown("practiceSuiteRunnerArea") || shown("exerciseRunnerView")
      || shown("lessonReaderView") || shown("unitExercisesListContainer") || shown("dictionaryView") || shown("myProgressView") || !!playingGame();
  }
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
    document.body.classList.toggle("l1-deep", isStudentMode() && deepView());
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
      <div class="l1-hello"></div>
      <button type="button" id="l1BarStaff" class="l1-pill hidden">Panel</button>
      ${Theme.buttonHtml("", "l1BarTheme")}
      <span id="l1BarStreak" class="l1-pill hidden"></span>
      <button type="button" id="l1BarPoints" class="l1-pill" aria-label="Haftalik ballar: 0. Reytingni ochish"><span class="l1-coin">★</span><span id="l1BarPointsNum">0</span></button>
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
    // The Back button follows what is on screen: re-check when the page changes (once per frame), plus a slow
    // fallback for games that start without touching the page.
    let backQueued = false;
    new MutationObserver(() => {
      if (backQueued) return;
      backQueued = true;
      requestAnimationFrame(() => { backQueued = false; syncBackButton(); });
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"] });
    setInterval(() => { if (!document.hidden) syncBackButton(); }, 2000);
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
    document.body.dataset.l1Tab = tab; // lets the floating tomato shrink while a game is open
    ["home", "tasks", "rating"].forEach((t) => {
      const el = $("l1" + t[0].toUpperCase() + t.slice(1));
      if (el) el.classList.toggle("hidden", t !== tab);
    });
    const switcher = $("mainModeSwitcher");
    if (switcher) switcher.classList.toggle("hidden", tab !== "learn");
    if (tab !== "learn" && tab !== "games") LEGACY.forEach((id) => { const el = $(id); if (el) el.classList.add("hidden"); });
    document.querySelectorAll("#l1BottomNav button").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.tab === tab);
      if (b.dataset.tab === tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
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
    $("l1BarStaff").textContent = state.mode === "teacher" ? "🎓 Talaba" : "🛠 Panel"; $("l1BarStaff").title = state.mode === "teacher" ? "Talaba ko'rinishiga o'tish" : "Boshqaruv paneliga o'tish";
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
    if (isStudentMode()) applyStoredLevel(); else closeLevelGate();
  };

  // ------------------------------------------------------------------ CEFR level (A1 until the student picks another one in the profile)
  const CEFR = [
    ["A1", "Beginner"], ["A2", "Elementary"], ["A2+", "Elementary+"],
    ["B1", "Intermediate"], ["B1+", "Intermediate+"], ["B2", "Upper-Int."],
    ["B2+", "Upper-Int.+"], ["C1", "Advanced"], ["C2", "Proficiency"],
  ];
  const levelKey = (u) => `l1_cefr_level_${u.id || u.name}`;
  function storedLevel(u) { try { return localStorage.getItem(levelKey(u)) || ""; } catch (e) { return ""; } }
  function closeLevelGate() { const g = $("l1LevelGate"); if (g) g.remove(); document.body.style.overflow = ""; }
  function applyStoredLevel() {
    const u = user();
    const saved = u && storedLevel(u);
    if (saved && u.level !== saved) u.level = saved;
  }
  function openLevelPicker() {
    const u = user();
    if (!u) return;
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
    const dismiss = () => { closeLevelGate(); Back.remove(gateBack); };
    const gateBack = Back.push(dismiss);
    g.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-lvl]");
      if (!b) { if (e.target === g) dismiss(); return; }
      const lvl = b.dataset.lvl;
      try { localStorage.setItem(levelKey(u), lvl); } catch (err) { /* private mode: the level is kept until the page closes */ }
      u.level = lvl;
      try { Haptic.tap(); } catch (err) { /* optional */ }
      dismiss();
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
    const hello = document.querySelector("#l1AppBar .l1-hello");
    if (hello) {
      hello.textContent = u.firstName || (u.name || "").split(" ")[0] || "";
      hello.style.cssText = "font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    }
    const me = Shell.data.me;
    $("l1BarPointsNum").textContent = me ? me.weekPoints : "0";
    $("l1BarPoints").setAttribute("aria-label", `Haftalik ballar: ${me ? me.weekPoints : 0}. Reytingni ochish`);
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
          <div class="l1-sub" style="font-size:12px">ball</div>
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

  // ------------------------------------------------------------------ Yashil shahar card (on Asosiy)
  // The floating tomato (static/focus.js) is on every screen; this card starts the same Pomodoro and opens the
  // Yashil shahar map (static/green_map.js), where every finished Pomodoro's tree is planted.
  const Pomo = (() => {
    const stats = () => (window.L1_Focus ? window.L1_Focus.summary() : { city: 0, mine: 0, unplanted: 0, today: 0, daily: 12, status: "idle", left: 1500000 });
    const art = (kind, stage) => (window.L1_TreeArt ? window.L1_TreeArt.svg(kind, stage, false) : "");
    function html() {
      const f = stats();
      const running = f.status !== "idle";
      const mm = Math.floor(f.left / 60000), ss = Math.floor((f.left % 60000) / 1000);
      return `<section class="hm-city" id="l1Pomo">
        <div class="hm-city-trees" aria-hidden="true"><i>${art("pine", 3)}</i><i>${art("cherry", 3)}</i><i class="is-big">${art("oak", 3)}</i><i>${art("apple", 3)}</i><i>${art("plane", 3)}</i></div>
        <div class="hm-city-body">
          <div><div class="hm-city-title">Yashil shahar</div>
            <div class="hm-city-sub"><b>${f.city}</b> daraxt · siz <b>${f.mine}</b>${f.unplanted ? ` · <span class="hm-city-new">${f.unplanted} ta ekilmagan</span>` : ""}</div></div>
          <div class="hm-city-btns">
            <button type="button" class="hm-btn is-white" data-pomo="start">🍅 ${running ? `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : "Pomidor"}</button>
            <button type="button" class="hm-btn is-glass" data-pomo="${f.unplanted ? "plant" : "map"}">${f.unplanted ? "🌱 Ekish" : "🗺️ Xarita"}</button>
          </div>
        </div></section>`;
    }
    function paint() { const card = $("l1Pomo"); if (card) card.outerHTML = html(); paintGoals(); }
    document.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-pomo]");
      if (!b || !window.L1_Focus) return;
      Haptic.tap();
      if (b.dataset.pomo === "start") window.L1_Focus.open();
      else if (b.dataset.pomo === "plant") window.L1_Green && window.L1_Green.open({ plant: true });
      else if (b.dataset.pomo === "map") window.L1_Focus.openMap();
    });
    window.addEventListener("l1:focus-summary", paint);
    return { html };
  })();

  // ------------------------------------------------------------------ Home
  const POMO_GOAL = 3; // finished Pomodoros a day
  const LESSON_GOAL = 1; // lessons learned a day
  const GAME_CARDS = [
    { id: "dragon", ref: "dragon", name: "Ajdarho", tag: "Qoch va javob ber", emoji: "🐉", bg: "linear-gradient(145deg,#14b886 0%,#0a8f9c 100%)" },
    { id: "millionaire", ref: "millionaire", name: "Millioner", tag: "15 ta savol", emoji: "💰", bg: "linear-gradient(145deg,#3b3fd8 0%,#7c3aed 100%)" },
    { id: "race", ref: "wordrace", name: "Word Race", tag: "Do'stlar bilan poyga", emoji: "🏁", bg: "linear-gradient(145deg,#ff8a3d 0%,#ef4444 100%)" },
    { id: "listen", ref: "listen", name: "Listen and Survive", tag: "Tingla va omon qol", emoji: "🎧", bg: "linear-gradient(145deg,#0ea5e9 0%,#2563eb 100%)" },
  ];
  const RING_C = 2 * Math.PI * 26;
  const ringHtml = (frac, color, icon) => `<span class="hm-ring"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" class="t"/>
    <circle cx="32" cy="32" r="26" class="p" style="stroke:${color}" stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="${(RING_C * (1 - Math.min(1, Math.max(0, frac)))).toFixed(1)}" transform="rotate(-90 32 32)"/></svg>
    <b>${frac >= 1 ? "✓" : icon}</b></span>`;

  // Lessons the student marked as learned today (index.html writes the time of each into l1_learned_log_v1).
  function lessonsToday() {
    try {
      const log = JSON.parse(localStorage.getItem("l1_learned_log_v1") || "{}");
      const start = new Date(); start.setHours(0, 0, 0, 0);
      return Object.values(log).filter((at) => at >= start.getTime()).length;
    } catch (e) { return 0; }
  }

  // Today's three goals: Pomodoros, lessons and homework questions.
  function dailyGoals() {
    const f = window.L1_Focus ? window.L1_Focus.summary() : { today: 0 };
    const tasks = activeTasks();
    const total = tasks.reduce((n, a) => n + (a.my ? a.my.total : 0), 0);
    const done = tasks.reduce((n, a) => n + (a.my ? a.my.resolved : 0), 0);
    const lessons = lessonsToday();
    const goals = [
      { key: "pomo", icon: "🍅", color: "#ef4444", name: "Pomidor", frac: f.today / POMO_GOAL, text: `${Math.min(f.today, POMO_GOAL)}/${POMO_GOAL}` },
      { key: "lessons", icon: "📖", color: "#0ea5a4", name: "Dars", frac: lessons / LESSON_GOAL, text: `${Math.min(lessons, LESSON_GOAL)}/${LESSON_GOAL}` },
    ];
    // No homework means no goal: an empty goal must not count as done.
    if (total) goals.push({ key: "tasks", icon: "📝", color: "#4f5bf0", name: "Vazifa", frac: done / total, text: `${done}/${total}` });
    return goals;
  }
  function goalsHtml() {
    return dailyGoals().map((g) => `<button type="button" class="hm-goal${g.frac >= 1 ? " is-done" : ""}" data-hm="${g.key}">${ringHtml(g.frac, g.color, g.icon)}
      <b>${g.text}</b><span>${g.name}</span></button>`).join("");
  }
  function goalCount() { const g = dailyGoals(); const n = g.filter((x) => x.frac >= 1).length; return `<span class="hm-count${n === g.length ? " is-done" : ""}">${n === g.length ? "🎉 " : ""}${n}/${g.length}</span>`; }
  function paintGoals() { const el = $("hmGoals"); if (el) el.innerHTML = goalsHtml(); const h = $("hmGoalCount"); if (h) h.innerHTML = goalCount(); }
  window.addEventListener("l1:lesson-learned", () => { paintGoals(); });

  // Listen and Survive stars (out of 3 per mission, 5 missions) come from the server; fetched once, then the home is drawn again.
  function loadListenStars() {
    if (Shell.data.listen !== undefined || !window.l1GetToken()) return;
    Shell.data.listen = null;
    api("/api/listen/progress").then((d) => {
      const m = (d && d.missions) || {};
      Shell.data.listen = Object.values(m).reduce((n, v) => n + ((v && v.stars) || 0), 0);
      if (Shell.tab === "home") renderHome();
    }).catch(() => { Shell.data.listen = 0; });
  }

  function gameCardsHtml() {
    const me = Shell.data.me || {};
    const week = me.gameWeek || {};
    return GAME_CARDS.map((g) => {
      const pts = week[g.ref] || 0;
      let status = pts ? `Bu hafta +${pts} ball` : g.tag;
      if (g.id === "listen" && Shell.data.listen) status = `⭐ ${Shell.data.listen}/15 yulduz`;
      return `<button type="button" class="hm-game" data-game="${g.id}" style="background:${g.bg}">
        <span class="hm-game-emoji" aria-hidden="true">${g.emoji}</span>
        <span class="hm-game-name">${g.name}</span><span class="hm-game-status">${html(status)}</span></button>`;
    }).join("");
  }

  function renderHome() {
    const el = $("l1Home");
    if (!el || Shell.tab !== "home") return;
    const u = user() || {};
    const me = Shell.data.me;
    const week = Shell.data.board.week;
    const top3 = week ? week.entries.slice(0, 3).filter((e) => e.points > 0) : [];
    const hour = new Date().getHours();
    const hello = "Assalomu alaykum";
    const first = (u.firstName || (u.name || "").split(" ")[0] || "do'stim");
    loadListenStars();

    el.innerHTML = `<div class="l1-page space-y-4">
      <section class="hm-hero">
        <div class="hm-hero-text">
          <div class="hm-kicker">${hello},</div>
          <div class="hm-name">${html(first)}!</div>
          <div class="hm-chips">
            <span>🏅 Hafta: ${me && me.weekPoints ? `${me.weekRank}-o'rin` : "–"}</span>
            <span>🏆 Oy: ${me && me.monthPoints ? `${me.monthRank}-o'rin` : "–"}</span>
          </div>
        </div>
        ${Idris.html("greet", 128, "")}
      </section>

      <section class="hm-card">
        <div class="hm-card-head"><h2>Bugungi maqsadlar</h2><span id="hmGoalCount">${goalCount()}</span></div>
        <div class="hm-goals" id="hmGoals">${goalsHtml()}</div>
      </section>

      ${Pomo.html()}

      <section>
        <div class="hm-card-head px-1"><h2>O'yinlar</h2><button type="button" class="hm-more" data-go="games">Hammasi ›</button></div>
        <div class="hm-games">${gameCardsHtml()}</div>
      </section>

      ${top3.length ? `<section class="hm-card">
        <div class="hm-card-head"><h2>Hafta yetakchilari</h2><button type="button" class="hm-more" data-go="rating">Hammasi ›</button></div>
        <div class="hm-top">${top3.map((e) => `
          <div class="hm-top-i r${e.rank}${me && e.id === me.id ? " is-me" : ""}">
            <span class="hm-medal">${["🥇", "🥈", "🥉"][e.rank - 1] || e.rank}</span>${avatar(e, e.rank === 1 ? 60 : 52)}
            <b>${html((e.name || "").split(" ")[0])}</b><span>${e.points} ball</span></div>`).join("")}</div>
      </section>` : ""}
    </div>`;
    wireTaskButtons(el);
    el.querySelectorAll("[data-hm]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      if (b.dataset.hm === "pomo") window.L1_Focus && window.L1_Focus.open();
      else Shell.go(b.dataset.hm === "lessons" ? "learn" : "tasks");
    }));
    el.querySelectorAll("[data-game]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      Shell.go("games");
      if (window.L1_Nav) window.L1_Nav.setGameSub(b.dataset.game);
    }));
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
      ${tasks && tasks.length ? `<div class="l1-card p-3 text-[13px] font-bold leading-relaxed">
        <b class="text-[color:var(--l1-success)]">1-urinishda 25 ball</b> · 2-urinishda 15 · 3–4-urinishda 5
        <div class="l1-sub">2 ta xatodan keyin maslahat chiqadi. Muddatdan keyin ball 2 baravar kam.</div></div>` : ""}
      ${tasks === null ? `<div class="l1-skeleton" style="height:160px"></div><div class="l1-skeleton" style="height:160px"></div>` : ""}
      ${tasks && !tasks.length ? `<div class="l1-card l1-empty">${Idris.html("wave", 120)}
        <div class="l1-h2 mt-2">Hozircha vazifa yo'q</div><div class="l1-sub mt-1">Yangi vazifa chiqqanda Telegram bot xabar beradi.</div></div>` : ""}
      ${active.length ? `<div class="l1-h2 px-1">Faol</div>${active.map((a) => taskCard(a)).join("")}` : ""}
      ${past.length ? `<div class="l1-h2 px-1 pt-2">O'tgan haftalar</div>${past.map((a) => taskCard(a)).join("")}` : ""}
    </div>`;
    wireTaskButtons(el);
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
    // Only students with points stand on the podium; everyone else is listed below it.
    const [e1, e2, e3] = entries.filter((e) => e.points > 0);
    const onPodium = [e1, e2, e3].filter(Boolean);
    const rest = entries.filter((e) => !onPodium.includes(e));
    const step = (e, r) => e ? `<div class="lb-step r${r}">
        <div class="lb-av">${r === 1 ? '<span class="lb-crown">👑</span>' : ""}<span class="lb-pos">${r}</span>${avatar(e, r === 1 ? 68 : 56)}</div>
        <div class="lb-name">${html(e.name)}</div>
        <div class="lb-pts"><i class="lb-coin"></i>${e.points}</div>
        <div class="lb-block">${r}</div></div>` : `<div class="lb-step r${r} is-empty"><div class="lb-block">${r}</div></div>`;
    const mine = entries.find((e) => e.id === meId);
    const row = (e) => `<div class="lb-row ${e.id === meId ? "is-me" : ""}">
        <span class="lb-rank">${e.points > 0 ? e.rank : "–"}</span>
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
        ${onPodium.length ? `<div class="lb-podium">${step(e2, 2)}${step(e1, 1)}${step(e3, 3)}</div>` : ""}
        <div class="lb-head"><span>O'rin</span><span>O'yinchi</span><span>Ball</span></div>
        ${rest.length ? rest.map(row).join("") : (entries.length ? "" : `<div class="lb-empty">Hali talabalar yo'q.</div>`)}
        ${!onPodium.length && entries.length ? `<div class="lb-empty">Hali hech kim ball to'plamagan — vazifa bajaring yoki o'yin o'ynang.</div>` : ""}
      </div>
      ${mine && entries.indexOf(mine) >= 8 && user() && state.mode !== "teacher" ? `<div class="lb-me-bar">
        <span class="lb-me-rank">${mine.points > 0 ? "#" + mine.rank : "–"}</span>${avatar(mine, 38)}
        <div class="lb-me-info"><b>${html(mine.name)}</b><span>${mine.points} ball · ${period === "week" ? "bu hafta" : "umumiy"}</span></div>
</div>` : ""}
      <div class="l1-sub px-2 text-center" style="font-size:12px">Ball: vazifadagi har bir savol 25 / 15 / 5 · o'yinlardan kuniga ko'pi bilan 50 ball</div>`}
    </div>`;
    el.querySelectorAll("[data-period]").forEach((b) => b.addEventListener("click", () => onPeriod(b.dataset.period)));
  };

  function renderRating() {
    const el = $("l1Rating");
    if (!el || Shell.tab !== "rating") return;
    el.innerHTML = `<div class="l1-page space-y-4"><div class="px-1"><div class="l1-h1">Reyting</div>
      <div class="l1-sub" id="l1RatingMe">Eng faol talabalar</div></div>
      <div id="l1RatingBox"></div></div>`;
    const box = $("l1RatingBox");
    const header = () => {
      const m = Shell.data.me;
      const p = Shell.ratingPeriod;
      if (m) {
        const pts = p === "week" ? m.weekPoints : m.allPoints;
        const rank = p === "week" ? m.weekRank : m.allRank;
        $("l1RatingMe").textContent = pts > 0 ? `Siz: ${rank || "—"}-o'rin · ${pts} ball (${p === "week" ? "bu hafta" : "umumiy"})` : "Hali ball yo'q — birinchi bo'ling!";
      }
      renderBar();
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
      <div class="l1-sheet-hero">
      <div class="flex items-center gap-3"><button type="button" data-act="photo" class="l1-avatar-edit" aria-label="Profil rasmini o'zgartirish">${avatar(u, 60)}<span class="l1-avatar-edit-badge" aria-hidden="true">✎</span></button>
        <div class="min-w-0"><div class="text-[18px] font-extrabold truncate">${html(u.name)}</div>
        <div class="l1-sub">${staff ? "O'qituvchi" : "Talaba"} · ${html(u.level || u.className || "A1")}</div>
        <button type="button" data-act="photo" class="l1-pomo-btn mt-1" style="padding:4px 10px">Rasmni o'zgartirish</button></div></div>
      ${staff && state.mode === "teacher" ? "" : `<div class="grid grid-cols-3 gap-2 mt-4 text-center">
        <div class="l1-card p-3"><b class="text-[18px]">${me.weekPoints || 0}</b><div class="l1-sub" style="font-size:12px">Haftalik</div></div>
        <div class="l1-card p-3"><b class="text-[18px]">${me.allPoints || 0}</b><div class="l1-sub" style="font-size:12px">Umumiy</div></div>
        <div class="l1-card p-3"><b class="text-[18px]">🔥 ${me.streak || 0}</b><div class="l1-sub" style="font-size:12px">Kun ketma-ket</div></div>
      </div>`}
      </div>
      <div class="mt-4 space-y-2">
        ${isStudentMode() ? `<button type="button" data-act="progress" class="l1-btn l1-btn-soft w-full">📊 Natijalarim va xatolarim</button>
        <button type="button" data-act="level" class="l1-btn l1-btn-soft w-full">🎯 Darajam: ${html(u.level || "A1")} — o'zgartirish</button>` : ""}
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
      if (a === "photo") { close(); if (window.L1_Characters) window.L1_Characters.open(); }
      if (a === "progress") { close(); Shell.go("learn"); const b = $("tabBtnMyProgress"); if (b) b.click(); }
      if (a === "level") { close(); openLevelPicker(); }
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