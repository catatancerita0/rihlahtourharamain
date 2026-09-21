/**
 * The content bundle: what every page reads.
 *
 * Two sources feed it. The seeds compiled into the repository are the base, and
 * rows from the backend are layered on top field by field. A backend that is
 * unreachable, half-filled, or newly created therefore still produces a complete
 * bundle, and the public site never shows an empty section because of a network
 * problem.
 *
 * Documents arriving from the backend are validated, not trusted. A row that
 * cannot be read as its intended shape is skipped instead of being rendered, so
 * one bad edit cannot break a page for visitors.
 */
import { articles } from "./articles";
import { faqs } from "./faq";
import { packages } from "./packages";
import {
  aboutContent,
  gallerySlots,
  homepageSettings,
  journeySteps,
  navigationSettings,
  pendingGuideTopics,
  reasons,
  teamMembers,
  testimonials,
} from "./site-content";
import { site } from "../config/site";
import type { Localized } from "../i18n/types";
import type {
  AboutContent,
  Article,
  ArticleBlock,
  ContentBundle,
  ContentCollection,
  FaqItem,
  GallerySlot,
  HomepageSettings,
  HomeSectionId,
  HotelInfo,
  ItineraryDay,
  JourneyStep,
  NavKey,
  NavigationSettings,
  Photo,
  Promo,
  ReasonItem,
  SettingsKey,
  SiteProfile,
  TeamMember,
  Testimonial,
  TravelPackage,
} from "./types";
import { HOME_SECTIONS, NAV_KEYS } from "./types";

/** The compiled defaults. Used on their own when no backend is configured. */
export const seedBundle: ContentBundle = {
  packages,
  articles,
  faqs,
  promos: [],
  teamMembers,
  testimonials,
  gallerySlots,
  journeySteps,
  reasons,
  profile: site,
  homepage: homepageSettings,
  about: aboutContent,
  navigation: navigationSettings,
};

/** One row of `content_docs`, as the API returns it. */
export interface DocRow {
  collection: string;
  slug: string;
  position: number;
  doc: unknown;
}

/** One row of `site_settings`. */
export interface SettingsRow {
  key: string;
  value: unknown;
}

export interface ParseResult {
  bundle: ContentBundle;
  /** Rows that were ignored, so the admin can be told which ones and why. */
  rejected: { collection: string; slug: string; reason: string }[];
}

// --- value guards ------------------------------------------------------------
// Deliberately narrow: they answer "can this be rendered as what it claims to
// be", not "is this JSON". Anything else is a reason to fall back to the seed.

type Rec = Record<string, unknown>;

function rec(value: unknown): Rec | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Rec) : null;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function loc(value: unknown): Localized<string> | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const en = str(r.en);
  return id && en ? { id, en } : null;
}

function locList(value: unknown): Localized<string[]> | null {
  const r = rec(value);
  if (!r) return null;
  if (!Array.isArray(r.id) || !Array.isArray(r.en)) return null;
  const id = r.id.filter((x): x is string => typeof x === "string");
  const en = r.en.filter((x): x is string => typeof x === "string");
  return id.length === r.id.length && en.length === r.en.length ? { id, en } : null;
}

function locText(value: unknown, fallback: Localized<string>): Localized<string> {
  return loc(value) ?? fallback;
}

function locTexts(value: unknown, fallback: Localized<string[]>): Localized<string[]> {
  return locList(value) ?? fallback;
}

function photo(value: unknown): Photo | null {
  const r = rec(value);
  if (!r) return null;
  const file = str(r.file);
  const alt = loc(r.alt);
  return file && alt ? { file, alt } : null;
}

function photoList(value: unknown): Photo[] {
  return Array.isArray(value) ? value.map(photo).filter((p): p is Photo => p !== null) : [];
}

function localizedOrNull(value: unknown): Localized<string> | null {
  return loc(value);
}

