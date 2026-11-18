import type { Invoice, SupportTicket } from '@/types/models';
import { mockInvoices, mockOrgProfile, mockSupportTickets } from '@/mocks/client';
import { createService } from './resourceService';

export const invoiceService = createService<Invoice>('/client/invoices', mockInvoices, ['invoice_number', 'period', 'status']);
export const supportTicketService = createService<SupportTicket>('/client/support-tickets', mockSupportTickets, ['subject', 'status', 'priority']);

export async function getOrgProfile() {
  await new Promise((r) => setTimeout(r, 150));
  return mockOrgProfile;
}
