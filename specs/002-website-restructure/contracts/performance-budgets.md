# Contract: Performance Budgets

**Feature**: `002-website-restructure` | Phase 1 | Implements FR-051 | See [plan.md](../plan.md), [quickstart.md](../quickstart.md), Principle III

Measurable per-page mobile budgets, verified at the hardening gate alongside the Lighthouse 90+ target (SC-006). Sizes are **compressed transfer** (gzip/brotli) unless stated. Budgets are best-effort ceilings; any overage MUST be documented, not hidden.

## Per-page byte budgets (mobile)

| Asset class | Content pages | Interactive pages (Growth Graph / Map Your Stack) |
|---|---|---|
| JavaScript (total shipped) | ≤ 30 KB | ≤ 50 KB |
| CSS (total) | ≤ 40 KB | ≤ 40 KB |
| Fonts (self-hosted subset WOFF2, both families) | ≤ 200 KB total | ≤ 200 KB total |
| LCP image | ≤ 150 KB | ≤ 150 KB |
| Initial page weight (excludes below-fold lazy media) | ≤ 500 KB | ≤ 500 KB |
| Third-party JavaScript at initial load | 0 | 0 |

## Core Web Vitals (mobile, throttled / mid-tier device)

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

## Supporting rules

- No runtime framework, no animation library, no CSS framework, no Google-Fonts CDN (keeps JS/CSS/font budgets attainable).
- Only the two islands ship script; all other pages are zero-JS or trivially small.
- `font-display: swap`; subset to used glyphs; preload only the critical font.
- Non-critical images/media lazy-loaded with intrinsic dimensions to protect CLS.
- SVGs optimised (no unnecessary precision/metadata); inline only where it avoids an extra request and stays within the CSS/JS budget.

## Verification (hardening gate)

- Lighthouse mobile on representative page types: report exact Performance / Accessibility / Best-Practices / SEO; target 90+ (best effort 95+); never fabricate a score.
- Compare built asset sizes against the table above; record any page that exceeds a budget with the reason and the mitigation or accepted exception.
- Confirm zero third-party JS at initial load and healthy CWV field/lab values.
