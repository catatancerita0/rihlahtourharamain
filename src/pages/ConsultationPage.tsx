import { Link } from "react-router-dom";
import { ConsultationForm } from "../components/ConsultationForm";
import { PageHeader } from "../components/layout/PageHeader";
import { isPlaceholder, site } from "../config/site";
import { journeySteps } from "../content/site-content";

const stepsAfterContact = journeySteps.slice(0, 3);

export function ConsultationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Konsultasi"
        title="Konsultasikan Rencana Umrah Anda"
        intro="Isi data di bawah supaya tim bisa menyiapkan pilihan program beserta rincian biayanya. Tidak ada kewajiban mendaftar setelah konsultasi."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-display-sm text-emerald-900">Data konsultasi</h2>
              <p className="mt-3 max-w-prose text-body text-charcoal-soft">
                Kolom bertanda wajib diisi. Isian yang belum lengkap akan ditandai sebelum apa pun
                dikirim.
              </p>
              <div className="mt-8">
                <ConsultationForm />
              </div>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Setelah Anda mengisi
                </h2>
                <ol className="mt-4 flex flex-col gap-4">
                  {stepsAfterContact.map((step, index) => (
                    <li key={step.id} className="flex gap-3">
                      <span className="tabular font-display text-xl text-emerald-800">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-body font-semibold text-emerald-900">{step.title}</p>
                        <p className="mt-1 text-body-sm text-charcoal-soft">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">Jam layanan</h2>
                {isPlaceholder(site.serviceHours) ? (
                  <p className="mt-2 text-body-sm text-charcoal-soft">
                    Jam layanan belum diisi pada pratinjau ini, jadi belum bisa kami sebutkan.
                    Setelah diisi, keterangan itu muncul di sini dan di halaman kontak.
                  </p>
                ) : (
                  <p className="mt-2 text-body-sm text-charcoal-soft">{site.serviceHours}</p>
                )}
                <Link
                  to="/kontak"
                  className="mt-3 inline-block rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                >
                  Lihat semua kanal kontak
                </Link>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Sebelum mengirim dokumen
                </h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Dokumen seperti paspor baru dikirim setelah Anda menerima penawaran tertulis dan
                  memastikan kanal yang dipakai benar. Jangan mengirim dokumen lewat tautan yang
                  tidak bisa diverifikasi dari situs ini.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
