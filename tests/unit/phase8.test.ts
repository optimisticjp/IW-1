import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Phase 8 — cross-cutting hardening gate (T063–T072). Sweeps the whole built
// site (dist/) for the metadata, structured-data, honesty, security and
// performance-budget contracts. Skips gracefully if the site is not built.

const root = resolve(__dirname, '../..');
const distDir = resolve(root, 'dist');
const built = existsSync(distDir);
const read = (p: string) => readFileSync(p, 'utf8');

/** Every built HTML page as { route, file, html }. */
function allPages() {
  const out: { route: string; file: string; html: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const rel = p.slice(distDir.length).replace(/\\/g, '/');
        const route = rel.replace(/\/index\.html$/, '') || '/';
        out.push({ route, file: p, html: read(p) });
      }
    }
  };
  if (built) walk(distDir);
  return out;
}

const pages = allPages();
const indexable = pages.filter((p) => !/\/?404\.html$/.test(p.file));
const d = built ? describe : describe.skip;

const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');

const jsonLdBlocks = (html: string): any[] => {
  const out: any[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(m[1]);
      Array.isArray(parsed) ? out.push(...parsed) : out.push(parsed);
    } catch {
      /* invalid JSON-LD is caught by the assertion below */
    }
  }
  return out;
};
const types = (html: string) => jsonLdBlocks(html).map((s) => s['@type']);

const BUZZ = ['leverage', 'unlock', 'seamless', 'empower', 'holistic', 'elevate', 'robust', 'synergy', 'cutting-edge', 'best-in-class', 'world-class', 'game-changing'];
const SUPERLATIVE = ['the best', 'number one', '#1', 'award-winning', 'world class'];

/**
 * Returns the offending snippet if visible copy makes a POSITIVE guarantee
 * (FR-037). The honest copy deliberately DIS-claims guarantees ("no guaranteed
 * results", "no honest agency can guarantee"), so a "guarantee" token is only a
 * violation when it is not negated within the preceding window.
 */
function positiveGuarantee(text: string): string | null {
  const re = /guarantee(?:s|d|ing)?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 45), m.index);
    if (!/\b(no|not|never|cannot|can\s?not|can't|n't|without|can|honest)\b[\s\S]{0,40}$/i.test(before)) {
      return text.slice(Math.max(0, m.index - 30), m.index + 30);
    }
  }
  return null;
}
// figures that would imply invented, unbaselined proof in visible marketing copy
const INVENTED_FIGURE = /(\$\s?\d|£\s?\d|€\s?\d|\d+\s?%|\b\d+x\b|\bx\d+\b|\b\d+(?:\.\d+)?\s?(?:percent|roas|roi)\b)/i;

