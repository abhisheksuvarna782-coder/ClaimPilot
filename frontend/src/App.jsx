import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  ExternalLink,
  ShieldAlert,
  Layers
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inspector state
  const [selectedField, setSelectedField] = useState(null);
  const [pageText, setPageText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/analyze`, { method: 'POST' });
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const json = await res.json();
      setData(json);

      // Select first field by default if available
      if (json.fields && json.fields.length > 0) {
        selectField(json.fields[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const selectField = async (fieldItem) => {
    setSelectedField(fieldItem);
    if (!fieldItem || !fieldItem.source_doc || !fieldItem.page) return;

    setPageLoading(true);
    setPageError(null);
    try {
      const res = await fetch(
        `${API_BASE}/documents/${encodeURIComponent(fieldItem.source_doc)}/pages/${fieldItem.page}`
      );
      if (!res.ok) throw new Error(`Failed to load page text (${res.status})`);
      const pageData = await res.json();
      setPageText(pageData.text || '');
    } catch (err) {
      setPageError(err.message || 'Could not fetch page text');
      setPageText('');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  // Highlight snippet in page text using simple string matching
  const renderHighlightedText = (text, snippet) => {
    if (!text) return <p className="text-slate-400 italic">No document text available.</p>;
    if (!snippet) return <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700">{text}</pre>;

    const cleanSnippet = snippet.trim();
    const index = text.indexOf(cleanSnippet);

    if (index === -1) {
      return (
        <div>
          <div className="mb-2 p-2 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
            Note: Verbatim snippet text match not found at current offset. Displaying raw text.
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 leading-relaxed">{text}</pre>
        </div>
      );
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + cleanSnippet.length);
    const after = text.substring(index + cleanSnippet.length);

    return (
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
        {before}
        <mark className="bg-amber-300 text-slate-900 font-bold px-1.5 py-0.5 rounded shadow-sm border border-amber-400">
          {match}
        </mark>
        {after}
      </pre>
    );
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">Medium</span>;
      case 'low':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">Verified</span>;
      case 'needs_review':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700">Needs Review</span>;
    }
  };

  const getRuleCardStyles = (result) => {
    switch (result) {
      case 'Pass':
        return {
          cardBg: 'bg-emerald-50/50 border-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        };
      case 'Fail':
        return {
          cardBg: 'bg-rose-50/50 border-rose-300',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <XCircle className="w-5 h-5 text-rose-600" />
        };
      case 'Missing':
        return {
          cardBg: 'bg-amber-50/60 border-amber-300',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertCircle className="w-5 h-5 text-amber-600" />
        };
      case 'Conflict':
        return {
          cardBg: 'bg-purple-50/60 border-purple-300',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <ShieldAlert className="w-5 h-5 text-purple-600" />
        };
      case 'Unable to verify':
      default:
        return {
          cardBg: 'bg-slate-50 border-slate-300',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
          icon: <HelpCircle className="w-5 h-5 text-slate-600" />
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Mandatory Synthetic Data Banner */}
      <div className="bg-red-700 text-white font-bold text-center py-2 px-4 shadow-md tracking-wider text-xs md:text-sm uppercase flex items-center justify-center gap-2 sticky top-0 z-50">
        <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>SYNTHETIC DEMONSTRATION DATA - NOT A REAL PATIENT RECORD</span>
        <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
      </div>

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ClaimPilot</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Prototype PoW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 italic">
            The agent drafts, code verifies, every field traces to its source, and the human approves.
          </p>
        </div>

        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Validating...' : 'Rerun Validation'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-[1700px] w-full mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Extracting fields and executing deterministic rules...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 my-6">
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Backend Connection Failed</p>
              <p className="text-xs mt-1 text-rose-700">{error}</p>
              <p className="text-xs mt-2 text-rose-600">Ensure the backend server is running on <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">http://127.0.0.1:8000</code>.</p>
              <button
                onClick={fetchAnalysis}
                className="mt-3 px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Extracted Fields Table (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Extracted Fields ({data.fields?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Click any row to inspect source snippet.</p>
                </div>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[750px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 border-b border-slate-200 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Value</th>
                      <th className="py-2.5 px-3">Source Doc</th>
                      <th className="py-2.5 px-2 text-center">Page</th>
                      <th className="py-2.5 px-3 text-center">Confidence</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data.fields?.map((f, idx) => {
                      const isSelected = selectedField && 
                        selectedField.field === f.field && 
                        selectedField.source_doc === f.source_doc && 
                        selectedField.page === f.page;

                      return (
                        <tr
                          key={idx}
                          onClick={() => selectField(f)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            isSelected 
                              ? 'bg-blue-50/80 font-medium text-blue-900 border-l-4 border-l-blue-600' 
                              : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-medium text-slate-800">
                            {f.field}
                          </td>
                          <td className="py-3 px-3 max-w-[140px] truncate" title={f.value}>
                            {f.value}
                          </td>
                          <td className="py-3 px-3 max-w-[130px] truncate text-slate-500" title={f.source_doc}>
                            {f.source_doc}
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            {f.page}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {getConfidenceBadge(f.confidence)}
                          </td>
                          <td className="py-3 px-3">
                            {getStatusBadge(f.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MIDDLE COLUMN: Rule Results & Conflict Card (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Conflict Card if conflicts exist */}
              {data.conflicts && data.conflicts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border-2 border-purple-300 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-purple-600" />
                      <h3 className="text-sm font-bold text-purple-900">Cross-Document Conflict</h3>
                    </div>
                    <span className="text-[11px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                      Staff Verification Needed
                    </span>
                  </div>

                  {data.conflicts.map((conf, cIdx) => (
                    <div key={cIdx} className="mt-3">
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        Conflicting Field: <span className="font-mono text-purple-700 font-bold">{conf.field}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-3 my-2">
                        {/* Doc A */}
                        <div className="p-2.5 rounded bg-purple-50/60 border border-purple-200">
                          <p className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Document A</p>
                          <p className="text-xs font-semibold text-slate-900 mt-1 truncate" title={conf.a.doc}>
                            {conf.a.doc}
                          </p>
                          <p className="text-[11px] text-slate-500">Page {conf.a.page}</p>
                          <p className="text-sm font-mono font-bold text-purple-900 mt-1.5 bg-white p-1 rounded border border-purple-200 text-center">
                            {conf.a.value}
                          </p>
                        </div>

                        {/* Doc B */}
                        <div className="p-2.5 rounded bg-purple-50/60 border border-purple-200">
                          <p className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Document B</p>
                          <p className="text-xs font-semibold text-slate-900 mt-1 truncate" title={conf.b.doc}>
                            {conf.b.doc}
                          </p>
                          <p className="text-[11px] text-slate-500">Page {conf.b.page}</p>
                          <p className="text-sm font-mono font-bold text-purple-900 mt-1.5 bg-white p-1 rounded border border-purple-200 text-center">
                            {conf.b.value}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                        {conf.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Rules Cards Container */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">Deterministic Rules Results</h2>
                  <span className="text-[11px] text-slate-500">4 Rules Evaluated</span>
                </div>

                <div className="flex flex-col gap-3">
                  {data.rule_results?.map((rule) => {
                    const styling = getRuleCardStyles(rule.result);
                    return (
                      <div
                        key={rule.rule_id}
                        className={`rounded-lg p-3.5 border transition shadow-sm ${styling.cardBg}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {styling.icon}
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {rule.rule_id}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 border border-slate-300">
                              {rule.rule_status} rule
                            </span>
                          </div>

                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${styling.badge}`}>
                            {rule.result}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 mt-2">
                          {rule.description}
                        </p>

                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {rule.explanation}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-[11px] text-slate-700">
                          <span className="font-semibold text-slate-900 shrink-0">Action:</span>
                          <span className="italic">{rule.action}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Source Inspector Panel (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Source Inspector
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Verbatim page text & snippet highlight</p>
              </div>

              {selectedField ? (
                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                  {/* Document & Page Citation Card */}
                  <div className="p-3 bg-slate-100/80 rounded-lg border border-slate-200 mb-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">Document:</span>
                      <span className="font-mono text-blue-800 font-medium truncate max-w-[150px]" title={selectedField.source_doc}>
                        {selectedField.source_doc}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">Page:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedField.page}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">Target Field:</span>
                      <span className="font-mono text-slate-900 font-semibold">{selectedField.field}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-[11px] font-semibold text-slate-600 mb-0.5">Target Snippet:</p>
                      <p className="font-mono text-xs bg-amber-50 text-amber-900 p-1.5 rounded border border-amber-200 font-medium break-words">
                        "{selectedField.snippet}"
                      </p>
                    </div>
                  </div>

                  {/* Page Text Viewer */}
                  <div className="flex-1 flex flex-col min-h-[350px]">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Extracted Page Text</span>
                      {pageLoading && <span className="text-blue-600 text-[11px] animate-pulse">Loading page...</span>}
                    </div>

                    <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-y-auto max-h-[500px]">
                      {pageLoading && (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                          Fetching document text...
                        </div>
                      )}
                      {pageError && (
                        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                          {pageError}
                        </div>
                      )}
                      {!pageLoading && !pageError && renderHighlightedText(pageText, selectedField.snippet)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs flex-1 flex flex-col items-center justify-center">
                  <FileText className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-600">No Field Selected</p>
                  <p className="mt-1 max-w-[200px]">Click any field row in the table to display its verified source text and highlight.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        ClaimPilot Prototype &bull; Deterministic Compliance Engine &bull; Synthetic Demonstration Environment
      </footer>
    </div>
  );
}

