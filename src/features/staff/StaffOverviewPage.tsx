import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/context/AuthContext';
import { useList } from '@/hooks/useList';
import { alertService } from '@/services/soc';
import { staffTaskService } from '@/services/staff';
import { caseService } from '@/services';
import { formatDate, humanize } from '@/utils/format';

export default function StaffOverviewPage() {
  const { user } = useAuth();
  const { items: tasks } = useList(staffTaskService, { page: 1, limit: 50 });
  const { items: cases } = useList(caseService, { page: 1, limit: 50 });
  const { items: alerts } = useList(alertService, { page: 1, limit: 5, sortBy: 'time', sortOrder: 'desc' });

  const myOpenTasks = tasks.filter((t) => t.status !== 'done').length;
  const dueToday = tasks.filter((t) => t.status !== 'done' && new Date(t.due_date) <= new Date()).length;
  const assignedCases = cases.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length;
  const newAlerts = alerts.filter((a) => a.status === 'new').length;

  return (
    <>
      <PageHeader title={`Welcome back, ${user?.first_name ?? 'there'}`} description="Here's what needs your attention today." />

      <div className="stat-grid">
        <StatCard label="My open tasks" value={myOpenTasks} icon="checkCircle" />
        <StatCard label="Due today or overdue" value={dueToday} icon="alert" tone={dueToday ? 'danger' : 'default'} />
        <StatCard label="Active cases" value={assignedCases} icon="cases" />
        <StatCard label="New alerts" value={newAlerts} icon="alertCircle" tone={newAlerts ? 'warning' : 'default'} />
      </div>

      <div className="chart-grid">
        <Card className="span-7" title="My tasks" flush>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Task</th><th>Case</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {tasks.slice(0, 6).map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td className="mono">{t.related_case}</td>
                    <td>{formatDate(t.due_date)}</td>
                    <td><StatusBadge value={t.priority} /></td>
                    <td><Badge tone={t.status === 'done' ? 'success' : t.status === 'in_progress' ? 'info' : 'neutral'}>{humanize(t.status)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="span-5" title="Latest alerts">
          <ul className="client-list">
            {alerts.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.alert_name}</strong>
                  <span className="muted-note">{a.source_ip} → {a.destination_ip}</span>
                </div>
                <StatusBadge value={a.severity} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
