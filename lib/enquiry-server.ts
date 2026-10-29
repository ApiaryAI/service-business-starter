import { createHash } from 'node:crypto';
import { SITE_URL } from './seo';
import { company, services } from './content';
import { compose, PROJECT_TYPES, SOURCES, type Fields } from './enquiry';
import { servicePages } from './service-pages';
import { MAX_PHOTOS, PHOTO_MAX_BYTES } from './photos';

// Text alone stays small; the allowance covers up to four shrunk photos, under Vercel's 4.5 MB limit.
const MAX_BODY = 4_400_000;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FIELD_LIMITS: Record<keyof Fields, number> = {
  name: 100, phone: 40, email: 254, location: 200, projectType: 80,
  service: 100, message: 1500, source: 100, sourceDetail: 120,
};

interface Config {
  apiKey?: string;
  from?: string;
  origins: string[];
  verifyBot: () => Promise<{ isBot: boolean }>;
  fetch?: typeof fetch;
  log?: (status: number) => void;
}

function reply(status: number, error?: string) {
  return Response.json(error ? { ok: false, error } : { ok: true }, {
    status, headers: { 'Cache-Control': 'no-store' },
  });
}

async function readBody(request: Request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid');
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY) { await reader.cancel(); throw new Error('too_large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
}

/** Photos are base64 JPEGs made by the form. Anything else, too many or too large, is rejected. */
function readPhotos(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_PHOTOS) return null;
  for (const photo of value) {
    if (typeof photo !== 'string' || !BASE64.test(photo)) return null;
    const bytes = Buffer.from(photo, 'base64');
    if (bytes.length > PHOTO_MAX_BYTES || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return null;
  }
  return value as string[];
}

function validate(input: unknown): { fields: Fields; page?: string; photos: string[]; requestId: string } | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const data = input as Record<string, unknown>;
  const fields = {} as Fields;
  for (const key of Object.keys(FIELD_LIMITS) as (keyof Fields)[]) {
    if (typeof data[key] !== 'string' || data[key].length > FIELD_LIMITS[key]) return null;
    const value = data[key].trim();
    // Only the message may contain line breaks. No control characters enter headers.
    if ((key === 'message' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value)) return null;
    fields[key] = value;
  }
  if (fields.name.length < 2 || !/^[0-9+().\s-]{6,40}$/.test(fields.phone) || fields.message.length < 10) return null;
  if (fields.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email)) return null;
  if (!PROJECT_TYPES.includes(fields.projectType)) return null;
  if (![...services.map((s) => s.enquiry), 'General enquiry'].includes(fields.service)) return null;
  if (fields.source && !SOURCES.some((s) => s.label === fields.source)) return null;
  if (typeof data.requestId !== 'string' || !UUID.test(data.requestId)) return null;
  // Optional: the service page the form was sent from, as a slug. Only known pages are accepted.
  let page: string | undefined;
  if (data.page !== undefined && data.page !== '') {
    page = servicePages.find((p) => p.slug === data.page)?.title;
    if (!page) return null;
  }
  const photos = readPhotos(data.photos);
  if (!photos) return null;
  return { fields, page, photos, requestId: data.requestId };
}

/** Recipient and provider URL are server-owned; callers cannot turn this into a mail relay. */
export function createEnquiryHandler(config: Config) {
  return async (request: Request) => {
    if (request.method !== 'POST') return reply(405, 'Method not allowed.');
    const origin = request.headers.get('origin');
    if (!origin || !config.origins.includes(origin)) return reply(403, 'Please use the website enquiry form.');
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, 'Expected JSON.');
    try {
      const verification = await config.verifyBot();
      if (verification.isBot !== false) return reply(403, 'Browser verification failed. Please reload the page or email or call us.');
    } catch {
      // Verification outages must never fall through to email delivery.
      return reply(503, 'Browser verification is unavailable. Please try again or email or call us.');
    }
    let input: unknown;
    try { input = await readBody(request); }
    catch (error) { return reply(error instanceof Error && error.message === 'too_large' ? 413 : 400, 'Invalid enquiry.'); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, 'Invalid enquiry.');
    const trap = (input as Record<string, unknown>).website;
    if (typeof trap !== 'string') return reply(400, 'Invalid enquiry.');
    // Do not pretend a trapped submission was sent: return an error without contacting Resend.
    if (trap.trim()) return reply(400, 'Invalid enquiry.');
    const validated = validate(input);
    if (!validated) return reply(400, 'Please check your enquiry details.');
    if (!config.apiKey || !config.from) return reply(503, 'Online enquiries are temporarily unavailable. Please email or call us.');
    const { fields, page, photos, requestId } = validated;
    const { subject, body } = compose(fields, page, photos.length);
    const payload = {
      from: config.from,
      to: [company.email],
      subject,
      text: `Website enquiry from ${SITE_URL}/\n\n${body}`,
      ...(fields.email ? { reply_to: fields.email } : {}),
      // File names are set here; nothing the visitor named reaches the email.
      ...(photos.length ? { attachments: photos.map((content, i) => ({ filename: `photo-${i + 1}.jpg`, content })) } : {}),
    };
    // A retry uses the same key; different content cannot poison that request's result.
    const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    try {
      const response = await (config.fetch ?? fetch)('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json',
          'Idempotency-Key': `enquiry/${requestId}/${digest}`,
        },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        config.log?.(response.status);
        return reply(response.status === 429 ? 429 : 502, 'Your enquiry could not be sent. Please try again or call us.');
      }
      const result = await response.json() as { id?: unknown };
      if (typeof result.id !== 'string' || !result.id) throw new Error('invalid_provider_response');
      return reply(200);
    } catch {
      config.log?.(502);
      return reply(502, 'Your enquiry could not be sent. Please try again or call us.');
    }
  };
}
