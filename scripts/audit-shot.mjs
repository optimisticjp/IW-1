// Full-page audit with reduced-motion (all content visible) + a motion-on
// reveal check at a mid-page element.
import { chromium } from 'playwright-core';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: EXE });

// reduced-motion full-page shots
for (const [w,h,name] of [[390,844,'rm-390'],[1440,900,'rm-1440']]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4321/', { waitUntil:'networkidle' });
  await p.screenshot({ path:`scripts/audit-${name}.png`, fullPage:true });
  await ctx.close();
}

// motion-on: scroll through and assert reveals became visible
const ctx = await b.newContext({ viewport:{width:1024,height:768} });
const p = await ctx.newPage();
await p.goto('http://localhost:4321/', { waitUntil:'networkidle' });
await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} window.scrollTo(0,document.body.scrollHeight); await new Promise(r=>setTimeout(r,300)); });
const stats = await p.evaluate(()=>{
  const all=[...document.querySelectorAll('.u-reveal')];
  const hidden=all.filter(el=>getComputedStyle(el).opacity!=='1');
  return { total:all.length, hidden:hidden.length, sample: hidden.slice(0,4).map(e=>e.className.replace('u-reveal','').trim().slice(0,30)) };
});
console.log('motion-on reveal check:', JSON.stringify(stats));
await b.close();
