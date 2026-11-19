import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

export default function UploadDocumentsPage() {
  const navigate = useNavigate();
  const { fetchAnalysis } = useClaim();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeFile, setActiveFile] = useState('discharge_summary.pdf');

  const startSimulatedScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          fetchAnalysis();
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="INTAKE & NORMALIZATION"
        title="Document Intake & Holographic Scanner"
        description="Ingest inpatient discharge summaries, surgical notes, and billing forms into the deterministic extraction pipeline."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
            icon={ArrowRight}
          >
            Go to Claim Console
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Drag & Drop Scanner Zone (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <GlassPanel className="p-8 border-electric/40 flex-1 flex flex-col items-center justify-center relative overflow-hidden text-center min-h-[400px]">
            
            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric-glow to-transparent shadow-[0_0_20px_#00C2FF] animate-bounce z-20"
                style={{ animationDuration: '1.2s' }}
              />
            )}

            <div className="w-16 h-16 rounded-2xl bg-deepblack border border-electric/40 flex items-center justify-center text-electric-light mb-4 shadow-glow-sm">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-bold text-white text-lg mb-2">
              Drop Claim Documents Here
            </h3>

            <p className="text-xs font-mono text-lavender-dim max-w-md mb-6 leading-relaxed">
              Supports searchable PDF packages, clinical summaries, and claim submission forms. In this prototype, demo PDFs are bundled locally.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={startSimulatedScan}
                disabled={isScanning}
                icon={isScanning ? RefreshCw : Sparkles}
              >
                {isScanning ? `Scanning & Extracting (${scanProgress}%)...` : 'Simulate Ingestion & Rescan'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/documents/sources')}
                icon={FileText}
              >
                Browse Bundled PDFs
              </Button>
            </div>

            {/* Ingestion Steps */}
            <div className="w-full max-w-lg mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-2 text-[10px] font-mono text-lavender-dim">
              <div className="p-2 rounded bg-deepblack/60 border border-white/5">
                <span className="text-electric-glow block font-bold">1. STREAM</span>
                <span>Selectable text per page</span>
              </div>
              <div className="p-2 rounded bg-deepblack/60 border border-white/5">
                <span className="text-electric-glow block font-bold">2. EXTRACT</span>
                <span>Regex field citations</span>
              </div>
              <div className="p-2 rounded bg-deepblack/60 border border-white/5">
                <span className="text-electric-glow block font-bold">3. VERIFY</span>
                <span>Snippet presence test</span>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right: Intake Queue Status (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-electric-light font-bold">
            Ingested Synthetic Documents
          </span>

          <GlassPanel className="p-4 border-electric/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-electric-light" />
                <span className="font-mono text-xs font-bold text-white">discharge_summary.pdf</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                PROCESSED
              </span>
            </div>
            <p className="text-[11px] font-mono text-lavender-dim">
              2 pages &bull; 6 extracted entities &bull; Snippets 100% verified
            </p>
          </GlassPanel>

          <GlassPanel className="p-4 border-electric/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-300" />
                <span className="font-mono text-xs font-bold text-white">claim_form.pdf</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30">
                CONFLICT DETECTED
              </span>
            </div>
            <p className="text-[11px] font-mono text-lavender-dim">
              1 page &bull; 6 extracted entities &bull; Discharge date mismatch flagged
            </p>
          </GlassPanel>

          <GlassPanel className="p-4 border-dashed border-amber-500/30 bg-deepblack/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <span className="font-mono text-xs font-bold text-amber-200">admission_note.pdf</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                MISSING
              </span>
            </div>
            <p className="text-[11px] font-mono text-lavender-dim">
              Required by rule DOC-04. Upload required before claim submission.
            </p>
          </GlassPanel>
        </div>

      </div>

    </div>
  );
}
