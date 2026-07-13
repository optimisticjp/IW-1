# Project Checklist: Infinite Weblinks Multipage Website Restructure

**Purpose**: Requirements-quality gate ("unit tests for English") validating that the spec, plan, research, data model and contracts are complete, clear, consistent, measurable and ready for `/speckit-tasks`. Items test the requirements, not an implementation.
**Created**: 2026-07-11
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Contracts**: [contracts/](../contracts/)

**How to read**: each item is a question about requirement quality. `[Gap]`, `[Ambiguity]`, `[Conflict]` and `[Assumption]` mark items where writing this checklist surfaced a probable weakness to resolve before task generation. Dimension tags: Completeness, Clarity, Consistency, Measurability, Coverage, Traceability.

## A. Page & Route Coverage

- [x] CHK001 Is the full set of page types enumerated with a route, page type and canonical rule for each? [Completeness, contracts/routes.md]
- [x] CHK002 Are all nine page groups (core, capability, service, audience, work, insights, conversion, utility, legal) represented in the route table without a group left undefined? [Coverage, contracts/routes.md]
- [x] CHK003 Is every real service from source scope mapped to exactly one capability, with a stated rule that services lacking unique intent become anchored sections rather than pages? [Completeness, Spec §FR-015, §SC-003]
- [x] CHK004 Are the utility and legal routes (`/about`, `/faq`, `/contact`, `/privacy`, `/cookies`, `/terms`, `/404`, `/robots.txt`, sitemap) each specified with a page type and index policy? [Completeness, contracts/routes.md]
- [x] CHK005 Is the distinction between `/book-a-call` and `/contact` (purpose, content, and why both exist) unambiguously specified? [Resolved 2026-07-11 → Spec §FR-029, contracts/consultation-form.md: book-a-call = primary consultation with qualification + handoff; contact = lighter general enquiry, shared never-false-success path]

## B. Service Pages — Launch Set & Phasing

- [x] CHK006 Are the seven launch service pages named exactly and each mapped to a parent capability? [Completeness, Spec §Assumptions, contracts/routes.md]
- [x] CHK007 Is the phasing rule for the remaining dedicated pages ("phase in by intent; remain anchored capability sections until built") stated with an objective trigger for promotion to a page? [Clarity, Spec §Assumptions]
- [x] CHK008 Are canonical-placement rules (Landing Pages under Convert; CRM under Connect; AI-search a section of SEO; testing canonical on CRO; Amazon under Paid Advertising) specified unambiguously and free of conflict with the service list? [Consistency, Spec §FR-016, data-model.md]
- [x] CHK009 Is the criterion that distinguishes a "dedicated page" from an "anchored section" (unique buyer intent, distinct problem, own specialist detail and FAQs) measurable rather than subjective? [Measurability, Spec §FR-015]

## C. Content Voice, Audience Fit & Brand Consistency

- [x] CHK010 Is the plain-English two-layer copy structure (business meaning first, optional specialist detail) defined as a testable requirement for every page type? [Clarity, Spec §FR-035]
- [x] CHK011 Is the banned-language list (em dashes, named superlatives, named buzzwords, fear framing, tool-before-problem) enumerated specifically enough to be checked automatically? [Measurability, Spec §FR-036]
- [x] CHK012 Are the two fixed brand promises quoted verbatim and required to be used consistently? [Consistency, Spec §FR-038]
- [x] CHK013 Is the claim-safety rule ("can help"/"makes it easier to"; no guaranteed result) accompanied by the explicit list of prohibited claims and figures? [Completeness, Spec §FR-037, §SC-007]
- [x] CHK014 Is the copy source of truth (Master Website Playbook, then canonical brief) and its precedence over invented copy stated? [Traceability, Spec §Overview]

## D. Content Uniqueness & Non-Duplication

- [x] CHK015 Is a requirement stated that the six capability pages share a section sequence but differ in colour, problems, specialist list, proof and FAQ, with a way to verify non-identical content? [Consistency, Spec §FR-012]
- [x] CHK016 Is per-page distinctive wording required (no repeated template copy) across capability, service and audience pages? [Completeness, Spec §FR-035]
- [x] CHK017 Is the "no thin or duplicate pages" outcome defined with an objective check (zero duplicates; overlapping services merge to a parent)? [Measurability, Spec §SC-003]

## E. Consultation Journey

