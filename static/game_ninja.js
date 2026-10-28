/* Word Ninja (L1_Arcade game "ninja"): an Uzbek word, 3D picture tokens tumbling down, swipe the right one.
 *
 * 20 challenges per session. One swipe (or tap, or number key) answers a challenge: the first token it touches counts,
 * then everything freezes. A right token of a thing is cut in two halves that fly apart; a right token of a living thing
 * (animal, plant) is never cut: a cartoon glove gives it a gentle tap and it bounces. A wrong token stays whole: an amber
 * ring and the configured penalty. Then the English word, pronunciation and an example. Tokens that fall past the bottom
 * unanswered simply drop again; that is not counted as a mistake.
 * The arena is real-time 3D (three.js via L1_3D): a wooden dojo wall with paper lanterns and the student's hero (picked
 * on the start page) cheering in the corner.
 */
(function (window, document) {
  "use strict";
  const A = window.L1_Arcade;
  if (!A) return;
  const esc = A.esc;
  const CHALLENGES = 20;
  const RULES = { right: 10, wrong: 5 }; // the server pays by the same numbers (server.py ARCADE_POINTS)
  const PER_LEVEL = { A1: { n: 3, fall: 5.4 }, A2: { n: 4, fall: 4.8 }, B1: { n: 4, fall: 4.2 } };
  const PACK = ["apple", "banana", "bird", "book", "butterfly", "cat", "chair", "cup", "dog", "fish", "flower", "football", "key",
    "lemon", "orange", "rabbit", "shoe", "strawberry", "tree", "watermelon"];
  const JUICE = { apple: "#ff5a4e", watermelon: "#ff4d6d", orange: "#ffa53a", banana: "#ffe066", strawberry: "#ff3d5a", lemon: "#ffe94d",
    pear: "#c9e86a", peach: "#ffb08a", melon: "#ffd36b", grapes: "#9b5de5", cherry: "#e5484d", pineapple: "#ffd23f", kiwi: "#8bc34a", coconut: "#f5f5f5", tomato: "#ff4d3d" };
  const RIMS = ["#ff8a3d", "#3aa0ff", "#2fbf71", "#f2c52a", "#ff6f91", "#8b5cf6"];

  const G = {
    open(root) {
      this.root = root;
      Object.assign(this, { phase: "loading", paused: false, raf: 0, t: 0, targets: [], parts: [], items: [], score: 0, streak: 0, mentor: "teach", camReady: false });
      root.innerHTML = `<div class="ac-stage" data-stage></div><canvas class="pk3-trail" data-trail></canvas>
        <div class="ac-hud"><span class="ac-pill is-title">Word Ninja</span><span class="ac-pill" data-hud="n">1/${CHALLENGES}</span>
          <span class="ac-pill" data-hud="score">0 ball</span><span class="ac-hud-fill"></span>${A.hudButtons()}</div>
        <div class="wn-prompt" data-prompt hidden><span class="wn-word" data-word></span><span class="wn-sub">To'g'ri rasmni kesing</span></div>
        <div class="ac-banner" data-banner></div>`;
      this.stageEl = root.querySelector("[data-stage]");
      this.trailEl = root.querySelector("[data-trail]");
      root.querySelector(".ac-hud").addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "mute") A.toggleMute(b);
        if (b.dataset.ac === "pause") this.pause();
      });
      const el = A.overlay(root, `<div class="ac-loading"><div class="ac-spinner" aria-hidden="true"></div><b>Word Ninja</b><span>Yuklanmoqda…</span></div>`, "is-loading");
      Promise.all([A.need3D(), A.load(PACK.map((p) => `ninja/t_${p}.webp`))]).then(() => {
        el.remove();
        if (!this.root) return;
        if (!window.L1_3D.supported()) { this.no3D(); return; }
        try { this.build(); } catch (e) { console.error(e); this.no3D(); return; }
        this.bindInput();
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
      if (["prompt", "falling", "resolve", "reveal"].includes(this.phase) && !this.paused) { this.pause(); return true; }
      return false;
    },

    // ---------------------------------------------------------------- the dojo
    build() {
      const D = window.L1_3D, THREE = window.THREE;
      this.D = D; this.THREE = THREE;
      const st = this.st = D.stage(this.stageEl, { fov: 40, far: 320, maxDpr: 1.75, envIntensity: 0.5 });
      D.curve.value = 0;
      // an open deck on a mountain top: the sky goes from sunset to dusk as the challenges pass, the lanterns glow brighter
      const P = D.cinema.PALETTES;
      const mood = this.mood = D.cinema.mood(st, { from: Object.assign({}, P.sunset, { sun: [0.55, 0.22, -1] }), to: Object.assign({}, P.dusk, { sun: [0.5, 0.06, -1] }),
        fog: [40, 160], radius: 200, ground: { y: -14 }, moteCount: 70, moteOpts: { size: [30, 14, 24], pointSize: 0.2, color: "#ffc4d8", opacity: 0.85, fall: 0.7 } });
      D.cinema.grade(this.stageEl.parentNode);
      const key = mood.key;
      key.position.set(-5, 8, 12);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, { left: -12, right: 12, top: 9, bottom: -9, near: 1, far: 40 });
      this.floor = new THREE.Mesh(new THREE.BoxGeometry(60, 1, 6), new THREE.MeshStandardMaterial({ color: "#8a5426", roughness: 0.7 }));
      this.floor.receiveShadow = true;
      st.scene.add(this.floor);
      this.lanterns = [-1, 1].map((s) => {
        const grp = new THREE.Group();
        const paper = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), new THREE.MeshStandardMaterial({ color: "#ff9b42", emissive: "#ff7a1a", emissiveIntensity: 1.3, roughness: 0.6 }));
        paper.scale.y = 1.2;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 16), new THREE.MeshStandardMaterial({ color: "#3a2414" }));
        cap.position.y = 0.66;
        const cap2 = cap.clone(); cap2.position.y = -0.66;
        const light = new THREE.PointLight("#ffb066", 18, 14, 1.8);
        grp.add(paper, cap, cap2, light);
        grp.userData.side = s;
        st.scene.add(grp);
        return grp;
      });
      this.mentorFig = D.hero(A.heroId());
      this.mentorFig.root.rotation.y = Math.PI; // facing the student
      st.scene.add(this.mentorFig.root);
      this.sparks = D.Sparks(st.scene, 320, false);
      this.ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 10, 48), new THREE.MeshBasicMaterial({ color: "#ffb020", transparent: true, opacity: 0 }));
      st.scene.add(this.ring);
      this.gloveMesh = D.glove();
      this.gloveMesh.visible = false;
      st.scene.add(this.gloveMesh);
      this.texCache = {};
      this.layout();
    },
    // what the camera sees at z = 0, in world units, and where the floor, lanterns and mentor go
    layout() {
      const st = this.st;
      if (!st) return;
      st.resize();
      const cam = st.camera;
      cam.position.set(0, 0, 14);
      cam.lookAt(0, 0, 0);
      const halfH = Math.tan((cam.fov * Math.PI) / 360) * 14, halfW = halfH * cam.aspect;
      this.view = { halfH, halfW };
      this.floor.position.set(0, -halfH - 0.2, 0);
      this.lanterns.forEach((l) => l.position.set(l.userData.side * Math.min(halfW - 1, 6.5), halfH - 1.8, -1.2));
      const mh = Math.min(halfH * 0.42, 2.6); // the mentor's height in world units
      this.mentorFig.root.scale.setScalar(mh / 1.9);
      this.mentorFig.root.position.set(-halfW + mh * 0.3, -halfH + 0.25, 0.8);
      this.size = Math.max(0.55, Math.min(1.15, (halfW * 2) / (((PER_LEVEL[this.level || "A1"] || PER_LEVEL.A1).n) * 2.5)));
    },
    tokenTex(w) {
      if (!this.texCache[w.id]) this.texCache[w.id] = this.D.tokenTexture(A.picDrawable(w, 220));
      return this.texCache[w.id];
    },

    // ---------------------------------------------------------------- start
    // another hero picked on the start page: the one in the corner changes at once
    swapHero(id) {
      if (!this.st || !this.mentorFig) return;
      const old = this.mentorFig;
      this.mentorFig = this.D.hero(id);
      this.mentorFig.root.rotation.y = Math.PI;
      this.st.scene.add(this.mentorFig.root);
      this.st.scene.remove(old.root);
      old.root.traverse((ob) => { if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose(); });
      this.layout();
    },
    startScreen() {
      this.phase = "start";
      const ck = A.Ckpt.get("ninja");
      const el = A.overlay(this.root, `<div class="ac-start"><h2>Word Ninja</h2>${A.heroPicker()}
        <ul class="ac-rules"><li>Yuqorida o'zbekcha so'z chiqadi, rasmlar tepadan tushadi.</li>
          <li>Barmoq yoki sichqoncha bilan to'g'ri rasm ustidan suring (yoki uni bosing).</li>
          <li>To'g'ri: +${RULES.right} ball. Noto'g'ri: −${RULES.wrong} ball. Hayvon va o'simliklar kesilmaydi — ularga qo'lqop yengil tegadi.</li>
          <li>${CHALLENGES} ta so'z.</li></ul>
        <span class="ac-lvl-line">Daraja: <b>${A.levelName(A.level())}</b></span>
        <div class="ac-actions is-col">${ck ? A.btn(`Davom ettirish (${ck.items.length}/${CHALLENGES})`, 'data-ac="resume"', "is-primary") : ""}
          ${A.btn(ck ? "Yangi o'yin" : "Boshlash", 'data-ac="new"', ck ? "" : "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`, "is-menu");
      A.bindHeroPicker(el, (id) => this.swapHero(id));
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        el.remove();
        if (b.dataset.ac === "exit") A.close();
        else if (b.dataset.ac === "resume" && ck) this.begin(ck);
        else { A.Ckpt.clear("ninja"); this.begin(null); }
      });
    },
    begin(ck) {
      this.level = ck ? ck.level : A.level();
      this.s = A.startSession("ninja", this.level, ck ? ck.sid : null);
      this.items = ck ? ck.items.slice() : [];
      this.order = ck ? ck.order.slice() : A.shuffle(A.vocabFor(this.level).map((w) => w.id)).slice(0, CHALLENGES);
      this.score = this.calcScore();
      this.paused = false;
      this.layout();
      this.hud();
      this.next();
    },
    calcScore() { return Math.max(0, this.items.reduce((s, it) => s + (it.w === it.p ? RULES.right : -RULES.wrong), 0)); },
    checkpoint() { A.Ckpt.set("ninja", { sid: this.s.id, level: this.level, items: this.items, order: this.order }); },
    hud() {
      const n = this.root.querySelector('[data-hud="n"]'), s = this.root.querySelector('[data-hud="score"]');
      const shown = ["prompt", "falling"].includes(this.phase) ? this.items.length + 1 : this.items.length;
      n.textContent = `${Math.max(1, Math.min(CHALLENGES, shown))}/${CHALLENGES}`;
      s.textContent = `${this.score} ball`;
    },

    // ---------------------------------------------------------------- a challenge
    clearTargets() {
      this.targets.forEach((t) => this.st.scene.remove(t.obj.root));
      this.parts.forEach((p) => this.st.scene.remove(p.obj.root));
      this.targets = []; this.parts = [];
      this.gloveMesh.visible = false;
      this.ring.material.opacity = 0;
    },
    next() {
      if (!this.root) return;
      const id = this.order[this.items.length];
      if (this.items.length >= CHALLENGES || !id) { this.finish(); return; }
      this.word = A.word(id);
      this.phase = "prompt";
      this.mentor = "think";
      this.clearTargets();
      this.committed = false;
      this.hud();
      this.root.querySelector("[data-prompt]").hidden = false;
      this.root.querySelector("[data-word]").textContent = this.word.uz;
      if (this.items.length === 0) {
        const el = A.overlay(this.root, `<div class="ac-start"><span class="ac-muted">Shu so'zning rasmini toping:</span>
          <b class="wn-big">${esc(this.word.uz)}</b>${A.btn("Boshlash", 'data-ac="go"', "is-primary is-wide")}</div>`);
        el.addEventListener("click", (ev) => { if (ev.target.closest('[data-ac="go"]')) { el.remove(); this.drop(true); } });
      } else {
        this.timer = setTimeout(() => this.drop(true), 900);
      }
    },
    // the right token and different distractors, in shuffled columns, starting one after another
    drop(fresh) {
      if (!this.root || (this.phase !== "prompt" && this.phase !== "falling")) return;
      const conf = PER_LEVEL[this.level] || PER_LEVEL.A1;
      if (fresh) {
        const pool = A.vocabFor(this.level).filter((w) => w.id !== this.word.id && w.pic !== this.word.pic && w.en !== this.word.en && w.uz !== this.word.uz);
        this.choice = A.shuffle(A.shuffle(pool).slice(0, conf.n - 1).concat([this.word])).map((w) => w.id);
      }
      this.clearTargets();
      const { halfW, halfH } = this.view;
      const cols = A.shuffle(this.choice.map((_, i) => i));
      const delays = A.shuffle(this.choice.map((_, i) => i * 0.4));
      const colW = (halfW * 2 - 0.6) / this.choice.length;
      const r = Math.min(this.size, colW * 0.42);
      this.targets = this.choice.map((id, i) => {
        const w = A.word(id);
        const obj = this.D.token({ radius: r, depth: r * 0.32, tex: this.tokenTex(w), rim: RIMS[Math.floor(Math.random() * RIMS.length)] });
        const t = {
          id, w, obj, r,
          x: -halfW + 0.3 + colW * (cols[i] + 0.5), y: halfH + r * 1.4, delay: delays[i],
          vy: (halfH * 2 + r * 3) / conf.fall, sway: Math.random() * Math.PI * 2, state: "fall", tap: 0, shake: 0,
        };
        obj.root.position.set(t.x, t.y, 0);
        obj.root.visible = false;
        this.st.scene.add(obj.root);
        return t;
      });
      this.phase = "falling";
    },
    commit(t, seg) {
      if (this.committed || this.phase !== "falling") return;
      this.committed = true; // one answer per challenge: later hits of this swipe, a second finger, a tap, all ignored
      const ok = t.id === this.word.id;
      this.streak = ok ? (this.streak || 0) + 1 : 0; // right answers in a row (only for the cheering)
      this.items.push({ w: this.word.id, p: t.id });
      this.score = this.calcScore();
      if (this.items.length >= CHALLENGES) { A.Ckpt.clear("ninja"); A.finishSession(this.s, { challenges: this.items }); } // the last answer: report now
      this.phase = "resolve";
      this.targets.forEach((x) => { x.frozen = true; });
      const living = t.w.live !== false; // unknown counts as living: never cut
      if (ok && !living) this.slice(t, seg);
      else if (ok) this.tapLiving(t);
      else this.miss(t);
      this.mentor = ok ? "cheer" : "sad";
      this.banner(ok ? (this.streak >= 3 ? `To'g'ri! +${RULES.right} · 🔥 ${this.streak} ketma-ket` : `To'g'ri! +${RULES.right}`) : `Yana urinib ko'ring −${RULES.wrong}`, ok ? "good" : "bad");
      if (ok && this.streak >= 3) this.sparks.burst(0, this.view.halfH * 0.5, 0.6, "#ffb020", 50, 6, 1.0, 4);
      A.haptic(ok ? "ok" : "err");
      this.hud();
      this.lastOk = ok;
      this.timer = setTimeout(() => this.reveal(ok), 1300);
    },
    slice(t, seg) {
      t.state = "cut";
      this.slow = A.reducedMotion() ? 0 : 0.5;
      this.trail = [];
      A.sfx.slice(); A.sfx.right();
      // the cut runs along the swipe (screen y points down, world y up)
      const ang = seg ? -Math.atan2(seg[3] - seg[1], seg[2] - seg[0]) : 0.6;
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      const rim = t.obj.rimMat;
      [ang, ang + Math.PI].forEach((a0, k) => {
        const half = this.D.token({ radius: t.r, depth: t.r * 0.32, faceMat: t.obj.faceMat, rimMat: rim, cut: "#fff3dc" }, a0);
        half.root.position.copy(t.obj.root.position);
        half.root.rotation.copy(t.obj.root.rotation);
        this.st.scene.add(half.root);
        const s = k === 0 ? 1 : -1; // the half on the left of the cut goes left, the other right
        this.parts.push({ obj: half, vx: nx * 4 * s + (Math.random() - 0.5), vy: ny * 4 * s + 3, vz: 1.5, spin: s * (3 + Math.random() * 2) });
      });
      this.st.scene.remove(t.obj.root);
      const juice = JUICE[t.w.en] || "#ffffff";
      this.sparks.burst(t.x, t.y, 0.4, juice, 40, 6, 0.8, 9);
      this.sparks.burst(t.x, t.y, 0.4, "#ffffff", 16, 5, 0.5, 6);
    },
    tapLiving(t) {
      t.state = "tapped";
      t.tap = 0;
      this.trail = []; // no blade line ever crosses a living picture
      t.from = t.x < 0 ? 1 : -1; // the glove comes from the open side
      this.gloveMesh.visible = true;
      this.gloveMesh.scale.setScalar(t.r * 1.6);
      this.gloveMesh.rotation.set(0, t.from > 0 ? 0 : Math.PI, 0);
      A.sfx.slap();
      setTimeout(() => A.sfx.right(), 180);
    },
    miss(t) {
      t.state = "wrong";
      t.shake = 1;
      A.sfx.wrong();
      this.ring.position.set(t.x, t.y, 0.3);
      this.ring.scale.setScalar(t.r);
      this.ring.material.opacity = 0.9;
      this.ringT = 0;
      const right = this.targets.find((x) => x.id === this.word.id);
      if (right) { right.glow = true; right.obj.rimMat.emissive = new this.THREE.Color("#33ff88"); right.obj.rimMat.emissiveIntensity = 0.8; }
    },
    reveal(ok) {
      if (!this.root) return;
      this.phase = "reveal";
      if (this.items.length < CHALLENGES) this.checkpoint(); else A.Ckpt.clear("ninja");
      const w = this.word;
      const el = A.overlay(this.root, `<span class="ac-q-tag" style="background:${ok ? "#16a34a" : "#e5484d"};justify-self:center">${ok ? `To'g'ri! +${RULES.right}` : `Noto'g'ri · −${RULES.wrong}`}</span>
        <span class="ac-muted">«${esc(w.uz)}» inglizcha:</span>
        ${A.wordCardHtml(w, { save: true, marked: this.s.want.has(w.id) })}
        ${A.btn(this.items.length >= CHALLENGES ? "Natijalar" : "Davom etish", 'data-ac="next"', "is-primary is-wide")}`);
      A.bindWordCard(el, this.s);
      A.speak(w.en);
      el.addEventListener("click", (ev) => {
        if (!ev.target.closest('[data-ac="next"]')) return;
        el.remove();
        this.root.querySelector("[data-prompt]").hidden = true;
        this.next();
      });
    },

    // ---------------------------------------------------------------- input: the blade
    screenOf(t) {
      const THREE = this.THREE, r = this.stageEl.getBoundingClientRect();
      const p = new THREE.Vector3(t.x, t.y, 0).project(this.st.camera);
      const q = new THREE.Vector3(t.x + t.r, t.y, 0).project(this.st.camera);
      return { x: (p.x + 1) / 2 * r.width, y: (1 - p.y) / 2 * r.height, r: Math.abs(q.x - p.x) / 2 * r.width };
    },
    hitSegment(x1, y1, x2, y2) {
      let best = null, bestK = Infinity;
      for (const t of this.targets) {
        if (t.state !== "fall" || t.delay > 0) continue;
        const s = this.screenOf(t), rad = s.r * 0.95;
        const dx = x2 - x1, dy = y2 - y1, len2 = dx * dx + dy * dy;
        const k = len2 ? Math.max(0, Math.min(1, ((s.x - x1) * dx + (s.y - y1) * dy) / len2)) : 0;
        if (Math.hypot(x1 + dx * k - s.x, y1 + dy * k - s.y) < rad && k < bestK) { best = t; bestK = k; }
      }
      return best;
    },
    bindInput() {
      let pid = null, prev = null, downAt = null;
      const pos = (ev) => { const r = this.stageEl.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
      const el = this.stageEl;
      el.addEventListener("pointerdown", (ev) => {
        if (pid !== null || this.paused) return; // one finger at a time
        pid = ev.pointerId;
        prev = pos(ev);
        downAt = Object.assign({}, prev);
        this.trail = [Object.assign({ t: performance.now() }, prev)];
        try { el.setPointerCapture(pid); } catch (e) { /* old browser */ }
      });
      el.addEventListener("pointermove", (ev) => {
        if (ev.pointerId !== pid || this.phase !== "falling" || this.committed) return;
        const p = pos(ev);
        this.trail.push(Object.assign({ t: performance.now() }, p));
        if (this.trail.length > 14) this.trail.shift();
        const hit = this.hitSegment(prev.x, prev.y, p.x, p.y);
        if (hit) this.commit(hit, [prev.x, prev.y, p.x, p.y]);
        prev = p;
      });
      const end = (ev) => {
        if (ev.pointerId !== pid) return;
        const p = pos(ev);
        // a tap (no real movement) on a token answers too
        if (downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) < 12 && this.phase === "falling" && !this.committed) {
          const hit = this.hitSegment(p.x, p.y, p.x, p.y);
          if (hit) this.commit(hit, null);
        }
        pid = null; prev = null; downAt = null;
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      this.onKey = (ev) => {
        if (!this.root || this.paused) return;
        if (ev.key === "Escape") { this.pause(); return; }
        const n = parseInt(ev.key, 10);
        if (this.phase === "falling" && n >= 1 && n <= this.targets.length) {
          // number keys pick the tokens from left to right
          const t = this.targets.slice().sort((a, b) => a.x - b.x)[n - 1];
          if (t && t.delay <= 0 && Math.abs(t.y) < this.view.halfH) this.commit(t, null);
        }
      };
      window.addEventListener("keydown", this.onKey);
    },

    // ---------------------------------------------------------------- frames
    loop(now) {
      if (!this.root || !this.st) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      const slowed = this.slow > 0 ? (this.slow -= dt, dt * 0.3) : dt; // a clean slice plays in slow motion
      if (!this.paused) this.update(slowed);
      this.render();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    },
    update(dt) {
      this.t += dt;
      if (this.st.resize()) this.layout();
      const reduce = A.reducedMotion();
      this.mentorFig.pose(this.mentor === "cheer" ? "cheer" : this.mentor === "sad" ? "sad" : this.mentor === "think" ? "think" : "wave", this.t);
      this.lanterns.forEach((l, i) => { l.rotation.z = Math.sin(this.t * 1.3 + i) * 0.06; });
      const k = Math.min(1, this.items.length / CHALLENGES);
      this.timeK = (this.timeK || 0) + (k - (this.timeK || 0)) * 0.03;
      if (Math.abs(this.timeK - this.mood.time) > 0.002) {
        this.mood.setTime(this.timeK);
        this.lanterns.forEach((l) => { l.children[3].intensity = 8 + 24 * this.timeK; l.children[0].material.emissiveIntensity = 0.9 + 1.2 * this.timeK; });
      }
      this.mood.update(0.016, this.st.camera, -1.2); // petals drift down-wind
      for (const t of this.targets) {
        const o = t.obj.root;
        if (!t.frozen) {
          if (t.delay > 0) { t.delay -= dt; continue; }
          o.visible = true;
          t.y -= t.vy * dt;
          t.sway += dt * 1.7;
          if (!reduce) { o.rotation.y = Math.sin(t.sway) * 0.45; o.rotation.z = Math.sin(t.sway * 0.7) * 0.15; }
        } else if (t.state === "tapped") {
          t.tap += dt;
          const k = t.tap;
          const e = k < 0.22 ? 0 : Math.exp(-(k - 0.22) * 5) * Math.sin((k - 0.22) * 22);
          o.scale.set(1 + e * 0.16, 1 - e * 0.16, 1);
          o.position.y = t.y + Math.max(0, Math.sin(Math.min(1, k / 0.7) * Math.PI)) * t.r * 0.4;
          // the glove: in, a light tap, out again
          const reach = k < 0.22 ? k / 0.22 : k < 0.45 ? 1 : Math.max(0, 1 - (k - 0.45) / 0.35);
          this.gloveMesh.position.set(t.x + t.from * t.r * (2.6 - 1.2 * reach), t.y + t.r * 0.1, 0.4);
          this.gloveMesh.visible = reach > 0.02;
          if (k > 0.22 && !t.starred) { t.starred = true; this.sparks.burst(t.x, t.y + t.r, 0.4, "#ffd34d", 24, 3, 0.8, 2); }
        } else if (t.shake > 0) {
          t.shake = Math.max(0, t.shake - dt * 1.6);
          o.position.x = t.x + Math.sin(this.t * 40) * 0.12 * t.shake;
        }
        if (!t.frozen || t.state !== "tapped") o.position.y = t.y;
      }
      for (const p of this.parts) {
        p.vy -= 14 * dt;
        p.obj.root.position.x += p.vx * dt; p.obj.root.position.y += p.vy * dt; p.obj.root.position.z += p.vz * dt;
        p.obj.root.rotation.z += p.spin * dt; p.obj.root.rotation.x += dt * 2;
      }
      if (this.ring.material.opacity > 0) { this.ringT += dt; this.ring.scale.setScalar(this.ring.scale.x + dt * 2.2); this.ring.material.opacity = Math.max(0, 0.9 - this.ringT * 1.1); }
      this.sparks.update(dt);
      // everything fell past the bottom without an answer: the same tokens drop again (not a mistake)
      if (this.phase === "falling" && this.targets.length && this.targets.every((t) => t.delay <= 0 && t.y < -this.view.halfH - t.r * 1.5)) {
        this.banner("Yana bir bor!", "good");
        this.drop(false);
      }
    },
    render() {
      if (!this.st) return;
      this.st.render();
      this.drawTrail();
    },
    drawTrail() {
      const c = this.trailEl, r = this.stageEl.getBoundingClientRect();
      if (c.width !== Math.round(r.width) || c.height !== Math.round(r.height)) { c.width = Math.round(r.width); c.height = Math.round(r.height); }
      const g = c.getContext("2d");
      g.clearRect(0, 0, c.width, c.height);
      const now = performance.now();
      const pts = (this.trail || []).filter((p) => now - p.t < 170);
      this.trail = pts;
      if (pts.length < 2) return;
      g.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        g.strokeStyle = `rgba(255,255,255,${0.25 + 0.7 * i / pts.length})`;
        g.lineWidth = 2 + 10 * i / pts.length;
        g.beginPath(); g.moveTo(pts[i - 1].x, pts[i - 1].y); g.lineTo(pts[i].x, pts[i].y); g.stroke();
      }
    },

    // ---------------------------------------------------------------- the end
    finish() {
      if (this.phase === "results") return;
      this.phase = "results";
      A.Ckpt.clear("ninja");
      this.clearTargets();
      this.root.querySelector("[data-prompt]").hidden = true;
      A.finishSession(this.s, { challenges: this.items }, !this.items.length);
      this.hud();
      const right = this.items.filter((it) => it.w === it.p).length;
      this.mentor = right >= this.items.length / 2 ? "cheer" : "wave";
      const el = A.overlay(this.root, `<div class="ac-results ac-start">${A.shk(right >= this.items.length / 2 ? "celebrate" : "encourage", 120)}
        <h3>${this.items.length >= CHALLENGES ? "Ajoyib!" : "O'yin yakunlandi"}</h3>
        <div class="ac-stats"><div class="ac-stat"><small>To'g'ri javoblar</small><b>${right}/${this.items.length}</b></div>
          <div class="ac-stat"><small>Aniqlik</small><b>${A.accuracy(right, this.items.length)}</b></div>
          <div class="ac-stat"><small>O'yin ballari</small><b>${this.score}</b></div>
          <div class="ac-stat"><small>Yangi so'z bonusi</small><b data-ac="bonus">0</b></div></div>
        <p class="ac-receipt" data-ac="receipt"></p><div data-ac="words"></div>
        <div class="ac-actions">${A.btn("Qayta o'ynash", 'data-ac="again"', "is-primary")}${A.btn("Lug'at", 'data-ac="dict"')}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      A.paintShk(el);
      A.receiptLine(el.querySelector('[data-ac="receipt"]'), this.s);
      A.wordList(el.querySelector('[data-ac="words"]'), this.s, this.items.map((it) => it.w));
      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "again") { el.remove(); this.begin(null); }
        else if (b.dataset.ac === "dict") A.openDictionary();
        else if (b.dataset.ac === "exit") A.close();
      });
    },
    pause() {
      if (this.paused || !["prompt", "falling", "resolve", "reveal"].includes(this.phase)) return;
      this.paused = true;
      clearTimeout(this.timer);
      const phase = this.phase;
      A.pauseMenu(this.root, {
        resume: () => {
          this.paused = false;
          this.last = performance.now();
          if (phase === "prompt") this.timer = setTimeout(() => this.drop(true), 600);
          if (phase === "resolve") this.timer = setTimeout(() => this.reveal(this.lastOk), 600);
        },
        restart: () => { this.paused = false; this.endEarly(); this.root.querySelectorAll(".ac-overlay").forEach((o) => o.remove()); this.begin(null); },
        exit: () => { this.paused = false; this.endEarly(); A.close(); },
      });
    },
    endEarly() {
      this.phase = "results";
      A.Ckpt.clear("ninja");
      this.clearTargets();
      A.finishSession(this.s, { challenges: this.items }, !this.items.length);
    },
    banner(text, kind) {
      const el = this.root && this.root.querySelector("[data-banner]");
      if (!el) return;
      el.textContent = text;
      el.className = "ac-banner is-on is-" + (kind || "good");
      clearTimeout(this.bannerT);
      this.bannerT = setTimeout(() => { el.className = "ac-banner"; }, 1100);
    },
  };

  A.register("ninja", G);
})(window, document);
