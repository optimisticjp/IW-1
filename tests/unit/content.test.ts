import { describe, it, expect } from 'vitest';
import { home } from '../../src/data/home';

describe('homepage copy (spec 002, Playbook Sections 1-14)', () => {
  it('hero carries the first brand promise and approved CTAs', () => {
    expect(home.hero.eyebrow).toBe('Connected growth agency');
    expect(home.hero.h1a).toBe('You focus on your work.');
    expect(home.hero.h1b).toBe('We handle the digital side.');
    expect(home.hero.primary.label).toBe('Book a free call');
    expect(home.hero.secondary.label).toBe('Explore what is possible');
  });

  it('uses the second brand promise verbatim (FR-038)', () => {
    expect(home.hero.sub).toContain('We build it, run it and connect every part');
  });

  it('every "Book a free call" link resolves to /book-a-call', () => {
    expect(home.hero.primary.href).toBe('/book-a-call');
    expect(home.finalCta.primary.href).toBe('/book-a-call');
  });

  it('carries the full 14-section sequence', () => {
    for (const key of [
      'hero', 'immediateValue', 'problem', 'startingPoints', 'anatomy', 'graph',
      'capabilities', 'startWithProblem', 'modernSearch', 'howWeWork', 'workProof',
      'why', 'faq', 'finalCta',
    ]) {
      expect(home).toHaveProperty(key);
    }
  });

  it('three starting points are Launch / Connect / Scale mapped to capability colours', () => {
    expect(home.startingPoints.items.map((d) => d.name)).toEqual(['Launch', 'Connect', 'Scale']);
    expect(home.startingPoints.items.map((d) => d.cap)).toEqual(['build', 'connect', 'scale']);
  });

  it('six capabilities use the corrected capability ids and link to their pages', () => {
    expect(home.capabilities.items.map((c) => c.cap)).toEqual([
      'build', 'attract', 'convert', 'retain', 'connect', 'scale',
    ]);
    for (const c of home.capabilities.items) expect(c.href).toBe(`/what-we-do/${c.cap}`);
  });

  it('start-with-the-problem offers seven plain problems that route to capabilities/audiences', () => {
    expect(home.startWithProblem.items).toHaveLength(7);
    for (const p of home.startWithProblem.items) expect(p.link.href.startsWith('/')).toBe(true);
  });

  it('proof is an honest interim state with no invented results', () => {
    const blob = JSON.stringify(home).toLowerCase();
    expect(home.workProof.interim).toContain('being prepared');
    expect(blob).not.toContain('request a proposal');
    // no invented commercial figures on the homepage
    expect(blob).not.toMatch(/\d+% (increase|more sales|growth|conversion)/);
  });

  it('avoids em dashes and flagged claims sitewide in homepage copy', () => {
    const blob = JSON.stringify(home);
    expect(blob).not.toContain('—');
    expect(blob.toLowerCase()).not.toContain('guaranteed');
    expect(blob.toLowerCase()).not.toContain('world-class');
  });

  it('footer slogan is exact', () => {
    expect(home.footer.slogan).toBe('Grow your business digitally.');
  });
});
