/* ══════════════════════════════════════════════════════════════
   Page assembler.

   The site itself needs no build step — the HTML files this writes are
   plain, self-contained and open straight from disk. This script exists
   only so the header, footer and order sheet are defined once instead of
   copy-pasted into seven files. Run it after editing a partial:

       node tools/build.mjs

   If you would rather not use it, delete tools/ and edit the HTML files
   directly. Nothing at runtime depends on it.
   ══════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NAV = [
  { key: "menu", fi: "Menu", en: "Menu", sub: [
      { href: "menu-a-la-carte.html", icon: "utensils", fi: "À la carte", en: "À la carte",
        subFi: "Koko lista, hinnat ja gluteenittomat", subEn: "The full list, prices and gluten free" },
      { href: "menu-buffet.html", icon: "store", fi: "Lounasbuffet", en: "Lunch buffet",
        subFi: "Päivän buffet, hinnat ja ajat", subEn: "The daily buffet, price and times" }
    ] },
  { key: "parties",    href: "parties.html",      fi: "Juhlat & ryhmät", en: "Parties & groups" },
  { key: "reserve",    href: "reservations.html", fi: "Varaukset",       en: "Reservations" },
  { key: "find",       href: "find-us.html",      fi: "Löydä meidät",    en: "Find us" },
  { key: "franchise",  href: "franchising.html",  fi: "Franchising",     en: "Franchising" }
];

const icon = (n, cls = "ic") =>
  `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const brandIcon = (n, cls = "ic") =>
  `<svg class="${cls}" aria-hidden="true"><use href="#b-${n}"></use></svg>`;

/* A photo slot. If the file is there it renders; if it is not, the slot shows
   what belongs in it rather than substituting made-up artwork. */
const photoSlot = ({ cls, file, label, labelEn, alt = "", big = false, plain = false }) => `
<div class="pslot ${cls}" data-pslot>
  <img src="assets/images/${file}" alt="${alt}"${alt ? "" : ' aria-hidden="true"'}
       onload="this.closest('[data-pslot]').setAttribute('data-has','1')"
       onerror="this.remove()">
  <span class="pslot-ph" aria-hidden="true">
    ${plain ? "" : icon("image", "ic")}
    <b data-en="${labelEn}">${label}</b>
  </span>
</div>`;


/* ── head ─────────────────────────────────────────────────── */

const head = ({ title, desc, active }) => `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0b0b0b">
<link rel="icon" href="favicon.png">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="restaurant.restaurant">
<meta property="og:locale" content="fi_FI">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/archivo-latin-wdth-normal.woff2">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/instrument-sans-latin-wght-normal.woff2">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/vendor/open-props.min.css">
<link rel="stylesheet" href="assets/vendor/swiper-bundle.min.css">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<a class="skip" href="#main" data-en="Skip to content">Siirry sisältöön</a>
${header(active)}
<main id="main">`;

/* ── header ───────────────────────────────────────────────── */

function header(active) {
  const items = NAV.map(n => {
    if (n.sub) {
      const open = n.sub.some(s => s.href === active);
      return `<div class="has-sub" data-sub data-open="false">
        <button type="button" aria-expanded="false" aria-haspopup="true"${open ? ' style="color:var(--rust)"' : ""}>
          <span data-en="${n.en}">${n.fi}</span>${icon("chevron-down")}
        </button>
        <div class="sub">
          ${n.sub.map(s => `<a href="${s.href}"${s.href === active ? ' aria-current="page"' : ""}>
            ${icon(s.icon)}
            <span><span data-en="${s.en}">${s.fi}</span>
            <small data-en="${s.subEn}">${s.subFi}</small></span>
          </a>`).join("\n          ")}
        </div>
      </div>`;
    }
    return `<a href="${n.href}"${n.href === active ? ' aria-current="page"' : ""} data-en="${n.en}">${n.fi}</a>`;
  }).join("\n        ");

  return `<header class="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="index.html">
      <img src="assets/images/logo-mark.png" alt="" width="40" height="35">
      <span><b>Dewon</b><span>Fried Chicken</span></span>
    </a>
    <nav class="nav" data-nav data-open="false" aria-label="Päävalikko">
      ${items}
    </nav>
    <div class="lang" role="group" aria-label="Kieli / Language">
      <button type="button" data-lang-btn="fi" aria-pressed="true">FI</button>
      <button type="button" data-lang-btn="en" aria-pressed="false">EN</button>
    </div>
    <button class="burger" type="button" data-burger aria-expanded="false" aria-controls="nav"
            aria-label="Valikko" data-en-aria="Menu">${icon("menu")}</button>
  </div>
</header>`;
}

/* ── page head block ──────────────────────────────────────── */

const phead = ({ crumb, crumbEn, h1, h1En, intro, introEn, meta = "" }) => `
<section class="phead">
  <div class="wrap">
    <nav class="crumbs" aria-label="Murupolku">
      <a href="index.html" data-en="Home">Etusivu</a>${icon("chevron-right")}
      <span data-en="${crumbEn}">${crumb}</span>
    </nav>
    <h1 class="display d2" data-en="${h1En}">${h1}</h1>
    <p data-en="${introEn}">${intro}</p>
    ${meta}
  </div>
</section>`;

/* ── order sheet ──────────────────────────────────────────── */

const orderSheet = () => `
<div class="sheet" id="order-sheet" role="dialog" aria-modal="true" aria-labelledby="order-sheet-title">
  <div class="sheet-panel">
    <div class="sheet-head">
      <div>
        <p class="eyebrow" data-en="Your order">Tilauksesi</p>
        <h2 class="display d4" id="order-sheet-title" data-en="How would you like it?">Miten haluat tilata?</h2>
      </div>
      <button class="sheet-close" type="button" data-close-sheet
              aria-label="Sulje" data-en-aria="Close">${icon("x")}</button>
    </div>

    <div data-ticket>
      <p class="dim" data-ticket-empty data-en="You have not picked anything yet. Add dishes from the menu and they appear here.">
        Et ole vielä valinnut mitään. Lisää annoksia listalta, niin ne näkyvät tässä.</p>
      <div data-ticket-filled hidden>
        <div class="ticket">
          <ul></ul>
          <div class="ticket-total">
            <span data-en="In-house total">Talossa yhteensä</span>
            <span class="num" data-ticket-house>0,00 €</span>
          </div>
          <div class="ticket-total" style="border:0;padding-top:.3rem;margin-top:.3rem;font-size:.86rem;opacity:.75">
            <span data-en="Same order on Wolt">Sama tilaus Woltissa</span>
            <span class="num" data-ticket-wolt>0,00 €</span>
          </div>
        </div>
        <p class="note" style="margin-bottom:1.1rem">${icon("shopping-bag")}
          <span data-en="Ordering direct saves you <b data-ticket-gap></b> on this order. Marketplace prices carry their commission.">
            Suoraan tilaamalla säästät tässä tilauksessa <b data-ticket-gap></b>. Alustojen hinnoissa on välityspalkkio.</span></p>
      </div>
    </div>

    <a class="route route--best" data-route="whatsapp" data-whatsapp href="#" target="_blank" rel="noopener">
      <span class="route-ic">${icon("message-circle")}</span>
      <span><b>WhatsApp</b><span data-en="Sends your list as it is. We reply with a pickup time.">Lähettää listasi sellaisenaan. Vastaamme noutoajan.</span></span>
      <span class="route-flag" data-en="Keeps your list">Lista säilyy</span>
    </a>

    <a class="route" data-route="call" data-phone href="#">
      <span class="route-ic">${icon("phone")}</span>
      <span><b data-en="Call us">Soita</b><span data-en="Read your list out. Ready when you arrive.">Lue lista puhelimessa. Valmis kun tulet.</span></span>
    </a>

    <a class="route" data-route="wolt" data-wolt href="#" target="_blank" rel="noopener">
      <span class="route-ic">${icon("shopping-bag")}</span>
      <span><b>Wolt Tampere</b><span data-en="Delivery. Your list does not carry over — copy it first.">Kotiinkuljetus. Lista ei siirry — kopioi se ensin.</span></span>
    </a>

    <li style="list-style:none" data-optional>
      <a class="route" data-route="wolt-sastamala" data-wolt-sastamala href="#" target="_blank" rel="noopener">
        <span class="route-ic">${icon("shopping-bag")}</span>
        <span><b>Wolt Sastamala</b><span data-en="Our second store. Same list applies.">Toinen ravintolamme. Sama lista pätee.</span></span>
      </a>
    </li>

    <a class="route" href="reservations.html">
      <span class="route-ic">${icon("calendar")}</span>
      <span><b data-en="Book a table">Varaa pöytä</b><span data-en="Eat in. Buffet or à la carte.">Syö paikan päällä. Buffet tai à la carte.</span></span>
    </a>

    <p class="note" style="margin-top:1.2rem">${icon("copy")}
      <span data-en="Wolt cannot receive a list from another site — that is a Wolt limitation, not ours. Copy your list, then rebuild it there in a few taps.">
        Wolt ei voi vastaanottaa listaa toiselta sivustolta — rajoitus on Woltin, ei meidän. Kopioi lista, niin kokoat sen siellä muutamalla napautuksella.</span></p>

    <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">
      <button class="btn btn--paper btn--sm" type="button" data-copy-order data-en="Copy my list">Kopioi listani</button>
      <button class="btn btn--ghost btn--sm" type="button" data-tray-clear data-en="Clear">Tyhjennä</button>
    </div>
  </div>
</div>`;

