# Resume Lengkap Diskusi Proyek Astro --- Website Konsultan Perizinan Usaha dan HAKI

> Dokumen ini merangkum keputusan, kebutuhan, koreksi, data, struktur,
> dan batasan yang benar-benar muncul dalam diskusi proyek. Informasi
> yang belum dipastikan ditandai sebagai belum ditentukan. Ini bukan
> rancangan baru berdasarkan pengetahuan umum.

## 1. Konteks proyek

Proyek ini adalah pembuatan website menggunakan **Astro** untuk bisnis
**konsultan perizinan usaha dan HAKI (Hak Kekayaan Intelektual)**.
Informasi awal layanan berasal dari data yang disampaikan pengguna.
Diskusi sebelumnya tentang CSMS hanya digunakan sebagai contoh
pola/arsitektur, bukan identitas bisnis baru ini.

### Batasan identitas bisnis

Pengguna menjelaskan bahwa contoh `site.ts` untuk website CSMS hanya
merupakan contoh dari proyek lain. Karena itu, jangan menggunakan
kembali nama perusahaan CSMS, alamat, nomor telepon, WhatsApp, email,
koordinat, nama legal, domain, akun media sosial, jam operasional, atau
informasi kontak dari contoh CSMS. Informasi identitas yang belum
diberikan harus tetap berupa placeholder atau ditandai belum tersedia.
Jangan mengarang identitas perusahaan, alamat, kontak, klaim legalitas,
atau jaminan hasil layanan.

## 2. Informasi awal layanan yang diberikan pengguna

Daftar berikut merekam informasi yang disebutkan pengguna. Cakupan
persis setiap layanan harus mengikuti informasi bisnis yang benar-benar
tersedia.

### 2.1 Jasa Konsultan Perizinan Usaha

-   Pembuatan akta pendirian dan akta perubahan, termasuk NPWP dan NIB.
-   Pengurusan perizinan/sertifikat melalui OSS, dengan contoh:
    -   BPOM
    -   Halal
    -   CPOB
    -   CPPOB
    -   CDAKB
    -   CPAKB
-   Perizinan perdagangan ekspor dan impor.
-   Perizinan pertambangan dan minyak/gas.
-   Perizinan transportasi.
-   Perizinan alat kesehatan.
-   SBU Konstruksi.

Daftar ini adalah daftar awal dari diskusi, bukan pernyataan bahwa semua
jenis izin/sertifikat selalu berlaku untuk semua bidang usaha.

### 2.2 HAKI

Jenis layanan yang disebutkan:

-   Pendaftaran merek, termasuk merek/logo.
-   Hak cipta.
-   Paten.
-   Layanan HAKI lainnya sesuai informasi yang nantinya dikonfirmasi.

Jangan menambahkan klaim atau jenis layanan lain sebagai fakta bisnis
jika belum disampaikan atau dikonfirmasi pengguna.

## 3. Keputusan utama arsitektur konten

Keputusan yang ditegaskan pengguna:

> **Semua data halaman berada di frontmatter Markdown. Template
> menggunakan komponen, dan data untuk komponen disuplai oleh
> frontmatter.**

Aturan implementasi:

1.  Satu halaman konten disimpan dalam satu file Markdown.
2.  Data halaman diletakkan di frontmatter Markdown.
3.  Template dan komponen Astro menerima data melalui props.
4.  Komponen menyajikan data, bukan mendefinisikan ulang konten halaman
    di dalam komponen.
5.  Setiap komponen berada dalam file `.astro` tersendiri.
6.  Jika ada 20 komponen, harus ada 20 file `.astro` terpisah.
7.  File Markdown dan `.astro` tidak digabung menjadi satu file besar.
8.  `index.astro` menjadi penghubung antara entri Markdown dan layout
    halaman depan.
9.  `PageIndex.astro` mengatur susunan komponen homepage.
10. Konfigurasi global seperti domain dan kontak global boleh berada di
    `site.ts`, tetapi data khusus halaman tetap di frontmatter Markdown.
