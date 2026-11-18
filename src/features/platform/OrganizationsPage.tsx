import { useState } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ResourcePage } from '@/components/data/ResourcePage';
import type { Column } from '@/components/data/DataTable';
import { useToast } from '@/context/ToastContext';
import { organizationService } from '@/services/organizations';
import type { OrgProfile } from '@/types/models';
import { formatDate, humanize } from '@/utils/format';
import { planByTerm } from '@/mocks/billing';

const STATUSES = ['trial', 'pending_approval', 'active', 'expired', 'suspended'];
const SECTORS = ['private', 'public', 'government'];

/**
 * Platform-wide organisation management for super_admin / admin: approve a
 * pending payment (activates every module on that org's dashboard), or
 * deactivate an organisation's org_admin account entirely.
 */
export default function OrganizationsPage() {
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  const approve = async (org: OrgProfile) => {
    setBusyId(org.id);
    await organizationService.update(org.id, { subscription_status: 'active' });
    setBusyId(null);
    toast.success('Activated', `${org.name}'s subscription is now active — every module is enabled.`);
  };

  const toggleActive = async (org: OrgProfile) => {
    setBusyId(org.id);
    await organizationService.update(org.id, { is_active: !org.is_active, subscription_status: org.is_active ? 'suspended' : org.subscription_status });
    setBusyId(null);
    toast.success(org.is_active ? 'Deactivated' : 'Reactivated', `${org.name}'s dashboard access was ${org.is_active ? 'turned off' : 'restored'}.`);
  };

  const columns: Column<OrgProfile>[] = [
    { key: 'name', header: 'Organization', sortable: true, render: (o) => <strong>{o.name}</strong> },
    { key: 'sector', header: 'Sector', render: (o) => humanize(o.sector) },
    { key: 'subscription_term', header: 'Plan', render: (o) => (o.subscription_term ? planByTerm(o.subscription_term).label : '—') },
    { key: 'subscription_status', header: 'Subscription', sortable: true, render: (o) => <StatusBadge value={o.subscription_status} /> },
    { key: 'is_active', header: 'Account', render: (o) => <Badge tone={o.is_active ? 'success' : 'danger'}>{o.is_active ? 'Active' : 'Deactivated'}</Badge> },
    { key: 'member_since', header: 'Registered', sortable: true, render: (o) => formatDate(o.member_since) },
    {
      key: 'id', header: '', align: 'right',
      render: (o) => (
        <div className="row-actions">
          {o.subscription_status === 'pending_approval' && (
            <Button size="sm" loading={busyId === o.id} onClick={() => void approve(o)}>Approve payment</Button>
          )}
          <Button size="sm" variant={o.is_active ? 'danger' : 'secondary'} loading={busyId === o.id} onClick={() => void toggleActive(o)}>
            {o.is_active ? 'Deactivate' : 'Reactivate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ResourcePage<OrgProfile>
      title="Organizations"
      description="Every organisation registered on DeepSecure360 — approve payments and manage access."
      entityName="organization"
      service={organizationService}
      columns={columns}
      filters={[
        { key: 'subscription_status', label: 'Subscription', options: STATUSES.map((s) => ({ value: s, label: humanize(s) })) },
        { key: 'sector', label: 'Sector', options: SECTORS.map((s) => ({ value: s, label: humanize(s) })) },
      ]}
      allowCreate={false}
      searchPlaceholder="Search by organization name or contact email"
      defaultSort={{ key: 'member_since', order: 'desc' }}
      rowLabel={(o) => o.name}
    />
  );
}
