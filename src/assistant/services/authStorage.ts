import { mockUsers } from '@/mocks/data';
import type { AssistantAccount, AssistantLoginDestination, SignupRoleChoice } from '../types';

const ACCOUNTS_KEY = 'ds360_assistant_accounts';
const SESSION_KEY = 'ds360_assistant_session';

function readAccounts(): AssistantAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as AssistantAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(list: AssistantAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

function roleFromChoice(choice: SignupRoleChoice): { role: AssistantAccount['role']; sector: AssistantAccount['sector'] } {
  if (choice === 'viewer') return { role: 'viewer', sector: null };
  return { role: 'org_admin', sector: choice };
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleChoice: SignupRoleChoice;
  organizationName?: string;
}

export interface SignedInIdentity {
  firstName: string;
  lastName: string;
  email: string;
  destination: AssistantLoginDestination;
}

/**
 * The AI Assistant's own visitor/organisation sign-up and sign-in — entirely
 * separate from the admin dashboard's login (`services/authService.ts`,
 * `context/AuthContext.tsx`), which is untouched. Mock/local only: a real
 * build should register the account against the `users` table shown in the
 * backend entity (organizationId, passwordHash, role, etc.) via a real API.
 */
export const assistantAuthStorage = {
  signup(input: SignupInput): AssistantAccount {
    const { role, sector } = roleFromChoice(input.roleChoice);
    const account: AssistantAccount = {
      id: crypto.randomUUID(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      role,
      sector,
      organization_name: role === 'org_admin' ? (input.organizationName?.trim() || null) : null,
      mfa_enabled: false,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    writeAccounts([...readAccounts(), account]);
    return account;
  },

  /** Resolves an email against assistant sign-ups first, then the admin/org staff directory,
   *  so a staff or admin account created elsewhere still resolves to the right dashboard here. */
  async signin(email: string, password: string): Promise<SignedInIdentity> {
    await new Promise((r) => setTimeout(r, 400));
    const normalized = email.trim().toLowerCase();

    const own = readAccounts().find((a) => a.email === normalized);
    if (own) {
      if (own.password !== password) throw new Error('Incorrect email or password.');
      if (!own.is_active) throw new Error('This account has been deactivated.');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(own));
      return {
        firstName: own.first_name, lastName: own.last_name, email: own.email,
        destination: own.role === 'org_admin' ? '/org' : 'assistant',
      };
    }

    const staffOrAdmin = mockUsers.find((u) => u.email.toLowerCase() === normalized);
    if (staffOrAdmin) {
      if (password.length < 6) throw new Error('Incorrect email or password.');
      if (!staffOrAdmin.is_active) throw new Error('This account has been deactivated.');
      const destination: AssistantLoginDestination =
        staffOrAdmin.role === 'super_admin' || staffOrAdmin.role === 'admin' ? '/admin'
        : staffOrAdmin.role === 'org_admin' ? '/org'
        : '/staff';
      return { firstName: staffOrAdmin.first_name, lastName: staffOrAdmin.last_name, email: staffOrAdmin.email, destination };
    }

    throw new Error('No account found with that email. Sign up first.');
  },

  mockSocialSignin(provider: string): SignedInIdentity {
    const account: AssistantAccount = {
      id: crypto.randomUUID(), email: `visitor+${provider}@example.com`, password: '', first_name: 'Guest', last_name: provider,
      role: 'viewer', sector: null, organization_name: null, mfa_enabled: false, is_active: true, created_at: new Date().toISOString(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return { firstName: account.first_name, lastName: account.last_name, email: account.email, destination: 'assistant' };
  },

  getSession(): AssistantAccount | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AssistantAccount) : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
