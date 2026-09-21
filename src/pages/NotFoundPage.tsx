import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  title: "Halaman ini tidak ada",
  intro:
    "Alamat yang Anda buka mungkin sudah berubah atau salah ketik. Pilihan di bawah ini menuju halaman yang memang tersedia.",
  open: (label: string) => `Buka ${label}`,
  links: [
    { label: "Beranda", to: "/", body: "Ikhtisar program dan jadwal." },
    {
      label: "Paket Umrah",
      to: "/paket-umrah",
      body: "Reguler, Plus, dan Private beserta rinciannya.",
    },
    { label: "Jadwal", to: "/jadwal", body: "Pilih tanggal keberangkatan." },
    { label: "FAQ", to: "/faq", body: "Pertanyaan pendaftaran dan dokumen." },
  ],
};

const enCopy: typeof idCopy = {
  title: "This page does not exist",
  intro:
    "The address you opened may have changed or been mistyped. The options below lead to pages that do exist.",
  open: (label: string) => `Open ${label}`,
  links: [
    { label: "Home", to: "/", body: "An overview of the programmes and the schedule." },
    {
      label: "Umrah packages",
      to: "/paket-umrah",
      body: "Regular, Plus and Private with their details.",
    },
    { label: "Schedule", to: "/jadwal", body: "Choose a departure date." },
    { label: "FAQ", to: "/faq", body: "Registration and document questions." },
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function NotFoundPage() {
  const c = useCopy(copy);

  return (
    <>
      <PageHeader eyebrow="404" title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.links.map((item) => (
              <div key={item.to} className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-display-sm text-emerald-900">{item.label}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{item.body}</p>
                <ButtonLink to={item.to} variant="outline" className="mt-4">
                  {c.open(item.label)}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
