/* Question makers shared by the games (window.L1_Questions).
 *
 * Every vocabulary question is built from one flashcard: { q, o (4 options, or null when the answer is typed), a, img?, k, w }.
 *   k  kind: pic | en2uz | uz2en | num | def | cloze | recall
 *   w  id of the flashcard word, so the answer feeds the shared vocabulary memory (words.js)
 * The server's Word Race checks questions by the same kinds (race_engine.verify_question), so keep them in step.
 */
(function () {
  "use strict";

  const shuffle = (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // The course words, plus the words from the Listen and Survive missions the student has already met (a handful of
  // those are needed before they can be used for wrong options; see words.js and listen_data.js).
  const cards = () => {
    const base = typeof FLASHCARDS_DATA !== "undefined" && Array.isArray(FLASHCARDS_DATA) ? FLASHCARDS_DATA : [];
    const W = window.L1_Words;
    if (!W || !W.loaded || typeof LISTEN_GLOSSARY === "undefined") return base;
    const met = LISTEN_GLOSSARY.filter((g) => W.statusOf(g.id) !== "new");
    return met.length >= 4 ? base.concat(met) : base;
  };
  const baseMeaning = (c) => String(c.meaning_uz || "").replace(/\s*\(.*?\)/g, "").trim().toLowerCase();
  const stop = (s) => (/[.!?]$/.test(s) ? s : s + ".");
  const nice = (c) => stop(`${c.word} = ${c.meaning_uz}`) + (c.example_en ? ` Misol: ${c.example_en}` : "");
  const multiWord = (c) => /[—/]/.test(c.word);

  // three wrong options from the same unit (or the same week), never a word that means the same
  function distractors(card, field, all) {
    const same = all.filter((c) => c.id !== card.id && c.unit === card.unit);
    const wide = all.filter((c) => c.id !== card.id && c.week === card.week && c.unit !== card.unit);
    const out = [], seen = new Set([String(card[field]).toLowerCase()]);
    for (const c of shuffle(same).concat(shuffle(wide))) {
      const v = String(c[field]).toLowerCase();
      if (seen.has(v) || baseMeaning(c) === baseMeaning(card)) continue;
      seen.add(v); out.push(c[field]);
      if (out.length === 3) break;
    }
    return out.length === 3 ? out : null;
  }

  const MAKERS = {
    pic(c, all) {
      if (!c.image || multiWord(c)) return null;
      const d = distractors(c, "word", all); if (!d) return null;
      return { q: "What is this?", img: c.image, o: shuffle([c.word, ...d]), a: c.word };
    },
    en2uz(c, all) {
      const d = distractors(c, "meaning_uz", all); if (!d) return null;
      return { q: `“${c.word}” — o'zbekcha qanday?`, o: shuffle([c.meaning_uz, ...d]), a: c.meaning_uz };
    },
    uz2en(c, all) {
      if (all.filter((x) => baseMeaning(x) === baseMeaning(c)).length > 1) return null; // hi / hello / hey all mean "salom"
      const d = distractors(c, "word", all); if (!d) return null;
      return { q: `“${c.meaning_uz}” — inglizcha qanday?`, o: shuffle([c.word, ...d]), a: c.word };
    },
    num(c, all) {
      if (!c.bigText) return null;
      const d = distractors(c, "word", all); if (!d) return null;
      return { q: `${c.bigText} — inglizcha qanday yoziladi?`, o: shuffle([c.word, ...d]), a: c.word };
    },
    def(c, all) {
      if (!c.definition || c.unit === "2g") return null;
      const d = distractors(c, "word", all); if (!d) return null;
      return { q: `Which word means: “${c.definition}”`, o: shuffle([c.word, ...d]), a: c.word };
    },
    cloze(c, all) {
      if (!c.example_en || !c.word || multiWord(c) || /\?/.test(c.word)) return null;
      const re = new RegExp("\\b" + c.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (!re.test(c.example_en)) return null;
      const d = distractors(c, "word", all); if (!d) return null;
      return { q: c.example_en.replace(re, "_____"), o: shuffle([c.word, ...d]), a: c.word };
    },
    // typed answer: no options. Single words only, so "how do I write it" has one clear answer.
    recall(c, all) {
      if (multiWord(c) || /[?.']/.test(c.word) || c.word.length > 18) return null;
      if (c.image) return { q: "Write the word for this picture.", img: c.image, o: null, a: c.word };
      if (all.filter((x) => baseMeaning(x) === baseMeaning(c)).length > 1) return null;
      return { q: `“${c.meaning_uz}” — inglizcha yozing`, o: null, a: c.word };
    },
  };

  // Millioner: the harder kinds of question come first (a list inside a list is tried in random order before the next one)
  const TYPES_BY_TIER = { 1: [["pic", "en2uz"]], 2: [["uz2en", "num", "pic"], ["en2uz"]], 3: [["cloze", "def"], ["uz2en"]] };

  function make(card, kind, all) {
    const m = MAKERS[kind] && MAKERS[kind](card, all || cards());
    return m ? Object.assign(m, { k: kind, w: card.id, cat: "Lug'at", why: nice(card) }) : null;
  }

  // First kind from `groups` ([[kind, kind], [kind]]) that works for this card; each group is tried in random order.
  function vocabQuestion(card, tier, all) {
    for (const group of TYPES_BY_TIER[tier]) {
      for (const kind of shuffle(group)) {
        const q = make(card, kind, all);
        if (q) return Object.assign(q, { tier, kind: "vocab", wordId: card.id });
      }
    }
    return null;
  }

  const grammarBank = () => (typeof MILLIONAIRE_GRAMMAR !== "undefined" ? MILLIONAIRE_GRAMMAR : []);

  window.L1_Questions = { shuffle, cards, baseMeaning, distractors, nice, make, vocabQuestion, grammarBank, MAKERS, TYPES_BY_TIER };
})();
