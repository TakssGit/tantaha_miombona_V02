@echo off
setlocal
chcp 65001 >nul
title TANTSAHA MIOMBONA - Creer ZIP V02 propre
cd /d "%~dp0"
if not exist "%~dp0outils_v02\Creer-ZipV02.ps1" (
  echo ERREUR : outils_v02\Creer-ZipV02.ps1 introuvable.
  echo Extraire tout le ZIP dans le dossier racine du projet.
  pause
  exit /b 2
)
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0outils_v02\Creer-ZipV02.ps1"
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" echo La creation du ZIP a echoue. Code : %RC%
pause
exit /b %RC%
