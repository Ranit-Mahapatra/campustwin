@echo off
cd /d "%~dp0..\backend"
if exist "%~dp0..\venv\Scripts\python.exe" (
  "%~dp0..\venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
) else (
  python manage.py runserver 127.0.0.1:8000
)
