import type { VideoCard } from '../types';
import { categoryById } from './categories';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

const SEED: Array<[string, string, string, string]> = [
  ['phishing', 'Spotting a phishing email in 30 seconds', 'A quick walkthrough of the sender, link and urgency red flags in a real example.', '2:14'],
  ['phishing', 'Anatomy of a fake delivery SMS scam', 'Why these messages work and the three checks that give them away every time.', '1:48'],
  ['malware', 'What ransomware actually does to your files', 'A plain-language look at encryption-based extortion and why backups matter.', '3:05'],
  ['malware', 'Is that free app safe to install?', 'What to check in an app\u2019s permissions and reviews before you tap install.', '2:32'],
  ['accounts', 'Setting up a password manager in under 5 minutes', 'A first-time walkthrough from install to your first saved password.', '4:50'],
  ['accounts', 'Two-factor authentication, explained simply', 'The difference between SMS codes, authenticator apps and hardware keys.', '3:21'],
  ['privacy', 'What a privacy policy is actually telling you', 'The three sections worth reading even if you skip the rest.', '2:58'],
  ['incident', 'Your first 10 minutes during a suspected breach', 'What to isolate, what to preserve, and who to call first.', '3:40'],
  ['network', 'Securing your home Wi-Fi router properly', 'Default passwords, firmware updates and guest networks explained.', '3:12'],
  ['hygiene', 'Building a personal cyber-hygiene checklist', 'Five habits that stop most everyday attacks before they start.', '2:45'],
];

export const COMPREHEND_VIDEOS: VideoCard[] = SEED.map(([category_id, title, summary, duration_label], i) => ({
  id: `video-${i + 1}`, category_id, title, summary, duration_label,
  thumbnail_color: categoryById(category_id).color,
  likes: 60 + i * 9, liked_by_me: false, bookmarked_by_me: false, comments: [], created_at: hoursAgo(i * 3 + 2),
}));
