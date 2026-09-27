(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lerp = (a, b, t) => a + (b - a) * t;

  function fit(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function setupStars(canvas) {
    let { ctx, w, h } = fit(canvas);
    const n = 120;
    const stars = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2,
      a: 0.15 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
    }));
    window.addEventListener("resize", () => { ({ ctx, w, h } = fit(canvas)); });
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.fillStyle = "#f0efec";
        ctx.globalAlpha = s.a * (0.55 + Math.sin(t / 900 + s.tw) * 0.45);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function setupCursor(canvas) {
    let { ctx, w, h } = fit(canvas);
    const m = { x: w / 2, y: h / 2, tx: w / 2, ty: h / 2 };
    window.addEventListener("pointermove", (e) => { m.tx = e.clientX; m.ty = e.clientY; }, { passive: true });
    window.addEventListener("resize", () => { ({ ctx, w, h } = fit(canvas)); });
    function tick() {
      m.x = lerp(m.x, m.tx, 0.18);
      m.y = lerp(m.y, m.ty, 0.18);
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = "#f0efec";
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1;
      ctx.arc(m.x, m.y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.globalAlpha = 0.9;
      ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "#f0efec";
      ctx.fill();
      requestAnimationFrame(tick);
    }
    tick();
  }

  const bg = document.getElementById("fx-bg");
  const cur = document.getElementById("fx-cursor");
  if (bg) setupStars(bg);
  if (cur) setupCursor(cur);
})();
