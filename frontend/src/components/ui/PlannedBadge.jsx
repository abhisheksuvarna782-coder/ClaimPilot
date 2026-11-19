import React from 'react';

export default function PlannedBadge({ type = 'PLANNED', className = '' }) {
  const t = String(type || 'PLANNED').toUpperCase();

  const styles = {
    LIVE: "bg-status-pass-bg text-status-pass-text border-status-pass-border",
    SIMULATED: "bg-status-missing-bg text-status-missing-text border-status-missing-border",
    PLANNED: "bg-lavender-faint text-lavender-muted border-lavender-border",
  };

  const style = styles[t] || styles.PLANNED;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium uppercase tracking-wider border ${style} ${className}`}
    >
      {t}
    </span>
  );
}
