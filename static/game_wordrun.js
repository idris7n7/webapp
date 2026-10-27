/* Word Run (L1_Arcade game "wordrun"): a 3D endless runner.
 *
 * The student's hero (one of six made-up children, picked on the start page: L1_Arcade.heroId) runs down a sunny street of cream houses with terracotta roofs. Swipe (or arrow keys) left/right to
 * change lanes, up to jump, down to slide. Barriers must be jumped, banners slid under, crates avoided; a hit costs a
 * heart (three in all). Word coins carry English words (10 game points each); magnets, shields and hearts float on the
 * road now and then. After every 10 coins he stops at a red traffic light while cars cross and a grammar question
 * appears: right = green light, he crosses and runs on; wrong = he steps onto the road, a car bumps him and he flies off
 * in a cartoon way (no injury shown) and the run ends. Ten right answers bring him home to Kungil Koʻchasi 17-uy.
 *
 * The world is a treadmill: the player stays near z = 0 and the street (a group moved by the distance run) slides
 * towards the camera; street blocks are recycled. The far street bends below the horizon (L1_3D.bend).
 */
(function (window, document) {
  "use strict";
  const A = window.L1_Arcade;
  if (!A) return;
  const esc = A.esc;
  const PER_LIGHT = 10, LIGHTS = 10, HEARTS = 3;
  const ADDRESS = "Kungil Koʻchasi 17-uy";
  const LANE = 1.7, LANES = [-LANE, 0, LANE];
  const CHUNK = 12, NCHUNK = 13, AHEAD = 128, BEHIND = 16;
  const SPEED = { A1: [8.5, 13], A2: [9.5, 14.5], B1: [10.5, 16] };
  const GRAVITY = 24, JUMP_V = 8.2, SLIDE_TIME = 0.7;
  const COLORS = { sky: "#4d9af0", horizon: "#d7ecff", facade: ["#f2e0be", "#eed4a8", "#f5e7cd", "#ead2ac", "#f0dcc4"], roof: ["#c4552b", "#b8482a", "#cf6435", "#a9452b"] };
  const TUTORIAL_KEY = "l1_arcade_wordrun_tutorial_v1";

  const G = {
    // ---------------------------------------------------------------- open / close
    open(root) {
      this.root = root;
      Object.assign(this, { phase: "loading", paused: false, raf: 0, t: 0, coins: [], answers: [], hearts: HEARTS, camPos: null });
      root.innerHTML = `<div class="ac-stage" data-stage></div>
        <div class="ac-hud" data-hud hidden><span class="ac-pill" title="So'z tangalari">${A.ICON.coin}<b data-hud-v="coins">0</b></span>
          <span class="ac-pill" title="Keyingi svetoforgacha"><span aria-hidden="true">🚦</span><b data-hud-v="group">0/${PER_LIGHT}</b></span>
          <span class="ac-pill" title="O'tilgan chorrahalar"><b data-hud-v="lights">0/${LIGHTS}</b></span>
          <span class="ac-pill wr3-hearts" data-hud-v="hearts" aria-label="Yuraklar"></span>
          <span class="ac-pill wr3-power" data-hud-v="power" hidden></span><span class="ac-hud-fill"></span>${A.hudButtons()}</div>
        <div class="ac-banner" data-banner></div><div class="wr3-hint" data-hint hidden></div>`;
      this.stageEl = root.querySelector("[data-stage]");
      root.querySelector(".ac-hud").addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "mute") A.toggleMute(b);
        if (b.dataset.ac === "pause") this.pause();
      });
      const el = A.overlay(root, `<div class="ac-loading"><div class="ac-spinner" aria-hidden="true"></div><b>Word Run</b><span>3D ko'cha qurilmoqda…</span></div>`, "is-loading");
      A.need3D().then(() => {
        el.remove();
        if (!this.root) return;
        if (!window.L1_3D.supported()) { this.no3D(); return; }
        try { this.build(); } catch (e) { console.error(e); this.no3D(); return; }
        this.bindInput();
        this.phase = "menu";
        this.last = performance.now();
        this.raf = requestAnimationFrame((t) => this.loop(t));
        this.startScreen();
      }, () => {
        el.remove();
        const err = A.overlay(root, `<h3>Yuklanmadi</h3><p>Internet aloqasini tekshirib, qayta urinib ko'ring.</p>
          <div class="ac-actions">${A.btn("Qayta urinish", 'data-ac="retry"', "is-primary")}${A.btn("Chiqish", 'data-ac="exit"')}</div>`);
        err.addEventListener("click", (ev) => { const b = ev.target.closest("[data-ac]"); if (!b) return; if (b.dataset.ac === "retry") { A.close(); A.open("wordrun"); } else A.close(); });
      });
    },
    no3D() {
      A.overlay(this.root, `<h3>3D ishlamayapti</h3><p>Bu qurilma yoki brauzer 3D grafikani (WebGL) qo'llamaydi. Boshqa brauzerda yoki telefonda urinib ko'ring.</p>
        <div class="ac-actions">${A.btn("Chiqish", 'data-ac="exit"', "is-primary")}</div>`).addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="exit"]')) A.close(); });
    },
    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener("keydown", this.onKey);
      clearTimeout(this.hintT);
      if (this.st) { try { this.st.dispose(); } catch (e) { /* already gone */ } }
      this.st = null;
      this.root = null;
    },
    onBack() {
      if (["run", "brake", "question", "cross", "accident", "home", "fall", "intro"].includes(this.phase) && !this.paused) { this.pause(); return true; }
      return false;
    },

    // ---------------------------------------------------------------- the 3D world
    build() {
      const D = window.L1_3D, THREE = window.THREE;
      this.D = D; this.THREE = THREE;
      const st = this.st = D.stage(this.stageEl, { fov: 62, far: 260, maxDpr: 1.6 });
      D.curve.value = 0.0017;
      D.sky(st.scene, COLORS.sky, COLORS.horizon, { radius: 240 });
      st.scene.fog = new THREE.Fog(COLORS.horizon, 34, 125);
      st.scene.add(new THREE.HemisphereLight("#d4ecff", "#e7cf9f", 1.15));
      const sun = this.sun = new THREE.DirectionalLight("#fff0d2", 2.5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 9, bottom: -9, near: 1, far: 40 });
      sun.shadow.bias = -0.0008;
      st.scene.add(sun, sun.target);
      // clouds on the horizon (no fog on them)
      const cloudM = new THREE.MeshBasicMaterial({ color: "#ffffff", fog: false, transparent: true, opacity: 0.92 });
      for (let i = 0; i < 9; i++) {
        const g = new THREE.Group();
        for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(D.shape("sphere"), cloudM); s.position.set(k * 5 - 7, Math.random() * 1.5, 0); s.scale.set(9 + Math.random() * 4, 5 + Math.random() * 2, 4); g.add(s); }
        const a = -Math.PI / 2 + (i - 4) * 0.28 + (Math.random() - 0.5) * 0.15;
        g.position.set(Math.cos(a) * 200, 32 + Math.random() * 24, Math.sin(a) * 200);
        g.lookAt(0, g.position.y, 0);
        st.scene.add(g);
      }
      this.world = new THREE.Group();
      st.scene.add(this.world);
      this.buildRoad();
      this.buildChunks();
      this.buildProps();
      this.player = D.hero(A.heroId(), { bent: true });
      st.scene.add(this.player.root);
      this.shield = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 16), new THREE.MeshStandardMaterial({ color: "#7fd3ff", transparent: true, opacity: 0.22, emissive: "#3aa0ff", emissiveIntensity: 0.4, depthWrite: false }));
      D.bend(this.shield.material);
      this.shield.visible = false;
      st.scene.add(this.shield);
      this.sparks = D.Sparks(st.scene, 260, true);
      this.resetTrack();
    },
    buildRoad() {
      const THREE = this.THREE, D = this.D;
      const c = document.createElement("canvas");
      c.width = 256; c.height = 512;
      const g = c.getContext("2d");
      g.fillStyle = "#4b505a"; g.fillRect(0, 0, 256, 512);
      for (let i = 0; i < 2200; i++) { const v = 60 + Math.random() * 40; g.fillStyle = `rgba(${v},${v + 3},${v + 10},.35)`; g.fillRect(Math.random() * 256, Math.random() * 512, 2, 2); }
      const lx = (x) => 128 + (x / 5.9) * 256; // road x (metres) to texture x
      g.fillStyle = "#f2f2ee";
      [-LANE / 2, LANE / 2].forEach((x) => { for (let y = 0; y < 512; y += 128) g.fillRect(lx(x) - 3, y + 20, 6, 70); });
      g.fillStyle = "#f2c94c";
      [-2.72, 2.72].forEach((x) => g.fillRect(lx(x) - 4, 0, 8, 512));
      const tex = D.pictureTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      this.roadMat = D.bend(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }));
      this.roadGeo = new THREE.PlaneGeometry(5.9, CHUNK);
      this.roadGeo.rotateX(-Math.PI / 2);
      this.roadGeo.translate(0, 0, -CHUNK / 2);
    },
    // A few street blocks, each merged into one mesh: kerbs, pavement, garden walls, trees, lamps and two houses a side.
    buildChunks() {
      const THREE = this.THREE, D = this.D;
      const P = D.part, S = D.shape;
      const rnd = (a, b) => a + Math.random() * (b - a);
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const house = (parts, side, z0, width) => {
        const depth = 5.2, h = rnd(4.6, 6.4), face = pick(COLORS.facade), roof = pick(COLORS.roof);
        const xf = side * 6.4; // the facade towards the street
        const xc = xf + side * depth / 2;
        parts.push(P(S("box"), face, [xc, h / 2, z0 - width / 2], null, [depth, h, width]));
        parts.push(P(S("box"), "#d9c09a", [xc, 0.25, z0 - width / 2], null, [depth + 0.1, 0.5, width + 0.1]));
        // the roof: a gable along the street or facing it
        if (Math.random() < 0.55) parts.push(P(S("prism"), roof, [xc, h, z0 - width / 2], [0, Math.PI / 2, 0], [width + 0.4, 2.1, depth + 0.5]));
        else parts.push(P(S("prism"), roof, [xc, h, z0 - width / 2], [0, 0, 0], [depth + 0.5, 2.3, width + 0.4]));
        parts.push(P(S("box"), "#b0522d", [xc + side * 0.8, h + 1.6, z0 - width * 0.3], null, [0.5, 1.4, 0.5]));
        // windows on two floors and a blue door, all on the street side
        const winX = xf - side * 0.02;
        [h * 0.32, h * 0.7].forEach((y, fl) => {
          [0.25, 0.75].forEach((f) => {
            const z = z0 - width * f;
            if (fl === 0 && f === 0.75) return;
            parts.push(P(S("box"), "#ffffff", [winX, y, z], null, [0.12, 1.2, 1.0]));
            parts.push(P(S("box"), "#3d5a7a", [winX - side * 0.04, y, z], null, [0.1, 1.0, 0.8]));
            parts.push(P(S("box"), "#ffffff", [winX - side * 0.06, y, z], null, [0.05, 1.0, 0.06]));
            parts.push(P(S("box"), "#ffffff", [winX - side * 0.06, y + 0.12, z], null, [0.05, 0.06, 0.8]));
            if (Math.random() < 0.5) parts.push(P(S("lowsphere"), pick(["#ff7ab0", "#f04e6a", "#ffd166"]), [winX - side * 0.3, y - 0.65, z], null, [0.5, 0.3, 0.9]));
          });
        });
        const dz = z0 - width * 0.75;
        parts.push(P(S("box"), "#ffffff", [winX, 1.2, dz], null, [0.12, 2.4, 1.3]));
        parts.push(P(S("box"), pick(["#2d5d8f", "#2f6aa0", "#2a557f"]), [winX - side * 0.04, 1.1, dz], null, [0.1, 2.15, 1.05]));
        parts.push(P(S("sphere"), "#d8b04a", [winX - side * 0.1, 1.1, dz - 0.3], null, [0.08, 0.08, 0.08]));
        parts.push(P(S("box"), "#e4d3b4", [xf - side * 0.4, 0.12, dz], null, [0.8, 0.24, 1.5]));
        parts.push(P(S("box"), "#e8d5b5", [side * 5.5, 0.13, dz], null, [1.7, 0.03, 1.1])); // a path to the door
      };
      const tree = (parts, x, z, blossom) => {
        parts.push(P(S("cyl"), "#7a5233", [x, 1.1, z], null, [0.28, 2.2, 0.28]));
        const leaf = blossom ? ["#ff9ec7", "#ffb3d4", "#f784b6"] : ["#73b64d", "#5fa43f", "#86c45a"];
        parts.push(P(S("lowsphere"), leaf[0], [x, 2.7, z], null, [2.1, 1.8, 2.1]));
        parts.push(P(S("lowsphere"), leaf[1], [x - 0.5, 2.3, z + 0.4], null, [1.4, 1.2, 1.4]));
        parts.push(P(S("lowsphere"), leaf[2], [x + 0.45, 3.2, z - 0.3], null, [1.3, 1.2, 1.3]));
      };
      this.chunkGeos = [];
      for (let v = 0; v < 6; v++) {
        const parts = [];
        [-1, 1].forEach((side) => {
          parts.push(P(S("box"), "#cfc2ac", [side * 3.04, 0.08, -CHUNK / 2], null, [0.2, 0.16, CHUNK]));
          parts.push(P(S("box"), "#eadbc0", [side * 3.9, 0.06, -CHUNK / 2], null, [1.52, 0.12, CHUNK]));
          for (let k = 0; k < 12; k++) parts.push(P(S("box"), "#d9c7a6", [side * 3.9, 0.061, -k - 0.5], null, [1.52, 0.122, 0.04]));
          // the low garden wall with two gates, pillars with caps
          [[0, 2.6], [3.6, 7.2], [8.6, 12]].forEach(([a, b]) => parts.push(P(S("box"), "#e2c9a0", [side * 4.75, 0.35, -(a + b) / 2], null, [0.32, 0.7, b - a])));
          [0, 2.6, 3.6, 7.2, 8.6].forEach((z) => { parts.push(P(S("box"), "#dcc193", [side * 4.75, 0.5, -z], null, [0.44, 1.0, 0.44])); parts.push(P(S("box"), "#efdcb9", [side * 4.75, 1.04, -z], null, [0.52, 0.1, 0.52])); });
          parts.push(P(S("box"), "#9ac86a", [side * 5.6, 0.1, -CHUNK / 2], null, [1.6, 0.2, CHUNK]));
          for (let k = 0; k < 4; k++) parts.push(P(S("lowsphere"), pick(["#6aa84a", "#5b9a40", "#7bbd55"]), [side * rnd(5.2, 5.9), 0.4, -rnd(0.5, 11.5)], null, [0.9, 0.7, 0.9]));
          for (let k = 0; k < 5; k++) parts.push(P(S("sphere"), pick(["#ff6f91", "#ff9ec7", "#ffd166", "#ffffff"]), [side * rnd(5.1, 5.9), rnd(0.6, 0.85), -rnd(0.5, 11.5)], null, [0.22, 0.22, 0.22]));
          house(parts, side, -0.2, 5.6);
          house(parts, side, -6.2, 5.6);
          if (Math.random() < 0.7) tree(parts, side * rnd(5.2, 5.8), -rnd(1.5, 10.5), Math.random() < 0.35);
          if (v % 2 === 0) { // a lamp post
            parts.push(P(S("cyl"), "#2b2f36", [side * 3.35, 1.6, -3], null, [0.1, 3.2, 0.1]));
            parts.push(P(S("box"), "#2b2f36", [side * 3.35, 3.25, -3], null, [0.34, 0.4, 0.34]));
            parts.push(P(S("box"), "#fff3c4", [side * 3.35, 3.2, -3], null, [0.26, 0.26, 0.26]));
          }
          for (let z = 1.5; z < CHUNK; z += 3.5) if (Math.random() < 0.45) { // black bollards on the kerb
            parts.push(P(S("cyl"), "#1f2228", [side * 3.25, 0.45, -z], null, [0.16, 0.7, 0.16]));
            parts.push(P(S("sphere"), "#1f2228", [side * 3.25, 0.82, -z], null, [0.2, 0.2, 0.2]));
          }
        });
        this.chunkGeos.push(D.merge(parts));
      }
      const envMat = D.vcMaterial(true, { roughness: 0.85 });
      this.chunks = [];
      for (let i = 0; i < NCHUNK; i++) {
        const g = new THREE.Group();
        const env = new THREE.Mesh(this.chunkGeos[i % this.chunkGeos.length], envMat);
        env.receiveShadow = true;
        const road = new THREE.Mesh(this.roadGeo, this.roadMat);
        road.receiveShadow = true;
        g.add(env, road);
        this.world.add(g);
        this.chunks.push({ g, env, i });
      }
    },
    // obstacles, coins, power-ups, cars for the crossing
    buildProps() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const mk = (parts) => D.merge(parts);
      // a low barrier to jump: posts and two striped boards
      const low = [];
      [-0.68, 0.68].forEach((x) => low.push(P(S("box"), "#3a3f48", [x, 0.42, 0], null, [0.1, 0.84, 0.1])));
      for (let k = 0; k < 6; k++) [0.42, 0.72].forEach((y) => low.push(P(S("box"), k % 2 ? "#ffffff" : "#e5484d", [-0.625 + k * 0.25, y, 0], null, [0.25, 0.18, 0.08])));
      // a banner to slide under: poles and a frame; the sign itself is a textured plane
      const high = [];
      [-0.78, 0.78].forEach((x) => high.push(P(S("cyl"), "#3a3f48", [x, 1.25, 0], null, [0.1, 2.5, 0.1])));
      high.push(P(S("box"), "#c96a2b", [0, 1.62, 0], null, [1.66, 0.94, 0.08]));
      // crates or barrels to go around
      const crates = [];
      [[-0.4, 0.42, 0.75], [0.4, 0.42, 0.75], [0, 1.2, 0.72]].forEach(([x, y, s]) => {
        crates.push(P(S("box"), "#b8834e", [x, y, 0], null, [s, s, s]));
        crates.push(P(S("box"), "#8a5c30", [x, y + s * 0.3, s / 2 + 0.005], null, [s * 0.95, 0.07, 0.02]));
        crates.push(P(S("box"), "#8a5c30", [x, y - s * 0.3, s / 2 + 0.005], null, [s * 0.95, 0.07, 0.02]));
        crates.push(P(S("box"), "#8a5c30", [x, y, s / 2 + 0.006], [0, 0, 0.75], [s * 1.2, 0.07, 0.02]));
      });
      const barrels = [];
      [[-0.38, 0.3], [0.38, 0.3], [0, 0.95]].forEach(([x, y]) => {
        barrels.push(P(S("cyl"), "#3f7fbf", [x, y + 0.3, 0], null, [0.62, 0.9, 0.62]));
        barrels.push(P(S("cyl"), "#2f5f8f", [x, y + 0.6, 0], null, [0.64, 0.06, 0.64]));
        barrels.push(P(S("cyl"), "#2f5f8f", [x, y + 0.02, 0], null, [0.64, 0.06, 0.64]));
      });
      this.obGeo = { low: mk(low), high: mk(high), crates: mk(crates), barrels: mk(barrels) };
      this.obMat = D.vcMaterial(true, { roughness: 0.7 });
      this.bannerMat = D.bend(new THREE.MeshStandardMaterial({ map: D.textTexture("SEKIN YUR!", { w: 512, h: 256, bg: "#ffb547", round: 24, border: "#c96a2b", color: "#5a2a08", size: 110 }), roughness: 0.8 }));
      this.signGeo = new THREE.PlaneGeometry(1.5, 0.78);
      // coins: a gold rim and a face with the word on both sides
      this.coinRimGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.1, 32, 1, true);
      this.coinRimGeo.rotateX(Math.PI / 2);
      this.coinRimMat = D.bend(new THREE.MeshStandardMaterial({ color: "#ffbf1f", metalness: 0.85, roughness: 0.25, emissive: "#7a4a00", emissiveIntensity: 0.25 }));
      this.coinFaceGeo = new THREE.CircleGeometry(0.46, 32);
      this.wordMats = {};
      // power-ups: a magnet, a heart, a shield
      const magnet = [];
      const tor = new THREE.TorusGeometry(0.32, 0.11, 10, 20, Math.PI);
      magnet.push(P(tor, "#e5484d", [0, 0.05, 0], [0, 0, Math.PI]));
      [-0.32, 0.32].forEach((x) => { magnet.push(P(S("box"), "#e5484d", [x, 0.22, 0], null, [0.22, 0.34, 0.22])); magnet.push(P(S("box"), "#e9eef5", [x, 0.45, 0], null, [0.23, 0.14, 0.23])); });
      const hs = new THREE.Shape();
      hs.moveTo(0, -0.35); hs.bezierCurveTo(-0.45, 0, -0.42, 0.38, 0, 0.18); hs.bezierCurveTo(0.42, 0.38, 0.45, 0, 0, -0.35);
      const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 });
      hg.translate(0, 0, -0.09);
      const shield = [P(new THREE.CylinderGeometry(0.4, 0.4, 0.12, 6), "#3aa0ff", [0, 0.1, 0], [Math.PI / 2, 0, 0]), P(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 6), "#e9f6ff", [0, 0.1, 0], [Math.PI / 2, 0, 0])];
      this.powGeo = { magnet: mk(magnet), heart: mk([P(hg, "#ff3d5a", [0, 0.1, 0])]), shield: mk(shield) };
      this.ringGeo = new THREE.TorusGeometry(0.62, 0.035, 8, 40);
      this.ringMat = D.bend(new THREE.MeshBasicMaterial({ color: "#fff1a8", transparent: true, opacity: 0.85 }));
      // cars for the crossing (side view, driving along x)
      const car = (color) => {
        const p = [];
        p.push(P(S("rbox"), color, [0, 0.62, 0], null, [3.4, 0.75, 1.6]));
        p.push(P(S("rbox"), color, [-0.15, 1.18, 0], null, [1.9, 0.62, 1.45]));
        p.push(P(S("box"), "#2b3b52", [-0.15, 1.2, 0], null, [1.7, 0.42, 1.47]));
        [[-1.1, -0.8], [1.1, -0.8], [-1.1, 0.8], [1.1, 0.8]].forEach(([x, z]) => {
          p.push(P(S("cyl"), "#1c1c20", [x, 0.36, z], [Math.PI / 2, 0, 0], [0.72, 0.28, 0.72]));
          p.push(P(S("cyl"), "#cfd4dc", [x, 0.36, z + Math.sign(z) * 0.15], [Math.PI / 2, 0, 0], [0.34, 0.02, 0.34]));
        });
        p.push(P(S("sphere"), "#fff6c9", [1.68, 0.72, 0.5], null, [0.12, 0.16, 0.22]));
        p.push(P(S("sphere"), "#fff6c9", [1.68, 0.72, -0.5], null, [0.12, 0.16, 0.22]));
        p.push(P(S("box"), "#d8dde4", [0, 0.32, 0], null, [3.42, 0.1, 1.62]));
        return mk(p);
      };
      this.carGeo = { blue: car("#2f7de1"), red: car("#e04545") };
      this.carMat = D.vcMaterial(true, { roughness: 0.35 });
    },
    wordMat(id) {
      if (this.wordMats[id]) return this.wordMats[id];
      const D = this.D, THREE = this.THREE, w = A.word(id);
      const tex = D.textTexture(w ? w.en : "?", {
        w: 256, h: 256, size: 64, color: "#6b4300", shadow: "rgba(255,240,180,.9)", fit: 0.7,
        paint: (g) => {
          const r = g.createRadialGradient(110, 100, 10, 128, 128, 128);
          r.addColorStop(0, "#fff3a6"); r.addColorStop(0.55, "#ffcc33"); r.addColorStop(1, "#e09c0c");
          g.fillStyle = r; g.beginPath(); g.arc(128, 128, 127, 0, Math.PI * 2); g.fill();
          g.lineWidth = 8; g.strokeStyle = "rgba(170,105,0,.65)"; g.beginPath(); g.arc(128, 128, 106, 0, Math.PI * 2); g.stroke();
        },
      });
      const m = D.bend(new THREE.MeshStandardMaterial({ map: tex, metalness: 0.35, roughness: 0.35, emissive: "#3a2400", emissiveIntensity: 0.18 }));
      this.wordMats[id] = m;
      return m;
    },

    // ---------------------------------------------------------------- the track: blocks, obstacles, coins
    resetTrack() {
      (this.items || []).forEach((it) => this.world.remove(it.obj));
      if (this.crossing) { this.world.remove(this.crossing.g); this.crossing = null; }
      if (this.home) { this.world.remove(this.home.g); this.home = null; }
      this.items = [];
      this.travel = 0;
      this.world.position.z = 0;
      this.genZ = 26;              // where the next stretch of track will be generated (metres from the start)
      this.lastCoinZ = 18;
      // two blocks behind the start too: the menu camera looks back past him down the street
      this.chunks.forEach((c, i) => { c.i = i - 2; c.g.position.z = -c.i * CHUNK; c.g.visible = true; c.env.visible = true; });
      Object.assign(this, { lane: 1, px: 0, py: 0, vy: 0, sliding: 0, stumble: 0, invuln: 0, magnet: 0, shieldT: 0, speed: 0, group: 0, shake: 0, fly: null, inside: false, slowmo: 0 });
      this.pending = null; // "crossing" when ten coins are in and the light is coming; "home" after the tenth light
      if (this.player) { this.player.root.visible = true; this.player.root.rotation.set(0, 0, 0); this.player.body.position.set(0, 0, 0); }
    },
    addItem(type, lane, z, extra) {
      const THREE = this.THREE;
      const obj = new THREE.Group();
      if (type === "coin") {
        const m = this.wordMat(extra.word);
        const f1 = new THREE.Mesh(this.coinFaceGeo, m); f1.position.z = 0.051;
        const f2 = new THREE.Mesh(this.coinFaceGeo, m); f2.position.z = -0.051; f2.rotation.y = Math.PI;
        obj.add(new THREE.Mesh(this.coinRimGeo, this.coinRimMat), f1, f2);
        obj.children.forEach((c) => { c.castShadow = true; });
      } else if (type === "power") {
        const core = new THREE.Mesh(this.powGeo[extra.kind], this.obMat);
        core.castShadow = true;
        const ring = new THREE.Mesh(this.ringGeo, this.ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.55;
        obj.add(core, ring);
      } else {
        const geo = type === "block" ? this.obGeo[Math.random() < 0.5 ? "crates" : "barrels"] : this.obGeo[type];
        const mesh = new THREE.Mesh(geo, this.obMat);
        mesh.castShadow = true; mesh.receiveShadow = true;
        obj.add(mesh);
        if (type === "high") {
          const sign = new THREE.Mesh(this.signGeo, this.bannerMat);
          sign.position.set(0, 1.62, 0.05);
          obj.add(sign);
        }
      }
      const y = extra && extra.y != null ? extra.y : 0;
      obj.position.set(LANES[lane], y, -z);
      this.world.add(obj);
      const it = Object.assign({ type, lane, z, obj, y, alive: true }, extra || {});
      this.items.push(it);
      return it;
    },
    // Generates track from genZ up to `upTo`: rows of obstacles with word coins in safe lanes, now and then a power-up.
    generate(upTo) {
      const density = { A1: 0.55, A2: 0.7, B1: 0.85 }[this.level] || 0.6;
      while (this.genZ < upTo) {
        const z = this.genZ;
        const step = 13 + Math.random() * 6;
        const row = [null, null, null];
        if (Math.random() < density) {
          // one or two lanes get an obstacle; at least one lane stays free to run through
          const kinds = ["low", "high", "block"];
          const n = Math.random() < 0.35 ? 2 : 1;
          A.shuffle([0, 1, 2]).slice(0, n).forEach((l) => { row[l] = kinds[Math.floor(Math.random() * kinds.length)]; });
          row.forEach((k, l) => { if (k) this.addItem(k, l, z); });
        }
        // the word coin of this stretch: in a free lane, or high over a barrier (a jump picks it up)
        if (z - this.lastCoinZ > 11) {
          const free = [0, 1, 2].filter((l) => !row[l]);
          const overLow = [0, 1, 2].filter((l) => row[l] === "low");
          let lane, y = 1.05, cz = z;
          if (overLow.length && Math.random() < 0.3) { lane = overLow[0]; y = 2.0; }
          else { lane = free[Math.floor(Math.random() * free.length)]; cz = z + (Math.random() < 0.5 ? -5 : 5); }
          this.addItem("coin", lane, cz, { y, word: this.nextWord() });
          this.lastCoinZ = cz;
        }
        if (Math.random() < 0.09) {
          const free = [0, 1, 2].filter((l) => !row[l]);
          const kind = this.hearts < HEARTS && Math.random() < 0.45 ? "heart" : Math.random() < 0.5 ? "magnet" : "shield";
          this.addItem("power", free[Math.floor(Math.random() * free.length)], z + 7.5, { y: 1.15, kind });
        }
        this.genZ += step;
      }
    },
    nextWord() {
      if (!this.bag || !this.bag.length) this.bag = A.shuffle(A.vocabFor(this.level || "A1", true).map((w) => w.id));
      return this.bag.pop();
    },
    // Ten coins: no more track; the crossing appears a little way ahead and everything beyond it goes.
    queueCrossing() {
      const cz = this.travel + 46;
      // nothing beyond the light, and no more coins before it: a stretch is exactly ten coins
      this.items = this.items.filter((it) => {
        if (it.z > cz - 14 || it.type === "coin") { this.world.remove(it.obj); return false; }
        return true;
      });
      this.buildCrossing(cz);
      this.genZ = cz + 18;
      this.lastCoinZ = cz + 10;
      this.pending = "crossing";
    },
    buildCrossing(cz) {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const g = new THREE.Group();
      const parts = [];
      // the side street crosses ours: asphalt from far left to far right, kerb corners, a zebra in our road
      parts.push(P(S("box"), "#4b505a", [0, 0.005, 0], null, [90, 0.01, 8]));
      for (let k = -2; k <= 2; k++) parts.push(P(S("box"), "#f4f4f0", [k * 1.15, 0.015, 0], null, [0.62, 0.012, 5.2]));
      parts.push(P(S("box"), "#f4f4f0", [0, 0.015, 3.2], null, [5.8, 0.012, 0.25]));
      [-1, 1].forEach((side) => [-1, 1].forEach((ez) => {
        parts.push(P(S("box"), "#eadbc0", [side * 30, 0.06, ez * 8.6], null, [54, 0.12, 9.2]));
        parts.push(P(S("box"), "#cfc2ac", [side * 30, 0.08, ez * 4.1], null, [54, 0.16, 0.2]));
      }));
      for (let x = -40; x <= 40; x += 6) parts.push(P(S("box"), "#f2c94c", [x, 0.014, 0], null, [3, 0.01, 0.14]));
      const base = new THREE.Mesh(D.merge(parts), D.vcMaterial(true, { roughness: 0.9 }));
      base.receiveShadow = true;
      g.add(base);
      // traffic lights on both far corners, facing the runner (seen from any lane), sharing three lamp materials
      const lp = [];
      lp.push(P(S("cyl"), "#23262c", [0, 1.9, 0], null, [0.16, 3.8, 0.16]));
      lp.push(P(S("rbox"), "#1d2025", [0, 3.75, 0], null, [0.5, 1.4, 0.42]));
      lp.push(P(S("box"), "#1d2025", [0, 4.5, 0.05], null, [0.6, 0.06, 0.52]));
      const poleGeo = D.merge(lp), poleMat = D.vcMaterial(true, { roughness: 0.5 });
      const lampMat = () => D.bend(new THREE.MeshBasicMaterial({ color: "#2a2a2a" })); // unlit: a lit lamp glows in any light
      const lamps = { red: lampMat(), amber: lampMat(), green: lampMat() };
      const lampGeo = new THREE.SphereGeometry(0.17, 16, 12);
      const lights = [-3.35, 3.35].map((x) => {
        const light = new THREE.Group();
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.castShadow = true;
        light.add(pole);
        [["red", 4.15], ["amber", 3.75], ["green", 3.35]].forEach(([k, y]) => { const s = new THREE.Mesh(lampGeo, lamps[k]); s.position.set(0, y, 0.22); light.add(s); });
        light.position.set(x, 0, -4.6);
        g.add(light);
        return light;
      });
      const light = lights[1];
      const cars = [
        { mesh: new THREE.Mesh(this.carGeo.blue, this.carMat), lane: 1.9, dir: 1, x: -26, speed: 11, wait: 0 },
        { mesh: new THREE.Mesh(this.carGeo.red, this.carMat), lane: -1.9, dir: -1, x: 18, speed: 10, wait: 0.8 },
      ];
      cars.forEach((c) => { c.mesh.castShadow = true; if (c.dir < 0) c.mesh.rotation.y = Math.PI; c.mesh.position.set(c.x, 0, c.lane); g.add(c.mesh); });
      g.position.z = -cz;
      this.world.add(g);
      this.crossing = { g, cz, stop: cz - 5.2, lamps, cars, light, state: "red" };
      this.setLight("red");
    },
    setLight(state) {
      const L = this.crossing.lamps;
      L.red.color.set(state === "red" ? "#ff2b2b" : "#3a1f1f");
      L.amber.color.set("#3a321c");
      L.green.color.set(state === "green" ? "#2bff66" : "#1d3a24");
      this.crossing.state = state;
    },
    buildHome(hz) {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape;
      const g = new THREE.Group();
      const parts = [];
      // the house across the end of the street, its blue door facing the runner
      const W = 9, H = 6.4, Dp = 6, zf = -1.5; // the facade at local z = zf
      parts.push(P(S("box"), "#f3e2c2", [0, H / 2, zf - Dp / 2], null, [W, H, Dp]));
      parts.push(P(S("box"), "#dcc193", [0, 0.3, zf - Dp / 2], null, [W + 0.2, 0.6, Dp + 0.2]));
      parts.push(P(S("prism"), "#c4552b", [0, H, zf - Dp / 2], null, [W + 0.6, 2.8, Dp + 0.6]));
      parts.push(P(S("box"), "#b0522d", [-2.6, H + 1.8, zf - 2], null, [0.7, 1.8, 0.7]));
      [[-2.8, 1.9], [2.8, 1.9], [-2.8, 4.6], [0, 4.6], [2.8, 4.6]].forEach(([x, y]) => {
        parts.push(P(S("box"), "#ffffff", [x, y, zf + 0.04], null, [1.3, 1.5, 0.12]));
        parts.push(P(S("box"), "#3d5a7a", [x, y, zf + 0.08], null, [1.05, 1.25, 0.08]));
        parts.push(P(S("box"), "#ffffff", [x, y, zf + 0.12], null, [0.06, 1.25, 0.05]));
        parts.push(P(S("lowsphere"), "#ff7ab0", [x, y - 0.85, zf + 0.35], null, [1.1, 0.3, 0.5]));
      });
      parts.push(P(S("box"), "#ffffff", [0, 1.35, zf + 0.04], null, [1.7, 2.75, 0.12])); // door frame
      parts.push(P(S("box"), "#2a2016", [0, 1.25, zf + 0.06], null, [1.3, 2.45, 0.08])); // the hall behind the door
      parts.push(P(S("box"), "#e4d3b4", [0, 0.15, zf + 0.7], null, [2.2, 0.3, 1.2]));
      parts.push(P(S("box"), "#efe0c4", [0, 3.05, zf + 0.09], null, [3.2, 0.62, 0.1])); // the band for the address
      [-1, 1].forEach((side) => { // garden wall with a gate opening, bushes and flowers
        parts.push(P(S("box"), "#e2c9a0", [side * 3.6, 0.45, zf + 6], null, [4.6, 0.9, 0.35]));
        parts.push(P(S("box"), "#dcc193", [side * 1.2, 0.65, zf + 6], null, [0.55, 1.3, 0.55]));
        parts.push(P(S("box"), "#efdcb9", [side * 1.2, 1.34, zf + 6], null, [0.62, 0.1, 0.62]));
        for (let k = 0; k < 4; k++) parts.push(P(S("lowsphere"), "#6aa84a", [side * (2 + k * 0.8), 0.5, zf + 1.4], null, [1, 0.9, 1]));
        for (let k = 0; k < 6; k++) parts.push(P(S("sphere"), ["#ff6f91", "#ff9ec7", "#ffd166"][k % 3], [side * (1.9 + k * 0.55), 0.95, zf + 1.3 + (k % 2) * 0.3], null, [0.24, 0.24, 0.24]));
      });
      parts.push(P(S("box"), "#9ac86a", [0, 0.08, zf + 3.5], null, [12, 0.16, 7]));
      parts.push(P(S("box"), "#e8d5b5", [0, 0.17, zf + 3.5], null, [1.6, 0.04, 7]));
      const mesh = new THREE.Mesh(D.merge(parts), D.vcMaterial(true, { roughness: 0.85 }));
      mesh.castShadow = true; mesh.receiveShadow = true;
      g.add(mesh);
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.5), D.bend(new THREE.MeshStandardMaterial({
        map: D.textTexture(ADDRESS, { w: 1024, h: 170, bg: "#efe0c4", color: "#5a3a12", size: 92 }), roughness: 0.8 })));
      plate.position.set(0, 3.05, zf + 0.15);
      g.add(plate);
      const hinge = new THREE.Group();
      hinge.position.set(-0.62, 0, zf + 0.12);
      hinge.add(new THREE.Mesh(D.merge([P(S("box"), "#2d5d8f", [0.62, 1.22, 0], null, [1.24, 2.4, 0.08]), P(S("sphere"), "#d8b04a", [1.05, 1.2, 0.08], null, [0.1, 0.1, 0.1])]), D.vcMaterial(true, { roughness: 0.4 })));
      g.add(hinge);
      const glow = new THREE.PointLight("#ffcf7a", 0, 8, 1.6);
      glow.position.set(0, 1.4, zf - 0.6);
      g.add(glow);
      g.position.z = -hz;
      this.world.add(g);
      this.home = { g, hz, door: hinge, glow, stopZ: hz - 4.5 };
    },

    // ---------------------------------------------------------------- start, resume
    startScreen() {
      this.phase = "menu";
      this.root.querySelector("[data-hud]").hidden = true;
      const ck = A.Ckpt.get("wordrun");
      const lvl = A.level();
      const el = A.overlay(this.root, `<div class="ac-start"><h2>Word Run</h2>${A.heroPicker()}
        <ul class="ac-rules"><li>Suring: ⬅️ ➡️ yo'lak, ⬆️ sakrash, ⬇️ sirpanish. To'siqqa urilsangiz — yurak kamayadi (${HEARTS} ta).</li>
          <li>So'z tangalari — 10 ball. Har 10 tangadan keyin svetoforda grammatika savoli.</li>
          <li>10 ta to'g'ri javob — uyga, ${esc(ADDRESS)}ga!</li></ul>
        <span class="ac-lvl-line">Daraja: <b>${A.levelName(lvl)}</b></span>
        <div class="ac-actions is-col">${ck ? A.btn(`Davom ettirish (${ck.answers.length}/${LIGHTS} chorraha)`, 'data-ac="resume"', "is-primary") : ""}
          ${A.btn(ck ? "Yangi o'yin" : "Boshlash", 'data-ac="new"', ck ? "" : "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`, "is-menu");
      A.paintShk(el);
      A.bindHeroPicker(el, (id) => this.swapHero(id));
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        el.remove();
        if (b.dataset.ac === "exit") { A.close(); return; }
        if (b.dataset.ac === "resume" && ck) this.begin(ck); else { A.Ckpt.clear("wordrun"); this.begin(null); }
      });
    },
    // another hero picked on the start page: the figure on the street changes at once
    swapHero(id) {
      if (!this.st || !this.player) return;
      const old = this.player;
      this.player = this.D.hero(id, { bent: true });
      this.st.scene.add(this.player.root);
      this.st.scene.remove(old.root);
      old.root.traverse((ob) => { if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose(); });
    },
    begin(ck) {
      const lvl = ck ? ck.level : A.level();
      this.level = lvl;
      this.s = A.startSession("wordrun", lvl, ck ? ck.sid : null);
      const byId = (id) => window.ARCADE_DATA.grammar.find((g) => g.id === id);
      this.questions = ck ? ck.qids.map(byId).filter(Boolean) : A.grammarFor(lvl, LIGHTS);
      if (this.questions.length < LIGHTS) this.questions = this.questions.concat(A.grammarFor(lvl, LIGHTS)).slice(0, LIGHTS);
      this.coins = ck ? ck.coins.slice() : [];
      this.answers = ck ? ck.answers.slice() : [];
      this.hearts = HEARTS;
      this.bag = null;
      this.over = false;
      this.resetTrack();
      this.generate(this.travel + AHEAD);
      this.root.querySelector("[data-hud]").hidden = false;
      this.hud();
      this.phase = "intro";
      this.t = 0;
      this.paused = false;
      try { this.tutorial = localStorage.getItem(TUTORIAL_KEY) ? null : { low: false, high: false, block: false }; } catch (e) { this.tutorial = null; }
    },
    checkpoint() {
      A.Ckpt.set("wordrun", { sid: this.s.id, level: this.level, qids: this.questions.map((q) => q.id), coins: this.coins, answers: this.answers });
    },
    rightCount() { return this.answers.filter((a) => { const g = window.ARCADE_DATA.grammar.find((x) => x.id === a.q); return g && g.a === a.c; }).length; },

    // ---------------------------------------------------------------- input
    bindInput() {
      let sx = 0, sy = 0, down = false, done = false;
      const el = this.stageEl;
      el.addEventListener("pointerdown", (ev) => { down = true; done = false; sx = ev.clientX; sy = ev.clientY; });
      el.addEventListener("pointermove", (ev) => {
        if (!down || done) return;
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
        done = true;
        if (Math.abs(dx) > Math.abs(dy)) this.act(dx < 0 ? "left" : "right"); else this.act(dy < 0 ? "jump" : "slide");
      });
      const up = () => { down = false; };
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      this.onKey = (ev) => {
        if (!this.root) return;
        if (ev.key === "Escape") { this.pause(); return; }
        const a = { ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", ArrowUp: "jump", w: "jump", " ": "jump", ArrowDown: "slide", s: "slide" }[ev.key];
        if (a && this.phase === "run") { ev.preventDefault(); this.act(a); }
      };
      window.addEventListener("keydown", this.onKey);
    },
    act(a) {
      if (this.phase !== "run" || this.paused || this.stumble > 0.35) return;
      if (a === "left" || a === "right") {
        const to = Math.max(0, Math.min(2, this.lane + (a === "left" ? -1 : 1)));
        if (to !== this.lane) { this.lane = to; A.sfx.whoosh(); }
      } else if (a === "jump") {
        if (this.py <= 0.001) { this.vy = JUMP_V; this.sliding = 0; A.sfx.jump(); }
      } else if (a === "slide") {
        if (this.py > 0.05) this.vy = -16; // a swipe down in the air drops him fast
        this.sliding = SLIDE_TIME;
        A.sfx.whoosh();
      }
      A.haptic("tap");
      if (this.slowFor && (this.slowFor.need === a || (this.slowFor.need === "side" && (a === "left" || a === "right")))) this.slowFor = null;
    },

    // ---------------------------------------------------------------- the loop
    loop(now) {
      if (!this.root || !this.st) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (!this.paused) this.update(dt);
      this.render();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    },
    update(dtReal) {
      if (this.slowmo > 0) this.slowmo -= dtReal; // the moment of the bump plays in slow motion
      const dt = this.slowFor || this.slowmo > 0 ? dtReal * 0.3 : dtReal;
      this.t += dt;
      const ph = this.phase;
      if (ph === "menu") { this.player.pose("wave", this.t); this.player.root.position.set(0, 0, 0); this.player.root.rotation.set(0, 0, 0); return; }
      if (ph === "intro") {
        this.player.root.rotation.set(0, 0, 0); // he faces the road all along; the camera swings round behind him
        this.player.pose(this.t < 0.6 ? "wave" : "run", this.t);
        if (this.t > 1.1) { this.phase = "run"; this.banner(this.coins.length ? "Yana 10 ta tanga!" : `Yugur, ${A.heroName()}!`, "good"); if (this.tutorial) this.hint("⬅️ ➡️ Suring — yo'lak almashtirish", 2600); }
        return;
      }
      if (ph === "run" || ph === "brake") this.updateRun(dt);
      else if (ph === "question" || ph === "cross" || ph === "accident") this.updateCrossing(dt);
      else if (ph === "home") this.updateHome(dt);
      else if (ph === "fall") this.updateFall(dt);
      this.sparks.update(dt);
    },
    advance(d) {
      this.travel += d;
      this.world.position.z = this.travel;
      // recycle street blocks that went behind the camera
      for (const c of this.chunks) {
        if (this.travel - (c.i + 1) * CHUNK > BEHIND) { c.i += NCHUNK; c.g.position.z = -c.i * CHUNK; }
        // at the crossing the houses step back (its corners bring their own pavement); past the home garden nothing is left
        const z0 = c.i * CHUNK;
        c.env.visible = !(this.crossing && z0 + CHUNK > this.crossing.cz - 4 && z0 < this.crossing.cz + 4);
        c.g.visible = !(this.home && z0 > this.home.hz - 2);
      }
      this.items = this.items.filter((it) => {
        if (this.travel - it.z > BEHIND) { this.world.remove(it.obj); return false; }
        return true;
      });
      if (this.crossing && this.travel - this.crossing.cz > 30 && this.phase === "run") { this.world.remove(this.crossing.g); this.crossing = null; }
    },
    updateRun(dt) {
      const [v0, v1] = SPEED[this.level] || SPEED.A1;
      let target = v0 + (v1 - v0) * Math.min(1, (this.rightCount() * PER_LIGHT + this.group) / 80);
      if (this.stumble > 0) target *= 0.55;
      if (this.phase === "brake") {
        // braking smoothly to the stop line of a red light, or to the garden gate at home
        const stop = this.pending === "home" ? this.home.stopZ : this.crossing.stop;
        const d = stop - this.travel;
        target = Math.max(0, Math.min(target, Math.sqrt(Math.max(0, 2 * 9 * d))));
        if (d < 0.05) { this.speed = 0; this.advance(Math.max(0, d)); this.atStop(); return; }
      }
      this.speed += (target - this.speed) * Math.min(1, dt * (this.phase === "brake" ? 6 : 1.5));
      this.advance(this.speed * dt);
      if (this.phase === "run") this.generate(this.travel + AHEAD);
      if (this.phase === "run" && this.pending === "crossing" && this.crossing && this.crossing.stop - this.travel < 18) { this.phase = "brake"; this.banner("🚦 Qizil chiroq!", "bad"); }
      if (this.phase === "run" && this.pending === "home" && this.home && this.home.stopZ - this.travel < 16) this.phase = "brake";
      // the player: lanes, jump, slide
      this.px += (LANES[this.lane] - this.px) * Math.min(1, dt * 11);
      this.vy -= GRAVITY * dt;
      this.py = Math.max(0, this.py + this.vy * dt);
      if (this.py === 0 && this.vy < 0) this.vy = 0;
      if (this.sliding > 0) this.sliding -= dt;
      if (this.stumble > 0) this.stumble -= dt;
      if (this.invuln > 0) this.invuln -= dt;
      if (this.magnet > 0) this.magnet -= dt;
      if (this.shieldT > 0) this.shieldT -= dt;
      this.collide(dt);
      this.tutor();
      this.powerHud();
    },
    collide(dt) {
      const top = this.sliding > 0 ? 0.95 : 1.75;
      for (const it of this.items) {
        if (!it.alive) continue;
        const wz = this.travel - it.z; // below 0: still ahead
        if (it.type === "coin" || it.type === "power") {
          it.obj.rotation.y = it.type === "coin" ? Math.sin(this.t * 2.2 + it.z) * 0.45 : this.t * 2;
          // the magnet pulls word coins in from every lane
          if (it.type === "coin" && this.magnet > 0 && wz > -14 && wz < 1) {
            it.obj.position.x += (this.px - it.obj.position.x) * Math.min(1, dt * 6);
            it.y += ((this.py + 1.0) - it.y) * Math.min(1, dt * 5);
          }
          it.obj.position.y = it.y + Math.sin(this.t * 3 + it.z) * 0.08;
          if (Math.abs(wz) < 0.7 && Math.abs(it.obj.position.x - this.px) < 0.9 && Math.abs(it.obj.position.y - (this.py + 1.0)) < 1.2) {
            it.alive = false;
            this.world.remove(it.obj);
            if (it.type === "coin") this.collect(it); else this.powerUp(it);
          }
          continue;
        }
        if (Math.abs(wz) > 0.8 || Math.abs(LANES[it.lane] - this.px) > 0.95) continue;
        const clear = it.type === "low" ? this.py > 0.72 : it.type === "high" ? top < 1.1 : false;
        if (clear) continue;
        it.alive = false;
        this.knock(it);
        if (this.shieldT > 0 || this.invuln > 0) continue;
        this.hit();
      }
    },
    knock(it) {
      // the obstacle tumbles out of the road
      const o = it.obj, side = this.px <= 0 ? 1 : -1;
      let k = 0;
      const step = () => {
        if (!this.root || !o.parent) return;
        k += 0.06;
        o.position.x += side * 0.2; o.position.y = Math.sin(Math.min(1, k) * Math.PI) * 1.2; o.rotation.z += side * 0.14;
        if (k < 1) setTimeout(step, 16); else this.world.remove(o);
      };
      step();
      A.sfx.bump();
    },
    hit() {
      this.hearts--;
      this.stumble = 0.7;
      this.invuln = 2.0;
      A.haptic("err");
      this.sparks.burst(this.px, this.py + 1.2, -0.5, "#ffffff", 18, 3, 0.5, 4);
      this.hud();
      if (this.hearts <= 0) { this.phase = "fall"; this.t2 = 0; A.sfx.wrong(); this.banner("Voy! Yuraklar tugadi", "bad"); }
      else this.banner(`Ehtiyot bo'ling! ♥ ${this.hearts}`, "bad");
    },
    collect(it) {
      this.coins.push(it.word);
      this.group++;
      A.sfx.coin();
      const p = it.obj.position;
      this.sparks.burst(p.x, p.y, -0.6, "#ffd34d", 22, 3.2, 0.6, 5);
      const w = A.word(it.word);
      if (w) this.floatWord(`${w.en} — ${w.uz}`);
      this.hud();
      if (this.group >= PER_LIGHT && !this.pending) this.queueCrossing();
    },
    powerUp(it) {
      A.sfx.power();
      A.haptic("ok");
      const p = it.obj.position;
      this.sparks.burst(p.x, p.y, -0.6, it.kind === "heart" ? "#ff5a7a" : it.kind === "shield" ? "#6fc8ff" : "#ff7a5a", 26, 3.5, 0.7, 4);
      if (it.kind === "heart") { this.hearts = Math.min(HEARTS, this.hearts + 1); this.banner("+1 yurak ♥", "good"); }
      if (it.kind === "magnet") { this.magnet = 10; this.banner("🧲 Magnit: tangalar o'zi keladi!", "good"); }
      if (it.kind === "shield") { this.shieldT = 8; this.banner("🛡️ Qalqon!", "good"); }
      this.hud();
    },
    tutor() {
      // the first run: when an obstacle of a new kind comes near in his lane, time slows and a hint says what to do
      if (!this.tutorial || this.slowFor) return;
      const next = this.items.find((it) => it.alive && ["low", "high", "block"].includes(it.type) && it.z - this.travel < 12 && it.z - this.travel > 3 && it.lane === this.lane);
      if (!next || this.tutorial[next.type]) return;
      this.tutorial[next.type] = true;
      const say = { low: ["⬆️ Yuqoriga suring — sakrang!", "jump"], high: ["⬇️ Pastga suring — engashib o'ting!", "slide"], block: ["⬅️ ➡️ Boshqa yo'lakka o'ting!", "side"] }[next.type];
      this.slowFor = { need: say[1] };
      this.hint(say[0], 2400);
      setTimeout(() => { this.slowFor = null; }, 2400);
      if (this.tutorial.low && this.tutorial.high && this.tutorial.block) { try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch (e) { /* private mode */ } this.tutorial = null; }
    },
    atStop() {
      if (this.pending === "home") { this.phase = "home"; this.t2 = 0; return; }
      this.phase = "question";
      this.t2 = 0;
      this.showQuestion();
    },

    // ---------------------------------------------------------------- the red light
    showQuestion() {
      const q = this.questions[this.answers.length];
      if (!q) { this.finishRun("quit"); return; }
      this.q = q;
      this.locked = false;
      const wrap = document.createElement("div");
      wrap.className = "ac-q-wrap wr3-q";
      wrap.innerHTML = `<div class="ac-q" role="group" aria-label="Grammatika savoli">
        <span class="ac-q-tag">🚦 Qizil chiroq · ${this.answers.length + 1}/${LIGHTS}-savol</span>
        <div class="ac-q-text">${esc(q.q).replace("___", "<b>___</b>")}</div>
        <div class="ac-opts">${q.o.map((o, i) => `<button type="button" class="ac-opt" data-opt="${i}">${esc(o)}</button>`).join("")}</div>
        <div class="ac-why" hidden></div></div>`;
      this.root.appendChild(wrap);
      this.qEl = wrap;
      wrap.addEventListener("click", (ev) => { const b = ev.target.closest("[data-opt]"); if (b) this.answer(+b.dataset.opt); });
    },
    answer(i) {
      if (this.locked || this.phase !== "question" || this.paused) return;
      this.locked = true; // one answer per light
      const q = this.q, ok = i === q.a;
      this.answers.push({ q: q.id, c: i });
      A.askedQuestion(q.id);
      this.qEl.querySelectorAll("[data-opt]").forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add("is-right"); else if (k === i) b.classList.add("is-wrong"); });
      this.hud();
      // the run is decided here (a wrong answer, or the tenth right one): report it now, before the animation
      if (!ok || this.answers.length >= LIGHTS) { A.Ckpt.clear("wordrun"); A.finishSession(this.s, { coins: this.coins, answers: this.answers }); }
      if (ok) {
        A.sfx.right();
        A.haptic("ok");
        this.setLight("green");
        this.banner("To'g'ri! Yashil chiroq", "good");
        if (this.answers.length < LIGHTS) this.checkpoint();
        setTimeout(() => { if (this.root && this.phase === "question") { this.removeQuestion(); this.phase = "cross"; this.t2 = 0; } }, 900);
      } else {
        A.sfx.wrong();
        A.haptic("err");
        const why = this.qEl.querySelector(".ac-why");
        why.hidden = false;
        why.innerHTML = `Noto'g'ri. To'g'ri javob: <b>${esc(q.o[q.a])}</b>. ${esc(q.why)}`;
        this.banner("Noto'g'ri javob", "bad");
        setTimeout(() => { if (this.root && this.phase === "question") this.startAccident(); }, 2300);
      }
    },
    removeQuestion() { if (this.qEl) { this.qEl.remove(); this.qEl = null; } },
    startAccident() {
      this.removeQuestion();
      this.phase = "accident";
      this.t2 = 0;
      this.hitDone = false;
      // the blue car in the near lane comes now; it meets him when he steps into its lane
      const car = this.crossing.cars[0];
      car.x = -30; car.wait = 0; car.speed = 16; car.crash = true;
      this.crossing.cars[1].x = 40; // the other car is out of the way
      setTimeout(() => A.sfx.honk(), 600);
    },
    updateCrossing(dt) {
      const C = this.crossing;
      this.t2 += dt;
      // cars: across and round again while the light is red; on green they stop short of the zebra
      for (const c of C.cars) {
        if (c.wait > 0) { c.wait -= dt; continue; }
        let sp = c.speed;
        if (C.state === "green" && !c.crash) {
          const front = c.x + c.dir * 1.8, edge = -c.dir * 3.6;
          const before = c.dir > 0 ? front < edge : front > edge;
          if (before) sp = Math.max(0, Math.min(sp, Math.abs(edge - front) * 3));
        }
        c.x += c.dir * sp * dt;
        if (this.phase === "question" && (c.x > 30 || c.x < -30)) { c.x = -c.dir * 30; c.wait = 0.4 + Math.random() * 1.2; }
        c.mesh.position.x = c.x;
      }
      const P = this.player;
      if (this.phase === "question") {
        P.pose(this.t2 > 0.5 ? "think" : "idle", this.t);
        P.root.rotation.set(0, 0, 0);
      } else if (this.phase === "cross") {
        const sp = Math.min(4.5, 1 + this.t2 * 2.5); // across the zebra, then off again
        this.advance(sp * dt);
        P.pose(sp < 3 ? "walk" : "run", this.t, { speed: sp < 3 ? 7 : 10 });
        if (this.travel > C.cz + 5) {
          this.pending = null;
          this.group = 0;
          this.phase = "run";
          this.speed = sp;
          if (this.rightCount() >= LIGHTS) this.goHome();
          this.banner(this.rightCount() >= LIGHTS ? "Uy ko'rinyapti!" : "Yana 10 ta tanga!", "good");
          this.hud();
        }
      } else if (this.phase === "accident") {
        const car = C.cars[0];
        if (!this.hitDone) {
          // he steps onto the road against the red light, into the near lane, where the car meets him
          if (this.travel < C.cz - 1.9) { this.advance(2.4 * dt); P.pose("walk", this.t, { speed: 6 }); }
          else P.pose("stumble", this.t);
          if (car.x + 1.75 >= this.px - 0.3 && this.travel >= C.cz - 2.4) {
            this.hitDone = true;
            this.fly = { t: 0, vx: 4.2, vy: 8.5, x: this.px, y: 0.2, rot: 0 };
            this.slowmo = 0.8;
            A.sfx.crash();
            A.haptic("err");
            this.shake = 0.45;
            this.sparks.burst(this.px, 1.2, 0, "#ffffff", 40, 5, 0.7, 2);
          }
        } else {
          const f = this.fly;
          f.t += dt;
          f.vy -= 9 * dt;
          f.x += f.vx * dt; f.y += f.vy * dt; f.rot += dt * 7;
          P.pose("fly", this.t);
          if (Math.floor(f.t * 12) % 3 === 0) this.sparks.burst(f.x, f.y + 1, 0, "#ffe066", 2, 1, 0.5, 0); // cartoon stars
          if (f.t > 2.4 && !this.over) { this.over = true; this.finishRun("lose"); }
        }
      }
    },
    goHome() {
      // after the tenth light: a short street, then his house across the end of it
      const hz = this.travel + 64;
      this.items = this.items.filter((it) => { if (it.z > this.travel + 10) { this.world.remove(it.obj); return false; } return true; });
      this.genZ = hz + 999; // no more obstacles or coins: 100 coins are in
      this.buildHome(hz);
      this.pending = "home";
    },
    updateHome(dt) {
      this.t2 += dt;
      const H = this.home, P = this.player;
      // up the garden path to the door; the door opens, warm light, in he goes
      const doorZ = H.hz + 0.6;
      if (this.travel < doorZ - 0.05 && !this.inside) { this.advance(Math.min(2.4, (doorZ - this.travel) * 2 + 0.6) * dt); P.pose("walk", this.t, { speed: 6 }); }
      else if (!this.inside) {
        P.pose("cheer", this.t);
        H.door.rotation.y = Math.max(H.door.rotation.y - dt * 2.2, -1.6);
        H.glow.intensity = Math.min(16, H.glow.intensity + dt * 30);
        if (H.door.rotation.y <= -1.55) {
          this.inside = true;
          this.t3 = 0;
          this.sparks.burst(0, 2.4, -1.4, "#ffd34d", 60, 5, 1.4, 3);
          this.sparks.burst(0, 2.4, -1.4, "#ff7ab0", 40, 4, 1.2, 3);
          A.sfx.finish();
          setTimeout(() => this.arrival(), 1600);
        }
      } else {
        this.t3 += dt;
        P.pose("walk", this.t, { speed: 6 });
        if (this.t3 > 0.4) this.advance(1.3 * dt);
        if (this.travel > H.hz + 1.3) P.root.visible = false;
      }
      this.px += (0 - this.px) * Math.min(1, dt * 3);
    },
    arrival() {
      if (!this.root) return;
      const el = A.overlay(this.root, `<div class="wr-arrive">${A.shk("celebrate", 110)}<h3>✨ Uyga yetdingiz! ✨</h3><p>${esc(ADDRESS)}</p>
        <div class="wr-arrive-row"><span class="ac-pill">${A.ICON.coin}${this.coins.length} ta so'z tangasi</span><span class="ac-pill">${this.coins.length * 10} ball</span></div>
        ${A.btn("Natijalar", 'data-ac="results"', "is-primary is-wide")}</div>`, "is-clear is-top");
      A.paintShk(el);
      el.addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="results"]')) { el.remove(); this.finishRun("win"); } });
    },
    updateFall(dt) {
      this.t2 += dt;
      this.player.pose("stumble", this.t);
      this.player.body.rotation.x = -Math.min(1.4, this.t2 * 3);
      this.player.body.position.y = -Math.min(0.5, this.t2 * 0.8);
      this.speed = Math.max(0, this.speed - dt * 20);
      this.advance(this.speed * dt);
      if (this.t2 > 1.4 && !this.over) { this.over = true; this.finishRun("fall"); }
    },

    // ---------------------------------------------------------------- drawing the frame
    render() {
      const st = this.st, P = this.player, THREE = this.THREE;
      if (!st) return;
      const ph = this.phase;
      if (ph === "run" || ph === "brake") {
        if (this.stumble > 0.2) P.pose("stumble", this.t);
        else if (this.py > 0.02) P.pose("jump", this.t, { k: Math.min(1, Math.max(0, 0.5 - this.vy / (2 * JUMP_V))) });
        else if (this.sliding > 0) P.pose("slide", this.t);
        else if (this.speed < 0.5) P.pose("idle", this.t);
        else P.pose("run", this.t, { speed: 5 + this.speed * 0.75 });
        P.root.rotation.set(0, 0, (this.px - LANES[this.lane]) * 0.18);
        P.root.visible = !(this.invuln > 0 && Math.floor(this.invuln * 12) % 2 === 0);
      }
      let px = this.px, py = this.py;
      if (ph === "accident" && this.fly) { px = this.fly.x; py = this.fly.y; P.root.rotation.set(this.fly.rot * 0.4, 0, -this.fly.rot); }
      P.root.position.set(px, py, 0);
      this.shield.visible = this.shieldT > 0 && ph === "run";
      if (this.shield.visible) { this.shield.position.set(px, py + 0.95, 0); this.shield.material.opacity = 0.16 + 0.08 * Math.sin(this.t * 8); }
      // camera: facing him in the menu, behind him while running, higher at a light, wide at home
      const cam = st.camera;
      let pos, look;
      if (ph === "menu" || ph === "loading") { pos = new THREE.Vector3(0.8, 1.3, -3.9); look = new THREE.Vector3(0, 0.25, 0); }
      else if (ph === "intro") {
        const k = Math.min(1, this.t / 1.1), e = k * k * (3 - 2 * k);
        const a = e * Math.PI; // round him in a half circle, ending behind him
        pos = new THREE.Vector3(Math.sin(a) * 3.2 + 0.8 * (1 - e), 1.3 + e * 1.45, -3.9 * Math.cos(a) + e * 1.1); look = new THREE.Vector3(0, 0.25 + e * 0.9, -e * 8);
      } else if (ph === "question") { pos = new THREE.Vector3(px * 0.5, 3.7, 6.6); look = new THREE.Vector3(px * 0.4, 1.9, -8); }
      else if (ph === "accident") { // a fixed camera that looks up after him as he flies off
        const f = this.fly;
        pos = new THREE.Vector3(this.px * 0.5 - 1.2, 3.2, 7.4);
        look = f ? new THREE.Vector3(f.x * 0.7, 1.4 + f.y * 0.75, -3) : new THREE.Vector3(this.px * 0.4 - 1.5, 1.4, -4);
      }
      else if (ph === "home") { pos = new THREE.Vector3(1.8, 3.4, 8.2); look = new THREE.Vector3(0, 2.7, -6); }
      else { pos = new THREE.Vector3(px * 0.75, 2.75 + py * 0.3, 5.0); look = new THREE.Vector3(px * 0.6, 1.15 + py * 0.25, -8); }
      if (!this.camPos) { this.camPos = pos.clone(); this.camLook = look.clone(); }
      const lerp = ph === "intro" ? 1 : 0.07;
      this.camPos.lerp(pos, lerp);
      this.camLook.lerp(look, lerp);
      cam.position.copy(this.camPos);
      if (this.shake > 0) { this.shake = Math.max(0, this.shake - 0.016); cam.position.x += (Math.random() - 0.5) * this.shake; cam.position.y += (Math.random() - 0.5) * this.shake; }
      cam.lookAt(this.camLook);
      const fov = (st.w < st.h ? 66 : 58) + Math.min(10, (this.speed || 0) * 0.45);
      if (Math.abs(cam.fov - fov) > 0.05) { cam.fov += (fov - cam.fov) * 0.1; cam.updateProjectionMatrix(); }
      this.sun.position.set(px - 5, 11, 5); // the sun follows him so his shadow stays sharp
      this.sun.target.position.set(px, 0, -3);
      st.render();
    },

    // ---------------------------------------------------------------- the end
    finishRun(outcome) {
      if (this.phase === "results") return;
      this.removeQuestion();
      this.phase = "results";
      this.outcome = outcome;
      A.Ckpt.clear("wordrun");
      A.finishSession(this.s, { coins: this.coins, answers: this.answers }, !this.coins.length && !this.answers.length);
      this.results();
    },
    results() {
      const right = this.rightCount();
      const win = this.outcome === "win";
      const title = win ? "Uyga yetdingiz!" : this.outcome === "lose" ? "Voy! Qizil chiroqda shoshildingiz" : this.outcome === "fall" ? "Yuraklar tugadi" : "O'yin tugadi";
      const name = esc(A.heroName());
      const sub = win ? `${esc(ADDRESS)} — ${name} uyida!` : `Unga hech narsa bo'lmadi — ${name} kulib, yana yugurishga tayyor.`;
      const el = A.overlay(this.root, `<div class="ac-results ac-start">${A.shk(win ? "celebrate" : "encourage", 120)}
        <h3>${title}</h3><p>${sub}</p>
        <div class="ac-stats"><div class="ac-stat"><small>So'z tangalari</small><b>${this.coins.length}</b></div>
          <div class="ac-stat"><small>O'yin ballari (10 × tanga)</small><b>${this.coins.length * 10}</b></div>
          <div class="ac-stat"><small>Grammatika</small><b>${right}/${this.answers.length}</b></div>
          <div class="ac-stat"><small>Yangi so'z bonusi</small><b data-ac="bonus">0</b></div></div>
        <p class="ac-receipt" data-ac="receipt"></p>
        <div data-ac="words"></div>
        <div class="ac-actions">${A.btn("Qayta o'ynash", 'data-ac="again"', "is-primary")}${A.btn("Lug'at", 'data-ac="dict"')}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      A.paintShk(el);
      A.receiptLine(el.querySelector('[data-ac="receipt"]'), this.s);
      A.wordList(el.querySelector('[data-ac="words"]'), this.s, this.coins);
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "again") { el.remove(); this.begin(null); }
        else if (b.dataset.ac === "dict") A.openDictionary();
        else if (b.dataset.ac === "exit") A.close();
      });
    },
    pause() {
      if (this.paused || !["run", "brake", "question", "cross", "accident", "home", "fall", "intro"].includes(this.phase)) return;
      this.paused = true;
      A.pauseMenu(this.root, {
        resume: () => { this.paused = false; this.last = performance.now(); },
        restart: () => { this.paused = false; this.endEarly(); this.begin(null); },
        exit: () => { this.paused = false; this.endEarly(); A.close(); },
      });
    },
    // leaving in the middle: what was collected is reported and kept
    endEarly() {
      this.removeQuestion();
      this.phase = "results";
      A.Ckpt.clear("wordrun");
      A.finishSession(this.s, { coins: this.coins, answers: this.answers }, !this.coins.length && !this.answers.length);
      this.root.querySelectorAll(".ac-overlay").forEach((o) => o.remove());
    },

    // ---------------------------------------------------------------- HUD bits
    hud() {
      if (!this.root) return;
      const set = (k, v) => { const el = this.root.querySelector(`[data-hud-v="${k}"]`); if (el) el.innerHTML = v; };
      set("coins", this.coins.length);
      set("group", `${Math.min(PER_LIGHT, this.group)}/${PER_LIGHT}`);
      set("lights", `${this.rightCount()}/${LIGHTS}`);
      set("hearts", [0, 1, 2].map((i) => `<i class="${i < this.hearts ? "is-on" : ""}" aria-hidden="true">♥</i>`).join(""));
      const h = this.root.querySelector('[data-hud-v="hearts"]');
      if (h) h.setAttribute("aria-label", `${this.hearts} ta yurak`);
    },
    powerHud() {
      const el = this.root && this.root.querySelector('[data-hud-v="power"]');
      if (!el) return;
      const parts = [];
      if (this.magnet > 0) parts.push(`🧲 ${Math.ceil(this.magnet)}`);
      if (this.shieldT > 0) parts.push(`🛡️ ${Math.ceil(this.shieldT)}`);
      const txt = parts.join(" · ");
      if (el.textContent !== txt) { el.textContent = txt; el.hidden = !txt; }
    },
    floatWord(text) {
      const el = document.createElement("div");
      el.className = "wr3-word";
      el.textContent = text;
      this.root.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    },
    hint(text, ms) {
      const el = this.root && this.root.querySelector("[data-hint]");
      if (!el) return;
      el.textContent = text;
      el.hidden = false;
      clearTimeout(this.hintT);
      this.hintT = setTimeout(() => { el.hidden = true; }, ms || 2000);
    },
    banner(text, kind) {
      const el = this.root && this.root.querySelector("[data-banner]");
      if (!el) return;
      el.textContent = text;
      el.className = "ac-banner is-on is-" + (kind || "good");
      clearTimeout(this.bannerT);
      this.bannerT = setTimeout(() => { el.className = "ac-banner"; }, 1400);
    },
  };

  A.register("wordrun", G);
})(window, document);
