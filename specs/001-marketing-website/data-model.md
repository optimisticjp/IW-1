# Phase 1 Data Model: Content Collections & Form Model

**Feature**: 001-marketing-website | **Date**: 2026-07-10

All site content is file-based and version-controlled. There is no database. Collections are validated at build time (zod schemas in `src/content/config.ts`); data modules are typed TS. Field types below are conceptual (technology-agnostic where possible); every placeholder value carries an explicit flag so it can be found and replaced. Required fields are marked `*`.

**Global placeholder convention** (applies to every entity): a boolean `placeholder` (default `true` during build-out) and, for anything used as proof, an `assetStatus: "pending" | "approved"`. Any entry with `assetStatus: "pending"` renders through the visible `PlaceholderBadge` and MUST NOT be presented as verified.

---

## Entity: Service

Represents a priority service or a supporting pillar page. Drives `ServiceLayout` and `services/[slug]`.

| Field | Type | Notes |
|---|---|---|
| `slug`* | string | URL segment, e.g. `meta-ads` |
| `title`* | string | Real service name (e.g. "Meta Ads") |
| `kind`* | enum | `priority` \| `pillar` |
| `pillar`* | enum | `demand` \| `storefront` \| `retention` \| `intelligence` |
| `summary`* | string | One-line intent for cards/meta |
| `heroStatement`* | string | Editorial lead |
| `problem`* | richtext | The disconnection this service addresses |
| `causeEffect`* | richtext | Cause→effect explanation for an ecommerce business |
| `connections`* | array<PillarLink> | How this connects to other pillars (min 1) |
| `capabilities` | array<string> | Supporting capabilities represented here (no thin pages) |
| `proof` | array<ProofRef> | Contextual proof beside claims (may be pending) |
| `relatedCaseStudies` | array<ref caseStudies> | Cross-links |
| `faqs` | array<ref FAQ> | Optional |
| `cta`* | CTA | Contextual Request-a-Proposal invitation |
| `seo`* | SeoMeta | See contracts/seo-metadata.md |
| `placeholder` | boolean | Default true |

**Validation**: `slug` unique & URL-safe; `kind: priority` only for the five priority services; every Service has ≥1 `connections` entry (enforces "not in isolation", FR-011); `cta` present (FR-012).

**The five priority `slug`s**: `meta-ads`, `google-ads`, `website-design-development`, `shopify-development-management`, `social-media-growth`. **Pillar `slug`s**: `retention`, `intelligence`. (Demand & Storefront are represented via What We Do + their priority services.)

---

## Entity: CaseStudy

Drives `CaseStudyLayout` and `case-studies/[slug]`.

| Field | Type | Notes |
|---|---|---|
| `slug`* | string | URL segment |
| `client`* | string | Client/brand name (placeholder until approved) |
| `title`* | string | Editorial title |
| `context`* | richtext | Client context (FR-014) |
| `problem`* | richtext | The problem |
| `systemsInvolved`* | array<enum pillar/service> | Which systems |
| `whatChanged`* | richtext | What Infinite Weblinks changed |
| `howConnected`* | richtext | How systems connected |
| `results` | array<ResultMetric> | Measurable results **where verified**; each has `verified: boolean` |
| `relevantServices`* | array<ref services> | Links to service pages (FR-017) |
| `nextAction`* | CTA | Next step |
| `heroImage` | ImageAsset | Placeholder portfolio image |
| `logo` | ref logos | Optional |
| `assetStatus`* | enum | `pending` \| `approved` |
| `seo`* | SeoMeta | |
| `placeholder` | boolean | Default true |

**Validation**: a `ResultMetric` may only render without a "pending" badge when `verified: true` **and** `assetStatus: "approved"`; otherwise it renders as a clearly-identified content requirement (FR-016/SC-016). `relevantServices` ≥1.

---

## Entity: ResultMetric (embedded)

| Field | Type | Notes |
|---|---|---|
| `label`* | string | e.g. "Repeat purchase rate" |
| `value`* | string | e.g. "+34%" (placeholder) |
| `context` | string | What it means |
| `verified`* | boolean | False = never shown as fact |

---

## Entity: ProofModule / ProofRef (embedded)

A contextual unit of evidence placed beside a specific claim.

| Field | Type | Notes |
|---|---|---|
| `type`* | enum | `metric` \| `testimonial` \| `logo` \| `portfolio` |
| `ref`* | id/ref | Points to metric/testimonial/logo/image |
| `claim`* | string | The claim it supports (kept adjacent) |
| `assetStatus`* | enum | `pending` \| `approved` |

**Validation**: `pending` proof always renders via `PlaceholderBadge`.

---

## Entity: Testimonial

| Field | Type | Notes |
|---|---|---|
| `id`* | string | |
| `quote`* | richtext | |
| `attribution`* | string | Name/role/brand (placeholder until approved) |
| `assetStatus`* | enum | `pending` \| `approved` |
| `placeholder` | boolean | |

**Validation**: never fabricated as approved; `pending` shows placeholder treatment.

---

## Entity: ClientLogo

| Field | Type | Notes |
|---|---|---|
| `id`* | string | |
| `name`* | string | Brand name (placeholder) |
| `image`* | ImageAsset | SVG/PNG placeholder mark, required `alt` |
| `assetStatus`* | enum | `pending` \| `approved` |

---

