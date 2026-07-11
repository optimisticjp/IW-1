import type { APIRoute } from 'astro';

// Env-aware robots.txt: the Sitemap line is built from Astro's configured `site`
// (driven by PUBLIC_SITE_URL), so it is always an absolute URL and never a
// hardcoded localhost or a false production origin. Prerendered to /robots.txt.
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://www.infiniteweblinks.example');
  const sitemapUrl = new URL('sitemap-index.xml', origin).href;
  const body = [
    '# Infinite Weblinks',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
