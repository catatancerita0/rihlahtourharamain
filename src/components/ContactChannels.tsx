import { contactHref, isPlaceholder, site, whatsappHref } from "../config/site";
import { ButtonAnchor } from "./ui/Button";

interface Channel {
  id: string;
  label: string;
  value: string;
  href: string | null;
  hint: string;
}

export function ContactChannels() {
  const wa = whatsappHref();
  const channels: Channel[] = [
    {
      id: "wa",
      label: "WhatsApp",
      value: site.whatsappDisplay,
      href: wa,
      hint: "Kanal tercepat untuk konsultasi dan konfirmasi jadwal.",
    },
    {
      id: "email",
      label: "Email",
      value: site.email,
      href: contactHref(site.email, "mailto"),
      hint: "Gunakan untuk mengirim dokumen dan pertanyaan tertulis.",
    },
    {
      id: "phone",
      label: "Telepon",
      value: site.phone,
      href: contactHref(site.phone, "tel"),
      hint: "Layanan telepon mengikuti jam layanan di bawah.",
    },
    {
      id: "address",
      label: "Alamat",
      value: site.addressLines.join(", "),
      href: null,
      hint: "Kunjungan kantor hanya dengan janji temu.",
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
              <p className="text-body font-semibold text-charcoal-muted">
                Belum diisi oleh penyelenggara
              </p>
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
                Buka {channel.label}
              </ButtonAnchor>
            ) : pending ? (
              <p className="mt-2 text-body-sm font-semibold text-charcoal-muted">
                Belum diatur, jadi tautannya belum dapat dibuka.
              </p>
            ) : (
              <p className="mt-2 text-body-sm text-charcoal-muted">
                Isi alamat lengkap sebelum halaman ini dipublikasikan.
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ContactPendingNotice() {
  const missing = [
    isPlaceholder(site.whatsappNumber) ? "nomor WhatsApp" : null,
    isPlaceholder(site.email) ? "email resmi" : null,
    isPlaceholder(site.phone) ? "nomor telepon" : null,
  ].filter((value): value is string => value !== null);

  if (missing.length === 0) {
    return (
      <p className="max-w-prose text-body text-charcoal-soft">
        Semua kanal di atas sudah aktif. Gunakan kanal ini saja, dan abaikan pesan yang mengarahkan
        Anda ke nomor atau rekening lain.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-cream p-5">
      <p className="text-body font-semibold text-emerald-900">
        Sebagian kanal resmi belum diisi pada pratinjau ini.
      </p>
      <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">
        Yang belum tersedia: {missing.join(", ")}. Halaman ini akan menampilkan tautan yang dapat
        dibuka begitu datanya diisi, dan sampai saat itu tidak ada kontrol yang berpura-pura
        berfungsi.
      </p>
    </div>
  );
}
