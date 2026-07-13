// Booking/contact logic: pure validation + a provider-neutral submission
// adapter. Production posts to a single configurable endpoint
// (PUBLIC_BOOKING_ENDPOINT, e.g. a Formspree form URL). With no endpoint set,
// a dev-safe mock simulates success so the experience is fully previewable.
// No credentials, scheduler URLs, or emails are hardcoded.

export interface BookingValues {
  name: string;
  email: string;
  company: string;
  url?: string;
  help: string;
  details: string;
  timing?: string;
  privacy: boolean;
  _hp?: string; // honeypot
  _t?: number; // render timestamp (spam timing check)
}

export const helpOptions = [
  'Build a website, store, or app',
  'Bring in the right customers',
  'Turn more visitors into orders',
  'Keep customers coming back',
  'Connect my tools and data',
  'Not sure yet, let’s talk',
];

export const timingOptions = ['As soon as possible', 'This quarter', 'Just exploring for now'];

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isUrl(v: string): boolean {
  const s = v.trim();
  if (!s) return false;
  try {
    new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a map of field → error message. Empty object means valid.
 * Required fields (spec 002, FR-026): name, work email, business name, privacy.
 * Everything else (help/closest-description, details/goal, url, timing) is
 * OPTIONAL and qualifies lightly without gatekeeping.
 */
export function validateBooking(v: Partial<BookingValues>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.name || !v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email || !v.email.trim()) e.email = 'Please enter your work email.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!v.company || !v.company.trim()) e.company = 'Please enter your business name.';
  if (v.url && v.url.trim() && !isUrl(v.url)) e.url = 'Please enter a valid URL, or leave it blank.';
  if (!v.privacy) e.privacy = 'Please acknowledge how we’ll use your details.';
  return e;
}

export interface ContactValues {
  name: string;
  email: string;
  message: string;
  privacy: boolean;
  _hp?: string;
}

/** Lighter /contact validation: name, work email, message, privacy required. */
export function validateContact(v: Partial<ContactValues>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.name || !v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email || !v.email.trim()) e.email = 'Please enter your work email.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!v.message || !v.message.trim()) e.message = 'Please enter a short message.';
  if (!v.privacy) e.privacy = 'Please acknowledge how we’ll use your details.';
  return e;
}

export interface SubmitResult {
  ok: boolean;
  retryable?: boolean;
  mock?: boolean;
  /** true when no endpoint is configured in a production build */
  unconfigured?: boolean;
}

export interface SubmitOpts {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  /** override the dev/prod detection (defaults to import.meta.env.DEV) */
  dev?: boolean;
}

export function bookingEndpoint(): string {
  // PUBLIC_ vars are inlined at build; undefined in tests → mock/unconfigured path.
  try {
    return (import.meta as any).env?.PUBLIC_BOOKING_ENDPOINT || '';
  } catch {
    return '';
  }
}

export function isDevEnv(): boolean {
  try {
    return !!(import.meta as any).env?.DEV;
  } catch {
    return false;
  }
}

export function newsletterEndpoint(): string {
  try {
    return (import.meta as any).env?.PUBLIC_NEWSLETTER_ENDPOINT || '';
  } catch {
    return '';
  }
}

/**
 * Newsletter subscribe (spec 002, FR-050). Provider-neutral, never-false-
 * success, confirmed (double) opt-in. Only runs when an endpoint is configured;
 * the footer omits the opt-in entirely until then.
 */
export async function submitNewsletter(
  email: string,
  opts: { endpoint?: string; fetchImpl?: typeof fetch } = {}
): Promise<SubmitResult> {
  if (!isEmail(email)) return { ok: false, retryable: false };
  const endpoint = opts.endpoint ?? newsletterEndpoint();
  if (!endpoint) return { ok: false, retryable: true, unconfigured: true };
  const f = opts.fetchImpl ?? fetch;
  try {
    const res = await f(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return { ok: true };
    return { ok: false, retryable: res.status >= 500 };
  } catch {
    return { ok: false, retryable: true };
  }
}

export async function submitBooking(
  payload: BookingValues,
  opts: SubmitOpts = {}
): Promise<SubmitResult> {
  // Spam: silently accept-and-drop a filled honeypot.
  if (payload._hp) return { ok: true };
  const endpoint = opts.endpoint ?? bookingEndpoint();
  const dev = opts.dev ?? isDevEnv();

  if (!endpoint) {
    if (dev) {
      // Dev-only mock, no network, no persistence. NOT a real submission,
      // and it never runs in a production build.
      await new Promise((r) => setTimeout(r, 650));
      return { ok: true, mock: true };
    }
    // Production with no endpoint configured: never show a false success,
    // report a safe, recoverable error so no lead is silently dropped.
    return { ok: false, retryable: true, unconfigured: true };
  }

  const f = opts.fetchImpl ?? fetch;
  try {
    const res = await f(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    return { ok: false, retryable: res.status >= 500 };
  } catch {
    return { ok: false, retryable: true };
  }
}
