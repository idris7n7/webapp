// Cartoon characters students pick from before entering the platform.
// Each character is drawn from a few parameters (skin, hair, outfit, accessory), so there are boys and
// girls of different backgrounds and styles. The chosen id is saved on the student (POST /api/character).
(function (window, document) {
  "use strict";

  const CHARACTERS = [
    // ----- boys -----
    { id: "aziz",   name: "Aziz",   g: "m", skin: "#e9bd8f", hair: "#17171c", style: "short",  acc: "doppi",      top: "#2f6fed", bg: "#dbeafe" },
    { id: "jack",   name: "Jack",   g: "m", skin: "#f7d6b8", hair: "#e3b04b", style: "short",  acc: "hoodie",     top: "#ef4444", bg: "#fee2e2" },
    { id: "kenji",  name: "Kenji",  g: "m", skin: "#f4d5a6", hair: "#14141a", style: "bangs",  acc: "glasses",    top: "#0ea5e9", bg: "#e0f2fe" },
    { id: "raj",    name: "Raj",    g: "m", skin: "#c58a5c", hair: "#18120f", style: "wavy",   acc: "stubble",    top: "#f59e0b", bg: "#fef3c7" },
    { id: "malik",  name: "Malik",  g: "m", skin: "#80502f", hair: "#120d0a", style: "afro",   acc: "headphones", top: "#16a34a", bg: "#dcfce7" },
    { id: "carlos", name: "Carlos", g: "m", skin: "#d3a070", hair: "#4a2a17", style: "wavy",   acc: "none",       top: "#facc15", bg: "#fef9c3" },
    { id: "omar",   name: "Omar",   g: "m", skin: "#d8a678", hair: "#16110e", style: "short",  acc: "beard",      top: "#f8fafc", bg: "#e2e8f0" },
    { id: "ivan",   name: "Ivan",   g: "m", skin: "#f6d0b4", hair: "#8a5a35", style: "short",  acc: "beanie",     top: "#7c3aed", bg: "#ede9fe" },
    { id: "sardor", name: "Sardor", g: "m", skin: "#e9bd8f", hair: "#2a1c14", style: "bangs",  acc: "none",       top: "#14b8a6", bg: "#ccfbf1" },
    { id: "noah",   name: "Noah",   g: "m", skin: "#f3cfae", hair: "#7a4a22", style: "curly",  acc: "glasses",    top: "#fb923c", bg: "#ffedd5" },
    // ----- girls -----
    { id: "malika", name: "Malika", g: "f", skin: "#e9bd8f", hair: "#17171c", style: "braids", acc: "headband",   top: "#e11d48", bg: "#ffe4e6" },
    { id: "emma",   name: "Emma",   g: "f", skin: "#f8d9c0", hair: "#c2410c", style: "ponytail", acc: "freckles", top: "#14b8a6", bg: "#ccfbf1" },
    { id: "mei",    name: "Mei",    g: "f", skin: "#f4d5a6", hair: "#14141a", style: "buns",   acc: "none",       top: "#ec4899", bg: "#fce7f3" },
    { id: "priya",  name: "Priya",  g: "f", skin: "#c58a5c", hair: "#15100d", style: "long",   acc: "bindi",      top: "#9333ea", bg: "#f3e8ff" },
    { id: "amara",  name: "Amara",  g: "f", skin: "#6f4025", hair: "#0d0907", style: "afro",   acc: "hoops",      top: "#f97316", bg: "#ffedd5" },
    { id: "sofia",  name: "Sofia",  g: "f", skin: "#d3a070", hair: "#4a2a17", style: "curly",  acc: "flower",     top: "#22c55e", bg: "#dcfce7" },
    { id: "layla",  name: "Layla",  g: "f", skin: "#dcab7e", hair: "#16110e", style: "hijab",  acc: "none",       top: "#0891b2", bg: "#cffafe", cloth: "#2dd4bf" },
    { id: "anya",   name: "Anya",   g: "f", skin: "#f8d3b8", hair: "#e8c36a", style: "braids", acc: "none",       top: "#3b82f6", bg: "#dbeafe" },
    { id: "zilola", name: "Zilola", g: "f", skin: "#e9bd8f", hair: "#17171c", style: "long",   acc: "headband",   top: "#8b5cf6", bg: "#ede9fe" },
    { id: "yuki",   name: "Yuki",   g: "f", skin: "#f6dcc3", hair: "#14141a", style: "bob",    acc: "none",       top: "#ef4444", bg: "#fee2e2" },
  ];
  const BY_ID = {};
  CHARACTERS.forEach((c) => { BY_ID[c.id] = c; });

  const INK = "#2a1a12";

  function hairBack(c) {
    const h = c.hair;
    switch (c.style) {
      case "afro": return `<circle cx="60" cy="46" r="35" fill="${h}"/>`;
      case "curly": return `<g fill="${h}"><circle cx="38" cy="42" r="13"/><circle cx="50" cy="30" r="14"/><circle cx="70" cy="30" r="14"/><circle cx="82" cy="42" r="13"/><circle cx="34" cy="62" r="11"/><circle cx="86" cy="62" r="11"/></g>`;
      case "long": return `<path d="M31 50 Q28 98 40 112 L80 112 Q92 98 89 50Z" fill="${h}"/>`;
      case "bob": return `<path d="M30 52 Q27 90 40 94 L80 94 Q93 90 90 52Z" fill="${h}"/>`;
      case "ponytail": return `<path d="M82 44 Q108 44 104 82 Q100 96 92 98 Q96 76 84 62Z" fill="${h}"/>`;
      case "buns": return `<circle cx="36" cy="26" r="11" fill="${h}"/><circle cx="84" cy="26" r="11" fill="${h}"/>`;
      case "braids": return `<g fill="${h}">${[0, 1, 2, 3].map((i) => `<ellipse cx="33" cy="${74 + i * 9}" rx="6" ry="5.5"/><ellipse cx="87" cy="${74 + i * 9}" rx="6" ry="5.5"/>`).join("")}</g><path d="M31 52 Q30 70 34 78 L40 72Z M89 52 Q90 70 86 78 L80 72Z" fill="${h}"/>`;
      case "hijab": return `<path d="M28 60 Q26 18 60 17 Q94 18 92 60 Q94 92 108 118 L12 118 Q26 92 28 60Z" fill="${c.cloth}"/>`;
      default: return "";
    }
  }

  function hairFront(c) {
    const h = c.hair;
    switch (c.style) {
      case "short": return `<path d="M34 56 Q31 26 60 25 Q89 26 86 56 Q80 42 66 38 Q52 44 42 38 Q36 44 34 56Z" fill="${h}"/>`;
      case "bangs": return `<path d="M33 60 Q30 24 60 23 Q90 24 87 60 L85 44 Q60 50 35 44Z" fill="${h}"/>`;
      case "wavy": return `<path d="M33 58 Q28 24 60 23 Q92 24 87 58 Q84 44 74 38 Q66 48 56 38 Q46 46 38 40 Q34 46 33 58Z" fill="${h}"/>`;
      case "afro": return `<path d="M36 50 Q40 34 60 34 Q80 34 84 50 Q74 42 60 42 Q46 42 36 50Z" fill="${h}"/>`;
      case "curly": return `<path d="M36 50 Q42 34 60 34 Q78 34 84 50 Q72 44 60 44 Q48 44 36 50Z" fill="${h}"/>`;
      case "long": case "bob": case "ponytail": case "buns": case "braids":
        return `<path d="M33 58 Q30 24 60 23 Q90 24 87 58 Q86 46 74 40 Q62 50 46 40 Q36 46 33 58Z" fill="${h}"/>`;
      case "hijab": return `<path d="M33 52 Q34 28 60 27 Q86 28 87 52 Q82 40 60 40 Q38 40 33 52Z" fill="${c.cloth}"/><path d="M33 52 Q60 38 87 52" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
      default: return "";
    }
  }

  function accessory(c) {
    switch (c.acc) {
      case "doppi": return `<path d="M33 46 Q60 12 87 46 L87 53 Q60 40 33 53Z" fill="#17171c"/><path d="M40 44 Q60 26 80 44" fill="none" stroke="#fff" stroke-width="2.2"/><g fill="#fff"><path d="M60 29 l3 5 -3 5 -3 -5z"/><path d="M47 36 l2.4 4 -2.4 4 -2.4 -4z"/><path d="M73 36 l2.4 4 -2.4 4 -2.4 -4z"/></g>`;
      case "beanie": return `<path d="M33 50 Q32 18 60 17 Q88 18 87 50Z" fill="${c.top}"/><rect x="31" y="44" width="58" height="10" rx="5" fill="#fff" opacity=".9"/><circle cx="60" cy="14" r="6" fill="#fff"/>`;
      case "headphones": return `<path d="M32 62 Q30 18 60 17 Q90 18 88 62" fill="none" stroke="#1f2937" stroke-width="5"/><rect x="26" y="56" width="12" height="20" rx="6" fill="#ef4444"/><rect x="82" y="56" width="12" height="20" rx="6" fill="#ef4444"/>`;
      case "glasses": return `<g fill="rgba(255,255,255,.35)" stroke="${INK}" stroke-width="2.6"><circle cx="48" cy="62" r="9"/><circle cx="72" cy="62" r="9"/><path d="M57 62 h6" fill="none"/></g>`;
      case "beard": return `<path d="M36 70 Q36 100 60 102 Q84 100 84 70 Q80 86 60 88 Q40 86 36 70Z" fill="${c.hair}"/><path d="M50 82 Q60 78 70 82" fill="none" stroke="${c.hair}" stroke-width="4" stroke-linecap="round"/>`;
      case "stubble": return `<path d="M38 74 Q40 96 60 98 Q80 96 82 74 Q78 88 60 90 Q42 88 38 74Z" fill="${c.hair}" opacity=".45"/>`;
      case "headband": return `<path d="M33 46 Q60 34 87 46 L86 54 Q60 42 34 54Z" fill="${c.top}"/><circle cx="82" cy="40" r="6" fill="#fde047"/><circle cx="82" cy="40" r="2.5" fill="#f97316"/>`;
      case "flower": return `<g transform="translate(82 36)"><g fill="#fb7185"><circle cx="0" cy="-6" r="5"/><circle cx="6" cy="-2" r="5"/><circle cx="4" cy="5" r="5"/><circle cx="-4" cy="5" r="5"/><circle cx="-6" cy="-2" r="5"/></g><circle r="3.5" fill="#fde047"/></g>`;
      case "freckles": return `<g fill="#b9794f"><circle cx="46" cy="78" r="1.3"/><circle cx="52" cy="80" r="1.3"/><circle cx="44" cy="82" r="1.3"/><circle cx="74" cy="78" r="1.3"/><circle cx="68" cy="80" r="1.3"/><circle cx="76" cy="82" r="1.3"/></g>`;
      case "bindi": return `<circle cx="60" cy="53" r="2.4" fill="#dc2626"/>`;
      case "hoops": return `<g fill="none" stroke="#f5b700" stroke-width="2.6"><circle cx="33" cy="84" r="6"/><circle cx="87" cy="84" r="6"/></g>`;
      case "hoodie": return `<path d="M24 118 Q24 100 36 98 L60 112 L84 98 Q96 100 96 118Z" fill="${c.top}" opacity=".0"/>`;
      default: return "";
    }
  }

  function svg(c) {
    const girl = c.g === "f";
    const body = c.acc === "hoodie"
      ? `<path d="M14 120 Q16 96 40 92 L80 92 Q104 96 106 120Z" fill="${c.top}"/><path d="M44 92 Q60 108 76 92" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M52 98 v14 M68 98 v14" stroke="#fff" stroke-width="2" opacity=".8"/>`
      : `<path d="M14 120 Q16 96 40 92 L80 92 Q104 96 106 120Z" fill="${c.top}"/><path d="M48 92 Q60 104 72 92Z" fill="${girl ? "#fff" : c.acc === "none" || c.acc === "doppi" ? "#fff" : "rgba(255,255,255,.85)"}" opacity=".9"/>`;
    const neck = `<rect x="50" y="82" width="20" height="16" rx="6" fill="${c.skin}"/><rect x="50" y="86" width="20" height="5" fill="rgba(0,0,0,.08)"/>`;
    const head = `<ellipse cx="60" cy="62" rx="27" ry="30" fill="${c.skin}"/><ellipse cx="33.5" cy="66" rx="4.5" ry="7" fill="${c.skin}"/><ellipse cx="86.5" cy="66" rx="4.5" ry="7" fill="${c.skin}"/>`;
    const lashes = girl ? `<path d="M40 61 q4 -5 9 -1 M80 61 q-4 -5 -9 -1" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` : "";
    const brow = c.style === "hijab" || girl ? "#3b2a22" : c.hair;
    const face = `
      <g stroke-linecap="round">
        <path d="M40 54 q8 -5 16 -1 M64 53 q8 -4 16 1" fill="none" stroke="${brow}" stroke-width="3"/>
        <ellipse cx="48" cy="64" rx="4.2" ry="5" fill="${INK}"/><ellipse cx="72" cy="64" rx="4.2" ry="5" fill="${INK}"/>
        <circle cx="49.6" cy="62.2" r="1.5" fill="#fff"/><circle cx="73.6" cy="62.2" r="1.5" fill="#fff"/>
        ${lashes}
        <path d="M60 68 q-3 6 1 8" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="2"/>
        <path d="M51 82 Q60 90 69 82" fill="${girl ? "#e0576a" : "#fff"}" stroke="#7a2e22" stroke-width="2.4" stroke-linejoin="round"/>
      </g>
      <circle cx="42" cy="76" r="5" fill="#f28b82" opacity=".32"/><circle cx="78" cy="76" r="5" fill="#f28b82" opacity=".32"/>`;
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name}" style="display:block;width:100%;height:100%">
      <rect width="120" height="120" fill="${c.bg}"/>
      ${hairBack(c)}${body}${neck}${head}${hairFront(c)}${face}${accessory(c)}
    </svg>`;
  }

  function html(id, size) {
    const c = BY_ID[id];
    if (!c) return "";
    return `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;overflow:hidden">${svg(c)}</span>`;
  }

  // ------------------------------------------------------------------ Picker
  // First visit: shown only to a student who has neither a character nor a Telegram photo. From the profile: always.
  let open = false;

  function student() {
    try { return typeof state !== "undefined" ? state.authStudent : null; } catch (e) { return null; }
  }
  function needsPick() {
    const u = student();
    if (!u || (u.role && u.role !== "student") || u.character || u.photoUrl) return false;
    if (u.status && u.status !== "approved") return false;
    try { if (state.mode === "teacher") return false; } catch (e) {}
    return true; // the avatar is required before entering the app
  }
  // "Keyinroq" on the first visit: the picture can still be chosen from the profile, the picker just stops popping up.
  const skipKey = (u) => "l1_char_skipped_" + (u.id || u.name);
  function skipped(u) { try { return localStorage.getItem(skipKey(u)) === "1"; } catch (e) { return false; } }
  function skip() { const u = student(); if (u) { try { localStorage.setItem(skipKey(u), "1"); } catch (e) {} } }

  function showPicker(opts) {
    if (open) return;
    open = true;
    const change = !!(opts && opts.change);
    const u0 = student() || {};
    let gender = (BY_ID[u0.character] || {}).g || "m";
    let chosen = BY_ID[u0.character] || u0.character === "tg" ? u0.character : "";
    const wrap = document.createElement("div");
    wrap.id = "l1CharPicker";
    wrap.style.cssText = "position:fixed;inset:0;z-index:9600;overflow-y:auto;background:var(--l1-bg,#eef2ff);-webkit-overflow-scrolling:touch";
    document.body.appendChild(wrap);
    const done = () => { open = false; wrap.remove(); };

    const ring = (on) => `border:3px solid ${on ? "var(--l1-primary,#4f46e5)" : "transparent"};${on ? "transform:scale(1.03);" : ""}`;
    const render = () => {
      const list = CHARACTERS.filter((c) => c.g === gender);
      const photo = u0.photoUrl ? `<button type="button" data-id="tg" style="display:flex;align-items:center;gap:12px;width:100%;padding:10px 14px;margin-bottom:14px;border-radius:20px;background:var(--l1-card,#fff);cursor:pointer;${ring(chosen === "tg")}box-shadow:0 10px 24px -14px rgba(15,23,42,.35)">
          <span style="display:block;width:54px;height:54px;border-radius:50%;overflow:hidden;flex:none"><img src="${u0.photoUrl}" alt="" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover"></span>
          <span style="font-weight:800;font-size:15px;color:var(--l1-ink,#0f172a)">Telegram rasmim</span></button>` : "";
      wrap.innerHTML = `
        <div style="max-width:520px;margin:0 auto;padding:18px 16px calc(28px + env(safe-area-inset-bottom,0px))">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div style="font-size:23px;font-weight:800;letter-spacing:-.02em;color:var(--l1-ink,#0f172a)">${change ? "Profil rasmi" : "Personajingizni tanlang"}${u0.firstName || u0.name ? `<div style="font-size:15px;font-weight:700;color:var(--l1-muted,#64748b);margin-top:2px">${String(u0.firstName || u0.name).replace(/[<>&"]/g, "")}</div>` : ""}</div>
            ${change ? `<button type="button" data-close style="width:38px;height:38px;border-radius:50%;border:0;font-size:16px;font-weight:800;cursor:pointer;background:var(--l1-card,#fff);color:var(--l1-muted,#64748b)" aria-label="Yopish" title="Yopish">✕</button>` : ""}
          </div>
          ${photo}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:var(--l1-card,#fff);border:1px solid var(--l1-line,#e0e7ff);border-radius:999px;padding:4px;margin-bottom:14px">
            ${[["m", "O'g'il bola"], ["f", "Qiz bola"]].map(([g, label]) => `<button type="button" data-g="${g}" style="height:40px;border-radius:999px;font-weight:800;font-size:14px;border:0;cursor:pointer;${gender === g ? "background:var(--l1-primary,#4f46e5);color:#fff" : "background:transparent;color:var(--l1-muted,#64748b)"}">${label}</button>`).join("")}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
            ${list.map((c) => `<button type="button" data-id="${c.id}" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:20px;background:var(--l1-card,#fff);cursor:pointer;${ring(chosen === c.id)}box-shadow:0 10px 24px -14px rgba(15,23,42,.35)">
              <span style="display:block;width:78px;height:78px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px #fff,0 6px 14px -6px rgba(15,23,42,.4)">${svg(c)}</span>
              <span style="font-weight:800;font-size:14px;color:var(--l1-ink,#0f172a)">${c.name}</span>
            </button>`).join("")}
          </div>
          <div id="l1CharErr" style="min-height:20px;text-align:center;color:#dc2626;font-size:13px;font-weight:700;margin-top:12px"></div>
          <button type="button" id="l1CharGo" style="width:100%;height:52px;border-radius:999px;border:0;font-weight:800;font-size:16px;color:#fff;background:var(--l1-primary,#4f46e5);box-shadow:0 12px 24px -12px rgba(47,107,255,.9);cursor:pointer;margin-top:4px">${change ? "Saqlash" : "Tanlash"}</button>
        </div>`;
      wrap.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { gender = b.dataset.g; render(); }));
      wrap.querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => { chosen = b.dataset.id; render(); }));
      const x = wrap.querySelector("[data-close]");
      if (x) x.addEventListener("click", () => { if (!change) skip(); done(); });
      wrap.querySelector("#l1CharGo").addEventListener("click", async () => {
        const err = wrap.querySelector("#l1CharErr");
        if (!chosen) { err.textContent = "Avval rasmni tanlang."; return; }
        const btn = wrap.querySelector("#l1CharGo");
        btn.disabled = true; btn.style.opacity = ".6";
        try {
          await window.L1.api("/api/character", { character: chosen });
          const u = student();
          if (u) u.character = chosen;
          location.reload();
        } catch (e) {
          btn.disabled = false; btn.style.opacity = "1";
          err.textContent = (e && e.message) || "Saqlab bo'lmadi. Qayta urinib ko'ring.";
        }
      });
    };
    render();
  }

  function tick() { if (!open && needsPick()) showPicker(); }

  // "tg" means: show the Telegram photo (no cartoon), so svg("tg") is empty and avatar() falls back to the photo
  window.L1_Characters = { list: CHARACTERS, html, svg: (id) => (BY_ID[id] ? svg(BY_ID[id]) : ""), open: () => showPicker({ change: true }) };
  setInterval(() => { if (!document.hidden) tick(); }, 1500);
})(window, document);
