---
description: "Dependency-ordered task plan for the Infinite Weblinks multipage restructure"
---

# Tasks: Infinite Weblinks Multipage Website Restructure

**Input**: Design documents from `specs/002-website-restructure/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included. The constitution (Principle X) and the plan's testing strategy require TDD-when-practical for pure logic plus regression, accessibility, responsive and performance checks. Test tasks appear within each phase.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task).
- **[Story]**: The user story served (US1–US9 from spec.md). Foundation and cross-cutting/polish tasks carry no story label.
- Each task carries a one-line **meta**: `Refs` (requirements/contracts) · `Deps` · `Parallel` · `Validate` · `Done when`.
- Phases follow the requested build-area sequence and map to plan.md phases A–I.

## Path conventions

Single static project. `src/` (data, content, components, layouts, lib, pages, styles) and `tests/` (unit, e2e) at repo root, per plan.md Structure Decision.

---

## Phase 1: Foundation & Design-System Migration (plan Phase A)

**Purpose**: Token system, reusable page/content systems, chrome, SEO/security seams, and migration of existing pages onto the new system. Blocking prerequisite for every story.

**⚠️ CRITICAL**: No page-building story can begin until this phase completes.

- [X] T001 Consolidate DESIGN.md tokens into `src/styles/tokens.css` (warm cream canvas, six capability colours with `-soft/-deep/-solid/-on/-on-dark`, text-safe vs decorative gradients, surfaces, spacing, radius, outline focus).
  - Refs FR-043/044, DESIGN.md · Deps none · Parallel T002/T003 · Validate `npm run build`; contrast spot-check · Done when tokens resolve and the contrast matrix holds (no white on bright non-Build fills).
- [X] T002 [P] Define typography system in `src/styles/typography.css` (Geist Sans all roles + Geist Mono for eyebrows/nodes/signals/data, 600 weight ceiling) with self-hosted subset WOFF2 wiring and a system-font fallback.
  - Refs FR-043, contracts/performance-budgets.md · Deps none · Parallel T001/T003 · Validate build; fonts ≤200 KB · Done when roles render with fallback and `font-display: swap`.
- [X] T003 [P] Add motion primitives in `src/styles/motion.css`: Connect and Reveal families gated on `.js-ready`, with `prefers-reduced-motion` collapsing to final states and the single node-pulse loop.
  - Refs FR-045 · Deps none · Parallel T001/T002 · Validate reduced-motion snapshot · Done when reveals hide only under `.js-ready` and reduced-motion shows final states.
- [X] T004 Wire the global stylesheet entry and reset into `src/layouts/BaseLayout.astro`, preserving the `js-ready` reveal controller (content visible by default without JS).
  - Refs FR-045/046, research.md D5 · Deps T001–T003 · Parallel none · Validate no-JS render · Done when all content is visible with scripting disabled.
- [X] T005 [P] Create `src/data/capabilities.ts` (six capability records: colour, descriptor, outcome hero, problems, specialist list, connection story, serviceIds, faqIds, action label, related).
  - Refs FR-011/012, data-model.md, contracts/content-schemas.md · Deps none · Parallel T006–T010 · Validate `npm run check` + integrity test · Done when six unique records typecheck.
- [X] T006 [P] Create `src/data/services.ts` enumerating the **complete service catalogue** from data-model.md "Service catalogue" (all 25 `treatment: page` services with capability, `launchSet` and slug: 7 launch, 18 phased, plus every anchored `treatment: section` service with its parent), each record: capabilityId, treatment, launchSet, searchIntent, deliverables, connections, specialist tools, faqIds, related, action label; with canonical-placement rules.
  - Refs FR-015/016, SC-003, data-model.md Service catalogue, contracts/content-schemas.md · Deps none · Parallel T005/T007–T010 · Validate catalogue-completeness + placement integrity test · Done when all 25 dedicated services (7 `launchSet: true`: rows 1,2,7,8,12,16,20) and every section exist, each maps to exactly one capability, no duplicate slug, and placement rules hold.
- [X] T007 [P] Create `src/data/audiences.ts` (six audience records: situation, language, concerns, outcomes, relevantServiceIds, objections, action label, graph variant).
  - Refs FR-017/018, contracts/content-schemas.md · Deps none · Parallel T005/T006/T008–T010 · Validate integrity test · Done when six unique records with valid service refs typecheck.
- [X] T008 [P] Create `src/data/faqs.ts` (shared + per-page FAQ sets, scoped) passing the copy ban list.
  - Refs FR-034/036 · Deps none · Parallel T005–T007/T009/T010 · Validate content-lint test · Done when unique ids and clean answers typecheck.
- [X] T009 [P] Create `src/data/links.ts` and `src/lib/links.ts` (internal-link/related-content maps and resolver: capability→services, service→siblings+audiences, article→1 cap+1 aud+2 articles, problem-first routing).
  - Refs FR-006, data-model.md · Deps none · Parallel T005–T008/T010 · Validate link-integrity test · Done when no dangling refs resolve.
- [X] T010 [P] Create `src/content/config.ts` with Zod-validated `work` and `insights` collections and empty collection folders.
  - Refs contracts/content-schemas.md, FR-031/032 · Deps none · Parallel T005–T009 · Validate `npm run check` · Done when schemas compile and reject malformed frontmatter.
- [X] T011 Build reusable page-section systems in `src/components/page/` (hero, recognition, principle, what-we-do, what-becomes-possible, connection, specialist-disclosure, proof, faq, related, cta) reading from data.
  - Refs FR-011/014/035, plan Structure Decision · Deps T001–T004 · Parallel none · Validate render test · Done when a page composes from data with no bespoke duplicate markup.
- [X] T012 [P] Add UI primitives `src/components/ui/Breadcrumb.astro`, `Accordion.astro`, `Tabs.astro` (keyboard-operable, single-open accordion, visible focus).
  - Refs FR-005/034, contracts/seo-metadata.md · Deps T001–T004 · Parallel T011 · Validate axe + keyboard e2e · Done when each is operable by keyboard with announced state.
- [X] T013 Implement navigation chrome in `src/components/layout/SiteHeader.astro` and `SiteFooter.astro`: mega-menu (six capabilities + descriptors + top services + overview), full-height focus-trapped mobile sheet (Escape, pinned CTA, announced), footer columns incl. `/contact` link and env-conditional newsletter.
  - Refs FR-001/002/003/004/050 · Deps T005–T007, T012 · Parallel none · Validate keyboard + a11y e2e; nav integrity test · Done when both nav modes are operable and the current item is marked.
- [X] T014 [P] Extend `src/lib/seo.ts` and `src/lib/schema.ts` for per-page title/description/canonical patterns and visible-only structured data incl. BreadcrumbList.
  - Refs FR-039/040, contracts/seo-metadata.md · Deps none · Parallel T015/T016 · Validate `tests/unit/seo.test.ts` · Done when unique metadata + a valid breadcrumb emit per page type.
- [X] T015 [P] Update `src/pages/robots.txt.ts` crawler allowlist (allow search + OAI-SearchBot; block GPTBot/CCBot/Google-Extended) and confirm `astro.config.mjs` sitemap excludes `/404`.
  - Refs FR-041, contracts/seo-metadata.md · Deps none · Parallel T014/T016 · Validate robots/sitemap test · Done when allow/block lists and sitemap exclusion verify.
- [X] T016 [P] Add baseline security headers and CSP to `public/_headers` (scoped to self + form-endpoint origin; nosniff, Referrer-Policy, Permissions-Policy, HSTS).
  - Refs FR-049, contracts/security-headers.md · Deps none · Parallel T014/T015 · Validate header check at preview · Done when CSP allows the submit path and blocks third-party JS.
- [X] T017 Migrate existing pages (`index`, `what-we-do`, `who-we-help`, `how-it-connects`, `book-a-call`, `map-your-stack`, `404`) onto the token system and page-section systems, preserving the `js-ready` reveal controller and the existing Growth Graph and Map Your Stack islands.
  - Refs plan Phase A, research.md D10 · Deps T001–T014 · Parallel none · Validate build + regression e2e · Done when migrated pages render on the new system with no behaviour loss.
- [X] T018 Add regression tests locking existing behaviour (homepage Growth Graph, goal tabs, `/book-a-call`, navigation) in `tests/unit/` and `tests/e2e/`.
  - Refs plan Risks · Deps T017 · Parallel none · Validate `npm run test` · Done when regression suite passes green.

**Checkpoint (Gate A)**: `npm run build` + `npm run check` green, chrome keyboard-operable, tokens coherent, migrated pages regress clean, no horizontal overflow. Story work can begin.

---

## Phase 2: Homepage & Growth Graph (plan Phase B)

**Goal**: The full approved homepage and the Growth Graph centrepiece, the core convert and educate surface.

**Independent Test**: Load the homepage cold; first screen states who/what-changes/next-action with dual CTA and no motion dependence; each of the five goals updates and announces the graph.

- [X] T019 [US1] Extend the existing `src/pages/index.astro` (migrated in T017) to the full homepage section sequence from `src/data/home.ts` (Hero → Immediate value → Problem → Three starting points → Anatomy → Growth Graph → Six capabilities → Start with the problem → Modern search and AI → How we work → Work and proof → Why → FAQ → Final CTA) using approved playbook copy, preserving current hero and messaging.
  - Refs FR-007/035/038, research.md D10 · Deps Gate A (incl. T017/T018) · Parallel none · Validate render test + copy-lint; regression-guarded by T018 · Done when all sections render in order with brand promises intact and the T018 regression suite stays green.
- [X] T020 [US1] Build the first-screen hero (who it is for, what changes, next action; primary "Book a free call" + secondary "Explore what is possible"), rendering meaning without motion.
  - Refs FR-008, SC-001 · Deps T019 · Parallel none · Validate e2e first-screen assertion · Done when the hero conveys the promise with JS disabled.
- [X] T021 [P] [US1] Wire the three starting points to the matching audiences and the six capability blocks to their capability pages via `src/data/links.ts`.
  - Refs FR-010, SC-013 · Deps T019 · Parallel T025 · Validate link-integrity test · Done when every block routes correctly.
- [X] T022 [US3] Extend the existing Growth Graph centrepiece (dark environment) in `src/components/brand/GrowthGraph.astro` + `src/data/growthGraph.ts`, preserving the current visual language, to the five goals including "Save team time".
  - Refs FR-009/020/021, research.md D10 · Deps Gate A (incl. T017/T018) · Parallel none · Validate `tests/unit/growthgraph.test.ts`; regression-guarded by T018 · Done when five goals render with real relationships only and the existing homepage graph regresses clean.
- [X] T023 [US3] Implement goal selection: real controls with selected states, caption available as text and announced on change, radial ≥720px / vertical <720px, keyboard operable.
  - Refs FR-021, contracts/map-your-stack.md (shared layout) · Deps T022 · Parallel none · Validate keyboard + live-region e2e · Done when goal change updates flow + caption and announces.
- [X] T024 [US3] Provide reduced-motion and no-JS paths: final connected state with caption as text, plus the graph text equivalent (accessible name; decorative SVG parts hidden).
  - Refs FR-045/048, SC-012 · Deps T022/T023 · Parallel none · Validate reduced-motion + no-JS e2e · Done when meaning is equivalent in both conditions.
- [X] T025 [P] [US1] Add the homepage FAQ, the honest proof interim state, and the "Start with the problem" problem-first entry.
  - Refs FR-007/031/037 · Deps T019 · Parallel T021 · Validate render + no-invented-figures lint · Done when interim proof is honest and problem-first routes correctly.
- [X] T026 [P] [US3] Add/extend unit tests for goals/captions/layout in `tests/unit/growthgraph.test.ts` and an e2e first-screen + graph accessibility check in `tests/e2e/`.
  - Refs plan Testing strategy · Deps T023/T024 · Parallel T025 · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate B)**: First-screen message test passes; graph is keyboard/reduced-motion/no-JS safe; homepage regresses clean.

---

## Phase 3: Capability Pages (plan Phase C)

**Goal**: One shared capability system rendering all six pages from data, distinct per capability.

**Independent Test**: Open each capability page; confirm the shared section sequence, its own colour/problems/proof/FAQ, the sibling switcher and the connection story.

- [X] T027 [US4] Create the capability route template `src/pages/what-we-do/[capability].astro` via `getStaticPaths` over `capabilities.ts`, composing the page-section systems.
  - Refs FR-011, plan Structure Decision · Deps Gate A · Parallel none · Validate build (6 routes) · Done when all six capability routes generate.
- [X] T028 [US4] Implement the shared section sequence (hero → recognition → principle → what we do → what becomes possible → connection → specialist detail → proof → FAQ → CTA) with per-capability colour, sibling switcher and connection story.
  - Refs FR-011/012/013 · Deps T027 · Parallel none · Validate capability-integrity + render tests · Done when six pages share sequence but differ in content.
- [X] T029 [P] [US4] Author distinct capability copy (Build, Attract, Convert, Retain, Connect, Scale) in `capabilities.ts` in playbook voice, with non-identical problem/specialist/FAQ sets.
  - Refs FR-035/036, content uniqueness · Deps T027 · Parallel T030/T032 · Validate content-lint + uniqueness test · Done when no sibling copy is identical and the ban list is clean.
- [X] T030 [P] [US4] Add the lighter capability Growth Graph variant (supports-the-other-five story).
  - Refs FR-020 · Deps T022 · Parallel T029/T032 · Validate reduced-motion e2e · Done when the variant renders accessibly at capability depth.
- [X] T031 [US4] Wire the mega-menu to `capabilities.ts` (columns, descriptors, top service links, overview link).
  - Refs FR-002 · Deps T013/T028 · Parallel none · Validate nav integrity + keyboard e2e · Done when the menu reflects live capability data.
- [X] T032 [P] [US4] Add capability-integrity tests (colour resolves, non-identical sets, bidirectional service refs) and a contrast-matrix check in `tests/unit/`.
  - Refs plan Testing strategy, FR-044 · Deps T028 · Parallel T029/T030 · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate C)**: Six capability pages share the sequence, differ in content, pass contrast and canonical-placement expectations.

---

## Phase 4: Seven Launch Service Pages (plan Phase D)

**Goal**: The seven highest-intent dedicated service pages from one system; thin-intent services become anchored sections.

**Independent Test**: Open each launch service page; confirm breadcrumb, parent up-link, deliverables, "what it connects with", specialist disclosure, related services and a matching CTA; confirm zero thin/duplicate pages.

- [X] T033 [US4] Create the service route template `src/pages/services/[service].astro` (filtered to `treatment === 'page'`) with breadcrumb, parent up-link, deliverables, "what it connects with", progressive specialist detail, related services and matching CTA.
  - Refs FR-014, contracts/routes.md · Deps Gate C · Parallel none · Validate build (7 routes) + render test · Done when the seven launch routes generate with the full structure.
- [X] T034 [US4] Complete the launch-page detail in `services.ts` for the seven `launchSet: true` services (Ecommerce Development, Website Design & Development, SEO & Search Visibility, Paid Advertising, Conversion Optimisation, Email Marketing, Analytics & Tracking) on the catalogue enumerated in T006, and enforce canonical placement (Landing Pages under Convert; CRM under Connect; AI-search a section of SEO; testing canonical on CRO; Amazon under Paid Advertising).
  - Refs FR-015/016, SC-003, data-model.md Service catalogue · Deps T006, T033 · Parallel none · Validate placement + launch-set (=7) test · Done when the seven launch pages carry full detail on the complete catalogue and rules hold.
- [X] T035 [P] [US4] Author friendly, buyer-intent copy for each of the seven services (unique searchIntent, deliverables, connections, FAQs) in playbook voice.
  - Refs FR-035/036/037, content uniqueness · Deps T034 · Parallel T036 · Validate content-lint + uniqueness test · Done when each page has unique intent and clean copy.
- [X] T036 [P] [US4] Render remaining (non-launch) services as anchored capability sections (`treatment === 'section'`) with in-page anchors.
  - Refs FR-015, contracts/routes.md · Deps T034 · Parallel T035 · Validate render test · Done when thin-intent services appear as sections, not pages.
- [X] T037 [US4] Add tests: no thin/duplicate pages, canonical placement, breadcrumb + parent up-link present, related-service links resolve.
  - Refs SC-003, plan Testing strategy · Deps T035/T036 · Parallel none · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate D)**: Seven launch pages live with unique intent; placement rules verified; no thin/duplicate pages.

---

## Phase 5: Audience Pages (plan Phase E)

**Goal**: One shared audience system rendering all six pages, each in its own language with matched CTAs.

**Independent Test**: Open each audience page; confirm distinct situation/concerns, relevant-service links, an audience Growth Graph variant and a matched CTA label.

- [X] T038 [US5] Create the audience route template `src/pages/who-we-help/[audience].astro` via `getStaticPaths` over `audiences.ts`.
  - Refs FR-017, contracts/routes.md · Deps Gate C · Parallel none · Validate build (6 routes) · Done when all six audience routes generate.
- [X] T039 [P] [US5] Author the six audience records (situation, language, concerns, desired outcomes, relevant services, objections, matched action label) in playbook voice.
  - Refs FR-017/035/042, content uniqueness · Deps T038 · Parallel T041 · Validate content-lint + uniqueness test · Done when six distinct audiences read in their own language.
- [X] T040 [US5] Add the audience-appropriate Growth Graph variant and cross-links to the specific services each audience buys plus the overview.
  - Refs FR-018 · Deps T038/T039 · Parallel none · Validate link-integrity + reduced-motion e2e · Done when each audience links its own services and graph variant.
- [X] T041 [P] [US5] Add tests: distinct situations, matched CTA labels equal their destinations, valid service refs.
  - Refs SC-013, plan Testing strategy · Deps T038 · Parallel T039 · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate E)**: Six audience pages each self-identify a distinct situation and end on a matched CTA.

---

## Phase 6: How It Connects, Map Your Stack & Consultation Journeys (plan Phase F)

**Goal**: The education hub, the interactive front door, and the full consultation/contact/newsletter conversion journey with honest states.

**Independent Test**: Read How It Connects without motion; complete Map Your Stack and carry the selection into the form; submit the consultation and reach the honest confirmation; force a failure and see recovery with no false success.

- [X] T042 [US3] Extend the existing `src/pages/how-it-connects.astro` + `src/data/howItConnects.ts` (migrated in T017) into the full educational hub (five links, worked Growth Graph examples, anatomy of a disconnected sale, self-check), understandable without motion.
  - Refs FR-019, SC-012, research.md D10 · Deps Gate A (incl. T017/T018), T022 · Parallel none · Validate no-JS + render e2e; regression-guarded by T018 · Done when the page is fully readable without animation and existing behaviour regresses clean.
- [X] T043 [US3] Present the Growth Graph Review offer as a genuine diagnostic (map, gaps, next steps, starting scope), not an instant revenue estimate or disguised sales call.
  - Refs FR-022 · Deps T042 · Parallel none · Validate copy-lint (claim safety) · Done when framing is diagnostic and claim-safe.
- [X] T044 [US2] Extend the existing `src/pages/map-your-stack.astro` (migrated in T017), reusing `StackGraph.astro`, `stackEval.ts`, `stackRules.ts`, `stackTools.ts` (semantic fieldset/legend, real checkboxes) and preserving current behaviour.
  - Refs FR-023, contracts/map-your-stack.md, research.md D10 · Deps Gate A (incl. T017/T018) · Parallel none · Validate a11y + render e2e; regression-guarded by T018 · Done when nine tools select accessibly, drive the graph, and the existing tool regresses clean.
- [X] T045 [US2] Extend/confirm the pure rule evaluation and scoring in `src/lib/stackEval.ts` (in place/gap/not relevant, OR-groups, zero-relevant safe, bands at 0/40/70/100, top-3 gaps, top-2 working, priority order).
  - Refs FR-023, contracts/map-your-stack.md · Deps T044 · Parallel none · Validate `tests/unit/stackeval.test.ts`; regression-guarded by T018 · Done when all boundary cases pass.
- [X] T046 [US2] Extend the live graph + reveal: solid vs gap links distinct beyond colour, reveal gated at ≥2 tools, result announced via live region, reduced-motion final state, graph text equivalent; no invented figures.
  - Refs FR-023/024/045/048 · Deps T044/T045 · Parallel none · Validate a11y + reduced-motion e2e; honesty lint · Done when gaps read as opportunities and meaning is text-available.
- [X] T047 [US1] Extend the existing consultation form `src/components/forms/BookingForm.astro` + `src/lib/booking.ts` (migrated in T017) to: required name/work-email/business/privacy, no budget field, blur+submit validation with accessible errors, honeypot, explicit submitting state (no duplicate submit), provider-neutral never-false-success submission, email fallback.
  - Refs FR-026/027, contracts/consultation-form.md, research.md D10 · Deps Gate A (incl. T017/T018) · Parallel none · Validate `tests/unit/booking.test.ts`; regression-guarded by T018 · Done when submitting/accepted/failure states behave, no false success occurs, and existing form behaviour regresses clean.
- [X] T048 [US1] Extend the honest confirmation (three outcomes, no time promise) and recoverable-failure state; document the data flow (no server-side storage; email delivery via the form processor) and Privacy disclosure hook.
  - Refs FR-028/047, SC-010 · Deps T047 · Parallel none · Validate confirmation e2e · Done when confirmation carries the three-outcomes message and answers persist on failure.
- [X] T049 [US1] Add the `/contact` route `src/pages/contact.astro` (name, work email, message; shared submission path; no qualification fields or handoff).
  - Refs FR-029, contracts/consultation-form.md · Deps T047 · Parallel none · Validate contact submit e2e · Done when `/contact` posts on the shared never-false-success path.
- [X] T050 [P] Implement the newsletter opt-in with submitting/success/error states behind `PUBLIC_NEWSLETTER_ENDPOINT`; the footer omits it until configured (confirmed double opt-in).
  - Refs FR-050 · Deps T013/T047 · Parallel T052 · Validate newsletter state test · Done when the opt-in is absent unconfigured and honest when enabled.
- [X] T051 [US2] Implement the allowlist-parsed optional handoff from Map Your Stack to `/book-a-call` (prefills the context field; page works with no parameter; tamper-safe). Depends on the consultation form (T047).
  - Refs FR-025, SC-009, Edge Cases · Deps T045, T047 · Parallel none · Validate handoff + tamper e2e · Done when a valid selection prefills the extended form and unknown values are ignored.
- [X] T052 [P] Author the dedicated 404 state in `src/pages/404.astro`: on-brand customer-facing copy, descriptive links to Home and the consultation (`/book-a-call`), `noindex` meta, and confirm sitemap exclusion (with T015/`astro.config.mjs`).
  - Refs FR-030, Edge Cases (unknown route), contracts/routes.md · Deps Gate A (incl. T017), T015 · Parallel T050 · Validate 404 render + noindex + sitemap-exclusion e2e · Done when 404 shows on-brand copy, links to Home and consultation, is `noindex`, and is absent from the sitemap.
- [X] T053 [P] Add/extend tests: `stackeval`, `booking` (submitting, never-false-success, contact, newsletter), handoff allowlist, accessible form errors, 404 state.
  - Refs plan Testing strategy · Deps T045–T052 · Parallel T050 · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate F)**: Both interactives are accessible and honest; consultation and contact never fake success; the handoff runs against the extended form; newsletter is honestly deferred; the 404 state is on-brand, noindex and sitemap-excluded.

---

## Phase 7: Work, Insights, About, FAQ & Utility Pages (plan Phase G + H)

**Goal**: Editorial proof and authority surfaces plus About, FAQ and legal shells, all honest and owner-content-dependent with safe fallbacks.

**Independent Test**: Filter Work with no match (honest empty state); open a case study (six-part, no invented figures); open an article (question title, honest H1, sources, cluster links); read About and FAQ.

- [X] T054 [US6] Build the Work index `src/pages/work/index.astro` with capability and audience filters, an honest empty state, and an honest interim state while proof is limited.
  - Refs FR-031, SC-007, Edge Cases · Deps Gate A, T010 · Parallel none · Validate empty-state e2e · Done when filters resolve and empty combinations show an honest message.
- [X] T055 [US6] Build the case-study template `src/pages/work/[slug].astro` from `content/work` (six-part narrative, scoped graph, related-service links, permission state).
  - Refs FR-031 · Deps T054 · Parallel none · Validate schema + render test · Done when a case study renders the six-part structure with a scoped graph.
- [X] T056 [P] [US6] Add anonymized proof with placeholder connection-map art carrying honest alt text (never implies a real client/result); no invented figures anywhere.
  - Refs FR-037/048, SC-007 · Deps T055 · Parallel T062 · Validate honesty lint + alt-text check · Done when anonymized art is honest and figure-free.
- [X] T057 [US7] Build the Insights index `src/pages/insights/index.astro` with topic categories and canonicalised category/tag views (not indexable thin pages).
  - Refs FR-032/040 · Deps Gate A, T010 · Parallel none · Validate canonical test · Done when filtered views canonicalise to the base index.
- [X] T058 [US7] Build the article template `src/pages/insights/[slug].astro` (question title, honest H1, key points, plain answer, pitfalls without fear language, self-check, sources, last-reviewed date, cluster links to 1 capability + 1 audience + 2 articles).
  - Refs FR-032, contracts/content-schemas.md · Deps T057 · Parallel none · Validate schema + link-rule test · Done when an article satisfies the cluster link rule and carries sources + review date.
- [X] T059 [US8] Build About `src/pages/about.astro` (two-audience story, operating philosophy, plain five-step process, honest credentials; real people/photos where available, no invented awards/counts/superlatives).
  - Refs FR-033, SC-007 · Deps Gate A · Parallel none · Validate copy-lint (no superlatives) · Done when About reads honestly with safe fallbacks for missing assets.
- [X] T060 [P] Build the FAQ hub `src/pages/faq.astro` with single-open accordions (expanded state maintained, accessible).
  - Refs FR-034 · Deps T012 · Parallel T061 · Validate accordion a11y e2e · Done when the hub is keyboard-operable with announced state.
- [X] T061 [P] Build utility/legal shells `src/pages/privacy.astro`, `cookies.astro`, `terms.astro` (interface copy) with the Privacy data-handling disclosure (no server-side storage; email delivery; retention).
  - Refs FR-047, Assumptions (legal deferred) · Deps Gate A · Parallel T060 · Validate render test · Done when shells ship interface copy and Privacy discloses the enquiry data flow.
- [X] T062 [P] Add tests: content-collection schema shape, Work/Insights empty and canonical states, no-invented-figures lint.
  - Refs plan Testing strategy · Deps T055/T058 · Parallel T056 · Validate `npm run test` · Done when tests pass.

**Checkpoint (Gate G/H)**: Editorial surfaces are honest and schema-valid; About/FAQ/legal shells ship with safe fallbacks; no invented proof.

---

## Phase 8: SEO, Accessibility, Security, Performance & Testing (cross-cutting, plan Phase I part 1)

**Purpose**: Apply and verify the cross-cutting quality gates (US9) across every page type built so far.

- [ ] T063 Run the per-page metadata sweep across all page types (single H1 with the main promise, logical heading order, unique title/description, one canonical; filtered views canonicalise).
  - Refs FR-039/040, SC-011 · Deps Phases 2–7 · Parallel T064/T065 · Validate `tests/unit/seo.test.ts` + audit · Done when every indexable page satisfies the metadata contract.
- [ ] T064 [P] Apply and validate visible-only structured data across page types (Organization, WebSite, WebPage, BreadcrumbList, Article, Service/Product where visible).
  - Refs FR-040, contracts/seo-metadata.md · Deps Phases 2–7 · Parallel T063/T065 · Validate schema test · Done when schema matches visible content only.
- [ ] T065 [P] Verify the sitemap (public routes, excludes 404) and robots allowlist end to end.
  - Refs FR-041 · Deps Phase 1 · Parallel T063/T064 · Validate robots/sitemap test · Done when allow/block and exclusion verify on the build.
- [ ] T066 [US9] Run the accessibility gate: axe WCAG 2.2 AA on audited page types, keyboard operability (chrome, both islands, forms, accordions, tabs), outline focus, live regions, contrast matrix, and the alt-text policy.
  - Refs FR-044/048, SC-005 · Deps Phases 2–7 · Parallel none · Validate `tests/e2e` axe + keyboard · Done when audited pages pass AA with no colour-only meaning.
- [ ] T067 [US9] Run the responsive gate at 320/360/390/768/1024/desktop: no horizontal scroll, 44px targets, radial ≥720 / vertical <720, primary CTA never buried.
  - Refs FR-046, SC-008 · Deps Phases 2–7 · Parallel none · Validate responsive e2e + screenshots · Done when every page is overflow-free from 320px up.
- [ ] T068 [US9] Verify no-JS and reduced-motion parity across pages and both islands (all meaning present; final states shown).
  - Refs FR-045, SC-012 · Deps Phases 2–7 · Parallel none · Validate no-JS + reduced-motion e2e · Done when meaning is equivalent without JS/motion.
- [ ] T069 [P] Run the security gate: CSP verified against the consultation and contact submit paths, headers present, zero third-party JS at load, allowlist handoff, no hardcoded secrets or committed enquiry data.
  - Refs FR-047/049, contracts/security-headers.md · Deps Phase 1, Phase 6 · Parallel T070/T071/T072 · Validate header/CSP check · Done when submissions succeed under CSP and no secret is exposed.
- [ ] T070 [P] Run the performance gate: build asset sizes vs budgets (JS 30/50 KB, CSS 40 KB, fonts 200 KB, LCP image 150 KB, initial page 500 KB), Lighthouse mobile 90+, CWV; document any overage.
  - Refs FR-051, contracts/performance-budgets.md, SC-006 · Deps Phases 2–7 · Parallel T069/T071/T072 · Validate Lighthouse + size check · Done when budgets are met or overage is documented with exact scores.
- [ ] T071 [P] Run the copy-honesty lint across data modules and rendered output (no em dashes, superlatives, buzzwords, flagged claims, invented figures).
  - Refs FR-036/037, SC-007 · Deps Phases 2–7 · Parallel T069/T070/T072 · Validate content-lint test · Done when the ban list is clean sitewide.
- [ ] T072 [P] Capture visual-QA screenshots at 1440/1024/768/390/360 (reducedMotion) for key page types and both islands' states; confirm native feel, distinct gap vs active links, no overflow/overlap/clipping, no false-audit claims.
  - Refs quickstart.md Screenshot QA · Deps Phases 2–7 · Parallel T069/T070/T071 · Validate manual screenshot review · Done when all captures are clean.

**Checkpoint (Gate I-1)**: All cross-cutting gates green; exact Lighthouse/CWV recorded; a11y, security and honesty verified.

---

## Phase 9: Final Integration, Content Validation & Convergence (plan Phase I part 2)

**Purpose**: End-to-end validation, internal-link and CTA integrity, owner-dependency audit, Definition of Done, and convergence.

- [ ] T073 Run the full `quickstart.md` validation (all nine scenarios) against the production build/preview.
  - Refs quickstart.md · Deps Gate I-1 · Parallel none · Validate `npm run build` + preview walkthrough · Done when every scenario passes.
- [ ] T074 Validate cross-artifact content integrity: all internal links resolve, CTA labels match destinations, breadcrumbs correct, no dead ends in any core journey.
  - Refs FR-006/042, SC-013 · Deps Gate I-1 · Parallel none · Validate link/CTA integrity test · Done when journeys end on a reachable matching CTA.
- [ ] T075 Audit owner-supplied dependencies and honest fallbacks (fonts, proof, people/photos, legal, `PUBLIC_*` endpoints); confirm nothing structural is blocked.
  - Refs Assumptions, plan Owner-supplied dependencies · Deps Gate I-1 · Parallel none · Validate fallback review · Done when every missing asset degrades honestly.
- [ ] T076 Verify the Definition of Done against the constitution's fourteen principles (mobile, speed/budgets, design coherence, humanized copy, SEO, a11y, security, tests, build/lint, no stray placeholders, documented performance).
  - Refs §XIV, plan Constitution Check · Deps T073–T075 · Parallel none · Validate DoD checklist · Done when all gates verify.
- [ ] T077 Run `/speckit-converge` to assess the build against spec/plan and append any residual work as new tasks.
  - Refs plan Phase I, CLAUDE.md workflow · Deps T076 · Parallel none · Validate converge report · Done when residual work is recorded.

**Checkpoint (Final)**: Site meets the spec and the Definition of Done; residual work and owner-dependency gaps are recorded.

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 (Foundation)**: no dependencies; blocks all later phases.
- **Phase 2 (Homepage/Graph)**: after Gate A.
- **Phase 3 (Capabilities)**: after Gate A (independent of Phase 2).
- **Phase 4 (Services)**: after Gate C (needs the capability system).
- **Phase 5 (Audiences)**: after Gate C (independent of Phase 4).
- **Phase 6 (Journeys)**: after Gate A; the graph tasks benefit from Phase 2's `growthGraph.ts`.
- **Phase 7 (Editorial/utility)**: after Gate A; owner-content-dependent (safe fallbacks otherwise).
- **Phase 8 (Cross-cutting gates)**: after Phases 2–7 exist.
- **Phase 9 (Convergence)**: after Gate I-1.

### Story dependencies

- **US1** (convert): Phases 2 + 6. **US2** (Map Your Stack): Phase 6. **US3** (Growth Graph/How It Connects): Phases 2 + 6. **US4** (capabilities/services): Phases 3 + 4. **US5** (audiences): Phase 5. **US6/US7/US8** (Work/Insights/About): Phase 7. **US9** (cross-cutting quality): Phase 8. Each story is independently testable once its phase completes.

### Within a phase

Tests-first for pure logic (rules, scoring, SEO, booking) where practical; data modules before templates; templates before copy; copy before per-page validation.

---

## Parallel Opportunities

- **Phase 1**: T002/T003 (styles) ∥; T005–T010 (data/content contracts) ∥; T014/T015/T016 (SEO/robots/headers) ∥.
- **Phase 2**: T021 ∥ T025; T026 ∥ T025.
- **Phase 3**: T029/T030/T032 ∥.
- **Phase 4**: T035 ∥ T036.
- **Phase 5**: T039 ∥ T041.
- **Phase 6**: T050 (newsletter) ∥ T052 (404); T053 (tests) after T045–T052. Note: T051 (handoff) is sequential after T047 (consultation form).
- **Phase 7**: T056, T060, T061, T062 ∥.
- **Phase 8**: T063/T064/T065 ∥; T069/T070/T071/T072 ∥.
- **Across phases**: after Gate A, Phase 2, Phase 3 and Phase 7 can proceed in parallel by different people; Phase 5 parallels Phase 4 after Gate C.

---

## Critical Path

Gate A foundation (**T001→T004→T011→T013→T017→T018**) → capability system (**T027→T028**) → launch services (**T006 catalogue →T033→T034**) → consultation + interactives (**T047→T048** consultation form then confirmation; **T044→T045→T046→T051** Map Your Stack then handoff, where the handoff T051 depends on the form T047) → cross-cutting gates (**T066, T067, T070**) → convergence (**T073→T076→T077**). Phases 2, 5 and 7 branch off Gate A / Gate C and rejoin at Phase 8, so they are not on the critical path if staffed in parallel.

---

## Implementation Strategy

### MVP first (US1 core convert)

1. Phase 1 (Foundation) → Gate A.
2. Phase 2 (Homepage + Growth Graph) and the Phase 6 consultation tasks (T047–T049) → an understandable homepage that converts.
3. **STOP and validate** the convert journey (SC-001, SC-002, SC-010), then demo.

### Incremental delivery

Gate A → Homepage (US1/US3) → Map Your Stack + consultation (US2/US1) → Capabilities (US4) → Services (US4) → Audiences (US5) → Editorial (US6/US7/US8) → cross-cutting gates (US9) → converge. Each phase is an independently testable increment behind its gate.

### Notes

- `[P]` = different files, no incomplete dependency. `[Story]` maps to spec.md user stories.
- Tests for pure logic are written before implementation where practical; regression tests lock the existing islands and form.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
- Never fake form success; never commit `.env`, submitted data, secrets or PII screenshots; never expose provider secrets client-side beyond the public form endpoint.
