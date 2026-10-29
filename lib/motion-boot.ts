/* Shared by the server layout and the client motion store, so it must not be a client module. */

/** Runs before first paint: decorative motion is on unless the device asks for reduced motion. */
export const motionBootScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-on')}catch(e){}`;
