import os
import sys
import re
from typing import List, Dict, Any, Tuple, Optional
import pdfplumber

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from backend.normalizer import normalize_date
except ImportError:
    from normalizer import normalize_date

# Synthetic extraction fields specification
SUPPORTED_FIELDS = [
    "patient_id",
    "admission_date",
    "discharge_date",
    "diagnosis",
    "icd10_code",
    "procedure",
    "claim_amount",
]

def load_pdf_pages(file_path: str) -> Dict[int, str]:
    """
    Extracts text per page from a PDF file.
    Returns a dict mapping 1-based page number to page text.
    """
    pages_text = {}
    if not os.path.exists(file_path):
        return pages_text

    with pdfplumber.open(file_path) as pdf:
        for idx, page in enumerate(pdf.pages):
            page_text = page.extract_text() or ""
            pages_text[idx + 1] = page_text
    return pages_text

def extract_fields_from_page(doc_name: str, page_num: int, page_text: str) -> List[Dict[str, Any]]:
    """
    Deterministic regex-based field extractor from page text.
    Every returned field contains source_doc, page, snippet, and raw/normalized value.
    Rejects any field if the snippet cannot be verified in the page text.
    """
    extracted = []
    lines = [line.strip() for line in page_text.split("\n") if line.strip()]

    for line in lines:
        # 1. Patient ID
        pid_match = re.search(r"Patient\s+ID:\s*([A-Za-z0-9\-]+)", line, re.IGNORECASE)
        if pid_match:
            val = pid_match.group(1).strip()
            extracted.append({
                "field": "patient_id",
                "value": val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": val,
            })

        # 2. Admission Date
        adm_match = re.search(r"Admission\s+Date:\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4}|[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2})", line, re.IGNORECASE)
        if adm_match:
            raw_val = adm_match.group(1).strip()
            norm_val = normalize_date(raw_val) or raw_val
            extracted.append({
                "field": "admission_date",
                "value": norm_val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": raw_val,
            })

        # 3. Discharge Date
        dis_match = re.search(r"Discharge\s+Date:\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4}|[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2})", line, re.IGNORECASE)
        if dis_match:
            raw_val = dis_match.group(1).strip()
            norm_val = normalize_date(raw_val) or raw_val
            extracted.append({
                "field": "discharge_date",
                "value": norm_val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": raw_val,
            })

        # 4. Diagnosis (Final diagnosis or Diagnosis)
        diag_match = re.search(r"(?:Final\s+diagnosis|Diagnosis):\s*([^(\n\r]+?)(?:\s*\(ICD-10:|$)", line, re.IGNORECASE)
        if diag_match:
            val = diag_match.group(1).strip()
            extracted.append({
                "field": "diagnosis",
                "value": val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": val,
            })

        # 5. ICD-10 Code
        icd_match = re.search(r"ICD-10:\s*([A-Za-z][0-9]{2}(?:\.[0-9A-Za-z]{1,4})?)", line, re.IGNORECASE)
        if icd_match:
            val = icd_match.group(1).strip()
            extracted.append({
                "field": "icd10_code",
                "value": val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": val,
            })

        # 6. Procedure
        proc_match = re.search(r"Procedure:\s*([^\n\r]+)", line, re.IGNORECASE)
        if proc_match:
            val = proc_match.group(1).strip()
            extracted.append({
                "field": "procedure",
                "value": val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": val,
            })

        # 7. Claim Amount
        amt_match = re.search(r"Claim\s+amount:\s*([^\n\r]+)", line, re.IGNORECASE)
        if amt_match:
            val = amt_match.group(1).strip()
            extracted.append({
                "field": "claim_amount",
                "value": val,
                "source_doc": doc_name,
                "page": page_num,
                "snippet": line,
                "raw_value": val,
            })

    # Rule 3 & 4: Reject any field whose snippet is not found in the page text
    valid_extracted = []
    for item in extracted:
        if item["snippet"] in page_text:
            valid_extracted.append(item)
        else:
            # Explicit rejection: snippets must be verified verbatim
            continue

    return valid_extracted

