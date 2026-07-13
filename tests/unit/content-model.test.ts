import { describe, it, expect } from 'vitest';
import { capabilities } from '../../src/data/capabilities';
import { services, servicePages, launchServices } from '../../src/data/services';
import { audiences } from '../../src/data/audiences';
import { CAPABILITY_IDS, AUDIENCE_IDS } from '../../src/data/ids';
import { integrityErrors, siblingServices, routeProblem } from '../../src/lib/links';
import { isCurrent, megaMenu, footerColumns } from '../../src/data/nav';

const LAUNCH = [
  'website-design-and-development',
  'ecommerce-development',
  'seo-and-search-visibility',
  'paid-advertising',
  'conversion-optimisation',
  'email-marketing',
  'analytics-and-tracking',
];

describe('capabilities', () => {
  it('has the six capabilities, unique, in the corrected id set', () => {
    expect(capabilities).toHaveLength(6);
    const ids = capabilities.map((c) => c.id).sort();
    expect(ids).toEqual([...CAPABILITY_IDS].sort());
    expect(new Set(ids).size).toBe(6);
  });
  it('each capability has distinct, non-empty problem and specialist sets', () => {
    for (const c of capabilities) {
      expect(c.problems.length).toBeGreaterThanOrEqual(3);
      expect(c.specialistList.length).toBeGreaterThan(0);
    }
    const problemBlobs = capabilities.map((c) => c.problems.join('|'));
    expect(new Set(problemBlobs).size).toBe(6);
  });
});

describe('service catalogue (C1)', () => {
  it('has exactly 25 dedicated pages', () => {
    expect(servicePages).toHaveLength(25);
  });
  it('has exactly the seven launch services', () => {
    expect(launchServices).toHaveLength(7);
    expect(launchServices.map((s) => s.id).sort()).toEqual([...LAUNCH].sort());
    for (const s of launchServices) expect(s.treatment).toBe('page');
  });
  it('has no duplicate slug', () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('maps every service to exactly one valid capability', () => {
    for (const s of services) expect(CAPABILITY_IDS).toContain(s.capabilityId);
  });
  it('enforces canonical placement', () => {
    const byId = (id: string) => services.find((s) => s.id === id)!;
    expect(byId('landing-pages').capabilityId).toBe('convert');
    expect(byId('crm-setup-and-integration').capabilityId).toBe('connect');
    // AI-search is a section under SEO, never a standalone GEO/AEO page
    const aiSearch = byId('ai-search-visibility');
    expect(aiSearch.treatment).toBe('section');
    expect(aiSearch.parentId).toBe('seo-and-search-visibility');
    // Testing canonical on Conversion Optimisation
    expect(byId('testing-and-experimentation').parentId).toBe('conversion-optimisation');
    // Amazon / marketplace advertising under Paid Advertising
    expect(byId('marketplace-advertising').parentId).toBe('paid-advertising');
  });
  it('every section maps to a parent that exists as a page', () => {
    const pageIds = new Set(servicePages.map((s) => s.id));
    for (const s of services.filter((x) => x.treatment === 'section')) {
      expect(s.parentId && pageIds.has(s.parentId)).toBe(true);
    }
  });
});

describe('audiences', () => {
  it('has the six audiences, unique, with valid service refs', () => {
    expect(audiences).toHaveLength(6);
    expect(audiences.map((a) => a.id).sort()).toEqual([...AUDIENCE_IDS].sort());
    const serviceIds = new Set(services.map((s) => s.id));
    for (const a of audiences) for (const sid of a.relevantServiceIds) expect(serviceIds.has(sid)).toBe(true);
  });
});

describe('internal-link integrity', () => {
  it('reports no dangling references across the content graph', () => {
    expect(integrityErrors()).toEqual([]);
  });
  it('resolves siblings within a capability and excludes self', () => {
    const sibs = siblingServices('ecommerce-development').map((s) => s.id);
    expect(sibs).not.toContain('ecommerce-development');
    expect(sibs).toContain('website-design-and-development');
  });
  it('routes a known problem to its capability and unknown to home', () => {
    expect(routeProblem('My tools do not talk to each other')).toBe('/what-we-do/connect');
    expect(routeProblem('nonsense')).toBe('/');
  });
});

describe('navigation model', () => {
  it('builds a mega-menu column per capability with top services', () => {
    expect(megaMenu).toHaveLength(6);
    for (const col of megaMenu) expect(col.services.length).toBeGreaterThan(0);
  });
  it('footer has the four columns including a Contact link', () => {
    const headings = footerColumns.map((c) => c.heading);
    expect(headings).toEqual(['What we do', 'Who we help', 'Learn', 'Company']);
    const company = footerColumns.find((c) => c.heading === 'Company')!;
    expect(company.items.some((i) => i.href === '/contact')).toBe(true);
  });
  it('marks the current item, including nested paths', () => {
    expect(isCurrent('/what-we-do', '/what-we-do')).toBe(true);
    expect(isCurrent('/what-we-do', '/what-we-do/build')).toBe(true);
    expect(isCurrent('/who-we-help', '/what-we-do')).toBe(false);
    expect(isCurrent('/', '/what-we-do')).toBe(false);
  });
});
