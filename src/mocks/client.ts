import type { Invoice, OrgProfile, SupportTicket } from '@/types/models';

const day = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();
const ahead = (d: number) => new Date(Date.now() + d * day).toISOString();

export const mockOrgProfile: OrgProfile = {
  id: 'org-1',
  name: 'Lagos Fintech Holdings',
  plan: 'pro',
  contact_email: 'security@lagosfintech.example.com',
  member_since: ago(240),
  sector: 'private',
  is_active: true,
  subscription_status: 'active',
  subscription_term: '1y',
  trial_ends_at: ago(150),
  branding: {
    sidebar_bg: '#0f1b3d',
    header_bg: '#ffffff',
    accent: '#2563eb',
    logo_text: 'LFH',
    dark_mode_default: false,
  },
};

export const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoice_number: 'INV-2026-0091', period: 'November 2026', amount_cents: 450_000, status: 'due', due_date: ahead(6) },
  { id: 'inv-2', invoice_number: 'INV-2026-0082', period: 'October 2026', amount_cents: 450_000, status: 'paid', due_date: ago(24) },
  { id: 'inv-3', invoice_number: 'INV-2026-0071', period: 'September 2026', amount_cents: 450_000, status: 'paid', due_date: ago(54) },
  { id: 'inv-4', invoice_number: 'INV-2026-0063', period: 'August 2026', amount_cents: 420_000, status: 'paid', due_date: ago(84) },
  { id: 'inv-5', invoice_number: 'INV-2026-0050', period: 'July 2026', amount_cents: 420_000, status: 'overdue', due_date: ago(114) },
];

const ticketSubjects = [
  'Question about last month\u2019s invoice',
  'Request: add a new team member',
  'Can we get a copy of the September report?',
  'Clarify severity rating on DS360-2026-0004',
];
const ticketStatuses = ['open', 'in_progress', 'resolved'] as const;
const ticketPriorities = ['low', 'medium', 'high'] as const;

export const mockSupportTickets: SupportTicket[] = ticketSubjects.map((subject, i) => ({
  id: `tic-${i + 1}`,
  subject,
  message: 'Details supplied by the client when the request was opened.',
  status: ticketStatuses[i % ticketStatuses.length],
  priority: ticketPriorities[i % ticketPriorities.length],
  created_at: ago(2 + i * 3),
}));
