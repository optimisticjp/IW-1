import { describe, it, expect } from 'vitest';
import { whatWeDo } from '../../src/data/whatWeDo';
import { whoWeHelp } from '../../src/data/whoWeHelp';

const noEmDash = (obj: unknown) => expect(JSON.stringify(obj)).not.toContain('—');
const BUZZWORDS = ['leverage', 'unlock', 'seamless', 'empower', 'holistic', 'elevate', 'robust', 'synergy'];

describe('What We Do content (Phase 2, verbatim)', () => {
  it('has route-specific SEO', () => {
    expect(whatWeDo.seo.title).toBe('What We Do');
    expect(whatWeDo.seo.path).toBe('/what-we-do');
    expect(whatWeDo.seo.description.toLowerCase()).toContain('connect');
  });

  it('hero copy is exact', () => {
    expect(whatWeDo.hero.h1).toBe('One partner. Six connected systems.');
    expect(whatWeDo.hero.sub).toBe(
      "Everything your business needs online, built and run for you, and wired together so each part makes the others work harder. You don't have to manage a dozen tools or hire five specialists. That's our job."
    );
    expect(whatWeDo.hero.primary.href).toBe('/book-a-call');
    expect(whatWeDo.hero.secondary.href).toBe('/map-your-stack');
  });

  it('the six systems have stable ids, accents, and glance links that match', () => {
    const ids = whatWeDo.systems.map((s) => s.id);
    expect(ids).toEqual(['build', 'attract', 'convert', 'connect', 'retain', 'scale']);
    expect(whatWeDo.systems.map((s) => s.accent)).toEqual(['indigo', 'coral', 'magenta', 'violet', 'green', 'amber']);
    // every glance item links to a real system id
    for (const g of whatWeDo.glance.items) {
      expect(g.href).toBe(`#${g.key}`);
      expect(ids).toContain(g.key);
    }
    expect(whatWeDo.glance.items).toHaveLength(6);
  });

  it('every system carries all five copy parts', () => {
    for (const s of whatWeDo.systems) {
      for (const key of ['problem', 'whatWeDo', 'whatYouGet', 'connectsWith', 'result'] as const) {
        expect(s[key].length).toBeGreaterThan(10);
      }
    }
  });

  it('keeps key verbatim copy and full deliverable lists', () => {
    const connect = whatWeDo.systems.find((s) => s.id === 'connect')!;
    expect(connect.whatYouGet).toContain('GA4');
    expect(connect.whatYouGet).toContain('Conversions API');
    expect(connect.result).toBe("You know what's working, your platforms learn from real data, and nothing falls through the gaps.");
    const build = whatWeDo.systems.find((s) => s.id === 'build')!;
    expect(build.result).toBe('A foundation that turns more visitors into customers and hands every other system clean data.');
    const scale = whatWeDo.systems.find((s) => s.id === 'scale')!;
    expect(scale.whatYouGet).toContain('white-label support for other agencies');
  });

  it('project steps are in the correct order', () => {
    expect(whatWeDo.process.steps.map((s) => s.name)).toEqual(['Understand', 'Map', 'Build', 'Connect', 'Grow']);
  });

  it('the connected engagement story is present and shows Build → Connect → Attract → Retain', () => {
    expect(whatWeDo.engagement.flow.map((f) => f.name)).toEqual(['Build', 'Connect', 'Attract', 'Retain']);
    expect(whatWeDo.engagement.body).toContain("Here's what a connected engagement looks like.");
    expect(whatWeDo.engagement.body).toContain('building a growth engine.');
  });

  it('CTA links are correct', () => {
    expect(whatWeDo.cta.primary.href).toBe('/book-a-call');
    expect(whatWeDo.cta.secondary.href).toBe('/map-your-stack');
  });

  it('contains no em dashes or buzzwords', () => {
    noEmDash(whatWeDo);
    const blob = JSON.stringify(whatWeDo).toLowerCase();
    for (const b of BUZZWORDS) expect(blob).not.toMatch(new RegExp(`\\b${b}\\b`));
  });
});

describe('Who We Help content (Phase 2, verbatim)', () => {
  it('has route-specific SEO mentioning the audiences', () => {
    expect(whoWeHelp.seo.title).toBe('Who We Help');
    expect(whoWeHelp.seo.path).toBe('/who-we-help');
    const desc = whoWeHelp.seo.description.toLowerCase();
    for (const who of ['solo', 'ecommerce', 'startup', 'established']) expect(desc).toContain(who);
  });

  it('hero copy is exact', () => {
    expect(whoWeHelp.hero.h1).toBe("Wherever you're starting from, we handle the digital side.");
    expect(whoWeHelp.hero.sub).toBe(
      "Whether you're a solo expert who wants the tech taken off your plate, or a team that needs its tools finally connected, we meet you where you are and build from there."
    );
  });

  it('has four audience sections with stable ids and full copy', () => {
    expect(whoWeHelp.audiences.map((a) => a.id)).toEqual(['ecommerce', 'creators', 'startups', 'teams']);
    for (const a of whoWeHelp.audiences) {
      expect(a.pain.length).toBeGreaterThan(10);
      expect(a.whatWeDo.length).toBeGreaterThan(10);
      expect(a.closingLine.length).toBeGreaterThan(5);
      expect(a.systems.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('capability chips use real system names, and teams notes the extra support', () => {
    const valid = new Set(['Build', 'Attract', 'Convert', 'Connect', 'Retain', 'Scale']);
    for (const a of whoWeHelp.audiences) for (const s of a.systems) expect(valid.has(s)).toBe(true);
    expect(whoWeHelp.audiences.find((a) => a.id === 'ecommerce')!.systems).toEqual(['Connect', 'Attract', 'Convert', 'Retain']);
    expect(whoWeHelp.audiences.find((a) => a.id === 'teams')!.systemsNote).toBeTruthy();
  });

  it('audience CTAs use only the two allowed actions', () => {
    for (const a of whoWeHelp.audiences) {
      expect(['Book a free call', 'Map your stack']).toContain(a.cta.label);
      expect(['/book-a-call', '/map-your-stack']).toContain(a.cta.href);
    }
  });

  it('the unifying promise copy is exact', () => {
    expect(whoWeHelp.promise.body).toBe(
      'Some of our clients never want to touch the technical side, so we handle all of it. Others have sharp in-house teams and just need someone to connect the pieces and clear the bottlenecks. Either way the promise is the same: you focus on your work, and every part of your digital growth works together.'
    );
  });

  it('CTA links are correct', () => {
    expect(whoWeHelp.cta.primary.href).toBe('/book-a-call');
    expect(whoWeHelp.cta.secondary.href).toBe('/map-your-stack');
  });

  it('contains no em dashes or buzzwords', () => {
    noEmDash(whoWeHelp);
    const blob = JSON.stringify(whoWeHelp).toLowerCase();
    for (const b of BUZZWORDS) expect(blob).not.toMatch(new RegExp(`\\b${b}\\b`));
  });
});
