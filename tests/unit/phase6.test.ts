import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const dist = (p: string) => (existsSync(resolve(root, `dist/${p}`)) ? readFileSync(resolve(root, `dist/${p}`), 'utf8') : '');
const hic = dist('how-it-connects/index.html');
const contact = dist('contact/index.html');
const book = dist('book-a-call/index.html');
const mys = dist('map-your-stack/index.html');
const nf = dist('404.html');
const sitemap = dist('sitemap-0.xml');

const built = Boolean(hic && contact && book && mys && nf);

(built ? describe : describe.skip)('Phase 6 rendered pages', () => {
  it('How It Connects is the full educational hub (five links, anatomy, self-check, review)', () => {
    expect(hic).toContain('The five connections every business should understand');
    expect(hic).toContain('Anatomy of a disconnected sale');
    expect(hic).toContain('self-check');
    expect(hic).toContain('Growth Graph Review');
    // diagnostic framing, not an instant revenue estimate / disguised sales call
    expect(hic).toContain('not a sales call');
    expect(hic).toContain('will not give you an instant revenue estimate');
    expect(hic.toLowerCase()).not.toContain('guaranteed');
  });

  it('How It Connects has exactly one H1 and reads without motion (content in the HTML)', () => {
    expect((hic.match(/<h1[\s>]/g) || []).length).toBe(1);
    expect(hic).toContain('Map your stack'); // self-check routes into the tool
  });

  it('/contact is a distinct general-enquiry page pointing consultations to /book-a-call', () => {
    expect((contact.match(/<h1[\s>]/g) || []).length).toBe(1);
    expect(contact).toContain('Send us a message');
    expect(contact).toContain('/book-a-call'); // routes project-starters to the consultation
    expect(contact).toContain('name="message"'); // lighter form: message field
    expect(contact).not.toContain('name="help"'); // no qualification fields
    expect(contact).toContain('"@type":"BreadcrumbList"');
  });

  it('consultation confirmation uses the three-outcomes copy with no response-time promise', () => {
    expect(book).toContain('Thank you. We have your enquiry.');
    expect(book).toContain('one of three things');
    expect(book).not.toMatch(/within (two|2|three|3|\d+) (business )?days/i);
    // no budget field anywhere on the consultation form
    expect(book).not.toMatch(/name="budget"/i);
    expect(book.toLowerCase()).not.toContain('budget');
  });

  it('the consultation form makes help and details optional (only required marks on core fields)', () => {
    // help and details no longer carry the `required` attribute
    expect(book).toMatch(/name="help"(?![^>]*required)/);
    expect(book).toMatch(/name="details"(?![^>]*required)/);
    // core required fields keep it
    expect(book).toMatch(/name="name"[^>]*required/);
    expect(book).toMatch(/name="privacy"[^>]*required/);
  });

  it('Map Your Stack keeps its honesty line and reveal gate, no invented figures', () => {
    expect(mys.toLowerCase()).toContain('not a technical audit');
    expect(mys.toLowerCase()).not.toContain('guaranteed');
  });

  it('404 is on-brand, noindex, links Home + consultation, and is excluded from the sitemap', () => {
    expect(nf).toMatch(/name="robots" content="noindex/);
    expect(nf).toContain('href="/"');
    expect(nf).toContain('/book-a-call');
    if (sitemap) expect(sitemap).not.toContain('/404');
  });
});
