import { Button } from '@/components/ui/Button';
import { exportConversationToPdf } from '../services/pdfExport';
import type { ChatConversation, ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  conversation: ChatConversation;
}

export function ChatMessageBubble({ message, conversation }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  return (
    <div className={`asst-bubble-row ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className="asst-bubble">
        {message.attachment && (
          <div className="asst-attachment-chip">
            <span>{message.attachment.kind === 'image' ? '🖼' : '📎'}</span>{message.attachment.name}
          </div>
        )}
        <p>{message.content}</p>
        {message.downloadable && (
          <Button variant="secondary" size="sm" icon="download" onClick={() => exportConversationToPdf(conversation)}>
            Download as PDF
          </Button>
        )}
      </div>
    </div>
  );
}
