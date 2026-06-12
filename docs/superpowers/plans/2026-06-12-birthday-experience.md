# Birthday Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the valentine site into a six-act, config-driven birthday experience for Nelson Chukwuebuka (countdown → trick question → letter → photo memory lane → cake finale with blow detection).

**Architecture:** Zero-dependency vanilla HTML/CSS/JS, no build step. All personal content in `config.js`. Six full-viewport `<section>`s cross-faded by the existing `showSection()` pattern. New modules in `script.js`: countdown, photo preloader/memory lane, cake + blow detection, fireworks.

**Tech Stack:** HTML5, CSS3 (animations), vanilla ES2017+ JS, Web Audio API (mic), `python3 -m http.server` for local serving.

**Testing approach (deliberate deviation from TDD):** static site, no test framework, hard deadline (June 13). Every task ends with a verification step giving the exact URL/action and the exact expected result. Run them in a real browser or via Playwright. The `?demo=before` / `?demo=after` URL switches make both date paths testable.

**Spec:** `docs/superpowers/specs/2026-06-12-birthday-experience-design.md`

---

### Task 1: Branch, config.js, placeholder photos

**Files:**
- Create: `config.js`
- Create: `photos/01.svg`, `photos/02.svg`, `photos/03.svg`

- [ ] **Step 1: Create branch**

```bash
git checkout -b birthday-experience
```

- [ ] **Step 2: Write `config.js`**

```js
/* ============================================================
   ALL personal content lives in this file.
   To customize for a new client:
     1. Edit the values below.
     2. Replace the images in photos/ (3-8 photos, each <500KB,
        portrait or square crops look best) and update `photos`.
   ============================================================ */
const CONFIG = {
  recipientName: "Nelson",
  recipientFullName: "Nelson Chukwuebuka",

  // The client's sign-off, shown at the very end. e.g. "— Ada ❤️"
  senderName: "— With all my love ❤️",

  // Local midnight of this date gates the countdown (YYYY-MM-DD).
  birthdayDate: "2026-06-13",

  question: {
    prompt: "Do you know how much you mean to me?",
    choices: ["A little?", "A lot?"],
    revealLines: [
      "Wrong answer.",
      "The correct answer is...",
      "More than yesterday.",
      "Less than tomorrow.",
    ],
  },

  letterParagraphs: [
    "Happy Birthday, my love 🎂",
    "Today the world received its sweetest gift — you. And every day since you came into my life, I've been unwrapping that gift slowly: your laugh, your kindness, the way you make ordinary days feel warm.",
    "I hope this new year of your life is gentle with you and generous to you. I hope it gives you everything you quietly wish for.",
    "But before you make your wish… let me take you back through a few of my favourite moments of us.",
  ],

  photos: [
    { src: "photos/01.svg", caption: "Where it all began…" },
    { src: "photos/02.svg", caption: "The day I knew you were special." },
    { src: "photos/03.svg", caption: "And every day since — my favourite person." },
  ],

  music: { src: "piano.mp3", volume: 0.4 },
};
```

- [ ] **Step 3: Write the three placeholder SVGs**

`photos/01.svg` (repeat for `02.svg` / `03.svg`, changing the text to "Photo 2" / "Photo 3"):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700">
  <rect width="600" height="700" fill="#1d1a2b"/>
  <text x="300" y="360" fill="#d4af37" font-family="Georgia" font-size="40" text-anchor="middle">Photo 1</text>
</svg>
```

- [ ] **Step 4: Verify config parses**

Run: `node -e "eval(require('fs').readFileSync('config.js','utf8')); console.log(CONFIG.recipientFullName, CONFIG.photos.length)"`
Expected: `Nelson Chukwuebuka 3`
(If node is unavailable: open the browser console on any page that loads config.js and check `CONFIG`.)

- [ ] **Step 5: Commit**

```bash
git add config.js photos/
git commit -m "feat: add config-driven content and placeholder photos"
```

---

### Task 2: index.html — six-act skeleton

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Rewrite `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>For You 🎂</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="celebration"></div>

