import type { NavGroup } from './navigation';

export const CLIENT_NAVIGATION: NavGroup[] = [
  { title: 'Portal', items: [{ label: 'Overview', path: '/client', icon: 'dashboard' }] },
  {
    title: 'Your Account',
    items: [
      { label: 'Cases', path: '/client/cases', icon: 'cases' },
      { label: 'Reports', path: '/client/reports', icon: 'inbox' },
      { label: 'Billing', path: '/client/billing', icon: 'creditCard' },
      { label: 'Support', path: '/client/support', icon: 'lifeBuoy' },
      { label: 'Settings', path: '/client/settings', icon: 'settings' },
    ],
  },
];