- [x] CHK018 Are the required fields (name, work email, business name, privacy) and the optional/qualifying fields each listed, with budget explicitly excluded? [Completeness, Spec §FR-026, contracts/consultation-form.md]
- [x] CHK019 Is the honest confirmation copy specified verbatim with the three-outcomes expectation and no response-time promise? [Clarity, Spec §FR-028]
- [x] CHK020 Is the never-false-success rule and the failure recovery path (preserve answers, retry, email fallback) unambiguous for the unconfigured, server-failure and network-throw cases? [Coverage, Spec §FR-027, §SC-010]
- [x] CHK021 Is the Map Your Stack → consultation prefill requirement (allowlist-parsed, optional, works with no parameter) specified for both presence and absence of the parameter? [Coverage, Spec §FR-025, §SC-009]
- [x] CHK022 Are data-handling and retention expectations for a submitted enquiry (where it is delivered, whether/where it is stored, retention) specified? [Resolved 2026-07-11 → Spec §FR-047, contracts/consultation-form.md: no server-side storage; delivered by email via the form processor; retained per processor + owner inbox; disclosed on Privacy]

## F. Map Your Stack Journey

- [x] CHK023 Is the nine-tool set and each tool's helper text defined, with each tool mapped to a Growth Graph node? [Completeness, contracts/map-your-stack.md]
- [x] CHK024 Are the rule-evaluation states (in place / gap / not relevant) and OR-group semantics defined unambiguously? [Clarity, Spec §FR-023, data-model.md]
- [x] CHK025 Are the score bands and their exact boundary behaviour at 0, 40, just-above-40, 70, just-above-70 and 100 percent specified, including the zero-relevant safe case? [Measurability, contracts/map-your-stack.md]
- [x] CHK026 Are the result caps (top 3 gaps, top 2 working, priority order preserved) and the ≥2-tools reveal gate specified? [Completeness, contracts/map-your-stack.md]
- [x] CHK027 Is the honesty requirement (no invented statistics, no revenue-leak figures, no "your business is broken" framing, present connections affirmed) stated as a checkable rule? [Coverage, Spec §FR-024]
- [x] CHK028 Is the "not a technical audit" honesty line required and its wording fixed? [Clarity, Spec §FR-024]

## G. Growth Graph Behaviour & Content

- [x] CHK029 Are the five goals named (including "Save team time") and each required to have a text caption announced on change? [Completeness, Spec §FR-021]
- [x] CHK030 Is the "one model, many depths" requirement (homepage, How It Connects, Review, capability, audience, case study variants) specified with a consistent node language and accessibility contract? [Consistency, Spec §FR-020]
- [x] CHK031 Is the requirement that graph links represent only real relationships (no invented connections) stated? [Clarity, Spec §FR-020, data-model.md]
- [x] CHK032 Is the radial-vs-vertical layout switch defined with an explicit breakpoint (≥720px radial, <720px vertical)? [Measurability, contracts/map-your-stack.md]
- [x] CHK033 Is the Growth Graph Review framed as a genuine diagnostic (map, gaps, next steps, starting scope) and explicitly not an instant revenue estimate or disguised sales call? [Clarity, Spec §FR-022]

## H. Navigation, Breadcrumbs, Internal Linking & Footer

- [x] CHK034 Are the six primary nav items, the primary CTA, and the mega-menu contents (six capabilities + descriptors + top service links + overview link) fully specified? [Completeness, Spec §FR-001, §FR-002]
- [x] CHK035 Is the mobile navigation behaviour (full-height, focus-trapped, Escape-dismissible, flattened groups, pinned CTA, announced state) specified? [Coverage, Spec §FR-003]
- [x] CHK036 Are breadcrumb rules (present below top level, current page a non-link, matched by BreadcrumbList schema) specified consistently with the SEO contract? [Consistency, Spec §FR-005, contracts/seo-metadata.md]
- [x] CHK037 Are internal-linking rules (capability→services; service→siblings+audiences; article→1 capability+1 audience+2 articles; descriptive link text) specified and verifiable against dangling references? [Completeness, Spec §FR-006, data-model.md]
- [x] CHK038 Is the footer content (brand block, primary CTA, four link columns, newsletter opt-in, legal row) fully enumerated? [Completeness, Spec §FR-004]

## I. Responsive Behaviour

