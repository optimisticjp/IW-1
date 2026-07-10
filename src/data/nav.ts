// Site navigation configuration.
// Primary nav stays ecommerce-first (FR-005). Secondary-audience links are
// marked `quiet` so they never dilute the main positioning (SC-017).

export type Emphasis = 'default' | 'cta' | 'quiet';

export interface NavItem {
  label: string;
  href: string;
  primary: boolean;
  emphasis?: Emphasis;
  /** paths that should mark this item active */
  matchPaths?: string[];
}

export const primaryNav: NavItem[] = [
  { label: 'What we do', href: '/what-we-do', primary: true, matchPaths: ['/what-we-do', '/services'] },
  { label: 'Case studies', href: '/case-studies', primary: true, matchPaths: ['/case-studies'] },
  { label: 'Approach', href: '/approach', primary: true, matchPaths: ['/approach'] },
  { label: 'Insights', href: '/insights', primary: true, matchPaths: ['/insights'] },
];

export const proposalCta: NavItem = {
  label: 'Request a proposal',
  href: '/request-a-proposal',
  primary: true,
  emphasis: 'cta',
  matchPaths: ['/request-a-proposal'],
};

export interface FooterGroup {
  heading: string;
  items: NavItem[];
}

export const footerGroups: FooterGroup[] = [
  {
    heading: 'Services',
    items: [
      { label: 'Meta Ads', href: '/services/meta-ads', primary: false },
      { label: 'Google Ads', href: '/services/google-ads', primary: false },
      { label: 'Website Design & Development', href: '/services/website-design-development', primary: false },
      { label: 'Shopify Store Development & Management', href: '/services/shopify-development-management', primary: false },
      { label: 'Social Media Growth', href: '/services/social-media-growth', primary: false },
      { label: 'Retention', href: '/services/retention', primary: false },
      { label: 'Intelligence', href: '/services/intelligence', primary: false },
    ],
  },
  {
    heading: 'Studio',
    items: [
      { label: 'What we do', href: '/what-we-do', primary: false },
      { label: 'Case studies', href: '/case-studies', primary: false },
      { label: 'Approach', href: '/approach', primary: false },
      { label: 'Insights', href: '/insights', primary: false },
    ],
  },
  {
    heading: 'Work with us',
    items: [
      { label: 'Request a proposal', href: '/request-a-proposal', primary: false, emphasis: 'cta' },
      { label: 'Contact', href: '/contact', primary: false },
      { label: 'For creators', href: '/for-creators', primary: false, emphasis: 'quiet' },
      { label: 'Partners & white-label', href: '/partners', primary: false, emphasis: 'quiet' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', href: '/legal/privacy', primary: false },
      { label: 'Terms', href: '/legal/terms', primary: false },
      { label: 'Cookies', href: '/legal/cookies', primary: false },
      { label: 'Accessibility', href: '/legal/accessibility', primary: false },
    ],
  },
];

export function isActive(item: NavItem, pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '') || '/';
  const paths = item.matchPaths ?? [item.href];
  return paths.some((p) => clean === p || clean.startsWith(p + '/'));
}
