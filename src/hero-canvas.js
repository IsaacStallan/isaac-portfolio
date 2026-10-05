// Lightweight 2D dot field behind the intro. Dots swell and drift away from the cursor
// (or ripple on their own on touch screens). Pauses when off-screen or the tab is hidden.
export function initHeroCanvas(canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  const fine = matchMedia('(pointer: fine)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const accent = [200, 255, 46];
  let w = 0, h = 0, gap = 0, cols = 0, rows = 0;
  let running = false, visible = true, raf = 0, t = 0;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = w < 768 ? 30 : 34;
    cols = Math.ceil(w / gap) + 1;
    rows = Math.ceil(h / gap) + 1;
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    t += 0.012;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    ctx.clearRect(0, 0, w, h);
    const radius = Math.min(w, h) * 0.32;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * gap, y = j * gap;
        const wave = Math.sin(i * 0.35 + t * 2) * Math.cos(j * 0.3 + t * 1.4);
        let f = 0;
        if (fine) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < radius) {
            f = 1 - d / radius;
            const push = f * f * 22;
            x += (dx / (d || 1)) * push;
            y += (dy / (d || 1)) * push;
          }
        } else {
          f = Math.max(0, wave) * 0.6;
        }
        const size = 0.8 + f * 2.4 + wave * 0.25;
        const a = 0.1 + f * 0.75;
        ctx.fillStyle = f > 0.15 ? `rgba(${accent[0]},${accent[1]},${accent[2]},${a})` : `rgba(244,244,240,${0.1 + wave * 0.04})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  }

  const start = () => { if (!running && visible && !document.hidden) { running = true; frame(); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (fine) {
    window.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    }, { passive: true });
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}
