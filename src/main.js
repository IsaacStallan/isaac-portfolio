import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initScenes, introReveal, finale } from './scenes.js';
import { initHeroCanvas } from './hero-canvas.js';
import { initPointerEffects } from './interactions.js';
import { initContactForm, initBeforeAfter } from './forms.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = [...document.querySelectorAll('main > .scene')];
const navLinks = [...document.querySelectorAll('[data-scene-link]')];

initBeforeAfter();

if (reduced) {
  root.classList.add('reduced');
  initContactForm();
  initReducedMode();
} else {
  root.classList.add('motion', 'is-loading');
  initMotionMode();
}

/* ───────── Reduced motion: normal scrolling page, simple fades ───────── */
function initReducedMode() {
  const items = document.querySelectorAll('.manifesto__line, .work-card, .ba, .step, .service, .contact__grid, h2');
  items.forEach((el) => el.classList.add('fade'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach((el) => io.observe(el));

  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(scenes.indexOf(e.target)); });
  }, { rootMargin: '-50% 0px -50% 0px' });
  scenes.forEach((s) => navIO.observe(s));
}

/* ───────── Cinematic mode ───────── */
async function initMotionMode() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  initHeroCanvas(document.querySelector('.hero-canvas'));
  initPointerEffects();
  initContactForm(() => finale());

  await preload();

  initScenes();
  ScrollTrigger.refresh();
  root.classList.remove('is-loading');
  lenis.start();
  introReveal();

  // Smooth in-page navigation (header, scene nav, links), landing on the start of pinned scenes.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = sceneTop(target.closest('.scene') || target);
    lenis.scrollTo(top, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    history.replaceState(null, '', a.getAttribute('href'));
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  let ticking = false;
  lenis.on('scroll', () => {
    if (ticking) return;
    ticking = true;
    setTimeout(() => { ticking = false; updateActive(); }, 120);
  });
  updateActive();

  // Deep link (e.g. /#contact) after the scenes are laid out.
  if (location.hash && document.querySelector(location.hash)) {
    lenis.scrollTo(sceneTop(document.querySelector(location.hash).closest('.scene')), { immediate: true });
  }
}

function preload() {
  const count = document.querySelector('[data-count]');
  const bar = document.querySelector('.preloader__bar span');
  const pre = document.querySelector('.preloader');
  const p = { v: 0 };
  const render = () => { count.textContent = Math.round(p.v); bar.style.transform = `scaleX(${p.v / 100})`; };
  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
  const ready = Promise.race([Promise.all([loaded, document.fonts.ready]), new Promise((r) => setTimeout(r, 4000))]);

  return new Promise((resolve) => {
    gsap.to(p, { v: 86, duration: 1.1, ease: 'power2.out', onUpdate: render })
      .then(() => ready)
      .then(() => gsap.to(p, { v: 100, duration: 0.35, ease: 'power1.in', onUpdate: render }))
      .then(() => gsap.to(pre, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }))
      .then(() => { pre.remove(); resolve(); });
  });
}

// Pinned scenes are wrapped in a .pin-spacer that spans their whole scroll length.
function sceneBox(scene) {
  const p = scene.parentElement;
  return p && p.classList.contains('pin-spacer') ? p : scene;
}
function sceneTop(scene) {
  return sceneBox(scene).getBoundingClientRect().top + window.scrollY;
}
function updateActive() {
  const mid = window.innerHeight / 2;
  const i = scenes.findIndex((s) => {
    const r = sceneBox(s).getBoundingClientRect();
    return r.top <= mid && r.bottom > mid;
  });
  if (i !== -1) setActive(i);
}
function setActive(i) {
  navLinks.forEach((a, j) => {
    a.classList.toggle('is-active', i === j);
    i === j ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  });
}
