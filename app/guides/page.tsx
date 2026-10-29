import { pageMetadata } from '../../lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { on } from '../../lib/sections';
import { Arrow, Cta, PageHero } from '../../components/blocks';
import { formatDate, getGuides, MIN_PUBLISHED, publishedCount } from '../../lib/guides';

export const metadata: Metadata = pageMetadata(
  '/guides/',
  'Practical guides',
  'Practical guides to preparing an enquiry, comparing a scope and planning a service visit.',
  publishedCount() >= MIN_PUBLISHED,
);

export default function Guides() {
  if (!on('guides')) notFound();
  const guides = getGuides();
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title={<>Practical guides for <span className="hk-hl">your next project</span></>}
        intro="Prepare an enquiry, understand a proposal and plan the next step."
      />
      <section className="section">
        <div className="container">
          {guides.length === 0 ? (
            <p className="hk-muted">New guides are on the way.</p>
          ) : (
            <ul className="hk-guides">
              {guides.map((g) => (
                <li key={g.slug} className="hk-guide-card reveal">
                  <Link href={`/guides/${g.slug}/`}>
                    {g.image && <Image className="hk-guide-card__image" src={g.image} alt="" width={760} height={620} unoptimized />}
                    {g.status === 'draft' && <span className="hk-draft-tag">Draft</span>}
                    <h2>{g.title}</h2>
                    <p>{g.description}</p>
                    <span className="hk-guide-card__meta">Updated {formatDate(g.updated)} <Arrow /></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Cta />
    </>
  );
}
