# Launch checklist

Run this checklist before making Infinite Weblinks public.

## What the checker does

`npm run verify:launch` builds the Astro site with the current environment variables, then inspects the generated `dist/` files. It checks production URLs, form configuration, public HTML, canonical tags, sitemap, robots.txt, security headers, internal links and `.env.example` safety.

## Why BLOCKED can be correct

`BLOCKED` does not always mean the code is broken. It can mean a real launch action is still needed, such as adding the production domain, configuring the form provider or getting the legal pages reviewed. Do not remove legitimate blockers just to make the command pass.

## Configure `PUBLIC_SITE_URL`

Set `PUBLIC_SITE_URL` to the final public origin, for example:

```text
PUBLIC_SITE_URL=https://www.yourdomain.com
```

Use HTTPS, do not add a trailing slash, and do not use localhost or `.example` domains for production.

## Configure `PUBLIC_BOOKING_ENDPOINT`

Set `PUBLIC_BOOKING_ENDPOINT` to the public HTTPS endpoint from the chosen form provider. Do not put private API keys, access tokens or passwords in this value.

Variables beginning with `PUBLIC_` are visible in the browser because Astro embeds them into the static frontend build. Treat them as public configuration, not secrets.

## Update CSP safely for form providers

If the form provider changes, update `public/_headers` intentionally. Add the provider's exact origin, such as `https://formspree.io`, to both `connect-src` and `form-action`. Do not use `*` as a shortcut because it weakens the security policy.

## Manual real form test

The checker never submits a real enquiry. After deployment, open the live booking and contact forms, submit a clearly labelled test enquiry, confirm it arrives in the correct inbox or provider dashboard, then delete the test data if appropriate.

## Legal review

The Privacy, Cookies and Terms pages need human legal review before launch. Only remove review markers after the owner and any appropriate legal adviser approve the final wording.

## Lighthouse or PageSpeed

After the site is deployed, run Lighthouse in Chrome DevTools or PageSpeed Insights against representative live pages. Record any important performance, accessibility, SEO or best-practice issues before launch.

## Hosting provider environment variables

In a static hosting provider such as Cloudflare Pages, Netlify or Vercel, add `PUBLIC_SITE_URL` and `PUBLIC_BOOKING_ENDPOINT` in the project's environment variable settings before running the production build. Rebuild after changing them.

## Rerun before launch

Before the final go-live decision, run:

```bash
npm run verify:launch
```

Launch only when the checker passes and the remaining manual checks, including legal review and a real form submission test, are complete.