- [x] CHK039 Are the audited breakpoints (360, 390, 768, 1024, desktop) and the 320px no-overflow hard floor both specified as requirements? [Completeness, Spec §FR-046, §SC-008]
- [x] CHK040 Is behaviour at exactly 320px specified beyond "no horizontal scroll" (e.g., that all core tasks and the primary CTA remain reachable)? [Clarity, Spec §SC-008]
- [x] CHK041 Is a credible mobile equivalent required for every desktop experience (navigation, both interactives, forms, proof, editorial layouts)? [Coverage, Spec §FR-046, §SC-008]
- [x] CHK042 Are minimum touch-target size (44px) and "primary CTA never buried" stated as measurable requirements? [Measurability, Spec §FR-046]

## J. Motion, Reduced-Motion & No-JavaScript

- [x] CHK043 Are motion families limited to two (Connect, Reveal) with a rule that every animation must explain a relationship, journey or changing state? [Clarity, Spec §FR-045]
- [x] CHK044 Are the off-screen pause, hidden-tab pause/resume-without-replay, and single-permitted-loop (node pulse) behaviours specified? [Coverage, Spec §FR-045, Edge Cases]
- [x] CHK045 Is the reduced-motion requirement (collapse to final states, equivalent meaning, captions/results as text) specified for both interactives and page entrances? [Completeness, Spec §FR-045, §US9]
- [x] CHK046 Is the no-JavaScript requirement (all meaningful content and the core message present; interactives degrade to readable static states) specified for every page? [Coverage, Spec §FR/§SC-012]

## K. Accessibility (WCAG 2.2 AA)

- [x] CHK047 Is WCAG 2.2 AA stated as the target, and is its relationship to the constitution's 2.1 AA baseline noted so the raised bar is intentional, not a conflict? [Consistency, Spec §SC-005, plan.md Constitution Check]
- [x] CHK048 Are keyboard operability requirements enumerated for header, mega-menu, mobile sheet, tabs, accordions, both interactives and forms? [Coverage, Spec §US9]
- [x] CHK049 Is "visible focus as an outline independent of shadow" required everywhere, and is the contrast matrix (no white text on bright non-Build fills) specified? [Clarity, Spec §FR-044]
- [x] CHK050 Are live-region announcement requirements specified for graph state, tool state and form validation changes? [Completeness, Spec §US9, §FR-021]
- [x] CHK051 Are accessible form-error requirements (icon plus text, never colour alone, associated with the field) specified? [Coverage, Spec §FR-027]
- [x] CHK052 Are alternative-text requirements defined for the Growth Graph/Map Your Stack SVGs and for anonymized placeholder connection-map art (meaningful vs decorative)? [Resolved 2026-07-11 → Spec §FR-048, contracts/seo-metadata.md "Images & alternative text", contracts/map-your-stack.md graph text equivalent]

## L. Technical SEO, Metadata, Schema, Sitemap & Crawler Policy

- [x] CHK053 Are per-page metadata requirements (single H1 with the main promise, logical heading order, unique title and meta description, one canonical) specified for every indexable page? [Completeness, Spec §FR-039, §SC-011]
- [x] CHK054 Is the canonicalisation rule for filtered Work and Insights views (to their base index; not indexable thin pages) specified consistently across spec and contracts? [Consistency, Spec §FR-040, contracts/seo-metadata.md]
- [x] CHK055 Is the visible-only structured-data rule (Organization, WebSite, WebPage, BreadcrumbList, Article, Service/Product only where visible) specified, prohibiting schema for off-page content? [Clarity, Spec §FR-040]
- [x] CHK056 Is the crawler policy specified with named agents to allow (search + AI-citation incl. OAI-SearchBot) and to block (GPTBot, CCBot, Google-Extended), plus sitemap-includes-public-routes and excludes-404? [Completeness, Spec §FR-041, contracts/seo-metadata.md]
- [x] CHK057 Are the approved title and meta-description patterns defined concretely enough to produce a unique, checkable value per page? [Measurability, Spec §FR-039]

## M. Form Validation, Privacy, Security & Submission States

- [x] CHK058 Are validation triggers (on blur and on submit) and per-field validation rules (email format, url when present, privacy must be true) specified? [Completeness, Spec §FR-027, contracts/consultation-form.md]
- [x] CHK059 Is spam protection (honeypot, silent drop) specified without weakening the never-false-success guarantee? [Consistency, contracts/consultation-form.md]
- [x] CHK060 Is the secrets rule (endpoint injected via `PUBLIC_BOOKING_ENDPOINT`, never hardcoded; no secret in logs/commits) stated as a security requirement? [Coverage, Spec §Assumptions, §IX]
- [x] CHK061 Is handoff-parameter tampering handled by an allowlist so unknown/malicious values are ignored and cannot inject content? [Coverage, Spec §Edge Cases]
- [x] CHK062 Are security-header / CSP expectations for the static site and its single external form endpoint specified? [Resolved 2026-07-11 → Spec §FR-049, contracts/security-headers.md: CSP scoped to self + form-endpoint origin, nosniff, Referrer-Policy, Permissions-Policy, HSTS via `public/_headers`]
- [x] CHK063 Is the newsletter opt-in required to be separate from the enquiry, and are its own submitting/success/error states specified (or a launch deferral recorded)? [Resolved 2026-07-11 → Spec §FR-050: deferred until `PUBLIC_NEWSLETTER_ENDPOINT` is configured (footer omits it until then); submitting/success/error states + confirmed double opt-in defined for when enabled]

