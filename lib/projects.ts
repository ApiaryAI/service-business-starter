import projectData from '../content/projects.json';
import { site } from './site';
import { servicePages } from './service-pages';
import { on } from './sections';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  location: string;
  serviceSlug: string;
  problem: string;
  work: string;
  outcome: string;
  status: 'draft' | 'published';
  workType: 'completed' | 'ongoing';
  example: boolean;
  images: { src: string; alt: string; caption?: string }[];
}

/** Examples appear only while the template's demonstration mode is enabled. */
export function getProjects(): Project[] {
  const projects = projectData as Project[];
  const slugs = new Set<string>();
  for (const project of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) {
      throw new Error('Project slugs must be unique, lowercase words separated by hyphens.');
    }
    slugs.add(project.slug);
    if (!['completed', 'ongoing'].includes(project.workType)) {
      throw new Error(`Project ${project.slug} must be completed work or an ongoing service project.`);
    }
    if (!servicePages.some(service => service.slug === project.serviceSlug)) {
      throw new Error(`Project ${project.slug} must link to an existing service page.`);
    }
    if (!project.title || !project.summary || !project.problem || !project.work || !project.outcome) {
      throw new Error(`Project ${project.slug} needs a title, summary, problem, work and outcome.`);
    }
    for (const image of project.images) {
      if (!image.src.startsWith('/projects/') || image.src.includes('..') || !image.alt) {
        throw new Error(`Project ${project.slug} photos need a local /projects/ path and alternative text.`);
      }
    }
  }
  if (!on('projects')) return [];
  return projects.filter(project => project.status === 'published' && (!project.example || !site.readyForLaunch));
}

export const getProject = (slug: string) => getProjects().find(project => project.slug === slug);
