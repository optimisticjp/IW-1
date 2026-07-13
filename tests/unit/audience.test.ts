import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { audiences } from '../../src/data/audiences';
import { services, getService } from '../../src/data/services';
import { capabilities } from '../../src/data/capabilities';
import { AUDIENCE_IDS } from '../../src/data/ids';

const root = resolve(__dirname, '../..');
const dist = (p: string) =>
  existsSync(resolve(root, `dist/${p}`)) ? readFileSync(resolve(root, `dist/${p}`), 'utf8') : '';
const pageOf = (id: string) => dist(`who-we-help/${id}/index.html`);
const built = audiences.every((a) => pageOf(a.id));

const GOAL_MAP: Record<string, string> = {
  'more-sales': 'sales', 'lower-ad-waste': 'adwaste', 'more-repeat-customers': 'repeat',
  'know-whats-working': 'working', 'save-team-time': 'teamtime',
};

describe('audience content model (Phase 5)', () => {
  it('has the six audiences with distinct situations and concerns (no template copy)', () => {
    expect(audiences).toHaveLength(6);
    expect(audiences.map((a) => a.id).sort()).toEqual([...AUDIENCE_IDS].sort());
    expect(new Set(audiences.map((a) => a.situation)).size).toBe(6);
    expect(new Set(audiences.map((a) => a.concerns.join('|'))).size).toBe(6);
  });

  it('each audience has a matched action label, a starting point and a valid graph goal', () => {
    for (const a of audiences) {
      expect(a.actionLabel.length).toBeGreaterThan(4);
      expect(['launch', 'connect', 'scale']).toContain(a.startingPoint);
      expect(GOAL_MAP[a.graphVariant]).toBeTruthy();
    }
    // action labels differ across audiences (matched to situation), not one shared label
    expect(new Set(audiences.map((a) => a.actionLabel)).size).toBeGreaterThanOrEqual(4);
  });

  it('relevant service references all resolve', () => {
    const ids = new Set(services.map((s) => s.id));
    for (const a of audiences) for (const sid of a.relevantServiceIds) expect(ids.has(sid)).toBe(true);
  });

  it('audience copy avoids em dashes and flagged claims', () => {
    const blob = JSON.stringify(audiences);
    expect(blob).not.toContain('—');
    expect(blob.toLowerCase()).not.toContain('guaranteed');
  });
});

(built ? describe : describe.skip)('rendered audience pages (dist)', () => {
  it('all six pages built with one H1, breadcrumb and canonical + structured data', () => {
    for (const a of audiences) {
      const html = pageOf(a.id);
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      expect(html).toMatch(/aria-label="Breadcrumb"/);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/who-we-help/${a.id}"`));
      expect(html).toContain('"@type":"WebPage"');
      expect(html).toContain('"@type":"BreadcrumbList"');
    }
  });

  it('each audience Growth Graph opens on that audience\'s relevant goal', () => {
    for (const a of audiences) {
      const html = pageOf(a.id);
      const goalId = GOAL_MAP[a.graphVariant];
      // the pressed tab is the audience's goal
      const m = html.match(new RegExp(`data-goal="${goalId}"[^>]*aria-pressed="true"`));
      const m2 = html.match(new RegExp(`aria-pressed="true"[^>]*data-goal="${goalId}"`));
      expect(Boolean(m || m2)).toBe(true);
    }
  });

  it('each page exposes matched consultation + Map Your Stack CTAs and resolvable capability links', () => {
    for (const a of audiences) {
      const html = pageOf(a.id);
      expect(html).toContain('/book-a-call');
      expect(html).toContain('/map-your-stack');
      // at least one recommended capability link
      expect(html).toMatch(/\/what-we-do\/(build|attract|convert|retain|connect|scale)/);
    }
  });

  it('all /who-we-help links from home, capability and service pages resolve', () => {
    const sources = [
      dist('index.html'),
      ...capabilities.map((c) => dist(`what-we-do/${c.id}/index.html`)),
      dist('services/ecommerce-development/index.html'),
    ];
    const refs = new Set<string>();
    for (const html of sources) {
      for (const m of html.matchAll(/href="\/who-we-help\/([a-z0-9-]+)"/g)) refs.add(m[1]);
    }
    expect(refs.size).toBeGreaterThan(0);
    for (const id of refs) expect(pageOf(id)).not.toBe('');
  });
});
