import { describe, it, expect } from 'vitest';
import { buildSeo } from '../../src/lib/seo';
import { organizationSchema, webSiteSchema, jsonLd } from '../../src/lib/schema';

const SITE = 'https://www.infiniteweblinks.example';

describe('buildSeo', () => {
  it('produces a complete, resolved metadata object', () => {
    const meta = buildSeo(
      { title: 'Meta Ads', description: 'Profitable demand from Meta.', path: '/services/meta-ads' },
      SITE
    );
    expect(meta.title).toContain('Infinite Weblinks');
    expect(meta.description.length).toBeGreaterThan(0);
    expect(meta.canonical).toBe('https://www.infiniteweblinks.example/services/meta-ads');
    expect(meta.ogImage.startsWith('https://')).toBe(true);
    expect(meta.robots).toBe('index,follow');
    expect(meta.ogType).toBe('website');
  });

  it('does not double-append the brand suffix when already present', () => {
    const meta = buildSeo({ title: 'Infinite Weblinks — Home', description: 'x' }, SITE);
    expect(meta.title).toBe('Infinite Weblinks — Home');
  });

  it('honours robots overrides', () => {
    const meta = buildSeo({ title: 'x', description: 'y', robots: 'noindex,follow' }, SITE);
    expect(meta.robots).toBe('noindex,follow');
  });
});

describe('structured data', () => {
  it('emits a valid Organization schema shape', () => {
    const org = organizationSchema(SITE) as Record<string, unknown>;
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('Infinite Weblinks');
    expect(String(org.url)).toContain(SITE);
  });

  it('serialises one or many schemas to valid JSON', () => {
    const out = jsonLd(organizationSchema(SITE), webSiteSchema(SITE));
    const parsed = JSON.parse(out);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
  });
});
