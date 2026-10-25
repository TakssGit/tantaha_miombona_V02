$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    $Root = Read-Host 'Collez le chemin complet du dossier racine du projet'
}
if (-not (Test-Path -LiteralPath (Join-Path $Root 'package.json'))) {
    Write-Host 'ERREUR : package.json introuvable. Lancez ce BAT depuis la racine du projet.' -ForegroundColor Red
    exit 2
}
$Root = (Resolve-Path -LiteralPath $Root).Path
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$Desktop = [Environment]::GetFolderPath('Desktop')
if (-not $Desktop -or -not (Test-Path $Desktop)) { $Desktop = $env:TEMP }
$ZipPath = Join-Path $Desktop "TANTSAHA_MIOMBONA_V02_SOURCE_PROPRE_$Stamp.zip"
$Stage = Join-Path $env:TEMP "TANTSAHA_V02_STAGE_$Stamp"
New-Item -ItemType Directory -Path $Stage -Force | Out-Null

$ExcludedDirs = @('.git','node_modules','dist','build','coverage','.vite','.next','out','target','.turbo','.cache','git_push_logs','patch')
$Included = 0
$Excluded = 0
$ExcludedSamples = New-Object 'System.Collections.Generic.List[string]'
try {
    $All = Get-ChildItem -LiteralPath $Root -Force -Recurse -File -ErrorAction SilentlyContinue
    foreach ($File in $All) {
        $Rel = $File.FullName.Substring($Root.Length).TrimStart('\')
        $Parts = $Rel -split '\\'
        $Skip = $false

        foreach ($Part in $Parts) {
            if ($ExcludedDirs -contains $Part) { $Skip = $true; break }
        }
        if (-not $Skip) {
            if ($File.Name -eq '.env') { $Skip = $true }
            elseif ($File.Name -like '.env.*' -and $File.Name -ne '.env.example') { $Skip = $true }
            elseif ($File.Name -match '\.(db|sqlite|sqlite3)(-shm|-wal)?$') { $Skip = $true }
            elseif ($File.Name -match '\.(log|tsbuildinfo)$') { $Skip = $true }
            elseif ($File.Name -in @('vite.config.js','vite.config.d.ts')) { $Skip = $true }
            elseif ($Rel -match '^server[\\/]data[\\/]' -and $File.Name -ne '.gitkeep') { $Skip = $true }
            elseif ($Rel -match '^server[\\/]uploads[\\/]' -and $File.Name -ne '.gitkeep') { $Skip = $true }
        }

        if ($Skip) {
            $Excluded++
            if ($ExcludedSamples.Count -lt 20) { [void]$ExcludedSamples.Add($Rel) }
            continue
        }

        $Dest = Join-Path $Stage $Rel
        $Parent = Split-Path -Parent $Dest
        if (-not (Test-Path -LiteralPath $Parent)) { New-Item -ItemType Directory -Path $Parent -Force | Out-Null }
        Copy-Item -LiteralPath $File.FullName -Destination $Dest -Force
        $Included++
    }

    $Manifest = @(
        'TANTSAHA MIOMBONA V02 - SOURCE PROPRE',
        "Date de creation : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
        "Dossier source : $Root",
        "Fichiers inclus : $Included",
        "Fichiers exclus : $Excluded",
        '',
        'Exclusions de securite : .git, node_modules, patch, git_push_logs, builds, .env reels, bases de donnees locales, sauvegardes, logs et fichiers generes.',
        'Le fichier server/.env.example peut etre inclus; aucun contenu de .env reel n est lu.',
        'Cette archive est une copie source; elle ne contient pas les dependances node_modules.'
    )
    $Manifest | Set-Content -LiteralPath (Join-Path $Stage 'COPIE_V02_INFO.txt') -Encoding UTF8

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $Archive = [System.IO.Compression.ZipFile]::Open($ZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        Get-ChildItem -LiteralPath $Stage -Force -Recurse -File | ForEach-Object {
            $Entry = $_.FullName.Substring($Stage.Length).TrimStart('\') -replace '\\','/'
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $Archive, $_.FullName, $Entry, [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    } finally { $Archive.Dispose() }

    Write-Host ''
    Write-Host 'ZIP SOURCE V02 CREE AVEC SUCCES.' -ForegroundColor Green
    Write-Host "Archive : $ZipPath" -ForegroundColor Green
    Write-Host "Fichiers inclus : $Included ; exclus : $Excluded"
    Write-Host 'Le projet original n a pas ete modifie.'
    if ($ExcludedSamples.Count -gt 0) {
        Write-Host 'Exemples de fichiers exclus :' -ForegroundColor Yellow
        $ExcludedSamples | ForEach-Object { Write-Host " - $_" }
    }
    Start-Process explorer.exe -ArgumentList "/select,`"$ZipPath`""
} catch {
    Write-Host "ECHEC de creation du ZIP : $($_.Exception.Message)" -ForegroundColor Red
    if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force -ErrorAction SilentlyContinue }
    exit 1
} finally {
    if (Test-Path -LiteralPath $Stage) { Remove-Item -LiteralPath $Stage -Recurse -Force -ErrorAction SilentlyContinue }
}
