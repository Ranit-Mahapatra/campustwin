Write-Host "Starting CampusTwin Django Backend Server..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\backend"
python manage.py runserver 127.0.0.1:8000