/* ── tray ─────────────────────────────────────────────────── */

const tray = () => `
<div class="tray" data-tray data-show="false">
  <span class="tray-sum">
    <b data-tray-count>0</b>
    <span data-tray-total>0,00 €</span>
  </span>
  <button class="tray-clear" type="button" data-tray-clear
          aria-label="Tyhjennä valinnat" data-en-aria="Clear selection">${icon("trash-2")}</button>
  <button class="btn btn--primary btn--sm" type="button" data-open-sheet="order-sheet"
          data-en="How to order">Miten tilaan</button>
</div>`;

/* ── footer ───────────────────────────────────────────────── */

const footer = (withTray) => `
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div>
        <a class="brand" href="index.html" style="margin-bottom:1rem">
          <img src="assets/images/logo-mark.png" alt="" width="40" height="35">
          <span><b>Dewon</b><span>Fried Chicken</span></span>
        </a>
        <address>
          <span data-address-street></span><br>
          <span data-address-city></span><br>
          <a href="#" data-phone data-phone-text></a>
        </address>
      </div>
      <div>
        <h4 data-en="Menu">Menu</h4>
        <ul>
          <li><a href="menu-a-la-carte.html" data-en="À la carte">À la carte</a></li>
          <li><a href="menu-buffet.html" data-en="Lunch buffet">Lounasbuffet</a></li>
          <li><a href="reservations.html" data-en="Reservations">Varaukset</a></li>
          <li><a href="parties.html" data-en="Parties &amp; groups">Juhlat &amp; ryhmät</a></li>
        </ul>
      </div>
      <div>
        <h4 data-en="Order">Tilaa</h4>
        <ul>
          <li><a href="#" data-whatsapp target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="#" data-wolt target="_blank" rel="noopener">Wolt Tampere</a></li>
          <li><a href="#" data-wolt-sastamala target="_blank" rel="noopener">Wolt Sastamala</a></li>
          <li><a href="#" data-ubereats target="_blank" rel="noopener">Uber Eats</a></li>
        </ul>
      </div>
      <div>
        <h4 data-en="Follow">Seuraa</h4>
        <ul>
          <li><a href="#" data-instagram target="_blank" rel="noopener">${brandIcon("instagram")}Instagram</a></li>
          <li><a href="#" data-facebook target="_blank" rel="noopener">${brandIcon("facebook")}Facebook</a></li>
          <li><a href="#" data-tiktok target="_blank" rel="noopener">${brandIcon("tiktok")}TikTok</a></li>
          <li><a href="#" data-maps target="_blank" rel="noopener">${brandIcon("googlemaps")}Google Maps</a></li>
        </ul>
      </div>
      <div>
        <h4 data-en="Business">Yritys</h4>
        <ul>
          <li><a href="franchising.html" data-en="Franchising">Franchising</a></li>
          <li><a href="find-us.html" data-en="Find us">Löydä meidät</a></li>
          <li><a href="#" data-email data-email-text></a></li>
        </ul>
      </div>
    </div>
    <div class="ftr-base">
      <span>© <span id="yr"></span> Dewon Fried Chicken</span>
      <span data-en="Sammonkatu 44, Tampere">Sammonkatu 44, Tampere</span>
    </div>
  </div>
</footer>

<button class="totop" type="button" data-totop aria-label="Takaisin ylös" data-en-aria="Back to top">${icon("arrow-up-right", "ic")}</button>
${withTray ? tray() + orderSheet() : ""}

<script src="assets/vendor/swiper-bundle.min.js"></script>
<script src="assets/js/icons.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/menu-data.js"></script>
<script src="assets/js/app.js"></script>
<script>document.getElementById("yr").textContent = new Date().getFullYear();</script>
</body>
</html>`;

/* ══ PAGES ═══════════════════════════════════════════════════ */

const marquee = (items) => `
<div class="marquee" aria-hidden="true">
  <div class="marquee-track" data-marquee>
    ${items.map(([fi, en]) => `<span data-en="${en}">${fi}</span>`).join("\n    ")}
  </div>
</div>`;

/* ── the seal ─────────────────────────────────────────────── */

const seal = () => `
<svg class="seal" viewBox="0 0 240 240" role="img" aria-labelledby="seal-t">
  <title id="seal-t">7 päivää, 7 kastiketta</title>
  <defs>
    <path id="seal-arc-top" d="M120 120 m-92 0 a92 92 0 0 1 184 0" fill="none"/>
    <path id="seal-arc-bot" d="M120 120 m92 0 a92 92 0 0 1 -184 0" fill="none"/>
  </defs>
  <circle cx="120" cy="120" r="118" fill="none" stroke="#0b0b0b" stroke-width="3"/>
  <circle cx="120" cy="120" r="106" fill="none" stroke="#a84e12" stroke-width="1.5"/>
  <text font-family="Archivo, sans-serif" font-weight="800" font-size="16.5" letter-spacing="4.2" fill="#0b0b0b">
    <textPath href="#seal-arc-top" startOffset="50%" text-anchor="middle">DEWON FRIED CHICKEN</textPath>
  </text>
  <text font-family="Archivo, sans-serif" font-weight="800" font-size="14" letter-spacing="4.6" fill="#a84e12">
    <textPath href="#seal-arc-bot" startOffset="50%" text-anchor="middle">SAMMONKATU 44 · TAMPERE</textPath>
  </text>
  ${Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${(120 + Math.cos(a) * 92).toFixed(1)}" cy="${(120 + Math.sin(a) * 92).toFixed(1)}" r="4.5" fill="#f5822e"/>`;
  }).join("\n  ")}
  <circle cx="120" cy="120" r="76" fill="#f5822e"/>
  <text x="120" y="106" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900"
        font-size="54" fill="#0b0b0b" letter-spacing="-2">7</text>
  <text x="120" y="130" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800"
        font-size="13.5" fill="#0b0b0b" letter-spacing="2.6">PÄIVÄÄ</text>
  <line x1="72" y1="141" x2="168" y2="141" stroke="#0b0b0b" stroke-width="1.5"/>
  <text x="120" y="164" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900"
        font-size="26" fill="#0b0b0b" letter-spacing="-.5">7</text>
  <text x="120" y="181" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800"
        font-size="11.5" fill="#0b0b0b" letter-spacing="2.4">KASTIKETTA</text>