<!-- ACT 1: INTRO -->
<section class="active" id="intro">
  <div class="content">
    <h1>Before you continue…</h1>
    <p>Find somewhere quiet.</p>
    <p class="note">Turn your volume up or use earphones 🎧</p>
    <button id="startBtn">Begin</button>
  </div>
</section>

<!-- ACT 2: COUNTDOWN (conditional) -->
<section id="countdown">
  <div class="content">
    <p class="label-line">Something is waiting for you…</p>
    <div class="timer">
      <div class="unit"><span id="cdDays">--</span><label>days</label></div>
      <div class="unit"><span id="cdHours">--</span><label>hours</label></div>
      <div class="unit"><span id="cdMins">--</span><label>minutes</label></div>
      <div class="unit"><span id="cdSecs">--</span><label>seconds</label></div>
    </div>
  </div>
</section>

<!-- ACT 3: QUESTION -->
<section id="question">
  <div class="content">
    <h2 id="questionText"></h2>
    <div class="choices hidden" id="choices"></div>
  </div>
</section>

<!-- ACT 4: LETTER -->
<section id="letter">
  <div class="content">
    <div id="typewriter"></div>
    <p class="continue-hint hidden" id="letterNext">tap to continue ›</p>
  </div>
</section>

<!-- ACT 5: MEMORIES -->
<section id="memories">
  <div class="content">
    <div class="polaroid">
      <img id="memoryPhoto" alt="A memory of us">
      <div class="polaroid-caption" id="memoryCaption"></div>
    </div>
    <p class="continue-hint hidden" id="memoryNext">tap to continue ›</p>
  </div>
</section>

<!-- ACT 6: CAKE -->
<section id="cake">
  <div class="content">
    <h2 id="wishLine"></h2>
    <div class="cake-wrap" id="cakeEl">
      <div class="candles" id="candles"></div>
      <div class="cake-layer top"></div>
      <div class="cake-layer mid"></div>
      <div class="cake-layer base"></div>
      <div class="cake-plate"></div>
    </div>
    <p class="continue-hint hidden" id="blowHint">blow into your phone… or tap the flames 🕯️</p>
    <div class="finale hidden" id="finale">
      <h1 id="finaleTitle"></h1>
      <div class="signature" id="signature"></div>
    </div>
  </div>
</section>

<audio id="bgMusic" loop></audio>

<script src="config.js"></script>
<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Start the dev server (leave running for all later tasks)**

Run (background): `python3 -m http.server 8080`

- [ ] **Step 3: Verify structure**

