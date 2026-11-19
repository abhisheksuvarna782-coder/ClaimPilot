import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Save, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import StatusBadge from '../components/ui/StatusBadge';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

export default function HumanReviewPage() {
  const navigate = useNavigate();
  const { data } = useClaim();

  const [conflictDecision, setConflictDecision] = useState('reconcile_hospital');
  const [missingDocDecision, setMissingDocDecision] = useState('request_admission_note');
  const [auditorNotes, setAuditorNotes] = useState('Discharge summary confirmed patient discharged on 08 March 2026 after laparoscopic appendectomy. Claim form billing for 09 March 2026 requires provider adjustment before clearing.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAudit = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="HUMAN OVERSIGHT CONSOLE"
        title="Human Review & Approval Gateway"
        description="Explicit medical auditor decision queue. Algorithms flag inconsistencies; human adjudicators make compliance determinations."
        action={
          <Button
            variant="primary"
            onClick={handleSaveAudit}
            icon={Save}
          >
            {savedSuccess ? 'Audit Recorded' : 'Save Adjudication'}
          </Button>
        }
      />

      {/* Protocol Banner */}
      <GlassPanel className="p-4 mb-8 border-electric/30 bg-deepblack/70">
        <div className="flex items-center gap-2 text-xs font-mono text-electric-light font-bold mb-1">
          <UserCheck className="w-4 h-4 text-electric-glow" />
          <span>STATUTORY ADJUDICATION PRINCIPLE</span>
        </div>
        <p className="text-xs font-mono text-lavender-dim leading-relaxed">
          ClaimPilot never submits claims automatically and never overrides human judgement. AI extracts and deterministically flags contradictions; human auditors hold sole clearance authority.
        </p>
      </GlassPanel>

      {savedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Audit decision recorded in local session state. Compliance package updated.</span>
        </div>
      )}

      {/* Discrepancy Reconciliation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Item 1: Cross-Document Discharge Date Conflict */}
        <GlassPanel className="p-6 border-purple-500/40 bg-deepblack/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-heading font-black text-purple-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                REVIEW ITEM 01: DATE CONTRADICTION
              </span>
              <StatusBadge status="Conflict" size="xs" />
            </div>

            <h4 className="text-sm font-bold text-white mb-2">
              Reconcile Inpatient Discharge Date
            </h4>

            <p className="text-xs font-mono text-lavender-dim mb-4 leading-relaxed">
              Discharge summary reports discharge on <strong className="text-white">08 March 2026</strong> (p.1), while claim form bills through <strong className="text-white">09 March 2026</strong> (p.1).
            </p>

            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-deepblack border border-white/5">
                <span className="text-[10px] text-lavender-dim block">Clinical Summary (p.1)</span>
                <span className="text-sm font-bold text-electric-glow">2026-03-08</span>
              </div>
              <div className="p-3 rounded-lg bg-deepblack border border-white/5">
                <span className="text-[10px] text-lavender-dim block">Claim Form (p.1)</span>
                <span className="text-sm font-bold text-purple-300">2026-03-09</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-electric-light uppercase tracking-wider block mb-2 font-bold">
              Auditor Determination:
            </span>
            <div className="space-y-2 font-mono text-xs">
              <label className="flex items-center gap-2 p-2 rounded bg-deepblack/60 border border-white/5 cursor-pointer hover:border-electric/40">
                <input
                  type="radio"
                  name="conflict"
                  checked={conflictDecision === 'reconcile_hospital'}
                  onChange={() => setConflictDecision('reconcile_hospital')}
                  className="text-electric"
                />
                <span className="text-white">Reconcile to 08 March 2026 (Clinical Summary Truth)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-deepblack/60 border border-white/5 cursor-pointer hover:border-electric/40">
                <input
                  type="radio"
                  name="conflict"
                  checked={conflictDecision === 'request_rectification'}
                  onChange={() => setConflictDecision('request_rectification')}
                  className="text-electric"
                />
                <span className="text-white">Request Provider Rectification & Clarification</span>
              </label>
            </div>
          </div>
        </GlassPanel>

        {/* Item 2: DOC-04 Missing Admission Note */}
        <GlassPanel className="p-6 border-amber-500/40 bg-deepblack/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                REVIEW ITEM 02: MANDATORY DOCUMENT GAP
              </span>
              <StatusBadge status="Missing" size="xs" />
            </div>

            <h4 className="text-sm font-bold text-white mb-2">
              Rule DOC-04: Admission Note Missing
            </h4>

            <p className="text-xs font-mono text-lavender-dim mb-4 leading-relaxed">
              Hospitalization documentation packet does not contain an Admission Note or ER intake record. Deterministic rules engine strictly marked this requirement as <strong className="text-amber-300">Missing</strong>.
            </p>

            <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-500/30 text-xs font-mono text-amber-200 mb-4">
              Recommended Policy Action: Upload the admission note and rerun validation before clearing for clearance.
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-electric-light uppercase tracking-wider block mb-2 font-bold">
              Auditor Determination:
            </span>
            <div className="space-y-2 font-mono text-xs">
              <label className="flex items-center gap-2 p-2 rounded bg-deepblack/60 border border-white/5 cursor-pointer hover:border-electric/40">
                <input
                  type="radio"
                  name="missingDoc"
                  checked={missingDocDecision === 'request_admission_note'}
                  onChange={() => setMissingDocDecision('request_admission_note')}
                  className="text-electric"
                />
                <span className="text-white">Block Clearance: Demand Admission Note from Hospital</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-deepblack/60 border border-white/5 cursor-pointer hover:border-electric/40">
                <input
                  type="radio"
                  name="missingDoc"
                  checked={missingDocDecision === 'emergency_waiver'}
                  onChange={() => setMissingDocDecision('emergency_waiver')}
                  className="text-electric"
                />
                <span className="text-white">Emergency Appendectomy Waiver (Requires Medical Director Sign-off)</span>
              </label>
            </div>
          </div>
        </GlassPanel>

      </div>

      {/* Reviewer Commentary & Sign-off Box */}
      <GlassPanel className="p-6 border-electric/30">
        <div className="flex items-center gap-2 mb-3 text-sm font-heading font-bold text-white">
          <MessageSquare className="w-4 h-4 text-electric-light" />
          <span>Medical Auditor Attestation & Notes</span>
        </div>

        <textarea
          rows={3}
          value={auditorNotes}
          onChange={(e) => setAuditorNotes(e.target.value)}
          className="w-full bg-deepblack rounded-xl p-3 border border-white/10 text-xs font-mono text-lavender focus:border-electric focus:outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5 text-xs font-mono text-lavender-dim">
          <span>Adjudicator ID: <strong className="text-white">MED-AUD-902</strong> &bull; Date: <strong className="text-white">19 November 2026</strong></span>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="secondary" onClick={() => navigate('/claims/analysis')}>
              Inspect Full Claim
            </Button>
            <Button size="sm" variant="primary" onClick={handleSaveAudit}>
              Confirm Audit Findings
            </Button>
          </div>
        </div>
      </GlassPanel>

    </div>
  );
}
