import type { MetadataRoute } from 'next';
import { getGuides, MIN_PUBLISHED, publishedCount } from '../lib/guides';
import { siteUrl } from '../lib/seo';
import { servicePages, servicePagePath } from '../lib/service-pages';
import { getProjects } from '../lib/projects';
import { getNews } from '../lib/news';
import { enabledPages, on, sections } from '../lib/sections';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/services/', ...(on('projects') ? ['/projects/'] : []), '/about/', '/contact/', '/privacy/', '/terms/', '/accessibility/', '/cookies/'];
  const guides = getGuides().filter((g) => g.status === 'published');
  pages.push(...servicePages.map((page) => servicePagePath(page.slug)));
  pages.push(...getProjects().filter(project => !project.example).map(project => `/projects/${project.slug}/`));
  pages.push(...enabledPages().map((p) => `${p.href}/`));
  if (on('fleet')) pages.push('/fleet/', ...sections.fleet.groups.flatMap((g) => g.items).map((i) => `/fleet/${i.slug}/`));
  pages.push(...getNews().map((a) => `/news/${a.slug}/`));
  if (publishedCount() >= MIN_PUBLISHED) pages.push('/guides/');
  return [
    ...pages.map((path) => ({ url: siteUrl(path) })),
    ...guides.map((g) => ({ url: siteUrl(`/guides/${g.slug}/`), ...(g.updated ? { lastModified: g.updated } : {}) })),
  ];
}
