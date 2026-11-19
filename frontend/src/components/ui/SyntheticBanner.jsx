import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#180005] via-[#2D000A] to-[#180005] border-b border-rose-900/60 text-rose-300 py-1.5 px-4 text-center text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(225,29,72,0.15)] z-50 sticky top-0 backdrop-blur-md">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="font-semibold text-rose-200">
        SYNTHETIC DEMONSTRATION DATA — NOT A REAL PATIENT RECORD
      </span>
      <span className="hidden lg:inline text-rose-400/60 font-sans text-[10px] lowercase tracking-normal">
        (simulated rules &bull; does not predict insurer decisions &bull; never submits claims)
      </span>
      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
    </div>
  );
}
