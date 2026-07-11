// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production origin. Driven by PUBLIC_SITE_URL so the real domain is supplied by
// the owner at build time; until then a reserved `.example` placeholder is used
// (never a real/speculative domain, and never localhost) so canonical, sitemap,
// and Open Graph URLs stay absolute and safe. See .env.example.
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.infiniteweblinks.example';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      // The custom 404 is not a normal indexed route.
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  // Static-first: pre-render everything; islands hydrate selectively.
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
