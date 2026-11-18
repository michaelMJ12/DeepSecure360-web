import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DynamicForm } from '@/components/form/DynamicForm';
import type { FieldSchema } from '@/components/form/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/context/ToastContext';
import { getOrgProfile } from '@/services/client';
import type { OrgProfile } from '@/types/models';

const schema: FieldSchema[] = [
  { name: 'name', label: 'Organization name', type: 'text', required: true },
  { name: 'contact_email', label: 'Billing & alerts email', type: 'email', required: true },
];

export default function ClientSettingsPage() {
  const toast = useToast();
  const [org, setOrg] = useState<OrgProfile | null>(null);

  useEffect(() => { getOrgProfile().then(setOrg); }, []);
  if (!org) return null;

  return (
    <>
      <PageHeader title="Settings" description="Your organization's profile on DeepSecure360." />
      <Card title="Organization profile">
        <DynamicForm
          schema={schema}
          initialValues={{ name: org.name, contact_email: org.contact_email }}
          submitLabel="Save changes"
          onSubmit={() => { toast.success('Saved', 'Your organization profile was updated.'); return Promise.resolve(); }}
        />
      </Card>
    </>
  );
}
