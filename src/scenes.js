import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Pins a scene for `length` (a multiple of the viewport height) and returns a scrubbed timeline.
function pinned(scene, length, extra = {}) {
  scene.classList.add('scene--pinned');
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * length),
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      ...extra,
    },
  });
}

function introScene() {
  const scene = $('#intro');
  const tl = pinned(scene, 0.9);
  tl.to('.intro__line:first-child .char', { yPercent: -40, opacity: 0, stagger: { each: 0.02, from: 'start' } }, 0)
    .to('.intro__line--outline .char', { yPercent: 40, opacity: 0, stagger: { each: 0.02, from: 'end' } }, 0)
    .to('.intro__kicker, .intro__tagline', { y: -40, opacity: 0, stagger: 0.05 }, 0)
    .to('.intro__cue', { opacity: 0 }, 0)
    .to('.hero-canvas', { scale: 1.25, opacity: 0.2 }, 0);
}

function manifestoScene() {
  const scene = $('#manifesto');
  const words = $$('.word', scene);
  gsap.set(words, { opacity: 0.12 });
  const tl = pinned(scene, 2);
  tl.to(words, { opacity: 1, stagger: 0.1, duration: 0.4 })
    .to(scene.firstElementChild, { y: -30, opacity: 0.3, duration: 0.6 }, '+=0.4');
}

function workScene(mobile) {
  const scene = $('#work');
  const track = $('.work__track', scene);
  const cards = $$('.work-card', scene);
  const distance = () => track.scrollWidth - window.innerWidth;

  scene.classList.add('scene--pinned');
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: mobile ? 0.4 : 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  gsap.to('.work__progress span', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: scene, start: 'top top', end: () => '+=' + distance(), scrub: true, invalidateOnRefresh: true },
  });

  cards.forEach((card, i) => {
    const img = $('.work-card__media img', card);
    const body = $('.work-card__body', card);
    const st = { trigger: card, containerAnimation: tween, scrub: true, start: 'left right', end: 'left left' };
    if (i === 0) {
      // First card is already on screen when the scene pins, so it reveals on entry instead.
      gsap.from(img, { scale: 1.25, ease: 'power2.out', scrollTrigger: { trigger: scene, start: 'top 80%', end: 'top top', scrub: true } });
      gsap.from(body.children, { y: 40, opacity: 0, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: scene, start: 'top 70%', end: 'top 10%', scrub: true } });
      return;
    }
    gsap.fromTo(img, { scale: 1.35, xPercent: -6 }, { scale: 1, xPercent: 0, ease: 'none', scrollTrigger: st });
    gsap.from(body.children, { x: mobile ? 60 : 160, opacity: 0, stagger: 0.05, ease: 'none', scrollTrigger: { ...st, end: 'left 25%' } });
  });

  // Keyboard users: bring a focused card into view instead of leaving it off-screen.
  scene.addEventListener('focusin', (e) => {
    const card = e.target.closest('.work-card');
    const trig = tween.scrollTrigger;
    if (!card || !trig) return;
    scene.scrollLeft = 0; // undo the browser's own scroll-into-view on the clipped scene
    const i = cards.indexOf(card);
    const y = trig.start + (cards.length > 1 ? i / (cards.length - 1) : 0) * (trig.end - trig.start);
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
  });
}

