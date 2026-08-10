/*
 * Wiktionary language codes → display name + approximate homeland [lon, lat].
 * Locations mark roughly where the language community lived when it passed
 * words along — they are storytelling coordinates, not linguistic borders.
 * Works in the browser (window.ETYM_LANGS) and in Node (module.exports).
 */

(function (root) {
  const L = {
    // --- Proto languages ---
    "ine-pro": { name: "Proto-Indo-European", loc: [44.0, 48.5] },
    "gem-pro": { name: "Proto-Germanic", loc: [10.0, 56.0] },
    "gmw-pro": { name: "Proto-West Germanic", loc: [8.0, 52.8] },
    "itc-pro": { name: "Proto-Italic", loc: [12.5, 42.5] },
    "cel-pro": { name: "Proto-Celtic", loc: [14.5, 47.8] },
    "grk-pro": { name: "Proto-Hellenic", loc: [22.5, 39.0] },
    "sla-pro": { name: "Proto-Slavic", loc: [25.0, 50.0] },
    "ine-bsl-pro": { name: "Proto-Balto-Slavic", loc: [25.0, 55.0] },
    "iir-pro": { name: "Proto-Indo-Iranian", loc: [65.0, 42.0] },
    "inc-pro": { name: "Proto-Indo-Aryan", loc: [70.0, 32.0] },
    "ira-pro": { name: "Proto-Iranian", loc: [60.0, 36.0] },
    "sem-pro": { name: "Proto-Semitic", loc: [42.0, 20.0] },
    "trk-pro": { name: "Proto-Turkic", loc: [90.0, 48.0] },
    "sit-pro": { name: "Proto-Sino-Tibetan", loc: [95.0, 30.0] },
    "dra-pro": { name: "Proto-Dravidian", loc: [78.0, 15.0] },
    "urj-pro": { name: "Proto-Uralic", loc: [55.0, 58.0] },
    "alg-pro": { name: "Proto-Algonquian", loc: [-85.0, 46.0] },

    // --- Germanic ---
    "ang": { name: "Old English", loc: [0.3, 51.3] },
    "enm": { name: "Middle English", loc: [-2.9, 54.3] },
    "non": { name: "Old Norse", loc: [7.5, 60.5] },
    "gml": { name: "Middle Low German", loc: [10.5, 53.5] },
    "nds": { name: "Low German", loc: [10.5, 53.5] },
    "osx": { name: "Old Saxon", loc: [9.5, 52.5] },
    "ofs": { name: "Old Frisian", loc: [5.8, 53.2] },
    "odt": { name: "Old Dutch", loc: [5.0, 51.8] },
    "dum": { name: "Middle Dutch", loc: [4.5, 51.5] },
    "nl": { name: "Dutch", loc: [4.9, 52.4] },
    "goh": { name: "Old High German", loc: [9.5, 49.0] },
    "gmh": { name: "Middle High German", loc: [10.0, 49.5] },
    "de": { name: "German", loc: [10.4, 51.0] },
    "frk": { name: "Frankish", loc: [4.5, 50.5] },
    "got": { name: "Gothic", loc: [25.0, 45.0] },
    "da": { name: "Danish", loc: [10.0, 56.0] },
    "sv": { name: "Swedish", loc: [15.0, 59.5] },
    "no": { name: "Norwegian", loc: [8.5, 60.5] },
    "nb": { name: "Norwegian Bokmål", loc: [8.5, 60.5] },
    "is": { name: "Icelandic", loc: [-19.0, 64.8] },
    "yi": { name: "Yiddish", loc: [20.0, 50.5] },
    "af": { name: "Afrikaans", loc: [24.0, -29.0] },

    // --- Italic / Romance ---
    "la": { name: "Latin", loc: [12.5, 41.9] },
    "LL.": { name: "Late Latin", loc: [12.5, 41.5] },
    "ML.": { name: "Medieval Latin", loc: [11.9, 43.5] },
    "VL.": { name: "Vulgar Latin", loc: [12.0, 42.3] },
    "NL.": { name: "New Latin", loc: [11.0, 44.0] },
    "EL.": { name: "Ecclesiastical Latin", loc: [12.45, 41.9] },
    "la-lat": { name: "Late Latin", loc: [12.5, 41.5] },
    "la-med": { name: "Medieval Latin", loc: [11.9, 43.5] },
    "la-vul": { name: "Vulgar Latin", loc: [12.0, 42.3] },
    "la-new": { name: "New Latin", loc: [11.0, 44.0] },
    "la-ecc": { name: "Ecclesiastical Latin", loc: [12.45, 41.9] },
    "la-cls": { name: "Classical Latin", loc: [12.5, 41.9] },
    "fro": { name: "Old French", loc: [2.4, 48.4] },
    "frm": { name: "Middle French", loc: [2.35, 48.8] },
    "fr": { name: "French", loc: [2.35, 48.85] },
    "xno": { name: "Anglo-Norman", loc: [-0.5, 49.3] },
    "pro": { name: "Old Occitan", loc: [4.8, 43.9] },
    "oc": { name: "Occitan", loc: [4.8, 43.9] },
    "it": { name: "Italian", loc: [11.3, 43.8] },
    "es": { name: "Spanish", loc: [-3.7, 40.4] },
    "osp": { name: "Old Spanish", loc: [-4.0, 41.7] },
    "pt": { name: "Portuguese", loc: [-9.1, 38.7] },
    "ca": { name: "Catalan", loc: [2.2, 41.4] },
    "ro": { name: "Romanian", loc: [26.1, 44.4] },

    // --- Hellenic ---
    "grc": { name: "Ancient Greek", loc: [23.7, 38.0] },
    "gkm": { name: "Byzantine Greek", loc: [28.98, 41.0] },
    "el": { name: "Greek", loc: [23.7, 38.0] },

    // --- Celtic ---
    "sga": { name: "Old Irish", loc: [-8.0, 53.3] },
    "mga": { name: "Middle Irish", loc: [-8.0, 53.3] },
    "ga": { name: "Irish", loc: [-8.0, 53.3] },
    "gd": { name: "Scottish Gaelic", loc: [-5.0, 57.0] },
    "gv": { name: "Manx", loc: [-4.5, 54.2] },
    "cy": { name: "Welsh", loc: [-3.8, 52.3] },
    "br": { name: "Breton", loc: [-3.5, 48.2] },
    "kw": { name: "Cornish", loc: [-5.0, 50.4] },
    "cel-gau": { name: "Gaulish", loc: [3.0, 46.5] },
    "gaul": { name: "Gaulish", loc: [3.0, 46.5] },
    "xtg": { name: "Gaulish", loc: [3.0, 46.5] },

    // --- Indo-Iranian ---
    "sa": { name: "Sanskrit", loc: [77.0, 26.0] },
    "pal": { name: "Middle Persian", loc: [52.0, 32.0] },
    "peo": { name: "Old Persian", loc: [52.9, 29.9] },
    "fa": { name: "Persian", loc: [52.5, 32.5] },
    "fa-cls": { name: "Classical Persian", loc: [52.5, 32.5] },
    "ae": { name: "Avestan", loc: [62.0, 36.0] },
    "hi": { name: "Hindi", loc: [77.2, 28.6] },
    "ur": { name: "Urdu", loc: [74.3, 31.5] },
    "bn": { name: "Bengali", loc: [88.4, 22.6] },
    "mr": { name: "Marathi", loc: [72.9, 19.0] },
    "pa": { name: "Punjabi", loc: [74.9, 31.6] },
    "ne": { name: "Nepali", loc: [85.3, 27.7] },
    "si": { name: "Sinhala", loc: [79.9, 6.9] },
    "ps": { name: "Pashto", loc: [69.2, 34.5] },
    "ku": { name: "Kurdish", loc: [43.0, 37.0] },
    "rom": { name: "Romani", loc: [22.0, 44.0] },

    // --- Slavic / Baltic ---
    "cu": { name: "Old Church Slavonic", loc: [22.7, 41.6] },
    "ru": { name: "Russian", loc: [37.6, 55.75] },
    "uk": { name: "Ukrainian", loc: [30.5, 50.45] },
    "pl": { name: "Polish", loc: [21.0, 52.2] },
    "cs": { name: "Czech", loc: [14.4, 50.1] },
    "sk": { name: "Slovak", loc: [17.1, 48.1] },
    "sh": { name: "Serbo-Croatian", loc: [20.5, 44.8] },
    "bg": { name: "Bulgarian", loc: [23.3, 42.7] },
    "sl": { name: "Slovene", loc: [14.5, 46.1] },
    "lt": { name: "Lithuanian", loc: [25.3, 54.7] },
    "lv": { name: "Latvian", loc: [24.1, 56.9] },

    // --- Semitic / Afroasiatic ---
    "akk": { name: "Akkadian", loc: [44.4, 32.5] },
    "phn": { name: "Phoenician", loc: [35.5, 33.9] },
    "he": { name: "Hebrew", loc: [35.2, 31.8] },
    "hbo": { name: "Biblical Hebrew", loc: [35.2, 31.8] },
    "arc": { name: "Aramaic", loc: [38.3, 36.2] },
    "syc": { name: "Classical Syriac", loc: [38.3, 37.1] },
    "ar": { name: "Arabic", loc: [44.5, 24.5] },
    "arz": { name: "Egyptian Arabic", loc: [31.2, 30.0] },
    "acw": { name: "Hijazi Arabic", loc: [39.8, 21.4] },
    "mt": { name: "Maltese", loc: [14.5, 35.9] },
    "egy": { name: "Egyptian", loc: [31.2, 29.9] },
    "cop": { name: "Coptic", loc: [31.2, 27.0] },
    "am": { name: "Amharic", loc: [38.7, 9.0] },
    "gez": { name: "Ge'ez", loc: [38.5, 14.0] },
    "ha": { name: "Hausa", loc: [7.5, 12.0] },

    // --- Turkic / Mongolic / Uralic ---
    "otk": { name: "Old Turkic", loc: [95.0, 47.0] },
    "ota": { name: "Ottoman Turkish", loc: [29.0, 41.0] },
    "tr": { name: "Turkish", loc: [32.9, 39.9] },
    "az": { name: "Azerbaijani", loc: [49.9, 40.4] },
    "kk": { name: "Kazakh", loc: [71.4, 51.2] },
    "tt": { name: "Tatar", loc: [49.1, 55.8] },
    "mn": { name: "Mongolian", loc: [106.9, 47.9] },
    "hu": { name: "Hungarian", loc: [19.0, 47.5] },
    "fi": { name: "Finnish", loc: [24.9, 60.2] },
    "et": { name: "Estonian", loc: [24.7, 59.4] },

    // --- East & Southeast Asia ---
    "ltc": { name: "Middle Chinese", loc: [113.0, 34.8] },
    "och": { name: "Old Chinese", loc: [110.0, 34.5] },
    "zh": { name: "Chinese", loc: [110.0, 32.0] },
    "cmn": { name: "Mandarin Chinese", loc: [116.4, 39.9] },
    "yue": { name: "Cantonese", loc: [113.3, 23.1] },
    "nan": { name: "Min Nan Chinese", loc: [118.1, 24.5] },
    "nan-hbl": { name: "Hokkien", loc: [118.1, 24.5] },
    "hak": { name: "Hakka", loc: [116.0, 24.8] },
    "ja": { name: "Japanese", loc: [139.7, 35.7] },
    "ko": { name: "Korean", loc: [127.0, 37.5] },
    "vi": { name: "Vietnamese", loc: [105.8, 21.0] },
    "th": { name: "Thai", loc: [100.5, 13.8] },
    "my": { name: "Burmese", loc: [96.2, 16.8] },
    "km": { name: "Khmer", loc: [104.9, 11.6] },
    "ms": { name: "Malay", loc: [101.7, 3.1] },
    "id": { name: "Indonesian", loc: [106.8, -6.2] },
    "jv": { name: "Javanese", loc: [110.4, -7.0] },
    "tl": { name: "Tagalog", loc: [121.0, 14.6] },
    "bo": { name: "Tibetan", loc: [91.1, 29.7] },

    // --- Dravidian ---
    "ta": { name: "Tamil", loc: [78.5, 11.0] },
    "te": { name: "Telugu", loc: [79.5, 16.5] },
    "ml": { name: "Malayalam", loc: [76.3, 10.0] },
    "kn": { name: "Kannada", loc: [76.6, 13.0] },

    // --- Americas ---
    "nci": { name: "Classical Nahuatl", loc: [-99.1, 19.4] },
    "nah": { name: "Nahuatl", loc: [-99.1, 19.4] },
    "qu": { name: "Quechua", loc: [-72.0, -13.5] },
    "tnq": { name: "Taíno", loc: [-70.7, 19.0] },
    "arw": { name: "Arawak", loc: [-58.0, 6.0] },
    "gn": { name: "Guaraní", loc: [-57.6, -25.3] },
    "tpw": { name: "Old Tupi", loc: [-38.5, -13.0] },
    "tpn": { name: "Tupinambá", loc: [-38.5, -13.0] },
    "chr": { name: "Cherokee", loc: [-84.0, 35.5] },
    "oj": { name: "Ojibwe", loc: [-90.0, 47.0] },
    "cr": { name: "Cree", loc: [-100.0, 54.0] },
    "lkt": { name: "Lakota", loc: [-101.0, 44.0] },
    "iu": { name: "Inuktitut", loc: [-68.0, 63.0] },
    "kl": { name: "Greenlandic", loc: [-51.7, 64.2] },

    // --- Others ---
    "eu": { name: "Basque", loc: [-2.7, 43.0] },
    "ka": { name: "Georgian", loc: [44.8, 41.7] },
    "hy": { name: "Armenian", loc: [44.5, 40.2] },
    "xcl": { name: "Old Armenian", loc: [44.5, 40.2] },
    "sq": { name: "Albanian", loc: [19.8, 41.3] },
    "sw": { name: "Swahili", loc: [39.3, -6.8] },
    "zu": { name: "Zulu", loc: [31.0, -28.5] },
    "xh": { name: "Xhosa", loc: [27.5, -32.0] },
    "wo": { name: "Wolof", loc: [-17.4, 14.7] },
    "mnk": { name: "Mandinka", loc: [-15.5, 13.5] },
    "emk": { name: "Maninka", loc: [-9.5, 10.5] },
    "vai": { name: "Vai", loc: [-10.5, 6.9] },
    "ff": { name: "Fula", loc: [-12.0, 12.0] },
    "tn": { name: "Tswana", loc: [25.9, -24.6] },
    "yo": { name: "Yoruba", loc: [3.9, 7.4] },
    "ig": { name: "Igbo", loc: [7.0, 6.0] },
    "mg": { name: "Malagasy", loc: [47.5, -18.9] },
    "haw": { name: "Hawaiian", loc: [-157.8, 21.3] },
    "mi": { name: "Maori", loc: [174.8, -41.3] },
    "sm": { name: "Samoan", loc: [-171.8, -13.8] },
    "to": { name: "Tongan", loc: [-175.2, -21.1] },
    "fj": { name: "Fijian", loc: [178.4, -18.1] },
    "ty": { name: "Tahitian", loc: [-149.6, -17.5] }
  };

  // Where the modern English headword lands on the map.
  const ENGLISH = { name: "English", loc: [-1.6, 52.7] };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { LANGS: L, ENGLISH };
  } else {
    root.ETYM_LANGS = L;
    root.ETYM_ENGLISH = ENGLISH;
  }
})(typeof window !== "undefined" ? window : globalThis);
