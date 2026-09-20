import { Link, useParams } from "react-router-dom";
import { FAQAccordion } from "../components/FAQAccordion";
import { HotelPanel } from "../components/HotelPanel";
import { ItineraryPanel } from "../components/ItineraryPanel";
import { Seo } from "../components/Seo";
import { ButtonLink } from "../components/ui/Button";
import { DefinitionList, type DefinitionRow } from "../components/ui/DefinitionList";
import { EmptyState } from "../components/ui/EmptyState";
import { Media } from "../components/ui/Media";
import { PendingPanel } from "../components/ui/PendingPanel";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Tag } from "../components/ui/Tag";
import { faqs } from "../content/faq";
import { getPackageBySlug, packages } from "../content/packages";
import type { PackageCategory } from "../content/types";
import { formatDeparture, formatMonth, formatRupiah } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";

const packageFaqIds = ["faq-dokumen", "faq-tiket", "faq-jadwal-berubah", "faq-pembatalan"];

export function PackageDetailPage({ category }: { category: PackageCategory }) {
  const { slug } = useParams();
  const item = getPackageBySlug(slug);

  if (!item || item.category !== category) {
    return (
      <div className="section bg-shell">
        <div className="shell-container">
          <Seo title="Program tidak ditemukan" />
          <EmptyState
            title="Program yang Anda cari tidak ditemukan."
            description={`Alamat ini tidak cocok dengan program yang tersedia. Saat ini ada ${packages.length} program yang dipublikasikan, dan daftarnya ada di halaman paket.`}
            action={
              <ButtonLink to="/paket-umrah" variant="primary">
                Lihat daftar paket Umrah
              </ButtonLink>
            }
          />
        </div>
      </div>
    );
  }

  const price = formatRupiah(item.price);
  const departure = formatDeparture(item.departureDate) ?? formatMonth(item.departureMonth);
  const basePath = item.category === "umrah" ? "/paket-umrah" : "/paket-haji";
  const consult = `/konsultasi?paket=${encodeURIComponent(item.name)}`;
  const itemFaqs = faqs.filter((faq) => packageFaqIds.includes(faq.id));

  const completeness: DefinitionRow[] = [
    { label: "Durasi", value: item.duration, pending: "Belum ditetapkan" },
    { label: "Tanggal keberangkatan", value: departure, pending: "Belum ditetapkan" },
    { label: "Harga per jamaah", value: price, pending: "Belum dipublikasikan" },
    { label: "Maskapai", value: item.airline, pending: "Belum ditetapkan" },
    { label: "Hotel Makkah", value: item.makkahHotel?.name ?? null, pending: "Belum ditetapkan" },
    { label: "Hotel Madinah", value: item.madinahHotel?.name ?? null, pending: "Belum ditetapkan" },
  ];

  const publishedCount = completeness.filter((row) => row.value !== null).length;

  return (
    <div className="pb-28 lg:pb-0">
      <Seo title={`${item.name} | Program ${categoryLabels[item.category]}`} description={item.focus} />

      <section className="on-dark bg-emerald-800 text-shell">
        <div className="shell-container py-section-sm sm:py-section">
          <nav aria-label="Breadcrumb" className="text-body-sm text-emerald-300">
            <Link to={basePath} className="underline underline-offset-4 hover:text-shell">
              {categoryLabels[item.category]}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{programLabels[item.type]}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <Tag onDark>
                  {categoryLabels[item.category]} · {programLabels[item.type]}
                </Tag>
                <StatusBadge status={item.availability} onDark showDescription />
              </div>
              <h1 className="text-display-lg">{item.name}</h1>
              <p className="max-w-prose text-body-lg text-emerald-100">{item.focus}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to={consult} variant="accent" size="lg">
                  Konsultasikan Paket Ini
                </ButtonLink>
                <ButtonLink to="/jadwal" variant="outline" size="lg" onDark>
                  Lihat Jadwal Keberangkatan
                </ButtonLink>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {item.thumbnail ? (
                <Media src={item.thumbnail} alt={item.name} ratio="4/3" priority />
              ) : null}

              <div className="rounded-lg border border-emerald-700 bg-emerald-900/40 p-5">
                <p className="text-label font-semibold uppercase text-emerald-300">
                  Ringkasan data
                </p>
                <p className="mt-2 text-body text-emerald-100">
                  {publishedCount} dari {completeness.length} data komersial sudah dipublikasikan.
                  Sisanya belum ditetapkan oleh tim, dan tidak kami isi dengan perkiraan.
                </p>
                <div className="mt-4">
                  <DefinitionList onDark rows={completeness} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme photos, placed where people look for proof that the trip is
          real. Nothing appears until documentation exists, so no stock image
          ever stands in for this departure. */}
      {item.gallery.length > 0 ? (
        <section className="section-tight bg-cream">
          <div className="shell-container">
            <h2 className="text-display-sm text-emerald-900">Galeri program ini</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {item.gallery.map((photo) => (
                <li key={photo.file}>
                  <Media src={photo.file} alt={photo.alt} ratio="4/3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-display-sm text-emerald-900">Cara kerja program ini</h2>
                <p className="mt-4 max-w-prose text-body-lg text-charcoal-soft">{item.summary}</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-label font-semibold uppercase text-charcoal-muted">
                    Cocok untuk
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {item.audiences.map((entry) => (
                      <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-label font-semibold uppercase text-charcoal-muted">
                    Yang membedakan
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {item.differentiators.map((entry) => (
                      <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-display-sm text-emerald-900">Itinerary</h2>
                <div className="mt-4">
                  <ItineraryPanel days={item.itinerary} idPrefix={item.slug} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <HealthRow label="Harga per jamaah" value={price} />
              <HealthRow label="Durasi" value={item.duration} />
              <HealthRow label="Keberangkatan" value={departure} />
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h3 className="text-body font-semibold text-emerald-900">
                  Butuh bantuan memilih?
                </h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Sampaikan jumlah jamaah dan kebutuhan Anda. Tim akan membandingkan ketiga program
                  dengan angka yang berlaku, bukan dengan kisaran umum.
                </p>
                <ButtonLink to={consult} variant="primary" className="mt-4">
                  Konsultasikan Paket Ini
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <h2 className="text-display-md text-emerald-900">Penginapan</h2>
          <p className="mt-3 max-w-prose text-body text-charcoal-soft">
            Jarak ke area ibadah ditampilkan hanya setelah hotelnya ditetapkan, karena angka
            perkiraan membuat perbandingan antarprogram jadi menyesatkan.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <HotelPanel hotel={item.makkahHotel} city="Makkah" />
            <HotelPanel hotel={item.madinahHotel} city="Madinah" />
          </div>
        </div>
      </section>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-display-sm text-emerald-900">Fasilitas</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Daftar ini dipisah antara yang termasuk dan yang tidak termasuk, karena
                  perbandingan harga tanpa pemisahan itu tidak berarti.
                </p>
              </div>

              {item.included.length === 0 && item.excluded.length === 0 ? (
                <PendingPanel
                  label="Fasilitas termasuk dan tidak termasuk"
                  description="Belum ada fasilitas yang dikonfirmasi untuk program ini. Daftar dipublikasikan setelah penginapan, maskapai, dan transportasi ditetapkan."
                  willShow={[
                    "Tiket dan rute penerbangan",
                    "Penginapan beserta tipe kamar",
                    "Transportasi darat dan antar kota",
                    "Pengaturan makan",
                    "Pendampingan pembimbing",
                    "Biaya yang tetap dibayar jamaah",
                  ]}
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <FacilityList title="Termasuk" items={item.included} />
                  <FacilityList title="Tidak termasuk" items={item.excluded} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h3 className="text-body-lg font-semibold text-emerald-900">Manasik</h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Manasik membahas rangkaian ibadah dan urutan kegiatan di lapangan. Jadwalnya
                  ditetapkan menjelang keberangkatan dan diinformasikan ke jamaah yang sudah
                  terdaftar.
                </p>
                <Link
                  to="/panduan/manasik-yang-sebaiknya-dipahami-sebelum-berangkat"
                  className="mt-3 inline-block rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                >
                  Baca persiapan manasik
                </Link>
              </div>

              <PendingPanel
                label="Dokumen yang perlu disiapkan"
                description="Daftar dokumen mengikuti ketentuan yang berlaku saat keberangkatan, jadi diterbitkan per program setelah tanggalnya ditetapkan."
                willShow={[
                  "Paspor dan masa berlaku minimum",
                  "Data identitas dan kartu keluarga",
                  "Foto dengan ketentuan terbaru",
                  "Keterangan kesehatan bila diminta",
                  "Buku vaksin bila diminta",
                ]}
              />

              <PendingPanel
                label="Pembimbing"
                description="Nama dan latar belakang pembimbing ditampilkan setelah ditetapkan untuk keberangkatan ini."
                willShow={["Nama pembimbing", "Peran selama perjalanan", "Pengalaman pendampingan"]}
                action={
                  <ButtonLink to="/pembimbing" variant="outline">
                    Lihat halaman pembimbing
                  </ButtonLink>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
            <div>
              <h2 className="text-display-md text-emerald-900">Pertanyaan tentang paket</h2>
              <p className="mt-3 max-w-prose text-body text-charcoal-soft">
                Ketentuan pembatalan dan perubahan jadwal lengkapnya ada di halaman syarat dan
                ketentuan.
              </p>
              <ButtonLink to="/syarat-ketentuan" variant="outline" className="mt-5">
                Baca syarat dan ketentuan
              </ButtonLink>
            </div>
            <FAQAccordion items={itemFaqs} idPrefix={`pkg-${item.slug}`} />
          </div>
        </div>
      </section>

      {/* Sticky CTA stays above the page flow and the page reserves room for it,
          so the last section is never covered on a phone. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-100 bg-shell px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-label font-semibold uppercase text-charcoal-muted">Harga</p>
            <p className="tabular truncate text-body font-semibold text-emerald-900">
              {price ?? "Belum dipublikasikan"}
            </p>
          </div>
          <ButtonLink to={consult} variant="accent" className="min-h-12 shrink-0">
            Konsultasikan Paket Ini
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-b border-emerald-100 pb-4">
      <p className="text-label font-semibold uppercase text-charcoal-muted">{label}</p>
      {value ? (
        <p className="tabular mt-1 text-display-sm text-emerald-900">{value}</p>
      ) : (
        <p className="mt-1 text-body-sm text-charcoal-soft">Belum dipublikasikan</p>
      )}
    </div>
  );
}

function FacilityList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-shell p-5">
      <h3 className="text-body font-semibold text-emerald-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-body-sm text-charcoal-soft">Belum ditetapkan.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((entry) => (
            <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