11. Gunakan Tailwind untuk styling.
12. Hindari keluaran yang terasa seperti "AI slop"; struktur harus
    jelas, konsisten, dan mengikuti data serta kebutuhan proyek.

  -----------------------------------------------------------------------
  Bagian                              Tanggung jawab
  ----------------------------------- -----------------------------------
  Markdown/frontmatter                Sumber data halaman dan konten
                                      halaman

  `index.astro`                       Mengambil entri Markdown dan
                                      meneruskan data

  Layout Astro                        Mengatur kerangka dan susunan
                                      komponen halaman

  Komponen Astro                      Menampilkan data yang diterima
                                      melalui props

  `site.ts`                           Konfigurasi global, bukan tempat
                                      menduplikasi seluruh konten

  Koleksi artikel                     Sumber data artikel terbaru dan
                                      artikel terkait

  Tailwind                            Utilitas styling, bukan sumber data
                                      konten
  -----------------------------------------------------------------------

## 4. Layout yang dibahas

Empat layout utama yang disebut dalam diskusi arsitektur:

-   `PageLayout`
-   `PageArticleLayout`
-   `PageIndex`
-   `PageNavIndex`

Dokumen awal memakai penamaan React/TypeScript (`.tsx`) karena rancangan
awal membahas layout React. Untuk implementasi Astro yang kemudian
ditegaskan, file layout menggunakan ekstensi `.astro`, misalnya
`PageLayout.astro`, `PageArticleLayout.astro`, `PageIndex.astro`, dan
`PageNavIndex.astro`.

### 4.1 `PageLayout`

Layout dasar untuk kerangka halaman, termasuk struktur dokumen,
metadata, serta komponen bersama yang diperlukan.

### 4.2 `PageArticleLayout`

Layout halaman artikel. Rancangan awalnya memiliki area breadcrumb,
sidebar, konten utama, related content, dan aside.

### 4.3 `PageIndex`

Layout khusus homepage `/`.

-   Tidak memakai sidebar.
-   Tidak memakai aside.
-   Wajib memiliki `updated-article`.
-   `updated-article` menampilkan teaser artikel terbaru dalam bentuk
    card.
-   Jumlah teaser yang diminta: tiga artikel terbaru.

### 4.4 `PageNavIndex`

Layout untuk halaman menu `/menu` dan `/menu/*` pada rancangan awal.

-   Tidak memakai sidebar.
-   Wajib memiliki `related-article`.
-   Artikel harus relevan dengan menu/halaman.
-   Teaser dapat berupa card.
-   Jumlah teaser yang diminta: tiga artikel terkait/relevan.

Pola URL `/menu` dan `/menu/*` berasal dari rancangan awal. Rute aktual
website perizinan harus diselaraskan dengan struktur rute yang dipilih;
jangan menganggap rute contoh ini otomatis menjadi rute final semua
layanan.

## 5. Susunan breadcrumb, main, related content, sidebar, dan aside

Dalam rancangan layout awal:

-   Breadcrumb berada di atas area gabungan main.
-   Area main memuat node/konten utama dan related content.
-   Aside berada di sisi area konten dan membentang setinggi area node +
    related content.
-   Sidebar berada terpisah di sebelah kiri.
-   Susunan tersebut berlaku untuk layout yang membutuhkan
    sidebar/aside, bukan `PageIndex` atau `PageNavIndex` yang memiliki
    pengecualian di atas.

Sketsa konseptual:

``` text
Breadcrumb
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │ Main: Node/Konten + Related Content │ Aside         │
└──────────────────────────────────────────────────────────────┘
```

Sketsa ini menjelaskan hubungan area, bukan spesifikasi ukuran atau CSS
final.

## 6. Komponen bersama

Komponen bersama yang disebut dalam rancangan:

-   `PageHeader`
-   `PageFooter`
-   `PageBreadcrumb`
-   `PageSidebar`
-   `PageAside`
-   `PageRelatedContent`

Dalam struktur Astro, setiap komponen tersebut menjadi file terpisah,
misalnya `src/components/shared/PageHeader.astro`. Komponen menerima
data yang diperlukan dari sumber yang ditentukan, bukan menduplikasi
konten halaman secara hard-coded.

## 7. Komponen homepage

