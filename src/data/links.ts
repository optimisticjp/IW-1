// Internal-linking model (spec 002, FR-006). Contextual link rules that keep a
// large sitemap understandable: problem-first entry points route to the right
// capability or audience, and route builders keep link text descriptive.

import type { CapabilityId, AudienceId } from './ids';

/** Problem-first entry: a plain problem statement routing to a destination. */
export interface ProblemEntry {
  problem: string;
  /** capability id or audience id the problem routes to */
  target: { kind: 'capability'; id: CapabilityId } | { kind: 'audience'; id: AudienceId };
}

export const problemEntries: ProblemEntry[] = [
  { problem: 'People visit my site but very few buy', target: { kind: 'capability', id: 'convert' } },
  { problem: 'I spend on ads but cannot tell what works', target: { kind: 'capability', id: 'attract' } },
  { problem: 'My tools do not talk to each other', target: { kind: 'capability', id: 'connect' } },
  { problem: 'Customers buy once and never come back', target: { kind: 'capability', id: 'retain' } },
  { problem: 'My team wastes hours on manual work', target: { kind: 'capability', id: 'scale' } },
  { problem: 'I need a site or store built properly', target: { kind: 'capability', id: 'build' } },
  { problem: 'I sell online and want more sales', target: { kind: 'audience', id: 'ecommerce-brands' } },
  { problem: 'I want the digital side handled for me', target: { kind: 'audience', id: 'creators-and-experts' } },
];

/** Route builders — the single place link paths are constructed. */
export const routes = {
  home: () => '/',
  whatWeDo: () => '/what-we-do',
  capability: (id: CapabilityId) => `/what-we-do/${id}`,
  service: (slug: string) => `/services/${slug}`,
  whoWeHelp: () => '/who-we-help',
  audience: (id: AudienceId) => `/who-we-help/${id}`,
  howItConnects: () => '/how-it-connects',
  mapYourStack: () => '/map-your-stack',
  work: () => '/work',
  caseStudy: (slug: string) => `/work/${slug}`,
  insights: () => '/insights',
  article: (slug: string) => `/insights/${slug}`,
  bookACall: () => '/book-a-call',
  contact: () => '/contact',
  about: () => '/about',
  faq: () => '/faq',
} as const;
