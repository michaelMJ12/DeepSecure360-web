import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { assistantAuthStorage } from '../services/authStorage';
import type { AssistantAccount } from '../types';

interface AssistantAuthState {
  account: AssistantAccount | null;
  isSignedIn: boolean;
  setAccount: (a: AssistantAccount | null) => void;
  signOut: () => void;
}

const AssistantAuthContext = createContext<AssistantAuthState | null>(null);

export function AssistantAuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccountState] = useState<AssistantAccount | null>(() => assistantAuthStorage.getSession());

  const setAccount = useCallback((a: AssistantAccount | null) => setAccountState(a), []);
  const signOut = useCallback(() => {
    assistantAuthStorage.clearSession();
    setAccountState(null);
  }, []);

  const value = useMemo(() => ({ account, isSignedIn: !!account, setAccount, signOut }), [account, setAccount, signOut]);
  return <AssistantAuthContext.Provider value={value}>{children}</AssistantAuthContext.Provider>;
}

export function useAssistantAuth(): AssistantAuthState {
  const ctx = useContext(AssistantAuthContext);
  if (!ctx) throw new Error('useAssistantAuth must be used inside <AssistantAuthProvider>');
  return ctx;
}