Contoh pemecahan homepage menjadi file komponen terpisah:

-   `HomeHero.astro`
-   `HomeServices.astro`
-   `HomeAdvantages.astro`
-   `HomeProcess.astro`
-   `PageUpdatedArticles.astro`
-   `HomeCTA.astro`

Nama-nama tersebut adalah komponen yang diusulkan dalam contoh struktur,
bukan pernyataan bahwa seluruh detail UI sudah final.

### Struktur direktori contoh

``` text
src/
├── config/
│   └── site.ts
├── content.config.ts
├── content/
│   ├── pages/
│   │   ├── home.md
│   │   ├── tentang-kami.md
│   │   └── kontak.md
│   ├── articles/
│   │   ├── artikel-01.md
│   │   ├── artikel-02.md
│   │   └── artikel-03.md
│   ├── categories/
│   └── authors/
├── layouts/
│   ├── PageLayout.astro
│   ├── PageArticleLayout.astro
│   ├── PageIndex.astro
│   └── PageNavIndex.astro
├── components/
│   ├── shared/
│   │   ├── PageHeader.astro
│   │   ├── PageFooter.astro
│   │   ├── PageBreadcrumb.astro
│   │   ├── PageSidebar.astro
│   │   ├── PageAside.astro
│   │   └── PageRelatedContent.astro
│   ├── homepage/
│   │   ├── HomeHero.astro
│   │   ├── HomeServices.astro
│   │   ├── HomeAdvantages.astro
│   │   ├── HomeProcess.astro
│   │   ├── PageUpdatedArticles.astro
│   │   └── HomeCTA.astro
│   └── services/
│       ├── ServiceCard.astro
│       └── ServiceGrid.astro
└── pages/
    ├── index.astro
    ├── tentang-kami.astro
    ├── kontak.astro
    ├── layanan/
    │   └── index.astro
    └── artikel/
        └── [...slug].astro
```

Ini struktur contoh yang pernah diusulkan. Rute, jumlah komponen, lokasi
folder, dan konfigurasi Content Collections final harus konsisten dengan
versi Astro serta struktur proyek yang benar-benar digunakan.

## 8. Frontmatter halaman depan yang dicontohkan

Contoh `src/content/pages/home.md` memuat kelompok data berikut:

-   `type`
-   `slug`
-   `title`
-   `description`
-   `hero`: `eyebrow`, `title`, `description`, `image`, `cta.label`,
    `cta.href`
-   `services`: `title`, `description`, `items[]` berisi `title`,
    `description`, `href`
-   `advantages`: `title`, `items[]` berisi `title`, `description`
-   `process`: `title`, `items[]` berisi `title`, `description`
-   `updatedArticles`: `title`, `description`, `limit`
-   `cta`: `title`, `description`, `label`, `href`
-   `draft`

Nilai teks dan contoh layanan yang pernah ditulis dalam contoh `home.md`
adalah konten contoh untuk menunjukkan struktur. Detailnya harus
diselaraskan dengan data awal pengguna dan dikonfirmasi jika ada
keraguan. Identitas perusahaan tidak boleh diisi dari contoh CSMS.

Markdown juga memiliki body setelah frontmatter. Jika seluruh konten
visual homepage sudah diwakili oleh komponen berdasarkan frontmatter,
body dapat tidak digunakan untuk bagian tersebut. Jika ada konten
editorial tambahan di body, konten itu dapat dirender secara terpisah.
Jangan menduplikasi isi yang sama di frontmatter, body, dan komponen.

## 9. Hubungan `index.astro`, Markdown, dan `PageIndex.astro`

Pola yang dijelaskan:

1.  `index.astro` mengambil entri `home` dari koleksi `pages`.
2.  `index.astro` mengambil data frontmatter entri.
3.  `index.astro` meneruskan data ke `PageIndex.astro`.
4.  `PageIndex.astro` meneruskan bagian data yang sesuai ke
    masing-masing komponen.
5.  Komponen menampilkan data yang diterimanya.

Contoh pola yang pernah diberikan:

