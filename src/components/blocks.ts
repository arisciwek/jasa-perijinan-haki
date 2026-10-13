import ContentCard from './shared/ContentCard.astro';
import FaqBlock from './shared/FaqBlock.astro';

const blocks: Record<string, any> = {
  card: ContentCard,
  faq: FaqBlock,
};

export default blocks;