function isoOrNull(value: unknown, pattern: RegExp): string | null {
  const s = str(value);
  if (!s) return null;
  return pattern.test(s) ? s : null;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// --- per-shape normalisation -------------------------------------------------

function hotel(value: unknown): HotelInfo | null {
  const r = rec(value);
  if (!r) return null;
  const name = loc(r.name);
  if (!name) return null;
  return {
    name,
    city: locText(r.city, { id: "", en: "" }),
    category: localizedOrNull(r.category),
    distance: localizedOrNull(r.distance),
    roomType: localizedOrNull(r.roomType),
    facilities: locTexts(r.facilities, { id: [], en: [] }),
    photo: str(r.photo),
  };
}

function itineraryDay(value: unknown): ItineraryDay | null {
  const r = rec(value);
  if (!r) return null;
  const day = num(r.day);
  if (day === null) return null;
  return {
    day,
    location: locText(r.location, { id: "", en: "" }),
    agenda: locTexts(r.agenda, { id: [], en: [] }),
    hotel: localizedOrNull(r.hotel),
    transport: localizedOrNull(r.transport),
    meals: localizedOrNull(r.meals),
    note: localizedOrNull(r.note),
  };
}

function travelPackage(value: unknown): TravelPackage | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const slug = str(r.slug);
  const name = loc(r.name);
  if (!id || !slug || !name) return null;
  return {
    id,
    slug,
    name,
    category: oneOf(r.category, ["umrah", "haji"] as const, "umrah"),
    type: oneOf(r.type, ["reguler", "plus", "private"] as const, "reguler"),
    focus: locText(r.focus, { id: "", en: "" }),
    summary: locText(r.summary, { id: "", en: "" }),
    audiences: locTexts(r.audiences, { id: [], en: [] }),
    differentiators: locTexts(r.differentiators, { id: [], en: [] }),
    duration: localizedOrNull(r.duration),
    departureDate: isoOrNull(r.departureDate, ISO_DATE),
    departureMonth: isoOrNull(r.departureMonth, ISO_MONTH),
    airline: localizedOrNull(r.airline),
    makkahHotel: hotel(r.makkahHotel),
    madinahHotel: hotel(r.madinahHotel),
    price: num(r.price),
    priceNote: localizedOrNull(r.priceNote),
    availability: oneOf(
      r.availability,
      ["available", "limited", "full", "unknown"] as const,
      "unknown",
    ),
    thumbnail: str(r.thumbnail),
    gallery: photoList(r.gallery),
    itinerary: Array.isArray(r.itinerary)
      ? r.itinerary.map(itineraryDay).filter((d): d is ItineraryDay => d !== null)
      : [],
    included: locTexts(r.included, { id: [], en: [] }),
    excluded: locTexts(r.excluded, { id: [], en: [] }),
    documents: locTexts(r.documents, { id: [], en: [] }),
    terms: locTexts(r.terms, { id: [], en: [] }),
  };
}

function articleBlock(value: unknown): ArticleBlock | null {
  const r = rec(value);
  if (!r) return null;
  const kind = oneOf(r.kind, ["paragraph", "list", "note", "heading"] as const, "paragraph");
  if (kind === "list") {
    const items = Array.isArray(r.items)
      ? r.items.filter((x): x is string => typeof x === "string" && x.trim() !== "")
      : [];
    return items.length > 0 ? { kind, items } : null;
  }
  const text = str(r.text);
  return text ? { kind, text } : null;
}

function article(value: unknown): Article | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const slug = str(r.slug);
  const title = loc(r.title);
  if (!id || !slug || !title) return null;
  const content = rec(r.content);
  return {
    id,
    slug,
    title,
    category: locText(r.category, { id: "Panduan", en: "Guide" }),
    excerpt: locText(r.excerpt, { id: "", en: "" }),
    content: {
      id: Array.isArray(content?.id)
        ? content.id.map(articleBlock).filter((b): b is ArticleBlock => b !== null)
        : [],
      en: Array.isArray(content?.en)
        ? content.en.map(articleBlock).filter((b): b is ArticleBlock => b !== null)
        : [],
    },
    thumbnail: str(r.thumbnail),
    author: localizedOrNull(r.author),
    publishedAt: isoOrNull(r.publishedAt, ISO_DATE),
  };
}

function faqItem(value: unknown): FaqItem | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const question = loc(r.question);
  const answer = loc(r.answer);
  if (!id || !question || !answer) return null;
  return {
    id,
    category: locText(r.category, { id: "Umum", en: "General" }),
    question,
    answer,
    order: num(r.order) ?? 0,
  };
}

