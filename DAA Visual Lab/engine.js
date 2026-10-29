/* ===== DAA Visual Lab — rendering engine =====
   A scene is a list of keyed items {k, x, y, z, svg}. Items with the same key
   glide to their new position between steps (CSS transform transition),
   new items fade in, removed items fade out. Everything is vector SVG. */
const NS = "http://www.w3.org/2000/svg";
const ALGOS = {};
const ORDER = [];
function defAlgo(def) { ALGOS[def.id] = def; ORDER.push(def.id); }

const TONES = {
  base:   { a: "#33457d", b: "#24345f", side: "#131b3a", stroke: "#5a71b3", text: "#eef2ff" },
  active: { a: "#ffd978", b: "#f5a524", side: "#9a5b0b", stroke: "#ffe7ad", text: "#241703" },
  done:   { a: "#7cf0c5", b: "#14b886", side: "#0a6249", stroke: "#b6f7dd", text: "#03291d" },
  reject: { a: "#ffb1bc", b: "#f2486a", side: "#8a1a33", stroke: "#ffd3da", text: "#3d0714" },
  pivot:  { a: "#d3c6ff", b: "#8b63f6", side: "#47279c", stroke: "#e6dfff", text: "#1c0a48" },
  info:   { a: "#9fe2ff", b: "#1aa7e6", side: "#09597f", stroke: "#cdefff", text: "#03263a" },
  pink:   { a: "#ffc2ea", b: "#e95fbf", side: "#7d1f64", stroke: "#ffdcf2", text: "#3a0a2c" },
  dim:    { a: "#1d2549", b: "#19203f", side: "#0e1329", stroke: "#2c3664", text: "#66719a" },
  ghost:  { a: "#151b37", b: "#151b37", side: "#0f1429", stroke: "#273058", text: "#6d789f" },
  white:  { a: "#f4f6ff", b: "#d9def3", side: "#7f88ad", stroke: "#ffffff", text: "#151a33" },
};
const EDGE = { base: "#4a5c97", active: "#ffc94a", done: "#2ee6a6", reject: "#ff6b86", dim: "#262f57", info: "#4cc9ff", pivot: "#a98bff" };

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function svgDefs() {
  let d = "";
  for (const [k, t] of Object.entries(TONES)) {
    d += `<linearGradient id="g-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></linearGradient>`;
    d += `<radialGradient id="r-${k}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></radialGradient>`;
  }
  for (const [k, c] of Object.entries(EDGE)) {
    d += `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  }
  return `<defs>${d}</defs>`;
}

/* ---------- item helpers ---------- */
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SANS = "'Figtree', system-ui, sans-serif";
function txt(x, y, s, o = {}) {
  const size = o.size || 15, fill = o.fill || "#eef2ff", anchor = o.anchor || "middle", w = o.weight || 600, fam = o.mono === false ? SANS : (o.sans ? SANS : MONO);
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="central" font-weight="${w}" font-family="${fam}" xml:space="preserve" style="white-space:pre"${o.italic ? ' font-style="italic"' : ""}>${esc(s)}</text>`;
}
/* 3D block: a top face and a darker side under it */
function block(k, x, y, w, h, label, tone = "base", o = {}) {
  const t = TONES[tone] || TONES.base, dep = o.depth ?? 5, r = o.r ?? 7;
  let s = `<rect x="0" y="${dep}" width="${w}" height="${h}" rx="${r}" fill="${t.side}"/>`;
  s += `<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="url(#g-${tone})" stroke="${t.stroke}" stroke-opacity=".55" stroke-width="1.2"/>`;
  s += `<rect x="3" y="2.5" width="${w - 6}" height="${Math.min(10, h / 3)}" rx="${r - 2}" fill="#fff" opacity=".09"/>`;
  if (label !== undefined && label !== null && label !== "") {
    const lines = String(label).split("\n");
    const fs = o.size || (lines.length > 1 ? 13 : 16);
    lines.forEach((ln, i) => { s += txt(w / 2, h / 2 + (i - (lines.length - 1) / 2) * (fs + 2), ln, { size: fs, fill: t.text, weight: o.weight || 700, mono: !o.sans, sans: o.sans }); });
  }
  if (o.sub) s += txt(w / 2, h + dep + 12, o.sub, { size: 11.5, fill: o.subFill || "#9aa6d1", weight: 600 });
  if (o.top) s += txt(w / 2, -12, o.top, { size: 11.5, fill: o.topFill || "#9aa6d1", weight: 600 });
  return { k, x, y, z: o.z ?? 1, svg: s };
}
/* sphere-like node */
function ball(k, x, y, label, tone = "base", o = {}) {
  const t = TONES[tone] || TONES.base, r = o.r || 20;
  let s = `<ellipse cx="0" cy="${r * 0.95}" rx="${r * 0.9}" ry="${r * 0.32}" fill="#000" opacity=".28"/>`;
  s += `<circle cx="0" cy="3" r="${r}" fill="${t.side}"/>`;
  s += `<circle cx="0" cy="0" r="${r}" fill="url(#r-${tone})" stroke="${t.stroke}" stroke-opacity=".7" stroke-width="1.3"/>`;
  s += `<ellipse cx="${-r * 0.3}" cy="${-r * 0.42}" rx="${r * 0.42}" ry="${r * 0.2}" fill="#fff" opacity=".22"/>`;
  s += txt(0, 1, label, { size: o.size || 15, fill: t.text, weight: 800 });
  if (o.sub) s += txt(0, o.subUp ? -r - 14 : r + 16, o.sub, { size: 11.5, fill: o.subFill || "#a9b3dc", weight: 600 });
  if (o.badge) s += `<g transform="translate(${r * 0.85},${-r * 0.85})"><circle r="9" fill="#0b0f1f" stroke="${o.badgeColor || "#fbbf24"}" stroke-width="1.5"/>${txt(0, 0.5, o.badge, { size: 10, fill: o.badgeColor || "#fbbf24", weight: 800 })}</g>`;
  return { k, x, y, z: o.z ?? 2, svg: s };
}
function edge(k, x1, y1, x2, y2, tone = "base", o = {}) {
  const c = EDGE[tone] || EDGE.base, w = o.w || (tone === "done" ? 5 : tone === "active" ? 4.2 : 2.4);
  const r = o.r ?? 20; // shorten for nodes
  let dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  let sx = x1 + ux * r, sy = y1 + uy * r, ex = x2 - ux * (r + (o.arrow ? 3 : 0)), ey = y2 - uy * (r + (o.arrow ? 3 : 0));
  let path, lx, ly;
  if (o.bend) {
    const mx = (x1 + x2) / 2 - uy * o.bend, my = (y1 + y2) / 2 + ux * o.bend;
    const tw = (ax, ay, bx, by) => { const d = Math.hypot(bx - ax, by - ay) || 1; return [ax + (bx - ax) / d * r, ay + (by - ay) / d * r]; };
    [sx, sy] = tw(x1, y1, mx, my); [ex, ey] = tw(x2, y2, mx, my);
    if (o.arrow) { const d = Math.hypot(ex - mx, ey - my); ex -= (ex - mx) / d * 3; ey -= (ey - my) / d * 3; }
    path = `M${sx},${sy} Q${mx},${my} ${ex},${ey}`; lx = (sx + 2 * mx + ex) / 4; ly = (sy + 2 * my + ey) / 4;
  } else { path = `M${sx},${sy} L${ex},${ey}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2; }
  let s = "";
  if (tone === "done" || tone === "active") s += `<path d="${path}" stroke="${c}" stroke-width="${w + 7}" stroke-opacity=".16" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${path}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"${tone === "reject" || o.dash ? ' stroke-dasharray="7 6"' : ""}${o.arrow ? ` marker-end="url(#m-${tone})"` : ""}/>`;
  if (o.label !== undefined && o.label !== null) {
    const ox = (o.lo && o.lo[0]) || 0, oy = (o.lo && o.lo[1]) || 0;
    const lab = String(o.label), bw = lab.length * 8.6 + 12;
    const lt = tone === "dim" ? "#4b557c" : (tone === "base" ? "#c9d3f5" : c);
    s += `<rect x="${lx + ox - bw / 2}" y="${ly + oy - 11}" width="${bw}" height="22" rx="11" fill="#0d1226" stroke="${tone === "base" || tone === "dim" ? "#2a3561" : c}" stroke-width="1.2"/>`;
    s += txt(lx + ox, ly + oy + 0.5, lab, { size: 12.5, fill: lt, weight: 700 });
  }
  return { k, x: 0, y: 0, z: 0, svg: s };
}
/* pointer tag (low / mid / i / j) — glides along */
function pointer(k, x, y, label, tone = "active", o = {}) {
  const c = EDGE[tone] || "#ffc94a", up = o.up;
  const w = String(label).length * 8.4 + 16;
  let s = up
    ? `<path d="M0,0 L-7,-10 L7,-10 z" fill="${c}"/><rect x="${-w / 2}" y="-34" width="${w}" height="24" rx="12" fill="${c}"/>${txt(0, -22, label, { size: 12.5, fill: "#0b0f1f", weight: 800 })}`
    : `<path d="M0,0 L-7,10 L7,10 z" fill="${c}"/><rect x="${-w / 2}" y="10" width="${w}" height="24" rx="12" fill="${c}"/>${txt(0, 22, label, { size: 12.5, fill: "#0b0f1f", weight: 800 })}`;
  return { k, x, y, z: 3, svg: s };
}
function label(k, x, y, s, o = {}) { return { k, x, y, z: o.z ?? 3, svg: txt(0, 0, s, o) }; }
function panel(k, x, y, w, h, o = {}) {
  const c = o.color || "#5a71b3";
  let s = `<rect x="0" y="0" width="${w}" height="${h}" rx="${o.r ?? 14}" fill="${o.fill || "#121935"}" fill-opacity="${o.op ?? 0.6}" stroke="${c}" stroke-opacity="${o.so ?? 0.35}" stroke-width="1.3"${o.dash ? ' stroke-dasharray="6 5"' : ""}/>`;
  if (o.title) s += txt(14, 16, o.title, { size: 12, fill: o.tc || "#9aa6d1", anchor: "start", weight: 700, sans: true });
  return { k, x, y, z: o.z ?? 0, svg: s };
}
function chip(k, x, y, s, tone = "info", o = {}) {
  const t = TONES[tone], w = o.w || (String(s).length * (o.size ? o.size * 0.62 : 8.3) + 20), h = o.h || 28;
  return { k, x, y, z: o.z ?? 3, svg: `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#g-${tone})" stroke="${t.stroke}" stroke-opacity=".6"/>` + txt(0, 0.5, s, { size: o.size || 13, fill: t.text, weight: 800, sans: o.sans }) };
}
function bracket(k, x1, x2, y, s, tone = "pivot") {
  const c = EDGE[tone] || "#a98bff";
  let svg = `<path d="M${x1},${y - 8} L${x1},${y} L${x2},${y} L${x2},${y - 8}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  if (s) svg += txt((x1 + x2) / 2, y + 13, s, { size: 12, fill: c, weight: 700 });
  return { k, x: 0, y: 0, z: 0, svg };
}
function glyph(k, x, y, ch, o = {}) { return { k, x, y, z: o.z ?? 4, svg: `<text x="0" y="0" font-size="${o.size || 26}" text-anchor="middle" dominant-baseline="central" fill="${o.fill || "#fff"}" font-family="'DejaVu Sans','Segoe UI Symbol',sans-serif">${ch}</text>` }; }

/* ---------- layout helpers ---------- */
/* tidy tree: node = {id, label, kids:[], ...}; returns map id -> {x,y,depth} */
function layoutTree(root, o = {}) {
  const nw = o.nodeW || 56, lh = o.levelH || 78, pad = o.pad || 30;
  const pos = {};
  const width = (n) => { if (!n.kids || !n.kids.length) return (n._w = nw); n._w = Math.max(nw, n.kids.reduce((a, c) => a + width(c), 0)); return n._w; };
  width(root);
  const place = (n, x0, d) => {
    if (n.kids && n.kids.length) {
      let xx = x0 + (n._w - n.kids.reduce((a, c) => a + c._w, 0)) / 2;
      n.kids.forEach(c => { place(c, xx, d + 1); xx += c._w; });
      pos[n.id] = { x: (pos[n.kids[0].id].x + pos[n.kids[n.kids.length - 1].id].x) / 2, y: pad + d * lh, d };
    } else pos[n.id] = { x: x0 + n._w / 2, y: pad + d * lh, d };
  };
  place(root, pad, 0);
  return { pos, w: root._w + 2 * pad, h: pad * 2 + (Math.max(...Object.values(pos).map(p => p.d))) * lh };
}
function walk(n, f, parent = null) { f(n, parent); (n.kids || []).forEach(c => walk(c, f, n)); }

/* ---------- scene renderer with keyed transitions ---------- */
function makeStage(svg) {
  svg.innerHTML = svgDefs() + `<g class="L0"></g><g class="L1"></g><g class="L2"></g><g class="L3"></g><g class="L4"></g>`;
  svg._items = new Map();
}
function renderScene(svg, items, w, h, instant) {
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const map = svg._items, seen = new Set();
  for (const it of items) {
    if (!it) continue;
    seen.add(it.k);
    let g = map.get(it.k);
    const tf = `translate(${it.x}px, ${it.y}px)`;
    if (!g) {
      g = document.createElementNS(NS, "g");
      g.setAttribute("class", "it" + (instant ? "" : " enter"));
      g.style.transform = tf; g.innerHTML = it.svg; g._svg = it.svg;
      svg.querySelector(".L" + Math.min(4, it.z ?? 1)).appendChild(g);
      map.set(it.k, g);
      if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.remove("enter")));
    } else {
      if (g._rm) { clearTimeout(g._rm); g._rm = null; g.classList.remove("leave"); }
      if (g._svg !== it.svg) {
        g.innerHTML = it.svg; g._svg = it.svg;
        if (!instant) { g.classList.remove("pop"); void g.getBBox; requestAnimationFrame(() => g.classList.add("pop")); }
      }
      g.style.transform = tf;
    }
  }
  for (const [k, g] of map) {
    if (!seen.has(k) && !g._rm) {
      g.classList.add("leave");
      g._rm = setTimeout(() => { g.remove(); map.delete(k); }, instant ? 0 : 380);
    }
  }
}

/* ---------- small utils ---------- */
const fmt = (v) => (v === Infinity ? "∞" : (Number.isInteger(v) ? String(v) : String(+v.toFixed(3))));
function range(n, s = 0) { return Array.from({ length: n }, (_, i) => i + s); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
