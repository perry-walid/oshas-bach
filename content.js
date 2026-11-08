/* ============================================================
   ✏️  EDIT ME — all the words on the site live here.
   (No coding needed: just change the text between the quotes.)
   ============================================================ */

window.CONTENT = {
  bride: "Osha",
  tripName: "Osha's Last Fling",          // big title on the site
  tagline: "Sand, clay, henna & one very lucky bride‑to‑be",
  location: "Fayoum, Egypt",

  // Used for the countdown. Format: YYYY-MM-DDTHH:MM (Cairo time)
  start: "2026-12-03T08:00",
  end:   "2026-12-05T18:00",
  datesLabel: "3 – 5 December 2026",

  // ---------- The gate (sand reveal) ----------
  gate: {
    hint: "Brush away the sand ✋",
    foundTitle: "You've unearthed an invitation!",
    foundBody: "Archaeologists confirm: you are officially part of the Bride Tribe.",
    enterLabel: "Yalla, enter the oasis →",
  },

  // ---------- Meet the squad ----------
  // role is optional (defaults to "Bride Tribe"). fact is optional (shown on the back).
  // Add a photo by putting it in /img and setting photo: "img/name.jpg"
  squad: [
    { name: "Osha",     role: "The Bride 👰", emoji: "👰‍♀️", photo: "img/osha.jpg" },
    { name: "Sara",     role: "Sister of the Bride", emoji: "👯‍♀️", photo: "img/sara2.jpg" },
    { name: "Perry", photo: "img/perry.jpg" },
    { name: "Nouni", photo: "img/nouni.jpg" },
    { name: "Shosha", photo: "img/shrouk.jpg" },
    { name: "Yara", photo: "img/yara.jpg" },
    { name: "Habiba", photo: "img/habiba.jpg" },
    { name: "Nouran", photo: "img/nouran.jpg" },
    { name: "Sossa", photo: "img/sossa.jpg" },
    { name: "Hania", photo: "img/hana.jpg" },
    { name: "Duaa", photo: "img/duaa.jpg" },
    { name: "Nada", photo: "img/nada.jpg" },
    { name: "Menna", photo: "img/menna.jpg" },
    { name: "Joly", photo: "img/joly.jpg" },
    { name: "Rosa", photo: "img/rosa.jpg" },
    { name: "Nour", photo: "img/nour.jpg" },
    { name: "Salma", photo: "img/salma.jpg" },
    { name: "Reem", photo: "img/reem.jpg" },
    { name: "Roba", photo: "img/roba.jpg" },
    { name: "Alaa", photo: "img/alaa.jpg" },
    { name: "Nawara", photo: "img/nawara.jpg" },
    { name: "Bona", photo: "img/bona.jpg" },
    { name: "Menna", photo: "img/menna-essam.jpg" },  // Menna Essam
  ],

  // ---------- The plan (we're winging it!) ----------
  // time is optional. dress = day dress code. warn = small warning tag.
  itinerary: [
    {
      day: "Day 1", date: "Thu 3 Dec", title: "Arrive & unwind", emoji: "🐪",
      dress: "Brown for the Bedouin party 🤎",
      items: [
        { time: "08:00", emoji: "🚗", title: "Leave Cairo",         note: "Car pooling, so don't be late!" },
        {                emoji: "😌", title: "Relax",               note: "Settle into the villa, snacks, gossip" },
        {                emoji: "🏊‍♀️", title: "Pool time",           note: "Swimsuits & sunscreen" },
        {                emoji: "🔥", title: "Bedouin party",       note: "Tunis Village", dress: "Brown" },
        {                emoji: "🌿", title: "Henna night",         note: "In our villa" },
      ],
    },
    {
      day: "Day 2", date: "Fri 4 Dec", title: "Clay, horses & lake", emoji: "🏺",
      dress: "Sporty wear 👟",
      items: [
        { emoji: "🏺", title: "Pottery / Khazaf workshop", note: "Get your hands muddy" },
        { emoji: "🐎", title: "Horse riding",              note: "" },
        { emoji: "🛶", title: "Boat on Lake Qarun",        note: "" },
        { emoji: "🏜️", title: "Beach buggy safari",        note: "Not mandatory", warn: "At your own risk!!!" },
        { emoji: "🧠", title: "Trivia night",              note: "To wrap up the day" },
      ],
    },
    {
      day: "Day 3", date: "Sat 5 Dec", title: "Goodbye Fayoum", emoji: "👋",
      items: [
        { time: "12:00", emoji: "🚗", title: "Depart",     note: "Pack up, hug it out, head home" },
      ],
    },
  ],

  // ---------- Know before you go (accordion) ----------
  info: [
    { icon: "🏡", q: "Where are we staying?",    a: "Sunrise Villa, Tunis Village, Fayoum." },
    { icon: "🚗", q: "How do we get there?",     a: "Car pooling! We leave Cairo at 08:00 on Thursday 3 Dec." },
    { icon: "💸", q: "How much & how do I pay?", a: "1K for the rent, plus extra money for food and activities (around 2K)." },
    { icon: "🤫", q: "The golden rule",          a: "What happens in Fayoum stays in Fayoum. Except the photos. The photos are going everywhere." },
  ],

  // ---------- Packing list ----------
  packing: [
    { group: "Desert essentials", items: ["Sunscreen (a LOT)", "Sunglasses", "Hat or scarf", "Comfy sneakers", "Refillable water bottle"] },
    { group: "Outfits",           items: ["Brown outfit for the Bedouin party", "Sporty wear for Day 2", "Swimsuit for the pool", "Something cosy for henna night"] },
    { group: "Just in case",      items: ["Light jacket (desert nights are cold in December!)", "Power bank", "Cash (~3K total)", "Meds / plasters"] },
  ],

  footer: "Made with sand, clay & love for Osha 💛",
};
