/* ──────────────────────────────────────────────────────────────
   Dewon Fried Chicken — the menu, as data.

   Every price on the site comes from this file. The à la carte page,
   the order tray, the reservation item picker and the party planner all
   read it, so a price is changed in exactly one place.

   Source: 08-menu/menu-reference.md (canonical).
   `price`  = the in-house price, in euros.
   `wolt`   = the Wolt price. House rule: in-house + 2 €.
   `tags`   = gf (gluten free available) · veg · vegan · hot
   ────────────────────────────────────────────────────────────── */

window.DEWON_MENU = {

  /* Anything sold only through Wolt is flagged so the page can say so
     rather than letting someone try to order it at the counter. */
  categories: [

    {
      id: "fried-chicken",
      fi: "Friteerattu kana",
      en: "Fried chicken",
      blurb: {
        fi: "Aasialaisessa yrttimarinadissa. Kuorrutettu yrttijauhoilla.",
        en: "In an Asian herb marinade, coated in herb flour."
      },
      items: [
        {
          id: "regular-portion",
          fi: "Kana-annos", en: "Regular fried chicken portion",
          desc: {
            fi: "Kaksi koipireittä ja neljä siipeä, ranskalaiset tai riisi.",
            en: "Two drumsticks and four wings, with fries or plain rice."
          },
          price: 15.90, wolt: 17.90, tags: ["gf"]
        },
        {
          id: "boneless",
          fi: "Luuton friteerattu kana", en: "Boneless fried chicken",
          desc: {
            fi: "Marinoitua kanan rintafilettä: suola, pippuri, valkosipuli, chili, korianteri.",
            en: "Marinated chicken breast: salt, pepper, garlic, chilli, coriander."
          },
          price: 16.90, wolt: 18.90, tags: ["gf"], signature: true
        },
        {
          id: "cauliflower",
          fi: "Friteeratut kukkakaalisiivet", en: "Fried Cauliflower Wings",
          desc: {
            fi: "Sama yrttimarinadi ja yrttijauho, kukkakaalista.",
            en: "The same herb marinade and herb flour, made with cauliflower."
          },
          price: 15.90, wolt: 17.90, tags: ["gf", "veg"]
        }
      ]
    },

    {
      id: "wings",
      fi: "Siivet",
      en: "Wings",
      blurb: {
        fi: "Aasialaisessa yrttimarinadissa. Saatavana gluteenittomana.",
        en: "In an Asian herb marinade. Available gluten free."
      },
      items: [
        { id: "wings-5",  fi: "5 siipeä",  en: "5 wings",  price: 9.90,  wolt: 11.90, tags: ["gf"] },
        { id: "wings-7",  fi: "7 siipeä",  en: "7 wings",  price: 12.90, wolt: 14.90, tags: ["gf"] },
        { id: "wings-10", fi: "10 siipeä", en: "10 wings", price: 15.90, wolt: 17.90, tags: ["gf"], signature: true },
        { id: "wings-30", fi: "30 siipeä", en: "30 wings", price: null, wolt: 44.90, tags: ["gf"], woltOnly: true },
        { id: "wings-50", fi: "50 siipeä", en: "50 wings", price: null, wolt: 59.90, tags: ["gf"], woltOnly: true }
      ]
    },

    {
      id: "bibimbap",
      fi: "Korean Bibim Bap",
      en: "Korean Bibim Bap",
      blurb: {
        fi: "Lämmin riisikulho: maustetut kasvikset, proteiini, paistettu kananmuna ja gochujang-kastike. Sekoita ennen syömistä.",
        en: "A warm rice bowl: seasoned vegetables, a protein, a fried egg and gochujang sauce. Mix before eating."
      },
      items: [
        { id: "bibim-pork",    fi: "Porky Korean Bibim Bap",     en: "Pork Korean Bibim Bap",       desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana, paistettu kananmuna.", en: "Mushroom, onion, lettuce, courgette, carrot, fried egg." }, price: 14.90, wolt: 16.90, tags: [] },
        { id: "bibim-chicken", fi: "Chicken Korean Bibim Bap",   en: "Chicken Korean Bibim Bap",    desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana, paistettu kananmuna.", en: "Mushroom, onion, lettuce, courgette, carrot, fried egg." }, price: 13.90, wolt: 15.90, tags: [], signature: true },
        { id: "bibim-tofu",    fi: "Tofu Korean Bibim Bap",      en: "Tofu Korean Bibim Bap",       desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana, paistettu kananmuna.", en: "Mushroom, onion, lettuce, courgette, carrot, fried egg." }, price: 13.90, wolt: 15.90, tags: ["veg"] },
        { id: "bibim-tuna",    fi: "Tuna Korean Bibim Bap",      en: "Tuna Korean Bibim Bap",       desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana, paistettu kananmuna.", en: "Mushroom, onion, lettuce, courgette, carrot, fried egg." }, price: 13.90, wolt: 15.90, tags: [] },
        { id: "bibim-veg",     fi: "Vegetable Korean Bibim Bap", en: "Vegetable Korean Bibim Bap",  desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana.", en: "Mushroom, onion, lettuce, courgette, carrot." }, price: 12.90, wolt: 14.90, tags: ["veg"] },
        { id: "bibim-vegan",   fi: "Vegan Korean Bibim Bap",     en: "Vegan Korean Bibim Bap",      desc: { fi: "Sienet, sipuli, salaatti, kesäkurpitsa, porkkana.", en: "Mushroom, onion, lettuce, courgette, carrot." }, price: 11.90, wolt: 13.90, tags: ["vegan"] }
      ]
    },

    {
      id: "fried-rice",
      fi: "Sri Lankan Fried Rice",
      en: "Sri Lankan Fried Rice",
      blurb: {
        fi: "Aidoilla mausteilla, tuoksuva ja täyteläinen.",
        en: "Cooked with authentic spices. Rich and aromatic."
      },
      items: [
        { id: "rice-chicken", fi: "Chicken Fried Rice", en: "Chicken Fried Rice", desc: { fi: "Friteerattu kana, porkkana, purjo, punasipuli, chop suey -kasvikset.", en: "Fried chicken, carrot, leek, red onion, vegetable chop suey." }, price: 14.90, wolt: 16.90, tags: [] },
        { id: "rice-pork",    fi: "Pork Fried Rice",    en: "Pork Fried Rice",    desc: { fi: "Friteerattu porsas, porkkana, purjo, punasipuli, chop suey -kasvikset.", en: "Fried pork, carrot, leek, red onion, vegetable chop suey." }, price: 14.90, wolt: 16.90, tags: [] },
        { id: "rice-egg",     fi: "Egg Fried Rice",     en: "Egg Fried Rice",     desc: { fi: "Kananmuna, porkkana, purjo, punasipuli, chop suey -kasvikset.", en: "Egg, carrot, leek, red onion, vegetable chop suey." }, price: 13.90, wolt: 15.90, tags: ["veg"] }
      ]
    },

    {
      id: "devilled",
      fi: "Sri Lankan Devilled Chicken",
      en: "Sri Lankan Devilled Chicken",
      blurb: {
        fi: "Tulinen ja hapokas wokattu kana, makean ja kuuman välissä.",
        en: "A spicy, tangy stir-fried chicken. Sweet and hot at once."
      },
      items: [
        { id: "devil-150", fi: "Devilled Chicken 150 g", en: "Devilled Chicken 150 g", desc: { fi: "Kanan rintafilee, porkkana, punasipuli, paprika, srilankalaiset yrtit.", en: "Chicken breast, carrot, red onion, paprika, Sri Lankan herbs." }, price: 14.90, wolt: 16.90, tags: ["hot"], spice: 2 },
        { id: "devil-250", fi: "Devilled Chicken 250 g", en: "Devilled Chicken 250 g", desc: { fi: "Kanan rintafilee, porkkana, punasipuli, paprika, srilankalaiset yrtit.", en: "Chicken breast, carrot, red onion, paprika, Sri Lankan herbs." }, price: 19.90, wolt: 21.90, tags: ["hot"], spice: 2 }
      ]
    },

    {
      id: "spicy-for-beer",
      fi: "Spicy for Beer",
      en: "Spicy for Beer",
      blurb: {
        fi: "Kanan rintafilee, porkkana, herneet, maissi, kevätsipuli, pippuri ja srilankalaiset yrtit.",
        en: "Chicken breast, carrot, peas, corn, spring onion, pepper and Sri Lankan herbs."
      },
      items: [
        { id: "sfb-mini",  fi: "Miniannos",  en: "Mini portion",  price: 7.90,  wolt: 9.90,  tags: ["hot"], spice: 3 },
        { id: "sfb-small", fi: "Pieni annos", en: "Small portion", price: 12.90, wolt: 14.90, tags: ["hot"], spice: 3 },
        { id: "sfb-large", fi: "Iso annos",   en: "Large portion", price: 19.90, wolt: 21.90, tags: ["hot"], spice: 3 }
      ]
    },

    {
      id: "drinks",
      fi: "Juomat",
      en: "Drinks",
      blurb: { fi: "", en: "" },
      items: [
        { id: "d-cream-soda", fi: "Sri Lankan Cream Soda 330 ml",     en: "Sri Lankan Cream Soda 330 ml",     price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-necto",      fi: "Sri Lankan Necto 330 ml",          en: "Sri Lankan Necto 330 ml",          price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-mixed",      fi: "Mixed Fruits Nectar 200 ml",       en: "Mixed Fruits Nectar 200 ml",       price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-woodapple",  fi: "Wood Apple Nectar 200 ml",         en: "Wood Apple Nectar 200 ml",         price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-ginger",     fi: "Sri Lankan Ginger Beer 330 ml",    en: "Sri Lankan Ginger Beer 330 ml",    price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-coconut",    fi: "MD Pure King Coconut Water 200 ml",en: "MD Pure King Coconut Water 200 ml",price: 3.50, wolt: 5.50, tags: [] },
        { id: "d-7up",        fi: "7 UP 330 ml",                      en: "7 UP 330 ml",                      price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-novelle",    fi: "Hartwall Novelle Plus 330 ml",     en: "Hartwall Novelle Plus 330 ml",     price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-cola",       fi: "Coca-Cola Original 330 ml",        en: "Coca-Cola Original 330 ml",        price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-cola-zero",  fi: "Coca-Cola Zero Sugar 330 ml",      en: "Coca-Cola Zero Sugar 330 ml",      price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-sprite",     fi: "Sprite Original 330 ml",           en: "Sprite Original 330 ml",           price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-sprite-zero",fi: "Sprite Zero Sugar 330 ml",         en: "Sprite Zero Sugar 330 ml",         price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-fanta",      fi: "Fanta Appelsiini 330 ml",          en: "Fanta Orange 330 ml",              price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-fanta-zero", fi: "Fanta Zero Sugar 330 ml",          en: "Fanta Zero Sugar 330 ml",          price: 2.90, wolt: 4.90, tags: [] },
        { id: "d-pepsi-max",  fi: "Pepsi Max Zero Sugar 330 ml",      en: "Pepsi Max Zero Sugar 330 ml",      price: 2.90, wolt: 4.90, tags: [] }
      ]
    }
  ],

  /* The buffet is priced per person and sold dine-in, so it is not part of
     the à la carte list above. The buffet page and the reservation form
     both read it from here. */
  buffet: {
    id: "buffet",
    fi: "Lounasbuffet", en: "Lunch buffet",
    price: 13.70,
    /* Weekdays only (confirmed). CONFIRM — serving times still blank in the menu doc. */
    days: { fi: "ma–pe", en: "Mon–Fri" },
    time: "10:30–14:30"
  },

  /* Combos: a main plus a side plus a drink, priced a little under buying
     the three separately so the saving is real, but each one still lifts
     the average ticket past a single main on its own. Built from the
     three items already flagged `signature: true`, so the combo is
     pushing what the kitchen already sells best rather than something new
     to prep. Middle one (bibim-chicken) is the one to feature — cheapest
     to plate, highest margin per euro, and the easiest sell to someone
     who has not decided yet. */
  combos: [
    {
      id: "combo-wings",
      fi: "Siipikombo", en: "Wing combo",
      desc: { fi: "10 siipeä, pieni Spicy for Beer -annos ja juoma.", en: "10 wings, a small Spicy for Beer side and a drink." },
      includes: ["wings-10", "sfb-small", "d-cola"],
      price: 27.90, // à la carte separately: 15.90 + 12.90 + 2.90 = 31.70
      wolt: 31.90
    },
    {
      id: "combo-bibim",
      fi: "Bibim-kombo", en: "Bibim combo",
      desc: { fi: "Chicken Korean Bibim Bap, 5 siipeä ja juoma.", en: "Chicken Korean Bibim Bap, 5 wings and a drink." },
      includes: ["bibim-chicken", "wings-5", "d-cola"],
      price: 22.90, // separately: 13.90 + 9.90 + 2.90 = 26.70
      wolt: 26.90,
      featured: true
    },
    {
      id: "combo-boneless",
      fi: "Luuton-kombo", en: "Boneless combo",
      desc: { fi: "Luuton friteerattu kana, Chicken Fried Rice ja juoma.", en: "Boneless fried chicken, Chicken Fried Rice and a drink." },
      includes: ["boneless", "rice-chicken", "d-cola"],
      price: 29.90, // separately: 16.90 + 14.90 + 2.90 = 34.70
      wolt: 33.90
    }
  ],

  /* Tag copy, in one place so every page labels things the same way. */
  tagLabels: {
    gf:    { fi: "Gluteeniton saatavana", en: "Gluten free available" },
    veg:   { fi: "Kasvisvaihtoehto",      en: "Vegetarian" },
    vegan: { fi: "Vegaani",               en: "Vegan" },
    hot:   { fi: "Tulinen",               en: "Spicy" }
  }
};
