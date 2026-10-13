import ContentCard from './shared/ContentCard.astro';
import FaqBlock from './shared/FaqBlock.astro';
import CtaBlock from './shared/CtaBlock.astro';
import TableBlock from './shared/TableBlock.astro';
import NoteBlock from './shared/NoteBlock.astro';
import StepsBlock from './shared/StepsBlock.astro';
import StatsBlock from './shared/StatsBlock.astro';
import GlossaryBlock from './shared/GlossaryBlock.astro';
import QuoteBlock from './shared/QuoteBlock.astro';

const blocks: Record<string, any> = {
  card: ContentCard,
  faq: FaqBlock,
  cta: CtaBlock,
  table: TableBlock,
  note: NoteBlock,
  steps: StepsBlock,
  stats: StatsBlock,
  glossary: GlossaryBlock,
  quote: QuoteBlock,
};

export default blocks;
