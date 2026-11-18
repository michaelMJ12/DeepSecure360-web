import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { HubComposer } from '../components/HubComposer';
import { HubPostCard } from '../components/HubPostCard';
import { TrialBanner } from '../components/TrialBanner';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { useAssistantSettings } from '../context/AssistantSettingsContext';
import { hubStorage } from '../services/hubStorage';
import type { HubPost } from '../types';

/** A small, cyber-security-focused social feed: post, comment, like and share to the visitor's own
 *  social accounts (see ShareMenu for why "share" opens each platform's own share dialog). */
export default function PublicHubPage() {
  const { isSignedIn } = useAssistantAuth();
  const { profile } = useAssistantSettings();
  const [posts, setPosts] = useState<HubPost[]>([]);

  useEffect(() => { setPosts(hubStorage.list()); }, []);

  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="asst-hub">
      <TrialBanner />
      <PageHeader title="Public Hub" description="Swap tips, ask questions and warn each other about scams — with the community." />
      <HubComposer authorName={`${profile.first_name} ${profile.last_name}`} onPosted={setPosts} />
      <div className="asst-hub-feed">
        {posts.map((p) => <HubPostCard key={p.id} post={p} onChange={setPosts} authorName={`${profile.first_name} ${profile.last_name}`} />)}
      </div>
    </div>
  );
}
