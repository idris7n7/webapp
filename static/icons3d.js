/* Level Up — glossy "clay" 3D icons (inline SVG, no external assets). Usage: Icons3D.html("book", 52) */
(function () {
  let uid = 0;
  const defs = (id) => ({
    book: `
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE3FF"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8F7BFF"/><stop offset="1" stop-color="#4F3FE0"/></linearGradient>`,
    task: `
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DDE8FF"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC857"/><stop offset="1" stop-color="#FF8A1F"/></linearGradient>`,
    game: `
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B58BFF"/><stop offset="1" stop-color="#6A3DDB"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E2F5"/></linearGradient>`,
    trophy: `
      <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="0.55" stop-color="#FFC21A"/><stop offset="1" stop-color="#E08A00"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A62F0"/><stop offset="1" stop-color="#4332B8"/></linearGradient>`,
  });

  const body = (name, id) => {
    switch (name) {
      case "book": return `
        <ellipse cx="32" cy="56" rx="19" ry="4" fill="#1b1464" opacity=".28"/>
        <path d="M6 18c9-3 18-2 26 3v33c-8-5-17-6-26-3z" fill="url(#${id}b)"/>
        <path d="M58 18c-9-3-18-2-26 3v33c8-5 17-6 26-3z" fill="#3A2BC4"/>
        <path d="M9 15c8-2 16-1 23 3v33c-7-4-15-5-23-3z" fill="url(#${id}a)"/>
        <path d="M55 15c-8-2-16-1-23 3v33c7-4 15-5 23-3z" fill="url(#${id}a)"/>
        <path d="M32 18v33" stroke="#B9C4F2" stroke-width="1.6"/>
        <g stroke="#8F9DE0" stroke-width="2" stroke-linecap="round"><path d="M13 24c4-1 8-1 12 1"/><path d="M13 31c4-1 8-1 12 1"/><path d="M13 38c4-1 8-1 12 1"/><path d="M39 25c4-2 8-2 12-1"/><path d="M39 32c4-2 8-2 12-1"/></g>
        <path d="M11 17c5-1 9-1 13 1" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9" fill="none"/>`;
      case "task": return `
        <ellipse cx="32" cy="57" rx="17" ry="3.8" fill="#0b2a7a" opacity=".28"/>
        <rect x="13" y="7" width="35" height="47" rx="8" fill="#B7C8F5"/>
        <rect x="11" y="5" width="35" height="47" rx="8" fill="url(#${id}a)"/>
        <rect x="21" y="2" width="15" height="9" rx="4.5" fill="#6C8CFF"/>
        <rect x="23" y="3.5" width="11" height="3" rx="1.5" fill="#fff" opacity=".6"/>
        <g stroke="#9FB3E6" stroke-width="3" stroke-linecap="round"><path d="M18 22h22"/><path d="M18 30h22"/><path d="M18 38h12"/></g>
        <g transform="rotate(38 45 40)"><rect x="40" y="18" width="10" height="32" rx="3" fill="url(#${id}b)"/><path d="M40 50l5 9 5-9z" fill="#FFE2B0"/><path d="M43 55.4l2 3.6 2-3.6z" fill="#3a2a10"/><rect x="41.5" y="19" width="2.4" height="28" rx="1.2" fill="#fff" opacity=".55"/></g>`;
      case "game": return `
        <ellipse cx="32" cy="55" rx="23" ry="4.2" fill="#1b0f5c" opacity=".3"/>
        <path d="M14 20h36c7 0 11 7 12 16l1.5 10c.8 6-3 10-8 8-4-1.4-6-5-9.5-5H18c-3.5 0-5.500 3.600-9.500 5-5 2-8.800-2-8-8L2 36c1-9 5-16 12-16z" fill="#4A2AB0" transform="translate(0 3)"/>
        <path d="M14 20h36c7 0 11 7 12 16l1.5 10c.8 6-3 10-8 8-4-1.4-6-5-9.5-5H18c-3.5 0-5.500 3.600-9.500 5-5 2-8.800-2-8-8L2 36c1-9 5-16 12-16z" fill="url(#${id}a)"/>
        <path d="M12 24h40c3 0 5 2 6 5-2-1.500-4-2-7-2H13c-3 0-5 .5-7 2 1-3 3-5 6-5z" fill="#fff" opacity=".35"/>
        <rect x="11" y="31" width="16" height="5.200" rx="2.600" fill="url(#${id}b)"/><rect x="16.400" y="25.600" width="5.200" height="16" rx="2.600" fill="url(#${id}b)"/>
        <circle cx="43" cy="30" r="3.800" fill="#FF7AA8"/><circle cx="43" cy="30" r="2" fill="#fff" opacity=".5"/>
        <circle cx="50" cy="36" r="3.800" fill="#5BE3A8"/><circle cx="50" cy="36" r="2" fill="#fff" opacity=".5"/>
        <circle cx="36" cy="36" r="3.800" fill="#FFD04D"/><circle cx="36" cy="36" r="2" fill="#fff" opacity=".5"/>`;
      case "trophy": return `
        <ellipse cx="32" cy="58" rx="17" ry="3.600" fill="#6b3f00" opacity=".3"/>
        <path d="M17 14H8c0 11 4 17 12 18" fill="none" stroke="#E69A00" stroke-width="5" stroke-linecap="round"/>
        <path d="M47 14h9c0 11-4 17-12 18" fill="none" stroke="#E69A00" stroke-width="5" stroke-linecap="round"/>
        <path d="M16 6h32v14c0 11-7 19-16 19S16 31 16 20z" fill="url(#${id}a)"/>
        <path d="M21 8h8c-3 10-2 22 4 29-8-1-13-8-13-17z" fill="#fff" opacity=".5"/>
        <path d="M32 15l2.600 5.300 5.800.8-4.200 4.100 1 5.800-5.200-2.800-5.200 2.800 1-5.800-4.200-4.100 5.800-.8z" fill="#fff" opacity=".92"/>
        <rect x="28" y="38" width="8" height="9" rx="2" fill="#E69A00"/>
        <rect x="19" y="46" width="26" height="11" rx="4" fill="url(#${id}b)"/>
        <rect x="22" y="48" width="20" height="2.600" rx="1.300" fill="#fff" opacity=".35"/>`;
      default: return "";
    }
  };

  window.Icons3D = {
    html(name, size = 48, extra = "") {
      const id = "i3d" + (uid++);
      return `<svg class="l1-3d ${extra}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" focusable="false"><defs>${defs(id)[name] || ""}</defs>${body(name, id)}</svg>`;
    },
  };
})();
