import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const distHome = resolve(root, 'dist/index.html');
const distBook = resolve(root, 'dist/book-a-call/index.html');
const html = existsSync(distHome) ? readFileSync(distHome, 'utf8') : '';
const book = existsSync(distBook) ? readFileSync(distBook, 'utf8') : '';
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
