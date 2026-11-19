import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import PlannedBadge from '../components/ui/PlannedBadge';

export default function PlannedPage({ title, description, relatedLivePath, relatedLiveName }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-lavender-dim hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return</span>
        </button>
      </div>

      <GlassPanel className="p-8 md:p-12 border border-electric/30 shadow-glow-sm">
        <div className="flex items-center gap-3 mb-6">
          <PlannedBadge type="PLANNED" className="text-xs px-2.5 py-1" />
          <span className="text-xs font-mono uppercase tracking-widest text-electric-light">
            Future Scope Specification
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-wide mb-4">
          {title}
        </h1>

        <p className="text-base text-lavender-light/90 leading-relaxed max-w-2xl mb-8">
          {description}
        </p>

        <div className="p-5 rounded-xl bg-deepblack/80 border border-electric/20 mb-8 text-xs font-mono text-lavender-dim">
          <div className="flex items-center gap-2 text-electric-glow font-bold mb-2">
            <Compass className="w-4 h-4" />
            <span>PROTOTYPE HONESTY NOTE</span>
          </div>
          <p className="leading-relaxed">
            In this hackathon proof of work, ClaimPilot runs on a bundled deterministic rules engine and synthetic demonstration documents. 
            This module is architected for Phase 4 production integration with real insurer API gateways and human review queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-lavender-dim/15">
          {relatedLivePath && (
            <Button
              variant="primary"
              onClick={() => navigate(relatedLivePath)}
              icon={ArrowUpRight}
            >
              Open Live {relatedLiveName || 'Feature'}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => navigate('/claims/analysis')}
          >
            Go to Claim Analysis
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
