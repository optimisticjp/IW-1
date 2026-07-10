---
description: "Dependency-ordered implementation tasks for the Infinite Weblinks flagship marketing website"
---

# Tasks: Infinite Weblinks Flagship Marketing Website

**Input**: Design documents from `specs/001-marketing-website/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Architecture (locked)**: Astro SSG · hand-authored token-based CSS (no CSS framework) · Astro content collections · SVG + CSS for the Infinite Universe (no animation library unless later justified) · selective client-side islands only · no UI framework · no database · no CMS · no unnecessary backend.

**Tests**: Targeted tests are included alongside the work they protect (content schemas, form validation, metadata, critical routes, build). Decorative markup is not unit-tested.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task).
- **[Story]**: User story served — `US1`..`US6` (maps to spec.md). Pure setup/foundational/QA tasks carry no story label but note the FRs they satisfy.
- Each task carries a `↳` metadata line: **Dep** (dependencies) · **Verify** (how to check) · **Satisfies** (FR/SC/US traceability) · **Phase**.

**User story key**: US1 Ecommerce evaluation→proposal (P1) · US2 Submit a proposal (P1) · US3 Priority service-page entry (P2) · US4 Case-study entry (P2) · US5 Secondary audiences (P3) · US6 Inclusive access: mobile/keyboard/reduced-motion (P2).

**Placeholder policy**: realistic, polished temporary content is used everywhere and must never look unfinished. Every temporary value is flagged in data with `placeholder: true` / `assetStatus: "pending"` / `TODO(content)`. Placeholder status surfaces **only** in dev tooling / comments / validation output / a dev-only content audit — **never** as a public-facing badge or label. A pre-launch content-integrity task (T086) enumerates every placeholder before deployment. Placeholders never block implementation.

---

## Phase 1: Foundation and Flagship Homepage 🎯 MILESTONE (primary deliverable)

**Goal**: A complete, browser-reviewable, intentionally-designed responsive homepage — not scaffolding — establishing the design system, the Infinite Universe brand system, and the three signature experiences.

**Independent Test**: Load `/` cold; confirm ecommerce relevance + core message on the first screen, the nine narrative stages in order, all five priority services findable, contextual proof beside a claim, and a reachable Request a Proposal — at 360/390/768/1024/desktop, with reduced-motion and keyboard parity.

### Setup

- [ ] T001 Initialize Astro project at repo root (`package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/`, `public/`), scripts `dev`/`build`/`preview`/`test`; no UI/CSS framework added.
  - ↳ Dep: none · Verify: `npm run dev` serves a page and `npm run build` succeeds · Satisfies: plan Structure Decision · Phase 1
- [ ] T002 [P] Configure essential integrations only: `@astrojs/sitemap`, Astro image (sharp), and Vitest (`vitest.config.ts`, `tests/unit/`) in `astro.config.mjs` + config files.
  - ↳ Dep: T001 · Verify: `npm run test` runs (zero tests passes); build still succeeds · Satisfies: FR-043, Principle X · Phase 1
- [ ] T003 [P] Add self-hosted placeholder variable fonts (display serif, interface sans, mono) to `public/fonts/` with `@font-face` + preload of the critical display subset in `src/styles/`.
  - ↳ Dep: T001 · Verify: fonts load in dev with `font-display: swap`; no external font origin · Satisfies: FR-052, Principle III · Phase 1 · TODO(content): final typeface licensing

### Foundational — design system & shell

- [ ] T004 Create design tokens in `src/styles/tokens.css` (color: `--paper`/`--ink`/`--vermilion`/`--green`/rationed accents; fluid `clamp()` type scale; 4px spacing scale; radius `0/2/6`; elevation; breakpoints 360/390/480/768/1024/1280/1536; `--focus`).
  - ↳ Dep: T001 · Verify: tokens resolve in a probe component; values documented as adjustable · Satisfies: FR-004, Principle IV · Phase 1
- [ ] T005 [P] Create `src/styles/environments.css` — paper (light) & ink (dark) section environments via `[data-env]` remapping semantic tokens (`--bg`/`--fg`/`--muted`/`--rule`/`--link`).
  - ↳ Dep: T004 · Verify: a section flips environment correctly in both modes · Satisfies: FR-034, plan Design System · Phase 1
- [ ] T006 [P] Create `src/styles/base.css` + `global.css` — reset, base elements, `:focus-visible`, prose defaults, base `prefers-reduced-motion` handling.
  - ↳ Dep: T004 · Verify: focus outline visible on keyboard nav; reduced-motion query active · Satisfies: FR-048, FR-037 · Phase 1
- [ ] T007 Build layout primitives `Container`, `Section`, `Grid` in `src/components/layout/`.
  - ↳ Dep: T004–T006 · Verify: an asymmetric section renders with no overflow at all breakpoints · Satisfies: FR-045, FR-002 · Phase 1
- [ ] T008 Build UI primitives `Button`, `TextLink`, `Eyebrow`, `Tag`, `Stat`, `Prose` in `src/components/ui/` with focus states.
  - ↳ Dep: T004–T006 · Verify: keyboard focus visible; variants render in both environments · Satisfies: FR-048 · Phase 1
- [ ] T009 Build accessible form-control primitives (`FieldLabel`, `Input`, `Textarea`, `Select`, `Checkbox`, `FormStatus` with `aria-live`) in `src/components/ui/` + `src/components/forms/`.
  - ↳ Dep: T008 · Verify: labels/`aria-describedby` wired; `FormStatus` announces politely · Satisfies: FR-049 · Phase 1 (consumed in Phase 4)
- [ ] T010 [P] Create data modules `src/data/nav.ts` (primary/footer nav, `emphasis`, `matchPaths`) and `src/data/pillars.ts` (Demand/Storefront/Retention/Intelligence + Brand/Content foundation).
  - ↳ Dep: T001 · Verify: nav lists exactly the six primary destinations; secondary links flagged `quiet` · Satisfies: FR-005, FR-009, SC-017 · Phase 1
- [ ] T011 [US1] Build `SiteHeader` + sticky `PrimaryNav` (active-state from path, persistent Request-a-Proposal CTA) in `src/components/layout/`.
  - ↳ Dep: T007, T008, T010 · Verify: sticky on scroll; active page marked; CTA present · Satisfies: FR-005, FR-019 · Phase 1
- [ ] T012 [US6] Build `MobileNav` island (disclosure, focus trap, `Esc` to close, focus return, `aria-expanded`/`aria-controls`, background inert) in `src/components/layout/`.
  - ↳ Dep: T011 · Verify: keyboard-only open/close; no hover dependence; works at 360px · Satisfies: FR-046, FR-049 · Phase 1
- [ ] T013 Build `SiteFooter` (full sitemap incl. legal; quiet secondary-audience links) in `src/components/layout/`.
  - ↳ Dep: T008, T010 · Verify: all routes linked; secondary links visually subordinate · Satisfies: FR-007, FR-030, SC-017 · Phase 1
- [ ] T014 Build `BaseLayout.astro` (`<head>`, skip link, header, footer, section-env wrapper, JSON-LD slot) + `src/lib/seo.ts` + `src/lib/schema.ts` scaffolding.
  - ↳ Dep: T011, T013 · Verify: a probe page renders one `<h1>`, unique title/description/canonical, landmarks · Satisfies: FR-041, FR-042, Principle VII · Phase 1
- [ ] T015 [US6] Add `SkipLink`, semantic landmark structure, and route-level focus reset in `BaseLayout`.
  - ↳ Dep: T014 · Verify: skip link focuses `<main>`; landmarks present · Satisfies: FR-048, FR-049 · Phase 1

### Foundational — Infinite Universe brand system

- [ ] T016 [US1] Build the Line visual system `src/components/brand/Line.astro` (SVG stroke; continuous vs broken/leaking states; vertical-spine mobile variant; reduced-motion static state; IO-driven draw controller as a `client:visible` island).
  - ↳ Dep: T004–T006 · Verify: Line draws on scroll, static under reduced motion, collapses to vertical at ≤768px; not a node-graph · Satisfies: FR-034, FR-035, FR-036, FR-037 · Phase 1
- [ ] T017 [P] Build brand objects `Storefront` and `Campaign` (SVG/CSS, static + assembled states) in `src/components/brand/`.
  - ↳ Dep: T004–T006 · Verify: render crisply at all sizes; assemble under motion, static under reduce · Satisfies: FR-039 · Phase 1
- [ ] T018 [P] Build brand objects `ContentStream` and `RetentionLoop` in `src/components/brand/`.
  - ↳ Dep: T004–T006 · Verify: as T017 · Satisfies: FR-039 · Phase 1
- [ ] T019 [P] Build brand objects `AnalyticsPanel` and `FlowMarker` in `src/components/brand/`.
  - ↳ Dep: T004–T006 · Verify: as T017 · Satisfies: FR-039 · Phase 1
- [ ] T020 [US1] Build `ProofModule`, `TestimonialModule`, `LogoWall` in `src/components/modules/` + a **dev-only** `PlaceholderBadge` (renders only when `import.meta.env.DEV`; never in production).
  - ↳ Dep: T008 · Verify: proof renders beside a claim; badge absent from `npm run build` output · Satisfies: FR-015, FR-016 · Phase 1

### Flagship homepage narrative (US1)

- [ ] T021 [US1] Author realistic placeholder homepage copy/data in `src/content/site/home.*` (flagged `placeholder: true`).
  - ↳ Dep: T010 · Verify: copy reads human and ecommerce-specific; flags present · Satisfies: FR-033, Principle VI · Phase 1
- [ ] T022 [US1] Build Hero + positioning section (`src/components/sections/Hero.astro`, mounted in `src/pages/index.astro`) — first-screen ecommerce relevance + "disconnected leaks / connected compounds".
  - ↳ Dep: T007, T008, T016, T021 · Verify: message clear above the fold at 360px & desktop · Satisfies: FR-001, SC-001 · Phase 1
- [ ] T023 [US1] Build "cost of disconnected growth" section using brand objects + leaking Line state.
  - ↳ Dep: T007, T016, T017–T019 · Verify: conveys leak/cost visually and in static text · Satisfies: FR-002(2) · Phase 1
- [ ] T024 [US1] Build "connected ecosystem" section incl. signature experience **The Connection** (growth loop becomes visible).
  - ↳ Dep: T016, T017–T019 · Verify: loop closes on scroll; understandable statically · Satisfies: FR-002(3), FR-038 · Phase 1
- [ ] T025 [US1][US6] Build signature experience **Leak to Compound** (disconnected↔connected; reduced-motion shows labeled before/after).
  - ↳ Dep: T016 · Verify: both states legible with motion and under `reduce` · Satisfies: FR-038, SC-011 · Phase 1
- [ ] T026 [US1] Build four-pillar presentation (Demand/Storefront/Retention/Intelligence + Brand/Content foundation) with `PillarGrid`.
  - ↳ Dep: T007, T010, T017–T019 · Verify: four pillars + foundation shown, not a full directory · Satisfies: FR-009 · Phase 1
- [ ] T027 [US1] Build five-priority-services section (Meta Ads, Google Ads, Website Design & Development, Shopify Store Development & Management, Social Media Growth) by real names.
  - ↳ Dep: T007, T008 · Verify: all five findable in ~30s without browser find · Satisfies: FR-008, SC-003 · Phase 1
- [ ] T028 [US1] Build contextual proof section (`ProofModule` beside claims; realistic placeholder metrics/logos/testimonials).
  - ↳ Dep: T020, T021 · Verify: proof adjacent to its claim; flagged in data · Satisfies: FR-015, SC-005 · Phase 1
- [ ] T029 [US1] Build "how Infinite Weblinks works" approach-summary section.
  - ↳ Dep: T007, T021 · Verify: process legible; leads toward proposal · Satisfies: FR-002(7) · Phase 1
- [ ] T030 [US1][US5] Build quiet secondary-audience paths section (Creators, Partners) that preserves ecommerce-first emphasis.
  - ↳ Dep: T007, T010 · Verify: links present but subordinate in hierarchy · Satisfies: FR-002(8), SC-017 · Phase 1
- [ ] T031 [US1] Build reusable `CTASection` (final proposal invitation) in `src/components/modules/`.
  - ↳ Dep: T008 · Verify: contextual, non-aggressive CTA; reachable · Satisfies: FR-019, SC-006 · Phase 1
- [ ] T032 [US1] Assemble `src/pages/index.astro`: wire the Line as the connecting scroll spine across sections, keep calm reading sections between signatures, add homepage metadata + Organization JSON-LD.
  - ↳ Dep: T022–T031, T014, T016 · Verify: one connected argument top→bottom; one `<h1>`; valid JSON-LD · Satisfies: FR-002, FR-003, FR-035 · Phase 1
- [ ] T033 [US6] Homepage responsive + inclusive pass at 360/390/768/1024/desktop — no horizontal overflow, reduced-motion parity, keyboard operability.
  - ↳ Dep: T032 · Verify: zero overflow at 5 widths; keyboard reaches all controls; motion info present statically · Satisfies: FR-045, FR-046, SC-009, SC-010, SC-011 · Phase 1
- [ ] T034 [P] Add foundational tests in `tests/unit/`: nav config integrity (six primary destinations, quiet secondary), `lib/seo.ts` output completeness, and homepage build smoke.
  - ↳ Dep: T010, T014, T032 · Verify: `npm run test` green · Satisfies: SC-014, Principle X · Phase 1
- [ ] T035 **VISUAL REVIEW CHECKPOINT** — run `npm run dev`/`build`, review the homepage at all breakpoints (use `/run` or screenshots), confirm flagship, intentionally-designed quality before Phase 2.
  - ↳ Dep: T033 · Verify: reviewer sign-off that the homepage reads as the flagship direction (not scaffolding) · Satisfies: milestone gate, SC-018 · Phase 1

**Checkpoint**: Reviewable flagship homepage complete. Do not start Phase 2 until T035 passes.

---

## Phase 2: Primary Pages (US3)

**Goal**: What We Do + the seven service/pillar pages via a reusable template, with cross-linking and contextual proof.

**Independent Test**: Load each of the seven service pages directly; confirm real-name service, cause/effect, ≥1 pillar connection, adjacent proof, contextual CTA; What We Do maps the four pillars to services.

- [ ] T036 Create content-collection schemas `src/content/config.ts` (zod for `services`, `caseStudies`, `insights`, `testimonials`, `logos`, `site`) per contracts/content-collections.md.
  - ↳ Dep: T014 · Verify: `astro sync` types generate; invalid entry fails build · Satisfies: FR-032, content-collections contract · Phase 2
- [ ] T037 [US3] Author `services` entries: five priority (`kind: priority`) + Retention & Intelligence (`kind: pillar`) in `src/content/services/` with realistic placeholder copy (flagged).
  - ↳ Dep: T036 · Verify: seven entries validate; five priority slugs present · Satisfies: FR-006, FR-008 · Phase 2
- [ ] T038 [US3] Build `ServiceLayout.astro` template (hero, problem, cause/effect, connections, capabilities, proof, related case studies, CTA) in `src/layouts/`.
  - ↳ Dep: T036, T007, T008, T020 · Verify: renders a service with a connection block + CTA · Satisfies: FR-011, FR-012 · Phase 2
- [ ] T039 [US3] Build dynamic route `src/pages/services/[slug].astro` rendering all seven entries.
  - ↳ Dep: T037, T038 · Verify: all seven URLs build and render · Satisfies: FR-006 · Phase 2
- [ ] T040 [P] [US3] Build reusable `ServiceModule` + capability modules in `src/components/modules/`.
  - ↳ Dep: T008 · Verify: modules reused across services without per-page CSS · Satisfies: FR-011 · Phase 2
- [ ] T041 [US3] Place contextual proof + reusable `CTASection` across service pages.
  - ↳ Dep: T031, T020, T039 · Verify: each service page shows proof-beside-claim + a CTA · Satisfies: FR-012 · Phase 2
- [ ] T042 [US3][US4] Implement contextual cross-linking (service `connections` → other pillars; `relatedCaseStudies` placeholders).
  - ↳ Dep: T037, T039 · Verify: links resolve between pillars/services · Satisfies: FR-011, FR-017 · Phase 2
- [ ] T043 [US1][US3] Build What We Do page `src/pages/what-we-do.astro` (four-pillar overview → services; ecommerce-first).
  - ↳ Dep: T039, T026, T010 · Verify: pillars link to their services; not an overwhelming directory · Satisfies: FR-005, FR-009 · Phase 2
- [ ] T044 [US3] Add per-page metadata + `Service` JSON-LD + `BreadcrumbList` for service pages.
  - ↳ Dep: T014, T039 · Verify: unique title/description/canonical + valid JSON-LD per page · Satisfies: FR-042, FR-043, SC-014 · Phase 2
- [ ] T045 [US6] Responsive pass for `ServiceLayout` + What We Do at five widths.
  - ↳ Dep: T039, T043 · Verify: zero overflow; readable at 360/390 · Satisfies: FR-045, SC-009 · Phase 2
- [ ] T046 [P] Add `tests/unit/schema.test.ts`: services invariants (five priority + two pillar, ≥1 connection, CTA present, valid seo, unique slugs).
  - ↳ Dep: T036, T037 · Verify: `npm run test` green · Satisfies: content-collections contract, FR-006 · Phase 2
- [ ] T047 [P] Add service-route generation smoke test (all seven slugs produce pages).
  - ↳ Dep: T039 · Verify: build lists seven service routes · Satisfies: SC-004 · Phase 2

**Checkpoint**: Full service architecture browsable and cross-linked.

---

## Phase 3: Work, Trust, and Secondary Paths (US4, US5)

**Goal**: Case Studies index + template, Approach, Creators, Partners, and a non-empty Insights section — all content-driven with realistic replaceable data.

**Independent Test**: Open a case study (all narrative sections + service links + pending metrics never shown as verified); reach Creators & Partners via quiet paths; Insights index shows substantial articles.

- [ ] T048 [US4] Author `caseStudies` entries (6–8 realistic placeholders, `assetStatus: "pending"`, `results[].verified: false`) in `src/content/caseStudies/`.
  - ↳ Dep: T036 · Verify: entries validate; unverified metrics flagged · Satisfies: FR-014, FR-016 · Phase 3
- [ ] T049 [US4] Build `CaseStudyLayout.astro` (context, problem, systems involved, what changed, how connected, results, relevant services, next action) in `src/layouts/`.
  - ↳ Dep: T048, T020 · Verify: all required sections render; pending results show non-verified treatment · Satisfies: FR-014, FR-016 · Phase 3
- [ ] T050 [US4] Build route `src/pages/case-studies/[slug].astro`.
  - ↳ Dep: T048, T049 · Verify: each case study URL builds · Satisfies: FR-014 · Phase 3
- [ ] T051 [US4] Build Case Studies index `src/pages/case-studies/index.astro` (`CaseStudyCard` grid, links).
  - ↳ Dep: T048, T050 · Verify: index lists all entries; cards link through · Satisfies: FR-014, SC-004 · Phase 3
- [ ] T052 [US4] Implement case-study ↔ service linking (both directions).
  - ↳ Dep: T050, T039 · Verify: case studies link to services and appear under related services · Satisfies: FR-017 · Phase 3
- [ ] T053 Build Approach page `src/pages/approach.astro` (method, process, principles, communication expectations, engagement structure).
  - ↳ Dep: T007, T008 · Verify: trust-building content present; one `<h1>` · Satisfies: FR-018 · Phase 3
- [ ] T054 [US5] Build For Creators page `src/pages/for-creators.astro` (quiet secondary path, appropriate inquiry context).
  - ↳ Dep: T007, T031 · Verify: reachable via quiet path; inquiry CTA present · Satisfies: FR-029 · Phase 3
- [ ] T055 [US5] Build Partners / White-label page `src/pages/partners.astro` (quiet, white-label inquiry context).
  - ↳ Dep: T007, T031 · Verify: reachable; white-label inquiry present · Satisfies: FR-030 · Phase 3
- [ ] T056 [US1] Author `insights` entries (2–3 substantial placeholder articles) in `src/content/insights/`.
  - ↳ Dep: T036 · Verify: entries validate; Insights is non-empty · Satisfies: FR-031 · Phase 3
- [ ] T057 Build `ArticleLayout.astro` + route `src/pages/insights/[slug].astro`.
  - ↳ Dep: T056 · Verify: article renders with metadata · Satisfies: FR-031 · Phase 3
- [ ] T058 Build Insights index `src/pages/insights/index.astro` (never presented empty).
  - ↳ Dep: T056, T057 · Verify: index lists the seeded articles · Satisfies: FR-031 · Phase 3
- [ ] T059 [US4] Add related-content + related-service linking on articles/case studies + `Article` JSON-LD + per-page metadata.
  - ↳ Dep: T057, T050, T014 · Verify: internal links resolve; valid Article JSON-LD · Satisfies: FR-043, SC-014 · Phase 3
- [ ] T060 [US6] Responsive pass for case-study/index/approach/creators/partners/insights at five widths.
  - ↳ Dep: T050–T058 · Verify: zero overflow across pages · Satisfies: FR-045, SC-009 · Phase 3
- [ ] T061 [P] Extend `tests/unit/schema.test.ts`: caseStudies + insights invariants (assetStatus present, `verified` defaults false, `relevantServices` resolve, required image `alt`).
  - ↳ Dep: T048, T056 · Verify: `npm run test` green · Satisfies: FR-016, SC-016 · Phase 3

**Checkpoint**: Proof, trust, and secondary-audience paths live.

---

## Phase 4: Conversion and Supporting Pages (US2)

**Goal**: The full proposal journey (form UI + states + mock adapter), Contact, legal templates, and site-wide SEO/metadata/structured-data wiring.

**Independent Test**: Complete the proposal form (success); trigger validation, failure/retry, duplicate, and spam paths; confirm privacy notice and no login; legal pages render; sitemap/robots/canonical/OG present.

- [ ] T062 [US2] Build `src/data/proposalSchema.ts` (field definitions) + `src/lib/validation.ts` (framework-free required/optional, email/URL, privacyAck, length rules).
  - ↳ Dep: T009 · Verify: pure functions unit-testable · Satisfies: FR-021, FR-022 · Phase 4
- [ ] T063 [US2] Build submission adapter `src/lib/forms/submit.ts` + `providers/mock.ts` (env-selected, default mock; simulates success/failure) + `spam.ts` (honeypot + submit-timing).
  - ↳ Dep: T062 · Verify: mock returns success and (toggled) retryable failure; no network/persistence · Satisfies: FR-025, FR-026, proposal-form contract · Phase 4
- [ ] T064 [US2] Build `ProposalForm` island (grouped fields; inline field-level validation; states idle→validating→submitting→success→error/retry; `aria-live` status; required privacy ack; client duplicate guard; honeypot).
  - ↳ Dep: T062, T063, T009 · Verify: keyboard-only completion; errors announced; data preserved on failure · Satisfies: FR-020, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027 · Phase 4
- [ ] T065 [US2] Build Request a Proposal page `src/pages/request-a-proposal.astro` (premium, consultative layout hosting the form).
  - ↳ Dep: T064 · Verify: page renders form; ≤3 interactions from homepage · Satisfies: FR-019, FR-020, SC-006 · Phase 4
- [ ] T066 [US5] Build Contact page `src/pages/contact.astro` + `ContactForm` variation (general / creator / partner inquiry contexts) reusing form primitives.
  - ↳ Dep: T064 · Verify: contact submit works with same validation/spam/privacy standards · Satisfies: FR-028 · Phase 4
- [ ] T067 [US2] Polish success/failure/retry UX + expected-response-communication copy in the form island.
  - ↳ Dep: T064 · Verify: success states next steps + response window; retry recovers · Satisfies: FR-023, FR-024 · Phase 4
- [ ] T068 Build `LegalLayout.astro` + Privacy Policy, Terms, Cookie Policy, Accessibility Statement pages in `src/pages/legal/` (realistic placeholder legal copy, `TODO(content)`).
  - ↳ Dep: T007, T014 · Verify: four legal pages render with one `<h1>` each · Satisfies: FR-056, FR-007 · Phase 4
- [ ] T069 [US2] Add privacy notice near proposal/contact forms + link to Privacy Policy.
  - ↳ Dep: T064, T068 · Verify: notice visible adjacent to forms · Satisfies: FR-027, FR-055 · Phase 4
- [ ] T070 Wire `public/robots.txt` + `@astrojs/sitemap` + verify canonical on every route.
  - ↳ Dep: T014, all pages · Verify: sitemap lists all routes; canonicals correct; robots present · Satisfies: FR-043, SC-014 · Phase 4
- [ ] T071 Finalize Open Graph/Twitter metadata + JSON-LD builders (Organization, Service, Article, BreadcrumbList, FAQ) across the site in `src/lib/schema.ts`.
  - ↳ Dep: T014 · Verify: OG tags on every route; JSON-LD validates · Satisfies: FR-042, FR-043 · Phase 4
- [ ] T072 [P] Add favicon (`public/favicon.svg`) + placeholder OG sharing images in `public/images/` (flagged).
  - ↳ Dep: T001 · Verify: favicon + OG image resolve; dimensions set · Satisfies: FR-042 · Phase 4 · TODO(content)
- [ ] T073 [P] Build 404 page `src/pages/404.astro`.
  - ↳ Dep: T014 · Verify: unknown route renders 404 with nav back · Satisfies: FR-005 · Phase 4
- [ ] T074 [P] [US2] Add `tests/unit/validation.test.ts` (required/optional, email/URL, privacyAck true, honeypot/timing rejection, duplicate detection, error-map shape).
  - ↳ Dep: T062, T063 · Verify: `npm run test` green · Satisfies: FR-022, FR-025, FR-026 · Phase 4
- [ ] T075 [P] Add `tests/unit/seo.test.ts` (SeoMeta completeness + JSON-LD builder shape for sample pages).
  - ↳ Dep: T071 · Verify: `npm run test` green · Satisfies: SC-014 · Phase 4

**Checkpoint**: End-to-end proposal journey works with placeholders; SEO foundations in place.

---

## Phase 5: Refinement and QA (US6 + Definition of Done)

**Goal**: Bring the built experience to launch-adjacent quality and verify the constitution's Definition of Done. QA runs after the experience exists (per plan), without stripping the creative concept before testing.

**Independent Test**: Every Phase-5 review passes its checklist item in quickstart.md; `/speckit-converge` logs residual gaps.

- [ ] T076 Replace available placeholder content/assets (keep flags on still-pending items) across `src/content/` and `public/`.
  - ↳ Dep: Phases 1–4 · Verify: `grep -rn "placeholder\|assetStatus: pending\|TODO(content)"` shows only genuinely-pending items · Satisfies: placeholder policy · Phase 5
- [ ] T077 [US6] Full responsive review + focused 360/390 pass; verify no horizontal overflow on every page.
  - ↳ Dep: all pages · Verify: 0 overflow at 5 widths across all routes · Satisfies: SC-009 · Phase 5
- [ ] T078 [P] Typography + visual-rhythm refinement pass (scale, measure, pacing, density variation).
  - ↳ Dep: all pages · Verify: coherent editorial rhythm; no repeated headline-3cards-CTA monotony · Satisfies: Principle IV, SC-018 · Phase 5
- [ ] T079 [US6] Animation-timing refinement + reduced-motion verification (information parity for all three signatures).
  - ↳ Dep: T016, T024, T025 · Verify: under `reduce`, no motion-only information lost · Satisfies: SC-011 · Phase 5
- [ ] T080 [US6] Keyboard-navigation + form-accessibility review (focus order, `aria`, announcements) across the critical path.
  - ↳ Dep: all interactive · Verify: full keyboard completion; visible focus everywhere · Satisfies: SC-010 · Phase 5
- [ ] T081 [P] Contrast review (both environments) + semantic-structure/heading-order review.
  - ↳ Dep: T004, all pages · Verify: AA contrast; one `<h1>`/page, logical order · Satisfies: SC-012, SC-014 · Phase 5
- [ ] T082 Accessibility verification — axe automated + manual (WCAG 2.1 AA) on key templates (home, service, case study, proposal, legal).
  - ↳ Dep: T080, T081 · Verify: zero critical a11y failures · Satisfies: SC-012 · Phase 5
- [ ] T083 Performance — Lighthouse mobile testing + image/font optimization + layout-shift review (target ≥90).
  - ↳ Dep: all · Verify: mobile Lighthouse ≥90 on home/service/proposal; CLS ~0 · Satisfies: SC-013, FR-052 · Phase 5
- [ ] T084 SEO validation (per-page checklist, sitemap, robots, canonical, OG, single `<h1>`) + broken-link review.
  - ↳ Dep: T070, T071 · Verify: per-page SEO checklist 100%; no broken links · Satisfies: SC-014 · Phase 5
- [ ] T085 Security review (`/owasp-security`): no secrets, safe error handling, spam guard, env handling; document the provider server-side-validation pre-launch gate.
  - ↳ Dep: T063, T068 · Verify: zero critical findings; adapter gate documented · Satisfies: SC-015, FR-053 · Phase 5
- [ ] T086 Content-integrity review — dev-only audit enumerating every `placeholder`/`assetStatus: pending`/`TODO(content)`; confirm no placeholder reads as approved proof; produce a pre-launch content report.
  - ↳ Dep: T076 · Verify: audit lists all pending items; zero fabricated-as-verified proof · Satisfies: SC-016, FR-016 · Phase 5
- [ ] T087 [P] Cross-browser review (current Chromium/Firefox/WebKit).
  - ↳ Dep: all · Verify: no layout/interaction breakage across engines · Satisfies: Principle XIV · Phase 5
- [ ] T088 [P] Code review on the full diff (`/review-local-changes` or `/code-review`); fix findings.
  - ↳ Dep: all · Verify: review findings resolved · Satisfies: Working Style (CLAUDE.md) · Phase 5
- [ ] T089 Final visual review — flagship quality; recognizably Infinite Weblinks (original, not a Clay copy) + capability-evidence mapping (each sold capability demonstrated somewhere).
  - ↳ Dep: all · Verify: reviewer sign-off; capability→evidence map complete · Satisfies: SC-018, SC-019 · Phase 5
- [ ] T090 Convergence readiness — run `/speckit-converge` to assess build vs spec/plan, log residual gaps, and sign off the Definition-of-Done checklist.
  - ↳ Dep: T076–T089 · Verify: converge report produced; DoD items checked · Satisfies: Principle XIV · Phase 5

**Checkpoint**: Definition of Done satisfied; residual gaps captured for follow-up.

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1** (T001–T035): starts immediately; **T035 visual-review checkpoint gates Phase 2**.
- **Phase 2** (T036–T047): needs Phase 1 shell + brand system + `config.ts` (T036 depends on T014).
- **Phase 3** (T048–T061): needs Phase 2 `config.ts` (T036) and service routes for cross-linking (T039).
- **Phase 4** (T062–T075): form primitives from Phase 1 (T009); pages benefit from Phases 2–3 existing for internal links but the form path is independently testable.
- **Phase 5** (T076–T090): needs Phases 1–4 substantially complete.

### Critical dependency chain (longest path to a reviewable flagship + full site)

`T001 → T004 → T007/T008 → T011 → T014 → T016 → T022 → T032 → T033 → T035` (flagship homepage milestone)
→ `T036 → T037 → T038 → T039 → T044` (service architecture)
→ `T048 → T049 → T050 → T052` (case-study proof)
→ `T062 → T063 → T064 → T065 → T067` (proposal journey)
→ `T070/T071 → T082 → T083 → T086 → T090` (QA → convergence).

### Within a phase

- Design tokens (T004) precede everything visual.
- Shell (T011/T014) precedes pages.
- Brand objects (T016–T020) precede homepage sections and signatures.
- `config.ts` (T036) precedes all content-driven pages and schema tests.
- Form logic (T062–T063) precedes the form island (T064).

---

## Parallel Opportunities

Tasks marked **[P]** touch different files with no incomplete dependency and may run together. **20 parallelizable tasks**: T002, T003, T005, T006, T010, T017, T018, T019, T034, T040, T046, T047, T061, T072, T073, T074, T075, T078, T081, T087, T088. *(21 listed; run as capacity allows.)*

### Example — Phase 1 brand objects in parallel

```bash
Task: "T017 Build Storefront + Campaign brand objects in src/components/brand/"
Task: "T018 Build ContentStream + RetentionLoop brand objects in src/components/brand/"
Task: "T019 Build AnalyticsPanel + FlowMarker brand objects in src/components/brand/"
```

### Example — Phase 4 tests in parallel

```bash
Task: "T074 Add proposal-form validation tests in tests/unit/validation.test.ts"
Task: "T075 Add SEO/metadata generation tests in tests/unit/seo.test.ts"
```

---

## Implementation Strategy

### First batch (fastest visible progress)

Do **T001 → T004 → T007 → T008 → T010 → T011 → T014 → T016 → T021 → T022**, then land the remaining homepage sections (T023–T031), assemble (T032), responsive/inclusive pass (T033), and hit the **T035 visual checkpoint**. This produces a reviewable flagship homepage before any secondary page work.

### MVP scope

**US1 (homepage evaluation journey) + US2 (proposal submission)** are the P1 core. A demonstrable MVP = Phase 1 complete (US1) + the Phase 4 proposal journey (US2). Phases 2–3 add breadth (US3–US5); Phase 5 verifies inclusive access (US6) and the Definition of Done.

### Incremental delivery

Phase 1 (flagship homepage, reviewable) → Phase 2 (service architecture) → Phase 3 (proof + secondary paths) → Phase 4 (conversion + SEO) → Phase 5 (QA + converge). Each phase is independently reviewable; placeholders never block progress.

---

## Notes

- **[P]** = different files, no incomplete dependency.
- **[Story]** labels trace tasks to spec.md user stories; setup/foundational/QA tasks note FRs instead.
- Placeholders are realistic and polished, flagged only in data/dev tooling — **never** shown as public labels; T086 audits them pre-launch.
- Commit after each task or logical group; keep the branch pushable.
- Do not add an animation library, backend, CMS, or database unless a concrete limitation later justifies it and it is documented.
- Verify tests fail before implementing where TDD applies (form validation, schemas).
