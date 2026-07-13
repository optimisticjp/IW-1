#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const reservedTlds = ['example', 'test', 'invalid', 'localhost'];
const internalMarkers = ['Owner to supply', 'Photo to supply', 'claude-web-builder-skills'];
const legalMarkers = ['Draft for review'];
const requiredHeaders = ['Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Permissions-Policy','Strict-Transport-Security'];

export function validateSiteUrl(value) {
  const blocks = [];
  if (!value) return [{ check: 'PUBLIC_SITE_URL is missing', why: 'Canonical URLs, robots and sitemap need the real production origin.', action: 'Set PUBLIC_SITE_URL to the final https production origin with no trailing slash.' }];
  let u; try { u = new URL(value); } catch { return [{ check: 'PUBLIC_SITE_URL is not a valid URL', why: 'The build cannot safely generate absolute production URLs.', action: 'Set PUBLIC_SITE_URL to a valid URL such as https://www.example.com, using the real domain.' }]; }
  const host = u.hostname.toLowerCase();
  if (u.protocol !== 'https:') blocks.push({ check: 'PUBLIC_SITE_URL must use https', why: 'Production pages should not advertise insecure URLs.', action: 'Change PUBLIC_SITE_URL to the HTTPS production origin.' });
  if (host === 'localhost' || host.endsWith('.localhost') || /^127\./.test(host) || host === '::1' || host === '[::1]' || host === '0.0.0.0') blocks.push({ check: 'PUBLIC_SITE_URL points to localhost or loopback', why: 'Public launch metadata must point to the public website.', action: 'Set PUBLIC_SITE_URL to the real public domain.' });
  const tld = host.split('.').pop();
  if (reservedTlds.includes(tld) || reservedTlds.some((t) => host.endsWith(`.${t}`))) blocks.push({ check: 'PUBLIC_SITE_URL uses a reserved domain', why: 'Reserved domains are placeholders and should not be launched.', action: 'Set PUBLIC_SITE_URL to the real production domain.' });
  if (u.username || u.password) blocks.push({ check: 'PUBLIC_SITE_URL contains credentials', why: 'Credentials in public URLs can leak secrets.', action: 'Remove the username and password from PUBLIC_SITE_URL.' });
  if (u.search || u.hash) blocks.push({ check: 'PUBLIC_SITE_URL contains a query string or fragment', why: 'Site origins must be stable clean origins.', action: 'Remove any ?query or #fragment from PUBLIC_SITE_URL.' });
  if (value.endsWith('/')) blocks.push({ check: 'PUBLIC_SITE_URL ends with /', why: 'The project expects the origin without a trailing slash.', action: 'Remove the trailing slash from PUBLIC_SITE_URL.' });
  return blocks;
}

export function validateBookingEndpoint(value) {
  if (!value) return [{ check: 'PUBLIC_BOOKING_ENDPOINT is missing', why: 'Production forms cannot deliver enquiries without a configured endpoint.', action: 'Set PUBLIC_BOOKING_ENDPOINT to the configured HTTPS form provider endpoint.' }];
  let u; try { u = new URL(value); } catch { return [{ check: 'PUBLIC_BOOKING_ENDPOINT is not a valid URL', why: 'The form cannot submit to an invalid endpoint.', action: 'Set PUBLIC_BOOKING_ENDPOINT to the provider URL. Do not include secrets.' }]; }
  const blocks = []; const host = u.hostname.toLowerCase();
  if (u.protocol !== 'https:') blocks.push({ check: `Booking endpoint origin ${u.origin} is not HTTPS`, why: 'Form submissions must be sent over HTTPS.', action: 'Use the HTTPS endpoint from the form provider.' });
  if (host === 'localhost' || host.endsWith('.localhost') || /^127\./.test(host)) blocks.push({ check: 'Booking endpoint points to localhost', why: 'Visitors cannot submit to your local machine.', action: 'Configure the public form provider endpoint.' });
  const tld = host.split('.').pop(); if (reservedTlds.includes(tld)) blocks.push({ check: 'Booking endpoint uses a reserved example domain', why: 'Placeholder endpoints do not deliver enquiries.', action: 'Configure the real form provider endpoint.' });
  if (u.username || u.password) blocks.push({ check: `Booking endpoint origin ${u.origin} contains credentials`, why: 'Credentials in frontend URLs can leak.', action: 'Remove credentials and use a public form endpoint only.' });
  return blocks;
}

function walk(dir, pred, out=[]) { if (!existsSync(dir)) return out; for (const n of readdirSync(dir)) { const p=join(dir,n); const s=statSync(p); if(s.isDirectory()) walk(p,pred,out); else if(pred(p,n)) out.push(p); } return out; }
function routeFor(file, dist) { const rel='/' + relative(dist,file).replace(/\\/g,'/'); return rel.replace(/\/index\.html$/,'/').replace(/\.html$/,''); }
const visibleText = (html) => html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
function isBadHost(url) { const h=url.hostname.toLowerCase(); return h==='localhost'||h.endsWith('.localhost')||h.endsWith('.example')||/^127\./.test(h); }

