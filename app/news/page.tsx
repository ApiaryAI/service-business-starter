import { notFound } from 'next/navigation';
import { Cta, PageHero } from '../../components/blocks';
import { NewsList } from '../../components/Sections';
import { getNews } from '../../lib/news';
import { on, sections } from '../../lib/sections';
import { pageMetadata } from '../../lib/seo';

const s = sections.news;
export const metadata = pageMetadata('/news/', s.title, s.intro ?? s.title);

export default function News() {
  if (!on('news')) notFound();
  const news = getNews();
  return <><PageHero eyebrow={s.label} title={s.title} intro={s.intro} /><section className="section"><div className="container">{news.length ? <NewsList articles={news} /> : <p>News will be added here.</p>}</div></section><Cta /></>;
}
