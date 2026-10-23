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

  window.L1_Shakespeare = {
    portrait: function (size, pose) { return portraitHtml(size || 90, pose); },
    react: react,
    greeter: function (size) { return portraitHtml(size || 124); },
    greeting: GREETING,
    quote: function (mode) { const a = QUOTES[mode]; return a[Math.floor(Math.random() * a.length)][0]; },
    quotes: function (mode) { return QUOTES[mode].map((q) => q[0]); },
  };
})();