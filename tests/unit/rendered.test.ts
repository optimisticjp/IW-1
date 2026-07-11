import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Integration checks against the built homepage. Run `npm run build` first;
// these skip gracefully if dist is absent.
const dist = resolve(__dirname, '../../dist/index.html');
const html = existsSync(dist) ? readFileSync(dist, 'utf8') : '';
const run = html ? describe : describe.skip;

run('built homepage (dist/index.html)', () => {
  it('has exactly one <h1>', () => {
    expect((html.match(/<h1/g) || []).length).toBe(1);
  });

  it('renders sections in the brief order', () => {
    const order = ['id="top"', 'id="three-doors"', 'id="growth-graph"', 'id="capabilities"', 'id="proof"', 'id="book"'];
    const positions = order.map((id) => html.indexOf(id));
    expect(positions.every((p) => p >= 0)).toBe(true);
    const sorted = [...positions].sort((a, b) => a - b);
    expect(positions).toEqual(sorted);
  });

  it('contains the exact hero copy', () => {
    expect(html).toContain('You focus on your work.');
    expect(html).toContain('We handle the digital side.');
    expect(html).toContain('Built for solo experts and in-house teams alike.');
  });

  it('contains the exact CTA labels and none of the retired wording', () => {
    expect(html).toContain('Book a free call');
    expect(html).toContain('See how it connects');
    expect(html).toContain('See what we do');
    expect(html.toLowerCase()).not.toContain('request a proposal');
  });

  it('renders the Growth Graph: four goal tabs + a live caption region', () => {
    expect((html.match(/class="ggtab"/g) || []).length).toBe(4);
    expect(html).toContain('aria-pressed');
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
  });

  it('shows no public placeholder labels', () => {
    // strip the JSON data island, then assert none of the dev-only markers leak
    const visible = html.replace(/<script[^>]*class="gg-data"[\s\S]*?<\/script>/g, '');
    expect(visible.toLowerCase()).not.toContain('placeholder');
    expect(visible).not.toContain('assetStatus');
    expect(visible).not.toContain('TODO(content)');
  });
});
