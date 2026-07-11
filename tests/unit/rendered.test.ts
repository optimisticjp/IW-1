import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const distHome = resolve(root, 'dist/index.html');
const distBook = resolve(root, 'dist/book-a-call/index.html');
const distMys = resolve(root, 'dist/map-your-stack/index.html');
const distWwd = resolve(root, 'dist/what-we-do/index.html');
const distWwh = resolve(root, 'dist/who-we-help/index.html');
const html = existsSync(distHome) ? readFileSync(distHome, 'utf8') : '';
const book = existsSync(distBook) ? readFileSync(distBook, 'utf8') : '';
const mys = existsSync(distMys) ? readFileSync(distMys, 'utf8') : '';
const wwd = existsSync(distWwd) ? readFileSync(distWwd, 'utf8') : '';
const wwh = existsSync(distWwh) ? readFileSync(distWwh, 'utf8') : '';
const run = html ? describe : describe.skip;

run('built homepage (dist/index.html)', () => {
  it('has exactly one <h1>', () => {
    expect((html.match(/<h1/g) || []).length).toBe(1);
  });

  it('renders sections in the brief order', () => {
    const order = ['id="top"', 'id="three-doors"', 'id="growth-graph"', 'id="capabilities"', 'id="proof"', 'id="book"'];
    const positions = order.map((id) => html.indexOf(id));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('keeps the exact hero copy', () => {
    expect(html).toContain('You focus on your work.');
    expect(html).toContain('We handle the digital side.');
  });

  it('every "Book a free call" link resolves to /book-a-call (no dead #book CTA)', () => {
    // find anchors/buttons whose text is "Book a free call" and check href
    const matches = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>\s*(?:<[^>]+>\s*)*Book a free call/g)];
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) expect(m[1]).toBe('/book-a-call');
  });

  it('uses "Tracking" consistently and not "Analytics"', () => {
    expect(html).toContain('>Tracking<');
    expect(html).not.toContain('>Analytics<');
  });

  it('renders four Growth Graph goal tabs + a live caption region', () => {
    expect((html.match(/class="ggtab"/g) || []).length).toBe(4);
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
  });

  it('shows no public placeholder labels', () => {
    const visible = html.replace(/<script[^>]*class="gg-data"[\s\S]*?<\/script>/g, '');
    expect(visible.toLowerCase()).not.toContain('placeholder');
    expect(visible).not.toContain('assetStatus');
    expect(visible).not.toContain('TODO(content)');
  });

  it('offers the "Map your own stack" secondary CTA in the Growth Graph section', () => {
    const m = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>\s*(?:<[^>]+>\s*)*Map your own stack/g)];
    expect(m.length).toBeGreaterThan(0);
    expect(m[0][1]).toBe('/map-your-stack');
    // the primary CTA is not downgraded — Book a free call still resolves to /book-a-call
    expect(html).toMatch(/href="\/book-a-call"/);
  });
});

