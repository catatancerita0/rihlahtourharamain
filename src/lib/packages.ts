import type { PackageCategory, ProgramType, TravelPackage } from "../content/types";
import { both, t } from "../i18n/types";
import type { Lang, Localized } from "../i18n/types";
import { formatMonth } from "./format";

export interface PackageFilterState {
  keyword: string;
  category: PackageCategory | "all";
  type: ProgramType | "all";
  /** `YYYY-MM`, or empty for every month. */
  month: string;
  /** Band id from budgetBands, or empty for every price. */
  budget: string;
}

export const emptyFilter: PackageFilterState = {
  keyword: "",
  category: "all",
  type: "all",
  month: "",
  budget: "",
};

export interface BudgetBand {
  id: string;
  label: string;
  min: number;
  /** null means open ended. */
  max: number | null;
}

const BUDGET_STEPS: Array<{ id: string; max: number | null }> = [
  { id: "b1", max: 30_000_000 },
  { id: "b2", max: 40_000_000 },
  { id: "b3", max: 55_000_000 },
  { id: "b4", max: null },
];

function bandLabel(min: number, max: number | null, lang: Lang): string {
  const millions = (value: number) => (value / 1_000_000).toFixed(0);
  if (max === null) {
    return lang === "id"
      ? `Di atas Rp${millions(min)} juta`
      : `Above Rp${millions(min)} million`;
  }
  return lang === "id"
    ? `Rp${millions(min)} - Rp${millions(max)} juta`
    : `Rp${millions(min)} - ${millions(max)} million`;
}

/**
 * Bands are derived from the prices that actually exist. Until the business
 * publishes a price the list comes back empty, and the control stays locked
 * with an explanation rather than offering ranges nobody can match.
 */
export function deriveBudgetBands(items: TravelPackage[], lang: Lang): BudgetBand[] {
  const prices = items
    .map((item) => item.price)
    .filter((price): price is number => typeof price === "number");

  if (prices.length === 0) return [];

  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  return BUDGET_STEPS.filter((step) => {
    if (step.max === null) return highest > BUDGET_STEPS[BUDGET_STEPS.length - 2].max!;
    return step.max >= lowest;
  }).map((step, index, list) => {
    const previous = index === 0 ? null : list[index - 1].max;
    const min = previous === null ? 0 : previous;
    return { id: step.id, label: bandLabel(min, step.max, lang), min, max: step.max };
  });
}

export function deriveMonths(
  items: TravelPackage[],
  lang: Lang,
): Array<{ value: string; label: string }> {
  const months = Array.from(
    new Set(
      items
        .map((item) => item.departureMonth)
        .filter((value): value is string => typeof value === "string"),
    ),
  ).sort();

  return months.map((value) => ({ value, label: formatMonth(value, lang) ?? value }));
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

/**
 * Search runs against the text the reader is actually looking at, so an English
 * reader cannot get a hit on Indonesian words they cannot see, and vice versa.
 * The programme type is included in both spellings because it is a label, not
 * prose: someone typing "reguler" on the English page still means that filter.
 */
function matchesKeyword(item: TravelPackage, keyword: string, lang: Lang): boolean {
  const needle = normalize(keyword);
  if (!needle) return true;
  const haystack = [
    item.name[lang],
    item.focus[lang],
    item.summary[lang],
    programLabels[item.type][lang],
    programLabels[item.type].id,
    categoryLabels[item.category][lang],
    categoryLabels[item.category].id,
    ...item.audiences[lang],
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterPackages(
  items: TravelPackage[],
  state: PackageFilterState,
  bands: BudgetBand[],
  lang: Lang,
): TravelPackage[] {
  const band = bands.find((entry) => entry.id === state.budget) ?? null;

  return items.filter((item) => {
    if (state.category !== "all" && item.category !== state.category) return false;
    if (state.type !== "all" && item.type !== state.type) return false;
    if (state.month && item.departureMonth !== state.month) return false;
    if (band) {
      if (item.price === null) return false;
      if (item.price < band.min) return false;
      if (band.max !== null && item.price > band.max) return false;
    }
    return matchesKeyword(item, state.keyword, lang);
  });
}

export function isFilterActive(state: PackageFilterState): boolean {
  return (
    state.keyword.trim() !== "" ||
    state.category !== "all" ||
    state.type !== "all" ||
    state.month !== "" ||
    state.budget !== ""
  );
}

/** "Umrah" and "Haji" are the programme names in both languages. */
export const categoryLabels: Record<PackageCategory, Localized<string>> = {
  umrah: both("Umrah"),
  haji: both("Haji"),
};

export const programLabels: Record<ProgramType, Localized<string>> = {
  reguler: t("Reguler", "Regular"),
  plus: both("Plus"),
  private: both("Private"),
};
