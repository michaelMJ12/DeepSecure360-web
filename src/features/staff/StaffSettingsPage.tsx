import { Card } from '@/components/ui/Card';
import { DynamicForm } from '@/components/form/DynamicForm';
import type { FieldSchema } from '@/components/form/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const schema: FieldSchema[] = [
  { name: 'first_name', label: 'First name', type: 'text', required: true, colSpan: 1 },
  { name: 'last_name', label: 'Last name', type: 'text', required: true, colSpan: 1 },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'notify_task_due', label: 'Email me when a task is due', type: 'checkbox', defaultValue: true },
  { name: 'notify_new_alert', label: 'Email me on new critical alerts', type: 'checkbox', defaultValue: true },
];

export default function StaffSettingsPage() {
  const { user } = useAuth();
  const toast = useToast();

  return (
    <>
      <PageHeader title="Settings" description="Your profile and notification preferences." />
      <Card title="Your profile">
        <DynamicForm
          schema={schema}
          initialValues={user ? { first_name: user.first_name, last_name: user.last_name, email: user.email } : undefined}
          submitLabel="Save changes"
          onSubmit={() => { toast.success('Saved', 'Your preferences were updated.'); return Promise.resolve(); }}
        />
      </Card>
    </>
  );
}
