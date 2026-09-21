import { Link } from "react-router-dom";
import { ConsultationForm } from "../components/ConsultationForm";
import { PageHeader } from "../components/layout/PageHeader";
import { isPlaceholder, site } from "../config/site";
import { journeySteps } from "../content/site-content";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const stepsAfterContact = journeySteps.slice(0, 3);

const idCopy = {
  eyebrow: "Konsultasi",
  title: "Konsultasikan Rencana Umrah Anda",
  intro:
    "Isi data di bawah supaya tim bisa menyiapkan pilihan program beserta rincian biayanya. Tidak ada kewajiban mendaftar setelah konsultasi.",
  formTitle: "Data konsultasi",
  formNote:
    "Kolom bertanda wajib diisi. Isian yang belum lengkap akan ditandai sebelum apa pun dikirim.",
  stepsTitle: "Setelah Anda mengisi",
  hoursTitle: "Jam layanan",
  hoursPending:
    "Jam layanan belum diisi pada pratinjau ini, jadi belum bisa kami sebutkan. Setelah diisi, keterangan itu muncul di sini dan di halaman kontak.",
  allChannels: "Lihat semua kanal kontak",
  docsTitle: "Sebelum mengirim dokumen",
  docsBody:
    "Dokumen seperti paspor baru dikirim setelah Anda menerima penawaran tertulis dan memastikan kanal yang dipakai benar. Jangan mengirim dokumen lewat tautan yang tidak bisa diverifikasi dari situs ini.",
};

const enCopy: typeof idCopy = {
  eyebrow: "Consultation",
  title: "Talk through your Umrah plan",
  intro:
    "Fill in the details below so the team can prepare programme options with their cost breakdown. There is no obligation to register after a consultation.",
  formTitle: "Consultation details",
  formNote:
    "Fields marked required must be filled in. Anything incomplete is flagged before it is sent.",
  stepsTitle: "After you submit",
  hoursTitle: "Service hours",
  hoursPending:
    "Service hours have not been filled in on this preview, so we cannot state them yet. Once they are, the details appear here and on the contact page.",
  allChannels: "See all contact channels",
  docsTitle: "Before sending documents",
  docsBody:
    "Documents such as a passport are only sent once you have received a written offer and confirmed the channel is genuine. Do not send documents through a link you cannot verify from this site.",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function ConsultationPage() {
  const c = useCopy(copy);
  const L = usePick();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-display-sm text-emerald-900">{c.formTitle}</h2>
              <p className="mt-3 max-w-prose text-body text-charcoal-soft">{c.formNote}</p>
              <div className="mt-8">
                <ConsultationForm />
              </div>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.stepsTitle}</h2>
                <ol className="mt-4 flex flex-col gap-4">
                  {stepsAfterContact.map((step, index) => (
                    <li key={step.id} className="flex gap-3">
                      <span className="tabular font-display text-xl text-emerald-800">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-body font-semibold text-emerald-900">{L(step.title)}</p>
                        <p className="mt-1 text-body-sm text-charcoal-soft">
                          {L(step.description)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.hoursTitle}</h2>
                {isPlaceholder(site.serviceHours) ? (
                  <p className="mt-2 text-body-sm text-charcoal-soft">{c.hoursPending}</p>
                ) : (
                  <p className="mt-2 text-body-sm text-charcoal-soft">{site.serviceHours}</p>
                )}
                <Link
                  to="/kontak"
                  className="mt-3 inline-block rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                >
                  {c.allChannels}
                </Link>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.docsTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.docsBody}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
