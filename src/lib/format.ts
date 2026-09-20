import type { Availability } from "../content/types";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** Returns null when the value is absent so callers render a pending state. */
export function formatRupiah(value: number | null): string | null {
  if (value === null || Number.isNaN(value)) return null;
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function formatDeparture(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * The departure date is typeset in two parts: a large day number and a smaller
 * month with year. A single long string such as "14 Januari 2027" does not fit
 * a narrow date column at any heading size without wrapping badly.
 */
export function splitDeparture(iso: string | null): { day: string; rest: string } | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    rest: `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
  };
}

/** Accepts the `YYYY-MM` form stored on packages. */
export function formatMonth(value: string | null): string | null {
  if (!value) return null;
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !MONTHS[index]) return null;
  return `${MONTHS[index]} ${year}`;
}

export interface AvailabilityMeta {
  label: string;
  /** Shape carries the meaning, colour only reinforces it. */
  marker: "solid" | "half" | "slash" | "outline";
  /** Text colour on light surfaces. Each clears 4.5:1 on the shell. */
  className: string;
  /** Text colour on emerald panels. */
  darkClassName: string;
  description: string;
}

export const availabilityMeta: Record<Availability, AvailabilityMeta> = {
  available: {
    label: "Tersedia",
    marker: "solid",
    className: "text-status-available",
    darkClassName: "text-status-available-dark",
    description: "Masih dapat dipesan.",
  },
  limited: {
    label: "Seat terbatas",
    marker: "half",
    className: "text-status-limited",
    darkClassName: "text-status-limited-dark",
    description: "Sisa kursi sedikit pada program ini.",
  },
  full: {
    label: "Penuh",
    marker: "slash",
    className: "text-status-full",
    darkClassName: "text-status-full-dark",
    description: "Kursi pada program ini sudah terisi.",
  },
  unknown: {
    label: "Belum dibuka",
    marker: "outline",
    className: "text-charcoal-muted",
    darkClassName: "text-emerald-300",
    description: "Status ketersediaan belum ditetapkan.",
  },
};

export const availabilityOrder: Availability[] = ["available", "limited", "full", "unknown"];

export function sortByAvailability<T extends { availability: Availability }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => availabilityOrder.indexOf(a.availability) - availabilityOrder.indexOf(b.availability),
  );
}
