# CampusTwin — SOA ITER Digital Twin (S18)

> **SOA IDEATHON 2026 – Problem Statement S18**  
> *“Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning”*  
> **Target Campus**: Siksha 'O' Anusandhan (SOA) ITER Campus, Bhubaneswar, Odisha, India  
> **Repository**: [Ranit-Mahapatra/campustwin](https://github.com/Ranit-Mahapatra/campustwin)  

---

## 1. Project Overview

**CampusTwin** is an integrated geospatial digital twin platform built for the SOA ITER campus to map hyperlocal microclimatic heat exposure, particulate pollution ($PM_{2.5}$), tree canopy density, and road traffic stress. It enables campus administrators, planners, and sustainability teams to execute data-driven cooling intervention simulations—including urban tree planting, shade structures, vehicular traffic restrictions, and reflective cool roofs.

---

## 2. System Architecture & Repository Layout

```
campustwin/
│
├── frontend/                     # Interactive Spatial GIS Dashboard (Client-Side)
│   ├── index.html                # Single-page GIS & Analytical Dashboard (Leaflet + Chart.js)
│   └── README.md                 # Frontend architecture and usage documentation
│
├── backend/                      # Service & Analytics Layer (Django REST Framework)
│   ├── campus_backend/           # Core Django configuration & URL routing
│   │   ├── settings.py           # Application settings, CORS, and DB configuration
│   │   └── urls.py               # Top-level URL routing ('/api/' -> twin.urls)
│   ├── twin/                     # Core Digital Twin Django App
│   │   ├── models.py             # ORM Data Models (Zone, RoadSegment, SimulationLog)
│   │   ├── serializers.py        # DRF Model & Input Serializers
│   │   ├── urls.py               # REST API Endpoint definitions
│   │   └── views.py              # Business logic, aggregation & simulation algorithms
│   ├── db.sqlite3                # Persistent SQLite database seeded with campus records
│   ├── manage.py                 # Django management CLI
│   ├── requirements.txt          # Python dependencies (Django, DRF, django-cors-headers)
│   ├── .env.example              # Environment variables template
│   └── README.md                 # Backend documentation
│
├── data/                         # Spatial Datasets & Schemas
│   ├── raw/                      # Raw sensor feeds and telemetry archive (.gitkeep)
│   ├── processed/                # Normalized spatial datasets (.gitkeep)
│   ├── sample/                   # Reference payloads (sample_zones.json - 20 campus zones)
│   └── README.md                 # Spatial data dictionary and documentation
│
├── docs/                         # System Documentation & Architecture Ledger
│   ├── AI_PROJECT_CONTEXT.md     # Authoritative Project Context, Analysis & System Ledger
│   ├── api/                      # REST API specifications (API_SPECIFICATION.md)
│   ├── architecture/             # Architecture overview diagrams (ARCHITECTURE.md)
│   ├── data/                     # Data dictionary (DATA_DICTIONARY.md)
│   └── decisions/                # Architecture Decision Records (ADRs)
│
├── scripts/                      # Convenience Run Scripts
│   ├── run_backend.bat           # Windows CMD launcher for backend server
│   └── run_backend.ps1           # Windows PowerShell launcher for backend server
│
├── .gitignore                    # Git ignore configuration
└── README.md                     # Root project documentation
```

---

## 3. Technology Stack

* **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+), Leaflet.js v1.9.4, CartoDB Positron Tiles, Chart.js v4.x
* **Backend**: Python 3.14 / 3.12+, Django 6.0.8, Django REST Framework 3.18.0, `django-cors-headers` 4.9.0
* **Persistence**: SQLite 3 (`backend/db.sqlite3`)
* **Spatial Reference**: EPSG:4326 (WGS 84), Center: `[20.2493289, 85.8011446]`

---

## 4. Quick Start Guide

### 4.1 Running the Backend API Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be live at `http://127.0.0.1:8000/api/`.

### 4.2 Running the Frontend Dashboard
```bash
# In a separate terminal from workspace root:
python -m http.server 3000 --directory frontend
```
Navigate to `http://127.0.0.1:3000/` in your browser.

---

## 5. REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/zones/` | List all 20 campus zones with coordinates and metrics |
| `GET` | `/api/roads/` | List 5 road segments with traffic %, speed, noise, risk |
| `GET` | `/api/metrics/` | Aggregated campus metrics (`avg_temp`, `max_pm25`, `avg_green_cover`, `risk_zones_count`) |
| `GET` | `/api/trends/?range=24h` | Time-series trend arrays for AQI, temperature, traffic, PM2.5 (`24h` or `7d`) |
| `POST` | `/api/simulate/` | Execute what-if cooling intervention simulation and log results |
| `POST` | `/api/copilot/` | Rule-based natural language spatial query answering |

---

## 6. Project Context & AI Documentation
For detailed system analysis, data dictionaries, simulation mathematics, and development ledgers, refer to:
* 📄 [`docs/AI_PROJECT_CONTEXT.md`](docs/AI_PROJECT_CONTEXT.md)
* 📄 [`docs/api/API_SPECIFICATION.md`](docs/api/API_SPECIFICATION.md)
* 📄 [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
* 📄 [`docs/data/DATA_DICTIONARY.md`](docs/data/DATA_DICTIONARY.md)
