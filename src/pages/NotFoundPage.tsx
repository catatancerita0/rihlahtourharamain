import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="Halaman ini tidak ada"
        intro="Alamat yang Anda buka mungkin sudah berubah atau salah ketik. Pilihan di bawah ini menuju halaman yang memang tersedia."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Beranda", to: "/", body: "Ikhtisar program dan jadwal." },
              {
                label: "Paket Umrah",
                to: "/paket-umrah",
                body: "Reguler, Plus, dan Private beserta rinciannya.",
              },
              { label: "Jadwal", to: "/jadwal", body: "Pilih tanggal keberangkatan." },
              { label: "FAQ", to: "/faq", body: "Pertanyaan pendaftaran dan dokumen." },
            ].map((item) => (
              <div key={item.to} className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-display-sm text-emerald-900">{item.label}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{item.body}</p>
                <ButtonLink to={item.to} variant="outline" className="mt-4">
                  Buka {item.label}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
