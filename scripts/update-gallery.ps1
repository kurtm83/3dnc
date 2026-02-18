# PowerShell script to update gallery.html from youtube-videos.txt
# Usage: .\scripts\update-gallery.ps1

$videoLinksFile = Join-Path $PSScriptRoot "..\youtube-videos.txt"
$galleryFile = Join-Path $PSScriptRoot "..\gallery.html"
$servicesFile = Join-Path $PSScriptRoot "..\services.html"

function Extract-VideoId {
    param([string]$url)
    
    # Handle different YouTube URL formats
    if ($url -match 'youtu\.be/([a-zA-Z0-9_-]+)') {
        return $matches[1]
    }
    if ($url -match 'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)') {
        return $matches[1]
    }
    if ($url -match 'youtube\.com/embed/([a-zA-Z0-9_-]+)') {
        return $matches[1]
    }
    
    return $null
}

function Generate-VideoCard {
    param(
        [string]$videoId,
        [int]$index
    )
    
    return @"
                <!-- Video $($index + 1) -->
                <div class="video-card" data-video-id="$videoId">
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/$videoId?rel=0&loop=1&playlist=$videoId" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <h4 class="video-title">Loading...</h4>
                    <p class="video-description">Loading video details...</p>
                </div>
"@
}

try {
    # Read video links
    if (!(Test-Path $videoLinksFile)) {
        Write-Host "❌ youtube-videos.txt not found" -ForegroundColor Red
        exit 1
    }
    
    $lines = Get-Content $videoLinksFile | Where-Object { 
        $_.Trim() -and !$_.Trim().StartsWith('#') 
    }
    
    $videoIds = @()
    foreach ($line in $lines) {
        $id = Extract-VideoId $line
        if ($id) {
            $videoIds += $id
        }
    }
    
    if ($videoIds.Count -eq 0) {
        Write-Host "❌ No valid YouTube URLs found in youtube-videos.txt" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Found $($videoIds.Count) video(s)" -ForegroundColor Green
    
    # Generate video cards HTML
    $videoCardsHtml = @()
    for ($i = 0; $i -lt $videoIds.Count; $i++) {
        $videoCardsHtml += Generate-VideoCard $videoIds[$i] $i
    }
    $videoCardsHtmlString = $videoCardsHtml -join "`n`n"
    
    # Read gallery.html
    if (!(Test-Path $galleryFile)) {
        Write-Host "❌ gallery.html not found" -ForegroundColor Red
        exit 1
    }
    
    $galleryHtml = Get-Content $galleryFile -Raw
    
    # Find and replace the video-grid section
    $pattern = '(?s)(<div class="video-grid">).*?(</div>\s+</div>\s+</section>\s+<!-- CTA -->)'
    
    if ($galleryHtml -match $pattern) {
        $closingTags = '</div>' + "`n        " + '</div>' + "`n    " + '</section>' + "`n`n    " + '<!-- CTA -->'
        $newContent = '$1' + "`n$videoCardsHtmlString`n            $closingTags"
        $galleryHtml = $galleryHtml -replace $pattern, $newContent
        
        # Write updated gallery.html
        Set-Content -Path $galleryFile -Value $galleryHtml -NoNewline
        
        Write-Host "✓ Gallery updated successfully!" -ForegroundColor Green
        Write-Host "✓ Added $($videoIds.Count) video(s) to gallery.html" -ForegroundColor Green
        
        # Update services.html with playlist of all videos
        $playlist = $videoIds -join ','
        $firstVideoId = $videoIds[0]
        
        if (Test-Path $servicesFile) {
            $servicesHtml = Get-Content $servicesFile -Raw
            
            # Find and replace the iframe src in services.html
            $iframePattern = '<iframe\s+src="https://www\.youtube\.com/embed/[\w-]+"'
            $newIframeSrc = '<iframe src="https://www.youtube.com/embed/' + $firstVideoId + '?autoplay=1' + '&' + 'mute=1' + '&' + 'loop=1' + '&' + 'playlist=' + $playlist + '&' + 'rel=0' + '&' + 'modestbranding=1"'
            
            if ($servicesHtml -match $iframePattern) {
                $servicesHtml = $servicesHtml -replace $iframePattern, $newIframeSrc
                Set-Content -Path $servicesFile -Value $servicesHtml -NoNewline
                Write-Host "✓ Services page playlist updated!" -ForegroundColor Green
            } else {
                Write-Host "⚠ Could not find video iframe in services.html (skipping)" -ForegroundColor Yellow
            }
        }
        
        Write-Host "`nVideo IDs:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $videoIds.Count; $i++) {
            Write-Host "  $($i + 1). $($videoIds[$i])" -ForegroundColor White
        }
    } else {
        Write-Host "❌ Could not find video-grid section in gallery.html" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