</svg>`;

/* ── HOME ─────────────────────────────────────────────────── */

const home = () => head({
  title: "Dewon Fried Chicken — Sammonkatu 44, Tampere",
  desc: "Aasialaisessa yrttimarinadissa friteerattu kana, korealainen bibimbap ja srilankalaiset annokset Tampereen Sammonkadulla. Lounasbuffet arkisin.",
  active: "index.html"
}) + `
<section class="hero">
  <div class="wrap"><div class="hero-banner"><div class="hero-grid">

    <div class="hero-flank">
      <div class="stage">
        <div class="stage-glow" aria-hidden="true"></div>
        <div class="stage-ring" aria-hidden="true"></div>

        ${photoSlot({ cls: "piece p1", file: "piece-wing-1.png",      label: "Siipi",     labelEn: "Wing" })}
        ${photoSlot({ cls: "piece p3", file: "piece-wing-2.png",      label: "Siipi",     labelEn: "Wing" })}

        ${photoSlot({ cls: "stage-hero-img", file: "hero-boneless.png",
                      label: "Kastikkeinen luuton kana", labelEn: "Sauced boneless chicken",
                      alt: "Kastikkeeseen kastettu luuton friteerattu kana", big: true })}

        <img class="herb-fall" src="assets/images/herb-fall.png" alt="" aria-hidden="true"
             onerror="this.style.display='none'">
      </div>
    </div>

    <div class="hero-copy">
      <p class="eyebrow" data-en="Sammonkatu 44 · Tampere">Sammonkatu 44 · Tampere</p>
      <h1 class="display d1" data-en="Herbs first.<br><em>Then the fryer.</em>">Yrtit ensin.<br><em>Sitten friteeraus.</em></h1>
      <p class="lede" data-en="Chicken marinated in Asian herbs, coated in herb flour and fried to order. Korean bibimbap and Sri Lankan plates alongside it. Gluten free on request.">
        Kana marinoidaan aasialaisissa yrteissä, kuorrutetaan yrttijauhoilla ja friteerataan tilauksesta. Vieressä korealainen bibimbap ja srilankalaiset annokset. Gluteeniton pyynnöstä.</p>
      <div class="hero-cta">
        <a class="btn btn--primary" href="menu-a-la-carte.html">
          ${icon("utensils")}<span data-en="See the menu">Katso menu</span></a>
        <a class="btn btn--ghost" href="menu-buffet.html">
          <span data-en="Lunch buffet">Lounasbuffet</span> <span class="num" data-buffet-price></span></a>
      </div>
      <p class="hero-proof">
        <span class="stars" aria-hidden="true">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span>
        <b class="num"><span data-rating-score></span></b>
        <span><span data-rating-count></span> <span data-en="Google reviews">Google-arvostelua</span></span>
        <span aria-hidden="true">·</span>
        <span data-open-now></span>
      </p>
    </div>

    <div class="hero-flank">
      <div class="stage">
        <div class="stage-glow" aria-hidden="true"></div>
        <div class="stage-ring" aria-hidden="true"></div>

        ${photoSlot({ cls: "piece p2", file: "piece-drumstick-1.png", label: "Koipi",    labelEn: "Drumstick" })}
        ${photoSlot({ cls: "piece p4", file: "piece-drumstick-2.png", label: "Koipi",    labelEn: "Drumstick" })}

        <div class="taster">
          <span class="taster-tag" data-en="Gloves on">Hanskat käteen</span>
          ${photoSlot({ cls: "taster-photo", file: "taster.jpg",
                        label: "Henkilö mustissa hanskoissa", labelEn: "Person in black gloves",
                        alt: "Asiakas syömässä Dewonin friteerattua kanaa mustat hanskat kädessä", plain: true })}
        </div>
      </div>
    </div>

  </div></div></div>
</section>

${marquee([
  ["Gluteeniton saatavana", "Gluten free available"],
  ["Lounasbuffet 12,90 €", "Lunch buffet 12,90 €"],
  ["Vegaanivaihtoehdot", "Vegan options"],
  ["Sammonkatu 44", "Sammonkatu 44"],
  ["Tilaa suoraan — halvempi sinulle", "Order direct — cheaper for you"],
  ["Friteerataan tilauksesta", "Fried to order"]
])}

<section class="section" id="order">
  <div class="wrap">
    <div class="section-head">
      <div>
        <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
        <p class="eyebrow" data-en="What people order">Mitä täältä tilataan</p>
        <h2 class="display d3" data-en="Buffet, à la carte or a combo">Buffet, à la carte tai kombo</h2>
      </div>
      <a class="btn btn--ghost btn--sm" href="menu-a-la-carte.html">
        <span data-en="Full menu">Koko lista</span>${icon("arrow-right")}</a>
    </div>

    <nav class="order-nav" data-order-nav aria-label="Tilaustavat">
      <a href="#order-buffet" data-en="Buffet">Buffet</a>
      <a href="#order-alacarte" data-en="À la carte">À la carte</a>
      <a href="#order-combos" data-en="Combos">Kombot</a>
    </nav>

    <div id="order-buffet" class="order-panel" style="scroll-margin-top:150px">
      <p class="eyebrow" style="margin-bottom:.6rem" data-en="Weekdays, eat in">Arkisin, paikan päällä</p>
      <div class="grid g-2">
        <article class="tier tier--lead rise">
          <p class="eyebrow" data-en="Weekdays">Arkisin</p>
          <h3 class="display d5" data-en="Lunch buffet">Lounasbuffet</h3>
          <p class="tier-price num"><span data-buffet-price></span> <small data-en="/ person">/ hlö</small></p>
          <p style="margin-top:.4rem" data-en="Fried chicken from the same marinade, Sri Lankan and Korean dishes in rotation, and the sauce of the day.">
            Friteerattua kanaa samasta marinadista, srilankalaisia ja korealaisia annoksia kierrossa, ja päivän kastike.</p>
          <a class="btn btn--primary" href="menu-buffet.html" data-en="Buffet details">Buffetin tiedot</a>
        </article>
        <article class="tier rise">
          <p class="eyebrow" data-en="Every Tuesday">Joka tiistai</p>
          <h3 class="display d5" data-en="Tuesday buffet">Tiistain buffet</h3>
          <p class="tier-price num"><span data-buffet-tuesday></span> <small data-en="/ person">/ hlö</small></p>
          <p style="margin-top:.4rem" data-en="A wider spread on Tuesdays, priced accordingly.">Tiistaisin laajempi pöytä, ja hinta sen mukaan.</p>
          <a class="btn btn--paper" href="menu-buffet.html" data-en="Buffet details">Buffetin tiedot</a>
        </article>
      </div>
    </div>

    <div id="order-alacarte" class="order-panel" style="scroll-margin-top:150px;margin-top:2.6rem">
      <p class="eyebrow" style="margin-bottom:.6rem" data-en="Three that leave the kitchen most">Kolme eniten lähtevää</p>
      <div class="swiper cards-swiper" data-cards-swiper>
       <div class="swiper-wrapper">
        <article class="pcard swiper-slide rise">
          <div class="pcard-media">
            <span class="ribbon">${icon("flame")}<span data-en="Signature">Talon oma</span></span>
            <img src="assets/images/food-menu-3.png" alt="Luuton friteerattu kana" width="300" height="300">
          </div>
          <div class="pcard-top">
            <h3>Luuton kana</h3><span class="price num">16,90 €</span>
          </div>
          <p data-en="Marinated chicken breast, herb flour, fried to order.">Marinoitu rintafilee, yrttijauho, friteerataan tilauksesta.</p>
          <div class="chips"><span class="chip chip--gf">${icon("wheat-solid")}<span data-en="Gluten free available">Gluteeniton saatavana</span></span></div>
          <div class="pcard-foot"><a class="btn btn--primary btn--sm btn--block" href="menu-a-la-carte.html#cat-fried-chicken" data-en="Add from the menu">Lisää listalta</a></div>
        </article>

        <article class="pcard swiper-slide rise">
          <div class="pcard-media">
            <img src="assets/images/food-menu-2.png" alt="Korean Bibim Bap" width="300" height="300">
          </div>
          <div class="pcard-top">
            <h3>Chicken Bibim Bap</h3><span class="price num">13,90 €</span>
          </div>
          <p data-en="Warm rice bowl, seasoned vegetables, fried egg, gochujang.">Lämmin riisikulho, maustetut kasvikset, paistettu kananmuna, gochujang.</p>
          <div class="chips"><span class="chip chip--vegan">${icon("leaf")}<span data-en="Vegan version 11,90 €">Vegaaniversio 11,90 €</span></span></div>
          <div class="pcard-foot"><a class="btn btn--primary btn--sm btn--block" href="menu-a-la-carte.html#cat-bibimbap" data-en="Add from the menu">Lisää listalta</a></div>
        </article>

        <article class="pcard swiper-slide rise">
          <div class="pcard-media">
            <img src="assets/images/food-menu-5.png" alt="10 siipeä" width="300" height="300">
          </div>
          <div class="pcard-top">
            <h3 data-en="10 wings">10 siipeä</h3><span class="price num">15,90 €</span>
          </div>
          <p data-en="Same herb marinade. Five, seven, ten — or thirty on Wolt.">Sama yrttimarinadi. Viisi, seitsemän, kymmenen — tai kolmekymmentä Woltissa.</p>
          <div class="chips"><span class="chip chip--gf">${icon("wheat-solid")}<span data-en="Gluten free available">Gluteeniton saatavana</span></span></div>
          <div class="pcard-foot"><a class="btn btn--primary btn--sm btn--block" href="menu-a-la-carte.html#cat-wings" data-en="Add from the menu">Lisää listalta</a></div>
        </article>
       </div>
       <div class="swiper-pagination"></div>
      </div>
    </div>

    <div id="order-combos" class="order-panel" style="scroll-margin-top:150px;margin-top:2.6rem">
      <p class="eyebrow" style="margin-bottom:.6rem" data-en="Built to share, priced to order">Jaettavaksi tehty, hinnoiteltu tilattavaksi</p>
      <div data-combo-grid></div>
    </div>
  </div>
