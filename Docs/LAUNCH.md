# Launch a site

Work in this order: build and approve on a free preview first, connect the domain and email
second, launch third, and tell Google only once the site is live.

## 1. Build (no domain needed)

1. **Repository:** on GitHub choose **Use this template**, one private repository per business.
2. **Vercel:** create a new project and import that repository. Every push gives a preview link
   such as `business-name.vercel.app`. Vercel's free Hobby plan is for non-commercial use;
   business sites need a Pro team.
3. **Content:** fill in `lib/site.ts`, switch sections in `content/sections.ts`, and replace the
   example services, guides, projects, clients, logo, colours and hero art. Verified facts only.
4. **Approval:** the business reviews the preview link. It stays `noindex` until launch.

## 2. Domain and email

5. **Domain:** add it in Vercel (Project → Settings → Domains) and add the DNS records Vercel shows
   at the registrar. If the business already receives email on that domain, change only the
   website records (A / CNAME) and leave the MX records alone, or their email stops.
6. **Resend:** create an account, add the domain, add Resend's SPF and DKIM records in the same
   DNS settings, and wait for **Verified**. Then create an API key.
7. **Vercel environment variables** (Production): `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL`
   (for example `website@business.com.au`, on the verified domain). Enquiries go to the `email`
   in `lib/site.ts`, never an address from the browser. Use a new Resend project and fresh
   analytics IDs for every business; never copy keys or `.vercel` links between sites.

Without Resend the site still works: the form prepares the enquiry in the visitor's own email app.

## 3. Launch

8. **Switch on:** set the real `url` and `readyForLaunch: true` in `lib/site.ts` and push to
   `main`. The build refuses to go live while example contacts, domains, addresses or social
   links remain. Remove `public/demo/` once nothing uses it.
9. **Test enquiry:** send one real enquiry with a photo from the live domain and confirm it reaches
   the inbox. Unit tests mock delivery; they don't prove an email arrives.

## 4. Tell Google (only once live)

10. **Search Console:** verify the domain, submit `/sitemap.xml` and request indexing for the
    homepage and service pages.
11. **Google Business Profile:** point its website link at the new site.
12. **Old website:** if the business had one on another domain, redirect every old page to the
    matching new page so existing rankings carry over.

## Analytics (optional)

Vercel Web Analytics is cookieless and switched on in the Vercel dashboard. PostHog, Google
Analytics, Google Ads and Meta IDs in `.env.example` stay blank until wanted; setting any of them
turns on the cookie banner, so update the privacy and cookies pages first. See
[TRACKING.md](TRACKING.md) for event meanings.
