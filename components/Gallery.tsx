"use client";

import { useEffect, useRef, useState } from "react";
import type { Img } from "../lib/sections";

/* Photo grid; each photo opens in a native <dialog> lightbox (Escape closes, arrow keys move). */
export function Gallery({ images }: { images: Img[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index === null) {
      if (d.open) d.close();
    } else if (!d.open) d.showModal();
  }, [index]);

  const move = (step: number) =>
    setIndex((i) =>
      i === null ? i : (i + step + images.length) % images.length,
    );
  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="sx-gallery">
        {images.map((img, i) => (
          <li key={img.src} className="reveal">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </button>
            {img.caption && <p className="hk-muted">{img.caption}</p>}
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="sx-lightbox"
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        {current && (
          <figure>
            <img src={current.src} alt={current.alt} />
            {current.caption && <figcaption>{current.caption}</figcaption>}
          </figure>
        )}
        <div className="sx-lightbox__bar">
          <button
            type="button"
            className="btn btn--small"
            onClick={() => move(-1)}
          >
            ← Previous
          </button>
          <span aria-live="polite">
            {index === null ? "" : `${index + 1} of ${images.length}`}
          </span>
          <button
            type="button"
            className="btn btn--small"
            onClick={() => move(1)}
          >
            Next →
          </button>
          <button
            type="button"
            className="btn btn--small btn--ghost"
            onClick={() => setIndex(null)}
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
