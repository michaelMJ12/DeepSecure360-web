import type { LanguageOption } from '../types';

/** All five have a translated interface dictionary in `i18n.ts` — the AI's own answers aren't
 *  live-translated yet (see the README note); this only covers chat/menu chrome. */
export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native_label: 'English' },
  { code: 'ha', label: 'Hausa', native_label: 'Hausa' },
  { code: 'ig', label: 'Igbo', native_label: 'Igbo' },
  { code: 'yo', label: 'Yoruba', native_label: 'Yor\u00f9b\u00e1' },
  { code: 'pcm', label: 'Nigerian Pidgin', native_label: 'Naija' },
];
