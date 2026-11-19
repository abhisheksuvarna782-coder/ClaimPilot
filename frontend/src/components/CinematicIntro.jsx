import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function CinematicIntro({ onComplete, onPrefetchedData }) {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('CONNECTING TO CLAIM ENGINE...');
  const [error, setError] = useState(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const handleFinish = () => {
    sessionStorage.setItem('claimpilot_intro_shown', 'true');
    onComplete();
  };

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeEngine() {
      try {
        // Stage 1: Health Check (GET /)
        if (!isMounted) return;
        setProgress(30);
        setStatusMessage('PINGING HEALTH ENDPOINT (GET /)...');
        
        const healthRes = await fetch(`${API_BASE}/`).catch(() => null);
        if (!healthRes || !healthRes.ok) {
          throw new Error(`Backend offline. Ensure FastAPI is running on ${API_BASE}`);
        }
        
        if (!prefersReducedMotion) {
          await new Promise(r => setTimeout(r, 450));
        }

        // Stage 2: Evidence Extraction & Rule Verification (POST /analyze)
        if (!isMounted) return;
        setProgress(70);
        setStatusMessage('EXTRACTING EVIDENCE & EVALUATING RULES (POST /analyze)...');

        const analyzeRes = await fetch(`${API_BASE}/analyze`, { method: 'POST' });
        if (!analyzeRes.ok) {
          throw new Error(`Engine analysis error: HTTP ${analyzeRes.status}`);
        }
        const analyzeData = await analyzeRes.json();
        
        if (onPrefetchedData) {
          onPrefetchedData(analyzeData);
        }

        if (!prefersReducedMotion) {
          await new Promise(r => setTimeout(r, 450));
        }

        // Stage 3: Verification Complete
        if (!isMounted) return;
        setProgress(100);
        setStatusMessage('EVIDENCE LINKED • 4 RULES EVALUATED • READY');

        setTimeout(() => {
          if (isMounted) handleFinish();
        }, prefersReducedMotion ? 100 : 500);

      } catch (err) {
        if (isMounted) {
          setError(err.message || 'System initialization failure');
        }
      }
    }

    initializeEngine();

    return () => {
      isMounted = false;
    };
  }, []);

  // Equalizer heights respond directly to real request progress
  const getEqualizerHeights = () => {
    if (progress >= 100) return [100, 100, 100, 100, 100];
    if (progress >= 70) return [75, 90, 60, 85, 70];
    if (progress >= 30) return [40, 55, 35, 60, 45];
    return [15, 25, 20, 30, 20];
  };

  const heights = getEqualizerHeights();

  return (
    <div className="fixed inset-0 z-[100] bg-midnight flex flex-col justify-between p-8 md:p-14 overflow-hidden select-none font-body">
      
      {/* Top Bar: System Mode + Skip Button */}
      <header className="flex items-center justify-between border-b border-lavender-border pb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-electric" />
          <span className="text-[11px] font-mono tracking-[0.2em] text-lavender-muted uppercase">
            Claim Engine Hydration
          </span>
        </div>

        <button
          onClick={handleFinish}
          className="text-[11px] font-mono tracking-wider text-lavender-muted hover:text-lavender-highlight uppercase transition-colors px-3 py-1.5 rounded-sm border border-lavender-border hover:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
        >
          Skip Intro [Esc] &rarr;
        </button>
      </header>

      {/* Center Cinematic Composition */}
      <main className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center my-auto w-full">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-electric" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-lavender-muted uppercase">
            Evidence-Linked Claim Verification
          </span>
        </div>

        {/* Display Title: Space Grotesk Two-Tone (#007BA7 + #E4DFEE) */}
        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-4">
          <span className="text-electric">CLAIM</span>
          <span className="text-lavender-highlight ml-3">PILOT</span>
        </h1>

        {/* Pitch Line */}
        <p className="text-xs md:text-sm font-body text-lavender-muted max-w-xl leading-relaxed">
          The agent drafts, code verifies, every field traces to its source, and the human approves.
        </p>

        {/* Real Progress-Driven Equalizer Bars with Smooth Easing (No Overshoot) */}
        <div className="flex items-end justify-center gap-2.5 h-16 my-10" aria-label="Engine Activity Equalizer">
          {heights.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-electric rounded-none"
              style={{
                height: `${h}%`,
                transition: `height 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 35}ms`,
              }}
            />
          ))}
        </div>

        {/* Status Line & Progress Indicator */}
        <div className="w-full max-w-md space-y-2.5 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-lavender-muted tracking-wider">
              {error ? 'INITIALIZATION HALTED' : statusMessage}
            </span>
            <span className="text-lavender-highlight font-semibold">{progress}%</span>
          </div>

          {/* Hairline 2px Progress Bar */}
          <div className="w-full h-1 bg-deepblack border border-lavender-border overflow-hidden">
            <div
              className="h-full bg-electric transition-all duration-300 ease-studio"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mt-4 p-3 bg-status-fail-bg border border-status-fail-border rounded-sm text-status-fail-text text-xs text-left flex items-start gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-status-fail-text mt-0.5" />
              <div>
                <p className="font-semibold uppercase tracking-wider">Backend Unavailable</p>
                <p className="text-[11px] text-lavender-muted mt-0.5 font-body">{error}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                    Retry Connection
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleFinish}>
                    Continue Anyway
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Line */}
      <footer className="flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-lavender-muted/70 pt-6 border-t border-lavender-border">
        <span>PRE-SUBMISSION CLINICAL ADJUDICATION INTEGRITY</span>
        <span className="mt-2 md:mt-0">SYNTHETIC DEMONSTRATION DATA SYN-0001</span>
      </footer>

    </div>
  );
}
