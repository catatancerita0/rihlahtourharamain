import type { Article } from "./types";

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
    title: "Dokumen Umrah yang bisa disiapkan lebih awal",
    category: "Dokumen",
    excerpt:
      "Paspor dan data keluarga sering jadi penghambat karena disiapkan di menit terakhir. Ini urutan yang membuat pendaftaran berjalan lebih cepat.",
    thumbnail: null,
    author: "Tim Rihlah Tour Haramain",
    publishedAt: null,
    content: [
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
  },
  {
    id: "art-lansia",
    slug: "mendaftarkan-jamaah-lansia-yang-perlu-dibahas",
    title: "Mendaftarkan jamaah lansia: yang perlu dibahas sebelum bayar",
    category: "Jamaah Lansia",
    excerpt:
      "Membawa orang tua beribadah mengubah banyak keputusan perjalanan. Ini daftar pertanyaan yang sebaiknya dijawab lebih dulu, bukan di menit terakhir.",
    thumbnail: null,
    author: "Tim Rihlah Tour Haramain",
    publishedAt: null,
    content: [
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
  },
  {
    id: "art-manasik",
    slug: "manasik-yang-sebaiknya-dipahami-sebelum-berangkat",
    title: "Manasik: apa yang sebaiknya sudah dipahami sebelum berangkat",
    category: "Manasik",
    excerpt:
      "Manasik bukan sekadar pembekalan sebelum terbang. Kalau dipersiapkan dengan benar, ia mengubah cara kamu mengikuti rangkaian kegiatan di lapangan.",
    thumbnail: null,
    author: "Tim Rihlah Tour Haramain",
    publishedAt: null,
    content: [
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
  },
  {
    id: "art-perlengkapan",
    slug: "perlengkapan-yang-sering-terlewat-sebelum-keberangkatan",
    title: "Perlengkapan yang sering terlewat sebelum keberangkatan",
    category: "Perlengkapan",
    excerpt:
      "Barang yang paling sering terlupa bukan barang besar, tapi hal kecil yang dipakai setiap hari dan sulit dibeli di sana.",
    thumbnail: null,
    author: "Tim Rihlah Tour Haramain",
    publishedAt: null,
    content: [
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
  },
];

export const articleCategories = Array.from(new Set(articles.map((item) => item.category)));

export function getArticleBySlug(slug: string | undefined): Article | undefined {
  if (!slug) return undefined;
  return articles.find((item) => item.slug === slug);
}

/**
 * Reading time is derived from the text instead of stored, so the number can
 * never drift away from the article it describes.
 */
export function estimateReadingMinutes(article: Article): number {
  const words = article.content
    .map((block) => {
      if (block.kind === "list") return block.items.join(" ");
      return block.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
