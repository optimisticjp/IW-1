# Implementation Plan: Infinite Weblinks Multipage Website Restructure

**Branch**: `002-website-restructure` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-website-restructure/spec.md`

## Summary

Restructure the Infinite Weblinks site from a small flat set of pages into a scalable, multipage connected-growth agency site, on the current Astro static baseline. The site explains the agency within seconds, gives value before asking, represents every real service under exactly one of six capabilities, and routes every commercial page to one primary action: a free consultation the agency reviews and follows up on personally. Two signature interactive systems carry the idea: the Growth Graph (explanatory backbone, expressed at several depths) and Map Your Stack (low-friction interactive front door). Both are reusable, keyboard-operable, screen-reader-legible and reduced-motion-safe.

Technical approach: keep the current static-first Astro 5 + TypeScript baseline. Add a data-driven page-system layer (typed TS data modules for structured system content: capabilities, services, audiences, FAQs, tools/rules, internal-link maps; Astro content collections with Zod schemas for editorial Work and Insights). Thin route files compose shared page systems from data so ~50 page types are produced without repetitive template output. Hand-authored token CSS implements the DESIGN.md system; two vanilla-TS islands (Growth Graph, Map Your Stack) carry motion where JS gives the strongest Astro-native result; everything degrades to a readable static state without JS. Launch the seven highest-intent service pages first; phase the rest behind anchored capability sections.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Astro 5.2 (static output). No runtime framework (no React/Vue/Svelte).

**Primary Dependencies**: `astro`, `@astrojs/sitemap` (existing). Dev: `@astrojs/check`, `vitest`, `playwright-core`, `typescript` (existing). No new runtime dependencies; no CSS framework, no animation library, no CMS, no database. Fonts: licensed Geist Sans + Geist Mono self-hosted WOFF2 (owner-supplied; current system-font fallback stack stays until they arrive).

**Storage**: None server-side. Structured content in typed TS modules under `src/data`; editorial content in Astro content collections under `src/content` (Markdown/MDX + Zod-validated frontmatter). Map Your Stack selections live in URL/session only. No database, no persistent user storage.

**Testing**: Vitest for unit/integration (pure logic: rule evaluation, scoring, graph layout/geometry, SEO/schema builders, booking validation/adapter, content-collection schema shape, nav/link-map integrity). Playwright-core (pre-installed Chromium at `/opt/pw-browsers`) for browser, accessibility, responsive and regression checks driven from `tests/e2e`.

**Target Platform**: Static site hosted on Cloudflare Pages; served as pre-rendered HTML/CSS with two progressively-enhanced islands. Modern evergreen browsers; full content and core message available with scripting unavailable.

**Project Type**: Static content-led website (single project, `src/` + `tests/`). Not a web-service or mobile app.

**Performance Goals**: Lighthouse mobile performance 90+ (best effort 95+) on audited page types (FR/SC-006); healthy Core Web Vitals (LCP, INP, CLS). Minimal client JS: only the two islands ship script; CSS-first motion; self-hosted subset fonts with `font-display: swap`; no layout shift; no autoplay video.

**Constraints**: Mobile-first, verified at 360/390/768/1024/desktop with a 320px hard floor and zero horizontal scroll (FR-046). WCAG 2.2 AA across audited pages (SC-005). Motion limited to two families (Connect, Reveal), `prefers-reduced-motion` collapses to final states, motion pauses off-screen and on hidden tab (FR-045). Never show a false form success; preserve answers and offer an email fallback on failure (FR-027/028). No invented figures or flagged claims; no em dashes; no buzzwords (FR-036/037). Crawler allowlist: allow search + AI-citation crawlers, block AI-training crawlers (FR-041).

**Scale/Scope**: ~50 page types across nine groups (core, six capabilities, up to 25 service pages phased with seven at launch, six audiences, Work index + case studies, Insights index + articles, conversion/utility). One shared Growth Graph model with per-context variants; one Map Your Stack engine. Owner-supplied assets (fonts, domain, endpoint, people/photos, real work, testimonials, credentials, legal wording) are dependencies with honest fallbacks, not structural blockers.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Plan compliance | Status |
|---|---|---|---|
| I | Spec Before Code | Governing spec clarified (7 decisions resolved) and this plan precede implementation; large decisions live in spec/plan/research artifacts. | PASS |
| II | Mobile-First Non-Negotiable | Mobile-first token system; verified at 360/390/768/1024/desktop, 320px floor, no horizontal scroll; both islands have mobile-native modes; 44px touch targets. | PASS |
| III | Speed Non-Negotiable | No new runtime deps, no framework, no animation library; CSS-first motion; two small vanilla-TS islands; subset self-hosted fonts; lazy non-critical assets; Lighthouse 90+ target. | PASS |
| IV | Deliberate Design | Single locked direction from DESIGN.md (70% Clay / 30% Stripe): one sans + one mono, six capability colours with accessible variants, one dark high-impact environment, two motion families. No style soup. | PASS |
| V | Selective Skills | Skills selected per stage (design/frontend/SEO in plan; security/testing/a11y in implement); no blind activation. | PASS |
| VI | Human-Sounding Content | Playbook-sourced copy; ban list enforced (no em dashes, no superlatives, no buzzwords, no fear framing); per-page distinctive wording; verified by content lint tests. | PASS |
| VII | SEO In The Build | Per-page title/description/canonical/H1, breadcrumb + visible-only structured data, sitemap, env-aware robots with crawler allowlist, internal-link maps. | PASS |
| VIII | Accessibility In The Build | WCAG 2.2 AA (exceeds the 2.1 AA baseline); semantic landmarks, outline focus, live regions, accessible forms, reduced-motion parity, keyboard operability; automated axe + keyboard checks. | PASS |
| IX | Security In The Build | Provider-neutral form path, honeypot, allowlist-parsed handoff params, no hardcoded secrets (env-injected `PUBLIC_*`), never-false-success, visible-only schema, minimal third-party surface. | PASS |
| X | Test Important Behavior | TDD-when-practical on pure logic (rules, scoring, geometry, SEO, booking, schema); critical-flow + regression browser tests; presentation not over-tested. | PASS |
| XI | Spec Kit Workflow | Following constitution → specify → clarify → plan (here) → checklist → tasks → analyze → implement → converge; no implement before plan clarity. | PASS |
| XII | Efficient Context | Concise phased artifacts (research/data-model/contracts/quickstart); decisions captured once; phased delivery with handoff notes. | PASS |
| XIII | Preview Without Deployment | Astro dev + build/preview and Playwright screenshots give cloud review without deploying; no local-only workflow required. | PASS |
| XIV | Definition of Done | DoD encoded in the testing strategy and phase review gates (requirements, mobile, design coherence, humanized copy, SEO, a11y, security, tests, build/lint, no stray placeholders, documented performance, convergence). | PASS |

**Result**: PASS on all 14 principles. No violations; Complexity Tracking is empty. WCAG target is raised from the 2.1 AA baseline to 2.2 AA per the spec, which strengthens (does not weaken) Principle VIII.

## Project Structure

### Documentation (this feature)

```text
specs/002-website-restructure/
├── plan.md              # This file (/speckit-plan output)
├── spec.md              # Governing specification (clarified)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── routes.md            # Route table, canonical rules, phasing
│   ├── content-schemas.md   # TS data-module + content-collection contracts
│   ├── consultation-form.md # Field contract, validation, submission, states
│   ├── map-your-stack.md     # Tool set, rules, scoring, handoff allowlist
│   └── seo-metadata.md      # Title/description/canonical/schema/sitemap/robots
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit-tasks - NOT created here)
```

### Source Code (repository root)

```text
src/
├── data/                     # Typed structured content (page systems read these)
│   ├── nav.ts                    # (exists) primary/mega/footer/breadcrumb model
│   ├── home.ts                   # (exists) homepage section content
│   ├── whatWeDo.ts               # (exists) capability overview content
│   ├── whoWeHelp.ts              # (exists) audience overview content
│   ├── howItConnects.ts          # (exists) five-links + worked-examples content
│   ├── growthGraph.ts            # (exists) nodes/links/goals/captions model
│   ├── stackTools.ts             # (exists) Map Your Stack tool set
│   ├── stackRules.ts             # (exists) connection rules (priority-ordered)
│   ├── capabilities.ts           # (new) six capability records
│   ├── services.ts               # (new) service records + capability mapping + treatment
│   ├── audiences.ts              # (new) six audience records
│   ├── faqs.ts                   # (new) shared + per-page FAQ sets
│   └── links.ts                  # (new) internal-link/related-content maps
├── content/                  # Editorial collections (Zod-validated)
│   ├── config.ts                 # (new) collection schemas: work, insights
│   ├── work/                     # (new) case-study entries
│   └── insights/                 # (new) article entries
├── components/
│   ├── layout/                   # (exists) Container, Section, SiteHeader, SiteFooter, SkipLink
│   ├── ui/                       # (exists) Button, Eyebrow, Tag, TextLink (+ new Breadcrumb, Accordion, Tabs)
│   ├── forms/                    # (exists) BookingForm, Field, FormStatus
│   ├── brand/                    # (exists) InfinityMark, Constellation, GrowthGraph, StackGraph, WorkThumb
│   └── page/                     # (new) reusable page-section systems (hero, proof, FAQ, connection, related, CTA blocks)
├── layouts/
│   └── BaseLayout.astro          # (exists) js-ready reveal controller, head/meta seams
├── lib/                          # Pure logic (unit-tested)
│   ├── booking.ts                # (exists) validate/submit, honeypot, never-false-success
│   ├── seo.ts                    # (exists) buildSeo, defaults
│   ├── schema.ts                 # (exists) structured-data builders
│   ├── graphGeometry.ts          # (exists) radial/vertical geometry
│   ├── graphLayout.ts            # (exists) layout selection
│   ├── stackEval.ts              # (exists) rule evaluation + scoring
│   └── links.ts                  # (new) related-content resolution helpers
└── pages/                        # Thin routes composing page systems from data
    ├── index.astro, book-a-call.astro, how-it-connects.astro,
    │   map-your-stack.astro, what-we-do.astro, who-we-help.astro,
    │   404.astro, robots.txt.ts   # (exist)
    ├── what-we-do/[capability].astro     # (new) capability pages
    ├── services/[service].astro          # (new) dedicated service pages (phased)
    ├── who-we-help/[audience].astro      # (new) audience pages
    ├── work/index.astro, work/[slug].astro   # (new) Work index + case studies
    ├── insights/index.astro, insights/[slug].astro  # (new) Insights index + articles
    └── (utility: about, contact, faq, privacy, cookies, terms)  # (new)

