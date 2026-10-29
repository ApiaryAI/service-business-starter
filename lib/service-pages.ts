import type { ArtKind } from './content';
export interface ServicePage {
 slug: string; title: string; description: string; intro: string; serviceId: string; art: ArtKind;
 sections: { title: string; text: string }[]; checklist: string[]; questions: { question: string; answer: string }[]; guides?: string[];
}
// These are illustrative starting points. Replace them with the business's actual services.
export const servicePages: ServicePage[] = [
 {
  slug: 'equipment-maintenance', title: 'Equipment maintenance', serviceId: 'maintenance-agreements', art: 'maint',
  description: 'Plan maintenance with a clear scope, available records and practical access arrangements.',
  intro: 'A useful maintenance arrangement starts with the equipment you have, how you use it and the work you need included.',
  sections: [
   { title: 'Start with your equipment and records', text: 'Gather the make, model and available service history. Explain how the equipment is used and identify any outstanding recommendations. Confirm that the provider supports your equipment before arranging a visit.' },
   { title: 'Agree what is included', text: 'Ask which visits, reports, labour and materials are covered. Keep additional repairs and out-of-hours work clear in the written proposal.' },
  ],
  checklist: ['Site location and access contact', 'Equipment details, if known', 'Available service records', 'The work you want included'],
  questions: [{ question: 'Can I request a maintenance quote?', answer: 'Send the equipment details and the scope you need. Availability, timing and pricing must be confirmed for the actual job.' }],
 },
 {
  slug: 'repair-assessment', title: 'Repair assessment', serviceId: 'repairs', art: 'repair',
  description: 'Prepare a clear repair enquiry with symptoms, timing, photos and access information.',
  intro: 'Explain what changed, when it started and how the problem affects normal use. An enquiry helps frame the job; it does not establish the cause.',
  sections: [
   { title: 'Describe what you have noticed', text: 'Record the symptoms and any messages visible from a normal operating area. Mention whether the issue repeats or happens under particular conditions.' },
   { title: 'Confirm the next step', text: 'Ask about assessment, access, quotation and availability. Do not attempt unfamiliar repairs or enter restricted spaces to gather information.' },
  ],
  checklist: ['Description of the problem', 'When the issue began', 'Photos taken from a safe, accessible area', 'A site contact and available records'],
  questions: [{ question: 'Can you diagnose the fault from a message?', answer: 'A description can help prepare for an assessment. The cause, repair scope and cost need to be confirmed for the actual installation.' }],
 },
 {
  slug: 'planned-improvements', title: 'Planned improvements', serviceId: 'improvements', art: 'parts',
  description: 'Discuss an improvement with a clear goal, existing conditions and a realistic scope.',
  intro: 'Tell us what you want to improve and the constraints at your property. Discuss the options before committing to work.',
  sections: [
   { title: 'Define the outcome', text: 'Explain the current situation, what you want to change and any access or scheduling constraints. Include photographs and existing documents where appropriate.' },
   { title: 'Compare proposals fairly', text: 'Ask for the proposed work, materials, exclusions and payment arrangements in writing. Check that each proposal covers the same outcome.' },
  ],
  checklist: ['The improvement you want', 'Existing equipment or property information', 'Access and timing constraints', 'Your questions about scope'],
  questions: [{ question: 'Does an enquiry commit me to work?', answer: 'An enquiry starts a discussion. Confirm the agreed work and terms before authorising a job.' }],
 },
];
export const servicePagePath = (slug: string) => `/services/${slug}/`;
