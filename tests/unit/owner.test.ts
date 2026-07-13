import { describe, expect, it } from 'vitest';
import { hasFounderProfile, type OwnerProfile } from '../../src/data/owner';

describe('owner profile content contract', () => {
  const completeProfile: OwnerProfile = {
    name: 'A Real Founder',
    role: 'Founder',
    shortBiography: 'A short, honest biography for the founder profile.',
    portraitPath: '/images/founder.jpg',
    portraitAlt: 'Portrait of the founder',
  };

  it('returns false for an empty profile', () => {
    expect(hasFounderProfile({})).toBe(false);
  });

  it('returns false when one required field is missing', () => {
    const { portraitAlt: _portraitAlt, ...missingPortraitAlt } = completeProfile;

    expect(hasFounderProfile(missingPortraitAlt)).toBe(false);
  });

  it('returns false when required fields contain only whitespace', () => {
    expect(
      hasFounderProfile({
        name: '  ',
        role: 'Founder',
        shortBiography: 'A short, honest biography for the founder profile.',
        portraitPath: '/images/founder.jpg',
        portraitAlt: 'Portrait of the founder',
      })
    ).toBe(false);
  });

  it('returns true when all required fields are present', () => {
    expect(hasFounderProfile(completeProfile)).toBe(true);
  });

  it('keeps verified credentials optional', () => {
    expect(hasFounderProfile({ ...completeProfile, verifiedCredentials: [] })).toBe(true);
    expect(hasFounderProfile({ ...completeProfile, verifiedCredentials: ['Verified certification'] })).toBe(true);
  });
});
