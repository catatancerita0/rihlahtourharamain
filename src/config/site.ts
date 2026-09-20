import type { Localized } from "../i18n/types";

/**
 * Every value that the real business must supply lives here and nowhere else.
 * Bracketed strings are unresolved placeholders: the UI detects them and shows
 * a labelled "belum diatur" state instead of a working-looking control.
 *
 * TODO before publishing, replace every bracketed value below:
 *   1. whatsappNumber, in international form without a plus sign.
 *   2. email and phone, so the contact and legality pages stop showing gaps.
 *   3. addressLines and serviceHours.
 *   4. legalEntity: business name, NIB, PPIU and PIHK numbers, bank account.
 *      Take these from official documents, not from marketing material.
 *   5. social entries, once the accounts exist, so the footer can link them.
 */
// The address that answers today: a GitHub Pages project site. Move this to the
// brand domain when there is one, and change the base flag in
// .github/workflows/deploy.yml in the same commit, or the two disagree.
export const siteUrl = "https://catatancerita0.github.io/rihlahtourharamain";

export function canonicalFor(pathname: string): string {
  const clean = pathname === "/" ? "" : pathname.replace(/\/$/, "");
  return `${siteUrl}${clean}`;
}

export const site = {
  brand: "Rihlah Tour Haramain",
  shortBrand: "Rihlah",
  // Brand lines travel with the language switch like any other copy.
  tagline: {
    id: "Menemani perjalanan menuju Baitullah.",
    en: "Walking beside you on the way to Baitullah.",
  } satisfies Localized<string>,
  operatingNote: {
    id: "Rencanakan perjalanan ibadah dengan informasi yang jelas dan pendampingan yang terarah.",
    en: "Plan your worship journey with clear information and support that stays with you.",
  } satisfies Localized<string>,

  // Digits only, international format, without a leading plus sign.
  whatsappNumber: "[WHATSAPP_NUMBER]",
  whatsappDisplay: "[NOMOR WHATSAPP]",
  whatsappMessage:
    "Assalamu'alaikum Rihlah Tour Haramain, saya ingin berkonsultasi mengenai program Umrah.",

  email: "[EMAIL RESMI]",
  phone: "[TELEPON KANTOR]",
  serviceHours: "[JAM LAYANAN]",
  addressLines: ["[ALAMAT KANTOR]"],

  legalEntity: {
    businessName: "[NAMA BADAN USAHA]",
    nib: "[NIB]",
    ppiu: "[NOMOR IZIN PPIU]",
    pihk: "[NOMOR IZIN PIHK]",
    bankAccount: "[REKENING RESMI PERUSAHAAN]",
  },

  // Left null on purpose. A social link is only rendered when a real account
  // exists, so the footer never points at an empty profile.
  social: {
    instagram: null,
    tiktok: null,
    youtube: null,
  } as Record<string, string | null>,
};

const PLACEHOLDER_PATTERN = /^\[[^\]]+\]$/;

export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return PLACEHOLDER_PATTERN.test(value.trim());
}

export function whatsappHref(message: string = site.whatsappMessage): string | null {
  if (isPlaceholder(site.whatsappNumber)) return null;
  const digits = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function contactHref(value: string, kind: "tel" | "mailto"): string | null {
  if (isPlaceholder(value)) return null;
  if (kind === "tel") return `tel:${value.replace(/[^\d+]/g, "")}`;
  return `mailto:${value.trim()}`;
}
