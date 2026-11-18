import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/form/Input';
import { assistantAuthStorage } from '../services/authStorage';
import type { SignupRoleChoice } from '../types';

const ROLE_OPTIONS: Array<{ value: SignupRoleChoice; label: string; description: string }> = [
  { value: 'viewer', label: 'Visitor', description: 'Just here to chat and learn — no organisation.' },
  { value: 'private', label: 'Private organisation', description: 'A company or business (e.g. a bank, an exchange).' },
  { value: 'public', label: 'Public sector', description: 'A public institution or parastatal.' },
  { value: 'government', label: 'Government', description: 'A government agency or department.' },
];

const SOCIAL_PROVIDERS = ['Google', 'LinkedIn', 'Facebook', 'Twitter'] as const;

export default function SignupPage() {
  const navigate = useNavigate();
  const [roleChoice, setRoleChoice] = useState<SignupRoleChoice>('viewer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isOrg = roleChoice !== 'viewer';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim() || password.length < 6) {
      setError('Fill in every field — your password needs at least 6 characters.');
      return;
    }
    if (isOrg && !organizationName.trim()) {
      setError('Enter your organisation\u2019s name.');
      return;
    }
    setSubmitting(true);
    assistantAuthStorage.signup({ firstName, lastName, email, password, roleChoice, organizationName });
    setSubmitting(false);
    navigate('/signin', { state: { justSignedUp: true, email } });
  };

  return (
    <div className="asst-auth">
      <div className="asst-auth-card">
        <span className="asst-auth-mark"><Icon name="shield" size={20} /></span>
        <h1>Create your account</h1>
        <p className="asst-auth-sub">Separate from the DeepSecure360 staff login — this is for the AI assistant and your organisation dashboard.</p>

        {error && <Alert variant="error" title="Check the form">{error}</Alert>}

        <form onSubmit={submit} className="asst-auth-form">
          <p className="field-label">I’m signing up as</p>
          <div className="asst-role-grid">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value} type="button"
                className={`asst-role-card ${roleChoice === opt.value ? 'is-selected' : ''}`}
                onClick={() => setRoleChoice(opt.value)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.description}</span>
              </button>
            ))}
          </div>

          <div className="form-grid">
            <div className="col-1"><Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
            <div className="col-1"><Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
            {isOrg && (
              <div className="col-2">
                <Input label="Organisation name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="e.g. EFCC, Binance, Nasarawa State Government" required />
              </div>
            )}
            <div className="col-2"><Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="col-2"><Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 6 characters." required /></div>
          </div>

          <Button type="submit" loading={submitting} className="full-button">Create account</Button>
        </form>

        <div className="form-divider">or sign up with</div>
        <div className="asst-social-row">
          {SOCIAL_PROVIDERS.map((p) => (
            <button key={p} type="button" className="btn btn-secondary" onClick={() => navigate('/signin', { state: { social: p } })}>{p}</button>
          ))}
        </div>

        <p className="asst-auth-foot">Already have an account? <a href="/signin">Sign in</a></p>
      </div>
    </div>
  );
}
