import { ORG_NAVIGATION } from '@/config/navigation.org';
import { OrgBrandingProvider, useOrgBranding } from '@/context/OrgBrandingContext';
import { PortalLayout } from './PortalLayout';

function OrgLayoutInner() {
  const { branding, cssVars } = useOrgBranding();
  return (
    <PortalLayout
      portal="org"
      navigation={ORG_NAVIGATION}
      homePath="/org"
      brandMark={<strong style={{ fontSize: 11 }}>{branding.logo_text}</strong>}
      brandName={branding.logo_text === 'LFH' ? 'Lagos Fintech Holdings' : branding.logo_text}
      brandSub="Organization Dashboard"
      brandingVars={cssVars}
    />
  );
}

/** The org_admin's own dashboard (e.g. a registered organisation like a bank or a government agency). */
export function OrgLayout() {
  return (
    <OrgBrandingProvider>
      <OrgLayoutInner />
    </OrgBrandingProvider>
  );
}
