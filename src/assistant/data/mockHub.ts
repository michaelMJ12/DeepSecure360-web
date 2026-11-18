import type { HubPost } from '../types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const SEED_HUB_POSTS: HubPost[] = [
  {
    id: 'post-1', author_name: 'Ada N.', author_initials: 'AN', category_id: 'phishing',
    content: 'PSA: there\u2019s a wave of fake "your package couldn\u2019t be delivered" SMS messages going round again. Don\u2019t tap the link — go to the courier\u2019s real app instead.',
    created_at: hoursAgo(3), likes: 24, liked_by_me: false,
    comments: [{ id: 'c1', author_name: 'Biodun K.', content: 'Got three of these this week alone.', created_at: hoursAgo(2) }],
  },
  {
    id: 'post-2', author_name: 'Chuka O.', author_initials: 'CO', category_id: 'accounts',
    content: 'Finally moved my whole family onto a password manager this weekend. Took an hour, honestly should have done it years ago.',
    created_at: hoursAgo(10), likes: 41, liked_by_me: true,
    comments: [],
  },
  {
    id: 'post-3', author_name: 'Fatima Y.', author_initials: 'FY', category_id: 'incident',
    content: 'Quick question for the group: if a work laptop gets a ransom note on screen, is it better to leave it on or shut it down immediately while waiting for IT?',
    created_at: hoursAgo(20), likes: 12, liked_by_me: false,
    comments: [
      { id: 'c2', author_name: 'Tunde A.', content: 'Generally: isolate the network, don\u2019t power off if you can avoid it — helps with forensics.', created_at: hoursAgo(19) },
    ],
  },
];
