import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/form/Input';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { useAssistantSettings } from '../context/AssistantSettingsContext';
import { assistantAuthStorage } from '../services/authStorage';

const SOCIAL_PROVIDERS = ['Google', 'LinkedIn', 'Facebook', 'Twitter'] as const;

export default function SigninPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccount } = useAssistantAuth();
  const { updateProfile } = useAssistantSettings();
  const state = location.state as { justSignedUp?: boolean; email?: string; social?: string } | null;

  const [email, setEmail] = useState(state?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const routeAfterSignin = (destination: string, firstName: string, lastName: string, signedInEmail: string) => {
    if (destination === 'assistant') {
      updateProfile({ first_name: firstName, last_name: lastName, email: signedInEmail, role: 'viewer' });
      navigate('/');
    } else {
      navigate(destination);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const identity = await assistantAuthStorage.signin(email, password);
      if (identity.destination === 'assistant') {
        const session = assistantAuthStorage.getSession();
        if (session) setAccount(session);
      }
      routeAfterSignin(identity.destination, identity.firstName, identity.lastName, identity.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithSocial = (provider: string) => {
    const identity = assistantAuthStorage.mockSocialSignin(provider);
    const session = assistantAuthStorage.getSession();
    if (session) setAccount(session);
    routeAfterSignin(identity.destination, identity.firstName, identity.lastName, identity.email);
  };

  return (
    <div className="asst-auth">
      <div className="asst-auth-card">
        <span className="asst-auth-mark"><Icon name="shield" size={20} /></span>
        <h1>Sign in</h1>
        <p className="asst-auth-sub">Visitors, organisations and staff all sign in here — you’ll land on the right dashboard automatically.</p>

        {state?.justSignedUp && <Alert variant="success" title="Account created">Sign in below to activate Clarify, Comprehend, Incident Response and the Public Hub.</Alert>}
        {error && <Alert variant="error" title="Sign-in failed">{error}</Alert>}

        <form onSubmit={submit} className="asst-auth-form">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required hint="Demo: any password of 6+ characters works for sample staff/admin accounts." />
          <Button type="submit" loading={submitting} className="full-button">Sign in</Button>
        </form>

        <div className="form-divider">or continue with</div>
        <div className="asst-social-row">
          {SOCIAL_PROVIDERS.map((p) => (
            <button key={p} type="button" className="btn btn-secondary" onClick={() => signInWithSocial(p)}>{p}</button>
          ))}
        </div>

        <p className="asst-auth-foot">New here? <a href="/signup">Create an account</a></p>
      </div>
    </div>
  );
}
