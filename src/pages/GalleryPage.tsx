import { Gallery } from "../components/Gallery";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Galeri",
  title: "Dokumentasi perjalanan",
  intro:
    "Halaman ini menampung foto kegiatan nyata: manasik, keberangkatan, penginapan, kendaraan, dan suasana rombongan. Sampai foto itu ada, kami menampilkan daftar slotnya.",
  askBody:
    "Ingin melihat dokumentasi keberangkatan tertentu? Sampaikan tanggalnya, dan tim akan mengirimkan materi yang tersedia.",
};

const enCopy: typeof idCopy = {
  eyebrow: "Gallery",
  title: "Trip documentation",
  intro:
    "This page holds photos of real activities: the manasik briefing, departures, accommodation, vehicles, and the group itself. Until those photos exist, we show the list of slots instead.",
  askBody:
    "Would you like to see documentation for a particular departure? Tell us the date and the team will send whatever material is available.",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function GalleryPage() {
  const c = useCopy(copy);
  const lang = useLang();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <Gallery />

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-emerald-100 pt-8">
            <p className="max-w-prose text-body text-charcoal-soft">{c.askBody}</p>
            <ButtonLink to="/konsultasi" variant="primary">
              {chrome[lang].cta.consultPlan}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
