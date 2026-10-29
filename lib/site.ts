/** Replace the example details and content before setting readyForLaunch to true. */
export const site = {
  readyForLaunch: false,
  url: 'https://example.com',
  name: 'Your Service Business',
  tagline: 'Clear answers. Practical service.',
  description: 'Maintenance, repair and improvement services, with practical information to help you plan the next step.',
  phone: '0000 000 000',
  tel: 'tel:+61000000000',
  email: 'enquiries@example.com',
  region: 'Your service area',
  locale: 'en_AU',
  language: 'en-AU',
  phoneHours: 'Contact hours to be confirmed',
  projectTypes: ['Commercial property', 'Residential property', 'Shared property', 'Other equipment', 'Other project', 'Not sure'],
  about: 'Explain who does the work, the services you actually provide and the areas you cover. Add verified experience and qualifications before launch.',
} as const;

if (site.readyForLaunch) {
  const origin = new URL(site.url);
  if (origin.protocol !== 'https:' || origin.origin !== site.url || origin.hostname === 'example.com' || origin.hostname.endsWith('.example.com') || site.email.endsWith('@example.com') || site.phone === '0000 000 000' || site.name === 'Your Service Business' || site.region === 'Your service area') {
    throw new Error('Replace all example business contacts, area and HTTPS origin before launch.');
  }
}
