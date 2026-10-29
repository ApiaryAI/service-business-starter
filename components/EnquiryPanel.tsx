import { ContactList } from './blocks';
import { Enquiry } from './Enquiry';
import { company } from '../lib/content';

/** Contact details beside the enquiry form. Used on the contact page and on every service page. */
/** `formId` lets a button jump straight to the form, which follows the contact card on narrow screens. */
export function EnquiryPanel({ service, page, formId }: { service?: string; page?: { slug: string; title: string }; formId?: string }) {
  const enabled = company.readyForLaunch && Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL);
  return (
    <div className="container hk-contact-layout">
      <aside className="hk-contact-card reveal" aria-label="Contact details">
        <ContactList />
        <a className="btn hk-contact-card__call" href={company.tel}>Call {company.phone}</a>
        <p className="hk-safety">{company.phoneHours}. An online enquiry does not confirm a booking. Contact the team to confirm availability.</p>
      </aside>
      <div className="hk-contact-form reveal" id={formId}>
        <h2>{enabled ? 'Send an enquiry' : 'Prepare an email enquiry'}</h2>
        <Enquiry enabled={enabled} service={service} page={page} />
      </div>
    </div>
  );
}
