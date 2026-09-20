import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageFilter } from "../components/PackageFilter";
import { PackageResults } from "../components/PackageList";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionHeading } from "../components/ui/SectionHeading";
import type { PackageCategory } from "../content/types";
import { packages } from "../content/packages";
import { usePackageFilter } from "../hooks/usePackageFilter";

interface PackageListPageProps {
  category: PackageCategory;
}

export function PackageListPage({ category }: PackageListPageProps) {
  const items = packages.filter((item) => item.category === category);
  const filter = usePackageFilter(items);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow={category === "umrah" ? "Paket Umrah" : "Paket Haji"}
        title={category === "umrah" ? "Pilih program Umrah yang sesuai" : "Program Haji"}
        intro={
          category === "umrah"
            ? "Tiga program dengan cara kerja berbeda. Harga dan tanggal ditampilkan setelah ditetapkan, dan yang belum ada ditandai apa adanya."
            : "Program Haji mengikuti ketentuan resmi dan kuota. Halaman ini hanya menampilkan data yang sudah terverifikasi."
        }
      >
        <p className="text-body-sm text-emerald-100">
          Belum yakin harus mulai dari mana?{" "}
          <Link to="/konsultasi" className="font-semibold text-shell underline underline-offset-4">
            Konsultasikan rencana Anda
          </Link>
          .
        </p>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="hidden lg:block">
                <SectionHeading as="h2" eyebrow="Filter" title="Saring program" />
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
                Buka filter program
              </Button>
            </div>

            <div>
              <p className="text-body-sm text-charcoal-muted">
                Menampilkan {filter.results.length} dari {items.length} program
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
        title="Saring program"
        description="Pilih filter lalu tutup panel ini untuk melihat hasilnya."
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
          Tampilkan {filter.results.length} program
        </Button>
      </Dialog>
    </>
  );
}
