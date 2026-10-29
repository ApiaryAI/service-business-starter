import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import { on } from './sections';

/* Guides are Markdown files in content/guides/<slug>.md with a small front matter block.
   Drafts are visible in `next dev` only; a production build includes published guides alone,
   and refuses to publish a guide that still carries OWNER: or VERIFY: notes. */

const DIR = join(process.cwd(), 'content', 'guides');
const NOTE = /^(OWNER|VERIFY): /m;

export interface Guide {
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  published: string;
  updated: string;
  services: string[];
  related: string[];
  image: string;
  imageAlt: string;
  imageCaption: string;
  html: string;
  hasNotes: boolean;
}

export function frontMatter(raw: string, file: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const data: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  return { data, body: m[2] };
}

const list = (v = '') => v.split(',').map((s) => s.trim()).filter(Boolean);

/** Editorial notes and facts to verify render as highlighted boxes in drafts. */
function render(body: string) {
  return (marked.parse(body, { async: false }) as string).replace(
    /<p>(OWNER|VERIFY): ([\s\S]*?)<\/p>/g,
    (_, kind: string, text: string) =>
      `<aside class="hk-note hk-note--${kind.toLowerCase()}"><strong>${kind === 'OWNER' ? 'For the owner to add' : 'Owner to verify'}</strong> ${text}</aside>`,
  );
}

function load(): Guide[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, body } = frontMatter(readFileSync(join(DIR, file), 'utf8'), file);
      const guide: Guide = {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description,
        status: data.status === 'published' ? 'published' : 'draft',
        published: data.published,
        updated: data.updated || data.published,
        services: list(data.services),
        related: list(data.related),
        image: data.image || '',
        imageAlt: data.image_alt || '',
        imageCaption: data.image_caption || '',
        html: render(body),
        hasNotes: NOTE.test(body),
      };
      if (!guide.title || !guide.description) throw new Error(`${file}: title and description are required`);
      if (guide.image && (!/^\/guides\/[a-z0-9-]+\.svg$/.test(guide.image) || !guide.imageAlt || !guide.imageCaption)) {
        throw new Error(`${file}: guide diagram needs a local SVG, alternative text and caption`);
      }
      if (guide.status === 'published' && guide.hasNotes) {
        throw new Error(`${file}: published but still has OWNER: or VERIFY: notes. Resolve them or set status: draft.`);
      }
      return guide;
    });
}

const showDrafts = process.env.NODE_ENV !== 'production';

/** Guides visible in this build, newest first. */
export function getGuides(): Guide[] {
  if (!on('guides')) return [];
  return load()
    .filter((g) => showDrafts || g.status === 'published')
    .sort((a, b) => b.updated.localeCompare(a.updated));
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

/** The Guides section is only linked and indexed once it has enough real content. */
export const MIN_PUBLISHED = 3;
export const publishedCount = () => !on('guides') ? 0 : load().filter((g) => g.status === 'published').length;

/** Dates are stored as YYYY-MM-DD and shown in Australian style. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
