/**
 * Promotions as the visitor sees them.
 *
 * A promo is never shown without the date it ends, because an offer without an
 * expiry is the kind of claim jamaah cannot check. Promos are also rendered from
 * whatever is active today rather than from a flag someone has to remember to
 * switch off, so an expired promotion disappears by itself.
 */
import type { Promo } from "../content/types";
import { useLang, usePick } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import { formatDeparture } from "../lib/format";

function expiry(promo: Promo, lang: "id" | "en"): string | null {
  if (!promo.endsAt) return null;
  const date = formatDeparture(promo.endsAt, lang);
  return date ? chrome[lang].promo.until(date) : null;
}

/** Compact marker for a listing card, where space is measured in lines. */
export function PromoBadge({ promos }: { promos: Promo[] }) {
  const L = usePick();
  const lang = useLang();
  const promo = promos[0];
  if (!promo) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-gold bg-gold-soft px-2.5 py-1 text-label font-semibold uppercase text-emerald-900">
      {chrome[lang].promo.label}
      <span className="font-normal normal-case text-emerald-800">{L(promo.title)}</span>
    </span>
  );
}

/**
 * The full promo, used where there is room to state the terms: the package
 * detail page and the homepage banner.
 */
export function PromoNotice({ promos, onDark = false }: { promos: Promo[]; onDark?: boolean }) {
  const L = usePick();
  const lang = useLang();
  if (promos.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {promos.map((promo) => {
        const until = expiry(promo, lang);
        return (
          <li
            key={promo.id}
            className={
              onDark
                ? "rounded-lg border border-gold/60 bg-emerald-900/50 p-4"
                : "rounded-lg border border-gold bg-gold-soft p-4"
            }
          >
            <p
              className={`text-label font-semibold uppercase ${
                onDark ? "text-gold-soft" : "text-emerald-700"
              }`}
            >
              {chrome[lang].promo.label}
            </p>
            <p
              className={`mt-1 text-body font-semibold ${
                onDark ? "text-shell" : "text-emerald-900"
              }`}
            >
              {L(promo.title)}
            </p>
            {promo.detail ? (
              <p
                className={`mt-1 max-w-prose text-body-sm ${
                  onDark ? "text-emerald-100" : "text-charcoal-soft"
                }`}
              >
                {L(promo.detail)}
              </p>
            ) : null}
            <p
              className={`mt-2 text-body-sm font-semibold ${
                onDark ? "text-shell" : "text-emerald-800"
              }`}
            >
              {until ?? (promo.packageSlug ? "" : chrome[lang].promo.siteWide)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
