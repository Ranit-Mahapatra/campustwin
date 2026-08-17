# CampusTwin System Architecture

**Problem Statement S18**: *Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning (SOA IDEATHON 2026)*

---

## 1. High-Level Architecture

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|  - Leaflet GIS (CartoDB Tiles) : 20 Zones, 5 Roads, Heatmaps, Routes    |
|  - Chart.js Visualizations     : 24h / 7d AQI, Temp, Traffic, PM2.5     |
|  - Digital Twin Simulator      : Trees, Shade, Traffic, Cool Roofs      |
|  - Campus Copilot              : Rule-based query assistant             |
+-------------------------------------------------------------------------+
                                    : (Future HTTP/REST integration)
                                    v
+-------------------------------------------------------------------------+
|                            BACKEND (DRF)                                |
|  - ZoneListAPIView       : GET /api/zones/                              |
|  - RoadListAPIView       : GET /api/roads/                              |
|  - CampusMetricsAPIView  : GET /api/metrics/                            |
|  - TrendDataAPIView      : GET /api/trends/?range=24h                   |
|  - SimulationAPIView     : POST /api/simulate/                          |
|  - CopilotAPIView        : POST /api/copilot/                           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            PERSISTENCE                                  |
|  - SQLite (backend/db.sqlite3)                                          |
|    * twin_zone, twin_roadsegment, twin_simulationlog                    |
+-------------------------------------------------------------------------+
```

---

## 2. Component Decomposition

### 2.1 Spatial Engine & UI (Frontend)
* Single-page modular dashboard built in standard web technologies.
* Renders geospatial point layers (`L.circleMarker`) for campus zones, with visual differentiation for live sensors vs model estimates.
* Polyline street network overlay with color-coded traffic risk (High, Moderate, Low).
* Interactive range controls and metric selectors dynamically redrawing Chart.js canvases.

### 2.2 API & Business Logic Layer (Backend)
* Django REST Framework views implementing aggregation (`Avg`, `Max`), filtering, and calculation algorithms.
* Simulation engine computing temperature and PM2.5 attenuation based on physical intervention factors.
* Logs each simulation run into `SimulationLog` with timestamps for historical tracking and planning analysis.
