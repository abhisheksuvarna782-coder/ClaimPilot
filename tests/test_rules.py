import pytest
from backend.rules import (
    evaluate_doc04_admission_note,
    evaluate_date01_intra_doc_dates,
    evaluate_xdoc01_cross_doc_dates,
    evaluate_icd01_code,
)

def test_rule_doc04():
    # When no admission note document is uploaded -> Missing
    res_missing = evaluate_doc04_admission_note(["discharge_summary.pdf", "claim_form.pdf"])
    assert res_missing["rule_id"] == "DOC-04"
    assert res_missing["result"] == "Missing"
    assert res_missing["rule_status"] == "simulated"
    assert "No admission note found" in res_missing["explanation"]

    # When admission note is uploaded -> Pass
    res_pass = evaluate_doc04_admission_note(["discharge_summary.pdf", "admission_note.pdf"])
    assert res_pass["result"] == "Pass"
    assert res_pass["rule_status"] == "simulated"

def test_rule_date01():
    # When discharge is on/after admission in both documents -> Pass
    valid_fields = [
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "discharge_summary.pdf"},
        {"field": "discharge_date", "value": "2026-03-08", "source_doc": "discharge_summary.pdf"},
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "claim_form.pdf"},
        {"field": "discharge_date", "value": "2026-03-09", "source_doc": "claim_form.pdf"},
    ]
    res_pass = evaluate_date01_intra_doc_dates(valid_fields)
    assert res_pass["rule_id"] == "DATE-01"
    assert res_pass["result"] == "Pass"
    assert res_pass["rule_status"] == "simulated"
    # Verify reported documents checked
    assert "discharge_summary.pdf" in res_pass["explanation"]
    assert "claim_form.pdf" in res_pass["explanation"]

    # When discharge precedes admission -> Fail
    invalid_fields = [
        {"field": "admission_date", "value": "2026-03-08", "source_doc": "discharge_summary.pdf"},
        {"field": "discharge_date", "value": "2026-03-05", "source_doc": "discharge_summary.pdf"},
    ]
    res_fail = evaluate_date01_intra_doc_dates(invalid_fields)
    assert res_fail["result"] == "Fail"

def test_rule_xdoc01():
    # Conflicting discharge dates across documents -> Conflict
    conflicting_fields = [
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "discharge_summary.pdf"},
        {"field": "discharge_date", "value": "2026-03-08", "source_doc": "discharge_summary.pdf"},
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "claim_form.pdf"},
        {"field": "discharge_date", "value": "2026-03-09", "source_doc": "claim_form.pdf"},
    ]
    res_conflict = evaluate_xdoc01_cross_doc_dates(conflicting_fields)
    assert res_conflict["rule_id"] == "XDOC-01"
    assert res_conflict["result"] == "Conflict"
    assert res_conflict["rule_status"] == "simulated"
    assert "Discharge dates differ" in res_conflict["explanation"]

    # Agreeing dates -> Pass
    agreeing_fields = [
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "discharge_summary.pdf"},
        {"field": "discharge_date", "value": "2026-03-08", "source_doc": "discharge_summary.pdf"},
        {"field": "admission_date", "value": "2026-03-05", "source_doc": "claim_form.pdf"},
        {"field": "discharge_date", "value": "2026-03-08", "source_doc": "claim_form.pdf"},
    ]
    res_pass = evaluate_xdoc01_cross_doc_dates(agreeing_fields)
    assert res_pass["result"] == "Pass"

def test_rule_icd01():
    sample_catalog = {
        "K35.80": {"description": "Unspecified acute appendicitis", "category": "Digestive"}
    }
    
    # Valid code in catalog -> Pass
    res_pass = evaluate_icd01_code([{"field": "icd10_code", "value": "K35.80"}], sample_catalog)
    assert res_pass["rule_id"] == "ICD-01"
    assert res_pass["result"] == "Pass"
    assert res_pass["rule_status"] == "simulated"

    # Unknown code -> Fail
    res_fail = evaluate_icd01_code([{"field": "icd10_code", "value": "Z99.999"}], sample_catalog)
    assert res_fail["result"] == "Fail"

    # Missing code -> Missing
    res_missing = evaluate_icd01_code([], sample_catalog)
    assert res_missing["result"] == "Missing"
