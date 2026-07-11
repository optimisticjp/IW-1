// /how-it-connects content — copy is VERBATIM from the Final Build Handoff
// (Task 2). Do not edit these words. No em dashes; no buzzwords. This is the
// concept page: it teaches the mechanism, it does NOT re-list the six services.

// A connection story is either a linear flow (a → b → c → d) or a fan-in
// (several sources converging into one target). The `kind` discriminates them.
export type HcStory = {
  id: string;
  title: string;
  accent: string;
  copy: string;
} & (
  | { kind: 'flow'; path: string[] }
  | { kind: 'fanin'; sources: string[]; target: string }
);

export const howItConnects = {
  seo: {
    title: 'How It Connects',
    description:
      'Infinite Weblinks connects your customer, marketing, sales, and reporting systems so information moves between them, instead of sitting in tools that never talk to each other.',
    path: '/how-it-connects',
  },

  hero: {
    eyebrow: 'How it connects',
    h1: "More tools won't fix disconnected growth.",
    sub: "We map how customers, data, and decisions move through your business, then connect the systems that should already be working together. That's the whole idea behind Infinite Weblinks.",
    // The one page where "Map your stack" is the primary action.
    primary: { label: 'Map your stack', href: '/map-your-stack' },
    secondary: { label: 'Book a free call', href: '/book-a-call' },
  },

  disconnected: {
    eyebrow: 'The disconnected reality',
    h2: "Every tool works. The information between them doesn't.",
    body: "A typical setup has ads bringing traffic, a website collecting activity, a store recording purchases, a customer list holding contacts, email sending campaigns, and analytics reporting numbers. Each one works on its own. But the data doesn't move properly between them, so sales get credited to the wrong channel, follow-up misses, and you can't tell what actually made money.",
    // Six separate, dimmed tools (no links between them).
    nodes: [
      { label: 'Ads', accent: 'amber' },
      { label: 'Website', accent: 'indigo' },
      { label: 'Store', accent: 'coral' },
      { label: 'Customer list', accent: 'magenta' },
      { label: 'Email', accent: 'green' },
      { label: 'Analytics', accent: 'violet' },
    ],
  },

  stories: {
    eyebrow: 'What connection looks like',
    h2: 'The same tools, wired to work together.',
    items: [
      {
        id: 'acquire',
        title: 'Acquire.',
        accent: 'coral',
        copy: 'Someone sees an ad, lands on your site, and the visit is tracked properly, so your ad platforms learn who actually buys and stop wasting spend.',
        kind: 'flow',
        path: ['Ads', 'Website', 'Tracking', 'Store'],
      },
      {
        id: 'retain',
        title: 'Retain.',
        accent: 'green',
        copy: "A purchase updates the customer's record and triggers the right follow-up by email or WhatsApp, so they come back.",
        kind: 'flow',
        path: ['Store', 'CRM', 'Email or WhatsApp', 'Repeat purchase'],
      },
      {
        id: 'understand',
        title: 'Understand.',
        accent: 'violet',
        copy: 'Clicks, visits, sales, and customers all report into one place, so you can finally see which channels bring your best customers.',
        // fan-in: several sources converge into one dashboard
        kind: 'fanin',
        sources: ['Ads', 'Website', 'Store', 'CRM'],
        target: 'One dashboard',
      },
    ] as HcStory[],
  },

  beforeAfter: {
    eyebrow: 'Before and after',
    h2: 'What changes when it all connects.',
    before: {
      heading: 'Before',
      copy: "Separate tools, incomplete data, manual work, and reporting you can't trust.",
    },
    after: {
      heading: 'After',
      copy: 'A connected customer journey, follow-up that runs itself, measurement you can rely on, and clearer decisions.',
    },
  },

  cta: {
    h2: 'See where your growth is disconnected.',
    primary: { label: 'Map your stack', href: '/map-your-stack' },
    secondary: { label: 'Book a free call', href: '/book-a-call' },
  },
};
