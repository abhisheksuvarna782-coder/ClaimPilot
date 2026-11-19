import React from 'react';
import { 
  RefreshCw, 
  Layers, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Activity,
  ArrowRight
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeading from '../components/ui/SectionHeading';
import SourceInspector from '../components/SourceInspector';
import { useClaim } from '../context/ClaimContext';

export default function ClaimAnalysisPage() {
  const { 
    data, 
    loading, 
    error, 
    fetchAnalysis, 
    selectedField, 
    selectField 
  } = useClaim();

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      {/* Page Header */}
      <SectionHeading
        tag="PRE-SUBMISSION VERIFICATION"
        title="Claim Analysis Console"
        description="Deterministic compliance validation and evidence tracing for synthetic demonstration claim SYN-0001."
        action={
          <Button
            variant="primary"
            onClick={fetchAnalysis}
            disabled={loading}
            icon={RefreshCw}
          >
            {loading ? 'Executing Engine...' : 'Rerun Validation'}
          </Button>
        }
      />

      {/* Loading state */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-electric-light animate-spin mb-3" />
          <p className="font-heading text-sm uppercase tracking-widest text-white">
            Extracting text & evaluating deterministic rules...
          </p>
          <p className="text-xs text-lavender-dim mt-1 font-mono">
            Checking synthetic_data/discharge_summary.pdf & claim_form.pdf
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 bg-rose-950/60 border border-rose-500/40 rounded-2xl mb-8 flex items-start gap-4 text-rose-300">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-bold text-base text-white">Backend Connection Error</h3>
            <p className="text-xs text-rose-200 mt-1">{error}</p>
            <p className="text-xs text-lavender-dim mt-2 font-mono">
              Ensure FastAPI backend is active on <code className="text-electric-light">http://127.0.0.1:8000</code>
            </p>
            <Button size="sm" variant="secondary" onClick={fetchAnalysis} className="mt-3">
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Main Analysis Grid */}
      {!loading && !error && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Extracted Fields Table (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <GlassPanel className="p-5 flex flex-col h-full border-electric/30">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-electric/20">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-electric-light" />
                  <h3 className="font-heading font-bold text-white text-sm tracking-wide">
                    Extracted Fields ({data.fields?.length || 0})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lavender-dim uppercase tracking-widest">
                  CLICK ROW TO INSPECT
                </span>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[700px] overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-deepblack/80 text-lavender-dim uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-electric/20 backdrop-blur-md">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Value</th>
                      <th className="py-2.5 px-2 text-center">Doc/Pg</th>
                      <th className="py-2.5 px-3 text-center">Confidence</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-lavender">
                    {data.fields?.map((f, idx) => {
                      const isSelected = selectedField && 
                        selectedField.field === f.field && 
                        selectedField.source_doc === f.source_doc && 
                        selectedField.page === f.page;

                      return (
                        <tr
                          key={idx}
                          onClick={() => selectField(f)}
                          className={`cursor-pointer transition-all duration-150 ${
                            isSelected 
                              ? 'bg-electric/25 font-bold text-white border-l-4 border-l-electric-glow' 
                              : 'hover:bg-white/5 border-l-4 border-l-transparent'
                          }`}
                        >
                          <td className="py-3 px-3 text-electric-light font-semibold">
                            {f.field}
                          </td>
                          <td className="py-3 px-3 max-w-[130px] truncate text-white" title={f.value}>
                            {f.value}
                          </td>
                          <td className="py-3 px-2 text-center text-[11px] text-lavender-dim">
                            <span title={f.source_doc} className="block truncate max-w-[80px]">
                              {f.source_doc.includes('discharge') ? 'discharge' : 'claim'}
                            </span>
                            <span className="text-electric-glow font-bold">p.{f.page}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={f.confidence} size="xs" />
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={f.status} size="xs" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </div>

          {/* MIDDLE: Rule Results & Conflict Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Cross-Document Conflict Card */}
            {data.conflicts && data.conflicts.length > 0 && (
              <GlassPanel className="p-5 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Cross-Document Conflict
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                    Staff Reconciliation
                  </span>
                </div>

                {data.conflicts.map((conf, cIdx) => (
                  <div key={cIdx} className="space-y-3">
                    <p className="text-xs font-mono text-lavender">
                      Target Discrepancy: <span className="text-purple-300 font-bold">{conf.field}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Doc A */}
                      <div className="p-3 rounded-xl bg-deepblack/80 border border-purple-500/30 font-mono text-xs">
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 block font-bold">Document A</span>
                        <p className="text-white font-medium truncate mt-0.5 text-[11px]" title={conf.a.doc}>
                          {conf.a.doc}
                        </p>
                        <span className="text-[10px] text-lavender-dim">Page {conf.a.page}</span>
                        <p className="mt-2 text-sm font-bold text-purple-200 bg-purple-950/60 p-1.5 rounded text-center border border-purple-500/40">
                          {conf.a.value}
                        </p>
                      </div>

                      {/* Doc B */}
                      <div className="p-3 rounded-xl bg-deepblack/80 border border-purple-500/30 font-mono text-xs">
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 block font-bold">Document B</span>
                        <p className="text-white font-medium truncate mt-0.5 text-[11px]" title={conf.b.doc}>
                          {conf.b.doc}
                        </p>
                        <span className="text-[10px] text-lavender-dim">Page {conf.b.page}</span>
                        <p className="mt-2 text-sm font-bold text-purple-200 bg-purple-950/60 p-1.5 rounded text-center border border-purple-500/40">
                          {conf.b.value}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-lavender-dim p-2.5 rounded-lg bg-deepblack/60 border border-white/5 leading-relaxed">
                      {conf.explanation}
                    </p>
                  </div>
                ))}
              </GlassPanel>
            )}

            {/* Rules Container */}
            <GlassPanel className="p-5 flex flex-col gap-3 border-electric/30">
              <div className="flex items-center justify-between pb-3 border-b border-electric/20">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-electric-light" />
                  <h3 className="font-heading font-bold text-white text-sm">
                    Deterministic Rules
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lavender-dim uppercase tracking-wider">
                  4 Evaluated
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {data.rule_results?.map((rule) => (
                  <div
                    key={rule.rule_id}
                    className="p-3.5 rounded-xl bg-deepblack/70 border border-white/5 hover:border-electric/30 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs text-white">
                          {rule.rule_id}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30">
                          {rule.rule_status} rule
                        </span>
                      </div>
                      <StatusBadge status={rule.result} size="xs" />
                    </div>

                    <p className="text-xs font-semibold text-white mb-1.5">
                      {rule.description}
                    </p>

                    <p className="text-xs text-lavender-dim leading-relaxed mb-2 font-sans">
                      {rule.explanation}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-start gap-1.5 text-[11px] font-mono text-lavender-dim">
                      <span className="text-electric-light font-bold shrink-0">Action:</span>
                      <span className="text-lavender-light italic">{rule.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

          </div>

          {/* RIGHT: Source Inspector (3 cols) */}
          <div className="lg:col-span-3">
            <SourceInspector />
          </div>

        </div>
      )}

    </div>
  );
}

