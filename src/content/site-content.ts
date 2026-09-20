import type { JourneyStep, TeamMember, Testimonial } from "./types";

/**
 * The real process, taken from how the business actually runs a departure.
 * Eight steps, because collapsing it to three would hide the parts jamaah
 * most often get surprised by (document review and manasik).
 */
export const journeySteps: JourneyStep[] = [
  {
    id: "step-konsultasi",
    title: "Konsultasi",
    description:
      "Kamu menyampaikan rencana keberangkatan, jumlah jamaah, dan kebutuhan khusus seperti membawa orang tua atau kebutuhan mobilitas.",
    jamaahAction: "Siapkan perkiraan tanggal dan jumlah jamaah.",
  },
  {
    id: "step-program",
    title: "Pemilihan program",
    description:
      "Tim menjelaskan perbedaan Reguler, Plus, dan Private, termasuk konsekuensinya pada durasi dan biaya.",
    jamaahAction: "Pilih satu program untuk dibahas lebih dalam.",
  },
  {
    id: "step-pendaftaran",
    title: "Pendaftaran",
    description:
      "Berkas dan pembayaran awal diverifikasi terhadap ketentuan program, lalu kursi dicatat atas namamu.",
    jamaahAction: "Lengkapi berkas dan lakukan pembayaran awal setelah rinciannya disetujui.",
  },
  {
    id: "step-dokumen",
    title: "Persiapan dokumen",
    description:
      "Tim memeriksa kelengkapan dan konsistensi data sebelum berkas diajukan ke pihak yang berwenang.",
    jamaahAction: "Kirim berkas sesuai format yang diminta dan perbaiki bagian yang belum konsisten.",
  },
  {
    id: "step-manasik",
    title: "Manasik",
    description:
      "Rangkaian ibadah dan urutan kegiatan di lapangan dibahas bersama pembimbing sebelum keberangkatan.",
    jamaahAction: "Ikuti manasik dan catat pertanyaan yang belum terjawab.",
  },
  {
    id: "step-keberangkatan",
    title: "Keberangkatan",
    description:
      "Pertemuan di titik kumpul, pembagian dokumen perjalanan, dan pendampingan sejak dari bandara asal.",
    jamaahAction: "Ikuti instruksi titik kumpul dan simpan dokumen di tempat yang mudah dijangkau.",
  },
  {
    id: "step-pendampingan",
    title: "Pendampingan",
    description:
      "Pembimbing mendampingi kegiatan ibadah dan kebutuhan harian selama di Tanah Suci.",
    jamaahAction: "Sampaikan kebutuhan mendesak ke pembimbing, bukan ke pihak di luar rombongan.",
  },
  {
    id: "step-kepulangan",
    title: "Kepulangan",
    description:
      "Kepulangan diatur mengikuti jadwal penerbangan, termasuk pengembalian dokumen bila dititipkan ke tim.",
    jamaahAction: "Periksa dokumen dan barang bawaan sebelum meninggalkan penginapan.",
  },
];

export interface ReasonItem {
  id: string;
  title: string;
  description: string;
  /** The first reason carries the section, the rest stay compact. */
  lead: boolean;
}

export const reasons: ReasonItem[] = [
  {
    id: "reason-informasi",
    title: "Informasi keberangkatan dijelaskan sebelum pendaftaran.",
    description:
      "Harga, fasilitas, dan hal yang tidak termasuk disampaikan lebih dulu, bukan setelah pembayaran. Kalau sebuah rincian belum ditetapkan, kami menyebutnya belum ditetapkan dan bukan mengisinya dengan perkiraan.",
    lead: true,
  },
  {
    id: "reason-lansia",
    title: "Pendampingan jamaah lansia dibahas sejak konsultasi.",
    description:
      "Kebutuhan mobilitas, susunan kamar, dan ritme kegiatan dipetakan sebelum berkas masuk.",
    lead: false,
  },
  {
    id: "reason-dokumen",
    title: "Berkas diperiksa sebelum diajukan.",
    description:
      "Ketidakcocokan data ditemukan di meja pemeriksaan, bukan di loket saat sudah mendesak.",
    lead: false,
  },
  {
    id: "reason-manasik",
    title: "Manasik diadakan sebelum keberangkatan.",
    description:
      "Rangkaian ibadah dan urutan kegiatan di lapangan sudah dipahami sebelum tiba di Tanah Suci.",
    lead: false,
  },
];

/**
 * Team and testimonial data stay empty until the business supplies verified
 * entries. The UI removes the sections entirely while these are empty, which
 * is why there is no placeholder card anywhere on the site.
 */
export const teamMembers: TeamMember[] = [];

export const testimonials: Testimonial[] = [];

/**
 * Photo slots. A slot with a photo renders as that photo; a slot without one
 * shows what belongs there and why it is empty, so the page is never padded
 * with stock imagery that would misrepresent the trips.
 */
export interface GallerySlot {
  id: string;
  label: string;
  description: string;
  /** Path inside public/, or a full URL. See PANDUAN-ASET.md. */
  photo: string | null;
}

export const gallerySlots: GallerySlot[] = [
  {
    id: "gal-manasik",
    label: "Manasik",
    description: "Kegiatan pembekalan sebelum keberangkatan bersama pembimbing.",
    photo: null,
  },
  {
    id: "gal-keberangkatan",
    label: "Keberangkatan",
    description: "Pertemuan di titik kumpul dan proses keberangkatan rombongan.",
    photo: null,
  },
  {
    id: "gal-haram",
    label: "Masjidil Haram dan sekitarnya",
    description: "Dokumentasi area ibadah dan jarak tempuh dari penginapan.",
    photo: null,
  },
  {
    id: "gal-nabawi",
    label: "Masjid Nabawi",
    description: "Dokumentasi area Madinah yang dipakai dalam program.",
    photo: null,
  },
  {
    id: "gal-hotel",
    label: "Penginapan",
    description: "Kamar, ruang makan, dan fasilitas yang benar-benar dipakai jamaah.",
    photo: null,
  },
  {
    id: "gal-transportasi",
    label: "Transportasi",
    description: "Kendaraan rombongan dan perpindahan antar kota.",
    photo: null,
  },
];

/** Panduan categories the team has not written yet. Listed, not faked. */
export const pendingGuideTopics: string[] = [
  "Persiapan",
  "Hotel",
  "Transportasi",
  "Tips perjalanan",
];

/** Fields the Haji page must have from official sources before it can say anything. */
export const hajiPendingFields = [
  "Informasi program Haji",
  "Status izin resmi penyelenggara",
  "Data badan penyelenggara",
  "Ketentuan dan skema pembayaran program",
];

export const hajiVerificationSteps = [
  "Cek nomor izin penyelenggara pada daftar resmi yang diterbitkan pemerintah, bukan pada materi promosi.",
  "Pastikan nama badan usaha dan nomor izin yang tercantum sama dengan yang ada di dokumen penawaran.",
  "Minta rincian tertulis berisi fasilitas, biaya, dan hal yang tidak termasuk sebelum membayar.",
  "Gunakan rekening atas nama badan usaha resmi, dan simpan bukti pembayaran.",
  "Hubungi kanal resmi yang tercantum di situs untuk memastikan nomor dan email benar.",
];
