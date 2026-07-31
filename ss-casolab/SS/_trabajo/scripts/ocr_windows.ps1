param(
    [Parameter(Mandatory = $true)]
    [string]$ImagePath
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

$resolvedPath = (Resolve-Path -LiteralPath $ImagePath).Path
$fileOperation = [Windows.Storage.StorageFile]::GetFileFromPathAsync($resolvedPath)
$file = Await-WinRtOperation $fileOperation ([Windows.Storage.StorageFile])

$streamOperation = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
$stream = Await-WinRtOperation $streamOperation ([Windows.Storage.Streams.IRandomAccessStream])

$decoderOperation = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = Await-WinRtOperation $decoderOperation ([Windows.Graphics.Imaging.BitmapDecoder])

$bitmapOperation = $decoder.GetSoftwareBitmapAsync()
$bitmap = Await-WinRtOperation $bitmapOperation ([Windows.Graphics.Imaging.SoftwareBitmap])

$language = [Windows.Globalization.Language]::new("es-ES")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
if ($null -eq $engine) {
    throw "No está disponible el motor OCR es-ES."
}

$ocrOperation = $engine.RecognizeAsync($bitmap)
$result = Await-WinRtOperation $ocrOperation ([Windows.Media.Ocr.OcrResult])
$result.Text

$stream.Dispose()
$bitmap.Dispose()
