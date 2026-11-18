import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { CHAT_GROUPS, CHAT_PROJECTS } from '../types';
import type { ChatConversation } from '../types';

interface HistoryItemMenuProps {
  conversation: ChatConversation;
  onPin: () => void;
  onStartRename: () => void;
  onSetProject: (project: string | null) => void;
  onSetGroup: (group: string | null) => void;
  onDelete: () => void;
}

/** The "⋯" menu on a history item: pin, rename, add to project, move to group, delete. */
export function HistoryItemMenu({ conversation, onPin, onStartRename, onSetProject, onSetGroup, onDelete }: HistoryItemMenuProps) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<'project' | 'group' | null>(null);

  const close = () => { setOpen(false); setSubmenu(null); };

  return (
    <div className="asst-history-menu">
      <button type="button" className="asst-history-menu-trigger" aria-label="More options" onClick={() => setOpen((o) => !o)}>
        <Icon name="menu" size={13} />
      </button>
      {open && (
        <>
          <div className="asst-menu-scrim" onClick={close} />
          <div className="asst-dropdown">
            {submenu === null && (
              <>
                <button type="button" onClick={() => { onPin(); close(); }}><Icon name="star" size={14} />{conversation.pinned ? 'Unpin' : 'Pin'}</button>
                <button type="button" onClick={() => { onStartRename(); close(); }}><Icon name="edit" size={14} />Rename</button>
                <button type="button" onClick={() => setSubmenu('project')}><Icon name="plus" size={14} />Add to project</button>
                <button type="button" onClick={() => setSubmenu('group')}><Icon name="inbox" size={14} />Move to group</button>
                <button type="button" className="is-danger" onClick={() => { onDelete(); close(); }}><Icon name="trash" size={14} />Delete</button>
              </>
            )}
            {submenu === 'project' && (
              <>
                <button type="button" className="asst-dropdown-back" onClick={() => setSubmenu(null)}>‹ Back</button>
                <button type="button" onClick={() => { onSetProject(null); close(); }}>No project</button>
                {CHAT_PROJECTS.map((p) => (
                  <button key={p} type="button" onClick={() => { onSetProject(p); close(); }}>{p}</button>
                ))}
              </>
            )}
            {submenu === 'group' && (
              <>
                <button type="button" className="asst-dropdown-back" onClick={() => setSubmenu(null)}>‹ Back</button>
                <button type="button" onClick={() => { onSetGroup(null); close(); }}>No group</button>
                {CHAT_GROUPS.map((g) => (
                  <button key={g} type="button" onClick={() => { onSetGroup(g); close(); }}>{g}</button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
