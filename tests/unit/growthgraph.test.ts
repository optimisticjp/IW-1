import { describe, it, expect } from 'vitest';
import { graphNodes, graphGoals } from '../../src/data/growthGraph';

describe('Growth Graph data (Brief §7)', () => {
  it('has the nine tool nodes by their plain names', () => {
    expect(graphNodes.map((n) => n.label)).toEqual([
      'Social', 'Google Ads', 'Website', 'Tracking', 'Store', 'Email', 'WhatsApp', 'CRM', 'AI',
    ]);
  });

  it('has four goals with exact labels', () => {
    expect(graphGoals.map((g) => g.label)).toEqual([
      'More sales', 'Lower ad costs', 'More repeat customers', 'Know what’s working',
    ]);
  });

  it('goal loops match the spec exactly', () => {
    const byId = Object.fromEntries(graphGoals.map((g) => [g.id, g.loop]));
    expect(byId.sales).toEqual(['social', 'website', 'tracking', 'email', 'store', 'googleAds']);
    expect(byId.adcosts).toEqual(['store', 'tracking', 'googleAds', 'social', 'website']);
    expect(byId.repeat).toEqual(['store', 'crm', 'email', 'whatsapp', 'website']);
    expect(byId.working).toEqual(['social', 'googleAds', 'website', 'tracking', 'crm']);
  });

  it('every loop node references a real node key', () => {
    const keys = new Set(graphNodes.map((n) => n.key));
    for (const g of graphGoals) for (const k of g.loop) expect(keys.has(k)).toBe(true);
  });

  it('captions are the exact brief text', () => {
    const sales = graphGoals.find((g) => g.id === 'sales')!;
    expect(sales.caption).toBe(
      'Someone sees your social ad, clicks to your site, and we track it properly. They get a follow-up email and buy. Every sale teaches the system where to find the next one.'
    );
    const working = graphGoals.find((g) => g.id === 'working')!;
    expect(working.caption).toContain('one clear picture');
  });
});
