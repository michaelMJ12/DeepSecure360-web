import { useEffect, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ShareMenu } from './ShareMenu';
import { categoryById } from '../data/categories';
import { humanize } from '@/utils/format';

export interface GalleryEntry {
  id: string;
  category_id: string;
  likes: number;
  liked_by_me: boolean;
  bookmarked_by_me: boolean;
  comments: Array<{ id: string; author_name: string; content: string }>;
}

interface CardGalleryProps {
  entries: GalleryEntry[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  renderBody: (entry: GalleryEntry) => ReactNode;
}

/** Full-screen single-card viewer, modelled on the Civiqli reference: a big card with prev/next
 *  arrows either side and a share/bookmark/like/comment rail bottom-right. */
export function CardGallery({ entries, index, onIndexChange, onClose, onToggleLike, onToggleBookmark, renderBody }: CardGalleryProps) {
  const entry = entries[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange(Math.min(index + 1, entries.length - 1));
      if (e.key === 'ArrowLeft') onIndexChange(Math.max(index - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, entries.length, onClose, onIndexChange]);

  if (!entry) return null;
  const category = categoryById(entry.category_id);

  return (
    <div className="asst-gallery-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="asst-gallery-close" onClick={onClose} aria-label="Close"><Icon name="chevronLeft" size={18} /> Back</button>

      <button type="button" className="asst-gallery-arrow asst-gallery-arrow-left" disabled={index === 0} onClick={() => onIndexChange(index - 1)} aria-label="Previous">
        <Icon name="chevronLeft" size={22} />
      </button>

      <div className="asst-gallery-card" style={{ background: category.color }}>
        <div className="asst-gallery-head">
          <span className="asst-gallery-brand"><Icon name="shield" size={13} /> Ask DeepSecure360</span>
          <span className="asst-gallery-pill">{humanize(category.id)}</span>
        </div>

        <div className="asst-gallery-body">{renderBody(entry)}</div>

        <div className="asst-gallery-rail">
          <ShareMenu text="Check this out on the DeepSecure360 AI Assistant" url="https://deepsecure360.example.com" />
          <button type="button" className={`asst-icon-action ${entry.bookmarked_by_me ? 'is-active' : ''}`} onClick={() => onToggleBookmark(entry.id)}>
            <Icon name="checkCircle" size={18} />
          </button>
          <button type="button" className={`asst-icon-action ${entry.liked_by_me ? 'is-active' : ''}`} onClick={() => onToggleLike(entry.id)}>
            <Icon name="heart" size={18} /> {entry.likes}
          </button>
          <span className="asst-icon-action"><Icon name="messageCircle" size={18} /> {entry.comments.length}</span>
        </div>
      </div>

      <button type="button" className="asst-gallery-arrow asst-gallery-arrow-right" disabled={index === entries.length - 1} onClick={() => onIndexChange(index + 1)} aria-label="Next">
        <Icon name="chevronRight" size={22} />
      </button>
    </div>
  );
}
