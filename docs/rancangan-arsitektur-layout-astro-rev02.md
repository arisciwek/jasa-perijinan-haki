# Rancangan Arsitektur Layout Astro (rev02)

> Dokumen ini menggantikan `rancangan-arsitektur-layout-react-rev01.md` yang ditulis untuk aplikasi React + `/menu`. Proyek aktual adalah **Astro statis (SSG) situs CSMS** tanpa `/menu`. Penamaan komponen mengikuti proyek, bukan dokumen lama. Prinsip arsitektur dipertahankan, keunggulan proyek didokumentasikan, gap dijadikan roadmap.

## 1. Tujuan

Dokumen ini menetapkan arsitektur layout untuk situs Astro + Tailwind CSMS dengan enam layout halaman:

- `BaseLayout.astro` — shell dokumen HTML + SEO (SEOMeta, StructuredData). Tidak merender konten visual.
- `PageLayout.astro` — layout default halaman umum: header, breadcrumb opsional, konten, footer.
- `ArticleLayout.astro` — layout khusus artikel: sidebar kiri, breadcrumb di atas, node + related articles, tanpa aside.
- `ServiceLayout.astro` — layout detail layanan: header slot, konten + related articles, aside kanan.
- `ElementLayout.astro` — layout detail elemen CSMS: header slot, konten + related articles, aside kanan.
- `CollectionLayout.astro` — layout listing artikel: grid 9 kartu + pagination.

Semua layout menggunakan komponen global bersama untuk elemen yang memang konsisten (header, footer, SEO). Setiap layout tetap dapat mengatur susunan kontennya sendiri agar tidak dipaksa mengikuti satu struktur yang sama.

## 2. Prinsip arsitektur

Gunakan pendekatan **komposisi komponen**, bukan pewarisan kelas dan bukan menyalin seluruh kode layout ke setiap halaman.

Komponen global yang dapat digunakan bersama:

- `Header.astro`
- `Footer.astro`
- `SEOMeta.astro`
- `StructuredData.astro`
- `RelatedArticles.astro`
- (potensial) `Breadcrumb.astro`, `Sidebar.astro`, `Aside.astro` — lihat Roadmap §13.

Layout berada di lapisan yang sama dan menggunakan komponen global sesuai kebutuhan masing-masing. `ArticleLayout` tidak harus menjadi turunan dari `PageLayout`; keduanya dapat menggunakan `Header`, `Footer`, dan komponen lain yang sama.

### Mengapa pendekatan ini dipilih?

1. **Header dan footer konsisten.** Perubahan pada komponen global dapat diterapkan ke semua layout yang menggunakannya.
2. **Layout tetap fleksibel.** Homepage tidak dipaksa memiliki sidebar atau kolom aside.
3. **Struktur artikel lebih jelas.** Artikel dapat memiliki breadcrumb, konten utama, related content, dan sidebar dengan susunan khusus.
4. **Lebih mudah dirawat.** Tanggung jawab tiap komponen lebih kecil dan jelas.
5. **Tidak mencampur konten dengan kerangka halaman.** Halaman memasok konten melalui slot, sedangkan layout menentukan penempatannya.

## 3. Struktur direktori (aktual proyek)

```text
src/
├── layouts/
│   ├── BaseLayout.astro        # shell HTML + SEO (SEOMeta, StructuredData)
│   ├── PageLayout.astro        # default: header + breadcrumb opsional + konten + footer
│   ├── ArticleLayout.astro     # artikel: sidebar kiri + node + related articles
│   ├── ServiceLayout.astro     # detail layanan: header slot + konten + related + aside
│   ├── ElementLayout.astro     # detail elemen CSMS: header slot + konten + related + aside
│   └── CollectionLayout.astro  # listing artikel: grid 9 kartu + pagination
├── components/
│   ├── Header.astro            # header global
│   ├── Footer.astro            # footer global
│   ├── RelatedArticles.astro   # card artikel terkait (kondisional)
│   ├── SEOMeta.astro           # Open Graph, Twitter Card
│   └── StructuredData.astro    # JSON-LD / Schema.org
├── config/
│   └── site.ts                  # registry services, csmsElements, siteUrl() — single source of truth
└── utils/
    └── related.ts              # pickRelatedArticles (prioritas layanan/elemen → kategori → terbaru)
```

> Struktur ini adalah struktur nyata proyek. Jangan memindahkan folder hanya untuk meniru konvensi proyek lain.

## 4. Matriks kebutuhan layout

