import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageFilter } from "../components/PackageFilter";
import { PackageResults } from "../components/PackageList";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";
import { SectionHeading } from "../components/ui/SectionHeading";
import { packages } from "../content/packages";
import type { PackageCategory } from "../content/types";
import { usePackageFilter } from "../hooks/usePackageFilter";
import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

interface PackageListPageProps {
  category: PackageCategory;
}

const idCopy = {
  umrahEyebrow: "Paket Umrah",
  hajiEyebrow: "Paket Haji",
  umrahTitle: "Pilih program Umrah yang sesuai",
  hajiTitle: "Program Haji",
  umrahIntro:
    "Tiga program dengan cara kerja berbeda. Harga dan tanggal ditampilkan setelah ditetapkan, dan yang belum ada ditandai apa adanya.",
  hajiIntro:
    "Program Haji mengikuti ketentuan resmi dan kuota. Halaman ini hanya menampilkan data yang sudah terverifikasi.",
  unsure: "Belum yakin harus mulai dari mana?",
  talkPlan: "Konsultasikan rencana Anda",
  filterEyebrow: "Filter",
  filterTitle: "Saring program",
  openFilter: "Buka filter program",
  showing: (shown: number, total: number) => `Menampilkan ${shown} dari ${total} program`,
  sheetDescription: "Pilih filter lalu tutup panel ini untuk melihat hasilnya.",
  showCount: (count: number) => `Tampilkan ${count} program`,
};

const enCopy: typeof idCopy = {
  umrahEyebrow: "Umrah packages",
  hajiEyebrow: "Hajj packages",
  umrahTitle: "Choose the Umrah programme that fits",
  hajiTitle: "Hajj programme",
  umrahIntro:
    "Three programmes that work in different ways. Prices and dates appear once they are set, and anything still missing is labelled as missing.",
  hajiIntro:
    "The Hajj programme follows official rules and quota. This page only shows data that has been verified.",
  unsure: "Not sure where to start?",
  talkPlan: "Talk through your plan",
  filterEyebrow: "Filter",
  filterTitle: "Narrow the list",
  openFilter: "Open programme filters",
  showing: (shown: number, total: number) => `Showing ${shown} of ${total} programmes`,
  sheetDescription: "Choose your filters, then close this panel to see the results.",
  showCount: (count: number) => `Show ${count} programmes`,
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function PackageListPage({ category }: PackageListPageProps) {
  const c = useCopy(copy);
  const items = packages.filter((item) => item.category === category);
  const filter = usePackageFilter(items);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow={category === "umrah" ? c.umrahEyebrow : c.hajiEyebrow}
        title={category === "umrah" ? c.umrahTitle : c.hajiTitle}
        intro={category === "umrah" ? c.umrahIntro : c.hajiIntro}
      >
        <p className="text-body-sm text-emerald-100">
          {c.unsure}{" "}
          <Link to="/konsultasi" className="font-semibold text-shell underline underline-offset-4">
            {c.talkPlan}
          </Link>
          .
        </p>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="hidden lg:block">
                <SectionHeading as="h2" eyebrow={c.filterEyebrow} title={c.filterTitle} />
                <div className="mt-6 rounded-lg border border-emerald-100 bg-cream p-5">
                  <PackageFilter
                    idPrefix="list"
                    state={filter.state}
                    update={filter.update}
                    reset={filter.reset}
                    active={filter.active}
                    months={filter.months}
                    bands={filter.bands}
                    resultCount={filter.results.length}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full lg:hidden"
                onClick={() => setSheetOpen(true)}
              >
                {c.openFilter}
              </Button>
            </div>

            <div>
              <p className="text-body-sm text-charcoal-muted">
                {c.showing(filter.results.length, items.length)}
              </p>
              <div className="mt-5">
                <PackageResults items={filter.results} active={filter.active} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={c.filterTitle}
        description={c.sheetDescription}
      >
        <PackageFilter
          idPrefix="sheet"
          state={filter.state}
          update={filter.update}
          reset={filter.reset}
          active={filter.active}
          months={filter.months}
          bands={filter.bands}
          resultCount={filter.results.length}
        />
        <Button
          type="button"
          size="lg"
          className="mt-6 w-full"
          onClick={() => setSheetOpen(false)}
        >
          {c.showCount(filter.results.length)}
        </Button>
      </Dialog>
    </>
  );
}
