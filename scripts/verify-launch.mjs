#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptPath);
const root = resolve(scriptDir, '..');

const RESERVED_TLDS = ['example', 'test', 'invalid', 'localhost'];
const INTERNAL_MARKERS = ['Owner to supply', 'Photo to supply', 'claude-web-builder-skills'];
const LEGAL_MARKERS = ['Draft for review'];
const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'X-Frame-Options',
  'Permissions-Policy',
  'Strict-Transport-Security',
];
const PUBLIC_EXAMPLE_KEYS = new Set([
  'PUBLIC_SITE_URL',
  'PUBLIC_BOOKING_ENDPOINT',
  'PUBLIC_NEWSLETTER_ENDPOINT',
]);
const SECRET_PATTERNS = [
  /sk_live_[A-Za-z0-9_-]+/i,
  /ghp_[A-Za-z0-9_]+/i,
  /xox[baprs]-[A-Za-z0-9-]+/i,
  /AKIA[0-9A-Z]{16}/,
  /(?:api[_-]?key|access[_-]?token|secret|password|private[_-]?key)\s*=\s*[^\s#]+/i,
];

export function isMainModule(metaUrl = import.meta.url, argvPath = process.argv[1]) {
  if (!argvPath) return false;
  return normalize(fileURLToPath(metaUrl)) === normalize(resolve(argvPath));
}

function hostUsesReservedTld(hostname) {
  const host = hostname.toLowerCase();
  const tld = host.split('.').pop();
  return RESERVED_TLDS.includes(tld) || RESERVED_TLDS.some((tldName) => host.endsWith(`.${tldName}`));
}

function isLoopbackHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    /^127(?:\.\d{1,3}){0,3}$/.test(host) ||
    host === '0.0.0.0' ||
    host === '::1'
  );
}

function safeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return 'the configured origin';
  }
}

export function validateSiteUrl(value) {
  if (!value) {
    return [{
      check: 'PUBLIC_SITE_URL is missing',
      why: 'Canonical URLs, robots and sitemap need the real production origin.',
      action: 'Set PUBLIC_SITE_URL to the final https production origin with no trailing slash.',
    }];
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return [{
      check: 'PUBLIC_SITE_URL is not a valid URL',
      why: 'The build cannot safely generate absolute production URLs.',
      action: 'Set PUBLIC_SITE_URL to a valid origin such as https://domain.com.',
    }];
  }

  const blocks = [];
  if (url.protocol !== 'https:') {
    blocks.push({
      check: 'PUBLIC_SITE_URL must use https',
      why: 'Production pages should not advertise insecure URLs.',
      action: 'Change PUBLIC_SITE_URL to the HTTPS production origin.',
    });
  }
  if (isLoopbackHost(url.hostname)) {
    blocks.push({
      check: 'PUBLIC_SITE_URL points to localhost or loopback',
      why: 'Public launch metadata must point to the public website.',
      action: 'Set PUBLIC_SITE_URL to the real public domain.',
    });
  }
  if (hostUsesReservedTld(url.hostname)) {
    blocks.push({
      check: 'PUBLIC_SITE_URL uses a reserved domain',
      why: 'Reserved domains are placeholders and should not be launched.',
      action: 'Set PUBLIC_SITE_URL to the real production domain.',
    });
  }
  if (url.username || url.password) {
    blocks.push({
      check: 'PUBLIC_SITE_URL contains credentials',
      why: 'Credentials in public URLs can leak secrets.',
      action: 'Remove the username and password from PUBLIC_SITE_URL.',
    });
  }
  if (url.pathname !== '/') {
    blocks.push({
      check: 'PUBLIC_SITE_URL must be a clean origin, not a page or subdirectory',
      why: 'The value must be an origin, not a page or subdirectory.',
      action: 'Use only https://domain.com with no path, query, fragment or trailing slash.',
    });
  }
  if (url.search || url.hash) {
    blocks.push({
      check: 'PUBLIC_SITE_URL contains a query string or fragment',
      why: 'Site origins must be stable clean origins.',
      action: 'Use only https://domain.com with no query, fragment or trailing slash.',
    });
  }
  if (value.endsWith('/')) {
    blocks.push({
      check: 'PUBLIC_SITE_URL ends with /',
      why: 'The project expects the origin without a trailing slash.',
      action: 'Use only https://domain.com with no trailing slash.',
    });
  }
  return blocks;
}

