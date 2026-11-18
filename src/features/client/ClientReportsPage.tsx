import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { reportService } from '@/services/soc';
import type { SocReport } from '@/types/models';
import { formatDate } from '@/utils/format';

const columns: Column<SocReport>[] = [
  { key: 'title', header: 'Report', sortable: true },
  { key: 'report_type', header: 'Type' },
  { key: 'period', header: 'Period' },
  { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'sent' ? 'success' : 'neutral'}>{r.status}</Badge> },
  { key: 'created_at', header: 'Date', sortable: true, render: (r) => formatDate(r.created_at) },
  { key: 'id', header: '', align: 'right', render: () => <Button variant="secondary" size="sm" icon="inbox">Download</Button> },
];

/** Reports shared with this client. Read-only — generation happens on the staff/admin side. */
export default function ClientReportsPage() {
  return (
    <ResourcePage<SocReport>
      title="Reports"
      description="Reports we've prepared and shared with you."
      entityName="report"
      service={reportService}
      columns={columns}
      allowCreate={false}
      searchPlaceholder="Search reports"
      defaultSort={{ key: 'created_at', order: 'desc' }}
    />
  );
}
