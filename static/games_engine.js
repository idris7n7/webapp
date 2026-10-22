// Games Engine for Level Up: "Tezkor viktorina" (the "Idris va Ajdarho" chase lives in dragon_chase.js).
// Both use the homework scoring (1st try 25, 2nd 15, 3rd/4th 5) and report each question's tries
// to /api/game/finish, where game points are capped per day. Teacher Idris hosts both games.
(function (window) {
  "use strict";
  const L1 = () => window.L1 || null;
  const esc = (v) => (window.esc ? window.esc(v) : String(v == null ? "" : v));
  const POINTS = [25, 15, 5, 5];

  // ------------------------------------------------------------------ sounds (kept for old callers)
  let audioCtx = null;
  function playTone(freq, type, duration, delay = 0, gainLevel = 0.15) {
    try {
      if (L1() && L1().Sound.muted) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) {}
  }
  const Sound = {
    correct() { playTone(523.25, "sine", 0.12, 0, 0.18); playTone(659.25, "sine", 0.18, 0.1, 0.2); playTone(783.99, "sine", 0.25, 0.2, 0.22); },
    wrong() { playTone(220, "triangle", 0.16, 0, 0.18); playTone(165, "triangle", 0.24, 0.12, 0.16); },
    tick() { playTone(800, "triangle", 0.04, 0, 0.06); },
    rumble() { playTone(110, "sawtooth", 0.4, 0, 0.18); playTone(85, "triangle", 0.5, 0.1, 0.2); },
    victory() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, "sine", i === 3 ? 0.45 : 0.15, i * 0.12, 0.2)); },
  };

  // ------------------------------------------------------------------ helpers
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function correct(answer, spec) {
    if (typeof window.isAnswerCorrect === "function") return window.isAnswerCorrect(answer, spec);
    const n = (v) => String(v || "").trim().toLowerCase();
    return String(spec).split("|").map(n).includes(n(answer));
  }
  const primary = (spec) => String(spec).split("|")[0];
  function haptic(kind) { const l = L1(); if (l) l.Haptic[kind](); }
  function fx(kind, el) {
    const l = L1();
    if (!l) return;
    if (kind === "right") { l.Fx.flash("right"); }
    if (kind === "wrong") { l.Fx.flash("wrong"); l.Fx.shake(el); }
  }
  function idrisReact(hostId, pose, mood) {
    const l = L1();
    const host = document.getElementById(hostId);
    if (l && host) l.Idris.react(host.querySelector(".idris"), pose, mood);
  }
  function mountIdris(hostId, pose, size) {
    const l = L1();
    const host = document.getElementById(hostId);
    if (l && host && !host.querySelector(".idris")) host.innerHTML = l.Idris.html(pose, size);
  }
  function say(bubbleId, text, kind) {
    const b = document.getElementById(bubbleId);
    if (!b) return;
    b.className = "idris-bubble" + (kind ? " is-" + kind : "");
    b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
    b.textContent = text;
  }
  const line = (kind) => (L1() ? L1().Idris.line(kind) : "");
  // Scroll a game up under the app bar so the game and all its answers are on screen together.
  function focusGame(areaId) {
    const area = document.getElementById(areaId);
    if (area && area.offsetParent !== null) area.scrollIntoView({ block: "start" });
  }

  // Questions: this week's homework (multiple-choice ones) first, then the practice suite.
  function getGameQuestions() {
    const week = [];
    try {
      const shell = window.L1_Shell;
      const now = Date.now() / 1000;
      const ids = new Set();
      ((shell && shell.data.assignments) || []).filter((a) => a.deadline > now).forEach((a) => a.exercises.forEach((e) => ids.add(e.id)));
      if (ids.size && typeof state !== "undefined") {
        state.exercises.filter((e) => ids.has(e.id)).forEach((e) => (e.questions || []).forEach((q) => {
          if (q.options && q.options.length >= 2 && q.a) {
            week.push({ category: "Bu hafta", q: String(q.q).replace(/^\s*\d+\.\s*/, ""), options: q.options, a: q.a, img: q.img || "" });
          }
        }));
      }
    } catch (e) {}
    const suite = [];
    const D = typeof PRACTICING_SUITE_DATA !== "undefined" ? PRACTICING_SUITE_DATA : null;
    if (D) {
      ((D.gram_mcq && D.gram_mcq.questions) || []).forEach((q) => suite.push({ category: "Grammar", q: q.q, options: q.options || ["am", "is", "are"], a: q.a }));
      ((D.vocab_match_meaning && D.vocab_match_meaning.questions) || []).forEach((q) => suite.push({
        category: "Vocabulary", q: `"${String(q.q).replace(/^\d+\.\s*/, "")}" so'zining tarjimasi nima?`, options: q.options, a: q.a,
      }));
      ((D.vocab_complete_sentence && D.vocab_complete_sentence.questions) || []).forEach((q) => suite.push({ category: "Vocabulary", q: q.q, options: q.options || ["baker", "judge", "nurse"], a: q.a }));
    }
    let pool = week.length >= 5 ? shuffle(week).concat(shuffle(suite)) : shuffle(week.concat(suite));
    pool = pool.filter((q) => q.options && q.options.length >= 2 && q.options.some((o) => correct(o, q.a)));
    if (!pool.length) {
      pool = [
        { category: "Grammar", q: "I ___ a student.", options: ["am", "is", "are"], a: "am" },
        { category: "Grammar", q: "She ___ a teacher.", options: ["is", "are", "am"], a: "is" },
        { category: "Vocabulary", q: "'nurse' so'zining ma'nosi:", options: ["hamshira", "sotuvchi", "aktyor"], a: "hamshira" },
        { category: "Grammar", q: "They ___ two dogs.", options: ["have", "has", "are"], a: "have" },
        { category: "Vocabulary", q: "'umbrella' so'zining ma'nosi:", options: ["soyabon", "kalit", "sumka"], a: "soyabon" },
      ];
    }
    return pool;
  }

  async function reportGame(game, tries) {
    try {
      if (!window.l1GetToken || !window.l1GetToken() || !tries.length) return null;
      const resp = await window.l1Fetch("/api/game/finish", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ game, tries }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && window.L1_Shell) window.L1_Shell.refresh();
      return resp.ok ? data : null;
    } catch (e) { return null; }
  }
  const rewardText = (r) => !r ? "" : r.awarded > 0
    ? `Reytingga +${r.awarded} ball qo'shildi.${r.remainingToday === 0 ? " Bugungi o'yin limiti (50) to'ldi." : ""}`
    : "Bugungi o'yin balli limiti (50) to'lgan — ertaga yana qo'shiladi. Mashq qilishda davom eting!";

  // Shows (or removes) the question's photo just above its text element.
  function setQuestionImage(textEl, src) {
    if (!textEl || !textEl.parentNode) return;
    let img = textEl.previousElementSibling;
    if (!img || !img.classList.contains("l1-qimg")) {
      if (!src) return;
      img = document.createElement("img");
      img.className = "l1-qimg";
      img.alt = "";
      img.style.cssText = "display:block;margin:0 auto 8px;max-width:100%;width:190px;height:112px;object-fit:cover;border-radius:14px;border:1px solid rgba(100,116,139,.25)";
      textEl.parentNode.insertBefore(img, textEl);
    }
    img.style.display = src ? "block" : "none";
    if (src) img.src = src;
  }

  function optionButton(opt, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "l1-opt w-full";
    btn.textContent = opt;
    btn.dataset.val = opt;
    btn.addEventListener("click", () => onClick(opt, btn));
    return btn;
  }

  // Games that keep state of their own register a pause() here; it runs when the app goes to the background.
  const Games = {
    pauseAll() { ["L1_Millionaire", "L1_Listen"].forEach((n) => { const g = window[n]; if (g && g.active && g.pause) g.pause(); }); },
    resumeVisible() {},
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden) Games.pauseAll(); });

  // Shared by the games (Millioner, Idris and the Dragon, ...).
  window.L1_GameKit = { POINTS, getGameQuestions, setQuestionImage, shuffle, correct, primary, reportGame, rewardText, say, mountIdris, idrisReact, line, haptic, focusGame };

  window.L1_Sound = Sound;
  window.L1_Games = Games;
})(window);
