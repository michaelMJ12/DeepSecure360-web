import { CYBER_CATEGORIES } from '../data/categories';

interface CategoryPickerProps {
  onSelect: (categoryId: string) => void;
}

/** Empty-state category cards — colourful like the Civiqli-style reference, scopes every answer in the chat that follows. */
export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  return (
    <div className="asst-category-grid">
      {CYBER_CATEGORIES.map((c) => (
        <button key={c.id} type="button" className="asst-category-card" style={{ background: c.color }} onClick={() => onSelect(c.id)}>
          <strong>{c.label}</strong>
          <span>{c.description}</span>
        </button>
      ))}
    </div>
  );
}
