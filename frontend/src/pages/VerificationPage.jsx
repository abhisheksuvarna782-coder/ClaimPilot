import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ShieldAlert,
  ArrowRight,
  Database,
  FileCheck2
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import StatusBadge from '../components/ui/StatusBadge';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { data } = useClaim();

  const passedRules = data?.rule_results?.filter(r => r.result === 'Pass') || [];
  const actionRules = data?.rule_results?.filter(r => r.result !== 'Pass') || [];

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="DETERMINISTIC COMPLIANCE"
        title="Rule Validation & ICD-10 Registry"
        description="Comprehensive audit of deterministic rule evaluations. All rules default to simulated status until official human verification."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
            icon={ArrowRight}
          >
            Review Claim
          </Button>
        }
      />

      {/* Verification Rule Notice */}
      <GlassPanel className="p-4 mb-8 border-electric/30 bg-deepblack/60">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>SIMULATED RULES PROTOCOL</span>
        </div>
        <p className="text-xs font-mono text-lavender-dim leading-relaxed">
          In accordance with project rules, all four validation rules currently carry <strong className="text-amber-300">rule_status = &ldquo;simulated&rdquo;</strong>. No official insurer clauses or policy sections are invented. Missing documentation (such as an admission note) strictly returns <strong className="text-amber-300">Missing</strong> and is never converted to a Pass.
        </p>
      </GlassPanel>

      {/* Rules Breakdown */}
      <div className="space-y-6 mb-12">
        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Active Evaluation Rules (4)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.rule_results?.map((r, idx) => (
            <GlassPanel key={idx} className="p-6 border-electric/25 bg-deepblack/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-white">
                      {r.rule_id}
                    </span>
                    <PlannedBadge type="SIMULATED" />
                  </div>
                  <StatusBadge status={r.result} />
                </div>

                <h4 className="text-sm font-bold text-white mb-2">
                  {r.description}
                </h4>

                <p className="text-xs font-sans text-lavender-dim leading-relaxed mb-4">
                  {r.explanation}
                </p>
              </div>

              <div className="p-3 bg-deepblack/90 rounded-xl border border-white/5 font-mono text-xs">
                <span className="text-[10px] uppercase text-electric-light font-bold block mb-1">
                  Required Action:
                </span>
                <span className="text-lavender-light italic">
                  {r.action}
                </span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Sample ICD-10 Reference Catalog Info */}
      <SectionHeading
        tag="REFERENCE CATALOG"
        title="Sample ICD-10 Catalog Verification"
        description="Rule ICD-01 validates diagnosis codes against datasets/icd10_sample.csv (~20 sample prototype codes)."
      />

      <GlassPanel className="p-6 border-electric/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono font-bold text-white block">
              Extracted Code: <span className="text-electric-glow font-bold">K35.80</span>
            </span>
            <span className="text-xs font-mono text-lavender-dim">
              Description: Unspecified acute appendicitis &bull; Category: Diseases of the digestive system
            </span>
          </div>
          <StatusBadge status="Pass" />
        </div>

        <div className="p-4 bg-deepblack/60 rounded-xl border border-white/5 text-xs font-mono text-lavender-dim">
          <p>
            &bull; Catalog File: <code className="text-white">datasets/icd10_sample.csv</code> (contains 20 reference rows)<br />
            &bull; Verification Status: Matched verbatim in reference catalog. Prototype uses a small sample, not full ICD-10 registry.
          </p>
        </div>
      </GlassPanel>

    </div>
  );
}

