// Editorial content collections (spec 002, FR-031/032, contracts/content-
// schemas.md). Structured system content lives in src/data; long-form editorial
// (Work case studies, Insights articles) lives here with Zod-validated
// frontmatter. Collections are empty until owner-permissioned content arrives;
// the schemas reject malformed entries and never invent proof.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const capabilityEnum = z.enum(['build', 'attract', 'convert', 'retain', 'connect', 'scale']);
const audienceEnum = z.enum([
  'ecommerce-brands',
  'creators-and-experts',
  'startups-and-new-brands',
  'growing-teams',
  'established-teams',
  'agency-partners',
]);

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    capabilityTags: z.array(capabilityEnum),
    audienceTags: z.array(audienceEnum),
    situation: z.string(),
    obstacle: z.string(),
    customerExperience: z.string(),
    change: z.string(),
    // Honest outcome: quantitative only with a defensible baseline+period+source.
    improvement: z.string(),
    lesson: z.string(),
    scopedGraph: z.string().optional(),
    permissionState: z.enum(['named', 'anonymized', 'interim']),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    questionTitle: z.string(),
    h1: z.string(),
    standfirst: z.string(),
    keyPoints: z.array(z.string()),
    pitfalls: z.array(z.string()),
    selfCheck: z.string(),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
    lastReviewed: z.coerce.date(),
    capabilityTag: capabilityEnum,
    audienceTag: audienceEnum,
    relatedArticleSlugs: z.array(z.string()).length(2),
  }),
});

export const collections = { work, insights };
