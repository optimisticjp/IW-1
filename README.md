# Infinite Weblinks website

Infinite Weblinks is a static marketing website for a connected digital growth agency. It explains the agency's services, audiences, work examples, insights and enquiry routes in plain English.

The site is built to be honest, fast and accessible. It does not claim results that are not evidenced, and form submissions are designed to fail visibly rather than pretending an enquiry was sent.

## Technology stack

- [Astro](https://astro.build/) static site output
- TypeScript for data modules, validation and tests
- Astro content collections for Work and Insights entries
- Plain CSS using the project tokens in `src/styles/`
- Vitest for unit and contract tests
- Playwright Core plus axe-core for the optional accessibility audit script
- `@astrojs/sitemap` for sitemap generation

There is no frontend framework, CSS framework or animation library.

## Requirements

- Node.js 20 or newer is recommended.
- npm, using the checked-in `package-lock.json`.
- A browser installation is needed only for the optional `npm run test:a11y` audit.

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev
```

The dev server prints the local URL, usually `http://localhost:4321`.

## Available npm commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Astro development server. |
| `npm run start` | Alias for `npm run dev`. |
| `npm run check` | Runs Astro and TypeScript diagnostics. |
| `npm run test` | Runs the Vitest unit and contract tests. |
| `npm run build` | Builds the static site into `dist/`. |
| `npm run verify:launch` | Builds and checks the production output for launch blockers. See `docs/LAUNCH_CHECKLIST.md`. |
| `npm run preview` | Serves the built `dist/` output locally. |
| `npm run test:a11y` | Runs the built-site accessibility, no-JS, responsive and performance-budget audit script. |

## Environment variables

Copy `.env.example` to `.env` for local work. Public variables are embedded in the static build, so do not put secrets in them.

| Variable | Required? | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Required before public launch | Sets the production origin for canonical URLs, Open Graph URLs, sitemap and robots behaviour. The `.example` fallback keeps crawlers blocked. |
| `PUBLIC_BOOKING_ENDPOINT` | Required before forms can deliver enquiries | Provider-neutral endpoint used by the booking and contact forms. If it is missing, forms show an honest unconfigured state instead of a false success. |
| `PUBLIC_NEWSLETTER_ENDPOINT` | Optional | Reserved for a future footer newsletter provider. The newsletter UI stays hidden until this is configured. |

Do not commit `.env`, provider tokens, API keys, private endpoint secrets or customer data.

## Project structure

```text
src/
  components/       Reusable Astro components for layout, UI, forms and brand graphics
  content/          Markdown content collections for work examples and insights
  data/             Typed content modules for navigation, homepage, services, audiences and capabilities
  layouts/          Shared page shell and SEO output
  lib/              Validation, SEO, schema, link and stack-evaluation helpers
  pages/            Astro routes
  styles/           Global tokens, typography, base styles and motion rules
  types/            Shared TypeScript types
tests/
  unit/             Vitest tests for content contracts, routes, CTAs and helpers
  e2e/              Built-site audit script
docs/               Owner and project documentation
public/             Static files copied directly to the build
specs/              Spec Kit planning and convergence artifacts
```

## How content is organised

Most repeatable page copy lives in typed data files under `src/data/`. Pages import those modules and render them with shared components. Longer editorial content lives as Markdown in `src/content/`.

- Homepage sections: `src/data/home.ts` and `src/pages/index.astro`
- Capabilities: `src/data/capabilities.ts`, `src/data/whatWeDo.ts`, `src/pages/what-we-do.astro` and `src/pages/what-we-do/[capability].astro`
- Services: `src/data/services.ts` and `src/pages/services/[service].astro`
- Audiences: `src/data/audiences.ts`, `src/data/whoWeHelp.ts`, `src/pages/who-we-help.astro` and `src/pages/who-we-help/[audience].astro`
- Work examples: Markdown files in `src/content/work/`, rendered by `src/pages/work/index.astro` and `src/pages/work/[slug].astro`
- Insights: Markdown files in `src/content/insights/`, rendered by `src/pages/insights/index.astro` and `src/pages/insights/[slug].astro`
- Founder information: `src/data/owner.ts`, with owner requirements documented in `docs/OWNER_CONTENT.md`

When editing content, keep the current tone: plain English, useful, specific and careful about proof. Do not invent testimonials, client names, credentials, awards, statistics or business results.

## How forms work

The booking page and contact page use Astro form components with shared validation and submission helpers in `src/lib/booking.ts`.

- `PUBLIC_BOOKING_ENDPOINT` controls where submissions are sent.
- In development, a safe mock response may be used so the form can be tested locally.
- In production without an endpoint, the build logs a warning and the form shows an honest failure state.
- The static site does not store enquiries server-side.
- The contact form is for written enquiries. The booking form is for the primary free-call journey.

## Running tests

Run the normal checks before opening a pull request:

```bash
npm run check
npm run test
npm run build
```

After a successful build, run the optional accessibility audit when the environment has a compatible browser available:

```bash
npm run test:a11y
```

## Production build

```bash
npm run build
```

Before launch, run the production readiness checker and follow the beginner-friendly launch guide in [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md):

```bash
npm run verify:launch
```

The generated static site is written to `dist/`. Use `npm run preview` to inspect the built output locally.

## Known launch requirements

Before public launch, the owner still needs to:

1. Set `PUBLIC_SITE_URL` to the real production domain.
2. Set `PUBLIC_BOOKING_ENDPOINT` to a working form provider endpoint.
3. Review and approve the Privacy, Cookies and Terms pages with appropriate legal advice.
4. Run a real Lighthouse or PageSpeed Insights check on representative production pages.
5. Provide optional founder profile material if the About page should show a founder section.

## Deployment

This is a static Astro site. Build with `npm run build` and deploy the contents of `dist/` to any static host that supports Astro output, such as Netlify, Vercel, Cloudflare Pages or a static file server.

Configure the public environment variables in the hosting provider before building. Ensure `public/_headers` or equivalent security headers are applied by the host.
