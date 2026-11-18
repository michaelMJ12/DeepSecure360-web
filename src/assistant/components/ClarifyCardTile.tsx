import { Icon } from '@/components/ui/Icon';
import { categoryById } from '../data/categories';
import type { ClarifyCard } from '../types';

export function ClarifyCardTile({ card, onOpen }: { card: ClarifyCard; onOpen: () => void }) {
  const category = categoryById(card.category_id);
  return (
    <button type="button" className="asst-tile" style={{ background: category.color }} onClick={onOpen}>
      <span className="asst-tile-pill">{category.label}</span>
      <strong className="asst-tile-title">{card.question}</strong>
      <span className="asst-tile-snippet">{card.answer}</span>
      <span className="asst-tile-foot"><Icon name="heart" size={13} /> {card.likes}</span>
    </button>
  );
}
