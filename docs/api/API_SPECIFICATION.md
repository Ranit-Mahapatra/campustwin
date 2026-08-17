# CampusTwin REST API Specification

---

## Base URL
`http://127.0.0.1:8000/api`

---

## Endpoints

### 1. Zone List
* **Method**: `GET`
* **Path**: `/zones/`
* **Response**: `200 OK` (Array of Zone objects)

### 2. Road Segment List
* **Method**: `GET`
* **Path**: `/roads/`
* **Response**: `200 OK` (Array of RoadSegment objects)

### 3. Campus Metrics
* **Method**: `GET`
* **Path**: `/metrics/`
* **Response**: `200 OK`
```json
{
  "avg_temp": 34.7,
  "max_pm25": 114,
  "avg_green_cover": 23,
  "risk_zones_count": 11,
  "traffic_status": "HIGH"
}
```

### 4. Trend Data
* **Method**: `GET`
* **Path**: `/trends/?range=24h` (or `range=7d`)
* **Response**: `200 OK`

### 5. Intervention Simulation
* **Method**: `POST`
* **Path**: `/simulate/`
* **Payload**:
```json
{
  "zone_code": "Z-18",
  "intervention": "trees",
  "intensity": 50
}
```
* **Response**: `200 OK`
```json
{
  "zone_code": "Z-18",
  "simulated_temp": 34.0,
  "simulated_pm25": 74,
  "temp_drop": 2.0,
  "pm_drop": 9
}
```

### 6. Copilot Natural Language Query
* **Method**: `POST`
* **Path**: `/copilot/`
* **Payload**:
```json
{
  "question": "Which area needs trees?"
}
```
* **Response**: `200 OK`
```json
{
  "answer": "The priority area for green intervention is ITER Boys' Hostel with 5% tree cover and vulnerability 10/10."
}
```