export function validateBookingEndpoint(value) {
  if (!value) {
    return [{
      check: 'PUBLIC_BOOKING_ENDPOINT is missing',
      why: 'Production forms cannot deliver enquiries without a configured endpoint.',
      action: 'Set PUBLIC_BOOKING_ENDPOINT to the configured HTTPS form provider endpoint.',
    }];
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return [{
      check: 'PUBLIC_BOOKING_ENDPOINT is not a valid URL',
      why: 'The form cannot submit to an invalid endpoint.',
      action: 'Set PUBLIC_BOOKING_ENDPOINT to the provider URL. Do not include secrets.',
    }];
  }

  const origin = url.origin;
  const blocks = [];
  if (url.protocol !== 'https:') {
    blocks.push({
      check: `Booking endpoint origin ${origin} is not HTTPS`,
      why: 'Form submissions must be sent over HTTPS.',
      action: 'Use the HTTPS endpoint from the form provider.',
    });
  }
  if (isLoopbackHost(url.hostname)) {
    blocks.push({
      check: `Booking endpoint origin ${origin} points to localhost or loopback`,
      why: 'Visitors cannot submit to a local machine.',
      action: 'Configure the public form provider endpoint.',
    });
  }
  if (hostUsesReservedTld(url.hostname)) {
    blocks.push({
      check: `Booking endpoint origin ${origin} uses a reserved example domain`,
      why: 'Placeholder endpoints do not deliver enquiries.',
      action: 'Configure the real form provider endpoint.',
    });
  }
  if (url.username || url.password) {
    blocks.push({
      check: `Booking endpoint origin ${origin} contains credentials`,
      why: 'Credentials in frontend URLs can leak.',
      action: 'Remove credentials and use a public form endpoint only.',
    });
  }
  return blocks;
}

function walkFiles(dir, predicate, output = []) {
  if (!existsSync(dir)) return output;
  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) walkFiles(filePath, predicate, output);
    else if (predicate(filePath, name)) output.push(filePath);
  }
  return output;
}

function routeForHtml(filePath, distDir) {
  const rel = `/${relative(distDir, filePath).replace(/\\/g, '/')}`;
  return rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}

function stripInvisibleHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

function isBadPublicHost(url) {
  return isLoopbackHost(url.hostname) || url.hostname.toLowerCase().endsWith('.example');
}

function collectHtmlPages(distDir) {
  return walkFiles(distDir, (_filePath, name) => name.endsWith('.html')).map((filePath) => ({
    filePath,
    route: routeForHtml(filePath, distDir),
    html: readFileSync(filePath, 'utf8'),
  }));
}

function checkMarkers(pages) {
  const blocks = [];
  for (const page of pages) {
    const text = stripInvisibleHtml(page.html);
    for (const marker of [...INTERNAL_MARKERS, ...LEGAL_MARKERS]) {
      if (!text.includes(marker)) continue;
      blocks.push({
        check: `${page.route} contains "${marker}"`,
        why: marker === 'Draft for review'
          ? 'Legal copy still needs qualified human approval.'
          : 'Internal placeholder text should not be visible to visitors.',
        action: marker === 'Draft for review'
          ? 'Obtain legal review and remove the marker only after approval.'
          : 'Replace the placeholder with approved public content.',
      });
    }
  }
  return blocks;
}

function checkCanonicals(pages, siteUrl, siteIsValid) {
  const blocks = [];
  let site;
  if (siteIsValid) site = new URL(siteUrl);

  for (const page of pages.filter((candidate) => !candidate.route.startsWith('/404'))) {
    const canonical = page.html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (!canonical) {
      blocks.push({
        check: `${page.route} is missing a canonical URL`,
        why: 'Indexable pages need clear canonical metadata.',
        action: 'Add an absolute canonical URL for this route.',
      });
      continue;
    }
    if (!siteIsValid) continue;
    try {
      const url = new URL(canonical);
      if (url.protocol !== 'https:' || url.origin !== site.origin || isBadPublicHost(url)) {
        blocks.push({
          check: `${page.route} has invalid canonical URL`,
          why: 'Canonical URLs must use the exact production origin.',
          action: 'Set PUBLIC_SITE_URL correctly and rebuild.',
        });
      }
    } catch {
      blocks.push({
        check: `${page.route} has malformed canonical URL`,
        why: 'Search engines cannot use malformed canonicals.',
        action: 'Fix the canonical URL generation.',
      });
    }
  }
  return blocks;
}

