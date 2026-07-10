# Feature Specification: Infinite Weblinks Flagship Marketing Website

**Feature Branch**: `claude/infinite-weblinks-setup-mqvijv`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Infinite Weblinks Website — a flagship, portfolio-quality marketing website for a full-stack ecommerce growth studio, built to generate qualified proposal requests while demonstrating the agency's own capability. Locked positioning ('Connected growth for ecommerce brands'; 'Disconnected growth leaks. Connected growth compounds.'), locked creative concept ('The Infinite Universe' with a single continuous 'Line of value'), four service pillars (Demand, Storefront, Retention, Intelligence) with Brand & Content as a supporting foundation, five priority services, defined site scope, and mandated mobile, accessibility, SEO, performance, security, and conversion requirements."

## Overview

Infinite Weblinks is a full-stack growth studio serving ecommerce brands. This feature is its public marketing website: a single English-language site whose job is to generate **qualified proposal requests** ("Request a Proposal" is the one primary conversion action) while itself standing as evidence of the agency's craft in UI/UX, ecommerce strategy, Shopify and web development, conversion thinking, paid media, social growth, SEO/content architecture, connected growth systems, responsive design, accessibility, and performance discipline.

The site must never become a self-indulgent design showcase that sacrifices clarity, speed, accessibility, trust, or conversion. The signature "Infinite Universe" creative concept and its single continuous "Line of value" are the brand's argument made visible — connected growth systems compound, disconnected systems leak — not decoration.

The positioning, audience, creative foundation, service architecture, and site scope described below are treated as a **locked product foundation**. Requirements express WHAT the site must do and WHY, not the technology used to build it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ecommerce decision-maker evaluates the agency and requests a proposal (Priority: P1)

An ecommerce brand owner or marketing lead (US, UK, CA, AU, NZ, or Europe) arrives on the homepage, immediately recognises the site is for ecommerce brands, understands the "disconnected growth leaks / connected growth compounds" argument, sees how Demand, Storefront, Retention, and Intelligence connect, finds the five priority services, encounters proof beside the relevant claims, understands how the agency works, and is led naturally to Request a Proposal.

**Why this priority**: This is the primary business outcome (qualified proposal requests) via the primary audience and the primary entry point. If only this journey shipped, the site would already deliver its core value.

**Independent Test**: Load the homepage cold, scroll top to bottom, and confirm a first-time ecommerce reader can (a) tell within the first screen that this is for ecommerce brands, (b) restate the connection problem and value proposition after a single scan, (c) locate all five priority services, (d) see at least one contextual proof element beside a claim, and (e) reach a Request a Proposal entry point without using the browser's find function.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the homepage, **When** the first screen renders, **Then** ecommerce relevance and the core connection message are conveyed without scrolling.
2. **Given** a visitor scanning (not reading every word), **When** they scroll through the homepage, **Then** they encounter, in a connected order, the connection problem, the cost of disconnection, how the four pillars connect, the five priority services, why those are high-leverage, contextual proof, how the agency works, quiet secondary-audience paths, and a closing Request a Proposal.
3. **Given** a visitor anywhere on the homepage, **When** they decide to act, **Then** a Request a Proposal call to action is reachable from at least the primary navigation and a closing section.
4. **Given** a visitor interested in a specific priority service, **When** they select it, **Then** they navigate to that service's dedicated page.

---

### User Story 2 - Submit a proposal request (Priority: P1)

A qualified visitor completes the Request a Proposal experience, providing enough context for a consultative follow-up, and receives clear confirmation. The experience is premium, short enough to complete, accessible, suitable for businesses at any stage, and free of artificial exclusivity — with no account or login required.

**Why this priority**: The proposal request is the single measurable conversion. Without a reliable, accessible, validated submission path, the site cannot achieve its business outcome.

**Independent Test**: Complete the proposal form with valid data and confirm a success state; submit with missing/invalid fields and confirm inline validation; simulate a submission failure and confirm a recoverable error state that does not lose entered data.

