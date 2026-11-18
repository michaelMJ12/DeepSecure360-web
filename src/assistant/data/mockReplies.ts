import type { ChatMode } from '../types';

/**
 * Canned, category-aware responses standing in for a real LLM call. This is
 * a frontend prototype — see README for what a production backend needs to
 * replace this file with (a real model call, scoped by category/mode).
 */
const BY_CATEGORY: Record<string, string[]> = {
  phishing: [
    'That message has two classic phishing signs: urgency ("act now") and a mismatched sender domain. Don\u2019t click the link — instead, open your bank\u2019s app or website directly and check your account there.',
    'Forward the email to your IT/security team and then delete it. Never reply to a suspected phishing email, even to say "stop" — that confirms your address is active.',
  ],
  malware: [
    'Disconnect the device from Wi-Fi and any network cable right away — this stops ransomware from spreading or exfiltrating more data while you assess the damage.',
    'Don\u2019t pay a ransom demand before getting advice: payment doesn\u2019t guarantee recovery, and it can mark you as a repeat target. Check if your files are covered by a known decryptor first.',
  ],
  accounts: [
    'Turn on two-factor authentication (2FA) using an authenticator app rather than SMS where possible — SIM-swap attacks can intercept text codes.',
    'If you think an account is compromised: change the password immediately from a different, trusted device, then sign out of all other sessions from the account\u2019s security settings.',
  ],
  privacy: [
    'Under most data-protection frameworks, you have the right to request what personal data an organisation holds on you and ask for it to be deleted — that request is usually called a "subject access request".',
    'Before sharing personal data with a third-party app, check what permissions it asks for — a flashlight app that wants your contacts list is a red flag.',
  ],
  incident: [
    'First: isolate the affected system from the network. Second: do not power it off if you may need forensic evidence — suspend/hibernate instead. Third: notify your incident response contact immediately.',
    'Keep a written timeline of what you\u2019ve noticed and when — this is genuinely useful for whoever handles the response, even a simple notes-app entry with timestamps.',
  ],
  network: [
    'Change your router\u2019s default admin password and update its firmware — both are commonly skipped and are an easy way in for attackers on the same network.',
    'A VPN protects your traffic between your device and the VPN provider, but it doesn\u2019t make a phishing link safe to click — the two solve different problems.',
  ],
  hygiene: [
    'A password manager plus unique passwords per site is the single highest-impact habit most people can adopt — it removes the temptation to reuse one password everywhere.',
    'Keep your operating system and apps set to auto-update. Most real-world breaches exploit vulnerabilities that already had a patch available.',
  ],
};

const MODE_PREFIX: Record<ChatMode, string> = {
  chat: '',
  clarify: 'To clarify: ',
  comprehend: 'Here\u2019s a summary of what that video covers: ',
  respond: 'Recommended next step: ',
};

let cursor = 0;

export function generateMockReply(categoryId: string, mode: ChatMode): string {
  const bank = BY_CATEGORY[categoryId] ?? BY_CATEGORY.hygiene;
  const text = bank[cursor % bank.length];
  cursor += 1;
  return MODE_PREFIX[mode] + text;
}

export const CLARIFY_PROMPTS: string[] = [
  'I got an email saying my account will be closed — is it real?',
  'My laptop is suddenly very slow and shows pop-ups. What\u2019s happening?',
  'Someone is asking for my OTP code over the phone — should I give it?',
  'What\u2019s the safest way to back up my business\u2019s data?',
];
