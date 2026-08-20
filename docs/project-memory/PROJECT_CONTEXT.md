# PROJECT CONTEXT — CampusTwin

**Last verified:** 2026-08-20  
**Repository:** https://github.com/Ranit-Mahapatra/campustwin.git  
**Default branch:** `main`  
**Working branch (Ranit):** `feat/ranit-backend`  
**Problem statement:** SOA IDEATHON 2026 — S18 Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning (ITER campus)

## Purpose
CampusTwin maps campus microclimate (temperature, PM2.5/AQI), tree canopy, vulnerability, and road traffic risk so planners can run cooling-intervention what-if simulations and ask rule-based copilot questions.

## Current scope (verified)
- Django REST backend exposing six documented API endpoints under `/api/`
- SQLite persistence with Zone, RoadSegment, SimulationLog models
- Static frontend dashboard (`frontend/index.html`) with embedded sample data (not yet consuming the API)
- Documentation under `docs/` (architecture, API, data dictionary, ADR)

## Architecture (summary)
- **Frontend:** REAL UI with MOCKED/embedded geospatial + simulation logic (Leaflet + Chart.js in one HTML file)
- **Backend:** REAL Django 6.0.8 + DRF 3.18.0 + django-cors-headers
- **Database:** REAL SQLite (`backend/db.sqlite3`) — 20 zones, 5 roads seeded; tracked for demo
- **Trends API:** EMULATED (hardcoded time-series, not sensor history)
- **Copilot API:** PARTIAL / rule-based keyword matcher (not an LLM)
- **AuthN/AuthZ:** MISSING on public API endpoints (prototype/demo posture)

## APIs (implemented)
| Method | Path | Status |
|---|---|---|
| GET | `/api/zones/` | REAL |
| GET | `/api/roads/` | REAL |
| GET | `/api/metrics/` | REAL |
| GET | `/api/trends/?range=24h\|7d` | EMULATED |
| POST | `/api/simulate/` | REAL (factor model) |
| POST | `/api/copilot/` | PARTIAL (rules) |

## Constraints / limitations
- Demo/prototype: `DEBUG` default true, CORS allow-all default true
- No GitHub Actions CI present in repo
- `gh` CLI not installed on this developer machine
- `git fetch`/`pull` currently fail with SSL certificate verification errors on this machine
- Frontend and backend data paths are not yet integrated over HTTP

## Team ownership
| Person | Role |
|---|---|
| Saifullah Ansari | Team Leader / coordination |
| Anushka | Frontend |
| Ahana | Frontend |
| Ranit Mahapatra | Backend + GitHub repository management |
| Pratik Barik | Backend |
| Baidurya Subhalaxmi | Presentation / PPT |
