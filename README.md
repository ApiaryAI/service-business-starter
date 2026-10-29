# Service Business Starter

A free Next.js website template for trades, construction and service businesses: service pages that rank, practical guides, projects, and an enquiry form on every page that emails the business directly.

**Live demo:** https://service-business-starter.vercel.app (every optional section switched on)

## What's included

- **Pages that bring in work:** homepage, a page per service with its own enquiry form, about, contact.
- **Guides:** Markdown articles linked to the services they support. Drafts stay out of the live site.
- **Projects:** completed jobs and sites the business looks after, each linked to a service.
- **Enquiries:** a form with up to four photos, sent straight to the business inbox through Resend, with bot protection from Vercel BotID. Without email set up, the form prepares the message in the visitor's own email app instead.
- **18 optional sections**, all switched on in the demo: 24/7 emergency bar, licences, sectors, service areas, testimonials, team, awards, history, documents, safety and accreditations, careers and apprenticeships, photo gallery, responsibility, equipment catalogue, news, client logos and social media links. Each one is a single `enabled` switch in `content/sections.ts`.
- **SEO basics done:** canonical URLs, sitemap, robots, structured data (Organization, Service, Article), and `noindex` until you launch.
- **Accessible and fast:** keyboard menus, skip link, reduced-motion support, static pages.

## Start a site

1. On GitHub choose **Use this template → Create a new repository**. Use one repository per business.
2. Run `npm ci`, then `npm run dev` and open http://localhost:3000.
3. Edit the business details in **`lib/site.ts`**.
4. Switch sections on or off in **`content/sections.ts`** and fill in the ones you keep with real details.
5. Replace the example services (`lib/content.ts`, `lib/service-pages.ts`), guides (`content/guides/`), projects (`content/projects.json`) and clients (`content/clients.json`).
6. Set your colours in `app/globals.css` and your logo in `components/Brand.tsx` and `public/`.
7. Replace the homepage hero art placeholder (`components/HeroArt.tsx`) with an animation of your trade, or a photo.
8. Follow **[Docs/LAUNCH.md](Docs/LAUNCH.md)** to connect Vercel, your domain and Resend, then go live.

Run `npm run check` before every release: typecheck, enquiry and tracking tests, production build and template checks.

## Using it with an AI agent

The template is built to be filled in by an AI coding agent. [AGENTS.md](AGENTS.md) tells the agent how to switch sections off, where every piece of content lives, and the rules: verified facts only, no invented staff, reviews, licences or projects.

## Going live: do it in this order

Build and get approval on a free preview first, connect the domain and email second, launch third, and tell Google last.

| Step | What to do | Why now |
|---|---|---|
| 1. Repository | **Use this template** on GitHub, one private repo per business | Each site has its own code and settings |
| 2. Vercel | Import the repo into a new Vercel project | Every push gets a free preview link |
| 3. Content | Fill in `lib/site.ts` and `content/sections.ts`, replace the examples | Real facts only; switch off what you don't have |
| 4. Approval | The business reviews the preview link | Nothing public yet; the preview is `noindex` |
| 5. Domain | Add it in Vercel and set the DNS records | If they already have email on the domain, leave the MX records alone |
| 6. Resend | Add the domain, add the SPF/DKIM records, wait for **Verified**, create an API key | Needs the domain's DNS from step 5 |
| 7. Keys | Set `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL` in Vercel | Turns on direct enquiry email |
| 8. Launch | Set the real `url` and `readyForLaunch: true`, push to `main` | The build refuses while any example details remain |
| 9. Test | Send a real enquiry with a photo from the live site | Proves email actually arrives |
| 10. Search Console | Verify the domain, submit `/sitemap.xml` | Google only sees the finished site |
| 11. Business Profile | Point the Google Business Profile at the new site | Sends local searchers to it |
| 12. Old site | Redirect every old page to its new page | Keeps existing Google rankings |

Resend is optional: without it, the form prepares the enquiry in the visitor's own email app. Full details for each step are in [Docs/LAUNCH.md](Docs/LAUNCH.md).

## Commands

```sh
npm ci            # install
npm run dev       # local site
npm run check     # everything before release
```

Node 22 is used in CI.

## Licence and credits

Released under the [MIT licence](LICENSE). Made by [Daniel Najda](https://danielnajda.com).

- Fonts (Libre Franklin, Sora) are under the SIL Open Font License; notices are in `public/fonts/`.
- Social media logos are from [SVGL](https://svgl.app) (sources in `public/socials/SOURCES.md`); the trademarks belong to their owners.
- Demo images in `public/demo/` are plain placeholders. Replace them with the business's own photos.
- The privacy, terms, cookies and accessibility pages are starting copy, not legal advice. Check them against how the business actually operates.
