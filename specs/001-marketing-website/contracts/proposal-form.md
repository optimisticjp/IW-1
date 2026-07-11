# Contract: Proposal & Contact Form

**Feature**: 001-marketing-website | **Type**: UI behavior + submission adapter interface

Fixes the form's field contract, state machine, accessibility behavior, and the provider-adapter boundary so the UI can be built and tested now without a chosen backend. Field list and validation rules: [../data-model.md](../data-model.md).

## Field contract (ProposalRequest)

Required: `name, email, company, businessType, primaryChallenge, privacyAck`.
Optional: `websiteUrl, currentSituation, goals, growthAreas, timeline, budgetContext, details`.
Hidden anti-spam: `_hp` (honeypot, must stay empty), `_ts` (render timestamp, submit-timing check).

Contact form subset — Required: `name, email, message, privacyAck`; same hidden anti-spam fields.

## State machine

```
idle ──submit──▶ validating ──invalid──▶ idle (field errors shown, focus first invalid)
                     │valid
                     ▼
                 submitting ──ok──▶ success (confirmation + next steps + response window)
                     │fail
                     ▼
                 error (retryable; entered data preserved) ──retry──▶ submitting
```

- **Validating**: inline, field-level; blocks submission until all required valid (FR-022).
- **Submitting**: visible loading state; controls disabled to prevent double submit.
- **Success**: accessible confirmation stating what happens next + expected response window (FR-023); form cleared or replaced by confirmation.
- **Error**: recoverable, preserves all entered data, offers retry, exposes no sensitive detail (FR-024).
- **Duplicate**: identical payload within a short window is blocked/de-duplicated client-side (FR-025); authoritative de-dup is the provider's responsibility later.
- **Spam**: non-empty `_hp` or implausibly fast submit ⇒ silently treated as non-qualified (FR-026).

## Accessibility contract

- Every control has a programmatic label; help text linked via `aria-describedby`.
- Errors: `aria-invalid` on the field + message linked via `aria-describedby`; on submit-with-errors, focus moves to the first invalid field.
- Status transitions (submitting/success/error) announced through an `aria-live="polite"` `FormStatus` region (FR-049/SC-010).
- Fully keyboard-operable; visible focus; no hover-only affordance; privacy acknowledgement is a real required checkbox with a visible privacy notice nearby (FR-027).

## Adapter boundary

```
submitProposal(payload, { provider }) -> Promise<{ ok: true } | { ok: false, retryable: boolean }>
```

- Provider selected via environment configuration (e.g. `PUBLIC_FORM_PROVIDER`), default `mock`.
- **`mock` provider** (`lib/forms/providers/mock.ts`): validates payload shape, simulates latency, returns success; can be toggled to return a retryable failure for testing the error path. Performs **no network call and no persistence**.
- **Real providers (later)**: a form-service endpoint or serverless function implementing the same signature. **MUST** perform server-side validation, rate limiting, and real spam-challenge verification before public launch (FR-053/FR-026). This is a pre-launch gate, not a stage-one deliverable.
- No secrets in client code; any provider keys come from environment variables (FR-054).

## Configurable placeholders (replace later, do not block build)

Form destination/provider, spam-challenge site key, privacy-policy link target, and response-window copy are all env/data-driven placeholders.

## Test hooks

`tests/unit/validation.test.ts` covers: required/optional enforcement, email/URL format, `privacyAck` must be true, honeypot/timing rejection, duplicate detection, and error-map shape — independent of any provider.