Run: `curl -s http://localhost:8080/index.html | grep -c '<section'`
Expected: `6`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: six-act page skeleton"
```

---

### Task 3: style.css — Midnight Gold theme

**Files:**
- Modify: `style.css` (full rewrite)

- [ ] **Step 1: Rewrite `style.css`**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold: #d4af37;
  --gold-soft: #f5e6a8;
  --cream: #f0e6d2;
  --bg-deep: #0a0a14;
  --bg-plum: #141024;
}

body {
  background: linear-gradient(165deg, var(--bg-deep) 0%, var(--bg-plum) 100%);
  min-height: 100vh;
  color: var(--cream);
  font-family: Georgia, "Times New Roman", serif;
  overflow: hidden;
}

body::before {
  content: "";
  position: fixed; inset: 0;
  background: radial-gradient(circle at 50% 30%, rgba(212,175,55,0.07) 0%, transparent 65%);
  pointer-events: none;
  z-index: 1;
}

section {
  position: absolute; inset: 0;
  height: 100vh; height: 100dvh;
  display: flex; justify-content: center; align-items: center;
  text-align: center; padding: 24px;
  opacity: 0; pointer-events: none;
  transition: opacity 1.5s ease;
}
section.active { opacity: 1; pointer-events: auto; z-index: 2; }

.content { max-width: 700px; width: 100%; }

h1, h2 { font-size: 1.9rem; margin-bottom: 20px; letter-spacing: 1px; font-weight: normal; }
.note { font-size: .9rem; opacity: .7; margin-top: 8px; }

button {
  margin-top: 25px; padding: 12px 34px;
  border: 1px solid var(--gold); background: transparent;
  color: var(--gold); font-size: 1rem; font-family: inherit;
  cursor: pointer; transition: .4s ease;
}
button:hover {
  background: var(--gold); color: var(--bg-deep);
  box-shadow: 0 0 25px rgba(212,175,55,.45);
  transform: translateY(-3px);
}

.hidden { display: none !important; }

/* COUNTDOWN */
.label-line { font-style: italic; opacity: .75; margin-bottom: 28px; letter-spacing: 1px; }
.timer { display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; }
.unit span {
  display: block; font-size: 2.6rem; color: var(--gold);
  text-shadow: 0 0 18px rgba(212,175,55,.4);
  min-width: 70px; font-variant-numeric: tabular-nums;
}
.unit label { font-size: .7rem; letter-spacing: 3px; text-transform: uppercase; opacity: .6; }

/* QUESTION */
.choices { margin-top: 30px; display: flex; gap: 20px; justify-content: center; }

/* TYPEWRITER + LETTER */
#typewriter { font-size: 1.3rem; line-height: 1.8; min-height: 200px; white-space: pre-line; }
#letter .content { max-height: 88dvh; overflow-y: auto; }
.cursor {
  display: inline-block; width: 2px; background: var(--gold);
  animation: blink 1s infinite; margin-left: 3px;
}
@keyframes blink { 0%,100% { opacity: 0; } 50% { opacity: 1; } }

.continue-hint {
  margin-top: 30px; font-size: .85rem; color: var(--gold);
  opacity: .8; animation: pulse 2s infinite; cursor: pointer;
}
@keyframes pulse { 0%,100% { opacity: .35; } 50% { opacity: .9; } }

/* MEMORIES */
.polaroid {
  background: #faf6ee; padding: 14px 14px 18px; margin: 0 auto;
  width: min(78vw, 330px); transform: rotate(-2deg);
  box-shadow: 0 12px 40px rgba(0,0,0,.5);
  transition: transform .6s ease;
}
.polaroid img { width: 100%; height: min(58vw, 300px); object-fit: cover; display: block; }
.polaroid-caption {
  color: #3a3326; font-size: 1rem; margin-top: 12px;
  min-height: 3.2em; font-style: italic;
}

/* CAKE */
.cake-wrap { position: relative; width: 240px; margin: 36px auto 0; }
.cake-layer { margin: 0 auto; border-radius: 8px 8px 4px 4px; position: relative; }
.cake-layer.top  { width: 130px; height: 42px; background: linear-gradient(#4a3960, #38294b); }
.cake-layer.mid  { width: 180px; height: 48px; background: linear-gradient(#3c2d50, #2c1f3b); }
.cake-layer.base { width: 230px; height: 54px; background: linear-gradient(#32254a, #241a35); }
.cake-layer::after {  /* gold icing line */
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 7px;
  background: linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold));
  border-radius: 8px 8px 50% 50%;
}
.cake-plate { width: 260px; height: 12px; margin: 0 auto; background: #1f1b30; border-radius: 50%; }

.candles { display: flex; justify-content: center; gap: 18px; height: 70px; align-items: flex-end; }
.candle {
  width: 9px; height: 46px; position: relative; cursor: pointer;
  background: repeating-linear-gradient(45deg, #f5e6c8 0 6px, #e8c98a 6px 12px);
  border-radius: 3px 3px 0 0;
}
.flame {
  position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
  width: 13px; height: 18px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: radial-gradient(circle at 50% 70%, #fff7d6 0%, #f5a623 55%, rgba(245,166,35,0) 100%);
  box-shadow: 0 0 16px 4px rgba(245,200,80,.45);
  animation: flicker .28s infinite alternate;
}
@keyframes flicker {
  from { transform: translateX(-50%) scale(1) rotate(-2deg); }
  to   { transform: translateX(-52%) scale(1.12) rotate(3deg); }
}
.flame.out { animation: none; opacity: 0; transition: opacity .4s; box-shadow: none; }

/* FINALE */
.finale { margin-top: 34px; transition: opacity 2s ease; }
.finale.show { opacity: 1; }
#finaleTitle {
  background: linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.signature { margin-top: 16px; font-size: 1rem; opacity: 0; transition: opacity 2.5s ease; }
.signature.show { opacity: 1; }

/* CELEBRATION LAYER */
#celebration {
  position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 5;
}
.confetti {
  position: absolute; top: -20px; width: 8px; height: 14px;
  background: var(--gold); opacity: .9;
  animation: confettiFall linear forwards;
}
@keyframes confettiFall {
  to { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}
.spark {
  position: absolute; bottom: -10px; width: 4px; height: 4px; border-radius: 50%;
  background: var(--gold-soft); box-shadow: 0 0 8px 2px rgba(212,175,55,.5);
  animation: sparkRise ease-in forwards;
}
@keyframes sparkRise {
  to { transform: translateY(-110vh); opacity: 0; }
}
.spark-fly {
  position: absolute; width: 5px; height: 5px; border-radius: 50%;
  background: var(--gold-soft); box-shadow: 0 0 10px 2px rgba(212,175,55,.6);
  animation: sparkFly 1.3s ease-out forwards;
}
@keyframes sparkFly {
  to { transform: translate(var(--dx), var(--dy)); opacity: 0; }
}

@media (max-width: 480px) {
  h1, h2 { font-size: 1.5rem; }
  #typewriter { font-size: 1.1rem; }
  .unit span { font-size: 2rem; min-width: 54px; }
}
```

