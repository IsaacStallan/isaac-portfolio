// Renders content.js into static HTML at build time (see vite.config.js),
// so every word is in the page source, even without JavaScript.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const words = (text) =>
  text.split(/\s+/).map((w) => `<span class="word">${esc(w)}</span>`).join(' ');

// Letters are grouped per word so lines only ever break between words.
const chars = (text) =>
  text
    .split(' ')
    .map((w) => `<span class="char-word">${[...w].map((c) => `<span class="char">${esc(c)}</span>`).join('')}</span>`)
    .join(' ');

const pad = (n) => String(n).padStart(2, '0');

export const SCENES = [
  { id: 'intro', label: 'Intro' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'work', label: 'Work' },
  { id: 'before-after', label: 'Before & after' },
  { id: 'process', label: 'Process' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export function renderHead(c) {
  const { site, person, contact } = c;
  const og = site.url + site.ogImage;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${person.firstName} ${person.lastName}`,
    description: site.description,
    url: site.url,
    image: og,
    email: `mailto:${contact.email}`,
    telephone: contact.phone,
    priceRange: '$500–$1,000',
    areaServed: 'Sydney, NSW',
    address: { '@type': 'PostalAddress', addressLocality: 'Crows Nest', addressRegion: 'NSW', addressCountry: 'AU' },
    sameAs: [`https://www.instagram.com/${contact.instagram}`],
    founder: { '@type': 'Person', name: `${person.firstName} ${person.lastName}`, jobTitle: person.role },
  };
  return `
    <title>${esc(site.title)}</title>
    <meta name="description" content="${esc(site.description)}">
    <link rel="canonical" href="${esc(site.url)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${esc(site.url)}">
    <meta property="og:title" content="${esc(site.title)}">
    <meta property="og:description" content="${esc(site.description)}">
    <meta property="og:image" content="${esc(og)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_AU">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

export function renderBody(c) {
  const { person, intro, manifesto, projects, beforeAfter, process, services, contact } = c;
  const fullName = `${person.firstName} ${person.lastName}`;
  const tel = contact.phone.replace(/\s+/g, '');

  const nav = SCENES.map(
    (s, i) => `<li><a href="#${s.id}" data-scene-link="${i}" data-cursor="link"><span class="scene-nav__label">${esc(s.label)}</span></a></li>`
  ).join('');

  const work = projects
    .map((p, i) => {
      const external = p.link && p.link.startsWith('http');
      const link = p.link
        ? `<a class="btn btn--line magnetic" href="${esc(p.link)}" ${external ? 'target="_blank" rel="noopener"' : ''} data-cursor="link">
             <span>${esc(p.linkLabel || 'View live')}</span><span class="btn__arrow" aria-hidden="true">${external ? '↗' : '→'}</span>
             ${external ? '<span class="visually-hidden">(opens in a new tab)</span>' : ''}
           </a>`
        : '';
      return `
      <article class="work-card" style="--card-accent:${esc(p.accent || '')}" aria-labelledby="work-${i}">
        <figure class="work-card__media" data-cursor="view">
          <picture>
            <source media="(max-width: 767px)" srcset="${esc(p.imageSmall || p.image)}">
            <img src="${esc(p.image)}" alt="${esc(p.alt)}" width="1440" height="900" loading="lazy" decoding="async">
          </picture>
        </figure>
        <div class="work-card__body">
          <p class="work-card__index">${pad(i + 1)} <span>/ ${pad(projects.length)}</span></p>
          <h3 class="work-card__title" id="work-${i}">${esc(p.title)}</h3>
          <p class="work-card__desc">${esc(p.description)}</p>
          <dl class="work-card__meta">
            <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
            <div><dt>Tech</dt><dd>${p.tech.map(esc).join(' · ')}</dd></div>
          </dl>
          ${link}
        </div>
      </article>`;
    })
    .join('');

  const steps = process
    .map(
      (s, i) => `
      <li class="step" style="--i:${i}">
        <span class="step__num">${pad(i + 1)}</span>
        <h3 class="step__title">${esc(s.title)}</h3>
        <p class="step__text">${esc(s.text)}</p>
      </li>`
    )
    .join('');

  const cards = services
    .map(
      (s) => `
      <article class="service${s.featured ? ' service--featured' : ''}">
        <h3 class="service__name">${esc(s.name)}</h3>
        <p class="service__price"><span class="service__amount">${esc(s.price)}</span> <span class="service__unit">${esc(s.unit)}</span></p>
        <ul class="service__points">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      </article>`
    )
    .join('');

  return `
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="preloader" aria-hidden="true">
    <div class="preloader__count"><span data-count>0</span><sup>%</sup></div>
    <div class="preloader__bar"><span></span></div>
  </div>

  <div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span class="cursor__label">View</span></div></div>
  <div class="grain" aria-hidden="true"></div>

  <header class="site-header">
    <a class="logo" href="#intro" data-cursor="link" aria-label="${esc(fullName)}, back to start">
      <span class="logo__mark" aria-hidden="true">IS</span><span class="logo__name">${esc(fullName)}</span>
    </a>
    <a class="btn btn--accent btn--sm magnetic" href="#contact" data-cursor="link"><span>Contact</span></a>
  </header>

  <nav class="scene-nav" aria-label="Sections">
    <ol>${nav}</ol>
  </nav>

  <main id="main">
    <section class="scene scene--intro" id="intro" aria-labelledby="intro-title">
      <canvas class="hero-canvas" aria-hidden="true"></canvas>
      <div class="intro__inner">
        <p class="intro__kicker">${esc(person.role)} · ${esc(person.location)}</p>
        <h1 class="intro__name" id="intro-title" aria-label="${esc(fullName)}">
          <span class="intro__line" aria-hidden="true">${chars(person.firstName)}</span>
          <span class="intro__line intro__line--outline" aria-hidden="true">${chars(person.lastName)}</span>
        </h1>
        <p class="intro__tagline">${esc(intro.line)}</p>
      </div>
      <p class="intro__cue" aria-hidden="true"><span class="intro__cue-line"></span>${esc(intro.cue)}</p>
    </section>

    <section class="scene scene--manifesto" id="manifesto" aria-label="Manifesto">
      <div class="manifesto__inner">
        ${manifesto.map((m) => `<p class="manifesto__line">${words(m)}</p>`).join('')}
      </div>
    </section>

    <section class="scene scene--work" id="work" aria-labelledby="work-title">
      <div class="work__head">
        <p class="eyebrow">Selected work</p>
        <h2 class="work__title" id="work-title">Built to be <em>seen</em>.</h2>
      </div>
      <div class="work__track">${work}</div>
      <div class="work__progress" aria-hidden="true"><span></span></div>
    </section>

    <section class="scene scene--ba" id="before-after" aria-labelledby="ba-title">
      <div class="ba__inner">
        <div class="ba__head">
          <p class="eyebrow">Before → After</p>
          <h2 id="ba-title">${esc(beforeAfter.heading)}</h2>
        </div>
        <div class="ba" style="--pos:50%">
          <img class="ba__img ba__img--before" src="${esc(beforeAfter.before.image)}" alt="${esc(beforeAfter.before.alt)}" width="1600" height="1000" loading="lazy" decoding="async">
          <div class="ba__after">
            <img class="ba__img" src="${esc(beforeAfter.after.image)}" alt="${esc(beforeAfter.after.alt)}" width="1600" height="1000" loading="lazy" decoding="async">
          </div>
          <span class="ba__tag ba__tag--before" aria-hidden="true">Before</span>
          <span class="ba__tag ba__tag--after" aria-hidden="true">After</span>
          <div class="ba__handle" aria-hidden="true"><span>⟷</span></div>
          <label class="visually-hidden" for="ba-range">Compare before and after</label>
          <input class="ba__range" id="ba-range" type="range" min="0" max="100" value="50" data-cursor="drag">
        </div>
      </div>
    </section>

    <section class="scene scene--process" id="process" aria-labelledby="process-title">
      <div class="process__inner">
        <div class="process__head">
          <p class="eyebrow">Process</p>
          <h2 id="process-title">Four steps. No mystery.</h2>
        </div>
        <div class="process__path" aria-hidden="true">
          <svg viewBox="0 0 1000 120" preserveAspectRatio="none"><path class="process__track" d="M0,60 C125,0 250,120 375,60 S625,0 750,60 S900,110 1000,60"/><path class="process__draw" d="M0,60 C125,0 250,120 375,60 S625,0 750,60 S900,110 1000,60"/></svg>
        </div>
        <ol class="process__steps">${steps}</ol>
      </div>
    </section>

    <section class="scene scene--services" id="services" aria-labelledby="services-title">
      <div class="services__inner">
        <div class="services__head">
          <p class="eyebrow">Services &amp; pricing</p>
          <h2 id="services-title">Simple, honest pricing.</h2>
          <p class="services__sub">For local businesses across Sydney. Also building my own products under ${person.brands.map(esc).join(' and ')}.</p>
        </div>
        <div class="services__cards">${cards}</div>
      </div>
    </section>

    <section class="scene scene--contact" id="contact" aria-labelledby="contact-title">
      <div class="contact__burst" aria-hidden="true"></div>
      <div class="contact__inner">
        <h2 class="contact__title" id="contact-title" aria-label="${esc(contact.heading)}"><span aria-hidden="true">${chars(contact.heading)}</span></h2>
        <div class="contact__grid">
          <ul class="contact__list">
            <li><span>Email</span><a href="mailto:${esc(contact.email)}" data-cursor="link">${esc(contact.email)}</a></li>
            <li><span>Phone</span><a href="tel:${esc(tel)}" data-cursor="link">${esc(contact.phone)}</a></li>
            <li><span>Instagram</span><a href="https://www.instagram.com/${esc(contact.instagram)}" target="_blank" rel="noopener" data-cursor="link">@${esc(contact.instagram)}<span class="visually-hidden"> (opens in a new tab)</span></a></li>
            <li><span>Based in</span>${esc(person.location)}</li>
          </ul>
          <form class="contact__form" id="contact-form" ${contact.formspreeId ? `action="https://formspree.io/f/${esc(contact.formspreeId)}" method="POST"` : `action="mailto:${esc(contact.email)}" method="GET"`} data-email="${esc(contact.email)}" novalidate>
            <div class="field"><label for="cf-name">Name</label><input id="cf-name" name="name" autocomplete="name" required></div>
            <div class="field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
            <div class="field"><label for="cf-business">Business <span class="optional">(optional)</span></label><input id="cf-business" name="business" autocomplete="organization"></div>
            <div class="field"><label for="cf-message">What do you need?</label><textarea id="cf-message" name="message" rows="3" required></textarea></div>
            <p class="form-status" role="status" aria-live="polite"></p>
            <button class="btn btn--accent btn--lg magnetic" type="submit" data-cursor="link"><span class="btn__text">Send it</span><span class="btn__arrow" aria-hidden="true">→</span></button>
          </form>
        </div>
      </div>
      <footer class="site-footer">
        <p>© ${new Date().getFullYear()} ${esc(fullName)} · ${esc(person.location)}</p>
        <a href="#intro" data-cursor="link">Back to top ↑</a>
      </footer>
    </section>
  </main>`;
}
