import { Link } from "react-router-dom";
import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";

const sections: LegalSection[] = [
  {
    id: "status",
    heading: "Status kebijakan ini",
    body: [
      "Ketentuan pembatalan dan pengembalian dana untuk program Rihlah Tour Haramain belum ditetapkan oleh penyelenggara, jadi halaman ini tidak mencantumkan angka apa pun.",
      "Kami menuliskannya seperti ini supaya tidak ada jamaah yang mendaftar dengan asumsi yang salah tentang pengembalian dana. Perkiraan yang terlihat rapi justru berbahaya pada bagian ini.",
      "Sampai kebijakannya terbit, mintalah ketentuan pembatalan secara tertulis sebelum Anda melakukan pembayaran, dan pastikan ketentuan itu tercantum pada penawaran yang Anda setujui.",
    ],
  },
  {
    id: "cakupan",
    heading: "Yang harus dijawab kebijakan ini",
    body: [
      "Daftar berikut adalah pertanyaan yang paling menentukan kerugian jamaah bila pembatalan terjadi. Kami memakai daftar ini sebagai acuan saat menyusun kebijakannya.",
    ],
    pending: [
      "Batas waktu pembatalan dan besaran biaya pada setiap tahap.",
      "Komponen biaya yang tidak dapat dikembalikan karena sudah dibayarkan ke maskapai atau hotel.",
      "Perlakuan biaya ketika permohonan visa ditolak oleh otoritas.",
      "Perlakuan ketika jadwal berubah atas inisiatif penyelenggara, bukan atas permintaan jamaah.",
      "Perlakuan ketika salah satu peserta tidak dapat berangkat karena alasan kesehatan.",
      "Perkiraan waktu proses pengembalian dana dihitung sejak pengajuan disetujui.",
      "Ketentuan pengalihan pendaftaran ke peserta lain sebagai alternatif pembatalan.",
    ],
  },
  {
    id: "perubahan-peserta",
    heading: "Mengganti peserta atau mengubah tanggal",
    body: [
      "Permintaan penggantian peserta atau perubahan tanggal bergantung pada ketersediaan kursi dan kebijakan maskapai serta hotel yang sudah dipesan.",
      "Selama ketentuan resminya belum terbit, perubahan seperti ini hanya bisa dibahas per kasus melalui tim.",
    ],
    pending: [
      "Syarat penggantian peserta, termasuk dokumen yang harus diperbarui.",
      "Biaya administrasi yang berlaku, bila ada.",
      "Batas waktu pengajuan perubahan sebelum keberangkatan.",
    ],
  },
  {
    id: "langkah",
    heading: "Langkah yang bisa Anda lakukan sekarang",
    body: [
      "Sebelum membayar, minta penawaran tertulis yang memuat fasilitas, biaya, hal yang tidak termasuk, dan ketentuan pembatalan. Simpan dokumen itu.",
      "Pastikan nomor dan rekening yang dipakai untuk pembayaran cocok dengan yang tercantum di halaman legalitas.",
    ],
  },
];

export function CancellationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pembatalan & Refund"
        title="Ketentuan pembatalan dan pengembalian dana"
        intro="Halaman ini belum memuat angka karena kebijakannya belum ditetapkan. Isinya menjelaskan apa yang harus Anda minta secara tertulis sebelum membayar."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <LegalDocument sections={sections} />
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Minta ketentuan tertulis
                </h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Sebelum membayar, tanyakan ketentuan pembatalan untuk program yang Anda pilih dan
                  minta jawabannya dalam bentuk tertulis.
                </p>
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  Ajukan pertanyaan
                </ButtonLink>
                <p className="mt-4 text-body-sm text-charcoal-soft">
                  Lihat juga{" "}
                  <Link
                    to="/syarat-ketentuan"
                    className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                  >
                    syarat dan ketentuan
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
