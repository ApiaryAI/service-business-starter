import { on, sections } from './sections';

/** Main navigation. Projects, Equipment and Guides appear only while their section is enabled. */
export const navLinks = (showGuides: boolean) => [
  { href: '/services', label: 'Services' },
  ...(on('projects') ? [{ href: '/projects', label: 'Projects' }] : []),
  ...(on('fleet') ? [{ href: '/fleet', label: sections.fleet.label }] : []),
  { href: '/about', label: 'About' },
  ...(showGuides && on('guides') ? [{ href: '/guides', label: 'Guides' }] : []),
  { href: '/contact', label: 'Contact' },
];
