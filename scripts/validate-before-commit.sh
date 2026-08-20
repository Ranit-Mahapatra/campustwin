#!/usr/bin/env bash
# CampusTwin pre-commit validation wrapper
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if command -v powershell.exe >/dev/null 2>&1; then
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$ROOT/scripts/validate-before-commit.ps1"
elif command -v pwsh >/dev/null 2>&1; then
  pwsh -NoProfile -ExecutionPolicy Bypass -File "$ROOT/scripts/validate-before-commit.ps1"
else
  echo "PowerShell required to run validate-before-commit.ps1"
  exit 1
fi
