/**
 * Types for the public AI assistant product. Deliberately separate from
 * `@/types/models` (the admin/org/staff dashboards) — this is a different
 * product with its own visitors, not an authenticated platform role.
 */
export type ChatRole = 'user' | 'assistant';

export interface ChatAttachment {
  name: string;
  kind: 'file' | 'image';
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
  attachment?: ChatAttachment;
  downloadable?: boolean;
}

export type ChatMode = 'chat' | 'clarify' | 'comprehend' | 'respond';

export interface ChatConversation {
  id: string;
  title: string;
  mode: ChatMode;
  category_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  pinned: boolean;
  project: string | null;
  group: string | null;
}

/** Demo-only organising buckets for chat history, matching a ChatGPT-style sidebar. */
export const CHAT_PROJECTS = ['Personal', 'Work', 'Client research'] as const;
export const CHAT_GROUPS = ['This week', 'This month', 'Older'] as const;

export interface CyberCategory {
  id: string;
  label: string;
  description: string;
  color: string;
}

export interface LanguageOption {
  code: string;
  label: string;
  native_label: string;
}

export interface HubComment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface HubPost {
  id: string;
  author_name: string;
  author_initials: string;
  content: string;
  category_id: string;
  created_at: string;
  likes: number;
  liked_by_me: boolean;
  comments: HubComment[];
}

/** Mirrors the fields on the backend `User` entity (organizationId, firstName, lastName, role,
 *  mfaEnabled, isActive) so this profile can be swapped for a real API response later. */
export interface VisitorProfile {
  id: string;
  organization_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  role: 'viewer' | 'org_admin';
  mfa_enabled: boolean;
  is_active: boolean;
  avatar_data_url: string | null;
  language: string;
  trial_started_at: string;
}

/* ---------- Assistant's own sign-up/sign-in (separate from the admin login) ---------- */
export type SignupRoleChoice = 'viewer' | 'private' | 'public' | 'government';

export interface AssistantAccount {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'viewer' | 'org_admin';
  sector: 'private' | 'public' | 'government' | null;
  organization_name: string | null;
  mfa_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

/** What a resolved sign-in redirects to. */
export type AssistantLoginDestination = 'assistant' | '/admin' | '/org' | '/staff';

/* ---------- Clarify / Comprehend: Civiqli-style masonry cards + single-card gallery ---------- */
export interface ClarifyCard {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  likes: number;
  liked_by_me: boolean;
  bookmarked_by_me: boolean;
  comments: HubComment[];
  created_at: string;
}

export interface VideoCard {
  id: string;
  category_id: string;
  title: string;
  summary: string;
  duration_label: string;
  thumbnail_color: string;
  likes: number;
  liked_by_me: boolean;
  bookmarked_by_me: boolean;
  comments: HubComment[];
  created_at: string;
}
