import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Source Documents Intake',
    type: 'LIVE',
    agent: 'Code Only',
    desc: 'PDF page-level text extraction preserving 1-based page indices with pdfplumber.'
  },
  {
    step: '02',
    title: 'Entity Extraction Engine',
    type: 'LIVE (Regex)',
    agent: 'Code Only (LLM Planned)',
    desc: 'Deterministic regex extractor capturing patient_id, dates, diagnosis, ICD-10, procedure, claim amount. LLM agent is planned.'
  },
  {
    step: '03',
    title: 'Verbatim Snippet Verification',
    type: 'LIVE',
    agent: 'Code Only',
    desc: 'Strict rejection gate: any entity whose exact text snippet is not present in that page stream is discarded.'
  },
  {
    step: '04',
    title: 'Deterministic Rules Engine',
    type: 'LIVE (Simulated)',
    agent: 'Code Only (No LLM)',
    desc: 'Pure Python evaluation of DOC-04, DATE-01, XDOC-01, ICD-01 across Pass, Fail, Missing, Conflict, Unable to verify.'
  },
  {
    step: '05',
    title: 'Contradiction & Explanation Layer',
    type: 'LIVE',
    agent: 'Code Only',
    desc: 'Automated synthesis of cross-document discrepancies and actionable remediation directives.'
  },
  {
    step: '06',
    title: 'Human Review & Approval Gate',
    type: 'PLANNED',
    agent: 'Human In The Loop',
    desc: 'Staff verification interface for reconciling disputed dates and approving ready claim packets.'
  }
];

export default function AIIntelligencePage() {
  const navigate = useNavigate();
  const { data } = useClaim();

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="INTELLIGENCE ARCHITECTURE"
        title="Extraction Method & AI Pipeline"
        description="Transparent breakdown of ClaimPilot's hybrid architecture: deterministic Python verification paired with future generative drafting."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
            icon={ArrowRight}
          >
            Run Active Pipeline
          </Button>
        }
      />

      {/* Prototype Honest Architecture Banner */}
      <GlassPanel className="p-5 mb-8 border-electric/30 bg-deepblack/70">
        <div className="flex items-center gap-2 text-xs font-mono text-electric-light font-bold mb-1.5">
          <Workflow className="w-4 h-4 text-electric-glow" />
          <span>CURRENT EXTRACTION MODALITY: REGEX ENGINE</span>
        </div>
        <p className="text-xs font-mono text-lavender-dim leading-relaxed">
          In this prototype, extraction is carried out by a dedicated deterministic regex module (<code className="text-white">backend/extractor.py</code>) built to enforce strict verbatim snippet provenance. An LLM-assisted extraction pathway with automated bounded retries is architecturally designed for Phase 4.
        </p>
      </GlassPanel>

      {/* 6-Stage Pipeline Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {PIPELINE_STAGES.map((st, idx) => (
          <GlassPanel key={idx} className="p-5 flex flex-col justify-between border-electric/25">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-black text-electric-glow">
                  STAGE {st.step}
                </span>
                <PlannedBadge type={st.type.includes('PLANNED') ? 'PLANNED' : st.type.includes('Simulated') ? 'SIMULATED' : 'LIVE'} />
              </div>

              <h3 className="font-heading font-bold text-white text-sm mb-1">
                {st.title}
              </h3>

              <span className="text-[10px] font-mono uppercase tracking-wider text-lavender-dim block mb-3">
                Actor: <strong className="text-electric-light">{st.agent}</strong>
              </span>

              <p className="text-xs font-mono text-lavender-dim leading-relaxed">
                {st.desc}
              </p>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Contradiction Detection Spotlight */}
      <SectionHeading
        tag="SIGNAL RECONCILIATION"
        title="Contradiction Detection Engine"
        description="Automated cross-document integrity checks isolate conflicting dates and amounts across disparate records."
      />

      {data?.conflicts && data.conflicts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.conflicts.map((conf, idx) => (
            <GlassPanel key={idx} className="p-6 border-purple-500/40 bg-deepblack/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  <span className="font-heading font-bold text-white text-sm">
                    Discrepancy: {conf.field}
                  </span>
                </div>
                <PlannedBadge type="LIVE" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 font-mono text-xs">
                  <span className="text-[10px] uppercase text-purple-300 font-bold block mb-1">Doc 1 Citation</span>
                  <p className="text-white truncate font-medium">{conf.a.doc} (p.{conf.a.page})</p>
                  <p className="text-base font-bold text-purple-200 mt-2 bg-deepblack p-1.5 rounded text-center border border-purple-500/30">
                    {conf.a.value}
                  </p>
                </div>

                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 font-mono text-xs">
                  <span className="text-[10px] uppercase text-purple-300 font-bold block mb-1">Doc 2 Citation</span>
                  <p className="text-white truncate font-medium">{conf.b.doc} (p.{conf.b.page})</p>
                  <p className="text-base font-bold text-purple-200 mt-2 bg-deepblack p-1.5 rounded text-center border border-purple-500/30">
                    {conf.b.value}
                  </p>
                </div>
              </div>

              <p className="text-xs font-mono text-lavender-dim p-3 rounded-lg bg-deepblack/60 border border-white/5">
                {conf.explanation}
              </p>
            </GlassPanel>
          ))}
        </div>
      ) : (
        <GlassPanel className="p-8 text-center text-lavender-dim text-xs font-mono">
          No cross-document contradictions detected.
        </GlassPanel>
      )}

    </div>
  );
}
