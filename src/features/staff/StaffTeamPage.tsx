import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { userService } from '@/services';
import type { User } from '@/types/models';
import { formatDateTime, humanize } from '@/utils/format';

const columns: Column<User>[] = [
  { key: 'last_name', header: 'Name', sortable: true, render: (u) => <strong>{u.first_name} {u.last_name}</strong> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (u) => humanize(u.role) },
  { key: 'is_active', header: 'Status', render: (u) => <Badge tone={u.is_active ? 'success' : 'neutral'}>{u.is_active ? 'Active' : 'Inactive'}</Badge> },
  { key: 'last_login_at', header: 'Last active', sortable: true, render: (u) => formatDateTime(u.last_login_at) },
];

/** Read-only roster of colleagues on this organisation's team. */
export default function StaffTeamPage() {
  return (
    <ResourcePage<User>
      title="Team"
      description="Everyone on your organization's security team."
      entityName="teammate"
      service={userService}
      columns={columns}
      allowCreate={false}
      searchPlaceholder="Search by name, email or role"
      defaultSort={{ key: 'last_name', order: 'asc' }}
      rowLabel={(u) => `${u.first_name} ${u.last_name}`}
    />
  );
}
