import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Layers, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  RefreshCw,
  Search
} from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PlannedBadge from '../components/ui/PlannedBadge';
import { useClaim } from '../context/ClaimContext';

const API_BASE = 'http://127.0.0.1:8000';

const SYNTHETIC_DOCS = [
  {
    name: 'discharge_summary.pdf',
    title: 'Hospital Discharge Summary',
    totalPages: 2,
    issuer: 'Apex Memorial Healthcare (Fictional)',
    patient: 'Ravi Kumar (SYN-0001)',
    admission: '05 March 2026',
    discharge: '08 March 2026',
    diagnosis: 'Acute appendicitis (ICD-10: K35.80)',
    procedure: 'Laparoscopic appendectomy',
  },
  {
    name: 'claim_form.pdf',
    title: 'Health Insurance Claim Submission Form',
    totalPages: 1,
    issuer: 'Insured Policyholder Submission',
    patient: 'Ravi Kumar (SYN-0001)',
    admission: '05 March 2026',
    discharge: '09 March 2026 (Deliberate conflict)',
    claimAmount: 'INR 35,000',
  }
];

export default function SourceDocumentsPage() {
  const navigate = useNavigate();
  const { data } = useClaim();
  const [activeDoc, setActiveDoc] = useState(SYNTHETIC_DOCS[0]);
  const [activePage, setActivePage] = useState(1);
  const [pageText, setPageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPageText = async (docName, pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(docName)}/pages/${pageNum}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setPageText(json.text || '');
    } catch (err) {
      setError(err.message || 'Could not fetch page text');
      setPageText('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageText(activeDoc.name, activePage);
  }, [activeDoc, activePage]);

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      
      <SectionHeading
        tag="EVIDENCE REPOSITORY"
        title="Source Documents"
        description="Inspect the bundled synthetic PDF documents and verify selectable plain text streams."
        action={
          <Button
            variant="secondary"
            onClick={() => navigate('/documents/traceability')}
            icon={ArrowRight}
          >
            View Traceability Matrix
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Documents Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-electric-light font-bold">
            Bundled Demonstration Documents (2)
          </span>

          {SYNTHETIC_DOCS.map((doc, idx) => {
            const isSelected = activeDoc.name === doc.name;
            return (
              <GlassPanel
                key={idx}
                interactive
                onClick={() => {
                  setActiveDoc(doc);
                  setActivePage(1);
                }}
                className={`p-5 border transition-all ${
                  isSelected ? 'border-electric-glow bg-electric/15 shadow-glow-sm' : 'border-white/10 hover:border-electric/40'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-electric-light" />
                    <span className="font-heading font-bold text-white text-xs">
                      {doc.title}
                    </span>
                  </div>
                  <PlannedBadge type="LIVE" />
                </div>

                <p className="font-mono text-xs text-electric-light truncate mb-2">
                  {doc.name}
                </p>

                <div className="text-[11px] font-mono text-lavender-dim space-y-1 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="text-white">{doc.patient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Pages:</span>
                    <span className="text-white font-bold">{doc.totalPages}</span>
                  </div>
                </div>

                {/* Page selection pills */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-lavender-dim uppercase">Select Page:</span>
                  {Array.from({ length: doc.totalPages }, (_, pIdx) => pIdx + 1).map((p) => (
                    <button
                      key={p}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDoc(doc);
                        setActivePage(p);
                      }}
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition ${
                        isSelected && activePage === p
                          ? 'bg-electric text-white shadow-glow-sm'
                          : 'bg-deepblack text-lavender hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      p.{p}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            );
          })}

          {/* Planned Upload Card */}
          <GlassPanel className="p-5 border-dashed border-electric/30 bg-deepblack/40 mt-2">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-lavender-dim" />
                <span className="font-heading font-bold text-lavender text-xs">
                  Upload Documents
                </span>
              </div>
              <PlannedBadge type="PLANNED" />
            </div>
            <p className="text-xs text-lavender-dim leading-relaxed mb-3">
              Multi-document intake, image-to-PDF pre-processing, and scanned OCR extraction will be supported in Phase 4.
            </p>
            <Button size="sm" variant="outline" disabled className="w-full">
              Upload New Packet (Planned)
            </Button>
          </GlassPanel>
        </div>

        {/* Right Column: Page Text Stream Viewer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <GlassPanel className="p-6 flex-1 flex flex-col border-electric/30">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-electric/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-electric-light font-bold">
                  Document Stream
                </span>
                <h3 className="text-lg font-heading font-bold text-white mt-0.5">
                  {activeDoc.name} &bull; Page {activePage}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => loadPageText(activeDoc.name, activePage)}
                  icon={RefreshCw}
                >
                  Reload
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/claims/analysis')}
                >
                  Inspect in Analysis
                </Button>
              </div>
            </div>

            <div className="flex-1 bg-deepblack/90 rounded-xl p-5 border border-white/5 font-mono text-xs leading-relaxed overflow-y-auto max-h-[600px] text-lavender">
              {loading ? (
                <div className="py-24 text-center text-lavender-dim">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-electric-light" />
                  Loading verbatim text stream...
                </div>
              ) : error ? (
                <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl">
                  {error}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{pageText}</pre>
              )}
            </div>
          </GlassPanel>
        </div>

      </div>

    </div>
  );
}

