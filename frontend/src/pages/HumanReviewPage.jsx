import React from 'react';
import PlannedPage from './PlannedPage';

export default function HumanReviewPage() {
  return (
    <PlannedPage
      title="Human Review & Approval Gateway"
      description="Auditor decision console for resolving flagged contradictions and approving claim packets before clearinghouse submission. ClaimPilot does not make autonomous approval decisions."
      relatedLivePath="/claims/analysis"
      relatedLiveName="Claim Analysis"
    />
  );
}
