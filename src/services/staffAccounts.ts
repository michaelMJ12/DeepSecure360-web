import type { User } from '@/types/models';
import { mockUsers } from '@/mocks/data';
import { createService } from './resourceService';

/** Org-scoped staff roster: security_analyst, forensic_investigator and org_staff only. */
const ORG_STAFF_SEED = mockUsers.filter((u) => u.role !== 'org_admin' && u.role !== 'viewer');

export const staffAccountService = createService<User>(
  '/org/staff-accounts',
  ORG_STAFF_SEED,
  ['first_name', 'last_name', 'email', 'role'],
);
