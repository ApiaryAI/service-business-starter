import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, PageHero } from '../../../components/blocks';
import { EnquiryPanel } from '../../../components/EnquiryPanel';
import { getProject, getProjects } from '../../../lib/projects';
import { servicePages, servicePagePath } from '../../../lib/service-pages';
import { pageMetadata } from '../../../lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  const projects = getProjects();
  return projects.length ? projects.map(project => ({ slug: project.slug })) : [{ slug: 'none' }];
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata(`/projects/${project.slug}/`, project.title, project.summary, !project.example);
}

export default async function ProjectDetail({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const service = servicePages.find(service => service.slug === project.serviceSlug)!;
  return <>
    <PageHero eyebrow={project.example ? 'Example project layout' : project.location || 'Our work'} title={project.title} intro={project.summary} />
    <section className="section"><div className="container hk-policy">
      <nav className="hk-policy__nav" aria-label="Breadcrumb"><Link href="/">Home</Link><Link href="/projects/">Projects</Link></nav>
      <div className="hk-policy__body">
        {project.example && <p className="hk-draft-banner">This is an example layout, not a completed customer job.</p>}
        <p className="eyebrow">{project.workType === 'ongoing' ? 'Ongoing service' : 'Completed work'}</p>
        <h2>{project.workType === 'ongoing' ? 'What the site needs' : 'The problem'}</h2><p>{project.problem}</p>
        <h2>{project.workType === 'ongoing' ? 'Our service scope' : 'The work'}</h2><p>{project.work}</p>
        {project.images.length > 0 && <div className="starter-project-gallery">{project.images.map(image => <figure key={image.src}><img className="starter-project-image" src={image.src} alt={image.alt} width={960} height={640} loading="lazy" decoding="async" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>}
        <h2>{project.workType === 'ongoing' ? 'The service arrangement' : 'The outcome'}</h2><p>{project.outcome}</p>
        <aside className="hk-article__help"><h2>Need similar work?</h2><p>Find out what is involved and what information helps when you enquire.</p><Link href={servicePagePath(service.slug)}>{service.title} <Arrow /></Link></aside>
      </div>
    </div></section>
    <section className="section" aria-label="Enquire about similar work"><EnquiryPanel service={service.serviceId} /></section>
  </>;
}
