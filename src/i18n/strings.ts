import type { Localized } from "./types";

/**
 * Text that appears in more than one place lives here so the same phrase cannot
 * drift between the header, the footer and a page body. Copy that belongs to a
 * single screen stays next to that screen instead.
 */
/**
 * States for a photo that is missing on purpose. Exported separately as well,
 * because the media primitive is used by pages that need only this text.
 */
const idMedia = {
  slotLabel: "Slot foto",
  slotNote: "Foto asli untuk bagian ini belum diunggah.",
  fileMissing: "Berkas foto tidak ditemukan",
  fileMissingNote:
    "Berkas yang dirujuk belum ada di folder publik, jadi bagian ini dibiarkan kosong alih-alih menampilkan gambar rusak.",
};

const enMedia: typeof idMedia = {
  slotLabel: "Photo slot",
  slotNote: "No original photo has been uploaded for this part yet.",
  fileMissing: "Photo file not found",
  fileMissingNote:
    "The referenced file is not in the public folder yet, so this is left empty instead of showing a broken image.",
};

export const mediaCopy: Localized<typeof idMedia> = { id: idMedia, en: enMedia };

const idCopy = {
  skipToContent: "Lewati ke konten utama",

  language: {
    label: "Bahasa",
    groupLabel: "Bahasa situs",
    switchPrefix: "Tampilkan dalam",
  },

  nav: {
    home: "Beranda",
    umrah: "Paket Umrah",
    haji: "Paket Haji",
    schedule: "Jadwal",
    about: "Tentang Kami",
    guide: "Panduan Jamaah",
    faq: "FAQ",
    main: "Navigasi utama",
    mainMobile: "Navigasi utama versi seluler",
    backHome: "kembali ke beranda",
    menu: "Menu",
    close: "Tutup",
  },

  cta: {
    consult: "Konsultasi Umrah",
    consultPlan: "Konsultasikan Rencana Umrah",
    consultPackage: "Konsultasikan Paket Ini",
    viewPackages: "Lihat Paket Umrah",
    viewSchedule: "Lihat Jadwal Keberangkatan",
    viewDetail: "Lihat Detail Paket",
    viewHaji: "Lihat Program Haji",
    contact: "Hubungi Tim",
    readGuide: "Baca Panduan",
    allPackages: "Lihat Semua Paket",
  },

  state: {
    pending: "Belum ditetapkan",
    pendingShort: "Belum diisi",
    loading: "Memuat data keberangkatan...",
    errorTitle: "Jadwal belum dapat dimuat.",
    errorBody: "Coba lagi sebentar lagi. Kalau masih gagal, hubungi tim lewat halaman kontak.",
    retry: "Coba lagi",
  },

  media: idMedia,

  availability: {
    available: {
      label: "Tersedia",
      description: "Masih dapat dipesan.",
    },
    limited: {
      label: "Seat terbatas",
      description: "Sisa kursi sedikit pada program ini.",
    },
    full: {
      label: "Penuh",
      description: "Kursi pada program ini sudah terisi.",
    },
    unknown: {
      label: "Belum dibuka",
      description: "Status ketersediaan belum ditetapkan.",
    },
  },

  // A promotion is always shown with the date it ends, so nobody has to ask
  // whether an offer is still running.
  promo: {
    label: "Promo",
    bannerLabel: "Promo berjalan",
    until: (date: string) => `Berlaku sampai ${date}`,
    expiresToday: "Berlaku sampai hari ini",
    dismiss: "Tutup pengumuman promo",
    siteWide: "Berlaku untuk semua program",
  },

  footer: {
    explore: "Jelajahi",
    legal: "Legal",
    footerNav: "Navigasi footer",
    legalNav: "Informasi legal",
    packages: "Paket",
    schedule: "Jadwal",
    about: "Tentang Kami",
    guide: "Panduan",
    gallery: "Galeri",
    faq: "FAQ",
    privacy: "Kebijakan Privasi",
    terms: "Syarat & Ketentuan",
    cancellation: "Pembatalan & Refund",
    licensing: "Legalitas",
    whatsappLabel: "Nomor WhatsApp",
    emailLabel: "Email resmi",
    addressLabel: "Alamat kantor",
    hoursLabel: "Jam layanan",
    businessNameLabel: "Nama badan usaha",
    nibMissing: "NIB belum diisi",
    nibPrefix: "NIB",
    socialNone: "Akun media sosial resmi belum ditautkan ke situs ini.",
    socialOfficial: "Akun resmi:",
    legalNote: "Data legalitas lengkap ada di halaman berikut:",
    admin: "Panel admin",
  },
};

export const chrome: Localized<typeof idCopy> = {
  id: idCopy,
  en: {
    skipToContent: "Skip to main content",

    language: {
      label: "Language",
      groupLabel: "Site language",
      switchPrefix: "Show in",
    },

    nav: {
      home: "Home",
      umrah: "Umrah Packages",
      haji: "Hajj Packages",
      schedule: "Schedule",
      about: "About Us",
      guide: "Pilgrim Guides",
      faq: "FAQ",
      main: "Main navigation",
      mainMobile: "Main navigation, mobile",
      backHome: "back to home",
      menu: "Menu",
      close: "Close",
    },

    cta: {
      consult: "Ask about Umrah",
      consultPlan: "Talk through your Umrah plan",
      consultPackage: "Ask about this package",
      viewPackages: "See Umrah packages",
      viewSchedule: "See departure dates",
      viewDetail: "See package details",
      viewHaji: "See the Hajj programme",
      contact: "Contact the team",
      readGuide: "Read the guide",
      allPackages: "See all packages",
    },

    state: {
      pending: "Not set yet",
      pendingShort: "Not filled in yet",
      loading: "Loading departure data...",
      errorTitle: "Departure data could not be loaded.",
      errorBody: "Try again in a moment. If it keeps failing, reach the team on the contact page.",
      retry: "Try again",
    },

    media: enMedia,

    availability: {
      available: {
        label: "Available",
        description: "Seats can still be booked.",
      },
      limited: {
        label: "Few seats left",
        description: "Only a few seats remain on this programme.",
      },
      full: {
        label: "Full",
        description: "Every seat on this programme is taken.",
      },
    unknown: {
      label: "Not open yet",
      description: "The seat status has not been set.",
    },
  },

  promo: {
    label: "Promo",
    bannerLabel: "Current promotion",
    until: (date: string) => `Valid until ${date}`,
    expiresToday: "Valid until today",
    dismiss: "Dismiss the promotion announcement",
    siteWide: "Applies to every programme",
  },

  footer: {
      explore: "Explore",
      legal: "Legal",
      footerNav: "Footer navigation",
      legalNav: "Legal information",
      packages: "Packages",
      schedule: "Schedule",
      about: "About Us",
      guide: "Guides",
      gallery: "Gallery",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      cancellation: "Cancellation & Refund",
      licensing: "Licensing",
      whatsappLabel: "WhatsApp number",
      emailLabel: "Official email",
      addressLabel: "Office address",
      hoursLabel: "Service hours",
      businessNameLabel: "Registered business name",
      nibMissing: "business ID not filled in yet",
      nibPrefix: "Business ID",
      socialNone: "No official social accounts are linked from this site yet.",
      socialOfficial: "Official accounts:",
      legalNote: "The complete licensing details are on this page:",
      admin: "Admin panel",
    },
  },
};

export type ChromeCopy = typeof idCopy;
