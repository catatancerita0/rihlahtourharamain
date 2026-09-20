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
    name: "Umrah Reguler",
    category: "umrah",
    type: "reguler",
    focus: "Berangkat pada tanggal yang sudah ditetapkan bersama satu rombongan.",
    summary:
      "Program Reguler berjalan pada tanggal keberangkatan yang sudah ditetapkan dan diikuti satu rombongan dengan pembimbing. Rute, hotel, dan fasilitas ditetapkan tim Rihlah untuk setiap keberangkatan, jadi seluruh jamaah dalam rombongan menerima susunan yang sama.",
    audiences: [
      "Jamaah yang pertama kali berangkat dan lebih nyaman mengikuti susunan yang sudah ditetapkan.",
      "Keluarga yang ingin berangkat bersama pada tanggal tetap.",
      "Jamaah yang ingin berangkat dalam rombongan, bukan perjalanan sendiri.",
    ],
    differentiators: [
      "Tanggal keberangkatan ditetapkan lebih awal dan diumumkan pada halaman jadwal.",
      "Susunan perjalanan sama untuk seluruh jamaah dalam satu rombongan.",
      "Biaya per jamaah mengikuti program yang dipilih dan tercantum pada jadwal keberangkatan.",
    ],
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
    included: [],
    excluded: [],
    documents: [],
    terms: [],
  },
  {
    id: "pkg-umrah-plus",
    slug: "plus",
    name: "Umrah Plus",
    category: "umrah",
    type: "plus",
    focus: "Menambahkan kunjungan ke destinasi lain di luar Makkah dan Madinah.",
    summary:
      "Program Plus memakai susunan Umrah yang sama, lalu menambahkan kunjungan ke destinasi lain di luar Makkah dan Madinah. Destinasi yang dipakai Rihlah ditetapkan per keberangkatan, termasuk lama kunjungan dan urutan kota, karena bergantung pada ketersediaan penerbangan dan musim.",
    audiences: [
      "Jamaah yang ingin menambah kunjungan setelah rangkaian ibadah selesai.",
      "Keluarga besar yang ingin rute lebih panjang dalam satu kali keberangkatan.",
      "Jamaah yang menyesuaikan perjalanan dengan masa cuti panjang.",
    ],
    differentiators: [
      "Ada tambahan kota di luar Makkah dan Madinah.",
      "Durasi total lebih panjang daripada program Reguler.",
      "Ketersediaan tambahan mengikuti jadwal penerbangan dan musim keberangkatan.",
    ],
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
    included: [],
    excluded: [],
    documents: [],
    terms: [],
  },
  {
    id: "pkg-umrah-private",
    slug: "private",
    name: "Umrah Private",
    category: "umrah",
    type: "private",
    focus: "Tanggal, jumlah jamaah, dan rute disusun mengikuti permintaan rombongan.",
    summary:
      "Program Private disusun dari permintaan calon jamaah. Tanggal, jumlah peserta, jenis kamar, dan rute dibahas lebih dulu, lalu tim menetapkan susunan dan biaya. Program ini sering dipilih keluarga yang ingin menjaga ritme perjalanan sendiri, termasuk saat membawa orang tua.",
    audiences: [
      "Keluarga yang ingin berangkat pada tanggal pilihannya sendiri.",
      "Rombongan kecil dari satu komunitas, majelis, atau kantor.",
      "Jamaah yang membutuhkan penyesuaian ritme kegiatan dan tipe kamar.",
    ],
    differentiators: [
      "Tanggal tidak mengikuti jadwal rombongan umum.",
      "Jumlah peserta menentukan ketersediaan kendaraan dan kamar.",
      "Rute dan fasilitas dibahas bersama sebelum biaya dihitung.",
    ],
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
    included: [],
    excluded: [],
    documents: [],
    terms: [],
  },
];

export const umrahPrograms = packages.filter((item) => item.category === "umrah");

export function getPackageBySlug(slug: string | undefined): TravelPackage | undefined {
  if (!slug) return undefined;
  return packages.find((item) => item.slug === slug);
}
