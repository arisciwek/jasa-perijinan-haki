# PLAN — Rencana Pengembangan Situs

Catatan ide yang belum dikerjakan. Urutan = perkiraan dampak terbesar.

## Block System (lanjutan)

| Ide | Deskripsi | Status |
|---|---|---|
| Block `steps` | Alur kerja bernomor besar; data dari frontmatter (`items: [{title, text}]`) | selesai |
| Block `stats` | Angka besar + label singkat untuk halaman layanan | selesai |
| Block `cta` | Ajakan bertindak dengan variasi tujuan (kontak / WhatsApp / jadwal konsultasi); monitisasi halaman artikel | selesai |
| Block `note` | Callout catatan/peringatan (info/success/warning) | selesai |
| Block `quote` | Kutipan/testimoni dengan atribusi | selesai |
| Formating inline pada elemen block | Teks frontmatter kini apa adanya; opsi: elemen `html` tersanitasi atau dukungan markdown inline | belum |

## SEO & Struktur Data

| Ide | Deskripsi | Status |
|---|---|---|
| JSON-LD `Article` | Schema.org pada halaman artikel (judul, tanggal, penulis, gambar) | selesai |
| JSON-LD `FAQPage` | Cocok dengan block faq — potensi rich result Google | selesai |
| JSON-LD `Service` + `BreadcrumbList` | Halaman layanan & breadcrumb halaman artikel + layanan | selesai |
| Sitemap ping | Notifikasi mesin pencari saat deploy production | belum |

## UX & Kualitas

| Ide | Deskripsi | Status |
|---|---|---|
| Scroll-spy TOC | Link "Daftar Isi" artikel menyorot posisi baca aktif, tanpa framework | selesai |
| Audit Lighthouse + a11y | Periksa seluruh halaman sebelum production (kontras, kontras fokus, target sentuh) | belum |
| Switch production robots.txt | Lepas `Disallow: /` + tambah `Sitemap:` saat go-live | belum |
| Konfigurasi domain produksi | Set `SITE_URL` env sesuai docs/astro-domain-config.md | belum |

## Selesai (referensi)

- Relasi konten child→parent via `relatedType` + `relatedId`
- Sitemap `lastmod` dari tanggal konten yang dirender (bukan build time)
- Sistem block dinamis dari frontmatter: registry (`blocks.ts`), elemen bertipe (`p`/`list`/`image`), FAQ accordion, docblock di setiap komponen
- Block lengkap 9 jenis: `card`, `faq`, `cta`, `table`, `note`, `steps`, `stats`, `glossary`, `quote` — semuanya dikontrol frontmatter + docblock
- JSON-LD: `Article` + `FAQPage` + `BreadcrumbList` (artikel), `Service` + `FAQPage` + `BreadcrumbList` (layanan) via `src/utils/structured-data.ts`
- Scroll-spy Daftar Isi: scroll listener murni, `aria-current` untuk aksesibilitas