- [ ] **Step 2: Verify visually**

Open `http://localhost:8080` — expected: midnight blue-black gradient page, cream serif "Before you continue…" heading, gold-bordered **Begin** button that fills gold on hover. (Button does nothing yet — script.js is still the valentine version.)

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: Midnight Gold theme"
```

---

### Task 4: script.js core — flow control, question, letter

**Files:**
- Modify: `script.js` (full rewrite; keeps `typeText`/`showSection`/`fadeInMusic` design from the valentine version)

- [ ] **Step 1: Rewrite `script.js`**

```js
/* ---------------- CONFIG ---------------- */
const cfg = window.CONFIG || {};

/* ---------------- ELEMENTS ---------------- */
const sections = {
  intro: document.getElementById("intro"),
  countdown: document.getElementById("countdown"),
  question: document.getElementById("question"),
  letter: document.getElementById("letter"),
  memories: document.getElementById("memories"),
  cake: document.getElementById("cake"),
};
const startBtn = document.getElementById("startBtn");
const questionText = document.getElementById("questionText");
const choicesBox = document.getElementById("choices");
const typewriter = document.getElementById("typewriter");
const letterNext = document.getElementById("letterNext");
const bgMusic = document.getElementById("bgMusic");
const celebration = document.getElementById("celebration");

/* ---------------- HELPERS ---------------- */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function showSection(section) {
  Object.values(sections).forEach(s => s.classList.remove("active"));
  section.classList.add("active");
}

function waitForTap(el) {
  return new Promise(r => el.addEventListener("click", r, { once: true }));
}

function typeText(element, text, speed = 70) {
  return new Promise(resolve => {
    element.innerHTML = "";
    let i = 0;
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    element.appendChild(cursor);
    (function typing() {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(typing, speed);
      } else {
        cursor.remove();
        resolve();
      }
    })();
  });
}

/* ---------------- MUSIC ---------------- */
function fadeInMusic() {
  try {
    if (!bgMusic.src) bgMusic.src = (cfg.music && cfg.music.src) || "piano.mp3";
    const target = (cfg.music && cfg.music.volume) || 0.4;
    bgMusic.volume = 0;
    const p = bgMusic.play();
    if (p && p.catch) p.catch(() => {});   // audio blocked — continue silently
    const fade = setInterval(() => {
      if (bgMusic.volume < target - 0.02) bgMusic.volume += 0.02;
      else { bgMusic.volume = target; clearInterval(fade); }
    }, 200);
  } catch (e) { /* never let audio kill the experience */ }
}

