import { notFound } from 'next/navigation';
import { Cta, PageHero } from '../../components/blocks';
import { Downloads } from '../../components/Sections';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.safety;
export const metadata = pageMetadata('/safety/', s.title, s.intro ?? s.title);

export default function Safety() {
  if (!on('safety')) notFound();
  return <>
    <PageHero eyebrow={s.label} title={s.title} intro={s.intro} />
    <section className="section"><div className="container hk-article__narrow">{s.paragraphs.map(p => <p key={p} className="reveal">{p}</p>)}</div></section>
    {s.principles.length > 0 && <section className="section section--tint"><div className="container"><ul className="starter-grid">{s.principles.map(p => <li key={p.title} className="reveal"><h2>{p.title}</h2><p>{p.text}</p></li>)}</ul></div></section>}
    {s.accreditations.length > 0 && <section className="section" aria-labelledby="sx-accreditations"><div className="container">
      <p className="eyebrow">Accreditations</p><h2 className="starter-section-title" id="sx-accreditations">Accreditations and memberships</h2>
      <ul className="sx-accred">{s.accreditations.map(a => <li key={a.name} className="reveal">
        {a.logo ? <img src={a.logo} alt="" width={96} height={96} loading="lazy" /> : <span className="sx-accred__seal" aria-hidden="true">✓</span>}
        <div><h3>{a.name}</h3>{a.detail && <p>{a.detail}</p>}{a.reference && <p className="hk-muted">Reference: {a.reference}</p>}</div>
      </li>)}</ul>
    </div></section>}
    <Downloads />
    <Cta />
  </>;
}
