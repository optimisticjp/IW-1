# Contract: Security Response Headers & CSP

**Feature**: `002-website-restructure` | Phase 1 | Implements FR-049 | See [consultation-form.md](./consultation-form.md), Principle IX

Baseline security response headers for the static site and the form flow, delivered via the host headers file (`public/_headers` on Cloudflare Pages). Values below are the intended policy, not the literal file; the CSP endpoint origins are derived from the same env config as the forms (`PUBLIC_BOOKING_ENDPOINT`, and `PUBLIC_NEWSLETTER_ENDPOINT` when enabled), never hardcoded to a provider.

## Content Security Policy

Scoped to self plus the configured form-endpoint origin(s):

| Directive | Value (intent) |
|---|---|
| `default-src` | `'self'` |
| `script-src` | `'self'` (island scripts are self-hosted; no third-party JS; use hashes if any inline is unavoidable) |
| `style-src` | `'self' 'unsafe-inline'` (Astro scoped styles); prefer hashes where practical |
| `img-src` | `'self' data:` |
| `font-src` | `'self'` (self-hosted WOFF2) |
| `connect-src` | `'self' {FORM_ENDPOINT_ORIGIN}` (e.g. `https://formspree.io`) so the AJAX submit reaches the processor |
| `form-action` | `'self' {FORM_ENDPOINT_ORIGIN}` |
| `frame-ancestors` | `'none'` |
| `base-uri` | `'self'` |
| `object-src` | `'none'` |
| `upgrade-insecure-requests` | present |

Rules:
- The CSP MUST allow the consultation and contact submissions (and the newsletter when enabled) to reach the configured endpoint(s); adding a provider means adding its origin to `connect-src`/`form-action`, not loosening to `*`.
- No inline third-party scripts; no `unsafe-eval`.
- If a nonce/hash approach replaces `'unsafe-inline'` for styles later, it must not break Astro scoped CSS.

## Other headers

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | disable unused features: `geolocation=(), camera=(), microphone=(), payment=(), usb=()` |
| `Strict-Transport-Security` | `max-age=…; includeSubDomains` where the host provides HSTS (Cloudflare) |
| `X-Frame-Options` | `DENY` (belt-and-braces with `frame-ancestors 'none'`) |

## Verification (hardening gate)

- Confirm headers are present on a deployed/preview response.
- Confirm the consultation and contact submit paths succeed under the CSP (no `connect-src`/`form-action` violation in the console).
- Confirm no third-party script loads at initial page load (consistent with the performance budget: zero third-party JS).
- Confirm the CSP has no `*`, `unsafe-eval`, or wildcard `connect-src`.
