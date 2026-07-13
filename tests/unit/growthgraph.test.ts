import { describe, it, expect } from 'vitest';
import { graphNodes, graphGoals } from '../../src/data/growthGraph';

describe('Growth Graph data (spec 002, FR-020/021)', () => {
  it('has the nine tool nodes by their plain names', () => {
    expect(graphNodes.map((n) => n.label)).toEqual([
      'Social', 'Google Ads', 'Website', 'Tracking', 'Store', 'Email', 'WhatsApp', 'CRM', 'AI',
    ]);
  });

  it('uses the corrected capability palette for node colours', () => {
    for (const n of graphNodes) expect(n.color.startsWith('var(--cap-')).toBe(true);
  });

  it('has the five goals with the approved labels, including "Save team time"', () => {
    expect(graphGoals.map((g) => g.label)).toEqual([
      'More sales',
      'Lower advertising waste',
      'More repeat customers',
      'Know what is working',
      'Save team time',
    ]);
  });

  it('every goal has a distinct capability accent and a non-empty caption', () => {
    const accents = graphGoals.map((g) => g.accent);
    expect(new Set(accents).size).toBe(5);
    for (const g of graphGoals) {
      expect(g.accent.startsWith('var(--cap-')).toBe(true);
      expect(g.caption.length).toBeGreaterThan(20);
    }
  });

  it('every loop node references a real node key', () => {
    const keys = new Set<string>(graphNodes.map((n) => n.key));
    for (const g of graphGoals) for (const k of g.loop) expect(keys.has(k)).toBe(true);
  });

  it('the "Save team time" loop routes through automation (ai)', () => {
    const t = graphGoals.find((g) => g.id === 'teamtime')!;
    expect(t.loop).toContain('ai');
  });

  it('captions match the approved Playbook Section 6 text', () => {
    const sales = graphGoals.find((g) => g.id === 'sales')!;
    expect(sales.caption).toContain('matches their interest');
    const working = graphGoals.find((g) => g.id === 'working')!;
    expect(working.caption).toContain('clearer view');
  });
});
