import type { OrgProfile } from '@/types/models';
import { mockOrganizations } from '@/mocks/organizations';
import { createService } from './resourceService';

/** Platform-wide: every organisation registered on DeepSecure360 (super_admin / admin view). */
export const organizationService = createService<OrgProfile>('/organizations', mockOrganizations, ['name', 'contact_email', 'sector']);
