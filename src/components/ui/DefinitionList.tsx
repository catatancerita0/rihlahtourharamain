import { isPlaceholder } from "../../config/site";
import { useCopy } from "../../i18n/LanguageProvider";
import type { Localized } from "../../i18n/types";

export interface DefinitionRow {
  label: string;
  value: string | null;
  /** Shown when value is null. Names what is missing instead of leaving a blank. */
  pending?: string;
}

interface DefinitionListProps {
  rows: DefinitionRow[];
  onDark?: boolean;
  className?: string;
}

const idCopy = {
  pendingDefault: "Belum ditetapkan",
  missingTitle: "Nilai ini belum diisi oleh penyelenggara",
};

const enCopy: typeof idCopy = {
  pendingDefault: "Not set yet",
  missingTitle: "This value has not been provided by the organiser",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function DefinitionList({ rows, onDark = false, className = "" }: DefinitionListProps) {
  const c = useCopy(copy);
  const labelClass = onDark ? "text-emerald-300" : "text-charcoal-muted";
  const valueClass = onDark ? "text-shell" : "text-charcoal";

  return (
    <dl className={`divide-y ${onDark ? "divide-emerald-700" : "divide-emerald-100"} ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-3 sm:gap-4">
          <dt className={`text-body-sm font-semibold ${labelClass}`}>{row.label}</dt>
          <dd className="text-body sm:col-span-2">
            {/* A value that is still a bracketed placeholder is treated as
                missing, so it never renders in the styling reserved for real
                data. */}
            {!isPlaceholder(row.value) ? (
              <span className={`font-medium ${valueClass}`}>{row.value}</span>
            ) : (
              <span
                className={`inline-flex items-center gap-2 text-body-sm ${labelClass}`}
                title={c.missingTitle}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full border border-dashed ${
                    onDark ? "border-emerald-300" : "border-charcoal-muted"
                  }`}
                />
                {row.pending ?? c.pendingDefault}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