</section>

<section class="section seal-band" id="sauces">
  <div class="wrap seal-wrap">
    <div>${seal()}</div>
    <div>
      <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
      <p class="eyebrow" data-en="Seven days, seven sauces">Seitsemän päivää, seitsemän kastiketta</p>
      <h2 class="display d3" data-en="A different dip every day of the week">Joka viikonpäivälle oma kastike</h2>
      <p class="lede" style="margin-top:.8rem" data-en="The herb marinade goes into the chicken before it is fried, so the flavour is in the meat and not only on it. The sauce on top changes daily — one house blend per day, made in the kitchen, and it is the reason the buffet is never the same plate twice.">
        Yrttimarinadi menee kanaan ennen friteerausta, joten maku on lihassa eikä vain sen päällä. Päälle tuleva kastike vaihtuu päivittäin — yksi talon sekoitus per päivä, tehty omassa keittiössä. Siksi buffet ei ole koskaan kahdesti sama lautanen.</p>

      <div class="sauce-list" data-sauces></div>

      <p class="note" style="margin-top:1.4rem">${icon("clock")}
        <span data-en="Sauce names are being confirmed with the kitchen — the rotation is real, the labels are placeholders.">
        Kastikkeiden nimet varmistetaan vielä keittiön kanssa — kierto on todellinen, nimet alustavia.</span></p>

      <div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.6rem">
        <a class="btn btn--primary" href="menu-a-la-carte.html">${icon("shopping-bag")}<span data-en="Start an order">Aloita tilaus</span></a>
        <a class="btn btn--ghost" href="menu-buffet.html" data-en="See the buffet">Katso buffet</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid g-2">
      <article class="tier tier--lead rise">
        <p class="eyebrow" data-en="Weekdays">Arkisin</p>
        <h3 class="display d4" data-en="Lunch buffet">Lounasbuffet</h3>
        <p class="tier-price num"><span data-buffet-price></span></p>
        <p class="dim"><span data-buffet-days></span> · <span data-buffet-time></span> · <span data-en="Tuesdays">tiistaisin</span> <span class="num" data-buffet-tuesday></span></p>
        <ul>
          <li>${icon("check")}<span data-en="Fried chicken from the same marinade">Friteerattu kana samasta marinadista</span></li>
          <li>${icon("check")}<span data-en="Sri Lankan and Korean dishes in rotation">Srilankalaisia ja korealaisia annoksia kierrossa</span></li>
          <li>${icon("check")}<span data-en="Salad, rice and the sauce of the day">Salaatti, riisi ja päivän kastike</span></li>
        </ul>
        <a class="btn btn--primary" href="menu-buffet.html" data-en="Buffet details">Buffetin tiedot</a>
      </article>

      <article class="tier rise">
        <p class="eyebrow" data-en="From eight people">Kahdeksasta hengestä</p>
        <h3 class="display d4" data-en="Parties &amp; groups">Juhlat &amp; ryhmät</h3>
        <p style="margin-top:.8rem" data-en="Birthdays, team dinners, club nights. Tell us the headcount and whether you want the buffet, a set à la carte selection, or a list you put together yourself.">
          Synttärit, tiimi-illalliset, seuran illat. Kerro henkilömäärä ja haluatteko buffetin, valmiin à la carte -kokonaisuuden vai itse kootun listan.</p>
        <ul>
          <li>${icon("users")}<span><span data-group-min></span>–<span data-group-max></span> <span data-en="people">henkeä</span></span></li>
          <li>${icon("calendar")}<span data-en="At least three days' notice">Vähintään kolme päivää etukäteen</span></li>
          <li>${icon("utensils")}<span data-en="Buffet, à la carte or a custom list">Buffet, à la carte tai oma lista</span></li>
        </ul>
        <a class="btn btn--paper" href="parties.html" data-en="Plan a party">Suunnittele juhlat</a>
      </article>
    </div>
  </div>
</section>

<section class="section on-orange section--tight">
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:1.4rem;align-items:center;justify-content:space-between">
    <div>
      <h2 class="display d3" data-en="Ordering direct costs you less">Suoraan tilaaminen on sinulle halvempaa</h2>
      <p style="max-width:52ch;margin-top:.5rem" data-en="Every dish is €2 dearer on the delivery platforms, because their commission has to go somewhere. Order on WhatsApp or by phone and you pay the price on our own menu.">
        Jokainen annos on kaksi euroa kalliimpi kuljetusalustoilla, koska välityspalkkio on maksettava jostain. Tilaa WhatsAppilla tai puhelimella, niin maksat oman listamme hinnan.</p>
    </div>
    <a class="btn btn--paper" href="menu-a-la-carte.html">
      ${icon("arrow-right")}<span data-en="Build an order">Kokoa tilaus</span></a>
  </div>
</section>
` + footer(true);

/* ── À LA CARTE ───────────────────────────────────────────── */

const alacarte = () => head({
  title: "À la carte — Dewon Fried Chicken",
  desc: "Koko à la carte -lista hintoineen: friteerattu kana, siivet, Korean Bibim Bap, srilankalaiset annokset ja juomat.",
  active: "menu-a-la-carte.html"
}) + phead({
  crumb: "À la carte", crumbEn: "À la carte",
  h1: "À la carte", h1En: "À la carte",
  intro: "Koko lista talon hinnoin. Valitse annokset ensin — päätät vasta lopuksi, tilaatko WhatsAppilla, puhelimella vai Woltista.",
  introEn: "The full list at in-house prices. Pick your dishes first — you decide at the end whether to order on WhatsApp, by phone or through Wolt.",
  meta: `<div class="meta-strip">
    <span>${icon("clock")}<span data-open-now></span></span>
    <span>${icon("map-pin")}<span data-address-street></span></span>
    <span>${icon("wheat-off")}<span data-en="Gluten free on the fried chicken and wings">Gluteeniton friteeratussa kanassa ja siivissä</span></span>
  </div>`
}) + `
<section class="section">
  <div class="wrap">
    <div class="pill-rail" role="tablist" aria-label="Menun osiot" data-menu-rail></div>
    <div data-menu-board></div>

    <p class="note">${icon("shopping-bag")}
      <span data-en="Prices shown are in-house prices. The Wolt price under each line includes the platform's €2 markup.">
        Näytetyt hinnat ovat talon hintoja. Rivin alla oleva Wolt-hinta sisältää alustan kahden euron lisän.</span></p>
  </div>
