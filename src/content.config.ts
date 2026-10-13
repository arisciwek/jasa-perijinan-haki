import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedIdentity = {
  id: z.number().int().positive(),
  ulid: z.string().length(26),
  title: z.string().min(1),
  description: z.string().min(1),
  draft: z.boolean().default(false),
  image: z.string().optional(),
};

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('article'),
    slug: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedType: z.enum(['service', 'page', 'article']).optional(),
    relatedId: z.number().int().positive().optional(),
    blocks: z.array(z.discriminatedUnion('component', [
      z.object({
        component: z.literal('card'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1),
        icon: z.string().optional(),
        class: z.string().min(1).optional(),
        body: z.array(z.discriminatedUnion('type', [
          z.object({ type: z.literal('p'), text: z.string().min(1) }),
          z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(z.string().min(1)).min(1) }),
          z.object({ type: z.literal('image'), src: z.string().min(1), alt: z.string().min(1), caption: z.string().optional() }),
        ])).default([]),
      }),
      z.object({
        component: z.literal('faq'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1),
        icon: z.string().optional(),
        class: z.string().min(1).optional(),
        items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
      }),
    ])).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('page'),
    slug: z.string().min(1),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    navLabel: z.string().optional(),
    seoTitle: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('service'),
    slug: z.string().min(1),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    serviceGroup: z.enum(['perizinan-usaha', 'kekayaan-intelektual']),
    order: z.number().int().default(100),
    benefits: z.array(z.string()).default([]),
    process: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    ctaLabel: z.string().default('Konsultasikan Kebutuhan Anda'),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    id: z.number().int().positive(),
    ulid: z.string().length(26),
    type: z.literal('category'),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    id: z.number().int().positive(),
    ulid: z.string().length(26),
    type: z.literal('author'),
    slug: z.string(),
    name: z.string(),
    bio: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { articles, pages, services, categories, authors };