**Acceptance Scenarios**:

1. **Given** a visitor on the Request a Proposal experience, **When** they submit with all required fields valid, **Then** the submission is accepted and an accessible success confirmation is shown, including what happens next and the expected response communication.
2. **Given** a visitor who leaves a required field empty or enters an invalid value (e.g., malformed email), **When** they attempt to submit, **Then** submission is blocked and a clear, field-level, screen-reader-accessible error message identifies each problem.
3. **Given** a visitor whose submission fails to be processed (transient failure), **When** the failure occurs, **Then** an accessible error state explains the problem, preserves entered data, and offers a retry — without exposing sensitive technical details.
4. **Given** a visitor who submits the same request twice in quick succession, **When** the duplicate is detected, **Then** the system prevents or safely reconciles the duplicate rather than creating conflicting records.
5. **Given** a visitor completing the form, **When** they review it, **Then** a privacy acknowledgement / notice is present near the form and only necessary personal information is requested.
6. **Given** an automated spam submission, **When** it is submitted, **Then** spam/abuse protection prevents it from being treated as a genuine qualified request.
7. **Given** a visitor who has not created any account, **When** they submit, **Then** the request succeeds without requiring login or account creation.

---

### User Story 3 - Enter through a priority service page and request a proposal (Priority: P2)

A visitor lands directly on a priority service page (e.g., Meta Ads, Shopify Store Development), understands that service in its own right, sees how it connects to the wider growth ecosystem, encounters contextual proof, and is led to Request a Proposal.

**Why this priority**: Service pages are major organic and paid entry points. They must convert on their own while reinforcing the connected-growth positioning.

**Independent Test**: Load each required service page directly (no homepage first) and confirm the reader can understand the service, see its relationship to the four pillars, encounter at least one relevant proof element or a clearly flagged pending-proof placeholder, and reach Request a Proposal.

**Acceptance Scenarios**:

1. **Given** a visitor on any of the seven required service pages, **When** the page renders, **Then** the service is named by its real name and explained in terms of cause and effect for an ecommerce business.
2. **Given** a visitor on a service page, **When** they read it, **Then** the page shows how the service connects to the other pillars rather than presenting the service in isolation.
3. **Given** a visitor on a service page, **When** relevant proof exists, **Then** proof appears close to the claim it supports; where proof is pending, a clearly identified content requirement placeholder is shown instead of fabricated proof.
4. **Given** a visitor on a service page, **When** they decide to act, **Then** a contextual Request a Proposal call to action is available.

---

### User Story 4 - Enter through a case study, examine evidence, and request a proposal (Priority: P2)

A visitor arrives on an individual case study, reads a credible account of the work (context, problem, systems involved, what changed, how systems connected, verified results, relevant services, next action), follows links to related services, and is led to Request a Proposal.

**Why this priority**: Proof is central to a portfolio-quality agency site and is a primary trust driver for the proposal decision.

**Independent Test**: Open an individual case study built from the case-study template and confirm it presents all required narrative sections, links to at least one relevant service, presents only verified results (or clearly flags pending assets), and offers a next action.

**Acceptance Scenarios**:

1. **Given** a visitor on an individual case study, **When** they read it, **Then** it presents client context, the problem, the systems involved, what Infinite Weblinks changed, how the systems connected, measurable results where verified, and the relevant services.
2. **Given** a case study whose metric or asset is not yet supplied/approved, **When** it renders, **Then** it shows a clearly identified content requirement rather than an invented client, result, percentage, revenue figure, testimonial, or guarantee.
3. **Given** a visitor finishing a case study, **When** they want to go deeper, **Then** links to the relevant service pages and a next action (Request a Proposal) are available.

---

### User Story 5 - Secondary audiences find their dedicated path without diluting the ecommerce focus (Priority: P3)

