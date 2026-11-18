import { useRef, useState, type ChangeEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/form/Checkbox';
import { Input } from '@/components/form/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useToast } from '@/context/ToastContext';
import { LANGUAGES } from '../data/languages';
import { useAssistantSettings } from '../context/AssistantSettingsContext';

/**
 * Profile section, shaped to match the backend `User` entity you shared
 * (firstName, lastName, email, role, mfaEnabled, isActive) rather than a
 * single free-text display name — so this maps directly onto a real
 * `PATCH /users/me` once one exists.
 */
export default function ProfilePage() {
  const { profile, updateProfile, trialDaysLeft } = useAssistantSettings();
  const toast = useToast();
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const fileRef = useRef<HTMLInputElement>(null);

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar_data_url: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateProfile({ first_name: firstName.trim() || 'Guest', last_name: lastName.trim() || 'Visitor' });
    toast.success('Saved', 'Your profile was updated.');
  };

  return (
    <div className="asst-profile-page">
      <PageHeader title="Your profile" description="Personalise your name, picture, language and security settings." />

      <Card title="Profile picture">
        <div className="asst-avatar-row">
          <span className="avatar asst-avatar-lg">
            {profile.avatar_data_url ? <img src={profile.avatar_data_url} alt="" /> : `${profile.first_name[0] ?? 'G'}${profile.last_name[0] ?? 'V'}`}
          </span>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>Change picture</Button>
        </div>
      </Card>

      <Card title="Account details">
        <div className="form-grid">
          <div className="col-1"><Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} /></div>
          <div className="col-1"><Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={100} /></div>
          <div className="col-2"><Input label="Email" value={profile.email} disabled hint={profile.email ? 'Contact support to change your email.' : 'Sign in to attach an email to your profile.'} /></div>
        </div>
        <div className="settings-row" style={{ marginTop: 4 }}>
          <span className="muted-note">Account type</span>
          <Badge tone={profile.role === 'org_admin' ? 'info' : 'neutral'}>{profile.role === 'org_admin' ? 'Organization' : 'Visitor'}</Badge>
        </div>
        <div className="form-actions"><Button onClick={save}>Save changes</Button></div>
      </Card>

      <Card title="Security">
        <Checkbox
          label="Require a verification code when signing in (MFA)"
          checked={profile.mfa_enabled}
          onChange={(e) => { updateProfile({ mfa_enabled: e.target.checked }); toast.success(e.target.checked ? 'MFA enabled' : 'MFA disabled'); }}
          hint="Matches the mfaEnabled flag on your account — this demo doesn’t send a real code yet."
        />
      </Card>

      <Card title="Language">
        <select className="input select" value={profile.language} onChange={(e) => updateProfile({ language: e.target.value })} style={{ maxWidth: 260 }}>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label} ({l.native_label})</option>)}
        </select>
        <p className="muted-note" style={{ marginTop: 8 }}>
          Chat and menu labels switch languages instantly for English, Hausa, Igbo, Yoruba and Nigerian Pidgin.
        </p>
      </Card>

      <Card title="Appearance">
        <div className="settings-row">
          <div><strong>Dark mode</strong><p className="muted-note" style={{ marginTop: 2 }}>Applies across the whole assistant.</p></div>
          <ThemeToggle />
        </div>
      </Card>

      <Card title="Free trial">
        <p className="muted-note">{trialDaysLeft > 0 ? `${trialDaysLeft} day(s) left in your free trial.` : 'Your free trial has ended.'}</p>
      </Card>
    </div>
  );
}
