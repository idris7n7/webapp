/* The shared vocabulary memory (window.L1_Words).
 *
 * Every word has a status per student, kept on the server: new → learning → review (missed, or due again) → mastered.
 * The flashcards and every game report which words were right or wrong, and ask which words to practise next:
 * missed and due words come first, learned ones only now and then (spaced repetition).
 */
(function () {
  "use strict";

  const mem = { words: {}, counts: null, glossary: null, loaded: false, offset: 0, promise: null };
  const nowSec = () => (Date.now() + mem.offset) / 1000;

  const api = async (path, body) => {
    const opts = body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {};
    const resp = await window.l1Fetch(path, opts);
    if (!resp.ok) throw new Error(String(resp.status));
    return resp.json();
  };
  const absorb = (d) => {
    mem.words = d.words || {};
    mem.counts = d.counts || mem.counts;
    mem.glossary = d.glossary || mem.glossary;
    if (d.now) mem.offset = d.now * 1000 - Date.now();
    mem.loaded = true;
    window.dispatchEvent(new CustomEvent("l1:words-changed"));
  };

  function load(force) {
    if (!force && mem.promise) return mem.promise;
    mem.promise = api("/api/words").then((d) => { absorb(d); return mem; }).catch(() => { mem.promise = null; return mem; });
    return mem.promise;
  }

  // Tells the server how the student did on some words: [{ id, ok }].
  async function report(results, source) {
    const list = (results || []).filter((r) => r && r.id && typeof r.ok === "boolean");
    if (!list.length) return null;
    try {
      const d = await api("/api/words/report", { source: source || "game", results: list.slice(0, 80) });
      absorb(d);
      return d;
    } catch (e) { return null; }
  }

  // "new" | "learning" | "review" | "mastered" — a word that is due again counts as review.
  function statusOf(id) {
    const w = mem.words[id];
    if (!w) return "new";
    if (w.s === "mastered" && nowSec() >= w.n) return "review";
    return w.s;
  }

  // How likely a word is to be asked: missed or due words first, new ones next, learned ones rarely.
  function weight(id) {
    const st = statusOf(id), w = mem.words[id];
    if (st === "review") return w && w.w > w.c ? 8 : 6;
    if (st === "learning") return w ? Math.max(1.5, 3.2 - 0.5 * w.b) : 3;
    if (st === "new") return 2.2;
    return 0.5; // mastered
  }

  // Picks `n` different cards from `cards`, favouring the words the student needs most.
  function pick(cards, n) {
    const pool = cards.map((c) => ({ c, w: weight(c.id) * (0.6 + Math.random() * 0.8) }));
    const out = [];
    while (out.length < n && pool.length) {
      const total = pool.reduce((s, p) => s + p.w, 0);
      let r = Math.random() * total, i = 0;
      for (; i < pool.length - 1; i++) { r -= pool[i].w; if (r <= 0) break; }
      out.push(pool.splice(i, 1)[0].c);
    }
    return out;
  }

  const counts = () => mem.counts || { mastered: 0, review: 0, learning: 0, new: 0, total: 0 };
  const glossary = () => mem.glossary || { mastered: 0, review: 0, learning: 0, seen: 0, total: 0 };
  const LABEL = { new: "Yangi", learning: "O'rganilmoqda", review: "Takrorlash kerak", mastered: "O'zlashtirilgan" };

  window.L1_Words = { load, report, statusOf, weight, pick, counts, glossary, LABEL, get loaded() { return mem.loaded; } };

  // Once signed in, fetch the student's memory so games can use it right away.
  let tries = 0;
  const timer = setInterval(() => {
    if (++tries > 60) return clearInterval(timer);
    if (window.l1GetToken && window.l1GetToken()) { clearInterval(timer); load(); }
  }, 1500);
})();
