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
