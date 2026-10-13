# Usulan Arsitektur Component Astro untuk Website Jasa Perizinan dan HAKI

Saya akan melihat proyek `jasa-perijinan-haki` dari sudut pandang senior developer: bukan sekadar menambahkan komponen agar website terlihat menarik, tetapi membangun **sistem publikasi konten yang modular, dinamis untuk SEO, mudah dikembangkan, dan dapat dikelola melalui Markdown frontmatter**.

Repositori yang menjadi acuan:

- **Repository:** [arisciwek/jasa-perijinan-haki](https://github.com/arisciwek/jasa-perijinan-haki)
- **Shared components:** [src/components/shared](https://github.com/arisciwek/jasa-perijinan-haki/tree/main/src/components/shared)
- **Artikel:** [src/content/articles](https://github.com/arisciwek/jasa-perijinan-haki/tree/main/src/content/articles)

Ada satu prinsip yang ingin saya pertahankan dari pembahasan kita sebelumnya: **data konten tetap menjadi sumber utama, sedangkan komponen Astro bertugas merender data tersebut.** Kita tidak perlu membuat halaman yang isinya ditulis ulang secara statis di dalam setiap template.

Dengan pendekatan ini, satu komponen dapat digunakan oleh banyak artikel, sementara setiap artikel tetap memiliki susunan konten, identitas, dan kebutuhan SEO masing-masing.

Catatan: saya sudah mencoba membuka kedua direktori GitHub tersebut, tetapi antarmuka web yang tersedia tidak berhasil menampilkan isi direktori. Jadi, usulan berikut adalah rancangan arsitektur dan ide pengembangan yang perlu dicocokkan dengan kode aktual—bukan klaim bahwa seluruh komponen yang saya usulkan belum ada di repositori Anda.

## 1. Prinsip arsitektur yang saya rekomendasikan

Saya akan membagi komponen menjadi tiga kelompok berdasarkan tanggung jawabnya.

| Kelompok | Tanggung jawab | Contoh |
|---|---|---|
| Shared UI | Elemen visual yang dipakai berulang kali | Card, badge, button, callout |
| Content blocks | Menampilkan jenis informasi tertentu di dalam artikel | Timeline, checklist, tabel perbandingan |
| Page composition | Menyusun komponen menjadi halaman dengan tujuan tertentu | Article page, service page, homepage |

Pemisahan ini penting. Tidak semua komponen harus masuk ke direktori `shared`, dan tidak semua komponen konten perlu mengetahui struktur halaman yang menggunakannya.

Misalnya, `ServiceCard.astro` bertanggung jawab menampilkan satu layanan. Sementara `RelatedServices.astro` bertanggung jawab memilih dan menyusun beberapa layanan terkait. Keduanya berhubungan, tetapi tanggung jawabnya berbeda.

### Struktur direktori yang saya usulkan

Berikut contoh struktur target, bukan pernyataan bahwa struktur ini sudah ada di repositori Anda.

```text
src/
├── components/
│   ├── shared/
│   │   ├── Button.astro
│   │   ├── Badge.astro
│   │   ├── Card.astro
│   │   ├── Icon.astro
│   │   └── Callout.astro
│   │
│   ├── blocks/
│   │   ├── article/
│   │   │   ├── QuickAnswer.astro
│   │   │   ├── KeyTakeaways.astro
│   │   │   ├── TableOfContents.astro
│   │   │   ├── ProcessTimeline.astro
│   │   │   ├── RequirementChecklist.astro
│   │   │   ├── ComparisonTable.astro
│   │   │   ├── FAQ.astro
│   │   │   └── LegalReferences.astro
│   │   │
│   │   ├── conversion/
│   │   │   ├── ServiceCTA.astro
│   │   │   ├── WhatsAppCTA.astro
│   │   │   └── ConsultationCTA.astro
│   │   │
│   │   ├── discovery/
│   │   │   ├── RelatedArticles.astro
│   │   │   ├── LatestArticles.astro
│   │   │   └── RelatedServices.astro
│   │   │
│   │   └── trust/
│   │       ├── AuthorProfile.astro
│   │       ├── ReviewerProfile.astro
│   │       ├── UpdateInformation.astro
│   │       └── SourceReferences.astro
│   │
│   ├── article/
│   │   ├── ArticleHeader.astro
│   │   ├── ArticleBody.astro
│   │   └── ArticleFooter.astro
│   │
│   └── service/
│       ├── ServiceHero.astro
│       ├── ServiceOverview.astro
│       └── ServicePageFooter.astro
│
├── content/
│   ├── articles/
│   └── services/
│
├── layouts/
│   ├── BaseLayout.astro
│   ├── ArticleLayout.astro
│   └── ServiceLayout.astro
│
└── pages/
```

Anda tidak harus langsung membuat semua file tersebut. Struktur ini merupakan arah pengembangan yang bisa diterapkan bertahap setelah komponen yang sudah ada diperiksa.

**Prinsip penting:** satu komponen sebaiknya memiliki satu tanggung jawab yang jelas. Namun, jangan memecah setiap elemen HTML menjadi file tersendiri tanpa manfaat nyata. Pemisahan menjadi file khusus paling berguna ketika sebuah blok memiliki struktur, data, atau perilaku yang bisa digunakan kembali.

---

## 2. Ide komponen konten yang paling bernilai

Untuk website jasa konsultan perizinan dan HAKI, saya tidak akan memulai dari komponen dekoratif. Saya akan memprioritaskan komponen yang membantu pengunjung memahami persyaratan, mengambil keputusan, dan menghubungi konsultan.

### A. `QuickAnswer.astro` — Jawaban langsung di awal artikel

**Prioritas: sangat tinggi.**

Pengunjung yang mencari informasi perizinan sering kali ingin segera mengetahui jawaban atas pertanyaan tertentu.

Contohnya:

- Apa itu NIB?
- Apakah merek harus didaftarkan?
- Berapa lama proses pendaftaran merek?
- Apa perbedaan hak cipta dan merek?
- Dokumen apa yang diperlukan untuk mendirikan badan usaha?

Komponen ini menampilkan jawaban ringkas setelah pendahuluan atau di dekat bagian yang relevan.

Contoh frontmatter:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9X1YZ"
    type: "quick-answer"
    data:
      title: "Apa itu NIB?"
      answer: >-
        Nomor Induk Berusaha (NIB) merupakan identitas
        pelaku usaha yang diterbitkan melalui sistem OSS.
      articleId: "01J9Q2K7M8N4P6R3T5V7W9X1YZ"
```

Nilai `id` di atas hanya contoh format ULID, bukan ID artikel aktual.

Keunggulan desain ini adalah jawaban dapat dikelola melalui frontmatter tanpa harus mengubah kode komponen.

Komponen sebaiknya tidak menambahkan judul yang duplikatif jika artikel sudah mempunyai heading dengan tujuan yang sama.

### B. `KeyTakeaways.astro` — Ringkasan hal terpenting

**Prioritas: tinggi.**

Berbeda dari `QuickAnswer`, komponen ini merangkum beberapa poin penting yang perlu dipahami pembaca.

Contoh:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XA"
    type: "key-takeaways"
    data:
      title: "Hal Penting yang Perlu Dipahami"
      items:
        - "Persyaratan dapat berbeda menurut jenis layanan."
        - "Dokumen harus sesuai dengan kondisi pemohon."
        - "Status pengajuan perlu dipantau selama proses."
```

Manfaatnya:

- Membantu pembaca memahami inti artikel.
- Mempermudah pembaca yang melakukan pemindaian cepat.
- Menjaga penyajian informasi tetap konsisten di berbagai artikel.

Saya akan membedakan komponen ini dari kotak jawaban singkat. Jika keduanya selalu menampilkan isi yang sama, salah satunya tidak diperlukan.

### C. `ProcessTimeline.astro` — Visualisasi tahapan pengurusan

**Prioritas: sangat tinggi.**

Menurut saya, ini salah satu komponen yang paling relevan untuk website Anda.

Banyak layanan perizinan mempunyai proses berurutan. Daripada seluruhnya ditulis sebagai paragraf panjang, tahapan dapat ditampilkan sebagai timeline.

Contoh penggunaan:

- Tahapan pengurusan NIB.
- Prosedur pendaftaran merek.
- Proses pencatatan hak cipta.
- Tahapan pendirian badan usaha.
- Proses pengurusan izin usaha tertentu.

Contoh data:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XB"
    type: "process-timeline"
    data:
      title: "Tahapan Pengurusan"
      steps:
        - title: "Konsultasi awal"
          description: "Identifikasi kebutuhan dan kondisi pemohon."
        - title: "Pemeriksaan dokumen"
          description: "Periksa kelengkapan dan kesesuaian dokumen."
        - title: "Pengajuan"
          description: "Ajukan permohonan melalui jalur yang berlaku."
        - title: "Pemantauan"
          description: "Pantau status dan tindak lanjuti jika diperlukan."
```

Tahapan di atas merupakan ilustrasi umum, bukan prosedur resmi untuk semua jenis perizinan.

**Ide pengembangannya:** komponen yang sama dapat ditampilkan vertikal pada ponsel dan horizontal pada desktop tanpa mengubah data Markdown.

### D. `RequirementChecklist.astro` — Checklist persyaratan

**Prioritas: sangat tinggi.**

Pembaca artikel perizinan biasanya mempunyai kebutuhan praktis: mereka ingin tahu apa yang harus dipersiapkan.

Contoh:

- Persyaratan pendaftaran merek.
- Dokumen pendirian PT.
- Data untuk pengurusan NIB.
- Dokumen pendukung permohonan hak cipta.

Contoh frontmatter:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XC"
    type: "requirement-checklist"
    data:
      title: "Dokumen yang Perlu Dipersiapkan"
      description: "Periksa dokumen sesuai jenis permohonan."
      items:
        - label: "Identitas pemohon"
          required: true
        - label: "Informasi objek permohonan"
          required: true
        - label: "Dokumen pendukung"
          required: true
```

Atribut `required` harus mengikuti persyaratan aktual untuk layanan yang dibahas. Jangan mengasumsikan bahwa semua dokumen tersebut wajib dalam setiap kasus.

Komponen ini juga bisa dikembangkan menjadi dua varian:

1. **Checklist informatif:** hanya untuk dibaca.
2. **Checklist interaktif:** pengunjung dapat mencentang dokumen yang sudah tersedia.

Untuk versi interaktif, status centang cukup disimpan di browser apabila tidak memerlukan akun pengguna. Tidak perlu menambahkan backend hanya untuk fungsi sederhana tersebut.

### E. `ComparisonTable.astro` — Tabel perbandingan

**Prioritas: tinggi.**

Banyak artikel dapat dibuat lebih mudah dipahami dengan membandingkan dua atau lebih pilihan.

Contoh:

- PT dan PT Perorangan.
- Merek dan hak cipta.
- Pendaftaran merek dan pencatatan hak cipta.
- Pengurusan mandiri dan menggunakan jasa konsultan.

Contoh data:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XD"
    type: "comparison-table"
    data:
      title: "Perbandingan Merek dan Hak Cipta"
      columns:
        - "Aspek"
        - "Merek"
        - "Hak Cipta"
      rows:
        - - "Objek perlindungan"
          - "Tanda pembeda barang atau jasa"
          - "Ciptaan dalam bidang ilmu pengetahuan, seni, dan sastra"
        - - "Fokus"
          - "Identitas komersial"
          - "Ekspresi suatu ciptaan"
```

Contoh ini bersifat ringkas. Penjelasan hukum lengkap harus disesuaikan dengan peraturan yang berlaku.

Saya akan membuat komponen tabel yang responsif dan dapat menampilkan data dengan jumlah kolom berbeda, bukan membuat file Astro terpisah untuk setiap jenis perbandingan.

### F. `LegalReferences.astro` — Referensi hukum

**Prioritas: sangat tinggi untuk website perizinan.**

Ini komponen yang menurut saya patut mendapat perhatian khusus.

Artikel hukum dan perizinan sebaiknya tidak hanya menyampaikan informasi, tetapi juga memberikan rujukan yang dapat diperiksa pembaca.

Contoh penggunaannya:

- Dasar hukum pendaftaran merek.
- Peraturan tentang hak cipta.
- Ketentuan pendirian badan usaha.
- Regulasi yang berkaitan dengan layanan perizinan tertentu.

Contoh frontmatter:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XE"
    type: "legal-references"
    data:
      title: "Dasar Hukum"
      references:
        - title: "Undang-Undang tentang Merek dan Indikasi Geografis"
          number: "20 Tahun 2016"
          url: "https://peraturan.bpk.go.id/"
          note: "Periksa status dan perubahan peraturan."
```

URL tersebut hanya contoh alamat portal rujukan, bukan tautan langsung ke dokumen peraturan tertentu.

Implementasi sebaiknya menyimpan nomor peraturan, judul, tautan resmi, dan informasi perubahan bila relevan. Jangan membuat referensi hukum otomatis berdasarkan asumsi.

Komponen ini membantu membedakan website yang hanya berisi artikel pemasaran dari website yang menyediakan informasi hukum dengan sumber yang bisa ditelusuri.

---

## 3. Komponen yang menghubungkan artikel dengan layanan

Di sinilah saya melihat peluang yang cukup besar untuk website Anda.

Artikel tidak seharusnya menjadi halaman yang berdiri sendiri. Artikel dapat membantu pengunjung menemukan layanan yang tepat, sedangkan halaman layanan dapat mengarahkan pengunjung ke artikel yang menjawab pertanyaan mereka.

### G. `RelatedServices.astro`

Menampilkan layanan yang berkaitan dengan pembahasan artikel.

Contoh:

Artikel: *Cara Mendaftarkan Merek Dagang*

Layanan terkait:

- Jasa pendaftaran merek.
- Konsultasi HAKI.
- Pemeriksaan awal kebutuhan pendaftaran merek.

Data artikel dapat menyimpan ID layanan yang relevan:

```yaml
relatedServices:
  - "01J9Q2K7M8N4P6R3T5V7W9XF"
  - "01J9Q2K7M8N4P6R3T5V7W9XG"
```

Komponen kemudian mengambil data layanan berdasarkan ID tersebut.

Dengan begitu, judul, deskripsi, URL, dan informasi layanan tetap bersumber dari satu tempat.

### H. `RelatedArticles.astro`

Menampilkan artikel yang berkaitan secara tematis.

Misalnya, artikel mengenai pendaftaran merek dapat mengarahkan pembaca ke:

- Persyaratan pendaftaran merek.
- Cara memilih kelas merek.
- Proses pemeriksaan permohonan.
- Penyebab permohonan merek menghadapi kendala.

Saya menyarankan hubungan artikel ditentukan melalui ID atau relasi konten yang eksplisit jika relevansi sangat penting. Jangan mengandalkan kesamaan kata kunci saja.

### I. `ServiceCTA.astro`

Komponen ajakan menghubungi konsultan yang dapat digunakan kembali di berbagai halaman.

Contoh data:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XH"
    type: "service-cta"
    data:
      title: "Membutuhkan Bantuan Pengurusan?"
      description: >-
        Diskusikan kebutuhan perizinan Anda untuk mengetahui
        dokumen dan tahapan yang perlu dipersiapkan.
      buttonText: "Konsultasi Sekarang"
      serviceId: "01J9Q2K7M8N4P6R3T5V7W9XF"
```

Keuntungan utamanya adalah perubahan pesan CTA dapat dilakukan secara konsisten, tanpa mengedit setiap komponen artikel.

Saya tidak menyarankan CTA yang terlalu agresif setelah setiap heading. Lebih baik menempatkannya setelah pembaca mendapatkan informasi yang cukup, misalnya setelah persyaratan, tahapan, atau penjelasan pilihan layanan.

---

## 4. Ide yang lebih inovatif: komponen yang membantu pengunjung mengambil keputusan

Komponen sebelumnya merupakan fondasi yang bagus. Namun, jika saya mengembangkan website ini untuk jangka panjang, saya akan mempertimbangkan beberapa komponen yang lebih interaktif dan kontekstual.

### J. `DecisionGuide.astro` — Panduan menentukan layanan yang tepat

Ini salah satu ide yang paling saya rekomendasikan.

Pengunjung sering kali belum mengetahui jenis layanan yang sebenarnya mereka butuhkan. Mereka mungkin hanya mengetahui masalahnya.

Contohnya:
- Saya ingin melindungi nama bisnis.
- Saya ingin melindungi logo.
- Saya ingin melindungi buku yang saya tulis.
- Saya ingin mendirikan badan usaha.
- Saya ingin mengurus izin untuk menjalankan usaha.

Alih-alih langsung menawarkan jasa, website dapat membantu pengunjung memahami pilihan yang relevan.

Contoh konfigurasi:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XJ"
    type: "decision-guide"
    data:
      title: "Apa yang Ingin Anda Lindungi?"
      description: "Pilih tujuan Anda untuk melihat informasi yang relevan."
      questions:
        - id: "01J9Q2K7M8N4P6R3T5V7W9XK"
          question: "Apa yang ingin Anda lindungi?"
          options:
            - label: "Nama atau identitas merek"
              resultId: "01J9Q2K7M8N4P6R3T5V7W9XL"
            - label: "Karya tulis atau karya seni"
              resultId: "01J9Q2K7M8N4P6R3T5V7W9XM"
      results:
        - id: "01J9Q2K7M8N4P6R3T5V7W9XL"
          title: "Informasi Pendaftaran Merek"
          serviceId: "01J9Q2K7M8N4P6R3T5V7W9XF"
        - id: "01J9Q2K7M8N4P6R3T5V7W9XM"
          title: "Informasi Pencatatan Hak Cipta"
          serviceId: "01J9Q2K7M8N4P6R3T5V7W9XG"
```

ID pada contoh ini merupakan ilustrasi. Sebelum implementasi, skema tersebut perlu disesuaikan dengan content collection dan model relasi aktual.

**Mengapa saya menganggapnya menarik?**

Karena website tidak hanya menyajikan informasi, tetapi juga membantu pengunjung menemukan informasi yang sesuai dengan kebutuhannya.

Ada dua batasan yang perlu diperhatikan:

1. Panduan tidak boleh memberikan kepastian hukum berdasarkan jawaban sederhana.
2. Hasilnya harus berupa informasi awal, bukan pengganti pemeriksaan oleh konsultan.

Untuk versi awal, saya akan membuatnya menggunakan interaksi JavaScript sederhana tanpa backend.

### K. `EligibilityGuide.astro` — Panduan persiapan sebelum mengajukan permohonan

Komponen ini berbeda dari `RequirementChecklist`.

Checklist menjawab:

> Apa saja dokumen yang perlu dipersiapkan?

Sementara panduan persiapan menjawab:

> Apakah saya sudah memiliki informasi yang cukup untuk memulai proses ini?

Contoh untuk calon pemohon pendaftaran merek:

- Apakah nama atau tanda yang akan diajukan sudah ditentukan?
- Apakah identitas pemohon sudah tersedia?
- Apakah barang atau jasa yang akan menggunakan merek sudah diidentifikasi?
- Apakah pemohon memahami bahwa ketersediaan merek perlu diperiksa?

Hasil akhirnya dapat berupa daftar hal yang perlu ditindaklanjuti.

Saya tidak akan menampilkan hasil seperti *"Merek Anda pasti bisa didaftarkan"*. Hasil yang lebih bertanggung jawab adalah *"Anda sudah mengidentifikasi beberapa informasi awal, tetapi kelayakan permohonan tetap memerlukan pemeriksaan lebih lanjut."*

### L. `CostBreakdown.astro` — Rincian biaya

Komponen ini dapat digunakan untuk artikel yang membahas biaya pendirian badan usaha, pendaftaran merek, atau layanan perizinan lainnya.

Data sebaiknya memisahkan:

- Biaya resmi pemerintah.
- Biaya jasa konsultan.
- Biaya pihak ketiga, jika ada.
- Komponen biaya lain yang benar-benar berlaku.
- Tanggal terakhir informasi diperiksa.

Contoh:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XN"
    type: "cost-breakdown"
    data:
      title: "Komponen Biaya Pengurusan"
      currency: "IDR"
      lastVerified: "2026-10-13"
      items:
        - label: "Biaya resmi"
          amount: null
          note: "Periksa tarif resmi yang berlaku."
        - label: "Jasa konsultan"
          amount: null
          note: "Berdasarkan ruang lingkup layanan."
      disclaimer: >-
        Total biaya bergantung pada jenis permohonan,
        ketentuan yang berlaku, dan ruang lingkup layanan.
```

Saya sengaja menggunakan `null` untuk nominal yang belum diverifikasi. Lebih baik tidak menampilkan angka daripada memberikan informasi biaya yang keliru.

Jika nanti nominal diisi, komponen dapat menghitung subtotal dan total secara otomatis. Namun, perhitungan tidak boleh menyamarkan komponen biaya yang belum diketahui.

### M. `CaseStudy.astro` — Studi kasus atau ilustrasi kasus

Komponen ini cocok untuk menjelaskan masalah yang dihadapi calon pengguna jasa dan bagaimana proses penanganannya.

Misalnya:

**Masalah:** Pelaku usaha ingin mendaftarkan merek, tetapi belum memahami perbedaan antara nama perusahaan dan merek dagang.

**Analisis awal:** Kebutuhan perlindungan perlu diidentifikasi terlebih dahulu berdasarkan objek yang ingin dilindungi.

**Tindak lanjut:** Pemeriksaan kebutuhan, penelusuran informasi yang relevan, dan penjelasan tahapan pengajuan.

Komponen ini sebaiknya mendukung penanda:

- Kasus nyata dengan izin publikasi.
- Kasus anonim yang telah disamarkan.
- Ilustrasi hipotetis.

Jangan membuat testimoni, keberhasilan pengurusan, atau kasus klien fiktif seolah-olah merupakan pengalaman nyata.

---

## 5. Komponen khusus untuk kualitas informasi dan kepercayaan

Untuk website konsultan perizinan dan HAKI, saya tidak akan menganggap SEO hanya sebagai persoalan keyword, heading, dan internal link.

Kualitas informasi, kejelasan sumber, serta transparansi mengenai siapa yang menyusun informasi juga perlu diperhatikan.

Saya merekomendasikan komponen berikut.

| Komponen | Fungsi | Prioritas |
|---|---|---|
| `AuthorProfile.astro` | Menampilkan penulis artikel | Tinggi |
| `ReviewerProfile.astro` | Menampilkan pemeriksa substansi, jika ada | Tinggi |
| `UpdateInformation.astro` | Menampilkan tanggal publikasi dan pembaruan | Tinggi |
| `SourceReferences.astro` | Menampilkan sumber informasi | Sangat tinggi |
| `LegalReferences.astro` | Menampilkan dasar hukum yang relevan | Sangat tinggi |
| `Disclaimer.astro` | Menjelaskan batasan informasi | Tinggi |
| `RelatedRegulations.astro` | Menghubungkan artikel dengan peraturan terkait | Menengah |
| `CorrectionNotice.astro` | Menjelaskan koreksi substansial jika diperlukan | Menengah |

Ada satu hal penting: tanggal pembaruan jangan berubah hanya karena halaman dibangun ulang.

Nilai `updatedAt` sebaiknya menggambarkan pembaruan konten yang benar-benar dilakukan, bukan tanggal build Astro.

Begitu juga dengan informasi pemeriksa. Nama pemeriksa hanya boleh ditampilkan jika memang ada pemeriksaan yang dilakukan.

---

# 6. Ide yang paling penting untuk arsitektur Anda: sistem block berbasis frontmatter

Sekarang kita masuk ke bagian yang menurut saya paling menentukan.

Anda sudah mengarahkan pengembangan ke pola bahwa data berada di frontmatter Markdown, sementara komponen Astro menerima data tersebut dan merendernya.

Saya menyarankan agar pola ini dikembangkan menjadi **sistem content blocks dengan kontrak data yang jelas**.

Tujuannya bukan sekadar membuat banyak komponen. Tujuannya adalah agar penambahan jenis blok baru tidak mengharuskan kita mengubah struktur dasar setiap artikel.

## 6.1. Setiap block mempunyai identitas dan tipe

Contoh:

```yaml
---
id: "01J9Q2K7M8N4P6R3T5V7W9XP"
title: "Cara Mengurus Pendaftaran Merek"
slug: "cara-mengurus-pendaftaran-merek"
type: "article"

blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XQ"
    type: "quick-answer"
    data:
      title: "Apa itu pendaftaran merek?"
      answer: "Penjelasan singkat mengenai pendaftaran merek."

  - id: "01J9Q2K7M8N4P6R3T5V7W9XR"
    type: "process-timeline"
    data:
      title: "Tahapan Pendaftaran"
      steps:
        - title: "Persiapan"
          description: "Siapkan informasi dan dokumen yang diperlukan."
        - title: "Pengajuan"
          description: "Lakukan pengajuan sesuai prosedur yang berlaku."

  - id: "01J9Q2K7M8N4P6R3T5V7W9XS"
    type: "requirement-checklist"
    data:
      title: "Persiapan Dokumen"
      items:
        - label: "Identitas pemohon"
          required: true

  - id: "01J9Q2K7M8N4P6R3T5V7W9XT"
    type: "service-cta"
    data:
      title: "Butuh Bantuan?"
      description: "Diskusikan kebutuhan Anda dengan konsultan."
---
```

Ini hanya contoh skema untuk menjelaskan ide. Implementasinya harus mengikuti struktur frontmatter dan content collection yang benar-benar digunakan oleh repositori Anda.

Saya akan mempertahankan tiga identitas yang berbeda:

- **ID artikel:** identitas unik konten.
- **ID block:** identitas unik satu blok di dalam konten.
- **Type block:** menentukan komponen Astro yang akan digunakan.

Dengan begitu, dua block bisa memiliki tipe yang sama tetapi data berbeda.

ID sebaiknya tidak berubah hanya karena judul atau isi block diedit.

Untuk ULID, kita juga perlu menjaga konsistensi format dan validasinya. Jangan menganggap bahwa semua string yang panjangnya sesuai otomatis merupakan ULID yang valid.

## 6.2. Setiap tipe block memiliki satu komponen Astro

Contoh pemetaan:

| `type` di frontmatter | Komponen Astro |
|---|---|
| `quick-answer` | `QuickAnswer.astro` |
| `key-takeaways` | `KeyTakeaways.astro` |
| `process-timeline` | `ProcessTimeline.astro` |
| `requirement-checklist` | `RequirementChecklist.astro` |
| `comparison-table` | `ComparisonTable.astro` |
| `legal-references` | `LegalReferences.astro` |
| `related-articles` | `RelatedArticles.astro` |
| `service-cta` | `ServiceCTA.astro` |

Dengan demikian, jika Anda mempunyai 20 jenis block, Anda dapat mempunyai 20 file komponen Astro. Setiap komponen bertanggung jawab atas rendering jenis block-nya.

Akan tetapi, saya tidak menyarankan komponen memilih dirinya sendiri berdasarkan string yang tidak divalidasi.

Lebih baik menggunakan registry eksplisit:

```ts
// src/lib/blockRegistry.ts

import QuickAnswer from "../components/blocks/article/QuickAnswer.astro";
import KeyTakeaways from "../components/blocks/article/KeyTakeaways.astro";
import ProcessTimeline from "../components/blocks/article/ProcessTimeline.astro";
import RequirementChecklist from "../components/blocks/article/RequirementChecklist.astro";
import ComparisonTable from "../components/blocks/article/ComparisonTable.astro";
import LegalReferences from "../components/blocks/article/LegalReferences.astro";
import ServiceCTA from "../components/blocks/conversion/ServiceCTA.astro";

export const blockRegistry = {
  "quick-answer": QuickAnswer,
  "key-takeaways": KeyTakeaways,
  "process-timeline": ProcessTimeline,
  "requirement-checklist": RequirementChecklist,
  "comparison-table": ComparisonTable,
  "legal-references": LegalReferences,
  "service-cta": ServiceCTA,
} as const;
```

Contoh ini menunjukkan pola arsitektur. Sebelum dipakai, path impor harus disesuaikan dengan struktur aktual repositori Anda.

Dengan registry tersebut, sistem memiliki daftar tipe block yang jelas dan terpusat.

### Bagaimana jika ada block yang belum dikenal?

Saya akan membuat sistem validasi yang memeriksa apakah setiap `type` mempunyai komponen yang terdaftar.

Untuk produksi, tipe yang tidak dikenal sebaiknya menghasilkan kesalahan validasi yang jelas ketika proses build atau pemeriksaan konten dijalankan.

Jangan diam-diam menghilangkan block yang salah ketik. Itu berisiko membuat sebagian konten hilang tanpa diketahui.

---

## 6.3. Jangan membuat satu komponen raksasa untuk semua jenis block

Misalnya, kita mempunyai 20 jenis block.

Pendekatan yang tidak saya rekomendasikan adalah:

```text
ContentBlock.astro
    ├── if quick-answer
    ├── else if process-timeline
    ├── else if checklist
    ├── else if comparison-table
    ├── else if legal-references
    └── ... banyak kondisi lainnya
```

Jika semua implementasi berada dalam satu file, setiap penambahan block membuat komponen utama semakin kompleks.

Lebih baik:

```text
BlockRenderer
    └── Block Registry
          ├── QuickAnswer.astro
          ├── ProcessTimeline.astro
          ├── RequirementChecklist.astro
          ├── ComparisonTable.astro
          └── LegalReferences.astro
```

`BlockRenderer` bertugas memilih komponen, sedangkan setiap komponen bertanggung jawab merender datanya.

Namun, jangan pula membuat satu file renderer terpisah untuk setiap artikel. Renderer sebaiknya digunakan bersama.

---

# 7. Ide penting berikutnya: sistem artikel yang terus memperbarui jalur penemuan konten

Saya juga ingin mempertahankan gagasan yang telah kita bahas sebelumnya tentang artikel terbaru dan artikel terkait.

Anda menginginkan halaman depan dan halaman navigasi yang tidak hanya berisi konten statis, tetapi dapat menampilkan artikel terbaru sehingga pengunjung maupun mesin pencari mempunyai jalur menuju konten yang baru diterbitkan.

Untuk kebutuhan tersebut, saya menyarankan komponen berikut.

### `LatestArticles.astro`

Menampilkan beberapa artikel terbaru berdasarkan tanggal publikasi.

Konfigurasi, misalnya:

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XU"
    type: "latest-articles"
    data:
      title: "Artikel Terbaru"
      limit: 3
      sortBy: "publishedAt"
      order: "desc"
```

Komponen mengambil data dari artikel yang tersedia, lalu mengurutkannya berdasarkan tanggal publikasi.

Jumlah artikel yang ditampilkan tidak harus sama dengan jumlah artikel yang disimpan dalam koleksi.

### `RelatedArticles.astro`

Menampilkan artikel yang secara khusus berkaitan dengan artikel saat ini.

```yaml
relatedArticles:
  - "01J9Q2K7M8N4P6R3T5V7W9XV"
  - "01J9Q2K7M8N4P6R3T5V7W9XW"
```

Relasi tersebut harus mengacu pada ID artikel yang benar-benar ada.

### `UpdatedArticles.astro`

Menampilkan artikel yang mengalami pembaruan konten.

```yaml
blocks:
  - id: "01J9Q2K7M8N4P6R3T5V7W9XX"
    type: "updated-articles"
    data:
      title: "Artikel yang Diperbarui"
      limit: 3
      sortBy: "updatedAt"
      order: "desc"
```

Ketiganya mempunyai fungsi yang berbeda:

| Komponen | Dasar pemilihan | Tujuan |
|---|---|---|
| `LatestArticles` | Tanggal publikasi | Menemukan artikel baru |
| `UpdatedArticles` | Tanggal pembaruan | Menemukan artikel yang direvisi |
| `RelatedArticles` | Relasi antarartikel | Menemukan informasi lanjutan |

**Catatan penting:** menampilkan artikel terbaru tidak otomatis menjamin Google akan lebih sering mengunjungi website. Komponen ini memperbaiki navigasi dan membantu penemuan konten, tetapi frekuensi crawling tetap ditentukan oleh berbagai faktor.

Pastikan pula bahwa tautan yang ditampilkan merupakan tautan HTML yang dapat dirayapi, bukan hanya navigasi yang bergantung pada interaksi JavaScript.

---

# 8. Jangan lupa sistem validasi frontmatter

Menurut saya, ini salah satu pekerjaan teknis yang paling penting sebelum jumlah block bertambah banyak.

Ketika hanya ada beberapa artikel, kesalahan data mungkin mudah ditemukan secara manual. Namun, ketika sudah ada puluhan jenis block dan ratusan artikel, masalah seperti berikut akan semakin sulit dilacak:

- `type` salah ketik.
- ID block duplikat.
- Artikel terkait tidak ditemukan.
- URL tujuan kosong.
- Data `steps` seharusnya berupa array, tetapi ditulis sebagai string.
- `updatedAt` lebih awal daripada tanggal publikasi.
- Block menggunakan properti yang tidak dikenal.
- Data wajib untuk suatu komponen tidak tersedia.

Saya menyarankan validasi bertingkat.

**Tingkat pertama: validasi struktur artikel.**

Memastikan setiap artikel mempunyai ID, slug, judul, dan metadata yang sesuai dengan skema koleksi.

**Tingkat kedua: validasi per tipe block.**

Memastikan `quick-answer` mempunyai data jawaban, `process-timeline` mempunyai tahapan, dan `comparison-table` mempunyai kolom serta baris yang valid.

**Tingkat ketiga: validasi relasi.**

Memastikan ID artikel dan layanan yang dirujuk benar-benar tersedia.

**Tingkat keempat: validasi SEO.**

Memeriksa canonical URL, metadata, tautan internal, dan data terstruktur yang memang sesuai dengan isi halaman.

Saya juga akan membuat pemeriksaan otomatis dalam proses build sehingga kesalahan konten ditemukan sebelum deployment.

---

# 9. Prioritas implementasi yang saya rekomendasikan

Saya tidak akan membuat seluruh komponen sekaligus. Lebih baik membangun fondasi yang benar, lalu mengembangkan komponen berdasarkan kebutuhan konten yang nyata.

Berikut urutan yang saya pilih untuk proyek Anda.

| Tahap | Komponen atau pekerjaan | Alasan |
|---|---|---|
| 1 | Audit komponen shared yang sudah ada | Menghindari duplikasi |
| 2 | Definisi skema artikel dan block | Menetapkan kontrak data |
| 3 | Block registry dan renderer | Fondasi sistem modular |
| 4 | `QuickAnswer` | Mendukung penyajian jawaban langsung |
| 5 | `ProcessTimeline` | Memvisualisasikan proses pengurusan |
| 6 | `RequirementChecklist` | Membantu persiapan dokumen |
| 7 | `ComparisonTable` | Menjelaskan perbedaan pilihan |
| 8 | `LegalReferences` dan `SourceReferences` | Mendukung keterlacakan informasi |
| 9 | `RelatedServices` dan `RelatedArticles` | Menghubungkan konten |
| 10 | `LatestArticles` dan `UpdatedArticles` | Mendukung penemuan konten terbaru |
| 11 | `ServiceCTA` | Menghubungkan informasi dengan layanan |
| 12 | `DecisionGuide` | Membantu pengunjung menemukan kebutuhan |
| 13 | Validasi dan pengujian build | Menjaga kualitas saat konten bertambah |

Urutan tersebut bukan berarti komponen terakhir kurang penting. Saya menempatkan fondasi data, rendering, dan komponen yang langsung relevan dengan artikel perizinan sebagai prioritas awal.

## 10. Rekomendasi akhir saya

Jika saya yang memimpin pengembangan proyek ini, saya akan memusatkan perhatian pada lima hal.

**Pertama, jangan menggandakan sumber data.** Informasi artikel, layanan, dan relasinya harus mempunyai sumber yang jelas. Komponen tidak boleh menyimpan salinan data yang sebenarnya sudah tersedia di frontmatter atau koleksi konten.

**Kedua, bedakan data, renderer, dan komponen visual.** Frontmatter mendefinisikan konten, registry menentukan komponen yang digunakan, dan komponen Astro merender data tersebut.

**Ketiga, buat block berdasarkan kebutuhan informasi.** Komponen seperti timeline, checklist, tabel perbandingan, dan referensi hukum mempunyai tujuan yang jelas. Jangan menambah komponen hanya untuk menciptakan variasi visual.

**Keempat, perlakukan artikel sebagai bagian dari jaringan konten.** Artikel harus dapat terhubung ke layanan, artikel terkait, artikel terbaru, dan artikel yang diperbarui melalui relasi yang dapat divalidasi.

**Kelima, jadikan validasi sebagai bagian dari proses pengembangan.** Sistem yang baik bukan hanya mampu merender banyak block, tetapi juga mampu mendeteksi kesalahan data sebelum diterbitkan.

### Satu langkah yang saya sarankan sebelum kita mulai membuat file

Saya belum dapat memastikan komponen mana yang sudah tersedia, bagaimana bentuk frontmatter aktual, atau bagaimana template artikel saat ini memanggil komponen karena isi direktori GitHub belum berhasil saya periksa.

Agar usulan berikutnya benar-benar menjadi implementasi untuk repositori Anda—bukan rancangan generik—**langkah terbaik adalah melakukan audit terhadap kode yang sudah ada terlebih dahulu**.

Saya akan memeriksa:

1. Semua file dalam `src/components/shared`.
2. Beberapa artikel yang mewakili variasi frontmatter di `src/content/articles`.
3. Skema content collection dan layout artikel.
4. Cara template saat ini merender konten.
5. Komponen yang sudah ada, komponen yang dapat diperluas, dan komponen baru yang memang diperlukan.

Setelah audit itu, kita bisa menghasilkan matriks yang konkret: **komponen existing, fungsi saat ini, kekurangan, usulan perbaikan, dan daftar komponen baru beserta struktur data frontmatter-nya**.

Dengan demikian, pengembangan tetap konsisten dengan implementasi dan pembahasan kita sebelumnya, tanpa membuat arsitektur baru yang justru bertentangan dengan kode yang sudah Anda bangun.
