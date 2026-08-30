# NEXT STEPS

## Immediate
1. Run `pwsh -File scripts/validate-before-commit.ps1` and capture truthful statuses
2. Intentionally stage reviewed files (no blind `git add .`) and commit only if required checks PASS
3. Push `feat/ranit-backend` only after SSL/remote access is reliable (or via authenticated path)

## Next
- Add GitHub Actions workflow: install deps → `manage.py check` → `manage.py test twin`
- Coordinate with Anushka/Ahana on frontend → API integration plan (preserve contracts)
- Align with Pratik on backend ownership boundaries / shared modules
- Install + authenticate `gh` for PR/security governance
- Re-run `pip-audit` after SSL trust fixed
- Decide auth model for non-demo API exposure
- Team decision on tracked `db.sqlite3` vs fixtures

## Later
- Replace EMULATED trends with persisted time-series
- Upgrade copilot beyond keyword rules (only with explicit scope)
- Branch protections + required checks on `main`
- Dependabot / secret scanning confirmation via GitHub settings

## Blocked
- Remote `git fetch/pull` until ISS-001 (SSL) resolved
- Automated dependency CVE scan until ISS-002 resolved
- Live GitHub security inventory until ISS-006 (`gh`) resolved
