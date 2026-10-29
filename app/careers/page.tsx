import { notFound } from 'next/navigation';
import { Arrow, PageHero } from '../../components/blocks';
import { Team } from '../../components/Sections';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.careers;
export const metadata = pageMetadata('/careers/', s.title, s.intro ?? s.title);

export default function Careers() {
  if (!on('careers')) notFound();
  const a = s.apprenticeships;
  return <>
    <PageHero eyebrow={s.label} title={s.title} intro={s.intro} />
    <section className="section" aria-labelledby="cx-why"><div className="container sx-split cx-why">
      <div className="reveal">
        <p className="eyebrow">Working here</p>
        <h2 className="starter-section-title" id="cx-why">Why work with us</h2>
        {s.paragraphs.map(p => <p key={p} className="lede">{p}</p>)}
      </div>
      {s.benefits.length > 0 && <ul className="cx-ticks cx-benefits">{s.benefits.map(b => <li key={b} className="reveal">{b}</li>)}</ul>}
    </div></section>
    <section className="section section--tint" aria-labelledby="cx-roles"><div className="container">
      <p className="eyebrow">Open roles</p>
      <h2 className="starter-section-title" id="cx-roles">Current opportunities</h2>
      {s.roles.length > 0 && <p className="hk-muted">{s.roles.length === 1 ? '1 role open now.' : `${s.roles.length} roles open now.`}</p>}
      {s.roles.length > 0 && <ul className="cx-roles">{s.roles.map(r => <li key={r.title} className="reveal">
        <div>
          <h3>{r.title}</h3>
          {(r.location || r.type) && <ul className="cx-chips">{[r.location, r.type].filter(Boolean).map(t => <li key={t}>{t}</li>)}</ul>}
          <p>{r.summary}</p>
        </div>
        <a className="btn" href={`mailto:${s.applyEmail}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}>Apply now <Arrow /></a>
      </li>)}</ul>}
      <p className="cx-general">{s.roles.length ? 'Don’t see the right role?' : 'There are no open roles right now.'} <a href={`mailto:${s.applyEmail}?subject=General%20application`}>Send us your details</a> and we’ll keep them on file.</p>
    </div></section>
    {a && <section className="section sx-dark" id="apprenticeships" aria-labelledby="sx-apprentices"><div className="container sx-split">
      <div className="reveal"><p className="eyebrow">Apprenticeships</p><h2 className="starter-section-title" id="sx-apprentices">{a.title}</h2>{a.paragraphs.map(p => <p key={p}>{p}</p>)}
        {a.points && <ul className="cx-ticks cx-ticks--dark">{a.points.map(p => <li key={p}>{p}</li>)}</ul>}
        <a className="btn cx-apply" href={`mailto:${s.applyEmail}?subject=Apprenticeship%20application`}>Apply for an apprenticeship <Arrow /></a></div>
      {a.image && <img className="reveal cx-photo" src={a.image.src} alt={a.image.alt} width={960} height={640} loading="lazy" decoding="async" />}
    </div></section>}
    <Team />
  </>;
}