/* ---------------- CELEBRATION ---------------- */
function burstConfetti(count = 40) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    if (Math.random() < 0.4) c.style.background = "#f5e6a8";
    celebration.appendChild(c);
    setTimeout(() => c.remove(), 6500);
  }
}

/* ---------------- DEMO SWITCHES + COUNTDOWN GATE ---------------- */
const demo = new URLSearchParams(location.search).get("demo"); // "before"|"after"|null

let demoTarget = null; // fixed once so the 10s demo countdown doesn't drift
function countdownTarget() {
  if (demo === "after") return null;
  if (demo === "before") {
    if (!demoTarget) demoTarget = new Date(Date.now() + 10000);
    return demoTarget;
  }
  try {
    const t = new Date(cfg.birthdayDate + "T00:00:00");
    return isNaN(t.getTime()) ? null : t;
  } catch (e) { return null; }
}

function shouldShowCountdown() {
  const t = countdownTarget();
  return !!t && Date.now() < t.getTime();
}

/* ---------------- ACT 3: QUESTION ---------------- */
async function startQuestion() {
  showSection(sections.question);
  await delay(600);
  const q = cfg.question || {};
  await typeText(questionText, q.prompt || "Do you know how much you mean to me?");

  choicesBox.innerHTML = "";
  (q.choices || ["A little?", "A lot?"]).forEach(label => {
    const b = document.createElement("button");
    b.textContent = label;
    b.addEventListener("click", onChoice, { once: true });
    choicesBox.appendChild(b);
  });
  choicesBox.classList.remove("hidden");
}

async function onChoice() {
  choicesBox.classList.add("hidden");
  const lines = (cfg.question && cfg.question.revealLines) || [];
  for (const line of lines) {
    await typeText(questionText, line, 70);
    await delay(line.endsWith("...") ? 2400 : 1100);
  }
  await delay(900);
  startLetter();
}

/* ---------------- ACT 4: LETTER ---------------- */
async function startLetter() {
  showSection(sections.letter);
  await delay(400);
  fadeInMusic();
  const paragraphs = cfg.letterParagraphs || [];
  for (let i = 0; i < paragraphs.length; i++) {
    const p = document.createElement("div");
    typewriter.appendChild(p);
    await typeText(p, paragraphs[i], 65);
    if (i === 0) burstConfetti();
    await delay(1100);
  }
  letterNext.classList.remove("hidden");
  await waitForTap(sections.letter);
  letterNext.classList.add("hidden");
  startMemories();
}

/* ---------------- ACT 5 STUB (replaced in Task 6) ---------------- */
function startMemories() {
  console.log("memories: not built yet (Task 6)");
}

/* ---------------- FLOW START ---------------- */
startBtn.addEventListener("click", () => {
  // priming play() inside the tap unlocks audio for later;
  // src must be set first or play() rejects without unlocking
  try {
    bgMusic.src = (cfg.music && cfg.music.src) || "piano.mp3";
    bgMusic.volume = 0;
    const p = bgMusic.play();
    if (p && p.then) p.then(() => bgMusic.pause()).catch(() => {});
  } catch (e) {}
  if (shouldShowCountdown()) {
    startCountdown(); // defined in Task 5
  } else {
    startQuestion();
  }
}, { once: true });

/* ---------------- ACT 2 STUB (replaced in Task 5) ---------------- */
function startCountdown() {
  console.log("countdown: not built yet (Task 5)");
  startQuestion();
}
```

- [ ] **Step 2: Verify the after-birthday path**

Open `http://localhost:8080/?demo=after` → click **Begin**.
Expected: question types out → two gold buttons appear → click either → "Wrong answer." → … → "Less than tomorrow." → letter section fades in, paragraphs type out one by one, gold confetti falls on the first paragraph, piano fades in → "tap to continue ›" pulses → tapping logs `memories: not built yet (Task 6)` in console.

- [ ] **Step 3: Verify the before-birthday gate**

