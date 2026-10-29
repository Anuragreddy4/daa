/* ===== Unit 3 — Dynamic programming ===== */

/* ---------- Matrix chain ---------- */
defAlgo({
  id: "matrix-chain", group: "dp", title: "Chained Matrix Multiplication", short: "cheapest bracketing",
  idea: "Try every split point k for every chain Aᵢ…Aⱼ, smallest chains first, and keep the cheapest cost in a table.",
  time: "O(n³)", space: "O(n²)", pyq: "2× (m[1,4] = 158 asked)",
  variants: [{
    name: "p = (5, 4, 6, 2, 7)",
    build() {
      const p = [5, 4, 6, 2, 7], n = 4, W = 900, H = 500, cw = 92, ch = 56, gx = 90, gy = 150;
      const m = range(n + 1).map(() => Array(n + 1).fill(null)), s = range(n + 1).map(() => Array(n + 1).fill(null));
      const mats = () => range(n).map(i => block("A" + i, 90 + i * 150, 40, 120, 52, `A${i + 1}\n${p[i]} × ${p[i + 1]}`, "pivot", { size: 14 }));
      const table = (cur, used = []) => {
        const out = [label("mt", gx + 2 * (cw + 8), gy - 30, "m[i, j]  (minimum multiplications)", { size: 13, fill: "#c9d3f5", sans: true })];
        for (let i = 1; i <= n; i++) { out.push(label("ri" + i, gx - 24, gy + (i - 1) * (ch + 8) + ch / 2, "i=" + i, { size: 12, fill: "#9aa6d1" })); out.push(label("cj" + i, gx + (i - 1) * (cw + 8) + cw / 2, gy - 12, "j=" + i, { size: 12, fill: "#9aa6d1" })); }
        for (let i = 1; i <= n; i++) for (let j = i; j <= n; j++) {
          const key = `${i}${j}`;
          let tone = m[i][j] === null ? "ghost" : "base";
          if (used.includes(key)) tone = "info";
          if (cur === key) tone = "active";
          if (i === 1 && j === n && m[i][j] !== null && cur !== key) tone = "done";
          out.push(block("m" + key, gx + (j - 1) * (cw + 8), gy + (i - 1) * (ch + 8), cw, ch, m[i][j] === null ? "" : m[i][j], tone, { size: 18, sub: s[i][j] ? `s = ${s[i][j]}` : "" }));
        }
        return out;
      };
      const steps = [];
      for (let i = 1; i <= n; i++) m[i][i] = 0;
      steps.push({ t: "Chain of 4 matrices", d: "A1 is 5×4, A2 is 4×6, A3 is 6×2, A4 is 2×7. Multiplying (p×q)(q×r) costs p·q·r. A single matrix costs <b>0</b>, so the diagonal m[i, i] = 0.", cap: "m[i, j] = min over k { m[i, k] + m[k+1, j] + p(i−1)·p(k)·p(j) }", s: [...mats(), ...table(null)] });
      for (let L = 2; L <= n; L++) for (let i = 1; i <= n - L + 1; i++) {
        const j = i + L - 1; let best = Infinity, bk = 0; const opts = [];
        for (let k = i; k < j; k++) { const c = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]; opts.push(`k=${k}: ${m[i][k]} + ${m[k + 1][j]} + ${p[i - 1]}·${p[k]}·${p[j]} = ${c}`); if (c < best) { best = c; bk = k; } }
        m[i][j] = best; s[i][j] = bk;
        const used = []; for (let k = i; k < j; k++) { used.push(`${i}${k}`, `${k + 1}${j}`); }
        steps.push({ t: `m[${i}, ${j}] = ${best}`, d: `Chain A${i}…A${j} (length ${L}). Try every split k:<br>${opts.join("<br>")}<br>Smallest = <b>${best}</b> at k = ${bk}.`, cap: opts.join("   |   "), s: [...mats(), ...table(`${i}${j}`, used.filter(u => u[0] !== u[1] || L === 2))] });
      }
      steps.push({ t: "Read the brackets from s", d: "s[1,4] = 3 ⇒ (A1 A2 A3)(A4). s[1,3] = 1 ⇒ (A1)(A2 A3). Optimal order <b>(A1 (A2 A3)) A4</b> with <b>158</b> multiplications. Three nested loops ⇒ <b>O(n³)</b>.", cap: "(A1 (A2 A3)) A4  ·  m[1,4] = 158  ·  O(n³)", s: [...mats(), ...table(null), chip("ans", 680, 440, "(A1 (A2 A3)) A4 = 158", "done", { size: 15, w: 260, h: 36 })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Chained matrix multiplication: given A₁…Aₙ with Aᵢ of size p(i−1) × p(i), find the parenthesization with the minimum number of scalar multiplications. m[i, j] = min over i ≤ k < j of {m[i, k] + m[k+1, j] + p(i−1)·p(k)·p(j)}, m[i, i] = 0. Time O(n³).",
    steps: ["Start.", "Read n and p0 … pn.", "Set m[i, i] = 0 for all i.", "For chain length L = 2 to n and every start i (j = i + L − 1), go to Step 5.", "For every split k = i to j − 1 compute m[i, k] + m[k+1, j] + p(i−1)·p(k)·p(j).", "Store the smallest in m[i, j] and its k in s[i, j].", "Print m[1, n] and the brackets from s.", "Stop."],
  },
});

/* ---------- Floyd (all pairs) ---------- */
defAlgo({
  id: "floyd", group: "dp", title: "All Pairs Shortest Path", short: "Floyd's algorithm",
  idea: "Allow one more vertex k as a middle stop each round: A[i,j] = min(A[i,j], A[i,k] + A[k,j]).",
  time: "O(n³)", space: "O(n²)", pyq: "1× + 2 Part A",
  variants: [{
    name: "3 vertices",
    build() {
      const INF = Infinity, N = { 1: [110, 110], 2: [370, 110], 3: [240, 330] };
      const E = [["1", "2", 4], ["2", "1", 6], ["1", "3", 11], ["3", "1", 3], ["2", "3", 2]];
      const bend = { "1-2": 26, "2-1": 26, "1-3": 22, "3-1": 22 };
      const A = [[0, 4, 11], [6, 0, 2], [3, INF, 0]];
      const W = 880, H = 450, gx = 540, gy = 110, cs = 82;
      const scene = (k, changed = [], route = [], cap) => {
        const s = [];
        E.forEach(([u, v, w]) => s.push(edge(`e${u}-${v}`, ...N[u], ...N[v], route.includes(u + "-" + v) ? "active" : "base", { label: w, arrow: true, bend: bend[u + "-" + v], r: 26 })));
        for (const v in N) s.push(ball("n" + v, ...N[v], v, k == v ? "pivot" : "base", { r: 26, size: 17 }));
        s.push(label("mt", gx + 1.5 * cs, gy - 52, k ? `A${k === "0" ? "⁰" : ["", "¹", "²", "³"][k]}  (via vertices 1…${k})` : "A⁰ = cost matrix", { size: 14, fill: "#c9d3f5", sans: true }));
        for (let i = 0; i < 3; i++) { s.push(label("r" + i, gx - 22, gy + i * (cs - 4) + 34, String(i + 1), { size: 14, fill: "#9aa6d1" })); s.push(label("c" + i, gx + i * cs + 37, gy - 20, String(i + 1), { size: 14, fill: "#9aa6d1" })); }
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          let tone = i === j ? "ghost" : "base";
          if (k && k !== "0" && (i === +k - 1 || j === +k - 1)) tone = "info";
          if (changed.includes(`${i}${j}`)) tone = "active";
          s.push(block(`a${i}${j}`, gx + j * cs, gy + i * (cs - 4), cs - 8, cs - 18, fmt(A[i][j]), tone, { size: 20 }));
        }
        return s;
      };
      const steps = [{ t: "A⁰ — direct edges only", d: "Start with the cost matrix. A⁰[i, j] = cost of edge i → j (∞ if there is no edge, 0 on the diagonal).", cap: "A⁰ = [0 4 11; 6 0 2; 3 ∞ 0]", s: scene("0") }];
      for (let k = 0; k < 3; k++) {
        const changed = [], notes = [], route = [];
        const old = A.map(r => r.slice());
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j && i !== k && j !== k) {
          const via = old[i][k] + old[k][j];
          if (via < old[i][j]) { A[i][j] = via; changed.push(`${i}${j}`); notes.push(`A[${i + 1},${j + 1}] = min(${fmt(old[i][j])}, ${fmt(old[i][k])} + ${fmt(old[k][j])}) = <b>${via}</b>`); route.push(`${i + 1}-${k + 1}`, `${k + 1}-${j + 1}`); }
          else notes.push(`A[${i + 1},${j + 1}] = min(${fmt(old[i][j])}, ${fmt(old[i][k])} + ${fmt(old[k][j])}) = ${fmt(old[i][j])}`);
        }
        steps.push({ t: `k = ${k + 1}: allow vertex ${k + 1} in the middle`, d: `Row ${k + 1} and column ${k + 1} (blue) stay the same. Check every other pair:<br>${notes.join("<br>")}`, cap: notes.map(s => s.replace(/<\/?b>/g, "")).join("   |   "), s: scene(String(k + 1), changed, route) });
      }
      steps.push({ t: "Answer", d: "A³ holds every shortest distance: [0 4 6; 5 0 2; 3 7 0]. For example 2 → 1 is 5 (2 → 3 → 1). Three loops of n ⇒ <b>O(n³)</b>, one n × n matrix ⇒ O(n²) space.", cap: "A³ = [0 4 6; 5 0 2; 3 7 0] · O(n³)", s: scene("3") });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "The all pairs shortest path problem finds the shortest distance between every pair of vertices. Floyd's DP: Aᵏ(i, j) = min{Aᵏ⁻¹(i, j), Aᵏ⁻¹(i, k) + Aᵏ⁻¹(k, j)}, A⁰ = cost matrix, k = 1 … n. Time O(n³).",
    steps: ["Start.", "Read the cost matrix of n vertices.", "Copy it into A (A⁰).", "Repeat Step 5 for k = 1 to n.", "For every pair (i, j): if A[i, k] + A[k, j] < A[i, j], set A[i, j] = A[i, k] + A[k, j].", "Print A.", "Stop."],
  },
});

/* ---------- OBST ---------- */
defAlgo({
  id: "obst", group: "dp", title: "Optimal Binary Search Tree", short: "w, c, r tables",
  idea: "Fill w, c and r for all key ranges, smallest first; the best root of each range is the k with the least c(i,k−1) + c(k,j).",
  time: "O(n³)", space: "O(n²)", pyq: "3× (both instances asked)",
  variants: [
    { name: "(do, if, int, while)", build: () => buildOBST(["do", "if", "int", "while"], [3, 3, 1, 1], [2, 3, 1, 1, 1], 1) },
    { name: "(count, float, if, while) ×20", build: () => buildOBST(["count", "float", "if", "while"], [1, 4, 2, 1], [4, 2, 4, 1, 1], 20) },
  ],
  exam: {
    def: "An optimal binary search tree has the minimum expected search cost for keys a₁ < … < aₙ with probabilities p(i), q(i). w(i,j) = w(i,j−1) + p(j) + q(j); c(i,j) = min over i < k ≤ j {c(i,k−1) + c(k,j)} + w(i,j); r(i,j) = k; w(i,i) = q(i), c(i,i) = 0. Time O(n³).",
    steps: ["Start.", "Read n, p(1..n), q(0..n).", "Set w(i,i) = q(i), c(i,i) = 0, r(i,i) = 0.", "For d = 1 to n and i = 0 to n − d (j = i + d), go to Step 5.", "w(i,j) = w(i,j−1) + p(j) + q(j).", "Find k (i < k ≤ j) with the least c(i,k−1) + c(k,j).", "c(i,j) = that value + w(i,j); r(i,j) = k.", "Print c(0,n); build the tree from r.", "Stop."],
  },
});
function buildOBST(keys, p, q, scale) {
  const n = keys.length, W = 1010, H = 560, cw = 108, ch = 74, gx = 70, gy = 70;
  const w = range(n + 1).map(() => Array(n + 1).fill(null)), c = range(n + 1).map(() => Array(n + 1).fill(null)), r = range(n + 1).map(() => Array(n + 1).fill(null));
  const P = [0, ...p];
  const table = (cur, used = []) => {
    const s = [label("tt", gx + 2.5 * (cw + 6), 22, `rows: j − i   ·   columns: i ${scale > 1 ? "  (all values × 20)" : ""}`, { size: 12.5, fill: "#9aa6d1", sans: true })];
    for (let i = 0; i <= n; i++) s.push(label("ci" + i, gx + i * (cw + 6) + cw / 2, gy - 14, "i=" + i, { size: 12, fill: "#9aa6d1" }));
    for (let d = 0; d <= n; d++) s.push(label("rd" + d, gx - 26, gy + d * (ch + 8) + ch / 2, String(d), { size: 13, fill: "#9aa6d1" }));
    for (let d = 0; d <= n; d++) for (let i = 0; i + d <= n; i++) {
      const j = i + d, k = `${i}${j}`, has = w[i][j] !== null;
      let tone = has ? "base" : "ghost";
      if (used.includes(k)) tone = "info";
      if (cur === k) tone = "active";
      if (i === 0 && j === n && has && cur !== k) tone = "done";
      s.push(block("t" + k, gx + i * (cw + 6), gy + d * (ch + 8), cw, ch, has ? `w${i}${j} = ${w[i][j]}\nc${i}${j} = ${c[i][j]}\nr${i}${j} = ${r[i][j]}` : "", tone, { size: 12.5 }));
    }
    return s;
  };
  const steps = [];
  for (let i = 0; i <= n; i++) { w[i][i] = q[i]; c[i][i] = 0; r[i][i] = 0; }
  steps.push({ t: "Start: j − i = 0", d: `Keys (${keys.join(", ")}). p = (${p.join(", ")}), q = (${q.join(", ")})${scale > 1 ? " — fractions multiplied by 20" : ""}. First row: <b>w(i,i) = q(i)</b>, c(i,i) = 0, r(i,i) = 0.`, cap: "w(i,j) = w(i,j−1) + p(j) + q(j)   ·   c(i,j) = min{c(i,k−1) + c(k,j)} + w(i,j)", s: table(null) });
  for (let d = 1; d <= n; d++) {
    const rowNotes = [];
    for (let i = 0; i + d <= n; i++) {
      const j = i + d;
      w[i][j] = w[i][j - 1] + P[j] + q[j];
      let best = Infinity, bk = 0; const opts = [];
      for (let k = i + 1; k <= j; k++) { const v = c[i][k - 1] + c[k][j]; opts.push(`k=${k}: ${c[i][k - 1]} + ${c[k][j]} = ${v}`); if (v < best) { best = v; bk = k; } }
      c[i][j] = best + w[i][j]; r[i][j] = bk;
      const used = [`${i}${j - 1}`]; for (let k = i + 1; k <= j; k++) used.push(`${i}${k - 1}`, `${k}${j}`);
      const note = `w(${i},${j}) = ${w[i][j - 1]} + ${P[j]} + ${q[j]} = <b>${w[i][j]}</b>; ${opts.join(", ")} ⇒ min ${best}; c(${i},${j}) = ${best} + ${w[i][j]} = <b>${c[i][j]}</b>, r(${i},${j}) = <b>${bk}</b>`;
      if (d === 1) rowNotes.push(note);
      else steps.push({ t: `Cell (${i}, ${j})`, d: note, cap: note.replace(/<\/?b>/g, ""), s: table(`${i}${j}`, used) });
    }
    if (d === 1) steps.push({ t: "Row j − i = 1 (one key each)", d: rowNotes.join("<br>"), cap: "one key: c(i,i+1) = w(i,i+1), root = that key", s: table(null) });
  }
  const root = (i, j) => (i >= j ? null : { id: `${i}${j}`, label: keys[r[i][j] - 1], kids: [root(i, r[i][j] - 1), root(r[i][j], j)].filter(Boolean), i, j });
  const T = root(0, n);
  const lay = layoutTree(T, { nodeW: 74, levelH: 86, pad: 20 });
  const tx = 720, ty = 120;
  const ids = []; walk(T, (nd) => ids.push(nd));
  const treeItems = (count) => {
    const s = [panel("tp", tx - 20, ty - 50, 300, 400, { title: "OPTIMAL TREE", color: "#2ee6a6" })];
    ids.slice(0, count).forEach((nd) => {
      const pp = lay.pos[nd.id];
      walk(T, (x, par) => { if (x === nd && par && ids.indexOf(par) < count) { const a = lay.pos[par.id]; s.push(edge("te" + nd.id, tx + a.x, ty + a.y, tx + pp.x, ty + pp.y, "done", { r: 26, w: 3 })); } });
      s.push(ball("tn" + nd.id, tx + pp.x, ty + pp.y, nd.label, "done", { r: 27, size: nd.label.length > 4 ? 11 : 13, sub: `r(${nd.i},${nd.j})=${r[nd.i][nd.j]}` }));
    });
    return s;
  };
  ids.forEach((nd, idx) => {
    const k = r[nd.i][nd.j];
    steps.push({ t: idx === 0 ? `Root = r(0, ${n}) = ${k} → ${nd.label}` : `Sub-tree (${nd.i}, ${nd.j}) → root ${nd.label}`, d: idx === 0 ? `r(0, ${n}) = ${k}, so the root is a${k} = <b>${nd.label}</b>. Left sub-tree uses keys (0, ${k - 1}), right uses (${k}, ${n}).` : `r(${nd.i}, ${nd.j}) = ${k} ⇒ a${k} = <b>${nd.label}</b> becomes the root of this sub-tree.`, cap: `r(${nd.i},${nd.j}) = ${k} → ${nd.label}`, s: [...table(`${nd.i}${nd.j}`), ...treeItems(idx + 1)] });
  });
  steps.push({ t: "Answer", d: `Minimum cost <b>c(0, ${n}) = ${c[0][n]}${scale > 1 ? ` → ${c[0][n]}/${scale} = ${+(c[0][n] / scale).toFixed(2)}` : ""}</b>, w(0, ${n}) = ${w[0][n]}. Every pair (i, j) tries up to n roots ⇒ <b>O(n³)</b>.`, cap: `c(0,${n}) = ${c[0][n]}${scale > 1 ? " / 20 = " + (c[0][n] / scale).toFixed(2) : ""} · O(n³)`, s: [...table(null), ...treeItems(ids.length)] });
  return { w: W, h: H, steps };
}

/* ---------- 0/1 knapsack (DP) ---------- */
defAlgo({
  id: "knapsack-01", group: "dp", title: "0/1 Knapsack (Dynamic Programming)", short: "table · merging & purging",
  idea: "Each object is taken fully or not at all. fᵢ(y) = max(leave it, take it).",
  time: "O(n·m)", space: "O(n·m)", pyq: "merging & purging asked",
  variants: [
    {
      name: "Table method", build() {
        const w = [2, 3, 4], p = [1, 2, 5], m = 6, n = 3, W = 860, H = 440, cw = 66, ch = 50, gx = 230, gy = 80;
        const V = range(n + 1).map(() => Array(m + 1).fill(null));
        const items = () => range(n).map(i => block("it" + i, 30, gy + (i + 1) * (ch + 8), 150, ch, `obj ${i + 1}: w ${w[i]}, p ${p[i]}`, "pivot", { size: 13 }));
        const tab = (hl = {}) => {
          const s = [label("yh", gx - 30, gy - 22, "y →", { size: 12, fill: "#9aa6d1" })];
          for (let y = 0; y <= m; y++) s.push(label("cy" + y, gx + y * (cw + 6) + cw / 2, gy - 22, String(y), { size: 13, fill: "#9aa6d1" }));
          for (let i = 0; i <= n; i++) { s.push(label("ri" + i, gx - 22, gy + i * (ch + 8) + ch / 2, "i=" + i, { size: 12, fill: "#9aa6d1" })); for (let y = 0; y <= m; y++) s.push(block(`v${i}-${y}`, gx + y * (cw + 6), gy + i * (ch + 8), cw, ch, V[i][y] === null ? "" : V[i][y], hl[`${i}-${y}`] || (V[i][y] === null ? "ghost" : "base"), { size: 17 })); }
          return s;
        };
        const steps = [];
        for (let y = 0; y <= m; y++) V[0][y] = 0;
        steps.push({ t: "Row 0", d: "No objects ⇒ profit 0 for every capacity y. Objects: (w, p) = (2, 1), (3, 2), (4, 5); capacity m = 6.", cap: "V[i, y] = max(V[i−1, y], V[i−1, y − w(i)] + p(i))", s: [...items(), ...tab()] });
        for (let i = 1; i <= n; i++) {
          for (let y = 0; y <= m; y++) V[i][y] = w[i - 1] <= y ? Math.max(V[i - 1][y], V[i - 1][y - w[i - 1]] + p[i - 1]) : V[i - 1][y];
          const y = m, a = V[i - 1][y], b = w[i - 1] <= y ? V[i - 1][y - w[i - 1]] + p[i - 1] : null;
          const hl = {}; for (let yy = 0; yy <= m; yy++) hl[`${i}-${yy}`] = "info"; hl[`${i}-${m}`] = "active"; hl[`${i - 1}-${m}`] = "pivot"; if (b !== null) hl[`${i - 1}-${m - w[i - 1]}`] = "pivot";
          steps.push({ t: `Row ${i}: object ${i} (w ${w[i - 1]}, p ${p[i - 1]})`, d: `For each y: leave object ${i} (value above) or take it (value at y − ${w[i - 1]} plus ${p[i - 1]}). Example y = ${m}: max(${a}, ${b === null ? "—" : `${V[i - 1][m - w[i - 1]]} + ${p[i - 1]} = ${b}`}) = <b>${V[i][m]}</b>.`, cap: `V[${i}, ${m}] = max(${a}, ${b === null ? "—" : b}) = ${V[i][m]}`, s: [...items(), ...tab(hl)] });
        }
        let y = m; const x = [];
        const path = {};
        for (let i = n; i >= 1; i--) {
          const take = V[i][y] !== V[i - 1][y];
          path[`${i}-${y}`] = take ? "done" : "reject";
          steps.push({ t: `Trace back: object ${i}`, d: take ? `V[${i}, ${y}] = ${V[i][y]} ≠ V[${i - 1}, ${y}] = ${V[i - 1][y]} ⇒ object ${i} <b>was taken</b>: x${i} = 1, y = ${y} − ${w[i - 1]} = ${y - w[i - 1]}.` : `V[${i}, ${y}] = V[${i - 1}, ${y}] = ${V[i][y]} ⇒ object ${i} <b>not taken</b>: x${i} = 0.`, cap: take ? `x${i} = 1` : `x${i} = 0`, s: [...items(), ...tab({ ...path })] });
          x[i - 1] = take ? 1 : 0; if (take) y -= w[i - 1];
        }
        steps.push({ t: "Answer", d: `<b>x = (${x.join(", ")})</b>, maximum profit = <b>${V[n][m]}</b>. The table has (n + 1)(m + 1) cells ⇒ <b>O(n·m)</b>.`, cap: `x = (${x.join(", ")}) · profit = ${V[n][m]} · O(n·m)`, s: [...items(), ...tab({ ...path, [`${n}-${m}`]: "done" })] });
        return { w: W, h: H, steps };
      }
    },
    {
      name: "Sets — merging & purging", build() {
        const w = [2, 3, 4], p = [1, 2, 5], m = 6, W = 900, H = 470, steps = [];
        const row = (key, y, title, pairs, tones = {}) => [label(key + "t", 30, y + 18, title, { size: 15, anchor: "start", fill: "#c9d3f5" }), ...pairs.map((pr, i) => block(`${key}${pr[0]}_${pr[1]}`, 130 + i * 92, y, 82, 38, `(${pr[0]}, ${pr[1]})`, tones[pr.join(",")] || "base", { size: 14, depth: 4 }))];
        const S0 = [[0, 0]], S1 = [[0, 0], [1, 2]], S2 = [[0, 0], [1, 2], [2, 3], [3, 5]];
        const S31 = [[5, 4], [6, 6], [7, 7], [8, 9]], merged = [[0, 0], [1, 2], [2, 3], [3, 5], [5, 4], [6, 6], [7, 7], [8, 9]], S3 = [[0, 0], [1, 2], [2, 3], [5, 4], [6, 6]];
        const note = chip("rule", W / 2, 440, "purge (Pj, Wj) if Pj ≤ Pk and Wj ≥ Wk  ·  drop W > m", "pivot", { size: 12.5 });
        steps.push({ t: "S⁰", d: "Pairs are (profit P, weight W). Start with S⁰ = {(0, 0)}: nothing taken.", cap: "S⁰ = {(0,0)}", s: [...row("a", 40, "S⁰", S0), note] });
        steps.push({ t: "S¹ = S⁰ ∪ (S⁰ + (1, 2))", d: "Add object 1 (p 1, w 2) to every pair: S¹₁ = {(1, 2)}. Merge: S¹ = {(0,0), (1,2)}.", cap: "S¹ = {(0,0), (1,2)}", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1, { "1,2": "info" }), note] });
        steps.push({ t: "S² = S¹ ∪ (S¹ + (2, 3))", d: "Add object 2 (p 2, w 3): S¹₂ = {(2,3), (3,5)}. Merge: S² = {(0,0), (1,2), (2,3), (3,5)}.", cap: "S² = {(0,0), (1,2), (2,3), (3,5)}", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1), ...row("c", 160, "S²", S2, { "2,3": "info", "3,5": "info" }), note] });
        steps.push({ t: "Merge with object 3", d: "Add object 3 (p 5, w 4): S¹₃ = {(5,4), (6,6), (7,7), (8,9)}. Merge everything (8 pairs).", cap: "merge: (0,0) (1,2) (2,3) (3,5) (5,4) (6,6) (7,7) (8,9)", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1), ...row("c", 160, "S²", S2), ...row("d", 240, "merge", merged, { "5,4": "info", "6,6": "info", "7,7": "info", "8,9": "info" }), note] });
        steps.push({ t: "Purge", d: "<b>(3, 5)</b> is dominated by (5, 4): less profit and more weight ⇒ delete. <b>(7, 7)</b> and <b>(8, 9)</b> weigh more than m = 6 ⇒ delete.", cap: "delete (3,5), (7,7), (8,9)", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1), ...row("c", 160, "S²", S2), ...row("d", 240, "merge", merged, { "3,5": "reject", "7,7": "reject", "8,9": "reject" }), note] });
        steps.push({ t: "S³ and the best pair", d: "S³ = {(0,0), (1,2), (2,3), (5,4), (6,6)}. Best pair = <b>(6, 6)</b> ⇒ profit 6.", cap: "S³ = {(0,0), (1,2), (2,3), (5,4), (6,6)} · best (6,6)", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1), ...row("c", 160, "S²", S2), ...row("e", 320, "S³", S3, { "6,6": "done" }), note] });
        steps.push({ t: "Trace back", d: "(6,6) ∉ S² ⇒ x₃ = 1; remove object 3 ⇒ (1, 2). (1,2) ∈ S² and ∈ S¹ ⇒ x₂ = 0. (1,2) ∉ S⁰ ⇒ x₁ = 1. <b>x = (1, 0, 1), profit 6.</b>", cap: "x = (1, 0, 1) · profit = 6", s: [...row("a", 40, "S⁰", S0), ...row("b", 100, "S¹", S1, { "1,2": "done" }), ...row("c", 160, "S²", S2, { "1,2": "done" }), ...row("e", 320, "S³", S3, { "6,6": "done" }), note] });
        return { w: W, h: H, steps };
      }
    },
  ],
  exam: {
    def: "0/1 knapsack: choose xᵢ ∈ {0, 1} to maximise Σpᵢxᵢ subject to Σwᵢxᵢ ≤ m. DP: fᵢ(y) = max{fᵢ₋₁(y), fᵢ₋₁(y − wᵢ) + pᵢ}, f₀(y) = 0. Purging rule: delete (Pj, Wj) if Pj ≤ Pk and Wj ≥ Wk.",
    steps: ["Start.", "Read n, m, p[1..n], w[1..n].", "Set V[0, y] = 0 for y = 0..m.", "For each i = 1..n and y = 0..m, go to Step 5.", "If w[i] ≤ y, V[i, y] = max(V[i−1, y], V[i−1, y − w[i]] + p[i]); else V[i, y] = V[i−1, y].", "V[n, m] is the answer; trace back: if V[i, y] ≠ V[i−1, y], x[i] = 1 and y = y − w[i].", "Stop."],
  },
});

