import { useMemo, useState } from "react";
import type { TravelPackage } from "../content/types";
import { useLang } from "../i18n/LanguageProvider";
import {
  deriveBudgetBands,
  deriveMonths,
  emptyFilter,
  filterPackages,
  isFilterActive,
  type PackageFilterState,
} from "../lib/packages";

export function usePackageFilter(items: TravelPackage[], initial?: Partial<PackageFilterState>) {
  const lang = useLang();
  const [state, setState] = useState<PackageFilterState>({ ...emptyFilter, ...initial });

  const bands = useMemo(() => deriveBudgetBands(items, lang), [items, lang]);
  const months = useMemo(() => deriveMonths(items, lang), [items, lang]);
  const results = useMemo(
    () => filterPackages(items, state, bands, lang),
    [items, state, bands, lang],
  );

  function update<K extends keyof PackageFilterState>(key: K, value: PackageFilterState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setState({ ...emptyFilter, ...initial });
  }

  return {
    state,
    update,
    reset,
    results,
    bands,
    months,
    active: isFilterActive(state),
    /** Month and budget cannot narrow anything until data exists. */
    monthAvailable: months.length > 0,
    budgetAvailable: bands.length > 0,
  };
}
