/**
 * Route verification.
 *
 * Runs every route through the real component tree with react-dom/server and
 * checks three things that are easy to get wrong in a single page app: a route
 * throws while rendering, a route loses its expected content, or a link points
 * at a path that no route serves.
 *
 * Run with: bun run verify
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../src/App";
import {
  buildConsultationSummary,
  validateConsultation,
  type FormValues,
} from "../src/components/ConsultationForm";
import { isPlaceholder, site, whatsappHref } from "../src/config/site";
import { AdminPage } from "../src/pages/AdminPage";
import { ContentProvider } from "../src/content/ContentProvider";
import {
  activePromos,
  bannerPromos,
  buildBundle,
  isPromoActive,
  promosForPackage,
  seedBundle,
  todayIso,
} from "../src/content/bundle";
import type { ContentBundle, Promo, TravelPackage } from "../src/content/types";
import { mergeRecords } from "../src/lib/admin-collections";
import { blocksToText, textToBlocks } from "../src/lib/article-text";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { both, type Lang, type Localized } from "../src/i18n/types";
import { articles } from "../src/content/articles";
import { faqs } from "../src/content/faq";
import { packages } from "../src/content/packages";
import { gallerySlots, journeySteps, reasons } from "../src/content/site-content";
import type { ArticleBlock } from "../src/content/types";
import { formatRupiah, sortByAvailability, splitDeparture } from "../src/lib/format";
import {
  assetUrl,
  isLocalAssetPath,
  mediaBase,
  publicPathOf,
} from "../src/lib/media";
import {
  deriveBudgetBands,
  deriveMonths,
  emptyFilter,
  filterPackages,
  isFilterActive,
} from "../src/lib/packages";

const staticPaths = [
  "/",
  "/paket-umrah",
  "/paket-haji",
  "/jadwal",
  "/tentang-kami",
  "/pembimbing",
  "/panduan",
  "/galeri",
  "/faq",
  "/legalitas",
  "/konsultasi",
  "/kontak",
  "/kebijakan-privasi",
  "/syarat-ketentuan",
  "/pembatalan-refund",
  "/admin",
];

const dynamicPaths = [
  ...packages.map((item) => `/paket-${item.category}/${item.slug}`),
  ...articles.map((item) => `/panduan/${item.slug}`),
];

const validPaths = new Set([...staticPaths, ...dynamicPaths]);

interface Check {
  path: string;
  mustContain: string[];
  /** Raw placeholders that would read as real data if they leaked through. */
  mustNotContain?: string[];
}

const checks: Check[] = [
  {
    path: "/",
    mustContain: ["Menuju Baitullah, Bersama Rihlah.", "Tersedia", "Belum dibuka"],
    mustNotContain: ["[WHATSAPP_NUMBER]", "[NOMOR WHATSAPP]"],
  },
  {
    path: "/paket-umrah",
    mustContain: ["Umrah Reguler", "Umrah Plus", "Umrah Private", "Buka filter program"],
  },
  {
    path: "/paket-umrah/reguler",
    mustContain: ["Cara kerja program ini", "Konsultasikan Paket Ini", "Belum dipublikasikan"],
  },
  { path: "/paket-umrah/plus", mustContain: ["Umrah Plus"] },
  { path: "/paket-umrah/private", mustContain: ["Umrah Private"] },
  { path: "/paket-haji", mustContain: ["Cara memeriksa penyelenggara Haji", "Belum ditetapkan"] },
  {
    path: "/jadwal",
    mustContain: ["Belum ada tanggal keberangkatan yang ditetapkan.", "Seat terbatas", "Penuh"],
  },
  { path: "/tentang-kami", mustContain: ["Rihlah Tour Haramain", "Yang tidak bisa kami janjikan"] },
  { path: "/pembimbing", mustContain: ["Data pembimbing belum tersedia."] },
  { path: "/panduan", mustContain: [articles[0].title.id, "Kategori"] },
  {
    path: `/panduan/${articles[0].slug}`,
    mustContain: [articles[0].title.id, "Kembali ke semua panduan"],
  },
  {
    path: "/galeri",
    mustContain: ["Masjidil Haram dan sekitarnya", "Galeri ini sengaja kosong"],
  },
  { path: "/faq", mustContain: [faqs[0].question.id, faqs[9].question.id] },
  {
    path: "/legalitas",
    mustContain: ["Data resmi penyelenggara", "Belum diisi", "Pemeriksaan identitas"],
    // A bracketed placeholder must never render where a real value belongs.
    mustNotContain: ["[NAMA BADAN USAHA]", "[NIB]", "[ALAMAT KANTOR]"],
  },
  {
    path: "/kontak",
    mustContain: ["Hubungi Rihlah Tour Haramain", "Kanal resmi"],
    mustNotContain: ["[EMAIL RESMI]", "[TELEPON KANTOR]", "[ALAMAT KANTOR]", "[NOMOR WHATSAPP]"],
  },
  {
    path: "/konsultasi",
    mustContain: ["Konsultasikan Rencana Umrah Anda", "Kebutuhan khusus", "Nomor WhatsApp resmi belum diatur"],
  },
  { path: "/kebijakan-privasi", mustContain: ["berjalan sepenuhnya di peramban Anda"] },
  { path: "/syarat-ketentuan", mustContain: ["Ruang lingkup", "Hukum yang berlaku"] },
  { path: "/pembatalan-refund", mustContain: ["Status kebijakan ini", "Yang harus dijawab kebijakan ini"] },
];

