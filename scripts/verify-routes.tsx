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
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import type { Lang } from "../src/i18n/types";
import { articles } from "../src/content/articles";
import { faqs } from "../src/content/faq";
import { packages } from "../src/content/packages";
import { gallerySlots } from "../src/content/site-content";
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
  { path: "/panduan", mustContain: [articles[0].title, "Kategori"] },
  { path: `/panduan/${articles[0].slug}`, mustContain: [articles[0].title, "Kembali ke semua panduan"] },
  {
    path: "/galeri",
    mustContain: ["Masjidil Haram dan sekitarnya", "Galeri ini sengaja kosong"],
  },
  { path: "/faq", mustContain: [faqs[0].question, faqs[9].question] },
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

function render(path: string, lang: Lang = "id"): string {
  stubStoredLanguage(lang);
  return renderToString(
    <LanguageProvider>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </LanguageProvider>,
  );
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

const umrahOnly = filterPackages(packages, { ...emptyFilter, category: "umrah" }, []);
report(umrahOnly.length === 3, "category filter returns the three Umrah programs");

const hajiOnly = filterPackages(packages, { ...emptyFilter, category: "haji" }, []);
report(hajiOnly.length === 0, "Haji filter returns nothing while no Haji program exists");

const privateOnly = filterPackages(packages, { ...emptyFilter, type: "private" }, []);
report(
  privateOnly.length === 1 && privateOnly[0].slug === "private",
  "program filter narrows to a single program",
);

const keyword = filterPackages(packages, { ...emptyFilter, keyword: "keluarga" }, []);
report(keyword.length > 0, "keyword search matches program copy");

const noKeywordMatch = filterPackages(packages, { ...emptyFilter, keyword: "zzzz" }, []);
report(noKeywordMatch.length === 0, "keyword search can produce the empty state");

report(!isFilterActive(emptyFilter), "a fresh filter is not reported as active");
report(isFilterActive({ ...emptyFilter, keyword: "a" }), "a typed keyword is reported as active");

// Both controls read published data, so they must stay empty while none exists.
report(deriveMonths(packages).length === 0, "month options stay empty without departure data");
report(deriveBudgetBands(packages).length === 0, "budget bands stay empty without prices");

const priced = [{ ...packages[0], price: 29_500_000 }];
report(deriveBudgetBands(priced).length > 0, "budget bands appear once a price exists");
const banded = deriveBudgetBands(priced);
const pricedInBand = filterPackages(priced, { ...emptyFilter, budget: banded[0].id }, banded);
report(pricedInBand.length === 1, "a budget band can match a published price");

report(formatRupiah(29_500_000) === "Rp29.500.000", "prices render in Indonesian format");
report(formatRupiah(null) === null, "a missing price formats as null, not as zero");

const split = splitDeparture("2027-01-14");
report(
  split?.day === "14" && split?.rest === "Januari 2027",
  "the departure date splits into day and month for the date column",
);
report(splitDeparture(null) === null, "a missing departure date splits to null");

const sorted = sortByAvailability([
  { ...packages[2], availability: "full" as const },
  { ...packages[1], availability: "available" as const },
]);
report(sorted[0].availability === "available", "available departures sort ahead of full ones");

report(isPlaceholder("[WHATSAPP_NUMBER]"), "a bracketed value counts as a placeholder");
report(!isPlaceholder("628123456789"), "a real value does not count as a placeholder");
report(isPlaceholder(null) && isPlaceholder(""), "empty values count as placeholders");
report(whatsappHref() === null, "no WhatsApp link is built while the number is unset");

console.log("");
console.log("Language switch");

/**
 * Indonesian strings that belong to the interface only. Each entry has to be
 * gone from the English render of every route, so this list can only hold
 * phrases that no untranslated page body repeats. It grows as more of the site
 * is translated: "Panduan Jamaah" and "Kebijakan Privasi" join it once the
 * guide and legal pages carry English copy of their own.
 */
const indonesianOnlyChrome = [
  "Beranda",
  "Jelajahi",
  "Lewati ke konten utama",
  "Navigasi utama",
  "Tampilkan dalam",
  "Akun media sosial resmi belum ditautkan",
];

const englishFailures: string[] = [];
for (const path of [...staticPaths, ...dynamicPaths]) {
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

const leakedIndonesian = [...staticPaths, ...dynamicPaths].flatMap((path) => {
  const html = render(path, "en");
  return indonesianOnlyChrome
    .filter((needle) => html.includes(needle))
    .map((needle) => `${path} still shows ${needle}`);
});
report(
  leakedIndonesian.length === 0,
  "no Indonesian interface text survives in the English render",
);
for (const leak of leakedIndonesian) {
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
const blankErrors = validateConsultation(blankForm);
report(
  Object.keys(blankErrors).length === 6,
  "an empty form reports one error per required field",
);

const badPhone = validateConsultation({ ...blankForm, nama: "A", whatsapp: "12" });
report(Boolean(badPhone.nama) && Boolean(badPhone.whatsapp), "short values are rejected");

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
  Object.keys(validateConsultation(validForm)).length === 0,
  "a complete form passes validation",
);

const summary = buildConsultationSummary(validForm);
report(
  ["Aisyah Rahman", "081234567890", "3", "Private", "Jamaah lansia"].every((part) =>
    summary.includes(part),
  ),
  "the summary carries every field the jamaah filled in",
);
report(
  buildConsultationSummary({ ...validForm, kebutuhan: [] }).includes("Kebutuhan khusus: Tidak ada"),
  "an empty optional list still renders in the summary",
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
site.media.hero = { file: "/images/contoh-hero.jpg", alt: "Contoh foto hero" };
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
console.log(`${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
