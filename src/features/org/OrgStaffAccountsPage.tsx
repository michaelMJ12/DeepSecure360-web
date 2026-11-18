import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import type { FieldSchema } from '@/components/form/types';
import { useToast } from '@/context/ToastContext';
import { staffAccountService } from '@/services/staffAccounts';
import type { User } from '@/types/models';
import { formatDateTime, humanize } from '@/utils/format';
import { ORG_STAFF_ROLES, toOptions } from '@/utils/options';

const columns: Column<User>[] = [
  { key: 'last_name', header: 'Name', sortable: true, render: (u) => <strong>{u.first_name} {u.last_name}</strong> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true, render: (u) => humanize(u.role) },
  { key: 'is_active', header: 'Status', render: (u) => <Badge tone={u.is_active ? 'success' : 'neutral'}>{u.is_active ? 'Active' : 'Deactivated'}</Badge> },
  { key: 'last_login_at', header: 'Last sign-in', sortable: true, render: (u) => formatDateTime(u.last_login_at) },
];

const schema: FieldSchema[] = [
  { name: 'first_name', label: 'First name', type: 'text', required: true, colSpan: 1 },
  { name: 'last_name', label: 'Last name', type: 'text', required: true, colSpan: 1 },
  { name: 'email', label: 'Work email', type: 'email', required: true, hint: 'Login credentials are emailed to this address automatically.' },
  { name: 'role', label: 'Role', type: 'select', required: true, options: toOptions(ORG_STAFF_ROLES) },
  { name: 'is_active', label: 'Account is active', type: 'checkbox', defaultValue: true, hint: 'Turn off to deactivate this person\u2019s access without deleting their account.' },
];

/**
 * org_admin manages the three staff-type roles for their own organisation
 * (security_analyst, forensic_investigator, org_staff). Deactivating here
 * only affects this organisation — it never touches DeepSecure360's own
 * platform accounts (those are managed on the main admin dashboard's Users page).
 */
export default function OrgStaffAccountsPage() {
  const toast = useToast();
  return (
    <ResourcePage<User>
      title="Staff Accounts"
      description="Add, assign roles to, and deactivate your organisation's own staff."
      entityName="staff account"
      service={staffAccountService}
      columns={columns}
      filters={[{ key: 'role', label: 'Role', options: toOptions(ORG_STAFF_ROLES) }]}
      formSchema={schema}
      allowDelete
      searchPlaceholder="Search by name, email or role"
      defaultSort={{ key: 'last_name', order: 'asc' }}
      rowLabel={(u) => `${u.first_name} ${u.last_name}`}
      toPayload={(v, existing) => {
        if (!existing) toast.info('Invitation sent', `A login link and temporary password were emailed to ${v.email} (demo — no email actually sent).`);
        return { ...v, organization_id: 'org-1' } as unknown as Partial<User>;
      }}
    />
  );
}
