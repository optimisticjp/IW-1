// The six audience pages (spec 002, FR-017/018). Each renders from one record
// through the shared audience system: same universal promise, but each in its
// own language, with its own concerns and the services it actually buys.

import type { AudienceId, GoalId } from './ids';

export interface Audience {
  id: AudienceId;
  name: string;
  situation: string;
  language: string[];
  concerns: string[];
  desiredOutcomes: string[];
  /** service slugs this audience buys (see services.ts) */
  relevantServiceIds: string[];
  objections: string[];
  /** CTA label that matches its destination */
  actionLabel: string;
  /** audience-appropriate Growth Graph goal variant */
  graphVariant: GoalId;
  /** which of the three starting points fits this audience */
  startingPoint: 'launch' | 'connect' | 'scale';
}

export const audiences: Audience[] = [
  {
    id: 'ecommerce-brands',
    name: 'Ecommerce brands',
    situation: 'You sell online and want more sales from the traffic and tools you already have.',
    language: ['average order value', 'repeat rate', 'return on ad spend', 'abandoned checkout'],
    concerns: ['Ad costs keep rising', 'Tracking broke and the numbers stopped agreeing', 'One channel does all the work'],
    desiredOutcomes: ['More sales without more spend', 'Customers who buy again', 'Numbers you can trust'],
    relevantServiceIds: ['ecommerce-development', 'paid-advertising', 'conversion-optimisation', 'email-marketing', 'analytics-and-tracking'],
    objections: ['We have an agency already', 'We tried ads and they did not work'],
    actionLabel: 'Discuss ecommerce growth',
    graphVariant: 'more-sales',
    startingPoint: 'scale',
  },
  {
    id: 'creators-and-experts',
    name: 'Creators & experts',
    situation: 'You are great at what you do and want the digital side handled so you can focus on the work.',
    language: ['audience', 'offer', 'launch', 'email list'],
    concerns: ['The tech gets in the way', 'You are the bottleneck for everything', 'Sales depend on you posting'],
    desiredOutcomes: ['A setup that runs without you', 'More income from the same audience', 'Time back for the work'],
    relevantServiceIds: ['website-design-and-development', 'sales-funnels', 'conversion-copywriting', 'email-marketing'],
    objections: ['I am not technical', 'I do not have a big team'],
    actionLabel: 'Discuss your setup',
    graphVariant: 'save-team-time',
    startingPoint: 'launch',
  },
  {
    id: 'startups-and-new-brands',
    name: 'Startups & new brands',
    situation: 'You are launching and want to build the right foundation the first time.',
    language: ['MVP', 'launch', 'first customers', 'runway'],
    concerns: ['Building something we will have to rebuild', 'Spending before we know what works', 'No time to do it twice'],
    desiredOutcomes: ['A foundation that will scale', 'First customers, measured', 'Room to grow without a rebuild'],
    relevantServiceIds: ['website-design-and-development', 'web-and-mobile-app-development', 'ui-and-ux-design', 'analytics-and-tracking'],
    objections: ['We are pre-revenue', 'We move fast and cannot wait'],
    actionLabel: 'Discuss your launch',
    graphVariant: 'know-whats-working',
    startingPoint: 'launch',
  },
  {
    id: 'growing-teams',
    name: 'Growing teams',
    situation: 'You have several tools and no one who owns how they fit together.',
    language: ['stack', 'handover', 'reporting', 'process'],
    concerns: ['Tools that do not talk', 'Data scattered across apps', 'No single owner of the system'],
    desiredOutcomes: ['Tools working as one', 'Reporting you can trust', 'Less manual work'],
    relevantServiceIds: ['crm-setup-and-integration', 'analytics-and-tracking', 'workflow-automation', 'conversion-optimisation'],
    objections: ['We have tools already', 'Our setup is complicated'],
    actionLabel: 'Support our team',
    graphVariant: 'save-team-time',
    startingPoint: 'connect',
  },
  {
    id: 'established-teams',
    name: 'Established teams',
    situation: 'You have scale and want the parts to stop fighting between departments.',
    language: ['attribution', 'governance', 'server-side', 'source of truth'],
    concerns: ['Every team reports a different number', 'Problems fall between departments', 'Tracking that cannot be trusted'],
    desiredOutcomes: ['One source of truth', 'Defensible attribution', 'Systems that hold at scale'],
    relevantServiceIds: ['analytics-and-tracking', 'dashboards-and-reporting', 'website-migration', 'ai-assistants-and-chatbots'],
    objections: ['We have internal teams', 'We need this to be reliable'],
    actionLabel: 'Support our team',
    graphVariant: 'know-whats-working',
    startingPoint: 'connect',
  },
  {
    id: 'agency-partners',
    name: 'Agency partners',
    situation: 'You want a delivery partner for the connected, technical work your clients need.',
    language: ['white-label', 'delivery', 'scope', 'handover'],
    concerns: ['Delivery capacity', 'Technical depth you can rely on', 'Clean handovers'],
    desiredOutcomes: ['Reliable delivery', 'Depth on tap', 'Work that reflects well on you'],
    relevantServiceIds: ['analytics-and-tracking', 'crm-setup-and-integration', 'ecommerce-development', 'workflow-automation'],
    objections: ['We protect our client relationships', 'We need discretion'],
    actionLabel: 'Discuss agency support',
    graphVariant: 'more-sales',
    startingPoint: 'scale',
  },
];

/** Look up one audience by id. */
export function getAudience(id: AudienceId): Audience | undefined {
  return audiences.find((a) => a.id === id);
}
