# AGENTS.md

Panduan wajib untuk agen/AI yang bekerja di repo ini.

## Ringkasan proyek

- Situs statis **Astro 7** untuk konsultan perizinan usaha & HAKI (bahasa Indonesia).
- Styling: Tailwind v4 via `@tailwindcss/vite` (plugin Vite di `astro.config.mjs`).
- Konten: Content Layer (`src/content.config.ts`, loader `glob()`), koleksi `articles`, `pages`, `services` (Markdown) serta `authors`, `categories` (JSON).
- Markdown dirender dengan processor **Sätteri** (default Astro 7). Body Markdown artikel/layanan/halaman **dirender** (`render()` + `<Content />`); data blok ada di frontmatter `blocks`.

## Perintah

- `npm run dev` — server pengembangan.
- `npm run build` — build statis (`astro build`).
- `npm run preview` — pratinjau hasil build.
- `npm run typecheck` — `astro sync && tsc --noEmit` (TypeScript 7; `tsc` hanya memeriksa berkas `.ts`, bukan frontmatter/`<script>` di `.astro`).
- `npm run validate` — rantai lengkap yang wajib lulus sebelum tugas selesai:
  1. `validate:content` — metadata lintas berkas (id unik per koleksi, ULID 26 karakter alfanumerik kapital unik global, referensi author/category/relatedType+relatedId).
  2. `validate:frontmatter` — integritas delimiter `---` (baris pertama wajib `---`, tepat satu pembuka + satu penutup).
  3. `validate:dates` — pubDate/updatedDate.
  4. `typecheck` — `astro sync` + `tsc --noEmit`.
  5. `build` — build produksi.
  6. `validate:output` — setiap dokumen terbit benar-benar merender isinya di `dist`.
  7. `validate:img-alt` — setiap `<img>` di `dist` punya atribut `alt` dan `src` wajar.
- Gunakan **npm** (ada `package-lock.json`); jangan ganti ke pnpm/yarn.

Catatan type-check: `tsc` hanya memeriksa berkas `.ts`. `astro check` tidak dipakai karena belum mendukung TypeScript 7. `src/env.d.ts` + `src/components/modules.d.ts` menyediakan deklarasi modul `*.astro` agar `tsc` lolos.

## Aturan pubDate / updatedDate

Setiap berkas Markdown (`articles`, `pages`, `services`) harus memiliki:

- `pubDate` — tanggal publikasi asli, format ISO 8601 UTC tanpa milisekon: `YYYY-MM-DDTHH:mm:ssZ`.
- `updatedDate` — tanggal perubahan konten terakhir, format UTC tanpa milisekon, wajib lebih baru dari `pubDate`.
- Setiap nilai `pubDate` dan `updatedDate` harus **unik** lintas koleksi (`articles`, `pages`, `services`) — dua konten tidak mungkin disubmit pada detik yang sama.
- ULID wajib 26 karakter Crockford base32 (`/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/`, diawali 0-7, tanpa I/L/O/U) dan unik lintas semua koleksi (termasuk `authors` dan `categories` JSON).

Validasi otomatis dijalankan melalui `npm run validate`. Jangan mengklaim pemeriksaan lulus jika belum dijalankan.

## Struktur

| Lokasi | Peran |
| --- | --- |
| `src/content.config.ts` | schema frontmatter (sumber kebenaran bentuk data) |
| `src/content/articles/*.md` | data artikel + `blocks` + body |
| `src/content/pages/*.md` | data halaman statis |
| `src/content/services/*.md` | data layanan + body |
| `src/content/authors/`, `src/content/categories/` | data JSON penulis & kategori |
| `src/components/blocks.ts` | pemetaan `component` → komponen blok |
| `src/config.ts` | identitas situs |
| `src/pages/sitemap.xml.ts` | sitemap (menggunakan `getCollection`, tanpa skrip terpisah) |
| `scripts/validate-*.mjs` | 5 validator yang dijalankan `npm run validate` |

## Aturan konten

- Semua teks yang terlihat pengguna berasal dari frontmatter (`blocks`, field layanan) atau body Markdown yang memang dirender.
- `relatedType`/`relatedId` hanya boleh merujuk koleksi dan id yang benar-benar ada.
- `updatedDate` hanya ditulis saat konten benar-benar berubah; jangan mengubah `pubDate` demi membuat artikel tampak baru. Saat konten berubah, tulis `updatedDate` baru yang unik dan lebih baru dari `pubDate`.
- Draft (`draft: true`) dilewati validator output dan tidak masuk rute.
