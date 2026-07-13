import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { howItConnects } from '../../src/data/howItConnects';
import { primaryNav, footerGroups } from '../../src/data/nav';

const root = resolve(__dirname, '../..');
const read = (p: string) => (existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), 'utf8') : '');
const dist = (p: string) => read(`dist/${p}`);

const hc = dist('how-it-connects/index.html');
const nf = dist('404.html');
const robots = dist('robots.txt');
const sitemap = dist('sitemap-0.xml');
const BUZZ = ['leverage', 'unlock', 'seamless', 'empower', 'holistic', 'elevate', 'robust', 'synergy'];

describe('How It Connects content (verbatim)', () => {
  it('has route-specific SEO explaining the connection idea', () => {
    expect(howItConnects.seo.title).toBe('How It Connects');
    expect(howItConnects.seo.path).toBe('/how-it-connects');
    const desc = howItConnects.seo.description.toLowerCase();
    expect(desc).toContain('connect');
    expect(desc).toContain('systems');
  });

  it('hero copy is exact, with Map your stack as the primary action', () => {
    expect(howItConnects.hero.h1).toBe("More tools won't fix disconnected growth.");
    expect(howItConnects.hero.sub).toContain("That's the whole idea behind Infinite Weblinks.");
    expect(howItConnects.hero.primary).toEqual({ label: 'Map your stack', href: '/map-your-stack' });
    expect(howItConnects.hero.secondary).toEqual({ label: 'Book a free call', href: '/book-a-call' });
  });

  it('disconnected reality heading and body are exact', () => {
    expect(howItConnects.disconnected.h2).toBe("Every tool works. The information between them doesn't.");
    expect(howItConnects.disconnected.body).toContain('ads bringing traffic');
    expect(howItConnects.disconnected.body).toContain("you can't tell what actually made money.");
  });

  it('carries the three stories with exact titles and paths', () => {
    const byId = Object.fromEntries(howItConnects.stories.items.map((s) => [s.id, s]));
    expect(byId.acquire.title).toBe('Acquire.');
    expect((byId.acquire as any).path).toEqual(['Ads', 'Website', 'Tracking', 'Store']);
    expect(byId.retain.title).toBe('Retain.');
    expect((byId.retain as any).path).toEqual(['Store', 'CRM', 'Email or WhatsApp', 'Repeat purchase']);
    expect(byId.understand.title).toBe('Understand.');
    expect((byId.understand as any).sources).toEqual(['Ads', 'Website', 'Store', 'CRM']);
    expect((byId.understand as any).target).toBe('One dashboard');
  });

  it('before and after copy is exact', () => {
    expect(howItConnects.beforeAfter.before.copy).toBe("Separate tools, incomplete data, manual work, and reporting you can't trust.");
    expect(howItConnects.beforeAfter.after.copy).toBe('A connected customer journey, follow-up that runs itself, measurement you can rely on, and clearer decisions.');
  });

  it('CTA is "See where your growth is disconnected." with the two actions', () => {
    expect(howItConnects.cta.h2).toBe('See where your growth is disconnected.');
    expect(howItConnects.cta.primary.href).toBe('/map-your-stack');
    expect(howItConnects.cta.secondary.href).toBe('/book-a-call');
  });

  it('has no em dashes or buzzwords', () => {
    const blob = JSON.stringify(howItConnects);
    expect(blob).not.toContain('—');
    for (const b of BUZZ) expect(blob.toLowerCase()).not.toMatch(new RegExp(`\\b${b}\\b`));
  });
});

describe('Navigation points How it connects at the concept route', () => {
  it('header and footer resolve to /how-it-connects', () => {
    expect(primaryNav.find((i) => i.label === 'How it connects')!.href).toBe('/how-it-connects');
    // Restructure (FR-004): "How it connects" now sits under the Learn column.
    const learn = footerGroups.find((g) => g.heading === 'Learn')!;
    expect(learn.items.find((i) => i.label === 'How it connects')!.href).toBe('/how-it-connects');
  });
});

