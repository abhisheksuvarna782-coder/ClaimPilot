import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import StatusBadge from '../components/ui/StatusBadge';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

const CLAUSES = [
  {
    clauseId: 'SEC-4.1',
    title: 'Chronological Inpatient Continuity',
    ruleId: 'DATE-01',
    mandate: 'Discharge date must be on or strictly after the certified admission date across all inpatient records.',
    status: 'Pass',
    detail: 'Validated across discharge summary (2026-03-05 to 2026-03-08) and claim form (2026-03-05 to 2026-03-09).'
  },
  {
    clauseId: 'SEC-5.2',
    title: 'Admission Intake Record Prerequisite',
    ruleId: 'DOC-04',
    mandate: 'An emergency admission note or pre-planned admission order must accompany inpatient surgical claims.',
    status: 'Missing',
    detail: 'No admission note found in packet. Rule returned Missing. Missing items cannot be overridden to Pass.'
  },
  {
    clauseId: 'SEC-7.3',
    title: 'Cross-Document Date Reconciliation',
    ruleId: 'XDOC-01',
    mandate: 'Admission and discharge dates in billing submission must exactly match certified clinical discharge summaries.',
    status: 'Conflict',
    detail: 'Conflict: clinical discharge is 08 March 2026; claim form reports 09 March 2026. Staff reconciliation required.'
  },
  {
    clauseId: 'SEC-9.0',
    title: 'Approved Clinical Coding Registry',
    ruleId: 'ICD-01',
    mandate: 'Primary and secondary diagnoses must match valid classifications in the reference catalog.',
    status: 'Pass',
    detail: 'Extracted code K35.80 (Unspecified acute appendicitis) verified against datasets/icd10_sample.csv.'
  }
];

export default function PolicyCompliancePage() {
  const navigate = useNavigate();
  const { data } = useClaim();

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="POLICY CLAUSE MAPPING"
        title="Insurer Policy Compliance Audit"
        description="Cross-referencing deterministic rule outcomes with simulated insurer adjudication guidelines."
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

      <GlassPanel className="p-4 mb-8 border-electric/30 bg-deepblack/60">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>PROTOTYPE RULE STATUS: SIMULATED</span>
        </div>
        <p className="text-xs font-mono text-lavender-dim leading-relaxed">
          Rule policies below demonstrate pre-submission verification logic. In production, these will bind to official-verified insurer contract clauses. Currently all rules have <code className="text-white">rule_status = &ldquo;simulated&rdquo;</code>.
        </p>
      </GlassPanel>

      <div className="space-y-4">
        {CLAUSES.map((cl, idx) => (
          <GlassPanel key={idx} className="p-5 border-electric/25 bg-deepblack/70">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-heading font-black text-electric-glow px-2.5 py-1 rounded bg-electric/15 border border-electric/30">
                  {cl.clauseId}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {cl.title}
                  </h4>
                  <span className="text-[10px] font-mono text-lavender-dim">
                    Linked Deterministic Rule: <strong className="text-electric-light">{cl.ruleId}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PlannedBadge type="SIMULATED" />
                <StatusBadge status={cl.status} />
              </div>
            </div>

            <p className="text-xs font-mono text-lavender mb-2">
              <strong className="text-white">Mandate:</strong> {cl.mandate}
            </p>

            <p className="text-xs font-mono text-lavender-dim leading-relaxed bg-deepblack/80 p-2.5 rounded-lg border border-white/5">
              <strong className="text-electric-light">Audit Finding:</strong> {cl.detail}
            </p>
          </GlassPanel>
        ))}
      </div>

    </div>
  );
}
