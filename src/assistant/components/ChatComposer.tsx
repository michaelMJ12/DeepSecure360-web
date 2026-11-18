import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { ChatAttachment } from '../types';

interface ChatComposerProps {
  placeholder: string;
  busy: boolean;
  onSend: (text: string, attachment?: ChatAttachment) => void;
}

const MOCK_TRANSCRIPT = 'How do I know if a link in a text message is safe to click?';

export function ChatComposer({ placeholder, busy, onSend }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<ChatAttachment | undefined>(undefined);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSend(trimmed, attachment);
    setText('');
    setAttachment(undefined);
  };

  const recordVoice = () => {
    if (listening) return;
    setListening(true);
    // Demo only: a real build sends audio to a speech-to-text API and inserts the real transcript.
    window.setTimeout(() => {
      setText((t) => (t ? `${t} ${MOCK_TRANSCRIPT}` : MOCK_TRANSCRIPT));
      setListening(false);
    }, 1400);
  };

  return (
    <div className="asst-composer">
      {attachment && (
        <div className="asst-attachment-chip asst-attachment-pending">
          <span>{attachment.kind === 'image' ? '🖼' : '📎'}</span>{attachment.name}
          <button type="button" onClick={() => setAttachment(undefined)} aria-label="Remove attachment"><Icon name="x" size={14} /></button>
        </div>
      )}
      <div className="asst-composer-row">
        <input
          ref={fileRef} type="file" hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setAttachment({ name: file.name, kind: file.type.startsWith('image/') ? 'image' : 'file' });
            e.target.value = '';
          }}
        />
        <button type="button" className="icon-btn" title="Attach a file or image" onClick={() => fileRef.current?.click()}>
          <Icon name="attach" />
        </button>
        <textarea
          className="asst-textarea"
          rows={1}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
        />
        <button type="button" className={`icon-btn ${listening ? 'is-listening' : ''}`} title="Record a voice question" onClick={recordVoice}>
          <Icon name="mic" />
        </button>
        <Button icon="send" disabled={!text.trim()} loading={busy} onClick={submit}>Send</Button>
      </div>
      {listening && <p className="asst-listening-note">Listening… (demo transcription)</p>}
    </div>
  );
}
