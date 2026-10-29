/* ===== Unit 4 (part A) — Disjoint sets and graphs ===== */

/* forest drawing for a parent array P (1-based, P[i] < 0 = root) */
function forestScene(P, n, o = {}) {
  const roots = range(n, 1).filter(i => P[i] < 0);
  const mk = (i) => ({ id: "x" + i, v: i, kids: range(n, 1).filter(j => P[j] === i).map(mk) });
  const top = { id: "top", kids: roots.map(mk) };
  const lay = layoutTree(top, { nodeW: o.nodeW || 64, levelH: o.levelH || 74, pad: 10 });
  const W = o.W || 820, ox = (W - lay.w) / 2, oy = (o.oy || 30) - (o.levelH || 74);
  const s = [];
  walk(top, (nd, par) => {
    if (nd.id === "top") return;
    const p = lay.pos[nd.id];
    if (par && par.id !== "top") { const a = lay.pos[par.id]; s.push(edge("pe" + nd.v, ox + p.x, oy + p.y, ox + a.x, oy + a.y, (o.edgeT && o.edgeT[nd.v]) || "base", { arrow: true, r: 22 })); }
    s.push(ball("f" + nd.v, ox + p.x, oy + p.y, nd.v, (o.nodeT && o.nodeT[nd.v]) || (P[nd.v] < 0 ? "pivot" : "base"), { r: 21 }));
  });
  const ay = o.arrY || 390;
  s.push(label("pi", 40, ay + 28, "i", { size: 13, fill: "#9aa6d1" }));
  s.push(label("pp", 40, ay + 88, "P[i]", { size: 13, fill: "#9aa6d1" }));
  range(n, 1).forEach(i => {
    const x = 80 + (i - 1) * Math.min(86, (W - 120) / n);
    s.push(label("ai" + i, x + 32, ay + 28, String(i), { size: 13, fill: "#9aa6d1" }));
    s.push(block("ap" + i, x, ay + 60, 64, 52, P[i], (o.cellT && o.cellT[i]) || (P[i] < 0 ? "pivot" : "base"), { size: 17 }));
  });
  return s;
}
defAlgo({
  id: "disjoint-sets", group: "graphs", title: "Disjoint Set Operations", short: "Union · Find",
  idea: "Each set is a tree; the root names the set. Union joins two roots, Find climbs to the root.",
  time: "Find O(log n) with weighted union", space: "O(n)", pyq: "1× + Part A",
  variants: [
    {
      name: "Simple union & find", time: "Union O(1) · Find O(n)", build() {
        const n = 5, P = [0, -1, -1, -1, -1, -1], W = 820, H = 520, steps = [];
        steps.push({ t: "5 single-element sets", d: "Every element is its own tree. <b>P[i] = −1</b> means i is a root.", cap: "P = [−1, −1, −1, −1, −1]", s: forestScene(P, n, { W }) });
        [[1, 2], [2, 3], [3, 4], [4, 5]].forEach(([i, j]) => {
          P[i] = j;
          steps.push({ t: `SimpleUnion(${i}, ${j})`, d: `Make root ${i} a child of root ${j}: <b>P[${i}] = ${j}</b>.`, cap: `P[${i}] = ${j}`, s: forestScene(P, n, { W, cellT: { [i]: "active" }, nodeT: { [i]: "active" } }) });
        });
        const path = [1, 2, 3, 4, 5];
        steps.push({ t: "Find(1) climbs the whole chain", d: "Find(1): 1 → 2 → 3 → 4 → 5 (root). That is <b>4 links</b>. With n elements a chain makes Find O(n), and n finds cost O(n²). This is why we need weighted union.", cap: "Find(1) = 5 after 4 moves", s: forestScene(P, n, { W, nodeT: Object.fromEntries(path.map(v => [v, v === 5 ? "done" : "active"])), edgeT: { 1: "active", 2: "active", 3: "active", 4: "active" } }) });
        return { w: W, h: H, steps };
      },
      exam: { def: "Simple union makes one root the parent of the other (P[i] = j). Simple find follows parent pointers until a root (P < 0) is reached. Repeated unions can create a chain, so n finds can cost O(n²).", steps: ["Start.", "SimpleUnion(i, j): read roots i and j; set P[i] = j; stop.", "SimpleFind(i): read i; while P[i] ≥ 0 set i = P[i].", "Return i (the root).", "Stop."] },
    },
    {
      name: "Weighted union", time: "Find O(log n)", build() {
        const n = 8, P = [0, -1, -1, -1, -1, -1, -1, -1, -1], W = 860, H = 520, steps = [];
        steps.push({ t: "8 single-element sets", d: "Weighting rule: the root stores <b>−(number of nodes)</b>. The tree with fewer nodes goes under the bigger one.", cap: "P[root] = −count", s: forestScene(P, n, { W }) });
        [[1, 2], [3, 4], [1, 3], [5, 6], [1, 5]].forEach(([i, j]) => {
          const temp = P[i] + P[j];
          let txt;
          if (P[i] > P[j]) { P[i] = j; P[j] = temp; txt = `tree ${i} is smaller ⇒ P[${i}] = ${j}, P[${j}] = ${temp}`; }
          else { P[j] = i; P[i] = temp; txt = `tree ${j} is smaller or equal ⇒ P[${j}] = ${i}, P[${i}] = ${temp}`; }
          steps.push({ t: `WeightedUnion(${i}, ${j})`, d: `Counts: ${-P[i] > 0 ? "" : ""}temp = ${temp}. ${txt}.`, cap: txt, s: forestScene(P, n, { W, cellT: { [i]: "active", [j]: "active" } }) });
        });
        steps.push({ t: "Trees stay short", d: "Height stays ≤ ⌊log₂ n⌋ + 1, so <b>Find is O(log n)</b>. Final P = [−6, 1, 1, 3, 1, 5, −1, −1].", cap: "P = [−6, 1, 1, 3, 1, 5, −1, −1]", s: forestScene(P, n, { W }) });
        return { w: W, h: H, steps };
      },
      exam: { def: "Weighting rule for Union(i, j): if the number of nodes in tree i is less than in tree j, make j the parent of i; otherwise make i the parent of j. Roots store −(count). Tree height ≤ ⌊log₂ n⌋ + 1.", steps: ["Start.", "Read roots i and j (P[i] = −count i, P[j] = −count j).", "temp = P[i] + P[j].", "If P[i] > P[j] (i smaller): P[i] = j, P[j] = temp.", "Else: P[j] = i, P[i] = temp.", "Stop."] },
    },
    {
      name: "Collapsing find", time: "later finds ≈ O(1)", build() {
        const n = 8, W = 860, H = 560, steps = [];
        const P = [0, -6, 1, 2, 3, 1, -1, -1, 4];
        steps.push({ t: "A tall tree", d: "Elements 1, 2, 3, 4, 5, 8 form one set with root 1. Path from 8 to the root: 8 → 4 → 3 → 2 → 1.", cap: "P = [−6, 1, 2, 3, 1, −1, −1, 4]", s: forestScene(P, n, { W, levelH: 72 }) });
        steps.push({ t: "Find the root of 8", d: "Climb: 8 → 4 → 3 → 2 → 1. Root r = <b>1</b> (4 moves).", cap: "r = 1", s: forestScene(P, n, { W, levelH: 72, nodeT: { 8: "active", 4: "active", 3: "active", 2: "active", 1: "done" }, edgeT: { 8: "active", 4: "active", 3: "active", 2: "active" } }) });
        [8, 4, 3].forEach((v) => {
          P[v] = 1;
          steps.push({ t: `Collapse: P[${v}] = 1`, d: `Collapsing rule: every node on the path now points <b>directly to the root</b>. Set P[${v}] = 1.`, cap: `P[${v}] = 1`, s: forestScene(P, n, { W, levelH: 72, nodeT: { [v]: "active", 1: "done" }, cellT: { [v]: "active" } }) });
        });
        steps.push({ t: "Next Find(8) is one step", d: "8, 4, 3 and 2 all point to 1 now. The next Find(8) needs only <b>1 move</b>. With weighted union + collapsing find, m operations take almost O(m).", cap: "P = [−6, 1, 1, 1, 1, −1, −1, 1]", s: forestScene(P, n, { W, levelH: 72, nodeT: { 1: "done" } }) });
        return { w: W, h: H, steps };
      },
      exam: { def: "Collapsing rule: if j is a node on the path from i to its root and P[j] ≠ root, then set P[j] = root. It makes later finds on these nodes take one step.", steps: ["Start.", "Read element i.", "Find the root r: r = i; while P[r] > 0, r = P[r].", "Collapse: while i ≠ r, s = P[i], P[i] = r, i = s.", "Return r.", "Stop."] },
    },
  ],
  exam: { def: "Disjoint sets have no common element. Each set is a tree whose root is the set's name, stored in a parent array P (P[root] < 0). The operations are Union(i, j) and Find(i).", steps: [] },
});

