import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import type { FieldSchema } from '@/components/form/types';
import { staffTaskService } from '@/services/staff';
import type { StaffTask } from '@/types/models';
import { formatDate, humanize } from '@/utils/format';
import { SEVERITIES, toOptions } from '@/utils/options';

const STATUSES = ['todo', 'in_progress', 'done'];
const STATUS_TONE: Record<string, 'neutral' | 'info' | 'success'> = { todo: 'neutral', in_progress: 'info', done: 'success' };

const columns: Column<StaffTask>[] = [
  { key: 'title', header: 'Task', sortable: true },
  { key: 'related_case', header: 'Case', mono: true },
  { key: 'due_date', header: 'Due', sortable: true, render: (t) => formatDate(t.due_date) },
  { key: 'priority', header: 'Priority', sortable: true, render: (t) => <StatusBadge value={t.priority} /> },
  { key: 'status', header: 'Status', sortable: true, render: (t) => <Badge tone={STATUS_TONE[t.status]}>{humanize(t.status)}</Badge> },
];

const schema: FieldSchema[] = [
  { name: 'title', label: 'Task', type: 'text', required: true, maxLength: 200 },
  { name: 'related_case', label: 'Related case number', type: 'text', placeholder: 'e.g. DS360-2026-0004', colSpan: 1 },
  { name: 'due_date', label: 'Due date', type: 'date', required: true, colSpan: 1 },
  { name: 'priority', label: 'Priority', type: 'select', required: true, options: toOptions(SEVERITIES), defaultValue: 'medium', colSpan: 1 },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUSES.map((s) => ({ value: s, label: humanize(s) })), defaultValue: 'todo', colSpan: 1 },
];

export default function StaffTasksPage() {
  return (
    <ResourcePage<StaffTask>
      title="My Tasks"
      description="Work assigned to you across every case you're on."
      entityName="task"
      service={staffTaskService}
      columns={columns}
      filters={[
        { key: 'status', label: 'Status', options: STATUSES.map((s) => ({ value: s, label: humanize(s) })) },
        { key: 'priority', label: 'Priority', options: toOptions(SEVERITIES) },
      ]}
      formSchema={schema}
      allowDelete
      searchPlaceholder="Search tasks or case number"
      defaultSort={{ key: 'due_date', order: 'asc' }}
      rowLabel={(t) => t.title}
    />
  );
}
