$ErrorActionPreference = 'Continue'
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    $Root = Read-Host 'Collez le chemin complet du dossier racine du projet'
}
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    Write-Host 'ERREUR : package.json introuvable.' -ForegroundColor Red
    exit 2
}
$Root = (Resolve-Path -LiteralPath $Root).Path

function Git([string[]]$GitArgs) {
    & git -C $Root @GitArgs
    return $LASTEXITCODE
}
$IsRepo = & git -C $Root rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0 -or $IsRepo -ne 'true') {
    Write-Host 'Ce dossier ne semble pas etre un depot Git valide.' -ForegroundColor Red
    exit 3
}
$Branch = (& git -C $Root branch --show-current 2>$null | Select-Object -First 1).Trim()
if ([string]::IsNullOrWhiteSpace($Branch)) {
    Write-Host 'Aucune branche courante. Creez une branche de publication avant de continuer.' -ForegroundColor Red
    exit 4
}
if ($Branch -in @('main','master')) {
    Write-Host "SECURITE : branche '$Branch' refusee. Ce script ne pousse jamais directement sur main/master." -ForegroundColor Red
    Write-Host 'Creez une branche de travail puis relancez ce BAT.'
    exit 5
}
$Remote = & git -C $Root remote 2>$null
if ($LASTEXITCODE -ne 0 -or -not ($Remote -contains 'origin')) {
    Write-Host 'Remote origin absent. Configurez le depot GitHub avant de continuer.' -ForegroundColor Red
    exit 6
}
$RemoteUrl = (& git -C $Root remote get-url origin 2>$null | Select-Object -First 1)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($RemoteUrl)) {
    Write-Host 'URL du remote origin introuvable. Aucun push effectue.' -ForegroundColor Red
    exit 7
}

Write-Host ''
Write-Host 'TANTSAHA MIOMBONA - PREPARATION GITHUB CONTROLEE' -ForegroundColor Cyan
Write-Host "Branche cible : $Branch"
Write-Host 'Le projet sur disque ne sera pas supprime ni deplace.'
Write-Host 'Le script va nettoyer uniquement l index de staging Git, puis ajouter une liste autorisee.'
Write-Host 'Les fichiers .env reels, bases de donnees, node_modules, logs geants et dossiers patch sont exclus.'
Write-Host ''

$HeadCheck = & git -C $Root rev-parse --verify HEAD 2>$null
if ($LASTEXITCODE -eq 0) {
    & git -C $Root reset --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'Impossible de nettoyer le staging Git. Arret.' -ForegroundColor Red
        exit 8
    }
} else {
    & git -C $Root rm -r --cached --ignore-unmatch . 2>$null | Out-Null
}

$Allowed = @(
    '.gitignore','README.md','DEPLOIEMENT_EN_LIGNE.md','render.yaml',
    'package.json','package-lock.json','.github',
    'client/index.html','client/package.json','client/package-lock.json',
    'client/src','client/public','client/tsconfig.json','client/tsconfig.app.json',
    'client/tsconfig.node.json','client/vite.config.ts',
    'server/.env.example','server/package.json','server/package-lock.json',
    'server/tsconfig.json','server/src','server/scripts',
    'server/data/.gitkeep','server/uploads/.gitkeep','docs',
    'CREER_ZIP_V02.bat','LANCER_APP_MANUELLEMENT.bat',
    'DIAGNOSTIC_ETAT_PROJET.bat','PREPARER_PUSH_GITHUB.bat','LISEZ_MOI_V02.txt',
    'outils_v02'
)
$Added = 0
foreach ($Rel in $Allowed) {
    $Path = Join-Path $Root $Rel
    if (Test-Path -LiteralPath $Path) {
        & git -C $Root add -- $Rel
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Echec git add : $Rel" -ForegroundColor Red
            exit 9
        }
        $Added++
    }
}
if ($Added -eq 0) {
    Write-Host 'Aucun fichier autorise trouve. Aucun commit/push.' -ForegroundColor Red
    exit 10
}

$Staged = @(& git -C $Root diff --cached --name-only 2>$null)
if ($LASTEXITCODE -ne 0 -or $Staged.Count -eq 0) {
    Write-Host 'La liste de staging est vide ou illisible.' -ForegroundColor Red
    exit 11
}
$Problems = New-Object 'System.Collections.Generic.List[string]'
foreach ($Rel in $Staged) {
    $Norm = $Rel -replace '\\','/'
    $Base = [System.IO.Path]::GetFileName($Norm)
    if ($Base -eq '.env') { [void]$Problems.Add("Fichier .env reel : $Rel") }
    if ($Norm -match '(^|/)(node_modules|\.git|git_push_logs|patch)(/|$)') {
        [void]$Problems.Add("Dossier interdit : $Rel")
    }
    if ($Norm -match '^server/data/.*\.(db|sqlite|sqlite3)(-shm|-wal)?$') {
        [void]$Problems.Add("Base de donnees locale : $Rel")
    }
    if ($Norm -match '\.(log|tsbuildinfo)$') {
        [void]$Problems.Add("Fichier genere/log : $Rel")
    }
    $Full = Join-Path $Root ($Norm -replace '/', '\')
    if (Test-Path -LiteralPath $Full -PathType Leaf) {
        $Info = Get-Item -LiteralPath $Full
        if ($Info.Length -ge 90MB) {
            [void]$Problems.Add("Fichier de $([math]::Round($Info.Length/1MB,2)) Mo, trop volumineux : $Rel")
        }
    }
}
if ($Problems.Count -gt 0) {
    Write-Host 'SECURITE : des fichiers interdits ou trop volumineux sont stages.' -ForegroundColor Red
    $Problems | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    Write-Host 'Aucun commit ni push effectue. Corrigez la liste puis relancez.'
    exit 12
}

Write-Host ''
Write-Host 'FICHIERS QUI SERONT PUBLIES :' -ForegroundColor Cyan
$Staged | ForEach-Object { Write-Host " + $_" }
Write-Host ''
Write-Host "Remote : origin (URL configuree localement)"
Write-Host "Branche : $Branch"
Write-Host 'Le script ne publiera pas sur main/master.'
$Confirm = Read-Host 'Pour creer le commit et pousser cette branche, tapez exactement PUBLIER'
if ($Confirm -cne 'PUBLIER') {
    Write-Host 'Annule. Aucun commit ni push effectue. Les fichiers restent stages pour verification.'
    exit 0
}

& git -C $Root diff --cached --check
if ($LASTEXITCODE -ne 0) {
    Write-Host 'git diff --check a detecte des problemes. Corrigez-les avant de publier.' -ForegroundColor Red
    exit 13
}
& git -C $Root commit -m 'Prepare clean Tantsaha Miombona V02'
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Le commit a echoue. Verifiez git user.name, user.email et le message ci-dessus.' -ForegroundColor Red
    Write-Host 'Aucun push effectue.'
    exit 14
}
& git -C $Root push -u origin $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Le commit local existe, mais le push a echoue.' -ForegroundColor Yellow
    Write-Host 'Verifiez la connexion, les droits GitHub et les identifiants. Ne supprimez pas le projet.'
    exit 15
}
Write-Host ''
Write-Host "PUBLICATION TERMINEE sur la branche '$Branch'." -ForegroundColor Green
Write-Host 'Le script n a pas pousse sur main/master.'
