import Link from 'next/link';
import { company, services } from '../lib/content';
import { servicePages, servicePagePath } from '../lib/service-pages';
import { getGuides } from '../lib/guides';
import { Arrow, Cta } from '../components/blocks';
import { Clients } from '../components/Clients';
import { Industries, LatestNews, RecentProjects, Testimonials } from '../components/Sections';
import { on } from '../lib/sections';
export default function Home() {
 const guides = !on('guides') ? [] : getGuides().filter(g => g.status === 'published').slice(0,3);
 return <>
  <section className="hk-hero starter-hero"><div className="container starter-hero-grid">
   <div><p className="eyebrow">{company.region}</p><h1>{company.tagline}</h1><p className="lede">{company.description}</p>
    <div className="hk-hero__actions"><Link className="btn" href="/contact/">Tell us what you need <Arrow /></Link><Link className="btn btn--ghost" href="/services/">Explore services</Link></div>
   </div>
   <div className="starter-process" aria-label="From first question to agreed work"><span className="eyebrow">A clearer next step</span>{[['01','Describe the need','Share what you have noticed and what you want to achieve.'],['02','Discuss the options','Clarify the scope, availability and information needed.'],['03','Agree the work','Confirm the proposal before authorising the job.']].map(([n,title,text]) => <div className="starter-step" key={n}><span>{n}</span><div><h2>{title}</h2><p>{text}</p></div></div>)}</div>
  </div></section>
  <Industries />
  <section className="section"><div className="container"><p className="eyebrow">What we do</p><h2 className="starter-section-title">The right starting point for your project.</h2><ul className="starter-grid">{services.map(s => <li key={s.id}><h3>{s.title}</h3><p>{s.summary}</p><Link href={servicePagePath(servicePages.find(p => p.serviceId === s.id)!.slug)}>Service details <Arrow /></Link></li>)}</ul></div></section>
  <RecentProjects />
  <Clients />
  <Testimonials />
  {guides.length > 0 && <section className="section starter-tint"><div className="container"><p className="eyebrow">Before you enquire</p><h2 className="starter-section-title">Useful information. Less guesswork.</h2><ul className="starter-grid">{guides.map(g => <li key={g.slug}><h3><Link href={`/guides/${g.slug}/`}>{g.title}</Link></h3><p>{g.description}</p><Link href={`/guides/${g.slug}/`}>Read the guide <Arrow /></Link></li>)}</ul></div></section>}
  <LatestNews />
  <Cta />
 </>;
}
