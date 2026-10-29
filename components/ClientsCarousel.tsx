'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Client } from '../lib/clients';

const TAU = Math.PI * 2;

/* Reusable client-card carousel. With motion on, the cards glide round a
   tilted ellipse, always upright. They pause while the pointer is over them; keyboard users can
   focus the carousel and press Space or Enter to pause. With motion off (html.motion-on absent, or no JS) the
   same cards sit in a static grid. */
export function ClientsCarousel({ clients, label = 'Clients', secondsPerClient = 3.2 }: { clients: Client[]; label?: string; secondsPerClient?: number }) {
  const n = clients.length;
  const uid = useId();
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const hoverRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const el = root.current;
    if (!el || n < 2) return;
    const html = document.documentElement;
    if (!html.classList.contains('motion-on')) return;
    let angle = 0; // in card positions
    let last = 0;
    let raf = 0;
    let onScreen = true;
    const place = () => {
      let front = 0, best = -2;
      for (let i = 0; i < n; i++) {
        const theta = ((i - angle) / n) * TAU;
        const c = Math.cos(theta);
        const li = cards.current[i];
        if (!li) continue;
        li.style.setProperty('--s', Math.sin(theta).toFixed(4));
        li.style.setProperty('--c', c.toFixed(4));
        li.style.zIndex = String(Math.round((c + 1) * 50));
        if (c > best) { best = c; front = i; }
      }
      cards.current.forEach((li, i) => li?.classList.toggle('is-front', i === front));
    };
    const frame = (t: number) => {
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
      last = t;
      if (!pausedRef.current && !hoverRef.current && onScreen && !document.hidden && html.classList.contains('motion-on')) {
        angle = (angle + dt / secondsPerClient) % n;
        place();
      }
      raf = requestAnimationFrame(frame);
    };
    place();
    raf = requestAnimationFrame(frame);
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; last = 0; }, { threshold: 0.05 }) : null;
    io?.observe(el);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [n, secondsPerClient]);

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    setStatus(pausedRef.current ? 'Client cards paused.' : 'Client cards rotating.');
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget || (e.key !== ' ' && e.key !== 'Enter')) return;
    e.preventDefault();
    togglePaused();
  };

  if (!n) return null;
  return (
    <div
      ref={root}
      className={`hk-clients ${paused ? 'is-paused' : 'is-playing'}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      aria-describedby={`${uid}-help`}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerEnter={() => { hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
    >
      <p className="visually-hidden" id={`${uid}-help`}>
        {n} client cards rotate automatically. Press Space or Enter while the carousel is focused to pause or resume.
      </p>
      <div className="hk-clients__stage">
        <svg className="hk-clients__orbit" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="400" cy="130" rx="380" ry="96" />
          <ellipse className="hk-clients__orbit-dash" cx="400" cy="130" rx="380" ry="96" />
        </svg>
        <ul className="hk-clients__ring">
          {clients.map((c, i) => {
            const theta = (i / n) * TAU;
            return (
              <li
                key={c.name}
                ref={(el) => { cards.current[i] = el; }}
                className={`hk-clients__card${i === 0 ? ' is-front' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${c.name}`}
                style={{ '--s': Math.sin(theta).toFixed(4), '--c': Math.cos(theta).toFixed(4), zIndex: Math.round((Math.cos(theta) + 1) * 50) } as CSSProperties}
              >
                <span className="hk-clients__face">
                  {c.logo && (
                    <span className={`hk-clients__logo-wrap${c.logo.dark ? ' hk-clients__logo-wrap--dark' : ''}`}>
                      <img className="hk-clients__logo" src={c.logo.src} alt="" width={c.logo.width} height={c.logo.height} loading="lazy" decoding="async" />
                    </span>
                  )}
                  <span className="hk-clients__name">{c.name}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="visually-hidden" aria-live="polite">{status}</p>
    </div>
  );
}
