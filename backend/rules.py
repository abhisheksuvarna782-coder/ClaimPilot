import os
import csv
from typing import List, Dict, Any, Optional

VALID_STATUSES = {"Pass", "Fail", "Missing", "Conflict", "Unable to verify"}

def load_icd10_sample_codes(csv_path: Optional[str] = None) -> Dict[str, Dict[str, str]]:
    """
    Loads sample ICD-10 codes from the sample CSV.
    Skips comment lines starting with '#'.
    """
    if csv_path is None:
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets", "icd10_sample.csv")
    
    codes = {}
    if not os.path.exists(csv_path):
        return codes

    with open(csv_path, "r", encoding="utf-8") as f:
        # Filter out comment lines
        lines = [l for l in f if not l.strip().startswith("#")]
        reader = csv.DictReader(lines)
        for row in reader:
            code = row.get("code", "").strip()
            if code:
                codes[code] = {
                    "description": row.get("description", "").strip(),
                    "category": row.get("category", "").strip()
                }
    return codes

def evaluate_doc04_admission_note(available_docs: List[str]) -> Dict[str, Any]:
    """
    DOC-04: Admission note must be present.
    Returns 'Missing' if no admission note document is found.
    """
    has_admission_note = any("admission" in d.lower() and "note" in d.lower() for d in available_docs)
    
    if has_admission_note:
        return {
            "rule_id": "DOC-04",
            "description": "Admission note must be present",
            "result": "Pass",
            "rule_status": "simulated",
            "fields_used": [],
            "explanation": "Admission note was identified in the uploaded document package.",
            "action": "None required. Admission note is present."
        }
    else:
        return {
            "rule_id": "DOC-04",
            "description": "Admission note must be present",
            "result": "Missing",
            "rule_status": "simulated",
            "fields_used": [],
            "explanation": "No admission note found in uploaded documents.",
            "action": "Upload the admission note and rerun validation."
        }

