import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import Panel from '../components/ui/Panel';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PlannedBadge from '../components/ui/PlannedBadge';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const SYNTHETIC_DOCS = [
  {
    name: 'discharge_summary.pdf',
    title: 'Hospital Discharge Summary',
    totalPages: 2,
    issuer: 'Apex Memorial Healthcare (Synthetic Record)',
    patientId: 'SYN-0001',
    description: 'Two-page clinical inpatient summary detailing patient stay, diagnosis, and surgical procedure.',
  },
  {
    name: 'claim_form.pdf',
    title: 'Health Insurance Claim Submission Form',
    totalPages: 1,
    issuer: 'Policyholder Submission (Synthetic Record)',
    patientId: 'SYN-0001',
    description: 'One-page billing claim with billing dates and claimed amount (contains deliberate discharge date discrepancy).',
  }
];

export default function SourceDocumentsPage() {
  const navigate = useNavigate();
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
    <div className="max-w-[1700px] mx-auto px-6 py-8 font-body">
      
      <SectionHeading
        tag="Evidence Repository"
        title="Source Documents"
        description="Inspect the bundled synthetic PDF documents and verify selectable plain text streams."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/claims/analysis')}
          >
            Go to Claim Console
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Document Selection (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-lavender-muted">
            Available Evidence Documents (2)
          </div>

          {SYNTHETIC_DOCS.map((doc) => {
            const isSelected = activeDoc.name === doc.name;

            return (
              <Panel
                key={doc.name}
                interactive
                onClick={() => {
                  setActiveDoc(doc);
                  setActivePage(1);
                }}
                className={`p-5 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-electric' 
                    : 'border-lavender-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-lavender-highlight font-medium">
                      {doc.name}
                    </span>
                    <PlannedBadge type="LIVE" />
                  </div>

                  <h3 className="font-display font-bold text-lavender-highlight text-sm mb-1.5">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-lavender-muted leading-relaxed font-body mb-3">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-lavender-border flex items-center justify-between text-[11px] font-mono text-lavender-muted">
                  <span>Pages: {doc.totalPages}</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: doc.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDoc(doc);
                          setActivePage(p);
                        }}
                        className={`px-2 py-0.5 rounded-sm border ${
                          isSelected && activePage === p
                            ? 'bg-electric text-lavender-highlight border-electric'
                            : 'border-lavender-border text-lavender-muted hover:text-lavender-highlight hover:border-lavender'
                        }`}
                      >
                        p.{p}
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>

        {/* Live Document Page Text Stream (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <Panel className="p-6 flex-1 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-lavender-border font-mono text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-electric" />
                <span className="text-lavender-highlight font-medium">
                  {activeDoc.name} — Page {activePage} of {activeDoc.totalPages}
                </span>
              </div>
              <span className="text-[10px] text-lavender-muted uppercase tracking-wider">
                GET /documents/&#123;name&#125;/pages/&#123;n&#125;
              </span>
            </div>

            <div className="flex-1 bg-midnight p-4 rounded-sm border border-lavender-border overflow-y-auto max-h-[600px]">
              {loading && (
                <div className="py-24 text-center text-lavender-muted text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-electric" />
                  Loading verbatim page text...
                </div>
              )}

              {error && (
                <div className="p-4 bg-status-fail-bg border border-status-fail-border text-status-fail-text text-xs rounded-sm">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <pre className="whitespace-pre-wrap font-mono text-xs text-lavender leading-relaxed">
                  {pageText}
                </pre>
              )}
            </div>
          </Panel>
        </div>

      </div>

    </div>
  );
}
