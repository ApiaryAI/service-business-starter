const assert = require('node:assert/strict');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
function files(dir) { return readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(join(dir,e.name)) : [join(dir,e.name)]); }
const branded = /hightechlifts|hitecklifts|Hiteck|Mietek|Najda|9293[ -]?8100|dgKCBRcxWl3R19rWCzIBOT8xx6LnpAitigeBtHT799E/i;
for (const dir of ['app','components','lib','content','public']) for (const f of files(dir)) {
 if (/[.](woff2|png|jpg|webp|ico)$/.test(f)) continue;
 assert(!branded.test(readFileSync(f,'utf8')), `Inherited customer identity in ${f}`);
}
assert(!existsSync('.vercel'), 'Never commit a client deployment link');
for (const f of ['.env','.env.local','.env.production','.env.production.local']) assert(!existsSync(f), `Unexpected environment file: ${f}`);
const root = '.next/server/app';
const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json','utf8'));
const routes = new Set(Object.keys(manifest.routes).map(r => r === '/' ? '/' : r.replace(/[/]$/,'')));
const pages = files(root).filter(f => f.endsWith('.html') && !f.endsWith('_global-error.html'));
assert(pages.length >= 12, 'Expected pre-rendered service, guide and website pages');
for (const f of pages) {
 const html = readFileSync(f,'utf8');
 assert(!branded.test(html), `Inherited identity in built ${f}`);
 const isDemo = readFileSync('lib/site.ts','utf8').includes('readyForLaunch: false');
 if (isDemo) assert(/name="robots" content="[^"]*noindex/.test(html), `Demo must stay noindex: ${f}`);
 for (const match of html.matchAll(/href="([/][^"#?]*)[^"]*"/g)) {
  const path = match[1].replace(/[/]$/,'') || '/';
  if (path.startsWith('/_next/') || path.startsWith('//')) continue;
  assert(routes.has(path) || existsSync(join('public',path)) || existsSync(join('app',path)), `Broken internal link ${path} in ${f}`);
 }
}
const sitemap = readFileSync(join(root,'sitemap.xml.body'),'utf8');
const projectData = JSON.parse(readFileSync('content/projects.json','utf8'));
const realProjects = projectData.filter(p => p.status === 'published' && !p.example);
for (const project of projectData) for (const image of project.images) {
 assert(existsSync(join('public', image.src)), `Missing project photo ${image.src}`);
}
for (const client of JSON.parse(readFileSync('content/clients.json','utf8'))) {
 if (client.logo) assert(existsSync(join('public', client.logo.src)), `Missing client logo ${client.logo.src}`);
}
assert((sitemap.match(/<loc>/g)||[]).length === 16 + realProjects.length, 'Expected 10 main/policy routes, 3 services, 3 guides and real published projects');
for (const project of projectData.filter(p => p.example || p.status !== 'published')) {
 assert(!sitemap.includes(`/projects/${project.slug}/`), 'Example and draft projects must not enter the sitemap');
}
assert(!sitemap.includes('draft-example'), 'Draft must not enter sitemap');
console.log(`Template checks passed: ${pages.length} rendered pages, internal links, demo noindex, identity scan and sitemap.`);