/**
 * Each entry pairs an unknown URL with the message that URL should produce.
 * Unknown package and guide URLs get a domain specific explanation, which is
 * more useful to a visitor than the generic page.
 */
const notFoundPaths: Array<{ path: string; message: string }> = [
  { path: "/halaman-tidak-ada", message: "Halaman ini tidak ada" },
  { path: "/paket-umrah/program-yang-tidak-ada", message: "Program yang Anda cari tidak ditemukan." },
  { path: "/paket-haji/program-hilang", message: "Program yang Anda cari tidak ditemukan." },
  { path: "/panduan/entri-hilang", message: "Panduan ini tidak ditemukan." },
];

let failures = 0;
const linkTargets = new Set<string>();

function report(ok: boolean, message: string) {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
}

/**
 * The provider takes its starting language from localStorage, which Node does
 * not have. A stub exposing just that one method lets the same tree render in
 * English, so the switch is checked end to end instead of only at type level.
 */
function stubStoredLanguage(lang: Lang) {
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: { getItem: () => lang, setItem: () => undefined },
  };
}

/**
 * The bundle is injectable so the checks can render what the admin's edits
 * would produce: a hidden section, a running promotion, a page taken out of the
 * menu. Without it those gates could only test the compiled defaults.
 */
function render(path: string, lang: Lang = "id", bundle?: ContentBundle): string {
  stubStoredLanguage(lang);
  return renderToString(
    <LanguageProvider>
      <ContentProvider initialBundle={bundle}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </ContentProvider>
    </LanguageProvider>,
  );
}

function withBundle(changes: Partial<ContentBundle>): ContentBundle {
  return { ...seedBundle, ...changes };
}

/** Isolates one region of the rendered page, so a check does not pass or fail
 * because of a link that lives somewhere else on the same page. */
