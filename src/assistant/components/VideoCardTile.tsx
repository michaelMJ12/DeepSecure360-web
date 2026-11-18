import { Icon } from '@/components/ui/Icon';
import { categoryById } from '../data/categories';
import type { VideoCard } from '../types';

export function VideoCardTile({ video, onOpen }: { video: VideoCard; onOpen: () => void }) {
  const category = categoryById(video.category_id);
  return (
    <button type="button" className="asst-tile asst-video-tile" onClick={onOpen}>
      <span className="asst-video-thumb" style={{ background: category.color }}>
        <span className="asst-play-circle"><Icon name="play" size={20} /></span>
        <span className="asst-video-duration">{video.duration_label}</span>
      </span>
      <strong className="asst-tile-title">{video.title}</strong>
      <span className="asst-tile-snippet">{video.summary}</span>
    </button>
  );
}
