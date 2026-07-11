# Phase 0 Research: Architecture & Dependency Decisions

**Feature**: 001-marketing-website | **Date**: 2026-07-10

This document records the architecture, tooling, and technique decisions that resolve the Technical Context. Each entry follows Decision / Rationale / Alternatives considered. The approved product strategy, sitemap, positioning, Infinite Universe concept, Line device, service architecture, and visual direction are treated as fixed inputs and are not re-evaluated here.

---

## R1. Site architecture — static-first generator vs. plain files vs. client framework

**Decision**: Build with **Astro** as a static site generator producing pre-rendered HTML, shipping **zero JavaScript by default**, using its component model + content collections + islands.

**Rationale**:
- ~24 routes share a header, nav, footer, section system, and brand objects. Component reuse and layout templates are mandatory to avoid duplication and drift; plain HTML cannot provide this without hand-copying chrome across every page.
- Astro pre-renders to static HTML (fast delivery, strong SEO, cheap hosting) while allowing **selective islands** for the few interactive pieces (mobile nav, forms, signature-motion controllers). This matches Principle III (Speed) better than any full client framework because most pages ship no runtime JS.
- **Content collections** give type-safe, file-based structured content (services, case studies, insights, testimonials, logos) — exactly the "structured placeholder data replaceable without rewriting layouts" requirement.
- Built-in responsive **image** optimization and first-class SEO/`<head>` control support FR-041–FR-052 without bolt-ons.

**Alternatives considered**:
- **Plain HTML/CSS/JS**: smallest tooling, but 24 pages × shared chrome = unmaintainable duplication, no content model, manual sitemap, no build-time image optimization. Rejected for maintainability and content-expansion requirements.
- **Eleventy (11ty)**: excellent zero-JS SSG; closest alternative. Rejected only because Astro's first-class component model, scoped component CSS, islands, and typed content collections fit a "design system + brand objects + selective interactivity" build more directly with less glue.
- **Next.js / React (or Vue/SvelteKit)**: ships a client runtime and heavier baseline JS for a site that is ~95% static editorial content. The required interactivity (nav toggle, one form, scroll-driven SVG) does not justify hydrating a whole app. Rejected as larger than necessary and in tension with the performance target.
- **Astro + React islands**: possible, but no requirement needs React; adding it would pull a runtime for trivial DOM work. Islands are authored in vanilla TS instead.

**Conclusion**: Astro is the **smallest architecture that still supports the flagship experience** — components, routing, content collections, islands, static output — without adopting a client-app runtime.

---

## R2. Styling — design tokens + scoped CSS vs. a CSS framework

**Decision**: Hand-authored **CSS custom-property tokens** (`tokens.css`) + Astro **component-scoped CSS**. No Tailwind or other CSS framework.

**Rationale**: An editorial, asymmetric, deliberately-varied design (Principle IV) is better served by a small bespoke token system than by utility classes, which encourage repetition of the "same three cards" pattern the spec prohibits and add a build dependency + class noise. Tokens give one source of truth for color/type/space/radius and enable the paper/ink section environments via variable remapping. Native CSS (container queries, `clamp()`, `:focus-visible`, `prefers-reduced-motion`) covers all layout/responsive/motion needs.

**Alternatives considered**: **Tailwind** (fast for conventional UIs, but utility churn works against a bespoke editorial system and adds tooling); **CSS-in-JS** (needs a runtime/framework — rejected with R1); **vanilla global CSS only** (viable but scoped component CSS localizes styles and prevents leakage).

---

## R3. Motion — native techniques vs. an animation library

**Decision**: Implement the two motion systems and three signature experiences with **native `IntersectionObserver` + CSS transitions + SVG** (`stroke-dasharray/-dashoffset`, transforms). **No animation library at start.** Motion One documented as an optional, removable enhancement.

