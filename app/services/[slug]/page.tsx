import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, PageHero } from '../../../components/blocks';
import { EnquiryPanel } from '../../../components/EnquiryPanel';
import { company } from '../../../lib/content';
import { pageMetadata, siteUrl } from '../../../lib/seo';
import { servicePages, servicePagePath } from '../../../lib/service-pages';
import { getGuides } from '../../../lib/guides';

export const dynamicParams = false;
export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages.find((item) => item.slug === slug);
  if (!page) notFound();
  return pageMetadata(servicePagePath(slug), page.title, page.description);
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const page = servicePages.find((item) => item.slug === slug);
  if (!page) notFound();
  const published = getGuides().filter((guide) => guide.status === 'published');
  const guides = (page.guides
    ? page.guides.map((slug) => published.find((guide) => guide.slug === slug)).filter((guide) => guide !== undefined)
    : published.filter((guide) => guide.services.includes(page.serviceId))
  ).slice(0, 3);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl(servicePagePath(slug))}#service`,
    name: page.title,
    description: page.description,
    url: siteUrl(servicePagePath(slug)),
    provider: { '@id': `${siteUrl()}#organization` },
    areaServed: { '@type': 'Place', name: company.region },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow={company.region} title={page.title} intro={page.intro}>
        <div className="hk-hero__actions">
          <a className="btn" href={company.tel}>Call {company.phone}</a>
          <a className="btn btn--ghost" href="#enquire">Enquire about this service <Arrow /></a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container hk-policy">
          <nav aria-label="Breadcrumb" className="hk-policy__nav">
            <Link href="/">Home</Link><Link href="/services/">Services</Link>
          </nav>
          <div className="hk-policy__body">
            {page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
            <h2>What to include in your enquiry</h2>
            <ul>{page.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            <h2>Common questions</h2>
            {page.questions.map((item) => <section key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></section>)}
            {guides.length > 0 && <nav aria-label="Related guides"><h2>Practical guides</h2><ul>{guides.map((guide) => <li key={guide.slug}><Link href={`/guides/${guide.slug}/`}>{guide.title}</Link></li>)}</ul></nav>}
            <h2>Related services</h2>
            <ul>{servicePages.filter((item) => item.slug !== slug).map((item) => <li key={item.slug}><Link href={servicePagePath(item.slug)}>{item.title}</Link></li>)}</ul>
          </div>
        </div>
      </section>
      {/* The enquiry form sits on the page itself, so visitors do not leave for /contact. */}
      <section className="section hk-service-enquiry" aria-label="Enquire about this service">
        <EnquiryPanel service={page.serviceId} page={{ slug: page.slug, title: page.title }} formId="enquire" />
      </section>
    </>
  );
}
