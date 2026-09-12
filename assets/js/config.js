/* ──────────────────────────────────────────────────────────────
   Dewon Fried Chicken — business data, single source of truth.
   Nothing business-specific is hardcoded in the pages. Launching is
   editing this file. Any link left empty is removed from the page
   rather than rendered as a link that goes nowhere.
   Anything marked CONFIRM still needs checking before launch.
   ────────────────────────────────────────────────────────────── */

window.DEWON = {

  phone: "+358442467730",
  whatsapp: "358442467730",           // CONFIRM — must match the number on the Google Business Profile
  email: "dewonfriedchicken@gmail.com",
  franchiseEmail: "dewonfriedchicken@gmail.com",

  address: {
    street: "Sammonkatu 44",
    postcode: "33540",
    city: "Tampere",
    maps: "https://maps.app.goo.gl/FqEtYjSKxW7GFyrM8"
  },

  links: {
    wolt:          "https://wolt.com/fi/fin/tampere/restaurant/dewon-fried-chicken",
    resq:          "",                              // CONFIRM — ResQ listing URL
    ubereats:      "",                              // not listed on Uber Eats
    foodora:       "",                              // not listed on Foodora
    instagram:     "https://www.instagram.com/fcdewon/",
    facebook:      "https://www.facebook.com/profile.php?id=61572683171116",
    tiktok:        "",                              // CONFIRM — send the handle and it appears
    reviews:       "https://www.google.com/maps/search/?api=1&query=Dewon+Fried+Chicken+Sammonkatu+44+33540+Tampere"
  },

  /* Live Google rating. Update it when it moves; never invent it. */
  rating: { score: "4,8", count: 144 },

  /* CONFIRM — Google shows a 21:00 close where Wolt runs to 21:45.
     Set whichever is the kitchen. */
  hours: [
    { d: "ma", open: "11:00", close: "21:00" },
    { d: "ti", open: "11:00", close: "21:00" },
    { d: "ke", open: "11:00", close: "21:00" },
    { d: "to", open: "11:00", close: "21:00" },
    { d: "pe", open: "11:00", close: "22:00" },
    { d: "la", open: "11:00", close: "22:00" },
    { d: "su", open: "11:00", close: "21:00" }
  ],

  dayNames: {
    fi: { ma: "Maanantai", ti: "Tiistai", ke: "Keskiviikko", to: "Torstai", pe: "Perjantai", la: "Lauantai", su: "Sunnuntai" },
    en: { ma: "Monday", ti: "Tuesday", ke: "Wednesday", to: "Thursday", pe: "Friday", la: "Saturday", su: "Sunday" }
  },

  /* The seven house sauces, one per day. Names are placeholders until the
     kitchen confirms them — the seal and the sauce section both read this,
     so correcting them is a one-file edit.  CONFIRM */
  sauces: [
    { day: { fi: "Ma", en: "Mon" }, fi: "Yrttivoi",        en: "Herb butter" },
    { day: { fi: "Ti", en: "Tue" }, fi: "Gochujang",       en: "Gochujang" },
    { day: { fi: "Ke", en: "Wed" }, fi: "Soija–valkosipuli", en: "Soy garlic" },
    { day: { fi: "To", en: "Thu" }, fi: "Devilled",        en: "Devilled" },
    { day: { fi: "Pe", en: "Fri" }, fi: "Curry–lime",      en: "Curry lime" },
    { day: { fi: "La", en: "Sat" }, fi: "Hunaja–chili",    en: "Honey chilli" },
    { day: { fi: "Su", en: "Sun" }, fi: "Musta pippuri",   en: "Black pepper" }
  ],

  /* The buffet's daily dishes are not here — they rotate over 24 days
     and live in their own file, assets/js/buffet-menu.js. */

  /* Group and party sizes the kitchen will take. At maxPeople the whole
     restaurant is booked out for the party. */
  groups: { minPeople: 8, maxPeople: 48, noticeDays: 7 },

  /* Forms. Empty = every form hands off to WhatsApp or email instead of
     failing. To collect submissions properly, make a form at
     formspree.io or web3forms.com and paste the endpoint here (it must
     start with https://). The site's security policy in vercel.json
     allows exactly those two services — any other form service also has
     to be added to "connect-src" and "form-action" there, or the
     browser will block it. */
  formEndpoint: "",

  /* Google Analytics 4. Empty = no script loads at all. */
  gaMeasurementId: "",

  /* Show English automatically to non-Finnish browsers. */
  autoDetectLanguage: true
};
