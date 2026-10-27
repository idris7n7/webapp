/* Penalti (L1_Arcade game "penalty"): grammar questions as penalty kicks in a 3D stadium, 10 rounds.
 *
 * Pick a kicker (one of the six heroes, boys and girls, in a team kit) and a goalkeeper (made-up). Each round: a grammar question over the
 * dimmed stadium; the student picks an answer (a draft, nothing is scored) and presses "Tayyorman!". The referee
 * whistles, the same three answers appear on the left, middle and right of the goal, and the student swipes the ball
 * to one of them (or taps it, or presses 1/2/3). That one final choice is scored: right = a goal the keeper cannot reach,
 * wrong = the keeper saves. Then the right answer and a short rule. Goals, saves, answers and accuracy are kept apart.
 * Everything is real-time 3D (three.js via L1_3D): pitch, goal and net, stands with a crowd, floodlights, players.
 */
(function (window, document) {
  "use strict";
  const A = window.L1_Arcade;
  if (!A) return;
  const esc = A.esc;
  const ROUNDS = 10;
  const GOAL_W = 7.32, GOAL_H = 2.44, SPOT_Z = 11;
  // The kickers are the six heroes (L1_Arcade.HEROES) in their team kits; ids 1..6 are what the server keeps.
  const KIT_NAMES = { aziz: "ko'k forma", malika: "pushti forma", timur: "qizil forma", laylo: "sariq forma", sardor: "yashil forma", nilufar: "to'q sariq forma" };
  const KICKERS = A.HEROES.map((h, i) => ({ id: i + 1, hero: h.id, name: h.name, kit: KIT_NAMES[h.id] || "forma", number: [7, 9, 11, 10, 8, 17][i] }));
  const kickerOf = (id) => KICKERS[id - 1] || KICKERS[0];
  const KEEPERS = [
    { id: 1, name: "Chaqqon qo'llar", kit: "binafsha forma", look: { kit: "keeper", shirt: "#7b4fd6", shorts: "#2a2250", socks: "#7b4fd6", skin: "#f1c9a5", hair: "#3b2416", hairStyle: "ponytail", accent: "#ffd23f", glove: "#ffe066" } },
    { id: 2, name: "Yashil qo'lqop", kit: "yashil forma", look: { kit: "keeper", shirt: "#3aa05a", shorts: "#1e2a22", socks: "#3aa05a", skin: "#f0c4a0", hair: "#5a3a22", hairStyle: "curly", glasses: true, glove: "#e9f7d8" } },
    { id: 3, name: "Uzun qo'l", kit: "ko'k forma", look: { kit: "keeper", shirt: "#2f68c8", shorts: "#1d2b52", socks: "#2f68c8", skin: "#f4d0b4", hair: "#d9532b", hairStyle: "swept", glove: "#ffe066" } },
    { id: 4, name: "Temir devor", kit: "to'q sariq forma", look: { kit: "keeper", shirt: "#f08a2a", shorts: "#2b2b2b", socks: "#f08a2a", skin: "#e8b48e", hair: "#2a1e16", hairStyle: "short", glove: "#ffffff" } },
  ];
  const SIDES = ["chap", "o'rta", "o'ng"];

  const G = {
    open(root) {
      this.root = root;
      Object.assign(this, { phase: "loading", paused: false, raf: 0, t: 0, rounds: [], kicker: Math.max(1, A.HEROES.findIndex((h) => h.id === A.heroId()) + 1), keeper: 1, cheer: 0, camPos: null, kickerFig: null, keeperFig: null });
      root.innerHTML = `<div class="ac-stage" data-stage></div><div class="pk3-dim" data-dim hidden></div>
        <div class="pk-page" data-page hidden></div><div data-targets></div>
        <div class="pk-aimhint" data-aimhint hidden></div>
        <div class="ac-hud"><span class="ac-pill is-title">Penalti</span><span class="ac-pill" data-hud="round" hidden></span>
          <span class="ac-pill" data-hud="score" hidden></span><span class="ac-hud-fill"></span>${A.hudButtons()}</div>
        <div class="ac-banner" data-banner></div>`;
      this.page = root.querySelector("[data-page]");
      this.stageEl = root.querySelector("[data-stage]");
      root.querySelector(".ac-hud").addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "mute") A.toggleMute(b);
        if (b.dataset.ac === "pause") this.pause();
      });
      const el = A.overlay(root, `<div class="ac-loading"><div class="ac-spinner" aria-hidden="true"></div><b>Penalti</b><span>Stadion qurilmoqda…</span></div>`, "is-loading");
      Promise.all([A.need3D(), A.load(["penalty/whistle.webp"])]).then(() => {
        el.remove();
        if (!this.root) return;
        if (!window.L1_3D.supported()) { this.no3D(); return; }
        try { this.build(); } catch (e) { console.error(e); this.no3D(); return; }
        this.bindAim();
        this.last = performance.now();
        this.raf = requestAnimationFrame((t) => this.loop(t));
        this.startScreen();
      }, () => {
        el.remove();
        A.overlay(root, `<h3>Yuklanmadi</h3><p>Internet aloqasini tekshirib, qayta urinib ko'ring.</p>
          <div class="ac-actions">${A.btn("Chiqish", 'data-ac="exit"', "is-primary")}</div>`).addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="exit"]')) A.close(); });
      });
    },
    no3D() {
      A.overlay(this.root, `<h3>3D ishlamayapti</h3><p>Bu qurilma yoki brauzer 3D grafikani (WebGL) qo'llamaydi.</p>
        <div class="ac-actions">${A.btn("Chiqish", 'data-ac="exit"', "is-primary")}</div>`).addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="exit"]')) A.close(); });
    },
    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener("keydown", this.onKey);
      clearTimeout(this.timer);
      if (this.st) { try { this.st.dispose(); } catch (e) { /* gone */ } }
      this.st = null;
      this.root = null;
    },
    onBack() {
      if (["question", "whistle", "aim", "shot", "explain"].includes(this.phase) && !this.paused) { this.pause(); return true; }
      return false;
    },

    // ---------------------------------------------------------------- the stadium
    build() {
      const D = window.L1_3D, THREE = window.THREE;
      this.D = D; this.THREE = THREE;
      const st = this.st = D.stage(this.stageEl, { fov: 34, far: 400, maxDpr: 1.6, envIntensity: 0.6 });
      D.curve.value = 0;
      D.sky(st.scene, "#3f8fe8", "#cfe6ff", { radius: 300 });
      st.scene.add(new THREE.HemisphereLight("#d6ecff", "#6a9a4a", 1.05));
      const sun = this.sun = new THREE.DirectionalLight("#fff3dc", 2.4);
      sun.position.set(-12, 22, 18);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 2, far: 70 });
      sun.target.position.set(0, 0, 6);
      st.scene.add(sun, sun.target);
      this.buildPitch();
      this.buildGoal();
      this.buildStands();
      this.ball = this.makeBall();
      st.scene.add(this.ball);
      this.ref = D.person({ shirt: "#1b1b1b", shorts: "#1b1b1b", socks: "#1b1b1b", skin: "#d9a77c", hair: "#2a1a10", hairStyle: "short", trim: "#f2c52a" });
      this.ref.root.position.set(5.5, 0, 12.5);
      this.ref.root.rotation.y = Math.PI + 0.6;
      st.scene.add(this.ref.root);
      this.sparks = D.Sparks(st.scene, 300, false);
      this.lineup = [];
    },
    buildPitch() {
      const THREE = this.THREE, D = this.D, st = this.st;
      // grass with mowing stripes, and the lines of the penalty area painted on a second texture
      const c = document.createElement("canvas");
      c.width = 64; c.height = 512;
      const g = c.getContext("2d");
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#4f9e3b" : "#5aad44"; g.fillRect(0, i * 64, 64, 64); }
      for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${30 + Math.random() * 40},${90 + Math.random() * 60},30,.25)`; g.fillRect(Math.random() * 64, Math.random() * 512, 1, 2); }
      const tex = D.pictureTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(30, 3);
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(140, 110), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
      grass.rotation.x = -Math.PI / 2;
      grass.position.z = 30;
      grass.receiveShadow = true;
      st.scene.add(grass);
      const L = document.createElement("canvas");
      L.width = 1024; L.height = 512; // 51.2 m x 25.6 m in front of the goal: 20 px a metre
      const l = L.getContext("2d");
      l.strokeStyle = "rgba(255,255,255,.95)"; l.lineWidth = 3;
      const X = (x) => 512 + x * 20, Z = (z) => z * 20;
      l.beginPath(); l.moveTo(0, Z(0.06)); l.lineTo(1024, Z(0.06)); l.stroke();
      l.strokeRect(X(-20.16), Z(0), 40.32 * 20, 16.5 * 20);
      l.strokeRect(X(-9.16), Z(0), 18.32 * 20, 5.5 * 20);
      l.beginPath(); l.arc(X(0), Z(11), 9.15 * 20, 0.2 * Math.PI, 0.8 * Math.PI); l.stroke();
      l.fillStyle = "#ffffff"; l.beginPath(); l.arc(X(0), Z(SPOT_Z), 5, 0, Math.PI * 2); l.fill();
      const lines = new THREE.Mesh(new THREE.PlaneGeometry(51.2, 25.6), new THREE.MeshStandardMaterial({ map: D.pictureTexture(L), transparent: true, roughness: 0.9, depthWrite: false }));
      lines.rotation.x = -Math.PI / 2;
      lines.position.set(0, 0.012, 12.8);
      lines.receiveShadow = true;
      st.scene.add(lines);
    },
    buildGoal() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape, st = this.st;
      const parts = [];
      const r = 0.07, depth = 2.0;
      [-GOAL_W / 2, GOAL_W / 2].forEach((x) => {
        parts.push(P(S("cyl"), "#ffffff", [x, GOAL_H / 2, 0], null, [r * 2, GOAL_H, r * 2]));
        parts.push(P(S("cyl"), "#e6e6e6", [x, GOAL_H * 0.6 / 2, -depth], null, [0.05, GOAL_H * 0.6, 0.05]));
        parts.push(P(S("cyl"), "#e6e6e6", [x, GOAL_H * 0.8, -depth / 2], [Math.atan2(depth, GOAL_H * 0.4) + Math.PI / 2, 0, 0], [0.05, Math.hypot(depth, GOAL_H * 0.4), 0.05]));
      });
      parts.push(P(S("cyl"), "#ffffff", [0, GOAL_H, 0], [0, 0, Math.PI / 2], [r * 2, GOAL_W + r * 2, r * 2]));
      parts.push(P(S("cyl"), "#e6e6e6", [0, 0.04, -depth], [0, 0, Math.PI / 2], [0.05, GOAL_W, 0.05]));
      const frame = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.35 }));
      frame.castShadow = true;
      st.scene.add(frame);
      // the net: a grid of lines over the back, roof and sides; it bulges where a goal goes in
      const pts = [];
      const step = 0.22;
      const back = (u, v) => [u, v * GOAL_H * 0.6, -depth];
      const roof = (u, v) => [u, GOAL_H * (0.6 + 0.4 * v), -depth * (1 - v)];
      for (let x = -GOAL_W / 2; x <= GOAL_W / 2 + 1e-6; x += step) {
        for (let v = 0; v < 1; v += step / 1.5) { pts.push(...back(x, v), ...back(x, Math.min(1, v + step / 1.5))); pts.push(...roof(x, v), ...roof(x, Math.min(1, v + step / 1.5))); }
      }
      for (let v = 0; v <= 1 + 1e-6; v += step / 1.5) for (let x = -GOAL_W / 2; x < GOAL_W / 2; x += step) {
        pts.push(...back(x, v), ...back(Math.min(GOAL_W / 2, x + step), v));
        pts.push(...roof(x, v), ...roof(Math.min(GOAL_W / 2, x + step), v));
      }
      [-GOAL_W / 2, GOAL_W / 2].forEach((x) => {
        const top = (z) => GOAL_H * 0.6 + GOAL_H * 0.4 * (1 - z / depth);
        for (let zz = 0; zz <= depth + 1e-6; zz += step) for (let y = 0; y < GOAL_H; y += step) {
          if (y > top(zz)) continue;
          pts.push(x, y, -zz, x, Math.min(top(zz), y + step), -zz);
          if (zz + step <= depth + 1e-6) pts.push(x, y, -zz, x, y, -(zz + step));
        }
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      this.netBase = Float32Array.from(pts);
      this.net = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: "#f4f4f4", transparent: true, opacity: 0.75 }));
      st.scene.add(this.net);
      // the three answer panels inside the goal mouth (their text is painted each round)
      this.panels = [0, 1, 2].map((i) => {
        const w = GOAL_W / 3 - 0.18;
        // drawn over the keeper (no depth test) so an answer is never hidden behind him
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.3), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false, depthTest: false }));
        m.position.set(-GOAL_W / 3 + i * GOAL_W / 3, 1.6, -0.25);
        m.visible = false;
        m.renderOrder = 5;
        st.scene.add(m);
        return m;
      });
    },
    buildStands() {
      const THREE = this.THREE, D = this.D, P = D.part, S = D.shape, st = this.st;
      const parts = [];
      // ad boards behind the goal
      const adTex = D.textTexture("LEVEL UP  •  INGLIZ TILI  •  LEVEL UP  •  ENGLISH", { w: 2048, h: 128, bg: "#1f7a4d", color: "#ffffff", size: 74, fit: 0.97 });
      adTex.wrapS = THREE.RepeatWrapping; adTex.repeat.set(2, 1);
      const ads = new THREE.Mesh(new THREE.PlaneGeometry(60, 1.0), new THREE.MeshStandardMaterial({ map: adTex, roughness: 0.6, emissive: "#ffffff", emissiveMap: adTex, emissiveIntensity: 0.35 }));
      ads.position.set(0, 0.5, -4.2);
      st.scene.add(ads);
      // stepped stands behind the goal and on both sides
      for (let k = 0; k < 9; k++) {
        parts.push(P(S("box"), k % 2 ? "#2c3e57" : "#34495f", [0, 0.6 + k * 0.85, -8 - k * 1.3], null, [76, 0.85, 1.3]));
        [-1, 1].forEach((s) => parts.push(P(S("box"), k % 2 ? "#2c3e57" : "#34495f", [s * (30 + k * 1.3), 0.6 + k * 0.85, 22], null, [1.3, 0.85, 56])));
      }
      parts.push(P(S("box"), "#e8edf3", [0, 9.4, -20], null, [80, 1.2, 4]));
      parts.push(P(S("box"), "#1f7a4d", [0, 0.6, -6.2], null, [76, 1.2, 0.3]));
      [[-34, -14], [34, -14], [-38, 46], [38, 46]].forEach(([x, z]) => { // floodlight towers
        parts.push(P(S("cyl"), "#9aa4b0", [x, 11, z], null, [0.6, 22, 0.6]));
        parts.push(P(S("box"), "#cfd6de", [x, 22.5, z], null, [5, 2.6, 0.6]));
      });
      const stand = new THREE.Mesh(D.merge(parts), D.vcMaterial(false, { roughness: 0.8 }));
      stand.receiveShadow = true;
      st.scene.add(stand);
      [[-34, -14], [34, -14], [-38, 46], [38, 46]].forEach(([x, z]) => {
        const lamp = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2), new THREE.MeshBasicMaterial({ color: "#fffbe6" }));
        lamp.position.set(x, 22.5, z + (z < 0 ? 0.32 : -0.32));
        if (z > 0) lamp.rotation.y = Math.PI;
        st.scene.add(lamp);
      });
      // the crowd: one instanced mesh; a shader bump makes it jump when a goal goes in
      const person = D.merge([P(S("box"), "#ffffff", [0, 0.35, 0], null, [0.42, 0.6, 0.3]), P(S("box"), "#f0c8a0", [0, 0.8, 0], null, [0.26, 0.28, 0.26])]); // simple: the crowd is far away
      const cm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
      this.crowdU = { uTime: { value: 0 }, uCheer: { value: 0 } };
      cm.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, this.crowdU);
        sh.vertexShader = "uniform float uTime; uniform float uCheer;\n" + sh.vertexShader.replace("#include <begin_vertex>",
          "#include <begin_vertex>\n#ifdef USE_INSTANCING\n float ph = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * 0.9;\n transformed.y += (0.05 * sin(uTime * 2.0 + ph) + uCheer * max(0.0, sin(uTime * 11.0 + ph)) * 0.45);\n#endif");
      };
      const seats = [];
      for (let k = 0; k < 9; k++) {
        for (let x = -36; x <= 36; x += 0.75) if (Math.random() < 0.8) seats.push([x + (Math.random() - 0.5) * 0.2, 1.05 + k * 0.85, -8 - k * 1.3 + 0.1]);
        [-1, 1].forEach((s) => { for (let z = -4; z <= 48; z += 0.8) if (Math.random() < 0.6) seats.push([s * (30 + k * 1.3), 1.05 + k * 0.85, z]); });
      }
      const crowd = new THREE.InstancedMesh(person, cm, seats.length);
      const m = new THREE.Matrix4(), col = new THREE.Color();
      const shirts = ["#e5484d", "#2f6fd8", "#f2c52a", "#ffffff", "#2e9e4f", "#f07a2a", "#1fa3a3", "#8b5cf6", "#ff7ab0"];
      seats.forEach((p, i) => {
        m.makeRotationY(p[0] > 29 ? -Math.PI / 2 : p[0] < -29 ? Math.PI / 2 : 0);
        m.setPosition(p[0], p[1], p[2]);
        crowd.setMatrixAt(i, m);
        crowd.setColorAt(i, col.set(shirts[Math.floor(Math.random() * shirts.length)]));
      });
      st.scene.add(crowd);
    },
    makeBall() {
      const THREE = this.THREE, D = this.D;
      const c = document.createElement("canvas");
      c.width = 256; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 128);
      g.fillStyle = "#1c1c1c";
      [[32, 64], [96, 30], [96, 98], [160, 64], [224, 30], [224, 98], [0, 20], [256, 20], [128, 0], [128, 128], [64, 128], [192, 0]].forEach(([x, y]) => {
        g.beginPath();
        for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 5; g.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15); }
        g.fill();
      });
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), new THREE.MeshStandardMaterial({ map: D.pictureTexture(c), roughness: 0.4 }));
      ball.castShadow = true;
      return ball;
    },
    // the panels show the answer texts (the same three, in the order of the question, for the whole round)
    paintPanels(q) {
      const D = this.D;
      this.panels.forEach((p, i) => {
        if (p.material.map) p.material.map.dispose();
        p.material.map = D.textTexture(q.o[i], { w: 512, h: 290, bg: "rgba(232,98,30,.86)", round: 30, border: "rgba(255,255,255,.95)", borderW: 14, color: "#ffffff", shadow: "rgba(60,15,0,.75)", size: 96 });
        p.material.opacity = 0.95;
        p.material.needsUpdate = true;
        p.material.color.set("#ffffff");
      });
    },
    // the people standing on the pitch for the choosing screens
    setLineup(list, kind) {
      this.lineup.forEach((f) => this.dropFigure(f));
      this.lineup = list.map((p, i) => {
        const f = kind === "keeper" ? this.makeKeeper(p) : this.makeKicker(p);
        const n = list.length, gap = kind === "keeper" ? 2.0 : 1.35;
        f.root.position.set((i - (n - 1) / 2) * gap, 0, kind === "keeper" ? 0.6 : 14);
        f.id = p.id;
        f.t0 = Math.random() * 3;
        this.st.scene.add(f.root);
        return f;
      });
    },
    makeKeeper(p) { return this.D.figure(Object.assign({}, p.look)); },
    makeKicker(p) { return this.D.figure(this.D.heroKit(p.hero, { number: p.number, numColor: p.hero === "laylo" ? "#5a3a00" : "#ffffff" })); },
    dropFigure(f) {
      this.st.scene.remove(f.root);
      f.root.traverse((ob) => { if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose(); });
    },

    // ---------------------------------------------------------------- start and choosing
    show(html) {
      this.page.hidden = false;
      this.page.innerHTML = html;
      A.paintShk(this.page);
      this.page.scrollTop = 0;
      this.root.querySelector("[data-dim]").hidden = false;
    },
    hidePage() { this.page.hidden = true; this.root.querySelector("[data-dim]").hidden = true; },
    startScreen() {
      this.phase = "start";
      const ck = A.Ckpt.get("penalty");
      this.page.classList.remove("is-bottom");
      this.show(`<div class="pk-pick ac-start">${A.shk("thumbs_up", 120)}<h2>Penalti</h2>
        <ul class="ac-rules"><li>Savolni o'qing, javobni tanlang va «Tayyorman!» tugmasini bosing.</li>
          <li>Hakam hushtak chaladi — javoblar darvozaning chap, o'rta va o'ng tomonida paydo bo'ladi.</li>
          <li>To'pni to'g'ri javob tomonga suring: to'g'ri — GOL, noto'g'ri — darvozabon ushlab qoladi. 10 ta zarba.</li></ul>
        <span class="ac-lvl-line">Daraja: <b>${A.levelName(A.level())}</b></span>
        <div class="ac-actions is-col">${ck ? A.btn(`Davom ettirish (${ck.rounds.length}/${ROUNDS} zarba)`, 'data-ac="resume"', "is-primary") : ""}
          ${A.btn(ck ? "Yangi o'yin" : "Boshlash", 'data-ac="new"', ck ? "" : "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      this.page.onclick = (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "exit") A.close();
        else if (b.dataset.ac === "resume" && ck) { this.kicker = ck.kicker; this.keeper = ck.keeper; this.begin(ck); }
        else { A.Ckpt.clear("penalty"); this.pickKicker(); }
      };
    },
    pickBar(title, list, current, attr, back) {
      return `<div class="pk3-bar"><h2>${title}</h2>
        <div class="pk3-names" role="radiogroup">${list.map((p) => `<button type="button" role="radio" aria-checked="${p.id === current}" class="pk3-name${p.id === current ? " is-on" : ""}" data-${attr}="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.kit)}</small></button>`).join("")}</div>
        ${attr === "kicker" ? '<p class="pk-fiction">O\'yinchilar — o\'ylab topilgan multfilm qahramonlari.</p>' : ""}
        <div class="ac-actions">${back ? A.btn("Orqaga", 'data-ac="back"') : ""}${A.btn(attr === "kicker" ? "Davom etish" : "Boshlash", 'data-ac="go"', "is-primary")}</div></div>`;
    },
    pickKicker() {
      this.phase = "pick";
      this.pickKind = "kicker";
      [this.kickerFig, this.keeperFig].forEach((f) => { if (f) f.root.visible = false; });
      this.panels.forEach((p) => { p.visible = false; });
      this.ball.visible = false;
      this.setLineup(KICKERS, "kicker");
      this.page.hidden = false;
      this.root.querySelector("[data-dim]").hidden = true;
      this.page.classList.add("is-bottom");
      this.page.innerHTML = this.pickBar("O'yinchini tanlang", KICKERS, this.kicker, "kicker", false);
      this.page.onclick = (ev) => {
        const k = ev.target.closest("[data-kicker]");
        if (k) { this.choose(+k.dataset.kicker); return; }
        if (ev.target.closest('[data-ac="go"]')) this.pickKeeper();
      };
    },
    pickKeeper() {
      this.phase = "pick";
      this.pickKind = "keeper";
      this.setLineup(KEEPERS, "keeper");
      this.page.innerHTML = this.pickBar("Darvozabonni tanlang", KEEPERS, this.keeper, "keeper", true);
      this.page.onclick = (ev) => {
        const k = ev.target.closest("[data-keeper]");
        if (k) { this.choose(+k.dataset.keeper); return; }
        if (ev.target.closest('[data-ac="back"]')) this.pickKicker();
        if (ev.target.closest('[data-ac="go"]')) { this.page.classList.remove("is-bottom"); this.begin(null); }
      };
    },
    choose(id) {
      if (this.pickKind === "kicker") { this.kicker = id; A.setHero(kickerOf(id).hero); } else this.keeper = id;
      this.page.querySelectorAll(`[data-${this.pickKind}]`).forEach((b) => { const on = +b.dataset[this.pickKind] === id; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on); });
      A.sfx.tap();
    },
    // a tap on someone in the 3D lineup chooses him too
    pickAt(x, y) {
      if (this.phase !== "pick" || !this.lineup.length) return;
      const THREE = this.THREE, r = this.stageEl.getBoundingClientRect();
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), this.st.camera);
      let best = null, bestD = 0.9;
      this.lineup.forEach((f) => { const d = ray.ray.distanceToPoint(f.root.position.clone().setY(1)); if (d < bestD) { bestD = d; best = f; } });
      if (best) this.choose(best.id);
    },
    begin(ck) {
      this.level = ck ? ck.level : A.level();
      this.s = A.startSession("penalty", this.level, ck ? ck.sid : null);
      const byId = (id) => window.ARCADE_DATA.grammar.find((g) => g.id === id);
      this.questions = ck ? ck.qids.map(byId).filter(Boolean) : A.grammarFor(this.level, ROUNDS);
      this.rounds = ck ? ck.rounds.slice() : [];
      this.setLineup([], "kicker");
      // the chosen two take their places
      [this.kickerFig, this.keeperFig].forEach((f) => { if (f) this.dropFigure(f); });
      this.kickerFig = this.makeKicker(kickerOf(this.kicker));
      this.keeperFig = this.makeKeeper(KEEPERS[this.keeper - 1] || KEEPERS[0]);
      this.st.scene.add(this.kickerFig.root, this.keeperFig.root);
      this.question();
    },
    checkpoint() {
      A.Ckpt.set("penalty", { sid: this.s.id, level: this.level, kicker: this.kicker, keeper: this.keeper, qids: this.questions.map((q) => q.id), rounds: this.rounds });
    },
    stats() {
      const goals = this.rounds.filter((r) => r.ok).length;
      return { goals, saves: this.rounds.length - goals, attempts: this.rounds.length, acc: A.accuracy(goals, this.rounds.length) };
    },
    hud() {
      const st = this.stats();
      const r = this.root.querySelector('[data-hud="round"]'), sc = this.root.querySelector('[data-hud="score"]');
      r.hidden = sc.hidden = false;
      const n = ["shot", "explain", "results"].includes(this.phase) ? this.rounds.length : this.rounds.length + 1;
      r.textContent = `Raund ${Math.max(1, Math.min(ROUNDS, n))}/${ROUNDS}`;
      sc.textContent = `⚽ ${st.goals} · 🧤 ${st.saves} · ${st.acc}`;
      sc.title = "Gollar · seyvlar · aniqlik";
    },

    // ---------------------------------------------------------------- a round
    question() {
      if (!this.root) return;
      const q = this.questions[this.rounds.length];
      if (!q) { this.finish(); return; }
      this.phase = "question";
      this.q = q;
      this.draft = null;
      this.committed = false;
      this.anim = null;
      this.placeActors();
      this.panels.forEach((p) => { p.visible = false; });
      this.hud();
      this.show(`<div class="ac-q" role="group" aria-label="Grammatika savoli">
        <span class="ac-q-tag" style="background:var(--l1-primary)">Raund ${this.rounds.length + 1}/${ROUNDS}</span>
        <div class="ac-q-text">${esc(q.q).replace("___", "<b>___</b>")}</div>
        <div class="ac-opts">${q.o.map((o, i) => `<button type="button" class="ac-opt" data-opt="${i}" aria-pressed="false">${esc(o)}</button>`).join("")}</div>
        <button type="button" class="ac-btn is-primary is-wide" data-ac="ready" disabled>Tayyorman!</button>
        <span class="ac-muted">Javobni tanlang. Zarbadan oldin uni o'zgartirish mumkin.</span></div>`);
      this.page.onclick = (ev) => {
        const o = ev.target.closest("[data-opt]");
        if (o && this.phase === "question") {
          this.draft = +o.dataset.opt;
          this.page.querySelectorAll("[data-opt]").forEach((b) => { const on = +b.dataset.opt === this.draft; b.classList.toggle("is-picked", on); b.setAttribute("aria-pressed", on); });
          this.page.querySelector('[data-ac="ready"]').disabled = false;
          A.sfx.tap();
          return;
        }
        const r = ev.target.closest('[data-ac="ready"]');
        if (r && !r.disabled && this.phase === "question" && this.draft != null) { r.disabled = true; this.whistle(); }
      };
    },
    whistle() {
      this.phase = "whistle"; // Tayyorman! only arms the shot: nothing is scored here
      this.hidePage();
      A.sfx.whistle();
      A.haptic("tap");
      const el = document.createElement("div");
      el.className = "pk-whistle pk3-whistle";
      el.innerHTML = `<img src="${A.asset("penalty/whistle.webp")}" alt=""><b>Tayyorlaning!</b>`;
      this.root.appendChild(el);
      this.timer = setTimeout(() => { el.remove(); this.aim(); }, 1300);
    },
    aim() {
      if (!this.root) return;
      this.phase = "aim";
      this.paintPanels(this.q);
      this.panels.forEach((p) => { p.visible = true; });
      this.trail = null;
      const hint = this.root.querySelector("[data-aimhint]");
      hint.hidden = false;
      hint.textContent = "To'pni javob tomonga suring: ⬅️ chap · ⬆️ o'rta · ➡️ o'ng";
      this.placeTargets();
    },
    // see-through buttons over the 3D panels: tap to choose; screen readers can reach them
    placeTargets() {
      const host = this.root.querySelector("[data-targets]");
      host.innerHTML = "";
      if (this.phase !== "aim" || !this.st) return;
      for (let i = 0; i < 30; i++) this.render(); // let the camera settle before measuring
      const r = this.stageEl.getBoundingClientRect();
      this.panels.forEach((p, i) => {
        const w = (GOAL_W / 3 - 0.18) / 2;
        const a = p.position.clone().add(new this.THREE.Vector3(-w, 0.65, 0)).project(this.st.camera);
        const b = p.position.clone().add(new this.THREE.Vector3(w, -0.65, 0)).project(this.st.camera);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pk3-target";
        btn.dataset.zone = i;
        btn.setAttribute("aria-label", `${SIDES[i]}: ${this.q.o[i]}${i === this.draft ? " (siz tanlagan)" : ""}`);
        if (i === this.draft) btn.innerHTML = '<span class="pk-mine">siz tanlagan</span>';
        const x0 = (a.x + 1) / 2 * r.width, x1 = (b.x + 1) / 2 * r.width, y0 = (1 - a.y) / 2 * r.height, y1 = (1 - b.y) / 2 * r.height;
        Object.assign(btn.style, { left: x0 + "px", top: y0 + "px", width: (x1 - x0) + "px", height: (y1 - y0) + "px" });
        host.appendChild(btn);
      });
    },
    bindAim() {
      let start = null, pid = null;
      const layer = this.root;
      const pos = (ev) => { const r = this.stageEl.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
      layer.addEventListener("pointerdown", (ev) => {
        if (this.phase === "pick" && !ev.target.closest(".pk3-bar, .ac-hud")) { this.pickAt(ev.clientX, ev.clientY); return; }
        if (this.phase !== "aim" || this.committed || this.paused || ev.target.closest(".ac-hud")) return;
        pid = ev.pointerId;
        start = Object.assign(pos(ev), { target: ev.target.closest("[data-zone]") });
        this.trail = [start];
      });
      layer.addEventListener("pointermove", (ev) => {
        if (!start || ev.pointerId !== pid) return;
        this.trail.push(pos(ev));
        if (this.trail.length > 24) this.trail.shift();
      });
      const up = (ev) => {
        if (!start || ev.pointerId !== pid) return;
        const p = pos(ev), s = start;
        start = null;
        this.trail = null;
        if (this.phase !== "aim" || this.committed) return;
        const dx = p.x - s.x, dy = p.y - s.y, len = Math.hypot(dx, dy);
        if (len < 28) { if (s.target) this.commit(+s.target.dataset.zone); return; } // a tap on a target
        if (dy > len * 0.3) return; // a downward drag is not a kick
        const angle = Math.atan2(dx, -dy) * 180 / Math.PI; // 0 = straight up: the middle
        this.commit(angle < -16 ? 0 : angle > 16 ? 2 : 1);
      };
      layer.addEventListener("pointerup", up);
      layer.addEventListener("pointercancel", () => { start = null; this.trail = null; });
      this.onKey = (ev) => {
        if (!this.root || this.paused) return;
        if (this.phase === "aim" && !this.committed) {
          const z = { 1: 0, 2: 1, 3: 2, ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2 }[ev.key];
          if (z != null) { ev.preventDefault(); this.commit(z); }
        }
        if (ev.key === "Escape") this.pause();
      };
      window.addEventListener("keydown", this.onKey);
    },
    commit(zone) {
      if (this.committed || this.phase !== "aim") return;
      this.committed = true; // the one final answer of this round; later swipes, taps or keys are ignored
      const q = this.q, ok = zone === q.a;
      this.rounds.push({ q: q.id, c: zone, d: this.draft, ok });
      A.askedQuestion(q.id);
      if (this.rounds.length >= ROUNDS) { // the last kick decides the game: report it before its animation
        A.Ckpt.clear("penalty");
        A.finishSession(this.s, { kicker: this.kicker, keeper: this.keeper, rounds: this.rounds.map((r) => ({ q: r.q, c: r.c, d: r.d })) });
      }
      this.phase = "shot";
      this.panels.forEach((p) => { p.material.opacity = 0.45; }); // see the ball and the keeper through them now
      this.root.querySelector("[data-aimhint]").hidden = true;
      this.root.querySelector("[data-targets]").innerHTML = "";
      // keeper: away from a right shot (a guess to one side on a middle shot), to the ball on a wrong one
      const away = zone === 1 ? (Math.random() < 0.5 ? 0 : 2) : 2 - zone;
      const tx = -GOAL_W / 3 + zone * GOAL_W / 3 + (Math.random() - 0.5) * 0.5;
      const ty = 1.0 + Math.random() * 0.85; // into the chosen panel
      this.anim = { t: 0, zone, ok, keeperTo: ok ? away : zone, tx, ty, kicked: false, arrived: false, done: false };
      A.haptic("tap");
    },

    // ---------------------------------------------------------------- frames
    loop(now) {
      if (!this.root || !this.st) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (!this.paused) this.update(dt);
      this.render();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    },
    update(dt) {
      this.t += dt;
      this.crowdU.uTime.value = this.t;
      this.cheer = Math.max(0, this.cheer - dt * 0.35);
      this.crowdU.uCheer.value = this.cheer;
      this.sparks.update(dt);
      this.relaxNet(dt);
      this.ref.pose(this.phase === "whistle" ? "wave" : "idle", this.t);
      if (this.phase === "pick") {
        const sel = this.pickKind === "kicker" ? this.kicker : this.keeper;
        const z0 = this.pickKind === "keeper" ? 0.6 : 14;
        this.lineup.forEach((f) => {
          const on = f.id === sel;
          f.pose(on ? "cheer" : this.pickKind === "keeper" ? "keeper" : "idle", this.t + f.t0);
          f.root.rotation.y = Math.PI + Math.sin(this.t * 0.8 + f.t0) * 0.1;
          f.root.position.z += ((on ? z0 + 0.8 : z0) - f.root.position.z) * Math.min(1, dt * 6);
        });
        return;
      }
      if (this.phase === "shot") this.updateShot(dt);
      else if (this.kickerFig && this.kickerFig.root.visible) {
        const last = this.rounds[this.rounds.length - 1];
        this.kickerFig.pose(this.phase === "explain" ? (last && last.ok ? "cheer" : "sad") : "idle", this.t);
        this.keeperFig.pose(this.phase === "explain" && last && !last.ok ? "cheer" : "keeper", this.t);
      }
    },
    // where the kicker, keeper and ball stand before a kick
    placeActors() {
      if (!this.kickerFig) return;
      this.kickerFig.root.visible = this.keeperFig.root.visible = true;
      this.kickerFig.root.position.set(-1.7, 0, SPOT_Z + 2.0);
      this.kickerFig.root.rotation.set(0, 0.5, 0);
      this.keeperFig.root.position.set(0, 0, -0.35);
      this.keeperFig.root.rotation.set(0, Math.PI, 0);
      this.keeperFig.body.rotation.set(0, 0, 0);
      this.ball.position.set(0, 0.17, SPOT_Z);
      this.ball.visible = true;
      this.ball.rotation.set(0, 0, 0);
    },
    updateShot(dt) {
      const a = this.anim, K = this.kickerFig, GK = this.keeperFig;
      a.t += dt;
      // run-up: a few steps to the ball, then the strike
      const runT = 0.62, flight = 0.62;
      if (a.t < runT) {
        const k = a.t / runT;
        K.root.position.set(-1.7 + 1.35 * k, 0, SPOT_Z + 2.0 - 1.65 * k);
        K.pose("run", a.t, { speed: 11 });
      } else if (a.arrived && a.t > runT + 1.3) K.pose(a.ok ? "cheer" : "sad", a.t);
      else K.pose("kick", a.t, { k: 0.5 + Math.min(1, (a.t - runT) / 0.4) * 0.5 });
      if (!a.kicked && a.t >= runT) { a.kicked = true; A.sfx.kick(); this.sparks.burst(0, 0.1, SPOT_Z, "#7ccf5a", 14, 2, 0.4, 6); }
      // the ball: from the spot to the target, curving and spinning; a save stops it in the keeper's gloves
      if (a.kicked) {
        const p = Math.min(1, (a.t - runT) / flight);
        const endZ = a.ok ? -1.2 : -0.1;
        if (!(a.arrived && !a.ok)) {
          if (!a.arrived) this.ball.position.set(a.tx * p, 0.17 + (a.ty - 0.17) * p + Math.sin(p * Math.PI) * 0.9, SPOT_Z + (endZ - SPOT_Z) * p);
          else this.ball.position.y = Math.max(0.17, this.ball.position.y - dt * 2.5); // dropping inside the net
        }
        this.ball.rotation.x -= dt * 25;
        if (p >= 1 && !a.arrived) {
          a.arrived = true;
          if (a.ok) {
            A.sfx.net(); A.sfx.right(); A.haptic("ok");
            this.bulgeNet(a.tx, a.ty);
            this.cheer = 1;
            this.sparks.burst(a.tx, a.ty, -0.8, "#ffd34d", 60, 5, 1.2, 4);
            this.sparks.burst(a.tx, a.ty, -0.8, "#ffffff", 30, 4, 1.0, 4);
            this.banner("GOOOL!", "good");
          } else {
            A.sfx.save(); A.sfx.wrong(); A.haptic("err");
            this.sparks.burst(a.tx, a.ty, 0, "#ffffff", 30, 3, 0.6, 2);
            this.banner("Seyv!", "bad");
          }
          // the right answer turns green, a wrong pick red; the third fades
          this.panels.forEach((pn, i) => {
            const bg = i === this.q.a ? "rgba(22,163,74,.92)" : i === a.zone ? "rgba(229,72,77,.92)" : null;
            if (bg) { pn.material.map.dispose(); pn.material.map = this.D.textTexture(this.q.o[i], { w: 512, h: 290, bg, round: 30, border: "#ffffff", borderW: 14, color: "#ffffff", shadow: "rgba(0,0,0,.45)", size: 96 }); pn.material.needsUpdate = true; }
            pn.material.opacity = bg ? 0.95 : 0.25;
          });
          this.hud();
        }
      }
      // the keeper: a dive after the kick; on a save the ball sits in his gloves
      if (a.t > runT + 0.06) {
        const side = a.keeperTo === 0 ? -1 : a.keeperTo === 2 ? 1 : 0;
        const p = Math.min(1, (a.t - runT - 0.06) / 0.5);
        GK.root.position.x = side * 2.0 * p * (a.ok ? 1 : Math.min(1, Math.abs(a.tx) / 2.4 + 0.3));
        if (side) {
          GK.pose("dive", a.t, { k: p, dir: -side }); // he faces the kicker: his own left is the screen's right
          GK.root.position.y = Math.max(0, Math.sin(p * Math.PI) * (a.ok ? 0.6 : 0.8) + (a.ok ? 0 : Math.max(0, a.ty - 1.0) * p * 0.6));
        } else {
          GK.pose("cheer", a.t);
          GK.root.position.y = Math.sin(p * Math.PI) * 0.5;
        }
        if (!a.ok && a.arrived) {
          const hands = new this.THREE.Vector3();
          GK.wristR.getWorldPosition(hands);
          this.ball.position.lerp(hands, 0.5);
        }
      }
      if (a.arrived && !a.done && a.t > runT + flight + 1.6) { a.done = true; this.explain(); }
    },
    bulgeNet(x, y) {
      const pos = this.net.geometry.attributes.position, base = this.netBase;
      for (let i = 0; i < pos.count; i++) {
        const d = Math.hypot(base[i * 3] - x, base[i * 3 + 1] - y);
        pos.array[i * 3 + 2] = base[i * 3 + 2] - Math.max(0, 1 - d / 1.6) * 0.9;
      }
      pos.needsUpdate = true;
      this.netBulge = 1;
    },
    relaxNet(dt) {
      if (!this.netBulge) return;
      this.netBulge = Math.max(0, this.netBulge - dt * 1.5);
      const pos = this.net.geometry.attributes.position, base = this.netBase;
      for (let i = 2; i < pos.array.length; i += 3) pos.array[i] = base[i] + (pos.array[i] - base[i]) * 0.9;
      pos.needsUpdate = true;
    },
    render() {
      const st = this.st, THREE = this.THREE;
      if (!st) return;
      const cam = st.camera;
      const portrait = st.w < st.h;
      let pos, look, fov;
      if (this.phase === "pick" && this.pickKind === "kicker") { pos = new THREE.Vector3(0, 1.45, 21); look = new THREE.Vector3(0, 0.45, 14); fov = portrait ? 64 : 34; }
      else if (this.phase === "pick") { pos = new THREE.Vector3(0, 1.5, 7.6); look = new THREE.Vector3(0, 0.6, 0.6); fov = portrait ? 66 : 38; }
      if (this.phase === "pick" && portrait) { // a phone held upright sees two or three of the line: follow the chosen one
        const sel = this.pickKind === "kicker" ? this.kicker : this.keeper;
        const f = this.lineup.find((x) => x.id === sel);
        if (f) { pos.x = f.root.position.x * 0.85; look.x = f.root.position.x * 0.85; }
      }
      else if (this.phase === "start" || this.phase === "loading") { pos = new THREE.Vector3(-4, 3.2, 20); look = new THREE.Vector3(0, 1.4, 0); fov = 40; }
      else {
        // behind and a little left of the kicker, the whole goal in view on any screen
        const dist = 18.6;
        pos = new THREE.Vector3(-0.5, 2.5, SPOT_Z + 7.6);
        look = new THREE.Vector3(0, 1.25, 0);
        fov = Math.min(75, Math.max(23, 2 * Math.atan(4.8 / (Math.max(0.3, st.w / st.h) * dist)) * 180 / Math.PI));
      }
      if (!this.camPos) { this.camPos = pos.clone(); this.camLook = look.clone(); }
      this.camPos.lerp(pos, 0.08);
      this.camLook.lerp(look, 0.08);
      cam.position.copy(this.camPos);
      cam.lookAt(this.camLook);
      if (Math.abs(cam.fov - fov) > 0.05) { cam.fov += (fov - cam.fov) * 0.12; cam.updateProjectionMatrix(); }
      st.render();
      if (this.trail && this.trail.length > 1) this.drawTrail();
    },
    drawTrail() {
      // the finger's path, on a small 2D canvas over the stage
      let c = this.trailCanvas;
      if (!c) {
        c = this.trailCanvas = document.createElement("canvas");
        c.className = "pk3-trail";
        this.root.appendChild(c);
      }
      const r = this.stageEl.getBoundingClientRect();
      if (c.width !== Math.round(r.width) || c.height !== Math.round(r.height)) { c.width = Math.round(r.width); c.height = Math.round(r.height); }
      const g = c.getContext("2d");
      g.clearRect(0, 0, c.width, c.height);
      g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.lineCap = "round"; g.setLineDash([2, 12]);
      g.beginPath();
      this.trail.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.stroke();
      clearTimeout(this.trailT);
      this.trailT = setTimeout(() => g.clearRect(0, 0, c.width, c.height), 120);
    },

    // ---------------------------------------------------------------- after the kick
    explain() {
      if (!this.root) return;
      this.phase = "explain";
      const q = this.q, last = this.rounds[this.rounds.length - 1];
      if (this.rounds.length < ROUNDS) this.checkpoint(); else A.Ckpt.clear("penalty");
      this.show(`<div class="ac-q">
        <span class="ac-q-tag" style="background:${last.ok ? "#16a34a" : "#e5484d"}">${last.ok ? "⚽ GOL!" : "🧤 Darvozabon ushlab qoldi"}</span>
        <h3 style="margin:0;font-family:var(--font-display)">To'g'ri javob: ${esc(q.o[q.a])}</h3>
        <div class="ac-q-text">${A.filled(q, true)}</div>
        ${last.ok ? "" : `<span class="ac-muted">Siz tanlagan javob: <b>${esc(q.o[last.c])}</b></span>`}
        <div class="ac-why">${esc(q.why)}</div>
        <button type="button" class="ac-btn is-primary is-wide" data-ac="next" disabled>${this.rounds.length >= ROUNDS ? "Natijalar" : "Keyingi raund"}</button></div>`);
      // the next round is a separate, deliberate tap: a pointer that went down before this card appeared cannot press it
      const next = this.page.querySelector('[data-ac="next"]');
      let armed = false;
      this.timer = setTimeout(() => { next.disabled = false; }, 650);
      next.addEventListener("pointerdown", () => { armed = true; });
      next.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") armed = true; });
      this.page.onclick = (ev) => {
        if (!ev.target.closest('[data-ac="next"]') || next.disabled || !armed) return;
        next.disabled = true;
        if (this.rounds.length >= ROUNDS) this.finish(); else this.question();
      };
    },
    finish() {
      if (this.phase === "results") return;
      this.phase = "results";
      A.Ckpt.clear("penalty");
      A.finishSession(this.s, { kicker: this.kicker, keeper: this.keeper, rounds: this.rounds.map((r) => ({ q: r.q, c: r.c, d: r.d })) }, !this.rounds.length);
      const st = this.stats();
      this.panels.forEach((p) => { p.visible = false; });
      this.show(`<div class="pk-pick ac-results ac-start">${A.shk(st.goals >= st.saves ? "celebrate" : "encourage", 120)}<h2>Natijalar</h2>
        <div class="ac-stats"><div class="ac-stat"><small>Gollar</small><b>⚽ ${st.goals}</b></div><div class="ac-stat"><small>Seyvlar</small><b>🧤 ${st.saves}</b></div>
          <div class="ac-stat"><small>To'g'ri javoblar</small><b>${st.goals}/${st.attempts}</b></div><div class="ac-stat"><small>Aniqlik</small><b>${st.acc}</b></div></div>
        <div class="pk-dots" aria-label="Zarbalar">${this.rounds.map((r, i) => `<i class="${r.ok ? "is-goal" : "is-save"}" title="${i + 1}-zarba: ${r.ok ? "gol" : "seyv"}"></i>`).join("")}</div>
        <p class="ac-receipt" data-ac="receipt"></p>
        <div class="ac-actions">${A.btn("Qayta o'ynash", 'data-ac="again"', "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      A.receiptLine(this.page.querySelector('[data-ac="receipt"]'), this.s);
      this.page.onclick = (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "again") this.pickKicker();
        if (b.dataset.ac === "exit") A.close();
      };
    },
    pause() {
      if (this.paused || !["question", "whistle", "aim", "shot", "explain"].includes(this.phase)) return;
      this.paused = true;
      clearTimeout(this.timer);
      const wasWhistle = this.phase === "whistle";
      A.pauseMenu(this.root, {
        resume: () => {
          this.paused = false;
          this.last = performance.now();
          if (wasWhistle) { this.root.querySelectorAll(".pk3-whistle").forEach((e) => e.remove()); this.aim(); }
          else if (this.phase === "explain") { const n = this.page.querySelector('[data-ac="next"]'); if (n) n.disabled = false; }
        },
        restart: () => { this.paused = false; this.endEarly(); this.pickKicker(); },
        exit: () => { this.paused = false; this.endEarly(); A.close(); },
      });
    },
    endEarly() {
      A.Ckpt.clear("penalty");
      this.phase = "results";
      A.finishSession(this.s, { kicker: this.kicker, keeper: this.keeper, rounds: this.rounds.map((r) => ({ q: r.q, c: r.c, d: r.d })) }, !this.rounds.length);
      this.root.querySelector("[data-targets]").innerHTML = "";
      this.root.querySelectorAll(".pk3-whistle").forEach((e) => e.remove());
      this.panels.forEach((p) => { p.visible = false; });
    },
    banner(text, kind) {
      const el = this.root && this.root.querySelector("[data-banner]");
      if (!el) return;
      el.textContent = text;
      el.className = "ac-banner is-on is-" + (kind || "good");
      clearTimeout(this.bannerT);
      this.bannerT = setTimeout(() => { el.className = "ac-banner"; }, 1300);
    },
  };

  A.register("penalty", G);
})(window, document);
