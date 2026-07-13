import { describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import {
  checkEnvExample,
  isMainModule,
  robotsBlocksAllCrawling,
  validateBookingEndpoint,
  validateSiteUrl,
  verifyFixture,
} from '../../scripts/verify-launch.mjs';

const site = 'https://www.infiniteweblinks.com';
const endpoint = 'https://formspree.io/f/abc123';

function fixture(opts: { html?: string; sitemap?: string; robots?: string; headers?: string; env?: string | null } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'launch-verify-'));
  const dist = join(dir, 'dist');
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, 'index.html'), opts.html ?? html('<a href="/missing-file">Missing</a>'));
  writeFileSync(join(dist, 'robots.txt'), opts.robots ?? `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap-index.xml\n`);
  writeFileSync(join(dist, 'sitemap-index.xml'), opts.sitemap ?? `<urlset><url><loc>${site}/</loc></url></urlset>`);
  writeFileSync(join(dist, '_headers'), opts.headers ?? headers('https://formspree.io'));
  const env = join(dir, '.env.example');
  if (opts.env !== null) writeFileSync(env, opts.env ?? 'PUBLIC_SITE_URL=\nPUBLIC_BOOKING_ENDPOINT=\nPUBLIC_NEWSLETTER_ENDPOINT=\n');
  return { root: dir, dist, env };
}

function nestedFixture(extra: string) {
  const f = fixture({ html: html('') });
  mkdirSync(join(f.dist, 'section'), { recursive: true });
  writeFileSync(join(f.dist, 'section', 'index.html'), html(extra, `${site}/section/`));
  return f;
}

function html(extra = '', canonical = `${site}/`) {
  return `<!doctype html><html><head><link rel="canonical" href="${canonical}"></head><body><h1 id="top">Home</h1><a href="#top">Top</a>${extra}</body></html>`;
}

