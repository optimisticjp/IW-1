// Phase 1 visual review + horizontal-overflow check (T033/T035).
// Renders the homepage at all required widths, screenshots each, and reports
// any horizontal overflow. Dev tooling only — not part of the site build.
import { chromium } from 'playwright-core';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const URL = process.env.QA_URL || 'http://localhost:4321/';
const widths = [
  { w: 360, h: 800, name: '360' },
  { w: 390, h: 844, name: '390' },
  { w: 768, h: 1024, name: '768' },
  { w: 1024, h: 768, name: '1024' },
  { w: 1440, h: 900, name: '1440' },
];

const browser = await chromium.launch({ executablePath: EXECUTABLE });
let failures = 0;

for (const { w, h, name } of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  // scroll to bottom to trigger reveals, then back to top for a clean shot
  await page.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy(0, 600);
        y += 600;
        if (y > document.body.scrollHeight) { clearInterval(t); r(null); }
      }, 30);
    });
  });
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    innerW: window.innerWidth,
  }));
  const overflow = metrics.scrollW > metrics.clientW + 1;
  if (overflow) failures++;
  console.log(
    `${name}px  scrollW=${metrics.scrollW} clientW=${metrics.clientW}  ` +
      (overflow ? `✗ HORIZONTAL OVERFLOW (+${metrics.scrollW - metrics.clientW}px)` : '✓ no overflow')
  );

  await page.screenshot({ path: `scripts/qa-${name}.png`, fullPage: name === '390' || name === '1440' });
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nRESULT: PASS — no horizontal overflow at any width' : `\nRESULT: FAIL — ${failures} width(s) overflow`);
process.exit(failures === 0 ? 0 : 1);
