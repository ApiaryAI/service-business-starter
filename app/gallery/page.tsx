import { notFound } from 'next/navigation';
import { Cta, PageHero } from '../../components/blocks';
import { Gallery } from '../../components/Gallery';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.gallery;
export const metadata = pageMetadata('/gallery/', s.title, s.intro ?? s.title);

export default function GalleryPage() {
  if (!on('gallery')) notFound();
  return <><PageHero eyebrow={s.label} title={s.title} intro={s.intro} /><section className="section"><div className="container"><Gallery images={s.images} /></div></section><Cta /></>;
}
