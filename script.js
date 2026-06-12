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
  // config can disable the countdown for the plain link;
  // ?demo=before still forces it for rehearsal
  if (demo !== "before" && cfg.showCountdown === false) return false;
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

/* ---------------- ACT 5: MEMORY LANE ---------------- */
const memoryPhoto = document.getElementById("memoryPhoto");
const memoryCaption = document.getElementById("memoryCaption");
const memoryNext = document.getElementById("memoryNext");
const polaroid = document.querySelector(".polaroid");

async function startMemories() {
  showSection(sections.memories);
  polaroid.style.opacity = "0";
  await delay(600);
  for (const photo of photoStates) {
    const ok = await photo.loaded;
    if (!ok) continue;                       // broken image: skip chapter silently
    polaroid.style.opacity = "0";
    await delay(600);                        // fade out previous polaroid
    polaroid.style.transform = `rotate(${(Math.random() * 6 - 3).toFixed(1)}deg)`;
    memoryPhoto.src = photo.src;
    memoryCaption.textContent = "";
    polaroid.style.opacity = "1";
    await delay(600);                        // fade in new one
    await delay(2600);                       // hold the moment, no tapping
  }
  memoryNext.classList.remove("hidden");
  await waitForTap(sections.memories);
  memoryNext.classList.add("hidden");
  startCake();
}

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
    c.addEventListener("click", blowOutAllCandles);
    candlesBox.appendChild(c);
  }
}

// one blow or one tap puts out every candle (staggered for effect)
async function blowOutAllCandles() {
  if (cakeDone) return;
  cakeDone = true;
  blowHint.classList.add("hidden");
  const flames = candlesBox.querySelectorAll(".flame:not(.out)");
  for (const f of flames) {
    f.classList.add("out");
    await delay(150);
  }
  runFinale();
}

function extinguishNext() {  // kept as the mic-detection entry point
  blowOutAllCandles();
}

async function runFinale() {
  cakeDone = true;
  blowHint.classList.add("hidden");
  wishLine.classList.add("hidden");
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
