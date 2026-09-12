/* ══════════════════════════════════════════════════════════════
   Dewon Fried Chicken — THE ROTATING BUFFET MENU (24 days)

   This is the only file to edit when the buffet changes. The buffet
   page reads it and works out on its own which day is "today".

   ── HOW TO CHANGE A DAY'S MENU ─────────────────────────────────

   1. Open this file in any plain text editor (Notepad, TextEdit,
      VS Code). Not Word — Word breaks the file.
   2. Find the day: each one starts with a banner line like
         ═══ DAY 7 ═══
   3. Change the text between the quotes. Every dish is written as

         "Finnish name | English name"

      with a straight bar | between the two languages. If the name is
      the same in both languages, write it once:  "Watalappan"
   4. Keep the quotes, the commas between dishes, and the brackets
      exactly as they are. Only the words inside "..." change.
      A dish name must not contain a double quote " character.
   5. Save the file (keep the encoding as UTF-8 so ä and ö survive).
   6. Upload this one file to the web host, replacing the old
      assets/js/buffet-menu.js. Nothing needs to be rebuilt and no
      other file changes. If the old menu still shows, reload the page
      once with Ctrl+F5 (Cmd+Shift+R on a Mac).

   To check any day before it comes round, open the buffet page with
   ?day= and the day number on the end of the address, e.g.
         menu-buffet.html?day=17

   ── HOW MANY DISHES EACH DAY HAS ───────────────────────────────

      kasvikset       Salaattibaari (salad bar vegetables) ......... 8
      salaatit        Ruokaisat salaatit (hearty salads) ........... 2
      hedelmat        Hedelmät (fruit) ............................. 4
      keitto          Keitto (soup) ................................ 1
      lisukkeet       Rapeat lisukkeet (crispy sides) .............. 3
      leipa           Leipä (bread) ................................ 3
      suomalainen     Suomalainen pääruoka: paaruoka + lisuke + kasvis
      srilankalainen  Sri Lankalainen pääruoka: riisi + liha + kasvis
      kana            Friteerattu kana: pala + kastike
                        pala = "siivet" (wings), "koivet" (drumsticks)
                               or "luuton" (boneless) — the photo on
                               the page follows this word.
      jalkiruoka      Jälkiruoka: suomalainen + srilankalainen

   The numbers are what the kitchen serves; the page shows whatever is
   written here, so one dish more or less still displays fine.

   ── WHICH DAY IS TODAY ─────────────────────────────────────────

   The buffet is served on weekdays only, so only Monday–Friday count.
   startDate is the weekday that counts as DAY 1. From there each
   weekday is the next day, Saturday and Sunday are skipped, and after
   DAY 24 it starts again from DAY 1 (24 weekdays ≈ one month).
   To restart the cycle, set startDate to the Monday–Friday date that
   should be DAY 1 and upload. Format: "YYYY-MM-DD".

   The website never shows visitors the day number — they see the
   date. The number is only for finding the day in this file.

   ── THE SAME EVERY DAY, NOT ROTATING ───────────────────────────

   The drinks (cold and hot), and the fries + onion rings that come
   with the chicken, are the same every day. They live in `everyDay`
   below, not in the days, so they are changed once for all 24 days.
   ══════════════════════════════════════════════════════════════ */

