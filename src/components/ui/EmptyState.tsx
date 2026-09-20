import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  onDark?: boolean;
}

export function EmptyState({ title, description, action, onDark = false }: EmptyStateProps) {
  const border = onDark ? "border-emerald-700 bg-emerald-900/40" : "border-emerald-200 bg-cream";
  const heading = onDark ? "text-shell" : "text-emerald-900";
  const body = onDark ? "text-emerald-100" : "text-charcoal-soft";

  return (
    <div className={`rounded-lg border ${border} p-6 sm:p-8`}>
      <h3 className={`text-display-sm ${heading}`}>{title}</h3>
      <p className={`mt-3 max-w-prose text-body ${body}`}>{description}</p>
      {action ? <div className="mt-6 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
