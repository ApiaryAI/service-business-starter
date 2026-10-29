import type { MetadataRoute } from 'next';
import { IS_PRODUCTION_DEPLOYMENT, SITE_URL } from '../lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return IS_PRODUCTION_DEPLOYMENT
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` }
    // Crawlers need access to read the preview's noindex meta tag/header.
    : { rules: { userAgent: '*', allow: '/' } };
}
