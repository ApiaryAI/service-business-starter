import { pageMetadata } from '../../../lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Arrow, Cta } from '../../../components/blocks';
import { company, serviceById } from '../../../lib/content';
import { siteUrl } from '../../../lib/seo';
import { servicePages, servicePagePath } from '../../../lib/service-pages';
import { formatDate, getGuide, getGuides } from '../../../lib/guides';

// Every published guide is prebuilt; unknown addresses and unpublished drafts are 404s.
export const dynamicParams = false;

// Retain a not-found placeholder when the library has no published guides.
const NONE = 'none';

export function generateStaticParams() {
  const slugs = getGuides().map((g) => ({ slug: g.slug }));
  return slugs.length ? slugs : [{ slug: NONE }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    ...pageMetadata(`/guides/${guide.slug}/`, guide.title, guide.description, guide.status === 'published'),
    authors: [{ name: company.name, url: '/about/' }],
    openGraph: { ...pageMetadata(`/guides/${guide.slug}/`, guide.title, guide.description).openGraph, type: 'article', publishedTime: guide.published, modifiedTime: guide.updated, authors: [company.name] },
    ...(guide.status === 'draft' ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const related = guide.related.map((slug) => getGuide(slug)).filter((g) => g !== undefined);
  const services = guide.services.map(serviceById).filter(Boolean);

  // Company authorship: do not imply personal review without evidence.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: { '@type': 'Organization', name: company.name, url: siteUrl('/about/') },
    publisher: { '@type': 'Organization', name: company.name, '@id': `${siteUrl()}#organization` },
    mainEntityOfPage: siteUrl(`/guides/${guide.slug}/`),
    url: siteUrl(`/guides/${guide.slug}/`),
    ...(guide.image ? { image: new URL(guide.image, siteUrl()).href } : {}),
  };

  return (
    <>
      <article className="hk-article">
        <header className="hk-article__head">
          <div className="container hk-article__narrow">
            {guide.status === 'draft' && (
              <p className="hk-draft-banner">Draft: only visible on this computer. Not included in production builds.</p>
            )}
            <p className="eyebrow"><Link href="/guides/">Guides</Link></p>
            <h1>{guide.title}</h1>
            <p className="hk-article__byline">
              A guide from <Link href="/about/">{company.name}</Link> · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </p>
          </div>
        </header>
        <div className="container hk-article__narrow">
          {guide.image && (
            <figure className="hk-guide-figure">
              <Image src={guide.image} alt={guide.imageAlt} width={760} height={620} unoptimized />
              <figcaption>{guide.imageCaption} <a href={guide.image} target="_blank" rel="noopener noreferrer">View larger diagram</a></figcaption>
            </figure>
          )}
          <div className="hk-article__body" dangerouslySetInnerHTML={{ __html: guide.html }} />

          {services.length > 0 && (
            <aside className="hk-article__help" aria-label="Related services">
              <h2>Need a hand?</h2>
              <p>{company.name} can help with this. Call <a href={company.tel}>{company.phone}</a> or read more:</p>
              <ul>
                {services.map((s) => {
                  const page = servicePages.find((item) => item.serviceId === s.id);
                  return <li key={s.id}><Link href={page ? servicePagePath(page.slug) : `/services/#${s.id}`}>{s.title} <Arrow /></Link></li>;
                })}
              </ul>
            </aside>
          )}

          {related.length > 0 && (
            <nav className="hk-article__related" aria-label="Related guides">
              <h2>Related guides</h2>
              <ul>
                {related.map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}/`}>{g.title} <Arrow /></Link></li>)}
              </ul>
            </nav>
          )}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </article>
      <Cta />
    </>
  );
}
