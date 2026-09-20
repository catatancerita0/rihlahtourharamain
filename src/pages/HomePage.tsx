import { useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { DepartureCard, StatusLegend } from "../components/DepartureCard";
import { FAQAccordion } from "../components/FAQAccordion";
import { PackageFilter } from "../components/PackageFilter";
import { PackageResults } from "../components/PackageList";
import { Seo } from "../components/Seo";
import { ButtonAnchor, ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { GeometricMotif } from "../components/ui/GeometricMotif";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Tag } from "../components/ui/Tag";
import { articles } from "../content/articles";
import { faqs } from "../content/faq";
import { packages, umrahPrograms } from "../content/packages";
import { journeySteps, reasons } from "../content/site-content";
import { site, whatsappHref } from "../config/site";
import { usePackageFilter } from "../hooks/usePackageFilter";
import { useCopy } from "../i18n/LanguageProvider";
import { programLabels } from "../lib/packages";

const featuredArticles = articles.slice(0, 1);
const supportingArticles = articles.slice(1, 4);
const homeFaqs = faqs.slice(0, 6);

export function HomePage() {
  const finder = usePackageFilter(packages);
  const [filterOpen, setFilterOpen] = useState(false);
  const operatingNote = useCopy(site.operatingNote);
  const wa = whatsappHref();

  return (
    <>
      <Seo
        title="Rihlah Tour Haramain | Paket Umrah dan Haji untuk Jamaah Indonesia"
        description="Program Umrah Reguler, Plus, dan Private untuk jamaah Indonesia. Lihat jadwal keberangkatan, fasilitas, penginapan, dan cara berkonsultasi sebelum mendaftar."
      />

      {/* 1. Hero. Asymmetric: the message holds the left, the photo slot holds
          the right, and the motif runs along the bottom edge only. */}
      <section className="on-dark relative overflow-hidden bg-emerald-800 text-shell">
        <div className="shell-container relative py-section-lg">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Umrah &amp; Haji untuk jamaah Indonesia</p>
              <h1 className="text-display-xl">Menuju Baitullah, Bersama Rihlah.</h1>
              <p className="max-w-prose text-body-lg text-emerald-100">{operatingNote}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/paket-umrah" variant="primary" size="lg">
                  Lihat Paket Umrah
                </ButtonLink>
                <ButtonLink to="/konsultasi" variant="outline" size="lg">
                  Konsultasikan Rencana Umrah
                </ButtonLink>
              </div>

              {/* Trust facts cannot be invented. This names what is missing
                  instead of borrowing a number from nowhere. */}
              <div className="mt-2 max-w-prose rounded-lg border border-emerald-700 bg-emerald-900/50 p-4">
                <p className="text-body-sm font-semibold text-shell">
                  Menunggu data terverifikasi
                </p>
                <p className="mt-1 text-body-sm text-emerald-100">
                  Nomor izin PPIU atau PIHK, jumlah keberangkatan, mitra maskapai, dan jumlah
                  pembimbing belum diberikan ke situs ini. Bagian itu baru ditampilkan setelah
                  dokumen resminya tersedia.
                </p>
              </div>
            </div>

            <div className="flex aspect-[4/5] flex-col justify-end rounded-xl border border-dashed border-emerald-300 bg-emerald-900/40 p-6">
              <p className="text-label font-semibold uppercase text-emerald-300">Slot foto utama</p>
              <p className="mt-2 font-display text-2xl text-shell">
                Masjidil Haram, Masjid Nabawi, atau jamaah Indonesia di area ibadah
              </p>
              <p className="mt-2 text-body-sm text-emerald-100">
                Rasio 4 banding 5. Diganti satu foto asli setelah dokumentasi tersedia, dan bukan
                foto berlisensi stok.
              </p>
            </div>
          </div>
        </div>
        <GeometricMotif className="h-8 w-full text-emerald-700" scale={34} />
      </section>

      {/* 2. Package finder. Overlaps the hero edge, which is the one place a
          shadow earns its keep: the panel has to read as sitting above the page. */}
      <section className="bg-cream" aria-labelledby="finder-title">
        <div className="shell-container">
          <div className="relative -mt-10 rounded-xl border border-emerald-100 bg-shell p-5 shadow-panel sm:p-7 lg:-mt-14 lg:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Pencarian cepat"
                title="Cari program yang sesuai"
                intro="Saring berdasarkan jenis perjalanan dan preferensi program. Filter bulan dan anggaran aktif setelah jadwal dipublikasikan."
                headingId="finder-title"
              />
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                aria-expanded={filterOpen}
                className="inline-flex min-h-11 items-center rounded-md border border-emerald-800 px-4 text-body-sm font-semibold text-emerald-800 hover:bg-emerald-50 lg:hidden"
              >
                {filterOpen ? "Sembunyikan filter" : "Tampilkan filter"}
              </button>
            </div>

            <div className={`${filterOpen ? "mt-7 block" : "hidden"} lg:mt-8 lg:block`}>
              <PackageFilter
                idPrefix="home"
                state={finder.state}
                update={finder.update}
                reset={finder.reset}
                active={finder.active}
                months={finder.months}
                bands={finder.bands}
                resultCount={finder.results.length}
              />
            </div>

            <div className="mt-8">
              <PackageResults
                items={finder.results}
                active={finder.active}
                limit={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Program Umrah. Editorial rows instead of a card grid, because the
          three programs differ in concept rather than in price. */}
      <section className="section bg-shell" aria-labelledby="program-umrah-title">
        <div className="shell-container">
          <Reveal>
            <SectionHeading
              eyebrow="Paket Umrah"
              title="Tiga cara berangkat, satu tujuan yang sama"
              intro="Reguler, Plus, dan Private bukan tingkatan harga. Ketiganya menjawab kebutuhan yang berbeda, terutama soal tanggal dan ritme perjalanan."
              headingId="program-umrah-title"
            />
          </Reveal>

          <ul className="mt-12 flex flex-col">
            {umrahPrograms.map((program, index) => (
              <li
                key={program.id}
                className="grid gap-4 border-t border-emerald-100 py-8 sm:grid-cols-[3rem_11rem_1fr] sm:gap-6"
              >
                <p className="tabular font-display text-2xl text-emerald-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl text-emerald-900">{program.name}</h3>
                  <p className="mt-1 text-label font-semibold uppercase text-charcoal-muted">
                    {programLabels[program.type]}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-body-lg text-charcoal-soft">{program.focus}</p>
                  <ul className="flex flex-col gap-2">
                    {program.differentiators.map((item) => (
                      <li key={item} className="flex gap-2 text-body-sm text-charcoal-soft">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/paket-umrah/${program.slug}`}
                    className="self-start rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                  >
                    Lihat Detail Paket {program.name}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Jadwal. Tinted band, timeline rows, and a legend because status is
          carried by shape as well as colour. */}
      <section className="section bg-emerald-50" aria-labelledby="jadwal-title">
        <div className="shell-container">
          <Reveal>
            <SectionHeading
              eyebrow="Jadwal keberangkatan"
              title="Kapan Anda ingin berangkat?"
              intro="Setiap keberangkatan menampilkan tanggal, durasi, maskapai, penginapan, harga, dan sisa kursi. Yang belum ditetapkan ditandai apa adanya."
              headingId="jadwal-title"
            />
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
            <div className="flex flex-col gap-5">
              {packages.length === 0 ? (
                <EmptyState
                  title="Belum ada jadwal keberangkatan yang dipublikasikan."
                  description="Tanggal, maskapai, penginapan, dan harga untuk keberangkatan berikutnya belum ditetapkan, jadi kami tidak menampilkan perkiraan. Sampaikan perkiraan waktu Anda lewat konsultasi supaya tim bisa mengabari begitu jadwalnya dibuka."
                  action={
                    <>
                      <ButtonLink to="/konsultasi" variant="primary">
                        Konsultasikan Rencana Umrah
                      </ButtonLink>
                      <ButtonLink to="/jadwal" variant="outline">
                        Buka halaman jadwal
                      </ButtonLink>
                    </>
                  }
                />
              ) : (
                packages.map((item) => <DepartureCard key={item.id} item={item} />)
              )}
            </div>

            <div className="rounded-lg border border-emerald-200 bg-shell p-5">
              <h3 className="text-display-sm text-emerald-900">Arti tanda ketersediaan</h3>
              <p className="mt-2 text-body-sm text-charcoal-soft">
                Status dibedakan oleh bentuk dan tulisan, bukan hanya warna.
              </p>
              <div className="mt-5">
                <StatusLegend />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kenapa Rihlah. One reason carries the section, the rest stay
          compact, so the argument has a hierarchy instead of six equal cards. */}
      <section className="section bg-shell" aria-labelledby="kenapa-title">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Kenapa Rihlah"
                title="Yang kami jelaskan sebelum Anda membayar"
                headingId="kenapa-title"
              />
            </Reveal>
            <div className="flex flex-col gap-8">
              {reasons.map((reason) =>
                reason.lead ? (
                  <Reveal key={reason.id}>
                    <div className="rounded-lg border border-emerald-800 bg-emerald-800 p-6 text-shell on-dark">
                      <h3 className="text-display-sm">{reason.title}</h3>
                      <p className="mt-3 text-body text-emerald-100">{reason.description}</p>
                    </div>
                  </Reveal>
                ) : (
                  <Reveal key={reason.id}>
                    <div className="border-t border-emerald-100 pt-5">
                      <h3 className="text-body-lg font-semibold text-emerald-900">
                        {reason.title}
                      </h3>
                      <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                        {reason.description}
                      </p>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proses. Eight real steps on a rail, because collapsing them to three
          hides the parts jamaah get surprised by, such as document review. */}
      <section className="section bg-cream" aria-labelledby="proses-title">
        <div className="shell-container">
          <Reveal>
            <SectionHeading
              eyebrow="Gambaran proses"
              title="Delapan tahap dari konsultasi sampai kembali"
              intro="Tiap tahap menyebut apa yang tim kerjakan dan apa yang perlu Anda siapkan."
              headingId="proses-title"
            />
          </Reveal>

          <ol className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {journeySteps.map((step, index) => (
              <li key={step.id} className="flex gap-4 border-t border-emerald-200 pt-5">
                <span className="tabular font-display text-2xl text-emerald-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-body-lg font-semibold text-emerald-900">{step.title}</h3>
                  <p className="text-body-sm text-charcoal-soft">{step.description}</p>
                  <p className="text-body-sm text-charcoal-muted">
                    <span className="font-semibold text-charcoal">Yang Anda siapkan: </span>
                    {step.jamaahAction}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Program Haji. A real chapter break, so it gets the dark surface and
          the second motif placement. */}
      <section className="on-dark bg-emerald-900 text-shell" aria-labelledby="haji-title">
        <div className="shell-container py-section">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Program Haji"
                title="Yang harus jelas sebelum memilih penyelenggara"
                intro="Program Haji terikat ketentuan resmi dan kuota. Halaman ini menampilkan data itu setelah dokumennya ada, dan sampai saat itu kami menunjukkan cara memeriksanya sendiri."
                onDark
                headingId="haji-title"
              />
            </Reveal>
            <Reveal>
              <div className="flex flex-col gap-5">
                <div className="rounded-lg border border-emerald-700 bg-emerald-800 p-5">
                  <Tag onDark>Status halaman ini</Tag>
                  <p className="mt-3 text-body text-emerald-100">
                    Informasi program, status izin, dan data penyelenggara belum diisi. Bagian itu
                    hanya ditampilkan setelah diambil dari dokumen resmi.
                  </p>
                </div>
                <ul className="flex flex-col gap-3">
                  {[
                    "Nama badan usaha dan nomor izin harus cocok dengan dokumen penawaran.",
                    "Rincian fasilitas, biaya, dan hal yang tidak termasuk diminta secara tertulis.",
                    "Pembayaran diarahkan ke rekening atas nama badan usaha, bukan rekening pribadi.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-body-sm text-emerald-100">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/paket-haji" variant="primary" size="lg" className="self-start">
                  Buka halaman Program Haji
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
        <GeometricMotif className="h-7 w-full text-emerald-700" scale={30} />
      </section>

      {/* 8. What every package page states. This explains the pending marks on
          the package pages instead of leaving them unexplained. */}
      <section className="section-tight bg-shell" aria-labelledby="kelengkapan-title">
        <div className="shell-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Isi halaman paket"
                title="Yang selalu kami cantumkan"
                intro="Kalau sebuah baris masih bertanda belum ditetapkan, artinya datanya memang belum ada, bukan disembunyikan."
                headingId="kelengkapan-title"
              />
            </Reveal>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                "Durasi dan jumlah malam",
                "Tanggal keberangkatan",
                "Maskapai dan rute",
                "Hotel Makkah dan Madinah",
                "Tipe kamar dan jarak ke area ibadah",
                "Fasilitas yang termasuk",
                "Fasilitas yang tidak termasuk",
                "Itinerary harian",
                "Dokumen yang perlu disiapkan",
                "Syarat dan ketentuan pembatalan",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-2 border-b border-emerald-100 py-2.5 text-body-sm text-charcoal-soft"
                >
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Panduan. One featured article, then the rest compact. */}
      <section className="section bg-emerald-50" aria-labelledby="panduan-title">
        <div className="shell-container">
          <Reveal>
            <SectionHeading
              eyebrow="Panduan jamaah"
              title="Persiapan yang bisa dimulai sekarang"
              intro="Tulisan di bawah membahas dokumen, ritme perjalanan bersama orang tua, perlengkapan, dan manasik."
              headingId="panduan-title"
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
            <ul className="flex flex-col gap-5">
              {supportingArticles.map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ul>
          </div>

          <ButtonLink to="/panduan" variant="outline" className="mt-8">
            Lihat semua panduan jamaah
          </ButtonLink>
        </div>
      </section>

      {/* 10. FAQ. Sticky heading beside the accordion so the section reads as a
          reference rather than as another stacked block. */}
      <section className="section bg-shell" aria-labelledby="faq-title">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Pertanyaan"
                title="Yang paling sering ditanyakan"
                intro="Jawaban di bawah menyebut apa yang sudah pasti dan di mana sisanya diatur."
                headingId="faq-title"
              />
              <ButtonLink to="/faq" variant="outline" className="mt-6">
                Buka semua pertanyaan
              </ButtonLink>
            </Reveal>
            <FAQAccordion items={homeFaqs} idPrefix="home-faq" />
          </div>
        </div>
      </section>

      {/* 11. Consultation call to action. */}
      <section className="section-tight bg-cream-deep" aria-labelledby="cta-title">
        <div className="shell-container">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <Reveal className="flex flex-col gap-4">
              <h2 id="cta-title" className="text-display-md text-emerald-900">
                Konsultasikan rencana Umrah Anda
              </h2>
              <p className="max-w-prose text-body-lg text-charcoal-soft">
                Sampaikan jumlah jamaah, perkiraan waktu, dan kebutuhan khusus. Tim akan menyusun
                pilihan program beserta rincian biayanya untuk dibahas bersama.
              </p>
            </Reveal>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/konsultasi" variant="accent" size="lg">
                Isi formulir konsultasi
              </ButtonLink>
              {wa ? (
                <ButtonAnchor href={wa} variant="outline" size="lg" target="_blank" rel="noreferrer">
                  Chat WhatsApp resmi
                </ButtonAnchor>
              ) : (
                <ButtonLink to="/kontak" variant="outline" size="lg">
                  Lihat kanal kontak resmi
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
