// The complete service catalogue (spec 002, FR-014/015/016, data-model.md
// "Service catalogue"). 25 dedicated pages (treatment: 'page') across the six
// capabilities (7 launch first, 18 phase in) plus anchored sections
// (treatment: 'section') that live inside a parent until demand justifies a
// page. Every service maps to exactly one capability; canonical placement is
// enforced here (Landing Pages under Convert; CRM under Connect; AI-search a
// section of SEO; testing canonical on Conversion Optimisation; Amazon
// advertising under Paid Advertising, management under Scale).

import type { CapabilityId, AudienceId, ServiceTreatment } from './ids';

export type ServiceId = string;

export interface Service {
  id: ServiceId; // kebab-case slug; route is /services/{id} for pages
  name: string;
  capabilityId: CapabilityId;
  treatment: ServiceTreatment;
  launchSet: boolean;
  /** unique buyer intent, required to justify a dedicated page */
  searchIntent: string;
  /** plain-language "what the visitor receives" */
  deliverables: string[];
  /** "what it connects with" */
  connections: string[];
  primaryAudienceIds: AudienceId[];
  actionLabel: string;
  /** for treatment: 'section', the parent service (or capability) it renders inside */
  parentId?: string;

  // --- Rich detail, authored for launch pages (optional on phased/section) ---
  /** the business problem, in plain language, before any method */
  problem?: string;
  /** who this service helps */
  whoFor?: string;
  /** how the work happens (ordered steps) */
  process?: string[];
  /** expected outcomes / what becomes possible */
  outcomes?: string[];
  /** specialist tools/detail shown via progressive disclosure */
  specialistTools?: string[];
  /** related launch services (must resolve to built pages) */
  relatedServiceIds?: string[];
  /** a short useful educational module */
  educational?: { title: string; body: string };
  /** service-specific FAQ ids (distinct from sibling services) */
  faqIds?: string[];
}

