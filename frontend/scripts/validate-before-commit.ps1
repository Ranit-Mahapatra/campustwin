# CampusTwin Pre-Commit Validation Launcher (PowerShell)
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

Write-Host "Running CampusTwin 12-Gate Validation Suite..." -ForegroundColor Cyan
Set-Location $rootDir
node scripts/validate-before-commit.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Validation Failed! Commit Blocked." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Validation Passed! Safe to Commit." -ForegroundColor Green
    exit 0
}
