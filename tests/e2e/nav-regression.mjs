// Behavioural header navigation regression checks for desktop mega-menu and mobile sheet.
// Requires a production build served by `npm run preview` at BASE_URL (default http://localhost:4321).
import { existsSync } from 'node:fs';
import pw from 'playwright-core';

const { chromium } = pw;
const BASE = process.env.BASE_URL || 'http://localhost:4321';
const DEFAULT_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.CHROME_PATH || (existsSync(DEFAULT_CHROME) ? DEFAULT_CHROME : chromium.executablePath());
const browser = await chromium.launch({ executablePath });
let failures = 0;

const assert = (condition, message, details = '') => {
  if (condition) console.log(`PASS ${message}`);
  else { failures++; console.error(`FAIL ${message}${details ? `: ${details}` : ''}`); }
};

async function menuState(page) {
  return page.evaluate(() => ({
    hidden: document.querySelector('#mobile-nav').hidden,
    expanded: document.querySelector('#nav-toggle').getAttribute('aria-expanded'),
    label: document.querySelector('#nav-toggle').getAttribute('aria-label'),
    overflow: document.body.style.overflow,
    activeId: document.activeElement?.id || '',
    activeText: document.activeElement?.textContent?.trim() || '',
  }));
}

async function openMobileMenu(page) {
  const toggle = page.locator('#nav-toggle');
  await toggle.click();
  await page.waitForFunction(() => !document.querySelector('#mobile-nav').hidden);
  return toggle;
}

async function desktop(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const trigger = page.locator('.mega__summary');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const open = await page.locator('.mega').evaluate((el) => el.hasAttribute('open'));
  const metrics = await page.locator('.mega__panel').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      right: r.right,
      width: r.width,
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headings: [...el.querySelectorAll('.mega__cap')].filter((a) => {
        const rr = a.getBoundingClientRect();
        return rr.width > 0 && rr.height > 0;
      }).map((a) => a.textContent.trim()),
      overviewVisible: (() => {
        const a = el.querySelector('.mega__all');
        const rr = a.getBoundingClientRect();
        return rr.width > 0 && rr.height > 0;
      })(),
    };
  });
  assert(open, `desktop ${width} keyboard opens mega-menu`);
  assert(metrics.width >= Math.min(760, width - 80), `desktop ${width} panel has practical width`, JSON.stringify(metrics));
  assert(metrics.left >= 0 && metrics.right <= metrics.viewport, `desktop ${width} panel stays inside viewport`, JSON.stringify(metrics));
  assert(metrics.scrollWidth <= metrics.viewport + 1, `desktop ${width} creates no horizontal scroll`, JSON.stringify(metrics));
  assert(metrics.headings.length === 6 && metrics.overviewVisible, `desktop ${width} all capability headings and overview are visible`, JSON.stringify(metrics));
  await page.keyboard.press('Escape');
  const closed = !(await page.locator('.mega').evaluate((el) => el.hasAttribute('open')));
  const focusReturned = await page.locator('.mega__summary').evaluate((el) => document.activeElement === el);
  assert(closed && focusReturned, `desktop ${width} Escape closes mega-menu and returns focus`);
  await trigger.click();
  await page.mouse.click(10, height - 10);
  assert(!(await page.locator('.mega').evaluate((el) => el.hasAttribute('open'))), `desktop ${width} outside click closes mega-menu`);
  await ctx.close();
}

