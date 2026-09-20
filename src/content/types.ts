/**
 * Content schemas. The UI reads these shapes only, so swapping the seed data
 * for a CMS later does not require touching a single page or component.
 */

export type PackageCategory = "umrah" | "haji";
export type ProgramType = "reguler" | "plus" | "private";
export type Availability = "available" | "limited" | "full" | "unknown";

export interface HotelInfo {
  name: string;
  city: string;
  category: string | null;
  /** Free text because publications state it in different ways. */
  distance: string | null;
  roomType: string | null;
  facilities: string[];
}

export interface ItineraryDay {
  day: number;
  location: string;
  agenda: string[];
  hotel: string | null;
  transport: string | null;
  meals: string | null;
  note: string | null;
}

export interface TravelPackage {
  id: string;
  slug: string;
  name: string;
  category: PackageCategory;
  type: ProgramType;
  /** Short editorial line used on cards and in the finder. */
  focus: string;
  /** Longer explanation shown on the detail page. */
  summary: string;
  audiences: string[];
  differentiators: string[];
  /** null means the business has not published it yet, never "zero". */
  duration: string | null;
  departureDate: string | null;
  departureMonth: string | null;
  airline: string | null;
  makkahHotel: HotelInfo | null;
  madinahHotel: HotelInfo | null;
  price: number | null;
  priceNote: string | null;
  availability: Availability;
  thumbnail: string | null;
  gallery: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  documents: string[];
  terms: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Paragraph blocks. A plain string is a paragraph, an object is a list. */
  content: ArticleBlock[];
  thumbnail: string | null;
  author: string | null;
  publishedAt: string | null;
}

export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; text: string }
  | { kind: "heading"; text: string };

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string | null;
  packageName: string | null;
  quote: string;
  publishedAt: string | null;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  /** What the jamaah has to do, so the step is actionable rather than a label. */
  jamaahAction: string;
}
