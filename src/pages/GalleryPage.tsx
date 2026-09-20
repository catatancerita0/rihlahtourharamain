import { Gallery } from "../components/Gallery";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";

export function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title="Dokumentasi perjalanan"
        intro="Halaman ini menampung foto kegiatan nyata: manasik, keberangkatan, penginapan, kendaraan, dan suasana rombongan. Sampai foto itu ada, kami menampilkan daftar slotnya."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <Gallery />

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-emerald-100 pt-8">
            <p className="max-w-prose text-body text-charcoal-soft">
              Ingin melihat dokumentasi keberangkatan tertentu? Sampaikan tanggalnya, dan tim akan
              mengirimkan materi yang tersedia.
            </p>
            <ButtonLink to="/konsultasi" variant="primary">
              Konsultasikan Rencana Umrah
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
