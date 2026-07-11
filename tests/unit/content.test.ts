import { describe, it, expect } from 'vitest';
import { home } from '../../src/data/home';

describe('homepage copy (Brief §5, verbatim)', () => {
  it('hero copy is exact', () => {
    expect(home.hero.eyebrow).toBe('Connected growth agency');
    expect(home.hero.h1a).toBe('You focus on your work.');
    expect(home.hero.h1b).toBe('We handle the digital side.');
    expect(home.hero.trust).toBe('Built for solo experts and in-house teams alike.');
  });

  it('CTA labels are exact', () => {
    expect(home.hero.primary.label).toBe('Book a free call');
    expect(home.hero.secondary.label).toBe('See how it connects');
    expect(home.finalCta.primary.label).toBe('Book a free call');
    expect(home.finalCta.secondary.label).toBe('See what we do');
    expect(home.finalCta.h2).toBe('Let’s map your Growth Graph.');
  });

  it('does not use the retired "Request a Proposal" wording anywhere', () => {
    const blob = JSON.stringify(home).toLowerCase();
    expect(blob).not.toContain('request a proposal');
    expect(blob).not.toContain('disconnected growth leaks');
  });

  it('the idea section is exact', () => {
    expect(home.idea.h2).toBe('You don’t need more tools. You need them working as one.');
  });

  it('has three doors: Launch / Connect / Scale with the right accents', () => {
    expect(home.doors.items.map((d) => d.name)).toEqual(['Launch', 'Connect', 'Scale']);
    expect(home.doors.items.map((d) => d.accent)).toEqual(['indigo', 'violet', 'magenta']);
    expect(home.doors.h2).toBe('Three ways in. One connected system.');
  });

  it('has six capabilities with the brief accents', () => {
    expect(home.capabilities.items.map((c) => c.name)).toEqual([
      'Build', 'Attract', 'Convert', 'Retain', 'Connect', 'Scale',
    ]);
    expect(home.capabilities.items.map((c) => c.accent)).toEqual([
      'indigo', 'coral', 'magenta', 'green', 'violet', 'amber',
    ]);
    expect(home.capabilities.h2).toBe('One system. Six jobs.');
  });

  it('proof carries no invented results and is flagged pending', () => {
    expect(home.proof.h2).toBe('Real work, real results.');
    for (const w of home.proof.items) expect(w.assetStatus).toBe('pending');
  });

  it('footer slogan is exact', () => {
    expect(home.footer.slogan).toBe('Grow your business digitally.');
  });
});