/* ---------- Reliability design ---------- */
defAlgo({
  id: "reliability", group: "dp", title: "Reliability Design", short: "parallel copies in series",
  idea: "Put mᵢ copies of device i in parallel so the series system is as reliable as possible within the budget C.",
  time: "pseudo-polynomial", space: "—", pyq: "2× + Part A",
  variants: [{
    name: "c = (30, 15, 20), r = (0.9, 0.8, 0.5), C = 105",
    build() {
      const W = 960, H = 520, steps = [];
      const sys = (ms, tones = ["base", "base", "base"]) => {
        const s = []; const x0 = 60;
        [0, 1, 2].forEach(st => {
          const x = x0 + st * 300, m = ms[st];
          for (let k = 0; k < 3; k++) {
            if (k < m) s.push(block(`dv${st}-${k}`, x + 40, 40 + k * 46, 110, 38, `D${st + 1}`, tones[st] === "done" ? "done" : "info", { size: 14, depth: 4 }));
          }
          s.push(label(`st${st}`, x + 95, 190, `stage ${st + 1}: m${st + 1} = ${m}`, { size: 13, fill: "#c9d3f5", sans: true }));
          if (st < 2) s.push({ k: "wire" + st, x: 0, y: 0, z: 0, svg: `<path d="M${x + 160},100 H${x + 330}" stroke="#4a5c97" stroke-width="2.5" stroke-dasharray="5 5"/>` });
        });
        return s;
      };
      const sets = (rows) => rows.flatMap(([key, title, pairs], ri) => [label(key + "t", 30, 250 + ri * 62 + 18, title, { size: 14, anchor: "start", fill: "#c9d3f5" }), ...pairs.map((pr, i) => block(`${key}-${pr[0]}-${pr[1]}`, 110 + i * 132, 250 + ri * 62, 124, 38, `(${pr[0]}, ${pr[1]})`, pr[2] || "base", { size: 13, depth: 4 }))]);
      steps.push({ t: "The problem", d: "Three device types in series: c = (30, 15, 20), r = (0.9, 0.8, 0.5), budget C = 105. Stage reliability with m copies: <b>φ(m) = 1 − (1 − r)ᵐ</b>.", cap: "maximise Π φᵢ(mᵢ)  subject to  Σ cᵢ·mᵢ ≤ 105", s: [...sys([1, 1, 1])] });
      steps.push({ t: "Upper bounds uᵢ", d: "uᵢ = ⌊(C + cᵢ − Σc)/cᵢ⌋ with Σc = 65: u₁ = ⌊70/30⌋ = <b>2</b>, u₂ = ⌊55/15⌋ = <b>3</b>, u₃ = ⌊60/20⌋ = <b>3</b>.", cap: "u = (2, 3, 3)", s: [...sys([2, 3, 3])] });
      steps.push({ t: "Stage 1", d: "m₁ = 1: (0.9, 30); m₁ = 2: (0.99, 60). Pairs are (reliability, cost).", cap: "S¹ = {(0.9, 30), (0.99, 60)}", s: [...sys([1, 1, 1], ["done", "base", "base"]), ...sets([["s1", "S¹", [[0.9, 30], [0.99, 60]]]])] });
      steps.push({ t: "Stage 2 candidates", d: "Multiply by φ₂(m) = 0.8, 0.96, 0.992 and add 15m. Cost must stay ≤ 85 (stage 3 needs 20). (0.792, 75) is dominated by (0.864, 60) ⇒ purge. Costs 90 and 105 are too high.", cap: "keep (0.72,45) (0.864,60) (0.8928,75)", s: [...sys([1, 2, 1], ["done", "done", "base"]), ...sets([["s1", "S¹", [[0.9, 30], [0.99, 60]]], ["c2", "cand", [[0.72, 45], [0.792, 75, "reject"], [0.864, 60], [0.9504, 90, "reject"], [0.8928, 75], [0.982, 105, "reject"]]]])] });
      steps.push({ t: "S²", d: "S² = {(0.72, 45), (0.864, 60), (0.8928, 75)}.", cap: "S² = {(0.72,45), (0.864,60), (0.8928,75)}", s: [...sys([1, 2, 1], ["done", "done", "base"]), ...sets([["s1", "S¹", [[0.9, 30], [0.99, 60]]], ["s2", "S²", [[0.72, 45], [0.864, 60], [0.8928, 75]]]])] });
      steps.push({ t: "Stage 3 candidates", d: "Multiply by φ₃(m) = 0.5, 0.75, 0.875 and add 20m (cost ≤ 105). Purge (0.4464, 95) (worse than (0.54, 85)) and (0.63, 105) (worse than (0.648, 100)).", cap: "candidates (0.36,65) (0.432,80) (0.4464,95)✗ (0.54,85) (0.648,100) (0.63,105)✗", s: [...sys([1, 2, 2], ["done", "done", "done"]), ...sets([["s2", "S²", [[0.72, 45], [0.864, 60], [0.8928, 75]]], ["c3", "cand", [[0.36, 65], [0.432, 80], [0.4464, 95, "reject"], [0.54, 85], [0.648, 100], [0.63, 105, "reject"]]]])] });
      steps.push({ t: "Best design", d: "S³ = {(0.36,65), (0.432,80), (0.54,85), (0.648,100)}. Best = <b>(0.648, 100)</b>: from m₃ = 2 on (0.864, 60), which came from m₂ = 2 on (0.9, 30) ⇒ m₁ = 1. <b>Design m = (1, 2, 2), reliability 0.648, cost 100.</b>", cap: "m = (1, 2, 2) · R = 0.648 · cost = 100", s: [...sys([1, 2, 2], ["done", "done", "done"]), ...sets([["s3", "S³", [[0.36, 65], [0.432, 80], [0.54, 85], [0.648, 100, "done"]]]])] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Reliability design: n devices in series, mᵢ copies of device i (reliability rᵢ, cost cᵢ) in parallel; maximise Π φᵢ(mᵢ), φᵢ(mᵢ) = 1 − (1 − rᵢ)^mᵢ, subject to Σcᵢmᵢ ≤ C. Solved by DP with sets of (reliability, cost) pairs and dominance purging.",
    steps: ["Start.", "Read n, rᵢ, cᵢ and budget C.", "Find uᵢ = ⌊(C + cᵢ − Σc)/cᵢ⌋ for each stage.", "S⁰ = {(1, 0)}.", "For each stage i and mᵢ = 1..uᵢ, multiply reliabilities by φᵢ(mᵢ) and add cᵢ·mᵢ to costs.", "Merge into Sⁱ; delete dominated pairs and pairs that leave too little money.", "Answer = pair with the highest reliability in Sⁿ; trace back the mᵢ.", "Stop."],
  },
});

/* ---------- TSP (DP) ---------- */
defAlgo({
  id: "tsp-dp", group: "dp", title: "Travelling Salesperson (DP)", short: "g(i, S)",
  idea: "g(i, S) = cheapest way to start at city i, visit every city in S once and return to city 1.",
  time: "O(n²·2ⁿ)", space: "O(n·2ⁿ)", pyq: "4×",
  variants: [
    { name: "Textbook matrix → 35", build: () => buildTSP([[0, 10, 15, 20], [5, 0, 9, 10], [6, 13, 0, 12], [8, 8, 9, 0]]) },
    { name: "PYQ Dec 22 → 42", build: () => buildTSP([[Infinity, 10, 14, 7], [23, Infinity, 13, 6], [4, 12, Infinity, 20], [10, 31, 22, Infinity]]) },
  ],
  exam: {
    def: "Travelling salesperson: find a minimum-cost tour that starts at a city, visits every other city exactly once and returns. DP: g(i, S) = min over j ∈ S {c(i, j) + g(j, S − {j})}, g(i, ∅) = c(i, 1); answer g(1, V − {1}). Time O(n²2ⁿ).",
    steps: ["Start.", "Read n and the cost matrix c.", "For each city i ≠ 1, g(i, ∅) = c(i, 1).", "For |S| = 1 to n − 2, for each S and i ∉ S, go to Step 5.", "g(i, S) = min over j ∈ S of c(i, j) + g(j, S − {j}); remember j.", "g(1, {2..n}) = min over k of c(1, k) + g(k, {2..n} − {k}).", "Follow the remembered j's to write the tour.", "Stop."],
  },
});
function buildTSP(c) {
  const W = 1040, H = 560, cs = 62, mx = 40, my = 90, steps = [];
  const g = {}, nx = {};
  const key = (i, S) => `${i}|${S.join("")}`;
  const name = (i, S) => `g(${i},${S.length ? "{" + S.join(",") + "}" : "∅"})`;
  const mat = (hl = {}) => {
    const s = [label("mt", mx + 2 * cs + 8, my - 44, "cost matrix c(i, j)", { size: 13, fill: "#c9d3f5", sans: true })];
    for (let i = 0; i < 4; i++) { s.push(label("mr" + i, mx - 14, my + i * cs + 26, String(i + 1), { size: 13, fill: "#9aa6d1" })); s.push(label("mc" + i, mx + i * cs + 27, my - 16, String(i + 1), { size: 13, fill: "#9aa6d1" })); }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s.push(block(`c${i}${j}`, mx + j * cs, my + i * cs, cs - 8, cs - 10, fmt(c[i][j]), hl[`${i}${j}`] || (i === j ? "ghost" : "base"), { size: 16, depth: 3 }));
    return s;
  };
  const cards = [];
  const levelY = [70, 170, 290, 420], colX = 320;
  const addCard = (lv, idx, total, text, tone = "base") => { const wd = lv === 1 ? 108 : lv === 0 ? 150 : lv === 2 ? 230 : 300; const gap = (W - colX - 20 - total * wd) / Math.max(1, total); cards.push({ k: `g${lv}-${idx}`, lv, x: colX + idx * (wd + gap) + gap / 2, y: levelY[lv], wd, text, tone }); };
  const cardItems = (hlKeys = []) => cards.map(cd => block(cd.k, cd.x, cd.y, cd.wd, lv2h(cd.lv), cd.text, hlKeys.includes(cd.k) ? "active" : cd.tone, { size: cd.lv === 1 ? 12 : 12.5 }));
  const lv2h = (lv) => (lv === 1 ? 56 : 52);
  const lvlLabel = () => ["|S| = 0", "|S| = 1", "|S| = 2", "|S| = 3"].map((t, i) => label("ll" + i, colX - 8, levelY[i] + 26, t, { size: 12, fill: "#9aa6d1", anchor: "end" }));
  steps.push({ t: "Cost matrix", d: "Start city 1. <b>g(i, S)</b> = cost of the best path from i through all cities of S, ending at 1. Compute small sets first.", cap: "g(i, S) = min over j ∈ S { c(i, j) + g(j, S − {j}) }", s: [...mat(), ...lvlLabel()] });
  // |S| = 0
  [2, 3, 4].forEach((i, idx) => { g[key(i, [])] = c[i - 1][0]; addCard(0, idx, 3, `${name(i, [])} = ${fmt(c[i - 1][0])}`, "info"); });
  steps.push({ t: "|S| = 0: go straight home", d: `g(i, ∅) = c(i, 1): g(2,∅) = ${fmt(c[1][0])}, g(3,∅) = ${fmt(c[2][0])}, g(4,∅) = ${fmt(c[3][0])}.`, cap: "g(i, ∅) = c(i, 1)", s: [...mat({ "10": "active", "20": "active", "30": "active" }), ...lvlLabel(), ...cardItems(["g0-0", "g0-1", "g0-2"])] });
  // |S| = 1
  const one = []; [2, 3, 4].forEach(i => [2, 3, 4].filter(j => j !== i).forEach(j => one.push([i, j])));
  const l1 = [];
  one.forEach(([i, j], idx) => { const v = c[i - 1][j - 1] + g[key(j, [])]; g[key(i, [j])] = v; nx[key(i, [j])] = j; addCard(1, idx, 6, `${name(i, [j])}\n${fmt(c[i - 1][j - 1])}+${fmt(g[key(j, [])])} = ${fmt(v)}`, "base"); l1.push(`${name(i, [j])} = ${fmt(v)}`); });
  steps.push({ t: "|S| = 1", d: `g(i, {j}) = c(i, j) + g(j, ∅):<br>${l1.join(", ")}.`, cap: l1.join("  ·  "), s: [...mat(), ...lvlLabel(), ...cardItems(range(6).map(i => "g1-" + i))] });
  // |S| = 2
  const two = [[2, [3, 4]], [3, [2, 4]], [4, [2, 3]]];
  two.forEach(([i, S], idx) => {
    const opts = S.map(j => [j, c[i - 1][j - 1] + g[key(j, S.filter(x => x !== j))]]);
    const best = opts.reduce((a, b) => (b[1] < a[1] ? b : a));
    g[key(i, S)] = best[1]; nx[key(i, S)] = best[0];
    addCard(2, idx, 3, `${name(i, S)} = min(${opts.map(o => fmt(o[1])).join(", ")})\n= ${fmt(best[1])}  (next ${best[0]})`, "base");
    const hl = {}; S.forEach(j => hl[`${i - 1}${j - 1}`] = "active");
    steps.push({ t: `${name(i, S)}`, d: `${opts.map(([j, v]) => `via ${j}: c(${i},${j}) + g(${j},{${S.filter(x => x !== j)}}) = ${fmt(c[i - 1][j - 1])} + ${fmt(g[key(j, S.filter(x => x !== j))])} = ${fmt(v)}`).join("<br>")}<br>⇒ <b>${fmt(best[1])}</b> (next city ${best[0]}).`, cap: `${name(i, S)} = ${fmt(best[1])}`, s: [...mat(hl), ...lvlLabel(), ...cardItems(["g2-" + idx])] });
  });
  // |S| = 3
  const S = [2, 3, 4];
  const opts = S.map(k => [k, c[0][k - 1] + g[key(k, S.filter(x => x !== k))]]);
  const bestV = Math.min(...opts.map(o => o[1])), best = opts.find(o => o[1] === bestV);
  addCard(3, 0, 1, `g(1,{2,3,4}) = min(${opts.map(o => fmt(o[1])).join(", ")}) = ${fmt(bestV)}`, "done");
  steps.push({ t: "g(1, {2, 3, 4})", d: `${opts.map(([k, v]) => `via ${k}: ${fmt(c[0][k - 1])} + ${fmt(g[key(k, S.filter(x => x !== k))])} = ${fmt(v)}`).join("<br>")}<br>⇒ minimum tour cost = <b>${fmt(bestV)}</b>.`, cap: `g(1,{2,3,4}) = ${fmt(bestV)}`, s: [...mat({ "01": "active", "02": "active", "03": "active" }), ...lvlLabel(), ...cardItems(["g3-0"])] });
  // tour
  const tour = [1]; let cur = best[0], rest = S.filter(x => x !== cur); tour.push(cur);
  while (rest.length) { const nn = nx[key(cur, rest)]; tour.push(nn); rest = rest.filter(x => x !== nn); cur = nn; }
  tour.push(1);
  const hl = {}; for (let i = 0; i < tour.length - 1; i++) hl[`${tour[i] - 1}${tour[i + 1] - 1}`] = "done";
  steps.push({ t: "Trace the tour", d: `Follow the remembered next cities: <b>${tour.join(" → ")}</b>, cost ${tour.slice(0, -1).map((v, i) => fmt(c[v - 1][tour[i + 1] - 1])).join(" + ")} = <b>${fmt(bestV)}</b>. About n·2ⁿ values × O(n) each ⇒ <b>O(n²·2ⁿ)</b>.`, cap: `${tour.join(" → ")} = ${fmt(bestV)} · O(n²2ⁿ)`, s: [...mat(hl), ...lvlLabel(), ...cardItems(), chip("tour", 160, 400, tour.join(" → "), "done", { size: 15, w: 240, h: 36 })] });
  return { w: W, h: H, steps };
}
