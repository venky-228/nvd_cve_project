import requests
from sqlalchemy.orm import sessionmaker
from database import engine, SessionLocal
from models import CVE
from datetime import datetime

BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"

def parse_date(date_str):
    """Handles different datetime formats from API response."""
    date_formats = ["%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S.%f"]

    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None  # Return None if parsing fails

def fetch_cve_data():
    params = {"startIndex": 0, "resultsPerPage": 100}
    response = requests.get(BASE_URL, params=params)
    data = response.json()

    session = SessionLocal()

    for item in data["vulnerabilities"]:
        cve_info = item["cve"]
        cve_id = cve_info["id"]

        # Check if CVE already exists in the database
        existing_cve = session.query(CVE).filter(CVE.cve_id == cve_id).first()
        if existing_cve:
            print(f"⚠️ Skipping duplicate CVE: {cve_id}")
            continue  # Skip this CVE if it already exists

        # Safely extract CVSS score
        base_score = None
        if "metrics" in cve_info:
            if "cvssMetricV2" in cve_info["metrics"]:
                cvss_list = cve_info["metrics"]["cvssMetricV2"]
                if isinstance(cvss_list, list) and len(cvss_list) > 0:
                    base_score = cvss_list[0]["cvssData"]["baseScore"]

        # Parse dates
        published_date = parse_date(cve_info.get("published", ""))
        last_modified = parse_date(cve_info.get("lastModified", ""))

        # Insert CVE into database
        cve_entry = CVE(
            cve_id=cve_id,
            description=cve_info["descriptions"][0]["value"],
            base_score=base_score,
            published_date=published_date,
            last_modified=last_modified,
        )
        session.add(cve_entry)

    session.commit()
    session.close()
    print("✅ CVE data fetched and stored successfully!")

fetch_cve_data()
