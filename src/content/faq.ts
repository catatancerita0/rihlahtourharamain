import type { FaqItem } from "./types";

/**
 * FAQ answers state what is actually known and where the rest is documented.
 * Nothing here invents a policy, a price, or a deadline: where a rule lives in
 * the terms page, the answer points there instead of paraphrasing it badly.
 */
export const faqs: FaqItem[] = [
  {
    id: "faq-pendaftaran",
    category: "Pendaftaran",
    order: 1,
    question: "Berapa lama proses pendaftaran?",
    answer:
      "Prosesnya berjalan bertahap: konsultasi, pemilihan program, lalu pendaftaran. Setelah berkas dan pembayaran awal diterima, tim menyiapkan dokumen perjalanan. Lama setiap tahap bergantung pada kelengkapan berkas dan tanggal keberangkatan yang dipilih, jadi tim menyampaikan perkiraan waktunya saat kamu mendaftar.",
  },
  {
    id: "faq-dokumen",
    category: "Dokumen",
    order: 2,
    question: "Dokumen apa yang diperlukan?",
    answer:
      "Umumnya paspor, kartu identitas, kartu keluarga, akta kelahiran, buku nikah bila sudah menikah, foto, dan buku vaksin bila diminta. Daftar final bergantung pada program dan ketentuan yang berlaku saat keberangkatan, jadi tim mengonfirmasi daftar lengkap sebelum berkas diajukan.",
  },
  {
    id: "faq-tiket",
    category: "Biaya",
    order: 3,
    question: "Apakah tiket pesawat termasuk?",
    answer:
      "Tergantung program yang dipilih. Setiap halaman paket punya bagian fasilitas yang termasuk dan yang tidak termasuk. Kalau belum tercantum di sana, artinya rinciannya belum ditetapkan untuk keberangkatan tersebut, dan kamu bisa menanyakannya lebih dulu sebelum membandingkan harga.",
  },
  {
    id: "faq-pembayaran",
    category: "Pembayaran",
    order: 4,
    question: "Bagaimana sistem pembayaran?",
    answer:
      "Besaran pembayaran awal dan jadwal pelunasan ditetapkan per program, dan rinciannya diberikan bersama penawaran sebelum kamu melakukan pembayaran apa pun. Kami tidak meminta pembayaran ke rekening yang tidak tercantum di kanal resmi.",
  },
  {
    id: "faq-manasik",
    category: "Manasik",
    order: 5,
    question: "Bagaimana proses manasik?",
    answer:
      "Manasik membahas rangkaian ibadah, urutan kegiatan di lapangan, dan hal praktis seperti titik kumpul serta cara menghubungi pendamping. Jadwalnya ditetapkan menjelang keberangkatan, jadi tanggalnya diinformasikan setelah kamu terdaftar pada program tersebut.",
  },
  {
    id: "faq-pembatalan",
    category: "Pembatalan",
    order: 6,
    question: "Bagaimana kebijakan pembatalan?",
    answer:
      "Ketentuan pembatalan dan perubahan jadwal diatur di halaman syarat dan ketentuan serta halaman pembatalan dan refund. Baca keduanya sebelum mendaftar, lalu konfirmasi ke tim kalau ada bagian yang belum jelas untuk program pilihanmu.",
  },
  {
    id: "faq-lansia",
    category: "Pendampingan",
    order: 7,
    question: "Bagaimana pendampingan untuk jamaah lansia?",
    answer:
      "Sampaikan sejak konsultasi bahwa kamu berangkat bersama orang tua. Informasi itu dipakai untuk membahas susunan kamar, ritme kegiatan, kebutuhan mobilitas, dan bentuk pendampingan di lapangan. Kebutuhan khusus yang diketahui lebih awal lebih mudah disiapkan.",
  },
  {
    id: "faq-jadwal-berubah",
    category: "Keberangkatan",
    order: 8,
    question: "Apakah jadwal keberangkatan bisa berubah?",
    answer:
      "Jadwal yang sudah dipublikasikan dapat berubah karena ketersediaan penerbangan, ketentuan otoritas, atau kondisi lain di luar kendali penyelenggara. Perubahan diinformasikan ke jamaah yang sudah terdaftar, dan ketentuannya diatur dalam syarat dan ketentuan.",
  },
  {
    id: "faq-harga-final",
    category: "Biaya",
    order: 9,
    question: "Apakah harga sudah final saat konsultasi?",
    answer:
      "Harga pada halaman paket mengikuti data yang sudah dipublikasikan. Kalau harga atau jadwal belum tercantum, artinya belum ditetapkan untuk keberangkatan itu. Tim memberikan penawaran tertulis sebelum pendaftaran, dan itulah angka yang dipakai.",
  },
  {
    id: "faq-kanal-resmi",
    category: "Keamanan",
    order: 10,
    question: "Bagaimana memastikan saya berkomunikasi dengan kanal resmi?",
    answer:
      "Gunakan nomor, email, dan alamat yang tercantum di halaman kontak dan halaman legalitas. Kalau ada pihak yang mengatasnamakan Rihlah dengan nomor atau rekening yang berbeda, konfirmasi lebih dulu lewat kanal resmi sebelum mengirim dokumen atau dana.",
  },
];

export const faqCategories = Array.from(new Set(faqs.map((item) => item.category)));

/** Program pages reuse the general answers plus the ones tagged for them. */
export function faqsForCategory(category: string): FaqItem[] {
  return faqs.filter((item) => item.category === category);
}
