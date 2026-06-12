# Birthday Experience — Design Spec

**Date:** 2026-06-12
**Deadline:** June 13, 2026 (recipient's birthday is tomorrow)
**Recipient:** Nelson Chukwuebuka
**Context:** Paid client project. Evolves the existing valentine site (typewriter letter,
piano, floating hearts) into a six-act birthday experience. Built to be resellable:
all personal content lives in one config file.

## Goals

1. The sweetest possible birthday gift experience — emotional core is a photo
   memory lane; cinematic frame is a midnight countdown and a candle-blowing finale.
2. Config-driven personalization: a future client's version requires editing only
   `config.js` and replacing the `photos/` folder.
3. Must never break on the night: every risky capability (mic, audio, images, dates)
   degrades gracefully.
4. Mobile-first: the recipient will most likely open the link on a phone.

## Concept and style (chosen during brainstorming)

- **Concept:** blend of "Midnight Surprise" + "Memory Lane Journey".
- **Visual style:** **Midnight Gold** — deep midnight blue-black background
  (`#0a0a14` → `#141024` gradient), cream serif text (Georgia), shimmering gold
  accents (`#d4af37`), soft glow, gold confetti/sparks. Evolves the valentine
  site's candlelit elegance into a celebration.
- **Music:** reuse existing `piano.mp3`, fading in at the letter (act 4),
  looping through the end. Swappable via config.

## The experience — six acts

Acts are full-viewport `<section>`s, cross-faded with the existing
`showSection()` pattern.

### Act 1 — Intro
"Before you continue… find somewhere quiet. Earphones on 🎧" + **Begin** button.
The button tap is the user gesture that unlocks audio playback (same mechanism
as the valentine site). Begin → act 2 or act 3 depending on date.

### Act 2 — Countdown (conditional)
- Shown only if current time is **before midnight on the birthday date**
  (local device time). Otherwise skipped entirely — never shown as "0 remaining".
- Live `DD : HH : MM : SS` countdown to 00:00 of the birthday, under drifting
  gold spark particles, with a line like "Something is waiting for you…".
- At zero: countdown dissolves and the flow auto-advances to act 3.
- If the date in config is unparseable, skip the countdown (fail-safe).
- The lock is cosmetic (client-side only); this is documented, not "fixed".

### Act 3 — The trick question
Birthday-flavored version of the valentine beat, all lines from config:
1. Typewriter: "Do you know how much you mean to me?"
2. Buttons: "A little?" / "A lot?"
3. Either tap → "Wrong answer." → "The correct answer is…" →
   "More than yesterday." → "Less than tomorrow."
4. Auto-advance to act 4.

### Act 4 — The letter
- Paragraphs from config typed letter-by-letter (existing `typeText()`).
- Piano fades in (existing `fadeInMusic()`, target volume from config).
- Gold confetti burst triggers on the first paragraph.
- Ends by advancing to act 5 (tap to continue after final paragraph).

### Act 5 — Memory lane (the emotional core)
- Walks `CONFIG.photos` in order; each entry is one "chapter".
- Each chapter: photo in a **polaroid frame** (white border, slight rotation,
  `object-fit: cover` so any aspect ratio works), caption typed out beneath it.
- Recipient taps anywhere on the screen to advance to the next chapter
  (a subtle "tap to continue ›" hint fades in once the caption finishes typing).
- After the last chapter, advance to act 6.

#### How photos fit in (workflow + behavior)
- Developer drops the client's images into a `photos/` directory and lists them
  in config: `{ src: "photos/01.jpg", caption: "The day it all started…" }`.
- **Preloading:** all photos begin loading in the background from act 1, so
  memory lane never shows a loading state.
- **Failure handling:** an image that fails to load has its chapter silently
  skipped; the story continues with the next one.
- **Guidance (documented in config comments):** 3–8 photos; compress each to
  under ~500KB for mobile loading.

### Act 6 — Cake finale
- Animated CSS cake with flickering candle flames (pure CSS, no images).
- Typed line: "Make a wish, Nelson… then blow." (name from config).
- **Blow detection:** Web Audio API — request mic, monitor input level; a
  sustained loud low-frequency burst extinguishes candles one by one.
- **Fallback:** if mic permission is denied, unsupported, or the page is not in
  a secure context, show "tap the flames" and let taps extinguish candles. The
  experience must be indistinguishable in quality either way.
- All candles out → **fireworks + gold confetti + "Happy Birthday, Nelson 🎂"**
  and the sender's signature fades in (both from config).

## Architecture

Zero-dependency vanilla HTML/CSS/JS. No build step. Files:

| File | Role |
|---|---|
| `config.js` (new) | Single `CONFIG` object: all personal content |
| `index.html` | All six sections, loads `config.js` before `script.js` |
| `style.css` | Rewritten for Midnight Gold; mobile-first responsive |
| `script.js` | Flow control + modules: countdown, memory lane, blow detection, fireworks. Keeps `typeText()`, `showSection()`, `fadeInMusic()` |
| `photos/` (new) | Client's images |
| `piano.mp3` | Background music (path configurable) |

### `config.js` schema

```js
const CONFIG = {
  recipientName: "Nelson",            // used in headings, wish line, finale
  recipientFullName: "Nelson Chukwuebuka",
  senderName: "",                     // client's signature, e.g. "— Ada ❤️"
  birthdayDate: "2026-06-13",         // local midnight of this date gates the countdown
  question: {
    prompt: "Do you know how much you mean to me?",
    choices: ["A little?", "A lot?"],
    revealLines: ["Wrong answer.", "The correct answer is...",
                  "More than yesterday.", "Less than tomorrow."],
  },
  letterParagraphs: [ /* strings */ ],
  photos: [ { src: "photos/01.jpg", caption: "…" } /* 3–8 entries */ ],
  music: { src: "piano.mp3", volume: 0.4 },
};
```

## Fail-safe matrix

| Risk | Behavior |
|---|---|
| Mic denied / unsupported / insecure context | Tap-the-flames fallback, automatic |
| Photo fails to load | Chapter skipped silently |
| `birthdayDate` unparseable | Countdown skipped, straight to act 3 |
| Audio blocked / file missing | Experience continues silently |
| JS feature missing on old browser | Core flow (sections + typewriter) still works |

## Testing

- **Demo switches:** `?demo=before` forces the countdown with a 10-second timer;
  `?demo=after` forces the skip path. No system clock changes needed.
- Manual full run-through of both paths on desktop and a real phone before
  handover: audio fade, photo preloading, mic blow AND tap fallback, finale.

## Out of scope

- Hosting/delivery (developer hosts as with the valentine site).
- Any backend or analytics.
- Real content secrecy — the midnight lock is cosmetic; source is readable.
- Speech synthesis (remains removed; it was already commented out).
