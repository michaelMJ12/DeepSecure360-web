import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/context/ToastContext';
import { SUBSCRIPTION_PLANS } from '@/mocks/billing';
import { getOrgProfile } from '@/services/client';
import type { OrgProfile, PlanTerm } from '@/types/models';
import { cn } from '@/utils/cn';
import { formatDate, formatMoneyFromCents, humanize } from '@/utils/format';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  active: 'success', trial: 'info', pending_approval: 'warning', expired: 'danger', suspended: 'danger',
};

export default function OrgBillingPage() {
  const toast = useToast();
  const [org, setOrg] = useState<OrgProfile | null>(null);
  const [selected, setSelected] = useState<PlanTerm | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getOrgProfile().then((o) => { setOrg(o); setSelected(o.subscription_term); }); }, []);
  if (!org) return null;

  const trialDaysLeft = Math.ceil((new Date(org.trial_ends_at).getTime() - Date.now()) / 86_400_000);

  const requestActivation = async () => {
    if (!selected) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setOrg({ ...org, subscription_status: 'pending_approval', subscription_term: selected });
    setSubmitting(false);
    toast.success('Request sent', 'A DeepSecure360 administrator will confirm payment and activate your plan.');
  };

  return (
    <>
      <PageHeader title="Billing & Plan" description="Choose a subscription term and manage your organisation's plan." />

      {org.subscription_status === 'trial' && (
        <Alert variant={trialDaysLeft > 3 ? 'info' : 'warning'} title="Free trial" className="form-alert">
          {trialDaysLeft > 0 ? `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left.` : 'Your trial has ended.'}{' '}
          Select a plan below and request activation to avoid losing access to your modules.
        </Alert>
      )}
      {org.subscription_status === 'pending_approval' && (
        <Alert variant="info" title="Awaiting DeepSecure360 approval" className="form-alert">
          Your {org.subscription_term ? SUBSCRIPTION_PLANS.find((p) => p.term === org.subscription_term)?.label : ''} plan request is
          pending confirmation of payment. Every module stays available until this is reviewed.
        </Alert>
      )}
      {(org.subscription_status === 'expired' || org.subscription_status === 'suspended') && (
        <Alert variant="error" title="Dashboard modules are disabled" className="form-alert">
          Your subscription has {org.subscription_status === 'expired' ? 'expired' : 'been suspended'}. Select a plan below to request reactivation.
        </Alert>
      )}

      <Card title="Current status">
        <div className="settings-row">
          <div>
            <strong>Status</strong>
            <p className="muted-note" style={{ marginTop: 2 }}>
              {org.subscription_term ? `Plan: ${SUBSCRIPTION_PLANS.find((p) => p.term === org.subscription_term)?.label}` : 'No active plan yet.'}
            </p>
          </div>
          <Badge tone={STATUS_TONE[org.subscription_status]}>{humanize(org.subscription_status)}</Badge>
        </div>
      </Card>

      <Card title="Choose a term" className="mt-16">
        <div className="plan-grid">
          {SUBSCRIPTION_PLANS.map((p) => (
            <button
              key={p.term}
              type="button"
              className={cn('plan-card', selected === p.term && 'is-selected')}
              onClick={() => setSelected(p.term)}
            >
              <span className="plan-card-term">{p.label}</span>
              <span className="plan-card-price">{formatMoneyFromCents(p.price_cents)}</span>
              <span className="plan-card-permonth">{formatMoneyFromCents(p.price_cents / p.months)} / month</span>
              {p.savings_note && <span className="plan-card-save">{p.savings_note}</span>}
            </button>
          ))}
        </div>
        <div className="form-actions">
          <Button loading={submitting} disabled={!selected || org.subscription_status === 'pending_approval'} onClick={() => void requestActivation()}>
            {org.subscription_status === 'active' ? 'Change plan' : 'Request activation'}
          </Button>
        </div>
      </Card>

      <Card title="How activation works" className="mt-16">
        <ol className="how-it-works">
          <li>Pick a term above and request activation (or your account manager arranges payment directly).</li>
          <li>Once payment is confirmed, a DeepSecure360 administrator approves it from the platform's Organizations page.</li>
          <li>Your dashboard and every module in it switch to <Badge tone="success">Active</Badge> automatically — nothing else changes.</li>
          <li>If a subscription isn't renewed before it ends, modules are disabled until a new term is approved.</li>
        </ol>
        <p className="muted-note" style={{ marginTop: 10 }}>Account registered {formatDate(org.member_since)} · {humanize(org.sector)} sector</p>
      </Card>
    </>
  );
}
