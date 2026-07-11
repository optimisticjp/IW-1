# Phase 1 Data Model: Infinite Weblinks Multipage Website Restructure

**Feature**: `002-website-restructure` | **Date**: 2026-07-11 | **Plan**: [plan.md](./plan.md)

Derived from the spec's Key Entities and Functional Requirements. Structured entities are typed TS modules under `src/data`; editorial entities (Case study, Article) are Astro content collections under `src/content`. All ids are stable kebab-case slugs. No server-side storage; the only runtime-mutable state is the visitor's in-session Map Your Stack selection (URL + memory only).

## Enumerations

- **CapabilityId**: `build | attract | convert | retain | connect | scale`
- **CapabilityColour** (DESIGN.md): Build indigo `#533afd`, Attract pink `#ff4d8b`, Convert amber `#f5a623`, Retain green `#12b886`, Connect purple `#9b6bf2`, Scale coral `#ff6a4d`; each with `-soft/-deep/-solid/-on/-on-dark` variants.
- **AudienceId**: `ecommerce-brands | creators-and-experts | startups-and-new-brands | growing-teams | established-teams | agency-partners`
- **ServiceTreatment**: `page | section` (dedicated page vs anchored section within a parent capability)
- **PageType**: `core | capability | service | audience | work-index | case-study | insights-index | article | conversion | utility`
- **GoalId** (Growth Graph): `more-sales | lower-ad-waste | more-repeat-customers | know-whats-working | save-team-time`
- **ToolId** (Map Your Stack): `website | store | google-ads | social | tracking | crm | email | whatsapp | ai`
- **PermissionState** (case study): `named | anonymized | interim`
- **SubmissionOutcome**: `accepted | recoverable-failure`
- **LayoutMode** (graph): `radial | vertical`

## Entity: Capability (`src/data/capabilities.ts`)

One of six. Powers `what-we-do/[capability]` and the mega-menu.

| Field | Type | Rules |
|---|---|---|
| id | CapabilityId | unique; one of six |
| name | string | sentence case |
| colour | CapabilityColour token ref | must resolve to a defined variant set |
| descriptor | string | one line for mega-menu |
| outcomeHero | string | promise, no flagged claims |
| problems | string[] | ≥3 recognisable problems, distinct per capability |
| specialistList | string[] | progressive-disclosure detail |
| connectionStory | string | how it supports the other five |
| serviceIds | ServiceId[] | all services mapped to this capability |
| proofRefs | CaseStudyId[] | may be empty → honest interim state |
| faqIds | FaqId[] | distinct set |
| actionLabel | string | matches destination CTA |
| relatedCapabilityIds | CapabilityId[] | for the sibling switcher |

**Validation**: all six ids present and unique; `serviceIds` reference existing services whose `capabilityId` points back (bidirectional integrity); colour resolves; problems/specialist/faq sets are non-empty and not identical to a sibling's (FR-012).

## Entity: Service (`src/data/services.ts`)

A specific offering under exactly one capability. Powers `services/[service]` (when `treatment: page`) or an anchored section within its parent capability (when `treatment: section`).

| Field | Type | Rules |
|---|---|---|
| id | ServiceId | unique |
| name | string | sentence case |
| capabilityId | CapabilityId | exactly one (FR-015) |
| treatment | ServiceTreatment | `page` for launch-set + unique-intent; `section` otherwise |
| launchSet | boolean | true for the seven launch pages |
| primaryAudienceIds | AudienceId[] | audiences this service serves |
| searchIntent | string | unique buyer intent (guards against thin duplicates) |
| deliverables | string[] | plain-language "what the visitor receives" |
| connections | string[] | "what it connects with" |
| specialistTools | string[] | progressive disclosure |
| faqIds | FaqId[] | own FAQs |
| relatedServiceIds | ServiceId[] | siblings |
| actionLabel | string | matches destination |

**Validation**: exactly one `capabilityId`; canonical placement enforced (Landing Pages only under Convert; CRM only under Connect; AI-search is a section under SEO, never standalone GEO/AEO; testing canonical on Conversion Optimisation with Scale linking to it; Amazon advertising under Paid Advertising, management under Scale) (FR-016). Any service without unique `searchIntent` must be `treatment: section` (no thin pages, FR-015/SC-003). Launch set = exactly the seven confirmed services with `treatment: page` and `launchSet: true`.