async function mobile(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await openMobileMenu(page);
  let state = await menuState(page);
  const overlay = await page.evaluate(() => {
    const t = document.querySelector('#nav-toggle').getBoundingClientRect();
    const panel = document.querySelector('#mobile-nav');
    const pr = panel.getBoundingClientRect();
    return {
      topControl: document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2)?.closest?.('#nav-toggle')?.id || '',
      panelVisible: pr.width > 0 && pr.height > 0,
      overflowY: getComputedStyle(panel).overflowY,
      scrollable: panel.scrollHeight > panel.clientHeight,
      panelHeight: pr.height,
      viewportHeight: window.innerHeight,
    };
  });
  assert(state.expanded === 'true' && state.label === 'Close menu', `mobile ${width} aria-expanded and label update`, JSON.stringify(state));
  assert(!state.hidden && overlay.panelVisible, `mobile ${width} panel becomes visible`, JSON.stringify({ state, overlay }));
  assert(state.overflow === 'hidden', `mobile ${width} opening locks body scroll`, JSON.stringify(state));
  assert(overlay.topControl === 'nav-toggle', `mobile ${width} close control remains usable above panel`, JSON.stringify(overlay));

  await page.keyboard.press('Shift+Tab');
  state = await menuState(page);
  assert(state.activeId === 'nav-toggle', `mobile ${width} close toggle is keyboard reachable after opening`, JSON.stringify(state));
  await page.keyboard.press('Tab');
  state = await menuState(page);
  assert(state.activeText.includes('What we do'), `mobile ${width} Tab from close toggle reaches first menu control`, JSON.stringify(state));
  await page.evaluate(() => document.querySelector('main a[href]')?.focus());
  await page.keyboard.press('Tab');
  state = await menuState(page);
  assert(state.activeText.includes('What we do'), `mobile ${width} focus cannot escape behind overlay`, JSON.stringify(state));

  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  state = await menuState(page);
  assert(state.hidden && state.expanded === 'false' && state.overflow === '', `mobile ${width} keyboard activation of toggle closes and restores scroll`, JSON.stringify(state));

  await openMobileMenu(page);
  await page.keyboard.press('Escape');
  state = await menuState(page);
  assert(state.hidden && state.expanded === 'false' && state.activeId === 'nav-toggle' && state.overflow === '', `mobile ${width} Escape closes, restores focus and scroll`, JSON.stringify(state));

  await openMobileMenu(page);
  await page.locator('#mobile-nav a.mnav__link[href]').first().click();
  await page.waitForFunction(() => document.querySelector('#mobile-nav').hidden);
  state = await menuState(page);
  assert(state.hidden && state.overflow === '', `mobile ${width} visible top-level link closes and restores scroll`, JSON.stringify(state));

  await openMobileMenu(page);
  const group = page.locator('#mobile-nav details.mnav__group');
  const summary = group.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const groupState = await group.evaluate((el) => {
    const panel = document.querySelector('#mobile-nav');
    return {
      open: el.hasAttribute('open'),
      visibleLinks: [...el.querySelectorAll('a')].filter((a) => {
        const r = a.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length,
      panelOverflowY: getComputedStyle(panel).overflowY,
      panelScrollable: panel.scrollHeight > panel.clientHeight,
      panelHeight: panel.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    };
  });
  assert(groupState.open && groupState.visibleLinks >= 7, `mobile ${width} What we do group expands and exposes links`, JSON.stringify(groupState));
  await page.keyboard.press('Tab');
  state = await menuState(page);
  assert(state.activeText.includes('All capabilities'), `mobile ${width} expanded submenu link is keyboard reachable`, JSON.stringify(state));
  await page.locator('#mobile-nav .mnav__sub a[href]').first().click();
  await page.waitForFunction(() => document.querySelector('#mobile-nav').hidden);
  state = await menuState(page);
  assert(state.hidden && state.overflow === '', `mobile ${width} visible submenu link closes and restores scroll`, JSON.stringify(state));

  await openMobileMenu(page);
  await page.setViewportSize({ width: 900, height });
  state = await menuState(page);
  assert(state.hidden && state.expanded === 'false' && state.overflow === '', `mobile ${width} resize to desktop resets menu`, JSON.stringify(state));
  await page.setViewportSize({ width: Math.min(width, 899), height });
  state = await menuState(page);
  assert(state.hidden && state.expanded === 'false' && state.label === 'Open menu', `mobile ${width} resize back below 900 leaves menu closed and synchronized`, JSON.stringify(state));
  if (width === 320 && height === 568) {
    assert(groupState.panelOverflowY === 'auto' && groupState.panelScrollable && Math.abs(groupState.panelHeight - groupState.viewportHeight) <= 1, `mobile ${width} panel remains full-height and vertically scrollable when content is expanded`, JSON.stringify(groupState));
  }
  await ctx.close();
}

for (const size of [[1440, 900], [1280, 800], [1024, 768], [900, 800]]) await desktop(...size);
for (const size of [[899, 800], [768, 1024], [430, 932], [390, 844], [375, 812], [320, 568]]) await mobile(...size);
await browser.close();
console.log(`BROWSER ${executablePath}`);
process.exit(failures ? 1 : 0);