function checkSitemaps(distDir, siteUrl, siteIsValid) {
  const blocks = [];
  const sitemaps = walkFiles(distDir, (_filePath, name) => /^sitemap.*\.xml$/.test(name));
  if (sitemaps.length === 0) {
    return [{
      check: 'Sitemap file is missing',
      why: 'Search engines use it to discover pages.',
      action: 'Run the Astro build with sitemap generation enabled.',
    }];
  }

  const site = siteIsValid ? new URL(siteUrl) : undefined;
  for (const sitemap of sitemaps) {
    const xml = readFileSync(sitemap, 'utf8');
    const reportedOrigins = new Set();
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        const url = new URL(match[1]);
        if (site && (url.origin !== site.origin || isBadPublicHost(url)) && !reportedOrigins.has(url.origin)) {
          reportedOrigins.add(url.origin);
          blocks.push({
            check: 'Sitemap contains a URL outside the production origin',
            why: 'Sitemaps must not advertise placeholders or wrong domains.',
            action: 'Set PUBLIC_SITE_URL to the production origin and rebuild.',
          });
        }
        if (/\/404\/?$/.test(url.pathname)) {
          blocks.push({
            check: 'Sitemap includes /404',
            why: 'The custom error page should not be indexed.',
            action: 'Keep /404 filtered out of sitemap generation.',
          });
        }
      } catch {
        blocks.push({
          check: 'Sitemap contains a malformed URL',
          why: 'Search engines cannot use malformed sitemap entries.',
          action: 'Fix sitemap URL generation.',
        });
      }
    }
  }
  return blocks;
}

export function robotsBlocksAllCrawling(robotsText) {
  const lines = robotsText.replace(/\r\n/g, '\n').split('\n');
  let appliesToAll = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;

    const [rawName, ...rawValueParts] = line.split(':');
    if (!rawValueParts.length) continue;
    const name = rawName.trim().toLowerCase();
    const value = rawValueParts.join(':').trim().toLowerCase();

    if (name === 'user-agent') {
      appliesToAll = value === '*';
      continue;
    }
    if (appliesToAll && name === 'disallow' && value === '/') return true;
  }
  return false;
}

function checkRobots(distDir, siteUrl) {
  const robotsPath = join(distDir, 'robots.txt');
  if (!existsSync(robotsPath)) {
    return [{
      check: 'robots.txt is missing',
      why: 'Crawler policy and sitemap discovery should be explicit.',
      action: 'Ensure robots.txt is generated into dist/.',
    }];
  }

  const blocks = [];
  const text = readFileSync(robotsPath, 'utf8');
  const origin = safeOrigin(siteUrl);
  if (siteUrl && !text.includes(`${origin}/sitemap`)) {
    blocks.push({
      check: 'robots.txt does not reference the production sitemap URL',
      why: 'Crawlers may not discover the sitemap.',
      action: 'Regenerate robots.txt using PUBLIC_SITE_URL.',
    });
  }
  if (/\.example|localhost/.test(text)) {
    blocks.push({
      check: 'robots.txt contains placeholder or localhost origin',
      why: 'Production robots must reference only production URLs.',
      action: 'Set PUBLIC_SITE_URL and rebuild.',
    });
  }
  if (robotsBlocksAllCrawling(text)) {
    blocks.push({
      check: 'robots.txt blocks all production crawling',
      why: 'The live site would be hidden from search crawlers.',
      action: 'Allow User-agent: * for production after setting the real domain.',
    });
  }
  return blocks;
}

