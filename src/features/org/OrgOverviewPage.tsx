import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { BarLineChart } from '@/components/charts/BarLineChart';
import { ChartCard } from '@/components/charts/ChartCard';
import { RadarChart } from '@/components/charts/RadarChart';
import { TimeUnitTabs } from '@/components/charts/TimeUnitTabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { dashboardService } from '@/services/dashboardService';
import { errorMessage } from '@/services/apiClient';
import { getOrgProfile } from '@/services/client';
import type { DashboardMetrics, OrgProfile, TimeUnit } from '@/types/models';
import { formatDate, formatDateTime, humanize } from '@/utils/format';
import { planByTerm } from '@/mocks/billing';

const UNIT_NOTE: Record<TimeUnit, string> = {
  year: 'Last 6 years', month: 'Last 12 months', day: 'Last 14 days',
  hour: 'Last 24 hours', minute: 'Last 30 minutes', second: 'Last 30 seconds',
};

/** Same chart components and layout as the platform's SOC Operations Overview, scoped to one organisation. */
export default function OrgOverviewPage() {
  const [org, setOrg] = useState<OrgProfile | null>(null);
  const [m, setM] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TimeUnit>('day');
  const { snapshot, error: analyticsError } = useAnalytics(unit);

  useEffect(() => {
    getOrgProfile().then(setOrg);
    dashboardService.getMetrics().then(setM).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <Alert variant="error" title="Could not load the dashboard">{error}</Alert>;
  if (!m || !org) return <div className="page-loading"><Spinner size={28} /></div>;

  const trialDaysLeft = Math.ceil((new Date(org.trial_ends_at).getTime() - Date.now()) / 86_400_000);

  return (
    <>
      <PageHeader
        title={`${org.name} — Overview`}
        description={`Case and evidence activity for your organisation. ${UNIT_NOTE[unit]}.`}
        actions={<TimeUnitTabs value={unit} onChange={setUnit} />}
      />

      {org.subscription_status === 'trial' && (
        <Alert variant="warning" title="Free trial" className="form-alert">
          {trialDaysLeft > 0 ? `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left in your free trial.` : 'Your free trial has ended.'}{' '}
          Visit Billing &amp; Plan to activate a subscription and keep every module available.
        </Alert>
      )}
      {org.subscription_status === 'pending_approval' && (
        <Alert variant="info" title="Payment pending approval" className="form-alert">
          We've received your plan selection ({org.subscription_term ? planByTerm(org.subscription_term).label : '—'}). A DeepSecure360
          administrator will confirm payment and activate your dashboard shortly.
        </Alert>
      )}

      <div className="stat-grid">
        <StatCard label="Active cases" value={m.openCases} icon="cases" />
        <StatCard label="Critical cases" value={m.criticalCases} icon="alert" tone="danger" />
        <StatCard label="Evidence items" value={m.evidenceItems} icon="evidence" note={`${m.quarantined} quarantined`} tone={m.quarantined ? 'warning' : 'default'} />
        <StatCard label="Jobs in progress" value={m.jobsRunning} icon="jobs" />
      </div>

      {analyticsError && <Alert variant="error" title="Could not load the graphs" className="chart-alert">{analyticsError}</Alert>}

      {snapshot && (
        <>
          <div className="chart-grid">
            <ChartCard className="span-7" theme="indigo" title="Cases and evidence over time" subtitle={`Bars show active cases and evidence items. The line shows critical cases. ${UNIT_NOTE[unit]}.`}>
              <BarLineChart buckets={snapshot.buckets} />
            </ChartCard>
            <ChartCard className="span-5" theme="teal" title="Spread across case categories" subtitle="Evidence is counted under the category of the case it belongs to.">
              <RadarChart data={snapshot.radar} />
            </ChartCard>
          </div>

          <Card title="Recent activity" flush>
            <div className="table-scroll">
              <table className="table">
                <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Resource</th></tr></thead>
                <tbody>
                  {m.recentAudit.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDateTime(a.created_at)}</td>
                      <td>{a.user_email}</td>
                      <td><Badge tone="info">{a.action}</Badge></td>
                      <td>{humanize(a.resource_type)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      <p className="muted-note" style={{ marginTop: 8 }}>Member since {formatDate(org.member_since)} · Plan: {humanize(org.plan)}</p>
    </>
  );
}
