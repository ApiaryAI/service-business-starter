import { company, services } from './content';

export const PROJECT_TYPES: readonly string[] = company.projectTypes;

/* "How did you find us?" is optional. The answer only appears in the email the visitor sends;
   nothing is stored or tracked. Choices marked `detail` show a short follow-up box. */
export const SOURCES: { label: string; detail?: string; hint?: string }[] = [
  { label: 'Google search' },
  { label: 'Google Maps' },
  { label: 'AI assistant or AI search answer', detail: 'Which one? (optional)', hint: 'e.g. ChatGPT, Google AI, Gemini, Copilot, Claude' },
  { label: 'Recommended by someone', detail: 'Who recommended us? (optional)' },
  { label: 'Our property manager' },
  { label: 'Already a client' },
  { label: 'Saw your business details' },
  { label: 'Facebook or other social media' },
  { label: 'Online directory', detail: 'Which directory? (optional)' },
  { label: 'Other', detail: 'Please tell us (optional)' },
];

export interface Fields {
  name: string;
  phone: string;
  email: string;
  location: string;
  projectType: string;
  service: string;
  message: string;
  source: string;
  sourceDetail: string;
}

export const EMPTY: Fields = { name: '', phone: '', email: '', location: '', projectType: PROJECT_TYPES[0], service: services[0].enquiry, message: '', source: '', sourceDetail: '' };

/** `page` is the title of the service page the enquiry was sent from, if any; `photos` is the number attached. */
export function compose(f: Fields, page?: string, photos = 0) {
  const subject = `${f.service} enquiry: ${f.projectType}${f.location ? `, ${f.location}` : ''}`;
  const body = [
    `Hello ${company.name},`,
    '',
    f.message.trim(),
    '',
    `Service: ${f.service}`,
    `Project type: ${f.projectType}`,
    `Site location: ${f.location || 'Not provided'}`,
    '',
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email || 'Not provided'}`,
    ...(photos ? ['', `Photos attached: ${photos}`] : []),
    ...(page ? ['', `Sent from: ${page} page`] : []),
    ...(f.source ? ['', `How I found the business: ${f.source}${f.sourceDetail.trim() ? ` (${f.sourceDetail.trim()})` : ''}`] : []),
  ].join('\n');
  return { subject, body };
}

