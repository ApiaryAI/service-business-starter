<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Service business starter — instructions for AI agents

A new client site is made by changing content, not code. Read README.md first.

## Optional sections

The demo ships with **every optional section switched on** so the business can see what is
available. Each one is a block in `content/sections.ts` with `enabled: true | false`. When the
owner says which sections they don't want ("turn off fleet and news", "no careers page"), set
`enabled: false` on those blocks. Do not delete code, pages or CSS. A disabled section disappears
from pages, menus, the footer and the sitemap, and its page returns 404.

| Key | What it adds |
|---|---|
| `projects` | /projects/ from content/projects.json, homepage "Recent projects", service page links |
| `clients` | Client carousel on the homepage (content/clients.json) |
| `guides` | /guides/ from content/guides/*.md, homepage guides, service page guide links |
| `emergency` | 24/7 line: bar above the header, footer and contact page. Only for a line staffed around the clock |
| `licences` | ABN and licence numbers: footer base line and about page |
| `industries` | Scrolling sectors strip under the homepage hero |
| `serviceAreas` | Areas served on about and contact pages. List areas; never make a page per suburb |
| `testimonials` | Homepage quotes. Real, approved quotes only |
| `team` | About (#team) and careers; members without a photo show initials |
| `awards` | About (#awards) |
| `history` | Timeline on about (#history), oldest first |
| `downloads` | PDFs on about and safety pages, files in public/ |
| `safety` | /safety/ with principles and accreditations |
| `careers` | /careers/ with roles, benefits and an optional apprenticeship band |
| `gallery` | /gallery/ photo grid with a lightbox. The business's own photos only |
| `responsibility` | /responsibility/ sustainability, community, reconciliation blocks |
| `fleet` | /fleet/ equipment catalogue and /fleet/<slug>/ pages (plant hire, equipment) |
| `socials` | "Find us elsewhere" footer row with logos (public/socials/) and `sameAs` structured data. The business's own profile URLs only |
| `news` | /news/ from content/news/*.md (title, date, summary, image, image_alt) |

## Rules

- **Verified facts only.** Never invent staff, testimonials, awards, accreditations, licence
  numbers, history, clients or projects. If the business can't supply real content for a section,
  switch it off instead of leaving example text.
- Before `readyForLaunch: true`, every enabled section must contain real content: no "Example"
  text and no files from public/demo/. Delete public/demo/ once nothing references it.
- After changing sections run `npm run check`, then look at the home, about and contact pages.

## Homepage hero art

The right side of the homepage hero is an art slot (`components/HeroArt.tsx`), shown as a dark
placeholder panel in the demo. Replace it with an animated scene of the client's trade (e.g. a
lift diagram for a lift company): keep the `.sx-heroart` frame, keep the art `aria-hidden`,
animate only under `html.motion-on`, and remove the "Hero animation slot" label. The three
`heroFacts` under the hero buttons live in `lib/site.ts`; verified facts only.
