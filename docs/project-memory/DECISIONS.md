# DECISIONS

## 2026-08-20 — Establish Ranit working branch `feat/ranit-backend`
- **Context:** Repository owner / backend lead needs an isolated branch without touching other developers' work.
- **Alternatives:** Commit directly on `main`; reuse another developer's branch.
- **Selected:** Create `feat/ranit-backend` from current `main`.
- **Rationale:** Matches assigned branch; protects `main`; avoids overwriting teammate branches.
- **Consequence:** All Ranit backend/governance work lands on this branch pending PR review.

## 2026-08-20 — Prefer environment-backed Django settings for secrets/flags
- **Context:** `SECRET_KEY` and permissive DEBUG/CORS defaults were hardcoded.
- **Alternatives:** Keep hardcoded demo values; add `python-dotenv` dependency; full production settings module split.
- **Selected:** Read `DJANGO_*` env vars via `os.environ` with safe local defaults; document in `.env.example`.
- **Rationale:** Smallest safe hardening without new dependencies; preserves local startup.
- **Consequence:** Shared/deploys must set env vars; historical secret still in git history.

## 2026-08-20 — Local 12-point validation gate + pre-commit hook
- **Context:** No CI workflows yet; need a commit-time correctness/security gate.
- **Alternatives:** Wait for GitHub Actions only; honor-system commits.
- **Selected:** `scripts/validate-before-commit.ps1` + `.git/hooks/pre-commit`.
- **Rationale:** Enforces truthful PASS/FAIL and project-memory presence before commits.
- **Consequence:** Commits blocked on FAIL; `--no-verify` forbidden unless explicitly authorized.

## 2026-08-20 — Keep frontend HTTP integration out of this backend pass
- **Context:** Frontend embeds data and is owned by Anushka/Ahana.
- **Alternatives:** Immediately rewrite frontend to call Django.
- **Selected:** Verify API contracts + field compatibility only; leave UI ownership untouched.
- **Rationale:** Team ownership boundaries; avoid silent frontend overwrite.
- **Consequence:** Dual data path remains until coordinated integration.

## 2026-08-20 — Classify trends/copilot honestly in project memory
- **Context:** Endpoints exist and return 200, but are not full production intelligence features.
- **Alternatives:** Market as complete AI/sensor twin.
- **Selected:** Trends = EMULATED; Copilot = PARTIAL rule-based.
- **Rationale:** Feature reality check; prevents false confidence.
- **Consequence:** Future work must upgrade or keep labels accurate.
