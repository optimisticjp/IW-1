import { describe, it, expect } from 'vitest';
import { primaryNav, bookCta, footerGroups } from '../../src/data/nav';

describe('navigation (Brief §4)', () => {
  it('primary nav is exactly the three brief items', () => {
    expect(primaryNav.map((i) => i.label)).toEqual(['What we do', 'How it connects', 'Who we help']);
  });

  it('the primary CTA is Book a free call', () => {
    expect(bookCta.label).toBe('Book a free call');
    expect(bookCta.emphasis).toBe('cta');
  });

  it('footer groups match the brief columns', () => {
    expect(footerGroups.map((g) => g.heading)).toEqual(['What we do', 'Who we help', 'Company']);
    const whatWeDo = footerGroups[0].items.map((i) => i.label);
    expect(whatWeDo).toEqual(['Build', 'Attract', 'Convert', 'Retain', 'Connect', 'Scale']);
    const whoWeHelp = footerGroups[1].items.map((i) => i.label);
    expect(whoWeHelp).toEqual(['Ecommerce brands', 'Creators & experts', 'Startups', 'Established teams']);
  });
});
