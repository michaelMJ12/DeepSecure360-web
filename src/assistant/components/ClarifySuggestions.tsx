import { CLARIFY_PROMPTS } from '../data/mockReplies';

interface ClarifySuggestionsProps {
  onPick: (prompt: string) => void;
}

export function ClarifySuggestions({ onPick }: ClarifySuggestionsProps) {
  return (
    <div className="asst-clarify-list">
      <p className="asst-clarify-title">Or try one of these</p>
      {CLARIFY_PROMPTS.map((p) => (
        <button key={p} type="button" className="asst-clarify-card" onClick={() => onPick(p)}>{p}</button>
      ))}
    </div>
  );
}
