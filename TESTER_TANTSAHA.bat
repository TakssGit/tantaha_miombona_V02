@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Tantsaha_miombona - Tests P20 a P28

echo.
echo ============================================================
echo       TANTSAHA MIOMBONA - TESTS TECHNIQUES P20-P28
echo ============================================================
echo.

echo [1/6] Migrations SQLite...
call npm run db:migrate
if errorlevel 1 goto :error

echo.
echo [2/6] Typecheck serveur...
call npm run typecheck:server
if errorlevel 1 goto :error

echo.
echo [3/6] Typecheck client...
call npm run typecheck:client
if errorlevel 1 goto :error

echo.
echo [4/6] Build serveur...
call npm run build:server
if errorlevel 1 goto :error

echo.
echo [5/6] Build client...
call npm run build:client
if errorlevel 1 goto :error

echo.
echo [6/6] Test API final...
powershell -NoProfile -Command "$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo Demarrage temporaire du backend...
  start "Tantsaha Backend Test" /min cmd /k "cd /d ""%~dp0"" && npm run start --prefix server"
  timeout /t 3 /nobreak >nul
)

call npm run test:final
if errorlevel 1 goto :error

echo.
echo ============================================================
echo TOUS LES TESTS TECHNIQUES AUTOMATIQUES SONT OK.
echo Terminez ensuite la checklist manuelle dans docs\SUIVI_TESTS_P20_P28.md
echo ============================================================
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo ECHEC D'UN TEST.
echo Corrigez cette etape avant de poursuivre.
echo ============================================================
echo.
pause
exit /b 1
