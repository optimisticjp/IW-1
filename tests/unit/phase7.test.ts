import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { capabilities } from '../../src/data/capabilities';
import { audiences } from '../../src/data/audiences';
import { CAPABILITY_IDS, AUDIENCE_IDS } from '../../src/data/ids';
import { webPageSchema, breadcrumbSchema, articleSchema, faqPageSchema } from '../../src/lib/schema';

const root = resolve(__dirname, '../..');
const read = (p: string) => (existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), 'utf8') : '');
const dist = (p: string) => read(`dist/${p}`);

/** Split YAML frontmatter + markdown body from a content file. */
function frontmatter(raw: string): { data: any; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  return { data: parseYaml(m[1]) ?? {}, body: m[2] ?? '' };
}

function loadDir(rel: string) {
  const dir = resolve(root, rel);
  if (!existsSync(dir)) return [] as { slug: string; data: any; body: string; raw: string }[];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(resolve(dir, f), 'utf8');
      return { slug: f.replace(/\.(md|mdx)$/, ''), raw, ...frontmatter(raw) };
    });
}

const workEntries = loadDir('src/content/work');
const insightEntries = loadDir('src/content/insights');

// A figure that would imply an invented, unbaselined result. Percentages,
// multipliers (3x), currency amounts, and "N% more/increase" style claims.
const INVENTED_FIGURE = /(\$\s?\d|£\s?\d|€\s?\d|\d+\s?%|\bx\d+\b|\b\d+x\b|\b\d+(?:\.\d+)?\s?(?:percent|roas|roi)\b)/i;
const TESTIMONIAL_MARKERS = ['5 stars', 'five stars', 'award-winning', 'world-class', 'best in class', 'trusted by thousands'];

describe('Phase 7 — Work content collection shape', () => {
  it('has at least one entry, all with the six-part narrative and a valid permission state', () => {
    expect(workEntries.length).toBeGreaterThan(0);
    const parts = ['situation', 'obstacle', 'customerExperience', 'change', 'improvement', 'lesson'];
    for (const e of workEntries) {
      expect(typeof e.data.title).toBe('string');
      for (const p of parts) expect(typeof e.data[p], `${e.slug}.${p}`).toBe('string');
      expect(['named', 'anonymized', 'interim']).toContain(e.data.permissionState);
      expect(Array.isArray(e.data.capabilityTags) && e.data.capabilityTags.length).toBeTruthy();
      for (const t of e.data.capabilityTags) expect(CAPABILITY_IDS).toContain(t);
      for (const t of e.data.audienceTags) expect(AUDIENCE_IDS).toContain(t);
    }
  });

  it('carries no invented figures, testimonials or borrowed logos in any field', () => {
    for (const e of workEntries) {
      const blob = `${JSON.stringify(e.data)} ${e.body}`;
      expect(INVENTED_FIGURE.test(blob), `${e.slug} contains a figure-like claim`).toBe(false);
      for (const m of TESTIMONIAL_MARKERS) expect(blob.toLowerCase()).not.toContain(m);
      expect(blob).not.toContain('—'); // no em dash in customer-facing copy
    }
  });
});

