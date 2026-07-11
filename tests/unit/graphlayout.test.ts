import { describe, it, expect } from 'vitest';
import { labelPlacement, clearsHalo, ACTIVE_HALO_R } from '../../src/lib/graphLayout';
import { graphNodes } from '../../src/data/growthGraph';

// The nine radial node angles used by the Growth Graph.
const angles = graphNodes.map((n) => -90 + n.ring * 40);

describe('Growth Graph label placement (collision fix)', () => {
  it('every node label clears the active halo', () => {
    for (const a of angles) {
      expect(clearsHalo(labelPlacement(a))).toBe(true);
    }
  });

  it('bottom-center nodes push labels well below the halo', () => {
    // Store (ring 4 → 70°) and Email (ring 5 → 110°) are the bottom cluster.
    for (const a of [70, 110]) {
      const p = labelPlacement(a);
      expect(p.anchor).toBe('middle');
      expect(p.dy).toBeGreaterThan(ACTIVE_HALO_R);
    }
  });

  it('side nodes anchor outward by direction', () => {
    expect(labelPlacement(-10)).toMatchObject({ anchor: 'start', dx: 34 }); // right
    expect(labelPlacement(190)).toMatchObject({ anchor: 'end', dx: -34 }); // left
  });

  it('the top node lifts its label above the halo', () => {
    const p = labelPlacement(-90);
    expect(p.anchor).toBe('middle');
    expect(p.dy).toBeLessThanOrEqual(-ACTIVE_HALO_R);
  });
});
