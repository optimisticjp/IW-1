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

  it('the primary CTA is Book a free call and resolves to /book-a-call', () => {
    expect(bookCta.label).toBe('Book a free call');
    expect(bookCta.emphasis).toBe('cta');
    expect(bookCta.href).toBe('/book-a-call');
  });

  it('footer groups match the brief columns', () => {
    expect(footerGroups.map((g) => g.heading)).toEqual(['What we do', 'Who we help', 'Company']);
    const whatWeDo = footerGroups[0].items.map((i) => i.label);
    expect(whatWeDo).toEqual(['Build', 'Attract', 'Convert', 'Retain', 'Connect', 'Scale']);
    const whoWeHelp = footerGroups[1].items.map((i) => i.label);
    expect(whoWeHelp).toEqual(['Ecommerce brands', 'Creators & experts', 'Startups', 'Established teams']);
  });
});
