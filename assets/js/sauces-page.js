/* The sauces widget (sauces.html). Kept in its own file rather than inline
   so the site-wide Content-Security-Policy can forbid inline scripts. */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────
     1. DATA — base colour, swirl colours, and FI / EN names.
        swirls: [outer ring, inner ring, centre dab]
     ────────────────────────────────────────────────────────── */
  var SAUCE_DATA = {
    header: { fi: "Kastikkeet", en: "Sauces" },
    note: {
      fi: "Kaikki seitsemän talon kastiketta, aina pöydässä. Värit ovat viitteellisiä.",
      en: "All seven house sauces, always on the table. Colours are indicative."
    },
    sauces: [
      {
        base: "#B5341F",
        swirls: ["#DE6A44", "#7C1E11", "#F0CBA6"],
        name: { fi: "Dewon Special -kastike", en: "Dewon Special sauce" }
      },
      {
        base: "#E9E1C2",
        swirls: ["#CE7B3B", "#7E9C57", "#F3ECD6"],
        name: {
          fi: "Kermainen yrttikastike (sweet and spicy) G",
          en: "Creamy herb sauce (sweet and spicy) G"
        }
      },
      {
        base: "#E6DFBF",
        swirls: ["#A9834E", "#6F8F55", "#F1EBD4"],
        name: {
          fi: "Kermainen yrttikastike (sweet and savoury) G",
          en: "Creamy herb sauce (sweet and savoury) G"
        }
      },
      {
        base: "#DC5A22",
        swirls: ["#F5894C", "#A83E12", "#FFD3AC"],
        name: { fi: "Chili Meedium", en: "Medium Chili" }
      },
      {
        base: "#8C1507",
        swirls: ["#C6331A", "#500A02", "#E96B3C"],
        name: { fi: "Chili Tulinen", en: "Hot Chili" }
      },
      {
        base: "#754117",
        swirls: ["#AC7333", "#3F230D", "#E1B673"],
        name: { fi: "Hunajasoija", en: "Honey Soy" }
      },
      {
        base: "#C93C1A",
        swirls: ["#EB6F33", "#88230F", "#F7BB92"],
        name: { fi: "Buffalokastike", en: "Buffalo Sauce" }
      }
    ]
  };

  /* ──────────────────────────────────────────────────────────
     2. REUSABLE TOP-DOWN SVG BOWL
        viewBox 0 0 200 200, transparent background.
        - thick off-white ceramic rim + soft inner shadow
        - solid base circle  (data: base hex)
        - 2–3 concentric swirl arcs  (data: swirl hexes)
        - soft white gloss crescent near the top
     ────────────────────────────────────────────────────────── */
  function swirl(s, i) {
    return (s.swirls && s.swirls[i]) || s.swirls[0] || "#ffffff";
  }

  function bowlSVG(s, i) {
    var cid = "sauceClip" + i;
    var gid = "sauceShade" + i;
    return '' +
    '<svg class="bowl" viewBox="0 0 200 200" role="img" aria-hidden="true">' +
      '<defs>' +
        '<clipPath id="' + cid + '"><circle cx="100" cy="100" r="78"/></clipPath>' +
        '<radialGradient id="' + gid + '" cx="50%" cy="50%" r="50%">' +
          '<stop offset="50%" stop-color="#000" stop-opacity="0"/>' +
          '<stop offset="86%" stop-color="#000" stop-opacity="0.10"/>' +
          '<stop offset="100%" stop-color="#000" stop-opacity="0.38"/>' +
        '</radialGradient>' +
      '</defs>' +

      /* ceramic ramekin rim */
      '<circle cx="100" cy="100" r="95" fill="#ECE6DB"/>' +
      '<circle cx="100" cy="100" r="95" fill="none" stroke="#00000022" stroke-width="1.5"/>' +
      '<circle cx="100" cy="100" r="83" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="3"/>' +

      /* sauce base colour */
      '<circle cx="100" cy="100" r="78" fill="' + s.base + '"/>' +

      /* everything below is clipped to the sauce disc */
      '<g clip-path="url(#' + cid + ')">' +
        /* concentric "settling sauce" swirls */
        '<circle cx="100" cy="100" r="60" fill="none" stroke="' + swirl(s, 0) + '" ' +
          'stroke-width="17" stroke-linecap="round" stroke-dasharray="215 999" ' +
          'transform="rotate(-42 100 100)" opacity="0.9"/>' +
        '<circle cx="100" cy="100" r="37" fill="none" stroke="' + swirl(s, 1) + '" ' +
          'stroke-width="14" stroke-linecap="round" stroke-dasharray="150 999" ' +
          'transform="rotate(146 100 100)" opacity="0.92"/>' +
        '<circle cx="100" cy="100" r="14" fill="' + swirl(s, 2) + '"/>' +

        /* inner shadow for depth */
        '<circle cx="100" cy="100" r="78" fill="url(#' + gid + ')"/>' +

        /* glossy highlight crescent near the top */
        '<path d="M50 60 Q100 24 150 60 Q100 44 50 60 Z" fill="#ffffff" opacity="0.18"/>' +
      '</g>' +
    '</svg>';
  }

  /* ──────────────────────────────────────────────────────────
     3. RENDER + LANGUAGE TOGGLE
     ────────────────────────────────────────────────────────── */
  var lang = "fi";
  try {
    var saved = localStorage.getItem("dewon-lang");
    if (saved === "fi" || saved === "en") lang = saved;
  } catch (e) {}

  var grid   = document.querySelector("[data-sauce-grid]");
  var header = document.querySelector("[data-sauce-header]");
  var note   = document.querySelector("[data-sauce-note]");
  var langButtons = document.querySelectorAll(".lang-toggle button");

  /* Wrap a trailing " G" (gluten-free marker) in a muted span. */
  function nameHTML(str) {
    return str.replace(/\sG$/, ' <span class="g">G</span>');
  }

  function buildGrid() {
    grid.innerHTML = SAUCE_DATA.sauces.map(function (s, i) {
      return '' +
        '<figure class="sauce">' +
          bowlSVG(s, i) +
          '<figcaption class="sauce-name" data-name-index="' + i + '">' +
            nameHTML(s.name[lang]) +
          '</figcaption>' +
        '</figure>';
    }).join("");
  }

  function applyText() {
    document.documentElement.lang = lang;
    header.textContent = SAUCE_DATA.header[lang];
    note.textContent = SAUCE_DATA.note[lang];
    grid.querySelectorAll("[data-name-index]").forEach(function (el) {
      var s = SAUCE_DATA.sauces[+el.getAttribute("data-name-index")];
      el.innerHTML = nameHTML(s.name[lang]);
    });
    langButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem("dewon-lang", next); } catch (e) {}
    applyText();
  }

  langButtons.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  buildGrid();
  applyText();
})();
