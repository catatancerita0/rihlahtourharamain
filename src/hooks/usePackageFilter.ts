import { useMemo, useState } from "react";
import type { TravelPackage } from "../content/types";
import {
  deriveBudgetBands,
  deriveMonths,
  emptyFilter,
  filterPackages,
  isFilterActive,
  type PackageFilterState,
} from "../lib/packages";

export function usePackageFilter(items: TravelPackage[], initial?: Partial<PackageFilterState>) {
  const [state, setState] = useState<PackageFilterState>({ ...emptyFilter, ...initial });

  const bands = useMemo(() => deriveBudgetBands(items), [items]);
  const months = useMemo(() => deriveMonths(items), [items]);
  const results = useMemo(() => filterPackages(items, state, bands), [items, state, bands]);

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