function region(html: string, tag: "header" | "footer"): string {
  const match = html.match(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`));
  return match ? match[0] : "";
}

console.log("Route rendering and content checks");
console.log("");

for (const check of checks) {
  try {
    const html = render(check.path);
    const missing = check.mustContain.filter((needle) => !html.includes(needle));
    const leaked = (check.mustNotContain ?? []).filter((needle) => html.includes(needle));
    report(
      missing.length === 0 && leaked.length === 0,
      `${check.path} renders${
        missing.length > 0 ? ` but is missing: ${missing.join(" | ")}` : ""
      }${leaked.length > 0 ? ` and leaks placeholders: ${leaked.join(" | ")}` : ""}`,
    );

    for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
      linkTargets.add(match[1].split("?")[0].replace(/\/$/, "") || "/");
    }
  } catch (error) {
    report(false, `${check.path} threw: ${(error as Error).message}`);
  }
}

console.log("");
console.log("Fallback routes");
for (const entry of notFoundPaths) {
  try {
    const html = render(entry.path);
    report(html.includes(entry.message), `${entry.path} explains that nothing is here`);
  } catch (error) {
    report(false, `${entry.path} threw: ${(error as Error).message}`);
  }
}

console.log("");
console.log("Every internal link resolves to a route");
const deadLinks = [...linkTargets].filter((target) => !validPaths.has(target)).sort();
report(deadLinks.length === 0, `internal links checked: ${linkTargets.size}`);
for (const dead of deadLinks) {
  console.log(`      dead link: ${dead}`);
}

console.log("");
console.log("Em dash sweep across rendered output");
const emDashRoutes = [...staticPaths, ...dynamicPaths].filter((path) => render(path).includes("\u2014"));
report(emDashRoutes.length === 0, "no rendered route contains an em dash");
for (const route of emDashRoutes) {
  console.log(`      contains an em dash: ${route}`);
}

console.log("");
console.log("Mobile safety in the rendered markup");

/**
 * Horizontal overflow on a phone usually comes from a track or width that is
 * fixed at every viewport. Every fixed track in this project has to sit behind
 * a `sm:` or `lg:` prefix, which is checkable without a browser.
 */
const mobileRisks = [...staticPaths, ...dynamicPaths].flatMap((path) => {
  const html = render(path);
  const tokens = [...html.matchAll(/class="([^"]*)"/g)]
    .flatMap((match) => match[1].split(/\s+/))
    .filter(Boolean);
  const offenders = tokens.filter(
    (token) =>
      /^grid-cols-\[/.test(token) ||
      /^w-\[/.test(token) ||
      /^min-w-\[/.test(token) ||
      /^whitespace-nowrap$/.test(token),
  );
  return offenders.map((token) => `${path} uses ${token}`);
});
report(
  mobileRisks.length === 0,
  "no fixed grid tracks, widths, or nowrap text apply at every viewport",
);
for (const risk of mobileRisks) {
  console.log(`      ${risk}`);
}

console.log("");
console.log("Controls that would vanish into a dark panel");

/**
 * Buttons keep their own colours, so a light-surface variant placed on an
 * emerald panel either loses its shape or disappears entirely: an emerald
 * outline on an emerald background is invisible, text included. Only always-on
 * classes count, since hover and focus utilities do nothing when nothing is
 * hovered, and a control with a light fill of its own is safe anywhere.
 */
const darkPanel = /bg-emerald-(800|900)/;
const clashesWithDark = /bg-emerald-800|bg-emerald-900|text-emerald-800|border-emerald-800/;

const invisibleOnDark: string[] = [];
for (const path of [...staticPaths, ...dynamicPaths]) {
  const chunks = render(path).split(/(?=<(?:section|footer|header)\b)/);

  for (const chunk of chunks) {
    const panel = /<(?:section|footer|header)[^>]*class="([^"]*)"/.exec(chunk);
    if (!panel || !darkPanel.test(panel[1])) continue;

    for (const match of chunk.matchAll(/<(a|button)\b[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g)) {
      const plain = (match[2] ?? "")
        .split(/\s+/)
        .filter((token) => token && !token.includes(":"))
        .join(" ");
      if (/bg-shell|bg-cream|bg-emerald-50|bg-gold/.test(plain)) continue;
      if (!clashesWithDark.test(plain)) continue;

      const label = (match[3] ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 40);
      invisibleOnDark.push(`${path}: "${label}" keeps light-surface colours on a dark panel`);
    }
  }
}
report(invisibleOnDark.length === 0, "no control borrows light-surface colours on a dark panel");
for (const item of invisibleOnDark) {
  console.log(`      ${item}`);
}

console.log("");
console.log("Interactive elements that carry no visible text");

/**
 * A control with no readable text and no accessible name cannot be used, and
 * one hidden at every viewport is worse than absent. Hiding behind a
 * breakpoint is deliberate, so only an unprefixed class is reported.
 */
const namelessControls: string[] = [];
for (const path of [...staticPaths, ...dynamicPaths]) {
  const html = render(path);
  for (const match of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const tag = match[1] ?? "";
    const attrs = match[2] ?? "";
    const inner = match[3] ?? "";
    const visibleText = inner.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const className = /class="([^"]*)"/.exec(attrs)?.[1] ?? "";

    if (!visibleText && !/sr-only/.test(inner) && !/aria-label="[^"]+"/.test(attrs)) {
      namelessControls.push(`${path}: <${tag}> renders with no accessible name`);
    }
    // `hidden sm:inline-flex` is a deliberate mobile collapse, so a
    // breakpoint-prefixed display utility anywhere in the list clears it.
    const hasBreakpointDisplay =
      /(sm|md|lg|xl|2xl):(block|inline-block|flex|inline-flex|grid|inline-grid|table)\b/.test(
        className,
      );
    if (/(^|\s)hidden(\s|$)/.test(className) && !hasBreakpointDisplay) {
      namelessControls.push(`${path}: <${tag}> is hidden at every viewport`);
    }
  }
}
report(
  namelessControls.length === 0,
  "every link and button is named and reachable at some width",
);
for (const item of namelessControls) {
  console.log(`      ${item}`);
}

console.log("");
console.log("Filter, format and form logic");

const umrahOnly = filterPackages(packages, { ...emptyFilter, category: "umrah" }, [], "id");
report(umrahOnly.length === 3, "category filter returns the three Umrah programs");

const hajiOnly = filterPackages(packages, { ...emptyFilter, category: "haji" }, [], "id");
report(hajiOnly.length === 0, "Haji filter returns nothing while no Haji program exists");

const privateOnly = filterPackages(packages, { ...emptyFilter, type: "private" }, [], "id");
report(
  privateOnly.length === 1 && privateOnly[0].slug === "private",
  "program filter narrows to a single program",
);

const keyword = filterPackages(packages, { ...emptyFilter, keyword: "keluarga" }, [], "id");
report(keyword.length > 0, "keyword search matches program copy");

const noKeywordMatch = filterPackages(packages, { ...emptyFilter, keyword: "zzzz" }, [], "id");
report(noKeywordMatch.length === 0, "keyword search can produce the empty state");

report(!isFilterActive(emptyFilter), "a fresh filter is not reported as active");
report(isFilterActive({ ...emptyFilter, keyword: "a" }), "a typed keyword is reported as active");

// Both controls read published data, so they must stay empty while none exists.
report(
  deriveMonths(packages, "id").length === 0,
  "month options stay empty without departure data",
);
report(
  deriveBudgetBands(packages, "id").length === 0,
  "budget bands stay empty without prices",
);

const priced = [{ ...packages[0], price: 29_500_000 }];
report(deriveBudgetBands(priced, "id").length > 0, "budget bands appear once a price exists");
const banded = deriveBudgetBands(priced, "id");
const pricedInBand = filterPackages(priced, { ...emptyFilter, budget: banded[0].id }, banded, "id");
report(pricedInBand.length === 1, "a budget band can match a published price");

report(
  formatRupiah(29_500_000, "id") === "Rp29.500.000",
  "prices render in Indonesian grouping",
);
report(
  formatRupiah(29_500_000, "en") === "Rp29,500,000",
  "prices switch digit grouping with the language",
);
report(formatRupiah(null, "id") === null, "a missing price formats as null, not as zero");

const split = splitDeparture("2027-01-14", "id");
report(
  split?.day === "14" && split?.rest === "Januari 2027",
  "the departure date splits into day and month for the date column",
);
report(splitDeparture(null, "id") === null, "a missing departure date splits to null");
report(
  splitDeparture("2027-01-14", "en")?.rest === "January 2027",
  "month names follow the language instead of the system locale",
);

const sorted = sortByAvailability([
  { ...packages[2], availability: "full" as const },
  { ...packages[1], availability: "available" as const },
]);
report(sorted[0].availability === "available", "available departures sort ahead of full ones");

report(isPlaceholder("[WHATSAPP_NUMBER]"), "a bracketed value counts as a placeholder");
report(!isPlaceholder("628123456789"), "a real value does not count as a placeholder");
report(isPlaceholder(null) && isPlaceholder(""), "empty values count as placeholders");
report(
  whatsappHref("id") === null && whatsappHref("en") === null,
  "no WhatsApp link is built while the number is unset",
);

console.log("");
console.log("Language switch");

/**
 * The language gate. Every route is rendered in English and scanned twice: once
 * for interface phrases listed here, and once for content needles derived from
 * the seed copy itself.
 *
 * The needles are derived rather than listed by hand. Any value whose two
 * languages differ is a value that must not appear in its Indonesian form on
 * the English page, and a new package or article is covered the moment it is
 * added. Values that read the same in both languages, such as "Umrah Plus" or
 * "Masjid Nabawi", are skipped because they are meant to.
 */
const indonesianPhrases = [
  "Beranda",
  "Jelajahi",
  "Lewati ke konten utama",
  "Navigasi utama",
  "Tampilkan dalam",
  "Akun media sosial resmi belum ditautkan",
  "Belum ditetapkan:",
  "Dokumen terkait",
  "Sebelum mendaftar",
  "Minta ketentuan tertulis",
  "Catatan penting",
  "Kunjungan kantor",
  "Saring program",
  "Arti tanda ketersediaan",
  "Yang paling sering ditanyakan",
  "Kenapa kami menulis seperti ini",
  "Yang tidak bisa kami janjikan",
  "Gambaran proses",
  "Ringkasan konsultasi",
  "Susun ringkasan untuk disalin",
  "Nomor WhatsApp resmi belum diatur",
  "Tidak ada kursi",
];

/**
 * Words that live only in Indonesian copy here. Checked against the visible
 * text rather than the markup, so identifiers such as `name="kebutuhan"` do
 * not count as a leak.
 */
const indonesianWords = [
  "Belum",
  "belum",
  "dengan",
  "untuk",
  "yang",
  "tidak",
  "Anda",
  "Kami",
  "jadwal",
  "harga",
  "paket",
  "Panduan",
  "keberangkatan",
];

function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Short fragments match too easily, and a value containing quotes or an
 * ampersand is escaped in the render, so a substring match would be unreliable.
 */
function trimmedNeedle(value: string): string | null {
  const needle = value.trim();
  if (needle.length < 12) return null;
  if (/["'&<>]/.test(needle)) return null;
  return needle;
}

function blockText(block: ArticleBlock): string {
  return block.kind === "list" ? block.items.join(" ") : block.text;
}

const contentNeedles: string[] = (() => {
  const found: string[] = [];

  function add(value: Localized<string>) {
    if (value.id === value.en) return;
    const needle = trimmedNeedle(value.id);
    if (needle) found.push(needle);
  }

  function addList(value: Localized<string[]>) {
    value.id.forEach((entry, index) => {
      if (entry === value.en[index]) return;
      const needle = trimmedNeedle(entry);
      if (needle) found.push(needle);
    });
  }

  packages.forEach((item) => {
    add(item.name);
    add(item.focus);
    add(item.summary);
    addList(item.audiences);
    addList(item.differentiators);
  });

  articles.forEach((article) => {
    add(article.title);
    add(article.excerpt);
    add(article.category);
    article.content.id.forEach((block, index) => {
      const other = article.content.en[index];
      if (!other) return;
      const left = blockText(block);
      if (left === blockText(other)) return;
      const needle = trimmedNeedle(left);
      if (needle) found.push(needle);
    });
  });

  faqs.forEach((item) => {
    add(item.question);
    add(item.answer);
  });

  gallerySlots.forEach((slot) => {
    add(slot.label);
    add(slot.description);
  });

  journeySteps.forEach((step) => {
    add(step.title);
    add(step.description);
    add(step.jamaahAction);
  });

  reasons.forEach((reason) => {
    add(reason.title);
    add(reason.description);
  });

  return Array.from(new Set(found));
})();

/**
 * The admin panel is an internal tool and is written in Indonesian on purpose,
 * so it is left out of the language gates. Every visitor-facing route is still
 * covered: this removes one path, not a category.
 */
const bilingualPaths = [...staticPaths, ...dynamicPaths].filter((path) => path !== "/admin");

const englishFailures: string[] = [];
for (const path of bilingualPaths) {
  try {
    const html = render(path, "en");
    if (html.length < 200) englishFailures.push(`${path} rendered almost nothing`);
  } catch (error) {
    englishFailures.push(`${path} threw: ${(error as Error).message}`);
  }
}
report(englishFailures.length === 0, "every route also renders in English");
for (const failure of englishFailures) {
  console.log(`      ${failure}`);
}

const wordPattern = new RegExp(`\\b(${indonesianWords.join("|")})\\b`);

const leakedIndonesian = bilingualPaths.flatMap((path) => {
  const html = render(path, "en");
  const text = visibleText(html);
  const phraseLeaks = indonesianPhrases
    .filter((needle) => html.includes(needle))
    .map((needle) => `${path} still shows interface text: ${needle}`);
  const contentLeaks = contentNeedles
    .filter((needle) => html.includes(needle))
    .map((needle) => `${path} still shows content: ${needle.slice(0, 60)}`);
  const wordLeak = wordPattern.test(text)
    ? [`${path} still shows an Indonesian word: ${text.match(wordPattern)?.[1]}`]
    : [];
  return [...phraseLeaks, ...contentLeaks, ...wordLeak];
});
report(
  leakedIndonesian.length === 0,
  "no Indonesian copy survives in the English render of any route",
);
for (const leak of leakedIndonesian.slice(0, 20)) {
  console.log(`      ${leak}`);
}

const englishHome = render("/", "en");
report(
  englishHome.includes("Umrah Packages") && englishHome.includes("Skip to main content"),
  "the switch replaces navigation and skip link copy",
);
report(
  render("/").includes("Beranda") && !englishHome.includes("Beranda"),
  "the Indonesian render is unchanged by the new provider",
);

const blankForm: FormValues = {
  nama: "",
  whatsapp: "",
  jumlahJamaah: "",
  jenis: "",
  bulan: "",
  program: "",
  kebutuhan: [],
  pesan: "",
};
const blankErrors = validateConsultation(blankForm, "id");
report(
  Object.keys(blankErrors).length === 6,
  "an empty form reports one error per required field",
);

const badPhone = validateConsultation({ ...blankForm, nama: "A", whatsapp: "12" }, "id");
report(Boolean(badPhone.nama) && Boolean(badPhone.whatsapp), "short values are rejected");

const blankErrorsEn = validateConsultation(blankForm, "en");
report(
  Object.values(blankErrorsEn).every((message) => !wordPattern.test(message ?? "")),
  "validation messages follow the language of the reader",
);

const validForm: FormValues = {
  nama: "Aisyah Rahman",
  whatsapp: "081234567890",
  jumlahJamaah: "3",
  jenis: "umrah",
  bulan: "3-6",
  program: "Private",
  kebutuhan: ["Jamaah lansia"],
  pesan: "Berangkat dengan orang tua.",
};
report(
  Object.keys(validateConsultation(validForm, "id")).length === 0,
  "a complete form passes validation",
);

const summary = buildConsultationSummary(validForm, "id");
report(
  ["Aisyah Rahman", "081234567890", "3", "Private", "Jamaah lansia"].every((part) =>
    summary.includes(part),
  ),
  "the summary carries every field the jamaah filled in",
);
report(
  buildConsultationSummary({ ...validForm, kebutuhan: [] }, "id").includes(
    "Kebutuhan khusus: Tidak ada",
  ),
  "an empty optional list still renders in the summary",
);
// The free text here is English too: the summary mirrors whatever the reader
// typed, so an Indonesian sentence in this fixture would be the reader's own
// words rather than untranslated interface copy.
const validFormEn: FormValues = {
  ...validForm,
  kebutuhan: ["Elderly pilgrims"],
  pesan: "Travelling with my parents.",
};
const englishSummary = buildConsultationSummary(validFormEn, "en");
report(
  englishSummary.includes("*Consultation summary*") &&
    englishSummary.includes("Special needs") &&
    !wordPattern.test(englishSummary),
  "the same summary is written in English for the English reader",
);
report(!summary.includes("\u2014"), "the generated summary contains no em dash");
report(summary.includes("*Ringkasan konsultasi*"), "the chat message has a heading WhatsApp renders as bold");
report(
  summary.split("\n").length === 11,
  "every answer sits on its own line in the chat message",
);

/**
 * The direct handoff can only be exercised with a number present. The config
 * value is swapped for two renders and restored immediately after, so the
 * missing-number path stays the one the untouched app runs with.
 */
const configuredNumber = site.whatsappNumber;
const configuredDisplay = site.whatsappDisplay;
site.whatsappNumber = "628123456789";
site.whatsappDisplay = "+62 812-3456-789";
const configuredHtml = render("/konsultasi");
site.whatsappNumber = configuredNumber;
site.whatsappDisplay = configuredDisplay;

report(
  configuredHtml.includes('href="https://wa.me/628123456789?text='),
  "the send control becomes a real WhatsApp link once the number is set",
);
report(
  configuredHtml.includes("Kirim ke WhatsApp"),
  "the send control names the channel it opens",
);
report(
  !configuredHtml.includes("Nomor WhatsApp resmi belum diatur"),
  "the missing-channel notice disappears once the number is set",
);
report(
  render("/konsultasi").includes("Nomor WhatsApp resmi belum diatur"),
  "the missing-channel notice returns while the number is a placeholder",
);

console.log("");
console.log("Media references");

/**
 * Every media path in the content layer either resolves to a file that really
 * is in public/, or it is not published at all. A typo would otherwise surface
 * as a broken image on the live site, where nobody is watching the build.
 */
const referencedMedia: Array<{ source: string; path: string | null }> = [
  ...(site.media.hero ? [{ source: "hero", path: site.media.hero.file }] : []),
  ...site.legalEntity.documents.map((doc) => ({ source: `dokumen ${doc.id}`, path: doc.file })),
  ...gallerySlots.map((slot) => ({ source: `galeri ${slot.id}`, path: slot.photo })),
  ...packages.flatMap((item) => [
    { source: `${item.slug} thumbnail`, path: item.thumbnail },
    ...item.gallery.map((photo) => ({ source: `${item.slug} gallery`, path: photo.file })),
    ...(item.makkahHotel
      ? [{ source: `${item.slug} hotel Makkah`, path: item.makkahHotel.photo }]
      : []),
  ]),
  ...articles.map((item) => ({ source: `${item.slug} thumbnail`, path: item.thumbnail })),
];

const localMedia = referencedMedia.filter(
  (entry): entry is { source: string; path: string } =>
    entry.path !== null && isLocalAssetPath(entry.path),
);
const missingFiles = localMedia.filter((entry) => {
  const relative = publicPathOf(entry.path);
  return relative === null || !existsSync(join("public", relative));
});
report(
  missingFiles.length === 0,
  `local media references resolve to a file in public/: ${localMedia.length}`,
);
for (const entry of missingFiles) {
  console.log(`      missing file: ${entry.source} -> ${entry.path}`);
}

// A reference that climbs out of the publish folder is refused by assetUrl, so
// it would render as an empty slot instead of being served. Catching it here
// keeps a broken path from looking like a photo that was never supplied.
const unresolvable = referencedMedia.filter(
  (entry) => entry.path !== null && entry.path.trim() !== "" && assetUrl(entry.path) === null,
);
report(unresolvable.length === 0, "no media reference points outside the publish folder");
for (const entry of unresolvable) {
  console.log(`      refused path: ${entry.source} -> ${entry.path}`);
}

// GitHub Pages serves this project from /<repository>/, so a stored path used
// raw would request the wrong address even though the file exists.
const rewritten = assetUrl("/images/contoh.jpg");
report(
  rewritten === `${mediaBase()}images/contoh.jpg`,
  "a stored asset path is rewritten to the deployment base",
);
report(
  assetUrl("https://contoh.invalid/foto.jpg") === "https://contoh.invalid/foto.jpg" &&
    assetUrl("[BELUM ADA]") === null &&
    assetUrl(null) === null,
  "external URLs pass through while placeholders and empty values resolve to nothing",
);

/**
 * No photo is configured yet, so the pipeline is exercised by putting one in
 * place for two renders and taking it back out. Without this the img checks
 * below would pass over empty markup and prove nothing.
 */
const storedHero = site.media.hero;
const storedSlotPhoto = gallerySlots[0].photo;
site.media.hero = { file: "/images/contoh-hero.jpg", alt: both("Contoh foto hero") };
gallerySlots[0].photo = "/images/contoh-galeri.jpg";
const withPhotos = render("/") + render("/galeri");
site.media.hero = storedHero;
gallerySlots[0].photo = storedSlotPhoto;

report(
  withPhotos.includes(`src="${mediaBase()}images/contoh-hero.jpg"`),
  "a configured hero photo is requested from the deployment base",
);
report(
  withPhotos.includes(`src="${mediaBase()}images/contoh-galeri.jpg"`),
  "a configured gallery photo is requested from the deployment base",
);
report(
  withPhotos.includes('alt="Contoh foto hero"'),
  "the hero photo keeps the description stored beside it",
);
report(
  /<img[^>]*loading="eager"[^>]*>/.test(withPhotos),
  "the hero photo loads eagerly instead of waiting for the viewport",
);
report(
  withPhotos.includes('loading="lazy"') && withPhotos.includes('decoding="async"'),
  "photos below the fold load lazily and decode off the main thread",
);

const tagsWithoutAlt: string[] = [];
const tagsWithoutLoading: string[] = [];
for (const tag of withPhotos.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="[^"]+"/.test(tag[0])) tagsWithoutAlt.push(tag[0]);
  if (!/\bloading="(lazy|eager)"/.test(tag[0])) tagsWithoutLoading.push(tag[0]);
}
report(tagsWithoutAlt.length === 0, "every rendered image carries alternative text");
report(tagsWithoutLoading.length === 0, "every rendered image states how it should load");

console.log("");
console.log("Bundle built from backend rows");

const emptyBackend = buildBundle([], []);
report(
  emptyBackend.bundle.packages.length === seedBundle.packages.length &&
    emptyBackend.bundle.articles.length === seedBundle.articles.length &&
    emptyBackend.bundle.faqs.length === seedBundle.faqs.length,
  "an empty backend leaves every compiled record in place",
);
report(
  emptyBackend.bundle.profile.whatsappNumber === site.whatsappNumber &&
    emptyBackend.bundle.about.commitments.length === seedBundle.about.commitments.length,
  "the profile and about page fall back to the compiled values",
);

const override = buildBundle(
  [
    {
      collection: "packages",
      slug: "reguler",
      position: 0,
      doc: { ...seedBundle.packages[0], name: both("Nama dari database") },
    },
  ],
  [],
);
report(
  override.bundle.packages.find((item) => item.slug === "reguler")?.name.id ===
    "Nama dari database" &&
    override.bundle.packages.length === seedBundle.packages.length,
  "a stored package replaces the compiled record without duplicating it",
);

const hiddenRecord = buildBundle(
  [
    {
      collection: "packages",
      slug: "plus",
      position: -1,
      doc: seedBundle.packages.find((item) => item.slug === "plus"),
    },
  ],
  [],
);
report(
  hiddenRecord.rejected.length === 0 &&
    !hiddenRecord.bundle.packages.some((item) => item.slug === "plus"),
  "a record hidden in the panel leaves the public list",
);

const brokenRow = buildBundle(
  [{ collection: "packages", slug: "rusak", position: 0, doc: { name: "bukan localized" } }],
  [],
);
report(
  brokenRow.rejected.length === 1 && brokenRow.bundle.packages.length === seedBundle.packages.length,
  "a row the site cannot read is skipped and reported instead of rendered",
);

const mergedSettings = buildBundle(
  [],
  [
    {
      key: "profile",
      value: { whatsappNumber: "6281234567890", email: "halo@contoh.com" },
    },
    { key: "navigation", value: { hidden: ["jadwal", "halaman-yang-tidak-ada"] } },
  ],
);
report(
  mergedSettings.bundle.profile.whatsappNumber === "6281234567890" &&
    mergedSettings.bundle.profile.brand === site.brand,
  "settings are merged field by field over the compiled values",
);
report(
  isPlaceholder(mergedSettings.bundle.profile.phone),
  "a field the admin never filled in keeps its labelled placeholder",
);
report(
  mergedSettings.bundle.navigation.hidden.includes("jadwal") &&
    !mergedSettings.bundle.navigation.hidden.includes("halaman-yang-tidak-ada" as never),
  "an unknown page name is dropped instead of being stored",
);
report(
  buildBundle([], [{ key: "profile", value: null }]).bundle.profile.brand === site.brand,
  "a malformed settings row cannot blank the profile",
);

console.log("");
console.log("Promotions");

const today = todayIso();
const samplePromo = (over: Partial<Promo>): Promo => ({
  id: "promo-uji",
  title: both("Promo uji"),
  detail: null,
  packageSlug: null,
  endsAt: null,
  featured: false,
  ...over,
});

report(
  isPromoActive(samplePromo({ endsAt: "2999-01-01" }), today) &&
    !isPromoActive(samplePromo({ endsAt: "2000-01-01" }), today) &&
    isPromoActive(samplePromo({}), today),
  "a promotion stops by itself once its end date has passed",
);
report(
  activePromos([samplePromo({ endsAt: "2000-01-01" }), samplePromo({})], today).length === 1 &&
    bannerPromos([samplePromo({ featured: true }), samplePromo({ featured: false })], today).length === 1,
  "only active promotions are counted, and only marked ones reach the banner",
);
report(
  promosForPackage(
    [samplePromo({ packageSlug: "plus" }), samplePromo({ packageSlug: "reguler" })],
    "plus",
    today,
  ).length === 1,
  "a package only shows the promotions that name it",
);

const runningPromo = withBundle({
  promos: [
    samplePromo({
      title: both("Diskon pendaftaran awal"),
      packageSlug: "reguler",
      endsAt: "2999-12-31",
      featured: true,
    }),
  ],
});
const promoHome = render("/", "id", runningPromo);
report(
  promoHome.includes("Diskon pendaftaran awal") && promoHome.includes("Berlaku sampai"),
  "an active promotion renders with the date it ends",
);
report(
  !render("/", "id", withBundle({ promos: [samplePromo({ title: both("Promo kedaluwarsa"), endsAt: "2000-01-01", featured: true })] })).includes(
    "Promo kedaluwarsa",
  ),
  "an expired promotion does not render at all",
);
report(
  render("/paket-umrah/reguler", "id", runningPromo).includes("Diskon pendaftaran awal"),
  "a promotion appears on the package it applies to",
);

console.log("");
console.log("Admin-driven layout");

const defaultHome = render("/", "id");
const hiddenNavHome = render("/", "id", withBundle({ navigation: { hidden: ["jadwal"] } }));
report(
  region(defaultHome, "header").includes('href="/jadwal"') &&
    !region(hiddenNavHome, "header").includes('href="/jadwal"'),
  "hiding a page removes its entry from the header navigation",
);
report(
  region(defaultHome, "footer").includes('href="/jadwal"') &&
    !region(hiddenNavHome, "footer").includes('href="/jadwal"'),
  "hiding a page removes its entry from the footer navigation too",
);

const trimmedHome = render(
  "/",
  "id",
  withBundle({ homepage: { ...seedBundle.homepage, hiddenSections: ["faq", "guides"] } }),
);
report(
  defaultHome.includes("Yang paling sering ditanyakan") &&
    !trimmedHome.includes("Yang paling sering ditanyakan") &&
    !trimmedHome.includes("Persiapan yang bisa dimulai sekarang"),
  "a homepage section switched off is not rendered, not rendered empty",
);

const ordered = buildBundle([], [{ key: "homepage", value: { featuredPackageSlugs: ["private"] } }]);
report(
  ordered.bundle.packages[0]?.slug === "private" &&
    ordered.bundle.packages.length === seedBundle.packages.length,
  "a featured package moves to the front without losing any other record",
);

console.log("");
console.log("Panel admin dan situs publik terpisah");

report(
  !defaultHome.includes("Masuk sebagai admin") && !defaultHome.includes("Keluar"),
  "no admin control appears anywhere on the public homepage",
);
report(
  defaultHome.includes("Lihat Paket Umrah") && defaultHome.includes("Konsultasikan Rencana Umrah"),
  "the public homepage renders its calls to action without any session",
);
/**
 * The panel is loaded lazily on the real site, so the route render above only
 * reaches its fallback. It is rendered directly here to check what the panel
 * itself says when the backend has not been set up yet.
 */
const adminHtml = renderToString(
  <LanguageProvider>
    <ContentProvider initialBundle={seedBundle}>
      <StaticRouter location="/admin">
        <AdminPage />
      </StaticRouter>
    </ContentProvider>
  </LanguageProvider>,
);
report(
  adminHtml.includes("Panel Admin") &&
    adminHtml.includes("Backend belum diatur") &&
    adminHtml.includes("VITE_SUPABASE_URL") &&
    adminHtml.includes("VITE_SUPABASE_ANON_KEY") &&
    adminHtml.includes("service_role") &&
    !adminHtml.includes('type="password"'),
  "with no backend the panel explains the setup, names the exact values, and shows no form",
);

console.log("");
console.log("Article outline editing");

const seedBody = articles[0].content.id;
report(
  JSON.stringify(textToBlocks(blocksToText(seedBody))) === JSON.stringify(seedBody),
  "an article body survives a round trip through the editor outline",
);
const parsedOutline = textToBlocks(
  "## Subjudul\n\nParagraf pertama.\n\n- satu\n- dua\n\n> Catatan penting",
);
report(
  parsedOutline.length === 4 &&
    parsedOutline[0].kind === "heading" &&
    parsedOutline[2].kind === "list" &&
    parsedOutline[2].items.length === 2 &&
    parsedOutline[3].kind === "note",
  "the outline reads headings, lists and notes back into blocks",
);

console.log("");
console.log("Admin record list");

const adminList = mergeRecords<TravelPackage>("packages", [
  {
    collection: "packages",
    slug: "reguler",
    position: 5,
    doc: { ...seedBundle.packages[0], name: both("Diubah admin") },
  },
  {
    collection: "packages",
    slug: "plus",
    position: -1,
    doc: seedBundle.packages.find((item) => item.slug === "plus"),
  },
]);
report(
  adminList.records.length === seedBundle.packages.length,
  "the panel lists every compiled record whether or not it was ever edited",
);
report(
  adminList.records.find((record) => record.key === "plus")?.hidden === true,
  "a hidden record stays in the panel so it can be brought back",
);
report(
  adminList.records.find((record) => record.key === "reguler")?.doc.name.id === "Diubah admin",
  "the panel shows the stored version of a record rather than the compiled one",
);
const addedRecord = mergeRecords("promos", [
  { collection: "promos", slug: "promo-baru", position: 0, doc: samplePromo({ id: "promo-baru" }) },
]);
report(
  addedRecord.records.length === 1 && addedRecord.records[0].fromSeed === false,
  "a record the admin created is listed as new, so it can also be deleted",
);

console.log("");
console.log(`${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
