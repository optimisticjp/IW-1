// Map Your Stack — pure evaluation (spec §5–6). DOM-free and fully testable:
// nothing here touches rendering. Given a set of selected tools it returns the
// per-rule status, the score/band, the "what's working" list, the top gaps,
// and the graph segments used to draw the live map.

import type { NodeKey } from '../data/growthGraph';
import { stackRules, type StackRule, type ToolGroup } from '../data/stackRules';

export type RuleStatus = 'in place' | 'gap' | 'not relevant';
export type Band = 'Fragmented' | 'Partly connected' | 'Well connected';

/** Result-panel limits (spec §6). */
export const MAX_WORKING = 2;
export const MAX_GAPS = 3;

export interface RuleResult {
  rule: StackRule;
  status: RuleStatus;
  /** One representative node per group: the selected option, or (when the
   *  group is unmet) the first option as a "missing" target. Drives the map. */
  chain: NodeKey[];
  /** The subset of `chain` that is not selected (missing targets). */
  missing: NodeKey[];
}

export interface StackResult {
  results: RuleResult[]; // every rule, in priority order, with its status
  relevantTotal: number; // in place + gap
  inPlaceTotal: number;
  gapTotal: number;
  percentage: number; // 0..100, in-place / relevant (0 when nothing relevant)
  band: Band;
  working: StackRule[]; // all in-place rules, priority order
  gaps: StackRule[]; // all gap rules, priority order
  topWorking: StackRule[]; // ≤ MAX_WORKING for the panel
  topGaps: StackRule[]; // ≤ MAX_GAPS for the panel
}

function toSet(selected: Iterable<NodeKey>): Set<NodeKey> {
  return selected instanceof Set ? selected : new Set(selected);
}

/** An OR-group is satisfied when any of its tools is selected. */
export function groupSatisfied(group: ToolGroup, selected: Set<NodeKey>): boolean {
  return group.some((t) => selected.has(t));
}

/** True when any of the rule's tools is selected (i.e. the rule is relevant). */
export function ruleTouched(rule: StackRule, selected: Set<NodeKey>): boolean {
  return rule.groups.some((g) => groupSatisfied(g, selected));
}

/** Status for one rule against a selection. */
export function ruleStatus(rule: StackRule, selected: Set<NodeKey>): RuleStatus {
  const allMet = rule.groups.every((g) => groupSatisfied(g, selected));
  if (allMet) return 'in place';
  if (ruleTouched(rule, selected)) return 'gap';
  return 'not relevant';
}

/** Representative chain of nodes for the map: the selected option per group,
 *  or the first listed option when the group is unmet (a missing target). */
function ruleChain(rule: StackRule, selected: Set<NodeKey>): { chain: NodeKey[]; missing: NodeKey[] } {
  const chain: NodeKey[] = [];
  const missing: NodeKey[] = [];
  for (const group of rule.groups) {
    const picked = group.find((t) => selected.has(t)) ?? group[0];
    chain.push(picked);
    if (!selected.has(picked)) missing.push(picked);
  }
  return { chain, missing };
}

/** Band for an in-place percentage (spec §6 thresholds).
 *  0–40 Fragmented · >40–70 Partly connected · >70–100 Well connected. */
export function bandFor(percentage: number): Band {
  if (percentage <= 40) return 'Fragmented';
  if (percentage <= 70) return 'Partly connected';
  return 'Well connected';
}

/** Evaluate a full selection into a scored, panel-ready result. */
export function evaluateStack(selected: Iterable<NodeKey>): StackResult {
  const set = toSet(selected);

  const results: RuleResult[] = stackRules.map((rule) => {
    const status = ruleStatus(rule, set);
    const { chain, missing } = ruleChain(rule, set);
    return { rule, status, chain, missing };
  });

  const working = results.filter((r) => r.status === 'in place').map((r) => r.rule);
  const gaps = results.filter((r) => r.status === 'gap').map((r) => r.rule);
  const inPlaceTotal = working.length;
  const gapTotal = gaps.length;
  const relevantTotal = inPlaceTotal + gapTotal;
  const percentage = relevantTotal === 0 ? 0 : (inPlaceTotal / relevantTotal) * 100;

  return {
    results,
    relevantTotal,
    inPlaceTotal,
    gapTotal,
    percentage,
    band: bandFor(percentage),
    working,
    gaps,
    topWorking: working.slice(0, MAX_WORKING),
    topGaps: gaps.slice(0, MAX_GAPS),
  };
}

/** Lower-case a rule title for mid-sentence use ("You've already got: …").
 *  Preserves a leading acronym (e.g. "AI that runs …" must not become "aI …"):
 *  if the second character is an upper-case letter, the first word is treated
 *  as an acronym and left untouched. */
export function titleForList(title: string): string {
  const second = title[1];
  const isAcronymStart = !!second && second === second.toUpperCase() && second !== second.toLowerCase();
  if (isAcronymStart) return title;
  return title.charAt(0).toLowerCase() + title.slice(1);
}
