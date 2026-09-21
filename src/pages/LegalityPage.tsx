import { ContactChannels, ContactPendingNotice } from "../components/ContactChannels";
import { LegalityPanel } from "../components/LegalityPanel";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Legalitas dan keamanan",
  title: "Periksa identitas penyelenggara sebelum membayar",
  intro:
    "Halaman ini memuat data resmi yang bisa Anda cocokkan dengan dokumen penawaran, plus kanal komunikasi yang sah. Kalau ada yang tidak cocok, hentikan proses dan konfirmasi lebih dulu.",
  noteTitle: "Catatan penting",
  noteBody:
    "Selama kolom nomor izin dan nama badan usaha masih kosong, halaman ini belum bisa dipakai sebagai bukti legalitas. Isi kolom tersebut dari dokumen resmi, bukan dari materi promosi, supaya jamaah bisa memverifikasi sendiri.",
  channelsEyebrow: "Kanal resmi",
  channelsTitle: "Cara menghubungi kami",
  channelsIntro:
    "Gunakan kanal di bawah ini saja. Kami tidak pernah meminta pembayaran ke rekening yang tidak tercantum di halaman ini.",
  reportBody:
    "Kalau Anda menerima pesan yang mengatasnamakan Rihlah dengan nomor, email, atau rekening yang berbeda, laporkan ke kanal resmi supaya bisa kami tindak lanjuti.",
  openContact: "Buka halaman kontak",
};

const enCopy: typeof idCopy = {
  eyebrow: "Licensing and safety",
  title: "Check the organiser's identity before paying",
  intro:
    "This page holds official data you can match against the offer documents, plus the legitimate ways to reach us. If something does not match, stop and confirm first.",
  noteTitle: "Important note",
  noteBody:
    "While the licence number and business name fields are still empty, this page cannot be used as proof of licensing. Fill those fields from official documents rather than promotional material, so pilgrims can verify them independently.",
  channelsEyebrow: "Official channels",
  channelsTitle: "How to reach us",
  channelsIntro:
    "Use only the channels below. We never ask for payment to an account that is not listed on this page.",
  reportBody:
    "If you receive a message claiming to be from Rihlah with a different number, email address or bank account, report it through the official channels so we can follow it up.",
  openContact: "Open the contact page",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function LegalityPage() {
  const c = useCopy(copy);

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <LegalityPanel />

          <div className="mt-10 rounded-lg border border-emerald-200 bg-cream p-5">
            <h2 className="text-body-lg font-semibold text-emerald-900">{c.noteTitle}</h2>
            <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{c.noteBody}</p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <SectionHeading
            eyebrow={c.channelsEyebrow}
            title={c.channelsTitle}
            intro={c.channelsIntro}
          />
          <div className="mt-8">
            <ContactChannels />
          </div>
          <div className="mt-8">
            <ContactPendingNotice />
          </div>
        </div>
      </section>

      <section className="section-tight bg-shell">
        <div className="shell-container">
          <div className="flex flex-wrap items-center gap-4">
            <p className="max-w-prose text-body text-charcoal-soft">{c.reportBody}</p>
            <ButtonLink to="/kontak" variant="primary">
              {c.openContact}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
