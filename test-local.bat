@echo off
setlocal

title Test Tantsaha_miombona

cd /d "%~dp0"

echo.
echo ============================================
echo TEST VERSION LOCALE
echo ============================================
echo.

echo [1/3] Verification TypeScript...
call npm run typecheck

if errorlevel 1 (
    echo.
    echo ECHEC TYPESCRIPT.
    pause
    exit /b 1
)

echo.
echo [2/3] Verification build...
call npm run build

if errorlevel 1 (
    echo.
    echo ECHEC BUILD.
    pause
    exit /b 1
)

echo.
echo [3/3] Tests API...
call npm run test:smoke

if errorlevel 1 (
    echo.
    echo ECHEC TEST API.
    echo Verifiez que le serveur API est lance.
    pause
    exit /b 1
)

echo.
echo ============================================
echo TOUS LES TESTS SONT OK
echo ============================================
echo.

pause
