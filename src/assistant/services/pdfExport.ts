import { jsPDF } from 'jspdf';
import type { ChatConversation } from '../types';

/**
 * Exports one conversation as a simple text PDF. Requires `jspdf`
 * (`npm install jspdf`) — listed in package.json for this project.
 */
export function exportConversationToPdf(convo: ChatConversation) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const maxWidth = 595 - margin * 2;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DeepSecure360 AI Assistant', margin, y);
  y += 22;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(convo.title, margin, y);
  y += 24;

  convo.messages.forEach((m) => {
    const label = m.role === 'user' ? 'You' : 'Assistant';
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(`${label}:`, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * 14;

    doc.setFont('helvetica', 'normal');
    const bodyLines = doc.splitTextToSize(m.content, maxWidth) as string[];
    bodyLines.forEach((line) => {
      if (y > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    });
    y += 10;
  });

  doc.save(`${convo.title.replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'conversation'}.pdf`);
}
