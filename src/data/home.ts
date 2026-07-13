// Homepage content — approved copy from the Master Website Playbook (Sections
// 1-14). Plain-English, business-outcome-first, no em dashes, no buzzwords, no
// invented figures. The two brand promises are used verbatim (FR-038):
// "You focus on your work. We handle the digital side." and
// "We build it, run it and connect every part."

export const home = {
  placeholder: true,

  meta: {
    title: 'Infinite Weblinks | Websites, marketing and digital growth connected',
    description:
      'We build, run and connect websites, stores, marketing, customer journeys, analytics, automation and AI for entrepreneurs and growing brands.',
  },

  // Section 1: Hero
  hero: {
    eyebrow: 'Connected growth agency',
    h1a: 'You focus on your work.',
    h1b: 'We handle the digital side.',
    sub: 'Websites, stores, advertising, content, email, automation, analytics and AI. Start with one project or let us take care of the whole system. We build it, run it and connect every part, so your business is easier to manage and ready to grow.',
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Explore what is possible', href: '#growth-graph' },
    trust: 'For solo experts, ecommerce brands, startups and established teams.',
  },

  // Section 2: Immediate value
  immediateValue: {
    eyebrow: 'What your digital setup could do',
    h2: 'Your business can do more online than you may realise.',
    intro:
      'A website does not have to wait passively for visitors. Marketing does not have to run on guesswork. Your team does not have to copy the same information between several tools. When the right parts work together, the digital side can help you understand customers, follow up at useful moments and make clearer decisions.',
    cards: [
      { title: 'Your advertising can learn from real sales.', body: 'Your store can send suitable conversion information back to an advertising platform, so its bidding has better information about the actions that matter, not only clicks.' },
      { title: 'Follow-up can change after a customer takes action.', body: 'A person who has already bought should not keep receiving the same "complete your purchase" message. Connected journeys can update when the customer acts.' },
      { title: 'Customer questions can improve your marketing.', body: 'Repeated questions from calls, chat, email and support reveal what customers need explained. Those questions can become better pages, videos, guides and campaigns.' },
      { title: 'One clear dashboard can replace several weekly reports.', body: 'The numbers that matter can be brought into one useful view, so the team spends less time collecting figures and more time deciding what to do.' },
      { title: 'A purchase can begin a useful relationship.', body: 'Order information can start delivery updates, product guidance, support, a review request, a timely reminder or a relevant recommendation.' },
      { title: 'AI can help when it has a clear job and reliable information.', body: 'It can organise enquiries, answer suitable questions, summarise feedback or support repeated work. It should not be added simply because it sounds modern.' },
    ],
    closing: 'These are not separate tricks. They are examples of what becomes possible when the digital side is planned as one system.',
  },

  // Section 3: The problem
  problem: {
    eyebrow: 'The whole idea',
    h2: 'The problem is rarely one bad tool. It is what gets lost between them.',
    body: [
      'Most businesses collect digital tools over time. A website is built by one company. Advertising is managed somewhere else. Email is added later. Customer information sits in another platform. Reports show different numbers.',
      'Every individual part may be doing something useful, but the business still feels difficult to manage. A good website cannot fix advertising that reaches the wrong people. Good advertising cannot fix a confusing buying journey. Automation cannot help when it receives incomplete information.',
    ],
    pullQuote: 'You do not always need more technology. You need the right setup, the right links and a team that understands the complete journey.',
    closing: 'We connect what you already have, improve what is not working and build what is missing.',
  },

  // Section 4: Three starting points (Launch, Connect, Scale)
  startingPoints: {
    eyebrow: 'Wherever you are starting from',
    h2: 'Three ways in. One complete digital team.',
    intro: 'You do not need to arrive with a technical brief. Choose the situation that sounds most like your business.',
    items: [
      { key: 'launch', name: 'Launch', cap: 'build', headline: 'I need to build the digital foundation.', copy: 'You have expertise, a product or an idea, but you do not want the technical side to become a second full-time job. We shape the brand, build the website or store, set up the essential tools and create a clear plan for finding and serving customers.', bestFor: 'Solo experts, creators, new businesses and early-stage brands.', link: { label: 'Help me launch', href: '/who-we-help/startups-and-new-brands' } },
      { key: 'connect', name: 'Connect', cap: 'connect', headline: 'I need to make a scattered setup work together.', copy: 'Your website, advertising, customer information, email and reports exist, but the complete journey is unclear. We review the current setup, keep what is useful and connect the important parts so information can move where it needs to go.', bestFor: 'Growing brands and teams using several platforms.', link: { label: 'Help me connect everything', href: '/who-we-help/growing-teams' } },
      { key: 'scale', name: 'Scale', cap: 'scale', headline: 'I need a working business to work better.', copy: 'You already have customers, active marketing and a capable team. Now you need better conversion, stronger retention, more reliable information and systems that support the next stage. We work alongside your people to find bottlenecks and improve performance.', bestFor: 'Established brands, ecommerce businesses and in-house teams.', link: { label: 'Help me scale', href: '/who-we-help/established-teams' } },
    ],
  },

  // Section 5: Anatomy of one customer journey
  anatomy: {
    eyebrow: 'One customer. Many connected moments.',
    h2: 'A sale rarely comes from one click.',
    intro: 'A customer may discover you on social media, visit your website, leave, search for you later, read an email, ask a question and finally buy. When those moments are treated separately, the business sees fragments. When they are connected, the business sees a journey.',
    steps: [
      { n: 1, name: 'Discovery', body: 'Someone finds a video, advertisement, search result, recommendation or useful article.', learn: 'Which subject, message or product earned their attention.' },
      { n: 2, name: 'Interest', body: 'They visit a page, view a product, read about a service or download something useful.', learn: 'What they may be interested in and what information they still need.' },
      { n: 3, name: 'Follow-up', body: 'They leave without buying. A relevant reminder or email can help them continue when they are ready, where consent and context make that appropriate.', learn: 'Follow-up based on interest instead of sending the same message to everyone.' },
      { n: 4, name: 'Action', body: 'They make a purchase, book a call, submit an enquiry or join a programme.', learn: 'The original source, useful interactions and final action can be viewed together more clearly.' },
      { n: 5, name: 'Relationship', body: 'The customer receives updates, support, guidance or recommendations based on what they asked for or bought.', learn: 'More relevant communication and a better reason to return.' },
      { n: 6, name: 'Learning', body: 'The outcome feeds back into marketing and reporting.', learn: 'The next campaign can be planned using information from real customers, not only assumptions.' },
    ],
    closing: 'The customer experiences one business. Your digital systems should support one business too.',
  },

  // Section 6: The Growth Graph (interactive; goals live in growthGraph.ts)
  graph: {
    eyebrow: 'The Growth Graph',
    h2: 'See how it all connects.',
    intro: 'Choose an outcome and follow the parts that help create it. The Growth Graph is a simple view of how attention, customer actions, follow-up, sales and learning can work together.',
    footerLine: 'Good connections do not remove every uncertainty. They give the business a clearer picture and a better next decision.',
  },

  // Section 7: Six capabilities
  capabilities: {
    eyebrow: 'Everything in one place',
    h2: 'One team. Six jobs.',
    intro: 'You do not need to choose from a long technical menu. Start with the job that needs to be done.',
    items: [
      { cap: 'build', name: 'Build', headline: 'Create the places where customers meet your business.', copy: 'Websites, ecommerce stores, landing pages, apps and digital products designed to be clear, useful and ready to support growth.', outcome: 'Give people a clear reason to trust you and take the next step.', href: '/what-we-do/build' },
      { cap: 'attract', name: 'Attract', headline: 'Help the right people discover you.', copy: 'Advertising, search, social media, content, video and creator campaigns planned around the customers you actually want.', outcome: 'Bring in relevant attention, not traffic for the sake of traffic.', href: '/what-we-do/attract' },
      { cap: 'convert', name: 'Convert', headline: 'Help more interested visitors take action.', copy: 'Pages, offers, forms, checkout journeys and sales funnels that remove confusion and make the next step easier.', outcome: 'Get more value from the attention you already have.', href: '/what-we-do/convert' },
      { cap: 'retain', name: 'Retain', headline: 'Give customers a reason to return.', copy: 'Email, SMS, WhatsApp, newsletters, loyalty and referral journeys built around useful communication.', outcome: 'Create more repeat business and longer customer relationships.', href: '/what-we-do/retain' },
      { cap: 'connect', name: 'Connect', headline: 'Make tools and information work together.', copy: 'Connect websites, advertising, customer records, reporting and communication so useful information reaches the right place.', outcome: 'Reduce repeated work and understand what is happening across the business.', href: '/what-we-do/connect' },
      { cap: 'scale', name: 'Scale', headline: 'Use automation and AI where they genuinely help.', copy: 'Improve repeated processes, response times and decision support without making the business more complicated.', outcome: 'Do more without adding unnecessary work or headcount.', href: '/what-we-do/scale' },
    ],
  },

  // Section 8: Start with the problem
  startWithProblem: {
    eyebrow: 'You do not need to know the service name',
    h2: 'Tell us what needs to work better.',
    items: [
      { problem: 'I need a website or online store.', copy: 'We can plan, design and build it, including the parts needed for enquiries, sales, measurement and future marketing.', link: { label: 'Build my website', href: '/what-we-do/build' } },
      { problem: 'I need more people to find my business.', copy: 'We can help with advertising, search, social media, content and the journey people take after discovering you.', link: { label: 'Help me attract customers', href: '/what-we-do/attract' } },
      { problem: 'People visit, but they do not take action.', copy: 'We can study the page, offer, message and buying journey to understand where interest may be getting lost.', link: { label: 'Help me improve conversion', href: '/what-we-do/convert' } },
      { problem: 'I need customers to come back.', copy: 'We can create useful follow-up, loyalty, email and messaging based on what people need before and after buying.', link: { label: 'Help me improve retention', href: '/what-we-do/retain' } },
      { problem: 'I do not know what is working.', copy: 'We can improve measurement and bring the numbers needed for decisions into a clearer view.', link: { label: 'Help me understand the numbers', href: '/what-we-do/connect' } },
      { problem: 'I spend too much time on repeated work.', copy: 'We can find the steps that should be simpler, automated or supported by AI.', link: { label: 'Help me save time', href: '/what-we-do/scale' } },
      { problem: 'We have a team, but need specialist support.', copy: 'We can work alongside your people on strategy, implementation, campaigns, technology or problems that sit between departments.', link: { label: 'Support our team', href: '/who-we-help/established-teams' } },
    ],
  },

  // Section 9: Modern search and AI
  modernSearch: {
    eyebrow: 'Ready for search, people and useful AI',
    h2: 'There are two different AI opportunities. Your website should explain both clearly.',
    columns: [
      { title: 'Help people and search systems understand the business', body: 'Customers now discover businesses through traditional search results, maps, video, marketplaces and AI-assisted answers. We help make your public website and content clear, useful, crawlable and well structured. No agency can guarantee that an AI system will recommend a brand. The right goal is to make the business easier to discover, understand, trust and cite.' },
      { title: 'Help your own team and customers get more from business information', body: 'AI can also work inside the business. It may help organise enquiries, answer suitable support questions, summarise customer feedback, assist with content research or improve repeated workflows. This works best when the information is accurate, permission is clear and a human remains responsible for important decisions.' },
    ],
    pullQuote: 'We use AI where it makes the work faster, clearer or more useful. We do not add it to every service title.',
    link: { label: 'Explore AI and automation', href: '/what-we-do/scale' },
  },

  // Section 10: How we work
  howWeWork: {
    eyebrow: 'A clear way forward',
    h2: 'We make the complicated part easier to understand.',
    steps: [
      { n: 1, name: 'Listen', body: 'We begin with the business, the customer and the outcome, not a preferred tool.' },
      { n: 2, name: 'Map', body: 'We look at how people discover the business, what they experience, how they act, what happens next and how the team learns from the result.' },
      { n: 3, name: 'Prioritise', body: 'Not everything needs to change at once. We identify what matters now, what can wait and what may not be worth doing.' },
      { n: 4, name: 'Build and connect', body: 'We create what is missing, improve what already exists and make sure the important parts can support one another.' },
      { n: 5, name: 'Run and improve', body: 'We can hand the system to your team or continue managing, testing and improving it with you.' },
    ],
    closing: 'Clear decisions first. Technology second.',
  },

  // Section 11: Work and proof (honest interim; see ProofInterim)
  workProof: {
    eyebrow: 'Our work',
    h2: 'See what changed, not only what we made.',
    body: 'A finished website or campaign is only part of the story. Our case studies explain the situation, what was getting in the way, what we changed, what improved and one useful lesson another business can take away.',
    interim: 'Detailed case studies are being prepared with client permission. Until then, the clearest proof is the connected systems we build and this site itself.',
    button: { label: 'Explore our work', href: '/work' },
  },

  // Section 12: Why Infinite Weblinks
  why: {
    eyebrow: 'Why we built the agency this way',
    h2: 'Your expertise should not be buried under technical work.',
    body: [
      'We kept meeting talented people who were exceptional at their work, but losing time, money and energy trying to understand websites, advertising platforms and constantly changing digital tools.',
      'Larger brands faced a different version of the same problem. They had teams and platforms, but important information still lived in separate places and nobody owned the complete journey.',
      'Infinite Weblinks was built to solve both. For entrepreneurs, we can take the digital side off your plate. For established brands, we can bring the different parts together and support the team already in place.',
    ],
    closing: 'We do not expect you to become an expert in our world. Our job is to make our world work for yours.',
    link: { label: 'Read our story', href: '/about' },
  },

  // Section 13: Homepage FAQ (rendered via the shared Accordion)
  faq: {
    eyebrow: 'Common questions',
    h2: 'Questions, answered.',
    items: [
      { q: 'Do I need to know exactly which service I need?', a: 'No. Tell us what you are trying to achieve, what is not working or what is taking too much time. We will help identify the right starting point.' },
      { q: 'Can you handle the complete digital side of a business?', a: 'Yes. We can support everything from brand and website creation to marketing, customer journeys, analytics, automation and ongoing improvement. The exact scope depends on what the business needs.' },
      { q: 'Can you work with our existing team?', a: 'Yes. We can add specialist skills, take ownership of a specific area or work across several teams when the problem sits between them.' },
      { q: 'Can we start with one project?', a: 'Yes. A focused project is often the best starting point and can expand later when it makes sense.' },
      { q: 'Do you only work with ecommerce brands?', a: 'No. We work with ecommerce brands, creators, experts, startups, service businesses and established teams. Ecommerce appears often in our examples because the links between acquisition, conversion and retention are easy to see.' },
    ],
  },

  // Section 14: Final CTA
  finalCta: {
    h2: 'Let us make the digital side work better.',
    body: 'Tell us what you are building, what feels difficult or what you want to improve. We will help you understand the options, identify the right starting point and explain what we would do next. No pressure. No unnecessary technical language. No expectation that you already know the answer.',
    primary: { label: 'Book a free call', href: '/book-a-call' },
    secondary: { label: 'Tell us about your project', href: '/book-a-call' },
  },

  // Footer
  footer: {
    slogan: 'Grow your business digitally.',
    blurb:
      'We build, run and connect the digital systems behind modern businesses, so every part works together and you can focus on your work.',
    legal: '© 2026 Infinite Weblinks',
  },
} as const;
