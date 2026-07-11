// Shared Growth Graph geometry — the radial layout maths reused by BOTH the
// homepage goal graph (GrowthGraph.astro) and the Map Your Stack selection
// graph (StackGraph.astro). Kept pure + testable so the two graphs stay in
// exact geometric lockstep (same node positions, viewBox, radii). This is the
// "engine" the spec asks us to reuse rather than rebuild.

import { graphNodes } from '../data/growthGraph';

/** Radial map constants (unchanged from the original homepage graph). */
export const RADIAL = {
  cx: 390,
  cy: 300,
  rx: 250,
  ry: 215,
  viewW: 780,
  viewH: 640,
  nodeR: 13, // tool disc radius
  haloR: 26, // active glow radius
  hubR: 38, // hub gradient disc radius
  hubHaloR: 54, // hub soft halo radius
} as const;

export interface NodePos {
  x: number;
  y: number;
  a: number; // angle in degrees
}

/** Angle (degrees) for a node at the given ring index. 0 = top, clockwise. */
export function nodeAngle(ring: number): number {
  return -90 + ring * 40;
}

/** Radial position for a single ring index. */
export function positionForRing(ring: number): NodePos {
  const deg = nodeAngle(ring);
  const a = (deg * Math.PI) / 180;
  return {
    x: +(RADIAL.cx + RADIAL.rx * Math.cos(a)).toFixed(1),
    y: +(RADIAL.cy + RADIAL.ry * Math.sin(a)).toFixed(1),
    a: deg,
  };
}

/** Position map keyed by node key, for every node in the Growth Graph. */
export function nodePositions(): Record<string, NodePos> {
  const pos: Record<string, NodePos> = {};
  for (const n of graphNodes) pos[n.key] = positionForRing(n.ring);
  return pos;
}

/** Build an SVG polyline path string through the given node keys. */
export function pathThrough(keys: string[], pos: Record<string, NodePos>): string {
  return 'M ' + keys.map((k) => `${pos[k].x} ${pos[k].y}`).join(' L ');
}
