import type { ClarifyCard } from '../types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

const SEED: Array<[string, string, string]> = [
  ['phishing', 'How do I tell a real bank SMS from a fake one?', 'Real banks never ask you to confirm a PIN, full card number or OTP by text. Look at the sender ID carefully — fraudsters often use a name one letter off from your bank\u2019s. When in doubt, open your bank\u2019s app directly rather than tapping the link in the message, and call the number printed on your card, not one in the text.'],
  ['phishing', 'Someone is calling, claiming to be from my bank\u2019s fraud team — is that normal?', 'A genuine fraud team will never ask you to move money "to a safe account" or read out your one-time PIN over the phone. Hang up and call your bank back using the number on your card or statement — not a number the caller gives you.'],
  ['malware', 'My phone keeps showing ads even with the browser closed — what\u2019s wrong?', 'That\u2019s a common sign of adware bundled inside a free app. Check recently installed apps and uninstall anything you don\u2019t recognise, then run a reputable mobile security scan. Avoid installing apps from outside your phone\u2019s official app store.'],
  ['malware', 'Is it safe to plug in a USB drive I found?', 'No — a lost-and-found USB drive is one of the oldest tricks for spreading malware. If you must check it, only do so on a machine that isn\u2019t connected to anything important, ideally one set aside for exactly this.'],
  ['accounts', 'What makes a password actually strong?', 'Length matters more than complexity — a random 16-character passphrase beats "P@ssw0rd!" every time. The real upgrade is using a different, unique password per site via a password manager, plus two-factor authentication wherever it\u2019s offered.'],
  ['accounts', 'I can\u2019t log into my email anymore — what now?', 'Use the provider\u2019s account-recovery flow immediately, and check whether your recovery phone/email were changed without your knowledge — that\u2019s often the first sign of a takeover. Once back in, review connected apps and active sessions and remove anything unfamiliar.'],
  ['privacy', 'Can a company legally sell my personal data?', 'It depends on your region\u2019s law and what you agreed to, but most data-protection frameworks require clear consent for anything beyond what\u2019s needed to provide the service, and give you the right to ask what\u2019s held about you and to request deletion.'],
  ['privacy', 'Why does every app ask for my contacts list?', 'Often it\u2019s to power a "find your friends" feature, but it\u2019s rarely essential — decline it unless you specifically need that feature, since it also shares your contacts\u2019 information without their consent.'],
  ['incident', 'My company website just got defaced — what\u2019s the first move?', 'Take the site into maintenance mode or offline if you can, preserve logs before anything is overwritten, and loop in whoever handles incident response immediately. Don\u2019t rush to simply restore from backup before understanding how the attacker got in, or they\u2019ll just get back in.'],
  ['incident', 'How do I know if I\u2019m actually being attacked right now, or just unlucky?', 'Multiple odd signs together — unexpected logins, files you didn\u2019t touch changing, unfamiliar processes running — point to an active incident rather than coincidence. When in doubt, treat it as an incident; it costs little to be wrong that way, and a lot to be wrong the other way.'],
  ['network', 'Is public Wi-Fi at a cafe actually dangerous?', 'It\u2019s riskier than your home network, mainly because you can\u2019t verify who else is on it. Avoid logging into anything sensitive on it, and a reputable VPN meaningfully reduces the risk if you need to.'],
  ['hygiene', 'How often should I actually update my software?', 'As soon as updates are available, for anything connected to the internet. The gap between a patch being released and attackers exploiting unpatched systems keeps shrinking — same-day is increasingly common for serious vulnerabilities.'],
];

export const CLARIFY_CARDS: ClarifyCard[] = SEED.map(([category_id, question, answer], i) => ({
  id: `clarify-${i + 1}`, category_id, question, answer,
  likes: 40 + i * 13, liked_by_me: false, bookmarked_by_me: false, comments: [], created_at: hoursAgo(i * 2 + 1),
}));
