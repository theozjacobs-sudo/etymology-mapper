/*
 * Precompute etymology chains for a list of common words by fetching their
 * Wiktionary pages and running the same parser the live site uses.
 * Output: data/traced.js  →  window.TRACED = { word: [{code, form, gloss}, ...] }
 * (chains are newest → oldest, excluding the English headword)
 *
 * Run from the repo root:  node scripts/precompute.js
 * Uses curl for fetching so it honors HTTPS_PROXY / CA bundle environments.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const trace = require("../js/trace.js");
const { LANGS } = require("../js/langs.js");

const WORDS = `
  abandon acre admiral adobe alarm alcohol alcove algorithm almanac aluminum amber ambulance anchor angel anger
  apple apricot arsenal artichoke atlas attic avatar awkward azure
  bacon bag balcony ballot bamboo bandana banana bandit banjo bank banquet barbecue bazaar beach bear beauty bed
  beef beer bench berserk bicycle bird biscuit bishop blanket blue board boat bonanza book boomerang boss bottle
  bow bread breeze bride bridge brother buckaroo bungalow butter butterfly
  cabbage cable cactus cafe cake calm camel camera candle candy cannon canoe canvas canyon captain caravan
  cargo carnival carpet cash cashew castle cat catamaran cathedral cattle cave chair chalk champion chaos
  cheese cheetah chemistry cherry chicken chief child chimney chocolate church cigar cinnamon circus city
  clock cloud clown cobalt cockroach coconut cold color comet compass computer condor cookie copper coral
  corn cotton cough court cow coyote crab crimson crocodile crystal cup curfew curry cushion
  dance danger date daughter dawn day death demon denim desert devil diamond dinner dog dollar dolphin door
  dragon dream dress drum duke dungeon dusk
  eager eagle earth east echo eclipse egg elephant elbow emerald empire engine enigma evil eye
  falcon family famine fang farm father fear feast fever field fig finger fire fish flag flamingo flower flute
  fog foot forest fork fortune fox friend frog frontier fruit
  galaxy gale game garden garlic gauze gazelle gem geyser ghost ghoul giant ginger giraffe girl glacier glass
  goblin god gold golf gondola gong goose gorilla grammar grape grass green guitar gun guru gymnasium
  hail hammock hand harbor harvest hat hazard heart heaven hell helmet hero hickory hill honey hood horde horizon
  horror hound house hurricane husband hyena
  ice igloo india indigo ink iron island ivory
  jackal jade jaguar jar jasmine jazz jeans jewel journey jubilee judge jungle jury justice
  kangaroo karma kayak kettle key khaki kimono king kiosk kitchen kite knife knight koala kraken
  lacquer lagoon lake lamp lance language lantern lava lavender law leather lemon lemur leopard library lightning
  lilac lily lime lion liquor llama lobster locust lotus love luck lute lynx
  macabre machine magazine magenta magic magnet maize mammoth mango mansion map marble market marmalade maroon
  marsh mask massage mast mattress maze meadow meat medicine melon mercury mermaid metal meteor milk mint mirror
  moccasin molasses monarch money mongoose monk monkey monsoon monster moon moose mosque mosquito moth mother
  mountain mouse muffin mule mummy muscle museum music musket mustang mustard mystery
  nature navy nectar needle neighbor news night nightmare ninja noodle north nose number nutmeg
  ocean ochre octopus ogre oil old olive omen onion opal opera orangutan orchard orchestra oregano ostrich otter
  outlaw owl ox oxygen oyster
  pagoda palace pan panda panic panther paper papyrus parka parliament pasta pastry patio pattern peach peacock
  pearl pen penguin people pepper perfume phantom pharaoh phoenix piano pickle picnic pigeon pillow pilot pineapple
  pirate pistachio pistol planet plague plaid plant plaza plum poem poison polka poncho pony porcelain potato
  prairie pretzel priest prince prison prophet pumpkin puppet purple pyramid python
  quarantine quartz queen quest quilt quinine
  raccoon rain rainbow ranch raven razor red rhinoceros rice rifle ring river robe rocket rogue rose ruby rum rune
  saber sable safari saffron saga sailor salamander salmon salsa samurai sandal sapphire sarcasm satin sauna
  savanna scarlet school scimitar scorpion sea season sequin serpent shadow shaman shampoo shark sheep sheriff
  ship shore shoulder silhouette silk silver sister skeleton sketch sky slave sleep smile snake snow sofa
  soldier son soul soup south spice spider spinach spirit sponge spoon spring squash star steel steppe stone
  storm story stove strawberry street sugarcane sultan summer sun swan sword syrup
  table taboo taffeta talc tale talisman tambourine tango tank tapestry tapioca tar tariff tattoo tavern
  temple tent terrace terror theater thunder tiger time toast tobacco toboggan tomato tongue tooth torch tornado
  tortilla totem tower town treasure tree tribe trumpet tulip tuna tundra turban turquoise turtle tycoon typhoon
  ukulele umbrella unicorn universe vampire vanilla veranda verdict vertigo villain vinegar violet violin
  vodka volcano voodoo voyage vulture
  waffle wagon walrus war warden water wave weather west whale wheat wheel widow wife wigwam wind windmill window
  winter witch wizard wolf woman wood wool world worm
  yacht yak year yellow yogurt young zebra zenith zephyr zero zigzag zinc zodiac zombie
`.trim().split(/\s+/);

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function fetchWikitext(word) {
  const url = "https://en.wiktionary.org/w/api.php?action=parse&redirects=1&prop=wikitext" +
    "&format=json&formatversion=2&origin=*&page=" + encodeURIComponent(word);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const out = execSync(`curl -sS --max-time 30 "${url}"`, { maxBuffer: 32 * 1024 * 1024 }).toString();
      const json = JSON.parse(out);
      if (json.error && json.error.code === "missingtitle") return null;
      if (json.parse) return json.parse.wikitext;
    } catch (e) { /* fall through to retry */ }
    sleep(1500 * (attempt + 1));
  }
  return null;
}

