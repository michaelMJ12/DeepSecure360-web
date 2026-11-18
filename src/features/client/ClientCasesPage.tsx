import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { caseService } from '@/services';
import type { Case } from '@/types/models';
import { formatDate, humanize } from '@/utils/format';
import { CASE_STATUSES, toOptions } from '@/utils/options';

const columns: Column<Case>[] = [
  { key: 'case_number', header: 'Case', sortable: true, mono: true, width: '150px' },
  { key: 'title', header: 'Title', sortable: true },
  { key: 'status', header: 'Status', sortable: true, render: (c) => <StatusBadge value={c.status} /> },
  { key: 'category', header: 'Category', render: (c) => humanize(c.category) },
  { key: 'created_at', header: 'Opened', sortable: true, render: (c) => formatDate(c.created_at) },
];

/** Read-only view of this client's cases — no severity, assignee or delete; just status. */
export default function ClientCasesPage() {
  return (
    <ResourcePage<Case>
      title="Your cases"
      description="Every investigation we're handling for your account."
      entityName="case"
      service={caseService}
      columns={columns}
      filters={[{ key: 'status', label: 'Status', options: toOptions(CASE_STATUSES) }]}
      allowCreate={false}
      searchPlaceholder="Search by case number or title"
      defaultSort={{ key: 'created_at', order: 'desc' }}
      rowLabel={(c) => c.case_number}
    />
  );
}
