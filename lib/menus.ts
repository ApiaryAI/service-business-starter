import { company } from './content';
import { navLinks } from './nav';
import { getGuides } from './guides';
import { servicePages } from './service-pages';
import { getProjects } from './projects';
import { enabledPages, on, sections } from './sections';
export interface MenuLink { href: string; label: string }
export interface Menu extends MenuLink { blurb: string; overview: string; items: MenuLink[] }
export function getMenus(showGuides: boolean): Menu[] {
 const details: Record<string, Omit<Menu, 'href' | 'label'>> = {
  '/services': { blurb: 'Find the service that fits your project.', overview: 'All services', items: servicePages.map(p => ({ href: `/services/${p.slug}/`, label: p.title })) },
  '/projects': { blurb: 'Completed work and places we look after.', overview: 'All projects', items: getProjects().slice(0,4).map(p => ({ href: `/projects/${p.slug}/`, label: p.title })) },
  '/guides': { blurb: 'Practical information for planning and comparing work.', overview: 'All guides', items: getGuides().filter(g => g.status === 'published').slice(0,6).map(g => ({ href: `/guides/${g.slug}/`, label: g.title })) },
  '/fleet': { blurb: sections.fleet.intro ?? '', overview: 'All equipment', items: sections.fleet.groups.flatMap(g => g.items).slice(0,6).map(i => ({ href: `/fleet/${i.slug}/`, label: i.name })) },
  '/about': { blurb: 'Learn about the people behind the work.', overview: 'About the business', items: [...(on('team') ? [{ href: '/about/#team', label: 'Our team' }] : []), ...(on('history') ? [{ href: '/about/#history', label: 'Our history' }] : []), ...enabledPages().map(p => ({ href: `${p.href}/`, label: p.label }))] },
  '/contact': { blurb: 'Share the details and photos of your project.', overview: 'Send an enquiry', items: [{ href: company.tel, label: `Call ${company.phone}` }, { href: `mailto:${company.email}`, label: 'Email the team' }] },
 };
 return navLinks(showGuides).map(link => ({ ...link, ...details[link.href] }));
}