Open `http://localhost:8080/?demo=before` → click **Begin**.
Expected: console logs `countdown: not built yet (Task 5)` and the question starts (stub passthrough).

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: core flow - intro, trick question, typed letter with music and confetti"
```

---

### Task 5: Countdown act + ambient sparks

**Files:**
- Modify: `script.js` — replace the `startCountdown` stub from Task 4

- [ ] **Step 1: Replace the Task 4 `startCountdown` stub with the real module**

Delete the stub at the bottom of `script.js` and add:

```js
/* ---------------- ACT 2: COUNTDOWN ---------------- */
const cdEls = {
  d: document.getElementById("cdDays"),
  h: document.getElementById("cdHours"),
  m: document.getElementById("cdMins"),
  s: document.getElementById("cdSecs"),
};

function startCountdown() {
  showSection(sections.countdown);
  const sparkTimer = setInterval(spawnSpark, 350);
  let iv = null;
  let finished = false;

  const tick = () => {
    if (finished) return;
    const t = countdownTarget();
    const ms = t ? t.getTime() - Date.now() : 0;
    if (ms <= 0) {
      finished = true;
      if (iv) clearInterval(iv);
      clearInterval(sparkTimer);
      burstConfetti(25);
      startQuestion();
      return;
    }
    const total = Math.floor(ms / 1000);
    cdEls.d.textContent = String(Math.floor(total / 86400)).padStart(2, "0");
    cdEls.h.textContent = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
    cdEls.m.textContent = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    cdEls.s.textContent = String(total % 60).padStart(2, "0");
  };
  tick();
  if (!finished) iv = setInterval(tick, 250);
}

function spawnSpark() {
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = Math.random() * 100 + "vw";
  s.style.animationDuration = 4 + Math.random() * 4 + "s";
  celebration.appendChild(s);
  setTimeout(() => s.remove(), 8500);
}
```

- [ ] **Step 2: Verify the demo countdown**

Open `http://localhost:8080/?demo=before` → click **Begin**.
Expected: countdown section shows `00 : 00 : 00 : 10` ticking down with gold sparks drifting upward; at zero, a small confetti burst and the question begins automatically.

- [ ] **Step 3: Verify the real date gate (no demo param)**

Open `http://localhost:8080` → click **Begin**.
Expected on June 12: real countdown to local midnight June 13 (hours/minutes match the actual time remaining). Expected June 13 or later: countdown skipped, question starts directly.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: conditional midnight countdown with gold sparks"
```

---

### Task 6: Memory lane

**Files:**
- Modify: `script.js` — add preloader near the top (after helpers), replace the `startMemories` stub

- [ ] **Step 1: Add the photo preloader after the helpers section**

```js
/* ---------------- PHOTO PRELOAD (starts immediately) ---------------- */
const photoStates = (cfg.photos || []).map(p => ({
  src: p.src,
  caption: p.caption || "",
  loaded: new Promise(res => {
    const img = new Image();
    img.onload = () => res(true);
    img.onerror = () => res(false);
    img.src = p.src;
  }),
}));
```

- [ ] **Step 2: Replace the `startMemories` stub**

```js
/* ---------------- ACT 5: MEMORY LANE ---------------- */
const memoryPhoto = document.getElementById("memoryPhoto");
const memoryCaption = document.getElementById("memoryCaption");
const memoryNext = document.getElementById("memoryNext");
const polaroid = document.querySelector(".polaroid");

async function startMemories() {
  showSection(sections.memories);
  await delay(600);
  for (const photo of photoStates) {
    const ok = await photo.loaded;
    if (!ok) continue;                       // broken image: skip chapter silently
    polaroid.style.transform = `rotate(${(Math.random() * 6 - 3).toFixed(1)}deg)`;
    memoryPhoto.src = photo.src;
    memoryCaption.textContent = "";
    await delay(500);
    await typeText(memoryCaption, photo.caption, 55);
    memoryNext.classList.remove("hidden");
    await waitForTap(sections.memories);
    memoryNext.classList.add("hidden");
  }
  startCake();
}

