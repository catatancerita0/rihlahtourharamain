import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider";
import { promosForPackage, todayIso } from "../content/bundle";
import type { TravelPackage } from "../content/types";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import type { Lang, Localized } from "../i18n/types";
import { formatDeparture, formatMonth, formatRupiah } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";
import { ButtonLink } from "./ui/Button";
import { DefinitionList, type DefinitionRow } from "./ui/DefinitionList";
import { EmptyState } from "./ui/EmptyState";
import { Media } from "./ui/Media";
import { PromoBadge } from "./PromoNotice";
import { StatusBadge } from "./ui/StatusBadge";
import { Tag } from "./ui/Tag";

function detailPath(item: TravelPackage): string {
  const base = item.category === "umrah" ? "/paket-umrah" : "/paket-haji";
  return `${base}/${item.slug}`;
}

function departureLabel(item: TravelPackage, lang: Lang): string | null {
  return formatDeparture(item.departureDate, lang) ?? formatMonth(item.departureMonth, lang);
}

const idCopy = {
  duration: "Durasi",
  durationPending: "Durasi belum ditetapkan",
  departure: "Keberangkatan",
  departurePending: "Tanggal belum ditetapkan",
  airline: "Maskapai",
  airlinePending: "Maskapai belum ditetapkan",
  makkahHotel: "Hotel Makkah",
  madinahHotel: "Hotel Madinah",
  hotelPending: "Hotel belum ditetapkan",
  pricePerPilgrim: "Harga per jamaah",
  notPublished: "Belum dipublikasikan",
  seeDetails: "Lihat Detail Paket",
  emptyFilteredTitle: "Belum ada jadwal yang sesuai filter Anda.",
  emptyFilteredBody:
    "Filter yang Anda pakai tidak cocok dengan program yang sedang dibuka. Coba longgarkan jenis atau program, atau sampaikan kebutuhan Anda lewat konsultasi supaya tim menyiapkan susunan khusus.",
  emptyTitle: "Belum ada paket yang dipublikasikan.",
  emptyBody:
    "Program Umrah sudah dijelaskan di atas, tetapi jadwal dan harga untuk keberangkatan berikutnya belum dipublikasikan. Jadwal akan muncul di sini begitu ditetapkan, dan Anda bisa meminta informasi lebih awal lewat konsultasi.",
  seeAll: (count: number) => `Lihat ${count} program Umrah`,
};

const enCopy: typeof idCopy = {
  duration: "Duration",
  durationPending: "Duration not set yet",
  departure: "Departure",
  departurePending: "Date not set yet",
  airline: "Airline",
  airlinePending: "Airline not set yet",
  makkahHotel: "Hotel in Makkah",
  madinahHotel: "Hotel in Madinah",
  hotelPending: "Hotel not set yet",
  pricePerPilgrim: "Price per pilgrim",
  notPublished: "Not published yet",
  seeDetails: "See package details",
  emptyFilteredTitle: "No departure matches your filters.",
  emptyFilteredBody:
    "The filters you used do not match any programme that is currently open. Try loosening the trip type or programme, or tell us what you need through a consultation so the team can put together a custom arrangement.",
  emptyTitle: "No packages have been published yet.",
  emptyBody:
    "The Umrah programmes are explained above, but the schedule and price for the next departure have not been published. The schedule will appear here once it is set, and you can ask for information earlier through a consultation.",
  seeAll: (count: number) => `See ${count} Umrah programmes`,
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function PackageCard({ item }: { item: TravelPackage }) {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const { promos } = useContent();
  const activePromos = promosForPackage(promos, item.slug, todayIso());
  const price = formatRupiah(item.price, lang);
  const rows: DefinitionRow[] = [
    { label: c.duration, value: item.duration ? L(item.duration) : null, pending: c.durationPending },
    {
      label: c.departure,
      value: departureLabel(item, lang),
      pending: c.departurePending,
    },
    { label: c.airline, value: item.airline ? L(item.airline) : null, pending: c.airlinePending },
    {
      label: c.makkahHotel,
      value: item.makkahHotel ? L(item.makkahHotel.name) : null,
      pending: c.hotelPending,
    },
    {
      label: c.madinahHotel,
      value: item.madinahHotel ? L(item.madinahHotel.name) : null,
      pending: c.hotelPending,
    },
  ];

  return (
    <article className="flex flex-col gap-5 rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
      {/* Only packages with a real photo get one. A card without one keeps the
          denser layout instead of showing an empty frame. */}
      {item.thumbnail ? <Media src={item.thumbnail} alt={L(item.name)} ratio="3/2" /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Tag>
            {categoryLabels[item.category][lang]} · {programLabels[item.type][lang]}
          </Tag>
          <PromoBadge promos={activePromos} />
        </div>
        <StatusBadge status={item.availability} showDescription />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-display-sm text-emerald-900">
          <Link to={detailPath(item)} className="rounded-sm hover:text-emerald-700">
            {L(item.name)}
          </Link>
        </h3>
        <p className="max-w-prose text-body-sm text-charcoal-soft">{L(item.focus)}</p>
      </div>

      <DefinitionList rows={rows} />

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-emerald-100 pt-5">
        <div>
          <p className="text-label font-semibold uppercase text-charcoal-muted">
            {c.pricePerPilgrim}
          </p>
          {price ? (
            <p className="tabular text-display-sm text-emerald-900">{price}</p>
          ) : (
            <p className="text-body-sm text-charcoal-soft">{c.notPublished}</p>
          )}
          {item.priceNote ? (
            <p className="mt-1 text-body-sm text-charcoal-muted">{L(item.priceNote)}</p>
          ) : null}
        </div>
        <ButtonLink to={detailPath(item)} variant="outline">
          {c.seeDetails}
        </ButtonLink>
      </div>
    </article>
  );
}

interface PackageResultsProps {
  items: TravelPackage[];
  active: boolean;
  /** The homepage finder shows the first few and links to the full list. */
  limit?: number;
}

export function PackageResults({ items, active, limit }: PackageResultsProps) {
  const c = useCopy(copy);
  const cta = chrome[useLang()].cta;

  if (items.length === 0) {
    return (
      <EmptyState
        title={active ? c.emptyFilteredTitle : c.emptyTitle}
        description={active ? c.emptyFilteredBody : c.emptyBody}
        action={
          <>
            <ButtonLink to="/konsultasi" variant="primary">
              {cta.consultPlan}
            </ButtonLink>
            <ButtonLink to="/jadwal" variant="outline">
              {cta.viewSchedule}
            </ButtonLink>
          </>
        }
      />
    );
  }

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className="flex flex-col gap-5">
      <ul className="grid gap-5 lg:grid-cols-2">
        {visible.map((item) => (
          <li key={item.id}>
            <PackageCard item={item} />
          </li>
        ))}
      </ul>
      {limit && items.length > limit ? (
        <ButtonLink to="/paket-umrah" variant="outline" className="self-start">
          {c.seeAll(items.length)}
        </ButtonLink>
      ) : null}
    </div>
  );
}
