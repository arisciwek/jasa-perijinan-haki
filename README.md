# Astro — Konsultan Perizinan Usaha & HAKI

Starter project Astro berbasis Markdown Content Collections dan Tailwind CSS. Setiap komponen visual disimpan dalam file `.astro` terpisah, sementara konten halaman, layanan, dan artikel berada di file konten masing-masing. Tampilan artikel dapat disusun lewat frontmatter tanpa menyentuh file `.astro`.

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
- `src/content.config.ts`: schema dan validasi frontmatter, termasuk kontrak tiap block.
- `src/config.ts`: identitas dan kontak bisnis (nama situs, nomor WhatsApp untuk block CTA).
- `src/components/pages/`: komposisi layout halaman.
- `src/components/home/`: komponen beranda.
- `src/components/shared/`: komponen bersama seperti header, footer, kartu, breadcrumb, artikel terbaru, dan block component.
- `src/components/content/`: komponen elemen konten block (`p`, `list`, `image`) beserta kompositornya.
- `src/components/blocks.ts`: registry block yang dapat dipanggil dari frontmatter artikel.
- `docs/PLAN.md`: backlog pengembangan berikutnya.

## Pola block component & frontmatter artikel

Tampilan artikel dikontrol dari frontmatter, bukan dari layout. Setiap section adalah satu "block" pada field `blocks`; urutan penulisan menentukan posisi render. Markdown body tetap bisa dipakai (campuran), atau dikosongkan agar artikel 100% digerakkan block.

```yaml
---
id: 101
title: "Judul artikel"
# ...frontmatter identitas...
blocks:
  - component: "card"            # section serbaguna: ikon + h2 + body
    id: "prinsip"                # anchor HTML + entri Daftar Isi
    heading: "Prinsip penyimpanan dokumen"
    icon: "shield-check"
    class:                       # override sebagian; key lain memakai default
      section: "mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 md:p-8"
    body:
      - type: "p"
        text: "Paragraf pertama..."
      - type: "list"
        items: ["Item satu", "Item dua"]
      - type: "image"
        src: "/images/contoh.svg"
        alt: "Keterangan aksesibel gambar"
        caption: "Keterangan gambar"
  - component: "faq"             # accordion <details>/<summary>, tanpa JavaScript
    heading: "Pertanyaan yang sering diajukan"
    items:
      - question: "Pertanyaan?"
        answer: "Jawaban."
  - component: "table"           # tabel dengan header berwarna + zebra striping
    heading: "Perbandingan singkat"
    head: ["Aspek", "Merek", "Paten"]
    rows:
      - ["Objek", "Tanda pembeda", "Invensi teknis"]
      - ["Cara memperoleh", "Pendaftaran", "Pengajuan + penelaahan"]
  - component: "cta"             # tombol WhatsApp; nomor dari src/config.ts
    heading: "Siap menyusun dokumen legalitas Anda?"
    message: "Halo, saya ingin konsultasi mengenai dokumen legalitas usaha."
    button: "Konsultasi via WhatsApp"
---
```

Cara kerjanya:

- `component` merujuk registry `src/components/blocks.ts` (`card`, `faq`, `cta`, `table`). Komponen yang tidak terdaftar dilewati saat build.
- `heading` block otomatis masuk Daftar Isi di sidebar; block tanpa `heading` (mis. CTA) tidak masuk TOC.
- `id` menentukan anchor HTML; jika kosong, dibuat otomatis `${component}-${index+1}`.
- Setiap bagian visual punya kelas default di komponen; frontmatter cukup menimpa yang diinginkan lewat `class` (mis. `class.section` untuk mengganti warna kartu).
- `cta` membangun link `https://wa.me/<nomor>?text=<pesan>`: nomor dari `src/config.ts` (`site.whatsapp`), pesan dari frontmatter, sehingga CTA bisa diletakkan di posisi mana pun dalam artikel — tidak harus di bawah.
- Menambah block baru: buat komponen `.astro` → daftarkan di `src/components/blocks.ts` → tambahkan literal union pada schema `blocks` di `src/content.config.ts` → panggil dari frontmatter. Layout tidak perlu diubah.
- Dokumentasi tiap komponen (props + contoh YAML siap salin) ada di docblock masing-masing file di `src/components/shared/` dan `src/components/content/`.

## Field identitas

Konten memakai `id` numerik unik dan `ulid` string 26 karakter sebagai identitas. Pastikan keduanya unik di seluruh konten jika Anda menjadikannya identitas global di sistem lain. Artikel menyimpan relasi child → parent satu-ke-satu melalui `relatedType` (`service` | `page` | `article`) dan `relatedId` yang merujuk ke `id` parent; parent menampilkan child terbaru dengan query, bukan dengan mendaftarkan daftar artikel.

Semua konten wajib memiliki `pubDate` dan `updatedDate` (saat dibuat, isi keduanya dengan nilai yang sama). Tanggal ini menjadi sumber `lastmod` pada `sitemap.xml`: halaman yang menampilkan artikel mengikuti tanggal artikel terbaru yang dirender, bukan waktu build.

## Catatan sebelum produksi

1. Ganti nama merek `KonsultanLegal` dengan nama bisnis sebenarnya (termasuk `src/config.ts`).
2. Ganti `site.whatsapp` di `src/config.ts` dengan nomor WhatsApp resmi (format internasional tanpa `+`), lalu lengkapi alamat/email di halaman kontak.
3. Set `SITE_URL` untuk canonical URL produksi; fallback lokal memakai `http://jasa-perijinan-haki.lan`. Lihat `docs/astro-domain-config.md`.
4. Lepas `Disallow: /` pada `public/robots.txt` dan tambahkan baris `Sitemap:` saat go-live.
5. Tambahkan gambar nyata pada folder `public/images/` sesuai nama yang dirujuk frontmatter, atau ganti/hapus field gambar.
6. Tinjau konten layanan dan legal sebelum dipublikasikan; contoh ini bukan nasihat hukum dan bukan jaminan hasil pengurusan.
7. Halaman kategori memfilter `article.data.category` berdasarkan slug kategori.
8. `PageUpdatedArticles` menampilkan tiga artikel terbaru berdasarkan `updatedDate` (fallback `pubDate`), sehingga beranda dan halaman layanan tetap mendapat teaser yang diperbarui saat konten berubah.
9. `PageNavIndex` menerima grup layanan agar halaman Perizinan Usaha dan Kekayaan Intelektual dapat menampilkan layanan yang sesuai.

## Rencana pengembangan

Backlog ide berikutnya (block `steps`/`stats`, JSON-LD, scroll-spy TOC, audit Lighthouse) tercatat di `docs/PLAN.md`.
