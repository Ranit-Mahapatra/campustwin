# CHANGELOG

## 2026-08-20 — `feat/ranit-backend`
- **Change:** Initial Ranit backend + repository environment pass
- **Reason:** Establish verified working state, security baseline, validation gate, and persistent project memory
- **Includes:**
  - Environment-driven Django settings (`DJANGO_SECRET_KEY`, DEBUG, hosts, CORS)
  - Backend API contract tests for all six endpoints
  - `.gitignore` hardening (secrets + private memory)
  - `scripts/validate-before-commit.ps1` / `.sh`
  - Local pre-commit hook
  - `docs/project-memory/` eight-file memory set
  - Backend launcher scripts prefer local `venv` Python
- **Validation result:** Local gate PASS (exit 0) on commit `ec34e3e` via pre-commit hook. Non-PASS non-blocking items: Integration REQUIRES REVIEW; Dependency scan REQUIRES REVIEW (SSL); Lint NOT CONFIGURED; CI MISSING.
