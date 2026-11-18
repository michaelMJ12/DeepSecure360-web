import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { invoiceService } from '@/services/client';
import type { Invoice } from '@/types/models';
import { formatDate, formatMoneyFromCents } from '@/utils/format';

const columns: Column<Invoice>[] = [
  { key: 'invoice_number', header: 'Invoice', sortable: true, mono: true },
  { key: 'period', header: 'Period' },
  { key: 'amount_cents', header: 'Amount', align: 'right', render: (i) => formatMoneyFromCents(i.amount_cents) },
  { key: 'status', header: 'Status', sortable: true, render: (i) => <StatusBadge value={i.status} /> },
  { key: 'due_date', header: 'Due', sortable: true, render: (i) => formatDate(i.due_date) },
  { key: 'id', header: '', align: 'right', render: () => <Button variant="secondary" size="sm" icon="inbox">Download</Button> },
];

export default function ClientBillingPage() {
  return (
    <ResourcePage<Invoice>
      title="Billing"
      description="Your invoices and payment history."
      entityName="invoice"
      service={invoiceService}
      columns={columns}
      filters={[{ key: 'status', label: 'Status', options: [{ value: 'paid', label: 'Paid' }, { value: 'due', label: 'Due' }, { value: 'overdue', label: 'Overdue' }] }]}
      allowCreate={false}
      searchPlaceholder="Search invoices"
      defaultSort={{ key: 'due_date', order: 'desc' }}
      rowLabel={(i) => i.invoice_number}
    />
  );
}
