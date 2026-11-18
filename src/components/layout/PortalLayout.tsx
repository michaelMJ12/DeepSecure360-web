import { Suspense, useState, type CSSProperties, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import type { NavGroup } from '@/config/navigation';
import { PortalSidebar } from './PortalSidebar';
import { PortalTopbar } from './PortalTopbar';

export interface PortalLayoutProps {
  portal: 'staff' | 'client' | 'org';
  navigation: NavGroup[];
  homePath: string;
  brandMark: ReactNode;
  brandName: ReactNode;
  brandSub?: string;
  footer?: ReactNode;
  /** Optional live overrides (org branding settings) applied as inline CSS variables on the shell root. */
  brandingVars?: CSSProperties;
}

/** Shared page shell (sidebar + top bar + content) for the Staff, Client and Organization portals. */
export function PortalLayout({ portal, navigation, homePath, brandMark, brandName, brandSub, footer, brandingVars }: PortalLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const current = navigation.flatMap((g) => g.items).find((i) => i.path === location.pathname);
  const title = current?.label ?? 'Overview';

  return (
    <div data-portal={portal} className="portal-shell" style={brandingVars}>
      <PortalSidebar
        portal={portal}
        navigation={navigation}
        homePath={homePath}
        brandMark={brandMark}
        brandName={brandName}
        brandSub={brandSub}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        footer={footer}
      />
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
      <div className="portal-main">
        <PortalTopbar portal={portal} title={title} onToggleMenu={toggle} />
        <main className="portal-content">
          <Suspense fallback={<div className="page-loading"><Spinner size={28} /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
