# Contract: SEO, Metadata, Schema, Sitemap & Robots

**Feature**: `002-website-restructure` | Phase 1 | See [routes.md](./routes.md), [data-model.md](../data-model.md)

Implements FR-005/039/040/041/042 and Principle VII. Reuses `src/lib/seo.ts`, `src/lib/schema.ts`, `@astrojs/sitemap`, and `src/pages/robots.txt.ts`.

## Per-page metadata (every indexable page)

- Exactly **one H1** carrying the main promise.
- Logical heading order, no skipped levels.
- Unique `title` and `meta description` in the approved patterns (`buildSeo`).
- Exactly one **canonical** URL, absolute against `PUBLIC_SITE_URL`.
- Open Graph + Twitter tags; default OG image `public/og/infinite-weblinks-default.png` (1200×630) unless a page supplies its own.
- CTA label consistent between button and destination; capability/audience pages use their specific action label.

## Canonical rules

- Core, capability, service, audience, work-index, case-study, insights-index and article pages canonicalise to **self**.
- Filtered Work views (`/work?capability=…&audience=…`) canonicalise to `/work`.
- Insights category/tag views canonicalise to `/insights`; they are **not** indexable thin pages.
- 404 is `noindex`.

## Structured data (visible-only — `schema.ts`)

Applied only to content actually visible on the page:

| Type | Where |
|---|---|
| Organization | site-wide (home/about) |
| WebSite | site-wide |
| WebPage | every page |
| BreadcrumbList | every page below top level (matches the visible breadcrumb; current page a non-link) |
| Article | Insights articles (with `datePublished`/`dateModified` = last-reviewed, author, sources) |
| Service / Product | only where the visible service/capability page supports it |

No schema for off-page, aspirational or non-visible content (honesty; avoids structured-data spam). No invented ratings/review counts.

## Sitemap (`@astrojs/sitemap`)

- Includes all public routes.
- **Excludes** `/404` (filter).
- Absolute URLs from `PUBLIC_SITE_URL` (Astro `site`).
- Filtered/parameterised views are not separate sitemap entries.

## Robots & crawler policy (`robots.txt.ts`, env-aware) — FR-041

Confirmed policy (2026-07-11):

- **Allow** search-discovery crawlers (Googlebot, Bingbot, etc.).
- **Allow** AI-search **citation** crawlers, including **OAI-SearchBot** (and equivalents that drive AI-search answers/citations).
- **Block** AI **model-training** crawlers, explicitly **GPTBot**, **CCBot**, **Google-Extended**.
- Reference the sitemap.
- In non-production environments, disallow all (env-aware) to avoid indexing previews.

Example intent (illustrative, not the literal file):
```
User-agent: GPTBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: *
Allow: /
Sitemap: {PUBLIC_SITE_URL}/sitemap-index.xml
```

## Claims & honesty guard (FR-037, SC-007)

- No guaranteed AI citation, ranking or commercial result; "can help" / "makes it easier to" phrasing only.
- No invented revenue/conversion/growth figures; any quantitative result carries a defensible baseline, period and source.
- No "free technical audit", "AI-powered audit", "automatic integration scanner" or "guaranteed growth score" framing for Map Your Stack; described honestly as a quick connection self-check.

## Tests (`tests/unit/seo.test.ts` + extended)

- `buildSeo` produces unique title/description and a single absolute canonical per route.
- Single-H1 and heading-order expectations per rendered page type.
- Schema builders emit only visible-supported types with a valid BreadcrumbList; no invented ratings.
- Sitemap excludes 404; robots emits the exact allow/block lists and references the sitemap; non-prod disallows all.
