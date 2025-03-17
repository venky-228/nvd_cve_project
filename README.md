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




"# Updated_nvd_cve_project" 

**database.py**
This file (database.py) sets up the SQLite database connection using SQLAlchemy. It determines the database file path, creates an engine to connect to the database, and initializes a session factory (SessionLocal) for executing queries. Additionally, it defines a base class (Base) for ORM models and stores metadata about the database schema.

**fetch_data.py**
This script fetches CVE (Common Vulnerabilities and Exposures) data from the NVD API, processes it, and stores it in an SQLite database while avoiding duplicates. It extracts relevant details like CVE ID, description, CVSS score, and timestamps, ensuring proper data formatting. Additionally, a scheduler is set up to periodically fetch and update the CVE data at specified intervals.

**initialize_db.py**
This script initializes the database by creating the necessary tables based on the models defined in the Base class. It connects to the database using the engine and executes the table creation if they do not already exist. A confirmation message is printed upon successful initialization.

**main.py**
This script initializes a FastAPI application, sets up a scheduler to fetch CVE data every hour, and configures Jinja2 templates for rendering HTML pages. It also ensures that the templates are accessible in routes and starts the FastAPI server using Uvicorn on port 8000 when executed as the main program.

**models.py**
This script defines a SQLAlchemy model for storing CVE data in a database table named "cve_data". The CVE class includes fields for storing CVE ID, description, CVSS base score, published date, and last modified date. It also sets an ID as the primary key and ensures that each CVE ID is unique.

**routes.py**
This FastAPI application serves as a backend for managing and retrieving CVE data, offering endpoints for filtering and accessing detailed CVE information. It integrates with an SQLite database, applies filters based on CVSS score, date, and search terms, and serves static frontend files. Additionally, it includes CORS configuration, Jinja2 template rendering for CVE details, and structured API responses for data retrieval.

**cve_details.js**
This JavaScript code listens for the page's DOMContentLoaded event and then fetches CVE details from the FastAPI backend based on the CVE ID. It retrieves the CVE ID either from the URL parameters or from the HTML content, makes an API request, and updates the page with the retrieved CVE details. If the CVE is not found, it displays an error message with a "Go Back" button.

**index.html**
This HTML page provides an interface to view and filter CVE data. It includes a table displaying CVE records, filter options (score range, date range, and search term), pagination controls, and a dropdown to adjust results per page. A script (script.js) handles fetching and updating data dynamically based on user input.

**script.js**
This JavaScript code manages pagination, filtering, and data fetching for displaying CVE records on a webpage. It allows users to filter results by base score, publication date, and search terms, with real-time updates and validation. The script also handles error messages, clears filters, and enables dynamic navigation between pages.

**cve_details.html**
This HTML template displays detailed information for a specific CVE, including its ID, description, base score, published date, and last modified date. If no CVE details are available, it shows a "No CVE details found" message. A "Go Back" button allows users to return to the previous page.