</section>
` + footer(true);

/* ── BUFFET ───────────────────────────────────────────────── */

const buffet = () => head({
  title: "Lounasbuffet — Dewon Fried Chicken",
  desc: "Dewonin lounasbuffet Tampereen Sammonkadulla. 12,90 €, tiistaisin 13,70 €. Friteerattua kanaa, srilankalaisia ja korealaisia annoksia.",
  active: "menu-buffet.html"
}) + phead({
  crumb: "Lounasbuffet", crumbEn: "Lunch buffet",
  h1: "Lounasbuffet", h1En: "Lunch buffet",
  intro: "Sama yrttimarinadissa friteerattu kana kuin à la cartessa, ja päivän kastike sen päälle. Syödään paikan päällä.",
  introEn: "The same herb-marinated fried chicken as the à la carte list, with the sauce of the day over it. Served in the restaurant.",
  meta: `<div class="meta-strip">
    <span>${icon("clock")}<span data-buffet-days></span> <span data-buffet-time></span></span>
    <span>${icon("map-pin")}<span data-address-street></span></span>
  </div>`
}) + `
<section class="section">
  <div class="wrap">
    <div class="grid g-2" style="margin-bottom:3rem">
      <article class="tier tier--lead">
        <p class="eyebrow" data-en="Monday, Wednesday–Friday">Ma, ke–pe</p>
        <h2 class="display d4" data-en="Buffet">Buffet</h2>
        <p class="tier-price num"><span data-buffet-price></span> <small data-en="/ person">/ hlö</small></p>
        <p class="dim" data-en="Eat in. As much as you like, from the whole spread.">Paikan päällä. Niin paljon kuin haluat, koko pöydästä.</p>
        <ul>
          <li>${icon("check")}<span data-en="Fried chicken, straight from the fryer">Friteerattua kanaa suoraan keittimestä</span></li>
          <li>${icon("check")}<span data-en="Sri Lankan and Korean dishes in rotation">Srilankalaisia ja korealaisia annoksia kierrossa</span></li>
          <li>${icon("check")}<span data-en="Rice, salad and the sauce of the day">Riisi, salaatti ja päivän kastike</span></li>
          <li>${icon("check")}<span data-en="Vegetarian options on the table">Kasvisvaihtoehtoja pöydässä</span></li>
        </ul>
        <a class="btn btn--primary" href="reservations.html?mode=buffet" data-en="Reserve a table">Varaa pöytä</a>
      </article>

      <article class="tier">
        <p class="eyebrow" data-en="Every Tuesday">Joka tiistai</p>
        <h2 class="display d4" data-en="Tuesday buffet">Tiistain buffet</h2>
        <p class="tier-price num"><span data-buffet-tuesday></span> <small data-en="/ person">/ hlö</small></p>
        <p class="dim" data-en="A wider spread on Tuesdays, priced accordingly.">Tiistaisin laajempi pöytä, ja hinta sen mukaan.</p>
        <ul>
          <li>${icon("check")}<span data-en="Everything in the weekday buffet">Kaikki arkibuffetin sisältö</span></li>
          <li>${icon("check")}<span data-en="Plus the Tuesday additions">Lisäksi tiistain lisäykset</span></li>
        </ul>
        <a class="btn btn--paper" href="reservations.html?mode=buffet" data-en="Reserve a table">Varaa pöytä</a>
      </article>
    </div>

    <div class="grid g-2">
      <div>
        <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
        <h2 class="display d3" style="margin-block:.7rem 1.2rem" data-en="What is on the table">Mitä pöydässä on</h2>
        <div>
          <details class="acc" open>
            <summary><span data-en="Fried chicken">Friteerattu kana</span>${icon("chevron-right")}</summary>
            <div class="acc-body"><p data-en="The same Asian herb marinade and herb flour used across the à la carte menu. Fried in batches through the service so it does not sit.">
              Sama aasialainen yrttimarinadi ja yrttijauho kuin à la carte -listalla. Friteerataan erissä koko palvelun ajan, jottei se seiso.</p></div>
          </details>
          <details class="acc">
            <summary><span data-en="Sri Lankan dishes">Srilankalaiset annokset</span>${icon("chevron-right")}</summary>
            <div class="acc-body"><p data-en="Rotating through the week: devilled chicken, fried rice and the spiced vegetable dishes that go with them.">
              Vaihtuvat viikon mittaan: devilled chicken, paistettu riisi ja niiden kanssa tarjottavat maustetut kasvisannokset.</p></div>
          </details>
          <details class="acc">
            <summary><span data-en="Korean dishes">Korealaiset annokset</span>${icon("chevron-right")}</summary>
            <div class="acc-body"><p data-en="Bibimbap components laid out to build your own bowl: seasoned vegetables, rice and gochujang.">
              Bibimbapin osat tarjolla oman kulhon kokoamiseen: maustetut kasvikset, riisi ja gochujang.</p></div>
          </details>
          <details class="acc">
            <summary><span data-en="Sauce of the day">Päivän kastike</span>${icon("chevron-right")}</summary>
            <div class="acc-body"><p data-en="One of the seven house sauces, on rotation. Which one depends on the day.">
              Yksi seitsemästä talon kastikkeesta, kierrossa. Kumpi, riippuu päivästä.</p>
              <a class="linky" href="index.html#sauces" data-en="See the rotation">Katso kierto</a></div>
          </details>
        </div>
        <p class="note" style="margin-top:1.6rem">${icon("clock")}
          <span data-en="Buffet days and serving times are being confirmed with the restaurant. Call before travelling for it.">
            Buffetin päivät ja tarjoiluajat varmistetaan vielä ravintolan kanssa. Soita ennen kuin lähdet varta vasten.</span></p>
      </div>

      <div>
        <div class="bento" style="grid-template-columns:1fr">
          <div>
            <h3 class="display d5" style="margin-bottom:.8rem" data-en="Opening hours">Aukioloajat</h3>
            <ul class="hours-list" data-hours></ul>
          </div>
          <div>
            <h3 class="display d5" style="margin-bottom:.6rem" data-en="Coming as a group?">Tuletteko ryhmänä?</h3>
            <p class="dim" style="font-size:.94rem" data-en="Eight or more is worth telling us about in advance so the table and the fryer are both ready.">
              Kahdeksan tai enemmän kannattaa ilmoittaa etukäteen, jotta pöytä ja keitin ovat valmiina.</p>
            <a class="btn btn--primary btn--sm" style="margin-top:1rem" href="parties.html" data-en="Group booking">Ryhmävaraus</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
