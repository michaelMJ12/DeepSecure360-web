import type { CyberCategory } from '../types';

/** When one of these is selected, the composer frames every question as belonging to that topic
 *  and the mock engine only draws answers from that category's bank — this is the "AI response
 *  strictly to that category" behaviour. A real backend should pass this id to the LLM as a
 *  system-prompt constraint (and ideally a retrieval scope) rather than just a UI label. */
export const CYBER_CATEGORIES: CyberCategory[] = [
  { id: 'phishing', label: 'Phishing & Social Engineering', description: 'Suspicious emails, links, impersonation and scam calls.', color: '#16845c' },
  { id: 'malware', label: 'Malware & Ransomware', description: 'Infected devices, ransom demands and virus removal.', color: '#b45309' },
  { id: 'accounts', label: 'Account & Password Security', description: 'Password hygiene, 2FA, and recovering a hacked account.', color: '#2563eb' },
  { id: 'privacy', label: 'Data Privacy & Compliance', description: 'Personal data protection, NDPR/GDPR-style questions.', color: '#7c3aed' },
  { id: 'incident', label: 'Incident Response', description: 'You think you\u2019re being attacked right now — what to do first.', color: '#dc2626' },
  { id: 'network', label: 'Network & Device Security', description: 'Wi-Fi, firewalls, VPNs and device hardening.', color: '#0891b2' },
  { id: 'hygiene', label: 'General Cyber Hygiene', description: 'Everyday habits that keep you and your business safe.', color: '#475569' },
];

export const categoryById = (id: string): CyberCategory => CYBER_CATEGORIES.find((c) => c.id === id) ?? CYBER_CATEGORIES[6];
