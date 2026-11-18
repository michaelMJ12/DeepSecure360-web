import type { ChatConversation, ChatMessage, ChatMode } from '../types';

const KEY = 'ds360_assistant_conversations';

function readAll(): ChatConversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChatConversation[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: ChatConversation[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function patch(id: string, fn: (c: ChatConversation) => ChatConversation): ChatConversation[] {
  const all = readAll().map((c) => (c.id === id ? fn(c) : c));
  writeAll(all);
  return all;
}

/** All chat history lives in the browser for this prototype — a real deployment should persist it
 *  server-side per signed-in visitor (or per session id) instead, so history survives a new device. */
export const chatStorage = {
  /** Pinned conversations first (newest pin first), then everything else by most recently updated. */
  list(): ChatConversation[] {
    return readAll().sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updated_at.localeCompare(a.updated_at);
    });
  },
  get(id: string): ChatConversation | undefined {
    return readAll().find((c) => c.id === id);
  },
  create(mode: ChatMode, categoryId: string): ChatConversation {
    const now = new Date().toISOString();
    const convo: ChatConversation = {
      id: crypto.randomUUID(), title: 'New conversation', mode, category_id: categoryId, messages: [],
      created_at: now, updated_at: now, pinned: false, project: null, group: null,
    };
    writeAll([convo, ...readAll()]);
    return convo;
  },
  appendMessage(id: string, message: ChatMessage): ChatConversation | undefined {
    const all = readAll();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return undefined;
    const convo = all[idx];
    const messages = [...convo.messages, message];
    const title = convo.title === 'New conversation' && message.role === 'user' ? message.content.slice(0, 48) : convo.title;
    const updated = { ...convo, messages, title, updated_at: new Date().toISOString() };
    all[idx] = updated;
    writeAll(all);
    return updated;
  },
  togglePin(id: string): ChatConversation[] {
    return patch(id, (c) => ({ ...c, pinned: !c.pinned }));
  },
  rename(id: string, title: string): ChatConversation[] {
    return patch(id, (c) => ({ ...c, title: title.trim() || c.title }));
  },
  setProject(id: string, project: string | null): ChatConversation[] {
    return patch(id, (c) => ({ ...c, project }));
  },
  setGroup(id: string, group: string | null): ChatConversation[] {
    return patch(id, (c) => ({ ...c, group }));
  },
  setCategory(id: string, categoryId: string): ChatConversation[] {
    return patch(id, (c) => ({ ...c, category_id: categoryId }));
  },
  remove(id: string) {
    writeAll(readAll().filter((c) => c.id !== id));
  },
  clearAll() {
    writeAll([]);
  },
};
