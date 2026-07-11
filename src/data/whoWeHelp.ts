// /who-we-help content — copy is VERBATIM from the Phase 2 Pages Spec (Page B).
// Do not edit these words. No em dashes; punctuation follows the spec.

export interface WwhAudience {
  id: string;
  name: string;
  pain: string;
  whatWeDo: string;
  systems: string[]; // capability names shown as coloured chips
  systemsNote?: string; // extra context that isn't a single capability chip
  closingLine: string;
  cta: { label: string; href: string };
}

export const whoWeHelp = {
  seo: {
    title: 'Who We Help',
    description:
      'Infinite Weblinks works with solo experts, ecommerce brands, startups, and established teams, handling the digital side or connecting the tools you already have.',
    path: '/who-we-help',
  },

  hero: {
    eyebrow: 'Who we help',
    h1: "Wherever you're starting from, we handle the digital side.",
    sub: "Whether you're a solo expert who wants the tech taken off your plate, or a team that needs its tools finally connected, we meet you where you are and build from there.",
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Map your stack', href: '/map-your-stack' },
  },

  audiences: [
    {
      id: 'ecommerce',
      name: 'Ecommerce brands',
      pain: "Ad costs keep climbing, you can't tell which channels actually make money, one-time buyers don't come back, and your tools don't share what they know.",
      whatWeDo: 'We connect your store, ads, tracking, and email so every sale teaches the next one, then run the whole loop.',
      systems: ['Connect', 'Attract', 'Convert', 'Retain'],
      closingLine: 'From your Shopify or WooCommerce store to your ad platforms to your email, working as one.',
      cta: { label: 'Map your stack', href: '/map-your-stack' },
    },
    {
      id: 'creators',
      name: 'Creators and experts',
      pain: "You're brilliant at your craft, but you're losing time and energy to the technical side. You need to grow your audience and sell your work without becoming a full-time marketer.",
      whatWeDo: 'We handle the entire digital side, your site, funnels, email, content, and growth, so you stay on the work you love.',
      systems: ['Build', 'Attract', 'Convert', 'Retain'],
      closingLine: 'You focus on your work, we run everything behind it.',
      cta: { label: 'Book a free call', href: '/book-a-call' },
    },
    {
      id: 'startups',
      name: 'Startups',
      pain: "You need to get to market fast and prove what works, but you don't have a full marketing team and you can't afford to burn runway on channels that don't convert.",
      whatWeDo: "We build the foundation and the acquisition-to-retention system, with tracking from day one so you can see what's working and spend where it counts.",
      systems: ['Build', 'Attract', 'Connect', 'Scale'],
      closingLine: 'A complete growth system, without hiring one of every specialist.',
      cta: { label: 'Book a free call', href: '/book-a-call' },
    },
    {
      id: 'teams',
      name: 'Established teams',
      pain: "You have the tools and the people, but everything's siloed, your tracking's incomplete, and you can't scale further until the infrastructure is connected.",
      whatWeDo: 'We plug into your existing stack, find the gaps, connect your systems, remove bottlenecks, and help you scale, alongside your team, not replacing it.',
      systems: ['Connect', 'Scale'],
      systemsNote: 'plus specialist support across the rest',
      closingLine: 'We connect what you already have and help you grow faster.',
      cta: { label: 'Map your stack', href: '/map-your-stack' },
    },
  ] as WwhAudience[],

  promise: {
    eyebrow: 'One promise',
    h2: 'Two kinds of clients, one promise.',
    body: 'Some of our clients never want to touch the technical side, so we handle all of it. Others have sharp in-house teams and just need someone to connect the pieces and clear the bottlenecks. Either way the promise is the same: you focus on your work, and every part of your digital growth works together.',
  },

  cta: {
    h2: "Let's handle the digital side.",
    body: 'Book a free call, or map your stack in 30 seconds to see where to begin.',
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Map your stack', href: '/map-your-stack' },
  },
} as const;
