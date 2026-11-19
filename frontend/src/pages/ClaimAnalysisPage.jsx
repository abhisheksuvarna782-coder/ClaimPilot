import React from 'react';
import { 
  RefreshCw, 
  Layers, 
  ShieldAlert, 
  AlertCircle, 
  Activity,
  Quote
} from 'lucide-react';
import Panel from '../components/ui/Panel';
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
        tag="Pre-Submission Verification"
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
          <RefreshCw className="w-8 h-8 text-electric animate-spin mb-3" />
          <p className="font-display text-sm uppercase tracking-widest text-lavender-highlight">
            Extracting text & evaluating deterministic rules...
          </p>
          <p className="text-xs text-lavender-muted mt-1 font-mono">
            Checking synthetic_data/discharge_summary.pdf & claim_form.pdf
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Panel className="p-6 border-status-fail-border bg-status-fail-bg mb-8 flex items-start gap-4 text-status-fail-text">
          <AlertCircle className="w-6 h-6 text-status-fail-text shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-base text-lavender-highlight">Backend Connection Error</h3>
            <p className="text-xs text-status-fail-text mt-1">{error}</p>
            <p className="text-xs text-lavender-muted mt-2 font-mono">
              Ensure FastAPI backend is active on <code className="text-lavender-highlight">http://127.0.0.1:8000</code>
            </p>
            <Button size="sm" variant="outline" onClick={fetchAnalysis} className="mt-3">
              Retry Connection
            </Button>
          </div>
        </Panel>
      )}

      {/* Main Analysis Grid */}
      {!loading && !error && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Extracted Fields Table (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <Panel className="p-5 flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-lavender-border">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-electric" />
                  <h3 className="font-display font-bold text-lavender-highlight text-sm tracking-wide">
                    Extracted Fields ({data.fields?.length || 0})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lavender-muted uppercase tracking-widest">
                  CLICK ROW TO INSPECT
                </span>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[700px] overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-deepblack text-lavender-muted uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-lavender-border">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Value</th>
                      <th className="py-2.5 px-2 text-center">Doc/Pg</th>
                      <th className="py-2.5 px-3 text-center">Confidence</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lavender-border text-lavender">
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
                              ? 'bg-lavender-faint font-medium text-lavender-highlight border-l-2 border-l-electric' 
                              : 'hover:bg-lavender-faint border-l-2 border-l-transparent'
                          }`}
                        >
                          <td className="py-3 px-3 text-lavender-highlight font-medium">
                            {f.field}
                          </td>
                          <td className="py-3 px-3 max-w-[130px] truncate text-lavender" title={f.value}>
                            {f.value}
                          </td>
                          <td className="py-3 px-2 text-center text-[11px] text-lavender-muted">
                            <span title={f.source_doc} className="block truncate max-w-[80px]">
                              {f.source_doc.includes('discharge') ? 'discharge' : 'claim'}
                            </span>
                            <span className="text-lavender-highlight font-semibold">p.{f.page}</span>
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
            </Panel>
          </div>

          {/* MIDDLE: Rule Results & Conflict Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Cross-Document Conflict Card */}
            {data.conflicts && data.conflicts.length > 0 && (
              <Panel className="p-5 border-status-conflict-border">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-lavender-border">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-status-conflict-text" />
                    <h3 className="font-display font-bold text-lavender-highlight text-sm">
                      Cross-Document Conflict
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-status-conflict-bg text-status-conflict-text border border-status-conflict-border">
                    Staff Reconciliation
                  </span>
                </div>

                {data.conflicts.map((conf, cIdx) => (
                  <div key={cIdx} className="space-y-3">
                    <p className="text-xs font-mono text-lavender">
                      Target Discrepancy: <span className="text-status-conflict-text font-bold">{conf.field}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Doc A */}
                      <div className="p-3 rounded-sm bg-midnight border border-status-conflict-border font-mono text-xs">
                        <span className="text-[9px] uppercase tracking-wider text-status-conflict-text block font-semibold">Document A</span>
                        <p className="text-lavender-highlight font-medium truncate mt-0.5 text-[11px]" title={conf.a.doc}>
                          {conf.a.doc}
                        </p>
                        <span className="text-[10px] text-lavender-muted">Page {conf.a.page}</span>
                        <p className="mt-2 text-sm font-bold text-status-conflict-text bg-status-conflict-bg p-1.5 rounded-sm text-center border border-status-conflict-border">
                          {conf.a.value}
                        </p>
                      </div>

                      {/* Doc B */}
                      <div className="p-3 rounded-sm bg-midnight border border-status-conflict-border font-mono text-xs">
                        <span className="text-[9px] uppercase tracking-wider text-status-conflict-text block font-semibold">Document B</span>
                        <p className="text-lavender-highlight font-medium truncate mt-0.5 text-[11px]" title={conf.b.doc}>
                          {conf.b.doc}
                        </p>
                        <span className="text-[10px] text-lavender-muted">Page {conf.b.page}</span>
                        <p className="mt-2 text-sm font-bold text-status-conflict-text bg-status-conflict-bg p-1.5 rounded-sm text-center border border-status-conflict-border">
                          {conf.b.value}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-lavender-muted p-2.5 rounded-sm bg-midnight border border-lavender-border leading-relaxed font-body">
                      {conf.explanation}
                    </p>
                  </div>
                ))}
              </Panel>
            )}

            {/* Rules Container */}
            <Panel className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-lavender-border">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-electric" />
                  <h3 className="font-display font-bold text-lavender-highlight text-sm">
                    Deterministic Rules
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lavender-muted uppercase tracking-wider">
                  {data.rule_results?.length || 0} Evaluated
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {data.rule_results?.map((rule) => (
                  <div
                    key={rule.rule_id}
                    className="p-3.5 rounded-sm bg-midnight border border-lavender-border hover:border-electric/40 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-lavender-highlight">
                          {rule.rule_id}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-lavender-faint text-lavender-muted border border-lavender-border">
                          {rule.rule_status} rule
                        </span>
                      </div>
                      <StatusBadge status={rule.result} size="xs" />
                    </div>

                    <p className="text-xs font-medium text-lavender-highlight mb-1.5">
                      {rule.description}
                    </p>

                    <p className="text-xs text-lavender-muted leading-relaxed mb-2 font-body">
                      {rule.explanation}
                    </p>

                    <div className="pt-2 border-t border-lavender-border flex items-start gap-1.5 text-[11px] font-mono text-lavender-muted">
                      <span className="text-lavender-highlight font-medium shrink-0">Action:</span>
                      <span className="text-lavender italic">{rule.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

          </div>

          {/* RIGHT: Source Document Inspector (3 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <SourceInspector />
          </div>

        </div>
      )}

    </div>
  );
}
