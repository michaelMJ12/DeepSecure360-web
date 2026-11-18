import { Icon } from '@/components/ui/Icon';
import { CLIENT_NAVIGATION } from '@/config/navigation.client';
import { PortalLayout } from './PortalLayout';

/** Client portal: the organisation's own customers, viewing their case status, reports and billing. */
export function ClientLayout() {
  return (
    <PortalLayout
      portal="client"
      navigation={CLIENT_NAVIGATION}
      homePath="/client"
      brandMark={<Icon name="shield" size={18} />}
      brandName="Lagos Fintech Holdings"
      brandSub="Client portal · powered by DeepSecure360"
    />
  );
}