| Fitur | `BaseLayout` | `PageLayout` | `ArticleLayout` | `ServiceLayout` | `ElementLayout` | `CollectionLayout` |
|---|---|---|---|---|---|---|
| Header global | — | Ya | Ya | Ya | Ya | Ya |
| Footer global | — | Ya | Ya | Ya | Ya | Ya |
| SEO (SEOMeta + StructuredData) | Ya | Ya (via BaseLayout) | Ya (via BaseLayout) | Ya (via PageLayout) | Ya (via PageLayout) | Ya (via PageLayout) |
| Sidebar | — | Tidak | Ya (kiri) | Tidak | Tidak | Tidak |
| Breadcrumb | — | Opsional | Ya (di atas konten) | Opsional | Opsional | Opsional |
| Konten utama (`node`/slot) | — | Ya | Ya | Ya | Ya | Ya |
| Related articles | — | Opsional | Ya (di dalam node) | Ya (di kolom konten) | Ya (di kolom konten) | Tidak |
| Aside | — | Tidak | Tidak | Ya (kanan) | Ya (kanan) | Tidak |
| Pagination | — | Tidak | Tidak | Tidak | Tidak | Ya |
| Penggunaan utama | Semua halaman | Halaman umum | `/articles/[slug]` | `/services/*` | `/csms-elements/*` | `/articles` + `/articles/[page]` |

Keterangan:

- `BaseLayout` adalah shell dokumen; semua layout lain mengkomposisinya (langsung atau melalui `PageLayout`).
- `PageLayout` adalah pilihan default untuk halaman umum (home, about, contact, services index, csms-elements index).
- `ArticleLayout` mengatur susunan khusus halaman artikel.
- `ServiceLayout` dan `ElementLayout` berbagi pola yang sama: header slot, konten + related articles di kolom utama, aside kanan.
- `CollectionLayout` digunakan untuk listing artikel dengan pagination.
- Breadcrumb di `ArticleLayout` dan `PageLayout` ditempatkan di atas area konten halaman, bukan di dalam kolom node.

## 5. Tata letak visual

### 5.1 `ArticleLayout.astro`

Breadcrumb membentang di atas area utama. Sidebar di kiri, node + related articles di kanan.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                                HEADER                                │
├──────────────────────────────────────────────────────────────────────┤
│                            BREADCRUMB                                │
├───────────────────────────────┬──────────────────────────────────────┤
│                               │                                      │
│                               │  ┌────────────────────────────────┐  │
│                               │  │            NODE               │  │
│                               │  │        Konten artikel         │  │
│          SIDEBAR              │  └────────────────────────────────┘  │
│      (TOC, Layanan,           │  ┌────────────────────────────────┐  │
│       Penulis)                │  │       RELATED ARTICLES         │  │
│                               │  │       (di dalam node)          │  │
│                               │  └────────────────────────────────┘  │
├───────────────────────────────┴──────────────────────────────────────┤
│                                FOOTER                                │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.2 `ServiceLayout.astro` / `ElementLayout.astro`

Header slot membentang penuh; konten + related articles di kolom utama (2/3), aside di kanan (1/3).

```text
┌──────────────────────────────────────────────────────────────────────┐
│                                HEADER                                │
├──────────────────────────────────────────────────────────────────────┤
│                        HEADER SLOT (judul, media)                    │
├───────────────────────────────────────────────┬──────────────────────┤
│                                               │                      │
│  ┌─────────────────────────────────────────┐  │                      │
│  │                 NODE                    │  │       ASIDE          │
│  │            Konten halaman               │  │  (navigasi, CTA,     │
│  └─────────────────────────────────────────┘  │   info tambahan)     │
│  ┌─────────────────────────────────────────┐  │                      │
│  │            RELATED ARTICLES             │  │                      │
│  └─────────────────────────────────────────┘  │                      │
├───────────────────────────────────────────────┴──────────────────────┤
│                                FOOTER                                │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 `CollectionLayout.astro`

Grid 9 kartu artikel + pagination, tanpa sidebar/aside.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                                HEADER                                │
├──────────────────────────────────────────────────────────────────────┤
│                        HEADER SLOT (judul, deskripsi)                │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │  Artikel 1   │  │  Artikel 2   │  │  Artikel 3   │                │
│  │  Card+teaser │  │  Card+teaser │  │  Card+teaser │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│  ... (hingga 9 kartu)                                               │
├──────────────────────────────────────────────────────────────────────┤
│                          PAGINATION                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                FOOTER                                │
└──────────────────────────────────────────────────────────────────────┘
```

Ketentuan:

- Tidak ada sidebar atau aside.
- Data artikel diambil dari content collection `articles` saat build, bukan hard-coded.
- Saat artikel baru diterbitkan, daftar berubah mengikuti data terbaru setelah build selesai.

## 6. Tanggung jawab tiap komponen

### `Header.astro`

Menampilkan header global situs. Komponen ini tidak menentukan struktur kolom konten di bawahnya.

