import { Link } from "react-router-dom";
import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Pembatalan & Refund",
  title: "Ketentuan pembatalan dan pengembalian dana",
  intro:
    "Halaman ini belum memuat angka karena kebijakannya belum ditetapkan. Isinya menjelaskan apa yang harus Anda minta secara tertulis sebelum membayar.",
  asideTitle: "Minta ketentuan tertulis",
  asideBody:
    "Sebelum membayar, tanyakan ketentuan pembatalan untuk program yang Anda pilih dan minta jawabannya dalam bentuk tertulis.",
  asideAction: "Ajukan pertanyaan",
  alsoSee: "Lihat juga",
  termsLink: "syarat dan ketentuan",
};

const enCopy: typeof idCopy = {
  eyebrow: "Cancellation & Refund",
  title: "Cancellation and refund terms",
  intro:
    "This page carries no figures because the policy has not been set yet. It explains what you should ask for in writing before paying.",
  asideTitle: "Ask for the terms in writing",
  asideBody:
    "Before paying, ask about the cancellation terms for the programme you are considering and request the answer in writing.",
  asideAction: "Ask a question",
  alsoSee: "See also",
  termsLink: "terms and conditions",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const sections: Localized<LegalSection[]> = {
  id: [
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
  ],
  en: [
    {
      id: "status",
      heading: "Status of this policy",
      body: [
        "The cancellation and refund terms for Rihlah Tour Haramain programmes have not been set by the organiser, so this page states no figures.",
        "We write it this way so that no pilgrim registers with the wrong assumption about refunds. A tidy-looking estimate is exactly what is dangerous in this part of the agreement.",
        "Until the policy is published, ask for the cancellation terms in writing before you make a payment, and make sure they appear in the offer you accept.",
      ],
    },
    {
      id: "cakupan",
      heading: "What this policy has to answer",
      body: [
        "The list below covers the questions that most determine a pilgrim's loss if a cancellation happens. We use it as the reference when the policy is drafted.",
      ],
      pending: [
        "Cancellation deadlines and the fee that applies at each stage.",
        "Cost components that cannot be refunded because they have already been paid to an airline or hotel.",
        "How costs are handled when a visa application is refused by the authorities.",
        "How costs are handled when a schedule changes at the organiser's initiative rather than at the pilgrim's request.",
        "How it is handled when one participant cannot travel for health reasons.",
        "The estimated refund processing time, counted from approval of the request.",
        "Terms for transferring a registration to another participant as an alternative to cancelling.",
      ],
    },
    {
      id: "perubahan-peserta",
      heading: "Replacing a participant or changing the date",
      body: [
        "A request to replace a participant or change the date depends on seat availability and on the policy of the airline and hotel already booked.",
        "While the official terms remain unpublished, changes like these can only be discussed case by case through the team.",
      ],
      pending: [
        "Conditions for replacing a participant, including which documents have to be updated.",
        "Any administration fee that applies.",
        "The deadline for requesting a change before departure.",
      ],
    },
    {
      id: "langkah",
      heading: "What you can do now",
      body: [
        "Before paying, ask for a written offer covering the facilities, the cost, what is not included, and the cancellation terms. Keep that document.",
        "Make sure the number and bank account used for payment match the ones listed on the licensing page.",
      ],
    },
  ],
};

export function CancellationPage() {
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
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  {c.asideAction}
                </ButtonLink>
                <p className="mt-4 text-body-sm text-charcoal-soft">
                  {c.alsoSee}{" "}
                  <Link
                    to="/syarat-ketentuan"
                    className="text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                  >
                    {c.termsLink}
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