``` astro
---
import { getEntry } from 'astro:content';
import PageIndex from '../layouts/PageIndex.astro';

const home = await getEntry('pages', 'home');

if (!home) {
  throw new Error('Konten halaman home.md tidak ditemukan.');
}

const { Content, headings } = await home.render();
const data = home.data;
---

<PageIndex
  data={data}
  Content={Content}
  headings={headings}
/>
```

Kode tersebut menjelaskan pola arsitektur. Detail API Content
Collections harus mengikuti versi Astro dan tipe koleksi yang digunakan.
Jangan menganggap contoh ini sudah diuji terhadap repositori aktual jika
repositori belum diperiksa.

## 10. `updated-article` harus dinamis

Ini adalah koreksi eksplisit pengguna terhadap rancangan sebelumnya.

-   Homepage harus memiliki `updated-article`.
-   Bagian itu dapat berupa card dengan teaser tiga artikel terbaru.
-   Data artikel tidak ditulis manual sebagai tiga item tetap di
    homepage.
-   Daftar artikel diambil dari koleksi `articles`.
-   Artikel draft tidak ditampilkan.
-   Artikel diurutkan menggunakan `updatedDate` jika tersedia dan
    `pubDate` sebagai alternatif, sesuai aturan yang dibahas.
-   Jumlah item mengikuti konfigurasi; contoh frontmatter menggunakan
    `limit: 3`.
-   Saat artikel baru ditambahkan atau diperbarui dan situs dibangun
    ulang, daftar dapat berubah tanpa mengedit homepage.

Astro yang menghasilkan HTML statis biasanya memperbarui hasil pada
build/deployment berikutnya. Mengedit Markdown saja tidak otomatis
mengubah HTML yang telah diterbitkan kecuali ada build, deployment, atau
mekanisme revalidasi yang dikonfigurasi.

## 11. `related-article` mengikuti halaman/menu

Kebutuhan eksplisit pengguna:

-   Halaman menu harus memiliki `related-article`.
-   Artikel yang ditampilkan harus relevan dengan menu/halaman tersebut.
-   Tampilan dapat berupa card teaser.
-   Contoh jumlah: tiga artikel terkait/relevan.
-   Hubungan artikel ditentukan melalui data/frontmatter atau mekanisme
    data yang jelas, bukan markup hard-coded di komponen.
-   Komponen menyajikan daftar artikel yang telah ditentukan atau
    dihitung dari data.

Dalam konteks skema yang pernah dibahas, `relatedArticleIds` adalah
salah satu field yang pernah dicontohkan untuk menghubungkan artikel.
Untuk relasi halaman layanan dengan artikel, pernah dicontohkan juga
`serviceSlug`. Field final harus sesuai skema aktual dan divalidasi;
jangan menambahkan field ke kode tanpa memperbarui skema.

## 12. Skema Content Collections yang diberikan pengguna

Skema di bawah adalah rekaman skema yang pernah diberikan pengguna,
bukan penggantian dengan skema baru.

### 12.1 Skema artikel

``` ts
const articleSchema = z.object({
  id: z.number().int().positive().optional(),
  ulid: z.string().optional(),
  type: z.literal('article'),
  title: z.string().min(1),
  description: z.string().min(1),
  pubDate: z.string().datetime({ offset: true }),
  updatedDate: z.string().datetime({ offset: true }).optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  image: z.string().optional(),
});
```

Catatan dari skema tersebut:

-   `id` opsional dan berupa bilangan bulat positif.
-   `ulid` opsional dan berupa string.
-   `type` harus bernilai literal `'article'`.
-   `pubDate` wajib dan menggunakan datetime dengan offset.
-   `updatedDate` opsional.
-   `tags` default array kosong.
-   `draft` default `false`.
-   Skema ini tidak mencantumkan `slug` sebagai field frontmatter. Dalam
    Astro Content Collections, `entry.slug` dapat berasal dari nama
    file/slug entri; jangan menganggap `slug` wajib ditambahkan ke
    frontmatter tanpa keputusan dan penyesuaian skema.

### 12.2 Skema halaman

