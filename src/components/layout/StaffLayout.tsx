import { Icon } from '@/components/ui/Icon';
import { STAFF_NAVIGATION } from '@/config/navigation.staff';
import { PortalLayout } from './PortalLayout';

/** Staff workspace: the organisation's own analysts, scoped to their own org. */
export function StaffLayout() {
  return (
    <PortalLayout
      portal="staff"
      navigation={STAFF_NAVIGATION}
      homePath="/staff"
      brandMark={<Icon name="shield" size={18} />}
      brandName="DeepSecure360"
      brandSub="Staff workspace"
    />
  );
}
