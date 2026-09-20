import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isPlaceholder, site, whatsappHref } from "../config/site";
import { Button } from "./ui/Button";
import { Input, Select, Textarea } from "./ui/Field";

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

const bulanOptions = [
  { value: "secepatnya", label: "Secepatnya" },
  { value: "1-3", label: "Dalam 1 sampai 3 bulan" },
  { value: "3-6", label: "Dalam 3 sampai 6 bulan" },
  { value: "6-12", label: "Dalam 6 sampai 12 bulan" },
  { value: "belum", label: "Belum ditentukan" },
];

const programOptions = ["Belum tahu", "Reguler", "Plus", "Private"];

const kebutuhanOptions = [
  "Jamaah lansia",
  "Membawa anak",
  "Kebutuhan mobilitas",
  "Rombongan atau kelompok",
  "Kamar terpisah",
];

const fieldOrder: Array<keyof FormValues> = [
  "nama",
  "whatsapp",
  "jumlahJamaah",
  "jenis",
  "bulan",
  "program",
];

export function validateConsultation(values: FormValues): Errors {
  const errors: Errors = {};

  if (values.nama.trim().length < 2) {
    errors.nama = "Isi nama lengkap sesuai dokumen, minimal 2 karakter.";
  }

  const digits = values.whatsapp.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    errors.whatsapp = "Isi nomor WhatsApp yang aktif, 9 sampai 15 angka.";
  }

  const jumlah = Number(values.jumlahJamaah);
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 200) {
    errors.jumlahJamaah = "Isi jumlah jamaah dengan angka antara 1 dan 200.";
  }

  if (!values.jenis) errors.jenis = "Pilih jenis perjalanan.";
  if (!values.bulan) errors.bulan = "Pilih perkiraan bulan keberangkatan.";
  if (!values.program) errors.program = "Pilih preferensi program.";

  return errors;
}

export function buildConsultationSummary(values: FormValues): string {
  const bulanLabel =
    bulanOptions.find((option) => option.value === values.bulan)?.label ?? values.bulan;

  return [
    site.whatsappMessage,
    "",
    `Nama: ${values.nama.trim()}`,
    `Nomor WhatsApp: ${values.whatsapp.trim()}`,
    `Jumlah jamaah: ${values.jumlahJamaah}`,
    `Jenis perjalanan: ${values.jenis}`,
    `Perkiraan keberangkatan: ${bulanLabel}`,
    `Preferensi program: ${values.program}`,
    `Kebutuhan khusus: ${values.kebutuhan.length > 0 ? values.kebutuhan.join(", ") : "Tidak ada"}`,
    `Catatan: ${values.pesan.trim() || "Tidak ada"}`,
  ].join("\n");
}

/**
 * Two handoff paths, both real. When the official number exists the form opens
 * WhatsApp with the summary written out. While that number is still a
 * placeholder the form hands over the same summary for the user to copy, and
 * says plainly that it has not been sent anywhere.
 */
