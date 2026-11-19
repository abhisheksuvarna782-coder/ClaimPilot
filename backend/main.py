import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

try:
    from backend.extractor import (
        load_pdf_pages,
        extract_fields_from_page,
        evaluate_signals_and_confidence,
    )
    from backend.rules import run_all_rules, load_icd10_sample_codes
except ImportError:
    from extractor import (
        load_pdf_pages,
        extract_fields_from_page,
        evaluate_signals_and_confidence,
    )
    from rules import run_all_rules, load_icd10_sample_codes

SYNTHETIC_BANNER = "SYNTHETIC DEMONSTRATION DATA - NOT A REAL PATIENT RECORD"

app = FastAPI(
    title="ClaimPilot Backend Prototype",
    description="Deterministic claims validation engine for synthetic demonstration data.",
    version="0.1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYNTHETIC_DATA_DIR = os.path.join(BASE_DIR, "synthetic_data")

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "banner": SYNTHETIC_BANNER,
        "service": "ClaimPilot Prototype"
    }

@app.get("/documents/{name}/pages/{n}")
def get_document_page_text(name: str, n: int):
    """
    Returns the exact plain text of a requested document page.
    """
    file_path = os.path.join(SYNTHETIC_DATA_DIR, name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Document '{name}' not found.")

    pages = load_pdf_pages(file_path)
    if n not in pages:
        raise HTTPException(
            status_code=404,
            detail=f"Page {n} not found in '{name}'. Total pages: {len(pages)}."
        )

    return {
        "document": name,
        "page": n,
        "text": pages[n]
    }

@app.post("/analyze")
def analyze_synthetic_documents() -> Dict[str, Any]:
    """
    Executes extraction on bundled synthetic documents, evaluates signals/confidence,
    executes deterministic rules, and returns standard analysis output.
    """
    doc_names = ["discharge_summary.pdf", "claim_form.pdf"]
    all_pages_text: Dict[str, Dict[int, str]] = {}
    raw_extracted_fields: List[Dict[str, Any]] = []

    # 1. Read documents and extract fields per page
    for doc_name in doc_names:
        file_path = os.path.join(SYNTHETIC_DATA_DIR, doc_name)
        if os.path.exists(file_path):
            pages = load_pdf_pages(file_path)
            all_pages_text[doc_name] = pages
            for page_num, text in pages.items():
                page_fields = extract_fields_from_page(doc_name, page_num, text)
                raw_extracted_fields.extend(page_fields)

    # 2. Evaluate signals, confidence labels, and cross-doc conflicts
    fields, conflicts = evaluate_signals_and_confidence(
        raw_extracted_fields,
        all_pages_text
    )

    # 3. Deterministic rules evaluation
    available_docs = list(all_pages_text.keys())
    icd_catalog = load_icd10_sample_codes()
    rule_results = run_all_rules(available_docs, fields, icd_catalog)

    return {
        "banner": SYNTHETIC_BANNER,
        "fields": fields,
        "rule_results": rule_results,
        "conflicts": conflicts
    }