window.DEWON_BUFFET = {

  startDate: "2026-09-01",

  everyDay: {
    kanaLisukkeet: ["Ranskalaiset | Fries", "Sipulirenkaat | Onion rings"],
    kylmatJuomat: ["Mehu | Juice", "Jäätee | Iced tea", "Sitruunavesi | Lemon water", "Jääkahvi | Iced coffee"],
    kuumatJuomat: ["Kahvi | Coffee", "Tee | Tea"]
  },

  days: [

    /* ═══ DAY 1 ═══ */
    {
      day: 1,
      keitto:    ["Lohikeitto | Creamy salmon soup"],
      leipa:     ["Ruisleipä | Rye bread", "Karjalanpiirakka | Karelian pie", "Pol roti | Coconut roti"],
      hedelmat:  ["Omena | Apple", "Banaani | Banana", "Vesimeloni | Watermelon", "Ananas | Pineapple"],
      salaatit:  ["Kana-pastasalaatti | Chicken pasta salad", "Rosolli | Rosolli beetroot salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Jäävuorisalaatti | Iceberg lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Porkkanaraaste | Grated carrot", "Maissi | Sweetcorn", "Oliivit | Olives"],
      lisukkeet: ["Papadam | Poppadoms", "Paahdetut siemenet | Toasted seed mix", "Krutongit | Croutons"],
      suomalainen:    { paaruoka: "Lihapullat kermakastikkeessa | Meatballs in cream sauce",
                        lisuke:   "Perunamuusi | Mashed potatoes",
                        kasvis:   "Porkkanalaatikko | Carrot casserole" },
      srilankalainen: { riisi: "Keltainen riisi (kaha bath) | Yellow rice (kaha bath)",
                        liha:  "Musta porsascurry | Black pork curry",
                        kasvis: "Parippu-linssicurry | Dhal curry (parippu)" },
      kana:           { pala: "siivet", kastike: "Hunajasoija | Honey soy" },
      jalkiruoka:     { suomalainen: "Mustikkapiirakka | Blueberry pie",
                        srilankalainen: "Watalappan | Watalappan coconut custard" }
    },

    /* ═══ DAY 2 ═══ */
    {
      day: 2,
      keitto:    ["Parippu-keitto | Sri Lankan dhal soup"],
      leipa:     ["Hapanjuurileipä | Sourdough bread", "Siemensämpylä | Seeded roll", "Paratha"],
      hedelmat:  ["Appelsiini | Orange", "Viinirypäleet | Grapes", "Hunajameloni | Honeydew melon", "Kiivi | Kiwi"],
      salaatit:  ["Perunasalaatti | Potato salad", "Seesami-nuudelisalaatti | Sesame noodle salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Lehtisalaatti | Leaf lettuce", "Keltainen paprika | Yellow pepper",
                  "Punakaaliraaste | Shredded red cabbage", "Retiisi | Radish", "Herneet | Green peas", "Jalapeño"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Paistettu sipuli | Crispy fried onions", "Paahdetut cashewpähkinät | Roasted cashews"],
      suomalainen:    { paaruoka: "Karjalanpaisti | Karelian meat stew",
                        lisuke:   "Keitetyt perunat | Boiled potatoes",
                        kasvis:   "Kukkakaaligratiini | Cauliflower gratin" },
      srilankalainen: { riisi: "Basmatiriisi | Steamed basmati rice",
                        liha:  "Srilankalainen kanacurry | Sri Lankan chicken curry",
                        kasvis: "Munakoisomoju | Aubergine moju (wambatu moju)" },
      kana:           { pala: "koivet", kastike: "Dewon Special -kastike | Dewon Special sauce" },
      jalkiruoka:     { suomalainen: "Vispipuuro | Whipped lingonberry porridge",
                        srilankalainen: "Kiri pani | Curd with kithul treacle (kiri pani)" }
    },

    /* ═══ DAY 3 ═══ */
    {
      day: 3,
      keitto:    ["Hernekeitto | Pea soup"],
      leipa:     ["Ruisleipä | Rye bread", "Perunarieska | Potato flatbread", "Vehnäsämpylä | Wheat roll"],
      hedelmat:  ["Mango", "Banaani | Banana", "Päärynä | Pear", "Mandariini | Mandarin"],
      salaatit:  ["Kvinoa-fetasalaatti | Quinoa and feta salad", "Tonnikala-pastasalaatti | Tuna pasta salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Rucola | Rocket", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Porkkanaraaste | Grated carrot", "Kikherneet | Chickpeas", "Etikkapunajuuri | Pickled beetroot"],
      lisukkeet: ["Sri Lankan mixture | Spicy Sri Lankan mixture", "Krutongit | Croutons", "Paahdetut kurpitsansiemenet | Toasted pumpkin seeds"],
      suomalainen:    { paaruoka: "Uunilohi | Oven-baked salmon",
                        lisuke:   "Tilliperunat | Dill potatoes",
                        kasvis:   "Pinaattiletut | Spinach pancakes" },
      srilankalainen: { riisi: "Ghee-riisi | Ghee rice",
                        liha:  "Naudanlihacurry | Beef curry",
                        kasvis: "Perunacurry | Potato curry" },
      kana:           { pala: "luuton", kastike: "Chili medium | Medium chilli" },
      jalkiruoka:     { suomalainen: "Omenapiirakka ja vaniljakastike | Apple pie with vanilla sauce",
                        srilankalainen: "Kavum | Kavum oil cakes" }
    },

    /* ═══ DAY 4 ═══ */
    {
      day: 4,
      keitto:    ["Kantarellikeitto | Chanterelle soup"],
      leipa:     ["Kauraleipä | Oat bread", "Karjalanpiirakka | Karelian pie", "Pol roti | Coconut roti"],
      hedelmat:  ["Omena | Apple", "Ananas | Pineapple", "Viinirypäleet | Grapes", "Nektariini | Nectarine"],
      salaatit:  ["Kikherne-couscoussalaatti | Chickpea couscous salad", "Kylmäsavulohi-perunasalaatti | Cold-smoked salmon potato salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Jäävuorisalaatti | Iceberg lettuce", "Keltainen paprika | Yellow pepper",
                  "Kevätsipuli | Spring onion", "Punakaaliraaste | Shredded red cabbage", "Maissi | Sweetcorn", "Babypinaatti | Baby spinach"],
      lisukkeet: ["Papadam | Poppadoms", "Rapeat kikherneet | Crispy chickpeas", "Kookoslastut | Toasted coconut flakes"],
      suomalainen:    { paaruoka: "Makaronilaatikko | Macaroni and minced beef bake",
                        lisuke:   "Keitetyt punajuuret | Boiled beetroot",
                        kasvis:   "Kasvismakaronilaatikko | Vegetarian macaroni bake" },
      srilankalainen: { riisi: "Srilankalainen paistettu riisi | Sri Lankan fried rice",
                        liha:  "Devilled chicken",
                        kasvis: "Polos-curry (nuori jakkihedelmä) | Young jackfruit curry (polos)" },
      kana:           { pala: "siivet", kastike: "Buffalokastike | Buffalo sauce" },
      jalkiruoka:     { suomalainen: "Mustikkakiisseli | Blueberry kissel",
                        srilankalainen: "Karamellivanukas | Caramel pudding" }
    },

    /* ═══ DAY 5 ═══ */
    {
      day: 5,
      keitto:    ["Kaalikeitto | Cabbage soup"],
      leipa:     ["Saaristolaisleipä | Archipelago malt bread", "Graham-sämpylä | Graham roll", "Paratha"],
      hedelmat:  ["Banaani | Banana", "Appelsiini | Orange", "Papaija | Papaya", "Vesimeloni | Watermelon"],
      salaatit:  ["Curry-riisisalaatti | Curried rice salad", "Kreikkalainen salaatti | Greek salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Lehtisalaatti | Leaf lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Retiisi | Radish", "Oliivit | Olives", "Suolakurkku | Pickled gherkins"],
      lisukkeet: ["Manioklastut | Cassava chips", "Paistettu sipuli | Crispy fried onions", "Paahdetut siemenet | Toasted seed mix"],
      suomalainen:    { paaruoka: "Jauhelihakastike | Minced beef sauce",
                        lisuke:   "Keitetyt perunat | Boiled potatoes",
                        kasvis:   "Härkis-kasvispata | Fava bean and vegetable stew" },
      srilankalainen: { riisi: "Kookosriisi | Coconut rice",
                        liha:  "Ambul thiyal -kalacurry | Ambul thiyal sour fish curry",
                        kasvis: "Vihreä papucurry | Green bean curry" },
      kana:           { pala: "koivet", kastike: "Kermainen yrttikastike (sweet and spicy) | Creamy herb sauce (sweet and spicy)" },
      jalkiruoka:     { suomalainen: "Pannukakku ja mansikkahillo | Finnish oven pancake with strawberry jam",
                        srilankalainen: "Kokis | Kokis rosette cookies" }
    },

    /* ═══ DAY 6 ═══ */
    {
      day: 6,
      keitto:    ["Mulligatawny-keitto | Mulligatawny soup"],
      leipa:     ["Ruisleipä | Rye bread", "Maalaisleipä | Country loaf", "Valkosipulileipä | Garlic bread"],
      hedelmat:  ["Omena | Apple", "Mango", "Kiivi | Kiwi", "Hunajameloni | Honeydew melon"],
      salaatit:  ["Broileri-caesarsalaatti | Chicken Caesar salad", "Linssi-juuressalaatti | Lentil and root vegetable salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Rucola | Rocket", "Keltainen paprika | Yellow pepper",
                  "Porkkanaraaste | Grated carrot", "Herneet | Green peas", "Kidneypavut | Kidney beans", "Versot | Sprouts"],
      lisukkeet: ["Papadam | Poppadoms", "Krutongit | Croutons", "Paahdetut maapähkinät | Roasted peanuts"],
      suomalainen:    { paaruoka: "Broileria kermakastikkeessa | Chicken in cream sauce",
                        lisuke:   "Täysjyväpasta | Wholegrain pasta",
                        kasvis:   "Kasvispyörykät | Vegetable balls" },
      srilankalainen: { riisi: "Samba-riisi | Samba rice",
                        liha:  "Lammascurry | Lamb curry",
                        kasvis: "Punajuuricurry | Beetroot curry" },
      kana:           { pala: "luuton", kastike: "Hunajasoija | Honey soy" },
      jalkiruoka:     { suomalainen: "Marjarahka | Berry quark",
                        srilankalainen: "Sri Lankan love cake" }
    },

    /* ═══ DAY 7 ═══ */
    {
      day: 7,
      keitto:    ["Lihakeitto | Finnish beef and root vegetable soup"],
      leipa:     ["Hapanjuurileipä | Sourdough bread", "Karjalanpiirakka | Karelian pie", "Pol roti | Coconut roti"],
      hedelmat:  ["Banaani | Banana", "Päärynä | Pear", "Ananas | Pineapple", "Viinirypäleet | Grapes"],
      salaatit:  ["Bataatti-fetasalaatti | Sweet potato and feta salad", "Pesto-pastasalaatti | Pesto pasta salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Jäävuorisalaatti | Iceberg lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Punakaaliraaste | Shredded red cabbage", "Maissi | Sweetcorn", "Jalapeño"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Rapeat nuudelit | Crispy noodles", "Paahdetut kurpitsansiemenet | Toasted pumpkin seeds"],
      suomalainen:    { paaruoka: "Silakkapihvit | Fried Baltic herring fillets",
                        lisuke:   "Perunamuusi | Mashed potatoes",
                        kasvis:   "Lanttulaatikko | Swede casserole" },
      srilankalainen: { riisi: "Punainen riisi | Red rice",
                        liha:  "Devilled pork",
                        kasvis: "Cashew-curry | Cashew nut curry (kaju maluwa)" },
      kana:           { pala: "siivet", kastike: "Chili tulinen | Hot chilli" },
      jalkiruoka:     { suomalainen: "Korvapuusti | Cinnamon bun",
                        srilankalainen: "Sago-vanukas | Sago pudding" }
    },

    /* ═══ DAY 8 ═══ */
    {
      day: 8,
      keitto:    ["Porkkana-inkiväärikeitto | Carrot and ginger soup"],
      leipa:     ["Ruisleipä | Rye bread", "Ohrarieska | Barley flatbread", "Paratha"],
      hedelmat:  ["Appelsiini | Orange", "Omena | Apple", "Vesimeloni | Watermelon", "Luumu | Plum"],
      salaatit:  ["Kana-mangosalaatti | Chicken and mango salad", "Ohra-juuressalaatti | Pearl barley and root vegetable salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Lehtisalaatti | Leaf lettuce", "Keltainen paprika | Yellow pepper",
                  "Retiisi | Radish", "Porkkanaraaste | Grated carrot", "Kikherneet | Chickpeas", "Oliivit | Olives"],
      lisukkeet: ["Papadam | Poppadoms", "Paistettu sipuli | Crispy fried onions", "Kookoslastut | Toasted coconut flakes"],
      suomalainen:    { paaruoka: "Kaalilaatikko | Cabbage and minced beef casserole",
                        lisuke:   "Uunijuurekset | Roasted root vegetables",
                        kasvis:   "Linssipihvit | Lentil patties" },
      srilankalainen: { riisi: "Keltainen riisi (kaha bath) | Yellow rice (kaha bath)",
                        liha:  "Pippurikana | Black pepper chicken",
                        kasvis: "Kaalimallung | Cabbage mallung" },
      kana:           { pala: "koivet", kastike: "Kermainen yrttikastike (sweet and savoury) | Creamy herb sauce (sweet and savoury)" },
      jalkiruoka:     { suomalainen: "Mokkapalat | Mocha squares",
                        srilankalainen: "Pani pol | Coconut pancakes (pani pol)" }
    },

    /* ═══ DAY 9 ═══ */
    {
      day: 9,
      keitto:    ["Kanakeitto | Chicken soup"],
      leipa:     ["Kauraleipä | Oat bread", "Vehnäsämpylä | Wheat roll", "Pol roti | Coconut roti"],
      hedelmat:  ["Banaani | Banana", "Mango", "Mandariini | Mandarin", "Hunajameloni | Honeydew melon"],
      salaatit:  ["Kananmuna-perunasalaatti | Egg and potato salad", "Tofu-nuudelisalaatti | Tofu noodle salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Rucola | Rocket", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Herneet | Green peas", "Babypinaatti | Baby spinach", "Etikkapunajuuri | Pickled beetroot"],
      lisukkeet: ["Sri Lankan mixture | Spicy Sri Lankan mixture", "Krutongit | Croutons", "Paahdetut cashewpähkinät | Roasted cashews"],
      suomalainen:    { paaruoka: "Lindströmin pihvit | Lindström beef and beetroot patties",
                        lisuke:   "Kermaperunat | Creamy potatoes",
                        kasvis:   "Kasvispihvit | Vegetable patties" },
      srilankalainen: { riisi: "Basmatiriisi | Steamed basmati rice",
                        liha:  "Kalacurry | Sri Lankan fish curry",
                        kasvis: "Kurpitsacurry | Pumpkin curry" },
      kana:           { pala: "luuton", kastike: "Buffalokastike | Buffalo sauce" },
      jalkiruoka:     { suomalainen: "Raparperipiirakka | Rhubarb pie",
                        srilankalainen: "Watalappan | Watalappan coconut custard" }
    },

    /* ═══ DAY 10 ═══ */
    {
      day: 10,
      keitto:    ["Kukkakaalikeitto | Cauliflower soup"],
      leipa:     ["Ruisleipä | Rye bread", "Karjalanpiirakka | Karelian pie", "Kurpitsansiemenleipä | Pumpkin seed bread"],
      hedelmat:  ["Omena | Apple", "Kiivi | Kiwi", "Ananas | Pineapple", "Papaija | Papaya"],
      salaatit:  ["Kinkku-makaronisalaatti | Ham and macaroni salad", "Papusalaatti | Three-bean salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Jäävuorisalaatti | Iceberg lettuce", "Keltainen paprika | Yellow pepper",
                  "Punakaaliraaste | Shredded red cabbage", "Kevätsipuli | Spring onion", "Maissi | Sweetcorn", "Suolakurkku | Pickled gherkins"],
      lisukkeet: ["Papadam | Poppadoms", "Rapeat kikherneet | Crispy chickpeas", "Paahdetut siemenet | Toasted seed mix"],
      suomalainen:    { paaruoka: "Merimiespihvi | Sailor's beef and potato bake",
                        lisuke:   "Höyrytetyt kasvikset | Steamed vegetables",
                        kasvis:   "Kasviskiusaus | Vegetable and potato bake" },
      srilankalainen: { riisi: "Srilankalainen paistettu riisi | Sri Lankan fried rice",
                        liha:  "Katkarapucurry | Prawn curry",
                        kasvis: "Parippu-linssicurry | Dhal curry (parippu)" },
      kana:           { pala: "siivet", kastike: "Dewon Special -kastike | Dewon Special sauce" },
      jalkiruoka:     { suomalainen: "Riisipuuro ja luumukiisseli | Rice porridge with prune kissel",
                        srilankalainen: "Thala guli | Sesame and jaggery balls (thala guli)" }
    },

    /* ═══ DAY 11 ═══ */
    {
      day: 11,
      keitto:    ["Kurpitsa-kookoskeitto | Pumpkin and coconut soup"],
      leipa:     ["Hapanjuurileipä | Sourdough bread", "Perunarieska | Potato flatbread", "Paratha"],
      hedelmat:  ["Banaani | Banana", "Appelsiini | Orange", "Viinirypäleet | Grapes", "Cantaloupe-meloni | Cantaloupe melon"],
      salaatit:  ["Kana-pastasalaatti | Chicken pasta salad", "Punajuuri-vuohenjuustosalaatti | Beetroot and goat's cheese salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Lehtisalaatti | Leaf lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Porkkanaraaste | Grated carrot", "Retiisi | Radish", "Kidneypavut | Kidney beans"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Krutongit | Croutons", "Paahdetut maapähkinät | Roasted peanuts"],
      suomalainen:    { paaruoka: "Paistettu kirjolohi | Pan-fried rainbow trout",
                        lisuke:   "Voiperunat | Buttered potatoes",
                        kasvis:   "Nyhtökaura-kasvispata | Pulled oat and vegetable stew" },
      srilankalainen: { riisi: "Ghee-riisi | Ghee rice",
                        liha:  "Valkoinen kanacurry | White chicken curry",
                        kasvis: "Okracurry | Okra curry" },
      kana:           { pala: "koivet", kastike: "Chili tulinen | Hot chilli" },
      jalkiruoka:     { suomalainen: "Puolukkapiirakka | Lingonberry pie",
                        srilankalainen: "Kiri pani | Curd with kithul treacle (kiri pani)" }
    },

    /* ═══ DAY 12 ═══ */
    {
      day: 12,
      keitto:    ["Siskonmakkarakeitto | Finnish sausage soup"],
      leipa:     ["Ruisleipä | Rye bread", "Siemensämpylä | Seeded roll", "Pol roti | Coconut roti"],
      hedelmat:  ["Omena | Apple", "Mango", "Päärynä | Pear", "Vesimeloni | Watermelon"],
      salaatit:  ["Seesami-nuudelisalaatti | Sesame noodle salad", "Perunasalaatti | Potato salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Jäävuorisalaatti | Iceberg lettuce", "Keltainen paprika | Yellow pepper",
                  "Punakaaliraaste | Shredded red cabbage", "Herneet | Green peas", "Oliivit | Olives", "Jalapeño"],
      lisukkeet: ["Papadam | Poppadoms", "Manioklastut | Cassava chips", "Paistettu sipuli | Crispy fried onions"],
      suomalainen:    { paaruoka: "Maksalaatikko | Liver casserole",
                        lisuke:   "Perunamuusi | Mashed potatoes",
                        kasvis:   "Porkkanapihvit | Carrot patties" },
      srilankalainen: { riisi: "Kookosriisi | Coconut rice",
                        liha:  "Devilled chicken",
                        kasvis: "Kikhernecurry | Chickpea curry" },
      kana:           { pala: "luuton", kastike: "Kermainen yrttikastike (sweet and spicy) | Creamy herb sauce (sweet and spicy)" },
      jalkiruoka:     { suomalainen: "Porkkanakakku | Carrot cake",
                        srilankalainen: "Aluwa | Aluwa rice-flour fudge" }
    },

    /* ═══ DAY 13 ═══ */
    {
      day: 13,
      keitto:    ["Purjo-perunakeitto | Leek and potato soup"],
      leipa:     ["Saaristolaisleipä | Archipelago malt bread", "Karjalanpiirakka | Karelian pie", "Valkosipulileipä | Garlic bread"],
      hedelmat:  ["Banaani | Banana", "Ananas | Pineapple", "Mandariini | Mandarin", "Kiivi | Kiwi"],
      salaatit:  ["Katkarapu-avokadosalaatti | Prawn and avocado salad", "Kvinoa-fetasalaatti | Quinoa and feta salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Rucola | Rocket", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Maissi | Sweetcorn", "Babypinaatti | Baby spinach", "Versot | Sprouts"],
      lisukkeet: ["Sri Lankan mixture | Spicy Sri Lankan mixture", "Paahdetut kurpitsansiemenet | Toasted pumpkin seeds", "Rapeat nuudelit | Crispy noodles"],
      suomalainen:    { paaruoka: "Uunimakkara | Oven-baked sausage",
                        lisuke:   "Sinappiperunat | Mustard potatoes",
                        kasvis:   "Tofu-kasvispata | Tofu and vegetable stew" },
      srilankalainen: { riisi: "Jeera-riisi | Cumin rice",
                        liha:  "Naudanlihacurry | Beef curry",
                        kasvis: "Sienicurry | Mushroom curry" },
      kana:           { pala: "siivet", kastike: "Chili medium | Medium chilli" },
      jalkiruoka:     { suomalainen: "Uuniomenat ja vaniljakastike | Baked apples with vanilla sauce",
                        srilankalainen: "Kavum | Kavum oil cakes" }
    },

    /* ═══ DAY 14 ═══ */
    {
      day: 14,
      keitto:    ["Tomaatti-linssikeitto | Tomato and lentil soup"],
      leipa:     ["Ruisleipä | Rye bread", "Graham-sämpylä | Graham roll", "Paratha"],
      hedelmat:  ["Omena | Apple", "Appelsiini | Orange", "Hunajameloni | Honeydew melon", "Viinirypäleet | Grapes"],
      salaatit:  ["Tonnikala-pastasalaatti | Tuna pasta salad", "Kikherne-couscoussalaatti | Chickpea couscous salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Lehtisalaatti | Leaf lettuce", "Keltainen paprika | Yellow pepper",
                  "Porkkanaraaste | Grated carrot", "Retiisi | Radish", "Kikherneet | Chickpeas", "Etikkapunajuuri | Pickled beetroot"],
      lisukkeet: ["Papadam | Poppadoms", "Krutongit | Croutons", "Kookoslastut | Toasted coconut flakes"],
      suomalainen:    { paaruoka: "Porsaanleike | Pork schnitzel",
                        lisuke:   "Lohkoperunat | Potato wedges",
                        kasvis:   "Kesäkurpitsa-fetavuoka | Courgette and feta bake" },
      srilankalainen: { riisi: "Keltainen riisi (kaha bath) | Yellow rice (kaha bath)",
                        liha:  "Srilankalainen kanacurry | Sri Lankan chicken curry",
                        kasvis: "Tempered perunat | Tempered potatoes" },
      kana:           { pala: "koivet", kastike: "Hunajasoija | Honey soy" },
      jalkiruoka:     { suomalainen: "Kinuskikakku | Caramel sponge cake",
                        srilankalainen: "Karamellivanukas | Caramel pudding" }
    },

    /* ═══ DAY 15 ═══ */
    {
      day: 15,
      keitto:    ["Kalakeitto | Clear Finnish fish soup"],
      leipa:     ["Kauraleipä | Oat bread", "Ohrarieska | Barley flatbread", "Pol roti | Coconut roti"],
      hedelmat:  ["Banaani | Banana", "Mango", "Luumu | Plum", "Ananas | Pineapple"],
      salaatit:  ["Curry-riisisalaatti | Curried rice salad", "Rosolli | Rosolli beetroot salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Jäävuorisalaatti | Iceberg lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Punakaaliraaste | Shredded red cabbage", "Herneet | Green peas", "Oliivit | Olives"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Paahdetut siemenet | Toasted seed mix", "Paahdetut cashewpähkinät | Roasted cashews"],
      suomalainen:    { paaruoka: "Lohikiusaus | Salmon and potato bake",
                        lisuke:   "Herneet ja porkkanat | Peas and carrots",
                        kasvis:   "Kukkakaalipihvit | Cauliflower patties" },
      srilankalainen: { riisi: "Punainen riisi | Red rice",
                        liha:  "Musta porsascurry | Black pork curry",
                        kasvis: "Pinaattimallung | Spinach mallung" },
      kana:           { pala: "luuton", kastike: "Dewon Special -kastike | Dewon Special sauce" },
      jalkiruoka:     { suomalainen: "Mansikkakiisseli | Strawberry kissel",
                        srilankalainen: "Kokis | Kokis rosette cookies" }
    },

    /* ═══ DAY 16 ═══ */
    {
      day: 16,
      keitto:    ["Bataatti-chilikeitto | Sweet potato and chilli soup"],
      leipa:     ["Ruisleipä | Rye bread", "Maalaisleipä | Country loaf", "Karjalanpiirakka | Karelian pie"],
      hedelmat:  ["Omena | Apple", "Kiivi | Kiwi", "Vesimeloni | Watermelon", "Nektariini | Nectarine"],
      salaatit:  ["Broileri-caesarsalaatti | Chicken Caesar salad", "Bataatti-fetasalaatti | Sweet potato and feta salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Rucola | Rocket", "Keltainen paprika | Yellow pepper",
                  "Kevätsipuli | Spring onion", "Porkkanaraaste | Grated carrot", "Maissi | Sweetcorn", "Kidneypavut | Kidney beans"],
      lisukkeet: ["Papadam | Poppadoms", "Paistettu sipuli | Crispy fried onions", "Rapeat kikherneet | Crispy chickpeas"],
      suomalainen:    { paaruoka: "Jauhelihamureke | Finnish meatloaf",
                        lisuke:   "Keitetyt perunat | Boiled potatoes",
                        kasvis:   "Punajuuripihvit | Beetroot patties" },
      srilankalainen: { riisi: "Sitruunariisi | Lemon rice",
                        liha:  "Devilled beef",
                        kasvis: "Porkkanacurry | Carrot curry" },
      kana:           { pala: "siivet", kastike: "Kermainen yrttikastike (sweet and savoury) | Creamy herb sauce (sweet and savoury)" },
      jalkiruoka:     { suomalainen: "Mustikkapiirakka | Blueberry pie",
                        srilankalainen: "Maitotoffee | Milk toffee" }
    },

    /* ═══ DAY 17 ═══ */
    {
      day: 17,
      keitto:    ["Sienikeitto | Mushroom soup"],
      leipa:     ["Hapanjuurileipä | Sourdough bread", "Vehnäsämpylä | Wheat roll", "Paratha"],
      hedelmat:  ["Banaani | Banana", "Appelsiini | Orange", "Papaija | Papaya", "Päärynä | Pear"],
      salaatit:  ["Pesto-pastasalaatti | Pesto pasta salad", "Kylmäsavulohi-perunasalaatti | Cold-smoked salmon potato salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Lehtisalaatti | Leaf lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Retiisi | Radish", "Babypinaatti | Baby spinach", "Suolakurkku | Pickled gherkins"],
      lisukkeet: ["Sri Lankan mixture | Spicy Sri Lankan mixture", "Krutongit | Croutons", "Paahdetut maapähkinät | Roasted peanuts"],
      suomalainen:    { paaruoka: "Kaalikääryleet | Cabbage rolls",
                        lisuke:   "Keitetyt perunat | Boiled potatoes",
                        kasvis:   "Kasvis-kaalikääryleet | Vegetarian cabbage rolls" },
      srilankalainen: { riisi: "Basmatiriisi | Steamed basmati rice",
                        liha:  "Kana-kottu | Chicken kottu roti",
                        kasvis: "Sekakasviscurry | Mixed vegetable curry" },
      kana:           { pala: "koivet", kastike: "Buffalokastike | Buffalo sauce" },
      jalkiruoka:     { suomalainen: "Vispipuuro | Whipped lingonberry porridge",
                        srilankalainen: "Watalappan | Watalappan coconut custard" }
    },

    /* ═══ DAY 18 ═══ */
    {
      day: 18,
      keitto:    ["Kesäkeitto | Finnish summer vegetable soup"],
      leipa:     ["Ruisleipä | Rye bread", "Perunarieska | Potato flatbread", "Pol roti | Coconut roti"],
      hedelmat:  ["Omena | Apple", "Mango", "Viinirypäleet | Grapes", "Hunajameloni | Honeydew melon"],
      salaatit:  ["Kana-mangosalaatti | Chicken and mango salad", "Linssi-juuressalaatti | Lentil and root vegetable salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Jäävuorisalaatti | Iceberg lettuce", "Keltainen paprika | Yellow pepper",
                  "Punakaaliraaste | Shredded red cabbage", "Herneet | Green peas", "Kikherneet | Chickpeas", "Versot | Sprouts"],
      lisukkeet: ["Papadam | Poppadoms", "Manioklastut | Cassava chips", "Paahdetut kurpitsansiemenet | Toasted pumpkin seeds"],
      suomalainen:    { paaruoka: "Broileripyörykät | Chicken meatballs",
                        lisuke:   "Kermaperunat | Creamy potatoes",
                        kasvis:   "Bataattilaatikko | Sweet potato casserole" },
      srilankalainen: { riisi: "Ghee-riisi | Ghee rice",
                        liha:  "Ambul thiyal -kalacurry | Ambul thiyal sour fish curry",
                        kasvis: "Polos-curry (nuori jakkihedelmä) | Young jackfruit curry (polos)" },
      kana:           { pala: "luuton", kastike: "Chili tulinen | Hot chilli" },
      jalkiruoka:     { suomalainen: "Pullavanukas | Cardamom bun pudding",
                        srilankalainen: "Pani pol | Coconut pancakes (pani pol)" }
    },

    /* ═══ DAY 19 ═══ */
    {
      day: 19,
      keitto:    ["Rasam | Rasam tamarind pepper soup"],
      leipa:     ["Kauraleipä | Oat bread", "Karjalanpiirakka | Karelian pie", "Siemensämpylä | Seeded roll"],
      hedelmat:  ["Banaani | Banana", "Ananas | Pineapple", "Kiivi | Kiwi", "Mandariini | Mandarin"],
      salaatit:  ["Kananmuna-perunasalaatti | Egg and potato salad", "Kreikkalainen salaatti | Greek salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Rucola | Rocket", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Porkkanaraaste | Grated carrot", "Maissi | Sweetcorn", "Jalapeño"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Paistettu sipuli | Crispy fried onions", "Kookoslastut | Toasted coconut flakes"],
      suomalainen:    { paaruoka: "Nakkistroganoff | Sausage stroganoff",
                        lisuke:   "Keitetty riisi | Boiled rice",
                        kasvis:   "Sienistroganoff | Mushroom stroganoff" },
      srilankalainen: { riisi: "Idiyappam | String hoppers (idiyappam)",
                        liha:  "Valkoinen kanacurry | White chicken curry",
                        kasvis: "Parippu-linssicurry | Dhal curry (parippu)" },
      kana:           { pala: "siivet", kastike: "Kermainen yrttikastike (sweet and spicy) | Creamy herb sauce (sweet and spicy)" },
      jalkiruoka:     { suomalainen: "Mustikka-rahkapiirakka | Blueberry quark pie",
                        srilankalainen: "Sago-vanukas | Sago pudding" }
    },

    /* ═══ DAY 20 ═══ */
    {
      day: 20,
      keitto:    ["Juuressosekeitto | Root vegetable soup"],
      leipa:     ["Ruisleipä | Rye bread", "Saaristolaisleipä | Archipelago malt bread", "Paratha"],
      hedelmat:  ["Omena | Apple", "Appelsiini | Orange", "Vesimeloni | Watermelon", "Mango"],
      salaatit:  ["Kinkku-makaronisalaatti | Ham and macaroni salad", "Tofu-nuudelisalaatti | Tofu noodle salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Lehtisalaatti | Leaf lettuce", "Keltainen paprika | Yellow pepper",
                  "Kevätsipuli | Spring onion", "Retiisi | Radish", "Oliivit | Olives", "Etikkapunajuuri | Pickled beetroot"],
      lisukkeet: ["Papadam | Poppadoms", "Krutongit | Croutons", "Paahdetut cashewpähkinät | Roasted cashews"],
      suomalainen:    { paaruoka: "Pyttipannu ja paistettu kananmuna | Finnish hash with fried egg",
                        lisuke:   "Etikkapunajuuret | Pickled beetroot",
                        kasvis:   "Kasvispyttipannu | Vegetable hash" },
      srilankalainen: { riisi: "Srilankalainen paistettu riisi | Sri Lankan fried rice",
                        liha:  "Lammascurry | Lamb curry",
                        kasvis: "Kukkakaalicurry | Cauliflower curry" },
      kana:           { pala: "koivet", kastike: "Chili medium | Medium chilli" },
      jalkiruoka:     { suomalainen: "Leipäjuusto ja lakkahillo | Squeaky cheese with cloudberry jam",
                        srilankalainen: "Thala guli | Sesame and jaggery balls (thala guli)" }
    },

    /* ═══ DAY 21 ═══ */
    {
      day: 21,
      keitto:    ["Pinaattikeitto | Spinach soup with egg"],
      leipa:     ["Hapanjuurileipä | Sourdough bread", "Graham-sämpylä | Graham roll", "Pol roti | Coconut roti"],
      hedelmat:  ["Banaani | Banana", "Päärynä | Pear", "Viinirypäleet | Grapes", "Cantaloupe-meloni | Cantaloupe melon"],
      salaatit:  ["Papusalaatti | Three-bean salad", "Kana-pastasalaatti | Chicken pasta salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Jäävuorisalaatti | Iceberg lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Punakaaliraaste | Shredded red cabbage", "Herneet | Green peas", "Babypinaatti | Baby spinach"],
      lisukkeet: ["Sri Lankan mixture | Spicy Sri Lankan mixture", "Rapeat nuudelit | Crispy noodles", "Paahdetut siemenet | Toasted seed mix"],
      suomalainen:    { paaruoka: "Kinkkukiusaus | Ham and potato bake",
                        lisuke:   "Höyrytetty parsakaali | Steamed broccoli",
                        kasvis:   "Juureskiusaus | Root vegetable bake" },
      srilankalainen: { riisi: "Keltainen riisi (kaha bath) | Yellow rice (kaha bath)",
                        liha:  "Katkarapucurry | Prawn curry",
                        kasvis: "Munakoisomoju | Aubergine moju (wambatu moju)" },
      kana:           { pala: "luuton", kastike: "Hunajasoija | Honey soy" },
      jalkiruoka:     { suomalainen: "Tiikerikakku | Marble cake",
                        srilankalainen: "Kiri pani | Curd with kithul treacle (kiri pani)" }
    },

    /* ═══ DAY 22 ═══ */
    {
      day: 22,
      keitto:    ["Kookos-kanakeitto | Coconut chicken soup"],
      leipa:     ["Ruisleipä | Rye bread", "Karjalanpiirakka | Karelian pie", "Valkosipulileipä | Garlic bread"],
      hedelmat:  ["Omena | Apple", "Ananas | Pineapple", "Papaija | Papaya", "Kiivi | Kiwi"],
      salaatit:  ["Ohra-juuressalaatti | Pearl barley and root vegetable salad", "Tonnikala-pastasalaatti | Tuna pasta salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Rucola | Rocket", "Keltainen paprika | Yellow pepper",
                  "Porkkanaraaste | Grated carrot", "Maissi | Sweetcorn", "Kikherneet | Chickpeas", "Suolakurkku | Pickled gherkins"],
      lisukkeet: ["Papadam | Poppadoms", "Rapeat kikherneet | Crispy chickpeas", "Paistettu sipuli | Crispy fried onions"],
      suomalainen:    { paaruoka: "Paistetut muikut | Fried vendace",
                        lisuke:   "Perunamuusi | Mashed potatoes",
                        kasvis:   "Kasvislasagne | Vegetable lasagne" },
      srilankalainen: { riisi: "Kookosriisi | Coconut rice",
                        liha:  "Pippurikana | Black pepper chicken",
                        kasvis: "Punajuuricurry | Beetroot curry" },
      kana:           { pala: "siivet", kastike: "Buffalokastike | Buffalo sauce" },
      jalkiruoka:     { suomalainen: "Omenapiirakka ja vaniljakastike | Apple pie with vanilla sauce",
                        srilankalainen: "Sri Lankan love cake" }
    },

    /* ═══ DAY 23 ═══ */
    {
      day: 23,
      keitto:    ["Parsakaalikeitto | Broccoli soup"],
      leipa:     ["Kauraleipä | Oat bread", "Maalaisleipä | Country loaf", "Paratha"],
      hedelmat:  ["Banaani | Banana", "Appelsiini | Orange", "Mango", "Hunajameloni | Honeydew melon"],
      salaatit:  ["Perunasalaatti | Potato salad", "Katkarapu-avokadosalaatti | Prawn and avocado salad"],
      kasvikset: ["Kurkku | Cucumber", "Tomaatti | Tomato", "Lehtisalaatti | Leaf lettuce", "Punainen paprika | Red pepper",
                  "Punasipuli | Red onion", "Retiisi | Radish", "Kidneypavut | Kidney beans", "Versot | Sprouts"],
      lisukkeet: ["Katkarapusipsit | Prawn crackers", "Krutongit | Croutons", "Paahdetut kurpitsansiemenet | Toasted pumpkin seeds"],
      suomalainen:    { paaruoka: "Possun kermapata | Creamy pork stew",
                        lisuke:   "Keitetyt perunat | Boiled potatoes",
                        kasvis:   "Sieniohratto | Mushroom and barley risotto" },
      srilankalainen: { riisi: "Samba-riisi | Samba rice",
                        liha:  "Devilled chicken",
                        kasvis: "Vihreä papucurry | Green bean curry" },
      kana:           { pala: "koivet", kastike: "Kermainen yrttikastike (sweet and savoury) | Creamy herb sauce (sweet and savoury)" },
      jalkiruoka:     { suomalainen: "Mannapuuro ja mustikkakeitto | Semolina porridge with blueberry soup",
                        srilankalainen: "Kavum | Kavum oil cakes" }
    },

    /* ═══ DAY 24 ═══ */
    {
      day: 24,
      keitto:    ["Punajuurikeitto | Beetroot soup"],
      leipa:     ["Ruisleipä | Rye bread", "Ohrarieska | Barley flatbread", "Pol roti | Coconut roti"],
      hedelmat:  ["Omena | Apple", "Viinirypäleet | Grapes", "Vesimeloni | Watermelon", "Mandariini | Mandarin"],
      salaatit:  ["Kvinoa-fetasalaatti | Quinoa and feta salad", "Curry-riisisalaatti | Curried rice salad"],
      kasvikset: ["Kurkku | Cucumber", "Kirsikkatomaatti | Cherry tomatoes", "Jäävuorisalaatti | Iceberg lettuce", "Keltainen paprika | Yellow pepper",
                  "Kevätsipuli | Spring onion", "Punakaaliraaste | Shredded red cabbage", "Herneet | Green peas", "Oliivit | Olives"],
      lisukkeet: ["Papadam | Poppadoms", "Manioklastut | Cassava chips", "Paahdetut maapähkinät | Roasted peanuts"],
      suomalainen:    { paaruoka: "Jauhelihapihvit ja sipulikastike | Beef patties with onion gravy",
                        lisuke:   "Perunamuusi | Mashed potatoes",
                        kasvis:   "Kukkakaaligratiini | Cauliflower gratin" },
      srilankalainen: { riisi: "Punainen riisi | Red rice",
                        liha:  "Naudanlihacurry | Beef curry",
                        kasvis: "Cashew-curry | Cashew nut curry (kaju maluwa)" },
      kana:           { pala: "luuton", kastike: "Dewon Special -kastike | Dewon Special sauce" },
      jalkiruoka:     { suomalainen: "Marjarahka | Berry quark",
                        srilankalainen: "Karamellivanukas | Caramel pudding" }
    }

  ]
};
