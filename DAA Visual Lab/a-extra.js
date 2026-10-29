/* ===== Unit 1 — performance analysis (time & space complexity) ===== */
defAlgo({
  id: "step-count", group: "basics", title: "Time & Space Complexity", short: "step count table",
  idea: "Count how many times each step runs (frequency × steps per execution) to get the time; count the memory words to get the space.",
  time: "Sum of n numbers: 2n + 3 = O(n)", space: "S(n) = n + 3", pyq: "Part A: very important",
  variants: [{
    name: "sum of n numbers (n = 5)",
    build() {
      const W = 980, H = 500, n = 5, steps = [];
      const rows = [["Step 1: s = 0", 1, "1", 1], ["Step 2: repeat for i = 1 to n", 1, "n + 1", n + 1], ["Step 3: s = s + a[i]", 1, "n", n], ["Step 4: return s", 1, "1", 1]];
      const cx = [40, 470, 590, 760], cw = [410, 100, 150, 150], y0 = 96, rh = 62;
      const head = ["statement", "s/e", "frequency", "total"].map((h, j) => label("th" + j, cx[j] + (j ? cw[j] / 2 : 12), 62, h, { size: 13, fill: "#9aa6d1", anchor: j ? "middle" : "start", sans: true }));
      const table = (cols, hl = -1, opts = {}) => {
        const s = [...head];
        rows.forEach((r, i) => {
          s.push(block("st" + i, cx[0], y0 + i * rh, cw[0], rh - 12, r[0], i === hl ? "active" : "base", { size: 14.5, sans: true, depth: 4 }));
          if (cols > 0) s.push(block("se" + i, cx[1], y0 + i * rh, cw[1], rh - 12, String(r[1]), "dim", { size: 16, depth: 3 }));
          if (cols > 1) s.push(block("fq" + i, cx[2], y0 + i * rh, cw[2], rh - 12, opts.num ? String(r[3]) : r[2], i === hl ? "active" : "info", { size: 16, depth: 3 }));
          if (cols > 2) s.push(block("tt" + i, cx[3], y0 + i * rh, cw[3], rh - 12, opts.num ? String(r[3]) : r[2], "done", { size: 16, depth: 3 }));
        });
        return s;
      };
      steps.push({ t: "The algorithm", d: "Sum of n numbers a[1..n]. To find its <b>time complexity</b> we count steps. Write every statement in a table.", cap: "time complexity = total number of steps", s: table(0) });
      steps.push({ t: "s/e: steps per execution", d: "Each statement here is one basic step, so <b>s/e = 1</b>. (A comment or 'begin/end' counts 0.)", cap: "s/e = 1 for each statement", s: table(1) });
      steps.push({ t: "Frequency of Step 2 = n + 1", d: "The loop test runs for i = 1, 2, …, n and <b>once more</b> when i = n + 1 to stop the loop ⇒ <b>n + 1</b> times. Step 3 inside the loop runs <b>n</b> times.", cap: "loop test: n + 1 · loop body: n", s: table(2, 1) });
      steps.push({ t: "Total = s/e × frequency", d: "Multiply each row and add: 1 + (n + 1) + n + 1 = <b>2n + 3</b>.", cap: "T(n) = 1 + (n + 1) + n + 1 = 2n + 3", s: [...table(3), chip("sum", 835, y0 + 4 * rh + 18, "2n + 3", "active", { w: 150, size: 17, h: 36 })] });
      steps.push({ t: `Check with n = ${n}`, d: `With n = ${n}: 1 + ${n + 1} + ${n} + 1 = <b>${2 * n + 3}</b> = 2·${n} + 3. The biggest term is n ⇒ time <b>O(n)</b>.`, cap: `n = ${n}: T = ${2 * n + 3} · O(n)`, s: [...table(3, -1, { num: true }), chip("sum", 835, y0 + 4 * rh + 18, `${2 * n + 3}`, "active", { w: 150, size: 17, h: 36 })] });
      const mem = (show) => {
        const s = [panel("mp", 40, 60, 900, 380, { title: "MEMORY (1 word each)", color: "#a98bff" })];
        ["s", "i", "n"].forEach((v, i) => s.push(block("mv" + v, 80 + i * 110, 120, 90, 60, v, "pivot", { size: 20, sub: "fixed part" })));
        range(n).forEach(i => s.push(block("ma" + i, 450 + i * 92, 120, 80, 60, `a[${i + 1}]`, show ? "info" : "dim", { size: 15, sub: i === 2 ? "variable part (n words)" : "" })));
        s.push(bracket("br1", 80, 300, 230, "c = 3", "pivot"));
        s.push(bracket("br2", 450, 450 + n * 92 - 12, 230, "Sₚ(n) = n", "info"));
        s.push(chip("sp", 490, 330, "S(n) = c + Sₚ(n) = 3 + n", "done", { size: 18, h: 44 }));
        s.push(label("spn", 490, 390, `n = ${n}  ⇒  ${n + 3} words  ⇒  space O(n)`, { size: 15, fill: "#c9d3f5" }));
        return s;
      };
      steps.push({ t: "Space complexity S(P) = c + Sₚ", d: "<b>Fixed part c</b>: simple variables s, i, n ⇒ 3 words. <b>Variable part Sₚ(n)</b>: the array a needs n words. So <b>S(n) = n + 3 = O(n)</b>.", cap: "S(n) = 3 + n  ⇒  O(n)", s: mem(true) });
      return { w: W, h: H, steps };
    }
  }],
  exam: {
    def: "Time complexity of an algorithm is the amount of computer time it needs to run to completion, found by counting program steps (step count). Space complexity is the amount of memory it needs: S(P) = c + Sₚ(instance), where c is the fixed part (code, simple variables, constants) and Sₚ is the variable part (arrays, recursion stack).",
    steps: ["Start.", "Write every statement of the algorithm in a table.", "For each statement write s/e (steps per execution) and its frequency (how many times it runs).", "Total of a row = s/e × frequency.", "Add all totals to get T(n); keep the biggest term for the order (2n + 3 ⇒ O(n)).", "For space, add the fixed part c and the variable part Sₚ(n).", "Stop."],
  },
});
