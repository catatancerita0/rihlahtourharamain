import { Link } from "react-router-dom";
import type { TravelPackage } from "../content/types";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { formatMonth, formatRupiah, splitDeparture } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";
import { StatusBadge } from "./ui/StatusBadge";
import { Tag } from "./ui/Tag";

const idCopy = {
  noDate: "Belum ada",
  datePending: "tanggal ditetapkan",
  duration: "Durasi",
  airline: "Maskapai",
  price: "Harga",
  notSet: "belum ditetapkan",
  notPublished: "belum dipublikasikan",
};

const enCopy: typeof idCopy = {
  noDate: "No date",
  datePending: "set yet",
  duration: "Duration",
  airline: "Airline",
  price: "Price",
  notSet: "not set yet",
  notPublished: "not published yet",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const pendingRow = "text-body-sm text-charcoal-muted";

export function DepartureCard({ item }: { item: TravelPackage }) {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const parts = splitDeparture(item.departureDate, lang);
  const month = formatMonth(item.departureMonth, lang);
  const price = formatRupiah(item.price, lang);
  const path = `${item.category === "umrah" ? "/paket-umrah" : "/paket-haji"}/${item.slug}`;

  return (
    <article className="grid gap-4 rounded-lg border border-emerald-100 bg-shell p-5 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:p-6">
      {/* The date block is the first thing a jamaah scans for, so it gets its
          own column instead of being one more line in the meta list. */}
      <div className="flex flex-col gap-1 border-emerald-100 sm:border-r sm:pr-6">
        {parts ? (
          <>
            <p className="tabular font-display text-[2.5rem] leading-none text-emerald-900">
              {parts.day}
            </p>
            <p className="break-words text-body-sm font-semibold text-emerald-900">
              {parts.rest}
            </p>
          </>
        ) : month ? (
          <p className="break-words text-body-lg font-semibold text-emerald-900">{month}</p>
        ) : (
          <>
            <p className="text-body-lg font-semibold text-charcoal-muted">{c.noDate}</p>
            <p className={pendingRow}>{c.datePending}</p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Tag>
            {categoryLabels[item.category][lang]} · {programLabels[item.type][lang]}
          </Tag>
          <StatusBadge status={item.availability} showDescription />
        </div>

        <h3 className="text-display-sm text-emerald-900">
          <Link to={path} className="rounded-sm hover:text-emerald-700">
            {L(item.name)}
          </Link>
        </h3>

        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">{c.duration}</dt>
            <dd className={item.duration ? "text-charcoal" : pendingRow}>
              {item.duration ? L(item.duration) : c.notSet}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">{c.airline}</dt>
            <dd className={item.airline ? "text-charcoal" : pendingRow}>
              {item.airline ? L(item.airline) : c.notSet}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">{c.price}</dt>
            <dd className={price ? "tabular text-charcoal" : pendingRow}>
              {price ?? c.notPublished}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/**
 * The legend exists because status is carried by shape and text, not colour
 * alone, and readers deserve to know what each shape means.
 */
export function StatusLegend() {
  const c = useCopy(legendCopy);

  const entries: Array<TravelPackage["availability"]> = [
    "available",
    "limited",
    "full",
    "unknown",
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {entries.map((status) => (
        <div key={status} className="flex flex-col gap-1">
          <dt>
            <StatusBadge status={status} />
          </dt>
          <dd className="text-body-sm text-charcoal-soft">{c[status]}</dd>
        </div>
      ))}
    </dl>
  );
}

const idLegend = {
  available: "Masih ada kursi dan pendaftaran dibuka.",
  limited: "Sisa kursi sedikit, sebaiknya konfirmasi lebih dulu.",
  full: "Kursi sudah terisi, pendaftaran ditutup.",
  unknown: "Status ketersediaan belum ditetapkan oleh tim.",
};

const enLegend: typeof idLegend = {
  available: "Seats are still available and registration is open.",
  limited: "Only a few seats left, so it is better to confirm first.",
  full: "Every seat is taken and registration is closed.",
  unknown: "The seat status has not been set by the team.",
};

const legendCopy: Localized<typeof idLegend> = { id: idLegend, en: enLegend };
