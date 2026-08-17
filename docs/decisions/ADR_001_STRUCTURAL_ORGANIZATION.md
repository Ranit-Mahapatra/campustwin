# ADR 001: Structural Organization of Full-Stack Digital Twin Codebase

## Context
The CampusTwin project for SOA IDEATHON 2026 Problem Statement S18 initially consisted of an unorganized root directory combining a Single-Page HTML/CSS/JS frontend dashboard with a Django REST backend and SQLite database.

## Decision
1. Organize the repository into distinct top-level directories:
   * `frontend/`: Dedicated to UI, GIS mapping, Chart visualizations, and dashboard interactions.
   * `backend/`: Dedicated to Django REST Framework APIs, data models, serializers, and calculations.
   * `data/`: Dedicated to raw, processed, and sample spatial datasets and schemas.
   * `docs/`: Dedicated to system architecture, API specifications, and data dictionaries.
   * `scripts/`: Dedicated to local execution automation.
2. Maintain strict zero-logic-modification: preserve all algorithms, simulation factors, calculations, and UI styling exactly as designed.

## Consequences
* Clean, modular, and maintainable project hierarchy.
* Clear boundary between frontend visual client and backend REST services.
* Ready for future integration phases without risk of regression.