` + footer(false);

/* ── PARTIES ──────────────────────────────────────────────── */

const parties = () => head({
  title: "Juhlat & ryhmät — Dewon Fried Chicken",
  desc: "Synttärit, tiimi-illalliset ja ryhmät Dewonilla Tampereella. Buffet, à la carte tai itse koottu lista.",
  active: "parties.html"
}) + phead({
  crumb: "Juhlat & ryhmät", crumbEn: "Parties & groups",
  h1: "Juhlat &amp; ryhmät", h1En: "Parties &amp; groups",
  intro: "Kahdeksasta hengestä ylöspäin. Kerro milloin, montako ja mitä syödään, niin vahvistamme paikan ja hinnan.",
  introEn: "From eight people up. Tell us when, how many and what you want to eat, and we confirm the table and the price.",
  meta: `<div class="meta-strip">
    <span>${icon("users")}<span data-group-min></span>–<span data-group-max></span> <span data-en="people">henkeä</span></span>
    <span>${icon("calendar")}<span data-en="Three days' notice">Kolme päivää etukäteen</span></span>
  </div>`
}) + `
<section class="section">
  <div class="wrap">
    <div class="grid g-3" style="margin-bottom:3.4rem">
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="Birthdays">Synttärit</h3></div>
        <p data-en="A long table, the buffet running, and the chicken coming out in rounds rather than all at once. Bring your own cake — we will keep it out of the way and plate it when you are ready.">
          Pitkä pöytä, buffet käynnissä ja kana ulos erissä yhden ison kasan sijaan. Tuo oma kakku — pidämme sen sivussa ja katamme sen kun olette valmiit.</p>
      </article>
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="Team dinners">Tiimi-illalliset</h3></div>
        <p data-en="Fixed price per head so nobody has to split a bill. Choose the buffet, or a set à la carte selection we agree in advance.">
          Kiinteä hinta per henkilö, jottei kenenkään tarvitse jakaa laskua. Valitse buffet tai etukäteen sovittu à la carte -kokonaisuus.</p>
      </article>
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="Clubs and societies">Seurat ja yhdistykset</h3></div>
        <p data-en="Regular bookings on the same weekday get the same table and the same timing every time. Ask about it once and it stays arranged.">
          Toistuvat varaukset samana viikonpäivänä saavat joka kerta saman pöydän ja saman ajoituksen. Kysy kerran, niin se pysyy sovittuna.</p>
      </article>
    </div>

    <div class="grid g-2">
      <div>
        <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
        <h2 class="display d3" style="margin-block:.7rem 1.1rem" data-en="How it works">Miten se menee</h2>
        <details class="acc" open>
          <summary><span data-en="1 · You send the request">1 · Lähetät pyynnön</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Date, headcount, and whether you want the buffet, à la carte or a list of your own. Nothing is booked at this point.">
            Päivä, henkilömäärä ja se, haluatteko buffetin, à la carten vai oman listan. Mitään ei ole vielä varattu.</p></div>
        </details>
        <details class="acc">
          <summary><span data-en="2 · We reply with a price">2 · Vastaamme hinnalla</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Usually the same day. We confirm what the kitchen can do for that headcount and what it costs per person.">
            Yleensä samana päivänä. Vahvistamme mitä keittiö pystyy tekemään sille määrälle ja mitä se maksaa per henkilö.</p></div>
        </details>
        <details class="acc">
          <summary><span data-en="3 · You confirm">3 · Vahvistat</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Once you say yes, the table is held. Final headcount is needed the day before so nothing is fried for nobody.">
            Kun sanot kyllä, pöytä on varattu. Lopullinen henkilömäärä tarvitaan edellisenä päivänä, jottei mitään friteerata turhaan.</p></div>
        </details>

        <p class="note" style="margin-top:1.6rem">${icon("users")}
          <span data-en="Allergies and gluten free are easier to handle with notice than on the night. Put them in the message.">
            Allergiat ja gluteenittomuus hoituvat helpommin etukäteen kuin illalla. Kirjoita ne viestiin.</span></p>
      </div>

      <div>
        <h2 class="display d4" style="margin-bottom:1.2rem" data-en="Request a party">Pyydä tarjous</h2>
        <form class="form" data-form="party" data-fallback="whatsapp"
              data-subject="Dewon — juhla-/ryhmävaraus">
          <div class="field-row">
            <div class="field">
              <label for="p-name" data-en="Your name">Nimesi</label>
              <input id="p-name" name="name" required autocomplete="name">
            </div>
            <div class="field">
              <label for="p-phone" data-en="Phone">Puhelin</label>
              <input id="p-phone" name="phone" type="tel" required autocomplete="tel">
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="p-date" data-en="Date">Päivä</label>
              <input id="p-date" name="date" type="date" required data-min-days="3">
            </div>
            <div class="field">
              <label for="p-people" data-en="People">Henkilöä</label>
              <input id="p-people" name="people" type="number" min="8" max="60" value="12" required>
            </div>
          </div>
          <fieldset class="fieldset">
            <legend data-en="What should we serve?">Mitä tarjoillaan?</legend>
            <div class="radio-cards">
              <label class="radio-card"><input type="radio" name="serving" value="buffet" checked>
                <b data-en="Buffet">Buffet</b><span data-en="Per head, everyone helps themselves">Per henkilö, jokainen ottaa itse</span></label>
              <label class="radio-card"><input type="radio" name="serving" value="alacarte">
                <b data-en="À la carte">À la carte</b><span data-en="A set selection we agree">Sovittu kokonaisuus</span></label>
              <label class="radio-card"><input type="radio" name="serving" value="custom">
                <b data-en="Our own list">Oma lista</b><span data-en="Tell us below">Kerro alla</span></label>
            </div>
          </fieldset>
          <div class="field">
            <label for="p-notes" data-en="Anything we should know">Mitä meidän pitäisi tietää</label>
            <textarea id="p-notes" name="notes" placeholder="Allergiat, gluteenittomat, kakku, aikataulu…"
                      data-en-ph="Allergies, gluten free, cake, timings…"></textarea>
          </div>
          <button class="btn btn--primary btn--block" type="submit">
            ${icon("message-circle")}<span data-en="Send the request">Lähetä pyyntö</span></button>
          <p class="dim" style="font-size:.86rem" data-en="This sends a request, not a confirmed booking. We reply before anything is held.">
            Tämä lähettää pyynnön, ei vahvistettua varausta. Vastaamme ennen kuin mitään varataan.</p>
          <p class="form-status" data-form-status role="status"></p>
        </form>
      </div>
    </div>
  </div>
