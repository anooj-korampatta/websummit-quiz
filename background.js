window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bgCanvas");

  // 🛑 Safety check
  if (!canvas) {
    console.warn("bgCanvas not found, background animation skipped");
    return;
  }

  const ctx = canvas.getContext("2d");

  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Logistics hubs
  const hubs = Array.from({ length: 36 }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.random() * 0.15 + 0.05
  }));

  function drawCurve(a, b) {
    const cx = (a.x + b.x) / 2;
    const cy = Math.min(a.y, b.y) - 60;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(cx, cy, b.x, b.y);
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(0,171,199,0.12)";
    ctx.lineWidth = 1;

    hubs.forEach(h => {
      h.x += h.vx;
      if (h.x > w + 50) h.x = -50;
    });

    // Curved routes
    hubs.forEach((a, i) => {
      hubs.forEach((b, j) => {
        if (i !== j) {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 220) drawCurve(a, b);
        }
      });
    });

    // Hubs
    ctx.fillStyle = "#3FAE2A";
    hubs.forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
});
