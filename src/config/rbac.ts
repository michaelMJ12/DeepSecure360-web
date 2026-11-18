import type { UserRole } from '@/types/models';

/**
 * Central RBAC registry: one place that says which module key each role can
 * see. Nav configs (navigation.ts / navigation.staff.ts / navigation.org.ts)
 * build their menus from these keys, and a real backend should enforce the
 * same list server-side — this file is the single source of truth to copy.
 */
export type ModuleKey =
  | 'overview' | 'cases' | 'evidence' | 'forensics' | 'analysis_jobs' | 'ip_intelligence'
  | 'real_time_monitor' | 'siem_search' | 'alerts' | 'incidents' | 'endpoint_security'
  | 'threat_intelligence' | 'network_watch' | 'vulnerability_mgmt' | 'reports' | 'playbooks'
  | 'integrations' | 'satellite_uplink' | 'staff_accounts' | 'billing' | 'branding_settings'
  | 'platform_users' | 'platform_organizations' | 'audit_logs';

/** super_admin and admin both get every platform module; admin differs from super_admin only in a
 *  couple of destructive/global actions a real backend should gate separately (e.g. deleting another
 *  admin's account) — that distinction isn't modelled in this frontend prototype. */
const ALL_PLATFORM_MODULES: ModuleKey[] = [
  'overview', 'cases', 'evidence', 'forensics', 'analysis_jobs', 'ip_intelligence', 'real_time_monitor',
  'siem_search', 'alerts', 'incidents', 'endpoint_security', 'threat_intelligence', 'network_watch',
  'vulnerability_mgmt', 'reports', 'playbooks', 'integrations', 'satellite_uplink', 'platform_users',
  'platform_organizations', 'audit_logs',
];

/** Modules given to an organisation's own org_admin (the "Organization Dashboard"). */
const ORG_ADMIN_MODULES: ModuleKey[] = [
  'overview', 'evidence', 'forensics', 'analysis_jobs', 'ip_intelligence', 'real_time_monitor',
  'siem_search', 'alerts', 'incidents', 'endpoint_security', 'threat_intelligence', 'network_watch',
  'vulnerability_mgmt', 'cases', 'staff_accounts', 'billing', 'branding_settings',
];

/** Modules shared by the three staff-type roles inside one organisation. */
const ORG_STAFF_MODULES: ModuleKey[] = [
  'overview', 'ip_intelligence', 'threat_intelligence', 'forensics', 'cases', 'evidence',
  'analysis_jobs', 'alerts', 'siem_search',
];

export const ROLE_MODULES: Record<UserRole, ModuleKey[]> = {
  super_admin: ALL_PLATFORM_MODULES,
  admin: ALL_PLATFORM_MODULES,
  org_admin: ORG_ADMIN_MODULES,
  security_analyst: ORG_STAFF_MODULES,
  forensic_investigator: ORG_STAFF_MODULES,
  org_staff: ORG_STAFF_MODULES,
  viewer: [],
  api_client: [],
};

export function canAccessModule(role: UserRole, module: ModuleKey): boolean {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}
