const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const dots = Array.from({ length: 40 }).map(() => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: Math.random() * 0.3 + 0.1,
}));

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(0,171,199,0.15)";
  ctx.fillStyle = "#3FAE2A";

  dots.forEach((d, i) => {
    d.x += d.vx;
    if (d.x > w) d.x = 0;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
    ctx.fill();

    dots.forEach(o => {
      const dist = Math.hypot(d.x - o.x, d.y - o.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(draw);
}
draw();
