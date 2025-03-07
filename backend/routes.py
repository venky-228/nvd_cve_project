from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from models import CVE
from fastapi import HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.staticfiles import StaticFiles
import os


app = FastAPI()
# Compute the absolute path to the 'frontend' folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
frontend_path = os.path.join(BASE_DIR, "..", "frontend")
print("Static files directory:", frontend_path)  # For debugging

# Mount the static files directory
app.mount("/static", StaticFiles(directory=frontend_path), name="static")
templates = Jinja2Templates(directory="templates")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/cves/list")  # Ensure this is correct
def get_cves_list(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=10, le=100, description="Results per page")
):
    """Fetch CVEs with pagination"""
    
    total_records = db.query(CVE).count()  # Count total CVEs
    offset = (page - 1) * per_page  # Calculate pagination offset
    
    cve_list = db.query(CVE).offset(offset).limit(per_page).all()

    return {
        "total_records": total_records,
        "current_page": page,
        "per_page": per_page,
        "cves": cve_list  # Ensure this key is correct
    }
'''
@app.get("/cves/{cve_id}")
def get_cve_details(cve_id: str, db: Session = Depends(get_db)):
    cve = db.query(CVE).filter(CVE.cve_id == cve_id).first()
    if not cve:
        raise HTTPException(status_code=404, detail="CVE not found")
    
    return {
        "cve_id": cve.cve_id,
        "description": cve.description,
        "base_score": cve.base_score,
        "published_date": cve.published_date,
        "last_modified": cve.last_modified,
    }
'''
@app.get("/cves/{cve_id}", response_class=HTMLResponse)
async def serve_cve_details_page(request: Request, cve_id: str, db: Session = Depends(get_db)):
    """Serve CVE details as an HTML page"""
    cve = db.query(CVE).filter(CVE.cve_id == cve_id).first()
    if not cve:
        raise HTTPException(status_code=404, detail="CVE not found")
    print(f"Serving details for CVE: {cve.cve_id}")
    print(f"Description: {cve.description}, Score: {cve.base_score}, Published Date: {cve.published_date}")
    return templates.TemplateResponse(
        "cve_details.html", 
        {
            "request": request,
            "cve_id": cve.cve_id,
            "description": cve.description,
            "base_score": cve.base_score or "N/A",
            "published_date": cve.published_date or "N/A",
            "last_modified": cve.last_modified or "N/A",
        }
    )
