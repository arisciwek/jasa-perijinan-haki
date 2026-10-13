import ContentCard from './shared/ContentCard.astro';
import FaqBlock from './shared/FaqBlock.astro';
import CtaBlock from './shared/CtaBlock.astro';

const blocks: Record<string, any> = {
  card: ContentCard,
  faq: FaqBlock,
  cta: CtaBlock,
};

export default blocks;
