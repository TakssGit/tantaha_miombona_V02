@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0APPLIQUER_PATCH_11B.ps1"
echo.
echo Envoyez RESULTAT_PATCH_11B_*.txt si necessaire.
pause