function checkHeaders(distDir, bookingEndpoint) {
  const headersPath = join(distDir, '_headers');
  if (!existsSync(headersPath)) {
    return [{
      check: '_headers is missing from dist/',
      why: 'Security headers must be deployed with the static site.',
      action: 'Ensure public/_headers is copied into the build.',
    }];
  }

  const blocks = [];
  const headers = readFileSync(headersPath, 'utf8');
  for (const headerName of REQUIRED_HEADERS) {
    if (!new RegExp(`^\\s*${headerName}:`, 'mi').test(headers)) {
      blocks.push({
        check: `Missing security header ${headerName}`,
        why: 'The existing security baseline must remain in place.',
        action: `Restore ${headerName} in public/_headers.`,
      });
    }
  }

  let booking;
  try {
    booking = new URL(bookingEndpoint);
  } catch {
    return blocks;
  }

  const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/mi)?.[1] ?? '';
  for (const directive of ['connect-src', 'form-action']) {
    const directiveValue = csp.match(new RegExp(`${directive}\\s+([^;]+)`))?.[1] ?? '';
    const sources = directiveValue.split(/\s+/).filter(Boolean);
    if (!sources.includes(booking.origin)) {
      blocks.push({
        check: `Booking origin ${booking.origin} is absent from ${directive}`,
        why: 'The browser CSP would block the configured form provider.',
        action: `Intentionally add ${booking.origin} to ${directive} in public/_headers without using a wildcard.`,
      });
    }
    if (sources.includes('*')) {
      blocks.push({
        check: `${directive} contains a wildcard`,
        why: 'Wildcards weaken form security.',
        action: 'List the exact required provider origin instead.',
      });
    }
  }
  return blocks;
}

function routeToPathname(route) {
  return route.endsWith('/') ? route : `${route}/`;
}

function resolveInternalUrl(href, sourceRoute) {
  try {
    return new URL(href, `https://internal.invalid${routeToPathname(sourceRoute)}`);
  } catch {
    return null;
  }
}

function staticFileExists(distDir, pathname) {
  return existsSync(join(distDir, pathname));
}

function checkInternalLinks(distDir, pages) {
  const blocks = [];
  const routeSet = new Set(pages.map((page) => page.route.replace(/\/$/, '') || '/'));
  const byRoute = new Map(pages.map((page) => [page.route.replace(/\/$/, '') || '/', page]));

  for (const page of pages) {
    const ids = new Set([...page.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    const links = page.html.matchAll(/\s(?:href|src|action)="([^"]*)"/g);

    for (const match of links) {
      const href = match[1];
      if (!href) continue;
      if (/^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(href)) continue;

      if (href.startsWith('#')) {
        const fragment = href.slice(1);
        if (fragment && !ids.has(fragment)) {
          blocks.push({
            check: `${page.route} has broken fragment ${href}`,
            why: 'Links should move visitors to a real section.',
            action: 'Fix the fragment or add the matching id.',
          });
        }
        continue;
      }

      const resolved = resolveInternalUrl(href, page.route);
      if (!resolved) continue;
      const pathname = decodeURIComponent(resolved.pathname);
      const cleanRoute = pathname.replace(/\/$/, '') || '/';
      const fragment = resolved.hash ? decodeURIComponent(resolved.hash.slice(1)) : '';

      if (/\.[a-z0-9]+$/i.test(pathname) || pathname.startsWith('/_astro/')) {
        if (!staticFileExists(distDir, pathname)) {
          blocks.push({
            check: `${page.route} links to missing file ${pathname}`,
            why: 'Visitors would hit a missing asset.',
            action: 'Fix or remove the static-file link.',
          });
        }
        continue;
      }

      if (!routeSet.has(cleanRoute)) {
        blocks.push({
          check: `${page.route} links to missing route ${cleanRoute}`,
          why: 'Visitors would hit a broken page.',
          action: 'Create the route or correct the link.',
        });
        continue;
      }

      if (fragment && !byRoute.get(cleanRoute)?.html.includes(`id="${fragment}"`)) {
        blocks.push({
          check: `${page.route} links to missing fragment ${cleanRoute}#${fragment}`,
          why: 'The destination section does not exist.',
          action: 'Fix the fragment or add the destination id.',
        });
      }
    }
  }
  return blocks;
}

function parseEnvAssignments(text) {
  const assignments = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].replace(/\s+#.*$/, '').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    assignments.push({ key, value });
  }
  return assignments;
}

