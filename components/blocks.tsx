import Link from 'next/link';
import type { ReactNode } from 'react';
import { company, navLinks, policyLinks } from '../lib/content';
import { Brand } from './Brand';

export const Arrow = () => <span className="btn-arrow" aria-hidden="true">→</span>;

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <header className="hk-phero">
      <div className="container hk-phero__inner">
        <div>
          <p className="eyebrow reveal">{eyebrow}</p>
          <h1 className="reveal">{title}</h1>
          {intro && <p className="lede reveal">{intro}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}

export function ContactList({ compact = false }: { compact?: boolean }) {
  return (
    <dl className={`hk-contact${compact ? ' hk-contact--compact' : ''}`}>
      <div><dt>Phone</dt><dd><a href={company.tel}>{company.phone}</a></dd></div>
      <div><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
    </dl>
  );
}

export function Cta({ title = 'Tell us about your project', text }: { title?: string; text?: string }) {
  return (
    <section className="hk-cta">
      <div className="container hk-cta__inner">
        <div>
          <h2 className="reveal">{title}</h2>
          <p className="reveal">{text ?? 'Call the team or send the details of your project.'}</p>
        </div>
        <div className="hk-cta__actions reveal">
          <a className="btn" href={company.tel}>Call {company.phone}</a>
          <Link className="btn btn--ghost" href="/contact">Start an enquiry <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

export function Footer({ showGuides = false }: { showGuides?: boolean }) {
  return (
    <footer className="hk-footer">
      <div className={`container hk-footer__grid${company.offices.length ? ' hk-footer__grid--offices' : ''}`}>
        <div>
          <Brand size="lg" />
          <p className="hk-footer__line">{company.description}</p>
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 className="hk-footer__head" id="footer-explore">Explore</h2>
          <ul className="hk-footer__links">
            {[{ href: '/', label: 'Home' }, ...navLinks(showGuides)].map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h2 className="hk-footer__head">Get in touch</h2>
          <ul className="hk-footer__links">
            <li><a href={company.tel}>{company.phone}</a></li>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
          </ul>
        </div>
        {company.offices.length > 0 && (
          <div>
            <h2 className="hk-footer__head">{company.offices.length > 1 ? 'Offices' : 'Office'}</h2>
            <ul className="hk-footer__offices">
              {company.offices.map((o) => (
                <li key={o.name}>
                  <span className="hk-footer__tag">{o.tag}</span>
                  <address><strong>{o.name}</strong>{o.lines.map((l) => <span key={l}>{l}</span>)}</address>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="container hk-footer__base">
        <span>© {company.name}</span>
        <nav aria-label="Legal">
          <ul className="hk-footer__legal">
            {policyLinks.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