A creator/digital-product business finds the "For Creators" path, and an agency seeking white-label support finds the "Partners / White-label" path — both reachable but quiet, so the homepage and primary navigation remain ecommerce-focused. Each secondary audience can submit an appropriate inquiry.

**Why this priority**: Secondary audiences add reach but must not compromise the primary positioning; lower priority than the core ecommerce journey.

**Independent Test**: Confirm the homepage's dominant message stays ecommerce-focused, that a creator and a partner can each locate their dedicated page through a quiet path, and that each page offers a suitable inquiry/next action.

**Acceptance Scenarios**:

1. **Given** the homepage and primary navigation, **When** evaluated for emphasis, **Then** ecommerce brands remain the dominant audience and secondary-audience links are present but visually and hierarchically quieter.
2. **Given** a creator/digital-product visitor, **When** they look for a relevant path, **Then** they can reach the "For Creators" page and submit an appropriate inquiry.
3. **Given** an agency seeking white-label support, **When** they look for a relevant path, **Then** they can reach the "Partners / White-label" page and submit an appropriate white-label inquiry.

---

### User Story 6 - Complete the essential journeys on mobile, by keyboard, and with reduced motion (Priority: P2)

A visitor on a small screen (360–390px), and a visitor navigating by keyboard with reduced-motion enabled, can complete the same essential journeys — understand the argument, browse services and proof, and submit a proposal — without losing content or functionality, and without relying on motion or hover.

**Why this priority**: Most real traffic is mobile, and accessibility is a correctness requirement in the project constitution. Inclusive parity is non-negotiable, but it is expressed as parity across the journeys defined above rather than a separate destination.

**Independent Test**: Run the P1 journeys at 360px and 390px with no horizontal overflow, complete the proposal form by keyboard only, and enable reduced-motion to confirm every piece of information conveyed by motion is also available in the static state.

**Acceptance Scenarios**:

1. **Given** the site at 360px, 390px, 768px, 1024px, and large desktop widths, **When** any page renders, **Then** there is no horizontal overflow and no clipped content.
2. **Given** a keyboard-only visitor, **When** they tab through navigation, signature sections, and the proposal form, **Then** every interactive control is reachable and operable with a visible focus state and a logical order.
3. **Given** a visitor with reduced-motion enabled, **When** signature experiences render, **Then** all information carried by motion is present in the static state and no information is lost.
4. **Given** a mobile visitor, **When** they use navigation, forms, and signature experiences, **Then** functionality does not depend on hover, touch targets are comfortable, and mobile does not feel like a compressed desktop layout.
5. **Given** a screen-reader user, **When** they complete or fail a form submission, **Then** status, confirmation, and error messages are announced accessibly.

---

### Edge Cases

- **First screen ambiguity**: If the hero cannot show contextual proof, ecommerce relevance and the core message must still be unmistakable within the first screen without proof.
- **Pending proof at launch**: When approved case studies, logos, testimonials, or metrics are not yet supplied, the affected surfaces show clearly identified content-requirement placeholders — never fabricated clients, results, percentages, revenue figures, certifications, partner status, testimonials, team members, or guarantees.
- **Empty Insights**: Insights must not launch as an empty blog; it launches with a small number of substantial pieces or is not linked as if populated.
- **Form submission failure**: Transient processing failure must preserve entered data and allow retry without exposing sensitive details.
- **Duplicate submission**: Rapid re-submission must not create conflicting or duplicate qualified requests.
- **Spam/bot traffic**: Automated submissions must be filtered from genuine qualified requests without harming legitimate accessibility.
- **JavaScript/motion unavailable or reduced**: Core content, navigation, and the proposal path must remain usable; signature motion must degrade gracefully to an informative static state.
- **Very long field input / unexpected characters**: Form inputs must be validated and safely handled server-side.
- **Deep-link entry**: A visitor landing directly on a service page or case study (not via the homepage) must still be able to understand context and reach Request a Proposal.
- **Slow network / large media**: Non-critical media must not block first content, and media must not cause layout shift.
- **Secondary-audience overreach**: Secondary paths must not grow prominent enough to dilute the ecommerce-first homepage.

