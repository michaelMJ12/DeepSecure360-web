import type { NavGroup } from './navigation';

/** Module list for an organisation's org_admin — the "Organization Dashboard". */
export const ORG_NAVIGATION: NavGroup[] = [
  { title: 'Organization', items: [{ label: 'Overview', path: '/org', icon: 'dashboard' }] },
  {
    title: 'Operations',
    items: [
      { label: 'Case Management', path: '/org/cases', icon: 'cases' },
      { label: 'Evidence', path: '/org/evidence', icon: 'evidence' },
      { label: 'Forensics', path: '/org/forensics', icon: 'lock' },
      { label: 'Analysis Jobs', path: '/org/analysis-jobs', icon: 'jobs' },
      { label: 'IP Intelligence', path: '/org/ip-intelligence', icon: 'search' },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Real-Time Monitor', path: '/org/real-time-monitor', icon: 'dashboard' },
      { label: 'SIEM Search', path: '/org/siem-search', icon: 'terminal' },
      { label: 'Alerts', path: '/org/alerts', icon: 'alert' },
      { label: 'Incidents', path: '/org/incidents', icon: 'alertCircle' },
      { label: 'Endpoint Security', path: '/org/endpoint-security', icon: 'lock' },
      { label: 'Threat Intelligence', path: '/org/threat-intelligence', icon: 'shield' },
      { label: 'Network Watch', path: '/org/network-watch', icon: 'evidence' },
      { label: 'Vulnerability Mgmt', path: '/org/vulnerability-mgmt', icon: 'alert' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Staff Accounts', path: '/org/staff-accounts', icon: 'users' },
      { label: 'Billing & Plan', path: '/org/billing', icon: 'creditCard' },
      { label: 'Branding & Settings', path: '/org/settings', icon: 'settings' },
    ],
  },
];
