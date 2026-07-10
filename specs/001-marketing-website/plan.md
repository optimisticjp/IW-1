# Implementation Plan: Infinite Weblinks Flagship Marketing Website

**Branch**: `claude/infinite-weblinks-setup-mqvijv` (feature `001-marketing-website`) | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-marketing-website/spec.md`

## Summary

Build a single English-language, static-first, flagship marketing website for Infinite Weblinks (an ecommerce growth studio) whose primary job is to generate qualified **Request a Proposal** submissions while itself demonstrating the agency's craft. The approach: an **Astro** static site that ships **zero JavaScript by default**, uses a **token-based hand-authored CSS design system**, expresses the **Infinite Universe / Line of value** through **SVG + CSS** brand objects, hydrates only a few small **islands** (mobile navigation, the proposal/contact form, and the scroll-driven Line/signature controllers), and stores all replaceable copy, proof, metrics, case studies, and articles as **structured content collections** so placeholders can be swapped without touching layouts.

The build is sequenced for **visible progress first**: design tokens → flagship homepage + Infinite Universe → reusable layouts/brand objects → remaining primary pages → proposal journey → placeholder replacement → formal accessibility/SEO/performance/security/launch QA. No backend, database, CMS, authentication, or deployment work is undertaken in this first stage; the proposal form is fully built and testable behind a configurable **provider-adapter** with a mock destination.

## Technical Context

**Language/Version**: HTML5, modern CSS (custom properties, container/media queries, `clamp()`), TypeScript-typed Astro components; small vanilla-JS/TS islands (ES2022). Node LTS (build-time only).

**Primary Dependencies**: **Astro** (static site generator + component model + content collections + islands); **@astrojs/sitemap** (build-time sitemap); **sharp** (Astro's built-in responsive image pipeline). Testing: **Vitest** (form-validation + content-schema logic). No UI framework (React/Vue/Svelte) is adopted. No CSS framework (Tailwind) is adopted — design tokens + scoped component CSS instead. No animation library adopted at start (native only); Motion One is documented as an optional, removable enhancement.

**Storage**: None (no database). Content lives as version-controlled files in Astro **content collections** (Markdown/MDX + typed data) and small data modules. Proposal submissions are handled by a configurable adapter (default: mock) — no persistence in this stage.

**Testing**: Vitest for pure logic (form validation rules, content-collection schema validation, SEO/JSON-LD builders). Manual + tooling QA (axe, Lighthouse, keyboard, reduced-motion) scheduled in Phase 5. No heavyweight E2E stack added to a static site without cause.

**Target Platform**: Any static host / CDN; runs in Claude Code Web preview via `astro dev` / `astro preview` (no local machine, Codespaces, or deployment required to review). Output is pre-rendered static HTML/CSS/SVG with minimal hydrated islands.

**Project Type**: Static web (frontend-only). Single project. No backend service in scope for stage one.

**Performance Goals**: Mobile Lighthouse performance **≥90** (best-effort ≥95), verified by testing after the visual build exists — not guaranteed in advance. Zero layout shift (CLS ~0), fast first content render, minimal main-thread JS. Purposeful animation only.

**Constraints**: Mobile-first at 360/390/768/1024/large-desktop with no horizontal overflow; WCAG 2.1 AA baseline; no hover-only functionality; `prefers-reduced-motion` honored; no hardcoded secrets; only necessary personal data collected; ≤2 primary motion systems; ≤ a small, justified dependency set. Placeholders must be clearly marked and trivially replaceable.

**Scale/Scope**: ~24 routes — Home, What We Do, 5 priority service pages, 2 pillar pages (Retention, Intelligence), Case Studies index + individual template, Approach, Insights index + article template, For Creators, Partners/White-label, Request a Proposal, Contact, 4 legal pages, 404. Content collections seeded with realistic placeholders (≈6–8 case studies, ≈8+ logos, ≈6 testimonials, 2–3 insights).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

Constitution v1.0.0 (`.specify/memory/constitution.md`). Each principle mapped to a plan decision:

| # | Principle | Plan compliance | Gate |
|---|---|---|---|
| I | Spec Before Code | Spec `001-marketing-website/spec.md` ratified; this plan derives from it; no code yet. | ✅ PASS |
| II | Mobile-First | Components authored mobile-first; breakpoints 360/390/768/1024/large; Line collapses to a vertical spine; no hover-only; comfortable touch targets. | ✅ PASS |
| III | Speed | Astro zero-JS default; islands only where needed; native CSS (no utility framework); self-hosted subset fonts with `font-display: swap`; responsive images via sharp; no animation lib at start; minimal justified deps. | ✅ PASS |
| IV | Deliberate Design | One editorial-tech direction; single token system; constrained motion vocabulary (2 patterns); reusable brand-object system; square-leaning radii to avoid rounded-rectangle default; no purple-gradient/style-soup fallback. | ✅ PASS |
| V | Selective Skill Activation | Skills invoked per stage (design/frontend during foundation & homepage; humanizer/copywriting during content; seo-* during SEO; owasp-security & code-review before done). No blanket activation. | ✅ PASS |
| VI | Human-Sounding Content | Content model separates copy from layout; placeholder copy is clearly flagged and will pass through `humanizer` in the content phase; no invented proof. | ✅ PASS |
| VII | SEO Is Part of the Build | Semantic layouts, per-page title/description/canonical, `@astrojs/sitemap`, robots, OG/Twitter meta, JSON-LD builders, intentional internal linking, image alt fields — all designed as component/data seams now. | ✅ PASS |
| VIII | Accessibility Is Part of the Build | Semantic landmarks, skip link, visible focus tokens, keyboard-operable islands, accessible form errors + `aria-live` status, reduced-motion static states, decorative-vs-informative asset handling baked into components. | ✅ PASS |
| IX | Security Is Part of the Build | No secrets in repo; env-driven adapter config; honeypot + timing spam guard; safe client error messages; **server-side validation designated at the provider boundary** (see note); minimal/no backend. | ✅ PASS (with documented deferral) |
| X | Test Important Behavior | Vitest covers form validation and content-schema logic (the behavior that matters); presentation not over-tested; no heavy stack forced onto a static site. | ✅ PASS |
| XI | Spec Kit Workflow | Following constitution → specify → **plan** → (clarify optional) → checklist → tasks → analyze → implement → converge. | ✅ PASS |
| XII | Efficient Context | Concise structured artifacts; content-as-data; handoff notes; no full-file pasting. | ✅ PASS |
| XIII | Preview Without Deployment | `astro dev`/`preview` runs in the cloud; static output reviewable without deploy or local setup. | ✅ PASS |
| XIV | Definition of Done | Phase 5 QA explicitly verifies the DoD checklist (mobile, coherence, humanized copy, SEO, a11y, security, tests, lint/build, no stray placeholders, performance documented, convergence). | ✅ PASS |

**Documented deferral (Principle IX)**: In stage one there is **no server processing** of submissions — the form posts through a mock adapter — so no insecure server path is shipped. FR-053's "server-side validation wherever submissions are processed" becomes a **required integration point** at the provider boundary: whichever real destination is later chosen (form service or serverless function) MUST implement server-side validation, rate limiting, and real spam protection before public launch. This is a deliberate deferral of the server, not a bypass of the requirement, and is tracked in Risks. **No unjustified violations → Complexity Tracking is empty.**

## Project Structure

### Documentation (this feature)

```text
specs/001-marketing-website/
├── plan.md              # This file
├── research.md          # Phase 0 output (architecture & dependency decisions)
├── data-model.md        # Phase 1 output (content collections + form model)
├── quickstart.md        # Phase 1 output (run & validate guide)
├── contracts/           # Phase 1 output
│   ├── content-collections.md   # Collection schema contracts
│   ├── proposal-form.md         # Form field + state + adapter contract
│   └── seo-metadata.md          # Per-page metadata + JSON-LD contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
astro.config.mjs                 # Astro config: sitemap, image, site URL (placeholder)
package.json                     # scripts: dev, build, preview, test
tsconfig.json
public/
├── fonts/                       # self-hosted variable font subsets (woff2, placeholder families)
├── images/                      # placeholder portfolio / OG images (clearly marked)
├── robots.txt                   # placeholder-friendly robots directives
└── favicon.svg
src/
├── styles/
│   ├── tokens.css               # color, type, space, radius, elevation, breakpoint tokens
│   ├── environments.css         # paper (light) & ink (dark) section environments
│   ├── base.css                 # reset, base elements, focus-visible, prose
│   └── global.css               # entry importing the above
├── components/
│   ├── layout/                  # Container, Section, SiteHeader, PrimaryNav, MobileNav (island), SiteFooter, SkipLink
│   ├── ui/                      # Button, TextLink, Eyebrow, Kicker, Tag, Stat, Prose, FieldLabel, etc.
│   ├── brand/                   # Line, FlowMarker, Storefront, Campaign, ContentStream, RetentionLoop, AnalyticsPanel (SVG/CSS)
│   ├── modules/                 # ServiceModule, PillarGrid, ProofModule, CaseStudyCard, TestimonialModule, LogoWall, FaqModule, CTASection, PlaceholderBadge
│   ├── signature/               # TheLine, TheConnection, LeakToCompound (SystemInMotion optional/deferred)
│   └── forms/                   # ProposalForm (island), ContactForm (island), Field primitives, FormStatus (aria-live)
├── layouts/
│   ├── BaseLayout.astro         # <head>, SEO/meta/JSON-LD slot, skip link, header, footer, section-env wrapper
│   ├── PageLayout.astro         # generic editorial page
│   ├── ServiceLayout.astro      # priority-service / pillar template
│   ├── CaseStudyLayout.astro    # individual case study template
│   ├── ArticleLayout.astro      # individual insight template
│   └── LegalLayout.astro        # privacy/terms/cookies/accessibility
├── content/
│   ├── config.ts                # zod schemas for every collection
│   ├── services/                # 5 priority + 2 pillar entries
│   ├── caseStudies/             # placeholder case studies (assetStatus flagged)
│   ├── insights/                # 2–3 substantial placeholder articles
│   ├── testimonials/            # placeholder, approval-flagged
│   ├── logos/                   # placeholder client logos, approval-flagged
│   └── site/                    # global copy, nav, footer, legal, FAQ
├── data/
│   ├── nav.ts                   # primary/footer nav config + active-state map
│   ├── pillars.ts               # Demand/Storefront/Retention/Intelligence definitions
│   └── proposalSchema.ts        # field definitions (labels, required, help, options)
├── lib/
│   ├── seo.ts                   # title/description/canonical/OG helpers
│   ├── schema.ts                # JSON-LD builders (Organization, Service, Article, Breadcrumb, FAQ)
│   ├── validation.ts            # shared, framework-free form validation rules (unit-tested)
│   └── forms/
│       ├── submit.ts            # submitProposal() adapter dispatcher (env-driven)
│       ├── providers/mock.ts    # default placeholder provider (simulates success/failure)
│       └── spam.ts              # honeypot + timing guard (native, zero-dep)
├── pages/
│   ├── index.astro              # Homepage (flagship)
│   ├── what-we-do.astro
│   ├── services/[slug].astro    # renders priority + pillar service entries
│   ├── case-studies/index.astro
│   ├── case-studies/[slug].astro
│   ├── approach.astro
│   ├── insights/index.astro
│   ├── insights/[slug].astro
│   ├── for-creators.astro
│   ├── partners.astro
│   ├── request-a-proposal.astro
│   ├── contact.astro
│   ├── legal/privacy.astro
│   ├── legal/terms.astro
│   ├── legal/cookies.astro
│   ├── legal/accessibility.astro
│   └── 404.astro
└── env.d.ts
tests/
└── unit/                        # validation.test.ts, schema.test.ts, seo.test.ts
```

**Structure Decision**: Single static-web project rooted at the repo root (Astro convention). Content is separated from presentation via `src/content` collections and `src/data` modules so every placeholder (copy, proof, metrics, images, metadata, form destination, analytics id) is edited in data, never in layout. Interactive behavior is isolated to a handful of island components under `src/components/forms` and `src/components/signature` + `MobileNav`, keeping the default payload JS-free. This is the smallest structure that still supports reusable layouts, deep routing, strong SEO, and easy content expansion.

## Design System Approach

A hand-authored, token-first system (no UI/CSS framework) expressed as CSS custom properties in `src/styles/tokens.css`, consumed by scoped component styles.

- **Color tokens** (approved direction; exact values adjustable, all pairings to be contrast-validated in Phase 5):
  - `--paper` warm light foundation (e.g. `#F6F1E7`), `--ink` warm near-black (e.g. `#16130F`)
  - `--vermilion` signature accent (e.g. `#E8412A`), `--green` deep supporting accent (e.g. `#0E4D3C`)
  - rationed bright accents (e.g. one amber `--accent-amber`, one cool spark `--accent-spark`) used sparingly
  - semantic aliases per environment: `--bg`, `--fg`, `--muted`, `--rule`, `--link`, `--focus` remap under `[data-env="paper"]` vs `[data-env="ink"]`.
