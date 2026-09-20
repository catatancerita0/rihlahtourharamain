import { Link, useLocation } from "react-router-dom";
import { site, whatsappHref } from "../config/site";
import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  consult: "Konsultasi",
  numberUnset: "Nomor resmi belum diatur",
  whatsappCta: "Konsultasi WhatsApp",
  openContact: "nomor WhatsApp resmi belum diatur, buka halaman kontak",
  openWhatsapp: "Konsultasi melalui WhatsApp ke",
};

/**
 * The number is not published yet, so the floating control must not pretend to
 * open a chat. It links to the contact page instead, where the state of the
 * official channels is explained in full.
 */
const copy: Localized<typeof idCopy> = {
  id: idCopy,
  en: {
    consult: "Talk to us",
    numberUnset: "Official number not set yet",
    whatsappCta: "Chat on WhatsApp",
    openContact: "the official WhatsApp number is not set yet, open the contact page",
    openWhatsapp: "Consult over WhatsApp with",
  },
};

export function WhatsAppButton() {
  const href = whatsappHref();
  const { pathname } = useLocation();
  const text = useCopy(copy);

  // Package detail pages already carry a sticky consultation bar on mobile, so
  // the floating control would sit on top of it and block the price.
  const onPackageDetail = /^\/(paket-umrah|paket-haji)\/.+/.test(pathname);
  if (pathname === "/kontak" || onPackageDetail) return null;

  const shell =
    "fixed bottom-5 right-4 z-40 flex min-h-12 items-center gap-3 rounded-md px-4 py-3 shadow-panel transition-colors duration-200 ease-calm sm:bottom-7 sm:right-7";

  if (!href) {
    return (
      <Link
        to="/kontak"
        className={`${shell} border border-emerald-800 bg-shell text-emerald-900 hover:bg-cream`}
        aria-label={`${text.consult}: ${text.openContact} ${site.brand}`}
      >
        <WhatsAppGlyph />
        <span className="flex flex-col leading-tight">
          <span className="text-body-sm font-semibold">{text.consult}</span>
          <span className="text-label text-charcoal-soft">{text.numberUnset}</span>
        </span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${shell} bg-emerald-800 text-shell hover:bg-emerald-700`}
      aria-label={`${text.openWhatsapp} ${site.brand}`}
    >
      <WhatsAppGlyph />
      <span className="text-body-sm font-semibold">{text.whatsappCta}</span>
    </a>
  );
}

export function WhatsAppGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.6 21.4l4.8-1.3A9.3 9.3 0 1 0 12 2.6Zm0 1.8a7.5 7.5 0 0 1 0 15 7.4 7.4 0 0 1-3.8-1l-.4-.2-2.5.7.7-2.4-.3-.4A7.5 7.5 0 0 1 12 4.4Zm-3 3.4c-.2 0-.5.1-.7.4-.3.3-.6.8-.6 1.5s.4 1.4.5 1.5c.1.2 1.2 1.9 3 2.6 1.5.6 1.8.5 2.1.4.4 0 1.2-.5 1.3-1 .2-.4.2-.8.1-.9l-.6-.3-1.1-.5c-.1-.1-.3-.1-.4.1l-.5.6c-.1.1-.2.2-.4.1a5.6 5.6 0 0 1-1.6-1c-.5-.4-.8-.9-.9-1.1 0-.2 0-.3.1-.4l.3-.4c0-.1.1-.2 0-.4l-.5-1.2c-.1-.3-.3-.3-.4-.3h-.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