``` ts
const pageSchema = z.object({
  id: z.number().int().positive().optional(),
  ulid: z.string().optional(),
  type: z.literal('page'),
  slug: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  pubDate: z.string().datetime({ offset: true }).optional(),
  updatedDate: z.string().datetime({ offset: true }).optional(),
  draft: z.boolean().default(false),
  image: z.string().optional(),
});
```

Catatan:

-   `type` harus bernilai literal `'page'`.
-   `slug` wajib dalam skema yang ditampilkan.
-   `title` wajib.
-   `description`, tanggal, dan `image` opsional.
-   `draft` default `false`.
-   Skema ini belum mencakup `hero`, `services`, `advantages`,
    `process`, `updatedArticles`, dan `cta`. Jika kelompok tersebut
    diletakkan di frontmatter, skema harus diperluas agar
    memvalidasinya.

### 12.3 Skema kategori

``` ts
const categorySchema = z.object({
  id: z.number().int().positive().optional(),
  ulid: z.string().optional(),
  type: z.literal('category'),
  slug: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
});
```

### 12.4 Skema penulis

``` ts
const authorSchema = z.object({
  id: z.number().int().positive().optional(),
  ulid: z.string().optional(),
  type: z.literal('author'),
  slug: z.string(),
  title: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});
```

### 12.5 Jenis koleksi

Pengguna menunjukkan konfigurasi:

``` ts
export const collections = {
  articles: defineCollection({
    type: 'content',
    schema: articleSchema,
  }),
  pages: defineCollection({
    type: 'content',
    schema: pageSchema,
  }),
  categories: defineCollection({
    type: 'data',
    schema: categorySchema,
  }),
  authors: defineCollection({
    type: 'data',
    schema: authorSchema,
  }),
};
```

Pemisahan yang diberikan:

-   `articles`: koleksi `content`.
-   `pages`: koleksi `content`.
-   `categories`: koleksi `data`.
-   `authors`: koleksi `data`.

Lokasi file konfigurasi yang pernah dibahas adalah
`src/content.config.ts` pada struktur paket Astro sebelumnya. Lokasi
final harus mengikuti versi Astro/proyek yang digunakan.

## 13. Penggunaan `id` dan `ulid`

Pengguna menyatakan `id` dan `ulid` harus tetap ada di frontmatter
secara lengkap sesuai pembahasan sebelumnya, dan meminta setiap
item/file dibuat terpisah.

Hal yang dapat dipastikan dari skema yang ditempel:

-   `id` adalah angka bulat positif dan opsional.
-   `ulid` adalah string dan opsional.

Hal yang tidak boleh diasumsikan tanpa keputusan tambahan:

-   `id` otomatis unik hanya karena tipenya positif.
-   `ulid` otomatis valid atau unik tanpa validasi.
-   Relasi artikel wajib memakai `id`; pembahasan menyebut `id` bisa
    digunakan untuk relasi, tetapi uniqueness dan konsistensinya harus
    dijaga.
-   Jika relasi menggunakan daftar ID seperti `relatedArticleIds`, field
    itu perlu dimasukkan ke skema yang relevan dan divalidasi.

Pada paket yang dibahas sebelumnya, contoh frontmatter artikel pernah
memuat `id`, `ulid`, `type`, `slug`, `title`, `description`, `pubDate`,
`updatedDate`, `author`, `category`, `tags`, `draft`, `image`,
`serviceSlug`, dan `relatedArticleIds`. Ini berbeda dari skema artikel
yang ditempel pengguna, yang tidak mencakup semua field tambahan
tersebut. Jangan mencampur keduanya tanpa menyelaraskan skema.

## 14. SEO dan metadata

Dalam revisi dokumen arsitektur, pengguna menegaskan agar cakupan SEO
tidak dihilangkan.

Kebutuhan yang disebut:

-   SEO meta.
-   Open Graph (OG).
-   Twitter Cards.
-   JSON-LD.
-   Metadata konsisten dengan data halaman.
-   JSON-LD dapat bersumber dari frontmatter atau konfigurasi/const yang
    relevan, sesuai jenis data.
-   Metadata global dan metadata halaman perlu dibedakan agar tidak
    terjadi duplikasi atau nilai yang tidak sesuai.