def evaluate_date01_intra_doc_dates(extracted_fields: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    DATE-01: Discharge date is not before admission date.
    Checks each document's own dates and reports which documents were checked.
    """
    # Group fields by document
    docs_dates: Dict[str, Dict[str, str]] = {}
    for f in extracted_fields:
        if f["field"] in ["admission_date", "discharge_date"]:
            doc = f["source_doc"]
            docs_dates.setdefault(doc, {})[f["field"]] = f["value"]

    if not docs_dates:
        return {
            "rule_id": "DATE-01",
            "description": "Discharge date is not before admission date",
            "result": "Missing",
            "rule_status": "simulated",
            "fields_used": ["admission_date", "discharge_date"],
            "explanation": "Neither admission date nor discharge date was found in any document.",
            "action": "Provide documents with readable admission and discharge dates."
        }

    doc_reports = []
    has_failure = False
    has_missing_in_doc = False

    for doc, dates in docs_dates.items():
        adm = dates.get("admission_date")
        dis = dates.get("discharge_date")
        if adm and dis:
            doc_reports.append(f"{doc} (admission: {adm}, discharge: {dis})")
            if dis < adm:
                has_failure = True
        else:
            has_missing_in_doc = True
            doc_reports.append(f"{doc} (incomplete dates)")

    if has_failure:
        return {
            "rule_id": "DATE-01",
            "description": "Discharge date is not before admission date",
            "result": "Fail",
            "rule_status": "simulated",
            "fields_used": ["admission_date", "discharge_date"],
            "explanation": f"Discharge date precedes admission date. Checked: {'; '.join(doc_reports)}.",
            "action": "Correct the inverted admission or discharge date in the record."
        }

    if not doc_reports or has_missing_in_doc and len(doc_reports) == 1:
        return {
            "rule_id": "DATE-01",
            "description": "Discharge date is not before admission date",
            "result": "Unable to verify",
            "rule_status": "simulated",
            "fields_used": ["admission_date", "discharge_date"],
            "explanation": f"Incomplete date pairs encountered. Checked: {'; '.join(doc_reports)}.",
            "action": "Ensure complete admission and discharge dates exist on all documents."
        }

    return {
        "rule_id": "DATE-01",
        "description": "Discharge date is not before admission date",
        "result": "Pass",
        "rule_status": "simulated",
        "fields_used": ["admission_date", "discharge_date"],
        "explanation": f"Checked {'; '.join(doc_reports)}. In each document, discharge date is on or after admission date.",
        "action": "None required. Date chronological order verified."
    }

def evaluate_xdoc01_cross_doc_dates(extracted_fields: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    XDOC-01: Admission and discharge dates agree across documents.
    """
    adm_by_doc: Dict[str, str] = {}
    dis_by_doc: Dict[str, str] = {}

    for f in extracted_fields:
        if f["field"] == "admission_date":
            adm_by_doc[f["source_doc"]] = f["value"]
        elif f["field"] == "discharge_date":
            dis_by_doc[f["source_doc"]] = f["value"]

    # Check distinct values across documents
    unique_adm = set(adm_by_doc.values())
    unique_dis = set(dis_by_doc.values())

    if len(adm_by_doc) <= 1 and len(dis_by_doc) <= 1:
        return {
            "rule_id": "XDOC-01",
            "description": "Admission and discharge dates agree across documents",
            "result": "Unable to verify",
            "rule_status": "simulated",
            "fields_used": ["admission_date", "discharge_date"],
            "explanation": "Insufficient multi-document date data to perform cross-document comparison.",
            "action": "Upload at least two documents containing hospitalization dates."
        }

    conflicts = []
    if len(unique_adm) > 1:
        details = ", ".join([f"{doc}: {val}" for doc, val in adm_by_doc.items()])
        conflicts.append(f"Admission dates differ ({details})")

    if len(unique_dis) > 1:
        details = ", ".join([f"{doc}: {val}" for doc, val in dis_by_doc.items()])
        conflicts.append(f"Discharge dates differ ({details})")

    if conflicts:
        return {
            "rule_id": "XDOC-01",
            "description": "Admission and discharge dates agree across documents",
            "result": "Conflict",
            "rule_status": "simulated",
            "fields_used": ["admission_date", "discharge_date"],
            "explanation": f"Date conflict across documents: {'; '.join(conflicts)}.",
            "action": "Staff verification required to reconcile discharge dates between clinical summary and claim form."
        }

    return {
        "rule_id": "XDOC-01",
        "description": "Admission and discharge dates agree across documents",
        "result": "Pass",
        "rule_status": "simulated",
        "fields_used": ["admission_date", "discharge_date"],
        "explanation": "Admission and discharge dates are identical across all uploaded documents.",
        "action": "None required. Cross-document dates are concordant."
    }

def evaluate_icd01_code(extracted_fields: List[Dict[str, Any]], icd_catalog: Optional[Dict[str, Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    ICD-01: ICD-10 code exists in the sample CSV.
    """
    if icd_catalog is None:
        icd_catalog = load_icd10_sample_codes()

    icd_fields = [f for f in extracted_fields if f["field"] == "icd10_code"]
    if not icd_fields:
        return {
            "rule_id": "ICD-01",
            "description": "ICD-10 code exists in the sample CSV",
            "result": "Missing",
            "rule_status": "simulated",
            "fields_used": ["icd10_code"],
            "explanation": "No ICD-10 diagnosis code was extracted from the submitted records.",
            "action": "Ensure the clinical discharge summary contains an ICD-10 diagnosis code."
        }

    code = icd_fields[0]["value"].strip()
    if code in icd_catalog:
        desc = icd_catalog[code]["description"]
        return {
            "rule_id": "ICD-01",
            "description": "ICD-10 code exists in the sample CSV",
            "result": "Pass",
            "rule_status": "simulated",
            "fields_used": ["icd10_code"],
            "explanation": f"Extracted code {code} found in reference ICD-10 dataset ({desc}).",
            "action": "None required. Valid diagnosis code verified."
        }
    else:
        return {
            "rule_id": "ICD-01",
            "description": "ICD-10 code exists in the sample CSV",
            "result": "Fail",
            "rule_status": "simulated",
            "fields_used": ["icd10_code"],
            "explanation": f"Extracted ICD-10 code '{code}' does not exist in the prototype reference catalog.",
            "action": "Verify diagnosis code format or update reference catalog."
        }

def run_all_rules(
    available_docs: List[str],
    extracted_fields: List[Dict[str, Any]],
    icd_catalog: Optional[Dict[str, Dict[str, str]]] = None
) -> List[Dict[str, Any]]:
    """
    Executes the deterministic rules suite:
    - DOC-04: admission note present
    - DATE-01: discharge date is not before admission date
    - XDOC-01: admission and discharge dates agree across documents
    - ICD-01: ICD-10 code exists in the sample CSV
    """
    return [
        evaluate_doc04_admission_note(available_docs),
        evaluate_date01_intra_doc_dates(extracted_fields),
        evaluate_xdoc01_cross_doc_dates(extracted_fields),
        evaluate_icd01_code(extracted_fields, icd_catalog),
    ]