- **Typography tokens**: three roles — expressive editorial **display** (placeholder: a variable serif such as Fraunces), highly legible **interface/body** sans (placeholder: Inter/Geist), restrained **mono** for metrics/system labels (placeholder: a mono variable). Fluid `clamp()` type scale; self-hosted subsetted woff2; licensing/format validated later.
- **Spacing scale**: 4px base → 4/8/12/16/24/32/48/64/96/128/160; fluid section rhythm via `clamp()`.
- **Layout grid & section-width**: 12-column fluid grid with an editorial asymmetric option set; content measure capped (~68ch prose); section max-widths (`--w-prose`, `--w-content`, `--w-wide`, full-bleed) enable deliberate density variation.
- **Breakpoints**: 360 (base), 390, 480, 768, 1024, 1280, 1536.
- **Border/radius**: rules and hairlines as primary structure; radii kept small (`0 / 2px / 6px`) to avoid the rounded-rectangle default.
- **Elevation/depth**: restrained — depth via layered SVG, rules, and one subtle shadow token; not shadow-heavy.
- **Focus states**: single visible `--focus` outline (2px, offset) legible on both environments; `:focus-visible` only.
- **Components**: Button (primary/secondary/ghost), TextLink, form controls (accessible label/help/error), PrimaryNav + MobileNav, ProofModule, ServiceModule, CaseStudy modules, TestimonialModule, LogoWall, FaqModule, CTASection, SiteFooter — all defined once and reused.
- **Light/dark environments**: paper and ink are **section-level compositional environments** (via `data-env`), not a user theme toggle; both are first-class and contrast-checked. (A global `prefers-color-scheme` switch is out of scope; the brand intentionally uses both as designed environments.)

