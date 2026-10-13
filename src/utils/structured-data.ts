/**
 * Helper JSON-LD schema.org untuk structured data.
 *
 * Setiap fungsi mengembalikan objek siap `JSON.stringify` untuk dirender
 * sebagai <script type="application/ld+json" set:html={...} /> di <head>.
 * `baseUrl` = origin absolut (Astro.site atau Astro.url) untuk memecah
 * URL relatif konten menjadi URL absolut.
 */
import { site } from '../config';

/** Item breadcrumb; item terakhir biasanya tanpa href (halaman saat ini). */
export type BreadcrumbItem = { label: string; href?: string };

/** BreadcrumbList — untuk halaman yang merender breadcrumb. */
export function breadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, baseUrl).toString() } : {}),
    })),
  };
}

/** FAQPage — mainEntity dari pasangan tanya-jawab (block faq atau data faq layanan). */
export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Article — schema artikel; author = nama penulis (fallback "Tim Redaksi"). */
export function articleSchema({ title, description, pubDate, updatedDate, image, url, authorName, siteName }: {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
  url: string;
  authorName?: string;
  siteName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(image ? { image: new URL(image, url).toString() } : {}),
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: { '@type': 'Person', name: authorName || 'Tim Redaksi' },
    publisher: { '@type': 'Organization', name: siteName },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

/** Service — schema layanan dengan provider = nama situs. */
export function serviceSchema({ title, description, url, siteName }: { title: string; description: string; url: string; siteName: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url,
    provider: { '@type': 'Organization', name: siteName },
  };
}
