import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <aside
      aria-label="Synthetic Data Notice"
      className="w-full bg-deepblack border-b border-lavender-border py-2 px-4 text-center text-[11px] font-mono tracking-wider flex items-center justify-center gap-2 z-50 sticky top-0"
    >
      <AlertCircle className="w-3.5 h-3.5 text-electric shrink-0 stroke-[2]" aria-hidden="true" />
      <span className="font-semibold text-lavender-highlight">
        SYNTHETIC DEMONSTRATION DATA — NOT A REAL PATIENT RECORD
      </span>
      <span className="hidden md:inline text-lavender-muted font-body text-[11px] tracking-normal">
        • Simulated rules • Does not predict insurer decisions • Human review required
      </span>
    </aside>
  );
}
