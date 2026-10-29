/* ===== Unit 5 — Branch and Bound ===== */

/* ---------- 0/1 Knapsack: LC and FIFO branch and bound ---------- */
function bbBounds(p, w, m, fixed) {
  const k = fixed.length;
  let W = 0, P = 0;
  for (let i = 0; i < k; i++) if (fixed[i]) { W += w[i]; P += p[i]; }
  if (W > m) return null;
  let cap = m - W, pu = P; const uItems = [];
  for (let i = k; i < p.length; i++) if (w[i] <= cap) { cap -= w[i]; pu += p[i]; uItems.push(p[i]); }
  cap = m - W; let pc = P, frac = null; const cItems = [];
  for (let i = k; i < p.length; i++) {
    if (w[i] <= cap) { cap -= w[i]; pc += p[i]; cItems.push(p[i]); }
    else { pc += p[i] * cap / w[i]; frac = [cap, w[i], p[i]]; break; }
  }
  return { c: -pc, u: -pu, W, P, uItems, cItems, frac };
}
const nf = (v) => { const r = Math.round(v * 100) / 100; return (r < 0 ? "−" : "") + fmt(Math.abs(r)); };

function buildBBK(p, w, m, mode) {
  const n = p.length, steps = [];
  const nodes = { 1: { id: 1, parent: null, fx: [], ...bbBounds(p, w, m, []), edge: "" } };
  const order = [1];
  let live = [1], upper = nodes[1].u, cnt = 1;
  const state = {}; // id -> "live" | "dead" | "enode" | "answer" | "path"
  state[1] = "live";
  const why = (b, fx) => {
    if (!b) return "over capacity";
    const fixedP = fx.map((d, i) => (d ? p[i] : 0)).filter(Boolean);
    const base = fixedP.length ? fixedP.join(" + ") : "0";
    const uTxt = [base, ...b.uItems].filter(x => x !== "0" || fixedP.length === 0).join(" + ");
    let cTxt = [base, ...b.cItems].filter(x => x !== "0" || fixedP.length === 0).join(" + ");
    if (b.frac) cTxt += ` + ${b.frac[0]}/${b.frac[1]}×${b.frac[2]}`;
    return `u = −(${uTxt}) = ${nf(b.u)}; ĉ = −(${cTxt}) = ${nf(b.c)}`;
  };
  /* ---- scene ---- */
  const bw = 104, bh = 52;
  const treeScene = (hl = {}) => {
    const T = {}; order.forEach(id => T[id] = { id, kids: [] });
    order.forEach(id => { if (nodes[id].parent) T[nodes[id].parent].kids.push(T[id]); });
    const lay = layoutTree(T[1], { nodeW: bw + 12, levelH: 98, pad: 30 });
    const ox = 330, oy = 34, s = [];
    order.forEach(id => {
      const nd = nodes[id], P = lay.pos[id], X = ox + P.x, Y = oy + P.y;
      const st = hl[id] || state[id];
      const tone = st === "answer" ? "done" : st === "path" ? "done" : st === "enode" ? "active" : st === "dead" ? "reject" : st === "new" ? "info" : "base";
      if (nd.parent) { const A = lay.pos[nd.parent]; s.push(edge("be" + id, ox + A.x, oy + A.y + bh / 2, X, Y - bh / 2, st === "dead" ? "dim" : (st === "path" || st === "answer") ? "done" : "base", { r: 2, label: nd.edge, w: 2.2 })); }
      s.push(block("bn" + id, X - bw / 2, Y - bh / 2, bw, bh, nd.c === undefined || nd.c === null ? "✕ > m" : `ĉ ${nf(nd.c)}\nu ${nf(nd.u)}`, tone, { size: 14.5, depth: 4 }));
      s.push(ball("bb" + id, X - bw / 2 + 2, Y - bh / 2 + 1, String(id), "white", { r: 12, size: 12, z: 3 }));
    });
    return { s, w: lay.w + ox, h: lay.h + oy };
  };
  const side = (msg) => {
    const s = [panel("items", 20, 20, 290, 64 + n * 34, { title: `ITEMS   m = ${m}`, color: "#a98bff" })];
    s.push(label("ih", 40, 56, "i     p     w    p/w", { size: 12.5, anchor: "start", fill: "#9aa6d1" }));
    p.forEach((pi, i) => s.push(label("ir" + i, 40, 86 + i * 34, `${i + 1}    ${String(pi).padStart(2)}    ${String(w[i]).padStart(2)}    ${fmt(+(pi / w[i]).toFixed(2))}`, { size: 14, anchor: "start" })));
    const y0 = 104 + n * 34;
    s.push(chip("upper", 165, y0 + 10, `upper = ${nf(upper)}`, "pink", { w: 290, size: 15 }));
    s.push(panel("live", 20, y0 + 40, 290, 150, { title: mode === "LC" ? "LIVE NODES (pick least ĉ)" : "LIVE NODES (FIFO queue)", color: "#4cc9ff" }));
    live.forEach((id, i) => s.push(chip("lv" + id, 62 + (i % 3) * 92, y0 + 92 + Math.floor(i / 3) * 40, `${id}: ${nf(nodes[id].c)}`, "info", { w: 84, size: 13 })));
    if (!live.length) s.push(label("lvx", 170, y0 + 100, "(empty)", { size: 13, fill: "#66719a" }));
    if (msg) s.push(label("msg", 170, y0 + 168, msg, { size: 12.5, fill: "#c9d3f5", sans: true }));
    return s;
  };
  const snap = (hl) => { const t = treeScene(hl); return { s: [...side(), ...t.s], w: t.w, h: t.h }; };
  /* ---- run ---- */
  const r = nodes[1];
  let sc = snap();
  steps.push({ t: "Root node 1", d: `Branch and bound treats knapsack as <b>minimisation</b>, so profits are negative. For a node: <b>u</b> = whole items that still fit (upper bound), <b>ĉ</b> = u plus a fraction of the next item (lower bound). Root: ${why(r, [])}. upper = u(1) = ${nf(upper)}.`, cap: `node 1: ĉ = ${nf(r.c)}, u = ${nf(r.u)}  ·  upper = ${nf(upper)}`, s: sc.s });
  let answer = null, guard = 0;
  while (live.length && guard++ < 40) {
    let e;
    if (mode === "LC") e = live.reduce((a, b) => (nodes[b].c < nodes[a].c || (nodes[b].c === nodes[a].c && b < a) ? b : a));
    else e = live[0];
    live = live.filter(x => x !== e);
    const E = nodes[e];
    if (E.c > upper) { state[e] = "dead"; sc = snap(); steps.push({ t: `Node ${e} killed`, d: `ĉ(${e}) = ${nf(E.c)} > upper = ${nf(upper)}: it cannot beat the best answer found ⇒ kill.`, cap: `node ${e} killed`, s: sc.s }); continue; }
    if (E.fx.length === n) {
      answer = e; state[e] = "answer";
      let c = E.parent; while (c) { state[c] = "path"; c = nodes[c].parent; }
      break;
    }
    state[e] = "enode";
    const kids = [], lines = [];
    for (const d of [1, 0]) {
      cnt++;
      const fx = [...E.fx, d], b = bbBounds(p, w, m, fx);
      nodes[cnt] = { id: cnt, parent: e, fx, edge: `x${fx.length}=${d}`, ...(b || { c: null, u: null }) };
      order.push(cnt); kids.push(cnt);
      if (!b) { state[cnt] = "dead"; lines.push(`node ${cnt} (x${fx.length} = ${d}): weight > ${m} ⇒ <b>kill</b>`); continue; }
      state[cnt] = "live"; live.push(cnt);
      const old = upper; upper = Math.min(upper, b.u);
      lines.push(`node ${cnt} (x${fx.length} = ${d}): ${why(b, fx)}${upper < old ? ` ⇒ upper = ${nf(upper)}` : ""}`);
    }
    const killedNow = live.filter(i => nodes[i].c > upper);
    killedNow.forEach(i => { state[i] = "dead"; });
    live = live.filter(i => !(nodes[i].c > upper));
    const hl = {}; kids.forEach(k => { if (state[k] === "live") hl[k] = "new"; });
    sc = snap(hl);
    steps.push({
      t: `E-node ${e}: branch on x${E.fx.length + 1}`,
      d: `${mode === "LC" ? `Live node with the <b>least ĉ</b> is node ${e}` : `Front of the queue is node ${e}`} ⇒ it becomes the E-node. Children: ${lines.join("; ")}.${killedNow.length ? ` Kill node${killedNow.length > 1 ? "s" : ""} ${killedNow.join(", ")} because ĉ > upper = ${nf(upper)}.` : ""}`,
      cap: `E-node ${e} → nodes ${kids.join(", ")} · upper = ${nf(upper)}`, s: sc.s,
    });
    state[e] = "done";
  }
  const A = nodes[answer];
  const profit = A.fx.reduce((a, d, i) => a + d * p[i], 0), wt = A.fx.reduce((a, d, i) => a + d * w[i], 0);
  sc = snap();
  steps.push({ t: `Answer node ${answer}`, d: `Node ${answer} is a leaf chosen as E-node ⇒ it is the answer. Follow the path from the root: <b>x = (${A.fx.join(", ")})</b>, weight = ${wt} ≤ ${m}, <b>maximum profit = ${profit}</b> (−ĉ). ${mode === "LC" ? "LC search used the least-cost rule to reach it." : "FIFO expanded nodes level by level (breadth first)."}`, cap: `x = (${A.fx.join(", ")}) · profit = ${profit}`, s: sc.s });
  const W = Math.max(...steps.map(() => sc.w)), H = Math.max(sc.h, 140 + n * 34 + 200);
  return { w: Math.max(W, 900), h: Math.max(H, 520), steps };
}

