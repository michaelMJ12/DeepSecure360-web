import { createContext, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { OrgBranding } from '@/types/models';
import { mockOrgProfile } from '@/mocks/client';

const KEY = 'ds360_org_branding';

interface OrgBrandingState {
  branding: OrgBranding;
  setBranding: (b: OrgBranding) => void;
  cssVars: CSSProperties;
}

const OrgBrandingContext = createContext<OrgBrandingState | null>(null);

function toCssVars(b: OrgBranding): CSSProperties {
  return {
    // Custom properties aren't in the CSSProperties type, so this cast is required.
    ['--org-sidebar-bg' as string]: b.sidebar_bg,
    ['--org-accent' as string]: b.accent,
  } as CSSProperties;
}

export function OrgBrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBrandingState] = useState<OrgBranding>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as OrgBranding) : mockOrgProfile.branding;
    } catch {
      return mockOrgProfile.branding;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(branding));
  }, [branding]);

  const setBranding = useCallback((b: OrgBranding) => setBrandingState(b), []);
  const cssVars = useMemo(() => toCssVars(branding), [branding]);
  const value = useMemo(() => ({ branding, setBranding, cssVars }), [branding, setBranding, cssVars]);

  return <OrgBrandingContext.Provider value={value}>{children}</OrgBrandingContext.Provider>;
}

export function useOrgBranding(): OrgBrandingState {
  const ctx = useContext(OrgBrandingContext);
  if (!ctx) throw new Error('useOrgBranding must be used inside <OrgBrandingProvider>');
  return ctx;
}