export const services: Service[] = [
  // ---- Build (6 dedicated) -------------------------------------------------
  {
    id: 'website-design-and-development',
    name: 'Website Design & Development',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'business or service website design and development',
    problem: 'Your current site looks fine but does not turn visitors into customers, or you need one built properly the first time.',
    whoFor: 'Businesses and teams that need a site built to convert and connect.',
    process: ['We start with your customer and the outcome', 'We design for clarity and conversion', 'We build it fast, accessible and mobile-first', 'We connect analytics and your CRM, then hand over'],
    outcomes: ['A clear reason for visitors to trust you and act', 'A site that will not need rebuilding in a year', 'Clean data flowing to your other tools'],
    specialistTools: ['Accessible, modern front-end engineering', 'Content structure built for search', 'Analytics and CRM integration points'],
    relatedServiceIds: ['ecommerce-development', 'conversion-optimisation', 'seo-and-search-visibility'],
    educational: { title: 'A website is where trust is won or lost', body: 'Most decisions happen in seconds. A clear, fast, well-structured site earns the next step.' },
    faqIds: ['svc-web-time', 'svc-web-platform'],
    deliverables: ['A fast, accessible, mobile-first site', 'A clear structure built to convert', 'Clean hooks for analytics and CRM'],
    connections: ['ui-and-ux-design', 'conversion-optimisation', 'analytics-and-tracking'],
    primaryAudienceIds: ['startups-and-new-brands', 'growing-teams', 'creators-and-experts'],
    actionLabel: 'Discuss a website or product',
  },
  {
    id: 'ecommerce-development',
    name: 'Ecommerce Development',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'Shopify and WooCommerce ecommerce development',
    problem: 'You sell online, but the store loses people at the wrong moments and does not talk to your marketing or your data.',
    whoFor: 'Ecommerce brands launching a store or outgrowing a template.',
    process: ['We map how your customers actually buy', 'We design and build on Shopify or WooCommerce', 'We wire in tracking, email and payments', 'We test the checkout, then hand over or run it'],
    outcomes: ['A store built to sell, not just to look good', 'Fewer people lost at checkout', 'Marketing and data connected from day one'],
    specialistTools: ['Shopify and WooCommerce builds', 'Checkout and payment configuration', 'Server-side and enhanced conversion hooks'],
    relatedServiceIds: ['conversion-optimisation', 'email-marketing', 'analytics-and-tracking'],
    educational: { title: 'A store is a system, not a storefront', body: 'The store that grows is the one connected to how you attract, convert, measure and retain. We build for that from the start.' },
    faqIds: ['svc-ecom-platform', 'svc-ecom-migrate'],
    deliverables: ['A store built on Shopify or WooCommerce', 'A checkout tuned to lose fewer people', 'Tracking and email wired in from day one'],
    connections: ['conversion-optimisation', 'email-marketing', 'analytics-and-tracking'],
    primaryAudienceIds: ['ecommerce-brands'],
    actionLabel: 'Discuss ecommerce growth',
  },
  {
    id: 'web-and-mobile-app-development',
    name: 'Web & Mobile App Development',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'custom web and mobile app development',
    deliverables: ['A custom web or mobile app', 'A build that scales with your users', 'Analytics and accounts done properly'],
    connections: ['ui-and-ux-design', 'analytics-and-tracking'],
    primaryAudienceIds: ['startups-and-new-brands', 'growing-teams'],
    actionLabel: 'Discuss an app build',
  },
  {
    id: 'website-redesign',
    name: 'Website Redesign',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'website redesign agency',
    deliverables: ['A redesign that keeps what works', 'Better clarity and conversion', 'No loss of search rankings'],
    connections: ['conversion-optimisation', 'seo-and-search-visibility'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Discuss a redesign',
  },
  {
    id: 'website-migration',
    name: 'Website Migration',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'safe website or platform migration',
    deliverables: ['A safe move to a new platform', 'Redirects and rankings preserved', 'A tested cutover with no surprises'],
    connections: ['seo-and-search-visibility', 'analytics-and-tracking'],
    primaryAudienceIds: ['established-teams', 'growing-teams'],
    actionLabel: 'Discuss a migration',
  },
  {
    id: 'ui-and-ux-design',
    name: 'UI & UX Design',
    capabilityId: 'build',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'UI and UX design for websites and products',
    deliverables: ['Interfaces that are easy to use', 'A design system you can reuse', 'Designs proven with real users'],
    connections: ['website-design-and-development', 'conversion-optimisation'],
    primaryAudienceIds: ['startups-and-new-brands', 'growing-teams'],
    actionLabel: 'Discuss design',
  },

  // ---- Attract (5 dedicated) ----------------------------------------------
  {
    id: 'paid-advertising',
    name: 'Paid Advertising',
    capabilityId: 'attract',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'paid advertising and PPC management (Google, Meta, marketplaces)',
    problem: 'You spend on ads but cannot tell what works, and the spend is not learning from real sales.',
    whoFor: 'Ecommerce brands and growing teams running paid campaigns.',
    process: ['We check your tracking is trustworthy first', 'We start smaller and measure', 'We point spend at people who buy', 'We scale what works and cut what does not'],
    outcomes: ['Spend aimed at people who actually buy', 'Reporting tied to real sales', 'Less wasted budget on clicks that never convert'],
    specialistTools: ['Google, Meta, TikTok and marketplace campaigns', 'Conversion tracking and feedback loops', 'Amazon and marketplace advertising, as a section'],
    relatedServiceIds: ['analytics-and-tracking', 'conversion-optimisation', 'seo-and-search-visibility'],
    educational: { title: 'Ads that learn from real sales', body: 'When suitable sales information flows back to the platform, bidding improves because it sees the actions that matter, not only clicks.' },
    faqIds: ['svc-ads-budget', 'svc-ads-guarantee'],
    deliverables: ['Campaigns across Google, Meta and more', 'Spend pointed at people who buy', 'Reporting tied to real sales'],
    connections: ['analytics-and-tracking', 'conversion-optimisation'],
    primaryAudienceIds: ['ecommerce-brands', 'growing-teams'],
    actionLabel: 'Discuss customer acquisition',
  },
  {
    id: 'seo-and-search-visibility',
    name: 'SEO & Search Visibility',
    capabilityId: 'attract',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'SEO and search visibility, including AI search',
    problem: 'You rank for little and rely on word of mouth, or you are unsure how to show up in AI-assisted answers.',
    whoFor: 'Growing and established brands that want to be found.',
    process: ['We audit how search engines see your site', 'We fix the technical foundations', 'We plan content around real questions', 'We make the business easier to discover and cite'],
    outcomes: ['Higher rankings for terms that matter', 'A site search engines can read', 'A plan for search and AI-assisted discovery'],
    specialistTools: ['Technical SEO and site structure', 'Structured data and content strategy', 'AI-search readiness, as a section not a separate service'],
    relatedServiceIds: ['paid-advertising', 'website-design-and-development', 'analytics-and-tracking'],
    educational: { title: 'AI search is built on strong search foundations', body: 'No one can guarantee an AI system recommends you. The right goal is to be easy to discover, understand, trust and cite.' },
    faqIds: ['svc-seo-time', 'svc-seo-ai'],
    deliverables: ['Higher rankings for terms that matter', 'A site search engines can read', 'A plan for showing up in AI answers'],
    connections: ['content-marketing', 'website-migration'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Discuss customer acquisition',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    capabilityId: 'attract',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'social media management and content',
    deliverables: ['A social presence with a point', 'Content planned around the sale', 'Reporting beyond likes'],
    connections: ['content-marketing', 'creator-and-influencer-marketing'],
    primaryAudienceIds: ['ecommerce-brands', 'creators-and-experts'],
    actionLabel: 'Discuss customer acquisition',
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    capabilityId: 'attract',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'content marketing and strategy',
    deliverables: ['Content that answers real questions', 'A plan that builds topic authority', 'Pieces that lead gently to a sale'],
    connections: ['seo-and-search-visibility', 'social-media'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Discuss customer acquisition',
  },
  {
    id: 'creator-and-influencer-marketing',
    name: 'Creator & Influencer Marketing',
    capabilityId: 'attract',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'creator and influencer marketing',
    deliverables: ['The right creators for your brand', 'Briefs and tracking that work', 'Results you can measure'],
    connections: ['social-media', 'analytics-and-tracking'],
    primaryAudienceIds: ['ecommerce-brands', 'creators-and-experts'],
    actionLabel: 'Discuss customer acquisition',
  },

  // ---- Convert (4 dedicated) ----------------------------------------------
  {
    id: 'conversion-optimisation',
    name: 'Conversion Optimisation',
    capabilityId: 'convert',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'conversion rate optimisation (CRO) with testing',
    problem: 'People visit but very few buy or enquire, and you have never tested whether a change actually helps.',
    whoFor: 'Ecommerce brands and growing teams with traffic but low conversion.',
    process: ['We study where people drop off', 'We form a clear idea of why', 'We test the change, not guess', 'We keep what the numbers back'],
    outcomes: ['More value from the traffic you already have', 'Changes proven by testing', 'A clearer path to buy or enquire'],
    specialistTools: ['Conversion reviews and heuristics', 'A/B testing and experimentation, the canonical home', 'Forms and checkout improvement'],
    relatedServiceIds: ['ecommerce-development', 'paid-advertising', 'analytics-and-tracking'],
    educational: { title: 'A change is only a win when the numbers back it', body: 'We measure before we call anything an improvement, so you can trust the result.' },
    faqIds: ['svc-cro-testing', 'svc-cro-guarantee'],
    deliverables: ['A review of where you lose people', 'Changes tested, not guessed', 'A clearer path to buy or enquire'],
    connections: ['analytics-and-tracking', 'landing-pages'],
    primaryAudienceIds: ['ecommerce-brands', 'growing-teams'],
    actionLabel: 'Discuss conversion improvement',
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    capabilityId: 'convert',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'high-converting landing page design (canonical under Convert)',
    deliverables: ['Pages built for one clear action', 'Copy that explains the value', 'Ready to test and improve'],
    connections: ['paid-advertising', 'conversion-copywriting'],
    primaryAudienceIds: ['ecommerce-brands', 'growing-teams'],
    actionLabel: 'Discuss conversion improvement',
  },
  {
    id: 'sales-funnels',
    name: 'Sales Funnels',
    capabilityId: 'convert',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'sales funnel design and build',
    deliverables: ['A funnel matched to how people buy', 'Each step earning the next', 'Measured end to end'],
    connections: ['landing-pages', 'email-marketing'],
    primaryAudienceIds: ['creators-and-experts', 'growing-teams'],
    actionLabel: 'Discuss conversion improvement',
  },
  {
    id: 'conversion-copywriting',
    name: 'Conversion Copywriting',
    capabilityId: 'convert',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'conversion copywriting',
    deliverables: ['Plain copy that sells honestly', 'Headlines that front-load the point', 'Words tested against results'],
    connections: ['landing-pages', 'conversion-optimisation'],
    primaryAudienceIds: ['creators-and-experts', 'growing-teams'],
    actionLabel: 'Discuss conversion improvement',
  },

  // ---- Retain (4 dedicated) -----------------------------------------------
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    capabilityId: 'retain',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'email marketing and lifecycle automation',
    problem: 'You win a customer once and never hear from them again, and your email is generic.',
    whoFor: 'Ecommerce brands and growing teams that want repeat sales.',
    process: ['We connect email to what people browse and buy', 'We build the flows that run without you', 'We write messages people actually want', 'We report on repeat sales'],
    outcomes: ['Emails tied to what someone did', 'Flows that run automatically', 'More repeat business'],
    specialistTools: ['Klaviyo, Mailchimp and similar platforms', 'Lifecycle and journey automation', 'Segmentation from your customer record'],
    relatedServiceIds: ['ecommerce-development', 'analytics-and-tracking', 'conversion-optimisation'],
    educational: { title: 'Email tied to what people do', body: 'A message triggered by a real action is welcome. A generic blast is not. We build the first kind.' },
    faqIds: ['svc-email-annoy', 'svc-email-crm'],
    deliverables: ['Emails tied to what people do', 'Flows that run without you', 'Reporting on repeat sales'],
    connections: ['crm-setup-and-integration', 'ecommerce-development'],
    primaryAudienceIds: ['ecommerce-brands', 'growing-teams'],
    actionLabel: 'Discuss customer retention',
  },
  {
    id: 'sms-and-whatsapp-marketing',
    name: 'SMS & WhatsApp Marketing',
    capabilityId: 'retain',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'SMS and WhatsApp marketing',
    deliverables: ['Timely, useful messages', 'Reminders based on real behaviour', 'A channel that respects people'],
    connections: ['email-marketing', 'crm-setup-and-integration'],
    primaryAudienceIds: ['ecommerce-brands'],
    actionLabel: 'Discuss customer retention',
  },
  {
    id: 'loyalty-programmes',
    name: 'Loyalty Programmes',
    capabilityId: 'retain',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'loyalty programme setup',
    deliverables: ['A reward that fits your margins', 'A reason to come back', 'Tracked repeat value'],
    connections: ['crm-setup-and-integration', 'email-marketing'],
    primaryAudienceIds: ['ecommerce-brands'],
    actionLabel: 'Discuss customer retention',
  },
  {
    id: 'referral-and-affiliate-programmes',
    name: 'Referral & Affiliate Programmes',
    capabilityId: 'retain',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'referral and affiliate programme setup',
    deliverables: ['A referral loop customers use', 'Affiliate tracking that is fair', 'Growth from happy customers'],
    connections: ['email-marketing', 'analytics-and-tracking'],
    primaryAudienceIds: ['ecommerce-brands', 'creators-and-experts'],
    actionLabel: 'Discuss customer retention',
  },

  // ---- Connect (3 dedicated) ----------------------------------------------
  {
    id: 'analytics-and-tracking',
    name: 'Analytics & Tracking',
    capabilityId: 'connect',
    treatment: 'page',
    launchSet: true,
    searchIntent: 'analytics and tracking setup (GA4, server-side)',
    problem: 'Every tool reports a different number and you trust none of them.',
    whoFor: 'Ecommerce brands and established teams that need numbers they can trust.',
    process: ['We audit your current tracking', 'We fix the foundations and add server-side where it helps', 'We define one source of truth', 'We build reporting you can act on'],
    outcomes: ['Tracking you can trust', 'One number that means one thing', 'Reporting for decisions, not guesses'],
    specialistTools: ['GA4 and server-side tracking', 'Enhanced conversions and measurement planning', 'Dashboards and reporting'],
    relatedServiceIds: ['paid-advertising', 'conversion-optimisation', 'ecommerce-development'],
    educational: { title: 'One number that means one thing', body: 'Numbers disagree when each tool measures differently. We fix the tracking so decisions rest on solid ground.' },
    faqIds: ['svc-track-why', 'svc-track-serverside'],
    deliverables: ['Tracking you can trust', 'Server-side and enhanced conversions', 'One number everyone agrees on'],
    connections: ['paid-advertising', 'dashboards-and-reporting'],
    primaryAudienceIds: ['ecommerce-brands', 'established-teams'],
    actionLabel: 'Review our current setup',
  },
  {
    id: 'crm-setup-and-integration',
    name: 'CRM Setup & Integration',
    capabilityId: 'connect',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'CRM setup and integration (canonical under Connect)',
    deliverables: ['The right CRM chosen with you', 'Every customer in one record', 'Connected to your other tools'],
    connections: ['email-marketing', 'workflow-automation'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Review our current setup',
  },
  {
    id: 'dashboards-and-reporting',
    name: 'Dashboards & Reporting',
    capabilityId: 'connect',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'marketing dashboards and reporting',
    deliverables: ['One dashboard you can trust', 'Revenue, channels and repeat rate', 'No more stitching by hand'],
    connections: ['analytics-and-tracking', 'crm-setup-and-integration'],
    primaryAudienceIds: ['established-teams', 'growing-teams'],
    actionLabel: 'Review our current setup',
  },

  // ---- Scale (3 dedicated) ------------------------------------------------
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    capabilityId: 'scale',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'workflow and business process automation',
    deliverables: ['Manual steps removed', 'Your tools working together', 'Hours back for your team'],
    connections: ['crm-setup-and-integration', 'marketing-automation'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Discuss automation and AI',
  },
  {
    id: 'ai-assistants-and-chatbots',
    name: 'AI Assistants & Chatbots',
    capabilityId: 'scale',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'AI assistants and chatbots for business',
    deliverables: ['Assistants built on your data', 'Help that is actually useful', 'Honest limits, no over-promises'],
    connections: ['analytics-and-tracking', 'crm-setup-and-integration'],
    primaryAudienceIds: ['growing-teams', 'established-teams'],
    actionLabel: 'Discuss automation and AI',
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation',
    capabilityId: 'scale',
    treatment: 'page',
    launchSet: false,
    searchIntent: 'marketing automation setup',
    deliverables: ['The right message at the right time', 'Less manual campaign work', 'Automation on real data'],
    connections: ['email-marketing', 'workflow-automation'],
    primaryAudienceIds: ['growing-teams', 'ecommerce-brands'],
    actionLabel: 'Discuss automation and AI',
  },

  // ---- Anchored sections (treatment: 'section') ---------------------------
  { id: 'ai-search-visibility', name: 'AI-search visibility', capabilityId: 'attract', treatment: 'section', launchSet: false, searchIntent: 'section of SEO, never a standalone GEO/AEO page', deliverables: [], connections: ['seo-and-search-visibility'], primaryAudienceIds: ['established-teams', 'growing-teams'], actionLabel: 'Discuss customer acquisition', parentId: 'seo-and-search-visibility' },
  { id: 'marketplace-advertising', name: 'Marketplace & Amazon advertising', capabilityId: 'attract', treatment: 'section', launchSet: false, searchIntent: 'section of Paid Advertising', deliverables: [], connections: ['paid-advertising'], primaryAudienceIds: ['ecommerce-brands'], actionLabel: 'Discuss customer acquisition', parentId: 'paid-advertising' },
  { id: 'advertising-creative', name: 'Advertising creative', capabilityId: 'attract', treatment: 'section', launchSet: false, searchIntent: 'section of Paid Advertising', deliverables: [], connections: ['paid-advertising'], primaryAudienceIds: ['ecommerce-brands'], actionLabel: 'Discuss customer acquisition', parentId: 'paid-advertising' },
  { id: 'testing-and-experimentation', name: 'Testing & experimentation', capabilityId: 'convert', treatment: 'section', launchSet: false, searchIntent: 'canonical testing home on Conversion Optimisation; Scale links to it', deliverables: [], connections: ['conversion-optimisation'], primaryAudienceIds: ['ecommerce-brands', 'established-teams'], actionLabel: 'Discuss conversion improvement', parentId: 'conversion-optimisation' },
  { id: 'forms-and-checkout', name: 'Forms & checkout', capabilityId: 'convert', treatment: 'section', launchSet: false, searchIntent: 'section of Conversion Optimisation', deliverables: [], connections: ['conversion-optimisation'], primaryAudienceIds: ['ecommerce-brands'], actionLabel: 'Discuss conversion improvement', parentId: 'conversion-optimisation' },
  { id: 'brand-and-marketing-design', name: 'Brand & marketing design', capabilityId: 'build', treatment: 'section', launchSet: false, searchIntent: 'section of Build', deliverables: [], connections: ['ui-and-ux-design'], primaryAudienceIds: ['startups-and-new-brands'], actionLabel: 'Discuss design', parentId: 'ui-and-ux-design' },
  { id: 'customer-records-and-segmentation', name: 'Customer records & segmentation', capabilityId: 'connect', treatment: 'section', launchSet: false, searchIntent: 'cross-link from Retain to CRM', deliverables: [], connections: ['crm-setup-and-integration'], primaryAudienceIds: ['growing-teams'], actionLabel: 'Review our current setup', parentId: 'crm-setup-and-integration' },
  { id: 'server-side-tracking', name: 'Server-side & enhanced conversions', capabilityId: 'connect', treatment: 'section', launchSet: false, searchIntent: 'section of Analytics & Tracking', deliverables: [], connections: ['analytics-and-tracking'], primaryAudienceIds: ['ecommerce-brands', 'established-teams'], actionLabel: 'Review our current setup', parentId: 'analytics-and-tracking' },
  { id: 'measurement-planning', name: 'Measurement planning', capabilityId: 'connect', treatment: 'section', launchSet: false, searchIntent: 'section of Analytics & Tracking', deliverables: [], connections: ['analytics-and-tracking'], primaryAudienceIds: ['established-teams'], actionLabel: 'Review our current setup', parentId: 'analytics-and-tracking' },
  { id: 'knowledge-systems', name: 'Knowledge systems', capabilityId: 'scale', treatment: 'section', launchSet: false, searchIntent: 'section of AI Assistants & Chatbots', deliverables: [], connections: ['ai-assistants-and-chatbots'], primaryAudienceIds: ['established-teams'], actionLabel: 'Discuss automation and AI', parentId: 'ai-assistants-and-chatbots' },
  { id: 'marketplace-management', name: 'Marketplace management', capabilityId: 'scale', treatment: 'section', launchSet: false, searchIntent: 'section of Scale', deliverables: [], connections: ['paid-advertising'], primaryAudienceIds: ['ecommerce-brands'], actionLabel: 'Discuss ecommerce growth', parentId: 'workflow-automation' },
  { id: 'growth-strategy', name: 'Growth strategy', capabilityId: 'scale', treatment: 'section', launchSet: false, searchIntent: 'section of Scale', deliverables: [], connections: ['dashboards-and-reporting'], primaryAudienceIds: ['established-teams', 'agency-partners'], actionLabel: 'Discuss automation and AI', parentId: 'workflow-automation' },
];

/** Dedicated pages only (treatment: 'page'). */
export const servicePages = services.filter((s) => s.treatment === 'page');

/** The seven launch pages. */
export const launchServices = services.filter((s) => s.launchSet);

/** Services under a capability. */
export function servicesForCapability(capabilityId: CapabilityId): Service[] {
  return services.filter((s) => s.capabilityId === capabilityId);
}

/** Look up one service by slug. */
export function getService(id: ServiceId): Service | undefined {
  return services.find((s) => s.id === id);
}
