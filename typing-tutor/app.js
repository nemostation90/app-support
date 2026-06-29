import { LESSONS, FINGER_MAP, KEYBOARD_ROWS } from "./lessons.js";

const STORE_KEY = "swiftkeys.progress.v1";
const $ = (id) => document.getElementById(id);

const state = {
  lessonIndex: 0,
  text: "",
  typed: "",
  errors: 0,
  startTime: null,
  finished: false,
  timer: null,
};

// ---------- Progress persistence ----------
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) {
  localStorage.setItem(STORE_KEY, JSON.stringify(p));
}
let progress = loadProgress();

// ---------- Lesson text ----------
function lessonText(lesson) {
  return lesson.lines.join(" ");
}

// ---------- Rendering ----------
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
    item.className = "lesson-item" + (i === state.lessonIndex ? " active" : "");
    const rec = progress[lesson.id];
    if (rec) item.classList.add("done");
    const stars = rec ? "★".repeat(rec.stars) + "☆".repeat(3 - rec.stars) : "";
    item.innerHTML = `<span class="title">${lesson.title}</span><span class="stars">${stars}</span>`;
    item.addEventListener("click", () => loadLesson(i));
    list.appendChild(item);
  });
}

function renderTypingBox() {
  const box = $("typingBox");
  box.innerHTML = "";
  const pos = state.typed.length;
  for (let i = 0; i < state.text.length; i++) {
    const ch = state.text[i];
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00B7" : ch; // visible middot for space
    if (ch === " ") span.classList.add("space");

    if (i < pos) {
      span.classList.add(state.typed[i] === ch ? "correct" : "incorrect");
      if (ch === " ") span.textContent = "\u00B7";
    } else if (i === pos) {
      span.classList.add("current");
      span.textContent = ch === " " ? "\u00B7" : ch;
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
      if (key === nextLower || (key === " " && nextChar === " ")) {
        k.classList.add("next");
      }
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
  const words = state.typed.length / 5;
  return Math.max(0, Math.round(words / minutes));
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

// ---------- Game flow ----------
function loadLesson(index) {
  state.lessonIndex = index;
  const lesson = LESSONS[index];
  state.text = lessonText(lesson);
  state.typed = "";
  state.errors = 0;
  state.startTime = null;
  state.finished = false;
  stopTimer();
  $("lessonTitle").textContent = lesson.title;
  $("lessonUnit").textContent = lesson.unit;
  $("tapHint").style.visibility = "visible";
  renderLessonList();
  renderTypingBox();
  renderKeyboard();
  updateMetrics();
  $("hiddenInput").value = "";
  focusInput();
}

function startTimer() {
  if (state.timer) return;
  state.timer = setInterval(updateMetrics, 100);
}
function stopTimer() {
  if (state.timer) { clearInterval(state.timer); state.timer = null; }
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
    saveProgress(progress);
  }
  renderLessonList();
  $("resStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  $("resWpm").textContent = wpm;
  $("resAcc").textContent = acc + "%";
  $("overlay").classList.add("show");
}

function handleChar(char) {
  if (state.finished) return;
  if (!state.startTime) { state.startTime = Date.now(); startTimer(); }
  $("tapHint").style.visibility = "hidden";

  const expected = state.text[state.typed.length];
  if (char !== expected) state.errors++;
  state.typed += char;

  renderTypingBox();
  renderKeyboard();
  updateMetrics();

  if (state.typed.length >= state.text.length) finishLesson();
}

function handleBackspace() {
  if (state.finished || state.typed.length === 0) return;
  state.typed = state.typed.slice(0, -1);
  renderTypingBox();
  renderKeyboard();
  updateMetrics();
}

// ---------- Input handling ----------
function focusInput() { $("hiddenInput").focus(); }

$("typingBox").addEventListener("click", focusInput);

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
  const lower = char.toLowerCase();
  const sel = char === " " ? '.key.space' : `.key[data-key="${cssEscape(lower)}"]`;
  const el = document.querySelector(sel);
  if (!el) return;
  el.classList.add("pressed");
  setTimeout(() => el.classList.remove("pressed"), 90);
}
function cssEscape(s) {
  return s.replace(/["\\]/g, "\\$&");
}

// ---------- Buttons ----------
$("restartBtn").addEventListener("click", () => loadLesson(state.lessonIndex));
$("resRetry").addEventListener("click", () => { $("overlay").classList.remove("show"); loadLesson(state.lessonIndex); });
$("resNext").addEventListener("click", () => {
  $("overlay").classList.remove("show");
  const next = Math.min(state.lessonIndex + 1, LESSONS.length - 1);
  loadLesson(next);
});
$("resetBtn").addEventListener("click", () => {
  if (confirm("Clear all saved progress?")) {
    progress = {};
    saveProgress(progress);
    loadLesson(0);
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
  // First unfinished lesson, else first.
  let start = LESSONS.findIndex((l) => !progress[l.id]);
  if (start < 0) start = 0;
  loadLesson(start);
})();
