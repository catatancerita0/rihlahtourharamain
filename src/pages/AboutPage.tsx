import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { reasons } from "../content/site-content";

const commitments = [
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
];

const scopeLimits = [
  "Persetujuan visa ditentukan oleh kedutaan, konsulat, atau otoritas imigrasi, bukan oleh kami.",
  "Kemunculan aurora dan kondisi cuaca berada di luar kendali penyelenggara.",
  "Jadwal penerbangan dapat berubah karena kebijakan maskapai atau otoritas bandara.",
];

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Rihlah Tour Haramain"
        intro="Penyelenggara perjalanan Umrah dan Haji untuk jamaah Indonesia. Kami menyiapkan program, memeriksa dokumen, dan mendampingi jamaah dari konsultasi sampai kembali."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/paket-umrah" variant="primary" size="lg">
            Lihat Paket Umrah
          </ButtonLink>
          <ButtonLink to="/legalitas" variant="outline" size="lg">
            Lihat data legalitas
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <SectionHeading
                eyebrow="Cara kami bekerja"
                title="Layanan yang bisa Anda minta"
                intro="Rihlah mengerjakan empat hal: menyusun program perjalanan, membantu penyiapan dokumen, menyelenggarakan manasik, dan mendampingi jamaah selama perjalanan."
              />
              <div className="flex flex-col gap-4">
                <p className="max-w-prose text-body-lg text-charcoal-soft">
                  Program tersedia dalam tiga bentuk. Reguler berjalan pada tanggal yang sudah
                  ditetapkan, Plus menambahkan kunjungan di luar Makkah dan Madinah, dan Private
                  disusun mengikuti permintaan rombongan.
                </p>
                <p className="max-w-prose text-body text-charcoal-soft">
                  Konsultasi berjalan online, sehingga Anda bisa memulai dari kota mana pun. Kunjungan
                  ke kantor dilakukan dengan janji temu, bukan tanpa perjanjian.
                </p>
              </div>
              <ButtonLink to="/paket-umrah" variant="outline" className="self-start">
                Bandingkan tiga program Umrah
              </ButtonLink>
            </div>

            <div className="flex flex-col gap-5">
              {commitments.map((item) => (
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
              eyebrow="Batas layanan"
              title="Yang tidak bisa kami janjikan"
              intro="Menuliskan batas ini lebih berguna daripada menambah klaim."
            />
            <ul className="flex flex-col gap-4">
              {scopeLimits.map((item) => (
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
              <h2 className="text-display-md text-emerald-900">Kenapa kami menulis seperti ini</h2>
              <p className="max-w-prose text-body text-charcoal-soft">
                Calon jamaah biasanya membandingkan beberapa penyelenggara. Perbandingan itu hanya
                adil kalau tiap penawaran memisahkan yang termasuk dan yang tidak termasuk. Empat
                alasan di bawah ini yang paling sering menentukan keputusan.
              </p>
            </div>
            <ol className="flex flex-col gap-5">
              {reasons.map((reason, index) => (
                <li key={reason.id} className="flex gap-4 border-t border-emerald-100 pt-5">
                  <span className="tabular font-display text-2xl text-emerald-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-emerald-900">{reason.title}</h3>
                    <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                      {reason.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-emerald-100 pt-8">
            <Link
              to="/pembimbing"
              className="rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
            >
              Lihat halaman pembimbing
            </Link>
            <Link
              to="/legalitas"
              className="rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
            >
              Periksa identitas resmi penyelenggara
            </Link>
            <Link
              to="/konsultasi"
              className="rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
            >
              Mulai konsultasi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
