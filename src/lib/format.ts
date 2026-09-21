import type { Availability } from "../content/types";
import { chrome } from "../i18n/strings";
import type { Lang } from "../i18n/types";

/**
 * Month names are translated rather than delegated to `toLocaleDateString`,
 * because Intl can silently fall back to the system locale in environments
 * without full ICU data, which would print an Indonesian date on the English
 * page. A lookup table cannot drift.
 */
const MONTHS: Record<Lang, string[]> = {
  id: [
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
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

/** Returns null when the value is absent so callers render a pending state. */
export function formatRupiah(value: number | null, lang: Lang): string | null {
  if (value === null || Number.isNaN(value)) return null;
  // The currency does not change with the interface language: a pilgrim pays
  // in rupiah either way, only the digit grouping follows the reader.
  return `Rp${value.toLocaleString(lang === "id" ? "id-ID" : "en-US")}`;
}

export function formatDeparture(iso: string | null, lang: Lang): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCDate()} ${MONTHS[lang][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * The departure date is typeset in two parts: a large day number and a smaller
 * month with year. A single long string such as "14 Januari 2027" does not fit
 * a narrow date column at any heading size without wrapping badly.
 */
export function splitDeparture(
  iso: string | null,
  lang: Lang,
): { day: string; rest: string } | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    rest: `${MONTHS[lang][date.getUTCMonth()]} ${date.getUTCFullYear()}`,
  };
}

/** Accepts the `YYYY-MM` form stored on packages. */
export function formatMonth(value: string | null, lang: Lang): string | null {
  if (!value) return null;
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !MONTHS[lang][index]) return null;
  return `${MONTHS[lang][index]} ${year}`;
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

/**
 * Shape and colour are a single table because they are a visual decision, while
 * the wording comes from the shared dictionary so the same status cannot read
 * two different ways on two pages.
 */
const AVAILABILITY_STYLE: Record<
  Availability,
  { marker: AvailabilityMeta["marker"]; className: string; darkClassName: string }
> = {
  available: {
    marker: "solid",
    className: "text-status-available",
    darkClassName: "text-status-available-dark",
  },
  limited: {
    marker: "half",
    className: "text-status-limited",
    darkClassName: "text-status-limited-dark",
  },
  full: {
    marker: "slash",
    className: "text-status-full",
    darkClassName: "text-status-full-dark",
  },
  unknown: {
    marker: "outline",
    className: "text-charcoal-muted",
    darkClassName: "text-emerald-300",
  },
};

export function availabilityMetaFor(availability: Availability, lang: Lang): AvailabilityMeta {
  const copy = chrome[lang].availability[availability];
  return { ...AVAILABILITY_STYLE[availability], label: copy.label, description: copy.description };
}

export const availabilityOrder: Availability[] = ["available", "limited", "full", "unknown"];

export function sortByAvailability<T extends { availability: Availability }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => availabilityOrder.indexOf(a.availability) - availabilityOrder.indexOf(b.availability),
  );
}