function headers(origin: string) {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; connect-src 'self' ${origin}; form-action 'self' ${origin}
`;
}

function run(f: ReturnType<typeof fixture>, values = {}) {
  return verifyFixture({ distDir: f.dist, siteUrl: site, bookingEndpoint: endpoint, envExamplePath: f.env, ...values });
}

describe('launch verification URL validation', () => {
  it('blocks missing PUBLIC_SITE_URL', () => expect(validateSiteUrl('')[0].check).toContain('missing'));
  it('blocks reserved .example domains', () => expect(validateSiteUrl('https://brand.example').some((b) => b.check.includes('reserved'))).toBe(true));
  it('blocks HTTP rather than HTTPS', () => expect(validateSiteUrl('http://www.infiniteweblinks.com').some((b) => b.check.includes('https'))).toBe(true));
  it('accepts a valid production site URL', () => expect(validateSiteUrl(site)).toEqual([]));
  it('blocks PUBLIC_SITE_URL paths because it must be a clean origin', () => {
    expect(validateSiteUrl('https://www.example.com/subdirectory').some((b) => b.check.includes('clean origin'))).toBe(true);
    expect(validateSiteUrl('https://www.example.com/store/index.html').some((b) => b.action.includes('https://domain.com'))).toBe(true);
  });
  it('blocks missing booking endpoint', () => expect(validateBookingEndpoint('')[0].check).toContain('missing'));
  it('redacts booking endpoint path and credentials in error output', () => {
    const blocks = validateBookingEndpoint('http://user:pass@forms.example/f/private-id?token=secret#frag');
    expect(JSON.stringify(blocks)).not.toContain('private-id');
    expect(JSON.stringify(blocks)).not.toContain('token=secret');
    expect(JSON.stringify(blocks)).not.toContain('pass@');
  });
  it('blocks booking endpoint loopback cases without printing paths', () => {
    for (const value of [
      'https://localhost/forms/private',
      'https://sub.localhost/forms/private',
      'https://127.0.0.1/forms/private',
      'https://0.0.0.0/forms/private',
      'https://[::1]/forms/private',
    ]) {
      const text = JSON.stringify(validateBookingEndpoint(value));
      expect(text).toContain('loopback');
      expect(text).not.toContain('/forms/private');
    }
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
  it('blocks dist with no HTML output', () => {
    const f = fixture({ html: html('') });
    rmSync(join(f.dist, 'index.html'));
    expect(run(f).blocks.some((b) => b.check.includes('no HTML pages'))).toBe(true);
  });
});

describe('relative internal links', () => {
  it('accepts a valid relative route', () => expect(run(nestedFixture('<a href="../">Home</a>')).ok).toBe(true));
  it('blocks a broken relative route', () => expect(run(nestedFixture('<a href="missing-page">Missing</a>')).blocks.some((b) => b.check.includes('/section/missing-page'))).toBe(true));
  it('accepts a valid relative static file', () => {
    const f = nestedFixture('<a href="./guide.pdf?download=1">Guide</a>');
    writeFileSync(join(f.dist, 'section', 'guide.pdf'), 'pdf');
    expect(run(f).ok).toBe(true);
  });
  it('blocks a broken relative static file', () => expect(run(nestedFixture('<a href="./missing-file.pdf">Missing</a>')).blocks.some((b) => b.check.includes('/section/missing-file.pdf'))).toBe(true));
  it('accepts a relative link with a valid fragment', () => expect(run(nestedFixture('<a href="../#top">Top</a>')).ok).toBe(true));
  it('blocks a relative link with a missing fragment', () => expect(run(nestedFixture('<a href="../#missing">Missing</a>')).blocks.some((b) => b.check.includes('/#missing'))).toBe(true));
});

describe('.env.example safety', () => {
  it('allows blank documented public variables', () => expect(checkEnvExample(fixture().env)).toEqual([]));
  it('blocks a non-empty committed site URL', () => expect(checkEnvExample(fixture({ env: 'PUBLIC_SITE_URL=https://www.infiniteweblinks.com\n' }).env).some((b) => b.check.includes('PUBLIC_SITE_URL'))).toBe(true));
  it('blocks a non-empty booking endpoint without printing its path', () => {
    const blocks = checkEnvExample(fixture({ env: 'PUBLIC_BOOKING_ENDPOINT=https://formspree.io/f/private-id\n' }).env);
    expect(JSON.stringify(blocks)).toContain('PUBLIC_BOOKING_ENDPOINT');
    expect(JSON.stringify(blocks)).not.toContain('private-id');
  });
  it('blocks a common token format without printing the token', () => {
    const token = 'ghp_abcdefghijklmnopqrstuvwxyz1234567890';
    const blocks = checkEnvExample(fixture({ env: `# docs\nTOKEN=${token}\n` }).env);
    expect(JSON.stringify(blocks)).toContain('secret or private credential');
    expect(JSON.stringify(blocks)).not.toContain(token);
  });
  it('blocks a missing .env.example file', () => {
    const f = fixture({ env: null });
    expect(existsSync(f.env)).toBe(false);
    expect(checkEnvExample(f.env)[0].check).toContain('missing');
  });
});

describe('robots parsing', () => {
  it('detects globally blocked production robots with CRLF, comments, blanks and intervening directives', () => {
    const robots = 'User-agent: *\r\n# comment\r\nAllow: /public\r\n\r\nDisallow: /\r\n';
    expect(robotsBlocksAllCrawling(robots)).toBe(true);
  });
  it('allows production robots when User-agent: * is allowed', () => {
    expect(robotsBlocksAllCrawling('User-agent: *\nAllow: /\nDisallow:\n')).toBe(false);
  });
});

describe('portable CLI path helpers', () => {
  it('matches file URLs to argv paths even when paths contain spaces', () => {
    const fakePath = join(tmpdir(), 'repo with spaces', 'scripts', 'verify-launch.mjs');
    expect(isMainModule(pathToFileURL(fakePath).href, fakePath)).toBe(true);
  });
});
