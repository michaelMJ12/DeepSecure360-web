import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import type { FieldSchema } from '@/components/form/types';
import { supportTicketService } from '@/services/client';
import type { SupportTicket } from '@/types/models';
import { formatDateTime } from '@/utils/format';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['open', 'in_progress', 'resolved'];

const columns: Column<SupportTicket>[] = [
  { key: 'subject', header: 'Subject', sortable: true },
  { key: 'priority', header: 'Priority', render: (t) => <Badge tone={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}>{t.priority}</Badge> },
  { key: 'status', header: 'Status', sortable: true, render: (t) => <StatusBadge value={t.status} /> },
  { key: 'created_at', header: 'Opened', sortable: true, render: (t) => formatDateTime(t.created_at) },
];

const schema: FieldSchema[] = [
  { name: 'subject', label: 'Subject', type: 'text', required: true, maxLength: 150 },
  { name: 'priority', label: 'Priority', type: 'select', required: true, options: PRIORITIES.map((p) => ({ value: p, label: p })), defaultValue: 'medium', colSpan: 1 },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUSES.map((s) => ({ value: s, label: s })), defaultValue: 'open', colSpan: 1 },
  { name: 'message', label: 'How can we help?', type: 'textarea', required: true, maxLength: 2000 },
];

export default function ClientSupportPage() {
  return (
    <ResourcePage<SupportTicket>
      title="Support"
      description="Open a new request or check on one you've already sent us."
      entityName="request"
      service={supportTicketService}
      columns={columns}
      filters={[{ key: 'status', label: 'Status', options: STATUSES.map((s) => ({ value: s, label: s })) }]}
      formSchema={schema}
      searchPlaceholder="Search your requests"
      defaultSort={{ key: 'created_at', order: 'desc' }}
      rowLabel={(t) => t.subject}
    />
  );
}
