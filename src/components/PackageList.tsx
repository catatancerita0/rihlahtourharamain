import { Link } from "react-router-dom";
import type { TravelPackage } from "../content/types";
import { formatDeparture, formatMonth, formatRupiah } from "../lib/format";
import { categoryLabels, programLabels } from "../lib/packages";
import { ButtonLink } from "./ui/Button";
import { DefinitionList, type DefinitionRow } from "./ui/DefinitionList";
import { EmptyState } from "./ui/EmptyState";
import { Media } from "./ui/Media";
import { StatusBadge } from "./ui/StatusBadge";
import { Tag } from "./ui/Tag";

function detailPath(item: TravelPackage): string {
  const base = item.category === "umrah" ? "/paket-umrah" : "/paket-haji";
  return `${base}/${item.slug}`;
}

function departureLabel(item: TravelPackage): string | null {
  return formatDeparture(item.departureDate) ?? formatMonth(item.departureMonth);
}

export function PackageCard({ item }: { item: TravelPackage }) {
  const price = formatRupiah(item.price);
  const rows: DefinitionRow[] = [
    { label: "Durasi", value: item.duration, pending: "Durasi belum ditetapkan" },
    {
      label: "Keberangkatan",
      value: departureLabel(item),
      pending: "Tanggal belum ditetapkan",
    },
    { label: "Maskapai", value: item.airline, pending: "Maskapai belum ditetapkan" },
    { label: "Hotel Makkah", value: item.makkahHotel?.name ?? null, pending: "Hotel belum ditetapkan" },
    { label: "Hotel Madinah", value: item.madinahHotel?.name ?? null, pending: "Hotel belum ditetapkan" },
  ];

  return (
    <article className="flex flex-col gap-5 rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
      {/* Only packages with a real photo get one. A card without one keeps the
          denser layout instead of showing an empty frame. */}
      {item.thumbnail ? <Media src={item.thumbnail} alt={item.name} ratio="3/2" /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tag>
          {categoryLabels[item.category]} · {programLabels[item.type]}
        </Tag>
        <StatusBadge status={item.availability} showDescription />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-display-sm text-emerald-900">
          <Link to={detailPath(item)} className="rounded-sm hover:text-emerald-700">
            {item.name}
          </Link>
        </h3>
        <p className="max-w-prose text-body-sm text-charcoal-soft">{item.focus}</p>
      </div>

      <DefinitionList rows={rows} />

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-emerald-100 pt-5">
        <div>
          <p className="text-label font-semibold uppercase text-charcoal-muted">Harga per jamaah</p>
          {price ? (
            <p className="tabular text-display-sm text-emerald-900">{price}</p>
          ) : (
            <p className="text-body-sm text-charcoal-soft">Belum dipublikasikan</p>
          )}
          {item.priceNote ? (
            <p className="mt-1 text-body-sm text-charcoal-muted">{item.priceNote}</p>
          ) : null}
        </div>
        <ButtonLink to={detailPath(item)} variant="outline">
          Lihat Detail Paket
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
  if (items.length === 0) {
    return (
      <EmptyState
        title={active ? "Belum ada jadwal yang sesuai filter Anda." : "Belum ada paket yang dipublikasikan."}
        description={
          active
            ? "Filter yang Anda pakai tidak cocok dengan program yang sedang dibuka. Coba longgarkan jenis atau program, atau sampaikan kebutuhan Anda lewat konsultasi supaya tim menyiapkan susunan khusus."
            : "Program Umrah sudah dijelaskan di atas, tetapi jadwal dan harga untuk keberangkatan berikutnya belum dipublikasikan. Jadwal akan muncul di sini begitu ditetapkan, dan Anda bisa meminta informasi lebih awal lewat konsultasi."
        }
        action={
          <>
            <ButtonLink to="/konsultasi" variant="primary">
              Konsultasikan Rencana Umrah
            </ButtonLink>
            <ButtonLink to="/jadwal" variant="outline">
              Lihat Jadwal Keberangkatan
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
          Lihat {items.length} program Umrah
        </ButtonLink>
      ) : null}
    </div>
  );
}
