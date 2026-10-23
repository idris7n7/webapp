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

  window.L1_TreeArt = { KINDS, svg, growing, name: (kind) => (KINDS[kind] || KINDS.oak).name, color: (kind, wilted) => (wilted ? WILT : (KINDS[kind] || KINDS.oak)).c1 };
})();
