import type { FaqItem } from "../content/types";

interface FAQAccordionProps {
  items: FaqItem[];
  idPrefix: string;
}

/**
 * Built on <details>/<summary> on purpose: it is keyboard operable, announced
 * correctly by screen readers, and still opens if the bundle fails to load.
 */
export function FAQAccordion({ items, idPrefix }: FAQAccordionProps) {
  return (
    <div className="divide-y divide-emerald-100 border-y border-emerald-100">
      {items.map((item) => (
        <details key={item.id} className="group py-4" id={`${idPrefix}-${item.id}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-body-lg font-semibold text-emerald-900 marker:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-emerald-400 text-emerald-800"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" focusable="false">
                <path d="M0 5.5h11" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M5.5 0v11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="origin-center transition-transform duration-200 ease-calm group-open:rotate-90 group-open:opacity-0"
                />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-prose text-body text-charcoal-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
