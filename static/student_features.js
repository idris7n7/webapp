// student_features.js
// Handles:
// 1. Vocabulary Flashcards ("I know it", "Mastered it", "I don't know")
// 2. Practicing Mode Suite:
//    - Grammar: Multiple Choice, Fill in Blanks, Correct the Mistake
//    - Vocabulary: Match Meaning (Uzbek), Type the Word, Complete the Sentence
// 3. Tab Navigation for O'rganish, Mashq qilish, and O'yinlar

(function(window) {
  // =========================================================================
  // 1. SPEECH SYNTHESIS HELPER
  // =========================================================================
  function speakEnglish(text) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  // =========================================================================
  // 2. VOCABULARY FLASHCARDS MODULE
  // =========================================================================
  const Flashcards = {
    allCards: [],
    filteredCards: [],
    currentIndex: 0,
    isFlipped: false,
    ratings: {}, // { [wordId]: 'dont_know' | 'know' | 'mastered' }
    activeCategory: 'all',
    activeWeek: 'all',

    init: function() {
      if (typeof FLASHCARDS_DATA !== "undefined" && Array.isArray(FLASHCARDS_DATA)) {
        this.allCards = FLASHCARDS_DATA;
      } else {
        this.allCards = [];
      }

      // Load saved ratings from localStorage
      try {
        const saved = localStorage.getItem("l1_vocab_flashcard_ratings_v1");
        if (saved) this.ratings = JSON.parse(saved);
      } catch (e) {
        this.ratings = {};
      }

      this.renderUnitChips();
      this.renderCategoryChips();
      this.filterCategory('all');

      // The server remembers every word across the flashcards and all the games; show that, not just this device.
      if (window.L1_Words) {
        window.L1_Words.load();
        if (!this.wiredWords) {
          this.wiredWords = true;
          window.addEventListener("l1:words-changed", () => {
            if (document.getElementById("flashcardInner")) { this.updateStats(); this.renderBadge(); }
          });
        }
      }
    },

    // flashcard rating for a word: what the shared memory says if it knows the word, else this device's own rating
    ratingOf: function(id) {
      const s = window.L1_Words && window.L1_Words.loaded ? window.L1_Words.statusOf(id) : 'new';
      if (s !== 'new') return { mastered: 'mastered', learning: 'know', review: 'dont_know' }[s];
      return this.ratings[id];
    },

    renderBadge: function() {
      const card = this.filteredCards && this.filteredCards[this.currentIndex];
      const el = document.getElementById("flashcardCurrentStatusBadge");
      if (!card || !el) return;
      const status = this.ratingOf(card.id);
      if (status === 'mastered') {
        el.innerHTML = `<span class="bg-emerald-100 text-emerald-800 text-[12px] font-black px-2.5 py-1 rounded-full border border-emerald-300">⭐ Mastered it (O'zlashtirildi)</span>`;
      } else if (status === 'know') {
        el.innerHTML = `<span class="bg-amber-100 text-amber-800 text-[12px] font-black px-2.5 py-1 rounded-full border border-amber-300">🟡 I know it (Bilaman)</span>`;
      } else if (status === 'dont_know') {
        el.innerHTML = `<span class="bg-rose-100 text-rose-800 text-[12px] font-black px-2.5 py-1 rounded-full border border-rose-300">🔴 I don't know (Bilmayman)</span>`;
      } else {
        el.innerHTML = `<span class="bg-slate-100 text-slate-600 text-[12px] font-bold px-2.5 py-1 rounded-full border border-slate-200">⚪ Yangi so'z</span>`;
      }
    },

    renderUnitChips: function() {
      const container = document.getElementById("flashcardUnitChips");
      if (!container) return;

      const titles = {};
      this.allCards.forEach(c => { if (c.unit && !titles[c.unit]) titles[c.unit] = c.category; });
      const units = Object.keys(titles);
      container.innerHTML = "";
      ['all', ...units].forEach(w => {
        const btn = document.createElement("button");
        btn.type = "button";
        const isCurrent = this.activeWeek === w;
        btn.className = `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
          isCurrent
            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
        }`;
        btn.textContent = w === 'all' ? "Barcha unitlar" : `Unit ${w} · ${titles[w]}`;
        btn.onclick = () => this.filterWeek(w);
        container.appendChild(btn);
      });
    },

    filterWeek: function(week) {
      this.activeWeek = week;
      this.renderUnitChips();
      this.filterCategory('all');
    },

    cardsInWeek: function() {
      return this.activeWeek === 'all'
        ? this.allCards
        : this.allCards.filter(c => c.unit === this.activeWeek);
    },

    saveRatings: function() {
      try {
        localStorage.setItem("l1_vocab_flashcard_ratings_v1", JSON.stringify(this.ratings));
      } catch (e) {}
    },

    renderCategoryChips: function() {
      const container = document.getElementById("flashcardCategoryChips");
      if (!container) return;

      const categories = ['all'];
      const seen = new Set();
      this.cardsInWeek().forEach(c => {
        if (c.category && !seen.has(c.category)) {
          seen.add(c.category);
          categories.push(c.category);
        }
      });

      container.innerHTML = "";
      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button";
        const isCurrent = this.activeCategory === cat;
        btn.className = `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
          isCurrent
            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
        }`;
        btn.textContent = cat === 'all' ? "🌟 Barchasi (All)" : cat;
        btn.onclick = () => {
          this.filterCategory(cat);
        };
        container.appendChild(btn);
      });
    },

    filterCategory: function(cat) {
      this.activeCategory = cat;
      const pool = this.cardsInWeek();
      this.filteredCards = cat === 'all' ? [...pool] : pool.filter(c => c.category === cat);
      this.currentIndex = 0;
      this.isFlipped = false;
      this.renderCategoryChips();
      this.renderCard();
      this.updateStats();
    },

    updateStats: function() {
      let masteredCount = 0;
      let knowCount = 0;
      let dontKnowCount = 0;

      this.allCards.forEach(c => {
        const status = this.ratingOf(c.id);
        if (status === 'mastered') masteredCount++;
        else if (status === 'know') knowCount++;
        else if (status === 'dont_know') dontKnowCount++;
      });

      const total = this.allCards.length;
      const studied = masteredCount + knowCount + dontKnowCount;
      const progressPct = total > 0 ? Math.round((studied / total) * 100) : 0;

      const elTotal = document.getElementById("fcStatTotal");
      const elMastered = document.getElementById("fcStatMastered");
      const elKnow = document.getElementById("fcStatKnow");
      const elDontKnow = document.getElementById("fcStatDontKnow");
      const elProgress = document.getElementById("fcStatProgressBar");
      const elPercent = document.getElementById("fcStatProgressPercent");

      if (elTotal) elTotal.textContent = total;
      if (elMastered) elMastered.textContent = masteredCount;
      if (elKnow) elKnow.textContent = knowCount;
      if (elDontKnow) elDontKnow.textContent = dontKnowCount;
      if (elProgress) elProgress.style.width = progressPct + "%";
      if (elPercent) elPercent.textContent = progressPct + "%";
    },

    renderCard: function() {
      const cardInner = document.getElementById("flashcardInner");
      const cardFront = document.getElementById("flashcardFrontContent");
      const cardBack = document.getElementById("flashcardBackContent");
      const counterEl = document.getElementById("flashcardCurrentCounter");
      const statusBadge = document.getElementById("flashcardCurrentStatusBadge");

      if (!this.filteredCards || this.filteredCards.length === 0) {
        if (cardFront) {
          cardFront.innerHTML = `
            <div class="text-center py-12 text-slate-400">
              <span class="text-4xl">📭</span>
              <p class="mt-2 text-sm font-semibold">Bu toifada so'zlar topilmadi.</p>
            </div>
          `;
        }
        return;
      }

      // Bound check
      if (this.currentIndex >= this.filteredCards.length) this.currentIndex = 0;
      if (this.currentIndex < 0) this.currentIndex = this.filteredCards.length - 1;

      const card = this.filteredCards[this.currentIndex];

      // Counter
      if (counterEl) {
        counterEl.textContent = `${this.currentIndex + 1} / ${this.filteredCards.length}`;
      }

      // Status Badge
      if (statusBadge) this.renderBadge();

      // Front side
      if (cardFront) {
        cardFront.innerHTML = `
          <div class="flex flex-col items-center justify-between h-full p-6 text-center space-y-4">
            <div class="flex items-center justify-between w-full">
              <span class="text-[12px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                ${card.category || "Vocabulary"}
              </span>
              <span class="text-xs font-semibold text-slate-400 italic">
                ${card.partOfSpeech || "so'z"}
              </span>
            </div>

            <div class="my-auto space-y-3">
              ${card.image ? `<img src="${card.image}" alt="${card.word}" loading="lazy" decoding="async" class="mx-auto block w-full max-w-[260px] h-36 sm:h-44 object-cover rounded-2xl border border-slate-200 shadow-sm" />` : ''}
              ${card.bigText ? `<div class="mx-auto flex items-center justify-center w-full max-w-[260px] h-28 rounded-2xl bg-indigo-50 border border-indigo-200 text-6xl font-black text-indigo-700">${card.bigText}</div>` : ''}
              <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                ${card.word}
              </h3>
              ${card.phonetic ? `<p class="text-sm font-mono text-indigo-600 font-bold bg-indigo-50/70 inline-block px-3 py-1 rounded-lg">${card.phonetic}</p>` : ''}
              
              <div>
                <button type="button" onclick="event.stopPropagation(); window.L1_Flashcards.speakCurrent();" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs shadow-md transition transform hover:scale-105 active:scale-95">
                  <span>🔊 Talaffuzni tinglash</span>
                </button>
              </div>
            </div>

            <div class="text-[12px] font-bold text-slate-400 flex items-center gap-1.5 animate-pulse">
              <span>↻ Kartani ag'darish uchun bosing</span>
            </div>
          </div>
        `;
      }

      // Back side
      if (cardBack) {
        cardBack.innerHTML = `
          <div class="flex flex-col items-center justify-between h-full p-6 text-center space-y-4">
            <div class="flex items-center justify-between w-full">
              <span class="text-[12px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                O'zbekcha Ma'nosi
              </span>
              <span class="text-xs font-black text-indigo-600">
                ${card.word}
              </span>
            </div>

            <div class="my-auto space-y-3 w-full max-w-sm">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
                ${card.meaning_uz}
              </h3>

              ${card.definition ? `<p class="text-xs sm:text-sm text-slate-600 font-medium leading-snug">${card.definition}${card.plural ? ` <span class="font-bold text-slate-500">· pl. ${card.plural}</span>` : ''}</p>` : ''}

              ${card.example_en ? `
                <div class="bg-indigo-50/90 rounded-2xl p-3 border border-indigo-200 text-left space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[12px] font-black uppercase tracking-wider text-indigo-600">Misol:</span>
                    <button type="button" aria-label="Misolni eshitish" onclick="event.stopPropagation(); window.L1_Flashcards.speakExample();" class="text-xs text-indigo-700 hover:text-indigo-900 font-bold">
                      🔊
                    </button>
                  </div>
                  <p class="text-xs sm:text-sm font-bold text-indigo-950 leading-snug">${card.example_en}</p>
                  <p class="text-[12px] text-indigo-700/80 font-medium italic">${card.example_uz || ''}</p>
                </div>
              ` : ''}

              ${card.note ? `<p class="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-left leading-snug">💡 ${card.note}</p>` : ''}
            </div>

            <div class="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
              <span>↻ Old tomoniga qaytish uchun bosing</span>
            </div>
          </div>
        `;
      }

      // Flip state
      if (cardInner) {
        if (this.isFlipped) {
          cardInner.style.transform = "rotateY(180deg)";
        } else {
          cardInner.style.transform = "rotateY(0deg)";
        }
      }
    },

    flip: function() {
      this.isFlipped = !this.isFlipped;
      const cardInner = document.getElementById("flashcardInner");
      if (cardInner) {
        cardInner.style.transform = this.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
      }
    },

    speakCurrent: function() {
      const card = this.filteredCards[this.currentIndex];
      if (card && card.word) {
        speakEnglish(card.word);
      }
    },

    speakExample: function() {
      const card = this.filteredCards[this.currentIndex];
      if (card && card.example_en) {
        speakEnglish(card.example_en);
      }
    },

    rateCard: function(status) {
      if (!this.filteredCards || this.filteredCards.length === 0) return;
      const card = this.filteredCards[this.currentIndex];
      if (!card) return;

      this.ratings[card.id] = status;
      this.saveRatings();
      this.updateStats();
      // tell the shared memory (it also feeds the games): "I don't know" is a miss, the other two a hit
      if (window.L1_Words) {
        const hit = { id: card.id, ok: true };
        window.L1_Words.report(status === 'mastered' ? [hit, hit] : status === 'know' ? [hit] : [{ id: card.id, ok: false }], 'flashcards');
      }

      // Sound & visual feedback
      if (status === 'mastered') {
        if (window.L1_Sound) window.L1_Sound.correct();
        if (typeof showToast === "function") showToast(`⭐ "${card.word}" — To'liq yodlandi! Barakalla!`);
      } else if (status === 'know') {
        if (window.L1_Sound) window.L1_Sound.tick();
        if (typeof showToast === "function") showToast(`🟡 "${card.word}" — Bilaman deb belgilandi.`);
      } else {
        if (window.L1_Sound) window.L1_Sound.wrong();
        if (typeof showToast === "function") showToast(`🔴 "${card.word}" — Yana takrorlash kerak.`);
      }

      // Next card
      setTimeout(() => {
        this.nextCard();
      }, 350);
    },

    nextCard: function() {
      if (this.filteredCards.length === 0) return;
      this.currentIndex = (this.currentIndex + 1) % this.filteredCards.length;
      this.isFlipped = false;
      this.renderCard();
    },

    prevCard: function() {
      if (this.filteredCards.length === 0) return;
      this.currentIndex = (this.currentIndex - 1 + this.filteredCards.length) % this.filteredCards.length;
      this.isFlipped = false;
      this.renderCard();
    },

    shuffle: function() {
      if (this.filteredCards.length <= 1) return;
      this.filteredCards.sort(() => Math.random() - 0.5);
      this.currentIndex = 0;
      this.isFlipped = false;
      this.renderCard();
      if (typeof showToast === "function") showToast("🔀 Lug'at kartochkalari aralashtirildi!");
    }
  };

  // =========================================================================
  // 3. PRACTICING SUITE RUNNER MODULE
  // =========================================================================
  const PracticeSuite = {
    activeExerciseId: null,
    exerciseData: null,
    userAnswers: {},

    // 6 exercises strictly per user request:
    // Grammar:
    // 1. Multiple choice questions
    // 2. Fill in the blanks
    // 3. Correct the mistake
    // Vocabulary:
    // 1. Match the meaning (Uzbek)
    // 2. Type the word
    // 3. Complete the sentence

    start: function(exId) {
      if (typeof PRACTICING_SUITE_DATA === "undefined") {
        console.error("PRACTICING_SUITE_DATA is not defined!");
        return;
      }

      const ex = PRACTICING_SUITE_DATA[exId];
      if (!ex) {
        console.error("Exercise not found:", exId);
        return;
      }
      this.startData(ex);
    },

    // Runs any exercise object { id, category, type, title, questions: [{ q, options?, a, hint? }], meta? } (the learning hub builds its own).
    startData: function(ex) {
      this.activeExerciseId = ex.id;
      this.exerciseData = ex;
      this.userAnswers = {};

      const listContainer = document.getElementById("practiceMenuArea");
      const runnerContainer = document.getElementById("practiceSuiteRunnerArea");

      if (listContainer) listContainer.classList.add("hidden");
      if (runnerContainer) runnerContainer.classList.remove("hidden");

      this.renderRunner();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    backToMenu: function() {
      const wasRunning = !!this.activeExerciseId;
      this.activeExerciseId = null;
      this.exerciseData = null;
      this.userAnswers = {};

      const listContainer = document.getElementById("practiceMenuArea");
      const runnerContainer = document.getElementById("practiceSuiteRunnerArea");

      if (listContainer) listContainer.classList.remove("hidden");
      if (runnerContainer) runnerContainer.classList.add("hidden");
      if (wasRunning && typeof this.onBack === "function") this.onBack();
    },

    renderRunner: function() {
      const ex = this.exerciseData;
      if (!ex) return;

      const titleEl = document.getElementById("suiteRunnerTitle");
      const badgeEl = document.getElementById("suiteRunnerBadge");
      const descEl = document.getElementById("suiteRunnerDesc");
      const instEnEl = document.getElementById("suiteRunnerInstEn");
      const instUzEl = document.getElementById("suiteRunnerInstUz");
      const qListEl = document.getElementById("suiteRunnerQuestionsList");
      const resultBox = document.getElementById("suiteRunnerResultBox");

      if (resultBox) resultBox.classList.add("hidden");
      if (titleEl) titleEl.textContent = ex.title;
      if (badgeEl) badgeEl.textContent = ex.category === "grammar" ? "📘 GRAMMAR" : "📗 VOCABULARY";
      if (descEl) descEl.textContent = ex.desc || "";
      if (instEnEl) instEnEl.textContent = ex.instruction_en || "";
      if (instUzEl) instUzEl.textContent = ex.instruction_uz || "";

      if (!qListEl) return;
      qListEl.innerHTML = "";

      ex.questions.forEach((qObj, idx) => {
        const itemCard = document.createElement("div");
        itemCard.id = `suite_qcard_${idx}`;
        itemCard.className = "bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3";

        // Dispatch based on question type
        if (ex.type !== "correct_mistake" && qObj.options && qObj.options.length) {
          // Multiple Choice / Options
          const opts = qObj.options || ["A", "B", "C"];
          itemCard.innerHTML = `
            <div class="flex items-start justify-between gap-3">
              <div class="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                ${qObj.q}
              </div>
              <span id="suite_icon_${idx}" class="text-base shrink-0">⚪</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              ${opts.map((opt, oi) => `
                <button type="button" onclick="window.L1_PracticeSuite.selectOption(${idx}, ${oi}, this)" class="suite-opt-btn-${idx} p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 text-xs sm:text-sm font-bold text-slate-800 transition text-left flex items-center justify-between">
                  <span>${opt}</span>
                  <span class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[12px] radio-indicator"></span>
                </button>
              `).join("")}
            </div>
            <div id="suite_exp_${idx}" class="hidden text-xs p-2.5 rounded-xl"></div>
          `;
        } else if (ex.type !== "correct_mistake") {
          // Input Blank / Typing
          const placeholder = ex.type === "type_word" ? "Inglizcha so'zni yozing..." : "Javobingizni yozing...";
          itemCard.innerHTML = `
            <div class="flex items-start justify-between gap-3">
              <div class="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                ${qObj.q}
              </div>
              <span id="suite_icon_${idx}" class="text-base shrink-0">⚪</span>
            </div>
            <div class="flex items-center gap-2 pt-1">
              <input type="text" id="suite_input_${idx}" oninput="window.L1_PracticeSuite.handleTextInput(${idx}, this.value)" placeholder="${placeholder}" class="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" />
              ${qObj.hint ? `<span class="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 whitespace-nowrap">Maslahat: ${qObj.hint}</span>` : ''}
            </div>
            <div id="suite_exp_${idx}" class="hidden text-xs p-2.5 rounded-xl"></div>
          `;
        } else {
          // Error Correction
          itemCard.innerHTML = `
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block">Xato gap:</div>
                <div class="text-sm sm:text-base font-extrabold text-slate-900 leading-snug line-through decoration-rose-500 decoration-2">
                  ${qObj.q}
                </div>
              </div>
              <span id="suite_icon_${idx}" class="text-base shrink-0">⚪</span>
            </div>
            <div class="space-y-1 pt-1">
              <label class="text-xs font-bold text-slate-600">To'g'rilangan to'liq gapni yozing:</label>
              <input type="text" id="suite_input_${idx}" oninput="window.L1_PracticeSuite.handleTextInput(${idx}, this.value)" placeholder="To'g'ri gapni yozing..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" />
            </div>
            <div id="suite_exp_${idx}" class="hidden text-xs p-2.5 rounded-xl"></div>
          `;
        }

        qListEl.appendChild(itemCard);
      });
    },

    selectOption: function(idx, optIndex, btnEl) {
      const q = this.exerciseData && this.exerciseData.questions[idx];
      this.userAnswers[idx] = q && q.options ? q.options[optIndex] : optIndex;

      // Styling active button
      const allBtns = document.querySelectorAll(`.suite-opt-btn-${idx}`);
      allBtns.forEach(b => {
        b.className = `suite-opt-btn-${idx} p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 text-xs sm:text-sm font-bold text-slate-800 transition text-left flex items-center justify-between`;
        const ind = b.querySelector(".radio-indicator");
        if (ind) ind.innerHTML = "";
      });

      btnEl.className = `suite-opt-btn-${idx} p-3 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-xs sm:text-sm font-black text-indigo-950 shadow-xs transition text-left flex items-center justify-between`;
      const curInd = btnEl.querySelector(".radio-indicator");
      if (curInd) curInd.innerHTML = "●";

      const icon = document.getElementById(`suite_icon_${idx}`);
      if (icon) icon.textContent = "🟡";
    },

    handleTextInput: function(idx, val) {
      this.userAnswers[idx] = val;
      const icon = document.getElementById(`suite_icon_${idx}`);
      if (icon) icon.textContent = val.trim() ? "🟡" : "⚪";
    },

    submit: function() {
      const ex = this.exerciseData;
      if (!ex) return;

      let score = 0;
      let total = ex.questions.length;
      let mistakes = [];

      ex.questions.forEach((qObj, idx) => {
        const userVal = String(this.userAnswers[idx] || "").trim().toLowerCase();
        const validAnswers = String(qObj.a).split("|").map(x => x.trim().toLowerCase());

        // Check matching
        const isCorrect = validAnswers.some(ans => {
          // Normalized clean matching
          const cleanUser = userVal.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
          const cleanAns = ans.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
          return cleanUser === cleanAns;
        });

        const icon = document.getElementById(`suite_icon_${idx}`);
        const card = document.getElementById(`suite_qcard_${idx}`);
        const exp = document.getElementById(`suite_exp_${idx}`);

        if (isCorrect) {
          score++;
          if (icon) icon.textContent = "✅";
          if (card) {
            card.classList.remove("border-slate-200/90", "border-rose-300");
            card.classList.add("border-emerald-400", "bg-emerald-50/20");
          }
          if (exp) {
            exp.classList.remove("hidden", "bg-rose-50", "text-rose-900", "border-rose-200");
            exp.classList.add("bg-emerald-50", "text-emerald-950", "border", "border-emerald-200");
            exp.innerHTML = `<strong>To'g'ri!</strong> Javob: <em>"${esc(validAnswers[0])}"</em>`;
          }
        } else {
          mistakes.push({ q: qObj.q, studentAnswer: this.userAnswers[idx] || "(bo'sh)", correctAnswer: validAnswers[0] });
          if (icon) icon.textContent = "❌";
          if (card) {
            card.classList.remove("border-slate-200/90", "border-emerald-400");
            card.classList.add("border-rose-300", "bg-rose-50/20");
            if (window.L1) setTimeout(() => window.L1.Fx.shake(card), mistakes.length * 70);
          }
          if (exp) {
            exp.classList.remove("hidden", "bg-emerald-50", "text-emerald-950", "border-emerald-200");
            exp.classList.add("bg-rose-50", "text-rose-950", "border", "border-rose-200");
            exp.innerHTML = `<strong>Xato!</strong> To'g'ri javob: <span class="font-extrabold text-indigo-700">"${esc(validAnswers[0])}"</span>`;
          }
        }
      });

      // Sound feedback
      const pct = Math.round((score / total) * 100);
      if (window.L1) mistakes.length ? window.L1.Haptic.err() : window.L1.Haptic.ok();
      if (pct >= 80) {
        if (window.L1_Sound) window.L1_Sound.victory();
        if (typeof triggerTeacherIdrisConfetti === "function") triggerTeacherIdrisConfetti();
      } else if (pct >= 50) {
        if (window.L1_Sound) window.L1_Sound.correct();
      } else {
        if (window.L1_Sound) window.L1_Sound.wrong();
      }

      // Display summary result box
      const resultBox = document.getElementById("suiteRunnerResultBox");
      const scoreEl = document.getElementById("suiteRunnerScoreBadge");
      const praiseEl = document.getElementById("suiteRunnerPraiseText");

      if (scoreEl) scoreEl.textContent = `${score} / ${total} (${pct}%)`;
      if (praiseEl) {
        if (pct === 100) {
          praiseEl.textContent = "🌟 Fantastik natija! Barcha savollarga 100% to'g'ri javob berdingiz!";
        } else if (pct >= 80) {
          praiseEl.textContent = "🎉 Barakalla, a'lo daraja! Ajoyib natija!";
        } else if (pct >= 50) {
          praiseEl.textContent = "👍 Yaxshi harakat! Xatolaringiz ustida ishlab, yana bir bor urinib ko'ring.";
        } else {
          praiseEl.textContent = "💪 Xavotir olmang! Darsni O'rganish bo'limida qayta o'qib, mashqni takrorlang.";
        }
      }
      if (resultBox) resultBox.classList.remove("hidden");

      // Save student attempt to state & storage
      try {
        if (typeof state !== "undefined" && Array.isArray(state.attempts)) {
          const attempt = {
            id: "att_" + Date.now(),
            studentId: (typeof getCurrentStudent === "function" && getCurrentStudent()) ? getCurrentStudent().id : "stu_1",
            exerciseId: ex.id,
            category: ex.category,
            score: score,
            total: total,
            percentage: pct,
            timestamp: new Date().toISOString(),
            mistakes: mistakes
          };
          state.attempts.push(attempt);
          if (typeof saveStorage === "function") {
            saveStorage("l1_attempts_v1", state.attempts);
          }
          if (typeof window.L1_SERVER_SYNC === "function") {
            window.L1_SERVER_SYNC("/api/submit", {
              attemptId: attempt.id,
              exerciseId: ex.id,
              exerciseTitle: ex.title || "",
              category: ex.category,
              score: score,
              total: total,
              mistakes: mistakes,
              answers: ex.questions.map((_, i) => String(this.userAnswers[i] || ""))
            });
          }
        }
      } catch (e) {
        console.warn("Attempt save error:", e);
      }

      window.dispatchEvent(new CustomEvent("l1:practice-submitted", { detail: { exId: ex.id, meta: ex.meta || null, score, total, pct } }));
      window.scrollTo({ top: resultBox.offsetTop - 50, behavior: "smooth" });
    },

    reset: function() {
      this.userAnswers = {};
      this.renderRunner();
      if (typeof showToast === "function") showToast("Javoblar tozalandi.");
    }
  };

  // =========================================================================
  // 4. MAIN NAVIGATION CONTROLLER
  // =========================================================================
  // The arcade games (static/arcade_core.js and game_*.js, their content and picture frames) run the first time the Games
  // tab opens. When the browser is idle they are only downloaded (prefetch), not run, so the Home page stays light.
  const Lazy = {
    files: ["arcade_data.js?v=2", "arcade/sprites.js?v=2", "arcade_core.js?v=4", "game_wordrun.js?v=4", "game_penalty.js?v=5",
      "game_ninja.js?v=4", "game_river.js?v=4"],
    ready: false,
    promise: null,
    games() {
      if (!this.promise) {
        this.promise = Promise.all(this.files.map((f) => new Promise((resolve) => {
          const el = document.createElement("script");
          el.src = "/static/" + f;
          el.async = false; // run in this order even though the files download together
          el.onload = el.onerror = resolve;
          document.head.appendChild(el);
        }))).then(() => { this.ready = true; });
      }
      return this.promise;
    },
    // download into the cache one file after another, so opening a game later costs only the start-up, not the download
    prefetch() {
      if (this.promise) return;
      this.files.reduce((chain, f) => chain.then(() => (this.promise ? null : fetch("/static/" + f, { credentials: "same-origin" }).then((r) => r.blob()).catch(() => null))), Promise.resolve());
    },
  };
  window.L1_Lazy = Lazy;
  // A game result that could not reach the server yet waits in the arcade outbox (per student); load the games so it
  // is sent now, not only when the Games tab is opened again.
  function arcadeOutboxWaiting() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("l1_arcade_outbox_") && (localStorage.getItem(k) || "[]") !== "[]") return true;
      }
    } catch (e) { /* private mode */ }
    return false;
  }
  setTimeout(() => (window.requestIdleCallback || setTimeout)(() => (arcadeOutboxWaiting() ? Lazy.games() : Lazy.prefetch())), 6000);
  // Flashcard sounds (the old games engine used to provide them): the app's shared sounds under the old names.
  if (!window.L1_Sound) {
    const snd = () => (window.L1 ? window.L1.Sound : null);
    window.L1_Sound = {
      correct() { const s = snd(); if (s) s.right(); },
      wrong() { const s = snd(); if (s) s.wrong(); },
      tick() { const s = snd(); if (s) s.tone(800, "triangle", 0.04, 0, 0.06); },
      victory() { const s = snd(); if (s) s.finish(); },
    };
  }

  const Nav = {
    currentMode: 'learn', // 'learn' | 'practice' | 'games'
    currentLearnSub: 'grammar', // 'grammar' | 'vocab'
    currentPracticeSub: 'grammar', // 'grammar' | 'vocab' | 'workbook'
    currentGameSub: 'hub', // 'hub' (the Games page) or a game being opened: 'wordrun' | 'penalty' | 'ninja' | 'river'

    setMode: function(mode) {
      this.currentMode = mode;

      const btnLearn = document.getElementById("btnMainLearn");
      const btnPractice = document.getElementById("btnMainPractice");
      const btnGames = document.getElementById("btnMainGames");

      const contLearn = document.getElementById("learnContainer");
      const contPractice = document.getElementById("practiceContainer");
      const contGames = document.getElementById("gamesContainer");

      const activeCls = "py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-2 transition-all shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white";
      const inactiveCls = "py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-base flex items-center justify-center gap-2 transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100";

      if (btnLearn) btnLearn.className = mode === 'learn' ? activeCls : inactiveCls;
      if (btnPractice) btnPractice.className = mode === 'practice' ? activeCls : inactiveCls;
      if (btnGames) btnGames.className = mode === 'games' ? activeCls : inactiveCls;

      if (contLearn) contLearn.classList.toggle("hidden", mode !== 'learn');
      if (contPractice) contPractice.classList.toggle("hidden", mode !== 'practice');
      if (contGames) contGames.classList.toggle("hidden", mode !== 'games');

      // Hide extra standalone views if open
      const dictView = document.getElementById("dictionaryView");
      const progView = document.getElementById("myProgressView");
      const runnerView = document.getElementById("exerciseRunnerView");
      if (dictView) dictView.classList.add("hidden");
      if (progView) progView.classList.add("hidden");
      if (runnerView) runnerView.classList.add("hidden");

      if (mode === 'learn') {
        this.setLearnSub(this.currentLearnSub);
      } else if (mode === 'practice') {
        this.setPracticeSub(this.currentPracticeSub);
      } else if (mode === 'games') {
        this.setGameSub(this.currentGameSub);
      }
    },

    setLearnSub: function(sub) {
      this.currentLearnSub = sub;

      const btnGram = document.getElementById("btnLearnSubGrammar");
      const btnVocab = document.getElementById("btnLearnSubVocab");
      const areaGram = document.getElementById("learnGrammarArea");
      const areaVocab = document.getElementById("learnVocabArea");

      const activeCls = "px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all bg-indigo-600 text-white shadow-sm flex items-center gap-2";
      const inactiveCls = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-2";

      if (btnGram) btnGram.className = sub === 'grammar' ? activeCls : inactiveCls;
      if (btnVocab) btnVocab.className = sub === 'vocab' ? activeCls : inactiveCls;

      if (areaGram) areaGram.classList.toggle("hidden", sub !== 'grammar');
      if (areaVocab) areaVocab.classList.toggle("hidden", sub !== 'vocab');

      if (sub === 'vocab') {
        Flashcards.init();
      }
    },

    setPracticeSub: function(sub) {
      this.currentPracticeSub = sub;

      const btnGram = document.getElementById("btnPracticeSubGrammar");
      const btnVocab = document.getElementById("btnPracticeSubVocab");
      const btnWork = document.getElementById("btnPracticeSubWorkbook");
      const areaGram = document.getElementById("practiceGrammarArea");
      const areaVocab = document.getElementById("practiceVocabArea");
      const areaWork = document.getElementById("practiceWorkbookArea");

      const activeCls = "px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all bg-indigo-600 text-white shadow-sm flex items-center gap-2";
      const inactiveCls = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-2";

      if (btnGram) btnGram.className = sub === 'grammar' ? activeCls : inactiveCls;
      if (btnVocab) btnVocab.className = sub === 'vocab' ? activeCls : inactiveCls;
      if (btnWork) btnWork.className = sub === 'workbook' ? activeCls : inactiveCls;

      if (areaGram) areaGram.classList.toggle("hidden", sub !== 'grammar');
      if (areaVocab) areaVocab.classList.toggle("hidden", sub !== 'vocab');
      if (areaWork) areaWork.classList.toggle("hidden", sub !== 'workbook');

      // Make sure suite runner is reset when toggling
      PracticeSuite.backToMenu();

      if (sub === 'workbook' && typeof renderPracticeUnitsList === "function") {
        const listC = document.getElementById("practiceUnitListContainer");
        const exC = document.getElementById("unitExercisesListContainer");
        const unitOpen = typeof state !== "undefined" && state.activePracticeUnitId;
        if (listC) listC.classList.toggle("hidden", !!unitOpen);
        if (exC) exC.classList.toggle("hidden", !unitOpen);
        renderPracticeUnitsList();
      }
    },

    // The Games tab shows the arcade hub; a game id (from a Home card) opens that game full screen on top of it.
    setGameSub: function(sub) {
      this.currentGameSub = 'hub';
      const host = document.getElementById("arcadeHub");
      if (!Lazy.ready) {
        if (host && !host.firstChild) host.innerHTML = "<p class='text-sm text-slate-500 p-4'>O'yinlar yuklanmoqda…</p>";
        Lazy.games().then(() => this.setGameSub(sub));
        return;
      }
      const A = window.L1_Arcade;
      if (!A) return;
      if (host) A.renderHub(host);
      if (sub && sub !== 'hub') A.open(sub);
    }
  };

  // Export to window
  window.L1_Flashcards = Flashcards;
  window.L1_PracticeSuite = PracticeSuite;
  window.L1_Nav = Nav;

})(window);
