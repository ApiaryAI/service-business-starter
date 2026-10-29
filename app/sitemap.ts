import type { MetadataRoute } from 'next';
import { getGuides, MIN_PUBLISHED, publishedCount } from '../lib/guides';
import { siteUrl } from '../lib/seo';
import { servicePages, servicePagePath } from '../lib/service-pages';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/services/', '/about/', '/contact/', '/privacy/', '/terms/', '/accessibility/', '/cookies/'];
  const guides = getGuides().filter((g) => g.status === 'published');
  pages.push(...servicePages.map((page) => servicePagePath(page.slug)));
  if (publishedCount() >= MIN_PUBLISHED) pages.push('/guides/');
  return [
    ...pages.map((path) => ({ url: siteUrl(path) })),
    ...guides.map((g) => ({ url: siteUrl(`/guides/${g.slug}/`), ...(g.updated ? { lastModified: g.updated } : {}) })),
  ];
}
