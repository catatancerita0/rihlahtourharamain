import type { PackageCategory, ProgramType } from "../content/types";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { categoryLabels, programLabels } from "../lib/packages";
import type { BudgetBand, PackageFilterState } from "../lib/packages";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Field";
import { Tag } from "./ui/Tag";

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

const idCopy = {
  keywordLabel: "Cari program",
  keywordPlaceholder: "Contoh: private, plus, keluarga",
  keywordHint: "Kata kunci dicocokkan dengan nama dan keterangan program.",
  all: "Semua",
  allPrograms: "Semua program",
  tripType: "Jenis perjalanan",
  program: "Program",
  monthLabel: "Bulan keberangkatan",
  monthLocked:
    "Belum ada bulan keberangkatan yang dipublikasikan, jadi filter ini belum dapat menyaring apa pun.",
  allMonths: "Semua bulan",
  budgetLabel: "Kisaran anggaran",
  budgetLocked:
    "Filter anggaran aktif setelah harga paket dipublikasikan pada halaman jadwal.",
  allBudgets: "Semua anggaran",
  matched: (count: number) => `${count} program cocok`,
  reset: "Atur ulang filter",
};

const enCopy: typeof idCopy = {
  keywordLabel: "Search programmes",
  keywordPlaceholder: "For example: private, plus, family",
  keywordHint: "Keywords are matched against the programme name and description.",
  all: "All",
  allPrograms: "All programmes",
  tripType: "Trip type",
  program: "Programme",
  monthLabel: "Departure month",
  monthLocked:
    "No departure month has been published yet, so this filter cannot narrow anything at the moment.",
  allMonths: "All months",
  budgetLabel: "Budget range",
  budgetLocked:
    "The budget filter becomes active once package prices are published on the schedule page.",
  allBudgets: "Any budget",
  matched: (count: number) => `${count} matching programmes`,
  reset: "Reset filters",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

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
  const c = useCopy(copy);
  const lang = useLang();
  const monthUnavailable = months.length === 0;
  const budgetUnavailable = bands.length === 0;

  const categoryOptions: Array<{ value: PackageCategory | "all"; label: string }> = [
    { value: "all", label: c.all },
    { value: "umrah", label: categoryLabels.umrah[lang] },
    { value: "haji", label: categoryLabels.haji[lang] },
  ];

  const typeOptions: Array<{ value: ProgramType | "all"; label: string }> = [
    { value: "all", label: c.allPrograms },
    { value: "reguler", label: programLabels.reguler[lang] },
    { value: "plus", label: programLabels.plus[lang] },
    { value: "private", label: programLabels.private[lang] },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Input
        id={`${idPrefix}-keyword`}
        label={c.keywordLabel}
        type="search"
        placeholder={c.keywordPlaceholder}
        value={state.keyword}
        onChange={(event) => update("keyword", event.target.value)}
        hint={c.keywordHint}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-body-sm font-semibold text-charcoal">{c.tripType}</legend>
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
        label={c.program}
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
        label={c.monthLabel}
        value={state.month}
        disabled={monthUnavailable}
        onChange={(event) => update("month", event.target.value)}
        hint={monthUnavailable ? c.monthLocked : undefined}
      >
        <option value="">{c.allMonths}</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </Select>

      <Select
        id={`${idPrefix}-budget`}
        label={c.budgetLabel}
        value={state.budget}
        disabled={budgetUnavailable}
        onChange={(event) => update("budget", event.target.value)}
        hint={budgetUnavailable ? c.budgetLocked : undefined}
      >
        <option value="">{c.allBudgets}</option>
        {bands.map((band) => (
          <option key={band.id} value={band.id}>
            {band.label}
          </option>
        ))}
      </Select>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-5">
        <Tag>{c.matched(resultCount)}</Tag>
        <Button type="button" variant="outline" onClick={reset} disabled={!active}>
          {c.reset}
        </Button>
      </div>
    </div>
  );
}