`SeoHead.astro` pernah direkomendasikan sebagai komponen untuk membentuk
metadata dari data yang diberikan. Ini nama komponen yang diusulkan,
bukan bukti bahwa file itu sudah terpasang di repositori.

SEO harus mencerminkan isi aktual halaman. Jangan membuat klaim
legalitas, sertifikasi, jaminan kelulusan, atau status resmi yang tidak
didukung informasi bisnis.

## 15. Identitas semantik pada elemen HTML

Pengguna secara eksplisit meminta **class semantik yang identik pada
setiap elemen HTML yang dirender**, termasuk `div` dan `button`,
walaupun elemen itu tidak memiliki CSS khusus.

Konsekuensi implementasi:

-   Elemen HTML yang dirender harus memiliki class semantik yang
    menjelaskan identitas/perannya.
-   Jangan hanya memberi class pada elemen besar dan membiarkan elemen
    lain tanpa identitas.
-   Nama class harus konsisten dan mudah ditelusuri.
-   Tailwind tetap digunakan untuk styling.
-   Identitas semantik class tidak boleh dihilangkan hanya karena tidak
    ada CSS khusus.

Contoh nama class dari kode yang pernah diberikan:

-   `home-hero`
-   `home-hero__content`
-   `home-hero__eyebrow`
-   `home-hero__title`
-   `home-hero__description`
-   `home-hero__cta`
-   `home-hero__media`
-   `home-hero__image`

Ini menunjukkan pola identitas komponen dan elemen. Aturan harus
diterapkan konsisten pada seluruh elemen yang dirender.

## 16. Tailwind dan tampilan

Keputusan pengguna:

-   Gunakan Tailwind.
-   Pertahankan pemisahan Markdown, layout, dan komponen.
-   Jangan mengganti arsitektur data-driven menjadi satu file
    `index.astro` monolitik.
-   Komponen harus terpisah agar setiap komponen dikelola dalam file
    sendiri.
-   Class semantik tetap ada pada elemen HTML, sekalipun Tailwind
    digunakan.
-   Hindari konten/struktur generik yang tidak sesuai informasi empiris
    dari pengguna.

## 17. Koreksi terhadap contoh `index.astro` monolitik

Sempat diberikan contoh `index.astro` yang berisi banyak bagian halaman
dalam satu file. Pengguna kemudian mengingatkan: "nggak jadi pakai .md
dan component seperti yang anda uraikan tadi ?"

Koreksi yang disepakati:

-   Arsitektur final harus memakai Markdown dan komponen terpisah.
-   `index.astro` monolitik hanya dapat diperlakukan sebagai draft
    visual/contoh awal, bukan implementasi final.
-   Data halaman harus disimpan di frontmatter Markdown.
-   Layout dan komponen menerima data melalui props.
-   Satu komponen berada dalam satu file `.astro`.
-   Jangan kembali menggabungkan seluruh halaman ke satu file.

## 18. Contoh susunan komponen homepage

Contoh susunan dalam `PageIndex.astro`:

``` astro
<PageLayout
  title={data.title}
  description={data.description}
>
  <main class="page-index">
    <HomeHero hero={data.hero} />
    <HomeServices services={data.services} />
    <HomeAdvantages advantages={data.advantages} />
    <HomeProcess process={data.process} />
    <PageUpdatedArticles config={data.updatedArticles} />
    <HomeCTA cta={data.cta} />
  </main>
</PageLayout>
```

Ini contoh pemetaan data ke komponen. Komponen menerima bagian
frontmatter yang menjadi tanggung jawabnya. Teks layanan tidak perlu
ditulis ulang di komponen jika data sudah disediakan melalui
frontmatter.

Contoh `HomeHero.astro` menerima prop `hero`, kemudian menampilkan
`eyebrow`, `title`, `description`, `image`, dan `cta`. Contoh itu juga
memakai class semantik pada elemen.

## 19. `site.ts` dan konfigurasi global

`site.ts` pernah disiapkan sebagai konfigurasi situs. Namun, pengguna
menjelaskan bahwa `site.ts` dari contoh CSMS bukan identitas bisnis yang
akan digunakan.

