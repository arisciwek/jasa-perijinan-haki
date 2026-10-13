/**
 * Registry block komponen artikel.
 *
 * Key = nilai field `component` di frontmatter artikel (`blocks[].component`).
 * Value = komponen Astro yang merender block tersebut.
 *
 * Kontrak props tiap block didefinisikan di src/content.config.ts
 * (discriminatedUnion 'component': card -> body[], faq -> items[]).
 *
 * Menambah block baru:
 *   1. Buat komponen .astro (props minimal: id?, heading, icon?).
 *   2. Daftarkan di sini, contoh: steps: StepsBlock.
 *   3. Tambahkan literal union pada schema `blocks` di src/content.config.ts.
 *   4. Panggil dari frontmatter markdown, contoh:
 *        blocks:
 *          - component: "faq"
 *            id: "tanya-jawab"
 *            heading: "Pertanyaan yang sering diajukan"
 *            items:
 *              - question: "..."
 *              answer: "..."
 *
 * Tidak perlu mengubah layout: PageArticleLayout merender apa pun yang
 * terdaftar di sini secara generik (<C id={anchor} {...props} />).
 */
import ContentCard from './shared/ContentCard.astro';
import FaqBlock from './shared/FaqBlock.astro';

const blocks: Record<string, any> = {
  card: ContentCard,
  faq: FaqBlock,
};

export default blocks;
