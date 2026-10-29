'use client';

import { useSyncExternalStore } from 'react';

/* Decorative CSS animation only runs under html.motion-on, which the inline script in
   app/layout.tsx sets before first paint unless the visitor's device asks for reduced motion.
   This keeps the class in step if that setting changes while the page is open. */

const read = () => document.documentElement.classList.contains('motion-on');

function subscribe(listener: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = () => {
    document.documentElement.classList.toggle('motion-on', !mq.matches);
    listener();
  };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** True when motion is enabled. Always false during server render and hydration. */
export function useMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
