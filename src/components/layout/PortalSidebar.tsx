import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavGroup } from '@/config/navigation';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/utils/cn';

export interface PortalSidebarProps {
  portal: 'staff' | 'client' | 'org';
  navigation: NavGroup[];
  homePath: string;
  brandMark: ReactNode;
  brandName: ReactNode;
  brandSub?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
  footer?: ReactNode;
}

/**
 * Shared sidebar shell for the Staff and Client portals. Visuals come entirely
 * from the `data-portal` attribute (see staff-theme.css / client-theme.css) —
 * this component only knows about structure, not colour.
 */
export function PortalSidebar({
  portal, navigation, homePath, brandMark, brandName, brandSub, collapsed, mobileOpen, onNavigate, footer,
}: PortalSidebarProps) {
  return (
    <aside
      data-portal={portal}
      className={cn('portal-sidebar', collapsed && 'is-collapsed', mobileOpen && 'is-open')}
      aria-label={`${portal} navigation`}
    >
      <div className="portal-brand">
        <span className="portal-brand-mark">{brandMark}</span>
        {!collapsed && (
          <span className="portal-brand-text">
            <strong>{brandName}</strong>
            {brandSub && <small>{brandSub}</small>}
          </span>
        )}
      </div>
      <nav className="portal-nav">
        {navigation.map((group) => (
          <div key={group.title} className="nav-group">
            {!collapsed && <p className="nav-group-title">{group.title}</p>}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === homePath}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => cn('nav-link', isActive && 'is-active')}
              >
                <Icon name={item.icon} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      {footer && !collapsed && <div className="portal-sidebar-footer">{footer}</div>}
    </aside>
  );
}
