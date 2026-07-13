import { describe, it, expect } from 'vitest';
import { validateBooking, submitBooking, isEmail, isUrl, validateContact, submitNewsletter, type BookingValues } from '../../src/lib/booking';

const valid: BookingValues = {
  name: 'Sam Lee', email: 'sam@brand.com', company: 'Brand Co',
  url: 'brand.com', help: 'Build a website, store, or app',
  details: 'We want a connected store.', timing: '', privacy: true,
};

describe('booking validation', () => {
  it('accepts a complete, valid submission', () => {
    expect(validateBooking(valid)).toEqual({});
  });
  it('requires only name, email, business (company) and privacy (FR-026)', () => {
    const e = validateBooking({});
    for (const f of ['name', 'email', 'company', 'privacy']) expect(e[f]).toBeTruthy();
    // help (closest-description) and details (goal) are optional, no gatekeeping
    expect(e.help).toBeUndefined();
    expect(e.details).toBeUndefined();
  });
  it('accepts a minimal submission with only the required fields', () => {
    expect(validateBooking({ name: 'Sam', email: 'sam@brand.com', company: 'Brand Co', privacy: true })).toEqual({});
  });
  it('collects no budget field anywhere in the values type', () => {
    expect(Object.keys(valid)).not.toContain('budget');
  });
  it('validates email format', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('nope')).toBe(false);
    expect(validateBooking({ ...valid, email: 'nope' }).email).toBeTruthy();
  });
  it('treats url as optional but validates it when present', () => {
    expect(validateBooking({ ...valid, url: '' }).url).toBeUndefined();
    expect(isUrl('brand.com')).toBe(true);
    expect(validateBooking({ ...valid, url: 'not a url !!' }).url).toBeTruthy();
  });
  it('requires the privacy acknowledgement', () => {
    expect(validateBooking({ ...valid, privacy: false }).privacy).toBeTruthy();
  });
});

describe('booking submission adapter', () => {
  it('uses the dev-safe mock only in development', async () => {
    const r = await submitBooking(valid, { endpoint: '', dev: true });
    expect(r.ok).toBe(true);
    expect(r.mock).toBe(true);
  });
  it('never fakes success in production with no endpoint (no silent lead drop)', async () => {
    const r = await submitBooking(valid, { endpoint: '', dev: false });
    expect(r.ok).toBe(false);
    expect(r.unconfigured).toBe(true);
    expect(r.mock).toBeUndefined();
  });
  it('silently drops a filled honeypot (spam)', async () => {
    const r = await submitBooking({ ...valid, _hp: 'bot' }, { endpoint: 'https://x' });
    expect(r.ok).toBe(true);
  });
  it('posts to a configured endpoint and reports server failure as retryable', async () => {
    const okFetch = (async () => ({ ok: true, status: 200 })) as unknown as typeof fetch;
    const failFetch = (async () => ({ ok: false, status: 500 })) as unknown as typeof fetch;
    expect((await submitBooking(valid, { endpoint: 'https://x', fetchImpl: okFetch })).ok).toBe(true);
    const r = await submitBooking(valid, { endpoint: 'https://x', fetchImpl: failFetch });
    expect(r.ok).toBe(false);
    expect(r.retryable).toBe(true);
  });
  it('treats a network throw as retryable', async () => {
    const throwFetch = (async () => { throw new Error('network'); }) as unknown as typeof fetch;
    const r = await submitBooking(valid, { endpoint: 'https://x', fetchImpl: throwFetch });
    expect(r.ok).toBe(false);
    expect(r.retryable).toBe(true);
  });

  it('contact validation requires name, email, message and privacy', () => {
    const e = validateContact({});
    for (const f of ['name', 'email', 'message', 'privacy']) expect(e[f]).toBeTruthy();
    expect(validateContact({ name: 'A', email: 'a@b.co', message: 'Hi', privacy: true })).toEqual({});
  });

  it('newsletter is never-false-success: unconfigured endpoint reports recoverable, not ok', async () => {
    const r = await submitNewsletter('a@b.co', { endpoint: '' });
    expect(r.ok).toBe(false);
    expect(r.unconfigured).toBe(true);
    const bad = await submitNewsletter('nope', { endpoint: 'https://x' });
    expect(bad.ok).toBe(false);
  });
  it('newsletter posts to a configured endpoint and reports success', async () => {
    const okFetch = (async () => ({ ok: true, status: 200 })) as unknown as typeof fetch;
    const r = await submitNewsletter('a@b.co', { endpoint: 'https://x', fetchImpl: okFetch });
    expect(r.ok).toBe(true);
  });

  it('posts the Formspree AJAX contract: POST + JSON, Accept: application/json, email for reply-to', async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const recordFetch = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return { ok: true, status: 200 };
    }) as unknown as typeof fetch;
    const endpoint = 'https://formspree.io/f/test-form-id';
    const r = await submitBooking(valid, { endpoint, fetchImpl: recordFetch });
    expect(r.ok).toBe(true);
    expect(seen?.url).toBe(endpoint);
    expect(seen?.init.method).toBe('POST');
    const headers = seen?.init.headers as Record<string, string>;
    expect(headers['Accept']).toBe('application/json');
    expect(headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(String(seen?.init.body));
    expect(body.email).toBe(valid.email); // Formspree uses the email field as reply-to
    for (const f of ['name', 'company', 'help', 'details']) expect(body[f]).toBeTruthy();
    expect(body.privacy).toBe(true);
  });
});