defAlgo({
  id: "bb-knapsack", group: "bb", title: "0/1 Knapsack (Branch & Bound)", short: "LC · FIFO",
  idea: "Build the state space tree node by node. Each node gets a lower bound ĉ and an upper bound u; kill any node whose ĉ is worse than the best u found (upper).",
  time: "O(2ⁿ) worst case", space: "O(2ⁿ)", pyq: "LCBB 3× · FIFO 1×",
  variants: [
    { name: "LC B&B (n = 4)", build: () => buildBBK([10, 10, 12, 18], [2, 4, 6, 9], 15, "LC"), idea: "Least Cost: the next E-node is always the live node with the smallest ĉ." },
    { name: "FIFO B&B (n = 4)", build: () => buildBBK([10, 10, 12, 18], [2, 4, 6, 9], 15, "FIFO"), idea: "FIFO: live nodes wait in a queue; the next E-node is the oldest one (breadth first).",
      exam: { def: "FIFO branch and bound expands live nodes in first-in-first-out order (a queue), i.e. breadth first. For 0/1 knapsack each node has ĉ (with a fraction) and u (whole items); a node is killed if ĉ > upper, where upper is the smallest u found so far.", steps: ["Start.", "Make the root; compute ĉ and u; upper = u(root); add root to the queue.", "While the queue is not empty, repeat Steps 4–6.", "Delete the front node E from the queue (E-node).", "If E is a leaf with ĉ ≤ upper, it is the answer; stop.", "Generate both children (xᵢ = 1, xᵢ = 0); skip a child that is over capacity; compute ĉ and u; upper = min(upper, u); add live children to the queue; kill nodes with ĉ > upper.", "Print x and the profit.", "Stop."] } },
    { name: "LC B&B (n = 5, PYQ)", build: () => buildBBK([10, 15, 6, 8, 4], [4, 6, 3, 4, 2], 12, "LC"), idea: "Same LC rule on a 5-item question." },
  ],
  exam: {
    def: "LC (Least Cost) branch and bound for 0/1 knapsack: the problem is changed to minimise −Σpᵢxᵢ. For each node, ĉ = −(profit with a fraction of the next item) is a lower bound and u = −(profit of whole items that fit) is an upper bound. The live node with the least ĉ is expanded next; nodes with ĉ > upper are killed.",
    steps: ["Start.", "Create the root; compute ĉ(root) and u(root); upper = u(root).", "Add the root to the list of live nodes.", "Repeat Steps 5–7 while live nodes remain.", "Choose the live node E with the least ĉ (E-node); if E is a leaf, it is the answer — go to Step 8.", "Generate children for xᵢ = 1 and xᵢ = 0; reject a child that exceeds m; compute ĉ and u; upper = min(upper, u).", "Add the children to the live list; kill every live node with ĉ > upper.", "Print the solution vector x and the profit −ĉ.", "Stop."],
  },
});

