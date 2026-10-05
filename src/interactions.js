import { gsap } from 'gsap';

// Custom cursor, magnetic buttons and image tilt. Fine pointers only.
export function initPointerEffects() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.documentElement.classList.add('has-cursor');

  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const label = cursor.querySelector('.cursor__label');
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
  gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });

  window.addEventListener('pointermove', (e) => {
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
  }, { passive: true });

  const labels = { view: 'View', drag: 'Drag' };
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest('[data-cursor]');
    cursor.classList.remove('is-link', 'is-view', 'is-drag');
    if (!el) return;
    const type = el.dataset.cursor;
    cursor.classList.add('is-' + type);
    if (labels[type]) label.textContent = labels[type];
  });
  document.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => gsap.to(cursor, { opacity: 1, duration: 0.2 }));

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1) + 'px');
      el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
  });

  // Project images: 3D tilt + slight skew that follows pointer speed
  document.querySelectorAll('.work-card__media').forEach((fig) => {
    const pic = fig.querySelector('picture');
    gsap.set(fig, { transformPerspective: 1000 });
    let lastX = 0;
    fig.addEventListener('pointermove', (e) => {
      const r = fig.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const v = gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4);
      lastX = e.clientX;
      gsap.to(fig, { rotateY: px * 8, rotateX: -py * 8, duration: 0.6, ease: 'power3.out' });
      gsap.to(pic, { scale: 1.06, skewX: v, x: px * -18, y: py * -18, duration: 0.6, ease: 'power3.out' });
    });
    fig.addEventListener('pointerleave', () => {
      gsap.to(fig, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(pic, { scale: 1, skewX: 0, x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
    });
  });
}