### `Footer.astro`

Menampilkan footer global situs.

### `SEOMeta.astro`

Menampilkan meta Open Graph, Twitter Card, dan canonical. Menerima `title`, `description`, `image`, `url`.

### `StructuredData.astro`

Menampilkan JSON-LD Schema.org. Menerima `pageType`, `title`, `description`, `url`.

### `RelatedArticles.astro`

Menampilkan card artikel terkait. Menerima `articles` dan `title` opsional. Render kondisional — hanya muncul jika `articles.length > 0`.

### (Roadmap) `Breadcrumb.astro`, `Sidebar.astro`, `Aside.astro`

Lihat §13.

## 7. Kontrak props/slot

### `BaseLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  pageType?: string; // default 'WebPage'
}
```

Slot default = konten halaman.

### `PageLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  pageType?: string; // default 'WebPage'
  breadcrumbs?: { label: string; href: string }[];
}
```

Slot default = konten halaman.

### `ArticleLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  pubDate?: string;
  updatedDate?: string;
  author?: string;
  category?: string;
  tags?: string[];
  breadcrumbs?: { label: string; href: string }[];
  service?: Service | null;
  relatedArticles?: CollectionEntry<'articles'>[];
  headings?: TocHeading[];
}
```

Slot default = konten artikel (`<Content />`).

### `ServiceLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: { label: string; href: string }[];
  serviceId: number;
}
```

Slot `header` = judul/media; slot default = konten; slot `aside` = info tambahan.

### `ElementLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: { label: string; href: string }[];
  elementId: number;
}
```

Slot `header`, slot default, slot `aside` — sama seperti `ServiceLayout`.

### `CollectionLayout`

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: { label: string; href: string }[];
  articles: CollectionEntry<'articles'>[];
  currentPage: number;
  totalPages: number;
}
```

Slot `header` = judul/deskripsi listing.

## 8. Contoh struktur `.astro` artikel

Berikut gambaran struktur semantik untuk `ArticleLayout`. Ini bukan implementasi final yang harus disalin tanpa penyesuaian; sesuaikan nama komponen dan kontrak props dengan kode proyek.

```astro
<ArticleLayout
  title={title}
  description={description}
  image={seoImage}
  breadcrumbs={[{ label: 'Artikel', href: '/articles' }, { label: title, href: `/articles/${slug}` }]}
  service={service}
  relatedArticles={relatedArticles}
  headings={headings}
>
  <Content />
</ArticleLayout>
```

Di dalam `ArticleLayout`, susunan area utamanya adalah:

```astro
<div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
  <Header />
  <nav aria-label="Breadcrumb">…</nav>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
    <aside class="col-span-12 lg:col-span-3 hidden lg:block space-y-6">
      <!-- TOC, Layanan Terkait, Penulis -->
    </aside>
    <main class="col-span-12 lg:col-span-9">
      <article>
        <slot />
        <!-- Related Articles (di dalam node) -->
      </article>
    </main>
  </div>
  <Footer />
</div>
```

Contoh ini menggambarkan susunan yang diinginkan. Hindari menaruh elemen `<main>` lain di dalam `children` jika konten artikel sudah memiliki elemen `<main>`, karena satu halaman umumnya sebaiknya memiliki satu landmark `<main>` utama.

## 9. Prinsip layout

Proyek memakai **Tailwind CSS utility classes** untuk layout, bukan CSS custom. Prinsip yang berlaku:

- **Grid** untuk kolom (mis. `grid lg:grid-cols-3 gap-8`, `grid-cols-12`).
- **Flexbox** untuk susunan vertikal halaman (`min-h-screen flex flex-col`).
- **Responsif** dengan breakpoint Tailwind (`sm:`, `lg:`); kolom menyusun menjadi satu kolom di mobile.
- **Jangan tampilkan kolom kosong** — layout tanpa sidebar/aside benar-benar satu kolom konten.
- **Semantic classes** per halaman (`service-detail-*`, `elemen-*`, `article-*`) agar mudah dimodifikasi dan penempatan aset tertata.

## 10. Aturan implementasi penting

