# CampusTwin — AI Project Context, Complete System Analysis & Memory Ledger

> **Problem Statement S18 (SOA IDEATHON 2026)**:  
> *"Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning"*  
> **Target Campus**: Siksha 'O' Anusandhan (SOA) ITER Campus, Bhubaneswar, Odisha, India  
> **Repository**: [Ranit-Mahapatra/campustwin](https://github.com/Ranit-Mahapatra/campustwin)  
> **Target Branch**: `main`  
> **Designated File Location**: `docs/AI_PROJECT_CONTEXT.md`  
> **Document Last Updated**: 2026-08-20T15:31:00+05:30  
> **Status**: Verified, Active, and Operational  

---

## 1. Project Identity & Problem Statement

* **Project Name**: CampusTwin
* **Problem Code**: S18 (SOA IDEATHON 2026)
* **Domain**: Hyperlocal Urban Microclimate Modeling, Air Quality ($PM_{2.5}$), Tree Canopy Assessment, Traffic Stress Analysis, and Urban Cooling Intervention Planning.
* **Target Geographic Area**: SOA ITER Campus, Khandagiri, Bhubaneswar, Odisha, India (Coordinates: `[20.2493289, 85.8011446]`).

### Problem Context & Mission
Urban campus environments suffer from localized microclimatic heat islands, high vehicular particulate concentration ($PM_{2.5}$), and low vegetative shading. CampusTwin provides campus administrators, planners, and emergency coordinators with a real-time digital twin interface to:
1. **Map Hyperlocal Environmental Hotspots**: Track temperature, particulate matter, air quality index, tree canopy density, and road traffic stress across 20 distinct campus zones and 5 transit corridors.
2. **Differentiate Telemetry Confidence**: Visually distinguish between verified physical sensor feeds (`confidence: "sensor"`) and satellite/modeled estimates (`confidence: "estimate"`).
3. **Simulate Cooling Interventions**: Run interactive "what-if" simulations for urban interventions—such as planting trees, erecting shade structures, redirecting traffic, or installing cool reflective roofs.
4. **Emergency Evacuation Planning**: Route emergency vehicles and pedestrians through low-exposure, unblocked corridors during extreme heat or pollution alerts.

---

## 2. Repository Layout & File Architecture

```
campustwin/
│
├── frontend/                     # Interactive Spatial GIS Dashboard (Client-Side)
│   ├── index.html                # Single-page GIS & Analytical Dashboard (Leaflet + Chart.js)
│   └── README.md                 # Frontend architecture and usage documentation
│
├── backend/                      # Service & Analytics Layer (Django REST Framework)
│   ├── campus_backend/           # Core Django configuration & URL routing
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py           # Application settings, CORS, and DB configuration
│   │   ├── urls.py               # Top-level URL routing ('/api/' -> twin.urls)
│   │   └── wsgi.py
│   ├── twin/                     # Core Digital Twin Django App
│   │   ├── __init__.py
│   │   ├── admin.py              # Django Admin interface
│   │   ├── apps.py               # App configuration
│   │   ├── migrations/           # Database migration history (0001_initial.py)
│   │   ├── models.py             # ORM Data Models (Zone, RoadSegment, SimulationLog)
│   │   ├── serializers.py        # DRF Model & Input Serializers
│   │   ├── tests.py              # Unit & integration test placeholders
│   │   ├── urls.py               # REST API Endpoint definitions
│   │   └── views.py              # Business logic, aggregation & simulation algorithms
│   ├── db.sqlite3                # Persistent SQLite database seeded with campus records
│   ├── manage.py                 # Django management CLI
│   ├── requirements.txt          # Python dependencies (Django, DRF, django-cors-headers)
│   ├── .env.example              # Environment variables template
│   └── README.md                 # Backend documentation
│
├── data/                         # Spatial Datasets & Payloads
│   ├── raw/                      # Raw sensor feeds and telemetry archive (.gitkeep)
│   ├── processed/                # Normalized spatial datasets (.gitkeep)
│   ├── sample/                   # Reference payloads (sample_zones.json - 20 campus zones)
│   └── README.md                 # Spatial data dictionary and documentation
│
├── docs/                         # System Documentation & Architecture Ledger
│   ├── AI_PROJECT_CONTEXT.md     # [THIS FILE] Unified Project Context, Analysis & System Ledger
│   ├── api/                      # REST API specifications (API_SPECIFICATION.md)
│   ├── architecture/             # Architecture overview diagrams (ARCHITECTURE.md)
│   ├── data/                     # Data dictionary (DATA_DICTIONARY.md)
│   └── decisions/                # Architecture Decision Records (ADRs)
│
├── scripts/                      # Convenience Run Scripts
│   ├── run_backend.bat           # Windows CMD launcher for backend server
│   └── run_backend.ps1           # Windows PowerShell launcher for backend server
│
├── .gitignore                    # Git ignore configuration (Python, venv, .ai-memory, logs)
└── README.md                     # Root project documentation
```

---

## 3. Technology Stack & Operational Environment

| Layer | Technologies / Libraries | Purpose & Configuration |
| :--- | :--- | :--- |
| **Runtime Environment** | Python 3.14.0 (Windows x64) | Core backend runtime |
| **Backend Framework** | Django 6.0.8, Django REST Framework 3.18.0 | RESTful API endpoints, ORM modeling, aggregation |
| **CORS Middleware** | `django-cors-headers` 4.9.0 | Cross-Origin Resource Sharing enabled (`CORS_ALLOW_ALL_ORIGINS = True`) |
| **Database** | SQLite 3 (`backend/db.sqlite3`) | Persistent storage for 20 zones, 5 road segments, simulation logs |
| **Frontend UI** | HTML5, Vanilla CSS3 (Custom Design System), ES6 JS | Lightweight, high-performance responsive interface |
| **GIS Mapping** | Leaflet.js v1.9.4 + CartoDB Positron Tiles | Campus spatial rendering, marker styling, polylines, circle buffers |
| **Data Visualizations**| Chart.js v4.x | Dynamic dual-range (24h/7d) time-series analysis charts |
| **Development Servers**| `python manage.py runserver 127.0.0.1:8000`<br>`python -m http.server 3000 --directory frontend` | Backend API service & Static Frontend web server |

---

## 4. In-Depth Component Analysis

### 4.1 Frontend GIS & Analytics Dashboard (`frontend/index.html`)
The frontend is a standalone, responsive web application with zero external build dependencies:
1. **Interactive Leaflet Map**:
   - Centered on ITER Campus coordinates (`[20.2493289, 85.8011446]`) with zoom level 17.
   - **Zone Markers**: 20 distinct campus zones rendered as `L.circleMarker`. Color-coded by AQI severity (`#4ade80` Good, `#f5b942` Moderate, `#fb923c` Poor, `#ef4444` Severe).
   - **Sensor vs. Estimate Indicator**: Solid white marker borders represent live sensor nodes (`confidence: 'sensor'`); dashed borders represent modeled/estimated metrics (`confidence: 'estimate'`).
   - **Road Network Layer**: 5 major campus road polylines (`R-01` to `R-05`) styled with traffic-risk colors.
   - **Risk Buffers**: 45m red circular highlight zones for areas with vulnerability score $\ge 8$.
   - **Emergency Evacuation Routes**: Incident-to-safe-haven route generation (`showRoute()`).
2. **Top-Level KPI Metrics Banner**:
   - Computes dynamic averages and extremes: Average Temperature, Peak $PM_{2.5}$, Campus Traffic Status, Average Green Canopy Cover %, and Flagged Risk Zones.
3. **Temporal Trend Analytics Module**:
   - Dual time ranges: **24 Hours** (hourly campus pattern) and **7 Days** (daily pattern).
   - 4 selectable metrics: **AQI**, **Temperature**, **Traffic**, and **$PM_{2.5}$**.
   - Computes peak value, average, percentage change, and minimum values.
4. **Digital Twin "What-If" Simulation Panel**:
   - Allows selecting any zone and testing 4 interventions:
     - 🌳 **Plant Trees**: $-4.0^\circ\text{C}$ / $-18\,\mu\text{g/m}^3$ max attenuation
     - ☂ **Shade Structures**: $-3.0^\circ\text{C}$ / $-10\,\mu\text{g/m}^3$ max attenuation
     - 🚗 **Reduce Traffic**: $-2.0^\circ\text{C}$ / $-22\,\mu\text{g/m}^3$ max attenuation
     - 🏢 **Cool Roofs**: $-3.0^\circ\text{C}$ / $-5\,\mu\text{g/m}^3$ max attenuation
   - Features an interactive intensity slider (10%–100%) and displays projected post-intervention cooling and air quality gains with animated graphical meters.
5. **Campus Priority Intervention Ranking**:
   - Automatically computes and ranks the top 6 highest vulnerability zones across campus.
6. **Campus Copilot Natural Language Assistant**:
   - Interactive prompt assistant answering questions regarding tree cover, pollution hot spots, heat exposure, traffic congestion, and recommendations.

### 4.2 Backend DRF Services & Endpoints (`backend/twin/`)

| Endpoint | Method | Input Parameters / Payload | Output Description |
| :--- | :--- | :--- | :--- |
| `/api/zones/` | `GET` | None | Returns JSON array of all 20 campus zones with coordinates, readings, vulnerability, and canopy. |
| `/api/roads/` | `GET` | None | Returns JSON array of 5 road segments with traffic %, speed, noise dB, risk, and polyline coordinates. |
| `/api/metrics/` | `GET` | None | Aggregated campus stats: `avg_temp`, `max_pm25`, `avg_green_cover`, `risk_zones_count`, `traffic_status`. |
| `/api/trends/` | `GET` | `?range=24h` or `?range=7d` | Time-series data arrays for `aqi`, `temp`, `traffic`, and `pm25` with timestamp labels. |
| `/api/simulate/` | `POST` | `{"zone_code": "Z-18", "intervention": "trees", "intensity": 50}` | Calculates physical reduction, saves record into `SimulationLog`, and returns simulated readings. |
| `/api/copilot/` | `POST` | `{"question": "Which area needs trees?"}` | Analyzes query intent and generates rule-based spatial recommendations from database records. |

### 4.3 Simulation Mathematics & Physics Model
The backend and frontend simulation logic follows the linear attenuation model:
$$\Delta T = \left(\frac{\text{Intensity}}{100}\right) \times \text{Factor}_{\text{temp}}$$
$$\Delta PM_{2.5} = \text{round}\left(\left(\frac{\text{Intensity}}{100}\right) \times \text{Factor}_{PM}\right)$$
$$T_{\text{simulated}} = \max(20.0^\circ\text{C},\, T_{\text{current}} - \Delta T)$$
$$PM_{2.5,\text{simulated}} = \max(5\,\mu\text{g/m}^3,\, PM_{2.5,\text{current}} - \Delta PM_{2.5})$$

---

## 5. Campus Spatial Data Inventory

### 5.1 Campus Zones Summary (20 Areas)
1. **Z-01 Health Care Center** (33°C, PM2.5 52, AQI Good, Canopy 25%, Vuln 6/10) - *Sensor*
2. **Z-02 Parking Lot** (38°C, PM2.5 114, AQI Severe, Canopy 7%, Vuln 10/10) - *Sensor*
3. **Z-03 Punjab National Bank** (37°C, PM2.5 86, AQI Moderate, Canopy 11%, Vuln 10/10) - *Estimate*
4. **Z-04 BCA/MCA Department** (33°C, PM2.5 63, AQI Good, Canopy 30%, Vuln 6/10) - *Sensor*
5. **Z-05 Administrative Block (B Block)** (34°C, PM2.5 51, AQI Moderate, Canopy 22%, Vuln 7/10) - *Sensor*
6. **Z-06 Central Library** (29°C, PM2.5 40, AQI Good, Canopy 52%, Vuln 2/10) - *Estimate*
7. **Z-07 Center of Data Science (CDS Block)** (35°C, PM2.5 53, AQI Moderate, Canopy 27%, Vuln 8/10) - *Sensor*
8. **Z-08 Bansuri Guru Auditorium** (35°C, PM2.5 70, AQI Moderate, Canopy 24%, Vuln 8/10) - *Sensor*
9. **Z-09 F Block** (32°C, PM2.5 51, AQI Good, Canopy 28%, Vuln 5/10) - *Estimate*
10. **Z-10 S Block** (34°C, PM2.5 61, AQI Moderate, Canopy 27%, Vuln 7/10) - *Sensor*
11. **Z-11 ITER Girls' Hostel** (40°C, PM2.5 101, AQI Severe, Canopy 12%, Vuln 10/10) - *Sensor*
12. **Z-12 ITER Boys' Hostel** (39°C, PM2.5 94, AQI Severe, Canopy 5%, Vuln 10/10) - *Estimate*
13. **Z-13 Sports Complex Block** (35°C, PM2.5 61, AQI Moderate, Canopy 25%, Vuln 8/10) - *Sensor*
14. **Z-14 E Block** (35°C, PM2.5 66, AQI Good, Canopy 20%, Vuln 8/10) - *Sensor*
15. **Z-15 Garden** (28°C, PM2.5 35, AQI Good, Canopy 52%, Vuln 1/10) - *Estimate*
16. **Z-16 Outdoor Cricket Turf** (36°C, PM2.5 59, AQI Moderate, Canopy 19%, Vuln 9/10) - *Sensor*
17. **Z-17 Cafeteria** (38°C, PM2.5 94, AQI Severe, Canopy 9%, Vuln 10/10) - *Sensor*
18. **Z-18 ITER Main Gate** (36°C, PM2.5 83, AQI Moderate, Canopy 14%, Vuln 10/10) - *Estimate*
19. **Z-19 C Block** (34°C, PM2.5 45, AQI Moderate, Canopy 26%, Vuln 7/10) - *Sensor*
20. **Z-20 A Block** (33°C, PM2.5 58, AQI Moderate, Canopy 25%, Vuln 6/10) - *Sensor*

### 5.2 Campus Road Segments (5 Corridors)
- **R-01 Main Gate Road** (ITER Main Gate $\to$ Parking Lot, Traffic: 86%, Speed: 18 km/h, Noise: 72 dB, Risk: HIGH)
- **R-02 Academic Road** (A Block $\to$ CDS Block, Traffic: 61%, Speed: 27 km/h, Noise: 64 dB, Risk: MODERATE)
- **R-03 Hostel Road** (Girls' Hostel $\to$ Boys' Hostel, Traffic: 73%, Speed: 22 km/h, Noise: 69 dB, Risk: HIGH)
- **R-04 Library Road** (Central Library $\to$ Garden, Traffic: 34%, Speed: 35 km/h, Noise: 51 dB, Risk: LOW)
- **R-05 Sports Road** (Sports Complex $\to$ Cricket Turf, Traffic: 48%, Speed: 31 km/h, Noise: 57 dB, Risk: MODERATE)

---

## 6. Known Limitations & Planned Roadmap

### 6.1 Current Limitations
* **Simulated Telemetry**: Data is currently seeded in SQLite from reference datasets (`data/sample/sample_zones.json`) rather than physical hardware sensor streams.
* **Empirical Attenuation Model**: The cooling simulation uses calibrated linear attenuation coefficients rather than dynamic computational fluid dynamics (CFD) microclimate models.
* **Client-Side Fallback**: The frontend contains localized datasets ensuring full offline and standalone demonstration capability even if the backend is disconnected.

### 6.2 Planned Future Roadmap
* Direct ingestion of low-cost hardware sensor mesh telemetry (MQTT / WebSockets).
* Integration with Sentinel-2 / Landsat-8 thermal satellite indices.
* Automated pytest and DRF integration test suite.
* 3D building envelope and shadow casting analysis.

---

## 7. Git Workflow & AI Development Rules

### 7.1 Git Workflow & Cleanliness
* Always run `git status` before initiating commits.
* Never commit or push `.env`, `.ai-memory/`, virtual environments (`.venv/`, `venv/`), or SQLite runtime journal files.
* Preserve existing code structure and inline documentation when modifying files.

### 7.2 How a New AI Agent Should Start
1. **Read this file first** ([`docs/AI_PROJECT_CONTEXT.md`](AI_PROJECT_CONTEXT.md)).
2. Read the relevant technical documents in [`docs/`](./).
3. Check Git branch and status with `git status`.
4. Validate backend state with `python manage.py check` before making modifications.
5. Apply atomic, verified code edits.
6. Record all changes in the **Session History & Change Log (Section 8.2)** below.

---

## 8. Continuous Update Protocol & Session Memory Ledger

### 8.1 Memory & Context Tracking
* **Active Working Branch**: `main`
* **Python Environment**: Python 3.14.0 (Windows)
* **Backend Packages Installed**: `Django==6.0.8`, `djangorestframework==3.18.0`, `django-cors-headers==4.9.0`, `asgiref==3.12.1`, `sqlparse==0.6.0`, `tzdata==2026.3`
* **Database State**: SQLite database `backend/db.sqlite3` validated and healthy with 20 Zone models, 5 RoadSegment models, and active SimulationLog relations.
* **Server Ports**:
  - Backend API: `http://127.0.0.1:8000` (API base: `http://127.0.0.1:8000/api/`)
  - Frontend Web: `http://127.0.0.1:3000` (or direct file load)

### 8.2 Session History & Change Log

| Session / Timestamp | Operator / Agent | Actions & Changes Executed | Outcome & Impact |
| :--- | :--- | :--- | :--- |
| **2026-08-20 15:10 IST** | Antigravity AI Assistant | • Full project audit & codebase inspection.<br>• Verified all frontend/backend/data/docs files.<br>• Installed missing Python dependencies via pip (`django`, `djangorestframework`, `django-cors-headers`).<br>• Validated Django setup (`python manage.py check` returned 0 issues).<br>• Verified database migration state & model records. | Environment configured and system fully validated. |
| **2026-08-20 15:18 IST** | Antigravity AI Assistant | • Launched Django REST Framework backend server on `http://127.0.0.1:8000`.<br>• Launched frontend HTTP dashboard server on `http://127.0.0.1:3000`.<br>• Launched dashboard in local browser (`Start-Process http://127.0.0.1:3000`).<br>• Verified active background services and live connectivity. | Frontend and backend services active and open in browser. |
| **2026-08-20 15:28 IST** | Antigravity AI Assistant | • Consolidated project analysis, physics models, component breakdowns, and AI guidelines into unified `AI_PROJECT_CONTEXT.md`.<br>• Updated Python runtime version to 3.14.0 and documented live server states.<br>• Positioned file in designated `docs/` documentation directory. | Authoritative context ledger established in designated `docs/` directory. |
| **2026-08-20 15:48 IST** | Antigravity AI Assistant | • Upgraded and modernized all README files across `README.md`, `frontend/README.md`, `backend/README.md`, and `data/README.md`.<br>• Enhanced documentation with API tables, physics formulas, and spatial zone inventories. | All subproject documentation synchronized with system architecture. |

### 8.3 Mandatory Continuous Update Protocol

> [!IMPORTANT]
> **MANDATORY INSTRUCTION FOR ALL FUTURE SESSIONS**:
> Whenever any code, database schema, API endpoint, UI component, or architecture detail is modified:
> 1. Open and review `docs/AI_PROJECT_CONTEXT.md`.
> 2. Update the relevant sections with new changes, new endpoints, or updated data models.
> 3. Add a new row to the **Session History & Change Log (Section 8.2)** documenting the exact changes, operator, and timestamp.
> 4. Ensure `docs/AI_PROJECT_CONTEXT.md` remains the authoritative, up-to-date single source of truth for the entire repository.

---

## 9. Quick Launch Runbook

### 9.1 Launching the Backend Server
```bash
# From workspace root:
cd backend
python manage.py runserver 127.0.0.1:8000
```

### 9.2 Launching the Frontend Application
```bash
# In a separate terminal from workspace root:
python -m http.server 3000 --directory frontend
```
Navigate to `http://127.0.0.1:3000` in any web browser.
