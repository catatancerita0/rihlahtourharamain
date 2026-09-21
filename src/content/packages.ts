import { t, tList } from "../i18n/types";
import type { TravelPackage } from "./types";

/**
 * Umrah program definitions.
 *
 * These entries describe how each program type works, because that is
 * information the business actually controls. Every commercial fact (price,
 * date, airline, hotel, seat status) is null on purpose: the business has not
 * published it yet, and a null renders as a labelled pending state rather than
 * an invented number.
 *
 * To publish a real departure, fill the null fields and set `availability`.
 */
export const packages: TravelPackage[] = [
  {
    id: "pkg-umrah-reguler",
    slug: "reguler",
    name: t("Umrah Reguler", "Regular Umrah"),
    category: "umrah",
    type: "reguler",
    focus: t(
      "Berangkat pada tanggal yang sudah ditetapkan bersama satu rombongan.",
      "Departs on a fixed date together with one group.",
    ),
    summary: t(
      "Program Reguler berjalan pada tanggal keberangkatan yang sudah ditetapkan dan diikuti satu rombongan dengan pembimbing. Rute, hotel, dan fasilitas ditetapkan tim Rihlah untuk setiap keberangkatan, jadi seluruh jamaah dalam rombongan menerima susunan yang sama.",
      "The Regular programme runs on a departure date that has been set in advance and travels as one group with a guide. Route, hotels and facilities are arranged by the Rihlah team for each departure, so every pilgrim in the group receives the same arrangement.",
    ),
    audiences: tList(
      [
        "Jamaah yang pertama kali berangkat dan lebih nyaman mengikuti susunan yang sudah ditetapkan.",
        "Keluarga yang ingin berangkat bersama pada tanggal tetap.",
        "Jamaah yang ingin berangkat dalam rombongan, bukan perjalanan sendiri.",
      ],
      [
        "Pilgrims travelling for the first time who are more comfortable following arrangements that are already set.",
        "Families who want to travel together on a fixed date.",
        "Pilgrims who want to travel within a group rather than on their own.",
      ],
    ),
    differentiators: tList(
      [
        "Tanggal keberangkatan ditetapkan lebih awal dan diumumkan pada halaman jadwal.",
        "Susunan perjalanan sama untuk seluruh jamaah dalam satu rombongan.",
        "Biaya per jamaah mengikuti program yang dipilih dan tercantum pada jadwal keberangkatan.",
      ],
      [
        "The departure date is fixed well ahead and published on the schedule page.",
        "Every pilgrim in the group travels on the same arrangement.",
        "The cost per pilgrim follows the chosen programme and appears on the departure schedule.",
      ],
    ),
    duration: null,
    departureDate: null,
    departureMonth: null,
    airline: null,
    makkahHotel: null,
    madinahHotel: null,
    price: null,
    priceNote: null,
    availability: "unknown",
    thumbnail: null,
    gallery: [],
    itinerary: [],
    included: tList([], []),
    excluded: tList([], []),
    documents: tList([], []),
    terms: tList([], []),
  },
  {
    id: "pkg-umrah-plus",
    slug: "plus",
    name: t("Umrah Plus", "Umrah Plus"),
    category: "umrah",
    type: "plus",
    focus: t(
      "Menambahkan kunjungan ke destinasi lain di luar Makkah dan Madinah.",
      "Adds a visit to another destination outside Makkah and Madinah.",
    ),
    summary: t(
      "Program Plus memakai susunan Umrah yang sama, lalu menambahkan kunjungan ke destinasi lain di luar Makkah dan Madinah. Destinasi yang dipakai Rihlah ditetapkan per keberangkatan, termasuk lama kunjungan dan urutan kota, karena bergantung pada ketersediaan penerbangan dan musim.",
      "The Plus programme uses the same Umrah arrangement, then adds a visit to another destination outside Makkah and Madinah. Which destination Rihlah uses is decided per departure, including how long the visit lasts and the order of the cities, because it depends on flight availability and the season.",
    ),
    audiences: tList(
      [
        "Jamaah yang ingin menambah kunjungan setelah rangkaian ibadah selesai.",
        "Keluarga besar yang ingin rute lebih panjang dalam satu kali keberangkatan.",
        "Jamaah yang menyesuaikan perjalanan dengan masa cuti panjang.",
      ],
      [
        "Pilgrims who want to add a visit once the worship programme is finished.",
        "Large families who want a longer route in a single departure.",
        "Pilgrims who are fitting the trip into a long period of leave.",
      ],
    ),
    differentiators: tList(
      [
        "Ada tambahan kota di luar Makkah dan Madinah.",
        "Durasi total lebih panjang daripada program Reguler.",
        "Ketersediaan tambahan mengikuti jadwal penerbangan dan musim keberangkatan.",
      ],
      [
        "Includes an extra city outside Makkah and Madinah.",
        "The total duration is longer than the Regular programme.",
        "The extra stop follows the flight schedule and the departure season.",
      ],
    ),
    duration: null,
    departureDate: null,
    departureMonth: null,
    airline: null,
    makkahHotel: null,
    madinahHotel: null,
    price: null,
    priceNote: null,
    availability: "unknown",
    thumbnail: null,
    gallery: [],
    itinerary: [],
    included: tList([], []),
    excluded: tList([], []),
    documents: tList([], []),
    terms: tList([], []),
  },
  {
    id: "pkg-umrah-private",
    slug: "private",
    name: t("Umrah Private", "Private Umrah"),
    category: "umrah",
    type: "private",
    focus: t(
      "Tanggal, jumlah jamaah, dan rute disusun mengikuti permintaan rombongan.",
      "Date, group size and route are arranged around what the group asks for.",
    ),
    summary: t(
      "Program Private disusun dari permintaan calon jamaah. Tanggal, jumlah peserta, jenis kamar, dan rute dibahas lebih dulu, lalu tim menetapkan susunan dan biaya. Program ini sering dipilih keluarga yang ingin menjaga ritme perjalanan sendiri, termasuk saat membawa orang tua.",
      "The Private programme is built from what the prospective pilgrim asks for. Date, number of travellers, room type and route are discussed first, then the team sets the arrangement and the cost. It is often chosen by families who want to keep their own pace, including when travelling with parents.",
    ),
    audiences: tList(
      [
        "Keluarga yang ingin berangkat pada tanggal pilihannya sendiri.",
        "Rombongan kecil dari satu komunitas, majelis, atau kantor.",
        "Jamaah yang membutuhkan penyesuaian ritme kegiatan dan tipe kamar.",
      ],
      [
        "Families who want to depart on a date of their own choosing.",
        "A small group from one community, study circle or office.",
        "Pilgrims who need the daily pace and the room type adjusted.",
      ],
    ),
    differentiators: tList(
      [
        "Tanggal tidak mengikuti jadwal rombongan umum.",
        "Jumlah peserta menentukan ketersediaan kendaraan dan kamar.",
        "Rute dan fasilitas dibahas bersama sebelum biaya dihitung.",
      ],
      [
        "The date does not follow the public group schedule.",
        "The number of travellers decides vehicle and room availability.",
        "Route and facilities are discussed together before the cost is calculated.",
      ],
    ),
    duration: null,
    departureDate: null,
    departureMonth: null,
    airline: null,
    makkahHotel: null,
    madinahHotel: null,
    price: null,
    priceNote: null,
    availability: "unknown",
    thumbnail: null,
    gallery: [],
    itinerary: [],
    included: tList([], []),
    excluded: tList([], []),
    documents: tList([], []),
    terms: tList([], []),
  },
];

export const umrahPrograms = packages.filter((item) => item.category === "umrah");

export function getPackageBySlug(slug: string | undefined): TravelPackage | undefined {
  if (!slug) return undefined;
  return packages.find((item) => item.slug === slug);
}
