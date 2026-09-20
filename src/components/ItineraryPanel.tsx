import type { ItineraryDay } from "../content/types";
import { PendingPanel } from "./ui/PendingPanel";

interface ItineraryPanelProps {
  days: ItineraryDay[];
  idPrefix: string;
}

export function ItineraryPanel({ days, idPrefix }: ItineraryPanelProps) {
  if (days.length === 0) {
    return (
      <PendingPanel
        label="Itinerary harian"
        description="Susunan kegiatan per hari belum dikonfirmasi untuk program ini. Itinerary hanya dipublikasikan setelah urutan kota, penginapan, dan waktu perjalanan ditetapkan, karena menyusunnya lebih awal berisiko berubah."
        willShow={[
          "Hari dan tanggal",
          "Kota dan lokasi kegiatan",
          "Agenda harian",
          "Penginapan yang dipakai",
          "Transportasi antar kota",
          "Pengaturan makan",
          "Catatan khusus per hari",
        ]}
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
            <p className="text-label font-semibold uppercase text-charcoal-muted">Hari {day.day}</p>
            <p className="text-body font-semibold text-emerald-900">{day.location}</p>
          </div>
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5">
              {day.agenda.map((entry) => (
                <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {entry}
                </li>
              ))}
            </ul>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">Penginapan</dt>
                <dd className="text-charcoal">{day.hotel ?? "belum ditetapkan"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">Transportasi</dt>
                <dd className="text-charcoal">{day.transport ?? "belum ditetapkan"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-charcoal-muted">Makan</dt>
                <dd className="text-charcoal">{day.meals ?? "belum ditetapkan"}</dd>
              </div>
            </dl>
            {day.note ? (
              <p className="max-w-prose text-body-sm text-charcoal-soft">{day.note}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
