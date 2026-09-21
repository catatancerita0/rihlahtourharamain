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
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import { both, type Localized } from "../i18n/types";
import { formatDeparture, formatMonth, formatRupiah } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";

const packageFaqIds = ["faq-dokumen", "faq-tiket", "faq-jadwal-berubah", "faq-pembatalan"];

const idCopy = {
  notFoundSeo: "Program tidak ditemukan",
  notFoundTitle: "Program yang Anda cari tidak ditemukan.",
  notFoundBody: (count: number) =>
    `Alamat ini tidak cocok dengan program yang tersedia. Saat ini ada ${count} program yang dipublikasikan, dan daftarnya ada di halaman paket.`,
  notFoundAction: "Lihat daftar paket Umrah",
  breadcrumb: "Breadcrumb",
  summaryLabel: "Ringkasan data",
  summaryBody: (shown: number, total: number) =>
    `${shown} dari ${total} data komersial sudah dipublikasikan. Sisanya belum ditetapkan oleh tim, dan tidak kami isi dengan perkiraan.`,
  galleryTitle: "Galeri program ini",
  howTitle: "Cara kerja program ini",
  audienceLabel: "Cocok untuk",
  differenceLabel: "Yang membedakan",
  itineraryTitle: "Itinerary",
  pricePerPilgrim: "Harga per jamaah",
  duration: "Durasi",
  departure: "Keberangkatan",
  airline: "Maskapai",
  makkahHotel: "Hotel Makkah",
  madinahHotel: "Hotel Madinah",
  notSet: "Belum ditetapkan",
  notPublished: "Belum dipublikasikan",
  helpTitle: "Butuh bantuan memilih?",
  helpBody:
    "Sampaikan jumlah jamaah dan kebutuhan Anda. Tim akan membandingkan ketiga program dengan angka yang berlaku, bukan dengan kisaran umum.",
  lodgingTitle: "Penginapan",
  lodgingIntro:
    "Jarak ke area ibadah ditampilkan hanya setelah hotelnya ditetapkan, karena angka perkiraan membuat perbandingan antarprogram jadi menyesatkan.",
  facilitiesTitle: "Fasilitas",
  facilitiesIntro:
    "Daftar ini dipisah antara yang termasuk dan yang tidak termasuk, karena perbandingan harga tanpa pemisahan itu tidak berarti.",
  facilitiesPendingLabel: "Fasilitas termasuk dan tidak termasuk",
  facilitiesPendingBody:
    "Belum ada fasilitas yang dikonfirmasi untuk program ini. Daftar dipublikasikan setelah penginapan, maskapai, dan transportasi ditetapkan.",
  facilitiesPendingWillShow: [
    "Tiket dan rute penerbangan",
    "Penginapan beserta tipe kamar",
    "Transportasi darat dan antar kota",
    "Pengaturan makan",
    "Pendampingan pembimbing",
    "Biaya yang tetap dibayar jamaah",
  ],
  includedTitle: "Termasuk",
  excludedTitle: "Tidak termasuk",
  facilityEmpty: "Belum ditetapkan.",
  manasikTitle: "Manasik",
  manasikBody:
    "Manasik membahas rangkaian ibadah dan urutan kegiatan di lapangan. Jadwalnya ditetapkan menjelang keberangkatan dan diinformasikan ke jamaah yang sudah terdaftar.",
  manasikLink: "Baca persiapan manasik",
  docsLabel: "Dokumen yang perlu disiapkan",
  docsBody:
    "Daftar dokumen mengikuti ketentuan yang berlaku saat keberangkatan, jadi diterbitkan per program setelah tanggalnya ditetapkan.",
  docsWillShow: [
    "Paspor dan masa berlaku minimum",
    "Data identitas dan kartu keluarga",
    "Foto dengan ketentuan terbaru",
    "Keterangan kesehatan bila diminta",
    "Buku vaksin bila diminta",
  ],
  guideLabel: "Pembimbing",
  guideBody:
    "Nama dan latar belakang pembimbing ditampilkan setelah ditetapkan untuk keberangkatan ini.",
  guideWillShow: ["Nama pembimbing", "Peran selama perjalanan", "Pengalaman pendampingan"],
  guideAction: "Lihat halaman pembimbing",
  faqTitle: "Pertanyaan tentang paket",
  faqIntro:
    "Ketentuan pembatalan dan perubahan jadwal lengkapnya ada di halaman syarat dan ketentuan.",
  faqAction: "Baca syarat dan ketentuan",
  stickyPrice: "Harga",
};

