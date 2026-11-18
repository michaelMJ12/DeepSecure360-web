import type { NavGroup } from './navigation';

export const STAFF_NAVIGATION: NavGroup[] = [
  { title: 'Workspace', items: [{ label: 'Overview', path: '/staff', icon: 'dashboard' }] },
  {
    title: 'My Work',
    items: [
      { label: 'My Tasks', path: '/staff/tasks', icon: 'checkCircle' },
      { label: 'Case Management', path: '/staff/cases', icon: 'cases' },
      { label: 'Evidence', path: '/staff/evidence', icon: 'evidence' },
      { label: 'Analysis Jobs', path: '/staff/analysis-jobs', icon: 'jobs' },
      { label: 'Alerts', path: '/staff/alerts', icon: 'alert' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'IP Intelligence', path: '/staff/ip-intelligence', icon: 'search' },
      { label: 'Threat Intelligence', path: '/staff/threat-intelligence', icon: 'shield' },
      { label: 'Forensics', path: '/staff/forensics', icon: 'lock' },
      { label: 'SIEM Search', path: '/staff/siem-search', icon: 'terminal' },
    ],
  },
  {
    title: 'Team',
    items: [
      { label: 'Team', path: '/staff/team', icon: 'users' },
      { label: 'Reports', path: '/staff/reports', icon: 'inbox' },
      { label: 'Settings', path: '/staff/settings', icon: 'settings' },
    ],
  },
];
