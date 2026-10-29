'use client';

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PostHog } from 'posthog-js';
import {
  hasAnalyticsConsent,
  needsConsent,
  posthogProxyPath,
  setGoogleTag,
  setMetaPixel,
  setPosthog,
  setTrackingConsent,
  setVercelTracker,
  trackContactLink,
  tracking,
  type TrackingConsent,
} from '../lib/tracking';

const consentKey = 'service-consent-v1';
const denied: TrackingConsent = { analytics: false, marketing: false };
// The Vercel script can outlive this component, so check consent on every event.
const beforeSendVercel = (event: BeforeSendEvent) => (hasAnalyticsConsent() ? event : null);
const googleConsent = (c: TrackingConsent) => ({
  analytics_storage: c.analytics ? 'granted' : 'denied',
  ad_storage: c.marketing ? 'granted' : 'denied',
  ad_user_data: c.marketing ? 'granted' : 'denied',
  ad_personalization: c.marketing ? 'granted' : 'denied',
});

// Name only the providers that are actually configured.
const analyticsNames = ['Vercel', tracking.posthogKey && 'PostHog', tracking.googleAnalyticsId && 'Google Analytics'].filter((n): n is string => Boolean(n));
const adNames = [tracking.metaPixelId && 'Meta', tracking.googleAdsId && 'Google Ads'].filter((n): n is string => Boolean(n));
const listNames = (names: string[]) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);