function beforeAfterScene() {
  const scene = $('#before-after');
  const ba = $('.ba', scene);
  const range = $('.ba__range', scene);
  const state = { pos: 88 };
  const apply = () => {
    ba.style.setProperty('--pos', state.pos + '%');
    range.value = Math.round(state.pos);
  };
  apply();
  gsap.from(['.ba__head', ba], { y: 60, opacity: 0, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 15%', scrub: true } });
  const tl = pinned(scene, 1.4);
  tl.to(state, { pos: 12, duration: 1, onUpdate: apply });
}

function processScene(desktop) {
  const scene = $('#process');
  const steps = $$('.step', scene);
  if (desktop) {
    const draw = $('.process__draw', scene);
    const len = draw.getTotalLength();
    gsap.set(draw, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(steps, { opacity: 0.15, y: 30 });
    const tl = pinned(scene, 1.6);
    tl.to(draw, { strokeDashoffset: 0, duration: 1 }, 0);
    steps.forEach((s, i) => tl.to(s, { opacity: 1, y: 0, duration: 0.18 }, 0.05 + i * 0.25));
    return;
  }
  const list = $('.process__steps', scene);
  gsap.fromTo(list, { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 60%', scrub: true } });
  steps.forEach((s) => gsap.from(s, { opacity: 0.15, x: 24, ease: 'none', scrollTrigger: { trigger: s, start: 'top 85%', end: 'top 55%', scrub: true } }));
}

// Services scrolls normally (it's taller than one screen); its parts animate in as they arrive.
function servicesScene(desktop) {
  const scene = $('#services');
  const reveal = (targets, trigger, vars = {}) =>
    gsap.from(targets, {
      y: 70, opacity: 0, stagger: 0.12, ease: 'power2.out', ...vars,
      scrollTrigger: { trigger, start: 'top 88%', end: 'top 45%', scrub: 0.6 },
    });
  reveal('.services__head > *', '.services__head');
  reveal('.service--build', '.service--build');
  reveal('.plans__heading', '.plans__heading');
  reveal($$('.tier', scene), '.services__cards', desktop ? { y: 140, rotate: (i) => (i - 1) * 3 } : {});
  reveal('.services__terms li', '.services__terms', { y: 20 });
}

function contactScene() {
  const scene = $('#contact');
  const chars = $$('.contact__title .char', scene);
  gsap.from(chars, {
    yPercent: 110, rotate: 8, opacity: 0, stagger: 0.03, duration: 1, ease: 'power4.out',
    scrollTrigger: { trigger: scene, start: 'top 65%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.contact__grid > *', {
    y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact__grid', start: 'top 85%', toggleActions: 'play none none reverse' },
  });
  gsap.fromTo('.contact__burst', { scale: 0.4, opacity: 0 }, {
    scale: 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
  // Finale: when the very end is reached, the headline does a wave in the accent colour.
  ScrollTrigger.create({
    trigger: scene, start: 'bottom bottom+=2', onEnter: () => finale(chars),
  });
}

export function finale(chars = $$('.contact__title .char')) {
  gsap.timeline()
    .to(chars, { y: '-0.12em', color: '#c8ff2e', stagger: 0.035, duration: 0.25, ease: 'power2.out' })
    .to(chars, { y: 0, color: '#f4f4f0', stagger: 0.035, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, 0.25);
  gsap.fromTo('.contact__burst', { scale: 0.9 }, { scale: 1.15, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' });
}

export function introReveal() {
  const tl = gsap.timeline();
  tl.from('.intro__name .char', {
    yPercent: () => gsap.utils.random(-120, 120),
    xPercent: () => gsap.utils.random(-60, 60),
    rotate: () => gsap.utils.random(-40, 40),
    opacity: 0, filter: 'blur(12px)',
    duration: 1.2, ease: 'expo.out', stagger: { each: 0.045, from: 'random' },
    clearProps: 'filter',
  })
    .from('.intro__kicker, .intro__tagline', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.6)
    .from('.intro__cue, .site-header', { opacity: 0, duration: 0.8 }, 1);
  return tl;
}

export function initScenes() {
  const mm = gsap.matchMedia();
  mm.add({ all: '(min-width: 0px)', desktop: '(min-width: 1024px)', mobile: '(max-width: 767px)' }, (ctx) => {
    const { desktop, mobile } = ctx.conditions;
    introScene();
    manifestoScene();
    workScene(mobile);
    beforeAfterScene();
    processScene(desktop);
    servicesScene(desktop);
    contactScene();
    return () => $$('.scene--pinned').forEach((s) => s.classList.remove('scene--pinned'));
  });
  return mm;
}
