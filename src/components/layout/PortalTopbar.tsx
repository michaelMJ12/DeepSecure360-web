import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';
import { humanize } from '@/utils/format';

export interface PortalTopbarProps {
  portal: 'staff' | 'client' | 'org';
  title: string;
  onToggleMenu: () => void;
}

/** Shared top bar for the Staff and Client portals: page title instead of global search. */
export function PortalTopbar({ portal, title, onToggleMenu }: PortalTopbarProps) {
  const { user, logout } = useAuth();
  const initials = user ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}` : '';

  return (
    <header data-portal={portal} className="portal-topbar">
      <button type="button" className="icon-btn" onClick={onToggleMenu} aria-label="Toggle navigation">
        <Icon name="menu" />
      </button>
      <h1 className="portal-topbar-title">{title}</h1>
      <div className="topbar-right">
        <button type="button" className="icon-btn" aria-label="Notifications"><Icon name="bell" /></button>
        <div className="user-chip">
          <span className="avatar">{initials}</span>
          <span className="user-meta">
            <strong>{user?.first_name} {user?.last_name}</strong>
            <small>{user ? humanize(user.role) : ''}</small>
          </span>
        </div>
        <button type="button" className="icon-btn" onClick={() => void logout()} aria-label="Sign out"><Icon name="logout" /></button>
      </div>
    </header>
  );
}