**Rationale**:
- **Line flow**: SVG path length animated via `stroke-dashoffset` on an IO-triggered class (progressive `animation-timeline: view()` where supported) draws/undraws the Line and expresses connected vs. leaking states. Native, cheap, GPU-friendly.
- **Object assembly**: CSS `transform`/`opacity` transitions on reveal.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` renders every state statically (fully drawn Line; assembled objects; labeled before/after for Leak-to-Compound) so no information is motion-only (FR-037/SC-011).
- Per the dependency rule, native capability is sufficient here, so no library is justified yet.

**Animation-dependency evaluation (as required for any proposed animation dep)** — *Motion One*:
- *Visual need*: precise orchestration/sequencing of The Connection loop and Leak-to-Compound if native chaining becomes unwieldy.
- *Native comparison*: IO + CSS + Web Animations API already cover sequencing; the Web Animations API is native and can chain without a library.
- *Cost*: ~5 kB gzip, tree-shakeable, MIT, actively maintained; loads only with its island.
- *Justification*: adopt **only** if native orchestration proves genuinely fiddly; not adopted now.
- *Mobile / reduced-motion fallback*: feature-detected; disabled entirely under `prefers-reduced-motion`; mobile uses the simplified vertical-spine Line regardless.
- **GSAP rejected**: heavier and its licensing/registration friction is not worth the marginal benefit for these three effects.

---

## R4. Interactivity model — islands scope

**Decision**: Hydrate only: **MobileNav** (disclosure + focus trap + `Esc`), **ProposalForm/ContactForm** (validation + states + adapter), and **signature-motion controllers** (IO-driven, `client:visible`). Everything else is static HTML/CSS/SVG.

**Rationale**: Keeps default JS near zero (Principle III), isolates complexity, and lets each island lazy-hydrate. Signature controllers degrade to static under reduced motion / no-JS.

**Alternatives**: full-page hydration (rejected — unnecessary weight); no-JS at all (rejected — the form UX, accessible mobile menu, and drawn Line benefit from small, progressive enhancement while still functioning without JS where feasible).

---

## R5. Forms & submission — no backend now, adapter boundary

**Decision**: Build the form UI fully with **progressive enhancement** (real `<form>` + JS island). Submission flows through a single `submitProposal()` **provider-adapter**, env-selected, defaulting to a **mock** provider that simulates success/failure for testing. Spam protection starts as a native **honeypot + submit-timing** guard with an adapter slot for a real challenge provider.

**Rationale**: Satisfies "build and test the form now without a chosen provider" and "no unnecessary backend." The adapter is the single integration seam; swapping to a form service or serverless endpoint later needs no UI change. **Server-side validation (FR-053) is assigned to the provider boundary** and is a pre-launch gate — deferring the *server*, not the *requirement*.

**Alternatives considered**:
- **Astro SSR endpoint / serverless function now**: adds a runtime/adapter and hosting decisions the caller explicitly deferred. Rejected for stage one; remains the natural real provider later.
- **Direct third-party form embed**: cedes UX/accessibility control and brand fit. Rejected; a provider adapter keeps our UI while allowing such a service as a destination.
- **mailto: link**: not a premium, validated, spam-protected experience. Rejected.

---

## R6. Content modeling — collections + flagged placeholders

**Decision**: Model `services`, `caseStudies`, `insights`, `testimonials`, `logos`, and `site` copy as **zod-validated content collections**; nav/pillars/proposal-schema as typed data modules. Every temporary value carries `placeholder: true` and/or `assetStatus: "pending"`; pending proof renders via a visible `PlaceholderBadge`.

**Rationale**: Separates all replaceable material from layout (easy swap, FR-032), enforces required fields incl. image `alt` at build time, and structurally prevents fabricated proof from reading as verified (FR-016/SC-016). A single grep enumerates everything to replace.

**Alternatives considered**: a **CMS** (Sanity/Contentful/etc.) — rejected per "no CMS unless it solves a current requirement"; file collections meet every current need and add no service dependency. Hardcoding content into pages — rejected (violates replaceability).

---

## R7. Fonts

**Decision**: **Self-hosted, subsetted variable woff2** for three roles (editorial display, interface/body sans, restrained mono), `font-display: swap`, preload the critical display subset. Specific families are **swappable placeholders** (e.g. a variable serif display, Inter/Geist body, a mono) pending a licensing/coverage/performance validation pass.

**Rationale**: Self-hosting avoids third-party origin latency and consent concerns, supports performance (Principle III) and privacy (Principle IX). Variable fonts give editorial range at controlled weight. Treating families as placeholders honors "exact typeface selection may be validated later."

**Alternatives**: Google Fonts CDN (extra origin + privacy/consent implications) — rejected for self-hosting.

---

## R8. SEO mechanics

**Decision**: `@astrojs/sitemap` for the sitemap; `public/robots.txt` for robots; `lib/seo.ts` for per-page title/description/canonical/OG; `lib/schema.ts` JSON-LD builders (Organization, Service, Article, BreadcrumbList, FAQ). Temporary metadata/structured-data values allowed until final content.

**Rationale**: Covers FR-041–FR-044 and SC-014 with build-time correctness and no runtime cost; integration points exist even while values are placeholder.

**Alternatives**: hand-maintained sitemap (drift risk) — rejected.

---

## R9. Testing tooling

**Decision**: **Vitest** for pure logic (form validation, content-schema conformance, SEO/JSON-LD builders). Accessibility/performance/SEO/content-integrity verified via tooling + manual passes in Phase 5. No E2E framework adopted for stage one.

**Rationale**: Tests the behavior that matters (Principle X) — validation and content integrity — without a heavy stack on a static site. Vitest integrates cleanly with the Astro/Vite toolchain.

**Alternatives**: Playwright E2E now (premature; the manual quickstart covers acceptance flows at this stage); no tests (rejected — validation logic is exactly what must be protected).

---

## R10. Section environments (light/dark) & theming

**Decision**: Treat **paper (light)** and **ink (dark)** as **section-level compositional environments** toggled by `data-env`, with semantic color tokens remapping per environment. No global user theme toggle / `prefers-color-scheme` switch in stage one.

**Rationale**: The brand intentionally composes with both warm paper and warm near-black as designed environments; a user-facing dark-mode toggle is neither required by the spec nor on-brand, and would double the design/QA surface. Both environments are first-class and contrast-validated.

**Alternatives**: global dark-mode toggle (extra scope, no requirement) — rejected; single-environment site (loses the approved warm-paper/near-black interplay) — rejected.

---

## Open items intentionally deferred (not blockers)

- **Real form provider + server-side validation + challenge provider** — chosen at integration/launch; adapter seam ready now.
- **Final color hex values & typeface licensing** — validated in a later design/accessibility pass; approved as adjustable.
- **Analytics vendor & consent configuration** — deferred; loaded behind consent, third-party scripts controlled.
- **Hosting/deployment** — out of scope; static output is host-agnostic and previewable in-cloud.

All Technical Context unknowns are resolved for stage-one implementation; none block Phase 1.
