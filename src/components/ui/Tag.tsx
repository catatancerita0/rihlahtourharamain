import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  onDark?: boolean;
}

/**
 * Not a capsule and not a badge with a glow: a tight label with a square-ish
 * radius, used for category and grouping text that carries information.
 */
export function Tag({ children, onDark = false }: TagProps) {
  const tone = onDark
    ? "border-emerald-300 text-emerald-100"
    : "border-emerald-200 bg-cream text-charcoal-soft";

  return (
    <span
      className={`inline-block rounded-sm border px-2.5 py-1 text-label font-semibold ${tone}`}
    >
      {children}
    </span>
  );
}