## Requirements *(mandatory)*

### Functional Requirements

**Positioning & homepage argument**

- **FR-001**: The homepage MUST establish, within the first screen, that the site serves ecommerce brands and MUST convey the core connected-growth message ("disconnected growth leaks; connected growth compounds") without requiring a scroll.
- **FR-002**: The homepage MUST present one connected argument in order: ecommerce relevance and the connection problem → the cost of disconnected marketing and technology → how Demand, Storefront, Retention, and Intelligence connect → the five priority services → why these are high-leverage connection points → contextual proof beside relevant claims → how Infinite Weblinks works → quiet paths for secondary audiences → a natural lead to Request a Proposal.
- **FR-003**: The homepage MUST include calm reading sections between signature experiences and MUST NOT present itself as a directory listing every service.
- **FR-004**: Copy across the site MUST reflect the approved positioning and MUST avoid the prohibited generic agency clichés (e.g., "full-funnel growth partner", "data-driven growth agency", "AI-native agency", "proprietary growth engine", "scaling brands to new heights", "turning browsers into buyers", "guaranteed ROAS").

**Navigation & site structure**

- **FR-005**: Primary navigation MUST provide: Home, What We Do, Case Studies, Approach, Insights, and Request a Proposal, and MUST remain ecommerce-focused.
- **FR-006**: The site MUST include the seven required service pages: Meta Ads, Google Ads, Website Design and Development, Shopify Store Development and Management, Social Media Growth, Retention, and Intelligence.
- **FR-007**: The site MUST include the required supporting pages: an individual Case Study template, For Creators, Partners / White-label, Request a Proposal, Contact, Privacy Policy, Terms, Cookie Policy, and Accessibility Statement.
- **FR-008**: The five priority services (Meta Ads, Google Ads, Website Design and Development, Shopify Store Development and Management, Social Media Growth) MUST remain visible by their real names and MUST be easy to find from the homepage.
- **FR-009**: The site MUST organise capabilities into four connected pillars — Demand, Storefront, Retention, and Intelligence — with Brand and Content presented as a supporting foundation across all four, and MUST NOT present the complete capability list as one overwhelming homepage directory.
- **FR-010**: The site MUST NOT include thin service pages created solely for keyword coverage.

**Service pages**

- **FR-011**: Each service page MUST explain the service in cause-and-effect terms for an ecommerce business and MUST show how the service connects to the other pillars rather than in isolation.
- **FR-012**: Each service page MUST present contextual proof close to the claims it supports where available, and MUST provide at least one contextual Request a Proposal call to action.
- **FR-013**: Supporting capabilities MAY be represented within the relevant pillar/service pages (Demand: SEO, TikTok Ads, YouTube Ads, Amazon Ads, marketplace advertising, influencer marketing, content production; Storefront: WooCommerce, Shopify Plus, landing pages, UI/UX, CRO, migrations, custom web development, funnels; Retention: email, SMS, WhatsApp, lifecycle, CRM, newsletters, loyalty, referrals, affiliates, courses, memberships; Intelligence: GA4, Google Tag Manager, server-side tracking, dashboards, reporting, testing, automation, growth strategy) without overwhelming any single page.

**Case studies & proof**

- **FR-014**: The site MUST provide an individual case study format that presents client context, the problem, the systems involved, what Infinite Weblinks changed, how the systems connected, measurable results where verified, the relevant services, and a next action.
- **FR-015**: Proof (case studies, portfolio work, client logos, testimonials, performance results) MUST appear close to the claim it supports and MUST be used only where genuinely supplied and approved.
- **FR-016**: The system MUST NOT invent clients, results, percentages, revenue figures, certifications, partner status, testimonials, team members, or guarantees; where an asset is pending, the site MUST show a clearly identified content requirement instead of fabricated proof.
- **FR-017**: Case studies MUST link to their relevant service pages to reinforce the connected-growth model.

