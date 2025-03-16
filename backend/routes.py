from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from models import CVE
from fastapi import HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime


app = FastAPI(
    title="NVD CVE API",
    description="API for accessing and filtering CVE (Common Vulnerabilities and Exposures) data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compute the absolute path to the 'frontend' folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
frontend_path = os.path.join(BASE_DIR, "..", "frontend")
print("Static files directory:", frontend_path)

# Mount static files
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(frontend_path, "index.html"))

@app.get("/styles.css")
async def get_css():
    return FileResponse(os.path.join(frontend_path, "styles.css"), media_type="text/css")

@app.get("/script.js")
async def get_js():
    return FileResponse(os.path.join(frontend_path, "script.js"), media_type="application/javascript")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/cves/list")
def get_cves_list(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=10, le=100),
    base_score_min: float = Query(None),
    base_score_max: float = Query(None),
    published_after: str = Query(None),
    published_before: str = Query(None),
    search_term: str = Query(None)
):
    query = db.query(CVE)
    
    # Add this before the filters to see what data exists
    print("Sample data in database:")
    sample = db.query(CVE).limit(5).all()
    for cve in sample:
        print(f"CVE: {cve.cve_id}, Score: {cve.base_score}, Published: {cve.published_date}")
    
    # Apply filters
    if base_score_min is not None:
        query = query.filter(CVE.base_score >= base_score_min)
    if base_score_max is not None:
        query = query.filter(CVE.base_score <= base_score_max)
    if published_after:
        try:
            after_date = datetime.strptime(published_after, "%Y-%m-%d")
            query = query.filter(CVE.published_date >= after_date)
        except ValueError:
            pass
    if published_before:
        try:
            before_date = datetime.strptime(published_before, "%Y-%m-%d")
            query = query.filter(CVE.published_date <= before_date)
        except ValueError:
            pass
    if search_term:
        query = query.filter(CVE.description.ilike(f"%{search_term}%"))
    
    # Add debug logging
    print(f"Total records before pagination: {query.count()}")
    print(f"Applied filters: score_min={base_score_min}, score_max={base_score_max}")
    print(f"Date range: {published_after} to {published_before}")
    
    total_records = query.count()
    offset = (page - 1) * per_page
    cves = query.offset(offset).limit(per_page).all()
    
    return {
        "total_records": total_records,
        "current_page": page,
        "per_page": per_page,
        "cves": cves
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
templates = Jinja2Templates(directory="templates")  # Points to the new templates folder

@app.get("/cves/{cve_id}", response_class=HTMLResponse)
async def serve_cve_details_page(request: Request, cve_id: str, db: Session = Depends(get_db)):
    # Get the templates from app state
    templates = request.app.state.templates
    
    # Query the database
    cve = db.query(CVE).filter(CVE.cve_id == cve_id).first()
    if not cve:
        raise HTTPException(status_code=404, detail="CVE not found")
    
    # Render the template
    return templates.TemplateResponse(
        "cve_details.html",
        {
            "request": request,  # Required by Jinja2Templates
            "cve_id": cve.cve_id,
            "description": cve.description,
            "base_score": cve.base_score,
            "published_date": cve.published_date,
            "last_modified": cve.last_modified
        }
    )
