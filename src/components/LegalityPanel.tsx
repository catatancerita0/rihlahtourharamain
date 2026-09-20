import { site } from "../config/site";
import { GeometricMotif } from "./ui/GeometricMotif";
import { DefinitionList } from "./ui/DefinitionList";

export function LegalityPanel() {
  const entity = site.legalEntity;

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-shell">
      {/* The second motif placement: a verification panel is a formal document,
          and the medallion marks it as one. */}
      <div className="relative border-b border-emerald-100 bg-emerald-50/70 px-5 py-6 sm:px-7">
        <GeometricMotif
          className="pointer-events-none absolute right-4 top-3 h-16 w-32 text-emerald-200"
          scale={26}
        />
        <p className="eyebrow relative">Pemeriksaan identitas</p>
        <h2 className="relative mt-2 text-display-sm text-emerald-900">
          Data resmi penyelenggara
        </h2>
        <p className="relative mt-2 max-w-prose text-body-sm text-charcoal-soft">
          Bandingkan data di bawah ini dengan dokumen penawaran yang Anda terima. Kalau ada yang
          berbeda, hentikan proses dan konfirmasi lewat kanal resmi.
        </p>
      </div>

      <div className="px-5 py-2 sm:px-7">
        <DefinitionList
          rows={[
            { label: "Nama badan usaha", value: entity.businessName, pending: "Belum diisi" },
            { label: "NIB", value: entity.nib, pending: "Belum diisi" },
            { label: "Nomor izin PPIU", value: entity.ppiu, pending: "Belum diisi" },
            { label: "Nomor izin PIHK", value: entity.pihk, pending: "Belum diisi" },
            {
              label: "Alamat operasional",
              value: site.addressLines.join(", "),
              pending: "Belum diisi",
            },
            { label: "Nomor telepon", value: site.phone, pending: "Belum diisi" },
            { label: "Email resmi", value: site.email, pending: "Belum diisi" },
            { label: "Rekening resmi", value: entity.bankAccount, pending: "Belum diisi" },
            { label: "Jam layanan", value: site.serviceHours, pending: "Belum diisi" },
          ]}
        />
      </div>

      <div className="border-t border-emerald-100 bg-emerald-900 px-5 py-6 text-shell on-dark sm:px-7">
        <h3 className="text-display-sm">Sebelum mengirim dokumen atau dana</h3>
        <ol className="mt-4 flex flex-col gap-3">
          {[
            "Pastikan alamat situs yang Anda buka benar, yaitu domain resmi yang tercantum di halaman ini.",
            "Cocokkan nomor WhatsApp dan email dengan yang tertulis di halaman kontak, bukan dari pesan yang diteruskan.",
            "Minta rincian tertulis berisi fasilitas, biaya, dan hal yang tidak termasuk sebelum membayar.",
            "Pastikan pembayaran diarahkan ke rekening atas nama badan usaha, bukan rekening pribadi.",
            "Simpan bukti pembayaran dan tangkapan layar penawaran selama proses berjalan.",
          ].map((step, index) => (
            <li key={step} className="flex gap-3 text-body-sm text-emerald-100">
              <span className="tabular font-semibold text-gold">{String(index + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-body-sm text-emerald-300">
          Nomor izin dan data badan usaha di atas harus diisi dari dokumen resmi. Selama masih
          kosong, jangan gunakan halaman ini sebagai bukti legalitas.
        </p>
      </div>
    </div>
  );
}