function promo(value: unknown): Promo | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const title = loc(r.title);
  if (!id || !title) return null;
  return {
    id,
    title,
    detail: localizedOrNull(r.detail),
    packageSlug: str(r.packageSlug),
    endsAt: isoOrNull(r.endsAt, ISO_DATE),
    featured: r.featured === true,
  };
}

function gallerySlot(value: unknown): GallerySlot | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const label = loc(r.label);
  if (!id || !label) return null;
  return {
    id,
    label,
    description: locText(r.description, { id: "", en: "" }),
    photo: str(r.photo),
  };
}

function teamMember(value: unknown): TeamMember | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const name = loc(r.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    role: locText(r.role, { id: "", en: "" }),
    photo: str(r.photo),
    bio: localizedOrNull(r.bio),
  };
}

function testimonial(value: unknown): Testimonial | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const quote = loc(r.quote);
  if (!id || !quote) return null;
  return {
    id,
    name: locText(r.name, { id: "", en: "" }),
    photo: str(r.photo),
    packageName: localizedOrNull(r.packageName),
    quote,
    publishedAt: isoOrNull(r.publishedAt, ISO_DATE),
  };
}

function reasonItem(value: unknown): ReasonItem | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const title = loc(r.title);
  if (!id || !title) return null;
  return {
    id,
    title,
    description: locText(r.description, { id: "", en: "" }),
    lead: r.lead === true,
  };
}

function journeyStep(value: unknown): JourneyStep | null {
  const r = rec(value);
  if (!r) return null;
  const id = str(r.id);
  const title = loc(r.title);
  if (!id || !title) return null;
  return {
    id,
    title,
    description: locText(r.description, { id: "", en: "" }),
    jamaahAction: locText(r.jamaahAction, { id: "", en: "" }),
  };
}

/**
 * One decoder per collection. Each returns null for a row it cannot read, which
 * is what turns a malformed edit into a skipped row rather than a broken page.
 */
const decoders: {
  [K in ContentCollection]: { key: keyof ContentBundle; read: (value: unknown) => unknown };
} = {
  packages: { key: "packages", read: travelPackage },
  articles: { key: "articles", read: article },
  faqs: { key: "faqs", read: faqItem },
  promos: { key: "promos", read: promo },
  gallery: { key: "gallerySlots", read: gallerySlot },
  team: { key: "teamMembers", read: teamMember },
  testimonials: { key: "testimonials", read: testimonial },
  reasons: { key: "reasons", read: reasonItem },
  journey: { key: "journeySteps", read: journeyStep },
};

export function isContentCollection(value: string): value is ContentCollection {
  return value in decoders;
}

/** Packages and articles are addressed by slug; the rest by id. */
export function keyFieldOf(collection: ContentCollection): "slug" | "id" {
  return collection === "packages" || collection === "articles" ? "slug" : "id";
}

/** The compiled records for a collection, used by the admin as its base list. */
export function collectionSeed<T>(collection: ContentCollection): T[] {
  return [...(seedBundle[decoders[collection].key] as unknown as T[])];
}

/**
 * Runs one document through its decoder. The admin uses this to check a record
 * before saving it, so a document that the public site would skip is caught at
 * the point it is written rather than silently disappearing later.
 */
export function readDoc(collection: ContentCollection, value: unknown): unknown | null {
  return decoders[collection].read(value);
}

// --- settings ----------------------------------------------------------------

function stringMap(value: unknown): Record<string, string | null> | null {
  const r = rec(value);
  if (!r) return null;
  const out: Record<string, string | null> = {};
  for (const [key, entry] of Object.entries(r)) {
    out[key] = typeof entry === "string" ? entry : null;
  }
  return out;
}