def evaluate_signals_and_confidence(
    extracted_fields: List[Dict[str, Any]],
    all_pages_text: Dict[str, Dict[int, str]]
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Evaluates extraction signals, confidence label, field status, and document conflicts.
    Confidence rules:
      - Only count signals that apply.
      - If a field appears in just one document, cross_doc_agree is 'not applicable'.
      - High: all applicable signals pass.
      - Medium: one applicable signal fails.
      - Low: snippet is not found or two or more applicable signals fail.
    """
    # Group fields by field name to check cross-document consistency
    field_groups: Dict[str, List[Dict[str, Any]]] = {}
    for f in extracted_fields:
        field_groups.setdefault(f["field"], []).append(f)

    # Detect conflicts across distinct documents
    conflicts = []
    cross_doc_agreement_map: Dict[int, Any] = {} # id(f) -> bool | 'not applicable'

    for field_name, items in field_groups.items():
        distinct_docs = set(item["source_doc"] for item in items)
        if len(distinct_docs) <= 1:
            for item in items:
                cross_doc_agreement_map[id(item)] = "not applicable"
        else:
            # Compare values across documents
            # For dates, compare normalized values
            # For procedures, check compatibility/subsumption
            first_val = items[0]["value"].strip().lower()
            conflict_found = False
            first_item = items[0]
            conflicting_item = None

            for other in items[1:]:
                other_val = other["value"].strip().lower()
                if field_name == "procedure":
                    # Clinical procedure compatibility (e.g. laparoscopic appendectomy vs appendectomy)
                    agrees = (first_val in other_val) or (other_val in first_val)
                else:
                    agrees = (first_val == other_val)

                if not agrees:
                    conflict_found = True
                    conflicting_item = other
                    break

            if conflict_found and conflicting_item:
                for item in items:
                    cross_doc_agreement_map[id(item)] = False
                conflicts.append({
                    "field": field_name,
                    "a": {
                        "doc": first_item["source_doc"],
                        "page": first_item["page"],
                        "value": first_item["value"]
                    },
                    "b": {
                        "doc": conflicting_item["source_doc"],
                        "page": conflicting_item["page"],
                        "value": conflicting_item["value"]
                    },
                    "explanation": f"The {field_name.replace('_', ' ')} differs between {first_item['source_doc']} and {conflicting_item['source_doc']}. Staff verification required."
                })
            else:
                for item in items:
                    cross_doc_agreement_map[id(item)] = True

    # Assemble final field payloads with signals & confidence
    enriched_fields = []
    for item in extracted_fields:
        doc = item["source_doc"]
        page = item["page"]
        snippet = item["snippet"]
        page_text = all_pages_text.get(doc, {}).get(page, "")

        # Signal 1: snippet_found
        snippet_found = snippet in page_text

        # Signal 2: format_valid
        val = item["value"]
        f_name = item["field"]
        format_valid = True
        if f_name in ["admission_date", "discharge_date"]:
            format_valid = bool(re.match(r"^\d{4}-\d{2}-\d{2}$", val))
        elif f_name == "patient_id":
            format_valid = bool(re.match(r"^SYN-\d+$", val))
        elif f_name == "icd10_code":
            format_valid = bool(re.match(r"^[A-Z]\d{2}(\.\w+)?$", val))
        elif f_name == "claim_amount":
            format_valid = bool(re.search(r"\d", val))
        else:
            format_valid = len(str(val).strip()) > 0

        # Signal 3: cross_doc_agree
        cross_agree = cross_doc_agreement_map.get(id(item), "not applicable")

        signals = {
            "snippet_found": snippet_found,
            "format_valid": format_valid,
            "cross_doc_agree": cross_agree
        }

        # Calculate failures over applicable signals
        applicable_failures = 0
        if not snippet_found:
            applicable_failures += 1
        if not format_valid:
            applicable_failures += 1
        if cross_agree is False:
            applicable_failures += 1

        # Determine confidence
        if not snippet_found or applicable_failures >= 2:
            confidence = "low"
            status = "needs_review"
        elif applicable_failures == 1:
            confidence = "medium"
            status = "needs_review"
        else:
            confidence = "high"
            status = "verified"

        enriched_fields.append({
            "field": item["field"],
            "value": item["value"],
            "source_doc": item["source_doc"],
            "page": item["page"],
            "snippet": item["snippet"],
            "signals": signals,
            "confidence": confidence,
            "status": status,
        })

    return enriched_fields, conflicts

