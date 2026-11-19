import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import GlassPanel from '../components/ui/GlassPanel';
import Medical3DVisual from '../components/Medical3DVisual';

export default function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />

      {/* Hero Section */}
      <div className="max-w-[1700px] w-full mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Asymmetric Typography & Pitch */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Top Tagline */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-electric-glow animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-electric-light font-bold">
              INTELLIGENCE FOR HEALTHCARE CLAIMS
            </span>
          </div>

          {/* Main Cinematic Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-white leading-none mb-6">
            CLAIM<br />
            <span className="text-electric-glow text-glow-blue">PILOT</span>
          </h1>

          {/* Subheading / Tagline */}
          <p className="text-base sm:text-lg md:text-xl font-heading font-semibold text-lavender-light tracking-wide uppercase mb-4">
            An evidence-linked platform for medical document processing, traceability and claim completeness verification.
          </p>

          {/* The Pitch Line */}
          <div className="p-4 rounded-xl bg-deepblack/70 border-l-4 border-electric border-y border-r border-electric/20 max-w-2xl mb-4 backdrop-blur-md">
            <p className="text-sm md:text-base font-medium text-white italic leading-relaxed">
              &ldquo;The agent drafts, code verifies, every field traces to its source, and the human approves.&rdquo;
            </p>
            <p className="text-xs font-mono text-lavender-dim mt-2 tracking-wide">
              Prototype: extraction is regex-based; the LLM agent is planned.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/claims/analysis')}
              icon={ArrowRight}
            >
              Analyze Sample Claim
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/documents/sources')}
              icon={ArrowUpRight}
            >
              Explore Evidence Store
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mt-12 pt-8 border-t border-lavender-dim/15 text-xs font-mono">
            <div>
              <span className="text-electric-glow font-bold block text-sm">100% CODE</span>
              <span className="text-lavender-dim text-[11px]">No LLM compliance decisions</span>
            </div>
            <div>
              <span className="text-electric-glow font-bold block text-sm">PROVEN SNIPPETS</span>
              <span className="text-lavender-dim text-[11px]">Verbatim document citations</span>
            </div>
            <div>
              <span className="text-electric-glow font-bold block text-sm">5 STATES</span>
              <span className="text-lavender-dim text-[11px]">Pass, Fail, Missing, Conflict...</span>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Holographic Medical Anatomy Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <Medical3DVisual />
        </div>

      </div>

      {/* Feature Architecture Cards Section */}
      <div className="max-w-[1700px] w-full mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <GlassPanel interactive onClick={() => navigate('/verification/rules')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-electric/20 border border-electric/40 flex items-center justify-center text-electric-light mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-2">
              Deterministic Rules Engine
            </h3>
            <p className="text-xs text-lavender-dim leading-relaxed">
              Compliance rules execute in pure Python. Missing documents (like admission notes) trigger explicit Missing states; missing information is never coerced to Pass.
            </p>
          </GlassPanel>

          <GlassPanel interactive onClick={() => navigate('/intelligence/contradictions')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-2">
              Cross-Document Contradiction
            </h3>
            <p className="text-xs text-lavender-dim leading-relaxed">
              Automated detection of conflicting dates and values between hospital discharge summaries and submitted claim forms, routing discrepancies to human auditors.
            </p>
          </GlassPanel>

          <GlassPanel interactive onClick={() => navigate('/documents/traceability')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-electric/20 border border-electric/40 flex items-center justify-center text-electric-light mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-2">
              Verbatim Snippet Provenance
            </h3>
            <p className="text-xs text-lavender-dim leading-relaxed">
              Every extracted field is bound to its source document, page number, and verified text snippet. Extracted fields without matching snippets are rejected.
            </p>
          </GlassPanel>

        </div>
      </div>

    </div>
  );
}