/* ---------------- ACT 6 STUB (replaced in Task 7) ---------------- */
function startCake() {
  console.log("cake: not built yet (Task 7)");
}
```

- [ ] **Step 3: Verify the chapter flow**

Open `http://localhost:8080/?demo=after`, click through question + letter, tap continue.
Expected: polaroid with "Photo 1" placeholder at a slight random tilt, caption "Where it all began…" types out, hint appears; tap → Photo 2 → Photo 3 → console logs `cake: not built yet (Task 7)`.

- [ ] **Step 4: Verify broken-photo skip**

Temporarily change `photos[1].src` in `config.js` to `photos/nope.jpg`, reload, click through.
Expected: chapters show Photo 1 then Photo 3 — no broken-image chapter, no error visible. **Revert config.js afterwards.**

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: polaroid memory lane with preloading and broken-photo skip"
```

---

### Task 7: Cake finale — candles, tap-to-blow, fireworks

**Files:**
- Modify: `script.js` — replace the `startCake` stub

- [ ] **Step 1: Replace the `startCake` stub**

```js
/* ---------------- ACT 6: CAKE FINALE ---------------- */
const wishLine = document.getElementById("wishLine");
const candlesBox = document.getElementById("candles");
const blowHint = document.getElementById("blowHint");
const finale = document.getElementById("finale");
const finaleTitle = document.getElementById("finaleTitle");
const signature = document.getElementById("signature");

let candlesLeft = 0;
let cakeDone = false;

async function startCake() {
  showSection(sections.cake);
  buildCandles(5);
  await delay(600);
  await typeText(wishLine, `Make a wish, ${cfg.recipientName || "love"}… then blow.`, 60);
  blowHint.classList.remove("hidden");
  tryMicBlow(); // Task 8 — until then taps do the work
}

function buildCandles(n) {
  candlesBox.innerHTML = "";
  candlesLeft = n;
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    const f = document.createElement("div");
    f.className = "flame";
    c.appendChild(f);
    c.addEventListener("click", () => extinguish(f));
    candlesBox.appendChild(c);
  }
}

function extinguish(flame) {
  if (cakeDone || flame.classList.contains("out")) return;
  flame.classList.add("out");
  candlesLeft--;
  if (candlesLeft <= 0) runFinale();
}

function extinguishNext() {
  const lit = candlesBox.querySelector(".flame:not(.out)");
  if (lit) extinguish(lit);
}

async function runFinale() {
  cakeDone = true;
  blowHint.classList.add("hidden");
  await delay(700);
  fireworks();
  burstConfetti(80);
  finale.classList.remove("hidden");
  finaleTitle.textContent = `Happy Birthday, ${cfg.recipientFullName || cfg.recipientName} 🎂`;
  await delay(1800);
  signature.textContent = cfg.senderName || "";
  signature.classList.add("show");
}

function fireworks() {
  for (let burst = 0; burst < 5; burst++) {
    setTimeout(() => {
      const cx = 15 + Math.random() * 70;
      const cy = 12 + Math.random() * 40;
      for (let i = 0; i < 24; i++) {
        const p = document.createElement("div");
        p.className = "spark-fly";
        const ang = (i / 24) * Math.PI * 2;
        const dist = 60 + Math.random() * 90;
        p.style.left = cx + "vw";
        p.style.top = cy + "vh";
        p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        p.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        celebration.appendChild(p);
        setTimeout(() => p.remove(), 1400);
      }
    }, burst * 550);
  }
}

