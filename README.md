# Astro — Konsultan Perizinan Usaha & HAKI

Starter project Astro berbasis Markdown Content Collections dan Tailwind CSS. Setiap komponen visual disimpan dalam file `.astro` terpisah, sementara konten halaman, layanan, dan artikel berada di file konten masing-masing.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Arsitektur konten

- `src/content/pages/*.md`: konten halaman umum, termasuk beranda.
- `src/content/services/*.md`: satu file Markdown untuk setiap layanan.
- `src/content/articles/*.md`: satu file Markdown untuk setiap artikel.
- `src/content/categories/*.json`: metadata kategori.
- `src/content/authors/*.json`: metadata penulis.
- `src/content.config.ts`: schema dan validasi frontmatter.
- `src/components/pages/`: komposisi layout halaman.
- `src/components/home/`: komponen beranda.
- `src/components/shared/`: komponen bersama seperti header, footer, kartu, breadcrumb, dan artikel terbaru.

## Field identitas

Konten memakai `id` numerik unik dan `ulid` string 26 karakter sebagai identitas. Pastikan keduanya unik di seluruh konten jika Anda menjadikannya identitas global di sistem lain. Artikel menyimpan relasi child → parent satu-ke-satu melalui `relatedType` (`service` | `page` | `article`) dan `relatedId` yang merujuk ke `id` parent; parent menampilkan child terbaru dengan query, bukan dengan mendaftarkan daftar artikel.

## Catatan sebelum produksi

1. Ganti nama merek `KonsultanLegal` dengan nama bisnis sebenarnya.
2. Ganti tautan WhatsApp placeholder dan tambahkan alamat/email resmi.
3. Tambahkan `site` pada `astro.config.mjs` untuk canonical URL produksi.
4. Tambahkan gambar nyata pada folder `public/images/` sesuai nama yang dirujuk frontmatter, atau ganti/hapus field gambar.
5. Tinjau konten layanan dan legal sebelum dipublikasikan; contoh ini bukan nasihat hukum dan bukan jaminan hasil pengurusan.
6. Halaman kategori memfilter `article.data.category` berdasarkan slug kategori.
7. `PageUpdatedArticles` menampilkan tiga artikel terbaru berdasarkan `pubDate`, sehingga beranda dan halaman layanan tetap mendapat teaser yang diperbarui saat konten berubah.
8. `PageNavIndex` menerima grup layanan agar halaman Perizinan Usaha dan Kekayaan Intelektual dapat menampilkan layanan yang sesuai.
