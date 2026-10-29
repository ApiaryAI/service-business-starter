import Link from 'next/link';
import { company } from '../../lib/content';
import { servicePages, servicePagePath } from '../../lib/service-pages';
import { PageHero, Arrow, Cta } from '../../components/blocks';
import { pageMetadata } from '../../lib/seo';
export const metadata = pageMetadata('/services/', 'Services', 'Explore maintenance, repairs and planned improvement services.');
export default function Services() { return <><PageHero eyebrow={company.region} title="Find the service you need" intro="Start with the work you are considering. Each service explains what to discuss and what information helps." /><section className="section"><div className="container"><ul className="starter-grid">{servicePages.map(p => <li key={p.slug} id={p.serviceId}><h2><Link href={servicePagePath(p.slug)}>{p.title}</Link></h2><p>{p.description}</p><Link href={servicePagePath(p.slug)}>Service details <Arrow /></Link></li>)}</ul></div></section><Cta /></>; }
