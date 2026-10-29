import { PolicyLayout, PolicyContacts } from '../../components/Policy';
import { pageMetadata } from '../../lib/seo';
export const metadata = pageMetadata('/accessibility/', 'Accessibility', 'Accessibility information for this website.');
export default function Page() { return <PolicyLayout eyebrow="Website information" title="Accessibility" intro="Information about using this website."><h2>Using this site</h2><p>The site includes a skip link, labelled form controls, keyboard-accessible navigation and reduced-motion support. Essential content is available without animation.</p><h2>Getting help</h2><p>If you cannot use part of the site, contact the business by phone or email. Describe the page and the difficulty so an alternative can be arranged.</p><PolicyContacts /></PolicyLayout>; }
