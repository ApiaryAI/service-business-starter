import { company } from '../../lib/content';
import { PageHero, Cta } from '../../components/blocks';
import { Awards, Downloads, History, Licences, ServiceAreas, Team } from '../../components/Sections';
import { on } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';
export const metadata = pageMetadata('/about/', 'About', 'Learn about the business and the people behind the work.');
export default function About() {
 return <>
  <PageHero eyebrow="About" title={company.name} intro={company.about} />
  <section className="section"><div className="container hk-policy"><h2>A clear conversation before work begins</h2><p>Discuss the job, who will attend and what the proposed work includes. Ask about relevant experience, qualifications and available records for your project.</p>{!on('serviceAreas') && <><h2>Where we work</h2><p>{company.region}</p></>}</div></section>
  <Team /><History /><Awards /><ServiceAreas /><Licences /><Downloads /><Cta />
 </>;
}
