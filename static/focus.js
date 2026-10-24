/* Pomodoro timer: a small floating tomato on every screen and the sheet that opens from it.
 *
 * One block is 25 minutes. The server keeps the clock (it also keeps the pauses: 10 minutes in total, the clock stands
 * still while paused). A finished block earns one tree, which the student plants on the map of Yashil shahar
 * (static/green_map.js). Giving a block up wilts the student's latest planted tree, so the sheet warns before that.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L1 = () => window.L1 || null;
  const Art = () => window.L1_TreeArt || null;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pad2 = (n) => String(n).padStart(2, "0");
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; };

  const R = 52, CIRC = 2 * Math.PI * R;
  const POS_KEY = "l1_gv_pos";

  // ------------------------------------------------------------------ state
  let clockOffset = 0; // server time − phone time, ms
  const now = () => Date.now() + clockOffset;
  const sync = (serverNowSec) => { if (serverNowSec) clockOffset = serverNowSec * 1000 - Date.now(); };

  const St = {
    status: "idle", // idle | running | paused
    sid: null, endAt: 0, frozen: 0, dur: 25 * 60000, pauseEndsAt: 0, pauseMs: 600000,
    today: 0, daily: 12, unplanted: 0, finished: 0, city: 0, planted: 0, wilted: 0, latest: null,
    loaded: false, busy: false, justEarned: null,
  };
  const leftMs = () => (St.status === "running" ? Math.max(0, St.endAt - now()) : St.status === "paused" ? St.frozen : St.dur);
  const progress = () => 1 - leftMs() / St.dur;

  const api = async (path, method, body) => {
    const opts = { method: method || "GET" };
    if (body) { opts.headers = { "Content-Type": "application/json" }; opts.body = JSON.stringify(body); }
    try {
      const resp = await window.l1Fetch(path, opts);
      const data = await resp.json().catch(() => null);
      return { ok: resp.ok, status: resp.status, data };
    } catch (e) { return { ok: false, status: 0, data: null }; }
  };
  const toast = (m) => { if (typeof window.showToast === "function") window.showToast(m); };
  const emit = () => window.dispatchEvent(new CustomEvent("l1:focus-summary"));
  const haptic = (k) => { const l = L1(); if (l && l.Haptic && l.Haptic[k]) l.Haptic[k](); };

  function applyBlock(v) {
    sync(v.now);
    St.sid = v.id; St.dur = v.seconds * 1000; St.pauseMs = v.pauseLeft * 1000;
    if (v.paused) { St.status = "paused"; St.frozen = v.remaining * 1000; St.pauseEndsAt = now() + v.pauseLeft * 1000; }
    else { St.status = "running"; St.endAt = now() + v.remaining * 1000; }
  }
  function applyCounts(d) {
    if (d.unplanted != null) St.unplanted = d.unplanted;
    if (d.finished != null) St.finished = d.finished;
    if (d.planted != null) St.planted = d.planted;
    if (d.wilted != null) St.wilted = d.wilted;
    if (d.todayTrees != null) St.today = d.todayTrees;
    if (d.dailyTrees != null) St.daily = d.dailyTrees;
    if (d.cityTrees != null) St.city = d.cityTrees;
  }
  function setIdle() { St.status = "idle"; St.sid = null; }

  // ------------------------------------------------------------------ sounds
  const snd = () => (L1() && L1().Sound) || null;
  function unlockAudio() { const s = snd(); if (s) s.tone(440, "sine", 0.02, 0, 0.0001); }
  function chime() { const s = snd(); if (!s) return; s.tone(784, "sine", 0.35, 0, 0.14); s.tone(988, "sine", 0.35, 0.2, 0.14); s.tone(1175, "sine", 0.55, 0.4, 0.14); }
  function sadSound() { const s = snd(); if (!s) return; s.tone(392, "triangle", 0.3, 0, 0.12); s.tone(330, "triangle", 0.3, 0.22, 0.12); s.tone(262, "triangle", 0.5, 0.44, 0.12); }
  function buzz() { try { navigator.vibrate && navigator.vibrate([160, 80, 160, 80, 260]); } catch (e) {} haptic("ok"); }

  let wakeLock = null;
  async function keepAwake() {
    try { if (navigator.wakeLock && !wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } } catch (e) { /* optional */ }
  }
  function releaseAwake() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

  // ------------------------------------------------------------------ pictures
  const tomatoFruit = `<g class="gv-fruit"><g transform="translate(60 63) scale(1.34) translate(-60 -63)">
      <path d="M60 36c-17 0-30 11-30 27s13 27 30 27 30-11 30-27-13-27-30-27Z" fill="#ef4444"/>
      <ellipse cx="47" cy="52" rx="7" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-30 47 52)"/>
      <path d="M60 41c-3-4-9-6-14-4 4 1 7 3 9 6-5 0-9 2-11 6 5-2 10-2 14 0-1 4 0 8 2 10 1-3 3-6 6-8 3 2 5 5 6 8 2-2 3-6 2-10 4-2 9-2 14 0-2-4-6-6-11-6 2-3 5-5 9-6-5-2-11 0-14 4Z" fill="#3aa655"/>
      <path d="M60 41c0-4 1-7 4-9" stroke="#2c7a3f" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
  const ringSvg = (frac, id) => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="${R}" class="gv-track"/>
    <circle cx="60" cy="60" r="${R}" class="gv-ring" ${id ? `id="${id}"` : ""} stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${(CIRC * (1 - frac)).toFixed(1)}" transform="rotate(-90 60 60)"/>
    ${tomatoFruit}</svg>`;
  const growingTree = () => (Art() ? Art().growing(progress()) : "");
  const treeStage = () => { const p = progress(); return p < 0.12 ? 0 : p < 0.45 ? 1 : p < 0.8 ? 2 : 3; };

  // ------------------------------------------------------------------ the floating tomato
  let widget = null, lastStage = -1;
  function ensureWidget() {
    if (widget) return widget;
    widget = document.createElement("button");
    widget.type = "button";
    widget.id = "gvPomo";
    widget.className = "gv-pomo";
    widget.hidden = true;
    widget.setAttribute("aria-label", "Pomidor va Yashil shahar");
    document.body.appendChild(widget);
    widget.addEventListener("click", (ev) => { if (widget.dataset.dragged === "1") { widget.dataset.dragged = "0"; return; } haptic("tap"); openSheet(); });
    enableDrag(widget);
    paintWidget();
    return widget;
  }

  function placeWidget() {
    if (!widget) return;
    let pos = null;
    try { pos = JSON.parse(localStorage.getItem(POS_KEY) || "null"); } catch (e) {}
    if (!pos) { widget.style.left = widget.style.top = ""; widget.style.right = widget.style.bottom = ""; return; }
    const w = widget.offsetWidth || 220, h = widget.offsetHeight || 56;
    const x = Math.min(Math.max(6, pos.x), innerWidth - w - 6), y = Math.min(Math.max(6, pos.y), innerHeight - h - 6);
    widget.style.left = x + "px"; widget.style.top = y + "px"; widget.style.right = "auto"; widget.style.bottom = "auto";
  }

  function enableDrag(el) {
    let sx = 0, sy = 0, ox = 0, oy = 0, down = false, moved = false;
    el.addEventListener("pointerdown", (e) => {
      down = true; moved = false; sx = e.clientX; sy = e.clientY;
      const r = el.getBoundingClientRect(); ox = r.left; oy = r.top;
    });
    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return;
      if (!moved) { moved = true; try { el.setPointerCapture(e.pointerId); } catch (err) {} el.classList.add("is-drag"); }
      const x = Math.min(Math.max(6, ox + e.clientX - sx), innerWidth - el.offsetWidth - 6);
      const y = Math.min(Math.max(6, oy + e.clientY - sy), innerHeight - el.offsetHeight - 6);
      el.style.left = x + "px"; el.style.top = y + "px"; el.style.right = "auto"; el.style.bottom = "auto";
    });
    const end = () => {
      if (!down) return;
      down = false; el.classList.remove("is-drag");
      if (moved) {
        el.dataset.dragged = "1";
        try { localStorage.setItem(POS_KEY, JSON.stringify({ x: parseFloat(el.style.left), y: parseFloat(el.style.top) })); } catch (e) {}
        setTimeout(() => { el.dataset.dragged = "0"; }, 350);
      }
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    window.addEventListener("resize", placeWidget);
  }

  function paintWidget() {
    if (!widget) return;
    const loggedIn = !!(window.l1GetToken && window.l1GetToken());
    widget.hidden = !loggedIn;
    if (!loggedIn) return;
    widget.dataset.state = St.status;
    lastStage = treeStage();
    const active = St.status !== "idle";
    widget.innerHTML = `
      <span class="gv-tomato">${ringSvg(active ? progress() : 0, "gvRing")}</span>
      <span class="gv-info"><b class="gv-time" id="gvTime">${active ? mmss(leftMs()) : "Pomidor"}</b>
        <span class="gv-city">Yashil shahar: ${St.city} daraxt</span></span>
      <span class="gv-tree" id="gvTree">${active ? growingTree() : (Art() ? Art().svg("oak", 2, false) : "")}</span>
      ${St.unplanted > 0 ? `<span class="gv-badge" aria-label="Ekilmagan daraxt">+${St.unplanted}</span>` : ""}`;
    placeWidget();
  }

  function tickWidget() {
    if (!widget || widget.hidden) return;
    const t = $("gvTime"), ring = $("gvRing");
    if (St.status !== "idle") {
      if (t) t.textContent = mmss(leftMs());
      if (ring) ring.setAttribute("stroke-dashoffset", (CIRC * (1 - progress())).toFixed(1));
      if (treeStage() !== lastStage) { lastStage = treeStage(); const tr = $("gvTree"); if (tr) tr.innerHTML = growingTree(); }
    }
  }

  // ------------------------------------------------------------------ the sheet
  let sheet = null, sheetOpen = false, sheetView = "main"; // main | leave | earned
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement("div");
    sheet.id = "gvSheet";
    sheet.className = "gv-wrap";
    sheet.hidden = true;
    document.body.appendChild(sheet);
    sheet.addEventListener("click", onSheetClick);
    return sheet;
  }
  function openSheet(view, force) {
    // an idle student gets the full-page intro with Shakespeare; the sheet is for a running block
    if (!force && !view && St.status === "idle" && window.L1_Flow) { window.L1_Flow.intro(); refreshState(); return; }
    ensureSheet();
    sheetOpen = true; sheetView = view || "main"; sheet.hidden = false;
    renderSheet();
    refreshState(); // always show fresh numbers
  }
  function closeSheet() { sheetOpen = false; if (sheet) { sheet.hidden = true; sheet.innerHTML = ""; } }

  function latestHtml() {
    const t = St.latest;
    if (!t) return `<p class="gv-warn-line">Hali ekilgan daraxtingiz yo'q, shuning uchun hech narsa so'lmaydi. Lekin bu pomidor hisobga olinmaydi.</p>`;
    const name = Art() ? Art().name(t.kind) : "Daraxt";
    return `<div class="gv-latest"><span class="gv-latest-art">${Art() ? Art().svg(t.kind, 3, false) : ""}<i>→</i>${Art() ? Art().svg(t.kind, 3, true) : ""}</span>
      <p class="gv-warn-line"><b>Oxirgi ekkan daraxtingiz (${esc(name)}) so'ladi.</b> Uni keyin 1 ta pomidor evaziga tiklash mumkin.</p></div>`;
  }

  function renderSheet() {
    if (!sheet || !sheetOpen) return;
    const running = St.status !== "idle";
    let body = "";
    if (sheetView === "earned") {
      const e = St.justEarned || {};
      body = `
        <div class="gv-earned"><div class="gv-earned-art">${Art() ? Art().svg("oak", 3, false) : ""}<span class="gv-spark s1">✦</span><span class="gv-spark s2">✦</span><span class="gv-spark s3">✦</span></div>
          <h2>Pomidor tugadi!</h2>
          <p class="gv-line">Siz 1 ta daraxt oldingiz.${e.awarded ? ` <b class="gv-pts">+${e.awarded} ball</b>` : ""}</p>
          <div class="gv-actions">
            <button type="button" class="gv-btn is-green" data-gv="plant">🌱 Hozir ekish</button>
            <button type="button" class="gv-btn is-quiet" data-gv="again">🍅 Yana pomidor</button>
          </div>
          <button type="button" class="gv-link" data-gv="close">Keyinroq</button></div>`;
    } else if (sheetView === "leave") {
      body = `
        <div class="gv-leave"><h2>Pomidorni to'xtatasizmi?</h2>${latestHtml()}
          <div class="gv-actions"><button type="button" class="gv-btn" data-gv="stay">Davom etish</button>
            <button type="button" class="gv-btn is-danger" data-gv="leave">To'xtatish</button></div></div>`;
    } else if (running) {
      const paused = St.status === "paused";
      body = `
        <div class="gv-run">
          <div class="gv-big-ring">${ringSvg(progress(), "gvBigRing")}<span class="gv-big-time" id="gvBigTime">${mmss(leftMs())}</span></div>
          <div class="gv-grow"><span class="gv-grow-art" id="gvGrow">${growingTree()}</span>
            <span class="gv-grow-text" id="gvGrowText">${paused ? "Pauza: vaqt to'xtab turibdi" : "Daraxtingiz o'smoqda"}</span></div>
          <div class="gv-pause-line" id="gvPauseLine">${paused ? `Pauza tugashiga <b>${mmss(St.pauseEndsAt - now())}</b>` : `Pauza uchun <b>${mmss(St.pauseMs)}</b> qoldi`}</div>
          <div class="gv-actions">
            ${paused ? `<button type="button" class="gv-btn is-green" data-gv="resume">▶ Davom etish</button>`
                     : `<button type="button" class="gv-btn" data-gv="pause" ${St.pauseMs <= 0 ? "disabled" : ""}>⏸ Pauza</button>`}
            <button type="button" class="gv-btn is-quiet" data-gv="giveup">To'xtatish</button>
          </div></div>`;
    } else {
      body = `
        <div class="gv-idle">
          <div class="gv-start-wrap"><button type="button" class="gv-start" data-gv="start" aria-label="Pomidorni boshlash"><span class="gv-start-tomato">${ringSvg(0)}</span><span class="gv-start-label">25:00</span></button></div>
          <h2>Pomidor: 25 daqiqa</h2>
          <p class="gv-line">Diqqat bilan o'qing. Tugagach 1 ta daraxt olasiz.</p>
          <div class="gv-actions">
            <button type="button" class="gv-btn" data-gv="start">▶ Boshlash</button>
            ${St.unplanted > 0 ? `<button type="button" class="gv-btn is-green" data-gv="plant">🌱 Ekish: ${St.unplanted}</button>` : ""}
          </div></div>`;
    }
    const chip = `<span class="gv-chip" title="Kuniga ko'pi bilan ${St.daily} ta daraxt ekiladi">Bugun <b>${St.today}</b> ta</span>`;
    sheet.innerHTML = `
      <div class="gv-back" data-gv="close"></div>
      <section class="gv-sheet" role="dialog" aria-label="Pomidor" data-state="${St.status}">
        <div class="gv-head">${chip}<button type="button" class="gv-x" data-gv="close" aria-label="Yopish">✕</button></div>
        ${body}
        <button type="button" class="gv-city-btn" data-gv="map"><span class="gv-city-art">${Art() ? Art().svg("apple", 3, false) : ""}</span>
          <span><b>Yashil shahar</b><i>${St.city} daraxt${St.wilted ? ` · ${St.wilted} so'lgan` : ""}</i></span><span class="gv-city-go">›</span></button>
      </section>`;
  }

  function tickSheet() {
    if (!sheetOpen || sheetView !== "main" || St.status === "idle") return;
    const big = $("gvBigTime"), ring = $("gvBigRing");
    if (big) big.textContent = mmss(leftMs());
    if (ring) ring.setAttribute("stroke-dashoffset", (CIRC * (1 - progress())).toFixed(1));
    const line = $("gvPauseLine");
    if (line && St.status === "paused") line.innerHTML = `Pauza tugashiga <b>${mmss(St.pauseEndsAt - now())}</b>`;
    const g = $("gvGrow"); if (g && g.dataset.stage !== String(treeStage())) { g.dataset.stage = String(treeStage()); g.innerHTML = growingTree(); }
  }

  // ------------------------------------------------------------------ flow
  let ticker = null, resyncing = false;
  function startTicker() { if (!ticker) ticker = setInterval(tick, 250); }
  function stopTicker() { if (ticker) clearInterval(ticker); ticker = null; document.title = baseTitle; }
  const baseTitle = document.title;

  function tick() {
    if (St.status !== "idle") window.dispatchEvent(new CustomEvent("l1:focus-tick", { detail: { left: leftMs(), status: St.status } }));
    if (St.status === "running") {
      const left = leftMs();
      document.title = `🍅 ${mmss(left)}`;
      tickWidget(); tickSheet();
      if (left <= 0) finishBlock();
    } else if (St.status === "paused") {
      document.title = `⏸ ${mmss(leftMs())}`;
      tickWidget(); tickSheet();
      if (now() >= St.pauseEndsAt && !resyncing) { // the 10 minutes of pause are used up: the server has resumed the clock
        resyncing = true;
        refreshState().then(() => { resyncing = false; toast("Pauza tugadi, vaqt davom etmoqda."); });
      }
    }
  }

  // Callers that ask at the same moment (start-up, tab coming back, the sheet opening) share one request.
  let stateLoading = null;
  function refreshState() {
    if (!stateLoading) stateLoading = loadState().finally(() => { stateLoading = null; });
    return stateLoading;
  }
  async function loadState() {
    const r = await api("/api/focus/state");
    if (!r.ok) return false;
    const d = r.data;
    sync(d.now);
    applyCounts(d);
    St.latest = d.latestTree || null;
    if (d.active) { applyBlock(d.active); startTicker(); keepAwake(); }
    else if (St.status !== "idle") { setIdle(); stopTicker(); releaseAwake(); }
    St.loaded = true;
    paintWidget(); if (sheetOpen) renderSheet(); emit();
    return true;
  }

  async function startBlock() {
    if (St.busy || St.status !== "idle") return false;
    St.busy = true; unlockAudio();
    const r = await api("/api/focus/start", "POST", {});
    St.busy = false;
    if (!r.ok) {
      if (r.status === 409 && r.data && r.data.active) { applyBlock(r.data.active); startTicker(); paintWidget(); renderSheet(); return true; }
      toast((r.data && r.data.message) || "Boshlab bo'lmadi. Internetni tekshiring.");
      return false;
    }
    applyBlock(r.data); applyCounts(r.data);
    sheetView = "main";
    startTicker(); keepAwake(); haptic("tap");
    paintWidget(); renderSheet(); emit();
    return true;
  }

  // the home button: pause a running block, continue a paused one (the 10 minutes of pause are shared by the whole block)
  function toggle() {
    if (St.status === "running") return pauseBlock();
    if (St.status === "paused") return resumeBlock();
  }

  async function pauseBlock() {
    if (St.busy || St.status !== "running") return;
    St.busy = true;
    const r = await api("/api/focus/pause", "POST", { id: St.sid });
    St.busy = false;
    if (!r.ok) { toast((r.data && r.data.message) || "Pauza bo'lmadi."); return refreshState(); }
    applyBlock(r.data); haptic("tap"); paintWidget(); renderSheet();
  }

  async function resumeBlock() {
    if (St.busy || St.status !== "paused") return;
    St.busy = true;
    const r = await api("/api/focus/resume", "POST", { id: St.sid });
    St.busy = false;
    if (!r.ok) { toast((r.data && r.data.message) || "Davom ettirib bo'lmadi."); return refreshState(); }
    applyBlock(r.data); haptic("tap"); paintWidget(); renderSheet();
  }

  async function finishBlock() {
    if (St.busy || St.status !== "running") return;
    St.busy = true;
    let r = null;
    for (let i = 0; i < 8; i++) { // a 409 right at the end only means the phone's clock runs a little fast
      r = await api("/api/focus/finish", "POST", { id: St.sid });
      if (r.ok || r.status !== 409) break;
      await sleep(2000);
    }
    St.busy = false;
    stopTicker(); releaseAwake();
    if (!r || !r.ok) {
      toast((r && r.data && r.data.message) || "Daraxt olinmadi. Internetni tekshiring.");
      await refreshState();
      return;
    }
    const d = r.data;
    setIdle(); applyCounts(d);
    St.justEarned = { awarded: d.awarded };
    chime(); buzz();
    const l = L1(); if (l && l.Sound && l.Sound.finish) setTimeout(() => l.Sound.finish(), 600);
    paintWidget(); emit();
    if (window.L1_Flow) window.L1_Flow.done({ awarded: d.awarded }); else openSheet("earned");
    if (window.L1_Green) window.L1_Green.refresh();
  }

  async function leaveBlock() {
    if (St.busy || St.status === "idle") return;
    St.busy = true;
    const r = await api("/api/focus/cancel", "POST", { id: St.sid });
    St.busy = false;
    if (!r.ok) {
      toast((r.data && r.data.message) || "To'xtatib bo'lmadi.");
      await refreshState();
      sheetView = "main"; renderSheet();
      return;
    }
    stopTicker(); releaseAwake(); setIdle(); applyCounts(r.data);
    St.latest = null;
    sheetView = "main"; closeSheet(); paintWidget(); emit();
    if (r.data.wiltedTree) { sadSound(); toast("Daraxtingiz so'ldi 🥀 Uni Yashil shaharda 1 ta pomidor evaziga tiklash mumkin."); }
    if (window.L1_Green) window.L1_Green.refresh();
    refreshState();
  }

  function onSheetClick(ev) {
    const b = ev.target.closest("[data-gv]");
    if (!b) return;
    const act = b.dataset.gv;
    if (act !== "close") haptic("tap");
    if (act === "close") return closeSheet();
    if (act === "start") return startBlock();
    if (act === "pause") return pauseBlock();
    if (act === "resume") return resumeBlock();
    if (act === "giveup") { sheetView = "leave"; return renderSheet(); }
    if (act === "stay") { sheetView = "main"; return renderSheet(); }
    if (act === "leave") return leaveBlock();
    if (act === "again") { sheetView = "main"; St.justEarned = null; return startBlock(); }
    if (act === "plant") { closeSheet(); if (window.L1_Green) window.L1_Green.open({ plant: true }); return; }
    if (act === "map") { closeSheet(); if (window.L1_Green) window.L1_Green.open({}); return; }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    if (window.l1GetToken && window.l1GetToken()) refreshState();
    tick();
  });

  // ------------------------------------------------------------------ public API
  const summary = () => ({ total: St.city, city: St.city, mine: St.planted, unplanted: St.unplanted, wilted: St.wilted, today: St.today, daily: St.daily,
    status: St.status, left: leftMs(), finished: St.finished });
  // the map reports its own numbers after it loaded, so the button shows the same count
  function setCity(n) { if (typeof n === "number" && n !== St.city) { St.city = n; paintWidget(); emit(); } }
  function setCounts(d) { applyCounts(d); paintWidget(); if (sheetOpen) renderSheet(); emit(); }

  window.L1_Focus = {
    open: (v) => openSheet(v), sheet: () => openSheet("main", true), begin: startBlock, toggle, start: () => { openSheet(null, true); return startBlock(); }, openMap: () => window.L1_Green && window.L1_Green.open({}),
    refresh: refreshState, summary, setCity, setCounts, close: closeSheet,
  };

  // Once the student is signed in: load the numbers, show the tomato and pick up a block that is still running.
  let boot = 0;
  const bootTimer = setInterval(async () => {
    ensureWidget();
    const token = window.l1GetToken && window.l1GetToken();
    if (!token) { if (widget && !widget.hidden) { widget.hidden = true; setIdle(); stopTicker(); } return; }
    if (widget.hidden || !St.loaded) {
      if (!St.loaded && ++boot > 3000) return clearInterval(bootTimer);
      widget.hidden = false;
      if (!St.loaded && !St.busy) { St.busy = true; const ok = await refreshState(); St.busy = false; if (!ok) St.loaded = false; }
      else paintWidget();
    }
  }, 1500);
})();
