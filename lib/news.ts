import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import { frontMatter } from './guides';
import { on } from './sections';

/* Company news: one Markdown file per article in content/news/<slug>.md, with
   title, date (YYYY-MM-DD), summary and optional image + image_alt front matter. */

const DIR = join(process.cwd(), 'content', 'news');

export interface Article { slug: string; title: string; date: string; summary: string; image: string; imageAlt: string; html: string }

/** Articles newest first; none while the news section is switched off. */
export function getNews(): Article[] {
  if (!on('news')) return [];
  return readdirSync(DIR).filter(f => f.endsWith('.md')).map(file => {
    const { data, body } = frontMatter(readFileSync(join(DIR, file), 'utf8'), file);
    if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '') || !data.summary) throw new Error(`${file}: news needs a title, YYYY-MM-DD date and summary`);
    if (data.image && !data.image_alt) throw new Error(`${file}: news image needs image_alt`);
    return { slug: file.replace(/\.md$/, ''), title: data.title, date: data.date, summary: data.summary, image: data.image || '', imageAlt: data.image_alt || '', html: marked.parse(body, { async: false }) as string };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export const getArticle = (slug: string) => getNews().find(a => a.slug === slug);