**Approach**

- **FR-018**: The Approach page MUST build trust through method, process, principles, communication expectations, and engagement structure.

**Conversion — Request a Proposal**

- **FR-019**: Request a Proposal MUST be the site's single primary call to action, reachable contextually throughout the journey without becoming repetitive or aggressive.
- **FR-020**: The proposal experience MUST be clear, premium, consultative, short enough to complete, accessible, suitable for businesses at different stages, and free from artificial exclusivity, and MUST NOT require an account or login.
- **FR-021**: The proposal form MUST capture: name, email, company or brand, website or store URL (where available), business type, current situation, primary challenge, goals, relevant services or growth areas, timeline, optional budget context, and additional details — collecting only necessary personal information.
- **FR-022**: The proposal form MUST define validation behaviour with clear, field-level error messages for missing or invalid input, and MUST block submission until required fields are valid.
- **FR-023**: On successful submission, the system MUST present an accessible success confirmation that states what happens next and the expected response communication.
- **FR-024**: On submission failure, the system MUST present an accessible, recoverable error state that preserves entered data, allows retry, and exposes no sensitive technical detail.
- **FR-025**: The system MUST detect and safely handle duplicate submissions so that rapid re-submission does not create conflicting or duplicate qualified requests.
- **FR-026**: The proposal and contact experiences MUST include spam and abuse protection that filters automated submissions without impeding legitimate or assistive-technology users.
- **FR-027**: A privacy notice/acknowledgement MUST be present near the proposal and contact forms.
- **FR-028**: The Contact page MUST allow an appropriate general inquiry using the same standards of validation, success, failure, privacy, and spam protection as the proposal form.

**Secondary audiences**

- **FR-029**: The site MUST provide a dedicated, quieter "For Creators" path for creators and digital-product businesses that does not dilute the ecommerce-first homepage, and MUST allow an appropriate inquiry.
- **FR-030**: The site MUST provide a dedicated, quieter "Partners / White-label" path for agencies seeking white-label support, and MUST allow an appropriate white-label inquiry.

**Insights & content model**

- **FR-031**: Insights MUST NOT launch as an empty blog; it MUST launch with a small number of substantial pieces or otherwise not be presented as populated.
- **FR-032**: The content model MUST support service pages, contextual proof modules, case studies, testimonials, client logos, insights, FAQs where useful, proposal guidance, and legal content.
- **FR-033**: Site copy MUST be human, direct, specific, commercially aware, easy to scan, credible, free from invented claims and generic agency clichés, and written primarily for ecommerce decision-makers; content MUST name services clearly and explain cause and effect.

**Creative concept & signature experiences**

- **FR-034**: The visual system MUST express the approved "Infinite Universe" concept as a living map of a brand's connected growth ecosystem (not outer space / sci-fi / planets / rockets / galaxies / astronauts / unrelated fantasy).
- **FR-035**: A single continuous "Line of value" MUST recur as the brand signature connecting the major growth systems, visibly breaking or losing value where systems are disconnected and becoming continuous where systems connect; it MUST NOT become a generic network diagram, maze of wires, or field of glowing nodes, and MAY be minimised or omitted in reading-heavy and functional areas.
- **FR-036**: The site MUST use no more than two primary motion patterns — (1) Line movement/flow and (2) object assembly/transformation — and motion MUST communicate cause, effect, connection, or progression.
- **FR-037**: Motion MUST NOT delay content, hide information, depend on hover, interfere with reading, cause scroll-jacking, induce motion sickness, break on mobile, carry information unavailable in the static state, or prevent reduced-motion users from understanding the page; most content and functional sections MUST remain calm.
- **FR-038**: The site SHOULD implement the approved signature experience candidates — The Line, The Connection (growth loop made visible), and Leak to Compound (disconnected vs connected) — and MAY include a contained "System in Motion" interaction, which is optional and MUST be omitted if it would compromise performance, mobile usability, or accessibility.
- **FR-039**: Every substantive visual object MUST explain a service, relationship, result, process, or business idea; purely decorative objects MUST be limited. The design system SHOULD support a small reusable vocabulary (The Line, Storefront, Campaign, Content Stream, Retention Loop, Analytics Panel, Flow Marker, Proof Module) that recurs and evolves across the site.
- **FR-040**: The experience MUST be recognisably Infinite Weblinks with original layouts, compositions, objects, colours, copy, interactions, and brand devices, and MUST NOT copy Clay or resemble generic SaaS, a corporate consultancy, an agency template, a dashboard-first product, an AI startup template, a children's game, an experimental art project, or a service directory.

