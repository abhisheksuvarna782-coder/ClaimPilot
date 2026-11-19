import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import Button from './ui/Button';

const API_BASE = 'http://127.0.0.1:8000';

const STEPS = [
  { progress: 20, message: 'INITIALIZING MEDICAL INTELLIGENCE...' },
  { progress: 50, message: 'CONNECTING SYSTEM MODULES...' },
  { progress: 80, message: 'PREPARING CLAIM ANALYSIS...' },
  { progress: 100, message: 'CLAIMPILOT READY.' },
];

export default function CinematicIntro({ onComplete, onPrefetchedData }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let isMounted = true;

    async function initializeSystem() {
      try {
        // Step 1: Initializing
        if (!isMounted) return;
        setProgress(25);
        setCurrentStepIndex(0);
        await new Promise(r => setTimeout(r, 600));

        // Step 2: Health Check
        if (!isMounted) return;
        setCurrentStepIndex(1);
        setProgress(50);
        const healthRes = await fetch(`${API_BASE}/`, { method: 'GET' }).catch(() => null);
        if (!healthRes || !healthRes.ok) {
          throw new Error('Backend offline. Please start FastAPI on http://127.0.0.1:8000');
        }
        await new Promise(r => setTimeout(r, 600));

        // Step 3: Prefetch Analysis
        if (!isMounted) return;
        setCurrentStepIndex(2);
        setProgress(85);
        const analyzeRes = await fetch(`${API_BASE}/analyze`, { method: 'POST' });
        if (!analyzeRes.ok) throw new Error('Analysis prefetch failed');
        const analyzeData = await analyzeRes.json();
        if (onPrefetchedData) onPrefetchedData(analyzeData);
        await new Promise(r => setTimeout(r, 600));

        // Step 4: Ready
        if (!isMounted) return;
        setCurrentStepIndex(3);
        setProgress(100);
        setIsReady(true);

        // Auto advance after brief hold
        setTimeout(() => {
          if (isMounted) handleFinish();
        }, 800);

      } catch (err) {
        if (isMounted) {
          setError(err.message || 'System initialization failure');
        }
      }
    }

    initializeSystem();

    return () => {
      isMounted = false;
    };
  }, []);

  // Background animated particle / holographic canvas
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Particle nodes for subtle medical constellation
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      ctx.strokeStyle = 'rgba(0, 123, 167, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(0, 194, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  const handleFinish = () => {
    sessionStorage.setItem('claimpilot_intro_shown', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-midnight flex flex-col justify-between p-8 md:p-14 overflow-hidden select-none">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />

      {/* Ambient background glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top bar with Skip option */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-electric-glow animate-ping" />
          <span className="text-xs font-mono tracking-[0.25em] text-lavender-dim uppercase">
            System Initialization v0.1
          </span>
        </div>

        <button
          onClick={handleFinish}
          className="text-xs font-mono tracking-widest text-lavender-dim hover:text-white uppercase transition-colors px-3 py-1.5 rounded-lg border border-lavender-dim/20 hover:border-electric/50"
        >
          Skip Intro &rarr;
        </button>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-electric/40 bg-deepblack/60 backdrop-blur-md mb-6 shadow-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-electric-light animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.2em] text-lavender-light uppercase">
            Medical Intelligence Reimagined
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-white mb-4">
          CLAIM<span className="text-electric-glow text-glow-blue">PILOT</span>
        </h1>

        <p className="text-sm md:text-base font-mono tracking-[0.3em] text-lavender-dim uppercase max-w-xl">
          Where Artificial Intelligence Meets Healthcare
        </p>

        {/* Cinematic Animated Equalizer Waves */}
        <div className="flex items-center justify-center gap-1.5 h-16 my-8">
          {[40, 75, 95, 60, 85, 45, 90, 70, 50, 80, 100, 65, 85, 40, 75].map((defaultHeight, idx) => (
            <div
              key={idx}
              className="w-1.5 rounded-full bg-gradient-to-t from-electric-dark via-electric to-electric-glow shadow-glow-sm"
              style={{
                height: `${defaultHeight}%`,
                animation: prefersReducedMotion ? 'none' : `equalize 1.${(idx % 5) + 1}s ease-in-out infinite alternate`,
                animationDelay: `${idx * 0.08}s`,
              }}
            />
          ))}
        </div>

        {/* Loading Message & Progress */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between text-xs font-mono text-lavender-dim mb-2">
            <span className="tracking-widest">
              {error ? 'INITIALIZATION HALTED' : STEPS[currentStepIndex]?.message}
            </span>
            <span className="text-electric-light font-bold">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-deepblack rounded-full overflow-hidden border border-electric/20 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-electric via-electric-light to-electric-glow rounded-full transition-all duration-500 shadow-glow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Error display if backend down */}
          {error && (
            <div className="mt-4 p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 text-xs text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider">Backend Unavailable</p>
                <p className="text-[11px] text-rose-200 mt-0.5">{error}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
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
      </div>

      {/* Footer info */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-lavender-dim/60 pt-4 border-t border-lavender-dim/10">
        <span>EVIDENCE-BASED PRE-SUBMISSION VERIFICATION</span>
        <span className="mt-2 md:mt-0">SYNTHETIC DEMONSTRATION RECORD SYN-0001</span>
      </div>
    </div>
  );
}

