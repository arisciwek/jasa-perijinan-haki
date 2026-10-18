#!/usr/bin/env node
// Pemeriksaan metadata lintas berkas.
// Mencakup koleksi Markdown (articles, pages, services) dan JSON (categories, authors).
// Pemeriksaan:
//   1. id harus angka bulat positif dan unik per koleksi.
//   2. ULID wajib 26 karakter alfanumerik kapital dan unik secara global lintas koleksi.
//      (Data lama memakai base32 yang tidak strict Crockford, jadi polanya longgar.)
//   3. Referensi lintas koleksi: author/category slug dan relatedType/relatedId.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const markdownCollections = ['articles', 'pages', 'services'];
const jsonCollections = ['authors', 'categories'];
const errors = [];
const records = new Map();

async function files(dir, extension) {
  const found = [];
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) found.push(...await files(path, extension));
      else if (entry.isFile() && entry.name.endsWith(extension)) found.push(path);
    }
  } catch {
    // folder might not exist
  }
  return found;
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

const unquote = (value) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

for (const collection of markdownCollections) {
  const items = [];
  const seenId = new Map();

  for (const path of await files(join(root, collection), '.md')) {
    const source = await readFile(path, 'utf8');
    const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    const file = relative(process.cwd(), path);
    if (!match) { errors.push(file + ': frontmatter YAML tidak ditemukan'); continue; }

    const frontmatter = match[1];
    const idRaw = scalar(frontmatter, 'id');
    const id = idRaw === undefined ? undefined : Number(idRaw);
    const ulid = scalar(frontmatter, 'ulid');
    const author = scalar(frontmatter, 'author');
    const category = scalar(frontmatter, 'category');
    const relatedType = scalar(frontmatter, 'relatedType');
    const relatedIdRaw = scalar(frontmatter, 'relatedId');
    const relatedId = relatedIdRaw === undefined ? undefined : Number(relatedIdRaw);

    if (id !== undefined) {
      if (!Number.isInteger(id) || id <= 0) {
        errors.push(file + ': id harus angka bulat positif, ditemukan "' + idRaw + '"');
      } else if (seenId.has(id)) {
        errors.push(file + ': duplikasi id ' + id + ' dengan ' + seenId.get(id));
      } else {
        seenId.set(id, file);
      }
    }

    items.push({ file, id, ulid, author, category, relatedType, relatedId, slug: scalar(frontmatter, 'slug') });
  }
  records.set(collection, items);
}

for (const collection of jsonCollections) {
  const items = [];
  const seenId = new Map();

  for (const path of await files(join(root, collection), '.json')) {
    const file = relative(process.cwd(), path);
    let data;
    try {
      data = JSON.parse(await readFile(path, 'utf8'));
    } catch (error) {
      errors.push(file + ': JSON tidak valid (' + error.message + ')');
      continue;
    }
    const id = typeof data.id === 'number' ? data.id : Number(data.id);
    if (!Number.isInteger(id) || id <= 0) {
      errors.push(file + ': id harus angka bulat positif, ditemukan "' + data.id + '"');
    } else if (seenId.has(id)) {
      errors.push(file + ': duplikasi id ' + id + ' dengan ' + seenId.get(id));
    } else {
      seenId.set(id, file);
    }
    items.push({ file, id, ulid: data.ulid, slug: data.slug });
  }
  records.set(collection, items);
}

const allUlids = new Map();
// ULID di repo ini tidak strict Crockford, jadi aturannya:
// tepat 26 karakter alfanumerik kapital + keunikan global lintas semua koleksi.
const ulidPattern = /^[0-9A-Z]{26}$/;

for (const [, items] of records) {
  for (const item of items) {
    if (item.ulid) {
      if (!ulidPattern.test(item.ulid)) {
        errors.push(item.file + ': format ULID tidak valid (wajib 26 karakter alfanumerik kapital), ditemukan "' + item.ulid + '"');
      } else if (allUlids.has(item.ulid)) {
        errors.push(item.file + ': ULID duplikat dengan ' + allUlids.get(item.ulid));
      } else {
        allUlids.set(item.ulid, item.file);
      }
    } else {
      errors.push(item.file + ': ulid tidak ditemukan');
    }
  }
}

// Referensi lintas koleksi.
const authorSlugs = new Set((records.get('authors') ?? []).map((item) => item.slug).filter(Boolean));
const categorySlugs = new Set((records.get('categories') ?? []).map((item) => item.slug).filter(Boolean));
const idIndex = new Map();
for (const collection of ['articles', 'pages', 'services']) {
  idIndex.set(collection, new Set((records.get(collection) ?? []).map((item) => item.id)));
}

for (const item of records.get('articles') ?? []) {
  if (item.author && !authorSlugs.has(item.author)) {
    errors.push(item.file + ': author "' + item.author + '" tidak ada di koleksi authors');
  }
  if (item.category && !categorySlugs.has(item.category)) {
    errors.push(item.file + ': category "' + item.category + '" tidak ada di koleksi categories');
  }
  if (item.relatedType !== undefined || item.relatedId !== undefined) {
    if (!item.relatedType || !item.relatedId) {
      errors.push(item.file + ': relatedType dan relatedId harus diisi berpasangan');
    } else {
      const targetCollection = { service: 'services', page: 'pages', article: 'articles' }[item.relatedType];
      if (!targetCollection) {
        errors.push(item.file + ': relatedType "' + item.relatedType + '" tidak dikenal (service, page, atau article)');
      } else if (!idIndex.get(targetCollection)?.has(item.relatedId)) {
        errors.push(item.file + ': relatedId ' + item.relatedId + ' tidak ada di koleksi "' + targetCollection + '"');
      } else if (item.relatedType === 'article' && item.file.includes('articles/')) {
        // artikel tidak boleh mereferensi dirinya sendiri
        const target = (records.get('articles') ?? []).find((a) => a.id === item.relatedId);
        if (target && target.file === item.file) {
          errors.push(item.file + ': relatedId mereferensi artikel itu sendiri');
        }
      }
    }
  }
}

if (errors.length) {
  console.error('Validasi konten gagal:\n' + errors.map((e) => ' - ' + e).join('\n'));
  process.exitCode = 1;
} else {
  const total = [...records.values()].reduce((sum, items) => sum + items.length, 0);
  console.log('Validasi metadata lintas berkas berhasil (' + total + ' dokumen).');
}
