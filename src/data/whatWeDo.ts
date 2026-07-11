// /what-we-do content — copy is VERBATIM from the Phase 2 Pages Spec (Page A).
// Do not edit these words. Punctuation already avoids em dashes per the spec.
// Deliverable lists are intentionally kept in full; outcomes are surfaced more
// prominently than tool names in the page layout.

export interface WwdSystem {
  id: string;
  name: string;
  accent: string; // capability accent key
  problem: string;
  whatWeDo: string;
  whatYouGet: string;
  connectsWith: string;
  result: string;
}

export const whatWeDo = {
  seo: {
    title: 'What We Do',
    description:
      'Infinite Weblinks builds, runs, and connects six digital growth systems, Build, Attract, Convert, Connect, Retain, and Scale, so every part of your online presence works as one.',
    path: '/what-we-do',
  },

  hero: {
    eyebrow: 'What we do',
    h1: 'One partner. Six connected systems.',
    sub: "Everything your business needs online, built and run for you, and wired together so each part makes the others work harder. You don't have to manage a dozen tools or hire five specialists. That's our job.",
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Map your stack', href: '/map-your-stack' },
  },

  glance: {
    eyebrow: 'Six systems',
    h2: 'Six systems, built to work as one.',
    sub: 'Each one does a real job. Wired together, each makes the others work harder. Pick any system to see how it fits, and what it connects to.',
    items: [
      { key: 'build', name: 'Build', accent: 'indigo', line: 'Sites, stores, and apps built to sell, not just to look good.', href: '#build' },
      { key: 'attract', name: 'Attract', accent: 'coral', line: 'Ads, search, and social that bring the right people to you.', href: '#attract' },
      { key: 'convert', name: 'Convert', accent: 'magenta', line: 'Landing pages and CRO that turn clicks into orders.', href: '#convert' },
      { key: 'connect', name: 'Connect', accent: 'violet', line: 'Tracking and tools wired to share data across everything.', href: '#connect' },
      { key: 'retain', name: 'Retain', accent: 'green', line: 'Email, SMS, and loyalty that bring customers back for more.', href: '#retain' },
      { key: 'scale', name: 'Scale', accent: 'amber', line: 'AI and automation that grow it all without adding headcount.', href: '#scale' },
    ],
  },

  systems: [
    {
      id: 'build',
      name: 'Build',
      accent: 'indigo',
      problem: "A slow or clunky site quietly loses sales, and a good-looking site that isn't built to sell is just decoration.",
      whatWeDo: 'We design and build the foundation, sites, stores, landing pages, and apps, made to convert and to plug into everything else from day one.',
      whatYouGet: 'Website design and development, Shopify and Shopify Plus, WooCommerce, landing pages, web apps, mobile apps, UI/UX, redesigns and migrations, branding.',
      connectsWith: 'Attract, a fast site makes your ads convert. Convert, built for testing. Connect, tracking baked in, not bolted on later.',
      result: 'A foundation that turns more visitors into customers and hands every other system clean data.',
    },
    {
      id: 'attract',
      name: 'Attract',
      accent: 'coral',
      problem: 'Spending on ads and content without knowing what actually brings buyers just burns money.',
      whatWeDo: 'We bring the right people to you across paid, search, and social, with the creative to feed it, all wired to your tracking so you can see what works.',
      whatYouGet: 'Google, Meta, TikTok, YouTube, and Amazon ads, programmatic, ad creative, technical, on-page, local, and ecommerce SEO, link building, content, social management, short-form video, UGC, creator marketing, and AI search visibility.',
      connectsWith: 'Connect, tracking lets the channels learn. Convert, traffic lands on pages built to sell. Retain, new customers enter your follow-up.',
      result: 'More of the right traffic at a lower cost, because the channels learn from real results.',
    },
    {
      id: 'convert',
      name: 'Convert',
      accent: 'magenta',
      problem: "Traffic that doesn't convert is wasted attention, and most sites leak visitors at steps nobody's measuring.",
      whatWeDo: 'We turn clicks into orders with pages, funnels, and testing built around how people actually buy.',
      whatYouGet: 'CRO, funnels including lead generation, sales, webinar and VSL, tripwire, and course launch, ClickFunnels, Kajabi, and GoHighLevel builds, lead magnets, funnel copywriting, and course and membership setup.',
      connectsWith: 'Build, it sits on your foundation. Attract, it is fed by your traffic. Connect, data shows where people drop off.',
      result: 'More of your existing traffic turns into revenue, without paying more to get it.',
    },
    {
      id: 'connect',
      name: 'Connect',
      accent: 'violet',
      problem: 'Your ads, analytics, store, and email each report different numbers, and none of them share what they know.',
      whatWeDo: 'We wire your tools together so data moves between them and you can finally trust one clear picture.',
      whatYouGet: 'Reliable tracking that still counts sales when browsers block the usual method, including GA4, Google Tag Manager, server-side tracking, pixels, and Conversions API. Every customer in one record through CRM setup and integration. One dashboard you can actually trust.',
      connectsWith: 'Everything. This is the layer that makes the other five smarter, so ads optimize, email personalizes, and decisions get real.',
      result: "You know what's working, your platforms learn from real data, and nothing falls through the gaps.",
    },
    {
      id: 'retain',
      name: 'Retain',
      accent: 'green',
      problem: 'Getting a customer once is expensive, and letting them leave after one purchase throws that money away.',
      whatWeDo: 'We keep customers buying with messages that know what they browsed and bought.',
      whatYouGet: 'Email, SMS, and WhatsApp marketing, lifecycle and retention strategy, newsletters, loyalty, and referral or affiliate programs.',
      connectsWith: 'Connect, it knows each customer’s behaviour. Build, purchase data comes from your store. Retain also feeds Attract because repeat buyers sharpen your ad targeting.',
      result: 'A higher repeat purchase rate and more revenue from customers you already paid to win.',
    },
    {
      id: 'scale',
      name: 'Scale',
      accent: 'amber',
      problem: 'Growth usually means hiring more people, and manual work caps how far you can go.',
      whatWeDo: 'We use AI and automation on your connected data to do more without adding headcount.',
      whatYouGet: 'AI chatbots and customer automation, AI-powered marketing funnels, A/B testing and experimentation, growth strategy consulting, Amazon marketplace management, and white-label support for other agencies.',
      connectsWith: 'Everything above. AI only helps because Connect made your data usable in the first place.',
      result: 'The system does more of the work, and growth compounds instead of stalling.',
    },
  ] as WwdSystem[],

  engagement: {
    eyebrow: 'How it comes together',
    h2: 'What a connected engagement looks like.',
    flow: [
      { name: 'Build', accent: 'indigo' },
      { name: 'Connect', accent: 'violet' },
      { name: 'Attract', accent: 'coral' },
      { name: 'Retain', accent: 'green' },
    ],
    body: "Here's what a connected engagement looks like. A brand comes to us for a new store, that's Build. While we're there, we set up reliable tracking and one dashboard, that's Connect, so from day one they can see where sales come from. We rebuild their ad targeting on that real sales data, that's Attract, and add email flows that know what each customer bought, that's Retain. Instead of four disconnected projects, it's one system where each part feeds the next. That's the difference between hiring an agency and building a growth engine.",
  },

  process: {
    eyebrow: 'The process',
    h2: 'How projects work.',
    steps: [
      { n: '01', name: 'Understand', body: 'We learn your business, your goals, and what you already use.' },
      { n: '02', name: 'Map', body: 'We map how your tools connect today and where growth leaks.' },
      { n: '03', name: 'Build', body: "We build what's missing and improve what's already there." },
      { n: '04', name: 'Connect', body: 'We wire it all together so your data flows.' },
      { n: '05', name: 'Grow', body: 'We run it, test it, and keep improving so it compounds.' },
    ],
  },

  cta: {
    h2: 'Not sure where to start?',
    body: 'Map your stack in 30 seconds, or book a free call.',
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Map your stack', href: '/map-your-stack' },
  },
} as const;