export function verifyFixture({ distDir, siteUrl, bookingEndpoint, envExamplePath }) {
  const blocks=[]; const passes=[];
  const siteBlocks = validateSiteUrl(siteUrl);
  blocks.push(...siteBlocks); blocks.push(...validateBookingEndpoint(bookingEndpoint));
  const siteIsValid = siteBlocks.length === 0;
  let site; try { site = new URL(siteUrl); } catch {}
  let booking; try { booking = new URL(bookingEndpoint); } catch {}
  if (!existsSync(distDir)) blocks.push({check:'dist/ is missing', why:'The production build output must exist before inspection.', action:'Run npm run build and fix any build errors.'}); else passes.push('Production build output exists');
  const pages = walk(distDir, (_,n)=>n.endsWith('.html')).map(file=>({file,route:routeFor(file,distDir),html:readFileSync(file,'utf8')}));
  for (const p of pages) for (const m of [...internalMarkers, ...legalMarkers]) if (visibleText(p.html).includes(m)) blocks.push({check:`${p.route} contains "${m}"`, why:m==='Draft for review'?'Legal copy still needs qualified human approval.':'Internal placeholder text should not be visible to visitors.', action:m==='Draft for review'?'Obtain legal review and remove the marker only after approval.':'Replace the placeholder with approved public content.'});
  for (const p of pages.filter(p=>!p.route.startsWith('/404'))) {
    const canon = p.html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (!canon) blocks.push({check:`${p.route} is missing a canonical URL`, why:'Indexable pages need clear canonical metadata.', action:'Add an absolute canonical URL for this route.'});
    else if (siteIsValid) { try { const u=new URL(canon); if(u.protocol!=='https:'||!site||u.origin!==site.origin||isBadHost(u)) blocks.push({check:`${p.route} has invalid canonical URL`, why:'Canonical URLs must use the exact production origin.', action:'Set PUBLIC_SITE_URL correctly and rebuild.'}); } catch { blocks.push({check:`${p.route} has malformed canonical URL`, why:'Search engines cannot use malformed canonicals.', action:'Fix the canonical URL generation.'}); } }
  }
  const sitemaps = walk(distDir, (_,n)=>/^sitemap.*\.xml$/.test(n));
  if (!sitemaps.length) blocks.push({check:'Sitemap file is missing', why:'Search engines use it to discover pages.', action:'Run the Astro build with sitemap generation enabled.'});
  for (const f of sitemaps) { const xml=readFileSync(f,'utf8'); const sitemapOriginReported = new Set(); for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) { try { const u=new URL(m[1]); if(siteIsValid && (!site||u.origin!==site.origin||isBadHost(u)) && !sitemapOriginReported.has(u.origin)) { sitemapOriginReported.add(u.origin); blocks.push({check:'Sitemap contains a URL outside the production origin', why:'Sitemaps must not advertise placeholders or wrong domains.', action:'Set PUBLIC_SITE_URL to the production origin and rebuild.'}); } if(/\/404\/?$/.test(u.pathname)) blocks.push({check:'Sitemap includes /404', why:'The custom error page should not be indexed.', action:'Keep /404 filtered out of sitemap generation.'}); } catch { blocks.push({check:'Sitemap contains a malformed URL', why:'Search engines cannot use malformed sitemap entries.', action:'Fix sitemap URL generation.'}); } } }
  const robotsPath=join(distDir,'robots.txt'); if(!existsSync(robotsPath)) blocks.push({check:'robots.txt is missing', why:'Crawler policy and sitemap discovery should be explicit.', action:'Ensure robots.txt is generated into dist/.'}); else { const txt=readFileSync(robotsPath,'utf8'); if(site && !txt.includes(`${site.origin}/sitemap`)) blocks.push({check:'robots.txt does not reference the production sitemap URL', why:'Crawlers may not discover the sitemap.', action:'Regenerate robots.txt using PUBLIC_SITE_URL.'}); if(/\.example|localhost/.test(txt)) blocks.push({check:'robots.txt contains placeholder or localhost origin', why:'Production robots must reference only production URLs.', action:'Set PUBLIC_SITE_URL and rebuild.'}); if(/User-agent:\s*\*\s*\nDisallow:\s*\//i.test(txt)) blocks.push({check:'robots.txt blocks all production crawling', why:'The live site would be hidden from search crawlers.', action:'Allow User-agent: * for production after setting the real domain.'}); }
  const headersPath=join(distDir,'_headers'); if(!existsSync(headersPath)) blocks.push({check:'_headers is missing from dist/', why:'Security headers must be deployed with the static site.', action:'Ensure public/_headers is copied into the build.'}); else { const h=readFileSync(headersPath,'utf8'); for(const name of requiredHeaders) if(!new RegExp(`^\\s*${name}:`,'mi').test(h)) blocks.push({check:`Missing security header ${name}`, why:'The existing security baseline must remain in place.', action:`Restore ${name} in public/_headers.`}); const csp=h.match(/^\s*Content-Security-Policy:\s*(.+)$/mi)?.[1]||''; for(const dir of ['connect-src','form-action']) { const part=csp.match(new RegExp(`${dir}\\s+([^;]+)`))?.[1]||''; if(booking && !part.split(/\s+/).includes(booking.origin)) blocks.push({check:`Booking origin ${booking.origin} is absent from ${dir}`, why:'The browser CSP would block the configured form provider.', action:`Intentionally add ${booking.origin} to ${dir} in public/_headers without using a wildcard.`}); if(part.includes('*')) blocks.push({check:`${dir} contains a wildcard`, why:'Wildcards weaken form security.', action:'List the exact required provider origin instead.'}); } }
  const routeSet=new Set(pages.map(p=>p.route.replace(/\/$/,'')||'/')); const byRoute=new Map(pages.map(p=>[p.route.replace(/\/$/,'')||'/',p]));
  for(const p of pages){ const ids=new Set([...p.html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])); for(const m of p.html.matchAll(/\s(?:href|src|action)="([^"]*)"/g)){ const href=m[1]; if(!href||/^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(href)) continue; if(href.startsWith('#')) { if(href.length>1&&!ids.has(href.slice(1))) blocks.push({check:`${p.route} has broken fragment ${href}`, why:'Links should move visitors to a real section.', action:'Fix the fragment or add the matching id.'}); continue;} if(!href.startsWith('/')) continue; const [pathFrag,frag]=href.split('#'); const clean=(pathFrag.split('?')[0].replace(/\/$/,'')||'/'); if(/\.[a-z0-9]+$/i.test(clean)||clean.startsWith('/_astro/')) { if(!existsSync(join(distDir, clean))) blocks.push({check:`${p.route} links to missing file ${clean}`, why:'Visitors would hit a missing asset.', action:'Fix or remove the static-file link.'}); continue;} if(!routeSet.has(clean)) blocks.push({check:`${p.route} links to missing route ${clean}`, why:'Visitors would hit a broken page.', action:'Create the route or correct the link.'}); else if(frag&&!byRoute.get(clean)?.html.includes(`id="${frag}"`)) blocks.push({check:`${p.route} links to missing fragment ${clean}#${frag}`, why:'The destination section does not exist.', action:'Fix the fragment or add the destination id.'}); }}
  if(envExamplePath && existsSync(envExamplePath)){ const env=readFileSync(envExamplePath,'utf8'); if(/(sk_live_|ghp_|xox[baprs]-|AKIA[0-9A-Z]{16}|password\s*=\s*\S+|token\s*=\s*\S+)/i.test(env)) blocks.push({check:'.env.example appears to contain a secret', why:'Example env files are committed publicly.', action:'Remove real secrets and leave documentation-only placeholders.'}); }
  return { ok: blocks.length===0, passes, blocks };
}

function printResult(res){ console.log('\nInfinite Weblinks launch verification\n'); for(const p of res.passes) console.log(`PASS  ${p}`); for(const b of res.blocks) console.log(`BLOCKED  ${b.check}\n         Why: ${b.why}\n         Action: ${b.action}`); console.log(`\nResult: ${res.ok?'PASS':`BLOCKED — ${res.blocks.length} launch action${res.blocks.length===1?'':'s'} remain`}`); if(!res.ok){ console.log('\nRemaining manual actions:'); res.blocks.forEach((b,i)=>console.log(`${i+1}. ${b.action}`)); }}

export function runCli(){ console.log('Infinite Weblinks launch verification'); console.log('\nRunning production build...'); const build=spawnSync('npm',['run','build'],{cwd:root,stdio:'inherit',env:process.env}); const preliminary=[]; if(build.status!==0) preliminary.push({check:'Production build failed', why:'The launch checker can only inspect a successful production build.', action:'Fix the Astro build errors and rerun npm run verify:launch.'}); const res=verifyFixture({distDir:join(root,'dist'),siteUrl:process.env.PUBLIC_SITE_URL||'',bookingEndpoint:process.env.PUBLIC_BOOKING_ENDPOINT||'',envExamplePath:join(root,'.env.example')}); res.blocks.unshift(...preliminary); if(build.status===0) res.passes.unshift('Production build completed'); res.ok=res.blocks.length===0; printResult(res); process.exit(res.ok?0:1); }
if (import.meta.url === `file://${process.argv[1]}`) runCli();
