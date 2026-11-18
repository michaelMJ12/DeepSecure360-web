import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/form/Checkbox';
import { Input } from '@/components/form/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { useOrgBranding } from '@/context/OrgBrandingContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import type { OrgBranding } from '@/types/models';

export default function OrgSettingsPage() {
  const { branding, setBranding } = useOrgBranding();
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [draft, setDraft] = useState<OrgBranding>(branding);

  const update = (field: keyof OrgBranding) => (e: ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [field]: field === 'dark_mode_default' ? e.target.checked : e.target.value }));

  const save = () => {
    setBranding(draft);
    toast.success('Branding saved', 'Your sidebar, header and logo preferences are updated.');
  };

  return (
    <>
      <PageHeader title="Branding & Settings" description="Personalise how your organisation's dashboard looks for your team." />

      <Card title="Appearance">
        <div className="form-grid">
          <div className="col-1">
            <Input label="Company name / logo initials" value={draft.logo_text} onChange={update('logo_text')} maxLength={4} hint="Shown as the small mark at the top of your sidebar." />
          </div>
          <div className="col-1">
            <div className="branding-swatch-row">
              <input type="color" value={/^#/.test(draft.sidebar_bg) ? draft.sidebar_bg : '#10224e'} onChange={update('sidebar_bg')} aria-label="Sidebar background color" />
              <Input label="Sidebar background" value={draft.sidebar_bg} onChange={update('sidebar_bg')} />
            </div>
          </div>
          <div className="col-1">
            <div className="branding-swatch-row">
              <input type="color" value={draft.accent} onChange={update('accent')} aria-label="Accent color" />
              <Input label="Accent color" value={draft.accent} onChange={update('accent')} />
            </div>
          </div>
          <div className="col-1">
            <Checkbox
              label="Use dark mode by default for this organisation"
              checked={theme === 'dark'}
              onChange={() => toggle()}
              hint="Applies the platform-wide dark theme whenever your team opens the dashboard."
            />
          </div>
        </div>

        <div className="branding-preview">
          <p className="field-label" style={{ marginBottom: 8 }}>Preview</p>
          <div className="branding-preview-bar" style={{ background: draft.sidebar_bg }}>
            <span className="branding-preview-mark">{draft.logo_text || 'LOGO'}</span>
            <strong>Your Organization</strong>
            <span style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: 999, background: draft.accent }} />
          </div>
        </div>

        <div className="form-actions">
          <Button onClick={save}>Save branding</Button>
        </div>
      </Card>
    </>
  );
}
