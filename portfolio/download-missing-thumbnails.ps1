# Download Missing Portfolio Thumbnails
# This script downloads thumbnails for Cadillac and Brixton projects

Write-Host "Downloading missing portfolio thumbnails..." -ForegroundColor Green

# Portfolio images directory
$portfolioDir = "images/portfolio"
if (-not (Test-Path $portfolioDir)) {
    New-Item -ItemType Directory -Path $portfolioDir -Force | Out-Null
    Write-Host "Created directory: $portfolioDir" -ForegroundColor Yellow
}

# Define thumbnails to download
$thumbnails = @(
    @{
        Name = "cadillac-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2025/12/snag_15727fdf.png"
        Description = "CADILLAC IQ DEBUT SPRING STUDIOS"
    },
    @{
        Name = "brixton-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2025/04/bxtn_hww_1.png"
        Description = "BRIXTON ENCINITAS"
    }
)

$successCount = 0
$failCount = 0

foreach ($thumb in $thumbnails) {
    $outputPath = Join-Path $portfolioDir $thumb.Name
    
    Write-Host "`nDownloading: $($thumb.Description)" -ForegroundColor Cyan
    Write-Host "  -> $($thumb.Name)" -ForegroundColor Gray
    
    try {
        # Download the image
        Invoke-WebRequest -Uri $thumb.Url -OutFile $outputPath -ErrorAction Stop
        
        # Check if file was created
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length / 1KB
            Write-Host "  [OK] Downloaded successfully ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
            $successCount++
        }
    }
    catch {
        Write-Host "  [FAIL] Failed to download: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n" + ("=" * 50) -ForegroundColor White
Write-Host "Download complete!" -ForegroundColor Green
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed:  $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host ("=" * 50) -ForegroundColor White

if ($successCount -gt 0) {
    Write-Host "`nThumbnails saved to: $portfolioDir" -ForegroundColor Yellow
    Write-Host "Portfolio now has all 10 projects!" -ForegroundColor Green
}
