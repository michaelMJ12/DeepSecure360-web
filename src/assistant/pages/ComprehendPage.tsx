import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { CardGallery } from '../components/CardGallery';
import { VideoCardTile } from '../components/VideoCardTile';
import { MasonryGrid } from '../components/MasonryGrid';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { categoryById, CYBER_CATEGORIES } from '../data/categories';
import { COMPREHEND_VIDEOS } from '../data/comprehendVideos';
import type { VideoCard } from '../types';
import { cn } from '@/utils/cn';

export default function ComprehendPage() {
  const { isSignedIn } = useAssistantAuth();
  const [videos, setVideos] = useState<VideoCard[]>(COMPREHEND_VIDEOS);
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!isSignedIn) return <Navigate to="/signin" replace />;

  const filtered = videos.filter((v) => filter === 'all' || v.category_id === filter);

  const toggleLike = (id: string) =>
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, liked_by_me: !v.liked_by_me, likes: v.likes + (v.liked_by_me ? -1 : 1) } : v)));
  const toggleBookmark = (id: string) =>
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, bookmarked_by_me: !v.bookmarked_by_me } : v)));

  return (
    <div className="asst-civiqli-page">
      <div className="asst-civiqli-head">
        <h1><Icon name="play" size={20} /> COMPREHEND</h1>
      </div>
      <p className="asst-civiqli-sub">Short videos that explain a cybersecurity topic in plain language.</p>

      <div className="asst-pill-row">
        <button type="button" className={cn('asst-filter-pill', filter === 'all' && 'is-active')} onClick={() => setFilter('all')}>All</button>
        {CYBER_CATEGORIES.map((c) => (
          <button key={c.id} type="button" className={cn('asst-filter-pill', filter === c.id && 'is-active')} style={filter === c.id ? { background: c.color, color: '#fff' } : undefined} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <MasonryGrid>
        {filtered.map((video, i) => <VideoCardTile key={video.id} video={video} onOpen={() => setOpenIndex(i)} />)}
      </MasonryGrid>

      {openIndex !== null && (
        <CardGallery
          entries={filtered}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onToggleLike={toggleLike}
          onToggleBookmark={toggleBookmark}
          renderBody={(entry) => {
            const video = entry as VideoCard;
            const category = categoryById(video.category_id);
            return (
              <>
                <div className="asst-gallery-video" style={{ background: category.color }}>
                  <span className="asst-play-circle asst-play-circle-lg"><Icon name="play" size={30} /></span>
                  <span className="asst-video-duration">{video.duration_label}</span>
                </div>
                <h2 className="asst-gallery-title">{video.title}</h2>
                <p className="asst-gallery-text">{video.summary}</p>
              </>
            );
          }}
        />
      )}
    </div>
  );
}
