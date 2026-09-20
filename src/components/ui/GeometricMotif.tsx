import { useId } from "react";

interface GeometricMotifProps {
  className?: string;
  /** Tile size in user units. Smaller tiles read as texture, larger as pattern. */
  scale?: number;
}

/**
 * The one identity gesture: an eight point khatim star built from two
 * overlapping squares, linked by small diamonds. It appears in four places
 * only (hero edge, Haji divider, verification panel, footer) and never behind
 * body copy, so it binds the brand without becoming wallpaper.
 */
export function GeometricMotif({ className = "", scale = 40 }: GeometricMotifProps) {
  const patternId = useId().replace(/:/g, "");
  const half = scale / 2;
  const outer = scale * 0.25;
  const inner = scale * 0.1;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="none"
      viewBox={`0 0 ${scale * 4} ${scale * 2}`}
    >
      <defs>
        <pattern
          id={`motif-${patternId}`}
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {/* Square, then the same square rotated: together they form the star. */}
            <path
              d={`M${half - outer} ${half} L${half} ${half - outer} L${half + outer} ${half} L${half} ${half + outer} Z`}
            />
            <path
              d={`M${half} ${half - outer * 1.45} L${half + outer * 1.45} ${half} L${half} ${half + outer * 1.45} L${half - outer * 1.45} ${half} Z`}
            />
            {/* Corner diamonds tile into a connecting lattice between stars. */}
            <path d={`M${half} 0 L${half + inner} ${inner} L${half} ${inner * 2} L${half - inner} ${inner} Z`} />
            <path d={`M0 ${half} L${inner} ${half - inner} L${inner * 2} ${half} L${inner} ${half + inner} Z`} />
          </g>
        </pattern>
      </defs>
      <rect width={scale * 4} height={scale * 2} fill={`url(#motif-${patternId})`} />
    </svg>
  );
}
