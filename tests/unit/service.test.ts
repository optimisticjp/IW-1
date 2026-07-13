import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { services, launchServices, getService } from '../../src/data/services';
import { capabilities } from '../../src/data/capabilities';
import { getFaqs } from '../../src/data/faqs';

const root = resolve(__dirname, '../..');
const dist = (p: string) =>
  existsSync(resolve(root, `dist/${p}`)) ? readFileSync(resolve(root, `dist/${p}`), 'utf8') : '';
const pageOf = (slug: string) => dist(`services/${slug}/index.html`);
const built = launchServices.every((s) => pageOf(s.id));

describe('launch service content (Phase 4)', () => {
  it('all seven launch services carry rich, distinct detail', () => {
    expect(launchServices).toHaveLength(7);
    for (const s of launchServices) {
      expect(s.problem && s.problem.length > 10).toBeTruthy();
      expect(s.whoFor).toBeTruthy();
      expect((s.process || []).length).toBeGreaterThanOrEqual(3);
      expect((s.outcomes || []).length).toBeGreaterThanOrEqual(2);
      expect((s.specialistTools || []).length).toBeGreaterThan(0);
      expect(s.educational?.title).toBeTruthy();
    }
    // distinct problems and educational titles — no repeated template copy
    expect(new Set(launchServices.map((s) => s.problem)).size).toBe(7);
    expect(new Set(launchServices.map((s) => s.educational!.title)).size).toBe(7);
  });

  it('every launch service has its own distinct FAQ set', () => {
    const allFaqIds = launchServices.flatMap((s) => s.faqIds || []);
    expect(new Set(allFaqIds).size).toBe(allFaqIds.length); // no shared FAQ id across services
    for (const s of launchServices) expect(getFaqs(s.faqIds || [])).toHaveLength((s.faqIds || []).length);
  });

  it('related and connection references resolve, and related links point at launch pages', () => {
    for (const s of launchServices) {
      for (const r of s.relatedServiceIds || []) {
        const t = getService(r);
        expect(t).toBeTruthy();
        expect(t!.launchSet).toBe(true); // related links must be built pages
      }
      for (const c of s.connections || []) expect(getService(c)).toBeTruthy();
    }
  });

  it('canonical placement holds and copy avoids em dashes and flagged claims', () => {
    expect(getService('landing-pages')!.capabilityId).toBe('convert');
    expect(getService('crm-setup-and-integration')!.capabilityId).toBe('connect');
    const blob = JSON.stringify(services);
    expect(blob).not.toContain('—');
    expect(blob.toLowerCase()).not.toContain('guaranteed');
  });

  it('phased services expose no dedicated route (only the 7 launch pages exist)', () => {
    const phased = services.filter((s) => s.treatment === 'page' && !s.launchSet);
    for (const s of phased) expect(pageOf(s.id)).toBe('');
  });
});

(built ? describe : describe.skip)('rendered launch service pages (dist)', () => {
  it('all seven pages built with one H1, a 4-level breadcrumb and a parent up-link', () => {
    for (const s of launchServices) {
      const html = pageOf(s.id);
      const cap = capabilities.find((c) => c.id === s.capabilityId)!;
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      expect(html).toMatch(/aria-label="Breadcrumb"/);
      expect(html).toContain(`Part of ${cap.name}`); // parent up-link text
      expect(html).toMatch(new RegExp(`href="/what-we-do/${cap.id}"`));
    }
  });

  it('each page carries canonical + Service + WebPage + BreadcrumbList structured data', () => {
    for (const s of launchServices) {
      const html = pageOf(s.id);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/services/${s.id}"`));
      expect(html).toContain('"@type":"Service"');
      expect(html).toContain('"@type":"WebPage"');
      expect(html).toContain('"@type":"BreadcrumbList"');
    }
  });

  it('each page exposes matched consultation + Map Your Stack CTAs', () => {
    for (const s of launchServices) {
      expect(pageOf(s.id)).toContain('/book-a-call');
      expect(pageOf(s.id)).toContain('/map-your-stack');
    }
  });

  it('all /services links from homepage + capability pages resolve to built pages', () => {
    const sources = [dist('index.html'), ...capabilities.map((c) => dist(`what-we-do/${c.id}/index.html`))];
    const refs = new Set<string>();
    for (const html of sources) {
      for (const m of html.matchAll(/href="\/services\/([a-z0-9-]+)"/g)) refs.add(m[1]);
    }
    expect(refs.size).toBeGreaterThan(0);
    for (const slug of refs) expect(pageOf(slug)).not.toBe(''); // no dead launch-service link
  });
});
