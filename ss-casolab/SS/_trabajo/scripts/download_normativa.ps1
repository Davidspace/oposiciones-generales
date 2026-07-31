$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
$registryPath = (
    Get-ChildItem -LiteralPath $workspace -Recurse -File -Filter "Registro de normativa esencial.json" |
    Select-Object -First 1
).FullName
$targetDir = Join-Path $workspace "05. Normativa\Normas oficiales utilizadas"
$reportPath = Join-Path $workspace "_trabajo\qa\descarga_normativa.json"

if ([string]::IsNullOrWhiteSpace($registryPath) -or -not (Test-Path -LiteralPath $registryPath -PathType Leaf)) {
    throw "No existe el registro de normativa: $registryPath"
}

New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
$registry = Get-Content -Raw -Encoding UTF8 -LiteralPath $registryPath | ConvertFrom-Json
$results = [System.Collections.Generic.List[object]]::new()
$index = 0

foreach ($norm in $registry.normas) {
    $index++
    $safeName = ($norm.short -replace '[<>:"/\\|?*]', ' ' -replace '\s+', ' ').Trim()
    if ($safeName.Length -gt 82) {
        $safeName = $safeName.Substring(0, 82).Trim()
    }
    $fileName = "{0:D2} - {1} - {2}.pdf" -f $index, $safeName, $norm.ref
    $target = Join-Path $targetDir $fileName
    $temp = "$target.part"
    $status = "downloaded"
    $errorText = $null

    try {
        if (Test-Path -LiteralPath $target -PathType Leaf) {
            $existing = Get-Item -LiteralPath $target
            if ($existing.Length -gt 1000) {
                $status = "already_present"
            }
        }
        if ($status -eq "downloaded") {
            Invoke-WebRequest `
                -Uri ([string]$norm.pdf_url) `
                -OutFile $temp `
                -UseBasicParsing `
                -Headers @{ "User-Agent" = "Mozilla/5.0 Codex official-source archiver" }

            $bytes = [System.IO.File]::ReadAllBytes($temp)
            if ($bytes.Length -lt 5 -or $bytes[0] -ne 0x25 -or $bytes[1] -ne 0x50 -or $bytes[2] -ne 0x44 -or $bytes[3] -ne 0x46) {
                throw "La respuesta no contiene un PDF válido."
            }
            Move-Item -LiteralPath $temp -Destination $target -Force
        }
    }
    catch {
        $status = "error"
        $errorText = $_.Exception.Message
        if (Test-Path -LiteralPath $temp -PathType Leaf) {
            Remove-Item -LiteralPath $temp -Force
        }
    }

    $size = 0
    if (Test-Path -LiteralPath $target -PathType Leaf) {
        $size = (Get-Item -LiteralPath $target).Length
    }
    $results.Add([pscustomobject]@{
        index = $index
        reference = [string]$norm.ref
        name = [string]$norm.short
        url = [string]$norm.pdf_url
        relative_path = $target.Substring($workspace.Length).TrimStart('\')
        status = $status
        bytes = $size
        error = $errorText
    })
}

$payload = [pscustomobject]@{
    fecha_corte = "2026-07-30"
    total = $results.Count
    correctos = @($results | Where-Object { $_.status -ne "error" }).Count
    errores = @($results | Where-Object { $_.status -eq "error" }).Count
    archivos = $results
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8
$payload | ConvertTo-Json -Depth 4