</section>
` + footer(false);

/* ── RESERVATIONS ─────────────────────────────────────────── */

const reservations = () => head({
  title: "Varaukset — Dewon Fried Chicken",
  desc: "Varaa pöytä Dewonilta Tampereen Sammonkadulta. Buffet, à la carte tai itse koottu toivelista.",
  active: "reservations.html"
}) + phead({
  crumb: "Varaukset", crumbEn: "Reservations",
  h1: "Varaa pöytä", h1En: "Book a table",
  intro: "Kolme tapaa: tulet buffetille, syöt à la cartelta tai kokoat listan valmiiksi. Kaikki kolme lähtevät pyyntönä — vahvistamme aina erikseen.",
  introEn: "Three ways: come for the buffet, eat à la carte, or put a list together in advance. All three go out as requests — we always confirm separately.",
  meta: `<div class="meta-strip">
    <span>${icon("clock")}<span data-open-now></span></span>
    <span>${icon("phone")}<a href="#" data-phone data-phone-text style="color:inherit"></a></span>
  </div>`
}) + `
<section class="section">
  <div class="wrap" style="max-width:820px">
    <form class="form" data-form="reservation" data-fallback="whatsapp"
          data-subject="Dewon — pöytävaraus">

      <fieldset class="fieldset" data-mode-switch>
        <legend data-en="What kind of visit?">Millainen käynti?</legend>
        <div class="radio-cards">
          <label class="radio-card"><input type="radio" name="mode" value="buffet" checked>
            <b data-en="Buffet">Buffet</b><span><span data-buffet-price></span> <span data-en="per person">/ hlö</span></span></label>
          <label class="radio-card"><input type="radio" name="mode" value="alacarte">
            <b data-en="À la carte">À la carte</b><span data-en="Order at the table">Tilaus pöydässä</span></label>
          <label class="radio-card"><input type="radio" name="mode" value="custom">
            <b data-en="Custom request">Oma toivelista</b><span data-en="Pick dishes in advance">Valitse annokset etukäteen</span></label>
        </div>
      </fieldset>

      <div class="field-row">
        <div class="field">
          <label for="r-name" data-en="Your name">Nimesi</label>
          <input id="r-name" name="name" required autocomplete="name">
        </div>
        <div class="field">
          <label for="r-phone" data-en="Phone">Puhelin</label>
          <input id="r-phone" name="phone" type="tel" required autocomplete="tel">
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="r-date" data-en="Date">Päivä</label>
          <input id="r-date" name="date" type="date" required>
        </div>
        <div class="field">
          <label for="r-people" data-en="People">Henkilöä</label>
          <input id="r-people" name="people" type="number" min="1" max="60" value="2" required>
        </div>
      </div>

      <div class="field">
        <label id="slot-label" data-en="Arriving around">Saapuminen noin</label>
        <div class="slots" data-slots="r-time" role="group" aria-labelledby="slot-label">
          ${["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "17:00", "18:00", "19:00", "20:00"]
            .map(s => `<button class="slot" type="button" aria-pressed="false">${s}</button>`).join("\n          ")}
        </div>
        <input type="hidden" id="r-time" name="time" value="">
      </div>

      <div data-mode-panel="buffet">
        <p class="note">${icon("store")}
          <span data-en="The buffet is served in the restaurant only, during buffet hours. If you arrive outside them the à la carte list applies instead.">
            Buffet tarjoillaan vain paikan päällä buffetin aukioloaikoina. Jos saavut niiden ulkopuolella, käytössä on à la carte -lista.</span></p>
      </div>

      <div data-mode-panel="alacarte" hidden>
        <p class="note">${icon("utensils")}
          <span data-en="Nothing to choose now — you order at the table from the full list.">
            Nyt ei tarvitse valita mitään — tilaat pöydässä koko listalta.</span></p>
      </div>

      <div data-mode-panel="custom" hidden>
        <h2 class="display d5" style="margin-bottom:.4rem" data-en="Choose what you would like">Valitse mitä haluaisitte</h2>
        <p class="dim" style="font-size:.92rem;margin-bottom:1rem" data-en="Pick from the buffet or the à la carte list. This is a wish list, not an order — the kitchen confirms what is possible for your date and headcount before anything is fixed.">
          Valitse buffetista tai à la carte -listalta. Tämä on toivelista, ei tilaus — keittiö vahvistaa mikä on mahdollista teidän päivällenne ja henkilömäärällenne ennen kuin mitään lyödään lukkoon.</p>

        <div class="mrow">
          <div class="mrow-main">
            <h4 data-en="Lunch buffet, per person">Lounasbuffet, per henkilö</h4>
            <p data-en="Served in the restaurant during buffet hours.">Tarjoillaan paikan päällä buffetin aikaan.</p>
            <div class="mrow-price num" data-buffet-price></div>
          </div>
          <div class="mrow-media">
            <div class="pslot" data-pslot>
              <span class="pslot-ph" aria-hidden="true">${icon("image")}</span>
            </div>
            <button type="button" class="mrow-add" data-plus data-for="buffet"
                    aria-label="Lisää buffet" data-en-aria="Add buffet">${icon("plus")}</button>
            <div class="stepper" data-stepper="buffet" data-qty="0">
              <button type="button" data-minus aria-label="Poista yksi" data-en-aria="Remove one">${icon("minus")}</button>
              <output>0</output>
              <button type="button" data-plus aria-label="Lisää yksi" data-en-aria="Add one">${icon("plus")}</button>
            </div>
          </div>
        </div>

        <div data-picker style="margin-top:1.4rem"></div>
        <p class="dim" data-picked-count style="margin-top:1rem;font-size:.9rem"></p>
        <div data-picked hidden></div>
      </div>

      <div class="field">
        <label for="r-notes" data-en="Allergies or anything else">Allergiat tai muuta</label>
        <textarea id="r-notes" name="notes" placeholder="Gluteeniton, kasvis, lastenistuin…"
                  data-en-ph="Gluten free, vegetarian, high chair…"></textarea>
      </div>

      <button class="btn btn--primary btn--block" type="submit">
        ${icon("calendar")}<span data-en="Send the request">Lähetä pyyntö</span></button>

      <p class="note">${icon("clock")}
        <span data-en="This is a request. It is not a booking until we reply to confirm it — we answer by phone or WhatsApp, usually the same day.">
          Tämä on pyyntö. Se ei ole varaus ennen kuin vahvistamme sen — vastaamme puhelimitse tai WhatsAppilla, yleensä samana päivänä.</span></p>
      <p class="form-status" data-form-status role="status"></p>
    </form>
  </div>
</section>
` + footer(false);

/* ── FIND US ──────────────────────────────────────────────── */

const findus = () => head({
  title: "Löydä meidät — Dewon Fried Chicken, Sammonkatu 44 Tampere",
  desc: "Dewon Fried Chicken, Sammonkatu 44, 33540 Tampere. Aukioloajat, kartta ja somekanavat.",
  active: "find-us.html"
}) + phead({
  crumb: "Löydä meidät", crumbEn: "Find us",
  h1: "Löydä meidät", h1En: "Find us",
  intro: "Sammonkatu 44, Kaleva. Aukioloajat, kartta ja kanavat, joista näet mitä keittiöstä juuri nyt lähtee.",
  introEn: "Sammonkatu 44, Kaleva. Opening hours, the map, and the channels where you can see what is leaving the kitchen right now."
}) + `
<section class="section">
  <div class="wrap">
    <div class="bento">
      <div class="b-wide b-tall bento-map">
        <iframe title="Kartta: Sammonkatu 44, Tampere" loading="lazy" allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Sammonkatu%2044,%2033540%20Tampere&output=embed"></iframe>
      </div>

      <div>
        <h2 class="display d5" style="margin-bottom:.7rem" data-en="Address">Osoite</h2>
        <address style="font-style:normal;line-height:1.7">
          <span data-address-street></span><br>
          <span data-address-city></span>
        </address>
        <a class="btn btn--primary btn--sm" style="margin-top:1rem" href="#" data-maps target="_blank" rel="noopener">
          ${icon("map-pin")}<span data-en="Open in Maps">Avaa kartalla</span></a>
      </div>

      <div>
        <h2 class="display d5" style="margin-bottom:.7rem" data-en="Call or message">Soita tai viestittele</h2>
        <ul class="social-list">
          <li><a href="#" data-phone>${icon("phone")}<span data-phone-text></span></a></li>
          <li><a href="#" data-whatsapp target="_blank" rel="noopener">${icon("message-circle")}WhatsApp</a></li>
          <li><a href="#" data-email>${icon("mail")}<span data-email-text></span></a></li>
        </ul>
      </div>

      <div class="b-wide">
        <h2 class="display d5" style="margin-bottom:.7rem" data-en="Opening hours">Aukioloajat</h2>
        <ul class="hours-list" data-hours></ul>
        <p class="note" style="margin-top:1rem">${icon("clock")}
          <span data-en="Google and Wolt currently show different closing times. These are being confirmed with the restaurant.">
            Google ja Wolt näyttävät tällä hetkellä eri sulkemisaikoja. Nämä varmistetaan ravintolan kanssa.</span></p>
      </div>

      <div class="b-wide">
        <h2 class="display d5" style="margin-bottom:.7rem" data-en="Follow along">Seuraa</h2>
        <ul class="social-list">
          <li><a href="#" data-instagram target="_blank" rel="noopener">${brandIcon("instagram")}Instagram ${icon("external-link", "ic ic-ext")}</a></li>
          <li><a href="#" data-facebook target="_blank" rel="noopener">${brandIcon("facebook")}Facebook ${icon("external-link", "ic ic-ext")}</a></li>
          <li><a href="#" data-tiktok target="_blank" rel="noopener">${brandIcon("tiktok")}TikTok ${icon("external-link", "ic ic-ext")}</a></li>
          <li><a href="#" data-reviews target="_blank" rel="noopener">${brandIcon("googlemaps")}<span data-en="Google reviews">Google-arvostelut</span> ${icon("external-link", "ic ic-ext")}</a></li>
        </ul>
      </div>

      <div class="b-wide">
        <h2 class="display d5" style="margin-bottom:.7rem" data-en="Delivery">Kuljetus</h2>
        <ul class="social-list">
          <li><a href="#" data-wolt target="_blank" rel="noopener">${icon("shopping-bag")}Wolt Tampere ${icon("external-link", "ic ic-ext")}</a></li>
          <li><a href="#" data-wolt-sastamala target="_blank" rel="noopener">${icon("shopping-bag")}Wolt Sastamala ${icon("external-link", "ic ic-ext")}</a></li>
          <li><a href="#" data-ubereats target="_blank" rel="noopener">${icon("shopping-bag")}Uber Eats ${icon("external-link", "ic ic-ext")}</a></li>
        </ul>
        <p class="dim" style="font-size:.88rem;margin-top:.8rem" data-en="Platform prices carry a €2 markup per dish. Ordering direct does not.">
          Alustojen hinnoissa on kahden euron lisä per annos. Suoraan tilatessa ei ole.</p>
      </div>
    </div>
  </div>
</section>
` + footer(false);

/* ── FRANCHISING ──────────────────────────────────────────── */

const franchising = () => head({
  title: "Franchising — Dewon Fried Chicken",
  desc: "Dewon Fried Chicken franchising Suomessa. Marinadi, resepti ja toimintamalli valmiina — kysy vapaista alueista.",
  active: "franchising.html"
}) + phead({
  crumb: "Franchising", crumbEn: "Franchising",
  h1: "Avaa oma Dewon", h1En: "Open your own Dewon",
  intro: "Tampereella toimiva konsepti, jonka voi rakentaa uudelleen toiselle paikkakunnalle. Marinadi, resepti, hinnoittelu ja toimintamalli tulevat mukana.",
  introEn: "A concept that works in Tampere and can be rebuilt somewhere else. The marinade, the recipe, the pricing and the way of running it come with it."
}) + `
<section class="section">
  <div class="wrap">
    <div class="grid g-3" style="margin-bottom:3.4rem">
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="A recipe that travels">Resepti joka siirtyy</h3></div>
        <p data-en="The herb marinade and the flour blend are the whole product. Both are documented, both are trainable, and neither depends on one person being in the kitchen.">
          Yrttimarinadi ja jauhoseos ovat koko tuote. Molemmat on dokumentoitu, molemmat voi opettaa, eikä kumpikaan ole yhden ihmisen varassa.</p>
      </article>
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="Two revenue lines">Kaksi tulonlähdettä</h3></div>
        <p data-en="À la carte in the evening and a lunch buffet in the middle of the day use the same kitchen, the same marinade and the same staff. The buffet fills the hours that would otherwise be dead.">
          À la carte illalla ja lounasbuffet keskellä päivää käyttävät samaa keittiötä, samaa marinadia ja samoja käsiä. Buffet täyttää tunnit jotka muuten olisivat kuolleita.</p>
      </article>
      <article class="pcard">
        <div class="pcard-top"><h3 data-en="Built for a small site">Pienelle liiketilalle</h3></div>
        <p data-en="The menu is deliberately short and the equipment list is short with it. This is not a concept that needs a large kitchen to work.">
          Lista on tarkoituksella lyhyt, ja laitelista sen mukana. Tämä ei ole konsepti joka vaatii ison keittiön toimiakseen.</p>
      </article>
    </div>

    <div class="grid g-2">
      <div>
        <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
        <h2 class="display d3" style="margin-block:.7rem 1.1rem" data-en="What comes with it">Mitä mukana tulee</h2>
        <details class="acc" open>
          <summary><span data-en="The recipes and the training">Reseptit ja koulutus</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Marinade, flour blend, the seven sauces and the fry timings, plus training in the Tampere kitchen until your team can run a service without help.">
            Marinadi, jauhoseos, seitsemän kastiketta ja friteerausajat, sekä koulutus Tampereen keittiössä siihen asti että tiimisi selviää palvelusta ilman apua.</p></div>
        </details>
        <details class="acc">
          <summary><span data-en="Supply and pricing">Hankinta ja hinnoittelu</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Where the spices come from, what each dish costs to make, and the pricing logic behind the menu — including why every platform price carries a €2 markup.">
            Mistä mausteet tulevat, mitä kukin annos maksaa tehdä ja mikä logiikka listan hinnoittelun takana on — mukaan lukien se, miksi jokaisessa alustahinnassa on kahden euron lisä.</p></div>
        </details>
        <details class="acc">
          <summary><span data-en="Brand and this website">Brändi ja tämä sivusto</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="The name, the mark, the menu design and this site, set up for your address and your opening hours.">
            Nimi, tunnus, listan ulkoasu ja tämä sivusto, pystytettynä sinun osoitteellesi ja aukioloajoillesi.</p></div>
        </details>
        <details class="acc">
          <summary><span data-en="What we look for">Mitä etsimme</span>${icon("chevron-right")}</summary>
          <div class="acc-body"><p data-en="Someone who will be in the restaurant rather than owning it from a distance, a site with lunch footfall on weekdays, and the patience to run the first year properly.">
            Ihmistä joka on itse ravintolassa eikä omista sitä etäältä, liiketilaa jossa on arkisin lounasvirtaa, ja kärsivällisyyttä hoitaa ensimmäinen vuosi kunnolla.</p></div>
        </details>

        <p class="note" style="margin-top:1.6rem">${icon("handshake")}
          <span data-en="Terms, fees and territory are agreed case by case. Nothing is standardised yet — ask, and you get a straight answer.">
            Ehdot, maksut ja alue sovitaan tapauskohtaisesti. Mitään ei ole vielä vakioitu — kysy, niin saat suoran vastauksen.</span></p>
      </div>

      <div>
        <h2 class="display d4" style="margin-bottom:1.2rem" data-en="Ask about a territory">Kysy alueesta</h2>
        <form class="form" data-form="franchise" data-fallback="email"
              data-mailto="dewonfriedchicken@gmail.com"
              data-subject="Dewon — franchising-tiedustelu">
          <div class="field-row">
            <div class="field">
              <label for="f-name" data-en="Your name">Nimesi</label>
              <input id="f-name" name="name" required autocomplete="name">
            </div>
            <div class="field">
              <label for="f-email" data-en="Email">Sähköposti</label>
              <input id="f-email" name="email" type="email" required autocomplete="email">
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-phone" data-en="Phone">Puhelin</label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel">
            </div>
            <div class="field">
              <label for="f-city" data-en="City or area">Kaupunki tai alue</label>
              <input id="f-city" name="city" required>
            </div>
          </div>
          <fieldset class="fieldset">
            <legend data-en="Where are you at?">Missä vaiheessa olet?</legend>
            <div class="radio-cards">
              <label class="radio-card"><input type="radio" name="stage" value="exploring" checked>
                <b data-en="Exploring">Kartoitan</b><span data-en="Gathering information">Keräilen tietoa</span></label>
              <label class="radio-card"><input type="radio" name="stage" value="site">
                <b data-en="Have a site">Tila tiedossa</b><span data-en="Premises identified">Liiketila katsottuna</span></label>
              <label class="radio-card"><input type="radio" name="stage" value="ready">
                <b data-en="Ready to go">Valmis</b><span data-en="Funding in place">Rahoitus kunnossa</span></label>
            </div>
          </fieldset>
          <div class="field">
            <label for="f-exp" data-en="Restaurant experience">Ravintolakokemus</label>
            <textarea id="f-exp" name="experience" placeholder="Mitä olet tehnyt aiemmin, ja kuka pyörittäisi paikkaa päivittäin?"
                      data-en-ph="What have you done before, and who would run the place day to day?"></textarea>
          </div>
          <button class="btn btn--primary btn--block" type="submit">
            ${icon("mail")}<span data-en="Send the enquiry">Lähetä tiedustelu</span></button>
          <p class="dim" style="font-size:.86rem">
            <span data-en="Goes to">Menee osoitteeseen</span>
            <a class="linky" href="#" data-franchise-email data-email-text></a></p>
          <p class="form-status" data-form-status role="status"></p>
        </form>
      </div>
    </div>
  </div>
</section>
` + footer(false);

/* ── write ────────────────────────────────────────────────── */

const PAGES = {
  "index.html": home,
  "menu-a-la-carte.html": alacarte,
  "menu-buffet.html": buffet,
  "parties.html": parties,
  "reservations.html": reservations,
  "find-us.html": findus,
  "franchising.html": franchising
};

for (const [file, fn] of Object.entries(PAGES)) {
  fs.writeFileSync(path.join(ROOT, file), fn(), "utf8");
  console.log("wrote", file);
}
