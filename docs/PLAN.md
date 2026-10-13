# PLAN — Rencana Pengembangan Situs

Catatan ide yang belum dikerjakan. Urutan = perkiraan dampak terbesar.

## Block System (lanjutan)

| Ide | Deskripsi | Status |
|---|---|---|
| Block `steps` | Alur kerja bernomor besar; data dari frontmatter (`items: [{title, text}]`) | belum |
| Block `stats` | Angka besar + label singkat untuk halaman layanan | belum |
| Block `cta` | Ajakan bertindak dengan variasi tujuan (kontak / WhatsApp / jadwal konsultasi); monitisasi halaman artikel | belum |
| Block `note` | Callout catatan/peringatan (info/success/warning) | belum |
| Block `quote` | Kutipan/testimoni dengan atribusi | belum |
| Formating inline pada elemen block | Teks frontmatter kini apa adanya; opsi: elemen `html` tersanitasi atau dukungan markdown inline | belum |

## SEO & Struktur Data

| Ide | Deskripsi | Status |
|---|---|---|
| JSON-LD `Article` | Schema.org pada halaman artikel (judul, tanggal, penulis, gambar) | belum |
| JSON-LD `FAQPage` | Cocok dengan block faq — potensi rich result Google | belum |
| JSON-LD `Service` + `BreadcrumbList` | Halaman layanan & breadcrumb semua halaman | belum |
| Sitemap ping | Notifikasi mesin pencari saat deploy production | belum |

## UX & Kualitas

| Ide | Deskripsi | Status |
|---|---|---|
| Scroll-spy TOC | Link "Daftar Isi" artikel menyorot posisi baca aktif, tanpa framework | belum |
| Audit Lighthouse + a11y | Periksa seluruh halaman sebelum production (kontras, kontras fokus, target sentuh) | belum |
| Switch production robots.txt | Lepas `Disallow: /` + tambah `Sitemap:` saat go-live | belum |
| Konfigurasi domain produksi | Set `SITE_URL` env sesuai docs/astro-domain-config.md | belum |

## Selesai (referensi)

- Relasi konten child→parent via `relatedType` + `relatedId`
- Sitemap `lastmod` dari tanggal konten yang dirender (bukan build time)
- Sistem block dinamis dari frontmatter: registry (`blocks.ts`), elemen bertipe (`p`/`list`/`image`), FAQ accordion, docblock di setiap komponen
