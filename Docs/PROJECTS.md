# Completed work and ongoing service projects

The **Projects** navigation item appears in the desktop menu, mobile menu and footer. The directory at `/projects/` links to a detail page for each published entry.

## Add a project

Edit `content/projects.json` and add an object using the existing examples as the field reference:

- `slug`: unique lowercase URL words separated by hyphens.
- `title`, `summary`, `location`: public description and general service area.
- `serviceSlug`: an existing slug from `lib/service-pages.ts`.
- `workType`: `completed` for a finished job or `ongoing` for a site currently serviced.
- `problem`: the original issue or what the site needs.
- `work`: work carried out or the current service scope.
- `outcome`: confirmed result or the ongoing service arrangement.
- `images`: a list of `{ "src": "/projects/job-photo.jpg", "alt": "Describe the photo", "caption": "Optional caption" }`. Place these files under `public/projects/`.
- `status`: `draft` keeps the entry off the website; `published` makes a real project visible.
- `example`: keep `true` for template demonstrations; set `false` only after replacing every example field with a genuine project.

Use job photographs and business/customer details you have permission to publish. Do not present an enquiry or quotation as completed work. Keep results, responsibilities and the description of ongoing services accurate.

## Display and publishing

Completed projects show **The problem → The work → The outcome**. Ongoing service projects show **What the site needs → Our service scope → The service arrangement**.

The two supplied examples are visibly labelled as layouts, have no customer photographs and appear only in demonstration mode (`readyForLaunch: false`). They are always excluded from the sitemap and have `noindex` metadata. Drafts are never shown. Real published project URLs enter the sitemap and follow the website's production indexing gate.

Each project links to its relevant service landing page. Its enquiry form preselects that service and analytics record the current project pathname. Enquiries do not disclose the project content to analytics.

This is a Git-managed portfolio, not a browser admin form or job-management database. Save edits locally to preview with `npm run dev`; deploy saved content through the normal Git workflow.
