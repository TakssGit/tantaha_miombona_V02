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
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$Desktop = [Environment]::GetFolderPath('Desktop')
if (-not $Desktop -or -not (Test-Path $Desktop)) { $Desktop = $env:TEMP }
$Report = Join-Path $Desktop "TANTSAHA_DIAGNOSTIC_$Stamp.txt"
$Lines = New-Object 'System.Collections.Generic.List[string]'
function AddLine([string]$Text='') { [void]$script:Lines.Add($Text) }
function RunCmd([string]$Title,[string]$Exe,[string[]]$Args) {
    AddLine ''
    AddLine "----- $Title -----"
    try {
        $Out = & $Exe @Args 2>&1
        foreach ($Line in $Out) { AddLine ([string]$Line) }
        AddLine "Code retour : $LASTEXITCODE"
    } catch { AddLine "Commande indisponible ou erreur : $($_.Exception.Message)" }
}

AddLine 'TANTSAHA MIOMBONA - DIAGNOSTIC ETAT DU PROJET'
AddLine "Date : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
AddLine "Racine : $Root"
AddLine 'Aucun contenu de .env, aucune cle, aucun mot de passe et aucun token ne sont lus.'
RunCmd 'Windows' 'cmd.exe' @('/c','ver')
RunCmd 'Git version' 'git' @('--version')
RunCmd 'Node version' 'node' @('--version')
RunCmd 'NPM version' 'npm' @('--version')
RunCmd 'Branche Git courante' 'git' @('-C',$Root,'branch','--show-current')
RunCmd 'Etat Git' 'git' @('-C',$Root,'status','-sb')
RunCmd 'Derniers commits' 'git' @('-C',$Root,'log','-5','--oneline','--decorate')
RunCmd 'Noms des remotes (sans URL)' 'git' @('-C',$Root,'remote')
RunCmd 'Branches distantes connues localement' 'git' @('-C',$Root,'branch','-r')

AddLine ''
AddLine '=== DEPENDANCES ==='
foreach ($Rel in @('node_modules','client\node_modules','server\node_modules')) {
    $P = Join-Path $Root $Rel
    AddLine ("{0} : {1}" -f $Rel, $(if (Test-Path -LiteralPath $P) {'present'} else {'absent'}))
}

AddLine ''
AddLine '=== PACKAGE.JSON : SCRIPTS ==='
foreach ($Rel in @('package.json','client\package.json','server\package.json')) {
    $P = Join-Path $Root $Rel
    AddLine ''
    AddLine "Fichier : $Rel"
    if (Test-Path -LiteralPath $P) {
        try {
            $J = Get-Content -LiteralPath $P -Raw | ConvertFrom-Json
            AddLine "name=$($J.name) ; version=$($J.version)"
            if ($J.scripts) { $J.scripts.PSObject.Properties | ForEach-Object { AddLine ("  {0} = {1}" -f $_.Name,$_.Value) } }
        } catch { AddLine "JSON invalide ou illisible : $($_.Exception.Message)" }
    } else { AddLine 'ABSENT' }
}

AddLine ''
AddLine '=== INVENTAIRE DES FICHIERS (DOSSIERS DE DEPENDANCES EXCLUS) ==='
$SkipDirs = @('.git','node_modules','dist','build','coverage','.vite','.next','out','target','.turbo','.cache','patch')
$Files = New-Object 'System.Collections.Generic.List[System.IO.FileInfo]'
$Dirs = New-Object 'System.Collections.Generic.Stack[string]'
$Dirs.Push($Root)
while ($Dirs.Count -gt 0 -and $Files.Count -lt 60000) {
    $Current = $Dirs.Pop()
    foreach ($Item in (Get-ChildItem -LiteralPath $Current -Force -ErrorAction SilentlyContinue)) {
        if ($Item.PSIsContainer) {
            if ($SkipDirs -contains $Item.Name) { continue }
            $Dirs.Push($Item.FullName)
        } else { [void]$Files.Add($Item) }
    }
}
AddLine "Fichiers inspectes (max 60000) : $($Files.Count)"

AddLine ''
AddLine '=== FICHIERS SOURCE VIDES (A EXAMINER) ==='
$Empty = @($Files | Where-Object {
    $_.Length -eq 0 -and $_.Extension -in @('.ts','.tsx','.js','.jsx','.css','.json','.sql','.html')
} | Sort-Object FullName)
if ($Empty.Count -eq 0) { AddLine 'Aucun fichier source vide detecte.' }
foreach ($F in ($Empty | Select-Object -First 200)) {
    AddLine $F.FullName.Substring($Root.Length).TrimStart('\')
}
if ($Empty.Count -gt 200) { AddLine "Liste tronquee : $($Empty.Count) fichiers vides au total." }

AddLine ''
AddLine '=== FICHIERS VOLUMINEUX (50 Mo OU PLUS) ==='
$Large = @($Files | Where-Object { $_.Length -ge 50MB } | Sort-Object Length -Descending)
if ($Large.Count -eq 0) { AddLine 'Aucun fichier de 50 Mo ou plus dans les dossiers inspectes.' }
foreach ($F in ($Large | Select-Object -First 50)) {
    AddLine ("{0,9} Mo | {1}" -f [math]::Round($F.Length/1MB,2),$F.FullName.Substring($Root.Length).TrimStart('\'))
}
$LogDir = Join-Path $Root 'git_push_logs'
if (Test-Path -LiteralPath $LogDir) {
    $LogBytes = (Get-ChildItem -LiteralPath $LogDir -Force -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    if ($null -eq $LogBytes) { $LogBytes = 0 }
    AddLine ("Taille totale git_push_logs : {0} Mo (a exclure de GitHub)" -f [math]::Round($LogBytes/1MB,2))
}

AddLine ''
AddLine '=== FICHIERS ENV : NOMS UNIQUEMENT ==='
$EnvFiles = @($Files | Where-Object { $_.Name -eq '.env' -or $_.Name -like '.env.*' })
if ($EnvFiles.Count -eq 0) { AddLine 'Aucun fichier .env detecte.' }
foreach ($F in $EnvFiles) {
    $Label = if ($F.Name -eq '.env.example') {'MODELE PUBLIC'} else {'FICHIER LOCAL SENSIBLE - NE PAS PUBLIER'}
    AddLine "$Label : $($F.FullName.Substring($Root.Length).TrimStart('\'))"
}

AddLine ''
AddLine '=== DOSSIERS CLES ==='
foreach ($Rel in @('client\src','client\public','server\src','server\src\database\migrations','docs')) {
    $P = Join-Path $Root $Rel
    if (Test-Path -LiteralPath $P) {
        $N = @($Files | Where-Object { $_.FullName.StartsWith($P+'\',[StringComparison]::OrdinalIgnoreCase) })
        AddLine "$Rel : $($N.Count) fichiers"
    } else { AddLine "$Rel : ABSENT" }
}
AddLine ''
AddLine '=== FIN DU DIAGNOSTIC ==='
AddLine 'Ce rapport ne contient pas le contenu des .env ni les URL des remotes.'
$Lines | Set-Content -LiteralPath $Report -Encoding UTF8
Write-Host ''
Write-Host 'Diagnostic termine.' -ForegroundColor Green
Write-Host "Rapport : $Report" -ForegroundColor Green
Start-Process notepad.exe -ArgumentList @($Report)
