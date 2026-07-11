# Contract: Map Your Stack

**Feature**: `002-website-restructure` | Phase 1 | See [data-model.md](../data-model.md#entity-stack-tool-and-rule-srcdatastacktoolsts-srcdatastackrulests-logic-in-srclibstackevalts)

Implements FR-023/024/025 and User Story 2. Client-side only; stores nothing server-side; selections live in URL + session memory. Reuses the existing `stackTools.ts`, `stackRules.ts`, `stackEval.ts` and shared Growth Graph rendering (`StackGraph.astro`).

## Tools (nine)

`website, store, google-ads, social, tracking, crm, email, whatsapp, ai` — each `{ id, label, helperText? }`, each mapped to a graph node. Presented as semantic `fieldset` + `legend` with a real labelled checkbox per tool. Multi-select, keyboard-operable, visible focus, selected state not colour-only, ≥44px touch targets.

## Rule model (priority-ordered)

Each rule: `requiredGroups: ToolId[][]` (AND of OR-groups), `title`, `valueWhenInPlace`, `gapCost`, `colour`, `priority`, `serviceLink`. Rule order defines result priority and is preserved.

## Evaluation (pure — `stackEval.ts`)

For each rule against the selected set:
- **in place**: every required group satisfied (each group has ≥1 selected tool).
- **gap**: at least one of the rule's tools/groups selected, but not fully satisfied.
- **not relevant**: none of the rule's tools selected → excluded from score and results.

Score:
- `relevant = inPlace + gap`
- `percentage = inPlace / relevant` (zero-relevant handled safely; no divide-by-zero, no fake verdict from no input)

Bands:
- `0%–40%` → **Fragmented**
- `>40%–70%` → **Partly connected**
- `>70%–100%` → **Well connected**

Result caps: at most **3** gaps and at most **2** working items, both in priority order. No score-out-of-100; no invented statistics or revenue-leak figures.

## Graph & results behaviour

- Selected tools light as active nodes (existing ring/glow language); unselected dimmed.
- Connections whose required tools are all selected render as **solid** links; relevant-but-incomplete connections render as a **distinct pattern** (dashed/broken/ghosted) — distinguished by more than colour; gaps read as opportunities, never errors (no alarming red).
- Live updates without full page reload; no fake "scanning" animation or artificial wait.
- Reveal panel gated: appears only after ≥2 tools selected and the visitor presses "Show my connection map"; focus moves to the result heading; result announced via live region; no focus trap; gentle scroll only when motion allowed; final state shown immediately under reduced motion.
- Result order: band heading → count line ("X of Y key connections are in place") → what's working (≤2) → top gaps (≤3, bold title + one-sentence cost) → honesty line → CTA to `/book-a-call`.

## Responsive

- ≥720px: existing radial map, hub centred, nine nodes, gap links visibly distinct, no label collisions/clipping, no overflow.
- <720px: existing vertical/adapted mode; tap-to-add, tap-to-connect list; prioritise selected tools + relevant gap targets; retain labels and solid-vs-broken distinction; thumb-friendly; no horizontal scroll; no hover-only interaction.

## Handoff

- Optional query param carrying the selection; **allowlist-parsed** against the nine tool ids; unknown/malicious values ignored; no sensitive data; bounded length.
- Pre-fills the consultation context field with a plain-English summary; the booking page works with no parameter (FR-025, SC-009).

## Accessibility & storage

- Semantic fieldset/legend, real checkboxes, associated labels, visible focus, keyboard selection, disabled-until-2 state conveyed accessibly, meaning not colour-dependent, result live region, meaningful result heading, logical focus order, reduced-motion parity, no-JS static fallback.
- No server storage; no cross-session persistence; selection stated plainly as URL/session only.

## Tests (existing + extended, `tests/unit/stackeval.test.ts`)

Rule engine (all-required → in place; partial → gap; none → not relevant; OR groups; relevant + in-place totals; band thresholds at 0/40/just-above-40/70/just-above-70/100; priority order; top-3 gaps; top-2 working; zero-relevant safe), plus interaction/responsive/regression coverage in e2e (chip toggle, graph update, solid vs gap links, disabled-below-2, reveal after activation, keyboard, live region, CTA to `/book-a-call`, handoff, radial ≥720 / vertical <720, no overflow, homepage Growth Graph regression).
