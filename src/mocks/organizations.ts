import type { OrgProfile } from '@/types/models';

const day = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();
const ahead = (d: number) => new Date(Date.now() + d * day).toISOString();

/** Platform-wide view: every organisation registered on DeepSecure360. */
export const mockOrganizations: OrgProfile[] = [
  {
    id: 'org-1', name: 'Lagos Fintech Holdings', plan: 'pro', contact_email: 'security@lagosfintech.example.com',
    member_since: ago(240), sector: 'private', is_active: true, subscription_status: 'active', subscription_term: '1y',
    trial_ends_at: ago(150), branding: { sidebar_bg: '#0f1b3d', header_bg: '#ffffff', accent: '#2563eb', logo_text: 'LFH', dark_mode_default: false },
  },
  {
    id: 'org-2', name: 'EFCC (Economic and Financial Crimes Commission)', plan: 'enterprise', contact_email: 'cyberunit@efcc.example.gov.ng',
    member_since: ago(400), sector: 'government', is_active: true, subscription_status: 'active', subscription_term: '3y',
    trial_ends_at: ago(380), branding: { sidebar_bg: '#0b2e1a', header_bg: '#ffffff', accent: '#15803d', logo_text: 'EFCC', dark_mode_default: false },
  },
  {
    id: 'org-3', name: 'DSS (Department of State Services)', plan: 'enterprise', contact_email: 'infosec@dss.example.gov.ng',
    member_since: ago(310), sector: 'government', is_active: true, subscription_status: 'pending_approval', subscription_term: '2y',
    trial_ends_at: ago(2), branding: { sidebar_bg: '#1c1917', header_bg: '#ffffff', accent: '#b45309', logo_text: 'DSS', dark_mode_default: false },
  },
  {
    id: 'org-4', name: 'Binance Crypto (West Africa)', plan: 'pro', contact_email: 'security-ops@binance-wa.example.com',
    member_since: ago(90), sector: 'private', is_active: true, subscription_status: 'trial', subscription_term: null,
    trial_ends_at: ahead(14), branding: { sidebar_bg: '#1a1a1a', header_bg: '#ffffff', accent: '#f0b90b', logo_text: 'BNC', dark_mode_default: false },
  },
  {
    id: 'org-5', name: 'Nasarawa State Government', plan: 'pro', contact_email: 'it@nasarawastate.example.gov.ng',
    member_since: ago(60), sector: 'public', is_active: false, subscription_status: 'expired', subscription_term: '3m',
    trial_ends_at: ago(80), branding: { sidebar_bg: '#0f1b3d', header_bg: '#ffffff', accent: '#2563eb', logo_text: 'NSG', dark_mode_default: false },
  },
];
