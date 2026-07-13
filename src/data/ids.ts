// Shared, stable id unions for the restructured content model (spec 002).
// Kept in their own module so capability / service / audience / graph modules
// can reference each other's ids without circular imports.

export type CapabilityId =
  | 'build'
  | 'attract'
  | 'convert'
  | 'retain'
  | 'connect'
  | 'scale';

export const CAPABILITY_IDS: CapabilityId[] = [
  'build',
  'attract',
  'convert',
  'retain',
  'connect',
  'scale',
];

export type AudienceId =
  | 'ecommerce-brands'
  | 'creators-and-experts'
  | 'startups-and-new-brands'
  | 'growing-teams'
  | 'established-teams'
  | 'agency-partners';

export const AUDIENCE_IDS: AudienceId[] = [
  'ecommerce-brands',
  'creators-and-experts',
  'startups-and-new-brands',
  'growing-teams',
  'established-teams',
  'agency-partners',
];

/** Growth Graph goals (five, including the confirmed fifth "Save team time"). */
export type GoalId =
  | 'more-sales'
  | 'lower-ad-waste'
  | 'more-repeat-customers'
  | 'know-whats-working'
  | 'save-team-time';

/** Map Your Stack tool ids (nine). */
export type ToolId =
  | 'website'
  | 'store'
  | 'google-ads'
  | 'social'
  | 'tracking'
  | 'crm'
  | 'email'
  | 'whatsapp'
  | 'ai';

/** A dedicated service page vs an anchored section within its parent. */
export type ServiceTreatment = 'page' | 'section';
