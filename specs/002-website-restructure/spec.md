# Feature Specification: Infinite Weblinks Multipage Website Restructure

**Feature Branch**: `002-website-restructure`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Complete multipage Infinite Weblinks website restructuring, governing specification. Canonical inputs: Final Multipage Website Brief v3.0, DESIGN.md (70% Clay / 30% Stripe visual + Connect/Reveal motion system), Master Website Playbook (approved copy, services, audiences), and the current IW-1 repository as the technical baseline."

## Overview

Restructure the Infinite Weblinks website from a small, mostly flat set of pages into a scalable, multipage connected-growth agency site. The site must make the agency understandable within seconds, give genuine value before asking for anything, represent every real service in a clear hierarchy, and route visitors to one primary action: a free consultation request that the agency reviews and follows up on personally. Two signature interactive experiences carry the idea: the **Growth Graph** (the explanatory backbone) and **Map Your Stack** (the low-friction interactive front door).

This specification governs the restructure. It replaces the retired `specs/001-marketing-website` foundation (the earlier ecommerce-only positioning, "Infinite Universe", four-pillar model, and "Request a Proposal" conversion). Source-of-truth order when inputs disagree: (1) settled business decisions in the request, (2) the Master Website Playbook for copy, scope and audiences, (3) DESIGN.md for the visual and motion system, (4) the current repository for the approved logo, routes and technical baseline.

