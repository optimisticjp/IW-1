# Contract: Content Collections

**Feature**: 001-marketing-website | **Type**: internal content interface (Astro collections)

Defines the shape every content author (and future CMS/import) must satisfy. Validated at build time by `src/content/config.ts` (zod). Full field lists live in [../data-model.md](../data-model.md); this contract fixes collection names, required keys, and invariants that downstream layouts and tests depend on.

## Collections

| Collection | Path | Renders via | Required keys (minimum) |
|---|---|---|---|
| `services` | `src/content/services/*` | `ServiceLayout`, `services/[slug]` | `slug, title, kind, pillar, summary, heroStatement, problem, causeEffect, connections[≥1], cta, seo` |
| `caseStudies` | `src/content/caseStudies/*` | `CaseStudyLayout`, `case-studies/[slug]` | `slug, client, title, context, problem, systemsInvolved, whatChanged, howConnected, relevantServices[≥1], nextAction, assetStatus, seo` |
| `insights` | `src/content/insights/*` | `ArticleLayout`, `insights/[slug]` | `slug, title, intent, excerpt, body, seo` |
| `testimonials` | `src/content/testimonials/*` | `TestimonialModule` | `id, quote, attribution, assetStatus` |
| `logos` | `src/content/logos/*` | `LogoWall` | `id, name, image{src,alt}, assetStatus` |
| `site` | `src/content/site/*` | global copy, `LegalLayout`, `FaqModule` | key-scoped copy blocks (nav labels, footer, legal bodies, global FAQ) |

## Invariants (build fails if violated)

1. `slug` is unique within its collection and URL-safe.
2. `services`: exactly five entries with `kind:"priority"` using the fixed priority slugs; `retention` & `intelligence` exist with `kind:"pillar"`; every entry has ≥1 `connections` and a `cta`.
3. `caseStudies`: `relevantServices` references resolve to existing `services`; any `results[].verified !== true` or `assetStatus !== "approved"` renders with a pending/placeholder treatment.
4. Every image object provides non-empty `alt` **or** `decorative:true`, plus `width`/`height`.
5. Every `services`/`caseStudies`/`insights` entry carries a valid `seo` block (see `seo-metadata.md`).
6. `placeholder`/`assetStatus` flags are present so a single grep enumerates all replaceable content.

## Replaceability contract

- Swapping a placeholder = editing the collection file only; **no layout edits**.
- Adding a new case study / insight / service = adding a new file that satisfies the schema; routing (`[slug]`) picks it up automatically.
- Flipping `assetStatus: "pending" → "approved"` (and `verified: true` for metrics) is the single switch that promotes proof from placeholder to verified rendering.

## Test hooks

`tests/unit/schema.test.ts` asserts invariants 1–6 against the seeded placeholder content, guaranteeing the content interface stays valid as entries are added or replaced.
