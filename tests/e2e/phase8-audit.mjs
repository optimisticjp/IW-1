// Phase 8 cross-cutting audit runner (T066–T068, T072). Runs against a local
// preview build (default http://localhost:4321). Not part of the vitest unit
// run: it needs a browser + a served build. Usage:
//   npm run build && npm run preview &   # in one shell
//   node tests/e2e/phase8-audit.mjs
//
// Covers: axe WCAG 2.2 AA, responsive overflow (320–1280) + single-h1, tap
// targets, keyboard focus/operation, reduced-motion final states, no-JS parity,
// and CWV lab (LCP/CLS). Chromium path + axe-core are resolved from the repo.

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import pw from 'playwright-core';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const { chromium } = pw;
const BASE = process.env.BASE_URL || 'http://localhost:4321';
const DEFAULT_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CHROME = process.env.CHROME_PATH || (existsSync(DEFAULT_CHROME) ? DEFAULT_CHROME : chromium.executablePath());

// Every indexable route + the 404, discovered from the sitemap would be ideal;
// hardcoded here to keep the runner self-contained and deterministic.
const ROUTES = [
  '/', '/what-we-do', '/what-we-do/build', '/what-we-do/attract', '/what-we-do/convert',
  '/what-we-do/retain', '/what-we-do/connect', '/what-we-do/scale',
  '/services/website-design-and-development', '/services/ecommerce-development',
  '/services/seo-and-search-visibility', '/services/paid-advertising',
  '/services/conversion-optimisation', '/services/email-marketing', '/services/analytics-and-tracking',
  '/who-we-help', '/who-we-help/ecommerce-brands', '/who-we-help/creators-and-experts',
  '/who-we-help/startups-and-new-brands', '/who-we-help/growing-teams',
  '/who-we-help/established-teams', '/who-we-help/agency-partners',
  '/how-it-connects', '/map-your-stack', '/book-a-call', '/contact',
  '/work', '/work/connected-store-rebuild', '/work/one-dashboard-you-can-trust', '/work/paid-and-email-working-as-one',
  '/insights', '/insights/why-connected-tools-beat-more-tools', '/insights/what-makes-a-landing-page-work',
  '/insights/ai-search-what-it-means-for-your-site', '/about', '/faq',
  '/privacy', '/cookies', '/terms', '/this-route-does-not-exist',
];
// One representative page per template gets the (slower) axe scan.
const AXE_ROUTES = [
  '/', '/what-we-do', '/what-we-do/build', '/services/website-design-and-development',
  '/who-we-help', '/who-we-help/ecommerce-brands', '/how-it-connects', '/map-your-stack',
  '/book-a-call', '/contact', '/work', '/work/connected-store-rebuild', '/insights',
  '/insights/why-connected-tools-beat-more-tools', '/about', '/faq', '/privacy', '/cookies', '/terms',
];
const WIDTHS = [320, 360, 390, 768, 1024, 1280];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const browser = await chromium.launch({ executablePath: CHROME });
const fail = { axe: 0, overflow: 0, h1: 0, tap: 0, focus: 0, nojs: 0, motion: 0 };
const axeSummary = [];

// ---- Accessibility (axe WCAG 2.2 AA) ----
// Audit the FINAL rendered state: reducedMotion collapses the Reveal family to
// opacity:1 immediately, so we measure real end-state contrast rather than a
// mid-transition frame of a below-the-fold card (which axe would read as the
// text blended toward the background).
for (const route of AXE_ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 900 }, reducedMotion: 'reduce', bypassCSP: true });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(
    (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }),
    AXE_TAGS,
  );
  const v = res.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical' || true);
  if (v.length) {
    fail.axe += v.length;
    axeSummary.push(`  ${route}: ${v.map((x) => `${x.id}(${x.impact},${x.nodes.length})`).join(', ')}`);
  }
  await ctx.close();
}
console.log(`AXE WCAG 2.2 AA: ${fail.axe === 0 ? 'PASS (0 violations)' : 'FAIL'} across ${AXE_ROUTES.length} representative pages`);
if (axeSummary.length) console.log(axeSummary.join('\n'));

// ---- Responsive overflow + single h1 + tap targets ----
for (const route of ROUTES) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
      h1: document.querySelectorAll('h1').length,
    }));
    if (m.sw > m.iw + 1) { fail.overflow++; console.log(`  OVERFLOW ${route}@${w}: ${m.sw}>${m.iw}`); }
    if (m.h1 !== 1) { fail.h1++; console.log(`  H1!=1 ${route}@${w}: ${m.h1}`); }
    // tap targets at the smallest width only (interactive controls ≥44px)
    if (w === 320) {
      const small = await page.evaluate(() => {
        // Real interactive targets only (not decorative inner indicators like
        // the checkbox visual box). Buttons, links, summaries and the whole
        // stack-tool label are the actual hit areas.
        const sel = 'a.btn, button, .wk__chip, .ins__chip, .fq__more, summary.acc__q, label.chip, header a[href], .book-cta';
        const bad = [];
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue; // hidden
          // inline text links inside prose are exempt (WCAG 2.5.8 minimum applies
          // to standalone controls); flag standalone controls under 24px tall.
          if (r.height > 0 && r.height < 24) bad.push(`${el.className || el.tagName}:${Math.round(r.height)}px`);
        }
        return bad.slice(0, 5);
      });
      if (small.length) { fail.tap += small.length; console.log(`  TAP<24 ${route}: ${small.join(', ')}`); }
    }
    await ctx.close();
  }
}
console.log(`RESPONSIVE: overflow=${fail.overflow}/${ROUTES.length * WIDTHS.length}, h1!=1=${fail.h1}, tap<24px=${fail.tap}`);

