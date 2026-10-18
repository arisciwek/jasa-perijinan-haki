#!/usr/bin/env node
// Memastikan struktur frontmatter utuh: baris pertama "---", tepat satu pembuka dan
// satu penutup. Kasus yang dicegah: delimiter "---" nyasar di tengah frontmatter
// memotong pembacaan kunci (mis. "blocks:" atau "title:" terbaca sebagai body),
// sehingga halaman terbit tanpa seluruh datanya.
// Catatan: berbeda dari repo lain, repo ini MERENDER body Markdown pada artikel,
// halaman, dan layanan — jadi body boleh berisi Markdown. Yang diperiksa hanya
// integritas delimiter frontmatter.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const errors = [];
let checked = 0;

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

for (const collection of collections) {
  for (const file of await markdownFiles(join(root, collection))) {
    checked++;
    const label = relative(process.cwd(), file).split(sep).join('/');
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);

    if (lines[0]?.trim() !== '---') {
      errors.push(label + ': baris pertama harus "---" (frontmatter wajib berada di awal berkas)');
      continue;
    }

    const delimiters = [];
    lines.forEach((line, index) => {
      if (/^---\s*$/.test(line)) delimiters.push(index);
    });

    if (delimiters.length < 2) {
      errors.push(label + ': frontmatter tidak ditutup; tambahkan baris "---" penutup');
      continue;
    }

    if (delimiters.length > 2) {
      errors.push(
        label + ': ditemukan ' + delimiters.length + ' baris "---" pada baris ' +
        delimiters.map((index) => index + 1).join(', ') +
        '; frontmatter hanya boleh dibuka dan ditutup sekali. Delimiter tambahan memotong frontmatter sehingga key setelahnya (mis. "blocks:") terbaca sebagai body dan tidak dirender',
      );
    }
  }
}

if (errors.length) {
  console.error('Pemeriksaan integritas frontmatter gagal: ' + errors.length + ' masalah dari ' + checked + ' dokumen.\n');
  console.error(errors.map((error) => ' - ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Pemeriksaan integritas frontmatter berhasil (' + checked + ' dokumen).');
}
