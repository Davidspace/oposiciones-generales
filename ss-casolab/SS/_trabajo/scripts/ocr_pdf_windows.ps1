param(
    [Parameter(Mandatory = $true)]
    [string]$PdfPath,
    [Parameter(Mandatory = $true)]
    [string]$OutputText,
    [int]$Dpi = 180
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.IRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrResult, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

function Await-WinRtOperation {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Operation,
        [Parameter(Mandatory = $true)]
        [type]$ResultType
    )

    $method = [System.WindowsRuntimeSystemExtensions].GetMethods() |
        Where-Object {
            $_.Name -eq "AsTask" -and
            $_.IsGenericMethod -and
            $_.GetParameters().Count -eq 1
        } |
        Select-Object -First 1

    $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
    $task.Wait()
    return $task.Result
}

function Invoke-ImageOcr {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [Windows.Media.Ocr.OcrEngine]$Engine
    )

    $file = Await-WinRtOperation (
        [Windows.Storage.StorageFile]::GetFileFromPathAsync($Path)
    ) ([Windows.Storage.StorageFile])
    $stream = Await-WinRtOperation (
        $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
    ) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Await-WinRtOperation (
        [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
    ) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await-WinRtOperation (
        $decoder.GetSoftwareBitmapAsync()
    ) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await-WinRtOperation (
        $Engine.RecognizeAsync($bitmap)
    ) ([Windows.Media.Ocr.OcrResult])
    $records = foreach ($line in $result.Lines) {
        $words = @($line.Words)
        if ($words.Count -eq 0) {
            continue
        }
        [pscustomobject]@{
            Top = ($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
            Left = ($words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
            Bottom = ($words | ForEach-Object {
                $_.BoundingRect.Y + $_.BoundingRect.Height
            } | Measure-Object -Maximum).Maximum
            Text = $line.Text
        }
    }

    $sorted = @($records | Sort-Object Top, Left)
    $rows = [System.Collections.Generic.List[object]]::new()
    foreach ($record in $sorted) {
        $match = $null
        foreach ($row in $rows) {
            $overlap = [Math]::Min($row.Bottom, $record.Bottom) -
                [Math]::Max($row.Top, $record.Top)
            $height = [Math]::Min(
                $row.Bottom - $row.Top,
                $record.Bottom - $record.Top
            )
            if ($height -gt 0 -and $overlap -ge ($height * 0.45)) {
                $match = $row
                break
            }
        }
        if ($null -eq $match) {
            $rows.Add([pscustomobject]@{
                Top = $record.Top
                Bottom = $record.Bottom
                Parts = [System.Collections.Generic.List[object]]::new()
            })
            $match = $rows[$rows.Count - 1]
        }
        $match.Parts.Add($record)
        $match.Top = [Math]::Min($match.Top, $record.Top)
        $match.Bottom = [Math]::Max($match.Bottom, $record.Bottom)
    }

    $text = (
        $rows |
            Sort-Object Top |
            ForEach-Object {
                ($_.Parts | Sort-Object Left | ForEach-Object { $_.Text }) -join " "
            }
    ) -join [Environment]::NewLine
    $bitmap.Dispose()
    $stream.Dispose()
    return $text
}

$resolvedPdf = (Resolve-Path -LiteralPath $PdfPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath(
    (Join-Path (Get-Location) $OutputText)
)
$outputDirectory = [System.IO.Path]::GetDirectoryName($resolvedOutput)
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$stem = [System.IO.Path]::GetFileNameWithoutExtension($resolvedOutput)
$imageDirectory = Join-Path $outputDirectory ("imagenes_" + $stem)
[System.IO.Directory]::CreateDirectory($imageDirectory) | Out-Null
$imagePrefix = Join-Path $imageDirectory "page"

$poppler = "C:\Users\Alba\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe"
if (-not (Test-Path -LiteralPath $poppler)) {
    throw "No se encuentra pdftoppm en el runtime."
}

& $poppler -r $Dpi -png $resolvedPdf $imagePrefix
if ($LASTEXITCODE -ne 0) {
    throw "pdftoppm terminó con código $LASTEXITCODE."
}

$language = [Windows.Globalization.Language]::new("es-ES")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
if ($null -eq $engine) {
    throw "No está disponible el motor OCR es-ES."
}

$pages = Get-ChildItem -LiteralPath $imageDirectory -Filter "page-*.png" |
    Sort-Object Name
if ($pages.Count -eq 0) {
    throw "No se generaron imágenes para OCR."
}

$builder = [System.Text.StringBuilder]::new()
$index = 0
foreach ($page in $pages) {
    $index++
    [void]$builder.AppendLine("===== PÁGINA $index =====")
    [void]$builder.AppendLine((Invoke-ImageOcr -Path $page.FullName -Engine $engine))
    [void]$builder.AppendLine()
    Write-Progress -Activity "OCR de $([System.IO.Path]::GetFileName($resolvedPdf))" `
        -Status "Página $index de $($pages.Count)" `
        -PercentComplete (($index / $pages.Count) * 100)
}

[System.IO.File]::WriteAllText(
    $resolvedOutput,
    $builder.ToString(),
    [System.Text.UTF8Encoding]::new($false)
)

Write-Output "OCR completado: $resolvedOutput ($($pages.Count) páginas)"
