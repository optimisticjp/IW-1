# Quickstart: Validating the Infinite Weblinks Restructure

**Feature**: `002-website-restructure` | Phase 1 | See [plan.md](./plan.md), [contracts/](./contracts/)

A runnable validation guide proving the restructure works end to end. It references the contracts and data model rather than duplicating them. It is a run/verify guide, not implementation code.

## Prerequisites

- Node per `.node-version` (20). Dependencies already declared in `package.json` (no new runtime deps).
- Optional env (never hardcoded): `PUBLIC_SITE_URL` (canonical/sitemap/OG), `PUBLIC_BOOKING_ENDPOINT` (consultation delivery). Without them the site behaves honestly: relative canonicals in dev, and the form reports "unconfigured" rather than a false success.
- Pre-installed Chromium at `/opt/pw-browsers` for Playwright-core (do not run `playwright install`).

## Setup & core commands

```bash
npm install          # deps only; no browser download
npm run check        # astro check (types + template diagnostics)
npm run test         # vitest unit + integration
npm run build        # static production build (must succeed with no stray placeholders)
npm run preview      # serve the build for cloud review
```

## Validation scenarios (map to spec Success Criteria)

Each scenario is verified by the tests noted, then spot-checked in `npm run preview`.

1. **Understand fast & convert (US1 / SC-001, SC-002, SC-010)**
   - Homepage first screen states who it is for, what changes, next action, with primary + secondary CTA and no dependence on motion.
   - Consultation CTA present in header and closing section of every commercial page.
   - Submit with only name/work-email/business/privacy → an accessible submitting state ("Sending…", `aria-busy`, repeat activation ignored) → honest confirmation ("Thank you. We have your enquiry.") with the three-outcomes message and no time promise.
   - Force a delivery failure → answers preserved, retry + email fallback, never a false success.
   - `/contact` offers a lighter name/email/message enquiry (no qualification, no handoff) on the same never-false-success path; the site stores no enquiry data server-side (delivered by email through the form processor), disclosed on Privacy.
   - Verified by: `tests/unit/booking.test.ts`, e2e critical-flow + confirmation.

2. **Explore first with Map Your Stack (US2 / SC-004, SC-009)**
   - Select ≥2 tools → in-place connections render solid, gaps render as a distinct pattern (not colour alone), grouped by opportunity, no invented figures.
   - Result operable by keyboard and at 360px; live-region announces changes; selection carries into the consultation form.
   - Verified by: `tests/unit/stackeval.test.ts` (rules, scoring, bands, caps), e2e interaction/responsive/handoff.

3. **Learn how it connects (US3 / SC-004)**
   - Homepage Growth Graph: selecting each of the five goals (incl. "Save team time") updates flow + caption and announces; keyboard operable; reduced-motion shows the final connected state as text.
   - How It Connects page readable without motion (five links, worked examples, self-check).
   - Verified by: `tests/unit/growthgraph.test.ts`, `tests/unit/graphlayout.test.ts`, e2e a11y + reduced-motion.

4. **Find the right service (US4 / SC-003)**
   - What We Do mega-menu shows six capabilities with descriptors + top service links.
   - Each capability page shares the section sequence but differs in colour/problems/proof/FAQ; each service page carries breadcrumb, parent up-link, deliverables, "what it connects with", related services and a matching CTA.
   - Canonical placement holds (Landing Pages/CRM/AI-search/testing/Amazon); zero thin/duplicate pages.
   - Verified by: `tests/unit` content-integrity (capabilities/services), e2e regression.

5. **Self-identify by audience (US5 / SC-013)**
   - Each of the six audience pages uses its own language, links its relevant services, offers an audience Growth Graph variant, and ends on a matched CTA label.
   - Verified by: `tests/unit` audience-integrity, e2e.

6. **Evaluate proof honestly (US6 / SC-007)**
   - Work index filters by capability/audience; no-match → honest empty state; case studies use the six-part structure; no invented revenue/conversion/growth figures anywhere; anonymized entries use placeholder connection-map art.
   - Verified by: content-collection schema tests + content-lint.

7. **Research through Insights (US7 / SC-011)**
   - Article states the question, honest single H1, key points, plain answer, pitfalls without fear language, sources + last-reviewed date, and links to one capability + one audience + two articles; category/tag views canonicalise to the base index.
   - Verified by: content-collection schema tests, `tests/unit/seo.test.ts`.

8. **Cross-cutting quality gate (US9 / SC-005, SC-006, SC-008, SC-012)**
   - **Accessibility**: axe pass (WCAG 2.2 AA), visible outline focus, keyboard operability of chrome + both islands + forms, announced state changes, contrast matrix (no white text on bright non-Build fills), and the alt-text policy (informational vs decorative vs graph text-equivalent vs honest anonymized-artwork alt — FR-048, contracts/seo-metadata.md).
   - **Security headers**: baseline headers + CSP present; the consultation/contact submit paths succeed under the CSP (`connect-src`/`form-action` include the endpoint origin); no third-party JS at initial load; no `*`/`unsafe-eval` (FR-049, contracts/security-headers.md).
   - **Responsive**: 360/390/768/1024/desktop, 320px floor, zero horizontal scroll; radial ≥720px / vertical <720px; 44px targets; primary CTA never buried.
   - **No-JS**: scripting disabled → all meaningful content + core message present; islands degrade to readable static states; footer omits the newsletter opt-in until a provider is configured.
   - **Performance**: Lighthouse mobile 90+ (best effort 95+) on audited page types; report exact scores; never fabricate. Built asset sizes checked against the per-page budgets (JS 30/50 KB, CSS 40 KB, fonts 200 KB, LCP image 150 KB, initial page 500 KB, zero third-party JS; CWV LCP<2.5s/INP<200ms/CLS<0.1 — FR-051, contracts/performance-budgets.md); any overage documented.
   - Verified by: e2e axe/keyboard/responsive/no-JS suites + Lighthouse and header/budget checks at the hardening gate.

## Screenshot QA (visual, `reducedMotion: 'reduce'`)

Capture 1440/1024/768/390/360 for: homepage first screen + Growth Graph, a capability page, a launch service page, an audience page, Map Your Stack (empty / partial / result), Work index (populated + empty filter), and the consultation confirmation. Confirm native feel, reused (not rebuilt) graph, distinct gap vs active links, no overflow/overlap/clipping, and no false-audit or invented-figure claims.

## Definition of Done gate (per phase and at convergence)

Requirements implemented; mobile correct; visual direction coherent; copy humanized (ban list clean); SEO basics present; accessibility basics present including the alt-text policy; security checks complete (never-false-success, submitting state prevents duplicates, allowlist handoff, no hardcoded secrets, security headers + CSP present, no enquiry data stored server-side); relevant tests passing; `npm run build` + `npm run check` green; no unnecessary dependencies; no stray placeholders; performance budgets met or overage documented; residual gaps recorded via `/speckit-converge`.