Full contract in [contracts/](./contracts/) and entity shapes in [data-model.md](./data-model.md).

## Infinite Universe / Motion Approach

**Central device — the Line of value** (`src/components/brand/Line`): an SVG stroke that connects narrative sections and growth systems. It can appear continuous (connected/compounding) or broken/leaking (disconnected), collapse to a **vertical spine** on mobile, and render **fully static** under reduced motion. It is recurring, not mandatory in every section; reading-heavy areas use it minimally or omit it. It is explicitly *not* a network diagram, wire maze, or glowing-node field.

**Two — and only two — primary motion systems** (Principle IV / FR-036):
1. **Line flow & progression** — SVG `stroke-dasharray/-dashoffset` drawn on scroll via `IntersectionObserver` (progressive `animation-timeline: view()` where supported). Communicates demand → storefront → retention → intelligence → back into growth.
2. **Object assembly / transformation** — brand objects (Storefront, Campaign, Content Stream, Retention Loop, Analytics Panel) assemble from parts via CSS `transform`/`opacity` on reveal.

**Brand-object system** (`src/components/brand/`): each object is a lightweight, reusable SVG/CSS component with a static base state and an optional assembled/animated state — no 3D production required. Objects are upgradeable later without changing page architecture. Every object explains a service/relationship/result/process; purely decorative objects are limited (`PlaceholderBadge` marks temporary art).

