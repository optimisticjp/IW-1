// Related-content resolution helpers (spec 002, FR-006). Pure functions over
// the data modules; no rendering. Used to build "related services", sibling
// switchers and the problem-first router without dangling references.

import { capabilities, getCapability } from '../data/capabilities';
import { services, getService, type Service } from '../data/services';
import { audiences } from '../data/audiences';
import { problemEntries, routes } from '../data/links';
import type { CapabilityId, AudienceId } from '../data/ids';

/** Resolve a problem statement to a destination href. Unknown → home. */
export function routeProblem(problem: string): string {
  const entry = problemEntries.find((p) => p.problem === problem);
  if (!entry) return routes.home();
  return entry.target.kind === 'capability'
    ? routes.capability(entry.target.id)
    : routes.audience(entry.target.id);
}

/** Sibling services under the same capability (excluding the given service). */
export function siblingServices(slug: string): Service[] {
  const svc = getService(slug);
  if (!svc) return [];
  return services.filter((s) => s.capabilityId === svc.capabilityId && s.id !== slug && s.treatment === 'page');
}

/** Audiences that buy from a capability, derived from its services. */
export function audiencesForCapability(id: CapabilityId): AudienceId[] {
  const set = new Set<AudienceId>();
  for (const svc of services.filter((s) => s.capabilityId === id)) {
    for (const a of svc.primaryAudienceIds) set.add(a);
  }
  return [...set];
}

/** The capabilities an audience buys from, derived from its relevant services. */
export function capabilitiesForAudience(id: AudienceId): CapabilityId[] {
  const aud = audiences.find((a) => a.id === id);
  if (!aud) return [];
  const set = new Set<CapabilityId>();
  for (const slug of aud.relevantServiceIds) {
    const svc = getService(slug);
    if (svc) set.add(svc.capabilityId);
  }
  return [...set];
}

/** True when every reference in the content graph resolves (used by tests). */
export function integrityErrors(): string[] {
  const errors: string[] = [];
  const serviceIds = new Set(services.map((s) => s.id));
  const capIds = new Set(capabilities.map((c) => c.id));

  for (const cap of capabilities) {
    for (const sid of cap.serviceIds) {
      const svc = getService(sid);
      if (!svc) errors.push(`capability ${cap.id} → missing service ${sid}`);
      else if (svc.capabilityId !== cap.id) errors.push(`service ${sid} not back-referencing ${cap.id}`);
    }
    for (const rid of cap.relatedCapabilityIds) {
      if (!capIds.has(rid)) errors.push(`capability ${cap.id} → missing related ${rid}`);
    }
  }
  for (const svc of services) {
    if (!capIds.has(svc.capabilityId)) errors.push(`service ${svc.id} → missing capability ${svc.capabilityId}`);
    for (const c of svc.connections) if (!serviceIds.has(c)) errors.push(`service ${svc.id} → missing connection ${c}`);
    if (svc.parentId && !serviceIds.has(svc.parentId)) errors.push(`section ${svc.id} → missing parent ${svc.parentId}`);
  }
  for (const aud of audiences) {
    for (const sid of aud.relevantServiceIds) {
      if (!serviceIds.has(sid)) errors.push(`audience ${aud.id} → missing service ${sid}`);
    }
  }
  return errors;
}

export { getCapability, getService };
