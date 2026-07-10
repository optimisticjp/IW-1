// Homepage content — realistic, humanized placeholder copy for Phase 1.
// Stored as a plain typed module (no content-collection dependency) so the
// flagship homepage builds independently of Phase 2 (`src/content/config.ts`).
//
// Placeholder tracking: temporary proof (metrics, testimonials, logos, client
// names) is flagged `placeholder`/`assetStatus: 'pending'` and NEVER rendered
// with a public badge. The pre-launch content-integrity audit (T086) lists
// every pending item; none may ship as approved proof.

export interface Metric {
  value: string;
  label: string;
  system: string;
  assetStatus: 'pending' | 'approved';
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  brand: string;
  assetStatus: 'pending' | 'approved';
}

export interface ServiceCard {
  name: string;
  pillar: string;
  href: string;
  promise: string;
  connects: string;
}

export const home = {
  placeholder: true,

  meta: {
    title: 'Infinite Weblinks — Connected growth for ecommerce brands',
    description:
      'Infinite Weblinks connects the systems behind ecommerce growth — ads, storefront, retention, and analytics — so they compound instead of leak. Request a proposal.',
  },

  hero: {
    kicker: 'For ecommerce brands · US · UK · CA · AU · NZ · EU',
    // Working homepage argument (approved, refinable during copy).
    headlineLead: 'Disconnected growth',
    headlineLeak: 'leaks.',
    headlineConnect: 'Connected growth',
    headlineCompound: 'compounds.',
    sub: 'Most brands don’t have a traffic problem or a product problem. They have a connection problem — ads, storefront, email, and analytics all pulling in different directions. We wire them into one system, so every part makes the others worth more.',
    primaryCta: { label: 'Request a proposal', href: '/request-a-proposal' },
    secondaryCta: { label: 'See how it connects', href: '#connected' },
    signals: ['Meta & Google Ads', 'Shopify & web', 'Email & SMS', 'GA4 & tracking'],
  },

  disconnected: {
    kicker: 'The cost of disconnected growth',
    heading: 'Growth doesn’t leak in one place. It leaks between them.',
    body: 'A great ad sends traffic to a slow product page. A converting store has no email flow behind it. A retention program fires without knowing which customers are worth keeping. Each team hits its own target while revenue quietly drains through the gaps between them.',
    leaks: [
      { where: 'Ads → Storefront', loss: 'Paid clicks land on pages that weren’t built to convert them.' },
      { where: 'Storefront → Retention', loss: 'First orders arrive with no flow to earn the second.' },
      { where: 'Retention → Intelligence', loss: 'You re-market to everyone because no one measured who’s worth it.' },
      { where: 'Intelligence → Ads', loss: 'Spend keeps scaling on numbers the platform reports, not the ones that are true.' },
    ],
  },

  connected: {
    kicker: 'The connected growth ecosystem',
    heading: 'One line of value, running through the whole business.',
    body: 'Demand brings people in. The storefront turns them into customers. Retention grows what they’re worth. Intelligence tells the truth about all of it — and feeds the next round of demand. Brand and content make every step sharper. Buy any piece on its own; the compounding comes from connecting them.',
  },

  services: {
    kicker: 'Five priority services',
    heading: 'Where connected growth gets built.',
    body: 'These are the highest-leverage connection points — the places where wiring two systems together changes the maths for the whole business.',
    items: <ServiceCard[]>[
      {
        name: 'Meta Ads',
        pillar: 'Demand',
        href: '/services/meta-ads',
        promise: 'Profitable demand from Facebook & Instagram, measured on orders — not the platform’s optimistic dashboard.',
        connects: 'Feeds the storefront and reads back from real analytics.',
      },
      {
        name: 'Google Ads',
        pillar: 'Demand',
        href: '/services/google-ads',
        promise: 'Capture the intent that’s already searching for what you sell, without overpaying for your own brand.',
        connects: 'Pairs with SEO and server-side tracking for the full picture.',
      },
      {
        name: 'Website Design and Development',
        pillar: 'Storefront',
        href: '/services/website-design-development',
        promise: 'A store that looks like your brand and behaves like your best salesperson — fast, clear, built to convert.',
        connects: 'The hinge between demand and retention.',
      },
      {
        name: 'Shopify Store Development and Management',
        pillar: 'Storefront',
        href: '/services/shopify-development-management',
        promise: 'Shopify and Shopify Plus builds, migrations, and ongoing management that keep converting after launch.',
        connects: 'Wired to email, ads, and analytics from day one.',
      },
      {
        name: 'Social Media Growth',
        pillar: 'Demand',
        href: '/services/social-media-growth',
        promise: 'Attention and trust that compound — content and community that make every other channel cheaper.',
        connects: 'Warms demand and feeds retention with story.',
      },
    ],
  },

  proof: {
    kicker: 'Proof, next to the claim',
    heading: 'We’d rather show the system working than say “trust us.”',
    body: 'Every engagement is measured on outcomes that matter to the business, not vanity metrics. Representative results shown while full case studies are finalised.',
    metrics: <Metric[]>[
      { value: '2.4×', label: 'blended return on ad spend', system: 'Demand × Intelligence', assetStatus: 'pending' },
      { value: '+38%', label: 'store conversion rate', system: 'Storefront × CRO', assetStatus: 'pending' },
      { value: '41%', label: 'revenue from returning customers', system: 'Retention', assetStatus: 'pending' },
      { value: '−27%', label: 'blended cost per acquisition', system: 'Intelligence feedback', assetStatus: 'pending' },
    ],
    // Fictional placeholder attribution — flagged pending, shown dev-only via
    // PlaceholderBadge, and replaced with an approved testimonial before launch
    // (audited at T086). Not a real client endorsement.
    testimonial: <Testimonial>{
      quote:
        'For the first time our ads, our store, and our email were telling the same story. Nothing felt like it was fighting the rest of the business anymore.',
      name: 'Rui Alvarez',
      role: 'Founder',
      brand: 'Northbound',
      assetStatus: 'pending',
    },
    logosNote: 'Selected brands we’ve worked with',
    logoCount: 6,
  },

  how: {
    kicker: 'How Infinite Weblinks works',
    heading: 'Map the leaks. Connect the systems. Compound the result.',
    steps: [
      { n: '01', title: 'Map', text: 'We trace your line of value end to end and find exactly where it breaks — with the numbers to prove it.' },
      { n: '02', title: 'Connect', text: 'We fix the highest-leverage connection first, then wire the next, so results show up early and keep building.' },
      { n: '03', title: 'Compound', text: 'Each connected system makes the others worth more. We measure what’s true and reinvest where it pays.' },
    ],
  },

  secondary: {
    kicker: 'Not only ecommerce brands',
    heading: 'Two quieter doors, for people who need a different one.',
    paths: [
      {
        label: 'For creators & digital products',
        href: '/for-creators',
        text: 'Audience, offers, and lifecycle for creators and digital-product businesses.',
      },
      {
        label: 'Partners & white-label',
        href: '/partners',
        text: 'Agencies who want our systems delivered quietly under their own brand.',
      },
    ],
  },

  finalCta: {
    kicker: 'Request a proposal',
    heading: 'Let’s find where your growth is leaking.',
    body: 'Tell us where you are and what you’re trying to reach. You’ll get a considered, no-pressure proposal — not a sales pitch. Pricing is scoped to your brand, opportunity, and goals.',
    cta: { label: 'Request a proposal', href: '/request-a-proposal' },
    reassurance: 'No account needed · Built for brands at any stage · Usually a reply within two business days.',
  },
} as const;
