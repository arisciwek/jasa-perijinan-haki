import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function formatDate(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'http://localhost:4321';
  const base = origin.replace(/\/$/, '');

  const urls: { loc: string; lastmod?: string; priority?: string; changefreq?: string }[] = [
    { loc: `${base}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${base}/about/`, changefreq: 'monthly' },
    { loc: `${base}/contact/`, changefreq: 'monthly' },
    { loc: `${base}/services/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${base}/perizinan-usaha/`, priority: '0.8' },
    { loc: `${base}/kekayaan-intelektual/`, priority: '0.8' },
    { loc: `${base}/articles/`, priority: '0.8', changefreq: 'weekly' },
  ];

  for (const page of await getCollection('pages')) {
    if (page.data.draft) continue;
    urls.push({ loc: `${base}/${page.data.slug}/` });
  }

  for (const service of await getCollection('services')) {
    if (service.data.draft) continue;
    urls.push({ loc: `${base}/services/${service.data.slug}/`, priority: '0.7', changefreq: 'monthly' });
  }

  for (const article of await getCollection('articles')) {
    if (article.data.draft) continue;
    const lastmod = article.data.updatedDate ?? article.data.pubDate;
    urls.push({ loc: `${base}/articles/${article.data.slug}/`, priority: '0.6', changefreq: 'monthly', lastmod: formatDate(lastmod) });
  }

  for (const category of await getCollection('categories')) {
    urls.push({ loc: `${base}/categories/${category.data.slug}/`, priority: '0.5' });
  }

  for (const author of await getCollection('authors')) {
    urls.push({ loc: `${base}/authors/${author.data.slug}/`, priority: '0.2' });
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => ['  <url>', `    <loc>${u.loc}</loc>`, u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '', u.priority ? `    <priority>${u.priority}</priority>` : '', u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : '', '  </url>'].filter(Boolean).join('\n')),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
