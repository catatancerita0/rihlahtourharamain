/**
 * Content schemas. The UI reads these shapes only, so swapping the seed data
 * for a CMS later does not require touching a single page or component.
 *
 * Every string a reader can see is a `Localized` value rather than a plain
 * string. Latin script is not an assumption either: a hotel name is stored per
 * language because publications spell the same hotel differently in Indonesian
 * and English, and because the admin has to be able to correct one without
 * touching the other.
 */
import type { Localized } from "../i18n/types";

export type PackageCategory = "umrah" | "haji";
export type ProgramType = "reguler" | "plus" | "private";
export type Availability = "available" | "limited" | "full" | "unknown";

export interface HotelInfo {
  name: Localized<string>;
  city: Localized<string>;
  category: Localized<string> | null;
  /** Free text because publications state it in different ways. */
  distance: Localized<string> | null;
  roomType: Localized<string> | null;
  facilities: Localized<string[]>;
  /** Photo of the actual room. Never a stock lobby shot of a different hotel. */
  photo: string | null;
}

export interface ItineraryDay {
  day: number;
  location: Localized<string>;
  agenda: Localized<string[]>;
  hotel: Localized<string> | null;
  transport: Localized<string> | null;
  meals: Localized<string> | null;
  note: Localized<string> | null;
}

export interface TravelPackage {
  id: string;
  slug: string;
  name: Localized<string>;
  category: PackageCategory;
  type: ProgramType;
  /** Short editorial line used on cards and in the finder. */
  focus: Localized<string>;
  /** Longer explanation shown on the detail page. */
  summary: Localized<string>;
  audiences: Localized<string[]>;
  differentiators: Localized<string[]>;
  /** null means the business has not published it yet, never "zero". */
  duration: Localized<string> | null;
  /** ISO `YYYY-MM-DD`, formatted per language at render time. */
  departureDate: string | null;
  /** ISO `YYYY-MM`, formatted per language at render time. */
  departureMonth: string | null;
  airline: Localized<string> | null;
  makkahHotel: HotelInfo | null;
  madinahHotel: HotelInfo | null;
  price: number | null;
  priceNote: Localized<string> | null;
  availability: Availability;
  /** Cover photo for listings. Its description comes from the package name. */
  thumbnail: string | null;
  /** Photos of this programme. Each one carries its own description. */
  gallery: Photo[];
  itinerary: ItineraryDay[];
  included: Localized<string[]>;
  excluded: Localized<string[]>;
  documents: Localized<string[]>;
  terms: Localized<string[]>;
}

/**
 * A photograph together with the sentence describing what it shows. Keeping the
 * two in one value means no image can reach a page without alternative text.
 */
export interface Photo {
  /** Path inside public/, or a full URL. */
  file: string;
  /** What someone who cannot see the photo needs to know. */
  alt: Localized<string>;
}

export interface Article {
  id: string;
  slug: string;
  title: Localized<string>;
  category: Localized<string>;
  excerpt: Localized<string>;
  /** Blocks per language. A plain string is a paragraph, an object is a list. */
  content: Localized<ArticleBlock[]>;
  thumbnail: string | null;
  author: Localized<string> | null;
  /** ISO `YYYY-MM-DD`. null hides the date instead of guessing one. */
  publishedAt: string | null;
}

export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; text: string }
  | { kind: "heading"; text: string };

export interface FaqItem {
  id: string;
  category: Localized<string>;
  question: Localized<string>;
  answer: Localized<string>;
  order: number;
}

export interface TeamMember {
  id: string;
  name: Localized<string>;
  role: Localized<string>;
  photo: string | null;
  bio: Localized<string> | null;
}

export interface Testimonial {
  id: string;
  name: Localized<string>;
  photo: string | null;
  packageName: Localized<string> | null;
  quote: Localized<string>;
  publishedAt: string | null;
}

export interface JourneyStep {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  /** What the jamaah has to do, so the step is actionable rather than a label. */
  jamaahAction: Localized<string>;
}

/** A reason to choose Rihlah. The first one carries the section on the homepage. */
export interface ReasonItem {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  lead: boolean;
}

/**
 * A photo slot. A slot with a photo renders as that photo; a slot without one
 * says what belongs there, so a page is never padded with stock imagery that
 * would misrepresent the trips.
 */
