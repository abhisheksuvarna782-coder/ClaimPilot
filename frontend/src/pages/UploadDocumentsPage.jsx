import React from 'react';
import PlannedPage from './PlannedPage';

export default function UploadDocumentsPage() {
  return (
    <PlannedPage
      title="Upload Documents & Intake"
      description="Multi-document ingestion, automated PDF packet splitting, and multi-modal OCR text extraction for provider submissions."
      relatedLivePath="/documents/sources"
      relatedLiveName="Source Documents"
    />
  );
}