function mergeProfile(base: SiteProfile, value: unknown): SiteProfile {
  const r = rec(value);
  if (!r) return base;
  const legal = rec(r.legalEntity);
  return {
    ...base,
    brand: str(r.brand) ?? base.brand,
    shortBrand: str(r.shortBrand) ?? base.shortBrand,
    tagline: locText(r.tagline, base.tagline),
    operatingNote: locText(r.operatingNote, base.operatingNote),
    whatsappNumber: str(r.whatsappNumber) ?? base.whatsappNumber,
    whatsappDisplay: str(r.whatsappDisplay) ?? base.whatsappDisplay,
    whatsappMessage: locText(r.whatsappMessage, base.whatsappMessage),
    email: str(r.email) ?? base.email,
    phone: str(r.phone) ?? base.phone,
    serviceHours: str(r.serviceHours) ?? base.serviceHours,
    addressLines:
      Array.isArray(r.addressLines) && r.addressLines.length > 0
        ? r.addressLines.filter((x): x is string => typeof x === "string")
        : base.addressLines,
    legalEntity: legal
      ? {
          businessName: str(legal.businessName) ?? base.legalEntity.businessName,
          nib: str(legal.nib) ?? base.legalEntity.nib,
          ppiu: str(legal.ppiu) ?? base.legalEntity.ppiu,
          pihk: str(legal.pihk) ?? base.legalEntity.pihk,
          bankAccount: str(legal.bankAccount) ?? base.legalEntity.bankAccount,
          documents: Array.isArray(legal.documents)
            ? legal.documents
                .map((entry) => {
                  const doc = rec(entry);
                  const id = doc ? str(doc.id) : null;
                  const label = doc ? loc(doc.label) : null;
                  return id && label
                    ? { id, label, file: doc ? str(doc.file) : null }
                    : null;
                })
                .filter((d): d is { id: string; label: Localized<string>; file: string | null } =>
                  d !== null,
                )
            : base.legalEntity.documents,
        }
      : base.legalEntity,
    media: {
      // Only the file is stored; the description stays with the code so a photo
      // can never become reachable without alternative text.
      hero: (() => {
        const media = rec(r.media);
        const heroUrl = media ? str(media.hero) : null;
        const existing = base.media.hero;
        if (!heroUrl) return existing;
        return { file: heroUrl, alt: existing?.alt ?? { id: "", en: "" } };
      })(),
    },
    social: stringMap(r.social) ?? base.social,
  };
}

function mergeHomepage(base: HomepageSettings, value: unknown): HomepageSettings {
  const r = rec(value);
  if (!r) return base;
  const hidden = Array.isArray(r.hiddenSections)
    ? r.hiddenSections.filter((s): s is HomeSectionId => HOME_SECTIONS.includes(s as HomeSectionId))
    : base.hiddenSections;
  const featured = Array.isArray(r.featuredPackageSlugs)
    ? r.featuredPackageSlugs.filter((s): s is string => typeof s === "string")
    : base.featuredPackageSlugs;
  return {
    hiddenSections: hidden,
    featuredPackageSlugs: featured,
    showPromoBanner: typeof r.showPromoBanner === "boolean" ? r.showPromoBanner : base.showPromoBanner,
  };
}

function mergeAbout(base: AboutContent, value: unknown): AboutContent {
  const r = rec(value);
  if (!r) return base;
  const commitments = Array.isArray(r.commitments)
    ? r.commitments
        .map((entry) => {
          const item = rec(entry);
          const id = item ? str(item.id) : null;
          const title = item ? loc(item.title) : null;
          return id && title
            ? { id, title, body: locText(item?.body, { id: "", en: "" }) }
            : null;
        })
        .filter((c): c is AboutContent["commitments"][number] => c !== null)
    : base.commitments;
  return {
    intro: locText(r.intro, base.intro),
    howIntro: locText(r.howIntro, base.howIntro),
    programsBody: locText(r.programsBody, base.programsBody),
    consultationBody: locText(r.consultationBody, base.consultationBody),
    commitments: commitments.length > 0 ? commitments : base.commitments,
    scopeLimits: locList(r.scopeLimits) ?? base.scopeLimits,
  };
}

function mergeNavigation(base: NavigationSettings, value: unknown): NavigationSettings {
  const r = rec(value);
  if (!r) return base;
  return {
    hidden: Array.isArray(r.hidden)
      ? r.hidden.filter((key): key is NavKey => NAV_KEYS.includes(key as NavKey))
      : base.hidden,
  };
}