## Entity: InsightArticle

Drives `ArticleLayout` and `insights/[slug]`. Insights launches with 2–3 substantial pieces (never empty).

| Field | Type | Notes |
|---|---|---|
| `slug`* | string | |
| `title`* | string | |
| `intent`* | string | Search/answer intent |
| `excerpt`* | string | |
| `body`* | markdown/MDX | Substantial content |
| `publishedDate` | date | Placeholder allowed |
| `author` | string | Placeholder studio author |
| `relatedServices` | array<ref services> | Internal linking |
| `heroImage` | ImageAsset | With required `alt` |
| `seo`* | SeoMeta | |
| `placeholder` | boolean | |

---

## Entity: FAQ (embedded/collection)

| Field | Type | Notes |
|---|---|---|
| `question`* | string | |
| `answer`* | richtext | Answer-oriented for traditional + AI search |
| `scope` | enum | `global` \| `service` \| `proposal` |

Rendered by `FaqModule`; feeds FAQ JSON-LD where used.

---

## Entity: NavItem / FooterGroup (data module `src/data/nav.ts`)

| Field | Type | Notes |
|---|---|---|
| `label`* | string | |
| `href`* | string | |
| `primary`* | boolean | In primary nav vs. footer-only |
| `emphasis` | enum | `default` \| `cta` \| `quiet` (secondary-audience links are `quiet`) |
| `matchPaths` | array<string> | For active-state detection |

**Validation**: primary nav = Home, What We Do, Case Studies, Approach, Insights, Request a Proposal (FR-005). Secondary-audience links (For Creators, Partners) are `quiet` to preserve ecommerce-first hierarchy (FR-029/FR-030/SC-017).

---

## Entity: Pillar (data module `src/data/pillars.ts`)

| Field | Type | Notes |
|---|---|---|
| `key`* | enum | `demand` \| `storefront` \| `retention` \| `intelligence` |
| `name`* | string | |
| `role`* | string | Its function in the connected system |
| `services`* | array<ref services> | Members |
| `lineRole`* | string | How the Line enters/leaves this pillar (Infinite Universe wiring) |

Brand & Content is modeled as a **supporting foundation** spanning all four pillars (not a fifth pillar).

---

## Form model: ProposalRequest (`src/data/proposalSchema.ts` + `lib/validation.ts`)

Captured fields (FR-021) — only necessary PII. `*` = required.

| Field | Type | Required | Validation |
|---|---|---|---|
| `name`* | text | yes | non-empty, ≤120 chars |
| `email`* | email | yes | valid email format |
| `company`* | text | yes | non-empty |
| `websiteUrl` | url | no | valid URL if present |
| `businessType`* | select | yes | from options (ecommerce brand, creator/digital product, agency/white-label, early-stage, other) |
| `currentSituation` | textarea | no | ≤2000 chars |
| `primaryChallenge`* | textarea | yes | non-empty, ≤2000 |
| `goals` | textarea | no | ≤2000 |
| `growthAreas` | multiselect | no | subset of pillars/services |
| `timeline` | select | no | from options (ASAP, ≤3 mo, 3–6 mo, exploring) |
| `budgetContext` | select/text | no | optional; no exclusion/threshold logic |
| `details` | textarea | no | ≤4000 |
| `privacyAck`* | checkbox | yes | must be true (FR-027) |
| `_hp` (honeypot) | hidden | — | must be empty (spam) |
| `_ts` (render time) | hidden | — | submit-timing check |

**States** (see contracts/proposal-form.md): `idle → validating → submitting → success | error(retryable)`.

**Rules**:
- Submission blocked until all `*` valid; errors are field-level and screen-reader-announced (FR-022/FR-024).
- Duplicate guard: identical payload within a short window is de-duplicated/blocked client-side; server enforces authoritatively later (FR-025).
- Honeypot filled or implausibly fast submit → treated as spam, not a qualified request (FR-026).
- Success state states what happens next + expected response window (FR-023).
- Failure preserves entered data + offers retry, no sensitive detail (FR-024).
- No account/login (FR-020).

## Form model: ContactMessage

Lighter subset: `name*`, `email*`, `message*`, `privacyAck*`, `_hp`, `_ts`. Same validation/state/spam/privacy standards (FR-028).

---

## Shared embedded types

- **CTA**: `{ label*, href*, style: primary|secondary }` — primary points to Request a Proposal.
- **ImageAsset**: `{ src*, alt*, decorative: boolean, width, height }` — `decorative:true` ⇒ rendered `alt=""`; width/height required to prevent CLS.
- **SeoMeta**: see `contracts/seo-metadata.md`.
- **PillarLink**: `{ pillar*, relationship* }`.

## Integrity invariants (build-time / test-enforced)

1. Every `services`, `caseStudies`, `insights` entry has a valid `seo` block and unique `slug`.
2. Every image field has non-empty `alt` **or** `decorative:true`.
3. No proof (`metric`/`testimonial`/`logo`) renders as verified unless `assetStatus:"approved"` (and metrics `verified:true`).
4. Primary nav contains exactly the six required destinations; secondary-audience links are `quiet`.
5. The five priority services exist with `kind:"priority"`; Retention & Intelligence exist with `kind:"pillar"`.
6. Every Service has ≥1 pillar connection and a CTA.

These invariants are covered by `tests/unit/schema.test.ts`.
