/* ===== Topic groups (what is X?, control abstraction, key tables) ===== */
const GROUPS = [
  {
    id: "basics", name: "Introduction", unit: "Unit 1", color: "#a98bff", glyph: "∑",
    tag: "algorithm · complexity · notations",
    what: { q: "What is an algorithm?", a: "An algorithm is a finite set of instructions that, if followed, accomplishes a particular task. Every algorithm must satisfy five criteria: <b>input</b> (zero or more), <b>output</b> (at least one), <b>definiteness</b> (each step is clear), <b>finiteness</b> (it stops after a finite number of steps) and <b>effectiveness</b> (each step is basic enough to be done)." },
    terms: [
      ["Time complexity", "the amount of computer time an algorithm needs to run to completion, counted as the number of steps (step count) as a function of n."],
      ["Space complexity", "the amount of memory it needs: S(P) = c + Sₚ(n), a fixed part c (code, simple variables) plus a variable part Sₚ (arrays, recursion stack)."],
      ["Big-Oh O", "f(n) = O(g(n)) if f(n) ≤ c·g(n) for all n ≥ n₀ — upper bound (worst case)."],
      ["Omega Ω", "f(n) = Ω(g(n)) if f(n) ≥ c·g(n) for all n ≥ n₀ — lower bound (best case)."],
      ["Theta Θ", "f(n) = Θ(g(n)) if c₁·g(n) ≤ f(n) ≤ c₂·g(n) for all n ≥ n₀ — tight bound."],
    ],
    table: { title: "Order of growth (slow → fast)", head: ["1", "log n", "n", "n log n", "n²", "n³", "2ⁿ", "n!"], rows: [] },
  },
  {
    id: "dc", name: "Divide and Conquer", unit: "Unit 1", color: "#4cc9ff", glyph: "÷",
    tag: "split · solve · combine",
    what: { q: "What is divide and conquer?", a: "Divide and conquer <b>divides</b> a problem of size n into k smaller sub-problems of the same kind, <b>solves</b> each sub-problem (recursively), and <b>combines</b> the sub-solutions into the solution of the whole problem. If a sub-problem is small enough it is solved directly." },
    abstraction: { title: "DAndC(P) — control abstraction", steps: ["Start.", "If P is small, solve it directly and return the answer.", "Otherwise divide P into smaller instances P₁, P₂, …, Pₖ.", "Apply DAndC to each of P₁ … Pₖ.", "Combine the answers of P₁ … Pₖ into the answer of P and return it.", "Stop."] },
    formula: "T(n) = g(n) if n is small;  T(n) = T(n₁) + T(n₂) + … + T(nₖ) + f(n) otherwise",
    apps: ["Binary search", "Merge sort", "Quick sort", "Strassen's matrix multiplication", "Finding max and min"],
  },
  {
    id: "greedy", name: "Greedy Method", unit: "Unit 2", color: "#2ee6a6", glyph: "◆",
    tag: "best choice now, never go back",
    what: { q: "What is the greedy method?", a: "The greedy method builds a solution step by step, always taking the choice that looks <b>best at that moment</b> (locally optimal) and never undoing it, hoping to reach a globally optimal solution. A <b>feasible solution</b> satisfies all constraints; an <b>optimal solution</b> is a feasible solution with the best value of the objective function." },
    abstraction: { title: "Greedy(a, n) — control abstraction", steps: ["Start.", "Read the n inputs a[1..n]; solution = empty.", "Repeat Steps 4–5 for i = 1 to n.", "SELECT the best remaining input x and remove it from a.", "If FEASIBLE(solution ∪ x), solution = UNION(solution, x); else reject x.", "Return the solution.", "Stop."] },
    terms: [["Objective function", "the value to maximise or minimise (profit, cost)."], ["Constraints", "the rules the answer must obey (capacity, deadline)."], ["Relaxation", "improving a distance: if d[u] + cost(u, v) < d[v], set d[v] = d[u] + cost(u, v)."], ["Spanning tree", "a sub-graph that is a tree and contains all n vertices (n − 1 edges, no cycle)."]],
    apps: ["Knapsack (fractional)", "Job sequencing with deadlines", "Minimum spanning tree — Prim, Kruskal", "Single source shortest path — Dijkstra", "Optimal merge patterns, Huffman codes"],
  },
  {
    id: "dp", name: "Dynamic Programming", unit: "Unit 3", color: "#ffc94a", glyph: "▦",
    tag: "solve each sub-problem once, store it",
    what: { q: "What is dynamic programming?", a: "Dynamic programming solves a problem by breaking it into <b>overlapping sub-problems</b>, solving each sub-problem <b>only once</b>, and storing the answers in a <b>table</b> to build the final answer. It works when the problem obeys the <b>principle of optimality</b>: whatever the first decision is, the remaining decisions must be optimal for the state that results from it." },
    terms: [["Optimal substructure", "the best solution contains best solutions of its sub-problems."], ["Overlapping sub-problems", "the same sub-problems appear many times."], ["Tabulation", "answers are stored in a table, usually filled bottom-up."]],
    table: { title: "Greedy method vs dynamic programming", head: ["Greedy method", "Dynamic programming"], rows: [["One decision at a time, never revised", "Considers many decision sequences"], ["Locally best choice", "Uses the principle of optimality"], ["Does not always give the optimal answer", "Always gives the optimal answer"], ["Faster, less memory", "Slower, needs a table"], ["e.g. fractional knapsack, Prim, Dijkstra", "e.g. 0/1 knapsack, Floyd, OBST, TSP"]] },
    apps: ["Chained matrix multiplication", "All pairs shortest path (Floyd)", "Optimal binary search tree", "0/1 knapsack", "Reliability design", "Travelling salesperson"],
  },
  {
    id: "graphs", name: "Sets & Graphs", unit: "Unit 4", color: "#ff8a5c", glyph: "⌘",
    tag: "union-find · AND/OR · components",
    what: { q: "What are disjoint sets?", a: "Sets are <b>disjoint</b> if no element is in more than one set, e.g. {1, 7, 8, 9}, {2, 5, 10}, {3, 4, 6}. Each set is stored as a <b>tree</b> (parent array p[ ]; the root is the set's name, p[root] = −1). The two operations are <b>Union(i, j)</b> — join two sets — and <b>Find(i)</b> — return the root of the set containing i." },
    terms: [["Articulation point", "a vertex whose removal (with its edges) disconnects the graph."], ["Biconnected graph", "a connected graph with no articulation point."], ["Connected component", "a maximal connected sub-graph; found by BFS/DFS in O(n + e)."], ["AND/OR graph", "a problem graph where an AND node needs all children solved and an OR node needs any one; checking solvability is O(n) for a tree."]],
    apps: ["Disjoint set union & find", "AND/OR graphs", "Connected components & spanning trees", "Biconnected components & articulation points"],
  },
  {
    id: "bt", name: "Backtracking", unit: "Unit 4", color: "#ff6b9a", glyph: "↶",
    tag: "build, test, undo",
    what: { q: "What is backtracking?", a: "Backtracking builds the solution vector (x₁, …, xₙ) <b>one component at a time</b>. After each choice a <b>bounding function</b> tests whether the partial vector can still lead to an answer; if not, the node is killed and the algorithm <b>goes back</b> to try the next choice. The search is a depth-first walk of the <b>state space tree</b>." },
    abstraction: { title: "Backtrack(k) — recursive control abstraction", steps: ["Start (call Backtrack(1)).", "For each value x[k] allowed by the explicit constraints, repeat Steps 3–4.", "If the bounding function Bₖ(x[1..k]) is true, go to Step 4; otherwise try the next value.", "If x[1..k] is an answer, print it; if k < n, call Backtrack(k + 1).", "When all values are tried, return (backtrack).", "Stop."] },
    terms: [["State space tree", "the tree of all partial solutions; every node is a problem state."], ["Live node", "generated but not all children generated yet."], ["E-node", "the live node whose children are being generated now."], ["Dead node", "killed, or all its children generated."], ["Explicit / implicit constraints", "allowed values of each xᵢ / how the xᵢ relate to each other."]],
    apps: ["N-queens", "Sum of subsets", "Graph colouring", "Hamiltonian cycles"],
  },
  {
    id: "bb", name: "Branch and Bound", unit: "Unit 5", color: "#8fa8ff", glyph: "⋔",
    tag: "generate all children, prune by bound",
    what: { q: "What is branch and bound?", a: "Branch and bound searches the state space tree by making a live node the <b>E-node</b> and generating <b>all</b> its children at once (branch). For every node a <b>bound</b> on the best answer below it is computed; nodes whose bound is worse than the best answer found so far are <b>killed</b> (bound). The next E-node is chosen by <b>FIFO</b> (queue), <b>LIFO</b> (stack) or <b>LC</b> (least ĉ)." },
    abstraction: { title: "LC search — control abstraction", steps: ["Start: the root is the only live node.", "If no live node is left, stop.", "Choose the next E-node (FIFO / LIFO / least ĉ).", "Generate all children of the E-node and compute their bounds.", "Kill children whose bound is worse than upper; add the rest to the live list.", "Go to Step 2."] },
    table: { title: "Backtracking vs branch and bound", head: ["Backtracking", "Branch and bound"], rows: [["Depth-first search", "FIFO / LIFO / least-cost search"], ["E-node makes one child at a time", "E-node makes all children at once"], ["Decision / all-solutions problems", "Optimisation problems"], ["Kills by feasibility", "Kills by feasibility and cost bound"], ["Less memory", "More memory (many live nodes)"]] },
    apps: ["0/1 knapsack — LC and FIFO", "Travelling salesperson"],
  },
  {
    id: "np", name: "NP-Hard & NP-Complete", unit: "Unit 6", color: "#e95fbf", glyph: "∞",
    tag: "P · NP · reductions · Cook",
    what: { q: "What are P, NP, NP-hard and NP-complete?", a: "<b>P</b>: decision problems solvable by a deterministic algorithm in polynomial time. <b>NP</b>: decision problems solvable by a non-deterministic algorithm in polynomial time (P ⊆ NP). <b>NP-hard</b>: every NP problem reduces to it (SAT ∝ L). <b>NP-complete</b>: NP-hard <b>and</b> in NP." },
    terms: [["Choice(S)", "picks an element of S — a correct one if possible — in O(1)."], ["Success() / Failure()", "end the algorithm successfully / unsuccessfully."], ["Reduction L₁ ∝ L₂", "any instance of L₁ converts in polynomial time to an instance of L₂ with the same answer."]],
    apps: ["P, NP, NP-hard, NP-complete", "Non-deterministic algorithms", "HC ∝ TSP", "SAT and Cook's theorem"],
  },
];
const GROUP = Object.fromEntries(GROUPS.map(g => [g.id, g]));
/* topics on ma'am's important list */
const STAR = new Set(["step-count", "asymptotic", "recurrence", "merge-sort", "quick-sort", "strassen", "knapsack-greedy", "job-sequencing", "mst", "dijkstra", "matrix-chain", "floyd", "obst", "knapsack-01", "reliability", "tsp-dp", "disjoint-sets", "and-or", "components", "biconnected", "n-queens", "sum-subsets", "graph-colouring", "hamiltonian", "bb-knapsack", "tsp-bb", "np-classes", "nd-algos"]);
