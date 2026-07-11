import { describe, it, expect } from 'vitest';
import { stackRules } from '../../src/data/stackRules';
import {
  evaluateStack,
  ruleStatus,
  groupSatisfied,
  bandFor,
  titleForList,
  MAX_WORKING,
  MAX_GAPS,
} from '../../src/lib/stackEval';
import type { NodeKey } from '../../src/data/growthGraph';

const byId = Object.fromEntries(stackRules.map((r) => [r.id, r]));

describe('Map Your Stack — rules data (spec §5, verbatim)', () => {
  it('defines exactly ten rules in priority order', () => {
    expect(stackRules).toHaveLength(10);
    expect(stackRules.map((r) => r.id)).toEqual([
      'sales-tracking', 'ads-learn', 'win-back', 'email-behaviour', 'one-customer-record',
      'best-channels', 'reminders', 'repeat-loop', 'ai-real-data', 'one-dashboard',
    ]);
  });

  it('carries the exact titles', () => {
    expect(stackRules.map((r) => r.title)).toEqual([
      'Reliable sales tracking',
      'Ads that learn from real sales',
      "Win back visitors who didn't buy",
      'Email tied to what people browse and buy',
      'Every customer in one place',
      'Know which channel brings your best customers',
      'Reminders that bring people back',
      'The repeat-customer loop',
      'AI that runs on real customer data',
      'One dashboard you can trust',
    ]);
  });

  it('carries the exact gap costs and capability colours', () => {
    expect(byId['sales-tracking'].gapCost).toBe(
      "your sales get credited to the wrong channel, so you can't trust any of your numbers"
    );
    expect(byId['sales-tracking'].capability).toBe('Connect');
    expect(byId['sales-tracking'].colorVar).toBe('var(--c-violet)');
    expect(byId['ads-learn'].capability).toBe('Attract');
    expect(byId['ads-learn'].colorVar).toBe('var(--c-coral)');
    expect(byId['email-behaviour'].capability).toBe('Retain');
    expect(byId['email-behaviour'].colorVar).toBe('var(--c-green)');
    expect(byId['ai-real-data'].capability).toBe('Scale');
    expect(byId['ai-real-data'].colorVar).toBe('var(--c-amber)');
  });

  it('every rule references only real node keys', () => {
    const keys = new Set<NodeKey>(['social', 'googleAds', 'website', 'tracking', 'store', 'email', 'whatsapp', 'crm', 'ai']);
    for (const r of stackRules) for (const g of r.groups) for (const t of g) expect(keys.has(t)).toBe(true);
  });
});

describe('ruleStatus — in place / gap / not relevant', () => {
  const set = (...t: NodeKey[]) => new Set<NodeKey>(t);

  it('all required tools selected produces "in place"', () => {
    expect(ruleStatus(byId['sales-tracking'], set('store', 'tracking'))).toBe('in place');
    expect(ruleStatus(byId['ads-learn'], set('googleAds', 'tracking', 'store'))).toBe('in place');
    expect(ruleStatus(byId['repeat-loop'], set('store', 'email', 'crm'))).toBe('in place');
  });

  it('partial selection produces "gap"', () => {
    expect(ruleStatus(byId['sales-tracking'], set('store'))).toBe('gap');
    expect(ruleStatus(byId['repeat-loop'], set('store', 'email'))).toBe('gap');
    expect(ruleStatus(byId['ads-learn'], set('googleAds'))).toBe('gap');
  });

  it('no related tools produces "not relevant"', () => {
    expect(ruleStatus(byId['sales-tracking'], set('email'))).toBe('not relevant');
    expect(ruleStatus(byId['reminders'], set('social', 'googleAds'))).toBe('not relevant');
    expect(ruleStatus(byId['sales-tracking'], set())).toBe('not relevant');
  });

  it('OR conditions are satisfied by either option', () => {
    // Rule 1 needs (Store OR Website) + Tracking
    expect(ruleStatus(byId['sales-tracking'], set('website', 'tracking'))).toBe('in place');
    // Rule 3 needs (Google Ads OR Social) + Tracking
    expect(ruleStatus(byId['win-back'], set('social', 'tracking'))).toBe('in place');
    expect(ruleStatus(byId['win-back'], set('googleAds', 'tracking'))).toBe('in place');
    // Rule 9 needs AI + (Tracking OR CRM)
    expect(ruleStatus(byId['ai-real-data'], set('ai', 'crm'))).toBe('in place');
    expect(ruleStatus(byId['ai-real-data'], set('ai', 'tracking'))).toBe('in place');
    expect(ruleStatus(byId['ai-real-data'], set('ai'))).toBe('gap');
  });

  it('an OR-group is satisfied only when at least one option is present', () => {
    expect(groupSatisfied(['store', 'website'], set('website'))).toBe(true);
    expect(groupSatisfied(['store', 'website'], set('email'))).toBe(false);
  });
});

