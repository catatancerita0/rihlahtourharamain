import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PendingPanel } from "../components/ui/PendingPanel";
import { SectionHeading } from "../components/ui/SectionHeading";
import { hajiPendingFields, hajiVerificationSteps } from "../content/site-content";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Program Haji",
  title: "Program Haji, dijelaskan setelah datanya terverifikasi",
  intro:
    "Perjalanan Haji terikat ketentuan resmi, kuota, dan izin penyelenggara. Karena itu halaman ini tidak menampilkan angka atau klaim administratif sebelum dokumennya benar-benar ada.",
  askHajj: "Konsultasikan Rencana Haji",
  seeLicensing: "Lihat halaman legalitas",
  statusEyebrow: "Status",
  statusTitle: "Yang belum tersedia di halaman ini",
  statusIntro:
    "Empat hal di bawah ini hanya boleh ditulis dari sumber resmi. Selama belum ada, halaman ini menjelaskan cara Anda memeriksanya sendiri.",
  pendingLabel: "Data program Haji",
  pendingDescription:
    "Tim belum memberikan dokumen resmi untuk program Haji, jadi tidak ada informasi program, izin, penyelenggara, maupun ketentuan yang bisa kami cantumkan di sini.",
  verifyEyebrow: "Panduan verifikasi",
  verifyTitle: "Cara memeriksa penyelenggara Haji",
  verifyIntro:
    "Langkah ini berguna untuk penyelenggara mana pun, termasuk ketika Anda membandingkan beberapa pilihan.",
  decideEyebrow: "Sebelum memutuskan",
  decideTitle: "Pertanyaan yang layak dijawab tertulis",
  scheduleTitle: "Jadwal Haji belum dipublikasikan.",
  scheduleBody:
    "Kuota dan jadwal Haji ditetapkan oleh pihak berwenang, jadi kami tidak menampilkan perkiraan tanggal. Sampaikan minat Anda lewat konsultasi agar tim menghubungi ketika informasi resminya tersedia.",
  seeSchedule: "Lihat jadwal yang sudah ada",
  questions: [
    "Berapa lama estimasi masa tunggu, dan apa dasar angka itu?",
    "Fasilitas apa saja yang termasuk, dan apa yang dibayar terpisah?",
    "Bagaimana pembagian kamar ditentukan, terutama untuk jamaah lansia?",
    "Siapa pembimbing yang mendampingi, dan berapa jumlah jamaah per pembimbing?",
    "Apa isi perjanjian tertulis, termasuk ketentuan pembatalan dan pengembalian dana?",
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Hajj programme",
  title: "The Hajj programme, explained once the data is verified",
  intro:
    "Hajj travel is bound by official rules, quota, and the organiser's licence. That is why this page shows no figures or administrative claims before the documents genuinely exist.",
  askHajj: "Ask about a Hajj plan",
  seeLicensing: "See the licensing page",
  statusEyebrow: "Status",
  statusTitle: "What this page does not have yet",
  statusIntro:
    "The four items below may only be written from official sources. Until they exist, this page explains how you can check them yourself.",
  pendingLabel: "Hajj programme data",
  pendingDescription:
    "The team has not provided official documents for the Hajj programme, so there is no programme information, licence, organiser, or set of terms we can publish here.",
  verifyEyebrow: "Verification guide",
  verifyTitle: "How to check a Hajj organiser",
  verifyIntro:
    "These steps work for any organiser, including when you are comparing several options.",
  decideEyebrow: "Before deciding",
  decideTitle: "Questions worth answering in writing",
  scheduleTitle: "The Hajj schedule has not been published.",
  scheduleBody:
    "Hajj quota and schedules are set by the authorities, so we do not publish estimated dates. Tell us you are interested through a consultation and the team will make contact when official information is available.",
  seeSchedule: "See the departures that exist",
  questions: [
    "How long is the estimated waiting period, and what is that figure based on?",
    "Which facilities are included, and what is paid separately?",
    "How are rooms allocated, especially for elderly pilgrims?",
    "Who is the guide, and how many pilgrims does each guide cover?",
    "What does the written agreement contain, including cancellation and refund terms?",
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function HajiPage() {
  const c = useCopy(copy);
  const L = usePick();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} motif>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/konsultasi" variant="accent" size="lg">
            {c.askHajj}
          </ButtonLink>
          <ButtonLink to="/legalitas" variant="outline" size="lg" onDark>
            {c.seeLicensing}
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <SectionHeading
            eyebrow={c.statusEyebrow}
            title={c.statusTitle}
            intro={c.statusIntro}
          />
          <div className="mt-8">
            <PendingPanel
              label={c.pendingLabel}
              description={c.pendingDescription}
              willShow={L(hajiPendingFields)}
            />
          </div>
        </div>
      </section>

      <section className="section bg-emerald-50">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow={c.verifyEyebrow}
              title={c.verifyTitle}
              intro={c.verifyIntro}
            />
            <ol className="flex flex-col gap-5">
              {L(hajiVerificationSteps).map((step, index) => (
                <li key={step} className="flex gap-4 border-t border-emerald-200 pt-5">
                  <span className="tabular font-display text-2xl text-emerald-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body text-charcoal-soft">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading eyebrow={c.decideEyebrow} title={c.decideTitle} />
            <ul className="flex flex-col gap-4">
              {c.questions.map((question) => (
                <li
                  key={question}
                  className="flex gap-3 border-b border-emerald-100 pb-4 text-body text-charcoal-soft"
                >
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="on-dark bg-emerald-900 text-shell">
        <div className="shell-container py-section-sm">
          <EmptyState
            onDark
            title={c.scheduleTitle}
            description={c.scheduleBody}
            action={
              <>
                <ButtonLink to="/konsultasi" variant="accent">
                  {c.askHajj}
                </ButtonLink>
                <ButtonLink to="/jadwal" variant="outline" onDark>
                  {c.seeSchedule}
                </ButtonLink>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
