import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateSiteUrl, validateBookingEndpoint, verifyFixture } from '../../scripts/verify-launch.mjs';

const site = 'https://www.infiniteweblinks.com';
const endpoint = 'https://formspree.io/f/abc123';

function fixture(opts: { html?: string; sitemap?: string; robots?: string; headers?: string } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'launch-verify-'));
  mkdirSync(join(dir, 'dist'), { recursive: true });
  writeFileSync(join(dir, 'dist', 'index.html'), opts.html ?? html('<a href="/missing-file">Missing</a>'));
  writeFileSync(join(dir, 'dist', 'robots.txt'), opts.robots ?? `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap-index.xml\n`);
  writeFileSync(join(dir, 'dist', 'sitemap-index.xml'), opts.sitemap ?? `<urlset><url><loc>${site}/</loc></url></urlset>`);
  writeFileSync(join(dir, 'dist', '_headers'), opts.headers ?? headers('https://formspree.io'));
  writeFileSync(join(dir, '.env.example'), 'PUBLIC_SITE_URL=\nPUBLIC_BOOKING_ENDPOINT=\n');
  return { root: dir, dist: join(dir, 'dist'), env: join(dir, '.env.example') };
}
function html(extra = '') { return `<!doctype html><html><head><link rel="canonical" href="${site}/"></head><body><h1 id="top">Home</h1><a href="#top">Top</a>${extra}</body></html>`; }
function headers(origin: string) { return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; connect-src 'self' ${origin}; form-action 'self' ${origin}
`; }
function run(f: ReturnType<typeof fixture>, values = {}) { return verifyFixture({ distDir: f.dist, siteUrl: site, bookingEndpoint: endpoint, envExamplePath: f.env, ...values }); }

describe('launch verification URL validation', () => {
  it('blocks missing PUBLIC_SITE_URL', () => expect(validateSiteUrl('')[0].check).toContain('missing'));
  it('blocks reserved .example domains', () => expect(validateSiteUrl('https://brand.example').some((b) => b.check.includes('reserved'))).toBe(true));
  it('blocks HTTP rather than HTTPS', () => expect(validateSiteUrl('http://www.infiniteweblinks.com').some((b) => b.check.includes('https'))).toBe(true));
  it('accepts a valid production site URL', () => expect(validateSiteUrl(site)).toEqual([]));
  it('blocks missing booking endpoint', () => expect(validateBookingEndpoint('')[0].check).toContain('missing'));
  it('redacts booking endpoint path in error output', () => {
    const blocks = validateBookingEndpoint('http://user:pass@forms.example/f/private-id');
    expect(JSON.stringify(blocks)).not.toContain('private-id');
    expect(JSON.stringify(blocks)).not.toContain('pass@');
  });
});

describe('launch verification fixture checks', () => {
  it('detects legal draft markers', () => expect(run(fixture({ html: html('Draft for review') })).blocks.some((b) => b.check.includes('Draft for review'))).toBe(true));
  it('detects internal placeholders', () => expect(run(fixture({ html: html('Owner to supply') })).blocks.some((b) => b.check.includes('Owner to supply'))).toBe(true));
  it('passes correct sitemap origin', () => expect(run(fixture()).blocks.some((b) => b.check.includes('Sitemap'))).toBe(false));
  it('blocks /404 in sitemap', () => expect(run(fixture({ sitemap: `<urlset><url><loc>${site}/404</loc></url></urlset>` })).blocks.some((b) => b.check.includes('/404'))).toBe(true));
  it('blocks booking origin absent from CSP', () => expect(run(fixture({ headers: headers('https://other.example') })).blocks.some((b) => b.check.includes('absent from connect-src'))).toBe(true));
  it('blocks broken internal links', () => expect(run(fixture()).blocks.some((b) => b.check.includes('missing route'))).toBe(true));
  it('returns PASS for a fully valid temporary fixture', () => expect(run(fixture({ html: html('') })).ok).toBe(true));
});
