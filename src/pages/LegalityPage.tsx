import { ContactChannels, ContactPendingNotice } from "../components/ContactChannels";
import { LegalityPanel } from "../components/LegalityPanel";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";

export function LegalityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legalitas dan keamanan"
        title="Periksa identitas penyelenggara sebelum membayar"
        intro="Halaman ini memuat data resmi yang bisa Anda cocokkan dengan dokumen penawaran, plus kanal komunikasi yang sah. Kalau ada yang tidak cocok, hentikan proses dan konfirmasi lebih dulu."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <LegalityPanel />

          <div className="mt-10 rounded-lg border border-emerald-200 bg-cream p-5">
            <h2 className="text-body-lg font-semibold text-emerald-900">Catatan penting</h2>
            <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">
              Selama kolom nomor izin dan nama badan usaha masih kosong, halaman ini belum bisa
              dipakai sebagai bukti legalitas. Isi kolom tersebut dari dokumen resmi, bukan dari
              materi promosi, supaya jamaah bisa memverifikasi sendiri.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <SectionHeading
            eyebrow="Kanal resmi"
            title="Cara menghubungi kami"
            intro="Gunakan kanal di bawah ini saja. Kami tidak pernah meminta pembayaran ke rekening yang tidak tercantum di halaman ini."
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
            <p className="max-w-prose text-body text-charcoal-soft">
              Kalau Anda menerima pesan yang mengatasnamakan Rihlah dengan nomor, email, atau
              rekening yang berbeda, laporkan ke kanal resmi supaya bisa kami tindak lanjuti.
            </p>
            <ButtonLink to="/kontak" variant="primary">
              Buka halaman kontak
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