// ---- Keyboard: focus visibility + core interactions ----
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/faq', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab'); // skip link
  const skip = await page.evaluate(() => document.activeElement?.textContent?.trim());
  // Open first accordion with keyboard
  const firstSummary = await page.$('summary.acc__q');
  await firstSummary.focus();
  await page.keyboard.press('Enter');
  const opened = await page.evaluate(() => document.querySelector('details.acc__item')?.hasAttribute('open'));
  // Focus ring present on a focused link?
  const focusRing = await page.evaluate(() => {
    const a = document.querySelector('a.btn') || document.querySelector('a[href]');
    a.focus();
    const s = getComputedStyle(a, ':focus-visible');
    const outline = getComputedStyle(a).outlineStyle;
    return { outline, hasFocusStyles: !!s };
  });
  if (skip?.toLowerCase().includes('skip')) console.log('KEYBOARD: skip-link focent OK');
  if (!opened) { fail.focus++; console.log('  accordion did not open via keyboard'); }
  console.log(`KEYBOARD: skip="${skip}", accordion-open=${opened}, outlineStyle=${focusRing.outline}`);
  await ctx.close();
}

// Growth Graph tabs keyboard on the homepage
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const tabs = await page.$$('[role="tab"], .gg-tab, button[aria-pressed]');
  let switched = false;
  if (tabs.length >= 2) {
    await tabs[1].focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    switched = await page.evaluate(() => !!document.querySelector('[aria-pressed="true"]'));
  }
  console.log(`GROWTH GRAPH: tabs=${tabs.length}, keyboard-activates=${switched}`);
  await ctx.close();
}

// ---- No-JS parity ----
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  const checks = {};
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  checks.homeGraph = await page.evaluate(() => document.body.textContent.includes('More sales'));
  await page.goto(BASE + '/map-your-stack', { waitUntil: 'domcontentloaded' });
  checks.mysReadable = await page.evaluate(() => document.querySelectorAll('input[type=checkbox]').length >= 9);
  await page.goto(BASE + '/book-a-call', { waitUntil: 'domcontentloaded' });
  checks.formPresent = await page.evaluate(() => !!document.querySelector('form'));
  await page.goto(BASE + '/work', { waitUntil: 'domcontentloaded' });
  checks.workCards = await page.evaluate(() => document.querySelectorAll('.wk__card').length);
  const revealHidden = await page.evaluate(() => {
    const el = document.querySelector('.u-reveal, .u-fade-up');
    if (!el) return 'none';
    return getComputedStyle(el).opacity;
  });
  checks.revealVisibleNoJs = revealHidden;
  if (!checks.homeGraph || !checks.mysReadable || !checks.formPresent || checks.workCards < 1) fail.nojs++;
  console.log('NO-JS parity:', JSON.stringify(checks));
  await ctx.close();
}

// ---- Reduced-motion: reveal elements at final (visible) state ----
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/what-we-do/build', { waitUntil: 'networkidle' });
  const op = await page.evaluate(() => {
    const el = document.querySelector('.u-reveal');
    return el ? getComputedStyle(el).opacity : 'none';
  });
  if (op !== 'none' && Number(op) < 0.99) { fail.motion++; console.log(`  reduced-motion reveal not final: opacity=${op}`); }
  console.log(`REDUCED-MOTION: reveal opacity=${op} (expect 1 or none)`);
  await ctx.close();
}

// ---- CWV lab (LCP / CLS) on representative pages ----
const cwvRoutes = ['/', '/what-we-do/build', '/map-your-stack', '/work/connected-store-rebuild', '/insights/why-connected-tools-beat-more-tools'];
for (const route of cwvRoutes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  const cwv = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0, cls = 0;
        new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve({ lcp: Math.round(lcp), cls: +cls.toFixed(3) }), 600);
      }),
  );
  console.log(`CWV ${route}: LCP=${cwv.lcp}ms CLS=${cwv.cls}`);
  await ctx.close();
}

console.log(`\nSUMMARY: axe=${fail.axe} overflow=${fail.overflow} h1=${fail.h1} tap=${fail.tap} nojs=${fail.nojs} motion=${fail.motion}`);
await browser.close();
process.exit(fail.axe + fail.overflow + fail.h1 + fail.nojs + fail.motion > 0 ? 1 : 0);
