/* Music and sound effects of "Millioner" (games_millionaire.js). Everything here is made on the spot with the browser's
 * Web Audio (oscillators and noise): our own little instrumental, no recording and no tune of any TV show is used.
 *
 *   L1_MillionaireMusic.start(level)  the waiting music while a question is open; level 1..3 gets busier and quicker
 *   .stop()                           fades it out (also what leaving the game does)
 *   .lock()  .right()  .wrong()  .win()  .applause(seconds)  .oh()  .help()  .select()
 */
(function () {
  "use strict";

  const L1 = () => window.L1 || null;
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  // four bars in A minor, one chord per bar (triads, then the roots for the bass)
  const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 56, 59]]; // Am  F  C  E
  const ROOTS = [45, 41, 36, 40];
  const BELLS = [81, 84, 88, 76, 79]; // A minor pentatonic, high
  const BPM = { 1: 92, 2: 104, 3: 118 };

  let ac = null, master = null, timer = 0, running = false, step = 0, nextT = 0, level = 1;

  const context = () => { const s = L1() && L1().Sound; return s && s.ctx ? s.ctx() : null; };

  // one note: oscillator -> optional low-pass -> gain envelope -> `out`
  function note(out, t, freq, dur, vol, type, opt) {
    opt = opt || {};
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "triangle";
    o.frequency.setValueAtTime(freq, t);
    if (opt.to) o.frequency.exponentialRampToValueAtTime(Math.max(20, opt.to), t + dur);
    if (opt.detune) o.detune.value = opt.detune;
    const attack = opt.attack || 0.006;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (opt.lp) { const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(opt.lp, t); if (opt.lpTo) f.frequency.exponentialRampToValueAtTime(opt.lpTo, t + dur); o.connect(f); node = f; }
    node.connect(g).connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noiseBurst(out, t, dur, vol, kind, f0, f1) {
    const len = Math.max(1, Math.floor(ac.sampleRate * dur));
    const buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = kind || "highpass"; f.frequency.setValueAtTime(f0 || 6000, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t); src.stop(t + dur + 0.02);
  }
  const boom = (out, t, vol) => { note(out, t, 110, 0.5, vol, "sine", { to: 48 }); noiseBurst(out, t, 0.12, vol * 0.35, "lowpass", 500, 120); };

  // ---------------------------------------------------------------- the waiting music
  function playStep(t, s) {
    const bar = Math.floor(s / 8) % 4, k = s % 8;
    const chord = CHORDS[bar];
    const eighth = 60 / BPM[level] / 2;
    if (k === 0) { // a soft pad under the whole bar
      chord.forEach((n, i) => note(master, t, midi(n), eighth * 8.2, 0.05, "sawtooth", { attack: 0.5, lp: 700, detune: (i - 1) * 7 }));
    }
    const bassHit = level === 3 ? true : level === 2 ? k % 2 === 0 || k === 7 : k % 2 === 0;
    if (bassHit) note(master, t, midi(ROOTS[bar]), eighth * 1.6, 0.17, "square", { lp: 260, attack: 0.012 });
    if (level >= 2 && k % 2 === 1) note(master, t, midi(chord[(k >> 1) % 3] + 12), eighth * 1.4, 0.07, "triangle");
    if (level >= 3) {
      if (k === 0 || k === 4) boom(master, t, 0.22);
      if (k % 2 === 1) noiseBurst(master, t, 0.04, 0.05, "highpass", 7000);
    }
    if (Math.random() < (level === 1 ? 0.16 : 0.24) && k % 2 === 0) { // a high bell now and then
      note(master, t, midi(BELLS[Math.floor(Math.random() * BELLS.length)]), 0.9, 0.05, "sine");
    }
  }
  function schedule() {
    if (!running || !ac) return;
    const eighth = 60 / BPM[level] / 2;
    while (nextT < ac.currentTime + 0.4) { playStep(nextT, step); nextT += eighth; step++; }
  }

  function start(lvl) {
    level = lvl >= 3 ? 3 : lvl === 2 ? 2 : 1;
    if (running) return;
    ac = context();
    if (!ac) return;
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(ac.destination);
    running = true; step = 0; nextT = ac.currentTime + 0.08;
    schedule();
    timer = setInterval(schedule, 120);
  }
  function stop() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    const m = master;
    master = null;
    try {
      m.gain.cancelScheduledValues(ac.currentTime);
      m.gain.setValueAtTime(m.gain.value, ac.currentTime);
      m.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.3);
      setTimeout(() => { try { m.disconnect(); } catch (e) {} }, 450);
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });

  // ---------------------------------------------------------------- effects
  // each effect makes its own little output so it does not depend on the music being on
  function fx(fn) {
    const c = context();
    if (!c) return;
    ac = c;
    const out = c.createGain();
    out.gain.value = 1;
    out.connect(c.destination);
    fn(out, c.currentTime + 0.02);
    setTimeout(() => { try { out.disconnect(); } catch (e) {} }, 9000);
  }

  const api = {
    start, stop,
    isOn: () => running,
    select() { fx((o, t) => { note(o, t, 660, 0.12, 0.1, "triangle"); note(o, t + 0.07, 880, 0.14, 0.09, "triangle"); }); },
    help() { fx((o, t) => { [880, 1175, 1568].forEach((f, i) => note(o, t + i * 0.08, f, 0.22, 0.09, "sine")); }); },
    // "final answer": a drum roll that speeds up for 1.8 s and ends on a low hit
    lock() {
      fx((o, t) => {
        note(o, t, 55, 2.1, 0.2, "sine", { attack: 0.3 });
        let at = 0, gap = 0.2;
        while (at < 1.75) { boom(o, t + at, 0.12 + at * 0.06); at += gap; gap = Math.max(0.055, gap * 0.9); }
        note(o, t + 1.75, 880, 0.5, 0.05, "sine");
      });
    },
    right() {
      fx((o, t) => {
        // two bright chords: F then C, with a little cymbal
        [[53, 57, 60], [60, 64, 67, 72]].forEach((ch, j) => ch.forEach((n) => note(o, t + j * 0.28, midi(n), j ? 1.1 : 0.3, 0.09, "sawtooth", { lp: 2400, attack: 0.012 })));
        noiseBurst(o, t + 0.28, 0.9, 0.07, "highpass", 6500);
        [72, 76, 79, 84].forEach((n, i) => note(o, t + 0.56 + i * 0.09, midi(n), 0.5, 0.06, "sine"));
      });
    },
    wrong() {
      fx((o, t) => {
        [[196, 0], [185, 0.3], [175, 0.6], [147, 0.95]].forEach(([f, d]) => note(o, t + d, f, d === 0.95 ? 1.1 : 0.32, 0.12, "sawtooth", { lp: 520, to: f * 0.93 }));
        boom(o, t + 0.95, 0.22);
      });
    },
    win() {
      fx((o, t) => {
        const seq = [[60, 0], [64, 0.16], [67, 0.32], [72, 0.48], [67, 0.72], [72, 0.88], [76, 1.04], [79, 1.3]];
        seq.forEach(([n, d]) => note(o, t + d, midi(n), 0.5, 0.1, "sawtooth", { lp: 2600, attack: 0.012 }));
        [[48, 52, 55, 60], [53, 57, 60, 65], [55, 59, 62, 67], [60, 64, 67, 72, 76]].forEach((ch, j) =>
          ch.forEach((n) => note(o, t + j * 0.45 + 1.7, midi(n), j === 3 ? 2.2 : 0.5, 0.075, "sawtooth", { lp: 2200, attack: 0.02 })));
        noiseBurst(o, t + 3.1, 1.6, 0.07, "highpass", 6000);
        for (let i = 0; i < 12; i++) note(o, t + 3.2 + i * 0.07, midi(84 + (i % 5) * 2), 0.4, 0.04, "sine");
      });
    },
    // clapping: many short noise claps that thicken and fade
    applause(seconds) {
      fx((o, t) => {
        const n = Math.floor((seconds || 2) * 38);
        for (let i = 0; i < n; i++) {
          const at = Math.random() * (seconds || 2);
          const fade = 1 - at / ((seconds || 2) * 1.15);
          noiseBurst(o, t + at, 0.05 + Math.random() * 0.04, 0.05 * fade + 0.01, "bandpass", 1400 + Math.random() * 2600);
        }
      });
    },
    // the "oooh" of a disappointed hall
    oh() { fx((o, t) => { note(o, t, 300, 0.9, 0.08, "sawtooth", { to: 150, lp: 700 }); note(o, t, 227, 0.9, 0.06, "sawtooth", { to: 112, lp: 700 }); }); },
    start_sting() { fx((o, t) => { [57, 60, 64, 69].forEach((n, i) => note(o, t + i * 0.12, midi(n), 0.4, 0.08, "triangle")); }); },
  };
  window.L1_MillionaireMusic = api;
})();
