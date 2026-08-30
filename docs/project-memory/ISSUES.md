# ISSUES

## OPEN

### ISS-001 — Machine SSL blocks git remote sync
- **Status:** OPEN
- **Impact:** `git fetch` / `git pull` fail with OpenSSL local issuer certificate error
- **Evidence:** `fatal: unable to access 'https://github.com/Ranit-Mahapatra/campustwin.git/': SSL certificate OpenSSL verify result: unable to get local issuer certificate (20)`
- **Next:** Fix local CA trust / corporate proxy certs; do not disable SSL verification globally

### ISS-002 — Dependency vulnerability audit blocked
- **Status:** OPEN
- **Impact:** `pip-audit` cannot reach PyPI (SSL verify failed)
- **Next:** Re-run `pip-audit -r backend/requirements.txt` after SSL trust is fixed

### ISS-003 — No GitHub Actions CI
- **Status:** OPEN
- **Impact:** No remote required checks for PRs
- **Next:** Add `.github/workflows` for backend test + validation after local gate stabilizes

### ISS-004 — Frontend not integrated with backend API
- **Status:** OPEN
- **Owner note:** Frontend owned by Anushka/Ahana — backend must not silently rewrite UI
- **Impact:** Dual data paths (embedded JS vs SQLite API)
- **Next:** Coordinate HTTP integration using existing serializer field shapes (`treeCover`, etc.)

### ISS-005 — API authentication / authorization missing
- **Status:** OPEN
- **Impact:** Acceptable for local demo; not production-safe
- **Next:** Decide auth model before any shared/public deploy

### ISS-006 — `gh` CLI unavailable on developer machine
- **Status:** OPEN
- **Impact:** Cannot inspect PRs / security settings via GitHub CLI from this session
- **Next:** Install GitHub CLI and authenticate as `Ranit-Mahapatra`

### ISS-007 — Tracked SQLite database in git
- **Status:** OPEN / REQUIRES REVIEW
- **Impact:** Binary DB churn; demo convenience vs hygiene
- **Next:** Team decision — keep seeded DB for demo OR migrate to fixtures/loaddata and ignore `*.sqlite3`

## IN PROGRESS
- None

## BLOCKED
- Remote sync / pip-audit blocked by ISS-001 / ISS-002

## RESOLVED

### ISS-R001 — Missing persistent project memory
- **Original:** `docs/project-memory/` did not exist
- **Resolution:** Created eight mandatory memory files with verified repository state (2026-08-20)
- **Validation:** Project-memory validation check in `scripts/validate-before-commit.ps1`

### ISS-R002 — Empty backend tests
- **Original:** `backend/twin/tests.py` placeholder only; `NO TESTS RAN`
- **Resolution:** Added API contract tests covering all six endpoints + validation/404 paths
- **Validation:** `python manage.py test twin` (run during validation gate)

### ISS-R003 — Hardcoded Django SECRET_KEY in settings
- **Original:** Secret key committed in `settings.py`
- **Resolution:** Settings now read `DJANGO_SECRET_KEY` (and related flags) from environment; `.env.example` updated with placeholders; `.gitignore` hardened
- **Validation:** `manage.py check` + API smoke after settings change
- **Residual risk:** Prior key remains in git history; rotate before any shared deploy
