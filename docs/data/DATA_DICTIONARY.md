# CampusTwin Data Dictionary

---

## 1. Entity: Zone (`twin_zone`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | String(10) | Unique identifier (e.g. `Z-01`, `Z-18`) |
| `name` | String(150) | Campus zone / building name |
| `lat` | Float | Latitude coordinate (WGS84) |
| `lng` | Float | Longitude coordinate (WGS84) |
| `temp` | Float | Surface / ambient temperature in °C |
| `pm25` | Integer | Particulate matter PM2.5 in µg/m³ |
| `aqi` | String(20) | AQI category (`Good`, `Moderate`, `Poor`, `Severe`) |
| `confidence` | String(20) | Data source (`sensor` vs `estimate`) |
| `vulnerability`| Integer | Vulnerability index on a 1–10 scale |
| `tree_cover` | Integer | Percentage of tree canopy cover (0–100%) |
| `reason` | String(255) | Exposure / microclimate description |

---

## 2. Entity: RoadSegment (`twin_roadsegment`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `road_id` | String(10) | Unique road segment identifier (e.g. `R-01`) |
| `name` | String(150) | Street / corridor name |
| `from_point` | String(100) | Starting intersection / landmark |
| `to_point` | String(100) | Terminating intersection / landmark |
| `traffic` | Integer | Traffic congestion level (0–100%) |
| `speed` | Integer | Average transit speed in km/h |
| `noise` | Integer | Sound pressure level in dB |
| `risk` | String(10) | Risk assessment level (`LOW`, `MODERATE`, `HIGH`) |
| `coordinates` | JSON | Array of `[lat, lng]` coordinate pairs |

---

## 3. Entity: SimulationLog (`twin_simulationlog`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `zone` | ForeignKey | Target `Zone` |
| `intervention` | String(20) | Type (`trees`, `shade`, `traffic`, `roof`) |
| `intensity` | Integer | Intervention strength (10–100%) |
| `simulated_temp` | Float | Resulting temperature after attenuation |
| `simulated_pm25` | Integer | Resulting PM2.5 after attenuation |
| `created_at` | DateTime | Timestamp of simulation execution |
