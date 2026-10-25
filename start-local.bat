@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Tantsaha_miombona - Mode developpement

echo.
echo ============================================
echo          TANTSAHA MIOMBONA P28
echo        MODE DEVELOPPEMENT LOCAL
echo ============================================
echo.

echo Mise a niveau SQLite...
if not exist "server\data\tantsaha_miombona.db" (
  call npm run db:setup
) else (
  call npm run db:migrate
)

if errorlevel 1 (
  echo ERREUR BASE DE DONNEES.
  pause
  exit /b 1
)

powershell -NoProfile -Command "$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo Demarrage API...
  start "Tantsaha API" cmd /k "cd /d ""%~dp0"" && npm run dev:server"
) else (
  echo API deja active sur 3000.
)

timeout /t 2 /nobreak >nul

powershell -NoProfile -Command "$p = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo Demarrage interface...
  start "Tantsaha CLIENT" cmd /k "cd /d ""%~dp0"" && npm run dev:client"
) else (
  echo Interface deja active sur 5173.
)

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo.
echo Frontend : http://127.0.0.1:5173/
echo API      : http://127.0.0.1:3000/api
echo.
exit /b 0
