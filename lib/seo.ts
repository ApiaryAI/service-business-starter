import type { Metadata } from 'next';
import { company } from './content';

export const SITE_URL = company.url.replace(/\/$/, "");
export const SITE_TITLE = `${company.tagline} | ${company.name}`;
export const SITE_DESCRIPTION = company.description;

// Vercel supplies this at build time. Local builds and previews stay excluded.
// NODE_ENV alone is insufficient: preview deployments also build in production mode.
export const IS_PRODUCTION_DEPLOYMENT = process.env.VERCEL_ENV === 'production' && company.readyForLaunch && !new URL(SITE_URL).hostname.endsWith('example.com');

// Preview shares must load their image from the preview, before the domain moves.
const IMAGE_BASE_URL = !IS_PRODUCTION_DEPLOYMENT && process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : SITE_URL;
const SOCIAL_IMAGE_URL = `${IMAGE_BASE_URL}/social.svg`;

export function siteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`}`;
}

export function pageMetadata(path: string, title: string, description: string, index = true): Metadata {
  const fullTitle = title === SITE_TITLE ? title : `${title} | ${company.name}`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(path) },
    robots: {
      index: IS_PRODUCTION_DEPLOYMENT && index,
      follow: IS_PRODUCTION_DEPLOYMENT,
    },
    openGraph: {
      type: 'website',
      locale: company.locale,
      siteName: company.name,
      url: siteUrl(path),
      title: fullTitle,
      description,
      images: [{ url: SOCIAL_IMAGE_URL, width: 1200, height: 630, alt: 'Service information and practical guides' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [SOCIAL_IMAGE_URL],
    },
  };
}

/** Only verified public company facts; no invented address, ratings or affiliations. */
export const businessStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: company.name,
      url: siteUrl(),
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
      telephone: company.tel.replace('tel:', ''),
      email: company.email,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: company.tel.replace('tel:', ''),
        email: company.email,
        contactType: 'Customer enquiries',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: siteUrl(),
      name: company.name,
      inLanguage: company.language,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};
