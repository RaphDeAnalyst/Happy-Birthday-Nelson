/* ============================================================
   ALL personal content lives in this file.
   To customize for a new client:
     1. Edit the values below.
     2. Replace the images in photos/ (3-8 photos, each <500KB,
        portrait or square crops look best) and update `photos`.
   ============================================================ */
var CONFIG = {
  recipientName: "Nelson",
  recipientFullName: "Nelson Chukwuebuka",

  // The client's sign-off, shown at the very end. e.g. "— Ada ❤️"
  senderName: "— With all my love ❤️",

  // Local midnight of this date gates the countdown (YYYY-MM-DD).
  birthdayDate: "2026-06-13",

  // Show the midnight countdown when opened before the birthday?
  // false = the plain link always goes straight to the experience
  // (?demo=before still forces the countdown for rehearsal).
  showCountdown: false,

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

  // Order = story order. Delete entries to shorten the journey;
  // edit captions to match each actual photo.
  photos: [
    { src: "photos/01.jpg", caption: "Where it all began…" },
    { src: "photos/02.jpg", caption: "The early days — when every hello felt new." },
    { src: "photos/03.jpg", caption: "Already laughing at the same things." },
    { src: "photos/04.jpg", caption: "The smile I fell for." },
    { src: "photos/05.jpg", caption: "Some days are just ours." },
    { src: "photos/06.jpg", caption: "Caught in the moment." },
    { src: "photos/07.jpg", caption: "My favourite view." },
    { src: "photos/08.jpg", caption: "Side by side, always." },
    { src: "photos/09.jpg", caption: "The little adventures." },
    { src: "photos/10.jpg", caption: "Home isn't a place." },
    { src: "photos/11.jpg", caption: "Still my favourite person to do nothing with." },
    { src: "photos/12.jpg", caption: "Every photo, a reason to smile." },
    { src: "photos/13.jpg", caption: "How far we've come." },
    { src: "photos/14.jpg", caption: "And every day since — my favourite person." },
  ],

  music: { src: "piano.mp3", volume: 0.4 },
};
