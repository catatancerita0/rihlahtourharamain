import { site } from "../config/site";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import { pick, type Localized } from "../i18n/types";
import { assetUrl } from "../lib/media";
import { GeometricMotif } from "./ui/GeometricMotif";
import { DefinitionList } from "./ui/DefinitionList";

const docCopyId = {
  eyebrow: "Pemeriksaan identitas",
  panelTitle: "Data resmi penyelenggara",
  panelIntro:
    "Bandingkan data di bawah ini dengan dokumen penawaran yang Anda terima. Kalau ada yang berbeda, hentikan proses dan konfirmasi lewat kanal resmi.",
  heading: "Dokumen pendukung",
  intro:
    "Berkas di bawah ini berasal dari dokumen resmi penyelenggara. Cocokkan nomor izin di atas dengan nomor yang tercetak pada berkasnya.",
  openFile: "Buka berkas",
  newTab: "Terbuka di tab baru dalam format PDF atau gambar.",
  none: "Belum ada salinan dokumen resmi yang diunggah ke situs ini. Minta salinannya lewat kanal kontak resmi sebelum melakukan pembayaran.",
  unset: "Belum diisi",
  businessName: "Nama badan usaha",
  nib: "NIB",
  ppiu: "Nomor izin PPIU",
  pihk: "Nomor izin PIHK",
  address: "Alamat operasional",
  phone: "Nomor telepon",
  email: "Email resmi",
  bank: "Rekening resmi",
  hours: "Jam layanan",
  preSendTitle: "Sebelum mengirim dokumen atau dana",
  preSendSteps: [
    "Pastikan alamat situs yang Anda buka benar, yaitu domain resmi yang tercantum di halaman ini.",
    "Cocokkan nomor WhatsApp dan email dengan yang tertulis di halaman kontak, bukan dari pesan yang diteruskan.",
    "Minta rincian tertulis berisi fasilitas, biaya, dan hal yang tidak termasuk sebelum membayar.",
    "Pastikan pembayaran diarahkan ke rekening atas nama badan usaha, bukan rekening pribadi.",
    "Simpan bukti pembayaran dan tangkapan layar penawaran selama proses berjalan.",
  ],
  preSendNote:
    "Nomor izin dan data badan usaha di atas harus diisi dari dokumen resmi. Selama masih kosong, jangan gunakan halaman ini sebagai bukti legalitas.",
};

const docCopy: Localized<typeof docCopyId> = {
  id: docCopyId,
  en: {
    eyebrow: "Identity check",
    panelTitle: "Official organiser data",
    panelIntro:
      "Compare the data below with the offer documents you received. If anything differs, stop the process and confirm through the official channels.",
    heading: "Supporting documents",
    intro:
      "These files come from the organiser's official documents. Check the licence numbers above against the numbers printed on them.",
    openFile: "Open file",
    newTab: "Opens in a new tab as a PDF or image.",
    none: "No official document scans have been uploaded to this site yet. Ask for copies through the official contact channels before making any payment.",
    unset: "Not filled in yet",
    businessName: "Registered business name",
    nib: "Business ID",
    ppiu: "PPIU licence number",
    pihk: "PIHK licence number",
    address: "Operating address",
    phone: "Phone number",
    email: "Official email",
    bank: "Official bank account",
    hours: "Service hours",
    preSendTitle: "Before sending documents or money",
    preSendSteps: [
      "Make sure the site address you opened is correct, meaning the official domain listed on this page.",
      "Check the WhatsApp number and email against the ones written on the contact page, not against a forwarded message.",
      "Ask for written details covering the facilities, the cost, and what is not included before paying.",
      "Make sure payment goes to an account in the business name, not a personal account.",
      "Keep the payment receipt and a screenshot of the offer while the process is running.",
    ],
    preSendNote:
      "The licence numbers and business data above have to be filled in from official documents. While they are still empty, do not use this page as proof of licensing.",
  },
};

export function LegalityPanel() {
  const entity = site.legalEntity;
  const copy = useCopy(docCopy);
  const lang = useLang();

  // A listed document with no file stays out of the page rather than becoming
  // a link that leads nowhere.
  const documents = entity.documents.flatMap((doc) => {
    const href = assetUrl(doc.file);
    return href ? [{ id: doc.id, label: doc.label, href }] : [];
  });

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-shell">
      {/* The second motif placement: a verification panel is a formal document,
          and the medallion marks it as one. */}
      <div className="relative border-b border-emerald-100 bg-emerald-50/70 px-5 py-6 sm:px-7">
        <GeometricMotif
          className="pointer-events-none absolute right-4 top-3 h-16 w-32 text-emerald-200"
          scale={26}
        />
        <p className="eyebrow relative">{copy.eyebrow}</p>
        <h2 className="relative mt-2 text-display-sm text-emerald-900">{copy.panelTitle}</h2>
        <p className="relative mt-2 max-w-prose text-body-sm text-charcoal-soft">
          {copy.panelIntro}
        </p>
      </div>

      <div className="px-5 py-2 sm:px-7">
        <DefinitionList
          rows={[
            { label: copy.businessName, value: entity.businessName, pending: copy.unset },
            { label: copy.nib, value: entity.nib, pending: copy.unset },
            { label: copy.ppiu, value: entity.ppiu, pending: copy.unset },
            { label: copy.pihk, value: entity.pihk, pending: copy.unset },
            { label: copy.address, value: site.addressLines.join(", "), pending: copy.unset },
            { label: copy.phone, value: site.phone, pending: copy.unset },
            { label: copy.email, value: site.email, pending: copy.unset },
            { label: copy.bank, value: entity.bankAccount, pending: copy.unset },
            { label: copy.hours, value: site.serviceHours, pending: copy.unset },
          ]}
        />
      </div>

      {/* Licence scans sit next to the numbers they prove. Checking a licence
          number against the document itself is the point of this page. */}
      <div className="border-t border-emerald-100 px-5 py-6 sm:px-7">
        <h3 className="text-body-lg font-semibold text-emerald-900">{copy.heading}</h3>
        <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{copy.intro}</p>
        {documents.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
                >
                  {pick(doc.label, lang)}
                  <span className="text-charcoal-muted">({copy.openFile})</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-prose text-body-sm text-charcoal-soft">{copy.none}</p>
        )}
        {documents.length > 0 ? (
          <p className="mt-3 text-body-sm text-charcoal-muted">{copy.newTab}</p>
        ) : null}
      </div>

      <div className="border-t border-emerald-100 bg-emerald-900 px-5 py-6 text-shell on-dark sm:px-7">
        <h3 className="text-display-sm">{copy.preSendTitle}</h3>
        <ol className="mt-4 flex flex-col gap-3">
          {copy.preSendSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-body-sm text-emerald-100">
              <span className="tabular font-semibold text-gold">{String(index + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-body-sm text-emerald-300">{copy.preSendNote}</p>
      </div>
    </div>
  );
}
