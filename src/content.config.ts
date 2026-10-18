import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
        }).optional(),
        body: z.array(z.discriminatedUnion('type', [
          z.object({ type: z.literal('p'), text: z.string().min(1), class: z.string().min(1).optional() }),
          z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(z.string().min(1)).min(1), class: z.string().min(1).optional(), itemClass: z.string().optional() }),
          z.object({ type: z.literal('image'), src: z.string().min(1), alt: z.string().min(1), caption: z.string().optional(), class: z.string().min(1).optional(), imgClass: z.string().min(1).optional(), captionClass: z.string().min(1).optional() }),
        ])).default([]),
      }),
      z.object({
        component: z.literal('faq'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1),
        icon: z.string().optional(),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          list: z.string().min(1).optional(),
          item: z.string().min(1).optional(),
          summary: z.string().min(1).optional(),
          chevron: z.string().min(1).optional(),
          answer: z.string().min(1).optional(),
        }).optional(),
        items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
      }),
      z.object({
        component: z.literal('cta'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1).optional(),
        icon: z.string().optional(),
        message: z.string().min(1),
        button: z.string().min(1).optional(),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          message: z.string().min(1).optional(),
          button: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('table'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1).optional(),
        icon: z.string().optional(),
        head: z.array(z.string().min(1)).min(1),
        rows: z.array(z.array(z.string().min(1))).min(1),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          wrapper: z.string().min(1).optional(),
          table: z.string().min(1).optional(),
          th: z.string().min(1).optional(),
          row: z.string().min(1).optional(),
          td: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('note'),
        id: z.string().min(1).optional(),
        variant: z.enum(['info', 'success', 'warning', 'danger']).default('info'),
        title: z.string().min(1).optional(),
        text: z.string().min(1),
        icon: z.string().optional(),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          title: z.string().min(1).optional(),
          text: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('steps'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1),
        icon: z.string().optional(),
        items: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          list: z.string().min(1).optional(),
          item: z.string().min(1).optional(),
          badge: z.string().min(1).optional(),
          title: z.string().min(1).optional(),
          text: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('stats'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1).optional(),
        icon: z.string().optional(),
        items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          grid: z.string().min(1).optional(),
          item: z.string().min(1).optional(),
          value: z.string().min(1).optional(),
          label: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('glossary'),
        id: z.string().min(1).optional(),
        heading: z.string().min(1),
        icon: z.string().optional(),
        items: z.array(z.object({ term: z.string().min(1), definition: z.string().min(1) })).min(1),
        class: z.object({
          section: z.string().min(1).optional(),
          icon: z.string().min(1).optional(),
          heading: z.string().min(1).optional(),
          list: z.string().min(1).optional(),
          item: z.string().min(1).optional(),
          term: z.string().min(1).optional(),
          definition: z.string().min(1).optional(),
        }).optional(),
      }),
      z.object({
        component: z.literal('quote'),
        id: z.string().min(1).optional(),
        text: z.string().min(1),
        source: z.string().min(1).optional(),
        class: z.object({
          section: z.string().min(1).optional(),
          text: z.string().min(1).optional(),
          source: z.string().min(1).optional(),
        }).optional(),
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
