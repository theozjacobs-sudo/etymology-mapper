/*
 * Curated etymology journeys.
 *
 * Each entry is a small directed graph:
 *   nodes: { id, lang, form, gloss, loc: [lon, lat], date, note, big,
 *            dx, dy, anchor }  — dx/dy/anchor hand-tune label placement (px)
 *   edges: { from, to, bend, kind }  — bend curves the arrow (+ = left of travel),
 *            kind "derive" draws the short black derivation arrow (like *kers- → *ḱr̥sós)
 *
 * Locations are deliberately approximate: they mark roughly where a language
 * community lived when it passed the word along, not precise borders.
 */

window.ETYMOLOGIES = [
  {
    id: "horse-car",
    words: ["horse", "car"],
    caption: "The words “horse” and “car” have a common origin",
    nodes: [
      { id: "kers", lang: "Proto-Indo-European", form: "*ḱers-", gloss: "to run",
        loc: [44.0, 51.5], date: "c. 4500–2500 BCE", note: "Spoken on the Pontic–Caspian steppe, north of the Black Sea.", dy: -14 },
      { id: "krsos", lang: "Proto-Indo-European", form: "*ḱr̥sós", gloss: "vehicle — literally: ‘runner’",
        loc: [44.0, 46.2], date: "c. 4500–2500 BCE", dy: 26 },
      { id: "hrussa", lang: "Proto-Germanic", form: "*hrussą", gloss: "horse",
        loc: [10.0, 56.2], date: "c. 500 BCE", dy: -14 },
      { id: "hross", lang: "Proto-West Germanic", form: "*hross", gloss: "horse",
        loc: [7.2, 52.3], date: "c. 200 CE", dy: 26 },
      { id: "horse", lang: "English", form: "horse", big: true,
        loc: [-1.3, 53.6], date: "Old English hors", dy: -12 },
      { id: "karros", lang: "Proto-Celtic", form: "*karros", gloss: "wagon",
        loc: [14.5, 47.6], date: "c. 800 BCE", dy: 26 },
      { id: "carrus", lang: "Latin", form: "carrus", gloss: "wagon",
        loc: [12.5, 41.9], date: "borrowed from Gaulish, c. 200 BCE", dy: 26 },
      { id: "carre", lang: "Old French", form: "carre", gloss: "cart",
        loc: [2.4, 48.0], date: "c. 1100", dy: 26 },
      { id: "car", lang: "English", form: "car", big: true,
        loc: [-2.8, 51.3], date: "c. 1300, ‘wheeled cart’ — the motor sense is from the 1890s", dy: 24 }
    ],
    edges: [
      { from: "kers", to: "krsos", kind: "derive" },
      { from: "krsos", to: "hrussa", bend: 0.25 },
      { from: "hrussa", to: "hross", bend: 0.2 },
      { from: "hross", to: "horse", bend: 0.15 },
      { from: "krsos", to: "karros", bend: -0.2 },
      { from: "karros", to: "carrus", bend: -0.2 },
      { from: "carrus", to: "carre", bend: -0.25 },
      { from: "carre", to: "car", bend: -0.2 }
    ]
  },

  {
    id: "tea-chai",
    words: ["tea", "chai"],
    caption: "“tea” came by sea, “chai” came by land — from the same Chinese word",
    nodes: [
      { id: "cha0", lang: "Chinese", form: "茶", gloss: "tea",
        loc: [104.5, 28.5], date: "the plant is native to southwest China", dy: -14 },
      { id: "te", lang: "Min Nan Chinese", form: "tê", gloss: "tea — the port pronunciation",
        loc: [118.2, 24.6], date: "coastal Fujian, where Dutch traders bought it", dy: 30 },
      { id: "thee", lang: "Dutch", form: "thee", gloss: "tea",
        loc: [4.9, 52.2], date: "1600s, shipped home by the Dutch East India Company", dy: 30, dx: 30 },
      { id: "tea", lang: "English", form: "tea", big: true,
        loc: [-1.5, 53.2], date: "1650s", dy: -12 },
      { id: "cha2", lang: "Mandarin Chinese", form: "chá", gloss: "tea — the inland pronunciation",
        loc: [112.0, 38.5], date: "", dy: -16 },
      { id: "chay", lang: "Persian", form: "چای chāy", gloss: "tea",
        loc: [54.0, 34.5], date: "carried west along the Silk Road", dy: -16 },
      { id: "hchay", lang: "Hindi", form: "चाय cāy", gloss: "tea",
        loc: [77.2, 24.5], date: "", dy: 28 },
      { id: "chai", lang: "English", form: "chai", big: true,
        loc: [-4.0, 50.5], date: "20th century, from Indian masala chai", dy: 26 }
    ],
    edges: [
      { from: "cha0", to: "te", bend: 0.25 },
      { from: "te", to: "thee", bend: -0.42 },
      { from: "thee", to: "tea", bend: 0.25 },
      { from: "cha0", to: "cha2", bend: 0.25 },
      { from: "cha2", to: "chay", bend: 0.15 },
      { from: "chay", to: "hchay", bend: -0.3 },
      { from: "hchay", to: "chai", bend: -0.1 }
    ]
  },

  {
    id: "salary-sausage",
    words: ["salary", "sausage"],
    caption: "“salary” and “sausage” are both children of Latin sāl — salt",
    nodes: [
      { id: "sal", lang: "Latin", form: "sāl", gloss: "salt",
        loc: [12.5, 41.9], date: "salt was money-adjacent: Rome paid and preserved with it", dy: 26 },
      { id: "salarium", lang: "Latin", form: "salārium", gloss: "a soldier’s salt-allowance",
        loc: [8.6, 45.6], date: "", dy: -14 },
      { id: "salaire", lang: "Old French", form: "salaire", gloss: "wages",
        loc: [0.8, 47.2], date: "c. 1200", dy: 28 },
      { id: "salary", lang: "English", form: "salary", big: true,
        loc: [-1.3, 53.3], date: "late 13th century", dy: -12 },
      { id: "salsicia", lang: "Late Latin", form: "salsīcia", gloss: "salted (meat)",
        loc: [15.5, 40.2], date: "", dy: 28 },
      { id: "saussiche", lang: "Old North French", form: "saussiche", gloss: "sausage",
        loc: [4.6, 50.4], date: "", dy: -14 },
      { id: "sausage", lang: "English", form: "sausage", big: true,
        loc: [-3.2, 51.0], date: "mid 15th century", dy: 26 }
    ],
    edges: [
      { from: "sal", to: "salarium", bend: 0.2 },
      { from: "salarium", to: "salaire", bend: 0.15 },
      { from: "salaire", to: "salary", bend: 0.15 },
      { from: "sal", to: "salsicia", bend: -0.25 },
      { from: "salsicia", to: "saussiche", bend: -0.22 },
      { from: "saussiche", to: "sausage", bend: -0.15 }
    ]
  },

  {
    id: "guest-host",
    words: ["guest", "host"],
    caption: "To the steppe, a stranger could be either: “guest” and “host” split from one word",
    nodes: [
      { id: "ghostis", lang: "Proto-Indo-European", form: "*gʰóstis", gloss: "stranger; guest",
        loc: [44.0, 48.5], date: "c. 4500–2500 BCE", dy: -14 },
      { id: "gastiz", lang: "Proto-Germanic", form: "*gastiz", gloss: "guest",
        loc: [10.0, 56.0], date: "c. 500 BCE", dy: -14 },
      { id: "gestr", lang: "Old Norse", form: "gestr", gloss: "guest",
        loc: [7.0, 60.8], date: "c. 900 CE", dy: -14 },
      { id: "guest", lang: "English", form: "guest", big: true,
        loc: [-1.1, 53.9], date: "borrowed from the Vikings of the Danelaw", dy: -12 },
      { id: "hospes", lang: "Latin", form: "hospes", gloss: "host; guest — from *gʰos-póts ‘guest-master’",
        loc: [12.5, 41.9], date: "", dy: 26 },
      { id: "oste", lang: "Old French", form: "(h)oste", gloss: "host, innkeeper",
        loc: [2.4, 48.0], date: "c. 1100", dy: 26 },
      { id: "host", lang: "English", form: "host", big: true,
        loc: [-3.0, 51.2], date: "late 13th century", dy: 26 }
    ],
    edges: [
      { from: "ghostis", to: "gastiz", bend: 0.25 },
      { from: "gastiz", to: "gestr", bend: 0.2 },
      { from: "gestr", to: "guest", bend: 0.25 },
      { from: "ghostis", to: "hospes", bend: -0.2 },
      { from: "hospes", to: "oste", bend: -0.25 },
      { from: "oste", to: "host", bend: -0.2 }
    ]
  },

  {
    id: "shirt-skirt",
    words: ["shirt", "skirt"],
    caption: "The same Germanic garment came ashore twice: “shirt” with the Anglo-Saxons, “skirt” with the Vikings",
    nodes: [
      { id: "skurtijo", lang: "Proto-Germanic", form: "*skurtijǫ", gloss: "a short garment",
        loc: [9.8, 55.8], date: "c. 500 BCE — related to ‘short’", dy: -8, dx: 18, anchor: "start" },
      { id: "scyrte", lang: "Old English", form: "scyrte", gloss: "shirt",
        loc: [-1.0, 51.6], date: "brought over in the Anglo-Saxon migrations, 400s–500s", dy: 28 },
      { id: "shirt", lang: "English", form: "shirt", big: true,
        loc: [-4.2, 52.6], date: "", dy: -12 },
      { id: "skyrta", lang: "Old Norse", form: "skyrta", gloss: "shirt, tunic",
        loc: [6.8, 61.0], date: "c. 900 CE", dy: -14 },
      { id: "skirt", lang: "English", form: "skirt", big: true,
        loc: [-0.6, 54.4], date: "c. 1300 — landed with Norse settlers in the Danelaw", dy: -12 }
    ],
    edges: [
      { from: "skurtijo", to: "scyrte", bend: -0.2 },
      { from: "scyrte", to: "shirt", bend: -0.15 },
      { from: "skurtijo", to: "skyrta", bend: 0.2 },
      { from: "skyrta", to: "skirt", bend: 0.25 }
    ]
  },

  {
    id: "chess-check",
    words: ["chess", "check"],
    caption: "Every “check” you cash descends from the Persian word for king",
    nodes: [
      { id: "shah", lang: "Persian", form: "شاه shāh", gloss: "king",
        loc: [53.0, 32.0], date: "the cry that warned: your king is attacked", dy: 30 },
      { id: "ashah", lang: "Arabic", form: "shāh", gloss: "check! (in shatranj, chess)",
        loc: [44.4, 33.3], date: "chess reached the Arab world by the 600s", dy: 28 },
      { id: "eschec", lang: "Old French", form: "eschec", gloss: "check!",
        loc: [2.0, 48.7], date: "c. 1100", dy: -14 },
      { id: "check", lang: "English", form: "check", big: true,
        loc: [-1.2, 53.4], date: "‘stop the king’ → ‘stop, restrain’ → ‘verify’ → the bank cheque", dy: -12 },
      { id: "esches", lang: "Old French", form: "eschés", gloss: "the game of ‘checks’ (plural)",
        loc: [4.2, 46.8], date: "", dy: 28 },
      { id: "chess", lang: "English", form: "chess", big: true,
        loc: [-3.4, 51.0], date: "c. 1200", dy: 26 }
    ],
    edges: [
      { from: "shah", to: "ashah", bend: 0.2 },
      { from: "ashah", to: "eschec", bend: 0.22 },
      { from: "eschec", to: "check", bend: 0.15 },
      { from: "ashah", to: "esches", bend: -0.18 },
      { from: "esches", to: "chess", bend: -0.2 }
    ]
  },

  {
    id: "orange",
    words: ["orange"],
    caption: "“orange” travelled from Sanskrit to English — and named the color only after the fruit arrived",
    nodes: [
      { id: "naranga", lang: "Sanskrit", form: "nāraṅga", gloss: "orange tree",
        loc: [78.0, 25.0], date: "the fruit is native to South Asia", dy: -14 },
      { id: "narang", lang: "Persian", form: "nārang", gloss: "orange",
        loc: [54.0, 32.5], date: "", dy: -14 },
      { id: "naranj", lang: "Arabic", form: "nāranj", gloss: "orange",
        loc: [44.0, 24.5], date: "Arab traders spread the tree around the Mediterranean", dy: 28 },
      { id: "orenge", lang: "Old French", form: "orenge", gloss: "‘une norenge’ became ‘une orenge’ — the n- fell off",
        loc: [2.4, 47.8], date: "12th century", dy: 28 },
      { id: "orange", lang: "English", form: "orange", big: true,
        loc: [-1.5, 52.9], date: "c. 1400; the color sense only from the 1510s", dy: -12 }
    ],
    edges: [
      { from: "naranga", to: "narang", bend: 0.15 },
      { from: "narang", to: "naranj", bend: 0.15 },
      { from: "naranj", to: "orenge", bend: -0.25 },
      { from: "orenge", to: "orange", bend: 0.2 }
    ]
  },

  {
    id: "coffee",
    words: ["coffee"],
    caption: "“coffee” came up from Yemen, one port at a time",
    nodes: [
      { id: "qahwa", lang: "Arabic", form: "قهوة qahwah", gloss: "coffee",
        loc: [44.2, 15.4], date: "brewed by Sufis in 15th-century Yemen", dy: 28 },
      { id: "kahve", lang: "Ottoman Turkish", form: "kahve", gloss: "coffee",
        loc: [29.0, 41.0], date: "Istanbul’s first coffeehouses opened in the 1550s", dy: -14 },
      { id: "caffe", lang: "Italian", form: "caffè", gloss: "coffee",
        loc: [12.3, 45.4], date: "Venetian merchants brought it west", dy: -14 },
      { id: "coffee", lang: "English", form: "coffee", big: true,
        loc: [-1.5, 52.6], date: "1590s; London coffeehouses from 1652", dy: -12 }
    ],
    edges: [
      { from: "qahwa", to: "kahve", bend: 0.2 },
      { from: "kahve", to: "caffe", bend: 0.15 },
      { from: "caffe", to: "coffee", bend: 0.18 }
    ]
  },

  {
    id: "sugar",
    words: ["sugar"],
    caption: "“sugar” began as Sanskrit for gravel",
    nodes: [
      { id: "sarkara", lang: "Sanskrit", form: "śárkarā", gloss: "gravel, grit — then ground sugar",
        loc: [78.0, 25.0], date: "sugarcane was first refined in India", dy: -14 },
      { id: "shakar", lang: "Persian", form: "shakar", gloss: "sugar",
        loc: [54.0, 32.5], date: "", dy: -14 },
      { id: "sukkar", lang: "Arabic", form: "sukkar", gloss: "sugar",
        loc: [44.0, 24.5], date: "Arab agriculture carried cane to the Mediterranean", dy: 28 },
      { id: "sucre", lang: "Old French", form: "sucre", gloss: "sugar",
        loc: [2.4, 47.8], date: "12th century, via Crusade-era trade", dy: 28 },
      { id: "sugar", lang: "English", form: "sugar", big: true,
        loc: [-1.5, 52.9], date: "late 13th century", dy: -12 }
    ],
    edges: [
      { from: "sarkara", to: "shakar", bend: 0.15 },
      { from: "shakar", to: "sukkar", bend: 0.15 },
      { from: "sukkar", to: "sucre", bend: -0.25 },
      { from: "sucre", to: "sugar", bend: 0.2 }
    ]
  },

  {
    id: "avocado",
    words: ["avocado"],
    caption: "“avocado” crossed the Atlantic from Nahuatl",
    nodes: [
      { id: "ahuacatl", lang: "Nahuatl", form: "āhuacatl", gloss: "avocado",
        loc: [-99.1, 19.4], date: "the language of the Aztec Empire", dy: -14 },
      { id: "aguacate", lang: "Spanish", form: "aguacate · avocado", gloss: "avocado",
        loc: [-3.7, 40.4], date: "carried home by the Spanish in the 1500s", dy: 28 },
      { id: "avocado", lang: "English", form: "avocado", big: true,
        loc: [-1.5, 52.7], date: "1690s", dy: -12 }
    ],
    edges: [
      { from: "ahuacatl", to: "aguacate", bend: 0.12 },
      { from: "aguacate", to: "avocado", bend: -0.2 }
    ]
  },

  {
    id: "wine-vine",
    words: ["wine", "vine"],
    caption: "“wine” and “vine” both poured out of Latin vīnum",
    nodes: [
      { id: "vinum", lang: "Latin", form: "vīnum", gloss: "wine",
        loc: [12.5, 41.9], date: "possibly from a Mediterranean word older than Latin itself", dy: 26 },
      { id: "wina", lang: "Proto-Germanic", form: "*wīną", gloss: "wine",
        loc: [10.0, 56.0], date: "borrowed early, along with the Roman wine trade", dy: -14 },
      { id: "win", lang: "Old English", form: "wīn", gloss: "wine",
        loc: [0.6, 51.9], date: "", dy: 28 },
      { id: "wine", lang: "English", form: "wine", big: true,
        loc: [-1.8, 53.4], date: "", dy: -12 },
      { id: "vinea", lang: "Latin", form: "vīnea", gloss: "vineyard; grapevine",
        loc: [8.6, 44.8], date: "", dy: -14 },
      { id: "vigne", lang: "Old French", form: "vigne", gloss: "vine",
        loc: [2.4, 47.9], date: "c. 1100", dy: 28 },
      { id: "vine", lang: "English", form: "vine", big: true,
        loc: [-3.4, 51.2], date: "c. 1300", dy: 26 }
    ],
    edges: [
      { from: "vinum", to: "wina", bend: 0.25 },
      { from: "wina", to: "win", bend: 0.2 },
      { from: "win", to: "wine", bend: 0.15 },
      { from: "vinum", to: "vinea", bend: -0.2 },
      { from: "vinea", to: "vigne", bend: -0.2 },
      { from: "vigne", to: "vine", bend: -0.18 }
    ]
  },

  {
    id: "whiskey",
    words: ["whiskey"],
    caption: "“whiskey” is Irish for ‘water of life’",
    nodes: [
      { id: "uisce", lang: "Old Irish", form: "uisce", gloss: "water",
        loc: [-8.5, 53.6], date: "", dy: -14 },
      { id: "uiscebeatha", lang: "Irish", form: "uisce beatha", gloss: "water of life",
        loc: [-7.0, 52.2], date: "monks translating Latin aqua vītae — the distillers' name for spirits", dy: 28 },
      { id: "whiskey", lang: "English", form: "whiskey", big: true,
        loc: [-1.8, 52.8], date: "1700s, first anglicized as ‘usquebaugh’", dy: -12 }
    ],
    edges: [
      { from: "uisce", to: "uiscebeatha", bend: 0.25 },
      { from: "uiscebeatha", to: "whiskey", bend: -0.18 }
    ]
  },

  {
    id: "algebra",
    words: ["algebra"],
    caption: "“algebra” first meant setting broken bones",
    nodes: [
      { id: "jabr", lang: "Arabic", form: "الجبر al-jabr", gloss: "the reuniting of broken parts",
        loc: [44.4, 33.3], date: "from al-Khwārizmī's 9th-century Baghdad treatise on equations", dy: 28 },
      { id: "algebra-lat", lang: "Medieval Latin", form: "algebra", gloss: "bone-setting; algebra",
        loc: [11.9, 43.5], date: "in Europe it meant surgical bone-setting first", dy: -14 },
      { id: "algebra", lang: "English", form: "algebra", big: true,
        loc: [-1.6, 52.7], date: "the math sense settled in the 1550s", dy: -12 }
    ],
    edges: [
      { from: "jabr", to: "algebra-lat", bend: 0.2 },
      { from: "algebra-lat", to: "algebra", bend: 0.18 }
    ]
  },

  {
    id: "paradise",
    words: ["paradise"],
    caption: "“paradise” began as a Persian walled garden",
    nodes: [
      { id: "pairidaeza", lang: "Avestan", form: "pairi-daēza", gloss: "walled enclosure, royal garden",
        loc: [62.0, 36.0], date: "Old Iranian; the Persian kings' enclosed hunting gardens", dy: -14 },
      { id: "paradeisos", lang: "Ancient Greek", form: "παράδεισος parádeisos", gloss: "royal park; (later) Eden",
        loc: [23.7, 38.0], date: "Xenophon borrowed it describing Persia, c. 400 BCE", dy: 28 },
      { id: "paradisus", lang: "Latin", form: "paradīsus", gloss: "paradise",
        loc: [12.5, 41.9], date: "", dy: -14 },
      { id: "paradis", lang: "Old French", form: "paradis", gloss: "paradise",
        loc: [2.4, 48.3], date: "c. 1100", dy: 28 },
      { id: "paradise", lang: "English", form: "paradise", big: true,
        loc: [-1.6, 52.7], date: "c. 1200", dy: -12 }
    ],
    edges: [
      { from: "pairidaeza", to: "paradeisos", bend: 0.2 },
      { from: "paradeisos", to: "paradisus", bend: 0.15 },
      { from: "paradisus", to: "paradis", bend: 0.18 },
      { from: "paradis", to: "paradise", bend: 0.15 }
    ]
  },

  {
    id: "assassin",
    words: ["assassin"],
    caption: "“assassin” came home with the Crusaders",
    nodes: [
      { id: "hashishin", lang: "Arabic", form: "حشّاشين ḥashshāshīn", gloss: "the name given to the Nizari sect",
        loc: [36.6, 35.0], date: "Crusaders retold tales of the sect's feared emissaries", dy: 28 },
      { id: "assassinus", lang: "Medieval Latin", form: "assassinus", gloss: "hired killer",
        loc: [11.9, 43.5], date: "", dy: -14 },
      { id: "assassin-fr", lang: "Middle French", form: "assassin", gloss: "assassin",
        loc: [2.35, 48.6], date: "", dy: 28 },
      { id: "assassin", lang: "English", form: "assassin", big: true,
        loc: [-1.6, 52.7], date: "1530s", dy: -12 }
    ],
    edges: [
      { from: "hashishin", to: "assassinus", bend: 0.2 },
      { from: "assassinus", to: "assassin-fr", bend: 0.18 },
      { from: "assassin-fr", to: "assassin", bend: 0.15 }
    ]
  },

  {
    id: "ketchup",
    words: ["ketchup"],
    caption: "“ketchup” was a fish sauce long before it met a tomato",
    nodes: [
      { id: "ketsiap", lang: "Hokkien", form: "膎汁 kê-tsiap", gloss: "brine of pickled fish",
        loc: [118.1, 24.5], date: "coastal Fujian", dy: -14 },
      { id: "kecap", lang: "Malay", form: "kicap", gloss: "fish sauce; soy sauce",
        loc: [101.7, 3.1], date: "picked up by English sailors trading through the strait", dy: 28 },
      { id: "ketchup", lang: "English", form: "ketchup", big: true,
        loc: [-1.6, 52.7], date: "1680s — the tomato version is American, 1800s", dy: -12 }
    ],
    edges: [
      { from: "ketsiap", to: "kecap", bend: 0.2 },
      { from: "kecap", to: "ketchup", bend: -0.35 }
    ]
  },

  {
    id: "robot",
    words: ["robot"],
    caption: "“robot” escaped from a Czech play in 1920",
    nodes: [
      { id: "orbota", lang: "Proto-Slavic", form: "*orbota", gloss: "servitude, drudgery",
        loc: [25.0, 50.0], date: "", dy: -14 },
      { id: "robota", lang: "Czech", form: "robota", gloss: "forced labor",
        loc: [14.4, 50.1], date: "Karel Čapek's play R.U.R. named its artificial workers roboti", dy: 28 },
      { id: "robot", lang: "English", form: "robot", big: true,
        loc: [-1.6, 52.7], date: "1922, with the London staging of R.U.R.", dy: -12 }
    ],
    edges: [
      { from: "orbota", to: "robota", bend: 0.15 },
      { from: "robota", to: "robot", bend: 0.18 }
    ]
  },

  {
    id: "coach",
    words: ["coach"],
    caption: "every “coach” is named after one Hungarian village",
    nodes: [
      { id: "kocsi", lang: "Hungarian", form: "kocsi", gloss: "cart ‘of Kocs’ — the village famous for them",
        loc: [18.0, 47.6], date: "15th century; Kocs built the best light carriages in Europe", dy: -14 },
      { id: "coche", lang: "French", form: "coche", gloss: "coach",
        loc: [2.35, 48.6], date: "", dy: 28 },
      { id: "coach", lang: "English", form: "coach", big: true,
        loc: [-1.6, 52.7], date: "1550s; the trainer sense is 1830s Oxford slang — a tutor ‘carries’ you through the exam", dy: -12 }
    ],
    edges: [
      { from: "kocsi", to: "coche", bend: 0.18 },
      { from: "coche", to: "coach", bend: 0.15 }
    ]
  },

  {
    id: "juggernaut",
    words: ["juggernaut"],
    caption: "“juggernaut” rolled out of a temple procession in Puri",
    nodes: [
      { id: "jagannatha", lang: "Sanskrit", form: "जगन्नाथ Jagannātha", gloss: "‘lord of the world’ — a title of Vishnu",
        loc: [85.8, 19.8], date: "European travellers described the huge temple cart at Puri as unstoppable", dy: -14 },
      { id: "juggernaut", lang: "English", form: "juggernaut", big: true,
        loc: [-1.6, 52.7], date: "1841 in the ‘unstoppable force’ sense", dy: -12 }
    ],
    edges: [
      { from: "jagannatha", to: "juggernaut", bend: -0.25 }
    ]
  },

  {
    id: "pajamas",
    words: ["pajamas"],
    caption: "“pajamas” are Persian for ‘leg garment’",
    nodes: [
      { id: "payjama", lang: "Persian", form: "پايجامه pāy-jāma", gloss: "leg garment",
        loc: [52.5, 32.5], date: "", dy: -14 },
      { id: "hindi-payjama", lang: "Hindi-Urdu", form: "पाजामा pāyjāma", gloss: "loose light trousers",
        loc: [77.2, 28.6], date: "everyday dress across South Asia", dy: 28 },
      { id: "pajamas", lang: "English", form: "pajamas", big: true,
        loc: [-1.6, 52.7], date: "1800s, brought home by the British in India", dy: -12 }
    ],
    edges: [
      { from: "payjama", to: "hindi-payjama", bend: -0.2 },
      { from: "hindi-payjama", to: "pajamas", bend: 0.3 }
    ]
  }
];
