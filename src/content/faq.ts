import { t } from "../i18n/types";
import type { Lang } from "../i18n/types";
import type { FaqItem } from "./types";

/**
 * FAQ answers state what is actually known and where the rest is documented.
 * Nothing here invents a policy, a price, or a deadline: where a rule lives in
 * the terms page, the answer points there instead of paraphrasing it badly.
 */
export const faqs: FaqItem[] = [
  {
    id: "faq-pendaftaran",
    category: t("Pendaftaran", "Registration"),
    order: 1,
    question: t("Berapa lama proses pendaftaran?", "How long does registration take?"),
    answer: t(
      "Prosesnya berjalan bertahap: konsultasi, pemilihan program, lalu pendaftaran. Setelah berkas dan pembayaran awal diterima, tim menyiapkan dokumen perjalanan. Lama setiap tahap bergantung pada kelengkapan berkas dan tanggal keberangkatan yang dipilih, jadi tim menyampaikan perkiraan waktunya saat kamu mendaftar.",
      "It runs in stages: consultation, choosing a programme, then registration. Once your documents and initial payment are received, the team prepares the travel documents. How long each stage takes depends on how complete your paperwork is and which departure date you choose, so the team gives you an estimate when you register.",
    ),
  },
  {
    id: "faq-dokumen",
    category: t("Dokumen", "Documents"),
    order: 2,
    question: t("Dokumen apa yang diperlukan?", "Which documents are required?"),
    answer: t(
      "Umumnya paspor, kartu identitas, kartu keluarga, akta kelahiran, buku nikah bila sudah menikah, foto, dan buku vaksin bila diminta. Daftar final bergantung pada program dan ketentuan yang berlaku saat keberangkatan, jadi tim mengonfirmasi daftar lengkap sebelum berkas diajukan.",
      "Usually a passport, identity card, family card, birth certificate, marriage certificate if you are married, photographs, and a vaccination record if one is requested. The final list depends on the programme and the rules in force at departure, so the team confirms the complete list before the paperwork is submitted.",
    ),
  },
  {
    id: "faq-tiket",
    category: t("Biaya", "Cost"),
    order: 3,
    question: t("Apakah tiket pesawat termasuk?", "Is the air ticket included?"),
    answer: t(
      "Tergantung program yang dipilih. Setiap halaman paket punya bagian fasilitas yang termasuk dan yang tidak termasuk. Kalau belum tercantum di sana, artinya rinciannya belum ditetapkan untuk keberangkatan tersebut, dan kamu bisa menanyakannya lebih dulu sebelum membandingkan harga.",
      "It depends on the programme you choose. Each package page has a section listing what is included and what is not. If it is not listed there, the detail has not been set for that departure, and you can ask about it before comparing prices.",
    ),
  },
  {
    id: "faq-pembayaran",
    category: t("Pembayaran", "Payment"),
    order: 4,
    question: t("Bagaimana sistem pembayaran?", "How do payments work?"),
    answer: t(
      "Besaran pembayaran awal dan jadwal pelunasan ditetapkan per program, dan rinciannya diberikan bersama penawaran sebelum kamu melakukan pembayaran apa pun. Kami tidak meminta pembayaran ke rekening yang tidak tercantum di kanal resmi.",
      "The initial payment and the settlement schedule are set per programme, and the details come with the offer before you pay anything. We never ask for payment to an account that is not listed on our official channels.",
    ),
  },
  {
    id: "faq-manasik",
    category: t("Manasik", "Manasik"),
    order: 5,
    question: t("Bagaimana proses manasik?", "How does the manasik briefing work?"),
    answer: t(
      "Manasik membahas rangkaian ibadah, urutan kegiatan di lapangan, dan hal praktis seperti titik kumpul serta cara menghubungi pendamping. Jadwalnya ditetapkan menjelang keberangkatan, jadi tanggalnya diinformasikan setelah kamu terdaftar pada program tersebut.",
      "The briefing covers the worship sequence, the order of events on the ground, and practical matters such as assembly points and how to reach your group guide. Its date is set close to departure, so you are told once you are registered on that programme.",
    ),
  },
  {
    id: "faq-pembatalan",
    category: t("Pembatalan", "Cancellation"),
    order: 6,
    question: t("Bagaimana kebijakan pembatalan?", "What is the cancellation policy?"),
    answer: t(
      "Ketentuan pembatalan dan perubahan jadwal diatur di halaman syarat dan ketentuan serta halaman pembatalan dan refund. Baca keduanya sebelum mendaftar, lalu konfirmasi ke tim kalau ada bagian yang belum jelas untuk program pilihanmu.",
      "Cancellation and schedule change terms are set out on the terms and conditions page and the cancellation and refund page. Read both before registering, then confirm with the team if anything is unclear for the programme you are considering.",
    ),
  },
  {
    id: "faq-lansia",
    category: t("Pendampingan", "Support"),
    order: 7,
    question: t(
      "Bagaimana pendampingan untuk jamaah lansia?",
      "How are elderly pilgrims supported?",
    ),
    answer: t(
      "Sampaikan sejak konsultasi bahwa kamu berangkat bersama orang tua. Informasi itu dipakai untuk membahas susunan kamar, ritme kegiatan, kebutuhan mobilitas, dan bentuk pendampingan di lapangan. Kebutuhan khusus yang diketahui lebih awal lebih mudah disiapkan.",
      "Tell us during the consultation that you are travelling with your parents. That information is used to discuss room arrangements, the daily pace, mobility needs and the kind of support provided on the ground. Special needs that are known early are easier to prepare for.",
    ),
  },
  {
    id: "faq-jadwal-berubah",
    category: t("Keberangkatan", "Departure"),
    order: 8,
    question: t(
      "Apakah jadwal keberangkatan bisa berubah?",
      "Can departure dates change?",
    ),
    answer: t(
      "Jadwal yang sudah dipublikasikan dapat berubah karena ketersediaan penerbangan, ketentuan otoritas, atau kondisi lain di luar kendali penyelenggara. Perubahan diinformasikan ke jamaah yang sudah terdaftar, dan ketentuannya diatur dalam syarat dan ketentuan.",
      "A published schedule can change because of flight availability, rules set by the authorities, or other conditions outside the organiser's control. Changes are passed on to pilgrims who have registered, and the terms for them are set out in the terms and conditions.",
    ),
  },
  {
    id: "faq-harga-final",
    category: t("Biaya", "Cost"),
    order: 9,
    question: t(
      "Apakah harga sudah final saat konsultasi?",
      "Is the price final at consultation?",
    ),
    answer: t(
      "Harga pada halaman paket mengikuti data yang sudah dipublikasikan. Kalau harga atau jadwal belum tercantum, artinya belum ditetapkan untuk keberangkatan itu. Tim memberikan penawaran tertulis sebelum pendaftaran, dan itulah angka yang dipakai.",
      "The price shown on a package page follows the data that has been published. If a price or date is not listed, it has not been set for that departure. The team gives you a written offer before registration, and that is the figure that applies.",
    ),
  },
  {
    id: "faq-kanal-resmi",
    category: t("Keamanan", "Safety"),
    order: 10,
    question: t(
      "Bagaimana memastikan saya berkomunikasi dengan kanal resmi?",
      "How do I make sure I am dealing with an official channel?",
    ),
    answer: t(
      "Gunakan nomor, email, dan alamat yang tercantum di halaman kontak dan halaman legalitas. Kalau ada pihak yang mengatasnamakan Rihlah dengan nomor atau rekening yang berbeda, konfirmasi lebih dulu lewat kanal resmi sebelum mengirim dokumen atau dana.",
      "Use the number, email address and street address listed on the contact page and the licensing page. If anyone claims to represent Rihlah with a different number or bank account, confirm through the official channels before sending documents or money.",
    ),
  },
];

/**
 * Labels stay in the order the answers are written rather than sorted, so the
 * filter reads the way the page reads. Grouping is done on the label itself,
 * which is why the labels have to be translated rather than numbered.
 */
export function faqCategoriesFor(items: FaqItem[], lang: Lang): string[] {
  return Array.from(new Set(items.map((item) => item.category[lang])));
}

export function faqsForLabel(items: FaqItem[], label: string, lang: Lang): FaqItem[] {
  return items.filter((item) => item.category[lang] === label);
}