export function ConsultationForm() {
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
    pesan: prefilledPackage ? `Saya ingin menanyakan program ${prefilledPackage}.` : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement | null>(null);

  const summary = useMemo(() => buildConsultationSummary(values), [values]);
  const directHref = whatsappHref(summary);
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateConsultation(values);
    setErrors(nextErrors);

    const firstError = fieldOrder.find((field) => nextErrors[field]);
    if (firstError) {
      setStatus("idle");
      const node = formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`);
      node?.focus();
      return;
    }

    if (directHref) {
      window.open(directHref, "_blank", "noopener,noreferrer");
      setStatus("handoff");
      return;
    }

    setStatus("awaitingChannel");
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
        <div className="rounded-lg border border-emerald-200 bg-cream p-5">
          <p className="text-body font-semibold text-emerald-900">
            Nomor WhatsApp resmi belum diatur.
          </p>
          <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">
            Formulir ini tetap memeriksa isian Anda, lalu menyusun ringkasan yang bisa Anda salin.
            Begitu nomor resmi diisi pada konfigurasi situs, tombol kirim akan langsung membuka
            WhatsApp dengan ringkasan yang sama.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="konsul-nama"
          name="nama"
          label="Nama lengkap"
          autoComplete="name"
          value={values.nama}
          error={errors.nama}
          onChange={(event) => setField("nama", event.target.value)}
        />
        <Input
          id="konsul-wa"
          name="whatsapp"
          label="Nomor WhatsApp"
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
          label="Jumlah jamaah"
          inputMode="numeric"
          placeholder="2"
          value={values.jumlahJamaah}
          error={errors.jumlahJamaah}
          hint="Termasuk Anda sendiri."
          onChange={(event) => setField("jumlahJamaah", event.target.value)}
        />
        <Select
          id="konsul-jenis"
          name="jenis"
          label="Jenis perjalanan"
          value={values.jenis}
          error={errors.jenis}
          onChange={(event) => setField("jenis", event.target.value)}
        >
          <option value="">Pilih jenis perjalanan</option>
          <option value="umrah">Umrah</option>
          <option value="haji">Haji</option>
        </Select>
        <Select
          id="konsul-bulan"
          name="bulan"
          label="Perkiraan bulan keberangkatan"
          value={values.bulan}
          error={errors.bulan}
          onChange={(event) => setField("bulan", event.target.value)}
        >
          <option value="">Pilih perkiraan waktu</option>
          {bulanOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          id="konsul-program"
          name="program"
          label="Preferensi program"
          value={values.program}
          error={errors.program}
          onChange={(event) => setField("program", event.target.value)}
        >
          <option value="">Pilih preferensi</option>
          {programOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-semibold text-charcoal">
          Kebutuhan khusus
          <span className="ml-1 font-normal text-charcoal-muted">(opsional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {kebutuhanOptions.map((option) => {
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
        label="Catatan tambahan"
        optional
        value={values.pesan}
        onChange={(event) => setField("pesan", event.target.value)}
        hint="Misalnya kota asal, kebutuhan kamar, atau pertanyaan tentang fasilitas."
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "copying"}>
          {directHref ? "Kirim lewat WhatsApp" : "Susun ringkasan konsultasi"}
        </Button>
        <p className="text-body-sm text-charcoal-muted">
          Kami tidak meminta dokumen atau pembayaran apa pun sebelum ada penawaran tertulis.
        </p>
      </div>

      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="text-body-sm font-semibold text-status-full">
          Ada isian yang perlu diperbaiki. Periksa tanda di bawah kolom yang bersangkutan.
        </p>
      ) : null}

      {status === "handoff" ? (
        <StatusBlock
          tone="success"
          title="WhatsApp dibuka di tab baru."
          body="Ringkasan konsultasi sudah tertulis di dalam pesan. Kirim pesan itu untuk melanjutkan, dan tim akan membalas pada jam layanan."
        />
      ) : null}

      {status === "awaitingChannel" || status === "copying" || status === "copied" || status === "copyError" ? (
        <div className="flex flex-col gap-4 rounded-lg border border-emerald-200 bg-cream p-5">
          <div>
            <p className="text-body font-semibold text-emerald-900">Ringkasan konsultasi Anda</p>
            <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">
              Ringkasan ini belum terkirim ke mana pun. Salin lalu simpan, dan kirimkan ke kanal
              resmi begitu nomor atau email resmi tersedia.
            </p>
          </div>
          {/* Monospace only here, and only because this block is a data list of
              label and value pairs the reader has to copy accurately. */}
          <Textarea
            id="konsul-ringkasan"
            label="Ringkasan yang bisa disalin"
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
              {status === "copying" ? "Menyalin ringkasan..." : "Salin ringkasan"}
            </Button>
            {status === "copied" ? (
              <p className="text-body-sm font-semibold text-status-available">Ringkasan tersalin.</p>
            ) : null}
          </div>
          {status === "copyError" ? (
            <p role="alert" className="text-body-sm font-semibold text-status-full">
              Penyalinan otomatis diblokir oleh peramban. Pilih teks pada kotak di atas, lalu salin
              secara manual.
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function StatusBlock({
  tone,
  title,
  body,
}: {
  tone: "success" | "error";
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
        {isSuccess ? "Berhasil. " : "Gagal. "}
        {title}
      </p>
      <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{body}</p>
    </div>
  );
}
