// Weekly tasks: the student runner (one question at a time, graded by the server: 25 / 15 / 5 / 5 points)
// and the teacher panel (publish homework with a deadline, see who did and who did not).
(function (window, document) {
  "use strict";
  const { Back, Haptic, Sound, Idris, Fx, avatar, api, countdown, fmtDate, ICONS, html } = window.L1;
  const $ = (id) => document.getElementById(id);
  const toast = (m) => (typeof showToast === "function" ? showToast(m) : alert(m));
  const norm = (v) => (typeof normalizeAns === "function" ? normalizeAns(v) : String(v || "").trim().toLowerCase());
  const MAX_TRIES = 4;

  // ================================================================== student runner
  const R = { asg: null, flat: [], cur: 0, busy: false, back: null, advanceTimer: null, wrongOpts: {} };

  const resolved = (it) => it.q.solved || (it.q.tries || 0) >= MAX_TRIES;
  const pointsForTry = (t) => (R.asg && R.asg.pointsByTry ? R.asg.pointsByTry[Math.min(t, MAX_TRIES) - 1] : [25, 15, 5, 5][t - 1]) || 0;
  const late = () => R.asg && R.asg.deadline < Date.now() / 1000;
  const nextPoints = (it) => { const p = pointsForTry((it.q.tries || 0) + 1); return late() ? Math.ceil(p / 2) : p; };

  async function open(assignmentId) {
    close(true);
    const root = document.createElement("div");
    root.id = "l1Runner";
    root.innerHTML = `<div class="l1-runner-top"><div class="max-w-[560px] mx-auto flex items-center gap-3">
        <button type="button" id="l1RunClose" class="l1-icon-btn" style="background:#fff;color:var(--l1-ink);border-color:var(--l1-line)" aria-label="Yopish">${ICONS.close}</button>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-extrabold truncate" id="l1RunTitle">Yuklanmoqda…</div>
          <div class="l1-progress mt-1.5"><i id="l1RunBar" style="width:0%"></i></div></div>
        <span class="l1-chip l1-chip-amber" id="l1RunPts">★ 0</span>
      </div></div>
      <div class="l1-runner-wrap" id="l1RunBody"><div class="l1-skeleton" style="height:320px"></div></div>`;
    document.body.appendChild(root);
    document.body.style.overflow = "hidden";
    $("l1RunClose").addEventListener("click", () => close());
    R.back = Back.push(() => { R.back = null; close(); });
    try {
      const asg = await api("/api/assignments/" + encodeURIComponent(assignmentId));
      R.asg = asg;
      R.wrongOpts = {};
      R.flat = [];
      asg.exercises.forEach((ex, exIdx) => ex.questions.forEach((q, qIdx) => R.flat.push({ ex, exIdx, q, qIdx })));
      if (!R.flat.length) {
        $("l1RunBody").innerHTML = `<div class="l1-card l1-empty">Bu vazifada savollar yo'q.</div>`;
        return;
      }
      $("l1RunTitle").textContent = asg.title;
      const firstOpen = R.flat.findIndex((it) => !resolved(it));
      if (firstOpen === -1) return finish(false);
      R.cur = firstOpen;
      renderQuestion(true);
    } catch (e) {
      $("l1RunBody").innerHTML = `<div class="l1-card l1-empty"><div class="l1-h2">Vazifani ochib bo'lmadi</div><div class="l1-sub mt-1">${html(e.message)}</div></div>`;
    }
  }

  function close(silent) {
    clearTimeout(R.advanceTimer);
    const root = $("l1Runner");
    if (root) root.remove();
    document.body.style.overflow = "";
    if (R.back) { Back.remove(R.back); R.back = null; }
    if (!silent && window.L1_Shell) window.L1_Shell.refresh();
  }

  function updateTop() {
    const my = R.asg.my;
    const done = R.flat.filter(resolved).length;
    $("l1RunBar").style.width = Math.round((done / R.flat.length) * 100) + "%";
    $("l1RunPts").textContent = "★ " + my.points;
  }

  function dotClass(it, i) {
    let c = "";
    if (it.q.solved) c = it.q.tries === 1 ? "is-first" : "is-later";
    else if ((it.q.tries || 0) >= MAX_TRIES) c = "is-failed";
    return c + (i === R.cur ? " is-current" : "");
  }

  function renderDots() {
    const box = $("l1Dots");
    if (!box) return;
    box.innerHTML = R.flat.map((it, i) => `<button type="button" data-i="${i}" class="${dotClass(it, i)}">${i + 1}</button>`).join("");
    box.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { clearTimeout(R.advanceTimer); R.cur = +b.dataset.i; renderQuestion(false); }));
    const cur = box.querySelector(".is-current");
    if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function wordTokens(text) {
    const body = String(text || "").replace(/^\s*\d+[.)]\s*/, "");
    if (body.includes("___")) return null;
    const parts = body.split(/\s+\/\s+/).map((s) => s.trim()).filter(Boolean);
    return parts.length >= 3 ? parts : null;
  }

  function renderQuestion(first) {
    clearTimeout(R.advanceTimer);
    const it = R.flat[R.cur];
    const { ex, q } = it;
    const tries = q.tries || 0;
    const isDone = resolved(it);
    const exQuestions = ex.questions.length;
    const inst = ex.instructionUz || ex.instructionEn || "";
    const bubble = first ? Idris.line("start") : isDone ? (q.solved ? "Bu savol bajarilgan ✓" : "Bu savolda to'g'ri javob ko'rsatilgan.") : tries ? `Yana ${MAX_TRIES - tries} ta urinish bor. Shoshilmang!` : "Savolni o'qing va javob bering.";
    $("l1RunBody").innerHTML = `
      <div class="flex items-end gap-2 mb-3">
        <div id="l1RunIdris">${Idris.html(isDone && q.solved ? "thumbsup" : "pointing", 104)}</div>
        <div class="idris-bubble flex-1 mb-6" id="l1Bubble">${html(bubble)}</div>
      </div>
      <div class="l1-qcard" id="l1QCard">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="l1-chip l1-chip-blue truncate" style="max-width:58%">${html(ex.title)} · ${it.qIdx + 1}/${exQuestions}</span>
          <div class="flex items-center gap-2">
            <span class="l1-tries" title="Urinishlar">${Array.from({ length: MAX_TRIES }, (_, i) => `<i class="${i < tries ? "is-used" : ""}"></i>`).join("")}</span>
            <span class="l1-points-badge" id="l1PtsBadge">${isDone ? (q.solved ? "+" + (q.points || 0) : "0") : "+" + nextPoints(it)}</span>
          </div>
        </div>
        ${inst ? `<div class="l1-sub mb-2" style="font-size:12px">${html(inst)}</div>` : ""}
        ${q.img ? `<div class="rounded-2xl overflow-hidden border border-[color:var(--l1-line)] bg-[#f6f8ff] mb-3 max-w-[260px]"><img src="${html(q.img)}" alt="" class="w-full h-auto"></div>` : ""}
        <div class="l1-qtext">${html(q.q)}</div>
        <div id="l1Answer" class="mt-4"></div>
        <div id="l1Hint" class="mt-3"></div>
        <div id="l1Feedback" class="mt-3"></div>
      </div>
      <div class="l1-qdots mt-3" id="l1Dots"></div>
      <div class="text-center mt-2"><button type="button" id="l1Skip" class="l1-btn l1-btn-ghost l1-btn-sm">Keyinroq javob beraman →</button></div>`;
    renderAnswer(it);
    renderHint(it);
    if (isDone) renderFeedback(it, false);
    $("l1Skip").classList.toggle("hidden", isDone || R.flat.filter((x) => !resolved(x)).length < 2);
    $("l1Skip").addEventListener("click", () => goNext(true));
    renderDots();
    updateTop();
    $("l1Runner").scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderAnswer(it) {
    const { ex, q } = it;
    const box = $("l1Answer");
    const isDone = resolved(it);
    const key = it.ex.id + ":" + it.qIdx;
    const wrong = R.wrongOpts[key] || [];
    if (q.options && q.options.length) {
      const long = q.options.some((o) => String(o).length > 16);
      box.innerHTML = `<div class="grid ${long ? "grid-cols-1" : "grid-cols-2"} gap-2.5">${q.options.map((o) => {
        let cls = "";
        if (isDone && q.correctAnswer && norm(o) === norm(q.correctAnswer)) cls = "is-right";
        else if (wrong.includes(o)) cls = "is-wrong";
        return `<button type="button" class="l1-opt ${cls}" data-val="${html(o)}" ${isDone || cls ? "disabled" : ""}>${html(o)}</button>`;
      }).join("")}</div>`;
      box.querySelectorAll(".l1-opt").forEach((b) => b.addEventListener("click", () => submit(b.dataset.val, b)));
      return;
    }
    const tokens = wordTokens(q.q);
    const bank = ex.wordBank && ex.wordBank.length ? ex.wordBank : null;
    box.innerHTML = `
      ${tokens ? `<div class="l1-sub mb-2" style="font-size:12px">So'zlarni bosib gap tuzing yoki o'zingiz yozing:</div>
        <div class="flex flex-wrap gap-2 mb-3" id="l1Tokens">${tokens.map((t, i) => `<button type="button" class="l1-token" data-i="${i}">${html(t)}</button>`).join("")}</div>` : ""}
      ${bank ? `<div class="flex flex-wrap gap-2 mb-3" id="l1Bank">${bank.map((w) => `<button type="button" class="l1-token" data-w="${html(w)}">${html(w)}</button>`).join("")}</div>` : ""}
      <div class="flex gap-2">
        <input id="l1Input" class="l1-input ${isDone ? (q.solved ? "is-right" : "is-wrong") : ""}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
          placeholder="Javobingizni yozing…" ${isDone ? "disabled" : ""} value="${isDone && q.correctAnswer ? html(q.correctAnswer) : ""}">
        ${tokens && !isDone ? `<button type="button" id="l1Clear" class="l1-btn l1-btn-soft" style="width:56px;padding:0" aria-label="Tozalash">⌫</button>` : ""}
      </div>
      ${isDone ? "" : `<button type="button" id="l1Check" class="l1-btn l1-btn-primary w-full mt-3">Tekshirish</button>`}`;
    const input = $("l1Input");
    if (isDone) return;
    const used = new Set();
    const send = () => { const v = input.value.trim(); if (!v) { Fx.shake(input); input.focus(); return; } submit(v, input); };
    $("l1Check").addEventListener("click", send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); send(); } });
    input.addEventListener("focus", () => setTimeout(() => input.scrollIntoView({ block: "center", behavior: "smooth" }), 250));
    input.addEventListener("input", () => input.classList.remove("is-wrong"));
    if (tokens) {
      box.querySelectorAll("#l1Tokens .l1-token").forEach((b) => b.addEventListener("click", () => {
        Haptic.tap();
        input.value = (input.value.trim() + " " + b.textContent).trim();
        used.add(b.dataset.i);
        b.classList.add("is-used");
        input.classList.remove("is-wrong");
      }));
      $("l1Clear").addEventListener("click", () => {
        input.value = "";
        used.clear();
        box.querySelectorAll("#l1Tokens .l1-token").forEach((b) => b.classList.remove("is-used"));
      });
    }
    if (bank) box.querySelectorAll("#l1Bank .l1-token").forEach((b) => b.addEventListener("click", () => { Haptic.tap(); input.value = b.dataset.w; input.classList.remove("is-wrong"); }));
  }

  function renderHint(it) {
    const box = $("l1Hint");
    const hint = it.q.hint;
    if (!box || !hint || resolved(it)) { if (box) box.innerHTML = ""; return; }
    if (hint.remove) {
      document.querySelectorAll("#l1Answer .l1-opt").forEach((b) => {
        if (hint.remove.some((o) => norm(o) === norm(b.dataset.val)) && !b.classList.contains("is-wrong")) {
          b.classList.add("is-removed");
          b.disabled = true;
        }
      });
      box.innerHTML = `<div class="l1-chip l1-chip-amber">💡 Maslahat: noto'g'ri variantlar olib tashlandi</div>`;
    } else if (hint.mask) {
      box.innerHTML = `<div class="rounded-2xl p-3 bg-[#fff6dc] text-[#7a4b00] text-[14px] font-bold">💡 Maslahat: <span style="letter-spacing:.08em;font-size:16px">${html(hint.mask)}</span></div>`;
    }
  }

  function renderFeedback(it, fresh) {
    const box = $("l1Feedback");
    const q = it.q;
    const remaining = R.flat.filter((x) => !resolved(x)).length;
    const nextLabel = remaining ? "Keyingi savol →" : "Natijani ko'rish →";
    if (q.solved) {
      box.innerHTML = `<div class="rounded-2xl p-3.5 bg-[color:var(--l1-success-50)] border border-[#bfe9cf] flex items-center justify-between gap-3">
        <div class="text-[14px] font-extrabold text-[#14532d]">✓ To'g'ri! <span class="font-bold">+${q.points || 0} ball</span>${q.tries > 1 ? ` <span class="l1-sub">(${q.tries}-urinish)</span>` : ""}</div>
        <button type="button" id="l1Next" class="l1-btn l1-btn-primary l1-btn-sm">${nextLabel}</button></div>`;
    } else {
      box.innerHTML = `<div class="rounded-2xl p-3.5 bg-[color:var(--l1-danger-50)] border border-[#ffd0d2] space-y-2">
        <div class="text-[14px] font-bold text-[#8c1d22]">4 ta urinish tugadi. To'g'ri javob:</div>
        <div class="text-[18px] font-extrabold text-[color:var(--l1-ink)]">${html(q.correctAnswer || "")}</div>
        <button type="button" id="l1Next" class="l1-btn l1-btn-primary l1-btn-sm w-full">${nextLabel}</button></div>`;
    }
    $("l1Next").addEventListener("click", () => goNext(false));
    if (fresh && q.solved) R.advanceTimer = setTimeout(() => goNext(false), 1500);
  }

  function goNext(skip) {
    clearTimeout(R.advanceTimer);
    const n = R.flat.length;
    for (let step = 1; step <= n; step++) {
      const i = (R.cur + step) % n;
      if (!resolved(R.flat[i])) { R.cur = i; renderQuestion(false); return; }
    }
    if (!skip) finish(true);
  }

  async function submit(value, srcEl) {
    if (R.busy) return;
    const it = R.flat[R.cur];
    if (resolved(it)) return;
    R.busy = true;
    Haptic.tap();
    srcEl.classList.add("is-pending");
    const buttons = document.querySelectorAll("#l1Answer button, #l1Check");
    buttons.forEach((b) => (b.dataset.wasDisabled = b.disabled ? "1" : "", b.disabled = true));
    let r;
    try {
      r = await api("/api/assignments/answer", { assignmentId: R.asg.id, exerciseId: it.ex.id, qIndex: it.qIdx, answer: value });
    } catch (e) {
      toast(e.message || "Javob yuborilmadi. Internetni tekshiring.");
      srcEl.classList.remove("is-pending");
      buttons.forEach((b) => (b.disabled = b.dataset.wasDisabled === "1"));
      R.busy = false;
      return;
    }
    R.busy = false;
    srcEl.classList.remove("is-pending");
    const prevNext = nextPoints(it);
    it.q.tries = r.tries;
    it.q.solved = !!r.correct;
    if (r.correct) it.q.points = r.points;
    if (r.correctAnswer) it.q.correctAnswer = r.correctAnswer;
    if (r.hint) it.q.hint = r.hint;
    R.asg.my = r.my;
    if (r.locked) { renderQuestion(false); return; }
    r.correct ? onRight(it, r, srcEl) : onWrong(it, r, srcEl, value, prevNext);
  }

  function setBubble(text, kind) {
    const b = $("l1Bubble");
    if (!b) return;
    b.className = "idris-bubble flex-1 mb-6" + (kind ? " is-" + kind : "");
    b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
    b.textContent = text;
  }

  function onRight(it, r, srcEl) {
    Fx.flash("right");
    Sound.right();
    Haptic.ok();
    Idris.react($("l1RunIdris").firstElementChild, "thumbsup", "happy");
    setBubble(Idris.line(r.tries === 1 ? "right" : "rightLater"), "good");
    if (srcEl.classList.contains("l1-opt")) srcEl.classList.add("is-right");
    else srcEl.classList.add("is-right");
    document.querySelectorAll("#l1Answer button, #l1Check").forEach((b) => (b.disabled = true));
    const inp = $("l1Input"); if (inp) inp.disabled = true;
    const chk = $("l1Check"); if (chk) chk.remove();
    Fx.points(srcEl, "+" + r.points);
    if (r.tries === 1) Fx.confetti(srcEl, 16);
    $("l1PtsBadge").textContent = "+" + r.points;
    $("l1Hint").innerHTML = "";
    $("l1Skip").classList.add("hidden");
    renderFeedback(it, true);
    renderDots();
    updateTop();
  }

  function onWrong(it, r, srcEl, value, prevNext) {
    Fx.flash("wrong");
    Sound.wrong();
    Haptic.err();
    Idris.react($("l1RunIdris").firstElementChild, "pointing", "no");
    Fx.shake($("l1QCard"));
    const key = it.ex.id + ":" + it.qIdx;
    if (srcEl.classList.contains("l1-opt")) {
      R.wrongOpts[key] = (R.wrongOpts[key] || []).concat(value);
      srcEl.classList.add("is-wrong");
    } else {
      srcEl.classList.add("is-wrong");
      srcEl.select && srcEl.select();
    }
    document.querySelectorAll("#l1Answer button, #l1Check").forEach((b) => (b.disabled = b.classList.contains("is-wrong") || b.classList.contains("is-removed")));
    // tries dots + points badge drop (25 -> 15 -> 5)
    document.querySelectorAll("#l1QCard .l1-tries i").forEach((d, i) => d.classList.toggle("is-used", i < r.tries));
    const badge = $("l1PtsBadge");
    badge.innerHTML = r.resolved ? "0" : `+${r.nextPoints}<span class="l1-old">+${prevNext}</span>`;
    if (r.resolved) {
      setBubble(Idris.line("reveal"), "bad");
      document.querySelectorAll("#l1Answer .l1-opt").forEach((b) => {
        b.disabled = true;
        if (norm(b.dataset.val) === norm(r.correctAnswer)) b.classList.add("is-right");
      });
      const inp = $("l1Input"); if (inp) { inp.disabled = true; }
      const chk = $("l1Check"); if (chk) chk.remove();
      $("l1Hint").innerHTML = "";
      $("l1Skip").classList.add("hidden");
      renderFeedback(it, true);
    } else if (r.hint && r.tries === 2) {
      setBubble(Idris.line(r.hint.remove ? "hintOptions" : "hintMask"), "bad");
      setTimeout(() => renderHint(it), 450);
    } else {
      setBubble(`${Idris.line("wrong")} Endi to'g'ri javob — ${r.nextPoints} ball.`, "bad");
      renderHint(it);
    }
    renderDots();
    updateTop();
  }

  async function finish(fresh) {
    const my = R.asg.my;
    const firstTry = R.flat.filter((it) => it.q.solved && it.q.tries === 1).length;
    const solved = R.flat.filter((it) => it.q.solved).length;
    const max = R.flat.length * (R.asg.pointsByTry ? R.asg.pointsByTry[0] : 25);
    const mistakesEx = R.asg.exercises.find((ex) => ex.questions.some((q) => !q.solved || q.tries > 1));
    $("l1RunBar").style.width = "100%";
    $("l1RunPts").textContent = "★ " + my.points;
    $("l1RunBody").innerHTML = `<div class="l1-page text-center space-y-4 pt-2">
      <div id="l1FinishIdris" class="flex justify-center">${Idris.html("celebrate", 190, fresh ? "is-party" : "")}</div>
      <div><div class="l1-h1">${fresh ? "Vazifa bajarildi!" : "Bu vazifa bajarilgan"}</div>
        <div class="l1-sub mt-1">${my.late ? "Muddatdan keyin bajarildi — ball yarmiga hisoblandi." : "Barakalla! Natijangiz o'qituvchiga yuborildi."}</div></div>
      <div class="l1-card-blue p-5"><div class="relative z-[1]">
        <div class="text-[40px] font-extrabold leading-none">${my.points}</div>
        <div class="text-[14px] font-bold opacity-90">ball · maksimal ${max}</div></div></div>
      <div class="grid grid-cols-3 gap-2">
        <div class="l1-card p-3"><b class="text-[20px]">${solved}/${R.flat.length}</b><div class="l1-sub" style="font-size:12px">To'g'ri</div></div>
        <div class="l1-card p-3"><b class="text-[20px] text-[color:var(--l1-success)]">${firstTry}</b><div class="l1-sub" style="font-size:12px">1-urinishda</div></div>
        <div class="l1-card p-3"><b class="text-[20px]" id="l1FinishRank">…</b><div class="l1-sub" style="font-size:12px">Haftalik o'rin</div></div>
      </div>
      <div class="space-y-2 pt-1">
        <button type="button" id="l1FinRating" class="l1-btn l1-btn-primary w-full">🏆 Reytingni ko'rish</button>
        ${mistakesEx ? `<button type="button" id="l1FinPractice" class="l1-btn l1-btn-soft w-full">🔁 Xatolar ustida ishlash (ballsiz)</button>` : ""}
        <button type="button" id="l1FinReview" class="l1-btn l1-btn-ghost w-full">Javoblarni ko'rib chiqish</button>
      </div>
    </div>`;
    if (fresh) { Sound.finish(); Haptic.ok(); setTimeout(() => Fx.confetti($("l1FinishIdris"), 40), 350); }
    $("l1FinRating").addEventListener("click", () => { close(); window.L1_Shell && window.L1_Shell.go("rating"); });
    $("l1FinReview").addEventListener("click", () => { R.cur = 0; renderQuestion(false); });
    if (mistakesEx) $("l1FinPractice").addEventListener("click", () => {
      close();
      if (window.L1_Shell) window.L1_Shell.go("learn");
      if (typeof window.openExerciseRunner === "function") window.openExerciseRunner(mistakesEx.id);
    });
    try {
      const board = await api("/api/leaderboard?period=week");
      const el = $("l1FinishRank");
      if (el) el.textContent = board.me.weekRank ? "#" + board.me.weekRank : "—";
    } catch (e) {}
  }

  // ================================================================== teacher panel
  const T = { built: false, active: "weekly", list: null, showForm: false, onlyMissing: {}, open: {}, ratingPeriod: "week" };
  const ACTIVE_CLS = "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap bg-indigo-600 text-white shadow-sm";
  const IDLE_CLS = "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-100";
  const LEGACY_TABS = [["tTabCompletion", "tPanelCompletion"], ["tTabMistakes", "tPanelMistakes"], ["tTabRoster", "tPanelRoster"], ["tTabAddEx", "tPanelAddEx"]];
  const pad = (n) => String(n).padStart(2, "0");
  const toLocalInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  function buildTeacher() {
    if (T.built) return;
    const first = $("tTabCompletion");
    const panelAnchor = $("tPanelCompletion");
    if (!first || !panelAnchor) return;
    T.built = true;
    const mk = (id, text) => { const b = document.createElement("button"); b.type = "button"; b.id = id; b.className = IDLE_CLS; b.textContent = text; return b; };
    const bWeekly = mk("tTabWeekly", "📅 Haftalik vazifalar");
    const bRating = mk("tTabRating", "🏆 Reyting");
    first.parentNode.insertBefore(bRating, first);
    first.parentNode.insertBefore(bWeekly, bRating);
    const pW = document.createElement("div"); pW.id = "tPanelWeekly"; pW.className = "space-y-4";
    const pR = document.createElement("div"); pR.id = "tPanelRating"; pR.className = "hidden space-y-4";
    panelAnchor.parentNode.insertBefore(pW, panelAnchor);
    panelAnchor.parentNode.insertBefore(pR, panelAnchor);
    bWeekly.addEventListener("click", () => activate("weekly"));
    bRating.addEventListener("click", () => activate("rating"));
    LEGACY_TABS.forEach(([btn]) => { const b = $(btn); if (b) b.addEventListener("click", () => activate(null)); });
    activate("weekly");
  }

  function activate(which) {
    T.active = which;
    $("tTabWeekly").className = which === "weekly" ? ACTIVE_CLS : IDLE_CLS;
    $("tTabRating").className = which === "rating" ? ACTIVE_CLS : IDLE_CLS;
    $("tPanelWeekly").classList.toggle("hidden", which !== "weekly");
    $("tPanelRating").classList.toggle("hidden", which !== "rating");
    if (which) {
      LEGACY_TABS.forEach(([btn, panel]) => { const b = $(btn), p = $(panel); if (b) b.className = IDLE_CLS; if (p) p.classList.add("hidden"); });
      if (which === "weekly") loadTeacherList();
      if (which === "rating") renderTeacherRating();
    }
  }

  function renderTeacher() {
    if (typeof state === "undefined" || state.mode !== "teacher") return;
    buildTeacher();
    if (T.active === "weekly") loadTeacherList();
  }

  async function loadTeacherList() {
    renderWeekly();
    try {
      const data = await api("/api/assignments");
      T.list = data.assignments.filter((a) => !String(a.id).startsWith("hw_")); // the permanent daily homeworks are not weekly assignments
      T.now = data.now;
    } catch (e) {
      T.error = e.message;
    }
    renderWeekly();
  }

  function nextSundayEvening() {
    const d = new Date();
    const add = (7 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + add);
    d.setHours(23, 59, 0, 0);
    return d;
  }

  function exercisePicker() {
    const exs = (typeof state !== "undefined" && state.exercises) || [];
    const groups = {};
    exs.forEach((ex) => { const g = ex.week || "Boshqa mashqlar"; (groups[g] = groups[g] || []).push(ex); });
    return Object.keys(groups).map((g) => `<div class="l1-ex-group" data-group="${html(g)}">
        <div class="flex items-center justify-between mt-3 mb-1.5"><div class="font-extrabold text-[14px]">${html(g)}</div>
          <button type="button" class="text-[12px] font-extrabold text-[color:var(--l1-primary)]" data-pick-all="${html(g)}">Hammasini tanlash</button></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">${groups[g].map((ex) => `
          <label class="l1-ex-pick" data-search="${html((ex.title + " " + (ex.part || "") + " " + ex.category).toLowerCase())}">
            <input type="checkbox" value="${html(ex.id)}" data-q="${(ex.questions || []).length}">
            <span class="min-w-0 flex-1"><span class="block text-[14px] font-bold truncate">${html(ex.title)}</span>
            <span class="block text-[12px] text-[color:var(--l1-muted)] truncate">${html(ex.part || "")}</span></span>
            <span class="l1-chip ${ex.category === "grammar" ? "l1-chip-blue" : "l1-chip-green"}">${(ex.questions || []).length}</span>
          </label>`).join("")}</div></div>`).join("");
  }

  function renderWeekly() {
    const el = $("tPanelWeekly");
    if (!el) return;
    const list = T.list;
    const now = T.now || Date.now() / 1000;
    el.innerHTML = `
      <div class="l1-card p-4 space-y-3">
        <div class="flex items-center gap-3">
          ${Idris.html("pointing", 72)}
          <div class="flex-1 min-w-0"><div class="l1-h2">Haftalik vazifalar</div>
            <div class="l1-sub">Mashqlarni tanlang va muddat qo'ying. Talabalar botdan xabar oladi, 24 soat qolganda eslatma boradi, muddat tugagach sizga hisobot keladi.</div></div>
        </div>
        <button type="button" id="tNewTaskBtn" class="l1-btn ${T.showForm ? "l1-btn-soft" : "l1-btn-primary"} w-full">${T.showForm ? "Formani yopish" : "+ Yangi haftalik vazifa"}</button>
      </div>
      ${T.showForm ? `<div class="l1-card p-4 space-y-3" id="tTaskForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="l1-field"><label>Vazifa nomi</label><input id="tTaskTitle" maxlength="120" placeholder="Masalan: To be — am / is / are"></div>
          <div class="l1-field"><label>Hafta</label><input id="tTaskWeek" maxlength="60" placeholder="Masalan: 3-hafta"></div>
          <div class="l1-field"><label>Boshlanishi</label><input id="tTaskStart" type="datetime-local" value="${toLocalInput(new Date())}"></div>
          <div class="l1-field"><label>Deadline (qachongacha)</label><input id="tTaskDeadline" type="datetime-local" value="${toLocalInput(nextSundayEvening())}"></div>
        </div>
        <div class="l1-field"><label>Izoh (ixtiyoriy)</label><textarea id="tTaskNote" rows="2" maxlength="1000" placeholder="Talabalarga qisqa izoh"></textarea></div>
        <div class="l1-field"><label>Mashqlar</label><input id="tTaskSearch" placeholder="Qidirish: to be, plural, jobs…"></div>
        <div id="tTaskPicker" class="max-h-[420px] overflow-y-auto pr-1">${exercisePicker()}</div>
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span class="text-[14px] font-extrabold" id="tTaskSummary">Mashq tanlanmagan</span>
          <button type="button" id="tTaskPublish" class="l1-btn l1-btn-primary">📤 E'lon qilish</button>
        </div>
      </div>` : ""}
      ${list === null ? `<div class="l1-skeleton" style="height:140px"></div>` : ""}
      ${T.error && !list ? `<div class="l1-card p-4 text-[14px] font-bold text-[color:var(--l1-danger)]">${html(T.error)}</div>` : ""}
      ${list && !list.length ? `<div class="l1-card l1-empty"><div class="l1-h2">Hali vazifa yo'q</div><div class="l1-sub mt-1">“+ Yangi vazifa” tugmasini bosing.</div></div>` : ""}
      ${(list || []).map((a) => teacherCard(a, now)).join("")}`;
    wireWeekly(el);
  }

  function teacherCard(a, now) {
    const scheduled = a.startsAt > now;
    const ended = a.deadline <= now;
    const status = scheduled ? ["l1-chip-grey", "Rejalashtirilgan"] : ended ? ["l1-chip-red", "Muddat tugagan"] : ["l1-chip-green", "Faol"];
    const pct = a.studentCount ? Math.round((a.doneCount / a.studentCount) * 100) : 0;
    const open = !!T.open[a.id];
    const onlyMissing = !!T.onlyMissing[a.id];
    const rows = (a.students || []).filter((s) => !onlyMissing || !s.done);
    const chip = (s) => s.done ? (s.late ? `<span class="l1-chip l1-chip-amber">Kechikdi</span>` : `<span class="l1-chip l1-chip-green">✓ Bajardi</span>`)
      : s.started ? `<span class="l1-chip l1-chip-blue">${s.resolved}/${s.total}</span>` : `<span class="l1-chip l1-chip-red">Boshlamagan</span>`;
    return `<div class="l1-card p-4 space-y-3" data-asg="${html(a.id)}">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0"><div class="flex flex-wrap gap-1.5 mb-1"><span class="l1-chip ${status[0]}">${status[1]}</span>${a.weekLabel ? `<span class="l1-chip l1-chip-blue">${html(a.weekLabel)}</span>` : ""}</div>
          <div class="text-[16px] font-extrabold">${html(a.title)}</div>
          <div class="l1-sub">${a.exercises.length} ta mashq · ${a.questionCount} savol · Deadline: ${html(fmtDate(a.deadline))}${!ended ? " (" + html(countdown(a.deadline, now)) + " qoldi)" : ""}</div></div>
        <div class="text-right flex-none"><div class="text-[24px] font-extrabold text-[color:var(--l1-primary)]">${a.doneCount}/${a.studentCount}</div><div class="l1-sub" style="font-size:12px">bajardi</div></div>
      </div>
      <div class="l1-progress"><i style="width:${pct}%"></i></div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="l1-btn l1-btn-soft l1-btn-sm" data-act="toggle">${open ? "Yashirish ▴" : "Kim bajardi? ▾"}</button>
        <button type="button" class="l1-btn l1-btn-soft l1-btn-sm" data-act="copy">📋 Bajarmaganlar</button>
        <button type="button" class="l1-btn l1-btn-soft l1-btn-sm" data-act="deadline">⏰ Muddatni o'zgartirish</button>
        <button type="button" class="l1-btn l1-btn-danger l1-btn-sm" data-act="delete">O'chirish</button>
      </div>
      <div class="hidden flex flex-wrap items-end gap-2" data-deadline-box>
        <div class="l1-field flex-1 min-w-[200px]"><label>Yangi deadline</label><input type="datetime-local" value="${toLocalInput(new Date(a.deadline * 1000))}"></div>
        <button type="button" class="l1-btn l1-btn-primary l1-btn-sm" data-act="save-deadline">Saqlash</button>
      </div>
      ${open ? `<div class="space-y-2">
        <label class="inline-flex items-center gap-2 text-[12px] font-bold"><input type="checkbox" data-act="only-missing" ${onlyMissing ? "checked" : ""}> Faqat bajarmaganlar</label>
        <div class="overflow-x-auto"><table class="l1-table"><thead><tr><th>Talaba</th><th>Holat</th><th>Ball</th><th>1-urinishda</th><th>Oxirgi faollik</th></tr></thead><tbody>
          ${rows.map((s) => `<tr><td><div class="flex items-center gap-2">${avatar(s, 30)}<span class="font-bold">${html(s.name)}</span></div></td>
            <td>${chip(s)}</td><td class="font-extrabold">${s.points}</td><td>${s.firstTry}/${s.total}</td>
            <td class="text-[12px] text-[color:var(--l1-muted)]">${s.lastActivity ? html(fmtDate(s.lastActivity)) : "—"}</td></tr>`).join("") || `<tr><td colspan="5" class="l1-sub">Hammasi bajargan 🎉</td></tr>`}
        </tbody></table></div></div>` : ""}
    </div>`;
  }

  function wireWeekly(el) {
    const btn = $("tNewTaskBtn");
    if (btn) btn.addEventListener("click", () => { T.showForm = !T.showForm; renderWeekly(); });
    const form = $("tTaskForm");
    if (form) {
      const summary = () => {
        const picked = [...form.querySelectorAll("#tTaskPicker input:checked")];
        const qs = picked.reduce((s, i) => s + Number(i.dataset.q || 0), 0);
        $("tTaskSummary").textContent = picked.length ? `${picked.length} ta mashq · ${qs} savol · maks. ${qs * 25} ball` : "Mashq tanlanmagan";
      };
      form.addEventListener("change", summary);
      form.querySelectorAll("[data-pick-all]").forEach((b) => b.addEventListener("click", () => {
        const g = b.closest(".l1-ex-group");
        const boxes = [...g.querySelectorAll("input[type=checkbox]")].filter((i) => i.closest("label").style.display !== "none");
        const all = boxes.every((i) => i.checked);
        boxes.forEach((i) => (i.checked = !all));
        summary();
      }));
      $("tTaskSearch").addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        form.querySelectorAll(".l1-ex-pick").forEach((l) => {
          const keep = !q || l.dataset.search.includes(q) || l.querySelector("input").checked;
          l.style.display = keep ? "" : "none";
        });
        form.querySelectorAll(".l1-ex-group").forEach((g) => {
          g.style.display = [...g.querySelectorAll(".l1-ex-pick")].some((l) => l.style.display !== "none") ? "" : "none";
        });
      });
      $("tTaskPublish").addEventListener("click", publish);
    }
    el.querySelectorAll("[data-asg]").forEach((card) => {
      const id = card.dataset.asg;
      const a = (T.list || []).find((x) => x.id === id);
      card.addEventListener("click", async (ev) => {
        const actEl = ev.target.closest("[data-act]");
        if (!actEl) return;
        const act = actEl.dataset.act;
        if (act === "toggle") { T.open[id] = !T.open[id]; renderWeekly(); }
        if (act === "only-missing") { T.onlyMissing[id] = actEl.checked; T.open[id] = true; renderWeekly(); }
        if (act === "deadline") card.querySelector("[data-deadline-box]").classList.toggle("hidden");
        if (act === "save-deadline") {
          const v = card.querySelector("[data-deadline-box] input").value;
          const ts = new Date(v).getTime();
          if (!v || isNaN(ts)) return toast("Sanani tanlang.");
          try { await api("/api/assignments/update", { id, deadline: ts }); toast("Muddat yangilandi."); loadTeacherList(); }
          catch (e) { toast(e.message); }
        }
        if (act === "delete") {
          if (!confirm(`«${a ? a.title : id}» vazifasini o'chirasizmi? Talabalarning shu vazifadan olgan ballari ham o'chadi.`)) return;
          try { await api("/api/assignments/delete", { id }); toast("Vazifa o'chirildi."); loadTeacherList(); }
          catch (e) { toast(e.message); }
        }
        if (act === "copy" && a) {
          const missing = a.students.filter((s) => !s.done);
          const text = missing.length
            ? `«${a.title}» — bajarmaganlar (${missing.length}/${a.studentCount}):\n` + missing.map((s, i) => `${i + 1}. ${s.name} — ${s.resolved}/${s.total}`).join("\n") + `\n⏰ Deadline: ${fmtDate(a.deadline)}`
            : `«${a.title}» — hamma bajardi! 🎉`;
          try { await navigator.clipboard.writeText(text); toast("Ro'yxat nusxalandi — guruhga joylashingiz mumkin."); }
          catch (e) { prompt("Nusxalang:", text); }
        }
      });
    });
  }

  async function publish() {
    const form = $("tTaskForm");
    const ids = [...form.querySelectorAll("#tTaskPicker input:checked")].map((i) => i.value);
    const title = $("tTaskTitle").value.trim();
    const deadline = new Date($("tTaskDeadline").value).getTime();
    const startsAt = new Date($("tTaskStart").value).getTime();
    if (!title) { Fx.shake($("tTaskTitle")); return toast("Vazifa nomini kiriting."); }
    if (!ids.length) return toast("Kamida bitta mashq tanlang.");
    if (isNaN(deadline)) return toast("Deadline sanasini tanlang.");
    const btn = $("tTaskPublish");
    btn.disabled = true;
    try {
      await api("/api/assignments", {
        title, weekLabel: $("tTaskWeek").value.trim(), note: $("tTaskNote").value.trim(),
        exerciseIds: ids, deadline, startsAt: isNaN(startsAt) || startsAt <= Date.now() ? undefined : startsAt,
      });
      toast("Vazifa e'lon qilindi! Talabalarga bot orqali xabar boradi.");
      T.showForm = false;
      loadTeacherList();
    } catch (e) {
      toast(e.message);
      btn.disabled = false;
    }
  }

  function renderTeacherRating() {
    const el = $("tPanelRating");
    if (!el || !window.L1_Shell) return;
    const Shell = window.L1_Shell;
    const show = (p) => {
      T.ratingPeriod = p;
      Shell.renderBoard(el, p, show);
      Shell.loadBoard(p).then(() => { if (T.active === "rating" && T.ratingPeriod === p) Shell.renderBoard(el, p, show); }).catch(() => {});
    };
    show(T.ratingPeriod);
  }

  window.L1_Tasks = { open, close, renderTeacher };
})(window, document);
