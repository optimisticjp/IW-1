// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site base URL is a placeholder until hosting is chosen (Phase 4 / launch).
// TODO(content): replace with the production origin before launch.
export default defineConfig({
  site: 'https://www.infiniteweblinks.example',
  integrations: [sitemap()],
  // Static-first: pre-render everything; islands hydrate selectively.
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
