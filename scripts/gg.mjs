import { chromium } from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
// desktop: each goal state
const ctx=await b.newContext({viewport:{width:1280,height:900}});
const p=await ctx.newPage(); await p.goto('http://localhost:4321/',{waitUntil:'networkidle'});
await p.evaluate(()=>document.getElementById('growth-graph').scrollIntoView());
await p.waitForTimeout(500);
const tabs = await p.$$('.ggtab');
const names=['sales','adcosts','repeat','working'];
for (let i=0;i<tabs.length;i++){
  await tabs[i].click();
  await p.waitForTimeout(1200);
  const el = await p.$('#growth-graph');
  await el.screenshot({path:`scripts/gg-${names[i]}.png`});
}
// aria-pressed + caption sanity
const state = await p.evaluate(()=>{
  const pressed=[...document.querySelectorAll('.ggtab')].map(t=>t.getAttribute('aria-pressed'));
  const cap=document.querySelector('.ggcap').textContent.slice(0,40);
  const onNodes=[...document.querySelectorAll('.ggnode.on')].map(n=>n.getAttribute('data-node'));
  return {pressed, cap, onNodes};
});
console.log('after selecting goal 4:', JSON.stringify(state));
await ctx.close();
// mobile graph
const m=await b.newContext({viewport:{width:390,height:844}});
const mp=await m.newPage(); await mp.goto('http://localhost:4321/',{waitUntil:'networkidle'});
await mp.evaluate(()=>document.getElementById('growth-graph').scrollIntoView());
await mp.waitForTimeout(500);
const el=await mp.$('#growth-graph'); await el.screenshot({path:'scripts/gg-mobile.png'});
await b.close(); console.log('done');
