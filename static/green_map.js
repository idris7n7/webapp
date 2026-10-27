/* Yashil shahar: the shared map of the class's trees (full screen, opened from the floating tomato or the home screen).
 *
 *   Xarita  (browse)  only looking: the class's trees, how many cities of Andijan are left to green, "Sizning shahringiz:
 *                     Asaka" and, when no Pomodoro runs, a button that starts one. Nothing on the map can be tapped.
 *   Ekish   (plant)   the trees of today and the wilted ones, the ranking and "Mening daraxtlarim" on top, and the
 *                     planting itself.
 *
 * Every finished Pomodoro earns one tree. Asaka's green areas (parks, school yards, grass, woods from OpenStreetMap)
 * are places the class fills one after another (green_city.py): a tree goes into the open place, or into an area an
 * administrator drew, never on a road or inside a building, and never closer than 2 m to another tree. The server
 * makes the final decision; this file shows the preview first.
 *
 * Map: Leaflet (static/vendor/leaflet) with OpenStreetMap tiles. Loaded only when the map is opened.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L1 = () => window.L1 || null;
  const Art = () => window.L1_TreeArt;
  const BBOX = [40.5567, 72.0917, 40.7583, 72.3620]; // Asaka district: south, west, north, east
  const KIND_KEY = "l1_gv_kind";
  const fmtM = (m) => String(Math.round(m * 10) / 10).replace(".", ",");
  const ago = (at) => {
    const m = Math.max(0, Math.floor((Date.now() / 1000 - at) / 60));
    if (m < 2) return "hozirgina"; if (m < 60) return `${m} daqiqa oldin`;
    const h = Math.floor(m / 60); if (h < 24) return `${h} soat oldin`;
    return `${Math.floor(h / 24)} kun oldin`;
  };
  const stageOf = (at) => { const d = (Date.now() / 1000 - (at || 0)) / 86400; return d < 0.5 ? 0 : d < 3 ? 1 : d < 10 ? 2 : 3; };

  // ------------------------------------------------------------------ data
  const G = {
    trees: new Map(), since: 0, meId: "", loaded: false, isAdmin: false, minDistance: 2, prices: {},
    sum: { cityTrees: 0, cityWilted: 0, unplanted: 0, planted: 0, wilted: 0, finished: 0, kinds: ["oak"], points: 0, today: 0, daily: 12 },
    week: [], all: [], zones: [], boardMode: "week",
    places: { order: [], caps: [], open: null, counts: {}, full: 0, total: 0 }, region: null,
  };
  let zonesData = null, zonesPromise = null;

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
  const snd = () => (L1() && L1().Sound) || null;
  const haptic = (k) => { const l = L1(); if (l && l.Haptic && l.Haptic[k]) l.Haptic[k](); };
  function plantSound() {
    const s = snd(); if (!s) return;
    s.noise(0.2, 0, 0.2, "lowpass", 520, 110); // spade in the soil
    s.tone(523, "sine", 0.28, 0.16, 0.13); s.tone(659, "sine", 0.28, 0.32, 0.13); s.tone(784, "sine", 0.28, 0.48, 0.13); s.tone(1046, "sine", 0.6, 0.64, 0.14);
  }
  function reviveSound() { const s = snd(); if (!s) return; s.tone(392, "sine", 0.25, 0, 0.12); s.tone(523, "sine", 0.25, 0.18, 0.12); s.tone(784, "sine", 0.5, 0.36, 0.13); }

  function applyCity(d, full) {
    G.meId = d.meId || G.meId;
    for (const t of d.trees || []) G.trees.set(t.id, t);
    Object.assign(G.sum, { cityTrees: d.cityTrees, cityWilted: d.cityWilted, unplanted: d.unplanted, planted: d.planted, wilted: d.wilted,
      finished: d.finished, kinds: d.kinds, points: d.points, today: d.todayTrees, daily: d.dailyTrees });
    G.week = d.week; G.all = d.all; G.zones = d.zones || []; G.isAdmin = !!d.isAdmin; G.minDistance = d.minDistance || 2; G.prices = d.prices || {};
    if (d.places) G.places = d.places;
    if (d.region) G.region = d.region;
    G.since = Math.max(0, (d.now || 0) - 5);
    G.loaded = true;
    if (window.L1_Focus) { window.L1_Focus.setCity(d.cityTrees); window.L1_Focus.setCounts({ unplanted: d.unplanted, planted: d.planted, wilted: d.wilted, finished: d.finished, todayTrees: d.todayTrees, dailyTrees: d.dailyTrees }); }
  }
  async function loadCity(full) {
    const r = await api("/api/green?since=" + (full ? 0 : G.since));
    if (!r.ok) return false;
    applyCity(r.data, full);
    return true;
  }
  function loadZones() {
    if (zonesPromise) return zonesPromise;
    zonesPromise = fetch("/static/green_zones.json").then((r) => r.json()).then((d) => { zonesData = d; return d; }).catch(() => { zonesPromise = null; return null; });
    return zonesPromise;
  }

  // ------------------------------------------------------------------ geometry (same rules as the server, used for the preview)
  const MPD = 111320;
  function meters(lat1, lon1, lat2, lon2) {
    const k = Math.cos(((lat1 + lat2) / 2) * Math.PI / 180);
    return Math.hypot((lon2 - lon1) * k * MPD, (lat2 - lat1) * MPD);
  }
  function nearestTree(lat, lon) {
    let best = null, hit = null;
    for (const t of G.trees.values()) {
      if (Math.abs(t.lat - lat) > 0.0006 || Math.abs(t.lon - lon) > 0.0008) continue;
      const d = meters(lat, lon, t.lat, t.lon);
      if (best === null || d < best) { best = d; hit = t; }
    }
    return { d: best, tree: hit };
  }
  function insideRing(lat, lon, ring) {
    let ok = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [yi, xi] = ring[i], [yj, xj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) ok = !ok;
    }
    return ok;
  }
  const inShape = (lat, lon, z) => { const b = z.b; return lat >= b[0] && lat <= b[2] && lon >= b[1] && lon <= b[3] && insideRing(lat, lon, z.r[0]) && !z.r.slice(1).some((h) => insideRing(lat, lon, h)); };
  function segMeters(lat, lon, a, b) {
    const k = Math.cos(lat * Math.PI / 180);
    const ax = (a[1] - lon) * k * MPD, ay = (a[0] - lat) * MPD, bx = (b[1] - lon) * k * MPD, by = (b[0] - lat) * MPD;
    const dx = bx - ax, dy = by - ay, ln = dx * dx + dy * dy;
    const t = ln ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / ln)) : 0;
    return Math.hypot(ax + t * dx, ay + t * dy);
  }
  function nearRoad(lat, lon) {
    const pad = 0.0001;
    for (const r of (zonesData && zonesData.roads) || []) {
      const b = r.b;
      if (lat < b[0] - pad || lat > b[2] + pad || lon < b[1] - pad || lon > b[3] + pad) continue;
      for (let i = 0; i + 1 < r.p.length; i++) if (segMeters(lat, lon, r.p[i], r.p[i + 1]) <= (r.w || 3)) return true;
    }
    return false;
  }
  // The same order as green_city.Zones.judge: road, building, an administrator's area, the open place, a locked place.
  const REASONS = {
    road: "Yo'lning o'rtasiga daraxt ekilganini qayerda ko'rgansiz? Yo'ldan chetroq joy tanlang.",
    building: "Bu yerda bino bor. Binodan tashqarida joy tanlang.",
    locked: "Bu joy hali yopiq. Avval ochiq joyni (yashil chiziq bilan belgilangan) daraxtlarga to'ldiramiz.",
    outside: "Bu yer daraxt ekishga mos emas. Xaritada yashil chiziq bilan belgilangan ochiq joyni tanlang.",
  };
  function groundVerdict(lat, lon) {
    if (nearRoad(lat, lon)) return "road";
    if (zonesData && zonesData.block.some((z) => inShape(lat, lon, z))) return "building";
    if (G.zones.some((z) => insideRing(lat, lon, z.polygon))) return "ok";
    const open = G.places.open;
    if (zonesData && open != null && zonesData.green[open] && inShape(lat, lon, zonesData.green[open])) return "ok";
    if (!zonesData || !zonesData.green.some((z) => inShape(lat, lon, z))) return "outside";
    return open == null ? "ok" : "locked";
  }
  // the trees each place takes, and its number in the filling order (1 = the first one)
  function placeInfo(i) {
    const k = G.places.order.indexOf(i);
    return { n: k + 1, cap: k >= 0 ? G.places.caps[k] : 0, have: G.places.counts[String(i)] || 0 };
  }

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

  const M = {
    map: null, Lf: null, tiles: null, zoneLayer: null, blockLayer: null, customLayer: null, treeLayer: null, dotLayer: null, fxLayer: null, decoLayer: null,
    ghost: null, ring: null, line: null, drawLayer: null, sky: null, ready: false, newId: 0, boundsAll: null,

    async build(div) {
      const Lf = this.Lf = await loadLeaflet();
      const bounds = Lf.latLngBounds([BBOX[0], BBOX[1]], [BBOX[2], BBOX[3]]);
      // zoom 20 is the tiles of zoom 19 enlarged: at that scale the 2 m circle of a new tree is big enough to place it by eye
      this.map = Lf.map(div, { zoomControl: false, attributionControl: true, minZoom: 11, maxZoom: 20, maxBounds: bounds.pad(0.25), maxBoundsViscosity: 0.9, zoomSnap: 0.5, doubleClickZoom: false });
      this.map.attributionControl.setPrefix(false);
      // the cards at the bottom cover the bottom corners: the OpenStreetMap credit (the tiles' licence asks for it to be
      // seen) and the scale go to the top
      this.map.attributionControl.setPosition("topright");
      this.map.fitBounds(bounds, { padding: [10, 10] });
      Lf.control.zoom({ position: "topleft", zoomInText: "+", zoomOutText: "−" }).addTo(this.map);
      Lf.control.scale({ position: "topleft", imperial: false, maxWidth: 90 }).addTo(this.map);
      this.tiles = Lf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20, maxNativeZoom: 19, keepBuffer: 3, updateWhenIdle: true,
        referrerPolicy: "origin", // OpenStreetMap's tile policy wants to see which site asks
        attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      }).addTo(this.map);
      this.applyFilter();
      new MutationObserver(() => this.applyFilter()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const pane = (name, z) => { const p = this.map.createPane(name); p.style.zIndex = z; return p; };
      pane("gmZones", 410); pane("gmBlocks", 415); pane("gmTrees", 600); pane("gmFx", 640);
      this.zoneLayer = Lf.layerGroup().addTo(this.map);
      this.blockLayer = Lf.layerGroup();
      this.customLayer = Lf.layerGroup().addTo(this.map);
      this.exLayer = Lf.layerGroup().addTo(this.map);
      this.exCanvas = Lf.canvas({ pane: "gmBlocks" });
      this.dotLayer = Lf.layerGroup().addTo(this.map);
      this.treeLayer = Lf.layerGroup().addTo(this.map);
      this.decoLayer = Lf.layerGroup().addTo(this.map);
      this.fxLayer = Lf.layerGroup().addTo(this.map);
      this.drawLayer = Lf.layerGroup().addTo(this.map);
      this.sky = document.createElement("div");
      this.sky.className = "gm-sky";
      div.parentNode.appendChild(this.sky);
      this.map.on("zoomend", () => { this.syncBlocks(); this.refreshTrees(); });
      let t = 0;
      this.map.on("moveend", () => { clearTimeout(t); t = setTimeout(() => { if (!this.map._popup) this.refreshTrees(); }, 120); });
      this.map.on("popupclose", () => setTimeout(() => this.refreshTrees(), 0));
      this.map.on("click", (e) => onMapClick(e.latlng));
      this.ready = true;
    },

    applyFilter() {
      if (!this.map) return;
      const dark = document.documentElement.dataset.theme === "dark";
      this.map.getPane("tilePane").style.filter = `${dark ? "invert(1) hue-rotate(180deg) brightness(.9) contrast(.92) " : ""}saturate(.82) brightness(1.02)`;
    },

    drawZones() {
      if (!this.ready || !zonesData) return;
      const Lf = this.Lf;
      this.zoneLayer.clearLayers();
      const all = [];
      this.zonePolys = zonesData.green.map((z) => {
        all.push([z.b[0], z.b[1]], [z.b[2], z.b[3]]);
        return Lf.polygon(z.r, { pane: "gmZones", className: "gm-zone", interactive: false, smoothFactor: 0.6 }).addTo(this.zoneLayer);
      });
      if (all.length) this.boundsAll = Lf.latLngBounds(all);
      this.styleZones();
      this.drawCustom();
      this.syncBlocks();
    },

    // Full places are green and the open one has a bright outline (and, while planting, its count of trees on it);
    // while planting, the locked places are grey so it is clear why a tree cannot go there.
    styleZones() {
      if (!this.ready || !this.zonePolys) return;
      const planting = mode === "plant", open = G.places.open;
      this.zonePolys.forEach((poly, i) => {
        const p = placeInfo(i), full = p.cap > 0 && p.have >= p.cap, isOpen = i === open;
        poly.setStyle(isOpen ? { color: "#0f9d58", weight: 3, opacity: 1, fillColor: "#34c971", fillOpacity: 0.32 }
          : full ? { color: "#1f8f4e", weight: 1.4, opacity: 0.9, fillColor: "#2fb463", fillOpacity: 0.45 }
          : planting ? { color: "#8b93a8", weight: 1, opacity: 0.75, fillColor: "#a3acc4", fillOpacity: 0.22 }
          : { color: "#1f9d55", weight: 0, opacity: 0, fillColor: "#34c971", fillOpacity: 0 });
        const el = poly.getElement && poly.getElement();
        if (el) el.classList.toggle("is-open", isOpen);
      });
      if (this.placeTag) { this.map.removeLayer(this.placeTag); this.placeTag = null; }
      const z = open != null && zonesData && zonesData.green[open];
      if (planting && z) {
        const p = placeInfo(open);
        this.placeTag = this.Lf.marker([z.b[2], (z.b[1] + z.b[3]) / 2], { pane: "gmFx", interactive: false, keyboard: false,
          icon: this.Lf.divIcon({ className: "gm-place-tag", html: `<span>${p.n}-joy · ${p.have}/${p.cap} 🌳</span>`, iconSize: [0, 0] }) }).addTo(this.map);
      }
    },

    drawCustom() {
      if (!this.ready) return;
      this.customLayer.clearLayers();
      for (const z of G.zones) {
        const p = this.Lf.polygon(z.polygon, { pane: "gmZones", className: "gm-zone is-custom", color: "#1f9d55", weight: 2, dashArray: "6 5", fillColor: "#34c971", fillOpacity: 0.3 }).addTo(this.customLayer);
        if (G.isAdmin) p.on("click", (e) => {
          if (mode !== "browse") return;
          p.bindPopup(`<div class="gm-pop"><div><b>${esc(z.name)}</b><span>Qo'shilgan hudud</span><button type="button" class="gm-pop-btn is-danger" data-gm="zone-del" data-id="${z.id}">O'chirish</button></div></div>`).openPopup(e.latlng);
        });
      }
    },

    // Buildings stand inside school yards: show them grey so it is clear why a tree cannot go there.
    syncBlocks() {
      if (!this.ready || !zonesData) return;
      const show = this.map.getZoom() >= 16;
      if (show && !this.blockLayer.getLayers().length) {
        const canvas = this.Lf.canvas({ pane: "gmBlocks" });
        for (const b of zonesData.block) this.Lf.polygon(b.r[0], { renderer: canvas, pane: "gmBlocks", color: "#8791ad", weight: 0.8, fillColor: "#a3acc4", fillOpacity: 0.45, interactive: false }).addTo(this.blockLayer);
      }
      if (show) this.blockLayer.addTo(this.map); else this.map.removeLayer(this.blockLayer);
    },

    iconFor(t, big) {
      const wilted = t.state === "wilted";
      const stage = big ? Math.max(2, stageOf(t.at)) : stageOf(t.at);
      const z = this.map.getZoom();
      const px = (big ? 1.25 : 1) * (z >= 19 ? 54 : z >= 18 ? 44 : z >= 17 ? 34 : z >= 16 ? 27 : 21);
      return this.Lf.divIcon({
        className: `gm-tree${t.ownerId === G.meId ? " is-mine" : ""}${wilted ? " is-wilted" : ""}${t.id === this.newId ? " is-new" : ""}`,
        html: Art().svg(t.kind || "oak", stage, wilted), iconSize: [px, px * 1.2], iconAnchor: [px / 2, px * 1.2 - 2],
      });
    },

    refreshTrees() {
      if (!this.ready) return;
      this.treeLayer.clearLayers(); this.dotLayer.clearLayers(); this.exLayer.clearLayers();
      const z = this.map.getZoom(), bounds = this.map.getBounds().pad(0.25);
      let shown = 0;
      for (const t of G.trees.values()) {
        const wilted = t.state === "wilted";
        // while planting, every tree shows the 2 m around it where no other tree may stand
        if (mode === "plant" && z >= 17 && bounds.contains([t.lat, t.lon])) {
          this.Lf.circle([t.lat, t.lon], { renderer: this.exCanvas, radius: G.minDistance, color: "#e5484d", weight: 1.2, opacity: 0.55, fillColor: "#e5484d", fillOpacity: 0.2, interactive: false }).addTo(this.exLayer);
        }
        if (z >= 15 && bounds.contains([t.lat, t.lon]) && shown < 700) {
          shown++;
          // the trees are only to look at (a wilted one is brought back from "Mening daraxtlarim")
          this.Lf.marker([t.lat, t.lon], { pane: "gmTrees", icon: this.iconFor(t), interactive: false, keyboard: false, zIndexOffset: Math.round(t.lat * -1e4) }).addTo(this.treeLayer);
        } else if (z < 15) {
          this.Lf.circleMarker([t.lat, t.lon], { pane: "gmTrees", radius: G.trees.size < 80 ? 6 : 4, color: "#fff", weight: 1, fillColor: Art().color(t.kind, wilted), fillOpacity: 0.95, interactive: false }).addTo(this.dotLayer);
        }
      }
      this.decorate();
    },

    // The more trees the city has, the livelier the map: butterflies near the trees, birds, falling petals.
    decorate() {
      if (!this.ready) return;
      const total = G.sum.cityTrees;
      const lvl = total >= 600 ? 5 : total >= 220 ? 4 : total >= 60 ? 3 : total >= 25 ? 2 : total >= 8 ? 1 : 0;
      this.decoLayer.clearLayers();
      const list = [...G.trees.values()].filter((t) => t.state === "planted");
      const n = this.map.getZoom() >= 15 ? Math.min(lvl * 2, 10) : 0;
      for (let i = 0; i < n && list.length; i++) {
        const t = list[(i * 7919) % list.length];
        const dx = ((i * 37) % 11 - 5) * 0.00006, dy = ((i * 53) % 11 - 5) * 0.00006;
        this.Lf.marker([t.lat + dy, t.lon + dx], { pane: "gmFx", icon: this.Lf.divIcon({ className: "gm-fly", html: `<span>${i % 3 ? "🦋" : "🐝"}</span>`, iconSize: [22, 22] }), interactive: false, keyboard: false }).addTo(this.decoLayer);
      }
      const birds = lvl >= 3 ? Math.min(lvl - 2, 3) : 0, petals = lvl >= 4 ? 8 : 0;
      this.sky.innerHTML =
        Array.from({ length: birds }, (_, i) => `<span class="gm-bird" style="top:${14 + i * 9}%;animation-duration:${24 + i * 6}s;animation-delay:${-i * 7}s">🕊️</span>`).join("") +
        Array.from({ length: petals }, (_, i) => `<span class="gm-petal" style="left:${(i * 13 + 6) % 94}%;animation-duration:${10 + (i % 4) * 2}s;animation-delay:${-i * 1.7}s">🌸</span>`).join("");
    },

    // The ghost tree and the 2 m circle of the spot that is being previewed.
    showGhost(c) {
      const Lf = this.Lf;
      const kind = chosenKind();
      if (!this.ghost) {
        this.ghost = Lf.marker([c.lat, c.lon], { pane: "gmFx", draggable: true, keyboard: false, icon: Lf.divIcon({ className: "gm-ghost", html: "", iconSize: [40, 48], iconAnchor: [20, 46] }), zIndexOffset: 2000 }).addTo(this.map);
        this.ghost.on("drag", () => { const p = this.ghost.getLatLng(); this.ring.setLatLng(p); this.line && this.map.removeLayer(this.line); this.line = null; cand = { lat: p.lat, lon: p.lng, verdict: null }; paintPanel(); });
        this.ghost.on("dragend", () => { const p = this.ghost.getLatLng(); setCandidate(p.lat, p.lng, true); });
        this.ring = Lf.circle([c.lat, c.lon], { pane: "gmFx", radius: G.minDistance, color: "#1f9d55", weight: 2, fillColor: "#34c971", fillOpacity: 0.28, interactive: false }).addTo(this.map);
      }
      this.ghost.setLatLng([c.lat, c.lon]); this.ring.setLatLng([c.lat, c.lon]);
      this.ghost.setIcon(Lf.divIcon({ className: "gm-ghost", html: Art().svg(kind, 2, false), iconSize: [40, 48], iconAnchor: [20, 46] }));
    },
    paintGhost(ok, near) {
      if (!this.ring) return;
      this.ring.setStyle(ok === true ? { color: "#1f9d55", fillColor: "#34c971" } : ok === false ? { color: "#e5484d", fillColor: "#ff6b6b" } : { color: "#6b7194", fillColor: "#9aa0c8" });
      if (this.line) { this.map.removeLayer(this.line); this.line = null; }
      if (near && near.tree && near.d < 25 && cand) {
        this.line = this.Lf.polyline([[cand.lat, cand.lon], [near.tree.lat, near.tree.lon]], { pane: "gmFx", color: ok === false ? "#e5484d" : "#6b7194", weight: 2, dashArray: "4 4", interactive: false }).addTo(this.map);
      }
    },
    clearGhost() {
      for (const k of ["ghost", "ring", "line"]) { if (this[k]) { this.map.removeLayer(this[k]); this[k] = null; } }
    },
    flyTo(lat, lon, z) { if (this.ready) this.map.flyTo([lat, lon], z || 18, { duration: 1.1 }); },
    fitTrees(list) {
      if (!this.ready || !list.length) return;
      if (list.length === 1) return this.flyTo(list[0].lat, list[0].lon, 18);
      this.map.flyToBounds(this.Lf.latLngBounds(list.map((t) => [t.lat, t.lon])), { padding: [60, 60], maxZoom: 18, duration: 1 });
    },
  };

  // ------------------------------------------------------------------ the screen
  let flowPlant = false, root = null, mode = "browse", cand = null, checkSeq = 0, checkTimer = 0, poll = 0, openFlag = false, draw = null, busy = false;

  function ensureRoot() {
    if (root) return root;
    root = document.createElement("div");
    root.id = "l1Green";
    root.className = "gm-root";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Yashil shahar");
    root.innerHTML = `
      <header class="gm-bar">
        <button type="button" class="gm-back" data-gm="back" aria-label="Orqaga">‹ Orqaga</button>
        <h1 class="gm-title" id="gmTitle">Yashil shahar</h1>
        <button type="button" class="gm-icon" data-gm="board" aria-label="Reyting">🏆</button>
        <button type="button" class="gm-icon" data-gm="mine" aria-label="Mening daraxtlarim">🌳</button>
      </header>
      <div class="gm-mapwrap"><div class="gm-map" id="gmMap"></div><div class="gm-loading" id="gmLoading">Xarita yuklanmoqda…</div>
        <button type="button" class="gm-locate" data-gm="locate" aria-label="Mening joyim">📍</button><div class="gm-banner" id="gmBanner" hidden></div></div>
      <section class="gm-panel" id="gmPanel"></section>
      <div class="gm-modal" id="gmModal" hidden></div>`;
    document.body.appendChild(root);
    root.addEventListener("click", onClick);
    return root;
  }

  function chosenKind() {
    let k = "";
    try { k = localStorage.getItem(KIND_KEY) || ""; } catch (e) {}
    return G.sum.kinds.includes(k) ? k : "oak";
  }
  function chooseKind(k) { try { localStorage.setItem(KIND_KEY, k); } catch (e) {} }

  // the free tree and the ones bought before can be chosen; the others show their price and open the shop
  function speciesRow() {
    const cur = chosenKind();
    const owned = G.sum.kinds.map((k) => `<button type="button" class="gm-kind${k === cur ? " is-on" : ""}" data-gm="kind" data-kind="${k}" aria-label="${esc(Art().name(k))}" aria-pressed="${k === cur}">${Art().svg(k, 3, false)}<span>${esc(Art().name(k))}</span></button>`);
    const shop = Object.keys(G.prices).filter((k) => !G.sum.kinds.includes(k)).sort((x, y) => G.prices[x] - G.prices[y]).map((k) =>
      `<button type="button" class="gm-kind is-shop${G.prices[k] > G.sum.points ? " is-poor" : ""}" data-gm="shop" data-kind="${k}" aria-label="${esc(Art().name(k))}: ${G.prices[k]} ball">${Art().svg(k, 3, false)}<span>🔒 ${G.prices[k]}</span></button>`);
    return `<div class="gm-kinds-head"><b>Daraxt turini tanlang</b><span class="gm-points">⭐ ${G.sum.points} ball</span></div><div class="gm-kinds">${owned.join("")}${shop.join("")}</div>`;
  }

  function paintBanner() {
    const el = $("gmBanner");
    if (!el) return;
    // (planting explains itself in the panel below the map, so it needs no banner)
    if (mode === "zone") { el.hidden = false; el.innerHTML = `Hudud chegarasini bosib belgilang (${draw ? draw.pts.length : 0} nuqta)`; }
    else el.hidden = true;
    root.dataset.mode = mode;
    const title = $("gmTitle");
    if (title) title.textContent = mode === "plant" ? "Daraxt ekish" : "Yashil shahar";
  }

  const pomodoroIdle = () => !window.L1_Focus || window.L1_Focus.summary().status === "idle";
  function paintPanel() {
    const el = $("gmPanel");
    if (!el) return;
    paintBanner();
    const s = G.sum;
    if (mode === "plant") {
      const open = G.places.open, p = open != null ? placeInfo(open) : null;
      const top = `<div class="gm-subs"><div class="gm-sub"><b>${s.today}</b><span>Bugun (kuniga ${s.daily} tagacha)</span></div>
          <button type="button" class="gm-sub${s.wilted ? " is-warn" : ""}" data-gm="mine"><b>${s.wilted}</b><span>So'lgan</span></button>
          <div class="gm-sub is-ready"><b>${s.unplanted}</b><span>Ekishga tayyor</span></div></div>
        <div class="gm-place">${p ? `<span>📍 Ochiq joy: <b>${p.n}-joy</b></span><span><b>${p.have}</b> / ${p.cap} 🌳</span>` : `<span>🎉 Asakaning hamma joylari to'ldi!</span>`}</div>`;
      let status = s.unplanted > 0 ? `<div class="gm-status"><span class="gm-dot"></span>Yashil chiziq bilan belgilangan ochiq joyni bosing.</div>`
        : `<div class="gm-status"><span class="gm-dot"></span>Ekadigan daraxtingiz yo'q. Pomidorni tugating: har biri 1 ta daraxt.</div>`;
      let canPlant = false;
      if (cand) {
        const v = cand.verdict, local = cand.local;
        if (v) {
          canPlant = !!v.ok;
          const near = v.distance != null ? ` Eng yaqin daraxt: ${fmtM(v.distance)} m.` : "";
          status = v.ok ? `<div class="gm-status is-ok"><span class="gm-dot"></span>Bu yerga ekish mumkin.${near}</div>`
                        : `<div class="gm-status is-bad"><span class="gm-dot"></span>${esc(v.message)}</div>`;
        } else if (local && local.message) {
          status = `<div class="gm-status is-bad"><span class="gm-dot"></span>${esc(local.message)}</div>`;
        } else status = `<div class="gm-status is-wait"><span class="gm-dot"></span>Tekshirilmoqda…</div>`;
      }
      if (s.unplanted <= 0) canPlant = false;
      el.innerHTML = `${top}${status}${speciesRow()}
        <div class="gm-actions"><button type="button" class="gm-btn is-green" data-gm="confirm" ${canPlant && !busy ? "" : "disabled"}>🌱 Shu yerga ekish</button>
          <button type="button" class="gm-btn is-quiet" data-gm="cancel">Xarita</button></div>`;
    } else if (mode === "zone") {
      el.innerHTML = `<input class="gm-input" id="gmZoneName" maxlength="60" placeholder="Hudud nomi (masalan: Navoiy bog'i)">
        <div class="gm-actions"><button type="button" class="gm-btn is-quiet" data-gm="zone-undo" ${draw && draw.pts.length ? "" : "disabled"}>↶</button>
          <button type="button" class="gm-btn is-green" data-gm="zone-save" ${draw && draw.pts.length >= 3 ? "" : "disabled"}>Saqlash</button>
          <button type="button" class="gm-btn is-quiet" data-gm="cancel">Bekor</button></div>`;
    } else {
      // Xarita: only how many cities of Andijan are left, the student's city and (when no Pomodoro runs) a way to start one
      const r = G.region || { left: 16, home: "Asaka" };
      const idle = pomodoroIdle();
      const actions = (idle ? `<button type="button" class="gm-btn" data-gm="tomato">🍅 Pomidor boshlash</button>` : "") +
        (G.isAdmin ? `<button type="button" class="gm-btn is-quiet" data-gm="zone">➕ Hudud</button>` : "");
      el.innerHTML = `
        <div class="gm-region"><div class="gm-reg"><b>${r.left}</b><span>Andijondagi shaharlar</span></div>
          <div class="gm-reg is-home"><b>${esc(r.home)}</b><span>Sizning shahringiz</span></div></div>
        ${actions ? `<div class="gm-actions">${actions}</div>` : ""}`;
    }
    // the panel changes height between the modes, so the map has to learn its new size
    requestAnimationFrame(() => { if (M.ready) M.map.invalidateSize({ pan: false }); });
  }

  // ------------------------------------------------------------------ planting
  function onMapClick(ll) {
    if (!openFlag) return;
    if (mode === "plant") setCandidate(ll.lat, ll.lng, true);
    else if (mode === "zone" && draw) {
      draw.pts.push([Math.round(ll.lat * 1e7) / 1e7, Math.round(ll.lng * 1e7) / 1e7]);
      drawZonePreview(); paintPanel();
    }
  }

  function setCandidate(lat, lon, check) {
    lat = Math.round(lat * 1e7) / 1e7; lon = Math.round(lon * 1e7) / 1e7;
    const near = nearestTree(lat, lon);
    const local = {};
    const ground = groundVerdict(lat, lon);
    if (ground !== "ok") local.message = REASONS[ground];
    else if (near.d !== null && near.d < G.minDistance) local.message = `Bu joy oldingi daraxtdan atigi ${fmtM(near.d)} metr uzoqlikda. Daraxtlar orasida kamida ${G.minDistance} metr bo'lishi kerak. Biroz uzoqroq joyni tanlang.`;
    const first = !cand;
    cand = { lat, lon, verdict: null, local, near };
    M.showGhost(cand);
    // the first tap zooms in, so the 2 m circle is big enough to place the tree exactly
    if (first && check && M.ready && M.map.getZoom() < 18.5) M.map.flyTo([lat, lon], 19, { duration: 0.6 });
    M.paintGhost(local.message ? false : null, near);
    paintPanel();
    if (check) {
      clearTimeout(checkTimer);
      const seq = ++checkSeq;
      checkTimer = setTimeout(async () => {
        const r = await api("/api/green/check", "POST", { lat, lon });
        if (seq !== checkSeq || !cand) return;
        if (r.ok) { cand.verdict = r.data; M.paintGhost(r.data.ok, near); }
        else if (r.data && r.data.message) { cand.verdict = { ok: false, message: r.data.message, distance: null }; M.paintGhost(false, near); }
        paintPanel();
      }, 180);
    }
  }

  // Planting starts close up (street level, not the whole district): on the open place, else (every place is full) at
  // the student's latest tree, else in the middle of Asaka town.
  const ASAKA = [40.6417, 72.2383];
  const openZone = () => (zonesData && G.places.open != null && zonesData.green[G.places.open]) || null;
  function plantSpot() {
    const z = openZone();
    if (z) return [(z.b[0] + z.b[2]) / 2, (z.b[1] + z.b[3]) / 2];
    const mine = [...G.trees.values()].filter((t) => t.ownerId === G.meId && t.state === "planted").sort((a, b) => (b.at || 0) - (a.at || 0))[0];
    return mine ? [mine.lat, mine.lon] : ASAKA;
  }
  function showOpenPlace() {
    if (!M.ready) return;
    const z = openZone();
    if (z) M.map.flyToBounds([[z.b[0], z.b[1]], [z.b[2], z.b[3]]], { padding: [40, 40], maxZoom: 19, duration: 0.8 });
    else if (M.map.getZoom() < 16) M.map.flyTo(plantSpot(), 17, { duration: 0.8 });
  }
  // Ekish always opens, also with no tree to plant: the student still sees today's trees, the wilted ones and the ranking.
  function enterPlant() {
    mode = "plant"; cand = null; M.clearGhost(); M.refreshTrees(); markZones(true); M.styleZones(); paintPanel();
    if (M.ready) {
      M.map.setMinZoom(15); // no zooming out to the whole district while planting
      showOpenPlace();
    }
  }
  function leaveMode() {
    mode = "browse"; cand = null; draw = null; checkSeq++; clearTimeout(checkTimer);
    if (M.ready) { M.clearGhost(); M.drawLayer.clearLayers(); M.map.setMinZoom(11); }
    markZones(false); paintPanel(); if (M.ready) { M.refreshTrees(); M.styleZones(); }
  }
  function markZones(on) { if (root) root.classList.toggle("is-planting", !!on); }

  async function confirmPlant() {
    if (busy || !cand || !cand.verdict || !cand.verdict.ok) return;
    busy = true; paintPanel();
    const r = await api("/api/green/plant", "POST", { lat: cand.lat, lon: cand.lon, kind: chosenKind() });
    busy = false;
    if (!r.ok) {
      const msg = (r.data && r.data.message) || "Daraxt ekilmadi. Internetni tekshiring.";
      if (cand) cand.verdict = { ok: false, message: msg, distance: r.data && r.data.distance };
      if (r.status === 409 && r.data && r.data.code) await loadCity(false);
      paintPanel();
      return;
    }
    const t = r.data.tree;
    G.trees.set(t.id, t); M.newId = t.id;
    Object.assign(G.sum, { unplanted: r.data.unplanted, planted: r.data.planted, wilted: r.data.wilted, finished: r.data.finished, kinds: r.data.kinds, points: r.data.points, cityTrees: G.sum.cityTrees + 1 });
    if (window.L1_Focus) { window.L1_Focus.setCity(G.sum.cityTrees); window.L1_Focus.setCounts({ unplanted: r.data.unplanted, planted: r.data.planted, wilted: r.data.wilted, finished: r.data.finished }); }
    plantSound(); haptic("ok");
    const lat = t.lat, lon = t.lon;
    // the student stays in Ekish for the next tree; the place it stands in counts it at once (the server's answer follows)
    cand = null; checkSeq++; M.clearGhost();
    const at = zonesData ? zonesData.green.findIndex((z) => inShape(lat, lon, z)) : -1;
    if (at >= 0) G.places.counts[String(at)] = (G.places.counts[String(at)] || 0) + 1;
    M.refreshTrees(); M.styleZones(); paintPanel();
    sparkle(lat, lon);
    setTimeout(() => { M.newId = 0; M.refreshTrees(); }, 3200);
    toast("Daraxt ekildi 🌳");
    loadCity(false).then(() => { M.styleZones(); paintPanel(); });
    if (flowPlant) { flowPlant = false; setTimeout(() => { close(); if (window.L1_Flow) window.L1_Flow.rest(); }, 2200); } // back to the break, which runs since the 25 minutes ended
  }

  function sparkle(lat, lon) {
    if (!M.ready) return;
    const icon = M.Lf.divIcon({ className: "gm-burst", html: `<i>✦</i><i>✦</i><i>✦</i><i>✦</i><i>✦</i><i>✦</i>`, iconSize: [10, 10] });
    const m = M.Lf.marker([lat, lon], { pane: "gmFx", icon, interactive: false, keyboard: false }).addTo(M.fxLayer);
    setTimeout(() => M.fxLayer.removeLayer(m), 1800);
  }

  async function restoreTree(id) {
    if (busy) return;
    busy = true;
    const r = await api("/api/green/restore", "POST", { id });
    busy = false;
    if (!r.ok) { toast((r.data && r.data.message) || "Tiklab bo'lmadi."); return; }
    const t = r.data.tree;
    G.trees.set(t.id, t);
    Object.assign(G.sum, { unplanted: r.data.unplanted, planted: r.data.planted, wilted: r.data.wilted, finished: r.data.finished,
      cityTrees: G.sum.cityTrees + 1, cityWilted: Math.max(0, G.sum.cityWilted - 1) });
    if (window.L1_Focus) { window.L1_Focus.setCity(G.sum.cityTrees); window.L1_Focus.setCounts({ unplanted: r.data.unplanted, planted: r.data.planted, wilted: r.data.wilted, finished: r.data.finished }); }
    reviveSound(); haptic("ok");
    if (M.ready) { M.map.closePopup(); M.newId = t.id; M.refreshTrees(); sparkle(t.lat, t.lon); setTimeout(() => { M.newId = 0; M.refreshTrees(); }, 3000); }
    toast("Daraxt tiklandi 🌱");
    paintPanel(); if (!$("gmModal").hidden) renderModal(modalKind);
    loadCity(false).then(() => paintPanel());
  }

  async function buyKind(kind) {
    if (busy) return;
    busy = true;
    const r = await api("/api/green/buy", "POST", { kind });
    busy = false;
    if (!r.ok) { toast((r.data && r.data.message) || "Sotib olib bo'lmadi. Internetni tekshiring."); return; }
    Object.assign(G.sum, { kinds: r.data.kinds, points: r.data.points });
    chooseKind(kind); reviveSound(); haptic("ok");
    closeModal(); if (cand) M.showGhost(cand);
    toast(`${Art().name(kind)} sotib olindi 🌳`);
    paintPanel();
  }

  // ------------------------------------------------------------------ admin: draw an area
  function drawZonePreview() {
    if (!M.ready || !draw) return;
    M.drawLayer.clearLayers();
    const Lf = M.Lf;
    if (draw.pts.length >= 3) Lf.polygon(draw.pts, { pane: "gmFx", color: "#1f9d55", weight: 2, dashArray: "6 5", fillColor: "#34c971", fillOpacity: 0.3, interactive: false }).addTo(M.drawLayer);
    else if (draw.pts.length === 2) Lf.polyline(draw.pts, { pane: "gmFx", color: "#1f9d55", weight: 2, interactive: false }).addTo(M.drawLayer);
    draw.pts.forEach((p) => Lf.circleMarker(p, { pane: "gmFx", radius: 5, color: "#fff", weight: 2, fillColor: "#1f9d55", fillOpacity: 1, interactive: false }).addTo(M.drawLayer));
  }
  async function saveZone() {
    if (!draw || draw.pts.length < 3 || busy) return;
    busy = true;
    const name = ($("gmZoneName") && $("gmZoneName").value.trim()) || "Yangi hudud";
    const r = await api("/api/green/zones", "POST", { name, polygon: draw.pts });
    busy = false;
    if (!r.ok) { toast((r.data && r.data.message) || "Saqlab bo'lmadi."); return; }
    G.zones.push(r.data.zone);
    leaveMode(); M.drawCustom(); toast("Hudud qo'shildi");
  }
  async function deleteZone(id) {
    const r = await api("/api/green/zones/delete", "POST", { id });
    if (!r.ok) { toast("O'chirib bo'lmadi."); return; }
    G.zones = G.zones.filter((z) => String(z.id) !== String(id));
    M.map.closePopup(); M.drawCustom(); toast("Hudud o'chirildi");
  }

  // ------------------------------------------------------------------ sheets (board, my trees)
  let modalKind = "";
  function renderModal(kind) {
    modalKind = kind;
    const el = $("gmModal");
    el.hidden = false;
    let body = "";
    if (kind === "board") {
      const rows = (G.boardMode === "week" ? G.week : G.all).map((e, i) => {
        const av = L1() && L1().avatar ? L1().avatar(e, 32) : "";
        return `<button type="button" class="gm-row${e.id === G.meId ? " is-me" : ""}" data-gm="owner" data-id="${esc(e.id)}"><span class="gm-rank">${i + 1}</span><span class="gm-avw">${av}</span>
          <span class="gm-rowname">${esc(e.name)}</span><span class="gm-rowval">🌳 ${e.trees}${e.wilted ? ` <i>🥀 ${e.wilted}</i>` : ""}</span></button>`;
      }).join("") || `<div class="gm-empty">Hali hech kim daraxt ekmagan. Birinchi bo'ling!</div>`;
      body = `<div class="gm-sheet-head"><h2>Kimda nechta daraxt</h2><span class="gm-seg"><button type="button" data-gm="board-week" class="${G.boardMode === "week" ? "is-on" : ""}">Hafta</button><button type="button" data-gm="board-all" class="${G.boardMode === "all" ? "is-on" : ""}">Hammasi</button></span></div>
        <div class="gm-rows">${rows}</div>`;
    } else if (kind.startsWith("buy:")) {
      const k = kind.slice(4), price = G.prices[k] || 0, enough = G.sum.points >= price;
      body = `<div class="gm-buy"><div class="gm-buy-art">${Art().svg(k, 3, false)}</div><h2>${esc(Art().name(k))}</h2>
        <p>Narxi: <b>⭐ ${price} ball</b> (bir marta olasiz, keyin xohlagancha ekasiz).</p>
        <p class="${enough ? "" : "gm-buy-bad"}">Sizda: <b>⭐ ${G.sum.points} ball</b>${enough ? "" : `. Yana ${price - G.sum.points} ball kerak. O'yin, uyga vazifa va darslardan ball to'plang.`}</p>
        <button type="button" class="gm-btn is-green" data-gm="buy" data-kind="${k}" ${enough && !busy ? "" : "disabled"}>Sotib olish</button></div>`;
    } else {
      // wilted trees first: those are the ones that need a pomodoro
      const mine = [...G.trees.values()].filter((t) => t.ownerId === G.meId)
        .sort((a, b) => (b.state === "wilted") - (a.state === "wilted") || (b.at || 0) - (a.at || 0));
      const rows = mine.map((t) => {
        const wilted = t.state === "wilted";
        return `<div class="gm-row is-tree"><button type="button" class="gm-tree-go" data-gm="goto" data-id="${t.id}"><span class="gm-row-art">${Art().svg(t.kind || "oak", 3, wilted)}</span>
          <span class="gm-rowname">${esc(Art().name(t.kind))}<small>${wilted ? "So'lgan 🥀" : ago(t.at)}</small></span></button>
          ${wilted ? `<button type="button" class="gm-pop-btn" data-gm="restore" data-id="${t.id}" ${G.sum.unplanted > 0 ? "" : "disabled"}>Tiklash: 1 pomidor</button>` : ""}</div>`;
      }).join("") || `<div class="gm-empty">Siz hali daraxt ekmagansiz.</div>`;
      body = `<div class="gm-sheet-head"><h2>Mening daraxtlarim</h2><span class="gm-chip">${G.sum.planted} ta${G.sum.wilted ? ` · ${G.sum.wilted} so'lgan` : ""}</span></div>
        <div class="gm-rows">${rows}</div>`;
    }
    el.innerHTML = `<div class="gm-modal-back" data-gm="modal-close"></div><section class="gm-sheet"><button type="button" class="gm-x" data-gm="modal-close" aria-label="Yopish">✕</button>${body}</section>`;
  }
  const closeModal = () => { const el = $("gmModal"); if (el) { el.hidden = true; el.innerHTML = ""; } };

  // ------------------------------------------------------------------ events
  function onClick(ev) {
    const b = ev.target.closest("[data-gm]");
    if (!b) return;
    const act = b.dataset.gm;
    haptic("tap");
    if (act === "back") { if (mode !== "browse") return leaveMode(); return close(); }
    if (act === "board") { renderModal("board"); return; }
    if (act === "mine") { renderModal("mine"); return; }
    if (act === "board-week" || act === "board-all") { G.boardMode = act === "board-week" ? "week" : "all"; return renderModal("board"); }
    if (act === "modal-close") return closeModal();
    if (act === "plant") return enterPlant();
    if (act === "tomato") { close(); if (window.L1_Focus) window.L1_Focus.open(); return; }
    if (act === "cancel") return leaveMode();
    if (act === "confirm") return confirmPlant();
    if (act === "kind") { chooseKind(b.dataset.kind); if (cand) M.showGhost(cand); return paintPanel(); }
    if (act === "shop") return renderModal("buy:" + b.dataset.kind);
    if (act === "buy") return buyKind(b.dataset.kind);
    if (act === "restore") return restoreTree(parseInt(b.dataset.id, 10));
    if (act === "goto") { const t = G.trees.get(parseInt(b.dataset.id, 10)); closeModal(); if (t) M.flyTo(t.lat, t.lon, 18); return; }
    if (act === "owner") { const list = [...G.trees.values()].filter((t) => t.ownerId === b.dataset.id); closeModal(); M.fitTrees(list); return; }
    if (act === "locate") return locate();
    if (act === "zone") { mode = "zone"; draw = { pts: [] }; markZones(true); return paintPanel(); }
    if (act === "zone-undo") { if (draw) { draw.pts.pop(); drawZonePreview(); paintPanel(); } return; }
    if (act === "zone-save") return saveZone();
    if (act === "zone-del") return deleteZone(b.dataset.id);
  }

  function locate() {
    if (!navigator.geolocation) return toast("Joylashuvni aniqlab bo'lmadi.");
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude: lat, longitude: lon } = p.coords;
      if (lat < BBOX[0] || lat > BBOX[2] || lon < BBOX[1] || lon > BBOX[3]) return toast("Siz Asaka tumanidan tashqaridasiz.");
      M.flyTo(lat, lon, 17);
    }, () => toast("Joylashuvni aniqlab bo'lmadi."), { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 });
  }

  // ------------------------------------------------------------------ open / close
  async function open(opts) {
    if (!(window.l1GetToken && window.l1GetToken())) return;
    ensureRoot();
    openFlag = true; flowPlant = !!(opts && opts.flow); root.hidden = false; document.body.classList.add("gm-open");
    mode = "browse"; paintPanel();
    const host = $("gmMap");
    const [Lf] = await Promise.all([loadLeaflet().catch(() => null), loadZones(), loadCity(true)]);
    if (!openFlag) return;
    if (!Lf) { $("gmLoading").textContent = "Xaritani yuklab bo'lmadi. Internetni tekshiring."; return; }
    if (!M.ready) await M.build(host);
    M.map.invalidateSize();
    $("gmLoading").hidden = true;
    M.drawZones(); M.refreshTrees();
    const mine = [...G.trees.values()].filter((t) => t.ownerId === G.meId && t.state === "planted").sort((a, b) => (b.at || 0) - (a.at || 0))[0];
    if (opts && opts.plant) M.map.setView(plantSpot(), 17);
    else if (mine) M.map.setView([mine.lat, mine.lon], 17);
    else if (M.boundsAll) M.map.fitBounds(M.boundsAll, { padding: [30, 30], maxZoom: 15 });
    paintPanel();
    if (opts && opts.plant) enterPlant();
    clearInterval(poll);
    poll = setInterval(async () => {
      if (document.hidden || !openFlag) return;
      if (await loadCity(false)) { if (M.ready) { if (!cand) M.refreshTrees(); M.styleZones(); } paintPanel(); }
    }, 20000);
  }
  // Xarita shows "Pomidor boshlash" only while no Pomodoro runs
  window.addEventListener("l1:focus-summary", () => { if (openFlag && mode === "browse") paintPanel(); });
  function close() {
    openFlag = false; flowPlant = false; clearInterval(poll);
    if (mode !== "browse") leaveMode();
    closeModal();
    if (root) root.hidden = true;
    document.body.classList.remove("gm-open");
  }

  window.L1_Green = {
    open, close, refresh: () => loadCity(false).then((ok) => { if (ok && openFlag) { if (M.ready) { M.refreshTrees(); M.styleZones(); } paintPanel(); } return ok; }),
    summary: () => Object.assign({}, G.sum),
  };
})();
