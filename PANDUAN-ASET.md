# Panduan aset: foto dan dokumen

Situs ini tidak memakai foto stok. Setiap foto yang tampil harus berasal dari
dokumentasi Rihlah sendiri, dan setiap bagian yang fotonya belum ada akan
menampilkan keterangan, bukan gambar pinjaman.

## 1. Letakkan berkasnya di folder ini

| Jenis berkas | Folder |
|---|---|
| Foto (hero, paket, galeri, hotel, artikel) | `public/images/` |
| Scan dokumen resmi (izin, NIB) | `public/dokumen/` |

Folder `public/` disalin apa adanya ke hasil build. Jadi
`public/images/hero-masjidil-haram.webp` bisa diakses dari situs sebagai
`/images/hero-masjidil-haram.webp` tanpa langkah build tambahan.

## 2. Tulis lokasinya di config, bukan di komponen

Buka `src/config/site.ts` dan `src/content/`, lalu isi kolom yang masih `null`
dengan path berkas, memakai garis miring di depan:

```ts
hero: { file: "/images/hero-masjidil-haram.webp", alt: "Jamaah Rihlah..." },
```

Situs di-host di GitHub Pages dengan subfolder, jadi path ditulis **tanpa**
awalan `/rihlahtourharamain/`. Fungsi `assetUrl()` di `src/lib/media.ts`
menambahkan awalan itu otomatis saat build. Kalau Anda menulis awalan subfolder
sendiri, gambarnya akan gagal dimuat.

Boleh juga memakai URL penuh (`https://...`) kalau berkasnya disimpan di tempat
lain, misalnya CDN atau Google Drive yang sudah publik.

## 3. Di mana setiap foto didaftarkan

| Yang ingin ditampilkan | Berkas yang diubah | Kolom |
|---|---|---|
| Foto utama beranda | `src/config/site.ts` | `media.hero` |
| Foto kartu paket dan halaman detail | `src/content/packages.ts` | `thumbnail` |
| Galeri per paket | `src/content/packages.ts` | `gallery` |
| Foto hotel | `src/content/packages.ts` | `makkahHotel.photo`, `madinahHotel.photo` |
| Foto halaman galeri | `src/content/site-content.ts` | `gallerySlots[].photo` |
| Foto sampul panduan | `src/content/articles.ts` | `thumbnail` |
| Scan izin di halaman legalitas | `src/config/site.ts` | `legalEntity.documents[].file` |
| Foto pembimbing | `src/content/site-content.ts` | `teamMembers[].photo` |

Contoh mengisi galeri paket, karena tiap foto wajib punya keterangannya sendiri:

```ts
gallery: [
  { file: "/images/umrah-reguler-manasik.webp", alt: "Manasik rombongan sebelum keberangkatan" },
  { file: "/images/umrah-reguler-bandara.webp", alt: "Rombongan berkumpul di bandara" },
],
```

## 4. Ukuran dan format yang dipakai

| Pemakaian | Rasio | Ukuran saran | Format |
|---|---|---|---|
| Foto utama beranda | 4 banding 5 (tegak) | 1200 x 1500 | WebP, cadangan JPEG |
| Kartu paket dan galeri | 3 banding 2 atau 4 banding 3 | 1200 x 800 | WebP |
| Sampul panduan | 16 banding 9 | 1600 x 900 | WebP |
| Foto hotel | 3 banding 2 | 1200 x 800 | WebP |
| Scan dokumen | bebas | cukup terbaca saat diperbesar | PDF, cadangan JPG |

Usahakan tiap berkas di bawah 300 KB. Foto dari ponsel biasanya 3 sampai 8 MB,
jadi kecilkan dulu sebelum dimasukkan, misalnya dengan
`cwebp -q 80 foto.jpg -o foto.webp`.

## 5. Penamaan berkas

Huruf kecil, tanda hubung, tanpa spasi dan tanpa tanda baca:

```
benar   hero-masjidil-haram.webp
benar   hotel-makkah-al-maqam-2027.webp
salah   Foto Jamaah (1).JPG
salah   IMG_20270114_final_fix.jpg
```

Nama yang menjelaskan isi akan menolong saat ada puluhan foto di folder yang
sama.

## 6. Aturan yang dijaga oleh build

`bun run verify` akan gagal kalau salah satu dari ini terjadi:

- path ditulis tetapi berkasnya tidak ada di `public/`
- path keluar dari folder `public/`, misalnya memakai `../`
- ada `<img>` yang tidak punya teks alternatif
- ada `<img>` yang tidak menyatakan cara pemuatannya

Jadi kesalahan penulisan nama berkas ketahuan sebelum situs dipublikasikan,
bukan setelah jamaah melihat gambar rusak.

## 7. Batas waktu tampilnya

Selama kolomnya masih `null`, situs menampilkan blok bergaris putus-putus berisi
keterangan apa yang seharusnya ada di sana. Itu disengaja: ruang kosong yang
menjelaskan lebih jujur daripada foto stok yang membuat jamaah membayangkan
penginapan, kendaraan, atau suasana rombongan yang berbeda dari yang benar-benar
mereka terima.
