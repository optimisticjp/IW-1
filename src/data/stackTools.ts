// Map Your Stack — the nine selectable tools (spec §3). Chip labels differ from
// the terse graph node labels (e.g. "Analytics & tracking" vs "Tracking"), so
// this is the single source of truth for the chips AND the booking handoff
// summary. `key` is the graph node id the chip maps to.

import type { NodeKey } from './growthGraph';

export interface StackTool {
  key: NodeKey;
  label: string;
  helper?: string;
}

export const stackTools: StackTool[] = [
  { key: 'website', label: 'Website', helper: 'your main site or landing pages' },
  { key: 'store', label: 'Online store', helper: 'Shopify, WooCommerce' },
  { key: 'googleAds', label: 'Google Ads' },
  { key: 'social', label: 'Social media', helper: 'Instagram, TikTok, Facebook' },
  { key: 'tracking', label: 'Analytics & tracking', helper: 'GA4, pixels' },
  { key: 'crm', label: 'Customer list / CRM' },
  { key: 'email', label: 'Email marketing', helper: 'Klaviyo, Mailchimp' },
  { key: 'whatsapp', label: 'WhatsApp / SMS' },
  { key: 'ai', label: 'AI & automation' },
];

/** Node key → friendly chip label (used by the booking handoff). */
export const stackToolLabel: Record<string, string> = Object.fromEntries(
  stackTools.map((t) => [t.key, t.label])
);

/** Valid tool keys — an allowlist for parsing the ?tools= handoff safely. */
export const stackToolKeys: ReadonlySet<string> = new Set(stackTools.map((t) => t.key));

/** Parse a compact ?tools= value into an ordered, de-duplicated key list.
 *  Ignores anything not on the allowlist (no injection, no surprises). */
export function parseToolsParam(raw: string | null): NodeKey[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: NodeKey[] = [];
  for (const part of raw.split(',')) {
    const k = part.trim();
    if (stackToolKeys.has(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k as NodeKey);
    }
  }
  return out;
}

/** A short, plain-English summary of the selected tools for the booking form. */
export function toolsSummary(keys: NodeKey[]): string {
  if (!keys.length) return '';
  const labels = keys.map((k) => stackToolLabel[k]);
  return `Tools I currently use: ${labels.join(', ')}. I'd like to see where my growth is leaking.`;
}
