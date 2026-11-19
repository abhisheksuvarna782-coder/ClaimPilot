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
    'Pass': {
      label: 'Pass',
      icon: CheckCircle2,
      style: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    },
    'Fail': {
      label: 'Fail',
      icon: XCircle,
      style: 'bg-rose-950/40 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    },
    'Missing': {
      label: 'Missing',
      icon: AlertCircle,
      style: 'bg-amber-950/40 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    },
    'Conflict': {
      label: 'Conflict',
      icon: ShieldAlert,
      style: 'bg-purple-950/40 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]',
    },
    'Unable to verify': {
      label: 'Unable to verify',
      icon: HelpCircle,
      style: 'bg-slate-900/60 text-lavender-dim border-lavender-dim/30 shadow-[0_0_8px_rgba(142,136,168,0.15)]',
    },
    // Confidence badges
    'high': {
      label: 'High Confidence',
      icon: Sparkles,
      style: 'bg-electric-dark/40 text-electric-glow border-electric/40 shadow-[0_0_10px_rgba(0,194,255,0.2)]',
    },
    'medium': {
      label: 'Medium Confidence',
      icon: Clock,
      style: 'bg-amber-950/30 text-amber-300 border-amber-500/30',
    },
    'low': {
      label: 'Low Confidence',
      icon: AlertCircle,
      style: 'bg-rose-950/30 text-rose-300 border-rose-500/30',
    },
    // Field status badges
    'verified': {
      label: 'Verified',
      icon: CheckCircle2,
      style: 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30',
    },
    'needs_review': {
      label: 'Needs Review',
      icon: AlertCircle,
      style: 'bg-amber-950/30 text-amber-300 border-amber-500/30',
    },
  };

  const cfg = configs[norm] || {
    label: norm || 'Unknown',
    icon: HelpCircle,
    style: 'bg-deepblack text-lavender-dim border-electric/20',
  };

  const Icon = cfg.icon;

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px] gap-1' 
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border backdrop-blur-md uppercase tracking-wider ${sizeClasses} ${cfg.style} ${className}`}
    >
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{cfg.label}</span>
    </span>
  );
}