Prinsip untuk `site.ts` baru:

-   Berisi konfigurasi global yang memang diperlukan di banyak halaman.
-   Dapat menjadi sumber domain, nama situs/perusahaan yang telah
    dikonfirmasi, logo, gambar Open Graph, kontak, bahasa/locale, dan
    data global lain jika sudah diketahui.
-   Tidak boleh menyalin identitas dari contoh CSMS.
-   Tidak menggantikan frontmatter sebagai sumber data halaman.
-   Data yang belum diketahui tetap placeholder atau belum diisi, bukan
    direkayasa.

## 20. Paket file yang pernah disebutkan

Dalam percakapan sebelumnya, pernah disebutkan paket ZIP berisi 55 file
beserta manifest; file `site.ts` dan contoh `index.astro` juga pernah
dibuat.

Paket itu dijelaskan menggunakan Markdown/content collections dan
frontmatter, file `.astro` terpisah untuk halaman/layout/komponen,
Tailwind, metadata SEO termasuk OG/Twitter Cards/JSON-LD, daftar artikel
terbaru maksimal tiga item, daftar artikel terkait, serta contoh
frontmatter artikel dengan `id`, `ulid`, dan field hubungan.

Namun, diskusi berikutnya mengoreksi pendekatan monolitik dan menegaskan
kembali bahwa semua data halaman harus berada di frontmatter dan setiap
komponen harus memiliki file tersendiri. Keputusan yang lebih akhir ini
menjadi pedoman. Jangan menganggap contoh monolitik sebagai hasil final
arsitektur. Jika paket lama digunakan, isinya perlu dibandingkan dengan
aturan final dan diperbaiki bila bertentangan.

## 21. Hal yang belum dipastikan dalam diskusi

Untuk menghindari dugaan menjadi fakta, hal-hal berikut belum
dipastikan:

1.  Nama legal dan nama dagang perusahaan konsultan.
2.  Domain final website.
3.  Alamat kantor, telepon, WhatsApp, email, media sosial, koordinat,
    dan jam operasional.
4.  Logo dan gambar hero final.
5.  Daftar final seluruh layanan dan cakupan detail tiap layanan.
6.  URL final untuk setiap layanan dan artikel.
7.  Versi Astro pada repositori aktual.
8.  Skema final untuk seluruh field homepage di frontmatter.
9.  Apakah field tambahan seperti `serviceSlug` dan `relatedArticleIds`
    sudah diterapkan ke skema aktual.
10. Apakah `id` dan `ulid` wajib diisi pada setiap entri meskipun contoh
    skema yang ditempel menandainya opsional. Pengguna meminta keduanya
    ada secara lengkap sesuai pembahasan; implementasi berikutnya harus
    mempertahankan kebutuhan tersebut atau meminta klarifikasi sebelum
    mengubahnya.
11. Aturan final pembentukan URL artikel dan halaman layanan.
12. Apakah body Markdown dipakai untuk konten editorial tambahan pada
    homepage atau homepage sepenuhnya disajikan melalui frontmatter dan
    komponen.

## 22. Checklist kepatuhan implementasi

### Konten dan data

-   [ ] Data khusus halaman berasal dari frontmatter Markdown.
-   [ ] Satu halaman konten menggunakan satu file Markdown.
-   [ ] Data tidak diduplikasi dalam frontmatter, komponen, dan
    `site.ts`.
-   [ ] `id` dan `ulid` ditangani sesuai keputusan proyek.
-   [ ] Skema Zod sesuai seluruh field frontmatter.
-   [ ] Tidak ada identitas bisnis yang diambil dari contoh CSMS.
-   [ ] Konten dan klaim layanan tidak direkayasa.

### Struktur file

-   [ ] Setiap komponen berada dalam file `.astro` tersendiri.
-   [ ] `index.astro` membaca entri Markdown dan meneruskan data.
-   [ ] `PageIndex.astro` mengatur susunan homepage.
-   [ ] Layout dan komponen menerima data melalui props.
-   [ ] Tidak ada halaman monolitik yang menggantikan arsitektur
    komponen.
