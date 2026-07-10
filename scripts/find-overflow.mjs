import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 } });
const p = await ctx.newPage();
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
const offenders = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      out.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,60), right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width) });
    }
  });
  return out.slice(0, 25);
});
console.log('viewport 1024; offenders (right>1025 or left<-1):');
for (const o of offenders) console.log(`  <${o.tag}> .${o.cls}  left=${o.left} right=${o.right} w=${o.w}`);
await b.close();
