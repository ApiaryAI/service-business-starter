import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, Cta, PageHero } from '../../components/blocks';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.fleet;
export const metadata = pageMetadata('/fleet/', s.title, s.intro ?? s.title);

export default function Fleet() {
  if (!on('fleet')) notFound();
  return <>
    <PageHero eyebrow={s.label} title={s.title} intro={s.intro} />
    {s.groups.map(g => <section key={g.title} className="section" aria-label={g.title}><div className="container">
      <h2 className="starter-section-title">{g.title}</h2>{g.intro && <p className="hk-muted">{g.intro}</p>}
      <ul className="starter-grid starter-projects">{g.items.map(item => <li key={item.slug} className="reveal">
        {item.image ? <img className="starter-project-image" src={item.image.src} alt={item.image.alt} width={960} height={640} loading="lazy" decoding="async" /> : <div className="starter-project-placeholder" aria-hidden="true"><span>{item.name}</span></div>}
        <h3><Link href={`/fleet/${item.slug}/`}>{item.name}</Link></h3><p>{item.summary}</p>
        <Link href={`/fleet/${item.slug}/`}>Details <Arrow /></Link>
      </li>)}</ul>
    </div></section>)}
    <Cta title="Need equipment for your job?" />
  </>;
}
