import pytest
from backend.normalizer import normalize_date

def test_date_normalizer_equality():
    # Requirement: "05/03/2026" and "5 March 2026" compare equal
    date_a = normalize_date("05/03/2026")
    date_b = normalize_date("5 March 2026")
    date_c = normalize_date("05 March 2026")
    date_d = normalize_date("2026-03-05")
    
    assert date_a == "2026-03-05"
    assert date_b == "2026-03-05"
    assert date_c == "2026-03-05"
    assert date_d == "2026-03-05"
    assert date_a == date_b == date_c == date_d

def test_date_normalizer_discharge_dates():
    assert normalize_date("08 March 2026") == "2026-03-08"
    assert normalize_date("09 March 2026") == "2026-03-09"

def test_date_normalizer_invalid():
    assert normalize_date("") is None
    assert normalize_date("invalid-date-string") is None
    assert normalize_date(None) is None
