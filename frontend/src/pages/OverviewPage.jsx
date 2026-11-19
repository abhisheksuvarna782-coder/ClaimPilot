import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Medical3DVisual from '../components/Medical3DVisual';

export default function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center overflow-hidden font-body">
      
      {/* Cinematic Hero Container */}
      <div className="max-w-[1700px] w-full mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Asymmetric Typography & Pitch (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-lavender-muted font-medium">
              Evidence-Linked Claim Verification
            </span>
          </div>

          {/* Main Display Title: Space Grotesk Two-Tone (#007BA7 + #E4DFEE) */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight leading-none mb-6">
            <span className="text-electric">CLAIM</span>
            <span className="text-lavender-highlight block sm:inline sm:ml-4">PILOT</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base font-display font-medium text-lavender uppercase tracking-[0.15em] mb-6 max-w-xl">
            Where Evidence Meets <span className="text-lavender-highlight">Intelligence</span>
          </p>

          {/* The Pitch Line & Prototype Honesty */}
          <div className="p-5 rounded-sm bg-midnight border border-lavender-border max-w-2xl mb-8 space-y-2">
            <p className="text-sm md:text-base text-lavender-highlight leading-relaxed font-body">
              &ldquo;The agent drafts, code verifies, every field traces to its source, and the human approves.&rdquo;
            </p>
            <p className="text-xs font-mono text-lavender-muted pt-1 border-t border-lavender-border">
              Prototype Note: Field extraction in this demo runs on deterministic regex patterns tuned to synthetic documents; LLM agent extraction is a planned future capability.
            </p>
          </div>

          {/* Human Next Circular Hairline CTA */}
          <div className="flex flex-wrap items-center gap-6">
            <Button
              variant="cta"
              onClick={() => navigate('/claims/analysis')}
            >
              Execute Claim Verification
            </Button>
          </div>
        </div>

        {/* Right Column: 3D Visual Stage (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[480px]">
          <Medical3DVisual />
        </div>

      </div>

    </div>
  );
}
