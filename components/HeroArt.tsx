/* Homepage hero art slot, beside the hero copy (for example, an animated lift diagram for a lift company).
   Replace this placeholder with an animated scene of the client's trade: keep the
   .sx-heroart frame so the hero layout stays the same, mark the art aria-hidden, and run
   animation only under html.motion-on so reduced-motion visitors see a still frame. */
export function HeroArt() {
  const floors = [0, 1, 2, 3, 4];
  return (
    <div className="sx-heroart reveal" aria-hidden="true">
      <svg viewBox="0 0 440 500" role="presentation">
        <defs>
          <pattern
            id="sx-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path d="M20 0H0V20" />
          </pattern>
        </defs>
        <rect
          className="sx-heroart__grid"
          width="440"
          height="500"
          fill="url(#sx-grid)"
        />
        <path className="sx-heroart__draw" d="M70 430V170L220 80l150 90v260Z" />
        {floors.map((i) => (
          <g
            key={i}
            className="sx-heroart__floor"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <rect x="100" y={370 - i * 48} width="240" height="34" rx="3" />
            <text x="88" y={392 - i * 48} textAnchor="end">
              {i === 0 ? "G" : i}
            </text>
          </g>
        ))}
        <path className="sx-heroart__ground" d="M30 430H410" />
      </svg>
      <p>Hero animation slot · components/HeroArt.tsx</p>
    </div>
  );
}
