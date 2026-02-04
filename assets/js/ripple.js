(() => {
  const canvas = document.getElementById("ripple-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ripples = [];
  const MAX_RIPPLES = 16;

  function addRipple(x, y, strength = 1) {
    ripples.unshift({
      x, y,
      r: 0,
      a: 0.22 * strength,
      v: 2.2 + 2.0 * strength,
      w: 1.4 + 0.6 * strength,
    });

    if (ripples.length > MAX_RIPPLES) ripples.pop();
  }

  // Subtle ambient ripples
  let t = 0;
  function ambient() {
    t += 1;
    if (t % 90 === 0) {
      addRipple(Math.random() * w, Math.random() * h, 0.6);
    }
    requestAnimationFrame(ambient);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // soft vignette (matches your screenshot vibe)
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
    grad.addColorStop(0, "rgba(255,255,255,0.04)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.v;
      rp.a *= 0.985;

      if (rp.a < 0.004) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(11,26,52,${rp.a * 0.20})`;


      ctx.lineWidth = rp.w;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  // Interaction
  let lastMove = 0;
  window.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - lastMove > 80) {
      addRipple(e.clientX, e.clientY, 0.7);
      lastMove = now;
    }
  });

  window.addEventListener("pointerdown", (e) => {
    addRipple(e.clientX, e.clientY, 1.2);
  });

  window.addEventListener("resize", resize);

  resize();
  draw();
  ambient();
})();
