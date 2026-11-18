import { useState, type MouseEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { useAssistantSettings } from '../context/AssistantSettingsContext';
import { chatStorage } from '../services/chatStorage';
import { LANGUAGES } from '../data/languages';
import { t } from '../data/i18n';
import { HistoryItemMenu } from './HistoryItemMenu';
import type { ChatConversation, ChatMode } from '../types';
import { cn } from '@/utils/cn';

interface AssistantSidebarProps {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: (mode: ChatMode) => void;
  onRefresh: () => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
  /** True until the visitor signs up/in — Clarify, Comprehend and Public Hub stay locked. */
  locked: boolean;
}

const LOCKABLE_LINKS: Array<{ to: string; icon: 'checkCircle' | 'image' | 'messageCircle'; key: string }> = [
  { to: '/clarify', icon: 'checkCircle', key: 'clarify' },
  { to: '/comprehend', icon: 'image', key: 'comprehend' },
  { to: '/hub', icon: 'messageCircle', key: 'publicHub' },
];

export function AssistantSidebar({
  conversations, activeId, onSelect, onDelete, onNewChat, onRefresh, collapsed, mobileOpen, onNavigate, locked,
}: AssistantSidebarProps) {
  const { profile, updateProfile } = useAssistantSettings();
  const { account, signOut } = useAssistantAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const lang = profile.language;

  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  const goToSignin = () => { navigate('/signin'); onNavigate(); };

  const guardedLink = (e: MouseEvent) => {
    if (locked) { e.preventDefault(); goToSignin(); }
    else onNavigate();
  };

  const guardedRespond = () => {
    if (locked) { goToSignin(); return; }
    onNewChat('respond');
    onNavigate();
  };

  const renderHistoryItem = (c: ChatConversation) => (
    <div key={c.id} className={cn('asst-history-item', activeId === c.id && 'is-active')}>
      {renamingId === c.id ? (
        <input
          className="asst-history-rename"
          value={renameValue}
          autoFocus
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={() => { chatStorage.rename(c.id, renameValue); onRefresh(); setRenamingId(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        />
      ) : (
        <button type="button" onClick={() => { onSelect(c.id); onNavigate(); }}>
          {c.pinned && <Icon name="star" size={11} />} {c.title}
        </button>
      )}
      <HistoryItemMenu
        conversation={c}
        onPin={() => { chatStorage.togglePin(c.id); onRefresh(); }}
        onStartRename={() => { setRenameValue(c.title); setRenamingId(c.id); }}
        onSetProject={(project) => { chatStorage.setProject(c.id, project); onRefresh(); }}
        onSetGroup={(group) => { chatStorage.setGroup(c.id, group); onRefresh(); }}
        onDelete={() => onDelete(c.id)}
      />
    </div>
  );

  return (
    <aside data-portal="assistant" className={cn('portal-sidebar', 'asst-sidebar', collapsed && 'is-collapsed', mobileOpen && 'is-open')} aria-label="Assistant navigation">
      <div className="portal-brand">
        <span className="portal-brand-mark"><Icon name="shield" size={18} /></span>
        {!collapsed && <span className="portal-brand-text"><strong>DeepSecure360</strong><small>AI Cyber Assistant</small></span>}
      </div>

      <div className="asst-sidebar-scroll">
        <button type="button" className="asst-new-chat" onClick={() => { onNewChat('chat'); onNavigate(); }}>
          <Icon name="plus" size={16} /> {!collapsed && t(lang, 'newChat')}
        </button>

        <nav className="asst-mode-nav">
          {LOCKABLE_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={guardedLink} className={({ isActive }) => cn('asst-mode-link', isActive && !locked && 'is-active')}>
              <Icon name={item.icon} size={17} />
              {!collapsed && <span>{t(lang, item.key)}</span>}
              {locked && !collapsed && <Icon name="lock" size={13} className="asst-lock-icon" />}
            </NavLink>
          ))}
          <button type="button" className="asst-mode-link" onClick={guardedRespond}>
            <Icon name="alert" size={17} />
            {!collapsed && <span>{t(lang, 'respond')}</span>}
            {locked && !collapsed && <Icon name="lock" size={13} className="asst-lock-icon" />}
          </button>
        </nav>

        {!collapsed && (
          <>
            <div className="asst-search">
              <Icon name="search" size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(lang, 'searchChats')} aria-label={t(lang, 'searchChats')} />
            </div>

            {pinned.length > 0 && (
              <>
                <p className="nav-group-title">Pinned</p>
                <div className="asst-history">{pinned.map(renderHistoryItem)}</div>
              </>
            )}

            <p className="nav-group-title">{t(lang, 'recentChats')}</p>
            <div className="asst-history">
              {unpinned.length === 0 && pinned.length === 0 && <p className="asst-history-empty">{t(lang, 'noChats')}</p>}
              {unpinned.map(renderHistoryItem)}
            </div>
          </>
        )}
      </div>

      <div className="portal-sidebar-footer asst-footer">
        {!collapsed && (
          <div className="asst-lang-row">
            <Icon name="globe" size={15} />
            <select className="asst-lang-select" value={lang} onChange={(e) => updateProfile({ language: e.target.value })} aria-label="Interface language">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native_label}</option>)}
            </select>
            <ThemeToggle />
          </div>
        )}

        <button type="button" className="asst-profile-chip" onClick={() => navigate('/profile')}>
          <span className="avatar">{profile.avatar_data_url ? <img src={profile.avatar_data_url} alt="" /> : `${profile.first_name[0] ?? 'G'}${profile.last_name[0] ?? 'V'}`}</span>
          {!collapsed && <span className="user-meta"><strong>{profile.first_name} {profile.last_name}</strong><small>{account ? 'Signed in' : 'Visitor (free trial)'}</small></span>}
        </button>

        {account ? (
          <button type="button" className="asst-login-link" onClick={signOut}>Sign out</button>
        ) : (
          <div className="asst-auth-links">
            <button type="button" className="asst-login-link" onClick={() => navigate('/signup')}>Create account →</button>
            <button type="button" className="asst-login-link" onClick={() => navigate('/signin')}>Sign in →</button>
          </div>
        )}

        {!collapsed && <SocialLinks collapsed={false} />}
      </div>
    </aside>
  );
}
