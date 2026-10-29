import Link from 'next/link';
import { company } from '../lib/content';

export default function NotFound() {
  return (
    <section className="hk-404">
      <div className="container">
        <p className="hk-404__display" aria-hidden="true"><span>▼</span>404</p>
        <h1>This page is not here</h1>
        <p className="lede">The page you were looking for could not be found.</p>
        <div className="hk-hero__actions">
          <Link className="btn" href="/">Back to home</Link>
          <a className="btn btn--ghost" href={company.tel}>Call {company.phone}</a>
        </div>
      </div>
    </section>
  );
}
