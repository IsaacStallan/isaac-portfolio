// ─────────────────────────────────────────────────────────────
//  All editable site content lives here.
//  Edit text, links and image paths below, then commit + push.
//  Images go in /public/images and are referenced as "images/…".
// ─────────────────────────────────────────────────────────────

export default {
  site: {
    url: 'https://isaacstallan.github.io/isaac-portfolio/',
    title: 'Isaac Stallan | Web Designer & Developer, Crows Nest, Sydney',
    description:
      'Isaac Stallan designs and builds fast, modern websites for local businesses in Sydney. Website builds from $500 to $1,000, plus optional monthly care plans.',
    ogImage: 'og-image.png',
  },

  person: {
    firstName: 'Isaac',
    lastName: 'Stallan',
    role: 'Web designer & developer',
    location: 'Crows Nest, Sydney',
    brands: ['Aretica'],
  },

  intro: {
    line: 'I build websites that make local businesses impossible to miss.',
    cue: 'Scroll to begin',
  },

  // Each sentence reveals word by word as you scroll.
  manifesto: [
    'Most local businesses are better than their websites.',
    'I design and build sites that are fast, beautiful and easy to find.',
    'So the first impression finally matches the real thing.',
  ],

  // Horizontal gallery. `image` is the desktop shot, `imageSmall` the mobile one (~800px wide).
  // Set `link` to null to hide the "View live" button.
  projects: [
    {
      title: 'Axon by Aretica',
      description: 'An ambient AI for Mac that remembers context and takes real action, with your confirmation.',
      role: 'Founder · Design · Development',
      tech: ['Product design', 'Web', 'AI'],
      image: 'images/work-aretica.webp',
      imageSmall: 'images/work-aretica-800.webp',
      alt: 'Aretica website hero: “JARVIS was fiction. This is the real thing.” on a dark, glowing interface',
      link: 'https://aretica.com.au',
      accent: '#22d3ee',
    },
    {
      title: 'The Wooden Whisk',
      description: 'Concept redesign for a St Leonards café: mobile-first, catering-led, built to convert.',
      role: 'Concept · Design · Development',
      tech: ['HTML', 'CSS', 'JavaScript', 'SEO'],
      image: 'images/work-woodenwhisk.webp',
      imageSmall: 'images/work-woodenwhisk-800.webp',
      alt: 'The Wooden Whisk concept homepage with a salmon bowl hero photo and “Order Online” button',
      link: 'https://isaacstallan.github.io/wooden-whisk-concept/',
      accent: '#d9773f',
    },
    {
      title: 'Your business, next.',
      description: 'This spot is reserved for the next local business that wants to stand out.',
      role: 'Let’s talk',
      tech: ['$500–$1,000 builds', 'Care plans'],
      image: 'images/work-next.svg',
      imageSmall: 'images/work-next.svg',
      alt: 'An empty frame waiting for your website',
      link: '#contact',
      linkLabel: 'Start a project',
      accent: '#c8ff2e',
    },
  ],

  // Before → After slider. Swap these for real screenshots (same aspect ratio, e.g. 1600×1000).
  beforeAfter: {
    heading: 'From forgettable to unmissable.',
    before: { image: 'images/before.svg', alt: 'An outdated small-business website with clashing colours and cramped text' },
    after: { image: 'images/after.svg', alt: 'The same business redesigned: a clean, warm website with a clear headline, phone number, services list and a customer review' },
  },

  process: [
    { title: 'Discover', text: 'A quick chat about your business, your customers and what the site needs to do.' },
    { title: 'Design', text: 'A clear, modern design you approve before a line of code is written.' },
    { title: 'Build', text: 'Hand-built, fast and mobile-first, with SEO and your Google listing in mind.' },
    { title: 'Launch', text: 'I go live, hand over everything, and stay on call if you want ongoing care.' },
  ],

  services: {
    sub: 'For local businesses across Sydney. One-off build, then an optional care plan so your site never goes stale.',
    build: {
      name: 'Website build',
      price: '$500–$1,000',
      unit: 'one-off',
      points: ['Custom design, no templates', 'Mobile-first and fast', 'SEO basics and analytics', 'Live in 1–3 weeks'],
    },
    plansHeading: 'Care plans from $39/month',
    // Set `recommended: true` on the plan you want to steer people towards.
    plans: [
      {
        name: 'Essentials',
        price: '$39',
        unit: '/month',
        intro: 'Keep it online and safe.',
        points: ['Hosting, SSL and domain renewal', 'Uptime and security checks', 'Up to 30 min of edits a month (hours, prices, menu, photos)'],
      },
      {
        name: 'Care',
        price: '$79',
        unit: '/month',
        recommended: true,
        intro: 'Everything in Essentials, plus:',
        points: ['Up to 1 hr of edits a month', 'Google Business Profile upkeep (hours, photos, holiday hours)', 'Seasonal updates (specials, Christmas hours, new menu)'],
      },
      {
        name: 'Growth',
        price: '$149',
        unit: '/month',
        intro: 'Everything in Care, plus:',
        points: ['Up to 3 hrs of edits a month', 'Monthly Google posts and help replying to reviews', 'New pages or landing pages (e.g. catering, events)', 'Short monthly report (visits, calls, direction requests)'],
      },
    ],
    // Small print shown under the plans.
    terms: [
      'Your domain is registered in your name. If you ever leave, you keep it and your site files.',
      'Pay yearly and get 2 months free.',
      'Extra work is $60/hr. Unused edit time doesn’t roll over.',
      '30 days’ notice to cancel after the first 6 months.',
    ],
  },

  contact: {
    heading: 'Let’s build yours.',
    email: 'isaac.stallan@gmail.com',
    phone: '+61 477 661 085',
    instagram: 'isaac.stallan',
    // Paste your Formspree form ID (e.g. "xyzabcd") to send messages through Formspree.
    // Leave empty to fall back to opening the visitor's email app (mailto).
    formspreeId: '',
  },
};
