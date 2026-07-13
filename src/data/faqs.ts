// Shared and per-page FAQ sets (spec 002, FR-034). Answers are plain-English
// and pass the copy ban list: no em dashes, superlatives, buzzwords, flagged
// claims or invented figures. Referenced by id from capabilities/services.

export type FaqScope = 'home' | 'capability' | 'service' | 'audience' | 'hub';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  scope: FaqScope;
}

export const faqs: Faq[] = [
  // Build
  { id: 'build-timeline', scope: 'capability', question: 'How long does a build take?', answer: 'It depends on scope, and we will give you a realistic range before we start. We would rather set an honest timeline than a hopeful one.' },
  { id: 'build-platform', scope: 'capability', question: 'Which platform will you build on?', answer: 'The one that fits your business, not the one we prefer. For stores that is often Shopify or WooCommerce; for other sites it depends on what you need to connect.' },
  // Attract
  { id: 'attract-budget', scope: 'capability', question: 'How much should we spend on ads?', answer: 'Enough to learn, not so much that a mistake hurts. We start smaller, measure, and scale what works. We will talk through a sensible starting point on a call.' },
  { id: 'attract-seo-time', scope: 'capability', question: 'How long does SEO take?', answer: 'Longer than ads and worth it. It builds over months, so we set expectations up front and show progress along the way rather than promising a ranking.' },
  // Convert
  { id: 'convert-testing', scope: 'capability', question: 'Do you guess or test changes?', answer: 'We test where it matters. A change is only a real improvement when the numbers back it up, so we measure before we call anything a win.' },
  { id: 'convert-guarantee', scope: 'capability', question: 'Can you guarantee more conversions?', answer: 'No honest agency can guarantee a result. We can make it easier for the right visitors to buy, and we will show you what changed and why.' },
  // Retain
  { id: 'retain-email', scope: 'capability', question: 'Will email annoy our customers?', answer: 'Not when it is useful. Email tied to what someone browsed or bought is welcome; generic blasts are not. We build the first kind.' },
  { id: 'retain-crm', scope: 'capability', question: 'Do we need a CRM for this?', answer: 'For the best results, yes, because the timing depends on knowing who bought what. We can start simple and grow into it.' },
  // Connect
  { id: 'connect-tracking', scope: 'capability', question: 'Why do our numbers never agree?', answer: 'Usually because each tool measures differently and nothing shares a source of truth. We fix the tracking so one number means one thing.' },
  { id: 'connect-crm', scope: 'capability', question: 'Which CRM should we use?', answer: 'We choose it with you based on how you sell and what you need to connect, then set it up so every customer sits in one record.' },
  // Scale
  { id: 'scale-ai', scope: 'capability', question: 'Will AI replace our team?', answer: 'No. It can take repetitive work off their plate so they spend time on the things only people do well. We are honest about where it helps and where it does not.' },
  { id: 'scale-automation', scope: 'capability', question: 'Is automation risky?', answer: 'Only when it runs on messy data. We connect the data first, then automate, so the automation is reliable rather than a new source of errors.' },
  // Home / hub
  { id: 'home-what', scope: 'home', question: 'What does Infinite Weblinks actually do?', answer: 'We build, run and connect the digital side of your business, so the parts work together and you can focus on your work.' },
  { id: 'home-size', scope: 'home', question: 'Are you only for ecommerce?', answer: 'No. We work with solo experts, new brands, growing teams and established teams. Ecommerce just shows the connections most clearly.' },
];

/** Look up a set of FAQs by id, preserving order. */
export function getFaqs(ids: string[]): Faq[] {
  return ids.map((id) => faqs.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));
}
