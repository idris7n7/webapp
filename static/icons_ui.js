/* Level Up - emoji as pictures (Apple-style set, the same one Telegram shows), so every emoji looks the same on every
 * phone and computer. Generated file: the build script fills in the tables below and copies the PNGs to /static/emoji/.
 *   L1Icon("open-book")  ->  '<img class="l1-emo" ...>' string for templates
 * Every emoji that reaches the page (static HTML, or text the app writes later) is swapped for its picture by a
 * MutationObserver, so game code can keep using plain text. Text-only buttons and headings get an emoji in front
 * (LABELS). Add `data-keep-emoji` to an element to opt out; an emoji without an entry in MAP is left as it is. */
(function () {
  "use strict";
  const MAP = {"🔥":"1f525","🎓":"1f393","🛠":"1f6e0-fe0f","⏰":"23f0","🍅":"1f345","🌱":"1f331","🗺":"1f5fa-fe0f","🐉":"1f409","💰":"1f4b0","🏁":"1f3c1","🎧":"1f3a7","📖":"1f4d6","🌴":"1f334","📝":"1f4dd","🎉":"1f389","⭐":"2b50","🔊":"1f50a","🥇":"1f947","🥈":"1f948","🥉":"1f949","🎮":"1f3ae","🔒":"1f512","👑":"1f451","🚀":"1f680","📅":"1f4c5","📊":"1f4ca","🎯":"1f3af","🔇":"1f507","🍯":"1f36f","🐙":"1f419","🍌":"1f34c","⚔":"2694-fe0f","🪐":"1fa90","🗼":"1f5fc","🦈":"1f988","🔤":"1f524","🌌":"1f30c","🧠":"1f9e0","▶":"25b6-fe0f","⏸":"23f8-fe0f","🥀":"1f940","⚠":"26a0-fe0f","⬆":"2b06-fe0f","➡":"27a1-fe0f","⬇":"2b07-fe0f","⬅":"2b05-fe0f","🎒":"1f392","💧":"1f4a7","📱":"1f4f1","☂":"2602-fe0f","🥪":"1f96a","📓":"1f4d3","🔑":"1f511","⛺":"26fa","🪢":"1faa2","🔦":"1f526","🧥":"1f9e5","🇦🇷":"1f1e6-1f1f7","🇦🇺":"1f1e6-1f1fa","🇧🇷":"1f1e7-1f1f7","🇨🇴":"1f1e8-1f1f4","🇮🇳":"1f1ee-1f1f3","🇮🇹":"1f1ee-1f1f9","🇲🇽":"1f1f2-1f1fd","🇿🇦":"1f1ff-1f1e6","🇰🇷":"1f1f0-1f1f7","🇵🇱":"1f1f5-1f1f1","🇪🇸":"1f1ea-1f1f8","🇹🇷":"1f1f9-1f1f7","🇨🇳":"1f1e8-1f1f3","🇻🇳":"1f1fb-1f1f3","🇯🇵":"1f1ef-1f1f5","🇫🇷":"1f1eb-1f1f7","🇩🇪":"1f1e9-1f1ea","🇨🇭":"1f1e8-1f1ed","🕒":"1f552","👨":"1f468","👴":"1f474","👩":"1f469","👵":"1f475","👦":"1f466","👧":"1f467","😊":"1f60a","😢":"1f622","😴":"1f634","💻":"1f4bb","📕":"1f4d5","🚪":"1f6aa","🪟":"1fa9f","💡":"1f4a1","📞":"1f4de","🪑":"1fa91","🧍":"1f9cd","🏃":"1f3c3","❤":"2764-fe0f","🖤":"1f5a4","📚":"1f4da","🤔":"1f914","⏳":"23f3","💔":"1f494","🏆":"1f3c6","🔓":"1f513","🔄":"1f504","🔁":"1f501","📘":"1f4d8","🆕":"1f195","🪙":"1fa99","👥":"1f465","✅":"2705","❌":"274c","🧩":"1f9e9","⌨":"2328-fe0f","🎲":"1f3b2","⏱":"23f1-fe0f","🏎":"1f3ce-fe0f","🤖":"1f916","📋":"1f4cb","✈":"2708-fe0f","🦋":"1f98b","🐝":"1f41d","🕊":"1f54a-fe0f","🌸":"1f338","🌳":"1f333","📍":"1f4cd","➕":"2795","👩‍🏫":"1f469-200d-1f3eb","✨":"2728","✍":"270d-fe0f","📗":"1f4d7","🟡":"1f7e1","🔴":"1f534","⚪":"26aa","🔀":"1f500","✏":"270f-fe0f","🔍":"1f50d","💎":"1f48e","🐲":"1f432","📦":"1f4e6","👩‍🎓":"1f469-200d-1f393","📥":"1f4e5","💾":"1f4be","👨‍🎓":"1f468-200d-1f393","👍":"1f44d","👋":"1f44b","🌟":"1f31f","🙏":"1f64f","💪":"1f4aa","⏹":"23f9-fe0f","👨‍🏫":"1f468-200d-1f3eb","📄":"1f4c4","📤":"1f4e4","🖼":"1f5bc-fe0f","🏢":"1f3e2","🕵":"1f575-fe0f","📭":"1f4ed","😁":"1f601"};
  const SYMS = {"✓":"2705","✔":"2705","✗":"274c","✕":"274c","✖":"274c","★":"2b50","✦":"2728","✎":"270f-fe0f","▶":"25b6-fe0f","⏸":"23f8-fe0f"};
  const NAMED = {"open-book":"1f4d6","books":"1f4da","house":"1f3e0","memo":"1f4dd","video-game":"1f3ae","trophy":"1f3c6","fire":"1f525","speaker-high-volume":"1f50a","muted-speaker":"1f507","cross-mark":"274c"};
  const LABELS = [["^chiqish","1f6aa"],["^o'chirish","1f5d1-fe0f"],["^yopish","274c"],["^hammasi","1f5c2-fe0f"],["^to'xtatish","23f9-fe0f"],["^boshlash","25b6-fe0f"],["^tayyor","2705"],["^ok$","2705"],["^bekor","274c"],["^panel","1f4ca"],["^ballsiz","1f6ab"],["^darsga o'tish","1f4d6"],["^mashq qilish","270f-fe0f"],["^bu hafta","1f4c5"],["^umumiy","1f30d"],["^rasmni o'zgartirish","1f4f7"],["^keyinroq","23f0"],["^davom etish","25b6-fe0f"],["^missiyalar","1f4cb"],["^50:50","2696-fe0f"],["^yo'q","274c"],["^natijani ko'rish","1f3c6"],["^qo'shilish","1f91d"],["^ro'yxatni ochish","1f4cb"],["^hafta$","1f4c5"],["^tekshirish","2705"],["^javoblarni ko'rib chiqish","1f440"],["^hammasini tanlash","1f4cb"],["^saqlash","1f4be"],["^o'g'il bola","1f466"],["^qiz bola","1f467"],["^tozalash","1f9f9"],["^reset","1f504"],["^.{0,2}add student","1f464"],["^tasdiqlash","2705"],["^rad etish","274c"],["^kirish$","1f511"],["^keyingi","25b6-fe0f"],["^qayta","1f504"],["^davom","25b6-fe0f"],["^yuborish","1f4e4"],["^nusxalash","1f4c4"],["^qo'shish","2795"],["^yangilash","1f504"],["^tahrirlash","270f-fe0f"],["^ha[,$ ]","2705"],["maqsadlar","1f3af"],["^o'yinlar$","1f3ae"],["yetakchilari","1f3c6"],["^yashil shahar","1f333"],["^bugungi vazifa","1f4dd"],["^[0-9]+-dars","1f4d6"],["natijalar","1f4ca"],["xatolar","26a0-fe0f"],["^qo'shimcha mashqlar","1f4da"],["^kunlik ballar","1f4ca"],["^doimiylik","1f525"],["^reyting","1f3c6"],["^daraja","1f3af"],["^profil","1f464"],["^sozlamalar","2699-fe0f"],["^vazifalar$","1f4dd"],["^mening darajam","1f3c5"],["^ketma-ket doimiylik","1f525"],["^haftalik","1f4c5"],["^talaba ","1f393"],["^dars qilgan","2705"],["^qilmagan","274c"],["^boshlagan kun","1f4c5"]].map(([re, file]) => [new RegExp(re), file]);

  const RE = /(?:[✓✔✗✕✖★✦✎]|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])?(?:‍\p{Extended_Pictographic}️?)*)/gu;
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "OPTION", "TITLE", "NOSCRIPT", "CODE", "PRE"]);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  const img = (file, alt, cls) =>
    `<img class="l1-emo${cls ? " " + cls : ""}" src="/static/emoji/${file}.png" alt="${esc(alt || "")}" draggable="false" decoding="async">`;
  function fileFor(e) {
    const key = e.replace(/️/g, "");
    return SYMS[key] || MAP[key] || MAP[key.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "")] || (key.includes("‍") && MAP[key.split("‍")[0]]) || null;
  }
  // html for one emoji, or null when it has no picture (then it stays as it is)
  const htmlFor = (e) => { const f = fileFor(e); return f ? img(f, e) : null; };

  window.L1Icon = (name, o) => (NAMED[name] ? img(NAMED[name], "", o && o.cls) : "");
  window.L1EmojiToIcons = (text) => String(text).replace(RE, (m) => htmlFor(m) || m);

  function skip(node) {
    for (let p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP.has(p.nodeName) || p.namespaceURI === "http://www.w3.org/2000/svg" || p.isContentEditable || p.hasAttribute("data-keep-emoji")) return true;
    }
    return false;
  }
  function swapText(node) {
    const text = node.nodeValue;
    RE.lastIndex = 0;
    if (!text || !RE.test(text) || skip(node)) return;
    RE.lastIndex = 0;
    let out = "", last = 0, hit = false, m;
    while ((m = RE.exec(text))) {
      const h = htmlFor(m[0]);
      if (!h) continue;
      hit = true;
      out += esc(text.slice(last, m.index)) + h;
      last = m.index + m[0].length;
    }
    if (!hit) return;
    out += esc(text.slice(last));
    const tpl = document.createElement("template");
    tpl.innerHTML = out;
    node.replaceWith(tpl.content);
  }
  // a text-only button or heading gets an emoji in front, chosen by its label
  const LABELLED = "button, h2, h3, .hm-city-title, .hw-kicker, .hub-section-label, .wd-kicker, .pg-title, .l1-sub, .sc-sub, .sc-stats span, .pg-stats span";
  function labelIcon(el) {
    if (el.querySelector("svg, img") || el.hasAttribute("data-keep-emoji")) return;
    const label = el.textContent.replace(/[ʻ’‘`]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
    if (!label || label.length > 40) return;
    const hit = LABELS.find(([re]) => re.test(label));
    if (hit) el.insertAdjacentHTML("afterbegin", img(hit[1], "", "l1-lead"));
  }
  function sweep(root) {
    if (!root) return;
    if (root.nodeType === 3) { swapText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && (SKIP.has(root.nodeName) || root.namespaceURI === "http://www.w3.org/2000/svg")) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) list.push(n);
    list.forEach(swapText);
    if (root.nodeType === 1 && root.matches(LABELLED)) labelIcon(root);
    if (root.querySelectorAll) root.querySelectorAll(LABELLED).forEach(labelIcon);
  }
  window.L1Icons = { sweep };

  const css = document.createElement("style");
  css.textContent = `img.l1-emo{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.28em;flex:none;margin:0 .04em;-webkit-user-drag:none;user-select:none}
img.l1-emo.l1-lead{margin:0 .4em 0 0}`;
  document.head ? document.head.appendChild(css) : document.documentElement.appendChild(css);

  const mo = new MutationObserver((recs) => {
    // runs as a microtask before the next paint, so a new screen never shows a system emoji first
    const queue = [];
    for (const r of recs) {
      if (r.type === "characterData") queue.push(r.target);
      else r.addedNodes.forEach((n) => queue.push(n));
    }
    queue.forEach(sweep);
  });
  const start = () => { sweep(document.body); mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
