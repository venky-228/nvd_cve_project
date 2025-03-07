from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class CVE(Base):
    __tablename__ = "cve_data"

    id = Column(Integer, primary_key=True, index=True)
    cve_id = Column(String, unique=True, nullable=False)
    description = Column(String)
    base_score = Column(Float)
    published_date = Column(DateTime)
    last_modified = Column(DateTime)