/* ---------- AND/OR graph ---------- */
defAlgo({
  id: "and-or", group: "graphs", title: "AND/OR Graphs", short: "is the root solvable?",
  idea: "An AND node needs ALL children solved; an OR node needs ANY ONE child solved.",
  time: "O(n)", space: "O(height)", pyq: "1× + Part A",
  variants: [{
    name: "Problem A",
    build() {
      const W = 820, H = 470;
      const N = { A: [410, 60], B: [200, 180], C: [410, 180], D: [620, 180], E: [110, 330], F: [290, 330], G: [540, 330], H: [700, 330] };
      const E = [["A", "B"], ["A", "C"], ["A", "D"], ["B", "E"], ["B", "F"], ["D", "G"], ["D", "H"]];
      const arcs = [["A", "C", "D"], ["B", "E", "F"], ["D", "G", "H"]];
      const term = { E: true, F: true, C: true, G: true, H: false };
      const scene = (st = {}, et = {}) => {
        const s = [];
        E.forEach(([u, v]) => s.push(edge(`e${u}${v}`, ...N[u], ...N[v], et[u + v] || "base", { arrow: true, r: 26 })));
        arcs.forEach(([p, a, b]) => {
          const [px, py] = N[p]; const ang = (q) => Math.atan2(N[q][1] - py, N[q][0] - px); const r = 52;
          const a1 = ang(b), a2 = ang(a);
          s.push({ k: "arc" + p, x: 0, y: 0, z: 0, svg: `<path d="M${px + r * Math.cos(a1)},${py + r * Math.sin(a1)} A${r},${r} 0 0 1 ${px + r * Math.cos(a2)},${py + r * Math.sin(a2)}" fill="none" stroke="#ff8ad8" stroke-width="3"/>` + txt(px + (p === "A" ? 70 : 0), py + (p === "A" ? 46 : 62), "AND", { size: 11, fill: "#ff8ad8", weight: 800 }) });
        });
        for (const k in N) s.push(ball("n" + k, ...N[k], k, st[k] || "base", { r: 26, size: 17, sub: k in term ? (term[k] ? "terminal" : "unsolvable") : "" }));
        s.push(chip("legend", 410, 440, "pink arc = AND (all children) · no arc = OR (any one)", "pink", { size: 12.5 }));
        return s;
      };
      const steps = [];
      steps.push({ t: "The AND/OR graph", d: "A can be solved by B <b>OR</b> by (C <b>AND</b> D). B needs E AND F. D needs G AND H. Leaves: E, F, C, G are terminal (solvable); H is not.", cap: "Solve(T): leaf → terminal? · AND → all children · OR → any child", s: scene() });
      steps.push({ t: "Solve(B): leaves E and F", d: "E and F are terminal leaves ⇒ Solve returns 1 for both.", cap: "Solve(E) = 1, Solve(F) = 1", s: scene({ E: "done", F: "done" }) });
      steps.push({ t: "B is an AND node", d: "All children of B (E and F) are solvable ⇒ <b>B is solvable</b>.", cap: "Solve(B) = 1", s: scene({ E: "done", F: "done", B: "done" }, { BE: "done", BF: "done" }) });
      steps.push({ t: "Check the other branch: D", d: "C is terminal (1). For D: G = 1 but H is unsolvable (0). D is an AND node and one child failed ⇒ <b>D is unsolvable</b>, so (C AND D) fails.", cap: "Solve(D) = 0 → C AND D fails", s: scene({ E: "done", F: "done", B: "done", C: "done", G: "done", H: "reject", D: "reject" }, { BE: "done", BF: "done", DH: "reject" }) });
      steps.push({ t: "A is solvable through B", d: "A is an OR node over B and (C AND D). One child is enough: B is solvable ⇒ <b>A is solvable</b>. Solution graph: A → B → E, F. Each node is visited once ⇒ <b>O(n)</b>.", cap: "Solve(A) = 1 · solution graph A → B → {E, F}", s: scene({ E: "done", F: "done", B: "done", A: "done", C: "dim", G: "dim", H: "reject", D: "reject" }, { AB: "done", BE: "done", BF: "done", AC: "dim", AD: "dim" }) });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "An AND/OR graph represents a problem decomposed into sub-problems. An AND node is solvable only if all its children are solvable; an OR node is solvable if at least one child is solvable. Terminal leaves are solvable, non-terminal leaves are not.",
    steps: ["Start.", "Read node T.", "If T is a leaf: return 1 if it is terminal, else 0.", "If T is an AND node: Solve each child; if any returns 0, return 0; else return 1.", "If T is an OR node: Solve each child; if any returns 1, return 1; else return 0.", "Stop."],
  },
});

/* ---------- Connected components ---------- */
defAlgo({
  id: "components", group: "graphs", title: "Connected Components", short: "BFS / DFS from each unvisited vertex",
  idea: "Start DFS (or BFS) from an unvisited vertex; everything it reaches is one component. Repeat.",
  time: "O(n + e)", space: "O(n)", pyq: "2× (with spanning trees)",
  variants: [{
    name: "8 vertices",
    build() {
      const W = 820, H = 430;
      const N = { 1: [90, 90], 2: [240, 90], 3: [165, 220], 4: [360, 90], 5: [510, 90], 6: [435, 220], 7: [660, 90], 8: [660, 230] };
      const E = [[1, 2], [2, 3], [1, 3], [4, 5], [5, 6], [7, 8]];
      const comp = {}, tones = ["info", "pink", "active"];
      const order = [];
      const scene = (cur) => {
        const s = [];
        E.forEach(([u, v]) => s.push(edge(`e${u}${v}`, ...N[u], ...N[v], comp[u] !== undefined && comp[v] !== undefined ? (comp[u] === 0 ? "info" : comp[u] === 1 ? "pivot" : "active") : "base", { r: 24 })));
        for (const k in N) s.push(ball("n" + k, ...N[k], k, cur == k ? "white" : comp[k] !== undefined ? tones[comp[k]] : "base", { r: 24, size: 16 }));
        s.push(label("vis", 40, 330, "visit order: " + (order.join(", ") || "—"), { size: 14, anchor: "start", fill: "#c9d3f5" }));
        const cnt = new Set(Object.values(comp)).size;
        s.push(chip("count", 690, 390, `components = ${cnt}`, "done", { w: 190 }));
        return s;
      };
      const adj = {}; for (const k in N) adj[k] = []; E.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });
      const steps = [{ t: "All vertices unvisited", d: "We will start a DFS from every vertex that is still unvisited. count = 0.", cap: "count = 0", s: scene() }];
      let c = -1;
      for (let i = 1; i <= 8; i++) {
        if (comp[i] !== undefined) continue;
        c++;
        const stack = [i]; const seenNow = [];
        while (stack.length) {
          const u = stack.pop(); if (comp[u] !== undefined) continue;
          comp[u] = c; order.push(u); seenNow.push(u);
          steps.push({ t: `Component ${c + 1}: visit ${u}`, d: seenNow.length === 1 ? `Vertex ${u} is unvisited ⇒ <b>count = ${c + 1}</b>. Start DFS(${u}).` : `DFS reaches ${u} (neighbour of the last visited vertices). It belongs to component ${c + 1}.`, cap: `component ${c + 1}: {${seenNow.join(", ")}}`, s: scene(u) });
          adj[u].slice().reverse().forEach(v => { if (comp[v] === undefined) stack.push(v); });
        }
      }
      steps.push({ t: "3 components", d: "{1, 2, 3}, {4, 5, 6}, {7, 8}. Every vertex and edge is looked at once ⇒ <b>O(n + e)</b> with adjacency lists. The DFS tree edges inside each component form its spanning tree.", cap: "components = 3 · O(n + e)", s: scene() });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "A connected component of an undirected graph is a maximal connected sub-graph. Components are found by running BFS/DFS from each unvisited vertex; each run visits exactly one component. Time O(n + e).",
    steps: ["Start.", "Read graph G; mark all vertices unvisited; count = 0.", "For each vertex i = 1..n, go to Step 4.", "If i is unvisited, count = count + 1 and run DFS(i); all vertices visited form component count.", "Print count and the components.", "Stop."],
  },
});

/* ---------- Biconnected components ---------- */
defAlgo({
  id: "biconnected", group: "graphs", title: "Biconnected Components", short: "articulation points · dfn & L",
  idea: "Run DFS, give each vertex dfn (visit order) and L (lowest dfn reachable). u is an articulation point if a child w has L[w] ≥ dfn[u].",
  time: "O(n + e)", space: "O(n + e)", pyq: "3×",
  variants: [{
    name: "8 vertices",
    build() {
      const W = 900, H = 470;
      const N = { 1: [80, 110], 2: [80, 300], 3: [230, 205], 4: [390, 205], 5: [560, 205], 6: [475, 360], 7: [730, 100], 8: [730, 310] };
      const E = [[1, 2], [2, 3], [3, 1], [3, 4], [4, 5], [5, 6], [6, 4], [5, 7], [7, 8], [8, 5]];
      const adj = { 1: [2, 3], 2: [1, 3], 3: [1, 2, 4], 4: [3, 5, 6], 5: [4, 6, 7, 8], 6: [4, 5], 7: [5, 8], 8: [5, 7] };
      const dfn = {}, L = {}, par = {}, tree = new Set(), back = new Set(); let num = 1;
      const steps = [];
      const ek2 = (u, v) => (u < v ? `${u}-${v}` : `${v}-${u}`);
      const scene = (cur, extra = {}, showL = false, comps = null) => {
        const s = [];
        const ct = ["info", "pink", "active", "done"];
        E.forEach(([u, v]) => {
          const k = ek2(u, v); let t = tree.has(k) ? "done" : back.has(k) ? "pivot" : "base";
          if (comps) { const ci = comps.findIndex(c => c.includes(k)); t = ["info", "pivot", "active", "done"][ci]; }
          s.push(edge("e" + k, ...N[u], ...N[v], t, { r: 24, dash: back.has(k) && !comps }));
        });
        for (const k in N) {
          const t = extra[k] || (cur == k ? "white" : dfn[k] ? "base" : "dim");
          s.push(ball("n" + k, ...N[k], k, t, { r: 24, size: 16, subUp: k === "4" || k === "5", sub: dfn[k] ? (showL ? `dfn ${dfn[k]} · L ${L[k]}` : `dfn ${dfn[k]}`) : "" }));
        }
        return s;
      };
      steps.push({ t: "The graph", d: "Find the articulation points (vertices whose removal disconnects the graph) and the biconnected components. Start DFS at vertex 1.", cap: "L[u] = min{ dfn[u], L[child], dfn[back-edge end] }", s: scene(null) });
      const dfs = (u, p) => {
        dfn[u] = L[u] = num++; par[u] = p;
        steps.push({ t: `Visit ${u}: dfn = ${dfn[u]}`, d: p ? `DFS goes from ${p} to ${u} (tree edge, green). dfn[${u}] = ${dfn[u]}.` : `Start: dfn[1] = 1.`, cap: `dfn[${u}] = ${dfn[u]}`, s: scene(u) });
        for (const w of adj[u]) {
          if (!dfn[w]) { tree.add(ek2(u, w)); dfs(w, u); L[u] = Math.min(L[u], L[w]); }
          else if (w !== p && dfn[w] < dfn[u]) {
            back.add(ek2(u, w)); L[u] = Math.min(L[u], dfn[w]);
            steps.push({ t: `Back edge ${u} – ${w}`, d: `${w} is already visited and is not the parent ⇒ <b>back edge</b> (violet dashed). It lets ${u} reach dfn ${dfn[w]}.`, cap: `back edge ${u}–${w}`, s: scene(u) });
          }
        }
      };
      dfs(1, 0);
      steps.push({ t: "Low values L", d: "Bottom-up: L[8] = 5, L[7] = 5, L[6] = 4, L[5] = 4, L[4] = 4, L[3] = 1, L[2] = 1, L[1] = 1.", cap: "L = 1, 1, 1, 4, 4, 4, 5, 5", s: scene(null, {}, true) });
      steps.push({ t: "Test L[child] ≥ dfn[u]", d: "3 → child 4: L[4] = 4 ≥ 3 ✓. 4 → child 5: L[5] = 4 ≥ 4 ✓. 5 → child 7: L[7] = 5 ≥ 5 ✓. 2 → child 3: 1 ≥ 2 ✗. Root 1 has one child ✗. <b>Articulation points: 3, 4, 5.</b>", cap: "articulation points = 3, 4, 5", s: scene(null, { 3: "active", 4: "active", 5: "active" }, true) });
      const comps = [["1-2", "2-3", "1-3"], ["3-4"], ["4-5", "5-6", "4-6"], ["5-7", "7-8", "5-8"]];
      steps.push({ t: "4 biconnected components", d: "{1, 2, 3}, {3, 4}, {4, 5, 6}, {5, 7, 8}. Neighbouring components share one articulation point. One DFS ⇒ <b>O(n + e)</b>.", cap: "components: {1,2,3} {3,4} {4,5,6} {5,7,8}", s: scene(null, { 3: "active", 4: "active", 5: "active" }, true, comps) });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "An articulation point is a vertex whose removal disconnects the graph. A biconnected graph has none; a biconnected component is a maximal biconnected sub-graph. Using DFS: non-root u is an articulation point iff a child w has L[w] ≥ dfn[u]; the root iff it has ≥ 2 children. Time O(n + e).",
    steps: ["Start (num = 1, dfn[ ] = 0).", "Visit u: dfn[u] = L[u] = num, num + 1.", "For each neighbour w of u, go to Steps 4–5.", "If w unvisited: push (u, w), Art(w, u), L[u] = min(L[u], L[w]); if L[w] ≥ dfn[u], pop edges up to (u, w) as one component.", "Else if w ≠ parent and dfn[w] < dfn[u]: push (u, w), L[u] = min(L[u], dfn[w]).", "Stop."],
  },
});
