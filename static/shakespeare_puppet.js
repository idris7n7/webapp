/* The running Shakespeare of the dragon game (dragon_chase.js).
 *
 * A puppet: the head (hair, face, beard and white collar) is the picture static/shakespeare/run_head.webp, cut out of the
 * 3D Shakespeare of the app; everything else - the black doublet, the puffed sleeves with white cuffs, the breeches, the red
 * stockings and the buckled shoes - is painted here, part by part, with soft shading. The game moves the parts like joints
 * (hip, knee, ankle, shoulder, elbow, neck), so he really runs, stumbles and looks back.
 *
 *   L1_ShakespearePuppet.build(headImage) -> { parts, heads }       parts: torso, pelvis, uarm, farm_fist, farm_open,
 *                                                                   thigh, shin, shoe (and the *_dark ones for the far side)
 *                                                                   heads: happy, worried, scared, crying, pained, glance
 *   Every part is { c: canvas, w, h, px, py } in the game's 360-unit drawing space; (px, py) is the joint.
 */
(function () {
  "use strict";

  const DENS = 3; // canvas pixels per drawing unit
  const TAU = Math.PI * 2;

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const shade = (h, f) => { const [r, g, b] = hex(h); return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`; };

  const COL = {
    cloth: ["#43434d", "#27272d", "#101014"], // light side, middle, shadow side of the black doublet
    hose: ["#c24457", "#8a2434", "#4d1220"],
    skin: ["#f9d9c0", "#efc2a1", "#cf936c"],
    linen: ["#fffaf0", "#f1eadb", "#c9bfa9"],
    leather: ["#98643a", "#6a4325", "#32200f"],
    gold: "#e2b24a",
  };

  function makePart(w, h, px, py, draw) {
    const c = document.createElement("canvas");
    c.width = Math.ceil(w * DENS);
    c.height = Math.ceil(h * DENS);
    const ctx = c.getContext("2d");
    ctx.scale(DENS, DENS);
    ctx.translate(px, py); // from here on (0, 0) is the joint
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    draw(ctx);
    return { c, w: c.width / DENS, h: c.height / DENS, px, py };
  }

  const across = (ctx, x0, x1, cols, f) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, shade(cols[0], f)); g.addColorStop(0.4, shade(cols[1], f)); g.addColorStop(1, shade(cols[2], f));
    return g;
  };
  const outline = (ctx, f) => { ctx.strokeStyle = `rgba(0,0,0,${0.42 * f + 0.1})`; ctx.lineWidth = 1.1; ctx.stroke(); };

  // ---------------------------------------------------------------- body parts (f: 1 near side, <1 far side, darker)
  function torso(f) {
    return makePart(92, 134, 46, 110, (ctx) => {
      const body = new Path2D();
      body.moveTo(-31, 8);
      body.bezierCurveTo(-30, -12, -31, -40, -33, -64);
      body.bezierCurveTo(-35, -82, -34, -92, -26, -98);
      body.quadraticCurveTo(0, -107, 26, -98);
      body.bezierCurveTo(34, -92, 35, -82, 33, -64);
      body.bezierCurveTo(31, -40, 30, -12, 31, 8);
      body.lineTo(0, 18);
      body.closePath();
      ctx.fillStyle = across(ctx, -34, 34, COL.cloth, f);
      ctx.fill(body);
      ctx.save();
      ctx.clip(body);
      // cloth panels: seams and a soft light on the chest
      ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1;
      [-15, 15].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, -98); ctx.quadraticCurveTo(x * 1.05, -50, x, 14); ctx.stroke(); });
      const glow = ctx.createRadialGradient(-12, -62, 2, -12, -62, 34);
      glow.addColorStop(0, "rgba(255,255,255,.14)"); glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow; ctx.fillRect(-40, -110, 80, 130);
      ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(-40, -8, 80, 6); // the waist
      ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.lineWidth = 1; // centre seam and buttons
      ctx.beginPath(); ctx.moveTo(0, -99); ctx.lineTo(0, 17); ctx.stroke();
      for (let y = -88; y < 6; y += 14.7) {
        ctx.fillStyle = shade("#5a5a66", f); ctx.beginPath(); ctx.arc(0, y, 2.4, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.arc(-0.7, y - 0.8, 0.9, 0, TAU); ctx.fill();
      }
      ctx.save(); ctx.stroke(body); ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.lineWidth = 1.2; ctx.stroke(body);
    });
  }

  function pelvis(f) { // the breeches between the two legs
    return makePart(66, 34, 33, 14, (ctx) => {
      ctx.fillStyle = across(ctx, -30, 30, COL.cloth, f);
      ctx.beginPath(); ctx.ellipse(0, 4, 29, 13, 0, 0, TAU); ctx.fill();
      outline(ctx, f);
    });
  }

  function uarm(f) { // the puffed shoulder roll and the sleeve down to the elbow
    return makePart(40, 66, 20, 18, (ctx) => {
      ctx.fillStyle = across(ctx, -8, 8, COL.cloth, f);
      ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(-7, 43); ctx.quadraticCurveTo(0, 49, 7, 43); ctx.lineTo(8, 6); ctx.closePath(); ctx.fill();
      outline(ctx, f);
      const roll = ctx.createRadialGradient(-5, -5, 1, 0, 0, 16);
      roll.addColorStop(0, shade(COL.cloth[0], f)); roll.addColorStop(0.55, shade(COL.cloth[1], f)); roll.addColorStop(1, shade(COL.cloth[2], f));
      ctx.fillStyle = roll; ctx.beginPath(); ctx.ellipse(0, 1, 14, 13, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 1, 14, 13, 0, 0, TAU); ctx.clip();
      for (let i = -2; i <= 2; i++) { // the ribs of the shoulder roll
        ctx.strokeStyle = i % 2 ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.13)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-15, i * 4.6 - 2); ctx.quadraticCurveTo(0, i * 4.6 + 3, 15, i * 4.6 - 2); ctx.stroke();
      }
      ctx.restore();
      outline(ctx, f);
    });
  }

  function cuff(ctx, f, y) { // the white linen cuff
    ctx.fillStyle = across(ctx, -10, 10, COL.linen, f);
    ctx.beginPath(); ctx.moveTo(-8, y); ctx.lineTo(8, y);
    for (let i = 0; i <= 4; i++) ctx.quadraticCurveTo(10 - i * 4.5 - 2.2, y + 12, 9 - i * 4.5 - 4.5, y + 9);
    ctx.lineTo(-8.5, y + 9); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.strokeStyle = "rgba(120,100,70,.35)"; ctx.beginPath(); ctx.moveTo(-6, y + 3); ctx.lineTo(6, y + 3); ctx.stroke();
  }
  function forearm(ctx, f) {
    ctx.fillStyle = across(ctx, -7, 7, COL.cloth, f);
    ctx.beginPath(); ctx.moveTo(-7.5, -3); ctx.lineTo(-6.2, 31); ctx.lineTo(6.2, 31); ctx.lineTo(7.5, -3); ctx.closePath(); ctx.fill();
    outline(ctx, f);
  }
  function farmFist(f) {
    return makePart(30, 70, 15, 6, (ctx) => {
      forearm(ctx, f);
      cuff(ctx, f, 26);
      ctx.fillStyle = across(ctx, -9, 9, COL.skin, f); // the fist
      ctx.beginPath(); ctx.ellipse(0, 46, 8.2, 8.8, 0, 0, TAU); ctx.fill(); outline(ctx, f);
      ctx.strokeStyle = shade("#b9774f", f); ctx.lineWidth = 0.9;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(1.5, 42 + i * 3.3, 4.6, -0.5, 1.4); ctx.stroke(); }
      ctx.fillStyle = shade("#f2c7a6", f); ctx.beginPath(); ctx.ellipse(-5.5, 41, 2.8, 4.2, 0.4, 0, TAU); ctx.fill(); // the thumb
    });
  }
  function farmOpen(f) { // an open hand, to catch his balance
    return makePart(34, 76, 17, 6, (ctx) => {
      forearm(ctx, f);
      cuff(ctx, f, 26);
      ctx.fillStyle = across(ctx, -9, 9, COL.skin, f);
      ctx.beginPath(); ctx.ellipse(0, 44, 8.4, 7.6, 0, 0, TAU); ctx.fill();
      [[-0.34, 12], [-0.12, 15], [0.1, 14], [0.3, 11]].forEach(([a, len]) => {
        ctx.save(); ctx.translate(0, 49); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(-1.7, 0); ctx.lineTo(-1.6, len); ctx.arc(0, len, 1.7, Math.PI, 0, true); ctx.lineTo(1.7, 0); ctx.closePath(); ctx.fill(); outline(ctx, f);
        ctx.restore();
      });
      ctx.save(); ctx.translate(-6, 42); ctx.rotate(0.9);
      ctx.beginPath(); ctx.moveTo(-1.9, 0); ctx.lineTo(-1.8, 10); ctx.arc(0, 10, 1.9, Math.PI, 0, true); ctx.lineTo(1.9, 0); ctx.closePath(); ctx.fill(); outline(ctx, f);
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(0, 44, 8.4, 7.6, 0, 0, TAU); outline(ctx, f);
    });
  }

  function thigh(f) { // puffed trunk hose: black with the red lining showing through the slashes
    return makePart(54, 72, 27, 6, (ctx) => {
      const hose = new Path2D();
      hose.moveTo(-13, 0); hose.bezierCurveTo(-25, 8, -26, 40, -14, 62); hose.lineTo(14, 62); hose.bezierCurveTo(26, 40, 25, 8, 13, 0); hose.closePath();
      ctx.fillStyle = across(ctx, -26, 26, COL.cloth, f); ctx.fill(hose);
      ctx.save(); ctx.clip(hose);
      [-11, -3.5, 4, 11.5].forEach((x) => {
        ctx.strokeStyle = shade(COL.hose[1], f); ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(x * 0.8, 6); ctx.quadraticCurveTo(x * 1.25, 34, x, 58); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x * 0.8 - 1.2, 6); ctx.quadraticCurveTo(x * 1.25 - 1.2, 34, x - 1.2, 58); ctx.stroke();
      });
      ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(-30, 54, 60, 10); // the gathered band above the knee
      ctx.restore();
      ctx.strokeStyle = shade(COL.gold, f); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-13.5, 55); ctx.lineTo(13.5, 55); ctx.stroke();
      ctx.stroke(hose); outline(ctx, f);
    });
  }

  function shin(f) { // the red stocking
    return makePart(22, 92, 11, 4, (ctx) => {
      const leg = new Path2D();
      leg.moveTo(-8, 0); leg.bezierCurveTo(-10, 16, -9, 34, -5.4, 79); leg.quadraticCurveTo(0, 83, 5.4, 79); leg.bezierCurveTo(9, 34, 10, 16, 8, 0); leg.closePath();
      ctx.fillStyle = across(ctx, -10, 10, COL.hose, f); ctx.fill(leg);
      ctx.save(); ctx.clip(leg);
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-3.6, 4); ctx.quadraticCurveTo(-5.2, 30, -2.6, 74); ctx.stroke();
      ctx.restore();
      ctx.stroke(leg); outline(ctx, f);
    });
  }

  function shoe(f) { // brown leather with a gold buckle; the toe points the way he runs (to the right)
    return makePart(48, 28, 13, 11, (ctx) => {
      const s = new Path2D();
      s.moveTo(-8, -7); s.lineTo(7, -7); s.bezierCurveTo(10, -1, 18, 2, 26, 4.5); s.bezierCurveTo(33, 6.5, 34, 13, 28, 14); s.lineTo(-9, 14); s.bezierCurveTo(-12.5, 8, -11, 0, -8, -7); s.closePath();
      const g = ctx.createLinearGradient(0, -8, 0, 15);
      g.addColorStop(0, shade(COL.leather[0], f)); g.addColorStop(0.55, shade(COL.leather[1], f)); g.addColorStop(1, shade(COL.leather[2], f));
      ctx.fillStyle = g; ctx.fill(s); outline(ctx, f); ctx.stroke(s);
      ctx.fillStyle = shade("#1a1109", f); // the sole
      ctx.beginPath(); ctx.moveTo(-10, 12); ctx.lineTo(30, 12); ctx.quadraticCurveTo(33, 15, 29, 16.5); ctx.lineTo(-9, 16.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = shade(COL.gold, f); ctx.fillRect(1.5, -3.5, 6.5, 5.5); // the buckle
      ctx.fillStyle = shade("#3b2a10", f); ctx.fillRect(3.2, -2, 3.2, 2.5);
      ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.beginPath(); ctx.ellipse(21, 7.2, 5.5, 1.8, 0.2, 0, TAU); ctx.fill();
    });
  }

  // ---------------------------------------------------------------- heads
  // the head picture is 275 x 335 px, the neck joint is at (142, 285); in game units it is 78 wide
  const HEAD_UNITS = 78 / 275;
  const HP = { eyeL: [103, 125], eyeR: [163, 119], mouth: [138, 184] }; // landmarks in the head picture

  function headMood(img, mood) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const shrink = 0.62; // sharper than a 4x reduction at draw time
    const c = document.createElement("canvas");
    c.width = Math.round(w * shrink); c.height = Math.round(h * shrink);
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.scale(shrink, shrink);
    ctx.drawImage(img, 0, 0);
    if (mood === "worried" || mood === "scared" || mood === "crying" || mood === "pained") {
      const [mx, my] = HP.mouth;
      // cover the smile with the skin round it, then paint the new mouth
      const skin = ctx.createRadialGradient(mx, my + 3, 4, mx, my + 3, 40);
      skin.addColorStop(0, "rgba(232,168,134,1)"); skin.addColorStop(0.7, "rgba(232,168,134,.95)"); skin.addColorStop(1, "rgba(232,168,134,0)");
      ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(mx, my + 4, 38, 17, 0, 0, TAU); ctx.fill();
      const dark = (rx, ry, cy) => {
        const g = ctx.createRadialGradient(mx, cy, 2, mx, cy, Math.max(rx, ry));
        g.addColorStop(0, "#2a0808"); g.addColorStop(1, "#5a1616");
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(mx, cy, rx, ry, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(110,40,32,.8)"; ctx.lineWidth = 2; ctx.stroke();
      };
      ctx.lineCap = "round";
      if (mood === "worried") { // a tight, wobbly line of the mouth
        ctx.strokeStyle = "#8a3b2f"; ctx.lineWidth = 4.2;
        ctx.beginPath(); ctx.moveTo(mx - 20, my + 6); ctx.quadraticCurveTo(mx - 9, my + 1, mx, my + 6); ctx.quadraticCurveTo(mx + 9, my + 11, mx + 20, my + 5); ctx.stroke();
      } else if (mood === "scared") { // a round open mouth, tongue and all
        dark(14, 15, my + 8);
        ctx.fillStyle = "#e0707a"; ctx.beginPath(); ctx.ellipse(mx, my + 17, 8, 4.6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fffaf0"; ctx.fillRect(mx - 9, my - 1.5, 18, 5);
      } else if (mood === "pained") { // gritted teeth
        dark(20, 10, my + 7);
        ctx.fillStyle = "#fffaf0"; ctx.fillRect(mx - 16, my + 0.5, 32, 6.5);
        ctx.strokeStyle = "rgba(120,100,90,.7)"; ctx.lineWidth = 1;
        for (let i = -12; i <= 12; i += 6) { ctx.beginPath(); ctx.moveTo(mx + i, my + 0.5); ctx.lineTo(mx + i, my + 7); ctx.stroke(); }
      } else { // crying: a wide wail with the corners turned down
        ctx.fillStyle = "#4a1010";
        ctx.beginPath(); ctx.moveTo(mx - 24, my + 14); ctx.quadraticCurveTo(mx, my - 6, mx + 24, my + 14); ctx.quadraticCurveTo(mx, my + 25, mx - 24, my + 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#e0707a"; ctx.beginPath(); ctx.ellipse(mx, my + 17.5, 10, 4.4, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(147,219,255,.6)"; // wet eyes
        [HP.eyeL, HP.eyeR].forEach(([ex, ey]) => { ctx.beginPath(); ctx.ellipse(ex, ey + 9, 9, 5, 0, 0, TAU); ctx.fill(); });
      }
    }
    return { c, w: w * HEAD_UNITS, h: h * HEAD_UNITS, px: 142 * HEAD_UNITS, py: 285 * HEAD_UNITS };
  }

  function build(headImg) {
    const parts = {};
    [["", 1], ["_dark", 0.62]].forEach(([suffix, f]) => {
      parts["uarm" + suffix] = uarm(f);
      parts["farm_fist" + suffix] = farmFist(f);
      parts["farm_open" + suffix] = farmOpen(f);
      parts["thigh" + suffix] = thigh(f);
      parts["shin" + suffix] = shin(f);
      parts["shoe" + suffix] = shoe(f);
    });
    parts.torso = torso(1);
    parts.pelvis = pelvis(1);
    const heads = {};
    ["happy", "worried", "scared", "crying", "pained"].forEach((m) => { heads[m] = headMood(headImg, m); });
    heads.glance = heads.happy;
    return { parts, heads };
  }

  // Draws a part with its joint at (dx, dy) of the 360-unit drawing space (k: pixels per unit), turned by rotRad.
  function drawPart(ctx, p, dx, dy, k, rotRad, sx, sy) {
    ctx.save();
    ctx.translate(dx * k, dy * k);
    if (rotRad) ctx.rotate(rotRad);
    if ((sx !== undefined && sx !== 1) || (sy !== undefined && sy !== 1)) ctx.scale(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy);
    ctx.drawImage(p.c, -p.px * k, -p.py * k, p.w * k, p.h * k);
    ctx.restore();
  }

  window.L1_ShakespearePuppet = { build, drawPart };
})();
