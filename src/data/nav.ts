// Navigation (Master Website Brief §4). Kept simple. Phase-2 pages are not
// built yet, so primary-nav items anchor to the relevant homepage sections;
// "Book a free call" leads to the final CTA band.

export interface NavItem {
  label: string;
  href: string;
  emphasis?: 'default' | 'cta';
}

export const primaryNav: NavItem[] = [
  { label: 'What we do', href: '#capabilities' },
  { label: 'How it connects', href: '#growth-graph' },
  { label: 'Who we help', href: '#three-doors' },
];

export const bookCta: NavItem = { label: 'Book a free call', href: '#book', emphasis: 'cta' };

export interface FooterGroup {
  heading: string;
  items: { label: string; href: string }[];
}

export const footerGroups: FooterGroup[] = [
  {
    heading: 'What we do',
    items: [
      { label: 'Build', href: '#capabilities' },
      { label: 'Attract', href: '#capabilities' },
      { label: 'Convert', href: '#capabilities' },
      { label: 'Retain', href: '#capabilities' },
      { label: 'Connect', href: '#capabilities' },
      { label: 'Scale', href: '#capabilities' },
    ],
  },
  {
    heading: 'Who we help',
    items: [
      { label: 'Ecommerce brands', href: '#three-doors' },
      { label: 'Creators & experts', href: '#three-doors' },
      { label: 'Startups', href: '#three-doors' },
      { label: 'Established teams', href: '#three-doors' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'How it connects', href: '#growth-graph' },
      { label: 'Our work', href: '#proof' },
      { label: 'About', href: '#book' },
      { label: 'Start a project', href: '#book' },
    ],
  },
];
