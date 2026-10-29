import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cta } from '../../../components/blocks';
import { formatDate } from '../../../lib/guides';
import { getArticle, getNews } from '../../../lib/news';
import { pageMetadata } from '../../../lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  const news = getNews();
  return news.length ? news.map(a => ({ slug: a.slug })) : [{ slug: 'none' }];
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? pageMetadata(`/news/${a.slug}/`, a.title, a.summary) : {};
}

export default async function Article({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return <>
    <article className="section"><div className="container hk-article__narrow">
      <p className="eyebrow"><Link href="/news/">News</Link> · <time dateTime={a.date}>{formatDate(a.date)}</time></p>
      <h1>{a.title}</h1><p className="lede">{a.summary}</p>
      {a.image && <img className="starter-project-image" src={a.image} alt={a.imageAlt} width={960} height={640} decoding="async" />}
      <div className="hk-article__body" dangerouslySetInnerHTML={{ __html: a.html }} />
    </div></article>
    <Cta />
  </>;
}