**SEO**

- **FR-041**: Every page MUST have a clear topic and search intent, exactly one primary page heading, a logical heading hierarchy, and semantic page structure.
- **FR-042**: Every page MUST have a unique title and meta description, correct canonical handling, appropriate indexing/robots directives, a meaningful URL, and social sharing metadata.
- **FR-043**: The site MUST provide an XML sitemap and robots directives, use intentional internal linking (including case studies linked to relevant services), apply structured data where appropriate, and provide image metadata and alt text.
- **FR-044**: The site MUST avoid keyword stuffing and duplicate thin pages, MUST provide clear answer-oriented content suitable for traditional and AI-assisted search, and MUST launch as one English-language site without country-specific duplicate pages unless a distinct need exists.

**Mobile & responsive**

- **FR-045**: The site MUST be deliberately designed for 360px, 390px, 768px, 1024px, and large desktop widths, with no horizontal overflow and no clipped content at any of these widths.
- **FR-046**: The site MUST have no hover-only functionality, comfortable touch targets, readable typography, usable navigation and forms, sensible content order, responsive visual objects, and signature experiences that are simplified but complete on mobile.
- **FR-047**: Images and media MUST NOT cause layout shift, and mobile MUST NOT feel like a compressed desktop layout.

**Accessibility**

- **FR-048**: The site MUST meet WCAG 2.1 AA as the practical baseline, including keyboard-accessible navigation and controls, visible focus states, sufficient contrast, semantic landmarks, and logical heading order.
- **FR-049**: The site MUST provide accessible mobile navigation, accessible forms and error messages, meaningful alternative text, correct decorative-image handling, reduced-motion behaviour, and screen-reader-accessible status and confirmation messages.
- **FR-050**: No information may be communicated through colour or motion alone.

**Performance**

- **FR-051**: The site MUST target a mobile Lighthouse performance score of 90+ (best-effort 95+), verified by testing rather than guaranteed in advance.
- **FR-052**: The site MUST prioritise minimal unnecessary JavaScript, minimal dependencies, optimised images, optimised SVG and icons, efficient font loading, controlled animation, stable layouts, responsive media, appropriate lazy loading, and fast initial content rendering.

**Security & privacy**

- **FR-053**: The proposal and contact inputs MUST be secured, with server-side validation wherever submissions are processed and safe error handling that exposes no sensitive detail to the client.
- **FR-054**: The system MUST NOT hardcode credentials or secrets and MUST handle environment variables safely.
- **FR-055**: The site MUST collect only necessary personal information, present a privacy notice near forms, and handle analytics and consent appropriately for the served markets, avoiding any unnecessary backend.

**Legal**

- **FR-056**: The site MUST provide Privacy Policy, Terms, Cookie Policy, and Accessibility Statement pages with genuine, non-fabricated content appropriate to the served markets.

### Key Entities *(include if feature involves data)*

