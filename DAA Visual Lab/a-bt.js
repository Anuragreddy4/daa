/* ===== Unit 4 (part B) — Backtracking ===== */

/* generic: tree that grows over steps. nodes: [{id, parent, label, tone, edge}] */
function growTree(nodes, upto, ox, oy, o = {}) {
  const byId = {}; nodes.forEach(n => byId[n.id] = { ...n, kids: [] });
  let root = null; nodes.forEach(n => { if (n.parent === null) root = byId[n.id]; else byId[n.parent].kids.push(byId[n.id]); });
  const lay = layoutTree(root, { nodeW: o.nodeW || 46, levelH: o.levelH || 70, pad: 12 });
  const sc = o.scale || 1;
  const s = [];
  nodes.slice(0, upto).forEach((n) => {
    const p = lay.pos[n.id];
    const X = ox + p.x * sc, Y = oy + p.y;
    if (n.parent !== null) { const a = lay.pos[n.parent], lf = o.lf ?? 0.1, ax = ox + a.x * sc, ay = oy + a.y; s.push(edge("te" + n.id, ax, ay, X, Y, n.etone || (n.tone === "reject" ? "dim" : n.tone === "done" ? "done" : "base"), { r: o.r || 16, label: o.noEdgeLabels ? undefined : n.edge, w: 2, lo: [(X - ax) * lf, (Y - ay) * lf] })); }
    if (o.boxes) s.push(block("tn" + n.id, X - (o.bw || 64) / 2, Y - 19, o.bw || 64, 38, n.label, n.tone || "base", { size: 12, depth: 3 }));
    else s.push(ball("tn" + n.id, X, Y, n.label, n.tone || "base", { r: o.r || 16, size: 12 }));
  });
  return { items: s, w: lay.w * sc, h: lay.h };
}

