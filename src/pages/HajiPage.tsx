import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PendingPanel } from "../components/ui/PendingPanel";
import { SectionHeading } from "../components/ui/SectionHeading";
import { hajiPendingFields, hajiVerificationSteps } from "../content/site-content";

const questionsToAsk = [
  "Berapa lama estimasi masa tunggu, dan apa dasar angka itu?",
  "Fasilitas apa saja yang termasuk, dan apa yang dibayar terpisah?",
  "Bagaimana pembagian kamar ditentukan, terutama untuk jamaah lansia?",
  "Siapa pembimbing yang mendampingi, dan berapa jumlah jamaah per pembimbing?",
  "Apa isi perjanjian tertulis, termasuk ketentuan pembatalan dan pengembalian dana?",
];

export function HajiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Program Haji"
        title="Program Haji, dijelaskan setelah datanya terverifikasi"
        intro="Perjalanan Haji terikat ketentuan resmi, kuota, dan izin penyelenggara. Karena itu halaman ini tidak menampilkan angka atau klaim administratif sebelum dokumennya benar-benar ada."
        motif
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/konsultasi" variant="accent" size="lg">
            Konsultasikan Rencana Haji
          </ButtonLink>
          <ButtonLink to="/legalitas" variant="outline" size="lg" onDark>
            Lihat halaman legalitas
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <SectionHeading
            eyebrow="Status"
            title="Yang belum tersedia di halaman ini"
            intro="Empat hal di bawah ini hanya boleh ditulis dari sumber resmi. Selama belum ada, halaman ini menjelaskan cara Anda memeriksanya sendiri."
          />
          <div className="mt-8">
            <PendingPanel
              label="Data program Haji"
              description="Tim belum memberikan dokumen resmi untuk program Haji, jadi tidak ada informasi program, izin, penyelenggara, maupun ketentuan yang bisa kami cantumkan di sini."
              willShow={hajiPendingFields}
            />
          </div>
        </div>
      </section>

      <section className="section bg-emerald-50">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Panduan verifikasi"
              title="Cara memeriksa penyelenggara Haji"
              intro="Langkah ini berguna untuk penyelenggara mana pun, termasuk ketika Anda membandingkan beberapa pilihan."
            />
            <ol className="flex flex-col gap-5">
              {hajiVerificationSteps.map((step, index) => (
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
            <SectionHeading
              eyebrow="Sebelum memutuskan"
              title="Pertanyaan yang layak dijawab tertulis"
            />
            <ul className="flex flex-col gap-4">
              {questionsToAsk.map((question) => (
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
            title="Jadwal Haji belum dipublikasikan."
            description="Kuota dan jadwal Haji ditetapkan oleh pihak berwenang, jadi kami tidak menampilkan perkiraan tanggal. Sampaikan minat Anda lewat konsultasi agar tim menghubungi ketika informasi resminya tersedia."
            action={
              <>
                <ButtonLink to="/konsultasi" variant="accent">
                  Konsultasikan Rencana Haji
                </ButtonLink>
                <ButtonLink to="/jadwal" variant="outline" onDark>
                  Lihat jadwal yang sudah ada
                </ButtonLink>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
