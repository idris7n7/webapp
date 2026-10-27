/* Daryodan o'tish — Jigar! (L1_Arcade game "river"): bring the things you are asked for across the river by boat.
 *
 * An Uzbek instruction ("Onangiz bugun osh damlamoqchi ekan. Kerakli narsalarni oling, jigar!") and a list of what is
 * needed, in Uzbek. The market on the left bank shows pictures with their English names (at B1+ the English name only).
 * Tapping a needed thing puts it in the boat and shows its English word, pronunciation and an example; tapping a thing
 * that is not on the list marks it "not needed" (a small penalty). The boat holds three; "Suzish" rows it to the home
 * bank, where the things are counted, and back again. 20 things per session (several errands).
 * The scene is real-time 3D (three.js via L1_3D): the market stall on the left bank, the river flowing towards the
 * student, the house on the right bank and a rowing boat with the student's hero (picked on the start page) at the oars.
 * Picked things fly from the stall into the boat as picture tokens and hop out at the house door. On a portrait phone the
 * camera follows the boat; a wide screen shows both banks. The market list stays HTML, so the game also works without
 * WebGL (the scene is then a plain picture of sky and river).
 */
(function (window, document) {
  "use strict";
  const A = window.L1_Arcade;
  if (!A) return;
  const esc = A.esc;
  const ITEMS = 20, BOAT = 3;
  const RULES = { right: 10, wrong: 5 }; // the server pays by the same numbers (server.py ARCADE_POINTS)
  const DOCK = 3; // the boat's centre at the two banks (x); the river runs along z between x = -6 and 6
  const SPAN = 12.5; // half the width worth seeing, stall to house
  const TRIP = 2, UNLOAD = 1.3, END = 1.5; // seconds: across the river, at the house door, before the results
  const HULL = 0.62, ROWER_X = 0.3, OAR_X = 0.8;
  const SLOTS = [[-0.5, -0.1], [-1.0, 0.14], [-1.45, -0.08]]; // cargo places behind the rower (boat x, z; the bow is +x)
  const RIMS = ["#ff8a3d", "#3aa0ff", "#2fbf71"];
  const LEAF = ["#73b64d", "#5fa43f", "#86c45a"];

  const G = {
    open(root) {
      this.root = root;
      Object.assign(this, { phase: "start", paused: false, busy: false, wrong: 0, got: [], boat: [], raf: 0, t: 0, trip: null, cargo: [],
        boatX: -DOCK, yaw: 0, rowT: 0, doorK: 0, camX: null, st: null });
      root.innerHTML = `<div class="rv">
        <div class="rv-scene" data-stage><div class="rv-bubble" data-bubble hidden></div></div>
        <div class="rv-panel"><div class="rv-task"><p data-task></p><div class="rv-list" data-list></div></div></div>
        <div class="rv-market"><h3><span data-market-title>Bozor — chap qirg'oq</span><button type="button" class="ac-btn is-primary is-small" data-ac="sail" disabled>Suzish ⛵</button></h3>
          <div class="rv-items" data-items></div></div>
      </div>
      <div class="ac-hud"><span class="ac-pill is-title">Jigar!</span><span class="ac-pill" data-hud="n">0/${ITEMS}</span>
        <span class="ac-pill" data-hud="score">0 ball</span><span class="ac-hud-fill"></span>${A.hudButtons()}</div>
      <div class="ac-banner" data-banner></div>`;
      this.stageEl = root.querySelector("[data-stage]");
      root.querySelector(".ac-hud").addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "mute") A.toggleMute(b);
        if (b.dataset.ac === "pause") this.pause();
      });
      root.querySelector(".rv").addEventListener("click", (ev) => this.click(ev));
      this.onKey = (ev) => { if (ev.key === "Escape" && this.root) this.pause(); };
      window.addEventListener("keydown", this.onKey);
      const three = A.need3D().then(() => true, () => false);
      A.loadWithUi(root, "Daryodan o'tish", window.ARCADE_DATA.vocab.filter((w) => w.pic.startsWith("t:")).map((w) => A.picPath(w)))
        .then(() => three).then((ok) => {
          if (!this.root) return;
          if (ok && window.L1_3D.supported()) {
            try { this.build(); } catch (e) { console.error(e); this.drop3D(); }
          }
          this.last = performance.now();
          this.raf = requestAnimationFrame((t) => this.loop(t));
          this.startScreen();
        });
    },
    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener("keydown", this.onKey);
      this.drop3D();
      this.root = null;
    },
    drop3D() {
      if (this.st) { try { this.st.dispose(); } catch (e) { /* gone */ } }
      this.st = null;
      this.cargo = [];
    },
    onBack() {
      if (this.phase === "play" && !this.paused) { this.pause(); return true; }
      return false;
    },
    $(sel) { return this.root.querySelector(sel); },

    // ---------------------------------------------------------------- the river, the banks, the boat
    build() {
      const D = window.L1_3D, THREE = window.THREE;
      this.D = D; this.THREE = THREE;
      const st = this.st = D.stage(this.stageEl, { fov: 40, far: 170, maxDpr: 1.6, envIntensity: 0.5 });
      D.curve.value = 0;
      D.sky(st.scene, "#5fb4f2", "#dff2ff", { radius: 150 });
      st.scene.fog = new THREE.Fog("#dff2ff", 45, 145);
      st.scene.add(new THREE.HemisphereLight("#d4ecff", "#b9d79a", 1.1));
      const sun = new THREE.DirectionalLight("#fff0d2", 2.4);
      sun.position.set(-8, 14, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12, near: 1, far: 50 });
      sun.shadow.bias = -0.0008;
      st.scene.add(sun);
      this.v = new THREE.Vector3();
      this.texCache = {};
      this.buildLand();
      this.buildWater();
      this.buildStall();
      this.buildHouse();
      this.buildBoat();
      this.sparks = D.Sparks(st.scene, 200, false);
      this.layout();
    },
    // banks, beaches, jetties, poplars and fruit trees, far hills and mountains: one mesh; clouds and the sun: another
    buildLand() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const rnd = (a, b) => a + Math.random() * (b - a);
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const parts = [];
      const tree = (x, z, s) => {
        parts.push(P(S("cyl"), "#7a5233", [x, 0.45 + s, z], null, [0.3 * s, 2 * s, 0.3 * s]));
        parts.push(P(S("lowsphere"), pick(LEAF), [x, 0.45 + 2.6 * s, z], null, [2.2 * s, 1.9 * s, 2.2 * s]));
        parts.push(P(S("lowsphere"), pick(LEAF), [x - 0.5 * s, 0.45 + 2.2 * s, z + 0.4 * s], null, [1.4 * s, 1.2 * s, 1.4 * s]));
        parts.push(P(S("lowsphere"), pick(LEAF), [x + 0.45 * s, 0.45 + 3.1 * s, z - 0.3 * s], null, [1.3 * s, 1.2 * s, 1.3 * s]));
      };
      const poplar = (x, z, s) => {
        parts.push(P(S("cyl"), "#7a5233", [x, 0.45 + 0.5 * s, z], null, [0.18 * s, s, 0.18 * s]));
        parts.push(P(S("lowsphere"), pick(LEAF), [x, 0.45 + 2.6 * s, z], null, [0.95 * s, 4.2 * s, 0.95 * s]));
      };
      const bush = (x, z, s) => parts.push(P(S("lowsphere"), pick(["#6aa84a", "#5b9a40", "#7bbd55"]), [x, 0.45 + 0.3 * s, z], null, [1.1 * s, 0.8 * s, 1.1 * s]));
      const flowers = (x, z, n) => { for (let k = 0; k < n; k++) parts.push(P(S("sphere"), pick(["#ff6f91", "#ff9ec7", "#ffd166", "#ffffff"]), [x + rnd(-0.8, 0.8), 0.6, z + rnd(-0.5, 0.5)], null, [0.2, 0.2, 0.2])); };
      [-1, 1].forEach((side) => {
        parts.push(P(S("box"), "#8fcf68", [side * 21, -1.05, -23], null, [30, 3, 80])); // the bank, its top at y = 0.45
        parts.push(P(S("prism"), "#e8c98d", [side * 6, -0.2, -23], null, [2.6, 0.65, 80])); // the beach sloping into the water
        // the jetty: a plank deck on posts, a mooring post at its end
        const px = side * 5.6;
        parts.push(P(S("box"), "#b07a45", [px, 0.5, -1.4], null, [2.4, 0.12, 1.3]));
        for (let k = 1; k < 6; k++) parts.push(P(S("box"), "#8f5d2c", [px - 1.2 + k * 0.4, 0.562, -1.4], null, [0.03, 0.01, 1.3]));
        [[-1.1, -0.85], [-1.1, -1.95], [1.1, -0.85], [1.1, -1.95]].forEach(([dx, z]) => parts.push(P(S("cyl"), "#6b4320", [px + dx, 0.15, z], null, [0.16, 0.9, 0.16])));
        parts.push(P(S("cyl"), "#6b4320", [px - side * 1.1, 0.75, -0.85], null, [0.18, 0.5, 0.18]));
        parts.push(P(S("box"), "#e8d5b5", [side * 7.75, 0.46, -1.15], [0, side * 0.08, 0], [2.3, 0.03, 0.9])); // a path up the bank
        // reeds at the water's edge, a few lily pads
        for (let k = 0; k < 9; k++) {
          const z = k < 5 ? rnd(-14, -3.2) : rnd(1.6, 9);
          for (let r = 0; r < 4; r++) parts.push(P(S("cone"), pick(["#5e9f3c", "#74b34a", "#4f8a34"]), [side * rnd(4.9, 5.3), 0.3, z + rnd(-0.25, 0.25)], [rnd(-0.15, 0.15), 0, rnd(-0.15, 0.15)], [0.07, rnd(0.8, 1.2), 0.07]));
        }
        for (let k = 0; k < 4; k++) parts.push(P(S("cyl"), "#4f9a3a", [side * rnd(4, 4.6), 0.03, rnd(-16, -4)], null, [0.6, 0.02, 0.6]));
        // poplars along both banks into the distance, fruit trees and bushes near the camera
        for (let k = 0; k < 10; k++) poplar(side * rnd(8, 10.5), -9 - k * 4.4 + rnd(-1, 1), rnd(0.9, 1.15));
        for (let k = 0; k < 6; k++) poplar(side * rnd(14, 22), -6 - k * 6 + rnd(-2, 2), rnd(0.9, 1.2));
        tree(side * 13.5, -6.5, 1.1); tree(side * 16.5, -1.5, 1.2); tree(side * 7.4, -7.5, 0.8);
        tree(side * 12.5, 4.5, 1); tree(side * 18, 6, 1.15);
        for (let k = 0; k < 5; k++) bush(side * rnd(6.8, 13), rnd(2, 7.5), rnd(0.8, 1.3));
        flowers(side * 7.6, 3.5, 6); flowers(side * 11, 1.8, 6);
      });
      // the far end: green hills, blue mountains with snow
      for (let k = 0; k < 9; k++) parts.push(P(S("lowsphere"), pick(["#7fbf5e", "#8fcf68", "#6fae52"]), [-44 + k * 11 + rnd(-2, 2), -1, -62 + rnd(-3, 3)], null, [rnd(18, 24), rnd(9, 13), 12]));
      for (let k = 0; k < 6; k++) {
        const x = -60 + k * 24 + rnd(-6, 6), h = rnd(22, 32), z = -112 + rnd(-6, 6);
        parts.push(P(S("cone"), "#8aa7c8", [x, h / 2 - 2, z], null, [rnd(30, 40), h, 14]));
        parts.push(P(S("cone"), "#f4f8ff", [x, h - 2 - h * 0.11, z + 0.6], null, [9, h * 0.22, 4.4]));
      }
      const land = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.9 }));
      land.receiveShadow = true;
      land.castShadow = true;
      this.st.scene.add(land);
      const sky = [];
      for (let i = 0; i < 8; i++) {
        const cx = -70 + i * 20 + rnd(-6, 6), cy = rnd(16, 26), cz = rnd(-125, -105);
        for (let k = 0; k < 4; k++) sky.push(P(S("sphere"), "#ffffff", [cx + k * 4 - 6, cy + rnd(0, 1.5), cz], null, [rnd(7, 10), rnd(4, 6), 4]));
      }
      sky.push(P(S("sphere"), "#ffe27a", [40, 34, -118], null, [9, 9, 2]));
      this.st.scene.add(new THREE.Mesh(D.merge(sky), new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })));
    },
    // the river: ripples drawn on a canvas, flowing towards the student (the texture slides along z)
    buildWater() {
      const THREE = this.THREE, D = this.D;
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d");
      g.fillStyle = "#3f9fdc"; g.fillRect(0, 0, 256, 256);
      const tiled = (fn) => { for (let dx = -256; dx <= 256; dx += 256) for (let dy = -256; dy <= 256; dy += 256) fn(dx, dy); }; // seamless
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, rx = 20 + Math.random() * 30;
        g.fillStyle = "rgba(24,104,176,.22)";
        tiled((dx, dy) => { g.beginPath(); g.ellipse(x + dx, y + dy, rx, rx * 0.5, 0, 0, Math.PI * 2); g.fill(); });
      }
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, w = 12 + Math.random() * 30;
        g.strokeStyle = `rgba(222,245,255,${0.3 + Math.random() * 0.4})`;
        g.lineWidth = 2 + Math.random() * 2;
        g.lineCap = "round";
        tiled((dx, dy) => { g.beginPath(); g.moveTo(x + dx - w / 2, y + dy); g.quadraticCurveTo(x + dx, y + dy - 5, x + dx + w / 2, y + dy); g.stroke(); });
      }
      const tex = this.waterTex = D.pictureTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 11);
      const geo = new THREE.PlaneGeometry(14, 80);
      geo.rotateX(-Math.PI / 2);
      const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.05 }));
      water.position.set(0, 0.02, -23);
      water.receiveShadow = true;
      this.st.scene.add(water);
    },
    // the market stall: striped awning, a counter with baskets of fruit and vegetables, sacks, the BOZOR sign
    buildStall() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const parts = [];
      [[-1.55, 0.75, 2.45], [1.55, 0.75, 2.45], [-1.55, -0.75, 2.95], [1.55, -0.75, 2.95]].forEach(([x, z, h]) => parts.push(P(S("cyl"), "#8a5a2b", [x, h / 2, z], null, [0.14, h, 0.14])));
      parts.push(P(S("box"), "#c98544", [0, 0.5, 0.05], null, [3.1, 0.9, 0.85]));
      parts.push(P(S("box"), "#9c6630", [0, 0.5, 0.5], null, [3.2, 0.95, 0.08]));
      for (let k = 0; k < 3; k++) parts.push(P(S("box"), "#87552a", [0, 0.2 + k * 0.3, 0.545], null, [3.2, 0.03, 0.02]));
      parts.push(P(S("box"), "#b7793a", [0, 1.0, 0.25], null, [3.4, 0.12, 1.15]));
      const N = 8, aw = 3.8 / N;
      for (let k = 0; k < N; k++) {
        const col = k % 2 ? "#fff6e6" : "#ff8a3d", x = -1.9 + aw * (k + 0.5);
        parts.push(P(S("box"), col, [x, 2.72, 0.05], [0.32, 0, 0], [aw + 0.005, 0.06, 2.2]));
        parts.push(P(S("sphere"), col, [x, 2.3, 1.1], null, [aw, 0.3, 0.06]));
      }
      // baskets: apples, oranges, melons; carrots; jars on the back shelf
      const basket = (x, col, r) => {
        parts.push(P(S("cyl"), "#d9a35a", [x, 1.12, 0.3], null, [0.85, 0.14, 0.62]));
        [[-0.2, 0.18], [0.2, 0.18], [0, 0.4], [-0.15, 0.42], [0.18, 0.4], [0, 0.22]].forEach(([dx, dz], k) => parts.push(P(S("sphere"), col, [x + dx, 1.22 + r + (k > 2 ? r : 0) * 0.8, dz], null, [r * 2, r * 2, r * 2])));
      };
      basket(-1.05, "#ff5a4e", 0.11); basket(0, "#ffa53a", 0.12);
      parts.push(P(S("sphere"), "#3f8f3a", [0.85, 1.32, 0.3], null, [0.42, 0.36, 0.42]));
      parts.push(P(S("sphere"), "#57a84a", [1.25, 1.28, 0.42], null, [0.34, 0.3, 0.34]));
      for (let k = 0; k < 4; k++) parts.push(P(S("cone"), "#ff7a1a", [1.15 + k * 0.08, 1.1, 0.75], [Math.PI / 2, 0, 0.2], [0.07, 0.36, 0.07]));
      parts.push(P(S("box"), "#9c6630", [0, 1.55, -0.62], null, [3.1, 0.06, 0.4]));
      ["#e5484d", "#ffd23f", "#7ac943", "#8b5cf6", "#ff8a3d", "#3aa0ff"].forEach((col, k) => parts.push(P(S("cyl"), col, [-1.2 + k * 0.48, 1.72, -0.62], null, [0.2, 0.28, 0.2])));
      [[-2.15, 0.6, "#efe0c4"], [-2.4, -0.2, "#e6d3ae"], [2.2, 0.6, "#efe0c4"]].forEach(([x, z, col]) => {
        parts.push(P(S("rbox"), col, [x, 0.35, z], null, [0.6, 0.7, 0.5]));
        parts.push(P(S("sphere"), col, [x, 0.75, z], null, [0.35, 0.2, 0.3]));
      });
      parts.push(P(S("box"), "#8a5a2b", [0, 3.3, 0.02], null, [1.9, 0.62, 0.08])); // the sign board
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.75 }));
      mesh.castShadow = true; mesh.receiveShadow = true;
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.76, 0.5), new THREE.MeshStandardMaterial({
        map: D.textTexture("BOZOR", { w: 512, h: 146, bg: "#fff6e6", color: "#7a3c0c", size: 104, round: 20 }), roughness: 0.8 }));
      sign.position.set(0, 3.3, 0.07);
      g.add(mesh, sign);
      g.position.set(-9.2, 0.45, -2.2);
      g.rotation.y = 0.35; // turned a little towards the river
      this.st.scene.add(g);
      this.stall = g;
    },
    // home: a cream house with a terracotta roof, its blue door opening when the boat brings the shopping
    buildHouse() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const parts = [];
      const W = 4.4, H = 3, Dp = 3.6, zf = Dp / 2;
      parts.push(P(S("box"), "#f3e2c2", [0, H / 2, 0], null, [W, H, Dp]));
      parts.push(P(S("box"), "#dcc193", [0, 0.2, 0], null, [W + 0.15, 0.4, Dp + 0.15]));
      parts.push(P(S("prism"), "#c4552b", [0, H, 0], [0, Math.PI / 2, 0], [Dp + 0.6, 1.9, W + 0.6]));
      parts.push(P(S("box"), "#b0522d", [1.3, H + 1.5, -0.5], null, [0.5, 1.4, 0.5]));
      [-1.45, 1.45].forEach((x) => {
        parts.push(P(S("box"), "#ffffff", [x, 1.75, zf + 0.03], null, [0.95, 0.95, 0.1]));
        parts.push(P(S("box"), "#3d5a7a", [x, 1.75, zf + 0.06], null, [0.75, 0.75, 0.06]));
        parts.push(P(S("box"), "#ffffff", [x, 1.75, zf + 0.1], null, [0.05, 0.75, 0.04]));
        parts.push(P(S("box"), "#ffffff", [x, 1.75, zf + 0.1], null, [0.75, 0.05, 0.04]));
        parts.push(P(S("box"), "#9c6630", [x, 1.2, zf + 0.2], null, [0.9, 0.16, 0.3]));
        for (let k = 0; k < 4; k++) parts.push(P(S("sphere"), ["#ff6f91", "#ffd166"][k % 2], [x - 0.33 + k * 0.22, 1.36, zf + 0.22], null, [0.2, 0.2, 0.2]));
      });
      parts.push(P(S("box"), "#ffffff", [0, 1.05, zf + 0.03], null, [1.15, 2.1, 0.1])); // the door frame
      parts.push(P(S("box"), "#2a2016", [0, 1.0, zf + 0.05], null, [0.92, 1.92, 0.06])); // the hall behind the door
      parts.push(P(S("box"), "#e4d3b4", [0, 0.08, zf + 0.45], null, [1.5, 0.16, 0.8])); // the step
      [-1, 1].forEach((side) => {
        for (let k = 0; k < 3; k++) parts.push(P(S("lowsphere"), "#6aa84a", [side * (1.25 + k * 0.6), 0.32, zf + 0.75], null, [0.75, 0.6, 0.6]));
        for (let k = 0; k < 6; k++) parts.push(P(S("box"), "#ffffff", [side * (1.2 + k * 0.38), 0.32, zf + 1.6], null, [0.08, 0.64, 0.06]));
        parts.push(P(S("box"), "#ffffff", [side * 2.15, 0.45, zf + 1.6], null, [2.0, 0.07, 0.05]));
      });
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.85 }));
      mesh.castShadow = true; mesh.receiveShadow = true;
      const door = new THREE.Group();
      door.position.set(-0.46, 0, zf + 0.09);
      door.add(new THREE.Mesh(D.merge([P(S("box"), "#2d5d8f", [0.46, 1.0, 0], null, [0.92, 1.92, 0.07]), P(S("sphere"), "#d8b04a", [0.8, 1.0, 0.06], null, [0.09, 0.09, 0.09])]),
        D.vcMaterial(false, { roughness: 0.45 })));
      g.add(mesh, door);
      g.position.set(9.5, 0.45, -3.2);
      g.rotation.y = -0.4;
      this.st.scene.add(g);
      this.house = g;
      this.door = door;
    },
    // a wooden rowing boat: a hollow hull (wall, floor, cream rim), two seats, oarlocks; two oars; the rower inside
    buildBoat() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const lens = (stern, hs, cx, cy, bow) => {
        const s = new THREE.Shape();
        s.moveTo(-stern, -hs); s.lineTo(-stern, hs); s.quadraticCurveTo(cx, cy, bow, 0); s.quadraticCurveTo(cx, -cy, -stern, -hs);
        return s;
      };
      // narrower at the keel than at the rim; flat faces, like a toy boat
      const taper = (geo) => {
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const k = Math.max(0, Math.min(1, p.getY(i) / HULL));
          p.setZ(i, p.getZ(i) * (0.66 + 0.34 * k));
          p.setX(i, p.getX(i) * (0.9 + 0.1 * k));
        }
        geo.computeVertexNormals();
        return geo;
      };
      const ring = (outer, inner, depth, y) => {
        outer.holes.push(inner);
        const geo = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 10 });
        geo.rotateX(-Math.PI / 2); // the extrusion goes up, the beam lies along z
        geo.translate(0, y, 0);
        return taper(geo);
      };
      const inner = () => lens(1.56, 0.4, 0.62, 0.66, 1.66);
      const floor = new THREE.ShapeGeometry(inner(), 10);
      floor.rotateX(-Math.PI / 2);
      floor.translate(0, 0.1, 0);
      const parts = [
        P(ring(lens(1.7, 0.48, 0.7, 0.78, 1.85), inner(), HULL, 0), "#a8652d"),
        P(ring(lens(1.76, 0.53, 0.72, 0.86, 1.93), inner(), 0.07, HULL - 0.035), "#f2e3c6"),
        P(taper(floor), "#7a4a22"),
        P(S("box"), "#c98544", [ROWER_X, 0.36, 0], null, [0.36, 0.06, 0.84]),
        P(S("box"), "#c98544", [-1.05, 0.36, 0], null, [0.3, 0.06, 0.7]),
      ];
      [-1, 1].forEach((side) => parts.push(P(S("cyl"), "#5a3416", [OAR_X, HULL + 0.04, side * 0.56], null, [0.06, 0.12, 0.06])));
      const hull = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.7 }));
      hull.position.y = -0.25; // the waterline a quarter up the hull
      hull.castShadow = true;
      const boat = this.boatG = new THREE.Group();
      boat.rotation.order = "YXZ"; // yaw first, then roll and pitch about the boat's own axes
      boat.add(hull);
      // an oar along +z from its oarlock: grip, shaft, blade
      const oarGeo = D.merge([
        P(S("cyl"), "#c98544", [0, 0, 0.62], [Math.PI / 2, 0, 0], [0.06, 2.4, 0.06]),
        P(S("cyl"), "#5a3416", [0, 0, -0.5], [Math.PI / 2, 0, 0], [0.075, 0.2, 0.075]),
        P(S("rbox"), "#f2e3c6", [0, 0, 1.68], null, [0.05, 0.26, 0.56]),
      ]);
      this.oars = [1, -1].map((side) => {
        const pivot = new THREE.Group(), tilt = new THREE.Group();
        pivot.position.set(OAR_X, HULL - 0.21, side * 0.58);
        const m = new THREE.Mesh(oarGeo, D.vcMaterial(false, { roughness: 0.7 }));
        m.castShadow = true;
        tilt.add(m); pivot.add(tilt); boat.add(pivot);
        return { side, pivot, tilt };
      });
      this.st.scene.add(boat);
      this.rower = this.makeRower(A.heroId());
    },
    makeRower(id) {
      const f = this.D.hero(id);
      f.root.position.set(ROWER_X, -0.28, 0); // sitting on the seat: the pelvis 0.5 above the root in the row pose
      this.boatG.add(f.root);
      return f;
    },
    // what the camera sees: both banks on a wide screen; on a portrait phone it stays closer and follows the boat
    layout() {
      const st = this.st;
      if (!st) return;
      st.resize();
      const cam = st.camera, tan = Math.tan((cam.fov * Math.PI) / 360);
      this.camDist = Math.max(10, Math.min(12.5, SPAN / (tan * cam.aspect)));
      this.halfW = this.camDist * tan * cam.aspect;
    },
    tokenTex(w) {
      if (!this.texCache[w.id]) this.texCache[w.id] = this.D.tokenTexture(A.picDrawable(w, 220));
      return this.texCache[w.id];
    },
    slotPos(i, v) {
      const s = SLOTS[i] || SLOTS[0];
      return this.boatG.localToWorld(v.set(s[0], 0.5, s[1]));
    },
    doorPos(v) { return this.house.localToWorld(v.set(0, 1.0, 2.1)); },
    // a picked thing flies from the stall into its place in the boat
    loadToken(id) {
      if (!this.st) return;
      const w = A.word(id);
      const obj = this.D.token({ radius: 0.36, depth: 0.1, tex: this.tokenTex(w), rim: RIMS[(this.boat.length - 1) % RIMS.length] });
      const from = this.stall.localToWorld(new this.THREE.Vector3(0, 1.6, 0.4));
      obj.root.position.copy(from);
      obj.root.scale.setScalar(0.6);
      this.st.scene.add(obj.root);
      this.cargo.push({ id, obj, state: "fly", k: 0, from, slot: this.boat.length - 1, sway: Math.random() * 6, delay: 0 });
    },
    // at the house: the things hop out one after another, through the open door
    hopOut() {
      this.cargo.forEach((c, i) => Object.assign(c, { state: "hop", k: 0, delay: i * 0.22, from: null }));
    },
    dropToken(c) {
      if (this.st) this.st.scene.remove(c.obj.root);
      c.obj.root.traverse((ob) => { if (ob.geometry) ob.geometry.dispose(); });
      c.obj.faceMat.dispose();
      c.obj.rimMat.dispose();
    },
    resetBoat() {
      this.trip = null;
      Object.assign(this, { boatX: -DOCK, yaw: 0, rowT: 0, doorK: 0, camX: null });
      this.cargo.forEach((c) => this.dropToken(c));
      this.cargo = [];
    },

    // ---------------------------------------------------------------- start: the errands of this session
    // another hero picked on the start page: the rower in the boat changes at once
    swapHero(id) {
      if (!this.st || !this.rower) return;
      const old = this.rower;
      this.rower = this.makeRower(id);
      this.boatG.remove(old.root);
      old.root.traverse((ob) => { if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose(); });
    },
    startScreen() {
      this.phase = "start";
      const saved = A.Ckpt.get("river");
      const ck = saved && Array.isArray(saved.got) ? saved : null;
      const el = A.overlay(this.root, `<div class="ac-start"><h2>Daryodan o'tish — Jigar!</h2>${A.heroPicker()}
        <ul class="ac-rules"><li>Topshiriqni o'qing: ro'yxatdagi narsalar kerak.</li>
          <li>Bozordan keraklilarini bosing — ular qayiqqa tushadi (bir safarda ${BOAT} ta). Ro'yxatda yo'q narsa — xato.</li>
          <li>«Suzish» tugmasi bilan daryodan o'tib, uyga olib boring. Jami ${ITEMS} ta narsa.</li></ul>
        <span class="ac-lvl-line">Daraja: <b>${A.levelName(A.level())}</b></span>
        <div class="ac-actions is-col">${ck ? A.btn(`Davom ettirish (${ck.got.length}/${ITEMS})`, 'data-ac="resume"', "is-primary") : ""}
          ${A.btn(ck ? "Yangi o'yin" : "Boshlash", 'data-ac="new"', ck ? "" : "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`, "is-menu");
      A.bindHeroPicker(el, (id) => this.swapHero(id));
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        el.remove();
        if (b.dataset.ac === "exit") A.close();
        else if (b.dataset.ac === "resume" && ck) this.begin(ck);
        else { A.Ckpt.clear("river"); this.begin(null); }
      });
    },
    // errands for the level until exactly 20 things are needed (the last errand may ask for fewer)
    makePlan(level) {
      const plan = [];
      let left = ITEMS;
      for (const m of A.shuffle(window.ARCADE_DATA.river.filter((r) => r.lvl === level))) {
        if (left <= 0) break;
        const need = m.need.slice(0, left);
        plan.push({ id: m.id, need });
        left -= need.length;
      }
      return plan;
    },
    begin(ck) {
      this.level = ck ? ck.level : A.level();
      this.s = A.startSession("river", this.level, ck ? ck.sid : null);
      this.plan = ck ? ck.plan : this.makePlan(this.level);
      this.got = ck ? ck.got.slice() : [];
      this.wrong = ck ? ck.wrong : 0;
      this.mi = 0;
      while (this.mi < this.plan.length - 1 && this.plan[this.mi].need.every((id) => this.isHome(id, this.mi))) this.mi++;
      this.phase = "play";
      this.paused = false;
      this.busy = false;
      this.resetBoat();
      this.startMission();
    },
    checkpoint() { A.Ckpt.set("river", { sid: this.s.id, level: this.level, plan: this.plan, got: this.got, wrong: this.wrong }); },
    // what was brought home, as [errand index, word id]: the same word can be needed again in a later errand
    isHome(id, mi) { const m = mi == null ? this.mi : mi; return this.got.some((g) => g[0] === m && g[1] === id); },
    ids() { return this.got.map((g) => g[1]); },
    mission() { const p = this.plan[this.mi]; return Object.assign({}, window.ARCADE_DATA.river.find((r) => r.id === p.id), { need: p.need }); },
    startMission() {
      const m = this.mission();
      this.boat = [];
      this.no = new Set();
      this.$("[data-task]").textContent = m.uz;
      this.bubble(null);
      // the market: what is still needed, the tempting extras of this errand and two other things, shuffled
      const left = m.need.filter((id) => !this.isHome(id));
      const others = A.shuffle(A.vocabFor(this.level, true).filter((w) => !m.need.includes(w.id) && !m.near.includes(w.id)).map((w) => w.id)).slice(0, 2);
      this.market = A.shuffle(left.concat(m.near.slice(0, 4), others));
      this.drawMarket();
      this.drawList();
      this.hud();
      this.banner(`${this.mi + 1}-topshiriq`, "good");
    },
    drawMarket() {
      const hidePics = this.level === "B1"; // at B1+ the English name has to be read: pictures show only once picked
      this.$("[data-items]").innerHTML = this.market.map((id) => {
        const w = A.word(id);
        const taken = this.boat.includes(id) || this.isHome(id);
        return `<button type="button" class="rv-item${hidePics && !taken ? " is-hidden-pic" : ""}${taken ? " is-taken" : ""}${this.no.has(id) ? " is-no" : ""}"
          data-item="${esc(id)}" aria-label="${esc(w.en)}" ${this.no.has(id) ? "disabled" : ""}>${A.picHtml(w)}<b>${esc(w.en)}</b></button>`;
      }).join("");
      this.syncSail();
    },
    drawList() {
      const m = this.mission();
      this.$("[data-list]").innerHTML = m.need.map((id) => {
        const w = A.word(id);
        const st = this.isHome(id) ? "is-home" : this.boat.includes(id) ? "is-boat" : "";
        return `<span class="rv-need ${st}">${esc(w.uz)}</span>`;
      }).join("");
    },
    syncSail() {
      const sail = this.$('[data-ac="sail"]');
      const m = this.mission();
      const left = m.need.filter((id) => !this.isHome(id) && !this.boat.includes(id));
      sail.disabled = this.busy || !this.boat.length;
      sail.classList.toggle("is-pulse", !!this.boat.length && (this.boat.length >= BOAT || !left.length));
      this.$("[data-market-title]").textContent = this.busy ? "Qayiq yo'lda…" : `Bozor — chap qirg'oq · qayiqda ${this.boat.length}/${BOAT}`;
    },
    hud() {
      this.$('[data-hud="n"]').textContent = `${this.got.length}/${ITEMS}`;
      this.$('[data-hud="score"]').textContent = `${this.score()} ball`;
    },
    score() { return Math.max(0, this.got.length * RULES.right - this.wrong * RULES.wrong); },

    // ---------------------------------------------------------------- picking and sailing
    click(ev) {
      if (this.phase !== "play" || this.paused) return;
      const it = ev.target.closest("[data-item]");
      if (it && !it.disabled) { this.pick(it.dataset.item, it); return; }
      if (ev.target.closest('[data-ac="sail"]')) this.sail();
      if (ev.target.closest('[data-ac="info-close"]')) this.closeInfo();
    },
    pick(id, el) {
      if (this.busy) { this.banner("Qayiq hali qaytmadi", "bad"); return; }
      const m = this.mission();
      if (this.boat.includes(id) || this.isHome(id)) return;
      if (!m.need.includes(id)) {
        if (this.no.has(id)) return;
        this.no.add(id); // each wrong thing costs once, then it is marked "not needed" for good
        this.wrong++;
        A.sfx.wrong();
        A.haptic("err");
        el.classList.add("is-shake");
        this.banner("Bu ro'yxatda yo'q", "bad");
        setTimeout(() => { if (this.root) this.drawMarket(); }, 380);
        this.hud();
        this.checkpoint();
        return;
      }
      if (this.boat.length >= BOAT) { this.banner("Qayiq to'la — suzing!", "bad"); return; }
      this.boat.push(id);
      A.sfx.right();
      A.haptic("ok");
      this.loadToken(id);
      this.drawMarket();
      this.drawList();
      this.info(A.word(id));
    },
    info(w) {
      this.closeInfo();
      const el = document.createElement("div");
      el.className = "rv-info";
      el.innerHTML = `<div class="ac-card">${A.wordCardHtml(w, { save: true, marked: this.s.want.has(w.id) })}
        <button type="button" class="ac-btn is-wide" data-ac="info-close">Yaxshi</button></div>`;
      this.root.appendChild(el);
      A.bindWordCard(el, this.s);
      el.addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="info-close"]')) this.closeInfo(); });
      A.speak(w.en);
      this.infoEl = el;
    },
    closeInfo() { if (this.infoEl) { this.infoEl.remove(); this.infoEl = null; } },
    // the boat's trips run on the frame clock (they stop while the game is paused): out, unload, back (or the end)
    go(kind, to, yaw) { this.trip = { kind, t: 0, dur: A.reducedMotion() ? 0.1 : TRIP, from: this.boatX, to, yaw0: this.yaw, yaw1: yaw }; },
    wait(kind, dur) { this.trip = { kind, t: 0, dur: A.reducedMotion() ? 0.1 : dur }; },
    sail() {
      if (this.busy || !this.boat.length) return;
      this.busy = true;
      this.closeInfo();
      this.syncSail();
      A.sfx.splash();
      this.go("out", DOCK, 0);
    },
    unload() {
      if (!this.root) return;
      const n = this.boat.length;
      this.boat.forEach((id) => this.got.push([this.mi, id]));
      this.boat = [];
      A.sfx.coin();
      this.bubble(`Rahmat, jigar! +${n * RULES.right}`);
      this.hopOut();
      this.drawList();
      this.hud();
      this.checkpoint();
      const m = this.mission();
      this.missionDone = m.need.every((id) => this.isHome(id));
      if (this.got.length >= ITEMS) {
        A.Ckpt.clear("river");
        A.finishSession(this.s, { items: this.ids(), wrong: this.wrong }); // all brought home: report before the goodbye
        this.wait("end", END);
        return;
      }
      this.wait("unload", UNLOAD);
    },
    // row back to the market bank, the bow turned round
    rowBack() {
      A.sfx.splash();
      this.go("back", -DOCK, -Math.PI);
    },
    docked() {
      this.busy = false;
      if (this.missionDone) {
        A.sfx.finish();
        this.mi++;
        this.startMission();
      } else { this.drawMarket(); this.bubble(null); }
    },
    bubble(text) {
      const b = this.$("[data-bubble]");
      b.hidden = !text;
      b.textContent = text || "";
    },

    // ---------------------------------------------------------------- frames
    loop(now) {
      if (!this.root) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (!this.paused) this.update(dt);
      if (this.st) this.st.render();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    },
    updateTrip(dt) {
      const tr = this.trip;
      if (!tr) return;
      tr.t += dt;
      const k = Math.min(1, tr.t / tr.dur);
      if (tr.kind === "out" || tr.kind === "back") {
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(2 - 2 * k, 2) / 2;
        const ky = Math.min(1, k / 0.35); // the bow turns round in the first third of the trip
        this.boatX = tr.from + (tr.to - tr.from) * e;
        this.yaw = tr.yaw0 + (tr.yaw1 - tr.yaw0) * ky * ky * (3 - 2 * ky);
        this.rowT += dt;
      }
      if (k < 1) return;
      this.trip = null;
      if (tr.kind === "out") this.unload();
      else if (tr.kind === "unload") this.rowBack();
      else if (tr.kind === "back") this.docked();
      else if (tr.kind === "end") this.finish();
    },
    update(dt) {
      this.t += dt;
      this.updateTrip(dt);
      const st = this.st;
      if (!st) return;
      if (st.resize()) this.layout();
      const t = this.t, tr = this.trip;
      const rowing = tr && (tr.kind === "out" || tr.kind === "back");
      const atDoor = tr && (tr.kind === "unload" || tr.kind === "end");
      this.waterTex.offset.y += dt * 0.12;
      // the boat bobs and rolls; while rowing it rocks with the strokes
      const b = this.boatG, p = this.rowT * 3;
      b.position.set(this.boatX, 0.02 + Math.sin(t * 2.1) * 0.035, 0);
      b.rotation.set(Math.sin(t * 1.7) * 0.035 + (rowing ? Math.sin(p) * 0.02 : 0), this.yaw, rowing ? -0.03 : 0);
      b.updateMatrixWorld(true);
      // the rower faces the bow, turned a little towards the camera either way
      this.rower.root.rotation.y = -Math.PI / 2 - 0.4 * Math.cos(this.yaw);
      if (atDoor) this.rower.pose("cheer", t); else this.rower.pose("row", this.rowT);
      // the oars follow the arms: blades in the water while the hands push forward
      const sweep = atDoor ? 0 : -Math.sin(p) * 0.5, dip = atDoor ? 0.05 : 0.2 + 0.12 * Math.cos(p);
      this.oars.forEach((o) => { o.pivot.rotation.y = o.side > 0 ? sweep : Math.PI - sweep; o.tilt.rotation.x = dip; });
      if (rowing && !A.reducedMotion()) {
        this.wakeT = (this.wakeT || 0) - dt;
        if (this.wakeT <= 0) {
          this.wakeT = 0.07;
          b.localToWorld(this.v.set(-1.75, 0.05, 0));
          this.sparks.burst(this.v.x, 0.08, this.v.z, "#ffffff", 2, 1.2, 0.45, 4);
        }
      }
      this.doorK += ((atDoor ? 1 : 0) - this.doorK) * Math.min(1, dt * 5);
      this.door.rotation.y = -1.25 * this.doorK;
      this.updateCargo(dt);
      this.sparks.update(dt);
      // the camera: closer on a phone and then following the boat, both banks in view on a wide screen
      const cam = st.camera;
      const maxPan = Math.max(0, SPAN - this.halfW);
      const want = Math.max(-maxPan, Math.min(maxPan, this.boatX * 1.8));
      this.camX = this.camX == null ? want : this.camX + (want - this.camX) * Math.min(1, dt * 2.5);
      cam.position.set(this.camX, 5.2, this.camDist + 1);
      cam.lookAt(this.camX, 1.4, 0);
    },
    updateCargo(dt) {
      const v = this.v, quick = A.reducedMotion();
      for (let i = this.cargo.length - 1; i >= 0; i--) {
        const c = this.cargo[i], o = c.obj.root;
        c.sway += dt * 2;
        o.rotation.y = Math.sin(c.sway) * 0.25;
        if (c.state === "hop") {
          if (c.delay > 0) { c.delay -= dt; o.position.copy(this.slotPos(c.slot, v)); continue; }
          if (!c.from) c.from = o.position.clone();
          c.k = Math.min(1, c.k + dt / (quick ? 0.1 : 0.55));
          this.doorPos(v);
          o.position.lerpVectors(c.from, v, c.k);
          o.position.y += Math.sin(c.k * Math.PI) * 1.6;
          o.scale.setScalar(1 - 0.65 * c.k);
          if (c.k >= 1) {
            this.sparks.burst(v.x, v.y, v.z, "#ffd34d", 18, 2.5, 0.7, 3);
            this.dropToken(c);
            this.cargo.splice(i, 1);
          }
          continue;
        }
        this.slotPos(c.slot, v);
        if (c.state === "fly") {
          c.k = Math.min(1, c.k + dt / (quick ? 0.1 : 0.6));
          o.position.lerpVectors(c.from, v, 1 - Math.pow(1 - c.k, 3));
          o.position.y += Math.sin(c.k * Math.PI) * 1.8;
          o.scale.setScalar(0.6 + 0.4 * c.k);
          if (c.k >= 1) c.state = "seat";
        } else o.position.copy(v);
      }
    },

    // ---------------------------------------------------------------- the end
    finish() {
      if (this.phase === "results") return;
      this.phase = "results";
      A.Ckpt.clear("river");
      this.closeInfo();
      A.finishSession(this.s, { items: this.ids(), wrong: this.wrong }, !this.got.length && !this.wrong);
      const tries = this.got.length + this.wrong;
      const el = A.overlay(this.root, `<div class="ac-results ac-start">${A.shk("celebrate", 140)}
        <h3>${this.got.length >= ITEMS ? "Barakalla, jigar!" : "O'yin yakunlandi"}</h3>
        <div class="ac-stats"><div class="ac-stat"><small>Olib borilgan narsalar</small><b>${this.got.length}/${ITEMS}</b></div>
          <div class="ac-stat"><small>Aniqlik</small><b>${A.accuracy(this.got.length, tries)}</b></div>
          <div class="ac-stat"><small>O'yin ballari</small><b>${this.score()}</b></div>
          <div class="ac-stat"><small>Yangi so'z bonusi</small><b data-ac="bonus">0</b></div></div>
        <p class="ac-receipt" data-ac="receipt"></p><div data-ac="words"></div>
        <div class="ac-actions">${A.btn("Qayta o'ynash", 'data-ac="again"', "is-primary")}${A.btn("Lug'at", 'data-ac="dict"')}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      A.paintShk(el);
      A.receiptLine(el.querySelector('[data-ac="receipt"]'), this.s);
      A.wordList(el.querySelector('[data-ac="words"]'), this.s, this.ids());
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "again") { el.remove(); this.begin(null); }
        else if (b.dataset.ac === "dict") A.openDictionary();
        else if (b.dataset.ac === "exit") A.close();
      });
    },
    pause() {
      if (this.paused || this.phase !== "play") return;
      this.paused = true;
      A.pauseMenu(this.root, {
        resume: () => { this.paused = false; this.last = performance.now(); },
        restart: () => { this.paused = false; this.endEarly(); this.begin(null); },
        exit: () => { this.paused = false; this.endEarly(); A.close(); },
      });
    },
    // leaving early: things already brought home count; things still in the boat do not
    endEarly() {
      this.busy = false;
      this.closeInfo();
      this.resetBoat();
      this.phase = "results";
      A.Ckpt.clear("river");
      A.finishSession(this.s, { items: this.ids(), wrong: this.wrong }, !this.got.length && !this.wrong);
    },
    banner(text, kind) {
      const el = this.root && this.root.querySelector("[data-banner]");
      if (!el) return;
      el.textContent = text;
      el.className = "ac-banner is-on is-" + (kind || "good");
      clearTimeout(this.bannerT);
      this.bannerT = setTimeout(() => { el.className = "ac-banner"; }, 1200);
    },
  };

  A.register("river", G);
})(window, document);
