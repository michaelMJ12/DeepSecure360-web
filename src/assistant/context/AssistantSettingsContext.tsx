import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { profileStorage } from '../services/profileStorage';
import type { VisitorProfile } from '../types';

interface AssistantSettingsState {
  profile: VisitorProfile;
  updateProfile: (patch: Partial<VisitorProfile>) => void;
  resetToGuest: () => void;
  trialDaysLeft: number;
}

const AssistantSettingsContext = createContext<AssistantSettingsState | null>(null);

export function AssistantSettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VisitorProfile>(() => profileStorage.get());

  const updateProfile = useCallback((patch: Partial<VisitorProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      profileStorage.save(next);
      return next;
    });
  }, []);

  const resetToGuest = useCallback(() => setProfile(profileStorage.resetToGuest(profile.language)), [profile.language]);

  const trialDaysLeft = useMemo(() => profileStorage.trialDaysLeft(profile), [profile]);
  const value = useMemo(
    () => ({ profile, updateProfile, resetToGuest, trialDaysLeft }),
    [profile, updateProfile, resetToGuest, trialDaysLeft],
  );

  return <AssistantSettingsContext.Provider value={value}>{children}</AssistantSettingsContext.Provider>;
}

export function useAssistantSettings(): AssistantSettingsState {
  const ctx = useContext(AssistantSettingsContext);
  if (!ctx) throw new Error('useAssistantSettings must be used inside <AssistantSettingsProvider>');
  return ctx;
}
