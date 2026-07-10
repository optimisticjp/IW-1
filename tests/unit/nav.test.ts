import { describe, it, expect } from 'vitest';
import { primaryNav, proposalCta, footerGroups, isActive } from '../../src/data/nav';

describe('navigation config', () => {
  it('primary nav covers the required ecommerce-first destinations', () => {
    const labels = primaryNav.map((i) => i.label);
    expect(labels).toEqual(
      expect.arrayContaining(['What we do', 'Case studies', 'Approach', 'Insights'])
    );
  });

  it('exposes Request a Proposal as the single primary CTA', () => {
    expect(proposalCta.emphasis).toBe('cta');
    expect(proposalCta.href).toBe('/request-a-proposal');
  });

  it('keeps secondary-audience links quiet (not in primary nav)', () => {
    const primaryLabels = primaryNav.map((i) => i.label.toLowerCase());
    expect(primaryLabels).not.toContain('for creators');
    expect(primaryLabels).not.toContain('partners & white-label');

    const workGroup = footerGroups.find((g) => g.heading === 'Work with us')!;
    const creators = workGroup.items.find((i) => i.href === '/for-creators')!;
    const partners = workGroup.items.find((i) => i.href === '/partners')!;
    expect(creators.emphasis).toBe('quiet');
    expect(partners.emphasis).toBe('quiet');
  });

  it('lists the five priority services by their real names in the footer', () => {
    const services = footerGroups.find((g) => g.heading === 'Services')!;
    const labels = services.items.map((i) => i.label);
    for (const name of [
      'Meta Ads',
      'Google Ads',
      'Website Design & Development',
      'Shopify Store Development & Management',
      'Social Media Growth',
    ]) {
      expect(labels).toContain(name);
    }
  });

  it('marks the active page correctly', () => {
    const item = primaryNav.find((i) => i.href === '/what-we-do')!;
    expect(isActive(item, '/what-we-do')).toBe(true);
    expect(isActive(item, '/services/meta-ads')).toBe(true); // matchPaths includes /services
    expect(isActive(item, '/approach')).toBe(false);
  });
});
