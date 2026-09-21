import type { ItineraryDay } from "../content/types";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { PendingPanel } from "./ui/PendingPanel";

interface ItineraryPanelProps {
  days: ItineraryDay[];
  idPrefix: string;
}

const idCopy = {
  pendingLabel: "Itinerary harian",
  pendingDescription:
    "Susunan kegiatan per hari belum dikonfirmasi untuk program ini. Itinerary hanya dipublikasikan setelah urutan kota, penginapan, dan waktu perjalanan ditetapkan, karena menyusunnya lebih awal berisiko berubah.",
  pendingWillShow: [
    "Hari dan tanggal",
    "Kota dan lokasi kegiatan",
    "Agenda harian",
    "Penginapan yang dipakai",
    "Transportasi antar kota",
    "Pengaturan makan",
    "Catatan khusus per hari",
  ],
  day: "Hari",
  accommodation: "Penginapan",
  transport: "Transportasi",
  meals: "Makan",
  notSet: "belum ditetapkan",
};

const enCopy: typeof idCopy = {
  pendingLabel: "Daily itinerary",
  pendingDescription:
    "The day by day plan has not been confirmed for this programme. An itinerary is only published once the order of cities, the accommodation and the travel times are settled, because writing it earlier risks changes.",
  pendingWillShow: [
    "Day and date",
    "City and location of activities",
    "Daily agenda",
    "Accommodation used",
    "Transport between cities",
    "Meal arrangements",
    "Notes for individual days",
  ],
  day: "Day",
  accommodation: "Accommodation",
  transport: "Transport",
  meals: "Meals",
  notSet: "not set yet",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function ItineraryPanel({ days, idPrefix }: ItineraryPanelProps) {
  const c = useCopy(copy);
  const L = usePick();

  if (days.length === 0) {
    return (
      <PendingPanel
        label={c.pendingLabel}
        description={c.pendingDescription}
        willShow={c.pendingWillShow}
      />
    );
  }

  return (
    <ol className="flex flex-col">
      {days.map((day) => (
        <li
          key={`${idPrefix}-${day.day}`}
          className="grid gap-3 border-t border-emerald-100 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6"
        >
          <div>
            <p className="text-label font-semibold uppercase text-charcoal-muted">
              {c.day} {day.day}
            </p>
            <p className="text-body font-semibold text-emerald-900">{L(day.location)}</p>
          </div>
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5">
              {L(day.agenda).map((entry) => (
                <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {entry}
                </li>
              ))}
            </ul>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">{c.accommodation}</dt>
                <dd className="text-charcoal">
                  {day.hotel ? L(day.hotel) : c.notSet}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">{c.transport}</dt>
                <dd className="text-charcoal">
                  {day.transport ? L(day.transport) : c.notSet}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">{c.meals}</dt>
                <dd className="text-charcoal">
                  {day.meals ? L(day.meals) : c.notSet}
                </dd>
              </div>
            </dl>
            {day.note ? (
              <p className="max-w-prose text-body-sm text-charcoal-soft">{L(day.note)}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