**Signature experiences** (`src/components/signature/`): **The Line** (homepage scroll spine), **The Connection** (the growth loop closes and becomes visible), **Leak to Compound** (a broken/leaking state resolves into a continuous compounding flow). **System in Motion** is optional/deferred — included only if it materially improves the experience with native-weight cost.

**Motion rules**: communicate cause/effect/connection/progression; never hover-dependent; touch-adaptive; no scroll-jacking; never block or hide content; every motion-borne meaning also exists in the static state; `prefers-reduced-motion: reduce` swaps to the static/labeled before-after presentation.

**Animation dependency evaluation**: native `IntersectionObserver` + CSS transitions + SVG cover all three required experiences → **start with zero animation dependency**. *Motion One* (~5 kB, tree-shakeable) is documented as an **optional, removable** enhancement only if orchestration of The Connection/Leak-to-Compound proves fiddly natively; it has a trivial mobile/reduced-motion fallback (feature-detected, disabled under reduce). GSAP is rejected (heavier + licensing friction for the value it adds here). See [research.md](./research.md).

## Content Architecture

All replaceable material is data, not markup:

- **Collections** (`src/content`, zod-validated in `config.ts`): `services` (5 priority + 2 pillar), `caseStudies`, `insights`, `testimonials`, `logos`, `site` (global copy/nav/footer/legal/FAQ).
- **Data modules** (`src/data`): navigation, pillar definitions, proposal field schema.
- **Placeholder strategy**: every temporary value carries an explicit `placeholder: true` and/or `assetStatus: "pending"` flag; temporary proof renders through a visible `PlaceholderBadge` so it can never masquerade as verified. A single `grep` for `placeholder`/`assetStatus: pending`/`TODO(content)` lists everything to replace. No fabricated client, metric, testimonial, logo, or guarantee is ever presented as real.
- **Templates**: `ServiceLayout` (priority + pillar), `CaseStudyLayout`, `ArticleLayout`, `LegalLayout`, `PageLayout` — each driven by collection entries so new content = new data file, no layout edits.

