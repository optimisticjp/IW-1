// Behavioural header navigation regression checks for desktop mega-menu and mobile sheet.
// Requires a production build served by `npm run preview` at BASE_URL (default http://localhost:4321).
import pw from 'playwright-core';

const { chromium } = pw;
const BASE = process.env.BASE_URL || 'http://localhost:4321';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;

const assert = (condition, message, details = '') => {
  if (condition) console.log(`PASS ${message}`);
  else { failures++; console.error(`FAIL ${message}${details ? `: ${details}` : ''}`); }
};

async function desktop(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByText('What we do').first().click();
  const open = await page.locator('.mega').evaluate((el) => el.hasAttribute('open'));
  const metrics = await page.locator('.mega__panel').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      right: r.right,
      width: r.width,
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      visibleLinks: [...el.querySelectorAll('a')].filter((a) => {
        const rr = a.getBoundingClientRect();
        return rr.width > 0 && rr.height > 0;
      }).length,
    };
  });
  assert(open, `desktop ${width} opens mega-menu`);
  assert(metrics.width >= Math.min(760, width - 80), `desktop ${width} panel has practical width`, JSON.stringify(metrics));
  assert(metrics.left >= 0 && metrics.right <= metrics.viewport, `desktop ${width} panel stays inside viewport`, JSON.stringify(metrics));
  assert(metrics.scrollWidth <= metrics.viewport + 1, `desktop ${width} creates no horizontal scroll`, JSON.stringify(metrics));
  assert(metrics.visibleLinks >= 7, `desktop ${width} capability links are visible`, JSON.stringify(metrics));
  await page.keyboard.press('Escape');
  assert(!(await page.locator('.mega').evaluate((el) => el.hasAttribute('open'))), `desktop ${width} Escape closes mega-menu`);
  await page.getByText('What we do').first().click();
  await page.mouse.click(10, height - 10);
  assert(!(await page.locator('.mega').evaluate((el) => el.hasAttribute('open'))), `desktop ${width} outside click closes mega-menu`);
  await ctx.close();
}

async function mobile(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const toggle = page.locator('#nav-toggle');
  await toggle.click();
  let state = await page.evaluate(() => ({
    hidden: document.querySelector('#mobile-nav').hidden,
    expanded: document.querySelector('#nav-toggle').getAttribute('aria-expanded'),
    overflow: document.body.style.overflow,
    topControl: document.elementFromPoint(...(() => { const r = document.querySelector('#nav-toggle').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })())?.id,
  }));
  assert(state.expanded === 'true', `mobile ${width} aria-expanded becomes true`, JSON.stringify(state));
  assert(state.hidden === false, `mobile ${width} panel becomes visible`, JSON.stringify(state));
  assert(state.overflow === 'hidden', `mobile ${width} opening locks body scroll`, JSON.stringify(state));
  assert(state.topControl === 'nav-toggle', `mobile ${width} close control remains usable above panel`, JSON.stringify(state));
  await page.keyboard.press('Escape');
  state = await page.evaluate(() => ({ hidden: document.querySelector('#mobile-nav').hidden, expanded: document.querySelector('#nav-toggle').getAttribute('aria-expanded'), overflow: document.body.style.overflow }));
  assert(state.hidden && state.expanded === 'false', `mobile ${width} Escape closes panel`, JSON.stringify(state));
  assert(state.overflow === '', `mobile ${width} Escape restores body scroll`, JSON.stringify(state));
  await toggle.click();
  await page.locator('#mobile-nav a[href]').first().click();
  state = await page.evaluate(() => ({ hidden: document.querySelector('#mobile-nav').hidden, overflow: document.body.style.overflow }));
  assert(state.hidden && state.overflow === '', `mobile ${width} menu link closes and restores scroll`, JSON.stringify(state));
  await toggle.click();
  await page.setViewportSize({ width: 900, height });
  state = await page.evaluate(() => ({ hidden: document.querySelector('#mobile-nav').hidden, expanded: document.querySelector('#nav-toggle').getAttribute('aria-expanded'), overflow: document.body.style.overflow }));
  assert(state.hidden && state.expanded === 'false' && state.overflow === '', `mobile ${width} resize to desktop resets menu`, JSON.stringify(state));
  await ctx.close();
}

for (const size of [[1440, 900], [1280, 800], [1024, 768], [900, 800]]) await desktop(...size);
for (const size of [[899, 800], [768, 1024], [430, 932], [390, 844], [375, 812], [320, 568]]) await mobile(...size);
await browser.close();
process.exit(failures ? 1 : 0);
