import { chromium } from 'playwright-core';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: EXE });
const widths=[[360,800,'360'],[390,844,'390'],[768,1024,'768'],[1024,768,'1024'],[1440,900,'1440']];
let fails=0;
for (const [w,h,name] of widths){
  const ctx=await b.newContext({viewport:{width:w,height:h}, reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:4321/',{waitUntil:'networkidle'});
  const m=await p.evaluate(()=>({s:document.documentElement.scrollWidth,c:document.documentElement.clientWidth}));
  const over=m.s>m.c+1; if(over)fails++;
  console.log(`${name}px  ${over?'✗ OVERFLOW +'+(m.s-m.c):'✓ no overflow'}`);
  const full = (name==='390'||name==='1440');
  await p.screenshot({path:`scripts/rev-${name}.png`, fullPage: full});
  await ctx.close();
}
await b.close();
console.log(fails? `FAIL ${fails}`:'PASS no overflow');
process.exit(fails?1:0);
