import { gallerySlots } from "../content/site-content";

/**
 * No photographs are published yet. Rather than fill the grid with purchased
 * stock that would misrepresent the trips, the gallery lists the slots waiting
 * for real documentation and says where each category of photo comes from.
 */
export function Gallery() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallerySlots.map((slot) => (
          <li
            key={slot.id}
            className="flex aspect-[4/3] flex-col justify-end rounded-lg border border-dashed border-emerald-300 bg-emerald-50/60 p-5"
          >
            <p className="text-label font-semibold uppercase text-charcoal-muted">Slot foto</p>
            <p className="mt-1 text-display-sm text-emerald-900">{slot.label}</p>
            <p className="mt-2 text-body-sm text-charcoal-soft">{slot.description}</p>
          </li>
        ))}
      </ul>
      <p className="max-w-prose text-body-sm text-charcoal-soft">
        Galeri ini sengaja kosong. Dokumentasi perjalanan akan diunggah setelah tim memiliki foto
        kegiatan sendiri, karena foto stok tidak menunjukkan penginapan, kendaraan, atau suasana
        rombongan yang benar-benar Anda dapatkan.
      </p>
    </div>
  );
}
