import { both, t, tList } from "../i18n/types";
import type { Localized } from "../i18n/types";
import type {
  AboutContent,
  GallerySlot,
  HomepageSettings,
  JourneyStep,
  NavigationSettings,
  ReasonItem,
  TeamMember,
  Testimonial,
} from "./types";

/**
 * The real process, taken from how the business actually runs a departure.
 * Eight steps, because collapsing it to three would hide the parts jamaah
 * most often get surprised by (document review and manasik).
 */
export const journeySteps: JourneyStep[] = [
  {
    id: "step-konsultasi",
    title: t("Konsultasi", "Consultation"),
    description: t(
      "Kamu menyampaikan rencana keberangkatan, jumlah jamaah, dan kebutuhan khusus seperti membawa orang tua atau kebutuhan mobilitas.",
      "You set out your travel plan, how many people are travelling, and any special needs such as bringing parents or needing mobility support.",
    ),
    jamaahAction: t(
      "Siapkan perkiraan tanggal dan jumlah jamaah.",
      "Prepare an approximate date and number of pilgrims.",
    ),
  },
  {
    id: "step-program",
    title: t("Pemilihan program", "Choosing a programme"),
    description: t(
      "Tim menjelaskan perbedaan Reguler, Plus, dan Private, termasuk konsekuensinya pada durasi dan biaya.",
      "The team explains how Regular, Plus and Private differ, including what each one means for duration and cost.",
    ),
    jamaahAction: t(
      "Pilih satu program untuk dibahas lebih dalam.",
      "Pick one programme to discuss in more detail.",
    ),
  },
  {
    id: "step-pendaftaran",
    title: t("Pendaftaran", "Registration"),
    description: t(
      "Berkas dan pembayaran awal diverifikasi terhadap ketentuan program, lalu kursi dicatat atas namamu.",
      "Documents and the initial payment are checked against the programme terms, then your seat is recorded under your name.",
    ),
    jamaahAction: t(
      "Lengkapi berkas dan lakukan pembayaran awal setelah rinciannya disetujui.",
      "Complete the documents and make the initial payment once the details are agreed.",
    ),
  },
  {
    id: "step-dokumen",
    title: t("Persiapan dokumen", "Document preparation"),
    description: t(
      "Tim memeriksa kelengkapan dan konsistensi data sebelum berkas diajukan ke pihak yang berwenang.",
      "The team checks that the paperwork is complete and consistent before it is submitted to the authorities.",
    ),
    jamaahAction: t(
      "Kirim berkas sesuai format yang diminta dan perbaiki bagian yang belum konsisten.",
      "Send the documents in the requested format and correct anything that does not match.",
    ),
  },
  {
    id: "step-manasik",
    title: t("Manasik", "Manasik briefing"),
    description: t(
      "Rangkaian ibadah dan urutan kegiatan di lapangan dibahas bersama pembimbing sebelum keberangkatan.",
      "The worship sequence and the order of events on the ground are covered with the guide before departure.",
    ),
    jamaahAction: t(
      "Ikuti manasik dan catat pertanyaan yang belum terjawab.",
      "Attend the briefing and note down any question that is still unanswered.",
    ),
  },
  {
    id: "step-keberangkatan",
    title: t("Keberangkatan", "Departure"),
    description: t(
      "Pertemuan di titik kumpul, pembagian dokumen perjalanan, dan pendampingan sejak dari bandara asal.",
      "Meeting at the assembly point, handing out travel documents, and support from the departure airport onwards.",
    ),
    jamaahAction: t(
      "Ikuti instruksi titik kumpul dan simpan dokumen di tempat yang mudah dijangkau.",
      "Follow the assembly point instructions and keep your documents within easy reach.",
    ),
  },
  {
    id: "step-pendampingan",
    title: t("Pendampingan", "Support on the ground"),
    description: t(
      "Pembimbing mendampingi kegiatan ibadah dan kebutuhan harian selama di Tanah Suci.",
      "The guide stays with the group through worship activities and daily needs while in the holy land.",
    ),
    jamaahAction: t(
      "Sampaikan kebutuhan mendesak ke pembimbing, bukan ke pihak di luar rombongan.",
      "Raise urgent needs with the guide, not with anyone outside the group.",
    ),
  },
  {
    id: "step-kepulangan",
    title: t("Kepulangan", "Return"),
    description: t(
      "Kepulangan diatur mengikuti jadwal penerbangan, termasuk pengembalian dokumen bila dititipkan ke tim.",
      "The return follows the flight schedule, including handing documents back if they were kept by the team.",
    ),
    jamaahAction: t(
      "Periksa dokumen dan barang bawaan sebelum meninggalkan penginapan.",
      "Check your documents and belongings before leaving the accommodation.",
    ),
  },
];

