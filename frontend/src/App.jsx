import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SyntheticBanner from './components/ui/SyntheticBanner';
import Navigation from './components/Navigation';
import CinematicIntro from './components/CinematicIntro';
import { ClaimProvider } from './context/ClaimContext';

// Pages
import OverviewPage from './pages/OverviewPage';
import ClaimAnalysisPage from './pages/ClaimAnalysisPage';
import SourceDocumentsPage from './pages/SourceDocumentsPage';
import EvidenceTraceabilityPage from './pages/EvidenceTraceabilityPage';
import AIIntelligencePage from './pages/AIIntelligencePage';
import VerificationPage from './pages/VerificationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlannedPage from './pages/PlannedPage';
import UploadDocumentsPage from './pages/UploadDocumentsPage';
import PolicyCompliancePage from './pages/PolicyCompliancePage';
import HumanReviewPage from './pages/HumanReviewPage';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro once per browser session
    return !sessionStorage.getItem('claimpilot_intro_shown');
  });

  const [prefetchedData, setPrefetchedData] = useState(null);

  return (
    <BrowserRouter>
      {showIntro ? (
        <CinematicIntro
          onComplete={() => setShowIntro(false)}
          onPrefetchedData={(data) => setPrefetchedData(data)}
        />
      ) : (
        <ClaimProvider initialData={prefetchedData}>
          <div className="min-h-screen flex flex-col bg-midnight text-lavender scanline">
            
            {/* 1. Mandatory Synthetic Data Banner (Always Visible) */}
            <SyntheticBanner />

            {/* 2. Top Horizontal Navigation with Futuristic Mega-Dropdowns */}
            <Navigation />

            {/* 3. Main Content Routes */}
            <main className="flex-1">
              <Routes>
                {/* Overview / Hero */}
                <Route path="/" element={<OverviewPage />} />

                {/* Claims */}
                <Route path="/claims/analysis" element={<ClaimAnalysisPage />} />
                <Route
                  path="/claims/new"
                  element={
                    <PlannedPage
                      title="Create New Claim"
                      description="Pre-admission authorization and reimbursement claim intake with automated multi-document packet binding."
                      relatedLivePath="/claims/analysis"
                      relatedLiveName="Analysis Console"
                    />
                  }
                />
                <Route
                  path="/claims/pending"
                  element={
                    <PlannedPage
                      title="Pending Claims"
                      description="Queue of active claims awaiting supplementary clinical records, lab investigations, or attending physician clarification."
                      relatedLivePath="/claims/analysis"
                      relatedLiveName="Analysis Console"
                    />
                  }
                />
                <Route
                  path="/claims/processed"
                  element={
                    <PlannedPage
                      title="Processed Claims"
                      description="Audit repository of historical claims verified and formatted for automated clearinghouse transmission."
                      relatedLivePath="/claims/analysis"
                      relatedLiveName="Analysis Console"
                    />
                  }
                />
                <Route
                  path="/claims/review"
                  element={
                    <PlannedPage
                      title="Claims Awaiting Review"
                      description="Flagged claims with cross-document discrepancies or unverified rule dependencies requiring staff review."
                      relatedLivePath="/claims/analysis"
                      relatedLiveName="Analysis Console"
                    />
                  }
                />

                {/* Documents */}
                <Route path="/documents/sources" element={<SourceDocumentsPage />} />
                <Route path="/documents/extracted" element={<EvidenceTraceabilityPage />} />
                <Route path="/documents/traceability" element={<EvidenceTraceabilityPage />} />
                <Route path="/documents/upload" element={<UploadDocumentsPage />} />
                <Route
                  path="/documents/processing"
                  element={
                    <PlannedPage
                      title="Document Processing"
                      description="Real-time background worker status tracking text normalization, page segmentation, and OCR confidence."
                      relatedLivePath="/documents/sources"
                      relatedLiveName="Source Documents"
                    />
                  }
                />

                {/* AI Intelligence */}
                <Route path="/intelligence/method" element={<AIIntelligencePage />} />
                <Route path="/intelligence/contradictions" element={<AIIntelligencePage />} />
                <Route
                  path="/intelligence/llm-analysis"
                  element={
                    <PlannedPage
                      title="LLM Document Analysis"
                      description="Generative clinical summary and reasoning agent with automated bounded retries and provenance constraints."
                      relatedLivePath="/intelligence/method"
                      relatedLiveName="Extraction Architecture"
                    />
                  }
                />
                <Route
                  path="/intelligence/history"
                  element={
                    <PlannedPage
                      title="AI Processing History"
                      description="Audit log tracking agent token usage, extraction retries, and confidence state transitions over time."
                      relatedLivePath="/intelligence/method"
                      relatedLiveName="Extraction Architecture"
                    />
                  }
                />

                {/* Verification */}
                <Route path="/verification/rules" element={<VerificationPage />} />
                <Route path="/verification/icd10" element={<VerificationPage />} />
                <Route path="/verification/policy" element={<PolicyCompliancePage />} />
                <Route path="/verification/human-review" element={<HumanReviewPage />} />

                {/* Analytics */}
                <Route path="/analytics/statistics" element={<AnalyticsPage />} />
                <Route
                  path="/analytics/performance"
                  element={
                    <PlannedPage
                      title="Processing Performance"
                      description="End-to-end extraction latency, GPU throughput, and rule engine execution benchmarks."
                      relatedLivePath="/analytics/statistics"
                      relatedLiveName="Claim Statistics"
                    />
                  }
                />
                <Route
                  path="/analytics/reports"
                  element={
                    <PlannedPage
                      title="Verification Reports"
                      description="Exportable pre-submission audit certificates and compliance summaries in standard FHIR and PDF formats."
                      relatedLivePath="/analytics/statistics"
                      relatedLiveName="Claim Statistics"
                    />
                  }
                />
                <Route
                  path="/analytics/insights"
                  element={
                    <PlannedPage
                      title="System Insights"
                      description="Provider-level documentation gap trends and recurring discrepancy patterns across hospitalization cases."
                      relatedLivePath="/analytics/statistics"
                      relatedLiveName="Claim Statistics"
                    />
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Futuristic Minimalist Footer */}
            <footer className="border-t border-electric/15 bg-deepblack/90 py-6 px-6 text-center text-xs font-mono text-lavender-dim">
              <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-glow animate-pulse" />
                  <span className="text-white font-bold tracking-wider">CLAIM<span className="text-electric-light">PILOT</span></span>
                  <span className="text-lavender-dim/50">&bull;</span>
                  <span>Deterministic Healthcare Intelligence</span>
                </div>

                <div className="text-[11px] text-lavender-dim/70">
                  Prototype demonstration &bull; Synthetic records only &bull; LLM does not decide compliance
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-electric-light">v0.1.0-prototype</span>
                </div>
              </div>
            </footer>

          </div>
        </ClaimProvider>
      )}
    </BrowserRouter>
  );
}
