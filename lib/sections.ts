import data from "../content/sections";
import { site } from "./site";

/* Optional website sections. Every section has `enabled`; set it to false to remove the section
   from pages, menus, the footer and the sitemap. Content for each section lives in content/sections.ts.
   Images and files are paths under public/, e.g. "/demo/project-1.jpg". */

export type SocialName = 'Facebook' | 'Instagram' | 'X' | 'Threads' | 'YouTube' | 'LinkedIn';
export interface Img {
  src: string;
  alt: string;
  caption?: string;
}
export interface Toggle {
  enabled: boolean;
}
export interface Copy extends Toggle {
  label: string;
  title: string;
  intro?: string;
}

export interface Sections {
  /** Services directory and service pages are always on; these switch the supporting areas. */
  projects: Toggle;
  clients: Toggle;
  guides: Toggle;
  /** A line staffed around the clock. Shows above the header, in the footer and on the contact page. */
  emergency: Toggle & {
    label: string;
    phone: string;
    tel: string;
    text: string;
  };
  /** ABN and trade licences: footer base line and the about page. */
  licences: Toggle & {
    abn?: string;
    items: { label: string; number: string }[];
  };
  /** Scrolling strip of sectors under the homepage hero. */
  industries: Copy & { items: string[] };
  /** Suburbs or regions served: about and contact pages. List areas; do not create a page per suburb. */
  serviceAreas: Copy & { areas: string[] };
  testimonials: Copy & {
    items: { quote: string; name: string; role?: string }[];
  };
  team: Copy & {
    members: { name: string; role: string; photo?: string; bio?: string }[];
  };
  awards: Copy & { items: { year: string; title: string; detail?: string }[] };
  /** Oldest milestone first. */
  history: Copy & { items: { year: string; title: string; text?: string }[] };
  downloads: Copy & {
    items: {
      title: string;
      description?: string;
      file: string;
      size?: string;
    }[];
  };
  safety: Copy & {
    paragraphs: string[];
    principles: { title: string; text: string }[];
    accreditations: {
      name: string;
      detail?: string;
      reference?: string;
      logo?: string;
    }[];
  };
  careers: Copy & {
    paragraphs: string[];
    benefits: string[];
    applyEmail: string;
    roles: {
      title: string;
      location?: string;
      type?: string;
      summary: string;
    }[];
    apprenticeships?: {
      title: string;
      paragraphs: string[];
      points?: string[];
      image?: Img;
    };
  };
  gallery: Copy & { images: Img[] };
  responsibility: Copy & {
    blocks: {
      id: string;
      label: string;
      title: string;
      paragraphs: string[];
      points?: string[];
      image?: Img;
    }[];
  };
  /** Equipment or plant catalogue: /fleet/ and /fleet/<slug>/. */
  fleet: Copy & {
    groups: {
      title: string;
      intro?: string;
      items: {
        slug: string;
        name: string;
        summary: string;
        description?: string[];
        image?: Img;
        models?: string[];
        features?: string[];
      }[];
    }[];
  };
  /** Company news from content/news/*.md: /news/ and /news/<slug>/. */
  news: Copy & { homeCount: number };
  /** Footer row of profile links, also listed as sameAs in the structured data. Icons in public/socials/. */
  socials: Toggle & { label: string; items: { name: SocialName; href: string }[] };
}

export const sections: Sections = data;
export type SectionKey = keyof Sections;
export const on = (key: SectionKey) => sections[key].enabled;

/** Pages that exist only while their section is enabled, in menu order. */
export const sectionPages = [
  { key: "safety", href: "/safety", label: "Safety & quality" },
  { key: "careers", href: "/careers", label: "Careers" },
  { key: "gallery", href: "/gallery", label: "Gallery" },
  { key: "responsibility", href: "/responsibility", label: "Responsibility" },
  { key: "news", href: "/news", label: "News" },
] as const satisfies readonly {
  key: SectionKey;
  href: string;
  label: string;
}[];
export const enabledPages = () => sectionPages.filter((p) => on(p.key));

/** One line for the footer base: ABN and licence numbers. */
export function licenceLine() {
  if (!on("licences")) return "";
  const s = sections.licences;
  return [
    s.abn && `ABN ${s.abn}`,
    ...s.items.map((l) => `${l.label} ${l.number}`),
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Profile URLs for structured data; demo links to platform home pages are left out. */
export const socialProfiles = (live: boolean) => (live && on('socials') ? sections.socials.items.map(s => s.href) : []);

if (site.readyForLaunch && on('socials') && sections.socials.items.some(s => new URL(s.href).pathname.replace(/\/$/, '') === '')) {
  throw new Error('Replace the demo social links (platform home pages) with the business profile URLs, or set socials.enabled to false.');
}
