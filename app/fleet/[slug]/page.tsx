import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '../../../components/blocks';
import { EnquiryPanel } from '../../../components/EnquiryPanel';
import { on, sections } from '../../../lib/sections';
import { pageMetadata } from '../../../lib/seo';

const items = () => (on('fleet') ? sections.fleet.groups.flatMap(g => g.items) : []);
export const dynamicParams = false;
export function generateStaticParams() {
  const all = items();
  return all.length ? all.map(i => ({ slug: i.slug })) : [{ slug: 'none' }];
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = items().find(i => i.slug === slug);
  return item ? pageMetadata(`/fleet/${item.slug}/`, item.name, item.summary) : {};
}

export default async function FleetItem({ params }: Props) {
  const { slug } = await params;
  const item = items().find(i => i.slug === slug);
  if (!item) notFound();
  return <>
    <PageHero eyebrow={sections.fleet.label} title={item.name} intro={item.summary} />
    <section className="section"><div className={`container${item.image ? ' sx-split' : ' hk-article__narrow'}`}>
      <div>
        {item.description?.map(p => <p key={p}>{p}</p>)}
        {item.models && <><h2>Models</h2><ul>{item.models.map(m => <li key={m}>{m}</li>)}</ul></>}
        {item.features && <><h2>Features</h2><ul>{item.features.map(f => <li key={f}>{f}</li>)}</ul></>}
        <p><Link href="/fleet/">← All equipment</Link></p>
      </div>
      {item.image && <img src={item.image.src} alt={item.image.alt} width={960} height={640} decoding="async" />}
    </div></section>
    <section className="section" aria-label="Enquire about this equipment"><EnquiryPanel page={{ slug: `fleet/${item.slug}`, title: item.name }} /></section>
  </>;
}
