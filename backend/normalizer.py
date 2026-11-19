import re
from datetime import datetime
from typing import Optional

def normalize_date(date_str: str) -> Optional[str]:
    """
    Normalizes various date string formats into standard ISO YYYY-MM-DD.
    Examples:
      '05 March 2026' -> '2026-03-05'
      '5 March 2026' -> '2026-03-05'
      '05/03/2026' -> '2026-03-05'
      '2026-03-05' -> '2026-03-05'
    """
    if not date_str or not isinstance(date_str, str):
        return None
    
    clean_str = date_str.strip()
    
    # Try common formats
    formats = [
        "%d %B %Y",      # 05 March 2026 / 5 March 2026
        "%d %b %Y",      # 05 Mar 2026
        "%d/%m/%Y",      # 05/03/2026
        "%d-%m-%Y",      # 05-03-2026
        "%Y-%m-%d",      # 2026-03-05
        "%m/%d/%Y",      # Fallback US format if unambiguous
    ]
    
    # Try parsing directly with datetime.strptime
    for fmt in formats:
        try:
            dt = datetime.strptime(clean_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
            
    # Try regex fallback for flexible day month year
    match = re.search(r'(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})', clean_str)
    if match:
        day, month_str, year = match.groups()
        for month_fmt in ["%B", "%b"]:
            try:
                m_dt = datetime.strptime(month_str, month_fmt)
                dt = datetime(int(year), m_dt.month, int(day))
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                pass
                
    return None

