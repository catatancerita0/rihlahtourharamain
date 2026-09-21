# Panduan panel admin Rihlah

Panel admin dipakai tim Rihlah untuk memperbarui isi situs tanpa mengubah kode.
Situs publik tetap terbuka untuk semua orang tanpa login. Hanya halaman `/admin`
yang memerlukan akun.

---

## 1. Menyalakan backend

Panel ini memakai Supabase sebagai database dan penyimpanan berkas. Sampai
langkah-langkah di bawah selesai, situs tetap berjalan dengan isi yang tertanam
di kode, jadi tidak ada halaman yang rusak karena backend belum ada.

### Langkah 1, buat proyek dan jalankan skema

1. Buat proyek baru di Supabase.
2. Buka SQL Editor, tempel seluruh isi berkas `supabase/schema.sql`, lalu
   jalankan.
3. Skema itu membuat tabel isi, bucket penyimpanan, dan seluruh aturan izin.
   Aman dijalankan berulang kali, jadi kalau ada langkah yang gagal, jalankan
   ulang saja.

### Langkah 2, isi dua nilai publik

Buka Project Settings, API, lalu ambil dua nilai berikut:

| Nilai panel | Isi dengan |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

Tambahkan keduanya pada Settings, Environment di Freebuff. Nilai ini memang
publik dan ikut masuk ke berkas JavaScript, itu cara kerja Supabase. Yang
membatasi siapa boleh menulis adalah aturan izin di database, bukan kerahasiaan
kunci ini.

Jangan menambahkan `service_role` key. Kunci itu melewati seluruh aturan izin dan
tidak dipakai di proyek ini.

### Langkah 3, buat akun admin

1. Buka Authentication, Users, Add user. Isi email dan kata sandi admin.
2. Jalankan pernyataan berikut pada SQL Editor, ganti alamat emailnya:

```sql
insert into public.admins (user_id, note)
select id, 'pemilik' from auth.users where email = 'ALAMAT_EMAIL_ADMIN'
on conflict (user_id) do nothing;
```

Bisa masuk saja belum cukup. Tanpa langkah ini, akun tersebut tidak punya akses
mengubah isi, dan panel akan mengatakannya secara jelas.

### Langkah 4, masuk

Buka `https://<alamat-situs>/admin`, lalu masuk dengan email dan kata sandi tadi.

---

## 2. Yang bisa diubah dari panel

| Tab | Isinya |
|---|---|
| **Paket Umrah** dan **Paket Haji** | Nama, tanggal, harga, durasi, maskapai, hotel Makkah dan Madinah, fasilitas termasuk dan tidak termasuk, dokumen, syarat, status kursi, foto utama |
| **Jadwal** | Tanggal, bulan, harga, durasi, dan status kursi untuk setiap keberangkatan |
| **Panduan Jamaah** | Artikel, termasuk isi lengkapnya dalam dua bahasa |
| **Promo** | Judul, keterangan, paket yang dituju, tanggal berakhir, dan pilihan tampil di banner beranda |
| **FAQ** | Pertanyaan, jawaban, kategori, dan nomor urut |
| **Galeri** | Slot foto beserta keterangannya |
| **Pembimbing** | Nama, peran, keterangan, dan foto |
| **Testimonial** | Kutipan jamaah beserta nama dan tanggalnya |
| **Beranda** | Bagian mana yang tampil, paket unggulan, dan izin banner promo |
| **Menu dan Halaman** | Halaman mana yang muncul di menu utama dan menu footer |
| **Tentang Kami** | Paragraf halaman, empat komitmen, dan batas layanan |
| **Kontak dan Legalitas** | Nomor WhatsApp, email, telepon, jam layanan, alamat, NIB, PPIU, PIHK, rekening resmi, salinan dokumen, media sosial, foto utama beranda |

Beberapa tombol yang sering dipakai:

- **Simpan** menulis ke database dan langsung menyegarkan isi yang dibaca situs.
- **Sembunyikan** mengeluarkan satu catatan dari situs tanpa menghapusnya.
  Catatannya tetap terlihat di panel dengan tanda *Tersembunyi*, dan bisa
  ditampilkan kembali kapan saja.