export function Tracking() {
  const [consent, setConsent] = useState<TrackingConsent | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TrackingConsent>(denied);
  const configured = useRef(new Set<string>());
  const apply = useCallback((next: TrackingConsent) => {
    setTrackingConsent(next);
    // Update consent before another click or navigation can send an event.
    window.gtag?.('consent', 'update', googleConsent(next));
    window.fbq?.('consent', next.marketing ? 'grant' : 'revoke');
    setConsent(next);
  }, []);

  useEffect(() => {
    // Only cookieless Vercel Analytics is configured, so there is nothing to ask about.
    if (!needsConsent) {
      apply({ analytics: true, marketing: false });
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(consentKey) ?? 'null');
      if (
        saved &&
        typeof saved.analytics === 'boolean' &&
        typeof saved.marketing === 'boolean' &&
        typeof saved.expiresAt === 'number' &&
        saved.expiresAt > Date.now()
      ) {
        apply({ analytics: saved.analytics, marketing: saved.marketing });
        return;
      }
    } catch {
      /* Storage can be unavailable. The choice still works for this page. */
    }
    apply(denied);
    setOpen(true);
  }, [apply]);

  const choose = (next: TrackingConsent) => {
    try {
      localStorage.setItem(
        consentKey,
        JSON.stringify({
          ...next,
          expiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000,
        }),
      );
    } catch {
      /* Unavailable storage must not block the site. */
    }
    apply(next);
    setOpen(false);
    setEditing(false);
  };
  const manage = () => {
    setDraft(consent ?? denied);
    setEditing(true);
    setOpen(true);
  };
  const analytics = consent?.analytics ?? false;
  const marketing = consent?.marketing ?? false;
  usePosthog(analytics);
  useLinkEnquiries();

  useEffect(() => {
    if (!analytics) return;
    // The SDK drains this queue once injected, so early clicks are not lost.
    window.va ??= (...args) => {
      (window.vaq ??= []).push(args);
    };
    window.va('beforeSend', beforeSendVercel);
    setVercelTracker(track);
  }, [analytics]);

  useEffect(() => {
    if (!analytics && !marketing) return;
    if (!tracking.googleAnalyticsId && !tracking.googleAdsId) return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      // Defaults must precede js/config/events in the data layer.
      window.gtag('consent', 'default', googleConsent(denied));
      window.gtag('js', new Date());
    }
    window.gtag('consent', 'update', googleConsent({ analytics, marketing }));
    const ids = [analytics && tracking.googleAnalyticsId, marketing && tracking.googleAdsId].filter((id): id is string => Boolean(id));
    for (const id of ids) {
      window.gtag('config', id, {
        allow_ad_personalization_signals: marketing,
        ...(configured.current.has(id) ? { send_page_view: false } : {}),
      });
      configured.current.add(id);
    }
    setGoogleTag(window.gtag);
  }, [analytics, marketing]);

  const pathname = usePathname();
  const lastAdsPage = useRef<string | null>(null);
  useEffect(() => {
    if (!marketing || !tracking.googleAdsId) {
      lastAdsPage.current = null;
      return;
    }
    // The config above sends the first page; later pages go only to Ads.
    if (lastAdsPage.current !== null && lastAdsPage.current !== pathname) window.gtag?.('event', 'page_view', { send_to: tracking.googleAdsId });
    lastAdsPage.current = pathname;
  }, [pathname, marketing]);

  // A grant after analytics-only must also re-enable personalisation in GA.
  useEffect(() => {
    window.gtag?.('set', 'allow_ad_personalization_signals', marketing);
  }, [marketing]);

  const googleId = (analytics && tracking.googleAnalyticsId) || (marketing && tracking.googleAdsId);
  const check = (k: keyof TrackingConsent) => (e: { target: { checked: boolean } }) => setDraft((d) => ({ ...d, [k]: e.target.checked }));
  return (
    <>
      {analytics && <Analytics beforeSend={beforeSendVercel} />}
      {marketing && tracking.metaPixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          // Next calls inline onReady before inserting and evaluating the script.
          onReady={() =>
            queueMicrotask(() => {
              if (window.fbq) setMetaPixel(window.fbq);
            })
          }
        >
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init',${JSON.stringify(tracking.metaPixelId)});fbq('track','PageView');`}
        </Script>
      )}
      {googleId && <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" />}
      {!needsConsent ? null : open ? (
        <section className="hk-consent" aria-label="Cookie preferences">
          <h2>Cookie preferences</h2>
          <p>
            We use {listNames(analyticsNames)} to see which pages are useful
            {adNames.length > 0 && `, and ${listNames(adNames)} to measure our ads and show them to previous visitors`}. Optional cookies stay off until you
            choose. <Link href="/cookies/">Cookies</Link>
          </p>
          {editing ? (
            <>
              <div className="hk-consent__options">
                <label>
                  <input type="checkbox" checked={draft.analytics} onChange={check('analytics')} /> Analytics cookies
                </label>
                <label>
                  <input type="checkbox" checked={draft.marketing} onChange={check('marketing')} /> Advertising cookies
                </label>
              </div>
              <div className="hk-consent__actions">
                <button type="button" className="btn" onClick={() => choose(draft)}>
                  Save choices
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hk-consent__actions">
                <button type="button" className="btn" onClick={() => choose({ analytics: true, marketing: true })}>
                  Accept optional
                </button>
                <button type="button" className="btn" onClick={() => choose(denied)}>
                  Reject optional
                </button>
              </div>
              <button type="button" className="hk-consent__manage" onClick={manage}>
                Manage choices
              </button>
            </>
          )}
        </section>
      ) : (
        <div className="container hk-consent__settings">
          <button type="button" onClick={manage}>
            Cookie settings
          </button>
        </div>
      )}
    </>
  );
}

function usePosthog(allowed: boolean) {
  const instance = useRef<PostHog | null>(null);
  useEffect(() => {
    const key = tracking.posthogKey;
    if (!allowed || !key) return;
    let cancelled = false;
    // Start promptly. Consented enquiries queue while the SDK downloads.
    void import('posthog-js')
      .then(({ default: posthog }) => {
        if (cancelled) return;
        if (!instance.current) {
          posthog.init(key, {
            api_host: posthogProxyPath,
            ui_host: `https://${tracking.posthogRegion}.posthog.com`,
            defaults: '2026-08-30',
            disable_session_recording: true,
            autocapture: false,
          });
          instance.current = posthog;
        }
        if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing();
        setPosthog(posthog);
      })
      .catch(() => {
        /* An unavailable analytics script must not break the site. */
      });
    return () => {
      cancelled = true;
      instance.current?.opt_out_capturing();
    };
  }, [allowed]);
}

/* Phone and email taps anywhere on the site count as enquiries (intent, not a confirmed call). */
function useLinkEnquiries() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (link) trackContactLink(link);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
}
