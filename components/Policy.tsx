import type { ReactNode } from 'react';
import { company, policyLinks } from '../lib/content';
import { PageHero } from './blocks';
import { PolicyNav } from './PolicyNav';

/* Website policies describe the current form, hosting and email processing.
   Update them whenever the implementation changes. Original business policies are separate. */
export const POLICY_UPDATED = '24 October 2026';

export function PolicyLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <section className="section">
        <div className="container hk-policy">
          <p className="hk-policy__meta">Last updated {POLICY_UPDATED}</p>
          <PolicyNav links={policyLinks} />
          <div className="hk-policy__body">{children}</div>
        </div>
      </section>
    </>
  );
}

export function PolicyContacts() {
  return (
    <ul>
      <li>Phone: <a href={company.tel}>{company.phone}</a></li>
      <li>Email: <a href={`mailto:${company.email}`}>{company.email}</a></li>
    </ul>
  );
}
