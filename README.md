# CampusTwin — SOA ITER Digital Twin (S18)

> **SOA IDEATHON 2026 – Problem Statement S18**
> *“Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning”*

---

## 1. Project Overview
CampusTwin is an urban digital twin platform designed for the SOA ITER campus to map microclimatic heat exposure, particulate pollution (PM2.5), tree canopy density, and road traffic risks, enabling data-driven cooling intervention simulation (tree planting, shade structures, traffic redirection, and cool roofs).

---

## 2. Repository Layout

```
Campustwin1/
│
├── frontend/                     # Standalone GIS Dashboard & Interactive UI
│   ├── index.html                # Entrypoint dashboard (Leaflet + Chart.js)
│   └── README.md                 # Frontend documentation
│
├── backend/                      # Django REST Framework Service Layer
│   ├── campus_backend/           # Django project configuration & routing
│   ├── twin/                     # Core application (models, views, serializers)
│   ├── manage.py                 # Django management CLI
│   ├── db.sqlite3                # Active SQLite database (zones & roads)
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   └── README.md                 # Backend setup & API documentation
│
├── data/                         # Spatial datasets & schemas
│   ├── raw/                      # Raw sensor feeds and telemetry
│   ├── processed/                # Normalized spatial datasets
│   ├── sample/                   # Reference sample payloads (sample_zones.json)
│   └── README.md                 # Data dictionary & schema guide
│
├── docs/                         # System Documentation
│   ├── architecture/             # Architecture overview & diagrams
│   ├── api/                      # REST API specification
│   ├── data/                     # Data dictionary
│   └── decisions/                # Architecture Decision Records (ADRs)
│
├── scripts/                      # Startup & utility scripts
│   ├── run_backend.bat           # Windows CMD launcher
│   └── run_backend.ps1           # Windows PowerShell launcher
│
├── .gitignore                    # Git ignore configuration
└── README.md                     # Root project documentation
```

---

## 3. Quick Start Guide

### 3.1 Running the Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be available at `http://127.0.0.1:8000/api/`.

### 3.2 Running the Frontend
Open `frontend/index.html` directly in any web browser, or serve via a local server:
```bash
python -m http.server 3000 --directory frontend
```
Navigate to `http://localhost:3000/` in your browser.
