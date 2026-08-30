# CampusTwin — Django REST Framework Backend

Backend API and simulation engine for the **CampusTwin** platform (**SOA IDEATHON 2026 – Problem Statement S18**: *"Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning"*).

---

## 1. Technology Stack
* **Python**: 3.12+ / 3.14
* **Web Framework**: Django 6.0.8 & Django REST Framework 3.18.0
* **CORS Support**: `django-cors-headers` 4.9.0 (`CORS_ALLOW_ALL_ORIGINS = True`)
* **Database**: SQLite 3 (`backend/db.sqlite3`)

---

## 2. Setup & Execution

### 2.1 Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2.2 Database Initialization
```bash
# Run database migrations
python manage.py migrate

# Validate Django configuration
python manage.py check
```

### 2.3 Starting the Development Server
```bash
python manage.py runserver 127.0.0.1:8000
```
Or use the launcher scripts from the root directory:
* Windows CMD: `scripts\run_backend.bat`
* Windows PowerShell: `scripts\run_backend.ps1`

---

## 3. REST API Specifications

Base URL: `http://127.0.0.1:8000/api/`

### 3.1 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/zones/` | Returns all 20 campus zones with coordinates, readings, vulnerability, and canopy cover. |
| `GET` | `/api/roads/` | Returns all 5 road segments with traffic %, speed, noise, risk, and polyline coordinates. |
| `GET` | `/api/metrics/` | Aggregated campus metrics (`avg_temp`, `max_pm25`, `avg_green_cover`, `risk_zones_count`). |
| `GET` | `/api/trends/?range=24h` | Time-series trend patterns (`range=24h` or `range=7d`) for AQI, temp, traffic, and PM2.5. |
| `POST` | `/api/simulate/` | Computes cooling intervention impacts and logs results to `SimulationLog`. |
| `POST` | `/api/copilot/` | Rule-based natural language spatial query answering. |

---

### 3.2 Simulation Engine Logic

When a `POST` request is sent to `/api/simulate/`:
```json
{
  "zone_code": "Z-18",
  "intervention": "trees",
  "intensity": 50
}
```

The engine applies the physical attenuation model:
$$\Delta T = \left(\frac{\text{Intensity}}{100}\right) \times \text{Factor}_{\text{temp}}$$
$$\Delta PM_{2.5} = \text{round}\left(\left(\frac{\text{Intensity}}{100}\right) \times \text{Factor}_{PM}\right)$$

**Response (200 OK)**:
```json
{
  "zone_code": "Z-18",
  "simulated_temp": 34.0,
  "simulated_pm25": 74,
  "temp_drop": 2.0,
  "pm_drop": 9
}
```
Each simulation execution is logged into the `SimulationLog` table with a timestamp for auditing.
