import type { PackageCategory, ProgramType, TravelPackage } from "../content/types";
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

/**
 * Bands are derived from the prices that actually exist. Until the business
 * publishes a price the list comes back empty, and the control stays locked
 * with an explanation rather than offering ranges nobody can match.
 */
export function deriveBudgetBands(items: TravelPackage[]): BudgetBand[] {
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
    const label =
      step.max === null
        ? `Di atas Rp${(min / 1_000_000).toFixed(0)} juta`
        : `Rp${(min / 1_000_000).toFixed(0)} - Rp${(step.max / 1_000_000).toFixed(0)} juta`;
    return { id: step.id, label, min, max: step.max };
  });
}

export function deriveMonths(items: TravelPackage[]): Array<{ value: string; label: string }> {
  const months = Array.from(
    new Set(
      items
        .map((item) => item.departureMonth)
        .filter((value): value is string => typeof value === "string"),
    ),
  ).sort();

  return months.map((value) => ({ value, label: formatMonth(value) ?? value }));
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function matchesKeyword(item: TravelPackage, keyword: string): boolean {
  const needle = normalize(keyword);
  if (!needle) return true;
  const haystack = [
    item.name,
    item.focus,
    item.summary,
    item.type,
    item.category,
    ...item.audiences,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterPackages(
  items: TravelPackage[],
  state: PackageFilterState,
  bands: BudgetBand[],
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
    return matchesKeyword(item, state.keyword);
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

export const categoryLabels: Record<PackageCategory, string> = {
  umrah: "Umrah",
  haji: "Haji",
};

export const programLabels: Record<ProgramType, string> = {
  reguler: "Reguler",
  plus: "Plus",
  private: "Private",
};
