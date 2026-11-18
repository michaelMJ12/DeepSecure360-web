import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { CardGallery } from '../components/CardGallery';
import { ClarifyCardTile } from '../components/ClarifyCardTile';
import { MasonryGrid } from '../components/MasonryGrid';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { CYBER_CATEGORIES } from '../data/categories';
import { CLARIFY_CARDS } from '../data/clarifyCards';
import type { ClarifyCard } from '../types';
import { cn } from '@/utils/cn';

export default function ClarifyPage() {
  const { isSignedIn } = useAssistantAuth();
  const [cards, setCards] = useState<ClarifyCard[]>(CLARIFY_CARDS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!isSignedIn) return <Navigate to="/signin" replace />;

  const filtered = cards.filter(
    (c) => (filter === 'all' || c.category_id === filter) && c.question.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleLike = (id: string) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, liked_by_me: !c.liked_by_me, likes: c.likes + (c.liked_by_me ? -1 : 1) } : c)));
  const toggleBookmark = (id: string) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, bookmarked_by_me: !c.bookmarked_by_me } : c)));

  return (
    <div className="asst-civiqli-page">
      <div className="asst-civiqli-head">
        <h1><span className="asst-civiqli-icon">◈</span> CLARIFY</h1>
        <div className="asst-search asst-page-search">
          <Icon name="search" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label="Search clarify cards" />
        </div>
      </div>
      <p className="asst-civiqli-sub">Get quick clarity on common cybersecurity questions.</p>

      <div className="asst-pill-row">
        <button type="button" className={cn('asst-filter-pill', filter === 'all' && 'is-active')} onClick={() => setFilter('all')}>All</button>
        {CYBER_CATEGORIES.map((c) => (
          <button key={c.id} type="button" className={cn('asst-filter-pill', filter === c.id && 'is-active')} style={filter === c.id ? { background: c.color, color: '#fff' } : undefined} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <MasonryGrid>
        {filtered.map((card, i) => <ClarifyCardTile key={card.id} card={card} onOpen={() => setOpenIndex(i)} />)}
      </MasonryGrid>
      {filtered.length === 0 && <p className="asst-civiqli-empty">No cards match that search.</p>}

      {openIndex !== null && (
        <CardGallery
          entries={filtered}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onToggleLike={toggleLike}
          onToggleBookmark={toggleBookmark}
          renderBody={(entry) => {
            const card = entry as ClarifyCard;
            return (
              <>
                <h2 className="asst-gallery-title">{card.question}</h2>
                <p className="asst-gallery-text">{card.answer}</p>
              </>
            );
          }}
        />
      )}
    </div>
  );
}
