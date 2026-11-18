import type { VisitorProfile } from '../types';

const KEY = 'ds360_assistant_profile';

function defaults(): VisitorProfile {
  return {
    id: crypto.randomUUID(), organization_id: null, email: '', first_name: 'Guest', last_name: 'Visitor',
    role: 'viewer', mfa_enabled: false, is_active: true, avatar_data_url: null, language: 'en',
    trial_started_at: new Date().toISOString(),
  };
}

export const profileStorage = {
  get(): VisitorProfile {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaults(), ...(JSON.parse(raw) as Partial<VisitorProfile>) };
    } catch {
      /* fall through to defaults */
    }
    const fresh = defaults();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  },
  save(profile: VisitorProfile) {
    localStorage.setItem(KEY, JSON.stringify(profile));
  },
  resetToGuest(language: string) {
    const fresh = { ...defaults(), language };
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  },
  trialDaysLeft(profile: VisitorProfile, totalDays = 14): number {
    const elapsedMs = Date.now() - new Date(profile.trial_started_at).getTime();
    return Math.max(0, totalDays - Math.floor(elapsedMs / 86_400_000));
  },
};
