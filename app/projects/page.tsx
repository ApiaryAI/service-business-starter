import Link from 'next/link';
import { Arrow, Cta, PageHero } from '../../components/blocks';
import { getProjects } from '../../lib/projects';
import { servicePages } from '../../lib/service-pages';
import { pageMetadata } from '../../lib/seo';

export const metadata = pageMetadata('/projects/', 'Projects', 'Explore completed work and ongoing service projects.');

export default function Projects() {
  const projects = getProjects();
  return <>
    <PageHero eyebrow="Our work" title="Projects" intro="Completed work and places we look after. Explore the services involved and what each project needs." />
    <section className="section"><div className="container">
      {projects.length ? <ul className="starter-grid starter-projects">
        {projects.map(project => {
          const service = servicePages.find(service => service.slug === project.serviceSlug)!;
          return <li key={project.slug}>
            {project.images[0] ? <img className="starter-project-image" src={project.images[0].src} alt={project.images[0].alt} width={960} height={640} loading="lazy" decoding="async" /> : <div className="starter-project-placeholder" aria-hidden="true"><span>Project overview</span></div>}
            <p className="eyebrow">{project.example ? 'Example layout' : project.location || service.title}</p>
            <p className="starter-project-kind">{project.workType === 'ongoing' ? 'Ongoing service' : 'Completed work'}</p>
            <h2><Link href={`/projects/${project.slug}/`}>{project.title}</Link></h2>
            <p>{project.summary}</p>
            <Link href={`/projects/${project.slug}/`}>View project <Arrow /></Link>
          </li>;
        })}
      </ul> : <p>Project stories will be added here. <Link href="/services/">Explore our services</Link> or <Link href="/contact/">tell us about your project</Link>.</p>}
    </div></section>
    <Cta />
  </>;
}
