import { LESSONS, FINGER_MAP, KEYBOARD_ROWS } from "./lessons.js";
import { ADVENTURES } from "./adventures.js";

const STORE_KEY = "swiftkeys.progress.v1";
const ADV_KEY = "swiftkeys.adventures.v1";
const $ = (id) => document.getElementById(id);

const state = {
  mode: "lessons",        // "lessons" | "adventure"
  lessonIndex: 0,
  advIndex: 0,
  stageIndex: 0,
  text: "",
  typed: "",
  errors: 0,
  startTime: null,
  finished: false,
  timer: null,
};

// ---------- Persistence ----------
function loadJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch { return {}; }
}
let progress = loadJSON(STORE_KEY);
let advProgress = loadJSON(ADV_KEY);
function saveProgress() { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); }
function saveAdvProgress() { localStorage.setItem(ADV_KEY, JSON.stringify(advProgress)); }

// ---------- Shared text helpers ----------
function lessonText(lesson) { return lesson.lines.join(" "); }

// ---------- Sidebar lists ----------
function renderLessonList() {
  const list = $("lessonList");
  list.innerHTML = "";
  let currentUnit = null;
  LESSONS.forEach((lesson, i) => {
    if (lesson.unit !== currentUnit) {
      currentUnit = lesson.unit;
      const u = document.createElement("div");
      u.className = "unit-label";
      u.textContent = currentUnit;
      list.appendChild(u);
    }
    const item = document.createElement("div");
    item.className = "lesson-item" +
      (state.mode === "lessons" && i === state.lessonIndex ? " active" : "");
    const rec = progress[lesson.id];
    if (rec) item.classList.add("done");
    const stars = rec ? "★".repeat(rec.stars) + "☆".repeat(3 - rec.stars) : "";
    item.innerHTML = `<span class="title">${lesson.title}</span><span class="stars">${stars}</span>`;
    item.addEventListener("click", () => loadLesson(i));
    list.appendChild(item);
  });
}

function renderAdventureList() {
  const list = $("lessonList");
  list.innerHTML = "";
  const u = document.createElement("div");
  u.className = "unit-label";
  u.textContent = "Choose your quest";
  list.appendChild(u);
  ADVENTURES.forEach((adv, i) => {
    const item = document.createElement("div");
    item.className = "adv-item" +
      (state.mode === "adventure" && i === state.advIndex ? " active" : "");
    if (advProgress[adv.id]?.cleared) item.classList.add("done");
    item.innerHTML = `<span class="adv-emoji">${adv.emoji}</span><span class="adv-name">${adv.title}</span>`;
    item.addEventListener("click", () => loadAdventure(i));
    list.appendChild(item);
  });
}

// ---------- Typing surface ----------
function renderTypingBox() {
  const box = $("typingBox");
  box.innerHTML = "";
  const pos = state.typed.length;
  for (let i = 0; i < state.text.length; i++) {
    const ch = state.text[i];
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00B7" : ch;
    if (ch === " ") span.classList.add("space");
    if (i < pos) {
      span.classList.add(state.typed[i] === ch ? "correct" : "incorrect");
    } else if (i === pos) {
      span.classList.add("current");
    } else {
      span.classList.add("pending");
    }
    box.appendChild(span);
  }
}

function renderKeyboard() {
  const kb = $("keyboard");
  kb.innerHTML = "";
  const nextChar = state.text[state.typed.length] || "";
  const nextLower = nextChar.toLowerCase();
  KEYBOARD_ROWS.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.forEach((key) => {
      const k = document.createElement("div");
      k.className = "key" + (key === " " ? " space" : "");
      if (key === "f") k.classList.add("f-home");
      if (key === "j") k.classList.add("j-home");
      k.dataset.key = key;
      k.dataset.finger = FINGER_MAP[key] || "";
      k.textContent = key === " " ? "space" : key;
      if (key === nextLower || (key === " " && nextChar === " ")) k.classList.add("next");
      rowEl.appendChild(k);
    });
    kb.appendChild(rowEl);
  });
}

// ---------- Metrics ----------
function computeWpm() {
  if (!state.startTime) return 0;
  const minutes = (Date.now() - state.startTime) / 60000;
  if (minutes <= 0) return 0;
  return Math.max(0, Math.round((state.typed.length / 5) / minutes));
}
function computeAccuracy() {
  if (state.typed.length === 0) return 100;
  let correct = 0;
  for (let i = 0; i < state.typed.length; i++) {
    if (state.typed[i] === state.text[i]) correct++;
  }
  return Math.round((correct / state.typed.length) * 100);
}
function updateMetrics() {
  $("mWpm").textContent = computeWpm();
  $("mAcc").textContent = computeAccuracy() + "%";
  $("mErr").textContent = state.errors;
  const secs = state.startTime ? ((Date.now() - state.startTime) / 1000).toFixed(1) : "0.0";
  $("mTime").textContent = secs + "s";
}

