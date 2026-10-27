/* The pictures of the trees of Yashil shahar: six common kinds, three rare ones (unlocked by finished Pomodoros) and
 * the wilted look. One function draws every tree as a small SVG (viewBox 40x48, roots at the bottom centre).
 *
 *   L1_TreeArt.svg(kind, stage, wilted)  stage 0 sapling .. 3 old tree
 *   L1_TreeArt.growing(progress)         the tree in the floating Pomodoro button, 0..1 of the 25 minutes
 */
(function () {
  "use strict";

  // name: what the student reads; c0 darkest (underside), c1 body, c2 lit side
  const KINDS = {
    oak: { name: "Eman", c0: "#1f7a41", c1: "#2f9e55", c2: "#58c47a" },
    pine: { name: "Qarag'ay", c0: "#14603a", c1: "#1f7a4a", c2: "#3aa468" },
    cherry: { name: "Gilos", c0: "#e0709a", c1: "#f08fb2", c2: "#ffc2d8" },
    poplar: { name: "Terak", c0: "#2f8040", c1: "#3a9a4a", c2: "#68c46e" },
    apple: { name: "Olma", c0: "#2f8f49", c1: "#3fae5a", c2: "#72d388" },
    plane: { name: "Chinor", c0: "#7fa22c", c1: "#9bbf3a", c2: "#c5e063" },
    blossom: { name: "Gullagan olma", c0: "#e87aa6", c1: "#fbb4cf", c2: "#fff0f6", rare: true },
    gold: { name: "Oltin chinor", c0: "#d98a0c", c1: "#f5b82e", c2: "#ffe27a", rare: true },
    magic: { name: "Sehrli daraxt", c0: "#3b3fb8", c1: "#6a6df5", c2: "#a9b3ff", rare: true },
  };
  const WILT = { c0: "#7d7455", c1: "#a59b72", c2: "#c4bb92" };
  const TRUNK = "#8a5a2b", TRUNK_DARK = "#6b4420";

  const star = (x, y, r, fill) => `<path d="M${x} ${y - r}l${r * 0.28} ${r * 0.72}l${r * 0.72} ${r * 0.28}l-${r * 0.72} ${r * 0.28}l-${r * 0.28} ${r * 0.72}l-${r * 0.28} -${r * 0.72}l-${r * 0.72} -${r * 0.28}l${r * 0.72} -${r * 0.28}Z" fill="${fill}"/>`;

  function crown(kind, c, stage, wilted) {
    const dot = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
    let s = "";
    if (kind === "pine") {
      s = `<path d="M20 2 33 18H7Z" fill="${c.c1}"/><path d="M20 10 36 29H4Z" fill="${c.c0}"/><path d="M20 20 38 41H2Z" fill="${c.c1}"/>
        <path d="M20 2 7 18h7Z" fill="${c.c2}"/><path d="M20 10 4 29h8Z" fill="${c.c2}" opacity=".8"/><path d="M20 20 2 41h9Z" fill="${c.c2}" opacity=".7"/>`;
    } else if (kind === "poplar") {
      s = `<ellipse cx="20" cy="22" rx="10" ry="20" fill="${c.c0}"/><ellipse cx="19" cy="21" rx="9" ry="19" fill="${c.c1}"/>
        <ellipse cx="15.5" cy="22" rx="4.2" ry="13" fill="${c.c2}" opacity=".85"/>`;
    } else if (kind === "plane" || kind === "gold") {
      s = `${dot(12, 24, 9, c.c0)}${dot(28, 24, 9, c.c0)}${dot(20, 15, 12.5, c.c0)}
        ${dot(12, 22, 8.4, c.c1)}${dot(28, 22, 8.4, c.c1)}${dot(20, 13.5, 12, c.c1)}
        ${dot(14, 14, 5.6, c.c2)}${dot(9, 22, 3.6, c.c2)}${dot(24, 10, 3.6, c.c2)}`;
      if (kind === "gold" && !wilted) s += star(31, 10, 4, "#fff6c2") + star(10, 30, 2.6, "#fff6c2");
    } else if (kind === "cherry" || kind === "blossom") {
      s = `${dot(12, 24, 9, c.c0)}${dot(28, 24, 9, c.c0)}${dot(20, 16, 13.5, c.c0)}
        ${dot(12, 22, 8.4, c.c1)}${dot(28, 22, 8.4, c.c1)}${dot(20, 14.5, 13, c.c1)}
        ${dot(15, 13, 6, c.c2)}${dot(26, 20, 4.4, c.c2)}`;
      if (stage >= 2 && !wilted) {
        const white = kind === "cherry" ? "#fff" : "#ffd0e2";
        s += dot(13, 17, 1.7, white) + dot(25, 13, 1.7, white) + dot(21, 24, 1.7, white) + dot(30, 25, 1.5, white) + dot(11, 27, 1.5, white);
        if (kind === "blossom") s += star(32, 8, 4.2, "#fff") + star(8, 14, 3, "#fff");
      }
    } else if (kind === "magic") {
      s = `${dot(12, 24, 9, c.c0)}${dot(28, 24, 9, c.c0)}${dot(20, 15, 13, c.c0)}
        ${dot(12, 22, 8.4, c.c1)}${dot(28, 22, 8.4, c.c1)}${dot(20, 13.5, 12.4, c.c1)}${dot(15, 13, 5.5, c.c2)}`;
      if (!wilted) s += `<g class="ta-twinkle">${star(21, 14, 3.4, "#fff")}${star(11, 24, 2.4, "#ffe27a")}${star(30, 22, 2.6, "#ffe27a")}${star(24, 28, 1.8, "#fff")}</g>`;
    } else { // oak, apple
      s = `${dot(12, 24, 9, c.c0)}${dot(28, 24, 9, c.c0)}${dot(20, 16, 13.5, c.c0)}
        ${dot(12, 22, 8.4, c.c1)}${dot(28, 22, 8.4, c.c1)}${dot(20, 14.5, 13, c.c1)}
        ${dot(15, 13, 6, c.c2)}${dot(9, 22, 3.4, c.c2)}${dot(25, 9, 3.4, c.c2)}`;
      if (kind === "apple" && stage >= 2 && !wilted) s += dot(14, 18, 2.3, "#e5484d") + dot(26, 22, 2.3, "#e5484d") + dot(19, 27, 2.3, "#e5484d") + dot(23, 15, 1.1, "#fff") ;
    }
    return s;
  }

  function trunk(kind) {
    if (kind === "pine") return `<rect x="18.4" y="38" width="3.2" height="7" rx="1.4" fill="${TRUNK}"/>`;
    if (kind === "poplar") return `<path d="M18.2 45 18.8 30h2.4l.6 15Z" fill="${TRUNK}"/>`;
    return `<path d="M17.4 45c.8-5 1-10 .6-16h4c-.4 6 0 11 .8 16Z" fill="${TRUNK}"/><path d="M20.6 45c.4-5 .2-10 0-16H22c-.4 6 0 11 .8 16Z" fill="${TRUNK_DARK}" opacity=".55"/>`;
  }

  function svg(kind, stage, wilted) {
    const k = KINDS[kind] || KINDS.oak;
    const c = wilted ? WILT : k;
    const shadow = `<ellipse cx="20" cy="45.5" rx="${stage === 0 ? 6 : 11}" ry="2.6" fill="rgba(0,0,0,.2)"/>`;
    if (stage === 0) {
      const lf = wilted ? "#a59b72" : "#59c26e", lf2 = wilted ? "#8d8460" : "#3fae5a";
      return `<svg viewBox="0 0 40 48" aria-hidden="true">${shadow}<path d="M20 45V31" stroke="${TRUNK}" stroke-width="3" stroke-linecap="round"/>
        <path d="M20 33c-8 0-12-5-12-10 7 0 12 3 12 10Z" fill="${lf}"/><path d="M20 31c8 0 12-5 12-10-7 0-12 3-12 10Z" fill="${lf2}"/></svg>`;
    }
    const g = stage === 1 ? 0.62 : stage === 2 ? 0.84 : 1;
    let extra = "";
    if (stage === 3 && !wilted) extra = star(33, 6, 3.4, "#ffd34d");
    const fall = wilted ? `<path d="M10 44l2-1.4 1.2 1.6Z" fill="#8d8460"/><path d="M27 45l2.4-1 .8 1.8Z" fill="#8d8460"/><path d="M19 46.6l2-1.2 1 1.4Z" fill="#a59b72"/>` : "";
    return `<svg viewBox="0 0 40 48" aria-hidden="true">${shadow}${trunk(kind)}<g transform="translate(20 45) scale(${g}) translate(-20 -45)">${crown(kind, c, stage, wilted)}${extra}</g>${fall}</svg>`;
  }

  // The little tree of the floating button: it grows while the Pomodoro runs (p = share of the 25 minutes that has passed).
  function growing(p) {
    p = Math.max(0, Math.min(1, p || 0));
    if (p < 0.12) return svg("oak", 0, false);
    const stage = p < 0.45 ? 1 : p < 0.8 ? 2 : 3;
    return svg("oak", stage, false);
  }

  // The big tree of the Yashil shahar card on Asosiy: a puffy 3D-look oak on a stone planter, drawn as vectors so it is
  // sharp at any size (the 160 px picture it replaced looked blurry at ~160 CSS px). Every lobe of the crown has its own
  // light (a gradient in user space), so the bumps on its rim share one shading; small bumps with a soft highlight and a
  // dark lower edge give the cauliflower texture. Built once, viewBox 240x240.
  let cardSvg = "";
  function card() {
    if (cardSvg) return cardSvg;
    const n = (v) => Math.round(v * 10) / 10;
    const C = (x, y, r, fill) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}"/>`;
    const defs = [];
    let gid = 0;
    const FRONT = ["#b9ef84", "#62c447", "#2f963c", "#17672b"], BACK = ["#94dc6a", "#4cad40", "#237d33", "#124f22"];
    function lobe(x, y, R, tone, turn) {
      const id = `hmt${gid++}`;
      defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(x - R * 0.35)}" cy="${n(y - R * 0.45)}" r="${n(R * 1.55)}">` +
        `<stop offset="0" stop-color="${tone[0]}"/><stop offset=".35" stop-color="${tone[1]}"/><stop offset=".7" stop-color="${tone[2]}"/><stop offset="1" stop-color="${tone[3]}"/></radialGradient>`);
      const fill = `url(#${id})`;
      let s = C(x, y, R * 0.8, fill);
      const rim = Math.max(7, Math.round(R / 3.2));
      for (let i = 0; i < rim; i++) {
        const a = (i / rim) * 2 * Math.PI + turn;
        s += C(x + Math.cos(a) * R * 0.7, y + Math.sin(a) * R * 0.66, R * (0.28 + 0.04 * Math.sin(i * 2.7 + turn)), fill);
      }
      // texture bumps spread evenly (sunflower spiral); the upper ones first, so the lower ones overlap them
      const bumps = [], cnt = Math.round((R * R) / 60);
      for (let i = 0; i < cnt; i++) {
        const d = R * 0.82 * Math.sqrt((i + 0.5) / cnt), a = i * 2.39996 + turn;
        bumps.push([y + Math.sin(a) * d * 0.95, x + Math.cos(a) * d, R * (0.17 + 0.04 * Math.sin(i * 1.3 + turn))]);
      }
      bumps.sort((p, q) => p[0] - q[0]).forEach(([by, bx, br]) => { s += C(bx, by, br, "url(#hmtB)"); });
      return s;
    }
    function flower(x, y, k) {
      let s = "";
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        s += C(x + Math.cos(a) * 3.1 * k, y + Math.sin(a) * 2.5 * k, 2.6 * k, "url(#hmtP)");
      }
      return s + C(x, y, 1.9 * k, "#f6b21b");
    }

    // stone planter: the side band with seams, the rim with seams, the grass
    const px = 120, py = 194, rx = 100, ry = 22, h = 15, irx = rx - 13, iry = ry - 5;
    let planter = `<path d="M${px - rx} ${py}A${rx} ${ry} 0 0 0 ${px + rx} ${py}V${py + h}A${rx} ${ry} 0 0 1 ${px - rx} ${py + h}Z" fill="url(#hmtS)"/>`;
    for (let k = 1; k < 9; k++) {
      const a = (Math.PI * k) / 9;
      planter += `<path d="M${n(px - Math.cos(a) * rx)} ${n(py + Math.sin(a) * ry + 1)}v${h - 1}" stroke="#8e8879" stroke-width="1.4" opacity=".55"/>`;
    }
    planter += `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" fill="url(#hmtR)"/>`;
    for (let k = 0; k < 12; k++) {
      const a = (2 * Math.PI * k) / 12 + 0.2;
      planter += `<path d="M${n(px + Math.cos(a) * rx)} ${n(py + Math.sin(a) * ry)}L${n(px + Math.cos(a) * irx)} ${n(py + Math.sin(a) * iry)}" stroke="#b9b3a4" stroke-width="1.3"/>`;
    }
    planter += `<ellipse cx="${px}" cy="${py - 1}" rx="${irx}" ry="${iry}" fill="url(#hmtG)"/>`;

    const trunk = `<path d="M94 199c10-4 13-13 13-28v-19c-9-10-21-17-34-22l5-6c12 4 23 11 31 18l2-34h17l1 32c9-9 21-16 34-20l4 6c-13 6-24 13-31 23v22c0 15 3 23 13 28-9 2-17 1-23-3-6 4-15 5-32 3z" fill="url(#hmtT)"/>` +
      `<path d="M124 112v62c0 9 2 16 6 21" stroke="#d29455" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".5"/>` +
      `<path d="M112 150c0 14-1 28-5 40M131 140c-1 16 0 30 3 46" stroke="#5a3016" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".45"/>` +
      `<ellipse cx="121" cy="140" rx="30" ry="9" fill="url(#hmtH)"/>`;

    const crown = [[58, 112, 32, BACK, 0.2], [184, 106, 34, BACK, 1.1], [90, 60, 34, BACK, 2.0], [152, 54, 36, BACK, 2.9], [122, 40, 30, BACK, 0.6],
      [78, 104, 32, FRONT, 0.7], [164, 96, 33, FRONT, 1.7], [118, 72, 36, FRONT, 2.4], [122, 118, 30, FRONT, 3.3]].map((l) => lobe(...l)).join("");
    const BUSH = ["#b6ea8c", "#68c150", "#33913d", "#1d6a2e"];
    const backBushes = lobe(48, 176, 20, BUSH, 0.4) + lobe(194, 174, 21, BUSH, 1.3);
    const front = lobe(72, 192, 10, BUSH, 0.9) + lobe(170, 192, 10, BUSH, 2.1) +
      [[92, 196, 1.15], [150, 197, 1.15], [58, 186, 0.9], [184, 185, 0.9], [132, 203, 0.8]].map(([x, y, k]) => flower(x, y, k)).join("");

    defs.push(`<radialGradient id="hmtB" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".42" stop-color="#fff" stop-opacity=".06"/>` +
        `<stop offset=".78" stop-color="#0b4a17" stop-opacity="0"/><stop offset="1" stop-color="#0b4a17" stop-opacity=".26"/></radialGradient>`,
      `<linearGradient id="hmtT" gradientUnits="userSpaceOnUse" x1="100" x2="146"><stop offset="0" stop-color="#5e3418"/><stop offset=".45" stop-color="#a26834"/><stop offset=".7" stop-color="#bd7d44"/><stop offset="1" stop-color="#6e3f1d"/></linearGradient>`,
      `<linearGradient id="hmtS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8d3c6"/><stop offset="1" stop-color="#a39d8f"/></linearGradient>`,
      `<linearGradient id="hmtR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1e8"/><stop offset="1" stop-color="#dcd7ca"/></linearGradient>`,
      `<radialGradient id="hmtG" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#8fd468"/><stop offset="1" stop-color="#3f9637"/></radialGradient>`,
      `<radialGradient id="hmtP" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e3e6dc"/></radialGradient>`,
      `<radialGradient id="hmtH"><stop offset="0" stop-color="#0d3a16" stop-opacity=".45"/><stop offset="1" stop-color="#0d3a16" stop-opacity="0"/></radialGradient>`);
    cardSvg = `<svg class="l1-tree-card" viewBox="0 0 240 240" aria-hidden="true"><defs>${defs.join("")}</defs>` +
      `<ellipse cx="120" cy="216" rx="108" ry="16" fill="url(#hmtH)"/>${planter}${backBushes}${trunk}${crown}${front}</svg>`;
    return cardSvg;
  }

  window.L1_TreeArt = { KINDS, svg, growing, card, name: (kind) => (KINDS[kind] || KINDS.oak).name, color: (kind, wilted) => (wilted ? WILT : (KINDS[kind] || KINDS.oak)).c1 };
})();
