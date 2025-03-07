## Overview
This project provides a web-based tool for fetching, storing, and visualizing CVE (Common Vulnerabilities and Exposures) data from the NVD (National Vulnerability Database) API. It includes a backend built with FastAPI and an interactive frontend for viewing and filtering CVE details.

## Features
- Fetch CVE data from the NVD API and store it in an SQLite database.
- View CVE details in a user-friendly web interface.
- Search and filter vulnerabilities based on different criteria.
- RESTful API for accessing CVE data programmatically.

## Project Structure
```
/your_project
│── backend
│   │── database.py        # Database connection and models
│   │── models.py          # ORM models for CVE storage
│   │── fetch_data.py      # Script to fetch and store CVE data
│   │── initialize_db.py   # Database initialization script
│   │── main.py            # FastAPI server entry point
│   │── routes.py          # API routes for handling CVE data
│   │── requirements.txt   # Python dependencies
│── templates/
│   ├── cve_details.html   # HTML template for CVE details page
│── frontend/     
│   ├── styles.css         # Frontend styles
│   ├── cve_details.js     # JavaScript for CVE details page
│   ├── index.html         # Main UI for listing CVEs
│   ├── script.js          # JavaScript for handling UI interactions
```

## Installation & Setup
### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/nvd_cve_project.git
cd nvd_cve_project
```

### **2. Set Up a Virtual Environment**
```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### **3. Install Dependencies**
```sh
pip install -r backend/requirements.txt
```

### **4. Initialize the Database**
```sh
python backend/initialize_db.py
```

### **5. Fetch CVE Data from NVD API**
```sh
python backend/fetch_data.py
```

### **6. Start the FastAPI Server**
```sh
uvicorn backend.main:app --reload
```

### **7. Open the Web Interface**
Open the html file(index.html) in the web browser 
```

## API Endpoints
| Method | Endpoint         | Description                        |
|--------|---------- -------|------------------------------------|
| GET    | `/cves`          |  Retrieve all CVEs                 |
| GET    | `/cves/{cve_id}` | Retrieve details of a specific CVE |
| POST   | `/fetch_cves`    | Fetch and store CVE data from NVD  |




