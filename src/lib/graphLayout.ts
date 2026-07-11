// Growth Graph radial label placement. Pure + testable so the collision fix
// is verified for every node angle (works across all four goal states because
// placement is geometry-driven, not per-state). Offsets clear the active
// node halo (radius = ACTIVE_HALO_R) with margin.

export const ACTIVE_HALO_R = 26;

export interface LabelPlacement {
  anchor: 'start' | 'middle' | 'end';
  dx: number;
  dy: number;
}

export function labelPlacement(angleDeg: number): LabelPlacement {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const side = Math.abs(cos) > 0.5;
  const anchor: LabelPlacement['anchor'] = side ? (cos > 0 ? 'start' : 'end') : 'middle';
  const dx = side ? (cos > 0 ? 34 : -34) : 0;
  const dy = side ? 5 : sin > 0 ? 46 : -34;
  return { anchor, dx, dy };
}

/** True when a label offset clears the active halo with a small margin. */
export function clearsHalo(p: LabelPlacement): boolean {
  const margin = 6;
  if (p.anchor === 'middle') return Math.abs(p.dy) >= ACTIVE_HALO_R + margin;
  return Math.abs(p.dx) >= ACTIVE_HALO_R + margin;
}
