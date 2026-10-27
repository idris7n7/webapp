// Flat colour illustrations of the grammar book (grammar_book.js), drawn as vector SVG so they stay sharp at any size
// and no picture files are downloaded. Every drawing lives in a 100 x 100 box; scene() places several of them on one
// canvas: [drawing, x, y, size] (size = width of the 100-box in canvas units, flip with a negative size).
(function (root) {
  "use strict";

  const INK = "#1f2a44";
  const SKIN = { a: "#f6cfae", b: "#e5ad85", c: "#c58758" };
  const HAIR = { dark: "#2b2733", brown: "#6b3e26", blond: "#e3a948", red: "#b5482f", grey: "#c9c6cf" };
  const SHIRT = { blue: "#3b82c4", red: "#e4572e", yellow: "#f2b134", green: "#3faa8a", purple: "#8b7bd1", pink: "#f08aa6", navy: "#2e3a6e", white: "#f7f7fb", teal: "#2fa5b5" };
  const C = { red: "#e5483b", orange: "#f28c28", yellow: "#f6be3b", green: "#5bb15f", leaf: "#4a9e4f", teal: "#2fa5b5", blue: "#3b82c4", sky: "#8fd0f2", navy: "#2e3a6e",
    brown: "#9b6a43", wood: "#c8925a", cream: "#fff3d6", grey: "#b9b6c6", light: "#eceaf2", white: "#ffffff", pink: "#f4a3b8", purple: "#8b7bd1", gold: "#f4c430" };

  const shade = (o) => `fill="#000" fill-opacity="${o || 0.12}"`;
  const line = (d, w, col) => `<path d="${d}" fill="none" stroke="${col || INK}" stroke-width="${w || 2.4}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ---------------------------------------------------------------- people (head and shoulders)
  function person(o) {
    o = o || {};
    const skin = SKIN[o.skin || "a"], hair = HAIR[o.hc || "dark"], shirt = SHIRT[o.shirt || "blue"] || o.shirt;
    const acc = o.acc || [];
    const has = (a) => acc.indexOf(a) > -1;
    let s = "";
    const style = o.hair || "short";
    // hair that falls behind the head
    if (style === "long") s += `<path d="M27 44 C25 18 40 12 50 12 C61 12 76 18 73 44 L76 78 C66 84 34 84 24 78 Z" fill="${hair}"/>`;
    if (style === "bun" || style === "bunlong") s += `<circle cx="50" cy="17" r="10" fill="${hair}"/>`;
    if (style === "bunlong") s += `<path d="M28 44 C26 22 40 16 50 16 C61 16 74 22 72 44 L72 70 C64 74 36 74 28 70 Z" fill="${hair}"/>`;
    // body
    s += `<path d="M12 100 C12 80 28 71 50 71 C72 71 88 80 88 100 Z" fill="${shirt}"/>`;
    s += `<path d="M50 71 C72 71 88 80 88 100 L70 100 C70 86 62 76 50 74 Z" ${shade(0.1)}/>`;
    if (o.stripes) s += [79, 87, 95].map((y) => `<path d="M${y < 85 ? 22 : 14} ${y} H${y < 85 ? 78 : 86}" stroke="${INK}" stroke-width="4" opacity=".8"/>`).join("");
    s += `<rect x="43" y="58" width="14" height="17" rx="5" fill="${skin}"/><rect x="43" y="58" width="14" height="8" ${shade(0.12)}/>`;
    if (!has("scarf")) s += `<path d="M41 72 L50 82 L59 72 Z" fill="#fff" opacity=".9"/>`;
    // head
    s += `<circle cx="30.5" cy="45" r="4.5" fill="${skin}"/><circle cx="69.5" cy="45" r="4.5" fill="${skin}"/>`;
    s += `<ellipse cx="50" cy="42" rx="19.5" ry="21" fill="${skin}"/>`;
    // hair on top
    if (style === "short" || style === "spiky" || style === "neat") {
      s += `<path d="M30.5 44 C28 22 40 16 51 16.5 C63 17 72 25 69.5 44 C67 33 60 28 50 29 C41 30 34 34 30.5 44 Z" fill="${hair}"/>`;
      if (style === "neat") s += `<path d="M30.5 40 C30 24 42 17 52 17 C46 22 40 30 31 40 Z" fill="${hair}"/>`;
      if (style === "spiky") s += `<path d="M33 26 L35 13 L42 22 L47 10 L52 21 L59 11 L61 23 L68 16 L67 30 Z" fill="${hair}"/>`;
    } else if (style === "long" || style === "bunlong") {
      s += `<path d="M30.5 46 C28 22 40 16 50 16.5 C62 17 73 24 69.5 46 C66 32 58 26 50 27 C44 32 36 36 30.5 46 Z" fill="${hair}"/>`;
    } else if (style === "bun") {
      s += `<path d="M30.5 43 C29 23 41 18 50 18 C61 18 71 24 69.5 43 C66 31 58 27 50 27 C42 27 34 31 30.5 43 Z" fill="${hair}"/>`;
    } else if (style === "bald") {
      s += `<path d="M30.5 46 C30 38 32 34 35 31 L36 44 Z M69.5 46 C70 38 68 34 65 31 L64 44 Z" fill="${HAIR.grey}"/>`;
      s += `<path d="M38 30 C42 26 48 25 52 25" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>`;
    }
    if (o.curl) s += line("M50 22 C46 16 52 12 55 16", 2.2, hair);
    if (o.bow) s += `<path d="M64 22 L72 16 L72 28 Z M64 22 L56 16 L56 28 Z" fill="${C.red}"/><circle cx="64" cy="22" r="2.6" fill="#b8302a"/>`;
    // face
    const f = o.face || "smile";
    const eyes = (y) => `<circle cx="43" cy="${y || 44}" r="2.4" fill="${INK}"/><circle cx="57" cy="${y || 44}" r="2.4" fill="${INK}"/>`;
    const cheeks = (c) => `<circle cx="37.5" cy="51.5" r="3.6" fill="${c || "#f2897b"}" opacity=".45"/><circle cx="62.5" cy="51.5" r="3.6" fill="${c || "#f2897b"}" opacity=".45"/>`;
    if (f === "smile") s += eyes() + cheeks() + line("M44.5 52.5 Q50 57.5 55.5 52.5", 2.2);
    else if (f === "grin") s += line("M40 44.5 Q43 41.5 46 44.5") + line("M54 44.5 Q57 41.5 60 44.5") + cheeks() + `<path d="M42.5 51 Q50 51.5 57.5 51 Q57 60 50 60 Q43 60 42.5 51 Z" fill="#7a2a2a"/><path d="M43.6 51.2 H56.4 L56 53.4 H44 Z" fill="#fff"/><path d="M46 58 Q50 55 54 58 Q50 60.5 46 58Z" fill="#e66b6b"/>`;
    else if (f === "sad") s += eyes(45) + line("M39.5 39.5 L45 38") + line("M60.5 39.5 L55 38") + line("M45 57 Q50 53 55 57", 2.2) + `<path d="M40.5 49 Q42 52.5 40.5 54 Q39 52.5 40.5 49Z" fill="#5fb4e8"/>`;
    else if (f === "angry") s += eyes(45) + line("M39 38.5 L46 41") + line("M61 38.5 L54 41") + line("M45 57 Q50 53 55 57", 2.2);
    else if (f === "tired") s += line("M40 45 H46") + line("M54 45 H60") + `<path d="M39.5 48 Q43 50 46.5 48" stroke="#8a86b8" stroke-width="1.6" fill="none"/><path d="M53.5 48 Q57 50 60.5 48" stroke="#8a86b8" stroke-width="1.6" fill="none"/>` + `<ellipse cx="50" cy="55.5" rx="2.4" ry="2" fill="${INK}"/>`;
    else if (f === "wow") s += eyes() + cheeks() + `<ellipse cx="50" cy="55" rx="3" ry="3.8" fill="#7a2a2a"/>`;
    else if (f === "cold") s += eyes() + cheeks("#7cc3ef") + line("M43 55 q1.75 -2 3.5 0 t3.5 0 t3.5 0 t3.5 0", 2);
    else if (f === "neutral") s += eyes() + cheeks() + line("M46 54.5 H54", 2.2);
    else if (f === "cheeky") s += eyes() + cheeks() + line("M43 52 Q50 58 57 52", 2.2) + `<path d="M48 55.5 Q50 61 53 55.6 Z" fill="#e66b6b"/>`;
    // accessories
    if (has("glasses")) s += `<circle cx="43" cy="44" r="6.3" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2"/><circle cx="57" cy="44" r="6.3" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2"/>` + line("M49.3 44 H50.7", 2);
    if (has("shades")) s += `<rect x="35" y="39.5" width="13" height="9" rx="3.5" fill="${INK}"/><rect x="52" y="39.5" width="13" height="9" rx="3.5" fill="${INK}"/>` + line("M48 42 H52", 2) + `<path d="M37 41.5 L41 41.5" stroke="#fff" stroke-width="1.5" opacity=".6"/>`;
    if (has("mask")) s += `<path d="M29 38 H71 V49 H29 Z" fill="${INK}"/><ellipse cx="43" cy="44" rx="4" ry="3" fill="#fff"/><ellipse cx="57" cy="44" rx="4" ry="3" fill="#fff"/><circle cx="43" cy="44" r="1.6" fill="${INK}"/><circle cx="57" cy="44" r="1.6" fill="${INK}"/>`;
    if (has("scarf")) s += `<path d="M36 66 Q50 76 64 66 L66 74 Q50 84 34 74 Z" fill="${C.red}"/><path d="M57 74 L63 96 L54 96 L52 76 Z" fill="#c63b2b"/>`;
    if (has("bowtie")) s += `<path d="M50 75 L41 70 L41 80 Z M50 75 L59 70 L59 80 Z" fill="${C.red}"/><circle cx="50" cy="75" r="2.4" fill="#b8302a"/>`;
    if (has("tie")) s += `<path d="M47.5 74 H52.5 L54.5 77 L52 95 L50 98 L48 95 L45.5 77 Z" fill="${C.red}"/>`;
    if (has("steth")) s += line("M40 72 Q38 86 46 90", 2.6, "#5b6070") + line("M60 72 Q62 86 54 90", 2.6, "#5b6070") + `<circle cx="50" cy="91" r="4" fill="#9aa0ae" stroke="#5b6070" stroke-width="2"/>`;
    if (has("wheel")) s += `<circle cx="50" cy="92" r="17" fill="none" stroke="${INK}" stroke-width="4.5"/><circle cx="50" cy="92" r="4" fill="${INK}"/>` + line("M33 92 H67", 4) ;
    if (has("book")) s += `<rect x="16" y="78" width="20" height="24" rx="2" fill="${C.yellow}" transform="rotate(-8 26 90)"/><rect x="16" y="78" width="4" height="24" ${shade(0.18)} transform="rotate(-8 26 90)"/>`;
    if (has("heart")) s += heartPath(62, 82, 7, C.red);
    if (has("medal")) s += `<circle cx="64" cy="86" r="5" fill="${C.gold}"/>`;
    const hat = o.hat;
    if (hat === "grad") s += `<path d="M36 25 V35 Q50 41 64 35 V25 Z" fill="#252b3d"/><path d="M18 24 L50 12 L82 24 L50 36 Z" fill="#323a52"/>` + line("M50 24 L74 28 L74 40", 1.8, C.gold) + `<circle cx="74" cy="41" r="2.6" fill="${C.gold}"/>`;
    if (hat === "police") s += `<path d="M30 32 C30 14 70 14 70 32 Z" fill="#26346b"/><rect x="28" y="29" width="44" height="6" rx="3" fill="${C.gold}"/><path d="M28 35 H72 L66 39 H34 Z" fill="#1b244d"/>` + starPath(50, 23, 5, C.gold);
    if (hat === "helmet") s += `<path d="M28 36 C28 12 72 12 72 36 Z" fill="${C.yellow}"/><path d="M47 14 H53 V36 H47 Z" fill="#000" opacity=".1"/><rect x="24" y="33" width="52" height="6" rx="3" fill="#e5a523"/>`;
    if (hat === "nurse") s += `<path d="M34 28 L36 16 H64 L66 28 Z" fill="#fff"/><path d="M48 18 h4 v3 h3 v4 h-3 v3 h-4 v-3 h-3 v-4 h3 Z" fill="${C.red}"/>`;
    if (hat === "cap") s += `<path d="M30 34 C30 13 70 13 70 34 Z" fill="${SHIRT.teal}"/><path d="M30 31 H8 Q12 37 30 36 Z" fill="#23808c"/><circle cx="50" cy="16" r="2.4" fill="#23808c"/>`;
    if (hat === "beanie") s += `<path d="M30 34 C30 11 70 11 70 34 Z" fill="${SHIRT.navy}"/><rect x="28" y="28" width="44" height="8" rx="3" fill="#3d4a86"/>`;
    return s;
  }

  // Several people side by side; the later ones stand in front.
  function crowd(list, step) {
    step = step || 55;
    return { w: 100 + step * (list.length - 1), g: list.map((p, i) => `<g transform="translate(${i * step} 0)">${person(p)}</g>`).join("") };
  }

  function heartPath(x, y, r, col) {
    return `<path d="M${x} ${y + r * 0.9} C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.9} ${y - r * 1.4} ${x} ${y - r * 0.45} C${x + r * 0.9} ${y - r * 1.4} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r * 0.9} Z" fill="${col}"/>`;
  }
  function starPath(x, y, r, col) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(1) + " " + (y + rr * Math.sin(a)).toFixed(1);
    }
    return `<path d="${d}Z" fill="${col}"/>`;
  }
  const sparkle = (x, y, r, col) => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${col || C.gold}"/>`;

  // ---------------------------------------------------------------- things (each in a 100 x 100 box)
  const T = {
    apple: (c) => `<path d="M50 32 C38 22 16 26 17 52 C18 75 35 92 50 86 C65 92 82 75 83 52 C84 26 62 22 50 32Z" fill="${c || C.red}"/><path d="M50 32 C62 22 84 26 83 52 C82 75 65 92 50 86 Z" ${shade(0.1)}/><ellipse cx="33" cy="46" rx="6" ry="10" fill="#fff" opacity=".35" transform="rotate(20 33 46)"/><path d="M50 33 C49 24 51 16 55 11" stroke="#6b4423" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M54 20 C60 10 74 10 78 15 C70 23 60 24 54 20Z" fill="${C.leaf}"/>`,
    orange: () => `<circle cx="50" cy="56" r="34" fill="${C.orange}"/><path d="M50 22 A34 34 0 0 1 50 90 Z" ${shade(0.08)}/><g fill="#d9741a" opacity=".5"><circle cx="38" cy="50" r="1.6"/><circle cx="60" cy="44" r="1.6"/><circle cx="56" cy="70" r="1.6"/><circle cx="40" cy="70" r="1.6"/><circle cx="68" cy="60" r="1.6"/></g><ellipse cx="36" cy="44" rx="6" ry="9" fill="#fff" opacity=".3" transform="rotate(30 36 44)"/><path d="M50 24 C54 14 66 12 72 16 C66 24 56 26 50 24Z" fill="${C.leaf}"/>`,
    egg: () => `<path d="M50 10 C34 10 26 36 26 50 C26 60 34 66 50 66 C66 66 74 60 74 50 C74 36 66 10 50 10Z" fill="#fff6e3"/><path d="M50 10 C66 10 74 36 74 50 C74 60 66 66 50 66Z" fill="#f1dcb2" opacity=".6"/><path d="M24 56 H76 L70 76 H30 Z" fill="${C.teal}"/><rect x="42" y="76" width="16" height="8" fill="#23808c"/><rect x="32" y="84" width="36" height="6" rx="3" fill="${C.teal}"/>`,
    book: (c) => `<rect x="24" y="12" width="52" height="76" rx="4" fill="${c || C.red}"/><rect x="24" y="12" width="10" height="76" rx="3" ${shade(0.18)}/><rect x="40" y="26" width="28" height="12" rx="2" fill="#fff" opacity=".85"/><rect x="30" y="80" width="46" height="6" fill="#fff" opacity=".8"/>`,
    bookOpen: () => `<path d="M50 30 C38 22 20 22 8 26 V82 C20 78 38 78 50 86 Z" fill="#fff"/><path d="M50 30 C62 22 80 22 92 26 V82 C80 78 62 78 50 86 Z" fill="#f4f1fb"/>${[38, 46, 54, 62].map((y) => line(`M16 ${y} Q30 ${y - 3} 42 ${y + 2}`, 2, "#b9b6c6") + line(`M58 ${y + 2} Q70 ${y - 3} 84 ${y}`, 2, "#b9b6c6")).join("")}<path d="M4 84 C20 78 38 80 50 90 C62 80 80 78 96 84 V90 C80 86 62 88 50 96 C38 88 20 86 4 90 Z" fill="${C.teal}"/>`,
    watch: (c) => `<rect x="38" y="4" width="24" height="26" rx="4" fill="#d9d6e4"/><rect x="38" y="70" width="24" height="26" rx="4" fill="#d9d6e4"/><circle cx="50" cy="50" r="24" fill="${c || C.yellow}"/><circle cx="50" cy="50" r="18" fill="#fff"/><rect x="73" y="45" width="6" height="10" rx="2" fill="#c9a23a"/>` + line("M50 50 V38", 3) + line("M50 50 L58 54", 3) + `<circle cx="50" cy="50" r="2.4" fill="${INK}"/>`,
    glasses: (c) => `<circle cx="28" cy="52" r="17" fill="${c || C.sky}" fill-opacity=".35" stroke="${INK}" stroke-width="5"/><circle cx="72" cy="52" r="17" fill="${c || C.sky}" fill-opacity=".35" stroke="${INK}" stroke-width="5"/>` + line("M45 50 Q50 45 55 50", 5) + line("M11 48 L4 40", 4) + line("M89 48 L96 40", 4) + `<path d="M20 44 L26 40" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    bowl: (c) => `<ellipse cx="50" cy="46" rx="40" ry="8" fill="#fff"/><path d="M10 46 H90 C88 70 72 84 50 84 C28 84 12 70 10 46Z" fill="${c || C.purple}"/><path d="M50 84 C72 84 88 70 90 46 H70 C70 66 62 80 50 84Z" ${shade(0.12)}/><rect x="38" y="83" width="24" height="7" rx="3" fill="${c || C.purple}"/>`,
    flag: (c) => `<rect x="18" y="10" width="5" height="84" rx="2.5" fill="#7c7a8a"/><circle cx="20.5" cy="10" r="4" fill="${C.gold}"/><path d="M23 16 C40 8 56 24 82 14 V52 C56 62 40 46 23 54 Z" fill="${c || C.red}"/><path d="M23 35 C40 27 56 43 82 33 V52 C56 62 40 46 23 54 Z" ${shade(0.1)}/>`,
    baby: () => `<circle cx="50" cy="54" r="32" fill="${SKIN.a}"/><circle cx="18" cy="56" r="6" fill="${SKIN.a}"/><circle cx="82" cy="56" r="6" fill="${SKIN.a}"/>` + line("M50 22 C44 14 52 8 57 14", 3, HAIR.brown) + line("M38 50 Q42 46 46 50") + line("M54 50 Q58 46 62 50") + `<circle cx="33" cy="62" r="5" fill="#f2897b" opacity=".45"/><circle cx="67" cy="62" r="5" fill="#f2897b" opacity=".45"/><circle cx="50" cy="68" r="7" fill="${C.sky}"/><circle cx="50" cy="68" r="3" fill="#fff"/>`,
    dog: (c) => {
      c = c || C.yellow;
      return `<path d="M76 74 C90 70 92 56 86 50" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M34 52 C30 70 32 92 40 92 H74 C80 92 82 80 78 66 C74 54 64 46 52 46 C44 46 36 46 34 52Z" fill="${c}"/><path d="M60 92 H74 C80 92 82 80 78 66 C76 60 72 56 66 52 C70 64 68 80 60 92Z" ${shade(0.12)}/><rect x="40" y="70" width="9" height="22" rx="4" fill="${c}"/><rect x="40" y="70" width="9" height="22" rx="4" ${shade(0.1)}/>` +
        `<circle cx="38" cy="34" r="20" fill="${c}"/><ellipse cx="20" cy="42" rx="12" ry="9" fill="${c}"/><ellipse cx="12" cy="40" rx="4.5" ry="3.5" fill="${INK}"/><path d="M44 16 C58 12 62 30 54 46 C48 40 46 28 44 16Z" fill="#7a4a24"/><circle cx="34" cy="30" r="2.8" fill="${INK}"/><path d="M28 52 Q38 58 48 52" stroke="${C.red}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    },
    cat: (c) => {
      c = c || C.purple;
      return `<path d="M68 86 C92 84 92 60 80 56" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M30 92 C26 72 32 54 50 54 C68 54 74 72 70 92Z" fill="${c}"/><path d="M50 54 C68 54 74 72 70 92 H58 C62 76 58 62 50 54Z" ${shade(0.12)}/><ellipse cx="50" cy="72" rx="8" ry="12" fill="#fff" opacity=".35"/>` +
        `<path d="M30 20 L38 34 L62 34 L70 20 L72 40 C72 54 62 60 50 60 C38 60 28 54 28 40Z" fill="${c}"/><path d="M33 26 L37 34 H40Z M67 26 L63 34 H60Z" fill="${C.pink}"/><ellipse cx="42" cy="42" rx="2.6" ry="3.4" fill="${INK}"/><ellipse cx="58" cy="42" rx="2.6" ry="3.4" fill="${INK}"/><path d="M47.5 48 H52.5 L50 51Z" fill="${C.pink}"/>` + line("M30 49 L18 47", 1.4) + line("M30 52 L18 54", 1.4) + line("M70 49 L82 47", 1.4) + line("M70 52 L82 54", 1.4);
    },
    university: () => `<path d="M50 6 L92 30 H8 Z" fill="${C.yellow}"/><circle cx="50" cy="22" r="5" fill="#fff"/><rect x="8" y="30" width="84" height="7" fill="${C.red}"/>${[16, 32, 48, 64, 80].map((x) => `<rect x="${x - 4}" y="40" width="8" height="38" fill="#fff"/><rect x="${x}" y="40" width="4" height="38" ${shade(0.08)}/>`).join("")}<rect x="8" y="78" width="84" height="6" fill="#d9d6e4"/><rect x="2" y="84" width="96" height="8" fill="${C.teal}"/>`,
    clock: () => `<circle cx="50" cy="50" r="40" fill="${C.teal}"/><circle cx="50" cy="50" r="32" fill="#fff"/>${[0, 1, 2, 3].map((i) => `<rect x="48.5" y="21" width="3" height="7" fill="${INK}" transform="rotate(${i * 90} 50 50)"/>`).join("")}` + line("M50 50 V30", 4) + line("M50 50 H64", 4) + `<circle cx="50" cy="50" r="3.5" fill="${C.red}"/>`,
    crown: () => `<path d="M10 70 L14 26 L32 48 L50 18 L68 48 L86 26 L90 70 Z" fill="${C.gold}"/><path d="M50 18 L68 48 L86 26 L90 70 H50Z" ${shade(0.08)}/><rect x="8" y="68" width="84" height="16" rx="3" fill="${C.red}"/><circle cx="14" cy="26" r="5" fill="${C.teal}"/><circle cx="50" cy="18" r="5" fill="${C.red}"/><circle cx="86" cy="26" r="5" fill="${C.teal}"/><circle cx="30" cy="76" r="4" fill="${C.gold}"/><circle cx="50" cy="76" r="4" fill="${C.teal}"/><circle cx="70" cy="76" r="4" fill="${C.gold}"/>`,
    pencil: (c) => `<g transform="rotate(-35 50 50)"><rect x="8" y="42" width="12" height="16" rx="3" fill="${C.pink}"/><rect x="18" y="42" width="8" height="16" fill="#b9b6c6"/><rect x="26" y="42" width="52" height="16" fill="${c || C.yellow}"/><rect x="26" y="50" width="52" height="8" ${shade(0.1)}/><path d="M78 42 L94 50 L78 58 Z" fill="#f2d2a6"/><path d="M89 47.5 L94 50 L89 52.5Z" fill="${INK}"/></g>`,
    bag: () => `<rect x="47" y="0" width="6" height="16" fill="#7c7a8a"/><rect x="28" y="14" width="44" height="80" rx="18" fill="${C.red}"/><rect x="50" y="14" width="22" height="80" rx="16" ${shade(0.12)}/><rect x="28" y="40" width="44" height="6" fill="#b8302a"/>`,
    glove: () => `<rect x="4" y="38" width="30" height="26" rx="6" fill="#fff"/><path d="M30 32 C30 20 46 16 60 18 C80 20 92 34 90 52 C88 70 74 78 58 76 C44 74 30 70 30 60Z" fill="${C.red}"/><path d="M58 76 C74 78 88 70 90 52 L70 52 C70 66 64 74 58 76Z" ${shade(0.12)}/>` + line("M48 30 C56 26 66 30 70 38", 2.6, "#b8302a"),
    runner: () => `<circle cx="58" cy="16" r="10" fill="${SKIN.a}"/><path d="M50 14 C50 4 66 2 68 12 C62 10 56 12 50 14Z" fill="${HAIR.dark}"/>` + line("M54 28 L46 56", 12, SHIRT.green) + line("M52 34 L68 44 L78 36", 6, SKIN.a) + line("M50 34 L36 42 L28 34", 6, SKIN.a) + line("M46 56 L60 72 L56 90", 7, SHIRT.navy) + line("M46 56 L36 74 L20 74", 7, SHIRT.navy) + `<ellipse cx="60" cy="92" rx="8" ry="4" fill="${C.red}"/><ellipse cx="16" cy="74" rx="6" ry="4" fill="${C.red}"/>`,
    mound: () => `<path d="M4 96 C14 70 86 70 96 96 Z" fill="#9b6a43"/><circle cx="34" cy="86" r="2.5" fill="#7a4f2e"/><circle cx="62" cy="84" r="2.5" fill="#7a4f2e"/><circle cx="50" cy="92" r="2" fill="#7a4f2e"/>`,
    carrot: () => `<path d="M38 36 L62 36 L50 92 Z" fill="${C.orange}"/>` + line("M42 50 L48 52", 2, "#c96a12") + line("M54 64 L58 62", 2, "#c96a12") + `<path d="M50 36 C42 22 40 10 46 6 C50 16 50 26 50 36Z M50 36 C58 22 62 12 58 6 C52 14 50 26 50 36Z M50 36 C36 30 28 20 30 14 C40 20 46 28 50 36Z" fill="${C.leaf}"/>`,
    loop: () => `<path d="M50 8 A42 42 0 1 1 16 26" fill="none" stroke="${C.red}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 9"/><path d="M8 22 L20 18 L22 32 Z" fill="${C.red}"/>`,
    sofa: () => `<rect x="12" y="20" width="176" height="44" rx="16" fill="#8f97de"/><rect x="2" y="48" width="196" height="30" rx="10" fill="#7d86d4"/><rect x="0" y="40" width="26" height="48" rx="12" fill="#5c66b8"/><rect x="174" y="40" width="26" height="48" rx="12" fill="#5c66b8"/><rect x="26" y="52" width="148" height="22" rx="8" fill="#a3aae6"/><rect x="99" y="52" width="2" height="22" fill="#7d86d4"/><rect x="20" y="86" width="8" height="12" rx="2" fill="${INK}"/><rect x="172" y="86" width="8" height="12" rx="2" fill="${INK}"/>`,
    window: () => `<rect x="4" y="4" width="92" height="84" rx="4" fill="${SHIRT.navy}"/><rect x="4" y="4" width="92" height="84" rx="4" fill="none" stroke="#fff" stroke-width="5"/>` + line("M50 6 V86", 5, "#fff") + line("M6 46 H94", 5, "#fff") + `<path d="M24 16 A10 10 0 1 0 34 30 A8 8 0 1 1 24 16Z" fill="${C.gold}"/><circle cx="70" cy="22" r="2" fill="#fff"/><circle cx="82" cy="62" r="2" fill="#fff"/><circle cx="20" cy="70" r="1.6" fill="#fff"/><rect x="0" y="88" width="100" height="8" rx="2" fill="#d9d6e4"/>`,
    lamp: () => `<path d="M26 6 H74 L88 40 H12 Z" fill="${C.red}"/><path d="M50 6 H74 L88 40 H50Z" ${shade(0.1)}/><rect x="47" y="40" width="6" height="52" fill="${INK}"/><ellipse cx="50" cy="94" rx="20" ry="5" fill="${INK}"/>`,
    mug: () => `<path d="M24 34 H70 V78 C70 86 64 90 56 90 H38 C30 90 24 86 24 78 Z" fill="${C.red}"/><path d="M70 44 C86 44 86 70 70 70" fill="none" stroke="${C.red}" stroke-width="7"/>` + line("M38 22 C34 16 42 12 38 6", 3, "#b9b6c6") + line("M54 22 C50 16 58 12 54 6", 3, "#b9b6c6"),
    plov: () => `<ellipse cx="50" cy="66" rx="48" ry="14" fill="#fff"/><ellipse cx="50" cy="66" rx="48" ry="14" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="6 5"/><path d="M14 64 C18 40 82 40 86 64 Z" fill="#f6dfa6"/>${[[30, 52, C.orange], [44, 46, C.orange], [60, 50, C.orange], [70, 56, C.orange], [38, 58, "#6b3e26"], [56, 58, "#6b3e26"], [50, 44, "#6b3e26"]].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="7" height="3" rx="1.5" fill="${c}" transform="rotate(${x % 3 * 20 - 20} ${x} ${y})"/>`).join("")}`,
    qatiq: () => `<path d="M10 40 H90 C88 66 72 80 50 80 C28 80 12 66 10 40Z" fill="${C.teal}"/><ellipse cx="50" cy="40" rx="40" ry="8" fill="#fff"/><path d="M50 80 C72 80 88 66 90 40 H70 C70 60 62 76 50 80Z" ${shade(0.12)}/>${[24, 40, 56, 72].map((x) => `<circle cx="${x}" cy="56" r="3" fill="#fff" opacity=".8"/>`).join("")}`,
    phone: () => `<rect x="28" y="6" width="44" height="88" rx="9" fill="${INK}"/><rect x="32" y="14" width="36" height="66" rx="3" fill="${C.sky}"/><path d="M32 14 H68 L32 54Z" fill="#fff" opacity=".3"/><circle cx="50" cy="87" r="3" fill="#596080"/>`,
    laptop: () => `<rect x="16" y="14" width="68" height="50" rx="5" fill="${INK}"/><rect x="21" y="19" width="58" height="40" rx="2" fill="${C.sky}"/><path d="M21 19 H60 L21 50Z" fill="#fff" opacity=".3"/><path d="M4 66 H96 L90 78 H10 Z" fill="#c9c6d6"/><rect x="40" y="66" width="20" height="4" rx="2" fill="#9a97aa"/>`,
    car: (c) => `<path d="M8 66 C8 52 16 50 24 48 L34 30 C36 26 40 24 44 24 H64 C68 24 72 26 74 30 L84 48 C92 50 96 54 96 66 V72 H8 Z" fill="${c || C.red}"/><path d="M38 32 H52 V48 H31 Z" fill="${C.sky}"/><path d="M56 32 H68 L76 48 H56 Z" fill="${C.sky}"/><rect x="8" y="62" width="88" height="10" ${shade(0.12)}/><rect x="86" y="54" width="8" height="6" rx="2" fill="${C.gold}"/><circle cx="28" cy="74" r="11" fill="${INK}"/><circle cx="28" cy="74" r="4.5" fill="#d9d6e4"/><circle cx="76" cy="74" r="11" fill="${INK}"/><circle cx="76" cy="74" r="4.5" fill="#d9d6e4"/>`,
    sun: () => `${[...Array(8)].map((_, i) => `<rect x="47" y="2" width="6" height="16" rx="3" fill="${C.orange}" transform="rotate(${i * 45} 50 50)"/>`).join("")}<circle cx="50" cy="50" r="24" fill="${C.gold}"/><path d="M50 26 A24 24 0 0 1 50 74Z" fill="${C.orange}" opacity=".25"/>`,
    therm: (c) => `<rect x="40" y="6" width="20" height="66" rx="10" fill="#fff" stroke="${INK}" stroke-width="3.5"/><rect x="46" y="${c ? 54 : 26}" width="8" height="${c ? 26 : 54}" rx="4" fill="${c || C.red}"/><circle cx="50" cy="80" r="14" fill="${c || C.red}" stroke="${INK}" stroke-width="3.5"/>${[20, 32, 44, 56].map((y) => line(`M64 ${y} H72`, 2.6)).join("")}`,
    calc: () => `<rect x="18" y="4" width="64" height="92" rx="8" fill="${C.teal}"/><rect x="26" y="12" width="48" height="20" rx="3" fill="#e9fbff"/><text x="70" y="27" font-family="sans-serif" font-size="13" font-weight="700" text-anchor="end" fill="${INK}">24</text>${[0, 1, 2].map((r) => [0, 1, 2].map((k) => `<rect x="${27 + k * 17}" y="${40 + r * 17}" width="12" height="12" rx="3" fill="${r === 2 && k === 2 ? C.red : "#fff"}"/>`).join("")).join("")}`,
    guitar: () => `<rect x="60" y="2" width="8" height="46" rx="2" fill="#6b3e26" transform="rotate(30 64 25)"/><path d="M36 50 C22 46 12 58 18 72 C24 88 42 94 54 86 C66 78 66 60 56 52 C52 48 44 52 36 50Z" fill="${C.orange}"/><circle cx="40" cy="70" r="7" fill="#6b3e26"/>`,
    note: () => `<path d="M38 72 V22 L76 14 V62" fill="none" stroke="${INK}" stroke-width="6"/><ellipse cx="30" cy="74" rx="11" ry="8" fill="${INK}"/><ellipse cx="68" cy="64" rx="11" ry="8" fill="${INK}"/>`,
    house: (c) => `<rect x="70" y="14" width="10" height="24" fill="#8a879b"/><path d="M50 8 L94 46 H6 Z" fill="${c || C.red}"/><rect x="14" y="44" width="72" height="50" fill="${c === C.teal ? "#f4c7b7" : "#9fa8e6"}"/><rect x="22" y="54" width="18" height="16" rx="2" fill="#fff"/>` + line("M31 54 V70 M22 62 H40", 2.4, "#9fa8e6") + `<rect x="58" y="54" width="18" height="16" rx="2" fill="#fff"/>` + line("M67 54 V70 M58 62 H76", 2.4, "#9fa8e6") + `<path d="M42 94 V76 C42 70 58 70 58 76 V94Z" fill="#fff"/>`,
    cake: () => `${[30, 44, 58, 72].map((x, i) => `<rect x="${x - 3}" y="12" width="6" height="22" rx="2" fill="${[C.blue, C.pink, C.green, C.yellow][i]}"/><path d="M${x} 2 C${x + 5} 8 ${x + 3} 12 ${x} 12 C${x - 3} 12 ${x - 5} 8 ${x} 2Z" fill="${C.orange}"/>`).join("")}<rect x="16" y="34" width="68" height="24" rx="6" fill="${C.pink}"/><path d="M16 42 C24 48 30 36 38 42 C46 48 54 36 62 42 C70 48 76 36 84 42 V34 H16Z" fill="#fff"/><rect x="8" y="58" width="84" height="32" rx="6" fill="${C.red}"/><path d="M8 66 C18 74 26 60 36 66 C46 74 54 60 64 66 C74 74 82 60 92 66 V60 H8Z" fill="#fff"/>`,
    bigben: () => `<path d="M50 0 L62 22 H38 Z" fill="${SHIRT.navy}"/><rect x="36" y="22" width="28" height="74" fill="#d9a46a"/><rect x="50" y="22" width="14" height="74" ${shade(0.1)}/><circle cx="50" cy="38" r="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` + line("M50 38 V31 M50 38 L55 40", 2) + `${[56, 68, 80].map((y) => `<rect x="41" y="${y}" width="6" height="8" rx="3" fill="#7a4f2e"/><rect x="53" y="${y}" width="6" height="8" rx="3" fill="#7a4f2e"/>`).join("")}`,
    desk: () => `<rect x="4" y="30" width="92" height="9" rx="2" fill="${C.wood}"/><rect x="10" y="39" width="7" height="55" fill="#8a5b33"/><rect x="58" y="39" width="34" height="55" fill="#b5804b"/>${[46, 64, 82].map((y) => `<rect x="70" y="${y}" width="10" height="3" rx="1.5" fill="#6b4423"/>`).join("")}`,
    gift: () => `<rect x="14" y="38" width="72" height="54" rx="4" fill="${C.teal}"/><rect x="10" y="28" width="80" height="16" rx="3" fill="${C.red}"/><rect x="45" y="28" width="10" height="64" fill="${C.gold}"/><path d="M50 28 C40 10 24 14 30 24 C34 30 44 30 50 28Z M50 28 C60 10 76 14 70 24 C66 30 56 30 50 28Z" fill="${C.gold}"/>`,
    dress: () => `<path d="M38 6 L44 6 L50 16 L56 6 L62 6 L64 32 L84 92 H16 L36 32Z" fill="${C.red}"/><rect x="36" y="32" width="28" height="6" fill="#b8302a"/>${[[30, 70], [50, 60], [66, 78], [44, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" opacity=".7"/>`).join("")}`,
    tshirt: () => `<path d="M32 10 C38 18 62 18 68 10 L94 26 L84 44 L74 38 V92 H26 V38 L16 44 L6 26 Z" fill="${C.green}"/><path d="M50 16 C58 16 64 14 68 10 L94 26 L84 44 L74 38 V92 H50Z" ${shade(0.08)}/>`,
    eyes: () => [24, 76].map((x) => `<path d="M${x - 20} 50 Q${x} 30 ${x + 20} 50 Q${x} 64 ${x - 20} 50Z" fill="#fff"/><circle cx="${x}" cy="50" r="8" fill="${INK}"/><path d="M${x - 20} 50 Q${x} 30 ${x + 20} 50 Q${x} 44 ${x - 20} 50Z" fill="${SKIN.b}"/>` + line(`M${x - 18} 62 Q${x} 72 ${x + 18} 62`, 3, "#8a86b8")).join(""),
    badge: () => `<path d="M38 4 L50 18 L62 4" stroke="${INK}" stroke-width="3" fill="none"/><rect x="12" y="18" width="76" height="60" rx="8" fill="${C.yellow}"/><rect x="12" y="18" width="76" height="18" rx="8" fill="${C.red}"/><rect x="12" y="30" width="76" height="6" fill="${C.red}"/><rect x="42" y="22" width="16" height="6" rx="3" fill="#fff"/><rect x="22" y="46" width="40" height="6" rx="3" fill="#8a5b33"/><rect x="22" y="60" width="28" height="6" rx="3" fill="#8a5b33"/>`,
    ball: () => `<circle cx="50" cy="50" r="40" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M50 34 L64 44 L58 60 H42 L36 44Z" fill="${INK}"/>` + line("M50 34 V12 M64 44 L84 36 M58 60 L70 78 M42 60 L30 78 M36 44 L16 36", 2.6),
    donkey: () => `<path d="M24 6 C14 20 22 40 34 40 C38 26 34 12 24 6Z M76 6 C86 20 78 40 66 40 C62 26 66 12 76 6Z" fill="#9aa0c8"/><path d="M26 12 C22 22 26 34 32 36 C34 26 32 18 26 12Z M74 12 C78 22 74 34 68 36 C66 26 68 18 74 12Z" fill="${C.pink}"/><ellipse cx="50" cy="56" rx="30" ry="34" fill="#9aa0c8"/><ellipse cx="50" cy="76" rx="22" ry="16" fill="#f2d6d0"/><circle cx="42" cy="76" r="3.4" fill="${INK}"/><circle cx="58" cy="76" r="3.4" fill="${INK}"/><circle cx="38" cy="50" r="3.4" fill="${INK}"/><circle cx="62" cy="50" r="3.4" fill="${INK}"/>` + line("M30 42 L42 46 M70 42 L58 46", 3.4),
    calendar: () => `<rect x="10" y="14" width="80" height="78" rx="8" fill="#fff"/><rect x="10" y="14" width="80" height="20" rx="8" fill="${C.red}"/><rect x="10" y="26" width="80" height="8" fill="${C.red}"/><rect x="26" y="6" width="7" height="16" rx="3" fill="${INK}"/><rect x="67" y="6" width="7" height="16" rx="3" fill="${INK}"/>${[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => `<rect x="${18 + k * 18}" y="${42 + r * 16}" width="10" height="9" rx="2" fill="${r === 1 && k === 2 ? C.blue : "#d9d6e4"}"/>`).join("")).join("")}`,
    pin: () => `<path d="M50 94 C32 70 20 56 20 38 C20 20 34 8 50 8 C66 8 80 20 80 38 C80 56 68 70 50 94Z" fill="${C.red}"/><circle cx="50" cy="38" r="12" fill="#fff"/><ellipse cx="50" cy="96" rx="14" ry="3" fill="#000" opacity=".12"/>`,
    battery: () => `<rect x="4" y="26" width="84" height="48" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="88" y="40" width="8" height="20" rx="3" fill="${INK}"/><rect x="12" y="34" width="16" height="32" rx="3" fill="${C.red}"/>${[34, 52, 70].map((x) => `<rect x="${x}" y="34" width="12" height="32" rx="3" fill="none" stroke="#c9c6d6" stroke-width="2.4" stroke-dasharray="4 3"/>`).join("")}`,
    ban: () => `<circle cx="50" cy="50" r="38" fill="#fff" fill-opacity=".55" stroke="${C.red}" stroke-width="10"/><path d="M23 23 L77 77" stroke="${C.red}" stroke-width="10"/>`,
    bulb: () => `<path d="M50 6 C30 6 18 22 22 40 C24 52 34 56 36 68 H64 C66 56 76 52 78 40 C82 22 70 6 50 6Z" fill="${C.gold}"/><path d="M42 30 C42 22 48 18 54 18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="36" y="70" width="28" height="8" rx="2" fill="#a7a4b6"/><rect x="38" y="80" width="24" height="8" rx="2" fill="#8a879b"/>` + line("M44 52 L50 60 L56 52", 3, "#c98a12"),
    snow: () => `<g stroke="${C.sky}" stroke-width="7" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M50 14 V86" transform="rotate(${a} 50 50)"/>`).join("")}</g>`,
    cloudRain: () => `<path d="M24 60 C10 60 8 40 22 38 C22 22 40 16 50 26 C58 14 80 18 80 36 C94 38 94 60 80 60Z" fill="#c9cfe6"/><path d="M50 26 C58 14 80 18 80 36 C94 38 94 60 80 60 H50Z" fill="#b4bcdc"/>${[30, 48, 66].map((x) => line(`M${x} 70 L${x - 5} 84`, 4, C.sky)).join("")}`,
    cloud: () => `<path d="M22 70 C6 70 4 46 20 44 C20 26 42 20 52 32 C60 18 84 22 84 42 C98 44 98 70 82 70Z" fill="#fff"/>`,
    moon: () => `<path d="M60 8 A42 42 0 1 0 92 66 A34 34 0 1 1 60 8Z" fill="${C.gold}"/>`,
    zz: () => `<text x="20" y="60" font-family="sans-serif" font-size="40" font-weight="800" fill="#8a86b8">z</text><text x="52" y="40" font-family="sans-serif" font-size="30" font-weight="800" fill="#8a86b8">z</text><text x="76" y="22" font-family="sans-serif" font-size="20" font-weight="800" fill="#8a86b8">z</text>`,
    fishBubble: () => `<ellipse cx="54" cy="40" rx="42" ry="28" fill="#fff"/><circle cx="16" cy="76" r="6" fill="#fff"/><circle cx="6" cy="92" r="4" fill="#fff"/><path d="M34 40 C42 28 62 28 70 40 C62 52 42 52 34 40Z" fill="${C.teal}"/><path d="M70 40 L82 30 V50Z" fill="${C.teal}"/><circle cx="44" cy="38" r="2.4" fill="${INK}"/>`,
    mouse: () => `<circle cx="34" cy="36" r="12" fill="#c9c6d6"/><circle cx="34" cy="36" r="6" fill="${C.pink}"/><path d="M16 74 C16 52 36 44 56 46 C76 48 86 60 86 74Z" fill="#c9c6d6"/><circle cx="26" cy="64" r="2.6" fill="${INK}"/><circle cx="14" cy="70" r="3" fill="${C.pink}"/>` + line("M86 72 C96 66 96 86 86 86", 3, "#a7a4b6"),
    elephant: () => `<path d="M30 28 C30 12 52 8 68 12 C88 16 98 32 96 54 V92 H82 V74 H66 V92 H52 V74 C44 74 38 68 38 60 V54 Z" fill="#b9b6c6"/><path d="M96 54 V92 H82 V74 H66 V92 H52 V74 C70 74 90 68 96 54Z" ${shade(0.1)}/><ellipse cx="50" cy="40" rx="15" ry="19" fill="#a7a4b6"/><path d="M30 32 C12 36 8 54 12 70 C14 82 24 88 28 78 C24 68 26 56 34 52Z" fill="#b9b6c6"/><circle cx="36" cy="32" r="2.8" fill="${INK}"/><path d="M28 58 C34 60 36 64 34 68" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    ladle: () => `<path d="M14 8 L56 50" stroke="#a7a4b6" stroke-width="7" stroke-linecap="round"/><path d="M40 52 H92 C92 72 80 84 66 84 C52 84 40 72 40 52Z" fill="#a7a4b6"/><path d="M44 56 H88 C86 70 78 78 66 78 C54 78 46 70 44 56Z" fill="${C.cream}"/>`,
    spoon: () => `<rect x="46" y="6" width="8" height="58" rx="4" fill="${INK}"/><ellipse cx="50" cy="76" rx="12" ry="18" fill="${C.red}"/>`,
    pot: () => `${[34, 50, 66].map((x) => line(`M${x} 24 C${x - 6} 16 ${x + 6} 12 ${x} 4`, 3, "#b9b6c6")).join("")}<rect x="6" y="30" width="88" height="8" rx="4" fill="#5b6070"/><path d="M14 38 H86 V74 C86 84 78 90 68 90 H32 C22 90 14 84 14 74Z" fill="${C.wood}"/><path d="M60 38 H86 V74 C86 84 78 90 68 90 H60Z" ${shade(0.12)}/><rect x="2" y="44" width="12" height="6" rx="3" fill="#5b6070"/><rect x="86" y="44" width="12" height="6" rx="3" fill="#5b6070"/>`,
    umbrella: () => `<path d="M6 46 C10 14 90 14 94 46 Z" fill="${C.red}"/><path d="M34 46 C36 16 64 16 66 46Z" fill="#fff"/><rect x="48" y="16" width="4" height="70" fill="${INK}"/><rect x="60" y="66" width="30" height="8" rx="2" fill="${C.sky}"/><path d="M0 90 C16 84 32 96 50 90 C68 84 84 96 100 90 V100 H0Z" fill="${C.sky}"/>`,
    cloche: () => `<circle cx="50" cy="18" r="6" fill="${C.gold}"/><path d="M8 72 C8 38 92 38 92 72Z" fill="${C.gold}"/><path d="M50 30 C74 32 92 48 92 72 H66 C66 52 60 38 50 30Z" ${shade(0.1)}/><path d="M22 58 C24 50 30 46 36 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><rect x="2" y="72" width="96" height="8" rx="4" fill="#9a97aa"/>`,
    slingshot: () => line("M50 96 V54 L30 14 M50 54 L70 14", 9, "#8a5b33") + line("M30 14 Q50 34 70 14", 3, INK),
    speedcam: () => `<rect x="26" y="12" width="48" height="40" rx="8" fill="#9fa8e6"/><circle cx="50" cy="32" r="12" fill="#fff"/><circle cx="50" cy="32" r="6" fill="${INK}"/><rect x="46" y="52" width="8" height="42" fill="${INK}"/><rect x="36" y="90" width="28" height="6" rx="3" fill="${INK}"/>` + line("M14 14 L22 20 M86 14 L78 20 M10 32 H20 M90 32 H80", 3, C.gold),
    ruler: () => `<rect x="2" y="34" width="96" height="30" rx="4" fill="${C.yellow}"/>${[...Array(10)].map((_, i) => `<rect x="${10 + i * 9}" y="34" width="2.5" height="${i % 2 ? 9 : 16}" fill="${INK}"/>`).join("")}`,
    city: () => `<rect x="4" y="40" width="22" height="56" fill="#9fa8e6"/><rect x="28" y="16" width="26" height="80" fill="${C.teal}"/><rect x="40" y="2" width="3" height="14" fill="${INK}"/><rect x="56" y="34" width="22" height="62" fill="${C.yellow}"/><rect x="80" y="54" width="16" height="42" fill="${C.red}"/>${[[8, 48], [8, 62], [8, 76], [33, 24], [44, 24], [33, 40], [44, 40], [33, 56], [44, 56], [33, 72], [44, 72], [61, 42], [61, 58], [61, 74], [84, 62], [84, 76]].map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="8" fill="#fff" opacity=".85"/>`).join("")}`,
    fence: () => `${[6, 26, 46, 66, 86].map((x) => `<path d="M${x} 30 L${x + 5} 22 L${x + 10} 30 V96 H${x} Z" fill="${C.wood}"/>`).join("")}<rect x="0" y="44" width="100" height="8" fill="#a8743f"/><rect x="0" y="74" width="100" height="8" fill="#a8743f"/>`,
    diamond: () => `<path d="M26 14 H74 L94 38 L50 92 L6 38 Z" fill="#7fd6c8"/><path d="M6 38 H94 L74 14 H26Z" fill="#a8e6dc"/><path d="M50 92 L34 38 H66 Z" fill="#5cc2b2"/><path d="M34 38 L42 14 H58 L66 38Z" fill="#c8f1ea"/>`,
    boat: () => `<path d="M50 6 V60" stroke="${INK}" stroke-width="4"/><path d="M52 10 L84 56 H52Z" fill="#fff"/><path d="M48 22 L22 56 H48Z" fill="${C.gold}"/><path d="M8 62 H92 L80 84 H20Z" fill="${C.red}"/>`,
    waves: () => `<path d="M0 30 C12 20 26 20 38 30 C50 40 62 40 74 30 C86 20 96 22 100 26 V100 H0Z" fill="${C.sky}"/><path d="M0 56 C12 46 26 46 38 56 C50 66 62 66 74 56 C86 46 96 48 100 52 V100 H0Z" fill="#6ab9e6"/>`,
    hand: () => `<path d="M30 96 L26 54 C24 46 34 44 36 52 L38 64 L38 18 C38 10 48 10 48 18 V54 V12 C48 4 58 4 58 12 V54 V18 C58 10 68 10 68 18 V58 V30 C68 22 78 22 78 30 V66 C78 84 68 96 54 96Z" fill="${SKIN.a}"/><path d="M68 58 V30 C68 22 78 22 78 30 V66 C78 84 68 96 54 96 H44 C60 90 68 78 68 58Z" ${shade(0.08)}/>`,
    cane: () => `<path d="M60 96 V30 C60 14 36 14 36 30" fill="none" stroke="#8a5b33" stroke-width="7" stroke-linecap="round"/>`,
    tail: () => `<path d="M0 80 C30 86 60 84 70 62 C78 44 70 24 56 26 C44 28 46 46 58 46" fill="none" stroke="${C.purple}" stroke-width="9" stroke-linecap="round"/>`,
    q: () => `<path d="M12 8 H88 C94 8 98 12 98 18 V64 C98 70 94 74 88 74 H36 L16 92 L22 74 H12 C6 74 2 70 2 64 V18 C2 12 6 8 12 8Z" fill="${C.gold}"/><text x="50" y="62" font-family="sans-serif" font-size="56" font-weight="800" text-anchor="middle" fill="${INK}">?</text>`,
    dots: () => `<path d="M12 8 H88 C94 8 98 12 98 18 V64 C98 70 94 74 88 74 H36 L16 92 L22 74 H12 C6 74 2 70 2 64 V18 C2 12 6 8 12 8Z" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="30" cy="41" r="7" fill="${INK}"/><circle cx="50" cy="41" r="7" fill="${INK}"/><circle cx="70" cy="41" r="7" fill="${INK}"/>`,
    heart: (c) => heartPath(50, 52, 34, c || C.red),
    spark: (c) => sparkle(50, 50, 46, c),
    star: (c) => starPath(50, 54, 46, c || C.gold),
    check: () => `<circle cx="50" cy="50" r="44" fill="${C.green}"/>` + line("M28 52 L44 68 L74 34", 10, "#fff"),
    cross: () => `<circle cx="50" cy="50" r="44" fill="${C.red}"/>` + line("M32 32 L68 68 M68 32 L32 68", 10, "#fff"),
    arrow: (c) => line("M8 50 H84 M64 30 L86 50 L64 70", 9, c || C.red),
  };

  // ---------------------------------------------------------------- scenes
  // layer: [what, x, y, size, opts]. what = name of a thing, a person options object, a crowd, or raw SVG.
  function draw(what, opt) {
    if (typeof what === "string") return T[what] ? T[what](opt) : "";
    if (what && what.g) return what.g;
    return person(what);
  }
  function scene(w, h, layers, label) {
    let g = "";
    layers.forEach(([what, x, y, size, opt, anim]) => {
      const box = what && what.w ? what.w : (what === "sofa" ? 200 : 100);
      const s = Math.abs(size) / box, fl = size < 0;
      const tr = `translate(${fl ? x + Math.abs(size) : x} ${y}) scale(${fl ? -s : s} ${s})`;
      const body = draw(what, opt);
      g += anim ? `<g transform="${tr}"><g class="fa-${anim}">${body}</g></g>` : `<g transform="${tr}">${body}</g>`;
    });
    const a = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return `<svg class="fa" viewBox="0 0 ${w} ${h}" ${a}>${g}</svg>`;
  }

  root.L1_FlatArt = { person, crowd, scene, T, C, SKIN, HAIR, SHIRT, INK };
})(typeof window !== "undefined" ? window : globalThis);
