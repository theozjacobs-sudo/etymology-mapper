/*
 * Automatic etymology tracing from English Wiktionary.
 *
 * Wiktionary marks derivation chains with structured templates —
 * {{inh|en|enm|carre}} means "inherited from Middle English carre",
 * {{der|en|la|carrus||wagon}} "derived from Latin carrus 'wagon'" —
 * so a word's etymology section can be read as an ordered chain of
 * (language, form, gloss) stages. This module extracts that chain and
 * turns it into the same {nodes, edges} entry shape the curated data uses.
 *
 * Runs in the browser (window.EtymTrace) and in Node (module.exports),
 * so the precompute script and the live site share one parser.
 */

(function (root) {
  const isNode = typeof module !== "undefined" && module.exports;
  const { LANGS, ENGLISH } = isNode ? require("./langs.js")
    : { LANGS: root.ETYM_LANGS, ENGLISH: root.ETYM_ENGLISH };

  // Templates that link a word to its source in a derivation chain.
  const CHAIN_TPL = new Set(["inh", "inh+", "bor", "bor+", "der", "der+", "uder", "lbor", "obor"]);
  const MAX_STAGES = 9;

  // ---- template scanning ----

  // Find top-level {{...}} templates in wikitext, in order of appearance.
  function scanTemplates(text) {
    const found = [];
    let i = 0;
    while (i < text.length) {
      if (text[i] === "{" && text[i + 1] === "{") {
        let depth = 0, j = i;
        while (j < text.length) {
          if (text[j] === "{" && text[j + 1] === "{") { depth++; j += 2; continue; }
          if (text[j] === "}" && text[j + 1] === "}") { depth--; j += 2; if (depth === 0) break; continue; }
          j++;
        }
        if (depth === 0) {
          found.push({ raw: text.slice(i + 2, j - 2), pos: i });
          i = j;
          continue;
        }
      }
      i++;
    }
    return found;
  }

  // Split template body on top-level "|" (ignoring pipes inside nested
  // templates and [[wiki|links]]), then separate positional/named params.
  function parseTemplate(rawBody) {
    const parts = [];
    let cur = "", tplDepth = 0, linkDepth = 0;
    for (let i = 0; i < rawBody.length; i++) {
      const two = rawBody.slice(i, i + 2);
      if (two === "{{") { tplDepth++; cur += two; i++; continue; }
      if (two === "}}") { tplDepth--; cur += two; i++; continue; }
      if (two === "[[") { linkDepth++; cur += two; i++; continue; }
      if (two === "]]") { linkDepth--; cur += two; i++; continue; }
      if (rawBody[i] === "|" && tplDepth === 0 && linkDepth === 0) { parts.push(cur); cur = ""; continue; }
      cur += rawBody[i];
    }
    parts.push(cur);

    const name = parts[0].trim();
    const pos = [], named = {};
    for (let k = 1; k < parts.length; k++) {
      const p = parts[k];
      const eq = p.indexOf("=");
      // named param: key must be a simple identifier (avoid splitting on = inside values)
      if (eq > 0 && /^[a-zA-Z0-9_-]+$/.test(p.slice(0, eq).trim())) {
        named[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
      } else {
        pos.push(p.trim());
      }
    }
    return { name, pos, named };
  }

  function cleanText(s) {
    if (!s) return "";
    return s
      .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")  // [[target|shown]] -> shown
      .replace(/\[\[([^\]]*)\]\]/g, "$1")            // [[shown]] -> shown
      .replace(/\{\{[^}]*\}\}/g, "")                 // drop nested templates
      .replace(/''+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ---- section extraction ----

  function englishEtymologySection(wikitext) {
    const enMatch = wikitext.match(/^==\s*English\s*==\s*$/m);
    if (!enMatch) return null;
    let section = wikitext.slice(enMatch.index + enMatch[0].length);
    const nextLang = section.match(/^==[^=].*==\s*$/m);
    if (nextLang) section = section.slice(0, nextLang.index);

    const etyHead = section.match(/^===+\s*Etymology[^=]*===+\s*$/m);
    if (!etyHead) return null;
    let ety = section.slice(etyHead.index + etyHead[0].length);
    const nextHead = ety.match(/^===+[^=].*===+\s*$/m);
    if (nextHead) ety = ety.slice(0, nextHead.index);
    return ety;
  }

  // ---- chain building ----

  // Returns stages ordered newest -> oldest (excluding the English headword):
  // [{ code, lang, form, gloss, loc }]
  function extractChain(wikitext) {
    let ety = englishEtymologySection(wikitext);
    if (!ety) return [];

    // The derivation chain ends where the prose turns to side notes:
    // "Displaced native ...", "Compare ...", "Cognate with ...", "Doublet of ..."
    const cutoff = ety.search(/\b(Displaced|displacing|Compare|Cognate|Doublet|More at|Related to|See also)\b/);
    if (cutoff >= 0) ety = ety.slice(0, cutoff);

    const templates = scanTemplates(ety).map(t => ({ ...parseTemplate(t.raw), pos0: t.pos }));
    const stages = [];
    let pendingLang = null; // a chain template with no form: fill from a following {{m|...}}

    for (const t of templates) {
      if (stages.length >= MAX_STAGES) break;

      if (CHAIN_TPL.has(t.name)) {
        const code = (t.pos[1] || "").trim();
        if (!code || code === "en" || code === "und") continue;
        let form = cleanText(t.pos[2] || "");
        const alt = cleanText(t.pos[3] || "");
        const gloss = cleanText(t.named.t || t.named.gloss || t.pos[4] || "");
        if (alt) form = alt;
        if (!form || form === "-") { pendingLang = { code, gloss }; continue; }
        pushStage(stages, code, form, gloss);
        pendingLang = null;
      } else if (t.name === "m" && pendingLang) {
        const code = (t.pos[0] || "").trim();
        if (code === pendingLang.code) {
          let form = cleanText(t.pos[1] || "");
          const alt = cleanText(t.pos[2] || "");
          const gloss = cleanText(t.named.t || t.named.gloss || t.pos[3] || "");
          if (alt) form = alt;
          if (form && form !== "-") pushStage(stages, code, form, gloss || pendingLang.gloss);
        }
        pendingLang = null;
      } else if (t.name === "root" && stages.length) {
        // {{root|en|ine-pro|*ker-}} names the deepest reconstructed root —
        // only append it if the chain didn't already reach PIE.
        const code = (t.pos[1] || "").trim();
        const form = cleanText(t.pos[2] || "");
        if (code && form && LANGS[code] && !stages.some(s => s.code === code)) {
          stages.push(makeStage(code, form, ""));
        }
      } else if (t.name === "etymon") {
        // newer template style: {{etymon|en|:bor|sw:safari<t:journey>|...}}
        // tokens are "lang:form" with optional <t:gloss> annotations
        for (const p of t.pos) {
          const tok = p.trim();
          if (!tok || tok.startsWith(":") || tok === "en") continue;
          const m = tok.match(/^([a-zA-Z][a-zA-Z0-9.-]*):(.+)$/);
          if (!m || m[1] === "en") continue;
          const g = m[2].match(/<t:([^>]*)>/);
          const form = cleanText(m[2].replace(/<[^>]*>/g, ""));
          if (form && form !== "-") pushStage(stages, m[1], form, g ? g[1] : "");
          if (stages.length >= MAX_STAGES) break;
        }
      } else if (t.name === "cog" || t.name === "doublet" || t.name === "noncog") {
        // cognates/doublets are side-branches, not the chain — and everything
        // after "Cognate with..." tends to be comparison, so stop here.
        break;
      }
    }
    return stages;
  }

  function makeStage(code, form, gloss) {
    const lang = LANGS[code];
    return { code, lang: lang ? lang.name : code, form, gloss, loc: lang ? lang.loc.slice() : null };
  }

  function pushStage(stages, code, form, gloss) {
    const prev = stages[stages.length - 1];
    if (prev && prev.code === code && prev.form === form) return; // duplicate mention
    stages.push(makeStage(code, form, gloss));
  }

  // ---- entry building (shared layout for auto-traced chains) ----

  // stages: newest -> oldest. Returns an entry in the curated data shape.
  function buildEntry(word, stages) {
    const placeable = stages.filter(s => s.loc);
    const skipped = stages.filter(s => !s.loc);
    if (placeable.length < 1) return null;

    // oldest -> newest, ending at the English headword
    const chain = placeable.slice().reverse();
    chain.push({ code: "en", lang: ENGLISH.name, form: word, gloss: "", loc: ENGLISH.loc.slice(), big: true });

    // nudge repeated locations apart (e.g. Middle English on top of Old English)
    // and flip a nudged stage's label to the other side of its dot
    const used = [];
    chain.forEach(s => {
      let [lon, lat] = s.loc;
      let tries = 0;
      while (used.some(([ulon, ulat]) => Math.abs(ulon - lon) < 3.6 && Math.abs(ulat - lat) < 2.4) && tries < 8) {
        lon += 4.2;
        lat += (tries % 2 === 0 ? -2.4 : 2.4);
        tries++;
      }
      s.loc = [lon, lat];
      s.nudged = tries > 0;
      used.push([lon, lat]);
    });

    const nodes = chain.map((s, i) => ({
      id: "s" + i,
      lang: s.lang,
      form: s.form,
      gloss: s.gloss || undefined,
      loc: s.loc,
      big: !!s.big,
      dy: s.big ? -12 : ((i % 2 === 0) !== !!s.nudged ? -14 : 28)
    }));
    const edges = chain.slice(1).map((s, i) => ({
      from: "s" + i,
      to: "s" + (i + 1),
      bend: (i % 2 === 0 ? 0.18 : -0.18)
    }));

    let caption = `the journey of “${word}” — auto-traced from Wiktionary`;
    if (skipped.length) {
      caption += ` (couldn't place: ${skipped.map(s => s.lang).join(", ")})`;
    }
    return { id: "auto-" + word, words: [word], caption, nodes, edges, auto: true };
  }

  // Rebuild an entry from a precomputed raw chain of {code, form, gloss}.
  function buildFromRaw(word, raw) {
    return buildEntry(word, raw.map(r => makeStage(r.code, r.form, r.gloss)));
  }

  const api = { extractChain, buildEntry, buildFromRaw, englishEtymologySection };

  if (isNode) module.exports = api;
  else root.EtymTrace = api;
})(typeof window !== "undefined" ? window : globalThis);