const curated = new Set();
try {
  // don't duplicate words that already have hand-curated entries
  const dataSrc = fs.readFileSync(path.join(__dirname, "../js/data.js"), "utf8");
  for (const m of dataSrc.matchAll(/words:\s*\[([^\]]*)\]/g)) {
    for (const w of m[1].matchAll(/"([^"]+)"/g)) curated.add(w[1]);
  }
} catch (e) { /* fine — no exclusions */ }

// resume: merge into an existing cache so reruns only fill the gaps
let result = {};
const outPath = path.join(__dirname, "../data/traced.js");
try {
  const prev = fs.readFileSync(outPath, "utf8");
  result = JSON.parse(prev.slice(prev.indexOf("=") + 1).replace(/;\s*$/, ""));
  console.log(`resuming: ${Object.keys(result).length} words already cached`);
} catch (e) { /* fresh run */ }

let ok = 0, skipped = 0, missed = 0;

for (const word of WORDS) {
  if (curated.has(word) || result[word]) continue;
  sleep(80);
  const wikitext = fetchWikitext(word);
  if (!wikitext) { missed++; continue; }
  const chain = trace.extractChain(wikitext);
  const placeable = chain.filter(s => LANGS[s.code]);
  if (placeable.length < 1) { skipped++; continue; }
  result[word] = chain.map(s => ({ code: s.code, form: s.form, gloss: s.gloss || undefined }));
  ok++;
  if (ok % 25 === 0) console.log(`  ...${ok} traced so far (last: ${word})`);
}

const out = "window.TRACED = " + JSON.stringify(result) + ";\n";
fs.writeFileSync(outPath, out);
console.log(`done: ${ok} newly traced (${Object.keys(result).length} total), ${skipped} chains too short to map, ${missed} not fetched.`);
console.log(`wrote data/traced.js (${(out.length / 1024).toFixed(0)} KB)`);
