# ARCHITECTURE STATE

**Last verified:** 2026-08-20  
**Branch:** `feat/ranit-backend`

## Classification legend
`REAL` · `MOCKED` · `STUBBED` · `EMULATED` · `PARTIAL` · `MISSING`

## Frontend
| Component | Classification | Notes |
|---|---|---|
| GIS dashboard UI | REAL | `frontend/index.html` Leaflet map |
| Zone/road data source | MOCKED | Hardcoded JS arrays, not fetched from API |
| Charts / trends UI | REAL UI + EMULATED series | Client-side trend arrays |
| Simulation UI | REAL UI + client-side factors | Mirrors backend factor model locally |
| Copilot UI | REAL UI + PARTIAL rules | Keyword matching in browser |
| HTTP client to Django | MISSING | No `fetch`/`axios` to `/api/` |

## Backend
| Component | Classification | Notes |
|---|---|---|
| Django project | REAL | `campus_backend` |
| DRF API views | REAL | `twin/views.py` |
| Serializers / validation | REAL | Zone/Road + Simulation/Copilot input serializers |
| ORM models | REAL | Zone, RoadSegment, SimulationLog |
| Migrations | REAL | `0001_initial` applied |
| Simulation engine | REAL (simple factors) | Deterministic intervention factors |
| Trends endpoint | EMULATED | Hardcoded 24h/7d dictionaries |
| Copilot endpoint | PARTIAL | Rule-based NLP substitute |
| Authentication | MISSING | Open endpoints |
| Authorization / IDOR controls | MISSING / N/A for shared campus demo data | No per-user ownership model yet |
| Rate limiting | MISSING | |

## API
All six documented routes registered under `path('api/', include('twin.urls'))` — **REAL routing**.

## Database
| Item | Classification | Notes |
|---|---|---|
| SQLite engine | REAL | `backend/db.sqlite3` |
| Seeded campus data | REAL demo data | 20 zones, 5 roads |
| Production DB / backups | MISSING | |
| Credentialized remote DB | MISSING | Not configured |

## Data
| Path | Classification |
|---|---|
| `data/sample/sample_zones.json` | REAL sample artifact |
| `data/raw`, `data/processed` | STUBBED (`.gitkeep`) |

## External services
| Service | Classification |
|---|---|
| Live campus sensors | MISSING / MOCKED in UI confidence flags |
| LLM provider | MISSING |
| Firebase / GCP / blockchain | MISSING (not in this S18 scope) |

## CI/CD
| Item | Classification |
|---|---|
| GitHub Actions | MISSING |
| Local validate-before-commit | REAL (scripts + pre-commit hook) |

## Validation
| Gate | Classification |
|---|---|
| 12-point local script | REAL |
| Pre-commit hook | REAL (local `.git/hooks/pre-commit`) |
| Persistent project memory | REAL (`docs/project-memory/`) |
| Private memory | REAL local + gitignored |
