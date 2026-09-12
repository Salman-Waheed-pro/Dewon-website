/* ══════════════════════════════════════════════════════════════
   Dewon Fried Chicken — shared behaviour for every page.

   Nothing here knows about a specific page. Each feature looks for
   its own data-* hooks and does nothing if they are absent, so one
   file can serve the home page and the reservation form alike.
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var CFG  = window.DEWON || {};
  var MENU = window.DEWON_MENU || { categories: [], tagLabels: {} };
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── language ─────────────────────────────────────────────── */

  var lang = "fi";
  function readLang() {
    var saved = null;
    try { saved = localStorage.getItem("dewon-lang"); } catch (e) {}
    if (saved === "fi" || saved === "en") return saved;
    /* Search crawlers report an English browser. Without this, Google
       renders and indexes the English text while every title, meta tag
       and the html lang say Finnish — and loses the Finnish local search
       phrases the pages are written for. Crawlers always get Finnish. */
    if (/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|lighthouse|inspectiontool/i.test(navigator.userAgent || "")) return "fi";
    if (CFG.autoDetectLanguage && navigator.language &&
        navigator.language.toLowerCase().indexOf("fi") !== 0) return "en";
    return "fi";
  }
  function t(obj) { if (!obj) return ""; return obj[lang] != null ? obj[lang] : (obj.fi || ""); }

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem("dewon-lang", next); } catch (e) {}
    document.documentElement.lang = next;

    $$("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-fi")) el.setAttribute("data-fi", el.innerHTML);
      el.innerHTML = el.getAttribute(next === "en" ? "data-en" : "data-fi");
    });
    $$("[data-en-aria]").forEach(function (el) {
      if (!el.hasAttribute("data-fi-aria")) el.setAttribute("data-fi-aria", el.getAttribute("aria-label") || "");
      el.setAttribute("aria-label", el.getAttribute(next === "en" ? "data-en-aria" : "data-fi-aria"));
    });
    $$("[data-en-ph]").forEach(function (el) {
      if (!el.hasAttribute("data-fi-ph")) el.setAttribute("data-fi-ph", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", el.getAttribute(next === "en" ? "data-en-ph" : "data-fi-ph"));
    });
    $$("[data-lang-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-btn") === next));
    });

    document.dispatchEvent(new CustomEvent("dewon:lang", { detail: { lang: next } }));
  }

  /* ── config wiring ────────────────────────────────────────── */

  function money(n) { return n.toFixed(2).replace(".", ",") + " €"; }

  function wireConfig() {
    var L = CFG.links || {}, A = CFG.address || {};

    $$("[data-phone]").forEach(function (el) {
      el.href = "tel:" + (CFG.phone || "").replace(/\s/g, "");
      if (el.hasAttribute("data-phone-text")) el.textContent = CFG.phone || "";
    });
    $$("[data-whatsapp]").forEach(function (el) {
      el.href = "https://wa.me/" + (CFG.whatsapp || "");
    });
    $$("[data-email]").forEach(function (el) {
      el.href = "mailto:" + (CFG.email || "");
      if (el.hasAttribute("data-email-text")) el.textContent = CFG.email || "";
    });
    $$("[data-franchise-email]").forEach(function (el) {
      el.href = "mailto:" + (CFG.franchiseEmail || "");
      if (el.hasAttribute("data-email-text")) el.textContent = CFG.franchiseEmail || "";
    });

    /* An optional link with no URL is removed rather than left dead. */
    var optional = {
      "[data-wolt]": L.wolt, "[data-resq]": L.resq,
      "[data-ubereats]": L.ubereats, "[data-foodora]": L.foodora,
      "[data-instagram]": L.instagram, "[data-facebook]": L.facebook,
      "[data-tiktok]": L.tiktok, "[data-reviews]": L.reviews, "[data-maps]": A.maps
    };
    Object.keys(optional).forEach(function (sel) {
      var url = optional[sel];
      $$(sel).forEach(function (el) {
        if (url) { el.href = url; }
        else { (el.closest("li") || el.closest("[data-optional]") || el).remove(); }
      });
    });

    $$("[data-address-street]").forEach(function (e) { e.textContent = A.street || ""; });
    $$("[data-address-city]").forEach(function (e) { e.textContent = (A.postcode || "") + " " + (A.city || ""); });
    $$("[data-rating-score]").forEach(function (e) { e.textContent = (CFG.rating || {}).score || ""; });
    $$("[data-rating-count]").forEach(function (e) { e.textContent = (CFG.rating || {}).count || ""; });

    var B = (MENU.buffet || {});
    $$("[data-buffet-price]").forEach(function (e) { e.textContent = money(B.price || 0); });
    $$("[data-buffet-time]").forEach(function (e) { e.textContent = B.time || ""; });
    $$("[data-buffet-days]").forEach(function (e) { e.textContent = t(B.days); });
    $$("[data-group-min]").forEach(function (e) { e.textContent = (CFG.groups || {}).minPeople || ""; });
    $$("[data-group-max]").forEach(function (e) { e.textContent = (CFG.groups || {}).maxPeople || ""; });
    $$("[data-group-notice]").forEach(function (e) { e.textContent = (CFG.groups || {}).noticeDays || ""; });
  }

  /* ── opening hours ────────────────────────────────────────── */

  var ORDER = ["ma", "ti", "ke", "to", "pe", "la", "su"];

  function todayKey() { return ORDER[(new Date().getDay() + 6) % 7]; }

  function renderHours() {
    var host = $$("[data-hours]");
    if (!host.length) return;
    var today = todayKey();
    host.forEach(function (ul) {
      ul.innerHTML = "";
      (CFG.hours || []).forEach(function (row) {
        var li = document.createElement("li");
        if (row.d === today) li.setAttribute("data-today", "true");
        var name = document.createElement("span");
        name.textContent = ((CFG.dayNames || {})[lang] || {})[row.d] || row.d;
        var val = document.createElement("span");
        val.className = "num";
        val.textContent = row.closed ? (lang === "en" ? "Closed" : "Suljettu") : row.open + "–" + row.close;
        li.appendChild(name); li.appendChild(val);
        ul.appendChild(li);
      });
    });
  }

  function renderOpenNow() {
    var els = $$("[data-open-now]");
    if (!els.length) return;
    var toM = function (s) { var p = s.split(":"); return (+p[0]) * 60 + (+p[1]); };
    var hoursByDay = {};
    (CFG.hours || []).forEach(function (r) { hoursByDay[r.d] = r; });

    var todayIdx = ORDER.indexOf(todayKey());
    var row = hoursByDay[todayKey()];
    var now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    var open = false, beforeOpenToday = false;
    if (row && !row.closed) {
      open = mins >= toM(row.open) && mins < toM(row.close);
      beforeOpenToday = mins < toM(row.open);
    }

    var text;
    if (open) {
      text = lang === "en" ? "Open now until " + row.close : "Auki nyt " + row.close + " asti";
    } else if (beforeOpenToday) {
      text = lang === "en" ? "Opens today at " + row.open : "Avaa tänään " + row.open;
    } else {
      /* Walk forward to the next day that is not marked closed. */
      var next = null, aheadDays = 0;
      for (var i = 1; i <= 7; i++) {
        var d = ORDER[(todayIdx + i) % 7];
        if (hoursByDay[d] && !hoursByDay[d].closed) { next = hoursByDay[d]; aheadDays = i; break; }
      }
      if (next) {
        var when = aheadDays === 1
          ? (lang === "en" ? "tomorrow" : "huomenna")
          : (((CFG.dayNames || {})[lang] || {})[next.d] || next.d);
        text = lang === "en" ? "Closed, opens " + when + " at " + next.open
                              : "Suljettu, avaa " + when + " klo " + next.open;
      } else {
        text = lang === "en" ? "Closed right now" : "Suljettu juuri nyt";
      }
    }

    els.forEach(function (el) {
      el.textContent = text;
      el.setAttribute("data-state", open ? "open" : "closed");
    });
  }

  /* ── sauces ───────────────────────────────────────────────── */

  /* All seven are on the table every day — this is a grid of what's
     available, not a "today's pick" rotation, so no day is singled out. */
  function renderSauces() {
    var host = $("[data-sauces]");
    if (!host) return;
    host.innerHTML = "";
    (CFG.sauces || []).forEach(function (s, i) {
      var row = document.createElement("div");
      row.className = "sauce-row";
      var b = document.createElement("b"); b.textContent = String(i + 1).padStart(2, "0");
      var n = document.createElement("span"); n.textContent = t(s);
      row.appendChild(b); row.appendChild(n);
      host.appendChild(row);
    });
  }

  /* ── rotating buffet menu ─────────────────────────────────── */

  /* The content lives in buffet-menu.js, written for the owner to edit:
     dishes are "Finnish | English" strings, days are looked up by their
     `day` number. The buffet is served on weekdays only, so the cycle
     counts Monday–Friday from startDate and skips weekends. Dates are
     Finnish calendar dates, so a visitor abroad sees the same "today"
     as the restaurant. Visitors only ever see dates, never day numbers. */
  var BUFFET = window.DEWON_BUFFET || null;
  var CYCLE = 24;
  var DAY_MS = 864e5;
  var CAL_DAYS = 10;             /* buffet days in the calendar: two weeks */
  var buffetView = 0;            /* which calendar day the board shows */

  var BUFFET_TXT = {
    today:     { fi: "Tänään",   en: "Today" },
    tomorrow:  { fi: "Huomenna", en: "Tomorrow" },
    todayHead: { fi: "Tänään buffetissa", en: "On the buffet today" },
    nextHead:  { fi: "Seuraava buffet",   en: "Next buffet" },
    weekdays:  { fi: "buffet arkisin",    en: "buffet on weekdays" },
    preview:   { fi: "Esikatselu: päivä", en: "Preview: day" },
    missing:   { fi: "Tämän päivän listaa ei ole vielä julkaistu. Kysy henkilökunnalta.",
                 en: "This day's menu has not been published yet. Ask the staff." },
    always:    { fi: "Mukana", en: "Comes with" }
  };

  /* Three panels, left to right: the salad bar, the mains, then
     desserts and drinks. A section with no label is the panel's own
     core list — the salad bar vegetables are the salad bar. */
  var BUFFET_GROUPS = [
    { id: "salad", fi: "Salaattipöytä", en: "Salad bar", icon: "leaf", tone: "salad", sections: [
      { key: "kasvikset", cols: "wide" },
      { key: "salaatit", fi: "Ruokaisat salaatit", en: "Hearty salads" },
      { key: "hedelmat", fi: "Hedelmät", en: "Fruit", cols: 2 }
    ] },
    { id: "mains", fi: "Pääruoat", en: "Mains", icon: "flame", tone: "curry", sections: [
      { key: "kana", fi: "Friteerattu kana", en: "Fried chicken",
        parts: [["pala", "Pala", "Cut"], ["kastike", "Kastike", "Sauce"]] },
      { key: "srilankalainen", fi: "Srilankalainen pääruoka", en: "Sri Lankan main",
        parts: [["liha", "Liha", "Meat"], ["riisi", "Riisi", "Rice"], ["kasvis", "Kasvis", "Veg"]] },
      { key: "suomalainen", fi: "Suomalainen pääruoka", en: "Finnish main",
        parts: [["paaruoka", "Pääruoka", "Main"], ["lisuke", "Lisuke", "Side"], ["kasvis", "Kasvis", "Veg"]] },
      { key: "keitto", fi: "Keitto", en: "Soup" },
      { key: "lisukkeet", fi: "Rapeat lisukkeet", en: "Crispy sides" },
      { key: "leipa", fi: "Leipä", en: "Bread" }
    ] },
    { id: "sweet", fi: "Jälkiruoat & juomat", en: "Desserts & drinks", icon: "star", tone: "sweet", sections: [
      { key: "jalkiruoka", fi: "Jälkiruoat", en: "Desserts", stack: true,
        parts: [["suomalainen", "Suomalainen", "Finnish"], ["srilankalainen", "Srilankalainen", "Sri Lankan"]] },
      { every: "kylmatJuomat", fi: "Kylmät juomat", en: "Cold drinks", cols: 2 },
      { every: "kuumatJuomat", fi: "Kuumat juomat", en: "Hot drinks", cols: 2 }
    ] }
  ];

  /* The owner may write the cut in Finnish or English. */
  var CUTS = {
    siivet: "wings", siipi: "wings", wings: "wings", wing: "wings",
    koivet: "drumsticks", koipi: "drumsticks", koipireidet: "drumsticks", drumsticks: "drumsticks", drumstick: "drumsticks",
    luuton: "boneless", boneless: "boneless"
  };
  var CUT_INFO = {
    wings:      { fi: "Siivet", en: "Wings",      img: "assets/images/buffet/cut-wings.png" },
    drumsticks: { fi: "Koivet", en: "Drumsticks", img: "assets/images/buffet/cut-drumsticks.png" },
    boneless:   { fi: "Luuton", en: "Boneless",   img: "assets/images/buffet/cut-boneless.png" }
  };

  /* "Lohikeitto | Salmon soup" → the half for the current language. */
  function dish(s) {
    if (s == null) return "";
    var parts = String(s).split("|");
    var fi = parts[0].trim(), en = (parts[1] || parts[0]).trim();
    return lang === "en" ? en : fi;
  }
  function cutOf(day) {
    var raw = String(((day || {}).kana || {}).pala || "").trim().toLowerCase();
    return CUT_INFO[CUTS[raw]] || null;
  }

  /* Today's date in Helsinki as a UTC-midnight timestamp, so day
     arithmetic never trips over DST or the visitor's own time zone. */
  function helsinkiToday() {
    var y, m, d;
    try {
      var p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit", day: "2-digit" })
        .format(new Date()).split("-");
      y = +p[0]; m = +p[1]; d = +p[2];
    } catch (e) { var n = new Date(); y = n.getFullYear(); m = n.getMonth() + 1; d = n.getDate(); }
    return Date.UTC(y, m - 1, d);
  }
  function parseISO(s) {
    var p = String(s || "").split("-");
    return p.length === 3 ? Date.UTC(+p[0], +p[1] - 1, +p[2]) : NaN;
  }
  function isWeekday(ts) { var w = new Date(ts).getUTCDay(); return w !== 0 && w !== 6; }
  function nextBuffetDay(ts) { while (!isWeekday(ts)) ts += DAY_MS; return ts; }
  /* Weekdays in [a, b) — negative when b is before a. Whole weeks count
     five each; the leftover days are checked one by one. */
  function weekdaysBetween(a, b) {
    var days = Math.round((b - a) / DAY_MS);
    var weeks = Math.floor(days / 7), rest = days - weeks * 7, n = weeks * 5;
    var wd = new Date(a).getUTCDay();
    for (var i = 0; i < rest; i++) { var x = (wd + i) % 7; if (x !== 0 && x !== 6) n++; }
    return n;
  }
  /* 1..24 for a weekday. Dates before startDate count backwards through
     the cycle rather than breaking. */
  function cycleDay(ts) {
    var start = parseISO(BUFFET && BUFFET.startDate);
    start = nextBuffetDay(isNaN(start) ? ts : start);
    var n = weekdaysBetween(start, ts);
    return (((n % CYCLE) + CYCLE) % CYCLE) + 1;
  }
  function buffetDay(n) {
    var days = (BUFFET && BUFFET.days) || [];
    for (var i = 0; i < days.length; i++) if (+days[i].day === n) return days[i];
    return null;
  }
  /* ?day=17 shows that day of the file directly, for checking an edit. */
  function previewDay() {
    var m = /[?&]day=(\d+)/.exec(window.location.search);
    var n = m ? parseInt(m[1], 10) : 0;
    return n >= 1 && n <= CYCLE ? n : 0;
  }
  /* The next CAL_DAYS buffet days, starting today if today is one. */
  function calendarDays(today) {
    var out = [], ts = nextBuffetDay(today);
    while (out.length < CAL_DAYS) { if (isWeekday(ts)) out.push(ts); ts += DAY_MS; }
    return out;
  }

  var WEEKDAY = ["su", "ma", "ti", "ke", "to", "pe", "la"];
  var MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function dayName(ts) { return ((CFG.dayNames || {})[lang] || {})[WEEKDAY[new Date(ts).getUTCDay()]] || ""; }
  function shortDate(ts) {
    var d = new Date(ts);
    return lang === "en" ? d.getUTCDate() + " " + MONTH_EN[d.getUTCMonth()]
                         : d.getUTCDate() + "." + (d.getUTCMonth() + 1) + ".";
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function ic(n) {
    return '<svg class="ic' + (/-solid$/.test(n) ? ' ic--solid' : '') + '" aria-hidden="true"><use href="#i-' + n + '"></use></svg>';
  }

  function buffetList(items, cols) {
    return '<ul class="blist' + (cols === "wide" ? ' blist--2w' : cols ? ' blist--2' : '') + '">' +
      (items || []).map(function (s) { return '<li>' + esc(dish(s)) + '</li>'; }).join("") + '</ul>';
  }

  function buffetSection(sec, day) {
    var body, thumb = "";
    if (sec.every) {
      body = buffetList((BUFFET.everyDay || {})[sec.every], sec.cols);
    } else if (sec.parts) {
      var val = day[sec.key] || {};
      var li = function (tag, v) { return v ? '<li><span class="bl-tag">' + tag + '</span><span>' + esc(v) + '</span></li>' : ""; };
      body = '<ul class="blist ' + (sec.stack ? 'blist--stack' : 'blist--parts') + '">' + sec.parts.map(function (p) {
        var v = sec.key === "kana" && p[0] === "pala" && cutOf(day) ? t(cutOf(day)) : dish(val[p[0]]);
        return li(lang === "en" ? p[2] : p[1], v);
      }).join("") +
      /* Fries and onion rings come with the chicken every day — the same
         for all 24 days, so they come from everyDay, not the day. */
      (sec.key === "kana" ? li(t(BUFFET_TXT.always), ((BUFFET.everyDay || {}).kanaLisukkeet || []).map(dish).join(", ")) : "") +
      '</ul>';
    } else {
      body = buffetList(day[sec.key], sec.cols);
    }
    if (sec.key === "kana") {
      var cut = cutOf(day);
      if (cut) thumb = '<img class="bsec-thumb" src="' + cut.img + '" alt="" width="480" height="320" loading="lazy">';
    }
    return '<div class="bsec bsec--' + (sec.key || sec.every) + '">' +
      (sec.fi ? '<h4 class="bsec-head"><span>' + t(sec) + '</span>' + thumb + '</h4>' : '') +
      body + '</div>';
  }

  /* keepRail: a calendar click only moves the selection, so the tabs are
     not rebuilt (which would drop focus and the strip's scroll position). */
  function renderBuffetMenu(keepRail) {
    var board = $("[data-buffet-board]");
    var teaser = $("[data-buffet-today]");
    if (!BUFFET || (!board && !teaser)) return;

    var today = helsinkiToday();
    var days = calendarDays(today);
    var preview = previewDay();
    var time = (MENU.buffet || {}).time || "";

    /* The day's highlights at the top: today, or the next buffet day
       when it is the weekend. */
    if (teaser) {
      var ts0 = days[0], d0 = buffetDay(cycleDay(ts0)), isToday = ts0 === today;
      var title = $("[data-buffet-today-title]", teaser);
      if (title) title.textContent = t(isToday ? BUFFET_TXT.todayHead : BUFFET_TXT.nextHead);
      var dateEl = $("[data-buffet-today-date]", teaser);
      if (dateEl) dateEl.textContent = dayName(ts0) + " " + shortDate(ts0) + (time ? " · " + time : "") +
        (isToday ? "" : " · " + t(BUFFET_TXT.weekdays));
      var list = $("[data-buffet-today-list]", teaser);
      var fig = $("[data-buffet-today-cut]", teaser);
      if (list) {
        if (!d0) { list.innerHTML = '<li>' + t(BUFFET_TXT.missing) + '</li>'; if (fig) fig.hidden = true; }
        else {
          var cut0 = cutOf(d0);
          var rows = [
            ["flame", "golden", { fi: "Friteerattu kana", en: "Fried chicken" }, [cut0 ? t(cut0) : "", dish((d0.kana || {}).kastike)]],
            ["utensils", "curry", { fi: "Srilankalainen", en: "Sri Lankan" }, [dish((d0.srilankalainen || {}).liha), dish((d0.srilankalainen || {}).kasvis)]],
            ["store", "finnish", { fi: "Suomalainen", en: "Finnish" }, [dish((d0.suomalainen || {}).paaruoka), dish((d0.suomalainen || {}).lisuke)]],
            ["utensils", "soup", { fi: "Keitto", en: "Soup" }, [dish((d0.keitto || [])[0])]],
            ["star", "sweet", { fi: "Jälkiruoat", en: "Desserts" }, [dish((d0.jalkiruoka || {}).suomalainen), dish((d0.jalkiruoka || {}).srilankalainen)]]
          ];
          list.innerHTML = rows.map(function (r) {
            return '<li><span class="bt-ic bcard--' + r[1] + '">' + ic(r[0]) + '</span><span><b>' + t(r[2]) + '</b>' +
              esc(r[3].filter(Boolean).join(" · ")) + '</span></li>';
          }).join("");
          if (fig) {
            fig.hidden = !cut0;
            if (cut0) fig.innerHTML = '<img src="' + cut0.img + '" alt="' + esc(t(cut0)) + '" width="480" height="320">';
          }
        }
      }
    }

    if (!board) return;
    if (buffetView >= days.length) buffetView = 0;

    /* The calendar: the next two weeks of buffet days. */
    var rail = $("[data-buffet-rail]");
    if (rail && keepRail) {
      $$("[data-offset]", rail).forEach(function (b) {
        b.setAttribute("aria-selected", String(+b.getAttribute("data-offset") === buffetView));
      });
    } else if (rail) {
      rail.innerHTML = "";
      days.forEach(function (ts, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cal-day";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-controls", "buffet-board");
        b.setAttribute("aria-selected", String(!preview && i === buffetView));
        b.setAttribute("data-offset", String(i));
        var top = ts === today ? t(BUFFET_TXT.today)
                : ts === today + DAY_MS ? t(BUFFET_TXT.tomorrow)
                : dayName(ts).slice(0, lang === "en" ? 3 : 2);
        b.setAttribute("aria-label", dayName(ts) + " " + shortDate(ts));
        b.innerHTML = '<span class="cal-wd">' + esc(top) + '</span><span class="cal-date num">' + shortDate(ts) + '</span>';
        /* A gap in the strip where a weekend falls. */
        if (i > 0 && ts - days[i - 1] > DAY_MS) b.classList.add("cal-day--week");
        rail.appendChild(b);
      });
    }

    var viewTs = days[buffetView];
    var n = preview || cycleDay(viewTs);
    var day = buffetDay(n);

    var head = $("[data-buffet-day-label]");
    if (head) {
      head.textContent = preview ? t(BUFFET_TXT.preview) + " " + n : dayName(viewTs) + " " + shortDate(viewTs);
      head.classList.toggle("is-preview", !!preview);
    }

    board.innerHTML = day
      ? BUFFET_GROUPS.map(function (g) {
          return '<section class="bpanel bpanel--' + g.id + ' bcard--' + g.tone + '">' +
            '<h3 class="bpanel-head"><span class="bcard-ic">' + ic(g.icon) + '</span>' + t(g) + '</h3>' +
            '<div class="bpanel-body"><div class="bpanel-grid">' +
              g.sections.map(function (s) { return buffetSection(s, day); }).join("") + '</div></div>' +
          '</section>';
        }).join("")
      : '<p class="note">' + ic("clock") + '<span>' + t(BUFFET_TXT.missing) + '</span></p>';

    if (window.console && day) {
      /* A nudge for whoever edits the file — never shown to visitors. */
      var want = { keitto: 1, leipa: 3, hedelmat: 4, salaatit: 2, kasvikset: 8, lisukkeet: 3 };
      Object.keys(want).forEach(function (k) {
        var got = (day[k] || []).length;
        if (got !== want[k]) console.warn("buffet-menu.js: day " + n + " has " + got + " × " + k + ", expected " + want[k]);
      });
    }
  }

  function buffetRail() {
    var rail = $("[data-buffet-rail]");
    if (!rail) return;
    rail.addEventListener("click", function (e) {
      var b = e.target.closest("[data-offset]");
      if (!b) return;
      buffetView = parseInt(b.getAttribute("data-offset"), 10) || 0;
      if (previewDay() && window.history && history.replaceState) {
        history.replaceState(null, "", window.location.pathname + window.location.hash);
      }
      renderBuffetMenu(true);
      /* Bring a half-hidden day fully into the strip, sideways only —
         scrollIntoView would also jump the page vertically. */
      var r = rail.getBoundingClientRect(), br = b.getBoundingClientRect();
      if (br.left < r.left || br.right > r.right) {
        rail.scrollBy({ left: br.left - r.left - (r.width - br.width) / 2, behavior: "smooth" });
      }
    });
    /* Arrow keys move along the tabs, as a tablist should. */
    rail.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var tabs = $$("[data-offset]", rail);
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      next.click();
      next.focus();
    });
  }

  /* ── navigation ───────────────────────────────────────────── */

  function nav() {
    var burger = $("[data-burger]"), menu = $("[data-nav]");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.getAttribute("data-open") === "true";
        menu.setAttribute("data-open", String(!open));
        burger.setAttribute("aria-expanded", String(!open));
      });
    }
    $$("[data-sub]").forEach(function (grp) {
      var btn = $("button", grp);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = grp.getAttribute("data-open") === "true";
        $$("[data-sub]").forEach(function (g) { g.setAttribute("data-open", "false"); });
        grp.setAttribute("data-open", String(!open));
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-sub]")) {
        $$("[data-sub]").forEach(function (g) {
          g.setAttribute("data-open", "false");
          var b = $("button", g); if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      $$("[data-sub]").forEach(function (g) { g.setAttribute("data-open", "false"); });
      if (menu) menu.setAttribute("data-open", "false");
      if (burger) burger.setAttribute("aria-expanded", "false");
    });
  }

  /* ── the tray ─────────────────────────────────────────────── */

  var tray = {};
  function trayLoad() {
    try { tray = JSON.parse(sessionStorage.getItem("dewon-tray") || "{}"); }
    catch (e) { tray = {}; }
  }
  function traySave() {
    try { sessionStorage.setItem("dewon-tray", JSON.stringify(tray)); } catch (e) {}
  }
  function itemById(id) {
    var found = null;
    (MENU.categories || []).forEach(function (c) {
      c.items.forEach(function (i) { if (i.id === id) found = i; });
    });
    if (!found && MENU.buffet && MENU.buffet.id === id) found = MENU.buffet;
    return found;
  }
  function trayLines() {
    return Object.keys(tray).filter(function (id) { return tray[id] > 0; }).map(function (id) {
      var it = itemById(id);
      return it ? { id: id, item: it, qty: tray[id] } : null;
    }).filter(Boolean);
  }
  function trayTotals() {
    var house = 0, wolt = 0, count = 0, houseUnavailable = false;
    trayLines().forEach(function (l) {
      count += l.qty;
      if (l.item.woltOnly || l.item.price == null) houseUnavailable = true;
      else house += l.item.price * l.qty;
      wolt += (l.item.wolt != null ? l.item.wolt : (l.item.price || 0) + 2) * l.qty;
    });
    return { house: house, wolt: wolt, count: count, houseUnavailable: houseUnavailable };
  }
  function trayAdd(id, delta) {
    tray[id] = Math.max(0, (tray[id] || 0) + delta);
    if (!tray[id]) delete tray[id];
    traySave(); trayRender();
    track(delta > 0 ? "tray_add" : "tray_remove", { item_id: id });
  }
  function trayClear() { tray = {}; traySave(); trayRender(); }

  function trayRender() {
    var bar = $("[data-tray]");
    var tot = trayTotals();
    if (bar) {
      bar.setAttribute("data-show", String(tot.count > 0));
      var c = $("[data-tray-count]", bar);
      var s = $("[data-tray-total]", bar);
      if (c) c.textContent = tot.count + " " +
        (lang === "en" ? (tot.count === 1 ? "item" : "items") : (tot.count === 1 ? "tuote" : "tuotetta"));
      if (s) s.textContent = (lang === "en" ? "In-house " : "Talossa ") + money(tot.house);
    }
    $$("[data-stepper]").forEach(function (st) {
      var id = st.getAttribute("data-stepper");
      var qty = tray[id] || 0;
      st.setAttribute("data-qty", String(qty));
      var out = $("output", st);
      if (out) out.textContent = qty;
      var minus = $("[data-minus]", st);
      if (minus) minus.disabled = qty === 0;
    });
    renderTicket();
  }

  function ticketText() {
    var lines = trayLines().map(function (l) {
      return l.qty + " × " + t(l.item) + (l.item.price != null ? "  " + money(l.item.price * l.qty) : "");
    });
    var tot = trayTotals();
    var head = lang === "en" ? "My Dewon order:" : "Dewon-tilaukseni:";
    var sum  = (lang === "en" ? "Total (in-house prices): " : "Yhteensä (talon hinnat): ") + money(tot.house);
    return head + "\n" + lines.join("\n") + "\n" + sum;
  }

  function renderTicket() {
    var host = $("[data-ticket]");
    if (!host) return;
    var lines = trayLines(), tot = trayTotals();
    var ul = $("ul", host);
    if (ul) {
      ul.innerHTML = "";
      lines.forEach(function (l) {
        var li = document.createElement("li");
        var a = document.createElement("span");
        a.textContent = l.qty + " × " + t(l.item);
        var b = document.createElement("span");
        b.className = "num";
        b.textContent = l.item.price != null ? money(l.item.price * l.qty) : (lang === "en" ? "Wolt only" : "Vain Wolt");
        li.appendChild(a); li.appendChild(b);
        ul.appendChild(li);
      });
    }
    $$("[data-ticket-house]", host).forEach(function (e) { e.textContent = money(tot.house); });
    $$("[data-ticket-wolt]", host).forEach(function (e) { e.textContent = money(tot.wolt); });
    $$("[data-ticket-gap]", host).forEach(function (e) { e.textContent = money(Math.max(0, tot.wolt - tot.house)); });
    $$("[data-ticket-empty]", host).forEach(function (e) { e.hidden = lines.length > 0; });
    $$("[data-ticket-filled]", host).forEach(function (e) { e.hidden = lines.length === 0; });
  }

  /* ── dialogs, with a real focus trap ──────────────────────── */

  var lastFocus = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function openSheet(id) {
    var sheet = document.getElementById(id);
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    var first = $(FOCUSABLE, sheet);
    if (first) first.focus();
    track("sheet_open", { sheet_id: id });
  }
  function closeSheet(sheet) {
    sheet.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function sheets() {
    $$("[data-open-sheet]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openSheet(btn.getAttribute("data-open-sheet"));
      });
    });
    $$(".sheet").forEach(function (sheet) {
      $$("[data-close-sheet]", sheet).forEach(function (b) {
        b.addEventListener("click", function () { closeSheet(sheet); });
      });
      sheet.addEventListener("mousedown", function (e) {
        if (e.target === sheet) closeSheet(sheet);
      });
      sheet.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closeSheet(sheet); return; }
        if (e.key !== "Tab") return;
        var f = $$(FOCUSABLE, sheet).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  }

  /* ── ordering ─────────────────────────────────────────────── */

  function orderRoutes() {
    $$("[data-route]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var route = el.getAttribute("data-route");
        track("order_click", { method: route, items: trayTotals().count });

        if (route === "whatsapp") {
          e.preventDefault();
          var msg = trayTotals().count
            ? ticketText()
            : (lang === "en" ? "Hi Dewon, I'd like to order." : "Moi Dewon, haluaisin tilata.");
          window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        }
      });
    });

    $$("[data-copy-order]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = ticketText();
        var done = function () {
          var old = btn.getAttribute("data-label-idle") || btn.textContent;
          btn.setAttribute("data-label-idle", old);
          btn.textContent = lang === "en" ? "Copied" : "Kopioitu";
          setTimeout(function () { btn.textContent = old; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else { fallback(); }
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
        track("order_copy", { items: trayTotals().count });
      });
    });

    $$("[data-tray-clear]").forEach(function (b) {
      b.addEventListener("click", trayClear);
    });
  }

  /* ── forms ────────────────────────────────────────────────── */

  function formSummary(form) {
    var out = [];
    $$("input, select, textarea", form).forEach(function (f) {
      if (!f.name || f.type === "hidden" || f.name === "_gotcha") return;
      if ((f.type === "radio" || f.type === "checkbox") && !f.checked) return;
      var lab = form.querySelector('label[for="' + f.id + '"]');
      var name = lab ? lab.textContent.trim() : f.name;
      if (f.type === "radio") {
        var card = f.closest(".radio-card");
        name = f.closest("fieldset") && $("legend", f.closest("fieldset"))
          ? $("legend", f.closest("fieldset")).textContent.trim() : name;
        out.push(name + ": " + (card && $("b", card) ? $("b", card).textContent.trim() : f.value));
        return;
      }
      if (!f.value) return;
      out.push(name + ": " + f.value);
    });
    var chosen = $$("[data-picked-item]", form).map(function (el) {
      return el.getAttribute("data-picked-qty") + " × " + el.getAttribute("data-picked-item");
    });
    if (chosen.length) out.push((lang === "en" ? "Requested items" : "Toivotut annokset") + ":\n  " + chosen.join("\n  "));
    return out.join("\n");
  }

  /* Spam protection that needs no captcha and no third party:
     - a honeypot: a text field no person sees (visually hidden, skipped
       by keyboard and screen readers) but a bot fills in. "_gotcha" is
       also the name Formspree itself checks, if an endpoint is added.
     - a minimum time on the page: a form sent within 3 s of loading was
       not typed by a person.
     - length limits, so a form cannot be used to push megabytes of text
       into an email or WhatsApp message.
     A caught submission gets the normal "sent" message and goes nowhere. */
  var pageLoadedAt = Date.now();
  function guardForm(form) {
    var trap = document.createElement("div");
    trap.className = "vh";
    trap.setAttribute("aria-hidden", "true");
    trap.innerHTML = '<label>Jätä tyhjäksi / Leave empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(trap);
    $$("input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea", form).forEach(function (f) {
      if (f.name === "_gotcha" || f.maxLength > 0) return;
      f.maxLength = f.tagName === "TEXTAREA" ? 2000 : 200;
    });
  }
  function looksLikeBot(form) {
    var trap = form.querySelector('[name="_gotcha"]');
    return (trap && trap.value !== "") || Date.now() - pageLoadedAt < 3000;
  }

  function forms() {
    $$("form[data-form]").forEach(function (form) {
      var kind   = form.getAttribute("data-form");
      var status = $("[data-form-status]", form);
      var mailTo = form.getAttribute("data-mailto") || CFG.email;
      guardForm(form);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        if (looksLikeBot(form)) { say("ok"); return; }

        var subject = form.getAttribute("data-subject") || ("Dewon: " + kind);
        var body    = formSummary(form);
        track("form_submit", { form: kind, route: CFG.formEndpoint ? "endpoint" : form.getAttribute("data-fallback") || "email" });

        /* Only ever post form data over HTTPS. */
        if (CFG.formEndpoint && /^https:\/\//.test(CFG.formEndpoint)) {
          var fd = new FormData(form);
          fd.delete("_gotcha");
          fd.append("_subject", subject);
          fd.append("_summary", body);
          fetch(CFG.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
            .then(function (r) { say(r.ok ? "ok" : "err"); if (r.ok) form.reset(); })
            .catch(function () { say("err"); });
          return;
        }

        /* No backend configured: hand the request to WhatsApp or email
           rather than silently failing. */
        if (form.getAttribute("data-fallback") === "whatsapp" && CFG.whatsapp) {
          window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(subject + "\n\n" + body), "_blank", "noopener");
        } else {
          window.location.href = "mailto:" + mailTo +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);
        }
        say("ok");
      });

      function say(state) {
        if (!status) return;
        status.setAttribute("data-state", state);
        status.textContent = state === "ok"
          ? (lang === "en"
              ? "Your request is on its way. We confirm every booking by phone or WhatsApp; it is not booked until we reply."
              : "Pyyntö lähtee matkaan. Vahvistamme jokaisen varauksen puhelimitse tai WhatsAppilla; varaus ei ole voimassa ennen vastaustamme.")
          : (lang === "en"
              ? "That did not send. Call us on " + (CFG.phone || "") + " and we will sort it."
              : "Lähetys ei onnistunut. Soita " + (CFG.phone || "") + " niin hoidetaan asia.");
      }
    });

    /* Reservation: switch the visible block with the chosen order type. */
    $$("[data-mode-switch] input[type=radio]").forEach(function (r) {
      r.addEventListener("change", function () {
        var mode = r.value;
        $$("[data-mode-panel]").forEach(function (p) {
          p.hidden = p.getAttribute("data-mode-panel") !== mode;
        });
      });
    });

    /* Time-slot buttons write into a hidden input. */
    $$("[data-slots]").forEach(function (group) {
      var input = $("#" + group.getAttribute("data-slots"));
      $$("button", group).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", group).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          if (input) input.value = b.textContent.trim();
        });
      });
    });

    /* Date inputs cannot be in the past, and group bookings need notice. */
    var today = new Date();
    $$("input[type=date]").forEach(function (d) {
      var lead = parseInt(d.getAttribute("data-min-days") || "0", 10);
      var min = new Date(today.getTime() + lead * 864e5);
      d.min = min.toISOString().slice(0, 10);
    });
  }

  /* ── item picker (reservations, parties) ──────────────────── */

  function picker() {
    var host = $("[data-picker]");
    if (!host) return;
    host.innerHTML = "";

    (MENU.categories || []).forEach(function (cat) {
      if (cat.id === "drinks") return;
      var d = document.createElement("details");
      d.className = "acc";
      var s = document.createElement("summary");
      s.innerHTML = '<span data-cat-label="' + cat.id + '">' + t(cat) + '</span>' +
                    '<svg class="ic" aria-hidden="true"><use href="#i-chevron-right"></use></svg>';
      d.appendChild(s);
      var body = document.createElement("div");
      body.className = "acc-body";
      var list = document.createElement("div");
      list.className = "menu-list";
      cat.items.forEach(function (it) {
        if (it.woltOnly) return;
        var row = document.createElement("article");
        row.className = "mrow";
        row.innerHTML =
          '<div class="mrow-main"><h4 data-item-label="' + it.id + '">' + t(it) + '</h4>' +
          '<div class="mrow-price num">' + money(it.price) + '</div></div>' +
          mediaHTML(it.id, t(it));
        list.appendChild(row);
      });
      body.appendChild(list);
      d.appendChild(body);
      host.appendChild(d);
    });
    bindSteppers();
    syncPicked();
  }

  /* A dish photo either loads (the slot shows it) or 404s (removed, the
     placeholder shows). Handled here once, in the capture phase because
     load/error do not bubble — not as onload/onerror attributes, which
     the Content-Security-Policy forbids as inline script. Registered as
     the file runs, before any slot is built. */
  document.addEventListener("load", function (e) {
    var slot = e.target.closest && e.target.tagName === "IMG" && e.target.closest("[data-pslot]");
    if (slot) slot.setAttribute("data-has", "1");
  }, true);
  document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest && e.target.closest("[data-pslot]")) e.target.remove();
  }, true);

  /* Photo slot, round add button and stepper — the media column of a row. */
  function mediaHTML(id, label) {
    return '<div class="mrow-media">' +
      '<div class="pslot" data-pslot>' +
        '<img src="assets/images/menu/' + id + '.jpg" alt="">' +
        '<span class="pslot-ph" aria-hidden="true">' +
          '<svg class="ic"><use href="#i-image"></use></svg></span>' +
      '</div>' +
      '<button type="button" class="mrow-add" data-plus data-for="' + id + '" ' +
        'aria-label="' + (lang === "en" ? "Add " + label : "Lisää " + label) + '">' +
        '<svg class="ic" aria-hidden="true"><use href="#i-plus"></use></svg></button>' +
      stepperHTML(id, label) +
    '</div>';
  }

  function stepperHTML(id, label) {
    label = label || "";
    return '<div class="stepper" data-stepper="' + id + '" data-qty="0">' +
      '<button type="button" data-minus aria-label="' +
        (lang === "en" ? "Remove one " + label : "Poista yksi " + label) + '">' +
        '<svg class="ic" aria-hidden="true"><use href="#i-minus"></use></svg></button>' +
      '<output>0</output>' +
      '<button type="button" data-plus aria-label="' +
        (lang === "en" ? "Add one " + label : "Lisää yksi " + label) + '">' +
        '<svg class="ic" aria-hidden="true"><use href="#i-plus"></use></svg></button>' +
    '</div>';
  }

  function bindSteppers() {
    $$("[data-stepper]").forEach(function (st) {
      if (st.getAttribute("data-bound")) return;
      st.setAttribute("data-bound", "1");
      var id = st.getAttribute("data-stepper");
      var p = $("[data-plus]", st), m = $("[data-minus]", st);
      if (p) p.addEventListener("click", function () { trayAdd(id, 1); syncPicked(); });
      if (m) m.addEventListener("click", function () { trayAdd(id, -1); syncPicked(); });
    });
    /* The round + sits outside the stepper until something is in the tray. */
    $$(".mrow-add[data-for]").forEach(function (b) {
      if (b.getAttribute("data-bound")) return;
      b.setAttribute("data-bound", "1");
      b.addEventListener("click", function () {
        trayAdd(b.getAttribute("data-for"), 1); syncPicked();
      });
    });
  }

  /* Mirror the tray into hidden fields so a form submission carries it. */
  function syncPicked() {
    var host = $("[data-picked]");
    if (!host) return;
    host.innerHTML = "";
    var lines = trayLines();
    lines.forEach(function (l) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = "item[" + l.id + "]";
      input.value = l.qty + " × " + t(l.item);
      input.setAttribute("data-picked-item", t(l.item));
      input.setAttribute("data-picked-qty", l.qty);
      host.appendChild(input);
    });
    var count = $("[data-picked-count]");
    if (count) {
      count.textContent = lines.length
        ? (lang === "en" ? lines.length + " dishes chosen" : lines.length + " annosta valittu")
        : (lang === "en" ? "No dishes chosen yet" : "Ei vielä valittuja annoksia");
    }
  }

  /* ── à la carte board ─────────────────────────────────────── */

  function menuBoard() {
    var host = $("[data-menu-board]");
    if (!host) return;
    var rail = $("[data-menu-rail]");

    host.innerHTML = "";
    (MENU.categories || []).forEach(function (cat) {
      var sec = document.createElement("section");
      sec.className = "menu-group";
      sec.id = "cat-" + cat.id;

      var head = document.createElement("div");
      head.className = "menu-group-head";
      head.innerHTML = '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<div><h2 class="display d4" data-cat-label="' + cat.id + '">' + t(cat) + '</h2>' +
        (t(cat.blurb) ? '<p data-cat-blurb="' + cat.id + '">' + t(cat.blurb) + '</p>' : '') + '</div>';
      sec.appendChild(head);

      var list = document.createElement("div");
      list.className = "menu-list";

      cat.items.forEach(function (it) {
        var row = document.createElement("article");
        row.className = "mrow";
        if (it.woltOnly) row.setAttribute("data-wolt-only", "true");

        var tags = (it.tags || []).map(function (tg) {
          var lab = (MENU.tagLabels || {})[tg];
          if (!lab) return "";
          if (tg === "hot") {
            var level = it.spice || 1;
            var heat = '<span class="heat" aria-hidden="true">' +
              Array.from({ length: level }).map(function () {
                return '<svg class="ic" aria-hidden="true"><use href="#i-chilli-solid"></use></svg>';
              }).join("") + '</span>';
            return '<span class="chip chip--hot">' + heat +
                   '<span data-tag-label="hot">' + t(lab) + '</span></span>';
          }
          var ico = tg === "gf" ? "wheat-solid" : "leaf";
          return '<span class="chip chip--' + tg + '"><svg class="ic" aria-hidden="true"><use href="#i-' + ico + '"></use></svg>' +
                 '<span data-tag-label="' + tg + '">' + t(lab) + '</span></span>';
        }).join("");

        var woltLogo = '<img class="wolt-badge" src="assets/images/wolt-logo.png" alt="Wolt" width="34" height="12">';
        var price = it.woltOnly
          ? '<div class="mrow-price num">' + money(it.wolt) +
            '<small>' + woltLogo + ' <span data-wolt-only-label>' + (lang === "en" ? "only" : "vain") + '</span></small></div>'
          : '<div class="mrow-price num">' + money(it.price) +
            '<small>' + woltLogo + ' ' + money(it.wolt) + '</small></div>';

        row.innerHTML =
          '<div class="mrow-main">' +
            '<h4 data-item-label="' + it.id + '">' + t(it) + '</h4>' +
            (t(it.desc) ? '<p data-item-desc="' + it.id + '">' + t(it.desc) + '</p>' : '') +
            (tags ? '<div class="chips">' + tags + '</div>' : '') +
            price +
          '</div>' +
          (it.woltOnly
            ? '<div class="mrow-media"><div class="pslot" data-pslot>' +
              '<img src="assets/images/menu/' + it.id + '.jpg" alt="">' +
              '<span class="pslot-ph" aria-hidden="true"><svg class="ic"><use href="#i-image"></use></svg></span>' +
              '</div></div>'
            : mediaHTML(it.id, t(it)));
        list.appendChild(row);
      });

      sec.appendChild(list);
      host.appendChild(sec);
    });

    if (rail) {
      rail.innerHTML = "";
      var suppressAutoSelect = false, suppressTimer = null;

      var railOffset = function () {
        /* Sticky header + sticky pill-rail, measured live rather than
           hardcoded, so the target heading never lands underneath them. */
        var hdr = $(".hdr");
        return (hdr ? hdr.offsetHeight : 74) + rail.offsetHeight + 14;
      };

      (MENU.categories || []).forEach(function (cat, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "pill";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", String(i === 0));
        b.setAttribute("data-cat-label", cat.id);
        b.textContent = t(cat);
        b.addEventListener("click", function () {
          var target = document.getElementById("cat-" + cat.id);
          if (!target) return;

          /* Set the active pill immediately and hold it — otherwise the
             scroll-driven observer below fights the click while the smooth
             scroll is still in flight and the highlight jumps back. */
          suppressAutoSelect = true;
          if (suppressTimer) clearTimeout(suppressTimer);
          $$("button", rail).forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });

          var top = target.getBoundingClientRect().top + window.pageYOffset - railOffset();
          window.scrollTo({ top: top, behavior: "smooth" });

          suppressTimer = setTimeout(function () { suppressAutoSelect = false; }, 900);
        });
        rail.appendChild(b);
      });

      /* Keep the rail in step with what is actually on screen. A fast
         scroll can cross several menu-group boundaries in one frame, and
         each used to trigger its own aria-selected pass plus a smooth
         scrollIntoView on the rail — those pile up and visibly stall the
         page. Instead: batch every callback into one rAF, act only on the
         single most-advanced intersecting section per batch, and never
         start a new rail auto-scroll while one is still settling. */
      if ("IntersectionObserver" in window) {
        var groups = $$(".menu-group", host);
        var railButtons = null;
        var pendingId = null, rafHandle = null;
        var railScrollBusy = false, railScrollTimer = null;

        var applySelection = function (id) {
          if (!railButtons) railButtons = $$("button", rail);
          railButtons.forEach(function (b) {
            var on = b.getAttribute("data-cat-label") === id;
            b.setAttribute("aria-selected", String(on));
            if (on && !railScrollBusy && b.scrollIntoView) {
              railScrollBusy = true;
              b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
              clearTimeout(railScrollTimer);
              railScrollTimer = setTimeout(function () { railScrollBusy = false; }, 350);
            }
          });
        };

        var io = new IntersectionObserver(function (entries) {
          if (suppressAutoSelect) return;
          var visible = entries.filter(function (en) { return en.isIntersecting; });
          if (!visible.length) return;
          /* Last in document order = the section furthest down that is
             still on screen, i.e. the one the rail should point to. */
          var target = visible[visible.length - 1].target;
          pendingId = target.id.replace("cat-", "");
          if (rafHandle) return;
          rafHandle = requestAnimationFrame(function () {
            rafHandle = null;
            applySelection(pendingId);
          });
        }, { rootMargin: "-140px 0px -70% 0px" });
        groups.forEach(function (g) { io.observe(g); });
      }
    }

    bindSteppers();
  }

  /* ── combos ───────────────────────────────────────────────── */

  function comboGrid() {
    var host = $("[data-combo-grid]");
    if (!host) return;
    host.className = "combo-grid";
    host.innerHTML = "";
    (MENU.combos || []).forEach(function (combo) {
      var was = combo.includes.reduce(function (sum, id) {
        var it = itemById(id);
        return sum + (it && it.price != null ? it.price : 0);
      }, 0);
      var saving = Math.max(0, was - combo.price);

      var card = document.createElement("article");
      card.className = "combo-card" + (combo.featured ? " combo-card--featured" : "");
      var itemsHTML = combo.includes.map(function (id) {
        var it = itemById(id);
        return it ? '<li>' + icon("check") + '<span data-item-label="' + id + '">' + t(it) + '</span></li>' : "";
      }).join("");
      card.innerHTML =
        (combo.featured ? '<span class="ribbon">' + icon("flame") +
          '<span data-en="Most popular">Suosituin</span></span>' : '') +
        '<h3 data-combo-label="' + combo.id + '">' + t(combo) + '</h3>' +
        '<p data-combo-desc="' + combo.id + '">' + t(combo.desc) + '</p>' +
        '<ul class="combo-includes">' + itemsHTML + '</ul>' +
        '<div class="combo-price-row"><span class="combo-price num">' + money(combo.price) + '</span>' +
        (saving > 0 ? '<span class="combo-save">' +
          (lang === "en" ? "Save " + money(saving) + " vs. ordering separately" : "Säästät " + money(saving) + " erikseen tilattuun") + '</span>' : '') +
        '</div>' +
        '<button type="button" class="btn btn--primary btn--block" data-combo-add="' + combo.id + '">' +
          icon("shopping-bag") + '<span data-en="Add to order">Lisää tilaukseen</span></button>';
      host.appendChild(card);
    });

    function icon(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"></use></svg>'; }

    $$("[data-combo-add]", host).forEach(function (btn) {
      if (btn.getAttribute("data-bound")) return;
      btn.setAttribute("data-bound", "1");
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-combo-add");
        var combo = (MENU.combos || []).filter(function (c) { return c.id === id; })[0];
        if (!combo) return;
        combo.includes.forEach(function (itemId) { trayAdd(itemId, 1); });
      });
    });
  }

  /* Sticky order-type nav: shown only while the "what people order"
     section is on screen, active link follows scroll position. */
  function orderNav() {
    var nav = $("[data-order-nav]");
    var section = $("#order");
    if (!nav || !section) return;
    var panels = $$(".order-panel", section);
    var links = $$("a", nav);

    if ("IntersectionObserver" in window) {
      var sectionIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          nav.setAttribute("data-show", String(en.isIntersecting));
        });
      }, { rootMargin: "-90px 0px -70% 0px" });
      sectionIO.observe(section);

      var panelIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
          });
        });
      }, { rootMargin: "-150px 0px -60% 0px" });
      panels.forEach(function (p) { panelIO.observe(p); });
    }

    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* Re-label the generated markup when the language flips, without
     rebuilding the DOM and losing the tray state. */
  function relabel() {
    var find = function (id) {
      var out = null;
      (MENU.categories || []).forEach(function (c) {
        if (c.id === id) out = c;
        c.items.forEach(function (i) { if (i.id === id) out = i; });
      });
      return out;
    };
    $$("[data-cat-label]").forEach(function (e) { var c = find(e.getAttribute("data-cat-label")); if (c) e.textContent = t(c); });
    $$("[data-cat-blurb]").forEach(function (e) { var c = find(e.getAttribute("data-cat-blurb")); if (c) e.textContent = t(c.blurb); });
    $$("[data-item-label]").forEach(function (e) { var i = find(e.getAttribute("data-item-label")); if (i) e.textContent = t(i); });
    $$("[data-item-desc]").forEach(function (e) { var i = find(e.getAttribute("data-item-desc")); if (i) e.textContent = t(i.desc); });
    comboGrid(); /* simplest to rebuild than relabel every nested node */
    $$("[data-tag-label]").forEach(function (e) {
      var l = (MENU.tagLabels || {})[e.getAttribute("data-tag-label")];
      if (l) e.textContent = t(l);
    });
    $$("[data-wolt-only-label]").forEach(function (e) { e.textContent = lang === "en" ? "only" : "vain"; });
  }

  /* ── misc ─────────────────────────────────────────────────── */

  function cardsSwiper() {
    var el = $("[data-cards-swiper]");
    if (!el || typeof window.Swiper !== "function") return;
    var sw = null;
    var mq = window.matchMedia("(max-width: 719px)");
    function sync() {
      if (mq.matches && !sw) {
        sw = new window.Swiper(el, {
          slidesPerView: 1.12, spaceBetween: 16, grabCursor: true,
          a11y: { enabled: true },
          pagination: { el: $(".swiper-pagination", el), clickable: true }
        });
      } else if (!mq.matches && sw) {
        sw.destroy(true, true); sw = null;
      }
    }
    sync();
    mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);
  }

  /* Home hero on phones and upright tablets: the photo is shown whole on
     a white frame, and the white band above it (behind the header) and
     below it (behind the buttons) gets blurred wings and drumsticks at
     random places, sizes and angles — different on every visit. Built
     only when that layout is in use, so desktop never loads the images. */
  function heroScatter() {
    var hero = $(".hero");
    if (!hero || !window.matchMedia) return;
    var mq = window.matchMedia("(max-aspect-ratio: 4/3)");
    var PICS = ["assets/images/buffet/cut-wings.png", "assets/images/buffet/cut-drumsticks.png"];
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    function build() {
      if (!mq.matches || $(".hero-scatter", hero)) return;
      var layer = document.createElement("div");
      layer.className = "hero-scatter";
      layer.setAttribute("aria-hidden", "true");
      /* Five pieces in the top band, six in the bottom band; the photo
         covers the middle. Columns are jittered rather than fully random
         so pieces spread across the width instead of clumping. */
      [["top", 5], ["bottom", 6]].forEach(function (band) {
        for (var i = 0; i < band[1]; i++) {
          var img = document.createElement("img");
          img.src = PICS[(i + (band[0] === "top" ? 0 : 1)) % 2];
          img.alt = "";
          img.decoding = "async";
          var w = Math.round(rnd(80, 150)), r = Math.round(rnd(-40, 40));
          img.width = w;
          img.style.left = ((i + rnd(.05, .75)) / band[1] * 100 - 8).toFixed(1) + "%";
          img.style[band[0]] = Math.round(band[0] === "top" ? rnd(-30, 20) : rnd(-35, 30)) + "px";
          img.style.transform = "rotate(" + r + "deg)";
          img.style.setProperty("--r", r + "deg");
          img.style.animationDelay = (i * 60) + "ms";
          layer.appendChild(img);
        }
      });
      hero.insertBefore(layer, hero.firstChild);
    }
    build();
    mq.addEventListener ? mq.addEventListener("change", build) : mq.addListener(build);
  }

  function marquee() {
    $$("[data-marquee]").forEach(function (track) {
      var html = track.innerHTML;
      track.innerHTML = html + html;   /* one clean loop for translateX(-50%) */
      track.setAttribute("aria-hidden", "true");
    });
  }

  function reveal() {
    /* Swiper slides off to the side are never intersected by a vertical
       scroll observer once Swiper takes over — Swiper's own transition
       already brings them in, so they opt out of the scroll reveal and
       show immediately instead of waiting on an event that may not come. */
    var targets = $$(".rise").filter(function (e) { return !e.classList.contains("swiper-slide"); });
    $$(".rise.swiper-slide").forEach(function (e) { e.classList.add("in"); });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: .08 });
    targets.forEach(function (e) { io.observe(e); });
  }

  function toTop() {
    var btn = $("[data-totop]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    var onScroll = function () { btn.setAttribute("data-show", String(window.scrollY > 700)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function track(name, params) {
    if (!CFG.gaMeasurementId || typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  function analytics() {
    if (!CFG.gaMeasurementId) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.gaMeasurementId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CFG.gaMeasurementId);
  }

  /* ── boot ─────────────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", function () {
    lang = readLang();
    trayLoad();

    nav();
    wireConfig();
    menuBoard();
    picker();
    comboGrid();
    orderNav();
    cardsSwiper();
    heroScatter();
    marquee();
    sheets();
    orderRoutes();
    forms();
    toTop();
    reveal();
    analytics();

    applyLang(lang);
    $$("#yr").forEach(function (e) { e.textContent = new Date().getFullYear(); });
    renderHours();
    renderOpenNow();
    renderSauces();
    renderBuffetMenu();
    buffetRail();
    trayRender();

    $$("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang-btn")); });
    });

    document.addEventListener("dewon:lang", function () {
      /* "ma–pe" / "Mon–Fri" is set once by wireConfig; re-set it here so
         it follows the language switch too. */
      $$("[data-buffet-days]").forEach(function (e) { e.textContent = t((MENU.buffet || {}).days); });
      relabel(); renderHours(); renderOpenNow(); renderSauces(); renderBuffetMenu(); trayRender(); syncPicked();
    });
  });
})();
