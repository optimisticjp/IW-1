export interface OwnerProfile {
  name?: string;
  role?: string;
  shortBiography?: string;
  portraitPath?: string;
  portraitAlt?: string;
  verifiedCredentials?: readonly string[];
}

export const ownerProfile: OwnerProfile = {
  verifiedCredentials: [],
};

export function hasFounderProfile(profile: OwnerProfile): boolean {
  return Boolean(
    profile.name?.trim() &&
      profile.role?.trim() &&
      profile.shortBiography?.trim() &&
      profile.portraitPath?.trim() &&
      profile.portraitAlt?.trim()
  );
}