Entity shapes and validation rules: [data-model.md](./data-model.md).

## Routing & Navigation

- **Sticky desktop nav** (`PrimaryNav`) with the six primary destinations + a persistent **Request a Proposal** CTA; **active-page** state from `data/nav.ts` matched to the current path.
- **Accessible mobile nav** (`MobileNav` island): a11y disclosure pattern — focus trap while open, `Esc` to close, focus returned to the trigger, `aria-expanded`/`aria-controls`, background inert; works without hover.
- **Deep service navigation**: `services/[slug]` with in-page section anchors and cross-links to related pillars/case studies (contextual internal linking per FR-017/FR-043).
- **Footer navigation**: full sitemap incl. legal and secondary-audience paths (quiet placement preserves ecommerce-first hierarchy).
- **CTA availability**: contextual Request a Proposal in header, section CTAs, and page closers — present but not repetitive/aggressive.
- **Focus handling**: skip link to `<main>`; route-level focus reset; visible focus throughout.

## Form Plan (Proposal & Contact)

- **Fully built, testable UI now**, independent of a chosen provider. Progressive enhancement: the form is a real `<form>` that works with native submission; the island layers inline validation, states, and the adapter.
- **Fields** (FR-021, only necessary PII): name*, email*, company/brand*, website/store URL (optional), business type*, current situation, primary challenge*, goals, relevant services/growth areas (multi-select mapped to pillars/services), timeline, budget context (optional), additional details; plus privacy acknowledgement* and a hidden honeypot.
- **Grouping**: logical field groups (You → Your business → Your goals → Anything else) for a short, premium feel; single accessible page (no forced multi-step).
- **States**: idle → validating (inline, field-level) → submitting (loading) → success (accessible confirmation + what-happens-next + response window) → failure (recoverable, data preserved, retry) — all announced via an `aria-live` `FormStatus`.
- **Adapter**: `submitProposal()` dispatches to an env-selected provider; default `mock` simulates success and (on demand) failure for testing. Real providers (form service endpoint / serverless function) drop in later via env config with no UI change. **Server-side validation is the provider's responsibility** and is required before launch.
- **Spam protection**: native honeypot + submit-timing check now; slot for a real challenge provider (e.g. Turnstile/hCaptcha) at the adapter boundary later.
- **Contact form**: same primitives/validation/states with a lighter field set.

