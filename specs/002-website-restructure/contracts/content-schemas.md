# Contract: Content Schemas (data modules + collections)

**Feature**: `002-website-restructure` | Phase 1 | See [data-model.md](../data-model.md)

Defines the shape and invariants of structured data modules (`src/data/*`) and editorial content collections (`src/content/*`). Shapes are given as TypeScript-style signatures for clarity; they are the contract, not the implementation.

## Structured data modules (`src/data`)

### `capabilities.ts`
```ts
type Capability = {
  id: 'build'|'attract'|'convert'|'retain'|'connect'|'scale';
  name: string; colour: CapabilityColourToken; descriptor: string; outcomeHero: string;
  problems: string[];            // >= 3, distinct per capability
  specialistList: string[]; connectionStory: string;
  serviceIds: ServiceId[];       // reference services whose capabilityId points back
  proofRefs: CaseStudyId[];      // may be empty -> honest interim state
  faqIds: FaqId[]; actionLabel: string; relatedCapabilityIds: CapabilityId[];
};
export const capabilities: Capability[]; // exactly 6, unique ids
```
Invariants: 6 unique ids; bidirectional service integrity; colour resolves; non-empty problem/specialist/FAQ sets not identical to a sibling's.

### `services.ts`
```ts
type Service = {
  id: ServiceId; name: string; capabilityId: CapabilityId;   // exactly one
  treatment: 'page'|'section'; launchSet: boolean;
  primaryAudienceIds: AudienceId[]; searchIntent: string;    // unique when treatment='page'
  deliverables: string[]; connections: string[]; specialistTools: string[];
  faqIds: FaqId[]; relatedServiceIds: ServiceId[]; actionLabel: string;
};
export const services: Service[];
```
Invariants: exactly one `capabilityId`; canonical-placement rules hold; unique `searchIntent` for every `treatment:'page'` (else `section`); launch set = the seven confirmed services (`treatment:'page'`, `launchSet:true`).

### `audiences.ts`
```ts
type Audience = {
  id: AudienceId; name: string; situation: string; language: string[]; concerns: string[];
  desiredOutcomes: string[]; relevantServiceIds: ServiceId[]; educational: string;
  objections: string[]; actionLabel: string; graphVariant: GoalId|GraphPreset; specialistDepth: string;
};
export const audiences: Audience[]; // exactly 6, unique ids
```
Invariants: 6 unique ids; distinct situations; matched action labels; valid service references.

### `faqs.ts`, `links.ts`, `nav.ts`, `growthGraph.ts`, `stackTools.ts`, `stackRules.ts`
- `faqs.ts`: `{ id, question, answer, scope }[]`; answers pass the copy ban list.
- `links.ts`: internal-link/related-content maps; no dangling refs; article rule (1 capability + 1 audience + 2 articles).
- `nav.ts` (exists): primary items + CTA, mega-menu columns, footer columns, breadcrumb + contextual link rules.
- `growthGraph.ts` (exists): nodes, links (real relationships only), 5 goals incl. `save-team-time`, captions, layout mode, accessibility text.
- `stackTools.ts` (exists): 9 tools `{ id, label, helperText? }` each mapping to a graph node.
- `stackRules.ts` (exists): priority-ordered rules `{ requiredGroups, title, valueWhenInPlace, gapCost, colour, priority, serviceLink }`.

## Editorial collections (`src/content/config.ts`, Zod)

### `work` collection
```ts
z.object({
  title: z.string(),
  capabilityTags: z.array(capabilityEnum),
  audienceTags: z.array(audienceEnum),
  situation: z.string(), obstacle: z.string(), customerExperience: z.string(), change: z.string(),
  improvement: z.string(),           // honest; quantitative only with baseline+period+source
  lesson: z.string(),
  scopedGraph: z.string().optional(), // graph variant ref
  permissionState: z.enum(['named','anonymized','interim']),
})
```
Invariants: six-part narrative present; no invented figures; anonymized → placeholder connection-map art, not fabricated screenshots.

### `insights` collection
```ts
z.object({
  questionTitle: z.string(), h1: z.string(), standfirst: z.string(),
  keyPoints: z.array(z.string()),
  pitfalls: z.array(z.string()),
  selfCheck: z.string(),
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
  lastReviewed: z.date(),
  capabilityTag: capabilityEnum, audienceTag: audienceEnum,
  relatedArticleSlugs: z.array(z.string()).length(2),
})
```
Invariants: exactly one capability + one audience tag; exactly two related articles; sources non-empty; last-reviewed present; body answers plainly.

## Cross-module integrity (tested)

- Every `Capability.serviceIds[i]` resolves to a `Service` whose `capabilityId` equals that capability (bidirectional).
- Every `Service.capabilityId` and `relatedServiceIds`, and every `Audience.relevantServiceIds`, resolve.
- Canonical-placement rules (Landing Pages/CRM/AI-search/testing/Amazon) hold in `services.ts`.
- Every `Article` satisfies the 1-capability + 1-audience + 2-articles link rule.
- Every FAQ answer and all customer-facing copy pass the ban list (no em dashes, superlatives, buzzwords, flagged claims, invented figures).
- Growth Graph has exactly five goals including `save-team-time`; graph links are real relationships only.
