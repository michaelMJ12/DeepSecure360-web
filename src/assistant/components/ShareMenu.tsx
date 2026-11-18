import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ShareMenuProps {
  text: string;
  url: string;
}

/**
 * Opens each platform's own public share dialog (a "share intent" link) with
 * the post text pre-filled — the person still posts it themselves, from
 * their own logged-in account. That's the realistic, consent-respecting way
 * a web app can offer "share to social" without impersonating the user or
 * needing that platform's full API integration. TikTok has no public web
 * share-intent URL, so it falls back to copying the text to the clipboard.
 */
export function ShareMenu({ text, url }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  const links = [
    { name: 'Facebook', icon: 'facebook' as const, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'X', icon: 'twitter' as const, href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { name: 'LinkedIn', icon: 'linkedin' as const, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: 'Telegram', icon: 'telegram' as const, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    { name: 'WhatsApp', icon: 'whatsapp' as const, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
  ];

  return (
    <div className="asst-share">
      <button type="button" className="asst-icon-action" onClick={() => setOpen((o) => !o)} aria-label="Share">
        <Icon name="share" size={16} /> Share
      </button>
      {open && (
        <div className="asst-share-menu">
          {links.map((l) => (
            <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="asst-share-item">
              <Icon name={l.icon} size={15} />{l.name}
            </a>
          ))}
          <button
            type="button"
            className="asst-share-item"
            onClick={() => { navigator.clipboard?.writeText(`${text} ${url}`); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}
          >
            <Icon name="tiktok" size={15} />{copied ? 'Copied!' : 'Copy for TikTok'}
          </button>
        </div>
      )}
    </div>
  );
}
