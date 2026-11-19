import pytest
from backend.main import (
    app,
    health_check,
    get_document_page_text,
    analyze_synthetic_documents,
    SYNTHETIC_BANNER,
)

def test_api_banner_and_health():
    data = health_check()
    assert data["status"] == "healthy"
    assert data["banner"] == SYNTHETIC_BANNER

def test_api_get_page_text():
    data = get_document_page_text("discharge_summary.pdf", 1)
    assert data["document"] == "discharge_summary.pdf"
    assert data["page"] == 1
    assert "Patient ID: SYN-0001" in data["text"]

def test_api_analyze_expected_results():
    payload = analyze_synthetic_documents()

    # 1. Banner must be present exactly
    assert payload["banner"] == SYNTHETIC_BANNER

    # 2. Verify rule_results match expected states:
    # Expected: DOC-04 Missing, DATE-01 Pass, XDOC-01 Conflict, ICD-01 Pass
    rule_map = {r["rule_id"]: r for r in payload["rule_results"]}
    
    assert rule_map["DOC-04"]["result"] == "Missing"
    assert rule_map["DOC-04"]["rule_status"] == "simulated"

    assert rule_map["DATE-01"]["result"] == "Pass"
    assert rule_map["DATE-01"]["rule_status"] == "simulated"

    assert rule_map["XDOC-01"]["result"] == "Conflict"
    assert rule_map["XDOC-01"]["rule_status"] == "simulated"

    assert rule_map["ICD-01"]["result"] == "Pass"
    assert rule_map["ICD-01"]["rule_status"] == "simulated"

    # 3. Verify fields have source_doc, page, snippet, signals, confidence
    for field in payload["fields"]:
        assert "field" in field
        assert "value" in field
        assert "source_doc" in field
        assert "page" in field
        assert "snippet" in field
        assert len(field["snippet"]) > 0
        assert "signals" in field
        assert "confidence" in field
        assert field["confidence"] in ["high", "medium", "low"]
        assert field["status"] in ["verified", "needs_review"]

    # 4. Verify conflicts contains the deliberate discharge date discrepancy
    assert len(payload["conflicts"]) == 1
    conflict = payload["conflicts"][0]
    assert conflict["field"] == "discharge_date"
    assert conflict["a"]["value"] == "2026-03-08"
    assert conflict["b"]["value"] == "2026-03-09"
