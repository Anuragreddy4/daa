/* ===== Unit 1 — Analysis basics + Divide & Conquer ===== */

/* ---------- Asymptotic notations ---------- */
defAlgo({
  id: "asymptotic", group: "basics", title: "Asymptotic Notations", short: "O, Ω, Θ",
  idea: "Compare how fast running time grows for large n. Only the biggest term matters.",
  time: "—", space: "—", pyq: "Part A: very important (conditions)",
  variants: [{
    name: "O, Ω, Θ on one graph",
    build() {
      const W = 760, H = 430, ox = 70, oy = 370, sx = 62, sy = 3.2;
      const P = (n, v) => [ox + n * sx, oy - v * sy];
      const curve = (fn, a = 0.3, b = 10) => { let d = ""; for (let i = 0; i <= 80; i++) { const n = a + (b - a) * i / 80; const [x, y] = P(n, Math.min(fn(n), 112)); d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1); } return d; };
      const f = n => 0.62 * n * n + 6 * Math.sin(n * 1.25) + 9;
      const up = n => 1.0 * n * n + 10, lo = n => 0.36 * n * n + 2;
      const axes = { k: "axes", x: 0, y: 0, z: 0, svg: `<path d="M${ox},${oy} H${ox + 10.6 * sx} M${ox},${oy} V${oy - 112 * sy}" stroke="#56689f" stroke-width="2" marker-end="url(#m-base)"/>` + txt(ox + 10.6 * sx, oy + 22, "n (input size) →", { size: 13, fill: "#9aa6d1", anchor: "end", sans: true }) + txt(ox - 14, oy - 112 * sy + 6, "time", { size: 13, fill: "#9aa6d1", anchor: "end", sans: true }) };
      const path = (k, d, c, wd = 3.4, dash) => ({ k, x: 0, y: 0, z: 1, svg: `<path d="${d}" stroke="${c}" stroke-width="${wd}" fill="none" stroke-linecap="round"${dash ? ' stroke-dasharray="9 7"' : ""}/>` });
      const fC = path("f", curve(f), "#ff7d96", 3.8);
      const n0x = P(3, 0)[0];
      const n0 = { k: "n0", x: 0, y: 0, z: 0, svg: `<path d="M${n0x},${oy} V${oy - 110 * sy}" stroke="#7d8bc2" stroke-width="1.6" stroke-dasharray="4 5"/>` + txt(n0x, oy + 18, "n₀", { size: 15, fill: "#c7d0f5" }) };
      const lab = (k, n, fn, s, c) => { const [x, y] = P(n, Math.min(fn(n), 108)); return label(k, x + 8, y - 14, s, { size: 14, fill: c, anchor: "start" }); };
      const steps = [
        { t: "The running time f(n)", d: "The pink curve is the real running time f(n) of some algorithm. It wiggles for small n. We only care what happens <b>after some point n₀</b>, when n is large.", cap: "f(n) = actual number of steps", s: [axes, fC, lab("lf", 9.6, f, "f(n)", "#ff7d96")] },
        { t: "Big-Oh (O) — upper bound", d: "f(n) = O(g(n)) if there are constants <b>c</b> and <b>n₀</b> with <b>f(n) ≤ c·g(n) for all n ≥ n₀</b>. The amber curve is a ceiling: after n₀, f(n) never goes above it. Worst-case growth.", cap: "f(n) ≤ c·g(n)  for all n ≥ n₀", s: [axes, fC, lab("lf", 9.6, f, "f(n)", "#ff7d96"), path("up", curve(up), "#ffc94a", 3.2, true), lab("lu", 8.6, up, "c·g(n)", "#ffc94a"), n0] },
        { t: "Omega (Ω) — lower bound", d: "f(n) = Ω(g(n)) if <b>f(n) ≥ c·g(n) for all n ≥ n₀</b>. The green curve is a floor: f(n) always stays above it. Best-case growth.", cap: "f(n) ≥ c·g(n)  for all n ≥ n₀", s: [axes, fC, lab("lf", 9.6, f, "f(n)", "#ff7d96"), path("lo", curve(lo), "#2ee6a6", 3.2, true), lab("ll", 9.6, lo, "c·g(n)", "#2ee6a6"), n0] },
        { t: "Theta (Θ) — tight bound", d: "f(n) = Θ(g(n)) if <b>c₁·g(n) ≤ f(n) ≤ c₂·g(n) for all n ≥ n₀</b>. f(n) is sandwiched between the two curves, so it grows <b>exactly</b> like g(n).", cap: "c₁·g(n) ≤ f(n) ≤ c₂·g(n)  for all n ≥ n₀", s: [axes, fC, lab("lf", 9.6, f, "f(n)", "#ff7d96"), path("up", curve(up), "#ffc94a", 3.2, true), lab("lu", 8.6, up, "c₂·g(n)", "#ffc94a"), path("lo", curve(lo), "#2ee6a6", 3.2, true), lab("ll", 9.6, lo, "c₁·g(n)", "#2ee6a6"), n0] },
        { t: "Example: 100n³ + 4n² + 6", d: "For n ≥ 1: 4n² ≤ 4n³ and 6 ≤ 6n³, so 100n³ + 4n² + 6 ≤ 110n³. Take <b>c = 110, n₀ = 1</b> ⇒ <b>O(n³)</b>. Also ≥ 100n³ ⇒ Θ(n³).", cap: "100n³ + 4n² + 6 ≤ 110·n³  (c = 110, n₀ = 1)  ⇒  O(n³)", s: [axes, fC, lab("lf", 9.6, f, "f(n)", "#ff7d96"), path("up", curve(up), "#ffc94a", 3.2, true), lab("lu", 8.6, up, "c₂·g(n)", "#ffc94a"), path("lo", curve(lo), "#2ee6a6", 3.2, true), lab("ll", 9.6, lo, "c₁·g(n)", "#2ee6a6"), n0, chip("ex", 300, 40, "Order: 1 < log n < n < n log n < n² < n³ < 2ⁿ < n!", "pivot", { size: 12.5 })] },
      ];
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Big-Oh: f(n) = O(g(n)) iff there exist positive constants c and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀. Omega: f(n) ≥ c·g(n) for all n ≥ n₀. Theta: c₁·g(n) ≤ f(n) ≤ c₂·g(n) for all n ≥ n₀.",
    steps: ["Start.", "Write the function f(n) and choose g(n) = its biggest term.", "Find constants c and n₀ that satisfy the condition (≤ for O, ≥ for Ω, both for Θ).", "State the result, e.g. 100n³ + 4n² + 6 = O(n³) with c = 110, n₀ = 1.", "Stop."],
  },
});

/* ---------- Recurrence by substitution ---------- */
defAlgo({
  id: "recurrence", group: "basics", title: "Recurrence — Substitution Method", short: "T(n) = 2T(n/2) + cn",
  idea: "Keep replacing T( ) by its own formula until T(1) appears, then add everything up.",
  time: "O(n log n) for merge sort", space: "—", pyq: "Ma'am: 'for sure'",
  variants: [{
    name: "Merge sort recurrence",
    build() {
      const W = 820, H = 470;
      const lines = [
        "T(n) = 2T(n/2) + cn",
        "     = 2[2T(n/4) + cn/2] + cn = 4T(n/4) + 2cn",
        "     = 8T(n/8) + 3cn",
        "     = 2ᵏ T(n/2ᵏ) + k·cn",
        "put n = 2ᵏ (k = log₂n):  T(n) = n·T(1) + cn·log₂n",
        "T(n) = O(n log n)",
      ];
      const lvl = (L, tone) => {
        const k = 2 ** L, items = [], y = 60 + L * 70, span = 470;
        const wd = Math.min(86, span / k - 8);
        for (let i = 0; i < k; i++) {
          const x = 30 + (i + 0.5) * span / k - wd / 2;
          items.push(block(`n${L}-${i}`, x, y, wd, 36, L === 0 ? "cn" : L === 1 ? "cn/2" : L === 2 ? "cn/4" : "cn/8", tone, { size: L >= 3 ? 11 : 14 }));
          if (L > 0) { const px = 30 + (Math.floor(i / 2) + 0.5) * span / (k / 2); items.push({ k: `e${L}-${i}`, x: 0, y: 0, z: 0, svg: `<path d="M${px},${y - 34} L${x + wd / 2},${y}" stroke="#4a5c97" stroke-width="1.6"/>` }); }
        }
        items.push(chip(`s${L}`, 600, y + 18, "level cost = cn", "info", { w: 150 }));
        return items;
      };
      const eq = (upto) => lines.slice(0, upto + 1).map((s, i) => label(`l${i}`, 30, 340 + i * 21 - (upto > 3 ? (upto - 3) * 0 : 0), s, { size: 14, anchor: "start", fill: i === upto ? "#ffd978" : "#c9d3f5" }));
      const steps = [];
      let acc = [];
      for (let L = 0; L < 4; L++) {
        acc = [];
        for (let q = 0; q <= L; q++) acc = acc.concat(lvl(q, q === L ? "active" : "base"));
        const desc = ["Start with the recurrence of merge sort: two halves of size n/2 plus cn work to merge.",
          "Substitute T(n/2) = 2T(n/4) + cn/2. The tree grows one level: two nodes each doing cn/2 work.",
          "Substitute again: 8T(n/8) + 3cn. Every level still adds <b>cn</b> in total.",
          "After k substitutions: T(n) = 2ᵏT(n/2ᵏ) + k·cn. The pattern is clear."][L];
        steps.push({ t: ["Write the recurrence", "Substitute once", "Substitute twice", "General k-th step"][L], d: desc, cap: lines[Math.min(L, 3)], s: [...acc, ...eq(Math.min(L, 3))] });
      }
      steps.push({ t: "Stop at T(1)", d: "The sub-problem becomes size 1 when n/2ᵏ = 1, i.e. <b>k = log₂ n</b>. Then 2ᵏ = n, so T(n) = n·T(1) + cn·log₂ n.", cap: lines[4], s: [...acc, ...eq(4)] });
      steps.push({ t: "Answer", d: "log₂ n levels × cn work per level ⇒ <b>T(n) = O(n log n)</b>. Same method gives quick sort worst case T(n) = T(n−1) + cn ⇒ O(n²) and Strassen 7T(n/2) + an² ⇒ O(n^2.81).", cap: "T(n) = O(n log n)", s: [...acc, ...eq(5), chip("ans", 640, 420, "O(n log n)", "done", { size: 16, w: 170, h: 34 })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "The substitution (iteration) method solves a recurrence by repeatedly expanding T(·) using the recurrence itself until the base case T(1) is reached, and then summing the terms.",
    steps: ["Start.", "Write the recurrence, e.g. T(n) = 2T(n/2) + cn.", "Substitute T(n/2), then T(n/4), … and simplify each time.", "Write the general form after k substitutions: 2ᵏT(n/2ᵏ) + k·cn.", "Choose k so the argument becomes 1 (n = 2ᵏ, k = log₂ n).", "Simplify to get T(n) = an + cn log n = O(n log n).", "Stop."],
  },
});

/* ---------- Binary search ---------- */
defAlgo({
  id: "binary-search", group: "dc", title: "Binary Search", short: "halve the sorted array",
  idea: "Look at the middle. Throw away the half that cannot contain the key. Repeat.",
  time: "O(log n)", space: "O(1) iterative · O(log n) recursive", pyq: "2× + Part A",
  variants: [{
    name: "key = 14",
    build() {
      const A = [2, 4, 7, 8, 10, 13, 14, 60], key = 14, cw = 72, x0 = 46, y0 = 120, W = x0 * 2 + A.length * cw, H = 300;
      const cx = (i) => x0 + i * cw + (cw - 12) / 2;
      const scene = (lo, hi, mid, found, note) => {
        const s = [chip("key", 90, 36, `key = ${key}`, "pivot", { w: 120 })];
        A.forEach((v, i) => {
          let tone = (i < lo || i > hi) ? "dim" : "base";
          if (i === mid) tone = found ? "done" : "active";
          s.push(block("c" + i, x0 + i * cw, y0, cw - 12, 58, v, tone, { top: String(i + 1) }));
        });
        if (lo <= hi || found) {
          s.push(pointer("plow", cx(lo), y0 + 66, "low", "info"));
          s.push(pointer("phigh", cx(hi), y0 + 66, "high", "info"));
        }
        if (mid >= 0) s.push(pointer("pmid", cx(mid), y0 - 26, "mid", found ? "done" : "active", { up: true }));
        if (note) s.push(chip("note", W / 2, 262, note, found ? "done" : "base", { size: 13 }));
        return s;
      };
      const steps = [{ t: "Start", d: "The array must be <b>sorted</b>. Set <b>low = 1</b> and <b>high = 8</b>. The key we want is 14.", cap: "low = 1 · high = 8", s: scene(0, 7, -1, false, "search range = positions 1 … 8") }];
      let lo = 0, hi = 7, it = 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (A[mid] === key) {
          steps.push({ t: `Iteration ${it}: found`, d: `mid = ⌊(${lo + 1} + ${hi + 1})/2⌋ = <b>${mid + 1}</b>. a[${mid + 1}] = ${A[mid]} = key ⇒ <b>found at position ${mid + 1}</b>.`, cap: `mid = ${mid + 1} · a[mid] = ${A[mid]} = key ⇒ FOUND`, s: scene(lo, hi, mid, true, `found at position ${mid + 1} after ${it} comparisons`) });
          break;
        }
        const goRight = key > A[mid];
        steps.push({ t: `Iteration ${it}: compare with the middle`, d: `mid = ⌊(${lo + 1} + ${hi + 1})/2⌋ = <b>${mid + 1}</b>, a[${mid + 1}] = ${A[mid]}. Key ${key} ${goRight ? ">" : "<"} ${A[mid]}, so the key can only be in the <b>${goRight ? "right" : "left"} half</b>: ${goRight ? `low = ${mid + 2}` : `high = ${mid}`}.`, cap: `mid = ${mid + 1} · a[mid] = ${A[mid]} ${goRight ? "<" : ">"} ${key} ⇒ ${goRight ? "low = mid + 1 = " + (mid + 2) : "high = mid − 1 = " + mid}`, s: scene(lo, hi, mid, false, goRight ? `${key} > ${A[mid]} → go right` : `${key} < ${A[mid]} → go left`) });
        if (goRight) lo = mid + 1; else hi = mid - 1;
        it++;
      }
      steps.push({ t: "Why it is fast", d: "Each comparison throws away half: n → n/2 → n/4 → … → 1. That is log₂ n steps. <b>T(n) = T(n/2) + c ⇒ O(log n)</b>. Best case O(1) when the key is the first middle.", cap: "T(n) = T(n/2) + c  ⇒  O(log n)", s: scene(6, 6, 6, true, "8 elements → only 3 comparisons") });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Binary search is a divide-and-conquer searching method for a sorted array: compare the key with the middle element; if equal, stop; if smaller, search the left half; otherwise search the right half. Time complexity O(log n).",
    steps: ["Start.", "Read the sorted array a[1..n] and the key x.", "Set low = 1 and high = n.", "If low > high, go to Step 8.", "Find mid = ⌊(low + high)/2⌋.", "If x = a[mid], print 'found at mid' and go to Step 9.", "If x < a[mid], set high = mid − 1, else set low = mid + 1. Go to Step 4.", "Print 'key not found'.", "Stop."],
  },
});

/* ---------- Merge sort ---------- */
defAlgo({
  id: "merge-sort", group: "dc", title: "Merge Sort", short: "divide, sort halves, merge",
  idea: "Split the list in half again and again until single items remain, then merge the sorted pieces back together.",
  time: "O(n log n) — best, average, worst", space: "O(n)", pyq: "2× (Dec 22, Nov 20)",
  variants: [{
    name: "65 70 60 75 85 80 55 50 45 57",
    build() {
      const data = [65, 70, 60, 75, 85, 80, 55, 50, 45, 57], n = data.length;
      const levels = [[[0, n - 1]]];
      for (;;) { const nxt = []; let done = true; for (const [lo, hi] of levels[levels.length - 1]) { if (lo < hi) { const m = Math.floor((lo + hi) / 2); nxt.push([lo, m], [m + 1, hi]); done = false; } else nxt.push([lo, hi]); } if (done) break; levels.push(nxt); }
      const D = levels.length, cw = 50, gap = 16, x0 = 40, rh = 62, y0 = 30;
      const segX = (lv, lo) => x0 + lo * cw + levels[lv].filter(([a, b]) => b < lo).length * gap;
      const W = segX(D - 1, n - 1) + cw + 40, H = y0 + (2 * D - 1) * rh + 20;
      const trail = [];
      const order = (lv, sorted) => { const pos = {}; for (const [lo, hi] of levels[lv]) { let idx = range(hi - lo + 1, lo); if (sorted) idx.sort((a, b) => data[a] - data[b]); idx.forEach((orig, k) => { pos[orig] = { x: segX(lv, lo + k) }; }); } return pos; };
      const steps = [];
      const live = (lv, row, sorted, tone) => { const p = order(lv, sorted); return data.map((v, i) => block("v" + i, p[i].x, y0 + row * rh, cw - 6, 42, v, tone, { size: 15 })); };
      const ghost = (lv, row, sorted) => { const p = order(lv, sorted); return data.map((v, i) => block(`g${row}-${i}`, p[i].x, y0 + row * rh, cw - 6, 42, v, "ghost", { size: 13, depth: 0 })); };
      const segTxt = (lv, sorted) => levels[lv].map(([lo, hi]) => "[" + (sorted ? data.slice(lo, hi + 1).sort((a, b) => a - b) : data.slice(lo, hi + 1)).join(" ") + "]").join(" ");
      let tr = [];
      steps.push({ t: "Input", d: "Start with the unsorted list of 10 numbers. Merge sort first <b>divides</b> it.", cap: segTxt(0, false), s: [...live(0, 0, false, "base"), label("lab", W - 30, y0 + 21, "input", { size: 12, fill: "#9aa6d1", anchor: "end", sans: true })] });
      for (let lv = 1; lv < D; lv++) {
        tr = tr.concat(ghost(lv - 1, lv - 1, false));
        const last = lv === D - 1;
        steps.push({ t: last ? `Divide ${lv}: single elements` : `Divide ${lv}`, d: last ? "Every piece now has one element. <b>A list of one element is already sorted.</b> Now we merge back up." : `Split every piece at <b>mid = ⌊(low + high)/2⌋</b>: ${segTxt(lv, false)}`, cap: segTxt(lv, false), s: [...tr, ...live(lv, lv, false, last ? "active" : "base")] });
      }
      for (let k = 0; k < D - 1; k++) {
        const lv = D - 2 - k, row = D + k;
        tr = tr.concat(ghost(lv + 1, row - 1, k > 0));
        const fin = lv === 0;
        steps.push({ t: fin ? "Final merge" : `Merge ${k + 1}`, d: fin ? "Merge the two sorted halves with two pointers: always copy the smaller front element. The list is sorted." : `Merge neighbouring sorted pieces: compare front elements, copy the smaller one first. Result: ${segTxt(lv, true)}`, cap: segTxt(lv, true), s: [...tr, ...live(lv, row, true, fin ? "done" : "info")] });
      }
      steps.push({ t: "Time complexity", d: "Dividing is free; merging n items costs cn at every level, and there are log₂ n levels. <b>T(n) = 2T(n/2) + cn ⇒ O(n log n)</b> in every case. Extra array b[ ] ⇒ space O(n).", cap: "T(n) = 2T(n/2) + cn  ⇒  O(n log n)", s: [...tr, ...live(0, 2 * D - 2, true, "done")] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Merge sort is a divide-and-conquer sorting algorithm that divides the array into two halves, sorts each half recursively and merges the two sorted halves. Time O(n log n) in all cases; space O(n).",
    steps: ["Start.", "If low ≥ high (one element), stop.", "Divide: mid = ⌊(low + high)/2⌋.", "Sort the left half a[low..mid] using merge sort.", "Sort the right half a[mid+1..high] using merge sort.", "Merge: compare a[i] and a[j], copy the smaller to b; copy the rest; copy b back to a.", "Stop."],
  },
});

/* ---------- Quick sort ---------- */
defAlgo({
  id: "quick-sort", group: "dc", title: "Quick Sort", short: "partition around a pivot",
  idea: "Pick a pivot, move smaller items left and bigger items right, so the pivot lands in its final place. Repeat on both sides.",
  time: "O(n log n) avg · O(n²) worst", space: "O(log n)", pyq: "5× (most asked in Unit 1)",
  variants: [{
    name: "50 30 90 20 80 10 70 40 60",
    build() {
      const a = [50, 30, 90, 20, 80, 10, 70, 40, 60], n = a.length, cw = 70, x0 = 40, y0 = 120, W = x0 * 2 + n * cw, H = 320;
      const fixed = new Set(), steps = [];
      const cx = (i) => x0 + i * cw + (cw - 12) / 2;
      const scene = (lo, hi, piv, ptr, note, hl = {}) => {
        const s = [];
        a.forEach((v, i) => {
          let tone = fixed.has(v) ? "done" : (i < lo || i > hi) ? "dim" : "base";
          if (piv !== null && v === piv && !fixed.has(v)) tone = "pivot";
          if (hl[i]) tone = hl[i];
          s.push(block("q" + v, x0 + i * cw, y0, cw - 12, 58, v, tone, { top: String(i + 1) }));
        });
        if (lo !== null && lo <= hi) s.push(bracket("br", x0 + lo * cw - 2, x0 + hi * cw + cw - 10, y0 + 92, `QuickSort(${lo + 1}, ${hi + 1})`));
        if (ptr) { if (ptr.i !== undefined && ptr.i < n) s.push(pointer("pi", cx(ptr.i), y0 - 26, "i", "info", { up: true })); if (ptr.j !== undefined) s.push(pointer("pj", cx(ptr.j), y0 - 26, "j", "pink", { up: true })); }
        if (note) s.push(chip("note", W / 2, 286, note, "base", { size: 13 }));
        return s;
      };
      EDGE.pink = "#ff8ad8";
      steps.push({ t: "Start", d: "Unsorted array of 9 numbers. The pivot is always the <b>first element</b> of the current part.", cap: a.join("  "), s: scene(0, n - 1, null, null, "pivot = first element of each part") });
      const qs = (lo, hi) => {
        if (lo > hi) return;
        if (lo === hi) { fixed.add(a[lo]); steps.push({ t: `Single element ${a[lo]}`, d: `The part a[${lo + 1}] has one element (${a[lo]}). It is already in its final place.`, cap: `${a[lo]} is fixed`, s: scene(lo, hi, null, null, `${a[lo]} fixed`) }); return; }
        const piv = a[lo]; let i = lo + 1, j = hi;
        steps.push({ t: `Partition ${lo + 1}…${hi + 1}: choose pivot ${piv}`, d: `pivot = a[${lo + 1}] = <b>${piv}</b>. Put <b>i = ${lo + 2}</b> and <b>j = ${hi + 1}</b>. i moves right over items ≤ pivot, j moves left over items &gt; pivot.`, cap: `pivot = ${piv} · i = ${lo + 2} · j = ${hi + 1}`, s: scene(lo, hi, piv, { i, j }, `pivot = ${piv}`) });
        for (;;) {
          while (i <= hi && a[i] <= piv) i++;
          while (a[j] > piv) j--;
          if (i < j) {
            steps.push({ t: `i stops at ${a[i]}, j stops at ${a[j]}`, d: `a[i] = ${a[i]} &gt; ${piv} and a[j] = ${a[j]} ≤ ${piv}. Both are on the wrong side and <b>i &lt; j</b>, so swap them.`, cap: `i = ${i + 1} (${a[i]}) · j = ${j + 1} (${a[j]}) · i < j ⇒ swap`, s: scene(lo, hi, piv, { i, j }, `swap ${a[i]} ↔ ${a[j]}`, { [i]: "active", [j]: "active" }) });
            [a[i], a[j]] = [a[j], a[i]];
            steps.push({ t: "Swapped", d: `Now ${a[i]} is on the left side and ${a[j]} on the right side. Continue moving i and j.`, cap: a.slice(lo, hi + 1).join("  "), s: scene(lo, hi, piv, { i, j }, "continue", { [i]: "active", [j]: "active" }) });
          } else {
            steps.push({ t: `i (${i < n ? i + 1 : "end"}) has crossed j (${j + 1})`, d: `i ≥ j, so partitioning is over. Swap the pivot ${piv} with a[j] = ${a[j]}.`, cap: `i ≥ j ⇒ swap pivot with a[${j + 1}]`, s: scene(lo, hi, piv, { i, j }, `swap pivot ${piv} ↔ ${a[j]}`, { [j]: j === lo ? "pivot" : "active" }) });
            [a[lo], a[j]] = [a[j], a[lo]]; fixed.add(piv);
            steps.push({ t: `Pivot ${piv} is in its final place`, d: `Everything left of position ${j + 1} is ≤ ${piv}; everything right is &gt; ${piv}. Now sort the left part and the right part the same way.`, cap: `${piv} fixed at position ${j + 1}`, s: scene(lo, hi, null, null, `[${a.slice(lo, j).join(" ")}]  ${piv}  [${a.slice(j + 1, hi + 1).join(" ")}]`) });
            qs(lo, j - 1); qs(j + 1, hi); return;
          }
        }
      };
      qs(0, n - 1);
      steps.push({ t: "Sorted — and the time complexity", d: "Best/average: pivot near the middle ⇒ T(n) = 2T(n/2) + cn ⇒ <b>O(n log n)</b>. Worst: already sorted input ⇒ T(n) = T(n−1) + cn ⇒ <b>O(n²)</b>.", cap: "best/avg O(n log n) · worst O(n²)", s: scene(null, -1, null, null, "10 20 30 40 50 60 70 80 90") });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Quick sort is a divide-and-conquer sorting algorithm that selects a pivot, partitions the array so that smaller elements are on its left and larger on its right, and recursively sorts the two parts. Time O(n log n) best/average, O(n²) worst.",
    steps: ["Start.", "If low ≥ high, stop.", "Set pivot = a[low], i = low + 1, j = high.", "Move i right while a[i] ≤ pivot; move j left while a[j] > pivot.", "If i < j, swap a[i] and a[j] and go to Step 4.", "Swap a[low] with a[j]; the pivot is now at position j.", "Quick sort the left part a[low..j−1] and the right part a[j+1..high].", "Stop."],
  },
});

/* ---------- Strassen ---------- */
defAlgo({
  id: "strassen", group: "dc", title: "Strassen's Matrix Multiplication", short: "7 multiplications instead of 8",
  idea: "Split each matrix into four blocks and get the answer with 7 multiplications instead of 8.",
  time: "O(n^2.81)", space: "O(n²)", pyq: "6× (most asked overall)",
  variants: [{
    name: "A = [1 3; 7 5], B = [6 8; 4 2]",
    build() {
      const A = [[1, 3], [7, 5]], B = [[6, 8], [4, 2]];
      const W = 900, H = 470, cs = 64;
      const grid = (pre, x, y, M, name, tones = {}) => {
        const s = [label(pre + "n", x + cs, y - 22, name, { size: 15, fill: "#c9d3f5", sans: true })];
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) s.push(block(`${pre}${i}${j}`, x + j * (cs + 8), y + i * (cs + 8), cs, cs, M[i][j] === null ? "?" : M[i][j], tones[`${i}${j}`] || (pre === "C" ? "info" : "base"), { size: 20, sub: `${pre}${i + 1}${j + 1}`, subFill: "#7f8bb8" }));
        return s;
      };
      const prods = [
        ["P", "(A11 + A22)(B11 + B22)", "(1+5)(6+2)", 48, ["00", "11"], ["00", "11"]],
        ["Q", "(A21 + A22) B11", "(7+5)·6", 72, ["10", "11"], ["00"]],
        ["R", "A11 (B12 − B22)", "1·(8−2)", 6, ["00"], ["01", "11"]],
        ["S", "A22 (B21 − B11)", "5·(4−6)", -10, ["11"], ["10", "00"]],
        ["T", "(A11 + A12) B22", "(1+3)·2", 8, ["00", "01"], ["11"]],
        ["U", "(A21 − A11)(B11 + B12)", "(7−1)(6+8)", 84, ["10", "00"], ["00", "01"]],
        ["V", "(A12 − A22)(B21 + B22)", "(3−5)(4+2)", -12, ["01", "11"], ["10", "11"]],
      ];
      const cs_ = [["C11", "P + S − T + V", "48 − 10 − 8 − 12", 18, "00", ["P", "S", "T", "V"]], ["C12", "R + T", "6 + 8", 14, "01", ["R", "T"]], ["C21", "Q + S", "72 − 10", 62, "10", ["Q", "S"]], ["C22", "P + R − Q + U", "48 + 6 − 72 + 84", 66, "11", ["P", "R", "Q", "U"]]];
      const C = [[null, null], [null, null]];
      const steps = [];
      const prodList = (upto, hl = []) => prods.slice(0, upto).map((p, i) => block("p" + p[0], 470, 30 + i * 52, 400, 42, `${p[0]} = ${p[1]} = ${p[3]}`, hl.includes(p[0]) ? "active" : "pivot", { size: 13.5, depth: 4 }));
      const base = (tA = {}, tB = {}) => [...grid("A", 30, 60, A, "A", tA), label("x", 196, 96, "×", { size: 26, fill: "#9aa6d1" }), ...grid("B", 230, 60, B, "B", tB)];
      steps.push({ t: "Split into blocks", d: "Each n × n matrix is split into four n/2 × n/2 blocks: A11, A12, A21, A22 and B11 … B22. Here n = 2, so every block is one number.", cap: "A11=1 A12=3 A21=7 A22=5 · B11=6 B12=8 B21=4 B22=2", s: [...base(), ...grid("C", 120, 300, C, "C = A × B")] });
      prods.forEach((p, k) => {
        const tA = {}, tB = {}; p[4].forEach(c => tA[c] = "active"); p[5].forEach(c => tB[c] = "active");
        steps.push({ t: `Product ${p[0]}`, d: `<b>${p[0]} = ${p[1]}</b> = ${p[2]} = <b>${p[3]}</b>. Highlighted cells are the ones used.`, cap: `${p[0]} = ${p[2]} = ${p[3]}`, s: [...base(tA, tB), ...prodList(k + 1, [p[0]]), ...grid("C", 120, 300, C, "C = A × B")] });
      });
      cs_.forEach((c) => {
        C[+c[4][0]][+c[4][1]] = c[3];
        const t = {}; t[c[4]] = "done";
        steps.push({ t: `${c[0]} = ${c[1]}`, d: `${c[0]} = ${c[1]} = ${c[2]} = <b>${c[3]}</b>.`, cap: `${c[0]} = ${c[2]} = ${c[3]}`, s: [...base(), ...prodList(7, c[5]), ...grid("C", 120, 300, C, "C = A × B", t)] });
      });
      steps.push({ t: "Why it is faster", d: "Normal method: 8 multiplications ⇒ T(n) = 8T(n/2) + bn² ⇒ O(n³). Strassen: <b>7 multiplications</b> ⇒ T(n) = 7T(n/2) + an² ⇒ <b>O(n^log₂7) = O(n^2.81)</b>. Check: 1·6 + 3·4 = 18 ✓.", cap: "7T(n/2) + an²  ⇒  O(n^2.81)", s: [...base(), ...prodList(7), ...grid("C", 120, 300, C, "C = A × B", { "00": "done", "01": "done", "10": "done", "11": "done" })] });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Strassen's method multiplies two n × n matrices by splitting each into four n/2 × n/2 blocks and computing the product with only 7 multiplications (P, Q, R, S, T, U, V) and 18 additions/subtractions. T(n) = 7T(n/2) + an² ⇒ O(n^2.81).",
    steps: ["Start.", "Read the n × n matrices A and B.", "If n is 1 (or 2), multiply directly and stop.", "Split A and B into four n/2 × n/2 blocks.", "Compute P, Q, R, S, T, U, V recursively.", "C11 = P + S − T + V, C12 = R + T, C21 = Q + S, C22 = P + R − Q + U.", "Join the blocks into C and return C.", "Stop."],
  },
});