- **Proposal Request**: A qualified inquiry from a visitor. Attributes: name, email, company/brand, website or store URL (optional), business type, current situation, primary challenge, goals, relevant services/growth areas, timeline, optional budget context, additional details, privacy acknowledgement, submission timestamp. Primary conversion record.
- **Contact Message**: A general inquiry with lighter fields than a proposal request; same validation, privacy, and spam-protection standards.
- **Service Pillar**: One of Demand, Storefront, Retention, Intelligence. Groups services and supporting capabilities; relates to the Line and to case studies.
- **Service**: A named capability (five priority services plus supporting capabilities). Attributes: name, pillar, description, cause-and-effect explanation, connection to other pillars, associated proof, related case studies, call to action.
- **Case Study**: A verified account of client work. Attributes: client context, problem, systems involved, what changed, how systems connected, verified results, relevant services, next action, asset status (published vs pending content requirement).
- **Proof Module**: A contextual unit of evidence (metric, testimonial, client logo, portfolio item) placed beside a specific claim; carries an approved/pending status.
- **Testimonial**: An attributed, approved client statement. Never fabricated.
- **Client Logo**: An approved brand mark used as proof. Never fabricated.
- **Insight Article**: A substantial editorial piece. Attributes: title, topic, intent, body, metadata; Insights launches non-empty.
- **FAQ**: A question/answer pair used where useful, structured for answer-oriented and AI-assisted search.
- **Secondary Audience Path**: A dedicated, quieter page (For Creators; Partners / White-label) with an appropriate inquiry.
- **Legal Page**: Privacy Policy, Terms, Cookie Policy, Accessibility Statement.
- **Content Requirement Placeholder**: A clearly identified marker for a pending, not-yet-supplied/approved asset, used in place of fabricated proof.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On first render of the homepage first screen (above the fold at each required width), a first-time ecommerce reader can identify that the site is for ecommerce brands — verified with unmoderated readers achieving ≥90% correct identification.
- **SC-002**: After a single top-to-bottom scan of the homepage (without reading every section), a test reader can restate the connection problem and the value proposition — verified with ≥80% of test readers.
- **SC-003**: A first-time visitor can locate all five priority services from the homepage within 30 seconds and without using the browser find function — verified with ≥90% of test users.
- **SC-004**: Every required page (six primary nav destinations, seven service pages, and all required supporting pages) exists, is reachable through navigation, and has a single clear stated purpose — verified by a 100% page-inventory checklist pass.
- **SC-005**: Contextual proof (or a clearly identified pending-proof placeholder) appears beside its supporting claim on the homepage, every service page, and every case study — verified by 100% audit with zero orphaned or fabricated proof.
- **SC-006**: Each primary user journey (homepage evaluation, service-page entry, case-study entry) reaches a Request a Proposal entry point in ≤3 interactions from its landing page — verified for 100% of the three journeys.
- **SC-007**: The proposal form demonstrates complete behaviour for success, field-level validation, submission failure with data preserved, duplicate handling, spam protection, and privacy acknowledgement — verified by 100% of these test cases passing.
- **SC-008**: A user can complete the proposal form and reach the success confirmation in under 3 minutes with valid data — verified by task timing with a representative sample.
- **SC-009**: At 360px, 390px, 768px, 1024px, and large desktop widths, no page produces horizontal overflow or clipped content — verified across 100% of pages at all five widths.
- **SC-010**: All essential journeys (understand argument, browse services/proof, submit a proposal) are fully completable using keyboard only, with a visible focus state on every interactive control — verified for 100% of interactive controls on the critical path.
- **SC-011**: With reduced-motion enabled, no information conveyed by motion is lost; every signature experience remains fully understandable from its static state — verified by side-by-side motion vs. reduced-motion information audit with zero information gaps.
- **SC-012**: The site meets WCAG 2.1 AA on all key templates (homepage, a service page, a case study, the proposal form, a legal page) with zero critical accessibility failures — verified by combined automated and manual checks.
- **SC-013**: Mobile Lighthouse performance is ≥90 on the homepage, a representative service page, and the proposal page (best-effort ≥95) — verified by testing, not asserted in advance.
- **SC-014**: SEO foundations are present on 100% of pages: exactly one primary heading, logical heading order, semantic structure, unique title and meta description, correct canonical, appropriate robots/index directives, meaningful URL, and social sharing metadata; an XML sitemap and robots directives exist — verified by a per-page SEO checklist.
- **SC-015**: Server-side validation, safe error handling with no sensitive detail exposure, spam/abuse protection, no hardcoded secrets, and a privacy notice near forms are all present wherever submissions are processed — verified by a security/privacy review with zero critical findings.
- **SC-016**: A content-integrity audit finds zero fabricated clients, results, percentages, revenue figures, certifications, partner status, testimonials, team members, or guarantees anywhere on the site; every pending asset is represented by a clearly identified content requirement.
- **SC-017**: The homepage and primary navigation remain ecommerce-first: secondary-audience links are present but demonstrably subordinate in hierarchy and emphasis — verified by an emphasis/hierarchy review.
- **SC-018**: An independent reviewer judges the site recognisably "Infinite Weblinks" — original in layout, objects, colour, copy, interactions, and brand devices — and not a copy of Clay or a generic SaaS/consultancy/agency template — verified by a craft-and-originality review.
- **SC-019**: A capability-evidence review confirms the finished site demonstrably exercises the capabilities Infinite Weblinks sells (UI/UX, conversion design, responsive design, accessibility, performance, SEO, content architecture, trust design) — verified by mapping each sold capability to at least one place the site demonstrates it.

