# CampusTwin Backend

Django REST Framework backend for the **CampusTwin** platform (SOA IDEATHON 2026 – Problem Statement S18: *Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning*).

---

## 1. Stack & Architecture
* **Python**: 3.12+
* **Framework**: Django 6.0.8 & Django REST Framework 3.18.0
* **Database**: SQLite (`backend/db.sqlite3`)
* **CORS**: `django-cors-headers`

---

## 2. Setup & Execution

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Migrations
```bash
python manage.py migrate
```

### Start Development Server
```bash
python manage.py runserver 127.0.0.1:8000
```

---

## 3. Available Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/zones/` | List all 20 campus zones with environmental metrics |
| `GET` | `/api/roads/` | List all 5 road segments with traffic/risk attributes |
| `GET` | `/api/metrics/` | Aggregated campus metrics (avg temp, max PM2.5, green cover) |
| `GET` | `/api/trends/?range=24h` | Time-based environmental pattern (24h or 7d) |
| `POST` | `/api/simulate/` | Run what-if cooling/air-quality intervention simulation |
| `POST` | `/api/copilot/` | Rule-based AI Copilot query answering |
