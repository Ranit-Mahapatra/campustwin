# CampusTwin — AI Project Context

## Project Identity
* Name: CampusTwin
* Problem: S18 — Hyperlocal Urban Heat and Air-Quality Digital Twin for Cooling Intervention Planning
* Repository target: https://github.com/Ranit-Mahapatra/campustwin
* Default branch: main

## Problem Statement
This project is a demo digital twin for a campus-scale microclimate planning interface. It maps heat stress, PM2.5 exposure, tree cover, and mobility stress, then shows simple what-if intervention scenarios for shade, trees, cool roofs, and traffic reduction.

## Product Objective
The current local version is a static prototype for demonstration and ideation. It aims to show map-based heat and air-quality hotspots, temporal trends, risk prioritization, and a simulation panel for cooling interventions.

## Current Architecture
* Frontend: [frontend/index.html](../frontend/index.html)
* Backend: [backend](../backend)
* Database: [backend/db.sqlite3](../backend/db.sqlite3)
* Data reference: [data](../data)
* Documentation: [docs](../docs)
* Startup scripts: [scripts](../scripts)

## Technology Stack
* Python 3.12.7
* Django 6.0.8
* Django REST Framework 3.18.0
* django-cors-headers 4.9.0
* SQLite
* Leaflet.js and Chart.js in the browser

## Current Project Status
* Frontend loads and initializes successfully in a browser.
* Backend starts successfully and serves the API.
* Database is seeded with sample campus data.
* The project is a demo prototype, not a live sensor system.
* GitHub push readiness is currently blocked by repository cleanliness and missing remote setup.

## Completed Work
* Confirmed the stack from the current repository.
* Verified backend Django checks and migration state.
* Confirmed all core API endpoints respond successfully.
* Verified the static frontend page loads with the expected dashboard elements.
* Ensured private AI memory stays under [.ai-memory](../.ai-memory) and is Git-ignored.

## Active Work
* Fresh audit of repository readiness.
* Git status and remote verification.
* Documentation verification for AI continuation.

## Known Limitations
* No real low-cost sensor integration.
* No satellite ingestion.
* No mobility or building-form modeling.
* No live uncertainty or forecast engine.
* No formal automated test suite.
* No configured Git remote in the current repo.

## Planned Work
* Cleanly stage only intentional repository files.
* Configure a remote before any push.
* Add real tests and live integration only in a future development phase.

## API Structure
* GET /api/zones/
* GET /api/roads/
* GET /api/metrics/
* GET /api/trends/?range=24h or 7d
* POST /api/simulate/
* POST /api/copilot/

## Data Strategy
The project currently uses seeded demo data stored in SQLite and static arrays in the front end. This is suitable for demonstration, but it is not real-world telemetry or production-grade sensor data.

## Important Decisions
* Keep current behavior intact during the audit.
* Do not add new integrations or features.
* Keep AI memory private and ignored by Git.
* Treat this as a prototype rather than a production deployment.

## Git Workflow
* Use `git status` before any commit.
* Do not commit or push `.env`, `.ai-memory`, `venv`, or cache files.
* Only push after remote configuration and repository cleanliness are resolved.

## Development Rules
* Read this file first.
* Then read the relevant documentation in [docs](../docs).
* Verify Git state and backend checks.
* Only then make a change.

## How a New AI Agent Should Start
1. Read [docs/AI_PROJECT_CONTEXT.md](AI_PROJECT_CONTEXT.md).
2. Read the relevant docs in [docs](../docs).
3. Run `git status`.
4. Inspect the repo structure.
5. Check the branch and remote.
6. Verify the backend with `python manage.py check`.
7. Only then modify code.