function startTimer() { if (!state.timer) state.timer = setInterval(updateMetrics, 100); }
function stopTimer() { if (state.timer) { clearInterval(state.timer); state.timer = null; } }

// ---------- Mode switching ----------
function setMode(mode) {
  state.mode = mode;
  $("tabLessons").classList.toggle("active", mode === "lessons");
  $("tabAdventures").classList.toggle("active", mode === "adventure");
  $("stage").classList.toggle("adventure", mode === "adventure");
  if (mode === "lessons") {
    document.documentElement.style.removeProperty("--accent");
    renderLessonList();
    loadLesson(state.lessonIndex);
  } else {
    renderAdventureList();
    loadAdventure(state.advIndex);
  }
}

// ---------- Lessons flow ----------
function loadLesson(index) {
  state.mode = "lessons";
  state.lessonIndex = index;
  const lesson = LESSONS[index];
  resetTyping(lessonText(lesson));
  $("lessonTitle").textContent = lesson.title;
  $("lessonUnit").textContent = lesson.unit;
  renderLessonList();
  renderAll();
  focusInput();
}

function resetTyping(text) {
  state.text = text;
  state.typed = "";
  state.errors = 0;
  state.startTime = null;
  state.finished = false;
  stopTimer();
  $("tapHint").style.visibility = "visible";
  $("hiddenInput").value = "";
}

function renderAll() {
  renderTypingBox();
  renderKeyboard();
  updateMetrics();
}

function starsFor(wpm, acc) {
  if (acc >= 97 && wpm >= 30) return 3;
  if (acc >= 90 && wpm >= 18) return 2;
  return 1;
}

function finishLesson() {
  state.finished = true;
  stopTimer();
  const wpm = computeWpm();
  const acc = computeAccuracy();
  const stars = starsFor(wpm, acc);
  const lesson = LESSONS[state.lessonIndex];
  const prev = progress[lesson.id];
  if (!prev || stars > prev.stars || wpm > prev.wpm) {
    progress[lesson.id] = {
      stars: Math.max(stars, prev?.stars || 0),
      wpm: Math.max(wpm, prev?.wpm || 0),
      acc: Math.max(acc, prev?.acc || 0),
    };
    saveProgress();
  }
  renderLessonList();
  showResult({
    win: false,
    title: "Lesson complete!",
    emoji: "",
    stars,
    wpm,
    acc,
    nextLabel: "Next lesson →",
  });
}

// ---------- Adventure flow ----------
function loadAdventure(index) {
  state.mode = "adventure";
  state.advIndex = index;
  state.stageIndex = 0;
  const adv = ADVENTURES[index];
  $("stageBg").style.backgroundImage = `url("${adv.bg}")`;
  document.documentElement.style.setProperty("--accent", adv.accent);
  $("lessonTitle").textContent = adv.title;
  $("lessonUnit").textContent = adv.intro;
  $("advGoalEmoji").textContent = adv.emoji;
  $("advGoalLabel").textContent = adv.goalLabel;
  renderAdventureList();
  loadStage();
  focusInput();
}

function loadStage() {
  const adv = ADVENTURES[state.advIndex];
  const stage = adv.stages[state.stageIndex];
  resetTyping(stage.type);
  const total = adv.stages.length;
  $("advStageCount").textContent = `Stage ${state.stageIndex + 1} / ${total}`;
  const remaining = (total - state.stageIndex) / total;
  $("advHealthFill").style.width = (remaining * 100) + "%";
  $("advSay").textContent = stage.say;
  renderAll();
}