/* ---------- N-Queens (4×4) ---------- */
defAlgo({
  id: "n-queens", group: "bt", title: "N-Queens (4 × 4)", short: "no two queens attack",
  idea: "Place queen k in row k. Try columns 1…n; reject a column if it shares a column or diagonal with an earlier queen; backtrack when a row has no safe column.",
  time: "O(n!)", space: "O(n)", pyq: "6× (ma'am: practise 4 × 4)",
  variants: [{
    name: "4 queens",
    build() {
      const n = 4, W = 1120, H = 560, cs = 68, bx = 40, by = 110, steps = [];
      const nodes = [{ id: "r", parent: null, label: "S", tone: "pivot" }];
      const events = [];
      let cnt = 0;
      const x = [];
      const safe = (k, i) => { for (let j = 0; j < k; j++) if (x[j] === i || Math.abs(x[j] - i) === Math.abs(j - k)) return [false, x[j] === i ? `same column as queen ${j + 1}` : `same diagonal as queen ${j + 1}`]; return [true, ""]; };
      let solved = false;
      const rec = (k, pid) => {
        const tried = [];
        for (let i = 1; i <= n && !solved; i++) {
          const [ok, why] = safe(k, i);
          const id = "n" + (cnt++);
          nodes.push({ id, parent: pid, label: String(i), tone: ok ? "base" : "reject", edge: `x${k + 1}=${i}` });
          if (!ok) { tried.push([i, why, id]); continue; }
          x[k] = i;
          events.push({ type: "place", k, i, id, tried: tried.slice(), queens: x.slice(0, k + 1), upto: nodes.length });
          tried.length = 0;
          if (k === n - 1) { solved = true; events.push({ type: "solution", queens: x.slice(), id, upto: nodes.length }); return; }
          rec(k + 1, id);
          if (solved) return;
        }
        if (!solved) events.push({ type: "dead", k, tried: tried.slice(), queens: x.slice(0, k), pid, upto: nodes.length });
      };
      rec(0, "r");
      const nodeIndex = {}; nodes.forEach((nd, i) => nodeIndex[nd.id] = i);
      const board = (queens, marks = [], hlRow = -1) => {
        const s = [label("bt", bx + cs * 2, by - 40, "board (row k = queen k)", { size: 13, fill: "#c9d3f5", sans: true })];
        for (let r = 0; r < n; r++) { s.push(label("rl" + r, bx - 16, by + r * cs + cs / 2, String(r + 1), { size: 13, fill: "#9aa6d1" })); for (let c = 0; c < n; c++) { const m = marks.find(mm => mm[0] === r && mm[1] === c); s.push(block(`sq${r}${c}`, bx + c * cs, by + r * cs, cs - 4, cs - 4, "", m ? "reject" : r === hlRow ? "dim" : ((r + c) % 2 ? "ghost" : "dim"), { depth: 0, r: 4 })); } }
        for (let c = 0; c < n; c++) s.push(label("cl" + c, bx + c * cs + cs / 2 - 2, by + n * cs + 14, String(c + 1), { size: 13, fill: "#9aa6d1" }));
        queens.forEach((col, r) => s.push(ball("q" + r, bx + (col - 1) * cs + cs / 2 - 2, by + r * cs + cs / 2 - 2, "Q", "pivot", { r: 22, size: 15 })));
        return s;
      };
      const tox = 340;
      let treeAt = (upto, hl = {}) => {
        const nn = nodes.map(nd => ({ ...nd, tone: hl[nd.id] || nd.tone }));
        const g = growTree(nn, upto, tox, 74, { nodeW: 44, levelH: 96, r: 17, noEdgeLabels: true });
        return g.items;
      };
      const legend = [chip("lg1", tox + 150, 26, "node = column tried for that row", "base", { size: 12.5 }), chip("lg2", tox + 400, 26, "red = killed", "reject", { size: 12.5 })];
      const _treeAt = treeAt; treeAt = (u, hl) => [...legend, ..._treeAt(u, hl)];
      steps.push({ t: "Empty 4 × 4 board", d: "Queen k goes in row k. x[k] = its column. Two queens clash if <b>x[j] = x[k]</b> (same column) or <b>|x[j] − x[k]| = |j − k|</b> (same diagonal).", cap: "Place(k, i): column and diagonal test", s: [...board([]), ...treeAt(1)] });
      events.forEach(ev => {
        const upto = ev.upto;
        if (ev.type === "place") {
          const rej = ev.tried.map(([c, why]) => `column ${c} ✕ (${why})`).join(", ");
          steps.push({ t: `Row ${ev.k + 1}: queen in column ${ev.i}`, d: `${rej ? rej + ". " : ""}Column <b>${ev.i}</b> is safe ⇒ x${ev.k + 1} = ${ev.i}.`, cap: `x = (${ev.queens.join(", ")})`, s: [...board(ev.queens, ev.tried.map(([c]) => [ev.k, c - 1])), ...treeAt(upto, { [ev.id]: "active" })] });
        } else if (ev.type === "dead") {
          const why = ev.tried.length ? ev.tried.map(([c, w]) => `column ${c} ✕ (${w})`).join(", ") + ". " : "Every remaining column has been tried. ";
          steps.push({ t: `Row ${ev.k + 1}: dead end → backtrack`, d: `${why}No safe column is left in row ${ev.k + 1} ⇒ <b>backtrack</b>: remove queen ${ev.k} and move it to its next column.`, cap: `dead end at row ${ev.k + 1} → backtrack to row ${ev.k}`, s: [...board(ev.queens, ev.tried.map(([c]) => [ev.k, c - 1]), ev.k), ...treeAt(upto, { [ev.pid]: "reject" })] });
          if (ev.pid !== "r") nodes[nodeIndex[ev.pid]].tone = "reject";
        } else if (ev.type === "solution") {
          const path = {}; let cur = ev.id; while (cur && cur !== "r") { path[cur] = "done"; cur = nodes[nodeIndex[cur]].parent; }
          steps.push({ t: "Solution (2, 4, 1, 3)", d: "All 4 queens are placed with no attacks: <b>x = (2, 4, 1, 3)</b>. The other solution is its mirror (3, 1, 4, 2). Worst case the tree has about n! leaves ⇒ <b>O(n!)</b>.", cap: "x = (2, 4, 1, 3) · O(n!)", s: [...board(ev.queens), ...treeAt(nodes.length, path)] });
        }
      });
      const full = growTree(nodes, nodes.length, 0, 0, { nodeW: 44, levelH: 96, r: 17 });
      return { w: Math.max(W, tox + full.w + 10), h: Math.max(H, 74 + full.h + 30), steps };
    }
  }],
  exam: {
    def: "The n-queens problem is to place n queens on an n × n chessboard so that no two attack each other (same row, column or diagonal). With queen i in row i and x[i] its column, queens j and k clash if x[j] = x[k] or |x[j] − x[k]| = |j − k|. Solved by backtracking.",
    steps: ["Start.", "Place(k, i): for every earlier queen j, if x[j] = i or |x[j] − i| = |j − k|, return false; else return true.", "NQueens(k, n): for each column i = 1..n, go to Step 4.", "If Place(k, i): set x[k] = i; if k = n print x[1..n], else call NQueens(k + 1, n).", "When all columns are tried, return (backtrack).", "Stop."],
  },
});

