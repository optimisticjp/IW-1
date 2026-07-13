// JSON-LD structured-data builders. Placeholder values are allowed now; the
// builders emit valid shapes so real values slot in later (FR-043 / SC-014).

export function organizationSchema(siteUrl: string | URL) {
  const base = new URL(siteUrl).href.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Infinite Weblinks',
    url: base + '/',
    description:
      'A connected growth agency. We build and connect the digital systems behind modern businesses, so every part works together.',
    slogan: 'Grow your business digitally.',
    logo: new URL('/favicon.svg', siteUrl).href,
    // TODO(content): real social profiles before launch.
    sameAs: [] as string[],
  };
}

export function webSiteSchema(siteUrl: string | URL) {
  const base = new URL(siteUrl).href.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Infinite Weblinks',
    url: base + '/',
  };
}

/** WebPage schema for any indexable page (visible-only, FR-040). */
export function webPageSchema(name: string, canonical: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: canonical,
    ...(description ? { description } : {}),
  };
}

export interface BreadcrumbNode {
  label: string;
  href?: string; // omit for the current page
}

/**
 * BreadcrumbList matching the visible breadcrumb (FR-005/040). The current
 * page (no href) is included as the last item without a URL.
 */
export function breadcrumbSchema(items: BreadcrumbNode[], siteUrl: string | URL) {
  const base = new URL(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, base).href.replace(/\/$/, '') } : {}),
    })),
  };
}

/**
 * Article schema for an Insights piece (FR-032/040). Uses the visible
 * question/standfirst and the last-reviewed date; no invented author counts or
 * ratings. `dateModified` reflects the honest review date.
 */
export function articleSchema(input: {
  headline: string;
  description: string;
  canonical: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.canonical,
    dateModified: input.dateModified,
    author: { '@type': 'Organization', name: 'Infinite Weblinks' },
    publisher: { '@type': 'Organization', name: 'Infinite Weblinks' },
    mainEntityOfPage: input.canonical,
  };
}

/**
 * Service schema — only where the visible service page supports it (FR-040).
 * No invented ratings or reviews.
 */
export function serviceSchema(name: string, description: string, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: canonical,
    provider: { '@type': 'Organization', name: 'Infinite Weblinks' },
  };
}

/**
 * FAQPage schema (FR-034/040) built from visible question/answer pairs only.
 * Never includes questions that are not rendered on the page.
 */
export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Serialize one or more schema objects to a JSON-LD string. */
export function jsonLd(...schemas: object[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
