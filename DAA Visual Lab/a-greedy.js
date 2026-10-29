/* ===== Unit 2 — Greedy method ===== */

/* ---------- Fractional knapsack ---------- */
defAlgo({
  id: "knapsack-greedy", group: "greedy", title: "Knapsack (Greedy)", short: "best profit per kg first",
  idea: "Sort objects by profit per unit weight (p/w). Fill whole objects while they fit, then a fraction of the next one.",
  time: "O(n log n)", space: "O(n)", pyq: "4× (n = 7, m = 15 asked twice)",
  variants: [{
    name: "n = 7, m = 15",
    build() {
      const p = [10, 5, 15, 7, 6, 18, 3], w = [2, 3, 5, 7, 1, 4, 1], m = 15, n = 7;
      const r = p.map((v, i) => v / w[i]);
      const order = range(n).sort((a, b) => r[b] - r[a]);
      const cwid = 98, x0 = 30, W = x0 * 2 + n * (cwid + 8), H = 420, unit = 44, bx = (W - m * unit) / 2, by = 270;
      const steps = [];
      const card = (i, slot, tone, showR) => block("o" + i, x0 + slot * (cwid + 8), 56, cwid, 86, `obj ${i + 1}\np ${p[i]} · w ${w[i]}\n${showR ? "p/w " + (+r[i].toFixed(2)) : " "}`, tone, { size: 13.5 });
      const bag = (segs, profit, left) => {
        const s = [panel("bag", bx - 6, by - 8, m * unit + 12, 70, { color: "#ffc94a", so: 0.5, op: 0.4, title: "" }), label("bagt", bx, by - 24, `knapsack  m = ${m}`, { size: 13, anchor: "start", fill: "#ffd978", sans: true })];
        let x = bx;
        segs.forEach(([i, wt, frac]) => { const wd = wt * unit - 4; s.push(block("seg" + i, x, by, wd, 52, wd < 96 ? `${i + 1}${frac ? "\n" + frac : ""}` : `obj ${i + 1}${frac ? " (" + frac + ")" : ""}`, frac ? "pink" : "done", { size: 12.5, sub: `w ${wt}` })); x += wt * unit; });
        s.push(chip("profit", W - 120, 380, `profit = ${+profit.toFixed(2)}`, "active", { w: 170 }));
        s.push(chip("left", 120, 380, `capacity left = ${+left.toFixed(2)}`, "info", { w: 190 }));
        return s;
      };
      steps.push({ t: "The objects", d: "7 objects with profit p and weight w. The bag holds <b>m = 15</b>. We may take a <b>fraction</b> of an object.", cap: "p = (10, 5, 15, 7, 6, 18, 3) · w = (2, 3, 5, 7, 1, 4, 1)", s: [...range(n).map(i => card(i, i, "base", false)), ...bag([], 0, m)] });
      steps.push({ t: "Find p / w", d: "Profit per unit weight tells how valuable each kg is: 5, 1.67, 3, 1, <b>6</b>, 4.5, 3.", cap: "p/w = (5, 1.67, 3, 1, 6, 4.5, 3)", s: [...range(n).map(i => card(i, i, "base", true)), ...bag([], 0, m)] });
      const pos = {}; order.forEach((i, k) => pos[i] = k);
      steps.push({ t: "Sort by p / w (largest first)", d: "Greedy rule: always take the object with the highest p/w next. Order: <b>5, 1, 6, 3, 7, 2, 4</b>.", cap: "order: obj5 (6) → obj1 (5) → obj6 (4.5) → obj3 (3) → obj7 (3) → obj2 (1.67) → obj4 (1)", s: [...range(n).map(i => card(i, pos[i], "base", true)), ...bag([], 0, m)] });
      let left = m, profit = 0; const segs = [], taken = {};
      for (const i of order) {
        if (left <= 0) {
          steps.push({ t: `obj ${i + 1}: bag is full`, d: `Capacity left is 0, so obj ${i + 1} is not taken (x${i + 1} = 0).`, cap: `x${i + 1} = 0`, s: [...range(n).map(j => card(j, pos[j], j === i ? "reject" : taken[j] ? (taken[j] < 1 ? "pink" : "done") : "base", true)), ...bag(segs, profit, left)] });
          continue;
        }
        if (w[i] <= left) {
          left -= w[i]; profit += p[i]; taken[i] = 1; segs.push([i, w[i], null]);
          steps.push({ t: `Take obj ${i + 1} fully`, d: `w = ${w[i]} fits (left ${left + w[i]}). Take all of it: x${i + 1} = 1, profit + ${p[i]}. Capacity left = <b>${left}</b>.`, cap: `x${i + 1} = 1 · profit = ${+profit.toFixed(2)} · left = ${left}`, s: [...range(n).map(j => card(j, pos[j], j === i ? "active" : taken[j] ? "done" : "base", true)), ...bag(segs, profit, left)] });
        } else {
          const f = left / w[i]; profit += p[i] * f; taken[i] = f; segs.push([i, left, `${left}/${w[i]}`]);
          steps.push({ t: `Take ${left}/${w[i]} of obj ${i + 1}`, d: `Only ${left} units left but w = ${w[i]}. Take the fraction <b>x${i + 1} = ${left}/${w[i]}</b>; profit + ${p[i]} × ${left}/${w[i]} = ${+(p[i] * f).toFixed(2)}. The bag is now full.`, cap: `x${i + 1} = ${left}/${w[i]} · profit = ${+profit.toFixed(2)}`, s: [...range(n).map(j => card(j, pos[j], j === i ? "pink" : taken[j] ? (taken[j] < 1 ? "pink" : "done") : "base", true)), ...bag(segs, profit, 0)] });
          left = 0;
        }
      }
      steps.push({ t: "Answer", d: "<b>x = (1, 2/3, 1, 0, 1, 1, 1)</b>, maximum profit = 6 + 10 + 18 + 15 + 3 + 3.33 = <b>55.33</b>. Sorting takes O(n log n), filling O(n).", cap: "x = (1, 2/3, 1, 0, 1, 1, 1) · profit = 55.33 · O(n log n)", s: [...range(n).map(j => card(j, pos[j], taken[j] ? (taken[j] < 1 ? "pink" : "done") : "dim", true)), ...bag(segs, profit, 0)] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Knapsack problem: given n objects with weights wᵢ, profits pᵢ and a knapsack of capacity m, find xᵢ (0 ≤ xᵢ ≤ 1) to maximise Σpᵢxᵢ subject to Σwᵢxᵢ ≤ m. Greedy takes objects in decreasing order of pᵢ/wᵢ. Time O(n log n).",
    steps: ["Start.", "Read n, m, profits p[1..n] and weights w[1..n].", "Find p[i]/w[i] for each object and sort in decreasing order of p/w.", "Set x[i] = 0 for all i and U = m.", "Take objects in order: if w[i] ≤ U, set x[i] = 1 and U = U − w[i]; else go to Step 6.", "Set x[i] = U / w[i] for that object (bag full).", "Profit = Σ p[i]·x[i]; print x and profit.", "Stop."],
  },
});

/* ---------- Job sequencing ---------- */
function buildJS(jobs, title) {
  // jobs: [{name, d, p}]
  const n = jobs.length, b = Math.max(...jobs.map(j => j.d));
  const cw = 92, x0 = 30, W = Math.max(x0 * 2 + n * (cw + 10), 120 + b * 110 + 60), H = 400;
  const sorted = range(n).sort((a, c) => jobs[c].p - jobs[a].p);
  const sx = (k) => (W - b * 110) / 2 + k * 110;
  const slot = Array(b).fill(null);
  const where = {}; const state = {}; const steps = [];
  const scene = (placedPos, scan = [], note) => {
    const s = [];
    for (let k = 0; k < b; k++) s.push(block("slot" + k, sx(k), 250, 96, 70, slot[k] === null ? "free" : "", scan.includes(k) ? (slot[k] === null ? "done" : "reject") : "ghost", { top: `slot ${k + 1}  (${k}–${k + 1})`, size: 13, depth: 3 }));
    range(n).forEach(i => {
      const j = jobs[i]; const st = state[i] || "base";
      let x, y;
      if (where[i] !== undefined && where[i] >= 0) { x = sx(where[i]) + 2; y = 252; }
      else { x = x0 + placedPos[i] * (cw + 10); y = 60; }
      s.push(block("j" + i, x, y, cw, 66, `${j.name}\np ${j.p} · d ${j.d}`, st, { size: 14 }));
    });
    if (note) s.push(chip("note", W / 2, 372, note, "base", { size: 13 }));
    return s;
  };
  const given = {}; range(n).forEach(i => given[i] = i);
  const sp = {}; sorted.forEach((i, k) => sp[i] = k);
  steps.push({ t: "The jobs", d: `${n} jobs, each takes 1 unit of time. Profit is earned only if the job finishes <b>on or before its deadline</b>.`, cap: jobs.map(j => `${j.name}(d ${j.d}, p ${j.p})`).join("  "), s: scene(given, [], "one machine · one job per time slot") });
  steps.push({ t: "Sort by profit", d: `Greedy rule: consider the most profitable job first. Order: <b>${sorted.map(i => jobs[i].name).join(", ")}</b>. Make ${b} time slots (largest deadline = ${b}).`, cap: `order: ${sorted.map(i => jobs[i].name + " (" + jobs[i].p + ")").join(" → ")}`, s: scene(sp, [], `${b} slots, all free`) });
  let total = 0;
  for (const i of sorted) {
    const j = jobs[i]; const scan = [];
    let put = -1;
    for (let k = Math.min(b, j.d) - 1; k >= 0; k--) { scan.push(k); if (slot[k] === null) { put = k; break; } }
    state[i] = "active";
    if (put >= 0) {
      slot[put] = i; where[i] = put; state[i] = "done"; total += j.p;
      steps.push({ t: `${j.name}: put in slot ${put + 1}`, d: `Deadline ${j.d} ⇒ check slot ${scan.map(k => k + 1).join(", then ")} (latest first). Slot ${put + 1} is free ⇒ <b>accept ${j.name}</b>. Profit so far = ${total}.`, cap: `${j.name} → slot ${put + 1} · total profit = ${total}`, s: scene(sp, scan, `${j.name} accepted`) });
    } else {
      state[i] = "reject"; where[i] = -1;
      steps.push({ t: `${j.name}: rejected`, d: `Deadline ${j.d} ⇒ slots ${scan.map(k => k + 1).join(", ")} are all full ⇒ <b>reject ${j.name}</b>.`, cap: `${j.name} rejected (no free slot ≤ ${j.d})`, s: scene(sp, scan, `${j.name} rejected`) });
    }
  }
  const seq = slot.filter(v => v !== null).map(i => jobs[i].name).join(" → ");
  steps.push({ t: "Answer", d: `Order of execution: <b>${seq}</b>. Maximum profit = <b>${total}</b>. Time complexity O(n²): each of n jobs may scan up to n slots.`, cap: `${seq} · profit = ${total} · O(n²)`, s: scene(sp, [], `profit = ${total}`) });
  return { w: W, h: H, steps };
}
defAlgo({
  id: "job-sequencing", group: "greedy", title: "Job Sequencing with Deadlines", short: "latest free slot",
  idea: "Take jobs in decreasing order of profit and put each in the latest free time slot on or before its deadline.",
  time: "O(n²)", space: "O(n)", pyq: "2× (Mar 24, Dec 22)",
  variants: [
    { name: "4 jobs (PYQ Dec 22)", build: () => buildJS([{ name: "J1", d: 3, p: 10 }, { name: "J2", d: 1, p: 25 }, { name: "J3", d: 2, p: 38 }, { name: "J4", d: 3, p: 50 }]) },
    { name: "7 jobs (question bank)", build: () => buildJS([3, 5, 20, 18, 1, 6, 30].map((p, i) => ({ name: "J" + (i + 1), p, d: [1, 3, 4, 3, 5, 1, 2][i] }))) },
  ],
  exam: {
    def: "Job sequencing with deadlines: given n jobs with deadlines dᵢ and profits pᵢ, each taking one unit of time on one machine, find a feasible subset (and order) with maximum total profit. Greedy: take jobs by decreasing profit and place each in the latest free slot ≤ its deadline. Time O(n²).",
    steps: ["Start.", "Read n jobs with deadlines d[i] and profits p[i].", "Sort the jobs in decreasing order of profit.", "Let b = largest deadline; make slots 1..b, all free.", "For each job in order, go to Step 6.", "From slot min(b, d[i]) down to 1, find the first free slot; put the job there, or reject it if none is free.", "Print the jobs in slot order and the total profit.", "Stop."],
  },
});

/* ---------- MST graph (shared) ---------- */
const MSTG = (() => {
  const raw = { 1: [160, 0], 6: [30, 85], 2: [290, 85], 7: [160, 150], 5: [70, 245], 3: [290, 215], 4: [195, 290] };
  const N = {}; for (const k in raw) N[k] = [70 + raw[k][0] * 1.32, 50 + raw[k][1] * 1.22];
  const E = [["1", "2", 28], ["1", "6", 10], ["2", "3", 16], ["2", "7", 14], ["3", "4", 12], ["4", "5", 22], ["4", "7", 18], ["5", "6", 25], ["5", "7", 24]];
  return { N, E };
})();
function mstScene(edgeTone, nodeTone, extra = []) {
  const s = [];
  MSTG.E.forEach(([u, v, w]) => { const key = u + "-" + v; s.push(edge("e" + key, ...MSTG.N[u], ...MSTG.N[v], edgeTone[key] || "base", { label: w, r: 22 })); });
  for (const k in MSTG.N) s.push(ball("n" + k, ...MSTG.N[k], k, nodeTone[k] || "base", { r: 22 }));
  return s.concat(extra);
}
const ek = (u, v) => MSTG.E.find(e => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u)).slice(0, 2).join("-");

defAlgo({
  id: "mst", group: "greedy", title: "Minimum Cost Spanning Tree", short: "Prim · Kruskal",
  idea: "Connect all n vertices with n − 1 edges, no cycle, and the smallest total cost.",
  time: "Prim O(n²) · Kruskal O(e log e)", space: "O(n²) / O(n + e)", pyq: "Prim 3× · Kruskal 2×",
  variants: [
    {
      name: "Prim's algorithm", time: "O(n²)", space: "O(n²) matrix + O(n)",
      idea: "Grow ONE tree from a start vertex. Each step add the cheapest edge that joins a tree vertex to a non-tree vertex.",
      build() {
        const W = 760, H = 470, steps = [];
        const inT = new Set(["1"]), chosen = [];
        const tones = () => { const et = {}, nt = {}; chosen.forEach(k => et[k] = "done"); inT.forEach(v => nt[v] = "done"); return { et, nt }; };
        const side = (cost, list) => [panel("side", 520, 40, 220, 380, { title: "TREE", color: "#2ee6a6" }), label("tv", 535, 80, `vertices: {${[...inT].join(", ")}}`, { size: 13, anchor: "start", sans: true }), label("tc", 535, 108, `mincost = ${cost}`, { size: 15, anchor: "start", fill: "#7cf0c5" }), ...list.map((t, i) => label("li" + i, 535, 150 + i * 30, t, { size: 13.5, anchor: "start", fill: "#c9d3f5" }))];
        let cost = 0; const log = [];
        { const { et, nt } = tones(); steps.push({ t: "Start at vertex 1", d: "Put any vertex in the tree. We start with <b>1</b>. The tree must finally contain all 7 vertices using 6 edges.", cap: "tree = {1} · mincost = 0", s: mstScene(et, nt, side(0, log)) }); }
        while (inT.size < 7) {
          const cand = MSTG.E.filter(([u, v]) => inT.has(u) !== inT.has(v));
          const best = cand.reduce((a, b) => (b[2] < a[2] ? b : a));
          const { et, nt } = tones(); cand.forEach(([u, v]) => et[u + "-" + v] = "active"); et[best[0] + "-" + best[1]] = "done";
          const nv = inT.has(best[0]) ? best[1] : best[0];
          steps.push({ t: `Cheapest crossing edge: ${best[0]}–${best[1]} (${best[2]})`, d: `Edges leaving the tree (amber): ${cand.map(e => `${e[0]}–${e[1]} (${e[2]})`).join(", ")}. The cheapest is <b>${best[0]}–${best[1]} = ${best[2]}</b>. Add it and vertex ${nv}.`, cap: `candidates: ${cand.map(e => e[2]).join(", ")} → choose ${best[2]}`, s: mstScene(et, { ...nt, [nv]: "active" }, side(cost, log)) });
          inT.add(nv); chosen.push(best[0] + "-" + best[1]); cost += best[2]; log.push(`+ ${best[0]}–${best[1]}  (${best[2]})`);
        }
        const { et, nt } = tones(); MSTG.E.forEach(([u, v]) => { if (!chosen.includes(u + "-" + v)) et[u + "-" + v] = "dim"; });
        steps.push({ t: "Minimum spanning tree", d: "All 7 vertices are in the tree with 6 edges. <b>Minimum cost = 10 + 25 + 22 + 12 + 16 + 14 = 99</b>. Each of n − 1 rounds scans n vertices ⇒ <b>O(n²)</b>.", cap: "mincost = 99 · O(n²)", s: mstScene(et, nt, side(cost, log)) });
        return { w: W, h: H, steps };
      },
      exam: {
        def: "Prim's algorithm is a greedy method that builds a minimum cost spanning tree by starting from any vertex and repeatedly adding the minimum cost edge (u, v) with u in the tree and v not in the tree, until all n vertices are included. Time O(n²).",
        steps: ["Start.", "Read the graph (cost matrix) with n vertices.", "Put any start vertex s in the tree; mincost = 0.", "For every other vertex v, set near[v] = s.", "Repeat Steps 6–8 n − 1 times.", "Choose the non-tree vertex j with the smallest cost[j, near[j]].", "Add edge (j, near[j]) to the tree, add its cost to mincost, put j in the tree.", "For each non-tree k, if cost[k, j] < cost[k, near[k]], set near[k] = j.", "Print the tree edges and mincost.", "Stop."],
      },
    },
    {
      name: "Kruskal's algorithm", time: "O(e log e)", space: "O(n + e)",
      idea: "Sort ALL edges by cost. Take them one by one; accept an edge only if it does not make a cycle.",
      build() {
        const W = 800, H = 470, steps = [];
        const sorted = [...MSTG.E].sort((a, b) => a[2] - b[2]);
        const parent = {}; for (const k in MSTG.N) parent[k] = k;
        const find = (x) => (parent[x] === x ? x : find(parent[x]));
        const st = {}; let cost = 0, cnt = 0;
        const list = (cur) => sorted.map(([u, v, w], i) => block("l" + i, 560, 30 + i * 46, 210, 38, `${u}–${v}   ${w}   ${st[u + "-" + v] === "done" ? "✓" : st[u + "-" + v] === "reject" ? "✗" : ""}`, i === cur ? "active" : st[u + "-" + v] || "ghost", { size: 14, depth: 3 }));
        const sc = (cur, extraT = {}) => { const et = {}; for (const k in st) et[k] = st[k] === "reject" ? "dim" : st[k]; Object.assign(et, extraT); const nt = {}; return mstScene(et, nt, [...list(cur), chip("cost", 260, 440, `mincost = ${cost} · edges = ${cnt}`, "done", { w: 230 })]); };
        steps.push({ t: "Sort all edges", d: "Write every edge in increasing order of cost (right). Every vertex starts as its own tree.", cap: sorted.map(e => e[2]).join(" < "), s: sc(-1) });
        sorted.forEach(([u, v, w], i) => {
          if (cnt === 6) return;
          const key = u + "-" + v, ru = find(u), rv = find(v);
          if (ru !== rv) {
            parent[ru] = rv; st[key] = "done"; cost += w; cnt++;
            steps.push({ t: `Edge ${u}–${v} (${w}): accept`, d: `Find(${u}) ≠ Find(${v}): ${u} and ${v} are in different trees, so <b>no cycle</b>. Accept it. mincost = ${cost}.`, cap: `${u}–${v} accepted · mincost = ${cost}`, s: sc(i, { [key]: "done" }) });
          } else {
            st[key] = "reject";
            steps.push({ t: `Edge ${u}–${v} (${w}): reject`, d: `${u} and ${v} are already connected by chosen edges. Adding ${u}–${v} would make a <b>cycle</b>, so reject it.`, cap: `${u}–${v} makes a cycle → rejected`, s: sc(i, { [key]: "reject" }) });
          }
        });
        steps.push({ t: "Done: 6 edges", d: "n − 1 = 6 edges chosen. <b>Minimum cost = 99</b> (same tree as Prim). Sorting e edges dominates ⇒ <b>O(e log e)</b>.", cap: "mincost = 99 · O(e log e)", s: sc(-1) });
        return { w: W, h: H, steps };
      },
      exam: {
        def: "Kruskal's algorithm is a greedy method that considers edges in non-decreasing order of cost and adds an edge to the tree if it does not form a cycle with the edges already chosen, until n − 1 edges are chosen. Time O(e log e).",
        steps: ["Start.", "Read n vertices and the list E of edges with costs.", "Sort the edges in increasing order of cost.", "Make every vertex a separate set; count = 0, mincost = 0.", "While count < n − 1 and edges remain, repeat Steps 6–7.", "Take the next cheapest edge (u, v).", "If Find(u) ≠ Find(v), accept it (add cost, count + 1, Union); else reject it.", "Print the tree edges and mincost.", "Stop."],
      },
    },
  ],
  exam: { def: "A spanning tree of a connected graph is a sub-graph that is a tree containing all n vertices (n − 1 edges, no cycle). A minimum cost spanning tree is a spanning tree with the smallest total edge cost.", steps: [] },
});

/* ---------- Dijkstra ---------- */
defAlgo({
  id: "dijkstra", group: "greedy", title: "Single Source Shortest Path", short: "Dijkstra",
  idea: "Repeatedly pick the unfinished vertex with the smallest distance, make it final, and relax its outgoing edges.",
  time: "O(n²)", space: "O(n)", pyq: "2× + 2 Part A",
  variants: [{
    name: "source = 1",
    build() {
      const raw = { 1: [0, 90], 2: [130, 0], 3: [300, 0], 4: [130, 180], 5: [300, 180], 6: [420, 180] };
      const N = {}; for (const k in raw) N[k] = [70 + raw[k][0] * 1.35, 60 + raw[k][1] * 1.2];
      const E = [["1", "2", 50], ["1", "3", 45], ["1", "4", 10], ["2", "3", 10], ["2", "4", 15], ["3", "5", 30], ["4", "1", 20], ["4", "5", 15], ["5", "2", 20], ["5", "3", 35], ["6", "5", 3]];
      const bend = { "1-4": 16, "4-1": 16 };
      const lo = { "1-3": [90, -24], "5-2": [16, -10], "2-4": [-16, 0] };
      const W = 760, H = 480, INF = Infinity, V = ["1", "2", "3", "4", "5", "6"];
      const dist = {}, S = new Set(["1"]); V.forEach(v => dist[v] = INF); dist["1"] = 0; E.filter(e => e[0] === "1").forEach(e => dist[e[1]] = e[2]);
      const par = { "2": "1", "3": "1", "4": "1" };
      const scene = (et, nt, changed = []) => {
        const s = [];
        E.forEach(([u, v, w]) => s.push(edge(`e${u}-${v}`, ...N[u], ...N[v], et[u + "-" + v] || "base", { label: w, arrow: true, bend: bend[u + "-" + v], lo: lo[u + "-" + v], r: 22 })));
        V.forEach(v => s.push(ball("n" + v, ...N[v], v, nt[v] || (S.has(v) ? "done" : "base"), { r: 22 })));
        V.forEach((v, i) => s.push(block("d" + v, 70 + i * 106, 380, 92, 52, fmt(dist[v]), changed.includes(v) ? "active" : S.has(v) ? "done" : "base", { top: `dist[${v}]`, size: 18 })));
        return s;
      };
      const treeT = () => { const t = {}; for (const v in par) if (S.has(v)) t[par[v] + "-" + v] = "done"; return t; };
      const steps = [];
      steps.push({ t: "Initialise", d: "dist[v] = direct cost from source 1 (∞ if no edge). Vertex 1 is final with dist 0. S = {1}.", cap: "dist = 0, 50, 45, 10, ∞, ∞ · S = {1}", s: scene({ "1-2": "info", "1-3": "info", "1-4": "info" }, {}) });
      for (let it = 1; it <= 4; it++) {
        const cand = V.filter(v => !S.has(v) && dist[v] < INF);
        if (!cand.length) break;
        const u = cand.reduce((a, b) => (dist[b] < dist[a] ? b : a));
        S.add(u);
        const et = treeT(), changed = [];
        const relaxed = [];
        E.filter(e => e[0] === u && !S.has(e[1])).forEach(([, v, w]) => {
          et[u + "-" + v] = "active";
          if (dist[u] + w < dist[v]) { relaxed.push(`dist[${v}] = min(${fmt(dist[v])}, ${dist[u]} + ${w}) = ${dist[u] + w}`); dist[v] = dist[u] + w; par[v] = u; changed.push(v); }
          else relaxed.push(`dist[${v}] stays ${fmt(dist[v])} (${dist[u]} + ${w} = ${dist[u] + w} is not smaller)`);
        });
        steps.push({ t: `Iteration ${it}: pick vertex ${u}`, d: `Smallest dist among unfinished vertices is <b>dist[${u}] = ${dist[u]}</b> ⇒ ${u} becomes final. Relax its edges: ${relaxed.length ? relaxed.join("; ") : "no unfinished neighbours"}.`, cap: relaxed.length ? relaxed.join(" · ") : `${u} final`, s: scene(et, { [u]: "active" }, changed) });
      }
      steps.push({ t: "Shortest distances", d: "Final: 1→4 = 10, 1→4→5 = 25, 1→4→5→2 = 45, 1→3 = 45, vertex 6 unreachable (∞). Blue-green edges form the shortest-path tree. Time <b>O(n²)</b>.", cap: "dist = 0, 45, 45, 10, 25, ∞ · O(n²)", s: scene(treeT(), {}) });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Single source shortest path: given a directed graph with non-negative edge costs and a source v, find the shortest path from v to every vertex. Dijkstra's greedy algorithm repeatedly makes the unfinished vertex with the minimum dist final and relaxes its edges. Time O(n²).",
    steps: ["Start.", "Read the cost matrix and source v.", "For every i, set dist[i] = cost[v, i] and mark i not final.", "Set dist[v] = 0 and mark v final.", "Repeat Steps 6–8 until all vertices are final.", "Choose the non-final vertex u with the smallest dist[u].", "Mark u final.", "For each non-final w adjacent to u: if dist[u] + cost[u, w] < dist[w], set dist[w] = dist[u] + cost[u, w] (relaxation).", "Print dist[ ].", "Stop."],
  },
});