/* ---------- TSP: LC branch and bound with reduced matrices ---------- */
defAlgo({
  id: "tsp-bb", group: "bb", title: "Travelling Salesperson (B&B)", short: "reduced cost matrix",
  idea: "Reduce the cost matrix (every row and column gets a 0); the amount subtracted is a lower bound. A child for edge (i, j) costs ĉ(parent) + A(i, j) + r.",
  time: "O(n² · 2ⁿ) worst case", space: "O(n²) per node", pyq: "2× (5 × 5 matrix)",
  variants: [{
    name: "5 × 5 matrix",
    build() {
      const I = Infinity;
      const C = [[I, 20, 30, 10, 11], [15, I, 16, 4, 2], [3, 5, I, 2, 4], [19, 6, 18, I, 3], [16, 4, 7, 16, I]];
      const n = 5, steps = [];
      const reduce = (M) => {
        M = M.map(r => r.slice()); let cost = 0; const rows = [], cols = [];
        for (let i = 0; i < n; i++) { const mn = Math.min(...M[i]); if (mn !== I && mn > 0) { cost += mn; M[i] = M[i].map(x => (x === I ? I : x - mn)); } rows.push(mn === I ? 0 : mn); }
        for (let j = 0; j < n; j++) { const mn = Math.min(...M.map(r => r[j])); if (mn !== I && mn > 0) { cost += mn; for (let i = 0; i < n; i++) if (M[i][j] !== I) M[i][j] -= mn; } cols.push(mn === I ? 0 : mn); }
        return { M, cost, rows, cols };
      };
      const rowOnly = (M) => M.map(r => { const mn = Math.min(...r); return mn === I || mn === 0 ? r.slice() : r.map(x => (x === I ? I : x - mn)); });
      /* matrix panel */
      const cs = 54, mx = 70, my = 96;
      const mat = (M, o = {}) => {
        const s = [panel("mp", 20, 20, 360, 410, { title: o.title || "MATRIX", color: o.color || "#4cc9ff" })];
        for (let j = 0; j < n; j++) s.push(label("mc" + j, mx + j * cs + cs / 2 - 2, my - 18, String(j + 1), { size: 13, fill: "#9aa6d1" }));
        for (let i = 0; i < n; i++) {
          s.push(label("mr" + i, mx - 22, my + i * cs + cs / 2 - 2, String(i + 1), { size: 13, fill: "#9aa6d1" }));
          for (let j = 0; j < n; j++) {
            const v = M[i][j], hl = o.hl && o.hl(i, j, v);
            s.push(block(`m${i}${j}`, mx + j * cs, my + i * cs, cs - 6, cs - 6, v === I ? "∞" : String(v), hl || (v === I ? "ghost" : v === 0 ? "done" : "base"), { depth: 3, size: 15, r: 6 }));
          }
          if (o.rows) s.push(label("rm" + i, mx + n * cs + 12, my + i * cs + cs / 2 - 2, o.rows[i] ? "−" + o.rows[i] : "", { size: 13, fill: "#ff8fa6", anchor: "start" }));
        }
        if (o.cols) for (let j = 0; j < n; j++) s.push(label("cm" + j, mx + j * cs + cs / 2 - 2, my + n * cs + 10, o.cols[j] ? "−" + o.cols[j] : "", { size: 13, fill: "#ff8fa6" }));
        if (o.note) s.push(label("mnote", 200, 410, o.note, { size: 13.5, fill: "#c9d3f5" }));
        return s;
      };
      /* tree */
      const nodes = {}, order = [], state = {};
      const tree = (hl = {}) => {
        const T = {}; order.forEach(id => T[id] = { id, kids: [] });
        order.forEach(id => { if (nodes[id].parent) T[nodes[id].parent].kids.push(T[id]); });
        const lay = layoutTree(T[1], { nodeW: 84, levelH: 96, pad: 30 });
        const ox = 400, oy = 34, s = [chip("tlg", 400 + Math.max(lay.w, 300) / 2, 18, "inside = ĉ · small circle = node number", "base", { size: 12 })];
        order.forEach(id => {
          const nd = nodes[id], P = lay.pos[id], st = hl[id] || state[id];
          const tone = st === "path" ? "done" : st === "enode" ? "active" : st === "dead" ? "reject" : st === "new" ? "info" : "base";
          if (nd.parent) { const A = lay.pos[nd.parent], ax = ox + A.x, ay = oy + A.y, X = ox + P.x, Y = oy + P.y; s.push(edge("te" + id, ax, ay, X, Y, st === "path" ? "done" : st === "dead" ? "dim" : "base", { r: 24, label: `→${nd.city + 1}`, w: 2.2, lo: [(X - ax) * 0.14, (Y - ay) * 0.14] })); }
          s.push(ball("tn" + id, ox + P.x, oy + P.y, String(nd.c), tone, { r: 23, size: 15, badge: String(id), badgeColor: "#e6dfff" }));
        });
        return { s, w: ox + lay.w, h: oy + lay.h + 30 };
      };
      const fmtM = (v) => (v === I ? "∞" : v);
      /* step 1: matrix */
      steps.push({ t: "Cost matrix", d: "Start city is 1. A(i, i) = ∞ because a city does not go to itself. To get a lower bound we will <b>reduce</b> the matrix: make at least one 0 in every row and every column.", cap: "5 cities · start at 1", s: [...mat(C, { title: "COST MATRIX" })] });
      const rmin = C.map(r => Math.min(...r));
      const R1 = rowOnly(C);
      steps.push({ t: "Row reduction", d: `Subtract each row's minimum: rows 1–5 give <b>${rmin.join(" + ")} = ${rmin.reduce((a, b) => a + b, 0)}</b>.`, cap: `row minima: ${rmin.join(", ")}`, s: [...mat(R1, { title: "AFTER ROW REDUCTION", rows: rmin, color: "#ff6b86" })] });
      const root = reduce(C);
      const cmin = root.cols;
      steps.push({ t: "Column reduction → root ĉ = 25", d: `Now subtract each column's minimum: ${cmin.map((c, j) => `col ${j + 1}: ${c}`).join(", ")} = ${cmin.reduce((a, b) => a + b, 0)}. Total reduction <b>r = 21 + 4 = 25</b> = ĉ(root). Every tour costs at least 25.`, cap: "ĉ(1) = 25", s: [...mat(root.M, { title: "REDUCED MATRIX — NODE 1", cols: cmin, color: "#2ee6a6" })] });
      nodes[1] = { id: 1, parent: null, path: [0], M: root.M, c: 25, city: 0 }; order.push(1); state[1] = "live";
      let tr = tree();
      steps.push({ t: "Root of the state space tree", d: "Node 1 = tour starts at city 1, ĉ = 25. Each child fixes the next city.", cap: "live = {1}", s: [...mat(root.M, { title: "REDUCED MATRIX — NODE 1", color: "#2ee6a6" }), ...tr.s] });
      let live = [1], cnt = 1, best = null, guard = 0, maxW = tr.w, maxH = tr.h;
      while (live.length && guard++ < 20) {
        live.sort((a, b) => nodes[a].c - nodes[b].c || a - b);
        const e = live.shift(), E = nodes[e];
        if (E.path.length === n) { best = e; break; }
        state[e] = "enode";
        const i = E.path[E.path.length - 1];
        for (let j = 0; j < n; j++) {
          if (E.path.includes(j)) continue;
          const A = E.M.map(r => r.slice());
          for (let k = 0; k < n; k++) { A[i][k] = I; A[k][j] = I; }
          A[j][0] = I;
          const red = reduce(A);
          cnt++;
          const c = E.c + E.M[i][j] + red.cost;
          nodes[cnt] = { id: cnt, parent: e, path: [...E.path, j], M: red.M, c, city: j };
          order.push(cnt); state[cnt] = "live"; live.push(cnt);
          tr = tree({ [cnt]: "new" }); maxW = Math.max(maxW, tr.w); maxH = Math.max(maxH, tr.h);
          const rr = red.rows.some(Boolean) || red.cols.some(Boolean) ? `rows ${red.rows.map((v, q) => (v ? `${q + 1}:${v}` : null)).filter(Boolean).join(" ") || "none"} · cols ${red.cols.map((v, q) => (v ? `${q + 1}:${v}` : null)).filter(Boolean).join(" ") || "none"}` : "nothing to reduce";
          steps.push({
            t: `Node ${cnt}: edge ${i + 1} → ${j + 1}`,
            d: `From E-node ${e} (path ${E.path.map(x => x + 1).join("–")}): set <b>row ${i + 1}</b> and <b>column ${j + 1}</b> to ∞ and A(${j + 1}, 1) = ∞. Reduce again: ${rr}, r = ${red.cost}. <b>ĉ = ĉ(${e}) + A(${i + 1},${j + 1}) + r = ${E.c} + ${fmtM(E.M[i][j])} + ${red.cost} = ${c}</b>.`,
            cap: `ĉ(${cnt}) = ${E.c} + ${fmtM(E.M[i][j])} + ${red.cost} = ${c}`,
            s: [...mat(red.M, { title: `NODE ${cnt} — PATH ${[...E.path, j].map(x => x + 1).join("–")}`, rows: red.rows, cols: red.cols, color: "#4cc9ff", note: `ĉ = ${c}` }), ...tr.s],
          });
        }
        state[e] = "done";
        const nxt = live.slice().sort((a, b) => nodes[a].c - nodes[b].c || a - b)[0];
        tr = tree({ [nxt]: "enode" });
        const leaf = nodes[nxt].path.length === n;
        steps.push({ t: leaf ? "Least ĉ is a leaf" : `Choose the next E-node`, d: `Live nodes and ĉ: ${live.map(x => `${x} (${nodes[x].c})`).join(", ")}. The <b>least ĉ</b> is node ${nxt} (${nodes[nxt].c})${leaf ? `. It is a leaf: all ${n} cities are visited, so it gives the answer.` : " ⇒ expand it next."}`, cap: `next E-node = ${nxt}`, s: [...mat(nodes[nxt].M, { title: `NODE ${nxt} — PATH ${nodes[nxt].path.map(x => x + 1).join("–")}`, color: "#ffc94a", note: `ĉ = ${nodes[nxt].c}` }), ...tr.s] });
      }
      const B = nodes[best];
      let c = best; while (c) { state[c] = "path"; c = nodes[c].parent; }
      order.forEach(id => { if (state[id] === "live" || state[id] === "done") if (!(state[id] === "path")) state[id] = nodes[id].c > B.c ? "dead" : state[id]; });
      tr = tree();
      const tour = [...B.path.map(x => x + 1), 1];
      const real = tour.slice(0, -1).reduce((a, x, q) => a + C[x - 1][tour[q + 1] - 1], 0);
      steps.push({ t: `Answer: node ${best}`, d: `Node ${best} is a leaf with the least ĉ = ${B.c}; every other live node has ĉ ≥ ${B.c}, so they are killed. <b>Tour ${tour.join(" → ")}</b>, cost = ${tour.slice(0, -1).map((x, q) => C[x - 1][tour[q + 1] - 1]).join(" + ")} = <b>${real}</b>.`, cap: `tour ${tour.join("-")} · cost ${real}`, s: [...mat(C, { title: "ORIGINAL MATRIX — TOUR EDGES", color: "#2ee6a6", hl: (i, j) => (tour.slice(0, -1).some((x, q) => x - 1 === i && tour[q + 1] - 1 === j) ? "done" : null), note: `cost = ${real}` }), ...tr.s] });
      return { w: Math.max(980, maxW), h: Math.max(470, maxH), steps };
    }
  }],
  exam: {
    def: "LC branch and bound for TSP uses a reduced cost matrix. Reducing (subtracting the row minima, then the column minima) gives a lower bound on every tour. For the child that adds edge (i, j): set row i and column j to ∞, set A(j, 1) = ∞, reduce again by r; then ĉ(child) = ĉ(parent) + A(i, j) + r. The live node with the least ĉ is expanded next.",
    steps: ["Start.", "Reduce the cost matrix; the total subtracted is ĉ(root).", "Add the root (city 1) to the live list.", "Repeat Steps 5–7 until a leaf is chosen.", "Choose the live node R with the least ĉ (E-node).", "For each unvisited city j: copy R's matrix, set row i and column j to ∞ and A(j, 1) = ∞, reduce it by r.", "ĉ(child) = ĉ(R) + A(i, j) + r; add the child to the live list.", "The chosen leaf gives the tour and its cost; print them.", "Stop."],
  },
});
