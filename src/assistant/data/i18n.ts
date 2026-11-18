/** Small demo dictionary for the chrome around the chat — proves the language switcher works end
 *  to end for a few languages without needing a translation API. Extend per-language as needed;
 *  anything missing falls back to English. */
export const UI_STRINGS: Record<string, Record<string, string>> = {
  en: {
    newChat: 'New chat', clarify: 'Clarify', comprehend: 'Comprehend video', respond: 'Incident response',
    publicHub: 'Public Hub', searchChats: 'Search chats', composerPlaceholder: 'Ask about a cybersecurity concern…',
    send: 'Send', recentChats: 'Recent chats', noChats: 'No conversations yet', trialBanner: 'day(s) left in your free trial',
  },
  yo: {
    newChat: '\u00c0l\u00e0ab\u00f2 \u00f2r\u00f2 tuntun', clarify: 'Ṣ\u00e0l\u00e1y\u00e9', comprehend: 'F\u00e0y\u00e0wo f\u00edd\u00eco', respond: 'Ìd\u00e1huns\u00ecl\u00f3',
    publicHub: '\u1ecc\u0300d\u1ecd\u0300 Gb\u00f3g\u00e0nj\u00f3', searchChats: '\u1e62\u00e0w\u00e0r\u00ed \u00ecb\u00e1n\u00ecs\u1ecd\u0300r\u1ecd\u0300', composerPlaceholder: 'B\u00e9r\u00e8 nip\u00a0a i\u1e63or\u00f2 ayelujara…',
    send: 'Fi ránṣ\u1eb9\u0301', recentChats: '\u00cb\u0300r\u1ecd\u0300 t\u00f3 \u1e63\u1eb9\u0300 \u1e63\u1eb9l\u1eb9', noChats: 'K\u00f2 s\u00ed \u00ecb\u00e1n\u00ecs\u1ecd\u0300r\u1ecd\u0300 kankan', trialBanner: '\u1ecdj\u1ecd\u0301 \u0300 to k\u00f9 n\u00ecn\u00fa \u00e0d\u00e1nw\u00f2 ọf\u00e9\u0301',
  },
  ha: {
    newChat: 'Sabon hira', clarify: 'Bayyanawa', comprehend: 'Fahimci bidiyo', respond: 'Mayar da martani',
    publicHub: 'Dandalin Jama\u2019a', searchChats: 'Nemo hirarraki', composerPlaceholder: 'Tambaya game da tsaron intanet…',
    send: 'Aika', recentChats: 'Hirarrakin baya-bayan nan', noChats: 'Babu hira tukuna', trialBanner: 'kwana(kwanaki) sun rage a gwajin kyauta',
  },
  pcm: {
    newChat: 'New chat', clarify: 'Clarify am', comprehend: 'Explain video', respond: 'Wetin to do',
    publicHub: 'Public Hub', searchChats: 'Find old chat', composerPlaceholder: 'Ask your cybersecurity wahala…',
    send: 'Send am', recentChats: 'Old chats', noChats: 'No chat dey yet', trialBanner: 'day(s) remain for your free trial',
  },
  ig: {
    newChat: 'Mkparit\u1ecbta \u1ecdh\u1ee5r\u1ee5', clarify: 'Kowaputa', comprehend: 'Ghota vidiyo', respond: 'Nzaghachi mberede',
    publicHub: '\u1ecc\u0300d\u1ee5 \u1ecckpup\u1ee5r\u1ee5 \u1ecbche', searchChats: 'Ch\u1ecd\u1ecd mkparit\u1ecbta', composerPlaceholder: 'J\u1ee5\u1ecd maka nchekwa k\u1ecbb\u1ecdt\u1ee5\u0300\u2026',
    send: 'Zipu', recentChats: 'Mkparit\u1ecbta nso nso a', noChats: 'Enwegh\u1ecb mkparit\u1ecbta', trialBanner: '\u1ee5b\u1ecdch\u1ecb f\u1ecdd\u1ee5r\u1ee5n\u1ecb n\'\u1ecbnwale efu g\u1ecb',
  },
};

export function t(lang: string, key: string): string {
  return UI_STRINGS[lang]?.[key] ?? UI_STRINGS.en[key] ?? key;
}