const enCopy: typeof idCopy = {
  notFoundSeo: "Programme not found",
  notFoundTitle: "The programme you are looking for was not found.",
  notFoundBody: (count: number) =>
    `This address does not match an available programme. There are currently ${count} published programmes, and the list is on the packages page.`,
  notFoundAction: "See the Umrah package list",
  breadcrumb: "Breadcrumb",
  summaryLabel: "Data summary",
  summaryBody: (shown: number, total: number) =>
    `${shown} of ${total} commercial details have been published. The rest have not been set by the team, and we do not fill them with estimates.`,
  galleryTitle: "Photos of this programme",
  howTitle: "How this programme works",
  audienceLabel: "Suited to",
  differenceLabel: "What sets it apart",
  itineraryTitle: "Itinerary",
  pricePerPilgrim: "Price per pilgrim",
  duration: "Duration",
  departure: "Departure",
  airline: "Airline",
  makkahHotel: "Hotel in Makkah",
  madinahHotel: "Hotel in Madinah",
  notSet: "Not set yet",
  notPublished: "Not published yet",
  helpTitle: "Need help choosing?",
  helpBody:
    "Tell us how many people are travelling and what you need. The team will compare the three programmes using the figures that apply, not a general range.",
  lodgingTitle: "Accommodation",
  lodgingIntro:
    "Distance to the worship area is shown only once the hotel is settled, because an estimate makes comparisons between programmes misleading.",
  facilitiesTitle: "Facilities",
  facilitiesIntro:
    "This list separates what is included from what is not, because comparing prices without that separation means very little.",
  facilitiesPendingLabel: "Facilities included and not included",
  facilitiesPendingBody:
    "No facilities have been confirmed for this programme yet. The list is published once accommodation, airline and transport are settled.",
  facilitiesPendingWillShow: [
    "Flight tickets and route",
    "Accommodation with room type",
    "Ground and intercity transport",
    "Meal arrangements",
    "Support from the group guide",
    "Costs the pilgrim still pays",
  ],
  includedTitle: "Included",
  excludedTitle: "Not included",
  facilityEmpty: "Not set yet.",
  manasikTitle: "Manasik",
  manasikBody:
    "The manasik briefing covers the worship sequence and the order of events on the ground. Its date is set close to departure and passed on to pilgrims who have registered.",
  manasikLink: "Read about manasik preparation",
  docsLabel: "Documents to prepare",
  docsBody:
    "The document list follows the rules in force at departure, so it is published per programme once the date is set.",
  docsWillShow: [
    "Passport and minimum validity",
    "Identity and family records",
    "Photographs meeting the current rules",
    "Health information if requested",
    "Vaccination record if requested",
  ],
  guideLabel: "Group guide",
  guideBody:
    "The guide's name and background are shown once assigned to this departure.",
  guideWillShow: ["Guide's name", "Their role during the trip", "Experience accompanying groups"],
  guideAction: "See the group guides page",
  faqTitle: "Questions about the package",
  faqIntro:
    "The full cancellation and schedule change terms are on the terms and conditions page.",
  faqAction: "Read the terms and conditions",
  stickyPrice: "Price",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function PackageDetailPage({ category }: { category: PackageCategory }) {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const { slug } = useParams();
  const item = getPackageBySlug(slug);

  if (!item || item.category !== category) {
    return (
      <div className="section bg-shell">
        <div className="shell-container">
          <Seo title={c.notFoundSeo} />
          <EmptyState
            title={c.notFoundTitle}
            description={c.notFoundBody(packages.length)}
            action={
              <ButtonLink to="/paket-umrah" variant="primary">
                {c.notFoundAction}
              </ButtonLink>
            }
          />
        </div>
      </div>
    );
  }

  const price = formatRupiah(item.price, lang);
  const departure =
    formatDeparture(item.departureDate, lang) ?? formatMonth(item.departureMonth, lang);
  const basePath = item.category === "umrah" ? "/paket-umrah" : "/paket-haji";
  const consult = `/konsultasi?paket=${encodeURIComponent(L(item.name))}`;
  const itemFaqs = faqs.filter((faq) => packageFaqIds.includes(faq.id));
  const included = L(item.included);
  const excluded = L(item.excluded);

  const completeness: DefinitionRow[] = [
    { label: c.duration, value: item.duration ? L(item.duration) : null, pending: c.notSet },
    { label: c.departure, value: departure, pending: c.notSet },
    { label: c.pricePerPilgrim, value: price, pending: c.notPublished },
    { label: c.airline, value: item.airline ? L(item.airline) : null, pending: c.notSet },
    {
      label: c.makkahHotel,
      value: item.makkahHotel ? L(item.makkahHotel.name) : null,
      pending: c.notSet,
    },
    {
      label: c.madinahHotel,
      value: item.madinahHotel ? L(item.madinahHotel.name) : null,
      pending: c.notSet,
    },
  ];

  const publishedCount = completeness.filter((row) => row.value !== null).length;

  return (
    <div className="pb-28 lg:pb-0">
      <Seo
        title={`${L(item.name)} | ${categoryLabels[item.category][lang]}`}
        description={L(item.focus)}
      />

      <section className="on-dark bg-emerald-800 text-shell">
        <div className="shell-container py-section-sm sm:py-section">
          <nav aria-label={c.breadcrumb} className="text-body-sm text-emerald-300">
            <Link to={basePath} className="underline underline-offset-4 hover:text-shell">
              {categoryLabels[item.category][lang]}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{programLabels[item.type][lang]}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <Tag onDark>
                  {categoryLabels[item.category][lang]} · {programLabels[item.type][lang]}
                </Tag>
                <StatusBadge status={item.availability} onDark showDescription />
              </div>
              <h1 className="text-display-lg">{L(item.name)}</h1>
              <p className="max-w-prose text-body-lg text-emerald-100">{L(item.focus)}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to={consult} variant="accent" size="lg">
                  {chrome[lang].cta.consultPackage}
                </ButtonLink>
                <ButtonLink to="/jadwal" variant="outline" size="lg" onDark>
                  {chrome[lang].cta.viewSchedule}
                </ButtonLink>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {item.thumbnail ? (
                <Media src={item.thumbnail} alt={L(item.name)} ratio="4/3" priority />
              ) : null}

              <div className="rounded-lg border border-emerald-700 bg-emerald-900/40 p-5">
                <p className="text-label font-semibold uppercase text-emerald-300">
                  {c.summaryLabel}
                </p>
                <p className="mt-2 text-body text-emerald-100">
                  {c.summaryBody(publishedCount, completeness.length)}
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
            <h2 className="text-display-sm text-emerald-900">{c.galleryTitle}</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {item.gallery.map((photo) => (
                <li key={photo.file}>
                  <Media src={photo.file} alt={L(photo.alt)} ratio="4/3" />
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
                <h2 className="text-display-sm text-emerald-900">{c.howTitle}</h2>
                <p className="mt-4 max-w-prose text-body-lg text-charcoal-soft">
                  {L(item.summary)}
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-label font-semibold uppercase text-charcoal-muted">
                    {c.audienceLabel}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {L(item.audiences).map((entry) => (
                      <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-label font-semibold uppercase text-charcoal-muted">
                    {c.differenceLabel}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {L(item.differentiators).map((entry) => (
                      <li key={entry} className="flex gap-2 text-body-sm text-charcoal-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-display-sm text-emerald-900">{c.itineraryTitle}</h2>
                <div className="mt-4">
                  <ItineraryPanel days={item.itinerary} idPrefix={item.slug} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <HealthRow label={c.pricePerPilgrim} value={price} fallback={c.notPublished} />
              <HealthRow
                label={c.duration}
                value={item.duration ? L(item.duration) : null}
                fallback={c.notPublished}
              />
              <HealthRow label={c.departure} value={departure} fallback={c.notPublished} />
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h3 className="text-body font-semibold text-emerald-900">{c.helpTitle}</h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.helpBody}</p>
                <ButtonLink to={consult} variant="primary" className="mt-4">
                  {chrome[lang].cta.consultPackage}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <h2 className="text-display-md text-emerald-900">{c.lodgingTitle}</h2>
          <p className="mt-3 max-w-prose text-body text-charcoal-soft">{c.lodgingIntro}</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <HotelPanel hotel={item.makkahHotel} city={both("Makkah")} />
            <HotelPanel hotel={item.madinahHotel} city={both("Madinah")} />
          </div>
        </div>
      </section>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-display-sm text-emerald-900">{c.facilitiesTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.facilitiesIntro}</p>
              </div>

              {included.length === 0 && excluded.length === 0 ? (
                <PendingPanel
                  label={c.facilitiesPendingLabel}
                  description={c.facilitiesPendingBody}
                  willShow={c.facilitiesPendingWillShow}
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <FacilityList
                    title={c.includedTitle}
                    items={included}
                    emptyLabel={c.facilityEmpty}
                  />
                  <FacilityList
                    title={c.excludedTitle}
                    items={excluded}
                    emptyLabel={c.facilityEmpty}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h3 className="text-body-lg font-semibold text-emerald-900">{c.manasikTitle}</h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.manasikBody}</p>
                <Link
                  to="/panduan/manasik-yang-sebaiknya-dipahami-sebelum-berangkat"
                  className="mt-3 inline-block rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                >
                  {c.manasikLink}
                </Link>
              </div>

              <PendingPanel
                label={c.docsLabel}
                description={c.docsBody}
                willShow={c.docsWillShow}
              />

              <PendingPanel
                label={c.guideLabel}
                description={c.guideBody}
                willShow={c.guideWillShow}
                action={
                  <ButtonLink to="/pembimbing" variant="outline">
                    {c.guideAction}
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
              <h2 className="text-display-md text-emerald-900">{c.faqTitle}</h2>
              <p className="mt-3 max-w-prose text-body text-charcoal-soft">{c.faqIntro}</p>
              <ButtonLink to="/syarat-ketentuan" variant="outline" className="mt-5">
                {c.faqAction}
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
            <p className="text-label font-semibold uppercase text-charcoal-muted">
              {c.stickyPrice}
            </p>
            <p className="tabular truncate text-body font-semibold text-emerald-900">
              {price ?? c.notPublished}
            </p>
          </div>
          <ButtonLink to={consult} variant="accent" className="min-h-12 shrink-0">
            {chrome[lang].cta.consultPackage}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function HealthRow({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string | null;
  fallback: string;
}) {
  return (
    <div className="border-b border-emerald-100 pb-4">
      <p className="text-label font-semibold uppercase text-charcoal-muted">{label}</p>
      {value ? (
        <p className="tabular mt-1 text-display-sm text-emerald-900">{value}</p>
      ) : (
        <p className="mt-1 text-body-sm text-charcoal-soft">{fallback}</p>
      )}
    </div>
  );
}

function FacilityList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-shell p-5">
      <h3 className="text-body font-semibold text-emerald-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-body-sm text-charcoal-soft">{emptyLabel}</p>
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
