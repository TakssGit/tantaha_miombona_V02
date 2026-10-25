@echo off
setlocal EnableExtensions

title Tantsaha_miombona - Preparation DEMO

cd /d "%~dp0"
set "ROOT=%CD%"

echo.
echo ============================================================
echo     TANTSAHA MIOMBONA - MODE PREVISUALISATION / CAPTURES
echo ============================================================
echo.
echo Ce script :
echo   1. verifie Node.js et les dependances locales
echo   2. sauvegarde la base SQLite existante
echo   3. applique les migrations
echo   4. ajoute des donnees DEMO sans supprimer vos donnees
echo   5. affiche le nombre de lignes par table
echo   6. lance l'API et l'interface
echo.

if not exist "%ROOT%\server\package.json" (
    echo [ERREUR] Dossier server introuvable.
    echo Placez ce fichier .bat a la RACINE de Tantsaha_miombona.
    pause
    exit /b 1
)

if not exist "%ROOT%\client\package.json" (
    echo [ERREUR] Dossier client introuvable.
    echo Placez ce fichier .bat a la RACINE de Tantsaha_miombona.
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans PATH.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] npm n'est pas disponible.
    pause
    exit /b 1
)

if not exist "%ROOT%\server\node_modules\.bin\tsx.cmd" (
    echo [ERREUR] tsx local est introuvable dans server\node_modules.
    echo Sur le PC hors ligne, copiez node_modules depuis le PC de developpement.
    pause
    exit /b 1
)

if not exist "%ROOT%\server\scripts\seed-preview.ts" (
    echo [ERREUR] Fichier server\scripts\seed-preview.ts introuvable.
    echo Copiez le fichier fourni avec ce .bat dans server\scripts.
    pause
    exit /b 1
)

echo [1/6] Verification de la base...
if not exist "%ROOT%\server\data" (
    mkdir "%ROOT%\server\data"
)

if exist "%ROOT%\server\data\tantsaha_miombona.db" (
    if not exist "%ROOT%\server\data\backups" (
        mkdir "%ROOT%\server\data\backups"
    )

    for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "STAMP=%%I"

    echo Sauvegarde avant insertion...
    copy /Y "%ROOT%\server\data\tantsaha_miombona.db" "%ROOT%\server\data\backups\tantsaha_avant_preview_%STAMP%.db" >nul

    if errorlevel 1 (
        echo [ERREUR] Impossible de sauvegarder la base.
        pause
        exit /b 1
    )

    echo Sauvegarde OK : server\data\backups\tantsaha_avant_preview_%STAMP%.db
) else (
    echo Nouvelle base : aucune sauvegarde necessaire.
)

echo.
echo [2/6] Application des migrations...
pushd "%ROOT%\server"
call npm run db:migrate
if errorlevel 1 (
    popd
    echo.
    echo [ERREUR] Echec des migrations.
    echo Corrigez la migration avant de continuer.
    pause
    exit /b 1
)
popd

echo.
echo [3/6] Insertion des donnees de previsualisation...
pushd "%ROOT%\server"
call node_modules\.bin\tsx.cmd scripts\seed-preview.ts
if errorlevel 1 (
    popd
    echo.
    echo [ERREUR] Echec de l'insertion des donnees DEMO.
    echo La sauvegarde precedente est conservee dans server\data\backups.
    pause
    exit /b 1
)
popd

echo.
echo [4/6] Typecheck serveur...
pushd "%ROOT%\server"
call npm run typecheck
if errorlevel 1 (
    popd
    echo.
    echo [ERREUR] Typecheck serveur en echec.
    pause
    exit /b 1
)
popd

echo.
echo [5/6] Demarrage de l'application...

powershell -NoProfile -Command ^
  "$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
    start "Tantsaha API" cmd /k "cd /d ""%ROOT%"" && npm run dev:server"
) else (
    echo API deja active sur le port 3000.
)

timeout /t 2 /nobreak >nul

powershell -NoProfile -Command ^
  "$p = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue; if ($p) { exit 0 } else { exit 1 }"
if errorlevel 1 (
    start "Tantsaha CLIENT" cmd /k "cd /d ""%ROOT%"" && npm run dev:client"
) else (
    echo Interface deja active sur le port 5173.
)

echo.
echo [6/6] Ouverture de la previsualisation...
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo.
echo ============================================================
echo PREVISUALISATION PRETE
echo ============================================================
echo URL     : http://127.0.0.1:5173/
echo API     : http://127.0.0.1:3000/api
echo.
echo COMPTE ADMIN (base neuve) :
echo   utilisateur : admin
echo   mot de passe: admin123
echo.
echo COMPTES DEMO :
echo   demo.gestionnaire / Demo2026!
echo   demo.qualite      / Demo2026!
echo   demo.production   / Demo2026!
echo   demo.commercial   / Demo2026!
echo   demo.pointfocal   / Demo2026!
echo   demo.producteur   / Demo2026!
echo   demo.distributeur / Demo2026!
echo.
echo REMARQUE :
echo Le script est concu pour etre relance : il ne doit pas multiplier
echo les donnees DEMO deja presentes.
echo ============================================================
echo.

pause
exit /b 0
