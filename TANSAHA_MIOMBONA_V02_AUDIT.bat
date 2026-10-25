@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
set "ROOT=%~dp0"
set "PS1=%TEMP%\tansaha_audit_%RANDOM%%RANDOM%.ps1"
set "PROJECT_ROOT=%ROOT%"
set "PROJECT_NAME=TANSAHA_MIOMBONA_V02"
>"%PS1%" echo $ErrorActionPreference = 'Stop'
>>"%PS1%" echo $root = (Resolve-Path -LiteralPath $env:PROJECT_ROOT).Path.TrimEnd('\')
>>"%PS1%" echo $name = $env:PROJECT_NAME
>>"%PS1%" echo $stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
>>"%PS1%" echo $out = Join-Path $root ('_AUDIT_' + $name + '_' + $stamp)
>>"%PS1%" echo New-Item -ItemType Directory -Path $out -Force ^| Out-Null
>>"%PS1%" echo $excludedDirs = @('node_modules','.git','.next','.nuxt','.output','dist','build','coverage','.cache','.turbo','.venv','venv','__pycache__','.idea','.vscode','vendor','target','.angular','.svelte-kit','.parcel-cache','.yarn','.pnpm-store')
>>"%PS1%" echo $excludedFiles = @('.env','.env.local','.env.development.local','.env.production.local','.env.test.local','id_rsa','id_ed25519','credentials.json','service-account.json')
>>"%PS1%" echo $excludedExt = @('.zip','.7z','.rar','.tar','.gz','.exe','.dll','.pdb','.mp4','.mov','.avi','.mp3','.wav','.pdf','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.otf','.sqlite','.db','.bak','.log','.pem','.p12','.pfx','.key')
>>"%PS1%" echo $textExt = @('.js','.jsx','.ts','.tsx','.json','.jsonc','.html','.css','.scss','.sass','.less','.vue','.svelte','.astro','.py','.php','.java','.kt','.go','.rs','.rb','.sql','.md','.mdx','.txt','.yml','.yaml','.toml','.xml','.ini','.cfg','.properties','.sh','.bat','.cmd','.ps1','.graphql','.gql','.env.example','.dockerignore','.gitignore')
>>"%PS1%" echo $configNames = @('Dockerfile','Makefile','Procfile','LICENSE','README','package.json','package-lock.json','pnpm-lock.yaml','yarn.lock','bun.lockb','vite.config.js','vite.config.ts','next.config.js','next.config.mjs','next.config.ts','tsconfig.json','jsconfig.json','angular.json','composer.json','requirements.txt','pyproject.toml','manage.py','settings.py','gradlew','gradlew.bat')
>>"%PS1%" echo $maxFile = 2MB
>>"%PS1%" echo $maxExcerpt = 12000
>>"%PS1%" echo $all = New-Object 'System.Collections.Generic.List[object]'
>>"%PS1%" echo $stack = New-Object 'System.Collections.Generic.Stack[string]'
>>"%PS1%" echo $stack.Push($root)
>>"%PS1%" echo while ($stack.Count -gt 0) {
>>"%PS1%" echo   $dir = $stack.Pop()
>>"%PS1%" echo   foreach ($f in (Get-ChildItem -LiteralPath $dir -Force -ErrorAction SilentlyContinue)) {
>>"%PS1%" echo     if ($f.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
>>"%PS1%" echo     if ($f.PSIsContainer) { if ($f.FullName -ne $out -and $f.Name -notin $excludedDirs -and $f.Name -notlike '_AUDIT_TANSAHA_MIOMBONA_V02_*') { $stack.Push($f.FullName) }; continue }
>>"%PS1%" echo     $all.Add($f)
>>"%PS1%" echo   }
>>"%PS1%" echo }
>>"%PS1%" echo $paths = $all ^| ForEach-Object { $_.FullName.Substring($root.Length).TrimStart('\') } ^| Sort-Object
>>"%PS1%" echo $paths ^| Set-Content -LiteralPath (Join-Path $out '01_LISTE_FICHIERS_COMPLETE.txt') -Encoding UTF8
>>"%PS1%" echo $dirs = @($all ^| ForEach-Object { Split-Path -Parent ($_.FullName.Substring($root.Length).TrimStart('\')) } ^| Where-Object { $_ -and $_ -ne '.' } ^| Sort-Object -Unique)
>>"%PS1%" echo @('DOSSIERS CONTENANT DES FICHIERS (hors dossiers exclus)', '') + $dirs ^| Set-Content -LiteralPath (Join-Path $out '02_LISTE_DOSSIERS.txt') -Encoding UTF8
>>"%PS1%" echo $keep = New-Object 'System.Collections.Generic.List[object]'
>>"%PS1%" echo $skipped = New-Object 'System.Collections.Generic.List[string]'
>>"%PS1%" echo foreach ($f in $all) {
>>"%PS1%" echo   $rel = $f.FullName.Substring($root.Length).TrimStart('\')
>>"%PS1%" echo   if ($f.Name -in $excludedFiles -or $f.Name -match '^(\.env\..+^|.*\.(pem^|key^|p12^|pfx)$)' -or $f.Extension.ToLowerInvariant() -in $excludedExt -or $f.Length -gt $maxFile) { $skipped.Add($rel); continue }
>>"%PS1%" echo   $keep.Add($f)
>>"%PS1%" echo }
>>"%PS1%" echo $manifest = New-Object 'System.Collections.Generic.List[string]'
>>"%PS1%" echo $manifest.Add('PROJET : ' + $name)
>>"%PS1%" echo $manifest.Add('DATE : ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
>>"%PS1%" echo $manifest.Add('RACINE : ' + $root)
>>"%PS1%" echo $manifest.Add('FICHIERS RECENSES (hors dossiers exclus) : ' + $all.Count)
>>"%PS1%" echo $manifest.Add('FICHIERS DANS ZIP : ' + $keep.Count)
>>"%PS1%" echo $manifest.Add('FICHIERS EXCLUS (secret / volumineux / binaire) : ' + $skipped.Count)
>>"%PS1%" echo $manifest.Add('DOSSIERS EXCLUS : ' + ($excludedDirs -join ', '))
>>"%PS1%" echo $manifest.Add('NOTE : inventaire filtre; pas une sauvegarde complete du projet.')
>>"%PS1%" echo $manifest ^| Set-Content -LiteralPath (Join-Path $out '00_RAPPORT_PROJET.txt') -Encoding UTF8
>>"%PS1%" echo $skipped ^| Set-Content -LiteralPath (Join-Path $out '03_FICHIERS_EXCLUS.txt') -Encoding UTF8
>>"%PS1%" echo $extract = Join-Path $out '04_EXTRAITS_CONFIG_CODE.txt'
>>"%PS1%" echo $sw = [IO.StreamWriter]::new($extract,$false,[Text.UTF8Encoding]::new($true))
>>"%PS1%" echo try {
>>"%PS1%" echo foreach ($f in $keep) {
>>"%PS1%" echo   if ($f.Extension.ToLowerInvariant() -notin $textExt -and $f.Name -notin $configNames -and $f.Name -notlike '*.config.*') { continue }
>>"%PS1%" echo   if ($f.Name -match '(?i)(secret^|token^|credential^|password^|private)' -or $f.FullName -match '(?i)[\\/](secrets^|private)[\\/]') { continue }
>>"%PS1%" echo   $rel = $f.FullName.Substring($root.Length).TrimStart('\')
>>"%PS1%" echo   try {
>>"%PS1%" echo     $content = [IO.File]::ReadAllText($f.FullName)
>>"%PS1%" echo     if ($content.IndexOf([char]0) -ge 0) { continue }
>>"%PS1%" echo     $content = $content -replace '(?im)(api[_-]?key^|secret^|token^|password^|authorization)(\s*[:=]\s*)[^\r\n]+', '$1$2[MASQUE - VERIFIER LA SOURCE]'
>>"%PS1%" echo     if ($content.Length -gt $maxExcerpt) { $content = $content.Substring(0,$maxExcerpt) + "`r`n[EXTRAIT TRONQUE]" }
>>"%PS1%" echo     $sw.WriteLine("`r`n========== " + $rel + ' ==========')
>>"%PS1%" echo     $sw.WriteLine($content)
>>"%PS1%" echo   } catch { $sw.WriteLine('Erreur lecture : ' + $rel) }
>>"%PS1%" echo }
>>"%PS1%" echo } finally { $sw.Dispose() }
>>"%PS1%" echo $stage = Join-Path $out '_STAGING'
>>"%PS1%" echo New-Item -ItemType Directory -Path $stage -Force ^| Out-Null
>>"%PS1%" echo foreach ($f in $keep) {
>>"%PS1%" echo   $rel = $f.FullName.Substring($root.Length).TrimStart('\')
>>"%PS1%" echo   $dest = Join-Path $stage $rel
>>"%PS1%" echo   New-Item -ItemType Directory -Path (Split-Path -Parent $dest) -Force ^| Out-Null
>>"%PS1%" echo   Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
>>"%PS1%" echo }
>>"%PS1%" echo Get-ChildItem -LiteralPath $out -Filter '*.txt' ^| Copy-Item -Destination $stage -ErrorAction SilentlyContinue
>>"%PS1%" echo $zip = Join-Path $out ($name + '_ETAT_SOURCE_' + $stamp + '.zip')
>>"%PS1%" echo $items = @(Get-ChildItem -LiteralPath $stage -Force)
>>"%PS1%" echo if ($items.Count -gt 0) { Compress-Archive -LiteralPath ($items ^| ForEach-Object FullName) -DestinationPath $zip -CompressionLevel Optimal -Force }
>>"%PS1%" echo Remove-Item -LiteralPath $stage -Recurse -Force
>>"%PS1%" echo Write-Host ('TERMINE : ' + $out) -ForegroundColor Green
>>"%PS1%" echo Write-Host ('ZIP : ' + $zip)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
set "RC=%ERRORLEVEL%"
del /q "%PS1%" 2>nul
if not "%RC%"=="0" echo ERREUR : generation incomplete. Code %RC%.
pause
exit /b %RC%
