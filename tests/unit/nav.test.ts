import { describe, it, expect } from 'vitest';
import { primaryNav, bookCta, footerGroups } from '../../src/data/nav';

describe('navigation (Brief §4)', () => {
  it('primary nav carries the brief items plus the Map your stack tool', () => {
    expect(primaryNav.map((i) => i.label)).toEqual([
      'What we do', 'How it connects', 'Map your stack', 'Who we help',
    ]);
    // the tool link sits under the "How it connects" path and resolves to its route
    const mys = primaryNav.find((i) => i.label === 'Map your stack')!;
    expect(mys.href).toBe('/map-your-stack');
  });

  it('primary nav resolves the Phase 2 routes (What we do / Who we help)', () => {
    const byLabel = Object.fromEntries(primaryNav.map((i) => [i.label, i.href]));
    expect(byLabel['What we do']).toBe('/what-we-do');
    expect(byLabel['Who we help']).toBe('/who-we-help');
    expect(byLabel['How it connects']).toBe('/how-it-connects'); // concept page
  });

  it('footer capability + audience links deep-link to the restructured routes', () => {
    // Restructure (FR-002/017): capabilities and audiences now have dedicated
    // routes, replacing the retired homepage/anchor placeholders.
    const whatWeDo = footerGroups.find((g) => g.heading === 'What we do')!;
    expect(whatWeDo.items.find((i) => i.label === 'Build')!.href).toBe('/what-we-do/build');
    expect(whatWeDo.items.find((i) => i.label === 'Connect')!.href).toBe('/what-we-do/connect');
    expect(whatWeDo.items.find((i) => i.label === 'Scale')!.href).toBe('/what-we-do/scale');
    const whoWeHelp = footerGroups.find((g) => g.heading === 'Who we help')!;
    expect(whoWeHelp.items.find((i) => i.label === 'Ecommerce brands')!.href).toBe('/who-we-help/ecommerce-brands');
    expect(whoWeHelp.items.find((i) => i.label === 'Established teams')!.href).toBe('/who-we-help/established-teams');
    // no footer link still points at the retired homepage-anchor placeholders
    for (const g of footerGroups) for (const i of g.items) {
      expect(i.href).not.toBe('/#capabilities');
      expect(i.href).not.toBe('/#three-doors');
      expect(i.href.includes('#')).toBe(false);
    }
  });

  it('the primary CTA is Book a free call and resolves to /book-a-call', () => {
    expect(bookCta.label).toBe('Book a free call');
    expect(bookCta.emphasis).toBe('cta');
    expect(bookCta.href).toBe('/book-a-call');
  });

  it('footer columns match the restructured model (FR-004)', () => {
    expect(footerGroups.map((g) => g.heading)).toEqual(['What we do', 'Who we help', 'Learn', 'Company']);
    const whatWeDo = footerGroups[0].items.map((i) => i.label);
    expect(whatWeDo).toEqual(['Build', 'Attract', 'Convert', 'Retain', 'Connect', 'Scale']);
    const company = footerGroups.find((g) => g.heading === 'Company')!;
    expect(company.items.some((i) => i.href === '/contact')).toBe(true);
  });
});
