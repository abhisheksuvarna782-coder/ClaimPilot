import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { data } = useClaim();

  // Compute stats strictly from /analyze data
  const fields = data?.fields || [];
  const rules = data?.rule_results || [];

  const totalFields = fields.length;
  const docCounts = fields.reduce((acc, f) => {
    acc[f.source_doc] = (acc[f.source_doc] || 0) + 1;
    return acc;
  }, {});

  const ruleCounts = rules.reduce((acc, r) => {
    acc[r.result] = (acc[r.result] || 0) + 1;
    return acc;
  }, {});

  const confidenceCounts = fields.reduce((acc, f) => {
    acc[f.confidence] = (acc[f.confidence] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="LIVE SYSTEM TELEMETRY"
        title="Claim Statistics & Evaluation Metrics"
        description="Computed strictly from active /analyze response data. No fabricated metrics or historical analytics."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
            icon={ArrowRight}
          >
            Inspect Source Data
          </Button>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <GlassPanel className="p-5 border-electric/30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-dim block mb-1">
            Total Fields Extracted
          </span>
          <span className="text-3xl md:text-4xl font-heading font-black text-white">
            {totalFields}
          </span>
          <span className="text-[11px] font-mono text-electric-light block mt-1">
            Across 2 synthetic PDFs
          </span>
        </GlassPanel>

        <GlassPanel className="p-5 border-electric/30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-dim block mb-1">
            Rules Evaluated
          </span>
          <span className="text-3xl md:text-4xl font-heading font-black text-white">
            {rules.length}
          </span>
          <span className="text-[11px] font-mono text-amber-300 block mt-1">
            All marked simulated
          </span>
        </GlassPanel>

        <GlassPanel className="p-5 border-electric/30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-dim block mb-1">
            High Confidence Fields
          </span>
          <span className="text-3xl md:text-4xl font-heading font-black text-emerald-300">
            {confidenceCounts['high'] || 0}
          </span>
          <span className="text-[11px] font-mono text-lavender-dim block mt-1">
            All applicable signals passed
          </span>
        </GlassPanel>

        <GlassPanel className="p-5 border-electric/30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-dim block mb-1">
            Active Conflicts
          </span>
          <span className="text-3xl md:text-4xl font-heading font-black text-purple-300">
            {data?.conflicts?.length || 0}
          </span>
          <span className="text-[11px] font-mono text-purple-400 block mt-1">
            Discharge date mismatch
          </span>
        </GlassPanel>
      </div>

      {/* Distribution Charts (Pure CSS / Tailored Dark Visuals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1: Fields per Document */}
        <GlassPanel className="p-5 border-electric/25">
          <h3 className="font-heading font-bold text-white text-sm mb-4">
            Fields Extracted per Document
          </h3>
          <div className="space-y-4 font-mono text-xs">
            {Object.entries(docCounts).map(([doc, cnt], i) => (
              <div key={i}>
                <div className="flex justify-between text-lavender mb-1">
                  <span className="truncate max-w-[180px]" title={doc}>{doc}</span>
                  <span className="text-white font-bold">{cnt} fields</span>
                </div>
                <div className="w-full h-2 bg-deepblack rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-electric rounded-full"
                    style={{ width: `${(cnt / totalFields) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Card 2: Rule Results by State */}
        <GlassPanel className="p-5 border-electric/25">
          <h3 className="font-heading font-bold text-white text-sm mb-4">
            Rule Outcomes Breakdown
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {['Pass', 'Missing', 'Conflict', 'Fail', 'Unable to verify'].map((state, i) => {
              const count = ruleCounts[state] || 0;
              return (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-deepblack/60 border border-white/5">
                  <span className="text-lavender">{state}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    state === 'Pass' ? 'text-emerald-300 bg-emerald-950/40' :
                    state === 'Missing' ? 'text-amber-300 bg-amber-950/40' :
                    state === 'Conflict' ? 'text-purple-300 bg-purple-950/40' :
                    'text-lavender-dim bg-slate-900/40'
                  }`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Card 3: Confidence Distribution */}
        <GlassPanel className="p-5 border-electric/25">
          <h3 className="font-heading font-bold text-white text-sm mb-4">
            Extraction Quality Tiers
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {[
              { tier: 'high', label: 'High Confidence', count: confidenceCounts['high'] || 0, color: 'text-emerald-300 bg-emerald-500' },
              { tier: 'medium', label: 'Medium Confidence', count: confidenceCounts['medium'] || 0, color: 'text-amber-300 bg-amber-500' },
              { tier: 'low', label: 'Low Confidence', count: confidenceCounts['low'] || 0, color: 'text-rose-300 bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded bg-deepblack/60 border border-white/5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-lavender">{item.label}</span>
                  <span className="text-white font-bold">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-deepblack rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color.split(' ')[1]}`}
                    style={{ width: `${totalFields ? (item.count / totalFields) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

      </div>

      {/* Planned Telemetry Cards */}
      <SectionHeading
        tag="FUTURE OBSERVABILITY"
        title="Planned Enterprise Analytics"
        description="The following monitoring dashboards are specified for multi-claim production deployment."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="p-5 border-dashed border-electric/20 bg-deepblack/40">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-bold text-lavender text-xs">Processing Performance</span>
            <PlannedBadge type="PLANNED" />
          </div>
          <p className="text-xs font-mono text-lavender-dim leading-relaxed">
            P95 extraction latency, GPU inference benchmarks, and OCR throughput tracking.
          </p>
        </GlassPanel>

        <GlassPanel className="p-5 border-dashed border-electric/20 bg-deepblack/40">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-bold text-lavender text-xs">Verification Reports</span>
            <PlannedBadge type="PLANNED" />
          </div>
          <p className="text-xs font-mono text-lavender-dim leading-relaxed">
            Batch exportable PDF and FHIR compliance certificates for insurer integration.
          </p>
        </GlassPanel>

        <GlassPanel className="p-5 border-dashed border-electric/20 bg-deepblack/40">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-bold text-lavender text-xs">System Insights</span>
            <PlannedBadge type="PLANNED" />
          </div>
          <p className="text-xs font-mono text-lavender-dim leading-relaxed">
            Longitudinal hospital documentation trend analysis and insurer dispute minimization.
          </p>
        </GlassPanel>
      </div>

    </div>
  );
}