## Entity: Audience (`src/data/audiences.ts`)

One of six visitor situations. Powers `who-we-help/[audience]`.

| Field | Type | Rules |
|---|---|---|
| id | AudienceId | unique; one of six |
| name | string | sentence case |
| situation | string | distinct situation |
| language | string[] | audience's own words |
| concerns | string[] | distinct concerns |
| desiredOutcomes | string[] | |
| relevantServiceIds | ServiceId[] | services this audience buys (differ across audiences) |
| educational | string | audience-appropriate teaching |
| objections | string[] | |
| actionLabel | string | matched CTA (e.g. "Discuss ecommerce growth") |
| graphVariant | GoalId or preset | audience-appropriate Growth Graph variant |
| specialistDepth | string | |

**Validation**: all six present and unique; `relevantServiceIds` reference existing services; each audience defines a distinct situation/concerns set and a matched action label whose text matches its destination (FR-017/018, User Story 5).

## Entity: FAQ (`src/data/faqs.ts`)

| Field | Type | Rules |
|---|---|---|
| id | FaqId | unique |
| question | string | front-loaded |
| answer | string | plain-English; ban list applies |
| scope | `home \| capability \| service \| audience \| hub` | placement |

**Validation**: unique ids; answers pass the copy ban list (FR-036); rendered in single-open accordions that keep expanded state accessibly (FR-034).

## Entity: Internal-link map (`src/data/links.ts`, helpers in `src/lib/links.ts`)

Encodes contextual link rules (FR-006): every capability → its services; every service → siblings + served audiences; every article → one capability + one audience + two related articles; problem-first statements → matching capability/audience.

**Validation**: no dangling references; article link rule satisfied for every article; descriptive link text (no bare "learn more" where a specific label fits).

## Entity: Growth Graph model (`src/data/growthGraph.ts` + `src/lib/graphGeometry.ts`, `graphLayout.ts`)

Shared node set, hub, capability-coloured links (real relationships only), goals and captions, plus per-context variant.

| Field | Type | Rules |
|---|---|---|
| nodes | Node[] | id, label, capability colour, position seed |
| links | Link[] | source, target, real relationship only |
| goals | Goal[] | five: GoalId + caption; includes `save-team-time` |
| captions | Record<GoalId,string> | available as text; announced on change |
| layoutMode | LayoutMode | radial ≥720px, vertical <720px |
| accessibilityText | string | equivalent meaning without motion |

**Validation**: five goals including "Save team time"; links represent only real relationships; every goal has a text caption; radial/vertical selection at the 720px boundary; reduced-motion path shows the complete selected state (FR-020/021).

## Entity: Stack tool and rule (`src/data/stackTools.ts`, `src/data/stackRules.ts`; logic in `src/lib/stackEval.ts`)

| Tool field | Type | Rules |
|---|---|---|
| id | ToolId | one of nine; maps to a graph node |
| label | string | plain name |
| helperText | string? | optional examples |

| Rule field | Type | Rules |
|---|---|---|
| requiredGroups | ToolId[][] | AND of OR-groups: satisfied when each group has ≥1 selected |
| title | string | connection name |
| valueWhenInPlace | string | plain benefit |
| gapCost | string | plain opportunity cost, no fear framing |
| colour | CapabilityColour | capability grouping |
| priority | number | defines result order; preserved |
| serviceLink | ServiceId or CapabilityId | where the opportunity routes |

**Evaluation rules (pure, testable — `stackEval.ts`)**: a rule is `in place` when every required group is satisfied; `gap` when at least one required tool/group is selected but the rule is not fully satisfied; `not relevant` (excluded from score and results) when none of its tools are selected. Score: `relevant = inPlace + gap`; `percentage = inPlace / relevant` (zero-relevant handled safely, no divide-by-zero). Bands: 0–40% `Fragmented`; >40–70% `Partly connected`; >70–100% `Well connected`. Results cap: top 3 gaps, top 2 working, in priority order. No fake score-out-of-100; no invented statistics (FR-023/024).

## Entity: Consultation enquiry (`src/components/forms/BookingForm.astro` + `src/lib/booking.ts`)

Submitted request; no persistence beyond delivery to the configured endpoint.

