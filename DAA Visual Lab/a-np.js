/* ===== Unit 6 — NP-Hard and NP-Complete ===== */
function shape(k, svg, z = 0) { return { k, x: 0, y: 0, z, svg }; }
function ell(k, cx, cy, rx, ry, color, o = {}) {
  return shape(k, `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" fill-opacity="${o.op ?? 0.13}" stroke="${color}" stroke-width="${o.sw || 2.4}" stroke-opacity=".9"${o.dash ? ' stroke-dasharray="9 7"' : ""}/>` + (o.title ? txt(o.tx ?? cx, o.ty ?? cy - ry + 26, o.title, { size: o.ts || 20, fill: color, weight: 800, sans: true }) : ""), o.z ?? 0);
}

/* ---------- P, NP, NP-hard, NP-complete ---------- */
defAlgo({
  id: "np-classes", group: "np", title: "P, NP, NP-Hard, NP-Complete", short: "the four classes",
  idea: "P = solved fast. NP = a guessed answer can be checked fast. NP-hard = at least as hard as every NP problem. NP-complete = NP-hard and in NP.",
  time: "—", space: "—", pyq: "4× + Part A",
  variants: [{
    name: "build the picture",
    build() {
      const W = 1060, H = 556, steps = [];
      /* 1: growth */
      const rows = [["n", 20, "20"], ["n log n", 86, "86"], ["n²", 400, "400"], ["n³", 8000, "8 000"], ["2ⁿ", 1048576, "10 48 576"], ["n!", 2.43e18, "2.4 × 10¹⁸"]];
      const growth = rows.map(([nm, v, s], i) => {
        const len = 40 + Math.log10(v) * 38, ok = i < 4;
        return [label("gl" + i, 150, 110 + i * 62, nm, { size: 17, anchor: "end", fill: ok ? "#7cf0c5" : "#ff8fa6" }),
          block("gb" + i, 170, 92 + i * 62, len, 38, "", ok ? "done" : "reject", { depth: 4 }),
          label("gv" + i, 186 + len, 110 + i * 62, s, { size: 14, anchor: "start", fill: "#c9d3f5" })];
      }).flat();
      steps.push({ t: "Polynomial vs exponential", d: "Number of steps when <b>n = 20</b>. Polynomial times (green: n, n log n, n², n³) stay small — these problems are <b>tractable</b>. Exponential times (red: 2ⁿ, n!) explode — <b>intractable</b> for big n.", cap: "bar length = number of digits (log scale)", s: [...growth, chip("gt", 760, 160, "tractable: sorting, MST, shortest path", "done", { size: 13 }), chip("gx", 760, 400, "intractable: TSP, 0/1 knapsack, colouring", "reject", { size: 13 })] });
      /* 2: decision vs optimisation */
      steps.push({ t: "Decision vs optimisation", d: "An <b>optimisation</b> problem asks for the best value. Its <b>decision</b> version only asks yes / no. If the optimisation is easy, the decision is easy too, so the theory uses <b>decision problems</b>.", cap: "theory of NP is built on yes / no problems", s: [
        panel("po", 60, 90, 440, 330, { title: "OPTIMISATION", color: "#a98bff" }), panel("pd", 560, 90, 440, 330, { title: "DECISION", color: "#4cc9ff" }),
        block("o1", 90, 140, 380, 54, "Find the minimum tour cost", "pivot", { sans: true, size: 15 }), block("o2", 90, 230, 380, 54, "Find the chromatic number", "pivot", { sans: true, size: 15 }), block("o3", 90, 320, 380, 54, "Find the maximum profit", "pivot", { sans: true, size: 15 }),
        block("d1", 590, 140, 380, 54, "Is there a tour of cost ≤ k?", "info", { sans: true, size: 15 }), block("d2", 590, 230, 380, 54, "Can G be coloured with m colours?", "info", { sans: true, size: 15 }), block("d3", 590, 320, 380, 54, "Is there profit ≥ r, weight ≤ m?", "info", { sans: true, size: 15 }),
        chip("yn", 780, 460, "answer: YES / NO", "white", { size: 14 }), chip("bv", 280, 460, "answer: a best value", "white", { size: 14 }),
      ] });
      /* venn parts */
      const NP = (o = {}) => ell("vnp", 380, 280, 300, 210, "#4cc9ff", { title: "NP", tx: 250, ty: 110, ...o });
      const P = (o = {}) => ell("vp", 250, 300, 125, 105, "#2ee6a6", { title: "P", ty: 222, ...o });
      const HARD = (o = {}) => ell("vh", 770, 280, 290, 235, "#ff6b86", { title: "NP-hard", tx: 900, ty: 100, dash: true, ...o });
      const pEx = [["sorting", 262], ["searching", 298], ["MST", 334], ["shortest path", 370]].map(([s, y], i) => chip("pe" + i, 250, y, s, "done", { size: 12 }));
      const npcEx = ["SAT", "Clique", "0/1 Knapsack", "Ham. cycle", "Colouring", "TSP"].map((s, i) => chip("ce" + i, 577, 232 + i * 34, s, "pink", { size: 12 }));
      steps.push({ t: "Class P", d: "<b>P</b> = decision problems solved by a <b>deterministic</b> algorithm in <b>polynomial time</b>.", cap: "P: fast to solve", s: [P(), ...pEx] });
      steps.push({ t: "Class NP", d: "<b>NP</b> = decision problems solved by a <b>non-deterministic</b> algorithm in polynomial time. Same thing: if someone gives a proposed answer, we can <b>check it in polynomial time</b>. Every P problem is in NP ⇒ <b>P ⊆ NP</b>.", cap: "NP: fast to check · P ⊆ NP", s: [NP(), P(), ...pEx, chip("npq", 380, 470, "P = NP ?  — open question", "white", { size: 13 })] });
      /* reduction */
      const red = [["Instance of L₁", "base"], ["Poly-time\nconversion", "pivot"], ["Instance of L₂", "base"], ["Algorithm\nfor L₂", "info"], ["yes / no\n= answer for L₁", "done"]];
      const redItems = red.map(([s, t], i) => block("rd" + i, 30 + i * 206, 230, 170, 74, s, t, { sans: true, size: 15 }));
      const redE = range(4).map(i => edge("re" + i, 200 + i * 206, 267, 236 + i * 206, 267, "active", { r: 0, arrow: true }));
      steps.push({ t: "Reduction  L₁ ∝ L₂", d: "<b>L₁ reduces to L₂</b> if every instance of L₁ can be <b>converted in polynomial time</b> into an instance of L₂ with the same yes / no answer. Then L₂ is <b>at least as hard</b> as L₁.", cap: "L₁ ∝ L₂  ⇒  L₂ is at least as hard as L₁", s: [...redItems, ...redE, label("rq", 530, 380, "if L₂ is fast, L₁ is fast too", { size: 17, fill: "#ffd978", sans: true })] });
      steps.push({ t: "NP-hard", d: "L is <b>NP-hard</b> if <b>every NP problem reduces to L</b> (in practice: SAT ∝ L). An NP-hard problem need not be in NP — it may not even be a decision problem.", cap: "NP-hard: every NP problem ∝ L", s: [NP(), P(), HARD(), ...pEx, chip("h1", 900, 300, "Halting problem", "reject", { size: 12 }), chip("h2", 900, 340, "TSP (optimisation)", "reject", { size: 12 })] });
      steps.push({ t: "NP-complete = NP ∩ NP-hard", d: "L is <b>NP-complete</b> if L is NP-hard <b>and</b> L ∈ NP — the overlap (decision versions of SAT, clique, TSP, 0/1 knapsack, Hamiltonian cycle, colouring). SAT was the first (Cook, 1971). If <b>any one</b> NP-complete problem gets a polynomial algorithm, then <b>P = NP</b>.", cap: "NP-complete = NP-hard ∩ NP", s: [NP(), P(), HARD(), shape("lens", txt(577, 196, "NP-complete", { size: 17, fill: "#ffc2ea", weight: 800, sans: true }), 3), ...pEx, ...npcEx, chip("h1", 900, 300, "Halting problem", "reject", { size: 12 }), chip("h2", 900, 340, "TSP (optimisation)", "reject", { size: 12 })] });
      steps.push({ t: "Remember", d: "1. P ⊆ NP. 2. Every NP-complete problem is NP-hard, but not every NP-hard problem is NP-complete. 3. All NP-complete problems reduce to each other. 4. To prove L₂ NP-hard: take a known NP-hard L₁ and show <b>L₁ ∝ L₂</b>.", cap: "picture drawn assuming P ≠ NP", s: [NP({ op: 0.08 }), P({ op: 0.08 }), HARD({ op: 0.08 }), shape("lens", txt(577, 196, "NP-complete", { size: 17, fill: "#ffc2ea", weight: 800, sans: true }), 3), ...pEx, ...npcEx, chip("h1", 900, 300, "Halting problem", "reject", { size: 12 }), chip("h2", 900, 340, "TSP (optimisation)", "reject", { size: 12 }), chip("f1", 390, 530, "any NP-complete problem in P  ⇒  P = NP", "active", { size: 14 })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "P is the class of decision problems solvable by a deterministic algorithm in polynomial time. NP is the class of decision problems solvable by a non-deterministic algorithm in polynomial time (P ⊆ NP). A problem L is NP-hard if satisfiability reduces to L (every NP problem reduces to L). L is NP-complete if L is NP-hard and L ∈ NP.",
    steps: ["Start.", "To show L₂ is NP-hard, pick a problem L₁ already known to be NP-hard (e.g. SAT, clique, Hamiltonian cycle).", "Give a method that converts any instance I of L₁ into an instance I′ of L₂ in polynomial time.", "Prove: I is a yes-instance of L₁ ⇔ I′ is a yes-instance of L₂.", "Conclude L₁ ∝ L₂, so L₂ is NP-hard.", "If also L₂ ∈ NP (a guess can be checked in polynomial time), L₂ is NP-complete.", "Stop."],
  },
});

/* ---------- Non-deterministic algorithms ---------- */
function choiceTree(n, path, upto, ox, oy, labelOf, o = {}) {
  /* full binary tree of depth n; reveal the guessed path up to level `upto` */
  const s = [], lw = o.leafW || 46, lh = o.levelH || 78, totalW = lw * 2 ** n;
  const pos = (d, idx) => [ox + (idx + 0.5) * totalW / 2 ** d, oy + d * lh];
  let idx = 0;
  s.push(ball("ct0_0", ...pos(0, 0), labelOf(0, []), upto === 0 ? "active" : "done", { r: 17, size: 11.5 }));
  for (let d = 1; d <= upto; d++) {
    const parentIdx = idx;
    for (const bit of [1, 0]) {
      const ci = parentIdx * 2 + (1 - bit);
      const chosen = path[d - 1] === bit;
      const [px, py] = pos(d - 1, parentIdx), [cx, cy] = pos(d, ci);
      s.push(edge(`cte${d}_${ci}`, px, py, cx, cy, chosen ? "done" : "dim", { r: 17, label: chosen ? `x${d}=${bit}` : undefined, w: 2, lo: [bit ? -16 : 16, -4] }));
      s.push(ball(`ct${d}_${ci}`, cx, cy, chosen ? labelOf(d, path.slice(0, d)) : "", chosen ? (d === upto ? (o.final ? (o.ok ? "done" : "reject") : "active") : "done") : "ghost", { r: 17, size: 11.5 }));
    }
    idx = parentIdx * 2 + (1 - path[d - 1]);
  }
  return s;
}

defAlgo({
  id: "nd-algos", group: "np", title: "Non-Deterministic Algorithms", short: "Choice · Success · Failure",
  idea: "A non-deterministic algorithm may GUESS with Choice(S) and always guesses right if a right choice exists; then it CHECKS the guess in polynomial time.",
  time: "Search O(1) · Sort O(n) · Knapsack O(n) · SOS O(n)", space: "O(n)", pyq: "3× + Part A",
  variants: [
    {
      name: "Search", time: "O(1)",
      build() {
        const A = [8, 3, 9, 4, 7, 5, 2], x = 7, W = 900, H = 440, cw = 90, ax = 135, ay = 300;
        const arr = (tone = () => "base") => A.map((v, i) => block("a" + i, ax + i * cw, ay, cw - 12, 56, String(v), tone(i), { top: `A[${i + 1}]`, size: 19 }));
        const oracle = (t = "pivot") => ball("orc", 450, 110, "?", t, { r: 34, size: 22, sub: "Choice(1, n)" });
        const fan = (hit, tones) => A.map((_, i) => edge("f" + i, 450, 110, ax + i * cw + (cw - 12) / 2, ay - 18, tones ? tones(i) : (i === hit ? "done" : "dim"), { r: 34, arrow: i === hit, w: i === hit ? 4 : 1.6 }));
        const steps = [];
        steps.push({ t: "Array and key", d: `Search for <b>x = ${x}</b> in A[1..7]. A deterministic search may need n = 7 comparisons.`, cap: `x = ${x}`, s: [...arr(), chip("x", 450, 200, `key x = ${x}`, "active", { size: 15 })] });
        steps.push({ t: "Guess: j = Choice(1, n)", d: "The non-deterministic machine <b>guesses</b> a position in one step. It has all 7 options at once and picks a correct one if it exists.", cap: "guessing stage — O(1)", s: [...arr(), oracle(), ...fan(-1, () => "base")] });
        steps.push({ t: "Guess lands on j = 5", d: "Because a correct choice exists, Choice returns <b>j = 5</b>.", cap: "j = 5", s: [...arr((i) => (i === 4 ? "active" : "base")), oracle("active"), ...fan(4)] });
        steps.push({ t: "Check: A[5] = 7 ⇒ Success()", d: "Checking stage: A[5] = 7 = x ⇒ print 5 and call <b>Success()</b>. Time <b>O(1)</b>.", cap: "A[j] = x ⇒ Success() · O(1)", s: [...arr((i) => (i === 4 ? "done" : "base")), oracle("done"), ...fan(4), chip("ok", 450, 410, "Success()", "done", { size: 15 })] });
        steps.push({ t: "If x is not in A ⇒ Failure()", d: "If x = 6, every possible guess fails the check ⇒ print 0 and call <b>Failure()</b>.", cap: "no correct choice ⇒ Failure()", s: [...arr(() => "reject"), oracle("reject"), ...fan(-1, () => "reject"), chip("x", 450, 200, "key x = 6", "active", { size: 15 }), chip("ok", 450, 410, "Failure()", "reject", { size: 15 })] });
        return { w: W, h: H, steps };
      },
      exam: { def: "Non-deterministic search guesses the position j = Choice(1, n) and checks whether A[j] = x. It succeeds in O(1) time if x is present; otherwise it fails.", steps: ["Start.", "Read the array A[1..n] and the key x.", "Guess a position: j = Choice(1, n).", "If A[j] = x, print j and call Success().", "Otherwise print 0 and call Failure().", "Stop."] },
    },
    {
      name: "Sort", time: "O(n)",
      build() {
        const A = [7, 2, 9, 4], W = 900, H = 460, cw = 120, steps = [];
        const sorted = A.slice().sort((a, b) => a - b), place = A.map(v => sorted.indexOf(v));
        const ax = 210, ay = 90, by = 300;
        const sc = (k, ok) => {
          const s = [label("la", 150, ay + 28, "A", { size: 20, anchor: "end", fill: "#9aa6d1" }), label("lb", 150, by + 28, "B", { size: 20, anchor: "end", fill: "#9aa6d1" })];
          for (let j = 0; j < 4; j++) s.push(block("slot" + j, ax + j * cw, by, cw - 20, 56, "", "ghost", { depth: 2, top: `B[${j + 1}]`, z: 0 }));
          A.forEach((v, i) => {
            const moved = i < k;
            s.push(block("v" + i, moved ? ax + place[i] * cw : ax + i * cw, moved ? by : ay, cw - 20, 56, String(v), moved ? (ok === undefined ? "info" : ok ? "done" : "reject") : i === k ? "active" : "base", { size: 20, top: moved ? undefined : `A[${i + 1}]`, z: 2 }));
          });
          if (k < 4) s.push(chip("ch", 450, 225, `j = Choice(1, 4) → ${place[k] + 1}`, "pivot", { size: 14 }));
          return s;
        };
        steps.push({ t: "Array A, empty B", d: "Make B[1..n] all empty. Each A[i] will <b>guess</b> its final place in B.", cap: "A = (7, 2, 9, 4)", s: sc(0) });
        A.forEach((v, i) => steps.push({ t: `Guess a place for A[${i + 1}] = ${v}`, d: `j = Choice(1, n) gives <b>${place[i] + 1}</b>. B[${place[i] + 1}] is empty, so B[${place[i] + 1}] = ${v}. (If it were already filled ⇒ Failure().)`, cap: `B[${place[i] + 1}] = ${v}`, s: sc(i + 1) }));
        steps.push({ t: "Check: B is in order ⇒ Success()", d: "Checking stage: B[1] ≤ B[2] ≤ B[3] ≤ B[4] (2 ≤ 4 ≤ 7 ≤ 9) ⇒ print B, <b>Success()</b>. Guess n places + check n − 1 pairs ⇒ <b>O(n)</b>.", cap: "2 ≤ 4 ≤ 7 ≤ 9 ⇒ Success() · O(n)", s: [...sc(5, true), chip("ok", 450, 420, "Success()", "done", { size: 15 })] });
        return { w: W, h: H, steps };
      },
      exam: { def: "Non-deterministic sorting guesses the final position of every element with Choice(1, n), places it in B, and then checks that B is in non-decreasing order. Time O(n).", steps: ["Start.", "Read A[1..n]; set B[1..n] = 0 (empty).", "Repeat Step 4 for i = 1 to n.", "j = Choice(1, n); if B[j] is filled call Failure(), else B[j] = A[i].", "For i = 1 to n − 1, if B[i] > B[i + 1] call Failure().", "Print B and call Success().", "Stop."] },
    },
    {
      name: "0/1 Knapsack (decision)", time: "O(n)",
      build() {
        const p = [10, 7, 12], w = [4, 3, 6], m = 10, r = 20, path = [1, 0, 1], W = 900, H = 470, steps = [];
        const lab = (d, pre) => { const ww = pre.reduce((a, b, i) => a + b * w[i], 0); return String(ww); };
        const info = (k) => [panel("ip", 600, 40, 270, 200, { title: `m = ${m}   r = ${r}`, color: "#a98bff" }), label("ih", 620, 82, "i   p   w   x", { size: 13, anchor: "start", fill: "#9aa6d1" }), ...p.map((pi, i) => label("ir" + i, 620, 114 + i * 32, `${i + 1}  ${String(pi).padStart(2)}  ${String(w[i]).padStart(2)}   ${i < k ? path[i] : "?"}`, { size: 15, anchor: "start", fill: i < k ? "#ffd978" : "#eef2ff" }))];
        const tot = (k) => { let ww = 0, pp = 0; for (let i = 0; i < k; i++) { ww += path[i] * w[i]; pp += path[i] * p[i]; } return [ww, pp]; };
        steps.push({ t: "Decision question", d: `Is there a choice with <b>weight ≤ ${m}</b> and <b>profit ≥ ${r}</b>? Nodes show the weight W so far.`, cap: `p = (10, 7, 12) · w = (4, 3, 6)`, s: [...choiceTree(3, path, 0, 20, 50, lab, { leafW: 70, levelH: 110 }), ...info(0)] });
        for (let k = 1; k <= 3; k++) { const [ww, pp] = tot(k); steps.push({ t: `Guess x${k} = Choice(0, 1) → ${path[k - 1]}`, d: `${path[k - 1] ? `Take object ${k}` : `Leave object ${k}`}. W = ${ww}, P = ${pp}.`, cap: `x${k} = ${path[k - 1]} · W = ${ww} · P = ${pp}`, s: [...choiceTree(3, path, k, 20, 50, lab, { leafW: 70, levelH: 110 }), ...info(k)] }); }
        steps.push({ t: "Check ⇒ Success()", d: `W = 10 ≤ ${m} and P = 22 ≥ ${r} ⇒ <b>Success()</b>. n guesses + one check ⇒ <b>O(n)</b>.`, cap: "W = 10 ≤ 10, P = 22 ≥ 20 ⇒ Success() · O(n)", s: [...choiceTree(3, path, 3, 20, 50, lab, { leafW: 70, levelH: 110, final: true, ok: true }), ...info(3), chip("ok", 735, 300, "Success()", "done", { size: 15 })] });
        return { w: W, h: H, steps };
      },
      exam: { def: "Non-deterministic 0/1 knapsack (decision version) guesses x[i] = Choice(0, 1) for each object and then checks that the total weight ≤ m and the total profit ≥ r. Time O(n).", steps: ["Start.", "Read n, m, r, p[1..n], w[1..n]; W = 0, P = 0.", "Repeat Step 4 for i = 1 to n.", "x[i] = Choice(0, 1); W = W + x[i]·w[i]; P = P + x[i]·p[i].", "If W > m or P < r, call Failure(); else call Success().", "Stop."] },
    },
    {
      name: "Sum of subsets", time: "O(n)",
      build() {
        const wv = [4, 5, 7, 8], m = 15, path = [0, 0, 1, 1], W = 900, H = 470, steps = [];
        const lab = (d, pre) => String(pre.reduce((a, b, i) => a + b * wv[i], 0));
        steps.push({ t: "Target m = 15", d: "Numbers w = (4, 5, 7, 8). Each node shows the sum s so far. A deterministic search may look at all 2ⁿ = 16 leaves.", cap: "s = 0", s: [...choiceTree(4, path, 0, 30, 40, lab, { leafW: 52, levelH: 96 })] });
        for (let k = 1; k <= 4; k++) { const s = lab(k, path.slice(0, k)); steps.push({ t: `Guess x${k} = Choice(0, 1) → ${path[k - 1]}`, d: `${path[k - 1] ? `Include ${wv[k - 1]}` : `Skip ${wv[k - 1]}`} ⇒ s = ${s}.`, cap: `x${k} = ${path[k - 1]} · s = ${s}`, s: choiceTree(4, path, k, 30, 40, lab, { leafW: 52, levelH: 96 }) }); }
        steps.push({ t: "Check s = m ⇒ Success()", d: "s = 7 + 8 = 15 = m ⇒ <b>Success()</b>. Only one path of length n is followed ⇒ <b>O(n)</b>.", cap: "s = 15 ⇒ Success() · O(n)", s: [...choiceTree(4, path, 4, 30, 40, lab, { leafW: 52, levelH: 96, final: true, ok: true }), chip("ok", 450, 450, "Success()  — subset {7, 8}", "done", { size: 14 })] });
        return { w: W, h: H, steps };
      },
      exam: { def: "Non-deterministic sum of subsets guesses x[i] = Choice(0, 1) for every number, adds the chosen numbers and succeeds if the sum equals m. Time O(n).", steps: ["Start.", "Read n, w[1..n] and m; s = 0.", "Repeat Step 4 for i = 1 to n.", "x[i] = Choice(0, 1); s = s + x[i]·w[i].", "If s = m call Success(); else call Failure().", "Stop."] },
    },
  ],
  exam: {
    def: "A non-deterministic algorithm is one in which the result of some operations is not uniquely defined but limited to a set of possibilities. It uses Choice(S), Failure() and Success(), and works in two stages: guessing and checking. It succeeds if some sequence of choices leads to success; its time is the fewest steps needed to reach success.",
    steps: [],
  },
});

/* ---------- Reduction: Hamiltonian cycle ∝ TSP ---------- */
defAlgo({
  id: "hc-tsp", group: "np", title: "Reduction: Hamiltonian Cycle ∝ TSP", short: "costs 1 and 2",
  idea: "Turn graph G into a complete graph G′: edges of G cost 1, missing edges cost 2. G has a Hamiltonian cycle ⇔ G′ has a tour of cost ≤ n.",
  time: "conversion O(n²)", space: "O(n²)", pyq: "Question bank",
  variants: [{
    name: "5 vertices",
    build() {
      const W = 1000, H = 480, steps = [];
      const pt = (cx, cy, i) => [cx + 150 * Math.sin(i * 2 * Math.PI / 5), cy - 150 * Math.cos(i * 2 * Math.PI / 5)];
      const E = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [1, 3]];
      const has = (u, v) => E.some(([a, b]) => (a === u && b === v) || (a === v && b === u));
      const G = (tour) => { const s = [label("gt", 230, 30, "G (Hamiltonian cycle?)", { size: 15, fill: "#c9d3f5", sans: true })]; E.forEach(([u, v]) => s.push(edge(`g${u}${v}`, ...pt(230, 250, u - 1), ...pt(230, 250, v - 1), tour && tour.has([u, v].sort().join("")) ? "done" : "base", { r: 24 }))); for (let i = 1; i <= 5; i++) s.push(ball("gn" + i, ...pt(230, 250, i - 1), String(i), "base", { r: 24 })); return s; };
      const G2 = (show, tour, badEdge) => {
        const s = [label("ht", 740, 30, "G′ = complete graph", { size: 15, fill: "#c9d3f5", sans: true })];
        for (let u = 1; u <= 5; u++) for (let v = u + 1; v <= 5; v++) {
          const k = `${u}${v}`, one = has(u, v);
          if (!show && !one) continue;
          const inT = tour && tour.has(k);
          s.push(edge("h" + k, ...pt(740, 250, u - 1), ...pt(740, 250, v - 1), inT ? (badEdge === k ? "reject" : "done") : one ? "info" : "pivot", { r: 24, label: show ? (one ? 1 : 2) : undefined, dash: !one, lo: k === "13" ? [-10, -12] : k === "24" ? [10, -12] : k === "25" ? [0, 14] : k === "35" ? [10, 10] : k === "14" ? [-10, 10] : undefined }));
        }
        for (let i = 1; i <= 5; i++) s.push(ball("hn" + i, ...pt(740, 250, i - 1), String(i), "base", { r: 24 }));
        return s;
      };
      const T1 = new Set(["12", "23", "34", "45", "15"]);
      steps.push({ t: "Hamiltonian cycle question", d: "Given G with n = 5 vertices: is there a cycle through every vertex exactly once? HC is known to be <b>NP-complete</b>.", cap: "HC: known NP-complete", s: G() });
      steps.push({ t: "Copy the vertices", d: "Build G′ on the same 5 vertices. Every edge of G gets <b>cost 1</b> (blue).", cap: "edges of G ⇒ cost 1", s: [...G(), ...G2(false), edge("arr", 420, 250, 560, 250, "active", { r: 0, arrow: true, w: 4 })] });
      steps.push({ t: "Add the missing edges with cost 2", d: "Make G′ <b>complete</b>: every missing pair gets <b>cost 2</b> (violet, dashed). There are n(n − 1)/2 pairs ⇒ conversion takes <b>O(n²)</b>.", cap: "non-edges ⇒ cost 2 · O(n²)", s: [...G(), ...G2(true), edge("arr", 420, 250, 560, 250, "active", { r: 0, arrow: true, w: 4 })] });
      steps.push({ t: "Ask TSP: tour of cost ≤ n = 5?", d: "G has the cycle 1–2–3–4–5–1. In G′ the same tour uses only cost-1 edges ⇒ cost <b>5 ≤ n</b> ⇒ YES.", cap: "HC in G ⇒ tour of cost n in G′", s: [...G(T1), ...G2(true, T1), edge("arr", 420, 250, 560, 250, "active", { r: 0, arrow: true, w: 4 }), chip("c", 740, 450, "1 + 1 + 1 + 1 + 1 = 5 ≤ 5", "done", { size: 14 })] });
      const T2 = new Set(["12", "24", "34", "35", "15"]);
      steps.push({ t: "Other direction", d: "Any tour that uses a cost-2 edge costs ≥ 6 > n. So a tour of cost ≤ n uses only edges of G ⇒ it <b>is</b> a Hamiltonian cycle of G.", cap: "tour 1–2–4–3–5–1 = 1+2+1+2+1 = 7 > 5", s: [...G(), ...G2(true, T2, "24"), edge("arr", 420, 250, 560, 250, "active", { r: 0, arrow: true, w: 4 }), chip("c", 740, 450, "uses cost-2 edges ⇒ > 5", "reject", { size: 14 })] });
      steps.push({ t: "Conclusion: HC ∝ TSP", d: "G has a Hamiltonian cycle ⇔ G′ has a tour of cost ≤ n, and G′ is built in polynomial time. So <b>HC ∝ TSP</b> ⇒ TSP (decision) is <b>NP-hard</b>; a tour can be checked fast, so it is <b>NP-complete</b>.", cap: "HC ∝ TSP ⇒ TSP is NP-hard", s: [...G(T1), ...G2(true, T1), edge("arr", 420, 250, 560, 250, "active", { r: 0, arrow: true, w: 4 }), chip("c", 490, 450, "HC ∝ TSP  ⇒  TSP (decision) is NP-complete", "pink", { size: 14 })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "To show HC ∝ TSP: from G = (V, E) build a complete graph G′ on V with c(u, v) = 1 if (u, v) ∈ E and 2 otherwise (O(n²) time). G has a Hamiltonian cycle if and only if G′ has a tour of cost ≤ n. Hence TSP (decision) is NP-hard, and NP-complete since a tour can be checked in polynomial time.",
    steps: ["Start.", "Read the graph G = (V, E) with n vertices.", "Create a complete graph G′ on the same vertices.", "For every pair (u, v): if (u, v) ∈ E set cost 1, else set cost 2.", "Ask TSP: does G′ have a tour of cost ≤ n?", "Answer for HC = answer for TSP (yes ⇔ yes).", "Stop."],
  },
});

/* ---------- SAT and Cook's theorem ---------- */
defAlgo({
  id: "cook", group: "np", title: "Satisfiability & Cook's Theorem", short: "SAT is NP-complete",
  idea: "SAT asks whether a CNF formula can be made true. Cook's theorem: SAT is in P if and only if P = NP.",
  time: "Eval O(formula size)", space: "O(n)", pyq: "3×",
  variants: [{
    name: "(x₁ ∨ ¬x₂) ∧ (x₂ ∨ x₃) ∧ (¬x₁ ∨ ¬x₃)",
    build() {
      const W = 1000, H = 470, steps = [];
      const C = [[["x₁", 1, false], ["¬x₂", 2, true]], [["x₂", 2, false], ["x₃", 3, false]], [["¬x₁", 1, true], ["¬x₃", 3, true]]];
      const val = { 1: true, 2: true, 3: false };
      const formula = (k, evalOn) => {
        const s = [];
        C.forEach((cl, ci) => {
          const x0 = 70 + ci * 310;
          s.push(panel("cl" + ci, x0, 70, 260, 110, { title: `clause ${ci + 1}`, color: evalOn ? "#2ee6a6" : "#5a71b3" }));
          cl.forEach(([nm, v, neg], li) => {
            const known = v <= k, lv = known ? (neg ? !val[v] : val[v]) : null;
            s.push(block(`l${ci}${li}`, x0 + 20 + li * 125, 105, 100, 54, nm, !evalOn ? "base" : lv ? "done" : "reject", { size: 18, sub: evalOn ? (lv ? "T" : "F") : undefined }));
          });
          s.push(label("or" + ci, x0 + 130, 132, "∨", { size: 18, fill: "#9aa6d1" }));
          if (ci < 2) s.push(label("and" + ci, x0 + 285, 125, "∧", { size: 22, fill: "#ffd978" }));
          if (evalOn) s.push(chip("cv" + ci, x0 + 130, 225, "clause = T", "done", { size: 13 }));
        });
        for (let v = 1; v <= 3; v++) s.push(block("var" + v, 250 + (v - 1) * 180, 320, 140, 60, v <= k ? `x${["₁", "₂", "₃"][v - 1]} = ${val[v] ? "T" : "F"}` : `x${["₁", "₂", "₃"][v - 1]} = ?`, v <= k ? (val[v] ? "info" : "pink") : "ghost", { size: 17, top: v <= k ? "Choice(F, T)" : "" }));
        return s;
      };
      steps.push({ t: "CNF formula", d: "A formula in <b>CNF</b> is an AND (∧) of clauses; each clause is an OR (∨) of literals. <b>SAT</b>: can we give true/false values that make the whole formula true?", cap: "SAT: is the formula satisfiable?", s: formula(0, false) });
      for (let k = 1; k <= 3; k++) steps.push({ t: `Guess x${k}`, d: `Non-deterministic stage: x${k} = Choice(false, true) → <b>${val[k] ? "true" : "false"}</b>.`, cap: `x${k} = ${val[k] ? "T" : "F"}`, s: formula(k, false) });
      steps.push({ t: "Check: every clause is true", d: "(T ∨ F) ∧ (T ∨ F) ∧ (F ∨ T) = <b>true</b> ⇒ Success(). Checking takes polynomial time, so <b>SAT ∈ NP</b>.", cap: "formula = T ⇒ satisfiable ⇒ SAT ∈ NP", s: [...formula(3, true), chip("ok", 500, 430, "Success()", "done", { size: 15 })] });
      const pipe = [["Any problem L ∈ NP\nND algorithm A, input I", "base"], ["Build CNF Q(A, I)\nin polynomial time", "pivot"], ["Is Q\nsatisfiable?", "active"], ["yes ⇔ A succeeds\non I", "done"]];
      const pp = pipe.map(([s, t], i) => block("cp" + i, 20 + i * 245, 170, 215, 86, s, t, { sans: true, size: 14.5 }));
      const pe = range(3).map(i => edge("cpe" + i, 235 + i * 245, 213, 265 + i * 245, 213, "active", { r: 0, arrow: true }));
      steps.push({ t: "Cook's idea: every NP problem ∝ SAT", d: "For any L in NP with a polynomial ND algorithm A and input I, Cook built a CNF formula <b>Q(A, I)</b> that describes the whole run of A. <b>Q is satisfiable ⇔ A succeeds on I</b>. So L ∝ SAT for every L ∈ NP ⇒ SAT is NP-hard.", cap: "L ∝ SAT for every L ∈ NP", s: [...pp, ...pe] });
      steps.push({ t: "Cook's theorem", d: "SAT ∈ NP and SAT is NP-hard ⇒ <b>SAT is NP-complete</b> (the first one, 1971). Therefore <b>satisfiability is in P if and only if P = NP</b>.", cap: "SAT ∈ P  ⇔  P = NP", s: [...pp, ...pe, chip("th", 500, 360, "Satisfiability is in P  ⇔  P = NP", "pink", { size: 18, h: 44 })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Cook's theorem: satisfiability is in P if and only if P = NP. SAT ∈ NP (guess an assignment, check in polynomial time), and for every problem in NP with ND algorithm A and input I a CNF formula Q(A, I) can be built in polynomial time that is satisfiable iff A succeeds on I. So SAT is NP-complete.",
    steps: ["Start.", "Read the formula E with n variables.", "For each i = 1 to n, guess x[i] = Choice(false, true).", "Evaluate E with these values (polynomial time).", "If E is true call Success(); else call Failure().", "Stop."],
  },
});