describe('Phase 7 — Insights content collection shape', () => {
  it('has entries with sources, a review date, valid tags and exactly two related articles', () => {
    expect(insightEntries.length).toBeGreaterThan(0);
    const slugs = new Set(insightEntries.map((e) => e.slug));
    for (const e of insightEntries) {
      expect(typeof e.data.questionTitle).toBe('string');
      expect(typeof e.data.h1).toBe('string');
      expect(typeof e.data.standfirst).toBe('string');
      expect(Array.isArray(e.data.keyPoints) && e.data.keyPoints.length).toBeTruthy();
      expect(Array.isArray(e.data.pitfalls) && e.data.pitfalls.length).toBeTruthy();
      expect(typeof e.data.selfCheck).toBe('string');
      // sources: at least one, each a real absolute URL
      expect(Array.isArray(e.data.sources) && e.data.sources.length).toBeGreaterThanOrEqual(1);
      for (const s of e.data.sources) expect(() => new URL(s.url)).not.toThrow();
      // review date parseable
      expect(Number.isNaN(new Date(e.data.lastReviewed).getTime())).toBe(false);
      expect(CAPABILITY_IDS).toContain(e.data.capabilityTag);
      expect(AUDIENCE_IDS).toContain(e.data.audienceTag);
      // cluster link rule: exactly two related articles that resolve and are not self
      expect(e.data.relatedArticleSlugs).toHaveLength(2);
      for (const rel of e.data.relatedArticleSlugs) {
        expect(slugs.has(rel), `${e.slug} → missing related ${rel}`).toBe(true);
        expect(rel).not.toBe(e.slug);
      }
    }
  });

  it('uses plain, non-fear, figure-free language', () => {
    for (const e of insightEntries) {
      const blob = `${JSON.stringify(e.data)} ${e.body}`;
      expect(INVENTED_FIGURE.test(blob), `${e.slug} contains a figure-like claim`).toBe(false);
      expect(blob).not.toContain('—');
    }
  });
});

describe('Phase 7 — structured-data builders', () => {
  const site = new URL('https://www.infiniteweblinks.example');
  it('Article schema carries a headline, url and review date, no ratings', () => {
    const a = articleSchema({ headline: 'H', description: 'D', canonical: 'https://x/y', dateModified: '2026-07-01' });
    expect(a['@type']).toBe('Article');
    expect(a.dateModified).toBe('2026-07-01');
    expect(JSON.stringify(a)).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  });
  it('FAQPage schema only reflects the supplied visible Q&A pairs', () => {
    const f = faqPageSchema([{ question: 'Q1', answer: 'A1' }]);
    expect(f['@type']).toBe('FAQPage');
    expect(f.mainEntity).toHaveLength(1);
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('A1');
  });
  it('WebPage + Breadcrumb builders resolve against the site origin', () => {
    const wp = webPageSchema('T', 'https://x/y', 'D');
    expect(wp['@type']).toBe('WebPage');
    const bc = breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Work' }], site);
    expect(bc.itemListElement).toHaveLength(2);
    // current page (no href) carries no item URL
    expect((bc.itemListElement[1] as any).item).toBeUndefined();
  });
});

// Built-output assertions (skip gracefully if the site has not been built).
const workIndex = dist('work/index.html');
const insightsIndex = dist('insights/index.html');

(workIndex ? describe : describe.skip)('Phase 7 — Work index built output', () => {
  it('has one h1, an honest empty state and an honest interim state', () => {
    expect((workIndex.match(/<h1/g) || []).length).toBe(1);
    expect(workIndex).toContain('id="wk-empty"');
    expect(workIndex.toLowerCase()).toContain('anonymized');
    expect(workIndex).toMatch(/<link rel="canonical" href="[^"]*\/work"/);
  });
  it('renders capability and audience filters and no invented figure', () => {
    expect(workIndex).toContain('data-filter="cap"');
    expect(workIndex).toContain('data-filter="aud"');
    // strip script + style blocks (CSS carries % widths) before the honesty
    // scan of visible copy
    const visible = workIndex
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    expect(INVENTED_FIGURE.test(visible)).toBe(false);
  });
});

(insightsIndex ? describe : describe.skip)('Phase 7 — Insights index built output', () => {
  it('has one h1, canonicalises to the base index and offers topic categories', () => {
    expect((insightsIndex.match(/<h1/g) || []).length).toBe(1);
    expect(insightsIndex).toMatch(/<link rel="canonical" href="[^"]*\/insights"/);
    expect(insightsIndex).toContain('Filter by topic');
    // filtered views are client-side only — no separate thin category routes
    expect(existsSync(resolve(root, 'dist/insights/category'))).toBe(false);
  });
});

// A representative case study + article carry the right structured data.
const caseStudy = workEntries[0] ? dist(`work/${workEntries[0].slug}/index.html`) : '';
const article = insightEntries[0] ? dist(`insights/${insightEntries[0].slug}/index.html`) : '';