/** Settings are merged over the seeds field by field, never replaced wholesale. */
export function buildBundle(rows: DocRow[], settings: SettingsRow[]): ParseResult {
  const bundle: ContentBundle = {
    ...seedBundle,
    packages: [...seedBundle.packages],
    articles: [...seedBundle.articles],
    faqs: [...seedBundle.faqs],
    gallerySlots: [...seedBundle.gallerySlots],
    journeySteps: [...seedBundle.journeySteps],
    reasons: [...seedBundle.reasons],
  };
  const rejected: ParseResult["rejected"] = [];

  for (const row of rows) {
    if (!isContentCollection(row.collection)) {
      rejected.push({ collection: row.collection, slug: row.slug, reason: "Collection tidak dikenal" });
      continue;
    }
    const decoder = decoders[row.collection];
    const parsed = decoder.read(row.doc) as { slug?: string; id?: string } | null;
    if (!parsed) {
      rejected.push({
        collection: row.collection,
        slug: row.slug,
        reason: "Isi dokumen tidak sesuai bentuk yang diharapkan",
      });
      continue;
    }

    const list = bundle[decoder.key] as unknown[];
    const key = row.collection === "packages" || row.collection === "articles" ? "slug" : "id";
    const incoming = (parsed as Record<string, unknown>)[key];
    const at = list.findIndex(
      (entry) => (entry as Record<string, unknown>)[key] === incoming,
    );

    // A row whose position is below zero is how the admin marks a seed entry as
    // removed: the entry is dropped here rather than deleted from the seeds, so
    // the deletion can be undone from the backend.
    if (row.position < 0) {
      if (at >= 0) list.splice(at, 1);
      continue;
    }
    if (at >= 0) list[at] = parsed;
    else list.push(parsed);
  }

  for (const [key, value] of settings.map((row) => [row.key, row.value] as const)) {
    if (key === "profile") bundle.profile = mergeProfile(seedBundle.profile, value);
    else if (key === "homepage") bundle.homepage = mergeHomepage(seedBundle.homepage, value);
    else if (key === "about") bundle.about = mergeAbout(seedBundle.about, value);
    else if (key === "navigation") bundle.navigation = mergeNavigation(seedBundle.navigation, value);
  }

  bundle.packages = orderPackages(bundle.packages, bundle.homepage.featuredPackageSlugs);
  bundle.faqs = [...bundle.faqs].sort((a, b) => a.order - b.order);

  return { bundle, rejected };
}

/** Pinned packages come first; everything else keeps the order it was written in. */
export function orderPackages(list: TravelPackage[], pinned: string[]): TravelPackage[] {
  if (pinned.length === 0) return list;
  const rank = new Map(pinned.map((slug, index) => [slug, index]));
  return [...list].sort((a, b) => {
    const ra = rank.get(a.slug);
    const rb = rank.get(b.slug);
    if (ra === undefined && rb === undefined) return 0;
    if (ra === undefined) return 1;
    if (rb === undefined) return -1;
    return ra - rb;
  });
}

// --- promotions --------------------------------------------------------------

/** Today in the local timezone, as `YYYY-MM-DD`, matching `endsAt`. */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * A promo stops showing after its end date without anyone switching it off,
 * which is the point of storing the date: nothing has to be remembered.
 */
export function isPromoActive(promo: Promo, today: string): boolean {
  if (!promo.endsAt) return true;
  return promo.endsAt >= today;
}

export function activePromos(list: Promo[], today: string): Promo[] {
  return list.filter((promo) => isPromoActive(promo, today));
}

export function bannerPromos(list: Promo[], today: string): Promo[] {
  return activePromos(list, today).filter((promo) => promo.featured);
}

/** The promo a package should advertise, or null when it has none. */
export function promosForPackage(list: Promo[], slug: string, today: string): Promo[] {
  return activePromos(list, today).filter((promo) => promo.packageSlug === slug);
}

export function isNavHidden(navigation: NavigationSettings, key: NavKey): boolean {
  return navigation.hidden.includes(key);
}

/** Kept for callers that only have the settings row and not the bundle. */
export function isSectionHidden(homepage: HomepageSettings, section: HomeSectionId): boolean {
  return homepage.hiddenSections.includes(section);
}

export type { ContentCollection, SettingsKey };
export { HOME_SECTIONS, NAV_KEYS, pendingGuideTopics };