(mys ? describe : describe.skip)('built Map Your Stack page (dist/map-your-stack/index.html)', () => {
  it('has exactly one <h1> with the exact page heading', () => {
    expect((mys.match(/<h1/g) || []).length).toBe(1);
    expect(mys).toContain('See how connected your growth');
    expect(mys).toContain('really is');
  });

  it('uses a semantic fieldset/legend with nine real labelled checkboxes', () => {
    expect((mys.match(/<fieldset/g) || []).length).toBe(1);
    expect(mys).toContain('Which of these do you use?');
    expect((mys.match(/type="checkbox"/g) || []).length).toBe(9);
    expect((mys.match(/name="tools"/g) || []).length).toBe(9);
    // each checkbox has an associated <label for> (real, not a div)
    for (const key of ['website', 'store', 'googleAds', 'social', 'tracking', 'crm', 'email', 'whatsapp', 'ai']) {
      expect(mys).toContain(`id="chip-${key}"`);
      expect(mys).toContain(`for="chip-${key}"`);
    }
  });

  it('disables the reveal button until enough tools are chosen, and says why accessibly', () => {
    expect(mys).toMatch(/id="mys-go"[^>]*disabled/);
    expect(mys).toMatch(/aria-describedby="mys-go-hint"/);
    expect(mys).toContain('Show my connection map');
    expect(mys).toContain('Tap at least two tools');
  });

  it('reuses the Growth Graph engine: nine nodes, a hub, and one link path per rule', () => {
    expect((mys.match(/class="sgnode /g) || []).length).toBe(9);
    expect((mys.match(/class="sglink"/g) || []).length).toBe(10);
    expect(mys).toContain('sghub__label');
    // shares the exact radial viewBox with the homepage graph
    expect(mys).toContain('viewBox="0 0 780 640"');
    expect(html).toContain('viewBox="0 0 780 640"');
  });

  it('announces the result via a live region and links the CTA to /book-a-call', () => {
    expect(mys).toMatch(/id="mys-live"[^>]*role="status"[^>]*aria-live="polite"/);
    const cta = [...mys.matchAll(/<a[^>]*href="([^"]+)"[^>]*id="mys-cta"|id="mys-cta"[^>]*href="([^"]+)"/g)];
    expect(mys).toContain('Get your full growth map on a free call');
    expect(mys).toContain('href="/book-a-call"');
    expect(cta.length).toBeGreaterThan(0);
  });

  it('keeps the honest self-check framing and makes no false audit claim', () => {
    // Task 0 Fix 2: sharper disclaimer that explains why a call adds something
    expect(mys).toContain("This result is based on the tools you selected. On a call we'll review how they're actually configured and connected.");
    expect(mys).not.toContain('This is a quick read based on what you use, not a technical audit.');
    for (const claim of ['free technical audit', 'AI-powered audit', 'automatic integration scanner', 'guaranteed growth score', 'we scanned', 'we detected']) {
      expect(mys.toLowerCase()).not.toContain(claim.toLowerCase());
    }
  });

  it('carries route-specific SEO metadata (title, description, canonical, OG)', () => {
    expect(mys).toMatch(/<title>[^<]*Map your stack[^<]*<\/title>/);
    expect(mys).toMatch(/<link rel="canonical" href="[^"]*\/map-your-stack"/);
    expect(mys).toMatch(/<meta property="og:title"/);
    expect(mys).toMatch(/<meta name="description" content="[^"]*self-check/);
  });

  it('has no visible placeholder badges', () => {
    expect(mys.toLowerCase()).not.toContain('placeholder');
    expect(mys).not.toContain('TODO(content)');
  });
});

(book ? describe : describe.skip)('built booking page (dist/book-a-call/index.html)', () => {
  it('exists with one <h1> and the booking form', () => {
    expect((book.match(/<h1/g) || []).length).toBe(1);
    expect(book).toContain('id="booking-form"');
    expect(book).toMatch(/role="status"[^>]*aria-live="polite"/);
  });
  it('includes required fields and a privacy acknowledgement', () => {
    for (const id of ['bk-name', 'bk-email', 'bk-company', 'bk-help', 'bk-details', 'bk-privacy']) {
      expect(book).toContain(`id="${id}"`);
    }
  });
});

(wwd ? describe : describe.skip)('built What We Do page (dist/what-we-do/index.html)', () => {
  it('has one <h1> with the exact heading', () => {
    expect((wwd.match(/<h1/g) || []).length).toBe(1);
    expect(wwd).toContain('One partner.');
    expect(wwd).toContain('Six connected systems.');
  });
  it('renders all six system sections with stable deep-link ids', () => {
    for (const id of ['build', 'attract', 'convert', 'connect', 'retain', 'scale']) {
      expect(wwd).toContain(`id="${id}"`);
    }
  });
  it('the six-at-a-glance overview links down to each system', () => {
    for (const id of ['build', 'attract', 'convert', 'connect', 'retain', 'scale']) {
      expect(wwd).toMatch(new RegExp(`href="#${id}"`));
    }
  });
  it('keeps the connected-engagement story and the five project steps', () => {
    // apostrophes are entity-escaped in {expressions}; match an apostrophe-free slice
    expect(wwd).toContain('what a connected engagement looks like.');
    expect(wwd).toContain('building a growth engine.');
    for (const step of ['Understand', 'Map', 'Grow']) expect(wwd).toContain(step);
  });
  it('CTA links resolve to the existing journeys', () => {
    expect(wwd).toContain('href="/book-a-call"');
    expect(wwd).toContain('href="/map-your-stack"');
  });
  it('shows no visible placeholder badge', () => {
    expect(wwd.toLowerCase()).not.toContain('placeholder');
    expect(wwd).not.toContain('TODO(content)');
  });
});

(wwh ? describe : describe.skip)('built Who We Help page (dist/who-we-help/index.html)', () => {
  it('has one <h1> with the exact heading', () => {
    expect((wwh.match(/<h1/g) || []).length).toBe(1);
    expect(wwh).toContain('we handle the digital side.');
  });
  it('renders all four audience sections with stable deep-link ids', () => {
    for (const id of ['ecommerce', 'creators', 'startups', 'teams']) {
      expect(wwh).toContain(`id="${id}"`);
    }
  });
  it('keeps the unifying promise and capability chips', () => {
    expect(wwh).toContain('Either way the promise is the same');
    expect(wwh).toContain('Systems that matter most');
  });
  it('CTA links resolve to the existing journeys', () => {
    expect(wwh).toContain('href="/book-a-call"');
    expect(wwh).toContain('href="/map-your-stack"');
  });
});

(mys ? describe : describe.skip)('skip link is hidden until focused (Task 0 Fix 1)', () => {
  it('renders one skip link targeting #main on every page', () => {
    for (const page of [html, book, mys, wwd, wwh].filter(Boolean)) {
      expect(page).toMatch(/class="skip"[^>]*href="#main"/);
    }
  });
  it('the shared component clips it until focus (no fragile translate / undefined token)', () => {
    const src = readFileSync(resolve(root, 'src/components/layout/SkipLink.astro'), 'utf8');
    // hidden-until-focus: clipped by default, restored on :focus/:focus-visible
    expect(src).toMatch(/clip-path:\s*inset\(50%\)/);
    expect(src).toMatch(/\.skip:focus/);
    // no fragile off-screen translate, no reference to the undefined --dur-1 token
    expect(src).not.toContain('translateY(-160%)');
    expect(src).not.toContain('var(--dur-1)');
  });
});

describe('brand + config assets exist', () => {
  it('favicon and OG image are present', () => {
    expect(existsSync(resolve(root, 'public/favicon.svg'))).toBe(true);
    expect(existsSync(resolve(root, 'public/og/infinite-weblinks-default.svg'))).toBe(true);
  });
  it('the infinity mark supports gradient, dark, and white variants', () => {
    const mark = readFileSync(resolve(root, 'src/components/brand/InfinityMark.astro'), 'utf8');
    for (const v of ['gradient', 'dark', 'white']) expect(mark).toContain(`'${v}'`);
  });
  it('documents the single production config value', () => {
    const env = readFileSync(resolve(root, '.env.example'), 'utf8');
    expect(env).toContain('PUBLIC_BOOKING_ENDPOINT');
  });
});
