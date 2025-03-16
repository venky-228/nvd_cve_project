from fastapi import FastAPI
import uvicorn
from routes import app
from fetch_data import initialize_scheduler
from fastapi.templating import Jinja2Templates
from pathlib import Path

# Initialize the scheduler to run every hour
#initialize_scheduler(interval_seconds=10)  # Changed from 24 to 1 for hourly sync
initialize_scheduler(interval_hours=1)
# Initialize templates with the correct path
templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))

# Make templates available to routes
app.state.templates = templates

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