tests/
├── unit/                     # (exists) vitest: booking, content, final, graphlayout,
│                             #   growthgraph, nav, phase2, rendered, seo, stackeval (+ new: capabilities, services, audiences, links, schema)
└── e2e/                      # (new) playwright: a11y (axe), keyboard, responsive, no-JS, regression, visual QA
```

**Structure Decision**: Single-project static site. The scalable structure is thin routes over data-driven page systems: structured, repeatable content (capabilities, services, audiences, FAQs, tools/rules, link maps) lives in typed `src/data` modules; editorial content (Work, Insights) lives in Astro content collections with Zod schemas. Route files stay thin and compose shared `src/components/page` systems from that data, so adding a capability, service, audience, case study or article is a data/content edit, not a new bespoke template. Pure logic stays in `src/lib` for direct unit testing, decoupled from rendering. This directly satisfies "reusable page systems without repetitive template output" and the phased service-page rollout.

## Architecture selected

- **Static-first Astro 5** on the current repository baseline (`output: 'static'`), TypeScript strict, zero runtime framework. Pages pre-render to HTML; interactivity is limited to two progressively-enhanced vanilla-TS islands.
- **Data-driven page systems**: a thin-route + shared-section-component pattern reading from typed data modules and content collections. One capability template renders all six from `capabilities.ts`; one service template renders every dedicated page from `services.ts` (with treatment flag routing thin-intent services to anchored sections instead of pages); one audience template renders all six; one case-study and one article template render from collections.
- **Two signature islands, one engine each**: the Growth Graph is a single model (`growthGraph.ts` + `graphGeometry`/`graphLayout`) expressed at several depths (homepage centrepiece, How It Connects spine, Review offer, lighter capability/audience/case-study variants) via props (active nodes, links, goals, captions, layout mode, caption text). Map Your Stack reuses the same graph rendering with a selection-driven rule evaluation (`stackEval.ts` + `stackRules.ts`). No second graph implementation.
- **Hand-authored token CSS** implements the DESIGN.md system (warm cream floor, six capability colours with `-soft/-deep/-solid/-on/-on-dark` variants, text-safe vs decorative gradients, Geist Sans/Mono roles with a 600 weight ceiling, asymmetric editorial layouts, one dark high-impact environment, outline focus). No CSS framework.
- **Honest fallbacks by design**: content renders fully without JS; islands degrade to readable static states; the js-ready reveal controller gates hidden reveal state so content is visible by default; form never fakes success; proof surfaces show honest interim/empty states with placeholder connection-map art.

## Motion implementation approach

- **Two families only (FR-045)**: *Connect* (links drawing between nodes to show a relationship or journey) and *Reveal* (content easing into place on scroll). Every animation must explain a relationship, journey or changing state, or it is cut.
- **CSS-first**: reveals, section entrances, chip selected-state transitions, hub-spoke and link styling are CSS transitions/animations gated on a `js-ready` class. No animation library.
- **JS only where it gives the strongest Astro-native result**: the Growth Graph and Map Your Stack islands use small vanilla-TS controllers to (a) sequence Connect line-draws and the subtle node pulse (the only permitted loop), (b) update active/gap link state live as goals or tools change, (c) manage focus and live-region announcements, and (d) pause motion off-screen (IntersectionObserver) and on hidden tab (visibilitychange), resuming without replay.
- **Reduced motion**: `prefers-reduced-motion: reduce` collapses both families to final states immediately: no line-drawing, no flowing dots, no looped pulse, no entrance transforms; the complete connected state and all captions/results are shown as text with identical meaning.
- **No-JS**: islands render their static final state (all meaningful nodes, labels and captions present); reveal hidden-state is never applied without the controller, so content is visible by default.

## Testing strategy

Testing follows Principle X (test important behavior, TDD when practical) and encodes the Definition of Done (Principle XIV) as phase review gates. Layers:

1. **Unit (Vitest, pure logic, TDD-first where practical)**: Map Your Stack rule evaluation and scoring/bands (including OR-groups, not-relevant exclusion, zero-relevant safety, top-3 gaps / top-2 working caps, band thresholds at 0/40/just-above-40/70/just-above-70/100); Growth Graph geometry and layout-mode selection; SEO builders (title/description/canonical patterns, single H1 expectations) and schema builders (visible-only types, breadcrumb); booking validation and the provider-neutral submission adapter (never-false-success, honeypot, retryable failures, Formspree AJAX contract); content-collection schema shape and required editorial fields; nav/internal-link-map integrity (every capability links its services, every service links siblings + audiences, every article links one capability + one audience + two articles); content lint (ban em dashes, superlatives, buzzwords, flagged claims, invented figures) across data modules and rendered output.
2. **Integration (Vitest + rendered output)**: page systems compose correctly from data (a capability renders its colour/problems/proof/FAQ; a service carries breadcrumb + parent up-link + related; canonical placement rules hold: Landing Pages once under Convert, CRM once under Connect, AI-search a section of SEO, testing canonical on CRO, Amazon under Paid Advertising); handoff parameter parses against the allowlist and is ignored when unknown/absent.
3. **Browser (Playwright-core, critical flows + regression)**: homepage first-screen message and dual CTA; consultation submit (accept path to honest confirmation; failure path preserves answers + email fallback, never false success); Map Your Stack select → live graph → reveal → CTA handoff prefills the form; Growth Graph goal selection updates flow/caption and announces; existing homepage graph, goal tabs, book-a-call and navigation still work (regression).
4. **Accessibility (Playwright + axe)**: WCAG 2.2 AA on audited page types; visible outline focus; keyboard operability of header, mega-menu, mobile sheet, tabs, accordions, both islands and forms; live-region announcements on graph/tool/form state change; contrast matrix (no white text on bright non-Build fills); accessible form errors (icon + text, not colour alone).
5. **Responsive (Playwright viewports)**: 360/390/768/1024/desktop with a 320px floor; zero horizontal scroll; radial graph ≥720px / vertical <720px; no label collisions or clipped glows; chip labels readable and wrapping cleanly; result panels stack.
6. **No-JS + reduced-motion**: scripting-disabled render shows all meaningful content and the core message and degrades islands to static states; reduced-motion shows final states with equivalent meaning.
7. **Visual QA (Playwright screenshots)**: capture 1440/1024/768/390/360 for key page types and both islands' states with `reducedMotion: 'reduce'`; confirm native feel, reused (not rebuilt) graph, distinct gap vs active links, no overflow/overlap/clipping, no false-audit claims.
8. **Performance (Lighthouse mobile, best effort)**: production build audited on representative page types; report exact Performance/Accessibility/Best-Practices/SEO; target 90+ (best effort 95+); never fabricate a score; document performance choices.

Adversarial verification (a fresh reviewer pass against copy honesty, claim safety, accessibility and canonical/SEO rules) runs before each phase's review gate, consistent with prior phases in this project.

## Implementation phases

Phases map to the brief's Section 23 roadmap and the spec's priorities. Each phase ends at a review gate (build + Astro check + relevant tests green, mobile no-overflow, a11y checks, copy-honesty lint, no stray placeholders) before the next begins. Dependencies are strict where noted.

- **Phase A — Foundations & design system** (blocks all): finalise token CSS (colours/variants, typography roles, gradients, surfaces, spacing, focus), shared `page/` section systems, `ui` primitives (Breadcrumb, Accordion, Tabs), nav/mega-menu/mobile-sheet/footer chrome, `capabilities.ts`/`services.ts`/`audiences.ts`/`faqs.ts`/`links.ts` data contracts and `content/config.ts` schemas, SEO/schema/sitemap/robots seams with the crawler allowlist. Migrate existing home/what-we-do/who-we-help/how-it-connects/book-a-call/map-your-stack onto the finalised system. Gate: design coherence + a11y chrome + no regression.
- **Phase B — Homepage & Growth Graph depth** (needs A): implement the full approved homepage section sequence and the Growth Graph as the single dark centrepiece with the five goals including "Save team time"; wire the three starting points and six capability blocks. Gate: first-screen message test, graph a11y + reduced-motion parity.
- **Phase C — Capability pages (six)** (needs A): one shared capability system rendering all six from data with per-capability colour/problems/specialist/proof/FAQ, sibling switcher and connection story. Gate: shared-sequence + colour-contrast + canonical-placement tests.
- **Phase D — Service pages, launch set (seven)** (needs C): Ecommerce Development, Website Design & Development, SEO & Search Visibility, Paid Advertising, Conversion Optimisation, Email Marketing, Analytics & Tracking, from the service system with breadcrumb, parent up-link, deliverables, "what it connects with", progressive specialist detail, related services and matching CTA. Thin-intent services render as anchored capability sections. Gate: no thin/duplicate pages, canonical-placement rules.
- **Phase E — Audience pages (six)** (needs C): one shared audience system from data with audience language/concerns, relevant-service links, audience Growth Graph variant and matched CTA labels. Gate: distinct-situation + matched-CTA tests.
- **Phase F — Conversion, How It Connects depth & states** (needs B): consultation form field/validation/submission contract, honest confirmation with the three-outcomes message (no time promise, no calendar widget), Map Your Stack → form handoff prefill via allowlist, Contact route, How It Connects educational hub (five links, worked examples, anatomy, self-check) and Growth Graph Review framing, plus all confirmation/error/empty/404 states. Gate: never-false-success + handoff + a11y-form + 404 no-index tests.
- **Phase G — Work & Insights** (needs A; content owner-dependent): Work index with capability/audience filters, honest empty + honest interim states, six-part case-study template with scoped graph; Insights index with categories, article template (question title, honest H1, key points, plain answer, pitfalls, self-check, sources, last-reviewed, cluster links) and canonicalised filtered views. Gate: empty-state + canonical + no-invented-figures tests.
- **Phase H — About, FAQ, utility & legal shells** (needs A): About (two-audience story, philosophy, five-step process, honest credentials), FAQ hub (single-open accordions), and Privacy/Cookies/Terms interface-copy shells with safe fallbacks pending owner legal wording. Gate: honest-credentials lint + accordion a11y.
- **Phase I — Hardening, performance & convergence** (needs all): full responsive sweep (360/390/768/1024/desktop, 320px floor), axe pass, no-JS pass, Lighthouse mobile audit with exact reported scores, visual QA screenshots, adversarial honesty/claim review, then `/speckit-converge` to record residual work and owner-dependency gaps. Gate: full Definition of Done.

Remaining (post-launch) service pages phase in by intent after Phase D behind their anchored capability sections; a scheduler and named case studies are added later behind the same primary conversion as owner assets/permissions clear.

## Owner-supplied dependencies

Structure ships with honest fallbacks; these unblock final polish, not the build:

- **Licensed Geist WOFF2 fonts** (Sans + Mono): self-hosted subset; system-font fallback stack remains until supplied.
- **Production config** (never hardcoded, injected as env `PUBLIC_*`): `PUBLIC_SITE_URL` (canonical/sitemap/OG absolute URLs) and `PUBLIC_BOOKING_ENDPOINT` (provider-neutral consultation delivery; currently the verified Formspree endpoint).
- **Proof content**: at least three real work examples and two or three permissioned/named case studies, plus testimonials and verifiable credentials. Until then Work/homepage show honest interim states and anonymized work with connection-map placeholder art.
- **People & photography**: founder/team names, roles and photos for About and any named expertise.
- **Legal wording**: jurisdiction-reviewed Privacy, Cookies and Terms copy (interface shells ship first).
- **Later, optional**: a calendar-scheduler provider decision (not at launch), a realistic response-time window (only once it can be met), and a newsletter delivery provider for the opt-in.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Template sprawl: ~50 pages become repetitive or drift | Maintenance cost, inconsistency, thin pages | Data-driven page systems + shared section components; treatment flag forces thin-intent services into anchored sections; canonical-placement tests. |
| Two graph contexts diverge or the homepage graph regresses | Broken signature experience, duplicated engine | Single Growth Graph model + shared geometry/layout; Map Your Stack reuses the same rendering; regression tests lock the existing homepage graph and goal tabs. |
| Copy honesty erosion (buzzwords, invented figures, flagged claims, em dashes) across many pages | Trust and brand damage, constitution breach | Automated content-lint tests over data + rendered output; adversarial honesty review at each gate; playbook-sourced copy only. |
| Accessibility regressions at scale (focus, live regions, contrast, reduced motion) | WCAG 2.2 AA failure, exclusion | Accessible primitives (Breadcrumb/Accordion/Tabs), axe + keyboard e2e per page type, reduced-motion and no-JS parity tests. |
| Form delivery misconfig shows false success or drops a lead | Lost consultations, dishonesty | Provider-neutral adapter that never fakes success; preserve answers + email fallback; env-injected endpoint; interception-based tests (no live submissions). |
| Mobile overflow / island unusable on small screens | Fails mobile-first gate | 320px-floor responsive sweep; graph vertical mode and tap-to-add tool list; 44px targets; screenshot QA at 360/390. |
| Handoff parameter tampering injects content | Security/content-integrity | Allowlist-parse the carried selection; ignore unknown/malicious values; form works with no parameter. |
| Owner content late (proof, people, legal, fonts) | Perceived incompleteness | Honest interim/empty states, placeholder connection-map art, system-font fallback, interface-only legal shells; nothing structural blocked. |
| Performance drift from fonts/SVG/motion as pages grow | Misses Lighthouse 90+ | Subset fonts + `font-display: swap`, CSS-first motion, lazy non-critical assets, no framework/anim-library, Lighthouse audit at the hardening gate with documented choices. |
| Crawler policy misapplied (blocks search or allows training) | SEO loss or unwanted training use | Env-aware robots with an explicit allow/block list (allow search + OAI-SearchBot; block GPTBot/CCBot/Google-Extended), covered by tests; sitemap excludes 404. |

## Complexity Tracking

> No constitution violations. No entries.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | | |

## Progress

- [x] Phase 0: Outline & Research (`research.md`)
- [x] Phase 1: Design & Contracts (`data-model.md`, `contracts/`, `quickstart.md`)
- [x] Constitution Check: initial (pre-Phase 0) — PASS
- [x] Constitution Check: post-design (post-Phase 1) — PASS
- [ ] Phase 2: Tasks (`/speckit-tasks` — not produced by `/speckit-plan`)
