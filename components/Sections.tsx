import Link from "next/link";
import { sections, on } from "../lib/sections";
import { getProjects } from "../lib/projects";
import { getNews } from "../lib/news";
import { formatDate } from "../lib/guides";
import { Arrow } from "./blocks";

/* Optional section blocks. Each returns null while its section is switched off in content/sections.ts. */

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Head({
  label,
  title,
  intro,
  id,
}: {
  label: string;
  title: string;
  intro?: string;
  id: string;
}) {
  return (
    <>
      <p className="eyebrow reveal">{label}</p>
      <h2 className="starter-section-title reveal" id={id}>
        {title}
      </h2>
      {intro && <p className="hk-muted reveal">{intro}</p>}
    </>
  );
}

export function EmergencyBar() {
  if (!on("emergency")) return null;
  const e = sections.emergency;
  return (
    <div className="sx-emergency">
      <div className="container sx-emergency__inner">
        <strong>{e.label}</strong>
        <span>{e.text}</span>
        <a href={e.tel}>Call {e.phone}</a>
      </div>
    </div>
  );
}

export function Industries() {
  if (!on("industries")) return null;
  const s = sections.industries;
  const items = (hidden?: boolean) => (
    <ul
      className={`hk-ticker__track${hidden ? " hk-ticker__track--dup" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {s.items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
  return (
    <section className="hk-ticker" aria-label={s.title}>
      <div className="container"><p className="hk-ticker__label">{s.label}</p></div>
      <div className="hk-ticker__viewport">
        {items()}
        {items(true)}
      </div>
    </section>
  );
}

export function RecentProjects() {
  const projects = on("projects") ? getProjects().slice(0, 3) : [];
  if (!projects.length) return null;
  return (
    <section className="section">
      <div className="container">
        <Head label="Our work" title="Recent projects" id="sx-projects" />
        <ul className="starter-grid starter-projects">
          {projects.map((p) => (
            <li key={p.slug} className="reveal">
              {p.images[0] && (
                <img
                  className="starter-project-image"
                  src={p.images[0].src}
                  alt={p.images[0].alt}
                  width={960}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <p className="starter-project-kind">
                {p.workType === "ongoing"
                  ? "Ongoing service"
                  : "Completed work"}{" "}
                · {p.location}
              </p>
              <h3>
                <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
              </h3>
              <p>{p.summary}</p>
            </li>
          ))}
        </ul>
        <Link className="btn btn--ghost" href="/projects/">
          All projects <Arrow />
        </Link>
      </div>
    </section>
  );
}

export function Testimonials() {
  if (!on("testimonials")) return null;
  const s = sections.testimonials;
  return (
    <section className="section" aria-labelledby="sx-testimonials">
      <div className="container">
        <Head {...s} id="sx-testimonials" />
        <ul className="sx-quotes">
          {s.items.map((t) => (
            <li key={t.quote} className="reveal">
              <blockquote>
                <p>“{t.quote}”</p>
              </blockquote>
              <p className="sx-quotes__by">
                <strong>{t.name}</strong>
                {t.role && <span>{t.role}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LatestNews() {
  const news = getNews().slice(0, sections.news.homeCount);
  if (!news.length) return null;
  return (
    <section className="section" aria-labelledby="sx-news">
      <div className="container">
        <Head label={sections.news.label} title="Latest news" id="sx-news" />
        <NewsList articles={news} />
        <Link className="btn btn--ghost" href="/news/">
          All news <Arrow />
        </Link>
      </div>
    </section>
  );
}

export function NewsList({
  articles,
}: {
  articles: ReturnType<typeof getNews>;
}) {
  return (
    <ul className="starter-grid starter-projects">
      {articles.map((a) => (
        <li key={a.slug} className="reveal">
          {a.image && (
            <img
              className="starter-project-image"
              src={a.image}
              alt={a.imageAlt}
              width={960}
              height={640}
              loading="lazy"
              decoding="async"
            />
          )}
          <p className="starter-project-kind">
            <time dateTime={a.date}>{formatDate(a.date)}</time>
          </p>
          <h3>
            <Link href={`/news/${a.slug}/`}>{a.title}</Link>
          </h3>
          <p>{a.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export function Team() {
  if (!on("team")) return null;
  const s = sections.team;
  return (
    <section
      className="section section--tint"
      id="team"
      aria-labelledby="sx-team"
    >
      <div className="container">
        <Head {...s} id="sx-team" />
        <ul className="sx-team">
          {s.members.map((m) => (
            <li key={m.name} className="reveal">
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={`${m.name}, ${m.role}`}
                  width={600}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="sx-team__initials" aria-hidden="true">
                  {initials(m.name)}
                </span>
              )}
              <h3>{m.name}</h3>
              <p className="sx-team__role">{m.role}</p>
              {m.bio && <p>{m.bio}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function History() {
  if (!on("history")) return null;
  const s = sections.history;
  return (
    <section className="section" id="history" aria-labelledby="sx-history">
      <div className="container hk-article__narrow">
        <Head {...s} id="sx-history" />
        <ol className="hk-timeline">
          {s.items.map((m) => (
            <li key={m.year + m.title} className="hk-timeline__item reveal">
              <span className="hk-timeline__years">{m.year}</span>
              <div>
                <span className="hk-timeline__employer">{m.title}</span>
                {m.text && <p className="hk-muted">{m.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Awards() {
  if (!on("awards")) return null;
  const s = sections.awards;
  return (
    <section
      className="section section--tint"
      id="awards"
      aria-labelledby="sx-awards"
    >
      <div className="container">
        <Head {...s} id="sx-awards" />
        <ul className="starter-grid">
          {s.items.map((a) => (
            <li key={a.year + a.title} className="reveal">
              <p className="eyebrow">{a.year}</p>
              <h3>{a.title}</h3>
              {a.detail && <p>{a.detail}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Downloads() {
  if (!on("downloads")) return null;
  const s = sections.downloads;
  return (
    <section className="section" id="documents" aria-labelledby="sx-downloads">
      <div className="container">
        <Head {...s} id="sx-downloads" />
        <ul className="sx-docs">
          {s.items.map((d) => (
            <li key={d.file} className="reveal">
              <a href={d.file} download>
                <strong>{d.title}</strong>
                {d.description && <span>{d.description}</span>}
                <span className="sx-docs__meta">{d.size ?? "Download"} ↓</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceAreas() {
  if (!on("serviceAreas")) return null;
  const s = sections.serviceAreas;
  return (
    <section className="section" id="areas" aria-labelledby="sx-areas">
      <div className="container">
        <Head {...s} id="sx-areas" />
        <ul className="sx-chips">
          {s.areas.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Licences() {
  if (!on("licences")) return null;
  const s = sections.licences;
  return (
    <section
      className="section section--tint"
      id="licences"
      aria-labelledby="sx-licences"
    >
      <div className="container">
        <Head label="Licences" title="Licences and registration" id="sx-licences" />
        <dl className="hk-contact sx-licences">
          {s.abn && (
            <div>
              <dt>ABN</dt>
              <dd>{s.abn}</dd>
            </div>
          )}
          {s.items.map((l) => (
            <div key={l.label}>
              <dt>{l.label}</dt>
              <dd>{l.number}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
