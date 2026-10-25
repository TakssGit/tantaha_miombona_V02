@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Tantsaha_miombona - Application locale

echo.
echo ============================================================
echo        TANTSAHA MIOMBONA - DEMARRAGE LOCAL P28
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Node.js est introuvable.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] npm est introuvable.
  pause
  exit /b 1
)

if not exist "server\node_modules\.bin\tsx.cmd" (
  echo [ERREUR] Les dependances serveur sont absentes.
  echo Installez-les ou recopiez le dossier node_modules du PC de developpement.
  pause
  exit /b 1
)

if not exist "client\node_modules" (
  echo [ERREUR] Les dependances client sont absentes.
  pause
  exit /b 1
)

echo [1/4] Mise a niveau de la base SQLite...
if not exist "server\data\tantsaha_miombona.db" (
  echo Base absente : creation + donnees initiales.
  call npm run db:setup
) else (
  call npm run db:migrate
)

if errorlevel 1 (
  echo.
  echo [ERREUR] Migration / initialisation de la base impossible.
  pause
  exit /b 1
)

echo.
echo [2/4] Verification du frontend...
if not exist "client\dist\index.html" (
  echo Construction de la version P28...
  call npm run build:client
  if errorlevel 1 (
    echo.
    echo [ERREUR] Build frontend impossible.
    pause
    exit /b 1
  )
) else (
  echo Build frontend deja present.
)

echo.
echo [3/4] Demarrage du serveur...
powershell -NoProfile -Command "$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  start "Tantsaha Backend" cmd /k "cd /d ""%~dp0"" && npm run start --prefix server"
) else (
  echo Le port 3000 est deja utilise. Aucun deuxieme serveur n'est lance.
)

echo.
echo [4/4] Ouverture de l'application...
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:3000/"

echo.
echo ============================================================
echo Application : http://127.0.0.1:3000/
echo API         : http://127.0.0.1:3000/api
echo ============================================================
echo.
echo Pour arreter l'application, fermez la fenetre Tantsaha Backend.
echo.
pause
endlocal
