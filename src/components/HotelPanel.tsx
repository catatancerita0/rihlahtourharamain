import type { HotelInfo } from "../content/types";
import { DefinitionList } from "./ui/DefinitionList";
import { PendingPanel } from "./ui/PendingPanel";

interface HotelPanelProps {
  hotel: HotelInfo | null;
  city: string;
}

export function HotelPanel({ hotel, city }: HotelPanelProps) {
  if (!hotel) {
    return (
      <PendingPanel
        label={`Hotel di ${city}`}
        description={`Hotel, tipe kamar, dan jarak ke area ibadah belum dikonfirmasi untuk program ini. Jarak ditampilkan hanya setelah penginapannya ditetapkan, karena angka perkiraan mudah menyesatkan saat membandingkan program.`}
        willShow={[
          "Nama hotel",
          "Kategori hotel",
          "Tipe kamar",
          "Jarak ke area ibadah",
          "Fasilitas yang bisa dipakai jamaah",
          "Foto kamar dan area umum",
        ]}
      />
    );
  }

  return (
    <div className="rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
      <h3 className="text-display-sm text-emerald-900">{hotel.name}</h3>
      <p className="mt-1 text-body-sm text-charcoal-soft">{hotel.city}</p>
      <DefinitionList
        className="mt-4"
        rows={[
          { label: "Kategori", value: hotel.category, pending: "Belum ditetapkan" },
          {
            label: "Jarak",
            value: hotel.distance,
            pending: "Jarak akan dikonfirmasi sesuai paket",
          },
          { label: "Tipe kamar", value: hotel.roomType, pending: "Belum ditetapkan" },
        ]}
      />
      {hotel.facilities.length > 0 ? (
        <>
          <h4 className="mt-5 text-label font-semibold uppercase text-charcoal-muted">
            Fasilitas
          </h4>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {hotel.facilities.map((facility) => (
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
