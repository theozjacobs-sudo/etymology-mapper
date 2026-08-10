/* Etymology Mapper — renders a word's journey as animated arrows on a map. */

(function () {
  "use strict";

  const svg = d3.select("#map");
  const stage = document.getElementById("stage");
  const tooltip = d3.select("#tooltip");
  const captionEl = document.getElementById("caption");

  const land = topojson.feature(window.LAND_TOPO, window.LAND_TOPO.objects.land);

  const STEP = 950;          // ms per generation of the word's family tree
  const EDGE_DUR = 700;      // ms for one arrow to draw itself

  let current = null;        // entry currently on screen

  // ---------- theme ----------
  const savedTheme = localStorage.getItem("etym-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("etym-theme", t);
    document.getElementById("theme").textContent = t === "dark" ? "Light" : "Dark";
  }

  document.getElementById("theme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
  });

  // ---------- word picker ----------
  const chips = d3.select("#chips")
    .selectAll("button")
    .data(window.ETYMOLOGIES)
    .join("button")
    .attr("class", "chip")
    .html(d => d.words.map(w => `<span>${w}</span>`).join(` <span class="plus">+</span> `))
    .on("click", (event, d) => select(d));

  document.getElementById("replay").addEventListener("click", () => {
    if (current) render(current, true);
  });

  // Clicking the sea skips to the end of the animation.
  svg.on("click", () => finishAnimation());

  window.addEventListener("resize", debounce(() => {
    if (current) render(current, false);
  }, 150));

  function select(entry) {
    current = entry;
    chips.classed("active", d => d.id === entry.id);
    render(entry, true);
  }

  // ---------- graph helpers ----------
  function depths(entry) {
    // Breadth-first generation number for every node, starting from the root(s).
    const incoming = new Map(entry.nodes.map(n => [n.id, 0]));
    entry.edges.forEach(e => incoming.set(e.to, incoming.get(e.to) + 1));
    const depth = new Map();
    let frontier = entry.nodes.filter(n => incoming.get(n.id) === 0).map(n => n.id);
    let d = 0;
    while (frontier.length) {
      frontier.forEach(id => depth.set(id, d));
      const next = [];
      entry.edges.forEach(e => {
        if (depth.has(e.from) && !depth.has(e.to)) next.push(e.to);
      });
      frontier = [...new Set(next)];
      d++;
    }
    return depth;
  }

  // Quadratic bezier between two projected points, bowed sideways by `bend`,
  // trimmed at both ends so arrows don't pierce the labels.
  function edgePath(p0, p1, bend) {
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const dist = Math.hypot(dx, dy) || 1;
    const cx = mx - (dy / dist) * bend * dist;
    const cy = my + (dx / dist) * bend * dist;

    const N = 60;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      pts.push([a * p0[0] + b * cx + c * p1[0], a * p0[1] + b * cy + c * p1[1]]);
    }
    // cumulative length
    const lens = [0];
    for (let i = 1; i < pts.length; i++) {
      lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    }
    const total = lens[lens.length - 1];
    const trim0 = Math.min(16, total * 0.12);
    const trim1 = Math.min(22, total * 0.15);
    const kept = pts.filter((p, i) => lens[i] >= trim0 && lens[i] <= total - trim1);
    if (kept.length < 2) return { d: "", head: null };

    const d3line = "M" + kept.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L");
    const last = kept[kept.length - 1];
    const prev = kept[Math.max(0, kept.length - 4)];
    const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180 / Math.PI;
    return { d: d3line, head: { x: last[0], y: last[1], angle } };
  }

  // ---------- render ----------
  function render(entry, animate) {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    svg.selectAll("*").remove();
    tooltip.style("opacity", 0);

    const projection = d3.geoMercator().fitExtent(
      [[110, 95], [w - 110, h - 145]],
      { type: "MultiPoint", coordinates: entry.nodes.map(n => n.loc) }
    );
    const geoPath = d3.geoPath(projection);

    svg.append("path").datum(land).attr("class", "land").attr("d", geoPath);

    const depth = depths(entry);
    const nodeById = new Map(entry.nodes.map(n => [n.id, n]));
    const pos = new Map(entry.nodes.map(n => [n.id, projection(n.loc)]));

    const edgesG = svg.append("g");
    const nodesG = svg.append("g");

    // --- arrows ---
    entry.edges.forEach(e => {
      const { d, head } = edgePath(pos.get(e.from), pos.get(e.to), e.bend || 0);
      if (!d) return;
      const isDerive = e.kind === "derive";
      const path = edgesG.append("path")
        .attr("class", "route" + (isDerive ? " derive" : ""))
        .attr("d", d);
      const headEl = head && edgesG.append("path")
        .attr("class", "arrowhead" + (isDerive ? " derive" : ""))
        .attr("d", "M0,-5.5L11,0L0,5.5Z")
        .attr("transform", `translate(${head.x},${head.y}) rotate(${head.angle})`);

      const len = path.node().getTotalLength();
      const startAt = depth.get(e.from) * STEP + 250;
      if (animate) {
        path
          .attr("stroke-dasharray", `${len} ${len}`)
          .attr("stroke-dashoffset", len)
          .transition()
          .delay(startAt)
          .duration(EDGE_DUR)
          .ease(d3.easeQuadInOut)
          .attr("stroke-dashoffset", 0)
          .on("end", () => headEl && headEl.style("opacity", 1));
        if (headEl) headEl.style("opacity", 0);
      }
    });

    // --- word labels ---
    entry.nodes.forEach(n => {
      const [x, y] = pos.get(n.id);
      const g = nodesG.append("g")
        .attr("class", "label" + (n.big ? " big" : ""))
        .attr("data-node", n.id);

      g.append("circle").attr("class", "node-dot").attr("cx", x).attr("cy", y).attr("r", 3);

      const dx = n.dx || 0;
      const dy = n.dy == null ? -14 : n.dy;
      const anchor = n.anchor || "middle";
      const formSize = n.big ? 34 : 21;
      const langGap = formSize * 0.78 + 4;

      let langY, formY, glossY;
      if (dy < 0) {
        // stack sits above the point; its bottom line lands at y+dy
        const bottom = y + dy;
        glossY = n.gloss ? bottom : null;
        formY = n.gloss ? bottom - 16 : bottom;
        langY = formY - langGap;
      } else {
        // stack hangs below the point; its top line lands at y+dy
        langY = y + dy;
        formY = langY + langGap;
        glossY = n.gloss ? formY + 16 : null;
      }

      const tx = x + dx;
      const put = (cls, yy, text) => g.append("text")
        .attr("class", cls).attr("x", tx).attr("y", yy)
        .attr("text-anchor", anchor).text(text);

      put("lang", langY, n.lang);
      put("form", formY, n.form);
      if (n.gloss) put("gloss", glossY, n.gloss);

      if (n.date || n.note) {
        g.style("cursor", "help")
          .on("mousemove", (event) => showTooltip(event, n))
          .on("mouseleave", () => tooltip.style("opacity", 0));
      }

      if (animate) {
        g.style("opacity", 0)
          .transition()
          .delay(depth.get(n.id) * STEP)
          .duration(450)
          .style("opacity", 1);
      }
    });

    captionEl.textContent = entry.caption;
    if (animate) {
      const maxDepth = Math.max(...[...depth.values()]);
      d3.select(captionEl)
        .style("opacity", 0)
        .transition()
        .delay(maxDepth * STEP + 500)
        .duration(600)
        .style("opacity", 1);
    } else {
      captionEl.style.opacity = 1;
    }
  }

  function finishAnimation() {
    svg.selectAll(".route").interrupt().attr("stroke-dashoffset", 0);
    svg.selectAll(".arrowhead").interrupt().style("opacity", 1);
    svg.selectAll(".label").interrupt().style("opacity", 1);
    d3.select(captionEl).interrupt().style("opacity", 1);
  }

  function showTooltip(event, n) {
    const parts = [];
    parts.push(`<span class="tt-form">${n.form}</span>`);
    if (n.date) parts.push(`<span class="tt-date">${n.date}</span>`);
    if (n.note) parts.push(`<span>${n.note}</span>`);
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    tooltip
      .html(parts.join("<br>"))
      .style("left", Math.min(x + 14, rect.width - 300) + "px")
      .style("top", (y + 14) + "px")
      .style("opacity", 1);
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // start with the classic
  select(window.ETYMOLOGIES[0]);
})();
