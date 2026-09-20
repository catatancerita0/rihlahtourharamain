import { Link } from "react-router-dom";
import type { TravelPackage } from "../content/types";
import { formatMonth, formatRupiah, splitDeparture } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";
import { StatusBadge } from "./ui/StatusBadge";
import { Tag } from "./ui/Tag";

const pendingRow = "text-body-sm text-charcoal-muted";

export function DepartureCard({ item }: { item: TravelPackage }) {
  const parts = splitDeparture(item.departureDate);
  const month = formatMonth(item.departureMonth);
  const price = formatRupiah(item.price);
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
            <p className="text-body-lg font-semibold text-charcoal-muted">Belum ada</p>
            <p className={pendingRow}>tanggal ditetapkan</p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Tag>
            {categoryLabels[item.category]} · {programLabels[item.type]}
          </Tag>
          <StatusBadge status={item.availability} showDescription />
        </div>

        <h3 className="text-display-sm text-emerald-900">
          <Link to={path} className="rounded-sm hover:text-emerald-700">
            {item.name}
          </Link>
        </h3>

        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">Durasi</dt>
            <dd className={item.duration ? "text-charcoal" : pendingRow}>
              {item.duration ?? "belum ditetapkan"}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">Maskapai</dt>
            <dd className={item.airline ? "text-charcoal" : pendingRow}>
              {item.airline ?? "belum ditetapkan"}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-charcoal-muted">Harga</dt>
            <dd className={price ? "tabular text-charcoal" : pendingRow}>
              {price ?? "belum dipublikasikan"}
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
  const entries: Array<{ status: TravelPackage["availability"]; meaning: string }> = [
    { status: "available", meaning: "Masih ada kursi dan pendaftaran dibuka." },
    { status: "limited", meaning: "Sisa kursi sedikit, sebaiknya konfirmasi lebih dulu." },
    { status: "full", meaning: "Kursi sudah terisi, pendaftaran ditutup." },
    { status: "unknown", meaning: "Status ketersediaan belum ditetapkan oleh tim." },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {entries.map((entry) => (
        <div key={entry.status} className="flex flex-col gap-1">
          <dt>
            <StatusBadge status={entry.status} />
          </dt>
          <dd className="text-body-sm text-charcoal-soft">{entry.meaning}</dd>
        </div>
      ))}
    </dl>
  );
}
