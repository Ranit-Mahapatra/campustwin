Write-Host "Starting CampusTwin Django Backend Server..." -ForegroundColor Cyan
$repoRoot = Split-Path -Parent $PSScriptRoot
$python = Join-Path $repoRoot "venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    $python = "python"
}
Set-Location -Path (Join-Path $repoRoot "backend")
& $python manage.py runserver 127.0.0.1:8000
