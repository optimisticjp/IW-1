// Navigation model (spec 002, FR-001/002/003/004). Primary items resolve to
// their routes; "What we do" opens a mega-menu of the six capabilities with
// their top service links and an overview link; the footer carries four columns
// plus a /contact link and an opt-in newsletter that only appears when a
// provider endpoint is configured (FR-050).

import { capabilities } from './capabilities';
import { audiences } from './audiences';
import { servicesForCapability } from './services';
import { routes } from './links';

export interface NavItem {
  label: string;
  href: string;
  emphasis?: 'default' | 'cta';
}

// Primary nav rendered today. Work, Insights and About join as their pages ship
// (Phase 7); until then the header links to the surfaces that exist.
export const primaryNav: NavItem[] = [
  { label: 'What we do', href: '/what-we-do' },
  { label: 'How it connects', href: '/how-it-connects' },
  { label: 'Map your stack', href: '/map-your-stack' },
  { label: 'Who we help', href: '/who-we-help' },
];

export const bookCta: NavItem = { label: 'Book a free call', href: '/book-a-call', emphasis: 'cta' };

// Mega-menu: six capabilities, each with a one-line descriptor and its top
// service links, plus a link back to the capability overview.
export interface MegaColumn {
  id: string;
  name: string;
  descriptor: string;
  href: string;
  services: { label: string; href: string }[];
}

export const megaMenu: MegaColumn[] = capabilities.map((cap) => ({
  id: cap.id,
  name: cap.name,
  descriptor: cap.descriptor,
  href: routes.capability(cap.id),
  services: servicesForCapability(cap.id)
    .filter((s) => s.treatment === 'page')
    .slice(0, 3)
    .map((s) => ({ label: s.name, href: routes.service(s.id) })),
}));

export const megaOverview = { label: 'All capabilities', href: routes.whatWeDo() };

// Audience quick-links for the "Who we help" area.
export const audienceLinks = audiences.map((a) => ({ label: a.name, href: routes.audience(a.id) }));

export interface FooterColumn {
  heading: string;
  items: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    heading: 'What we do',
    items: capabilities.map((c) => ({ label: c.name, href: routes.capability(c.id) })),
  },
  {
    heading: 'Who we help',
    items: audiences.map((a) => ({ label: a.name, href: routes.audience(a.id) })),
  },
  {
    heading: 'Learn',
    items: [
      { label: 'How it connects', href: routes.howItConnects() },
      { label: 'Map your stack', href: routes.mapYourStack() },
      { label: 'Work', href: routes.work() },
      { label: 'Insights', href: routes.insights() },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About', href: routes.about() },
      { label: 'Contact', href: routes.contact() },
      { label: 'Book a free call', href: routes.bookACall() },
    ],
  },
];

// Legal row (Privacy, Cookies, Terms).
export const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
];

/** Newsletter ships only when a provider endpoint is configured (FR-050). */
export const newsletterEnabled = Boolean(import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT);

/** True when `current` path matches a nav item's href (for aria-current). */
export function isCurrent(itemHref: string, current: string): boolean {
  const norm = (p: string) => (p !== '/' ? p.replace(/\/$/, '') : p);
  const a = norm(itemHref);
  const c = norm(current);
  return a === c || (a !== '/' && c.startsWith(a + '/'));
}

// Back-compat alias (older footer used `footerGroups`).
export const footerGroups = footerColumns;
