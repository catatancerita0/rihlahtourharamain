import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { reasons } from "../content/site-content";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Tentang Kami",
  title: "Rihlah Tour Haramain",
  intro:
    "Penyelenggara perjalanan Umrah dan Haji untuk jamaah Indonesia. Kami menyiapkan program, memeriksa dokumen, dan mendampingi jamaah dari konsultasi sampai kembali.",
  seePackages: "Lihat Paket Umrah",
  seeLicensing: "Lihat data legalitas",
  howEyebrow: "Cara kami bekerja",
  howTitle: "Layanan yang bisa Anda minta",
  howIntro:
    "Rihlah mengerjakan empat hal: menyusun program perjalanan, membantu penyiapan dokumen, menyelenggarakan manasik, dan mendampingi jamaah selama perjalanan.",
  programsBody:
    "Program tersedia dalam tiga bentuk. Reguler berjalan pada tanggal yang sudah ditetapkan, Plus menambahkan kunjungan di luar Makkah dan Madinah, dan Private disusun mengikuti permintaan rombongan.",
  consultationBody:
    "Konsultasi berjalan online, sehingga Anda bisa memulai dari kota mana pun. Kunjungan ke kantor dilakukan dengan janji temu, bukan tanpa perjanjian.",
  compare: "Bandingkan tiga program Umrah",
  limitsEyebrow: "Batas layanan",
  limitsTitle: "Yang tidak bisa kami janjikan",
  limitsIntro: "Menuliskan batas ini lebih berguna daripada menambah klaim.",
  writeEyebrow: "Cara kami menulis",
  writeTitle: "Kenapa kami menulis seperti ini",
  writeBody:
    "Calon jamaah biasanya membandingkan beberapa penyelenggara. Perbandingan itu hanya adil kalau tiap penawaran memisahkan yang termasuk dan yang tidak termasuk. Empat alasan di bawah ini yang paling sering menentukan keputusan.",
  linkPembimbing: "Lihat halaman pembimbing",
  linkLicensing: "Periksa identitas resmi penyelenggara",
  linkConsult: "Mulai konsultasi",
  commitments: [
    {
      id: "amanah",
      title: "Menulis apa adanya",
      body: "Kalau harga, jadwal, atau hotel belum ditetapkan, kami menuliskannya belum ditetapkan. Halaman paket tidak diisi angka sementara hanya supaya terlihat lengkap.",
    },
    {
      id: "tenang",
      title: "Menjelaskan sebelum meminta keputusan",
      body: "Rincian fasilitas, biaya, dan hal yang tidak termasuk disampaikan sebelum pendaftaran, bukan sesudahnya.",
    },
    {
      id: "manusiawi",
      title: "Membahas ritme, bukan hanya rute",
      body: "Kebutuhan jamaah lansia, keluarga dengan anak, dan jamaah yang baru pertama kali berangkat dibicarakan sejak konsultasi.",
    },
    {
      id: "rapi",
      title: "Merapikan berkas lebih dulu",
      body: "Ketidakcocokan data ditemukan di meja pemeriksaan tim, bukan di loket saat waktunya sudah mendesak.",
    },
  ],
  scopeLimits: [
    "Persetujuan visa ditentukan oleh kedutaan, konsulat, atau otoritas imigrasi, bukan oleh kami.",
    "Kondisi cuaca dan suhu di Tanah Suci berada di luar kendali penyelenggara.",
    "Jadwal penerbangan dapat berubah karena kebijakan maskapai atau otoritas bandara.",
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "About Us",
  title: "Rihlah Tour Haramain",
  intro:
    "An Umrah and Hajj travel organiser for Indonesian pilgrims. We put the programmes together, check documents, and stay with pilgrims from the first consultation until they are home.",
  seePackages: "See Umrah packages",
  seeLicensing: "See licensing data",
  howEyebrow: "How we work",
  howTitle: "What you can ask us to do",
  howIntro:
    "Rihlah does four things: builds the travel programme, helps prepare documents, runs the manasik briefing, and supports pilgrims throughout the trip.",
  programsBody:
    "Programmes come in three forms. Regular runs on dates that are already set, Plus adds a visit outside Makkah and Madinah, and Private is arranged around what the group asks for.",
  consultationBody:
    "Consultations happen online, so you can start from any city. Office visits are by appointment rather than without one.",
  compare: "Compare the three Umrah programmes",
  limitsEyebrow: "Limits of the service",
  limitsTitle: "What we cannot promise",
  limitsIntro: "Writing these limits down is more useful than adding another claim.",
  writeEyebrow: "How we write",
  writeTitle: "Why we write this way",
  writeBody:
    "Prospective pilgrims usually compare several organisers. That comparison is only fair when each offer separates what is included from what is not. The four points below are the ones that most often decide the choice.",
  linkPembimbing: "See who accompanies the group",
  linkLicensing: "Check the organiser's official identity",
  linkConsult: "Start a consultation",
  commitments: [
    {
      id: "amanah",
      title: "We write things as they are",
      body: "If a price, date or hotel is not settled, we write that it is not settled. Package pages are not padded with provisional figures just to look complete.",
    },
    {
      id: "tenang",
      title: "We explain before asking for a decision",
      body: "Facilities, costs and what is not included are set out before registration, not after it.",
    },
    {
      id: "manusiawi",
      title: "We discuss pace, not only the route",
      body: "The needs of elderly pilgrims, families with children, and first-time pilgrims are raised from the first conversation.",
    },
    {
      id: "rapi",
      title: "We tidy the paperwork first",
      body: "Mismatched data is found at our review desk, not at a counter when time is already short.",
    },
  ],
  scopeLimits: [
    "Visa approval is decided by the embassy, consulate or immigration authorities, not by us.",
    "Weather and temperatures in the holy land are outside the organiser's control.",
    "Flight schedules can change because of airline policy or airport authority decisions.",
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const linkClass =
  "rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800";

export function AboutPage() {
  const c = useCopy(copy);
  const L = usePick();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/paket-umrah" variant="primary" size="lg" onDark>
            {c.seePackages}
          </ButtonLink>
          <ButtonLink to="/legalitas" variant="outline" size="lg" onDark>
            {c.seeLicensing}
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow={c.howEyebrow} title={c.howTitle} intro={c.howIntro} />
              <div className="flex flex-col gap-4">
                <p className="max-w-prose text-body-lg text-charcoal-soft">{c.programsBody}</p>
                <p className="max-w-prose text-body text-charcoal-soft">{c.consultationBody}</p>
              </div>
              <ButtonLink to="/paket-umrah" variant="outline" className="self-start">
                {c.compare}
              </ButtonLink>
            </div>

            <div className="flex flex-col gap-5">
              {c.commitments.map((item) => (
                <div key={item.id} className="border-t border-emerald-100 pt-5">
                  <h3 className="text-body-lg font-semibold text-emerald-900">{item.title}</h3>
                  <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow={c.limitsEyebrow}
              title={c.limitsTitle}
              intro={c.limitsIntro}
            />
            <ul className="flex flex-col gap-4">
              {c.scopeLimits.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-emerald-200 pb-4 text-body text-charcoal-soft"
                >
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight bg-shell">
        <div className="shell-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-display-md text-emerald-900">{c.writeTitle}</h2>
              <p className="max-w-prose text-body text-charcoal-soft">{c.writeBody}</p>
            </div>
            <ol className="flex flex-col gap-5">
              {reasons.map((reason, index) => (
                <li key={reason.id} className="flex gap-4 border-t border-emerald-100 pt-5">
                  <span className="tabular font-display text-2xl text-emerald-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-emerald-900">{L(reason.title)}</h3>
                    <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                      {L(reason.description)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-emerald-100 pt-8">
            <Link to="/pembimbing" className={linkClass}>
              {c.linkPembimbing}
            </Link>
            <Link to="/legalitas" className={linkClass}>
              {c.linkLicensing}
            </Link>
            <Link to="/konsultasi" className={linkClass}>
              {c.linkConsult}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
