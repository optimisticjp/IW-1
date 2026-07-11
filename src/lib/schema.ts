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

/** Serialize one or more schema objects to a JSON-LD string. */
export function jsonLd(...schemas: object[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