/* ---------- Sum of subsets ---------- */
defAlgo({
  id: "sum-subsets", group: "bt", title: "Sum of Subsets", short: "nodes as ({set}, sum)",
  idea: "Left branch = take the next number, right branch = skip it. Kill a node when it overshoots m or cannot reach m any more.",
  time: "O(2ⁿ)", space: "O(n)", pyq: "3× + Part A (ma'am: root = ({ }, 0))",
  variants: [
    { name: "S = {4, 5, 7, 8}, d = 15", build: () => buildSOS([4, 5, 7, 8], 15) },
  ],
  exam: {
    def: "Sum of subsets: given n distinct positive numbers wᵢ and m, find all subsets whose sum is m. Backtracking with xᵢ ∈ {0, 1}: expand a node only if s + r ≥ m and s + wₖ₊₁ ≤ m (s = chosen sum, r = remaining sum). Worst case O(2ⁿ).",
    steps: ["Start (w sorted ascending; first call SumOfSub(0, 1, total)).", "s = sum chosen so far, r = sum of w[k..n].", "Left child: x[k] = 1.", "If s + w[k] = m, print the subset (answer).", "Else if s + w[k] + w[k+1] ≤ m, call SumOfSub(s + w[k], k + 1, r − w[k]).", "Right child: if s + r − w[k] ≥ m and s + w[k+1] ≤ m, x[k] = 0 and call SumOfSub(s, k + 1, r − w[k]).", "Stop."],
  },
});
function buildSOS(w, m) {
  const n = w.length, nodes = [], steps = [];
  const setStr = (arr) => "{" + arr.join(",") + "}";
  nodes.push({ id: "r", parent: null, label: `{ }\n0`, tone: "pivot" });
  const ev = [];
  let id = 0;
  const rec = (s, k, r, chosen, pid) => {
    // left: take w[k]
    const lid = "a" + (id++);
    const ns = s + w[k];
    if (ns === m) { nodes.push({ id: lid, parent: pid, label: `${setStr([...chosen, w[k]])}\n${ns} ✓`, tone: "done", edge: `+${w[k]}` }); ev.push({ id: lid, text: `Take ${w[k]}: sum = ${ns} = m ⇒ <b>answer ${setStr([...chosen, w[k]])}</b>.` }); }
    else if (k + 1 < n && ns + w[k + 1] <= m) { nodes.push({ id: lid, parent: pid, label: `${setStr([...chosen, w[k]])}\n${ns}`, tone: "base", edge: `+${w[k]}` }); ev.push({ id: lid, text: `Take ${w[k]}: sum = ${ns}. ${ns} + next ${w[k + 1]} = ${ns + w[k + 1]} ≤ ${m} ⇒ keep going.` }); rec(ns, k + 1, r - w[k], [...chosen, w[k]], lid); }
    else { nodes.push({ id: lid, parent: pid, label: `${setStr([...chosen, w[k]])}\n${ns} ✕`, tone: "reject", edge: `+${w[k]}` }); ev.push({ id: lid, text: `Take ${w[k]}: sum = ${ns}. ${k + 1 < n ? `${ns} + next ${w[k + 1]} = ${ns + w[k + 1]} > ${m}` : "no numbers left"} ⇒ <b>kill</b>.` }); }
    // right: skip w[k]
    const rid = "b" + (id++);
    if (k + 1 < n && s + r - w[k] >= m && s + w[k + 1] <= m) { nodes.push({ id: rid, parent: pid, label: `${setStr(chosen)}\n${s}`, tone: "base", edge: `skip ${w[k]}` }); ev.push({ id: rid, text: `Skip ${w[k]}: sum stays ${s}; remaining ${r - w[k]} can still reach ${m} ⇒ keep going.` }); rec(s, k + 1, r - w[k], chosen, rid); }
    else { nodes.push({ id: rid, parent: pid, label: `${setStr(chosen)}\n${s} ✕`, tone: "reject", edge: `skip ${w[k]}` }); ev.push({ id: rid, text: `Skip ${w[k]}: ${k + 1 >= n ? "no numbers left" : s + r - w[k] < m ? `${s} + remaining ${r - w[k]} = ${s + r - w[k]} < ${m}` : `${s} + next ${w[k + 1]} > ${m}`} ⇒ <b>kill</b>.` }); }
  };
  rec(0, 0, w.reduce((a, b) => a + b, 0), [], "r");
  const idx = {}; nodes.forEach((nd, i) => idx[nd.id] = i);
  const bw = n > 4 ? 64 : 72;
  const probe = growTree(nodes, nodes.length, 0, 0, { boxes: true, nodeW: bw + 18, levelH: 84, bw, lf: 0.1 });
  const W = Math.max(860, probe.w + 40), H = Math.max(520, probe.h + 120);
  const ox = (W - probe.w) / 2;
  const head = [chip("info", W / 2, 22, `w = (${w.join(", ")})   m = ${m}   node = ({chosen set}, sum)`, "pivot", { size: 13 })];
  steps.push({ t: "Root ({ }, 0)", d: `Numbers in increasing order: ${w.join(", ")}. Target m = ${m}. The root is <b>({ }, 0)</b>: nothing chosen, sum 0. Left branch = take the next number; right branch = skip it.`, cap: "keep a node only if  s + r ≥ m  and  s + w(next) ≤ m", s: [...head, ...growTree(nodes, 1, ox, 50, { boxes: true, nodeW: bw + 18, levelH: 84, bw, lf: 0.1 }).items] });
  ev.forEach((e, k) => {
    const nd = nodes[idx[e.id]];
    steps.push({ t: nd.tone === "done" ? "Answer found" : nd.tone === "reject" ? "Node killed" : "New node", d: e.text, cap: nd.label.replace("\n", "  sum ").replace("✓", "").replace("✕", ""), s: [...head, ...growTree(nodes.map(x => x.id === e.id && x.tone === "base" ? { ...x, tone: "active" } : x), idx[e.id] + 1, ox, 50, { boxes: true, nodeW: bw + 18, levelH: 84, bw, lf: 0.1 }).items] });
  });
  const answers = nodes.filter(x => x.tone === "done").map(x => x.label.split("\n")[0]);
  steps.push({ t: "All subsets", d: `Subsets with sum ${m}: <b>${answers.join(", ")}</b>. The full binary tree has 2ⁿ leaves ⇒ worst case <b>O(2ⁿ)</b>; the bounding test kills most branches.`, cap: `answers: ${answers.join("  ")}`, s: [...head, ...growTree(nodes, nodes.length, ox, 50, { boxes: true, nodeW: bw + 18, levelH: 84, bw, lf: 0.1 }).items] });
  return { w: W, h: H, steps };
}

