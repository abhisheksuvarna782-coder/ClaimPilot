import React from 'react';
import { FileText, RefreshCw, AlertCircle, Quote } from 'lucide-react';
import GlassPanel from './ui/GlassPanel';
import { useClaim } from '../context/ClaimContext';

export default function SourceInspector() {
  const { selectedField, pageText, pageLoading, pageError } = useClaim();

  const renderHighlightedText = (text, snippet) => {
    if (!text) return <p className="text-lavender-dim italic">No document text available.</p>;
    if (!snippet) return <pre className="whitespace-pre-wrap font-mono text-xs text-lavender-light">{text}</pre>;

    const cleanSnippet = snippet.trim();
    const index = text.indexOf(cleanSnippet);

    if (index === -1) {
      return (
        <div>
          <div className="mb-2 p-2 bg-amber-950/40 text-amber-300 text-xs rounded border border-amber-500/30 font-mono">
            Note: Verbatim snippet offset match in progress. Displaying page text.
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-lavender-light leading-relaxed">{text}</pre>
        </div>
      );
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + cleanSnippet.length);
    const after = text.substring(index + cleanSnippet.length);

    return (
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-lavender-dim">
        {before}
        <mark className="bg-amber-400/90 text-black font-bold px-1.5 py-0.5 rounded shadow-sm border border-amber-300">
          {match}
        </mark>
        {after}
      </pre>
    );
  };

  return (
    <GlassPanel className="p-5 flex flex-col h-full overflow-hidden border-electric/30">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-electric/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-electric-light" />
          <h3 className="font-heading font-bold text-white text-sm tracking-wide">
            Source Document Inspector
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-electric-light">
          PROVENANCE
        </span>
      </div>

      {selectedField ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata Citation Card */}
          <div className="p-3.5 bg-deepblack/80 rounded-xl border border-electric/20 mb-4 text-xs font-mono">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-lavender-dim">Document:</span>
              <span className="text-electric-glow font-bold truncate max-w-[180px]" title={selectedField.source_doc}>
                {selectedField.source_doc}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-lavender-dim">Page Number:</span>
              <span className="text-white font-bold">{selectedField.page}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lavender-dim">Target Field:</span>
              <span className="text-white font-semibold">{selectedField.field}</span>
            </div>
            
            <div className="pt-2 border-t border-electric/15">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-electric-light font-bold mb-1">
                <Quote className="w-3 h-3" />
                <span>Verified Snippet:</span>
              </div>
              <p className="bg-amber-950/30 text-amber-200 p-2 rounded-lg border border-amber-500/30 text-[11px] leading-relaxed break-words">
                &ldquo;{selectedField.snippet}&rdquo;
              </p>
            </div>
          </div>

          {/* Full Page Plain Text Viewer with Highlight */}
          <div className="flex-1 flex flex-col min-h-[300px] overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-lavender-dim mb-2">
              <span className="uppercase tracking-widest text-[10px]">Extracted Page Stream</span>
              {pageLoading && <span className="text-electric-glow animate-pulse">Loading stream...</span>}
            </div>

            <div className="flex-1 p-3.5 bg-deepblack/90 border border-white/5 rounded-xl overflow-y-auto max-h-[500px]">
              {pageLoading && (
                <div className="py-16 text-center text-lavender-dim text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-electric-light" />
                  Fetching document page text...
                </div>
              )}
              {pageError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pageError}</span>
                </div>
              )}
              {!pageLoading && !pageError && renderHighlightedText(pageText, selectedField.snippet)}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-lavender-dim text-xs flex-1 flex flex-col items-center justify-center">
          <FileText className="w-8 h-8 text-lavender-dim/30 mb-2" />
          <p className="font-semibold text-white">No Field Selected</p>
          <p className="mt-1 max-w-[200px]">Select any field row to display its verified source text and highlight.</p>
        </div>
      )}
    </GlassPanel>
  );
}

