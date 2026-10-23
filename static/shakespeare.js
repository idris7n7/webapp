// Shakespeare mascot. He speaks Uzbek; each quote is [uzbek, original english or null, play or null].
(function () {
  const QUOTES = {
    learn: [
      ["So'z, so'z, so'z! Lug'atni yodlamasang, so'zlar sendan qochadi.", "Words, words, words.", "Hamlet"],
      ["Aqlli ahmoq bo'lgan afzal, ahmoq aqlli bo'lgandan.", "Better a witty fool than a foolish wit.", "Twelfth Night"],
      ["Men vaqtni bekor sarfladim, endi vaqt meni sarflayapti. Sen esa hozir o'qi!", "I wasted time, and now doth time waste me.", "Richard II"],
      ["Grammatika — uzun drama, lekin oxiri baxtli: sen 100 ball olasan!", null, null],
      ["Men 37 ta pyesa yozdim, sen esa bitta unitni o'qishga erinyapsanmi?", null, null],
    ],
    practice: [
      ["Bu jinnilik bo'lsa ham, uning ichida tizim bor. Mashq qilishda davom et!", "Though this be madness, yet there is method in't.", "Hamlet"],
      ["Voy xudo, bu odamlar naqadar ahmoq! (Xatodan keyin xafa bo'lma, qayta urinib ko'r.)", "Lord, what fools these mortals be!", "A Midsummer Night's Dream"],
      ["Xato qilish — tragediya emas, komediya. Kul, va yana urin!", null, null],
      ["Men ham qo'lyozmamni 100 marta o'chirganman. Mashq — mukammallik onasi.", null, null],
      ["Ikki xatodan keyin maslahat chiqadi. Ustozdan ham yaxshi do'st topilmaydi!", null, null],
    ],
    homework: [
      ["Bo'lish yoki bo'lmaslik — mana, uy vazifasi masalasi! Men ikkinchisini tanlamayman.", null, null],
      ["«Vazifani ertaga qilaman» degan kishi ertangi kunni hech kutib ololmaydi: ertaga yana ertaga bo'ladi!", null, null],
      ["«Itim yeb qo'ydi» degan bahonani men ham yozganman. Lekin u paytlarda it haqiqatan bor edi!", null, null],
      ["Qalam qo'lingda, vazifa oldingda — Romeo Julyettaga shuncha tez yugurmagan!", null, null],
      ["Vazifa bajarilmasa — tragediya boshlanadi. Bajarilsa — komediya. Men komediyani yaxshi ko'raman!", null, null],
      ["Do'stlarim, quloq tuting: vazifa qilmagan o'quvchi — pardasiz teatr!", null, null],
      ["Daftaring ochiq, telefoning yopiq bo'lsa, ustoz ham, Shekspir ham xursand!", null, null],
      ["Uy vazifasi shu qadar uzun ediki, men uni hatto «Hamlet»dan ham uzunroq deb o'yladim.", null, null],
    ],
    games: [
      ["O'yin — eng yaxshi dars! Men «Globus» teatrida butun shaharni o'ynatganman. Qani, tanla!", null, null],
      ["Ball uchun o'ynayapsanmi yoki shon-sharaf uchun? Men ikkalasi uchun ham!", null, null],
      ["Yutsang — komediya, yutqazsang ham komediya: kulib, qayta o'yna!", null, null],
      ["O'yin: «Bo'lish yoki bo'lmaslik» emas, «yutish yoki yana urinish»!", null, null],
      ["Diqqat bilan javob ber — to'p ham, ball ham sening tomonda bo'lsin!", null, null],
    ],
  };

  // ---- Drawn Shakespeare: one body, a pose per situation (same pose names as the mascot code) ----
  const SKIN = "#f6c58f", SKIN_LINE = "#c98a4b", HAIR = "#4a2a17", SLEEVE = "#1e5f8a";

  // Open hand, wrist at (0,0), fingers up.
  const openHand = () => `
    <g stroke="${SKIN_LINE}" stroke-width="1.5" fill="${SKIN}">
      <rect x="-3.5" y="-38" width="7" height="30" rx="3.5" transform="rotate(-26)"/>
      <rect x="-3.5" y="-42" width="7" height="33" rx="3.5" transform="rotate(-9)"/>
      <rect x="-3.5" y="-42" width="7" height="33" rx="3.5" transform="rotate(8)"/>
      <rect x="-3.5" y="-37" width="7" height="29" rx="3.5" transform="rotate(25)"/>
      <rect x="-3.5" y="-24" width="7" height="24" rx="3.5" transform="translate(-10 -2) rotate(-62)"/>
      <ellipse cx="0" cy="-6" rx="15" ry="14"/>
    </g>`;
  // Fist with the index finger raised.
  const pointHand = () => `
    <g stroke="${SKIN_LINE}" stroke-width="1.5" fill="${SKIN}">
      <rect x="-12" y="-62" width="9" height="46" rx="4.5"/>
      <ellipse cx="0" cy="-10" rx="16" ry="14"/>
      <path d="M-4 -20 q10 -5 18 2 M-4 -12 q10 -5 18 2" fill="none"/>
      <rect x="6" y="-16" width="9" height="16" rx="4.5" transform="rotate(35 10 -8)"/>
    </g>`;
  // Fist, thumb up.
  const thumbHand = () => `
    <g stroke="${SKIN_LINE}" stroke-width="1.5" fill="${SKIN}">
      <ellipse cx="0" cy="-8" rx="17" ry="15"/>
      <path d="M-12 -14 h22 M-12 -7 h22 M-11 0 h20" fill="none"/>
      <rect x="-9" y="-44" width="12" height="34" rx="6"/>
    </g>`;

  const arm = (d) => `<path d="${d}" fill="none" stroke="${SLEEVE}" stroke-width="27" stroke-linecap="round"/>`;
  const cuff = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="6" fill="#fff" stroke="#d7d2c4" stroke-width="1.5" transform="rotate(${r} ${x} ${y})"/>`;
  const RELAXED_ARM = arm("M170 214 Q194 236 186 276");

  const FACES = {
    wave:      { brow: "M91 79 q12 -8 24 -2 M129 77 q12 -6 24 2", eye: "open", mouth: "open" },
    pointing:  { brow: "M91 80 q12 -6 24 -1 M129 71 q12 -9 24 -1", eye: "open", mouth: "smirk" },
    thumbsup:  { brow: "M91 79 q12 -8 24 -2 M129 77 q12 -8 24 0", eye: "wink", mouth: "open" },
    celebrate: { brow: "M91 76 q12 -9 24 -3 M129 73 q12 -6 24 3", eye: "happy", mouth: "wide" },
    oops:      { brow: "M91 83 q12 -3 24 -10 M129 73 q12 7 24 10", eye: "open", mouth: "sad" },
  };
  const MOUTHS = {
    open:  `<path d="M107 125 Q120 144 133 125 Z" fill="#8b1d1d"/><path d="M111 133 Q120 142 129 133 Q120 130 111 133Z" fill="#e8736f"/>`,
    wide:  `<path d="M103 124 Q120 154 137 124 Z" fill="#8b1d1d"/><path d="M109 138 Q120 150 131 138 Q120 132 109 138Z" fill="#e8736f"/>`,
    smirk: `<path d="M108 128 Q121 136 135 124" fill="none" stroke="#8b1d1d" stroke-width="3.2" stroke-linecap="round"/>`,
    sad:   `<path d="M109 134 Q120 124 131 134" fill="none" stroke="#8b1d1d" stroke-width="3.2" stroke-linecap="round"/>`,
  };
  const eyesSvg = (kind) => {
    const L = [103, 92], R = [137, 92];
    const arc = ([x, y]) => `<path d="M${x - 8} ${y + 3} Q${x} ${y - 9} ${x + 8} ${y + 3}" fill="none" stroke="#2b1708" stroke-width="3.2" stroke-linecap="round"/>`;
    if (kind === "happy") return arc(L) + arc(R);
    const open = ([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="7" fill="#fff" stroke="#8a5a2b" stroke-width="1"/><circle cx="${x}" cy="${y + 1}" r="4.2" fill="#2b1708"/><circle cx="${x + 1.6}" cy="${y - 1}" r="1.4" fill="#fff"/>`;
    return `<g class="shk-eyes">${open(L)}${kind === "wink" ? arc(R) : open(R)}</g>`;
  };

  const CONFETTI = `<g class="shk-confetti"><path d="M120 12 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#f5b700"/>
      <circle cx="30" cy="40" r="5" fill="#e2434b"/><circle cx="212" cy="46" r="5" fill="#2f5bea"/>
      <rect x="60" y="20" width="10" height="5" rx="2" fill="#10b981" transform="rotate(30 65 22)"/>
      <rect x="170" y="18" width="10" height="5" rx="2" fill="#e2434b" transform="rotate(-25 175 20)"/>
      <circle cx="16" cy="90" r="3.5" fill="#f5b700"/><circle cx="226" cy="98" r="3.5" fill="#10b981"/></g>`;

  const POSE_PARTS = {
    wave: () => `${RELAXED_ARM}${arm("M76 212 Q34 200 44 142")}${cuff(44, 134, -8)}<g class="shk-wave" transform="translate(44 130)">${openHand()}</g>`,
    pointing: () => `${RELAXED_ARM}${arm("M76 214 Q38 236 54 176")}${cuff(54, 168, -10)}<g class="shk-point" transform="translate(54 164)">${pointHand()}</g>`,
    thumbsup: () => `${RELAXED_ARM}${arm("M76 214 Q38 236 54 176")}${cuff(54, 168, -10)}<g class="shk-thumb" transform="translate(54 166)">${thumbHand()}</g>`,
    celebrate: () => `${arm("M76 212 Q28 196 36 132")}${cuff(36, 124, 8)}<g class="shk-cheer-l" transform="translate(36 120)">${openHand()}</g>
      ${arm("M164 212 Q212 196 204 132")}${cuff(204, 124, -8)}<g class="shk-cheer-r" transform="translate(204 120)">${openHand()}</g>`,
    oops: () => `${RELAXED_ARM}${arm("M76 212 Q40 214 56 160")}${cuff(56, 152, -8)}<g class="shk-oops" transform="translate(56 148)">${openHand()}</g>`,
  };

  function svg(pose) {
    const p = POSE_PARTS[pose] ? pose : "wave";
    const f = FACES[p];
    const ruff = Array.from({ length: 13 }, (_, i) => {
      const a = Math.PI * (i / 12);
      return `<circle cx="${(120 + Math.cos(a) * 52).toFixed(1)}" cy="${(180 + Math.sin(a) * 14).toFixed(1)}" r="10" fill="#fff" stroke="#cfe3f1" stroke-width="1.5"/>`;
    }).join("");
    return `<svg viewBox="0 0 240 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="William Shakespeare">
      ${p === "celebrate" ? CONFETTI : ""}
      <path d="M30 272 C30 216 70 192 120 190 C170 192 210 216 210 272 Z" fill="#9c2f3a"/>
      <path d="M60 210 C74 196 96 192 120 214 C144 192 166 196 180 210 L170 232 C150 214 134 214 120 236 C106 214 90 214 70 232Z" fill="${SLEEVE}"/>
      <path d="M120 236 V272" stroke="#f4e2b5" stroke-width="2"/>
      ${[246, 258].map((y) => `<circle cx="120" cy="${y}" r="3.2" fill="#f5b700"/>`).join("")}
      ${POSE_PARTS[p]()}
      <path d="M72 180 Q120 206 168 180 L168 172 L72 172Z" fill="#fff"/>${ruff}
      <path d="M76 98 C56 108 54 146 66 162 C80 170 90 154 88 134 Z M164 98 C184 108 186 146 174 162 C160 170 150 154 152 134 Z" fill="${HAIR}"/>
      <path d="M66 112 q-6 14 4 30 M174 112 q6 14 -4 30" fill="none" stroke="#7a4524" stroke-width="3" stroke-linecap="round"/>
      <path d="M80 96 C80 52 100 40 120 40 C140 40 160 52 160 96 L160 118 C160 146 140 160 120 160 C100 160 80 146 80 118Z" fill="${SKIN}"/>
      <path d="M120 40 C140 40 160 52 160 96 L160 118 C160 146 140 160 120 160Z" fill="#e8a965" opacity=".55"/>
      <path d="M96 58 Q120 50 144 58" fill="none" stroke="#e1a560" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M78 112 C80 150 100 176 120 178 C140 176 160 150 162 112 C152 136 138 138 130 134 L110 134 C102 138 88 136 78 112Z" fill="${HAIR}"/>
      <path d="M113 100 q-6 12 -2 20 q9 4 18 0" fill="none" stroke="#d99655" stroke-width="2.6" stroke-linecap="round"/>
      ${eyesSvg(f.eye)}
      <path d="${f.brow}" fill="none" stroke="${HAIR}" stroke-width="4.2" stroke-linecap="round"/>
      ${MOUTHS[f.mouth]}
      <path d="M120 116 C108 108 94 112 90 124 C100 121 110 123 120 121 C130 123 140 121 150 124 C146 112 132 108 120 116Z" fill="${HAIR}"/>
      <circle cx="79" cy="126" r="4.2" fill="none" stroke="#f5b700" stroke-width="2"/>
    </svg>`;
  }

  // Same figure frame as the mascot (.idris styles in app_theme.css).
  const figHtml = (pose, size, extra) => `<div class="idris shk ${extra || ""}" data-pose="${pose}" style="--idris-size:${size}px"><div class="idris-fig">${svg(pose)}</div></div>`;
  // One picture for every situation: the Shakespeare picture (greeting pose).
  const portraitHtml = (size, pose) => (window.L1 && window.L1.Idris ? window.L1.Idris.html(pose || "wave", size) : "");
  // Each section shows Shakespeare in its own situation (see SCENES in l1_core.js).
  const MODE_POSE = { learn: "glasses", practice: "desk", games: "ball" };

  // Swap pose and play a reaction ("happy" | "no" | "party"), like Idris.react.
  function react(el, pose, mood) {
    if (!el) return;
    const fig = el.querySelector(".idris-fig");
    if (pose && fig && el.getAttribute("data-pose") !== pose) {
      fig.innerHTML = svg(pose);
      el.setAttribute("data-pose", pose);
    }
    el.classList.remove("is-happy", "is-no", "is-party");
    if (mood) {
      void el.offsetWidth; // restart the animation
      el.classList.add("is-" + mood);
    }
  }

  const GREETING = "Assalomu alaykum, jigarlar! Bo'vottimi?";
  const greeterHtml = (size) => figHtml("wave", size, "l1-greeter");

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function build(mode) {
    const list = QUOTES[mode];
    let i = Math.floor(Math.random() * list.length);
    const wrap = document.createElement("div");
    wrap.className = "flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 mt-4";
    const render = () => {
      const [uzq] = list[i]; // only the Uzbek line is shown (the English original stays in QUOTES)
      wrap.innerHTML = `
        <div class="shrink-0">${portraitHtml(78, MODE_POSE[mode])}</div>
        <div class="min-w-0 flex-1">
          <div class="text-[12px] font-black uppercase tracking-wider text-amber-700">Shekspir aytadi</div>
          <p class="text-sm sm:text-base font-bold text-slate-800 mt-0.5">${esc(uzq)}</p>          <button type="button" class="mt-1.5 text-[12px] font-bold text-indigo-600 hover:underline">😄 Yana bir ibora</button>
        </div>`;
      wrap.querySelector("button").onclick = () => {
        i = (i + 1) % list.length;
        render();
        const L = window.L1 && window.L1.Idris;
        if (L) L.react(wrap.querySelector(".idris"), null, "happy"); // keep this section's pose, just bounce
      };
    };
    render();
    return wrap;
  }

  // ---- Streak, progress and leaderboard under the quote ----
  function progressInfo() {
    let total = 0, done = 0;
    try {
      total = (window.FLASHCARDS_DATA || (typeof FLASHCARDS_DATA !== "undefined" ? FLASHCARDS_DATA : [])).length;
      const r = JSON.parse(localStorage.getItem("l1_vocab_flashcard_ratings_v1") || "{}");
      done = Object.values(r).filter((v) => v === "know" || v === "mastered").length;
    } catch (e) {}
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function drawStats(box, data) {
    const L1 = window.L1 || {};
    const h = L1.html || esc;
    const me = data && data.me;
    const pr = progressInfo();
    const meId = me && me.id;
    const top = ((data && data.entries) || []).slice(0, 5);
    const medals = ["🥇", "🥈", "🥉"];
    box.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
          <div class="text-2xl font-black text-orange-600">🔥 ${me ? me.streak || 0 : "–"}</div>
          <div class="text-[12px] font-bold text-slate-500">kun ketma-ket (streak)</div>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
          <div class="text-2xl font-black text-indigo-600">⭐ ${me ? me.weekPoints || 0 : "–"}</div>
          <div class="text-[12px] font-bold text-slate-500">ball (bu hafta)</div>
        </div>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-3">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>📈 Lug'at progressi</span><span>${pr.done} / ${pr.total} so'z · ${pr.pct}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mt-2">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style="width:${pr.pct}%"></div>
        </div>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-black text-slate-800">🏆 Reyting (bu hafta)</span>
          ${me && me.weekRank ? `<span class="text-[12px] font-bold text-indigo-600">Siz: ${me.weekRank}-o'rin</span>` : ""}
        </div>
        ${top.length ? top.map((e, i) => `
          <div class="flex items-center gap-2 py-1 px-1.5 rounded-lg ${e.id === meId ? "bg-indigo-50" : ""}">
            <span class="w-6 text-center text-sm">${medals[i] || e.rank}</span>
            <span class="flex-1 min-w-0 truncate text-[13px] font-bold text-slate-800">${h(e.name)}${e.id === meId ? " (siz)" : ""}</span>
            <span class="text-[13px] font-extrabold text-slate-700">${e.points}</span>
          </div>`).join("") : `<div class="text-[12px] text-slate-400 text-center py-2">${data ? "Hali reyting yo'q." : "Reytingni ko'rish uchun tizimga kiring."}</div>`}
      </div>`;
    // O'rganish (Study) has no leaderboard: drop the last block, keep streak, points and progress.
    if (box.dataset.mode === "learn" && box.lastElementChild) box.lastElementChild.remove();
  }

  function refreshStats(box) {
    drawStats(box, null);
    const api = window.L1 && window.L1.api;
    if (!api) return;
    api("/api/leaderboard?period=week").then((d) => drawStats(box, d)).catch(() => {});
  }

  function buildStats(mode) {
    const box = document.createElement("div");
    box.className = "space-y-2 mt-3";
    box.setAttribute("data-l1-stats", "1");
    box.dataset.mode = mode;
    refreshStats(box);
    return box;
  }
  function mount() {
    [["learnContainer", "learn"], ["practiceContainer", "practice"], ["gamesContainer", "games"]].forEach(([id, mode]) => {
      const el = document.getElementById(id);
      if (el && !el.querySelector("[data-shakespeare]")) {
        const card = build(mode);
        card.setAttribute("data-shakespeare", "1");
        // Study and Practice: the Idris quote card sits at the very top, like on the Vazifalar page.
        card.classList.remove("mt-4");
        el.insertBefore(card, el.firstChild);
        if (mode !== "games") el.appendChild(buildStats(mode));
      }
    });
  }

  // Refresh numbers when the student switches between Study and Practice.
  document.addEventListener("click", (ev) => {
    if (!ev.target.closest("#btnMainLearn, #btnMainPractice, #btnPracticeSubGrammar, #btnPracticeSubVocab")) return;
    setTimeout(() => document.querySelectorAll("[data-l1-stats]").forEach(refreshStats), 400);
  });

  window.L1_Shakespeare = {
    portrait: function (size, pose) { return portraitHtml(size || 90, pose); },
    react: react,
    greeter: function (size) { return portraitHtml(size || 124); },
    greeting: GREETING,
    quote: function (mode) { const a = QUOTES[mode]; return a[Math.floor(Math.random() * a.length)][0]; },
    quotes: function (mode) { return QUOTES[mode].map((q) => q[0]); },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();