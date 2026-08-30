@echo off
echo Starting CampusTwin Django Backend Server...
cd /d "%~dp0\..\backend"
python manage.py runserver 127.0.0.1:8000
