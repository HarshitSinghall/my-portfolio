/* =========================================================
   Harshit Singhal — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(max-width: 900px)").matches;

  /* ---------- custom cursor ---------- */
  if (!isTouch) {
    const cur = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    let cx = innerWidth / 2, cy = innerHeight / 2, dx = cx, dy = cy;
    addEventListener("mousemove", (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    });
    (function loop() {
      cx += (dx - cx) * 0.18; cy += (dy - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverSel = "a, button, [data-magnetic], [data-tilt], .node, .vid__placeholder";
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
    });
  }

  /* ---------- nav scrolled + scroll progress ---------- */
  const nav = document.getElementById("nav");
  const prog = document.getElementById("scrollProgress");
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .reveal-up").forEach((el) => io.observe(el));

  /* ---------- rotating hero word ---------- */
  const rotator = document.getElementById("rotator");
  if (rotator) {
    const words = ["automates", "validates", "answers", "qualifies", "decides", "scales"];
    let i = 0;
    const el = rotator.querySelector(".rotator__word");
    setInterval(() => {
      if (reduce) return;
      el.style.transition = "transform .4s var(--ease), opacity .4s";
      el.style.transform = "translateY(-60%) rotateX(40deg)";
      el.style.opacity = "0";
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.style.transition = "none";
        el.style.transform = "translateY(60%) rotateX(-40deg)";
        requestAnimationFrame(() => {
          el.style.transition = "transform .5s var(--ease), opacity .5s";
          el.style.transform = "none";
          el.style.opacity = "1";
        });
      }, 400);
    }, 2400);
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = 1400; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  /* ---------- magnetic buttons ---------- */
  if (!isTouch && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- project tilt + glow ---------- */
  if (!isTouch && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateY(${(px - .5) * 6}deg) rotateX(${(.5 - py) * 6}deg) translateY(-3px)`;
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- HERO node-network canvas ---------- */
  (function heroNet() {
    const cv = document.getElementById("heroCanvas");
    if (!cv || reduce) return;
    const ctx = cv.getContext("2d");
    let w, h, nodes = [], mouse = { x: -999, y: -999 };
    const DPR = Math.min(devicePixelRatio || 1, 2);

    function resize() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * DPR; cv.height = h * DPR; ctx.scale(DPR, DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(64, Math.floor((w * h) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * 0.25, vy: (Math.random() - .5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    }
    addEventListener("resize", resize);
    cv.parentElement.addEventListener("mousemove", (e) => {
      const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    cv.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dmx = mouse.x - n.x, dmy = mouse.y - n.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < 130) { n.x -= dmx / dm * 0.6; n.y -= dmy / dm * 0.6; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 128) {
            const o = (1 - d / 128) * 0.5;
            ctx.strokeStyle = `rgba(201,242,77,${o * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 130;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? "rgba(201,242,77,.9)" : "rgba(180,190,200,.5)";
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); frame();
  })();

  /* ---------- WORKFLOW wires + travelling pulse ---------- */
  (function flow() {
    const flow = document.getElementById("flow");
    const svg = document.getElementById("flowWires");
    if (!flow || !svg) return;

    // connections: outNode -> inNode
    const LINKS = [
      ["in-1", "engine"], ["in-2", "engine"], ["in-3", "engine"],
      ["engine", "llm"],
      ["llm", "out-1"], ["llm", "out-2"], ["llm", "out-3"],
    ];

    // index nodes for stagger
    flow.querySelectorAll(".node").forEach((n, i) => n.style.setProperty("--ni", i));

    let paths = [];

    function build() {
      const fr = flow.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${fr.width} ${fr.height}`);
      svg.innerHTML = `
        <defs>
          <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5d7bff"/>
            <stop offset="1" stop-color="#c9f24d"/>
          </linearGradient>
        </defs>`;
      paths = [];
      LINKS.forEach(([from, to]) => {
        const a = flow.querySelector(`[data-node="${from}"] .node__port--out`);
        const b = flow.querySelector(`[data-node="${to}"] .node__port--in`);
        if (!a || !b) return;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const x1 = ra.left + ra.width / 2 - fr.left, y1 = ra.top + ra.height / 2 - fr.top;
        const x2 = rb.left + rb.width / 2 - fr.left, y2 = rb.top + rb.height / 2 - fr.top;
        const dx = Math.abs(x2 - x1) * 0.5;
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        const base = document.createElementNS("http://www.w3.org/2000/svg", "path");
        base.setAttribute("d", d); base.setAttribute("class", "wire");
        svg.appendChild(base);
        const lit = document.createElementNS("http://www.w3.org/2000/svg", "path");
        lit.setAttribute("d", d); lit.setAttribute("class", "wire--lit");
        svg.appendChild(lit);
        paths.push(d);
      });
    }

    let started = false;
    function startPulses() {
      if (started || reduce) return; started = true;
      paths.forEach((d, idx) => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        p.setAttribute("r", "3.2"); p.setAttribute("class", "pulse");
        const am = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        am.setAttribute("dur", (2.4 + (idx % 3) * 0.25) + "s");
        am.setAttribute("repeatCount", "indefinite");
        am.setAttribute("path", d);
        am.setAttribute("begin", (idx * 0.18) + "s");
        am.setAttribute("calcMode", "spline");
        am.setAttribute("keyTimes", "0;1");
        am.setAttribute("keySplines", "0.4 0 0.2 1");
        p.appendChild(am); svg.appendChild(p);
      });
    }

    build();
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { started = false; build(); startPulses(); }, 200); });

    const fio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { flow.classList.add("in"); setTimeout(startPulses, 700); fio.unobserve(flow); }
      });
    }, { threshold: 0.25 });
    fio.observe(flow);
  })();

  /* ---------- video placeholder hint ---------- */
  const vp = document.getElementById("vidPlaceholder");
  if (vp) {
    const ping = () => {
      const hint = vp.querySelector(".vid__hint");
      if (hint) { hint.style.color = "var(--accent)"; setTimeout(() => hint.style.color = "", 900); }
    };
    vp.addEventListener("click", ping);
    vp.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ping(); } });
  }
})();
