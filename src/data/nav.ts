// Navigation (Master Website Brief §4 + Phase 2). "What we do" and "Who we
// help" now resolve to their dedicated routes; "How it connects" still anchors
// to the homepage Growth Graph; "Book a free call" leads to /book-a-call.

export interface NavItem {
  label: string;
  href: string;
  emphasis?: 'default' | 'cta';
}

export const primaryNav: NavItem[] = [
  { label: 'What we do', href: '/what-we-do' },
  { label: 'How it connects', href: '/how-it-connects' },
  { label: 'Map your stack', href: '/map-your-stack' },
  { label: 'Who we help', href: '/who-we-help' },
];

export const bookCta: NavItem = { label: 'Book a free call', href: '/book-a-call', emphasis: 'cta' };

export interface FooterGroup {
  heading: string;
  items: { label: string; href: string }[];
}

export const footerGroups: FooterGroup[] = [
  {
    heading: 'What we do',
    items: [
      { label: 'Build', href: '/what-we-do#build' },
      { label: 'Attract', href: '/what-we-do#attract' },
      { label: 'Convert', href: '/what-we-do#convert' },
      { label: 'Retain', href: '/what-we-do#retain' },
      { label: 'Connect', href: '/what-we-do#connect' },
      { label: 'Scale', href: '/what-we-do#scale' },
    ],
  },
  {
    heading: 'Who we help',
    items: [
      { label: 'Ecommerce brands', href: '/who-we-help#ecommerce' },
      { label: 'Creators & experts', href: '/who-we-help#creators' },
      { label: 'Startups', href: '/who-we-help#startups' },
      { label: 'Established teams', href: '/who-we-help#teams' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'How it connects', href: '/how-it-connects' },
      { label: 'Map your stack', href: '/map-your-stack' },
      { label: 'Our work', href: '/#proof' },
      { label: 'About', href: '/' },
      { label: 'Start a project', href: '/book-a-call' },
    ],
  },
];
