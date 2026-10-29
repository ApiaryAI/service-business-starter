'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { company } from '../lib/content';
import type { Menu } from '../lib/menus';
import { Brand } from './Brand';

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);

/* On desktop each main link opens a dropdown on hover or keyboard focus (CSS, see .hk-drop).
   Escape closes it; it stays closed until the pointer or focus leaves that item. */

export function Header({ menus }: { menus: Menu[] }) {
  const path = norm(usePathname() ?? '/');
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
    setDismissed('');
    // A followed dropdown link keeps focus, which would hold its dropdown open on the new page.
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.hk-nav')) document.activeElement.blur();
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('menu-open');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open'); };
  }, [open]);

  const links = (
    <ul>
      {[{ href: '/', label: 'Home' }, ...menus].map((i) => (
        <li key={i.href} className={i.href === '/' ? 'hk-nav__home' : undefined}>
          <Link href={i.href} aria-current={path === i.href ? 'page' : undefined}>{i.label}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="hk-header">
      <div className="container hk-header__inner">
        <Brand />
        <nav className="hk-nav" aria-label="Main">
          <ul>
            {menus.map((m) => (
              <li
                key={m.href}
                className="hk-nav__item"
                data-dismissed={dismissed === m.href || undefined}
                onKeyDown={(e) => { if (e.key === 'Escape') setDismissed(m.href); }}
                onPointerLeave={() => setDismissed('')}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDismissed(''); }}
              >
                <Link href={m.href} aria-current={path === m.href ? 'page' : undefined} data-section={path.startsWith(m.href) || undefined}>
                  {m.label}
                  <svg className="hk-nav__chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg>
                </Link>
                <div className={`hk-drop${m.items.length > 6 ? ' hk-drop--wide' : ''}`}>
                  <div className="hk-drop__intro">
                    <p>{m.blurb}</p>
                    <Link href={m.href}>{m.overview} <span aria-hidden="true">→</span></Link>
                  </div>
                  {m.items.length > 0 && (
                    <ul className="hk-drop__links">
                      {m.items.map((i) => (
                        <li key={i.href}>
                          <Link href={i.href} aria-current={norm(i.href) === path ? 'page' : undefined}>{i.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        {/* Stays in the sticky header on every screen; phones show "Call" instead of the number. */}
        <a className="btn btn--small hk-header__call" href={company.tel} aria-label={`Call ${company.phone}`}>
          <span className="hk-led" aria-hidden="true" />
          <span className="hk-header__num">{company.phone}</span>
          <span className="hk-header__short" aria-hidden="true">Call</span>
        </a>
        <button
          ref={toggle}
          type="button"
          className="hk-menu-btn"
          aria-expanded={open}
          aria-controls="hk-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="hk-menu-btn__bars" aria-hidden="true"><i /><i /><i /></span>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div className="hk-header__rail" aria-hidden="true"><span /></div>
      <div id="hk-menu" className="hk-menu" hidden={!open}>
        <nav aria-label="Mobile">{links}</nav>
        <div className="hk-menu__foot">
          <a className="btn" href={company.tel}>Call {company.phone}</a>
          <a className="btn btn--ghost" href={`mailto:${company.email}`}>{company.email}</a>
        </div>
      </div>
    </header>
  );
}