- **Naik** dan **Turun** mengubah urutan catatan pada daftar.
- **Hapus** hanya muncul untuk catatan yang Anda buat sendiri. Catatan bawaan
  kode tidak dihapus, hanya bisa disembunyikan, supaya bisa dikembalikan.

### Tentang bahasa

Setiap kolom isi punya dua kotak, Bahasa Indonesia dan English. Situs Inggris
membaca kotak kedua, jadi kolom yang dibiarkan kosong akan tampil kosong di versi
Inggris, bukan otomatis memakai versi Indonesia.

Kalau satu catatan sengaja hanya untuk satu bahasa, itu bisa dilakukan, tetapi
pembaca bahasa lain akan melihat bagian yang kosong. Lebih baik diisi keduanya.

### Tentang promo

Promo berhenti tampil sendiri setelah tanggal berakhirnya lewat. Tidak ada yang
perlu dimatikan manual. Pada banner beranda, promo juga bisa ditutup oleh
pengunjung tanpa memengaruhi tampilannya bagi orang lain.

---

## 3. Mengunggah gambar dan dokumen

Tombol **Pilih berkas** pada panel mengunggah langsung ke penyimpanan Supabase,
lalu menyimpan alamat berkasnya pada catatan terkait.

- Foto: JPG, PNG, WebP, atau AVIF, maksimal 5 MB.
- Dokumen: PDF, maksimal 5 MB.

Alamat berkas yang berasal dari unggahan tidak perlu disesuaikan dengan subfolder
situs. Kalau Anda menulis alamat manual ke dalam folder `public/`, tulis tanpa
awalan subfolder, misalnya `/images/foto-rombongan.webp`. Lihat
`PANDUAN-ASET.md` untuk ukuran dan penamaan berkas.

Untuk kesan yang konsisten: foto utama beranda 4 banding 5, foto paket 3 banding
2, foto galeri 4 banding 3.

---

## 4. Kalau ada yang tidak berjalan

**"Akun ini bisa masuk, tetapi belum terdaftar sebagai admin."**
Akunnya ada, tetapi belum ada di tabel `admins`. Jalankan pernyataan pada
Langkah 3.

**Panel masih menampilkan "Backend belum diatur".**
Dua nilai pada Langkah 2 belum terbaca. Setelah menambahkannya, muat ulang
halaman. Nilai itu dibaca saat situs dibangun, bukan saat halaman dibuka.

**Ada catatan bertanda "tidak dapat dibaca" pada tab Ringkasan.**
Catatan itu tidak ditampilkan di situs dan tidak akan merusak halaman mana pun.
Biasanya terjadi kalau catatan disunting langsung di database dan bentuknya
berubah. Hapus atau perbaiki catatan tersebut, lalu simpan ulang dari panel.

**Perubahan belum terlihat di situs.**
Muat ulang halaman situs. Isi situs dibaca sekali saat halaman dibuka, jadi
halaman yang sudah terbuka tidak berubah sendiri.

**Data legalitas tidak muncul di halaman legalitas.**
Halaman itu hanya menampilkan nilai yang sudah diisi. Selama masih kosong, yang
tampil adalah keterangan "belum diisi", bukan contoh data.

---

## 5. Keamanan

- Pengunjung tidak pernah diminta masuk. Situs publik tidak membaca sesi admin
  sama sekali.
- Kunci `anon` memang publik dan aman dipakai di peramban, karena aturan izin
  database yang menentukan siapa boleh membaca dan siapa boleh menulis.
- Menulis hanya boleh dilakukan akun yang terdaftar pada tabel `admins`. Membuat
  akun baru di Authentication tidak dengan sendirinya memberi akses.
- Kunci `service_role` tidak dipakai di proyek ini. Jangan menambahkannya ke
  berkas apa pun di repositori.
- Jangan menaruh kata sandi admin di dalam kode atau berkas yang masuk ke git.

---

## 6. Batasan yang perlu diketahui

- **Itinerary dan galeri per paket belum punya editor.** Keduanya dipertahankan
  apa adanya saat paket disimpan, jadi menyunting paket tidak menghapusnya, tetapi
  mengubahnya masih perlu dilakukan dari kode.
- **Panel admin hanya berbahasa Indonesia.** Ini alat internal tim.
- **Bahasa baru belum didukung.** Situs saat ini dua bahasa, Indonesia dan
  Inggris.
