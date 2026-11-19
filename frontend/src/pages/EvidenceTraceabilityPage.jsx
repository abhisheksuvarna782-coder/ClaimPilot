import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Compass, 
  ArrowRight,
  HelpCircle,
  Layers
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import StatusBadge from '../components/ui/StatusBadge';
import { useClaim } from '../context/ClaimContext';

export default function EvidenceTraceabilityPage() {
  const navigate = useNavigate();
  const { data, loading, selectField } = useClaim();

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="PROVENANCE & INTEGRITY"
        title="Evidence Traceability Matrix"
        description="Every extracted claim attribute is linked to its source document, page number, and verbatim snippet with signal validation."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
            icon={ArrowRight}
          >
            Open Claim Console
          </Button>
        }
      />

      {/* Note on Confidence Label */}
      <GlassPanel className="p-4 mb-8 border-electric/30 bg-deepblack/60">
        <div className="flex items-center gap-2 text-xs font-mono text-electric-light font-bold mb-1">
          <Compass className="w-4 h-4 text-electric-glow" />
          <span>CONFIDENCE SCORE DEFINITION</span>
        </div>
        <p className="text-xs font-mono text-lavender-dim leading-relaxed">
          In this prototype, <strong className="text-white">Confidence</strong> is an extraction-quality indicator evaluating verbatim snippet presence, syntactic validity, and cross-document agreement. It is <span className="text-amber-300 font-bold">not a probability score</span>. Single-document fields denote cross-document agreement as &quot;not applicable&quot; rather than false.
        </p>
      </GlassPanel>

      {/* Traceability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.fields?.map((f, idx) => {
          const signals = f.signals || {};

          return (
            <GlassPanel
              key={idx}
              interactive
              onClick={() => {
                selectField(f);
                navigate('/claims/analysis');
              }}
              className="p-5 flex flex-col justify-between border-electric/25 hover:border-electric-light"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-bold text-white text-sm">
                    {f.field}
                  </span>
                  <StatusBadge status={f.confidence} size="xs" />
                </div>

                {/* Extracted Value */}
                <div className="p-2.5 rounded-lg bg-deepblack/80 border border-white/5 mb-3">
                  <span className="text-[10px] font-mono text-lavender-dim uppercase tracking-wider block">
                    Extracted Value
                  </span>
                  <span className="text-sm font-mono font-bold text-electric-glow mt-0.5 block truncate" title={f.value}>
                    {f.value}
                  </span>
                </div>

                {/* Source Citation */}
                <div className="flex items-center justify-between text-xs font-mono text-lavender-dim mb-3 pb-2 border-b border-white/5">
                  <span>Document: <strong className="text-white truncate inline-block max-w-[120px]" title={f.source_doc}>{f.source_doc}</strong></span>
                  <span>Page: <strong className="text-electric-light">{f.page}</strong></span>
                </div>

                {/* Verbatim Snippet */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-lavender-dim uppercase tracking-wider block mb-1">
                    Verbatim Snippet
                  </span>
                  <p className="text-xs font-mono bg-amber-950/20 text-amber-200/90 p-2 rounded border border-amber-500/20 line-clamp-3">
                    &ldquo;{f.snippet}&rdquo;
                  </p>
                </div>
              </div>

              {/* Signals Checklist */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-dim block mb-2 font-bold">
                  Validation Signals:
                </span>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  
                  {/* Signal 1: snippet_found */}
                  <div className={`p-1.5 rounded flex items-center gap-1 border ${
                    signals.snippet_found 
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                  }`}>
                    {signals.snippet_found ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0" />}
                    <span className="truncate">Snippet</span>
                  </div>

                  {/* Signal 2: format_valid */}
                  <div className={`p-1.5 rounded flex items-center gap-1 border ${
                    signals.format_valid 
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                  }`}>
                    {signals.format_valid ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0" />}
                    <span className="truncate">Format</span>
                  </div>

                  {/* Signal 3: cross_doc_agree */}
                  <div className={`p-1.5 rounded flex items-center gap-1 border ${
                    signals.cross_doc_agree === true
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                      : signals.cross_doc_agree === false
                      ? 'bg-purple-950/30 text-purple-300 border-purple-500/30'
                      : 'bg-slate-900/60 text-lavender-dim border-white/5'
                  }`}>
                    {signals.cross_doc_agree === true ? (
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    ) : signals.cross_doc_agree === false ? (
                      <AlertCircle className="w-3 h-3 shrink-0" />
                    ) : (
                      <span className="text-[9px]">N/A</span>
                    )}
                    <span className="truncate">Cross-Doc</span>
                  </div>

                </div>
              </div>

            </GlassPanel>
          );
        })}
      </div>

    </div>
  );
}

