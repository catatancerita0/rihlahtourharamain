import { useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { DepartureCard, StatusLegend } from "../components/DepartureCard";
import { FAQAccordion } from "../components/FAQAccordion";
import { PackageFilter } from "../components/PackageFilter";
import { PackageResults } from "../components/PackageList";
import { PromoNotice } from "../components/PromoNotice";
import { Seo } from "../components/Seo";
import { ButtonAnchor, ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { GeometricMotif } from "../components/ui/GeometricMotif";
import { Media } from "../components/ui/Media";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Tag } from "../components/ui/Tag";
import { whatsappHref } from "../config/site";
import { useContent } from "../content/ContentProvider";
import { bannerPromos, todayIso } from "../content/bundle";
import type { HomeSectionId } from "../content/types";
import { usePackageFilter } from "../hooks/usePackageFilter";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import type { Localized } from "../i18n/types";
import { programLabels } from "../lib/packages";

const idCopy = {
  seoTitle: "Rihlah Tour Haramain | Paket Umrah dan Haji untuk Jamaah Indonesia",
  seoDescription:
    "Program Umrah Reguler, Plus, dan Private untuk jamaah Indonesia. Lihat jadwal keberangkatan, fasilitas, penginapan, dan cara berkonsultasi sebelum mendaftar.",
  heroEyebrow: "Umrah & Haji untuk jamaah Indonesia",
  heroTitle: "Menuju Baitullah, Bersama Rihlah.",
  trustTitle: "Menunggu data terverifikasi",
  trustBody:
    "Nomor izin PPIU atau PIHK, jumlah keberangkatan, mitra maskapai, dan jumlah pembimbing belum diberikan ke situs ini. Bagian itu baru ditampilkan setelah dokumen resminya tersedia.",
  heroSlotLabel: "Slot foto utama",
  heroSlotNote:
    "Satu foto asli berukuran 4 banding 5. Masjidil Haram, Masjid Nabawi, atau jamaah Indonesia di area ibadah, bukan foto berlisensi stok.",
  finderEyebrow: "Pencarian cepat",
  finderTitle: "Cari program yang sesuai",
  finderIntro:
    "Saring berdasarkan jenis perjalanan dan preferensi program. Filter bulan dan anggaran aktif setelah jadwal dipublikasikan.",
  showFilter: "Tampilkan filter",
  hideFilter: "Sembunyikan filter",
  umrahEyebrow: "Paket Umrah",
  umrahTitle: "Tiga cara berangkat, satu tujuan yang sama",
  umrahIntro:
    "Reguler, Plus, dan Private bukan tingkatan harga. Ketiganya menjawab kebutuhan yang berbeda, terutama soal tanggal dan ritme perjalanan.",
  seeDetail: "Lihat Detail Paket",
  scheduleEyebrow: "Jadwal keberangkatan",
  scheduleTitle: "Kapan Anda ingin berangkat?",
  scheduleIntro:
    "Setiap keberangkatan menampilkan tanggal, durasi, maskapai, penginapan, harga, dan sisa kursi. Yang belum ditetapkan ditandai apa adanya.",
  scheduleEmptyTitle: "Belum ada jadwal keberangkatan yang dipublikasikan.",
  scheduleEmptyBody:
    "Tanggal, maskapai, penginapan, dan harga untuk keberangkatan berikutnya belum ditetapkan, jadi kami tidak menampilkan perkiraan. Sampaikan perkiraan waktu Anda lewat konsultasi supaya tim bisa mengabari begitu jadwalnya dibuka.",
  openSchedule: "Buka halaman jadwal",
  legendTitle: "Arti tanda ketersediaan",
  legendIntro: "Status dibedakan oleh bentuk dan tulisan, bukan hanya warna.",
  whyEyebrow: "Kenapa Rihlah",
  whyTitle: "Yang kami jelaskan sebelum Anda membayar",
  processEyebrow: "Gambaran proses",
  processTitle: "Delapan tahap dari konsultasi sampai kembali",
  processIntro:
    "Tiap tahap menyebut apa yang tim kerjakan dan apa yang perlu Anda siapkan.",
  prepareLabel: "Yang Anda siapkan: ",
  hajiEyebrow: "Program Haji",
  hajiTitle: "Yang harus jelas sebelum memilih penyelenggara",
  hajiIntro:
    "Program Haji terikat ketentuan resmi dan kuota. Halaman ini menampilkan data itu setelah dokumennya ada, dan sampai saat itu kami menunjukkan cara memeriksanya sendiri.",
  hajiStatusTag: "Status halaman ini",
  hajiStatusBody:
    "Informasi program, status izin, dan data penyelenggara belum diisi. Bagian itu hanya ditampilkan setelah diambil dari dokumen resmi.",
  hajiChecks: [
    "Nama badan usaha dan nomor izin harus cocok dengan dokumen penawaran.",
    "Rincian fasilitas, biaya, dan hal yang tidak termasuk diminta secara tertulis.",
    "Pembayaran diarahkan ke rekening atas nama badan usaha, bukan rekening pribadi.",
  ],
  openHaji: "Buka halaman Program Haji",
  packageEyebrow: "Isi halaman paket",
  packageTitle: "Yang selalu kami cantumkan",
  packageIntro:
    "Kalau sebuah baris masih bertanda belum ditetapkan, artinya datanya memang belum ada, bukan disembunyikan.",
  packageFields: [
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
  ],
  guideEyebrow: "Panduan jamaah",
  guideTitle: "Persiapan yang bisa dimulai sekarang",
  guideIntro:
    "Tulisan di bawah membahas dokumen, ritme perjalanan bersama orang tua, perlengkapan, dan manasik.",
  allGuides: "Lihat semua panduan jamaah",
  faqEyebrow: "Pertanyaan",
  faqTitle: "Yang paling sering ditanyakan",
  faqIntro: "Jawaban di bawah menyebut apa yang sudah pasti dan di mana sisanya diatur.",
  allFaqs: "Buka semua pertanyaan",
  ctaTitle: "Konsultasikan rencana Umrah Anda",
  ctaBody:
    "Sampaikan jumlah jamaah, perkiraan waktu, dan kebutuhan khusus. Tim akan menyusun pilihan program beserta rincian biayanya untuk dibahas bersama.",
  ctaForm: "Isi formulir konsultasi",
  ctaWhatsapp: "Chat WhatsApp resmi",
  ctaContact: "Lihat kanal kontak resmi",
};

const enCopy: typeof idCopy = {
  seoTitle: "Rihlah Tour Haramain | Umrah and Hajj packages for Indonesian pilgrims",
  seoDescription:
    "Regular, Plus and Private Umrah programmes for Indonesian pilgrims. See departure dates, facilities, accommodation, and how to talk to the team before registering.",
  heroEyebrow: "Umrah & Hajj for Indonesian pilgrims",
  heroTitle: "On the way to Baitullah, together with Rihlah.",
  trustTitle: "Waiting on verified data",
  trustBody:
    "The PPIU or PIHK licence number, number of departures, airline partners and number of guides have not been given to this site. That part appears only once the official documents exist.",
  heroSlotLabel: "Main photo slot",
  heroSlotNote:
    "A single original photo in a 4 by 5 frame. Masjidil Haram, Masjid Nabawi, or Indonesian pilgrims in the worship area, not a licensed stock image.",
  finderEyebrow: "Quick search",
  finderTitle: "Find the programme that fits",
  finderIntro:
    "Narrow it down by trip type and programme preference. The month and budget filters switch on once a schedule is published.",
  showFilter: "Show filters",
  hideFilter: "Hide filters",
  umrahEyebrow: "Umrah packages",
  umrahTitle: "Three ways to travel, one shared destination",
  umrahIntro:
    "Regular, Plus and Private are not price tiers. Each answers a different need, above all around dates and the pace of the trip.",
  seeDetail: "See package details",
  scheduleEyebrow: "Departure schedule",
  scheduleTitle: "When would you like to depart?",
  scheduleIntro:
    "Every departure lists the date, duration, airline, accommodation, price and remaining seats. Anything not settled yet is labelled as such.",
  scheduleEmptyTitle: "No departure schedule has been published yet.",
  scheduleEmptyBody:
    "Dates, airlines, accommodation and prices for upcoming departures are not set yet, so we do not show estimates. Tell us roughly when you want to travel through a consultation and the team can let you know once the schedule opens.",
  openSchedule: "Open the schedule page",
  legendTitle: "What the availability marks mean",
  legendIntro: "Status is carried by shape and text, not by colour alone.",
  whyEyebrow: "Why Rihlah",
  whyTitle: "What we explain before you pay",
  processEyebrow: "How it works",
  processTitle: "Eight stages from the first conversation to coming home",
  processIntro: "Each stage names what the team does and what you need to prepare.",
  prepareLabel: "What you prepare: ",
  hajiEyebrow: "Hajj programme",
  hajiTitle: "What has to be clear before choosing an organiser",
  hajiIntro:
    "The Hajj programme is bound by official rules and quota. This page shows that data once the documents exist, and until then it shows you how to check it yourself.",
  hajiStatusTag: "Status of this page",
  hajiStatusBody:
    "Programme information, licence status and organiser data have not been filled in. That part appears only once it is taken from official documents.",
  hajiChecks: [
    "The business name and licence number have to match the offer documents.",
    "Facilities, costs and what is not included should be requested in writing.",
    "Payment goes to an account in the business name, never a personal account.",
  ],
  openHaji: "Open the Hajj programme page",
  packageEyebrow: "On every package page",
  packageTitle: "What we always set out",
  packageIntro:
    "If a row is still marked as not set, the data genuinely does not exist yet. It is not being held back.",
  packageFields: [
    "Duration and number of nights",
    "Departure date",
    "Airline and route",
    "Hotels in Makkah and Madinah",
    "Room type and distance to the worship area",
    "Facilities that are included",
    "Facilities that are not included",
    "Daily itinerary",
    "Documents to prepare",
    "Cancellation terms and conditions",
  ],
  guideEyebrow: "Pilgrim guides",
  guideTitle: "Preparation you can start now",
  guideIntro:
    "The writing below covers documents, travelling at your parents' pace, packing, and the manasik briefing.",
  allGuides: "See all pilgrim guides",
  faqEyebrow: "Questions",
  faqTitle: "The questions that come up most",
  faqIntro: "The answers below state what is settled and where the rest is documented.",
  allFaqs: "Open all questions",
  ctaTitle: "Talk through your Umrah plan",
  ctaBody:
    "Tell us how many people are travelling, roughly when, and any special needs. The team will put together programme options with their costs for you to go through together.",
  ctaForm: "Fill in the consultation form",
  ctaWhatsapp: "Chat on official WhatsApp",
  ctaContact: "See the official contact channels",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function HomePage() {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const { packages, articles, faqs, reasons, journeySteps, promos, profile, homepage } =
    useContent();
  const finder = usePackageFilter(packages);
  const [filterOpen, setFilterOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);

  // Sections the admin switched off are not rendered at all, rather than
  // rendered empty: a hidden section should not leave a gap in the page.
  const shows = (section: HomeSectionId) => !homepage.hiddenSections.includes(section);

  const umrahPrograms = packages.filter((item) => item.category === "umrah");
  const featuredArticles = articles.slice(0, 1);
  const supportingArticles = articles.slice(1, 4);
  const homeFaqs = faqs.slice(0, 6);
  const hero = profile.media.hero;
  const wa = whatsappHref(lang, undefined, profile);
  const banners = homepage.showPromoBanner && !promoDismissed ? bannerPromos(promos, todayIso()) : [];

  return (
    <>
      <Seo title={c.seoTitle} description={c.seoDescription} />

      {/* 1. Hero. Asymmetric: the message holds the left, the photo slot holds
          the right, and the motif runs along the bottom edge only. */}
      <section className="on-dark relative overflow-hidden bg-emerald-800 text-shell">
        <div className="shell-container relative py-section-lg">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-6">
              <p className="eyebrow">{c.heroEyebrow}</p>
              <h1 className="text-display-xl">{c.heroTitle}</h1>
              <p className="max-w-prose text-body-lg text-emerald-100">
                {L(profile.operatingNote)}
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/paket-umrah" variant="primary" size="lg" onDark>
                  {chrome[lang].cta.viewPackages}
                </ButtonLink>
                <ButtonLink to="/konsultasi" variant="outline" size="lg" onDark>
                  {chrome[lang].cta.consultPlan}
                </ButtonLink>
              </div>

              {/* Trust facts cannot be invented. This names what is missing
                  instead of borrowing a number from nowhere. */}
              <div className="mt-2 max-w-prose rounded-lg border border-emerald-700 bg-emerald-900/50 p-4">
                <p className="text-body-sm font-semibold text-shell">{c.trustTitle}</p>
                <p className="mt-1 text-body-sm text-emerald-100">{c.trustBody}</p>
              </div>
            </div>

            <Media
              src={hero?.file}
              alt={hero ? L(hero.alt) : ""}
              ratio="4/5"
              priority
              onDark
              slotLabel={c.heroSlotLabel}
              slotNote={c.heroSlotNote}
            />
          </div>
        </div>
        <GeometricMotif className="h-8 w-full text-emerald-700" scale={34} />
      </section>

      {/* 2. Package finder. Overlaps the hero edge, which is the one place a
          shadow earns its keep: the panel has to read as sitting above the page. */}
      {shows("finder") ? (
        <section className="bg-cream" aria-labelledby="finder-title">
          <div className="shell-container">
            <div className="relative -mt-10 rounded-xl border border-emerald-100 bg-shell p-5 shadow-panel sm:p-7 lg:-mt-14 lg:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow={c.finderEyebrow}
                  title={c.finderTitle}
                  intro={c.finderIntro}
                  headingId="finder-title"
                />
                <button
                  type="button"
                  onClick={() => setFilterOpen((open) => !open)}
                  aria-expanded={filterOpen}
                  className="inline-flex min-h-11 items-center rounded-md border border-emerald-800 px-4 text-body-sm font-semibold text-emerald-800 hover:bg-emerald-50 lg:hidden"
                >
                  {filterOpen ? c.hideFilter : c.showFilter}
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
                <PackageResults items={finder.results} active={finder.active} limit={2} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 2b. Promotion banner. It sits after the finder so it never pushes the
          finder away from the hero it overlaps. Dismissible, because a visitor
          who has read it should be able to get it out of the way. */}
      {banners.length > 0 ? (
        <section className="border-y border-gold bg-cream-deep" aria-label={chrome[lang].promo.bannerLabel}>
          <div className="shell-container flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-prose">
              <p className="text-label font-semibold uppercase text-emerald-700">
                {chrome[lang].promo.bannerLabel}
              </p>
              <div className="mt-3">
                <PromoNotice promos={banners} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPromoDismissed(true)}
              className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-emerald-800 px-4 text-body-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              {chrome[lang].promo.dismiss}
            </button>
          </div>
        </section>
      ) : null}

      {/* 3. Program Umrah. Editorial rows instead of a card grid, because the
          three programs differ in concept rather than in price. */}
      {shows("umrah") ? (
        <section className="section bg-shell" aria-labelledby="program-umrah-title">
          <div className="shell-container">
            <Reveal>
              <SectionHeading
                eyebrow={c.umrahEyebrow}
                title={c.umrahTitle}
                intro={c.umrahIntro}
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
                    <h3 className="font-display text-2xl text-emerald-900">{L(program.name)}</h3>
                    <p className="mt-1 text-label font-semibold uppercase text-charcoal-muted">
                      {programLabels[program.type][lang]}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-body-lg text-charcoal-soft">{L(program.focus)}</p>
                    <ul className="flex flex-col gap-2">
                      {L(program.differentiators).map((item) => (
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
                      {c.seeDetail} {L(program.name)}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 4. Jadwal. Tinted band, timeline rows, and a legend because status is
          carried by shape as well as colour. */}
      {shows("schedule") ? (
        <section className="section bg-emerald-50" aria-labelledby="jadwal-title">
          <div className="shell-container">
            <Reveal>
              <SectionHeading
                eyebrow={c.scheduleEyebrow}
                title={c.scheduleTitle}
                intro={c.scheduleIntro}
                headingId="jadwal-title"
              />
            </Reveal>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
              <div className="flex flex-col gap-5">
                {packages.length === 0 ? (
                  <EmptyState
                    title={c.scheduleEmptyTitle}
                    description={c.scheduleEmptyBody}
                    action={
                      <>
                        <ButtonLink to="/konsultasi" variant="primary">
                          {chrome[lang].cta.consultPlan}
                        </ButtonLink>
                        <ButtonLink to="/jadwal" variant="outline">
                          {c.openSchedule}
                        </ButtonLink>
                      </>
                    }
                  />
                ) : (
                  packages.map((item) => <DepartureCard key={item.id} item={item} />)
                )}
              </div>

              <div className="rounded-lg border border-emerald-200 bg-shell p-5">
                <h3 className="text-display-sm text-emerald-900">{c.legendTitle}</h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.legendIntro}</p>
                <div className="mt-5">
                  <StatusLegend />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Kenapa Rihlah. One reason carries the section, the rest stay
          compact, so the argument has a hierarchy instead of six equal cards. */}
      {shows("why") ? (
        <section className="section bg-shell" aria-labelledby="kenapa-title">
          <div className="shell-container">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <Reveal>
                <SectionHeading
                  eyebrow={c.whyEyebrow}
                  title={c.whyTitle}
                  headingId="kenapa-title"
                />
              </Reveal>
              <div className="flex flex-col gap-8">
                {reasons.map((reason) =>
                  reason.lead ? (
                    <Reveal key={reason.id}>
                      <div className="on-dark rounded-lg border border-emerald-800 bg-emerald-800 p-6 text-shell">
                        <h3 className="text-display-sm">{L(reason.title)}</h3>
                        <p className="mt-3 text-body text-emerald-100">{L(reason.description)}</p>
                      </div>
                    </Reveal>
                  ) : (
                    <Reveal key={reason.id}>
                      <div className="border-t border-emerald-100 pt-5">
                        <h3 className="text-body-lg font-semibold text-emerald-900">
                          {L(reason.title)}
                        </h3>
                        <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                          {L(reason.description)}
                        </p>
                      </div>
                    </Reveal>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Proses. Eight real steps on a rail, because collapsing them to three
          hides the parts jamaah get surprised by, such as document review. */}
      {shows("process") ? (
        <section className="section bg-cream" aria-labelledby="proses-title">
          <div className="shell-container">
            <Reveal>
              <SectionHeading
                eyebrow={c.processEyebrow}
                title={c.processTitle}
                intro={c.processIntro}
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
                    <h3 className="text-body-lg font-semibold text-emerald-900">
                      {L(step.title)}
                    </h3>
                    <p className="text-body-sm text-charcoal-soft">{L(step.description)}</p>
                    <p className="text-body-sm text-charcoal-muted">
                      <span className="font-semibold text-charcoal">{c.prepareLabel}</span>
                      {L(step.jamaahAction)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 7. Program Haji. A real chapter break, so it gets the dark surface and
          the second motif placement. */}
      {shows("haji") ? (
        <section className="on-dark bg-emerald-900 text-shell" aria-labelledby="haji-title">
          <div className="shell-container py-section">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <Reveal>
                <SectionHeading
                  eyebrow={c.hajiEyebrow}
                  title={c.hajiTitle}
                  intro={c.hajiIntro}
                  onDark
                  headingId="haji-title"
                />
              </Reveal>
              <Reveal>
                <div className="flex flex-col gap-5">
                  <div className="rounded-lg border border-emerald-700 bg-emerald-800 p-5">
                    <Tag onDark>{c.hajiStatusTag}</Tag>
                    <p className="mt-3 text-body text-emerald-100">{c.hajiStatusBody}</p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {c.hajiChecks.map((item) => (
                      <li key={item} className="flex gap-3 text-body-sm text-emerald-100">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    to="/paket-haji"
                    variant="primary"
                    size="lg"
                    onDark
                    className="self-start"
                  >
                    {c.openHaji}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
          <GeometricMotif className="h-7 w-full text-emerald-700" scale={30} />
        </section>
      ) : null}

      {/* 8. What every package page states. This explains the pending marks on
          the package pages instead of leaving them unexplained. */}
      {shows("packages") ? (
        <section className="section-tight bg-shell" aria-labelledby="kelengkapan-title">
          <div className="shell-container">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <Reveal>
                <SectionHeading
                  eyebrow={c.packageEyebrow}
                  title={c.packageTitle}
                  intro={c.packageIntro}
                  headingId="kelengkapan-title"
                />
              </Reveal>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {c.packageFields.map((item) => (
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
      ) : null}

      {/* 9. Panduan. One featured article, then the rest compact. */}
      {shows("guides") && articles.length > 0 ? (
        <section className="section bg-emerald-50" aria-labelledby="panduan-title">
          <div className="shell-container">
            <Reveal>
              <SectionHeading
                eyebrow={c.guideEyebrow}
                title={c.guideTitle}
                intro={c.guideIntro}
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
              {c.allGuides}
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {/* 10. FAQ. Sticky heading beside the accordion so the section reads as a
          reference rather than as another stacked block. */}
      {shows("faq") && homeFaqs.length > 0 ? (
        <section className="section bg-shell" aria-labelledby="faq-title">
          <div className="shell-container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading
                  eyebrow={c.faqEyebrow}
                  title={c.faqTitle}
                  intro={c.faqIntro}
                  headingId="faq-title"
                />
                <ButtonLink to="/faq" variant="outline" className="mt-6">
                  {c.allFaqs}
                </ButtonLink>
              </Reveal>
              <FAQAccordion items={homeFaqs} idPrefix="home-faq" />
            </div>
          </div>
        </section>
      ) : null}

      {/* 11. Consultation call to action. */}
      {shows("consult") ? (
        <section className="section-tight bg-cream-deep" aria-labelledby="cta-title">
          <div className="shell-container">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <Reveal className="flex flex-col gap-4">
                <h2 id="cta-title" className="text-display-md text-emerald-900">
                  {c.ctaTitle}
                </h2>
                <p className="max-w-prose text-body-lg text-charcoal-soft">{c.ctaBody}</p>
              </Reveal>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/konsultasi" variant="accent" size="lg">
                  {c.ctaForm}
                </ButtonLink>
                {wa ? (
                  <ButtonAnchor
                    href={wa}
                    variant="outline"
                    size="lg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.ctaWhatsapp}
                  </ButtonAnchor>
                ) : (
                  <ButtonLink to="/kontak" variant="outline" size="lg">
                    {c.ctaContact}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
