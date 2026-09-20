import { Link } from "react-router-dom";
import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";

const sections: LegalSection[] = [
  {
    id: "ruang-lingkup",
    heading: "Ruang lingkup",
    body: [
      "Ketentuan ini berlaku untuk penggunaan situs Rihlah Tour Haramain dan untuk pendaftaran program yang dipesan melalui tim kami.",
      "Situs ini menampilkan program dan jadwal. Pemesanan terjadi setelah Anda menerima penawaran tertulis dan menyetujuinya, bukan dengan menekan tombol di situs.",
    ],
  },
  {
    id: "harga",
    heading: "Harga dan ketersediaan",
    body: [
      "Harga yang ditampilkan mengikuti data yang sudah dipublikasikan tim. Kalau sebuah paket belum mencantumkan harga, artinya tarif untuk keberangkatan itu belum ditetapkan, dan bukan berarti gratis atau menunggu diskon.",
      "Harga yang tercantum berlaku untuk fasilitas yang tertera pada halaman paket. Hal yang tidak tercantum pada bagian fasilitas termasuk tidak termasuk dalam harga tersebut.",
      "Ketersediaan kursi mengikuti status yang ditampilkan pada halaman jadwal. Status penuh berarti pendaftaran pada keberangkatan itu sudah ditutup.",
    ],
  },
  {
    id: "pendaftaran",
    heading: "Pendaftaran dan pembayaran",
    body: [
      "Pendaftaran dianggap berjalan setelah berkas diverifikasi dan pembayaran awal diterima sesuai rincian yang tercantum pada penawaran.",
      "Pembayaran hanya diarahkan ke rekening atas nama badan usaha yang tercantum di halaman legalitas.",
    ],
    pending: [
      "Besaran pembayaran awal dan tenggat pelunasannya.",
      "Metode pembayaran yang diterima dan bukti pembayaran yang sah.",
      "Konsekuensi bila pelunasan melewati tenggat.",
      "Ketentuan pengalihan pendaftaran ke peserta lain.",
    ],
  },
  {
    id: "jadwal",
    heading: "Perubahan jadwal",
    body: [
      "Jadwal yang sudah dipublikasikan dapat berubah karena ketersediaan penerbangan, kebijakan maskapai, ketentuan otoritas, atau kondisi lain di luar kendali penyelenggara.",
      "Perubahan diinformasikan ke jamaah yang sudah terdaftar melalui kanal resmi.",
    ],
    pending: [
      "Berapa lama sebelum keberangkatan perubahan biasanya diinformasikan.",
      "Pilihan yang diberikan ke jamaah bila jadwal berubah.",
      "Perlakuan biaya tambahan yang timbul akibat perubahan jadwal.",
    ],
  },
  {
    id: "dokumen-visa",
    heading: "Dokumen dan visa",
    body: [
      "Kami membantu menyiapkan dan memeriksa berkas. Keputusan pemberian visa sepenuhnya berada pada kedutaan, konsulat, atau otoritas imigrasi yang berwenang.",
      "Karena itu kami tidak menjanjikan visa pasti terbit, dan tidak dapat mempercepat pemeriksaan yang dilakukan otoritas.",
      "Kebenaran data yang Anda kirim adalah tanggung jawab Anda. Ketidakcocokan data antar dokumen adalah penyebab paling umum berkas dikembalikan.",
    ],
  },
  {
    id: "di-luar-kendali",
    heading: "Kejadian di luar kendali",
    body: [
      "Kejadian di luar kendali mencakup bencana alam, wabah, konflik, penutupan bandara atau wilayah udara, perubahan kebijakan pemerintah, pembatasan imigrasi, dan gangguan keamanan yang memengaruhi perjalanan.",
      "Dalam kondisi seperti itu, penyelenggara dapat menyesuaikan rute, maskapai, kota transit, atau urutan kegiatan demi keselamatan dan kelancaran rombongan.",
      "Penyesuaian yang dilakukan karena alasan keselamatan tidak dapat dijadikan dasar klaim atas layanan yang tidak terpakai.",
    ],
    pending: [
      "Pembagian biaya tambahan antara penyelenggara dan jamaah.",
      "Ketentuan pengembalian dana bila perjalanan dibatalkan sebagian atau seluruhnya.",
    ],
  },
  {
    id: "hukum",
    heading: "Hukum yang berlaku",
    body: [
      "Ketentuan ini tunduk pada hukum yang berlaku di Indonesia.",
    ],
    pending: [
      "Pilihan forum penyelesaian sengketa.",
      "Nama badan usaha dan alamat hukum yang dipakai untuk keperluan somasi.",
    ],
  },
];

export function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Syarat & Ketentuan"
        title="Ketentuan pemesanan dan layanan"
        intro="Bagian yang sudah tetap kami tuliskan penuh. Ketentuan yang bergantung pada kebijakan internal penyelenggara ditandai agar tidak dibaca sebagai janji."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <LegalDocument sections={sections} />
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Sebelum mendaftar
                </h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Baca ketentuan pembatalan dan refund bersama halaman ini, lalu tanyakan bagian
                  yang belum jelas untuk program yang Anda pilih.
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-body-sm">
                  <li>
                    <Link
                      to="/pembatalan-refund"
                      className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                    >
                      Pembatalan dan refund
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/kebijakan-privasi"
                      className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                    >
                      Kebijakan privasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                    >
                      Pertanyaan umum
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
