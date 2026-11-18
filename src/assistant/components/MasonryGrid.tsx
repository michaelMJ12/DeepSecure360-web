import type { ReactNode } from 'react';

/** CSS-columns masonry (Pinterest-style) — no JS layout library needed. */
export function MasonryGrid({ children }: { children: ReactNode }) {
  return <div className="asst-masonry">{children}</div>;
}
