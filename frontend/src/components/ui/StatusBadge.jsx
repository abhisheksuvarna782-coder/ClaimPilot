import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const norm = String(status || '').trim();

  const configs = {
    // 1. Five Deterministic Rule Evaluation States (Muted semantic tints)
    'Pass': {
      label: 'Pass',
      icon: CheckCircle2,
      style: 'bg-status-pass-bg text-status-pass-text border-status-pass-border',
    },
    'Fail': {
      label: 'Fail',
      icon: XCircle,
      style: 'bg-status-fail-bg text-status-fail-text border-status-fail-border',
    },
    'Missing': {
      label: 'Missing',
      icon: AlertCircle,
      style: 'bg-status-missing-bg text-status-missing-text border-status-missing-border',
    },
    'Conflict': {
      label: 'Conflict',
      icon: ShieldAlert,
      style: 'bg-status-conflict-bg text-status-conflict-text border-status-conflict-border',
    },
    'Unable to verify': {
      label: 'Unable to verify',
      icon: HelpCircle,
      style: 'bg-status-unverified-bg text-status-unverified-text border-status-unverified-border',
    },

    // 2. Confidence Signals
    'high': {
      label: 'High Confidence',
      icon: Sparkles,
      style: 'bg-lavender-faint text-lavender-highlight border-electric/40',
      iconStyle: 'text-electric',
    },
    'medium': {
      label: 'Medium Confidence',
      icon: Clock,
      style: 'bg-status-missing-bg text-status-missing-text border-status-missing-border',
    },
    'low': {
      label: 'Low Confidence',
      icon: AlertCircle,
      style: 'bg-status-fail-bg text-status-fail-text border-status-fail-border',
    },

    // 3. Field Status
    'verified': {
      label: 'Verified',
      icon: CheckCircle2,
      style: 'bg-status-pass-bg text-status-pass-text border-status-pass-border',
    },
    'needs_review': {
      label: 'Needs Review',
      icon: AlertCircle,
      style: 'bg-status-missing-bg text-status-missing-text border-status-missing-border',
    },

    // 4. Simulated Rule Tag
    'simulated': {
      label: 'Simulated Rule',
      icon: Clock,
      style: 'bg-lavender-faint text-lavender-muted border-lavender-border',
    },
  };

  const cfg = configs[norm] || {
    label: norm || 'Unknown',
    icon: HelpCircle,
    style: 'bg-deepblack text-lavender-muted border-lavender-border',
  };

  const Icon = cfg.icon;

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px] gap-1' 
    : 'px-2.5 py-1 text-[11px] gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium border rounded-sm tracking-tight transition-colors duration-150 ${cfg.style} ${sizeClasses} ${className}`}
    >
      <Icon className={`${size === 'xs' ? 'w-2.5 h-2.5 shrink-0 stroke-[2]' : 'w-3 h-3 shrink-0 stroke-[2]'} ${cfg.iconStyle || ''}`} />
      <span>{cfg.label}</span>
    </span>
  );
}