export interface GallerySlot {
  id: string;
  label: Localized<string>;
  description: Localized<string>;
  /** Path inside public/, a storage URL, or null while nothing is uploaded. */
  photo: string | null;
}

/**
 * A promotion the admin adds. Kept as content rather than as a prepared banner
 * so it can expire on its own and so one promo can point at one package.
 */
export interface Promo {
  id: string;
  title: Localized<string>;
  detail: Localized<string> | null;
  /** Package slug this applies to. null means it applies site-wide. */
  packageSlug: string | null;
  /** ISO `YYYY-MM-DD` after which the promo stops appearing. null never expires. */
  endsAt: string | null;
  /** Whether it also earns a place in the homepage banner. */
  featured: boolean;
}

/** Homepage sections the admin can switch off without deleting their content. */
export const HOME_SECTIONS = [
  "finder",
  "umrah",
  "schedule",
  "why",
  "process",
  "haji",
  "packages",
  "guides",
  "faq",
  "consult",
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number];

export interface HomepageSettings {
  hiddenSections: HomeSectionId[];
  /** Slugs pinned to the front of the finder. Empty keeps publication order. */
  featuredPackageSlugs: string[];
  /** Whether the promo banner is allowed to appear at all. */
  showPromoBanner: boolean;
}

/** A licence scan or other official file shown on the licensing page. */
export interface LegalDocument {
  id: string;
  label: Localized<string>;
  /** Path inside public/, a storage URL, or null while nothing is uploaded. */
  file: string | null;
}

export interface LegalEntity {
  businessName: string;
  nib: string;
  ppiu: string;
  pihk: string;
  bankAccount: string;
  documents: LegalDocument[];
}

/**
 * Everything the business itself supplies: how it is reached, what its licence
 * numbers are, and which photos stand in for the ones not uploaded yet.
 */
export interface SiteProfile {
  brand: string;
  shortBrand: string;
  tagline: Localized<string>;
  operatingNote: Localized<string>;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappMessage: Localized<string>;
  email: string;
  phone: string;
  serviceHours: string;
  addressLines: string[];
  legalEntity: LegalEntity;
  media: { hero: Photo | null };
  social: Record<string, string | null>;
}

/**
 * About page copy, moved out of the page so the admin can revise it. The two
 * lists are the arguments the page makes, which is exactly the text a business
 * changes first.
 */
export interface AboutCommitment {
  id: string;
  title: Localized<string>;
  body: Localized<string>;
}

export interface AboutContent {
  intro: Localized<string>;
  howIntro: Localized<string>;
  programsBody: Localized<string>;
  consultationBody: Localized<string>;
  commitments: AboutCommitment[];
  scopeLimits: Localized<string[]>;
}

/** Collections the admin edits, one per content type. */
export const CONTENT_COLLECTIONS = [
  "packages",
  "articles",
  "faqs",
  "promos",
  "gallery",
  "team",
  "testimonials",
  "reasons",
  "journey",
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

/** Pages an admin can take out of the navigation without deleting them. */
export const NAV_KEYS = [
  "beranda",
  "paket-umrah",
  "paket-haji",
  "jadwal",
  "tentang-kami",
  "pembimbing",
  "panduan",
  "galeri",
  "faq",
  "legalitas",
  "kontak",
] as const;

export type NavKey = (typeof NAV_KEYS)[number];

/**
 * Hiding a page removes it from the menus and from the homepage. The route stays
 * reachable so a link already shared with a jamaah keeps working.
 */
export interface NavigationSettings {
  hidden: NavKey[];
}

/** Single-row settings groups the admin edits. */
export const SETTINGS_KEYS = ["profile", "homepage", "about", "navigation"] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

/**
 * What the pages read. Compiled seeds fill every field, so this shape is always
 * complete even when the backend has not answered yet or has not been set up.
 */
export interface ContentBundle {
  packages: TravelPackage[];
  articles: Article[];
  faqs: FaqItem[];
  promos: Promo[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  gallerySlots: GallerySlot[];
  journeySteps: JourneyStep[];
  reasons: ReasonItem[];
  profile: SiteProfile;
  homepage: HomepageSettings;
  about: AboutContent;
  navigation: NavigationSettings;
}
