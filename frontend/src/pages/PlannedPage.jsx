import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import Panel from '../components/ui/Panel';
import Button from '../components/ui/Button';
import PlannedBadge from '../components/ui/PlannedBadge';

export default function PlannedPage({ title, description, relatedLivePath, relatedLiveName }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 font-body">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-lavender-muted hover:text-lavender-highlight transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return</span>
        </button>
      </div>

      <Panel className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <PlannedBadge type="PLANNED" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-lavender-muted">
            Future Scope Specification
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-lavender-highlight tracking-tight mb-4">
          {title}
        </h1>

        <p className="text-sm md:text-base text-lavender leading-relaxed max-w-2xl mb-8 font-body">
          {description}
        </p>

        <div className="p-4 bg-midnight border border-lavender-border rounded-sm mb-8 text-xs font-mono text-lavender-muted">
          <div className="flex items-center gap-2 text-lavender-highlight font-medium mb-1.5">
            <Compass className="w-4 h-4 text-electric" />
            <span>PROTOTYPE NOTICE</span>
          </div>
          <p className="leading-relaxed">
            In this prototype, ClaimPilot evaluates bundled synthetic demonstration documents via deterministic regex extraction and verified rules. 
            This module is architected for future production integration and does not simulate fake actions or fabricated records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-lavender-border">
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
            variant="outline"
            onClick={() => navigate('/claims/analysis')}
          >
            Go to Claim Analysis
          </Button>
        </div>
      </Panel>
    </div>
  );
}
