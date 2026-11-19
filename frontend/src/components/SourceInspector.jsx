import React from 'react';
import { FileText, RefreshCw, AlertCircle, Quote } from 'lucide-react';
import Panel from './ui/Panel';
import { useClaim } from '../context/ClaimContext';

export default function SourceInspector() {
  const { selectedField, pageText, pageLoading, pageError } = useClaim();

  const renderHighlightedText = (text, snippet) => {
    if (!text) return <p className="text-lavender-muted italic">No document text available.</p>;
    if (!snippet) return <pre className="whitespace-pre-wrap font-mono text-xs text-lavender">{text}</pre>;

    const cleanSnippet = snippet.trim();
    const index = text.indexOf(cleanSnippet);

    if (index === -1) {
      return (
        <div>
          <div className="mb-2 p-2 bg-status-missing-bg text-status-missing-text text-xs rounded-sm border border-status-missing-border font-mono">
            Note: Verbatim snippet offset match in progress. Displaying page text.
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-lavender leading-relaxed">{text}</pre>
        </div>
      );
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + cleanSnippet.length);
    const after = text.substring(index + cleanSnippet.length);

    return (
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-lavender-muted">
        {before}
        <mark className="bg-electric/25 text-lavender-highlight font-medium px-1.5 py-0.5 rounded-sm border border-electric/60">
          {match}
        </mark>
        {after}
      </pre>
    );
  };

  return (
    <Panel className="p-5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-lavender-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-electric" />
          <h3 className="font-display font-bold text-lavender-highlight text-sm tracking-wide">
            Source Document Inspector
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-lavender-muted">
          PROVENANCE
        </span>
      </div>

      {selectedField ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata Citation Card */}
          <div className="p-3.5 bg-midnight rounded-sm border border-lavender-border mb-4 text-xs font-mono">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-lavender-muted">Document:</span>
              <span className="text-lavender-highlight font-medium truncate max-w-[180px]" title={selectedField.source_doc}>
                {selectedField.source_doc}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-lavender-muted">Page Number:</span>
              <span className="text-lavender-highlight font-medium">{selectedField.page}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lavender-muted">Target Field:</span>
              <span className="text-lavender-highlight font-medium">{selectedField.field}</span>
            </div>
            
            <div className="pt-2 border-t border-lavender-border">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-lavender-muted font-medium mb-1">
                <Quote className="w-3 h-3 text-electric" />
                <span>Verified Snippet:</span>
              </div>
              <p className="bg-lavender-faint text-lavender-highlight p-2 rounded-sm border border-lavender-border text-[11px] leading-relaxed break-words font-mono">
                &ldquo;{selectedField.snippet}&rdquo;
              </p>
            </div>
          </div>

          {/* Full Page Plain Text Viewer with Highlight */}
          <div className="flex-1 flex flex-col min-h-[300px] overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-lavender-muted mb-2">
              <span className="uppercase tracking-widest text-[10px]">Extracted Page Stream</span>
              {pageLoading && <span className="text-lavender-highlight">Loading stream...</span>}
            </div>

            <div className="flex-1 p-3.5 bg-midnight border border-lavender-border rounded-sm overflow-y-auto max-h-[500px]">
              {pageLoading && (
                <div className="py-16 text-center text-lavender-muted text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-electric" />
                  Fetching document page text...
                </div>
              )}
              {pageError && (
                <div className="p-3 bg-status-fail-bg text-status-fail-text rounded-sm border border-status-fail-border text-xs">
                  <AlertCircle className="w-4 h-4 mb-1" />
                  {pageError}
                </div>
              )}
              {!pageLoading && !pageError && renderHighlightedText(pageText, selectedField.snippet)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-lavender-muted">
          <FileText className="w-10 h-10 mb-3 text-lavender-border stroke-[1.5]" />
          <p className="text-xs font-mono uppercase tracking-wider text-lavender-highlight">No Field Selected</p>
          <p className="text-[11px] text-lavender-muted mt-1 max-w-[200px] font-body">
            Click any row in the Extracted Fields table to view its verbatim provenance.
          </p>
        </div>
      )}
    </Panel>
  );
}
