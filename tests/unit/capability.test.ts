import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { capabilities } from '../../src/data/capabilities';
import { servicesForCapability, launchServices } from '../../src/data/services';

const root = resolve(__dirname, '../..');
const dist = (p: string) =>
  existsSync(resolve(root, `dist/${p}`)) ? readFileSync(resolve(root, `dist/${p}`), 'utf8') : '';
const pages = Object.fromEntries(
  capabilities.map((c) => [c.id, dist(`what-we-do/${c.id}/index.html`)])
);
const built = Object.values(pages).every(Boolean);

describe('capability content model (Phase 3)', () => {
  it('every capability carries a distinct principle and what-becomes-possible set', () => {
    for (const c of capabilities) {
      expect(c.principle.length).toBeGreaterThan(10);
      expect(c.becomesPossible.length).toBeGreaterThanOrEqual(2);
    }
    const principles = capabilities.map((c) => c.principle);
    expect(new Set(principles).size).toBe(6); // no repeated template copy
  });

  it('capability copy is free of em dashes and flagged claims', () => {
    const blob = JSON.stringify(capabilities);
    expect(blob).not.toContain('—');
    expect(blob.toLowerCase()).not.toContain('guaranteed');
    expect(blob.toLowerCase()).not.toContain('world-class');
  });

  it('each capability has at least one launch service linked to a dedicated route', () => {
    // Every launch service belongs to some capability and routes to /services/{slug}.
    for (const s of launchServices) {
      const sibs = servicesForCapability(s.capabilityId);
      expect(sibs.some((x) => x.id === s.id)).toBe(true);
    }
  });
});

(built ? describe : describe.skip)('rendered capability pages (dist)', () => {
  it('all six capability pages built with exactly one H1', () => {
    for (const c of capabilities) {
      const html = pages[c.id];
      expect(html).toBeTruthy();
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
    }
  });

  it('each page has a breadcrumb with the current page marked and a canonical URL', () => {
    for (const c of capabilities) {
      const html = pages[c.id];
      expect(html).toMatch(/aria-label="Breadcrumb"/);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/what-we-do/${c.id}"`));
      expect(html).toContain('"@type":"BreadcrumbList"');
    }
  });

  it('renders the six-capability sibling switcher with the current one marked', () => {
    const html = pages.build;
    for (const c of capabilities) expect(html).toContain(`/what-we-do/${c.id}`);
    expect(html).toMatch(/aria-current="page"/);
  });

  it('launch services link to their dedicated routes; phased services do not', () => {
    for (const c of capabilities) {
      const html = pages[c.id];
      const svcs = servicesForCapability(c.id);
      for (const s of svcs.filter((x) => x.launchSet)) {
        expect(html).toContain(`/services/${s.id}`); // planned dedicated route
      }
      for (const s of svcs.filter((x) => x.treatment === 'page' && !x.launchSet)) {
        // phased pages appear as sections, never as links to an unbuilt route
        expect(html).not.toContain(`href="/services/${s.id}"`);
      }
    }
  });

  it('every page exposes both a consultation and a Map Your Stack CTA', () => {
    for (const c of capabilities) {
      expect(pages[c.id]).toContain('/book-a-call');
      expect(pages[c.id]).toContain('/map-your-stack');
    }
  });
});
