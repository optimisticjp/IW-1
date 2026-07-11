# Quickstart: Run & Validate

**Feature**: 001-marketing-website | **Date**: 2026-07-10

A run/validation guide for the Infinite Weblinks site. Implementation details live in `tasks.md` (created by `/speckit-tasks`) and the code; this file proves the build works end-to-end and maps acceptance scenarios to checks. Commands reflect the planned Astro toolchain and become real once Phase 1 setup lands.

## Prerequisites

- Node LTS available (build-time only). No database, no backend service, no accounts.
- Runs in Claude Code Web preview — no local machine, Codespaces, or deployment required (Principle XIII).

## Setup & run

```bash
npm install
npm run dev        # astro dev — live preview of the site
npm run build      # static build to dist/
npm run preview    # serve the production build
npm run test       # vitest — validation + schema + seo unit tests
```

## Acceptance validation (maps to spec user stories)

### US1 — Ecommerce evaluation → proposal (P1)
1. Open the homepage. Confirm the first screen conveys ecommerce relevance + the connection message without scrolling (SC-001).
2. Scroll once top-to-bottom; confirm the nine narrative stages appear in order and the connection problem/value proposition is restatable from a single scan (SC-002).
3. Confirm all five priority services are locatable within ~30s without browser find (SC-003).
4. Confirm at least one contextual proof (or a visible `PlaceholderBadge`) sits beside its claim (SC-005).
5. Confirm a Request a Proposal path is reachable from header and a closing section (SC-006).

### US2 — Submit a proposal (P1)
1. Submit with all required fields valid → accessible success confirmation with next steps + response window (FR-023).
2. Submit with a missing required field / bad email → blocked, field-level errors, focus to first invalid, announced via `FormStatus` (FR-022/SC-010).
3. Force the mock provider to fail → recoverable error, entered data preserved, retry works (FR-024).
4. Submit identical payload twice quickly → duplicate blocked/de-duplicated (FR-025).
5. Fill honeypot / submit implausibly fast → treated as spam, not a qualified request (FR-026).
6. Confirm privacy notice + required acknowledgement present near the form (FR-027).
7. Confirm no account/login is required (FR-020).

### US3 — Priority service-page entry (P2)
Open each of `meta-ads`, `google-ads`, `website-design-development`, `shopify-development-management`, `social-media-growth`, plus `retention`, `intelligence` directly. Confirm real name + cause/effect, ≥1 pillar connection, adjacent proof-or-placeholder, and a contextual CTA (FR-011/FR-012).

### US4 — Case-study entry (P2)
Open a case study. Confirm context/problem/systems/what-changed/how-connected/relevant-services/next-action are present; unverified metrics show as pending, never fabricated (FR-014/FR-016/SC-016); links to relevant services exist (FR-017).

### US5 — Secondary audiences (P3)
Confirm the homepage/primary nav stay ecommerce-first while For Creators and Partners/White-label are reachable via quiet paths, each with an appropriate inquiry (FR-029/FR-030/SC-017).

### US6 — Inclusive access (P2)
1. Render every page at 360/390/768/1024/large-desktop → no horizontal overflow or clipped content (SC-009).
2. Complete the proposal form keyboard-only with visible focus throughout (SC-010).
3. Enable `prefers-reduced-motion: reduce` → all three signature experiences remain fully understandable statically; no motion-only information (SC-011).
4. Confirm no hover-only functionality; mobile nav opens/closes with `Esc` and returns focus.

## Phase-5 verification checklist (Definition of Done)

- [ ] Responsive: 5 widths, zero horizontal overflow (SC-009)
- [ ] Keyboard-only critical path complete, focus visible (SC-010)
- [ ] Reduced-motion information parity (SC-011)
- [ ] Accessibility: WCAG 2.1 AA on key templates, axe + manual, zero critical (SC-012)
- [ ] Performance: mobile Lighthouse ≥90 on home/service/proposal (SC-013)
- [ ] SEO: per-page title/description/canonical/OG/one-h1/heading-order; sitemap + robots present (SC-014)
- [ ] Security/privacy: no secrets, safe errors, spam guard, privacy notice; provider server-side validation gate noted (SC-015)
- [ ] Content integrity: zero fabricated proof; every pending asset flagged (SC-016)
- [ ] Ecommerce-first hierarchy preserved (SC-017)
- [ ] Recognisably Infinite Weblinks, not a Clay copy (SC-018)
- [ ] Capability-evidence mapping complete (SC-019)
- [ ] `npm run build` + `npm run test` pass; lint clean

## Placeholder replacement workflow

```bash
# List everything still temporary:
grep -rn "placeholder\|assetStatus: pending\|TODO(content)" src/content src/data public
```
Replace values in `src/content/*` and `src/data/*` (and swap flagged assets in `public/`). Flip `assetStatus: pending → approved` (and metric `verified: true`) to promote proof from placeholder to verified. No layout edits required.