| Field | Type | Required | Rules |
|---|---|---|---|
| name | string | yes | non-empty |
| email | string | yes | work email; format-validated (`isEmail`) |
| business | string | yes | non-empty |
| privacy | boolean | yes | must be true (acknowledgement) |
| url | string | no | validated when present (`isUrl`) |
| goal | string | no | light qualification |
| obstacle | string | no | |
| closestDescription | string | no | |
| workingModel | string | no | |
| timing | string | no | |
| file | file | no | optional attachment |
| stackContext | string | no | carried from Map Your Stack via allowlist-parsed param |
| _hp | string | no | honeypot; filled → silently dropped as spam |

**No budget field is collected** (FR-026). **Submission**: provider-neutral POST to env endpoint (Formspree AJAX JSON contract: `email` = reply-to, `Accept`/`Content-Type: application/json`); 200 → `accepted`; ≥500 or network throw → `recoverable-failure` (retryable); no endpoint in production → unconfigured, never a false success. **Outcome states**: `accepted` → honest confirmation ("Thank you. We have your enquiry.") with the three-outcomes expectation and no time promise; `recoverable-failure` → answers preserved + retry + direct email fallback (FR-027/028, SC-010).

## Entity: Case study (`src/content/work/*` collection)

| Field | Type | Rules |
|---|---|---|
| title | string | honest |
| capabilityTags | CapabilityId[] | for filtering |
| audienceTags | AudienceId[] | for filtering |
| situation, obstacle, customerExperience, change | string | six-part narrative |
| improvement | string | honest; quantitative only with baseline, period, source |
| lesson | string | one transferable lesson |
| scopedGraph | graph variant ref | shows only parts the project touched |
| permissionState | PermissionState | `named \| anonymized \| interim` |
| slug | string | route id |

**Validation** (Zod): six-part structure present; no invented revenue/conversion/growth figures; anonymized entries use connection-map placeholder art, not fabricated screenshots (FR-031, SC-007). Empty filter combinations render an honest empty state, never a fabricated result.

## Entity: Article (`src/content/insights/*` collection)

| Field | Type | Rules |
|---|---|---|
| questionTitle | string | states the question |
| h1 | string | honest, single H1 |
| standfirst | string | |
| keyPoints | string[] | scannable |
| answer | markdown body | plain-English |
| pitfalls | string[] | what can go wrong, no fear language |
| selfCheck | string | invites Map Your Stack / Review |
| sources | {label,url}[] | cited |
| lastReviewed | date | required |
| capabilityTag | CapabilityId | exactly one |
| audienceTag | AudienceId | exactly one |
| relatedArticleSlugs | string[] | exactly two |

**Validation** (Zod): links to one capability, one audience and two related articles (FR-032); has sources and a last-reviewed date; category/tag views canonicalise to the base index and are not indexable thin pages (FR-040).

## Entity: Page (rendered by thin routes)

Every routable surface: `route`, `title`, `metaDescription`, `canonical`, single `h1`, `sectionSequence`, `primaryCTA`, `secondaryCTA?`, `structuredDataTypes[]`, `breadcrumbTrail[]`, `pageType`. **Validation**: exactly one H1 carrying the main promise; logical heading order (no skipped levels); unique title + meta description; one canonical URL; breadcrumbs on every page below top level with the current page as a non-link matched by BreadcrumbList schema (FR-005/039, SC-011).

## Entity: Navigation model (`src/data/nav.ts`)

Primary items (What we do, How it connects, Who we help, Work, Insights, About) + primary CTA; mega-menu columns (six capabilities + overview link); "Who we help" (six audiences); footer columns (What we do, Who we help, Learn, Company); breadcrumb rules; contextual link rules. **Validation**: current item marked with visible focus outline; mega-menu and mobile sheet keyboard-operable and announced; CTA present in header and closing section of every commercial page (FR-001/002/003/004, SC-002).

## State & relationships (summary)

- Service → exactly one Capability (many-to-one); Capability → many Services (bidirectional integrity).
- Audience → many relevant Services (many-to-many, distinct per audience).
- Article → exactly one Capability + one Audience + two Articles.
- Case study → many Capability tags + many Audience tags.
- Rule → one capability colour + one service/capability link; priority preserved.
- Growth Graph model → many per-context variants (homepage, How It Connects, Review, capability, audience, case study), one engine.
- Consultation enquiry ← optional Map Your Stack selection (allowlist-parsed); runtime-only, no persistence.