(caseStudy ? describe : describe.skip)('Phase 7 — case study built output', () => {
  it('renders the six-part structure with WebPage + BreadcrumbList schema', () => {
    expect((caseStudy.match(/<h1/g) || []).length).toBe(1);
    for (const label of ['The situation', 'The obstacle', 'What we changed', 'What improved', 'The useful lesson']) {
      expect(caseStudy).toContain(label);
    }
    expect(caseStudy).toContain('"@type":"WebPage"');
    expect(caseStudy).toContain('"@type":"BreadcrumbList"');
  });
});

(article ? describe : describe.skip)('Phase 7 — article built output', () => {
  it('carries Article schema, sources, a review date and cluster links', () => {
    expect((article.match(/<h1/g) || []).length).toBe(1);
    expect(article).toContain('"@type":"Article"');
    expect(article).toContain('Sources');
    expect(article).toContain('Last reviewed');
    expect(article).toContain('Keep reading');
  });
});

const faqHtml = dist('faq/index.html');
(faqHtml ? describe : describe.skip)('Phase 7 — FAQ hub built output', () => {
  it('has one h1, single-open accordions and FAQPage schema', () => {
    expect((faqHtml.match(/<h1/g) || []).length).toBe(1);
    // native single-open: every <details> shares one name
    expect(faqHtml).toContain('name="faq-hub"');
    expect(faqHtml).toContain('"@type":"FAQPage"');
  });
});

for (const legal of ['privacy', 'cookies', 'terms']) {
  const html = dist(`${legal}/index.html`);
  (html ? describe : describe.skip)(`Phase 7 — ${legal} shell built output`, () => {
    it('renders one h1, canonical metadata and the approved last-updated date when dist is current', () => {
      if (!html.includes('Last updated: 13 July 2026')) return;
      expect((html.match(/<h1/g) || []).length).toBe(1);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/${legal}`));
    });

    it('does not show draft or pending legal-approval wording when dist is current', () => {
      if (!html.includes('Last updated: 13 July 2026')) return;
      expect(html).not.toContain('Draft for review');
      expect(html.toLowerCase()).not.toContain('still to be confirmed');
      expect(html.toLowerCase()).not.toContain('final legal wording');
      expect(html.toLowerCase()).not.toContain('jurisdiction-specific wording is prepared');
    });
  });
}



describe('Phase 7 — approved legal page source', () => {
  for (const legal of ['privacy', 'cookies', 'terms']) {
    it(`${legal} uses the approved publication date and no draft-status prop`, () => {
      const astro = read(`src/pages/${legal}.astro`);
      expect(astro).toContain('lastUpdated="13 July 2026"');
      expect(astro).not.toContain('reviewStatus=');
      expect(astro).not.toContain('Draft for review');
      expect(astro.toLowerCase()).not.toContain('still to be confirmed');
      expect(astro.toLowerCase()).not.toContain('final legal wording');
      expect(astro.toLowerCase()).not.toContain('jurisdiction-specific wording is prepared');
    });
  }
});

const privacyHtml = dist('privacy/index.html');
(privacyHtml ? describe : describe.skip)('Phase 7 — Privacy discloses the enquiry data flow', () => {
  it('states no server-side storage, email delivery and retention', () => {
    const t = privacyHtml.toLowerCase();
    expect(t).toContain('do not store your enquiry');
    expect(t).toContain('email');
    expect(t).toContain('retained');
  });
});

const aboutHtml = dist('about/index.html');
(aboutHtml ? describe : describe.skip)('Phase 7 — About built output', () => {
  it('has one h1, the two-audience story, a five-step process and owner profile handling', () => {
    expect((aboutHtml.match(/<h1/g) || []).length).toBe(1);
    expect(aboutHtml).toContain('For entrepreneurs and experts');
    expect(aboutHtml).toContain('For growing and established teams');
    expect(aboutHtml).not.toContain('Owner to supply');
    expect(aboutHtml).not.toContain('Photo to supply');
    // no invented awards / superlatives
    for (const m of TESTIMONIAL_MARKERS) expect(aboutHtml.toLowerCase()).not.toContain(m);
    // no em dash in visible copy (FR-036)
    const visible = aboutHtml
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    expect(visible).not.toContain('—');
  });
});
