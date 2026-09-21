import { DepartureCard, StatusLegend } from "../components/DepartureCard";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Tag } from "../components/ui/Tag";
import { packages } from "../content/packages";
import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { sortByAvailability } from "../lib/format";

const idCopy = {
  eyebrow: "Jadwal",
  title: "Kapan Anda ingin berangkat?",
  intro:
    "Halaman ini disusun untuk memilih keberangkatan, bukan untuk membaca katalog. Tiap baris menampilkan tanggal, durasi, maskapai, harga, dan sisa kursi pada satu tempat.",
  listEyebrow: "Daftar keberangkatan",
  listTitle: "Keberangkatan terdekat",
  scheduled: (count: number) => `${count} terjadwal`,
  emptyTitle: "Belum ada tanggal keberangkatan yang ditetapkan.",
  emptyBody:
    "Tanggal, maskapai, penginapan, dan harga untuk keberangkatan berikutnya masih dalam proses penetapan. Kami tidak mengisi kekosongan ini dengan perkiraan, karena angka sementara membuat orang mendaftar dengan ekspektasi yang salah.",
  askSchedule: "Minta kabar jadwal terbaru",
  seePrograms: "Lihat program Umrah",
  legendTitle: "Arti tanda ketersediaan",
  legendIntro: "Bentuk dan tulisan yang membedakan status, bukan hanya warna.",
  rowsTitle: "Yang muncul di tiap baris",
  rows: [
    "Tanggal keberangkatan",
    "Durasi dan jumlah malam",
    "Maskapai yang dipakai",
    "Hotel Makkah dan Madinah",
    "Harga per jamaah",
    "Sisa kursi dan status pendaftaran",
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Schedule",
  title: "When would you like to depart?",
  intro:
    "This page is built for choosing a departure, not for browsing a catalogue. Each row puts the date, duration, airline, price and remaining seats in one place.",
  listEyebrow: "Departure list",
  listTitle: "Upcoming departures",
  scheduled: (count: number) => `${count} scheduled`,
  emptyTitle: "No departure date has been set yet.",
  emptyBody:
    "Dates, airlines, accommodation and prices for upcoming departures are still being settled. We do not fill this gap with estimates, because provisional figures lead people to register with the wrong expectations.",
  askSchedule: "Ask for the latest schedule",
  seePrograms: "See Umrah programmes",
  legendTitle: "What the availability marks mean",
  legendIntro: "Shape and text carry the status, not colour alone.",
  rowsTitle: "What each row shows",
  rows: [
    "Departure date",
    "Duration and number of nights",
    "Airline used",
    "Hotels in Makkah and Madinah",
    "Price per pilgrim",
    "Remaining seats and registration status",
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function SchedulePage() {
  const c = useCopy(copy);
  const withDates = packages.filter(
    (item) => item.departureDate !== null || item.departureMonth !== null,
  );

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <SectionHeading as="h2" eyebrow={c.listEyebrow} title={c.listTitle} />
                <Tag>{c.scheduled(withDates.length)}</Tag>
              </div>

              <div className="mt-8 flex flex-col gap-5">
                {withDates.length === 0 ? (
                  <EmptyState
                    title={c.emptyTitle}
                    description={c.emptyBody}
                    action={
                      <>
                        <ButtonLink to="/konsultasi" variant="primary">
                          {c.askSchedule}
                        </ButtonLink>
                        <ButtonLink to="/paket-umrah" variant="outline">
                          {c.seePrograms}
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
                <h2 className="text-display-sm text-emerald-900">{c.legendTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.legendIntro}</p>
                <div className="mt-5">
                  <StatusLegend />
                </div>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.rowsTitle}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {c.rows.map((entry) => (
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
