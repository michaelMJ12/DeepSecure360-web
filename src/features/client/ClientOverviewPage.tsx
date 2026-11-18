import { useEffect, useState } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useList } from '@/hooks/useList';
import { getOrgProfile, invoiceService, supportTicketService } from '@/services/client';
import { caseService } from '@/services';
import type { OrgProfile } from '@/types/models';
import { formatDate, formatMoneyFromCents } from '@/utils/format';

export default function ClientOverviewPage() {
  const [org, setOrg] = useState<OrgProfile | null>(null);
  useEffect(() => { getOrgProfile().then(setOrg); }, []);

  const { items: cases } = useList(caseService, { page: 1, limit: 50 });
  const { items: invoices } = useList(invoiceService, { page: 1, limit: 5, sortBy: 'due_date', sortOrder: 'asc' });
  const { items: tickets } = useList(supportTicketService, { page: 1, limit: 5, sortBy: 'created_at', sortOrder: 'desc' });

  const openCases = cases.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length;
  const resolvedThisMonth = cases.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
  const amountDue = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount_cents, 0);
  const openTickets = tickets.filter((t) => t.status !== 'resolved').length;

  return (
    <>
      <PageHeader title={`Welcome back${org ? `, ${org.name}` : ''}`} description="Here's where things stand with your account today." />

      <div className="stat-grid">
        <StatCard label="Open cases" value={openCases} icon="cases" />
        <StatCard label="Resolved cases" value={resolvedThisMonth} icon="checkCircle" />
        <StatCard label="Amount due" value={formatMoneyFromCents(amountDue)} icon="creditCard" tone={amountDue ? 'warning' : 'default'} />
        <StatCard label="Open support requests" value={openTickets} icon="lifeBuoy" tone={openTickets ? 'warning' : 'default'} />
      </div>

      <div className="chart-grid">
        <Card className="span-7" title="Your recent cases" flush>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Case</th><th>Title</th><th>Status</th><th>Opened</th></tr></thead>
              <tbody>
                {cases.slice(0, 6).map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.case_number}</td>
                    <td>{c.title}</td>
                    <td><StatusBadge value={c.status} /></td>
                    <td>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="span-5" title="Upcoming invoices">
          <ul className="client-list">
            {invoices.map((i) => (
              <li key={i.id}>
                <div>
                  <strong>{i.period}</strong>
                  <span className="muted-note">{formatDate(i.due_date)}</span>
                </div>
                <div className="client-list-right">
                  <b>{formatMoneyFromCents(i.amount_cents)}</b>
                  <StatusBadge value={i.status} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Recent support requests" flush>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Subject</th><th>Priority</th><th>Status</th><th>Opened</th></tr></thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.subject}</td>
                  <td><Badge tone={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}>{t.priority}</Badge></td>
                  <td><StatusBadge value={t.status} /></td>
                  <td>{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
