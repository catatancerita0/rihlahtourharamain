import { contactHref, isPlaceholder, site, whatsappHref } from "../config/site";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { ButtonAnchor } from "./ui/Button";

interface Channel {
  id: string;
  label: string;
  value: string;
  href: string | null;
  hint: string;
}

const idCopy = {
  waHint: "Kanal tercepat untuk konsultasi dan konfirmasi jadwal.",
  emailHint: "Gunakan untuk mengirim dokumen dan pertanyaan tertulis.",
  phoneHint: "Layanan telepon mengikuti jam layanan di bawah.",
  addressHint: "Kunjungan kantor hanya dengan janji temu.",
  unset: "Belum diisi oleh penyelenggara",
  open: (label: string) => `Buka ${label}`,
  noLink: "Belum diatur, jadi tautannya belum dapat dibuka.",
  fillAddress: "Isi alamat lengkap sebelum halaman ini dipublikasikan.",
  noticeAll:
    "Semua kanal di atas sudah aktif. Gunakan kanal ini saja, dan abaikan pesan yang mengarahkan Anda ke nomor atau rekening lain.",
  noticeSomeTitle: "Sebagian kanal resmi belum diisi pada pratinjau ini.",
  noticeSomeBody: (list: string) =>
    `Yang belum tersedia: ${list}. Halaman ini akan menampilkan tautan yang dapat dibuka begitu datanya diisi, dan sampai saat itu tidak ada kontrol yang berpura-pura berfungsi.`,
  labelWa: "nomor WhatsApp",
  labelEmail: "email resmi",
  labelPhone: "nomor telepon",
};

const enCopy: typeof idCopy = {
  waHint: "The quickest channel for a consultation and for confirming a schedule.",
  emailHint: "Use it to send documents and written questions.",
  phoneHint: "Phone service follows the service hours below.",
  addressHint: "Office visits are by appointment only.",
  unset: "Not provided by the organiser yet",
  open: (label: string) => `Open ${label}`,
  noLink: "Not set yet, so the link cannot be opened.",
  fillAddress: "Add the full address before this page is published.",
  noticeAll:
    "Every channel above is active. Use these channels only, and ignore any message pointing you to a different number or bank account.",
  noticeSomeTitle: "Some official channels have not been filled in on this preview.",
  noticeSomeBody: (list: string) =>
    `Still missing: ${list}. This page will show links that can be opened once the data is filled in, and until then no control pretends to work.`,
  labelWa: "WhatsApp number",
  labelEmail: "official email",
  labelPhone: "phone number",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function ContactChannels() {
  const c = useCopy(copy);
  const wa = whatsappHref(useLang());
  const channels: Channel[] = [
    {
      id: "wa",
      label: "WhatsApp",
      value: site.whatsappDisplay,
      href: wa,
      hint: c.waHint,
    },
    {
      id: "email",
      label: "Email",
      value: site.email,
      href: contactHref(site.email, "mailto"),
      hint: c.emailHint,
    },
    {
      id: "phone",
      label: "Telepon",
      value: site.phone,
      href: contactHref(site.phone, "tel"),
      hint: c.phoneHint,
    },
    {
      id: "address",
      label: "Alamat",
      value: site.addressLines.join(", "),
      href: null,
      hint: c.addressHint,
    },
  ];

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {channels.map((channel) => {
        const pending = !channel.href && channel.id !== "address";
        return (
          <li
            key={channel.id}
            className="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-shell p-5"
          >
            <p className="text-label font-semibold uppercase text-charcoal-muted">{channel.label}</p>
            {isPlaceholder(channel.value) ? (
              <p className="text-body font-semibold text-charcoal-muted">{c.unset}</p>
            ) : (
              <p className="text-body font-semibold text-emerald-900">{channel.value}</p>
            )}
            <p className="text-body-sm text-charcoal-soft">{channel.hint}</p>
            {channel.href ? (
              <ButtonAnchor
                href={channel.href}
                variant="outline"
                target={channel.id === "wa" ? "_blank" : undefined}
                rel={channel.id === "wa" ? "noreferrer" : undefined}
                className="mt-2 self-start"
              >
                {c.open(channel.label)}
              </ButtonAnchor>
            ) : pending ? (
              <p className="mt-2 text-body-sm font-semibold text-charcoal-muted">{c.noLink}</p>
            ) : (
              <p className="mt-2 text-body-sm text-charcoal-muted">{c.fillAddress}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ContactPendingNotice() {
  const c = useCopy(copy);
  const missing = [
    isPlaceholder(site.whatsappNumber) ? c.labelWa : null,
    isPlaceholder(site.email) ? c.labelEmail : null,
    isPlaceholder(site.phone) ? c.labelPhone : null,
  ].filter((value): value is string => value !== null);

  if (missing.length === 0) {
    return <p className="max-w-prose text-body text-charcoal-soft">{c.noticeAll}</p>;
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-cream p-5">
      <p className="text-body font-semibold text-emerald-900">{c.noticeSomeTitle}</p>
      <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">
        {c.noticeSomeBody(missing.join(", "))}
      </p>
    </div>
  );
}
