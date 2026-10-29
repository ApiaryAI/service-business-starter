# Service Business Starter

A private reusable Next.js starter for service businesses: focused service pages, practical guides, clear contact routes and measurable enquiries.

## Start a new site

1. On GitHub choose **Use this template → Create a new repository**. Give each client a separate private repository.
2. Run `npm ci`, then `npm run dev`. The default site is a demonstration with example contacts, no outgoing server email and `noindex` metadata.
3. Edit **`lib/site.ts`**: business name, tagline, description, phone, email, service region, project categories and about text.
4. Edit **`lib/content.ts`** for service categories and enquiry options; **`lib/service-pages.ts`** for unique service pages. These are examples, not claims about a real business.
5. Replace the three example guides in **`content/guides/`**. Add verified firsthand information and service-specific images. Change publication/update dates only when appropriate.
6. Customise the colour variables in **`app/globals.css`**, `components/Brand.tsx`, `public/icon.svg`, `app/icon.svg` and `public/social.svg`. Supply a final PNG/JPEG social image and update `lib/seo.ts` for broad social platform compatibility. The `hk-` CSS prefix is inherited styling, not customer branding.
7. Review the website policy examples for the business's actual operations, enabled providers and jurisdiction. They are starting copy, not a complete business contract.
8. Follow [LAUNCH.md](Docs/LAUNCH.md). Run `npm run check` before release.

## Included

- A responsive homepage, service directory, about page and contact page.
- Three sample service detail pages with an enquiry form on each page.
- Three linked Markdown guides, article metadata and service links.
- Canonical URLs, Organization/WebSite/Service/Article data and sitemap/robots routes.
- Draft exclusion in production builds; publication blocked by unresolved `OWNER:` or `VERIFY:` notes.
- Accessible labels, keyboard menus, skip link and reduced-motion support.
- Direct enquiries via Resend and Vercel BotID, or an email-app preparation/review/copy flow without credentials.
- Up to four browser-resized JPEG photo attachments, with server-side type and size checks.
- Enquiry analytics with page and placement; consent controls for optional providers.
- 25 inherited behavioural checks covering form validation, fixed recipients, request verification, idempotency, attachments, privacy and tracking failures.

## Commands

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run check
```

Node 22 is used in CI. Dependencies are locked in `package-lock.json`. Content is maintained in Git; Markdown is trusted author input and must not come directly from untrusted visitors.

## Content pattern

A service page answers a buying need. A guide answers a specific question. Link each guide to the relevant service and each service to genuinely useful guides. Avoid duplicate suburb pages, unsupported claims and articles written only to fill a keyword list.

The guide front matter accepts `title`, `description`, `status`, `published`, `updated`, comma-separated `services` (category IDs), comma-separated `related` guide slugs, and optional `image`, `image_alt`, `image_caption`. Diagram assets live at `/guides/<slug>.svg`. Guides marked `draft` appear in development only. Published guides require valid dates and resolved editorial notes. Preview deployments remain excluded from indexing.

## Integration setup

Copy `.env.example` to `.env.local` only for your own new project. Never copy credentials, `.vercel` project links or analytics identifiers from another client. All optional provider IDs default blank. `lib/site.ts` holds public business data only. See [TRACKING.md](Docs/TRACKING.md) for event meanings.

## Provenance

Derived from the site architecture in `ApiaryAI/hiteck-lifts`, source commit `157cecc2e4ac5357eb68cac9b13b14874a8ceffc` (29 October 2026). This is a separate repository with a fresh history. The source site's customer logos, portraits, lift illustrations, lift articles, business contracts, Search Console token and deployment configuration are not included.

This private starter has no open-source licence grant. Confirm reuse rights before distributing it outside your organisation. Font files carry their included upstream SIL Open Font License notices in `public/fonts/`.

## What this does not prove

The source site's recorded enquiries demonstrate contact activity, not a controlled SEO experiment or a guarantee of future leads. Performance, rankings, traffic quality and commercial outcomes must be measured on each deployment. The original Hiteck site is not changed by this template.
