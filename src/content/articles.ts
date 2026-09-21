import { t } from "../i18n/types";
import type { Lang, Localized } from "../i18n/types";
import type { Article, ArticleBlock } from "./types";

/**
 * Panduan jamaah.
 *
 * These articles cover preparation and process, which stays useful regardless
 * of the departure chosen. They deliberately avoid religious rulings and
 * program-specific figures: religious guidance comes from the pembimbing, and
 * figures come from a published package. `publishedAt` stays null until the
 * business sets a real date, and the UI hides the date rather than guessing.
 */
export const articles: Article[] = [
  {
    id: "art-dokumen",
    slug: "dokumen-umrah-yang-bisa-disiapkan-lebih-awal",
    title: t(
      "Dokumen Umrah yang bisa disiapkan lebih awal",
      "Umrah documents you can prepare earlier",
    ),
    category: t("Dokumen", "Documents"),
    excerpt: t(
      "Paspor dan data keluarga sering jadi penghambat karena disiapkan di menit terakhir. Ini urutan yang membuat pendaftaran berjalan lebih cepat.",
      "Passports and family records hold things up when they are left to the last minute. This is the order that makes registration move faster.",
    ),
    thumbnail: null,
    author: t("Tim Rihlah Tour Haramain", "Rihlah Tour Haramain team"),
    publishedAt: null,
    content: {
      id: [
        {
          kind: "paragraph",
          text: "Calon jamaah biasanya baru menyiapkan dokumen setelah paket dipilih. Padahal beberapa dokumen butuh waktu paling lama, dan justru itu yang bisa dimulai sebelum tanggal keberangkatan ditetapkan.",
        },
        { kind: "heading", text: "Mulai dari paspor" },
        {
          kind: "paragraph",
          text: "Paspor paling sering menahan proses, bukan karena sulit dibuat, tapi karena masalahnya baru ketahuan saat berkas diperiksa. Periksa masa berlaku, jumlah halaman kosong, dan ejaan nama. Ejaan di paspor harus sama dengan dokumen lain yang kamu lampirkan. Perbedaan satu huruf pada nama adalah penyebab paling umum berkas dikembalikan.",
        },
        {
          kind: "list",
          items: [
            "Periksa masa berlaku paspor dan sisa halaman kosong.",
            "Cocokkan ejaan nama di paspor dengan kartu identitas dan kartu keluarga.",
            "Simpan salinan halaman biodata dalam bentuk berkas digital yang terbaca jelas.",
          ],
        },
        { kind: "heading", text: "Kumpulkan data keluarga sekali saja" },
        {
          kind: "paragraph",
          text: "Berkas perjalanan biasanya meminta data yang sudah ada di kartu keluarga. Menyiapkan satu salinan lengkap lebih cepat daripada mencari satu per satu ketika pendaftaran sudah berjalan.",
        },
        {
          kind: "list",
          items: [
            "Kartu tanda penduduk dan kartu keluarga.",
            "Akta kelahiran.",
            "Buku nikah, atau akta cerai bila statusnya sudah berubah.",
            "Foto dengan latar terang sesuai ketentuan yang diminta.",
            "Buku vaksin bila diminta pada program yang kamu pilih.",
          ],
        },
        {
          kind: "note",
          text: "Daftar yang diminta bisa berbeda antarprogram dan mengikuti ketentuan yang berlaku pada saat keberangkatan. Tim Rihlah mengonfirmasi daftar final sebelum berkas diajukan, jadi jangan memakai daftar umum ini sebagai patokan tunggal.",
        },
        { kind: "heading", text: "Kalau yang berangkat adalah orang tua" },
        {
          kind: "paragraph",
          text: "Siapkan keterangan kondisi kesehatan bila diminta, dan pastikan pendamping yang ikut tercatat sejak awal. Keduanya memengaruhi susunan kamar dan cara pendampingan di lapangan. Mengurusnya di awal jauh lebih tenang daripada mengurusnya menjelang keberangkatan.",
        },
        {
          kind: "paragraph",
          text: "Dokumen yang rapi juga punya efek lain: perhatian kamu jadi bebas untuk persiapan fisik dan manasik, dua hal yang lebih menentukan kenyamanan selama di Tanah Suci.",
        },
      ],
      en: [
        {
          kind: "paragraph",
          text: "Prospective pilgrims usually prepare documents only after choosing a package. Yet some documents take the longest, and those are exactly the ones that can be started before a departure date is even set.",
        },
        { kind: "heading", text: "Start with the passport" },
        {
          kind: "paragraph",
          text: "The passport holds the process up most often, not because it is hard to obtain but because problems only surface when the paperwork is reviewed. Check the expiry date, the number of blank pages, and the spelling of the name. The spelling in the passport has to match every other document you attach. One wrong letter in a name is the most common reason paperwork is sent back.",
        },
        {
          kind: "list",
          items: [
            "Check the passport expiry date and how many blank pages remain.",
            "Match the name spelling in the passport against your identity card and family card.",
            "Keep a scan of the biodata page as a digital file that is clearly readable.",
          ],
        },
        { kind: "heading", text: "Gather the family records once" },
        {
          kind: "paragraph",
          text: "Travel paperwork usually asks for data that already sits on the family card. Preparing one complete copy is faster than hunting for each item while registration is already under way.",
        },
        {
          kind: "list",
          items: [
            "Identity card and family card.",
            "Birth certificate.",
            "Marriage certificate, or a divorce certificate if your status has changed.",
            "Photographs on a light background in the format the form asks for.",
            "A vaccination record if the programme you choose requires one.",
          ],
        },
        {
          kind: "note",
          text: "The list can differ between programmes and follows the rules in force at the time of departure. The Rihlah team confirms the final list before the paperwork is submitted, so do not treat this general list as the only reference.",
        },
        { kind: "heading", text: "If your parents are the ones travelling" },
        {
          kind: "paragraph",
          text: "Prepare health information if it is requested, and make sure the relative accompanying them is recorded from the start. Both affect the room arrangement and the way support is provided on the ground. Sorting them out early is far calmer than sorting them out just before departure.",
        },
        {
          kind: "paragraph",
          text: "Tidy documents have another effect: your attention is free for physical preparation and the manasik briefing, the two things that shape how comfortable the trip feels in the holy land.",
        },
      ],
    },
  },
  {
    id: "art-lansia",
    slug: "mendaftarkan-jamaah-lansia-yang-perlu-dibahas",
    title: t(
      "Mendaftarkan jamaah lansia: yang perlu dibahas sebelum bayar",
      "Registering an elderly pilgrim: what to settle before paying",
    ),
    category: t("Jamaah Lansia", "Elderly pilgrims"),
    excerpt: t(
      "Membawa orang tua beribadah mengubah banyak keputusan perjalanan. Ini daftar pertanyaan yang sebaiknya dijawab lebih dulu, bukan di menit terakhir.",
      "Travelling with parents changes a lot of decisions. These are the questions worth answering early rather than at the last minute.",
    ),
    thumbnail: null,
    author: t("Tim Rihlah Tour Haramain", "Rihlah Tour Haramain team"),
    publishedAt: null,
    content: {
      id: [
        {
          kind: "paragraph",
          text: "Perjalanan ibadah menuntut banyak berjalan dan berdiri. Untuk jamaah lansia, bebannya bukan hanya soal jarak, tapi soal ritme: seberapa sering berhenti, seberapa dekat penginapan ke area ibadah, dan siapa yang mendampingi saat kondisi tidak memungkinkan mengikuti seluruh rangkaian.",
        },
        { kind: "heading", text: "Empat hal yang sebaiknya jelas sejak awal" },
        {
          kind: "list",
          items: [
            "Kondisi kesehatan terkini dan kebutuhan mobilitas, termasuk apakah akan membawa alat bantu jalan.",
            "Siapa yang mendampingi selama perjalanan, dan apakah pendamping itu satu kamar.",
            "Jarak penginapan ke area ibadah, karena ini yang paling menentukan beban harian.",
            "Ritme kegiatan, termasuk apakah ada kegiatan yang bisa dilewati tanpa mengganggu jamaah lain.",
          ],
        },
        {
          kind: "paragraph",
          text: "Poin terakhir sering diabaikan. Rombongan berjalan dengan jadwal bersama, jadi mengetahui lebih awal bahwa ada kegiatan yang tidak akan diikuti membantu tim menyiapkan pendampingan, bukan menambah beban di lapangan.",
        },
        { kind: "heading", text: "Soal kamar" },
        {
          kind: "paragraph",
          text: "Susunan kamar biasanya ditentukan oleh jenis kamar yang dipilih dan jumlah jamaah dalam satu rombongan. Kalau orang tua perlu satu kamar dengan pendamping, sampaikan saat konsultasi karena ketersediaannya bergantung pada sisa kamar di program tersebut.",
        },
        { kind: "heading", text: "Untuk keluarga yang ikut" },
        {
          kind: "paragraph",
          text: "Anggota keluarga biasanya ikut bukan untuk beribadah saja, tapi untuk memastikan orang tua nyaman. Bagi tugas dari awal, misalnya siapa yang mendampingi saat kegiatan malam dan siapa yang menangani dokumen perjalanan. Pembagian tugas yang jelas membuat rombongan keluarga lebih tenang dan lebih mudah diatur.",
        },
        {
          kind: "note",
          text: "Ketentuan dokumen dan kebutuhan keterangan kesehatan mengikuti program yang dipilih. Tim Rihlah mengonfirmasi daftar yang berlaku sebelum berkas diajukan.",
        },
      ],
      en: [
        {
          kind: "paragraph",
          text: "Worship travel demands a lot of walking and standing. For elderly pilgrims the strain is not only distance but pace: how often you stop, how close the accommodation is to the worship area, and who accompanies them when they cannot follow the whole programme.",
        },
        { kind: "heading", text: "Four things worth settling early" },
        {
          kind: "list",
          items: [
            "Current health condition and mobility needs, including whether a walking aid will be brought.",
            "Who accompanies them during the trip, and whether that person shares the room.",
            "The walking distance from the accommodation to the worship area, because that shapes the daily strain more than anything else.",
            "The daily pace, including whether an activity can be skipped without disturbing the rest of the group.",
          ],
        },
        {
          kind: "paragraph",
          text: "The last point is often overlooked. A group moves on a shared schedule, so knowing in advance that someone will not join a particular activity helps the team prepare support instead of adding strain on the ground.",
        },
        { kind: "heading", text: "About rooms" },
        {
          kind: "paragraph",
          text: "Room arrangements are usually determined by the room type chosen and how many pilgrims are in the group. If your parents need to share a room with the person accompanying them, say so during the consultation, because availability depends on the rooms left on that programme.",
        },
        { kind: "heading", text: "For the family travelling along" },
        {
          kind: "paragraph",
          text: "Family members usually come not only to worship but to make sure their parents are comfortable. Divide the tasks from the start, for example who accompanies them during evening activities and who handles the travel documents. A clear division of tasks keeps a family group calmer and easier to manage.",
        },
        {
          kind: "note",
          text: "Document requirements and any health information follow the programme you choose. The Rihlah team confirms what applies before the paperwork is submitted.",
        },
      ],
    },
  },
  {
    id: "art-manasik",
    slug: "manasik-yang-sebaiknya-dipahami-sebelum-berangkat",
    title: t(
      "Manasik: apa yang sebaiknya sudah dipahami sebelum berangkat",
      "Manasik: what you should understand before you leave",
    ),
    category: t("Manasik", "Manasik"),
    excerpt: t(
      "Manasik bukan sekadar pembekalan sebelum terbang. Kalau dipersiapkan dengan benar, ia mengubah cara kamu mengikuti rangkaian kegiatan di lapangan.",
      "The manasik briefing is more than a session before the flight. Prepared properly, it changes how you follow the programme on the ground.",
    ),
    thumbnail: null,
    author: t("Tim Rihlah Tour Haramain", "Rihlah Tour Haramain team"),
    publishedAt: null,
    content: {
      id: [
        {
          kind: "paragraph",
          text: "Manasik adalah pertemuan persiapan sebelum keberangkatan. Isinya dua hal: rangkaian ibadah yang akan dijalankan, dan hal praktis di lapangan seperti titik kumpul, waktu bergerak, serta apa yang harus dilakukan ketika terpisah dari rombongan.",
        },
        { kind: "heading", text: "Baca materi sebelum, bukan sesudah" },
        {
          kind: "paragraph",
          text: "Jamaah yang datang ke manasik setelah membaca materi lebih dulu biasanya pulang dengan lebih banyak jawaban, karena pertanyaannya sudah spesifik. Jamaah yang baru pertama kali mendengar istilahnya di ruangan cenderung sibuk mencatat dasar dan tidak sempat menanyakan hal praktis.",
        },
        { kind: "heading", text: "Tulis pertanyaan yang belum terjawab" },
        {
          kind: "paragraph",
          text: "Catat pertanyaanmu dalam satu daftar, bukan disimpan di kepala. Pertanyaan yang paling sering muncul biasanya soal urutan kegiatan saat hari keberangkatan, apa yang boleh dibawa ke area ibadah, dan bagaimana kalau kondisi badan menurun di tengah rangkaian.",
        },
        {
          kind: "list",
          items: [
            "Urutan kegiatan pada hari kedatangan dan hari keberangkatan.",
            "Apa saja yang perlu dibawa setiap kali bergerak dari penginapan.",
            "Cara menghubungi pendamping saat terpisah dari rombongan.",
            "Kegiatan yang boleh diikuti dengan ritme lebih lambat.",
          ],
        },
        { kind: "heading", text: "Latih hal praktisnya" },
        {
          kind: "paragraph",
          text: "Beberapa hal lebih mudah dipahami dengan dilatih daripada dijelaskan, misalnya urutan gerakan dan cara menjaga posisi dalam rombongan yang padat. Latihan singkat di rumah cukup untuk membuat gerakannya tidak asing saat dibutuhkan.",
        },
        {
          kind: "note",
          text: "Panduan ibadah dan tata caranya disampaikan oleh pembimbing. Halaman ini membahas persiapan dan prosesnya, bukan tuntunan ibadah.",
        },
        {
          kind: "paragraph",
          text: "Setelah manasik, yang tersisa biasanya soal fisik dan dokumen. Menyelesaikan keduanya lebih awal membuat hari keberangkatan berjalan tanpa kejutan.",
        },
      ],
      en: [
        {
          kind: "paragraph",
          text: "Manasik is the preparation meeting before departure. It covers two things: the worship sequence you will perform, and the practical side on the ground such as assembly points, movement times, and what to do if you are separated from the group.",
        },
        { kind: "heading", text: "Read the material before, not after" },
        {
          kind: "paragraph",
          text: "Pilgrims who arrive at the briefing having read the material first usually leave with more answers, because their questions are already specific. Pilgrims hearing the terms for the first time in the room tend to spend the session writing down the basics and never reach the practical questions.",
        },
        { kind: "heading", text: "Write down the questions still unanswered" },
        {
          kind: "paragraph",
          text: "Keep your questions in one list rather than in your head. The most common ones are about the order of activities on departure day, what may be carried into the worship area, and what happens if your health drops in the middle of the programme.",
        },
        {
          kind: "list",
          items: [
            "The order of activities on arrival day and departure day.",
            "What to carry each time you leave the accommodation.",
            "How to reach your guide if you are separated from the group.",
            "Which activities can be followed at a slower pace.",
          ],
        },
        { kind: "heading", text: "Practise the practical parts" },
        {
          kind: "paragraph",
          text: "Some things are easier to understand by practising than by explanation, for example the order of the movements and how to hold your position in a crowded group. A short practice at home is enough to make the movements familiar when they are needed.",
        },
        {
          kind: "note",
          text: "Guidance on worship and how to perform it comes from the guide. This page covers preparation and process, not worship instruction.",
        },
        {
          kind: "paragraph",
          text: "After the briefing, what is usually left is fitness and paperwork. Finishing both early makes departure day pass without surprises.",
        },
      ],
    },
  },
  {
    id: "art-perlengkapan",
    slug: "perlengkapan-yang-sering-terlewat-sebelum-keberangkatan",
    title: t(
      "Perlengkapan yang sering terlewat sebelum keberangkatan",
      "Things pilgrims most often forget before departure",
    ),
    category: t("Perlengkapan", "Packing"),
    excerpt: t(
      "Barang yang paling sering terlupa bukan barang besar, tapi hal kecil yang dipakai setiap hari dan sulit dibeli di sana.",
      "The items most often left behind are not the big ones, but small things used every day that are hard to buy there.",
    ),
    thumbnail: null,
    author: t("Tim Rihlah Tour Haramain", "Rihlah Tour Haramain team"),
    publishedAt: null,
    content: {
      id: [
        {
          kind: "paragraph",
          text: "Daftar bawaan biasanya sudah lengkap untuk barang besar. Yang sering terlewat justru barang kecil yang dipakai berulang setiap hari, dan barang yang hanya tersedia dalam ukuran atau merek tertentu.",
        },
        { kind: "heading", text: "Pisahkan bawaan kabin dan bawaan bagasi" },
        {
          kind: "paragraph",
          text: "Pisahkan sejak dari rumah, bukan saat di bandara. Barang yang mungkin dibutuhkan dalam beberapa jam pertama, seperti obat pribadi, jaket tipis, dan dokumen, sebaiknya berada di kabin. Sisanya baru masuk bagasi. Pemisahan ini juga memudahkan kalau bagasi tertunda.",
        },
        {
          kind: "list",
          items: [
            "Obat pribadi dalam jumlah cukup untuk seluruh perjalanan, berikut keterangan resep bila ada.",
            "Jaket tipis atau kain penutup yang mudah dilipat, karena perbedaan suhu di dalam dan luar ruangan cukup terasa.",
            "Alas kaki yang sudah pernah dipakai, bukan yang masih baru.",
            "Tas kecil untuk kebutuhan harian agar tidak perlu membawa bagasi besar saat bergerak.",
          ],
        },
        { kind: "heading", text: "Barang yang lebih baik dibeli dari rumah" },
        {
          kind: "paragraph",
          text: "Beberapa barang lebih tenang kalau dibawa dari rumah karena ukuran atau jenisnya spesifik, misalnya obat rutin, produk perawatan kulit tertentu, dan alat bantu yang sudah terbiasa dipakai. Menggantinya mendadak di tempat lain berisiko tidak nyaman.",
        },
        { kind: "heading", text: "Jangan bawa berlebihan" },
        {
          kind: "paragraph",
          text: "Rombongan bergerak dengan kendaraan bersama. Bawaan yang terlalu banyak menyulitkan perpindahan, terutama kalau kamu juga membawa oleh-oleh di akhir perjalanan. Sisakan ruang untuk itu sejak awal.",
        },
        {
          kind: "note",
          text: "Ketentuan bagasi mengikuti maskapai dan program yang kamu pilih. Rinciannya tercantum pada halaman paket bersama fasilitas yang termasuk.",
        },
      ],
      en: [
        {
          kind: "paragraph",
          text: "Packing lists are usually complete for the big items. What gets missed are the small things used repeatedly each day, and items that only come in a particular size or brand.",
        },
        { kind: "heading", text: "Separate cabin bags from checked bags" },
        {
          kind: "paragraph",
          text: "Separate them at home, not at the airport. Anything you might need in the first few hours, such as personal medication, a light jacket and your documents, belongs in the cabin. The rest goes into checked luggage. This also makes things easier if a bag is delayed.",
        },
        {
          kind: "list",
          items: [
            "Personal medication in a quantity that covers the whole trip, with the prescription if you have one.",
            "A light jacket or a cover-up that folds easily, because the temperature difference between indoors and outdoors is noticeable.",
            "Footwear you have already worn in, not something brand new.",
            "A small bag for daily needs so you do not have to carry a large suitcase when moving around.",
          ],
        },
        { kind: "heading", text: "Items better bought at home" },
        {
          kind: "paragraph",
          text: "Some items are calmer to bring from home because the size or type is specific, for example regular medication, particular skin care products, and aids you are already used to. Replacing them suddenly somewhere else risks discomfort.",
        },
        { kind: "heading", text: "Do not pack excessively" },
        {
          kind: "paragraph",
          text: "The group travels by shared vehicle. Too much luggage makes moving between places harder, especially if you are also carrying gifts at the end of the trip. Leave room for those from the start.",
        },
        {
          kind: "note",
          text: "Baggage allowances follow the airline and the programme you choose. The details appear on the package page together with the facilities included.",
        },
      ],
    },
  },
];

/** Labels stay in the order the articles are listed, not sorted. */
export function articleCategoriesFor(items: Article[], lang: Lang): string[] {
  return Array.from(new Set(items.map((item) => item.category[lang])));
}

export function getArticleBySlug(
  items: Article[],
  slug: string | undefined,
): Article | undefined {
  if (!slug) return undefined;
  return items.find((item) => item.slug === slug);
}

/**
 * Reading time is derived from the text instead of stored, so the number can
 * never drift away from the article it describes.
 */
export function estimateReadingMinutes(
  content: Localized<ArticleBlock[]>,
  lang: Lang,
): number {
  const words = content[lang]
    .map((block) => {
      if (block.kind === "list") return block.items.join(" ");
      return block.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
