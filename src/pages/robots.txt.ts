import type { APIRoute } from 'astro';

// Env-aware robots.txt (spec 002, FR-041). Policy confirmed 2026-07-11:
//  - allow search-discovery and AI-search CITATION crawlers (incl. OAI-SearchBot)
//  - block AI model-TRAINING crawlers (GPTBot, CCBot, Google-Extended)
// The Sitemap line is built from Astro's configured `site` (PUBLIC_SITE_URL), so
// it is always absolute and never a hardcoded localhost or false origin. On the
// reserved `.example` placeholder (no real domain supplied yet) the whole site
// is disallowed so preview/unconfigured builds are never indexed.

const TRAINING_BOTS = ['GPTBot', 'CCBot', 'Google-Extended'];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://www.infiniteweblinks.example');
  const sitemapUrl = new URL('sitemap-index.xml', origin).href;
  const isPlaceholder = origin.hostname.endsWith('.example');

  const lines: string[] = ['# Infinite Weblinks'];

  if (isPlaceholder) {
    // Not a production origin: keep it out of every index.
    lines.push('User-agent: *', 'Disallow: /', '', `Sitemap: ${sitemapUrl}`, '');
    return new Response(lines.join('\n'), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Block AI model-training crawlers explicitly.
  for (const bot of TRAINING_BOTS) {
    lines.push(`User-agent: ${bot}`, 'Disallow: /', '');
  }
  // Allow AI-search citation crawlers explicitly (they also match * below, but
  // naming them documents the intent).
  lines.push('User-agent: OAI-SearchBot', 'Allow: /', '');
  // Everyone else (search-discovery crawlers) is allowed.
  lines.push('User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
