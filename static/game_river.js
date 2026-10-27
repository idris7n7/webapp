/* Daryodan o'tish — Jigar! (L1_Arcade game "river"): bring the things you are asked for across the river by boat.
 *
 * An Uzbek instruction ("Onangiz bugun osh damlamoqchi ekan. Kerakli narsalarni oling, jigar!") and a list of what is
 * needed, in Uzbek. The market on the left bank shows pictures with their English names (at B1+ the English name only).
 * Tapping a needed thing puts it in the boat and shows its English word, pronunciation and an example; tapping a thing
 * that is not on the list marks it "not needed" (a small penalty). The boat holds three; "Suzish" rows it to the home
 * bank, where the things are counted, and back again. 20 things per session (several errands).
 * There is no art pack for this game: the river, banks, boat and stall are drawn here (SVG), the house comes from the
 * Word Run pack and the rower is the student's hero (a still picture of the 3D figure, L1_3D.portrait).
 */
(function (window, document) {
  "use strict";
  const A = window.L1_Arcade;
  if (!A) return;
  const esc = A.esc;
  const ITEMS = 20, BOAT = 3;
  const RULES = { right: 10, wrong: 5 }; // the server pays by the same numbers (server.py ARCADE_POINTS)

  const WORLD = `<svg class="rv-world" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="rvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#dff2ff"/></linearGradient>
      <linearGradient id="rvWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#44b0e6"/><stop offset="1" stop-color="#1c6fb8"/></linearGradient>
      <linearGradient id="rvGrassL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd16a"/><stop offset="1" stop-color="#5fae45"/></linearGradient>
      <linearGradient id="rvGrassR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd16a"/><stop offset="1" stop-color="#5fae45"/></linearGradient>
    </defs>
    <rect width="800" height="400" fill="url(#rvSky)"/>
    <circle cx="660" cy="62" r="34" fill="#ffd84d"/><circle cx="660" cy="62" r="46" fill="#ffd84d" opacity=".25"/>
    <path d="M110 70c12-14 40-14 50 0 18-6 34 6 30 20H96c-8-10 2-22 14-20z" fill="#fff" opacity=".9"/>
    <path d="M420 48c10-12 34-12 42 0 15-5 28 5 25 17h-77c-7-9 1-18 10-17z" fill="#fff" opacity=".8"/>
    <path d="M0 210 Q120 150 250 190 T520 180 T800 200 V260 H0Z" fill="#a8d98a"/>
    <path d="M0 230 Q160 190 300 225 T620 215 T800 230 V280 H0Z" fill="#93cb76"/>
    <rect x="0" y="250" width="800" height="150" fill="url(#rvWater)"/>
    <g class="rv-wave" stroke="#cfeeff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75">
      <path d="M200 290q15-8 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0"/>
      <path d="M170 330q15-8 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0"/>
      <path d="M220 370q15-8 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0"/>
    </g>
    <path d="M0 236 Q140 226 262 250 Q246 320 270 400 H0Z" fill="url(#rvGrassL)"/>
    <path d="M262 250 Q246 320 270 400 h-14 Q232 320 248 252Z" fill="#e8c98d"/>
    <path d="M800 236 Q660 226 538 250 Q554 320 530 400 H800Z" fill="url(#rvGrassR)"/>
    <path d="M538 250 Q554 320 530 400 h14 Q568 320 552 252Z" fill="#e8c98d"/>
    <rect x="236" y="300" width="40" height="10" rx="3" fill="#8a5a2b"/><rect x="242" y="306" width="6" height="40" fill="#6b4320"/><rect x="264" y="306" width="6" height="40" fill="#6b4320"/>
    <rect x="524" y="300" width="40" height="10" rx="3" fill="#8a5a2b"/><rect x="530" y="306" width="6" height="40" fill="#6b4320"/><rect x="552" y="306" width="6" height="40" fill="#6b4320"/>
  </svg>`;
  const STALL = `<svg viewBox="0 0 200 170" aria-hidden="true"><rect x="22" y="70" width="10" height="95" fill="#8a5a2b"/><rect x="168" y="70" width="10" height="95" fill="#8a5a2b"/>
    <path d="M10 70 L30 20 H170 L190 70Z" fill="#fff6e6"/><path d="M30 20h20L42 70H10zM70 20h20l-4 50H62zM110 20h20l4 50h-24zM150 20h20l20 50h-32z" fill="#ff8a3d"/>
    <path d="M10 70h180v10H10z" fill="#e2702c"/><rect x="16" y="110" width="168" height="16" rx="4" fill="#b7793a"/><rect x="24" y="126" width="152" height="40" fill="#9c6630"/>
    <ellipse cx="60" cy="108" rx="26" ry="10" fill="#d9a35a"/><circle cx="52" cy="100" r="9" fill="#ff5a4e"/><circle cx="66" cy="99" r="8" fill="#ffb02e"/>
    <ellipse cx="140" cy="108" rx="26" ry="10" fill="#d9a35a"/><circle cx="132" cy="101" r="8" fill="#7ac943"/><circle cx="146" cy="100" r="9" fill="#ff8a3d"/>
    <text x="100" y="52" text-anchor="middle" font-size="22" font-weight="800" fill="#7a3c0c" font-family="Plus Jakarta Sans, sans-serif">BOZOR</text></svg>`;
  const BOAT_SVG = `<svg viewBox="0 0 220 90" aria-hidden="true"><path d="M8 26 H212 L188 80 H32Z" fill="#a8652d"/><path d="M8 26 H212 L206 40 H14Z" fill="#c98544"/>
    <path d="M22 52 H198 M28 66 H192" stroke="#8a4f1f" stroke-width="3"/><path d="M8 26 H212" stroke="#6e3c14" stroke-width="5" stroke-linecap="round"/>
    <path d="M150 20 L206 -6" stroke="#6e3c14" stroke-width="6" stroke-linecap="round"/><path d="M200 -10 l14 -6 4 10 -14 6z" fill="#c98544"/></svg>`;

  const G = {
    open(root) {
      this.root = root;
      Object.assign(this, { phase: "start", paused: false, busy: false, wrong: 0, got: [], boat: [] });
      root.innerHTML = `<div class="rv">
        <div class="rv-scene">${WORLD}<div class="rv-stall">${STALL}</div>
          <img class="rv-house" src="${A.asset("common/house_open.webp")}" alt="Uy">
          <div class="rv-bubble" data-bubble hidden></div>
          <div class="rv-boat" data-boat><div class="rv-boat-in"><span class="rv-rower" data-rower></span><div class="rv-cargo" data-cargo></div>${BOAT_SVG}</div></div>
        </div>
        <div class="rv-panel"><div class="rv-task"><p data-task></p><div class="rv-list" data-list></div></div></div>
        <div class="rv-market"><h3><span data-market-title>Bozor — chap qirg'oq</span><button type="button" class="ac-btn is-primary is-small" data-ac="sail" disabled>Suzish ⛵</button></h3>
          <div class="rv-items" data-items></div></div>
      </div>
      <div class="ac-hud"><span class="ac-pill is-title">Jigar!</span><span class="ac-pill" data-hud="n">0/${ITEMS}</span>
        <span class="ac-pill" data-hud="score">0 ball</span><span class="ac-hud-fill"></span>${A.hudButtons()}</div>
      <div class="ac-banner" data-banner></div>`;
      root.querySelector(".ac-hud").addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ac]");
        if (!b) return;
        if (b.dataset.ac === "mute") A.toggleMute(b);
        if (b.dataset.ac === "pause") this.pause();
      });
      root.querySelector(".rv").addEventListener("click", (ev) => this.click(ev));
      this.onKey = (ev) => { if (ev.key === "Escape" && this.root) this.pause(); };
      window.addEventListener("keydown", this.onKey);
      A.loadWithUi(root, "Daryodan o'tish", ["common/house_open.webp"].concat(
        window.ARCADE_DATA.vocab.filter((w) => w.pic.startsWith("t:")).map((w) => A.picPath(w)))).then(() => {
        this.paintRower();
        this.startScreen();
      });
    },
    destroy() {
      clearTimeout(this.timer);
      window.removeEventListener("keydown", this.onKey);
      this.root = null;
    },
    onBack() {
      if (this.phase === "play" && !this.paused) { this.pause(); return true; }
      return false;
    },
    $(sel) { return this.root.querySelector(sel); },
    // the hero sitting in the boat, oars in hand (needs three.js for the picture; the boat sails without it)
    paintRower() {
      A.need3D().then(() => {
        const el = this.root && this.root.querySelector("[data-rower]");
        if (!el) return;
        const p = window.L1_3D.portrait(A.heroId(), "row", 120);
        el.innerHTML = `<img src="${p.url}" alt="" draggable="false">`;
      }, () => {});
    },

    // ---------------------------------------------------------------- start: the errands of this session
    startScreen() {
      this.phase = "start";
      const saved = A.Ckpt.get("river");
      const ck = saved && Array.isArray(saved.got) ? saved : null;
      const el = A.overlay(this.root, `<div class="ac-start">${A.shk("thumbs_up", 150)}<h2>Daryodan o'tish — Jigar!</h2>${A.heroPicker()}
        <ul class="ac-rules"><li>Topshiriqni o'qing: ro'yxatdagi narsalar kerak.</li>
          <li>Bozordan keraklilarini bosing — ular qayiqqa tushadi (bir safarda ${BOAT} ta). Ro'yxatda yo'q narsa — xato.</li>
          <li>«Suzish» tugmasi bilan daryodan o'tib, uyga olib boring. Jami ${ITEMS} ta narsa.</li></ul>
        <span class="ac-lvl-line">Daraja: <b>${A.levelName(A.level())}</b></span>
        <div class="ac-actions is-col">${ck ? A.btn(`Davom ettirish (${ck.got.length}/${ITEMS})`, 'data-ac="resume"', "is-primary") : ""}
          ${A.btn(ck ? "Yangi o'yin" : "Boshlash", 'data-ac="new"', ck ? "" : "is-primary")}${A.btn("Chiqish", 'data-ac="exit"', "is-ghost")}</div></div>`);
      A.paintShk(el);
      A.bindHeroPicker(el, () => this.paintRower());
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
      this.$("[data-boat]").classList.remove("is-right");
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
      this.$("[data-cargo]").innerHTML = [0, 1, 2].map((i) => `<span>${this.boat[i] ? A.picHtml(A.word(this.boat[i])) : ""}</span>`).join("");
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
        setTimeout(() => this.drawMarket(), 380);
        this.hud();
        this.checkpoint();
        return;
      }
      if (this.boat.length >= BOAT) { this.banner("Qayiq to'la — suzing!", "bad"); return; }
      this.boat.push(id);
      A.sfx.right();
      A.haptic("ok");
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
    sail() {
      if (this.busy || !this.boat.length) return;
      this.busy = true;
      this.closeInfo();
      this.syncSail();
      A.sfx.splash();
      const boat = this.$("[data-boat]");
      boat.classList.add("is-right");
      this.timer = setTimeout(() => this.unload(), A.reducedMotion() ? 100 : 1650);
    },
    unload() {
      if (!this.root) return;
      const n = this.boat.length;
      this.boat.forEach((id) => this.got.push([this.mi, id]));
      this.boat = [];
      A.sfx.coin();
      this.bubble(`Rahmat, jigar! +${n * RULES.right}`);
      this.drawList();
      this.hud();
      this.checkpoint();
      const m = this.mission();
      const missionDone = m.need.every((id) => this.isHome(id));
      if (this.got.length >= ITEMS) {
        A.Ckpt.clear("river");
        A.finishSession(this.s, { items: this.ids(), wrong: this.wrong }); // all brought home: report before the goodbye
        this.timer = setTimeout(() => this.finish(), 1100);
        return;
      }
      // row back to the market bank
      this.timer = setTimeout(() => {
        if (!this.root) return;
        this.$("[data-boat]").classList.remove("is-right");
        this.timer = setTimeout(() => {
          if (!this.root) return;
          this.busy = false;
          if (missionDone) {
            A.sfx.finish();
            this.mi++;
            this.startMission();
          } else { this.drawMarket(); this.bubble(null); }
        }, A.reducedMotion() ? 100 : 1650);
      }, 900);
    },
    bubble(text) {
      const b = this.$("[data-bubble]");
      b.hidden = !text;
      b.textContent = text || "";
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
        resume: () => { this.paused = false; },
        restart: () => { this.paused = false; this.endEarly(); this.begin(null); },
        exit: () => { this.paused = false; this.endEarly(); A.close(); },
      });
    },
    // leaving early: things already brought home count; things still in the boat do not
    endEarly() {
      clearTimeout(this.timer);
      this.busy = false;
      this.closeInfo();
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
