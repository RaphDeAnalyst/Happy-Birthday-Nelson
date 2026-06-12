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
