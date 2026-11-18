import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { AssistantSidebar } from '../components/AssistantSidebar';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { chatStorage } from '../services/chatStorage';
import type { ChatConversation, ChatMode } from '../types';

export interface AssistantOutletContext {
  conversations: ChatConversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  refreshConversations: () => void;
}

function AssistantLayoutInner() {
  const { isSignedIn } = useAssistantAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshConversations = useCallback(() => setConversations(chatStorage.list()), []);
  useEffect(() => { refreshConversations(); }, [refreshConversations]);

  const toggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const handleNewChat = (mode: ChatMode) => {
    const convo = chatStorage.create(mode, 'hygiene');
    refreshConversations();
    setActiveId(convo.id);
    if (location.pathname !== '/') navigate('/');
  };

  const handleDelete = (id: string) => {
    chatStorage.remove(id);
    refreshConversations();
    if (activeId === id) setActiveId(null);
  };

  return (
    <div data-portal="assistant" className="portal-shell asst-shell">
      <AssistantSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onDelete={handleDelete}
        onNewChat={handleNewChat}
        onRefresh={refreshConversations}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        locked={!isSignedIn}
      />
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
      <div className="portal-main">
        <header className="portal-topbar asst-topbar">
          <button type="button" className="icon-btn" onClick={toggle} aria-label="Toggle navigation"><Icon name="menu" /></button>
          <h1 className="portal-topbar-title">DeepSecure360 AI Assistant</h1>
        </header>
        <main className="portal-content asst-content">
          <Outlet context={{ conversations, activeId, setActiveId, refreshConversations } satisfies AssistantOutletContext} />
        </main>
      </div>
    </div>
  );
}

/** Public entry point — no login required to chat; Clarify/Comprehend/Public Hub lock until sign-in.
 *  AssistantAuthProvider/AssistantSettingsProvider are mounted once in App.tsx (shared with
 *  /signup and /signin, which sit outside this layout), so this is just the shell itself. */
export function AssistantLayout() {
  return <AssistantLayoutInner />;
}
