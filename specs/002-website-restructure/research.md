# Phase 0 Research: Infinite Weblinks Multipage Website Restructure

**Feature**: `002-website-restructure` | **Date**: 2026-07-11 | **Plan**: [plan.md](./plan.md)

All Technical Context items are resolved; there are no open NEEDS CLARIFICATION markers (the seven material decisions were settled in the 2026-07-11 clarification session and recorded in the spec). This document records the decisions, their rationale, and the alternatives rejected.

## D1. Rendering architecture

- **Decision**: Keep the current static-first Astro 5 baseline (`output: 'static'`), TypeScript strict, no runtime framework; interactivity limited to progressively-enhanced vanilla-TS islands.
- **Rationale**: Preserves the approved technical baseline (spec Assumptions); a content-led marketing site with two interactive tools does not need SSR, a framework runtime or hydration overhead. Static output gives the best performance floor for the Lighthouse 90+ target and the strongest no-JS resilience.
- **Alternatives rejected**: SSR/hybrid (unneeded, adds a server surface and cost); React/Vue/Svelte islands (violate Principle III and the locked "no framework" guardrail for tooling weight); full SPA (breaks no-JS parity and SEO).

## D2. Content architecture (structured vs editorial)

- **Decision**: Two-layer content model. Structured, repeatable system content (capabilities, services, audiences, FAQs, tools, rules, internal-link maps) lives in typed TS modules under `src/data`. Editorial content (Work case studies, Insights articles) lives in Astro content collections under `src/content` with Zod-validated frontmatter.
- **Rationale**: TS modules give compile-time type safety, easy cross-referencing (service → capability → audience) and direct unit testing for integrity rules, which suits tightly-related structured data. Content collections give editorial authors Markdown/MDX with schema-validated metadata and built-in slug routing, which suits prose that changes independently of code. This split is what lets ~50 pages render from data without repetitive templates.
- **Alternatives rejected**: A CMS/database (banned guardrail; unnecessary for a static site; adds a backend and secrets); all-in-TS for editorial prose (poor authoring ergonomics for long articles); all-in-collections for structured system data (weaker typed cross-referencing and harder to unit-test integrity).

## D3. Reusable page systems

- **Decision**: Thin route files compose shared section-component systems (`src/components/page/*`) from data. One capability template renders all six; one service template renders every dedicated page and, via a `treatment` flag, routes thin-intent services to anchored parent sections; one audience template renders all six; one case-study and one article template render from collections.
- **Rationale**: Directly satisfies "reusable page systems without repetitive template output" and the phased service rollout: adding a page is a data/content edit. Canonical-placement rules (Landing Pages once under Convert, CRM once under Connect, AI-search a section of SEO, testing canonical on CRO, Amazon under Paid Advertising) are enforced centrally in the data layer, not per page.
- **Alternatives rejected**: One bespoke `.astro` per page (repetitive, drift-prone, fails the no-thin-pages rule); a single monolithic mega-template with conditionals (unreadable, hard to test).

## D4. Signature interactive systems (one engine each)

- **Decision**: The Growth Graph is a single model (`growthGraph.ts` + `graphGeometry`/`graphLayout`) rendered by one component with variant props (active nodes, links, goals, captions, layout mode, caption text) across homepage centrepiece, How It Connects spine, Review offer and lighter capability/audience/case-study variants. Map Your Stack reuses the same graph rendering driven by client-side rule evaluation (`stackEval.ts` + `stackRules.ts`).
- **Rationale**: Preserves the established connected-system identity, avoids a second graph engine (guardrail), and keeps the accessibility and reduced-motion contract in one place. Pure evaluation/geometry logic stays in `src/lib` for direct testing, decoupled from the DOM.
- **Alternatives rejected**: Separate graph implementations per context (duplication, divergence risk, doubled a11y surface); a charting library (heavy dependency, wrong abstraction for a relationship map, Principle III breach).

## D5. Motion strategy

- **Decision**: Two families only (Connect, Reveal). CSS-first for reveals, entrances and state transitions gated on a `js-ready` class; small vanilla-TS controllers only inside the two islands for sequenced line-draws, the single permitted node-pulse loop, live state updates, focus/announcement management, and pause-off-screen / pause-on-hidden-tab. `prefers-reduced-motion` collapses both families to final states; no-JS renders final static states.
- **Rationale**: Meets FR-045 exactly, keeps JS minimal (Principle III), and guarantees equivalent meaning across reduced-motion and no-JS conditions (Principle VIII, User Story 9).
- **Alternatives rejected**: An animation library such as GSAP/Framer/Motion One as a dependency (guardrail + Principle III); scroll-jacking/parallax (banned by the constitution on mobile and by the two-family limit); JS-driven reveals without a CSS fallback (would hide content when JS fails).

## D6. Design system implementation

