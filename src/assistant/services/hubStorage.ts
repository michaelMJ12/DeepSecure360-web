import { SEED_HUB_POSTS } from '../data/mockHub';
import type { HubComment, HubPost } from '../types';

const KEY = 'ds360_assistant_hub_posts';

function readAll(): HubPost[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HubPost[]) : SEED_HUB_POSTS;
  } catch {
    return SEED_HUB_POSTS;
  }
}

function writeAll(list: HubPost[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const hubStorage = {
  list(): HubPost[] {
    return readAll().sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  createPost(authorName: string, content: string, categoryId: string): HubPost {
    const post: HubPost = {
      id: crypto.randomUUID(), author_name: authorName, author_initials: authorName.slice(0, 2).toUpperCase(),
      content, category_id: categoryId, created_at: new Date().toISOString(), likes: 0, liked_by_me: false, comments: [],
    };
    writeAll([post, ...readAll()]);
    return post;
  },
  toggleLike(id: string): HubPost[] {
    const all = readAll().map((p) => (p.id === id ? { ...p, liked_by_me: !p.liked_by_me, likes: p.likes + (p.liked_by_me ? -1 : 1) } : p));
    writeAll(all);
    return all;
  },
  addComment(id: string, authorName: string, content: string): HubPost[] {
    const comment: HubComment = { id: crypto.randomUUID(), author_name: authorName, content, created_at: new Date().toISOString() };
    const all = readAll().map((p) => (p.id === id ? { ...p, comments: [...p.comments, comment] } : p));
    writeAll(all);
    return all;
  },
};