export const reasons: ReasonItem[] = [
  {
    id: "reason-informasi",
    title: t(
      "Informasi keberangkatan dijelaskan sebelum pendaftaran.",
      "Departure information is explained before registration.",
    ),
    description: t(
      "Harga, fasilitas, dan hal yang tidak termasuk disampaikan lebih dulu, bukan setelah pembayaran. Kalau sebuah rincian belum ditetapkan, kami menyebutnya belum ditetapkan dan bukan mengisinya dengan perkiraan.",
      "Prices, facilities and what is not included are set out first, not after payment. Where a detail is not settled yet, we say so instead of filling the gap with an estimate.",
    ),
    lead: true,
  },
  {
    id: "reason-lansia",
    title: t(
      "Pendampingan jamaah lansia dibahas sejak konsultasi.",
      "Support for elderly pilgrims is discussed from the first conversation.",
    ),
    description: t(
      "Kebutuhan mobilitas, susunan kamar, dan ritme kegiatan dipetakan sebelum berkas masuk.",
      "Mobility needs, room arrangements and the daily pace are mapped out before documents are submitted.",
    ),
    lead: false,
  },
  {
    id: "reason-dokumen",
    title: t(
      "Berkas diperiksa sebelum diajukan.",
      "Paperwork is checked before it is submitted.",
    ),
    description: t(
      "Ketidakcocokan data ditemukan di meja pemeriksaan, bukan di loket saat sudah mendesak.",
      "Mismatched data is found at the review desk, not at a counter when it has already become urgent.",
    ),
    lead: false,
  },
  {
    id: "reason-manasik",
    title: t(
      "Manasik diadakan sebelum keberangkatan.",
      "Manasik briefing is held before departure.",
    ),
    description: t(
      "Rangkaian ibadah dan urutan kegiatan di lapangan sudah dipahami sebelum tiba di Tanah Suci.",
      "The worship sequence and the order of events on the ground are understood before arriving in the holy land.",
    ),
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

export const gallerySlots: GallerySlot[] = [
  {
    id: "gal-manasik",
    label: t("Manasik", "Manasik briefing"),
    description: t(
      "Kegiatan pembekalan sebelum keberangkatan bersama pembimbing.",
      "Preparation sessions held with the guide before departure.",
    ),
    photo: null,
  },
  {
    id: "gal-keberangkatan",
    label: t("Keberangkatan", "Departure"),
    description: t(
      "Pertemuan di titik kumpul dan proses keberangkatan rombongan.",
      "Meeting at the assembly point and the group's departure process.",
    ),
    photo: null,
  },
  {
    id: "gal-haram",
    label: t("Masjidil Haram dan sekitarnya", "Masjidil Haram and its surroundings"),
    description: t(
      "Dokumentasi area ibadah dan jarak tempuh dari penginapan.",
      "Documentation of the worship area and the walking distance from the accommodation.",
    ),
    photo: null,
  },
  {
    id: "gal-nabawi",
    label: both("Masjid Nabawi"),
    description: t(
      "Dokumentasi area Madinah yang dipakai dalam program.",
      "Documentation of the Madinah area used by the programme.",
    ),
    photo: null,
  },
  {
    id: "gal-hotel",
    label: t("Penginapan", "Accommodation"),
    description: t(
      "Kamar, ruang makan, dan fasilitas yang benar-benar dipakai jamaah.",
      "Rooms, dining area and the facilities pilgrims actually use.",
    ),
    photo: null,
  },
  {
    id: "gal-transportasi",
    label: t("Transportasi", "Transport"),
    description: t(
      "Kendaraan rombongan dan perpindahan antar kota.",
      "Group vehicles and travel between cities.",
    ),
    photo: null,
  },
];

/**
 * Homepage composition. Every section starts visible; switching one off keeps
 * its content, so an admin can hide "Jadwal" for a season and bring it back
 * without retyping anything.
 */
export const homepageSettings: HomepageSettings = {
  hiddenSections: [],
  featuredPackageSlugs: [],
  showPromoBanner: true,
};

/**
 * Navigation. Nothing is hidden by default, so an entry vanishes only when the
 * admin removes it on purpose.
 */
export const navigationSettings: NavigationSettings = {
  hidden: [],
};

/**
 * About page copy. It lives in the content layer rather than in the page so the
 * text and the arguments it makes can be revised without a deploy.
 */
export const aboutContent: AboutContent = {
  intro: t(
    "Penyelenggara perjalanan Umrah dan Haji untuk jamaah Indonesia. Kami menyiapkan program, memeriksa dokumen, dan mendampingi jamaah dari konsultasi sampai kembali.",
    "An Umrah and Hajj travel organiser for Indonesian pilgrims. We put the programmes together, check documents, and stay with pilgrims from the first consultation until they are home.",
  ),
  howIntro: t(
    "Rihlah mengerjakan empat hal: menyusun program perjalanan, membantu penyiapan dokumen, menyelenggarakan manasik, dan mendampingi jamaah selama perjalanan.",
    "Rihlah does four things: builds the travel programme, helps prepare documents, runs the manasik briefing, and supports pilgrims throughout the trip.",
  ),
  programsBody: t(
    "Program tersedia dalam tiga bentuk. Reguler berjalan pada tanggal yang sudah ditetapkan, Plus menambahkan kunjungan di luar Makkah dan Madinah, dan Private disusun mengikuti permintaan rombongan.",
    "Programmes come in three forms. Regular runs on dates that are already set, Plus adds a visit outside Makkah and Madinah, and Private is arranged around what the group asks for.",
  ),
  consultationBody: t(
    "Konsultasi berjalan online, sehingga Anda bisa memulai dari kota mana pun. Kunjungan ke kantor dilakukan dengan janji temu, bukan tanpa perjanjian.",
    "Consultations happen online, so you can start from any city. Office visits are by appointment rather than without one.",
  ),
  commitments: [
    {
      id: "amanah",
      title: t("Menulis apa adanya", "We write things as they are"),
      body: t(
        "Kalau harga, jadwal, atau hotel belum ditetapkan, kami menuliskannya belum ditetapkan. Halaman paket tidak diisi angka sementara hanya supaya terlihat lengkap.",
        "If a price, date or hotel is not settled, we write that it is not settled. Package pages are not padded with provisional figures just to look complete.",
      ),
    },
    {
      id: "tenang",
      title: t(
        "Menjelaskan sebelum meminta keputusan",
        "We explain before asking for a decision",
      ),
      body: t(
        "Rincian fasilitas, biaya, dan hal yang tidak termasuk disampaikan sebelum pendaftaran, bukan sesudahnya.",
        "Facilities, costs and what is not included are set out before registration, not after it.",
      ),
    },
    {
      id: "manusiawi",
      title: t("Membahas ritme, bukan hanya rute", "We discuss pace, not only the route"),
      body: t(
        "Kebutuhan jamaah lansia, keluarga dengan anak, dan jamaah yang baru pertama kali berangkat dibicarakan sejak konsultasi.",
        "The needs of elderly pilgrims, families with children, and first-time pilgrims are raised from the first conversation.",
      ),
    },
    {
      id: "rapi",
      title: t("Merapikan berkas lebih dulu", "We tidy the paperwork first"),
      body: t(
        "Ketidakcocokan data ditemukan di meja pemeriksaan tim, bukan di loket saat waktunya sudah mendesak.",
        "Mismatched data is found at our review desk, not at a counter when time is already short.",
      ),
    },
  ],
  scopeLimits: tList(
    [
      "Persetujuan visa ditentukan oleh kedutaan, konsulat, atau otoritas imigrasi, bukan oleh kami.",
      "Kondisi cuaca dan suhu di Tanah Suci berada di luar kendali penyelenggara.",
      "Jadwal penerbangan dapat berubah karena kebijakan maskapai atau otoritas bandara.",
    ],
    [
      "Visa approval is decided by the embassy, consulate or immigration authorities, not by us.",
      "Weather and temperatures in the holy land are outside the organiser's control.",
      "Flight schedules can change because of airline policy or airport authority decisions.",
    ],
  ),
};

/** Panduan categories the team has not written yet. Listed, not faked. */
export const pendingGuideTopics: Localized<string>[] = [
  t("Persiapan", "Preparation"),
  t("Hotel", "Hotels"),
  t("Transportasi", "Transport"),
  t("Tips perjalanan", "Travel tips"),
];

/** Fields the Haji page must have from official sources before it can say anything. */
export const hajiPendingFields: Localized<string[]> = tList(
  [
    "Informasi program Haji",
    "Status izin resmi penyelenggara",
    "Data badan penyelenggara",
    "Ketentuan dan skema pembayaran program",
  ],
  [
    "Hajj programme information",
    "Official licence status of the organiser",
    "Organiser registration data",
    "Programme terms and payment scheme",
  ],
);

export const hajiVerificationSteps: Localized<string[]> = tList(
  [
    "Cek nomor izin penyelenggara pada daftar resmi yang diterbitkan pemerintah, bukan pada materi promosi.",
    "Pastikan nama badan usaha dan nomor izin yang tercantum sama dengan yang ada di dokumen penawaran.",
    "Minta rincian tertulis berisi fasilitas, biaya, dan hal yang tidak termasuk sebelum membayar.",
    "Gunakan rekening atas nama badan usaha resmi, dan simpan bukti pembayaran.",
    "Hubungi kanal resmi yang tercantum di situs untuk memastikan nomor dan email benar.",
  ],
  [
    "Check the organiser's licence number against the official government list, not against promotional material.",
    "Make sure the business name and licence number match what appears in the offer documents.",
    "Ask for written details covering the facilities, the cost, and what is not included before paying.",
    "Use a bank account held in the official business name, and keep the payment receipt.",
    "Contact the official channels listed on this site to confirm the number and email address are genuine.",
  ],
);
