import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

type Entry = { data: { updatedDate?: Date; pubDate?: Date } };

function entryDate(e: Entry | undefined): Date | undefined {
  if (!e) return undefined;
  return e.data.updatedDate ?? e.data.pubDate;
}

function maxDate(dates: (Date | undefined)[]): Date | undefined {
  const valid = dates.filter((d): d is Date => !!d);
  if (!valid.length) return undefined;
  return new Date(Math.max(...valid.map((d) => d.valueOf())));
}

function formatDate(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'http://localhost:4321';
  const base = origin.replace(/\/$/, '');

  const pages = (await getCollection('pages')).filter((p) => !p.data.draft);
  const services = (await getCollection('services')).filter((s) => !s.data.draft);
  const articles = (await getCollection('articles')).filter((a) => !a.data.draft);
  const categories = await getCollection('categories');
  const authors = await getCollection('authors');

  const sorted = (list: typeof articles) =>
    [...list].sort((a, b) => (entryDate(b)?.valueOf() ?? 0) - (entryDate(a)?.valueOf() ?? 0));

  const latest3 = sorted(articles).slice(0, 3);
  const latest3Date = maxDate(latest3.map(entryDate));
  const allArticlesDate = maxDate(articles.map(entryDate));

  const pageById = new Map(pages.map((p) => [p.data.id, p]));

  const bound = (type: 'page' | 'service', id: number) =>
    articles.filter((a) => a.data.relatedType === type && a.data.relatedId === id);

  type Url = { loc: string; priority: string; changefreq: string; lastmod?: string };
  const urls: Url[] = [];
  const push = (loc: string, priority: string, changefreq: string, ...sources: (Date | undefined)[]) => {
    const lastmod = maxDate(sources);
    urls.push(lastmod ? { loc, priority, changefreq, lastmod: formatDate(lastmod) } : { loc, priority, changefreq });
  };

  push(`${base}/`, '1', 'weekly', latest3Date);
  push(`${base}/about/`, '0.8', 'monthly', maxDate(bound('page', 5).map(entryDate)), entryDate(pageById.get(5)));
  push(`${base}/contact/`, '0.8', 'monthly', entryDate(pageById.get(6)));
  push(`${base}/services/`, '0.9', 'weekly', latest3Date);
  push(`${base}/perizinan-usaha/`, '0.8', 'weekly', latest3Date);
  push(`${base}/kekayaan-intelektual/`, '0.8', 'weekly', latest3Date);
  push(`${base}/articles/`, '0.8', 'weekly', allArticlesDate);

  for (const service of services) {
    const related = bound('service', service.data.id);
    push(`${base}/services/${service.data.slug}/`, '0.8', 'monthly', maxDate(related.map(entryDate)), entryDate(service));
  }

  for (const article of articles) {
    push(`${base}/articles/${article.data.slug}/`, '0.7', 'monthly', entryDate(article));
  }

  for (const category of categories) {
    const inCategory = articles.filter((a) => a.data.category === category.data.slug);
    push(`${base}/categories/${category.data.slug}/`, '0.6', 'monthly', maxDate(inCategory.map(entryDate)));
  }

  for (const author of authors) {
    const byAuthor = articles.filter((a) => a.data.author === author.data.slug);
    push(`${base}/authors/${author.data.slug}/`, '0.2', 'yearly', maxDate(byAuthor.map(entryDate)));
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/sitemap/0.9">',
    ...urls.map((u) => [
      '  <url>',
      `    <loc>${u.loc}</loc>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      ...(u.lastmod ? [`    <lastmod>${u.lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