describe('Blank-section safety (Task 1)', () => {
  it('the hidden-first reveal state is gated on the controller-set .js-ready class', () => {
    const base = read('src/styles/base.css');
    expect(base).toContain('.js-ready .u-reveal');
    expect(base).not.toContain('html.js .u-reveal');
    const layout = read('src/layouts/BaseLayout.astro');
    // no synchronous class that would hide content before the controller runs
    expect(layout).not.toContain("classList.add('js')");
    // the controller arms the hidden state itself, and fails open
    expect(layout).toContain("classList.add('js-ready')");
    expect(layout).toContain("classList.remove('js-ready')");
  });
});

(hc ? describe : describe.skip)('built How It Connects page', () => {
  it('has one <h1> and the four concept sections', () => {
    expect((hc.match(/<h1/g) || []).length).toBe(1);
    for (const id of ['disconnected', 'stories', 'before-after', 'cta']) expect(hc).toContain(`id="${id}"`);
  });
  it('shows the three stories and before/after', () => {
    for (const t of ['Acquire.', 'Retain.', 'Understand.', '>Before<', '>After<']) expect(hc).toContain(t);
  });
  it('does NOT re-list the six-service catalogue from What we do', () => {
    for (const s of ['Shopify and Shopify Plus', 'ClickFunnels', 'white-label support for other agencies']) {
      expect(hc).not.toContain(s);
    }
  });
  it('CTA links resolve and metadata is present', () => {
    expect(hc).toContain('href="/map-your-stack"');
    expect(hc).toContain('href="/book-a-call"');
    expect(hc).toMatch(/<link rel="canonical" href="[^"]*\/how-it-connects"/);
    expect(hc).toContain('og/infinite-weblinks-default.png');
  });
});

(nf ? describe : describe.skip)('custom 404 page', () => {
  it('has one <h1>, is noindex, and links home + booking', () => {
    expect((nf.match(/<h1/g) || []).length).toBe(1);
    expect(nf).toMatch(/<meta name="robots" content="noindex/);
    expect(nf).toMatch(/href="\/"/);
    expect(nf).toContain('href="/book-a-call"');
  });
});

(sitemap ? describe : describe.skip)('sitemap + robots', () => {
  it('sitemap lists the six public routes and excludes /404', () => {
    for (const r of ['/', '/book-a-call/', '/how-it-connects/', '/map-your-stack/', '/what-we-do/', '/who-we-help/']) {
      expect(sitemap).toContain(`infiniteweblinks.example${r}</loc>`);
    }
    expect(sitemap).not.toContain('/404');
  });
  it('robots allows indexing and points to the absolute sitemap', () => {
    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/Allow:\s*\//);
    expect(robots).toMatch(/Sitemap:\s*https?:\/\/[^\s]+\/sitemap-index\.xml/);
    expect(robots).not.toContain('localhost');
  });
});

describe('launch assets + no localhost leak', () => {
  it('the OG share image is a PNG that exists and is referenced', () => {
    expect(existsSync(resolve(root, 'public/og/infinite-weblinks-default.png'))).toBe(true);
    expect(read('src/lib/seo.ts')).toContain('/og/infinite-weblinks-default.png');
  });
  it('the favicon uses the brand infinity mark', () => {
    expect(existsSync(resolve(root, 'public/favicon.svg'))).toBe(true);
  });
  it('no built output leaks a localhost URL', () => {
    for (const p of ['index.html', 'how-it-connects/index.html', '404.html', 'robots.txt', 'sitemap-0.xml']) {
      expect(dist(p).toLowerCase()).not.toContain('localhost');
    }
  });
  it('documents both owner-provided production values', () => {
    const env = read('.env.example');
    expect(env).toContain('PUBLIC_BOOKING_ENDPOINT');
    expect(env).toContain('PUBLIC_SITE_URL');
  });
});
