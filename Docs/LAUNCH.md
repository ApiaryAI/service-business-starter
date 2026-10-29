# Launch a client site

## Content and branding

- Replace every example business field in `lib/site.ts`; use one HTTPS origin with no path, query or fragment.
- Supply verified service scope, service area, contact hours, staff facts, qualifications and images. Do not transfer another business's clients, testimonials or experience claims.
- Rewrite all example service pages and guides for the actual business. Keep URLs stable once published.
- Add logo, favicon and a raster social-sharing image; update `lib/seo.ts`.
- Review policies and any provider disclosures against actual processing and business practices.

## Receiving enquiries

- Without server credentials the form prepares an email for the visitor's own email app; it never claims server delivery.
- For direct delivery use a new Resend account/project, verify the sender domain and configure `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL` as server secrets. The recipient is owned by `lib/site.ts`, never the browser.
- Direct sending uses Vercel BotID. Keep the verification and body/attachment checks. Other hosting platforms need a separately reviewed bot-verification integration before enabling direct delivery.
- The server accepts the configured website origin and a Vercel preview origin. A local dev form uses port 3000; change the origin allowlist explicitly if you choose another dev port.
- Confirm mail delivery once on the actual production domain using an authorised test recipient. Unit tests mock delivery; they do not prove email reaches an inbox.

## Analytics

- Enable Web Analytics in the new Vercel project only when wanted. Optional PostHog/Google/Meta IDs remain blank until configured for that client.
- Ensure policies describe actual enabled providers. Cookie-based tools require the banner and appropriate visitor choices.
- Verify events once in the deployed dashboard. Mark/avoid internal test traffic when interpreting results.

## Indexing

- Keep `readyForLaunch: false` during setup. This excludes the demo from indexing and disables direct server mail even if credentials exist.
- Once verified, set `readyForLaunch: true`, confirm real contacts and content, and deploy in Vercel's production environment. A launch validation guard refuses placeholder contact/domain/area fields.
- Add the real domain in the new Vercel project. Configure its canonical host redirect there; the template includes no old-domain redirects.
- Run `npm run check`. Inspect the live canonical tags, noindex/index metadata, robots file and sitemap.
- Verify the new Search Console property, submit its sitemap and request indexing for key pages. Inclusion and ranking remain Google's decisions.
