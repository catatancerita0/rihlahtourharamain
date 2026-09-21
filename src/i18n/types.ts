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

/**
 * Builders used by the content files and by colocated page copy. Writing the
 * two languages side by side keeps a translation from drifting away from the
 * text it belongs to. `both()` marks the proper nouns, dates and codes that
 * genuinely read the same in both languages, so keeping one wording is a
 * decision on the record rather than a missing translation.
 */
export function t(id: string, en: string): Localized<string> {
  return { id, en };
}

export function both(value: string): Localized<string> {
  return { id: value, en: value };
}

export function tList(id: string[], en: string[]): Localized<string[]> {
  return { id, en };
}

export function bothList(...values: string[]): Localized<string[]> {
  return { id: values, en: values };
}
