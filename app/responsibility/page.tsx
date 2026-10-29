import { notFound } from 'next/navigation';
import { Cta, PageHero } from '../../components/blocks';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.responsibility;
export const metadata = pageMetadata('/responsibility/', s.title, s.intro ?? s.title);

export default function Responsibility() {
  if (!on('responsibility')) notFound();
  return <>
    <PageHero eyebrow={s.label} title={s.title} intro={s.intro} />
    {s.blocks.map((b, i) => <section key={b.id} id={b.id} className={`section${i % 2 ? ' section--tint' : ''}`} aria-labelledby={`sx-${b.id}`}><div className={`container${b.image ? ' sx-split' : ' hk-article__narrow'}`}>
      <div className="reveal"><p className="eyebrow">{b.label}</p><h2 className="starter-section-title" id={`sx-${b.id}`}>{b.title}</h2>{b.paragraphs.map(p => <p key={p}>{p}</p>)}{b.points && <ul>{b.points.map(p => <li key={p}>{p}</li>)}</ul>}</div>
      {b.image && <img className="reveal" src={b.image.src} alt={b.image.alt} width={960} height={640} loading="lazy" decoding="async" />}
    </div></section>)}
    <Cta />
  </>;
}
