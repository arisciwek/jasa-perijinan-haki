#!/usr/bin/env node
// Memastikan setiap dokumen terbit benar-benar merender isinya pada hasil build.
// Kasus yang dicegah: blocks/frontmatter ada tetapi tidak muncul di halaman
// (mis. karena perubahan layout/blok), sehingga halaman terbit tanpa isi.
//
// Peta rute dist mengikuti src/pages:
//   articles -> /articles/<slug>/
//   pages    -> home ? / : /<slug>/ (about, contact, services,
//               kekayaan-intelektual, perizinan-usaha)
//   services -> /services/<slug>/
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const distRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const topLevelPages = new Set(['about', 'contact', 'services', 'kekayaan-intelektual', 'perizinan-usaha']);

const errors = [];
let checked = 0;
let skipped = 0;

try {
  await stat(distRoot);
} catch {
  console.error('Pemeriksaan isi hasil build gagal: direktori "dist" tidak ada. Jalankan build terlebih dahulu.');
  process.exit(1);
}

async function markdownFiles(dir) {
  const found = [];
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) found.push(...await markdownFiles(path));
      else if (entry.isFile() && entry.name.endsWith('.md')) found.push(path);
    }
  } catch {
    // folder might not exist
  }
  return found;
}

const unquote = (value) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const scalars = (frontmatter) => {
  const value = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z]+):\s*(.*?)\s*$/);
    if (match) value[match[1]] = unquote(match[2]);
  }
  return value;
};

const markers = (frontmatter, pattern) => {
  const found = [];
  for (const match of frontmatter.matchAll(pattern)) {
    const value = unquote(match[1]);
    if (value && !found.includes(value)) found.push(value);
  }
  return found;
};

// Heading Markdown di body juga dianggap penanda isi; diekstrak di loop utama.

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');

function outputFile(collection, filePath) {
  const name = (filePath.split('/').pop() ?? '').replace(/\.md$/, '');
  if (collection === 'articles') return join(distRoot, 'articles', name, 'index.html');
  if (collection === 'services') return join(distRoot, 'services', name, 'index.html');
  if (name === 'home') return join(distRoot, 'index.html');
  if (topLevelPages.has(name)) return join(distRoot, name, 'index.html');
  return join(distRoot, 'pages', name, 'index.html');
}

for (const collection of collections) {
  for (const file of await markdownFiles(join(root, collection))) {
    const label = relative(process.cwd(), file).split(sep).join('/');
    const source = await readFile(file, 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const data = scalars(frontmatter);

    if (data.draft === 'true') {
      skipped++;
      continue;
    }

    const target = outputFile(collection, file);
    const targetLabel = relative(process.cwd(), target).split(sep).join('/');

    let html;
    try {
      html = await readFile(target, 'utf8');
    } catch {
      errors.push(label + ': halaman terbit tidak ditemukan di "' + targetLabel + '"');
      continue;
    }

    checked++;
    const text = visibleText(html);
    const headings = markers(frontmatter, /^\s+(?:heading|title):\s*(.+?)\s*$/gm);
    const bodyH = source.match(/^(?:#{1,4})\s+(.+?)\s*$/gm)?.map((line) => line.replace(/^#+\s+/, '')) ?? [];
    const paragraphs = markers(frontmatter, /^\s+(?:text|intro|message|term|question|value|summary):\s*(.+?)\s*$/gm);
    let expected = [...new Set([...headings, ...bodyH])];
    // Halaman index (home, layanan, kategori) merender isi dari koleksi lain;
    // jika tidak ada marker blok/body, gunakan title/description halaman.
    if (expected.length === 0 && paragraphs.length === 0) {
      expected = [data.title, data.description].filter(Boolean);
    }

    const missing = expected.filter((marker) => !text.includes(unquote(marker)));
    if (missing.length > 0) {
      errors.push(
        label + ': ' + missing.length + ' dari ' + expected.length + ' penanda isi tidak muncul di ' + targetLabel +
        ', mis. ' + missing.slice(0, 3).map((item) => '"' + unquote(item) + '"').join(', ') +
        '. Dokumen terbit tanpa seluruh isinya',
      );
    }
  }
}

if (errors.length) {
  console.error('Pemeriksaan isi hasil build gagal: ' + errors.length + ' masalah dari ' + checked + ' dokumen terbit.\n');
  console.error(errors.map((error) => ' - ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    'Pemeriksaan isi hasil build berhasil (' + checked + ' dokumen terbit' +
    (skipped > 0 ? ', ' + skipped + ' draft dilewati' : '') + ').',
  );
}
