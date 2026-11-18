import type { IconName } from '@/components/ui/Icon';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAVIGATION: NavGroup[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', path: '/admin', icon: 'dashboard' }] },
  {
    title: 'Investigations',
    items: [
      { label: 'Cases', path: '/admin/cases', icon: 'cases' },
      { label: 'Evidence', path: '/admin/evidence', icon: 'evidence' },
      { label: 'Forensics', path: '/admin/forensics', icon: 'shield' },
      { label: 'Analysis jobs', path: '/admin/jobs', icon: 'jobs' },
      { label: 'Integrations', path: '/admin/integrations', icon: 'refresh' },
      { label: 'IP Intelligence', path: '/admin/ip-intelligence', icon: 'search' },
    ],
  },
  {
    title: 'SOC Operations',
    items: [
      { label: 'Overview', path: '/admin/soc/overview', icon: 'dashboard' },
      { label: 'Real-Time Monitor', path: '/admin/soc/real-time-monitor', icon: 'dashboard' },
      { label: 'SIEM Search', path: '/admin/soc/siem-search', icon: 'search' },
      { label: 'Alerts', path: '/admin/soc/alerts', icon: 'alert' },
      { label: 'Incidents', path: '/admin/soc/incidents', icon: 'alertCircle' },
      { label: 'Endpoint Security', path: '/admin/soc/endpoint-security', icon: 'lock' },
      { label: 'Threat Intelligence', path: '/admin/soc/threat-intelligence', icon: 'shield' },
      { label: 'Network Watch', path: '/admin/soc/network-watch', icon: 'evidence' },
      { label: 'Vulnerability Mgmt', path: '/admin/soc/vulnerability-mgmt', icon: 'alert' },
      { label: 'Case Management', path: '/admin/soc/case-management', icon: 'cases' },
      { label: 'Reports', path: '/admin/soc/reports', icon: 'inbox' },
      { label: 'Playbooks', path: '/admin/soc/playbooks', icon: 'checkCircle' },
      { label: 'Satellite Uplink', path: '/admin/soc/satellite', icon: 'satellite' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', path: '/admin/users', icon: 'users' },
      { label: 'Organizations', path: '/admin/organizations', icon: 'cases' },
      { label: 'Audit logs', path: '/admin/audit-logs', icon: 'audit' },
      { label: 'Settings', path: '/admin/settings', icon: 'settings' },
    ],
  },
  {
    title: 'Organization Portals',
    items: [
      { label: 'Organization dashboard', path: '/org', icon: 'dashboard' },
      { label: 'Staff workspace', path: '/staff', icon: 'users' },
      { label: 'Client portal', path: '/client', icon: 'shield' },
    ],
  },
];