describe('bandFor — thresholds (spec §6)', () => {
  it('0% and 40% are Fragmented', () => {
    expect(bandFor(0)).toBe('Fragmented');
    expect(bandFor(40)).toBe('Fragmented');
  });
  it('just above 40% through 70% is Partly connected', () => {
    expect(bandFor(40.0001)).toBe('Partly connected');
    expect(bandFor(55)).toBe('Partly connected');
    expect(bandFor(70)).toBe('Partly connected');
  });
  it('just above 70% through 100% is Well connected', () => {
    expect(bandFor(70.0001)).toBe('Well connected');
    expect(bandFor(100)).toBe('Well connected');
  });
});

describe('evaluateStack — totals, band, limits, priority', () => {
  it('is safe with zero relevant connections', () => {
    const r = evaluateStack([]);
    expect(r.relevantTotal).toBe(0);
    expect(r.inPlaceTotal).toBe(0);
    expect(r.percentage).toBe(0);
    expect(Number.isNaN(r.percentage)).toBe(false);
    expect(r.band).toBe('Fragmented');
    expect(r.topWorking).toEqual([]);
    expect(r.topGaps).toEqual([]);
  });

  it('counts a Fragmented setup at exactly 40% (4 in place, 6 gaps)', () => {
    const r = evaluateStack(['store', 'tracking', 'googleAds']);
    expect(r.inPlaceTotal).toBe(4);
    expect(r.gapTotal).toBe(6);
    expect(r.relevantTotal).toBe(10);
    expect(r.percentage).toBe(40);
    expect(r.band).toBe('Fragmented');
  });

  it('counts a Partly connected setup (5 in place, 5 gaps → 50%)', () => {
    const r = evaluateStack(['store', 'website', 'tracking', 'email', 'googleAds', 'social']);
    expect(r.inPlaceTotal).toBe(5);
    expect(r.gapTotal).toBe(5);
    expect(r.percentage).toBe(50);
    expect(r.band).toBe('Partly connected');
  });

  it('counts a Well connected setup (8 in place, 2 gaps → 80%)', () => {
    const r = evaluateStack(['store', 'website', 'tracking', 'email', 'crm', 'googleAds', 'social']);
    expect(r.inPlaceTotal).toBe(8);
    expect(r.gapTotal).toBe(2);
    expect(r.percentage).toBe(80);
    expect(r.band).toBe('Well connected');
  });

  it('reaches 100% Well connected when everything is selected', () => {
    const all: NodeKey[] = ['social', 'googleAds', 'website', 'tracking', 'store', 'email', 'whatsapp', 'crm', 'ai'];
    const r = evaluateStack(all);
    expect(r.inPlaceTotal).toBe(10);
    expect(r.relevantTotal).toBe(10);
    expect(r.percentage).toBe(100);
    expect(r.band).toBe('Well connected');
  });

  it('limits what is working to two and top gaps to three, in priority order', () => {
    const r = evaluateStack(['store', 'tracking', 'googleAds']);
    expect(r.topWorking.length).toBeLessThanOrEqual(MAX_WORKING);
    expect(r.topGaps.length).toBeLessThanOrEqual(MAX_GAPS);
    // priority order follows the rule module order
    expect(r.topWorking.map((w) => w.id)).toEqual(['sales-tracking', 'ads-learn']);
    expect(r.topGaps.map((g) => g.id)).toEqual(['email-behaviour', 'one-customer-record', 'best-channels']);
  });

  it('keeps every rule in the results, in priority order', () => {
    const r = evaluateStack(['store', 'email']);
    expect(r.results.map((x) => x.rule.id)).toEqual(stackRules.map((x) => x.id));
  });

  it('lower-cases a normal title mid-sentence but preserves a leading acronym', () => {
    expect(titleForList('Reliable sales tracking')).toBe('reliable sales tracking');
    expect(titleForList('Email tied to what people browse and buy')).toBe('email tied to what people browse and buy');
    // "AI that runs on real customer data" must not become "aI that runs …"
    expect(titleForList('AI that runs on real customer data')).toBe('AI that runs on real customer data');
  });

  it('marks the missing targets on a gap rule chain', () => {
    const r = evaluateStack(['store']);
    const repeat = r.results.find((x) => x.rule.id === 'repeat-loop')!;
    expect(repeat.status).toBe('gap');
    expect(repeat.chain).toEqual(['store', 'email', 'crm']);
    expect(repeat.missing).toEqual(['email', 'crm']);
  });
});