Field/state/adapter contract: [contracts/proposal-form.md](./contracts/proposal-form.md). Validation rules are unit-tested in `tests/unit/validation.test.ts`.

## SEO Approach

Designed as seams now, filled with temporary values until final content:

- Semantic layouts (one `<h1>`/page, logical heading order, landmarks) enforced by `BaseLayout`/prose components.
- Per-page **title/description/canonical** via `lib/seo.ts`; **OG/Twitter** metadata; meaningful URLs (as in the route map).
- **Sitemap** via `@astrojs/sitemap`; **robots.txt** in `public/` (placeholder-friendly, launch-configurable).
- **JSON-LD** builders (`lib/schema.ts`): Organization, Service, Article, BreadcrumbList, FAQ — integration points wired even while values are placeholder.
- **Internal linking**: case studies ↔ services, pillar ↔ services, contextual CTAs.
- **Image metadata/alt**: every image field in collections includes required `alt` (decorative images marked so they render `alt=""`).
- Answer-oriented FAQ content model for traditional + AI-assisted search.

Contract: [contracts/seo-metadata.md](./contracts/seo-metadata.md).

## Accessibility Approach

Built into reusable components (not a pre-build audit): semantic structure + landmarks + skip link; `:focus-visible` tokens; keyboard-operable nav/menu/form; reduced-motion static states; accessible form labels/help/error and `aria-live` status; contrast-ready token pairs; required `alt` fields with decorative handling; no information via color or motion alone. Formal verification (axe + manual keyboard/screen-reader/reduced-motion passes) is Phase 5.

## Performance Approach

Static-first pre-rendering; islands hydrated selectively (`client:visible`/`client:idle`) so most pages ship no JS; responsive images (sharp) with width/height to prevent CLS; inline SVG for brand objects with sensible reuse; subsetted self-hosted fonts with `font-display: swap` and preload of the critical display face; per-route code splitting inherent to Astro; animation code loaded only with its island; lazy-load non-critical media; strict third-party-script control (analytics behind consent, deferred). Lighthouse/field testing occurs **after** the visual build (Phase 5); the creative concept is not stripped pre-test.

## Dependency Justification

| Dependency | Requirement served | Native sufficient? | Cost / maintenance | Justified? | Removable later? |
|---|---|---|---|---|---|
| **Astro** | Reusable components, routing for ~24 pages, content collections, islands, static output, SEO | No — 24 hand-maintained HTML pages with shared chrome is unmaintainable and error-prone | Build-time only; ships ~0 runtime JS by default; active, stable | **Yes** — smallest tool giving components + collections + islands + SSG | Would require a full re-platform; core choice |
| **@astrojs/sitemap** | XML sitemap (FR-043/SC-014) | Could hand-write, but drifts from routes | Tiny, official, build-time | **Yes** — correctness + zero drift | Yes (swap for manual) |
| **sharp** (via Astro image) | Responsive, optimized images, no CLS (FR-047/FR-052) | Manual image optimization is error-prone | Build-time; bundled with Astro image | **Yes** | Yes |
| **Vitest** | Unit-test validation + schemas (Principle X) | No test runner is native | Dev-only | **Yes** — tests the logic that matters | Yes |
| **Motion One** *(optional, not adopted at start)* | Only if native scroll orchestration is insufficient for signature experiences | Native IO + CSS is the default | ~5 kB, tree-shakeable, dev-simple | Deferred — adopt only with justification | **Yes** — feature-detected, reduced-motion disables it |

Net starting runtime dependencies shipped to users: **effectively none** (Astro emits static assets; islands are small vanilla scripts). Everything above is build/dev-time except optional Motion One.

## Implementation Phases

Sequenced for visible progress (matches the requested order); details become tasks in `/speckit-tasks`.

