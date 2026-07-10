// The four connected growth pillars + Brand & Content as a supporting
// foundation across all four (FR-009). `lineRole` describes how the Line of
// value enters and leaves each pillar (Infinite Universe wiring).

export type PillarKey = 'demand' | 'storefront' | 'retention' | 'intelligence';

export interface Pillar {
  key: PillarKey;
  index: string;
  name: string;
  role: string;
  lineRole: string;
  services: string[];
  accent: 'vermilion' | 'green' | 'saffron' | 'cobalt';
}

export const pillars: Pillar[] = [
  {
    key: 'demand',
    index: '01',
    name: 'Demand',
    role: 'Bring the right people in — profitably, and at the volume growth needs.',
    lineRole: 'The Line begins here: attention and clicks enter the system.',
    services: ['Meta Ads', 'Google Ads', 'Social Media Growth', 'SEO', 'TikTok & YouTube Ads', 'Influencer'],
    accent: 'vermilion',
  },
  {
    key: 'storefront',
    index: '02',
    name: 'Storefront',
    role: 'Turn that attention into orders with a store built to convert.',
    lineRole: 'The Line thickens: visitors become customers instead of leaking away.',
    services: ['Website Design & Development', 'Shopify Development', 'CRO', 'Landing Pages', 'Migrations'],
    accent: 'green',
  },
  {
    key: 'retention',
    index: '03',
    name: 'Retention',
    role: 'Grow the value of every customer you already paid to acquire.',
    lineRole: 'The Line loops back: one order becomes many.',
    services: ['Email & SMS', 'Lifecycle', 'Loyalty & Referrals', 'CRM', 'Subscriptions'],
    accent: 'saffron',
  },
  {
    key: 'intelligence',
    index: '04',
    name: 'Intelligence',
    role: 'Measure what is true, so every other decision gets sharper.',
    lineRole: 'The Line feeds back: data becomes the next round of growth.',
    services: ['GA4 & Server-side Tracking', 'Dashboards', 'Testing', 'Automation', 'Growth Strategy'],
    accent: 'cobalt',
  },
];

export const foundation = {
  name: 'Brand & Content',
  role: 'The layer under everything — the story, look, and words that make every pillar work harder.',
};
