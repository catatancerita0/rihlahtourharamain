import type { HotelInfo } from "../content/types";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { DefinitionList } from "./ui/DefinitionList";
import { Media } from "./ui/Media";
import { PendingPanel } from "./ui/PendingPanel";

interface HotelPanelProps {
  hotel: HotelInfo | null;
  /** "Makkah" or "Madinah", translated because the two read differently. */
  city: Localized<string>;
}

const idCopy = {
  pendingLabel: (city: string) => `Hotel di ${city}`,
  pendingDescription:
    "Hotel, tipe kamar, dan jarak ke area ibadah belum dikonfirmasi untuk program ini. Jarak ditampilkan hanya setelah penginapannya ditetapkan, karena angka perkiraan mudah menyesatkan saat membandingkan program.",
  pendingWillShow: [
    "Nama hotel",
    "Kategori hotel",
    "Tipe kamar",
    "Jarak ke area ibadah",
    "Fasilitas yang bisa dipakai jamaah",
    "Foto kamar dan area umum",
  ],
  category: "Kategori",
  distance: "Jarak",
  roomType: "Tipe kamar",
  notSet: "Belum ditetapkan",
  distancePending: "Jarak akan dikonfirmasi sesuai paket",
  facilities: "Fasilitas",
};

const enCopy: typeof idCopy = {
  pendingLabel: (city: string) => `Hotel in ${city}`,
  pendingDescription:
    "The hotel, room type and distance to the worship area have not been confirmed for this programme. Distance is only shown once the accommodation is settled, because an estimate is misleading when comparing programmes.",
  pendingWillShow: [
    "Hotel name",
    "Hotel category",
    "Room type",
    "Distance to the worship area",
    "Facilities pilgrims can use",
    "Photos of the rooms and common areas",
  ],
  category: "Category",
  distance: "Distance",
  roomType: "Room type",
  notSet: "Not set yet",
  distancePending: "Distance will be confirmed with the package",
  facilities: "Facilities",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function HotelPanel({ hotel, city }: HotelPanelProps) {
  const c = useCopy(copy);
  const L = usePick();
  const cityName = L(city);

  if (!hotel) {
    return (
      <PendingPanel
        label={c.pendingLabel(cityName)}
        description={c.pendingDescription}
        willShow={c.pendingWillShow}
      />
    );
  }

  return (
    <div className="rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
      {/* A photo of this hotel only. The panel already states the distance to
          the worship area, so the picture has to match those numbers. */}
      {hotel.photo ? (
        <Media
          src={hotel.photo}
          alt={`${L(hotel.name)}, ${L(hotel.city)}`}
          ratio="3/2"
          className="mb-5"
        />
      ) : null}
      <h3 className="text-display-sm text-emerald-900">{L(hotel.name)}</h3>
      <p className="mt-1 text-body-sm text-charcoal-soft">{L(hotel.city)}</p>
      <DefinitionList
        className="mt-4"
        rows={[
          {
            label: c.category,
            value: hotel.category ? L(hotel.category) : null,
            pending: c.notSet,
          },
          {
            label: c.distance,
            value: hotel.distance ? L(hotel.distance) : null,
            pending: c.distancePending,
          },
          {
            label: c.roomType,
            value: hotel.roomType ? L(hotel.roomType) : null,
            pending: c.notSet,
          },
        ]}
      />
      {L(hotel.facilities).length > 0 ? (
        <>
          <h4 className="mt-5 text-label font-semibold uppercase text-charcoal-muted">
            {c.facilities}
          </h4>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {L(hotel.facilities).map((facility) => (
              <li key={facility} className="flex gap-2 text-body-sm text-charcoal-soft">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                {facility}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
