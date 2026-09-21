import type { ReactNode } from "react";
import { useCopy } from "../../i18n/LanguageProvider";
import type { Localized } from "../../i18n/types";

interface PendingPanelProps {
  label: string;
  description: string;
  /** Names what will appear here once the data exists, so the panel is informative. */
  willShow?: string[];
  action?: ReactNode;
}

const idCopy = { prefix: "Belum ditetapkan:" };
const enCopy: typeof idCopy = { prefix: "Not set yet:" };
const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

/**
 * The dashed border is the signal: this is a slot, not content. Nothing in
 * this panel pretends to be a real value, which is why it reads as a
 * deliberate state instead of a broken section.
 */
export function PendingPanel({ label, description, willShow, action }: PendingPanelProps) {
  const c = useCopy(copy);

  return (
    <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/60 p-5 sm:p-6">
      <p className="text-label font-semibold text-charcoal-soft">
        {c.prefix} {label}
      </p>
      <p className="mt-2 max-w-prose text-body text-charcoal-soft">{description}</p>
      {willShow && willShow.length > 0 ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {willShow.map((item) => (
            <li key={item} className="flex items-start gap-2 text-body-sm text-charcoal-soft">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