/* ---------- Graph colouring ---------- */
defAlgo({
  id: "graph-colouring", group: "bt", title: "Graph Colouring", short: "m-colouring",
  idea: "Colour vertices one by one with colours 1…m; reject a colour used by a neighbour; backtrack when no colour fits.",
  time: "O(n·mⁿ)", space: "O(n)", pyq: "2×",
  variants: [{
    name: "4 vertices, m = 3",
    build() {
      const W = 980, H = 500, N = { 1: [90, 120], 2: [300, 120], 3: [300, 330], 4: [90, 330] };
      const E = [[1, 2], [2, 3], [3, 4], [4, 1], [2, 4]];
      const adj = { 1: [2, 4], 2: [1, 3, 4], 3: [2, 4], 4: [1, 2, 3] };
      const ctone = ["base", "info", "done", "pink"];
      const x = {}, nodes = [{ id: "r", parent: null, label: "S", tone: "pivot" }], steps = [];
      const graph = (cur) => { const s = []; E.forEach(([u, v]) => s.push(edge(`e${u}${v}`, ...N[u], ...N[v], "base", { r: 28 }))); for (const k in N) s.push(ball("v" + k, ...N[k], k, x[k] ? ctone[x[k]] : (cur == k ? "white" : "dim"), { r: 28, size: 17, sub: x[k] ? `colour ${x[k]}` : "" })); s.push(chip("leg", 195, 455, "colour 1 = blue · 2 = green · 3 = pink", "base", { size: 12 })); s.push(chip("leg2", 640, 24, "level k = vertex k · node = colour tried · red = clash", "base", { size: 12 })); return s; };
      let cnt = 0, pid = "r", done = false;
      steps.push({ t: "Graph and m = 3 colours", d: "Adjacent vertices must get different colours. Colour vertices 1, 2, 3, 4 in order, trying colours 1, 2, 3.", cap: "NextValue(k): next colour not used by any neighbour", s: [...graph(1), ...growTree(nodes, 1, 430, 70, { nodeW: 60, levelH: 92, r: 19, noEdgeLabels: true }).items] });
      const rec = (k) => {
        if (k > 4) { done = true; return; }
        const tried = [];
        for (let c = 1; c <= 3 && !done; c++) {
          const bad = adj[k].filter(j => j < k && x[j] === c);
          const id = "c" + (cnt++);
          nodes.push({ id, parent: pid, label: String(c), tone: bad.length ? "reject" : ["", "info", "done", "pink"][c], edge: `x${k}=${c}` });
          if (bad.length) { tried.push(`colour ${c} ✕ (vertex ${bad.join(", ")} has it)`); continue; }
          x[k] = c;
          const prev = pid; pid = id;
          steps.push({ t: `Vertex ${k}: colour ${c}`, d: `${tried.length ? tried.join("; ") + ". " : ""}Colour <b>${c}</b> is not used by any coloured neighbour ⇒ x${k} = ${c}.`, cap: `x = (${[1, 2, 3, 4].map(v => x[v] || "_").join(", ")})`, s: [...graph(k), ...growTree(nodes, nodes.length, 430, 70, { nodeW: 60, levelH: 92, r: 19, noEdgeLabels: true }).items] });
          rec(k + 1);
          if (done) return;
          x[k] = 0; pid = prev;
        }
      };
      rec(1);
      steps.push({ t: "Colouring found", d: "<b>x = (1, 2, 1, 3)</b>. Two colours are not enough because 1, 2, 4 form a triangle, so the <b>chromatic number is 3</b>. The tree has up to mⁿ leaves ⇒ <b>O(n·mⁿ)</b>.", cap: "x = (1, 2, 1, 3) · chromatic number 3 · O(n·mⁿ)", s: [...graph(0), ...growTree(nodes, nodes.length, 430, 70, { nodeW: 60, levelH: 92, r: 19, noEdgeLabels: true }).items] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Graph colouring: colour the vertices of G with at most m colours so that no two adjacent vertices share a colour. The smallest such m is the chromatic number. Backtracking assigns colours vertex by vertex. Time O(n·mⁿ).",
    steps: ["Start (x[1..n] = 0).", "mColoring(k): call NextValue(k).", "If x[k] = 0 (no colour left), return.", "If k = n, print x; else call mColoring(k + 1).", "Go back to Step 2 for the next colour.", "NextValue(k): x[k] = (x[k] + 1) mod (m + 1); if 0 return; if a neighbour has the same colour, repeat; else return.", "Stop."],
  },
});

/* ---------- Hamiltonian cycle ---------- */
defAlgo({
  id: "hamiltonian", group: "bt", title: "Hamiltonian Cycle", short: "visit every vertex once, return",
  idea: "Extend the path one vertex at a time (adjacent and unused); at the end the last vertex must connect back to the start; backtrack on dead ends.",
  time: "O(n!)", space: "O(n)", pyq: "1× + Part A",
  variants: [{
    name: "6 vertices",
    build() {
      const W = 1080, H = 520;
      const N = { 1: [70, 230], 2: [180, 70], 6: [380, 70], 5: [490, 230], 3: [380, 390], 4: [180, 390] };
      const E = [[1, 2], [1, 4], [2, 3], [2, 6], [3, 4], [4, 5], [5, 6], [3, 5]];
      const adj = { 1: [2, 4], 2: [1, 3, 6], 3: [2, 4, 5], 4: [1, 3, 5], 5: [3, 4, 6], 6: [2, 5] };
      const has = (u, v) => adj[u].includes(v);
      const nodes = [{ id: "r", parent: null, label: "1", tone: "pivot" }], steps = [];
      const graph = (path, fail, closed) => {
        const s = [];
        const onPath = new Set(); for (let i = 0; i + 1 < path.length; i++) onPath.add([path[i], path[i + 1]].sort().join("-"));
        if (closed) onPath.add([path[path.length - 1], path[0]].sort().join("-"));
        E.forEach(([u, v]) => { const k = [u, v].sort().join("-"); s.push(edge("e" + k, ...N[u], ...N[v], onPath.has(k) ? (closed ? "done" : "active") : fail && fail.includes(k) ? "reject" : "base", { r: 26 })); });
        for (const k in N) s.push(ball("v" + k, ...N[k], k, path.includes(+k) ? (closed ? "done" : (k == path[path.length - 1] ? "active" : "info")) : "base", { r: 26, size: 17, badge: path.includes(+k) ? String(path.indexOf(+k) + 1) : undefined }));
        s.push(label("path", 40, 480, "path: " + path.join(" → ") + (closed ? " → 1" : ""), { size: 15, anchor: "start", fill: "#c9d3f5" }));
        return s;
      };
      const tree = (upto, hl = {}) => growTree(nodes.map(nd => ({ ...nd, tone: hl[nd.id] || nd.tone })), upto, 600, 24, { nodeW: 66, levelH: 82, r: 20 }).items;
      steps.push({ t: "Start at vertex 1", d: "x[1] = 1. Each next vertex must be <b>adjacent</b> to the previous one and <b>not used yet</b>. The last one must have an edge back to 1.", cap: "path: 1", s: [...graph([1]), ...tree(1)] });
      let cnt = 0, found = false;
      const path = [1];
      const rec = (pid) => {
        const last = path[path.length - 1];
        for (let v = 1; v <= 6 && !found; v++) {
          if (path.includes(v) || !has(last, v)) continue;
          if (path.length === 5 && !has(v, 1)) {
            const id = "h" + (cnt++); nodes.push({ id, parent: pid, label: String(v), tone: "reject" });
            steps.push({ t: `Try ${v} last: no edge back to 1`, d: `${v} is the 6th vertex but there is no edge ${v} – 1, so the cycle cannot close ⇒ reject.`, cap: `${path.join(" → ")} → ${v} ✕`, s: [...graph([...path, v], [[v, 1].sort().join("-")]), ...tree(nodes.length, { [id]: "reject" })] });
            continue;
          }
          const id = "h" + (cnt++); nodes.push({ id, parent: pid, label: String(v), tone: "base" });
          path.push(v);
          if (path.length === 6) {
            found = true;
            const pth = {}; let c = id; while (c) { pth[c] = "done"; c = nodes.find(nd => nd.id === c).parent; }
            steps.push({ t: "Cycle found", d: `All 6 vertices used and ${v} – 1 is an edge ⇒ <b>Hamiltonian cycle ${path.join(" – ")} – 1</b>. Worst case tries (n − 1)! orders ⇒ <b>O(n!)</b>.`, cap: `${path.join(" → ")} → 1 · O(n!)`, s: [...graph(path, null, true), ...tree(nodes.length, pth)] });
            return;
          }
          steps.push({ t: `Add vertex ${v}`, d: `${v} is adjacent to ${last} and unused ⇒ x[${path.length}] = ${v}.`, cap: "path: " + path.join(" → "), s: [...graph(path), ...tree(nodes.length, { [id]: "active" })] });
          rec(id);
          if (found) return;
          path.pop();
          steps.push({ t: `Backtrack from ${v}`, d: `No way to continue from ${v} ⇒ remove it and try the next vertex after ${last}.`, cap: "path: " + path.join(" → "), s: [...graph(path), ...tree(nodes.length, { [id]: "reject" })] });
          nodes.find(nd => nd.id === id).tone = "reject";
        }
      };
      rec("r");
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "A Hamiltonian cycle is a round trip in a graph that visits every vertex exactly once and returns to the start. Backtracking chooses x[k] as an unused vertex adjacent to x[k − 1]; for k = n it also needs an edge back to x[1]. Worst case O(n!).",
    steps: ["Start (x[1] = 1; call Hamiltonian(2)).", "Call NextValue(k) for the next possible vertex.", "If x[k] = 0, return (backtrack).", "If k = n, print the cycle; else call Hamiltonian(k + 1).", "Go back to Step 2.", "NextValue: take the next vertex; it must be adjacent to x[k − 1], unused, and for k = n adjacent to x[1].", "Stop."],
  },
});
