import { notFound } from 'next/navigation';
import { PageHero } from '../../components/blocks';
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
    <section className="section"><div className="container hk-article__narrow">
      {s.paragraphs.map(p => <p key={p} className="reveal">{p}</p>)}
      {s.benefits.length > 0 && <><h2>Why work here</h2><ul>{s.benefits.map(b => <li key={b}>{b}</li>)}</ul></>}
    </div></section>
    <section className="section section--tint" aria-labelledby="sx-roles"><div className="container">
      <p className="eyebrow">Open roles</p><h2 className="starter-section-title" id="sx-roles">Current opportunities</h2>
      {s.roles.length ? <ul className="starter-grid">{s.roles.map(r => <li key={r.title} className="reveal">
        <h3>{r.title}</h3><p className="starter-project-kind">{[r.location, r.type].filter(Boolean).join(' · ')}</p><p>{r.summary}</p>
        <a href={`mailto:${s.applyEmail}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}>Apply by email</a>
      </li>)}</ul> : <p>There are no open roles right now. <a href={`mailto:${s.applyEmail}`}>Send us your details</a> and we will keep them on file.</p>}
    </div></section>
    {a && <section className="section sx-dark" id="apprenticeships" aria-labelledby="sx-apprentices"><div className="container sx-split">
      <div><p className="eyebrow">Apprenticeships</p><h2 className="starter-section-title" id="sx-apprentices">{a.title}</h2>{a.paragraphs.map(p => <p key={p}>{p}</p>)}
        {a.points && <ul>{a.points.map(p => <li key={p}>{p}</li>)}</ul>}
        <a className="btn" href={`mailto:${s.applyEmail}?subject=Apprenticeship%20application`}>Apply for an apprenticeship</a></div>
      {a.image && <img src={a.image.src} alt={a.image.alt} width={960} height={640} loading="lazy" decoding="async" />}
    </div></section>}
    <Team />
  </>;
}
