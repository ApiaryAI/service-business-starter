import { site } from './site';
export const company = site;
export const policyLinks = [
  { href: '/privacy/', label: 'Privacy' }, { href: '/terms/', label: 'Website terms' },
  { href: '/accessibility/', label: 'Accessibility' }, { href: '/cookies/', label: 'Cookies' },
];
export const nav = [{ href: '/services', label: 'Services' }, { href: '/projects', label: 'Projects' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }];
export const navLinks = (showGuides: boolean) => showGuides ? [...nav.slice(0,-1), { href: '/guides', label: 'Guides' }, nav[nav.length-1]] : nav;
export type ArtKind = 'maint' | 'repair' | 'parts';
export interface Service { id: string; title: string; summary: string; points: string[]; art: ArtKind; enquiry: string }
export const services: Service[] = [
 { id: 'maintenance-agreements', title: 'Maintenance', summary: 'Plan regular care around the equipment, property and scope you need.', points: ['Agreed scope', 'Planned access', 'Service records'], art: 'maint', enquiry: 'Ongoing maintenance agreement' },
 { id: 'repairs', title: 'Repairs', summary: 'Describe the problem and discuss assessment and repair options.', points: ['Clear problem description', 'Assessment before a diagnosis', 'Confirm availability'], art: 'repair', enquiry: 'Repair' },
 { id: 'improvements', title: 'Improvements', summary: 'Discuss practical improvements to existing equipment or property.', points: ['Existing conditions', 'Options and exclusions', 'Written proposal'], art: 'parts', enquiry: 'Improvement' },
];
export const serviceById = (id: string) => services.find(s => s.id === id)!;