/* ---------------- MIC STUB (replaced in Task 8) ---------------- */
function tryMicBlow() {}
```

- [ ] **Step 2: Verify the tap path end-to-end**

Open `http://localhost:8080/?demo=after`, click through all acts to the cake.
Expected: dark plum 3-layer cake with gold icing, 5 striped candles with flickering gold flames; "Make a wish, Nelson… then blow." types out; hint pulses; tapping each flame snuffs it (flame fades, stops flickering); after the 5th → fireworks bursts + heavy gold confetti + gradient-gold "Happy Birthday, Nelson Chukwuebuka 🎂" + signature fades in.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: candle cake finale with fireworks"
```

---

### Task 8: Microphone blow detection

**Files:**
- Modify: `script.js` — replace the `tryMicBlow` stub from Task 7

- [ ] **Step 1: Replace the `tryMicBlow` stub**

```js
/* ---------------- MIC BLOW DETECTION ---------------- */
async function tryMicBlow() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume().catch(() => {});
    const source = actx.createMediaStreamSource(stream);
    const analyser = actx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);

    let loudMs = 0;
    const poll = setInterval(() => {
      if (cakeDone) {
        clearInterval(poll);
        stream.getTracks().forEach(t => t.stop());
        actx.close().catch(() => {});
        return;
      }
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      if (rms > 0.16) {            // a blow is loud + sustained
        loudMs += 100;
        if (loudMs >= 300) {
          extinguishNext();
          loudMs = 0;
        }
      } else {
        loudMs = 0;
      }
    }, 100);
  } catch (e) {
    /* mic denied or unavailable — tap fallback is already active */
  }
}
```

- [ ] **Step 2: Verify the fallback (deny permission)**

Open `http://localhost:8080/?demo=after`, click through to the cake, **deny** the mic prompt.
Expected: no error anywhere; tapping flames still works; finale still fires.

- [ ] **Step 3: Verify mic detection (manual, needs a human + HTTPS or localhost)**

On localhost (a secure context), **allow** the mic and blow at the phone/laptop.
Expected: candles go out one by one (one per sustained blow); finale fires when all five are out. (Note: this step needs a real microphone — the developer does this by hand.)

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: blow out candles with real microphone, tap fallback"
```

---

### Task 9: Handover docs + full rehearsal

**Files:**
- Create: `CUSTOMIZE.md`

- [ ] **Step 1: Write `CUSTOMIZE.md`**

```markdown
# Customizing this birthday experience

All personal content lives in **`config.js`** — you never need to touch
the other files.

1. **Names** — `recipientName` (used mid-experience), `recipientFullName`
   (the finale), `senderName` (your sign-off, e.g. "— Ada ❤️").
2. **Date** — `birthdayDate` ("YYYY-MM-DD"). Opened before midnight of
   that date → live countdown. Opened on/after → countdown skipped.
3. **The trick question** — `question.prompt`, the two `question.choices`
   button labels, and the four `question.revealLines` typed after either
   choice. Make these personal to the couple.
4. **Photos** — drop 3–8 images into `photos/` (each under ~500KB;
   portrait or square crops look best) and list them in `photos` with a
   caption each. Order = story order.
5. **Letter** — `letterParagraphs`, one string per typed paragraph.
6. **Music** — replace `piano.mp3` or point `music.src` at another file.

## Rehearsing before you send it

- `index.html?demo=before` — forces a 10-second countdown.
- `index.html?demo=after` — skips the countdown.
- Test on a phone: the mic "blow out the candles" prompt needs HTTPS
  (any normal hosting is fine; plain http:// will silently fall back to
  tap-the-flames).

## Sending it

Host the folder anywhere static (GitHub Pages, Netlify, Vercel) and send
the link. To use the midnight countdown, send the link the evening before
with "open this now — trust me."
```

- [ ] **Step 2: Full rehearsal, both paths**

1. `http://localhost:8080/?demo=before` — full run: countdown 10s → question → letter+music+confetti → 3 memory chapters → cake → tap flames → finale. Expected: no console errors at any point.
2. `http://localhost:8080/?demo=after` — same minus countdown.
3. Repeat path 2 in a mobile-sized viewport (390×844). Expected: no horizontal overflow, polaroid fits, timer wraps gracefully, buttons tappable.

- [ ] **Step 3: Commit**

```bash
git add CUSTOMIZE.md
git commit -m "docs: client customization and rehearsal guide"
```

---

## Post-plan note for the developer

The placeholder SVGs and default letter text ship working out of the box — before handover, replace `photos/*.svg` with the client's real images, update captions, set `senderName`, and have the client read the letter text. That's content, not code, and is deliberately outside these tasks.