- **Decision**: Hand-authored token CSS implementing DESIGN.md (70% Clay / 30% Stripe): warm cream floor `--canvas`, six capability colours each with `-soft/-deep/-solid/-on/-on-dark` variants, text-safe vs decorative gradients, Geist Sans across all roles + Geist Mono for eyebrows/nodes/signals/data at a 600 weight ceiling, asymmetric editorial layouts, one dark high-impact environment (Growth Graph, footer), outline focus. Self-hosted subset WOFF2 with `font-display: swap` and a system-font fallback until fonts are supplied.
- **Rationale**: A single locked direction satisfies Principle IV (no style soup) and the contrast matrix (FR-044: no white text on bright non-Build fills). Self-hosted fonts avoid the Google-Fonts guardrail and protect performance and privacy.
- **Alternatives rejected**: Tailwind or any CSS framework (guardrail, utility sprawl, larger CSS); Google Fonts CDN (guardrail, third-party request, privacy); runtime CSS-in-JS (needs a framework runtime).

## D7. SEO, schema, sitemap, robots and crawler policy

- **Decision**: Per-page title/description/canonical/single-H1 via the existing `seo.ts` seam; visible-only structured data (Organization, WebSite, WebPage, BreadcrumbList, Article, and Service/Product only where the visible page supports it) via `schema.ts`; `@astrojs/sitemap` including public routes and excluding 404; env-aware `robots.txt.ts` implementing the confirmed crawler allowlist (allow search-discovery and AI-citation crawlers including OAI-SearchBot; block AI-training crawlers GPTBot, CCBot, Google-Extended). Filtered Work/Insights views canonicalise to their base index and are not indexable thin pages.
- **Rationale**: Meets Principle VII and FR-039/040/041; keeps schema honest (only visible content) to avoid structured-data spam; the allowlist matches the owner's confirmed policy.
- **Alternatives rejected**: Blanket allow/deny robots (fails the allow-citation-block-training distinction); schema for off-page or aspirational content (dishonest, risks penalties); indexable filter permutations (thin-page/duplicate-content risk).

## D8. Consultation form handling

- **Decision**: Provider-neutral submission (`booking.ts`) posting to an env-injected endpoint (currently Formspree via the AJAX JSON contract), with honeypot spam protection, blur+submit validation with accessible errors, a preview-only mock that never runs in production, a never-false-success contract, and an email fallback on failure. Required fields: name, work email, business name, privacy acknowledgement. No budget field; no calendar widget at launch. Map Your Stack selection carries via an allowlist-parsed optional parameter.
- **Rationale**: Meets FR-026/027/028/029 and the clarified decisions (omit budget, no scheduler at launch, three-outcomes message with no time promise). The never-false-success rule prevents silent lead loss (SC-010). Allowlist parsing prevents parameter-tamper content injection (Edge Cases).
- **Alternatives rejected**: A custom backend/serverless endpoint (guardrail: no backend; adds secrets and ops); hardcoded provider keys (Principle IX breach); optimistic success UI (dishonest, drops leads); required budget/qualification gatekeeping (rejected by the owner in clarification).

## D9. Testing tools

- **Decision**: Vitest for unit/integration of pure logic and rendered-output assertions; Playwright-core (pre-installed Chromium) for browser, accessibility (axe), responsive, no-JS, reduced-motion, regression and visual QA. Lighthouse mobile audit at the hardening gate with exact reported scores.
- **Rationale**: Matches the installed toolchain (no new deps), keeps logic tests fast and DOM-independent, and covers the constitution's Definition of Done. Known Astro testing caveats are respected (scoped CSS is extracted to external files, and `{expressions}` escape apostrophes to `&#39;`), so assertions target source modules or apostrophe-free substrings.
- **Alternatives rejected**: Jest (redundant with Vitest); Cypress (heavier, second browser stack); full visual-regression snapshot service (overkill for this scope; manual screenshot QA suffices).

## D10. Migration approach

- **Decision**: Migrate the existing pages (home, what-we-do, who-we-help, how-it-connects, book-a-call, map-your-stack, 404, robots) onto the finalised token system and shared page systems in Phase A, preserving current behaviour (js-ready reveal controller, honest placeholders, verified booking endpoint, existing Growth Graph and Map Your Stack engines) and locking it with regression tests before building new page groups on top.
- **Rationale**: Preserves the approved baseline and prevents regressions to the two working islands and the verified form while the structure scales (spec Assumptions; risk register).
- **Alternatives rejected**: Greenfield rewrite (discards verified, working systems and risks losing honest-fallback behaviour); big-bang cutover of all pages at once (no safe review gates, high regression risk).

## Cross-cutting confirmations (from clarification)

- Response-time message: three outcomes, no time commitment.
- Crawler policy: allow search + AI-citation (incl. OAI-SearchBot); block AI-training (GPTBot/CCBot/Google-Extended).
- Service-page launch order: seven highest-intent first; remainder phased behind anchored sections.
- Interim proof: honest anonymized work + connection-map placeholder art + the site's own execution as proof; named case studies as permissions clear.
- Scheduling: no calendar at launch; personal reply only; scheduler optional later.
- Budget: omitted from the form; raised in follow-up.
- Fifth Growth Graph goal: "Save team time".
