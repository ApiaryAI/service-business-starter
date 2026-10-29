import { site } from '../../../lib/site';
import { createEnquiryHandler } from '../../../lib/enquiry-server';
import { SITE_URL } from '../../../lib/seo';
import { checkBotId } from 'botid/server';

export const runtime = 'nodejs';
export const maxDuration = 15;

export async function POST(request: Request) {
  const origins = [SITE_URL];
  if (process.env.VERCEL_ENV !== 'production' && process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV === 'development') origins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  return createEnquiryHandler({
    apiKey: site.readyForLaunch ? process.env.RESEND_API_KEY : undefined,
    from: process.env.ENQUIRY_FROM_EMAIL,
    origins,
    verifyBot: () => checkBotId({ advancedOptions: { checkLevel: 'basic' } }),
    // Deliberately log no submission fields, addresses, API responses or credentials.
    log: (status) => console.error('Enquiry delivery provider failed', { status }),
  })(request);
}