## Assumptions

- **Spec directory vs. branch**: Development proceeds on the designated branch `claude/infinite-weblinks-setup-mqvijv`; the spec lives at `specs/001-marketing-website/` per sequential feature numbering. These are intentionally independent.
- **Technology deferred**: No technology stack, framework, hosting, database, CMS, animation library, or component architecture is chosen in this specification; those decisions belong to `/speckit-plan`.
- **Proposal delivery & response commitment**: Submissions are assumed to be delivered to the agency (e.g., via an email notification and/or lightweight storage) with no visitor account. The success confirmation states an expected response window; a concrete commitment (assumed: "within 2 business days") will be confirmed during content development.
- **Content assets at launch**: Some real case studies, client logos, testimonials, and metrics may not be supplied/approved at build time. These surfaces will use clearly identified content-requirement placeholders rather than fabricated proof, and can be populated as approved assets arrive.
- **Insights at launch**: Insights launches with a small number of substantial pieces (assumed 2–3) rather than an empty blog.
- **Consent & analytics**: Because served markets include the UK and Europe, a compliant cookie/consent approach and a Cookie Policy are assumed to be required; analytics is loaded in a consent-appropriate manner and only necessary personal data is collected.
- **Single locale**: The first release is one English-language site serving all listed markets; currency/date/legal wording targets a general international-English audience with no country-specific duplicate pages.
- **"No unnecessary backend"**: Only the minimal server capability required to process, validate, protect, and deliver form submissions is assumed; no accounts, portals, dashboards, or ecommerce functionality.
- **Priority-service depth**: The five priority services receive full dedicated pages; supporting capabilities are represented within pillar/service pages rather than as separate thin pages.
- **Signature experience count**: Three signature experiences (The Line, The Connection, Leak to Compound) are treated as in-scope; the fourth (System in Motion) is optional and omitted if it risks performance, mobile usability, or accessibility.
- **Legal content**: Legal pages will contain genuine, market-appropriate content; final legal wording is subject to the agency's review/approval before public launch.

## Out of Scope (Version 1)

Unless later approved, the following are explicitly out of scope: ecommerce checkout or product sales on the agency website; customer accounts; client portals; a SaaS dashboard; public or fixed pricing (no pricing page; no fixed revenue threshold excluding early-stage businesses); multilingual or country-specific versions; a large publishing platform; any fabricated demonstration metrics; and any unnecessary backend functionality.
