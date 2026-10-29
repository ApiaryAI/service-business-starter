import type { PostHog } from 'posthog-js';

/* Visit and enquiry measurement. Each provider stays off until its public ID is set
   in Vercel and the visitor agrees. Vercel Web Analytics needs no ID, only consent.
   Docs/TRACKING.md explains the choices and the release steps. */

export const tracking = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogRegion: process.env.NEXT_PUBLIC_POSTHOG_REGION === 'eu' ? 'eu' : 'us',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsEnquiry: process.env.NEXT_PUBLIC_GOOGLE_ADS_ENQUIRY,
} as const;
// Vercel Web Analytics is cookieless. The consent banner appears only once a cookie-based provider is configured.
export const needsConsent = Boolean(tracking.posthogKey || tracking.googleAnalyticsId || tracking.googleAdsId || tracking.metaPixelId);
// Keep in sync with the rewrites in next.config.ts.
export const posthogProxyPath = '/ingest';
export type EnquiryKind = 'form' | 'phone' | 'email';
export type TrackingConsent = { analytics: boolean; marketing: boolean };
type Tag = (...args: unknown[]) => void;
export type Placement = 'header' | 'footer' | 'hero' | 'contact_band' | 'enquiry_form' | 'content';
type EnquiryEvent = { kind: EnquiryKind; page: string; id: string; placement: Placement };
type VercelTracker = (name: string, properties: Record<string, string>) => void;
type Action = 'enquiry_cta_click' | 'enquiry_form_start' | 'enquiry_review' | 'enquiry_send_attempt' | 'enquiry_send_failed' | 'enquiry_copy';
type Failure = 'verification' | 'rate_limit' | 'server' | 'network';
const pendingActions: { name: Action; properties: Record<string, string> }[] = [];

declare global {
  interface Window {
    fbq?: Tag;
    gtag?: Tag;
    dataLayer?: unknown[];
    va?: Tag;
    vaq?: unknown[][];
  }
}

let consent: TrackingConsent = { analytics: false, marketing: false };
let posthog: PostHog | undefined;
let google: Tag | undefined;
let meta: Tag | undefined;
let vercel: VercelTracker | undefined;
const pending = {
  vercel: [] as EnquiryEvent[],
  posthog: [] as EnquiryEvent[],
  analytics: [] as EnquiryEvent[],
  ads: [] as EnquiryEvent[],
  meta: [] as EnquiryEvent[],
};
type Destination = keyof typeof pending;
const senders = {
  vercel: (e: EnquiryEvent) => vercel?.('enquiry', { kind: e.kind, page: e.page, placement: e.placement }),
  posthog: (e: EnquiryEvent) =>
    posthog?.capture('enquiry', { kind: e.kind, page: e.page, $insert_id: e.id }, { transport: 'sendBeacon', send_instantly: true }),
  analytics: (e: EnquiryEvent) =>
    google?.('event', 'generate_lead', {
      send_to: tracking.googleAnalyticsId,
      method: e.kind,
      page: e.page,
    }),
  ads: (e: EnquiryEvent) =>
    google?.('event', 'conversion', {
      send_to: tracking.googleAdsEnquiry,
      transaction_id: e.id,
    }),
  meta: (e: EnquiryEvent) => meta?.('track', e.kind === 'form' ? 'Lead' : 'Contact', { content_category: e.kind }, { eventID: e.id }),
};
const permitted = (d: Destination) => (d === 'ads' || d === 'meta' ? consent.marketing : consent.analytics);
const available = (d: Destination) => (d === 'vercel' ? vercel : d === 'posthog' ? posthog : d === 'meta' ? meta : google);

function flush(d: Destination) {
  if (!permitted(d) || !available(d)) return;
  for (const event of pending[d].splice(0)) {
    // A blocked provider must never interrupt an enquiry or another provider.
    try {
      senders[d](event);
    } catch {
      /* ignored */
    }
  }
}

export function setTrackingConsent(next: TrackingConsent) {
  consent = { ...next };
  if (!next.analytics) pendingActions.length = 0;
  if (!next.analytics) posthog?.opt_out_capturing?.();
  else if (posthog?.has_opted_out_capturing?.()) posthog.opt_in_capturing();
  for (const d of Object.keys(pending) as Destination[]) if (!permitted(d)) pending[d] = [];
}
export const hasAnalyticsConsent = () => consent.analytics;
export function setVercelTracker(instance: VercelTracker) {
  vercel = instance;
  flush('vercel');
  flushActions();
}
export function setPosthog(instance: PostHog) {
  posthog = instance;
  flush('posthog');
}
export function setGoogleTag(instance: Tag) {
  google = instance;
  flush('analytics');
  flush('ads');
}
export function setMetaPixel(instance: Tag) {
  meta = instance;
  flush('meta');
}

/* One shared ID per enquiry lets providers dedupe later (e.g. PostHog → Meta CAPI).
   Consented events wait in memory until each provider loads. Pre-consent events,
   form contents and events whose consent is withdrawn are never kept. */
export function trackEnquiry(kind: EnquiryKind, placement: Placement = 'content') {
  const event = {
    kind,
    placement,
    page: window.location.pathname,
    id: crypto.randomUUID(),
  };
  const enabled = {
    vercel: true,
    posthog: tracking.posthogKey,
    analytics: tracking.googleAnalyticsId,
    ads: tracking.googleAdsId && tracking.googleAdsEnquiry,
    meta: tracking.metaPixelId,
  };
  for (const d of Object.keys(pending) as Destination[]) {
    if (!enabled[d] || !permitted(d)) continue;
    pending[d].push(event);
    // Bound memory if a browser blocks a script indefinitely.
    if (pending[d].length > 100) pending[d].shift();
    flush(d);
  }
}

// Funnel steps are observations, not ad conversions. Never accept form values or URLs here.
export function trackAction(name: Action, placement: Placement = 'enquiry_form', failure?: Failure) {
  if (!consent.analytics) return;
  pendingActions.push({ name, properties: { page: window.location.pathname, placement, ...(failure ? { failure } : {}) } });
  if (pendingActions.length > 100) pendingActions.shift();
  flushActions();
}
function flushActions() {
  if (!consent.analytics || !vercel) return;
  for (const event of pendingActions.splice(0)) {
    try { vercel(event.name, event.properties); } catch { /* Measurement must not block enquiries. */ }
  }
}

export function trackContactLink(link: Element) {
  const href = link.getAttribute('href') ?? '';
  const placement: Placement = link.closest('.hk-header') ? 'header'
    : link.closest('.hk-footer') ? 'footer'
    : link.closest('.hk-hero, .hk-phero') ? 'hero'
    : link.closest('.hk-cta') ? 'contact_band'
    : link.closest('.hk-enquiry') ? 'enquiry_form' : 'content';
  if (/^tel:/i.test(href)) trackEnquiry('phone', placement);
  else if (/^mailto:/i.test(href)) trackEnquiry('email', placement);
  // Service pages jump to their own enquiry form rather than linking to /contact.
  else if (href === '#enquire') trackAction('enquiry_cta_click', placement);
  else {
    // Only same-origin contact links; never export query strings or mailto contents.
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin === window.location.origin && /^\/contact\/?$/.test(url.pathname)) trackAction('enquiry_cta_click', placement);
    } catch { /* Not a navigable link. */ }
  }
}
