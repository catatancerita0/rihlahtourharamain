import { DepartureCard, StatusLegend } from "../components/DepartureCard";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Tag } from "../components/ui/Tag";
import { packages } from "../content/packages";
import { sortByAvailability } from "../lib/format";

export function SchedulePage() {
  const withDates = packages.filter(
    (item) => item.departureDate !== null || item.departureMonth !== null,
  );

  return (
    <>
      <PageHeader
        eyebrow="Jadwal"
        title="Kapan Anda ingin berangkat?"
        intro="Halaman ini disusun untuk memilih keberangkatan, bukan untuk membaca katalog. Tiap baris menampilkan tanggal, durasi, maskapai, harga, dan sisa kursi pada satu tempat."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <SectionHeading as="h2" eyebrow="Daftar keberangkatan" title="Keberangkatan terdekat" />
                <Tag>{withDates.length} terjadwal</Tag>
              </div>

              <div className="mt-8 flex flex-col gap-5">
                {withDates.length === 0 ? (
                  <EmptyState
                    title="Belum ada tanggal keberangkatan yang ditetapkan."
                    description="Tanggal, maskapai, penginapan, dan harga untuk keberangkatan berikutnya masih dalam proses penetapan. Kami tidak mengisi kekosongan ini dengan perkiraan, karena angka sementara membuat orang mendaftar dengan ekspektasi yang salah."
                    action={
                      <>
                        <ButtonLink to="/konsultasi" variant="primary">
                          Minta kabar jadwal terbaru
                        </ButtonLink>
                        <ButtonLink to="/paket-umrah" variant="outline">
                          Lihat program Umrah
                        </ButtonLink>
                      </>
                    }
                  />
                ) : (
                  sortByAvailability(withDates).map((item) => (
                    <DepartureCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-display-sm text-emerald-900">Arti tanda ketersediaan</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Bentuk dan tulisan yang membedakan status, bukan hanya warna.
                </p>
                <div className="mt-5">
                  <StatusLegend />
                </div>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Yang muncul di tiap baris
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {[
                    "Tanggal keberangkatan",
                    "Durasi dan jumlah malam",
                    "Maskapai yang dipakai",
                    "Hotel Makkah dan Madinah",
                    "Harga per jamaah",
                    "Sisa kursi dan status pendaftaran",
                  ].map((entry) => (
                    <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
