import { pageMetadata } from '../../lib/seo';
import { company } from '../../lib/content';
import { PageHero } from '../../components/blocks';
import { EnquiryPanel } from '../../components/EnquiryPanel';
import { ServiceAreas } from '../../components/Sections';
import { on, sections } from '../../lib/sections';
export const metadata = pageMetadata('/contact/', 'Contact', 'Share the details of your project and discuss the next step.');
export default function Contact() {
 const e = sections.emergency;
 return <>
  <PageHero eyebrow="Contact" title={`Talk to ${company.name}`} intro="Tell us what you need, share the details and confirm availability with the team.">
   {on('emergency') && <p className="sx-urgent reveal"><strong>{e.label}</strong> {e.text} <a href={e.tel}>Call {e.phone}</a></p>}
  </PageHero>
  <section className="section"><EnquiryPanel /></section>
  <ServiceAreas />
 </>;
}
