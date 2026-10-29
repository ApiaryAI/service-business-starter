import Link from 'next/link';
import { company, services } from '../lib/content';
import { servicePages, servicePagePath } from '../lib/service-pages';
import { getGuides } from '../lib/guides';
import { Arrow, Cta } from '../components/blocks';
import { Clients } from '../components/Clients';
import { HeroArt } from '../components/HeroArt';
import { Industries, LatestNews, RecentProjects, Testimonials } from '../components/Sections';
import { on } from '../lib/sections';
export default function Home() {
 const guides = !on('guides') ? [] : getGuides().filter(g => g.status === 'published').slice(0,3);
 return <>
  <section className="hk-hero starter-hero" aria-labelledby="hero-title"><div className="container hk-hero__grid">
   <div className="hk-hero__copy">
    <p className="eyebrow reveal">{company.region}</p><h1 id="hero-title" className="reveal">{company.tagline}</h1><p className="lede reveal">{company.description}</p>
    <div className="hk-hero__actions reveal"><a className="btn" href={company.tel}>Call {company.phone}</a><Link className="btn btn--ghost" href="/contact/">Start an enquiry <Arrow /></Link></div>
    {company.heroFacts.length > 0 && <dl className="hk-readouts hk-readouts--hero reveal">{company.heroFacts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>}
   </div>
   <HeroArt />
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
