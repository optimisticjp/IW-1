// The six capabilities (spec 002, FR-011/012/013). Each capability page renders
// from one of these records through the shared section system, so the six pages
// share a sequence but differ in colour, problems, specialist detail, proof and
// FAQ. Copy is plain-English and playbook-voiced: business meaning first,
// specialist detail second, no buzzwords, no invented figures.

import type { CapabilityId } from './ids';

export interface Capability {
  id: CapabilityId;
  name: string;
  /** one-line descriptor for the mega-menu */
  descriptor: string;
  /** the promise at the top of the page */
  outcomeHero: string;
  /** recognisable problems this capability answers (distinct per capability) */
  problems: string[];
  /** progressive-disclosure specialist detail */
  specialistList: string[];
  /** how this capability supports the other five */
  connectionStory: string;
  /** service slugs mapped to this capability (see services.ts) */
  serviceIds: string[];
  /** FAQ ids (see faqs.ts) */
  faqIds: string[];
  /** CTA label that matches its destination */
  actionLabel: string;
  /** siblings for the switcher */
  relatedCapabilityIds: CapabilityId[];
}

export const capabilities: Capability[] = [
  {
    id: 'build',
    name: 'Build',
    descriptor: 'Websites, stores and apps that are ready to grow.',
    outcomeHero: 'A website or store that works well and is built to connect to everything else.',
    problems: [
      'Your current site looks fine but does not turn visitors into customers.',
      'You are launching and need a store or site that will not need rebuilding in a year.',
      'Your site and your other tools do not talk to each other.',
    ],
    specialistList: [
      'Design and build on Shopify, WooCommerce and modern web stacks',
      'Accessible, fast, mobile-first front-end engineering',
      'Structured so analytics, CRM and marketing tools can plug in cleanly',
    ],
    connectionStory:
      'A good build is the floor everything else stands on. It gives Attract somewhere to send traffic, gives Convert a page worth optimising, and gives Connect clean data to work with.',
    serviceIds: [
      'website-design-and-development',
      'ecommerce-development',
      'web-and-mobile-app-development',
      'website-redesign',
      'website-migration',
      'ui-and-ux-design',
    ],
    faqIds: ['build-timeline', 'build-platform'],
    actionLabel: 'Discuss a website or store',
    relatedCapabilityIds: ['convert', 'connect', 'attract'],
  },
  {
    id: 'attract',
    name: 'Attract',
    descriptor: 'Ads, search and content that bring the right people.',
    outcomeHero: 'A steady flow of the right visitors, from channels you can actually measure.',
    problems: [
      'You are spending on ads but cannot tell what is working.',
      'You rank for nothing and rely on word of mouth.',
      'You post on social but it never turns into sales.',
    ],
    specialistList: [
      'Paid advertising across Google, Meta, TikTok and marketplaces',
      'SEO and search visibility, including how you show up in AI answers',
      'Content and social that supports the sale rather than chasing vanity metrics',
    ],
    connectionStory:
      'Attract is only worth it when the traffic lands somewhere that converts and gets measured. It leans on Build for the destination, Convert for the result and Connect for honest numbers.',
    serviceIds: [
      'paid-advertising',
      'seo-and-search-visibility',
      'social-media',
      'content-marketing',
      'creator-and-influencer-marketing',
    ],
    faqIds: ['attract-budget', 'attract-seo-time'],
    actionLabel: 'Discuss customer acquisition',
    relatedCapabilityIds: ['convert', 'connect', 'build'],
  },
  {
    id: 'convert',
    name: 'Convert',
    descriptor: 'Turn more of your visitors into customers.',
    outcomeHero: 'More of the visitors you already have becoming customers, without more ad spend.',
    problems: [
      'People visit but very few buy or enquire.',
      'Your checkout or enquiry form loses people halfway.',
      'You have never tested whether a change actually helps.',
    ],
    specialistList: [
      'Conversion reviews, testing and experimentation (the canonical testing home)',
      'Landing pages and sales funnels built for one clear action',
      'Conversion copywriting that explains value in plain language',
    ],
    connectionStory:
      'Convert multiplies everything upstream. A one-point lift here makes every Attract pound and every Build page worth more, and it needs Connect to prove a change really worked.',
    serviceIds: [
      'conversion-optimisation',
      'landing-pages',
      'sales-funnels',
      'conversion-copywriting',
    ],
    faqIds: ['convert-testing', 'convert-guarantee'],
    actionLabel: 'Discuss conversion improvement',
    relatedCapabilityIds: ['attract', 'build', 'connect'],
  },
  {
    id: 'retain',
    name: 'Retain',
    descriptor: 'Keep customers and bring them back.',
    outcomeHero: 'Customers who come back and buy again, so each first sale is worth more.',
    problems: [
      'You win a customer once and never hear from them again.',
      'Your email is generic and opens keep dropping.',
      'You have no simple way to reward loyal customers.',
    ],
    specialistList: [
      'Email marketing tied to what people browse and buy',
      'SMS and WhatsApp for timely, useful reminders',
      'Loyalty, referral and affiliate programmes',
    ],
    connectionStory:
      'Retain depends on Connect knowing who bought what. When a purchase updates the customer record and triggers the right next message, a sale starts the next relationship instead of ending one.',
    serviceIds: [
      'email-marketing',
      'sms-and-whatsapp-marketing',
      'loyalty-programmes',
      'referral-and-affiliate-programmes',
    ],
    faqIds: ['retain-email', 'retain-crm'],
    actionLabel: 'Discuss customer retention',
    relatedCapabilityIds: ['connect', 'convert', 'scale'],
  },
  {
    id: 'connect',
    name: 'Connect',
    descriptor: 'Make your tools work as one system.',
    outcomeHero: 'Your tools sharing the same information, so your numbers finally agree.',
    problems: [
      'Every tool reports a different number and you trust none of them.',
      'Customer data is scattered across apps that do not talk.',
      'You cannot tell which channel actually brings your best customers.',
    ],
    specialistList: [
      'Analytics and tracking, including server-side and enhanced conversions',
      'CRM selection, setup and integration',
      'Dashboards and reporting you can trust',
    ],
    connectionStory:
      'Connect is the quiet capability the others rely on. It gives Attract real feedback, gives Convert a defensible result, and gives Retain the customer record that makes good timing possible.',
    serviceIds: [
      'analytics-and-tracking',
      'crm-setup-and-integration',
      'dashboards-and-reporting',
    ],
    faqIds: ['connect-tracking', 'connect-crm'],
    actionLabel: 'Review our current setup',
    relatedCapabilityIds: ['attract', 'retain', 'scale'],
  },
  {
    id: 'scale',
    name: 'Scale',
    descriptor: 'Automation and AI that save your team time.',
    outcomeHero: 'Less manual work, so your team spends time on the things only people can do.',
    problems: [
      'Your team loses hours to repetitive manual tasks.',
      'You want to use AI but do not know where it actually helps.',
      'Growth keeps creating more admin instead of more freedom.',
    ],
    specialistList: [
      'Workflow automation across your existing tools',
      'AI assistants and chatbots built on real customer data',
      'Marketing automation and broader experimentation',
    ],
    connectionStory:
      'Scale only works on top of Connect. Automation and AI are useful when they can see real, joined-up data; on guesses they create more mess than they remove.',
    serviceIds: [
      'workflow-automation',
      'ai-assistants-and-chatbots',
      'marketing-automation',
    ],
    faqIds: ['scale-ai', 'scale-automation'],
    actionLabel: 'Discuss automation and AI',
    relatedCapabilityIds: ['connect', 'retain', 'convert'],
  },
];

/** Look up one capability by id. */
export function getCapability(id: CapabilityId): Capability | undefined {
  return capabilities.find((c) => c.id === id);
}
