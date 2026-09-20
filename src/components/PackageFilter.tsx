import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Field";
import { Tag } from "./ui/Tag";
import type { PackageCategory, ProgramType } from "../content/types";
import { categoryLabels, programLabels } from "../lib/packages";
import type { BudgetBand } from "../lib/packages";
import type { PackageFilterState } from "../lib/packages";

interface PackageFilterProps {
  idPrefix: string;
  state: PackageFilterState;
  update: <K extends keyof PackageFilterState>(key: K, value: PackageFilterState[K]) => void;
  reset: () => void;
  active: boolean;
  months: Array<{ value: string; label: string }>;
  bands: BudgetBand[];
  resultCount: number;
}

const categoryOptions: Array<{ value: PackageCategory | "all"; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "umrah", label: categoryLabels.umrah },
  { value: "haji", label: categoryLabels.haji },
];

const typeOptions: Array<{ value: ProgramType | "all"; label: string }> = [
  { value: "all", label: "Semua program" },
  { value: "reguler", label: programLabels.reguler },
  { value: "plus", label: programLabels.plus },
  { value: "private", label: programLabels.private },
];

/**
 * Month and budget read from published departure data. While that data does
 * not exist the controls are locked and say why, so nobody filters into an
 * empty result and assumes the site is broken.
 */
export function PackageFilter({
  idPrefix,
  state,
  update,
  reset,
  active,
  months,
  bands,
  resultCount,
}: PackageFilterProps) {
  const monthUnavailable = months.length === 0;
  const budgetUnavailable = bands.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <Input
        id={`${idPrefix}-keyword`}
        label="Cari program"
        type="search"
        placeholder="Contoh: private, plus, keluarga"
        value={state.keyword}
        onChange={(event) => update("keyword", event.target.value)}
        hint="Kata kunci dicocokkan dengan nama dan keterangan program."
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-body-sm font-semibold text-charcoal">Jenis perjalanan</legend>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name={`${idPrefix}-category`}
                value={option.value}
                checked={state.category === option.value}
                onChange={() => update("category", option.value)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 cursor-pointer items-center rounded-md border border-emerald-400 px-4 text-body-sm font-semibold text-emerald-800 peer-checked:bg-emerald-800 peer-checked:text-shell peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-800">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Select
        id={`${idPrefix}-type`}
        label="Program"
        value={state.type}
        onChange={(event) => update("type", event.target.value as ProgramType | "all")}
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        id={`${idPrefix}-month`}
        label="Bulan keberangkatan"
        value={state.month}
        disabled={monthUnavailable}
        onChange={(event) => update("month", event.target.value)}
        hint={
          monthUnavailable
            ? "Belum ada bulan keberangkatan yang dipublikasikan, jadi filter ini belum dapat menyaring apa pun."
            : undefined
        }
      >
        <option value="">Semua bulan</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </Select>

      <Select
        id={`${idPrefix}-budget`}
        label="Kisaran anggaran"
        value={state.budget}
        disabled={budgetUnavailable}
        onChange={(event) => update("budget", event.target.value)}
        hint={
          budgetUnavailable
            ? "Filter anggaran aktif setelah harga paket dipublikasikan pada halaman jadwal."
            : undefined
        }
      >
        <option value="">Semua anggaran</option>
        {bands.map((band) => (
          <option key={band.id} value={band.id}>
            {band.label}
          </option>
        ))}
      </Select>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-5">
        <Tag>
          {resultCount} program cocok
        </Tag>
        <Button type="button" variant="outline" onClick={reset} disabled={!active}>
          Atur ulang filter
        </Button>
      </div>
    </div>
  );
}
