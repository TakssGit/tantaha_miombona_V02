$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    $Root = Read-Host 'Collez le chemin complet du dossier racine du projet'
}
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    Write-Host 'ERREUR : racine du projet introuvable.' -ForegroundColor Red
    exit 2
}
$Root = (Resolve-Path -LiteralPath $Root).Path
$Client = Join-Path $Root 'client'
$Server = Join-Path $Root 'server'

if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js et npm doivent etre installes et accessibles dans PATH.' -ForegroundColor Red
    exit 3
}
if (-not (Test-Path (Join-Path $Client 'package.json')) -or -not (Test-Path (Join-Path $Server 'package.json'))) {
    Write-Host 'Il manque client/package.json ou server/package.json.' -ForegroundColor Red
    exit 4
}

$MissingDeps = @()
if (-not (Test-Path (Join-Path $Client 'node_modules'))) { $MissingDeps += 'client' }
if (-not (Test-Path (Join-Path $Server 'node_modules'))) { $MissingDeps += 'server' }
if ($MissingDeps.Count -gt 0) {
    Write-Host "Dependances manquantes : $($MissingDeps -join ', ')." -ForegroundColor Yellow
    $Answer = Read-Host 'Voulez-vous lancer npm install pour les dependances manquantes ? (O/N)'
    if ($Answer -notmatch '^(O|o|oui|OUI|Y|y|yes|YES)$') {
        Write-Host 'Lancement annule. Installez les dependances puis relancez ce BAT.'
        exit 5
    }
    foreach ($Part in $MissingDeps) {
        $Folder = Join-Path $Root $Part
        Write-Host "Installation des dependances : $Part"
        & npm install --prefix $Folder
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Echec npm install dans $Part." -ForegroundColor Red
            exit 6
        }
    }
}

$EnvFile = Join-Path $Server '.env'
$EnvExample = Join-Path $Server '.env.example'
if (-not (Test-Path -LiteralPath $EnvFile)) {
    if (Test-Path -LiteralPath $EnvExample) {
        Copy-Item -LiteralPath $EnvExample -Destination $EnvFile
        Write-Host 'Un fichier server\.env a ete cree depuis .env.example.' -ForegroundColor Yellow
        Write-Host 'Verifiez et completez server\.env localement, puis relancez le BAT.'
        Write-Host 'Le contenu de ce fichier ne sera pas affiche ni publie par cet outil.'
        exit 7
    }
    Write-Host 'server\.env est absent et server\.env.example introuvable.' -ForegroundColor Red
    exit 8
}

Write-Host 'Demarrage du serveur API dans une nouvelle fenetre...'
$ServerCmd = '/k cd /d "' + $Root + '" && npm run dev:server'
Start-Process -FilePath $env:ComSpec -ArgumentList $ServerCmd -WorkingDirectory $Root

Write-Host 'Demarrage du client web dans une nouvelle fenetre...'
$ClientCmd = '/k cd /d "' + $Root + '" && npm run dev:client'
Start-Process -FilePath $env:ComSpec -ArgumentList $ClientCmd -WorkingDirectory $Root

Start-Sleep -Seconds 3
Start-Process 'http://localhost:5173'
Write-Host ''
Write-Host 'L application est en cours de lancement.' -ForegroundColor Green
Write-Host 'Client : http://localhost:5173'
Write-Host 'Consultez les deux fenetres de terminal en cas d erreur.'
