import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { categoryById } from '../data/categories';
import { hubStorage } from '../services/hubStorage';
import { ShareMenu } from './ShareMenu';
import type { HubPost } from '../types';
import { formatDateTime } from '@/utils/format';

interface HubPostCardProps {
  post: HubPost;
  onChange: (posts: HubPost[]) => void;
  authorName: string;
}

export function HubPostCard({ post, onChange, authorName }: HubPostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const category = categoryById(post.category_id);

  const addComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onChange(hubStorage.addComment(post.id, authorName, trimmed));
    setCommentText('');
    setShowComments(true);
  };

  return (
    <article className="asst-post">
      <header className="asst-post-head">
        <span className="asst-avatar">{post.author_initials}</span>
        <div>
          <strong>{post.author_name}</strong>
          <span className="asst-post-meta">{formatDateTime(post.created_at)}</span>
        </div>
        <Badge tone="neutral"><span style={{ color: category.color }}>●</span> {category.label}</Badge>
      </header>
      <p className="asst-post-content">{post.content}</p>
      <div className="asst-post-actions">
        <button type="button" className={`asst-icon-action ${post.liked_by_me ? 'is-active' : ''}`} onClick={() => onChange(hubStorage.toggleLike(post.id))}>
          <Icon name="heart" size={16} /> {post.likes}
        </button>
        <button type="button" className="asst-icon-action" onClick={() => setShowComments((s) => !s)}>
          <Icon name="messageCircle" size={16} /> {post.comments.length}
        </button>
        <ShareMenu text={post.content} url="https://deepsecure360.example.com/assistant/hub" />
      </div>
      {showComments && (
        <div className="asst-comments">
          {post.comments.map((c) => (
            <div key={c.id} className="asst-comment">
              <span className="asst-avatar asst-avatar-sm">{c.author_name.slice(0, 2).toUpperCase()}</span>
              <div><strong>{c.author_name}</strong><p>{c.content}</p></div>
            </div>
          ))}
          <div className="asst-comment-input">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment…" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
            <button type="button" onClick={addComment} aria-label="Post comment"><Icon name="send" size={15} /></button>
          </div>
        </div>
      )}
    </article>
  );
}
