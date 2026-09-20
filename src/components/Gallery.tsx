import { gallerySlots } from "../content/site-content";
import { Media } from "./ui/Media";

/**
 * Real documentation only. A slot without a photo explains what belongs there
 * instead of being filled with purchased stock that would suggest hotel rooms,
 * vehicles, or group sizes the team does not actually provide.
 */
export function Gallery() {
  const withPhotos = gallerySlots.filter((slot) => slot.photo !== null).length;

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallerySlots.map((slot) => (
          <li key={slot.id}>
            <Media
              src={slot.photo}
              alt={slot.label}
              ratio="4/3"
              slotLabel={slot.label}
              slotNote={slot.description}
            />
          </li>
        ))}
      </ul>
      {withPhotos === 0 ? (
        <p className="max-w-prose text-body-sm text-charcoal-soft">
          Galeri ini sengaja kosong. Dokumentasi perjalanan akan diunggah setelah tim memiliki foto
          kegiatan sendiri, karena foto stok tidak menunjukkan penginapan, kendaraan, atau suasana
          rombongan yang benar-benar Anda dapatkan.
        </p>
      ) : null}
    </div>
  );
}
