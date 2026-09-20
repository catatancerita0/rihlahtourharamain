import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";
import { Link } from "react-router-dom";

const sections: LegalSection[] = [
  {
    id: "ringkasan",
    heading: "Ringkasan",
    body: [
      "Halaman ini menjelaskan data apa yang diproses ketika Anda membuka situs Rihlah Tour Haramain. Isinya dibatasi pada hal yang benar-benar terjadi di situs ini, dan bagian yang masih harus ditetapkan penyelenggara ditandai terpisah.",
      "Situs ini tidak meminta Anda membuat akun dan tidak memproses pembayaran.",
    ],
  },
  {
    id: "formulir",
    heading: "Formulir konsultasi",
    body: [
      "Formulir konsultasi di halaman konsultasi berjalan sepenuhnya di peramban Anda. Isian nama, nomor WhatsApp, jumlah jamaah, dan catatan tidak dikirim ke server kami, dan tidak disimpan di situs ini.",
      "Setelah diperiksa, isian itu disusun menjadi ringkasan. Ringkasan tersebut hanya berpindah tempat ketika Anda sendiri mengirimkannya melalui WhatsApp atau menyalinnya secara manual.",
      "Konsekuensinya sederhana: selama Anda belum mengirim ringkasan itu ke kanal resmi, kami tidak memiliki data Anda.",
    ],
  },
  {
    id: "pihak-ketiga",
    heading: "Permintaan ke pihak ketiga",
    body: [
      "Situs ini memuat huruf dari layanan Google Fonts. Karena itu peramban Anda menghubungi server Google ketika halaman dibuka, dan Google dapat mencatat alamat IP serta informasi peramban Anda sesuai kebijakan mereka sendiri.",
      "Situs ini tidak memasang skrip analitik, iklan, atau pelacak pihak ketiga lainnya. Pemanggilan WhatsApp hanya terjadi setelah Anda menekan tombol yang mengarah ke sana.",
      "Penyedia hosting dapat menyimpan catatan server standar seperti alamat IP, waktu akses, dan jenis peramban untuk keperluan keamanan dan pemantauan.",
    ],
    pending: [
      "Nama penyedia hosting yang dipakai dan lokasi penyimpanan datanya.",
      "Apakah huruf akan dilayani sendiri agar tidak ada permintaan ke pihak ketiga.",
      "Rencana penambahan alat analitik, dan dasar yang dipakai bila itu dilakukan.",
    ],
  },
  {
    id: "wa-email",
    heading: "Data yang Anda kirim lewat WhatsApp atau email",
    body: [
      "Setelah Anda mengirim pesan, dokumen, atau bukti pembayaran melalui WhatsApp atau email, data itu diterima dan diproses oleh tim untuk menjalankan layanan yang Anda minta: menyiapkan penawaran, mengurus dokumen perjalanan, dan mengelola keberangkatan.",
      "Penyedia layanan pesan dan email yang Anda pakai juga memproses data tersebut sesuai kebijakan mereka sendiri.",
    ],
    pending: [
      "Berapa lama data disimpan, dan apa yang menentukan lamanya.",
      "Siapa saja di dalam tim yang dapat mengakses dokumen perjalanan dan data pembayaran.",
      "Pihak ketiga yang menerima data, misalnya maskapai, hotel, atau penyedia layanan visa.",
      "Prosedur penghapusan data setelah layanan selesai atau setelah permintaan Anda.",
    ],
  },
  {
    id: "hak",
    heading: "Hak Anda atas data",
    body: [
      "Anda dapat meminta salinan, perbaikan, atau penghapusan data yang Anda kirim ke tim, sepanjang permintaan itu tidak berbenturan dengan kewajiban administrasi atau pembukuan yang berlaku.",
      "Permintaan disampaikan lewat kanal resmi yang tercantum di halaman kontak, supaya identitas pemohon bisa dipastikan lebih dulu.",
    ],
    pending: [
      "Alamat email atau nomor resmi khusus untuk permintaan data, yang aktif memantau.",
      "Perkiraan waktu tanggapan atas permintaan akses atau penghapusan data.",
    ],
  },
  {
    id: "perubahan",
    heading: "Perubahan dokumen ini",
    body: [
      "Kebijakan ini diperbarui ketika ada perubahan nyata pada cara situs dan tim memproses data, misalnya ketika alat analitik atau sistem pemesanan ditambahkan.",
    ],
    pending: [
      "Tanggal berlaku dokumen setelah disetujui penyelenggara.",
      "Cara memberi tahu jamaah yang sudah terdaftar bila ada perubahan penting.",
    ],
  },
];

export function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kebijakan Privasi"
        title="Data apa yang diproses, dan apa yang tidak"
        intro="Ditulis berdasarkan apa yang benar-benar dilakukan situs ini. Bagian yang belum ditetapkan penyelenggara ditandai di tiap seksi."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <LegalDocument sections={sections} />
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Dokumen terkait
                </h2>
                <ul className="mt-3 flex flex-col gap-2 text-body-sm">
                  <li>
                    <Link
                      to="/syarat-ketentuan"
                      className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                    >
                      Syarat dan ketentuan
                    </Link>
                  </li>
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
                      to="/legalitas"
                      className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                    >
                      Legalitas dan keamanan
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
