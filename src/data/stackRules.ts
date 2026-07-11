// Map Your Stack — the connection rules (spec §5). A static, easy-to-extend
// TypeScript data module evaluated entirely client-side. No backend, no
// storage. Each rule is one valuable connection between tools.
//
// Order matters: it defines result priority (top-down). Do not reorder without
// intent — the results surface the highest-priority gaps first.

import type { NodeKey } from './growthGraph';

// A rule requirement is an AND of OR-groups. Every group must be satisfied for
// the connection to be "in place"; a group is satisfied if ANY of its tools is
// selected. A single required tool is just a one-item group.
export type ToolGroup = NodeKey[];

// Capabilities used by these rules (a subset of the six-capability system).
export type Capability = 'Connect' | 'Attract' | 'Retain' | 'Scale';

export interface StackRule {
  id: string;
  title: string;
  /** AND of OR-groups. All groups must be satisfied for "in place". */
  groups: ToolGroup[];
  /** Plain-English value when the connection is in place. */
  value: string;
  /** One-sentence cost when the connection is a gap. */
  gapCost: string;
  /** Capability family (drives the link colour). */
  capability: Capability;
  /** CSS custom property for the capability colour. */
  colorVar: string;
}

const CAP_COLOR: Record<Capability, string> = {
  Connect: 'var(--c-violet)',
  Attract: 'var(--c-coral)',
  Retain: 'var(--c-green)',
  Scale: 'var(--c-amber)',
};

function rule(
  id: string,
  title: string,
  groups: ToolGroup[],
  value: string,
  gapCost: string,
  capability: Capability
): StackRule {
  return { id, title, groups, value, gapCost, capability, colorVar: CAP_COLOR[capability] };
}

export const stackRules: StackRule[] = [
  rule(
    'sales-tracking',
    'Reliable sales tracking',
    [['store', 'website'], ['tracking']],
    'every sale gets counted correctly, even when browsers block the usual tracking',
    "your sales get credited to the wrong channel, so you can't trust any of your numbers",
    'Connect'
  ),
  rule(
    'ads-learn',
    'Ads that learn from real sales',
    [['googleAds'], ['tracking'], ['store']],
    'Google and Meta spend on people who actually buy',
    'you pay for clicks that never turn into sales',
    'Attract'
  ),
  rule(
    'win-back',
    "Win back visitors who didn't buy",
    [['googleAds', 'social'], ['tracking']],
    'you can bring back people who visited but left',
    'visitors leave and you have no way to reach them again',
    'Attract'
  ),
  rule(
    'email-behaviour',
    'Email tied to what people browse and buy',
    [['store'], ['email']],
    'emails triggered by what someone viewed or bought, not generic blasts',
    'every email is a guess, so opens and repeat sales stay low',
    'Retain'
  ),
  rule(
    'one-customer-record',
    'Every customer in one place',
    [['crm'], ['store', 'website']],
    'every customer and lead in one record with their history',
    'customer data is scattered and follow-up falls through the gaps',
    'Connect'
  ),
  rule(
    'best-channels',
    'Know which channel brings your best customers',
    [['crm'], ['tracking']],
    'you can see which channel brought each customer and their repeat value',
    "you can't tell which marketing actually makes money",
    'Connect'
  ),
  rule(
    'reminders',
    'Reminders that bring people back',
    [['whatsapp'], ['store']],
    'timely reminders and offers based on what a customer did',
    'you lean on one channel and miss easy repeat sales',
    'Retain'
  ),
  rule(
    'repeat-loop',
    'The repeat-customer loop',
    [['store'], ['email'], ['crm']],
    'a purchase updates the profile and triggers the right next message',
    'a sale ends the relationship instead of starting the next one',
    'Retain'
  ),
  rule(
    'ai-real-data',
    'AI that runs on real customer data',
    [['ai'], ['tracking', 'crm']],
    'AI can predict, segment, and automate because it can see real data',
    "AI runs on guesses, so it can't help much",
    'Scale'
  ),
  rule(
    'one-dashboard',
    'One dashboard you can trust',
    [['tracking'], ['store', 'crm']],
    'revenue, channels, and repeat rate in one place',
    "you stitch numbers together by hand and still don't trust them",
    'Connect'
  ),
];
