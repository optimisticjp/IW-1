# Contract: Consultation Form

**Feature**: `002-website-restructure` | Phase 1 | See [data-model.md](../data-model.md#entity-consultation-enquiry-srccomponentsformsbookingformastro--srclibbookingts)

Implements FR-026/027/028/029/030 and the clarified decisions (no budget field, no calendar widget at launch, three-outcomes message with no time promise). Reuses the existing `src/lib/booking.ts` and `src/components/forms/BookingForm.astro`.

## Fields

| Field | Required | Validation |
|---|---|---|
| name | yes | non-empty |
| email (work email) | yes | `isEmail` format |
| business name | yes | non-empty |
| privacy acknowledgement | yes | must be `true` |
| url (website) | no | `isUrl` when present |
| goal | no | free text; light qualification |
| obstacle | no | free text |
| closest description | no | select/free text |
| working model | no | free text |
| timing | no | free text |
| file | no | optional attachment |
| stackContext | no | populated from Map Your Stack handoff (allowlist-parsed) |
| `_hp` (honeypot) | no | hidden; if filled → silently dropped as spam |

**No budget field** is present anywhere in the form (FR-026). Budget is raised only in the personal follow-up.

## Validation behaviour

- Validate on blur and on submit.
- Errors are specific and accessible: icon **plus** text, never colour alone; associated with the field via `aria-describedby`; focus moves to the first error.
- `validateBooking(values)` returns a map of field → message; `{}` means valid.

## Submission (`submitBooking`)

Provider-neutral. Endpoint injected via `PUBLIC_BOOKING_ENDPOINT` (never hardcoded). Formspree AJAX JSON contract when that provider is configured:

- Method `POST`; headers `Accept: application/json`, `Content-Type: application/json`.
- Body JSON includes all answered fields; `email` doubles as the reply-to address.
- Honeypot filled → return `{ ok: true }` without sending (spam absorbed silently).
- Response `200` → `{ ok: true }` (accepted).
- Response `>= 500` or a network throw → `{ ok: false, retryable: true }`.
- No endpoint in production → `{ ok: false, unconfigured: true }`; **never** `{ ok: true }`.
- Dev-only mock (`dev: true`, empty endpoint) → `{ ok: true, mock: true }`; the mock never runs in production.

## Submission states (FR-027/028/030, SC-010)

- **idle**: default; submit control enabled.
- **submitting**: on submit, the control is disabled and shows progress as **text** ("Sending…"), with `aria-busy="true"` and a live-region announcement; repeated activation is ignored so a slow network cannot create a duplicate enquiry; no spinner-only or colour-only indication (reduced-motion safe). Resolves to `accepted` or `recoverable-failure`.
- **accepted**: honest confirmation — heading "Thank you. We have your enquiry.", reassurance the visitor need not resend, the three-outcomes follow-up expectation with **no specific response-time promise**, and an onward link. No "Your call is booked" state at launch (deferred with the optional scheduler).
- **recoverable-failure / unconfigured**: never show success; preserve all entered answers; offer retry and a direct email fallback.

## `/book-a-call` vs `/contact` (FR-029)

- **`/book-a-call`** — the primary conversion. The full consultation form above (required name/email/business/privacy + optional qualification + Map Your Stack handoff). "Book a free call" is the sitewide primary CTA.
- **`/contact`** — a lighter general-enquiry route: name, work email, message (+ privacy acknowledgement). No qualification fields, no Map Your Stack handoff. Reached from footer/utility links, not promoted as the primary conversion.
- Both share the same provider-neutral submission (`booking.ts`), the never-false-success contract, and the submitting/accepted/recoverable-failure states. Both work with no query parameter.

## Data flow, storage & retention (FR-047)

- Flow: form → client-side validation → HTTPS POST to `PUBLIC_BOOKING_ENDPOINT` (provider-neutral; currently Formspree) → the processor delivers the enquiry to the owner **by email**.
- Storage: the **static site stores nothing server-side** (no database, no persistence). Any at-rest copy lives only with the configured form processor and the owner's inbox.
- Data minimisation: request only what is needed to reply; **no special-category data**.
- Retention: the site holds no persistent copy; retention is governed by the processor's policy and the owner's inbox. The Privacy page must disclose what is collected, that a third-party form processor delivers it by email, and the retention expectation.
- Secrets: endpoint injected via env (`PUBLIC_BOOKING_ENDPOINT`), never hardcoded; no submitted data or secrets in logs, commits, tests or screenshots.

## Newsletter opt-in (FR-050)

- Deferred until `PUBLIC_NEWSLETTER_ENDPOINT` is configured; until then the footer **omits** the opt-in rather than show a form that cannot deliver.
- When enabled: same provider-neutral, never-false-success contract; accessible **submitting**, **success** and **error** states; **confirmed (double) opt-in**; separate from both enquiry surfaces; the endpoint origin joins the CSP `connect-src`/`form-action` allowlist (see security-headers.md).

## Map Your Stack handoff

- Selection carried via an optional query parameter; parsed against the nine-tool allowlist; unknown/malicious values ignored (Edge Cases).
- When present, `stackContext` pre-fills the context field with a short plain-English summary so the visitor does not repeat themselves (FR-025, User Story 1 scenario 5, SC-009).
- The form works fully with no parameter.

## Tests (existing + extended, `tests/unit/booking.test.ts`)

- Accepts a complete valid submission; requires name/email/business/privacy; email + url format; privacy acknowledgement.
- Dev mock only in development; **never fakes success in production with no endpoint** (no silent lead drop); honeypot dropped; server failure and network throw are retryable; Formspree AJAX contract (POST + JSON headers, `email` reply-to).
- Extended: handoff parameter allowlist parsing; confirmation state carries the three-outcomes message and no time promise; no budget field rendered; submitting state disables the control and ignores repeat activation (no duplicate submit); `/contact` posts only name/email/message; footer omits the newsletter opt-in when `PUBLIC_NEWSLETTER_ENDPOINT` is unset.
