import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isPlaceholder, site, whatsappHref } from "../config/site";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import type { Lang, Localized } from "../i18n/types";
import { Button, ButtonAnchor } from "./ui/Button";
import { Input, Select, Textarea } from "./ui/Field";
import { WhatsAppGlyph } from "./WhatsAppButton";

export interface FormValues {
  nama: string;
  whatsapp: string;
  jumlahJamaah: string;
  jenis: string;
  bulan: string;
  program: string;
  kebutuhan: string[];
  pesan: string;
}

export type Errors = Partial<Record<keyof FormValues, string>>;

type Status = "idle" | "copying" | "copied" | "handoff" | "awaitingChannel" | "copyError";

const idCopy = {
  bulanOptions: [
    { value: "secepatnya", label: "Secepatnya" },
    { value: "1-3", label: "Dalam 1 sampai 3 bulan" },
    { value: "3-6", label: "Dalam 3 sampai 6 bulan" },
    { value: "6-12", label: "Dalam 6 sampai 12 bulan" },
    { value: "belum", label: "Belum ditentukan" },
  ],
  programOptions: ["Belum tahu", "Reguler", "Plus", "Private"],
  kebutuhanOptions: [
    "Jamaah lansia",
    "Membawa anak",
    "Kebutuhan mobilitas",
    "Rombongan atau kelompok",
    "Kamar terpisah",
  ],
  errors: {
    nama: "Isi nama lengkap sesuai dokumen, minimal 2 karakter.",
    whatsapp: "Isi nomor WhatsApp yang aktif, 9 sampai 15 angka.",
    jumlahJamaah: "Isi jumlah jamaah dengan angka antara 1 dan 200.",
    jenis: "Pilih jenis perjalanan.",
    bulan: "Pilih perkiraan bulan keberangkatan.",
    program: "Pilih preferensi program.",
  },
  summaryHeading: "Ringkasan konsultasi",
  summary: {
    name: "Nama",
    whatsapp: "Nomor WhatsApp",
    jumlah: "Jumlah jamaah",
    jenis: "Jenis perjalanan",
    bulan: "Perkiraan keberangkatan",
    program: "Preferensi program",
    kebutuhan: "Kebutuhan khusus",
    pesan: "Catatan",
    none: "Tidak ada",
  },
  prefilled: (paket: string) => `Saya ingin menanyakan program ${paket}.`,
  field: {
    nama: "Nama lengkap",
    whatsapp: "Nomor WhatsApp",
    jumlah: "Jumlah jamaah",
    jumlahHint: "Termasuk Anda sendiri.",
    jenis: "Jenis perjalanan",
    jenisPlaceholder: "Pilih jenis perjalanan",
    bulan: "Perkiraan bulan keberangkatan",
    bulanPlaceholder: "Pilih perkiraan waktu",
    program: "Preferensi program",
    programPlaceholder: "Pilih preferensi",
    kebutuhan: "Kebutuhan khusus",
    optional: "(opsional)",
    pesan: "Catatan tambahan",
    pesanHint: "Misalnya kota asal, kebutuhan kamar, atau pertanyaan tentang fasilitas.",
  },
  channelTitle: "Nomor WhatsApp resmi belum diatur.",
  channelBody:
    "Tombol kirim di bawah ini membuka WhatsApp dengan pesan yang sudah terisi. Selama nomor resmi belum diisi pada konfigurasi situs, tombolnya belum bisa dipakai dan Anda bisa menyusun ringkasan yang sama untuk dikirim lewat kanal resmi di halaman kontak.",
  send: "Kirim ke WhatsApp",
  noDocsNote:
    "Kami tidak meminta dokumen atau pembayaran apa pun sebelum ada penawaran tertulis.",
  compose: "Susun ringkasan untuk disalin",
  errorNotice:
    "Ada isian yang perlu diperbaiki. Periksa tanda di bawah kolom yang bersangkutan.",
  handoffTitle: "WhatsApp dibuka di tab baru.",
  handoffBody:
    "Pesan sudah terisi ringkasan konsultasi Anda. Tekan kirim di WhatsApp untuk melanjutkan, dan tim akan membalas pada jam layanan.",
  boxTitle: "Ringkasan konsultasi Anda",
  boxBody:
    "Ringkasan ini belum terkirim ke mana pun. Salin lalu simpan, dan kirimkan ke kanal resmi begitu nomor atau email resmi tersedia.",
  boxLabel: "Ringkasan yang bisa disalin",
  copying: "Menyalin ringkasan...",
  copy: "Salin ringkasan",
  copied: "Ringkasan tersalin.",
  copyError:
    "Penyalinan otomatis diblokir oleh peramban. Pilih teks pada kotak di atas, lalu salin secara manual.",
  successPrefix: "Berhasil. ",
  failurePrefix: "Gagal. ",
};

