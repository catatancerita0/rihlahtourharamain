import { Link } from "react-router-dom";
import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Syarat & Ketentuan",
  title: "Ketentuan pemesanan dan layanan",
  intro:
    "Bagian yang sudah tetap kami tuliskan penuh. Ketentuan yang bergantung pada kebijakan internal penyelenggara ditandai agar tidak dibaca sebagai janji.",
  asideTitle: "Sebelum mendaftar",
  asideBody:
    "Baca ketentuan pembatalan dan refund bersama halaman ini, lalu tanyakan bagian yang belum jelas untuk program yang Anda pilih.",
  links: [
    { label: "Pembatalan dan refund", to: "/pembatalan-refund" },
    { label: "Kebijakan privasi", to: "/kebijakan-privasi" },
    { label: "Pertanyaan umum", to: "/faq" },
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Terms & Conditions",
  title: "Booking and service terms",
  intro:
    "The parts that are already fixed are written out in full. Terms that depend on the organiser's internal policy are marked so they are not read as a promise.",
  asideTitle: "Before registering",
  asideBody:
    "Read the cancellation and refund terms alongside this page, then ask about anything unclear for the programme you are considering.",
  links: [
    { label: "Cancellation and refund", to: "/pembatalan-refund" },
    { label: "Privacy policy", to: "/kebijakan-privasi" },
    { label: "Common questions", to: "/faq" },
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const sections: Localized<LegalSection[]> = {
  id: [
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
      body: ["Ketentuan ini tunduk pada hukum yang berlaku di Indonesia."],
      pending: [
        "Pilihan forum penyelesaian sengketa.",
        "Nama badan usaha dan alamat hukum yang dipakai untuk keperluan somasi.",
      ],
    },
  ],
  en: [
    {
      id: "ruang-lingkup",
      heading: "Scope",
      body: [
        "These terms apply to your use of the Rihlah Tour Haramain site and to programme registrations booked through our team.",
        "This site presents programmes and schedules. A booking happens after you receive a written offer and accept it, not by pressing a button on the site.",
      ],
    },
    {
      id: "harga",
      heading: "Prices and availability",
      body: [
        "The prices shown follow the data the team has published. If a package lists no price, the rate for that departure has not been set, which does not mean it is free or waiting for a discount.",
        "A listed price applies to the facilities stated on the package page. Anything not listed under facilities is not included in that price.",
        "Seat availability follows the status shown on the schedule page. A full status means registration for that departure has closed.",
      ],
    },
    {
      id: "pendaftaran",
      heading: "Registration and payment",
      body: [
        "Registration is under way once documents are verified and the initial payment has been received according to the details in the offer.",
        "Payments are only ever directed to an account in the business name listed on the licensing page.",
      ],
      pending: [
        "The size of the initial payment and its settlement deadline.",
        "Accepted payment methods and valid proof of payment.",
        "What happens if settlement goes past the deadline.",
        "Terms for transferring a registration to another participant.",
      ],
    },
    {
      id: "jadwal",
      heading: "Schedule changes",
      body: [
        "A published schedule can change because of flight availability, airline policy, rules set by the authorities, or other conditions outside the organiser's control.",
        "Changes are passed on to registered pilgrims through the official channels.",
      ],
      pending: [
        "How far ahead of departure changes are usually announced.",
        "The options offered to pilgrims if a schedule changes.",
        "How additional costs arising from a schedule change are handled.",
      ],
    },
    {
      id: "dokumen-visa",
      heading: "Documents and visas",
      body: [
        "We help prepare and check the paperwork. The decision to grant a visa rests entirely with the embassy, consulate, or competent immigration authority.",
        "We therefore do not promise that a visa will be issued, and we cannot speed up checks carried out by the authorities.",
        "The accuracy of the data you send is your responsibility. Data that does not match across documents is the most common reason paperwork is returned.",
      ],
    },
    {
      id: "di-luar-kendali",
      heading: "Events outside our control",
      body: [
        "Events outside our control include natural disasters, outbreaks, conflict, airport or airspace closures, changes in government policy, immigration restrictions, and security disruptions affecting travel.",
        "In those conditions the organiser may adjust the route, the airline, transit cities, or the order of activities for the safety and smooth running of the group.",
        "Adjustments made for safety reasons cannot be used as the basis for a claim over services that were not used.",
      ],
      pending: [
        "How additional costs are shared between the organiser and pilgrims.",
        "Refund terms if a trip is cancelled in part or in full.",
      ],
    },
    {
      id: "hukum",
      heading: "Governing law",
      body: ["These terms are governed by the laws in force in Indonesia."],
      pending: [
        "The choice of forum for resolving disputes.",
        "The business name and legal address used for formal notices.",
      ],
    },
  ],
};

export function TermsPage() {
  const c = useCopy(copy);
  const L = usePick();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <LegalDocument sections={L(sections)} />
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.asideTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.asideBody}</p>
                <ul className="mt-4 flex flex-col gap-2 text-body-sm">
                  {c.links.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
