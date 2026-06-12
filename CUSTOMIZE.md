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
