# Download Portfolio Thumbnails
# This script downloads the best representative image for each project

Write-Host "Downloading portfolio thumbnails..." -ForegroundColor Green

# Create portfolio images directory if it doesn't exist
$portfolioDir = "images/portfolio"
if (-not (Test-Path $portfolioDir)) {
    New-Item -ItemType Directory -Path $portfolioDir -Force | Out-Null
    Write-Host "Created directory: $portfolioDir" -ForegroundColor Yellow
}

# Define thumbnails to download (best image from each project)
$thumbnails = @(
    @{
        Name = "liquid-iv-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2025/11/liv_page-3.png"
        Description = "LIQUID IV GLITCH BODEGA NYC"
    },
    @{
        Name = "elf-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2025/04/snag_84b2043.png"
        Description = "ELF THE MUSICAL"
    },
    @{
        Name = "sunset-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2024/11/snag_4af676c.png"
        Description = "SUNSET BLVD"
    },
    @{
        Name = "hermes-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2024/07/snag_a839ad7.png"
        Description = "Hermès ICE CREAM BENCH"
    },
    @{
        Name = "stereophonic-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2024/06/stereo-pg1.png"
        Description = "STEREOPHONIC"
    },
    @{
        Name = "moroccanoil-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2024/06/mo-pg1.png"
        Description = "MOROCCANOIL"
    },
    @{
        Name = "album-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2024/06/alp-pg2.png"
        Description = "ALBUM LISTENING PARTY"
    },
    @{
        Name = "golfers-thumb.jpg"
        Url = "https://3dnccom.wordpress.com/wp-content/uploads/2025/04/2023-04-28_19-35-51.jpg"
        Description = "THE GOLFERS JOURNAL"
    }
)

$successCount = 0
$failCount = 0

foreach ($thumb in $thumbnails) {
    $outputPath = Join-Path $portfolioDir $thumb.Name
    
    Write-Host "`nDownloading: $($thumb.Description)" -ForegroundColor Cyan
    Write-Host "  → $($thumb.Name)" -ForegroundColor Gray
    
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
    Write-Host "Your portfolio page is ready to view!" -ForegroundColor Green
}
