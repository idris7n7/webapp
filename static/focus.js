/* Pomodoro focus mode and the shared Asaka forest.
 *
 * Tapping the tomato on Asosiy opens a full-screen timer: 25 min lesson → 5 min rest → 25 min lesson. Each finished
 * lesson block plants one tree at a real place in Asaka district (the server keeps the clock, picks the place and
 * limits the day to 12 trees). During the rest the student sees exactly where it was planted; the whole class fills
 * the same map, and the map gets greener and livelier the more trees there are.
 *
 * Map: Leaflet (static/vendor/leaflet) with free CARTO/OpenStreetMap tiles, loaded only when a map is shown.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L1 = () => window.L1 || null;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pad2 = (n) => String(n).padStart(2, "0");
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; };

  const KEY = "l1_focus_v1";
  const REST_MS = 5 * 60 * 1000;
  const BBOX = [40.5567, 72.0917, 40.7583, 72.3620]; // Asaka district: south, west, north, east
  const R = 52, CIRC = 2 * Math.PI * R;
  const PLAN = [{ kind: "focus", min: 25 }, { kind: "rest", min: 5 }, { kind: "focus", min: 25 }];

  const LEVELS = [
    { at: 0, name: "Bo'sh dala" }, { at: 8, name: "Ko'chat maydoni" }, { at: 25, name: "Yosh bog'" }, { at: 60, name: "Yashil mahalla" },
    { at: 120, name: "Gullagan bog'" }, { at: 220, name: "Asaka o'rmoni" }, { at: 380, name: "Yashil vodiy" }, { at: 600, name: "Gullab-yashnagan Asaka" },
  ];
  const levelOf = (total) => { let i = 0; while (i + 1 < LEVELS.length && total >= LEVELS[i + 1].at) i++; return i; };

  // ------------------------------------------------------------------ state
  let S = { step: 0, phase: "idle" }; // phase: idle | focus | planting | rest | ready | done
  try { const raw = JSON.parse(localStorage.getItem(KEY) || "null"); if (raw && raw.phase) S = raw; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const clearState = () => { S = { step: 0, phase: "idle" }; try { localStorage.removeItem(KEY); } catch (e) {} };

  let view = "timer"; // timer | plant | map
  let open = false;
  let clockOffset = 0; // server time − phone time, ms
  const now = () => Date.now() + clockOffset;
  const sync = (serverNowSec) => { if (serverNowSec) clockOffset = serverNowSec * 1000 - Date.now(); };
  let ticker = null, busy = false, wakeLock = null, boardMode = "week";
  const sum = { total: 0, mine: 0, today: 0, daily: 12, spotsFilled: 0, spotsTotal: 0 };
  const forest = { trees: [], ids: new Set(), maxId: 0, week: [], all: [], meId: "" };

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

  // ------------------------------------------------------------------ sounds
  const snd = () => (L1() && L1().Sound) || null;
  function unlockAudio() { const s = snd(); if (s) s.tone(440, "sine", 0.02, 0, 0.0001); }
  function chime() { const s = snd(); if (!s) return; s.tone(784, "sine", 0.35, 0, 0.14); s.tone(988, "sine", 0.35, 0.2, 0.14); s.tone(1175, "sine", 0.55, 0.4, 0.14); }
  function plantSound() {
    const s = snd(); if (!s) return;
    s.noise(0.2, 0, 0.2, "lowpass", 520, 110); // spade in the soil
    s.tone(523, "sine", 0.28, 0.16, 0.13); s.tone(659, "sine", 0.28, 0.32, 0.13); s.tone(784, "sine", 0.28, 0.48, 0.13); s.tone(1046, "sine", 0.6, 0.64, 0.14);
  }
  function buzz() { try { navigator.vibrate && navigator.vibrate([160, 80, 160, 80, 260]); } catch (e) {} const l = L1(); if (l && l.Haptic) l.Haptic.ok(); }

  // ------------------------------------------------------------------ data
  function addTrees(list) {
    for (const t of list) {
      if (forest.ids.has(t.id)) continue;
      forest.ids.add(t.id); forest.trees.push(t);
      if (t.id > forest.maxId) forest.maxId = t.id;
    }
  }
  function applyForest(d) {
    sum.total = d.total; sum.mine = d.mine; sum.today = d.todayTrees; sum.daily = d.dailyTrees;
    sum.spotsFilled = d.spotsFilled; sum.spotsTotal = d.spotsTotal;
    forest.week = d.week; forest.all = d.all; forest.meId = d.meId;
    sync(d.now);
  }
  async function loadForest(statsOnly) {
    const r = await api("/api/focus/forest?after=" + (statsOnly ? 2147483000 : forest.maxId));
    if (!r.ok) return false;
    if (!statsOnly) addTrees(r.data.trees);
    applyForest(r.data);
    emit();
    return true;
  }

  // ------------------------------------------------------------------ the tree pictures
  const KINDS = {
    oak: { c1: "#2f9e55", c2: "#47bd6c" }, pine: { c1: "#1f7a4a", c2: "#2d9a5f" }, cherry: { c1: "#f08fb2", c2: "#f9b9d0" },
    poplar: { c1: "#3a9a4a", c2: "#5cb85c" }, apple: { c1: "#3fae5a", c2: "#62cb78" }, plane: { c1: "#9bbf3a", c2: "#bfd95a" },
  };
  const TRUNK = "#8a5a2b";
  function stageOf(at) { const days = (now() / 1000 - at) / 86400; return days < 0.5 ? 0 : days < 3 ? 1 : days < 10 ? 2 : 3; }
  function treeSvg(kind, stage) {
    const shadow = `<ellipse cx="20" cy="45" rx="10" ry="2.6" fill="rgba(0,0,0,.2)"/>`;
    if (stage === 0) {
      return `<svg viewBox="0 0 40 48">${shadow}<path d="M20 44V30" stroke="${TRUNK}" stroke-width="3" stroke-linecap="round"/><path d="M20 32c-8 0-12-5-12-10 7 0 12 3 12 10Z" fill="#59c26e"/><path d="M20 30c8 0 12-5 12-10-7 0-12 3-12 10Z" fill="#3fae5a"/></svg>`;
    }
    const k = KINDS[kind] || KINDS.oak;
    const g = stage === 1 ? 0.8 : 1;
    let crown;
    if (kind === "pine") crown = `<path d="M20 3 32 19H8Z" fill="${k.c2}"/><path d="M20 11 35 30H5Z" fill="${k.c1}"/><path d="M20 20 37 40H3Z" fill="${k.c2}"/>`;
    else if (kind === "poplar") crown = `<ellipse cx="20" cy="21" rx="9" ry="19" fill="${k.c1}"/><ellipse cx="17" cy="25" rx="5" ry="12" fill="${k.c2}"/>`;
    else if (kind === "plane") crown = `<path d="M20 5c9 0 16 7 16 15s-7 13-16 13S4 28 4 20 11 5 20 5Z" fill="${k.c1}"/><circle cx="14" cy="17" r="6" fill="${k.c2}"/><circle cx="26" cy="22" r="6" fill="${k.c2}"/>`;
    else crown = `<circle cx="20" cy="19" r="14" fill="${k.c1}"/><circle cx="12" cy="24" r="9" fill="${k.c2}"/><circle cx="28" cy="24" r="9" fill="${k.c2}"/>`;
    let extra = "";
    if (stage >= 2 && kind === "apple") extra = `<circle cx="14" cy="17" r="2.2" fill="#e5484d"/><circle cx="26" cy="21" r="2.2" fill="#e5484d"/><circle cx="19" cy="27" r="2.2" fill="#e5484d"/>`;
    if (stage >= 2 && kind === "cherry") extra = `<circle cx="13" cy="16" r="1.8" fill="#fff"/><circle cx="25" cy="14" r="1.8" fill="#fff"/><circle cx="21" cy="24" r="1.8" fill="#fff"/><circle cx="29" cy="25" r="1.6" fill="#fff"/>`;
    if (stage === 3) extra += `<path d="M33 6l1.2 3 3 1.2-3 1.2L33 14.4l-1.2-3-3-1.2 3-1.2Z" fill="#ffd34d"/>`;
    const trunk = kind === "pine" ? `<rect x="18.5" y="38" width="3" height="7" rx="1.5" fill="${TRUNK}"/>` : `<rect x="18" y="29" width="4" height="16" rx="2" fill="${TRUNK}"/>`;
    return `<svg viewBox="0 0 40 48">${shadow}${trunk}<g transform="translate(20 44) scale(${g}) translate(-20 -44)">${crown}${extra}</g></svg>`;
  }
  const dotColor = (kind) => (KINDS[kind] || KINDS.oak).c1;
  const ago = (at) => {
    const m = Math.max(0, Math.floor((now() / 1000 - at) / 60));
    if (m < 2) return "hozirgina"; if (m < 60) return `${m} daqiqa oldin`;
    const h = Math.floor(m / 60); if (h < 24) return `${h} soat oldin`;
    return `${Math.floor(h / 24)} kun oldin`;
  };
  const popupHtml = (t, mine) => `<b>${mine ? "Siz ekkan daraxt 🌳" : esc(t.by || "O'quvchi")}</b><br>📍 ${esc(t.spot)}<br><small>${ago(t.at)}</small>`;

  // ------------------------------------------------------------------ the map
  let leafletPromise = null;
  function loadLeaflet() {
    if (window.L && window.L.map) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet"; css.href = "/static/vendor/leaflet/leaflet.css";
      document.head.appendChild(css);
      const s = document.createElement("script");
      s.src = "/static/vendor/leaflet/leaflet.js";
      s.onload = () => resolve(window.L);
      s.onerror = () => { leafletPromise = null; reject(new Error("leaflet")); };
      document.head.appendChild(s);
    });
    return leafletPromise;
  }

  const FM = {
    host: null, mapDiv: null, map: null, Lf: null, tiles: null, polygon: null, iconLayer: null, dotLayer: null, hiLayer: null, decoLayer: null,
    sky: null, newTree: null, ready: false,

    // Puts the (single, reused) map box into `slot`; builds the map the first time.
    async attach(slot, tall) {
      if (!this.host) {
        this.host = document.createElement("div");
        this.host.className = "fc-mapbox";
        this.host.innerHTML = `<div class="fc-map"></div><div class="fc-maploading">🗺️ Xarita yuklanmoqda…</div>`;
        this.mapDiv = this.host.firstChild;
      }
      this.host.classList.toggle("is-tall", !!tall);
      this.host.classList.toggle("is-short", !tall);
      slot.appendChild(this.host);
      if (this.map) { this.map.invalidateSize(); return; }
      try { await this.build(); } catch (e) { this.host.querySelector(".fc-maploading").textContent = "Xaritani yuklab bo'lmadi. Internetni tekshiring."; }
    },

    async build() {
      const Lf = this.Lf = await loadLeaflet();
      if (this.map) return;
      const bounds = Lf.latLngBounds([BBOX[0], BBOX[1]], [BBOX[2], BBOX[3]]);
      this.map = Lf.map(this.mapDiv, {
        zoomControl: false, minZoom: 11, maxZoom: 17, maxBounds: bounds.pad(0.3), maxBoundsViscosity: 0.9, preferCanvas: true, zoomSnap: 0.5,
      });
      this.map.fitBounds(bounds, { padding: [14, 14] });
      Lf.control.zoom({ position: "bottomright", zoomInText: "+", zoomOutText: "−" }).addTo(this.map);
      this.iconLayer = Lf.layerGroup().addTo(this.map);
      this.dotLayer = Lf.layerGroup().addTo(this.map);
      this.hiLayer = Lf.layerGroup().addTo(this.map);
      this.decoLayer = Lf.layerGroup().addTo(this.map);
      this.sky = document.createElement("div");
      this.sky.className = "fm-sky";
      this.host.appendChild(this.sky);
      this.setTiles();
      this.map.on("zoomend", () => this.refresh());
      // when zoomed in only the trees in view get a picture, so redraw after panning (but never while a popup is open)
      this.map.on("moveend", () => { if (this.map.getZoom() >= 14 && forest.trees.length > 400 && !this.map._popup) this.refresh(); });
      this.map.on("popupclose", () => setTimeout(() => this.refresh(), 0));
      new MutationObserver(() => this.applyFilter()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      this.host.querySelector(".fc-maploading").style.display = "none";
      try {
        const r = await fetch("/static/asaka_boundary.json");
        const b = await r.json();
        this.polygon = Lf.polygon(b.polygon.map(([lon, lat]) => [lat, lon]), { color: "#2f9e55", weight: 2, dashArray: "7 7", fillColor: "#2f9e55", fillOpacity: 0.05, interactive: false }).addTo(this.map);
      } catch (e) { /* the outline is only decoration */ }
      this.ready = true;
      this.refresh();
    },

    // Free OpenStreetMap tiles (light use by one class is fine under their tile policy; attribution is shown).
    // Dark theme: the same tiles, inverted by a CSS filter (see applyFilter).
    setTiles() {
      if (!this.map || this.tiles) return;
      this.tiles = this.Lf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17, keepBuffer: 2, updateWhenIdle: true,
        referrerPolicy: "origin", // the app sends "same-origin" elsewhere; OSM's tile policy wants to see which site asks
        attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      }).addTo(this.map);
      this.tiles.bringToBack();
      this.applyFilter();
    },

    // Colours get richer as the forest grows (see decorate); in the dark theme the map is inverted and dimmed.
    applyFilter() {
      if (!this.map) return;
      const lvl = levelOf(sum.total);
      const dark = document.documentElement.dataset.theme === "dark";
      this.map.getPane("tilePane").style.filter =
        `${dark ? "invert(1) hue-rotate(180deg) brightness(.92) contrast(.92) " : ""}saturate(${(0.55 + 0.08 * lvl).toFixed(2)})`;
    },

    iconFor(t, big) {
      // the tree that was just planted is drawn large (and never as a bare sprout) so it can't be missed
      const stage = big ? Math.max(1, stageOf(t.at)) : stageOf(t.at);
      const px = big ? 50 : [22, 28, 36, 42][stage] * (this.map && this.map.getZoom() >= 16 ? 1.25 : 1);
      return this.Lf.divIcon({ className: "fm-tree" + (big ? " is-new" : ""), html: treeSvg(t.kind, stage), iconSize: [px, px * 1.2], iconAnchor: [px / 2, px * 1.2 - 2] });
    },

    // Rebuilds the markers for the current zoom: pictures when zoomed in, small dots when zoomed out.
    refresh() {
      if (!this.ready) return;
      this.iconLayer.clearLayers(); this.dotLayer.clearLayers();
      const zoomedIn = this.map.getZoom() >= 14;
      const bounds = this.map.getBounds().pad(0.2);
      for (const t of forest.trees) {
        if (this.newTree && t.id === this.newTree.id) continue;
        const mine = !!(t.mine || t.mineFlag);
        if (zoomedIn) {
          if (forest.trees.length > 400 && !bounds.contains([t.lat, t.lon])) continue;
          this.Lf.marker([t.lat, t.lon], { icon: this.iconFor(t) }).bindPopup(popupHtml(t, mine)).addTo(this.iconLayer);
        } else {
          this.Lf.circleMarker([t.lat, t.lon], { radius: forest.trees.length < 60 ? 6 : 4, color: "#fff", weight: 1, fillColor: dotColor(t.kind), fillOpacity: 0.95 }).bindPopup(popupHtml(t, mine)).addTo(this.dotLayer);
        }
      }
      this.decorate();
    },

    // The forest makes the map prettier: greener tint and colours, butterflies, birds, falling blossom.
    decorate() {
      if (!this.ready) return;
      const lvl = levelOf(sum.total);
      this.polygon && this.polygon.setStyle({ fillOpacity: 0.03 + 0.04 * lvl });
      this.applyFilter();
      this.decoLayer.clearLayers();
      const n = lvl >= 2 ? Math.min(2 * (lvl - 1), 12) : 0;
      for (let i = 0; i < n && forest.trees.length; i++) {
        const t = forest.trees[(i * 7919) % forest.trees.length];
        const dx = ((i * 37) % 11 - 5) * 0.00018, dy = ((i * 53) % 11 - 5) * 0.00018;
        this.Lf.marker([t.lat + dy, t.lon + dx], { icon: this.Lf.divIcon({ className: "fm-fly", html: `<span>${i % 3 ? "🦋" : "🐝"}</span>`, iconSize: [22, 22] }), interactive: false, keyboard: false })
          .addTo(this.decoLayer);
      }
      const birds = lvl >= 3 ? Math.min(lvl - 2, 5) : 0, petals = lvl >= 5 ? 9 : 0;
      this.sky.innerHTML =
        Array.from({ length: birds }, (_, i) => `<span class="fm-bird" style="top:${8 + i * 9}%;animation-duration:${22 + i * 5}s;animation-delay:${-i * 6}s">🕊️</span>`).join("") +
        Array.from({ length: petals }, (_, i) => `<span class="fm-petal" style="left:${(i * 11 + 4) % 96}%;animation-duration:${9 + (i % 4) * 2}s;animation-delay:${-i * 1.7}s">🌸</span>`).join("");
    },

    // Zooms to a tree and drops it in with a pulsing ring.
    showNewTree(t) {
      this.newTree = t;
      if (!this.ready) return;
      this.hiLayer.clearLayers();
      const m = this.Lf.marker([t.lat, t.lon], { icon: this.iconFor(t, true), zIndexOffset: 1000 }).bindPopup(popupHtml(t, true), { autoPan: false, offset: [0, -56] }).addTo(this.hiLayer);
      this.map.flyTo([t.lat, t.lon], 16, { duration: 1.4 });
      setTimeout(() => m.openPopup(), 1500);
      this.refresh();
    },
    clearNewTree() { this.newTree = null; if (this.hiLayer) this.hiLayer.clearLayers(); },
    fitAll() { if (this.ready) this.map.invalidateSize(); this.map.fitBounds([[BBOX[0], BBOX[1]], [BBOX[2], BBOX[3]]], { padding: [14, 14] }); },
  };

  // ------------------------------------------------------------------ the overlay
  let root = null;
  function ensureRoot() {
    if (root) return root;
    root = document.createElement("div");
    root.id = "l1Focus";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Pomidor usuli");
    document.body.appendChild(root);
    root.addEventListener("click", onClick);
    return root;
  }

  const tomatoSvg = (frac) => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="${R}" class="fc-ring-track"/>
    <circle cx="60" cy="60" r="${R}" class="fc-ring" id="fcRing" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${(CIRC * (1 - frac)).toFixed(1)}" transform="rotate(-90 60 60)"/>
    <g class="fc-fruit"><g transform="translate(60 63) scale(1.34) translate(-60 -63)">
      <path d="M60 36c-17 0-30 11-30 27s13 27 30 27 30-11 30-27-13-27-30-27Z" fill="#ef4444"/>
      <ellipse cx="47" cy="52" rx="7" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-30 47 52)"/>
      <path d="M60 41c-3-4-9-6-14-4 4 1 7 3 9 6-5 0-9 2-11 6 5-2 10-2 14 0-1 4 0 8 2 10 1-3 3-6 6-8 3 2 5 5 6 8 2-2 3-6 2-10 4-2 9-2 14 0-2-4-6-6-11-6 2-3 5-5 9-6-5-2-11 0-14 4Z" fill="#3aa655"/>
      <path d="M60 41c0-4 1-7 4-9" stroke="#2c7a3f" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g></g></svg>`;

  const stepsHtml = () => `<div class="fc-steps">${PLAN.map((p, i) => {
    const cur = S.phase === "done" ? -1 : S.step === 0 ? (S.phase === "focus" || S.phase === "planting" ? 0 : 1) : 2;
    const cls = S.phase === "done" || i < cur ? "is-done" : i === cur ? "is-now" : "";
    return `<span class="${cls}">${p.kind === "rest" ? "☕" : "🍅"} ${p.min}</span>`;
  }).join("")}</div>`;

  function render() {
    ensureRoot();
    root.classList.toggle("is-open", open);
    if (!open) return;
    const phase = S.phase;
    root.dataset.phase = phase;
    if (view === "map") return renderMap();
    if (phase === "focus" || phase === "idle") { view = "timer"; return renderTimer(); }
    view = "plant";
    return renderPlant();
  }

  function renderTimer() {
    root.dataset.view = "timer";
    const left = Math.max(0, S.endsAt - now());
    root.innerHTML = `
      <div class="fc-bar"><button type="button" class="fc-back" data-fc="back" aria-label="Orqaga">‹ Orqaga</button>
        <span class="fc-chip">🌳 Bugun <b>${sum.today}/${sum.daily}</b></span></div>
      <div class="fc-center">
        <div class="fc-tomato">${tomatoSvg(1 - left / (S.dur || PLAN[0].min * 60000))}<span class="fc-time" id="fcTime">${mmss(left)}</span></div>
        <div class="fc-phase">${S.step === 0 ? "1-qism" : "2-qism"} · Dars vaqti</div>
        <div class="fc-hint">Diqqat bilan o'qing, telefonni chetga qo'ying. Vaqt tugagach bu yerga qaytsangiz, daraxtingiz ekiladi 🌳</div>
        ${stepsHtml()}
        <div class="fc-note">Ekranni o'chirib qo'ysangiz ham vaqt davom etadi.</div>
      </div>`;
  }

  function renderPlant() {
    root.dataset.view = "plant";
    const t = S.tree;
    let card = "";
    if (S.phase === "planting") {
      card = `<div class="fc-big">🌱 Daraxt ekilmoqda…</div><div class="fc-note">Bir lahza kuting.</div>`;
    } else if (S.phase === "rest") {
      card = `
        <div class="fc-big">🌳 Siz daraxt ekdingiz!</div>
        <div class="fc-place">📍 ${esc(t.spot)}</div>
        <div class="fc-note">${S.awarded ? `+${S.awarded} ball · ` : ""}Bugun ${sum.today}/${sum.daily} ta daraxt · Asaka bog'ida jami ${sum.total} ta</div>
        <div class="fc-rest"><div class="fc-mini"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" class="fc-ring-track"/><circle cx="60" cy="60" r="${R}" class="fc-ring" id="fcRing" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}" transform="rotate(-90 60 60)"/></svg><span id="fcTime">${mmss(S.restEndsAt - now())}</span></div>
          <div><div class="fc-phase" style="font-size:16px">☕ Dam olish</div><div class="fc-note">Ko'zingizni dam oldiring, suv iching.</div></div></div>
        ${stepsHtml()}
        <div class="fc-actions"><button type="button" class="fc-btn is-quiet" data-fc="skiprest">Dam olishni tugatish</button></div>`;
    } else if (S.phase === "ready") {
      card = `
        <div class="fc-big">☕ Dam tugadi!</div>
        <div class="fc-note">Yana 25 daqiqa dars qilamiz — yana bitta daraxt ekasiz.</div>
        ${stepsHtml()}
        <div class="fc-actions"><button type="button" class="fc-btn" data-fc="start2">▶ 2-qismni boshlash</button></div>`;
    } else if (S.phase === "done") {
      card = `
        <div class="fc-big">🎉 Bir soatlik dars tugadi!</div>
        <div class="fc-place">📍 Oxirgi daraxt: ${esc(t.spot)}</div>
        <div class="fc-note">${S.awarded ? `+${S.awarded} ball · ` : ""}Bugun ${sum.today}/${sum.daily} ta daraxt ekdingiz. Asaka bog'ida jami ${sum.total} ta daraxt bor.</div>
        <div class="fc-actions">
          <button type="button" class="fc-btn is-green" data-fc="map">🗺️ Asaka bog'i</button>
          <button type="button" class="fc-btn" data-fc="again">▶ Yana bir soat</button>
          <button type="button" class="fc-btn is-quiet" data-fc="exit">Chiqish</button></div>`;
    }
    root.innerHTML = `
      <div class="fc-bar"><button type="button" class="fc-back" data-fc="back" aria-label="Chiqish">‹ Orqaga</button>
        <button type="button" class="fc-chip" data-fc="map" style="cursor:pointer">🗺️ Butun xarita</button></div>
      <div class="fc-scroll"><div class="fc-plant"><div id="fcMapSlot"></div><div class="fc-card" style="display:flex;flex-direction:column;gap:12px">${card}</div></div></div>`;
    FM.attach($("fcMapSlot"), false).then(() => { if (t) FM.showNewTree(t); });
  }

  function renderMap() {
    root.dataset.view = "map";
    const lvl = levelOf(sum.total), cur = LEVELS[lvl], next = LEVELS[lvl + 1];
    const pct = next ? Math.round(((sum.total - cur.at) / (next.at - cur.at)) * 100) : 100;
    const rows = (boardMode === "week" ? forest.week : forest.all).map((e, i) => {
      const initials = esc((e.name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
      const av = e.photoUrl ? `<img src="${esc(e.photoUrl)}" alt="">` : initials;
      return `<div class="fc-row ${e.id === forest.meId ? "is-me" : ""}"><span class="fc-rank">${i + 1}</span><span class="fc-av">${av}</span>
        <span class="fc-rowname">${esc(e.name)}</span><span class="fc-rowval">🌳 ${e.trees} · ${e.minutes} daq</span></div>`;
    }).join("") || `<div class="fc-note" style="padding:10px 4px">Hali hech kim daraxt ekmagan. Birinchi bo'ling!</div>`;
    root.innerHTML = `
      <div class="fc-bar"><button type="button" class="fc-back" data-fc="back" aria-label="Orqaga">‹ Orqaga</button>
        <span class="fc-title">🌳 Asaka bog'i</span><span class="fc-chip">${lvl + 1}-daraja</span></div>
      <div class="fc-scroll"><div class="fc-plant">
        <div id="fcMapSlot"></div>
        <div class="fc-card fc-level">
          <div style="display:flex;justify-content:space-between;gap:8px;font-weight:900;font-size:14px"><span>${esc(cur.name)}</span><span style="color:var(--l1-muted);font-size:12px">${next ? `Keyingisi: ${esc(next.name)}` : "Eng yuqori daraja!"}</span></div>
          <div class="fc-bar-track"><div class="fc-bar-fill" style="width:${pct}%"></div></div>
          <div class="fc-note">${next ? `${next.at - sum.total} ta daraxtdan keyin xarita yanada chiroyli bo'ladi: ranglar yorqinlashadi, kapalaklar va qushlar paydo bo'ladi.` : "Asaka gullab-yashnadi! Hammaga rahmat 🌸"}</div>
        </div>
        <div class="fc-stats">
          <div class="fc-stat"><b>${sum.total}</b><span>Jami daraxt</span></div>
          <div class="fc-stat"><b>${sum.mine}</b><span>Siz ekkan</span></div>
          <div class="fc-stat"><b>${sum.today}/${sum.daily}</b><span>Bugun</span></div>
          <div class="fc-stat"><b>${sum.spotsFilled}/${sum.spotsTotal}</b><span>Joylar</span></div>
        </div>
        <div class="fc-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span class="fc-title">🏆 Eng ko'p ekkanlar</span>
            <span class="fc-seg"><button type="button" data-fc="board-week" class="${boardMode === "week" ? "is-on" : ""}">Bu hafta</button><button type="button" data-fc="board-all" class="${boardMode === "all" ? "is-on" : ""}">Hammasi</button></span></div>
          ${rows}
        </div>
        <div class="fc-note" style="text-align:center">Xarita: © OpenStreetMap mualliflari</div>
      </div></div>`;
    // the overview shows the whole district with every tree (the highlighted one is for the "just planted" screen)
    FM.attach($("fcMapSlot"), true).then(() => { if (!FM.ready) return; FM.clearNewTree(); FM.fitAll(); FM.refresh(); });
  }

  function showLeaveSheet() {
    if (root.querySelector(".fc-modal")) return;
    const m = document.createElement("div");
    m.className = "fc-modal";
    m.innerHTML = `<div class="fc-card" style="max-width:340px;display:flex;flex-direction:column;gap:12px;text-align:center">
      <div class="fc-big" style="font-size:19px">Chiqmoqchimisiz?</div>
      <div class="fc-hint" style="margin:0 auto">Hozir chiqsangiz, bu 25 daqiqa hisobga olinmaydi va daraxt ekilmaydi.</div>
      <div class="fc-actions"><button type="button" class="fc-btn" data-fc="stay">Davom etish</button><button type="button" class="fc-btn is-quiet" data-fc="leave">Chiqish</button></div></div>`;
    root.appendChild(m);
  }

  // ------------------------------------------------------------------ flow
  function tick() {
    if (!open) return;
    if (S.phase === "focus") {
      const left = S.endsAt - now();
      const t = $("fcTime"), ring = $("fcRing");
      if (t) t.textContent = mmss(left);
      if (ring) ring.setAttribute("stroke-dashoffset", (CIRC * (left / (S.dur || PLAN[0].min * 60000))).toFixed(1));
      document.title = `🍅 ${mmss(left)}`;
      if (left <= 0) completeFocus();
    } else if (S.phase === "rest") {
      const left = S.restEndsAt - now();
      const t = $("fcTime"), ring = $("fcRing");
      if (t) t.textContent = mmss(left);
      if (ring) ring.setAttribute("stroke-dashoffset", (CIRC * (left / REST_MS)).toFixed(1));
      document.title = `☕ ${mmss(left)}`;
      if (left <= 0) { S.phase = "ready"; save(); chime(); buzz(); if (view !== "map") render(); }
    }
  }
  function startTicker() { if (!ticker) ticker = setInterval(tick, 250); }
  function stopTicker() { if (ticker) clearInterval(ticker); ticker = null; document.title = baseTitle; }
  const baseTitle = document.title;

  async function keepAwake() {
    try { if (navigator.wakeLock && !wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } } catch (e) { /* optional */ }
  }
  function releaseAwake() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

  async function begin(step) {
    if (busy) return;
    busy = true;
    FM.clearNewTree();
    open = true; view = "timer"; S = { step, phase: "idle", endsAt: now() + PLAN[0].min * 60000 }; render();
    unlockAudio();
    loadLeaflet().catch(() => {}); loadForest().catch(() => {});
    const r = await api("/api/focus/start", "POST", {});
    busy = false;
    if (!r.ok) {
      toast((r.data && r.data.message) || "Boshlab bo'lmadi. Internetni tekshiring.");
      close(true);
      return;
    }
    sync(r.data.now);
    sum.today = r.data.todayTrees; sum.daily = r.data.dailyTrees;
    S = { step, phase: "focus", sid: r.data.id, endsAt: r.data.endsAt * 1000, dur: r.data.seconds * 1000 };
    save(); render(); startTicker(); keepAwake();
  }

  async function completeFocus() {
    if (busy || S.phase !== "focus") return;
    busy = true; S.phase = "planting"; view = "plant"; save(); render();
    let r = null;
    for (let i = 0; i < 8; i++) { // a 409 right at the end only means the phone's clock runs a little fast
      r = await api("/api/focus/finish", "POST", { id: S.sid });
      if (r.ok || r.status !== 409) break;
      await sleep(2000);
    }
    busy = false;
    if (!r || !r.ok) {
      toast((r && r.data && r.data.message) || "Daraxt ekilmadi. Internetni tekshiring.");
      close(true);
      return;
    }
    const d = r.data;
    S.tree = d.tree; S.awarded = d.awarded;
    sum.today = d.todayTrees; sum.daily = d.dailyTrees || sum.daily;
    if (!d.already) { sum.total += 1; sum.mine += 1; }
    d.tree.mineFlag = true;
    addTrees([d.tree]);
    const added = forest.trees.find((t) => t.id === d.tree.id); if (added) added.mineFlag = true;
    plantSound(); buzz();
    if (S.step === 0) { S.phase = "rest"; S.restEndsAt = now() + REST_MS; } else { S.phase = "done"; if (snd()) setTimeout(() => snd().finish(), 700); }
    save(); emit();
    loadForest().then(() => { if (view === "map") render(); }).catch(() => {});
    render();
  }

  function close(clear) {
    open = false;
    stopTicker(); releaseAwake();
    FM.clearNewTree();
    if (clear) clearState();
    if (root) { root.classList.remove("is-open"); root.innerHTML = ""; }
    emit();
  }

  function onClick(ev) {
    const b = ev.target.closest("[data-fc]");
    if (!b) return;
    const act = b.dataset.fc;
    const l = L1(); if (l && l.Haptic) l.Haptic.tap();
    if (act === "back") {
      if (view === "map") {
        if (["rest", "ready", "done"].includes(S.phase)) { view = "plant"; return render(); }
        return close(true);
      }
      if (S.phase === "focus") return showLeaveSheet();
      if (S.phase === "planting") return;
      return close(true);
    }
    if (act === "stay") { const m = root.querySelector(".fc-modal"); if (m) m.remove(); return; }
    if (act === "leave") {
      const sid = S.sid;
      close(true);
      if (sid) api("/api/focus/cancel", "POST", { id: sid });
      return;
    }
    if (act === "exit") return close(true);
    if (act === "map") { view = "map"; return render(); }
    if (act === "skiprest" || act === "start2") return begin(1);
    if (act === "again") return begin(0);
    if (act === "board-week" || act === "board-all") { boardMode = act === "board-week" ? "week" : "all"; return render(); }
  }

  document.addEventListener("visibilitychange", () => { if (!document.hidden) { tick(); if (open && S.phase === "focus") keepAwake(); } });

  // ------------------------------------------------------------------ public API
  async function openFocus() {
    ensureRoot();
    if (open) return;
    if (S.phase === "focus" || S.phase === "rest" || S.phase === "ready") { if (await resume(true)) return; }
    begin(0);
  }
  async function openMap() {
    ensureRoot();
    open = true; view = "map";
    if (!["rest", "ready", "done"].includes(S.phase)) clearState();
    render();
    loadLeaflet().catch(() => {});
    await loadForest();
    render();
  }

  // Picks up a block that is still running (page reloaded, app reopened after the phone slept).
  async function resume(force) {
    if (open && !force) return false;
    const r = await api("/api/focus/state");
    if (!r.ok) return false;
    sync(r.data.now);
    sum.today = r.data.todayTrees; sum.daily = r.data.dailyTrees;
    const a = r.data.active;
    if (a) { // a block is running (or finished while the app was closed and is waiting to be planted)
      S = { step: S.sid === a.id ? S.step || 0 : 0, phase: "focus", sid: a.id, endsAt: a.endsAt * 1000, dur: a.seconds * 1000 };
      save(); open = true; view = "timer"; render(); startTicker(); keepAwake();
      tick();
      return true;
    }
    if (S.phase === "focus" || S.phase === "planting") clearState();
    if ((S.phase === "rest" || S.phase === "ready") && S.restEndsAt && now() - S.restEndsAt < 3 * 3600 * 1000 && S.tree) {
      open = true; view = "plant"; render(); startTicker(); tick();
      return true;
    }
    if (S.phase === "rest" || S.phase === "ready" || S.phase === "done") clearState();
    emit();
    return false;
  }

  window.L1_Focus = { open: openFocus, openMap, resume, summary: () => Object.assign({}, sum), levelOf, LEVELS };

  // Once the student is signed in: load the totals for the home card and resume a running block.
  let boot = 0;
  const bootTimer = setInterval(async () => {
    if (++boot > 90) return clearInterval(bootTimer);
    if (!window.l1GetToken || !window.l1GetToken()) return;
    clearInterval(bootTimer);
    await loadForest(true);
    await resume(false);
  }, 1500);
})();
