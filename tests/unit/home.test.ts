import { describe, it, expect } from 'vitest';
import { home } from '../../src/data/home';
import { pillars, foundation } from '../../src/data/pillars';

describe('homepage content integrity', () => {
  it('names all five priority services by their real names', () => {
    const names = home.services.items.map((s) => s.name);
    expect(names).toEqual([
      'Meta Ads',
      'Google Ads',
      'Website Design and Development',
      'Shopify Store Development and Management',
      'Social Media Growth',
    ]);
  });

  it('models the four connected pillars plus a supporting foundation', () => {
    expect(pillars.map((p) => p.key)).toEqual([
      'demand',
      'storefront',
      'retention',
      'intelligence',
    ]);
    expect(foundation.name).toBe('Brand & Content');
  });

  it('flags every temporary proof asset as pending (never approved placeholder)', () => {
    for (const m of home.proof.metrics) expect(m.assetStatus).toBe('pending');
    expect(home.proof.testimonial.assetStatus).toBe('pending');
    expect(home.placeholder).toBe(true);
  });

  it('carries the nine homepage narrative stages', () => {
    for (const stage of [
      'hero',
      'disconnected',
      'connected',
      'services',
      'proof',
      'how',
      'secondary',
      'finalCta',
    ]) {
      expect(home).toHaveProperty(stage);
    }
  });
});
