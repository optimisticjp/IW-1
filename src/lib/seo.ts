// Per-page SEO metadata helper. Temporary values are allowed until final
// content; the seams (title/description/canonical/OG) are mandatory now.

export interface SeoInput {
  title: string;
  description: string;
  /** path (leading slash) or absolute URL */
  path?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  robots?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: 'website' | 'article';
  robots: string;
}

const SITE_NAME = 'Infinite Weblinks';
const TITLE_SUFFIX = ' — Infinite Weblinks';
// Site-wide sharing image: a 1200×630 PNG (SVG is not rendered by most social
// platforms). Brand mark, palette, and voice; no invented proof.
const DEFAULT_OG = '/og/infinite-weblinks-default.png';

/** Build a complete, resolved SeoMeta object for a page. */
export function buildSeo(input: SeoInput, siteUrl: string | URL): SeoMeta {
  const base = new URL(siteUrl);
  const path = input.path ?? '/';
  const canonical = new URL(path, base).href.replace(/\/$/, '') || base.href;
  const title = input.title.includes(SITE_NAME)
    ? input.title
    : input.title + TITLE_SUFFIX;
  const ogImage = new URL(input.ogImage ?? DEFAULT_OG, base).href;

  return {
    title,
    description: input.description,
    canonical,
    ogTitle: input.title,
    ogDescription: input.description,
    ogImage,
    ogType: input.ogType ?? 'website',
    robots: input.robots ?? 'index,follow',
  };
}

export { SITE_NAME };
