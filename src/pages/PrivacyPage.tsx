import { Link } from "react-router-dom";
import { LegalDocument, type LegalSection } from "../components/LegalDocument";
import { PageHeader } from "../components/layout/PageHeader";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Kebijakan Privasi",
  title: "Data apa yang diproses, dan apa yang tidak",
  intro:
    "Ditulis berdasarkan apa yang benar-benar dilakukan situs ini. Bagian yang belum ditetapkan penyelenggara ditandai di tiap seksi.",
  related: "Dokumen terkait",
  links: [
    { label: "Syarat dan ketentuan", to: "/syarat-ketentuan" },
    { label: "Pembatalan dan refund", to: "/pembatalan-refund" },
    { label: "Legalitas dan keamanan", to: "/legalitas" },
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Privacy Policy",
  title: "What data is processed, and what is not",
  intro:
    "Written from what this site actually does. Anything the organiser has not decided is marked within each section.",
  related: "Related documents",
  links: [
    { label: "Terms and conditions", to: "/syarat-ketentuan" },
    { label: "Cancellation and refund", to: "/pembatalan-refund" },
    { label: "Licensing and safety", to: "/legalitas" },
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const sections: Localized<LegalSection[]> = {
  id: [
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
  ],
  en: [
    {
      id: "ringkasan",
      heading: "Summary",
      body: [
        "This page explains what data is processed when you open the Rihlah Tour Haramain site. It is limited to what actually happens here, and anything the organiser still has to decide is marked separately.",
        "This site does not ask you to create an account and does not process payments.",
      ],
    },
    {
      id: "formulir",
      heading: "The consultation form",
      body: [
        "The consultation form on the consultation page runs entirely in your browser. The name, WhatsApp number, number of pilgrims and notes you enter are not sent to our server and are not stored on this site.",
        "Once checked, those answers are put together as a summary. That summary only moves anywhere when you send it yourself through WhatsApp or copy it by hand.",
        "The consequence is simple: until you send that summary to an official channel, we do not hold your data.",
      ],
    },
    {
      id: "pihak-ketiga",
      heading: "Requests to third parties",
      body: [
        "This site loads typefaces from Google Fonts. Your browser therefore contacts Google's servers when a page opens, and Google may record your IP address and browser information under its own policy.",
        "This site installs no analytics scripts, advertising, or other third-party trackers. WhatsApp is only opened after you press a button that points there.",
        "The hosting provider may keep standard server logs such as IP address, access time and browser type for security and monitoring.",
      ],
      pending: [
        "The name of the hosting provider in use and where its data is stored.",
        "Whether the typefaces will be self-hosted so that no third-party request is made.",
        "Any plan to add analytics tools, and the basis used if that happens.",
      ],
    },
    {
      id: "wa-email",
      heading: "Data you send through WhatsApp or email",
      body: [
        "Once you send a message, documents or proof of payment through WhatsApp or email, that data is received and processed by the team to deliver the service you asked for: preparing an offer, handling travel documents, and managing the departure.",
        "The messaging and email providers you use also process that data under their own policies.",
      ],
      pending: [
        "How long data is kept, and what determines that period.",
        "Who within the team can access travel documents and payment data.",
        "Third parties that receive data, for example airlines, hotels, or visa service providers.",
        "The procedure for deleting data once the service ends or at your request.",
      ],
    },
    {
      id: "hak",
      heading: "Your rights over your data",
      body: [
        "You can ask for a copy, a correction, or the deletion of the data you send to the team, as long as the request does not conflict with applicable administrative or accounting obligations.",
        "Requests are made through the official channels listed on the contact page, so that the requester's identity can be confirmed first.",
      ],
      pending: [
        "An official email address or number dedicated to data requests, which is actively monitored.",
        "The expected response time for an access or deletion request.",
      ],
    },
    {
      id: "perubahan",
      heading: "Changes to this document",
      body: [
        "This policy is updated when there is a real change in how the site and the team process data, for example when analytics tools or a booking system are added.",
      ],
      pending: [
        "The document's effective date once the organiser approves it.",
        "How registered pilgrims are told about important changes.",
      ],
    },
  ],
};

export function PrivacyPage() {
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
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.related}</h2>
                <ul className="mt-3 flex flex-col gap-2 text-body-sm">
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
