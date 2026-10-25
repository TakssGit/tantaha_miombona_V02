# ASCII-only script for Windows PowerShell 5.1.
$ErrorActionPreference = 'Stop'
$PatchDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Project = Split-Path -Parent (Split-Path -Parent $PatchDir)
$Client = Join-Path $Project 'client'
$Date = Get-Date -Format 'yyyyMMdd-HHmmss'
$Report = Join-Path $PatchDir ("RESULTAT_PATCH_11B_{0}.txt" -f $Date)
$UTF8 = New-Object System.Text.UTF8Encoding($false)
$Log = New-Object System.Collections.Generic.List[string]
function Add-Log([string] $Line) {
  [void]$Log.Add($Line)
  Write-Host $Line
  [System.IO.File]::WriteAllLines($Report, $Log.ToArray(), $UTF8)
}
function Run-Capture([string]$Exe, [string]$Args, [string]$WorkingDir) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $Exe
  $psi.Arguments = $Args
  $psi.WorkingDirectory = $WorkingDir
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $psi
  [void]$p.Start()
  $out = $p.StandardOutput.ReadToEnd()
  $err = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  if ($out) { Add-Log ('STDOUT: ' + $out.TrimEnd()) }
  if ($err) { Add-Log ('STDERR (warnings possible): ' + $err.TrimEnd()) }
  return [int]$p.ExitCode
}
Add-Log 'TANTSAHA MIOMBONA V02 - PATCH 11B: CORRECTION BUILD ET OUVERTURE LOCALE'
Add-Log ('PROJET: ' + $Project)
Add-Log 'GIT: AUCUNE COMMANDE GIT; AUCUN PUSH'
try {
  if (!(Test-Path -LiteralPath (Join-Path $Client 'package.json'))) { throw 'Projet incorrect: client/package.json introuvable.' }
  $About = Join-Path $Client 'src\pages\AboutPage.tsx'
  $Home = Join-Path $Client 'src\pages\HomePage.tsx'
  $Router = Join-Path $Client 'src\router\index.tsx'
  if (!(Test-Path -LiteralPath $About)) { throw 'PATCH 11 non applique: AboutPage.tsx absent. Ne pas continuer.' }
  $RouterText = [System.IO.File]::ReadAllText($Router)
  if (!$RouterText.Contains('/a-propos')) { throw 'Route /a-propos absente. Ne pas continuer.' }
  $HomeText = [System.IO.File]::ReadAllText($Home)
  if (!$HomeText.Contains('/a-propos')) { throw 'Lien vers /a-propos absent de HomePage.tsx.' }
  Add-Log 'CONTROLE SOURCES: OK - PATCH 11 DEJA APPLIQUE'
  Add-Log 'CONTROLE ENCODAGE: les fichiers applicatifs ne sont pas modifies'
  Add-Log 'BUILD: DEBUT - sortie stderr traitee comme avertissement, pas comme echec'
  $BuildCode = Run-Capture 'cmd.exe' '/d /s /c "npm.cmd run build -- --base=/tantaha_miombona_V02/"' $Client
  Add-Log ('BUILD_CODE_RETOUR: ' + $BuildCode)
  if ($BuildCode -ne 0) { throw ('BUILD: ECHEC CODE ' + $BuildCode) }
  $Index = Join-Path $Client 'dist\index.html'
  if (!(Test-Path -LiteralPath $Index)) { throw 'Build sans client/dist/index.html' }
  Add-Log 'BUILD: SUCCES'
  $PortOccupied = $false
  try {
    $probe = New-Object System.Net.Sockets.TcpClient
    $conn = $probe.BeginConnect('127.0.0.1', 5173, $null, $null)
    $PortOccupied = $conn.AsyncWaitHandle.WaitOne(500)
    if ($PortOccupied) { try { $probe.EndConnect($conn) } catch {} }
    $probe.Close()
  } catch {}
  if ($PortOccupied) {
    Add-Log 'PORT_5173: OCCUPE - serveur existant conserve (aucun processus externe arrete)'
  } else {
    Add-Log 'PORT_5173: LIBRE - demarrage de Vite'
    $StartArgs = '/k "npm.cmd run dev -- --host 127.0.0.1 --port 5173"'
    Start-Process -FilePath 'cmd.exe' -ArgumentList $StartArgs -WorkingDirectory $Client | Out-Null
  }
  $Live = $false
  for ($i = 0; $i -lt 20; $i++) {
    try {
      $resp = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/a-propos' -UseBasicParsing -TimeoutSec 2
      if ($resp.StatusCode -eq 200) { $Live = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
  }
  if (!$Live) { throw 'Apercu non accessible a http://127.0.0.1:5173/a-propos. Consulter console Vite.' }
  $Url = 'http://localhost:5173/a-propos'
  Start-Process $Url | Out-Null
  Add-Log ('APERCU_LOCAL: ' + $Url)
  Add-Log 'RESULTAT_FINAL: SUCCES LOCAL - APPLICATION OUVERTE - PUSH MANUEL APRES VALIDATION'
} catch {
  Add-Log ('ERREUR: ' + $_.Exception.Message)
  Add-Log 'RESULTAT_FINAL: ECHEC - AUCUN PUSH'
  exit 1
}
