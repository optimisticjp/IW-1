import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { services, servicePages, launchServices } from '../../src/data/services';
import { capabilities } from '../../src/data/capabilities';
import { audiences } from '../../src/data/audiences';

// Phase 9 — final integration & content-validation gate (T073/T074). Crawls the
// actual built site to prove every rendered internal link, CTA and breadcrumb
// resolves (no dead ends), and that the full catalogue of routes exists.

const root = resolve(__dirname, '../..');
const distDir = resolve(root, 'dist');
const built = existsSync(distDir);
const d = built ? describe : describe.skip;

function collectPages() {
  const out: { route: string; file: string; html: string; ids: Set<string> }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const html = readFileSync(p, 'utf8');
        const route = p.slice(distDir.length).replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
        out.push({ route, file: p, html, ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])) });
      }
    }
  };
  if (built) walk(distDir);
  return out;
}

const pages = collectPages();
const routeSet = new Set(pages.map((p) => p.route));
const byRoute = new Map(pages.map((p) => [p.route, p]));
const assetExists = (p: string) => existsSync(join(distDir, p));

d('T074 — every rendered internal link resolves (no dead ends)', () => {
  it('has no broken internal href across the whole build', () => {
    const broken: string[] = [];
    for (const p of pages) {
      for (const m of p.html.matchAll(/href="([^"]+)"/g)) {
        const href = m[1];
        if (/^(https?:|mailto:|tel:)/.test(href)) continue;
        if (href.startsWith('#')) {
          if (href.length > 1 && !p.ids.has(href.slice(1))) broken.push(`${p.route}: in-page ${href}`);
          continue;
        }
        if (!href.startsWith('/')) continue;
        const [pathPart, frag] = href.split('#');
        const clean = pathPart.split('?')[0].replace(/\/$/, '') || '/';
        if (/\.[a-z0-9]+$/i.test(clean) || clean.startsWith('/_astro/')) {
          if (!assetExists(clean)) broken.push(`${p.route}: asset ${clean}`);
          continue;
        }
        if (!routeSet.has(clean)) { broken.push(`${p.route}: -> ${clean}`); continue; }
        if (frag && !byRoute.get(clean)!.ids.has(frag)) broken.push(`${p.route}: ${clean}#${frag}`);
      }
    }
    expect(broken).toEqual([]);
  });
});

d('T074 — CTA labels match their destinations (FR-042)', () => {
  // Known primary CTAs: the visible label must point at the right route.
  const CTA: Record<string, string> = {
    'Book a free call': '/book-a-call',
    'Map your stack': '/map-your-stack',
  };
  it('every "Book a free call" / "Map your stack" anchor points to the matching route', () => {
    const bad: string[] = [];
    for (const p of pages) {
      for (const m of p.html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
        const href = m[1].split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
        const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        for (const [label, dest] of Object.entries(CTA)) {
          if (text === label && href !== dest) bad.push(`${p.route}: "${label}" -> ${href} (expected ${dest})`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

d('T074 — no commercial page is a dead end', () => {
  it('every capability, service and audience page links to the consultation', () => {
    const commercial = pages.filter(
      (p) => /^\/what-we-do\/[^/]+$/.test(p.route) || /^\/services\//.test(p.route) || /^\/who-we-help\/[^/]+$/.test(p.route),
    );
    expect(commercial.length).toBeGreaterThan(0);
    const missing = commercial.filter((p) => !p.html.includes('href="/book-a-call"'));
    expect(missing.map((p) => p.route)).toEqual([]);
  });
});

d('T073 — full route catalogue is present', () => {
  it('all 25 service pages are modelled and the 7 launch routes are built', () => {
    expect(servicePages).toHaveLength(25);
    expect(launchServices).toHaveLength(7);
    for (const s of launchServices) expect(routeSet.has(`/services/${s.id}`), `/services/${s.id}`).toBe(true);
  });
  it('all six capability and six audience routes are built', () => {
    for (const c of capabilities) expect(routeSet.has(`/what-we-do/${c.id}`), c.id).toBe(true);
    for (const a of audiences) expect(routeSet.has(`/who-we-help/${a.id}`), a.id).toBe(true);
  });
  it('every phased (page-treatment) service is reachable via a capability section anchor', () => {
    const phased = services.filter((s) => s.treatment === 'page' && !s.launchSet);
    const missing: string[] = [];
    for (const s of phased) {
      const cap = byRoute.get(`/what-we-do/${s.capabilityId}`);
      if (!cap || !cap.ids.has(`svc-${s.id}`)) missing.push(`${s.id} under ${s.capabilityId}`);
    }
    expect(missing).toEqual([]);
  });
  it('core, editorial and legal routes are all built', () => {
    for (const r of ['/', '/what-we-do', '/who-we-help', '/how-it-connects', '/map-your-stack', '/book-a-call', '/contact', '/work', '/insights', '/about', '/faq', '/privacy', '/cookies', '/terms']) {
      expect(routeSet.has(r), r).toBe(true);
    }
  });
});

d('T074 — breadcrumbs are correct where present', () => {
  it('every page with a visible breadcrumb starts at Home and ends at a non-link current page', () => {
    const bad: string[] = [];
    for (const p of pages) {
      const nav = p.html.match(/<nav class="crumbs"[\s\S]*?<\/nav>/);
      if (!nav) continue;
      const items = [...nav[0].matchAll(/<a[^>]*class="crumbs__link"[^>]*>([\s\S]*?)<\/a>|<span class="crumbs__current"[^>]*>([\s\S]*?)<\/span>/g)];
      const first = (items[0]?.[1] || '').trim();
      if (first !== 'Home') bad.push(`${p.route}: first crumb "${first}"`);
      const last = items[items.length - 1];
      if (!last || !last[2]) bad.push(`${p.route}: last crumb is not a non-link current page`);
    }
    expect(bad).toEqual([]);
  });
});
