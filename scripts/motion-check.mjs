import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport:{width:1024,height:768}, reducedMotion:'no-preference' });
const p = await ctx.newPage();
await p.goto('http://localhost:4321/', { waitUntil:'networkidle' });
// natural slow scroll to bottom
await p.evaluate(async()=>{
  const step=300;
  for(let y=0;y<=document.body.scrollHeight;y+=step){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120)); }
});
// wait for transitions to finish
await p.waitForTimeout(1000);
const stats = await p.evaluate(()=>{
  const all=[...document.querySelectorAll('.u-reveal')];
  const notFull=all.filter(el=>parseFloat(getComputedStyle(el).opacity)<0.99);
  const noClass=all.filter(el=>!el.classList.contains('is-in'));
  return { total:all.length, notFullOpacity:notFull.length, missingClass:noClass.length,
    sample: notFull.slice(0,5).map(e=>({c:e.className.replace('u-reveal','').trim().slice(0,26), op:getComputedStyle(e).opacity})) };
});
console.log(JSON.stringify(stats,null,0));
// also confirm the media query state
const mq = await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
console.log('reduced-motion active in this context:', mq);
await b.close();
