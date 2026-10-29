import { pageMetadata } from '../../lib/seo';
import { company } from '../../lib/content';
import { PageHero } from '../../components/blocks';
import { EnquiryPanel } from '../../components/EnquiryPanel';
export const metadata = pageMetadata('/contact/', 'Contact', 'Share the details of your project and discuss the next step.');
export default function Contact() { return <><PageHero eyebrow="Contact" title={`Talk to ${company.name}`} intro="Tell us what you need, share the details and confirm availability with the team." /><section className="section"><EnquiryPanel /></section></>; }
