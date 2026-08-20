# CampusTwin — Spatial Data Architecture

Spatial data dictionary, reference schemas, and dataset inventory for the **CampusTwin** platform (**SOA IDEATHON 2026 – Problem Statement S18**).

---

## 1. Directory Structure
* `raw/`: Unprocessed sensor telemetry feeds, raw satellite data, and road network traces.
* `processed/`: Normalized, geocoded, and validated spatial layers.
* `sample/`: Reference payloads (`sample_zones.json`) used for seeding SQLite database and client-side demo datasets.

---

## 2. Dataset Inventories

### 2.1 Campus Zones (20 Discrete Areas)
Campus coordinates bounding box centered at `[20.2493289, 85.8011446]` (SOA ITER Campus).

| Code | Zone Name | Latitude | Longitude | Temp (°C) | PM2.5 | AQI | Canopy (%) | Vulnerability | Data Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Z-01` | Health Care Center | 20.248564 | 85.801532 | 33.0 | 52 | Good | 25 | 6/10 | Live Sensor |
| `Z-02` | Parking Lot | 20.249637 | 85.800384 | 38.0 | 114 | Severe | 7 | 10/10 | Live Sensor |
| `Z-03` | Punjab National Bank | 20.248738 | 85.801605 | 37.0 | 86 | Moderate | 11 | 10/10 | Model Estimate |
| `Z-04` | BCA/MCA Department | 20.248535 | 85.800425 | 33.0 | 63 | Good | 30 | 6/10 | Live Sensor |
| `Z-05` | Administrative Block (B Block) | 20.249755 | 85.802040 | 34.0 | 51 | Moderate | 22 | 7/10 | Live Sensor |
| `Z-06` | Central Library | 20.248145 | 85.802286 | 29.0 | 40 | Good | 52 | 2/10 | Model Estimate |
| `Z-07` | Center of Data Science (CDS) | 20.249420 | 85.801369 | 35.0 | 53 | Moderate | 27 | 8/10 | Live Sensor |
| `Z-08` | Bansuri Guru Auditorium | 20.249830 | 85.801269 | 35.0 | 70 | Moderate | 24 | 8/10 | Live Sensor |
| `Z-09` | F Block | 20.250344 | 85.800293 | 32.0 | 51 | Good | 28 | 5/10 | Model Estimate |
| `Z-10` | S Block | 20.249776 | 85.800993 | 34.0 | 61 | Moderate | 27 | 7/10 | Live Sensor |
| `Z-11` | ITER Girls' Hostel | 20.248372 | 85.801636 | 40.0 | 101 | Severe | 12 | 10/10 | Live Sensor |
| `Z-12` | ITER Boys' Hostel | 20.249255 | 85.801125 | 39.0 | 94 | Severe | 5 | 10/10 | Model Estimate |
| `Z-13` | Sports Complex Block | 20.248728 | 85.800167 | 35.0 | 61 | Moderate | 25 | 8/10 | Live Sensor |
| `Z-14` | E Block | 20.249073 | 85.801334 | 35.0 | 66 | Good | 20 | 8/10 | Live Sensor |
| `Z-15` | Garden | 20.249984 | 85.801979 | 28.0 | 35 | Good | 52 | 1/10 | Model Estimate |
| `Z-16` | Outdoor Cricket Turf | 20.250090 | 85.800380 | 36.0 | 59 | Moderate | 19 | 9/10 | Live Sensor |
| `Z-17` | Cafeteria | 20.249827 | 85.801576 | 38.0 | 94 | Severe | 9 | 10/10 | Live Sensor |
| `Z-18` | ITER Main Gate | 20.249881 | 85.801412 | 36.0 | 83 | Moderate | 14 | 10/10 | Model Estimate |
| `Z-19` | C Block | 20.248479 | 85.800335 | 34.0 | 45 | Moderate | 26 | 7/10 | Live Sensor |
| `Z-20` | A Block | 20.248372 | 85.801789 | 33.0 | 58 | Moderate | 25 | 6/10 | Live Sensor |

---

### 2.2 Road Corridors (5 Major Streets)

| ID | Corridor Name | From $\to$ To | Traffic (%) | Speed (km/h) | Noise (dB) | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `R-01` | Main Gate Road | ITER Main Gate $\to$ Parking Lot | 86% | 18 | 72 | `HIGH` |
| `R-02` | Academic Road | A Block $\to$ CDS Block | 61% | 27 | 64 | `MODERATE` |
| `R-03` | Hostel Road | Girls' Hostel $\to$ Boys' Hostel | 73% | 22 | 69 | `HIGH` |
| `R-04` | Library Road | Central Library $\to$ Garden | 34% | 35 | 51 | `LOW` |
| `R-05` | Sports Road | Sports Complex $\to$ Cricket Turf | 48% | 31 | 57 | `MODERATE` |