function finishStage() {
  state.finished = true;
  stopTimer();
  const adv = ADVENTURES[state.advIndex];
  const total = adv.stages.length;
  // Deplete the enemy health by one stage.
  const remaining = (total - (state.stageIndex + 1)) / total;
  $("advHealthFill").style.width = (remaining * 100) + "%";
  // Shake feedback.
  $("stage").classList.add("hit");
  setTimeout(() => $("stage").classList.remove("hit"), 320);

  if (state.stageIndex + 1 >= total) {
    // Adventure cleared.
    const wpm = computeWpm();
    const acc = computeAccuracy();
    advProgress[adv.id] = { cleared: true, bestWpm: Math.max(wpm, advProgress[adv.id]?.bestWpm || 0) };
    saveAdvProgress();
    renderAdventureList();
    setTimeout(() => showResult({
      win: true,
      title: "Quest Complete!",
      emoji: adv.emoji,
      message: adv.winText,
      wpm,
      acc,
      nextLabel: "Next quest →",
    }), 350);
  } else {
    // Advance to next stage after a short beat.
    setTimeout(() => { state.stageIndex++; loadStage(); focusInput(); }, 500);
  }
}

// ---------- Result overlay ----------
function showResult({ win, title, emoji, message, stars, wpm, acc, nextLabel }) {
  const card = document.querySelector(".result-card");
  card.classList.toggle("win", !!win);
  $("resTitle").textContent = title;
  if (win) {
    $("resStars").innerHTML = `<div class="result-win-emoji">${emoji}</div>${message || ""}`;
  } else {
    $("resStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  }
  $("resWpm").textContent = wpm;
  $("resAcc").textContent = acc + "%";
  $("resNext").textContent = nextLabel;
  $("overlay").classList.add("show");
}

// ---------- Char handling ----------
function handleChar(char) {
  if (state.finished) return;
  if (!state.startTime) { state.startTime = Date.now(); startTimer(); }
  $("tapHint").style.visibility = "hidden";

  const expected = state.text[state.typed.length];
  if (char !== expected) state.errors++;
  state.typed += char;

  renderAll();

  if (state.typed.length >= state.text.length) {
    if (state.mode === "adventure") finishStage();
    else finishLesson();
  }
}

function handleBackspace() {
  if (state.finished || state.typed.length === 0) return;
  state.typed = state.typed.slice(0, -1);
  renderAll();
}

// ---------- Input ----------
function focusInput() { $("hiddenInput").focus(); }
$("typingBox").addEventListener("click", focusInput);
$("stage").addEventListener("click", focusInput);

$("hiddenInput").addEventListener("keydown", (e) => {
  if (e.key === "Backspace") { e.preventDefault(); handleBackspace(); return; }
  if (e.key === "Enter") { e.preventDefault(); return; }
  if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    flashKey(e.key);
    handleChar(e.key);
  }
});

function flashKey(char) {
  const sel = char === " " ? ".key.space" : `.key[data-key="${cssEscape(char.toLowerCase())}"]`;
  const el = document.querySelector(sel);
  if (!el) return;
  el.classList.add("pressed");
  setTimeout(() => el.classList.remove("pressed"), 90);
}
function cssEscape(s) { return s.replace(/["\\]/g, "\\$&"); }

// ---------- Buttons ----------
$("tabLessons").addEventListener("click", () => setMode("lessons"));
$("tabAdventures").addEventListener("click", () => setMode("adventure"));

$("restartBtn").addEventListener("click", () => {
  if (state.mode === "adventure") loadAdventure(state.advIndex);
  else loadLesson(state.lessonIndex);
});

$("resRetry").addEventListener("click", () => {
  $("overlay").classList.remove("show");
  if (state.mode === "adventure") loadAdventure(state.advIndex);
  else loadLesson(state.lessonIndex);
});
$("resNext").addEventListener("click", () => {
  $("overlay").classList.remove("show");
  if (state.mode === "adventure") {
    loadAdventure(Math.min(state.advIndex + 1, ADVENTURES.length - 1));
  } else {
    loadLesson(Math.min(state.lessonIndex + 1, LESSONS.length - 1));
  }
});
$("resetBtn").addEventListener("click", () => {
  if (confirm("Clear all saved progress?")) {
    progress = {}; advProgress = {};
    saveProgress(); saveAdvProgress();
    setMode(state.mode);
  }
});
$("themeBtn").addEventListener("click", () => {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("swiftkeys.theme", next);
  $("themeBtn").textContent = next === "light" ? "☀️ Theme" : "🌙 Theme";
});

// ---------- Boot ----------
(function init() {
  const savedTheme = localStorage.getItem("swiftkeys.theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    $("themeBtn").textContent = savedTheme === "light" ? "☀️ Theme" : "🌙 Theme";
  }
  let start = LESSONS.findIndex((l) => !progress[l.id]);
  if (start < 0) start = 0;
  state.lessonIndex = start;
  const wantsAdventure = location.hash.toLowerCase().startsWith("#adventure");
  setMode(wantsAdventure ? "adventure" : "lessons");
})();
