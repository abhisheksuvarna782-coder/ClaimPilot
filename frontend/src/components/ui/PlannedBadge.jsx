import React from 'react';

export default function PlannedBadge({ type = 'PLANNED', className = '' }) {
  const t = String(type || 'PLANNED').toUpperCase();

  const styles = {
    LIVE: "bg-emerald-950/40 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    SIMULATED: "bg-amber-950/40 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
    PLANNED: "bg-slate-900/60 text-lavender-dim border-lavender-dim/20",
  };

  const style = styles[t] || styles.PLANNED;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${style} ${className}`}
    >
      {t}
    </span>
  );
}