const enCopy: typeof idCopy = {
  bulanOptions: [
    { value: "secepatnya", label: "As soon as possible" },
    { value: "1-3", label: "In 1 to 3 months" },
    { value: "3-6", label: "In 3 to 6 months" },
    { value: "6-12", label: "In 6 to 12 months" },
    { value: "belum", label: "Not decided yet" },
  ],
  programOptions: ["Not sure yet", "Regular", "Plus", "Private"],
  kebutuhanOptions: [
    "Elderly pilgrims",
    "Travelling with children",
    "Mobility needs",
    "A group or community",
    "Separate rooms",
  ],
  errors: {
    nama: "Enter the full name as it appears on your documents, at least 2 characters.",
    whatsapp: "Enter an active WhatsApp number, 9 to 15 digits.",
    jumlahJamaah: "Enter the number of pilgrims as a figure between 1 and 200.",
    jenis: "Choose the trip type.",
    bulan: "Choose the approximate departure month.",
    program: "Choose a programme preference.",
  },
  summaryHeading: "Consultation summary",
  summary: {
    name: "Name",
    whatsapp: "WhatsApp number",
    jumlah: "Number of pilgrims",
    jenis: "Trip type",
    bulan: "Approximate departure",
    program: "Programme preference",
    kebutuhan: "Special needs",
    pesan: "Notes",
    none: "None",
  },
  prefilled: (paket: string) => `I would like to ask about the ${paket} programme.`,
  field: {
    nama: "Full name",
    whatsapp: "WhatsApp number",
    jumlah: "Number of pilgrims",
    jumlahHint: "Including yourself.",
    jenis: "Trip type",
    jenisPlaceholder: "Choose the trip type",
    bulan: "Approximate departure month",
    bulanPlaceholder: "Choose an approximate time",
    program: "Programme preference",
    programPlaceholder: "Choose a preference",
    kebutuhan: "Special needs",
    optional: "(optional)",
    pesan: "Additional notes",
    pesanHint: "For example your home city, room needs, or a question about the facilities.",
  },
  channelTitle: "The official WhatsApp number is not set yet.",
  channelBody:
    "The send button below opens WhatsApp with the message already written. While the official number is missing from the site configuration the button cannot be used, and you can put together the same summary to send through the official channels on the contact page.",
  send: "Send to WhatsApp",
  noDocsNote: "We never ask for documents or payment before a written offer exists.",
  compose: "Compose a summary to copy",
  errorNotice: "Some answers need fixing. Check the note under the field concerned.",
  handoffTitle: "WhatsApp opened in a new tab.",
  handoffBody:
    "The message already contains your consultation summary. Press send in WhatsApp to continue, and the team will reply during service hours.",
  boxTitle: "Your consultation summary",
  boxBody:
    "This summary has not been sent anywhere. Copy and keep it, then send it through the official channels once an official number or email address is available.",
  boxLabel: "Summary you can copy",
  copying: "Copying the summary...",
  copy: "Copy the summary",
  copied: "Summary copied.",
  copyError:
    "Automatic copying was blocked by the browser. Select the text in the box above and copy it by hand.",
  successPrefix: "Done. ",
  failurePrefix: "Failed. ",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const fieldOrder: Array<keyof FormValues> = [
  "nama",
  "whatsapp",
  "jumlahJamaah",
  "jenis",
  "bulan",
  "program",
];

const jenisLabels: Localized<Record<string, string>> = {
  id: { umrah: "Umrah", haji: "Haji" },
  en: { umrah: "Umrah", haji: "Hajj" },
};

export function validateConsultation(values: FormValues, lang: Lang): Errors {
  const errors: Errors = {};
  const messages = copy[lang].errors;

  if (values.nama.trim().length < 2) {
    errors.nama = messages.nama;
  }

  const digits = values.whatsapp.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    errors.whatsapp = messages.whatsapp;
  }

  const jumlah = Number(values.jumlahJamaah);
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 200) {
    errors.jumlahJamaah = messages.jumlahJamaah;
  }

  if (!values.jenis) errors.jenis = messages.jenis;
  if (!values.bulan) errors.bulan = messages.bulan;
  if (!values.program) errors.program = messages.program;

  return errors;
}

/**
 * Written for a WhatsApp chat rather than as a data dump. WhatsApp renders a
 * pair of asterisks as bold, so the heading stands out and every answer keeps
 * its own line, which is what the team reads on a phone.
 */