1. **Header dan footer sama secara default.** Jika kelak homepage benar-benar membutuhkan variasi, tambahkan props atau varian yang eksplisit; jangan membuat duplikat tanpa alasan.
2. **Jangan tampilkan kolom kosong.** Layout tanpa sidebar harus benar-benar menggunakan satu kolom konten.
3. **Breadcrumb berada di atas area konten.** Pada artikel, breadcrumb harus berada di atas `node` dan `aside`, bukan di dalam kolom `node` saja.
4. **Related articles menumpuk di kolom konten utama** (bukan di aside) pada Service/Element/ArticleLayout.
5. **Gunakan elemen semantik dengan tepat.** Hindari landmark `<main>` bersarang atau beberapa landmark `<main>` utama tanpa alasan.
6. **Jangan mengikat layout pada URL di dalam komponen presentasi.** Pemilihan layout dilakukan oleh halaman `.astro` itu sendiri (Astro SSG memilih layout per halaman secara eksplisit).
7. **Jangan membuat komponen global terlalu generik.** Abstraksi dibuat jika benar-benar mengurangi duplikasi dan memperjelas tanggung jawab.
8. **Pertahankan konsistensi penamaan.** Gunakan `relatedArticles` untuk prop dan `RelatedArticles` untuk komponen, kecuali proyek sudah memiliki konvensi lain.

## 11. Pemilihan layout berdasarkan rute

| Rute | Layout |
|---|---|
| `/` | `PageLayout` (homepage, tanpa sidebar/aside) |
| `/about`, `/contact` | `PageLayout` |
| `/services` | `PageLayout` |
| `/services/*` | `ServiceLayout` |
| `/csms-elements` | `PageLayout` |
| `/csms-elements/*` | `ElementLayout` |
| `/articles` + `/articles/[page]` | `CollectionLayout` |
| `/articles/[slug]` | `ArticleLayout` |
| `/404` | `PageLayout` |

Astro SSG memilih layout secara eksplisit di frontmatter tiap halaman — tidak ada router runtime, sehingga aturan "jangan mengikat layout pada URL" tidak relevan di sini.

## 12. Fitur yang lebih maju dari rancangan awal (React rev01)

Bagian ini mendokumentasikan keunggulan proyek yang TIDAK ada di rancangan React awal dan WAJIB dipertahankan:

1. **SEO terpusat di `BaseLayout`** — `SEOMeta` (Open Graph, Twitter Card, canonical) + `StructuredData` (JSON-LD Schema.org) dirender di shell dokumen, bukan per halaman. Rancangan React awal tidak membahas SEO sama sekali.
2. **Content Collections (`astro:content`)** — data artikel berasal dari koleksi `articles` (draft disaring, diurutkan berdasarkan `pubDate`), bukan hard-coded. Rancangan awal hanya menyebut "CMS/API/database" secara abstrak.
3. **Registry single-source di `src/config/site.ts`** — `services`, `csmsElements`, `getService`, `getCsmsElement`, `siteUrl()` menjadi satu sumber kebenaran untuk domain, brand, kontak, dan relasi konten.
4. **`pickRelatedArticles` util** — prioritas layanan/elemen → kategori → terbaru, dengan fallback ke artikel terbaru. Rancangan awal hanya menyebut "metadata terpelihara".
5. **`CollectionLayout` + pagination** — listing artikel 9 per halaman dengan `index` + `[page]`. Tidak ada di rancangan awal.
6. **Slots bernama (`slot="header"`, `slot="aside"`)** — komposisi Astro yang dipakai Service/Element/CollectionLayout untuk memisahkan konten dari kerangka.
7. **Validasi schema `relatedService`/`relatedElement`** — ID salah membuat build gagal (fail-fast), mencegah tautan rusak.

## 13. Roadmap / gap yang dapat diadopsi

Bagian ini adalah rekomendasi opsional, bukan kewajiban. Eksekusi hanya jika benar-benar mengurangi duplikasi atau memperjelas tanggung jawab.

1. **`Breadcrumb.astro` sebagai komponen** — saat ini breadcrumb diimplementasikan inline (duplikat) di `PageLayout` dan `ArticleLayout`. Ekstraksi menghilangkan duplikasi.
2. **`Sidebar.astro` / `Aside.astro` sebagai komponen** — sidebar `ArticleLayout` (TOC, Layanan Terkait, Penulis) masih inline; bisa dijadikan komponen global.
3. **Updated articles di homepage** — konsep `PageIndex.updatedArticles` dari rancangan awal; proyek belum punya. Ini keputusan konten, bukan murni arsitektur.
4. **Aside di `ArticleLayout`** — konsistensi dengan Service/ElementLayout; opsional.

## 14. Keputusan akhir

Arsitektur yang disepakati adalah **enam layout terpisah yang menggunakan komponen global bersama**:

```text
Shared Components
├── Header
├── Footer
├── SEOMeta
├── StructuredData
└── RelatedArticles

Layouts
├── BaseLayout
├── PageLayout
├── ArticleLayout
├── ServiceLayout
├── ElementLayout
└── CollectionLayout
```

Pendekatan ini mempertahankan konsistensi elemen global tanpa mengorbankan kebebasan masing-masing jenis halaman. Dokumen ini menjadi acuan arsitektur; implementasi akhir harus diselaraskan dengan struktur proyek, komponen, dan konvensi yang sudah tersedia.
