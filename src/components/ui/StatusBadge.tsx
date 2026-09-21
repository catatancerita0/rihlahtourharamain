import type { Availability } from "../../content/types";
import { useLang } from "../../i18n/LanguageProvider";
import { availabilityMetaFor } from "../../lib/format";

interface StatusBadgeProps {
  status: Availability;
  onDark?: boolean;
  showDescription?: boolean;
}

/**
 * Shape first, colour second. The marker differs per status (solid, half,
 * slash, outline) so the badge still reads in greyscale or forced colours.
 */
function Marker({ shape }: { shape: "solid" | "half" | "slash" | "outline" }) {
  const common = { width: 12, height: 12, viewBox: "0 0 12 12" } as const;

  if (shape === "solid") {
    return (
      <svg {...common} aria-hidden="true" focusable="false">
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      </svg>
    );
  }
  if (shape === "half") {
    return (
      <svg {...common} aria-hidden="true" focusable="false">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 1.5 A4.5 4.5 0 0 1 6 10.5 Z" fill="currentColor" />
      </svg>
    );
  }
  if (shape === "slash") {
    return (
      <svg {...common} aria-hidden="true" focusable="false">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.6 9.4 L9.4 2.6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true" focusable="false">
      <circle
        cx="6"
        cy="6"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function StatusBadge({ status, onDark = false, showDescription = false }: StatusBadgeProps) {
  const meta = availabilityMetaFor(status, useLang());
  const color = onDark ? meta.darkClassName : meta.className;

  return (
    <span className={`inline-flex items-center gap-2 text-body-sm font-semibold ${color}`}>
      <Marker shape={meta.marker} />
      <span>
        {meta.label}
        {showDescription ? <span className="sr-only">. {meta.description}</span> : null}
      </span>
    </span>
  );
}
