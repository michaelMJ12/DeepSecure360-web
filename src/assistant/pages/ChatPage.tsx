import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CategoryPicker } from '../components/CategoryPicker';
import { ClarifySuggestions } from '../components/ClarifySuggestions';
import { ChatComposer } from '../components/ChatComposer';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { TrialBanner } from '../components/TrialBanner';
import { categoryById } from '../data/categories';
import { generateMockReply } from '../data/mockReplies';
import { chatStorage } from '../services/chatStorage';
import { useAssistantAuth } from '../context/AssistantAuthContext';
import { t } from '../data/i18n';
import { useAssistantSettings } from '../context/AssistantSettingsContext';
import type { ChatAttachment } from '../types';
import type { AssistantOutletContext } from './AssistantLayout';

const MODE_PLACEHOLDER: Record<string, string> = {
  chat: 'Ask about a cybersecurity concern…',
  clarify: 'Describe what\u2019s confusing you, in your own words…',
  comprehend: 'Paste a video link, or describe what it covers…',
  respond: 'Describe what\u2019s happening right now…',
};

export default function ChatPage() {
  const { conversations, activeId, setActiveId, refreshConversations } = useOutletContext<AssistantOutletContext>();
  const { profile } = useAssistantSettings();
  const { isSignedIn } = useAssistantAuth();
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [active?.messages.length]);

  const startWithCategory = (categoryId: string) => {
    const convo = chatStorage.create('chat', categoryId);
    refreshConversations();
    setActiveId(convo.id);
  };

  const send = async (text: string, attachment?: ChatAttachment) => {
    let convo = active;
    if (!convo) {
      convo = chatStorage.create('chat', 'hygiene');
      setActiveId(convo.id);
    }
    const wantsPdf = /\bpdf\b|download/i.test(text);
    chatStorage.appendMessage(convo.id, { id: crypto.randomUUID(), role: 'user', content: text, created_at: new Date().toISOString(), attachment });
    refreshConversations();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    const reply = generateMockReply(convo.category_id, convo.mode);
    chatStorage.appendMessage(convo.id, { id: crypto.randomUUID(), role: 'assistant', content: reply, created_at: new Date().toISOString(), downloadable: wantsPdf });
    refreshConversations();
    setBusy(false);
  };

  if (!active) {
    return (
      <div className="asst-landing">
        {!isSignedIn && <TrialBanner />}
        <h2 className="asst-landing-title">What can I help you with?</h2>
        <p className="asst-landing-sub">Pick a topic so every answer stays focused on it — or just start typing below.</p>
        <CategoryPicker onSelect={startWithCategory} />
        <ChatComposer placeholder={t(profile.language, 'composerPlaceholder')} busy={busy} onSend={send} />
      </div>
    );
  }

  const category = categoryById(active.category_id);

  return (
    <div className="asst-thread">
      {!isSignedIn && <TrialBanner />}
      <div className="asst-thread-head">
        <Badge tone="neutral"><span style={{ color: category.color }}>●</span> {category.label}</Badge>
        {active.messages.length > 0 && (
          <Button variant="secondary" size="sm" icon="download" onClick={() => import('../services/pdfExport').then((m) => m.exportConversationToPdf(active))}>
            Export conversation
          </Button>
        )}
      </div>

      <div className="asst-messages">
        {active.messages.length === 0 && active.mode === 'chat' && <ClarifySuggestions onPick={(p) => void send(p)} />}
        {active.messages.length === 0 && active.mode !== 'chat' && (
          <p className="asst-mode-hint">{MODE_PLACEHOLDER[active.mode]}</p>
        )}
        {active.messages.map((m) => <ChatMessageBubble key={m.id} message={m} conversation={active} />)}
        {busy && <div className="asst-bubble-row is-assistant"><div className="asst-bubble asst-typing"><span /><span /><span /></div></div>}
        <div ref={endRef} />
      </div>

      <ChatComposer placeholder={MODE_PLACEHOLDER[active.mode] ?? MODE_PLACEHOLDER.chat} busy={busy} onSend={send} />
    </div>
  );
}