- **Phase 1 — Foundation & flagship homepage**: project setup (Astro, config, scripts); `tokens.css`/`environments.css`/`base.css`; typography + self-hosted placeholder fonts; `BaseLayout` + `SiteHeader`/`PrimaryNav`/`MobileNav`/`SiteFooter`/`SkipLink`; the **Line** system + core **brand objects**; the three **signature experiences**; the complete, responsive homepage (all 9 narrative stages) with realistic placeholder content and vector/SVG assets. **Milestone: a reviewable flagship homepage.**
- **Phase 2 — Primary pages**: What We Do; the 5 priority service pages + Retention + Intelligence pillar pages via `ServiceLayout`; reusable `ServiceModule` + `ProofModule`. **Milestone: full service architecture browsable.**
- **Phase 3 — Work, trust & secondary paths**: Case Studies index + `CaseStudyLayout`; Approach; For Creators; Partners/White-label; Insights index + `ArticleLayout` (seeded with 2–3 substantial pieces). **Milestone: proof + secondary audiences live.**
- **Phase 4 — Conversion & supporting pages**: Request a Proposal (full form + states + adapter/mock); Contact; success/error states; 4 legal templates; metadata, OG images, JSON-LD wired. **Milestone: end-to-end proposal journey works with placeholders.**
- **Phase 5 — Refinement & QA**: replace available placeholders; responsive refinement across all five widths; interaction/motion polish; **accessibility verification** (axe + keyboard + screen-reader + reduced-motion); **performance** (Lighthouse mobile ≥90); **SEO verification**; **security review** (`owasp-security`, secret scan, adapter boundary); cross-browser; run **`/speckit-converge`** to log residual gaps. **Milestone: Definition of Done satisfied.**

Sequence changes only if a dependency requires it.

## Testing Strategy

- **Unit (Vitest, now/Phase 4)**: form validation rules (required/optional, email/URL formats, error mapping, duplicate/honeypot logic); content-collection schema conformance (every entry validates, required `alt`, `assetStatus` present); SEO/JSON-LD builder output shape.
- **Acceptance mapping**: each user story's acceptance scenarios become manual verification steps in [quickstart.md](./quickstart.md); the proposal-form behavior matrix (success/validation/failure/retry/duplicate/spam/privacy) is exercised there.
- **QA passes (Phase 5)**: responsive (5 widths, no overflow), keyboard-only critical path, reduced-motion information-parity audit, axe automated + manual a11y, Lighthouse mobile, per-page SEO checklist, content-integrity audit (no fabricated proof), security review.
- Presentation minutiae are intentionally not unit-tested (Principle X).

## Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Visual ambition inflates JS/asset weight and threatens Lighthouse ≥90 | Fails Principle III / SC-013 | Medium | Zero-JS default + islands; SVG/CSS motion over libraries; measure in Phase 5 and cut/gate any island that regresses; keep motion optional and reduced-motion-first |
| Signature experiences hard to build natively → pressure to add heavy animation lib | Dependency creep, perf risk | Medium | Native IO+CSS designed first; Motion One only with documented justification and removable/feature-detected fallback |
| Placeholder proof mistaken for real / left in at launch | Trust + integrity failure (FR-016/SC-016) | Medium | Mandatory `PlaceholderBadge` + `assetStatus`/`placeholder` flags; single-grep audit; content-integrity check in Phase 5 |
| Deferred server means no real server-side validation/spam protection at first | Security gap if launched as-is (FR-053/FR-026) | High if launch rushed | Adapter boundary designed now; explicit pre-launch gate: real provider must add server validation + challenge before public launch; tracked here and in converge |
| Font licensing/coverage of chosen display face | Rework, perf, legal | Low–Medium | Treat fonts as swappable placeholders; validate licensing/subset/format in a later design pass before launch |
| Editorial asymmetric layouts break at 360–390px | Fails Principle II / SC-009 | Medium | Mobile-first authoring; test at 360/390 each phase; Line collapses to vertical spine; no horizontal overflow gate per page |
| Color pairings fail AA contrast | Fails Principle VIII / SC-012 | Medium | Tokenized semantic colors; contrast-validate both environments in Phase 5; adjust values (approved as adjustable) |
| Scope (~24 routes) sprawls before homepage is strong | Diffuse progress | Low | Phase 1 gates on a strong homepage before breadth; content-as-data keeps later pages cheap |

## Complexity Tracking

> No Constitution Check violations require justification. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
