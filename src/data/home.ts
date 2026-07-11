// Homepage content — VERBATIM from the Master Website Brief §5. Do not edit
// these words. Placeholder proof assets are flagged and tracked privately;
// no public placeholder labels are rendered.

export const home = {
  placeholder: true,

  meta: {
    title: 'Infinite Weblinks — Connected growth agency',
    description:
      'You focus on your work. We handle the digital side. Website, ads, email, social, all of it, built, run, and connected so it works as one.',
  },

  // 5.1 Hero
  hero: {
    eyebrow: 'Connected growth agency',
    h1a: 'You focus on your work.',
    h1b: 'We handle the digital side.',
    sub: "Website, ads, email, social, all of it. We build it, run it, and connect every piece so it works as one. That's what actually grows a business, and it means you get to spend your time on what you're great at.",
    primary: { label: 'Book a free call', href: '#book' },
    secondary: { label: 'See how it connects', href: '#growth-graph' },
    trust: 'Built for solo experts and in-house teams alike.',
  },

  // 5.2 The idea
  idea: {
    eyebrow: 'The whole idea',
    h2: 'You don’t need more tools. You need them working as one.',
    body: 'Most businesses end up with a pile of separate tools. A website here, ads over there, emails somewhere else. When they don’t share information, you waste money, miss customers, and never really know what’s working. We connect what you have, build what you’re missing, and get it all pulling in the same direction.',
  },

  // 5.3 Three doors
  doors: {
    eyebrow: 'Wherever you’re starting from',
    h2: 'Three ways in. One connected system.',
    sub: 'Pick the one that sounds like you. The destination is the same: everything digital, working together.',
    items: [
      {
        key: 'launch',
        name: 'Launch',
        accent: 'indigo',
        body: 'New to all this? We become your full digital team and build your whole setup, then run it. You stay on the work you love.',
        tag: 'Solo experts & new brands',
      },
      {
        key: 'connect',
        name: 'Connect',
        accent: 'violet',
        body: 'Tools that don’t talk? We wire your site, ads, data, and email into one system that shares everything, so you stop guessing.',
        tag: 'Growing teams',
      },
      {
        key: 'scale',
        name: 'Scale',
        accent: 'magenta',
        body: 'Ready to grow? We sharpen how you find, convert, and keep customers so every channel pulls harder than before.',
        tag: 'Established brands',
      },
    ],
  },

  // 5.4 Growth Graph (interactive; full spec in growthGraph.ts)
  graph: {
    eyebrow: 'The Growth Graph',
    h2: 'See how it all connects.',
    sub: 'Pick what you want more of, and watch the pieces light up to show how they work together.',
    footerLine:
      'That loop is the difference between buying ads and building a machine that gets cheaper to run every month.',
  },

  // 5.5 Capabilities
  capabilities: {
    eyebrow: 'Everything in one place',
    h2: 'One system. Six jobs.',
    sub: 'The full range of what we do, grouped so it’s easy to follow. Each part feeds the others.',
    items: [
      { key: 'build', name: 'Build', accent: 'indigo', desc: 'Sites, stores, and apps built to sell, not just to look good.' },
      { key: 'attract', name: 'Attract', accent: 'coral', desc: 'Ads, search, and social that bring the right people to you.' },
      { key: 'convert', name: 'Convert', accent: 'magenta', desc: 'Landing pages and CRO that turn clicks into orders.' },
      { key: 'retain', name: 'Retain', accent: 'green', desc: 'Email, SMS, and loyalty that bring customers back for more.' },
      { key: 'connect', name: 'Connect', accent: 'violet', desc: 'Tracking and tools wired to share data across everything.' },
      { key: 'scale', name: 'Scale', accent: 'amber', desc: 'AI and automation that grow it all without adding headcount.' },
    ],
  },

  // 5.6 Proof (placeholder recent-work strip; no invented data)
  proof: {
    h2: 'Real work, real results.',
    sub: 'A look at recent work. Full before-and-after case studies are on the way.',
    // Neutral, clearly-generic placeholder tiles — flagged, never public labels.
    items: [
      { title: 'Connected store rebuild', kind: 'Build · Connect', accent: 'indigo', assetStatus: 'pending' },
      { title: 'Paid + email working as one', kind: 'Attract · Retain', accent: 'coral', assetStatus: 'pending' },
      { title: 'One dashboard, clear picture', kind: 'Connect', accent: 'green', assetStatus: 'pending' },
      { title: 'Repeat-customer engine', kind: 'Retain · Scale', accent: 'magenta', assetStatus: 'pending' },
    ],
  },

  // 5.7 Final CTA
  finalCta: {
    h2: 'Let’s map your Growth Graph.',
    body: 'Book a free call. Tell us about your business, and we’ll show you exactly where your growth is leaking and what we’d do about it. No pressure, no jargon, no obligation.',
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'See what we do', href: '#capabilities' },
  },

  // 5.8 Footer
  footer: {
    slogan: 'Grow your business digitally.',
    blurb:
      'Grow your business digitally. We build and connect the digital systems behind modern businesses, so every part works together.',
    legal: '© 2026 Infinite Weblinks',
  },
} as const;
