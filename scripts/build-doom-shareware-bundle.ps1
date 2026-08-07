param(
  [string]$SourceArchive,
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\public\assets\doom\doom-shareware-1.9.jsdos")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$archiveUrl = "https://www.gamers.org/pub/games/idgames/idstuff/doom/doom19s.zip"
$archiveSha256 = "CACF0142B31CA1AF00796B4A0339E07992AC5F21BC3F81E7532FE1B5E1B486E6"
$wadSha256 = "1D7D43BE501E67D927E415E0B8F3E29C3BF33075E859721816F652A526CAC771"
$exeSha256 = "B8020523561A5AD9706E009A52D61C578F37FAAFD85AC471962308406292CE27"
$tempRoot = [System.IO.Path]::GetFullPath(
  (Join-Path ([System.IO.Path]::GetTempPath()) ("codex-doom-bundle-" + [guid]::NewGuid().ToString("N")))
)
$systemTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())

if (-not $tempRoot.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to use a temporary directory outside the system temp root."
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Assert-FileHash {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Expected
  )

  $actual = (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
  if ($actual -ne $Expected) {
    throw "Hash mismatch for $Path. Expected $Expected, received $actual."
  }
}

function Expand-ZipArchive {
  param(
    [Parameter(Mandatory = $true)][string]$Archive,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  [System.IO.Compression.ZipFile]::ExtractToDirectory($Archive, $Destination)
}

New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

try {
  $downloadedArchive = Join-Path $tempRoot "doom19s.zip"
  if ($SourceArchive) {
    $resolvedSource = (Resolve-Path -LiteralPath $SourceArchive).Path
    Copy-Item -LiteralPath $resolvedSource -Destination $downloadedArchive
  } else {
    Invoke-WebRequest -Uri $archiveUrl -OutFile $downloadedArchive
  }

  Assert-FileHash -Path $downloadedArchive -Expected $archiveSha256

  $installerDirectory = Join-Path $tempRoot "installer"
  New-Item -ItemType Directory -Path $installerDirectory | Out-Null
  Expand-ZipArchive -Archive $downloadedArchive -Destination $installerDirectory

  $combinedArchive = Join-Path $tempRoot "dooms19.zip"
  $combinedStream = [System.IO.File]::Create($combinedArchive)
  try {
    foreach ($partName in @("DOOMS_19.1", "DOOMS_19.2")) {
      $partStream = [System.IO.File]::OpenRead((Join-Path $installerDirectory $partName))
      try {
        $partStream.CopyTo($combinedStream)
      } finally {
        $partStream.Dispose()
      }
    }
  } finally {
    $combinedStream.Dispose()
  }

  $gameDirectory = Join-Path $tempRoot "game"
  New-Item -ItemType Directory -Path $gameDirectory | Out-Null
  Expand-ZipArchive -Archive $combinedArchive -Destination $gameDirectory

  Assert-FileHash -Path (Join-Path $gameDirectory "DOOM1.WAD") -Expected $wadSha256
  Assert-FileHash -Path (Join-Path $gameDirectory "DOOM.EXE") -Expected $exeSha256

  $jsdosDirectory = Join-Path $gameDirectory ".jsdos"
  New-Item -ItemType Directory -Path $jsdosDirectory | Out-Null
  $dosboxConfig = @"
[dosbox]
machine=svga_s3
memsize=16

[cpu]
core=auto
cputype=auto
cycles=max

[mixer]
nosound=false
rate=44100
blocksize=1024
prebuffer=25

[midi]
mpu401=none
mididevice=none

[sblaster]
sbtype=sb16
sbbase=220
irq=7
dma=1
hdma=5
mixer=true
oplmode=auto
oplemu=default
oplrate=44100

[autoexec]
@echo off
mount c .
c:
DOOM.EXE
"@
  [System.IO.File]::WriteAllText(
    (Join-Path $jsdosDirectory "dosbox.conf"),
    $dosboxConfig,
    [System.Text.UTF8Encoding]::new($false)
  )

  $resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
  $outputDirectory = Split-Path -Parent $resolvedOutput
  New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
  if (Test-Path -LiteralPath $resolvedOutput) {
    Remove-Item -LiteralPath $resolvedOutput -Force
  }

  [System.IO.Compression.ZipFile]::CreateFromDirectory(
    $gameDirectory,
    $resolvedOutput,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
  )

  $bundleHash = (Get-FileHash -LiteralPath $resolvedOutput -Algorithm SHA256).Hash
  Write-Output "Created $resolvedOutput"
  Write-Output "Bundle SHA256: $bundleHash"
  Write-Output "Verified DOOM1.WAD SHA256: $wadSha256"
  Write-Output "Verified DOOM.EXE SHA256: $exeSha256"
} finally {
  $resolvedTempRoot = [System.IO.Path]::GetFullPath($tempRoot)
  if (
    $resolvedTempRoot.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase) -and
    $resolvedTempRoot -ne $systemTemp -and
    (Test-Path -LiteralPath $resolvedTempRoot)
  ) {
    Remove-Item -LiteralPath $resolvedTempRoot -Recurse -Force
  }
}