-   [ ] Struktur folder dan Content Collections cocok dengan versi Astro
    proyek.

### Artikel

-   [ ] Homepage mempunyai `updated-article`.
-   [ ] `updated-article` mengambil data dari koleksi artikel, bukan
    daftar manual.
-   [ ] Artikel draft tidak ditampilkan.
-   [ ] Urutan menggunakan `updatedDate` bila tersedia dan `pubDate`
    sebagai alternatif, sesuai aturan yang disepakati.
-   [ ] Jumlah default teaser tiga, kecuali konfigurasi frontmatter
    menetapkan nilai lain.
-   [ ] Halaman menu/layanan memiliki `related-article` sesuai
    kebutuhan.
-   [ ] Relasi artikel divalidasi dan tidak mengandalkan ID yang tidak
    unik.
-   [ ] Perubahan daftar artikel dipahami dalam konteks build/deployment
    atau revalidasi.

### SEO dan HTML

-   [ ] Metadata SEO berasal dari data yang tepat.
-   [ ] Open Graph tersedia.
-   [ ] Twitter Cards tersedia.
-   [ ] JSON-LD tersedia sesuai kebutuhan halaman dan data yang
    didukung.
-   [ ] Setiap elemen HTML yang dirender mempunyai class semantik
    konsisten.
-   [ ] Tailwind digunakan.
-   [ ] Class semantik tidak dihilangkan hanya karena elemen tidak
    memiliki CSS khusus.

## 23. Ringkasan keputusan final yang harus dijaga

1.  Website yang dibahas adalah website **konsultan perizinan usaha dan
    HAKI**, bukan website CSMS.
2.  Informasi CSMS hanya contoh dan tidak boleh menjadi identitas bisnis
    baru.
3.  **Semua data khusus halaman berada di frontmatter Markdown.**
4.  Template dan komponen hanya menerima dan menyajikan data melalui
    props.
5.  **Satu komponen = satu file `.astro`.**
6.  **Satu halaman/artikel = satu file Markdown.**
7.  `index.astro` menjadi penghubung entri Markdown dengan layout.
8.  `PageIndex` untuk homepage tidak memakai sidebar/aside dan wajib
    menampilkan `updated-article`.
9.  `PageNavIndex` untuk halaman menu tidak memakai sidebar dan wajib
    menampilkan `related-article`.
10. `updated-article` mengambil tiga artikel terbaru secara dinamis,
    bukan hard-coded.
11. `related-article` menampilkan artikel yang relevan dengan
    halaman/menu.
12. Layout yang dibahas: `PageLayout`, `PageArticleLayout`, `PageIndex`,
    `PageNavIndex`.
13. Komponen bersama: `PageHeader`, `PageFooter`, `PageBreadcrumb`,
    `PageSidebar`, `PageAside`, `PageRelatedContent`.
14. SEO mencakup meta, Open Graph, Twitter Cards, dan JSON-LD.
15. Setiap elemen HTML yang dirender harus memiliki class semantik
    konsisten, termasuk `div` dan `button`.
16. Gunakan Tailwind tanpa menghilangkan identitas semantik class.
17. Pertahankan skema koleksi yang telah diberikan dan selaraskan skema
    jika frontmatter diperluas.
18. Jangan membuat klaim, identitas, kontak, atau detail bisnis yang
    tidak berasal dari informasi yang tersedia.
19. Resume dan implementasi harus mengikuti data empirik diskusi, bukan
    mengganti keputusan dengan asumsi atau rancangan baru.
20. Contoh kode yang diberikan selama diskusi merupakan contoh pola
    kecuali dinyatakan sudah diuji terhadap repositori aktual.

------------------------------------------------------------------------

**Acuan utama untuk pekerjaan selanjutnya:** gunakan bagian 3, 10, 11,
12, 14, 15, 17, dan 22 sebagai aturan pemeriksaan wajib. Jika contoh
lama bertentangan dengan keputusan yang ditegaskan kemudian---terutama
penggunaan file monolitik---ikuti keputusan yang lebih akhir: data di
frontmatter Markdown dan setiap komponen di file Astro terpisah.
