// Level Up app shell: blue app bar, bottom navigation and the Home / Tasks / Rating pages.
// Loaded after the main inline script, so it can wrap updateAuthView / updateStudentViews / L1_Nav.
(function (window, document) {
  "use strict";
  const { Theme, Palette, Back, Haptic, Sound, Idris, avatar, api, fmtDate, html } = window.L1;
  const TABS = ["home", "tasks", "learn", "games", "rating"];
  const LEGACY = ["learnContainer", "practiceContainer", "gamesContainer", "dictionaryView", "myProgressView", "exerciseRunnerView"];
  const $ = (id) => document.getElementById(id);
  // A page is drawn again only when its markup changed. Re-drawing an unchanged page (every tab switch and every data
  // refresh did) re-decoded its pictures and replayed its animations, so it looked like the page reloaded.
  const painted = new WeakMap();
  function paint(el, markup) {
    if (painted.get(el) === markup && el.firstElementChild) return false;
    painted.set(el, markup);
    el.innerHTML = markup;
    return true;
  }
  // Asosiy draws two of its parts again on their own (the goals and the Pomidor card, when the Pomodoro or a lesson
  // changes). The part is swapped in place and the page's remembered markup gets the same swap, so the next full paint
  // neither skips a real change nor redraws the whole page for nothing. `part` records what a page paint put there.
  const parts = {};
  const part = (id, markup) => (parts[id] = markup);
  function repaintPart(page, id, markup) {
    const el = $(id), before = parts[id];
    if (!el || markup === before) return;
    el.outerHTML = markup;
    parts[id] = markup;
    const m = page && painted.get(page);
    if (m === undefined) return;
    if (before && m.includes(before)) painted.set(page, m.replace(before, () => markup)); else painted.delete(page);
  }

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
    if (Back.stack.some((h) => h !== Shell.backToHome)) return () => Back.pop();
    if (shown("practiceSuiteRunnerArea") && window.L1_PracticeSuite) return () => window.L1_PracticeSuite.backToMenu();
    if (shown("exerciseRunnerView")) return press("btnBackToExercises");
    if (shown("lessonReaderView")) return press("btnBackToLearnUnits");
    if (shown("unitExercisesListContainer")) return press("btnBackToPracticeUnits");
    if (shown("dictionaryView") || shown("myProgressView")) return () => { if (window.L1_Nav && window.L1_Nav.setLearnSub) window.L1_Nav.setLearnSub("grammar"); };
    if (Shell.backToHome) return () => Back.pop();
    return null;
  }
  // A game being played is a full-screen layer of its own (static/arcade_core.js); it handles Back itself.
  function playingGame() {
    return window.L1_Arcade && window.L1_Arcade.active ? window.L1_Arcade : null;
  }
  function quitGame() {
    if (playingGame()) window.L1_Arcade.close();
    syncBackButton();
  }
  function syncBackButton() {
    const b = $("l1BarBack");
    const back = !!(isStudentMode() && backAction());
    if (b) { b.classList.toggle("hidden", !back); b.parentElement.classList.toggle("has-back", back); }
    document.body.classList.toggle("l1-deep", isStudentMode() && deepView());
  }

  // ------------------------------------------------------------------ DOM scaffolding
  // Bottom bar icons: thin outline drawings; the active tab fills the parts marked "f" with its colour.
  const navSvg = (body) => `<svg class="l1-nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const NAV_ICONS = {
    home: navSvg('<path class="f" d="M4.5 10.2 12 4.2l7.5 6V19a1.5 1.5 0 0 1-1.5 1.5h-3.6v-5.6H9.6v5.6H6A1.5 1.5 0 0 1 4.5 19z"/><path d="M2.8 11.5 12 4.2l9.2 7.3"/>'),
    tasks: navSvg('<rect class="f" x="4.8" y="4.6" width="14.4" height="16.4" rx="2.6"/><path d="M9 4.6V3.3h6v1.3"/><path d="m8.6 13.2 2.4 2.4 4.6-4.8"/>'),
    learn: navSvg('<path class="f" d="M12 6.8C10 5.2 7.1 4.7 3.4 5.1v13.2c3.7-.4 6.6.1 8.6 1.7 2-1.6 4.9-2.1 8.6-1.7V5.1c-3.7-.4-6.6.1-8.6 1.7z"/><path d="M12 6.8V20"/>'),
    games: navSvg('<path class="f" d="M7.6 7.4h8.8a4.6 4.6 0 0 1 4.5 5.5l-.9 4.3a2.7 2.7 0 0 1-4.7 1.2l-1.6-2.3h-3.4l-1.6 2.3a2.7 2.7 0 0 1-4.7-1.2l-.9-4.3a4.6 4.6 0 0 1 4.5-5.5z"/><path d="M8.2 10.4v3.2M6.6 12h3.2"/><circle cx="15.6" cy="10.9" r=".9" fill="currentColor" stroke="none"/><circle cx="17.3" cy="12.9" r=".9" fill="currentColor" stroke="none"/>'),
    rating: navSvg('<path class="f" d="M7.6 4h8.8v5.2a4.4 4.4 0 0 1-8.8 0z"/><path d="M7.6 5.6H4.5a3.3 3.3 0 0 0 3.4 4.2M16.4 5.6h3.1a3.3 3.3 0 0 1-3.4 4.2M12 13.6v3.4M8.4 20.5h7.2M9.6 20.5l.5-3.5h3.8l.5 3.5"/>'),
  };
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
      ${Palette.buttonHtml("l1BarPalette")}
      ${Theme.buttonHtml("", "l1BarTheme")}
      <button type="button" id="l1BarStreak" class="l1-pill hidden" aria-label="Doimiylik kalendari">🔥<span id="l1BarStreakNum">0</span></button>
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
    Palette.bind(bar);
    $("l1BarAvatar").addEventListener("click", openProfile);
    $("l1BarStreak").addEventListener("click", () => { Haptic.tap(); openStreakCalendar(); });
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
      `<button type="button" data-tab="${t}" aria-label="${labels[t]}">${NAV_ICONS[t]}<span>${labels[t]}</span>${t === "tasks" ? '<i class="l1-badge-dot hidden" id="l1TasksDot"></i>' : ""}</button>`).join("")}</div>`;
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
    const hub = $("l1Hub");
    if (hub) hub.classList.toggle("hidden", tab !== "learn");
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
    if (window.L1_Hub) window.L1_Hub.onTab(tab);

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
      document.body.classList.remove("l1-teacher-view");
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
    document.body.classList.toggle("l1-teacher-view", !isStudentMode()); // no Pomodoro tomato over the teacher panel
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
#l1LevelGate button b{font-size:28px;font-weight:800;color:var(--l1-primary,#2f5bea)}
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
  // Calls that come while one is on its way share it: sign-in, tab switches and the timers asked for the same
  // assignments and leaderboard two or three times in a row.
  let refreshing = null;
  Shell.refresh = function () {
    if (!refreshing) refreshing = refreshNow().finally(() => { refreshing = null; });
    return refreshing;
  };
  async function refreshNow() {
    if (!user() || !window.l1GetToken()) return;
    Shell.lastRefresh = Date.now();
    try {
      const [asg, board] = await Promise.all([api("/api/assignments"), loadBoard("week")]);
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
    if (dot) dot.classList.toggle("hidden", !(activeTasks().some((a) => !a.my.done) || (!isSunday() && openHomework() && !homeworkDoneToday())));
  }
  const nowTs = () => Shell.data.now + (Date.now() / 1000 - (Shell.data.fetchedAt || Date.now() / 1000));
  // hw_<lesson> are the permanent daily homeworks (Vazifalar); everything else is a teacher's assignment
  const isHw = (a) => String(a.id).startsWith("hw_");
  const activeTasks = () => (Shell.data.assignments || []).filter((a) => !isHw(a) && a.deadline > nowTs());
  const isSunday = () => new Date().getDay() === 0;
  const dayStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime() / 1000; };
  const homeworkDoneToday = () => (Shell.data.assignments || []).some((a) => isHw(a) && a.my && a.my.done && a.my.finishedAt >= dayStart());
  // the next homework that can be started right now, if there is one
  const openHomework = () => { const p = window.L1_Hub && window.L1_Hub.nextHomework(); return p && p.hwOpen ? p : null; };

  // ------------------------------------------------------------------ header
  function renderBar() {
    const u = user();
    if (!u) return;
    $("l1BarAvatar").innerHTML = avatar(u, 40);
    const hello = document.querySelector("#l1AppBar .l1-hello");
    if (hello) {
      // the first word only: name-only accounts keep the whole name in firstName, which did not fit the bar
      hello.textContent = String(u.firstName || u.name || "").trim().split(/\s+/)[0] || "";
      hello.style.cssText = "font-weight:800;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    }
    const me = Shell.data.me;
    $("l1BarPointsNum").textContent = me ? me.weekPoints : "0";
    $("l1BarPoints").setAttribute("aria-label", `Haftalik ballar: ${me ? me.weekPoints : 0}. Reytingni ochish`);
    const streak = $("l1BarStreak");
    const days = me ? me.streak || 0 : 0;
    streak.classList.toggle("hidden", !isStudentMode());
    streak.classList.toggle("is-cold", days === 0);
    streak.title = `Doimiylik: ${days} kun`;
    $("l1BarStreakNum").textContent = days;
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
            <div class="text-[12px] font-semibold opacity-90 mt-1">${a.exercises.length} ta mashq · ${a.questionCount} ta savol</div>
          </div>
          <div class="flex items-center justify-between text-[12px] font-bold">
            <span>⏰ ${open ? `<span class="l1-left" data-end="${a.deadline}"></span> qoldi` : "Muddat tugagan"}</span>
            <span class="opacity-90">${html(fmtDate(a.deadline))}</span>
          </div>
          <div class="l1-progress"><i style="width:${pct}%"></i></div>
          <div class="flex items-center justify-between gap-3">
            <div class="text-[14px] font-bold">${a.my.resolved}/${a.my.total} savol · <span class="l1-coin" style="display:inline-grid;vertical-align:-3px">★</span> ${a.my.points} ball</div>
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
        <span class="${open ? "hw-left" : ""}">${open ? `⏰ <span class="l1-left" data-end="${a.deadline}"></span> qoldi` : "Muddat: tugagan"}</span>
        <span>${html(fmtDate(a.deadline))}</span>
      </div>
      <div class="l1-progress"><i style="width:${pct}%"></i></div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-[12px] font-bold text-[color:var(--l1-muted)]">${a.my.resolved}/${a.my.total} savol${a.my.firstTry ? ` · ${a.my.firstTry} tasi 1-urinishda` : ""}</span>
        <button type="button" class="l1-btn ${a.my.done ? "l1-btn-soft" : "l1-btn-primary"} l1-btn-sm" data-open-task="${html(a.id)}">${btn}</button>
      </div>
      <details class="group">
        <summary class="cursor-pointer list-none text-[12px] font-extrabold text-[color:var(--l1-primary)]">Mashqlar ro'yxati va ballsiz mashq ▾</summary>
        <div class="mt-2 space-y-1.5">${a.exercises.map((ex) => `
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl l1-subrow">
            <span class="text-[14px] font-bold min-w-0 truncate">${html(ex.title)} <span class="l1-sub">(${ex.questionCount})</span></span>
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
    // The card is the design's meadow with the 3D-look tree (tree_art.js card(), vector so it stays sharp; tap = the map) and
    // one row of three buttons of the same size: the Pomodoro clock (play / pause and the time; tap = start or pause), Xarita
    // and Ekish (it carries the count of trees not planted yet). The time is not in the markup: tickTime fills it in after a
    // paint and on every tick, so nothing is redrawn each second.
    const PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.8v12.4a1 1 0 0 0 1.5.9l9.7-6.2a1 1 0 0 0 0-1.7L10 4.9a1 1 0 0 0-1.5.9z"/></svg>';
    const PAUSE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.3"/><rect x="13.5" y="5" width="4" height="14" rx="1.3"/></svg>';
    const SCENE_SVG = `<svg class="hm-city-scene" viewBox="0 0 360 200" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <defs><linearGradient id="hmCitySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8d4"/><stop offset="1" stop-color="#e6f6d9"/></linearGradient>
        <linearGradient id="hmCityPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#27a24a"/><stop offset="1" stop-color="#3cb957"/></linearGradient></defs>
      <rect width="360" height="200" fill="url(#hmCitySky)"/>
      <g fill="#fff" opacity=".95"><ellipse cx="236" cy="38" rx="20" ry="9"/><ellipse cx="250" cy="31" rx="14" ry="11"/><ellipse cx="322" cy="56" rx="17" ry="8"/><ellipse cx="334" cy="50" rx="12" ry="9"/><ellipse cx="282" cy="104" rx="15" ry="7"/></g>
      <path d="M150 150c30-34 62-40 94-24s58 4 82-10 34-6 34-6v90H150z" fill="#8fd37f"/>
      <path d="M130 168c50-20 120-22 230-14v46H130z" fill="#62c060"/>
      <g fill="#4fae52"><circle cx="196" cy="160" r="13"/><circle cx="208" cy="154" r="10"/><circle cx="342" cy="150" r="14"/><circle cx="326" cy="158" r="10"/></g>
      <path d="M0 0h205c14 30-12 62 2 98 12 32-26 70-54 102H0z" fill="url(#hmCityPanel)"/>
    </svg>`;
    function tickTime() {
      const t = $("l1PomoTime");
      if (!t) return;
      const sec = Math.max(0, Math.ceil(stats().left / 1000));
      const text = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
      if (t.textContent !== text) t.textContent = text;
    }
    function html() {
      const f = stats();
      const idle = f.status === "idle", paused = f.status === "paused";
      const label = idle ? "Boshlash" : paused ? "Davom etish" : "Pauza";
      return `<section class="hm-city" id="l1Pomo">
        ${SCENE_SVG}
        <div class="hm-city-top">
          <div class="hm-city-head">
            <div class="hm-city-title" data-keep-emoji>Yashil shahar</div>
            <div class="hm-city-sub"><b>${f.city}</b> daraxt · siz <b>${f.mine}</b></div>
          </div>
          <button type="button" class="hm-city-tree" data-pomo="map" aria-label="Yashil shahar xaritasi">${window.L1_TreeArt ? L1_TreeArt.card() : L1Icon3D("tree")}</button>
        </div>
        <div class="hm-city-btns">
          <button type="button" class="hm-city-btn" data-pomo="start" aria-label="${label}"><i class="hm-play">${idle || paused ? PLAY_SVG : PAUSE_SVG}</i><span class="hm-time" id="l1PomoTime"></span></button>
          <button type="button" class="hm-city-btn" data-pomo="map">🗺️ Xarita</button>
          <button type="button" class="hm-city-btn" data-pomo="plant" aria-label="Ekish${f.unplanted ? `: ${f.unplanted} ta ekilmagan` : ""}">🌱 Ekish${f.unplanted ? `<b>${f.unplanted}</b>` : ""}</button>
        </div></section>`;
    }
    function paint() { repaintPart($("l1Home"), "l1Pomo", html()); tickTime(); paintGoals(); }
    document.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-pomo]");
      if (!b || !window.L1_Focus) return;
      Haptic.tap();
      if (b.dataset.pomo === "start") { if (stats().status === "idle") window.L1_Focus.open(); else window.L1_Focus.toggle(); }
      else if (b.dataset.pomo === "plant") window.L1_Green && window.L1_Green.open({ plant: true });
      else if (b.dataset.pomo === "map") window.L1_Focus.openMap();
    });
    window.addEventListener("l1:focus-summary", paint);
    // the clock ticks every second, whatever page the student has been on
    window.addEventListener("l1:focus-tick", tickTime);
    return { html, tickTime };
  })();

  // ------------------------------------------------------------------ Home
  const POMO_GOAL = 3; // finished Pomodoros a day
  const LESSON_GOAL = 1; // lessons learned a day
  const GAME_CARDS = [
    { id: "wordrun", ref: "wordrun", name: "Word Run", tag: "Yugur va so'z tangalarini yig'", pic: "/static/arcade/wordrun/coin.webp?v=1" },
    { id: "penalty", ref: "penalty", name: "Penalti", tag: "To'g'ri javob — gol!", pic: "/static/arcade/penalty/ball.webp?v=1" },
    { id: "ninja", ref: "ninja", name: "Word Ninja", tag: "To'g'ri rasmni kes", pic: "/static/arcade/ninja/t_watermelon.webp?v=1" },
    { id: "river", ref: "river", name: "Daryodan o'tish", tag: "Kerakli narsalarni olib bor, jigar!", emoji: "⛵" },
  ];
  const CHEVRON = '<svg class="hm-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg>';
  // A goal shows its 3D picture; a finished one gets a green tick on it and a green tile.
  const DONE_BADGE = '<i class="hm-done-badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4L18 8.5"/></svg></i>';
  // A goal with a deadline wears a chip with the time left (filled by tickCountdowns, so the markup stays the same).
  const goalIcon = (g) => `<span class="hm-goal-ico">${g.pic ? L1Icon3D(g.pic) : `<span class="hm-goal-emo">${g.icon}</span>`}${g.frac >= 1 ? DONE_BADGE : ""}${
    g.end ? `<i class="hm-goal-left l1-left" data-end="${g.end}" aria-label="Muddatgacha qolgan vaqt"></i>` : ""}</span>`;
  // The Vazifa goal counts down to the nearest deadline: an unfinished teacher test, or midnight for today's homework.
  function taskDeadline(dailyOpen) {
    const ends = activeTasks().filter((a) => !a.my.done).map((a) => a.deadline);
    if (dailyOpen) ends.push(dayStart() + 86400);
    return ends.length ? Math.min(...ends) : 0;
  }

  // Lessons the student marked as learned today (app_main.js keeps the time of each, per student).
  function lessonsToday() {
    try {
      const log = (window.l1LearnedLog && window.l1LearnedLog()) || {};
      const start = new Date(); start.setHours(0, 0, 0, 0);
      return Object.values(log).filter((at) => at >= start.getTime()).length;
    } catch (e) { return 0; }
  }

  // Today's three goals. Pomodoros have a target (3); a lesson and the daily homework have none: the student can do as many as
  // they like, the goal is met by doing one. Sunday is the day off for homework.
  function dailyGoals() {
    const f = window.L1_Focus ? window.L1_Focus.summary() : { today: 0 };
    const lessonDone = lessonsToday() > 0;
    const hub = window.L1_Hub;
    const goals = [
      { key: "pomo", icon: "🍅", pic: "tomato", name: "Pomidor", frac: f.today / POMO_GOAL, text: `${Math.min(f.today, POMO_GOAL)}/${POMO_GOAL}` },
    ];
    const allLearned = hub && !hub.nextLesson();
    goals.push({ key: "lessons", icon: "📖", pic: "book", name: "Dars", frac: lessonDone ? 1 : 0, text: lessonDone ? "Bajarildi" : allLearned ? "Takrorlash" : "Boshlash" });
    if (isSunday()) goals.push({ key: "tasks", icon: "🌴", name: "Vazifa", frac: 0, text: "Dam olish", rest: true, end: taskDeadline(false) });
    else {
      const left = hub && hub.nextHomework();
      const done = homeworkDoneToday() || (hub && !left);
      goals.push({ key: "tasks", icon: "📝", pic: "task", name: "Vazifa", frac: done ? 1 : 0, text: done ? "Bajarildi" : "Boshlash", end: taskDeadline(!done) });
    }
    return goals;
  }
  function goalsHtml() {
    return dailyGoals().map((g) => `<button type="button" class="hm-goal${g.frac >= 1 ? " is-done" : ""}" data-hm="${g.key}">${goalIcon(g)}
      <b>${g.text}</b><span>${g.name}</span></button>`).join("");
  }
  function goalCount() { const g = dailyGoals().filter((x) => !x.rest); const n = g.filter((x) => x.frac >= 1).length; return `<span class="hm-count${n === g.length ? " is-done" : ""}">${n === g.length ? "🎉 " : ""}${n}/${g.length}</span>`; }
  const goalsBlock = () => `<div class="hm-goals" id="hmGoals">${goalsHtml()}</div>`;
  const countBlock = () => `<span id="hmGoalCount">${goalCount()}</span>`;
  function paintGoals() { const page = $("l1Home"); repaintPart(page, "hmGoals", goalsBlock()); repaintPart(page, "hmGoalCount", countBlock()); tickCountdowns(); }
  // The goal buttons are drawn again on their own (paintGoals), so their taps are caught once for the whole page. A listener
  // put on each button was lost with every redraw, and then the goal (the Pomidor most of all) did nothing when tapped.
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest && ev.target.closest("[data-hm]");
    if (!b) return;
    Haptic.tap();
    if (b.dataset.hm === "pomo") window.L1_Focus && window.L1_Focus.open();
    else if (b.dataset.hm === "lessons") { if (window.L1_Hub) window.L1_Hub.openNextLesson(); else Shell.go("learn"); }
    else startHomework();
  });
  // "Vazifa" goes straight to the next homework when it is open, otherwise to the page that says what is missing.
  function startHomework() {
    const p = openHomework();
    if (p && window.L1_Tasks) window.L1_Tasks.open(p.asg.id);
    else Shell.go("tasks");
  }
  window.addEventListener("l1:lesson-learned", () => { paintGoals(); });
  window.addEventListener("l1:progress-changed", () => { paintGoals(); if (Shell.tab === "tasks") renderTasks(); });

  function gameCardsHtml() {
    const me = Shell.data.me || {};
    const week = me.gameWeek || {};
    return GAME_CARDS.map((g) => {
      const pts = week[g.ref] || 0;
      const status = pts ? `Bu hafta +${pts} ball` : g.tag;
      return `<button type="button" class="hm-game" data-game="${g.id}">
        <span class="hm-game-ico" aria-hidden="true">${g.pic ? `<img class="hm-game-pic" src="${g.pic}" alt="" decoding="async">` : `<span class="hm-game-emo">${g.emoji}</span>`}</span>
        <span class="hm-game-txt"><span class="hm-game-name">${g.name}</span><span class="hm-game-status">${html(status)}</span></span>${CHEVRON}</button>`;
    }).join("");
  }

  // ------------------------------------------------------------------ Home greeting
  // The hero greets with a different phrase depending on how the student has been doing (no name in these phrases).
  const GREET = {
    newcomer: [
      "Qarsaklar! Bugungi kunning bosh qahramoni keldi!", "Salom! ChatGPT bugun dam olsin. Endi o'zingiz ishlang.",
      "Band 9 sizni kutyapti. Faqat uxlab qolmang.", "Voy, mehmon kelibdi! Lekin choy yo'q, vazifa bor!",
      "Ana, mijozimiz keldi! Bugun miyangizga xizmat ko'rsatamiz.",
    ],
    away: [
      "Sizni sog'indik. Ingliz tili ham xafa bo'lib yurgandi.",
      "Tirikmisiz? Ingliz tili sizni bedarak yo'qolganlar ro'yxatiga kiritay dedi!",
    ],
  };
  const DAY = 86400000;
  // Worked out once per page load and student: how long the student was away and on how many different days they visited.
  let visitInfo = null;
  function visit() {
    const u = user();
    const key = "l1_visits_v1_" + ((u && (u.id || u.name)) || "guest");
    if (visitInfo && visitInfo.key === key) return visitInfo;
    let rec = {};
    try { rec = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch (e) { rec = {}; }
    const now = Date.now();
    const today = new Date().toDateString();
    const days = Array.isArray(rec.days) ? rec.days : [];
    visitInfo = { key, first: !rec.last, awayDays: rec.last ? Math.floor((now - rec.last) / DAY) : 0, visitDays: days.length + (days.includes(today) ? 0 : 1) };
    if (!days.includes(today)) days.push(today);
    try { localStorage.setItem(key, JSON.stringify({ last: now, days: days.slice(-60), shown: rec.shown || {} })); } catch (e) {}
    return visitInfo;
  }

  function greetingKind(me) {
    const f = window.L1_Focus ? window.L1_Focus.summary() : { today: 0 };
    const tasks = activeTasks();
    const total = tasks.reduce((n, a) => n + (a.my ? a.my.total : 0), 0);
    const done = tasks.reduce((n, a) => n + (a.my ? a.my.resolved : 0), 0);
    const streak = me ? me.streak || 0 : 0;
    const weekPoints = me ? me.weekPoints || 0 : 0;
    if (visit().awayDays >= 3 && !(streak > 0)) return "away";
    if (visit().visitDays <= 3) return "newcomer";
    return "";
  }

  // The phrase changes now and then: the same one stays for 20 minutes, a new visit picks another one of its kind.
  function greetingText(me) {
    const kind = greetingKind(me);
    const list = GREET[kind];
    if (!list) return "";
    let rec = {};
    try { rec = JSON.parse(localStorage.getItem(visit().key) || "{}") || {}; } catch (e) { rec = {}; }
    const shown = rec.shown || {};
    const now = Date.now();
    let cur = shown[kind];
    if (!cur || !list.includes(cur.text) || now - cur.at > 20 * 60 * 1000) {
      const pool = list.length > 1 ? list.filter((t) => !cur || t !== cur.text) : list;
      cur = { text: pool[Math.floor(Math.random() * pool.length)], at: now };
      shown[kind] = cur;
      try { localStorage.setItem(visit().key, JSON.stringify({ ...rec, shown })); } catch (e) {}
    }
    return cur.text;
  }

  // ------------------------------------------------------------------ Word of the day (greeting card)
  // One word a day from "4000 Essential English Words" (books 1-6, 600 words each), in book order: book 1 unit 1 first, then on
  // through every unit and book. Uzbek meaning, definition, example and the book picture live in /static/words4000/b<N>.json.
  const WORD_START = Date.UTC(2026, 9, 23) / 86400000;   // 23 Oct 2026 = word no. 1
  const WORD_BOOKS = 6, WORD_PER_BOOK = 600, WORD_PER_UNIT = 20;
  const WORD_POS = { n: "ot", v: "fe'l", adj: "sifat", adv: "ravish", prep: "predlog", conj: "bog'lovchi", pron: "olmosh", interj: "undov", det: "aniqlovchi" };
  const wordCache = {};
  function wordIndex() {
    const d = new Date();
    const day = Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
    const total = WORD_BOOKS * WORD_PER_BOOK;
    return (((day - WORD_START) % total) + total) % total;
  }
  // The picture is drawn here (emoji scene on a coloured card), so no book images are used.
  function wordHue(t) { let h = 0; for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
  function todaysWord() {
    const i = wordIndex(), book = Math.floor(i / WORD_PER_BOOK) + 1, at = i % WORD_PER_BOOK;
    const load = wordCache[book] || (wordCache[book] = fetch(`/static/words4000/b${book}.json?v=2`).then((r) => { if (!r.ok) throw new Error("words"); return r.json(); }));
    load.catch(() => { delete wordCache[book]; });
    return load.then((list) => (list[at] ? { ...list[at], book, unit: Math.floor(at / WORD_PER_UNIT) + 1, no: i + 1 } : null));
  }
  function speakWord(text) {
    try { if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9; speechSynthesis.speak(u); } } catch (e) { /* no speech */ }
  }
  const TICK_SVG = '<svg class="hm-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" pathLength="1"/></svg>';
  // a daily card (word / fact) shows a tick once the student has read it today
  const dailyRead = (key) => { try { return localStorage.getItem(key) === new Date().toDateString(); } catch (e) { return false; } };
  function markDailyRead(key, sel) {
    if (dailyRead(key)) return;
    try { localStorage.setItem(key, new Date().toDateString()); } catch (e) {}
    const b = document.querySelector(sel);
    if (!b) return;
    Sound.ok && Sound.ok();
    b.classList.add("is-read", "is-just-read");
    const chev = b.querySelector(".hm-chev");
    if (chev) chev.remove();
    b.insertAdjacentHTML("beforeend", TICK_SVG);
    setTimeout(() => b.classList.remove("is-just-read"), 1200);
  }
  const WORD_KEY = "l1_word_read_v1";
  function wordBtnHtml() {
    todaysWord().catch(() => {});   // warm the cache so the card opens at once
    const read = dailyRead(WORD_KEY);
    return `<button type="button" class="hm-fact hm-wordpill${read ? " is-read" : ""}" data-word aria-label="Bugungi so'z"><span class="hm-fact-ico">${L1Icon3D("book")}</span><b>Bugungi so'z</b>${read ? TICK_SVG : CHEVRON}</button>`;
  }
  async function openWord() {
    let w = null;
    try { w = await todaysWord(); } catch (e) { /* offline */ }
    if (!w) { (typeof showToast === "function") && showToast("So'z yuklanmadi, internetni tekshiring"); return; }
    Haptic.tap();
    const back = document.createElement("div");
    back.className = "l1-sheet-backdrop";
    const sheet = document.createElement("div");
    sheet.className = "l1-sheet l1-sheet-center";
    const pos = WORD_POS[(w.pos || "").replace(/\.$/, "")] || "";
    sheet.innerHTML = `<div class="l1-grip"></div>
      <div class="wd-sheet">
        <div class="wd-pic" style="--wd-h:${wordHue(w.word)}"><span>${html(w.em || "📘")}</span></div>
        <div class="wd-kicker">Bugungi so'z · ${w.book}-kitob · ${w.unit}-unit</div>
        <div class="wd-row"><h3>${html(w.word)}</h3><button type="button" class="wd-say" data-act="say" aria-label="Eshitish">🔊</button></div>
        <div class="wd-meta">${pos ? html(pos) + " · " : ""}${w.no} / ${WORD_BOOKS * WORD_PER_BOOK}</div>
        <div class="wd-uz">${html(w.uz)}</div>
        <p class="wd-def">${html(w.def)}</p>
        <button type="button" class="wd-ex" data-act="say-ex"><b>${html(w.ex)}</b><span>${html(w.exuz)}</span></button>
        <button type="button" class="l1-btn l1-btn-soft w-full" data-act="close">Yopish</button>
      </div>`;
    const close = () => { back.remove(); sheet.remove(); Back.remove(handler); try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } markDailyRead(WORD_KEY, "[data-word]"); };
    const handler = Back.push(close);
    back.addEventListener("click", close);
    sheet.addEventListener("click", (ev) => {
      const a = ev.target.closest("[data-act]");
      if (!a) return;
      if (a.dataset.act === "close") close();
      else if (a.dataset.act === "say") speakWord(w.word);
      else if (a.dataset.act === "say-ex") speakWord(w.ex);
    });
    document.body.appendChild(back);
    document.body.appendChild(sheet);
  }

  // ------------------------------------------------------------------ Daily fact (greeting card)
  function todaysFact() {
    const u = user() || {};
    return window.L1_Facts ? window.L1_Facts.today(u.level || "A1") : null;
  }
  const goalsAllDone = () => { const g = dailyGoals().filter((x) => !x.rest); return g.length > 0 && g.every((x) => x.frac >= 1); };
  // Shakespeare greeting. The waving picture draws him about 5% smaller inside its frame than the other poses, so its box is
  // 5% bigger than the 121 px banners on the other tabs (polish.css .shk-banner) and he looks the same size everywhere.
  const MASCOT_SIZE = 127;
  const wavingHtml = (size) => `<div class="hm-mascot" style="--hm-mascot:${size}px"><img src="/static/shakespeare/shakespeare-greeting.webp" alt="Shakespeare" draggable="false"></div>`;
  const FACT_KEY = "l1_fact_read_v1";
  const factRead = () => dailyRead(FACT_KEY);
  function factBtnHtml() {
    const f = todaysFact();
    if (!f) return "";
    const read = factRead();
    return `<button type="button" class="hm-fact${read ? " is-read" : ""}" data-fact aria-label="Kunning fakti"><span class="hm-fact-ico"><i class="l1-coin" aria-hidden="true">★</i></span><b>Kunning fakti</b>${read ? TICK_SVG : CHEVRON}</button>`;
  }
  function openFact() {
    const f = todaysFact();
    if (!f) return;
    Haptic.tap();
    const back = document.createElement("div");
    back.className = "l1-sheet-backdrop";
    const sheet = document.createElement("div");
    sheet.className = "l1-sheet l1-sheet-center";
    sheet.innerHTML = `<div class="l1-grip"></div>
      <div class="hm-fact-sheet">
        <div class="hm-fact-big">${f.icon}</div>
        <div class="hm-fact-kicker">Kunning fakti</div>
        <h3>${html(f.title)}</h3>
        <p>${html(f.text)}</p>
        <button type="button" class="l1-btn l1-btn-soft w-full" data-act="close">${f.english ? "Got it!" : "Tushunarli!"}</button>
      </div>`;
    const close = () => { back.remove(); sheet.remove(); Back.remove(handler); };
    const handler = Back.push(close);
    back.addEventListener("click", close);
    sheet.addEventListener("click", (ev) => {
      if (!ev.target.closest('[data-act="close"]')) return;
      close();
      markDailyRead(FACT_KEY, "[data-fact]");
    });
    document.body.appendChild(back);
    document.body.appendChild(sheet);
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
    const phrase = greetingText(me);

    const drawn = paint(el, `<div class="l1-page space-y-4">
      <section class="hm-hero">
        <div class="hm-hero-text">
          <div class="hm-greet">${phrase ? `<div class="hm-phrase">${html(phrase)}</div>`
            : `<div class="hm-kicker">${hello},</div><div class="hm-name">${html(first)}!</div>`}
            <div class="hm-sub">Keling, bugun bir soatgina dars qilamiz. Quyidagi pomidorning ustiga bosing.</div></div>
          <div class="hm-daily">${wordBtnHtml()}${factBtnHtml()}</div>
        </div>
        ${wavingHtml(MASCOT_SIZE)}
      </section>

      <section class="hm-card">
        <div class="hm-card-head"><h2>Bugungi maqsadlar</h2>${part("hmGoalCount", countBlock())}</div>
        ${part("hmGoals", goalsBlock())}
      </section>

      ${part("l1Pomo", Pomo.html())}

      <section class="hm-games" aria-label="O'yinlar">${gameCardsHtml()}</section>

      ${top3.length ? `<section class="hm-card">
        <div class="hm-card-head"><h2>Hafta yetakchilari</h2><button type="button" class="hm-more" data-go="rating">Hammasi ›</button></div>
        <div class="hm-top">${top3.map((e) => `
          <div class="hm-top-i r${e.rank}${me && e.id === me.id ? " is-me" : ""}">
            <span class="hm-medal">${["🥇", "🥈", "🥉"][e.rank - 1] || e.rank}</span>${avatar(e, e.rank === 1 ? 60 : 52)}
            <b>${html((e.name || "").split(" ")[0])}</b><span>${e.points} ball</span></div>`).join("")}</div>
      </section>` : ""}
    </div>`);
    Pomo.tickTime();
    tickCountdowns();
    if (!drawn) return;
    wireTaskButtons(el);
    const fb = el.querySelector("[data-fact]");
    if (fb) fb.addEventListener("click", openFact);
    const wb = el.querySelector("[data-word]");
    if (wb) wb.addEventListener("click", openWord);
    el.querySelectorAll("[data-game]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      Shell.go("games");
      if (window.L1_Nav) window.L1_Nav.setGameSub(b.dataset.game);
    }));
  }

  // ------------------------------------------------------------------ Tasks
  // Kunlik vazifalar: one homework per lesson, in lesson order. A homework opens once its lesson is learned, the lesson's
  // practice is done and the homework before it is finished. Sunday is a day off; the student may still catch up or play.
  const NEED_TEXT = {
    lesson: (p) => `Avval ${p.lesson.n}-darsni o'zlashtiring.`,
    practice: (p) => `${p.lesson.n}-dars mashqlarini tugating (3 ta mashq, har biri kamida 60%).`,
    prev: () => "Avval oldingi vazifani tugating.",
    loading: () => "Yuklanmoqda…",
  };
  function homeworkToday(plan) {
    const nh = plan.find((p) => !p.hwDone);
    const rest = isSunday();
    if (!plan.length) return "";
    if (!nh) return `<div class="hw-today"><div class="hw-kicker">Barakalla!</div><h2>🎉 Barcha kunlik vazifalar bajarilgan</h2>
      <p>Yangi darslar qo'shilganda yangi vazifalar ham chiqadi. Hozircha o'yin o'ynab, so'zlarni takrorlang.</p></div>`;
    const t = nh.asg ? `${nh.lesson.n}-dars: ${nh.lesson.title}` : nh.lesson.title;
    const info = nh.asg ? `${nh.asg.exercises.length} ta mashq · ${nh.asg.questionCount} ta savol` : "";
    const btn = nh.hwOpen
      ? `<button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-open-task="${html(nh.asg.id)}">${nh.asg.my.started ? "Davom etish" : "Boshlash"} →</button>`
      : nh.need.includes("lesson") ? `<button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-hub="lesson" data-id="${html(nh.lesson.id)}">Darsga o'tish →</button>`
      : nh.need.includes("practice") ? `<button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-hub="practice" data-id="${html(nh.lesson.id)}">Mashq qilish →</button>` : "";
    if (rest) return `<div class="hw-today is-rest"><div class="hw-kicker">Yakshanba</div><h2>🌴 Bugun dam olish kuni</h2>
      <p>Bugun yangi vazifa yo'q. Xohlasangiz o'yin o'ynang${nh.hwOpen ? " yoki bajarilmagan vazifani bajaring" : ""}.</p>
      <div class="flex flex-wrap gap-2"><button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-go="games">🎮 O'yinlar</button>${nh.hwOpen ? btn : ""}</div></div>`;
    return `<div class="hw-today"><div class="hw-kicker">${nh.hwOpen ? "Bugungi vazifa" : "Bugungi vazifa · hali yopiq"}</div><h2>${html(t)}</h2>
      <p>${nh.hwOpen ? html(info) : html((NEED_TEXT[nh.need[0]] || (() => ""))(nh))}</p>${btn}</div>`;
  }
  function homeworkRows(plan) {
    return plan.map((p) => {
      const a = p.asg;
      const state = p.hwDone ? "is-done" : p.hwOpen ? "is-open" : "is-locked";
      const sub = p.hwDone ? `Bajarildi ✓ · ${a.my.points} ball`
        : p.hwOpen ? (a.my.started ? `${a.my.resolved}/${a.my.total} savol bajarilgan` : `${a.exercises.length} ta mashq · ${a.questionCount} ta savol`)
        : html((NEED_TEXT[p.need[0]] || (() => ""))(p));
      const num = p.hwDone ? "✓" : p.hwOpen ? p.lesson.n : "🔒";
      return `<div class="hw-row ${state}" ${a && (p.hwOpen || p.hwDone) ? `data-open-task="${html(a.id)}" role="button" tabindex="0"` : `data-hw-locked="${html(p.need[0] || "")}"`}>
        <span class="hub-num ${p.hwDone ? "is-done" : p.hwOpen ? "" : "is-locked"}">${num}</span>
        <span class="hub-body"><span class="hub-name">${html(p.lesson.title)}</span><span class="hub-desc" style="display:block">${sub}</span></span>
        <span class="hub-side">${p.hwDone ? "" : p.hwOpen ? "›" : ""}</span></div>`;
    }).join("");
  }

  // Lug'at vazifalari: one homework per vocabulary unit (hw_v_1a ... hw_v_2g, in that order), each open once the one before
  // it is finished (the server checks the same).
  const isVocabHw = (a) => String(a.id).startsWith("hw_v_");
  function vocabPlan() {
    const list = (Shell.data.assignments || []).filter(isVocabHw).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    let prevDone = true;
    return list.map((a, i) => { const p = { asg: a, n: i + 1, done: !!a.my.done, open: prevDone }; prevDone = p.done; return p; });
  }
  const vocabName = (a) => String(a.title).replace(/^Lug'at \d+:\s*/, "");
  function vocabToday(plan) {
    const nv = plan.find((p) => !p.done);
    if (!plan.length) return "";
    if (!nv) return `<div class="hw-today is-vocab"><div class="hw-kicker">Barakalla!</div><h2>🎉 Barcha lug'at vazifalari bajarilgan</h2>
      <p>Yangi so'zlar qo'shilganda yangi vazifalar ham chiqadi.</p></div>`;
    const a = nv.asg;
    return `<div class="hw-today is-vocab"><div class="hw-kicker">Keyingi lug'at vazifasi · ${html(a.weekLabel || "")}</div><h2>${html(vocabName(a))}</h2>
      <p>${a.exercises.length} ta mashq · ${a.questionCount} ta savol</p>
      <button type="button" class="l1-btn l1-btn-white l1-btn-sm" data-open-task="${html(a.id)}">${a.my.started ? "Davom etish" : "Boshlash"} →</button></div>`;
  }
  function vocabRows(plan) {
    return plan.map((p) => {
      const a = p.asg;
      const state = p.done ? "is-done" : p.open ? "is-open" : "is-locked";
      const sub = p.done ? `Bajarildi ✓ · ${a.my.points} ball`
        : p.open ? (a.my.started ? `${a.my.resolved}/${a.my.total} savol bajarilgan` : `${a.exercises.length} ta mashq · ${a.questionCount} ta savol`)
        : "Avval oldingi lug'at vazifasini tugating.";
      return `<div class="hw-row ${state}" ${p.done || p.open ? `data-open-task="${html(a.id)}" role="button" tabindex="0"` : `data-hw-locked="vocab"`}>
        <span class="hub-num ${p.done ? "is-done" : p.open ? "" : "is-locked"}">${p.done ? "✓" : p.open ? p.n : "🔒"}</span>
        <span class="hub-body"><span class="hub-name">${html(vocabName(a))}</span><span class="hub-desc" style="display:block">${html(a.weekLabel || "")} · ${sub}</span></span>
        <span class="hub-side">${p.done ? "" : p.open ? "›" : ""}</span></div>`;
    }).join("");
  }
  let tasksSub = "grammar";
  try { if (localStorage.getItem("l1_tasks_sub_v1") === "vocab") tasksSub = "vocab"; } catch (e) { /* first visit */ }

  // Vazifalar: the teacher's tests with their time left on top, then the daily homework, Grammatika or Lug'at.
  function renderTasks() {
    const el = $("l1Tasks");
    if (!el || Shell.tab !== "tasks") return;
    const all = Shell.data.assignments;
    const teacher = (all || []).filter((a) => !isHw(a));
    const now = nowTs();
    const active = teacher.filter((a) => a.deadline > now).sort((a, b) => a.deadline - b.deadline);
    const past = teacher.filter((a) => a.deadline <= now);
    const plan = window.L1_Hub && all ? window.L1_Hub.plan() : [];
    const vplan = all ? vocabPlan() : [];
    const doneN = plan.filter((p) => p.hwDone).length, vDoneN = vplan.filter((p) => p.done).length;
    const banner = window.L1_Hub ? window.L1_Hub.shk("book", "homework", 121) : "";
    const tests = all === null ? "" : `<section class="hw-tests">
        <div class="flex items-center justify-between px-1"><div class="l1-h2">📝 Testlar</div>${active.length ? `<span class="l1-chip l1-chip-red">${active.length} ta</span>` : ""}</div>
        ${active.length ? active.map((a) => taskCard(a)).join("") : `<div class="hw-tests-empty">Hozircha faol test yo'q. O'qituvchi test berganda shu yerda muddati bilan chiqadi.</div>`}</section>`;
    const rules = `<details class="l1-card hw-rules text-[14px] font-bold">
        <summary><b class="text-[color:var(--l1-success)]">1-urinishda 25 ball</b><span class="hw-rules-more">Qoidalar</span></summary>
        <div class="hw-rules-body">2-urinishda 15 · 3–4-urinishda 5
        <div class="l1-sub">2 ta xatodan keyin maslahat chiqadi. Grammatika vazifasi dars → mashq → vazifa tartibida, lug'at vazifalari ketma-ket ochiladi.</div></div></details>`;
    const grammar = `${homeworkToday(plan)}${plan.length ? `${rules}
      <div class="flex items-center justify-between px-1"><div class="l1-h2">Barcha vazifalar</div><span class="l1-chip l1-chip-blue">${doneN}/${plan.length}</span></div>
      <div class="hw-list">${homeworkRows(plan)}</div>` : ""}`;
    const vocab = `${vocabToday(vplan)}${vplan.length ? `
      <div class="flex items-center justify-between px-1"><div class="l1-h2">Lug'at vazifalari</div><span class="l1-chip l1-chip-blue">${vDoneN}/${vplan.length}</span></div>
      <div class="hw-list">${vocabRows(vplan)}</div>` : `<div class="hw-tests-empty">Lug'at vazifalari yuklanmoqda…</div>`}`;
    const tabs = `<div class="hub-tabs hw-tabs">${[["grammar", "📘 Grammatika"], ["vocab", "📗 Lug'at"]].map(([k, n]) =>
      `<button type="button" data-tsub="${k}" class="${k === tasksSub ? "is-active" : ""}">${n}</button>`).join("")}</div>`;
    const drawn = paint(el, `<div class="l1-page space-y-4">
      ${tests}
      ${banner}
      ${all === null ? `<div class="l1-skeleton" style="height:160px"></div><div class="l1-skeleton" style="height:160px"></div>` : ""}
      ${all === null ? "" : tabs}
      ${all === null ? "" : tasksSub === "vocab" ? vocab : grammar}
      ${past.length ? `<div class="l1-h2 px-1 pt-2">O'tgan testlar</div>${past.map((a) => taskCard(a)).join("")}` : ""}
    </div>`);
    tickCountdowns(); // the time left is filled in here and every second, so the markup above stays the same
    if (!drawn) return;
    wireTaskButtons(el);
    el.querySelectorAll("[data-tsub]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      tasksSub = b.dataset.tsub;
      try { localStorage.setItem("l1_tasks_sub_v1", tasksSub); } catch (e) { /* private mode */ }
      renderTasks();
    }));
    el.querySelectorAll("[data-hw-locked]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.hwLocked;
      if (typeof showToast === "function") showToast(k === "lesson" ? "🔒 Avval shu dars mavzusini o'zlashtiring." : k === "practice" ? "🔒 Avval dars mashqlarini tugating."
        : k === "vocab" ? "🔒 Avval oldingi lug'at vazifasini tugating." : "🔒 Avval oldingi vazifani tugating.");
    }));
    el.querySelectorAll("[data-hub]").forEach((b) => b.addEventListener("click", () => {
      Haptic.tap();
      if (!window.L1_Hub) return;
      Shell.go("learn");
      if (b.dataset.hub === "lesson") window.L1_Hub.openLesson(b.dataset.id); else window.L1_Hub.openPractice(b.dataset.id);
    }));
  }

  // ------------------------------------------------------------------ Rating
  const boardsOnTheWay = {};
  function loadBoard(period) {
    if (!boardsOnTheWay[period]) {
      boardsOnTheWay[period] = api("/api/leaderboard?period=" + period).then((data) => {
        Shell.data.board[period] = data;
        Shell.data.me = data.me;
        return data;
      }).finally(() => { delete boardsOnTheWay[period]; });
    }
    return boardsOnTheWay[period];
  }
  Shell.loadBoard = loadBoard;

  // Renders a leaderboard into `el`: countdown, podium and a Rank / Player / Coins table.
  // Used by the student Rating tab and the teacher panel.
  const CLOCK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2.5h6"/></svg>';
  function fmtLeft(sec) {
    sec = Math.max(0, Math.floor(sec));
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const p2 = (n) => String(n).padStart(2, "0");
    return d ? `${d} kun ${p2(h)}:${p2(m)}:${p2(s)}` : `${p2(h)}:${p2(m)}:${p2(s)}`;
  }
  // The time left to a homework or test deadline: "2 kun 05:12", under a day "05:12:33".
  function fmtDeadline(sec) {
    sec = Math.max(0, Math.floor(sec));
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const p2 = (n) => String(n).padStart(2, "0");
    return d ? `${d} kun ${p2(h)}:${p2(m)}` : `${p2(h)}:${p2(m)}:${p2(s)}`;
  }
  // Only a countdown on screen ticks: one in a hidden tab changed the page every second for nothing. A text is written
  // only when it changed.
  function tickCountdowns() {
    if (document.hidden) return;
    const put = (n, text) => { if (!n.closest(".hidden") && n.textContent !== text) n.textContent = text; };
    document.querySelectorAll(".lb-count[data-end]").forEach((n) => put(n, fmtLeft(Number(n.dataset.end) - nowTs())));
    document.querySelectorAll(".l1-left[data-end]").forEach((n) => put(n, fmtDeadline(Number(n.dataset.end) - nowTs())));
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
        <div><small>Reyting tugashiga qoldi</small><b class="lb-count" data-end="${data.weekEnd}"></b></div></div>` : "";
    const drawn = paint(el, `<div class="lb space-y-4">
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
    </div>`);
    tickCountdowns(); // the countdown text is filled in here (and every second), so the markup above stays the same
    if (!drawn) return;
    el.querySelectorAll("[data-period]").forEach((b) => b.addEventListener("click", () => onPeriod(b.dataset.period)));
  };

  function renderRating() {
    const el = $("l1Rating");
    if (!el || Shell.tab !== "rating") return;
    paint(el, `<div class="l1-page space-y-4">
      ${window.L1_Hub ? window.L1_Hub.shk("trophy", "rating", 121) : ""}
      <div class="l1-sub hidden" id="l1RatingMe"></div>
      <div id="l1RatingBox"></div></div>`);
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
  // ------------------------------------------------------------------ Progress page (graph)
  function progressChart(pts, labels) {
    const W = 320, H = 190, padL = 8, padR = 8, padT = 22, padB = 30;
    const n = pts.length, max = Math.max(10, ...pts);
    const slot = (W - padL - padR) / n, bw = Math.max(4, Math.min(26, slot * 0.62));
    const y = (v) => padT + (H - padT - padB) * (1 - v / max);
    const showVal = n <= 14, step = n <= 7 ? 1 : n <= 14 ? 2 : 5;
    let bars = "", xs = "", line = [];
    pts.forEach((v, i) => {
      const cx = padL + slot * i + slot / 2, top = y(v), h = H - padB - top;
      bars += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, v > 0 ? 3 : 0).toFixed(1)}" rx="${Math.min(6, bw / 2)}" fill="url(#pgBar)" opacity="${i === n - 1 ? 1 : 0.85}"/>`;
      if (showVal && v > 0) bars += `<text x="${cx.toFixed(1)}" y="${(top - 5).toFixed(1)}" text-anchor="middle" class="pg-val">${v}</text>`;
      if ((n - 1 - i) % step === 0) xs += `<text x="${cx.toFixed(1)}" y="${H - 10}" text-anchor="middle" class="pg-x">${labels[i]}</text>`;
      line.push(`${cx.toFixed(1)},${top.toFixed(1)}`);
    });
    return `<svg viewBox="0 0 ${W} ${H}" class="pg-svg" role="img" aria-label="Kunlik ballar grafigi">
      <defs><linearGradient id="pgBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a18"/><stop offset="1" stop-color="#7b2ff7"/></linearGradient></defs>
      <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" class="pg-axis"/>
      ${bars}<polyline points="${line.join(" ")}" class="pg-line"/>${xs}</svg>`;
  }
  const progressGraphHtml = () => `<div class="pg-card">
          <div class="pg-tabs"><button type="button" data-days="7" class="is-on">7 kun</button><button type="button" data-days="14">14 kun</button><button type="button" data-days="30">30 kun</button><button type="button" data-days="60">60 kun</button></div>
          <div class="pg-title">Kunlik ballar</div>
          <div id="pgChart" class="pg-chart"><div class="pg-empty">Yuklanmoqda…</div></div>
          <div id="pgSum" class="pg-sum"></div>
        </div>`;
  // fills the graph card inside `page`; returns the day-range switcher (call it with 7 first)
  function wireProgressGraph(page) {
    const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
    const show = async (days) => {
      page.querySelectorAll("[data-days]").forEach((b) => b.classList.toggle("is-on", +b.dataset.days === days));
      const box = page.querySelector("#pgChart"), sum = page.querySelector("#pgSum");
      let d = null;
      try { d = await api("/api/progress/history?days=" + days); } catch (e) { d = null; }
      if (!d || !Array.isArray(d.points)) { box.innerHTML = '<div class="pg-empty">Ma\'lumotni yuklab bo\'lmadi.</div>'; sum.innerHTML = ""; return; }
      const pts = d.points.map((v) => +v || 0), total = pts.reduce((a, b) => a + b, 0);
      const labels = pts.map((_, i) => { const t = new Date(Date.now() - (pts.length - 1 - i) * 86400000); return days <= 7 ? ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"][t.getDay()] : `${t.getDate()} ${MONTHS[t.getMonth()]}`; });
      if (!total) { box.innerHTML = '<div class="pg-empty">Hali ball yo\'q. Bugun birinchi vazifani bajaring! 🚀</div>'; sum.innerHTML = ""; return; }
      const best = Math.max(...pts), active = pts.filter((v) => v > 0).length;
      box.innerHTML = progressChart(pts, labels);
      sum.innerHTML = `<span>Jami: <b>${total}</b></span><span>O'rtacha: <b>${Math.round(total / pts.length)}</b>/kun</span><span>Eng yaxshi kun: <b>${best}</b></span><span>Faol kunlar: <b>${active}</b>/${pts.length}</span>`;
    };
    page.addEventListener("click", (ev) => {
      const t = ev.target.closest("[data-days]");
      if (t) { Haptic.tap(); show(+t.dataset.days); }
    });
    return show;
  }
  // Level graph: every right practice/homework answer lifts the line, every mistake drops it.
  const levelGraphHtml = () => `<div class="pg-card lv-card">
          <div class="pg-title">Mening darajam</div>
          <div class="lv-sub">To'g'ri javob — grafik ko'tariladi, xato — pasayadi</div>
          <div class="lv-chart"><div class="pg-empty">Yuklanmoqda…</div></div>
          <div class="lv-sum"></div>
        </div>`;
  function levelChart(d) {
    const ev = d.events, n = ev.length, W = 320, H = 170, padL = 26, padR = 10, padT = 14, padB = 16;
    const levels = [d.start, ...ev.map((e) => e.level)];
    const max = Math.max(5, ...levels), x = (i) => padL + ((W - padL - padR) * i) / Math.max(1, n);
    const y = (v) => padT + (H - padT - padB) * (1 - v / max);
    let segs = "", dots = "";
    for (let i = 0; i < n; i++) {
      const up = ev[i].ok;
      segs += `<line x1="${x(i).toFixed(1)}" y1="${y(levels[i]).toFixed(1)}" x2="${x(i + 1).toFixed(1)}" y2="${y(levels[i + 1]).toFixed(1)}" class="lv-seg ${up ? "is-up" : "is-down"}"/>`;
      if (n <= 60) dots += `<circle cx="${x(i + 1).toFixed(1)}" cy="${y(levels[i + 1]).toFixed(1)}" r="2.6" class="lv-dot ${up ? "is-up" : "is-down"}"/>`;
    }
    const area = `${x(0).toFixed(1)},${(H - padB).toFixed(1)} ` + levels.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + ` ${x(n).toFixed(1)},${(H - padB).toFixed(1)}`;
    const grid = [0, 0.5, 1].map((f) => { const v = Math.round(max * f); return `<line x1="${padL}" x2="${W - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="lv-grid"/><text x="${padL - 5}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" class="pg-x">${v}</text>`; }).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="pg-svg" role="img" aria-label="Daraja grafigi">${grid}<polygon points="${area}" class="lv-area"/>${segs}${dots}</svg>`;
  }
  async function wireLevelGraph(page) {
    const box = page.querySelector(".lv-chart"), sum = page.querySelector(".lv-sum");
    let d = null;
    try { d = await api("/api/progress/level?n=50"); } catch (e) { d = null; }
    if (!d || !Array.isArray(d.events)) { box.innerHTML = '<div class="pg-empty">Ma\'lumotni yuklab bo\'lmadi.</div>'; return; }
    if (!d.events.length) { box.innerHTML = '<div class="pg-empty">Hali javob yo\'q. Mashq yoki vazifani boshlang! 🚀</div>'; return; }
    box.innerHTML = levelChart(d);
    sum.innerHTML = `<span>Daraja: <b>${d.level}</b></span><span class="is-up">To'g'ri: <b>${d.right}</b></span><span class="is-down">Xato: <b>${d.wrong}</b></span>`;
  }
  async function openProgressPage() {
    const u = user();
    if (!u) return;
    const me = Shell.data.me || {};
    const page = document.createElement("div");
    page.className = "pg-page";
    page.innerHTML = `<div class="pg-head"><button type="button" class="pg-back" data-pg="close" aria-label="Orqaga">←</button><h2>Mening natijalarim</h2></div>
      <div class="pg-body">
        <div class="pg-stats">
          <div><b>${me.weekPoints || 0}</b><span>Haftalik ball</span></div>
          <div><b>${me.allPoints || 0}</b><span>Umumiy ball</span></div>
          <div><b>🔥 ${me.streak || 0}</b><span>Doimiylik (kun)</span></div>
        </div>
        ${progressGraphHtml()}
      </div>`;
    document.body.appendChild(page);
    const close = () => { page.remove(); Back.remove(handler); };
    const handler = Back.push(close);
    page.addEventListener("click", (ev) => { if (ev.target.closest('[data-pg="close"]')) close(); });
    wireProgressGraph(page)(7);
  }
  Shell.openProgressPage = openProgressPage;

  // ------------------------------------------------------------------ Streak calendar (the flame in the top bar)
  const MONTHS_UZ = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseYmd = (t) => { const [y, m, d] = t.split("-").map(Number); return new Date(y, m - 1, d); };
  function doLogout() {
    if (!confirm("Haqiqatan ham tizimdan chiqmoqchimisiz?")) return false;
    try { localStorage.removeItem("l1_auto_v1"); } catch (e) { /* ignore */ }
    window.L1_LOGOUT();
    updateAuthView();
    if (typeof showToast === "function") showToast("Tizimdan chiqdingiz.");
    return true;
  }
  async function openStreakCalendar() {
    const u = user();
    if (!u) return;
    const sheet = document.createElement("div");
    sheet.className = "pg-page";
    sheet.innerHTML = `<div class="pg-head"><button type="button" class="pg-back" data-pg="close" aria-label="Orqaga">←</button><h2>Doimiylik</h2></div>
      <div class="pg-body"><div class="pg-card sc-sheet"><div class="sc-loading">Yuklanmoqda…</div></div>${levelGraphHtml()}${progressGraphHtml()}<button type="button" class="l1-btn l1-btn-danger w-full" data-act="logout">Chiqish</button></div>`;
    const close = () => { sheet.remove(); Back.remove(handler); };
    const handler = Back.push(close);
    sheet.addEventListener("click", (ev) => { if (ev.target.closest('[data-pg="close"]')) close(); });
    document.body.appendChild(sheet);
    wireProgressGraph(sheet)(7);
    wireLevelGraph(sheet);
    const box = sheet.querySelector(".sc-sheet");
    let d = null;
    try { d = await api("/api/progress/calendar"); } catch (e) { d = null; }
    if (!d || !Array.isArray(d.days)) {
      box.innerHTML = `<div class="sc-loading">Ma'lumotni yuklab bo'lmadi.</div>`;
    } else {
      const studied = new Set(d.days), start = parseYmd(d.start), today = parseYmd(d.today);
      const missed = Math.max(0, Math.round((today - start) / 86400000) + 1 - studied.size);
      let view = new Date(today.getFullYear(), today.getMonth(), 1);
      const startFmt = `${start.getDate()}-${MONTHS_UZ[start.getMonth()].toLowerCase()}, ${start.getFullYear()}`;
      const draw = () => {
        const first = new Date(view.getFullYear(), view.getMonth(), 1);
        const lead = (first.getDay() + 6) % 7, dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
        let cells = "";
        for (let i = 0; i < lead; i++) cells += '<i class="sc-c is-empty"></i>';
        for (let n = 1; n <= dim; n++) {
          const dt = new Date(view.getFullYear(), view.getMonth(), n), key = ymd(dt);
          let cls = "is-off", mark = "";
          if (studied.has(key)) { cls = "is-on"; mark = "🔥"; }
          else if (dt >= start && dt < today) { cls = "is-miss"; mark = "✕"; }
          if (key === d.today) cls += " is-today";
          cells += `<span class="sc-c ${cls}"><b>${n}</b><em>${mark}</em></span>`;
        }
        const canNext = view < new Date(today.getFullYear(), today.getMonth(), 1);
        const canPrev = view > new Date(start.getFullYear(), start.getMonth(), 1);
        box.innerHTML = `<div class="sc-top"><div class="sc-flame">🔥</div><div><div class="sc-big">${d.streak || 0} kun</div><div class="sc-sub">Ketma-ket doimiylik</div></div></div>
          <div class="sc-stats"><div><b>${studied.size}</b><span>Dars qilgan kun</span></div><div><b>${missed}</b><span>Qilmagan kun</span></div></div>
          <div class="sc-start">📅 Boshlagan kun: <b>${startFmt}</b></div>
          <div class="sc-nav"><button type="button" data-nav="-1" ${canPrev ? "" : "disabled"} aria-label="Oldingi oy">‹</button><b>${MONTHS_UZ[view.getMonth()]} ${view.getFullYear()}</b><button type="button" data-nav="1" ${canNext ? "" : "disabled"} aria-label="Keyingi oy">›</button></div>
          <div class="sc-grid">${["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"].map((w) => `<span class="sc-w">${w}</span>`).join("")}${cells}</div>
          <div class="sc-legend"><span><i class="lg-on"></i>Dars qilgan</span><span><i class="lg-miss"></i>Qilmagan</span></div>`;
      };
      draw();
      sheet.addEventListener("click", (ev) => {
        const n = ev.target.closest("[data-nav]");
        if (n && !n.disabled) { Haptic.tap(); view = new Date(view.getFullYear(), view.getMonth() + (+n.dataset.nav), 1); draw(); }
      });
    }
    sheet.addEventListener("click", (ev) => { if (ev.target.closest('[data-act="logout"]') && doLogout()) close(); });
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
        <div class="l1-card p-3"><b class="text-[18px]">🔥 ${me.streak || 0}</b><div class="l1-sub" style="font-size:12px">Doimiylik (kun)</div></div>
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
      if (a === "progress") { close(); if (window.L1_Hub) window.L1_Hub.openProgress(); }
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