describe('T066 — capability contrast tokens stay AA-safe (regression guard)', () => {
  const tokens = read(resolve(root, 'src/styles/tokens.css'));
  // The amber (Convert) and green (Retain) deep tokens are the light hues that
  // needed darkening to clear WCAG AA as small text. Verified ceilings via axe:
  // Convert ≤52% base, Retain ≤62% base. A future edit that lightens them past
  // these points would reintroduce the sub-4.5:1 failure, so pin the ceiling.
  it('convert-deep base mix is ≤52% (amber darkened for AA)', () => {
    const pct = Number(tokens.match(/--cap-convert-deep:\s*color-mix\(in oklab,\s*#f5a623\s+(\d+)%/)?.[1]);
    expect(pct).toBeLessThanOrEqual(52);
  });
  it('retain-deep base mix is ≤62% (green darkened for AA)', () => {
    const pct = Number(tokens.match(/--cap-retain-deep:\s*color-mix\(in oklab,\s*#12b886\s+(\d+)%/)?.[1]);
    expect(pct).toBeLessThanOrEqual(62);
  });
});

d('T063 — per-page metadata sweep (all indexable pages)', () => {
  it('every indexable page has exactly one <h1>', () => {
    const bad = indexable.filter((p) => (p.html.match(/<h1[\s>]/g) || []).length !== 1);
    expect(bad.map((p) => p.route)).toEqual([]);
  });

  it('every indexable page has a non-empty <title> and meta description', () => {
    for (const p of indexable) {
      const title = p.html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
      const desc = p.html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
      expect(title, `${p.route} title`).toBeTruthy();
      expect(desc, `${p.route} description`).toBeTruthy();
    }
  });

  it('titles and descriptions are unique across the site', () => {
    const titles = indexable.map((p) => p.html.match(/<title>([^<]*)<\/title>/)?.[1]);
    const descs = indexable.map((p) => p.html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
    expect(new Set(titles).size).toBe(indexable.length);
    expect(new Set(descs).size).toBe(indexable.length);
  });

  it('every indexable page has exactly one self-referential canonical', () => {
    for (const p of indexable) {
      const canon = [...p.html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
      expect(canon.length, `${p.route} canonical count`).toBe(1);
      const path = new URL(canon[0]).pathname.replace(/\/$/, '') || '/';
      expect(path, `${p.route} canonical path`).toBe(p.route);
    }
  });

  it('titles use the pipe suffix, never an em dash (FR-036)', () => {
    for (const p of indexable) {
      const title = p.html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
      expect(title).toContain('Infinite Weblinks');
      expect(title).not.toContain('—');
    }
  });
});

d('T064 — visible-only structured data', () => {
  it('every indexable page carries WebPage; home carries Organization + WebSite', () => {
    for (const p of indexable) {
      const t = types(p.html);
      expect(t, `${p.route} WebPage`).toContain('WebPage');
      if (p.route === '/') {
        expect(t).toContain('Organization');
        expect(t).toContain('WebSite');
      }
    }
  });

  it('BreadcrumbList is emitted exactly when a visible breadcrumb is rendered (visible-only)', () => {
    for (const p of indexable) {
      const hasVisibleCrumb = p.html.includes('aria-label="Breadcrumb"');
      const hasSchema = types(p.html).includes('BreadcrumbList');
      expect(hasSchema, `${p.route} breadcrumb schema/visible mismatch`).toBe(hasVisibleCrumb);
    }
  });

  it('articles carry Article schema; the FAQ hub carries FAQPage', () => {
    for (const p of indexable.filter((x) => x.route.startsWith('/insights/'))) {
      expect(types(p.html), `${p.route}`).toContain('Article');
    }
    const faq = indexable.find((p) => p.route === '/faq');
    if (faq) expect(types(faq.html)).toContain('FAQPage');
  });

  it('all JSON-LD parses and every node has @context + @type', () => {
    for (const p of indexable) {
      const blocks = jsonLdBlocks(p.html);
      expect(blocks.length, `${p.route} has JSON-LD`).toBeGreaterThan(0);
      for (const node of blocks) {
        expect(node['@context'], `${p.route} @context`).toBe('https://schema.org');
        expect(node['@type'], `${p.route} @type`).toBeTruthy();
      }
    }
  });

  it('carries no rating/review schema (no invented proof)', () => {
    for (const p of indexable) {
      const blob = JSON.stringify(jsonLdBlocks(p.html));
      expect(blob).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
    }
  });
});

d('T065 — sitemap, robots and 404 exclusion', () => {
  const sitemap = existsSync(resolve(distDir, 'sitemap-0.xml')) ? read(resolve(distDir, 'sitemap-0.xml')) : '';
  const robots = existsSync(resolve(distDir, 'robots.txt')) ? read(resolve(distDir, 'robots.txt')) : '';

  it('sitemap includes indexable routes and excludes 404', () => {
    expect(sitemap).toBeTruthy();
    for (const p of indexable) {
      const loc = p.route === '/' ? '/' : `${p.route}/`;
      expect(sitemap, `sitemap missing ${p.route}`).toContain(`${loc}</loc>`);
    }
    expect(sitemap).not.toContain('/404');
  });

  it('404 is noindex', () => {
    const nf = pages.find((p) => /404\.html$/.test(p.file));
    expect(nf?.html).toMatch(/<meta name="robots" content="noindex/);
  });

  it('robots is env-aware and never leaks localhost', () => {
    expect(robots).toMatch(/Sitemap:\s*https?:\/\/[^\s]+\/sitemap-index\.xml/);
    expect(robots.toLowerCase()).not.toContain('localhost');
  });
});

d('T069 — security headers, CSP and no client-side secrets', () => {
  const headers = existsSync(resolve(root, 'public/_headers')) ? read(resolve(root, 'public/_headers')) : '';

  it('_headers ships every baseline security header', () => {
    for (const h of [
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'X-Frame-Options: DENY',
      'Permissions-Policy:',
      'Strict-Transport-Security: max-age=',
      'Content-Security-Policy:',
    ]) expect(headers).toContain(h);
  });

  it('CSP is scoped: no wildcard, no unsafe-eval, form paths reach the endpoint origin', () => {
    const csp = headers.match(/Content-Security-Policy: ([^\n]+)/)?.[1] || '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).toContain("script-src 'self'");
    expect(csp).toMatch(/connect-src 'self' https:\/\/[^\s;]+/);
    expect(csp).toMatch(/form-action 'self' https:\/\/[^\s;]+/);
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/connect-src[^;]*\*/);
    expect(csp).not.toMatch(/script-src[^;]*\*/);
  });

  it('no built page loads third-party JavaScript at initial load', () => {
    for (const p of pages) {
      for (const m of p.html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
        const src = m[1];
        expect(/^(\/|\.\/)/.test(src), `${p.route} loads external script ${src}`).toBe(true);
      }
    }
  });

  it('no built page leaks a localhost URL or an env endpoint value', () => {
    for (const p of pages) {
      expect(p.html.toLowerCase()).not.toContain('localhost');
      expect(p.html).not.toContain('PUBLIC_BOOKING_ENDPOINT');
      expect(p.html).not.toContain('PUBLIC_NEWSLETTER_ENDPOINT');
    }
  });
});

d('T070 — performance budgets (built asset sizes, gzip transfer)', () => {
  const gz = (p: string) => (existsSync(p) ? gzipSync(readFileSync(p)).length : 0);
  const astroDir = resolve(distDir, '_astro');
  const interactiveRoutes = ['/map-your-stack', '/book-a-call', '/contact'];

  const pageAssets = (html: string) => {
    let css = 0, js = 0;
    for (const a of new Set([...html.matchAll(/\/_astro\/([^"'\s>]+\.(?:css|js))/g)].map((m) => m[1]))) {
      const g = gz(join(astroDir, a));
      if (a.endsWith('.css')) css += g; else js += g;
    }
    return { css, js };
  };

  it('per-page JS is within budget (≤30 KB content, ≤50 KB interactive)', () => {
    for (const p of indexable) {
      const { js } = pageAssets(p.html);
      const budget = interactiveRoutes.includes(p.route) ? 50 * 1024 : 30 * 1024;
      expect(js, `${p.route} JS ${(js / 1024).toFixed(1)}KB`).toBeLessThanOrEqual(budget);
    }
  });

  it('per-page CSS is ≤40 KB', () => {
    for (const p of indexable) {
      const { css } = pageAssets(p.html);
      expect(css, `${p.route} CSS ${(css / 1024).toFixed(1)}KB`).toBeLessThanOrEqual(40 * 1024);
    }
  });

  it('per-page initial transfer weight is ≤500 KB', () => {
    for (const p of indexable) {
      const { css, js } = pageAssets(p.html);
      const total = gzipSync(Buffer.from(p.html)).length + css + js;
      expect(total, `${p.route} initial ${(total / 1024).toFixed(1)}KB`).toBeLessThanOrEqual(500 * 1024);
    }
  });

  it('total shipped JavaScript across the whole site is modest (zero third-party)', () => {
    let total = 0;
    if (existsSync(astroDir)) for (const f of readdirSync(astroDir)) if (f.endsWith('.js')) total += gz(join(astroDir, f));
    expect(total, `site JS ${(total / 1024).toFixed(1)}KB`).toBeLessThanOrEqual(50 * 1024);
  });
});

d('T071 — copy-honesty lint across rendered output', () => {
  it('no em dash in any visible customer-facing copy', () => {
    const bad = indexable.filter((p) => visibleText(p.html).includes('—'));
    expect(bad.map((p) => p.route)).toEqual([]);
  });

  it('no banned buzzwords or unsupported superlatives in visible copy', () => {
    for (const p of indexable) {
      const t = visibleText(p.html).toLowerCase();
      for (const b of BUZZ) expect(t, `${p.route} buzzword "${b}"`).not.toMatch(new RegExp(`\\b${b}\\b`));
      for (const s of SUPERLATIVE) expect(t, `${p.route} superlative "${s}"`).not.toContain(s);
    }
  });

  it('makes no positive/unsupported guarantee (negated anti-guarantees are allowed)', () => {
    for (const p of indexable) {
      const hit = positiveGuarantee(visibleText(p.html));
      expect(hit, `${p.route} positive guarantee: "${hit}"`).toBeNull();
    }
  });

  it('no invented figures in editorial/proof surfaces', () => {
    const proof = indexable.filter((p) => /^\/(work|insights|about)/.test(p.route));
    for (const p of proof) {
      expect(INVENTED_FIGURE.test(visibleText(p.html)), `${p.route} figure-like claim`).toBe(false);
    }
  });

  it('anonymized proof is labelled and owner placeholders stay out of public pages', () => {
    const work = indexable.find((p) => p.route === '/work');
    expect(work?.html.toLowerCase()).toContain('anonymized');
    const about = indexable.find((p) => p.route === '/about');
    expect(about?.html).not.toContain('Owner to supply');
    expect(about?.html).not.toContain('Photo to supply');
    for (const legal of ['/privacy', '/cookies', '/terms']) {
      const p = indexable.find((x) => x.route === legal);
      expect(p?.html, `${legal} review status`).toContain('Draft for review');
    }
  });
});
