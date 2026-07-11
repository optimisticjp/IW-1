import { describe, it, expect } from 'vitest';
import { validateBooking, submitBooking, isEmail, isUrl, type BookingValues } from '../../src/lib/booking';

const valid: BookingValues = {
  name: 'Sam Lee', email: 'sam@brand.com', company: 'Brand Co',
  url: 'brand.com', help: 'Build a website, store, or app',
  details: 'We want a connected store.', timing: '', privacy: true,
};

describe('booking validation', () => {
  it('accepts a complete, valid submission', () => {
    expect(validateBooking(valid)).toEqual({});
  });
  it('requires name, email, company, help, details, privacy', () => {
    const e = validateBooking({});
    for (const f of ['name', 'email', 'company', 'help', 'details', 'privacy']) {
      expect(e[f]).toBeTruthy();
    }
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
  it('uses the dev-safe mock when no endpoint is configured', async () => {
    const r = await submitBooking(valid, { endpoint: '' });
    expect(r.ok).toBe(true);
    expect(r.mock).toBe(true);
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
});
