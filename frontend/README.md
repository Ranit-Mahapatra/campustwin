# CampusTwin Frontend

Interactive Digital Twin Frontend for the **CampusTwin** platform (SOA IDEATHON 2026 – Problem Statement S18: *Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning*).

---

## 1. Features & Capabilities
* **Interactive GIS Map**: Leaflet.js v1.9.4 with CartoDB Positron basemap. Displays 20 campus zones with live sensor/model confidence styling, risk heatmap overlays, and emergency safe routes.
* **Urban Trends**: Chart.js 24-hour and 7-day environmental patterns for AQI, Temperature, Traffic, and PM2.5.
* **What-if Simulation**: Digital twin simulation for 4 intervention scenarios:
  * 🌳 Plant trees
  * ☂ Shade structures
  * 🚗 Reduce traffic
  * 🏢 Cool roofs
* **Campus Alerts**: Quick alert drawer for extreme heat, poor air quality, and traffic bottlenecks.
* **Priority Ranking**: Top vulnerable campus zones prioritized for intervention.
* **Campus Copilot**: Interactive query interface for natural language exploration of campus environmental risks.

---

## 2. Running the Frontend

The frontend is a standalone single-page application and can be launched directly:

1. **Directly open in browser**:
   Double click `frontend/index.html` or open via browser URL (`file:///.../frontend/index.html`).

2. **Serve via HTTP server**:
   ```bash
   # Using Python built-in server
   python -m http.server 3000 --directory frontend
   ```
