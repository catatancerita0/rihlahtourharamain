/** The two languages the site publishes. Both are complete, nothing falls back. */
export const LANGS = ["id", "en"] as const;

export type Lang = (typeof LANGS)[number];

/**
 * Text that must exist in both languages. Using a record rather than an
 * optional English field means a missing translation fails the type check
 * instead of quietly showing Indonesian to an English reader.
 */
export type Localized<T = string> = Record<Lang, T>;

export const languageMeta: Record<
  Lang,
  { short: string; name: string; htmlLang: string; ogLocale: string }
> = {
  id: { short: "ID", name: "Bahasa Indonesia", htmlLang: "id", ogLocale: "id_ID" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_US" },
};

export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}
