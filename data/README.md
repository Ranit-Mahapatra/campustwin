# CampusTwin Data Architecture

This directory organizes data assets, sample payloads, and ingestion pipelines for SOA IDEATHON 2026 Problem Statement S18.

---

## Directory Structure
* `raw/`: Unprocessed sensor telemetry feeds, raw satellite data, and road network traces.
* `processed/`: Calibrated, cleaned, and geocoded spatial datasets.
* `sample/`: Reference payloads and sample geoJSON/JSON structures matching the digital twin schema.

---

## Data Schemas

### Campus Zone Schema
```json
{
  "code": "Z-01",
  "name": "Health Care Center",
  "lat": 20.248564,
  "lng": 85.801532,
  "temp": 33.0,
  "pm25": 52,
  "aqi": "Good",
  "confidence": "sensor",
  "vulnerability": 6,
  "treeCover": 25,
  "reason": "Well shaded, low exposure"
}
```

### Road Segment Schema
```json
{
  "id": "R-01",
  "name": "Main Gate Road",
  "from_point": "ITER Main Gate",
  "to_point": "Parking Lot",
  "traffic": 86,
  "speed": 18,
  "noise": 72,
  "risk": "HIGH",
  "coordinates": [[20.249881, 85.801412], [20.249637, 85.800384]]
}
```
