# CampusTwin — Interactive Frontend Dashboard

Interactive Geospatial Digital Twin Dashboard for the **CampusTwin** platform (**SOA IDEATHON 2026 – Problem Statement S18**: *"Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning"*).

---

## 1. Overview & Architecture

The frontend is a lightweight, zero-build single-page web application engineered with Vanilla HTML5, CSS3, and modern JavaScript (ES6+). It utilizes:
* **Leaflet.js (v1.9.4)**: Interactive geospatial mapping with CartoDB Positron basemap tiles centered on SOA ITER Campus (`[20.2493289, 85.8011446]`).
* **Chart.js (v4.x)**: Responsive time-series environmental trend visualization.

---

## 2. Key Modules & Features

### 2.1 Geospatial Map & Hotspot Visualization
* **20 Campus Zones (`Z-01` to `Z-20`)**: Circle markers color-coded by AQI severity:
  * 🟢 **Good**: `#4ade80`
  * 🟡 **Moderate**: `#f5b942`
  * 🟠 **Poor**: `#fb923c`
  * 🔴 **Severe**: `#ef4444`
* **Data Confidence Symbology**:
  * **Solid White Border**: Verified live hardware sensor reading (`confidence: "sensor"`).
  * **Dashed Border**: Modeled / satellite estimate (`confidence: "estimate"`).
* **5 Road Segments (`R-01` to `R-05`)**: Polyline corridors showing traffic intensity, speed, noise (dB), and risk levels (High, Moderate, Low).
* **Vulnerability Risk Buffers**: Dynamic 45m radius highlight rings for zones with vulnerability score $\ge 8/10$.
* **Emergency Evacuation Routes**: Incident-to-safe-destination corridor routing.

### 2.2 Temporal Trend Analytics
* Dual timeframes: **24 Hours** (hourly campus pattern) and **7 Days** (weekly pattern).
* 4 switchable environmental metrics: **AQI**, **Temperature (°C)**, **Traffic (%)**, and **PM2.5 ($\mu\text{g/m}^3$)**.
* Dynamic calculations of peak values, averages, percentage changes, and lows.

### 2.3 Digital Twin "What-If" Simulation Panel
Run interactive scenario simulations with an intensity slider (10% to 100%) across 4 physical interventions:
* 🌳 **Plant Trees**: Up to $-4.0^\circ\text{C}$ temperature drop and $-18\,\mu\text{g/m}^3$ PM2.5 reduction.
* ☂ **Shade Structures**: Up to $-3.0^\circ\text{C}$ temperature drop and $-10\,\mu\text{g/m}^3$ PM2.5 reduction.
* 🚗 **Reduce Traffic**: Up to $-2.0^\circ\text{C}$ temperature drop and $-22\,\mu\text{g/m}^3$ PM2.5 reduction.
* 🏢 **Cool Roofs**: Up to $-3.0^\circ\text{C}$ temperature drop and $-5\,\mu\text{g/m}^3$ PM2.5 reduction.

### 2.4 Decision Support & AI Assistant
* **Campus Priority Ranking**: Automatically calculates and ranks the top 6 highest vulnerability zones.
* **Campus Alerts**: Quick navigation buttons for heat warnings, air quality spikes, and traffic congestion.
* **Campus Copilot**: Natural language query assistant for air quality, tree cover, temperature, and simulations.

---

## 3. Quick Start & Execution

### Option A: Local HTTP Server (Recommended)
```bash
# From workspace root
python -m http.server 3000 --directory frontend
```
Navigate to `http://127.0.0.1:3000` in your web browser.

### Option B: Direct Browser Open
Simply double-click `frontend/index.html` or open directly in any browser.