export function checkEnvExample(envExamplePath) {
  if (!envExamplePath || !existsSync(envExamplePath)) {
    return [{
      check: '.env.example is missing',
      why: 'The README tells beginners to copy .env.example for local setup.',
      action: 'Restore .env.example with documented blank variable names only.',
    }];
  }

  const blocks = [];
  const text = readFileSync(envExamplePath, 'utf8');
  for (const { key, value } of parseEnvAssignments(text)) {
    if (PUBLIC_EXAMPLE_KEYS.has(key) && value !== '') {
      blocks.push({
        check: `.env.example contains a committed value for ${key}`,
        why: 'Example environment files should document variable names, not real configured values.',
        action: `Leave ${key}= blank in .env.example and configure the real value in the hosting provider.`,
      });
    }
  }

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      blocks.push({
        check: '.env.example appears to contain a secret or private credential',
        why: 'Example env files are committed publicly.',
        action: 'Remove real secrets and leave documentation-only placeholders.',
      });
      break;
    }
  }
  return blocks;
}

export function verifyFixture({ distDir, siteUrl, bookingEndpoint, envExamplePath }) {
  const blocks = [];
  const passes = [];
  const siteBlocks = validateSiteUrl(siteUrl);
  const bookingBlocks = validateBookingEndpoint(bookingEndpoint);
  const siteIsValid = siteBlocks.length === 0;

  blocks.push(...siteBlocks, ...bookingBlocks);

  if (!existsSync(distDir)) {
    blocks.push({
      check: 'dist/ is missing',
      why: 'The production build output must exist before inspection.',
      action: 'Run npm run build and fix any build errors.',
    });
  } else {
    passes.push('Production build output exists');
  }

  const pages = collectHtmlPages(distDir);
  if (existsSync(distDir) && pages.length === 0) {
    blocks.push({
      check: 'dist/ contains no HTML pages',
      why: 'A successful static site build should produce public HTML routes.',
      action: 'Fix the production build so public HTML pages are generated.',
    });
  }

  blocks.push(...checkMarkers(pages));
  blocks.push(...checkCanonicals(pages, siteUrl, siteIsValid));
  blocks.push(...checkSitemaps(distDir, siteUrl, siteIsValid));
  blocks.push(...checkRobots(distDir, siteUrl));
  blocks.push(...checkHeaders(distDir, bookingEndpoint));
  blocks.push(...checkInternalLinks(distDir, pages));
  blocks.push(...checkEnvExample(envExamplePath));

  return { ok: blocks.length === 0, passes, blocks };
}

function printResult(result) {
  console.log('\nInfinite Weblinks launch verification\n');
  for (const pass of result.passes) console.log(`PASS  ${pass}`);
  for (const block of result.blocks) {
    console.log(`BLOCKED  ${block.check}`);
    console.log(`         Why: ${block.why}`);
    console.log(`         Action: ${block.action}`);
  }
  console.log(`\nResult: ${result.ok ? 'PASS' : `BLOCKED — ${result.blocks.length} launch action${result.blocks.length === 1 ? '' : 's'} remain`}`);
  if (!result.ok) {
    console.log('\nRemaining manual actions:');
    result.blocks.forEach((block, index) => console.log(`${index + 1}. ${block.action}`));
  }
}

export function runCli() {
  console.log('Infinite Weblinks launch verification');
  console.log('\nRunning production build...');
  const build = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', env: process.env });
  const preliminaryBlocks = [];
  if (build.status !== 0) {
    preliminaryBlocks.push({
      check: 'Production build failed',
      why: 'The launch checker can only inspect a successful production build.',
      action: 'Fix the Astro build errors and rerun npm run verify:launch.',
    });
  }

  const result = verifyFixture({
    distDir: join(root, 'dist'),
    siteUrl: process.env.PUBLIC_SITE_URL || '',
    bookingEndpoint: process.env.PUBLIC_BOOKING_ENDPOINT || '',
    envExamplePath: join(root, '.env.example'),
  });

  result.blocks.unshift(...preliminaryBlocks);
  if (build.status === 0) result.passes.unshift('Production build completed');
  result.ok = result.blocks.length === 0;
  printResult(result);
  process.exit(result.ok ? 0 : 1);
}

if (isMainModule(import.meta.url, process.argv[1])) runCli();
