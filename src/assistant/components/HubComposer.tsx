import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CYBER_CATEGORIES } from '../data/categories';
import { hubStorage } from '../services/hubStorage';
import type { HubPost } from '../types';

interface HubComposerProps {
  authorName: string;
  onPosted: (posts: HubPost[]) => void;
}

export function HubComposer({ authorName, onPosted }: HubComposerProps) {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(CYBER_CATEGORIES[0].id);

  const submit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    hubStorage.createPost(authorName, trimmed, categoryId);
    onPosted(hubStorage.list());
    setContent('');
  };

  return (
    <div className="asst-hub-composer">
      <textarea
        className="asst-textarea"
        rows={2}
        placeholder="Share something with the community — a tip, a question, a warning…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="asst-hub-composer-row">
        <select className="input select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-label="Category">
          {CYBER_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <Button icon="send" disabled={!content.trim()} onClick={submit}>Post</Button>
      </div>
    </div>
  );
}