export function buildConsultationSummary(values: FormValues, lang: Lang): string {
  const c = copy[lang];
  const bulanLabel =
    c.bulanOptions.find((option) => option.value === values.bulan)?.label ?? values.bulan;

  return [
    site.whatsappMessage[lang],
    "",
    `*${c.summaryHeading}*`,
    `${c.summary.name}: ${values.nama.trim()}`,
    `${c.summary.whatsapp}: ${values.whatsapp.trim()}`,
    `${c.summary.jumlah}: ${values.jumlahJamaah}`,
    `${c.summary.jenis}: ${jenisLabels[lang][values.jenis] ?? values.jenis}`,
    `${c.summary.bulan}: ${bulanLabel}`,
    `${c.summary.program}: ${values.program}`,
    `${c.summary.kebutuhan}: ${
      values.kebutuhan.length > 0 ? values.kebutuhan.join(", ") : c.summary.none
    }`,
    `${c.summary.pesan}: ${values.pesan.trim() || c.summary.none}`,
  ].join("\n");
}

/**
 * Two handoff paths, both real. When the official number exists the form opens
 * WhatsApp with the summary written out. While that number is still a
 * placeholder the form hands over the same summary for the user to copy, and
 * says plainly that it has not been sent anywhere.
 */
export function ConsultationForm() {
  const c = useCopy(copy);
  const lang = useLang();
  const [params] = useSearchParams();
  const prefilledPackage = params.get("paket");
  const [values, setValues] = useState<FormValues>({
    nama: "",
    whatsapp: "",
    jumlahJamaah: "",
    jenis: prefilledPackage ? "umrah" : "",
    bulan: "",
    program: "",
    kebutuhan: [],
    pesan: prefilledPackage
      ? copy[lang].prefilled(prefilledPackage)
      : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement | null>(null);

  const summary = useMemo(() => buildConsultationSummary(values, lang), [values, lang]);
  const directHref = whatsappHref(lang, summary);
  const channelMissing = isPlaceholder(site.whatsappNumber);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleKebutuhan(option: string) {
    setValues((current) => ({
      ...current,
      kebutuhan: current.kebutuhan.includes(option)
        ? current.kebutuhan.filter((item) => item !== option)
        : [...current.kebutuhan, option],
    }));
  }

  /** Blocks every handoff until the answers are complete, and says which one is missing. */
  function answersAreComplete(): boolean {
    const nextErrors = validateConsultation(values, lang);
    setErrors(nextErrors);

    const firstError = fieldOrder.find((field) => nextErrors[field]);
    if (!firstError) return true;

    setStatus("idle");
    formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
    return false;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answersAreComplete()) return;

    // Reached by pressing Enter inside a field, since the visible send control
    // is the link below rather than a submit button.
    if (directHref) {
      window.open(directHref, "_blank", "noopener,noreferrer");
      setStatus("handoff");
      return;
    }

    setStatus("awaitingChannel");
  }

  function handleHandoff(event: React.MouseEvent<HTMLAnchorElement>) {
    if (answersAreComplete()) {
      setStatus("handoff");
      return;
    }
    event.preventDefault();
  }

  async function handleCopy() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("copied");
    } catch {
      setStatus("copyError");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {channelMissing ? (
        <div id="konsul-kanal" className="rounded-lg border border-emerald-200 bg-cream p-5">
          <p className="text-body font-semibold text-emerald-900">{c.channelTitle}</p>
          <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{c.channelBody}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="konsul-nama"
          name="nama"
          label={c.field.nama}
          autoComplete="name"
          value={values.nama}
          error={errors.nama}
          onChange={(event) => setField("nama", event.target.value)}
        />
        <Input
          id="konsul-wa"
          name="whatsapp"
          label={c.field.whatsapp}
          inputMode="tel"
          autoComplete="tel"
          placeholder="0812xxxxxxx"
          value={values.whatsapp}
          error={errors.whatsapp}
          onChange={(event) => setField("whatsapp", event.target.value)}
        />
        <Input
          id="konsul-jumlah"
          name="jumlahJamaah"
          label={c.field.jumlah}
          inputMode="numeric"
          placeholder="2"
          value={values.jumlahJamaah}
          error={errors.jumlahJamaah}
          hint={c.field.jumlahHint}
          onChange={(event) => setField("jumlahJamaah", event.target.value)}
        />
        <Select
          id="konsul-jenis"
          name="jenis"
          label={c.field.jenis}
          value={values.jenis}
          error={errors.jenis}
          onChange={(event) => setField("jenis", event.target.value)}
        >
          <option value="">{c.field.jenisPlaceholder}</option>
          <option value="umrah">Umrah</option>
          <option value="haji">Hajj</option>
        </Select>
        <Select
          id="konsul-bulan"
          name="bulan"
          label={c.field.bulan}
          value={values.bulan}
          error={errors.bulan}
          onChange={(event) => setField("bulan", event.target.value)}
        >
          <option value="">{c.field.bulanPlaceholder}</option>
          {c.bulanOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          id="konsul-program"
          name="program"
          label={c.field.program}
          value={values.program}
          error={errors.program}
          onChange={(event) => setField("program", event.target.value)}
        >
          <option value="">{c.field.programPlaceholder}</option>
          {c.programOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-semibold text-charcoal">
          {c.field.kebutuhan}
          <span className="ml-1 font-normal text-charcoal-muted">{c.field.optional}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {c.kebutuhanOptions.map((option) => {
            const checked = values.kebutuhan.includes(option);
            return (
              <label key={option} className="relative">
                <input
                  type="checkbox"
                  name="kebutuhan"
                  value={option}
                  checked={checked}
                  onChange={() => toggleKebutuhan(option)}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 cursor-pointer items-center rounded-md border border-emerald-400 px-4 text-body-sm font-semibold text-emerald-800 peer-checked:bg-emerald-800 peer-checked:text-shell peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-800">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <Textarea
        id="konsul-pesan"
        name="pesan"
        label={c.field.pesan}
        optional
        value={values.pesan}
        onChange={(event) => setField("pesan", event.target.value)}
        hint={c.field.pesanHint}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* A real link instead of a scripted button, so popup blockers, middle
              click and the mobile WhatsApp app all behave the way links do. */}
          {directHref ? (
            <ButtonAnchor
              href={directHref}
              size="lg"
              target="_blank"
              rel="noreferrer"
              onClick={handleHandoff}
            >
              <WhatsAppGlyph />
              {c.send}
            </ButtonAnchor>
          ) : (
            <Button type="button" size="lg" disabled aria-describedby="konsul-kanal">
              <WhatsAppGlyph />
              {c.send}
            </Button>
          )}
          <p className="text-body-sm text-charcoal-muted">{c.noDocsNote}</p>
        </div>

        {/* Kept while the official number is missing, because handing the same
            summary over for copying is still better than no path at all. */}
        {channelMissing ? (
          <Button type="submit" variant="outline" size="lg" className="self-start">
            {c.compose}
          </Button>
        ) : null}
      </div>

      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="text-body-sm font-semibold text-status-full">
          {c.errorNotice}
        </p>
      ) : null}

      {status === "handoff" ? (
        <StatusBlock
          tone="success"
          prefix={c.successPrefix}
          title={c.handoffTitle}
          body={c.handoffBody}
        />
      ) : null}

      {status === "awaitingChannel" ||
      status === "copying" ||
      status === "copied" ||
      status === "copyError" ? (
        <div className="flex flex-col gap-4 rounded-lg border border-emerald-200 bg-cream p-5">
          <div>
            <p className="text-body font-semibold text-emerald-900">{c.boxTitle}</p>
            <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{c.boxBody}</p>
          </div>
          {/* Monospace only here, and only because this block is a data list of
              label and value pairs the reader has to copy accurately. */}
          <Textarea
            id="konsul-ringkasan"
            label={c.boxLabel}
            readOnly
            value={summary}
            rows={12}
            className="font-mono text-body-sm"
          />
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              disabled={status === "copying"}
            >
              {status === "copying" ? c.copying : c.copy}
            </Button>
            {status === "copied" ? (
              <p className="text-body-sm font-semibold text-status-available">{c.copied}</p>
            ) : null}
          </div>
          {status === "copyError" ? (
            <p role="alert" className="text-body-sm font-semibold text-status-full">
              {c.copyError}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function StatusBlock({
  tone,
  prefix,
  title,
  body,
}: {
  tone: "success" | "error";
  prefix: string;
  title: string;
  body: string;
}) {
  const isSuccess = tone === "success";
  return (
    <div
      role="status"
      className={`rounded-lg border p-5 ${
        isSuccess ? "border-emerald-300 bg-emerald-50" : "border-status-full bg-shell"
      }`}
    >
      <p
        className={`text-body font-semibold ${
          isSuccess ? "text-status-available" : "text-status-full"
        }`}
      >
        {prefix}
        {title}
      </p>
      <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{body}</p>
    </div>
  );
}