Two reconciliations are fixed here: the approved infinity-link mark in the repository is the identity mark (DESIGN.md's "deferred, text-only wordmark" placeholder is overridden), and the capability-to-colour mapping follows DESIGN.md (Convert is amber, Scale is coral).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand fast and request a consultation (Priority: P1)

A first-time, possibly non-technical visitor arrives on the homepage, understands within the first screen that this is a connected-growth agency that will handle the digital side of their business, learns at least three useful ideas as they scroll, and reaches a short, low-pressure consultation request. They tell the agency what they are building, what feels difficult, or what they want to improve, submit without a technical brief, and see an honest confirmation that sets expectations for a personal reply.

**Why this priority**: This is the core value and the primary conversion. If only this journey ships, the site already does its main job: explain the agency and generate qualified consultation requests. Everything else deepens or supports it.

**Independent Test**: Load the homepage cold, confirm the first screen states who it is for, what changes and the next action; scroll and confirm at least three value ideas appear before any hard ask; reach the consultation form from both the header and the closing section; submit valid details and see the confirmation with the three-outcomes message; submit invalid details and see specific, accessible errors with no false success.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage first screen, **When** they read only that screen, **Then** they can restate that Infinite Weblinks builds, runs and connects the digital side, and they can see a primary "Book a free call" action and a secondary "Explore what is possible" action.
2. **Given** a visitor anywhere on a commercial page, **When** they look at the header and the closing section, **Then** a consultation call to action is present in both without needing find-in-page.
3. **Given** a visitor on the consultation request page, **When** they submit with only name, work email, business name and the privacy acknowledgement, **Then** the enquiry is accepted and a confirmation ("Thank you. We have your enquiry.") is shown with the three-outcomes expectation.
4. **Given** a submission when the delivery endpoint is not configured or fails, **When** the visitor submits, **Then** the site never shows a false success, keeps the entered answers, and offers a recovery path (retry or a direct email fallback).
5. **Given** a visitor arriving from Map Your Stack, **When** the consultation page loads, **Then** their selected tools pre-fill the context field so they do not repeat themselves.

### User Story 2 - Explore first with Map Your Stack (Priority: P1)

A visitor who is not ready to book taps the tools they already use. The tool shows, in plain language, which valuable connections are in place and which are gaps, groups the result by opportunity area, teaches the underlying idea, and offers a soft, optional handoff into the consultation. The visitor leaves better informed even if they never book.

**Why this priority**: Map Your Stack is the low-friction entry point and the clearest demonstration of the agency's core distinction: tools being present is not the same as tools being connected. It converts curiosity into either a warmer lead or a genuinely useful takeaway.

**Independent Test**: Open Map Your Stack, select two or more tools, confirm connections in place render as solid links and gaps as a distinct pattern (not colour alone), confirm every gap is described as an opportunity in plain language with a link to the relevant work, confirm the result is readable as text and operable by keyboard and on a 360px screen, and confirm the selection carries into the consultation form.

**Acceptance Scenarios**:

1. **Given** a visitor selecting tools, **When** the required tools for a valuable connection are all selected, **Then** that connection is shown as "in place"; when at least one is missing, it is shown as a "gap" with a plain-language opportunity description.
2. **Given** any result, **When** the visitor reads it, **Then** no invented statistic, revenue-leak figure, or "your business is broken" framing appears, and present connections are affirmed plainly.
3. **Given** a mobile visitor at 360px, **When** they use the tool, **Then** it presents as a tap-to-add, tap-to-connect list with a live-region announcement of changes and touch targets of at least 44px, with no horizontal scroll.
4. **Given** reduced-motion preference, **When** links appear, **Then** final solid or gap states are shown without continuous motion, and the result remains fully understandable.

### User Story 3 - Learn how it all connects (Priority: P2)

A visitor wants to understand the idea before committing. They meet the Growth Graph on the homepage (choose an outcome and watch the relevant parts connect), go deeper on the How It Connects page (the five links every business should understand, worked examples, the anatomy of a disconnected sale, a self-check), and can request a Growth Graph Review, a real diagnostic conversation rather than a disguised sales call.

**Why this priority**: The Growth Graph is the one named concept and the signature experience. It turns "connected" from a claim into something the visitor can see and understand, and it feeds a second, diagnostic conversion.

**Independent Test**: On the homepage, select each Growth Graph goal and confirm the plain flow and caption update and are announced; navigate to How It Connects and confirm the five links, worked examples and self-check are readable without motion; request a Growth Graph Review and confirm it is framed as a diagnostic, not an instant revenue estimate.

**Acceptance Scenarios**:

1. **Given** the homepage Growth Graph, **When** the visitor selects a goal (More sales, Lower advertising waste, More repeat customers, Know what is working, Save team time), **Then** the active flow and caption change, the caption is available as text and announced on change, and the graph is operable by keyboard.
2. **Given** reduced motion, **When** the Growth Graph loads or a goal is selected, **Then** the final connected state is shown with the caption available as text and no continuous movement.
3. **Given** a visitor on How It Connects, **When** they read the page without animation, **Then** each of the five links and the worked examples are understandable, and a self-check invites them into Map Your Stack or a Growth Graph Review.

### User Story 4 - Find and understand the right service (Priority: P2)

A visitor navigates from a top-level idea (What we do) into a capability page, and from there into a dedicated service page that answers their specific intent, explains the offer and deliverables in plain language, shows what it connects with, exposes specialist detail without forcing it, and routes to a consultation with a label that matches the destination. A visitor who cannot name a service can instead start from a plain-English problem statement.

**Why this priority**: The scalable capability-and-service hierarchy is how the site represents every real service without overwhelming anyone, and how it captures specific search and buyer intent.

**Independent Test**: Open the What We Do mega-menu, enter a capability page, confirm the shared section sequence and the capability's own colour, problems and proof; enter a service page beneath it and confirm breadcrumb, parent up-link, deliverables, a "what it connects with" section, progressive specialist detail, related services and a matching CTA; use the problem-first entry and confirm each problem routes to the right capability or audience.

**Acceptance Scenarios**:

1. **Given** the What We Do mega-menu, **When** it opens, **Then** the six capabilities appear as columns with one-line descriptors and top service links, plus a link back to the capability overview.
2. **Given** a capability page, **When** it is compared with its five siblings, **Then** all six share the section sequence and component set but differ in colour, recognisable problems, specialist lists, proof and FAQ, and each shows how it supports the others.
3. **Given** a dedicated service page, **When** it is reviewed, **Then** it carries unique buyer intent, a distinct problem, its own specialist detail and its own FAQs, and does not duplicate a sibling; any service without enough unique intent is a clearly-anchored section within a parent instead of a thin page.
4. **Given** the problem-first entry, **When** a visitor selects a plain problem statement, **Then** it routes to the matching capability or audience page with a helpful response.

### User Story 5 - Self-identify by audience (Priority: P2)

A visitor recognises their own situation on an audience page (ecommerce brand, creator or expert, startup or new brand, growing team, established team, agency partner), sees the agency through their language and concerns, and is routed to the services most relevant to them and a CTA matched to their situation.

**Why this priority**: Audience self-selection lets a coach, a founder, an in-house team lead and a store owner each see themselves under one broad promise, and supports audience-fit search intent.

**Independent Test**: From Who We Help, open each of the six audience pages, confirm each uses that audience's language and concerns, links to the specific services that audience buys, offers an audience-appropriate Growth Graph variant, and ends on the correct CTA.

**Acceptance Scenarios**:

1. **Given** the six audience pages, **When** they are compared, **Then** each defines a distinct situation, language, set of concerns and desired outcomes, and links to different relevant services, while keeping the same universal promise.
2. **Given** an audience page, **When** the visitor reaches the end, **Then** the CTA label matches the audience (for example "Discuss ecommerce growth", "Support our team", "Discuss agency support") and matches its destination.

### User Story 6 - Evaluate proof honestly (Priority: P3)

A visitor looks for evidence. They browse Work, filter by capability or audience, and read a case study that explains the situation, the obstacle, the change, the improvement and one transferable lesson, with a small graph showing only the parts the project touched. While approved proof is limited, the site behaves honestly and never simulates a fuller portfolio than exists.

**Why this priority**: Proof supports every claim, but it must never invent figures. This journey is important but depends on owner-supplied, permissioned content, so it ranks below the core conversion and education journeys.

**Independent Test**: Open the Work index, apply capability and audience filters, confirm an empty-filter message when nothing matches, open a case study and confirm the six-part structure and honest outcome language, and confirm no invented revenue, conversion or growth figures appear anywhere.

**Acceptance Scenarios**:

1. **Given** the Work index with filters, **When** a filter combination has no matching projects, **Then** an honest empty state explains this and offers to remove a filter or browse all work.
2. **Given** any work or case-study surface, **When** an outcome is stated, **Then** a quantitative result appears only with a defensible baseline, period and source; otherwise a verified qualitative or operational change is described, with no invented figures.
3. **Given** an unnamed client, **When** the project is presented, **Then** it is clearly a real project, honestly anonymized, using connection-map placeholder art rather than a fabricated screenshot.

### User Story 7 - Research through Insights (Priority: P3)

A visitor researching a decision reads an Insights article that answers a real question in plain language, leaves them better informed, and links up to a relevant capability, across to a relevant audience, and out to two related articles, forming a topic cluster that also leads gently toward a consultation.

**Why this priority**: Insights builds authority and captures search demand, and it supports the sale without being a generic blog. It depends on editorial content and so follows the structural journeys.

**Independent Test**: Open an article, confirm it states the question in the title and an honest H1, gives scannable key points, answers plainly, notes what can go wrong without fear language, cites sources and a review date, and links to one capability, one audience and two articles.

**Acceptance Scenarios**:

1. **Given** an article, **When** it is reviewed, **Then** it leaves the reader able to make a better decision even if they never become a client, avoids clickbait, and carries sources and a last-reviewed date.
2. **Given** category and tag views, **When** a visitor filters by topic, capability or audience, **Then** the filtered views resolve to a canonical base index and are not indexable thin pages.

### User Story 8 - Trust the human story (Priority: P3)

A visitor reads About and understands why the agency exists (to take the digital side off talented people's plates and to connect the parts for larger teams), meets real people and named expertise where available, and sees values demonstrated through behaviour (honest placeholders, no invented figures, no over-promised AI) rather than claimed.

**Why this priority**: About converts trust, especially for larger teams, but it is a supporting page that depends on owner-supplied people and photography.

**Independent Test**: Open About, confirm the two-audience story, the operating philosophy, the plain five-step process, honest credentials (no invented awards or "world-class" claims), and a "Start a conversation" CTA.

**Acceptance Scenarios**:

1. **Given** About, **When** it is read, **Then** it presents the reason the agency exists for both entrepreneurs and larger teams, shows the process, and makes no invented award, client count or superlative claim.

### User Story 9 - Same meaning on any device and with assistive technology (Priority: P1, cross-cutting quality gate)

Any visitor, on a 360px phone, with a keyboard only, with a screen reader, with reduced-motion enabled, or with scripting unavailable, gets the same meaning and can complete the same core tasks. The site works from small screens upward, never overflows horizontally down to 320px, keeps the primary CTA reachable, and degrades interactive experiences to readable static states.

**Why this priority**: This is a non-negotiable quality gate from the constitution and the brief. It applies across every other story and must be verified as its own journey.

**Independent Test**: Complete the core conversion and both interactive experiences using keyboard only, then a screen reader, then reduced-motion, then a small-mobile viewport, then with scripting disabled; confirm equivalent meaning, no horizontal overflow to 320px, visible focus throughout, and a reachable primary CTA in each condition.

**Acceptance Scenarios**:

1. **Given** keyboard-only navigation, **When** a visitor traverses the header, mega-menu, mobile sheet, tabs, accordions, the Growth Graph and Map Your Stack, and the forms, **Then** every interaction is operable, focus is a visible outline independent of shadow, and no interaction is pointer-only.
2. **Given** a screen reader, **When** the Growth Graph or Map Your Stack changes state or a form is validated, **Then** the change is announced through a live region and the meaning is available as text.
3. **Given** scripting unavailable, **When** any page loads, **Then** all meaningful content and the core message are present and the interactive tools degrade to readable static states.
4. **Given** any viewport from 320px upward, **When** a page is viewed, **Then** there is no horizontal scroll, touch targets are at least 44px, and the primary CTA is never buried below deep scroll.

### Edge Cases

- **Consultation delivery not configured or failing**: never show success; preserve answers; offer retry and a direct email fallback; the confirmation state is reached only on a genuine accept.
- **Map Your Stack with fewer than two tools, or none**: the reveal/handoff is gated and the state is explained; the result never implies a verdict from no input.
- **Map Your Stack handoff parameter tampering**: the carried selection is parsed against an allowlist so unknown or malicious values are ignored and cannot inject content; the consultation page works with no parameter.
- **Work or Insights filters with no matches**: honest empty state, never a fabricated result; filtered views do not become indexable thin pages.
- **Proof not yet available**: honest interim states on the homepage and Work index; no simulated portfolio; placeholder connection-map art carries no invented client or result.
- **Unknown route (404)**: on-brand page, correct no-index, links back to Home and to the consultation, excluded from the sitemap.
- **Reduced motion, background tab, and off-screen**: motion resolves to final states, timed and looped motion pauses when the tab is hidden and resumes without replaying, and off-screen work does not animate.
- **Long service-page titles and long tokens or URLs in headings**: wrap to two or three lines with editorial breaks rather than shrinking, and never cause horizontal overflow.
- **A service with insufficient unique intent**: becomes an anchored section within its parent rather than a thin dedicated page.
- **AI, search and results claims**: no guaranteed AI citation or ranking, no guaranteed commercial result; "can help" and "makes it easier to" phrasing only.

## Requirements *(mandatory)*

### Functional Requirements

**Global navigation, chrome and footer**

- **FR-001**: The site MUST provide a sticky primary navigation with six top-level items (What we do, How it connects, Who we help, Work, Insights, About) plus one primary call to action ("Book a free call"), with the current item marked and a visible focus outline.
- **FR-002**: "What we do" MUST open a mega-menu presenting the six capabilities with one-line descriptors and top service links plus a link to the capability overview; "Who we help" MUST present the six audiences.
- **FR-003**: Mobile navigation MUST be a full-height, focus-trapped sheet that is dismissible by Escape and by selecting a link, with the mega-menu flattened into expandable groups and the primary CTA pinned at the bottom; menu state MUST be announced.
- **FR-004**: The footer MUST present the brand block (infinity mark, wordmark, slogan and company description), a primary CTA, link columns (What we do, Who we help, Learn, Company), a newsletter opt-in, and a legal row (Privacy, Cookies, Terms).
- **FR-005**: Every page below the top level MUST show breadcrumbs with the current page as a non-link, matched by breadcrumb structured data.
- **FR-006**: Body copy MUST use descriptive internal link text (never "learn more" where a specific label fits); every capability page links to its services, every service page links to siblings and to the audiences it serves, and every article links to one capability, one audience and two related articles.

**Homepage**

- **FR-007**: The homepage MUST present, in order, the approved sections: Hero, Immediate value, The problem, Three starting points (Launch, Connect, Scale), Anatomy of one customer journey, The Growth Graph, Six capabilities, Start with the problem, Modern search and AI, How we work, Work and proof, Why Infinite Weblinks, Homepage FAQ, and Final CTA, using the finalised copy.
- **FR-008**: The first screen MUST state who the page is for, what changes and the next action, with a primary and a secondary CTA, and MUST render its meaning without depending on motion.
- **FR-009**: The homepage MUST teach at least three useful ideas before any hard ask, and MUST introduce the Growth Graph as the single dark centrepiece.
- **FR-010**: The three starting points MUST route to the matching audiences, and the six capability blocks MUST each link to their capability page.

**Capability pages (six)**

- **FR-011**: Each of the six capability pages (Build, Attract, Convert, Retain, Connect, Scale) MUST follow the shared section sequence: hero, recognition, useful principle, what we do, what becomes possible, the connection, specialist detail, proof, FAQ, CTA.
- **FR-012**: Each capability page MUST own its capability colour, a distinct set of recognisable problems, a distinct specialist list, distinct proof and distinct FAQs, and MUST show how it supports the other five, with a persistent sibling switcher.
- **FR-013**: Specialist detail MUST be available under clear headings as progressive disclosure, understandable-value-first, and never hidden behind weak content.

**Service pages (dedicated) and sections**

- **FR-014**: Dedicated service pages MUST follow the service-page structure (who it is for, the problem, what we do, what the visitor receives, how the work happens, what it connects with, relevant tools as progressive disclosure, a useful educational module, proof, FAQs, related services, CTA) and MUST carry a breadcrumb and a parent up-link.
- **FR-015**: Every service MUST be mapped to exactly one capability and given a treatment (dedicated page or anchored section) per the service architecture; overlapping services MUST merge to a parent with anchored sections rather than become thin duplicates.
- **FR-016**: Canonical placement MUST be enforced: Landing Pages exists once under Convert; CRM once under Connect; AI-search is a section of SEO (never a standalone "GEO/AEO" service); testing is canonical on Conversion Optimisation with Scale linking to it; Amazon advertising sits under Paid Advertising and management under Scale.

**Audience pages (six)**

- **FR-017**: Six audience pages (Ecommerce brands, Creators and experts, Startups and new brands, Growing teams, Established teams, Agency partners) MUST each follow the global page pattern and define situation, language, concerns, desired outcomes, relevant services, educational content, proof, objections, CTA, internal links, visual treatment and specialist depth.
- **FR-018**: Each audience page MUST offer an audience-appropriate Growth Graph variant and cross-link to the specific services that audience buys and back to the overview.

**How It Connects and the Growth Graph ecosystem**

- **FR-019**: How It Connects MUST be the educational hub built on the Growth Graph spine: the five links every business should understand, worked Growth Graph examples, the anatomy of a disconnected sale, and a self-check, all understandable without motion.
- **FR-020**: The Growth Graph MUST be one model expressed at different depths (homepage centrepiece, How It Connects spine, Growth Graph Review offer, and lighter capability, audience and case-study variants) with a consistent node language, hub, capability colours and accessibility contract.
- **FR-021**: The Growth Graph MUST provide goal selection with real controls and selected states, a caption available as text and announced on change, a radial layout on larger screens and a vertical layout on small screens, keyboard operability, and a reduced-motion path that shows the complete selected state.
- **FR-022**: The Growth Graph Review MUST be presented as a genuine diagnostic conversation that returns a simple map, the clearest gaps, prioritised next steps and a recommended starting scope, and MUST NOT be framed as an instant revenue estimate or a disguised sales call.

**Map Your Stack**

- **FR-023**: Map Your Stack MUST let a visitor select from the plain tool set, evaluate connections client-side with a rules model where a connection is "in place" only when all required tools are selected, and present connections in place as solid links and gaps as a distinct pattern (not colour alone), grouped by opportunity area.
- **FR-024**: Map Your Stack results MUST describe gaps as opportunities in plain language with a link to the relevant capability or service, affirm present connections plainly, and contain no invented statistics or revenue-leak estimates.
- **FR-025**: Map Your Stack MUST store nothing server-side, keep selections in the URL and session only, state that plainly, present a tap-to-add and tap-to-connect list on small screens with a live region, and hand the selection to the consultation form via an allowlist-parsed parameter that is optional.

**Consultation, contact and states**

- **FR-026**: The consultation request MUST be a single short form with the playbook fields, where only name, work email, business name and the privacy acknowledgement are required, and starting-point, working-model and budget fields qualify lightly without gatekeeping.
- **FR-027**: The form MUST validate on blur and on submit with specific, accessible errors (icon plus text, never colour alone), include spam protection, and submit through a provider-neutral path that never reports a false success and offers a direct email fallback on failure.
- **FR-028**: On a genuine accept, the visitor MUST reach an honest confirmation ("Thank you. We have your enquiry.") that reassures they need not resend, states the three-outcomes follow-up expectation, and points onward; a separate post-booking state MUST explain what to bring.
- **FR-029**: A written enquiry route (Contact) and an optional "prefer to talk" scheduling step MUST be offered; the newsletter MUST be opt-in and separate from the enquiry.
- **FR-030**: The site MUST provide confirmation, error and empty states across the experience: form success and failure, Work and Insights empty filters, a no-input tool state, and an on-brand 404 that is no-indexed and excluded from the sitemap.

**Work, Insights, About, FAQ**

- **FR-031**: Work MUST provide capability and audience filters, an honest empty state, an honest interim state while proof is limited, and a case-study template answering six questions with a small scoped graph and related-service links.
- **FR-032**: Insights MUST provide topic categories, an article template (question title, honest H1, scannable key points, plain answer, what can go wrong without fear language, a self-check, sources and a last-reviewed date, and cluster links), and internal linking that forms topic clusters with capability and How It Connects pages as hubs.
- **FR-033**: About MUST present the two-audience story, the operating philosophy, the plain five-step process and honest credentials, with real people and photography where available and no invented awards, counts or superlatives.
- **FR-034**: An FAQ hub MUST answer the recurring uncertainties, with single-open accordions that maintain expanded state and reveal content accessibly.

**Content, voice and proof honesty**

- **FR-035**: All customer-facing copy MUST be plain-English-first with a two-layer structure (business meaning, then optional specialist detail), business outcome before technical method, short scannable paragraphs, front-loaded headings and links, sentence case, and distinctive per-page wording rather than repeated template copy.
- **FR-036**: Copy MUST avoid em dashes, empty superlatives (world-class, revolutionary, cutting-edge, best-in-class), buzzwords (leverage, synergy, seamless, holistic, empower, unlock, robust), fear-heavy framing, and blaming the visitor; and MUST NOT name a tool as a solution before explaining the problem.
- **FR-037**: Claims MUST use "can help", "makes it easier to" or "gives the platform better information" rather than guaranteeing a commercial result; no page MUST make the flagged claims (cut ad costs, double conversion, predictable growth, know exactly where every sale came from, guaranteed rankings or AI recommendations, replace your team) or show invented revenue, conversion or growth figures.
- **FR-038**: The two brand promises MUST be preserved and used consistently: "You focus on your work. We handle the digital side." and "We build it, run it and connect every part."

**Metadata, SEO, internal links and CTAs**

- **FR-039**: Every indexable page MUST have exactly one H1 carrying the main promise, a logical heading order with no skipped levels, a per-page title and meta description in the approved patterns, and one canonical URL.
- **FR-040**: Filtered Work and Insights views MUST canonicalise to their base index; structured data MUST be applied only to content visible on the page (Organization, WebSite, WebPage, BreadcrumbList, Article, and Service or Product only where the visible page supports it).
- **FR-041**: A deliberate crawler policy MUST be provided that separates search-discovery crawlers from model-training crawlers, and a generated sitemap MUST include public routes and exclude the 404.
- **FR-042**: CTA labels MUST be consistent between a button and its destination, and each capability and audience MUST use its specific, matching action label.

**Design, motion, mobile (experience requirements)**

- **FR-043**: The visual system MUST apply the approved 70% Clay / 30% Stripe direction: a light-first warm cream floor, the six capability colours with their accessible variants, one sans across every role with a mono for eyebrows, nodes, signals and data at a weight ceiling of 600, asymmetric editorial layouts, and the dark Growth Graph as the one high-impact dark environment; the approved infinity mark is preserved.
- **FR-044**: Colour usage MUST meet the design contrast matrix; white text MUST NOT sit on a bright non-Build capability fill (use the solid or ink variant); focus MUST always be a visible outline independent of shadow.
- **FR-045**: Motion MUST be limited to two families, Connect and Reveal; every animation MUST explain a relationship, a journey or a changing state; motion MUST pause off-screen and when the tab is hidden, the only permitted loop is the subtle node pulse, and `prefers-reduced-motion` MUST collapse motion to final states.
- **FR-046**: The experience MUST be mobile-first and verified at 360, 390, 768, 1024 and large desktop with a 320px hard floor and no horizontal scroll; every desktop idea MUST have a credible mobile equivalent, touch targets MUST be at least 44px, and the primary CTA MUST never be buried.

### Key Entities

- **Page**: any routable surface with a type (core, capability, service, audience, work index, case study, insights index, article, conversion surface, utility). Attributes: route, title, meta description, canonical, H1, section sequence, primary and secondary CTAs, structured-data types, breadcrumb trail.
- **Capability**: one of six (Build, Attract, Convert, Retain, Connect, Scale). Attributes: name, colour and accessible variants, outcome hero, recognisable problems, service list, specialist list, connection story, proof, FAQ, action label, related capabilities.
- **Service**: a specific offering under one capability. Attributes: name, parent capability, treatment (dedicated page or anchored section), primary audience, search intent, deliverables, connections, specialist tools, FAQs, related services, action label.
- **Audience**: one of six visitor situations. Attributes: name, situation, language, concerns, desired outcomes, relevant services, educational content, objections, action label, Growth Graph variant, specialist depth.
- **Growth Graph model**: the shared node set, hub, capability-coloured links, goals and captions, plus the per-context variant (homepage, How It Connects, Review, capability, audience, case study). Attributes: nodes, links (real relationships only), goals, captions, layout mode, accessibility text.
- **Stack tool and rule**: the tool set a visitor selects and the rules that define valuable connections (an AND of OR-groups) with priority order. Attributes: tool id and helper text, rule required-tool groups, opportunity description, capability grouping, service link.
- **Consultation enquiry**: the submitted request. Attributes: name, work email, business name, optional website, goal, obstacle, closest-description, working model, optional budget, optional timing, optional file, carried Map Your Stack context, required privacy acknowledgement; plus submission outcome (accepted, recoverable failure) and the follow-up expectation.
- **Case study**: a proof surface. Attributes: capability tags, audience tags, situation, obstacle, customer experience, change, improvement (honest, sourced when quantitative), one lesson, scoped graph, permission state (named, anonymized, interim).
- **Article**: an Insights piece. Attributes: question title, H1, standfirst, key points, plain answer, pitfalls, self-check, sources, last-reviewed date, capability tag, audience tag, related links.
- **Navigation model**: the primary items, mega-menu columns, footer columns, breadcrumb rules and contextual link rules that keep a large sitemap understandable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In unmoderated testing, at least 80% of first-time visitors can correctly restate, after viewing only the first screen, that Infinite Weblinks builds, runs and connects the digital side of a business.
- **SC-002**: On every commercial page, a visitor can reach the consultation request from both the header and the closing section without using find-in-page, verified on 100% of commercial pages.
- **SC-003**: 100% of real services from the source scope are represented and correctly placed under exactly one capability, with zero thin or duplicate pages (any service lacking unique intent appears as an anchored section, not a page).
- **SC-004**: The Growth Graph and Map Your Stack are 100% operable and understandable using keyboard only, screen reader (text equivalents and announced changes), and reduced motion (final states), and both clearly separate tools present from tools connected.
- **SC-005**: The site meets WCAG 2.2 Level AA across audited pages, including visible outline focus, the contrast matrix, accessible forms with announced errors, and pointer-free operability.
- **SC-006**: A standard mobile performance audit scores at least 90 (best effort 95+) on audited page types, and the core loading, interactivity and visual-stability measures are in the healthy range.
- **SC-007**: No page makes an unsupported or flagged claim, and no page shows invented revenue, conversion or growth figures; any quantitative result carries a defensible baseline, period and source.
- **SC-008**: Every page renders with no horizontal scroll from 320px upward, and every desktop experience (navigation, both interactives, forms, proof, editorial layouts) has a working mobile equivalent.
- **SC-009**: A visitor who completes Map Your Stack without booking still receives a useful, plain-language result, and when they do continue, their selection carries into the consultation form so they do not re-enter it, verified end to end.
- **SC-010**: A consultation submission never shows a false success; when delivery is unconfigured or fails, the entered answers are preserved and a recovery path is offered, verified for both the accept and the failure paths.
- **SC-011**: 100% of indexable pages have exactly one H1, a logical heading order, a unique title and meta description, and a single canonical URL; filtered views canonicalise to their base index.
- **SC-012**: With scripting unavailable, all meaningful content and the core message are present on every page and the interactive tools degrade to readable static states.
- **SC-013**: A visitor can complete each core journey (understand and convert, explore first, learn how it connects, find the right service, self-identify by audience) without dead ends, with the primary or a matching CTA reachable at the end of each.

## Assumptions

- **Technical baseline preserved**: the current repository (a static-first, content-led site with its sitemap and metadata seams, the provider-neutral submission with a preview-only mock that never runs in production, the Growth Graph and Map Your Stack engines and shared geometry, the accessible chrome, and the honest placeholders) is the preserved baseline. Any change of technical stack is a separate, justified decision and is out of scope here.
- **Identity mark**: the approved infinity-link mark in the repository is the identity mark; DESIGN.md's "logo deferred" placeholder is overridden per the request. The wordmark sits beside the mark.
- **Capability-colour correction**: capability-to-colour mapping follows DESIGN.md (Build indigo, Attract pink, Convert amber, Retain green, Connect purple, Scale coral); the repository's older mapping is corrected.
- **Consultation route**: the primary conversion stays at `/book-a-call` and serves as the free consultation request; "Book a free call" is the primary CTA label sitewide; scheduling is an optional later step.
- **Fifth Growth Graph goal**: "Save team time" is included as the fifth homepage goal unless the owner removes it.
- **Growing Teams audience**: a sixth audience page, Growing Teams, is split from the Established Teams content so the "several tools, no owner" situation is distinct from the enterprise "problems between departments" situation.
- **Service-page phasing**: all 25 dedicated service pages and the six capability pages are in scope; not all ship at once. The default build order follows the roadmap phases, leading with the highest-intent services; any service lacking unique intent remains an anchored section until demand justifies a page.
- **Response-time messaging**: until the owner confirms a window that can be met, the three-outcomes copy sets expectations without a specific time promise.
- **Owner-supplied assets are dependencies, not blockers for structure**: licensed Geist WOFF2 fonts, the production domain (`PUBLIC_SITE_URL`) and booking endpoint (`PUBLIC_BOOKING_ENDPOINT`), founder and team information and photography, at least three real work examples and two or three permissioned case studies, testimonials, verifiable credentials, and legal wording for privacy, cookies and terms. The site behaves honestly (safe fallbacks, honest interim states, no invented proof) until they arrive.
- **Legal wording deferred**: privacy, cookie and terms pages ship interface copy only; jurisdiction-reviewed legal wording is out of scope here.
- **Crawler policy**: the search-discovery versus model-training crawler split is a deliberate decision to be confirmed; the default allows normal search discovery and citation-supporting crawlers.
- **Optional scheduling tool**: if the optional "prefer to talk" scheduling step is enabled, the specific calendar provider is an owner decision; the written consultation request stands alone without it.
- **Voice and constitution**: content follows the playbook voice and the project constitution (spec before code, mobile-first, speed, deliberate design, human-sounding content, SEO, accessibility, security, testing important behaviour, and the definition of done).
