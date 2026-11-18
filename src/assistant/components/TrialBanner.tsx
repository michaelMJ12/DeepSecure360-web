import { Icon } from '@/components/ui/Icon';
import { useAssistantSettings } from '../context/AssistantSettingsContext';

export function TrialBanner() {
  const { trialDaysLeft } = useAssistantSettings();
  const expired = trialDaysLeft <= 0;
  return (
    <div className={`asst-trial ${expired ? 'is-expired' : ''}`}>
      <Icon name="info" size={16} />
      {expired
        ? <span>Your 14-day free trial has ended. Some features may be limited — contact us to continue with full access.</span>
        : <span><strong>{trialDaysLeft}</strong> day{trialDaysLeft === 1 ? '' : 's'} left in your free trial.</span>}
    </div>
  );
}
