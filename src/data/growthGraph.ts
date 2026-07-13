// The Growth Graph — node set + goal loops (spec 002, FR-020/021; homepage
// Playbook Section 6). Nodes are clean labelled discs in the corrected DESIGN.md
// capability palette (no third-party logos). `ring` = index around the desktop
// radial circle. Five goals, including the confirmed fifth "Save team time".

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
  color: string; // CSS custom property (corrected capability palette)
  ring: number;  // position index around the circle (0 = top, clockwise)
}

export const graphNodes: GraphNode[] = [
  { key: 'social', label: 'Social', color: 'var(--cap-attract)', ring: 0 },
  { key: 'googleAds', label: 'Google Ads', color: 'var(--cap-attract)', ring: 1 },
  { key: 'website', label: 'Website', color: 'var(--cap-build)', ring: 2 },
  { key: 'tracking', label: 'Tracking', color: 'var(--cap-connect)', ring: 3 },
  { key: 'store', label: 'Store', color: 'var(--cap-convert)', ring: 4 },
  { key: 'email', label: 'Email', color: 'var(--cap-retain)', ring: 5 },
  { key: 'whatsapp', label: 'WhatsApp', color: 'var(--cap-retain)', ring: 6 },
  { key: 'crm', label: 'CRM', color: 'var(--cap-connect)', ring: 7 },
  { key: 'ai', label: 'AI', color: 'var(--cap-scale)', ring: 8 },
];

export const HUB = { key: 'hub', label: 'Infinite Weblinks' };

export interface GraphGoal {
  id: string;
  label: string;
  accent: string; // CSS custom property for the active label chip
  loop: string[]; // ordered node keys; the cycle closes back to loop[0]
  caption: string;
}

// Labels and captions are the approved Playbook Section 6 copy; "Save team time"
// is the confirmed fifth goal (clarification 2026-07-11), authored in voice.
export const graphGoals: GraphGoal[] = [
  {
    id: 'sales',
    label: 'More sales',
    accent: 'var(--cap-attract)',
    loop: ['social', 'website', 'tracking', 'email', 'store', 'googleAds'],
    caption:
      'Someone discovers the business and reaches a page that matches their interest. If they are not ready, useful follow-up can continue the journey. When they buy, that result helps the business understand which messages and channels attracted the right customer.',
  },
  {
    id: 'adwaste',
    label: 'Lower advertising waste',
    accent: 'var(--cap-convert)',
    loop: ['store', 'tracking', 'googleAds', 'social', 'website'],
    caption:
      'Suitable sales information can flow back into measurement and advertising. This gives the team and the platform better evidence for comparing campaigns than clicks alone.',
  },
  {
    id: 'repeat',
    label: 'More repeat customers',
    accent: 'var(--cap-retain)',
    loop: ['store', 'crm', 'email', 'whatsapp', 'website'],
    caption:
      'A purchase and customer preference can guide what happens next. The customer may receive useful guidance, a timely reminder or a relevant recommendation instead of the same promotion as everyone else.',
  },
  {
    id: 'working',
    label: 'Know what is working',
    accent: 'var(--cap-connect)',
    loop: ['social', 'googleAds', 'website', 'tracking', 'crm'],
    caption:
      'Traffic, actions, sales and customer value can be brought into a clearer view. This helps the team compare activities by business outcome instead of relying only on surface-level numbers.',
  },
  {
    id: 'teamtime',
    label: 'Save team time',
    accent: 'var(--cap-scale)',
    loop: ['store', 'crm', 'ai', 'email', 'tracking'],
    caption:
      'When the same information stops being copied between tools and repeated steps are automated, the team spends less time on admin and more on the work that needs a person.',
  },
];
