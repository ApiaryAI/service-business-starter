'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);

/** Tabs between the four policy pages, marking the current one. */
export function PolicyNav({ links }: { links: { href: string; label: string }[] }) {
  const path = norm(usePathname() ?? '/');
  return (
    <nav className="hk-policy__nav" aria-label="Policies">
      {links.map((l) => (
        <Link key={l.href} href={l.href} aria-current={path === norm(l.href) ? 'page' : undefined}>{l.label}</Link>
      ))}
    </nav>
  );
}
