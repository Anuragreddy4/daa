/* ===== DAA Visual Lab — router, pages, scroll-driven steps ===== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const view = $("#view");
  const algosOf = (gid) => ORDER.filter((id) => ALGOS[id].group === gid);
  const cache = new Map();
  function getBuild(id, vi) {
    const key = id + "#" + vi;
    if (!cache.has(key)) {
      try { cache.set(key, ALGOS[id].variants[vi].build()); }
      catch (e) { console.error("build failed", id, vi, e); cache.set(key, { w: 600, h: 200, steps: [{ t: "Could not draw this step", d: String(e), cap: "", s: [] }] }); }
    }
    return cache.get(key);
  }
  const h = (s) => String(s ?? "");

  /* ---------- sidebar ---------- */
  function buildSidebar() {
    const nav = $("#topics");
    nav.innerHTML = GROUPS.map((g) => `
      <div class="sg" style="--acc:${g.color}">
        <a class="sg-head" href="#topic-${g.id}" data-route="topic-${g.id}"><span class="sg-glyph">${g.glyph}</span><span class="sg-name">${g.name}</span><span class="sg-unit">${g.unit.replace("Unit ", "U")}</span></a>
        <ul>${algosOf(g.id).map((id) => `<li><a href="#${id}" data-route="${id}" data-q="${(ALGOS[id].title + " " + ALGOS[id].short).toLowerCase()}">${ALGOS[id].title}${STAR.has(id) ? '<span class="st" title="on ma\'am\'s list">★</span>' : ""}</a></li>`).join("")}</ul>
      </div>`).join("");
    $("#find").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      $$(".sg").forEach((sg) => {
        let any = false;
        $$("li", sg).forEach((li) => { const hit = !q || li.firstElementChild.dataset.q.includes(q); li.hidden = !hit; any = any || hit; });
        const gHit = !q || sg.querySelector(".sg-name").textContent.toLowerCase().includes(q);
        if (gHit && q) $$("li", sg).forEach((li) => (li.hidden = false));
        sg.hidden = !(any || gHit);
      });
    });
    $("#find").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const first = $$(".sg:not([hidden]) li:not([hidden]) a")[0]; if (first) { location.hash = first.getAttribute("href"); closeDrawer(); } }
    });
  }
  function markSidebar(route) {
    $$("#side a[data-route]").forEach((a) => a.classList.toggle("on", a.dataset.route === route));
  }
  const openDrawer = () => document.body.classList.add("drawer");
  const closeDrawer = () => document.body.classList.remove("drawer");
  $("#menu").addEventListener("click", () => document.body.classList.toggle("drawer"));
  $("#scrim").addEventListener("click", closeDrawer);
  $("#topics").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawer(); });

  /* ---------- home ---------- */
  function heroScene() {
    const s = [];
    const arr = [12, 5, 31, 8, 19, 3];
    arr.forEach((v, i) => s.push(block("ha" + i, 30 + i * 70, 40, 58, 58, String(v), ["base", "active", "base", "done", "info", "pink"][i], { size: 19 })));
    s.push(pointer("hp", 30 + 1 * 70 + 29, 104, "pivot", "active"));
    const T = { 1: [380, 190], 2: [300, 270], 3: [460, 270], 4: [255, 350], 5: [345, 350], 6: [505, 350] };
    [[1, 2, "done"], [1, 3, "done"], [2, 4, "base"], [2, 5, "done"], [3, 6, "reject"]].forEach(([a, b, t]) => s.push(edge(`he${a}${b}`, ...T[a], ...T[b], t, { r: 20 })));
    Object.entries(T).forEach(([k, p]) => s.push(ball("hn" + k, ...p, k, k === "6" ? "reject" : ["1", "2", "3", "5"].includes(k) ? "done" : "base", { r: 20 })));
    const M = [[0, 4, 11], [6, 0, 2], [3, 7, 0]];
    M.forEach((r, i) => r.forEach((v, j) => s.push(block(`hm${i}${j}`, 30 + j * 56, 170 + i * 56, 48, 48, String(v), i === j ? "ghost" : (i === 0 && j === 2) ? "active" : "pivot", { size: 16, depth: 4 }))));
    s.push(label("hl1", 114, 350, "Floyd · A³", { size: 13, fill: "#9aa6d1", sans: true }));
    s.push(label("hl2", 470, 410, "state space tree", { size: 13, fill: "#9aa6d1", sans: true }));
    return s;
  }
  function daysToExam() {
    const now = new Date(), ex = new Date(2026, 9, 30);
    const d = Math.round((new Date(ex.getFullYear(), ex.getMonth(), ex.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    return d === 1 ? "Exam tomorrow · 30 Oct" : d === 0 ? "Exam today · all the best" : d > 1 ? `Exam in ${d} days · 30 Oct` : "DAA · JNTUH R18";
  }
  function renderHome() {
    document.title = "DAA Visual Lab";
    markSidebar("home");
    const total = ORDER.length, starN = ORDER.filter((id) => STAR.has(id)).length;
    view.innerHTML = `
      <section class="hero wrap">
        <div class="hero-copy">
          <p class="eyebrow"><span class="pulse"></span>${daysToExam()}</p>
          <h1>Every DAA algorithm, played one step at a time.</h1>
          <p class="lead">Open a topic, pick an algorithm and scroll. Each scroll moves the picture one step: blocks glide, trees grow, tables fill. Nothing plays until you scroll.</p>
          <div class="hero-stats">
            <span><b>${total}</b> algorithms</span><span><b>${GROUPS.length}</b> topics</span><span><b>${starN}</b> <i class="st">★</i> on ma'am's list</span>
          </div>
          <div class="hero-cta"><a class="btn" href="#topic-dc">Start with Divide and Conquer</a><a class="btn ghost" href="#mst">Open Prim &amp; Kruskal</a></div>
        </div>
        <div class="hero-art" aria-hidden="true"><svg class="scene" id="heroSvg"></svg></div>
      </section>
      <section class="wrap">
        <h2 class="sec-title">Topics</h2>
        <div class="ggrid">${GROUPS.map((g) => `
          <a class="gcard" href="#topic-${g.id}" style="--acc:${g.color}">
            <span class="gc-top"><span class="gc-unit">${g.unit}</span><span class="gc-glyph">${g.glyph}</span></span>
            <span class="gc-name">${g.name}</span>
            <span class="gc-tag">${g.tag}</span>
            <span class="gc-list">${algosOf(g.id).map((id) => `<span>${ALGOS[id].title}</span>`).join("")}</span>
            <span class="gc-go">${algosOf(g.id).length} algorithms <span aria-hidden="true">→</span></span>
          </a>`).join("")}</div>
      </section>
      <section class="wrap how">
        <h2 class="sec-title">How to use it</h2>
        <ol class="howto">
          <li><b>Pick</b> a topic, read "What is …?" and its control abstraction.</li>
          <li><b>Open</b> an algorithm. If it has two methods (Prim / Kruskal), use the tabs.</li>
          <li><b>Scroll</b> to play each step, or press <kbd>→</kbd> / <kbd>←</kbd>.</li>
          <li><b>Finish</b> with the exam answer: definition, Step 1 … Stop, and complexity.</li>
        </ol>
      </section>`;
    const svg = $("#heroSvg"); makeStage(svg); renderScene(svg, heroScene(), 560, 430, true);
    tilt();
  }
  function tilt() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$(".gcard, .acard").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
        c.style.setProperty("--mx", `${(x + 0.5) * 100}%`); c.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      });
      c.addEventListener("pointerleave", () => { c.style.transform = ""; });
    });
  }

  /* ---------- topic page ---------- */
  function stepsList(steps) {
    return `<ol class="steps">${steps.map((s, i) => `<li><span class="sn">Step ${i + 1}:</span> ${s}</li>`).join("")}</ol>`;
  }
  function renderGroup(g) {
    document.title = `${g.name} · DAA Visual Lab`;
    markSidebar("topic-" + g.id);
    const ids = algosOf(g.id);
    const table = g.table ? (g.table.rows.length
      ? `<div class="card-b"><h3>${g.table.title}</h3><div class="tscroll"><table><thead><tr>${g.table.head.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${g.table.rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`
      : `<div class="card-b"><h3>${g.table.title}</h3><p class="chain">${g.table.head.map((x) => `<span>${x}</span>`).join("<i>&lt;</i>")}</p></div>`) : "";
    view.innerHTML = `
      <section class="topic" style="--acc:${g.color}">
        <div class="t-band"><div class="wrap">
          <nav class="crumbs"><a href="#home">Home</a><span>/</span><span>${g.unit}</span></nav>
          <h1><span class="t-glyph">${g.glyph}</span>${g.name}</h1>
          <p class="lead">${g.tag}</p>
        </div></div>
        <div class="wrap t-body">
          <div class="t-grid">
            <article class="card-b what"><p class="eyebrow">Definition</p><h2>${g.what.q}</h2><p>${g.what.a}</p>${g.formula ? `<p class="formula">${g.formula}</p>` : ""}</article>
            ${g.abstraction ? `<article class="card-b"><p class="eyebrow">Control abstraction</p><h3>${g.abstraction.title}</h3>${stepsList(g.abstraction.steps)}</article>` : ""}
            ${g.terms ? `<article class="card-b"><p class="eyebrow">Key terms</p><dl class="terms">${g.terms.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl></article>` : ""}
            ${table}
          </div>
          <h2 class="sec-title">${g.name}: ${ids.length} algorithm${ids.length > 1 ? "s" : ""}</h2>
          <div class="agrid">${ids.map((id) => { const a = ALGOS[id]; const n = a.variants.reduce((t, v, vi) => t + getBuild(id, vi).steps.length, 0); return `
            <a class="acard" href="#${id}">
              <span class="thumb"><svg class="scene" data-thumb="${id}"></svg><span class="badge">▶ ${n} steps${a.variants.length > 1 ? ` · ${a.variants.length} methods` : ""}</span></span>
              <span class="ac-body"><span class="ac-title">${a.title}${STAR.has(id) ? ' <i class="st" title="on ma\'am\'s list">★</i>' : ""}</span><span class="ac-short">${a.short}</span>
              ${a.variants.length > 1 ? `<span class="ac-vars">${a.variants.map((v) => `<span>${v.name}</span>`).join("")}</span>` : ""}
              <span class="ac-time">${a.time}</span></span>
            </a>`; }).join("")}</div>
        </div>
      </section>`;
    $$("svg[data-thumb]").forEach((svg) => {
      const b = getBuild(svg.dataset.thumb, 0);
      makeStage(svg); renderScene(svg, b.steps[b.steps.length - 1].s, b.w, b.h, true);
    });
    tilt();
  }

  /* ---------- algorithm page ---------- */
  let S = null; // scrolly state
  function renderAlgo(a, vi) {
    const g = GROUP[a.group];
    document.title = `${a.title} · DAA Visual Lab`;
    markSidebar(a.id);
    vi = Math.max(0, Math.min(vi, a.variants.length - 1));
    const idx = ORDER.indexOf(a.id), prev = ALGOS[ORDER[idx - 1]], next = ALGOS[ORDER[idx + 1]];
    view.innerHTML = `
      <section class="algo" style="--acc:${g.color}">
        <div class="wrap a-head">
          <nav class="crumbs"><a href="#home">Home</a><span>/</span><a href="#topic-${g.id}">${g.name}</a><span>/</span><span>${g.unit}</span></nav>
          <h1>${a.title}${STAR.has(a.id) ? ' <i class="st big" title="on ma\'am\'s list">★</i>' : ""}</h1>
          <p class="idea" id="idea"></p>
          <div class="facts" id="facts"></div>
          ${a.variants.length > 1 ? `<div class="tabs" role="tablist" aria-label="Methods">${a.variants.map((v, i) => `<button role="tab" class="tab" id="tab-${i}" data-vi="${i}" aria-selected="${i === vi}">${v.name}</button>`).join("")}</div>` : ""}
          <a class="whatlink" href="#topic-${g.id}">${g.what.q} →</a>
        </div>
        <div class="scrolly wrap" id="scrolly">
          <div class="stage-col"><div class="stage" id="stage">
            <div class="hud">
              <span class="count" id="count"></span><span class="stitle" id="stitle"></span>
              <span class="hud-nav"><button class="ib" id="bprev" aria-label="Previous step">‹</button><button class="ib" id="bnext" aria-label="Next step">›</button></span>
            </div>
            <div class="svgbox"><svg class="scene" id="scene" preserveAspectRatio="xMidYMid meet"></svg></div>
            <div class="cap" id="cap"></div>
            <div class="prog" id="prog"></div>
          </div></div>
          <ol class="cards" id="cards"></ol>
        </div>
        <section class="wrap exam" id="exam"></section>
        <nav class="wrap pn">
          ${prev ? `<a class="pn-a" href="#${prev.id}"><small>Previous</small>${prev.title}</a>` : "<span></span>"}
          ${next ? `<a class="pn-a nx" href="#${next.id}"><small>Next</small>${next.title}</a>` : "<span></span>"}
        </nav>
      </section>`;
    $$(".tab").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.vi; history.replaceState(null, "", "#" + a.id + (i ? "-v" + (i + 1) : "")); loadVariant(a, i, true); }));
    $("#bprev").addEventListener("click", () => go(-1));
    $("#bnext").addEventListener("click", () => go(1));
    loadVariant(a, vi, false);
    window.scrollTo(0, 0);
  }
  function loadVariant(a, vi, keepScroll) {
    const v = a.variants[vi], b = getBuild(a.id, vi);
    $$(".tab").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.vi === vi)));
    $("#idea").innerHTML = v.idea || a.idea;
    const facts = [["Time", v.time || a.time], ["Space", v.space || a.space], ["Asked", a.pyq]].filter(([, x]) => x && x !== "—");
    $("#facts").innerHTML = facts.map(([k, x]) => `<span class="fact"><i>${k}</i>${x}</span>`).join("");
    $("#cards").innerHTML = b.steps.map((s, i) => `
      <li class="card" data-i="${i}"><span class="num">Step ${i + 1} <em>of ${b.steps.length}</em></span><h3>${s.t}</h3><p>${s.d}</p></li>`).join("") +
      `<li class="card end"><span class="num">Done</span><h3>That's the whole run.</h3><p>Scroll on for the answer to write in the exam.</p></li>`;
    $("#prog").innerHTML = b.steps.map((s, i) => `<button class="seg" data-i="${i}" aria-label="Go to step ${i + 1}: ${s.t.replace(/"/g, "")}"></button>`).join("");
    $$("#prog .seg").forEach((sg) => sg.addEventListener("click", () => scrollToStep(+sg.dataset.i)));
    $$("#cards .card:not(.end)").forEach((c) => c.addEventListener("click", () => scrollToStep(+c.dataset.i)));
    const svg = $("#scene");
    makeStage(svg);
    S = { a, vi, b, cur: -1, svg, cards: $$("#cards .card:not(.end)") };
    $("#scene").setAttribute("viewBox", `0 0 ${b.w} ${b.h}`);
    $("#stage").style.setProperty("--ar", `${b.w} / ${b.h}`);
    show(0, true);
    renderExam(a, v);
    if (keepScroll) { const top = $("#scrolly").getBoundingClientRect().top + scrollY - 70; if (scrollY > top) window.scrollTo({ top, behavior: "auto" }); }
    requestAnimationFrame(onScroll);
  }
  function show(i, instant) {
    if (!S || i === S.cur) return;
    const st = S.b.steps[i];
    S.cur = i;
    renderScene(S.svg, st.s, S.b.w, S.b.h, instant);
    $("#count").textContent = `Step ${i + 1} / ${S.b.steps.length}`;
    $("#stitle").textContent = st.t;
    $("#cap").textContent = st.cap || "";
    $$("#prog .seg").forEach((sg, k) => { sg.classList.toggle("on", k <= i); sg.classList.toggle("now", k === i); });
    S.cards.forEach((c, k) => c.classList.toggle("active", k === i));
    $("#bprev").disabled = i === 0; $("#bnext").disabled = i === S.b.steps.length - 1;
  }
  const isWide = () => matchMedia("(min-width: 1100px)").matches;
  function triggerY() {
    if (isWide()) return innerHeight * 0.52;
    const st = $("#stage"); return st ? st.getBoundingClientRect().bottom + 70 : innerHeight * 0.6;
  }
  let ticking = false;
  function onScroll() {
    ticking = false;
    if (!S || !document.body.contains(S.svg)) return;
    const ty = triggerY();
    let a = 0;
    S.cards.forEach((c, k) => { if (c.getBoundingClientRect().top < ty) a = k; });
    show(a, false);
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", () => requestAnimationFrame(onScroll));
  function scrollToStep(i) {
    if (!S) return;
    i = Math.max(0, Math.min(i, S.cards.length - 1));
    const c = S.cards[i], ty = triggerY();
    const top = c.getBoundingClientRect().top + scrollY - ty + (isWide() ? 40 : 24);
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
  }
  function go(d) { if (S) scrollToStep(S.cur + d); }
  document.addEventListener("keydown", (e) => {
    if (!S || !document.body.contains(S.svg) || e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight" || e.key === "j") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft" || e.key === "k") { e.preventDefault(); go(-1); }
  });
  function renderExam(a, v) {
    const ve = v.exam, ae = a.exam || {};
    const def = ve ? ve.def : ae.def;
    const steps = (ve && ve.steps && ve.steps.length ? ve.steps : ae.steps) || [];
    const extra = ve && ae.def && ae.def !== ve.def ? `<div class="card-b"><p class="eyebrow">Also define</p><p>${ae.def}</p></div>` : "";
    const title = a.variants.length > 1 ? v.name : a.title;
    $("#exam").innerHTML = `
      <h2 class="sec-title">Write this in the exam</h2>
      <div class="exam-grid">
        <div class="card-b"><p class="eyebrow">Definition · ${title}</p><p class="def">${def || ""}</p></div>
        ${extra}
        ${steps.length ? `<div class="card-b"><p class="eyebrow">Algorithm in steps</p>${stepsList(steps)}</div>` : ""}
        <div class="card-b cx"><p class="eyebrow">Complexity</p><dl class="terms"><div><dt>Time</dt><dd>${v.time || a.time}</dd></div><div><dt>Space</dt><dd>${v.space || a.space}</dd></div>${a.pyq ? `<div><dt>Asked</dt><dd>${a.pyq}</dd></div>` : ""}</dl></div>
      </div>`;
  }

  /* ---------- router ---------- */
  function route() {
    const hs = decodeURIComponent(location.hash.slice(1));
    if (S && hs.replace(/-v\d+$/, "") === S.a.id && document.body.contains(S.svg)) {
      const m = hs.match(/-v(\d+)$/); const vi = m ? +m[1] - 1 : 0;
      if (vi !== S.vi) loadVariant(S.a, vi, true);
      return;
    }
    S = null;
    if (!hs || hs === "home") { window.scrollTo(0, 0); return renderHome(); }
    if (hs.startsWith("topic-") && GROUP[hs.slice(6)]) { window.scrollTo(0, 0); return renderGroup(GROUP[hs.slice(6)]); }
    const m = hs.match(/^(.*?)(?:-v(\d+))?$/);
    if (m && ALGOS[m[1]]) return renderAlgo(ALGOS[m[1]], m[2] ? +m[2] - 1 : 0);
    if (ALGOS[hs]) return renderAlgo(ALGOS[hs], 0);
    renderHome();
  }
  buildSidebar();
  $("#topExam").textContent = daysToExam();
  window.addEventListener("hashchange", route);
  route();
})();
