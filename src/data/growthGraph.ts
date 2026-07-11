// The Growth Graph — node set + goal loops (Master Website Brief §7).
// Nodes are clean labelled discs in a cohesive Infinite Weblinks colour (no
// third-party logos). `ring` = index around the desktop radial circle.

// The nine tool nodes. This union is the single source of truth for tool
// identifiers shared across the homepage graph, the Map Your Stack rules, and
// the selection graph.
export type NodeKey =
  | 'social'
  | 'googleAds'
  | 'website'
  | 'tracking'
  | 'store'
  | 'email'
  | 'whatsapp'
  | 'crm'
  | 'ai';

export interface GraphNode {
  key: NodeKey;
  label: string;
  color: string; // CSS custom property
  ring: number;  // position index around the circle (0 = top, clockwise)
}

export const graphNodes: GraphNode[] = [
  { key: 'social', label: 'Social', color: 'var(--c-magenta)', ring: 0 },
  { key: 'googleAds', label: 'Google Ads', color: 'var(--c-amber)', ring: 1 },
  { key: 'website', label: 'Website', color: 'var(--c-indigo)', ring: 2 },
  { key: 'tracking', label: 'Tracking', color: 'var(--c-violet)', ring: 3 },
  { key: 'store', label: 'Store', color: 'var(--c-coral)', ring: 4 },
  { key: 'email', label: 'Email', color: 'var(--c-green)', ring: 5 },
  { key: 'whatsapp', label: 'WhatsApp', color: 'var(--c-green)', ring: 6 },
  { key: 'crm', label: 'CRM', color: 'var(--c-indigo)', ring: 7 },
  { key: 'ai', label: 'AI', color: 'var(--c-amber)', ring: 8 },
];

export const HUB = { key: 'hub', label: 'Infinite Weblinks' };

export interface GraphGoal {
  id: string;
  label: string;
  accent: string; // CSS custom property for the active label chip
  loop: string[]; // ordered node keys; the cycle closes back to loop[0]
  caption: string;
}

export const graphGoals: GraphGoal[] = [
  {
    id: 'sales',
    label: 'More sales',
    accent: 'var(--c-magenta)',
    loop: ['social', 'website', 'tracking', 'email', 'store', 'googleAds'],
    caption:
      'Someone sees your social ad, clicks to your site, and we track it properly. They get a follow-up email and buy. Every sale teaches the system where to find the next one.',
  },
  {
    id: 'adcosts',
    label: 'Lower ad costs',
    accent: 'var(--c-amber)',
    loop: ['store', 'tracking', 'googleAds', 'social', 'website'],
    caption:
      'Real sales data flows back from your store into your ad platforms, so Google and Meta stop guessing and start spending on people who actually buy.',
  },
  {
    id: 'repeat',
    label: 'More repeat customers',
    accent: 'var(--c-green)',
    loop: ['store', 'crm', 'email', 'whatsapp', 'website'],
    caption:
      'Every customer lands in one place. Your email and WhatsApp know what they bought, so the right message goes out at the right time and they come back.',
  },
  {
    id: 'working',
    label: 'Know what’s working',
    accent: 'var(--c-indigo)',
    loop: ['social', 'googleAds', 'website', 'tracking', 'crm'],
    caption:
      'Clicks, sales, and customers all report into one clear picture, so you finally see which channels make money instead of guessing.',
  },
];