## N. Honest Proof & Anonymized Work

- [x] CHK064 Is the case-study six-part structure (situation, obstacle, experience, change, improvement, one lesson) required with a scoped graph and related-service links? [Completeness, Spec §FR-031]
- [x] CHK065 Is the quantitative-result rule (only with a defensible baseline, period and source; otherwise a verified qualitative change) specified with no invented figures anywhere? [Clarity, Spec §FR-037, §SC-007]
- [x] CHK066 Are the interim/anonymized presentation rules (honest empty states, placeholder connection-map art instead of fabricated screenshots, the site's own execution as proof) specified? [Coverage, Spec §US6, §Edge Cases]
- [x] CHK067 Is the permission-state model (named / anonymized / interim) defined so proof can be published progressively without dishonesty? [Completeness, data-model.md]

## O. Performance — Image, SVG, Font & JavaScript

- [x] CHK068 Is the Lighthouse mobile target (90+, best effort 95+) stated with the audited page types, and is a policy against fabricating scores included? [Measurability, Spec §SC-006, quickstart.md]
- [x] CHK069 Is the font strategy (self-hosted subset WOFF2, `font-display: swap`, system fallback until supplied) specified to prevent layout shift and blocking? [Completeness, plan.md, research.md]
- [x] CHK070 Are image and SVG optimisation requirements (lazy non-critical assets, no layout shift, responsive/optimised SVG) specified concretely rather than as "minimise"? [Clarity, Spec §FR-043, plan.md]
- [x] CHK071 Is a quantified JavaScript/asset budget defined? [Resolved 2026-07-11 → Spec §FR-051, contracts/performance-budgets.md: JS ≤30/50 KB, CSS ≤40 KB, fonts ≤200 KB, LCP image ≤150 KB, initial page ≤500 KB, zero third-party JS, CWV targets]
- [x] CHK072 Is the requirement to add no new runtime dependencies (no framework, no animation library, no CSS framework, no Google Fonts) stated as a constraint? [Consistency, plan.md Constitution Check]

## P. UI States — Loading, Success, Error, Empty & Unavailable

- [x] CHK073 Are success, error and empty states specified for the form, for Work/Insights empty filters, and for the no-input tool state? [Completeness, Spec §FR-030]
- [x] CHK074 Are in-flight/loading states specified for the consultation submission (a "submitting" state)? [Resolved 2026-07-11 → Spec §FR-027, contracts/consultation-form.md "Submission states": accessible submitting state, `aria-busy`, progress as text, repeat activation ignored (no duplicate submit)]
- [x] CHK075 Is the "unavailable/unconfigured" state (delivery not configured or failing; honest interim proof) distinguished from the error state and specified? [Clarity, Spec §Edge Cases]
- [x] CHK076 Is the 404 state (on-brand, noindex, excluded from sitemap, links to Home and consultation) specified as its own state? [Coverage, Spec §FR-030]

## Q. Testing Requirements Coverage

- [x] CHK077 Does the testing strategy name the required layers (unit, integration, browser, accessibility, responsive, no-JS/reduced-motion, visual, performance) with what each must cover? [Completeness, plan.md, quickstart.md]
- [x] CHK078 Are the pure-logic units to be tested first (rules, scoring, bands, geometry, SEO/schema, booking validation/adapter, content-schema shape, link integrity) enumerated? [Coverage, plan.md]
- [x] CHK079 Are regression requirements (existing homepage Growth Graph, goal tabs, book-a-call, navigation still work) stated so the migration cannot silently break them? [Coverage, plan.md Risks]
- [x] CHK080 Are the visual-QA breakpoints and captured states enumerated with the reduced-motion capture note? [Clarity, quickstart.md]

## R. Owner-Supplied Assets & Launch Dependencies

- [x] CHK081 Are all owner-supplied dependencies (Geist fonts, `PUBLIC_SITE_URL`, `PUBLIC_BOOKING_ENDPOINT`, real work, permissioned case studies, testimonials, credentials, people/photography, legal wording) enumerated with an honest fallback for each? [Completeness, Spec §Assumptions, plan.md]
- [x] CHK082 Is it explicit that these dependencies are not structural blockers (the site behaves honestly until they arrive)? [Clarity, Spec §Assumptions]
- [x] CHK083 Are the later/optional decisions (scheduler provider, response-time window, newsletter provider) clearly separated from launch scope? [Consistency, Spec §Assumptions, §FR-029]
- [x] CHK084 Is legal-wording deferral (interface copy only; jurisdiction-reviewed wording out of scope) stated so `/privacy`, `/cookies`, `/terms` are not treated as complete? [Coverage, Spec §Assumptions]

## S. Phase Gates & Completion Criteria

- [x] CHK085 Are the implementation phases defined with explicit dependencies and a review gate per phase? [Completeness, plan.md Implementation phases]
- [x] CHK086 Is each phase gate's exit condition objective (build + check green, relevant tests pass, no overflow, a11y checks, copy-honesty lint, no stray placeholders)? [Measurability, plan.md, quickstart.md]
- [x] CHK087 Is the Definition of Done enumerated and mapped to verifiable checks rather than "it builds"? [Clarity, Spec §XIV, quickstart.md]
- [x] CHK088 Is convergence (`/speckit-converge` to record residual work and owner-dependency gaps) specified as the closing gate? [Coverage, plan.md]

## T. Cross-Cutting Consistency, Ambiguities & Conflicts

- [x] CHK089 Do the capability-to-colour mapping (Convert amber, Scale coral) and the infinity-mark-as-identity reconciliation stay consistent across spec, DESIGN.md and data model with no residual conflict? [Consistency, Spec §Overview, §Assumptions]
- [x] CHK090 Are all FR IDs referenced by success criteria and contracts resolvable (no orphaned or contradicting requirements after the clarification updates to FR-026/028/029/041)? [Traceability, Spec §Clarifications]
- [x] CHK091 Is every measurable outcome (SC-001…SC-013) traceable to at least one functional requirement and one validation scenario? [Traceability, Spec §Success Criteria, quickstart.md]
- [x] CHK092 Are there any remaining `[NEEDS CLARIFICATION]` markers or unresolved owner decisions that would block task generation? [Completeness, Spec §Clarifications]

## Notes

- Check items off as validated: `[x]`. Record findings inline.
- **Resolved (2026-07-11)**: the seven probable weaknesses this checklist surfaced (CHK005, CHK022, CHK052, CHK062, CHK063, CHK071, CHK074) were all closed by the spec refinements — new Spec §FR-047 (enquiry data flow/retention), §FR-048 (alt text), §FR-049 (security headers/CSP), §FR-050 (newsletter states/deferral) and §FR-051 (performance budgets), updated §FR-004/§FR-027/§FR-029, and the new contracts/security-headers.md + contracts/performance-budgets.md. No `[Gap]`/`[Ambiguity]` items remain open.
- The one intentional raised bar (CHK047: WCAG 2.2 AA above the constitution's 2.1 AA baseline) is documented in plan.md's Constitution Check and is a strengthening, not a conflict.
- Traceability: ≥80% of items cite a spec section, contract, plan section, or a `[Gap]/[Ambiguity]/[Conflict]/[Assumption]` marker.
- **Validated (Phase 9, T073–T076)**: every remaining item was confirmed against the delivered build, not just the spec text. Empirical evidence: 40 routes built (39 indexable + 404); full service catalogue of 25 modelled with the 7 launch pages built and 18 phased services reachable via capability section anchors; 6 capability + 6 audience routes; every rendered internal link, CTA and breadcrumb resolves (built-site crawl, `tests/unit/phase9.test.ts`); axe WCAG 2.2 AA clean across all 39 indexable pages; 0 horizontal overflow at 320–1280; no-JS and reduced-motion parity; CSP + security headers verified in the built `public/_headers`; asset budgets met (heaviest page 25.3 KB gzip, 0 third-party JS); CWV lab LCP 68–104 ms / CLS 0; copy-honesty lint clean sitewide. Full suite 239 passing, `astro check` 0 errors, production build green. Owner-supplied assets and jurisdiction legal wording remain honest, clearly-labelled placeholders (not classified as launch-ready) — see the launch-readiness matrix in the Phase 9 report.
